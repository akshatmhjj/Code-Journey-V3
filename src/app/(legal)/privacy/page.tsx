import type { Metadata } from "next";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy",
  description: "What Code Journey collects, why, who processes it, and how to get it deleted.",
  alternates: { canonical: "/privacy" },
};

export default function Privacy() {
  return (
    <>
      <p className="eyebrow">Last updated 6 October 2026</p>
      <h1 className="mt-4 text-[clamp(2.5rem,7vw,4.5rem)] leading-[0.98] font-bold tracking-[-0.035em]">Privacy</h1>
      <div className="prose mt-10">
        <p>Code Journey is free to read without an account. This page explains what we collect when you do use an account or the site, and why. We don&apos;t sell personal data.</p>
        <h2>What we collect</h2>
        <ul>
          <li><strong>Account details</strong> — your name and email address when you sign up, and the date you joined.</li>
          <li><strong>Your progress</strong> — when My Path launches, the role you&apos;re working towards and which skills you&apos;ve marked.</li>
          <li><strong>Questions to CJ AI</strong> — the messages you send are passed to Google&apos;s Gemini API to generate an answer. We don&apos;t store your conversation on our servers.</li>
          <li><strong>Usage analytics</strong> — Google Analytics records which pages are visited, from what kind of device and roughly where. Advertising features are switched off. Visitors in the EU, UK and Switzerland are asked before analytics is enabled.</li>
          <li><strong>Settings on your device</strong> — your theme, mode and cookie choice are kept in your browser&apos;s local storage, and a sign-in session if you have an account.</li>
        </ul>
        <h2>Who processes it</h2>
        <ul>
          <li><strong>Supabase</strong> stores accounts and progress (servers in Mumbai, India).</li>
          <li><strong>Vercel</strong> hosts the site and keeps short-lived request logs.</li>
          <li><strong>Google</strong> provides Analytics and the Gemini API for CJ AI.</li>
        </ul>
        <h2>Your choices</h2>
        <ul>
          <li>Use the whole site without an account.</li>
          <li>Decline analytics in the banner, or block it with your browser.</li>
          <li>Ask us to export or delete your account and data by emailing <a href={`mailto:${SITE.email}`}>{SITE.email}</a>. We&apos;ll act within 30 days.</li>
        </ul>
        <h2>Changes</h2>
        <p>If this policy changes in a way that matters, we&apos;ll update the date above and note it in the changelog.</p>
      </div>
    </>
  );
}
