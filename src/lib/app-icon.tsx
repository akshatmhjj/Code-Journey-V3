import { ImageResponse } from "next/og";

// The app icon in Tangerine: the "Route CJ" mark in cream on charcoal, with the orange terminus.
const BG = "#222222";
const INK = "#FAF3E1";
const DOT = "#FF6D1F";

/**
 * size: output pixels. maskable: shrink the mark into the central safe zone, because Android
 * crops maskable icons into circles, squircles and so on, and only the middle 80% is guaranteed to show.
 */
export function appIcon(size: number, { maskable = false } = {}) {
  const mark = Math.round(size * (maskable ? 0.56 : 0.74));
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: BG }}>
        <svg width={mark} height={mark} viewBox="0 0 64 64">
          <path d="M30 25.88A14 14 0 1 0 23 52L43 52A8 8 0 0 0 51 44L51 18" fill="none" stroke={INK} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="30" cy="25.88" r="5" fill={BG} stroke={INK} strokeWidth="3.4" />
          <circle cx="51" cy="14" r="7" fill={DOT} stroke={BG} strokeWidth="2.5" />
        </svg>
      </div>
    ),
    { width: size, height: size },
  );
}
