import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { getSdArticle, getSdPath, getSdPaths, getSdTerm } from "@/lib/system-design";
import { LEVEL_LABEL, sourceLabel } from "@/lib/system-design-meta";
import { Credit } from "@/components/system-design/Credit";
import { LevelBadge } from "@/components/system-design/LevelBadge";
import { PathReader } from "./PathReader";

export function generateStaticParams() {
  return getSdPaths().map((p) => ({ path: p.slug }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps<"/system-design/[path]">): Promise<Metadata> {
  const { path } = await params;
  const p = getSdPath(path);
  if (!p) return {};
  return {
    title: `${p.title}: ${LEVEL_LABEL[p.level]} System Design Path`,
    description: `${p.purpose} ${p.articles.length} articles in reading order, with key ideas for quick revision.`,
    alternates: { canonical: `/system-design/${p.slug}` },
  };
}

export default async function SystemDesignPath({ params }: PageProps<"/system-design/[path]">) {
  const { path } = await params;
  const p = getSdPath(path);
  if (!p) notFound();

  const paths = getSdPaths();
  const next = paths[paths.findIndex((x) => x.slug === p.slug) + 1];

  const steps = p.articles.map((a) => ({
    id: a.id,
    title: a.title,
    href: `/system-design/${a.path}/${a.id}`,
    topic: a.topic,
    level: a.level,
    why: a.why,
    summary: a.summary,
    points: a.points,
    source: a.source,
    sourceLabel: sourceLabel(a.source),
    needs: a.needs.flatMap((n) => {
      const need = getSdArticle(n);
      return need ? [{ id: need.id, title: need.title, href: `/system-design/${need.path}/${need.id}` }] : [];
    }),
    terms: a.terms.flatMap((t) => {
      const term = getSdTerm(t);
      return term ? [{ id: term.id, term: term.term }] : [];
    }),
  }));

  return (
    <div className="wrap pt-8 pb-24 md:pt-12">
      <div className="mx-auto max-w-3xl">
        <Link href="/system-design" className="inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-ink">
          <ArrowLeft className="size-4" aria-hidden /> All lines
        </Link>

        <header className="mt-8">
          <div className="flex flex-wrap items-center gap-3">
            <LevelBadge level={p.level} />
            <span className="font-mono text-xs tracking-wide text-muted uppercase">{p.articles.length} stops</span>
          </div>
          <h1 className="mt-3 text-4xl leading-tight font-bold tracking-tight md:text-5xl">{p.title}</h1>
          <p className="mt-4 text-lg text-muted">{p.purpose}</p>
        </header>

        <dl className="mt-8 grid gap-4 rounded-2xl bg-raise p-5 text-sm leading-relaxed md:grid-cols-2 md:p-6">
          <div>
            <dt className="font-mono text-xs tracking-wide text-muted uppercase">You should know</dt>
            <dd className="mt-1">{p.assumes}</dd>
          </div>
          <div>
            <dt className="font-mono text-xs tracking-wide text-muted uppercase">By the end</dt>
            <dd className="mt-1">{p.outcome}</dd>
          </div>
        </dl>
      </div>

      <div className="mt-12">
        <PathReader steps={steps} />
      </div>

      <div className="mx-auto max-w-3xl">
      <section aria-labelledby="checks" className="mt-16">
        <h2 id="checks" className="eyebrow">
          Quick checks
        </h2>
        <p className="mt-2 text-muted">Answer out loud first, then open the answer.</p>
        <div className="mt-4 divide-y divide-line border-y border-line">
          {p.checks.map((c) => (
            <details key={c.q} className="group py-4">
              <summary className="cursor-pointer list-none font-display text-lg leading-snug font-bold">{c.q}</summary>
              <p className="mt-3 max-w-[66ch] leading-relaxed">{c.a}</p>
            </details>
          ))}
        </div>
      </section>

      {next && (
        <nav aria-label="Next path" className="mt-16 border-t border-line pt-8">
          <Link href={`/system-design/${next.slug}`} className="group inline-block">
            <span className="font-mono text-xs tracking-wide text-muted uppercase">Next path</span>
            <span className="mt-1 flex items-center gap-2 font-display text-xl font-bold">
              {next.title} <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" aria-hidden />
            </span>
          </Link>
        </nav>
      )}

      <Credit className="mt-10" />
      </div>
    </div>
  );
}
