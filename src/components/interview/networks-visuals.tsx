"use client";

import { useEffect, useState } from "react";
import { VisualFrame, motionStyles, toggleClass } from "./VisualFrame";

const OSI = [
  { layer: 7, name: "Application", unit: "Data", example: "HTTP, DNS, SMTP", job: "What the program wants to send" },
  { layer: 6, name: "Presentation", unit: "Data", example: "TLS, JSON, encoding", job: "Format, encrypt and compress" },
  { layer: 5, name: "Session", unit: "Data", example: "Sessions, RPC", job: "Open, keep and close a conversation" },
  { layer: 4, name: "Transport", unit: "Segment", example: "TCP, UDP", job: "End-to-end delivery and ports" },
  { layer: 3, name: "Network", unit: "Packet", example: "IP, ICMP", job: "Addresses and routing between networks" },
  { layer: 2, name: "Data link", unit: "Frame", example: "Ethernet, Wi-Fi, ARP", job: "Moves frames between directly connected devices" },
  { layer: 1, name: "Physical", unit: "Bits", example: "Cables, radio signals", job: "Sends raw bits on the medium" },
];

/** The seven OSI layers. Pick one to see its job, its data unit and a real example. */
export function OsiStack() {
  const [active, setActive] = useState(3);
  const item = OSI[active];
  return (
    <VisualFrame title="The OSI layers, top to bottom" hint="Each layer does one job and wraps the data for the layer below. Pick a layer to see what it does.">
      <div className="cj-visual grid gap-6 md:grid-cols-[1fr_1fr]">
        <ol className="grid gap-2">
          {OSI.map((l, i) => (
            <li key={l.name}>
              <button
                type="button"
                aria-pressed={active === i}
                onClick={() => setActive(i)}
                className={`flex w-full items-center justify-between rounded-xl border-2 px-4 py-3 text-left transition-colors ${active === i ? "border-ink bg-ink text-canvas" : "border-line hover:border-ink"}`}
              >
                <span className="font-bold">
                  <span className="font-mono text-sm opacity-70">L{l.layer}</span> {l.name}
                </span>
                <span className="font-mono text-xs opacity-80">{l.unit}</span>
              </button>
            </li>
          ))}
        </ol>
        <div className="rounded-2xl bg-raise p-6">
          <p className="font-mono text-xs tracking-wide text-muted uppercase">Layer {item.layer}</p>
          <p className="mt-2 font-display text-3xl font-bold">{item.name}</p>
          <p className="mt-4 text-lg">{item.job}</p>
          <dl className="mt-6 grid gap-3 text-sm">
            <div>
              <dt className="font-bold">Data unit</dt>
              <dd className="text-muted">{item.unit}</dd>
            </div>
            <div>
              <dt className="font-bold">Real examples</dt>
              <dd className="text-muted">{item.example}</dd>
            </div>
          </dl>
        </div>
      </div>
    </VisualFrame>
  );
}

const HANDSHAKE = [
  { from: "client", text: "SYN", note: "seq = x. Client says: I want to talk, my number starts at x." },
  { from: "server", text: "SYN-ACK", note: "seq = y, ack = x + 1. Server agrees and starts its own number at y." },
  { from: "client", text: "ACK", note: "ack = y + 1. Client confirms. The connection is open, and data can flow." },
];

/** The TCP three-way handshake as a sequence diagram. Step through it, or let it play. */
export function TcpHandshake() {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const done = step >= HANDSHAKE.length;
  const running = playing && !done;

  useEffect(() => {
    if (!running) return;
    const id = window.setTimeout(() => setStep((s) => s + 1), 1200);
    return () => window.clearTimeout(id);
  }, [running, step]);
  return (
    <VisualFrame title="TCP three-way handshake" hint="Three messages agree on starting numbers before any data is sent. Step through to see each one.">
      <style>{motionStyles}</style>
      <div className="cj-visual">
        <div className="flex justify-between font-display text-xl font-bold">
          <span>Client</span>
          <span>Server</span>
        </div>
        <div className="mt-4 grid gap-5">
          {HANDSHAKE.map((m, i) => {
            const shown = i < step;
            const toServer = m.from === "client";
            return (
              <div key={m.text} className="flex flex-col items-center gap-1" style={{ opacity: shown ? 1 : 0.25, transition: "opacity 300ms" }}>
                <span className="font-mono text-sm font-bold">
                  {toServer ? `${m.text} →` : `← ${m.text}`}
                </span>
                <div className="h-0.5 w-full bg-ink" />
              </div>
            );
          })}
        </div>
        <p className="mt-6 min-h-[3rem] rounded-xl bg-raise p-4 text-sm leading-relaxed">
          {step === 0 ? "Press Next to send the first message." : done ? "Connected. Data can now flow both ways." : HANDSHAKE[step - 1].note}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button type="button" onClick={() => { setPlaying(false); setStep(0); }} className="btn btn-line min-h-10 px-4 text-sm">Restart</button>
          <button type="button" disabled={done} onClick={() => setStep((s) => s + 1)} className="btn btn-line min-h-10 px-4 text-sm disabled:opacity-40">Next</button>
          <button type="button" disabled={done} onClick={() => setPlaying((p) => !p)} className={toggleClass(running)}>{running ? "Pause" : "Play"}</button>
        </div>
      </div>
    </VisualFrame>
  );
}

const JOURNEY = [
  { title: "DNS lookup", detail: "Turn example.com into an IP address. Answers come from the cache when possible." },
  { title: "TCP handshake", detail: "SYN, SYN-ACK, ACK to open a reliable connection to that IP and port 443." },
  { title: "TLS handshake", detail: "The server proves who it is with a certificate. Both sides agree on keys for encryption." },
  { title: "HTTP request", detail: "The browser sends GET / with headers, including cookies for the site." },
  { title: "HTTP response", detail: "The server returns a status (200 OK) and the HTML body." },
  { title: "Render", detail: "The browser builds the DOM and CSS tree, then fetches scripts, styles and images." },
];

/** Six steps from typing a URL to a rendered page. Each one can be opened. */
export function UrlJourney() {
  const [active, setActive] = useState(0);
  return (
    <VisualFrame title="What happens when you type a URL" hint="Walk the steps in order. Almost every networking interview question about the web is one of these steps.">
      <div className="cj-visual">
        <ol className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {JOURNEY.map((s, i) => (
            <li key={s.title}>
              <button
                type="button"
                aria-pressed={active === i}
                onClick={() => setActive(i)}
                className={`flex h-full min-h-20 w-full min-w-0 flex-col rounded-xl border-2 p-3 text-left transition-colors ${active === i ? "border-ink bg-ink text-canvas" : "border-line hover:border-ink"}`}
              >
                <span className="font-mono text-xs opacity-75">{i + 1}</span>
                <span className="mt-1 block text-sm leading-snug font-bold break-words">{s.title}</span>
              </button>
            </li>
          ))}
        </ol>
        <p className="mt-6 min-h-[3rem] rounded-xl bg-raise p-5 text-lg leading-relaxed">{JOURNEY[active].detail}</p>
        <div className="mt-4 flex gap-2">
          <button type="button" disabled={active === 0} onClick={() => setActive((a) => a - 1)} className="btn btn-line min-h-10 px-4 text-sm disabled:opacity-40">Back</button>
          <button type="button" disabled={active === JOURNEY.length - 1} onClick={() => setActive((a) => a + 1)} className="btn btn-line min-h-10 px-4 text-sm disabled:opacity-40">Next step</button>
        </div>
      </div>
    </VisualFrame>
  );
}
