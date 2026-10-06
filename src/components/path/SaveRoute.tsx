"use client";

import Link from "next/link";
import { ArrowRight, Check, Flag } from "lucide-react";
import { computeProgress, formatHours, formatWeeks, type PathIndex } from "@/lib/path";
import { usePath } from "./PathProvider";

/** Role page sidebar: make this your route, then see how far along you are. */
export function SaveRoute({ index, roleSlug, roleTitle }: { index: PathIndex; roleSlug: string; roleTitle: string }) {
  const path = usePath();
  if (!path || path.signedIn === undefined) return null;

  if (!path.signedIn) {
    return (
      <div className="rounded-[var(--radius-md)] border-2 border-dashed border-line-strong p-4 text-sm text-muted">
        <p className="font-display font-semibold text-ink">Save this route</p>
        <p className="mt-1">Track your progress station by station — free, and every page stays open to read.</p>
        <Link href="/login" className="btn btn-line mt-3 min-h-9 w-full text-sm">
          Sign in to save
        </Link>
      </div>
    );
  }

  const mine = path.roleSlug === roleSlug;
  if (!mine) {
    return (
      <div className="rounded-[var(--radius-md)] border-2 border-ink p-4 text-sm">
        <p className="font-display font-semibold">Working towards this?</p>
        <p className="mt-1 text-muted">
          {path.roleSlug ? "This replaces your current route. Your ticked skills are kept." : "Set it as your route and tick off each station as you go."}
        </p>
        <button onClick={() => path.setRole(roleSlug)} className="btn btn-accent mt-3 min-h-9 w-full text-sm">
          <Flag size={15} /> Make this my route
        </button>
      </div>
    );
  }

  const p = computeProgress(index, roleSlug, path.statuses);
  if (!p) return null;

  return (
    <div className="rounded-[var(--radius-md)] border-2 border-ink p-4">
      <p className="flex items-center gap-1.5 font-display text-sm font-bold">
        <Check size={15} strokeWidth={3} /> Your route
      </p>
      <p className="mt-2 font-display text-2xl font-bold tabular-nums">{p.percent}%</p>
      <div aria-hidden="true" className="mt-2 h-2 overflow-hidden rounded-full bg-surface">
        <div className="h-full rounded-full bg-accent" style={{ width: `${p.percent}%` }} />
      </div>
      <p className="mt-2 text-sm text-muted">
        {p.done} of {p.total} stations · {formatHours(p.hoursLeft)} left
      </p>
      {p.next.length > 0 && (
        <p className="mt-3 text-sm">
          <span className="text-muted">Next: </span>
          <Link href={`/skills/${p.next[0]}`} className="font-semibold hover:underline">
            {index.skills[p.next[0]]?.title ?? p.next[0]}
          </Link>
        </p>
      )}
      <Link href="/me" className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold hover:underline">
        My Path <ArrowRight size={14} />
      </Link>
      <p className="mt-3 border-t border-line pt-2 text-[12.5px] text-muted">
        {formatWeeks(p.hoursLeft) ? `${formatWeeks(p.hoursLeft)} at 10 hours a week` : `You've finished every station on ${roleTitle}.`}
      </p>
    </div>
  );
}
