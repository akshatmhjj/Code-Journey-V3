"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, ArrowUpRight, Check, Compass, Copy, EyeOff, LogOut, Monitor, Moon, Sun } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { formatHours, formatWeeks, type PathIndex, type Progress, type SkillStatus } from "@/lib/path";
import type { Milestone } from "@/lib/milestones";
import { GITHUB_URL, LEETCODE_URL, LINKEDIN_URL, normalizeLink } from "@/lib/profile-links";
import { SITE, THEMES, type Mode } from "@/lib/site";
import { SaveLook } from "@/components/shell/ThemeSettings";
import { useUI } from "@/components/shell/UIProvider";
import { usePath } from "@/components/path/PathProvider";
import { StreakMilestones, type Streak } from "@/components/path/StreakMilestones";

export const longDate = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" });

const PANEL = "rounded-[var(--radius-lg)] border-2 border-ink";
const FIELD = "h-12 w-full min-w-0 border-b-2 border-line bg-transparent px-0 font-display text-lg outline-none transition-colors placeholder:text-faint focus:border-ink";
const ROWS = "grid";
const ROW = "border-t border-line";

/** One section of the page: a numbered heading and open content. No boxes; the rule above it does the work. */
function Section({
  id,
  num,
  eyebrow,
  title,
  right,
  children,
}: {
  id: string;
  num: string;
  eyebrow: string;
  title: string;
  right?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section aria-labelledby={id} className="grid min-w-0 gap-8 md:gap-10">
      <header className="flex flex-wrap items-end justify-between gap-x-6 gap-y-4 border-t-2 border-ink pt-6 md:pt-8">
        <div className="min-w-0">
          <p className="eyebrow">
            <span className="opacity-60">{num}</span> · {eyebrow}
          </p>
          <h2 id={id} className="mt-3 font-display text-[clamp(2.25rem,5vw,3.75rem)] leading-[0.98] font-bold tracking-[-0.03em]">
            {title}
          </h2>
        </div>
        {right}
      </header>
      {children}
    </section>
  );
}

/* ── Header ───────────────────────────────────────────────────── */

export function PageHeader({ greeting, email, memberSince }: { greeting: string; email: string | undefined; memberSince: string }) {
  return (
    <header className="grid gap-6 md:flex md:items-end md:justify-between md:gap-8">
      <div className="min-w-0">
        <p className="eyebrow">My Path</p>
        <h1 className="mt-3 text-[clamp(2.75rem,8vw,6rem)] leading-[0.92] font-bold tracking-[-0.045em] break-words">{greeting}</h1>
        <p className="mt-4 text-base break-words text-muted md:text-lg">
          {email} · member since {memberSince}
        </p>
      </div>
      <nav aria-label="Quick links" className="flex flex-wrap gap-x-6 gap-y-3 text-base font-semibold">
        <Link href="/roles" className="link inline-flex min-h-11 items-center gap-1.5">
          Browse all routes <ArrowRight size={16} aria-hidden="true" />
        </Link>
        <Link href="/resources" className="link inline-flex min-h-11 items-center gap-1.5">
          Resource library <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </nav>
    </header>
  );
}

/* ── Route ────────────────────────────────────────────────────── */

/** Pick or change the destination you're working towards. */
export function RoutePicker({ index, value, onChange }: { index: PathIndex; value: string | null; onChange: (slug: string) => void }) {
  const roles = [...index.roles].sort((a, b) => a.title.localeCompare(b.title));
  return (
    <label className="grid gap-1.5 text-sm">
      <span className="font-semibold text-muted">{value ? "Change destination" : "Choose your destination"}</span>
      <select
        value={value ?? ""}
        onChange={(e) => e.target.value && onChange(e.target.value)}
        className="h-11 w-full rounded-full border-2 border-ink bg-canvas px-4 font-display font-semibold outline-none focus-visible:shadow-[3px_3px_0_var(--ink)] sm:max-w-sm"
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

/** The stages drawn as a metro line. The current stage's dot pulses. Horizontal from 640px, vertical on phones. */
export function MetroRoute({ stages, currentStage, percent }: { stages: Progress["stages"]; currentStage: number; percent: number }) {
  return (
    <div className="metro-wrap" style={{ "--p": percent / 100 } as React.CSSProperties}>
      <div aria-hidden="true" className="metro-track" />
      <div aria-hidden="true" className="metro-fill" />
      <ol className="metro" aria-label="Stages on this route">
        {stages.map((s, i) => {
          const finished = s.done >= s.total;
          const here = !finished && i === currentStage;
          const state = finished ? "done" : here ? "here" : "todo";
          return (
            <li key={s.name} className="metro-stop">
              <span className="metro-dot" data-state={state} aria-hidden="true" />
              <span className="metro-label">
                <b className={here || finished ? "" : "text-muted"}>{s.name}</b>
                <small>
                  {s.done} of {s.total}
                  {finished ? " · done" : here ? " · you are here" : ""}
                  <span className="sr-only">{state === "done" ? " (finished)" : state === "here" ? " (current stage)" : " (not started)"}</span>
                </small>
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

/** The main panel for the chosen route: the big percentage, the metro line and the route actions. */
export function RouteHero({
  index,
  roleSlug,
  roleTitle,
  progress,
  onRouteChange,
}: {
  index: PathIndex;
  roleSlug: string;
  roleTitle: string;
  progress: Progress;
  onRouteChange: (slug: string) => void;
}) {
  const weeks = formatWeeks(progress.hoursLeft);
  return (
    <section aria-label="Your route" className={`grid min-w-0 gap-8 p-6 md:p-9 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)] lg:items-center ${PANEL}`}>
      <div className="grid min-w-0 gap-6">
        <div className="grid gap-3">
          <p className="eyebrow">Destination</p>
          <h2 className="font-display text-3xl leading-tight font-bold break-words md:text-4xl">{roleTitle}</h2>
          <RoutePicker index={index} value={roleSlug} onChange={onRouteChange} />
        </div>

        <div className="grid gap-4 sm:grid-cols-[auto_1fr] sm:items-center sm:gap-6">
          <p className="font-display text-[clamp(4rem,10vw,7rem)] leading-none font-bold tabular-nums">{progress.percent}%</p>
          <div className="grid min-w-0 gap-3">
            <div aria-hidden="true" className="h-3 overflow-hidden rounded-full bg-surface">
              <div className="h-full rounded-full bg-accent transition-[width] duration-500" style={{ width: `${progress.percent}%` }} />
            </div>
            <p className="text-muted">
              <span className="font-semibold text-ink">
                {progress.done} of {progress.total} stations
              </span>
              {progress.learning > 0 && ` · ${progress.learning} in progress`}
              <br />
              {formatHours(progress.hoursLeft)} left
              {weeks && ` · ${weeks} at 10 h a week`}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Link href={`/roles/${roleSlug}`} className="btn btn-ink w-full sm:w-auto">
            Open the full route <ArrowRight size={17} aria-hidden="true" />
          </Link>
          <Link href="/gap" className="btn btn-line w-full sm:w-auto">
            Check a job post against it
          </Link>
        </div>
      </div>

      <div className="grid min-w-0 gap-5">
        <p className="eyebrow">Your stages</p>
        <MetroRoute stages={progress.stages} currentStage={progress.currentStage} percent={progress.percent} />
      </div>
    </section>
  );
}

/** Shown before a destination is chosen. */
export function NoRouteCard({ index, onRouteChange }: { index: PathIndex; onRouteChange: (slug: string) => void }) {
  return (
    <section aria-label="Choose a destination" className={`grid min-w-0 gap-6 p-6 md:p-9 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] lg:items-end ${PANEL}`}>
      <div className="grid gap-4">
        <Compass size={30} aria-hidden="true" />
        <p className="eyebrow">Destination</p>
        <h2 className="font-display text-3xl leading-tight font-bold md:text-4xl">Where are you going?</h2>
        <p className="max-w-[52ch] text-lg text-muted">
          Pick a destination and every skill on that route becomes a station you can tick off. Your progress shows up here and on the route itself.
        </p>
        <Link href="/roles" className="btn btn-line w-full sm:w-fit">
          Browse all {index.roles.length} routes
        </Link>
      </div>
      <RoutePicker index={index} value={null} onChange={onRouteChange} />
    </section>
  );
}

/* ── Up next ──────────────────────────────────────────────────── */

/** Three-way progress on one skill, as small pills. Sign-in link when signed out. */
function StatusPills({ slug }: { slug: string }) {
  const path = usePath();
  if (!path || path.signedIn === undefined) return null;
  if (!path.signedIn) {
    return (
      <Link href="/login" className="link text-sm font-semibold">
        Sign in to track
      </Link>
    );
  }
  const current = path.statuses[slug] ?? null;
  const options: [SkillStatus | null, string][] = [
    [null, "To do"],
    ["learning", "Learning"],
    ["done", "Done"],
  ];
  return (
    <div role="group" aria-label="Your progress on this skill" className="inline-flex rounded-full border border-line-strong p-0.5">
      {options.map(([id, label]) => {
        const on = current === id;
        return (
          <button
            key={label}
            type="button"
            aria-pressed={on}
            onClick={() => path.setStatus(slug, id)}
            className={`h-9 rounded-full px-3.5 text-sm font-semibold transition-colors ${on ? "bg-ink text-canvas" : "text-muted hover:text-ink"}`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

/** The next few stations on the route, as a short list with each station's progress. */
export function UpNext({ index, next }: { index: PathIndex; next: string[] }) {
  return (
    <section aria-labelledby="up-next-title" className="grid gap-4">
      <h2 id="up-next-title" className="font-display text-xl font-bold">
        Up next
      </h2>
      {next.length === 0 ? (
        <p className="text-muted">Every station on this route is ticked off. Choose another destination to keep going.</p>
      ) : (
        <ul className="divide-y divide-line border-y border-line">
          {next.map((slug) => (
            <li key={slug} className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3 py-3.5">
              <Link href={`/skills/${slug}`} className="text-base font-semibold break-words hover:underline">
                {index.skills[slug]?.title ?? slug}
              </Link>
              <StatusPills slug={slug} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

/* ── 02 Saved resources ───────────────────────────────────────── */

/** Bookmarked resources, newest first, with the skill they were saved from. */
export function SavedSection({ index }: { index: PathIndex }) {
  const path = usePath();
  const saved = path?.saved ?? [];
  const [all, setAll] = useState(false);
  const shown = all ? saved : saved.slice(0, 6);

  return (
    <Section
      id="saved-title"
      num="02"
      eyebrow="Bookmarks"
      title="Saved resources"
      right={
        saved.length ? (
          <Link href="/resources" className="link inline-flex min-h-11 items-center gap-1.5 text-base font-semibold">
            Browse the library <ArrowRight size={16} aria-hidden="true" />
          </Link>
        ) : undefined
      }
    >
      {saved.length === 0 ? (
        <div className="grid gap-4 md:max-w-xl">
          <p className="text-lg text-muted">Tap the bookmark on any resource to keep it here.</p>
          <Link href="/resources" className="link w-fit text-lg font-semibold">
            Open the library
          </Link>
        </div>
      ) : (
        <>
          <ul className={ROWS}>
            {shown.map((r) => {
              const skill = r.skillSlug ? index.skills[r.skillSlug] : undefined;
              const host = new URL(r.url).hostname.replace(/^www\./, "");
              return (
                <li key={r.url} className={`${ROW} grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 py-5 md:gap-6`}>
                  <span aria-hidden="true" className="grid size-12 place-items-center rounded-full bg-surface font-display text-lg font-bold">
                    {r.title.charAt(0).toUpperCase()}
                  </span>
                  <div className="min-w-0">
                    <a href={r.url} target="_blank" rel="noopener noreferrer" className="inline-flex max-w-full items-center gap-2 font-display text-xl font-semibold hover:underline">
                      <span className="truncate">{r.title}</span>
                      <ArrowUpRight size={18} aria-hidden="true" className="shrink-0" />
                    </a>
                    <p className="mt-1 truncate text-sm text-muted">
                      {skill && r.skillSlug ? (
                        <Link href={`/skills/${r.skillSlug}`} className="hover:underline">
                          {skill.title}
                        </Link>
                      ) : (
                        host
                      )}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => path?.toggleSaved({ url: r.url, title: r.title })}
                    aria-label={`Remove ${r.title} from saved`}
                    className="min-h-11 px-2 text-sm font-semibold text-muted hover:text-ink"
                  >
                    Remove
                  </button>
                </li>
              );
            })}
          </ul>
          {saved.length > 6 && (
            <button type="button" onClick={() => setAll(!all)} className="link w-fit text-base font-semibold">
              {all ? "Show fewer" : `Show all ${saved.length}`}
            </button>
          )}
        </>
      )}
    </Section>
  );
}

/* ── 03 Projects ──────────────────────────────────────────────── */

type Project = { id: string; stage_name: string; title: string; url: string };

/** One route stage: the project built for it, or a form to add one. */
function StageProject({
  stage,
  project,
  onSave,
  onRemove,
}: {
  stage: string;
  project: Project | undefined;
  onSave: (stage: string, title: string, url: string) => Promise<string | null>;
  onRemove: (stage: string) => void;
}) {
  const [editing, setEditing] = useState(!project);
  const [title, setTitle] = useState(project?.title ?? "");
  const [url, setUrl] = useState(project?.url ?? "");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const problem = await onSave(stage, title, url);
    setSaving(false);
    setError(problem);
    if (!problem) setEditing(false);
  };

  return (
    <li className={`${ROW} grid gap-4 py-5 md:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] md:gap-8`}>
      <div className="min-w-0">
        <p className="font-display text-lg font-bold">{stage}</p>
        <p className="text-sm text-muted">{project ? "Built" : "Not added yet"}</p>
      </div>
      {project && !editing ? (
        <div className="flex min-w-0 flex-wrap items-center justify-between gap-x-6 gap-y-3">
          <a href={project.url} target="_blank" rel="noopener noreferrer" className="min-w-0 font-semibold break-words hover:underline">
            {project.title} <ArrowUpRight size={15} aria-hidden="true" className="inline align-[-2px]" />
          </a>
          <div className="flex gap-5 text-sm font-semibold">
            <button type="button" onClick={() => setEditing(true)} className="min-h-11 hover:underline">
              Change
            </button>
            <button type="button" onClick={() => onRemove(stage)} className="min-h-11 text-muted hover:text-ink hover:underline">
              Remove
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={submit} className="grid min-w-0 gap-4">
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="grid gap-1 text-sm">
              <span className="font-semibold">Project name</span>
              <input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={120} placeholder="My portfolio site" className={FIELD} />
            </label>
            <label className="grid gap-1 text-sm">
              <span className="font-semibold">Link</span>
              <input value={url} onChange={(e) => setUrl(e.target.value)} maxLength={400} inputMode="url" autoCapitalize="none" spellCheck={false} placeholder="https://" className={FIELD} />
            </label>
          </div>
          {error && (
            <p role="alert" className="text-sm font-semibold">
              {error}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-5">
            <button type="submit" disabled={saving} className="btn btn-accent disabled:opacity-40">
              {saving ? "Saving…" : "Save project"}
            </button>
            {project && (
              <button
                type="button"
                onClick={() => {
                  setEditing(false);
                  setError(null);
                  setTitle(project.title);
                  setUrl(project.url);
                }}
                className="link text-sm font-semibold"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      )}
    </li>
  );
}

/** A link to what you built for each stage. Shows on your public path page when that page is on. */
export function ProjectsSection({ userId, roleSlug, stages }: { userId: string; roleSlug: string; stages: string[] }) {
  const [rows, setRows] = useState<Project[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    supabase()
      .from("user_projects")
      .select("id, stage_name, title, url")
      .eq("user_id", userId)
      .eq("role_slug", roleSlug)
      .then(({ data }) => !cancelled && setRows((data as Project[] | null) ?? []));
    return () => {
      cancelled = true;
    };
  }, [userId, roleSlug]);

  const onSave = async (stage: string, rawTitle: string, rawUrl: string): Promise<string | null> => {
    const title = rawTitle.trim();
    const url = rawUrl.trim();
    if (!title) return "Give the project a name.";
    if (!/^https:\/\//i.test(url) || url.length > 400) return "Paste a full link that starts with https://";
    try {
      new URL(url);
    } catch {
      return "That link doesn't look right. Check it and try again.";
    }
    const { data, error } = await supabase()
      .from("user_projects")
      .upsert({ user_id: userId, role_slug: roleSlug, stage_name: stage, title: title.slice(0, 120), url }, { onConflict: "user_id,role_slug,stage_name" })
      .select("id, stage_name, title, url")
      .single();
    if (error || !data) return "Couldn't save that. Please try again.";
    setRows((prev) => [...(prev ?? []).filter((p) => p.stage_name !== stage), data as Project]);
    return null;
  };

  const onRemove = async (stage: string) => {
    const row = rows?.find((p) => p.stage_name === stage);
    if (!row) return;
    const { error } = await supabase().from("user_projects").delete().eq("id", row.id);
    if (!error) setRows((prev) => (prev ?? []).filter((p) => p.id !== row.id));
  };

  return (
    <Section id="projects-title" num="03" eyebrow="Proof of work" title="Your projects">
      <p className="max-w-[60ch] text-lg text-muted">Link the project you built for each stage. When your public path page is on, these show there.</p>
      {rows === null ? (
        <div className="h-40 animate-pulse rounded-[var(--radius-md)] bg-surface" />
      ) : (
        <ul className={ROWS}>
          {stages.map((stage) => (
            <StageProject key={stage} stage={stage} project={rows.find((p) => p.stage_name === stage)} onSave={onSave} onRemove={onRemove} />
          ))}
        </ul>
      )}
    </Section>
  );
}

/* ── 04 Streak ────────────────────────────────────────────────── */

export function StreakSection({ streak, list }: { streak: Streak | null; list: Milestone[] }) {
  return (
    <Section id="streak-title" num="04" eyebrow="Keep it going" title="Your streak">
      <StreakMilestones streak={streak} list={list} />
    </Section>
  );
}

/* ── 04 Suggestions ───────────────────────────────────────────── */

type Suggestion = { id: number; skill_slug: string; url: string; title: string | null; status: "new" | "accepted" | "declined"; created_at: string };
const SUGGESTION_STATUS = { new: "Waiting for review", accepted: "Added - thank you", declined: "Not added this time" } as const;

/** Resources this person has suggested, and where each one is in review. Hidden until there's at least one. */
export function YourSuggestions({ index, userId }: { index: PathIndex; userId: string }) {
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
    <Section id="suggestions-title" num="05" eyebrow="In review" title="Your suggestions">
      <ul className={ROWS}>
        {rows.map((r) => (
          <li key={r.id} className={`${ROW} grid gap-2 py-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-baseline sm:gap-6`}>
            <div className="min-w-0">
              <a href={r.url} target="_blank" rel="noopener noreferrer" className="font-display text-lg font-semibold break-all hover:underline">
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
            <p className="flex items-center gap-2.5 text-sm font-semibold">
              <span
                aria-hidden="true"
                className={`size-3 shrink-0 rounded-full ${r.status === "accepted" ? "bg-accent" : r.status === "declined" ? "bg-line-strong" : "border-2 border-ink"}`}
              />
              {SUGGESTION_STATUS[r.status]}
            </p>
          </li>
        ))}
      </ul>
    </Section>
  );
}

/* ── 05 Share your path ───────────────────────────────────────── */

const HANDLE = /^[a-z0-9][a-z0-9_-]{2,29}$/;

/** Choose a handle and turn the public /u/<handle> page on or off, plus the optional profile links. */
export function ShareSection({ userId, defaultName, roleTitle }: { userId: string; defaultName: string; roleTitle: string | null }) {
  const [saved, setSaved] = useState<{ handle: string; name: string; isPublic: boolean; github: string; linkedin: string; leetcode: string } | null>(null);
  const [handle, setHandle] = useState("");
  const [name, setName] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [github, setGithub] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [leetcode, setLeetcode] = useState("");
  const [state, setState] = useState<"idle" | "saving" | "saved">("idle");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let cancelled = false;
    supabase()
      .from("profiles")
      .select("handle, public_name, path_public, github_url, linkedin_url, leetcode_url")
      .eq("id", userId)
      .maybeSingle()
      .then(({ data }) => {
        if (cancelled) return;
        const row = {
          handle: data?.handle ?? "",
          name: data?.public_name ?? defaultName,
          isPublic: !!data?.path_public,
          github: data?.github_url ?? "",
          linkedin: data?.linkedin_url ?? "",
          leetcode: data?.leetcode_url ?? "",
        };
        setSaved(row);
        setHandle(row.handle);
        setName(row.name);
        setIsPublic(row.isPublic);
        setGithub(row.github);
        setLinkedin(row.linkedin);
        setLeetcode(row.leetcode);
      });
    return () => {
      cancelled = true;
    };
  }, [userId, defaultName]);

  const head = (
    <Section id="share-title" num="06" eyebrow="Public page" title="Share your path">
      <div className="h-64 animate-pulse rounded-[var(--radius-md)] bg-surface" />
    </Section>
  );
  if (!saved) return head;

  const dirty = handle !== saved.handle || name !== saved.name || isPublic !== saved.isPublic || github !== saved.github || linkedin !== saved.linkedin || leetcode !== saved.leetcode;
  const link = `${SITE.url.replace(/^https?:\/\//, "")}/u/${saved.handle}`;

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const h = handle.trim().toLowerCase();
    const n = name.trim();
    const g = normalizeLink(github);
    const l = normalizeLink(linkedin);
    const c = normalizeLink(leetcode);
    if (h && !HANDLE.test(h)) return setError("Handles are 3–30 characters: lowercase letters, numbers, - and _, starting with a letter or number.");
    if (isPublic && !h) return setError("Pick a handle first - it becomes your link.");
    if (isPublic && !n) return setError("Add the name you'd like people to see.");
    if (g && !GITHUB_URL.test(g)) return setError("Your GitHub link should look like github.com/your-name.");
    if (l && !LINKEDIN_URL.test(l)) return setError("Your LinkedIn link should look like linkedin.com/in/your-name.");
    if (c && !LEETCODE_URL.test(c)) return setError("Your LeetCode link should look like leetcode.com/your-name.");
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
      .upsert(
        {
          id: userId,
          handle: h || null,
          public_name: n || null,
          path_public: isPublic,
          github_url: g || null,
          linkedin_url: l || null,
          leetcode_url: c || null,
        },
        { onConflict: "id" },
      );
    if (err) {
      setState("idle");
      return setError(
        err.code === "23505"
          ? `@${h} is taken. Try another.`
          : err.message.includes("reserved")
            ? `@${h} is reserved. Try another.`
            : err.message.includes("_url_format")
              ? "One of your links isn't in the right format."
              : "Couldn't save that. Please try again.",
      );
    }
    setSaved({ handle: h, name: n, isPublic, github: g, linkedin: l, leetcode: c });
    setHandle(h);
    setName(n);
    setGithub(g);
    setLinkedin(l);
    setLeetcode(c);
    setState("saved");
    setTimeout(() => setState("idle"), 2500);
  };

  return (
    <Section id="share-title" num="06" eyebrow="Public page" title="Share your path">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:gap-16">
        <form onSubmit={save} className="grid gap-7">
          <p className="max-w-[60ch] text-lg text-muted">
            A page for your CV, LinkedIn or GitHub. It shows your name, route and ticked skills, plus any links you add. Never your email. Off until you turn it on.
          </p>

          <div className="grid gap-7 md:grid-cols-2">
            <label className="grid gap-1 text-sm">
              <span className="font-semibold">Handle</span>
              <span className="flex items-center border-b-2 border-line transition-colors focus-within:border-ink">
                <span className="font-display text-lg text-muted">@</span>
                <input
                  value={handle}
                  onChange={(e) => setHandle(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ""))}
                  maxLength={30}
                  autoCapitalize="none"
                  spellCheck={false}
                  placeholder="your-name"
                  className="h-12 min-w-0 flex-1 bg-transparent px-1 font-display text-lg outline-none placeholder:text-faint"
                />
              </span>
            </label>
            <label className="grid gap-1 text-sm">
              <span className="font-semibold">Name shown on the page</span>
              <input value={name} onChange={(e) => setName(e.target.value)} maxLength={60} className={FIELD} />
            </label>
          </div>

          <div className="grid gap-7 md:grid-cols-3">
            <label className="grid gap-1 text-sm">
              <span className="font-semibold">
                GitHub <span className="font-normal text-muted">(optional)</span>
              </span>
              <input value={github} onChange={(e) => setGithub(e.target.value)} maxLength={120} autoCapitalize="none" spellCheck={false} placeholder="github.com/your-name" className={FIELD} />
            </label>
            <label className="grid gap-1 text-sm">
              <span className="font-semibold">
                LinkedIn <span className="font-normal text-muted">(optional)</span>
              </span>
              <input value={linkedin} onChange={(e) => setLinkedin(e.target.value)} maxLength={120} autoCapitalize="none" spellCheck={false} placeholder="linkedin.com/in/your-name" className={FIELD} />
            </label>
            <label className="grid gap-1 text-sm">
              <span className="font-semibold">
                LeetCode <span className="font-normal text-muted">(optional)</span>
              </span>
              <input value={leetcode} onChange={(e) => setLeetcode(e.target.value)} maxLength={120} autoCapitalize="none" spellCheck={false} placeholder="leetcode.com/your-name" className={FIELD} />
            </label>
          </div>

          <label className="flex min-h-11 cursor-pointer items-center justify-between gap-4 border-y border-line py-3">
            <span className="font-display text-lg font-semibold">Make my path page public</span>
            <span className="relative inline-flex h-8 w-14 shrink-0">
              <input type="checkbox" checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} className="peer sr-only" />
              <span
                aria-hidden="true"
                className="absolute inset-0 rounded-full border-2 border-ink bg-canvas transition-colors peer-checked:bg-accent peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 after:absolute after:top-0.5 after:left-0.5 after:size-6 after:rounded-full after:bg-ink after:transition-transform peer-checked:after:translate-x-6"
              />
            </span>
          </label>
          {isPublic && !roleTitle && <p className="text-sm text-muted">Choose a destination above so your page has a route to show.</p>}
          {error && (
            <p role="alert" className="text-[15px] font-semibold">
              {error}
            </p>
          )}

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <button type="submit" disabled={!dirty || state === "saving"} className="btn btn-accent w-full disabled:opacity-40 sm:w-auto">
              {state === "saving" ? "Saving…" : "Save changes"}
            </button>
            {state === "saved" && (
              <span role="status" className="text-sm font-semibold">
                Saved
              </span>
            )}
          </div>
        </form>

        <div className="grid content-start gap-6">
          <div className="band-ink grid gap-6 rounded-[var(--radius-lg)] p-7 md:p-9">
            <p className="eyebrow">Preview · {saved.isPublic && saved.handle ? "public" : "private"}</p>
            <p className="font-display text-[clamp(1.75rem,3vw,2.4rem)] leading-[1.05] font-bold break-words">
              {name || "Your name"} {roleTitle ? <>is on the way to <span className="text-hl">{roleTitle}</span>.</> : "is mapping their route."}
            </p>
            <p className="font-mono text-sm break-all opacity-70">{saved.isPublic && saved.handle ? link : `/u/${handle || "your-handle"}`}</p>
          </div>
          {saved.isPublic && saved.handle ? (
            <div className="flex flex-wrap gap-6">
              <button
                type="button"
                onClick={async () => {
                  await navigator.clipboard.writeText(`https://${link}`);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="link inline-flex min-h-11 items-center gap-2 text-base font-semibold"
              >
                <Copy size={16} aria-hidden="true" /> {copied ? "Copied" : "Copy link"}
              </button>
              <Link href={`/u/${saved.handle}`} className="link inline-flex min-h-11 items-center gap-2 text-base font-semibold">
                View page <ArrowUpRight size={16} aria-hidden="true" />
              </Link>
            </div>
          ) : (
            <p className="flex items-center gap-2 text-muted">
              <EyeOff size={16} aria-hidden="true" /> Your path page is private until you turn it on.
            </p>
          )}
        </div>
      </div>
    </Section>
  );
}

/* ── 06 Weekly email · 07 CJ AI ───────────────────────────────── */

/** Opt in or out of the weekly progress email. Off by default. */
export function WeeklyEmailSection({ userId, email, hasRole }: { userId: string; email: string | undefined; hasRole: boolean }) {
  const [on, setOn] = useState<boolean | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    supabase()
      .from("profiles")
      .select("weekly_email")
      .eq("id", userId)
      .maybeSingle()
      .then(({ data }) => !cancelled && setOn(!!data?.weekly_email));
    return () => {
      cancelled = true;
    };
  }, [userId]);

  const toggle = async (next: boolean) => {
    setSaving(true);
    setError(false);
    setOn(next);
    const { error: err } = await supabase().from("profiles").upsert({ id: userId, weekly_email: next }, { onConflict: "id" });
    if (err) {
      setOn(!next);
      setError(true);
    }
    setSaving(false);
  };

  return (
    <Section id="email-title" num="07" eyebrow="Every Weekday" title="Weekly email">
      <div className="grid gap-6">
        <p className="text-lg text-muted">
          One short email a week: how far along your route you are, what you ticked off, and your next three stations. Sent to{" "}
          <span className="font-semibold break-all text-ink">{email}</span>.
        </p>
        <label className={`flex items-center justify-between gap-6 border-y border-line py-5 ${on === null ? "opacity-50" : "cursor-pointer"}`}>
          <span className="font-display text-xl font-semibold">Send me the weekly email</span>
          <span className="relative inline-flex h-8 w-14 shrink-0">
            <input type="checkbox" role="switch" checked={!!on} disabled={on === null || saving} onChange={(e) => toggle(e.target.checked)} className="peer sr-only" />
            <span
              aria-hidden="true"
              className="absolute inset-0 rounded-full border-2 border-ink bg-canvas transition-colors peer-checked:bg-accent peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 after:absolute after:top-0.5 after:left-0.5 after:size-6 after:rounded-full after:bg-ink after:transition-transform peer-checked:after:translate-x-6"
            />
          </span>
        </label>
        {on && !hasRole && <p className="text-sm text-muted">Choose a destination first. The email only goes out once you have a route to report on.</p>}
        {error && (
          <p role="alert" className="text-sm font-semibold">
            Couldn&apos;t save that. Please try again.
          </p>
        )}
      </div>
    </Section>
  );
}

export function CjAiSection({ asked, limit }: { asked: number | null; limit: number }) {
  const pct = asked === null ? 0 : Math.min(100, Math.round((asked / limit) * 100));
  return (
    <Section id="cjai-title" num="08" eyebrow="Ask" title="CJ AI">
      <div className="grid gap-6">
        <p className="font-display text-[clamp(4rem,9vw,6rem)] leading-none font-bold tabular-nums">
          {asked === null ? "-" : asked}
          <span className="text-3xl font-semibold text-muted"> / {limit}</span>
        </p>
        <div aria-hidden="true" className="h-2 overflow-hidden rounded-full bg-surface">
          <div className="h-full rounded-full bg-ink transition-[width] duration-500" style={{ width: `${pct}%` }} />
        </div>
        <p className="text-lg text-muted">Questions used today, from Code Journey&apos;s own pages, with sources. The allowance resets at midnight UTC.</p>
        <Link href="/faq" className="link inline-flex min-h-11 w-fit items-center gap-2 text-base font-semibold">
          How CJ AI works <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </div>
    </Section>
  );
}

/* ── 08 Look and feel ─────────────────────────────────────────── */

const MODE_OPTIONS: { id: Mode; label: string; Icon: typeof Sun }[] = [
  { id: "system", label: "System", Icon: Monitor },
  { id: "light", label: "Light", Icon: Sun },
  { id: "dark", label: "Dark", Icon: Moon },
];

/** The four palettes as colour discs, and the light/dark mode. Saves to the account when signed in. */
export function ThemeSection() {
  const ui = useUI();
  return (
    <Section id="look-title" num="09" eyebrow="Appearance" title="Look and feel">
      <div className="grid gap-12">
        <fieldset className="grid gap-6">
          <legend className="eyebrow mb-6">Palette</legend>
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
            {THEMES.map((t) => {
              const on = ui.theme === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => ui.setTheme(t.id)}
                  aria-pressed={on}
                  className="group grid justify-items-start gap-4 text-left"
                >
                  <span
                    aria-hidden="true"
                    className={`grid size-24 place-items-center rounded-full transition-transform duration-300 group-hover:scale-[1.04] ${on ? "ring-4 ring-ink ring-offset-4 ring-offset-canvas" : ""}`}
                    style={{
                      background: `conic-gradient(${t.colors[0]} 0 25%, ${t.colors[1]} 0 50%, ${t.colors[2]} 0 75%, ${t.colors[3]} 0)`,
                    }}
                  />
                  <span className="flex items-center gap-2 font-display text-xl font-bold">
                    {t.name}
                    {on && <Check size={18} aria-hidden="true" />}
                  </span>
                  <span className="text-sm text-muted">{t.names.join(" · ")}</span>
                </button>
              );
            })}
          </div>
        </fieldset>

        <fieldset className="grid gap-5">
          <legend className="eyebrow mb-5">Mode</legend>
          <div className="flex flex-wrap gap-3">
            {MODE_OPTIONS.map(({ id, label, Icon }) => {
              const on = ui.mode === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => ui.setMode(id)}
                  aria-pressed={on}
                  className={`inline-flex min-h-12 items-center gap-2.5 rounded-full px-6 font-display text-lg font-semibold transition-colors ${
                    on ? "bg-ink text-canvas" : "bg-surface hover:bg-raise"
                  }`}
                >
                  <Icon size={18} aria-hidden="true" /> {label}
                </button>
              );
            })}
          </div>
        </fieldset>

        <SaveLook />
      </div>
    </Section>
  );
}

/* ── 09 Account ───────────────────────────────────────────────── */

export function AccountSection({ email, memberSince, onSignOut }: { email: string | undefined; memberSince: string; onSignOut: () => void }) {
  return (
    <Section id="account-title" num="10" eyebrow="Your details" title="Account">
      <div className="grid gap-12 md:grid-cols-2 md:gap-16">
        <dl className="grid">
          <div className={`${ROW} grid gap-1 py-5`}>
            <dt className="eyebrow">Email</dt>
            <dd className="font-display text-xl font-semibold break-all">{email}</dd>
          </div>
          <div className={`${ROW} grid gap-1 py-5`}>
            <dt className="eyebrow">Member since</dt>
            <dd className="font-display text-xl font-semibold">{memberSince}</dd>
          </div>
        </dl>
        <div className="grid content-start gap-7">
          <p className="text-lg text-muted">
            Want a copy of your data, or all of it deleted? Email{" "}
            <a href={`mailto:${SITE.email}`} className="link font-semibold break-all text-ink">
              {SITE.email}
            </a>{" "}
            and we&apos;ll act within 30 days.
          </p>
          <button type="button" onClick={onSignOut} className="btn btn-line w-fit">
            <LogOut size={17} aria-hidden="true" /> Sign out
          </button>
        </div>
      </div>
    </Section>
  );
}
