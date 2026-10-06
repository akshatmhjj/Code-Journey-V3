import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Bot, Clock, ExternalLink, Layers, ListChecks } from "lucide-react";
import { getDomain, getMarket, getNetwork, getPathIndex, getRole, getRoleEntry, getSkillEntry, type SkillEntry } from "@/lib/content";
import { renderMarkdown } from "@/lib/markdown";
import { SITE } from "@/lib/site";
import { Trail } from "@/components/ui/Trail";
import { DomainBadge, ResourceList, SectionTitle, SkillStation } from "@/components/ui/bits";
import { RouteStages } from "@/components/map/RouteStages";
import { AskBand } from "@/components/shell/AskBand";
import { SaveRoute } from "@/components/path/SaveRoute";
import { JsonLd } from "@/components/ui/JsonLd";
import { Mapping } from "@/components/ui/Mapping";
import { PayBlock } from "@/components/market/PayBlock";

export function generateStaticParams() {
  return getNetwork().roles.map((r) => ({ slug: r.slug }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps<"/roles/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const role = getRole(slug);
  const entry = getRoleEntry(slug);
  if (!entry) return {};
  if (!role) return { title: `${entry.title} roadmap`, description: entry.oneLiner, robots: { index: false } };
  return {
    title: `${role.title} Roadmap ${role.updated.getUTCFullYear()}: Skills, Order and Resources`,
    description: `${role.summary.split(". ")[0]}. See every skill a ${role.title} needs, in order, with the best official docs and free resources.`,
    alternates: { canonical: `/roles/${slug}` },
  };
}

function skillOf(slug: string): SkillEntry {
  return getSkillEntry(slug) ?? { slug, title: slug, domain: "", live: false };
}

function totalWeeks(weeks: (string | undefined)[]) {
  let lo = 0;
  let hi = 0;
  for (const w of weeks) {
    const m = w?.match(/(\d+)\D+(\d+)/);
    if (m) {
      lo += +m[1];
      hi += +m[2];
    }
  }
  return hi ? `${Math.round(lo / 4.3)}–${Math.round(hi / 4.3)} months` : null;
}

const TOC = [
  ["day", "The job"],
  ["route", "The route"],
  ["skills", "Skills by priority"],
  ["interviews", "Interviews"],
  ["market", "Pay and market"],
  ["more", "Is it for you?"],
];

export default async function RolePage({ params }: PageProps<"/roles/[slug]">) {
  const { slug } = await params;
  const entry = getRoleEntry(slug);
  if (!entry) notFound();
  const domain = getDomain(entry.domain)!;
  const role = getRole(slug);
  const trail = [{ label: "Network", href: "/roles" }, { label: domain.name, href: `/domains/${domain.slug}` }, { label: entry.title }];

  if (!role) return <Mapping kind="role" title={entry.title} summary={entry.oneLiner} domain={domain} trail={trail} />;

  const body = await renderMarkdown(role.body);
  const jobReady = totalWeeks(role.stages.slice(0, 3).map((s) => s.weeks));
  const allSkills = new Set(role.stages.flatMap((s) => s.skills));
  const adjacent = role.adjacent.map((a) => getRoleEntry(a)).filter((a) => !!a);

  // Just this route's data, so the client component stays small.
  const full = getPathIndex();
  const thisRole = full.roles.find((r) => r.slug === slug)!;
  const onRoute = new Set(thisRole.stages.flatMap((st) => st.skills));
  const pathIndex = { roles: [thisRole], skills: Object.fromEntries([...onRoute].filter((k) => full.skills[k]).map((k) => [k, full.skills[k]])) };
  const fmt = new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric", timeZone: "UTC" });

  return (
    <>
      <Trail stops={trail} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Occupation",
          name: role.title,
          alternateName: role.aliases,
          description: role.summary,
          skills: role.skills.must.map((s) => skillOf(s).title).join(", "),
          url: `${SITE.url}/roles/${slug}`,
        }}
      />

      <header className="wrap pt-10 pb-12 md:pt-16 md:pb-16">
        <DomainBadge domain={domain} />
        <h1 className="mt-6 max-w-[14ch] text-[clamp(2.75rem,8vw,6rem)] leading-[0.95] font-bold tracking-[-0.04em]">{role.title}</h1>
        <p className="mt-6 max-w-[58ch] text-lg md:text-xl">{role.summary}</p>
        {role.aliases.length > 0 && (
          <p className="mt-3 text-muted">
            Also called: <span className="text-ink">{role.aliases.join(", ")}</span>
          </p>
        )}
        <dl className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-[var(--radius-lg)] border-2 border-ink bg-ink md:grid-cols-4">
          {[
            { Icon: Layers, k: "Stages", v: `${role.stages.length}` },
            { Icon: ListChecks, k: "Skills on the route", v: `${allSkills.size}` },
            { Icon: Clock, k: "To job-ready", v: jobReady ?? "Varies" },
            { Icon: Bot, k: "Updated", v: fmt.format(role.updated) },
          ].map(({ Icon, k, v }) => (
            <div key={k} className="bg-canvas p-4 md:p-5">
              <dt className="flex items-center gap-2 text-sm text-muted">
                <Icon size={15} /> {k}
              </dt>
              <dd className="mt-1 font-display text-2xl font-bold">{v}</dd>
            </div>
          ))}
        </dl>
        {jobReady && <p className="mt-3 text-sm text-muted">Time is a rough range at about 10 hours a week, through the first three stages.</p>}
      </header>

      <div className="wrap grid gap-12 lg:grid-cols-[1fr_250px] lg:gap-16">
        <div className="min-w-0">
          <section id="day" className="border-t-2 border-ink pt-10" aria-labelledby="day-title">
            <SectionTitle eyebrow="The job" title="A week in the life" id="day-title" />
            <ul className="grid gap-3 md:grid-cols-2">
              {role.dayInLife.map((d) => (
                <li key={d} className="flex gap-3 rounded-[var(--radius-md)] bg-surface p-4">
                  <span aria-hidden="true" className="mt-2 size-2.5 shrink-0 rounded-full bg-ink" />
                  {d}
                </li>
              ))}
            </ul>
            <p className="mt-6 max-w-[65ch] text-muted">
              <span className="font-semibold text-ink">Where they work: </span>
              {role.whereTheyWork}
            </p>
          </section>

          <section id="route" className="mt-20 border-t-2 border-ink pt-10" aria-labelledby="route-title">
            <SectionTitle eyebrow="The route" title={`Your route to ${role.title}`} id="route-title" />
            <p className="mb-10 max-w-[62ch] text-muted">
              Take the stations in order. Each one links to a skill page with what to learn and the best resources.
              {[...allSkills].some((x) => !skillOf(x).live) && " Dashed stations are still being written."}
            </p>
            <RouteStages stages={role.stages} skillOf={skillOf} />
          </section>

          <section id="skills" className="mt-20 border-t-2 border-ink pt-10" aria-labelledby="skills-title">
            <SectionTitle eyebrow="Priorities" title="Skills, by how much they matter" id="skills-title" />
            <div className="grid gap-8 md:grid-cols-3">
              {(
                [
                  ["must", "Must have", "Expected in nearly every job post."],
                  ["should", "Should have", "Common, and a big edge when you have it."],
                  ["nice", "Nice to have", "Sets you apart, or comes with seniority."],
                ] as const
              ).map(([k, t, d]) => (
                <div key={k}>
                  <h3 className="text-xl font-bold">{t}</h3>
                  <p className="mt-1 mb-4 text-sm text-muted">{d}</p>
                  <ul className="flex flex-wrap gap-2">
                    {role.skills[k].map((s) => (
                      <li key={s}>
                        <SkillStation skill={skillOf(s)} />
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <h3 className="mt-12 text-xl font-bold">Tools you&apos;ll touch</h3>
            <ul className="mt-4 flex flex-wrap gap-2">
              {role.tools.map((t) => (
                <li key={t} className="rounded-full bg-surface px-3 py-1.5 text-[15px]">
                  {t}
                </li>
              ))}
            </ul>
          </section>

          <section id="interviews" className="mt-20 border-t-2 border-ink pt-10" aria-labelledby="int-title">
            <SectionTitle eyebrow="Getting hired" title="What the interviews look like" id="int-title" />
            <ol className="grid gap-3">
              {role.interview.rounds.map((r, i) => (
                <li key={r} className="grid grid-cols-[36px_1fr] items-baseline gap-3">
                  <span className="font-mono text-sm font-bold text-muted">R{i + 1}</span>
                  <span className="text-lg">{r}</span>
                </li>
              ))}
            </ol>
            <h3 className="mt-10 mb-2 text-xl font-bold">Where to practise</h3>
            <ResourceList resources={role.interview.practice} />
          </section>

          <section id="market" className="mt-20 border-t-2 border-ink pt-10" aria-labelledby="market-title">
            <SectionTitle eyebrow={`The market · ${role.updated.getUTCFullYear()}`} title="Pay and what's changing" id="market-title">
              <Link href="/market" className="text-sm font-semibold hover:underline">
                Compare pay across all roles
              </Link>
            </SectionTitle>
            <div className="mb-6">
              <PayBlock market={getMarket().roles[slug] ?? {}} />
            </div>
            <div className="band-ink overflow-hidden rounded-[var(--radius-lg)]">
              <div className="p-6 md:p-8">
                <p className="flex items-center gap-2 font-display text-lg font-bold">
                  <Bot size={20} /> How AI is changing this role
                </p>
                <p className="mt-3 max-w-[65ch] text-[17px] leading-relaxed">{role.aiImpact}</p>
              </div>
            </div>
            <ul className="mt-6 grid gap-4">
              {role.market.map((m) => (
                <li key={m.text} className="border-l-4 border-ink pl-4">
                  <p>{m.text}</p>
                  {m.source && (
                    <a href={m.source.url} target="_blank" rel="noopener noreferrer" className="mt-1 inline-flex items-center gap-1.5 text-sm text-muted hover:text-ink hover:underline">
                      Source: {m.source.title} <ExternalLink size={13} />
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </section>

          <section id="more" className="mt-20 border-t-2 border-ink pt-10">
            <div className="prose" dangerouslySetInnerHTML={{ __html: body }} />
          </section>

          {adjacent.length > 0 && (
            <section className="mt-20 border-t-2 border-ink pt-10" aria-labelledby="adj-title">
              <SectionTitle eyebrow="Nearby stations" title="Related roles" id="adj-title" />
              <div className="grid gap-4 sm:grid-cols-2">
                {adjacent.map((a) => (
                  <Link key={a.slug} href={`/roles/${a.slug}`} className="group rounded-[var(--radius-lg)] border-2 border-ink p-5 hover:shadow-[4px_4px_0_var(--ink)]">
                    <p className="flex items-center justify-between font-display text-xl font-bold">
                      {a.title} <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                    </p>
                    <p className="mt-2 text-muted">{a.oneLiner}</p>
                    {!a.live && <p className="mt-3 font-mono text-[11px] tracking-wide text-faint uppercase">Route being mapped</p>}
                  </Link>
                ))}
              </div>
              <p className="mt-6 flex flex-wrap items-center gap-2 text-[15px]">
                <span className="text-muted">Compare {role.title} with:</span>
                {adjacent.map((a) => (
                  <Link
                    key={a.slug}
                    href={`/roles/compare/${slug}-vs-${a.slug}`}
                    className="rounded-full border-2 border-ink px-3 py-1 font-semibold hover:bg-ink hover:text-canvas"
                  >
                    {a.title}
                  </Link>
                ))}
              </p>
            </section>
          )}
        </div>

        <aside className="hidden lg:block">
          <nav aria-label="On this page" className="sticky top-[calc(var(--header-h)+68px)]">
            <p className="eyebrow mb-4">On this page</p>
            <ol className="grid gap-3 border-l-[3px] border-ink pl-4">
              {TOC.map(([id, label]) => (
                <li key={id} className="relative">
                  <span aria-hidden="true" className="absolute top-[0.45em] -left-[24px] size-3 rounded-full border-[3px] border-ink bg-canvas" />
                  <a href={`#${id}`} className="text-muted hover:text-ink hover:underline">
                    {label}
                  </a>
                </li>
              ))}
            </ol>
            <div className="mt-8">
              <SaveRoute index={pathIndex} roleSlug={slug} roleTitle={role.title} />
            </div>
          </nav>
        </aside>
      </div>

      <div className="mt-20">
        <AskBand title={`Questions about becoming a ${role.title}?`} question={`I want to become a ${role.title}. Where should I start?`} />
      </div>
    </>
  );
}
