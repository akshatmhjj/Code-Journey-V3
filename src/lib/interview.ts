import "server-only";
import fs from "node:fs";
import path from "node:path";
import { cache } from "react";
import YAML from "yaml";
import { z } from "zod";
import { VISUAL_IDS } from "./interview-visuals";

const ROOT = path.join(process.cwd(), "content", "interview");

/** The order the topics appear on the prep index and in "next topic" links. */
const ORDER = ["os", "networks", "dbms", "oop", "dsa"];

const Topic = z.object({
  title: z.string(),
  slug: z.string(),
  brief: z.string(),
  say: z.string(),
  concepts: z
    .array(z.object({ term: z.string(), def: z.string(), hook: z.string().optional(), visual: z.enum(VISUAL_IDS).optional() }))
    .min(1),
  questions: z.array(z.object({ q: z.string(), a: z.string(), visual: z.enum(VISUAL_IDS).optional() })).min(1),
  traps: z.array(z.string()).default([]),
  checked: z.coerce.date(),
});
export type InterviewTopic = z.infer<typeof Topic>;

/** Loads every prep topic from content/interview and fails the build on any invalid file. */
export const getInterviewTopics = cache(() => {
  const topics = fs
    .readdirSync(ROOT)
    .filter((file) => file.endsWith(".yaml"))
    .map((file) => {
      const data = YAML.parse(fs.readFileSync(path.join(ROOT, file), "utf8"));
      const r = Topic.safeParse(data);
      if (!r.success) throw new Error(`Invalid content in interview/${file}:\n${z.prettifyError(r.error)}`);
      if (r.data.slug !== file.replace(/\.yaml$/, "")) throw new Error(`interview/${file}: slug must match the file name`);
      return r.data;
    });
  const rank = (slug: string) => {
    const i = ORDER.indexOf(slug);
    return i === -1 ? ORDER.length : i;
  };
  return topics.sort((a, b) => rank(a.slug) - rank(b.slug));
});

export const getInterviewTopic = (slug: string) => getInterviewTopics().find((t) => t.slug === slug);
