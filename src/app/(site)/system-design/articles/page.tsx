import type { Metadata } from "next";
import Link from "next/link";
import { getSdArticles, getSdPath } from "@/lib/system-design";
import { PageHead } from "@/components/ui/bits";
import { Credit } from "@/components/system-design/Credit";
import { ArticleExplorer } from "./ArticleExplorer";

export const metadata: Metadata = {
  title: "All System Design Articles: Search and Filter",
  description: "Every System Design article in one list. Search by topic, filter by level, and hide the ones you have already read.",
  alternates: { canonical: "/system-design/articles" },
};

export default function SystemDesignArticles() {
  const articles = getSdArticles();
  const items = articles.map((a) => ({
    id: a.id,
    title: a.title,
    summary: a.summary,
    text: [a.title, a.summary, ...a.points].join(" ").toLowerCase(),
    topic: a.topic,
    level: a.level,
    date: a.date.toISOString().slice(0, 10),
    pathTitle: getSdPath(a.path)?.title ?? "",
    href: `/system-design/${a.path}/${a.id}`,
  }));

  return (
    <>
      <PageHead eyebrow="System design" title="All articles." lede={`${articles.length} articles in one list. If you would rather have a reading order, start with a path.`}>
        <p className="mt-6">
          <Link href="/system-design" className="btn btn-line">
            See the paths
          </Link>
        </p>
      </PageHead>
      <div className="wrap pb-20 md:pb-28">
        <ArticleExplorer items={items} />
        <Credit className="mt-12" />
      </div>
    </>
  );
}
