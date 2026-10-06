import type { Metadata } from "next";
import Link from "next/link";
import { getPosts } from "@/lib/content";
import { PageHead } from "@/components/ui/bits";

export const metadata: Metadata = {
  title: "Blog: Honest Notes on Learning Tech",
  description: "Short, practical posts on picking a direction, avoiding tutorial traps and understanding the ideas that trip beginners up.",
  alternates: { canonical: "/blog" },
};

const fmt = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });

export default function Blog() {
  const [first, ...rest] = getPosts();
  return (
    <>
      <PageHead eyebrow="Blog" title="Notes from the road." lede="Short, honest posts on learning tech without wasting months." />
      <div className="wrap">
        {first && (
          <Link href={`/blog/${first.slug}`} className="group grid gap-6 border-y-[3px] border-ink py-10 md:grid-cols-[1fr_1.2fr] md:gap-12">
            <div>
              <p className="font-mono text-[12px] text-muted">
                {first.tag} · {fmt.format(first.date)} · {first.readTime}
              </p>
              <h2 className="mt-4 text-[clamp(2rem,4.5vw,3.25rem)] leading-[1.02] font-bold group-hover:underline">{first.title}</h2>
            </div>
            <p className="self-end text-xl text-muted">{first.excerpt}</p>
          </Link>
        )}
        <ul className="grid gap-x-8 md:grid-cols-2 lg:grid-cols-3">
          {rest.map((p) => (
            <li key={p.slug} className="border-b-2 border-line">
              <Link href={`/blog/${p.slug}`} className="group block py-8">
                <p className="font-mono text-[12px] text-muted">
                  {p.tag} · {p.readTime}
                </p>
                <h2 className="mt-3 text-2xl leading-tight font-bold group-hover:underline">{p.title}</h2>
                <p className="mt-2 text-muted">{p.excerpt}</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
