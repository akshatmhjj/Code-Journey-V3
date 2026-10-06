"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { LogOut } from "lucide-react";
import { supabase, useUser } from "@/lib/supabase";
import { ThemePicker } from "@/components/shell/ThemeSettings";

const fmt = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" });

export function MeView() {
  const user = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user === null) router.replace("/login");
  }, [user, router]);

  if (!user) {
    return (
      <div className="wrap py-24" aria-busy="true">
        <div className="h-14 w-72 max-w-full animate-pulse rounded-[var(--radius-md)] bg-surface" />
      </div>
    );
  }

  const name = (user.user_metadata?.full_name as string | undefined)?.split(" ")[0];
  return (
    <div className="wrap py-12 md:py-20">
      <p className="eyebrow">My Path</p>
      <h1 className="mt-4 text-[clamp(2.5rem,7vw,5rem)] leading-[0.95] font-bold tracking-[-0.04em]">{name ? `Hi, ${name}.` : "Welcome."}</h1>
      <p className="mt-4 text-lg text-muted">
        {user.email} · member since {fmt.format(new Date(user.created_at))}
      </p>

      <div className="mt-12 grid gap-8 lg:grid-cols-[1.3fr_1fr]">
        <section className="rounded-[var(--radius-lg)] border-2 border-dashed border-ink p-6 md:p-8" aria-labelledby="route-title">
          <h2 id="route-title" className="text-3xl font-bold">Your route</h2>
          <p className="mt-3 max-w-[50ch] text-muted">
            Soon you&apos;ll pick a destination here and tick off skills as you go, with your next station always one tap away. For now, every route is open to read.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/roles" className="btn btn-accent">
              Choose a destination
            </Link>
            <Link href="/roles/frontend-engineer" className="btn btn-line">
              See a finished route
            </Link>
          </div>
        </section>
        <section className="rounded-[var(--radius-lg)] border-2 border-ink p-6 md:p-8" aria-labelledby="look-title">
          <h2 id="look-title" className="mb-5 text-2xl font-bold">
            Look and feel
          </h2>
          <ThemePicker />
        </section>
      </div>

      <button
        onClick={async () => {
          await supabase().auth.signOut();
          router.push("/");
        }}
        className="btn btn-line mt-10"
      >
        <LogOut size={17} /> Sign out
      </button>
    </div>
  );
}
