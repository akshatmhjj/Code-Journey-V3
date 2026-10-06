// Formatting for market figures. No server-only imports, so client components can use it.

/** 6.65 → "₹6.7 L", 10.23 → "₹10.2 L", 20 → "₹20 L". Values are lakh rupees a year. */
export function lakh(n: number) {
  return `₹${Number.isInteger(n) ? n : n.toFixed(1)} L`;
}

/** 135980 → "$136k". */
export function usd(n: number) {
  return `$${Math.round(n / 1000)}k`;
}

/** 10 → "+10%". */
export function growth(n: number) {
  return `${n > 0 ? "+" : ""}${n}%`;
}

const monthYear = new Intl.DateTimeFormat("en-GB", { month: "short", year: "numeric", timeZone: "UTC" });
export const fmtMonth = (d: Date | string) => monthYear.format(new Date(d));

/** Below this many salary reports, a figure is shown with a "small sample" warning. */
export const SMALL_SAMPLE = 100;
