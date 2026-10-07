"use client";

import { useEffect, useState } from "react";
import { Check, Flame } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { computeProgress, type PathIndex } from "@/lib/path";
import { milestones } from "@/lib/milestones";
import { usePath } from "./PathProvider";

/** The weekly streak and milestone badges for the person's route, shown on My Path. */
export function StreakMilestones({ index, roleSlug }: { index: PathIndex; roleSlug: string }) {
  const path = usePath();
  const statuses = path?.statuses ?? {};
  const doneCount = Object.values(statuses).filter((s) => s === "done").length;
  const [streak, setStreak] = useState<{ weeks: number; this_week: boolean } | null>(null);

  // Re-read after every newly ticked station, so the streak updates straight away.
  useEffect(() => {
    let cancelled = false;
    supabase()
      .rpc("my_streak")
      .then(({ data }) => !cancelled && data && setStreak(data as { weeks: number; this_week: boolean }));
    return () => {
      cancelled = true;
    };
  }, [doneCount]);

  const p = computeProgress(index, roleSlug, statuses);
  if (!p) return null;
  const list = milestones(p);
  const reached = list.filter((m) => m.reached).length;

  return (
    <div className="grid gap-5 md:grid-cols-[minmax(0,260px)_1fr] md:items-start md:gap-8">
      <div className="rounded-[var(--radius-md)] bg-surface p-4">
        <p className="flex items-center gap-2 font-display text-2xl font-bold tabular-nums">
          <Flame size={24} className={streak?.weeks ? "text-hl" : "text-faint"} />
          {streak === null ? "-" : streak.weeks === 1 ? "1 week" : `${streak.weeks} weeks`}
        </p>
        <p className="mt-1 text-sm text-muted">
          {streak === null
            ? "Loading your streak…"
            : streak.weeks === 0
              ? "Tick off a station this week to start a streak."
              : streak.this_week
                ? "In a row. This week already counts."
                : "In a row. Tick off a station by Sunday to keep it going."}
        </p>
      </div>
      <div>
        <p className="eyebrow mb-3">
          Milestones · {reached} of {list.length}
        </p>
        <ol className="flex flex-wrap gap-2">
          {list.map((m) => (
            <li
              key={m.id}
              className={`inline-flex items-center gap-1.5 rounded-full border-2 px-3 py-1 text-[14px] font-semibold ${
                m.reached ? "border-ink bg-ink text-canvas" : "border-line text-faint"
              }`}
            >
              {m.reached && <Check size={14} strokeWidth={3} />}
              {m.label}
              <span className="sr-only">{m.reached ? " (reached)" : " (not yet)"}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
