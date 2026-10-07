// The FAQ contact form. Stores the message for the admin inbox; nothing is emailed.
import { createClient } from "@supabase/supabase-js";
import { adminDb, ipHash } from "@/lib/admin";

const TOPICS = ["question", "suggestion", "bug", "partnership", "other"] as const;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PER_HOUR = 5;

export async function POST(req: Request) {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) return Response.json({ error: "The contact form isn't available right now." }, { status: 503 });

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }
  const str = (k: string, max: number) => (typeof body[k] === "string" ? (body[k] as string).trim().slice(0, max) : "");

  // Honeypot: a hidden field people never see. Bots fill it; pretend it worked.
  if (str("website", 200)) return Response.json({ ok: true });

  const name = str("name", 100);
  const email = str("email", 254);
  const topic = TOPICS.includes(str("topic", 20) as (typeof TOPICS)[number]) ? str("topic", 20) : "other";
  const message = str("message", 3000);
  const page = str("page", 300);
  if (!EMAIL.test(email)) return Response.json({ error: "Please enter a valid email address so we can reply." }, { status: 400 });
  if (message.length < 10) return Response.json({ error: "Please write a little more - at least 10 characters." }, { status: 400 });

  const db = adminDb();
  const ip = await ipHash();
  const since = new Date(Date.now() - 3_600_000).toISOString();
  const { count } = await db.from("contact_messages").select("id", { count: "exact", head: true }).eq("ip_hash", ip).gte("created_at", since);
  if ((count ?? 0) >= PER_HOUR) return Response.json({ error: "You've sent a few messages already. Please try again in an hour." }, { status: 429 });

  // Attach the account when the sender is signed in, so replies have context.
  let userId: string | null = null;
  const token = (req.headers.get("authorization") ?? "").replace(/^Bearer\s+/i, "");
  if (token) {
    const anon = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, { auth: { persistSession: false } });
    const { data } = await anon.auth.getUser(token);
    userId = data.user?.id ?? null;
  }

  const { error } = await db.from("contact_messages").insert({ user_id: userId, name: name || null, email, topic, message, page: page || null, ip_hash: ip });
  if (error) {
    console.error("contact: insert failed", error);
    return Response.json({ error: "Couldn't send that. Please try again." }, { status: 500 });
  }
  return Response.json({ ok: true });
}
