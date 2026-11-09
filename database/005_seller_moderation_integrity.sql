begin;

-- Review this forward-only patch in isolated PostgreSQL / staging before production.
-- A seller may edit draft details but cannot silently mutate reviewed records.
create or replace function public.rq_guard_seller_listing_status()
returns trigger
language plpgsql
set search_path=public,auth
as $$
begin
  if current_user='authenticated' then
    if tg_op='INSERT' then
      if new.owner_id is distinct from auth.uid() or new.status<>'draft' then
        raise exception 'Seller may create draft listings only';
      end if;
    else
      if new.owner_id is distinct from old.owner_id then
        raise exception 'Listing owner cannot be changed';
      end if;
      if old.status in ('pending','published','rejected','sold')
         and (to_jsonb(new)-'status'-'updated_at')
             is distinct from (to_jsonb(old)-'status'-'updated_at') then
        raise exception 'Reviewed listing details cannot be changed by sellers';
      end if;
      if new.status is distinct from old.status and not (
        (old.status='draft' and new.status='pending') or
        (old.status='pending' and new.status='draft') or
        (old.status='published' and new.status='sold')
      ) then
        raise exception 'Seller cannot perform this status transition';
      end if;
    end if;
  end if;

  -- Do not accept a seller submission without declarations and actual
  -- accompanying owner-contact and photo metadata in the same transaction.
  if tg_op='UPDATE' and old.status='draft' and new.status='pending' then
    if not new.declaration_accepted then
      raise exception 'Seller declaration must be accepted';
    end if;
    if not exists (
      select 1 from public.seller_listing_contacts c
      where c.listing_id=new.id and c.owner_id=new.owner_id
    ) then
      raise exception 'Seller contact is required before review';
    end if;
    if not exists (
      select 1 from public.seller_listing_photos p
      where p.listing_id=new.id and p.owner_id=new.owner_id
    ) then
      raise exception 'At least one photo is required before review';
    end if;
  end if;

  if tg_op='INSERT' then
    if new.status='published' and new.published_at is null then new.published_at=now(); end if;
  elsif new.status='published' and old.status is distinct from 'published'
    and new.published_at is null then
    new.published_at=now();
  end if;
  return new;
end;
$$;

-- A seller may upload/modify photos only while the listing is still a draft.
-- Approved image content should not be silently replaced after moderation.
drop policy if exists "owner can create photo row" on public.seller_listing_photos;
create policy "owner can create photo row"
on public.seller_listing_photos for insert to authenticated
with check (
  owner_id=auth.uid() and exists (
    select 1 from public.seller_listings l
    where l.id=listing_id and l.owner_id=auth.uid() and l.status='draft'
  )
);

drop policy if exists "owner can update photo row" on public.seller_listing_photos;
create policy "owner can update photo row"
on public.seller_listing_photos for update to authenticated
using (
  owner_id=auth.uid() and exists (
    select 1 from public.seller_listings l
    where l.id=listing_id and l.owner_id=auth.uid() and l.status='draft'
  )
)
with check (
  owner_id=auth.uid() and exists (
    select 1 from public.seller_listings l
    where l.id=listing_id and l.owner_id=auth.uid() and l.status='draft'
  )
);

drop policy if exists "owner can delete photo row" on public.seller_listing_photos;
create policy "owner can delete photo row"
on public.seller_listing_photos for delete to authenticated
using (
  owner_id=auth.uid() and exists (
    select 1 from public.seller_listings l
    where l.id=listing_id and l.owner_id=auth.uid() and l.status='draft'
  )
);

-- The Storage object must reside below the authenticated owner's own
-- currently-draft listing folder: <user-id>/<listing-id>/<photo-file>.
drop policy if exists "listing photo owner can upload" on storage.objects;
create policy "listing photo owner can upload"
on storage.objects for insert to authenticated
with check (
  bucket_id='listing-photos' and
  (storage.foldername(name))[1]=auth.uid()::text and
  exists (
    select 1 from public.seller_listings l
    where l.id::text=(storage.foldername(name))[2]
      and l.owner_id=auth.uid() and l.status='draft'
  )
);

drop policy if exists "listing photo owner can update" on storage.objects;
create policy "listing photo owner can update"
on storage.objects for update to authenticated
using (
  bucket_id='listing-photos' and
  (storage.foldername(name))[1]=auth.uid()::text and
  not exists (
    select 1 from public.seller_listing_photos p
    join public.seller_listings l on l.id=p.listing_id
    where p.storage_path=storage.objects.name and l.status<>'draft'
  )
)
with check (
  bucket_id='listing-photos' and
  (storage.foldername(name))[1]=auth.uid()::text and
  not exists (
    select 1 from public.seller_listing_photos p
    join public.seller_listings l on l.id=p.listing_id
    where p.storage_path=storage.objects.name and l.status<>'draft'
  )
);

drop policy if exists "listing photo owner can delete" on storage.objects;
create policy "listing photo owner can delete"
on storage.objects for delete to authenticated
using (
  bucket_id='listing-photos' and
  (storage.foldername(name))[1]=auth.uid()::text and
  not exists (
    select 1 from public.seller_listing_photos p
    join public.seller_listings l on l.id=p.listing_id
    where p.storage_path=storage.objects.name and l.status<>'draft'
  )
);

notify pgrst,'reload schema';
commit;
