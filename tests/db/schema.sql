-- Minimal stand-in for the parts of Supabase and the app schema that the tested SQL touches.
-- Only the columns used by the functions under test are here. The real definitions live in supabase/migrations/.
create schema if not exists auth;

do $$ begin create role anon nologin; exception when duplicate_object then null; end $$;
do $$ begin create role authenticated nologin; exception when duplicate_object then null; end $$;
do $$ begin create role service_role nologin; exception when duplicate_object then null; end $$;

create table auth.users (
  id uuid primary key,
  email text,
  created_at timestamptz default now(),
  email_confirmed_at timestamptz,
  last_sign_in_at timestamptz,
  raw_app_meta_data jsonb default '{}'
);

-- Supabase reads the signed-in user's id from the request claims. Tests set it with set_config().
create or replace function auth.uid() returns uuid language sql stable as $$
  select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid
$$;

create table profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  handle text,
  public_name text,
  path_public boolean not null default false,
  weekly_email boolean not null default false,
  last_weekly_email_at timestamptz
);
create table user_paths (user_id uuid primary key, role_slug text, started_at timestamptz default now(), updated_at timestamptz default now());
create table user_skill_status (user_id uuid, skill_slug text, status text, updated_at timestamptz default now(), primary key (user_id, skill_slug));
create table user_progress_events (id bigint generated always as identity primary key, user_id uuid not null, skill_slug text not null, created_at timestamptz not null default now());
create table user_saved_resources (user_id uuid, url text, title text);
create table resource_votes (user_id uuid, url text, skill_slug text, vote int, updated_at timestamptz default now());
create table resource_suggestions (status text);
create table chat_usage (user_id uuid not null, day date not null, messages int not null default 0, primary key (user_id, day));
create table chat_feedback (rating smallint, created_at timestamptz default now());
create table doc_chunks (updated_at timestamptz);
create table contact_messages (status text);
