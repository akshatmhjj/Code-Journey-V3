// Switch: which tech roles are closest to a job someone already does. Pure logic, no server-only imports.

export type SwitchJob = { slug: string; title: string; summary: string; strengths: string[]; skills: string[] };
export type RouteStage = { name: string; skills: string[] };
export type RouteRole = { slug: string; title: string; stages: RouteStage[] };

export type Bridge = {
  slug: string;
  title: string;
  /** Skills on the role's route that the job often gives you already, in route order. */
  have: string[];
  /** Everything else on the route, in route order. */
  toLearn: string[];
  /** Name of the first stage that still has something to learn. */
  startAt: string | null;
  /** Share of the route already covered, 0 to 1. */
  share: number;
};

/**
 * Roles whose route overlaps the job's skills, closest first.
 * Closest means the fewest skills left to learn; ties go to the larger share of the route already covered.
 */
export function bridgeRoles(job: SwitchJob, roles: RouteRole[], limit = 3): Bridge[] {
  const mine = new Set(job.skills);
  return roles
    .map((role) => {
      const route = [...new Set(role.stages.flatMap((s) => s.skills))];
      const have = route.filter((s) => mine.has(s));
      const toLearn = route.filter((s) => !mine.has(s));
      const startAt = role.stages.find((stage) => stage.skills.some((s) => !mine.has(s)))?.name ?? null;
      return { slug: role.slug, title: role.title, have, toLearn, startAt, share: route.length ? have.length / route.length : 0 };
    })
    .filter((b) => b.have.length > 0)
    .sort((a, b) => a.toLearn.length - b.toLearn.length || b.share - a.share || a.title.localeCompare(b.title))
    .slice(0, limit);
}
