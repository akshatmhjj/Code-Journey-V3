import { getNetwork } from "@/lib/content";
import { Header } from "@/components/shell/Header";
import { Footer } from "@/components/shell/Footer";
import { MobileDock } from "@/components/shell/MobileDock";
import { NetworkOverlay } from "@/components/shell/NetworkOverlay";
import { ChatPanel } from "@/components/shell/ChatPanel";

/** The full site chrome: header, footer, mobile dock, network overlay and CJ AI. */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  const net = getNetwork();
  return (
    <div className="pb-[76px] md:pb-0">
      <Header roleTitles={net.roles.filter((r) => r.wave === 1).map((r) => r.title)} />
      <main id="main">{children}</main>
      <Footer />
      <MobileDock />
      <NetworkOverlay domains={net.domains} roles={net.roles} />
      <ChatPanel />
    </div>
  );
}
