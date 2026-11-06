import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { getInterviewTopic, getInterviewTopics } from "@/lib/interview";
import { VISUALS } from "@/components/interview/registry";
import { StudyTabs } from "./StudyTabs";

export function generateStaticParams() {
  return getInterviewTopics().map((t) => ({ slug: t.slug }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps<"/interview-prep/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const topic = getInterviewTopic(slug);
  if (!topic) return {};
  return {
    title: `${topic.title} Interview Prep: Questions and Answers`,
    description: `${topic.brief} ${topic.questions.length} questions with short model answers to revise before an interview.`,
    alternates: { canonical: `/interview-prep/${slug}` },
  };
}

export default async function InterviewTopicPage({ params }: PageProps<"/interview-prep/[slug]">) {
  const { slug } = await params;
  const topic = getInterviewTopic(slug);
  if (!topic) notFound();

  const topics = getInterviewTopics();
  const index = topics.findIndex((t) => t.slug === slug);
  const prev = topics[index - 1];
  const next = topics[index + 1];
  const checked = topic.checked.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

  // Pictures are rendered here and placed beside the concept or question they explain.
  const concepts = topic.concepts.map((c) => ({
    term: c.term,
    def: c.def,
    hook: c.hook,
    visual: c.visual ? (() => { const V = VISUALS[c.visual]; return <V />; })() : undefined,
  }));
  const questions = topic.questions.map((q) => ({
    q: q.q,
    a: q.a,
    visual: q.visual ? (() => { const V = VISUALS[q.visual]; return <V />; })() : undefined,
  }));

  return (
    <div className="wrap pt-8 pb-24 md:pt-12">
      <div className="mx-auto max-w-3xl">
      <Link href="/interview-prep" className="inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-ink">
        <ArrowLeft className="size-4" aria-hidden /> All topics
      </Link>

      <header className="mt-8">
        <p className="font-mono text-xs tracking-wide text-muted uppercase">
          Core CS · {index + 1} of {topics.length}
        </p>
        <h1 className="mt-3 text-4xl leading-tight font-bold tracking-tight md:text-5xl">{topic.title}</h1>
        <p className="mt-4 text-lg text-muted">{topic.brief}</p>
      </header>

      <section aria-labelledby="sixty" className="mt-10 border-l-4 border-accent pl-5">
        <h2 id="sixty" className="font-mono text-xs tracking-wide text-muted uppercase">
          60-second version
        </h2>
        <p className="mt-2 text-lg leading-relaxed">{topic.say}</p>
      </section>
      </div>

      <div className="mt-12">
        <StudyTabs slug={slug} concepts={concepts} questions={questions} traps={topic.traps} />
      </div>

      <div className="mx-auto max-w-3xl">
      <nav aria-label="Other topics" className="mt-16 grid gap-4 border-t border-line pt-8 md:grid-cols-2">
        {prev ? (
          <Link href={`/interview-prep/${prev.slug}`} className="group">
            <span className="font-mono text-xs tracking-wide text-muted uppercase">Previous</span>
            <span className="mt-1 flex items-center gap-2 font-display text-xl font-bold">
              <ArrowLeft className="size-5" aria-hidden /> {prev.title}
            </span>
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link href={`/interview-prep/${next.slug}`} className="group text-right md:col-start-2">
            <span className="font-mono text-xs tracking-wide text-muted uppercase">Next</span>
            <span className="mt-1 flex items-center justify-end gap-2 font-display text-xl font-bold">
              {next.title} <ArrowRight className="size-5" aria-hidden />
            </span>
          </Link>
        )}
      </nav>

      <p className="mt-10 font-mono text-xs tracking-wide text-muted uppercase">Answers checked {checked}</p>
      </div>
    </div>
  );
}
