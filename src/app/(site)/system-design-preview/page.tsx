import type { Metadata } from "next";
import { getSdPaths } from "@/lib/system-design";
import { NavOptions } from "./NavOptions";

// Temporary page for choosing how a System Design stop is navigated. Delete this folder once one option is picked.
export const metadata: Metadata = { title: "System design navigation options", robots: { index: false, follow: false } };

export default function SystemDesignPreview() {
  const path = getSdPaths()[0];
  const stops = path.articles.map((a) => ({ id: a.id, title: a.title, href: `/system-design/${path.slug}/${a.id}`, topic: a.topic }));
  const current = stops[0];
  return (
    <NavOptions
      line={{ title: path.title, slug: path.slug }}
      stops={stops}
      current={current}
      summary={path.articles[0].summary}
      points={path.articles[0].points}
    />
  );
}
