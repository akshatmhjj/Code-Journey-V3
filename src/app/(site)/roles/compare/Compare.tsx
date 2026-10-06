"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeftRight, ArrowRight } from "lucide-react";

export type CompareRole = {
  slug: string;
  title: string;
  domain: string;
  summary: string;
  whereTheyWork: string;
  jobReady: string;
  stages: { name: string; count: number }[];
  route: string[];
  must: string[];
  rounds: string[];
  aiImpact: string;
};

const DEFAULT_A = "frontend-engineer";
const DEFAULT_B = "full-stack-engineer";

function Chip({ slug, title, tone = "line" }: { slug: string; title: string; tone?: "line" | "accent" }) {
  return (
    <Link
      href={`/skills/${slug}`}
      className={`inline-flex items-center rounded-full border-2 px-2.5 py-1 text-[14px] font-semibold transition-colors ${
        tone === "accent" ? "border-accent bg-accent text-on-accent" : "border-ink hover:bg-ink hover:text-canvas"
      }`}
    >
      {title}
    </Link>
  );
}

/** One comparison row: a label, then A and B side by side (stacked on phones). */
function Row({ label, a, b }: { label: string; a: React.ReactNode; b: React.ReactNode }) {
  return (
    <div className="grid gap-3 border-t border-line py-6 md:grid-cols-[180px_1fr_1fr] md:gap-8">
      <p className="eyebrow pt-1">{label}</p>
      <div className="min-w-0">
        <p className="mb-1.5 font-mono text-[11px] tracking-wider text-faint uppercase md:hidden">A</p>
        {a}
      </div>
      <div className="min-w-0">
        <p className="mb-1.5 font-mono text-[11px] tracking-wider text-faint uppercase md:hidden">B</p>
        {b}
      </div>
    </div>
  );
}

export function Compare({ roles, skillTitles }: { roles: CompareRole[]; skillTitles: Record<string, string> }) {
  const params = useSearchParams();
  const router = useRouter();
  const find = (s: string | null, fallback: string) => roles.find((r) => r.slug === s) ?? roles.find((r) => r.slug === fallback)!;
  const a = find(params.get("a"), DEFAULT_A);
  const b = find(params.get("b"), a.slug === DEFAULT_B ? DEFAULT_A : DEFAULT_B);

  const set = (next: { a?: string; b?: string }) => {
    const q = new URLSearchParams({ a: next.a ?? a.slug, b: next.b ?? b.slug });
    router.replace(`/roles/compare?${q}`, { scroll: false });
  };

  const inB = new Set(b.route);
  const inA = new Set(a.route);
  const shared = a.route.filter((s) => inB.has(s));
  const onlyA = a.route.filter((s) => !inB.has(s));
  const onlyB = b.route.filter((s) => !inA.has(s));
  const union = new Set([...a.route, ...b.route]).size;
  const overlap = union ? Math.round((shared.length / union) * 100) : 0;
  const t = (s: string) => skillTitles[s] ?? s;

  const select = (value: string, onChange: (v: string) => void, label: string, other: string) => (
    <label className="grid min-w-0 gap-1.5">
      <span className="font-mono text-[11.5px] tracking-wider text-muted uppercase">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-12 w-full min-w-0 rounded-full border-2 border-ink bg-canvas px-4 font-display text-lg font-bold outline-none"
      >
        {roles.map((r) => (
          <option key={r.slug} value={r.slug} disabled={r.slug === other}>
            {r.title}
          </option>
        ))}
      </select>
    </label>
  );

  return (
    <div className="wrap py-10 md:py-16">
      <p className="eyebrow">Compare</p>
      <h1 className="mt-4 max-w-[16ch] text-[clamp(2.5rem,7vw,4.75rem)] leading-[0.96] font-bold tracking-[-0.04em]">Two routes, side by side.</h1>

      <div className="mt-8 grid items-end gap-3 md:grid-cols-[1fr_auto_1fr]">
        {select(a.slug, (v) => set({ a: v }), "Route A", b.slug)}
        <button
          onClick={() => set({ a: b.slug, b: a.slug })}
          aria-label="Swap the two roles"
          className="grid size-12 place-items-center justify-self-center rounded-full border-2 border-ink hover:bg-raise"
        >
          <ArrowLeftRight size={19} />
        </button>
        {select(b.slug, (v) => set({ b: v }), "Route B", a.slug)}
      </div>

      {/* Shared skills: the headline answer */}
      <section className="band-ink mt-10 overflow-hidden rounded-[var(--radius-lg)]" aria-labelledby="shared-title">
        <div className="grid gap-5 p-6 md:p-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="font-mono text-[12px] tracking-[0.12em] text-muted uppercase">Skills in common</p>
              <h2 id="shared-title" className="mt-2 text-[clamp(1.6rem,3.2vw,2.25rem)] font-bold">
                {shared.length} shared · {overlap}% overlap
              </h2>
            </div>
            <p className="max-w-[44ch] text-[15px] text-muted">
              {overlap >= 50
                ? "These routes overlap a lot - starting one gets you well along the other."
                : overlap >= 25
                  ? "A solid shared core, then they split. Learn the shared skills first."
                  : "Quite different routes. The shared skills are mostly foundations."}
            </p>
          </div>
          {shared.length > 0 && (
            <ul className="flex flex-wrap gap-2">
              {shared.map((s) => (
                <li key={s}>
                  <Chip slug={s} title={t(s)} tone="accent" />
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <div className="mt-6">
        <Row
          label="The role"
          a={
            <div>
              <Link href={`/roles/${a.slug}`} className="font-display text-2xl font-bold hover:underline">
                {a.title}
              </Link>
              <p className="mt-2 text-muted">{a.summary}</p>
            </div>
          }
          b={
            <div>
              <Link href={`/roles/${b.slug}`} className="font-display text-2xl font-bold hover:underline">
                {b.title}
              </Link>
              <p className="mt-2 text-muted">{b.summary}</p>
            </div>
          }
        />
        <Row
          label="At a glance"
          a={
            <dl className="grid grid-cols-3 gap-3 text-sm">
              <div><dt className="text-muted">Field</dt><dd className="font-semibold">{a.domain}</dd></div>
              <div><dt className="text-muted">To job-ready</dt><dd className="font-semibold">{a.jobReady}</dd></div>
              <div><dt className="text-muted">Skills</dt><dd className="font-semibold tabular-nums">{a.route.length}</dd></div>
            </dl>
          }
          b={
            <dl className="grid grid-cols-3 gap-3 text-sm">
              <div><dt className="text-muted">Field</dt><dd className="font-semibold">{b.domain}</dd></div>
              <div><dt className="text-muted">To job-ready</dt><dd className="font-semibold">{b.jobReady}</dd></div>
              <div><dt className="text-muted">Skills</dt><dd className="font-semibold tabular-nums">{b.route.length}</dd></div>
            </dl>
          }
        />
        <Row
          label="Only on this route"
          a={<ul className="flex flex-wrap gap-2">{onlyA.map((s) => <li key={s}><Chip slug={s} title={t(s)} /></li>)}</ul>}
          b={<ul className="flex flex-wrap gap-2">{onlyB.map((s) => <li key={s}><Chip slug={s} title={t(s)} /></li>)}</ul>}
        />
        <Row
          label="Must-have skills"
          a={<p>{a.must.map(t).join(", ")}</p>}
          b={<p>{b.must.map(t).join(", ")}</p>}
        />
        <Row
          label="Stages"
          a={<ol className="grid gap-1">{a.stages.map((s, i) => <li key={s.name}><span className="font-mono text-sm text-muted">{i + 1}</span> {s.name} <span className="text-muted">· {s.count} skills</span></li>)}</ol>}
          b={<ol className="grid gap-1">{b.stages.map((s, i) => <li key={s.name}><span className="font-mono text-sm text-muted">{i + 1}</span> {s.name} <span className="text-muted">· {s.count} skills</span></li>)}</ol>}
        />
        <Row label="Where they work" a={<p>{a.whereTheyWork}</p>} b={<p>{b.whereTheyWork}</p>} />
        <Row
          label="Interviews"
          a={<ul className="grid gap-1 text-[15px]">{a.rounds.map((r) => <li key={r}>- {r}</li>)}</ul>}
          b={<ul className="grid gap-1 text-[15px]">{b.rounds.map((r) => <li key={r}>- {r}</li>)}</ul>}
        />
        <Row label="How AI is changing it" a={<p className="text-[15px]">{a.aiImpact}</p>} b={<p className="text-[15px]">{b.aiImpact}</p>} />
        <Row
          label="Next step"
          a={<Link href={`/roles/${a.slug}`} className="btn btn-ink">Open {a.title} <ArrowRight size={17} /></Link>}
          b={<Link href={`/roles/${b.slug}`} className="btn btn-ink">Open {b.title} <ArrowRight size={17} /></Link>}
        />
      </div>

      <p className="mt-8 text-muted">
        Still undecided?{" "}
        <Link href="/compass" className="link font-semibold text-ink">
          Take the 2-minute Compass quiz
        </Link>
        .
      </p>
    </div>
  );
}
