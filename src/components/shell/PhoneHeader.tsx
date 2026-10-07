"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { BookOpen, Compass, IndianRupee, Layers, Map, MessageCircle, Palette, ScanSearch, Search, UserRound, X } from "lucide-react";
import { Mark } from "@/components/brand/Logo";
import { useUser } from "@/lib/supabase";
import { useUI } from "./UIProvider";

// Phones only (below md). Desktop keeps the full Header.
// A small floating "Where to?" pill that grows into a control panel: search, the main places,
// Network, Ask CJ AI, theme and your account. It tucks away while you scroll down to read.

const PLACES = [
  { href: "/roles", label: "Roles", Icon: Map },
  { href: "/skills", label: "Skills", Icon: Layers },
  { href: "/resources", label: "Resources", Icon: BookOpen },
  { href: "/market", label: "Pay by role", Icon: IndianRupee },
  { href: "/compass", label: "Compass", Icon: Compass },
  { href: "/gap", label: "Job post checker", Icon: ScanSearch },
];

const isActive = (path: string, href: string) => path === href || path.startsWith(href + "/");

/** True while scrolling down through content (past the first 80px); false again on any scroll up. */
function useHideOnScroll() {
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    let last = window.scrollY;
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const y = window.scrollY;
        if (Math.abs(y - last) < 6) return;
        setHidden(y > last && y > 80);
        last = y;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);
  return hidden;
}

/** Keeps sticky elements below (the breadcrumb) tucked under the pill, and lets them rise when it hides. Phones only. */
function useHeaderHeight(px: number) {
  useEffect(() => {
    const root = document.documentElement;
    const mq = window.matchMedia("(max-width: 767px)");
    const apply = () => (mq.matches ? root.style.setProperty("--header-h", `${px}px`) : root.style.removeProperty("--header-h"));
    apply();
    mq.addEventListener("change", apply);
    return () => {
      mq.removeEventListener("change", apply);
      root.style.removeProperty("--header-h");
    };
  }, [px]);
}

export function PhoneHeader() {
  const ui = useUI();
  const user = useUser();
  const path = usePathname();
  const scrolledAway = useHideOnScroll();
  // The panel closes itself when the page changes.
  const [panel, setPanel] = useState<{ open: boolean; at: string }>({ open: false, at: path });
  const open = panel.open && panel.at === path;
  const setOpen = (o: boolean) => setPanel({ open: o, at: path });
  const hidden = scrolledAway && !open;
  useHeaderHeight(hidden ? 0 : 68);

  useEffect(() => {
    if (!open) return;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setPanel((p) => ({ ...p, open: false }));
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const run = (fn: () => void) => () => {
    setOpen(false);
    fn();
  };
  const tools = [
    { label: "Network", Icon: Map, run: run(() => ui.open("network")) },
    { label: "Ask CJ AI", Icon: MessageCircle, run: run(() => ui.openChat()) },
    { label: "Theme", Icon: Palette, run: run(() => ui.open("settings")) },
  ];

  return (
    <div className="md:hidden">
      {open && (
        <button
          aria-label="Close menu"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 bg-[color-mix(in_oklab,var(--ink)_35%,transparent)] backdrop-blur-[2px]"
        />
      )}
      <header
        className={`fixed inset-x-0 top-[max(0.6rem,env(safe-area-inset-top))] z-50 flex justify-center px-3 transition-transform duration-300 ease-out ${
          hidden ? "-translate-y-[140%]" : ""
        }`}
      >
        <div
          className={`overflow-hidden rounded-[26px] border-2 border-ink bg-canvas shadow-[0_14px_34px_-12px_rgb(0_0_0/0.5)] transition-[width,max-height] duration-[420ms] ease-[cubic-bezier(.2,.9,.25,1)] ${
            open ? "max-h-[80dvh] w-full" : "max-h-[52px] w-[min(300px,100%)]"
          }`}
        >
          <div className="flex h-12 items-center gap-2 pr-1.5 pl-2">
            <Link href="/" aria-label="Code Journey home" className="grid size-9 shrink-0 place-items-center">
              <Mark size={28} />
            </Link>
            <button onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="phone-panel" className="flex min-w-0 flex-1 items-center gap-2 text-left">
              <span className="truncate font-display text-[15px] font-bold">{open ? "Code Journey" : "Where to?"}</span>
              <span className="ml-auto grid size-8 shrink-0 place-items-center rounded-full bg-surface">{open ? <X size={16} /> : <Search size={15} />}</span>
            </button>
          </div>

          <nav
            id="phone-panel"
            aria-label="Menu"
            aria-hidden={!open}
            inert={!open}
            className={`grid gap-3 px-3 pb-3 transition-opacity duration-300 ${open ? "opacity-100 delay-150" : "opacity-0"}`}
          >
            <button
              onClick={run(() => ui.open("search"))}
              className="flex h-12 items-center gap-3 rounded-full border-2 border-ink px-4 text-left text-[15px] text-muted"
            >
              <Search size={18} className="text-ink" /> Search roles, skills, resources
            </button>
            <div className="grid grid-cols-2 gap-2">
              {PLACES.map(({ href, label, Icon }) => (
                <Link
                  key={href}
                  href={href}
                  aria-current={isActive(path, href) ? "page" : undefined}
                  className={`flex items-center gap-2.5 rounded-[var(--radius-md)] px-3 py-3 font-display text-[15px] font-semibold ${
                    isActive(path, href) ? "bg-ink text-canvas" : "bg-surface"
                  }`}
                >
                  <Icon size={17} className="shrink-0" /> {label}
                </Link>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-2">
              {tools.map(({ label, Icon, run: onClick }) => (
                <button key={label} onClick={onClick} className="flex flex-col items-center gap-1 rounded-[var(--radius-md)] border-2 border-line py-2.5 text-[13px] font-semibold">
                  <Icon size={18} /> {label}
                </button>
              ))}
            </div>
            <Link href={user ? "/me" : "/login"} className={`btn w-full ${user ? "btn-ink" : "btn-accent"}`}>
              {user ? (
                <>
                  <UserRound size={17} /> My Path
                </>
              ) : (
                "Sign in"
              )}
            </Link>
          </nav>
        </div>
      </header>
      {/* Keeps page content clear of the floating pill. */}
      <div aria-hidden="true" className="h-[68px]" />
    </div>
  );
}
