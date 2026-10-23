// Keeps db/functions/ in step with the migrations. The migrations are what the database runs, and each
// function is redefined in several of them. The newest definition must match the readable copy in db/functions/.
import { readdirSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const migrationsDir = new URL("../../supabase/migrations/", import.meta.url);
const functionsDir = new URL("../../db/functions/", import.meta.url);

/** The SQL of one function definition: from its `create` keyword to the closing `$$;`, with comments and whitespace normalised. */
function definition(sql: string, name: string) {
  const at = sql.indexOf(`function public.${name}(`);
  if (at === -1) return null;
  const start = sql.lastIndexOf("create", at);
  const open = sql.indexOf("$$", at);
  const close = sql.indexOf("$$", open + 2);
  const end = sql.indexOf(";", close) + 1;
  return normalise(sql.slice(start, end));
}

function normalise(sql: string) {
  return sql
    .split("\n")
    .filter((line) => !line.trim().startsWith("--"))
    .join("\n")
    .replace(/^create (or replace )?/, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** The newest migration (by filename) that defines the function. */
function latestMigrationDefinition(name: string) {
  const files = readdirSync(migrationsDir).filter((f) => f.endsWith(".sql")).sort();
  let latest: string | null = null;
  for (const f of files) {
    const found = definition(readFileSync(new URL(f, migrationsDir), "utf8"), name);
    if (found) latest = found;
  }
  return latest;
}

describe.each(["get_public_path", "weekly_email_batch"])("db/functions/%s.sql", (name) => {
  it("matches the newest migration that defines it", () => {
    const copy = readFileSync(new URL(`${name}.sql`, functionsDir), "utf8");
    expect(definition(copy, name)).toBe(latestMigrationDefinition(name));
  });
});
