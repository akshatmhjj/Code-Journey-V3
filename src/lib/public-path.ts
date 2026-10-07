import "server-only";
import { cache } from "react";
import type { Statuses } from "@/lib/path";

export type PublicPath = {
  handle: string;
  name: string;
  role: string | null;
  started_at: string | null;
  statuses: Statuses;
  updated_at: string | null;
  streak?: number;
};

const HANDLE = /^[a-z0-9][a-z0-9_-]{2,29}$/;

/** A public path page's data, or null when the handle doesn't exist or sharing is off. */
export const getPublicPath = cache(async (handle: string): Promise<PublicPath | null> => {
  const h = handle.toLowerCase();
  if (!HANDLE.test(h)) return null;
  const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc/get_public_path`, {
    method: "POST",
    headers: {
      apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ p_handle: h }),
    cache: "no-store",
  });
  if (!res.ok) return null;
  return (await res.json()) as PublicPath | null;
});
