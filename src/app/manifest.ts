import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

// What phones and desktops read when someone installs Code Journey as an app. Served at /manifest.webmanifest.
export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: `${SITE.name}: ${SITE.tagline}`,
    short_name: "Code Journey",
    description: SITE.description,
    lang: "en",
    start_url: "/?source=app",
    scope: "/",
    display: "standalone",
    display_override: ["standalone", "minimal-ui"],
    // Splash screen and status bar, in the Tangerine theme.
    background_color: "#FAF3E1",
    theme_color: "#222222",
    categories: ["education", "productivity"],
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/maskable-192.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
      { src: "/icons/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    // Long-press the app icon (Android, desktop) to jump straight to these.
    shortcuts: [
      { name: "My Path", short_name: "My Path", url: "/me?source=app", icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }] },
      { name: "Find a role (Compass)", short_name: "Compass", url: "/compass?source=app", icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }] },
      { name: "Check a job post", short_name: "Gap checker", url: "/gap?source=app", icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }] },
      { name: "All roles", short_name: "Roles", url: "/roles?source=app", icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }] },
    ],
  };
}
