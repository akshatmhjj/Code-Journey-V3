import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink, Info } from "lucide-react";
import { getCatalog, getMarket, getNetwork } from "@/lib/content";
import { fmtMonth, growth, lakh } from "@/lib/money";
import { PageHead } from "@/components/ui/bits";
import { MarketTable, type MarketRow } from "./MarketTable";

export const metadata: Metadata = {
  title: "Tech Salaries in India and the US, Role by Role",
  description:
    "What 26 tech roles pay in India and the US, and which are growing fastest - from PayScale and the US Bureau of Labor Statistics, with sources and sample sizes for every number.",
  alternates: { canonical: "/market" },
};

const longDate = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

export default function MarketPage() {
  const market = getMarket();
  const net = getNetwork();
  const domains = new Map(getCatalog().domains.map((d) => [d.slug, d]));

  const rows: MarketRow[] = net.roles
    .filter((r) => r.live)
    .map((r) => {
      const m = market.roles[r.slug] ?? {};
      const d = domains.get(r.domain);
      return {
        slug: r.slug,
        title: r.title,
        domain: { slug: r.domain, name: d?.name ?? r.domain },
        india: m.india && { avg: m.india.avg, p10: m.india.p10, p90: m.india.p90, entry: m.india.entry, profiles: m.india.profiles, exact: m.india.exact, title: m.india.title },
        us: m.us && { median: m.us.median, growth: m.us.growth, exact: m.us.exact, title: m.us.title },
      };
    });

  // Headline numbers use exact title matches only, so a proxy never gets top billing.
  const exactIndia = rows.filter((r) => r.india?.exact);
  const topPay = exactIndia.reduce((a, b) => (b.india!.avg > a.india!.avg ? b : a));
  const topEntry = exactIndia.filter((r) => r.india!.entry).reduce((a, b) => (b.india!.entry! > a.india!.entry! ? b : a));
  const topGrowth = rows.filter((r) => r.us?.exact).reduce((a, b) => (b.us!.growth > a.us!.growth ? b : a));

  const sources = new Map<string, string>();
  for (const m of Object.values(market.roles)) {
    if (m.india) sources.set(m.india.url, `PayScale India - ${m.india.title} (${m.india.profiles.toLocaleString("en-IN")} reports, ${fmtMonth(m.india.updated)})`);
    if (m.us) sources.set(m.us.url, `US BLS Occupational Outlook Handbook - ${m.us.title}`);
  }

  return (
    <>
      <PageHead
        eyebrow="Market notes"
        title="What tech roles pay, and where they're growing."
        lede="Pay in India and the US for every role on the map, from public salary data. Every number links to where it came from."
      >
        <p className="mt-5 font-mono text-[12.5px] text-muted">Checked {longDate.format(market.checked)}</p>
      </PageHead>

      <div className="wrap grid gap-14 pb-20">
        <section className="band-ink overflow-hidden rounded-[var(--radius-lg)]" aria-label="Highlights">
          <dl className="grid gap-6 p-6 sm:grid-cols-3 md:p-8">
            {[
              ["Highest average in India", lakh(topPay.india!.avg), topPay],
              ["Highest starting pay in India", lakh(topEntry.india!.entry!), topEntry],
              ["Fastest US job growth, 2025–35", growth(topGrowth.us!.growth), topGrowth],
            ].map(([label, value, r]) => {
              const row = r as MarketRow;
              return (
                <div key={label as string}>
                  <dt className="font-mono text-[11.5px] tracking-[0.1em] text-muted uppercase">{label as string}</dt>
                  <dd className="mt-2 font-display text-4xl font-bold tabular-nums">{value as string}</dd>
                  <dd className="mt-1">
                    <Link href={`/roles/${row.slug}`} className="font-semibold hover:underline">
                      {row.title}
                    </Link>
                  </dd>
                </div>
              );
            })}
          </dl>
        </section>

        <aside role="note" className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 rounded-[var(--radius-md)] border-2 border-ink p-4 md:p-5">
          <Info size={20} className="mt-0.5" aria-hidden="true" />
          <p className="font-display font-bold">How to read these numbers</p>
          <ul className="col-start-2 grid list-[square] gap-1.5 pl-5 text-[15px] text-muted">
            <li>
              <strong className="text-ink">India</strong> is base salary in lakh rupees a year (₹1 L = ₹1,00,000), self-reported to PayScale. The shaded band is the 10th to 90th percentile; PayScale rounds its top band, so read the upper figure as &ldquo;about&rdquo;.
            </li>
            <li>
              <strong className="text-ink">US</strong> is the national median from the Bureau of Labor Statistics (May 2025), and growth is its projection for 2025–35. For comparison, all US jobs are projected to grow 3.5%.
            </li>
            <li>
              Sources don&apos;t always use our role names. <strong className="text-ink">≈</strong> means we used the closest title they publish - hover it to see which. <TriangleNote /> means fewer than 100 salary reports.
            </li>
            <li>Pay varies a lot by city, company and skills. Use these as a starting point for research, not a promise or a negotiation target.</li>
          </ul>
        </aside>

        <section aria-labelledby="all-title">
          <h2 id="all-title" className="mb-6 text-[clamp(1.75rem,3.4vw,2.5rem)] font-bold">
            Every role
          </h2>
          <MarketTable rows={rows} />
        </section>

        <section aria-labelledby="src-title" className="border-t-2 border-ink pt-10">
          <h2 id="src-title" className="text-2xl font-bold">
            Sources
          </h2>
          <ul className="mt-5 grid gap-2 text-[15px] md:grid-cols-2">
            {[...sources].map(([url, label]) => (
              <li key={url}>
                <a href={url} target="_blank" rel="noopener noreferrer" className="inline-flex items-start gap-1.5 text-muted hover:text-ink hover:underline">
                  {label} <ExternalLink size={13} className="mt-1 shrink-0" />
                </a>
              </li>
            ))}
            <li>
              <a href="https://www.bls.gov/news.release/ecopro.nr0.htm" target="_blank" rel="noopener noreferrer" className="inline-flex items-start gap-1.5 text-muted hover:text-ink hover:underline">
                US BLS Employment Projections 2025–35 (all jobs) <ExternalLink size={13} className="mt-1 shrink-0" />
              </a>
            </li>
          </ul>
        </section>
      </div>
    </>
  );
}

function TriangleNote() {
  return <span className="font-semibold text-ink">⚠</span>;
}
