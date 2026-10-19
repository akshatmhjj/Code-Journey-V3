"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { computeProgress, type PathIndex } from "@/lib/path";
import { usePath } from "@/components/path/PathProvider";

/** For signed-in people with a route: where they are and what comes next. Renders nothing otherwise. */
export function ContinueCard({ index }: { index: PathIndex }) {
  const path = usePath();
  if (!path || path.loading || !path.signedIn || !path.roleSlug) return null;
  const role = index.roles.find((r) => r.slug === path.roleSlug);
  const progress = role ? computeProgress(index, role.slug, path.statuses) : null;
  if (!role || !progress) return null;
  const next = progress.next[0];

  return (
    <section aria-label="Continue your route" className="wrap">
      <div className="grid gap-6 border-t-2 border-ink py-8 md:grid-cols-[minmax(0,1fr)_auto] md:items-center md:gap-10">
        <div className="grid min-w-0 gap-3">
          <p className="eyebrow">Continue your route</p>
          <p className="font-display text-2xl font-bold break-words md:text-3xl">
            {role.title} <span className="text-muted">· {progress.percent}%</span>
          </p>
          <div aria-hidden="true" className="h-2 max-w-md overflow-hidden rounded-full bg-surface">
            <div className="h-full rounded-full bg-accent transition-[width] duration-500" style={{ width: `${progress.percent}%` }} />
          </div>
          {next && (
            <p className="text-muted">
              Next up: <span className="font-semibold text-ink">{index.skills[next]?.title ?? next}</span>
            </p>
          )}
        </div>
        <div className="flex flex-col gap-3 sm:flex-row md:flex-col">
          <Link href="/me" className="btn btn-ink">
            Open My Path <ArrowRight size={17} aria-hidden="true" />
          </Link>
          {next && (
            <Link href={`/skills/${next}`} className="btn btn-line">
              Go to {index.skills[next]?.title ?? next}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
