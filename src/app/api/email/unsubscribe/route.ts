// One-click unsubscribe (RFC 8058). Mail apps POST here from the List-Unsubscribe header.
// People clicking the link in the email land on /email/unsubscribe instead, which posts here.
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function POST(req: Request) {
  const token = new URL(req.url).searchParams.get("t") ?? "";
  if (!UUID.test(token)) return Response.json({ ok: false }, { status: 400 });
  const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc/unsubscribe_weekly_email`, {
    method: "POST",
    headers: {
      apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ p_token: token }),
  });
  if (!res.ok) return Response.json({ ok: false }, { status: 502 });
  return Response.json({ ok: true });
}
