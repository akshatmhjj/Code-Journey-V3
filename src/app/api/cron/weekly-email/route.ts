// Sends the weekly progress email. Vercel Cron calls this once a day (vercel.json); each day
// handles one of seven groups of people, so everyone who opted in gets one email a week.
// Needs: CRON_SECRET, RESEND_API_KEY, EMAIL_FROM, SUPABASE_SERVICE_ROLE_KEY.
// Manual run: GET with `Authorization: Bearer $CRON_SECRET`, optional ?group=0-6 and ?dry=1 (builds, sends nothing).
import { createClient } from "@supabase/supabase-js";
import { getPathIndex } from "@/lib/content";
import { buildWeeklyEmail } from "@/lib/email/weekly";
import type { Statuses } from "@/lib/path";
import { SITE } from "@/lib/site";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

// Resend's free plan allows 100 emails a day; raise this once on a paid plan.
const DAILY_CAP = Number(process.env.WEEKLY_EMAIL_DAILY_CAP ?? 100);
const RESEND_BATCH = 100;

type Row = { user_id: string; email: string; name: string | null; email_token: string; role_slug: string; statuses: Statuses; done_this_week: string[] };

export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) return new Response("Unauthorized", { status: 401 });

  const url = new URL(req.url);
  const dry = url.searchParams.get("dry") === "1";
  const groupParam = url.searchParams.get("group");
  const group = groupParam !== null && /^[0-6]$/.test(groupParam) ? Number(groupParam) : new Date().getUTCDay();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const resendKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  if (!supabaseUrl || !serviceKey || (!dry && (!resendKey || !from))) {
    return Response.json({ error: "Missing configuration", need: ["SUPABASE_SERVICE_ROLE_KEY", "RESEND_API_KEY", "EMAIL_FROM"] }, { status: 500 });
  }

  const db = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });
  const { data, error } = await db.rpc("weekly_email_batch", { p_group: group, p_limit: DAILY_CAP });
  if (error) {
    console.error("weekly email: batch query failed", error);
    return Response.json({ error: "Query failed" }, { status: 500 });
  }

  const index = getPathIndex();
  const site = SITE.url;
  const emails = (data as Row[]).flatMap((r) => {
    const unsubscribeUrl = `${site}/email/unsubscribe?t=${r.email_token}`;
    const built = buildWeeklyEmail(index, {
      name: r.name,
      roleSlug: r.role_slug,
      statuses: r.statuses ?? {},
      doneThisWeek: r.done_this_week ?? [],
      siteUrl: site,
      unsubscribeUrl,
    });
    if (!built) return [];
    return [
      {
        userId: r.user_id,
        payload: {
          from: from ?? "",
          to: [r.email],
          subject: built.subject,
          html: built.html,
          text: built.text,
          headers: {
            "List-Unsubscribe": `<${site}/api/email/unsubscribe?t=${r.email_token}>`,
            "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
          },
        },
      },
    ];
  });

  if (dry) return Response.json({ group, dry: true, wouldSend: emails.length, subjects: emails.slice(0, 5).map((e) => e.payload.subject) });

  let sent = 0;
  const failures: string[] = [];
  for (let i = 0; i < emails.length; i += RESEND_BATCH) {
    const chunk = emails.slice(i, i + RESEND_BATCH);
    const res = await fetch("https://api.resend.com/emails/batch", {
      method: "POST",
      headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
      body: JSON.stringify(chunk.map((e) => e.payload)),
    });
    if (!res.ok) {
      failures.push(`batch ${i / RESEND_BATCH}: ${res.status} ${(await res.text()).slice(0, 200)}`);
      continue;
    }
    // Mark as sent so a retry later today, or tomorrow's group overlap, never doubles up.
    const ids = chunk.map((e) => e.userId);
    const { error: markError } = await db.from("profiles").update({ last_weekly_email_at: new Date().toISOString() }).in("id", ids);
    if (markError) failures.push(`mark sent: ${markError.message}`);
    sent += chunk.length;
  }

  if (failures.length) console.error("weekly email: failures", failures);
  return Response.json({ group, sent, failed: failures.length }, { status: failures.length && !sent ? 502 : 200 });
}
