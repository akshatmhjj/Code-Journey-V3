import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Clock, Gauge } from "lucide-react";
import { getDomain, getNetwork, getSkill, getSkillEntry, getSkills, getSnippets, rolesUsingSkill, type SkillEntry } from "@/lib/content";
import { highlight, renderMarkdown } from "@/lib/markdown";
import { SITE } from "@/lib/site";
import { Trail } from "@/components/ui/Trail";
import { DomainBadge, ResourceList, SectionTitle, SkillStation } from "@/components/ui/bits";
import { Mapping } from "@/components/ui/Mapping";
import { JsonLd } from "@/components/ui/JsonLd";
import { AskBand } from "@/components/shell/AskBand";

export function generateStaticParams() {
  return getNetwork().skills.map((s) => ({ slug: s.slug }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps<"/skills/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const entry = getSkillEntry(slug);
  if (!entry) return {};
  const skill = getSkill(slug);
  if (!skill) return { title: entry.title, robots: { index: false } };
  return {
    title: `Learn ${skill.title}: What to Know and the Best Free Resources`,
    description: `${skill.brief} What to learn, in order, plus the official docs and best free resources for ${skill.title}.`,
    alternates: { canonical: `/skills/${slug}` },
  };
}

const CODE_LANG: Record<string, string> = { nodejs: "javascript", react: "jsx", flutter: "dart", "react-native": "jsx" };

const LEVEL = { beginner: "Beginner-friendly", intermediate: "Intermediate", advanced: "Advanced" };

function entry(slug: string): SkillEntry {
  return getSkillEntry(slug) ?? { slug, title: slug, domain: "", live: false };
}

export default async function SkillPage({ params }: PageProps<"/skills/[slug]">) {
  const { slug } = await params;
  const e = getSkillEntry(slug);
  if (!e) notFound();
  const domain = getDomain(e.domain)!;
  const skill = getSkill(slug);
  const trail = [{ label: "Skills", href: "/skills" }, { label: domain.name, href: `/domains/${domain.slug}` }, { label: e.title }];
  if (!skill) return <Mapping kind="skill" title={e.title} domain={domain} trail={trail} />;

  const body = await renderMarkdown(skill.body);
  const snippets = await Promise.all(
    getSnippets()
      .filter((s) => s.skill === slug)
      .map(async (s) => ({ ...s, html: await highlight(s.code, CODE_LANG[slug] ?? slug) })),
  );
  const roles = rolesUsingSkill(slug);
  const next = getSkills().filter((s) => s.prereqs.includes(slug));
  const fmt = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });

  return (
    <>
      <Trail stops={trail} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "LearningResource",
          name: `Learn ${skill.title}`,
          description: skill.brief,
          educationalLevel: skill.level,
          teaches: skill.learn.map((l) => l.topic),
          url: `${SITE.url}/skills/${slug}`,
          isAccessibleForFree: true,
        }}
      />
      <header className="wrap pt-10 pb-10 md:pt-16 md:pb-14">
        <DomainBadge domain={domain} />
        <h1 className="mt-6 text-[clamp(3rem,9vw,6.5rem)] leading-[0.92] font-bold tracking-[-0.045em]">{skill.title}</h1>
        <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_1fr] lg:gap-12">
          <div className="rounded-[var(--radius-lg)] border-2 border-ink p-6 md:p-7">
            <p className="eyebrow">The 60-second brief</p>
            <p className="mt-3 font-display text-[clamp(1.35rem,2.4vw,1.75rem)] leading-snug font-semibold">{skill.brief}</p>
            <p className="mt-4 text-muted">
              Below: what to learn, in order, then the best places to learn it. Official docs are always first.
            </p>
          </div>
          <dl className="grid content-start gap-4 text-[15px]">
            <div className="flex items-center gap-3">
              <Gauge size={18} />
              <dt className="sr-only">Level</dt>
              <dd className="font-semibold">{LEVEL[skill.level]}</dd>
            </div>
            {skill.hours && (
              <div className="flex items-center gap-3">
                <Clock size={18} />
                <dt className="sr-only">Time</dt>
                <dd>
                  <span className="font-semibold">{skill.hours} hours</span> <span className="text-muted">to get comfortable</span>
                </dd>
              </div>
            )}
            <div>
              <dt className="mb-2 text-sm text-muted">{skill.prereqs.length ? "Learn first" : "Prerequisites"}</dt>
              <dd className="flex flex-wrap gap-2">
                {skill.prereqs.length ? skill.prereqs.map((p) => <SkillStation key={p} skill={entry(p)} />) : <span>None. A good first station.</span>}
              </dd>
            </div>
          </dl>
        </div>
      </header>

      <div className="wrap grid gap-16">
        <section aria-labelledby="learn-title" className="border-t-2 border-ink pt-10">
          <SectionTitle eyebrow="Checklist" title="What to learn" id="learn-title" />
          <ol className="grid gap-x-10 md:grid-cols-2">
            {skill.learn.map((l, i) => (
              <li key={l.topic} className="grid grid-cols-[36px_1fr] gap-3 border-b border-line py-4">
                <span className="font-mono text-sm font-bold text-muted tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                <div className="min-w-0">
                  <p className="font-display text-lg font-bold">{l.topic}</p>
                  <p className="mt-1 text-[15px] break-words text-muted">{l.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="res-title" className="border-t-2 border-ink pt-10">
          <SectionTitle eyebrow={`Checked ${fmt.format(skill.checked)}`} title="Where to learn it" id="res-title" />
          <ResourceList resources={skill.resources} />
        </section>

        <section className="border-t-2 border-ink pt-10">
          <div className="prose" dangerouslySetInnerHTML={{ __html: body }} />
        </section>

        {snippets.length > 0 && (
          <section aria-labelledby="snip-title" className="border-t-2 border-ink pt-10">
            <SectionTitle eyebrow="Copy and adapt" title="Snippets" id="snip-title" />
            <div className="grid gap-6 lg:grid-cols-2">
              {snippets.map((s) => (
                <figure key={s.id} className="min-w-0">
                  <figcaption className="mb-2 flex items-baseline gap-3">
                    <span className="font-display font-bold">{s.title}</span>
                    <span className="text-sm text-muted">{s.description}</span>
                  </figcaption>
                  <div dangerouslySetInnerHTML={{ __html: s.html }} />
                </figure>
              ))}
            </div>
          </section>
        )}

        {(roles.length > 0 || next.length > 0) && (
          <section className="grid gap-10 border-t-2 border-ink pt-10 md:grid-cols-2">
            {roles.length > 0 && (
              <div>
                <p className="eyebrow mb-3">On these routes</p>
                <ul className="grid gap-3">
                  {roles.map((r) => (
                    <li key={r.slug}>
                      <Link href={`/roles/${r.slug}`} className="group flex items-center justify-between rounded-[var(--radius-md)] border-2 border-ink p-4 font-display text-lg font-bold">
                        {r.title} <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {next.length > 0 && (
              <div>
                <p className="eyebrow mb-3">Next stations</p>
                <ul className="flex flex-wrap gap-2.5">
                  {next.map((n) => (
                    <li key={n.slug}>
                      <SkillStation skill={entry(n.slug)} />
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        )}
      </div>

      <div className="mt-20">
        <AskBand title={`Stuck on ${skill.title}?`} question={`Explain the hardest part of ${skill.title} for a beginner.`} />
      </div>
    </>
  );
}
