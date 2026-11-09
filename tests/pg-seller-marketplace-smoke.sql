-- PostgreSQL integration checks for the real seller migration in an ephemeral DB.
-- Never point this file at a production Supabase project.
\set ON_ERROR_STOP on
set client_min_messages = warning;
alter table storage.objects enable row level security;
set role authenticated;
set request.jwt.claim.role='authenticated';
set request.jwt.claim.sub='11111111-1111-4111-8111-111111111111';

insert into public.seller_listings(owner_id,manufacturer,model,seller_company_name,declaration_accepted,status)
values(auth.uid(),'FANUC','CRX smoke test','CI Fixture Seller',true,'draft')
returning id as listing_id \gset

insert into public.seller_listing_contacts(listing_id,owner_id,company_name,contact_name,business_email,phone)
values(:'listing_id'::uuid,auth.uid(),'CI Fixture Seller','Test Contact','ci@example.invalid','1234567890');

insert into public.seller_listing_photos(listing_id,owner_id,slot,storage_path,mime_type,file_size)
values(:'listing_id'::uuid,auth.uid(),'overall',
  '11111111-1111-4111-8111-111111111111/' || :'listing_id' || '/01-overall.jpg','image/jpeg',100);

insert into storage.objects(bucket_id,name)
values('listing-photos','11111111-1111-4111-8111-111111111111/' || :'listing_id' || '/01-overall.jpg');

update public.seller_listings set status='pending' where id=:'listing_id'::uuid;

do $$
declare blocked boolean:=false;
begin
  begin
    update public.seller_listings set status='published' where status='pending' and owner_id=auth.uid();
  exception when others then blocked:=true;
  end;
  if not blocked then raise exception 'FAIL: seller was able to self-publish'; end if;
end $$;

reset role;
set request.jwt.claim.role='service_role';
update public.seller_listings set status='published' where id=:'listing_id'::uuid;

set role anon;
set request.jwt.claim.role='anon';
set request.jwt.claim.sub='';

do $$
begin
  if (select count(*) from public.seller_listings where status='published')<>1 then
    raise exception 'FAIL: published listing must be visible anonymously';
  end if;
  if (select count(*) from public.seller_listing_photos)<>1 then
    raise exception 'FAIL: published photo metadata must be visible anonymously';
  end if;
  if (select count(*) from storage.objects where bucket_id='listing-photos')<>1 then
    raise exception 'FAIL: published listing photo should be readable anonymously';
  end if;
  if has_table_privilege(current_user,'public.seller_listing_contacts','SELECT') then
    raise exception 'FAIL: seller contact table is exposed to anonymous clients';
  end if;
end $$;

reset role;
set role authenticated;
set request.jwt.claim.role='authenticated';
set request.jwt.claim.sub='11111111-1111-4111-8111-111111111111';

-- A published item must not be modified or its photos removed by the seller.
insert into public.seller_listings(owner_id,manufacturer,model,seller_company_name,declaration_accepted,status)
values(auth.uid(),'Test','NO CONTACT / PHOTO','CI Fixture Seller',true,'draft');

do $
declare blocked boolean:=false;
        affected integer:=0;
begin
  begin
    update public.seller_listings set price=999 where owner_id=auth.uid() and status='published';
  exception when others then blocked:=true;
  end;
  if not blocked then raise exception 'FAIL: seller changed approved product details'; end if;

  blocked:=false;
  begin
    update public.seller_listings set status='pending'
      where owner_id=auth.uid() and model='NO CONTACT / PHOTO';
  exception when others then blocked:=true;
  end;
  if not blocked then raise exception 'FAIL: seller submitted without contact/photo'; end if;

  delete from public.seller_listing_photos where owner_id=auth.uid();
  get diagnostics affected=row_count;
  if affected<>0 then raise exception 'FAIL: seller removed reviewed photo metadata'; end if;

  delete from storage.objects where bucket_id='listing-photos';
  get diagnostics affected=row_count;
  if affected<>0 then raise exception 'FAIL: seller removed reviewed photo object'; end if;
end $;

update public.seller_listings set status='sold'
where id=:'listing_id'::uuid and owner_id=auth.uid() and status='published';

reset role;
do $
begin
  if (select public from storage.buckets where id='listing-photos') is distinct from false then
    raise exception 'FAIL: listing-photos bucket must remain private';
  end if;
  if not (select relrowsecurity from pg_class where oid='public.seller_listing_contacts'::regclass) then
    raise exception 'FAIL: seller contact RLS disabled';
  end if;
end $$;
\echo 'PASS PostgreSQL seller migration, owner submission, moderation, published photos, moderation locks and private contact'
