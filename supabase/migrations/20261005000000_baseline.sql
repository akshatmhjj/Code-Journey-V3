-- Baseline: schema as it existed in production on 2026-10-06 (before migrations were tracked).
-- Marked as already applied on the remote with `supabase migration repair --status applied 20261005000000`.

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text,
  full_name text,
  avatar_url text,
  created_at timestamp without time zone default now(),
  email text
);

create table if not exists public.notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete cascade,
  title text,
  content text,
  created_at timestamp without time zone default now(),
  updated_at timestamp without time zone default now()
);

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete cascade,
  title text,
  description text,
  status text default 'pending',
  created_at timestamp with time zone,
  updated_at timestamp without time zone default now(),
  priority text
);

create table if not exists public.activity_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete cascade,
  action text,
  entity text,
  entity_id uuid,
  created_at timestamp with time zone default now()
);

alter table public.notes enable row level security;
alter table public.tasks enable row level security;
alter table public.activity_logs enable row level security;

create policy "Allow users to insert their own profile" on public.profiles for insert with check (auth.uid() = id);
create policy "Users can manage their profile" on public.profiles for all using (auth.uid() = id);
create policy "Users can manage their notes" on public.notes for all using (auth.uid() = user_id);
create policy "Users can manage their tasks" on public.tasks for all using (auth.uid() = user_id);
create policy "Users can access their logs" on public.activity_logs for all using (auth.uid() = user_id);
