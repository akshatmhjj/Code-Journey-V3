import { useState, useRef, useEffect, useCallback } from "react";

/* ══════════════════════════════════════════════════════════════
   GLOBAL STYLES  — scrollbar colour driven by current theme
══════════════════════════════════════════════════════════════ */
const GlobalStyles = ({ isDark }) => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,300;0,400;0,500;0,600;1,400&family=Syne:wght@400;500;600;700;800&family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }

    @keyframes cjUp      { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
    @keyframes cjIn      { from{opacity:0} to{opacity:1} }
    @keyframes cjDotPulse{ 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.7;transform:scale(1.2)} }

    ::-webkit-scrollbar { width:4px; height:4px; }
    ::-webkit-scrollbar-track { background:transparent; }
    ::-webkit-scrollbar-thumb { background:${isDark ? "#232844" : "#d1d5db"}; border-radius:3px; }
    ::selection { background:rgba(124,110,224,0.28); }

    @media (max-width: 640px) {
      .cj-hero-title   { font-size: 28px !important; }
      .cj-blog-title   { font-size: 24px !important; }
      .cj-blog-intro   { font-size: 16px !important; }
      .cj-section-body { font-size: 15.5px !important; }
      .cj-section-head { font-size: 19px !important; }
      .cj-card-title   { font-size: 15px !important; }
      .cj-card-summary { font-size: 13px !important; }
    }
  `}</style>
);

/* ══════════════════════════════════════════════════════════════
   THEME — driven by localStorage["cj-theme"] set in Profile
   The same 5-key map used across all CJ pages.
   isDark is derived from the stored key (cosmos/void/aurora/nord = dark, light = light).
══════════════════════════════════════════════════════════════ */
const DARK_KEYS = new Set(["cosmos", "void", "aurora", "nord"]);

const getStoredKey = () => {
  try { return localStorage.getItem("cj-theme") || "cosmos"; }
  catch { return "cosmos"; }
};

/* Accent palettes vary slightly per stored theme to honour the chosen palette */
const ACCENT_OVERRIDES = {
  cosmos: { purple: "#7c6ee0", teal: "#5eead4" },
  void:   { purple: "#8b7ff0", teal: "#2dd4bf" },
  aurora: { purple: "#2dd4bf", teal: "#5eead4" },
  nord:   { purple: "#88c0d0", teal: "#8fbcbb" },
  light:  { purple: "#6256d0", teal: "#0d9488" },
};

const makeTheme = (dark, key = "cosmos") => {
  const { purple, teal } = ACCENT_OVERRIDES[key] || ACCENT_OVERRIDES.cosmos;

  const base = dark ? {
    shell:"#07080d", deep:"#0d0f1a", mid:"#111420", surface:"#161927",
    panel:"#1a1e2e", hover:"#1e2335", active:"#252b42",
    card:"#161927", cardHov:"#1c2235",
    t1:"#e8eaf2", t2:"#8892b0", t3:"#5a6488", t4:"#2e3660",
    b1:"rgba(120,130,180,0.08)", b2:"rgba(120,130,180,0.15)", b3:"rgba(120,130,180,0.24)",
    changelogLabel:"#9ba3c2",
  } : {
    shell:"#f3f4f8", deep:"#ffffff", mid:"#f0f1f7", surface:"#ffffff",
    panel:"#f7f8fc", hover:"#eef0f8", active:"#e5e8f5",
    card:"#ffffff", cardHov:"#f5f6fc",
    t1:"#111827", t2:"#4b5680", t3:"#7c87a8", t4:"#c5ccdf",
    b1:"rgba(80,90,150,0.08)", b2:"rgba(80,90,150,0.15)", b3:"rgba(80,90,150,0.24)",
    changelogLabel:"#6b7a9e",
  };

  const accents = dark ? {
    release:     { main:"#22c55e", soft:"rgba(34,197,94,0.1)",   border:"rgba(34,197,94,0.22)",   glow:"rgba(34,197,94,0.06)"   },
    deprecated:  { main:"#f87171", soft:"rgba(248,113,113,0.1)", border:"rgba(248,113,113,0.22)", glow:"rgba(248,113,113,0.06)" },
    improvement: { main:"#60a5fa", soft:"rgba(96,165,250,0.1)",  border:"rgba(96,165,250,0.22)",  glow:"rgba(96,165,250,0.06)"  },
  } : {
    release:     { main:"#16a34a", soft:"rgba(22,163,74,0.09)",  border:"rgba(22,163,74,0.22)",   glow:"rgba(22,163,74,0.04)"   },
    deprecated:  { main:"#dc2626", soft:"rgba(220,38,38,0.09)",  border:"rgba(220,38,38,0.22)",   glow:"rgba(220,38,38,0.04)"   },
    improvement: { main:"#1d4ed8", soft:"rgba(29,78,216,0.09)",  border:"rgba(29,78,216,0.22)",   glow:"rgba(29,78,216,0.04)"   },
  };

  const blogs = dark ? {
    blogRelease: {
      bg:"#061410", border:"rgba(34,197,94,0.18)", accent:"#22c55e",
      accentSoft:"rgba(34,197,94,0.08)",
      heroGrad:"linear-gradient(180deg,rgba(34,197,94,0.1) 0%,transparent 100%)",
      headText:"#d1fae5", bodyText:"#7db89a", mutedText:"#2d6649",
      rulerColor:"rgba(34,197,94,0.14)",
      tagBg:"rgba(34,197,94,0.1)", tagColor:"#22c55e", tagBorder:"rgba(34,197,94,0.22)",
      sidebarBg:"#0a1c16", sidebarBorder:"rgba(34,197,94,0.15)",
      tocActive:"#22c55e", tocActiveBg:"rgba(34,197,94,0.1)",
    },
    blogDeprecated: {
      bg:"#130708", border:"rgba(248,113,113,0.18)", accent:"#f87171",
      accentSoft:"rgba(248,113,113,0.08)",
      heroGrad:"linear-gradient(180deg,rgba(248,113,113,0.1) 0%,transparent 100%)",
      headText:"#fee2e2", bodyText:"#b08080", mutedText:"#6b3535",
      rulerColor:"rgba(248,113,113,0.14)",
      tagBg:"rgba(248,113,113,0.1)", tagColor:"#f87171", tagBorder:"rgba(248,113,113,0.22)",
      sidebarBg:"#1c0c0c", sidebarBorder:"rgba(248,113,113,0.15)",
      tocActive:"#f87171", tocActiveBg:"rgba(248,113,113,0.1)",
    },
    blogImprovement: {
      bg:"#050d1a", border:"rgba(96,165,250,0.18)", accent:"#60a5fa",
      accentSoft:"rgba(96,165,250,0.08)",
      heroGrad:"linear-gradient(180deg,rgba(96,165,250,0.1) 0%,transparent 100%)",
      headText:"#dbeafe", bodyText:"#6d96bb", mutedText:"#244f7a",
      rulerColor:"rgba(96,165,250,0.14)",
      tagBg:"rgba(96,165,250,0.1)", tagColor:"#60a5fa", tagBorder:"rgba(96,165,250,0.22)",
      sidebarBg:"#0a1525", sidebarBorder:"rgba(96,165,250,0.15)",
      tocActive:"#60a5fa", tocActiveBg:"rgba(96,165,250,0.1)",
    },
  } : {
    blogRelease: {
      bg:"#f0fdf4", border:"#bbf7d0", accent:"#16a34a",
      accentSoft:"rgba(22,163,74,0.07)",
      heroGrad:"linear-gradient(180deg,#dcfce7 0%,#f0fdf4 100%)",
      headText:"#14532d", bodyText:"#1e5c38", mutedText:"#4b7a58",
      rulerColor:"#bbf7d0",
      tagBg:"rgba(22,163,74,0.09)", tagColor:"#15803d", tagBorder:"#86efac",
      sidebarBg:"#ecfdf5", sidebarBorder:"#bbf7d0",
      tocActive:"#16a34a", tocActiveBg:"rgba(22,163,74,0.09)",
    },
    blogDeprecated: {
      bg:"#fff1f2", border:"#fecaca", accent:"#dc2626",
      accentSoft:"rgba(220,38,38,0.07)",
      heroGrad:"linear-gradient(180deg,#fee2e2 0%,#fff1f2 100%)",
      headText:"#450a0a", bodyText:"#7f1d1d", mutedText:"#7a4040",
      rulerColor:"#fecaca",
      tagBg:"rgba(220,38,38,0.08)", tagColor:"#b91c1c", tagBorder:"#fca5a5",
      sidebarBg:"#fff5f5", sidebarBorder:"#fecaca",
      tocActive:"#dc2626", tocActiveBg:"rgba(220,38,38,0.08)",
    },
    blogImprovement: {
      bg:"#eff6ff", border:"#bfdbfe", accent:"#1d4ed8",
      accentSoft:"rgba(29,78,216,0.07)",
      heroGrad:"linear-gradient(180deg,#dbeafe 0%,#eff6ff 100%)",
      headText:"#0c1b4d", bodyText:"#1e3a5f", mutedText:"#3a5280",
      rulerColor:"#bfdbfe",
      tagBg:"rgba(29,78,216,0.08)", tagColor:"#1d4ed8", tagBorder:"#93c5fd",
      sidebarBg:"#eff6ff", sidebarBorder:"#bfdbfe",
      tocActive:"#1d4ed8", tocActiveBg:"rgba(29,78,216,0.08)",
    },
  };

  return { ...base, purple, teal, ...accents, ...blogs };
};

const blogKey = (t) => `blog${t[0].toUpperCase()}${t.slice(1)}`;

/* ══════════════════════════════════════════════════════════════
   CHANGELOG PALETTES
══════════════════════════════════════════════════════════════ */
const CL_LIGHT = {
  Added:       { bg:"#f0fdf4", color:"#15803d", border:"#86efac" },
  Improved:    { bg:"#eff6ff", color:"#1d4ed8", border:"#93c5fd" },
  Fixed:       { bg:"#fff7ed", color:"#c2410c", border:"#fed7aa" },
  Deprecated:  { bg:"#fff1f2", color:"#b91c1c", border:"#fca5a5" },
  Removed:     { bg:"#f8fafc", color:"#475569", border:"#cbd5e1" },
  Replacement: { bg:"#f5f3ff", color:"#6d28d9", border:"#c4b5fd" },
  Migrated:    { bg:"#ecfdf5", color:"#065f46", border:"#6ee7b7" },
  Technique:   { bg:"#f0f9ff", color:"#075985", border:"#7dd3fc" },
};
const CL_DARK = {
  Added:       { bg:"rgba(34,197,94,0.09)",   color:"#4ade80", border:"rgba(34,197,94,0.22)"   },
  Improved:    { bg:"rgba(96,165,250,0.09)",  color:"#60a5fa", border:"rgba(96,165,250,0.22)"  },
  Fixed:       { bg:"rgba(251,146,60,0.09)",  color:"#fb923c", border:"rgba(251,146,60,0.22)"  },
  Deprecated:  { bg:"rgba(248,113,113,0.09)", color:"#f87171", border:"rgba(248,113,113,0.22)" },
  Removed:     { bg:"rgba(148,163,184,0.09)", color:"#94a3b8", border:"rgba(148,163,184,0.22)" },
  Replacement: { bg:"rgba(167,139,250,0.09)", color:"#a78bfa", border:"rgba(167,139,250,0.22)" },
  Migrated:    { bg:"rgba(52,211,153,0.09)",  color:"#34d399", border:"rgba(52,211,153,0.22)"  },
  Technique:   { bg:"rgba(56,189,248,0.09)",  color:"#38bdf8", border:"rgba(56,189,248,0.22)"  },
};

/* ══════════════════════════════════════════════════════════════
   DATA  (user-provided, unchanged)
══════════════════════════════════════════════════════════════ */
const LOGS = [
  {
    id:"r-003.1", type:"release", version:"v3.0.0",
    title:"Channel Logs Page", date:"2026-03-29",
    summary:"A centralized system to track all platform activities including releases, improvements, and deprecations in a structured and transparent way.",
    tags:["logs","tracking","platform"], readTime:"2 min",
    content:{
      headline:"One Timeline for Everything Happening on Code Journey",
      intro:"With the growing complexity of Code Journey, users needed a clear way to understand what's changing across the platform. The Channel Logs page solves this by acting as a living timeline of all system activity — from new features to removed systems — all in one place.",
      sections:[
        { id:"s-r3-1", heading:"Centralized Activity Tracking", body:"Every update is now categorized into Releases, Improvements, and Deprecations, ensuring users can easily differentiate between new features, upgrades, and removed functionality without confusion." },
        { id:"s-r3-2", heading:"Structured & Scalable Format",  body:"Logs are designed in a modular structure with summaries, detailed breakdowns, and changelogs — making it scalable as the platform evolves into multiple domains and systems." },
        { id:"s-r3-3", heading:"User Transparency",             body:"Instead of hidden updates, users now get full visibility into what changed, why it changed, and how it impacts their experience — building trust and clarity." },
      ],
      changelog:[{ label:"Added", items:["Dedicated Channel Logs page","Categorization (Release / Improvement / Deprecation)","Detailed structured log format","Timeline-based tracking system"] }],
    },
  },
  {
    id:"r-003.2", type:"release", version:"v3.0.0",
    title:"Multi-Language Code Runner", date:"2026-03-28",
    summary:"Execute multiple programming languages directly inside Code Journey using a sandboxed WebAssembly runtime with real-time output.",
    tags:["code-runner","wasm","execution"], readTime:"3 min",
    content:{
      headline:"Run Any Code — Instantly, Securely, Natively",
      intro:"One of the most requested features is now fully integrated: a multi-language execution engine that eliminates the need for local setup. Everything runs directly in-browser with performance and safety at its core.",
      sections:[
        { id:"s-r3-4", heading:"Multi-Language Runtime",       body:"The runtime supports JavaScript, TypeScript, Python, R, SQL, Dart, Kotlin, Rust, and HTML/CSS preview — allowing users to switch between languages without leaving the platform." },
        { id:"s-r3-5", heading:"WebAssembly Sandbox",          body:"Each execution runs inside an isolated WebAssembly container, ensuring complete separation between runs. No shared state, no persistence, and no risk of cross-user interference." },
        { id:"s-r3-6", heading:"Real-Time Output Streaming",   body:"Instead of waiting for execution to complete, stdout and stderr are streamed live into the terminal panel, creating a responsive coding experience similar to a local environment." },
        { id:"s-r3-7", heading:"Execution Constraints",        body:"To maintain system stability and fairness, each run enforces strict limits — 30-second execution time, 128MB memory cap, and zero external network access." },
      ],
      changelog:[{ label:"Added", items:["WebAssembly-based execution engine","Support for 9 programming languages","Live terminal output streaming","Execution history with replay","Keyboard shortcut (Ctrl/Cmd + Enter)"] }],
    },
  },
  {
    id:"i-003.1", type:"improvement", version:"v3.0.0",
    title:"CJ Editor Interface Upgrade", date:"2026-03-25",
    summary:"Shifted from a web-centric editor to a full multi-language development environment with improved UI and performance.",
    tags:["editor","ui","ide"], readTime:"1 min",
    content:{
      headline:"From Editor → Full Development Workspace",
      intro:"The CJ Editor has undergone a major transformation. What was once focused on web technologies is now a flexible, multi-language workspace designed to simulate real development environments.",
      sections:[
        { id:"s-i3-1", heading:"Multi-Language Shift",      body:"The editor now supports diverse programming environments, aligning with the platform's expansion beyond web development into a broader learning ecosystem." },
        { id:"s-i3-2", heading:"Hybrid UI Experience",      body:"The interface now blends patterns from multiple modern IDEs, creating a familiar yet unique experience optimized for both beginners and advanced users." },
        { id:"s-i3-3", heading:"Integrated Panels",         body:"Added terminal, console, problems, and output tabs below the editor — enabling users to write, run, debug, and analyze code in one place." },
        { id:"s-i3-4", heading:"Performance Enhancements",  body:"Improved load times and responsiveness using optimized bundling and background preloading strategies for execution engines." },
      ],
      changelog:[{ label:"Improved", items:["Editor UI redesign","Multi-language support","Integrated development panels","Faster startup and execution responsiveness"] }],
    },
  },
  {
    id:"i-003.3", type:"improvement", version:"v3.0.0",
    title:"Profile Section Redesign", date:"2026-04-02",
    summary:"Rebuilt profile experience with improved dashboard, task tracking, and theme customization.",
    tags:["profile","dashboard","ui"], readTime:"1 min",
    content:{
      headline:"A Cleaner, More Meaningful Profile Experience",
      intro:"The profile section has been redesigned to better reflect user progress and simplify interactions across different parts of the platform.",
      sections:[
        { id:"s-i3-5", heading:"Dashboard Restructure",  body:"Improved hierarchy and layout to highlight important user data such as progress, activity, and achievements." },
        { id:"s-i3-6", heading:"Tasks System Update",    body:"Tasks are now more interactive and easier to manage, allowing users to track their learning journey more efficiently." },
        { id:"s-i3-7", heading:"Theme Customization",    body:"Removed the old settings section and introduced a dedicated platform theme switching experience for personalization." },
      ],
      changelog:[{ label:"Improved", items:["Profile dashboard layout","Task interaction flow","Theme switching system"] }],
    },
  },
  {
    id:"i-003.4", type:"improvement", version:"v3.0.0",
    title:"Landing Page Revamp", date:"2026-04-03",
    summary:"Redesigned landing experience to better represent Code Journey as a multi-domain learning platform.",
    tags:["landing","ui","experience"], readTime:"1 min",
    content:{
      headline:"Beyond Web Development — A Broader Vision",
      intro:"The landing page now reflects the platform's evolution from a web-focused learning tool into a comprehensive, multi-domain ecosystem.",
      sections:[
        { id:"s-i3-8",  heading:"Removed Web-Centric Bias",    body:"Eliminated components that focused only on web development, making the platform more inclusive of different technologies and domains." },
        { id:"s-i3-9",  heading:"Quick Platform Insights",     body:"Added a section that quickly communicates what Code Journey offers, helping new users understand the platform instantly." },
        { id:"s-i3-10", heading:"Improved First Impression",   body:"Refined layout, messaging, and visual hierarchy to create a more immersive and engaging entry point." },
      ],
      changelog:[{ label:"Improved", items:["Landing page structure","Platform positioning clarity","User onboarding experience"] }],
    },
  },
  {
    id:"d-003.1", type:"deprecated", version:"v3.0.0",
    title:"Badges System (Temporary Removal)", date:"2026-04-01",
    summary:"Temporarily removed badges due to low engagement and lack of a strong progression system.",
    tags:["gamification","badges"], readTime:"1 min",
    content:{
      headline:"Rebuilding Gamification from the Ground Up",
      intro:"The existing badges system did not effectively motivate users or integrate well with the platform's progression model, leading to its temporary removal.",
      sections:[
        { id:"s-d3-1", heading:"Core Issues", body:"Low usage, unclear reward structure, and weak feedback loops reduced its overall impact on user motivation." },
        { id:"s-d3-2", heading:"What's Next",  body:"A redesigned gamification system is planned with better progression logic, meaningful rewards, and tighter integration with user activity." },
      ],
      changelog:[{ label:"Removed", items:["Badges system (temporary)"] }],
    },
  },
  {
    id:"d-003.2", type:"deprecated", version:"v3.0.0",
    title:"Legacy Editor Config API", date:"2026-03-28",
    summary:"Deprecated the global editor configuration system in favor of a modern lifecycle-safe API.",
    tags:["editor","api"], readTime:"1 min",
    content:{
      headline:"From Global Hacks → Structured Configuration",
      intro:"The old global configuration approach introduced timing issues and lacked flexibility. It has now been replaced with a more robust and scalable solution.",
      sections:[
        { id:"s-d3-3", heading:"What Changed",            body:"window.__CJ_MONACO_CONFIG is replaced with CJEditor.configure(), allowing configuration updates at any point in the lifecycle." },
        { id:"s-d3-4", heading:"Why It Matters",          body:"Eliminates race conditions, improves reliability, and enables dynamic configuration updates." },
        { id:"s-d3-5", heading:"Migration Requirement",   body:"Developers must migrate to the new API before June 30, 2026, to avoid undefined behavior." },
      ],
      changelog:[
        { label:"Deprecated",  items:["window.__CJ_MONACO_CONFIG"] },
        { label:"Replacement", items:["CJEditor.configure()"] },
      ],
    },
  },
];

/* ══════════════════════════════════════════════════════════════
   HELPERS
══════════════════════════════════════════════════════════════ */
const fmt = (s) => new Date(s).toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" });
const rel = (s) => {
  const d = Math.floor((Date.now() - new Date(s)) / 86400000);
  if (d === 0) return "Today"; if (d === 1) return "Yesterday";
  if (d < 7)  return `${d}d ago`; if (d < 30) return `${Math.floor(d/7)}w ago`;
  return `${Math.floor(d/30)}mo ago`;
};
const TYPE_CFG = {
  release:     { label:"Release",     icon:"🚀" },
  deprecated:  { label:"Deprecated",  icon:"⚠️"  },
  improvement: { label:"Improvement", icon:"⚡" },
};
const STATUS_META = {
  "sunset-90d": { label:"Sunset · 90d", color:"#f97316", bg:"rgba(249,115,22,0.1)",  border:"rgba(249,115,22,0.24)"  },
  "sunset-60d": { label:"Sunset · 60d", color:"#ef4444", bg:"rgba(239,68,68,0.1)",   border:"rgba(239,68,68,0.24)"   },
  "removed":    { label:"Removed",      color:"#94a3b8", bg:"rgba(148,163,184,0.1)", border:"rgba(148,163,184,0.22)" },
};

/* ══════════════════════════════════════════════════════════════
   ATOMS
══════════════════════════════════════════════════════════════ */
const TypeBadge = ({ type, T, small }) => {
  const ac = T[type]; const cfg = TYPE_CFG[type];
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:4, padding:small?"2px 8px":"3px 10px", borderRadius:100, fontSize:small?9.5:10.5, fontWeight:700, letterSpacing:"0.6px", textTransform:"uppercase", background:ac.soft, color:ac.main, border:`1px solid ${ac.border}`, fontFamily:"'Syne',sans-serif", flexShrink:0, whiteSpace:"nowrap" }}>
      {cfg.icon} {cfg.label}
    </span>
  );
};

const StatusBadge = ({ status }) => {
  if (!status) return null;
  const s = STATUS_META[status];
  return (
    <span style={{ display:"inline-flex", alignItems:"center", padding:"2px 8px", borderRadius:4, fontSize:9.5, fontWeight:700, letterSpacing:"0.5px", background:s.bg, color:s.color, border:`1px solid ${s.border}`, fontFamily:"'JetBrains Mono',monospace", whiteSpace:"nowrap" }}>
      {s.label}
    </span>
  );
};

/* ══════════════════════════════════════════════════════════════
   SECTION TABS
   Theme toggle removed — theme is controlled from Profile > Settings.
   This bar now only has the four navigation tabs + entry count.
══════════════════════════════════════════════════════════════ */
const SectionTabs = ({ page, setPage, setFilter, T }) => {
  const [hov, setHov] = useState(null);
  const tabs = [
    { key:"home",         label:"All Logs",     filter:"all"        },
    { key:"releases",     label:"Releases",     filter:"release",      acc:T.release.main     },
    { key:"deprecated",   label:"Deprecated",   filter:"deprecated",   acc:T.deprecated.main  },
    { key:"improvements", label:"Improvements", filter:"improvement",  acc:T.improvement.main },
  ];
  return (
    <div style={{ background:T.deep, borderBottom:`1px solid ${T.b1}`, padding:"0 16px" }}>
      <div style={{ maxWidth:1000, margin:"0 auto", display:"flex", alignItems:"center", flexWrap:"wrap", gap:2, minHeight:44 }}>
        {/* Tab pills */}
        <div style={{ display:"flex", alignItems:"center", gap:2, flex:1, flexWrap:"wrap", paddingTop:4, paddingBottom:4 }}>
          {tabs.map(tab => {
            const isActive = page === tab.key;
            const acc = tab.acc || T.purple;
            return (
              <button key={tab.key}
                onClick={() => { setPage(tab.key); setFilter(tab.filter); }}
                onMouseEnter={() => setHov(tab.key)} onMouseLeave={() => setHov(null)}
                style={{ padding:"5px 13px", borderRadius:6, fontSize:12.5, fontWeight:600, cursor:"pointer", border:"none", background:isActive?`${acc}18`:hov===tab.key?T.hover:"transparent", color:isActive?acc:hov===tab.key?T.t1:T.t2, fontFamily:"'Syne',sans-serif", transition:"all 0.13s", letterSpacing:"0.1px", display:"flex", alignItems:"center", gap:5 }}>
                {tab.key !== "home" && <span style={{ width:5, height:5, borderRadius:"50%", background:isActive?acc:T.t4, transition:"background 0.13s", flexShrink:0 }} />}
                {tab.label}
              </button>
            );
          })}
        </div>
        {/* Entry count — right side */}
        <div style={{ display:"flex", alignItems:"center", paddingLeft:8 }}>
          <span style={{ fontSize:10.5, color:T.t3, fontFamily:"'JetBrains Mono',monospace", padding:"3px 8px", background:T.panel, borderRadius:5, border:`1px solid ${T.b1}`, whiteSpace:"nowrap" }}>
            {LOGS.length} entries
          </span>
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════
   LOG CARD
══════════════════════════════════════════════════════════════ */
const LogCard = ({ log, onClick, index, T }) => {
  const [hov, setHov] = useState(false);
  const ac = T[log.type];
  return (
    <div onClick={() => onClick(log)} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ background:hov?T.cardHov:T.card, border:`1px solid ${hov?ac.border:T.b1}`, borderRadius:12, padding:"18px 20px", cursor:"pointer", transition:"all 0.16s cubic-bezier(0.4,0,0.2,1)", position:"relative", overflow:"hidden", animation:`cjUp 0.35s ease ${index*45}ms both`, boxShadow:hov?`0 0 0 1px ${ac.border},0 4px 24px ${ac.glow}`:"none" }}>
      <div style={{ position:"absolute", left:0, top:0, bottom:0, width:3, background:hov?ac.main:"transparent", borderRadius:"12px 0 0 12px", transition:"background 0.16s" }} />
      <div style={{ paddingLeft:6 }}>
        <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:9, flexWrap:"wrap" }}>
          <TypeBadge type={log.type} T={T} small />
          {log.status && <StatusBadge status={log.status} />}
          <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10.5, fontWeight:600, color:ac.main, background:ac.soft, border:`1px solid ${ac.border}`, padding:"2px 7px", borderRadius:4 }}>{log.version}</span>
          <span style={{ fontSize:10.5, color:T.t3, fontFamily:"'JetBrains Mono',monospace", marginLeft:"auto", whiteSpace:"nowrap" }}>{rel(log.date)}</span>
        </div>
        <div className="cj-card-title" style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:16.5, color:T.t1, marginBottom:7, lineHeight:1.3, letterSpacing:"-0.15px" }}>{log.title}</div>
        <div className="cj-card-summary" style={{ fontFamily:"'Lora',serif", fontSize:13.5, color:T.t2, lineHeight:1.72, marginBottom:12 }}>{log.summary}</div>
        <div style={{ display:"flex", alignItems:"center", gap:7, flexWrap:"wrap" }}>
          <span style={{ fontSize:11, color:T.t3, fontFamily:"'JetBrains Mono',monospace" }}>{fmt(log.date)}</span>
          <span style={{ color:T.t4, fontSize:10 }}>·</span>
          <span style={{ fontSize:11, color:T.t3 }}>{log.readTime} read</span>
          <div style={{ marginLeft:"auto", display:"flex", gap:4, flexWrap:"wrap" }}>
            {log.tags.slice(0,3).map(t => <span key={t} style={{ padding:"2px 7px", borderRadius:4, fontSize:9.5, fontWeight:500, background:T.active, color:T.t3, border:`1px solid ${T.b2}`, fontFamily:"'JetBrains Mono',monospace" }}>#{t}</span>)}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════
   HOME PAGE
══════════════════════════════════════════════════════════════ */
const HomePage = ({ logs, onOpen, filter, T, isDark }) => {
  const filtered = filter === "all" ? logs : logs.filter(l => l.type === filter);
  const byDate = {};
  filtered.forEach(log => {
    const m = new Date(log.date).toLocaleDateString("en-IN", { month:"long", year:"numeric" });
    if (!byDate[m]) byDate[m] = [];
    byDate[m].push(log);
  });
  const sortedEntries = Object.entries(byDate).sort((a, b) => new Date(b[0]) - new Date(a[0]));
  const clLabelColor = isDark ? "#7c8bb5" : "#5a6488";

  return (
    <div style={{ maxWidth:800, margin:"0 auto", padding:"40px 16px 80px" }}>
      <div style={{ marginBottom:44, animation:"cjUp 0.45s ease both" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
          <div style={{ height:1, flex:1, background:`linear-gradient(to right,${T.b2},transparent)` }} />
          <span style={{ fontSize:11, fontWeight:700, letterSpacing:"2.5px", textTransform:"uppercase", color:clLabelColor, fontFamily:"'JetBrains Mono',monospace", background:T.panel, padding:"3px 12px", borderRadius:100, border:`1px solid ${T.b2}` }}>Changelog</span>
          <div style={{ height:1, flex:1, background:`linear-gradient(to left,${T.b2},transparent)` }} />
        </div>
        <h1 className="cj-hero-title" style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:38, color:T.t1, lineHeight:1.1, marginBottom:12, letterSpacing:"-0.6px" }}>
          Code Journey <span style={{ color:T.teal }}>Logs</span>
        </h1>
        <p style={{ fontFamily:"'Lora',serif", fontSize:16, color:T.t2, lineHeight:1.8, maxWidth:520 }}>
          Every release, deprecation notice and improvement — documented with full technical detail.
        </p>
        <div style={{ display:"flex", gap:8, marginTop:24, flexWrap:"wrap" }}>
          {[
            { label:"Releases",     count:LOGS.filter(l=>l.type==="release").length,     c:T.release     },
            { label:"Deprecated",   count:LOGS.filter(l=>l.type==="deprecated").length,  c:T.deprecated  },
            { label:"Improvements", count:LOGS.filter(l=>l.type==="improvement").length, c:T.improvement },
          ].map(s => (
            <div key={s.label} style={{ padding:"8px 14px", borderRadius:8, background:s.c.soft, border:`1px solid ${s.c.border}`, display:"flex", alignItems:"center", gap:8 }}>
              <span style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:22, color:s.c.main, lineHeight:1 }}>{s.count}</span>
              <span style={{ fontSize:11.5, color:s.c.main, fontWeight:600, opacity:0.8 }}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {sortedEntries.map(([month, entries], gi) => (
        <div key={month} style={{ marginBottom:40 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
            <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10, fontWeight:600, letterSpacing:"2px", textTransform:"uppercase", color:T.t3, flexShrink:0 }}>{month}</span>
            <div style={{ flex:1, height:1, background:T.b1 }} />
          </div>
          <div style={{ display:"flex" }}>
            <div style={{ width:18, marginRight:16, display:"flex", flexDirection:"column", alignItems:"center", flexShrink:0 }}>
              <div style={{ width:1, flex:1, background:T.b2 }} />
            </div>
            <div style={{ flex:1, display:"flex", flexDirection:"column", gap:10 }}>
              {entries.map((log, i) => {
                const ac = T[log.type];
                return (
                  <div key={log.id} style={{ display:"flex" }}>
                    <div style={{ marginLeft:-26, marginRight:18, paddingTop:22, flexShrink:0 }}>
                      <div style={{ width:9, height:9, borderRadius:"50%", background:ac.main, boxShadow:`0 0 0 3px ${ac.soft}`, animation:"cjDotPulse 3s ease-in-out infinite" }} />
                    </div>
                    <div style={{ flex:1 }}><LogCard log={log} onClick={onOpen} index={gi*10+i} T={T} /></div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ))}
      {filtered.length === 0 && <div style={{ textAlign:"center", padding:"60px 0", color:T.t3, fontFamily:"'Syne',sans-serif" }}>No logs found.</div>}
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════
   CATEGORY PAGE
══════════════════════════════════════════════════════════════ */
const CategoryPage = ({ type, logs, onOpen, T }) => {
  const cfg = TYPE_CFG[type]; const ac = T[type];
  const filtered = logs.filter(l => l.type === type);
  const descs = {
    release:     "Every new feature, language addition and platform update shipped to Code Journey users.",
    deprecated:  "APIs, features and behaviours scheduled for removal — with migration guides and sunset timelines.",
    improvement: "Performance gains, UX refinements and quality-of-life upgrades across the platform.",
  };
  return (
    <div style={{ maxWidth:800, margin:"0 auto", padding:"40px 16px 80px" }}>
      <div style={{ marginBottom:40, animation:"cjUp 0.4s ease both" }}>
        <div style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"3px 11px", borderRadius:100, background:ac.soft, border:`1px solid ${ac.border}`, marginBottom:12 }}>
          <span style={{ fontSize:12 }}>{cfg.icon}</span>
          <span style={{ fontSize:10.5, fontWeight:700, letterSpacing:"1px", textTransform:"uppercase", color:ac.main, fontFamily:"'Syne',sans-serif" }}>{cfg.label}s</span>
        </div>
        <h1 style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:32, color:T.t1, lineHeight:1.15, marginBottom:10, letterSpacing:"-0.4px" }}>
          {type==="release"?"New Releases":type==="deprecated"?"Deprecated Features":"Improvements"}
        </h1>
        <p style={{ fontFamily:"'Lora',serif", fontSize:15, color:T.t2, lineHeight:1.78, maxWidth:500 }}>{descs[type]}</p>
        <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:11, color:T.t3, marginTop:8 }}>{filtered.length} {cfg.label.toLowerCase()}s total</div>
        <div style={{ height:3, width:36, background:ac.main, borderRadius:2, marginTop:14, opacity:0.75 }} />
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {filtered.map((log, i) => <LogCard key={log.id} log={log} onClick={onOpen} index={i} T={T} />)}
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════
   SCROLL-SPY TOC
══════════════════════════════════════════════════════════════ */
const ScrollSpyTOC = ({ sections, hasChangelog, activeId, th, scrollRef, log }) => {
  const items = [...sections.map(s => ({ id:s.id, label:s.heading }))];
  if (hasChangelog) items.push({ id:"changelog-section", label:"Changelog" });

  const scrollTo = (id) => {
    const el = scrollRef.current?.querySelector(`[data-section="${id}"]`);
    if (el) el.scrollIntoView({ behavior:"smooth", block:"start" });
  };

  return (
    <>
      <div style={{ background:th.sidebarBg, border:`1px solid ${th.sidebarBorder}`, borderRadius:10, padding:"14px 16px" }}>
        <div style={{ fontSize:9.5, fontWeight:700, letterSpacing:"1.8px", textTransform:"uppercase", color:th.mutedText, fontFamily:"'JetBrains Mono',monospace", marginBottom:12 }}>On This Page</div>
        <div style={{ display:"flex", flexDirection:"column", gap:2 }}>
          {items.map(item => {
            const isActive = activeId === item.id;
            return (
              <button key={item.id} onClick={() => scrollTo(item.id)}
                style={{ display:"flex", alignItems:"center", gap:8, padding:"6px 8px", borderRadius:6, cursor:"pointer", border:"none", background:isActive?th.tocActiveBg:"transparent", transition:"all 0.15s", textAlign:"left", width:"100%" }}>
                <div style={{ width:2.5, height:isActive?20:14, borderRadius:2, background:isActive?th.tocActive:th.mutedText, flexShrink:0, transition:"all 0.2s" }} />
                <span style={{ fontSize:11.5, color:isActive?th.tocActive:th.mutedText, fontFamily:"'Syne',sans-serif", fontWeight:isActive?600:500, lineHeight:1.35, transition:"color 0.15s" }}>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ background:th.sidebarBg, border:`1px solid ${th.sidebarBorder}`, borderRadius:10, padding:"14px 16px" }}>
        <div style={{ fontSize:9.5, fontWeight:700, letterSpacing:"1.5px", textTransform:"uppercase", color:th.mutedText, fontFamily:"'JetBrains Mono',monospace", marginBottom:12 }}>Details</div>
        {[
          { label:"Version",   val:log.version       },
          { label:"Released",  val:fmt(log.date)     },
          { label:"Read time", val:log.readTime      },
        ].map(r => (
          <div key={r.label} style={{ marginBottom:10 }}>
            <div style={{ fontSize:9, color:th.mutedText, fontFamily:"'JetBrains Mono',monospace", letterSpacing:"0.5px", textTransform:"uppercase", marginBottom:2 }}>{r.label}</div>
            <div style={{ fontSize:12.5, color:th.headText, fontFamily:r.label==="Version"?"'JetBrains Mono',monospace":"'Syne',sans-serif", fontWeight:r.label==="Version"?600:500 }}>{r.val}</div>
          </div>
        ))}
      </div>
    </>
  );
};

/* ══════════════════════════════════════════════════════════════
   BLOG PAGE
══════════════════════════════════════════════════════════════ */
const BlogPage = ({ log, onBack, isDark, T }) => {
  const scrollRef = useRef(null);
  const [readPct, setReadPct] = useState(0);
  const [activeId, setActiveId] = useState(log.content.sections[0]?.id || "");
  const th = T[blogKey(log.type)];
  const clrMap = isDark ? CL_DARK : CL_LIGHT;

  useEffect(() => {
    const el = scrollRef.current; if (!el) return;
    const fn = () => setReadPct(Math.min(1, el.scrollTop / (el.scrollHeight - el.clientHeight)));
    el.addEventListener("scroll", fn);
    return () => el.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const el = scrollRef.current; if (!el) return;
    const sectionIds = [...log.content.sections.map(s => s.id), "changelog-section"];
    const observers = [];
    const visible = new Set();
    sectionIds.forEach(id => {
      const target = el.querySelector(`[data-section="${id}"]`);
      if (!target) return;
      const obs = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) visible.add(id); else visible.delete(id);
        const first = sectionIds.find(sid => visible.has(sid));
        if (first) setActiveId(first);
      }, { root:el, rootMargin:"-20% 0px -50% 0px", threshold:0 });
      obs.observe(target);
      observers.push(obs);
    });
    return () => observers.forEach(o => o.disconnect());
  }, [log]);

  return (
    <div ref={scrollRef} style={{ flex:1, background:th.bg, transition:"background 0.3s" }}>
      <div style={{ position:"sticky", top:0, height:2.5, background:th.border, zIndex:300 }}>
        <div style={{ height:"100%", background:th.accent, width:`${readPct*100}%`, transition:"width 0.07s linear", borderRadius:"0 2px 2px 0" }} />
      </div>

      <div style={{ background:`${th.bg}ee`, backdropFilter:"blur(14px)", borderBottom:`1px solid ${th.border}`, padding:"0 16px", position:"sticky", top:2.5, zIndex:150 }}>
        <div style={{ maxWidth:960, margin:"0 auto", display:"flex", alignItems:"center", height:42, gap:10, flexWrap:"wrap" }}>
          <button onClick={onBack} style={{ display:"flex", alignItems:"center", gap:5, fontSize:12, fontWeight:600, color:th.accent, background:th.accentSoft, border:`1px solid ${th.border}`, borderRadius:6, padding:"4px 11px", cursor:"pointer", fontFamily:"'Syne',sans-serif", transition:"all 0.14s", whiteSpace:"nowrap" }}>← All Logs</button>
          <span style={{ fontSize:10.5, color:th.mutedText, fontFamily:"'JetBrains Mono',monospace", opacity:0.7, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>/{log.type}s/{log.id}</span>
          <div style={{ marginLeft:"auto" }}><TypeBadge type={log.type} T={T} small /></div>
        </div>
      </div>

      <div style={{ background:th.heroGrad, borderBottom:`1px solid ${th.border}`, padding:"48px 16px 40px" }}>
        <div style={{ maxWidth:720, margin:"0 auto", animation:"cjUp 0.42s ease both" }}>
          <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:18, flexWrap:"wrap" }}>
            <TypeBadge type={log.type} T={T} />
            {log.status && <StatusBadge status={log.status} />}
            <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:11.5, fontWeight:600, color:th.accent, background:th.accentSoft, border:`1px solid ${th.border}`, padding:"3px 9px", borderRadius:4 }}>{log.version}</span>
          </div>
          <h1 className="cj-blog-title" style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:34, color:th.headText, lineHeight:1.12, marginBottom:16, letterSpacing:"-0.5px" }}>{log.content.headline}</h1>
          <p className="cj-blog-intro" style={{ fontFamily:"'Lora',serif", fontStyle:"italic", fontWeight:400, fontSize:18.5, color:th.bodyText, lineHeight:1.88, marginBottom:26, letterSpacing:"0.01em" }}>{log.content.intro}</p>
          <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
            <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:11.5, color:th.mutedText }}>{fmt(log.date)}</span>
            <span style={{ color:th.mutedText, opacity:0.5 }}>·</span>
            <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:11.5, color:th.mutedText }}>{log.readTime} read</span>
            <div style={{ marginLeft:"auto", display:"flex", gap:5, flexWrap:"wrap" }}>
              {log.tags.map(t => <span key={t} style={{ padding:"2px 8px", borderRadius:4, fontSize:10, fontWeight:600, background:th.tagBg, color:th.tagColor, border:`1px solid ${th.tagBorder}`, fontFamily:"'JetBrains Mono',monospace" }}>#{t}</span>)}
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth:960, margin:"0 auto", padding:"48px 16px 80px" }}>
        <div style={{ display:"flex", gap:48, alignItems:"flex-start" }}>
          <article style={{ flex:1, minWidth:0 }}>
            {log.content.sections.map((sec, i) => (
              <div key={sec.id} data-section={sec.id} style={{ marginBottom:56, scrollMarginTop:80, animation:`cjUp 0.36s ease ${i*60+80}ms both` }}>
                <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
                  <div style={{ width:3.5, height:24, background:th.accent, borderRadius:2, flexShrink:0 }} />
                  <h2 className="cj-section-head" style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:21, color:th.headText, letterSpacing:"-0.25px", lineHeight:1.2 }}>{sec.heading}</h2>
                </div>
                <div style={{ paddingLeft:14 }}>
                  <p className="cj-section-body" style={{ fontFamily:"'Lora',serif", fontSize:17, color:th.bodyText, lineHeight:1.92, fontWeight:400, letterSpacing:"0.012em" }}>{sec.body}</p>
                </div>
                {i < log.content.sections.length - 1 && <div style={{ height:1, background:th.rulerColor, marginTop:48, marginLeft:14 }} />}
              </div>
            ))}

            {log.content.changelog && (
              <div data-section="changelog-section" style={{ marginTop:52, scrollMarginTop:80 }}>
                <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:22 }}>
                  <div style={{ height:1, flex:1, background:th.rulerColor }} />
                  <span style={{ fontSize:10, fontWeight:700, letterSpacing:"2.5px", textTransform:"uppercase", color:th.mutedText, fontFamily:"'JetBrains Mono',monospace", flexShrink:0 }}>Changelog</span>
                  <div style={{ height:1, flex:1, background:th.rulerColor }} />
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                  {log.content.changelog.map((section, si) => {
                    const clr = clrMap[section.label] || clrMap["Added"];
                    return (
                      <div key={si} style={{ background:clr.bg, border:`1px solid ${clr.border}`, borderRadius:10, padding:"14px 16px", animation:`cjUp 0.3s ease ${si*50+160}ms both` }}>
                        <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10, fontWeight:700, letterSpacing:"1.5px", textTransform:"uppercase", color:clr.color, marginBottom:10, display:"flex", alignItems:"center", gap:6 }}>
                          <span style={{ width:5, height:5, borderRadius:"50%", background:clr.color, display:"inline-block" }} />
                          {section.label}
                        </div>
                        <ul style={{ listStyle:"none", display:"flex", flexDirection:"column", gap:7 }}>
                          {section.items.map((item, ii) => (
                            <li key={ii} style={{ display:"flex", gap:9, alignItems:"flex-start" }}>
                              <span style={{ color:clr.color, fontWeight:700, fontSize:13, marginTop:"1px", flexShrink:0 }}>+</span>
                              <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:13, color:isDark?clr.color:"#374151", lineHeight:1.6, opacity:isDark?0.85:1 }}>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div style={{ marginTop:60, paddingTop:24, borderTop:`1px solid ${th.rulerColor}`, display:"flex" }}>
              <button onClick={onBack} style={{ display:"flex", alignItems:"center", gap:7, padding:"10px 22px", borderRadius:8, fontSize:13.5, fontWeight:700, cursor:"pointer", background:th.accent, color:"#fff", border:"none", fontFamily:"'Syne',sans-serif", boxShadow:`0 4px 20px ${th.accent}40`, transition:"all 0.16s", letterSpacing:"0.2px" }}>← Back to Logs</button>
            </div>
          </article>

          <aside style={{ width:190, flexShrink:0, alignSelf:"flex-start", position:"sticky", top:50, display:"flex", flexDirection:"column", gap:14 }}>
            <ScrollSpyTOC
              sections={log.content.sections}
              hasChangelog={!!log.content.changelog}
              activeId={activeId}
              th={th}
              scrollRef={scrollRef}
              log={log}
            />
          </aside>
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════
   ROOT
   Theme is read from localStorage on mount and kept in sync via
   polling + storage event, exactly like Home.jsx / About.jsx.
   The local toggle button has been removed — use Profile > Settings.
══════════════════════════════════════════════════════════════ */
export default function CJLogs() {
  /* ── Theme sync ── */
  const [themeKey, setThemeKey] = useState(getStoredKey);
  const isDark = DARK_KEYS.has(themeKey);
  const T = makeTheme(isDark, themeKey);

  useEffect(() => {
    // Poll every 500 ms so switching from Profile updates this page immediately
    const iv = setInterval(() => {
      const fresh = getStoredKey();
      if (fresh !== themeKey) setThemeKey(fresh);
    }, 500);
    return () => clearInterval(iv);
  }, [themeKey]);

  useEffect(() => {
    // Cross-tab sync
    const fn = () => setThemeKey(getStoredKey());
    window.addEventListener("storage", fn);
    return () => window.removeEventListener("storage", fn);
  }, []);

  /* ── Page state ── */
  const [page, setPage]     = useState("home");
  const [filter, setFilter] = useState("all");
  const [openLog, setOpenLog] = useState(null);

  const handleOpen = (log) => { setOpenLog(log); setPage("detail"); };
  const handleBack = () => {
    setOpenLog(null);
    setPage(filter==="all"?"home":filter==="release"?"releases":filter==="deprecated"?"deprecated":"improvements");
  };
  const isDetail = page === "detail" && openLog;

  const handleNav = (p, f) => {
    if (isDetail) setOpenLog(null);
    setPage(p);
    if (f) setFilter(f);
  };

  const shellBg = isDetail ? T[blogKey(openLog.type)].bg : T.deep;

  return (
    <>
      <GlobalStyles isDark={isDark} />
      <div style={{ display:"flex", flexDirection:"column", width:"100%", minHeight:"100vh", background:shellBg, fontFamily:"'Syne',sans-serif", color:T.t1, overflow:"hidden", transition:"background 0.3s" }}>

        <SectionTabs
          page={page}
          setPage={(p) => handleNav(p, { home:"all", releases:"release", deprecated:"deprecated", improvements:"improvement" }[p] || "all")}
          setFilter={setFilter}
          T={T}
        />

        <div style={{ flex:1, overflowY:"auto", overflowX:"hidden", position:"relative" }}>
          {isDetail && (
            <div style={{ display:"flex", flexDirection:"column" }}>
              <BlogPage log={openLog} onBack={handleBack} isDark={isDark} T={T} />
            </div>
          )}
          {!isDetail && (
            <>
              {page==="home"         && <HomePage      logs={LOGS} onOpen={handleOpen} filter={filter} T={T} isDark={isDark} />}
              {page==="releases"     && <CategoryPage  type="release"     logs={LOGS} onOpen={handleOpen} T={T} />}
              {page==="deprecated"   && <CategoryPage  type="deprecated"  logs={LOGS} onOpen={handleOpen} T={T} />}
              {page==="improvements" && <CategoryPage  type="improvement" logs={LOGS} onOpen={handleOpen} T={T} />}
            </>
          )}
        </div>
      </div>
    </>
  );
}