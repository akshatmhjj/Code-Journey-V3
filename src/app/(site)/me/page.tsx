import type { Metadata } from "next";
import { getPathIndex } from "@/lib/content";
import { MeView } from "./MeView";

export const metadata: Metadata = { title: "My Path", robots: { index: false } };

export default function Me() {
  return <MeView index={getPathIndex()} />;
}
