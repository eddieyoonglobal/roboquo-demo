-- Disposable CI only. Requires 004,005,006,007 and previous real classifieds test.
\set ON_ERROR_STOP on
insert into auth.users(id) values('33333333-3333-4333-8333-333333333333')
 on conflict do nothing;

set role authenticated;
set request.jwt.claim.sub='22222222-2222-4222-8222-222222222222';
insert into public.marketplace_purchase_offers(listing_id,buyer_id,seller_id,currency,amount,pickup_terms,buyer_note)
select id,auth.uid(),owner_id,currency,43000,'buyer_collects','Fixture buyer one quote'
 from public.seller_listings where model='RG2 TEST'
returning id as first_quote \gset

reset role;
set role authenticated;
set request.jwt.claim.sub='33333333-3333-4333-8333-333333333333';
insert into public.marketplace_purchase_offers(listing_id,buyer_id,seller_id,currency,amount,pickup_terms)
select id,auth.uid(),owner_id,currency,47000,'to_discuss'
 from public.seller_listings where model='RG2 TEST'
returning id as second_quote \gset

do $$
begin
 if (select count(*) from public.marketplace_purchase_offers)<>1 then
  raise exception 'FAIL unrelated buyer can read private quotes';
 end if;
end $$;
reset role;
set role authenticated;
set request.jwt.claim.sub='11111111-1111-4111-8111-111111111111';

do $$
begin
 if (select count(*) from public.marketplace_purchase_offers)<>2 then
  raise exception 'FAIL seller cannot compare both buyer proposals';
 end if;
end $$;

update public.marketplace_purchase_offers set status='selected'
 where id=:'second_quote'::uuid and seller_id=auth.uid();
do $$ declare prevented boolean:=false;
begin
 begin
  update public.marketplace_purchase_offers set status='selected'
   where id=(select o.id from public.marketplace_purchase_offers o where o.buyer_id='22222222-2222-4222-8222-222222222222' and o.listing_id=(select l.id from public.seller_listings l where l.model='RG2 TEST'));
 exception when unique_violation then prevented:=true;
 end;
 if not prevented then raise exception 'FAIL two accepted buyer prices for one listing';end if;
end $$;
do $$ declare prevented boolean:=false;
begin
 begin
  update public.marketplace_purchase_offers set amount=40000,status='visit_scheduled',visit_at=now()+interval '2 days'
   where id=(select o.id from public.marketplace_purchase_offers o where o.buyer_id='33333333-3333-4333-8333-333333333333' and o.listing_id=(select l.id from public.seller_listings l where l.model='RG2 TEST'));
 exception when others then prevented:=true;
 end;
 if not prevented then raise exception 'FAIL selected offer amount was negotiable';end if;
end $$;
update public.marketplace_purchase_offers
 set status='visit_scheduled',visit_at=now()+interval '2 days'
 where id=(select o.id from public.marketplace_purchase_offers o where o.buyer_id='33333333-3333-4333-8333-333333333333' and o.listing_id=(select l.id from public.seller_listings l where l.model='RG2 TEST'));

reset role;
set role authenticated;
set request.jwt.claim.sub='33333333-3333-4333-8333-333333333333';
update public.marketplace_purchase_offers
 set status='inspection_passed'
 where id=(select o.id from public.marketplace_purchase_offers o where o.buyer_id='33333333-3333-4333-8333-333333333333' and o.listing_id=(select l.id from public.seller_listings l where l.model='RG2 TEST'));

reset role;
set role authenticated;
set request.jwt.claim.sub='11111111-1111-4111-8111-111111111111';
update public.marketplace_purchase_offers set status='completed'
 where id=(select o.id from public.marketplace_purchase_offers o where o.buyer_id='33333333-3333-4333-8333-333333333333' and o.listing_id=(select l.id from public.seller_listings l where l.model='RG2 TEST'));
do $$ declare prevented boolean:=false;
begin
 begin
  update public.marketplace_purchase_offers set status='selected'
   where id=(select o.id from public.marketplace_purchase_offers o where o.buyer_id='22222222-2222-4222-8222-222222222222' and o.listing_id=(select l.id from public.seller_listings l where l.model='RG2 TEST'));
 exception when unique_violation then prevented:=true;
 end;
 if not prevented then raise exception 'FAIL completed listing could accept another buyer';end if;
 if (select amount from public.marketplace_purchase_offers where id=:'second_quote'::uuid)<>47000 then
  raise exception 'FAIL accepted price changed';
 end if;
end $$;

reset role;
set role anon;
do $$
begin
 if has_table_privilege('anon','public.marketplace_purchase_offers','SELECT') then
  raise exception 'FAIL anonymous user could read buyer quotations';
 end if;
end $$;
reset role;
\echo 'PASS private quote comparison, single award, immutable price, visit confirmation, completed sale, privacy'
