"use client";

import { useReady } from "@/lib/prep-progress";

/** Shows how many questions in one topic this device has marked as ready, with a thin progress bar. */
export function ReadyCount({ slug, total }: { slug: string; total: number }) {
  const { ready, loaded } = useReady();
  const done = Array.from({ length: total }, (_, i) => `${slug}:${i}`).filter((id) => ready.has(id)).length;
  const pct = loaded && total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <div>
      <p className="font-mono text-sm" aria-live="polite">
        {loaded ? `${done} of ${total} ready` : `${total} questions`}
      </p>
      <div className="mt-2 h-2 w-full overflow-hidden rounded-full border border-ink" role="presentation">
        <div className="h-full bg-accent transition-[width] duration-500" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
