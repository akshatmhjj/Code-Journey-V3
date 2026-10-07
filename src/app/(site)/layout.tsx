import { getNetwork, getPathIndex } from "@/lib/content";
import { Header } from "@/components/shell/Header";
import { Footer } from "@/components/shell/Footer";
import { PhoneHeader } from "@/components/shell/PhoneHeader";
import { NetworkOverlay } from "@/components/shell/NetworkOverlay";
import { ChatPanel } from "@/components/shell/ChatPanel";
import { PathProvider } from "@/components/path/PathProvider";

/** The full site chrome: header (phone and desktop), footer, network overlay and CJ AI. */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  const net = getNetwork();
  const routes = getPathIndex().roles.map((r) => ({ slug: r.slug, title: r.title, stages: r.stages.map((s) => ({ name: s.name, skills: s.skills })) }));
  return (
    <PathProvider routes={routes}>
    <div>
      <PhoneHeader />
      <Header roleTitles={net.roles.filter((r) => r.wave === 1).map((r) => r.title)} />
      <main id="main">{children}</main>
      <Footer />
      <NetworkOverlay domains={net.domains} roles={net.roles} />
      <ChatPanel />
    </div>
    </PathProvider>
  );
}
