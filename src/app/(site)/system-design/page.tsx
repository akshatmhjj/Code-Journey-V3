import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getSdPaths } from "@/lib/system-design";
import { LEVEL_LABEL, lineStyleFor } from "@/lib/system-design-meta";
import { PageHead } from "@/components/ui/bits";
import { LineGlyph } from "@/components/map/Line";
import { Credit } from "@/components/system-design/Credit";

export const metadata: Metadata = {
  title: "System Design: Learn How Large Systems Are Built",
  description: "What system design is, and a guided route through it: eight reading lines from the building blocks to distributed systems and microservices, with short summaries and links to the originals.",
  alternates: { canonical: "/system-design" },
};

export default function SystemDesign() {
  const paths = getSdPaths();

  return (
    <>

      <PageHead
        eyebrow="System design"
        title="How large systems are built."
        lede="System design is planning how the parts of a big system fit together: the servers, databases, caches and queues, and why each one is there. Eight reading lines take you from the basics to distributed systems."
      >
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href={`/system-design/${paths[0].slug}`} className="btn btn-accent">
            Start with the basics
          </Link>
          <Link href="/system-design/articles" className="btn btn-line">
            All articles
          </Link>
          <Link href="/system-design/glossary" className="btn btn-line">
            Glossary
          </Link>
        </div>
      </PageHead>

      <div className="wrap grid gap-14 pb-20 md:pb-28">
        <section aria-labelledby="lines">
          <h2 id="lines" className="eyebrow mb-6">
            Pick a line
          </h2>
          <ul className="grid gap-3 sm:grid-cols-2">
            {paths.map((p, i) => (
              <li key={p.slug}>
                <Link href={`/system-design/${p.slug}`} className="group flex items-center gap-4 rounded-2xl border-2 border-ink p-5 transition-colors hover:bg-raise">
                  <LineGlyph style={lineStyleFor(i)} width={36} />
                  <span className="min-w-0 flex-1">
                    <span className="block font-display text-lg leading-snug font-bold">{p.title}</span>
                    <span className="mt-1 block font-mono text-xs tracking-wide text-muted uppercase">
                      {LEVEL_LABEL[p.level]} · {p.articles.length} stops
                    </span>
                  </span>
                  <ArrowRight className="size-5 shrink-0 transition-transform group-hover:translate-x-1" aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section aria-label="Other pages" className="flex flex-wrap gap-x-6 gap-y-2 border-t border-line pt-6 text-sm font-semibold">
          <Link href="/system-design/articles" className="underline underline-offset-4 hover:text-accent">
            Search every article
          </Link>
          <Link href="/system-design/glossary" className="underline underline-offset-4 hover:text-accent">
            Terms in plain English
          </Link>
          <Link href="/interview-prep" className="underline underline-offset-4 hover:text-accent">
            Core CS interview prep
          </Link>
        </section>

        <Credit />
      </div>
    </>
  );
}
