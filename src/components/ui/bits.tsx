import Link from "next/link";
import { ArrowUpRight, BadgeCheck } from "lucide-react";
import type { Domain, Resource } from "@/lib/content";
import { RESOURCE_LABEL } from "@/lib/site";
import { LineGlyph } from "@/components/map/Line";
import { SaveResource } from "@/components/path/SaveResource";

// Stations are interactive for signed-in people, so they live in their own client component.
export { SkillStation } from "./Station";

export function PageHead({
  eyebrow,
  title,
  lede,
  children,
}: {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  lede?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <div className="wrap pt-10 pb-8 md:pt-16 md:pb-12">
      {eyebrow && <div className="eyebrow mb-4 flex flex-wrap items-center gap-3">{eyebrow}</div>}
      <h1 className="max-w-[18ch] text-[clamp(2.5rem,7vw,5rem)] leading-[0.98] font-bold tracking-[-0.035em]">{title}</h1>
      {lede && <p className="mt-5 max-w-[60ch] text-lg text-muted md:text-xl">{lede}</p>}
      {children}
    </div>
  );
}

export function SectionTitle({ eyebrow, title, id, children }: { eyebrow?: string; title: string; id?: string; children?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4 md:mb-8">
      <div>
        {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
        <h2 id={id} className="text-[clamp(1.75rem,3.4vw,2.5rem)] font-bold">
          {title}
        </h2>
      </div>
      {children}
    </div>
  );
}

export function DomainBadge({ domain, withLine = true, href = true }: { domain: Domain; withLine?: boolean; href?: boolean }) {
  const inner = (
    <>
      <span className="rounded-[5px] bg-ink px-1.5 py-1 font-mono text-[11px] font-bold leading-none tracking-wider text-canvas">{domain.code}</span>
      <span className="font-display text-[15px] font-semibold tracking-normal text-ink normal-case">{domain.name}</span>
      {withLine && <LineGlyph style={domain.line} width={36} />}
    </>
  );
  return href ? (
    <Link href={`/domains/${domain.slug}`} className="inline-flex items-center gap-2 hover:underline">
      {inner}
    </Link>
  ) : (
    <span className="inline-flex items-center gap-2">{inner}</span>
  );
}

const COST: Record<string, string> = { free: "Free", freemium: "Free + paid", paid: "Paid" };

export function ResourceList({
  resources,
  showSkills = false,
  skillSlug,
}: {
  resources: (Resource & { skills?: { slug: string; title: string }[] })[];
  showSkills?: boolean;
  /** The skill page these resources belong to, stored with a bookmark. */
  skillSlug?: string;
}) {
  return (
    <ul className="divide-y divide-line border-y-2 border-ink">
      {resources.map((r) => (
        <li key={r.url} className="group relative grid grid-cols-[1fr_auto] items-start gap-x-4 gap-y-1 py-4">
          <div className="min-w-0">
            <a href={r.url} target="_blank" rel="noopener noreferrer" className="font-display text-lg leading-snug font-semibold after:absolute after:inset-0 group-hover:underline">
              {r.title}
            </a>
            <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
              {r.official && (
                <span className="inline-flex items-center gap-1 font-semibold text-ink">
                  <BadgeCheck size={15} /> Official
                </span>
              )}
              {r.provider && <span>{r.provider}</span>}
              <span className="font-mono text-[11px] tracking-wide uppercase">{RESOURCE_LABEL[r.type]}</span>
              <span className={r.cost === "free" ? "" : "font-semibold text-ink"}>{COST[r.cost]}</span>
            </p>
            {r.note && <p className="mt-1.5 text-[15px]">{r.note}</p>}
            {showSkills && r.skills && (
              <p className="relative z-10 mt-2 flex flex-wrap gap-2 text-sm">
                {r.skills.map((s) => (
                  <Link key={s.slug} href={`/skills/${s.slug}`} className="rounded-full bg-surface px-2.5 py-0.5 hover:underline">
                    {s.title}
                  </Link>
                ))}
              </p>
            )}
          </div>
          <div className="flex items-center gap-3">
            <SaveResource url={r.url} title={r.title} skillSlug={skillSlug ?? r.skills?.[0]?.slug} />
            <ArrowUpRight size={20} className="shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
        </li>
      ))}
    </ul>
  );
}

export function Pill({ children, tone = "line" }: { children: React.ReactNode; tone?: "line" | "ink" | "accent" }) {
  const cls = {
    line: "border-2 border-ink",
    ink: "bg-ink text-canvas border-2 border-ink",
    accent: "bg-accent text-on-accent border-2 border-accent",
  }[tone];
  return <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 font-mono text-[11.5px] font-semibold tracking-wide whitespace-nowrap ${cls}`}>{children}</span>;
}
