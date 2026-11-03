import type { Metadata } from "next";
import { getSwitchData } from "@/lib/content";
import { SwitchFinder } from "./SwitchFinder";

export const metadata: Metadata = {
  title: "Switch careers: tech roles near the work you do now",
  description: "Already working in teaching, accounting, support or another field? See the tech roles closest to your work, the skills you may already have, and where to start.",
  alternates: { canonical: "/switch" },
};

export default function SwitchPage() {
  const { jobs, roles, skillTitles } = getSwitchData();
  return <SwitchFinder jobs={jobs} roles={roles} skillTitles={skillTitles} />;
}
