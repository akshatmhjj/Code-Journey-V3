import { Pill } from "@/components/ui/bits";
import { LEVEL_LABEL, type Level } from "@/lib/system-design-meta";

const TONE = { beginner: "line", intermediate: "ink", advanced: "accent" } as const;

/** The level as a small pill. The word is always shown, so the meaning never depends on colour alone. */
export function LevelBadge({ level }: { level: Level }) {
  return <Pill tone={TONE[level]}>{LEVEL_LABEL[level]}</Pill>;
}
