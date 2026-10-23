-- Removes three tables left from the original app. Checked: no code in src/ or scripts/ reads or writes them.
-- Their policies and indexes are dropped with them.
drop table if exists public.notes;
drop table if exists public.tasks;
drop table if exists public.activity_logs;
