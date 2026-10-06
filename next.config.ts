import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Accept the old Vite variable names so existing Vercel env vars keep working.
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.VITE_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.VITE_SUPABASE_ANON_KEY,
  },
  poweredByHeader: false,
  devIndicators: false,
  async redirects() {
    return [
      { source: "/tracks", destination: "/roles", permanent: true },
      { source: "/tracks/web", destination: "/domains/web", permanent: true },
      { source: "/tracks/app", destination: "/domains/mobile", permanent: true },
      { source: "/tracks/data", destination: "/domains/data", permanent: true },
      { source: "/roadmap", destination: "/roles", permanent: true },
      { source: "/ecosystem", destination: "/skills", permanent: true },
      { source: "/logs", destination: "/changelog", permanent: true },
      { source: "/licensing", destination: "/terms", permanent: true },
      { source: "/privacy-policy", destination: "/privacy", permanent: true },
      { source: "/profile", destination: "/me", permanent: true },
      { source: "/snippets", destination: "/skills", permanent: true },
      { source: "/register", destination: "/login?mode=signup", permanent: true },
      // Will point at /market once market notes ship (Phase 5).
      { source: "/careers", destination: "/roles", permanent: false },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
