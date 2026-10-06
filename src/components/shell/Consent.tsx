"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { SITE } from "@/lib/site";

/**
 * GA4 with Consent Mode. Ads storage is always denied. Analytics is denied by default for
 * EEA/UK/CH visitors (by Google's region detection) and granted elsewhere. Visitors in a
 * European time zone see this banner and can opt in.
 */
export const ANALYTICS_SCRIPT = `(function(){if(!/(^|\\.)codejourney\\.space$/.test(location.hostname))return;
window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}window.gtag=gtag;
var noAds={ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'};
var c=null;try{c=localStorage.getItem('cj-consent')}catch(e){}
gtag('consent','default',Object.assign({analytics_storage:'denied',region:['AT','BE','BG','HR','CY','CZ','DK','EE','FI','FR','DE','GR','HU','IE','IT','LV','LT','LU','MT','NL','PL','PT','RO','SK','SI','ES','SE','IS','LI','NO','GB','CH']},noAds));
gtag('consent','default',Object.assign({analytics_storage:'granted'},noAds));
if(c)gtag('consent','update',{analytics_storage:c==='granted'?'granted':'denied'});
gtag('js',new Date());gtag('config','${SITE.gaId}');
var s=document.createElement('script');s.async=true;s.src='https://www.googletagmanager.com/gtag/js?id=${SITE.gaId}';document.head.appendChild(s);})();`;

export function ConsentBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem("cj-consent")) return;
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone ?? "";
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (/^(Europe|Atlantic\/(Reykjavik|Canary|Madeira|Azores))\//.test(tz)) setShow(true);
    } catch {
      /* no storage: stay with the denied default */
    }
  }, []);

  function choose(v: "granted" | "denied") {
    try {
      localStorage.setItem("cj-consent", v);
    } catch {}
    (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag?.("consent", "update", { analytics_storage: v });
    setShow(false);
  }

  if (!show) return null;
  return (
    <div role="region" aria-label="Cookie choice" className="fixed inset-x-3 bottom-[88px] z-40 mx-auto max-w-xl rounded-[var(--radius-lg)] border-2 border-ink bg-canvas p-4 shadow-[4px_4px_0_var(--ink)] md:bottom-5">
      <p className="text-[15px]">
        We&apos;d like to use Google Analytics to see which pages help people. No ads, no selling data.{" "}
        <Link href="/privacy" className="link">
          Privacy
        </Link>
      </p>
      <div className="mt-3 flex gap-2">
        <button onClick={() => choose("granted")} className="btn btn-ink">
          Allow analytics
        </button>
        <button onClick={() => choose("denied")} className="btn btn-line">
          No thanks
        </button>
      </div>
    </div>
  );
}
