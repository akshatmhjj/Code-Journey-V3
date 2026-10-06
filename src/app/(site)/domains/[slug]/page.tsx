import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { getCatalog, getDomain, getNetwork, getSkills } from "@/lib/content";
import { LinePath } from "@/components/map/Line";
import { SectionTitle, SkillStation } from "@/components/ui/bits";
import { Trail } from "@/components/ui/Trail";

export function generateStaticParams() {
  return getCatalog().domains.map((d) => ({ slug: d.slug }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps<"/domains/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const d = getDomain(slug);
  if (!d) return {};
  const title = d.slug === "foundations" ? "Programming Foundations: Where Every Tech Career Starts" : `${d.name} Careers: Roles, Skills and Resources`;
  return { title, description: `${d.tagline} Every ${d.name.toLowerCase()} role and skill on Code Journey, with routes and the best resources.`, alternates: { canonical: `/domains/${slug}` } };
}

export default async function DomainPage({ params }: PageProps<"/domains/[slug]">) {
  const { slug } = await params;
  const d = getDomain(slug);
  if (!d) notFound();
  const net = getNetwork();
  const roles = net.roles.filter((r) => r.domain === slug);
  const skills = net.skills.filter((s) => s.domain === slug);
  const briefs = new Map(getSkills().map((s) => [s.slug, s.brief]));

  return (
    <>
      <Trail stops={[{ label: "Network", href: "/roles" }, { label: d.name }]} />
      <header className="wrap pt-10 pb-6 md:pt-16">
        <p className="eyebrow flex items-center gap-3">
          <span className="rounded-[5px] bg-ink px-1.5 py-1 font-mono text-[11px] font-bold leading-none tracking-wider text-canvas normal-case">{d.code}</span>
          {d.slug === "foundations" ? "The interchange" : "Line"}
        </p>
        <h1 className="mt-5 text-[clamp(3rem,9vw,7rem)] leading-[0.9] font-bold tracking-[-0.045em]">{d.name}</h1>
        <p className="mt-5 max-w-[50ch] text-xl text-muted">{d.tagline}</p>
      </header>

      {/* The line itself, running off the edge of the page */}
      <div aria-hidden="true" className="overflow-hidden py-6">
        <svg viewBox="0 0 1400 40" preserveAspectRatio="none" className="h-10 w-full">
          <LinePath d="M-10 20H1410" style={d.line} scale={1.6} />
        </svg>
      </div>

      <div className="wrap grid gap-16 pt-6">
        {roles.length > 0 && (
          <section aria-labelledby="roles-title">
            <SectionTitle eyebrow="Destinations" title={`Roles on the ${d.name} line`} id="roles-title" />
            <div className="grid gap-4 md:grid-cols-2">
              {roles.map((r) => (
                <Link
                  key={r.slug}
                  href={`/roles/${r.slug}`}
                  className={`group rounded-[var(--radius-lg)] border-2 p-6 transition-shadow ${r.live ? "border-ink hover:shadow-[5px_5px_0_var(--ink)]" : "border-dashed border-line-strong"}`}
                >
                  <span className="flex items-center justify-between gap-3">
                    <span className="font-display text-2xl font-bold group-hover:underline">{r.title}</span>
                    {r.live ? <ArrowRight className="shrink-0 transition-transform group-hover:translate-x-1" /> : <span className="font-mono text-[11px] tracking-wider text-muted uppercase">Mapping</span>}
                  </span>
                  <span className="mt-2 block text-muted">{r.oneLiner}</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section aria-labelledby="skills-title">
          <SectionTitle eyebrow="Stations" title={d.slug === "foundations" ? "Skills almost every route shares" : `${d.name} skills`} id="skills-title" />
          <ul className="grid gap-x-10 gap-y-1 md:grid-cols-2">
            {skills.map((s) => (
              <li key={s.slug} className="flex flex-col gap-1.5 border-b border-line py-4">
                <SkillStation skill={s} />
                {briefs.get(s.slug) && <span className="text-[15px] text-muted">{briefs.get(s.slug)}</span>}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}
