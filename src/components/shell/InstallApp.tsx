"use client";

import { useState, useSyncExternalStore } from "react";
import { Download, Share, SquarePlus } from "lucide-react";

// Chrome and Edge fire `beforeinstallprompt` once the site qualifies as an app (manifest + icons + service
// worker). We keep the event and show it from our own button. Safari on iPhone has no such event, so there
// we explain Share → Add to Home Screen instead.

type InstallEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: "accepted" | "dismissed" }> };
type State = "installed" | "prompt" | "ios" | "none";

let deferred: InstallEvent | null = null;
let installed = false;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault(); // hide Chrome's own mini-banner; our button does the asking
    deferred = e as InstallEvent;
    emit();
  });
  window.addEventListener("appinstalled", () => {
    deferred = null;
    installed = true;
    emit();
  });
}

function snapshot(): State {
  const standalone = window.matchMedia("(display-mode: standalone)").matches || (navigator as { standalone?: boolean }).standalone === true;
  if (installed || standalone) return "installed";
  if (deferred) return "prompt";
  if (/iphone|ipad|ipod/i.test(navigator.userAgent)) return "ios";
  return "none";
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useInstallState() {
  return useSyncExternalStore(subscribe, snapshot, () => "none" as State);
}

/** "Install the app" for Chrome/Edge, or Add to Home Screen steps on iPhone. Renders nothing otherwise. */
export function InstallApp({ className = "" }: { className?: string }) {
  const state = useInstallState();
  const [steps, setSteps] = useState(false);

  if (state === "prompt") {
    return (
      <button
        onClick={async () => {
          if (!deferred) return;
          await deferred.prompt();
          await deferred.userChoice;
          deferred = null; // each event can only be used once
          emit();
        }}
        className={`inline-flex items-center gap-2 font-semibold hover:underline ${className}`}
      >
        <Download size={16} /> Install the app
      </button>
    );
  }

  if (state === "ios") {
    return (
      <div className={className}>
        <button onClick={() => setSteps(!steps)} aria-expanded={steps} className="inline-flex items-center gap-2 font-semibold hover:underline">
          <SquarePlus size={16} /> Add to Home Screen
        </button>
        {steps && (
          <ol className="mt-2 grid gap-1 text-[14px] text-muted">
            <li className="flex items-center gap-1.5">
              1. Tap <Share size={14} aria-label="Share" className="text-ink" /> Share in Safari&apos;s toolbar
            </li>
            <li>2. Choose &ldquo;Add to Home Screen&rdquo;</li>
            <li>3. Tap Add - Code Journey opens full-screen, like an app</li>
          </ol>
        )}
      </div>
    );
  }

  return null;
}
