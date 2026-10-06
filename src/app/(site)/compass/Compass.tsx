"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Flag, RotateCcw, Scale } from "lucide-react";
import { scoreCompass, type CompassQuestion } from "@/lib/compass";
import { usePath } from "@/components/path/PathProvider";

type RoleInfo = Record<string, { title: string; oneLiner: string; domain: string }>;

/** Station line showing quiz progress: filled for answered, accent for the current question. */
function Progress({ total, current }: { total: number; current: number }) {
  return (
    <ol className="flex items-center" aria-label={`Question ${Math.min(current + 1, total)} of ${total}`}>
      {Array.from({ length: total }, (_, i) => (
        <li key={i} className="flex flex-1 items-center last:flex-none">
          <span
            aria-hidden="true"
            className={`size-3.5 shrink-0 rounded-full border-[3px] border-ink transition-colors ${
              i < current ? "bg-ink" : i === current ? "bg-accent" : "bg-canvas"
            }`}
          />
          {i < total - 1 && <span aria-hidden="true" className={`h-[3px] flex-1 ${i < current ? "bg-ink" : "bg-line-strong"}`} />}
        </li>
      ))}
    </ol>
  );
}

function Results({ questions, answers, roles, onRestart }: { questions: CompassQuestion[]; answers: number[]; roles: RoleInfo; onRestart: () => void }) {
  const path = usePath();
  const ranked = useMemo(() => scoreCompass(questions, answers), [questions, answers]);
  // The ranking picks which roles make the cut; within each group, show the highest match first
  // so a lower percentage never sits above a higher one.
  const byMatch = (a: { match: number }, b: { match: number }) => b.match - a.match;
  const [top, more] = [ranked.slice(0, 3).sort(byMatch), ranked.slice(3, 6).sort(byMatch)];

  return (
    <div className="grid gap-10">
      <div>
        <p className="eyebrow">Your matches</p>
        <h1 className="mt-4 max-w-[16ch] text-[clamp(2.4rem,6vw,4.25rem)] leading-[0.98] font-bold tracking-[-0.035em]">
          Three routes worth a look.
        </h1>
        <p className="mt-4 max-w-[58ch] text-lg text-muted">
          Based on your answers. Read each route&apos;s &ldquo;week in the life&rdquo; — that&apos;s the best test of whether it really fits.
        </p>
      </div>

      <ol className="grid gap-5 lg:grid-cols-3">
        {top.map((r, i) => {
          const role = roles[r.slug];
          return (
            <li
              key={r.slug}
              className={`flex flex-col rounded-[var(--radius-lg)] border-2 border-ink p-6 ${i === 0 ? "shadow-[6px_6px_0_var(--ink)]" : ""}`}
            >
              <div className="flex items-center justify-between gap-3">
                <span className="font-mono text-[12px] tracking-wider text-muted uppercase">
                  {i === 0 ? "Best match" : `Match ${i + 1}`} · {role.domain}
                </span>
                <span className={`rounded-full px-2.5 py-0.5 font-mono text-[12px] font-bold ${i === 0 ? "bg-accent text-on-accent" : "border-2 border-ink"}`}>
                  {r.match}%
                </span>
              </div>
              <h2 className="mt-4 text-[1.75rem] leading-tight font-bold">{role.title}</h2>
              <p className="mt-2 text-muted">{role.oneLiner}</p>
              {r.reasons.length > 0 && (
                <div className="mt-5 flex-1">
                  <p className="text-sm font-semibold">Because you…</p>
                  <ul className="mt-2 grid gap-1.5 text-[15px]">
                    {r.reasons.map((why) => (
                      <li key={why} className="flex gap-2">
                        <span aria-hidden="true" className="mt-[0.55em] size-1.5 shrink-0 rounded-full bg-ink" />
                        {why}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="mt-6 grid gap-2">
                <Link href={`/roles/${r.slug}`} className="btn btn-ink">
                  See the route <ArrowRight size={17} />
                </Link>
                {path?.signedIn && path.roleSlug !== r.slug && (
                  <button onClick={() => path.setRole(r.slug)} className="btn btn-line">
                    <Flag size={16} /> Make this my route
                  </button>
                )}
                {path?.signedIn && path.roleSlug === r.slug && (
                  <Link href="/me" className="btn btn-line">
                    Your route — open My Path
                  </Link>
                )}
              </div>
            </li>
          );
        })}
      </ol>

      <div className="grid gap-6 border-t-2 border-ink pt-8 md:grid-cols-[1fr_auto] md:items-start">
        <div>
          <p className="eyebrow">Also worth a look</p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {more.map((r) => (
              <li key={r.slug}>
                <Link href={`/roles/${r.slug}`} className="inline-flex items-center gap-2 rounded-full border-2 border-ink px-3 py-1.5 font-semibold hover:bg-ink hover:text-canvas">
                  {roles[r.slug].title} <span className="font-mono text-[12px] opacity-70">{r.match}%</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href={`/roles/compare?a=${top[0].slug}&b=${top[1].slug}`} className="btn btn-accent">
            <Scale size={17} /> Compare the top two
          </Link>
          <button onClick={onRestart} className="btn btn-line">
            <RotateCcw size={16} /> Retake
          </button>
        </div>
      </div>
    </div>
  );
}

export function Compass({ questions, roles }: { questions: CompassQuestion[]; roles: RoleInfo }) {
  const [answers, setAnswers] = useState<number[]>([]);
  const [started, setStarted] = useState(false);
  const step = answers.length;
  const done = step >= questions.length;

  function choose(i: number) {
    setAnswers((a) => [...a, i]);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="wrap py-10 md:py-16">
      {!started ? (
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-center">
          <div>
            <p className="eyebrow">Compass</p>
            <h1 className="mt-4 max-w-[13ch] text-[clamp(2.75rem,7.5vw,5.5rem)] leading-[0.94] font-bold tracking-[-0.04em]">Not sure where you fit?</h1>
            <p className="mt-6 max-w-[50ch] text-xl text-muted">
              Eight quick questions about what you enjoy. You&apos;ll get three roles that suit you, with the reasons — and the full route for each.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button onClick={() => setStarted(true)} className="btn btn-accent h-14 px-7 text-lg">
                Start — about 2 minutes <ArrowRight size={19} />
              </button>
              <Link href="/roles" className="font-semibold underline decoration-accent decoration-2 underline-offset-4">
                Or browse all {Object.keys(roles).length} roles
              </Link>
            </div>
          </div>
          <ul className="grid gap-3 text-[15px]" aria-label="How it works">
            {[
              ["No account needed", "Your answers stay in your browser."],
              ["No right answers", "Pick what's true for you today, not what sounds impressive."],
              ["A starting point", "Treat the matches as places to explore, not a verdict."],
            ].map(([t, d]) => (
              <li key={t} className="rounded-[var(--radius-md)] bg-surface p-4">
                <p className="font-display font-bold">{t}</p>
                <p className="mt-0.5 text-muted">{d}</p>
              </li>
            ))}
          </ul>
        </div>
      ) : done ? (
        <Results questions={questions} answers={answers} roles={roles} onRestart={() => setAnswers([])} />
      ) : (
        <div className="mx-auto grid max-w-3xl gap-8">
          <Progress total={questions.length} current={step} />
          <div aria-live="polite">
            <p className="font-mono text-[12.5px] tracking-wider text-muted uppercase">
              Question {step + 1} of {questions.length}
            </p>
            <h1 className="mt-3 text-[clamp(1.9rem,4.5vw,3rem)] leading-[1.05] font-bold tracking-[-0.03em]">{questions[step].q}</h1>
          </div>
          <ul className="grid gap-3">
            {questions[step].options.map((o, i) => (
              <li key={o.label}>
                <button
                  onClick={() => choose(i)}
                  className="group flex w-full items-center gap-4 rounded-[var(--radius-lg)] border-2 border-ink p-4 text-left text-lg transition-[transform,box-shadow] hover:-translate-y-0.5 hover:shadow-[4px_4px_0_var(--ink)] md:p-5"
                >
                  <span aria-hidden="true" className="size-5 shrink-0 rounded-full border-[3px] border-ink transition-colors group-hover:bg-accent" />
                  <span className="font-medium">{o.label}</span>
                </button>
              </li>
            ))}
          </ul>
          <div className="flex items-center justify-between">
            <button
              onClick={() => (step === 0 ? setStarted(false) : setAnswers((a) => a.slice(0, -1)))}
              className="inline-flex items-center gap-2 font-semibold hover:underline"
            >
              <ArrowLeft size={17} /> Back
            </button>
            <span className="text-sm text-muted">Pick the closest — you can go back.</span>
          </div>
        </div>
      )}
    </div>
  );
}
