import { ImageResponse } from "next/og";

export const OG_SIZE = { width: 1200, height: 630 };

/** Shared social card: Harbor navy, a transit line with stations, title and kicker. */
export function ogCard({ kicker, title, sub }: { kicker: string; title: string; sub?: string }) {
  const navy = "#092634";
  const white = "#F9F9F9";
  const orange = "#FF6E42";
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: navy, color: white, padding: "64px 72px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <svg width="64" height="64" viewBox="0 0 64 64">
            <path d="M30 25.88A14 14 0 1 0 23 52L43 52A8 8 0 0 0 51 44L51 18" fill="none" stroke={white} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="30" cy="25.88" r="5" fill={navy} stroke={white} strokeWidth="3.4" />
            <circle cx="51" cy="14" r="7" fill={orange} stroke={navy} strokeWidth="2.5" />
          </svg>
          <span style={{ fontSize: 34, fontWeight: 700, letterSpacing: -1 }}>Code Journey</span>
          <span style={{ marginLeft: "auto", fontSize: 22, color: "#a9bcc6", letterSpacing: 3 }}>{kicker.toUpperCase()}</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", marginTop: "auto" }}>
          <span style={{ fontSize: title.length > 26 ? 76 : 96, fontWeight: 700, lineHeight: 1, letterSpacing: -3 }}>{title}</span>
          {sub && <span style={{ fontSize: 30, color: "#c9d6dc", marginTop: 22, lineHeight: 1.3, maxWidth: 980 }}>{sub}</span>}
        </div>
        <svg width="1056" height="40" viewBox="0 0 1056 40" style={{ marginTop: 44 }}>
          <path d="M8 20H1048" stroke={white} strokeWidth="8" />
          <circle cx="8" cy="20" r="10" fill={navy} stroke={white} strokeWidth="5" />
          <circle cx="360" cy="20" r="10" fill={navy} stroke={white} strokeWidth="5" />
          <circle cx="700" cy="20" r="10" fill={navy} stroke={white} strokeWidth="5" />
          <circle cx="1040" cy="20" r="14" fill={orange} stroke={white} strokeWidth="5" />
        </svg>
      </div>
    ),
    OG_SIZE,
  );
}
