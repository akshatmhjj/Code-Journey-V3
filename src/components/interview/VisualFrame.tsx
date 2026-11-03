import type { ReactNode } from "react";

/** A picture with a small caption, shown inside the concept or question it explains. */
export function VisualFrame({ title, hint, children }: { title: string; hint: string; children: ReactNode }) {
  return (
    <figure>
      <figcaption className="mb-3">
        <span className="font-mono text-xs tracking-wide text-muted uppercase">{title}</span>
        <span className="mt-1 block text-sm text-muted">{hint}</span>
      </figcaption>
      {children}
    </figure>
  );
}

/** Class names for the small toggle buttons used inside the visuals. */
export const toggleClass = (on: boolean) => `btn min-h-10 px-4 text-sm ${on ? "btn-ink" : "btn-line"}`;

/** Keeps the animations in each visual short, and turns them off for people who prefer reduced motion. */
export const motionStyles = `
@media (prefers-reduced-motion: reduce) {
  .cj-visual * { animation: none !important; transition: none !important; }
}`;
