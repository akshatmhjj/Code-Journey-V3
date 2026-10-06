"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Map, Palette, Search, UserRound } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { useUser } from "@/lib/supabase";
import { useUI } from "./UIProvider";

const NAV = [
  { href: "/roles", label: "Roles" },
  { href: "/skills", label: "Skills" },
  { href: "/resources", label: "Resources" },
  { href: "/glossary", label: "Glossary" },
];

/** Cycles role names in the search box: "I want to become a Data Analyst". */
function useRotating(items: string[], ms = 2800) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setI((n) => (n + 1) % items.length), ms);
    return () => clearInterval(t);
  }, [items.length, ms]);
  return items[i];
}

function article(word: string) {
  return /^[AEIOU]/i.test(word) ? "an" : "a";
}

/**
 * Scroll state without re-rendering on every frame: `scrolled` flips once past the top,
 * reading progress is written straight to a CSS variable on the bar.
 */
function useScroll(bar: React.RefObject<HTMLDivElement | null>) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      bar.current?.style.setProperty("--progress", String(max > 0 ? Math.min(1, y / max) : 0));
      setScrolled(y > 16);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [bar]);
  return scrolled;
}

/** A soft pill that slides to whichever nav item is hovered, resting on the current page. */
function useGlide(path: string) {
  const nav = useRef<HTMLElement>(null);
  const [glide, setGlide] = useState<{ x: number; w: number; on: boolean }>({ x: 0, w: 0, on: false });

  const moveTo = useCallback((el: Element | null | undefined) => {
    const parent = nav.current;
    if (!parent || !el) return setGlide((g) => ({ ...g, on: false }));
    const a = (el as HTMLElement).getBoundingClientRect();
    const p = parent.getBoundingClientRect();
    setGlide({ x: a.left - p.left, w: a.width, on: true });
  }, []);

  const rest = useCallback(() => moveTo(nav.current?.querySelector('[aria-current="page"]')), [moveTo]);
  useLayoutEffect(() => {
    rest();
  }, [path, rest]);

  return { nav, glide, moveTo, rest };
}

export function Header({ roleTitles }: { roleTitles: string[] }) {
  const ui = useUI();
  const user = useUser();
  const path = usePathname();
  const role = useRotating(roleTitles);
  const bar = useRef<HTMLDivElement>(null);
  const scrolled = useScroll(bar);
  const { nav, glide, moveTo, rest } = useGlide(path);
  const [mac, setMac] = useState(true);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMac(/Mac|iPhone|iPad/.test(navigator.platform)), []);

  return (
    <header className="sticky top-0 z-40 h-[var(--header-h)] px-2 pt-2 sm:px-3">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:rounded-md focus:bg-ink focus:px-3 focus:py-2 focus:text-canvas">
        Skip to content
      </a>
      <div
        ref={bar}
        data-scrolled={scrolled}
        className="group/bar relative mx-auto flex h-[60px] max-w-[1240px] items-center gap-3 rounded-[30px] border-2 border-transparent px-2 transition-[max-width,background-color,border-color,box-shadow,padding] duration-500 ease-[cubic-bezier(.2,.8,.2,1)] sm:px-4 lg:gap-5 data-[scrolled=true]:max-w-[1120px] data-[scrolled=true]:border-ink data-[scrolled=true]:bg-[color-mix(in_oklab,var(--canvas)_86%,transparent)] data-[scrolled=true]:shadow-[0_10px_30px_-12px_rgb(0_0_0/0.35)] data-[scrolled=true]:backdrop-blur-xl"
      >
        <Link href="/" aria-label="Code Journey home" className="group shrink-0 rounded-full px-1">
          <Logo />
        </Link>

        <button
          onClick={() => ui.open("search")}
          className="ml-1 hidden h-11 min-w-0 flex-1 items-center gap-3 rounded-full border-2 border-ink bg-canvas pr-2 pl-4 text-left transition-[background-color,transform] duration-200 hover:-translate-y-px hover:bg-raise md:flex lg:max-w-[400px]"
          aria-label="Search roles, skills and resources"
        >
          <Search size={18} className="shrink-0" />
          <span className="flex min-w-0 flex-1 items-baseline gap-1 overflow-hidden text-[15px] whitespace-nowrap text-muted">
            I want to become {article(role)}
            <span key={role} className="cj-roll truncate font-semibold text-ink">
              {role}
            </span>
          </span>
          <kbd className="hidden shrink-0 rounded-full border border-line-strong px-2 py-0.5 font-mono text-[11px] text-muted lg:inline">{mac ? "⌘K" : "Ctrl K"}</kbd>
        </button>

        <nav ref={nav} aria-label="Main" onMouseLeave={rest} className="relative ml-auto hidden items-center lg:flex">
          <span
            aria-hidden="true"
            className="absolute top-0 left-0 h-10 rounded-full bg-raise transition-[transform,width,opacity] duration-300 ease-[cubic-bezier(.2,.8,.2,1)]"
            style={{ width: glide.w, transform: `translateX(${glide.x}px)`, opacity: glide.on ? 1 : 0 }}
          />
          <button
            onMouseEnter={(e) => moveTo(e.currentTarget)}
            onFocus={(e) => moveTo(e.currentTarget)}
            onClick={() => ui.open("network")}
            className="relative flex h-10 items-center gap-2 rounded-full px-3.5 font-display font-semibold"
          >
            <Map size={17} /> Network
          </button>
          {NAV.map((n) => {
            const active = path === n.href || path.startsWith(n.href + "/");
            return (
              <Link
                key={n.href}
                href={n.href}
                aria-current={active ? "page" : undefined}
                onMouseEnter={(e) => moveTo(e.currentTarget)}
                onFocus={(e) => moveTo(e.currentTarget)}
                className="relative flex h-10 items-center rounded-full px-3.5 font-display font-semibold"
              >
                {n.label}
                {active && <span aria-hidden="true" className="absolute -bottom-1 left-1/2 size-[7px] -translate-x-1/2 rounded-full border-2 border-ink bg-accent" />}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-1 lg:ml-0">
          <button onClick={() => ui.open("search")} aria-label="Search" className="grid size-11 place-items-center rounded-full transition-colors hover:bg-raise md:hidden">
            <Search size={20} />
          </button>
          <button
            onClick={() => ui.open("settings")}
            aria-label="Theme settings"
            className="grid size-11 place-items-center rounded-full transition-[background-color,transform] duration-300 hover:rotate-12 hover:bg-raise"
          >
            <Palette size={20} />
          </button>
          {user ? (
            <Link href="/me" className="btn btn-ink hidden sm:inline-flex" aria-label="Your account">
              <UserRound size={17} /> My Path
            </Link>
          ) : (
            <Link href="/login" className="btn btn-accent hidden sm:inline-flex">
              Sign in
            </Link>
          )}
        </div>

        {/* Reading progress: a route line along the capsule's lower edge, with a train at its head */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-8 -bottom-[2px] h-[3px] opacity-0 transition-opacity duration-500 group-data-[scrolled=true]/bar:opacity-100"
        >
          <div className="h-full origin-left bg-ink [transform:scaleX(var(--progress,0))]" />
          <div className="absolute top-1/2 h-[9px] w-[18px] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-ink bg-accent [left:calc(var(--progress,0)*100%)]" />
        </div>
      </div>
    </header>
  );
}
