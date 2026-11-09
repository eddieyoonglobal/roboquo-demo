-- Isolated CI PostgreSQL bootstrap: minimal Supabase role/auth/storage shims.
-- This runs ONLY in an ephemeral GitHub Actions PostgreSQL service.
create role anon nologin;
create role authenticated nologin;
create role service_role nologin;
create schema auth;
create schema storage;
create table auth.users (id uuid primary key);
create function auth.uid() returns uuid language sql stable as $$
  select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid
$$;
create function auth.role() returns text language sql stable as $$
  select nullif(current_setting('request.jwt.claim.role',true),'')
$$;
create table storage.buckets (
  id text primary key,
  name text not null,
  public boolean not null default false,
  file_size_limit bigint,
  allowed_mime_types text[]
);
create table storage.objects (
  name text primary key,
  bucket_id text not null references storage.buckets(id)
);
create function storage.foldername(path text) returns text[] language sql immutable as $$
  select string_to_array(path,'/')
$$;
grant usage on schema auth,storage,public to anon,authenticated;
grant select on storage.objects to anon;
grant select,insert,update,delete on storage.objects to authenticated;
insert into auth.users(id) values
  ('11111111-1111-4111-8111-111111111111'),
  ('22222222-2222-4222-8222-222222222222');
