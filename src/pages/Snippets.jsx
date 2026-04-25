import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Code2, Copy, Check, Search, X, Layers } from "lucide-react";
import { SNIPS, LANG_META } from "./../components/SnippetsData";

/* ── THEMES ─────────────────────────────────────────────────────── */
const THEMES = {
  cosmos: { bg:"#07080d", card:"#111420", code:"#0c0e18", border:"rgba(120,130,180,0.1)", t1:"#e8eaf2", t2:"#8892b0", t3:"#2e3660", acc:"#7c6ee0", tag:"rgba(120,130,180,0.07)" },
  void:   { bg:"#000",    card:"#0f0f15", code:"#050507", border:"rgba(100,100,200,0.1)", t1:"#f0f0ff", t2:"#9090b8", t3:"#252540", acc:"#8b7ff0", tag:"rgba(100,100,200,0.07)" },
  aurora: { bg:"#040e0e", card:"#102424", code:"#071414", border:"rgba(80,200,180,0.1)", t1:"#e0f5f5", t2:"#7ab8b8", t3:"#1e4444", acc:"#2dd4bf", tag:"rgba(80,200,180,0.07)" },
  nord:   { bg:"#1a1f2e", card:"#28334a", code:"#1e2535", border:"rgba(136,192,208,0.12)",t1:"#eceff4", t2:"#9ba8c0", t3:"#3a4560", acc:"#88c0d0", tag:"rgba(136,192,208,0.08)" },
  light:  { bg:"#f3f4f8", card:"#ffffff", code:"#f0f1f7", border:"rgba(80,90,150,0.09)", t1:"#111827", t2:"#4b5680", t3:"#c5ccdf", acc:"#6256d0", tag:"rgba(80,90,150,0.06)" },
};
const getTheme = () => { try { return THEMES[localStorage.getItem("cj-theme")] || THEMES.light; } catch { return THEMES.light; } };
function useTheme() {
  const [T, setT] = useState(getTheme);
  useEffect(() => {
    const iv = setInterval(() => { const f = getTheme(); if (f.acc !== T.acc) setT(f); }, 400);
    const fn = () => setT(getTheme());
    window.addEventListener("storage", fn);
    return () => { clearInterval(iv); window.removeEventListener("storage", fn); };
  }, [T]);
  return T;
}

/* ── SYNTAX HIGHLIGHT ───────────────────────────────────────────── */
const KW = "function|return|const|let|var|if|else|async|await|import|export|from|class|type|def|SELECT|FROM|WHERE|ORDER|OVER|PARTITION|ROW_NUMBER|WITH|try|catch|finally|true|false|null|None|self";
function hl(line) {
  return line.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")
    .replace(/(\/\/[^\n]*|#[^\n]*)/g,'<em style="color:#6a9955;font-style:italic">$1</em>')
    .replace(/("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)/g,'<span style="color:#ce9178">$1</span>')
    .replace(new RegExp(`\\b(${KW})\\b`,"g"),'<span style="color:#c792ea">$1</span>')
    .replace(/\b(\d+\.?\d*)\b/g,'<span style="color:#f78c6c">$1</span>');
}

/* ── SNIPPET CARD ───────────────────────────────────────────────── */
function SnipCard({ s, T, i }) {
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);
  const meta = LANG_META[s.lang] || { color: T.acc, label: s.lang.toUpperCase() };
  const lines = s.code.split("\n");
  const SHOW = 6;
  const copy = () => { try { navigator.clipboard.writeText(s.code); } catch(_){} setCopied(true); setTimeout(() => setCopied(false), 1600); };

  return (
    <motion.div layout initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }}
      exit={{ opacity:0, scale:0.97 }} transition={{ duration:0.2, delay:i*0.03, ease:[0.25,1,0.3,1] }}
      style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:16, overflow:"hidden",
        transition:"transform 0.18s,box-shadow 0.18s,border-color 0.18s" }}
      onMouseEnter={e=>{ e.currentTarget.style.transform="translateY(-3px)"; e.currentTarget.style.boxShadow=`0 10px 36px rgba(0,0,0,0.22)`; e.currentTarget.style.borderColor=meta.color+"44"; }}
      onMouseLeave={e=>{ e.currentTarget.style.transform=""; e.currentTarget.style.boxShadow=""; e.currentTarget.style.borderColor=T.border; }}
    >
      {/* color stripe */}
      <div style={{ height:3, background:`linear-gradient(90deg,${meta.color}cc,${meta.color}33)` }}/>

      {/* header */}
      <div style={{ padding:"16px 18px 12px", display:"flex", alignItems:"flex-start", gap:12 }}>
        <div style={{ width:42, height:42, borderRadius:11, background:`${meta.color}18`, border:`1px solid ${meta.color}33`,
          display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0,
          fontFamily:"'JetBrains Mono',monospace", fontWeight:800, fontSize:11, color:meta.color }}>
          {meta.label}
        </div>
        <div style={{ flex:1, minWidth:0 }}>
          <h3 style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:15, color:T.t1, margin:"0 0 4px" }}>{s.title}</h3>
          <p style={{ fontFamily:"'Lora',serif", fontStyle:"italic", fontSize:12.5, color:T.t2, margin:0, lineHeight:1.5 }}>{s.desc}</p>
        </div>
        <button onClick={copy} style={{ flexShrink:0, display:"flex", alignItems:"center", gap:5, padding:"6px 12px",
          borderRadius:8, border:`1px solid ${copied ? meta.color+"55" : T.border}`,
          background: copied ? `${meta.color}14` : "transparent",
          color: copied ? meta.color : T.t2,
          fontFamily:"'JetBrains Mono',monospace", fontSize:11, cursor:"pointer", transition:"all 0.14s" }}>
          {copied ? <Check size={11}/> : <Copy size={11}/>} {copied ? "copied!" : "copy"}
        </button>
      </div>

      {/* code */}
      <div style={{ margin:"0 16px", borderRadius:11, background:T.code, border:`1px solid ${T.border}`, overflow:"hidden" }}>
        <div style={{ padding:"7px 12px", borderBottom:`1px solid ${T.border}`, display:"flex", gap:5, alignItems:"center" }}>
          {["#ff5f57","#ffbd2e","#28ca41"].map(c=><div key={c} style={{ width:8, height:8, borderRadius:"50%", background:c }}/>)}
          <span style={{ marginLeft:"auto", fontFamily:"'JetBrains Mono',monospace", fontSize:9.5, color:T.t2, opacity:0.5 }}>{s.lang}</span>
        </div>
        <div style={{ padding:"12px 6px 12px 0", overflowX:"auto", fontFamily:"'JetBrains Mono',monospace", fontSize:12.5, lineHeight:1.75 }}>
          {(open ? lines : lines.slice(0, SHOW)).map((line, idx) => (
            <div key={idx} style={{ display:"flex" }}>
              <span style={{ width:36, flexShrink:0, textAlign:"right", paddingRight:12, color:T.t3, fontSize:10.5, userSelect:"none" }}>{idx+1}</span>
              <span style={{ color:T.t2, whiteSpace:"pre" }} dangerouslySetInnerHTML={{ __html: hl(line) }}/>
            </div>
          ))}
          {!open && lines.length > SHOW && (
            <div style={{ display:"flex" }}>
              <span style={{ width:36, flexShrink:0 }}/>
              <span style={{ color:T.t2, opacity:0.4, fontSize:11, fontFamily:"'Syne',sans-serif" }}>+{lines.length - SHOW} more…</span>
            </div>
          )}
        </div>
      </div>

      {/* footer */}
      <div style={{ padding:"10px 18px 14px", display:"flex", alignItems:"center", flexWrap:"wrap", gap:6 }}>
        <div style={{ display:"flex", gap:5, flex:1, flexWrap:"wrap" }}>
          {s.tags.map(t => (
            <span key={t} style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10, color:T.t2,
              background:T.tag, border:`1px solid ${T.border}`, padding:"2px 8px", borderRadius:5 }}>#{t}</span>
          ))}
        </div>
        {lines.length > SHOW && (
          <button onClick={() => setOpen(o=>!o)} style={{ fontFamily:"'Syne',sans-serif", fontSize:11.5,
            fontWeight:600, color:meta.color, background:"transparent", border:"none", cursor:"pointer" }}>
            {open ? "Show less ↑" : "Show all ↓"}
          </button>
        )}
      </div>
    </motion.div>
  );
}

/* ── PAGE ───────────────────────────────────────────────────────── */
const LANGS = [...new Set(SNIPS.map(s => s.lang))];
const ALL_TAGS = [...new Set(SNIPS.flatMap(s => s.tags))].sort();

export default function Snippets() {
  const T = useTheme();
  const [q, setQ] = useState("");
  const [lang, setLang] = useState("all");
  const [tag, setTag] = useState("all");

  const filtered = useMemo(() => SNIPS.filter(s =>
    (!q.trim() || (s.title + s.desc + s.tags.join(" ")).toLowerCase().includes(q.toLowerCase())) &&
    (lang === "all" || s.lang === lang) &&
    (tag === "all" || s.tags.includes(tag))
  ), [q, lang, tag]);

  const chip = (label, active, color, onClick) => (
    <button key={label} onClick={onClick} style={{
      padding:"4px 12px", borderRadius:7, border:`1px solid ${active ? color+"44" : T.border}`,
      background: active ? `${color}14` : "transparent",
      color: active ? color : T.t2,
      fontFamily:"'Syne',sans-serif", fontWeight: active ? 700 : 500, fontSize:12.5,
      cursor:"pointer", flexShrink:0, transition:"all 0.12s", whiteSpace:"nowrap",
    }}>{label}</button>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700;800&family=Syne:wght@400;600;700;800&family=Lora:ital,wght@1,400;1,500&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        ::-webkit-scrollbar{width:5px;height:5px;}::-webkit-scrollbar-thumb{background:${T.border};border-radius:4px;}
        ::selection{background:${T.acc}33;}
        .snip-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(400px,1fr));gap:18px;}
        @media(max-width:860px){.snip-grid{grid-template-columns:1fr;}}
        .fscroll{overflow-x:auto;scrollbar-width:none;}.fscroll::-webkit-scrollbar{display:none;}
        @keyframes shimmer{0%{background-position:-200% center}100%{background-position:200% center}}
      `}</style>

      <div style={{ minHeight:"100vh", background:T.bg, color:T.t1, fontFamily:"'Syne',sans-serif" }}>

        {/* HERO */}
        <div style={{ background:T.card, borderBottom:`1px solid ${T.border}`, padding:"100px 24px 52px", position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", inset:0, backgroundImage:`linear-gradient(${T.border} 1px,transparent 1px),linear-gradient(90deg,${T.border} 1px,transparent 1px)`,
            backgroundSize:"44px 44px", maskImage:"radial-gradient(ellipse 70% 70% at 50% 30%,black,transparent)", pointerEvents:"none" }}/>
          <div style={{ maxWidth:860, margin:"0 auto", position:"relative" }}>
            <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}}
              style={{ display:"inline-flex", alignItems:"center", gap:7, padding:"4px 14px", borderRadius:100,
                background:`${T.acc}18`, border:`1px solid ${T.acc}40`, marginBottom:18 }}>
              <Code2 size={12} color={T.acc}/>
              <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10, fontWeight:700, color:T.acc, letterSpacing:"0.12em", textTransform:"uppercase" }}>Snippet Library</span>
            </motion.div>

            <motion.h1 initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:0.07}}
              style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:"clamp(30px,5.5vw,54px)",
                lineHeight:1.06, letterSpacing:"-1.3px", marginBottom:12, color:T.t1 }}>
              Copy. Paste.{" "}
              {/* <span style={{ background:`linear-gradient(90deg,${T.acc},#5eead4,${T.acc})`, backgroundSize:"200% auto",
                WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text",
                animation:"shimmer 4s linear infinite" }}>Paste.</span> */}
              <br/>Understand.
            </motion.h1>

            <motion.p initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.14}}
              style={{ fontFamily:"'Lora',serif", fontStyle:"italic", fontSize:16, color:T.t2, lineHeight:1.7, maxWidth:440, marginBottom:24 }}>
              {SNIPS.length} production-ready patterns - zero fluff, copy and run.
            </motion.p>

            {/* Search */}
            <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.18}} style={{ position:"relative", maxWidth:480 }}>
              <Search size={15} color={T.t2} style={{ position:"absolute", left:14, top:"50%", transform:"translateY(-50%)", pointerEvents:"none" }}/>
              <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search snippets…"
                style={{ width:"100%", background:T.code, border:`1.5px solid ${q ? T.acc+"77" : T.border}`,
                  borderRadius:11, padding:"12px 42px", fontFamily:"'Syne',sans-serif",
                  fontSize:14, color:T.t1, outline:"none", transition:"border-color 0.15s" }}/>
              {q && <button onClick={()=>setQ("")} style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)",
                background:"transparent", border:"none", cursor:"pointer", color:T.t2, display:"flex" }}><X size={14}/></button>}
            </motion.div>
          </div>
        </div>

        {/* FILTER BAR */}
        <div style={{ background:T.card, borderBottom:`1px solid ${T.border}`, top:60, zIndex:40,
          backdropFilter:"blur(16px)", WebkitBackdropFilter:"blur(16px)" }}>
          <div style={{ maxWidth:860, margin:"0 auto", padding:"0 24px" }}>
            <div className="fscroll" style={{ display:"flex", alignItems:"center", gap:5, padding:"9px 0" }}>
              {["all",...LANGS].map(l => chip(l==="all"?"All":l, lang===l, LANG_META[l]?.color||T.acc, ()=>setLang(l)))}
              <div style={{ width:1, height:18, background:T.border, flexShrink:0, margin:"0 3px" }}/>
              {/* {["all",...ALL_TAGS.slice(0,10)].map(t => (
                <button key={t} onClick={()=>setTag(t)} style={{
                  padding:"3px 9px", borderRadius:6, border:`1px solid ${tag===t ? T.acc+"55" : T.border}`,
                  background: tag===t ? `${T.acc}12` : "transparent", color: tag===t ? T.acc : T.t2,
                  fontFamily:"'JetBrains Mono',monospace", fontSize:10.5, cursor:"pointer", flexShrink:0, transition:"all 0.12s" }}>
                  {t==="all" ? "all" : `#${t}`}
                </button>
              ))}
              <span style={{ marginLeft:"auto", fontFamily:"'JetBrains Mono',monospace", fontSize:10.5, color:T.t2, flexShrink:0 }}>
                {filtered.length}/{SNIPS.length}
              </span> */}
            </div>
          </div>
        </div>

        {/* GRID */}
        <div style={{ maxWidth:860, margin:"0 auto", padding:"28px 24px 90px" }}>
          <AnimatePresence mode="popLayout">
            {filtered.length > 0
              ? <div className="snip-grid">{filtered.map((s,i)=><SnipCard key={s.id} s={s} T={T} i={i}/>)}</div>
              : <motion.div initial={{opacity:0}} animate={{opacity:1}} style={{ textAlign:"center", padding:"70px 0", color:T.t2 }}>
                  <Layers size={34} style={{ opacity:0.3, marginBottom:12 }}/>
                  <p style={{ fontSize:15, marginBottom:6 }}>No snippets match</p>
                  <button onClick={()=>{setQ("");setLang("all");setTag("all");}} style={{
                    marginTop:12, padding:"7px 18px", borderRadius:9, border:`1px solid ${T.border}`,
                    background:"transparent", color:T.t2, fontFamily:"'Syne',sans-serif", fontWeight:600, fontSize:13, cursor:"pointer" }}>
                    Clear filters
                  </button>
                </motion.div>
            }
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}