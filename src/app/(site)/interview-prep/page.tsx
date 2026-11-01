import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getInterviewTopics } from "@/lib/interview";
import { PageHead } from "@/components/ui/bits";
import { ReadyCount } from "./ReadyCount";

export const metadata: Metadata = {
  title: "Core CS Interview Prep: OS, Networks, DBMS, OOP and DSA",
  description: "The core computer science questions interviewers ask - operating systems, networks, databases, OOP and data structures - with short model answers to revise before an interview.",
  alternates: { canonical: "/interview-prep" },
};

const STEPS = [
  ["Read the 60-second version", "Say the topic out loud in your own words, the way you would start an answer."],
  ["Answer before you reveal", "Try the question first. Speaking it aloud is the real test."],
  ["Compare with the model answer", "Note the one or two words you missed, and say them next time."],
  ["Mark it ready", "When you can answer cold, tick it. Your ticks stay on this device."],
];

export default function InterviewPrep() {
  const topics = getInterviewTopics();
  const questions = topics.reduce((n, t) => n + t.questions.length, 0);

  return (
    <>
      <PageHead
        eyebrow="Interview prep · core CS"
        title="The core CS questions, ready in one place."
        lede={`${topics.length} topics and ${questions} questions interviewers keep coming back to. Read the 60-second version, answer before you reveal, and tick what you can say cold.`}
      />

      <div className="wrap grid gap-16 pb-20 md:pb-28">
        <ol className="grid gap-4 md:grid-cols-4" aria-label="How to use this prep">
          {STEPS.map(([title, detail], i) => (
            <li key={title} className="rounded-2xl border-2 border-ink p-5">
              <span className="font-mono text-sm text-muted">{String(i + 1).padStart(2, "0")}</span>
              <p className="mt-2 font-display text-xl leading-snug font-bold">{title}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted">{detail}</p>
            </li>
          ))}
        </ol>

        <section aria-labelledby="topics">
          <h2 id="topics" className="eyebrow mb-6">Pick a topic</h2>
          <ul className="grid gap-5 md:grid-cols-2">
            {topics.map((t, i) => (
              <li key={t.slug}>
                <Link
                  href={`/interview-prep/${t.slug}`}
                  className="group flex h-full flex-col gap-5 rounded-3xl border-2 border-ink p-6 transition-colors hover:bg-raise md:p-8"
                >
                  <div className="flex items-start justify-between gap-4">
                    <span className="font-mono text-sm text-muted">{String(i + 1).padStart(2, "0")}</span>
                    <ArrowRight className="size-6 transition-transform group-hover:translate-x-1" aria-hidden />
                  </div>
                  <div>
                    <h3 className="font-display text-3xl font-bold md:text-4xl">{t.title}</h3>
                    <p className="mt-3 leading-relaxed text-muted">{t.brief}</p>
                  </div>
                  <div className="mt-auto">
                    <ReadyCount slug={t.slug} total={t.questions.length} />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <p className="max-w-[60ch] text-sm leading-relaxed text-muted">
          Answers are short model answers, meant for revision the night before. Use them to check your own explanation, not to memorise word for word.
        </p>
      </div>
    </>
  );
}
