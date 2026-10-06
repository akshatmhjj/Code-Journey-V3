-- My Path: the route a person is working towards, and where they are with each skill.

-- One active destination per person. Changing it replaces the row; skill progress is kept.
create table if not exists public.user_paths (
  user_id uuid primary key references auth.users (id) on delete cascade,
  role_slug text not null check (role_slug ~ '^[a-z0-9-]{2,60}$'),
  started_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.user_paths enable row level security;
create policy "Users manage own path" on public.user_paths
  for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- A row exists only for skills the person has started. No row means "to do".
create table if not exists public.user_skill_status (
  user_id uuid not null references auth.users (id) on delete cascade,
  skill_slug text not null check (skill_slug ~ '^[a-z0-9-]{2,60}$'),
  status text not null check (status in ('learning', 'done')),
  updated_at timestamptz not null default now(),
  primary key (user_id, skill_slug)
);
alter table public.user_skill_status enable row level security;
create policy "Users manage own skill progress" on public.user_skill_status
  for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create index if not exists user_skill_status_user_idx on public.user_skill_status (user_id, updated_at desc);
