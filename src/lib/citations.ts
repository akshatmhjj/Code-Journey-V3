// Checks citation markers like [1] or [2] while the answer streams in.
// A marker is kept only if it points at a source that was actually given; anything else is dropped.
// No server-only imports, so it's testable on its own.

/** Longest marker we will hold back while waiting for its closing bracket: "[123]". */
const MAX_DIGITS = 3;

export function citationFilter(sourceCount: number) {
  let held = "";
  let dropped = 0;

  /** Returns the text that is safe to send now. A partial marker is held until it closes or breaks. */
  function push(delta: string): string {
    let out = "";
    for (const ch of delta) {
      if (held) {
        if (ch === "]") {
          held += ch;
          const n = Number(held.slice(1, -1));
          if (n >= 1 && n <= sourceCount) out += held;
          else dropped += 1;
          held = "";
        } else if (/\d/.test(ch) && held.length <= MAX_DIGITS) {
          held += ch;
        } else {
          // Not a citation after all, such as "[link](...)": release what was held and reprocess this character.
          out += held;
          held = "";
          if (ch === "[") held = ch;
          else out += ch;
        }
      } else if (ch === "[") {
        held = ch;
      } else {
        out += ch;
      }
    }
    return out;
  }

  /** Call at the end of the answer to release anything still held. */
  function flush(): string {
    const rest = held;
    held = "";
    return rest;
  }

  return { push, flush, get dropped() { return dropped; } };
}
