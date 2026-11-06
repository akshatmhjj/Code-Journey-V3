import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { getSdArticle, getSdArticles, getSdPath, getSdTerm } from "@/lib/system-design";
import { sourceLabel } from "@/lib/system-design-meta";
import { Credit } from "@/components/system-design/Credit";
import { LevelBadge } from "@/components/system-design/LevelBadge";

export function generateStaticParams() {
  return getSdArticles().map((a) => ({ path: a.path, article: a.id }));
}
export const dynamicParams = false;

function find(path: string, id: string) {
  const a = getSdArticle(id);
  return a && a.path === path ? a : undefined;
}

export async function generateMetadata({ params }: PageProps<"/system-design/[path]/[article]">): Promise<Metadata> {
  const { path, article } = await params;
  const a = find(path, article);
  if (!a) return {};
  return {
    title: `${a.title}: Summary and Key Ideas`,
    description: `${a.summary} Key ideas, what to read first, and a link to the original.`,
    alternates: { canonical: `/system-design/${a.path}/${a.id}` },
  };
}

export default async function SystemDesignArticle({ params }: PageProps<"/system-design/[path]/[article]">) {
  const { path, article } = await params;
  const a = find(path, article);
  const p = getSdPath(path);
  if (!a || !p) notFound();

  const prev = p.articles[a.position - 2];
  const next = p.articles[a.position];
  const date = a.date.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
  const needs = a.needs.flatMap((n) => {
    const need = getSdArticle(n);
    return need ? [need] : [];
  });
  const terms = a.terms.flatMap((t) => {
    const term = getSdTerm(t);
    return term ? [term] : [];
  });

  return (
    <>

      <div className="wrap pt-8 pb-24 md:pt-12">
        <Link href={`/system-design/${p.slug}`} className="inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-ink">
          <ArrowLeft className="size-4" aria-hidden /> {p.title}
        </Link>

        <div className="mt-8 grid gap-12 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
          <div className="min-w-0">
            <header>
              <div className="flex flex-wrap items-center gap-3">
                <LevelBadge level={a.level} />
                <span className="font-mono text-xs tracking-wide text-muted uppercase">
                  {a.topic} · Stop {a.position} of {p.articles.length}
                </span>
              </div>
              <h1 className="mt-4 text-4xl leading-tight font-bold tracking-tight md:text-5xl">{a.title}</h1>
              <p className="mt-5 text-lg leading-relaxed text-muted md:text-xl">{a.summary}</p>
            </header>

            <section aria-labelledby="why" className="mt-10 border-l-4 border-accent pl-6">
              <h2 id="why" className="font-mono text-xs tracking-wide text-muted uppercase">
                Why it is here
              </h2>
              <p className="mt-2 text-lg leading-relaxed md:text-xl">{a.why}</p>
            </section>

            <section aria-labelledby="ideas" className="mt-12">
              <h2 id="ideas" className="eyebrow">
                Key ideas
              </h2>
              <ul className="mt-4 grid list-disc gap-4 pl-6 text-lg leading-relaxed md:text-xl">
                {a.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </section>

            {needs.length > 0 && (
              <section aria-labelledby="needs" className="mt-12">
                <h2 id="needs" className="eyebrow">
                  Read these first
                </h2>
                <ul className="mt-4 grid gap-3">
                  {needs.map((n) => (
                    <li key={n.id}>
                      <Link href={`/system-design/${n.path}/${n.id}`} className="inline-flex items-center gap-2 text-lg font-semibold underline underline-offset-4 hover:text-accent">
                        {n.title} <ArrowRight className="size-4" aria-hidden />
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <nav aria-label="Other stops in this line" className="mt-16 grid gap-4 border-t border-line pt-8 md:grid-cols-2">
              {prev ? (
                <Link href={`/system-design/${prev.path}/${prev.id}`} className="group">
                  <span className="font-mono text-xs tracking-wide text-muted uppercase">Previous stop</span>
                  <span className="mt-1 flex items-center gap-2 font-display text-lg font-bold">
                    <ArrowLeft className="size-5 shrink-0" aria-hidden /> {prev.title}
                  </span>
                </Link>
              ) : (
                <span />
              )}
              {next && (
                <Link href={`/system-design/${next.path}/${next.id}`} className="group text-right md:col-start-2">
                  <span className="font-mono text-xs tracking-wide text-muted uppercase">Next stop</span>
                  <span className="mt-1 flex items-center justify-end gap-2 font-display text-lg font-bold">
                    {next.title} <ArrowRight className="size-5 shrink-0" aria-hidden />
                  </span>
                </Link>
              )}
            </nav>
          </div>

          <aside aria-label="Stop details" className="grid gap-6 lg:sticky lg:top-28">
            <section aria-labelledby="original" className="rounded-2xl bg-raise p-6">
              <h2 id="original" className="font-display text-xl font-bold">
                Read the full version
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">The original goes into more detail, with diagrams and worked numbers. Posted {date}.</p>
              <div className="mt-5 flex flex-col items-stretch gap-3">
                <a href={a.source} target="_blank" rel="noopener noreferrer" className="btn btn-ink">
                  {sourceLabel(a.source)} <ArrowUpRight className="size-4" aria-hidden />
                </a>
              </div>
            </section>

            {terms.length > 0 && (
              <section aria-labelledby="terms" className="rounded-2xl border-2 border-ink p-6">
                <h2 id="terms" className="eyebrow">
                  Terms used
                </h2>
                <dl className="mt-4 grid gap-5">
                  {terms.map((t) => (
                    <div key={t.id}>
                      <dt className="font-display text-lg font-bold">{t.term}</dt>
                      <dd className="mt-1 text-sm leading-relaxed text-muted">{t.def}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            )}
          </aside>
        </div>

        <Credit className="mt-16" />
      </div>
    </>
  );
}
