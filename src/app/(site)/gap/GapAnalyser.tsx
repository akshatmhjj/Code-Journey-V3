"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { ArrowRight, ArrowUpRight, BadgeCheck, Check, Flag, Info, Lock, Scale, ScanSearch } from "lucide-react";
import { analyse, learningOrder, type Analysis, type GapData } from "@/lib/gap";
import { GAP_EXAMPLES } from "@/lib/gap-examples";
import { formatHours, formatWeeks, parseHours, type SkillStatus } from "@/lib/path";
import { usePath } from "@/components/path/PathProvider";
import { SkillProgress } from "@/components/path/SkillProgress";

const MAX_CHARS = 20_000;

/** Prerequisites (transitively) of the given skills that aren't in the list themselves. */
function missingFoundations(data: GapData, slugs: string[]) {
  const bySlug = new Map(data.skills.map((s) => [s.slug, s]));
  const inPost = new Set(slugs);
  const out = new Set<string>();
  const walk = (slug: string) => {
    for (const p of bySlug.get(slug)?.prereqs ?? []) {
      if (!inPost.has(p) && !out.has(p)) {
        out.add(p);
        walk(p);
      }
    }
  };
  slugs.forEach(walk);
  return [...out];
}

export function GapAnalyser({ data }: { data: GapData }) {
  const path = usePath();
  const [text, setText] = useState("");
  const [result, setResult] = useState<Analysis | null>(null);
  // Signed-out visitors can still tick what they know; it just isn't saved.
  const [local, setLocal] = useState<Record<string, SkillStatus>>({});
  const resultsRef = useRef<HTMLDivElement>(null);

  const signedIn = !!path?.signedIn;
  const saved = path?.statuses;
  const statuses = useMemo(() => (signedIn ? (saved ?? {}) : local), [signedIn, saved, local]);
  const skill = useMemo(() => new Map(data.skills.map((s) => [s.slug, s])), [data.skills]);

  function run(input = text) {
    const r = analyse(data, input.slice(0, MAX_CHARS));
    setResult(r);
    setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  }

  const view = useMemo(() => {
    if (!result) return null;
    const mentions = Object.fromEntries(result.found.map((f) => [f.slug, f.mentions]));
    const slugs = result.found.map((f) => f.slug);
    const allFoundations = missingFoundations(data, slugs);
    // "Already have" includes foundations you've ticked, so they don't just disappear.
    const have = [...slugs, ...allFoundations].filter((s) => statuses[s] === "done");
    const learning = [...slugs, ...allFoundations].filter((s) => statuses[s] === "learning");
    const toLearn = learningOrder(data, slugs.filter((s) => !statuses[s]), mentions);
    const foundations = learningOrder(data, allFoundations.filter((s) => !statuses[s]), {});
    const hours = [...toLearn, ...foundations].reduce<[number, number]>(
      (acc, s) => {
        const [lo, hi] = parseHours(skill.get(s)?.hours);
        return [acc[0] + lo, acc[1] + hi];
      },
      [0, 0],
    );
    return { mentions, slugs, have, learning, toLearn, foundations, hours };
  }, [result, data, skill, statuses]);

  const top = result?.roles[0];

  return (
    <div className="wrap py-10 md:py-16">
      <p className="eyebrow">Gap checker</p>
      <h1 className="mt-4 max-w-[15ch] text-[clamp(2.5rem,7vw,5rem)] leading-[0.95] font-bold tracking-[-0.04em]">Paste a job post. See what&apos;s missing.</h1>
      <p className="mt-5 max-w-[58ch] text-lg text-muted">
        We&apos;ll pick out the skills it asks for, check them against your route, and point you to the best place to learn each one you don&apos;t have yet.
      </p>

      <aside
        role="note"
        aria-labelledby="gap-note-title"
        className="mt-8 grid max-w-[78ch] grid-cols-[auto_1fr] gap-x-3 gap-y-1 rounded-[var(--radius-md)] border-2 border-ink p-4 md:p-5"
      >
        <Info size={20} className="mt-0.5" aria-hidden="true" />
        <p id="gap-note-title" className="font-display font-bold">
          Before you paste: a quick note
        </p>
        <div className="col-start-2 grid gap-1.5 text-[15px] text-muted">
          <p>
            This is an automated check that runs on our side only, so the results may not be fully accurate. It looks for skill names and common synonyms from Code Journey&apos;s own list, so it can miss
            skills written in unusual ways, misread a word used in another sense, or give weight to a &ldquo;nice to have&rdquo; as if it were required.
          </p>
          <p>
            It isn&apos;t a judgement of whether you&apos;re right for the job, and it doesn&apos;t know what the employer will actually ask. Time estimates are rough
            averages. Always read the full post yourself, and treat this as a starting point for what to learn next.
          </p>
        </div>
      </aside>

      <div className="mt-6 grid gap-4">
        <label htmlFor="gap-text" className="sr-only">
          Job post
        </label>
        <textarea
          id="gap-text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={MAX_CHARS}
          rows={10}
          placeholder="Paste the full job description here - responsibilities, requirements, nice-to-haves…"
          className="w-full resize-y rounded-[var(--radius-lg)] border-2 border-ink bg-canvas p-4 text-[16px] leading-relaxed outline-none placeholder:text-faint focus:shadow-[4px_4px_0_var(--ink)] md:p-5"
        />
        <div className="flex flex-wrap items-center gap-3">
          <button onClick={() => run()} disabled={!text.trim()} className="btn btn-accent disabled:opacity-40">
            <ScanSearch size={18} /> Check this post
          </button>
          <span className="text-sm text-muted">Or try an example:</span>
          {GAP_EXAMPLES.map((ex) => (
            <button
              key={ex.label}
              onClick={() => {
                setText(ex.text);
                run(ex.text);
              }}
              className="rounded-full border-2 border-line px-3 py-1 text-[15px] font-medium hover:border-ink"
            >
              {ex.label}
            </button>
          ))}
        </div>
        <p className="flex items-center gap-2 text-sm text-muted">
          <Lock size={14} /> Runs entirely in your browser. The job post is never uploaded or stored.
        </p>
      </div>

      <div ref={resultsRef} className="scroll-mt-28">
        {result && view && (
          <div className="mt-14 grid gap-10">
            {result.found.length === 0 ? (
              <div className="rounded-[var(--radius-lg)] border-2 border-dashed border-ink p-6">
                <p className="font-display text-xl font-bold">No skills we recognise in that text.</p>
                <p className="mt-2 text-muted">Try pasting the full post, including the requirements section.</p>
              </div>
            ) : (
              <>
                {/* Summary */}
                <section className="band-ink overflow-hidden rounded-[var(--radius-lg)]" aria-labelledby="gap-summary">
                  <div className="grid gap-6 p-6 md:grid-cols-[1.3fr_1fr] md:p-8">
                    <div>
                      <p className="font-mono text-[12px] tracking-[0.12em] text-muted uppercase">This post looks like</p>
                      <h2 id="gap-summary" className="mt-2 text-[clamp(1.8rem,4vw,2.75rem)] leading-tight font-bold">
                        {top ? top.title : "A mix of roles"}
                      </h2>
                      {result.roles.length > 1 && (
                        <p className="mt-2 text-muted">Also close: {result.roles.slice(1).map((r) => r.title).join(", ")}</p>
                      )}
                      {top && (
                        <div className="mt-5 flex flex-wrap gap-2">
                          <Link href={`/roles/${top.slug}`} className="btn btn-accent">
                            See the route <ArrowRight size={17} />
                          </Link>
                          {signedIn && path?.roleSlug !== top.slug && (
                            <button onClick={() => path?.setRole(top.slug)} className="btn btn-line">
                              <Flag size={16} /> Make this my route
                            </button>
                          )}
                          {signedIn && path?.roleSlug && path.roleSlug !== top.slug && (
                            <Link href={`/roles/compare/${path.roleSlug}-vs-${top.slug}`} className="btn btn-line">
                              <Scale size={16} /> Compare with my route
                            </Link>
                          )}
                        </div>
                      )}
                    </div>
                    <dl className="grid grid-cols-2 gap-4 self-end">
                      {[
                        ["Skills asked for", result.found.length],
                        ["You have", view.have.length],
                        ["Learning", view.learning.length],
                        ["To learn", view.toLearn.length + view.foundations.length],
                      ].map(([k, v]) => (
                        <div key={k as string}>
                          <dt className="text-sm text-muted">{k}</dt>
                          <dd className="font-display text-3xl font-bold tabular-nums">{v}</dd>
                        </div>
                      ))}
                      <div className="col-span-2 text-sm text-muted">
                        {view.hours[1] > 0
                          ? `About ${formatHours(view.hours)} to close the gap - ${formatWeeks(view.hours)} at 10 hours a week.`
                          : "You already have everything this post asks for."}
                      </div>
                    </dl>
                  </div>
                </section>

                {!signedIn && (
                  <p className="rounded-[var(--radius-md)] bg-surface px-4 py-3 text-[15px]">
                    Tick what you already know to see your real gap.{" "}
                    <Link href="/login" className="link font-semibold">
                      Sign in
                    </Link>{" "}
                    to save it to My Path and track it over time.
                  </p>
                )}

                {/* Foundations first */}
                {view.foundations.length > 0 && (
                  <section aria-labelledby="gap-foundations">
                    <h2 id="gap-foundations" className="text-2xl font-bold">
                      Foundations you&apos;ll need first
                    </h2>
                    <p className="mt-1 mb-4 max-w-[62ch] text-muted">
                      The post doesn&apos;t mention these, but the skills it asks for build on them. Employers assume you have them.
                    </p>
                    <SkillRows slugs={view.foundations} data={data} local={local} setLocal={setLocal} />
                  </section>
                )}

                {/* To learn */}
                {view.toLearn.length > 0 && (
                  <section aria-labelledby="gap-learn">
                    <h2 id="gap-learn" className="text-2xl font-bold">
                      To learn, in a sensible order
                    </h2>
                    <p className="mt-1 mb-4 text-muted">Prerequisites first, then what the post mentions most.</p>
                    <SkillRows slugs={view.toLearn} data={data} local={local} setLocal={setLocal} mentions={view.mentions} />
                  </section>
                )}

                {/* Learning / have */}
                {(view.learning.length > 0 || view.have.length > 0) && (
                  <section className="grid gap-8 md:grid-cols-2">
                    {view.learning.length > 0 && (
                      <div>
                        <h2 className="text-xl font-bold">Learning now</h2>
                        <SkillRows slugs={view.learning} data={data} local={local} setLocal={setLocal} compact />
                      </div>
                    )}
                    {view.have.length > 0 && (
                      <div>
                        <h2 className="text-xl font-bold">Already have</h2>
                        <SkillRows slugs={view.have} data={data} local={local} setLocal={setLocal} compact />
                      </div>
                    )}
                  </section>
                )}

                {result.notCovered.length > 0 && (
                  <section className="border-t-2 border-ink pt-6">
                    <p className="eyebrow">Also mentioned - not on Code Journey yet</p>
                    <ul className="mt-3 flex flex-wrap gap-2">
                      {result.notCovered.map((n) => (
                        <li key={n} className="rounded-full border-2 border-dashed border-line-strong px-3 py-1 text-[15px] text-muted">
                          {n}
                        </li>
                      ))}
                    </ul>
                  </section>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

type Local = { local: Record<string, SkillStatus>; setLocal: React.Dispatch<React.SetStateAction<Record<string, SkillStatus>>> };

/** Signed in: the saved To do / Learning / Done control. Signed out: a local "I know this" toggle. */
function Toggle({ slug, local, setLocal }: { slug: string } & Local) {
  const path = usePath();
  if (path?.signedIn) return <SkillProgress slug={slug} compact />;
  const known = local[slug] === "done";
  return (
    <button
      onClick={() =>
        setLocal((l) => {
          const next = { ...l };
          if (known) delete next[slug];
          else next[slug] = "done";
          return next;
        })
      }
      aria-pressed={known}
      className={`inline-flex h-9 items-center gap-1.5 rounded-full border-2 px-3 font-display text-sm font-semibold ${
        known ? "border-ink bg-ink text-canvas" : "border-ink hover:bg-raise"
      }`}
    >
      <Check size={14} strokeWidth={3} /> {known ? "I know this" : "I know this?"}
    </button>
  );
}

function SkillRows({
  slugs,
  data,
  local,
  setLocal,
  mentions,
  compact = false,
}: {
  slugs: string[];
  data: GapData;
  mentions?: Record<string, number>;
  compact?: boolean;
} & Local) {
  const bySlug = new Map(data.skills.map((s) => [s.slug, s]));
  return (
    <ul className={`divide-y divide-line border-y-2 border-ink ${compact ? "mt-3" : ""}`}>
      {slugs.map((slug) => {
        const s = bySlug.get(slug);
        if (!s) return null;
        return (
          <li key={slug} className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 py-3.5">
            <div className="min-w-0">
              <Link href={`/skills/${slug}`} className="font-display text-lg font-semibold hover:underline">
                {s.title}
              </Link>
              {!compact && (
                <p className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
                  {s.level && <span className="capitalize">{s.level}</span>}
                  {s.hours && <span>{s.hours} hours</span>}
                  {mentions?.[slug] && mentions[slug] > 1 && <span>mentioned {mentions[slug]}×</span>}
                  {s.resource && (
                    <a href={s.resource.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-semibold text-ink hover:underline">
                      {s.resource.official && <BadgeCheck size={14} />}
                      {s.resource.title} <ArrowUpRight size={13} />
                    </a>
                  )}
                </p>
              )}
            </div>
            <Toggle slug={slug} local={local} setLocal={setLocal} />
          </li>
        );
      })}
    </ul>
  );
}
