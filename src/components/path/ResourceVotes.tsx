"use client";

import Link from "next/link";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import { supabase, useUser } from "@/lib/supabase";

type Vote = 1 | -1;
type VotesState = {
  signedIn: boolean | undefined;
  helpful: Record<string, number>;
  mine: Record<string, Vote>;
  vote: (url: string, vote: Vote | null, skillSlug?: string) => Promise<void>;
};

const Ctx = createContext<VotesState | null>(null);

/** Loads helpful counts (and your own votes) for one list of resources in a single request each. */
export function VotesProvider({ urls, children }: { urls: string[]; children: React.ReactNode }) {
  const user = useUser();
  const key = urls.join("\n");
  const [helpful, setHelpful] = useState<Record<string, number>>({});
  const [mine, setMine] = useState<{ userId: string; votes: Record<string, Vote> } | null>(null);

  useEffect(() => {
    let cancelled = false;
    const list = key.split("\n").filter(Boolean);
    supabase()
      .rpc("resource_helpful_counts", { urls: list })
      .then(({ data }) => {
        if (cancelled || !data) return;
        const counts: Record<string, number> = {};
        for (const row of data as { url: string; helpful: number }[]) counts[row.url] = Number(row.helpful);
        setHelpful(counts);
      });
    return () => {
      cancelled = true;
    };
  }, [key]);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    supabase()
      .from("resource_votes")
      .select("url, vote")
      .eq("user_id", user.id)
      .then(({ data }) => {
        if (cancelled) return;
        const votes: Record<string, Vote> = {};
        for (const row of data ?? []) votes[row.url] = row.vote as Vote;
        setMine({ userId: user.id, votes });
      });
    return () => {
      cancelled = true;
    };
  }, [user]);

  const myVotes = useMemo(() => (mine && mine.userId === user?.id ? mine.votes : {}), [mine, user]);

  const vote = useCallback(
    async (url: string, next: Vote | null, skillSlug?: string) => {
      if (!user) return;
      const before = { helpful, votes: myVotes };
      const prev = myVotes[url];
      const delta = (next === 1 ? 1 : 0) - (prev === 1 ? 1 : 0);
      setHelpful((h) => ({ ...h, [url]: Math.max(0, (h[url] ?? 0) + delta) }));
      setMine(() => {
        const votes = { ...myVotes };
        if (next) votes[url] = next;
        else delete votes[url];
        return { userId: user.id, votes };
      });
      const db = supabase();
      const { error } = next
        ? await db
            .from("resource_votes")
            .upsert({ user_id: user.id, url, vote: next, skill_slug: skillSlug ?? null, updated_at: new Date().toISOString() }, { onConflict: "user_id,url" })
        : await db.from("resource_votes").delete().eq("user_id", user.id).eq("url", url);
      if (error) {
        setHelpful(before.helpful);
        setMine({ userId: user.id, votes: before.votes });
      }
    },
    [user, helpful, myVotes],
  );

  const value = useMemo<VotesState>(
    () => ({ signedIn: user === undefined ? undefined : !!user, helpful, mine: myVotes, vote }),
    [user, helpful, myVotes, vote],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

/** "Helpful?" thumbs for one resource. The helpful count is public; thumbs-down are only seen by the team. */
export function HelpfulVote({ url, title, skillSlug }: { url: string; title: string; skillSlug?: string }) {
  const v = useContext(Ctx);
  if (!v) return null;
  const count = v.helpful[url] ?? 0;
  const mine = v.mine[url];
  const btn = "inline-flex h-7 items-center gap-1 rounded-full border px-2 text-[12.5px] font-semibold transition-colors";

  if (!v.signedIn) {
    return (
      <span className="relative z-10 inline-flex items-center gap-2 text-[12.5px] text-muted">
        <Link href="/login" aria-label={`Sign in to rate ${title}`} className={`${btn} border-line hover:border-ink hover:text-ink`}>
          <ThumbsUp size={13} /> {count > 0 ? count : "Helpful?"}
        </Link>
      </span>
    );
  }

  return (
    <span className="relative z-10 inline-flex items-center gap-1.5" role="group" aria-label={`Rate ${title}`}>
      <button
        onClick={() => v.vote(url, mine === 1 ? null : 1, skillSlug)}
        aria-pressed={mine === 1}
        aria-label={`Helpful${count ? `, ${count} so far` : ""}`}
        className={`${btn} ${mine === 1 ? "border-ink bg-ink text-canvas" : "border-line hover:border-ink"}`}
      >
        <ThumbsUp size={13} /> {count > 0 ? count : "Helpful"}
      </button>
      <button
        onClick={() => v.vote(url, mine === -1 ? null : -1, skillSlug)}
        aria-pressed={mine === -1}
        aria-label="Not helpful, outdated or broken"
        title="Not helpful, outdated or broken. Only the Code Journey team sees this."
        className={`${btn} ${mine === -1 ? "border-ink bg-ink text-canvas" : "border-line hover:border-ink"}`}
      >
        <ThumbsDown size={13} />
      </button>
    </span>
  );
}
