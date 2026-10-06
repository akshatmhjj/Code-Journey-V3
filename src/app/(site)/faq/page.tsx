import type { Metadata } from "next";
import { getFaq } from "@/lib/content";
import { PageHead } from "@/components/ui/bits";
import { JsonLd } from "@/components/ui/JsonLd";

export const metadata: Metadata = {
  title: "FAQ",
  description: "What Code Journey is, how we pick resources, whether it's free, and how accounts and privacy work.",
  alternates: { canonical: "/faq" },
};

export default function Faq() {
  const groups = getFaq();
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: groups.flatMap((g) => g.items.map((i) => ({ "@type": "Question", name: i.q, acceptedAnswer: { "@type": "Answer", text: i.a } }))),
        }}
      />
      <PageHead eyebrow="FAQ" title="Questions, answered." />
      <div className="wrap grid gap-14">
        {groups.map((g) => (
          <section key={g.group} className="grid gap-6 border-t-2 border-ink pt-8 md:grid-cols-[260px_1fr]">
            <h2 className="text-2xl font-bold">{g.group}</h2>
            <div className="divide-y divide-line">
              {g.items.map((i) => (
                <details key={i.q} className="group py-4 first:pt-0">
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-4 font-display text-xl font-semibold [&::-webkit-details-marker]:hidden">
                    {i.q}
                    <span aria-hidden="true" className="mt-1 grid size-7 shrink-0 place-items-center rounded-full border-2 border-ink font-mono text-sm transition-transform group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 max-w-[65ch] text-lg text-muted">{i.a}</p>
                </details>
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
