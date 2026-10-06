import type { Metadata } from "next";
import Link from "next/link";
import { getNetwork } from "@/lib/content";
import { SITE } from "@/lib/site";
import { PageHead } from "@/components/ui/bits";
import { CopyEmail } from "./CopyEmail";

export const metadata: Metadata = {
  title: "About",
  description: "Code Journey is a free map of tech careers. We don't teach or sell courses; we show each role's route and point to the best material to learn it.",
  alternates: { canonical: "/about" },
};

export default function About() {
  const net = getNetwork();
  return (
    <>
      <PageHead eyebrow="About" title="A map, not a course." lede="Most people starting in tech aren't short of tutorials. They're short of direction." />
      <div className="wrap grid gap-16">
        <section className="grid gap-8 border-t-2 border-ink pt-10 md:grid-cols-[260px_1fr]">
          <h2 className="text-2xl font-bold">Why it exists</h2>
          <div className="grid max-w-[65ch] gap-5 text-lg">
            <p>
              Search &ldquo;how to become a data engineer&rdquo; and you get a thousand courses, each sure it&apos;s the one. What&apos;s missing is the plain picture: what the job is,
              which skills it takes, in what order, and where the best free material for each one lives.
            </p>
            <p>
              Code Journey draws that picture for every role in tech — {net.roles.length} of them across {net.domains.length} fields — as a transit map. Pick a destination, follow the
              stations, and leave for the official docs and best resources at each stop.
            </p>
            <p className="font-display text-2xl font-semibold">We curate and point. The people who build the tools do the teaching.</p>
          </div>
        </section>
        <section className="grid gap-8 border-t-2 border-ink pt-10 md:grid-cols-[260px_1fr]">
          <h2 className="text-2xl font-bold">What we promise</h2>
          <ul className="grid max-w-[65ch] gap-4 text-lg">
            <li><span className="font-semibold">Official docs first</span> on every skill.</li>
            <li><span className="font-semibold">Free before paid</span>, and paid picks clearly labelled.</li>
            <li><span className="font-semibold">No courses for sale and no affiliate links.</span> We don&apos;t earn from where you click.</li>
            <li><span className="font-semibold">Every link checked</span>, with the date shown.</li>
            <li><span className="font-semibold">No made-up numbers.</span> Market notes cite their source or stay qualitative.</li>
          </ul>
        </section>
        <section className="grid gap-8 border-t-2 border-ink pt-10 md:grid-cols-[260px_1fr]">
          <h2 className="text-2xl font-bold">Get in touch</h2>
          <div className="grid max-w-[65ch] gap-4 text-lg">
            <p>Spotted a broken link, a better resource, or a role we&apos;re missing? Tell us.</p>
            <CopyEmail email={SITE.email} />
            <p className="text-muted">
              Or read the <Link href="/faq" className="link">FAQ</Link> and the <Link href="/changelog" className="link">changelog</Link>.
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
