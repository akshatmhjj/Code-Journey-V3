import { useState, useEffect, useRef } from "react";

/* ─────────────────────────────────────────────────────────────
   FONTS & GLOBAL STYLES
───────────────────────────────────────────────────────────── */
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500&family=Syne:wght@400;500;600;700;800&family=Instrument+Serif:ital@0;1&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }

    @keyframes cjFadeUp   { from { opacity:0; transform:translateY(16px) } to { opacity:1; transform:translateY(0) } }
    @keyframes cjFadeIn   { from { opacity:0 } to { opacity:1 } }
    @keyframes cjSlideR   { from { opacity:0; transform:translateX(-12px) } to { opacity:1; transform:translateX(0) } }
    @keyframes cjPulse    { 0%,100%{opacity:1} 50%{opacity:0.45} }
    @keyframes cjSpin     { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
    @keyframes cjScaleIn  { from{opacity:0;transform:scale(0.96)} to{opacity:1;transform:scale(1)} }
    @keyframes cjLineGrow { from{width:0} to{width:100%} }

    ::-webkit-scrollbar { width: 5px; height: 5px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: #232844; border-radius: 3px; }
    ::-webkit-scrollbar-thumb:hover { background: #2e3660; }

    ::selection { background: rgba(124,110,224,0.3); color: #e8eaf2; }
  `}</style>
);

/* ─────────────────────────────────────────────────────────────
   DESIGN TOKENS
───────────────────────────────────────────────────────────── */
const D = {
  // Dark base (shared across all pages)
  void:    "#07080d",
  deep:    "#0c0e18",
  mid:     "#111420",
  surface: "#161927",
  panel:   "#1a1e2e",
  hover:   "#1e2335",
  active:  "#232844",
  // Text
  t1: "#e8eaf2",
  t2: "#8892b0",
  t3: "#4a5374",
  t4: "#2e3660",
  // Borders
  b1: "rgba(120,130,180,0.07)",
  b2: "rgba(120,130,180,0.14)",
  b3: "rgba(120,130,180,0.22)",
  // Brand
  purple: "#7c6ee0",
  purpleD: "#5a4fb8",
  teal:   "#5eead4",
  // Type accents
  release:     { main:"#22c55e", dim:"rgba(34,197,94,0.12)",  border:"rgba(34,197,94,0.22)",  glow:"rgba(34,197,94,0.08)"  },
  deprecated:  { main:"#ef4444", dim:"rgba(239,68,68,0.12)",  border:"rgba(239,68,68,0.22)",  glow:"rgba(239,68,68,0.08)"  },
  improvement: { main:"#3b82f6", dim:"rgba(59,130,246,0.12)", border:"rgba(59,130,246,0.22)", glow:"rgba(59,130,246,0.08)" },
  // Light blog themes
  releaseTheme:     { bg:"#f0fdf4", surface:"#ffffff", border:"#bbf7d0", accent:"#16a34a", accentDim:"#dcfce7", text:"#14532d", text2:"#166534", text3:"#15803d", muted:"#4b7a58", chip:"#86efac", chipText:"#14532d" },
  deprecatedTheme:  { bg:"#fff1f2", surface:"#ffffff", border:"#fecaca", accent:"#dc2626", accentDim:"#fee2e2", text:"#450a0a", text2:"#7f1d1d", text3:"#991b1b", muted:"#7a4040", chip:"#fca5a5", chipText:"#450a0a" },
  improvementTheme: { bg:"#eff6ff", surface:"#ffffff", border:"#bfdbfe", accent:"#1d4ed8", accentDim:"#dbeafe", text:"#0c1b4d", text2:"#1e3a5f", text3:"#1d4ed8", muted:"#3a5280", chip:"#93c5fd", chipText:"#0c1b4d" },
};

/* ─────────────────────────────────────────────────────────────
   DATA — All Logs
───────────────────────────────────────────────────────────── */
const LOGS = [
  // ── RELEASES ─────────────────────────────────────────────────
  {
    id: "r-001",
    type: "release",
    version: "v2.4.0",
    title: "Multi-Language Code Runner",
    date: "2026-03-28",
    summary: "Execute Python, JavaScript, TypeScript, R and SQL directly inside Code Journey with real-time output streaming and sandboxed execution.",
    tags: ["code-runner", "backend", "sandbox"],
    author: { name: "Aryan Mehta", initials: "AM" },
    readTime: "5 min",
    content: {
      headline: "Run Code Natively — No Setup Required",
      intro: "Today we're shipping the feature our community has been asking for since day one: a fully sandboxed, multi-language code runner built directly into Code Journey. No local installs, no configuration headaches — just write and run.",
      sections: [
        {
          heading: "What's New",
          body: "The Code Journey runtime supports nine languages at launch: JavaScript, TypeScript, Python 3.12, R 4.3, SQL (PostgreSQL dialect), Dart, Kotlin, Rust 1.77 and HTML/CSS preview. Each language runs in an isolated WebAssembly container, ensuring your code never interferes with other users' sessions."
        },
        {
          heading: "Real-time Output Streaming",
          body: "Output lines stream token-by-token into the integrated terminal panel. Long-running scripts display a live progress indicator. Stdout, stderr and console logs are colour-coded so you can instantly distinguish between normal output, warnings and errors."
        },
        {
          heading: "Sandboxed Execution",
          body: "Every execution happens inside a strict sandbox with a 30-second CPU timeout, 128 MB memory cap and no network access. Your code is ephemeral — nothing persists after the session ends, keeping the environment clean and safe."
        },
        {
          heading: "Coming Next",
          body: "We're already working on persistent REPL sessions, package import support for Python (pip) and Node (npm), and collaborative live-sharing so you can run code together with a peer or mentor in real time."
        }
      ],
      changelog: [
        { label: "Added", items: ["WebAssembly-based sandboxed execution engine", "Streaming stdout/stderr output in terminal panel", "Language-specific timeout and memory limits", "Run keyboard shortcut (Ctrl/Cmd + Enter)", "Execution history with replay"] },
        { label: "Fixed",  items: ["Terminal scroll lock on rapid output", "Tab focus lost after running code"] },
      ]
    }
  },
  {
    id: "r-002",
    type: "release",
    version: "v2.3.0",
    title: "AI Tutor Integration",
    date: "2026-03-14",
    summary: "Ask questions, get hints and request code reviews from an AI tutor that understands your current exercise context without leaving the IDE.",
    tags: ["ai", "tutor", "hints"],
    author: { name: "Priya Sharma", initials: "PS" },
    readTime: "4 min",
    content: {
      headline: "Your Personal AI Tutor — Context-Aware and Always On",
      intro: "Code Journey now ships with a built-in AI tutor that reads your open file, your current exercise and your test results before you even type your question. No copy-pasting. No context loss.",
      sections: [
        { heading: "Context-Aware Assistance", body: "The tutor automatically receives your current code, the exercise description, which tests are passing or failing, and your recent terminal output. When you ask 'why is my function returning undefined?', it already knows exactly what your function looks like." },
        { heading: "Hint Ladder System", body: "Instead of dumping the full solution, the AI follows a Socratic ladder: it first confirms your understanding of the problem, then nudges you toward the concept, then shows a partial pattern if you're still stuck. You earn more XP for solving with fewer hints." },
        { heading: "Code Review Mode", body: "Finished an exercise? Switch the tutor to Review Mode and it will analyse your solution for clarity, performance and idiomatic style — with specific line-level suggestions rendered inline in the editor." }
      ],
      changelog: [
        { label: "Added",   items: ["AI Tutor side panel with context injection", "Hint ladder (3-tier progressive reveal)", "Code review mode with inline annotations", "Keyboard shortcut (Ctrl/Cmd + Shift + A)"] },
        { label: "Improved", items: ["Exercise hint system now powered by AI", "Faster initial response time (<800ms p50)"] },
      ]
    }
  },
  {
    id: "r-003",
    type: "release",
    version: "v2.2.0",
    title: "Streak & XP Gamification",
    date: "2026-02-27",
    summary: "Daily coding streaks, XP points, level badges and weekly leaderboards. Stay motivated with a progression system built for consistent practice.",
    tags: ["gamification", "streaks", "xp"],
    author: { name: "Dev Singh", initials: "DS" },
    readTime: "3 min",
    content: {
      headline: "Level Up Your Learning — Every Day",
      intro: "Learning to code is a long game. The new Code Journey gamification system is designed around one principle: reward consistency over intensity.",
      sections: [
        { heading: "Daily Streaks", body: "Complete at least one exercise per day to keep your streak alive. Streaks unlock cosmetic IDE themes at 7, 30 and 100 days. Miss a day? A single Streak Shield (earned via challenges) can save it." },
        { heading: "XP & Levels", body: "Every exercise awards XP based on difficulty, hints used and time-to-solve. Accumulate XP to climb from Novice → Apprentice → Practitioner → Expert → Master. Each level unlocks new language tracks and challenge modes." },
        { heading: "Leaderboards", body: "Weekly leaderboards reset every Monday. Compete globally or filter to your cohort, language track or country. Top 3 earners each week get a featured badge on their public profile." }
      ],
      changelog: [
        { label: "Added", items: ["Daily streak tracking with shield system", "XP calculation engine (difficulty × hints × speed)", "5-tier level progression with badge art", "Weekly global and cohort leaderboards", "Profile XP history chart"] },
      ]
    }
  },

  // ── DEPRECATED ───────────────────────────────────────────────
  {
    id: "d-001",
    type: "deprecated",
    version: "v2.4.0",
    title: "Legacy Monaco Editor Config API",
    date: "2026-03-28",
    status: "sunset-90d",
    summary: "The direct Monaco editor configuration object (window.__CJ_MONACO_CONFIG) is deprecated. Migrate to the new EditorOptions provider API before June 30 2026.",
    tags: ["editor", "api", "breaking"],
    author: { name: "Rahul Verma", initials: "RV" },
    readTime: "6 min",
    content: {
      headline: "Legacy Monaco Config API — Deprecated in v2.4.0",
      intro: "With the introduction of our new EditorOptions provider API, the direct window.__CJ_MONACO_CONFIG global object is now deprecated and will stop being read after June 30 2026 (90-day sunset window).",
      sections: [
        { heading: "Why We're Deprecating It", body: "The global config object was a quick-win introduced in v1.0 that never received proper lifecycle management. It caused race conditions when loaded after the editor initialised, had no validation layer, and couldn't support dynamic per-file config overrides — all of which the new EditorOptions API solves." },
        { heading: "Migration Path", body: "Replace any window.__CJ_MONACO_CONFIG = { ... } calls with the new CJEditor.configure(options) method, which accepts the same option keys. The method is idempotent, can be called at any point in the page lifecycle, and emits a 'cj:editor-config-updated' event so you can react to changes." },
        { heading: "Timeline", body: "v2.4.0 (today): Deprecation warning logged to console. v2.5.0 (May 2026): Warning becomes a visible in-app banner. v2.6.0 (July 2026): Global object no longer read; behaviour is undefined." }
      ],
      changelog: [
        { label: "Deprecated", items: ["window.__CJ_MONACO_CONFIG global object", "__CJ_MONACO_CONFIG.theme (use CJEditor.configure({ theme }))", "__CJ_MONACO_CONFIG.fontSize (use CJEditor.configure({ fontSize }))"] },
        { label: "Replacement", items: ["CJEditor.configure(options) — full options API", "CJEditor.getConfig() — read current config", "'cj:editor-config-updated' event for reactive updates"] },
      ]
    }
  },
  {
    id: "d-002",
    type: "deprecated",
    version: "v2.3.0",
    status: "sunset-60d",
    title: "v1 Exercise Completion Webhook",
    date: "2026-03-14",
    summary: "The v1 /webhooks/exercise-complete endpoint is deprecated. Switch to the v2 event stream API for richer payload and retry guarantees.",
    tags: ["webhooks", "api", "v1"],
    author: { name: "Ananya Krishnan", initials: "AK" },
    readTime: "5 min",
    content: {
      headline: "V1 Webhook Endpoint Deprecated — Switch to Event Streams",
      intro: "The /api/v1/webhooks/exercise-complete endpoint has been deprecated in v2.3.0. It will be removed on May 14 2026 (60 days). Please migrate to the v2 event stream API which offers structured payloads, automatic retries and signed delivery.",
      sections: [
        { heading: "What Changes", body: "The v1 endpoint sent a flat JSON object with userId, exerciseId and completedAt. The v2 stream sends a fully-typed EventEnvelope with schema versioning, an idempotency key, retry metadata and a HMAC-SHA256 signature for verification." },
        { heading: "How to Migrate", body: "1. Create an Event Stream endpoint in your dashboard under Integrations → Event Streams. 2. Subscribe to the exercise.completed event type. 3. Verify the X-CJ-Signature header on each delivery. 4. Deregister your v1 webhook before May 14." },
        { heading: "Testing", body: "Use the 'Send Test Event' button in the dashboard to fire a synthetic exercise.completed event to your endpoint. The event inspector shows full request/response headers and lets you replay failed deliveries." }
      ],
      changelog: [
        { label: "Deprecated", items: ["POST /api/v1/webhooks/exercise-complete", "Flat payload format (userId, exerciseId, completedAt)"] },
        { label: "Replacement", items: ["Event Stream subscription: exercise.completed", "EventEnvelope payload with schema versioning", "HMAC-SHA256 signed delivery", "Automatic retry with exponential back-off"] },
      ]
    }
  },
  {
    id: "d-003",
    type: "deprecated",
    version: "v2.2.0",
    status: "removed",
    title: "Flash-based Code Playground (removed)",
    date: "2026-02-27",
    summary: "The legacy Flash-based playground introduced in 2019 has been fully removed. All users were migrated to the WebAssembly runner automatically.",
    tags: ["flash", "legacy", "removed"],
    author: { name: "Kiran Nair", initials: "KN" },
    readTime: "2 min",
    content: {
      headline: "Flash Playground Fully Removed in v2.2.0",
      intro: "As announced in November 2025, the Flash-based code playground that shipped with the original Code Journey beta has been completely removed in v2.2.0. All users have been automatically migrated.",
      sections: [
        { heading: "Background", body: "The Flash playground was the very first iteration of in-browser code execution we built back in 2019. It served over 2 million exercise runs before browser vendors began disabling Flash support in 2020." },
        { heading: "Migration", body: "All user settings, exercise progress and saved snippets stored in the Flash localStorage layer have been migrated to the new WebAssembly runner data store. No action was required from users." },
        { heading: "What You Get Instead", body: "The WebAssembly runner is 4× faster, supports 9 languages vs the Flash runner's 3, has no plugin dependency, and works on all modern browsers including mobile." }
      ],
      changelog: [
        { label: "Removed", items: ["Flash (SWF) code playground runtime", "Flash-specific localStorage adapter", "__CJ_FLASH_COMPAT polyfill layer"] },
        { label: "Migrated", items: ["All user progress data → WebAssembly store", "Saved code snippets → new Snippets API"] },
      ]
    }
  },

  // ── IMPROVEMENTS ─────────────────────────────────────────────
  {
    id: "i-001",
    type: "improvement",
    version: "v2.4.0",
    title: "Editor Startup Time — 3× Faster",
    date: "2026-03-28",
    summary: "Cold boot time for the Code Journey editor dropped from 2.8s to 0.9s through lazy chunk splitting, WASM pre-warming and font subsetting.",
    tags: ["performance", "startup", "wasm"],
    author: { name: "Siddharth Roy", initials: "SR" },
    readTime: "4 min",
    content: {
      headline: "Editor Boots 3× Faster — Here's How We Did It",
      intro: "In our March performance audit, we found the editor's cold boot time (first contentful paint to interactive) averaged 2.8 seconds on a 10 Mbps connection. That's too slow. After three weeks of profiling and optimisation, we've brought it down to 0.9 seconds.",
      sections: [
        { heading: "Lazy Chunk Splitting", body: "The editor's JavaScript bundle was a single 1.4 MB chunk. We restructured the build into 12 lazy-loaded chunks: the core editor shell (180 KB), language syntax definitions loaded on demand, and heavy features (minimap, git diff) deferred until after the editor is interactive." },
        { heading: "WASM Pre-warming", body: "The WebAssembly execution engine previously compiled on first Run press — causing a 600–900ms freeze. We now pre-warm the WASM module in a background thread 3 seconds after the editor becomes visible, so by the time you hit Run, the engine is ready." },
        { heading: "Font Subsetting", body: "JetBrains Mono was loaded in full (four weights × italic variants = 680 KB). We now ship a subset containing only the unicode ranges and weights actually used in the editor, reducing font payload to 94 KB." }
      ],
      changelog: [
        { label: "Improved", items: ["Cold boot: 2.8s → 0.9s (p75 on 10 Mbps)", "First Run response: 900ms → 45ms (after pre-warm)", "Total JS parse time: 380ms → 110ms", "Font payload: 680 KB → 94 KB"] },
        { label: "Technique", items: ["12-chunk lazy build (Rollup)", "Background WASM pre-compilation (Web Worker)", "Unicode-range font subsetting", "Tree-shaking for icon library (removed 2,100 unused icons)"] },
      ]
    }
  },
  {
    id: "i-002",
    type: "improvement",
    version: "v2.3.0",
    title: "Syntax Highlighting Overhaul",
    date: "2026-03-14",
    summary: "Rebuilt the tokeniser pipeline from regex to a grammar-based system. 23 new token scopes added. Highlighting now accurate for TypeScript generics, SQL CTEs and Rust lifetimes.",
    tags: ["editor", "syntax", "tokeniser"],
    author: { name: "Meera Iyer", initials: "MI" },
    readTime: "5 min",
    content: {
      headline: "Syntax Highlighting — Rebuilt from the Ground Up",
      intro: "Our original regex-based tokeniser served us well for simple cases, but it had systematic failures on complex language constructs: TypeScript generics with multiple type parameters, SQL CTEs and subqueries, and Rust lifetime annotations all highlighted incorrectly or not at all.",
      sections: [
        { heading: "Grammar-Based Tokeniser", body: "We replaced the 800-line regex file with a TextMate grammar engine. Each language now has a .tmLanguage grammar file that describes the full language syntax as a hierarchy of scopes. The engine handles nested constructs, multi-line tokens and state machines correctly." },
        { heading: "23 New Token Scopes", body: "We added scopes for: TypeScript generic constraints (where T extends), decorator expressions, template literal interpolations, SQL WITH clauses and window functions, Rust lifetime parameters ('a), Dart null-safety operators (?. and ??), Kotlin coroutine keywords (suspend, flow, emit), and R formula operators (~)." },
        { heading: "Theme Compatibility", body: "All existing Code Journey themes (Dark Cosmos, Void, Nord, Dracula) were updated to cover the new scopes. Third-party themes that don't define new scopes fall back gracefully to the parent scope colour." }
      ],
      changelog: [
        { label: "Improved", items: ["Tokeniser: regex-based → TextMate grammar engine", "23 new token scopes across 9 languages", "TypeScript generics and decorators", "SQL CTEs, subqueries and window functions", "Rust lifetimes and borrow annotations"] },
        { label: "Fixed", items: ["Incorrect colouring of TS generic constraints", "SQL keyword highlighting inside string literals", "R formula operator (~) treated as unknown"] },
      ]
    }
  },
  {
    id: "i-003",
    type: "improvement",
    version: "v2.2.0",
    title: "Mobile Keyboard & Touch Input",
    date: "2026-02-27",
    summary: "Soft keyboard now co-exists with the editor viewport. Added a custom quick-access toolbar with brackets, indentation and snippet keys for touch typists.",
    tags: ["mobile", "ux", "touch"],
    author: { name: "Tanvi Bose", initials: "TB" },
    readTime: "3 min",
    content: {
      headline: "Code on the Go — Mobile Input Redesigned",
      intro: "Mobile was an afterthought in the original editor design. On iOS and Android, raising the soft keyboard would collapse the editor viewport, obscure the terminal, and frequently cause the cursor to jump unpredictably. We fixed all of it.",
      sections: [
        { heading: "Viewport Stability", body: "We switched the editor layout from vh-based heights to the CSS dvh (dynamic viewport height) unit, which correctly accounts for the space occupied by the soft keyboard. The editor, tab bar and status bar now remain fully visible when the keyboard is open." },
        { heading: "Quick-Access Toolbar", body: "We added a fixed toolbar that floats above the soft keyboard on touch devices. It provides one-tap access to: brackets (( ) [ ] { }), common operators, Tab/Shift-Tab for indentation, and a Snippets button that inserts the three most recently used code snippets." },
        { heading: "Cursor Precision", body: "Touch-and-hold on any token now shows a magnified cursor loupe (iOS style) for precise placement. Double-tap selects the token under the finger. Triple-tap selects the entire line." }
      ],
      changelog: [
        { label: "Improved", items: ["Viewport: vh → dvh, stable with soft keyboard", "Custom quick-access toolbar above keyboard", "Touch-and-hold magnified cursor loupe", "Double-tap token select / triple-tap line select"] },
        { label: "Fixed", items: ["Cursor jump when soft keyboard opens (iOS 16+)", "Viewport collapse on Android Chrome", "Tab key inserts literal tab character on mobile"] },
      ]
    }
  },
];

/* ─────────────────────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────────────────────── */
const TYPE_META = {
  release:     { label: "Release",     icon: "🚀", color: D.release,     theme: D.releaseTheme },
  deprecated:  { label: "Deprecated",  icon: "⚠️",  color: D.deprecated,  theme: D.deprecatedTheme },
  improvement: { label: "Improvement", icon: "⚡", color: D.improvement, theme: D.improvementTheme },
};

const STATUS_META = {
  "sunset-90d": { label: "Sunset in 90d", color: "#f97316", bg: "rgba(249,115,22,0.12)", border: "rgba(249,115,22,0.25)" },
  "sunset-60d": { label: "Sunset in 60d", color: "#ef4444", bg: "rgba(239,68,68,0.12)",  border: "rgba(239,68,68,0.25)"  },
  "removed":    { label: "Removed",       color: "#94a3b8", bg: "rgba(148,163,184,0.1)",  border: "rgba(148,163,184,0.2)" },
};

const formatDate = (str) => {
  const d = new Date(str);
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
};

const relativeDate = (str) => {
  const diff = Math.floor((Date.now() - new Date(str)) / 86400000);
  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";
  if (diff < 7)  return `${diff} days ago`;
  if (diff < 30) return `${Math.floor(diff/7)}w ago`;
  return `${Math.floor(diff/30)}mo ago`;
};

/* ─────────────────────────────────────────────────────────────
   SMALL SHARED COMPONENTS
───────────────────────────────────────────────────────────── */

// Avatar
const Avatar = ({ initials, size = 28, accent }) => (
  <div style={{ width: size, height: size, borderRadius: "50%", background: accent ? `${accent}22` : D.active, border: `1px solid ${accent ? `${accent}44` : D.b2}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.36, fontWeight: 700, color: accent || D.t2, flexShrink: 0, fontFamily: "'Syne', sans-serif" }}>
    {initials}
  </div>
);

// Type Badge
const TypeBadge = ({ type, small }) => {
  const m = TYPE_META[type];
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: small ? "2px 7px" : "3px 10px", borderRadius: 100, fontSize: small ? 10 : 11, fontWeight: 700, letterSpacing: "0.5px", textTransform: "uppercase", background: m.color.dim, color: m.color.main, border: `1px solid ${m.color.border}`, fontFamily: "'Syne', sans-serif", flexShrink: 0 }}>
      <span style={{ fontSize: small ? 10 : 11 }}>{m.icon}</span> {m.label}
    </span>
  );
};

// Status Badge (deprecated only)
const StatusBadge = ({ status }) => {
  if (!status) return null;
  const s = STATUS_META[status];
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "2px 8px", borderRadius: 4, fontSize: 10.5, fontWeight: 700, letterSpacing: "0.4px", background: s.bg, color: s.color, border: `1px solid ${s.border}`, fontFamily: "'JetBrains Mono', monospace" }}>
      {s.label}
    </span>
  );
};

// Tag Chip
const Tag = ({ label, accent }) => (
  <span style={{ padding: "2px 8px", borderRadius: 4, fontSize: 10.5, fontWeight: 500, background: D.active, color: D.t3, border: `1px solid ${D.b2}`, fontFamily: "'JetBrains Mono', monospace" }}>
    #{label}
  </span>
);

// Version Pill
const VersionPill = ({ version, accent }) => (
  <span style={{ padding: "2px 9px", borderRadius: 5, fontSize: 11, fontWeight: 600, background: D.panel, color: accent, border: `1px solid ${accent}44`, fontFamily: "'JetBrains Mono', monospace" }}>
    {version}
  </span>
);

// Divider
const Divider = () => <div style={{ height: 1, background: D.b1, margin: "0" }} />;

/* ─────────────────────────────────────────────────────────────
   NAVIGATION / TOP BAR
───────────────────────────────────────────────────────────── */
const NavBar = ({ page, setPage, filter, setFilter }) => {
  const [hov, setHov] = useState(null);

  const navItems = [
    { key: "home",        label: "All Logs" },
    { key: "releases",    label: "Releases",     accent: D.release.main },
    { key: "deprecated",  label: "Deprecated",   accent: D.deprecated.main },
    { key: "improvements",label: "Improvements", accent: D.improvement.main },
  ];

  return (
    <nav style={{ position: "sticky", top: 0, zIndex: 100, background: `${D.deep}ee`, backdropFilter: "blur(16px)", borderBottom: `1px solid ${D.b1}` }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", height: 56, gap: 4 }}>
        {/* Logo */}
        <div onClick={() => { setPage("home"); setFilter("all"); }} style={{ display: "flex", alignItems: "center", gap: 9, marginRight: 20, cursor: "pointer" }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: `linear-gradient(135deg, ${D.purple}, ${D.teal})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, color: "white" }}>CJ</div>
          <div>
            <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 14, color: D.t1 }}>Code</span>
            <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 14, color: D.teal }}>Journey</span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: D.t3, marginLeft: 6 }}>Logs</span>
          </div>
        </div>

        {/* Nav Items */}
        {navItems.map(item => {
          const isActive = page === item.key || (page === "home" && item.key === "home");
          const acc = item.accent || D.purple;
          return (
            <button key={item.key}
              onClick={() => { setPage(item.key); if (item.key !== "home") setFilter(item.key === "releases" ? "release" : item.key === "deprecated" ? "deprecated" : "improvement"); else setFilter("all"); }}
              onMouseEnter={() => setHov(item.key)} onMouseLeave={() => setHov(null)}
              style={{ padding: "5px 13px", borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: "pointer", border: "none", background: isActive ? `${acc}18` : hov === item.key ? D.hover : "transparent", color: isActive ? acc : hov === item.key ? D.t1 : D.t2, fontFamily: "'Syne', sans-serif", transition: "all 0.15s", display: "flex", alignItems: "center", gap: 5, letterSpacing: "0.2px" }}>
              {item.key !== "home" && <span style={{ width: 6, height: 6, borderRadius: "50%", background: isActive ? acc : "transparent", border: `1.5px solid ${isActive ? acc : D.t4}`, flexShrink: 0, transition: "all 0.15s" }} />}
              {item.label}
            </button>
          );
        })}

        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ fontSize: 11, color: D.t3, fontFamily: "'JetBrains Mono', monospace", padding: "4px 10px", background: D.panel, borderRadius: 5, border: `1px solid ${D.b1}` }}>
            {LOGS.length} logs
          </div>
        </div>
      </div>
    </nav>
  );
};

/* ─────────────────────────────────────────────────────────────
   LOG CARD — listing item
───────────────────────────────────────────────────────────── */
const LogCard = ({ log, onClick, index }) => {
  const [hov, setHov] = useState(false);
  const m = TYPE_META[log.type];

  return (
    <div
      onClick={() => onClick(log)}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? D.hover : D.surface,
        border: `1px solid ${hov ? m.color.border : D.b1}`,
        borderRadius: 12,
        padding: "20px 22px",
        cursor: "pointer",
        transition: "all 0.18s cubic-bezier(0.4,0,0.2,1)",
        position: "relative",
        overflow: "hidden",
        animation: `cjFadeUp 0.4s ease ${index * 60}ms both`,
        boxShadow: hov ? `0 0 0 1px ${m.color.border}, 0 8px 32px ${m.color.glow}` : "none",
      }}>
      {/* Left accent line */}
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, background: hov ? m.color.main : "transparent", borderRadius: "12px 0 0 12px", transition: "background 0.18s" }} />

      <div style={{ paddingLeft: 4 }}>
        {/* Top row */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10, flexWrap: "wrap" }}>
          <TypeBadge type={log.type} small />
          {log.status && <StatusBadge status={log.status} />}
          <VersionPill version={log.version} accent={m.color.main} />
          <span style={{ fontSize: 11.5, color: D.t3, fontFamily: "'JetBrains Mono', monospace", marginLeft: "auto" }}>{relativeDate(log.date)}</span>
        </div>

        {/* Title */}
        <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 17, color: hov ? D.t1 : D.t1, marginBottom: 6, lineHeight: 1.3, letterSpacing: "-0.2px" }}>
          {log.title}
        </div>

        {/* Summary */}
        <div style={{ fontSize: 13.5, color: D.t2, lineHeight: 1.65, marginBottom: 14 }}>
          {log.summary}
        </div>

        {/* Footer */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <Avatar initials={log.author.initials} size={24} accent={m.color.main} />
          <span style={{ fontSize: 12, color: D.t3, fontFamily: "'Syne', sans-serif", fontWeight: 500 }}>{log.author.name}</span>
          <span style={{ fontSize: 11, color: D.t4 }}>·</span>
          <span style={{ fontSize: 11.5, color: D.t3, fontFamily: "'JetBrains Mono', monospace" }}>{formatDate(log.date)}</span>
          <span style={{ fontSize: 11, color: D.t4 }}>·</span>
          <span style={{ fontSize: 11.5, color: D.t3 }}>{log.readTime} read</span>
          <div style={{ marginLeft: "auto", display: "flex", gap: 5, flexWrap: "wrap" }}>
            {log.tags.slice(0, 3).map(t => <Tag key={t} label={t} />)}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   TIMELINE DOT
───────────────────────────────────────────────────────────── */
const TimelineDot = ({ type }) => {
  const m = TYPE_META[type];
  return (
    <div style={{ width: 10, height: 10, borderRadius: "50%", background: m.color.main, boxShadow: `0 0 0 3px ${m.color.dim}`, flexShrink: 0, marginTop: 6 }} />
  );
};

/* ─────────────────────────────────────────────────────────────
   HOME PAGE — All Logs Listing
───────────────────────────────────────────────────────────── */
const HomePage = ({ logs, onOpen, filter }) => {
  const filtered = filter === "all" ? logs : logs.filter(l => l.type === filter);
  const byDate = {};
  filtered.forEach(log => {
    const month = new Date(log.date).toLocaleDateString("en-IN", { month: "long", year: "numeric" });
    if (!byDate[month]) byDate[month] = [];
    byDate[month].push(log);
  });

  return (
    <div style={{ maxWidth: 820, margin: "0 auto", padding: "48px 24px 80px" }}>
      {/* Hero */}
      <div style={{ marginBottom: 48, animation: "cjFadeUp 0.5s ease both" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <div style={{ height: 1, flex: 1, background: `linear-gradient(to right, ${D.b2}, transparent)` }} />
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: D.t3, fontFamily: "'JetBrains Mono', monospace" }}>Changelog</span>
          <div style={{ height: 1, flex: 1, background: `linear-gradient(to left, ${D.b2}, transparent)` }} />
        </div>
        <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 38, color: D.t1, lineHeight: 1.15, marginBottom: 10, letterSpacing: "-0.5px" }}>
          Code Journey <span style={{ color: D.teal }}>Logs</span>
        </h1>
        <p style={{ fontSize: 15, color: D.t2, lineHeight: 1.7, maxWidth: 560 }}>
          Every release, deprecation and improvement — documented in full. Stay up to date with what's shipping, what's changing and what's going away.
        </p>

        {/* Stats row */}
        <div style={{ display: "flex", gap: 12, marginTop: 24, flexWrap: "wrap" }}>
          {[
            { label: "Releases",     count: LOGS.filter(l => l.type === "release").length,     color: D.release.main,     dim: D.release.dim,    border: D.release.border },
            { label: "Deprecated",   count: LOGS.filter(l => l.type === "deprecated").length,  color: D.deprecated.main,  dim: D.deprecated.dim,  border: D.deprecated.border },
            { label: "Improvements", count: LOGS.filter(l => l.type === "improvement").length, color: D.improvement.main, dim: D.improvement.dim, border: D.improvement.border },
          ].map(s => (
            <div key={s.label} style={{ padding: "10px 16px", borderRadius: 8, background: s.dim, border: `1px solid ${s.border}`, display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 22, color: s.color }}>{s.count}</span>
              <span style={{ fontSize: 12, color: s.color, fontWeight: 600, opacity: 0.8 }}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Timeline */}
      {Object.entries(byDate).map(([month, entries], gi) => (
        <div key={month} style={{ marginBottom: 40 }}>
          {/* Month label */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase", color: D.t3 }}>{month}</span>
            <div style={{ flex: 1, height: 1, background: D.b1 }} />
          </div>

          {/* Timeline entries */}
          <div style={{ display: "flex", gap: 0 }}>
            {/* Vertical line */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 24, marginRight: 16, flexShrink: 0 }}>
              <div style={{ width: 1, flex: 1, background: D.b2 }} />
            </div>

            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
              {entries.map((log, i) => (
                <div key={log.id} style={{ display: "flex", gap: 0 }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 0, marginLeft: -28, marginRight: 20, flexShrink: 0, paddingTop: 24 }}>
                    <TimelineDot type={log.type} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <LogCard log={log} onClick={onOpen} index={gi * 10 + i} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}

      {filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "60px 0", color: D.t3, fontFamily: "'Syne', sans-serif" }}>
          No logs found.
        </div>
      )}
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   CATEGORY PAGE — filtered list
───────────────────────────────────────────────────────────── */
const CategoryPage = ({ type, logs, onOpen }) => {
  const m = TYPE_META[type];
  const filtered = logs.filter(l => l.type === type);
  const descriptions = {
    release:     "Every new feature, language support addition and platform update shipped to Code Journey users.",
    deprecated:  "APIs, features and behaviours scheduled for removal. Check migration guides and sunset timelines.",
    improvement: "Performance gains, UX refinements and quality-of-life upgrades across the platform.",
  };

  return (
    <div style={{ maxWidth: 820, margin: "0 auto", padding: "48px 24px 80px" }}>
      {/* Category Hero */}
      <div style={{ marginBottom: 44, animation: "cjFadeUp 0.4s ease both" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 12px", borderRadius: 100, background: m.color.dim, border: `1px solid ${m.color.border}`, marginBottom: 14 }}>
          <span style={{ fontSize: 13 }}>{m.icon}</span>
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: m.color.main, fontFamily: "'Syne', sans-serif" }}>{m.label}s</span>
        </div>
        <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 34, color: D.t1, lineHeight: 1.2, marginBottom: 10, letterSpacing: "-0.4px" }}>
          {type === "release" ? "New Releases" : type === "deprecated" ? "Deprecated Features" : "Improvements"}
        </h1>
        <p style={{ fontSize: 14.5, color: D.t2, lineHeight: 1.7, maxWidth: 540 }}>{descriptions[type]}</p>
        <div style={{ marginTop: 12, fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: D.t3 }}>
          {filtered.length} {m.label.toLowerCase()}s total
        </div>

        {/* Accent rule */}
        <div style={{ height: 2, width: 48, background: m.color.main, borderRadius: 2, marginTop: 18, opacity: 0.7 }} />
      </div>

      {/* Cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {filtered.map((log, i) => <LogCard key={log.id} log={log} onClick={onOpen} index={i} />)}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   BLOG DETAIL PAGE — themed
───────────────────────────────────────────────────────────── */
const BlogPage = ({ log, onBack }) => {
  const m = TYPE_META[log.type];
  const th = m.theme;
  const scrollRef = useRef(null);
  const [scrollPct, setScrollPct] = useState(0);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      const pct = el.scrollTop / (el.scrollHeight - el.clientHeight);
      setScrollPct(Math.min(1, pct));
    };
    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const changelogColors = {
    "Added":       { bg: "#f0fdf4", color: "#15803d", border: "#86efac" },
    "Improved":    { bg: "#eff6ff", color: "#1d4ed8", border: "#93c5fd" },
    "Fixed":       { bg: "#fff7ed", color: "#c2410c", border: "#fed7aa" },
    "Deprecated":  { bg: "#fff1f2", color: "#b91c1c", border: "#fca5a5" },
    "Removed":     { bg: "#fafafa", color: "#374151", border: "#d1d5db" },
    "Replacement": { bg: "#f5f3ff", color: "#6d28d9", border: "#c4b5fd" },
    "Migrated":    { bg: "#ecfdf5", color: "#065f46", border: "#6ee7b7" },
    "Technique":   { bg: "#f0f9ff", color: "#075985", border: "#7dd3fc" },
  };

  return (
    <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", background: th.bg }}>
      {/* Progress bar */}
      <div style={{ position: "fixed", top: 56, left: 0, right: 0, height: 2, background: `${th.border}`, zIndex: 200 }}>
        <div style={{ height: "100%", background: th.accent, width: `${scrollPct * 100}%`, transition: "width 0.1s linear", borderRadius: "0 2px 2px 0" }} />
      </div>

      {/* Back nav */}
      <div style={{ background: `${th.surface}`, borderBottom: `1px solid ${th.border}`, padding: "0 24px", position: "sticky", top: 0, zIndex: 90 }}>
        <div style={{ maxWidth: 800, margin: "0 auto", display: "flex", alignItems: "center", height: 46, gap: 12 }}>
          <button onClick={onBack} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12.5, fontWeight: 600, color: th.text3, background: th.accentDim, border: `1px solid ${th.border}`, borderRadius: 6, padding: "5px 12px", cursor: "pointer", fontFamily: "'Syne', sans-serif", transition: "all 0.15s" }}>
            ← Back to Logs
          </button>
          <div style={{ height: 16, width: 1, background: th.border }} />
          <span style={{ fontSize: 12, color: th.muted, fontFamily: "'JetBrains Mono', monospace" }}>/{log.type}s/{log.id}</span>
          <div style={{ marginLeft: "auto" }}>
            <TypeBadge type={log.type} small />
          </div>
        </div>
      </div>

      {/* Hero */}
      <div style={{ background: `linear-gradient(180deg, ${th.accentDim} 0%, ${th.bg} 100%)`, borderBottom: `1px solid ${th.border}`, padding: "52px 24px 44px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", animation: "cjFadeUp 0.45s ease both" }}>
          {/* Meta top */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18, flexWrap: "wrap" }}>
            <TypeBadge type={log.type} />
            {log.status && <StatusBadge status={log.status} />}
            <span style={{ padding: "3px 10px", borderRadius: 5, fontSize: 11.5, fontWeight: 600, background: th.accentDim, color: th.accent, border: `1px solid ${th.border}`, fontFamily: "'JetBrains Mono', monospace" }}>{log.version}</span>
          </div>

          {/* Headline */}
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 36, color: th.text, lineHeight: 1.15, marginBottom: 12, letterSpacing: "-0.5px", maxWidth: 660 }}>
            {log.content.headline}
          </h1>

          {/* Intro */}
          <p style={{ fontFamily: "'Instrument Serif', serif", fontStyle: "italic", fontSize: 18, color: th.text2, lineHeight: 1.75, maxWidth: 620, marginBottom: 24 }}>
            {log.content.intro}
          </p>

          {/* Author & meta */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <Avatar initials={log.author.initials} size={32} accent={th.accent} />
            <div>
              <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 600, fontSize: 13, color: th.text }}>{log.author.name}</div>
              <div style={{ fontSize: 11.5, color: th.muted, fontFamily: "'JetBrains Mono', monospace" }}>{formatDate(log.date)} · {log.readTime} read</div>
            </div>
            <div style={{ marginLeft: "auto", display: "flex", gap: 5, flexWrap: "wrap" }}>
              {log.tags.map(t => (
                <span key={t} style={{ padding: "2px 9px", borderRadius: 4, fontSize: 10.5, fontWeight: 600, background: th.accentDim, color: th.accent, border: `1px solid ${th.border}`, fontFamily: "'JetBrains Mono', monospace" }}>#{t}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Article Body */}
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "44px 24px 80px" }}>
        <div style={{ display: "flex", gap: 48, alignItems: "flex-start" }}>
          {/* Main content */}
          <div style={{ flex: 1 }}>
            {log.content.sections.map((sec, i) => (
              <div key={i} style={{ marginBottom: 36, animation: `cjFadeUp 0.4s ease ${i * 80 + 100}ms both` }}>
                {/* Section heading with accent */}
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                  <div style={{ width: 3, height: 20, background: th.accent, borderRadius: 2, flexShrink: 0 }} />
                  <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 19, color: th.text, letterSpacing: "-0.2px" }}>
                    {sec.heading}
                  </h2>
                </div>
                <p style={{ fontSize: 15, color: th.text2, lineHeight: 1.8, paddingLeft: 13 }}>
                  {sec.body}
                </p>
              </div>
            ))}

            {/* Changelog block */}
            {log.content.changelog && (
              <div style={{ marginTop: 44 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
                  <div style={{ height: 1, flex: 1, background: th.border }} />
                  <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: th.muted, fontFamily: "'JetBrains Mono', monospace" }}>Changelog</span>
                  <div style={{ height: 1, flex: 1, background: th.border }} />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {log.content.changelog.map((section, si) => {
                    const clr = changelogColors[section.label] || changelogColors["Added"];
                    return (
                      <div key={si} style={{ background: clr.bg, border: `1px solid ${clr.border}`, borderRadius: 10, padding: "14px 16px" }}>
                        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: clr.color, marginBottom: 10 }}>{section.label}</div>
                        <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 6 }}>
                          {section.items.map((item, ii) => (
                            <li key={ii} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                              <span style={{ color: clr.color, fontWeight: 700, fontSize: 13, marginTop: 1, flexShrink: 0 }}>+</span>
                              <span style={{ fontSize: 13, color: "#374151", fontFamily: "'JetBrains Mono', monospace", lineHeight: 1.55 }}>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Sticky sidebar — On this page */}
          <div style={{ width: 200, flexShrink: 0, position: "sticky", top: 100 }}>
            <div style={{ background: th.surface, border: `1px solid ${th.border}`, borderRadius: 10, padding: "14px 16px" }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: th.muted, fontFamily: "'JetBrains Mono', monospace", marginBottom: 12 }}>On This Page</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {log.content.sections.map((sec, i) => (
                  <div key={i} style={{ fontSize: 12.5, color: th.text3, fontFamily: "'Syne', sans-serif", fontWeight: 500, lineHeight: 1.4, display: "flex", alignItems: "flex-start", gap: 6, cursor: "pointer" }}>
                    <span style={{ color: th.accent, fontSize: 10, marginTop: 3 }}>▸</span>
                    {sec.heading}
                  </div>
                ))}
                {log.content.changelog && (
                  <div style={{ fontSize: 12.5, color: th.text3, fontFamily: "'Syne', sans-serif", fontWeight: 500, display: "flex", alignItems: "flex-start", gap: 6, cursor: "pointer" }}>
                    <span style={{ color: th.accent, fontSize: 10, marginTop: 3 }}>▸</span>
                    Changelog
                  </div>
                )}
              </div>

              {/* Version info */}
              <div style={{ marginTop: 16, paddingTop: 14, borderTop: `1px solid ${th.border}` }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: th.muted, fontFamily: "'JetBrains Mono', monospace", marginBottom: 8 }}>Version</div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 600, color: th.accent }}>{log.version}</div>
                <div style={{ fontSize: 11, color: th.muted, marginTop: 2 }}>{formatDate(log.date)}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer nav */}
        <div style={{ marginTop: 56, paddingTop: 24, borderTop: `1px solid ${th.border}`, display: "flex", justifyContent: "center" }}>
          <button onClick={onBack} style={{ display: "flex", alignItems: "center", gap: 7, padding: "10px 22px", borderRadius: 8, fontSize: 13.5, fontWeight: 700, cursor: "pointer", background: th.accent, color: "white", border: "none", fontFamily: "'Syne', sans-serif", transition: "all 0.18s", letterSpacing: "0.2px", boxShadow: `0 4px 20px ${th.accent}40` }}>
            ← Back to Logs
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   FOOTER
───────────────────────────────────────────────────────────── */
const Footer = () => (
  <div style={{ borderTop: `1px solid ${D.b1}`, background: D.deep, padding: "20px 24px", textAlign: "center" }}>
    <div style={{ maxWidth: 820, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <div style={{ width: 20, height: 20, borderRadius: 5, background: `linear-gradient(135deg, ${D.purple}, ${D.teal})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 800, color: "white" }}>CJ</div>
        <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 600, fontSize: 12, color: D.t3 }}>Code Journey · Logs</span>
      </div>
      <div style={{ display: "flex", gap: 16 }}>
        {[
          { dot: D.release.main,     label: `${LOGS.filter(l=>l.type==="release").length} Releases` },
          { dot: D.deprecated.main,  label: `${LOGS.filter(l=>l.type==="deprecated").length} Deprecated` },
          { dot: D.improvement.main, label: `${LOGS.filter(l=>l.type==="improvement").length} Improvements` },
        ].map(s => (
          <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: D.t3, fontFamily: "'JetBrains Mono', monospace" }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: s.dot }} />
            {s.label}
          </div>
        ))}
      </div>
    </div>
  </div>
);

/* ─────────────────────────────────────────────────────────────
   ROOT APP
───────────────────────────────────────────────────────────── */
export default function CJLogs() {
  const [page, setPage]       = useState("home");
  const [filter, setFilter]   = useState("all");
  const [openLog, setOpenLog] = useState(null);

  const handleOpen = (log) => {
    setOpenLog(log);
    setPage("detail");
  };

  const handleBack = () => {
    setOpenLog(null);
    setPage(filter === "all" ? "home" : filter === "release" ? "releases" : filter === "deprecated" ? "deprecated" : "improvements");
  };

  const isDetail = page === "detail" && openLog;

  return (
    <>
      <GlobalStyles />
      <div style={{ display: "flex", flexDirection: "column", width: "100%", height: "100vh", background: D.deep, fontFamily: "'Syne', sans-serif", color: D.t1, overflow: "hidden" }}>

        {/* NavBar always visible */}
        <NavBar page={page} setPage={setPage} filter={filter} setFilter={setFilter} />

        {/* Scrollable content area */}
        <div style={{ flex: 1, overflowY: isDetail ? "hidden" : "auto", overflowX: "hidden", position: "relative" }}>

          {/* Detail page is self-scrolling */}
          {isDetail && (
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column" }}>
              <BlogPage log={openLog} onBack={handleBack} />
            </div>
          )}

          {/* List pages */}
          {!isDetail && (
            <>
              {(page === "home") && (
                <HomePage logs={LOGS} onOpen={handleOpen} filter={filter} />
              )}
              {page === "releases" && (
                <CategoryPage type="release" logs={LOGS} onOpen={handleOpen} />
              )}
              {page === "deprecated" && (
                <CategoryPage type="deprecated" logs={LOGS} onOpen={handleOpen} />
              )}
              {page === "improvements" && (
                <CategoryPage type="improvement" logs={LOGS} onOpen={handleOpen} />
              )}
            </>
          )}
        </div>

        {/* Footer only on list pages */}
        {!isDetail && <Footer />}
      </div>
    </>
  );
}