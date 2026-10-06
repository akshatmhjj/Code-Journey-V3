import { ogCard, OG_SIZE } from "@/lib/og";

export const alt = "Code Journey - the map of tech careers";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return ogCard({ kicker: "The map of tech careers", title: "Pick a destination. We'll show you the route.", sub: "Every tech role, the skills it takes, and the best resources for each." });
}
