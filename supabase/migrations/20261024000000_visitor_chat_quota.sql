-- Free CJ AI questions for visitors who are not signed in. Counted per visitor, by a salted hash of their IP address.
-- The address itself is never stored. Only the server (service role) can touch this table or call these functions.
create table if not exists public.visitor_chat_usage (
  ip_hash text not null,
  day date not null default (now() at time zone 'utc')::date,
  messages int not null default 0,
  primary key (ip_hash, day)
);
alter table public.visitor_chat_usage enable row level security;
revoke all on public.visitor_chat_usage from public, anon, authenticated;

create or replace function public.consume_visitor_chat_message(p_ip_hash text, daily_limit int)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  used int;
begin
  insert into visitor_chat_usage (ip_hash, day, messages)
  values (p_ip_hash, (now() at time zone 'utc')::date, 1)
  on conflict (ip_hash, day) do update set messages = visitor_chat_usage.messages + 1
  returning messages into used;
  return used <= daily_limit;
end;
$$;

create or replace function public.refund_visitor_chat_message(p_ip_hash text)
returns void
language sql
security definer
set search_path = public
as $$
  update visitor_chat_usage
     set messages = greatest(messages - 1, 0)
   where ip_hash = p_ip_hash
     and day = (now() at time zone 'utc')::date;
$$;

revoke all on function public.consume_visitor_chat_message(text, int) from public, anon, authenticated;
revoke all on function public.refund_visitor_chat_message(text) from public, anon, authenticated;
grant execute on function public.consume_visitor_chat_message(text, int) to service_role;
grant execute on function public.refund_visitor_chat_message(text) to service_role;
