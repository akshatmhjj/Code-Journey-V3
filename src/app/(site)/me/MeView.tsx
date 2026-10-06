"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowRight, ArrowUpRight, Bookmark, Compass, Copy, Eye, EyeOff, LogOut, MessageCircle, X } from "lucide-react";
import { supabase, useUser } from "@/lib/supabase";
import { computeProgress, formatHours, formatWeeks, type PathIndex } from "@/lib/path";
import { CHAT_DAILY_LIMIT, SITE } from "@/lib/site";
import { ThemePicker } from "@/components/shell/ThemeSettings";
import { usePath } from "@/components/path/PathProvider";
import { SkillProgress } from "@/components/path/SkillProgress";

const longDate = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" });

function Card({ title, children, right }: { title: string; children: React.ReactNode; right?: React.ReactNode }) {
  return (
    <section className="rounded-[var(--radius-lg)] border-2 border-ink p-6 md:p-7">
      <div className="mb-5 flex flex-wrap items-baseline justify-between gap-3">
        <h2 className="text-2xl font-bold">{title}</h2>
        {right}
      </div>
      {children}
    </section>
  );
}

/** Bookmarked resources, newest first, grouped under the skill they were saved from. */
function SavedResources({ index }: { index: PathIndex }) {
  const path = usePath();
  const saved = path?.saved ?? [];
  const [all, setAll] = useState(false);
  if (!saved.length) {
    return (
      <div className="flex flex-wrap items-center gap-4">
        <Bookmark size={24} />
        <p className="max-w-[56ch] flex-1 text-muted">
          Tap the bookmark next to any resource on a skill page or in the library to keep it here.
        </p>
        <Link href="/resources" className="btn btn-line">
          Open the library
        </Link>
      </div>
    );
  }
  const shown = all ? saved : saved.slice(0, 8);
  return (
    <>
      <ul className="divide-y divide-line border-y-2 border-ink">
        {shown.map((r) => {
          const skill = r.skillSlug ? index.skills[r.skillSlug] : undefined;
          return (
            <li key={r.url} className="grid grid-cols-[1fr_auto] items-center gap-3 py-3">
              <div className="min-w-0">
                <a href={r.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 font-display font-semibold hover:underline">
                  {r.title} <ArrowUpRight size={15} className="shrink-0" />
                </a>
                <p className="mt-0.5 truncate text-sm text-muted">
                  {skill && r.skillSlug ? (
                    <Link href={`/skills/${r.skillSlug}`} className="hover:underline">
                      {skill.title}
                    </Link>
                  ) : (
                    new URL(r.url).hostname.replace(/^www\./, "")
                  )}
                </p>
              </div>
              <button
                onClick={() => path?.toggleSaved({ url: r.url, title: r.title })}
                aria-label={`Remove ${r.title} from saved`}
                className="grid size-9 place-items-center rounded-full border-2 border-line hover:border-ink"
              >
                <X size={16} />
              </button>
            </li>
          );
        })}
      </ul>
      {saved.length > 8 && (
        <button onClick={() => setAll(!all)} className="mt-4 text-sm font-semibold hover:underline">
          {all ? "Show fewer" : `Show all ${saved.length}`}
        </button>
      )}
    </>
  );
}

const HANDLE = /^[a-z0-9][a-z0-9_-]{2,29}$/;

/** Choose a handle and turn the public /u/<handle> page on or off. */
function SharePath({ userId, defaultName, hasRole }: { userId: string; defaultName: string; hasRole: boolean }) {
  const [saved, setSaved] = useState<{ handle: string; name: string; isPublic: boolean } | null>(null);
  const [handle, setHandle] = useState("");
  const [name, setName] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [state, setState] = useState<"idle" | "saving" | "saved">("idle");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let cancelled = false;
    supabase()
      .from("profiles")
      .select("handle, public_name, path_public")
      .eq("id", userId)
      .maybeSingle()
      .then(({ data }) => {
        if (cancelled) return;
        const row = { handle: data?.handle ?? "", name: data?.public_name ?? defaultName, isPublic: !!data?.path_public };
        setSaved(row);
        setHandle(row.handle);
        setName(row.name);
        setIsPublic(row.isPublic);
      });
    return () => {
      cancelled = true;
    };
  }, [userId, defaultName]);

  if (!saved) return <div className="h-40 animate-pulse rounded-[var(--radius-md)] bg-surface" />;

  const dirty = handle !== saved.handle || name !== saved.name || isPublic !== saved.isPublic;
  const link = `${SITE.url.replace(/^https?:\/\//, "")}/u/${saved.handle}`;

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const h = handle.trim().toLowerCase();
    const n = name.trim();
    if (h && !HANDLE.test(h)) return setError("Handles are 3–30 characters: lowercase letters, numbers, - and _, starting with a letter or number.");
    if (isPublic && !h) return setError("Pick a handle first — it becomes your link.");
    if (isPublic && !n) return setError("Add the name you'd like people to see.");
    setState("saving");
    const db = supabase();
    if (h && h !== saved.handle) {
      const { data: free } = await db.rpc("handle_available", { p_handle: h });
      if (free === false) {
        setState("idle");
        return setError(`@${h} is taken. Try another.`);
      }
    }
    const { error: err } = await db
      .from("profiles")
      .upsert({ id: userId, handle: h || null, public_name: n || null, path_public: isPublic }, { onConflict: "id" });
    if (err) {
      setState("idle");
      return setError(
        err.code === "23505" ? `@${h} is taken. Try another.` : err.message.includes("reserved") ? `@${h} is reserved. Try another.` : "Couldn't save that. Please try again.",
      );
    }
    setSaved({ handle: h, name: n, isPublic });
    setHandle(h);
    setName(n);
    setState("saved");
    setTimeout(() => setState("idle"), 2500);
  };

  const field = "h-11 w-full min-w-0 rounded-full border-2 border-ink bg-canvas px-4 outline-none focus:shadow-[3px_3px_0_var(--ink)]";
  return (
    <form onSubmit={save} className="grid gap-5">
      <p className="max-w-[60ch] text-muted">
        Get a page you can put on your CV, LinkedIn or GitHub showing where you&apos;re heading and how far you&apos;ve got. It shows your chosen name, route and
        ticked skills — never your email. Off until you turn it on, and it stays out of search engines.
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-1.5 text-sm">
          <span className="font-semibold">Handle</span>
          <span className="flex items-center rounded-full border-2 border-ink bg-canvas pl-4 focus-within:shadow-[3px_3px_0_var(--ink)]">
            <span className="text-muted">@</span>
            <input
              value={handle}
              onChange={(e) => setHandle(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ""))}
              maxLength={30}
              autoCapitalize="none"
              spellCheck={false}
              placeholder="your-name"
              className="h-10 min-w-0 flex-1 bg-transparent pr-4 pl-0.5 outline-none"
            />
          </span>
        </label>
        <label className="grid gap-1.5 text-sm">
          <span className="font-semibold">Name shown on the page</span>
          <input value={name} onChange={(e) => setName(e.target.value)} maxLength={60} className={field} />
        </label>
      </div>
      <label className="flex cursor-pointer items-center gap-3">
        <input type="checkbox" checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} className="size-5 accent-[var(--ink)]" />
        <span className="font-semibold">Make my path page public</span>
      </label>
      {isPublic && !hasRole && <p className="text-sm text-muted">Choose a destination above so your page has a route to show.</p>}
      {error && (
        <p role="alert" className="text-[15px] font-semibold">
          {error}
        </p>
      )}
      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" disabled={!dirty || state === "saving"} className="btn btn-accent disabled:opacity-40">
          {state === "saving" ? "Saving…" : "Save"}
        </button>
        {state === "saved" && (
          <span role="status" className="text-sm font-semibold">
            Saved
          </span>
        )}
      </div>
      {saved.isPublic && saved.handle ? (
        <div className="flex flex-wrap items-center gap-3 rounded-[var(--radius-md)] bg-surface px-4 py-3">
          <Eye size={17} />
          <span className="min-w-0 flex-1 font-mono text-[14px] break-all">{link}</span>
          <button
            type="button"
            onClick={async () => {
              await navigator.clipboard.writeText(`https://${link}`);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
            className="inline-flex items-center gap-1.5 text-sm font-semibold hover:underline"
          >
            <Copy size={15} /> {copied ? "Copied" : "Copy link"}
          </button>
          <Link href={`/u/${saved.handle}`} className="inline-flex items-center gap-1.5 text-sm font-semibold hover:underline">
            View <ArrowUpRight size={15} />
          </Link>
        </div>
      ) : (
        <p className="flex items-center gap-2 text-sm text-muted">
          <EyeOff size={15} /> Your path page is private.
        </p>
      )}
    </form>
  );
}

type Suggestion = { id: number; skill_slug: string; url: string; title: string | null; status: "new" | "accepted" | "declined"; created_at: string };
const SUGGESTION_STATUS = { new: "Waiting for review", accepted: "Added — thank you", declined: "Not added this time" } as const;

/** Resources this person has suggested, and where each one is in review. Hidden until there's at least one. */
function YourSuggestions({ index, userId }: { index: PathIndex; userId: string }) {
  const [rows, setRows] = useState<Suggestion[] | null>(null);
  useEffect(() => {
    let cancelled = false;
    supabase()
      .from("resource_suggestions")
      .select("id, skill_slug, url, title, status, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(20)
      .then(({ data }) => !cancelled && setRows((data as Suggestion[] | null) ?? []));
    return () => {
      cancelled = true;
    };
  }, [userId]);
  if (!rows?.length) return null;
  return (
    <Card title="Your suggestions">
      <ul className="divide-y divide-line border-y-2 border-ink">
        {rows.map((r) => (
          <li key={r.id} className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 py-3">
            <div className="min-w-0">
              <a href={r.url} target="_blank" rel="noopener noreferrer" className="font-display font-semibold break-all hover:underline">
                {r.title || new URL(r.url).hostname.replace(/^www\./, "")}
              </a>
              <p className="text-sm text-muted">
                for{" "}
                <Link href={`/skills/${r.skill_slug}`} className="hover:underline">
                  {index.skills[r.skill_slug]?.title ?? r.skill_slug}
                </Link>{" "}
                · {longDate.format(new Date(r.created_at))}
              </p>
            </div>
            <span className={`font-mono text-[12px] tracking-wide uppercase ${r.status === "accepted" ? "font-bold text-ink" : "text-muted"}`}>
              {SUGGESTION_STATUS[r.status]}
            </span>
          </li>
        ))}
      </ul>
    </Card>
  );
}

/** Pick or change the destination you're working towards. */
function RoutePicker({ index, value, onChange }: { index: PathIndex; value: string | null; onChange: (slug: string) => void }) {
  const roles = [...index.roles].sort((a, b) => a.title.localeCompare(b.title));
  return (
    <label className="grid gap-1.5 text-sm">
      <span className="text-muted">{value ? "Change destination" : "Choose your destination"}</span>
      <select
        value={value ?? ""}
        onChange={(e) => e.target.value && onChange(e.target.value)}
        className="h-11 rounded-full border-2 border-ink bg-canvas px-4 font-display font-semibold outline-none"
      >
        <option value="" disabled>
          Pick a role…
        </option>
        {roles.map((r) => (
          <option key={r.slug} value={r.slug}>
            {r.title}
          </option>
        ))}
      </select>
    </label>
  );
}

function RouteProgress({ index, roleSlug }: { index: PathIndex; roleSlug: string }) {
  const path = usePath();
  const p = computeProgress(index, roleSlug, path?.statuses ?? {});
  if (!p) return null;
  const weeks = formatWeeks(p.hoursLeft);

  return (
    <div className="grid gap-7">
      <div className="grid gap-4 sm:grid-cols-[auto_1fr] sm:items-center sm:gap-7">
        <p className="font-display text-[clamp(3rem,8vw,4.5rem)] leading-none font-bold tabular-nums">{p.percent}%</p>
        <div className="grid gap-2">
          <div aria-hidden="true" className="h-3 overflow-hidden rounded-full bg-surface">
            <div className="h-full rounded-full bg-accent transition-[width] duration-500" style={{ width: `${p.percent}%` }} />
          </div>
          <p className="text-muted">
            <span className="font-semibold text-ink">
              {p.done} of {p.total} stations
            </span>
            {p.learning > 0 && ` · ${p.learning} in progress`} · {formatHours(p.hoursLeft)} left
            {weeks && ` · ${weeks} at 10 h/week`}
          </p>
        </div>
      </div>

      <div className="grid gap-3">
        <p className="eyebrow">Stages</p>
        <ol className="grid gap-2.5">
          {p.stages.map((s, i) => (
            <li key={s.name} className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1 sm:grid-cols-[150px_1fr_auto]">
              <span className={`font-display font-semibold ${i === p.currentStage ? "" : "text-muted"}`}>
                {s.name}
                {i === p.currentStage && s.done < s.total && <span className="ml-2 font-mono text-[10.5px] tracking-wide text-hl uppercase">you are here</span>}
              </span>
              <span aria-hidden="true" className="col-span-2 h-2 overflow-hidden rounded-full bg-surface sm:col-span-1">
                <span className="block h-full rounded-full bg-ink" style={{ width: `${s.percent}%` }} />
              </span>
              <span className="font-mono text-[12.5px] text-muted tabular-nums">
                {s.done}/{s.total}
              </span>
            </li>
          ))}
        </ol>
      </div>

      {p.next.length > 0 && (
        <div className="grid gap-3">
          <p className="eyebrow">Next stations</p>
          <ul className="grid gap-3">
            {p.next.map((slug) => (
              <li key={slug} className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-line pb-3 last:border-0 last:pb-0">
                <Link href={`/skills/${slug}`} className="font-display text-lg font-semibold hover:underline">
                  {index.skills[slug]?.title ?? slug}
                </Link>
                <SkillProgress slug={slug} compact />
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <Link href={`/roles/${roleSlug}`} className="btn btn-ink">
          Open the full route <ArrowRight size={17} />
        </Link>
        <Link href="/gap" className="btn btn-line">
          Check a job post against it
        </Link>
      </div>
    </div>
  );
}

export function MeView({ index }: { index: PathIndex }) {
  const user = useUser();
  const path = usePath();
  const router = useRouter();
  const [asked, setAsked] = useState<number | null>(null);

  useEffect(() => {
    if (user === null) router.replace("/login");
  }, [user, router]);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    supabase()
      .from("chat_usage")
      .select("messages")
      .eq("user_id", user.id)
      .eq("day", new Date().toISOString().slice(0, 10))
      .maybeSingle()
      .then(({ data }) => {
        if (!cancelled) setAsked(data?.messages ?? 0);
      });
    return () => {
      cancelled = true;
    };
  }, [user]);

  if (!user) {
    return (
      <div className="wrap py-24" aria-busy="true">
        <div className="h-14 w-72 max-w-full animate-pulse rounded-[var(--radius-md)] bg-surface" />
      </div>
    );
  }

  const name = (user.user_metadata?.full_name as string | undefined)?.split(" ")[0];
  const roleSlug = path?.roleSlug ?? null;
  const role = index.roles.find((r) => r.slug === roleSlug);

  return (
    <div className="wrap py-12 md:py-16">
      <p className="eyebrow">My Path</p>
      <h1 className="mt-4 text-[clamp(2.5rem,7vw,5rem)] leading-[0.95] font-bold tracking-[-0.04em]">{name ? `Hi, ${name}.` : "Welcome."}</h1>
      <p className="mt-4 text-lg text-muted">
        {user.email} · member since {longDate.format(new Date(user.created_at))}
      </p>

      <div className="mt-12 grid gap-6">
        {role ? (
          <Card title={role.title} right={<RoutePicker index={index} value={roleSlug} onChange={(s) => path?.setRole(s)} />}>
            <RouteProgress index={index} roleSlug={role.slug} />
          </Card>
        ) : (
          <Card title="Where are you going?">
            <div className="grid gap-5 md:grid-cols-[1fr_auto] md:items-end">
              <div>
                <Compass size={28} />
                <p className="mt-3 max-w-[52ch] text-lg text-muted">
                  Pick a destination and every skill on that route becomes a station you can tick off. Your progress shows up here and on the route itself.
                </p>
              </div>
              <RoutePicker index={index} value={null} onChange={(s) => path?.setRole(s)} />
            </div>
            <Link href="/roles" className="btn btn-line mt-6">
              Browse all {index.roles.length} routes
            </Link>
          </Card>
        )}

        <Card
          title="Saved resources"
          right={
            path?.saved.length ? (
              <Link href="/resources" className="text-sm font-semibold hover:underline">
                Browse the library
              </Link>
            ) : undefined
          }
        >
          <SavedResources index={index} />
        </Card>

        <YourSuggestions index={index} userId={user.id} />

        <Card title="Share your path">
          <SharePath userId={user.id} defaultName={name ?? ""} hasRole={!!role} />
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card title="CJ AI">
            <p className="text-muted">Answers about roles, skills and where to learn them — from Code Journey&apos;s own pages, with sources.</p>
            <p className="mt-4 font-display text-lg font-semibold tabular-nums">
              {asked === null ? "—" : `${asked} of ${CHAT_DAILY_LIMIT}`} <span className="font-sans text-sm font-normal text-muted">questions used today</span>
            </p>
            <p className="mt-1 text-sm text-muted">The allowance resets at midnight UTC.</p>
            <Link href="/faq" className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold hover:underline">
              <MessageCircle size={15} /> How CJ AI works
            </Link>
          </Card>

          <Card title="Look and feel">
            <ThemePicker />
          </Card>
        </div>

        <Card title="Account">
          <dl className="grid gap-3 text-[15px] sm:grid-cols-2">
            <div>
              <dt className="text-muted">Email</dt>
              <dd className="font-semibold">{user.email}</dd>
            </div>
            <div>
              <dt className="text-muted">Member since</dt>
              <dd className="font-semibold">{longDate.format(new Date(user.created_at))}</dd>
            </div>
          </dl>
          <p className="mt-5 text-sm text-muted">
            Want a copy of your data, or all of it deleted? Email{" "}
            <a href={`mailto:${SITE.email}`} className="link font-semibold text-ink">
              {SITE.email}
            </a>{" "}
            and we&apos;ll act within 30 days.
          </p>
          <button
            onClick={async () => {
              await supabase().auth.signOut();
              router.push("/");
            }}
            className="btn btn-line mt-5"
          >
            <LogOut size={17} /> Sign out
          </button>
        </Card>
      </div>
    </div>
  );
}
