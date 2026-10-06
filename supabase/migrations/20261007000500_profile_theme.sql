-- Remember each signed-in user's chosen palette and light/dark mode.
alter table public.profiles
  add column if not exists theme text check (theme in ('harbor', 'juniper', 'tangerine', 'orchard')),
  add column if not exists mode text check (mode in ('system', 'light', 'dark'));
