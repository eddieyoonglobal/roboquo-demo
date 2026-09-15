begin;

-- RoboQuo v24.5 seller marketplace
-- Public listing data, private seller contacts, authenticated photo uploads,
-- moderation status and owner-only deletion.

create table if not exists public.seller_listings (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  manufacturer text,
  model text,
  manufacture_year smallint,
  serial_number text,
  country text not null default 'Japan',
  location_text text,
  operating_hours_text text,
  operating_status text not null default 'unknown'
    check (operating_status in ('in_use','stored','unknown')),
  usage_notes text,
  service_history text,
  accessories text[] not null default '{}',
  accessory_notes text,
  dismantling_required boolean not null default false,
  lifting_required boolean not null default false,
  export_available boolean not null default false,
  shipping_mode text not null default 'seller'
    check (shipping_mode in ('seller','buyer')),
  price numeric(14,2),
  currency text not null default 'JPY'
    check (char_length(currency)=3),
  listing_type text not null default 'private_offer'
    check (listing_type in ('fixed','private_offer')),
  seller_company_name text not null,
  declaration_accepted boolean not null default false,
  status text not null default 'draft'
    check (status in ('draft','pending','published','rejected','sold')),
  submitted_at timestamptz,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (manufacture_year is null or manufacture_year between 1900 and 2100),
  check (price is null or price >= 0),
  check (char_length(btrim(seller_company_name)) > 0)
);

create table if not exists public.seller_listing_contacts (
  listing_id uuid primary key references public.seller_listings(id) on delete cascade,
  owner_id uuid not null references auth.users(id) on delete cascade,
  company_name text not null,
  contact_name text not null,
  business_email text not null,
  phone text not null,
  job_title text,
  company_website text,
  preferred_contact text not null default 'email'
    check (preferred_contact in ('email','phone','whatsapp')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (char_length(btrim(company_name)) > 0),
  check (char_length(btrim(contact_name)) > 0),
  check (position('@' in business_email) > 1),
  check (char_length(btrim(phone)) >= 7)
);

create table if not exists public.seller_listing_photos (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.seller_listings(id) on delete cascade,
  owner_id uuid not null references auth.users(id) on delete cascade,
  slot text not null,
  storage_path text not null unique,
  file_name text,
  mime_type text,
  file_size bigint,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  unique (listing_id, slot),
  check (file_size is null or (file_size > 0 and file_size <= 15728640))
);

create index if not exists seller_listings_public_idx
  on public.seller_listings(status, published_at desc);
create index if not exists seller_listings_owner_idx
  on public.seller_listings(owner_id, created_at desc);
create index if not exists seller_listing_photos_listing_idx
  on public.seller_listing_photos(listing_id, sort_order);

create or replace function public.rq_touch_updated_at()
returns trigger
language plpgsql
set search_path=public
as $$
begin
  new.updated_at=now();
  return new;
end;
$$;

drop trigger if exists rq_seller_listings_touch on public.seller_listings;
create trigger rq_seller_listings_touch
before update on public.seller_listings
for each row execute function public.rq_touch_updated_at();

drop trigger if exists rq_seller_contacts_touch on public.seller_listing_contacts;
create trigger rq_seller_contacts_touch
before update on public.seller_listing_contacts
for each row execute function public.rq_touch_updated_at();

-- A normal authenticated seller may submit or withdraw a listing, but may not
-- mark their own listing as published/rejected. Supabase service-role and the
-- dashboard can still perform moderation.
create or replace function public.rq_guard_seller_listing_status()
returns trigger
language plpgsql
set search_path=public,auth
as $$
begin
  if auth.role()='authenticated' then
    if tg_op='INSERT' then
      if new.owner_id is distinct from auth.uid() or new.status not in ('draft','pending') then
        raise exception 'seller cannot set this owner or listing status';
      end if;
    else
      if new.owner_id is distinct from old.owner_id then
        raise exception 'listing owner cannot be changed';
      end if;
      if new.status is distinct from old.status and not (
        (old.status='draft' and new.status='pending') or
        (old.status='pending' and new.status='draft') or
        (old.status='published' and new.status='sold')
      ) then
        raise exception 'seller cannot perform this status transition';
      end if;
    end if;
  end if;
  if tg_op='INSERT' then
    if new.status='published' and new.published_at is null then new.published_at=now(); end if;
  elsif new.status='published' and old.status is distinct from 'published' and new.published_at is null then
    new.published_at=now();
  end if;
  return new;
end;
$$;

drop trigger if exists rq_seller_listing_status_guard on public.seller_listings;
create trigger rq_seller_listing_status_guard
before insert or update on public.seller_listings
for each row execute function public.rq_guard_seller_listing_status();

alter table public.seller_listings enable row level security;
alter table public.seller_listing_contacts enable row level security;
alter table public.seller_listing_photos enable row level security;

drop policy if exists "published listings or owner can read" on public.seller_listings;
create policy "published listings or owner can read"
on public.seller_listings for select
using (status='published' or owner_id=auth.uid());

drop policy if exists "owner can create listing" on public.seller_listings;
create policy "owner can create listing"
on public.seller_listings for insert to authenticated
with check (owner_id=auth.uid() and status in ('draft','pending'));

drop policy if exists "owner can update listing" on public.seller_listings;
create policy "owner can update listing"
on public.seller_listings for update to authenticated
using (owner_id=auth.uid())
with check (owner_id=auth.uid());

drop policy if exists "owner can delete listing" on public.seller_listings;
create policy "owner can delete listing"
on public.seller_listings for delete to authenticated
using (owner_id=auth.uid());

drop policy if exists "owner can read contact" on public.seller_listing_contacts;
create policy "owner can read contact"
on public.seller_listing_contacts for select to authenticated
using (owner_id=auth.uid());

drop policy if exists "owner can create contact" on public.seller_listing_contacts;
create policy "owner can create contact"
on public.seller_listing_contacts for insert to authenticated
with check (
  owner_id=auth.uid() and exists (
    select 1 from public.seller_listings l
    where l.id=listing_id and l.owner_id=auth.uid()
  )
);

drop policy if exists "owner can update contact" on public.seller_listing_contacts;
create policy "owner can update contact"
on public.seller_listing_contacts for update to authenticated
using (owner_id=auth.uid())
with check (owner_id=auth.uid());

drop policy if exists "owner can delete contact" on public.seller_listing_contacts;
create policy "owner can delete contact"
on public.seller_listing_contacts for delete to authenticated
using (owner_id=auth.uid());

drop policy if exists "published photos or owner can read" on public.seller_listing_photos;
create policy "published photos or owner can read"
on public.seller_listing_photos for select
using (
  owner_id=auth.uid() or exists (
    select 1 from public.seller_listings l
    where l.id=listing_id and l.status='published'
  )
);

drop policy if exists "owner can create photo row" on public.seller_listing_photos;
create policy "owner can create photo row"
on public.seller_listing_photos for insert to authenticated
with check (
  owner_id=auth.uid() and exists (
    select 1 from public.seller_listings l
    where l.id=listing_id and l.owner_id=auth.uid()
  )
);

drop policy if exists "owner can update photo row" on public.seller_listing_photos;
create policy "owner can update photo row"
on public.seller_listing_photos for update to authenticated
using (owner_id=auth.uid())
with check (owner_id=auth.uid());

drop policy if exists "owner can delete photo row" on public.seller_listing_photos;
create policy "owner can delete photo row"
on public.seller_listing_photos for delete to authenticated
using (owner_id=auth.uid());

revoke all on public.seller_listing_contacts from anon;
revoke all on public.seller_listings from anon;
revoke all on public.seller_listing_photos from anon;
grant select (
  id,manufacturer,model,manufacture_year,country,location_text,
  operating_hours_text,operating_status,usage_notes,service_history,
  accessories,accessory_notes,dismantling_required,lifting_required,
  export_available,shipping_mode,price,currency,listing_type,
  seller_company_name,status,published_at,created_at,updated_at
) on public.seller_listings to anon;
grant select (id,listing_id,slot,storage_path,sort_order,created_at)
  on public.seller_listing_photos to anon;
grant select,insert,update,delete on public.seller_listings to authenticated;
grant select,insert,update,delete on public.seller_listing_contacts to authenticated;
grant select,insert,update,delete on public.seller_listing_photos to authenticated;

insert into storage.buckets (id,name,public,file_size_limit,allowed_mime_types)
values (
  'listing-photos',
  'listing-photos',
  false,
  15728640,
  array['image/jpeg','image/png','image/webp','image/heic','image/heif']
)
on conflict (id) do update set
  public=excluded.public,
  file_size_limit=excluded.file_size_limit,
  allowed_mime_types=excluded.allowed_mime_types;

drop policy if exists "listing photo owner can upload" on storage.objects;
create policy "listing photo owner can upload"
on storage.objects for insert to authenticated
with check (
  bucket_id='listing-photos' and
  (storage.foldername(name))[1]=auth.uid()::text
);

drop policy if exists "published listing photo or owner can read" on storage.objects;
create policy "published listing photo or owner can read"
on storage.objects for select
using (
  bucket_id='listing-photos' and (
    (storage.foldername(name))[1]=auth.uid()::text or exists (
      select 1
      from public.seller_listing_photos p
      join public.seller_listings l on l.id=p.listing_id
      where p.storage_path=storage.objects.name and l.status='published'
    )
  )
);

drop policy if exists "listing photo owner can update" on storage.objects;
create policy "listing photo owner can update"
on storage.objects for update to authenticated
using (
  bucket_id='listing-photos' and
  (storage.foldername(name))[1]=auth.uid()::text
)
with check (
  bucket_id='listing-photos' and
  (storage.foldername(name))[1]=auth.uid()::text
);

drop policy if exists "listing photo owner can delete" on storage.objects;
create policy "listing photo owner can delete"
on storage.objects for delete to authenticated
using (
  bucket_id='listing-photos' and
  (storage.foldername(name))[1]=auth.uid()::text
);

comment on table public.seller_listing_contacts is
  'Private seller contact data. Never include this table in anonymous public listing queries.';
comment on column public.seller_listings.seller_company_name is
  'Public display company name. Contact person, email and phone remain in seller_listing_contacts.';

notify pgrst, 'reload schema';

commit;
