import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPosts } from "@/lib/content";
import { renderMarkdown } from "@/lib/markdown";
import { SITE } from "@/lib/site";
import { Trail } from "@/components/ui/Trail";
import { JsonLd } from "@/components/ui/JsonLd";

export function generateStaticParams() {
  return getPosts().map((p) => ({ slug: p.slug }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = getPosts().find((x) => x.slug === slug);
  if (!p) return {};
  return {
    title: p.title,
    description: p.excerpt,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: { type: "article", publishedTime: p.date.toISOString() },
  };
}

const fmt = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

export default async function Post({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const posts = getPosts();
  const p = posts.find((x) => x.slug === slug);
  if (!p) notFound();
  const html = await renderMarkdown(p.body);
  const more = posts.filter((x) => x.slug !== slug).slice(0, 3);
  return (
    <>
      <Trail stops={[{ label: "Blog", href: "/blog" }, { label: p.title }]} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: p.title,
          description: p.excerpt,
          datePublished: p.date.toISOString(),
          author: { "@type": "Organization", name: SITE.name, url: SITE.url },
          publisher: { "@id": `${SITE.url}/#org` },
          mainEntityOfPage: `${SITE.url}/blog/${slug}`,
        }}
      />
      <article className="wrap py-12 md:py-20">
        <p className="font-mono text-[12.5px] text-muted">
          {p.tag} · {fmt.format(p.date)} · {p.readTime}
        </p>
        <h1 className="mt-5 max-w-[20ch] text-[clamp(2.4rem,6vw,4.5rem)] leading-[0.98] font-bold tracking-[-0.035em]">{p.title}</h1>
        <p className="mt-6 max-w-[55ch] text-xl text-muted">{p.excerpt}</p>
        <div className="prose mt-12 border-t-2 border-ink pt-4" dangerouslySetInnerHTML={{ __html: html }} />
      </article>
      <aside className="wrap" aria-label="More posts">
        <p className="eyebrow mb-4">Keep reading</p>
        <ul className="grid gap-6 md:grid-cols-3">
          {more.map((m) => (
            <li key={m.slug}>
              <Link href={`/blog/${m.slug}`} className="group block border-t-[3px] border-ink pt-4">
                <span className="text-xl font-bold group-hover:underline">{m.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      </aside>
    </>
  );
}
