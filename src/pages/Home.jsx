import React, { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight, Code2, Zap, Globe, Brain, Layers, Star,
  ChevronDown, Play, Users, BookOpen, Trophy, Sparkles,
  Terminal, Database, Smartphone, BarChart2,
} from "lucide-react";

/* ══════════════════════════════════════════════════════════════
   THEME SYSTEM - mirrors Profile.jsx exactly
══════════════════════════════════════════════════════════════ */
const THEMES = {
  cosmos: {
    shell:"#07080d", deep:"#0c0e18", mid:"#111420", surface:"#161927",
    panel:"#1a1e2e", hover:"#1e2335", card:"#161927",
    t1:"#e8eaf2", t2:"#8892b0", t3:"#5a6488", t4:"#2e3660",
    b1:"rgba(120,130,180,0.08)", b2:"rgba(120,130,180,0.15)",
    accent:"#7c6ee0", accentS:"rgba(124,110,224,0.15)",
    teal:"#5eead4", green:"#22c55e", red:"#f87171", gold:"#fbbf24",
    heroGlow:"rgba(124,110,224,0.18)", heroBg:"#07080d",
  },
  // void: {
  //   shell:"#000000", deep:"#050507", mid:"#0a0a0f", surface:"#0f0f15",
  //   panel:"#141419", hover:"#1a1a22", card:"#0f0f15",
  //   t1:"#f0f0ff", t2:"#9090b8", t3:"#505070", t4:"#252540",
  //   b1:"rgba(100,100,200,0.08)", b2:"rgba(100,100,200,0.14)",
  //   accent:"#8b7ff0", accentS:"rgba(139,127,240,0.15)",
  //   teal:"#2dd4bf", green:"#34d399", red:"#fc8181", gold:"#fcd34d",
  //   heroGlow:"rgba(139,127,240,0.15)", heroBg:"#000000",
  // },
  // aurora: {
  //   shell:"#040e0e", deep:"#071414", mid:"#0b1c1c", surface:"#102424",
  //   panel:"#142a2a", hover:"#1a3333", card:"#102424",
  //   t1:"#e0f5f5", t2:"#7ab8b8", t3:"#3d7878", t4:"#1e4444",
  //   b1:"rgba(80,200,180,0.08)", b2:"rgba(80,200,180,0.15)",
  //   accent:"#2dd4bf", accentS:"rgba(45,212,191,0.15)",
  //   teal:"#5eead4", green:"#4ade80", red:"#f87171", gold:"#fbbf24",
  //   heroGlow:"rgba(45,212,191,0.15)", heroBg:"#040e0e",
  // },
  // nord: {
  //   shell:"#1a1f2e", deep:"#1e2535", mid:"#232c40", surface:"#28334a",
  //   panel:"#2d3a50", hover:"#344260", card:"#28334a",
  //   t1:"#eceff4", t2:"#9ba8c0", t3:"#5c6a88", t4:"#3a4560",
  //   b1:"rgba(136,192,208,0.1)", b2:"rgba(136,192,208,0.18)",
  //   accent:"#88c0d0", accentS:"rgba(136,192,208,0.15)",
  //   teal:"#8fbcbb", green:"#a3be8c", red:"#bf616a", gold:"#ebcb8b",
  //   heroGlow:"rgba(136,192,208,0.14)", heroBg:"#1a1f2e",
  // },
  light: {
    shell:"#f3f4f8", deep:"#ffffff", mid:"#f0f1f7", surface:"#ffffff",
    panel:"#f7f8fc", hover:"#eef0f8", card:"#ffffff",
    t1:"#111827", t2:"#4b5680", t3:"#7c87a8", t4:"#c5ccdf",
    b1:"rgba(80,90,150,0.08)", b2:"rgba(80,90,150,0.15)",
    accent:"#6256d0", accentS:"rgba(98,86,208,0.1)",
    teal:"#0d9488", green:"#16a34a", red:"#dc2626", gold:"#d97706",
    heroGlow:"rgba(98,86,208,0.1)", heroBg:"#f3f4f8",
  },
};

const getTheme = () => {
  try { return THEMES[localStorage.getItem("cj-theme")] || THEMES.light; }
  catch { return THEMES.light; }
};

const applyThemeToDom = (T) => {
  const r = document.documentElement;
  r.style.setProperty("--cj-shell",   T.shell);
  r.style.setProperty("--cj-deep",    T.deep);
  r.style.setProperty("--cj-surface", T.surface);
  r.style.setProperty("--cj-accent",  T.accent);
  r.style.setProperty("--cj-teal",    T.teal);
  r.style.setProperty("--cj-t1",      T.t1);
  r.style.setProperty("--cj-t2",      T.t2);
  r.style.setProperty("--cj-t3",      T.t3);
};

/* ══════════════════════════════════════════════════════════════
   LANGUAGE DATA
══════════════════════════════════════════════════════════════ */
const LANGUAGES = [
  { name:"JavaScript", color:"#f7df1e", bg:"#1a1800", label:"JS",  icon:"JS"  },
  { name:"Python",     color:"#4ade80", bg:"#0a1f0a", label:"Py",  icon:"Py"  },
  { name:"TypeScript", color:"#60a5fa", bg:"#00111f", label:"TS",  icon:"TS"  },
  { name:"Rust",       color:"#f97316", bg:"#1a0a00", label:"Rs",  icon:"Rs"  },
  { name:"SQL",        color:"#a78bfa", bg:"#0f0a1a", label:"SQL", icon:"SQL" },
  { name:"Flutter",    color:"#5eead4", bg:"#001a17", label:"Fl",  icon:"Fl"  },
  { name:"R Language", color:"#f472b6", bg:"#1a0011", label:"R",   icon:"R"   },
  { name:"Kotlin",     color:"#818cf8", bg:"#0c0c1a", label:"Kt",  icon:"Kt"  },
];

const CODE_SNIPPETS = {
  JavaScript: `function fibonacci(n) {\n  if (n <= 1) return n;\n  return fibonacci(n-1)\n       + fibonacci(n-2);\n}`,
  Python:     `def fibonacci(n):\n    if n <= 1:\n        return n\n    return fibonacci(n-1)\n         + fibonacci(n-2)`,
  TypeScript: `function fib(n: number): number {\n  if (n <= 1) return n;\n  return fib(n - 1)\n       + fib(n - 2);\n}`,
  Rust:       `fn fibonacci(n: u64) -> u64 {\n    match n {\n        0 | 1 => n,\n        _ => fibonacci(n-1)\n           + fibonacci(n-2),\n    }\n}`,
};

const FLOATING_SYMBOLS = [
  "const","fn ","def ","=>","::","{}","[]","()",
  "async","await","import","return","class","type",
  "let","var","if","for","while","match","=>","<T>",
  "null","true","false","use","pub","mod","impl",
];

/* ══════════════════════════════════════════════════════════════
   ANIMATED TYPING COMPONENT
══════════════════════════════════════════════════════════════ */
const TypeWriter = ({ words, T }) => {
  const [idx, setIdx] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) {
      const t = setTimeout(() => setPaused(false), 1400);
      return () => clearTimeout(t);
    }
    const word = words[idx];
    if (!deleting) {
      if (displayed.length < word.length) {
        const t = setTimeout(() => setDisplayed(word.slice(0, displayed.length + 1)), 60);
        return () => clearTimeout(t);
      } else {
        setPaused(true);
        setDeleting(true);
      }
    } else {
      if (displayed.length > 0) {
        const t = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 35);
        return () => clearTimeout(t);
      } else {
        setDeleting(false);
        setIdx((i) => (i + 1) % words.length);
      }
    }
  }, [displayed, deleting, paused, idx, words]);

  const lang = LANGUAGES.find(l => l.name === words[idx]) || LANGUAGES[0];

  return (
    <span style={{ color: lang.color, fontFamily: "'JetBrains Mono', monospace",
      textShadow: `0 0 30px ${lang.color}60`, transition: "color 0.4s" }}>
      {displayed}
      <span style={{ animation: "cjBlink 1s ease infinite", opacity: 1 }}>|</span>
    </span>
  );
};

/* ══════════════════════════════════════════════════════════════
   FLOATING CODE PARTICLES
══════════════════════════════════════════════════════════════ */
const FloatingParticles = ({ T }) => {
  const particles = useRef(
    Array.from({ length: 28 }, (_, i) => ({
      id: i,
      symbol: FLOATING_SYMBOLS[i % FLOATING_SYMBOLS.length],
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 10 + Math.random() * 6,
      duration: 18 + Math.random() * 24,
      delay: Math.random() * 12,
      opacity: 0.04 + Math.random() * 0.1,
    }))
  ).current;

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      {particles.map(p => (
        <motion.div key={p.id}
          initial={{ y: 0, opacity: p.opacity }}
          animate={{ y: [-20, 20, -20], opacity: [p.opacity, p.opacity * 1.6, p.opacity] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute", left: `${p.x}%`, top: `${p.y}%`,
            fontFamily: "'JetBrains Mono', monospace", fontSize: p.size,
            color: T.accent, userSelect: "none", whiteSpace: "nowrap",
          }}>
          {p.symbol}
        </motion.div>
      ))}
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════
   ANIMATED GRID BACKGROUND
══════════════════════════════════════════════════════════════ */
const GridBg = ({ T }) => (
  <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
    {/* Grid */}
    <div style={{
      position: "absolute", inset: 0,
      backgroundImage: `linear-gradient(${T.b1} 1px, transparent 1px), linear-gradient(90deg, ${T.b1} 1px, transparent 1px)`,
      backgroundSize: "52px 52px",
      maskImage: "radial-gradient(ellipse 80% 60% at 50% 40%, black 40%, transparent 100%)",
    }} />
    {/* Radial accent glow */}
    <div style={{
      position: "absolute", left: "50%", top: "30%",
      transform: "translate(-50%, -50%)",
      width: 700, height: 700, borderRadius: "50%",
      background: `radial-gradient(ellipse, ${T.accent}28 0%, ${T.teal}10 35%, transparent 70%)`,
      filter: "blur(40px)",
    }} />
    {/* Corner glows */}
    <div style={{ position: "absolute", left: -100, top: 100, width: 400, height: 400, borderRadius: "50%", background: `radial-gradient(ellipse, ${T.teal}12 0%, transparent 70%)`, filter: "blur(50px)" }} />
    <div style={{ position: "absolute", right: -100, bottom: 0, width: 350, height: 350, borderRadius: "50%", background: `radial-gradient(ellipse, ${T.accent}10 0%, transparent 70%)`, filter: "blur(50px)" }} />
  </div>
);

/* ══════════════════════════════════════════════════════════════
   CODE PREVIEW WINDOW
══════════════════════════════════════════════════════════════ */
const CodeWindow = ({ T }) => {
  const [activeLang, setActiveLang] = useState("JavaScript");
  const langs = Object.keys(CODE_SNIPPETS);
  const code = CODE_SNIPPETS[activeLang];
  const langData = LANGUAGES.find(l => l.name === activeLang);

  // syntax highlight - extremely lightweight
  const highlight = (line) => {
    const kw = /\b(function|return|const|let|var|if|fn|def|match|type|impl|use|pub|mod|u64|number)\b/g;
    const str = /(["'`]).*?\1/g;
    const num = /\b\d+\b/g;
    const comment = /\/\/.*/g;
    let parts = [];
    let rest = line;
    // Simple pass
    const tokens = [];
    let i = 0;
    while (i < rest.length) {
      // keyword
      let m;
      kw.lastIndex = i;
      if ((m = kw.exec(rest)) && m.index === i) {
        tokens.push({ text: m[0], color: "#c792ea" }); i += m[0].length; continue;
      }
      // number
      num.lastIndex = i;
      if (/\d/.test(rest[i]) && (m = num.exec(rest)) && m.index === i) {
        tokens.push({ text: m[0], color: "#f78c6c" }); i += m[0].length; continue;
      }
      // default
      tokens.push({ text: rest[i], color: T.t2 }); i++;
    }
    return tokens;
  };

  return (
    <div style={{
      background: T.deep, border: `1px solid ${T.b2}`, borderRadius: 16,
      overflow: "hidden", boxShadow: `0 24px 80px rgba(0,0,0,0.6), 0 0 0 1px ${T.accent}22`,
      fontFamily: "'JetBrains Mono', monospace",
    }}>
      {/* Window chrome */}
      <div style={{ padding: "12px 16px", borderBottom: `1px solid ${T.b1}`,
        display: "flex", alignItems: "center", gap: 10, background: T.panel }}>
        <div style={{ display: "flex", gap: 6 }}>
          {["#f47067","#f9c74f","#6fcf97"].map((c,i) => (
            <div key={i} style={{ width: 11, height: 11, borderRadius: "50%", background: c }} />
          ))}
        </div>
        <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
          <div style={{ display: "flex", gap: 2 }}>
            {langs.map(l => {
              const ld = LANGUAGES.find(x => x.name === l);
              return (
                <button key={l} onClick={() => setActiveLang(l)}
                  style={{
                    padding: "3px 10px", borderRadius: 6, border: "none",
                    background: activeLang === l ? `${ld?.color}22` : "transparent",
                    color: activeLang === l ? ld?.color : T.t3,
                    fontSize: 11, fontWeight: 600, cursor: "pointer",
                    fontFamily: "'JetBrains Mono', monospace",
                    borderBottom: activeLang === l ? `2px solid ${ld?.color}` : "2px solid transparent",
                    transition: "all 0.15s",
                  }}>
                  {LANGUAGES.find(x => x.name === l)?.label || l}
                </button>
              );
            })}
          </div>
        </div>
        <span style={{ fontSize: 10, color: T.t3, letterSpacing: "1px" }}>fibonacci.{activeLang === "Python" ? "py" : activeLang === "Rust" ? "rs" : activeLang === "TypeScript" ? "ts" : "js"}</span>
      </div>

      {/* Code body */}
      <AnimatePresence mode="wait">
        <motion.div key={activeLang}
          initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.18 }}
          style={{ padding: "20px 0", display: "flex" }}>
          {/* Line numbers */}
          <div style={{ padding: "0 16px", display: "flex", flexDirection: "column",
            alignItems: "flex-end", borderRight: `1px solid ${T.b1}`, minWidth: 40 }}>
            {code.split("\n").map((_,i) => (
              <span key={i} style={{ fontSize: 12, color: T.t4, lineHeight: "22px" }}>{i+1}</span>
            ))}
          </div>
          {/* Code */}
          <div style={{ padding: "0 20px" }}>
            {code.split("\n").map((line, i) => (
              <div key={i} style={{ fontSize: 13, lineHeight: "22px", whiteSpace: "pre" }}>
                {line.split(/(\b(?:function|return|const|let|var|if|fn|def|match|type|impl|use|pub|mod|u64|number)\b|\d+|["'`].*?["'`])/g)
                  .map((chunk, j) => {
                    if (/\b(function|return|const|let|var|if|fn|def|match|type|impl|use|pub|mod|u64|number)\b/.test(chunk)) return <span key={j} style={{ color: "#c792ea" }}>{chunk}</span>;
                    if (/^\d+$/.test(chunk)) return <span key={j} style={{ color: "#f78c6c" }}>{chunk}</span>;
                    if (/^["'`].*["'`]$/.test(chunk)) return <span key={j} style={{ color: "#c3e88d" }}>{chunk}</span>;
                    return <span key={j} style={{ color: T.t2 }}>{chunk}</span>;
                  })}
              </div>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Status bar */}
      <div style={{ padding: "6px 16px", borderTop: `1px solid ${T.b1}`,
        display: "flex", alignItems: "center", gap: 12, background: T.panel }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: langData?.color || T.green }} />
        <span style={{ fontSize: 10.5, color: T.t3, flex: 1 }}>{activeLang}</span>
        <span style={{ fontSize: 10, color: T.t3, fontFamily: "'JetBrains Mono', monospace" }}>UTF-8 · LF · Ready</span>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════
   LANGUAGE ORBIT RING
══════════════════════════════════════════════════════════════ */
const LangOrbit = ({ T }) => {
  return (
    <div style={{ position: "relative", width: 320, height: 320, flexShrink: 0 }}>
      {/* Orbit rings */}
      {[120, 145].map((r, i) => (
        <div key={i} style={{
          position: "absolute", top: "50%", left: "50%",
          width: r * 2, height: r * 2, marginTop: -r, marginLeft: -r,
          borderRadius: "50%", border: `1px solid ${T.b2}`,
          animation: `cjSpin ${26 + i * 8}s linear infinite ${i % 2 ? "reverse" : ""}`,
        }} />
      ))}

      {/* Center CJ logo */}
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        width: 70, height: 70, marginTop: -35, marginLeft: -35,
        borderRadius: 18, background: `linear-gradient(135deg, ${T.accent}, ${T.teal})`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 22, fontWeight: 800, color: "#fff", fontFamily: "'Syne', sans-serif",
        boxShadow: `0 0 40px ${T.accent}50, 0 0 80px ${T.accent}20`,
        zIndex: 2,
      }}>
        CJ
      </div>

      {/* Language bubbles */}
      {LANGUAGES.map((lang, i) => {
        const angle = (i / LANGUAGES.length) * 360;
        const rad = 130;
        const x = Math.cos((angle - 90) * Math.PI / 180) * rad;
        const y = Math.sin((angle - 90) * Math.PI / 180) * rad;
        return (
          <motion.div key={lang.name}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 + i * 0.1, type: "spring", stiffness: 200 }}
            whileHover={{ scale: 1.2, zIndex: 10 }}
            style={{
              position: "absolute", top: "50%", left: "50%",
              width: 44, height: 44, marginTop: -22, marginLeft: -22,
              transform: `translate(${x}px, ${y}px)`,
              borderRadius: 12, background: lang.bg || T.panel,
              border: `1.5px solid ${lang.color}50`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 11, fontWeight: 700, color: lang.color,
              fontFamily: "'JetBrains Mono', monospace",
              boxShadow: `0 0 16px ${lang.color}30`,
              cursor: "default", zIndex: 1,
              transition: "box-shadow 0.2s",
            }}>
            {lang.label}
          </motion.div>
        );
      })}
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════
   SECTION: FEATURES
══════════════════════════════════════════════════════════════ */
const FEATURES = [
  { icon: Code2,      title: "10 Languages",          desc: "JavaScript, Python, TypeScript, Rust, SQL, Flutter, R, Kotlin and more - all in one IDE.", color: "#7c6ee0" },
  // { icon: Terminal,   title: "Live Code Runner",      desc: "Write and run code instantly in a sandboxed WebAssembly environment. No local setup ever.", color: "#5eead4" },
  // { icon: Brain,      title: "AI Tutor",              desc: "Your personal AI tutor reads your code and context before you even ask a question.", color: "#f97316" },
  { icon: Zap,        title: "Streaks & XP",          desc: "Stay consistent with daily streaks, XP rewards and a five-tier level progression.", color: "#fbbf24" },
  { icon: Globe,      title: "Multi-Track Paths",     desc: "Web dev, app dev, data science - dedicated learning tracks built for each goal.", color: "#22c55e" },
  // { icon: Layers,     title: "Integrated IDE",        desc: "A real code editor experience: minimap, tabs, syntax highlighting and a live terminal.", color: "#ec4899" },
];

/* ══════════════════════════════════════════════════════════════
   SECTION: TRACKS
══════════════════════════════════════════════════════════════ */
const TRACKS = [
  {
    icon: Globe,
    title: "Web Development",
    subtitle: "Front-end to full-stack",
    color: "#7c6ee0",
    langs: ["JS","TS","HTML","CSS"],
    desc: "Build websites, web apps and APIs. Learn the technologies that power the entire modern web.",
  },
  {
    icon: Smartphone,
    title: "App Development",
    subtitle: "Mobile & cross-platform",
    color: "#5eead4",
    langs: ["Flutter","Kotlin","Dart"],
    desc: "Ship beautiful native and cross-platform apps for iOS and Android with modern frameworks.",
  },
  {
    icon: BarChart2,
    title: "Data Science",
    subtitle: "Analysis & machine learning",
    color: "#f472b6",
    langs: ["Python","R","SQL"],
    desc: "Analyse real datasets, build models and unlock insights with the languages scientists actually use.",
  },
];

/* ══════════════════════════════════════════════════════════════
   SECTION: JOURNEY STEPS
══════════════════════════════════════════════════════════════ */
const STEPS = [
  { n:"01", title:"Pick Your Track",      desc:"Choose Web, App or Data Science - or explore all three at your own pace." },
  { n:"02", title:"Learn by Doing",       desc:"Every concept is paired with a live exercise you run right inside the browser." },
  { n:"03", title:"Get AI-Guided Help",   desc:"Stuck? Your AI tutor gives progressive hints without spoiling the solution." },
  { n:"04", title:"Level Up Daily",       desc:"Earn XP, maintain streaks and climb from Novice to Master at your rhythm." },
];

/* ══════════════════════════════════════════════════════════════
   SECTION: STATS
══════════════════════════════════════════════════════════════ */
const STATS = [
  { value:"9",    unit:"Languages",     icon:Code2   },
  { value:"50+",  unit:"Exercises",     icon:BookOpen },
  { value:"3",    unit:"Career Tracks", icon:Layers  },
  { value:"100%", unit:"In-Browser",    icon:Zap     },
];

/* ══════════════════════════════════════════════════════════════
   SCROLL REVEAL WRAPPER
══════════════════════════════════════════════════════════════ */
const Reveal = ({ children, delay = 0, x = 0, y = 24 }) => (
  <motion.div
    initial={{ opacity: 0, x, y }}
    whileInView={{ opacity: 1, x: 0, y: 0 }}
    viewport={{ once: true, margin: "-60px" }}
    transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}>
    {children}
  </motion.div>
);

/* ══════════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════════ */
export default function Home() {
  const [T, setT] = useState(getTheme());
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  // Sync with theme changes from Profile (polling localStorage)
  useEffect(() => {
    applyThemeToDom(T);
    const interval = setInterval(() => {
      const fresh = getTheme();
      if (fresh.accent !== T.accent) { setT(fresh); applyThemeToDom(fresh); }
    }, 500);
    return () => clearInterval(interval);
  }, [T]);

  // Also listen for storage events (cross-tab)
  useEffect(() => {
    const handler = () => { const fresh = getTheme(); setT(fresh); applyThemeToDom(fresh); };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  const langNames = LANGUAGES.map(l => l.name);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600&family=Syne:wght@400;500;600;700;800&family=Lora:ital,wght@0,400;0,500;1,400;1,500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background: ${T.shell}; }

        @keyframes cjBlink  { 0%,100%{opacity:1}50%{opacity:0} }
        @keyframes cjSpin   { from{transform:rotate(0deg)}to{transform:rotate(360deg)} }
        @keyframes cjFloat  { 0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)} }
        @keyframes cjPulse  { 0%,100%{opacity:1}50%{opacity:0.5} }
        @keyframes cjSlideUp{ from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)} }
        @keyframes cjGlow   { 0%,100%{box-shadow:0 0 20px ${T.accent}40}50%{box-shadow:0 0 50px ${T.accent}70} }

        ::-webkit-scrollbar{width:5px}
        ::-webkit-scrollbar-track{background:${T.shell}}
        ::-webkit-scrollbar-thumb{background:${T.hover};border-radius:3px}
        ::selection{background:${T.accentS};color:${T.t1}}

        .cj-btn-primary:hover{opacity:0.88;transform:translateY(-1px)}
        .cj-btn-ghost:hover{background:${T.hover};border-color:${T.b2}}
        .cj-feature-card:hover{border-color:var(--card-color,${T.accent})44;transform:translateY(-4px)}
        .cj-track-card:hover{transform:translateY(-5px)}
        .cj-step:hover .cj-step-num{opacity:1}
      `}</style>

      <div style={{ minHeight: "100vh", background: T.shell, color: T.t1,
        fontFamily: "'Syne', sans-serif", overflowX: "hidden" }}>

        {/* ══════════════════════════════════════════════════
            HERO
        ══════════════════════════════════════════════════ */}
        <section ref={heroRef} style={{ position: "relative", minHeight: "100vh",
          display: "flex", flexDirection: "column", alignItems: "center",
          justifyContent: "center", overflow: "hidden", padding: "100px 24px 60px" }}>

          <GridBg T={T} />
          <FloatingParticles T={T} />

          <motion.div style={{ y: heroY, opacity: heroOpacity }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}
            className="hero-content"
            style={{ position: "relative", zIndex: 2, maxWidth: 1100, width: "100%",
              display: "flex", alignItems: "center", gap: 60, flexWrap: "wrap",
              justifyContent: "center" }}>

            {/* Left: text */}
            <div style={{ flex: 1, minWidth: 280, maxWidth: 560 }}>
              {/* Tag pill */}
              <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay: 0.1 }}
                style={{ display: "inline-flex", alignItems: "center", gap: 7, marginBottom: 24,
                  padding: "5px 14px", borderRadius: 100,
                  background: `${T.accent}14`, border: `1px solid ${T.accent}40` }}>
                <Sparkles size={13} color={T.accent} />
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
                  fontWeight: 700, color: T.accent, letterSpacing: "1.5px", textTransform: "uppercase" }}>
                  Multi-Language Learning Platform
                </span>
              </motion.div>

              {/* Main heading - Syne 800, large, clear */}
              <motion.h1 initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay: 0.2 }}
                style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800,
                  fontSize: "clamp(36px, 5vw, 60px)", lineHeight: 1.08,
                  color: T.t1, marginBottom: 20, letterSpacing: "-1.5px" }}>
                Master Any Language.<br />
                <span style={{ color: T.accent }}>One Platform.</span><br />
                Zero Confusion.
              </motion.h1>

              {/* Typewriter sub-line */}
              <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay: 0.3 }}
                style={{ fontFamily: "'Lora', serif", fontSize: "clamp(15px, 2vw, 19px)",
                  color: T.t2, marginBottom: 32, lineHeight: 1.7, fontStyle: "italic" }}>
                Currently learning{" "}
                <TypeWriter words={langNames} T={T} />
              </motion.div>

              {/* Body */}
              <motion.p initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay: 0.35 }}
                style={{ fontFamily: "'Lora', serif", fontSize: 16, color: T.t2,
                  lineHeight: 1.82, marginBottom: 40, maxWidth: 480 }}>
                Code Journey is a browser-native IDE and structured learning platform for web development,
                app development and data science - with a built-in AI tutor, live code runner, streaks
                and a progression system designed to keep you moving every single day.
              </motion.p>

              {/* CTA row */}
              <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay: 0.45 }}
                style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                <a href="/register"
                  className="cj-btn-primary"
                  style={{ display: "inline-flex", alignItems: "center", gap: 8,
                    padding: "13px 26px", borderRadius: 12, border: "none",
                    background: T.accent, color: "#fff",
                    fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 15,
                    cursor: "pointer", textDecoration: "none",
                    boxShadow: `0 0 32px ${T.accent}50`,
                    transition: "all 0.18s", animation: "cjGlow 3s ease infinite",
                    letterSpacing: "0.2px" }}>
                  Start for Free <ArrowRight size={16} />
                </a>
                <a href="#tracks"
                  className="cj-btn-ghost"
                  style={{ display: "inline-flex", alignItems: "center", gap: 8,
                    padding: "13px 22px", borderRadius: 12,
                    border: `1px solid ${T.b2}`, background: "transparent",
                    color: T.t1, fontFamily: "'Syne', sans-serif", fontWeight: 600,
                    fontSize: 15, cursor: "pointer", textDecoration: "none",
                    transition: "all 0.18s" }}>
                  <Play size={14} /> Explore Tracks
                </a>
              </motion.div>

              {/* Social proof */}
              <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay: 0.65 }}
                style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 32, flexWrap: "wrap" }}>
                <div style={{ display: "flex" }}>
                  {["#7c6ee0","#5eead4","#22c55e","#f97316","#ec4899"].map((c,i) => (
                    <div key={i} style={{ width: 28, height: 28, borderRadius: "50%",
                      background: `linear-gradient(135deg, ${c}, ${c}80)`,
                      border: `2px solid ${T.shell}`, marginLeft: i ? -10 : 0,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 11, fontWeight: 700, color: "#fff", fontFamily: "'Syne',sans-serif" }}>
                      {["A","P","J","R","K"][i]}
                    </div>
                  ))}
                </div>
                <div>
                  <div style={{ display: "flex", gap: 2 }}>
                    {[1,2,3,4,5].map(i => <Star key={i} size={12} color={T.gold} fill={T.gold} />)}
                  </div>
                  <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 12, color: T.t3 }}>
                    Loved by early learners
                  </span>
                </div>
              </motion.div>
            </div>

            {/* Right: language orbit */}
            <motion.div initial={{ opacity:0, scale:0.8 }} animate={{ opacity:1, scale:1 }}
              transition={{ delay: 0.4, duration: 0.7, ease: "easeOut" }}
              style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
              <LangOrbit T={T} />
            </motion.div>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay: 1.2 }}
            style={{ position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
              cursor: "pointer" }}
            onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
              color: T.t3, letterSpacing: "2px", textTransform: "uppercase" }}>scroll</span>
            <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.6, repeat: Infinity }}>
              <ChevronDown size={18} color={T.t3} />
            </motion.div>
          </motion.div>
        </section>

        {/* ══════════════════════════════════════════════════
            STATS BAR
        ══════════════════════════════════════════════════ */}
        <section style={{ background: T.deep, borderTop: `1px solid ${T.b1}`,
          borderBottom: `1px solid ${T.b1}`, padding: "20px 24px" }}>
          <div style={{ maxWidth: 900, margin: "0 auto",
            display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 0 }}>
            {STATS.map((stat, i) => (
              <Reveal key={stat.unit} delay={i * 0.08}>
                <div style={{ display: "flex", alignItems: "center", gap: 12,
                  padding: "16px 20px",
                  borderRight: i < STATS.length - 1 ? `1px solid ${T.b1}` : "none" }}>
                  <div style={{ width: 36, height: 36, borderRadius: 9,
                    background: `${T.accent}14`, border: `1px solid ${T.accent}28`,
                    display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <stat.icon size={16} color={T.accent} />
                  </div>
                  <div>
                    <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800,
                      fontSize: 22, color: T.t1, margin: 0, lineHeight: 1 }}>{stat.value}</p>
                    <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5,
                      color: T.t3, margin: "2px 0 0", textTransform: "uppercase", letterSpacing: "0.5px" }}>{stat.unit}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════════════════
            FEATURES
        ══════════════════════════════════════════════════ */}
        <section id="features" style={{ padding: "100px 24px" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <Reveal>
              <div style={{ textAlign: "center", marginBottom: 60 }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 6,
                  padding: "4px 14px", borderRadius: 100,
                  background: `${T.teal}14`, border: `1px solid ${T.teal}40`, marginBottom: 16 }}>
                  <Sparkles size={12} color={T.teal} />
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
                    fontWeight: 700, color: T.teal, letterSpacing: "1.5px", textTransform: "uppercase" }}>
                    Everything You Need
                  </span>
                </div>
                <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800,
                  fontSize: "clamp(28px, 4vw, 44px)", color: T.t1, marginBottom: 14, letterSpacing: "-0.8px" }}>
                  Built for Real Learning
                </h2>
                <p style={{ fontFamily: "'Lora', serif", fontSize: 17, color: T.t2,
                  lineHeight: 1.8, maxWidth: 520, margin: "0 auto", fontStyle: "italic" }}>
                  Not a video library, not a quiz tool - Code Journey is a full coding environment
                  designed to get you writing real code from day one.
                </p>
              </div>
            </Reveal>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
              {FEATURES.map((f, i) => (
                <Reveal key={f.title} delay={i * 0.07} y={20}>
                  <div className="cj-feature-card"
                    style={{ "--card-color": f.color,
                      background: T.card, border: `1px solid ${T.b1}`, borderRadius: 16,
                      padding: "24px", transition: "all 0.22s",
                      display: "flex", flexDirection: "column", gap: 14 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12,
                      background: `${f.color}14`, border: `1px solid ${f.color}30`,
                      display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <f.icon size={20} color={f.color} />
                    </div>
                    <div>
                      <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700,
                        fontSize: 16, color: T.t1, marginBottom: 7 }}>{f.title}</h3>
                      <p style={{ fontFamily: "'Lora', serif", fontSize: 14.5,
                        color: T.t2, lineHeight: 1.72 }}>{f.desc}</p>
                    </div>
                    <div style={{ marginTop: "auto", display: "flex", alignItems: "center",
                      gap: 5, color: f.color, fontSize: 12, fontWeight: 600,
                      fontFamily: "'Syne', sans-serif", cursor: "pointer" }}>
                      Learn more <ArrowRight size={13} />
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════
            LIVE CODE PREVIEW
        ══════════════════════════════════════════════════ */}
        <section style={{ padding: "40px 24px 100px", background: T.deep }}>
          <div style={{ maxWidth: 1100, margin: "0 auto",
            display: "flex", gap: 64, alignItems: "center", flexWrap: "wrap" }}>

            <div style={{ flex: 1, minWidth: 280 }}>
              <Reveal x={-20}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 6,
                  padding: "4px 14px", borderRadius: 100,
                  background: `${T.accent}14`, border: `1px solid ${T.accent}40`, marginBottom: 18 }}>
                  <Terminal size={12} color={T.accent} />
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
                    fontWeight: 700, color: T.accent, letterSpacing: "1.5px", textTransform: "uppercase" }}>
                    Live Code Editor
                  </span>
                </div>
                <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800,
                  fontSize: "clamp(26px, 3.5vw, 40px)", color: T.t1,
                  marginBottom: 16, letterSpacing: "-0.6px", lineHeight: 1.15 }}>
                  One IDE.<br />
                  <span style={{ color: T.accent }}>Every Language.</span>
                </h2>
                <p style={{ fontFamily: "'Lora', serif", fontSize: 16, color: T.t2,
                  lineHeight: 1.82, marginBottom: 28 }}>
                  Switch languages with one click. Your code runs inside a sandboxed WebAssembly
                  engine - no installs, no config, no friction. Syntax highlighting, a minimap,
                  a terminal panel and an AI tutor panel all built in.
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {["WebAssembly sandboxed execution","Real-time output streaming","9 languages, zero setup","AI tutor reads your code automatically"].map(item => (
                    <div key={item} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 18, height: 18, borderRadius: "50%",
                        background: `${T.green}18`, border: `1px solid ${T.green}44`,
                        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <Check size={10} color={T.green} />
                      </div>
                      <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 14,
                        color: T.t1, fontWeight: 500 }}>{item}</span>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>

            <Reveal delay={0.1} x={20} style={{ flex: 1, minWidth: 320 }}>
              <div style={{ flex: 1, minWidth: 320 }}>
                <CodeWindow T={T} />
              </div>
            </Reveal>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════
            LEARNING TRACKS
        ══════════════════════════════════════════════════ */}
        <section id="tracks" style={{ padding: "100px 24px" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <Reveal>
              <div style={{ textAlign: "center", marginBottom: 60 }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 6,
                  padding: "4px 14px", borderRadius: 100,
                  background: `${T.gold}14`, border: `1px solid ${T.gold}40`, marginBottom: 16 }}>
                  <Trophy size={12} color={T.gold} />
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
                    fontWeight: 700, color: T.gold, letterSpacing: "1.5px", textTransform: "uppercase" }}>
                    Learning Tracks
                  </span>
                </div>
                <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800,
                  fontSize: "clamp(28px, 4vw, 44px)", color: T.t1, marginBottom: 14, letterSpacing: "-0.8px" }}>
                  Three Paths. One Destination.
                </h2>
                <p style={{ fontFamily: "'Lora', serif", fontSize: 17, color: T.t2,
                  lineHeight: 1.8, maxWidth: 480, margin: "0 auto", fontStyle: "italic" }}>
                  Choose your career track and follow a curated sequence of exercises
                  built for your goal - not a generic "learn everything" dump.
                </p>
              </div>
            </Reveal>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
              {TRACKS.map((track, i) => (
                <Reveal key={track.title} delay={i * 0.1} y={24}>
                  <div className="cj-track-card"
                    style={{ background: T.card, border: `1px solid ${T.b1}`, borderRadius: 20,
                      padding: "30px 26px", transition: "all 0.22s", cursor: "default",
                      position: "relative", overflow: "hidden" }}>
                    {/* Background gradient blob */}
                    <div style={{ position: "absolute", top: -30, right: -30, width: 120, height: 120,
                      borderRadius: "50%", background: `radial-gradient(ellipse, ${track.color}18 0%, transparent 70%)`,
                      pointerEvents: "none" }} />

                    <div style={{ width: 48, height: 48, borderRadius: 14,
                      background: `${track.color}16`, border: `1px solid ${track.color}35`,
                      display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
                      <track.icon size={22} color={track.color} />
                    </div>

                    <div style={{ display: "inline-flex", gap: 5, marginBottom: 16, flexWrap: "wrap" }}>
                      {track.langs.map(l => (
                        <span key={l} style={{ fontFamily: "'JetBrains Mono', monospace",
                          fontSize: 10.5, fontWeight: 700, padding: "2px 7px", borderRadius: 5,
                          background: `${track.color}14`, color: track.color,
                          border: `1px solid ${track.color}30` }}>{l}</span>
                      ))}
                    </div>

                    <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800,
                      fontSize: 20, color: T.t1, marginBottom: 4, letterSpacing: "-0.3px" }}>
                      {track.title}
                    </h3>
                    <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
                      color: track.color, marginBottom: 14, fontWeight: 600, letterSpacing: "0.5px" }}>
                      {track.subtitle}
                    </p>
                    <p style={{ fontFamily: "'Lora', serif", fontSize: 14.5,
                      color: T.t2, lineHeight: 1.7, marginBottom: 24 }}>{track.desc}</p>

                    <a href="/register"
                      style={{ display: "inline-flex", alignItems: "center", gap: 7,
                        padding: "8px 16px", borderRadius: 9,
                        background: `${track.color}14`, border: `1px solid ${track.color}30`,
                        color: track.color, fontFamily: "'Syne', sans-serif",
                        fontWeight: 700, fontSize: 13, textDecoration: "none",
                        transition: "all 0.16s", cursor: "pointer" }}>
                      Start Track <ArrowRight size={13} />
                    </a>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════
            HOW IT WORKS
        ══════════════════════════════════════════════════ */}
        <section style={{ padding: "100px 24px", background: T.deep, position: "relative", overflow: "hidden" }}>
          {/* Background decoration */}
          <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)",
            width: 600, height: 600, borderRadius: "50%",
            background: `radial-gradient(ellipse, ${T.accent}08 0%, transparent 70%)`,
            pointerEvents: "none" }} />

          <div style={{ maxWidth: 860, margin: "0 auto", position: "relative" }}>
            <Reveal>
              <div style={{ textAlign: "center", marginBottom: 70 }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 6,
                  padding: "4px 14px", borderRadius: 100,
                  background: `${T.green}14`, border: `1px solid ${T.green}40`, marginBottom: 16 }}>
                  <Zap size={12} color={T.green} />
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
                    fontWeight: 700, color: T.green, letterSpacing: "1.5px", textTransform: "uppercase" }}>
                    Your Journey
                  </span>
                </div>
                <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800,
                  fontSize: "clamp(28px, 4vw, 44px)", color: T.t1, letterSpacing: "-0.8px" }}>
                  From Zero to Confident
                </h2>
              </div>
            </Reveal>

            <div style={{ position: "relative" }}>
              {/* Vertical connecting line */}
              <div style={{ position: "absolute", left: 24, top: 0, bottom: 0, width: 1,
                background: `linear-gradient(to bottom, transparent, ${T.accent}60, ${T.teal}60, transparent)` }} />

              <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                {STEPS.map((step, i) => (
                  <Reveal key={step.n} delay={i * 0.1} x={-16}>
                    <div className="cj-step"
                      style={{ display: "flex", gap: 32, alignItems: "flex-start",
                        padding: "28px 0 28px 0", paddingLeft: 20 }}>
                      {/* Step number bubble */}
                      <div style={{ width: 48, height: 48, borderRadius: "50%", flexShrink: 0,
                        background: T.panel, border: `1.5px solid ${T.b2}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        zIndex: 1, position: "relative" }}>
                        <span className="cj-step-num"
                          style={{ fontFamily: "'JetBrains Mono', monospace",
                            fontSize: 13, fontWeight: 700, color: T.accent,
                            opacity: 0.7, transition: "opacity 0.18s" }}>{step.n}</span>
                      </div>

                      <div style={{ paddingTop: 10 }}>
                        <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700,
                          fontSize: 20, color: T.t1, marginBottom: 8, letterSpacing: "-0.2px" }}>
                          {step.title}
                        </h3>
                        <p style={{ fontFamily: "'Lora', serif", fontSize: 16,
                          color: T.t2, lineHeight: 1.75 }}>{step.desc}</p>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════
            CTA FINAL
        ══════════════════════════════════════════════════ */}
        <section style={{ padding: "120px 24px", position: "relative", overflow: "hidden" }}>
          {/* Multi-layer glow */}
          <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
            <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)",
              width: 700, height: 400, borderRadius: "50%",
              background: `radial-gradient(ellipse, ${T.accent}20 0%, ${T.teal}10 40%, transparent 70%)`,
              filter: "blur(30px)" }} />
          </div>
          {/* Grid */}
          <div style={{ position: "absolute", inset: 0, pointerEvents: "none",
            backgroundImage: `linear-gradient(${T.b1} 1px, transparent 1px), linear-gradient(90deg, ${T.b1} 1px, transparent 1px)`,
            backgroundSize: "52px 52px",
            maskImage: "radial-gradient(ellipse 70% 70% at 50% 50%, black 30%, transparent 100%)" }} />

          <Reveal>
            <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center", position: "relative" }}>
              {/* Floating language chips above heading */}
              <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 32, flexWrap: "wrap" }}>
                {LANGUAGES.slice(0, 6).map(l => (
                  <motion.span key={l.name}
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2 }}
                    style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
                      fontWeight: 700, padding: "3px 10px", borderRadius: 6,
                      background: `${l.color}14`, color: l.color,
                      border: `1px solid ${l.color}30` }}>
                    {l.label}
                  </motion.span>
                ))}
              </div>

              <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800,
                fontSize: "clamp(32px, 5vw, 54px)", color: T.t1,
                marginBottom: 18, letterSpacing: "-1px", lineHeight: 1.1 }}>
                Your Code Journey<br />
                <span style={{ color: T.accent }}>Starts Today.</span>
              </h2>

              <p style={{ fontFamily: "'Lora', serif", fontSize: 17.5, color: T.t2,
                lineHeight: 1.82, marginBottom: 44, fontStyle: "italic" }}>
                No credit card. No install. Just open the browser and write code in the language you want to learn.
              </p>

              <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
                <a href="/register"
                  className="cj-btn-primary"
                  style={{ display: "inline-flex", alignItems: "center", gap: 9,
                    padding: "15px 32px", borderRadius: 13, border: "none",
                    background: T.accent, color: "#fff",
                    fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 16,
                    cursor: "pointer", textDecoration: "none",
                    boxShadow: `0 0 40px ${T.accent}55`,
                    transition: "all 0.18s", letterSpacing: "0.2px" }}>
                  Begin Your Journey <ArrowRight size={18} />
                </a>
                <a href="/login"
                  className="cj-btn-ghost"
                  style={{ display: "inline-flex", alignItems: "center", gap: 8,
                    padding: "15px 24px", borderRadius: 13,
                    border: `1px solid ${T.b2}`, background: "transparent",
                    color: T.t1, fontFamily: "'Syne', sans-serif", fontWeight: 600,
                    fontSize: 16, cursor: "pointer", textDecoration: "none", transition: "all 0.18s" }}>
                  I already have an account
                </a>
              </div>

              {/* Trust line */}
              <div style={{ marginTop: 32, display: "flex", alignItems: "center",
                justifyContent: "center", gap: 20, flexWrap: "wrap" }}>
                {["Free to start","No credit card","Browser-native"].map(t => (
                  <div key={t} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: T.green }} />
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11.5,
                      color: T.t3, fontWeight: 600 }}>{t}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </section>

      </div>
    </>
  );
}

/* ── Utility: Check icon inline (avoids extra import) ── */
function Check({ size = 16, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}