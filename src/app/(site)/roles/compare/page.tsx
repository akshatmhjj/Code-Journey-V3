import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ArrowRight } from "lucide-react";
import { getCompareRoles, getComparePairs, pairSlug } from "@/lib/content";
import { PageHead } from "@/components/ui/bits";
import { ComparePicker } from "./ComparePicker";

export const metadata: Metadata = {
  title: "Compare Tech Roles Side by Side",
  description:
    "Frontend or full-stack? Data analyst or data scientist? Compare any two tech roles — skills in common, pay, time to job-ready, interviews and how AI is changing each.",
  alternates: { canonical: "/roles/compare" },
};

export default function CompareHub() {
  const roles = getCompareRoles();
  const title = new Map(roles.map((r) => [r.slug, r.title]));
  const domain = new Map(roles.map((r) => [r.slug, r.domain]));
  // Group popular pairs by the field of the first role, so the list scans like a timetable.
  const groups = new Map<string, { a: string; b: string }[]>();
  for (const p of getComparePairs()) {
    const d = domain.get(p.a) ?? "Other";
    groups.set(d, [...(groups.get(d) ?? []), p]);
  }

  return (
    <>
      <PageHead eyebrow="Compare" title="Two routes, side by side." lede="Pick any two roles to see the skills they share, pay, time to job-ready, interviews and how AI is changing each.">
        <Suspense>
          <ComparePicker roles={roles.map((r) => ({ slug: r.slug, title: r.title }))} />
        </Suspense>
      </PageHead>

      <div className="wrap pb-20">
        <h2 className="mb-6 border-t-2 border-ink pt-10 text-[clamp(1.75rem,3.4vw,2.5rem)] font-bold">Popular comparisons</h2>
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {[...groups].map(([d, pairs]) => (
            <section key={d} aria-label={d}>
              <p className="eyebrow mb-3">{d}</p>
              <ul className="grid">
                {pairs.map((p) => (
                  <li key={pairSlug(p.a, p.b)}>
                    <Link
                      href={`/roles/compare/${pairSlug(p.a, p.b)}`}
                      className="group flex items-center justify-between gap-3 border-b border-line py-2.5 font-display font-semibold hover:underline"
                    >
                      <span>
                        {title.get(p.a)} <span className="font-sans font-normal text-muted">vs</span> {title.get(p.b)}
                      </span>
                      <ArrowRight size={16} className="shrink-0 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
        <p className="mt-10 text-muted">
          Still undecided?{" "}
          <Link href="/compass" className="link font-semibold text-ink">
            Take the 2-minute Compass quiz
          </Link>
          .
        </p>
      </div>
    </>
  );
}
