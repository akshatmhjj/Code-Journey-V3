import type { MetadataRoute } from "next";
import { getCatalog, getComparePairs, getGlossary, getPosts, getRoles, getSkills, pairSlug } from "@/lib/content";
import { SITE } from "@/lib/site";

// Only pages with real content. Roles and skills still being mapped are left out (they're noindex).
export default function sitemap(): MetadataRoute.Sitemap {
  const u = (path: string) => `${SITE.url}${path}`;
  const now = new Date();
  const fixed = ["", "/roles", "/compass", "/roles/compare", "/gap", "/market", "/skills", "/domains", "/resources", "/glossary", "/blog", "/about", "/faq", "/changelog", "/privacy", "/terms"];
  return [
    ...fixed.map((p) => ({ url: u(p), lastModified: now, changeFrequency: "weekly" as const, priority: p === "" ? 1 : 0.7 })),
    ...getRoles().map((r) => ({ url: u(`/roles/${r.slug}`), lastModified: r.updated, changeFrequency: "monthly" as const, priority: 0.9 })),
    ...getSkills().map((s) => ({ url: u(`/skills/${s.slug}`), lastModified: s.checked, changeFrequency: "monthly" as const, priority: 0.8 })),
    ...getCatalog().domains.map((d) => ({ url: u(`/domains/${d.slug}`), lastModified: now, changeFrequency: "weekly" as const, priority: 0.7 })),
    ...getGlossary().map((t) => ({ url: u(`/glossary/${t.slug}`), changeFrequency: "yearly" as const, priority: 0.5 })),
    ...getComparePairs().map((p) => ({ url: u(`/roles/compare/${pairSlug(p.a, p.b)}`), changeFrequency: "monthly" as const, priority: 0.6 })),
    ...getPosts().map((p) => ({ url: u(`/blog/${p.slug}`), lastModified: p.date, changeFrequency: "yearly" as const, priority: 0.6 })),
  ];
}
