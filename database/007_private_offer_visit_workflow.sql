-- RoboQuo private multi-buyer price proposals and no-repricing visit flow.
-- Install only after 004/005/006. Never assume this is present in production.
-- Financial settlement is outside RoboQuo in this release.
begin;

create table if not exists public.marketplace_purchase_offers (
 id uuid primary key default gen_random_uuid(),
 listing_id uuid not null references public.seller_listings(id) on delete cascade,
 buyer_id uuid not null references auth.users(id) on delete cascade,
 seller_id uuid not null references auth.users(id) on delete cascade,
 amount numeric(14,2) not null check(amount>0 and amount<=999999999999.99),
 currency text not null check(char_length(currency)=3),
 pickup_terms text not null default 'to_discuss'
   check(pickup_terms in ('buyer_collects','seller_arranges','to_discuss')),
 buyer_note text not null default '' check(char_length(buyer_note)<=800),
 status text not null default 'submitted'
   check(status in ('submitted','selected','visit_scheduled','inspection_passed','completed','cancelled')),
 visit_at timestamptz,
 cancel_reason text check(cancel_reason is null or char_length(btrim(cancel_reason)) between 6 and 500),
 selected_at timestamptz,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 constraint rq_quote_distinct_participants check(buyer_id<>seller_id),
 constraint rq_quote_one_buyer_per_listing unique(listing_id,buyer_id)
);

-- Only one active winning proposal, including completed sales, per listing.
create unique index if not exists rq_quote_single_active_winner
 on public.marketplace_purchase_offers(listing_id)
 where status in ('selected','visit_scheduled','inspection_passed','completed');
create index if not exists rq_quote_seller_feed
 on public.marketplace_purchase_offers(seller_id,created_at desc);
create index if not exists rq_quote_buyer_feed
 on public.marketplace_purchase_offers(buyer_id,created_at desc);

create or replace function public.rq_guard_marketplace_offer()
returns trigger language plpgsql set search_path=public,auth as $$
declare seller_uuid uuid; listing_currency text; listing_status text; actor uuid;
begin
 actor=(select auth.uid());
 if tg_op='INSERT' then
  if actor is null or actor is distinct from new.buyer_id or new.status<>'submitted'
     or new.visit_at is not null or new.selected_at is not null
     or new.cancel_reason is not null then
   raise exception 'Invalid submitted offer';
  end if;
  select owner_id,currency,status into seller_uuid,listing_currency,listing_status
   from public.seller_listings where id=new.listing_id;
  if listing_status is distinct from 'published' or seller_uuid is distinct from new.seller_id
     or new.buyer_id=new.seller_id or new.currency is distinct from listing_currency then
   raise exception 'Listing is not available for offers';
  end if;
  if exists(select 1 from public.marketplace_purchase_offers o
    where o.listing_id=new.listing_id and o.status in ('selected','visit_scheduled','inspection_passed','completed')) then
   raise exception 'Listing has already selected a buyer';
  end if;
  return new;
 end if;

 -- Original price, buyer, seller, listing and pickup terms are never editable.
 if new.id is distinct from old.id or new.listing_id is distinct from old.listing_id
    or new.buyer_id is distinct from old.buyer_id or new.seller_id is distinct from old.seller_id
    or new.amount is distinct from old.amount or new.currency is distinct from old.currency
    or new.pickup_terms is distinct from old.pickup_terms or new.buyer_note is distinct from old.buyer_note
    or new.created_at is distinct from old.created_at then
   raise exception 'Offer price and original terms are immutable';
 end if;
 if new.status is not distinct from old.status then
   raise exception 'A state transition is required';
 end if;
 if new.status='selected' then
   if actor is distinct from old.seller_id or old.status<>'submitted' then raise exception 'Only seller may select an offer'; end if;
   new.selected_at=now();
 elsif new.status='visit_scheduled' then
   if actor is distinct from old.seller_id or old.status<>'selected'
      or new.visit_at is null or new.visit_at<=now() then
     raise exception 'Seller must schedule a future visit after selection';
   end if;
 elsif new.status='inspection_passed' then
   if actor is distinct from old.buyer_id or old.status<>'visit_scheduled' then
     raise exception 'Buyer must confirm on-site inspection';
   end if;
 elsif new.status='completed' then
   if actor is distinct from old.seller_id or old.status<>'inspection_passed' then
     raise exception 'Seller may only record settlement after buyer inspection confirmation';
   end if;
 elsif new.status='cancelled' then
   if actor not in (old.seller_id,old.buyer_id)
      or old.status not in ('selected','visit_scheduled')
      or char_length(btrim(coalesce(new.cancel_reason,'')))<6 then
     raise exception 'Cancellation needs an authorized reason before inspection approval';
   end if;
 else
   raise exception 'Invalid offer status transition';
 end if;
 if new.status<>'visit_scheduled' and new.visit_at is distinct from old.visit_at then
   raise exception 'Visit date may only be changed when scheduling a visit';
 end if;
 if new.status<>'cancelled' and new.cancel_reason is distinct from old.cancel_reason then
   raise exception 'Reason is permitted only when cancelling';
 end if;
 if new.status<>'selected' and new.selected_at is distinct from old.selected_at then
   raise exception 'Selection timestamp is immutable';
 end if;
 new.updated_at=now();
 return new;
end $$;

drop trigger if exists rq_quote_guard on public.marketplace_purchase_offers;
create trigger rq_quote_guard before insert or update on public.marketplace_purchase_offers
 for each row execute function public.rq_guard_marketplace_offer();

alter table public.marketplace_purchase_offers enable row level security;
revoke all on public.marketplace_purchase_offers from anon;
revoke all on public.marketplace_purchase_offers from authenticated;
grant select,insert on public.marketplace_purchase_offers to authenticated;
grant update(status,visit_at,cancel_reason) on public.marketplace_purchase_offers to authenticated;

drop policy if exists "Participants may see their private price proposals" on public.marketplace_purchase_offers;
create policy "Participants may see their private price proposals"
 on public.marketplace_purchase_offers for select to authenticated
 using ((select auth.uid()) in (buyer_id,seller_id));

drop policy if exists "Buyers may submit their own price proposal" on public.marketplace_purchase_offers;
create policy "Buyers may submit their own price proposal"
 on public.marketplace_purchase_offers for insert to authenticated
 with check (
   buyer_id=(select auth.uid()) and status='submitted'
   and exists(select 1 from public.seller_listings l
     where l.id=listing_id and l.owner_id=seller_id and l.status='published'
       and l.currency=currency and l.owner_id<>buyer_id)
 );

drop policy if exists "Participants can update offer workflow only" on public.marketplace_purchase_offers;
create policy "Participants can update offer workflow only"
 on public.marketplace_purchase_offers for update to authenticated
 using ((select auth.uid()) in (buyer_id,seller_id))
 with check ((select auth.uid()) in (buyer_id,seller_id));

notify pgrst,'reload schema';
commit;
