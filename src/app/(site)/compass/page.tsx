import type { Metadata } from "next";
import { getCatalog, getCompass, getNetwork } from "@/lib/content";
import { Compass } from "./Compass";

export const metadata: Metadata = {
  title: "Which Tech Role Fits You? A 2-Minute Quiz",
  description: "Answer eight quick questions and get three tech roles that suit you - with the reasons, and the full route for each.",
  alternates: { canonical: "/compass" },
};

export default function CompassPage() {
  const domains = new Map(getCatalog().domains.map((d) => [d.slug, d.name]));
  const roles = Object.fromEntries(
    getNetwork().roles.map((r) => [r.slug, { title: r.title, oneLiner: r.oneLiner, domain: domains.get(r.domain) ?? "" }]),
  );
  return <Compass questions={getCompass()} roles={roles} />;
}
