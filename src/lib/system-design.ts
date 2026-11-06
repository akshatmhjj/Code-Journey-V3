import "server-only";
import fs from "node:fs";
import path from "node:path";
import { cache } from "react";
import YAML from "yaml";
import { z } from "zod";
import { LEVELS, TOPICS } from "./system-design-meta";

const ROOT = path.join(process.cwd(), "content", "system-design");

/** Path slugs that would clash with the fixed pages under /system-design. */
const RESERVED = ["articles", "glossary"];

const Article = z.object({
  id: z.string(),
  title: z.string(),
  topic: z.enum(TOPICS),
  date: z.coerce.date(),
  level: z.enum(LEVELS),
  source: z.url(),
  why: z.string(),
  summary: z.string(),
  points: z.array(z.string()).min(3),
  terms: z.array(z.string()).default([]),
  needs: z.array(z.string()).default([]),
});

const Path = z.object({
  title: z.string(),
  slug: z.string(),
  order: z.number(),
  level: z.enum(LEVELS),
  purpose: z.string(),
  assumes: z.string(),
  outcome: z.string(),
  articles: z.array(Article).min(1),
  checks: z.array(z.object({ q: z.string(), a: z.string() })).min(2),
});

const Glossary = z.object({ terms: z.array(z.object({ id: z.string(), term: z.string(), def: z.string() })).min(1) });

export type SdTerm = z.infer<typeof Glossary>["terms"][number];
export type SdArticle = z.infer<typeof Article> & { path: string; position: number };
export type SdPath = Omit<z.infer<typeof Path>, "articles"> & { articles: SdArticle[] };

function readYaml(file: string) {
  return YAML.parse(fs.readFileSync(file, "utf8"));
}

/**
 * Loads the glossary and every learning path, and fails the build on anything that does not hold together:
 * a missing file field, a duplicate id, an unknown term, or a prerequisite that is not read first.
 */
export const getSdData = cache(() => {
  const g = Glossary.safeParse(readYaml(path.join(ROOT, "glossary.yaml")));
  if (!g.success) throw new Error(`Invalid content in system-design/glossary.yaml:\n${z.prettifyError(g.error)}`);
  const terms = g.data.terms;
  const termIds = new Set(terms.map((t) => t.id));
  if (termIds.size !== terms.length) throw new Error("system-design/glossary.yaml: term ids must be unique");

  const dir = path.join(ROOT, "paths");
  const paths: SdPath[] = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".yaml"))
    .map((file) => {
      const r = Path.safeParse(readYaml(path.join(dir, file)));
      if (!r.success) throw new Error(`Invalid content in system-design/paths/${file}:\n${z.prettifyError(r.error)}`);
      const p = r.data;
      if (p.slug !== file.replace(/\.yaml$/, "")) throw new Error(`system-design/paths/${file}: slug must match the file name`);
      if (RESERVED.includes(p.slug)) throw new Error(`system-design/paths/${file}: "${p.slug}" is a reserved page name`);
      return { ...p, articles: p.articles.map((a, i) => ({ ...a, path: p.slug, position: i + 1 })) };
    })
    .sort((a, b) => a.order - b.order);

  const byId = new Map<string, SdArticle>();
  for (const p of paths) {
    for (const a of p.articles) {
      if (byId.has(a.id)) throw new Error(`system-design: duplicate article id "${a.id}"`);
      byId.set(a.id, a);
    }
  }
  for (const p of paths) {
    for (const a of p.articles) {
      for (const t of a.terms) if (!termIds.has(t)) throw new Error(`system-design/${p.slug}: "${a.id}" uses unknown term "${t}"`);
      for (const n of a.needs) {
        const need = byId.get(n);
        if (!need) throw new Error(`system-design/${p.slug}: "${a.id}" needs unknown article "${n}"`);
        if (need.path === p.slug && need.position >= a.position) throw new Error(`system-design/${p.slug}: "${a.id}" needs "${n}", which must come earlier in the path`);
      }
    }
  }
  return { paths, terms, byId };
});

export const getSdPaths = () => getSdData().paths;
export const getSdPath = (slug: string) => getSdPaths().find((p) => p.slug === slug);
export const getSdArticles = () => getSdPaths().flatMap((p) => p.articles);
export const getSdArticle = (id: string) => getSdData().byId.get(id);
export const getSdTerms = () => getSdData().terms;
export const getSdTerm = (id: string) => getSdTerms().find((t) => t.id === id);
