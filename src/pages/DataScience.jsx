import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BarChart2, ArrowUpRight, CheckCircle2, ChevronRight } from "lucide-react";

const PT = { cosmos: { shell: "#07080d", deep: "#0c0e18", mid: "#111420", surface: "#161927", panel: "#1a1e2e", hover: "#1e2335", card: "#161927", cardH: "#1c2235", t1: "#e8eaf2", t2: "#8892b0", t3: "#5a6488", t4: "#2e3660", b1: "rgba(120,130,180,0.08)", b2: "rgba(120,130,180,0.15)", b3: "rgba(120,130,180,0.24)" }, void: { shell: "#000", deep: "#050507", mid: "#0a0a0f", surface: "#0f0f15", panel: "#141419", hover: "#1a1a22", card: "#0f0f15", cardH: "#161622", t1: "#f0f0ff", t2: "#9090b8", t3: "#505070", t4: "#252540", b1: "rgba(100,100,200,0.08)", b2: "rgba(100,100,200,0.14)", b3: "rgba(100,100,200,0.22)" }, aurora: { shell: "#040e0e", deep: "#071414", mid: "#0b1c1c", surface: "#102424", panel: "#142a2a", hover: "#1a3333", card: "#102424", cardH: "#162e2e", t1: "#e0f5f5", t2: "#7ab8b8", t3: "#3d7878", t4: "#1e4444", b1: "rgba(80,200,180,0.08)", b2: "rgba(80,200,180,0.15)", b3: "rgba(80,200,180,0.24)" }, nord: { shell: "#1a1f2e", deep: "#1e2535", mid: "#232c40", surface: "#28334a", panel: "#2d3a50", hover: "#344260", card: "#28334a", cardH: "#2e3d55", t1: "#eceff4", t2: "#9ba8c0", t3: "#5c6a88", t4: "#3a4560", b1: "rgba(136,192,208,0.1)", b2: "rgba(136,192,208,0.18)", b3: "rgba(136,192,208,0.28)" }, light: { shell: "#f3f4f8", deep: "#fff", mid: "#f0f1f7", surface: "#fff", panel: "#f7f8fc", hover: "#eef0f8", card: "#fff", cardH: "#f5f6fc", t1: "#111827", t2: "#4b5680", t3: "#7c87a8", t4: "#c5ccdf", b1: "rgba(80,90,150,0.08)", b2: "rgba(80,90,150,0.15)", b3: "rgba(80,90,150,0.24)" } };
const getT = () => { try { return PT[localStorage.getItem("cj-theme")] || PT.cosmos; } catch { return PT.cosmos; } };
function useTheme() { const [T, setT] = useState(getT); useEffect(() => { const iv = setInterval(() => { const f = getT(); if (f.t1 !== T.t1) setT(f); }, 500); return () => clearInterval(iv); }, [T]); useEffect(() => { const fn = () => setT(getT()); window.addEventListener("storage", fn); return () => window.removeEventListener("storage", fn); }, []); return T; }

function hlPy(line) {
  let s = line.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  s = s.replace(/(#[^\n]*)/g, '<span>$1</span>');
  s = s.replace(/("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|"""[\s\S]*?"""|\'\'\'[\s\S]*?\'\'\')/g, '<span style="color:#ce9178">$1</span>');
  s = s.replace(/\b(def|class|return|if|elif|else|for|while|in|import|from|with|as|print|True|False|None|lambda|and|or|not|try|except|raise|pass|break|continue|yield|async|await|SELECT|FROM|WHERE|GROUP|BY|ORDER|JOIN|ON|HAVING|LIMIT|WITH|AS|INNER|LEFT|RIGHT|FULL|OUTER|COUNT|SUM|AVG|MAX|MIN|RANK|LAG|LEAD|PARTITION|OVER|ROUND|NULLIF|COALESCE|CASE|WHEN|THEN|END|INTO|INSERT|UPDATE|SET|DELETE|DISTINCT|UNION|INTERSECT|EXCEPT|CREATE|TABLE|INDEX|VIEW|ROW_NUMBER)\b/g, '<span style="color:#c792ea">$1</span>');
  s = s.replace(/\b(\d+\.?\d*)\b/g, '<span style="color:#f78c6c">$1</span>');
  return s;
}

const CodeWin = ({ code, title, lang, accent, T }) => {
  const [copied, setCopied] = useState(false);
  const copy = () => { try { navigator.clipboard.writeText(code); } catch (e) { } setCopied(true); setTimeout(() => setCopied(false), 1800); };
  return (
    <div style={{ borderRadius: 13, overflow: "hidden", border: `1px solid ${T.b2}`, background: T.deep }}>
      <div style={{ background: T.panel, padding: "9px 16px", borderBottom: `1px solid ${T.b1}`, display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ display: "flex", gap: 5 }}>{["#f47067", "#f9c74f", "#6fcf97"].map((c, i) => <div key={i} style={{ width: 9, height: 9, borderRadius: "50%", background: c }} />)}</div>
        <span style={{ flex: 1, textAlign: "center", fontSize: 11, color: T.t3, fontFamily: "'JetBrains Mono',monospace" }}>{title}</span>
        <button onClick={copy} style={{ padding: "2px 9px", borderRadius: 5, border: `1px solid ${T.b2}`, background: "transparent", fontSize: 10, color: copied ? accent : T.t3, cursor: "pointer", fontFamily: "'JetBrains Mono',monospace", transition: "color 0.14s" }}>{copied ? "copied ✓" : "copy"}</button>
      </div>
      <div style={{ padding: "16px 18px", overflowX: "auto", fontFamily: "'JetBrains Mono',monospace", fontSize: 12.5 }}>
        {code.split("\n").map((line, i) => (
          <div key={i} style={{ display: "flex", lineHeight: "1.72", minHeight: "1.72em" }}>
            <span style={{ color: T.t4, width: 28, flexShrink: 0, userSelect: "none", fontSize: 10.5 }}>{i + 1}</span>
            <span style={{ color: T.t2, whiteSpace: "pre" }} dangerouslySetInnerHTML={{ __html: hlPy(line) }} />
          </div>
        ))}
      </div>
    </div>
  );
};

const Analogy = ({ text, accent, T }) => (
  <div style={{ background: `${accent}0d`, borderLeft: `3px solid ${accent}`, borderRadius: "0 10px 10px 0", padding: "14px 18px", margin: "18px 0" }}>
    <p style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 10.5, color: accent, letterSpacing: "1.2px", textTransform: "uppercase", marginBottom: 7 }}>💡 Think of it this way</p>
    <p style={{ fontFamily: "'Lora',serif", fontStyle: "italic", fontSize: 15.5, color: T.t1, lineHeight: 1.8, margin: 0 }}>{text}</p>
  </div>
);

const ConceptGrid = ({ items, accent, T }) => (
  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 10, marginBottom: 20 }}>
    {items.map(({ k, v }) => (
      <div key={k} style={{ padding: "13px 15px", borderRadius: 11, border: `1px solid ${T.b1}`, background: T.card, transition: "all 0.15s" }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = `${accent}44`; e.currentTarget.style.background = T.cardH; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = T.b1; e.currentTarget.style.background = T.card; }}>
        <p style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 13, color: accent, margin: "0 0 5px" }}>{k}</p>
        <p style={{ fontFamily: "'Lora',serif", fontSize: 13, color: T.t2, lineHeight: 1.65, margin: 0 }}>{v}</p>
      </div>
    ))}
  </div>
);

const ResourceRow = ({ links, T }) => (
  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, paddingTop: 4 }}>
    {links.map(({ label, href, type }) => {
      const isYt = type === "yt"; const color = isYt ? "#f87171" : "#60a5fa"; return (
        <a key={label} href={href} target="_blank" rel="noreferrer"
          style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "5px 12px", borderRadius: 8, border: `1px solid ${color}35`, background: `${color}0c`, textDecoration: "none", transition: "all 0.15s" }}
          onMouseEnter={e => e.currentTarget.style.background = `${color}1a`}
          onMouseLeave={e => e.currentTarget.style.background = `${color}0c`}>
          <span style={{ fontSize: 11 }}>{isYt ? "▶" : "📖"}</span>
          <span style={{ fontFamily: "'Syne',sans-serif", fontSize: 12.5, fontWeight: 600, color }}>{label}</span>
        </a>
      );
    })}
  </div>
);

const SectionHead = ({ num, title, emoji, color, sub, T }) => (
  <div style={{ marginBottom: 28 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
      <div style={{ width: 36, height: 36, borderRadius: 10, background: `${color}18`, border: `1px solid ${color}35`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 18 }}>{emoji}</div>
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "clamp(20px,3vw,28px)", color: T.t1, margin: 0, letterSpacing: "-0.4px" }}>{title}</h2>
          <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10.5, fontWeight: 700, color, background: `${color}14`, border: `1px solid ${color}28`, padding: "2px 8px", borderRadius: 5 }}>{num}</span>
        </div>
        <p style={{ fontFamily: "'Lora',serif", fontStyle: "italic", fontSize: 13.5, color: T.t3, margin: 0 }}>{sub}</p>
      </div>
    </div>
    <div style={{ height: 2, width: 48, borderRadius: 2, background: color, opacity: 0.7 }} />
  </div>
);

const Divider = ({ T }) => <div style={{ height: 1, background: `linear-gradient(to right,${T.b2},${T.b1},transparent)`, margin: "60px 0" }} />;

/* MINI BAR CHART (pure SVG, animated) */
const BarChart = ({ data, color, title, T }) => {
  const max = Math.max(...data.map(d => d.v));
  const h = 80, w = 420, barW = Math.min(40, (w - 40) / data.length - 6);
  return (
    <div style={{ background: T.panel, borderRadius: 12, padding: "16px", border: `1px solid ${T.b1}`, marginBottom: 8 }}>
      <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: T.t3, marginBottom: 12, letterSpacing: "0.5px" }}>{title}</p>
      <svg viewBox={`0 0 ${w} ${h + 30}`} style={{ width: "100%", display: "block" }}>
        {data.map((d, i) => {
          const barH = (d.v / max) * h;
          const x = 20 + i * ((w - 40) / data.length) + (((w - 40) / data.length) - barW) / 2;
          return (
            <g key={d.l}>
              <rect x={x} y={h - barH} width={barW} height={barH} rx="3" fill={color} opacity="0.75" />
              <text x={x + barW / 2} y={h + 14} textAnchor="middle" fill={T.t3} fontSize="9" fontFamily="JetBrains Mono">{d.l}</text>
              <text x={x + barW / 2} y={h - barH - 5} textAnchor="middle" fill={color} fontSize="9" fontFamily="JetBrains Mono" fontWeight="700">{d.v}</text>
            </g>
          );
        })}
        <line x1="15" y1="0" x2="15" y2={h} stroke={T.b2} strokeWidth="1" />
        <line x1="15" y1={h} x2={w} y2={h} stroke={T.b2} strokeWidth="1" />
      </svg>
    </div>
  );
};

/* DATA PIPELINE DIAGRAM */
const PipelineDiagram = ({ T }) => (
  <svg viewBox="0 0 480 80" style={{ width: "100%", maxWidth: 480, display: "block" }}>
    {[
      ["Collect", 20, "#4ade80"], ["Clean", 100, "#60a5fa"], ["Explore", 180, "#a78bfa"],
      ["Visualise", 260, "#f472b6"], ["Model", 340, "#f97316"]
    ].map(([lbl, x, col], i, arr) => (
      <g key={lbl}>
        <rect x={x} y="20" width="72" height="30" rx="6" fill={col + "16"} stroke={col + "55"} strokeWidth="1.5" />
        <text x={x + 36} y="39" textAnchor="middle" fill={col} fontSize="9.5" fontFamily="JetBrains Mono" fontWeight="700">{lbl}</text>
        {i < arr.length - 1 && <path d={`M${x + 72} 35 L${arr[i + 1][1]} 35`} stroke={T.b3} strokeWidth="1.5" markerEnd="url(#arrow)" />}
      </g>
    ))}
    <defs><marker id="arrow" markerWidth="8" markerHeight="6" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill={T.b3} /></marker></defs>
    <text x="240" y="72" textAnchor="middle" fill={T.t3} fontSize="9.5" fontFamily="JetBrains Mono">The data science workflow - every project follows these six phases</text>
  </svg>
);

const SECTIONS = [
  { id: "overview", label: "Overview", emoji: "📊", color: "#f472b6" },
  { id: "python", label: "Python", emoji: "Py", color: "#4ade80" },
  { id: "numpy", label: "NumPy & Pandas", emoji: "Pd", color: "#60a5fa" },
  { id: "viz", label: "Matplotlib & Seaborn", emoji: "📈", color: "#f472b6" },
  { id: "sql", label: "SQL", emoji: "SQL", color: "#a78bfa" },
  { id: "stats", label: "Statistics", emoji: "📐", color: "#38bdf8" },
  { id: "ml", label: "Machine Learning", emoji: "🤖", color: "#f97316" },
  { id: "r", label: "R Language", emoji: "R", color: "#f472b6" },
  { id: "resources", label: "Resources", emoji: "📚", color: "#22c55e" },
];

export default function DataScience() {
  const T = useTheme();
  const [active, setActive] = useState("overview");
  const obsRef = useRef(null);
  const ACCENT = "#f472b6";

  useEffect(() => {
    if (obsRef.current) obsRef.current.disconnect();
    obsRef.current = new IntersectionObserver(entries => { entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); }); }, { rootMargin: "-20% 0px -65% 0px", threshold: 0 });
    SECTIONS.forEach(s => { const el = document.getElementById(s.id); if (el) obsRef.current.observe(el); });
    return () => obsRef.current?.disconnect();
  }, [T]);

  const jump = id => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600&family=Syne:wght@400;500;600;700;800&family=Lora:ital,wght@0,400;0,500;1,400;1,500&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        html{scroll-behavior:smooth;}body{background:${T.shell};}
        ::-webkit-scrollbar{width:5px;}::-webkit-scrollbar-thumb{background:${T.hover};border-radius:3px;}
        ::selection{background:rgba(244,114,182,0.2);}
        .ds-sec{scroll-margin-top:80px;}
        code{font-family:"'JetBrains Mono',monospace";background:${T.panel};padding:1px 6px;border-radius:4px;font-size:0.88em;color:${ACCENT};}
        @media(max-width:900px){.ds-rail{display:none!important;}.ds-main{padding:40px 20px 80px!important;}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
      `}</style>
      <div style={{ minHeight: "100vh", background: T.shell, color: T.t1, fontFamily: "'Syne',sans-serif" }}>

        {/* HERO */}
        <div style={{ background: T.deep, borderBottom: `1px solid ${T.b1}`, padding: "96px 24px 56px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(${T.b1} 1px,transparent 1px),linear-gradient(90deg,${T.b1} 1px,transparent 1px)`, backgroundSize: "48px 48px", maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%,black 20%,transparent 100%)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", left: "65%", top: "50%", transform: "translate(-50%,-50%)", width: 500, height: 380, borderRadius: "50%", background: `radial-gradient(ellipse,${ACCENT}18 0%,transparent 70%)`, filter: "blur(55px)", pointerEvents: "none" }} />
          <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative", display: "flex", alignItems: "center", gap: 52, flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 280, animation: "fadeUp 0.5s ease both" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "4px 14px", borderRadius: 100, background: `${ACCENT}14`, border: `1px solid ${ACCENT}40`, marginBottom: 18 }}>
                <BarChart2 size={12} color={ACCENT} />
                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, fontWeight: 700, color: ACCENT, letterSpacing: "2px", textTransform: "uppercase" }}>Data Science</span>
              </div>
              <h1 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "clamp(34px,5.5vw,58px)", lineHeight: 1.07, letterSpacing: "-1.4px", marginBottom: 16, color: T.t1 }}>
                Find the signal<br /><span style={{ color: ACCENT }}>in the noise.</span>
              </h1>
              <p style={{ fontFamily: "'Lora',serif", fontStyle: "italic", fontSize: "clamp(14px,1.9vw,17.5px)", color: T.t2, lineHeight: 1.85, maxWidth: 500, marginBottom: 24 }}>
                Data science is the discipline of asking questions of data and finding answers that change decisions. Netflix decides which shows to fund. Hospitals predict which patients need urgent care. Every company that collects data - which is every company - needs people who can make sense of it.
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", rowGap: 6 }}>
                {SECTIONS.filter(s => s.id !== "overview" && s.id !== "resources").map((s, i, arr) => (
                  <React.Fragment key={s.id}>
                    <button onClick={() => jump(s.id)} style={{ display: "flex", alignItems: "center", gap: 5, padding: "4px 11px", borderRadius: 7, border: `1px solid ${s.color}40`, background: `${s.color}0e`, cursor: "pointer", fontFamily: "'Syne',sans-serif", fontWeight: 600, fontSize: 12.5, color: s.color, transition: "all 0.14s" }}
                      onMouseEnter={e => e.currentTarget.style.background = `${s.color}1e`}
                      onMouseLeave={e => e.currentTarget.style.background = `${s.color}0e`}>{s.label}</button>
                    {i < arr.length - 1 && <ChevronRight size={12} color={T.t4} />}
                  </React.Fragment>
                ))}
              </div>
            </div>
            <div style={{ flex: "0 0 auto", animation: "fadeUp 0.5s ease 0.1s both", opacity: 0, animationFillMode: "forwards" }}>
              <PipelineDiagram T={T} />
              <BarChart title="Sample output: monthly revenue by category" color={ACCENT} T={T} data={[
                { l: "Jan", v: 42 }, { l: "Feb", v: 68 }, { l: "Mar", v: 55 }, { l: "Apr", v: 84 }, { l: "May", v: 61 }, { l: "Jun", v: 95 }
              ]} />
            </div>
          </div>
        </div>

        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "flex-start", gap: 0 }}>
          {/* TOC */}
          <aside className="ds-rail" style={{ width: 200, flexShrink: 0, position: "sticky", top: 70, alignSelf: "flex-start", paddingTop: 44, paddingRight: 22, paddingBottom: 44 }}>
            <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9.5, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: T.t3, marginBottom: 14 }}>Contents</p>
            {SECTIONS.map(s => {
              const isAct = active === s.id; return (
                <button key={s.id} onClick={() => jump(s.id)} style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "7px 10px", borderRadius: 8, border: "none", background: isAct ? `${s.color}14` : "transparent", cursor: "pointer", textAlign: "left", marginBottom: 2, transition: "all 0.14s", borderLeft: isAct ? `2px solid ${s.color}` : "2px solid transparent" }}>
                  <span style={{ fontSize: 12, flexShrink: 0 }}>{s.emoji}</span>
                  <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: isAct ? 700 : 500, fontSize: 13, color: isAct ? s.color : T.t2, transition: "color 0.14s" }}>{s.label}</span>
                </button>
              );
            })}
            <div style={{ marginTop: 20, padding: "11px 12px", background: T.panel, borderRadius: 10, border: `1px solid ${T.b1}` }}>
              <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: T.t3, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 6 }}>Timeline</p>
              <p style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 14.5, color: ACCENT, margin: 0 }}>6–8 months</p>
              <p style={{ fontFamily: "'Lora',serif", fontSize: 11.5, color: T.t3, margin: "3px 0 0", fontStyle: "italic" }}>to analyst-ready</p>
            </div>
          </aside>

          <main className="ds-main" style={{ flex: 1, minWidth: 0, paddingTop: 44, paddingBottom: 100 }}>

            {/* OVERVIEW */}
            <section id="overview" className="ds-sec">
              <SectionHead num="Intro" title="The Data Science Stack" emoji="📊" color={ACCENT} sub="Six skills, one workflow, unlimited questions to answer." T={T} />
              <p style={{ fontFamily: "'Lora',serif", fontSize: 16, color: T.t2, lineHeight: 1.92, marginBottom: 20 }}>
                Data science is not one tool - it's a workflow. You <strong style={{ color: "#4ade80" }}>collect</strong> data, <strong style={{ color: "#60a5fa" }}>clean</strong> it (most of the job), <strong style={{ color: "#a78bfa" }}>explore</strong> it, <strong style={{ color: "#f472b6" }}>visualise</strong> it, optionally <strong style={{ color: "#f97316" }}>build a model</strong>, and then <strong style={{ color: "#fbbf24" }}>communicate</strong> the findings to people who make decisions. This track teaches you the tools for each phase.
              </p>
              <div style={{ marginBottom: 28 }}>
                <PipelineDiagram T={T} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 12, marginBottom: 24 }}>
                {[
                  { k: "Data Analyst", v: "SQL + Python + Excel + visualisation. Most common entry role. No ML required.", color: "#60a5fa" },
                  { k: "Data Scientist", v: "All of the above + statistics + ML models. More senior, more maths.", color: ACCENT },
                  { k: "ML Engineer", v: "Builds production ML systems. Python + cloud + software engineering skills required.", color: "#f97316" },
                ].map(c => (
                  <div key={c.k} style={{ padding: "14px 16px", borderRadius: 12, border: `1px solid ${c.color}30`, background: T.card, borderTop: `2px solid ${c.color}` }}>
                    <p style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 14, color: c.color, marginBottom: 6 }}>{c.k}</p>
                    <p style={{ fontFamily: "'Lora',serif", fontSize: 13.5, color: T.t2, lineHeight: 1.65, margin: 0 }}>{c.v}</p>
                  </div>
                ))}
              </div>
              <div style={{ background: `${ACCENT}0c`, border: `1px solid ${ACCENT}28`, borderRadius: 12, padding: "14px 18px" }}>
                <p style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 12, color: ACCENT, marginBottom: 6 }}>⚠️ The most common beginner mistake</p>
                <p style={{ fontFamily: "'Lora',serif", fontSize: 14.5, color: T.t1, lineHeight: 1.72, margin: 0 }}>Rushing to machine learning before mastering <strong>data cleaning, SQL, and visualisation</strong>. Most data analyst roles require zero ML. Master those three first. The most important skill in data science is communicating findings clearly to someone who doesn't code.</p>
              </div>
            </section>

            <Divider T={T} />

            {/* PYTHON */}
            <section id="python" className="ds-sec">
              <SectionHead num="Week 1–4" title="Python for Data" emoji="Py" color="#4ade80" sub="The language of data science - readable, fast to write, faster to run with libraries." T={T} />
              <Analogy accent="#4ade80" T={T} text="Python is to data science what Excel is to accountants - except infinitely more powerful, free, and automatable. It reads almost like English, which is why scientists, economists, and biologists who've never coded before can learn it in weeks. 90% of everything you'll do in data science happens in Python: loading data, cleaning it, visualising it, modelling it." />
              <ConceptGrid accent="#4ade80" T={T} items={[
                { k: "Variables & Types", v: "Python is dynamically typed - no type declarations. int, float, str, bool, None. Use type hints for clarity." },
                { k: "Lists & Dicts", v: "[1,2,3] for ordered collections. {'name':'Alex','age':30} for key-value pairs. Both mutable." },
                { k: "List Comprehensions", v: "[x*2 for x in data if x>0] - filter and transform in one readable line. Faster than a for loop." },
                { k: "Functions & Lambda", v: "def clean(text): return text.strip().lower(). Lambda: lambda x: x*2. Lambdas for simple one-line transforms." },
                { k: "f-strings", v: 'name="Alex"; print(f"Hello {name}") - embed expressions in strings. Cleaner than concatenation.' },
                { k: "Context Managers", v: "with open('data.csv') as f: - automatically closes the file even if an error occurs. Always use with open()." },
                { k: "Classes (for DS)", v: "Use sparingly. You'll mostly use library classes (DataFrame, Model). Know how to read class docs though." },
                { k: "Virtual Environments", v: "python -m venv venv → source venv/bin/activate → pip install pandas. Never install packages globally." },
                { k: "Jupyter Notebooks", v: ".ipynb files. Mix code, output, and text. The standard for exploratory analysis and sharing results." },
                { k: "Type Hints", v: "def process(df: pd.DataFrame) -> pd.Series: - hints don't enforce types but make code readable and IDE-friendly." },
              ]} />
              <CodeWin accent="#4ade80" lang="python" T={T} title="Python - basics to data thinking" code={`# 1. Variables
name = "Alex"
age = 21

# 2. List
sales = [120, 200, 150]

# 3. Loop
for s in sales:
    print(s)

# 4. Function
def double(x):
    return x * 2

print(double(5))

# 5. List comprehension (important)
high_sales = [s for s in sales if s > 150]

# 6. Dictionary
user = {"name": "Alex", "age": 21}

# 7. Real Example
total = sum(sales)
avg = total / len(sales)

print("Total:", total)
print("Average:", avg)`} />
              <ResourceRow T={T} links={[
                { label: "Python Official Tutorial", href: "https://docs.python.org/3/tutorial", type: "doc" },
                { label: "Kaggle Learn Python", href: "https://www.kaggle.com/learn/python", type: "doc" },
                { label: "Sentdex Python", href: "https://www.youtube.com/@sentdex", type: "yt" },
              ]} />
            </section>

            <Divider T={T} />

            {/* NUMPY + PANDAS */}
            <section id="numpy" className="ds-sec">
              <SectionHead num="Week 5–8" title="NumPy & Pandas" emoji="Pd" color="#60a5fa" sub="The engine that makes Python fast enough for real data." T={T} />
              <Analogy accent="#60a5fa" T={T} text="Imagine you have a spreadsheet with 1 million rows and you need to multiply every value in a column by 1.08 (a tax rate). In plain Python this would loop 1 million times and take maybe 10 seconds. NumPy does it in 0.01 seconds because it uses compiled C code under the hood. Pandas is NumPy plus a spreadsheet interface - you get row labels, column names, and the ability to combine datasets like SQL joins." />
              <BarChart title="NumPy array operations vs Python loop - speed comparison (ms)" color="#60a5fa" T={T} data={[
                { l: "Loop 10K", v: 120 }, { l: "NumPy 10K", v: 2 }, { l: "Loop 100K", v: 1200 }, { l: "NumPy 100K", v: 8 }, { l: "Loop 1M", v: 11000 }, { l: "NumPy 1M", v: 70 }
              ]} />
              <ConceptGrid accent="#60a5fa" T={T} items={[
                { k: "NumPy Arrays", v: "np.array([1,2,3]) - like a list but typed and fast. Supports element-wise operations without loops." },
                { k: "Broadcasting", v: "array * 1.08 multiplies every element. array[array > 100] filters without a loop. This is the core NumPy pattern." },
                { k: "DataFrame", v: "pd.read_csv('data.csv') loads it. df.head() shows first 5 rows. df.info() shows types. df.describe() shows statistics." },
                { k: "Selecting data", v: "df['column'] for a series. df[['a','b']] for multiple columns. df.loc[row,col] for labels. df.iloc[0,0] for positions." },
                { k: "Filtering rows", v: "df[df['sales'] > 100] - boolean mask. df.query('sales > 100 and region == \"North\"') - readable string syntax." },
                { k: "GroupBy", v: "df.groupby('category')['amount'].agg(['mean','sum','count']) - summarise by category in one line." },
                { k: "Merge / Join", v: "pd.merge(customers, orders, on='customer_id', how='left') - same as SQL LEFT JOIN. Combine related DataFrames." },
                { k: "Missing Values", v: "df.isnull().sum() - count NaNs per column. df.dropna() removes rows. df.fillna(0) replaces NaN with zero." },
                { k: "apply() / map()", v: "df['name'].apply(str.upper) - apply any function to a column. .map() for Series, .apply() for row/column-level." },
                { k: "pd.to_datetime()", v: "Convert string dates to datetime objects. Then df['date'].dt.month, dt.year, dt.day_name() give time features." },
              ]} />
              <CodeWin accent="#60a5fa" lang="python" T={T} title="Pandas - from basics to usage" code={`import pandas as pd

# 1. Create DataFrame
data = {
    "name": ["A", "B", "C"],
    "sales": [100, 200, 150]
}

df = pd.DataFrame(data)

# 2. View data
print(df.head())

# 3. Select column
print(df["sales"])

# 4. Filter
high = df[df["sales"] > 150]

# 5. Add new column
df["double_sales"] = df["sales"] * 2

# 6. Grouping (basic idea)
print(df["sales"].mean())

# 7. Real Example
total_sales = df["sales"].sum()
print("Total:", total_sales)`} />
              <ResourceRow T={T} links={[
                { label: "Pandas Docs", href: "https://pandas.pydata.org/docs", type: "doc" },
                { label: "Kaggle Learn Pandas", href: "https://www.kaggle.com/learn/pandas", type: "doc" },
                { label: "Alex The Analyst", href: "https://www.youtube.com/@AlexTheAnalyst", type: "yt" },
              ]} />
            </section>

            <Divider T={T} />

            {/* MATPLOTLIB + SEABORN */}
            <section id="viz" className="ds-sec">
              <SectionHead num="Week 9–11" title="Matplotlib & Seaborn" emoji="📈" color="#f472b6" sub="Turn numbers into insight anyone can see." T={T} />
              <Analogy accent="#f472b6" T={T} text="A table of 10,000 numbers tells you nothing at a glance. A histogram of those same numbers instantly reveals the distribution - whether it's normal, skewed, bimodal. This is why visualisation is not optional. Matplotlib is the foundation - low-level, full control. Seaborn builds on top with statistical charts that would take 50 lines in Matplotlib but take one line in Seaborn." />
              <BarChart title="Chart types you'll use (weekly frequency in a typical data role)" color="#f472b6" T={T} data={[
                { l: "Bar", v: 95 }, { l: "Line", v: 88 }, { l: "Scatter", v: 72 }, { l: "Heatmap", v: 60 }, { l: "Box", v: 55 }, { l: "Hist", v: 50 }, { l: "Pie", v: 20 }
              ]} />
              <ConceptGrid accent="#f472b6" T={T} items={[
                { k: "plt.subplots()", v: "fig, ax = plt.subplots() - creates a figure and axes. fig.savefig('chart.png', dpi=150) to save it." },
                { k: "Bar charts", v: "ax.bar(categories, values) - compare quantities across categories. Horizontal with barh() for long labels." },
                { k: "Line charts", v: "ax.plot(x, y, marker='o') - show trends over time. Multiple lines: call plot() again with a different series." },
                { k: "Scatter plots", v: "ax.scatter(x, y, c=color_col, alpha=0.6) - show relationships between two numeric variables." },
                { k: "Histograms", v: "ax.hist(data, bins=30, edgecolor='white') - show the distribution of a single numeric variable." },
                { k: "Box plots", v: "seaborn.boxplot(data=df, x='category', y='value') - show median, IQR, and outliers per group." },
                { k: "Heatmaps", v: "sns.heatmap(df.corr(), annot=True, cmap='coolwarm') - show correlations between all numeric columns." },
                { k: "FacetGrid", v: "sns.FacetGrid(df, col='category').map(sns.histplot, 'value') - the same chart repeated per category." },
                { k: "Styling", v: "plt.style.use('dark_background'). seaborn.set_theme(style='whitegrid'). Always label axes and add titles." },
                { k: "Plotly (interactive)", v: "px.bar(df, x='month', y='revenue', color='category') - hover-over data. For dashboards and presentations." },
              ]} />
              <CodeWin accent="#f472b6" lang="python" T={T} title="Matplotlib - simple charts" code={`import matplotlib.pyplot as plt

# 1. Data
months = ["Jan", "Feb", "Mar"]
sales = [100, 200, 150]

# 2. Line chart
plt.plot(months, sales)

# 3. Labels
plt.title("Sales Over Time")
plt.xlabel("Month")
plt.ylabel("Sales")

# 4. Show chart
plt.show()

# 5. Bar chart
plt.bar(months, sales)
plt.show()`} />
              <ResourceRow T={T} links={[
                { label: "Matplotlib Gallery", href: "https://matplotlib.org/stable/gallery", type: "doc" },
                { label: "Seaborn Tutorial", href: "https://seaborn.pydata.org/tutorial", type: "doc" },
                { label: "Plotly Express", href: "https://plotly.com/python/plotly-express", type: "doc" },
                { label: "Rob Mulla (Kaggle EDA)", href: "https://www.youtube.com/@robmulla", type: "yt" },
              ]} />
            </section>

            <Divider T={T} />

            {/* SQL */}
            <section id="sql" className="ds-sec">
              <SectionHead num="Week 12–15" title="SQL" emoji="SQL" color="#a78bfa" sub="The language every database speaks - non-negotiable for data roles." T={T} />
              <Analogy accent="#a78bfa" T={T} text="Every company stores data in databases, and SQL is how you talk to them. Think of a database like a library with millions of books (rows), organised into sections (tables). SQL is how you ask the librarian: 'Give me all mystery novels published after 2010 by British authors, sorted by rating, and tell me how many there are per author.' SQL has been around since the 1970s and is still the #1 expected skill in every data analyst job description." />
              <ConceptGrid accent="#a78bfa" T={T} items={[
                { k: "SELECT + WHERE", v: "SELECT name, salary FROM employees WHERE department = 'Engineering' ORDER BY salary DESC LIMIT 10" },
                { k: "Aggregation", v: "COUNT(*), SUM(amount), AVG(score), MAX(date), MIN(price) - collapse many rows into one summary row" },
                { k: "GROUP BY", v: "GROUP BY category - split rows into groups, then aggregate each group. WHERE filters before grouping, HAVING after." },
                { k: "JOINs", v: "INNER JOIN - only matching rows. LEFT JOIN - all left rows + matches. Use ON to specify the join condition." },
                { k: "Subqueries", v: "SELECT * FROM orders WHERE customer_id IN (SELECT id FROM customers WHERE country = 'India')" },
                { k: "CTEs (WITH clauses)", v: "WITH monthly AS (SELECT ...) SELECT * FROM monthly - name a subquery and reference it. Essential for readability." },
                { k: "Window Functions", v: "RANK() OVER (PARTITION BY region ORDER BY sales DESC) - analytics without collapsing rows. The senior analyst skill." },
                { k: "Date functions", v: "DATE_TRUNC('month', created_at), EXTRACT(year FROM date), date + INTERVAL '7 days' - work with time data" },
                { k: "CASE WHEN", v: "CASE WHEN score >= 90 THEN 'A' WHEN score >= 80 THEN 'B' ELSE 'C' END - conditional column values" },
                { k: "NULL handling", v: "COALESCE(value, 0) returns first non-null. IS NULL / IS NOT NULL for filtering. NULLIF(a, b) returns null if a=b." },
              ]} />
              <CodeWin accent="#a78bfa" lang="sql" T={T} title="SQL - basics to useful queries" code={`-- 1. Select all
SELECT * FROM sales;

-- 2. Select specific columns
SELECT name, amount FROM sales;

-- 3. Filter
SELECT * FROM sales
WHERE amount > 100;

-- 4. Sort
SELECT * FROM sales
ORDER BY amount DESC;

-- 5. Count
SELECT COUNT(*) FROM sales;

-- 6. Group
SELECT category, SUM(amount)
FROM sales
GROUP BY category;

-- 7. Real Example
SELECT category, SUM(amount) AS total
FROM sales
GROUP BY category
ORDER BY total DESC;`} />
              <ResourceRow T={T} links={[
                { label: "DataLemur SQL", href: "https://datalemur.com", type: "doc" },
                { label: "StrataScratch", href: "https://www.stratascratch.com", type: "doc" },
                { label: "Alex The Analyst SQL", href: "https://www.youtube.com/@AlexTheAnalyst", type: "yt" },
                { label: "Mode Analytics SQL", href: "https://mode.com/sql-tutorial", type: "doc" },
              ]} />
            </section>

            <Divider T={T} />

            {/* STATISTICS */}
            <section id="stats" className="ds-sec">
              <SectionHead num="Week 16–18" title="Statistics" emoji="📐" color="#38bdf8" sub="The maths behind why your conclusions are actually true." T={T} />
              <Analogy accent="#38bdf8" T={T} text="Statistics is the language of uncertainty. Without it, you might look at two groups and say 'group A did better than group B' - but was that difference real, or just random noise? Statistics gives you the tools to answer that question with a number: 'there's a 97% probability that this difference is real, not coincidence.' Every A/B test, every ML model evaluation, every business report needs this foundation." />
              <ConceptGrid accent="#38bdf8" T={T} items={[
                { k: "Descriptive Stats", v: "Mean, median, mode, variance, std deviation, skewness. df.describe() gives all of these for a DataFrame." },
                { k: "Distributions", v: "Normal (bell curve), Poisson (rare events), Binomial (yes/no trials). Knowing which distribution fits your data matters." },
                { k: "Central Limit Theorem", v: "Take enough samples and their means will be normally distributed - even if the original data isn't. The foundation of inference." },
                { k: "Hypothesis Testing", v: "H₀ (null: no difference) vs H₁ (alternative: there is a difference). p-value < 0.05 means reject H₀." },
                { k: "t-test", v: "Comparing means of two groups. scipy.stats.ttest_ind(group_a, group_b) - are these groups statistically different?" },
                { k: "Chi-squared test", v: "Testing if two categorical variables are related. Are conversion rates different by device type?" },
                { k: "Correlation vs Causation", v: "df.corr() shows correlation. But correlation ≠ causation. Ice cream sales correlate with drowning rates (both increase in summer)." },
                { k: "Effect Size", v: "A result can be statistically significant but practically meaningless. Cohen's d measures how large the real difference is." },
                { k: "Confidence Intervals", v: "'95% CI: [12.3, 18.7]' - we're 95% sure the true value is in this range. More informative than just the mean." },
                { k: "A/B Testing", v: "Assign users randomly to control/treatment, measure the metric, run a t-test. Minimum sample size matters - calculate it first." },
              ]} />
              <CodeWin accent="#38bdf8" lang="python" T={T} title="Statistics - basic understanding" code={`import numpy as np

data = [10, 20, 30, 40, 50]

# 1. Mean
print(np.mean(data))

# 2. Median
print(np.median(data))

# 3. Standard deviation
print(np.std(data))

# 4. Simple comparison
group_a = [10, 12, 14]
group_b = [20, 22, 24]

print(np.mean(group_a))
print(np.mean(group_b))

# 5. Real Example
if np.mean(group_b) > np.mean(group_a):
    print("Group B performs better")`} />
              <ResourceRow T={T} links={[
                { label: "StatQuest YouTube", href: "https://www.youtube.com/@statquest", type: "yt" },
                { label: "Think Stats (free)", href: "https://greenteapress.com/thinkstats2", type: "doc" },
                { label: "Khan Academy Stats", href: "https://www.khanacademy.org/math/statistics-probability", type: "doc" },
              ]} />
            </section>

            <Divider T={T} />

            {/* MACHINE LEARNING */}
            <section id="ml" className="ds-sec">
              <SectionHead num="Week 19–26" title="Machine Learning" emoji="🤖" color="#f97316" sub="Teaching computers to find patterns humans can't see." T={T} />
              <Analogy accent="#f97316" T={T} text="Machine learning is pattern recognition at scale. A spam filter that reads 10 million emails and learns which words and patterns correlate with spam - that's ML. A price predictor that studied 500,000 past property sales and learned that bedrooms, location, age, and square footage together predict price - that's ML. You don't program the rules. The algorithm finds them from the data." />
              <ConceptGrid accent="#f97316" T={T} items={[
                { k: "What is a Model", v: "A mathematical function that maps inputs (features) to outputs (predictions). You train it on historical data to learn the mapping." },
                { k: "Train / Test Split", v: "Train on 80%, evaluate on the held-out 20%. Testing on training data is cheating - the model memorised it. NEVER do this." },
                { k: "Overfitting", v: "The model memorised the training data too well - 98% accuracy in training, 60% on new data. Reduce complexity or add more data." },
                { k: "Linear Regression", v: "Predict a continuous number (house price, sales amount). Assumes a linear relationship between features and target." },
                { k: "Logistic Regression", v: "Predict a category (spam/not spam, churn/retain). Despite the name, it's a classification algorithm." },
                { k: "Decision Trees", v: "A tree of if-then rules learned from data. Interpretable. Random Forest = hundreds of trees voting together (more accurate)." },
                { k: "Model Evaluation", v: "Regression: MAE, RMSE, R². Classification: accuracy, precision, recall, F1, AUC-ROC. Choose the metric that matches your business goal." },
                { k: "Feature Engineering", v: "Transform raw data into informative features. Normalise numeric features. Encode categoricals. Remove correlated features. This is 80% of the work." },
                { k: "Cross-Validation", v: "Split data into 5 folds, train/test 5 times on different splits. The average score is much more reliable than one train/test split." },
                { k: "GridSearchCV", v: "Automatically try all combinations of hyperparameters and return the best. Pass param_grid={'n_estimators':[100,200], 'max_depth':[3,5,7]}." },
              ]} />
              <CodeWin accent="#f97316" lang="python" T={T} title="ML - simple prediction idea" code={`from sklearn.linear_model import LinearRegression
import numpy as np

# 1. Data (features and labels)
X = np.array([[1], [2], [3], [4]])
y = np.array([2, 4, 6, 8])

# 2. Model
model = LinearRegression()

# 3. Train
model.fit(X, y)

# 4. Predict
pred = model.predict([[5]])

print(pred)

# 5. Real idea
# model learned: y = 2x`} />
              <ResourceRow T={T} links={[
                { label: "Scikit-learn User Guide", href: "https://scikit-learn.org/stable/user_guide.html", type: "doc" },
                { label: "Kaggle Learn ML", href: "https://www.kaggle.com/learn/intro-to-machine-learning", type: "doc" },
                { label: "StatQuest ML", href: "https://www.youtube.com/@statquest", type: "yt" },
                { label: "Hands-On ML (book)", href: "https://www.oreilly.com/library/view/hands-on-machine-learning/9781492032632", type: "doc" },
              ]} />
            </section>

            <Divider T={T} />

            {/* R */}
            <section id="r" className="ds-sec">
              <SectionHead num="Alternative" title="R Language" emoji="R" color="#f472b6" sub="Built by statisticians, for statisticians - the academic standard." T={T} />
              <Analogy accent="#f472b6" T={T} text="R is the language of research papers, pharmaceutical trials, economics departments, and academic statistics. If Python is the Swiss Army knife, R is the surgeon's scalpel - extremely precise for statistical analysis, built specifically for the kind of rigorous work that gets published in peer-reviewed journals. If you're going into biostatistics, academic research, economics, or clinical data - learn R. ggplot2 alone produces better charts than Matplotlib by default." />
              <ConceptGrid accent="#f472b6" T={T} items={[
                { k: "Vectors & DataFrames", v: "c(1,2,3) is a vector. data.frame() is R's DataFrame. tibble() from tidyverse is cleaner." },
                { k: "The Pipe Operator", v: "data |> filter() |> group_by() |> summarise() - chain operations left-to-right. Identical mental model to Python method chaining." },
                { k: "dplyr (data manipulation)", v: "filter(), select(), mutate(), group_by(), summarise(), arrange(), join_left() - equivalent to Pandas operations." },
                { k: "tidyr (reshaping)", v: "pivot_wider() and pivot_longer() - reshape data between wide and long format. Essential for visualisation." },
                { k: "ggplot2 (visualisation)", v: "ggplot(data, aes(x=month, y=revenue)) + geom_line() + geom_point() + theme_minimal() - layered grammar of graphics." },
                { k: "Statistical Tests", v: "t.test(), chisq.test(), aov(), lm() - native R has every statistical test you'll ever need." },
                { k: "lm() Linear Models", v: "model <- lm(salary ~ years_exp + education, data=df) - formula syntax. summary(model) gives coefficients, p-values, R²." },
                { k: "R Markdown", v: "Mix R code, output, and prose in one document. Knit to HTML, PDF, or Word. The standard format for reproducible research." },
                { k: "Shiny", v: "Build interactive web dashboards entirely in R - sliders, dropdowns, reactive charts. No JavaScript needed." },
                { k: "Bioconductor", v: "The R ecosystem for genomics and bioinformatics - 2,000+ packages for biological data analysis." },
              ]} />
              <CodeWin accent="#f472b6" lang="r" T={T} title="R - basics to data usage" code={`# 1. Vector
data <- c(10, 20, 30)

# 2. Mean
mean(data)

# 3. Data frame
df <- data.frame(
  name = c("A", "B", "C"),
  sales = c(100, 200, 150)
)

# 4. Filter
df[df$sales > 150, ]

# 5. Plot
plot(df$sales)

# 6. Real Example
total <- sum(df$sales)
print(total)`} />
              <ResourceRow T={T} links={[
                { label: "R for Data Science", href: "https://r4ds.had.co.nz", type: "doc" },
                { label: "ggplot2 docs", href: "https://ggplot2.tidyverse.org", type: "doc" },
                { label: "TidyTuesday", href: "https://github.com/rfordatascience/tidytuesday", type: "doc" },
                { label: "David Robinson (R)", href: "https://www.youtube.com/@drob", type: "yt" },
              ]} />
            </section>

            <Divider T={T} />

            {/* RESOURCES */}
            <section id="resources" className="ds-sec">
              <SectionHead num="Reference" title="Resource Guide" emoji="📚" color="#22c55e" sub="Curated paths to actual data science jobs." T={T} />
              <p style={{ fontFamily: "'Lora',serif", fontSize: 16, color: T.t2, lineHeight: 1.92, marginBottom: 28 }}>Recommended sequence: <strong style={{ color: T.t1 }}>Kaggle Learn</strong> for Python and Pandas (free, interactive). Then <strong style={{ color: T.t1 }}>DataLemur or StrataScratch</strong> for SQL interview practice. Then <strong style={{ color: T.t1 }}>StatQuest on YouTube</strong> for statistics and ML - Josh Starmer is the best teacher for making maths click without maths anxiety. Finally, enter one Kaggle competition - even finishing is a portfolio piece.</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 12 }}>
                {[
                  { name: "Kaggle Learn", href: "https://www.kaggle.com/learn", type: "doc", desc: "Free interactive Python, Pandas, ML, and SQL courses with real datasets." },
                  { name: "Pandas Documentation", href: "https://pandas.pydata.org/docs", type: "doc", desc: "The official reference - bookmark the 10 Minutes to Pandas guide." },
                  { name: "Scikit-learn User Guide", href: "https://scikit-learn.org/stable/user_guide.html", type: "doc", desc: "Every algorithm explained with examples. The ML bible." },
                  { name: "DataLemur (SQL)", href: "https://datalemur.com", type: "doc", desc: "Real SQL interview questions from Facebook, Uber, Amazon. Practice here." },
                  { name: "R for Data Science", href: "https://r4ds.had.co.nz", type: "doc", desc: "Hadley Wickham's free book on the tidyverse. The definitive R guide." },
                  { name: "Seaborn Gallery", href: "https://seaborn.pydata.org/examples", type: "doc", desc: "Every chart type with full code. Find the right chart for your data here." },
                  { name: "StatQuest with Josh Starmer", href: "https://www.youtube.com/@statquest", type: "yt", desc: "Genuinely the best statistics and ML teacher on the internet. No prior maths needed." },
                  { name: "Alex The Analyst", href: "https://www.youtube.com/@AlexTheAnalyst", type: "yt", desc: "SQL, Python, Tableau tutorials aimed at landing a data analyst job." },
                  { name: "Rob Mulla (EDA)", href: "https://www.youtube.com/@robmulla", type: "yt", desc: "Kaggle competition walkthroughs. Ideal for seeing real EDA in action." },
                  { name: "Sentdex", href: "https://www.youtube.com/@sentdex", type: "yt", desc: "Python data science and ML projects - practical, project-first approach." },
                ].map(r => (
                  <a key={r.name} href={r.href} target="_blank" rel="noreferrer"
                    style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "14px 16px", borderRadius: 12, border: `1px solid ${r.type === "yt" ? "#f87171" : "#60a5fa"}28`, background: r.type === "yt" ? "#f871710a" : "#60a5fa0a", textDecoration: "none", transition: "all 0.16s" }}
                    onMouseEnter={e => { e.currentTarget.style.background = r.type === "yt" ? "#f8717116" : "#60a5fa16"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = r.type === "yt" ? "#f871710a" : "#60a5fa0a"; }}>
                    <span style={{ fontSize: 16, flexShrink: 0, marginTop: 2 }}>{r.type === "yt" ? "▶" : "📖"}</span>
                    <div>
                      <p style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 14, color: T.t1, margin: "0 0 4px" }}>{r.name}</p>
                      <p style={{ fontFamily: "'Lora',serif", fontSize: 13, color: T.t3, margin: 0, lineHeight: 1.55, fontStyle: "italic" }}>{r.desc}</p>
                    </div>
                    <ArrowUpRight size={13} color={T.t4} style={{ marginLeft: "auto", flexShrink: 0, marginTop: 4 }} />
                  </a>
                ))}
              </div>
            </section>

          </main>
        </div>
      </div>
    </>
  );
}