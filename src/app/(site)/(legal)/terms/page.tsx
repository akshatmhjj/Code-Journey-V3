import type { Metadata } from "next";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms",
  description: "The terms for using Code Journey and its content.",
  alternates: { canonical: "/terms" },
};

export default function Terms() {
  return (
    <>
      <p className="eyebrow">Last updated 6 October 2026</p>
      <h1 className="mt-4 text-[clamp(2.5rem,7vw,4.5rem)] leading-[0.98] font-bold tracking-[-0.035em]">Terms</h1>
      <div className="prose mt-10">
        <p>By using Code Journey you agree to these terms. They&apos;re short on purpose.</p>
        <h2>What Code Journey is</h2>
        <p>
          A free guide to tech careers. We describe roles and skills and link to learning material made by others. We don&apos;t provide courses, certificates or job placement, and
          nothing here guarantees a job or outcome.
        </p>
        <h2>Links to other sites</h2>
        <p>
          Resources link to sites we don&apos;t control. We check links regularly but can&apos;t promise every page stays accurate or available. Their own terms and prices apply.
        </p>
        <h2>CJ AI</h2>
        <p>CJ AI is an automated assistant and can be wrong. Check important answers against the official documentation it points to.</p>
        <h2>Your account</h2>
        <p>Keep your sign-in details to yourself and don&apos;t misuse the service — including automated scraping of CJ AI or attempts to break the site. We may suspend accounts that do.</p>
        <h2>Our content</h2>
        <p>
          The writing, design, code and route maps on Code Journey belong to Code Journey. You&apos;re welcome to link to any page and quote short passages with credit. Please
          don&apos;t republish whole pages. Code snippets on the site may be used freely in your own projects. Third-party names and logos belong to their owners.
        </p>
        <h2>Changes and contact</h2>
        <p>
          We may update these terms and will change the date above when we do. Questions: <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.
        </p>
      </div>
    </>
  );
}
