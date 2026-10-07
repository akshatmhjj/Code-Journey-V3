import type { Metadata } from "next";
import { WifiOff } from "lucide-react";
import { SavedPages } from "./SavedPages";

export const metadata: Metadata = { title: "You're offline", robots: { index: false } };

/** Shown by the service worker when there's no connection and the page wasn't saved. */
export default function Offline() {
  return (
    <div className="wrap max-w-[720px] py-20 md:py-28">
      <WifiOff size={32} />
      <h1 className="mt-5 text-[clamp(2.25rem,6vw,3.5rem)] leading-[1] font-bold tracking-[-0.03em]">You&apos;re offline.</h1>
      <p className="mt-4 text-lg text-muted">That page hasn&apos;t been saved on this device yet. Pages you&apos;ve opened before still work - here they are.</p>
      <SavedPages />
    </div>
  );
}
