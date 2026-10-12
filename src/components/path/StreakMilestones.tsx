import { Check, Flame } from "lucide-react";
import type { Milestone } from "@/lib/milestones";

export type Streak = { weeks: number; this_week: boolean };

const WEEKS_SHOWN = 12;

/** The streak as a row of weeks, and the milestones as markers along the route. Pure: My Path loads the data. */
export function StreakMilestones({ streak, list }: { streak: Streak | null; list: Milestone[] }) {
  const weeks = streak?.weeks ?? 0;
  const reached = list.filter((m) => m.reached).length;
  const note =
    streak === null
      ? "Loading your streak…"
      : weeks === 0
        ? "Tick off a station this week to start a streak."
        : streak.this_week
          ? "In a row. This week already counts."
          : "In a row. Tick off a station by Sunday to keep it going.";

  return (
    <div className="grid gap-10">
      <div className="grid gap-6 md:grid-cols-[auto_1fr] md:items-end md:gap-10">
        <div className="flex items-end gap-3">
          <Flame size={36} aria-hidden="true" className={weeks ? "text-hl" : "text-faint"} />
          <p className="font-display text-[clamp(4.5rem,11vw,7rem)] leading-[0.85] font-bold tabular-nums">{weeks}</p>
          <p className="pb-1 font-display text-2xl font-semibold text-muted">{weeks === 1 ? "week" : "weeks"}</p>
        </div>
        <div className="grid gap-4">
          <p className="max-w-[44ch] text-lg text-muted">{note}</p>
          <div aria-hidden="true" className="flex flex-wrap gap-2">
            {Array.from({ length: WEEKS_SHOWN }, (_, i) => {
              const filled = i >= WEEKS_SHOWN - weeks;
              const thisWeek = i === WEEKS_SHOWN - 1 && !!streak?.this_week;
              return (
                <span
                  key={i}
                  className={`size-5 rounded-full border-2 ${
                    thisWeek ? "border-accent bg-accent" : filled ? "border-ink bg-ink" : "border-line-strong"
                  }`}
                />
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid gap-5">
        <p className="eyebrow">
          Milestones · {reached} of {list.length}
        </p>
        <ol className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-4 xl:grid-cols-7">
          {list.map((m) => (
            <li key={m.id} className="grid gap-3">
              <span
                className={`grid size-11 place-items-center rounded-full border-2 ${m.reached ? "border-ink bg-ink text-canvas" : "border-line-strong text-faint"}`}
              >
                {m.reached ? <Check size={18} strokeWidth={3} aria-hidden="true" /> : <span className="size-2 rounded-full bg-line-strong" aria-hidden="true" />}
              </span>
              <span className={`text-[15px] leading-snug font-semibold ${m.reached ? "text-ink" : "text-faint"}`}>
                {m.label}
                <span className="sr-only">{m.reached ? " (reached)" : " (not yet)"}</span>
              </span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
