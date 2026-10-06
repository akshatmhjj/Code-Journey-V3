import type { Metadata } from "next";
import Link from "next/link";
import { getSkillEntry, getSnippets } from "@/lib/content";
import { highlight } from "@/lib/markdown";
import { PageHead } from "@/components/ui/bits";

export const metadata: Metadata = {
  title: "Code Snippets: Small Patterns to Copy and Adapt",
  description: "Short, working code snippets for HTML, CSS, JavaScript, TypeScript, React, Node.js, SQL, Python, Dart, Flutter, Swift, Kotlin, R and Rust.",
  alternates: { canonical: "/snippets" },
};

const LANG: Record<string, string> = { nodejs: "javascript", react: "jsx", flutter: "dart" };
const NAME: Record<string, string> = { rust: "Rust" };

export default async function Snippets() {
  const all = getSnippets();
  const groups = [...new Set(all.map((s) => s.skill))];
  const rendered = await Promise.all(all.map(async (s) => ({ ...s, html: await highlight(s.code, LANG[s.skill] ?? s.skill) })));
  return (
    <>
      <PageHead eyebrow="Snippets" title="Small patterns, ready to adapt." lede={`${all.length} short snippets across ${groups.length} languages and frameworks. Read them, then write your own.`}>
        <nav aria-label="Languages" className="mt-8 flex flex-wrap gap-2">
          {groups.map((g) => (
            <a key={g} href={`#${g}`} className="rounded-full border-2 border-ink px-3 py-1 font-semibold hover:bg-ink hover:text-canvas">
              {getSkillEntry(g)?.title ?? NAME[g] ?? g}
            </a>
          ))}
        </nav>
      </PageHead>
      <div className="wrap grid gap-16">
        {groups.map((g) => {
          const skill = getSkillEntry(g);
          return (
            <section key={g} id={g} className="border-t-2 border-ink pt-8">
              <div className="mb-6 flex flex-wrap items-baseline justify-between gap-3">
                <h2 className="text-3xl font-bold">{skill?.title ?? NAME[g] ?? g}</h2>
                {skill?.live && (
                  <Link href={`/skills/${g}`} className="link font-semibold">
                    Learn {skill.title}
                  </Link>
                )}
              </div>
              <div className="grid gap-6 lg:grid-cols-2">
                {rendered
                  .filter((s) => s.skill === g)
                  .map((s) => (
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
          );
        })}
      </div>
    </>
  );
}
