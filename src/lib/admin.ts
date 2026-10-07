import "server-only";
import crypto from "node:crypto";
import { cookies, headers } from "next/headers";
import { createClient } from "@supabase/supabase-js";

// The admin dashboard is protected by one password, ADMIN_PASSWORD, set in Vercel.
// Signing in sets an HttpOnly cookie signed with that password, so changing the password signs everyone out.

export const ADMIN_COOKIE = "cj_admin";
const SESSION_DAYS = 7;
const MAX_FAILURES = 8; // per network, per 15 minutes

export function adminConfigured() {
  return !!process.env.ADMIN_PASSWORD && !!process.env.SUPABASE_SERVICE_ROLE_KEY;
}

/** Server-only Supabase client that bypasses row-level security. Never import from client code. */
export function adminDb() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth: { persistSession: false } });
}

const sign = (value: string) => crypto.createHmac("sha256", `cj-admin:${process.env.ADMIN_PASSWORD}`).update(value).digest("base64url");

function safeEqual(a: string, b: string) {
  const ha = crypto.createHash("sha256").update(a).digest();
  const hb = crypto.createHash("sha256").update(b).digest();
  return crypto.timingSafeEqual(ha, hb);
}

/** True when the request carries a valid, unexpired admin session. */
export async function isAdmin() {
  if (!adminConfigured()) return false;
  const raw = (await cookies()).get(ADMIN_COOKIE)?.value ?? "";
  const [exp, sig] = raw.split(".");
  if (!exp || !sig || Number(exp) < Date.now()) return false;
  return safeEqual(sig, sign(exp));
}

/** Throws unless signed in. Every admin server action calls this first. */
export async function requireAdmin() {
  if (!(await isAdmin())) throw new Error("Not signed in");
}

/** A salted hash of the caller's IP: enough to rate-limit, without storing the address. */
export async function ipHash() {
  const h = await headers();
  const ip = (h.get("x-forwarded-for") ?? "").split(",")[0].trim() || h.get("x-real-ip") || "unknown";
  return crypto.createHash("sha256").update(`${process.env.SUPABASE_SERVICE_ROLE_KEY}:${ip}`).digest("hex").slice(0, 32);
}

export type LoginResult = { ok: true } | { ok: false; error: string };

export async function checkPassword(password: string): Promise<LoginResult> {
  if (!adminConfigured()) return { ok: false, error: "The dashboard isn't set up yet. Add ADMIN_PASSWORD in Vercel." };
  const db = adminDb();
  const ip = await ipHash();
  const since = new Date(Date.now() - 15 * 60_000).toISOString();
  const { count } = await db.from("admin_login_failures").select("id", { count: "exact", head: true }).eq("ip_hash", ip).gte("created_at", since);
  if ((count ?? 0) >= MAX_FAILURES) return { ok: false, error: "Too many attempts. Wait 15 minutes and try again." };

  if (!safeEqual(password, process.env.ADMIN_PASSWORD!)) {
    await db.from("admin_login_failures").insert({ ip_hash: ip });
    await new Promise((r) => setTimeout(r, 600)); // slow down guessing
    return { ok: false, error: "That password isn't right." };
  }

  const exp = String(Date.now() + SESSION_DAYS * 86_400_000);
  (await cookies()).set(ADMIN_COOKIE, `${exp}.${sign(exp)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/admin",
    maxAge: SESSION_DAYS * 86_400,
  });
  return { ok: true };
}

export async function signOut() {
  (await cookies()).delete({ name: ADMIN_COOKIE, path: "/admin" });
}
