/**
 * Meta descriptions read best at about 155 characters or fewer. This trims at a word boundary
 * and adds an ellipsis, so a search result never ends mid-word.
 */
export function snippet(text: string, max = 155) {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1).replace(/\s+\S*$/, "");
  return `${cut.replace(/[.,;:\s-]+$/, "")}…`;
}
