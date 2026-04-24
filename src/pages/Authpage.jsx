/**
 * AuthPage.jsx — Code Journey Login / Signup
 *
 * Light theme. Fits exactly in viewport — no scroll.
 * Transition: the form slides within a fixed-height container.
 * The brand panel stays put; only its inner content fades.
 * Switch direction is tracked so slides go the right way.
 */
import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye, EyeOff, ArrowRight, Check, Zap, BookOpen,
  Code2, Layers, Shield, Sparkles,
  Smile, Mail, Lock, User, Globe, Map,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { signUpUser, loginUser } from "../lib/auth";

/* ══ PALETTE (light) ══════════════════════════════════════ */
const C = {
  bg: "#f8f7ff",
  bgAlt: "#f0eefe",
  white: "#ffffff",
  brand: "#6250e0",   /* primary accent */
  brandDk: "#4f3dcc",
  brandLt: "#ede9ff",
  brandMid: "rgba(98,80,224,0.1)",
  teal: "#0d9488",
  green: "#16a34a",
  red: "#dc2626",
  amber: "#d97706",
  t1: "#0f172a",   /* darkest text */
  t2: "#334155",
  t3: "#64748b",
  t4: "#94a3b8",
  border: "#e2dffb",
  borderMd: "rgba(98,80,224,0.25)",
};

/* ══ BENEFITS ═══════════════════════════════════════════ */
const BENEFITS = [
  { icon: Zap, color: C.brand, title: "Run code instantly", desc: "9 languages in-browser. Zero setup, zero installation." },
  { icon: Map, color: C.teal, title: "Roadmap that makes sense", desc: "Stage-by-stage — no guessing what to learn next." },
  { icon: Code2, color: "#7c3aed", title: "Built-in IDE", desc: "Real editor with syntax highlighting and test runners." },
  { icon: BookOpen, color: C.green, title: "Curated resources", desc: "Best docs, videos, and practice problems, hand-picked." },
  { icon: Layers, color: "#0891b2", title: "Three full tracks", desc: "Web Dev, App Dev, Data Science — pick your path." },
  { icon: Shield, color: C.amber, title: "No fluff, ever", desc: "Only what you need, when you need it. Sharp and focused." },
];

const LANGS = [
  { label: "JS", color: "#ca8a04", angle: 0 },
  { label: "Py", color: "#16a34a", angle: 60 },
  { label: "TS", color: "#2563eb", angle: 120 },
  { label: "Kt", color: "#7c3aed", angle: 180 },
  { label: "Sw", color: "#ea580c", angle: 240 },
  { label: "SQL", color: "#0891b2", angle: 300 },
];

/* ══ CODE SNIPPETS drifting in background ════════════════ */
const SNIPS = [
  "const learn = () => grow();",
  "def start(): journey()",
  "SELECT skill FROM dev;",
  "import { future } from 'cj'",
  "fn build() -> Career { }",
  "let path: Track = .web",
  "class Journey { begin() }",
  "async fn ship() -> Result",
];

/* ══ FLOATING PARTICLES (light, subtle) ════════════════ */
function Particles() {
  const ps = useRef(SNIPS.map((t, i) => ({ id: i, text: t, x: 5 + (i * 13) % 88, y: 4 + (i * 19) % 90, dur: 22 + (i * 4) % 12, delay: -(i * 2.7), op: 0.06 + (i % 3) * 0.03 }))).current;
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", borderRadius: "inherit" }}>
      {ps.map(p => (
        <motion.span key={p.id}
          animate={{ y: [0, -14, 0], opacity: [p.op, p.op * 2.2, p.op] }}
          transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
          style={{ position: "absolute", left: `${p.x}%`, top: `${p.y}%`, fontFamily: "'JetBrains Mono',monospace", fontSize: 10.5, color: C.brand, whiteSpace: "nowrap", userSelect: "none" }}>
          {p.text}
        </motion.span>
      ))}
    </div>
  );
}

/* ══ ORBITING LANG DOTS ═══════════════════════════════ */
function Orbit({ size = 156 }) {
  const r = size / 2 - 16;
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      {/* Static ring */}
      <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: `1px dashed ${C.borderMd}`, opacity: 0.6 }} />
      {/* Rotating dots */}
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 26, repeat: Infinity, ease: "linear" }}
        style={{ position: "absolute", inset: 0 }}>
        {LANGS.map(l => {
          const rad = (l.angle * Math.PI) / 180;
          const cx = size / 2 + r * Math.cos(rad) - 14;
          const cy = size / 2 + r * Math.sin(rad) - 14;
          return (
            <div key={l.label} style={{ position: "absolute", left: cx, top: cy, width: 28, height: 28, borderRadius: "50%", background: C.white, border: `1.5px solid ${l.color}55`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 2px 8px ${l.color}22` }}>
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 8, fontWeight: 700, color: l.color }}>{l.label}</span>
            </div>
          );
        })}
      </motion.div>
      {/* CJ centre */}
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <motion.div animate={{ scale: [1, 1.04, 1] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          style={{ width: 50, height: 50, borderRadius: 16, background: `linear-gradient(135deg,${C.brand},${C.teal})`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 17, color: "#fff", boxShadow: `0 4px 24px ${C.brand}44` }}>
          CJ
        </motion.div>
      </div>
    </div>
  );
}

/* ══ BENEFIT ROTATOR ══════════════════════════════════ */
function BenefitRotator() {
  const [cur, setCur] = useState(0);
  useEffect(() => { const iv = setInterval(() => setCur(c => (c + 1) % BENEFITS.length), 3000); return () => clearInterval(iv); }, []);
  const b = BENEFITS[cur];
  return (
    <div style={{ width: "100%", maxWidth: 300 }}>
      <AnimatePresence mode="wait">
        <motion.div key={cur}
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 14, padding: "14px 16px", marginBottom: 12, boxShadow: "0 2px 12px rgba(98,80,224,0.08)" }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 11 }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: `${b.color}12`, border: `1px solid ${b.color}30`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <b.icon size={15} color={b.color} />
            </div>
            <div>
              <p style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 13.5, color: C.t1, margin: "0 0 3px" }}>{b.title}</p>
              <p style={{ fontFamily: "'Lora',serif", fontSize: 12.5, color: C.t3, lineHeight: 1.6, margin: 0 }}>{b.desc}</p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
      <div style={{ display: "flex", gap: 5, justifyContent: "center" }}>
        {BENEFITS.map((_, i) => (
          <div key={i} onClick={() => setCur(i)}
            style={{ width: i === cur ? 16 : 6, height: 6, borderRadius: 3, background: i === cur ? C.brand : C.border, transition: "all 0.28s cubic-bezier(0.22,1,0.36,1)", cursor: "pointer" }} />
        ))}
      </div>
    </div>
  );
}

/* ══ INPUT FIELD ══════════════════════════════════════ */
function Field({ label, type: inputType, value, onChange, placeholder, icon: Icon, validate }) {
  const [showPw, setShowPw] = useState(false);
  const [focused, setFocused] = useState(false);
  const [touched, setTouched] = useState(false);
  const error = touched && validate ? validate(value) : null;
  const ok = touched && !error && value.length > 0;
  const type = inputType === "password" ? (showPw ? "text" : "password") : inputType;
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: focused ? C.brand : C.t3, marginBottom: 6, display: "block", transition: "color 0.15s" }}>
        {label}
      </label>
      <div style={{ position: "relative" }}>
        <div style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: focused ? C.brand : C.t4, transition: "color 0.15s", pointerEvents: "none" }}>
          <Icon size={14} />
        </div>
        <input type={type} value={value}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => { setFocused(false); setTouched(true); }}
          placeholder={placeholder}
          style={{ width: "100%", background: focused ? "rgba(98,80,224,0.04)" : C.white, border: `1.5px solid ${error ? "#fca5a5" : ok ? "#86efac" : focused ? C.brand : C.border}`, borderRadius: 10, padding: "10px 38px 10px 35px", fontFamily: "'Syne',sans-serif", fontSize: 14, color: C.t1, outline: "none", transition: "all 0.16s", boxShadow: focused ? `0 0 0 3px ${C.brand}12` : "none" }} />
        <div style={{ position: "absolute", right: 11, top: "50%", transform: "translateY(-50%)", cursor: "pointer", display: "flex", alignItems: "center" }}
          onClick={() => inputType === "password" && setShowPw(s => !s)}>
          {ok && inputType !== "password" ? <Check size={14} color={C.green} /> :
            inputType === "password" ? (showPw ? <EyeOff size={14} color={C.t4} /> : <Eye size={14} color={C.t4} />) : null}
        </div>
      </div>
      <AnimatePresence>
        {error && <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
          style={{ fontFamily: "'Syne',sans-serif", fontSize: 11, color: C.red, margin: "4px 0 0", paddingLeft: 2, overflow: "hidden" }}>
          {error}
        </motion.p>}
      </AnimatePresence>
    </div>
  );
}

/* ══ PASSWORD STRENGTH ═════════════════════════════════ */
function PwStrength({ pw }) {
  const checks = [{ label: "8+ chars", pass: pw.length >= 8 }, { label: "Uppercase", pass: /[A-Z]/.test(pw) }, { label: "Number", pass: /\d/.test(pw) }, { label: "Symbol", pass: /[!@#$%^&*]/.test(pw) }];
  const score = checks.filter(c => c.pass).length;
  const cols = ["#ef4444", "#f97316", "#eab308", "#16a34a"];
  const labs = ["Weak", "Fair", "Good", "Strong"];
  if (!pw) return null;
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", gap: 3, marginBottom: 5 }}>
        {[0, 1, 2, 3].map(i => <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i < score ? cols[score - 1] : C.border, transition: "background 0.25s" }} />)}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {checks.map(c => <span key={c.label} style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9.5, color: c.pass ? C.green : C.t4, display: "flex", alignItems: "center", gap: 2 }}>
            {c.pass ? "✓" : "○"} {c.label}
          </span>)}
        </div>
        {score > 0 && <span style={{ fontFamily: "'Syne',sans-serif", fontSize: 11, fontWeight: 700, color: cols[score - 1] }}>{labs[score - 1]}</span>}
      </div>
    </div>
  );
}

const V = {
  name: v => v.length < 2 ? "At least 2 characters" : null,
  email: v => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? "Enter a valid email" : null,
  password: v => v.length < 8 ? "At least 8 characters" : null,
  confirm: (v, pw) => v !== pw ? "Passwords don't match" : null,
};

/* ══════════════════════════════════════════════════════
   MAIN
══════════════════════════════════════════════════════ */
export default function AuthPage() {
  const [mode, setMode] = useState("signup");
  const [dir, setDir] = useState(1);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [cpw, setCpw] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [fail, setFail] = useState(false);

  const isSignup = mode === "signup";

  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/login") {
      setMode("login");
    } else if (location.pathname === "/register") {
      setMode("signup");
    }
  }, [location.pathname]);

  const navigate = useNavigate();

  const switchMode = useCallback((next) => {
    if (next === mode) return;

    setDir(next === "login" ? 1 : -1);
    setMode(next);

    navigate(next === "login" ? "/login" : "/register");

    // reset states
    setName(""); setEmail(""); setPw(""); setCpw("");
    setAgreed(false); setLoading(false); setDone(false); setFail(false);
  }, [mode]);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFail(false);

    try {
      let res;

      if (isSignup) {
        res = await signUpUser(name, email, pw);
      } else {
        res = await loginUser(email, pw);
      }

      if (res.error) {
        console.log(res.error.message);   // 👈 ADD THIS
        setFail(true);
      } else {
        setDone(true);

        // redirect after success
        setTimeout(() => {
          navigate("/profile");
        }, 1200);
      }
    } catch (err) {
      setFail(true);
    }

    setLoading(false);
  };

  /* Slide variants — purely horizontal, no layout swap */
  const variants = {
    enter: (d) => ({ x: d > 0 ? 48 : -48, opacity: 0 }),
    center: { x: 0, opacity: 1, transition: { duration: 0.38, ease: [0.22, 1, 0.36, 1] } },
    exit: (d) => ({ x: d > 0 ? -48 : 48, opacity: 0, transition: { duration: 0.22, ease: [0.4, 0, 1, 1] } }),
  };

  /* Brand panel content variants */
  const brandVariants = {
    enter: (d) => ({ opacity: 0, x: d > 0 ? 24 : -24 }),
    center: { opacity: 1, x: 0, transition: { duration: 0.42, delay: 0.1, ease: [0.22, 1, 0.36, 1] } },
    exit: (d) => ({ opacity: 0, x: d > 0 ? -24 : 24, transition: { duration: 0.2 } }),
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&family=Syne:wght@400;500;600;700;800&family=Lora:ital,wght@0,400;0,500;1,400;1,500&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        html,body{height:100%;overflow:hidden;}
        body{background:${C.bg};font-family:'Syne',sans-serif;}
        input:-webkit-autofill,input:-webkit-autofill:focus{
          -webkit-box-shadow:0 0 0 1000px ${C.white} inset;
          -webkit-text-fill-color:${C.t1};
        }
        ::selection{background:rgba(98,80,224,0.18);}
        ::-webkit-scrollbar{width:4px;}
        ::-webkit-scrollbar-thumb{background:${C.border};border-radius:2px;}

        @keyframes gradMove{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
        @keyframes shimmer{0%{left:-60%}100%{left:120%}}

        .cj-submit{
          background:linear-gradient(130deg,${C.brand} 0%,${C.teal} 120%);
          background-size:200% 200%;
          animation:gradMove 4s ease infinite;
          position:relative;overflow:hidden;
          transition:transform 0.16s,opacity 0.16s;
        }
        .cj-submit:hover:not(:disabled){transform:translateY(-1px);opacity:0.93;}
        .cj-submit:active:not(:disabled){transform:translateY(0);}
        .cj-submit::after{content:'';position:absolute;inset:0;background:linear-gradient(105deg,transparent 40%,rgba(255,255,255,0.1) 50%,transparent 60%);transform:translateX(-100%);transition:transform 0.55s ease;}
        .cj-submit:hover::after{transform:translateX(100%);}

        .cj-social:hover{background:${C.brandMid}!important;border-color:${C.brand}55!important;color:${C.brand}!important;}

        @media(max-width:820px){
          .auth-brand{display:none!important;}
          .auth-form-col{width:100%!important;max-width:100%!important;}
        }
      `}</style>

      {/* ── ROOT: exact viewport, no scroll ── */}
      <div style={{ display: "flex", height: "100vh", width: "100vw", overflow: "hidden", background: C.bg, fontFamily: "'Syne',sans-serif", color: C.t1 }}>

        {/* ═══════════════════════════════
            BRAND COLUMN — stays put, content fades
        ═══════════════════════════════ */}
        <div className="auth-brand" style={{
          width: "48%", flexShrink: 0, position: "relative", overflow: "hidden",
          background: `linear-gradient(145deg,${C.brandLt} 0%,${C.bgAlt} 50%,${C.bg} 100%)`,
          borderRight: `1px solid ${C.border}`,
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          padding: "40px 40px",
        }}>
          {/* Subtle grid */}
          <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(${C.brand}08 1px,transparent 1px),linear-gradient(90deg,${C.brand}08 1px,transparent 1px)`, backgroundSize: "44px 44px", pointerEvents: "none" }} />
          {/* Radial glow */}
          <div style={{ position: "absolute", left: "50%", top: "45%", transform: "translate(-50%,-50%)", width: 420, height: 320, borderRadius: "50%", background: `radial-gradient(ellipse,${C.brand}18 0%,transparent 70%)`, filter: "blur(40px)", pointerEvents: "none" }} />
          <Particles />

          {/* Content that animates on mode switch */}
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div key={mode + "-brand"} custom={dir}
              variants={brandVariants} initial="enter" animate="center" exit="exit"
              style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24, position: "relative", zIndex: 2, width: "100%", maxWidth: 340 }}>

              <Orbit size={164} />

              <div style={{ textAlign: "center" }}>
                <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "clamp(20px,2.8vw,30px)", letterSpacing: "-0.6px", lineHeight: 1.12, marginBottom: 10, color: C.t1 }}>
                  {isSignup ? <>Start your<br /><span style={{ color: C.brand }}>coding journey.</span></> : <>Welcome<br /><span style={{ color: C.brand }}>back.</span></>}
                </h2>
                <p style={{ fontFamily: "'Lora',serif", fontStyle: "italic", fontSize: 14, color: C.t3, lineHeight: 1.75, maxWidth: 260, margin: "0 auto" }}>
                  {isSignup
                    ? "Join thousands of beginners who chose Code Journey to find their tech stack and build real things."
                    : "Your progress, notes, roadmap and exercises are right where you left them."}
                </p>
              </div>

              {isSignup
                ? <BenefitRotator />
                : <div style={{ display: "flex", flexDirection: "column", gap: 9, width: "100%", maxWidth: 290 }}>
                  {[
                    { icon: Code2, color: C.brand, text: "Your exercises and solutions saved" },
                    { icon: Map, color: C.teal, text: "Roadmap progress tracked by stage" },
                    { icon: Layers, color: "#7c3aed", text: "Notes and tasks synced everywhere" },
                  ].map(item => (
                    <div key={item.text} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 13px", background: C.white, border: `1px solid ${C.border}`, borderRadius: 10, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                      <div style={{ width: 28, height: 28, borderRadius: 8, background: `${item.color}12`, border: `1px solid ${item.color}28`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <item.icon size={13} color={item.color} />
                      </div>
                      <span style={{ fontFamily: "'Syne',sans-serif", fontSize: 13, color: C.t2, fontWeight: 500 }}>{item.text}</span>
                    </div>
                  ))}
                </div>
              }

              {/* Stats strip */}
              <div style={{ display: "flex", gap: 18, justifyContent: "center", paddingTop: 4 }}>
                {[["10K+", "Learners"], ["9", "Languages"], ["3", "Tracks"], ["Free", "Forever"]].map(([v, l]) => (
                  <div key={l} style={{ textAlign: "center" }}>
                    <p style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 17, color: C.brand, margin: 0, lineHeight: 1 }}>{v}</p>
                    <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: C.t4, margin: "3px 0 0", letterSpacing: "0.4px" }}>{l}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ═══════════════════════════════
            FORM COLUMN — fixed, content slides inside
        ═══════════════════════════════ */}
        <div className="auth-form-col" style={{
          flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
          background: C.white, padding: "0 32px", position: "relative", overflow: "hidden",
        }}>
          {/* Subtle top accent line */}
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg,${C.brand},${C.teal})`, opacity: 0.7 }} />

          <div style={{ width: "100%", maxWidth: 400, position: "relative" }}>

            {/* Mode toggle pills */}
            <div style={{ display: "flex", background: C.bg, border: `1px solid ${C.border}`, borderRadius: 11, padding: 3, marginBottom: 28, position: "relative" }}>
              <motion.div layout transition={{ type: "spring", stiffness: 380, damping: 36 }}
                style={{ position: "absolute", top: 3, left: isSignup ? "3px" : "calc(50% + 1.5px)", width: "calc(50% - 4.5px)", height: "calc(100% - 6px)", borderRadius: 8, background: C.white, boxShadow: "0 1px 6px rgba(98,80,224,0.15)", border: `1px solid ${C.borderMd}` }} />
              {[["signup", "Create Account"], ["login", "Sign In"]].map(([m, lbl]) => (
                <button key={m} onClick={() => switchMode(m)}
                  style={{ flex: 1, padding: "9px 0", borderRadius: 8, border: "none", background: "transparent", cursor: "pointer", fontFamily: "'Syne',sans-serif", fontWeight: mode === m ? 700 : 500, fontSize: 13.5, color: mode === m ? C.brand : C.t3, position: "relative", zIndex: 1, transition: "color 0.2s" }}>
                  {lbl}
                </button>
              ))}
            </div>

            {/* Sliding form content — the KEY transition */}
            <AnimatePresence mode="wait" custom={dir}>
              <motion.div key={mode} custom={dir}
                variants={variants} initial="enter" animate="center" exit="exit"
                style={{ willChange: "transform,opacity" }}>

                {/* SUCCESS STATE */}
                {done ? (
                  <motion.div initial={{ scale: 0.94, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ textAlign: "center", padding: "32px 0" }}>
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 280, delay: 0.1 }}
                      style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(22,163,74,0.1)", border: "2px solid rgba(22,163,74,0.4)", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
                      <Check size={24} color={C.green} />
                    </motion.div>
                    <h3 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 22, color: C.t1, marginBottom: 8 }}>
                      {isSignup ? "Account created!" : "Welcome back!"}
                    </h3>
                    <p style={{ fontFamily: "'Lora',serif", fontStyle: "italic", fontSize: 14.5, color: C.t3 }}>
                      {isSignup ? "Redirecting to your journey…" : "Loading your progress…"}
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={submit} noValidate>
                    {/* Heading */}
                    <div style={{ marginBottom: 22 }}>
                      <h1 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "clamp(20px,3vw,26px)", color: C.t1, letterSpacing: "-0.4px", marginBottom: 5 }}>
                        {isSignup ? "Create your account" : "Sign in to continue"}
                      </h1>
                      <p style={{ fontFamily: "'Lora',serif", fontStyle: "italic", fontSize: 13.5, color: C.t3, lineHeight: 1.6 }}>
                        {isSignup ? "Free forever. No card needed. Just start coding."
                          : "Your progress and projects are waiting for you."}
                      </p>
                    </div>

                    {/* Social */}
                    <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
                      {[{ lbl: "GitHub", Icon: Smile }, { lbl: "Google", Icon: Globe }].map(({ lbl, Icon }) => (
                        <button key={lbl} type="button" className="cj-social"
                          style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 7, padding: "10px", borderRadius: 9, border: `1px solid ${C.border}`, background: C.bg, cursor: "pointer", fontFamily: "'Syne',sans-serif", fontWeight: 600, fontSize: 13, color: C.t2, transition: "all 0.16s" }}>
                          <Icon size={14} /> {lbl}
                        </button>
                      ))}
                    </div>

                    {/* Divider */}
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
                      <div style={{ flex: 1, height: 1, background: C.border }} />
                      <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: C.t4, letterSpacing: "0.5px", whiteSpace: "nowrap" }}>or with email</span>
                      <div style={{ flex: 1, height: 1, background: C.border }} />
                    </div>

                    {/* Fields */}
                    {isSignup && <Field label="Full name" type="text" value={name} onChange={setName} placeholder="Alex Johnson" icon={User} validate={V.name} />}
                    <Field label="Email" type="email" value={email} onChange={setEmail} placeholder="you@example.com" icon={Mail} validate={V.email} />
                    <Field label="Password" type="password" value={pw} onChange={setPw} placeholder={isSignup ? "Create a strong password" : "Your password"} icon={Lock} validate={V.password} />
                    {isSignup && <PwStrength pw={pw} />}
                    {isSignup && <Field label="Confirm password" type="password" value={cpw} onChange={setCpw} placeholder="Repeat your password" icon={Lock} validate={v => V.confirm(v, pw)} />}

                    {/* Forgot (login) */}
                    {!isSignup && <div style={{ textAlign: "right", marginBottom: 18, marginTop: -8 }}>
                      <a href="#" style={{ fontFamily: "'Syne',sans-serif", fontSize: 12.5, color: C.brand, textDecoration: "none", fontWeight: 600, opacity: 0.85 }} onMouseEnter={e => e.currentTarget.style.opacity = "1"} onMouseLeave={e => e.currentTarget.style.opacity = "0.85"}>Forgot password?</a>
                    </div>}

                    {/* Terms (signup) */}
                    {isSignup && <div style={{ display: "flex", gap: 9, alignItems: "flex-start", marginBottom: 18 }}>
                      <div onClick={() => setAgreed(a => !a)}
                        style={{ width: 17, height: 17, borderRadius: 5, border: `1.5px solid ${agreed ? C.brand : C.border}`, background: agreed ? C.brand : "transparent", flexShrink: 0, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", marginTop: 1, transition: "all 0.14s" }}>
                        {agreed && <Check size={10} color="#fff" />}
                      </div>
                      <p style={{ fontFamily: "'Lora',serif", fontSize: 12.5, color: C.t3, lineHeight: 1.6 }}>
                        I agree to the <a href="/terms" style={{ color: C.brand, textDecoration: "none", fontWeight: 600 }}>Terms</a> and <a href="/privacy-policy" style={{ color: C.brand, textDecoration: "none", fontWeight: 600 }}>Privacy Policy</a>
                      </p>
                    </div>}

                    {/* Failure banner */}
                    <AnimatePresence>
                      {fail && <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                        style={{ background: "rgba(220,38,38,0.06)", border: "1px solid rgba(220,38,38,0.25)", borderRadius: 9, padding: "10px 13px", marginBottom: 14, fontFamily: "'Syne',sans-serif", fontSize: 13, color: C.red, overflow: "hidden" }}>
                        Incorrect credentials. Please try again.
                      </motion.div>}
                    </AnimatePresence>

                    {/* Submit */}
                    <button type="submit" className="cj-submit"
                      disabled={loading || (isSignup && !agreed)}
                      style={{ width: "100%", padding: "12px", borderRadius: 10, border: "none", cursor: loading || (isSignup && !agreed) ? "not-allowed" : "pointer", opacity: isSignup && !agreed ? 0.5 : 1, fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 15, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 18 }}>
                      {loading ? (
                        <><motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                          style={{ width: 16, height: 16, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.3)", borderTop: "2px solid #fff" }} />
                          {isSignup ? "Creating account…" : "Signing in…"}</>
                      ) : (
                        <>{isSignup ? "Start my journey" : "Continue journey"}<ArrowRight size={15} /></>
                      )}
                    </button>

                    {/* Switch link */}
                    <p style={{ textAlign: "center", fontFamily: "'Syne',sans-serif", fontSize: 13, color: C.t3 }}>
                      {isSignup ? "Already have an account? " : "New to Code Journey? "}
                      <button type="button" onClick={() => switchMode(isSignup ? "login" : "signup")}
                        style={{ background: "none", border: "none", cursor: "pointer", color: C.brand, fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 13, padding: 0, transition: "opacity 0.14s" }}
                        onMouseEnter={e => e.currentTarget.style.opacity = "0.75"}
                        onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
                        {isSignup ? "Sign in →" : "Create a free account →"}
                      </button>
                    </p>

                    {/* Signup benefit strip */}
                    {/* {isSignup&&(
                      <motion.div initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} transition={{delay:0.3}}
                        style={{marginTop:18,padding:"13px 15px",background:C.brandMid,border:`1px solid ${C.brand}25`,borderRadius:11}}>
                        <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,fontWeight:700,color:C.brand,letterSpacing:"1px",textTransform:"uppercase",marginBottom:9}}>What you unlock</p>
                        <div style={{display:"flex",flexDirection:"column",gap:6}}>
                          {["Run code in 9 languages — no setup","Stage-by-stage roadmap for your track","Notes, tasks, exercises in your profile","Open changelog — always know what's new"].map(b=>(
                            <div key={b} style={{display:"flex",gap:7,alignItems:"flex-start"}}>
                              <Sparkles size={11} color={C.brand} style={{flexShrink:0,marginTop:2}}/>
                              <span style={{fontFamily:"'Lora',serif",fontSize:12.5,color:C.t2,lineHeight:1.5}}>{b}</span>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )} */}
                  </form>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </>
  );
}