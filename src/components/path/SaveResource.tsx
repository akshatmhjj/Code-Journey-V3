"use client";

import Link from "next/link";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { usePath } from "./PathProvider";

/** Bookmark toggle for one resource. Signed-out visitors get a link to sign in instead. */
export function SaveResource({ url, title, skillSlug }: { url: string; title: string; skillSlug?: string }) {
  const path = usePath();
  if (!path || path.signedIn === undefined || path.loading) return <span className="size-9" aria-hidden="true" />;

  const cls = "relative z-10 grid size-9 place-items-center rounded-full border-2 transition-colors";
  if (!path.signedIn) {
    return (
      <Link href="/login" title="Sign in to save resources" aria-label={`Sign in to save ${title}`} className={`${cls} border-line text-muted hover:border-ink hover:text-ink`}>
        <Bookmark size={16} />
      </Link>
    );
  }

  const on = path.saved.some((r) => r.url === url);
  return (
    <button
      onClick={() => path.toggleSaved({ url, title, skillSlug })}
      aria-pressed={on}
      aria-label={on ? `Remove ${title} from saved` : `Save ${title}`}
      title={on ? "Saved - click to remove" : "Save for later"}
      className={`${cls} ${on ? "border-ink bg-ink text-canvas" : "border-line hover:border-ink"}`}
    >
      {on ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
    </button>
  );
}
