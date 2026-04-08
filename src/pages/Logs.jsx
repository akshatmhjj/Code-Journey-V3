/**
 * Code Journey — CJ Logs v3
 * SCROLL BUG FIX: Detail opens as fixed overlay — main page never unmounts.
 *   Body scroll is locked on open and restored on close. Zero jump.
 * HIDDEN ADMIN: triple-click the pulsing "●" live dot (top-right header) within 1.5s.
 * Theme: localStorage["cj-theme"] from Profile > Settings.
 * Admin PW: "cjlogs2026" — change before shipping.
 * TODO: replace onPublish with api.post("/logs", newLog).
 */
import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Clock, ArrowUpRight, Check, Lock, Send, Sparkles } from "lucide-react";

/* THEME */
const PT = {
  cosmos:{ shell:"#07080d",deep:"#0c0e18",mid:"#111420",surface:"#161927",panel:"#1a1e2e",hover:"#1e2335",active:"#252b42",card:"#161927",cardH:"#1c2235",t1:"#e8eaf2",t2:"#8892b0",t3:"#5a6488",t4:"#2e3660",b1:"rgba(120,130,180,0.08)",b2:"rgba(120,130,180,0.15)",b3:"rgba(120,130,180,0.24)",acc:"#7c6ee0",accS:"rgba(124,110,224,0.14)",teal:"#5eead4",green:"#22c55e",red:"#f87171",gold:"#fbbf24",dark:true },
  void:{   shell:"#000000",deep:"#050507",mid:"#0a0a0f",surface:"#0f0f15",panel:"#141419",hover:"#1a1a22",active:"#202030",card:"#0f0f15",cardH:"#161622",t1:"#f0f0ff",t2:"#9090b8",t3:"#505070",t4:"#252540",b1:"rgba(100,100,200,0.08)",b2:"rgba(100,100,200,0.14)",b3:"rgba(100,100,200,0.22)",acc:"#8b7ff0",accS:"rgba(139,127,240,0.14)",teal:"#2dd4bf",green:"#34d399",red:"#fc8181",gold:"#fcd34d",dark:true },
  aurora:{ shell:"#040e0e",deep:"#071414",mid:"#0b1c1c",surface:"#102424",panel:"#142a2a",hover:"#1a3333",active:"#1f3d3d",card:"#102424",cardH:"#162e2e",t1:"#e0f5f5",t2:"#7ab8b8",t3:"#3d7878",t4:"#1e4444",b1:"rgba(80,200,180,0.08)",b2:"rgba(80,200,180,0.15)",b3:"rgba(80,200,180,0.24)",acc:"#2dd4bf",accS:"rgba(45,212,191,0.14)",teal:"#5eead4",green:"#4ade80",red:"#f87171",gold:"#fbbf24",dark:true },
  nord:{   shell:"#1a1f2e",deep:"#1e2535",mid:"#232c40",surface:"#28334a",panel:"#2d3a50",hover:"#344260",active:"#3a4a6e",card:"#28334a",cardH:"#2e3d55",t1:"#eceff4",t2:"#9ba8c0",t3:"#5c6a88",t4:"#3a4560",b1:"rgba(136,192,208,0.1)",b2:"rgba(136,192,208,0.18)",b3:"rgba(136,192,208,0.28)",acc:"#88c0d0",accS:"rgba(136,192,208,0.14)",teal:"#8fbcbb",green:"#a3be8c",red:"#bf616a",gold:"#ebcb8b",dark:true },
  light:{  shell:"#f3f4f8",deep:"#ffffff",mid:"#f0f1f7",surface:"#ffffff",panel:"#f7f8fc",hover:"#eef0f8",active:"#e5e8f5",card:"#ffffff",cardH:"#f5f6fc",t1:"#111827",t2:"#4b5680",t3:"#7c87a8",t4:"#c5ccdf",b1:"rgba(80,90,150,0.08)",b2:"rgba(80,90,150,0.15)",b3:"rgba(80,90,150,0.24)",acc:"#6256d0",accS:"rgba(98,86,208,0.1)",teal:"#0d9488",green:"#16a34a",red:"#dc2626",gold:"#d97706",dark:false },
};
const getT = () => { try { return PT[localStorage.getItem("cj-theme")] || PT.cosmos; } catch { return PT.cosmos; } };
function useTheme() {
  const [T, setT] = useState(getT);
  useEffect(() => { const iv = setInterval(() => { const f = getT(); if (f.acc !== T.acc) setT(f); }, 500); return () => clearInterval(iv); }, [T]);
  useEffect(() => { const fn = () => setT(getT()); window.addEventListener("storage", fn); return () => window.removeEventListener("storage", fn); }, []);
  return T;
}

/* TYPE CONFIG */
const TC = {
  release:     { label:"Release",     short:"REL", emoji:"🚀", color:"#22c55e" },
  improvement: { label:"Improvement", short:"IMP", emoji:"⚡", color:"#60a5fa" },
  deprecated:  { label:"Deprecated",  short:"DEP", emoji:"⚠️",  color:"#f87171" },
};

/* HELPERS */
const fmtD = s => new Date(s).toLocaleDateString("en-IN",{ day:"numeric",month:"short",year:"numeric" });
const relT  = s => { const d=Math.floor((Date.now()-new Date(s))/86400000); if(d===0)return"Today"; if(d===1)return"Yesterday"; if(d<7)return`${d}d ago`; if(d<30)return`${Math.floor(d/7)}w ago`; return`${Math.floor(d/30)}mo ago`; };
const uid   = () => `log-${Date.now()}-${Math.random().toString(36).slice(2,6)}`;

/* DATA */
const INITIAL = [
  { id:"r-003.1",type:"release",version:"v3.0.0",title:"Channel Logs Page",date:"2026-03-29",summary:"A centralized system to track all platform activities including releases, improvements, and deprecations in a structured and transparent way.",tags:["logs","tracking","platform"],readTime:"2 min",content:{headline:"One Timeline for Everything on Code Journey",intro:"With growing complexity, users needed a clear way to understand what's changing. The Logs page acts as a living timeline of all system activity — from new features to removed systems.",sections:[{id:"s1",heading:"Centralized Activity Tracking",body:"Every update is categorized into Releases, Improvements, and Deprecations, ensuring users can differentiate new features, upgrades, and removed functionality."},{id:"s2",heading:"Structured & Scalable Format",body:"Logs use a modular structure with summaries, detailed breakdowns, and changelogs — scalable as the platform evolves into multiple domains."},{id:"s3",heading:"User Transparency",body:"Instead of hidden updates, users get full visibility into what changed, why it changed, and how it impacts their experience."}],changelog:[{label:"Added",color:"#22c55e",items:["Dedicated Channel Logs page","Categorization (Release / Improvement / Deprecation)","Detailed structured log format","Timeline-based tracking system"]}]} },
  { id:"r-003.2",type:"release",version:"v3.0.0",title:"Multi-Language Code Runner",date:"2026-03-28",summary:"Execute multiple programming languages directly inside Code Journey using a sandboxed WebAssembly runtime with real-time output.",tags:["code-runner","wasm","execution"],readTime:"3 min",content:{headline:"Run Any Code — Instantly, Securely, Natively",intro:"A multi-language execution engine eliminates the need for local setup. Everything runs in-browser with performance and safety at its core.",sections:[{id:"s4",heading:"Multi-Language Runtime",body:"The runtime supports JS, TypeScript, Python, R, SQL, Dart, Kotlin, Rust, and HTML/CSS — switch between languages without leaving the platform."},{id:"s5",heading:"WebAssembly Sandbox",body:"Each execution runs in an isolated WASM container. No shared state, no persistence, no risk of cross-user interference."},{id:"s6",heading:"Real-Time Output Streaming",body:"stdout and stderr stream live into the terminal panel, creating a responsive coding experience similar to a local environment."},{id:"s7",heading:"Execution Constraints",body:"Each run enforces strict limits — 30s execution time, 128MB memory cap, zero external network access."}],changelog:[{label:"Added",color:"#22c55e",items:["WebAssembly-based execution engine","Support for 9 programming languages","Live terminal output streaming","Execution history with replay","Keyboard shortcut (Ctrl/Cmd + Enter)"]}]} },
  { id:"i-003.1",type:"improvement",version:"v3.0.0",title:"CJ Editor Interface Upgrade",date:"2026-03-25",summary:"Shifted from a web-centric editor to a full multi-language development environment with improved UI and performance.",tags:["editor","ui","ide"],readTime:"1 min",content:{headline:"From Editor → Full Development Workspace",intro:"The CJ Editor has undergone a major transformation — now a flexible, multi-language workspace designed to simulate real development environments.",sections:[{id:"s8",heading:"Multi-Language Shift",body:"The editor now supports diverse programming environments, aligning with the platform's expansion beyond web development."},{id:"s9",heading:"Hybrid UI Experience",body:"The interface blends patterns from multiple modern IDEs, creating a familiar yet unique experience for all skill levels."},{id:"s10",heading:"Integrated Panels",body:"Added terminal, console, problems, and output tabs below the editor — write, run, debug, and analyze in one place."},{id:"s11",heading:"Performance Enhancements",body:"Improved load times using optimized bundling and background preloading strategies for execution engines."}],changelog:[{label:"Improved",color:"#60a5fa",items:["Editor UI redesign","Multi-language support","Integrated development panels","Faster startup and execution responsiveness"]}]} },
  { id:"i-003.3",type:"improvement",version:"v3.0.0",title:"Profile Section Redesign",date:"2026-04-02",summary:"Rebuilt profile experience with improved dashboard, task tracking, and theme customization.",tags:["profile","dashboard","ui"],readTime:"1 min",content:{headline:"A Cleaner, More Meaningful Profile Experience",intro:"The profile section has been redesigned to better reflect user progress and simplify interactions across different parts of the platform.",sections:[{id:"s12",heading:"Dashboard Restructure",body:"Improved hierarchy and layout to highlight important user data such as progress, activity, and achievements."},{id:"s13",heading:"Tasks System Update",body:"Tasks are now more interactive and easier to manage, allowing users to track their learning journey efficiently."},{id:"s14",heading:"Theme Customization",body:"Removed the old settings section and introduced a dedicated platform theme switching experience."}],changelog:[{label:"Improved",color:"#60a5fa",items:["Profile dashboard layout","Task interaction flow","Theme switching system"]}]} },
  { id:"i-003.4",type:"improvement",version:"v3.0.0",title:"Landing Page Revamp",date:"2026-04-03",summary:"Redesigned landing experience to better represent Code Journey as a multi-domain learning platform.",tags:["landing","ui","experience"],readTime:"1 min",content:{headline:"Beyond Web Development — A Broader Vision",intro:"The landing page now reflects the platform's evolution from a web-focused learning tool into a comprehensive, multi-domain ecosystem.",sections:[{id:"s15",heading:"Removed Web-Centric Bias",body:"Eliminated components focused only on web development, making the platform inclusive of different technologies and domains."},{id:"s16",heading:"Quick Platform Insights",body:"Added a section that quickly communicates what Code Journey offers, helping new users understand instantly."},{id:"s17",heading:"Improved First Impression",body:"Refined layout, messaging, and visual hierarchy to create a more immersive and engaging entry point."}],changelog:[{label:"Improved",color:"#60a5fa",items:["Landing page structure","Platform positioning clarity","User onboarding experience"]}]} },
  { id:"d-003.1",type:"deprecated",version:"v3.0.0",title:"Badges System (Temporary Removal)",date:"2026-04-01",summary:"Temporarily removed badges due to low engagement and lack of a strong progression system.",tags:["gamification","badges"],readTime:"1 min",content:{headline:"Rebuilding Gamification from the Ground Up",intro:"The existing badges system did not effectively motivate users or integrate well with the platform's progression model.",sections:[{id:"s18",heading:"Core Issues",body:"Low usage, unclear reward structure, and weak feedback loops reduced the badge system's overall impact on motivation."},{id:"s19",heading:"What's Next",body:"A redesigned gamification system is planned with better progression logic, meaningful rewards, and tighter integration."}],changelog:[{label:"Removed",color:"#94a3b8",items:["Badges system (temporary)"]}]} },
  { id:"d-003.2",type:"deprecated",version:"v3.0.0",title:"Legacy Editor Config API",date:"2026-03-28",summary:"Deprecated the global editor configuration system in favor of a modern lifecycle-safe API.",tags:["editor","api"],readTime:"1 min",content:{headline:"From Global Hacks → Structured Configuration",intro:"The old global config approach introduced timing issues and lacked flexibility. Replaced with a robust, scalable solution.",sections:[{id:"s20",heading:"What Changed",body:"window.__CJ_MONACO_CONFIG is replaced with CJEditor.configure(), allowing configuration at any lifecycle point."},{id:"s21",heading:"Why It Matters",body:"Eliminates race conditions, improves reliability, and enables dynamic configuration updates."},{id:"s22",heading:"Migration Requirement",body:"Developers must migrate before June 30, 2026, to avoid undefined behavior."}],changelog:[{label:"Deprecated",color:"#f87171",items:["window.__CJ_MONACO_CONFIG"]},{label:"Replacement",color:"#a78bfa",items:["CJEditor.configure()"]}]} },
];

/* ─── LOG CARD ─────────────────────────────────────────────── */
const LogCard = ({ log, onOpen, T }) => {
  const [hov, setHov] = useState(false);
  const tc = TC[log.type] || TC.release;
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} onClick={() => onOpen(log)}
      style={{ display:"flex", alignItems:"stretch", background:hov?T.cardH:T.card, border:`1px solid ${hov?tc.color+"44":T.b1}`, borderRadius:14, overflow:"hidden", cursor:"pointer", transition:"all 0.18s", transform:hov?"translateY(-2px)":"none", boxShadow:hov?`0 6px 28px ${tc.color}14`:"none", marginBottom:10 }}>
      {/* Left type stripe */}
      <div style={{ width:54, flexShrink:0, background:hov?`${tc.color}18`:`${tc.color}0a`, borderRight:`1px solid ${hov?tc.color+"28":T.b1}`, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:7, padding:"14px 0", transition:"all 0.18s" }}>
        <span style={{ fontSize:17 }}>{tc.emoji}</span>
        <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:8.5, fontWeight:700, letterSpacing:"1.5px", textTransform:"uppercase", color:hov?tc.color:T.t3, writingMode:"vertical-rl", textOrientation:"mixed", transform:"rotate(180deg)", transition:"color 0.18s" }}>{tc.short}</span>
      </div>
      {/* Centre */}
      <div style={{ flex:1, padding:"16px 18px", minWidth:0 }}>
        <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:8, flexWrap:"wrap" }}>
          <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10, fontWeight:600, color:tc.color, background:`${tc.color}12`, border:`1px solid ${tc.color}28`, padding:"1px 7px", borderRadius:4 }}>{log.version}</span>
          <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10.5, color:T.t3 }}>{relT(log.date)}</span>
          {log.tags.slice(0,2).map(tg => <span key={tg} style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9.5, color:T.t4, padding:"1px 6px", background:T.active, borderRadius:3, border:`1px solid ${T.b2}` }}>#{tg}</span>)}
        </div>
        <h3 style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:"clamp(14px,2.2vw,16.5px)", color:T.t1, marginBottom:7, lineHeight:1.3, letterSpacing:"-0.15px" }}>{log.title}</h3>
        <p style={{ fontFamily:"'Lora',serif", fontSize:"clamp(12.5px,1.8vw,13.5px)", color:T.t2, lineHeight:1.72, display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden" }}>{log.summary}</p>
        <div style={{ display:"flex", alignItems:"center", gap:6, marginTop:9 }}>
          <Clock size={11} color={T.t3}/>
          <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10.5, color:T.t3 }}>{log.readTime} · {fmtD(log.date)}</span>
        </div>
      </div>
      {/* Right arrow */}
      <div style={{ width:42, flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", borderLeft:`1px solid ${T.b1}`, background:hov?`${tc.color}08`:"transparent", transition:"all 0.18s" }}>
        <ArrowUpRight size={17} color={hov?tc.color:T.t3} style={{ opacity:hov?1:0.35, transform:hov?"translate(1px,-1px)":"none", transition:"all 0.18s" }}/>
      </div>
    </div>
  );
};

/* ─── DETAIL OVERLAY ────────────────────────────────────────── */
const DetailOverlay = ({ log, onClose, T }) => {
  const scrollRef = useRef(null);
  const [readPct, setReadPct] = useState(0);
  const [activeSec, setActiveSec] = useState(log.content.sections[0]?.id || "");
  const tc = TC[log.type] || TC.release;

  useEffect(() => {
    const el = scrollRef.current; if (!el) return;
    const fn = () => setReadPct(Math.min(1, el.scrollTop / Math.max(1, el.scrollHeight - el.clientHeight)));
    el.addEventListener("scroll", fn, { passive:true }); return () => el.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const el = scrollRef.current; if (!el) return;
    const ids = log.content.sections.map(s => s.id);
    const vis = new Set();
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) vis.add(e.target.dataset.sid); else vis.delete(e.target.dataset.sid); });
      const first = ids.find(id => vis.has(id)); if (first) setActiveSec(first);
    }, { root:el, rootMargin:"-25% 0px -50% 0px", threshold:0 });
    ids.forEach(id => { const t = el.querySelector(`[data-sid="${id}"]`); if (t) obs.observe(t); });
    return () => obs.disconnect();
  }, [log]);

  useEffect(() => { const fn = e => { if (e.key === "Escape") onClose(); }; document.addEventListener("keydown", fn); return () => document.removeEventListener("keydown", fn); }, [onClose]);

  const BP = T.dark ? {
    release:     { bg:"#061410",border:`${tc.color}25`,head:"#d1fae5",body:"#7db89a",muted:"#2d6649",hero:`linear-gradient(160deg,${tc.color}12 0%,transparent 100%)`,ruler:`${tc.color}18` },
    improvement: { bg:"#050d1a",border:`${tc.color}25`,head:"#dbeafe",body:"#6d96bb",muted:"#244f7a",hero:`linear-gradient(160deg,${tc.color}12 0%,transparent 100%)`,ruler:`${tc.color}18` },
    deprecated:  { bg:"#130708",border:`${tc.color}25`,head:"#fee2e2",body:"#b08080",muted:"#6b3535",hero:`linear-gradient(160deg,${tc.color}12 0%,transparent 100%)`,ruler:`${tc.color}18` },
  } : {
    release:     { bg:"#f0fdf4",border:"#bbf7d0",head:"#14532d",body:"#1e5c38",muted:"#4b7a58",hero:"linear-gradient(160deg,#dcfce7 0%,#f0fdf4 100%)",ruler:"#bbf7d0" },
    improvement: { bg:"#eff6ff",border:"#bfdbfe",head:"#0c1b4d",body:"#1e3a5f",muted:"#3a5280",hero:"linear-gradient(160deg,#dbeafe 0%,#eff6ff 100%)",ruler:"#bfdbfe" },
    deprecated:  { bg:"#fff1f2",border:"#fecaca",head:"#450a0a",body:"#7f1d1d",muted:"#7a4040",hero:"linear-gradient(160deg,#fee2e2 0%,#fff1f2 100%)",ruler:"#fecaca" },
  };
  const th = BP[log.type] || BP.release;

  return (
    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} transition={{ duration:0.18 }}
      style={{ position:"fixed", inset:0, zIndex:1000, display:"flex" }}>
      {/* Backdrop */}
      <div onClick={onClose} style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.55)", backdropFilter:"blur(6px)" }}/>
      {/* Slide-in panel */}
      <motion.div initial={{ x:"100%" }} animate={{ x:0 }} exit={{ x:"100%" }} transition={{ duration:0.3, ease:[0.22,1,0.36,1] }}
        style={{ position:"relative", marginLeft:"auto", width:"min(800px,100vw)", height:"100%", background:th.bg, display:"flex", flexDirection:"column", boxShadow:"-20px 0 80px rgba(0,0,0,0.5)", borderLeft:`1px solid ${th.border}` }}>
        {/* Progress bar */}
        <div style={{ position:"absolute", top:0, left:0, right:0, height:2.5, background:T.b1, zIndex:10 }}>
          <motion.div animate={{ width:`${readPct*100}%` }} transition={{ duration:0.06 }} style={{ height:"100%", background:tc.color, borderRadius:"0 2px 2px 0" }}/>
        </div>
        {/* Toolbar */}
        <div style={{ display:"flex", alignItems:"center", gap:10, padding:"0 20px", height:48, flexShrink:0, borderBottom:`1px solid ${th.border}`, background:`${th.bg}f0`, backdropFilter:"blur(12px)" }}>
          <button onClick={onClose} style={{ display:"flex", alignItems:"center", gap:5, padding:"5px 11px", borderRadius:7, border:`1px solid ${th.border}`, background:"transparent", color:tc.color, fontFamily:"'Syne',sans-serif", fontWeight:600, fontSize:12, cursor:"pointer", transition:"background 0.15s" }} onMouseEnter={e=>e.currentTarget.style.background=`${tc.color}14`} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>← Back</button>
          <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10, color:th.muted, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", flex:1 }}>/{log.type}s/{log.id}</span>
          <span style={{ display:"inline-flex", alignItems:"center", gap:4, padding:"2px 9px", borderRadius:100, fontSize:10, fontWeight:700, textTransform:"uppercase", background:`${tc.color}16`, color:tc.color, border:`1px solid ${tc.color}35`, fontFamily:"'Syne',sans-serif", whiteSpace:"nowrap" }}>{tc.emoji} {tc.label}</span>
          <button onClick={onClose} style={{ width:28, height:28, borderRadius:"50%", background:`${tc.color}14`, border:`1px solid ${tc.color}28`, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", color:tc.color, flexShrink:0 }}><X size={13}/></button>
        </div>
        {/* Scrollable */}
        <div ref={scrollRef} style={{ flex:1, overflowY:"auto", overflowX:"hidden" }}>
          {/* Hero */}
          <div style={{ background:th.hero, borderBottom:`1px solid ${th.border}`, padding:"32px 28px 26px" }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14, flexWrap:"wrap" }}>
              <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:11, fontWeight:600, color:tc.color, background:`${tc.color}14`, border:`1px solid ${th.border}`, padding:"3px 10px", borderRadius:5 }}>{log.version}</span>
              <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:11, color:th.muted }}>{fmtD(log.date)} · {log.readTime} read</span>
            </div>
            <h1 style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:"clamp(22px,4vw,32px)", color:th.head, lineHeight:1.1, marginBottom:13, letterSpacing:"-0.5px" }}>{log.content.headline}</h1>
            <p style={{ fontFamily:"'Lora',serif", fontStyle:"italic", fontSize:"clamp(14px,2vw,17px)", color:th.body, lineHeight:1.85, marginBottom:16 }}>{log.content.intro}</p>
            <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>
              {log.tags.map(tg => <span key={tg} style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10, fontWeight:600, padding:"2px 8px", borderRadius:4, background:`${tc.color}14`, color:tc.color, border:`1px solid ${tc.color}28` }}>#{tg}</span>)}
            </div>
          </div>
          {/* Body + sidebar */}
          <div style={{ display:"flex", alignItems:"flex-start" }}>
            <article style={{ flex:1, padding:"28px 28px 80px", minWidth:0 }}>
              {log.content.sections.map((sec, i) => (
                <div key={sec.id} data-sid={sec.id} style={{ marginBottom:42, scrollMarginTop:56 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:9, marginBottom:12 }}>
                    <div style={{ width:3, height:20, background:tc.color, borderRadius:2, flexShrink:0 }}/>
                    <h2 style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:"clamp(15px,2.5vw,19px)", color:th.head, letterSpacing:"-0.2px", lineHeight:1.2 }}>{sec.heading}</h2>
                  </div>
                  <p style={{ fontFamily:"'Lora',serif", fontSize:"clamp(13.5px,1.9vw,16px)", color:th.body, lineHeight:1.9, paddingLeft:12 }}>{sec.body}</p>
                  {i < log.content.sections.length-1 && <div style={{ height:1, background:th.ruler, marginTop:38, marginLeft:12 }}/>}
                </div>
              ))}
              {log.content.changelog && log.content.changelog.length > 0 && (
                <div style={{ marginTop:38 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
                    <div style={{ flex:1, height:1, background:th.ruler }}/><span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9, fontWeight:700, letterSpacing:"2.5px", textTransform:"uppercase", color:th.muted, flexShrink:0 }}>Changelog</span><div style={{ flex:1, height:1, background:th.ruler }}/>
                  </div>
                  {log.content.changelog.map((cl, si) => (
                    <div key={si} style={{ background:`${cl.color}0d`, border:`1px solid ${cl.color}28`, borderRadius:10, padding:"13px 15px", marginBottom:9 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:9, fontFamily:"'JetBrains Mono',monospace", fontSize:9.5, fontWeight:700, letterSpacing:"1.5px", textTransform:"uppercase", color:cl.color }}>
                        <span style={{ width:5, height:5, borderRadius:"50%", background:cl.color, display:"inline-block" }}/>{cl.label}
                      </div>
                      {cl.items.map((item, ii) => (
                        <div key={ii} style={{ display:"flex", gap:8, alignItems:"flex-start", marginBottom:ii<cl.items.length-1?6:0 }}>
                          <span style={{ color:cl.color, fontWeight:700, fontSize:13, flexShrink:0 }}>+</span>
                          <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:12.5, color:cl.color, lineHeight:1.6, opacity:0.85 }}>{item}</span>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}
              <div style={{ marginTop:44, paddingTop:18, borderTop:`1px solid ${th.ruler}` }}>
                {/* <button onClick={onClose} style={{ display:"flex", alignItems:"center", gap:7, padding:"9px 20px", borderRadius:8, background:tc.color, color:"#fff", border:"none", fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:13.5, cursor:"pointer", transition:"opacity 0.16s" }} onMouseEnter={e=>e.currentTarget.style.opacity="0.85"} onMouseLeave={e=>e.currentTarget.style.opacity="1"}>← Back to All Logs</button> */}
              </div>
            </article>
            {/* TOC */}
            <aside style={{ width:156, flexShrink:0, alignSelf:"flex-start", position:"sticky", top:0, padding:"24px 12px 24px 0", borderLeft:`1px solid ${th.ruler}` }}>
              <p style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9, fontWeight:700, letterSpacing:"1.8px", textTransform:"uppercase", color:th.muted, marginBottom:11, paddingLeft:12 }}>On this page</p>
              {log.content.sections.map(sec => {
                const active = activeSec === sec.id;
                return (
                  <button key={sec.id} onClick={() => scrollRef.current?.querySelector(`[data-sid="${sec.id}"]`)?.scrollIntoView({ behavior:"smooth", block:"start" })}
                    style={{ display:"flex", alignItems:"flex-start", gap:7, padding:"5px 12px", borderRadius:6, border:"none", background:active?`${tc.color}12`:"transparent", cursor:"pointer", width:"100%", textAlign:"left", marginBottom:2, transition:"all 0.15s" }}>
                    <div style={{ width:2.5, height:active?17:11, borderRadius:2, background:active?tc.color:th.muted, flexShrink:0, marginTop:1, transition:"all 0.18s" }}/>
                    <span style={{ fontFamily:"'Syne',sans-serif", fontSize:11, color:active?tc.color:th.muted, fontWeight:active?600:400, lineHeight:1.35, transition:"color 0.15s" }}>{sec.heading}</span>
                  </button>
                );
              })}
              <div style={{ marginTop:18, paddingLeft:12, paddingTop:14, borderTop:`1px solid ${th.ruler}` }}>
                {[{l:"Version",v:log.version},{l:"Released",v:fmtD(log.date)},{l:"Read",v:log.readTime}].map(r=>(
                  <div key={r.l} style={{ marginBottom:10 }}>
                    <p style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:8.5, color:th.muted, textTransform:"uppercase", letterSpacing:"0.8px", marginBottom:2 }}>{r.l}</p>
                    <p style={{ fontFamily:r.l==="Version"?"'JetBrains Mono',monospace":"'Syne',sans-serif", fontSize:12, color:th.head, fontWeight:600, margin:0 }}>{r.v}</p>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

/* ─── ADMIN MODAL ───────────────────────────────────────────── */
const ADMIN_PW = "cjlogs2026";
const emptyDraft = () => ({ title:"",version:"v3.0.0",type:"release",date:new Date().toISOString().split("T")[0],summary:"",tags:"",readTime:"2 min",headline:"",intro:"",h1:"",b1:"",h2:"",b2:"",h3:"",b3:"",clLabel:"Added",clItems:"" });

const AdminModal = ({ onClose, onPublish, T }) => {
  const [step,setStep]=useState("pw"); const [pw,setPw]=useState(""); const [pwErr,setPwErr]=useState(false);
  const [draft,setDraft]=useState(emptyDraft()); const [done,setDone]=useState(false);
  const set=k=>e=>setDraft(d=>({...d,[k]:e.target.value}));
  const checkPw=()=>{ if(pw===ADMIN_PW){setStep("form");setPwErr(false);}else{setPwErr(true);setPw("");} };
  const handlePublish=()=>{
    const clC={Added:"#22c55e",Improved:"#60a5fa",Fixed:"#f97316",Deprecated:"#f87171",Removed:"#94a3b8",Replacement:"#a78bfa",Migrated:"#34d399"};
    const sections=[draft.h1?{id:uid(),heading:draft.h1,body:draft.b1}:null,draft.h2?{id:uid(),heading:draft.h2,body:draft.b2}:null,draft.h3?{id:uid(),heading:draft.h3,body:draft.b3}:null].filter(Boolean);
    const nl={id:uid(),type:draft.type,version:draft.version,title:draft.title,date:draft.date,summary:draft.summary,tags:draft.tags.split(",").map(t=>t.trim()).filter(Boolean),readTime:draft.readTime,content:{headline:draft.headline,intro:draft.intro,sections,changelog:draft.clItems?[{label:draft.clLabel,color:clC[draft.clLabel]||TC[draft.type]?.color||"#22c55e",items:draft.clItems.split("\n").map(i=>i.trim()).filter(Boolean)}]:[]}};
    onPublish(nl); setDone(true); setTimeout(onClose,1300);
  };
  const inp=err=>({width:"100%",background:T.panel,border:`1px solid ${err?T.red:T.b2}`,borderRadius:9,padding:"10px 13px",fontFamily:"'Syne',sans-serif",fontSize:13.5,color:T.t1,outline:"none",transition:"border 0.15s"});
  const lbl={fontFamily:"'JetBrains Mono',monospace",fontSize:9.5,fontWeight:700,letterSpacing:"1px",textTransform:"uppercase",color:T.t3,marginBottom:5,display:"block"};
  const focus=e=>e.target.style.borderColor=T.acc; const blur=e=>e.target.style.borderColor=T.b2;
  const canPost=draft.title&&draft.summary&&draft.headline&&draft.intro&&draft.h1&&draft.b1;
  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} style={{position:"fixed",inset:0,zIndex:2000,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(0,0,0,0.8)",backdropFilter:"blur(14px)",padding:16}}>
      <motion.div initial={{scale:0.92,y:20}} animate={{scale:1,y:0}} exit={{scale:0.94}} transition={{duration:0.24}} style={{background:T.surface,border:`1px solid ${T.b2}`,borderRadius:20,width:"100%",maxWidth:step==="pw"?360:720,maxHeight:"90vh",overflowY:"auto",position:"relative",boxShadow:`0 40px 120px rgba(0,0,0,0.7),0 0 0 1px ${T.acc}22`}}>
        <button onClick={onClose} style={{position:"absolute",top:14,right:14,width:28,height:28,borderRadius:"50%",background:T.hover,border:`1px solid ${T.b1}`,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:T.t2}}><X size={13}/></button>
        {step==="pw"&&(
          <div style={{padding:"34px 28px"}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:22}}>
              <div style={{width:38,height:38,borderRadius:11,background:`${T.acc}16`,border:`1px solid ${T.acc}30`,display:"flex",alignItems:"center",justifyContent:"center"}}><Lock size={16} color={T.acc}/></div>
              <div><h3 style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:16,color:T.t1,margin:0}}>Admin Access</h3><p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10.5,color:T.t3,margin:0}}>CJ Logs — restricted panel</p></div>
            </div>
            <label style={lbl}>Password</label>
            <input type="password" value={pw} autoFocus onChange={e=>{setPw(e.target.value);setPwErr(false);}} onKeyDown={e=>e.key==="Enter"&&checkPw()} placeholder="Enter admin password…" style={{...inp(pwErr),marginBottom:8}} onFocus={focus} onBlur={blur}/>
            {pwErr&&<p style={{fontFamily:"'Syne',sans-serif",fontSize:12,color:T.red,marginBottom:8}}>Incorrect password.</p>}
            <button onClick={checkPw} style={{width:"100%",padding:"11px",borderRadius:9,border:"none",background:T.acc,color:"#fff",fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:14,cursor:"pointer",marginTop:pwErr?0:10,transition:"opacity 0.16s"}} onMouseEnter={e=>e.currentTarget.style.opacity="0.85"} onMouseLeave={e=>e.currentTarget.style.opacity="1"}>Unlock Panel</button>
          </div>
        )}
        {step==="form"&&!done&&(
          <div style={{padding:"26px 24px"}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:22,paddingRight:32}}>
              <div style={{width:36,height:36,borderRadius:10,background:`${T.acc}16`,border:`1px solid ${T.acc}30`,display:"flex",alignItems:"center",justifyContent:"center"}}><Sparkles size={16} color={T.acc}/></div>
              <div><h3 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:16,color:T.t1,margin:0}}>New Log Entry</h3><p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:T.t3,margin:0}}>Compose · Publish</p></div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              <div style={{gridColumn:"1/-1"}}><label style={lbl}>Title *</label><input value={draft.title} onChange={set("title")} placeholder="e.g. Multi-Language Code Runner" style={inp()} onFocus={focus} onBlur={blur}/></div>
              <div><label style={lbl}>Type *</label><select value={draft.type} onChange={set("type")} style={{...inp(),cursor:"pointer"}}><option value="release">🚀 Release</option><option value="improvement">⚡ Improvement</option><option value="deprecated">⚠️ Deprecated</option></select></div>
              <div><label style={lbl}>Version *</label><input value={draft.version} onChange={set("version")} placeholder="v3.0.0" style={inp()} onFocus={focus} onBlur={blur}/></div>
              <div><label style={lbl}>Date *</label><input type="date" value={draft.date} onChange={set("date")} style={inp()} onFocus={focus} onBlur={blur}/></div>
              <div><label style={lbl}>Read Time</label><input value={draft.readTime} onChange={set("readTime")} placeholder="2 min" style={inp()} onFocus={focus} onBlur={blur}/></div>
              <div style={{gridColumn:"1/-1"}}><label style={lbl}>Tags (comma separated)</label><input value={draft.tags} onChange={set("tags")} placeholder="editor, ui, release" style={inp()} onFocus={focus} onBlur={blur}/></div>
              <div style={{gridColumn:"1/-1"}}><label style={lbl}>Summary * <span style={{textTransform:"none",letterSpacing:0,fontWeight:400,color:T.t4}}>(card preview)</span></label><textarea value={draft.summary} onChange={set("summary")} rows={2} placeholder="One or two sentences…" style={{...inp(),resize:"vertical",lineHeight:1.65}} onFocus={focus} onBlur={blur}/></div>
              <div style={{gridColumn:"1/-1",height:1,background:T.b2}}/>
              <p style={{gridColumn:"1/-1",...lbl,marginBottom:0}}>Blog Content</p>
              <div style={{gridColumn:"1/-1"}}><label style={lbl}>Headline *</label><input value={draft.headline} onChange={set("headline")} placeholder="Big heading in detail view" style={inp()} onFocus={focus} onBlur={blur}/></div>
              <div style={{gridColumn:"1/-1"}}><label style={lbl}>Intro *</label><textarea value={draft.intro} onChange={set("intro")} rows={3} placeholder="The italic intro paragraph…" style={{...inp(),resize:"vertical",lineHeight:1.65}} onFocus={focus} onBlur={blur}/></div>
              {[{n:1,hl:"h1",bl:"b1"},{n:2,hl:"h2",bl:"b2"},{n:3,hl:"h3",bl:"b3"}].map(({n,hl,bl})=>(
                <React.Fragment key={n}>
                  <div><label style={lbl}>Section {n} Heading{n===1?" *":""}</label><input value={draft[hl]} onChange={set(hl)} placeholder={`Heading ${n}`} style={inp()} onFocus={focus} onBlur={blur}/></div>
                  <div><label style={lbl}>Section {n} Body{n===1?" *":""}</label><textarea value={draft[bl]} onChange={set(bl)} rows={3} placeholder="Body text…" style={{...inp(),resize:"vertical",lineHeight:1.65}} onFocus={focus} onBlur={blur}/></div>
                </React.Fragment>
              ))}
              <div style={{gridColumn:"1/-1",height:1,background:T.b2}}/>
              <p style={{gridColumn:"1/-1",...lbl,marginBottom:0}}>Changelog Block</p>
              <div><label style={lbl}>Label</label><select value={draft.clLabel} onChange={set("clLabel")} style={{...inp(),cursor:"pointer"}}>{["Added","Improved","Fixed","Deprecated","Removed","Replacement","Migrated"].map(l=><option key={l}>{l}</option>)}</select></div>
              <div><label style={lbl}>Items (one per line)</label><textarea value={draft.clItems} onChange={set("clItems")} rows={4} placeholder={"New feature\nBug fix\nPerformance boost"} style={{...inp(),resize:"vertical",lineHeight:1.65}} onFocus={focus} onBlur={blur}/></div>
            </div>
            <div style={{display:"flex",gap:10,marginTop:20,justifyContent:"flex-end"}}>
              <button onClick={onClose} style={{padding:"9px 18px",borderRadius:9,border:`1px solid ${T.b2}`,background:"transparent",color:T.t2,fontFamily:"'Syne',sans-serif",fontWeight:600,fontSize:13,cursor:"pointer",transition:"background 0.15s"}} onMouseEnter={e=>e.currentTarget.style.background=T.hover} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>Cancel</button>
              <button onClick={handlePublish} disabled={!canPost} style={{display:"flex",alignItems:"center",gap:7,padding:"9px 20px",borderRadius:9,border:"none",background:T.acc,color:"#fff",fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:13.5,cursor:canPost?"pointer":"not-allowed",opacity:canPost?1:0.45}}><Send size={13}/> Publish</button>
            </div>
          </div>
        )}
        {done&&(
          <div style={{padding:"48px 32px",textAlign:"center"}}>
            <motion.div initial={{scale:0}} animate={{scale:1}} transition={{type:"spring",stiffness:260}} style={{width:52,height:52,borderRadius:"50%",background:`${T.green}18`,border:`1px solid ${T.green}44`,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px"}}><Check size={24} color={T.green}/></motion.div>
            <p style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:17,color:T.t1}}>Log published!</p>
            <p style={{fontFamily:"'Lora',serif",fontSize:14,color:T.t2,marginTop:6,fontStyle:"italic"}}>Entry added to the timeline.</p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

/* ─── ROOT ──────────────────────────────────────────────────── */
export default function CJLogs() {
  const T = useTheme();
  const [logs, setLogs]       = useState(INITIAL);
  const [filter, setFilter]   = useState("all");
  const [openLog, setOpenLog] = useState(null);
  const [adminOpen, setAdmin] = useState(false);
  const savedY = useRef(0);

  /* Scroll lock when overlay opens */
  useEffect(() => {
    if (openLog || adminOpen) {
      savedY.current = window.scrollY;
      document.body.style.cssText = `overflow:hidden;position:fixed;top:-${savedY.current}px;width:100%;`;
    } else {
      document.body.style.cssText = "";
      window.scrollTo(0, savedY.current);
    }
    return () => { document.body.style.cssText = ""; };
  }, [openLog, adminOpen]);

  /* Hidden admin: triple-click the "●" live dot */
  const tapRef = useRef(0);
  const tapTimer = useRef(null);
  const handleDotClick = useCallback(() => {
    tapRef.current += 1;
    clearTimeout(tapTimer.current);
    if (tapRef.current >= 3) { tapRef.current = 0; setAdmin(true); return; }
    tapTimer.current = setTimeout(() => { tapRef.current = 0; }, 1500);
  }, []);

  const filtered = filter === "all" ? logs : logs.filter(l => l.type === filter);
  const groups = {};
  filtered.forEach(log => {
    const m = new Date(log.date).toLocaleDateString("en-IN", { month:"long", year:"numeric" });
    if (!groups[m]) groups[m] = [];
    groups[m].push(log);
  });
  const sortedGroups = Object.entries(groups).sort((a,b) => new Date(b[0]) - new Date(a[0]));
  const FILTERS = [
    { key:"all",         label:"All",          count:logs.length },
    { key:"release",     label:"Releases",     count:logs.filter(l=>l.type==="release").length,     color:TC.release.color },
    { key:"improvement", label:"Improvements", count:logs.filter(l=>l.type==="improvement").length, color:TC.improvement.color },
    { key:"deprecated",  label:"Deprecated",   count:logs.filter(l=>l.type==="deprecated").length,  color:TC.deprecated.color },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,300;0,400;0,500;0,600;1,400&family=Syne:wght@400;500;600;700;800&family=Lora:ital,wght@0,400;0,500;1,400;1,500&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        html{scroll-behavior:smooth;}body{background:${T.shell};}
        ::-webkit-scrollbar{width:5px;height:4px;}::-webkit-scrollbar-track{background:${T.shell};}::-webkit-scrollbar-thumb{background:${T.hover};border-radius:3px;}
        ::selection{background:${T.accS};}
        @keyframes cjPulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.5;transform:scale(1.4)}}
        @keyframes cjGlow{0%,100%{box-shadow:0 0 16px ${T.acc}44}50%{box-shadow:0 0 38px ${T.acc}77}}
        @keyframes cjUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        @media(max-width:800px){.cjl-layout{flex-direction:column!important;}.cjl-sidebar{width:100%!important;position:relative!important;top:0!important;border-left:none!important;border-top:1px solid ${T.b1}!important;padding:20px 0 24px!important;}}
      `}</style>

      <div style={{ minHeight:"100vh", background:T.shell, color:T.t1, fontFamily:"'Syne',sans-serif" }}>

        {/* ── MAIN ── */}
        <div style={{ maxWidth:1060, margin:"0 auto", padding:"0 24px" }}>
          <div className="cjl-layout" style={{ display:"flex", gap:0, alignItems:"flex-start" }}>

            {/* Feed */}
            <div style={{ flex:1, minWidth:0, padding:"44px 0 80px" }}>
              {/* Hero */}
              <div style={{ marginBottom:38, animation:"cjUp 0.45s ease both" }}>
                <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:20 }}>
                  <div style={{ marginTop:60, flex:1, height:1, background:`linear-gradient(to right,${T.b3},${T.b1})` }}/>
                  <span style={{ marginTop:60, fontFamily:"'JetBrains Mono',monospace", fontSize:10, fontWeight:700, letterSpacing:"2.5px", textTransform:"uppercase", color:T.t3, padding:"3px 12px", background:T.panel, borderRadius:100, border:`1px solid ${T.b2}` }}>Changelog</span>
                  <div style={{ marginTop:60, flex:1, height:1, background:`linear-gradient(to left,${T.b3},${T.b1})` }}/>
                </div>
                <h1 style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:"clamp(28px,4.5vw,48px)", color:T.t1, lineHeight:1.08, letterSpacing:"-1.2px", marginBottom:12 }}>
                  Platform Updates.<br/><span style={{ color:T.acc }}>Every one.</span>
                </h1>
                <p style={{ fontFamily:"'Lora',serif", fontStyle:"italic", fontSize:"clamp(14px,1.8vw,16.5px)", color:T.t2, lineHeight:1.82, maxWidth:480 }}>
                  Releases, improvements, and deprecations — documented openly so you always know what changed and why.
                </p>
              </div>

              {sortedGroups.length===0&&<div style={{ textAlign:"center", padding:"60px 0", color:T.t3, fontFamily:"'Syne',sans-serif" }}>No logs match the current filter.</div>}

              {sortedGroups.map(([month, entries], gi) => (
                <div key={month} style={{ marginBottom:40 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
                    <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9.5, fontWeight:700, letterSpacing:"2px", textTransform:"uppercase", color:T.t3, flexShrink:0 }}>{month}</span>
                    <div style={{ flex:1, height:1, background:T.b1 }}/>
                    <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9, color:T.t4 }}>{entries.length}</span>
                  </div>
                  <AnimatePresence>
                    {entries.map(log => <LogCard key={log.id} log={log} onOpen={setOpenLog} T={T}/>)}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            {/* Sidebar */}
            <aside className="cjl-sidebar" style={{ width:232, flexShrink:0, borderLeft:`1px solid ${T.b1}`, padding:"44px 0 44px 28px", position:"sticky", top:108, alignSelf:"flex-start" }}>
              {/* Stats */}
              <p style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9.5, fontWeight:700, letterSpacing:"1.8px", textTransform:"uppercase", color:T.t3, marginBottom:16 }}>Summary</p>
              <div onClick={handleDotClick} style={{ display:"flex", alignItems:"center", gap:5, cursor:"default", userSelect:"none", flexShrink:0 }}>
              <span style={{ width:7, height:7, borderRadius:"50%", background:T.green, display:"inline-block", animation:"cjPulse 2.8s ease infinite" }}/>
              <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10, color:T.t3 }}>live</span>
            </div>
              {[{type:"release",label:"Releases"},{type:"improvement",label:"Improvements"},{type:"deprecated",label:"Deprecated"}].map(s => {
                const c = TC[s.type].color;
                const n = logs.filter(l=>l.type===s.type).length;
                const pct = Math.round((n/logs.length)*100);
                return (
                  <div key={s.type} style={{ marginBottom:16 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                        <span style={{ width:6,height:6,borderRadius:"50%",background:c,display:"inline-block" }}/>
                        <span style={{ fontFamily:"'Syne',sans-serif",fontSize:12.5,color:T.t2 }}>{s.label}</span>
                      </div>
                      <span style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:12,fontWeight:700,color:c }}>{n}</span>
                    </div>
                    <div style={{ height:3,borderRadius:2,background:T.b1,overflow:"hidden" }}>
                      <motion.div initial={{ width:0 }} animate={{ width:`${pct}%` }} transition={{ duration:0.7,ease:"easeOut" }} style={{ height:"100%",background:c,borderRadius:2 }}/>
                    </div>
                  </div>
                );
              })}

              <div style={{ height:1,background:T.b1,margin:"20px 0" }}/>

              {/* Filter buttons */}
              <p style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:9.5,fontWeight:700,letterSpacing:"1.8px",textTransform:"uppercase",color:T.t3,marginBottom:12 }}>Filter</p>
              <div style={{ display:"flex",flexDirection:"column",gap:6 }}>
                {FILTERS.map(f => {
                  const active = filter===f.key;
                  const c = f.color||T.acc;
                  return (
                    <button key={f.key} onClick={() => setFilter(f.key)}
                      style={{ display:"flex",alignItems:"center",gap:8,padding:"7px 11px",borderRadius:8,border:`1px solid ${active?c+"44":T.b1}`,background:active?`${c}10`:T.panel,cursor:"pointer",transition:"all 0.15s" }}>
                      {f.key!=="all"&&<span style={{ width:6,height:6,borderRadius:"50%",background:active?c:T.t4,flexShrink:0 }}/>}
                      <span style={{ fontFamily:"'Syne',sans-serif",fontSize:12.5,color:active?c:T.t2,flex:1,fontWeight:active?600:400 }}>{f.label}</span>
                      <span style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:active?c:T.t3 }}>{f.count}</span>
                    </button>
                  );
                })}
              </div>

              <div style={{ height:1,background:T.b1,margin:"20px 0" }}/>

              {/* Latest entry */}
              {/* <p style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:9.5,fontWeight:700,letterSpacing:"1.8px",textTransform:"uppercase",color:T.t3,marginBottom:12 }}>Most Recent</p>
              {(() => {
                const lat = [...logs].sort((a,b)=>new Date(b.date)-new Date(a.date))[0];
                if (!lat) return null;
                const tc2 = TC[lat.type];
                return (
                  <div onClick={()=>setOpenLog(lat)} style={{ padding:"12px",borderRadius:10,border:`1px solid ${T.b1}`,background:T.card,cursor:"pointer",transition:"all 0.16s" }} onMouseEnter={e=>{e.currentTarget.style.borderColor=tc2.color+"44";e.currentTarget.style.background=T.cardH;}} onMouseLeave={e=>{e.currentTarget.style.borderColor=T.b1;e.currentTarget.style.background=T.card;}}>
                    <div style={{ display:"flex",alignItems:"center",gap:5,marginBottom:6 }}>
                      <span style={{ fontSize:13 }}>{tc2.emoji}</span>
                      <span style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:9.5,color:tc2.color,fontWeight:600,letterSpacing:"0.5px" }}>{tc2.label} · {lat.version}</span>
                    </div>
                    <p style={{ fontFamily:"'Syne',sans-serif",fontWeight:600,fontSize:12.5,color:T.t1,lineHeight:1.3,marginBottom:5 }}>{lat.title}</p>
                    <p style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:9.5,color:T.t3 }}>{relT(lat.date)}</p>
                  </div>
                );
              })()} */}
            </aside>
          </div>
        </div>

        {/* ── DETAIL OVERLAY (position:fixed — no scroll jump) ── */}
        <AnimatePresence>
          {openLog && <DetailOverlay log={openLog} onClose={() => setOpenLog(null)} T={T}/>}
        </AnimatePresence>

        {/* ── ADMIN MODAL ── */}
        <AnimatePresence>
          {adminOpen && <AdminModal onClose={() => setAdmin(false)} onPublish={nl => setLogs(prev => [nl, ...prev])} T={T}/>}
        </AnimatePresence>
      </div>
    </>
  );
}