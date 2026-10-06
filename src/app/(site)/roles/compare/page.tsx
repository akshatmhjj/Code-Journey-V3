import type { Metadata } from "next";
import { Suspense } from "react";
import { getCatalog, getNetwork, getRoles } from "@/lib/content";
import { Compare, type CompareRole } from "./Compare";

export const metadata: Metadata = {
  title: "Compare Tech Roles Side by Side",
  description: "Frontend or full-stack? Data analyst or data scientist? Compare any two tech roles - skills in common, time to job-ready, interviews and how AI is changing each.",
  alternates: { canonical: "/roles/compare" },
};

/** "10–14" week ranges for the first three stages → "7–10 months". */
function jobReady(weeks: (string | undefined)[]) {
  let lo = 0;
  let hi = 0;
  for (const w of weeks) {
    const m = w?.match(/(\d+)\D+(\d+)/);
    if (m) {
      lo += +m[1];
      hi += +m[2];
    }
  }
  return hi ? `${Math.round(lo / 4.3)}–${Math.round(hi / 4.3)} months` : "Varies";
}

export default function ComparePage() {
  const domains = new Map(getCatalog().domains.map((d) => [d.slug, d.name]));
  const entries = new Map(getNetwork().roles.map((r) => [r.slug, r]));
  const titles = Object.fromEntries(getNetwork().skills.map((s) => [s.slug, s.title.replace(/\s*\(.*\)$/, "")]));

  const roles: CompareRole[] = getRoles()
    .map((r) => ({
      slug: r.slug,
      title: r.title,
      domain: domains.get(entries.get(r.slug)?.domain ?? "") ?? "",
      summary: r.summary,
      whereTheyWork: r.whereTheyWork,
      jobReady: jobReady(r.stages.slice(0, 3).map((s) => s.weeks)),
      stages: r.stages.map((s) => ({ name: s.name, count: s.skills.length })),
      route: [...new Set([...r.stages.flatMap((s) => s.skills), ...r.skills.must, ...r.skills.should, ...r.skills.nice])],
      must: r.skills.must,
      rounds: r.interview.rounds,
      aiImpact: r.aiImpact,
    }))
    .sort((a, b) => a.title.localeCompare(b.title));

  return (
    <Suspense>
      <Compare roles={roles} skillTitles={titles} />
    </Suspense>
  );
}
