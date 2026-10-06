import type { Metadata } from "next";
import { getGapData } from "@/lib/content";
import { GapAnalyser } from "./GapAnalyser";

export const metadata: Metadata = {
  title: "Job Post Skill Gap Checker",
  description: "Paste any tech job post to see which skills it asks for, which you already have, and the best free resources to learn the rest. Runs in your browser — nothing is uploaded.",
  alternates: { canonical: "/gap" },
};

export default function GapPage() {
  return <GapAnalyser data={getGapData()} />;
}
