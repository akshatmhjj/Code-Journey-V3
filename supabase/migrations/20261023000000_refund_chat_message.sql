-- Gives back one chat question when CJ AI fails before it can answer.
-- Pairs with consume_chat_message(): the route consumes first, then refunds if retrieval or generation breaks.
create or replace function public.refund_chat_message()
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  uid uuid := auth.uid();
begin
  if uid is null then
    return;
  end if;
  update chat_usage
     set messages = greatest(messages - 1, 0)
   where user_id = uid
     and day = (now() at time zone 'utc')::date;
end;
$$;

revoke all on function public.refund_chat_message() from public;
revoke execute on function public.refund_chat_message() from anon;
grant execute on function public.refund_chat_message() to authenticated;
