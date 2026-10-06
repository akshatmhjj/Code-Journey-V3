import { getAllResources, getCatalog, getGlossary, getNetwork, getPosts, getRoles, getSkills } from "@/lib/content";
import type { SearchItem } from "@/components/shell/CommandPalette";

export const dynamic = "force-static";

/** Everything the ⌘K palette can find, built once at deploy time. */
export function GET() {
  const net = getNetwork();
  const domains = new Map(getCatalog().domains.map((d) => [d.slug, d.name]));
  const roles = new Map(getRoles().map((r) => [r.slug, r]));
  const skills = new Map(getSkills().map((s) => [s.slug, s]));
  const items: SearchItem[] = [
    ...net.roles.map((r) => ({
      type: "role" as const,
      title: r.title,
      sub: r.live ? r.oneLiner : `${domains.get(r.domain)} · being mapped`,
      href: `/roles/${r.slug}`,
      live: r.live,
      keys: (roles.get(r.slug)?.aliases ?? []).join(" ").toLowerCase(),
    })),
    ...net.skills.map((s) => ({
      type: "skill" as const,
      title: s.title,
      sub: skills.get(s.slug)?.brief ?? `${domains.get(s.domain)} · being written`,
      href: `/skills/${s.slug}`,
      live: s.live,
    })),
    ...net.domains.map((d) => ({ type: "domain" as const, title: d.name, sub: d.tagline, href: `/domains/${d.slug}` })),
    ...getAllResources().map((r) => ({
      type: "resource" as const,
      title: r.title,
      sub: [r.official ? "Official" : r.provider, r.skills.map((s) => s.title).join(", ")].filter(Boolean).join(" · "),
      href: r.url,
    })),
    ...getGlossary().map((t) => ({ type: "term" as const, title: t.term, sub: t.definition.slice(0, 90), href: `/glossary/${t.slug}` })),
    ...getPosts().map((p) => ({ type: "post" as const, title: p.title, sub: p.excerpt, href: `/blog/${p.slug}` })),
    ...[
      ["Compass — which role fits me?", "/compass"],
      ["Compare two roles", "/roles/compare"],
      ["Job post gap checker — what am I missing?", "/gap"],
      ["About Code Journey", "/about"],
      ["FAQ", "/faq"],
      ["Changelog", "/changelog"],
      ["Privacy", "/privacy"],
      ["Terms", "/terms"],
    ].map(([title, href]) => ({ type: "page" as const, title, sub: "Page", href })),
  ];
  return Response.json(items);
}
