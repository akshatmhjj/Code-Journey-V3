import { getNetwork, getRole, getRoleEntry } from "@/lib/content";
import { ogCard, OG_SIZE } from "@/lib/og";

export const alt = "Code Journey role route";
export const size = OG_SIZE;
export const contentType = "image/png";

export function generateStaticParams() {
  return getNetwork().roles.map((r) => ({ slug: r.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const role = getRole(slug);
  const entry = getRoleEntry(slug);
  return ogCard({
    kicker: "Career route",
    title: `${entry?.title ?? "Role"} Roadmap`,
    sub: role ? `${role.stages.length} stages · ${new Set(role.stages.flatMap((s) => s.skills)).size} skills · the best resources for each` : entry?.oneLiner,
  });
}
