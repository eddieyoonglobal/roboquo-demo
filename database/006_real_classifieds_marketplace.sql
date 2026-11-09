-- RoboQuo real classifieds MVP: robot/part categories, direct seller publishing,
-- and private buyer-to-seller conversations. STAGING FIRST; not applied to production.
begin;

alter table public.seller_listings
  add column if not exists item_category text not null default 'robot',
  add column if not exists item_condition text not null default 'used',
  add column if not exists description_text text;

do $$
begin
 if not exists (select 1 from pg_constraint where conname='rq_seller_item_category_check') then
  alter table public.seller_listings add constraint rq_seller_item_category_check
    check (item_category in ('robot','gripper','controller','vision','part','accessory','other'));
 end if;
 if not exists (select 1 from pg_constraint where conname='rq_seller_item_condition_check') then
  alter table public.seller_listings add constraint rq_seller_item_condition_check
    check (item_condition in ('new','used','refurbished','for_parts'));
 end if;
end $$;

-- Supabase REST's public SELECT requires column grants, even with RLS.
grant select (item_category,item_condition,description_text) on public.seller_listings to anon;
create index if not exists rq_marketplace_category_idx
 on public.seller_listings(item_category,published_at desc) where status='published';

-- Seller listings publish immediately after their details, contact and photo
-- metadata have been uploaded, rather than entering a manual moderation queue.
-- Admin moderation (rejected/sold) stays available via service role/dashboard.
create or replace function public.rq_guard_seller_listing_status()
returns trigger language plpgsql set search_path=public,auth,storage as $$
begin
 if current_user='authenticated' then
  if tg_op='INSERT' then
   if new.owner_id is distinct from auth.uid() or new.status<>'draft' then
    raise exception 'Seller can create draft listings only';
   end if;
  else
   if new.owner_id is distinct from old.owner_id then
    raise exception 'Listing ownership is immutable';
   end if;
   if old.status in ('pending','published','rejected','sold')
      and (to_jsonb(new)-'status'-'updated_at')
          is distinct from (to_jsonb(old)-'status'-'updated_at') then
    raise exception 'To edit a reviewed listing, create a new listing';
   end if;
   if new.status is distinct from old.status and not (
     (old.status='draft' and new.status in ('pending','published')) or
     (old.status='pending' and new.status='draft') or
     (old.status='published' and new.status='sold')
   ) then
    raise exception 'Seller is not allowed to change to this listing status';
   end if;
  end if;
 end if;
 if tg_op='UPDATE' and old.status='draft' and new.status in ('pending','published') then
  if not new.declaration_accepted then raise exception 'Seller declaration is required'; end if;
  if not exists(
    select 1 from public.seller_listing_contacts c
    where c.listing_id=new.id and c.owner_id=new.owner_id
  ) then raise exception 'Seller contact is required'; end if;
  if not exists(
    select 1 from public.seller_listing_photos p
    join storage.objects o on o.bucket_id='listing-photos' and o.name=p.storage_path
    where p.listing_id=new.id and p.owner_id=new.owner_id
  ) then raise exception 'A successfully uploaded photo is required'; end if;
 end if;
 if tg_op='INSERT' then
  if new.status='published' and new.published_at is null then new.published_at=now(); end if;
 elsif new.status='published' and old.status is distinct from 'published'
   and new.published_at is null then new.published_at=now();
 end if;
 return new;
end $$;

create table if not exists public.marketplace_conversations (
 id uuid primary key default gen_random_uuid(),
 listing_id uuid not null references public.seller_listings(id) on delete cascade,
 buyer_id uuid not null references auth.users(id) on delete cascade,
 seller_id uuid not null references auth.users(id) on delete cascade,
 created_at timestamptz not null default now(),
 unique (listing_id,buyer_id),
 check (buyer_id<>seller_id)
);
create index if not exists rq_market_conversations_seller on public.marketplace_conversations(seller_id,created_at desc);
create index if not exists rq_market_conversations_buyer on public.marketplace_conversations(buyer_id,created_at desc);

alter table public.marketplace_conversations enable row level security;
revoke all on public.marketplace_conversations from anon;
grant select,insert on public.marketplace_conversations to authenticated;
drop policy if exists "market participants can read conversations" on public.marketplace_conversations;
create policy "market participants can read conversations"
 on public.marketplace_conversations for select to authenticated
 using (buyer_id=(select auth.uid()) or seller_id=(select auth.uid()));
drop policy if exists "buyer starts conversation on published listing" on public.marketplace_conversations;
create policy "buyer starts conversation on published listing"
 on public.marketplace_conversations for insert to authenticated
 with check (buyer_id=(select auth.uid()) and exists(
  select 1 from public.seller_listings l
  where l.id=listing_id and l.owner_id=seller_id and l.status='published'
 ));

create table if not exists public.marketplace_messages (
 id uuid primary key default gen_random_uuid(),
 conversation_id uuid not null references public.marketplace_conversations(id) on delete cascade,
 sender_id uuid not null references auth.users(id) on delete cascade,
 body text not null check(char_length(btrim(body)) between 1 and 2000),
 created_at timestamptz not null default now()
);
create index if not exists rq_market_messages_thread on public.marketplace_messages(conversation_id,created_at,id);
alter table public.marketplace_messages enable row level security;
revoke all on public.marketplace_messages from anon;
grant select,insert on public.marketplace_messages to authenticated;
drop policy if exists "participants read messages" on public.marketplace_messages;
create policy "participants read messages"
 on public.marketplace_messages for select to authenticated
 using(exists(
  select 1 from public.marketplace_conversations c
  where c.id=conversation_id and ((select auth.uid())=c.buyer_id or (select auth.uid())=c.seller_id)
 ));
drop policy if exists "participants send messages" on public.marketplace_messages;
create policy "participants send messages"
 on public.marketplace_messages for insert to authenticated
 with check(sender_id=(select auth.uid()) and exists(
  select 1 from public.marketplace_conversations c
  where c.id=conversation_id and ((select auth.uid())=c.buyer_id or (select auth.uid())=c.seller_id)
 ));

notify pgrst,'reload schema';
commit;
