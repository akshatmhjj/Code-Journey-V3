import { getPathIndex } from "@/lib/content";
import { computeProgress } from "@/lib/path";
import { ogCard, OG_SIZE } from "@/lib/og";
import { getPublicPath } from "@/lib/public-path";

export const alt = "A Code Journey route in progress";
export const size = OG_SIZE;
export const contentType = "image/png";

/** Share card for a public path page: who, where they're heading, and how far along. */
export default async function Image({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  const p = await getPublicPath(handle);
  if (!p) return ogCard({ kicker: "My route", title: "Map your route into tech" });
  const progress = p.role ? computeProgress(getPathIndex(), p.role, p.statuses) : null;
  if (!progress) return ogCard({ kicker: "My route", title: `${p.name} on Code Journey`, sub: "Mapping a route into tech." });
  const streak = (p.streak ?? 0) > 1 ? ` · ${p.streak}-week streak` : "";
  return ogCard({
    kicker: progress.percent === 100 ? "Route complete" : "On the way",
    title: `${p.name} → ${progress.role.title}`,
    sub: `${progress.percent}% of the route · ${progress.done} of ${progress.total} stations${streak}`,
  });
}
