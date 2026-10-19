import type { Metadata } from "next";
import { getGlossary } from "@/lib/content";
import { PageHead } from "@/components/ui/bits";
import { FlashDeck } from "./FlashDeck";

export const metadata: Metadata = {
  title: "Glossary Flashcards: Practise Tech Terms",
  description: "Flip through the tech glossary as flashcards. Mark the terms you know and go over the rest.",
  alternates: { canonical: "/glossary/practice" },
};

export default function GlossaryPractice() {
  const terms = getGlossary().map(({ term, slug, category, definition }) => ({ term, slug, category, definition }));
  return (
    <>
      <PageHead eyebrow="Glossary · practice" title="Flashcards for the words you'll meet." lede="Tap a card to see its meaning. Mark the terms you know, and go over the rest." />
      <div className="wrap pb-20 md:pb-28">
        <FlashDeck terms={terms} />
      </div>
    </>
  );
}
