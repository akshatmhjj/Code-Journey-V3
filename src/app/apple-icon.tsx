import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#092634" }}>
        <svg width="132" height="132" viewBox="0 0 64 64">
          <path d="M30 25.88A14 14 0 1 0 23 52L43 52A8 8 0 0 0 51 44L51 18" fill="none" stroke="#F9F9F9" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="30" cy="25.88" r="5" fill="#092634" stroke="#F9F9F9" strokeWidth="3.4" />
          <circle cx="51" cy="14" r="7" fill="#FF6E42" stroke="#092634" strokeWidth="2.5" />
        </svg>
      </div>
    ),
    size,
  );
}
