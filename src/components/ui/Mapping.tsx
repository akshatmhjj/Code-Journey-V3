import Link from "next/link";
import type { Domain } from "@/lib/content";
import { Trail, type Stop } from "./Trail";
import { DomainBadge } from "./bits";

/** Placeholder for a role or skill that is on the map but not written yet. Kept out of search indexes. */
export function Mapping({ kind, title, summary, domain, trail }: { kind: "role" | "skill"; title: string; summary?: string; domain: Domain; trail: Stop[] }) {
  return (
    <>
      <Trail stops={trail} />
      <div className="wrap py-16 md:py-24">
        <DomainBadge domain={domain} />
        <h1 className="mt-6 max-w-[16ch] text-[clamp(2.5rem,7vw,5rem)] leading-[0.98] font-bold tracking-[-0.035em]">{title}</h1>
        {summary && <p className="mt-5 max-w-[56ch] text-xl text-muted">{summary}</p>}
        <div className="mt-10 max-w-xl rounded-[var(--radius-lg)] border-2 border-dashed border-ink p-6">
          <p className="flex items-center gap-3 font-display text-xl font-bold">
            <span className="size-4 rounded-full border-[3px] border-ink bg-[repeating-linear-gradient(45deg,var(--ink)_0_2px,transparent_2px_5px)]" />
            This {kind === "role" ? "route" : "station"} is being mapped
          </p>
          <p className="mt-3 text-muted">
            We&apos;re writing the full {kind === "role" ? "route — stages, skills, projects and resources" : "skill page — what to learn and the best resources"} now. Meanwhile, the rest of
            the {domain.name} line is open.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href={`/domains/${domain.slug}`} className="btn btn-ink">
              Explore {domain.name}
            </Link>
            <Link href="/roles/frontend-engineer" className="btn btn-line">
              See a finished route
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
