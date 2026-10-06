"use client";

import Link from "next/link";
import { Check, Circle, CircleDot } from "lucide-react";
import type { SkillStatus } from "@/lib/path";
import { usePath } from "./PathProvider";

const OPTIONS: { id: SkillStatus | null; label: string; Icon: typeof Circle }[] = [
  { id: null, label: "To do", Icon: Circle },
  { id: "learning", label: "Learning", Icon: CircleDot },
  { id: "done", label: "Done", Icon: Check },
];

/** Three-state control: where someone is with one skill. */
export function SkillProgress({ slug, label = "Where are you with this?", compact = false }: { slug: string; label?: string; compact?: boolean }) {
  const path = usePath();
  if (!path || path.signedIn === undefined) return null;

  if (!path.signedIn) {
    if (compact) return null;
    return (
      <p className="text-sm text-muted">
        <Link href="/login" className="link font-semibold text-ink">
          Sign in
        </Link>{" "}
        to track this skill on your route.
      </p>
    );
  }

  const current = path.statuses[slug] ?? null;
  return (
    <div className={compact ? "" : "grid gap-2"}>
      {!compact && <p className="eyebrow">{label}</p>}
      <div
        role="group"
        aria-label={`Progress on this skill`}
        className={`grid grid-cols-3 rounded-full border-2 border-ink p-1 ${compact ? "w-[232px] text-[13px]" : ""}`}
      >
        {OPTIONS.map(({ id, label: text, Icon }) => {
          const on = current === id;
          return (
            <button
              key={text}
              onClick={() => path.setStatus(slug, id)}
              aria-pressed={on}
              className={`flex items-center justify-center gap-1.5 rounded-full font-display font-semibold ${compact ? "h-8" : "h-10 text-sm"} ${
                on ? "bg-ink text-canvas" : "hover:bg-raise"
              }`}
            >
              <Icon size={compact ? 13 : 15} strokeWidth={id === "done" ? 3 : 2} /> {text}
            </button>
          );
        })}
      </div>
    </div>
  );
}
