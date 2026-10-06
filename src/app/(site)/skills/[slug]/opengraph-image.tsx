import { getNetwork, getSkill, getSkillEntry } from "@/lib/content";
import { ogCard, OG_SIZE } from "@/lib/og";

export const alt = "Code Journey skill guide";
export const size = OG_SIZE;
export const contentType = "image/png";

export function generateStaticParams() {
  return getNetwork().skills.map((s) => ({ slug: s.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const skill = getSkill(slug);
  return ogCard({ kicker: "Skill guide", title: `Learn ${getSkillEntry(slug)?.title ?? "it"}`, sub: skill?.brief });
}
