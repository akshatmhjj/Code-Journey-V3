import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getNetwork, getRoles } from "@/lib/content";
import { LineGlyph } from "@/components/map/Line";
import { PageHead } from "@/components/ui/bits";

export const metadata: Metadata = {
  title: "Tech Career Roadmaps: Every Role, Mapped",
  description: "Frontend, backend, data, AI, DevOps, QA, security and more. Pick a tech role and see the skills it takes, in order, with the best resources for each.",
  alternates: { canonical: "/roles" },
};

/** All roles as a departures board: destination, line, stops and status. */
export default function RolesIndex() {
  const net = getNetwork();
  const written = new Map(getRoles().map((r) => [r.slug, r]));
  const domainOf = new Map(net.domains.map((d) => [d.slug, d]));
  const sorted = [...net.roles].sort((a, b) => Number(b.live) - Number(a.live) || a.wave - b.wave);

  return (
    <>
      <PageHead
        eyebrow="Departures"
        title="Where do you want to go?"
        lede="Every role on the map, with every stage, skill and resource written out."
      >
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/compass" className="btn btn-accent">
            Not sure? Take the quiz
          </Link>
          <Link href="/roles/compare" className="btn btn-line">
            Compare two roles
          </Link>
          <Link href="/gap" className="btn btn-line">
            Check a job post
          </Link>
        </div>
      </PageHead>
      <div className="wrap">
        <div className="overflow-hidden rounded-[var(--radius-lg)] border-2 border-ink">
          <div className="band-ink">
            <div className="hidden grid-cols-[1.5fr_1fr_110px_120px] gap-4 px-5 py-3 font-mono text-[11.5px] tracking-[0.12em] uppercase md:grid">
              <span>Destination</span>
              <span>Line</span>
              <span className="text-right">Stops</span>
              <span className="text-right">Status</span>
            </div>
          </div>
          <ul className="divide-y-2 divide-ink">
            {sorted.map((r) => {
              const d = domainOf.get(r.domain)!;
              const role = written.get(r.slug);
              const stops = role ? new Set(role.stages.flatMap((s) => s.skills)).size : null;
              return (
                <li key={r.slug}>
                  <Link
                    href={`/roles/${r.slug}`}
                    className="group grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-2 px-5 py-4 transition-colors hover:bg-raise md:grid-cols-[1.5fr_1fr_110px_120px]"
                  >
                    <span className="min-w-0">
                      <span className={`block font-display text-xl font-bold ${r.live ? "" : "text-muted"} group-hover:underline`}>{r.title}</span>
                      <span className="mt-0.5 block text-[15px] text-muted">{r.oneLiner}</span>
                    </span>
                    <span className="col-span-2 flex items-center gap-2.5 md:col-span-1">
                      <span className="rounded-[5px] bg-ink px-1.5 py-1 font-mono text-[11px] font-bold leading-none tracking-wider text-canvas">{d.code}</span>
                      <span className="text-[15px]">{d.name}</span>
                      <LineGlyph style={d.line} width={34} className="hidden lg:block" />
                    </span>
                    <span className="hidden text-right font-mono tabular-nums md:block">{stops ?? "-"}</span>
                    <span className="row-start-1 flex items-center justify-end gap-2 md:row-auto">
                      {r.live ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-2.5 py-1 font-mono text-[11px] font-bold tracking-wider text-on-accent uppercase">
                          Boarding <ArrowRight size={13} />
                        </span>
                      ) : (
                        <span className="rounded-full border-2 border-dashed border-line-strong px-2.5 py-0.5 font-mono text-[11px] tracking-wider text-muted uppercase">Mapping</span>
                      )}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </>
  );
}
