import { Flag, Hammer } from "lucide-react";
import type { Role, SkillEntry } from "@/lib/content";
import { SkillStation } from "@/components/ui/bits";

/** A role's route drawn vertically: each stage is a station; its skills hang off it as smaller stations. */
export function RouteStages({ stages, skillOf }: { stages: Role["stages"]; skillOf: (slug: string) => SkillEntry }) {
  return (
    <ol className="relative">
      {stages.map((s, i) => {
        const last = i === stages.length - 1;
        return (
          <li key={s.name} className="relative grid grid-cols-[44px_1fr] gap-x-4 md:grid-cols-[64px_1fr] md:gap-x-6">
            <div className="relative flex justify-center">
              {!last && <span aria-hidden="true" className="absolute top-2 bottom-0 w-[7px] bg-ink" />}
              {last && <span aria-hidden="true" className="absolute top-2 h-14 w-[7px] bg-[repeating-linear-gradient(var(--ink)_0_8px,transparent_8px_14px)]" />}
              <span
                className={`relative z-10 grid size-11 place-items-center rounded-full border-[6px] border-ink font-mono text-sm font-bold md:size-14 md:text-base ${
                  i === 0 ? "bg-accent text-on-accent" : "bg-canvas"
                }`}
              >
                {i + 1}
              </span>
            </div>
            <div className={`min-w-0 ${last ? "pb-2" : "pb-14 md:pb-16"}`}>
              <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 pt-1.5 md:pt-3">
                <h3 className="text-[clamp(1.5rem,2.6vw,2rem)] font-bold">{s.name}</h3>
                {s.weeks && <span className="font-mono text-[12.5px] text-muted">{s.weeks} weeks · ~10 h/week</span>}
              </div>
              <p className="mt-2 max-w-[60ch] text-lg text-muted">{s.summary}</p>
              <ul className="mt-5 flex flex-wrap gap-2.5" aria-label={`${s.name} skills`}>
                {s.skills.map((slug) => (
                  <li key={slug}>
                    <SkillStation skill={skillOf(slug)} />
                  </li>
                ))}
              </ul>
              <div className="mt-6 grid gap-3 md:grid-cols-2">
                <div className="rounded-[var(--radius-md)] bg-surface p-4">
                  <p className="flex items-center gap-2 font-display font-bold">
                    <Hammer size={17} /> Build this
                  </p>
                  <p className="mt-1.5">{s.project}</p>
                </div>
                <div className="rounded-[var(--radius-md)] border-2 border-ink p-4">
                  <p className="flex items-center gap-2 font-display font-bold">
                    <Flag size={17} /> You&apos;re done when
                  </p>
                  <p className="mt-1.5">{s.doneWhen}</p>
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
