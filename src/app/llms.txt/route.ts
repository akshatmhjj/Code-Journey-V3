import { getCatalog, getRoles, getSkills } from "@/lib/content";
import { SITE } from "@/lib/site";

export const dynamic = "force-static";

/** llms.txt: a plain-text guide to the site for AI assistants. */
export function GET() {
  const roles = getRoles();
  const skills = getSkills();
  const lines = [
    `# ${SITE.name}`,
    "",
    `> ${SITE.description} Code Journey curates; it does not sell courses.`,
    "",
    "## Career routes",
    ...roles.map((r) => `- [${r.title}](${SITE.url}/roles/${r.slug}): ${r.summary}`),
    "",
    "## Skills",
    ...skills.map((s) => `- [${s.title}](${SITE.url}/skills/${s.slug}): ${s.brief}`),
    "",
    "## Fields",
    ...getCatalog().domains.map((d) => `- [${d.name}](${SITE.url}/domains/${d.slug}): ${d.tagline}`),
    "",
    "## More",
    `- [All roles](${SITE.url}/roles)`,
    `- [Resource library](${SITE.url}/resources)`,
    `- [Glossary](${SITE.url}/glossary)`,
    `- [FAQ](${SITE.url}/faq)`,
  ];
  return new Response(lines.join("\n"), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
