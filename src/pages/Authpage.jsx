import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import {
  Eye, EyeOff, ArrowRight, Check, Zap, BookOpen,
  Code2, Globe, Smartphone, BarChart2, Star,
  Shield, Users, Layers, ChevronRight, Sparkles,
  Smile , Mail, Lock, User, X,
} from "lucide-react";

/* ── CONSTANTS ── */
const ACCENT   = "#7c6ee0";
const TEAL     = "#5eead4";
const GREEN    = "#22c55e";
const GOLD     = "#fbbf24";
const RED      = "#f87171";

const BENEFITS = [
  { icon: Zap,       color: ACCENT, title: "Instant code execution",    desc: "Run code in 9 languages right in your browser — zero setup." },
  { icon: BookOpen,  color: TEAL,   title: "Structured learning paths",  desc: "Web, App, and Data Science tracks that take you from zero to employed." },
  { icon: Code2,     color: GREEN,  title: "Built-in IDE",               desc: "A full VS Code-inspired editor with syntax highlighting, terminals, and test runners." },
  { icon: Globe,     color: GOLD,   title: "Open changelog",             desc: "Every update documented publicly. You always know what changed and why." },
  { icon: Layers,    color: "#f97316", title: "Roadmap that makes sense", desc: "Stage-by-stage breakdown — no guessing what to learn next." },
  { icon: Shield,    color: "#a78bfa", title: "Zero confusion guarantee", desc: "Only required info, only when you need it. No padding, no filler." },
];

const LANGS = [
  { label: "JS",   color: "#f7df1e", angle: 0   },
  { label: "Py",   color: "#4ade80", angle: 60  },
  { label: "TS",   color: "#60a5fa", angle: 120 },
  { label: "Kt",   color: "#a78bfa", angle: 180 },
  { label: "Sw",   color: "#f97316", angle: 240 },
  { label: "SQL",  color: "#f472b6", angle: 300 },
];

const CODE_SNIPPETS = [
  "const learn = () => grow();",
  "def start(): journey.begin()",
  "let code = new Adventure();",
  "SELECT * FROM potential;",
  "fn main() { code_journey(); }",
  "class Developer: pass",
  "async fn build() -> Result",
  "import { future } from 'cj';",
  "let skill: Career = .grow",
];

/* ── FLOATING CODE PARTICLES ── */
function FloatingParticles({ mode }) {
  const particles = useRef(
    CODE_SNIPPETS.map((text, i) => ({
      id: i,
      text,
      x: 8 + (i * 11) % 82,
      y: 6 + (i * 17) % 88,
      dur: 18 + (i * 3) % 14,
      delay: -(i * 2.1),
      opacity: 0.08 + (i % 4) * 0.04,
    }))
  ).current;

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      {particles.map(p => (
        <motion.div
          key={p.id}
          animate={{ y: [0, -18, 0], opacity: [p.opacity, p.opacity * 1.6, p.opacity] }}
          transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute",
            left: `${p.x}%`,
            top: `${p.y}%`,
            fontFamily: "'JetBrains Mono',monospace",
            fontSize: 11,
            color: ACCENT,
            whiteSpace: "nowrap",
            userSelect: "none",
          }}
        >
          {p.text}
        </motion.div>
      ))}
    </div>
  );
}

/* ── ORBITING LANGUAGE DOTS ── */
function LangOrbit({ size = 160 }) {
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      {/* Orbit ring */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
        style={{ position: "absolute", inset: 0 }}
      >
        {LANGS.map(lang => {
          const rad = (lang.angle * Math.PI) / 180;
          const r   = size / 2 - 14;
          const cx  = size / 2 + r * Math.cos(rad) - 14;
          const cy  = size / 2 + r * Math.sin(rad) - 14;
          return (
            <div key={lang.label}
              style={{ position: "absolute", left: cx, top: cy, width: 28, height: 28, borderRadius: "50%", background: `${lang.color}20`, border: `1.5px solid ${lang.color}55`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 8.5, fontWeight: 700, color: lang.color }}>{lang.label}</span>
            </div>
          );
        })}
      </motion.div>
      {/* Centre CJ mark */}
      <motion.div
        animate={{ scale: [1, 1.04, 1] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
        }}
      >
        <div style={{
          width: 52, height: 52, borderRadius: 16,
          background: `linear-gradient(135deg, ${ACCENT}, ${TEAL})`,
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: `0 0 32px ${ACCENT}60`,
          fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 18, color: "#fff",
        }}>
          CJ
        </div>
      </motion.div>
    </div>
  );
}

/* ── BENEFIT CARD ROTATOR ── */
function BenefitRotator({ mode }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const iv = setInterval(() => setCurrent(c => (c + 1) % BENEFITS.length), 3200);
    return () => clearInterval(iv);
  }, []);

  const b = BENEFITS[current];

  return (
    <div style={{ width: "100%", maxWidth: 320 }}>
      {/* Rotating card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.4 }}
          style={{
            background: `${b.color}10`,
            border: `1px solid ${b.color}30`,
            borderRadius: 14,
            padding: "16px 18px",
            marginBottom: 12,
          }}
        >
          <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: `${b.color}20`, border: `1px solid ${b.color}40`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <b.icon size={16} color={b.color} />
            </div>
            <div>
              <p style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 14, color: "#e8eaf2", margin: "0 0 4px" }}>{b.title}</p>
              <p style={{ fontFamily: "'Lora',serif", fontSize: 13, color: "#8892b0", lineHeight: 1.65, margin: 0 }}>{b.desc}</p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Dot indicators */}
      <div style={{ display: "flex", gap: 5, justifyContent: "center" }}>
        {BENEFITS.map((_, i) => (
          <div key={i} onClick={() => setCurrent(i)} style={{ width: i === current ? 18 : 6, height: 6, borderRadius: 3, background: i === current ? ACCENT : "#2e3660", transition: "all 0.3s", cursor: "pointer" }} />
        ))}
      </div>
    </div>
  );
}

/* ── INPUT FIELD ── */
function Field({ label, type: inputType, value, onChange, placeholder, icon: Icon, validate, hint }) {
  const [showPw, setShowPw] = useState(false);
  const [focused, setFocused] = useState(false);
  const [touched, setTouched] = useState(false);
  const error = touched && validate ? validate(value) : null;
  const ok    = touched && !error && value.length > 0;

  const finalType = inputType === "password" ? (showPw ? "text" : "password") : inputType;

  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10.5, fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: focused ? ACCENT : "#5a6488", marginBottom: 7, display: "block", transition: "color 0.15s" }}>
        {label}
      </label>
      <div style={{ position: "relative" }}>
        {/* Left icon */}
        <div style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: focused ? ACCENT : "#3a4466", transition: "color 0.15s", pointerEvents: "none" }}>
          <Icon size={15} />
        </div>
        <input
          type={finalType}
          value={value}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => { setFocused(false); setTouched(true); }}
          placeholder={placeholder}
          style={{
            width: "100%",
            background: focused ? "rgba(124,110,224,0.07)" : "rgba(22,25,39,0.8)",
            border: `1.5px solid ${error ? RED + "88" : ok ? GREEN + "55" : focused ? ACCENT + "77" : "rgba(46,54,96,0.8)"}`,
            borderRadius: 10,
            padding: "11px 44px 11px 38px",
            fontFamily: "'Syne',sans-serif",
            fontSize: 14,
            color: "#e8eaf2",
            outline: "none",
            transition: "all 0.18s",
          }}
        />
        {/* Right: password toggle or check */}
        <div style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", cursor: "pointer", color: ok ? GREEN : "#3a4466" }}
          onClick={() => inputType === "password" && setShowPw(s => !s)}>
          {ok && inputType !== "password" ? (
            <Check size={15} color={GREEN} />
          ) : inputType === "password" ? (
            showPw ? <EyeOff size={15} /> : <Eye size={15} />
          ) : null}
        </div>
      </div>
      {error && (
        <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} style={{ fontFamily: "'Syne',sans-serif", fontSize: 11.5, color: RED, margin: "5px 0 0", paddingLeft: 4 }}>
          {error}
        </motion.p>
      )}
      {hint && !error && (
        <p style={{ fontFamily: "'Lora',serif", fontStyle: "italic", fontSize: 11.5, color: "#4a5275", margin: "5px 0 0", paddingLeft: 4 }}>{hint}</p>
      )}
    </div>
  );
}

/* ── VALIDATORS ── */
const validators = {
  name:  v => v.length < 2 ? "Name must be at least 2 characters" : null,
  email: v => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? "Enter a valid email address" : null,
  password: v => v.length < 8 ? "Password must be at least 8 characters" : null,
  confirmPassword: (v, pw) => v !== pw ? "Passwords don't match" : null,
};

/* ── PASSWORD STRENGTH ── */
function PasswordStrength({ password }) {
  const checks = [
    { label: "8+ characters", pass: password.length >= 8 },
    { label: "Uppercase",     pass: /[A-Z]/.test(password) },
    { label: "Number",        pass: /\d/.test(password) },
    { label: "Symbol",        pass: /[!@#$%^&*]/.test(password) },
  ];
  const score = checks.filter(c => c.pass).length;
  const colors = ["#f87171", "#f97316", "#fbbf24", "#22c55e"];
  const labels = ["Weak", "Fair", "Good", "Strong"];

  if (!password) return null;

  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", gap: 4, marginBottom: 6 }}>
        {[0, 1, 2, 3].map(i => (
          <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i < score ? colors[score - 1] : "#1e2335", transition: "background 0.3s" }} />
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {checks.map(c => (
            <span key={c.label} style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: c.pass ? GREEN : "#3a4466", display: "flex", alignItems: "center", gap: 3 }}>
              <span style={{ color: c.pass ? GREEN : "#2e3660" }}>{c.pass ? "✓" : "○"}</span> {c.label}
            </span>
          ))}
        </div>
        {score > 0 && <span style={{ fontFamily: "'Syne',sans-serif", fontSize: 11.5, fontWeight: 700, color: colors[score - 1] }}>{labels[score - 1]}</span>}
      </div>
    </div>
  );
}

/* ════════════════════════════════════
   MAIN AUTH PAGE
════════════════════════════════════ */
export default function AuthPage() {
  const [mode, setMode]         = useState("signup"); // "signup" | "login"
  const [direction, setDir]     = useState(1); // 1 = signup→login, -1 = login→signup

  /* Form state */
  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm]   = useState("");
  const [agreed, setAgreed]     = useState(false);
  const [submitting, setSub]    = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const switchMode = useCallback((next) => {
    if (next === mode) return;
    setDir(next === "login" ? 1 : -1);
    setMode(next);
    /* Reset form */
    setName(""); setEmail(""); setPassword(""); setConfirm(""); setAgreed(false); setSub(false); setSubmitted(false);
  }, [mode]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSub(true);
    setTimeout(() => { setSub(false); setSubmitted(true); }, 1600);
  };

  const isSignup = mode === "signup";

  /* Variants for the sliding panels */
  const panelVariants = {
    initial: (d) => ({ x: d > 0 ? "100%" : "-100%", opacity: 0 }),
    animate: { x: 0, opacity: 1, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
    exit:    (d) => ({ x: d > 0 ? "-100%" : "100%", opacity: 0, transition: { duration: 0.45, ease: [0.4, 0, 0.6, 1] } }),
  };

  /* Variants for form fields */
  const formVariants = {
    initial: (d) => ({ x: d > 0 ? 32 : -32, opacity: 0 }),
    animate: { x: 0, opacity: 1, transition: { duration: 0.4, delay: 0.1, ease: [0.22, 1, 0.36, 1] } },
    exit:    (d) => ({ x: d > 0 ? -32 : 32, opacity: 0, transition: { duration: 0.25 } }),
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Syne:wght@400;500;600;700;800&family=Lora:ital,wght@0,400;0,500;0,600;1,400;1,500;1,600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { height: 100%; }
        body { background: #07080d; min-height: 100%; }
        input:-webkit-autofill,
        input:-webkit-autofill:focus {
          -webkit-box-shadow: 0 0 0 1000px #0d0f1a inset;
          -webkit-text-fill-color: #e8eaf2;
          transition: background-color 5000s ease-in-out 0s;
        }
        ::selection { background: rgba(124,110,224,0.3); }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #1e2335; border-radius: 2px; }

        @keyframes cjGlow   { 0%,100%{box-shadow:0 0 20px ${ACCENT}55} 50%{box-shadow:0 0 48px ${ACCENT}88} }
        @keyframes cjFloat  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
        @keyframes cjSpin   { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes cjPulse  { 0%,100%{opacity:0.6;transform:scale(1)} 50%{opacity:1;transform:scale(1.05)} }
        @keyframes gradShift{ 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }

        .auth-btn {
          position: relative; overflow: hidden;
          background: linear-gradient(135deg, ${ACCENT}, ${TEAL}88);
          background-size: 200% 200%;
          animation: gradShift 4s ease infinite;
        }
        .auth-btn:hover { opacity: 0.9; transform: translateY(-1px); }
        .auth-btn:active { transform: translateY(0); }
        .auth-btn::after {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(135deg, transparent 40%, rgba(255,255,255,0.08) 50%, transparent 60%);
          transform: translateX(-100%); transition: transform 0.6s ease;
        }
        .auth-btn:hover::after { transform: translateX(100%); }

        .social-btn:hover { background: rgba(124,110,224,0.12) !important; border-color: rgba(124,110,224,0.4) !important; }

        @media (max-width: 820px) {
          .auth-layout { flex-direction: column !important; }
          .auth-brand  { display: none !important; }
          .auth-form-panel { width: 100% !important; max-width: 100% !important; min-height: 100vh !important; }
        }
      `}</style>

      <div style={{
        display: "flex",
        minHeight: "100vh",
        background: "#07080d",
        fontFamily: "'Syne',sans-serif",
        color: "#e8eaf2",
        overflow: "hidden",
        position: "relative",
      }}>

        {/* ── GLOBAL BACKGROUND GRADIENT ── */}
        <div style={{
          position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
          background: `
            radial-gradient(ellipse 60% 50% at ${isSignup ? "30%" : "70%"} 50%, ${ACCENT}18 0%, transparent 70%),
            radial-gradient(ellipse 40% 60% at ${isSignup ? "80%" : "20%"} 30%, ${TEAL}0e 0%, transparent 60%)
          `,
          transition: "all 1.2s ease",
        }} />

        {/* ── GRID TEXTURE ── */}
        <div style={{
          position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
          backgroundImage: `linear-gradient(rgba(120,130,180,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(120,130,180,0.05) 1px, transparent 1px)`,
          backgroundSize: "52px 52px",
        }} />

        {/* ════════════════════════════
            BRAND PANEL (left/right swap)
        ════════════════════════════ */}
        <motion.div
          className="auth-brand"
          layout
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: "relative", zIndex: 1,
            width: "50%", flexShrink: 0,
            order: 2,
            background: isSignup
              ? "linear-gradient(160deg, #0c0e18 0%, #111420 60%, #0d1324 100%)"
              : "linear-gradient(200deg, #0a0f1e 0%, #0c0e18 60%, #111420 100%)",
            borderRight:  isSignup ? `1px solid rgba(124,110,224,0.12)` : "none",
            borderLeft:   isSignup ? "none" : `1px solid rgba(124,110,224,0.12)`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "60px 40px",
            overflow: "hidden",
            transition: "background 0.8s ease, border 0.5s ease",
          }}
        >
          <FloatingParticles mode={mode} />

          {/* Inner content — slides when mode changes */}
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={mode + "-brand"}
              custom={direction}
              initial={{ opacity: 0, x: direction > 0 ? 40 : -40 }}
              animate={{ opacity: 1, x: 0, transition: { duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] } }}
              exit={{ opacity: 0, x: direction > 0 ? -40 : 40, transition: { duration: 0.3 } }}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 28, position: "relative", zIndex: 2, width: "100%", maxWidth: 360 }}
            >
              {/* Logo orbit */}
              <LangOrbit size={168} />

              {/* Headline */}
              <div style={{ textAlign: "center" }}>
                <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "clamp(22px,3vw,32px)", letterSpacing: "-0.8px", lineHeight: 1.1, marginBottom: 10, color: "#e8eaf2" }}>
                  {isSignup ? (
                    <>Your journey<br /><span style={{ color: ACCENT }}>starts here.</span></>
                  ) : (
                    <>Welcome<br /><span style={{ color: TEAL }}>back.</span></>
                  )}
                </h2>
                <p style={{ fontFamily: "'Lora',serif", fontStyle: "italic", fontSize: 14.5, color: "#8892b0", lineHeight: 1.75, maxWidth: 280 }}>
                  {isSignup
                    ? "Join thousands of beginners who chose Code Journey to find their tech stack."
                    : "Pick up right where you left off. Your progress, notes, and roadmap are waiting."
                  }
                </p>
              </div>

              {/* Benefit rotator (signup only) or stat chips (login) */}
              {isSignup ? (
                <BenefitRotator mode={mode} />
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%", maxWidth: 300 }}>
                  {[
                    { icon: Code2,    color: ACCENT, text: "Your code exercises & solutions saved" },
                    { icon: Layers,   color: TEAL,   text: "Roadmap progress tracked stage by stage" },
                    { icon: BookOpen, color: GREEN,  text: "Notes and tasks synced across devices" },
                  ].map(item => (
                    <div key={item.text} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: `${item.color}0c`, border: `1px solid ${item.color}28`, borderRadius: 10 }}>
                      <item.icon size={14} color={item.color} style={{ flexShrink: 0 }} />
                      <span style={{ fontFamily: "'Syne',sans-serif", fontSize: 13, color: "#c8cde0", fontWeight: 500 }}>{item.text}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Bottom stats strip */}
              <div style={{ display: "flex", gap: 20, justifyContent: "center" }}>
                {[["10K+", "Learners"], ["9", "Languages"], ["3", "Tracks"], ["Free", "Always"]].map(([val, lab]) => (
                  <div key={lab} style={{ textAlign: "center" }}>
                    <p style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 18, color: ACCENT, margin: 0, lineHeight: 1 }}>{val}</p>
                    <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9.5, color: "#5a6488", margin: "3px 0 0", letterSpacing: "0.5px" }}>{lab}</p>
                  </div>
                ))}
              </div>

            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* ════════════════════════════
            FORM PANEL
        ════════════════════════════ */}
        <motion.div
          className="auth-form-panel"
          layout
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: "relative", zIndex: 1,
            order: 1,
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "40px 24px",
            background: isSignup ? "#0c0e18" : "#0a0f1e",
            transition: "background 0.8s ease",
            minHeight: "100vh",
            overflowY: "auto",
          }}
        >
          <div style={{ width: "100%", maxWidth: 420 }}>

            {/* ── TOP: CJ mobile brand (hidden on desktop) ── */}
            <div style={{ textAlign: "center", marginBottom: 32, display: "none" }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: `linear-gradient(135deg, ${ACCENT}, ${TEAL})`, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 800, color: "#fff", boxShadow: `0 0 28px ${ACCENT}50`, marginBottom: 10 }}>CJ</div>
              <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "#5a6488", letterSpacing: "2px", textTransform: "uppercase" }}>Code Journey</p>
            </div>

            {/* ── MODE SWITCHER PILLS ── */}
            <div style={{
              display: "flex",
              background: "#111420",
              border: "1px solid rgba(46,54,96,0.6)",
              borderRadius: 12,
              padding: 4,
              marginBottom: 32,
              position: "relative",
            }}>
              {/* Sliding highlight */}
              <motion.div
                layout
                animate={{ x: isSignup ? 0 : "100%" }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                style={{
                  position: "absolute",
                  top: 4, left: 4,
                  width: "calc(50% - 4px)",
                  height: "calc(100% - 8px)",
                  borderRadius: 9,
                  background: `linear-gradient(135deg, ${ACCENT}22, ${TEAL}14)`,
                  border: `1px solid ${ACCENT}44`,
                }}
              />
              {[["signup", "Create Account"], ["login", "Sign In"]].map(([m, label]) => (
                <button key={m} onClick={() => switchMode(m)}
                  style={{ flex: 1, padding: "10px", borderRadius: 9, border: "none", background: "transparent", cursor: "pointer", fontFamily: "'Syne',sans-serif", fontWeight: mode === m ? 700 : 500, fontSize: 14, color: mode === m ? "#e8eaf2" : "#5a6488", position: "relative", zIndex: 1, transition: "color 0.2s" }}>
                  {label}
                </button>
              ))}
            </div>

            {/* ── FORM CONTENT (animated swap) ── */}
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={mode}
                custom={direction}
                variants={formVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                {/* Success state */}
                {submitted ? (
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    style={{ textAlign: "center", padding: "40px 0" }}
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 260, delay: 0.1 }}
                      style={{ width: 60, height: 60, borderRadius: "50%", background: `${GREEN}18`, border: `2px solid ${GREEN}44`, display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}
                    >
                      <Check size={26} color={GREEN} />
                    </motion.div>
                    <h3 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 22, color: "#e8eaf2", marginBottom: 10 }}>
                      {isSignup ? "Account created!" : "Welcome back!"}
                    </h3>
                    <p style={{ fontFamily: "'Lora',serif", fontStyle: "italic", fontSize: 15, color: "#8892b0" }}>
                      {isSignup ? "Redirecting you to your journey…" : "Loading your progress…"}
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} noValidate>

                    {/* Heading */}
                    <div style={{ marginBottom: 28 }}>
                      <h1 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "clamp(22px,3.5vw,28px)", color: "#e8eaf2", letterSpacing: "-0.5px", marginBottom: 7 }}>
                        {isSignup ? "Create your account" : "Sign in to continue"}
                      </h1>
                      <p style={{ fontFamily: "'Lora',serif", fontStyle: "italic", fontSize: 14.5, color: "#8892b0", lineHeight: 1.6 }}>
                        {isSignup
                          ? "Free forever. No credit card. Just code."
                          : "Your progress, projects, and roadmap are waiting."
                        }
                      </p>
                    </div>

                    {/* Social login */}
                    <div style={{ display: "flex", gap: 10, marginBottom: 22 }}>
                      {[
                        { label: "GitHub", icon: Smile , color: "#e8eaf2" },
                        { label: "Google", icon: Mail,   color: "#f87171" },
                      ].map(s => (
                        <button key={s.label} type="button"
                          className="social-btn"
                          style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "11px", borderRadius: 10, border: "1px solid rgba(46,54,96,0.7)", background: "rgba(22,25,39,0.8)", cursor: "pointer", fontFamily: "'Syne',sans-serif", fontWeight: 600, fontSize: 13.5, color: "#8892b0", transition: "all 0.16s" }}>
                          <s.icon size={15} color={s.color} />
                          {s.label}
                        </button>
                      ))}
                    </div>

                    {/* Divider */}
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 22 }}>
                      <div style={{ flex: 1, height: 1, background: "rgba(46,54,96,0.5)" }} />
                      <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10.5, color: "#3a4466", letterSpacing: "0.5px" }}>or with email</span>
                      <div style={{ flex: 1, height: 1, background: "rgba(46,54,96,0.5)" }} />
                    </div>

                    {/* Fields */}
                    {isSignup && (
                      <Field
                        label="Full name"
                        type="text"
                        value={name}
                        onChange={setName}
                        placeholder="Alex Johnson"
                        icon={User}
                        validate={validators.name}
                      />
                    )}

                    <Field
                      label="Email address"
                      type="email"
                      value={email}
                      onChange={setEmail}
                      placeholder="you@example.com"
                      icon={Mail}
                      validate={validators.email}
                    />

                    <Field
                      label="Password"
                      type="password"
                      value={password}
                      onChange={setPassword}
                      placeholder={isSignup ? "Create a strong password" : "Your password"}
                      icon={Lock}
                      validate={validators.password}
                    />

                    {isSignup && <PasswordStrength password={password} />}

                    {isSignup && (
                      <Field
                        label="Confirm password"
                        type="password"
                        value={confirm}
                        onChange={setConfirm}
                        placeholder="Repeat your password"
                        icon={Lock}
                        validate={v => validators.confirmPassword(v, password)}
                      />
                    )}

                    {/* Forgot password (login only) */}
                    {!isSignup && (
                      <div style={{ textAlign: "right", marginBottom: 20, marginTop: -8 }}>
                        <a href="#" style={{ fontFamily: "'Syne',sans-serif", fontSize: 12.5, color: ACCENT, textDecoration: "none", opacity: 0.8 }}
                          onMouseEnter={e => e.currentTarget.style.opacity = "1"}
                          onMouseLeave={e => e.currentTarget.style.opacity = "0.8"}>
                          Forgot password?
                        </a>
                      </div>
                    )}

                    {/* Terms checkbox (signup only) */}
                    {isSignup && (
                      <div style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 22 }}>
                        <div
                          onClick={() => setAgreed(a => !a)}
                          style={{
                            width: 18, height: 18, borderRadius: 5, border: `1.5px solid ${agreed ? ACCENT : "rgba(46,54,96,0.8)"}`,
                            background: agreed ? `${ACCENT}20` : "transparent",
                            flexShrink: 0, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", marginTop: 1, transition: "all 0.15s",
                          }}
                        >
                          {agreed && <Check size={11} color={ACCENT} />}
                        </div>
                        <p style={{ fontFamily: "'Lora',serif", fontSize: 13, color: "#5a6488", lineHeight: 1.6 }}>
                          I agree to the <a href="/terms" style={{ color: ACCENT, textDecoration: "none" }}>Terms of Service</a> and <a href="/privacy" style={{ color: ACCENT, textDecoration: "none" }}>Privacy Policy</a>
                        </p>
                      </div>
                    )}

                    {/* Submit button */}
                    <button
                      type="submit"
                      className="auth-btn"
                      disabled={submitting || (isSignup && !agreed)}
                      style={{
                        width: "100%",
                        padding: "13px",
                        borderRadius: 11,
                        border: "none",
                        cursor: submitting || (isSignup && !agreed) ? "not-allowed" : "pointer",
                        opacity: isSignup && !agreed ? 0.5 : 1,
                        fontFamily: "'Syne',sans-serif",
                        fontWeight: 700,
                        fontSize: 15,
                        color: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 8,
                        marginBottom: 20,
                        transition: "all 0.18s",
                      }}
                    >
                      {submitting ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                            style={{ width: 16, height: 16, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.3)", borderTop: "2px solid #fff" }}
                          />
                          {isSignup ? "Creating account…" : "Signing in…"}
                        </>
                      ) : (
                        <>
                          {isSignup ? "Start my journey" : "Continue journey"}
                          <ArrowRight size={16} />
                        </>
                      )}
                    </button>

                    {/* Switch mode link */}
                    <p style={{ textAlign: "center", fontFamily: "'Syne',sans-serif", fontSize: 13.5, color: "#5a6488" }}>
                      {isSignup ? "Already have an account? " : "New to Code Journey? "}
                      <button type="button" onClick={() => switchMode(isSignup ? "login" : "signup")}
                        style={{ background: "none", border: "none", cursor: "pointer", color: ACCENT, fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 13.5, padding: 0, transition: "opacity 0.15s" }}
                        onMouseEnter={e => e.currentTarget.style.opacity = "0.8"}
                        onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
                        {isSignup ? "Sign in" : "Create a free account"}
                      </button>
                    </p>

                    {/* Benefits teaser (signup only) */}
                    {/* {isSignup && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        style={{ marginTop: 28, padding: "16px", background: "rgba(124,110,224,0.06)", border: "1px solid rgba(124,110,224,0.18)", borderRadius: 12 }}
                      >
                        <p style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 11, color: ACCENT, letterSpacing: "1.2px", textTransform: "uppercase", marginBottom: 10 }}>What you unlock</p>
                        <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                          {[
                            "Run code in 9 languages — no setup, ever",
                            "Stage-by-stage roadmap that tracks your progress",
                            "Notes, tasks, and exercises synced to your profile",
                            "Platform changelog — always know what's new",
                          ].map(benefit => (
                            <div key={benefit} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                              <Sparkles size={12} color={ACCENT} style={{ flexShrink: 0, marginTop: 2 }} />
                              <span style={{ fontFamily: "'Lora',serif", fontSize: 13, color: "#8892b0", lineHeight: 1.55 }}>{benefit}</span>
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
        </motion.div>

      </div>
    </>
  );
}