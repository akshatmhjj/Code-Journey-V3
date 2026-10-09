import type { Metadata } from "next";
import Link from "next/link";
import { WifiOff } from "lucide-react";
import { Mark } from "@/components/brand/Logo";
import { SavedPages } from "./SavedPages";

export const metadata: Metadata = { title: "You're offline", robots: { index: false } };

/**
 * Shown by the service worker when there's no connection and the page wasn't saved.
 * Lives outside the (site) group on purpose: it has no site header, bottom bar or footer, so an
 * old copy saved by the service worker can't show stale navigation.
 */
export default function Offline() {
  return (
    <main className="wrap max-w-[720px] py-10 md:py-16">
      <Link href="/" className="inline-flex items-center gap-2 font-display text-lg font-bold">
        <Mark size={28} /> Code Journey
      </Link>
      <div className="mt-16 md:mt-20">
        <WifiOff size={32} />
        <h1 className="mt-5 text-[clamp(2.25rem,6vw,3.5rem)] leading-[1] font-bold tracking-[-0.03em]">You&apos;re offline.</h1>
        <p className="mt-4 text-lg text-muted">That page hasn&apos;t been saved on this device yet. Pages you&apos;ve opened before still work - here they are.</p>
        <SavedPages />
      </div>
    </main>
  );
}
