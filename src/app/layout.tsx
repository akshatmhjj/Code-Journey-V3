import type { Metadata, Viewport } from "next";
import { Familjen_Grotesk, IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import { getNetwork } from "@/lib/content";
import { SITE } from "@/lib/site";
import { UIProvider, THEME_SCRIPT } from "@/components/shell/UIProvider";
import { Header } from "@/components/shell/Header";
import { Footer } from "@/components/shell/Footer";
import { MobileDock } from "@/components/shell/MobileDock";
import { CommandPalette } from "@/components/shell/CommandPalette";
import { ThemeSettings } from "@/components/shell/ThemeSettings";
import { NetworkOverlay } from "@/components/shell/NetworkOverlay";
import { ChatPanel } from "@/components/shell/ChatPanel";
import { ConsentBanner, ANALYTICS_SCRIPT } from "@/components/shell/Consent";
import { JsonLd } from "@/components/ui/JsonLd";
import "./globals.css";

const display = Familjen_Grotesk({ subsets: ["latin"], weight: ["500", "600", "700"], variable: "--font-display", display: "swap" });
const body = IBM_Plex_Sans({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-body", display: "swap" });
const code = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-code", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: `${SITE.name} — ${SITE.tagline}`, template: `%s · ${SITE.name}` },
  description: SITE.description,
  applicationName: SITE.name,
  alternates: { canonical: "/" },
  openGraph: { type: "website", siteName: SITE.name, locale: "en", url: "/" },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F9F9F9" },
    { media: "(prefers-color-scheme: dark)", color: "#092634" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const net = getNetwork();
  const roleTitles = net.roles.filter((r) => r.wave === 1).map((r) => r.title);
  return (
    <html lang="en" data-cj="harbor" suppressHydrationWarning className={`${display.variable} ${body.variable} ${code.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
        <script dangerouslySetInnerHTML={{ __html: ANALYTICS_SCRIPT }} />
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@graph": [
              { "@type": "WebSite", "@id": `${SITE.url}/#website`, url: SITE.url, name: SITE.name, description: SITE.description },
              { "@type": "Organization", "@id": `${SITE.url}/#org`, url: SITE.url, name: SITE.name, logo: `${SITE.url}/icon.svg` },
            ],
          }}
        />
      </head>
      <body className="min-h-dvh pb-[76px] md:pb-0">
        <UIProvider>
          <Header roleTitles={roleTitles} />
          <main id="main">{children}</main>
          <Footer />
          <MobileDock />
          <CommandPalette />
          <ThemeSettings />
          <NetworkOverlay domains={net.domains} roles={net.roles} />
          <ChatPanel />
          <ConsentBanner />
        </UIProvider>
      </body>
    </html>
  );
}
