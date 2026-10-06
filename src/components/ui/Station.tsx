"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import type { SkillEntry } from "@/lib/content";
import { usePath } from "@/components/path/PathProvider";

type Skill = SkillEntry | { slug: string; title: string; live: boolean };

/**
 * A skill shown as a station: linked when it has a page, muted when still being mapped.
 * For signed-in people it also shows where they are with it.
 */
export function SkillStation({ skill, here = false }: { skill: Skill; here?: boolean }) {
  const path = usePath();
  const status = path?.statuses[skill.slug];

  // Chips show the short name; "Microcontrollers (Arduino, ESP32, STM32)" → "Microcontrollers".
  const title = skill.title.replace(/\s*\(.*\)$/, "");

  const dot =
    status === "done" ? (
      <span aria-hidden="true" className="grid size-4 shrink-0 place-items-center rounded-full bg-accent text-on-accent">
        <Check size={11} strokeWidth={3.5} />
      </span>
    ) : (
      <span
        aria-hidden="true"
        className={`size-3.5 shrink-0 rounded-full border-[3px] ${
          status === "learning" ? "border-accent bg-canvas" : here ? "border-ink bg-accent" : skill.live ? "border-ink bg-canvas" : "border-line-strong bg-canvas"
        }`}
      />
    );

  const note = status === "done" ? " (done)" : status === "learning" ? " (learning)" : "";

  if (!skill.live)
    return (
      <span
        className="inline-flex items-center gap-2 rounded-full border-2 border-dashed border-line-strong px-3 py-1.5 text-[15px] text-muted"
        title="Skill page being written"
      >
        {dot}
        {title}
      </span>
    );

  return (
    <Link
      href={`/skills/${skill.slug}`}
      className="inline-flex items-center gap-2 rounded-full border-2 border-ink px-3 py-1.5 text-[15px] font-semibold transition-colors hover:bg-ink hover:text-canvas"
    >
      {dot}
      {title}
      {note && <span className="sr-only">{note}</span>}
    </Link>
  );
}
