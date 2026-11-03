// Runs the database functions for real, in an in-memory Postgres (PGlite), with no Docker or network.
// The migrations under test are read straight from supabase/migrations/, so the tests check the files that ship.
import { PGlite } from "@electric-sql/pglite";
import { readFileSync } from "node:fs";
import { beforeEach, describe, expect, it } from "vitest";

const migration = (name: string) => readFileSync(new URL(`../../supabase/migrations/${name}`, import.meta.url), "utf8");

/** consume_chat_message is defined in a migration that also creates the vector index, so only its function is taken. */
function consumeChatMessage() {
  const src = migration("20261007000000_cj_ai_rag.sql");
  const start = src.indexOf("create or replace function public.consume_chat_message");
  const open = src.indexOf("$$", start);
  const close = src.indexOf("$$", open + 2);
  return src.slice(start, close + 3);
}

const USER = "11111111-1111-4111-8111-111111111111";
const OTHER = "22222222-2222-4222-8222-222222222222";

let db: PGlite;

beforeEach(async () => {
  db = new PGlite();
  await db.exec(readFileSync(new URL("./schema.sql", import.meta.url), "utf8"));
  await db.exec(consumeChatMessage());
  await db.exec(migration("20261023000000_refund_chat_message.sql"));
  await db.exec(migration("20261023000100_streak_time_zone.sql"));
  await db.exec(migration("20261023000200_admin_stats_limit.sql"));
  await db.exec(migration("20261023000300_drop_unused_tables.sql"));
  await db.exec(migration("20261024000000_visitor_chat_quota.sql"));
  // In the app, a signup trigger creates the profile row (20261006000000_profile_on_signup.sql). Do the same here.
  await db.exec(`
    insert into auth.users (id, email) values ('${USER}', 'a@example.com'), ('${OTHER}', 'b@example.com');
    insert into profiles (id) values ('${USER}'), ('${OTHER}');
  `);
});

/** Signs the next statements in as `uid`, the same way Supabase does for a request. */
async function signInAs(uid: string | null) {
  await db.query("select set_config('request.jwt.claim.sub', $1, false)", [uid ?? ""]);
}

async function usage(uid: string) {
  const { rows } = await db.query<{ messages: number }>("select messages from chat_usage where user_id = $1 and day = (now() at time zone 'utc')::date", [uid]);
  return rows[0]?.messages ?? 0;
}

describe("chat quota: consume and refund", () => {
  it("allows questions up to the limit, then refuses", async () => {
    await signInAs(USER);
    const ask = async (limit: number) => (await db.query<{ ok: boolean }>("select public.consume_chat_message($1) as ok", [limit])).rows[0].ok;
    expect(await ask(2)).toBe(true);
    expect(await ask(2)).toBe(true);
    expect(await ask(2)).toBe(false);
  });

  it("gives one question back after a failed answer", async () => {
    await signInAs(USER);
    await db.query("select public.consume_chat_message(2)");
    await db.query("select public.consume_chat_message(2)");
    await db.query("select public.refund_chat_message()");
    expect(await usage(USER)).toBe(1);
  });

  it("never drops the count below zero", async () => {
    await signInAs(USER);
    await db.query("select public.refund_chat_message()");
    expect(await usage(USER)).toBe(0);
  });

  it("refunds only the signed-in user's own count", async () => {
    await signInAs(USER);
    await db.query("select public.consume_chat_message(40)");
    await signInAs(OTHER);
    await db.query("select public.consume_chat_message(40)");
    await db.query("select public.refund_chat_message()");
    expect(await usage(USER)).toBe(1);
    expect(await usage(OTHER)).toBe(0);
  });

  it("does nothing when no one is signed in", async () => {
    await signInAs(null);
    await expect(db.query("select public.refund_chat_message()")).resolves.toBeDefined();
  });
});

describe("streak weeks in the learner's time zone", () => {
  // Sunday 23:59 UTC, just before this week's Monday. It is last week in UTC, but this week in Kiritimati (UTC+14).
  // Monday 12:00 UTC of last week is last week in both zones.
  async function addStreakEvents() {
    await signInAs(USER);
    await db.exec(`
      insert into user_progress_events (user_id, skill_slug, created_at) values
        ('${USER}', 'git', (date_trunc('week', now() at time zone 'UTC') - interval '1 minute') at time zone 'UTC'),
        ('${USER}', 'sql', (date_trunc('week', now() at time zone 'UTC') - interval '7 days' + interval '12 hours') at time zone 'UTC')
    `);
  }

  async function streak() {
    const { rows } = await db.query<{ n: number }>("select streak_weeks($1) as n", [USER]);
    return rows[0].n;
  }

  it("counts in UTC by default", async () => {
    await addStreakEvents();
    expect(await streak()).toBe(1);
  });

  it("counts in the learner's own zone once it is saved", async () => {
    await addStreakEvents();
    await db.query("select set_my_time_zone('Pacific/Kiritimati')");
    expect(await streak()).toBe(2);
  });

  it("ignores a time zone name that does not exist", async () => {
    await addStreakEvents();
    await db.query("select set_my_time_zone('Pacific/Kiritimati')");
    await db.query("select set_my_time_zone('Mars/Olympus')");
    const { rows } = await db.query<{ time_zone: string }>("select time_zone from profiles where id = $1", [USER]);
    expect(rows[0].time_zone).toBe("Pacific/Kiritimati");
  });

  it("reports this_week in the same zone", async () => {
    await addStreakEvents();
    await db.query("select set_my_time_zone('Pacific/Kiritimati')");
    const { rows } = await db.query<{ my_streak: { weeks: number; this_week: boolean } }>("select my_streak() as my_streak");
    expect(rows[0].my_streak).toEqual({ weeks: 2, this_week: true });
  });
});

describe("admin_stats uses the daily limit it is given", () => {
  it("counts users who reached the limit passed in", async () => {
    await db.exec(`
      insert into chat_usage (user_id, day, messages) values
        ('${USER}', (now() at time zone 'utc')::date, 3),
        ('${OTHER}', (now() at time zone 'utc')::date, 5)
    `);
    const hits = async (limit: number | null) => {
      const call = limit === null ? "select admin_stats() as s" : `select admin_stats(${limit}) as s`;
      const { rows } = await db.query<{ s: { chat: { limit_hits_7d: number } } }>(call);
      return rows[0].s.chat.limit_hits_7d;
    };
    expect(await hits(3)).toBe(2);
    expect(await hits(5)).toBe(1);
    expect(await hits(null)).toBe(0);
  });
});

describe("visitor quota: counted per hashed IP, server only", () => {
  const consume = async (ip: string, limit: number) => {
    const { rows } = await db.query<{ ok: boolean }>("select public.consume_visitor_chat_message($1, $2) as ok", [ip, limit]);
    return rows[0].ok;
  };
  const count = async (ip: string) => {
    const { rows } = await db.query<{ messages: number }>("select messages from visitor_chat_usage where ip_hash = $1", [ip]);
    return rows[0]?.messages ?? 0;
  };

  it("allows questions up to the limit for one visitor, then refuses", async () => {
    expect(await consume("hash-a", 2)).toBe(true);
    expect(await consume("hash-a", 2)).toBe(true);
    expect(await consume("hash-a", 2)).toBe(false);
  });

  it("keeps each visitor's count separate", async () => {
    await consume("hash-a", 1);
    expect(await consume("hash-b", 1)).toBe(true);
    expect(await count("hash-a")).toBe(1);
    expect(await count("hash-b")).toBe(1);
  });

  it("refunds one question and never goes below zero", async () => {
    await consume("hash-a", 3);
    await consume("hash-a", 3);
    await db.query("select public.refund_visitor_chat_message('hash-a')");
    expect(await count("hash-a")).toBe(1);
    await db.query("select public.refund_visitor_chat_message('hash-b')");
    await db.query("select public.refund_visitor_chat_message('hash-a')");
    await db.query("select public.refund_visitor_chat_message('hash-a')");
    expect(await count("hash-a")).toBe(0);
  });

  it("cannot be called by the public or by signed-in users, only the service role", async () => {
    const { rows } = await db.query<{ can: boolean }>(
      "select has_function_privilege('authenticated', 'public.consume_visitor_chat_message(text,int)', 'execute') as can",
    );
    expect(rows[0].can).toBe(false);
    const anon = await db.query<{ can: boolean }>(
      "select has_function_privilege('anon', 'public.consume_visitor_chat_message(text,int)', 'execute') as can",
    );
    expect(anon.rows[0].can).toBe(false);
    const service = await db.query<{ can: boolean }>(
      "select has_function_privilege('service_role', 'public.consume_visitor_chat_message(text,int)', 'execute') as can",
    );
    expect(service.rows[0].can).toBe(true);
  });
});
