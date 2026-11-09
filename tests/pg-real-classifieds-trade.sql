-- Real classifieds integration tests in disposable CI PostgreSQL only.
-- Requires bootstrap, 004, 005, 006 and seller smoke (not production).
\set ON_ERROR_STOP on
set role authenticated;
set request.jwt.claim.role='authenticated';
set request.jwt.claim.sub='11111111-1111-4111-8111-111111111111';

insert into public.seller_listings(owner_id,manufacturer,model,item_category,item_condition,
  description_text,price,seller_company_name,declaration_accepted,status)
values(auth.uid(),'OnRobot','RG2 TEST','gripper','used',
  'Seller-owned demonstration fixture, stored in CI only',48000,'Fixture Seller',true,'draft')
returning id as classified_id \gset

insert into public.seller_listing_contacts(listing_id,owner_id,company_name,contact_name,business_email,phone)
values(:'classified_id'::uuid,auth.uid(),'Fixture Seller','Seller Name','seller@example.invalid','1234567890');
insert into public.seller_listing_photos(listing_id,owner_id,slot,storage_path,mime_type,file_size)
values(:'classified_id'::uuid,auth.uid(),'overall',
 '11111111-1111-4111-8111-111111111111/'||:'classified_id'||'/01-overall.jpg','image/jpeg',50);
insert into storage.objects(bucket_id,name)
values('listing-photos','11111111-1111-4111-8111-111111111111/'||:'classified_id'||'/01-overall.jpg');

update public.seller_listings
set status='published' where id=:'classified_id'::uuid and owner_id=auth.uid();

do $$
begin
 if (select count(*) from public.seller_listings
     where model='RG2 TEST' and status='published' and item_category='gripper')<>1 then
   raise exception 'FAIL: real gripper listing not published';
 end if;
end $$;

reset role;
set role authenticated;
set request.jwt.claim.role='authenticated';
set request.jwt.claim.sub='22222222-2222-4222-8222-222222222222';
insert into public.marketplace_conversations(listing_id,buyer_id,seller_id)
values(:'classified_id'::uuid,auth.uid(),'11111111-1111-4111-8111-111111111111')
returning id as conversation_id \gset

insert into public.marketplace_messages(conversation_id,sender_id,body)
values(:'conversation_id'::uuid,auth.uid(),'Is this used RG2 gripper available for purchase?');

do $$
declare blocked boolean:=false;
begin
 begin
  insert into public.marketplace_messages(conversation_id,sender_id,body)
  values('00000000-0000-0000-0000-000000000001',auth.uid(),'Not my conversation');
 exception when others then blocked:=true;
 end;
 if not blocked then raise exception 'FAIL: buyer wrote to someone else conversation'; end if;
end $$;

reset role;
set role authenticated;
set request.jwt.claim.role='authenticated';
set request.jwt.claim.sub='11111111-1111-4111-8111-111111111111';
do $$
begin
 if (select count(*) from public.marketplace_messages where conversation_id=:'conversation_id'::uuid)<>1 then
  raise exception 'FAIL: seller cannot see buyer message';
 end if;
end $$;
insert into public.marketplace_messages(conversation_id,sender_id,body)
values(:'conversation_id'::uuid,auth.uid(),'Yes, the gripper is available. Let us discuss shipping.');

reset role;
set role authenticated;
set request.jwt.claim.role='authenticated';
set request.jwt.claim.sub='33333333-3333-4333-8333-333333333333';
do $$
begin
 if (select count(*) from public.marketplace_conversations)>0 then
   raise exception 'FAIL: unrelated user can see conversation';
 end if;
 if (select count(*) from public.marketplace_messages)>0 then
   raise exception 'FAIL: unrelated user can read private messages';
 end if;
end $$;

reset role;
set role authenticated;
set request.jwt.claim.role='authenticated';
set request.jwt.claim.sub='22222222-2222-4222-8222-222222222222';
do $$
begin
 if (select count(*) from public.marketplace_messages where conversation_id=:'conversation_id'::uuid)<>2 then
  raise exception 'FAIL: buyer cannot read seller reply';
 end if;
end $$;

reset role;
set role anon;
do $$
begin
 if has_table_privilege('anon','public.marketplace_conversations','SELECT') then
   raise exception 'FAIL: anonymous conversation permission';
 end if;
 if has_table_privilege('anon','public.marketplace_messages','SELECT') then
   raise exception 'FAIL: anonymous message permission';
 end if;
end $$;
reset role;
\echo 'PASS real gripper direct publication + private buyer/seller chat + outsider isolation'
