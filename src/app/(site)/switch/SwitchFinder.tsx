"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, Info } from "lucide-react";
import { bridgeRoles, type RouteRole, type SwitchJob } from "@/lib/switch";

const MAX_SHOWN = 4;

export function SwitchFinder({ jobs, roles, skillTitles }: { jobs: SwitchJob[]; roles: RouteRole[]; skillTitles: Record<string, string> }) {
  const [slug, setSlug] = useState<string | null>(null);
  const job = jobs.find((j) => j.slug === slug) ?? null;
  const bridges = useMemo(() => (job ? bridgeRoles(job, roles) : []), [job, roles]);
  const title = (s: string) => skillTitles[s] ?? s;

  return (
    <div className="wrap py-10 md:py-16">
      <p className="eyebrow">Switch</p>
      <h1 className="mt-4 max-w-[18ch] text-[clamp(2.5rem,7vw,5rem)] leading-[0.95] font-bold tracking-[-0.04em]">Already working in something else? Start from there.</h1>
      <p className="mt-5 max-w-[58ch] text-lg text-muted">
        Pick what you do now. We&apos;ll show the tech roles closest to it, the skills you may already have, and where to start.
      </p>

      <div role="group" aria-label="Your current work" className="mt-10 flex flex-wrap gap-2">
        {jobs.map((j) => (
          <button
            key={j.slug}
            type="button"
            aria-pressed={j.slug === slug}
            onClick={() => setSlug(j.slug)}
            className={`rounded-full border-2 px-4 py-2 text-[15px] font-medium ${j.slug === slug ? "border-ink bg-ink text-canvas" : "border-line hover:border-ink"}`}
          >
            {j.title}
          </button>
        ))}
      </div>

      {!job && <p className="mt-10 text-muted">Choose the work that is closest to yours to see your options.</p>}

      {job && (
        <div className="mt-12 grid gap-12" aria-live="polite">
          <section className="grid gap-4">
            <h2 className="font-display text-2xl font-bold">{job.title}</h2>
            <p className="max-w-[60ch] text-muted">{job.summary}</p>
            <h3 className="mt-2 font-bold">Strengths that often carry over</h3>
            <ul className="grid list-disc gap-1 pl-5">
              {job.strengths.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
            <h3 className="mt-2 font-bold">Skills you may already have a head start on</h3>
            <ul className="flex flex-wrap gap-2">
              {job.skills.map((s) => (
                <li key={s} className="rounded-full border-2 border-line px-3 py-1 text-[15px]">
                  {title(s)}
                </li>
              ))}
            </ul>
          </section>

          <section className="grid gap-4">
            <h2 className="font-display text-2xl font-bold">Closest tech roles</h2>
            {bridges.length === 0 ? (
              <p className="text-muted">
                None of the role routes share a skill with this job yet. Browse <Link href="/roles" className="font-semibold text-ink underline">every role</Link> instead.
              </p>
            ) : (
              <ol className="grid gap-4">
                {bridges.map((b) => {
                  const rest = b.toLearn.length - MAX_SHOWN;
                  return (
                    <li key={b.slug} className="grid gap-3 rounded-[var(--radius-lg)] border-2 border-line p-5">
                      <p className="font-display text-xl font-bold">
                        <Link href={`/roles/${b.slug}`} className="underline decoration-accent decoration-2 underline-offset-4">
                          {b.title}
                        </Link>
                      </p>
                      <p className="text-sm text-muted">
                        You may already cover {b.have.length} of the {b.have.length + b.toLearn.length} skills on this route.
                      </p>
                      <p>
                        <span className="font-semibold">Learn next:</span> {b.toLearn.slice(0, MAX_SHOWN).map(title).join(", ")}
                        {rest > 0 && <span className="text-muted"> and {rest} more</span>}
                      </p>
                      {b.startAt && (
                        <p className="text-sm text-muted">
                          Start at: {b.startAt}
                        </p>
                      )}
                      <Link href={`/roles/${b.slug}`} className="btn btn-line w-fit">
                        Open the route <ArrowRight size={16} />
                      </Link>
                    </li>
                  );
                })}
              </ol>
            )}
          </section>

          <p className="flex max-w-[70ch] items-start gap-2 text-sm text-muted">
            <Info size={14} className="mt-0.5 shrink-0" aria-hidden="true" />
            These are general patterns, not promises. Read each role&apos;s page and check the skills on it before you decide.
          </p>
        </div>
      )}
    </div>
  );
}
