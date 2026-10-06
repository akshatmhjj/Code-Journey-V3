// My Path: shared types and progress maths. No server-only imports, so client components can use it.

export type SkillStatus = "learning" | "done";
export type Statuses = Record<string, SkillStatus>;

/** Compact route data the server hands to client components. */
export type PathIndex = {
  roles: { slug: string; title: string; domain: string; stages: { name: string; weeks?: string; skills: string[] }[] }[];
  skills: Record<string, { title: string; hours?: string; live: boolean }>;
};

/** "40–60" (or "40-60", "40") → [40, 60]. */
export function parseHours(hours?: string): [number, number] {
  if (!hours) return [0, 0];
  const nums = hours.match(/\d+/g)?.map(Number) ?? [];
  if (!nums.length) return [0, 0];
  return [nums[0], nums[nums.length - 1]];
}

export type Progress = {
  role: PathIndex["roles"][number];
  skills: string[];
  done: number;
  learning: number;
  total: number;
  percent: number;
  /** The first stage that isn't finished — where the person is now. */
  currentStage: number;
  stages: { name: string; weeks?: string; skills: string[]; done: number; total: number; percent: number }[];
  /** The next few unstarted or in-progress skills, in route order. */
  next: string[];
  /** Hours left across skills not yet marked done, as a low–high range. */
  hoursLeft: [number, number];
};

export function computeProgress(index: PathIndex, roleSlug: string, statuses: Statuses): Progress | null {
  const role = index.roles.find((r) => r.slug === roleSlug);
  if (!role) return null;

  const seen = new Set<string>();
  const skills: string[] = [];
  for (const stage of role.stages) {
    for (const s of stage.skills) {
      if (!seen.has(s)) {
        seen.add(s);
        skills.push(s);
      }
    }
  }

  const isDone = (s: string) => statuses[s] === "done";
  const stages = role.stages.map((stage) => {
    const total = stage.skills.length;
    const done = stage.skills.filter(isDone).length;
    return { ...stage, done, total, percent: total ? Math.round((done / total) * 100) : 0 };
  });

  const done = skills.filter(isDone).length;
  const learning = skills.filter((s) => statuses[s] === "learning").length;
  const unfinished = stages.findIndex((s) => s.done < s.total);

  const hoursLeft = skills
    .filter((s) => !isDone(s))
    .reduce<[number, number]>(
      (acc, s) => {
        const [lo, hi] = parseHours(index.skills[s]?.hours);
        return [acc[0] + lo, acc[1] + hi];
      },
      [0, 0],
    );

  return {
    role,
    skills,
    done,
    learning,
    total: skills.length,
    percent: skills.length ? Math.round((done / skills.length) * 100) : 0,
    currentStage: unfinished === -1 ? stages.length - 1 : unfinished,
    stages,
    next: skills.filter((s) => !isDone(s)).slice(0, 4),
    hoursLeft,
  };
}

export function formatHours([lo, hi]: [number, number]) {
  if (hi <= 0) return "none left";
  const round = (n: number) => (n >= 100 ? Math.round(n / 10) * 10 : n);
  return `${round(lo)}–${round(hi)} hours`;
}

/** Hours → a rough calendar estimate at a given weekly pace. */
export function formatWeeks([lo, hi]: [number, number], perWeek = 10) {
  if (hi <= 0) return null;
  const months = (h: number) => h / perWeek / 4.345;
  const [a, b] = [months(lo), months(hi)];
  if (b < 1.5) return `about ${Math.max(1, Math.round(lo / perWeek))}–${Math.round(hi / perWeek)} weeks`;
  return `about ${Math.max(1, Math.round(a))}–${Math.round(b)} months`;
}
