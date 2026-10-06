import { ExternalLink, TriangleAlert } from "lucide-react";
import type { RoleMarket } from "@/lib/content";
import { fmtMonth, growth, lakh, SMALL_SAMPLE, usd } from "@/lib/money";

/** India range bar: 10th–90th percentile track with the average marked. Scale is 0–30 L. */
export function RangeBar({ p10, p90, avg, max = 30 }: { p10: number; p90: number; avg: number; max?: number }) {
  const pct = (n: number) => `${Math.min(100, (n / max) * 100)}%`;
  return (
    <div aria-hidden="true" className="relative h-3 rounded-full bg-surface">
      <div className="absolute inset-y-0 rounded-full bg-[color-mix(in_oklab,var(--ink)_28%,transparent)]" style={{ left: pct(p10), width: `calc(${pct(p90)} - ${pct(p10)})` }} />
      <div className="absolute top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-ink bg-accent" style={{ left: pct(avg) }} />
    </div>
  );
}

/** Pay in India and the US for one role, each with its source. Used on role pages. */
export function PayBlock({ market }: { market: RoleMarket }) {
  const { india, us } = market;
  if (!india && !us) {
    return <p className="text-muted">There&apos;s no reliable public pay data for this role yet, so we don&apos;t show a number.</p>;
  }
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {india && (
        <div className="rounded-[var(--radius-lg)] border-2 border-ink p-5 md:p-6">
          <p className="eyebrow">India · average base pay</p>
          <p className="mt-2 font-display text-4xl font-bold tabular-nums">
            {lakh(india.avg)}
            <span className="ml-1 font-sans text-base font-normal text-muted">/ year</span>
          </p>
          <div className="mt-4">
            <RangeBar p10={india.p10} p90={india.p90} avg={india.avg} />
            <p className="mt-2 flex justify-between font-mono text-[12px] text-muted tabular-nums">
              <span>{lakh(india.p10)}</span>
              <span>most earn between</span>
              <span>{lakh(india.p90)}+</span>
            </p>
          </div>
          {india.entry && (
            <p className="mt-3 text-[15px]">
              Under 1 year&apos;s experience: <span className="font-semibold tabular-nums">{lakh(india.entry)}</span>
            </p>
          )}
          <SourceLine
            href={india.url}
            label={`PayScale · ${india.profiles.toLocaleString("en-IN")} reports · ${fmtMonth(india.updated)}`}
            note={india.exact ? undefined : `closest title: ${india.title}`}
            warn={india.profiles < SMALL_SAMPLE}
          />
        </div>
      )}
      {us && (
        <div className="rounded-[var(--radius-lg)] border-2 border-ink p-5 md:p-6">
          <p className="eyebrow">United States · median pay</p>
          <p className="mt-2 font-display text-4xl font-bold tabular-nums">
            {usd(us.median)}
            <span className="ml-1 font-sans text-base font-normal text-muted">/ year</span>
          </p>
          <p className="mt-4 text-[15px]">
            Jobs projected to grow <span className="font-semibold tabular-nums">{growth(us.growth)}</span> from 2025 to 2035
            <span className="text-muted"> (all US jobs: +3.5%)</span>.
          </p>
          <SourceLine href={us.url} label="US Bureau of Labor Statistics · May 2025" note={us.exact ? undefined : `closest category: ${us.title}`} />
        </div>
      )}
    </div>
  );
}

function SourceLine({ href, label, note, warn }: { href: string; label: string; note?: string; warn?: boolean }) {
  return (
    <div className="mt-4 grid gap-1 border-t border-line pt-3 text-[13px] text-muted">
      {warn && (
        <p className="flex items-center gap-1.5 font-semibold text-ink">
          <TriangleAlert size={14} /> Small sample — treat as a rough guide
        </p>
      )}
      {note && <p>≈ {note}</p>}
      <a href={href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 hover:text-ink hover:underline">
        {label} <ExternalLink size={12} />
      </a>
    </div>
  );
}
