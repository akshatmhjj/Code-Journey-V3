"use client";

import Link from "next/link";
import type { Domain, RoleEntry } from "@/lib/content";
import { NetworkList } from "@/components/map/NetworkList";
import { Sheet } from "./Sheet";
import { useUI } from "./UIProvider";

/** Full-screen network: every domain and role, replacing dropdown menus. */
export function NetworkOverlay({ domains, roles }: { domains: Domain[]; roles: RoleEntry[] }) {
  const ui = useUI();
  const close = ui.close;
  return (
    <Sheet open={ui.panel === "network"} onClose={close} label="The network" variant="full">
      <div className="overflow-y-auto">
        <div className="wrap py-8 md:py-12">
          <p className="eyebrow">The network</p>
          <h2 className="mt-3 max-w-3xl text-[clamp(2rem,5vw,3.5rem)] font-bold">Where do you want to go?</h2>
          <p className="mt-3 max-w-2xl text-lg text-muted">
            Every line is a field of tech; every station is a role with its full route - stages, skills and the best resources for each.
          </p>
          <div className="mt-10">
            <NetworkList domains={domains} roles={roles} onNavigate={close} />
          </div>
          <div className="mt-12 flex flex-wrap gap-3 border-t-2 border-ink pt-6">
            <Link href="/compass" onClick={close} className="btn btn-accent">
              Find my fit (2-min quiz)
            </Link>
            <Link href="/domains/foundations" onClick={close} className="btn btn-ink">
              Start with the foundations
            </Link>
            <Link href="/skills" onClick={close} className="btn btn-line">
              All skills
            </Link>
            <Link href="/resources" onClick={close} className="btn btn-line">
              Resource library
            </Link>
          </div>
        </div>
      </div>
    </Sheet>
  );
}
