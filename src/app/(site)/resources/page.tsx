import type { Metadata } from "next";
import { getAllResources, getCatalog, getSkills } from "@/lib/content";
import { PageHead } from "@/components/ui/bits";
import { ResourceBrowser } from "./ResourceBrowser";

export const metadata: Metadata = {
  title: "Resource Library: Official Docs and the Best Free Material",
  description: "Every resource on Code Journey in one place - official documentation first, then the best free courses, books, videos and practice sites. Every link checked.",
  alternates: { canonical: "/resources" },
};

export default function Resources() {
  const all = getAllResources();
  const domainOfSkill = new Map(getSkills().map((s) => [s.slug, s.domain]));
  const items = all.map((r) => ({ ...r, domains: [...new Set(r.skills.map((s) => domainOfSkill.get(s.slug)!))] }));
  const domains = getCatalog().domains.filter((d) => items.some((i) => i.domains.includes(d.slug)));
  return (
    <>
      <PageHead
        eyebrow="Library"
        title="The best place to learn anything."
        lede={`${all.length} hand-picked resources. Official docs first, free before paid, every link checked.`}
      />
      <div className="wrap">
        <ResourceBrowser items={items} domains={domains.map((d) => ({ slug: d.slug, name: d.name, code: d.code }))} />
      </div>
    </>
  );
}
