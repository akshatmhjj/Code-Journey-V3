"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
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
function useRotating(items: string[], ms = 2600) {
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

export function Header({ roleTitles }: { roleTitles: string[] }) {
  const ui = useUI();
  const user = useUser();
  const path = usePathname();
  const role = useRotating(roleTitles);
  const [mac, setMac] = useState(true);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMac(/Mac|iPhone|iPad/.test(navigator.platform)), []);

  return (
    <header className="sticky top-0 z-40 border-b-[3px] border-ink bg-[color-mix(in_oklab,var(--canvas)_92%,transparent)] backdrop-blur-md">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-ink focus:px-3 focus:py-2 focus:text-canvas">
        Skip to content
      </a>
      <div className="wrap flex h-[var(--header-h)] items-center gap-3 lg:gap-5">
        <Link href="/" aria-label="Code Journey home" className="shrink-0">
          <Logo />
        </Link>

        <button
          onClick={() => ui.open("search")}
          className="group ml-2 hidden h-11 min-w-0 flex-1 items-center gap-3 rounded-full border-2 border-ink bg-canvas px-4 text-left transition-colors hover:bg-raise md:flex lg:max-w-[440px]"
          aria-label="Search roles, skills and resources"
        >
          <Search size={18} className="shrink-0" />
          <span className="min-w-0 flex-1 truncate text-[15px] text-muted">
            I want to become {article(role)} <span className="font-semibold text-ink">{role}</span>
          </span>
          <kbd className="hidden shrink-0 rounded border border-line-strong px-1.5 py-0.5 font-mono text-[11px] text-muted lg:inline">
            {mac ? "⌘K" : "Ctrl K"}
          </kbd>
        </button>

        <nav aria-label="Main" className="ml-auto hidden items-center gap-1 lg:flex">
          <button
            onClick={() => ui.open("network")}
            className="flex h-10 items-center gap-2 rounded-full px-3.5 font-display font-semibold hover:bg-raise"
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
                className={`flex h-10 items-center rounded-full px-3.5 font-display font-semibold hover:bg-raise ${
                  active ? "underline decoration-accent decoration-[3px] underline-offset-[6px]" : ""
                }`}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-1.5 lg:ml-0">
          <button
            onClick={() => ui.open("search")}
            aria-label="Search"
            className="grid size-11 place-items-center rounded-full hover:bg-raise md:hidden"
          >
            <Search size={20} />
          </button>
          <button
            onClick={() => ui.open("settings")}
            aria-label="Theme settings"
            className="grid size-11 place-items-center rounded-full hover:bg-raise"
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
      </div>
    </header>
  );
}
