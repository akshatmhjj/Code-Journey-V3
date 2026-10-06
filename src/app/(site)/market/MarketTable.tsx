"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { TriangleAlert } from "lucide-react";
import { growth, lakh, SMALL_SAMPLE, usd } from "@/lib/money";

export type MarketRow = {
  slug: string;
  title: string;
  domain: { slug: string; name: string };
  india?: { avg: number; p10: number; p90: number; entry?: number; profiles: number; exact: boolean; title: string };
  us?: { median: number; growth: number; exact: boolean; title: string };
};

const SORTS = {
  india: { label: "India average", key: (r: MarketRow) => r.india?.avg ?? -1 },
  entry: { label: "India starting pay", key: (r: MarketRow) => r.india?.entry ?? -1 },
  growth: { label: "US job growth", key: (r: MarketRow) => r.us?.growth ?? -999 },
  us: { label: "US median", key: (r: MarketRow) => r.us?.median ?? -1 },
  name: { label: "A–Z", key: () => 0 },
} as const;
type Sort = keyof typeof SORTS;

const MAX = 30;
const pct = (n: number) => `${Math.min(100, (n / MAX) * 100)}%`;

export function MarketTable({ rows }: { rows: MarketRow[] }) {
  const [sort, setSort] = useState<Sort>("india");
  const [domain, setDomain] = useState<string | null>(null);
  const domains = useMemo(() => [...new Map(rows.map((r) => [r.domain.slug, r.domain])).values()], [rows]);
  const shown = useMemo(() => {
    const list = rows.filter((r) => !domain || r.domain.slug === domain);
    const key = SORTS[sort].key;
    return [...list].sort((a, b) => (sort === "name" ? a.title.localeCompare(b.title) : key(b) - key(a) || a.title.localeCompare(b.title)));
  }, [rows, sort, domain]);

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by field">
          {[{ slug: null, name: "All fields" }, ...domains].map((d) => (
            <button
              key={d.slug ?? "all"}
              onClick={() => setDomain(d.slug)}
              aria-pressed={domain === d.slug}
              className={`rounded-full border-2 px-3 py-1 text-[14px] font-medium ${domain === d.slug ? "border-ink bg-ink text-canvas" : "border-line hover:border-ink"}`}
            >
              {d.name}
            </button>
          ))}
        </div>
        <label className="flex items-center gap-2 text-sm">
          <span className="text-muted">Sort by</span>
          <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} className="h-10 rounded-full border-2 border-ink bg-canvas px-3 font-semibold outline-none">
            {Object.entries(SORTS).map(([k, v]) => (
              <option key={k} value={k}>
                {v.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="hidden grid-cols-[minmax(0,1.3fr)_minmax(0,1.6fr)_90px_120px] gap-6 border-b-2 border-ink pb-2 font-mono text-[11.5px] tracking-wider text-muted uppercase md:grid">
        <span>Role</span>
        <span>India · base pay, most earn in the shaded band</span>
        <span className="text-right">Starting</span>
        <span className="text-right">US median · growth</span>
      </div>

      <ol className="grid">
        {shown.map((r) => (
          <li key={r.slug} className="grid gap-3 border-b border-line py-4 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1.6fr)_90px_120px] md:items-center md:gap-6">
            <div className="min-w-0">
              <Link href={`/roles/${r.slug}#market`} className="font-display text-lg font-bold hover:underline">
                {r.title}
              </Link>
              <p className="text-sm text-muted">{r.domain.name}</p>
            </div>

            {r.india ? (
              <div className="grid gap-1.5">
                <div className="flex items-baseline justify-between gap-3 text-[15px]">
                  <span className="font-semibold tabular-nums">
                    {lakh(r.india.avg)} <span className="font-normal text-muted">avg</span>
                    {!r.india.exact && (
                      <span className="ml-1 text-muted" title={`Closest PayScale title: ${r.india.title}`}>
                        ≈
                      </span>
                    )}
                  </span>
                  <span className="font-mono text-[12px] text-muted tabular-nums">
                    {lakh(r.india.p10)}–{lakh(r.india.p90)}
                    {r.india.profiles < SMALL_SAMPLE && (
                      <span title={`Only ${r.india.profiles} salary reports`} className="ml-1.5 inline-flex translate-y-[2px] text-ink">
                        <TriangleAlert size={13} aria-label={`small sample, ${r.india.profiles} reports`} />
                      </span>
                    )}
                  </span>
                </div>
                <div aria-hidden="true" className="relative h-2.5 rounded-full bg-surface">
                  <div
                    className="absolute inset-y-0 rounded-full bg-[color-mix(in_oklab,var(--ink)_28%,transparent)]"
                    style={{ left: pct(r.india.p10), width: `calc(${pct(r.india.p90)} - ${pct(r.india.p10)})` }}
                  />
                  <div className="absolute top-1/2 size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-ink bg-accent" style={{ left: pct(r.india.avg) }} />
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted">No reliable public figure</p>
            )}

            <p className="flex justify-between text-[15px] tabular-nums md:block md:text-right">
              <span className="text-muted md:hidden">Starting (India)</span>
              {r.india?.entry ? lakh(r.india.entry) : <span className="text-muted">-</span>}
            </p>

            <p className="flex justify-between text-[15px] tabular-nums md:block md:text-right">
              <span className="text-muted md:hidden">US median · growth</span>
              {r.us ? (
                <span>
                  {usd(r.us.median)} · <span className={r.us.growth >= 15 ? "font-bold" : ""}>{growth(r.us.growth)}</span>
                  {!r.us.exact && (
                    <span className="ml-1 text-muted" title={`Closest BLS category: ${r.us.title}`}>
                      ≈
                    </span>
                  )}
                </span>
              ) : (
                <span className="text-muted">-</span>
              )}
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
}
