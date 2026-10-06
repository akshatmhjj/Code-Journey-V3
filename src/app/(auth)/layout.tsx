import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Logo, Mark } from "@/components/brand/Logo";
import { LinePath } from "@/components/map/Line";
import { ThemeIconButton } from "@/components/shell/ThemeIconButton";
import type { LineStyle } from "@/lib/content";

const STEPS = [
  { t: "Create a free account", d: "Takes under a minute. No card, no catch." },
  { t: "Pick a destination", d: "Any role on the map - switch whenever you like." },
  { t: "Tick off each station", d: "See what's done and what's next on your route." },
  { t: "Ask CJ AI along the way", d: "Questions about roles, skills and where to start." },
];

const LINES: LineStyle[] = ["solid", "double", "dashed", "dotted", "dashdot"];

/** Focused screen for sign in / sign up: route panel on the left, form on the right. No site header or footer. */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
      <aside className="band-ink hidden lg:block">
        <div className="relative flex h-full flex-col overflow-hidden px-12 py-10 xl:px-16">
          <Link href="/" aria-label="Code Journey home" className="w-fit">
            <Logo />
          </Link>

          <div className="relative z-10 my-auto max-w-md py-12">
            <p className="font-display text-[clamp(2.5rem,4vw,3.75rem)] leading-[0.98] font-bold tracking-[-0.035em]">Save your place on the map.</p>
            <ol className="mt-12">
              {STEPS.map((s, i) => (
                <li key={s.t} className="relative grid grid-cols-[28px_1fr] gap-x-5">
                  {i < STEPS.length - 1 && <span aria-hidden="true" className="absolute top-3 bottom-0 left-[11px] w-[6px] bg-ink" />}
                  <span
                    aria-hidden="true"
                    className={`relative z-10 mt-0.5 size-7 rounded-full border-[5px] border-ink ${i === 0 ? "bg-accent" : "bg-canvas"}`}
                  />
                  <div className="pb-8">
                    <p className="font-display text-xl font-bold">{s.t}</p>
                    <p className="mt-1 text-muted">{s.d}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <p className="relative z-10 text-sm text-muted">
            Reading is always free - no account needed.{" "}
            <Link href="/roles" className="font-semibold text-ink underline decoration-accent decoration-2 underline-offset-4">
              Keep browsing
            </Link>
          </p>

          {/* Lines running off the panel edge */}
          <svg aria-hidden="true" viewBox="0 0 600 220" preserveAspectRatio="none" className="pointer-events-none absolute right-0 bottom-16 h-32 w-[55%] opacity-25">
            {LINES.map((l, i) => (
              <LinePath key={l} d={`M${40 + i * 60} ${30 + i * 40}H${200 + i * 30}L${240 + i * 30} ${10 + i * 40}H620`} style={l} />
            ))}
          </svg>
        </div>
      </aside>

      <div className="flex min-w-0 flex-col">
        <div className="flex items-center justify-between gap-3 px-4 pt-[max(1rem,env(safe-area-inset-top))] sm:px-8 lg:px-12 lg:pt-8">
          <Link href="/" className="inline-flex items-center gap-2 font-display font-semibold hover:underline">
            <span className="lg:hidden">
              <Mark size={30} />
            </span>
            <ArrowLeft size={18} className="hidden lg:block" />
            <span>Back to the map</span>
          </Link>
          <ThemeIconButton />
        </div>
        <main id="main" className="flex flex-1 items-center justify-center px-4 py-10 sm:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
