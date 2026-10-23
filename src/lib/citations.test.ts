import { describe, expect, it } from "vitest";
import { citationFilter } from "@/lib/citations";

/** Feeds the text in small pieces, the way the model streams it. */
function run(text: string, sources: number, chunk = 1) {
  const f = citationFilter(sources);
  let out = "";
  for (let i = 0; i < text.length; i += chunk) out += f.push(text.slice(i, i + chunk));
  out += f.flush();
  return { out, dropped: f.dropped };
}

describe("citationFilter", () => {
  it("keeps markers that point at a given source", () => {
    expect(run("SQL is a skill [1][2].", 3).out).toBe("SQL is a skill [1][2].");
  });

  it("drops a marker that points past the last source and counts it", () => {
    const r = run("Done [4] and [1].", 3);
    expect(r.out).toBe("Done  and [1].");
    expect(r.dropped).toBe(1);
  });

  it("drops zero and oversized numbers", () => {
    expect(run("x[0]y[99]z", 3).out).toBe("xyz");
  });

  it("leaves ordinary brackets alone, even split across chunks", () => {
    expect(run("See [the guide](/skills/git) and [docs].", 2).out).toBe("See [the guide](/skills/git) and [docs].");
  });

  it("gives the same result when the answer arrives one character at a time", () => {
    const text = "Learn SQL first [1], then [2]. Bad [9] here.";
    expect(run(text, 2, 1).out).toBe(run(text, 2, 50).out);
    expect(run(text, 2, 1).out).toBe("Learn SQL first [1], then [2]. Bad  here.");
  });

  it("releases an unfinished marker at the end instead of losing it", () => {
    expect(run("trailing [1", 3).out).toBe("trailing [1");
  });

  it("handles a bracket right after a held marker", () => {
    expect(run("a [[1]", 1).out).toBe("a [[1]");
  });
});
