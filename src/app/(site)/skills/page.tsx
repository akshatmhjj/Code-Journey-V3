import type { Metadata } from "next";
import Link from "next/link";
import { getNetwork, getSkills } from "@/lib/content";
import { DomainBadge, PageHead, SkillStation } from "@/components/ui/bits";

export const metadata: Metadata = {
  title: "Every Tech Skill, Explained with the Best Resources",
  description: "Browse every skill on the Code Journey map — from HTML and SQL to Kubernetes and RAG — with a 60-second brief, a learning checklist and the best free resources.",
  alternates: { canonical: "/skills" },
};

export default function SkillsIndex() {
  const net = getNetwork();
  const written = new Map(getSkills().map((s) => [s.slug, s]));
  const live = net.skills.filter((s) => s.live).length;
  return (
    <>
      <PageHead
        eyebrow="Stations"
        title="Every skill on the map."
        lede={`${net.skills.length} skills across ${net.domains.length} lines. ${live} have full pages today — a brief, a checklist and checked resources. The rest are being written.`}
      />
      <div className="wrap grid gap-14">
        {net.domains.map((d) => {
          const skills = net.skills.filter((s) => s.domain === d.slug);
          if (!skills.length) return null;
          const liveHere = skills.filter((s) => s.live);
          return (
            <section key={d.slug} className="border-t-2 border-ink pt-8" aria-label={d.name}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <DomainBadge domain={d} />
                <span className="font-mono text-[12px] text-muted">
                  {liveHere.length}/{skills.length} written
                </span>
              </div>
              {liveHere.length > 0 && (
                <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {liveHere.map((s) => (
                    <li key={s.slug}>
                      <Link href={`/skills/${s.slug}`} className="group block h-full rounded-[var(--radius-lg)] border-2 border-ink p-5 transition-shadow hover:shadow-[4px_4px_0_var(--ink)]">
                        <span className="flex items-center gap-2.5">
                          <span className="size-3.5 rounded-full border-[3px] border-ink bg-accent" />
                          <span className="font-display text-xl font-bold group-hover:underline">{s.title}</span>
                        </span>
                        <span className="mt-2 block text-[15px] text-muted">{written.get(s.slug)?.brief}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
              <ul className="mt-5 flex flex-wrap gap-2">
                {skills
                  .filter((s) => !s.live)
                  .map((s) => (
                    <li key={s.slug}>
                      <SkillStation skill={s} />
                    </li>
                  ))}
              </ul>
            </section>
          );
        })}
      </div>
    </>
  );
}
