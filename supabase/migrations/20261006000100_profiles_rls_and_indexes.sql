-- profiles had RLS disabled, so the public anon key could read every email and edit any row.
alter table public.profiles enable row level security;

-- Recreate policies with (select auth.uid()) so it is evaluated once per query, not per row.
drop policy if exists "Allow users to insert their own profile" on public.profiles;
drop policy if exists "Users can manage their profile" on public.profiles;
create policy "Users manage own profile" on public.profiles
  for all to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

drop policy if exists "Users can manage their notes" on public.notes;
create policy "Users manage own notes" on public.notes
  for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists "Users can manage their tasks" on public.tasks;
create policy "Users manage own tasks" on public.tasks
  for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists "Users can access their logs" on public.activity_logs;
create policy "Users manage own logs" on public.activity_logs
  for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create index if not exists notes_user_id_idx on public.notes (user_id);
create index if not exists tasks_user_id_idx on public.tasks (user_id);
create index if not exists activity_logs_user_id_idx on public.activity_logs (user_id);
