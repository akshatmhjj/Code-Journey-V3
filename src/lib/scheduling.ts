/** Pure CPU scheduling simulation for the prep visuals. All jobs arrive at time 0. */

export type Job = { name: string; burst: number };
export type Slice = { name: string; start: number; end: number };
export type Algo = "fcfs" | "sjf" | "rr";

export const JOBS: Job[] = [
  { name: "P1", burst: 6 },
  { name: "P2", burst: 8 },
  { name: "P3", burst: 7 },
  { name: "P4", burst: 3 },
];

/** Runs the jobs and returns the Gantt slices, when each job finished, and the average waiting time. */
export function schedule(jobs: Job[], algo: Algo, quantum = 4) {
  const slices: Slice[] = [];
  let t = 0;

  if (algo === "rr") {
    const remaining = new Map(jobs.map((j) => [j.name, j.burst]));
    const queue = jobs.map((j) => j.name);
    while (queue.length > 0) {
      const name = queue.shift()!;
      const left = remaining.get(name)!;
      const run = Math.min(quantum, left);
      slices.push({ name, start: t, end: t + run });
      t += run;
      remaining.set(name, left - run);
      if (left - run > 0) queue.push(name);
    }
  } else {
    const order = algo === "fcfs" ? [...jobs] : [...jobs].sort((a, b) => a.burst - b.burst);
    for (const j of order) {
      slices.push({ name: j.name, start: t, end: t + j.burst });
      t += j.burst;
    }
  }

  const finish: Record<string, number> = {};
  for (const s of slices) finish[s.name] = s.end;
  const avgWait = jobs.reduce((sum, j) => sum + (finish[j.name] - j.burst), 0) / jobs.length;
  return { slices, finish, avgWait };
}
