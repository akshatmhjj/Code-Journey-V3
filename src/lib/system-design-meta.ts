/** Plain constants for the System Design section. No server-only import, so client components can use them too. */

import type { LineStyle } from "./content";

export const LEVELS = ["beginner", "intermediate", "advanced"] as const;
export type Level = (typeof LEVELS)[number];

export const LEVEL_LABEL: Record<Level, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

/** One line on who each level is for, shown above the grouped paths. */
export const LEVEL_NOTE: Record<Level, string> = {
  beginner: "New to system design, or revising the basics.",
  intermediate: "You know the building blocks and want to use them in real designs.",
  advanced: "You want the depth behind the designs, and the trade-offs.",
};

export const TOPICS = ["HLD", "LLD", "Backend Engineering", "Engineering Articles", "Distributed Systems", "Microservices", "Machine Learning", "AI Engineering"] as const;
export type Topic = (typeof TOPICS)[number];

/** The writer of the original threads and articles. Shown wherever this section shows a summary. */
export const CREATOR = { handle: "@Harry_The_Nerd", url: "https://x.com/Harry_The_Nerd" } as const;

/** What the button to the original should say, depending on where it goes. */
export function sourceLabel(url: string) {
  return new URL(url).hostname.endsWith("x.com") ? "Read the original thread on X" : "Read the original article";
}

/** Each line gets its own pattern, the same way the role map tells lines apart. */
export const LINE_STYLES: LineStyle[] = ["solid", "double", "dashed", "dotted", "dashdot", "hollow", "short", "thin"];
export const lineStyleFor = (index: number): LineStyle => LINE_STYLES[index % LINE_STYLES.length];
