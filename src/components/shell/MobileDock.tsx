"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Map, MessageCircle, Search, UserRound } from "lucide-react";
import { useUI } from "./UIProvider";

/** Bottom navigation on phones: Network, Search, Ask, Me. */
export function MobileDock() {
  const ui = useUI();
  const path = usePathname();
  const item = "flex flex-1 flex-col items-center justify-center gap-1 py-2 font-display text-[12px] font-semibold";
  return (
    <nav
      aria-label="Quick"
      className="fixed inset-x-0 bottom-0 z-40 border-t-[3px] border-ink bg-canvas pb-[env(safe-area-inset-bottom,0px)] md:hidden"
    >
      <div className="flex">
        <button className={item} onClick={() => ui.open("network")}>
          <Map size={21} /> Network
        </button>
        <button className={item} onClick={() => ui.open("search")}>
          <Search size={21} /> Search
        </button>
        <button className={item} onClick={() => ui.openChat()}>
          <MessageCircle size={21} /> Ask CJ
        </button>
        <Link href="/me" className={`${item} ${path === "/me" ? "text-hl" : ""}`}>
          <UserRound size={21} /> Me
        </Link>
      </div>
    </nav>
  );
}
