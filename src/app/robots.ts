import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

// Search engines and AI assistants (search and training crawlers) are all welcome.
const AI_BOTS = ["OAI-SearchBot", "ChatGPT-User", "GPTBot", "PerplexityBot", "Perplexity-User", "Claude-SearchBot", "Claude-User", "ClaudeBot", "Google-Extended", "Applebot-Extended", "Bingbot"];
const PRIVATE = ["/api/", "/me", "/login"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: PRIVATE }, ...AI_BOTS.map((userAgent) => ({ userAgent, allow: "/", disallow: PRIVATE }))],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
