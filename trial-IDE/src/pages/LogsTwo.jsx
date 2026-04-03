import { useState, useRef, useEffect, useCallback } from "react";

/* ══════════════════════════════════════════════════════════════
   GLOBAL STYLES
══════════════════════════════════════════════════════════════ */
const GlobalStyles = ({ isDark }) => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,300;0,400;0,500;0,600;1,400&family=Syne:wght@400;500;600;700;800&family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }

    @keyframes cjUp    { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
    @keyframes cjIn    { from{opacity:0} to{opacity:1} }
    @keyframes cjToggle{ from{transform:rotate(-30deg) scale(0.6);opacity:0} to{transform:rotate(0) scale(1);opacity:1} }
    @keyframes cjDotPulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.7;transform:scale(1.2)} }

    ::-webkit-scrollbar { width:4px; height:4px; }
    ::-webkit-scrollbar-track { background:transparent; }
    ::-webkit-scrollbar-thumb { background:${isDark?"#232844":"#d1d5db"}; border-radius:3px; }
    ::selection { background:rgba(124,110,224,0.28); }

    /* mobile tweaks */
    @media (max-width: 640px) {
      .cj-hero-title { font-size: 28px !important; }
      .cj-blog-title { font-size: 24px !important; }
      .cj-blog-intro { font-size: 16px !important; }
      .cj-section-body { font-size: 15.5px !important; }
      .cj-section-head { font-size: 19px !important; }
      .cj-card-title  { font-size: 15px !important; }
      .cj-card-summary { font-size: 13px !important; }
    }
  `}</style>
);

/* ══════════════════════════════════════════════════════════════
   THEME
══════════════════════════════════════════════════════════════ */
const makeTheme = (dark) => {
  const base = dark ? {
    shell:"#07080d", deep:"#0d0f1a", mid:"#111420", surface:"#161927",
    panel:"#1a1e2e", hover:"#1e2335", active:"#252b42",
    card:"#161927", cardHov:"#1c2235",
    t1:"#e8eaf2", t2:"#8892b0", t3:"#5a6488", t4:"#2e3660",
    b1:"rgba(120,130,180,0.08)", b2:"rgba(120,130,180,0.15)", b3:"rgba(120,130,180,0.24)",
    purple:"#7c6ee0", teal:"#5eead4",
    // "changelog" label — clearly visible in dark
    changelogLabel:"#9ba3c2",
  } : {
    shell:"#f3f4f8", deep:"#ffffff", mid:"#f0f1f7", surface:"#ffffff",
    panel:"#f7f8fc", hover:"#eef0f8", active:"#e5e8f5",
    card:"#ffffff", cardHov:"#f5f6fc",
    t1:"#111827", t2:"#4b5680", t3:"#7c87a8", t4:"#c5ccdf",
    b1:"rgba(80,90,150,0.08)", b2:"rgba(80,90,150,0.15)", b3:"rgba(80,90,150,0.24)",
    purple:"#6256d0", teal:"#0d9488",
    changelogLabel:"#6b7a9e",
  };

  const accents = dark ? {
    release:     {main:"#22c55e",soft:"rgba(34,197,94,0.1)",  border:"rgba(34,197,94,0.22)",  glow:"rgba(34,197,94,0.06)"},
    deprecated:  {main:"#f87171",soft:"rgba(248,113,113,0.1)",border:"rgba(248,113,113,0.22)",glow:"rgba(248,113,113,0.06)"},
    improvement: {main:"#60a5fa",soft:"rgba(96,165,250,0.1)", border:"rgba(96,165,250,0.22)", glow:"rgba(96,165,250,0.06)"},
  } : {
    release:     {main:"#16a34a",soft:"rgba(22,163,74,0.09)", border:"rgba(22,163,74,0.22)",  glow:"rgba(22,163,74,0.04)"},
    deprecated:  {main:"#dc2626",soft:"rgba(220,38,38,0.09)", border:"rgba(220,38,38,0.22)",  glow:"rgba(220,38,38,0.04)"},
    improvement: {main:"#1d4ed8",soft:"rgba(29,78,216,0.09)", border:"rgba(29,78,216,0.22)",  glow:"rgba(29,78,216,0.04)"},
  };

  const blogs = dark ? {
    blogRelease:{
      bg:"#061410", border:"rgba(34,197,94,0.18)", accent:"#22c55e",
      accentSoft:"rgba(34,197,94,0.08)",
      heroGrad:"linear-gradient(180deg,rgba(34,197,94,0.1) 0%,transparent 100%)",
      headText:"#d1fae5", bodyText:"#7db89a", mutedText:"#2d6649",
      rulerColor:"rgba(34,197,94,0.14)",
      tagBg:"rgba(34,197,94,0.1)", tagColor:"#22c55e", tagBorder:"rgba(34,197,94,0.22)",
      sidebarBg:"#0a1c16", sidebarBorder:"rgba(34,197,94,0.15)",
      tocActive:"#22c55e", tocActiveBg:"rgba(34,197,94,0.1)",
      clBg:"rgba(34,197,94,0.07)",
    },
    blogDeprecated:{
      bg:"#130708", border:"rgba(248,113,113,0.18)", accent:"#f87171",
      accentSoft:"rgba(248,113,113,0.08)",
      heroGrad:"linear-gradient(180deg,rgba(248,113,113,0.1) 0%,transparent 100%)",
      headText:"#fee2e2", bodyText:"#b08080", mutedText:"#6b3535",
      rulerColor:"rgba(248,113,113,0.14)",
      tagBg:"rgba(248,113,113,0.1)", tagColor:"#f87171", tagBorder:"rgba(248,113,113,0.22)",
      sidebarBg:"#1c0c0c", sidebarBorder:"rgba(248,113,113,0.15)",
      tocActive:"#f87171", tocActiveBg:"rgba(248,113,113,0.1)",
      clBg:"rgba(248,113,113,0.07)",
    },
    blogImprovement:{
      bg:"#050d1a", border:"rgba(96,165,250,0.18)", accent:"#60a5fa",
      accentSoft:"rgba(96,165,250,0.08)",
      heroGrad:"linear-gradient(180deg,rgba(96,165,250,0.1) 0%,transparent 100%)",
      headText:"#dbeafe", bodyText:"#6d96bb", mutedText:"#244f7a",
      rulerColor:"rgba(96,165,250,0.14)",
      tagBg:"rgba(96,165,250,0.1)", tagColor:"#60a5fa", tagBorder:"rgba(96,165,250,0.22)",
      sidebarBg:"#0a1525", sidebarBorder:"rgba(96,165,250,0.15)",
      tocActive:"#60a5fa", tocActiveBg:"rgba(96,165,250,0.1)",
      clBg:"rgba(96,165,250,0.07)",
    },
  } : {
    blogRelease:{
      bg:"#f0fdf4", border:"#bbf7d0", accent:"#16a34a",
      accentSoft:"rgba(22,163,74,0.07)",
      heroGrad:"linear-gradient(180deg,#dcfce7 0%,#f0fdf4 100%)",
      headText:"#14532d", bodyText:"#1e5c38", mutedText:"#4b7a58",
      rulerColor:"#bbf7d0",
      tagBg:"rgba(22,163,74,0.09)", tagColor:"#15803d", tagBorder:"#86efac",
      sidebarBg:"#ecfdf5", sidebarBorder:"#bbf7d0",
      tocActive:"#16a34a", tocActiveBg:"rgba(22,163,74,0.09)",
      clBg:"rgba(22,163,74,0.07)",
    },
    blogDeprecated:{
      bg:"#fff1f2", border:"#fecaca", accent:"#dc2626",
      accentSoft:"rgba(220,38,38,0.07)",
      heroGrad:"linear-gradient(180deg,#fee2e2 0%,#fff1f2 100%)",
      headText:"#450a0a", bodyText:"#7f1d1d", mutedText:"#7a4040",
      rulerColor:"#fecaca",
      tagBg:"rgba(220,38,38,0.08)", tagColor:"#b91c1c", tagBorder:"#fca5a5",
      sidebarBg:"#fff5f5", sidebarBorder:"#fecaca",
      tocActive:"#dc2626", tocActiveBg:"rgba(220,38,38,0.08)",
      clBg:"rgba(220,38,38,0.07)",
    },
    blogImprovement:{
      bg:"#eff6ff", border:"#bfdbfe", accent:"#1d4ed8",
      accentSoft:"rgba(29,78,216,0.07)",
      heroGrad:"linear-gradient(180deg,#dbeafe 0%,#eff6ff 100%)",
      headText:"#0c1b4d", bodyText:"#1e3a5f", mutedText:"#3a5280",
      rulerColor:"#bfdbfe",
      tagBg:"rgba(29,78,216,0.08)", tagColor:"#1d4ed8", tagBorder:"#93c5fd",
      sidebarBg:"#eff6ff", sidebarBorder:"#bfdbfe",
      tocActive:"#1d4ed8", tocActiveBg:"rgba(29,78,216,0.08)",
      clBg:"rgba(29,78,216,0.07)",
    },
  };

  return { ...base, ...accents, ...blogs };
};

const blogKey = (t) => `blog${t[0].toUpperCase()}${t.slice(1)}`;

/* ══════════════════════════════════════════════════════════════
   CHANGELOG PALETTES
══════════════════════════════════════════════════════════════ */
const CL_LIGHT = {
  Added:      {bg:"#f0fdf4",color:"#15803d",border:"#86efac"},
  Improved:   {bg:"#eff6ff",color:"#1d4ed8",border:"#93c5fd"},
  Fixed:      {bg:"#fff7ed",color:"#c2410c",border:"#fed7aa"},
  Deprecated: {bg:"#fff1f2",color:"#b91c1c",border:"#fca5a5"},
  Removed:    {bg:"#f8fafc",color:"#475569",border:"#cbd5e1"},
  Replacement:{bg:"#f5f3ff",color:"#6d28d9",border:"#c4b5fd"},
  Migrated:   {bg:"#ecfdf5",color:"#065f46",border:"#6ee7b7"},
  Technique:  {bg:"#f0f9ff",color:"#075985",border:"#7dd3fc"},
};
const CL_DARK = {
  Added:      {bg:"rgba(34,197,94,0.09)",   color:"#4ade80",border:"rgba(34,197,94,0.22)"  },
  Improved:   {bg:"rgba(96,165,250,0.09)",  color:"#60a5fa",border:"rgba(96,165,250,0.22)" },
  Fixed:      {bg:"rgba(251,146,60,0.09)",  color:"#fb923c",border:"rgba(251,146,60,0.22)" },
  Deprecated: {bg:"rgba(248,113,113,0.09)", color:"#f87171",border:"rgba(248,113,113,0.22)"},
  Removed:    {bg:"rgba(148,163,184,0.09)", color:"#94a3b8",border:"rgba(148,163,184,0.22)"},
  Replacement:{bg:"rgba(167,139,250,0.09)", color:"#a78bfa",border:"rgba(167,139,250,0.22)"},
  Migrated:   {bg:"rgba(52,211,153,0.09)",  color:"#34d399",border:"rgba(52,211,153,0.22)" },
  Technique:  {bg:"rgba(56,189,248,0.09)",  color:"#38bdf8",border:"rgba(56,189,248,0.22)" },
};

/* ══════════════════════════════════════════════════════════════
   DATA
══════════════════════════════════════════════════════════════ */
const LOGS = [
  {
    id:"r-001",type:"release",version:"v2.4.0",
    title:"Multi-Language Code Runner",
    date:"2026-03-28",
    summary:"Execute Python, JavaScript, TypeScript, R and SQL directly inside Code Journey with real-time output streaming and fully sandboxed WebAssembly execution — no local setup required.",
    tags:["code-runner","sandbox","wasm"],
    readTime:"5 min",
    content:{
      headline:"Run Code Natively — No Setup Required",
      intro:"Today we're shipping the feature our community has asked for since day one: a fully sandboxed, multi-language code runner built directly into Code Journey. No local installs. No environment configuration. No tab-switching to a separate playground. Write your solution, press Run, see output — all inside the same IDE you've been practising in.",
      sections:[
        {id:"s-r1-1",heading:"Nine Languages, One Runtime",body:"The Code Journey runtime supports JavaScript, TypeScript, Python 3.12, R 4.3, SQL (PostgreSQL dialect), Dart, Kotlin, Rust 1.77 and an HTML/CSS live preview — all at launch. Every language runs in an isolated WebAssembly container spun up fresh per execution, meaning your session is hermetically sealed from every other user's. There is no shared state, no residual files, and no way for one run to pollute the next. The container lifecycle — creation, warm-up, execution, teardown — happens in under 200ms for all supported languages."},
        {id:"s-r1-2",heading:"Real-Time Output Streaming",body:"We moved away from the batch-at-the-end model that most in-browser runners use. The new streaming engine pipes stdout and stderr line-by-line into the terminal panel as they are emitted — so long-running scripts feel responsive even before they complete. Stdout renders in white, stderr in amber, and unhandled exceptions in red with a clickable stack trace. The terminal supports ANSI colour sequences, so libraries that emit coloured output work exactly as they do in a local terminal."},
        {id:"s-r1-3",heading:"Sandbox Limits and Safety",body:"Every execution is governed by a hard 30-second CPU wall-clock limit, a 128 MB memory ceiling, and zero outbound network access. When a script hits any of these limits the runner terminates the container cleanly and reports exactly which limit was breached and at which line. The sandbox also disables filesystem writes outside a small ephemeral scratch space that is wiped after each run — keeping the environment reproducible and ensuring exercise outputs are always the result of the submitted code alone."},
        {id:"s-r1-4",heading:"What's Coming Next",body:"We're already building the next layer: persistent REPL sessions that survive page refreshes, selective package imports for Python via pip and Node via npm with an allowlist, and a live co-running mode where you and a mentor share a terminal in real time. We'll ship these incrementally over the next two releases."},
      ],
      changelog:[
        {label:"Added",  items:["WebAssembly sandboxed execution engine","Streaming stdout/stderr in terminal panel","Per-language CPU timeout and memory limits","Run shortcut (Ctrl/Cmd + Enter)","Execution history with replay (last 10 runs)"]},
        {label:"Fixed",  items:["Terminal scroll-lock on rapid output","Tab focus lost after code execution","Line numbers desync on long outputs"]},
      ]
    }
  },
  {
    id:"r-002",type:"release",version:"v2.3.0",
    title:"AI Tutor Integration",
    date:"2026-03-14",
    summary:"Ask questions, get progressive hints and request code reviews from an AI tutor that already understands your current exercise, open file and test results — without leaving the IDE.",
    tags:["ai","tutor","hints"],
    readTime:"4 min",
    content:{
      headline:"Your Personal AI Tutor — Context-Aware and Always On",
      intro:"Most AI coding assistants make you do the work of explaining your situation: paste in your code, describe the problem, re-state the exercise goal. With the Code Journey AI Tutor none of that is necessary. The tutor silently reads your context before you type a single character.",
      sections:[
        {id:"s-r2-1",heading:"Context Injection Without Copy-Pasting",body:"When you open the Tutor panel it already holds your current file contents, the full exercise description, which test cases are passing and which are failing, and your last three terminal outputs. When you ask 'why is my function returning undefined?' it doesn't need you to paste the function — it already sees it. This single change eliminates the biggest source of friction in asking for help: re-establishing context from scratch every time you switch tools."},
        {id:"s-r2-2",heading:"The Hint Ladder",body:"Rather than serving the answer immediately, the Tutor follows a three-rung Socratic ladder. Rung one is a conceptual nudge — it confirms whether you understand the underlying pattern being tested. Rung two is a structural hint — it shows the shape of a solution without writing the code. Rung three is a partial implementation — it fills in the hard part and leaves the mechanical work to you. Solving from rung one earns full XP; each rung down reduces your award by 25 percent."},
        {id:"s-r2-3",heading:"Code Review Mode",body:"Once you've passed all test cases a Review button appears in the Tutor panel. Activate it and the AI performs a structured three-axis review: correctness, readability, and idiomatic style — with findings rendered as inline annotations directly in the editor. Clicking any annotation expands a detailed explanation with before-and-after examples."},
      ],
      changelog:[
        {label:"Added",   items:["AI Tutor side panel with automatic context injection","Three-rung hint ladder with XP adjustment","Code review mode with inline editor annotations","Keyboard shortcut (Ctrl/Cmd + Shift + A)"]},
        {label:"Improved",items:["Exercise hint fallback now powered by AI","First-response latency < 800ms (p50)","Tutor retains conversation history within a session"]},
      ]
    }
  },
  {
    id:"r-003",type:"release",version:"v2.2.0",
    title:"Streak & XP Gamification",
    date:"2026-02-27",
    summary:"Daily coding streaks, XP points, five-tier level progression and weekly leaderboards — a system designed to reward the habit of showing up, not binge-learning sessions.",
    tags:["gamification","streaks","xp"],
    readTime:"3 min",
    content:{
      headline:"Level Up Your Learning — Every Single Day",
      intro:"Motivation research consistently shows that the hardest part of learning to code isn't any individual concept — it's showing up repeatedly over weeks and months. The Code Journey gamification system is built around that insight: reward the habit, not just the outcome.",
      sections:[
        {id:"s-r3-1",heading:"Daily Streaks and Shields",body:"Complete at least one exercise per day and your streak counter increments. Miss a day and it resets — unless you have a Streak Shield. Shields are earned by completing weekly challenge sets and can absorb a single missed day. At 7, 30 and 100 consecutive days, streaks unlock exclusive IDE colour themes that can't be obtained any other way."},
        {id:"s-r3-2",heading:"XP and the Level Ladder",body:"Every exercise completion awards XP scaled by three factors: the exercise's base difficulty (1× to 4×), how many hint rungs you used, and how quickly you solved it relative to the median solve time. Accumulated XP moves you through five tiers — Novice, Apprentice, Practitioner, Expert, and Master — each unlocking additional language tracks and challenge modes."},
        {id:"s-r3-3",heading:"Weekly Leaderboards",body:"Leaderboards reset every Monday at 00:00 UTC. View global rankings or filter to your cohort, language track, or country. The top three XP earners each week receive a timestamped Leaderboard Badge on their public profile — a record that accurately reflects the competitive field of that specific week."},
      ],
      changelog:[
        {label:"Added",items:["Daily streak tracking with Streak Shield inventory","XP calculation engine (difficulty × hints × speed)","Five-tier level progression with IDE theme unlocks","Weekly global, cohort, track and country leaderboards","Public profile XP history sparkline chart"]},
      ]
    }
  },
  {
    id:"d-001",type:"deprecated",version:"v2.4.0",status:"sunset-90d",
    title:"Legacy Monaco Editor Config API",
    date:"2026-03-28",
    summary:"The window.__CJ_MONACO_CONFIG global object is deprecated. Migrate to CJEditor.configure() before June 30 2026 to avoid undefined editor behaviour.",
    tags:["editor","api","breaking"],
    readTime:"6 min",
    content:{
      headline:"Legacy Monaco Config API — Deprecated in v2.4.0",
      intro:"The window.__CJ_MONACO_CONFIG global configuration object was introduced in v1.0 as a pragmatic shortcut for early integrators. It worked well enough at the time, but it accumulated years of technical debt: no validation layer, race-condition-prone initialisation timing, and an inability to handle dynamic per-file overrides.",
      sections:[
        {id:"s-d1-1",heading:"Why We're Replacing It",body:"The fundamental issue is timing. The editor reads __CJ_MONACO_CONFIG exactly once during mount. Any script that sets the object after mount — code loaded via async import(), behind a feature flag, or deferred for performance — is silently ignored. This caused a class of bugs that were extremely difficult to diagnose because the editor appeared to initialise correctly, but with default settings rather than the intended ones. CJEditor.configure() is idempotent and can be called at any point in the page lifecycle."},
        {id:"s-d1-2",heading:"The Migration Path",body:"The replacement API is a direct key-for-key translation. Replace window.__CJ_MONACO_CONFIG = { theme: 'dark', fontSize: 14 } with CJEditor.configure({ theme: 'dark', fontSize: 14 }). The method accepts the same option keys. To read the current configuration, use CJEditor.getConfig() which returns a frozen snapshot. To react to configuration changes, listen for the cj:editor-config-updated CustomEvent on the document object."},
        {id:"s-d1-3",heading:"Sunset Timeline",body:"v2.4.0 (March 28): The global object is still read but a deprecation warning is emitted to the console on every page load that sets it. v2.5.0 (May 2026): The console warning becomes a visible in-app banner. v2.6.0 (July 2026): The global object is no longer read. Any code that still sets it will have no effect and its behaviour is explicitly undefined from that version forward."},
      ],
      changelog:[
        {label:"Deprecated",items:["window.__CJ_MONACO_CONFIG global object (read until v2.6.0)","__CJ_MONACO_CONFIG.theme","__CJ_MONACO_CONFIG.fontSize","__CJ_MONACO_CONFIG.tabSize"]},
        {label:"Replacement",items:["CJEditor.configure(options) — full lifecycle-safe options API","CJEditor.getConfig() — returns frozen snapshot of current config","'cj:editor-config-updated' CustomEvent for reactive config listening"]},
      ]
    }
  },
  {
    id:"d-002",type:"deprecated",version:"v2.3.0",status:"sunset-60d",
    title:"V1 Exercise Completion Webhook",
    date:"2026-03-14",
    summary:"The /api/v1/webhooks/exercise-complete endpoint is deprecated. Switch to the v2 Event Stream API before May 14 2026 for structured payloads, HMAC signing and automatic retries.",
    tags:["webhooks","api","v1"],
    readTime:"5 min",
    content:{
      headline:"V1 Webhook Endpoint Deprecated — Migrate to Event Streams",
      intro:"The v1 webhook was built when Code Journey had a single event type, a single payload shape, and no retry infrastructure. That's no longer true. The new Event Stream API is the foundation our entire event delivery system is built on — it powers the AI Tutor context updates, leaderboard live feeds, and mobile push notifications.",
      sections:[
        {id:"s-d2-1",heading:"What Changes in the Payload",body:"The v1 endpoint sent a flat JSON object: { userId, exerciseId, completedAt, passed }. The v2 EventEnvelope wraps that data in a structured container with a schema version field, an idempotency key, a delivery timestamp distinct from the event timestamp, and an HMAC-SHA256 signature in the X-CJ-Signature header for cryptographic verification of delivery authenticity."},
        {id:"s-d2-2",heading:"How to Migrate",body:"Open your Code Journey dashboard and navigate to Integrations → Event Streams. Create a new stream, select the exercise.completed event type, and enter your endpoint URL. Copy the signing secret and store it securely — you'll use it to verify the X-CJ-Signature header. In your handler, verify the signature before processing, then use the idempotency key to deduplicate retried deliveries. Deregister your v1 webhook before May 14."},
        {id:"s-d2-3",heading:"Testing and Debugging",body:"The Event Streams dashboard includes an inline delivery inspector. Hit Send Test Event to fire a synthetic exercise.completed event to your endpoint and see the full request headers, body, and your endpoint's response — all in one view. Failed deliveries are automatically retried up to five times with exponential back-off. You can replay any delivery manually from the inspector for up to 30 days."},
      ],
      changelog:[
        {label:"Deprecated",items:["POST /api/v1/webhooks/exercise-complete (removed May 14 2026)","Flat payload format: { userId, exerciseId, completedAt, passed }"]},
        {label:"Replacement",items:["Event Stream: exercise.completed event type","EventEnvelope with schema versioning and idempotency key","HMAC-SHA256 signed delivery via X-CJ-Signature","Automatic retry: 5 attempts with exponential back-off","30-day delivery replay from dashboard inspector"]},
      ]
    }
  },
  {
    id:"d-003",type:"deprecated",version:"v2.2.0",status:"removed",
    title:"Flash-Based Code Playground (Removed)",
    date:"2026-02-27",
    summary:"The legacy Flash playground from 2019 has been fully removed. All user progress and saved snippets were automatically migrated to the WebAssembly runner.",
    tags:["flash","legacy","removed"],
    readTime:"2 min",
    content:{
      headline:"Flash Playground Fully Removed in v2.2.0",
      intro:"Some features outlive their welcome. The Flash-based code playground that shipped with the Code Journey beta in 2019 handled over two million exercise runs before browser vendors began disabling Flash support in 2020. As of v2.2.0, that chapter is closed.",
      sections:[
        {id:"s-d3-1",heading:"A Brief History",body:"The Flash playground was the quickest path to in-browser code execution available in 2019. It ran a stripped-down JavaScript interpreter wrapped in a SWF file and loaded via the Ruffle polyfill after Adobe's end-of-life announcement. It never supported more than three languages, had no sandboxing guarantees, and relied on a localStorage adapter that accumulated user data in the browser — making data portability essentially impossible without manual export."},
        {id:"s-d3-2",heading:"Automatic Data Migration",body:"All user progress, completion records and saved code snippets stored by the Flash localStorage adapter were migrated to our central data store in December 2025 as part of a background migration job. No action was required from any user. The migration covered 98.7% of records automatically; the remaining 1.3% were manually recovered by our data team and verified against exercise completion timestamps."},
        {id:"s-d3-3",heading:"What You Get Instead",body:"The WebAssembly runner is four times faster on cold start, supports nine languages versus the Flash runner's three, requires no browser plugin, works on iOS and Android, runs in a true process-level sandbox with enforceable memory and CPU limits, and produces streaming output instead of batching results at the end."},
      ],
      changelog:[
        {label:"Removed", items:["Flash (SWF) code playground runtime and Ruffle polyfill","Flash-specific localStorage adapter","__CJ_FLASH_COMPAT polyfill shim"]},
        {label:"Migrated",items:["All user progress → central data store (100% complete)","Saved code snippets → Snippets API v2","Completion timestamps → normalised event log"]},
      ]
    }
  },
  {
    id:"i-001",type:"improvement",version:"v2.4.0",
    title:"Editor Startup Time — 3× Faster",
    date:"2026-03-28",
    summary:"Cold boot time dropped from 2.8s to 0.9s through lazy chunk splitting, background WASM pre-compilation in a Web Worker, and aggressive unicode-range font subsetting.",
    tags:["performance","startup","wasm"],
    readTime:"4 min",
    content:{
      headline:"The Editor Boots 3× Faster — Here's Exactly How We Did It",
      intro:"In our March performance audit we instrumented every millisecond of the editor's cold boot path on a simulated 10 Mbps connection. The number we found — 2.8 seconds from navigation to interactive — was unacceptable. This entry is a detailed account of the three specific changes that brought it to 0.9 seconds.",
      sections:[
        {id:"s-i1-1",heading:"Lazy Chunk Splitting",body:"The editor's entire JavaScript surface was shipped as a single 1.4 MB bundle. We restructured the build using Rollup's dynamic import() boundaries to produce twelve chunks. The critical-path chunk — the editor shell, tab bar and status bar — weighs 180 KB and loads first. Language syntax grammars load only when that language's tab is opened. Heavy features — the minimap, git diff view, AI tutor panel — are deferred until after the editor reports itself as interactive. Total JS parse time dropped from 380ms to 110ms."},
        {id:"s-i1-2",heading:"WASM Pre-Warming in a Background Worker",body:"The WebAssembly execution engine previously compiled on the first press of the Run button. On a mid-range laptop that compilation takes 600–900ms — a full-second freeze at exactly the moment the user is most engaged. We now schedule a background Web Worker to pre-compile the WASM module three seconds after the editor becomes visible, using requestIdleCallback as the scheduling mechanism. By the time a user finishes reading and writing their first attempt, the engine is compiled and waiting. First-run response time dropped from ~900ms to ~45ms."},
        {id:"s-i1-3",heading:"Font Subsetting",body:"JetBrains Mono was loaded in four weights across normal and italic variants, totalling 680 KB of font payload. An audit of every character actually rendered in the editor produced a Unicode range covering 487 of the typeface's 1,200+ glyphs. We generated a subset font using pyftsubset and reduced the payload to 94 KB — an 86% reduction. The visual result is completely indistinguishable because the characters that appear in real code are precisely the ones we kept."},
      ],
      changelog:[
        {label:"Improved",items:["Cold boot: 2.8s → 0.9s (p75, 10 Mbps)","First Run response: ~900ms → ~45ms","JS parse time: 380ms → 110ms","Font payload: 680 KB → 94 KB (86% reduction)","LCP: 1.9s → 0.7s"]},
        {label:"Technique",items:["12-chunk Rollup build with dynamic import()","WASM pre-compilation via Web Worker + requestIdleCallback","Unicode-range font subsetting with pyftsubset","Icon tree-shaking: removed 2,100 unused Lucide icons"]},
      ]
    }
  },
  {
    id:"i-002",type:"improvement",version:"v2.3.0",
    title:"Syntax Highlighting Overhaul",
    date:"2026-03-14",
    summary:"Rebuilt the tokeniser from 800 lines of regex to a TextMate grammar engine. 23 new token scopes across 9 languages — TypeScript generics, SQL CTEs, Rust lifetimes all highlight correctly.",
    tags:["editor","syntax","tokeniser"],
    readTime:"5 min",
    content:{
      headline:"Syntax Highlighting — Rebuilt From the Ground Up",
      intro:"Our original tokeniser was 800 lines of carefully ordered regular expressions. It worked well for simple cases, but regular expressions cannot model recursive or context-dependent syntax — and every interesting language has plenty of both. TypeScript generics, SQL CTEs, and Rust lifetime annotations all produced incorrect or missing highlighting. We replaced the entire system.",
      sections:[
        {id:"s-i2-1",heading:"Switching to a Grammar Engine",body:"We replaced the regex file with a TextMate grammar engine — the same approach used by VS Code, Zed and Helix. Each language now has a .tmLanguage.json file that describes its full syntax as a hierarchy of named scopes. The engine processes source code as a stateful tokeniser: it tracks open constructs — function bodies, generic parameters, string templates — and applies the correct scope at every character position, even across multiple lines."},
        {id:"s-i2-2",heading:"23 New Token Scopes",body:"The new engine exposes scopes the regex approach simply could not reach: TypeScript generic type constraints (where T extends), decorator expressions, template literal interpolations, SQL WITH clauses and window function OVER partitions, Rust lifetime parameters ('a), Rust borrow operators (&, &mut), Dart null-safety operators (?., ??, !), Kotlin coroutine keywords (suspend, emit, collect), and R's formula operator (~). All existing themes were updated to cover every new scope."},
        {id:"s-i2-3",heading:"Theme Compatibility and Fallback",body:"Third-party themes that don't define a new scope fall back gracefully to the nearest parent scope's colour — so a theme without a TypeScript generic constraint scope renders it in the colour assigned to generic type parameters, which is almost always correct. Custom theme authors can opt into new scopes by adding scope names to their theme's token colour rules; the grammar engine picks them up automatically."},
      ],
      changelog:[
        {label:"Improved",items:["Tokeniser: 800-line regex → TextMate grammar engine","23 new token scopes across 9 languages","TypeScript: generics, decorators, template literals","SQL: CTEs, subqueries, window functions","Rust: lifetimes, borrow operators","Kotlin: coroutine keywords and Flow operators","R: formula (~) and pipe operators (|> %>%)"]},
        {label:"Fixed",   items:["TS generic constraints coloured as comparison operators","SQL keywords highlighted inside string literals","R formula ~ treated as unknown token","Rust lifetimes silently stripped by tokeniser"]},
      ]
    }
  },
  {
    id:"i-003",type:"improvement",version:"v2.2.0",
    title:"Mobile Keyboard & Touch Input",
    date:"2026-02-27",
    summary:"dvh-based layout keeps the editor visible when the soft keyboard opens. New floating quick-access toolbar puts brackets, indentation and snippet insertion one tap away.",
    tags:["mobile","ux","touch"],
    readTime:"3 min",
    content:{
      headline:"Code on the Go — Mobile Input Redesigned",
      intro:"Mobile was designed last in the original editor, and it showed: the soft keyboard would collapse the editor viewport, the cursor would jump unpredictably when the keyboard appeared, and there was no way to type common coding characters without hunting through multiple keyboard layers. All of that is fixed.",
      sections:[
        {id:"s-i3-1",heading:"Viewport Stability with dvh",body:"The root cause of the collapsing viewport was our use of 100vh. On mobile, browsers report 100vh as the viewport height with the soft keyboard hidden. When the keyboard slides up, the editor layout overflows beyond the visible area and the browser clips it. Switching to 100dvh — dynamic viewport height — tells the browser to recalculate the measurement whenever keyboard state changes. The editor, tab bar and status bar now always fit within the visible area regardless of keyboard state."},
        {id:"s-i3-2",heading:"The Quick-Access Toolbar",body:"On mobile software keyboards, typing characters like {, [, (, ; and = requires navigating to a secondary or tertiary symbol layer — constant friction that interrupts flow. We added a fixed toolbar that floats just above the soft keyboard on touch devices. It provides single-tap access to the ten most frequently used coding characters, a Tab button that inserts the correct number of spaces, a Shift-Tab for dedentation, and a Snippets button that inserts your three most recently used templates at the cursor position."},
        {id:"s-i3-3",heading:"Precise Cursor Placement",body:"Touch targets in a code editor are inherently small — monospace characters at 13px are roughly 8px wide, far below the 44px minimum touch target. Touch-and-hold on any token activates a magnified cursor loupe for sub-character precision. Double-tapping a token selects the full token. Triple-tapping selects the entire line including its indentation. These interactions compose correctly with scrolling and pinch-to-zoom without interference."},
      ],
      changelog:[
        {label:"Improved",items:["Editor height: 100vh → 100dvh (stable with soft keyboard)","Floating quick-access toolbar above keyboard","Touch-and-hold magnified cursor loupe","Double-tap token select / triple-tap line select","Snippets button inserts 3 most-recent templates"]},
        {label:"Fixed",   items:["Cursor jumps to line 1 when soft keyboard opens (iOS 16+)","Viewport collapses on Android Chrome 114+","Tab key inserts literal \\t on mobile","Pinch-to-zoom triggers accidental text selection"]},
      ]
    }
  },
];

/* ══════════════════════════════════════════════════════════════
   HELPERS
══════════════════════════════════════════════════════════════ */
const fmt = (s) => new Date(s).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"});
const rel = (s) => {
  const d=Math.floor((Date.now()-new Date(s))/86400000);
  if(d===0)return"Today"; if(d===1)return"Yesterday";
  if(d<7)return`${d}d ago`; if(d<30)return`${Math.floor(d/7)}w ago`;
  return`${Math.floor(d/30)}mo ago`;
};
const TYPE_CFG={
  release:     {label:"Release",    icon:"🚀"},
  deprecated:  {label:"Deprecated", icon:"⚠️"},
  improvement: {label:"Improvement",icon:"⚡"},
};
const STATUS_META={
  "sunset-90d":{label:"Sunset · 90d",color:"#f97316",bg:"rgba(249,115,22,0.1)",border:"rgba(249,115,22,0.24)"},
  "sunset-60d":{label:"Sunset · 60d",color:"#ef4444",bg:"rgba(239,68,68,0.1)", border:"rgba(239,68,68,0.24)" },
  "removed":   {label:"Removed",     color:"#94a3b8",bg:"rgba(148,163,184,0.1)",border:"rgba(148,163,184,0.22)"},
};

/* ══════════════════════════════════════════════════════════════
   ATOMS
══════════════════════════════════════════════════════════════ */
const TypeBadge=({type,T,small})=>{
  const ac=T[type];const cfg=TYPE_CFG[type];
  return <span style={{display:"inline-flex",alignItems:"center",gap:4,padding:small?"2px 8px":"3px 10px",borderRadius:100,fontSize:small?9.5:10.5,fontWeight:700,letterSpacing:"0.6px",textTransform:"uppercase",background:ac.soft,color:ac.main,border:`1px solid ${ac.border}`,fontFamily:"'Syne',sans-serif",flexShrink:0,whiteSpace:"nowrap"}}>{cfg.icon} {cfg.label}</span>;
};

const StatusBadge=({status})=>{
  if(!status)return null;
  const s=STATUS_META[status];
  return <span style={{display:"inline-flex",alignItems:"center",padding:"2px 8px",borderRadius:4,fontSize:9.5,fontWeight:700,letterSpacing:"0.5px",background:s.bg,color:s.color,border:`1px solid ${s.border}`,fontFamily:"'JetBrains Mono',monospace",whiteSpace:"nowrap"}}>{s.label}</span>;
};

/* ══════════════════════════════════════════════════════════════
   THEME TOGGLE  (text only: "Light" / "Dark" with circle icon)
══════════════════════════════════════════════════════════════ */
const ThemeToggle=({isDark,toggle,T})=>{
  const [hov,setHov]=useState(false);
  return(
    <button onClick={toggle} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{display:"flex",alignItems:"center",gap:6,padding:"5px 12px",borderRadius:8,border:`1px solid ${T.b2}`,background:hov?T.hover:T.panel,cursor:"pointer",transition:"all 0.18s",flexShrink:0,fontFamily:"'Syne',sans-serif"}}>
      {/* Half-circle icon */}
      <span key={isDark?"dark":"light"} style={{display:"flex",alignItems:"center",animation:"cjToggle 0.22s ease both"}}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          {isDark
            ? <><circle cx="8" cy="8" r="3.5" fill={T.t1}/>{[0,45,90,135,180,225,270,315].map((a,i)=><line key={i} x1={8+Math.cos(a*Math.PI/180)*5.5} y1={8+Math.sin(a*Math.PI/180)*5.5} x2={8+Math.cos(a*Math.PI/180)*7} y2={8+Math.sin(a*Math.PI/180)*7} stroke={T.t1} strokeWidth="1.5" strokeLinecap="round"/>)}</>
            : <><circle cx="8" cy="8" r="7" stroke={T.t2} strokeWidth="1.5"/><path d="M8 1 A7 7 0 0 1 8 15 A4 4 0 0 1 8 1Z" fill={T.t2}/></>
          }
        </svg>
      </span>
      <span style={{fontSize:12,fontWeight:600,color:T.t2,letterSpacing:"0.3px"}}>{isDark?"Light":"Dark"}</span>
    </button>
  );
};

/* ══════════════════════════════════════════════════════════════
   SECTION TABS — replaces full navbar, sits below any parent nav
══════════════════════════════════════════════════════════════ */
const SectionTabs=({page,setPage,setFilter,isDark,toggleTheme,T})=>{
  const [hov,setHov]=useState(null);
  const tabs=[
    {key:"home",       label:"All Logs",    filter:"all"},
    {key:"releases",   label:"Releases",    filter:"release",     acc:T.release.main},
    {key:"deprecated", label:"Deprecated",  filter:"deprecated",  acc:T.deprecated.main},
    {key:"improvements",label:"Improvements",filter:"improvement",acc:T.improvement.main},
  ];
  return(
    <div style={{background:T.deep,borderBottom:`1px solid ${T.b1}`,padding:"0 16px"}}>
      <div style={{maxWidth:1000,margin:"0 auto",display:"flex",alignItems:"center",flexWrap:"wrap",gap:2,minHeight:44}}>
        {/* Tab pills */}
        <div style={{display:"flex",alignItems:"center",gap:2,flex:1,flexWrap:"wrap",paddingTop:4,paddingBottom:4}}>
          {tabs.map(tab=>{
            const isActive=page===tab.key;
            const acc=tab.acc||T.purple;
            return(
              <button key={tab.key}
                onClick={()=>{setPage(tab.key);setFilter(tab.filter);}}
                onMouseEnter={()=>setHov(tab.key)} onMouseLeave={()=>setHov(null)}
                style={{padding:"5px 13px",borderRadius:6,fontSize:12.5,fontWeight:600,cursor:"pointer",border:"none",background:isActive?`${acc}18`:hov===tab.key?T.hover:"transparent",color:isActive?acc:hov===tab.key?T.t1:T.t2,fontFamily:"'Syne',sans-serif",transition:"all 0.13s",letterSpacing:"0.1px",display:"flex",alignItems:"center",gap:5}}>
                {tab.key!=="home"&&<span style={{width:5,height:5,borderRadius:"50%",background:isActive?acc:T.t4,transition:"background 0.13s",flexShrink:0}}/>}
                {tab.label}
              </button>
            );
          })}
        </div>
        {/* Right: count + toggle */}
        <div style={{display:"flex",alignItems:"center",gap:8,paddingLeft:8}}>
          <span style={{fontSize:10.5,color:T.t3,fontFamily:"'JetBrains Mono',monospace",padding:"3px 8px",background:T.panel,borderRadius:5,border:`1px solid ${T.b1}`,whiteSpace:"nowrap"}}>{LOGS.length} entries</span>
          <ThemeToggle isDark={isDark} toggle={toggleTheme} T={T}/>
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════
   LOG CARD
══════════════════════════════════════════════════════════════ */
const LogCard=({log,onClick,index,T})=>{
  const [hov,setHov]=useState(false);
  const ac=T[log.type];
  return(
    <div onClick={()=>onClick(log)} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{background:hov?T.cardHov:T.card,border:`1px solid ${hov?ac.border:T.b1}`,borderRadius:12,padding:"18px 20px",cursor:"pointer",transition:"all 0.16s cubic-bezier(0.4,0,0.2,1)",position:"relative",overflow:"hidden",animation:`cjUp 0.35s ease ${index*45}ms both`,boxShadow:hov?`0 0 0 1px ${ac.border},0 4px 24px ${ac.glow}`:"none"}}>
      <div style={{position:"absolute",left:0,top:0,bottom:0,width:3,background:hov?ac.main:"transparent",borderRadius:"12px 0 0 12px",transition:"background 0.16s"}}/>
      <div style={{paddingLeft:6}}>
        {/* Badges row */}
        <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:9,flexWrap:"wrap"}}>
          <TypeBadge type={log.type} T={T} small/>
          {log.status&&<StatusBadge status={log.status}/>}
          <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10.5,fontWeight:600,color:ac.main,background:ac.soft,border:`1px solid ${ac.border}`,padding:"2px 7px",borderRadius:4}}>{log.version}</span>
          <span style={{fontSize:10.5,color:T.t3,fontFamily:"'JetBrains Mono',monospace",marginLeft:"auto",whiteSpace:"nowrap"}}>{rel(log.date)}</span>
        </div>
        {/* Title */}
        <div className="cj-card-title" style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:16.5,color:T.t1,marginBottom:7,lineHeight:1.3,letterSpacing:"-0.15px"}}>{log.title}</div>
        {/* Summary */}
        <div className="cj-card-summary" style={{fontFamily:"'Lora',serif",fontSize:13.5,color:T.t2,lineHeight:1.72,marginBottom:12}}>{log.summary}</div>
        {/* Footer: date · read time · tags */}
        <div style={{display:"flex",alignItems:"center",gap:7,flexWrap:"wrap"}}>
          <span style={{fontSize:11,color:T.t3,fontFamily:"'JetBrains Mono',monospace"}}>{fmt(log.date)}</span>
          <span style={{color:T.t4,fontSize:10}}>·</span>
          <span style={{fontSize:11,color:T.t3}}>{log.readTime} read</span>
          <div style={{marginLeft:"auto",display:"flex",gap:4,flexWrap:"wrap"}}>
            {log.tags.slice(0,3).map(t=><span key={t} style={{padding:"2px 7px",borderRadius:4,fontSize:9.5,fontWeight:500,background:T.active,color:T.t3,border:`1px solid ${T.b2}`,fontFamily:"'JetBrains Mono',monospace"}}>#{t}</span>)}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════
   HOME PAGE
══════════════════════════════════════════════════════════════ */
const HomePage=({logs,onOpen,filter,T,isDark})=>{
  const filtered=filter==="all"?logs:logs.filter(l=>l.type===filter);
  const byDate={};
  filtered.forEach(log=>{
    const m=new Date(log.date).toLocaleDateString("en-IN",{month:"long",year:"numeric"});
    if(!byDate[m])byDate[m]=[];
    byDate[m].push(log);
  });

  // "Changelog" label colour — always visible
  const clLabelColor = isDark ? "#7c8bb5" : "#5a6488";

  return(
    <div style={{maxWidth:800,margin:"0 auto",padding:"40px 16px 80px"}}>
      {/* Hero */}
      <div style={{marginBottom:44,animation:"cjUp 0.45s ease both"}}>
        {/* "Changelog" label — visible in both modes */}
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
          <div style={{height:1,flex:1,background:`linear-gradient(to right,${T.b2},transparent)`}}/>
          <span style={{fontSize:11,fontWeight:700,letterSpacing:"2.5px",textTransform:"uppercase",color:clLabelColor,fontFamily:"'JetBrains Mono',monospace",background:T.panel,padding:"3px 12px",borderRadius:100,border:`1px solid ${T.b2}`}}>Changelog</span>
          <div style={{height:1,flex:1,background:`linear-gradient(to left,${T.b2},transparent)`}}/>
        </div>

        <h1 className="cj-hero-title" style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:38,color:T.t1,lineHeight:1.1,marginBottom:12,letterSpacing:"-0.6px"}}>
          Code Journey <span style={{color:T.teal}}>Logs</span>
        </h1>
        <p style={{fontFamily:"'Lora',serif",fontSize:16,color:T.t2,lineHeight:1.8,maxWidth:520}}>
          Every release, deprecation notice and improvement — documented with full technical detail.
        </p>

        {/* Stats */}
        <div style={{display:"flex",gap:8,marginTop:24,flexWrap:"wrap"}}>
          {[
            {label:"Releases",     count:LOGS.filter(l=>l.type==="release").length,     c:T.release},
            {label:"Deprecated",   count:LOGS.filter(l=>l.type==="deprecated").length,  c:T.deprecated},
            {label:"Improvements", count:LOGS.filter(l=>l.type==="improvement").length, c:T.improvement},
          ].map(s=>(
            <div key={s.label} style={{padding:"8px 14px",borderRadius:8,background:s.c.soft,border:`1px solid ${s.c.border}`,display:"flex",alignItems:"center",gap:8}}>
              <span style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:22,color:s.c.main,lineHeight:1}}>{s.count}</span>
              <span style={{fontSize:11.5,color:s.c.main,fontWeight:600,opacity:0.8}}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Timeline */}
      {Object.entries(byDate).map(([month,entries],gi)=>(
        <div key={month} style={{marginBottom:40}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
            <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,fontWeight:600,letterSpacing:"2px",textTransform:"uppercase",color:T.t3,flexShrink:0}}>{month}</span>
            <div style={{flex:1,height:1,background:T.b1}}/>
          </div>
          <div style={{display:"flex"}}>
            <div style={{width:18,marginRight:16,display:"flex",flexDirection:"column",alignItems:"center",flexShrink:0}}>
              <div style={{width:1,flex:1,background:T.b2}}/>
            </div>
            <div style={{flex:1,display:"flex",flexDirection:"column",gap:10}}>
              {entries.map((log,i)=>{
                const ac=T[log.type];
                return(
                  <div key={log.id} style={{display:"flex"}}>
                    <div style={{marginLeft:-26,marginRight:18,paddingTop:22,flexShrink:0}}>
                      <div style={{width:9,height:9,borderRadius:"50%",background:ac.main,boxShadow:`0 0 0 3px ${ac.soft}`, animation: "cjDotPulse 3s ease-in-out infinite"}}/>
                    </div>
                    <div style={{flex:1}}><LogCard log={log} onClick={onOpen} index={gi*10+i} T={T}/></div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ))}
      {filtered.length===0&&<div style={{textAlign:"center",padding:"60px 0",color:T.t3,fontFamily:"'Syne',sans-serif"}}>No logs found.</div>}
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════
   CATEGORY PAGE
══════════════════════════════════════════════════════════════ */
const CategoryPage=({type,logs,onOpen,T})=>{
  const cfg=TYPE_CFG[type];const ac=T[type];
  const filtered=logs.filter(l=>l.type===type);
  const descs={
    release:"Every new feature, language addition and platform update shipped to Code Journey users.",
    deprecated:"APIs, features and behaviours scheduled for removal — with migration guides and sunset timelines.",
    improvement:"Performance gains, UX refinements and quality-of-life upgrades across the platform.",
  };
  return(
    <div style={{maxWidth:800,margin:"0 auto",padding:"40px 16px 80px"}}>
      <div style={{marginBottom:40,animation:"cjUp 0.4s ease both"}}>
        <div style={{display:"inline-flex",alignItems:"center",gap:6,padding:"3px 11px",borderRadius:100,background:ac.soft,border:`1px solid ${ac.border}`,marginBottom:12}}>
          <span style={{fontSize:12}}>{cfg.icon}</span>
          <span style={{fontSize:10.5,fontWeight:700,letterSpacing:"1px",textTransform:"uppercase",color:ac.main,fontFamily:"'Syne',sans-serif"}}>{cfg.label}s</span>
        </div>
        <h1 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:32,color:T.t1,lineHeight:1.15,marginBottom:10,letterSpacing:"-0.4px"}}>
          {type==="release"?"New Releases":type==="deprecated"?"Deprecated Features":"Improvements"}
        </h1>
        <p style={{fontFamily:"'Lora',serif",fontSize:15,color:T.t2,lineHeight:1.78,maxWidth:500}}>{descs[type]}</p>
        <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:T.t3,marginTop:8}}>{filtered.length} {cfg.label.toLowerCase()}s total</div>
        <div style={{height:3,width:36,background:ac.main,borderRadius:2,marginTop:14,opacity:0.75}}/>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {filtered.map((log,i)=><LogCard key={log.id} log={log} onClick={onOpen} index={i} T={T}/>)}
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════
   SCROLL-SPY TOC  (sidebar for blog page)
══════════════════════════════════════════════════════════════ */
const ScrollSpyTOC=({sections,hasChangelog,activeId,th,scrollRef,log,fmt})=>{
  const items=[...sections.map(s=>({id:s.id,label:s.heading}))];
  if(hasChangelog)items.push({id:"changelog-section",label:"Changelog"});

  const scrollTo=(id)=>{
    const el=scrollRef.current?.querySelector(`[data-section="${id}"]`);
    if(el)el.scrollIntoView({behavior:"smooth",block:"start"});
  };

  return(
    <>
      {/* On This Page */}
      <div style={{background:th.sidebarBg,border:`1px solid ${th.sidebarBorder}`,borderRadius:10,padding:"14px 16px"}}>
        <div style={{fontSize:9.5,fontWeight:700,letterSpacing:"1.8px",textTransform:"uppercase",color:th.mutedText,fontFamily:"'JetBrains Mono',monospace",marginBottom:12}}>On This Page</div>
        <div style={{display:"flex",flexDirection:"column",gap:2}}>
          {items.map(item=>{
            const isActive=activeId===item.id;
            return(
              <button key={item.id} onClick={()=>scrollTo(item.id)}
                style={{display:"flex",alignItems:"center",gap:8,padding:"6px 8px",borderRadius:6,cursor:"pointer",border:"none",background:isActive?th.tocActiveBg:"transparent",transition:"all 0.15s",textAlign:"left",width:"100%"}}>
                <div style={{width:2.5,height:isActive?20:14,borderRadius:2,background:isActive?th.tocActive:th.mutedText,flexShrink:0,transition:"all 0.2s"}}/>
                <span style={{fontSize:11.5,color:isActive?th.tocActive:th.mutedText,fontFamily:"'Syne',sans-serif",fontWeight:isActive?600:500,lineHeight:1.35,transition:"color 0.15s"}}>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Details */}
      <div style={{background:th.sidebarBg,border:`1px solid ${th.sidebarBorder}`,borderRadius:10,padding:"14px 16px"}}>
        <div style={{fontSize:9.5,fontWeight:700,letterSpacing:"1.5px",textTransform:"uppercase",color:th.mutedText,fontFamily:"'JetBrains Mono',monospace",marginBottom:12}}>Details</div>
        {[
          {label:"Version",  val:log.version},
          {label:"Released", val:fmt(log.date)},
          {label:"Read time",val:log.readTime},
        ].map(r=>(
          <div key={r.label} style={{marginBottom:10}}>
            <div style={{fontSize:9,color:th.mutedText,fontFamily:"'JetBrains Mono',monospace",letterSpacing:"0.5px",textTransform:"uppercase",marginBottom:2}}>{r.label}</div>
            <div style={{fontSize:12.5,color:th.headText,fontFamily:r.label==="Version"?"'JetBrains Mono',monospace":"'Syne',sans-serif",fontWeight:r.label==="Version"?600:500}}>{r.val}</div>
          </div>
        ))}
      </div>
    </>
  );
};

/* ══════════════════════════════════════════════════════════════
   BLOG PAGE — themed, rich typography, scroll-spy
══════════════════════════════════════════════════════════════ */
const BlogPage=({log,onBack,isDark,T})=>{
  const scrollRef=useRef(null);
  const [readPct,setReadPct]=useState(0);
  const [activeId,setActiveId]=useState(log.content.sections[0]?.id||"");
  const th=T[blogKey(log.type)];
  const clrMap=isDark?CL_DARK:CL_LIGHT;

  // Reading progress
  useEffect(()=>{
    const el=scrollRef.current;if(!el)return;
    const fn=()=>setReadPct(Math.min(1,el.scrollTop/(el.scrollHeight-el.clientHeight)));
    el.addEventListener("scroll",fn);
    return()=>el.removeEventListener("scroll",fn);
  },[]);

  // Scroll spy — IntersectionObserver on section divs
  useEffect(()=>{
    const el=scrollRef.current;if(!el)return;
    const sectionIds=[...log.content.sections.map(s=>s.id),"changelog-section"];
    const observers=[];
    // We track which sections are visible and pick the topmost
    const visible=new Set();
    sectionIds.forEach(id=>{
      const target=el.querySelector(`[data-section="${id}"]`);
      if(!target)return;
      const obs=new IntersectionObserver(([entry])=>{
        if(entry.isIntersecting)visible.add(id);
        else visible.delete(id);
        // pick first in document order
        const first=sectionIds.find(sid=>visible.has(sid));
        if(first)setActiveId(first);
      },{root:el,rootMargin:"-20% 0px -50% 0px",threshold:0});
      obs.observe(target);
      observers.push(obs);
    });
    return()=>observers.forEach(o=>o.disconnect());
  },[log]);

  return(
    <div ref={scrollRef} style={{flex:1,overflowY:"auto",background:th.bg,transition:"background 0.3s"}}>
      {/* Progress bar */}
      <div style={{position:"sticky",top:0,height:2.5,background:th.border,zIndex:300}}>
        <div style={{height:"100%",background:th.accent,width:`${readPct*100}%`,transition:"width 0.07s linear",borderRadius:"0 2px 2px 0"}}/>
      </div>

      {/* Back bar */}
      <div style={{background:`${th.bg}ee`,backdropFilter:"blur(14px)",borderBottom:`1px solid ${th.border}`,padding:"0 16px",position:"sticky",top:2.5,zIndex:150}}>
        <div style={{maxWidth:960,margin:"0 auto",display:"flex",alignItems:"center",height:42,gap:10,flexWrap:"wrap"}}>
          <button onClick={onBack} style={{display:"flex",alignItems:"center",gap:5,fontSize:12,fontWeight:600,color:th.accent,background:th.accentSoft,border:`1px solid ${th.border}`,borderRadius:6,padding:"4px 11px",cursor:"pointer",fontFamily:"'Syne',sans-serif",transition:"all 0.14s",whiteSpace:"nowrap"}}>← All Logs</button>
          <span style={{fontSize:10.5,color:th.mutedText,fontFamily:"'JetBrains Mono',monospace",opacity:0.7,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>/{log.type}s/{log.id}</span>
          <div style={{marginLeft:"auto"}}><TypeBadge type={log.type} T={T} small/></div>
        </div>
      </div>

      {/* Hero */}
      <div style={{background:th.heroGrad,borderBottom:`1px solid ${th.border}`,padding:"48px 16px 40px"}}>
        <div style={{maxWidth:720,margin:"0 auto",animation:"cjUp 0.42s ease both"}}>
          <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:18,flexWrap:"wrap"}}>
            <TypeBadge type={log.type} T={T}/>
            {log.status&&<StatusBadge status={log.status}/>}
            <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11.5,fontWeight:600,color:th.accent,background:th.accentSoft,border:`1px solid ${th.border}`,padding:"3px 9px",borderRadius:4}}>{log.version}</span>
          </div>
          <h1 className="cj-blog-title" style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:34,color:th.headText,lineHeight:1.12,marginBottom:16,letterSpacing:"-0.5px"}}>{log.content.headline}</h1>
          <p className="cj-blog-intro" style={{fontFamily:"'Lora',serif",fontStyle:"italic",fontWeight:400,fontSize:18.5,color:th.bodyText,lineHeight:1.88,marginBottom:26,letterSpacing:"0.01em"}}>{log.content.intro}</p>
          {/* meta: date + readtime, no author */}
          <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
            <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11.5,color:th.mutedText}}>{fmt(log.date)}</span>
            <span style={{color:th.mutedText,opacity:0.5}}>·</span>
            <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11.5,color:th.mutedText}}>{log.readTime} read</span>
            <div style={{marginLeft:"auto",display:"flex",gap:5,flexWrap:"wrap"}}>
              {log.tags.map(t=><span key={t} style={{padding:"2px 8px",borderRadius:4,fontSize:10,fontWeight:600,background:th.tagBg,color:th.tagColor,border:`1px solid ${th.tagBorder}`,fontFamily:"'JetBrains Mono',monospace"}}>#{t}</span>)}
            </div>
          </div>
        </div>
      </div>

      {/* Body — article + sidebar */}
      <div style={{maxWidth:960,margin:"0 auto",padding:"48px 16px 80px"}}>
        <div style={{display:"flex",gap:48,alignItems:"flex-start"}}>

          {/* ── Article ── */}
          <article style={{flex:1,minWidth:0}}>
            {log.content.sections.map((sec,i)=>(
              <div key={sec.id} data-section={sec.id} style={{marginBottom:56,scrollMarginTop:80,animation:`cjUp 0.36s ease ${i*60+80}ms both`}}>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
                  <div style={{width:3.5,height:24,background:th.accent,borderRadius:2,flexShrink:0}}/>
                  <h2 className="cj-section-head" style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:21,color:th.headText,letterSpacing:"-0.25px",lineHeight:1.2}}>{sec.heading}</h2>
                </div>
                <div style={{paddingLeft:14}}>
                  <p className="cj-section-body" style={{fontFamily:"'Lora',serif",fontSize:17,color:th.bodyText,lineHeight:1.92,fontWeight:400,letterSpacing:"0.012em"}}>{sec.body}</p>
                </div>
                {i<log.content.sections.length-1&&(
                  <div style={{height:1,background:th.rulerColor,marginTop:48,marginLeft:14}}/>
                )}
              </div>
            ))}

            {/* Changelog */}
            {log.content.changelog&&(
              <div data-section="changelog-section" style={{marginTop:52,scrollMarginTop:80}}>
                <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:22}}>
                  <div style={{height:1,flex:1,background:th.rulerColor}}/>
                  <span style={{fontSize:10,fontWeight:700,letterSpacing:"2.5px",textTransform:"uppercase",color:th.mutedText,fontFamily:"'JetBrains Mono',monospace",flexShrink:0}}>Changelog</span>
                  <div style={{height:1,flex:1,background:th.rulerColor}}/>
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:12}}>
                  {log.content.changelog.map((section,si)=>{
                    const clr=clrMap[section.label]||clrMap["Added"];
                    return(
                      <div key={si} style={{background:clr.bg,border:`1px solid ${clr.border}`,borderRadius:10,padding:"14px 16px",animation:`cjUp 0.3s ease ${si*50+160}ms both`}}>
                        <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,fontWeight:700,letterSpacing:"1.5px",textTransform:"uppercase",color:clr.color,marginBottom:10,display:"flex",alignItems:"center",gap:6}}>
                          <span style={{width:5,height:5,borderRadius:"50%",background:clr.color,display:"inline-block"}}/>
                          {section.label}
                        </div>
                        <ul style={{listStyle:"none",display:"flex",flexDirection:"column",gap:7}}>
                          {section.items.map((item,ii)=>(
                            <li key={ii} style={{display:"flex",gap:9,alignItems:"flex-start"}}>
                              <span style={{color:clr.color,fontWeight:700,fontSize:13,marginTop:"1px",flexShrink:0}}>+</span>
                              <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:13,color:isDark?clr.color:"#374151",lineHeight:1.6,opacity:isDark?0.85:1}}>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Back */}
            <div style={{marginTop:60,paddingTop:24,borderTop:`1px solid ${th.rulerColor}`,display:"flex"}}>
              <button onClick={onBack} style={{display:"flex",alignItems:"center",gap:7,padding:"10px 22px",borderRadius:8,fontSize:13.5,fontWeight:700,cursor:"pointer",background:th.accent,color:"#fff",border:"none",fontFamily:"'Syne',sans-serif",boxShadow:`0 4px 20px ${th.accent}40`,transition:"all 0.16s",letterSpacing:"0.2px"}}>← Back to Logs</button>
            </div>
          </article>

          {/* ── Sidebar — alignSelf:flex-start lets sticky work correctly ── */}
          <aside style={{width:190,flexShrink:0,alignSelf:"flex-start", position:"sticky", top:50, display:"flex",flexDirection:"column",gap:14}}>
            <ScrollSpyTOC
              sections={log.content.sections}
              hasChangelog={!!log.content.changelog}
              activeId={activeId}
              th={th}
              scrollRef={scrollRef}
              log={log}
              fmt={fmt}
            />
          </aside>
        </div>
      </div>

      {/* Mobile sidebar (shows below article on small screens) */}
      <style>{`
        @media (max-width: 720px) {
          .cj-blog-sidebar { display: none !important; }
          .cj-blog-article { min-width: 0 !important; }
        }
      `}</style>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════
   ROOT
══════════════════════════════════════════════════════════════ */
export default function CJLogs() {
  const [isDark,setIsDark]=useState(true);
  const [page,setPage]=useState("home");
  const [filter,setFilter]=useState("all");
  const [openLog,setOpenLog]=useState(null);

  const T=makeTheme(isDark);
  const toggle=()=>setIsDark(d=>!d);

  const handleOpen=(log)=>{setOpenLog(log);setPage("detail");};
  const handleBack=()=>{
    setOpenLog(null);
    setPage(filter==="all"?"home":filter==="release"?"releases":filter==="deprecated"?"deprecated":"improvements");
  };
  const isDetail=page==="detail"&&openLog;

  const handleNav=(p,f)=>{
    if(isDetail)setOpenLog(null);
    setPage(p);
    if(f)setFilter(f);
  };

  const shellBg=isDetail?T[blogKey(openLog.type)].bg:T.deep;

  return(
    <>
      <GlobalStyles isDark={isDark}/>
      <div style={{display:"flex",flexDirection:"column",width:"100%",height:"100vh",background:shellBg,fontFamily:"'Syne',sans-serif",color:T.t1,overflow:"hidden",transition:"background 0.3s"}}>

        {/* Section tabs — sits directly below whatever parent nav exists */}
        <SectionTabs
          page={page}
          setPage={(p)=>handleNav(p,{home:"all",releases:"release",deprecated:"deprecated",improvements:"improvement"}[p]||"all")}
          setFilter={setFilter}
          isDark={isDark}
          toggleTheme={toggle}
          T={T}
        />

        {/* Content */}
        <div style={{flex:1,overflowY:isDetail?"hidden":"auto",overflowX:"hidden",position:"relative"}}>
          {isDetail&&(
            <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column"}}>
              <BlogPage log={openLog} onBack={handleBack} isDark={isDark} T={T}/>
            </div>
          )}
          {!isDetail&&(
            <>
              {page==="home"         &&<HomePage      logs={LOGS} onOpen={handleOpen} filter={filter} T={T} isDark={isDark}/>}
              {page==="releases"     &&<CategoryPage  type="release"     logs={LOGS} onOpen={handleOpen} T={T}/>}
              {page==="deprecated"   &&<CategoryPage  type="deprecated"  logs={LOGS} onOpen={handleOpen} T={T}/>}
              {page==="improvements" &&<CategoryPage  type="improvement" logs={LOGS} onOpen={handleOpen} T={T}/>}
            </>
          )}
        </div>
      </div>
    </>
  );
}