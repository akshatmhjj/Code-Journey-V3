// Milestones on a route, worked out from progress alone (no storage needed).
import type { Progress, Statuses } from "@/lib/path";

export type Milestone = { id: string; label: string; reached: boolean };

/** In route order: first station, halfway, each stage complete, and the whole route. */
export function milestones(p: Progress): Milestone[] {
  const out: Milestone[] = [{ id: "first", label: "First station", reached: p.done >= 1 }];
  const half: Milestone = { id: "half", label: "Halfway", reached: p.percent >= 50 };
  let stations = 0;
  let placed = false;
  p.stages.forEach((s, i) => {
    out.push({ id: `stage-${i}`, label: `${s.name} complete`, reached: s.total > 0 && s.done === s.total });
    // Halfway sits after the stage that takes the route past the 50% mark.
    stations += s.total;
    if (!placed && stations >= p.total / 2 && i < p.stages.length - 1) {
      out.push(half);
      placed = true;
    }
  });
  if (!placed) out.push(half);
  out.push({ id: "route", label: `${p.role.title} route complete`, reached: p.percent === 100 });
  return out;
}

export type Celebration = { kind: "stage" | "route"; title: string; detail: string; roleSlug: string };

type Route = { slug: string; title: string; stages: { name: string; skills: string[] }[] };

/**
 * What ticking `skill` off just completed, if anything: the whole route beats a stage.
 * Compares progress before and after so re-ticking never celebrates twice.
 */
export function celebrationFor(route: Route, before: Statuses, after: Statuses, skill: string): Celebration | null {
  const done = (st: Statuses) => (s: string) => st[s] === "done";
  const all = [...new Set(route.stages.flatMap((s) => s.skills))];
  if (!all.includes(skill)) return null;
  if (all.every(done(after)) && !all.every(done(before))) {
    return { kind: "route", title: `You've reached ${route.title}`, detail: `Every station on the route is ticked off.`, roleSlug: route.slug };
  }
  const i = route.stages.findIndex((s) => s.skills.includes(skill) && s.skills.every(done(after)) && !s.skills.every(done(before)));
  if (i === -1) return null;
  const stage = route.stages[i];
  const next = route.stages[i + 1];
  return {
    kind: "stage",
    title: `${stage.name} complete`,
    detail: next ? `Stage ${i + 1} of ${route.stages.length} on the ${route.title} route. Next up: ${next.name}.` : `The last stage on the ${route.title} route.`,
    roleSlug: route.slug,
  };
}
