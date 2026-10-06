-- Supabase grants new functions to anon by default; the message counter is for signed-in users only.
revoke execute on function public.consume_chat_message(int) from anon;
