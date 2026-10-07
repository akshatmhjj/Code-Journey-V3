import Link from "next/link";
import { ExternalLink, LogOut } from "lucide-react";
import { adminConfigured, adminDb, isAdmin } from "@/lib/admin";
import { getChangelog, getNetwork } from "@/lib/content";
import { SITE } from "@/lib/site";
import { logout, setMessageStatus, setSuggestionStatus } from "./actions";
import { LoginForm } from "./LoginForm";
import { date, DayBars, num, Panel, Pill, RankBars, SplitBar, Stat, when } from "./ui";

export const dynamic = "force-dynamic";

const TABS = [
  ["overview", "Overview"],
  ["users", "Users"],
  ["inbox", "Inbox"],
  ["resources", "Resources"],
  ["ai", "CJ AI"],
  ["changelog", "Changelog"],
] as const;
type Tab = (typeof TABS)[number][0];

type Day = { d: string; n: number };
type Stats = {
  users: { total: number; confirmed: number; new_7d: number; new_30d: number; active_7d: number; providers: Record<string, number>; signups_by_day: Day[] };
  paths: {
    with_route: number;
    by_role: { role: string; n: number }[];
    skills_done: number;
    skills_learning: number;
    top_done: { skill: string; n: number }[];
    stations_by_day: Day[];
    active_learners_7d: number;
    streaks_2plus: number;
  };
  sharing: { public_pages: number; weekly_email_on: number; weekly_email_sent_7d: number };
  chat: {
    today: number;
    total_7d: number;
    total_30d: number;
    users_7d: number;
    limit_hits_7d: number;
    by_day: Day[];
    up: number;
    down: number;
    up_30d: number;
    down_30d: number;
    index_passages: number;
    index_updated: string | null;
  };
  resources: {
    saved: number;
    top_saved: { url: string; title: string; n: number }[];
    helpful: number;
    not_helpful: number;
    top_helpful: { url: string; n: number }[];
    reported: { url: string; skill: string | null; down: number; up: number; last: string }[];
    suggestions: Record<string, number>;
  };
  contact: { new: number; total: number };
};

const host = (u: string) => {
  try {
    return new URL(u).hostname.replace(/^www\./, "");
  } catch {
    return u;
  }
};

export default async function AdminPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  if (!adminConfigured()) {
    return (
      <main className="wrap py-20">
        <h1 className="text-3xl font-bold">Admin isn&apos;t set up</h1>
        <p className="mt-3 max-w-[60ch] text-muted">Add ADMIN_PASSWORD and SUPABASE_SERVICE_ROLE_KEY to the environment, then redeploy.</p>
      </main>
    );
  }
  if (!(await isAdmin())) return <LoginForm />;

  const params = await searchParams;
  const tab: Tab = TABS.some(([t]) => t === params.tab) ? (params.tab as Tab) : "overview";
  const net = getNetwork();
  const roleTitle = (s: string) => net.roles.find((r) => r.slug === s)?.title ?? s;
  const skillTitle = (s: string) => net.skills.find((r) => r.slug === s)?.title ?? s;
  const db = adminDb();
  const needsStats = tab === "overview" || tab === "resources" || tab === "ai";
  const { data: statsData, error: statsError } = needsStats ? await db.rpc("admin_stats") : { data: null, error: null };
  const stats = statsData as Stats | null;
  const newMessages = stats?.contact.new ?? (await db.from("contact_messages").select("id", { count: "exact", head: true }).eq("status", "new")).count ?? 0;

  return (
    <div className="pb-16">
      <header className="sticky top-0 z-20 border-b-2 border-ink bg-canvas">
        <div className="wrap flex items-center justify-between gap-3 py-3">
          <Link href="/admin" className="font-display text-lg font-bold">
            Code Journey <span className="text-muted">admin</span>
          </Link>
          <div className="flex items-center gap-2">
            <a href={SITE.url} target="_blank" rel="noopener noreferrer" className="hidden items-center gap-1.5 text-sm font-semibold hover:underline sm:inline-flex">
              Live site <ExternalLink size={13} />
            </a>
            <form action={logout}>
              <button className="inline-flex h-9 items-center gap-1.5 rounded-full border-2 border-ink px-3 text-sm font-semibold hover:bg-raise">
                <LogOut size={14} /> Sign out
              </button>
            </form>
          </div>
        </div>
        <nav aria-label="Dashboard sections" className="wrap -mb-[2px] flex gap-1 overflow-x-auto">
          {TABS.map(([id, label]) => (
            <Link
              key={id}
              href={id === "overview" ? "/admin" : `/admin?tab=${id}`}
              aria-current={tab === id ? "page" : undefined}
              className={`shrink-0 border-b-[3px] px-3 py-2.5 text-[15px] font-semibold whitespace-nowrap ${tab === id ? "border-accent" : "border-transparent text-muted hover:text-ink"}`}
            >
              {label}
              {id === "inbox" && newMessages > 0 && <span className="ml-1.5 rounded-full bg-accent px-1.5 text-[12px] text-on-accent">{newMessages}</span>}
            </Link>
          ))}
        </nav>
      </header>

      <main className="wrap mt-8 grid gap-6">
        {statsError && <p className="rounded-[var(--radius-md)] border-2 border-accent p-4">Couldn&apos;t load stats: {statsError.message}. Has the latest database migration been pushed?</p>}

        {tab === "overview" && stats && <Overview s={stats} roleTitle={roleTitle} skillTitle={skillTitle} />}
        {tab === "users" && <Users search={params.q ?? ""} page={Math.max(0, Number(params.page ?? 0) || 0)} roleTitle={roleTitle} />}
        {tab === "inbox" && <Inbox show={params.show === "done" ? "done" : params.show === "all" ? "all" : "new"} />}
        {tab === "resources" && stats && <Resources s={stats} skillTitle={skillTitle} />}
        {tab === "ai" && stats && <Ai s={stats} />}
        {tab === "changelog" && <Changelog />}
      </main>
    </div>
  );
}

/* ── Overview ─────────────────────────────────────────────── */

function Overview({ s, roleTitle, skillTitle }: { s: Stats; roleTitle: (x: string) => string; skillTitle: (x: string) => string }) {
  const thumbs = s.chat.up + s.chat.down;
  return (
    <>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        <Stat label="Users" value={num(s.users.total)} sub={`+${num(s.users.new_7d)} this week`} />
        <Stat label="Signed in, 7 days" value={num(s.users.active_7d)} />
        <Stat label="With a route" value={num(s.paths.with_route)} sub={s.users.total ? `${Math.round((s.paths.with_route / s.users.total) * 100)}% of users` : undefined} />
        <Stat label="Learning, 7 days" value={num(s.paths.active_learners_7d)} sub="ticked a station" />
        <Stat label="CJ AI, 7 days" value={num(s.chat.total_7d)} sub={`${num(s.chat.users_7d)} people`} />
        <Stat label="Inbox" value={num(s.contact.new)} sub="new messages" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Sign-ups">
          <DayBars data={s.users.signups_by_day} label="New accounts per day" unit="sign-ups" />
          <p className="mt-4 flex flex-wrap gap-2 text-sm">
            {Object.entries(s.users.providers).map(([p, n]) => (
              <Pill key={p}>
                {p} {num(n)}
              </Pill>
            ))}
            <Pill>confirmed {num(s.users.confirmed)}</Pill>
          </p>
        </Panel>
        <Panel title="Learning activity">
          <DayBars data={s.paths.stations_by_day} label="Stations ticked off per day" unit="stations" />
          <p className="mt-4 text-sm text-muted">
            {num(s.paths.skills_done)} done · {num(s.paths.skills_learning)} in progress · {num(s.paths.streaks_2plus)} people on a 2+ week streak
          </p>
        </Panel>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Most chosen routes">
          <RankBars rows={s.paths.by_role.slice(0, 12).map((r) => ({ key: r.role, label: roleTitle(r.role), n: r.n }))} />
        </Panel>
        <Panel title="Most completed skills">
          <RankBars rows={s.paths.top_done.map((r) => ({ key: r.skill, label: skillTitle(r.skill), n: r.n }))} />
        </Panel>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Panel title="CJ AI answers" note="all time">
          <SplitBar a={s.chat.up} b={s.chat.down} aLabel="Helpful" bLabel="Not helpful" />
          <p className="mt-3 text-sm text-muted">{thumbs ? `${num(thumbs)} ratings` : "No ratings yet."}</p>
        </Panel>
        <Panel title="Sharing and email">
          <dl className="grid grid-cols-3 gap-3 text-sm">
            <div>
              <dt className="text-muted">Public pages</dt>
              <dd className="font-display text-2xl font-bold tabular-nums">{num(s.sharing.public_pages)}</dd>
            </div>
            <div>
              <dt className="text-muted">Weekly email</dt>
              <dd className="font-display text-2xl font-bold tabular-nums">{num(s.sharing.weekly_email_on)}</dd>
            </div>
            <div>
              <dt className="text-muted">Sent, 7 days</dt>
              <dd className="font-display text-2xl font-bold tabular-nums">{num(s.sharing.weekly_email_sent_7d)}</dd>
            </div>
          </dl>
        </Panel>
        <Panel title="Resources">
          <dl className="grid grid-cols-3 gap-3 text-sm">
            <div>
              <dt className="text-muted">Saved</dt>
              <dd className="font-display text-2xl font-bold tabular-nums">{num(s.resources.saved)}</dd>
            </div>
            <div>
              <dt className="text-muted">Reported</dt>
              <dd className="font-display text-2xl font-bold tabular-nums">{num(s.resources.reported.length)}</dd>
            </div>
            <div>
              <dt className="text-muted">To review</dt>
              <dd className="font-display text-2xl font-bold tabular-nums">{num(s.resources.suggestions.new ?? 0)}</dd>
            </div>
          </dl>
        </Panel>
      </div>
    </>
  );
}

/* ── Users ────────────────────────────────────────────────── */

type UserRow = {
  id: string;
  email: string;
  name: string | null;
  provider: string;
  created_at: string;
  last_sign_in_at: string | null;
  confirmed: boolean;
  role_slug: string | null;
  done: number;
  learning: number;
  streak: number;
  weekly_email: boolean;
  handle: string | null;
  path_public: boolean;
  chat_7d: number;
  total: number;
};

async function Users({ search, page, roleTitle }: { search: string; page: number; roleTitle: (x: string) => string }) {
  const size = 50;
  const { data, error } = await adminDb().rpc("admin_users", { p_search: search || null, p_limit: size, p_offset: page * size });
  const rows = (data ?? []) as UserRow[];
  const total = rows[0]?.total ?? 0;
  const link = (p: number) => `/admin?tab=users${search ? `&q=${encodeURIComponent(search)}` : ""}${p ? `&page=${p}` : ""}`;

  return (
    <Panel title={`Users${total ? ` · ${num(total)}` : ""}`} note="Account basics and progress only - no passwords, tokens or IP addresses.">
      <form className="mb-5 flex gap-2" action="/admin">
        <input type="hidden" name="tab" value="users" />
        <input
          name="q"
          defaultValue={search}
          placeholder="Search name, email or handle"
          className="h-11 min-w-0 flex-1 rounded-full border-2 border-ink bg-canvas px-4 outline-none"
        />
        <button className="btn btn-ink h-11">Search</button>
      </form>
      {error && <p className="font-semibold">Couldn&apos;t load users: {error.message}</p>}
      {!rows.length && !error && <p className="text-muted">No users match.</p>}
      <ul className="divide-y divide-line border-y-2 border-ink">
        {rows.map((u) => (
          <li key={u.id} className="grid gap-x-6 gap-y-2 py-3 text-[14.5px] md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1fr)_auto]">
            <div className="min-w-0">
              <p className="truncate font-semibold">{u.name || <span className="text-muted">No name</span>}</p>
              <p className="truncate text-muted">{u.email}</p>
            </div>
            <div className="min-w-0">
              <p className="truncate">{u.role_slug ? roleTitle(u.role_slug) : <span className="text-muted">No route yet</span>}</p>
              <p className="text-muted tabular-nums">
                {u.done} done · {u.learning} learning{u.streak > 0 ? ` · ${u.streak}w streak` : ""}
              </p>
            </div>
            <div className="text-muted">
              <p>Joined {date.format(new Date(u.created_at))}</p>
              <p>{u.last_sign_in_at ? `Last in ${date.format(new Date(u.last_sign_in_at))}` : "Never signed in"}</p>
            </div>
            <div className="flex flex-wrap content-start gap-1.5 md:justify-end">
              <Pill>{u.provider}</Pill>
              {!u.confirmed && <Pill tone="accent">unconfirmed</Pill>}
              {u.weekly_email && <Pill>email</Pill>}
              {u.chat_7d > 0 && <Pill>AI {u.chat_7d}</Pill>}
              {u.path_public && u.handle && (
                <a href={`/u/${u.handle}`} target="_blank" rel="noopener noreferrer">
                  <Pill tone="ink">@{u.handle}</Pill>
                </a>
              )}
            </div>
          </li>
        ))}
      </ul>
      {total > size && (
        <div className="mt-4 flex items-center justify-between text-sm">
          {page > 0 ? (
            <Link href={link(page - 1)} className="font-semibold hover:underline">
              ← Newer
            </Link>
          ) : (
            <span />
          )}
          <span className="text-muted">
            {num(page * size + 1)}-{num(Math.min(total, (page + 1) * size))} of {num(total)}
          </span>
          {(page + 1) * size < total ? (
            <Link href={link(page + 1)} className="font-semibold hover:underline">
              Older →
            </Link>
          ) : (
            <span />
          )}
        </div>
      )}
    </Panel>
  );
}

/* ── Inbox ────────────────────────────────────────────────── */

async function Inbox({ show }: { show: "new" | "done" | "all" }) {
  let q = adminDb().from("contact_messages").select("id, name, email, topic, message, page, status, created_at, user_id").order("created_at", { ascending: false }).limit(100);
  if (show !== "all") q = q.eq("status", show);
  const { data, error } = await q;
  const rows = data ?? [];
  return (
    <Panel title="Inbox" note="Messages from the contact form on the FAQ page.">
      <div className="mb-5 flex gap-2">
        {(["new", "done", "all"] as const).map((s) => (
          <Link
            key={s}
            href={`/admin?tab=inbox${s === "new" ? "" : `&show=${s}`}`}
            className={`rounded-full border-2 px-3 py-1 text-sm font-semibold capitalize ${show === s ? "border-ink bg-ink text-canvas" : "border-line hover:border-ink"}`}
          >
            {s}
          </Link>
        ))}
      </div>
      {error && <p className="font-semibold">Couldn&apos;t load messages: {error.message}</p>}
      {!rows.length && !error && <p className="text-muted">{show === "new" ? "Nothing new. Inbox zero." : "No messages."}</p>}
      <ul className="grid gap-4">
        {rows.map((m) => (
          <li key={m.id} className="rounded-[var(--radius-md)] border-2 border-line p-4">
            <div className="flex flex-wrap items-center gap-2">
              <Pill tone={m.status === "new" ? "accent" : "line"}>{m.topic}</Pill>
              <span className="font-semibold">{m.name || "No name"}</span>
              <a href={`mailto:${m.email}?subject=${encodeURIComponent("Re: your message to Code Journey")}`} className="text-[15px] break-all underline">
                {m.email}
              </a>
              {m.user_id && <Pill>member</Pill>}
              <span className="ml-auto text-sm text-muted">{when.format(new Date(m.created_at))}</span>
            </div>
            <p className="mt-3 text-[15.5px] whitespace-pre-wrap">{m.message}</p>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-sm text-muted">
              <span>{m.page ? `Sent from ${m.page}` : ""}</span>
              <form action={setMessageStatus.bind(null, m.id, m.status === "new" ? "done" : "new")}>
                <button className="rounded-full border-2 border-ink px-3 py-1 font-semibold text-ink hover:bg-raise">{m.status === "new" ? "Mark as done" : "Move back to new"}</button>
              </form>
            </div>
          </li>
        ))}
      </ul>
    </Panel>
  );
}

/* ── Resources ────────────────────────────────────────────── */

async function Resources({ s, skillTitle }: { s: Stats; skillTitle: (x: string) => string }) {
  const { data } = await adminDb()
    .from("resource_suggestions")
    .select("id, skill_slug, url, title, note, status, created_at")
    .order("status", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(100);
  const suggestions = (data ?? []).sort((a, b) => Number(b.status === "new") - Number(a.status === "new"));

  return (
    <>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat label="Saved" value={num(s.resources.saved)} sub="bookmarks" />
        <Stat label="Helpful votes" value={num(s.resources.helpful)} />
        <Stat label="Not helpful" value={num(s.resources.not_helpful)} sub={`${s.resources.reported.length} links`} />
        <Stat label="Suggestions" value={num(s.resources.suggestions.new ?? 0)} sub="waiting for review" />
      </div>

      <Panel title="Reported links" note="Resources people marked not helpful, outdated or broken. Check these first.">
        {!s.resources.reported.length ? (
          <p className="text-muted">No reports.</p>
        ) : (
          <ul className="divide-y divide-line border-y-2 border-ink">
            {s.resources.reported.map((r) => (
              <li key={r.url} className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 py-3 text-[15px]">
                <div className="min-w-0">
                  <a href={r.url} target="_blank" rel="noopener noreferrer" className="font-semibold break-all hover:underline">
                    {host(r.url)}
                  </a>
                  <p className="text-sm break-all text-muted">{r.url}</p>
                  {r.skill && (
                    <Link href={`/skills/${r.skill}`} className="text-sm hover:underline">
                      on {skillTitle(r.skill)}
                    </Link>
                  )}
                </div>
                <p className="font-mono text-sm tabular-nums">
                  <span className="font-bold">{r.down} 👎</span> · {r.up} 👍 · {date.format(new Date(r.last))}
                </p>
              </li>
            ))}
          </ul>
        )}
      </Panel>

      <Panel title="Suggestions" note="Accepted ones still need adding to that skill's content file.">
        {!suggestions.length && <p className="text-muted">No suggestions yet.</p>}
        <ul className="grid gap-3">
          {suggestions.map((g) => (
            <li key={g.id} className="rounded-[var(--radius-md)] border-2 border-line p-4">
              <div className="flex flex-wrap items-center gap-2">
                <Pill tone={g.status === "new" ? "accent" : g.status === "accepted" ? "ink" : "line"}>{g.status}</Pill>
                <Link href={`/skills/${g.skill_slug}`} className="font-semibold hover:underline">
                  {skillTitle(g.skill_slug)}
                </Link>
                <span className="ml-auto text-sm text-muted">{when.format(new Date(g.created_at))}</span>
              </div>
              <a href={g.url} target="_blank" rel="noopener noreferrer" className="mt-2 block font-semibold break-all underline">
                {g.title || host(g.url)}
              </a>
              <p className="text-sm break-all text-muted">{g.url}</p>
              {g.note && <p className="mt-2 text-[15px] whitespace-pre-wrap">{g.note}</p>}
              <div className="mt-3 flex flex-wrap gap-2">
                {(["accepted", "declined", "new"] as const)
                  .filter((st) => st !== g.status)
                  .map((st) => (
                    <form key={st} action={setSuggestionStatus.bind(null, g.id, st)}>
                      <button className="rounded-full border-2 border-ink px-3 py-1 text-sm font-semibold hover:bg-raise">
                        {st === "accepted" ? "Accept" : st === "declined" ? "Decline" : "Back to new"}
                      </button>
                    </form>
                  ))}
              </div>
            </li>
          ))}
        </ul>
      </Panel>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Most saved">
          <RankBars
            rows={s.resources.top_saved.map((r) => ({
              key: r.url,
              n: r.n,
              label: (
                <a href={r.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  {r.title}
                </a>
              ),
            }))}
          />
        </Panel>
        <Panel title="Most helpful">
          <RankBars
            rows={s.resources.top_helpful.map((r) => ({
              key: r.url,
              n: r.n,
              label: (
                <a href={r.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  {host(r.url)}
                </a>
              ),
            }))}
          />
        </Panel>
      </div>
    </>
  );
}

/* ── CJ AI ────────────────────────────────────────────────── */

async function Ai({ s }: { s: Stats }) {
  const { data } = await adminDb()
    .from("chat_feedback")
    .select("id, question, answer, sources, comment, created_at")
    .eq("rating", -1)
    .order("created_at", { ascending: false })
    .limit(30);
  const bad = data ?? [];
  const rated30 = s.chat.up_30d + s.chat.down_30d;

  return (
    <>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        <Stat label="Questions today" value={num(s.chat.today)} />
        <Stat label="7 days" value={num(s.chat.total_7d)} sub={`${num(s.chat.users_7d)} people`} />
        <Stat label="30 days" value={num(s.chat.total_30d)} />
        <Stat label="Helpful, 30 days" value={rated30 ? `${Math.round((s.chat.up_30d / rated30) * 100)}%` : "-"} sub={`${num(rated30)} ratings`} />
        <Stat label="Hit daily limit" value={num(s.chat.limit_hits_7d)} sub="people, 7 days" />
        <Stat label="Index" value={num(s.chat.index_passages)} sub={s.chat.index_updated ? `passages · ${date.format(new Date(s.chat.index_updated))}` : "passages"} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <Panel title="Questions asked">
          <DayBars data={s.chat.by_day} label="CJ AI questions per day" unit="questions" />
        </Panel>
        <Panel title="Ratings" note="all time">
          <SplitBar a={s.chat.up} b={s.chat.down} aLabel="Helpful" bLabel="Not helpful" />
          <p className="mt-4 text-sm text-muted">
            Answers come from Gemini over Code Journey&apos;s own pages. If the index date looks old, re-run the index workflow after content changes.
          </p>
        </Panel>
      </div>

      <Panel title="Answers marked not helpful" note="Most recent 30. Fix the content these point to, or the question it couldn't answer.">
        {!bad.length && <p className="text-muted">None yet.</p>}
        <ul className="grid gap-4">
          {bad.map((f) => (
            <li key={f.id} className="rounded-[var(--radius-md)] border-2 border-line p-4">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="font-semibold">{f.question}</p>
                <span className="text-sm text-muted">{when.format(new Date(f.created_at))}</span>
              </div>
              {f.comment && <p className="mt-2 rounded-md bg-surface px-3 py-2 text-[15px]">“{f.comment}”</p>}
              <details className="mt-2">
                <summary className="cursor-pointer text-sm font-semibold">Show the answer</summary>
                <p className="mt-2 text-[14.5px] whitespace-pre-wrap text-muted">{f.answer}</p>
              </details>
              {f.sources?.length > 0 && (
                <p className="mt-2 flex flex-wrap gap-1.5 text-sm">
                  {(f.sources as string[]).map((u) => (
                    <a key={u} href={u} className="rounded-full bg-surface px-2 py-0.5 hover:underline">
                      {u}
                    </a>
                  ))}
                </p>
              )}
            </li>
          ))}
        </ul>
      </Panel>
    </>
  );
}

/* ── Changelog ────────────────────────────────────────────── */

function Changelog() {
  const entries = getChangelog();
  return (
    <Panel title="Changelog" note="From content/changelog.yaml. Not shown on the public site.">
      <ol className="grid gap-8">
        {entries.map((e) => (
          <li key={e.version} className="grid gap-2 border-t border-line pt-5 first:border-0 first:pt-0 md:grid-cols-[180px_1fr] md:gap-8">
            <div>
              <p className="font-mono text-sm text-muted">{e.version}</p>
              <p className="text-sm text-muted">{date.format(e.date)}</p>
            </div>
            <div>
              <h3 className="font-display text-lg font-bold">{e.title}</h3>
              <ul className="mt-2 grid gap-1.5 text-[15px]">
                {e.changes.map((c) => (
                  <li key={c.text} className="flex gap-2">
                    <span className="shrink-0">
                      <Pill tone={c.type === "added" ? "ink" : c.type === "fixed" ? "accent" : "line"}>{c.type}</Pill>
                    </span>
                    <span>{c.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ol>
    </Panel>
  );
}
