import type { Metadata } from "next";
import Link from "next/link";
import { getSdArticles, getSdTerms } from "@/lib/system-design";
import { PageHead } from "@/components/ui/bits";

export const metadata: Metadata = {
  title: "System Design Glossary: Plain-English Terms",
  description: "Short, plain definitions of the terms used across the System Design paths, such as sharding, consensus, idempotency and fan-out.",
  alternates: { canonical: "/system-design/glossary" },
};

export default function SystemDesignGlossary() {
  const terms = [...getSdTerms()].sort((a, b) => a.term.localeCompare(b.term));
  const articles = getSdArticles();

  return (
    <>
      <PageHead eyebrow="System design" title="The terms, in plain English." lede={`${terms.length} terms used across the paths. Each one links to the articles that use it.`} />
      <div className="wrap pb-20 md:pb-28">
        <dl className="grid max-w-3xl divide-y divide-line border-y border-line">
          {terms.map((t) => {
            const used = articles.filter((a) => a.terms.includes(t.id)).slice(0, 4);
            return (
              <div key={t.id} id={t.id} className="scroll-mt-24 py-6">
                <dt className="font-display text-2xl font-bold">{t.term}</dt>
                <dd className="mt-2 max-w-[66ch] leading-relaxed">{t.def}</dd>
                {used.length > 0 && (
                  <dd className="mt-3 text-sm text-muted">
                    Used in:{" "}
                    {used.map((a, i) => (
                      <span key={a.id}>
                        {i > 0 && ", "}
                        <Link href={`/system-design/${a.path}/${a.id}`} className="underline underline-offset-4 hover:text-ink">
                          {a.title}
                        </Link>
                      </span>
                    ))}
                  </dd>
                )}
              </div>
            );
          })}
        </dl>
        <p className="mt-8">
          <Link href="/system-design" className="btn btn-line">
            Back to the paths
          </Link>
        </p>
      </div>
    </>
  );
}
