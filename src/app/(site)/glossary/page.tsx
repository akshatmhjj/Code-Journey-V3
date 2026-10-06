import type { Metadata } from "next";
import { getGlossary } from "@/lib/content";
import { PageHead } from "@/components/ui/bits";
import { GlossaryBrowser } from "./GlossaryBrowser";

export const metadata: Metadata = {
  title: "Tech Glossary: Programming Terms in Plain English",
  description: "API, closure, DOM, Git, promise and more - the words you'll meet learning to code, explained in plain English with examples.",
  alternates: { canonical: "/glossary" },
};

export default function Glossary() {
  const terms = getGlossary();
  return (
    <>
      <PageHead eyebrow="Glossary" title="Tech words, in plain English." lede={`${terms.length} terms you'll meet early on, each explained without jargon.`} />
      <div className="wrap">
        <GlossaryBrowser terms={terms} />
      </div>
    </>
  );
}
