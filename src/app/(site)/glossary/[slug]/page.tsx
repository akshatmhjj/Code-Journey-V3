import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getGlossary } from "@/lib/content";
import { SITE } from "@/lib/site";
import { Trail } from "@/components/ui/Trail";
import { JsonLd } from "@/components/ui/JsonLd";

export function generateStaticParams() {
  return getGlossary().map((t) => ({ slug: t.slug }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps<"/glossary/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const t = getGlossary().find((x) => x.slug === slug);
  if (!t) return {};
  return {
    title: `What is ${t.term}? Explained in Plain English`,
    description: t.definition.slice(0, 155),
    alternates: { canonical: `/glossary/${slug}` },
  };
}

export default async function Term({ params }: PageProps<"/glossary/[slug]">) {
  const { slug } = await params;
  const all = getGlossary();
  const t = all.find((x) => x.slug === slug);
  if (!t) notFound();
  const related = all.filter((x) => x.category === t.category && x.slug !== slug).slice(0, 8);
  return (
    <>
      <Trail stops={[{ label: "Glossary", href: "/glossary" }, { label: t.term }]} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "DefinedTerm",
          name: t.term,
          description: t.definition,
          inDefinedTermSet: { "@type": "DefinedTermSet", name: "Code Journey Glossary", url: `${SITE.url}/glossary` },
        }}
      />
      <article className="wrap py-12 md:py-20">
        <p className="eyebrow">{t.category}</p>
        <h1 className="mt-4 text-[clamp(3rem,9vw,6rem)] leading-[0.92] font-bold tracking-[-0.045em]">{t.term}</h1>
        <p className="mt-8 max-w-[60ch] font-display text-[clamp(1.3rem,2.4vw,1.75rem)] leading-snug">{t.definition}</p>
        {related.length > 0 && (
          <div className="mt-16 border-t-2 border-ink pt-8">
            <p className="eyebrow mb-4">More {t.category} terms</p>
            <ul className="flex flex-wrap gap-2">
              {related.map((r) => (
                <li key={r.slug}>
                  <Link href={`/glossary/${r.slug}`} className="inline-block rounded-full border-2 border-ink px-3 py-1.5 font-semibold hover:bg-ink hover:text-canvas">
                    {r.term}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </article>
    </>
  );
}
