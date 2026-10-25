-- Current definition of weekly_email_batch(). Source of truth for reading; the migrations are what the database runs.
-- tests/db/functions.test.ts fails if this file differs from the latest migration that defines it.
create function public.weekly_email_batch(p_group int, p_limit int default 100)
returns table (
  user_id uuid,
  email text,
  name text,
  email_token uuid,
  role_slug text,
  statuses jsonb,
  done_this_week text[],
  streak int
)
language sql
stable
security definer
set search_path = public
as $$
  select
    p.id,
    u.email::text,
    coalesce(nullif(btrim(p.public_name), ''), nullif(split_part(btrim(p.full_name), ' ', 1), '')),
    p.email_token,
    up.role_slug,
    coalesce((select jsonb_object_agg(s.skill_slug, s.status) from user_skill_status s where s.user_id = p.id), '{}'::jsonb),
    coalesce(
      (select array_agg(s.skill_slug order by s.updated_at)
       from user_skill_status s
       where s.user_id = p.id and s.status = 'done' and s.updated_at > now() - interval '7 days'),
      '{}'
    ),
    streak_weeks(p.id)
  from profiles p
  join auth.users u on u.id = p.id
  join user_paths up on up.user_id = p.id
  where p.weekly_email
    and u.email is not null
    and u.email_confirmed_at is not null
    and mod(abs(hashtext(p.id::text)), 7) = p_group
    and (p.last_weekly_email_at is null or p.last_weekly_email_at < now() - interval '6 days')
  order by p.last_weekly_email_at nulls first, p.id
  limit least(greatest(p_limit, 1), 1000);
$$;
