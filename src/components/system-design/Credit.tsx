import { CREATOR } from "@/lib/system-design-meta";

/** Credit for the writer of the original threads and articles. Shown wherever this section shows a summary. */
export function Credit({ className = "" }: { className?: string }) {
  return (
    <p className={`text-sm leading-relaxed text-muted ${className}`}>
      Original threads and articles by{" "}
      <a href={CREATOR.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-ink underline underline-offset-4">
        {CREATOR.handle}
      </a>
      . Summaries and layout by Code Journey.
    </p>
  );
}
