import type { Metadata, Viewport } from "next";
import { Familjen_Grotesk, IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import { SITE } from "@/lib/site";
import { UIProvider, THEME_SCRIPT } from "@/components/shell/UIProvider";
import { CommandPalette } from "@/components/shell/CommandPalette";
import { ThemeSettings } from "@/components/shell/ThemeSettings";
import { ConsentBanner, ANALYTICS_SCRIPT } from "@/components/shell/Consent";
import { JsonLd } from "@/components/ui/JsonLd";
import { ServiceWorker } from "@/components/shell/ServiceWorker";
import "./globals.css";

const display = Familjen_Grotesk({ subsets: ["latin"], weight: ["500", "600", "700"], variable: "--font-display", display: "swap" });
const body = IBM_Plex_Sans({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-body", display: "swap" });
const code = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-code", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: `${SITE.name} - ${SITE.tagline}`, template: `%s · ${SITE.name}` },
  description: SITE.description,
  applicationName: SITE.name,
  keywords: ["tech careers", "career roadmap", "learn to code", "tech roles", "skills roadmap", "free learning resources", "developer roadmap"],
  authors: [{ name: SITE.name, url: SITE.url }],
  creator: SITE.name,
  publisher: SITE.name,
  // Each page sets its own canonical and og:url. A site-wide "/" here would point every page at the homepage.
  openGraph: { type: "website", siteName: SITE.name, locale: "en_US" },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
  // Search Console and Bing Webmaster verification. Set these in the environment once the sites are added.
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
    other: process.env.BING_SITE_VERIFICATION ? { "msvalidate.01": process.env.BING_SITE_VERIFICATION } : undefined,
  },
  formatDetection: { telephone: false },
  // iPhone and iPad: full-screen when opened from the home screen, with this name under the icon.
  appleWebApp: { capable: true, title: "Code Journey", statusBarStyle: "default" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAF3E1" },
    { media: "(prefers-color-scheme: dark)", color: "#222222" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-cj="tangerine" suppressHydrationWarning className={`${display.variable} ${body.variable} ${code.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
        <script dangerouslySetInnerHTML={{ __html: ANALYTICS_SCRIPT }} />
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@graph": [
              { "@type": "WebSite", "@id": `${SITE.url}/#website`, url: SITE.url, name: SITE.name, description: SITE.description, inLanguage: "en", publisher: { "@id": `${SITE.url}/#org` } },
              // Google needs a raster logo (PNG or JPG) for rich results, so this points at the 512px app icon.
              { "@type": "Organization", "@id": `${SITE.url}/#org`, url: SITE.url, name: SITE.name, description: SITE.description, email: SITE.email, logo: { "@type": "ImageObject", url: `${SITE.url}/icons/icon-512.png`, width: 512, height: 512 } },
            ],
          }}
        />
      </head>
      <body className="min-h-dvh">
        <UIProvider>
          {children}
          <CommandPalette />
          <ThemeSettings />
          <ConsentBanner />
          <ServiceWorker />
        </UIProvider>
      </body>
    </html>
  );
}
