// Compass scoring. No server-only imports: used by the quiz page and by checks.

export type CompassOption = { label: string; why: string; weights: Record<string, number> };
export type CompassQuestion = { id: string; q: string; options: CompassOption[] };

export type CompassResult = { slug: string; score: number; max: number; match: number; reasons: string[] };

/** Highest weight each role can earn per question, summed. */
export function maxScores(questions: CompassQuestion[]) {
  const max: Record<string, number> = {};
  for (const q of questions) {
    const best: Record<string, number> = {};
    for (const o of q.options) for (const [r, w] of Object.entries(o.weights)) best[r] = Math.max(best[r] ?? 0, w);
    for (const [r, w] of Object.entries(best)) max[r] = (max[r] ?? 0) + w;
  }
  return max;
}

/**
 * answers[i] is the chosen option index for questions[i].
 * Ranked by score ÷ √max: roles that appear in many options don't win by volume,
 * and roles that appear rarely don't win on a single answer.
 */
export function scoreCompass(questions: CompassQuestion[], answers: number[]): CompassResult[] {
  const max = maxScores(questions);
  const score: Record<string, number> = {};
  const reasons: Record<string, { w: number; why: string }[]> = {};
  questions.forEach((q, i) => {
    const o = q.options[answers[i]];
    if (!o) return;
    for (const [r, w] of Object.entries(o.weights)) {
      score[r] = (score[r] ?? 0) + w;
      (reasons[r] ??= []).push({ w, why: o.why });
    }
  });
  return Object.keys(max)
    .map((slug) => ({
      slug,
      score: score[slug] ?? 0,
      max: max[slug],
      match: Math.round(((score[slug] ?? 0) / max[slug]) * 100),
      reasons: (reasons[slug] ?? []).sort((a, b) => b.w - a.w).map((x) => x.why).slice(0, 3),
    }))
    .sort((a, b) => b.score / Math.sqrt(b.max) - a.score / Math.sqrt(a.max) || b.match - a.match);
}
