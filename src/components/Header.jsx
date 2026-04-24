import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Search, X, Menu, ArrowUpRight, Code2, Globe,
  ChevronDown, Zap, Command,
} from "lucide-react";
import { supabase } from "../lib/supabase";

/* ═══════════════════════════════════════════════════════════════════
   CJ LOGO
═══════════════════════════════════════════════════════════════════ */
export function CJLogo({ size = 36 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none"
      xmlns="http://www.w3.org/2000/svg" aria-label="Code Journey">
      <defs>
        <linearGradient id="cjg1" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#7c6ee0" />
          <stop offset="55%" stopColor="#5eead4" />
          <stop offset="100%" stopColor="#7c6ee0" />
        </linearGradient>
        <linearGradient id="cjg2" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#7c6ee0" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#5eead4" stopOpacity="0.08" />
        </linearGradient>
      </defs>
      <rect x="1" y="1" width="34" height="34" rx="10"
        fill="url(#cjg2)" stroke="url(#cjg1)" strokeWidth="1.2" opacity="0.85" />
      <path d="M22 12.5 C18 10.5 11 11.5 11 18 C11 24.5 18 25.5 22 23.5"
        stroke="url(#cjg1)" strokeWidth="2.2" strokeLinecap="round" fill="none" />
      <path d="M25 12 L25 21 C25 24.5 22.5 26.5 19.5 25.5"
        stroke="url(#cjg1)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <circle cx="25" cy="12" r="1.4" fill="#5eead4" opacity="0.9" />
      <circle cx="5" cy="5" r="1.1" fill="#7c6ee0" opacity="0.45" />
      <circle cx="31" cy="31" r="1.1" fill="#5eead4" opacity="0.45" />
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   NAV DATA
═══════════════════════════════════════════════════════════════════ */
const NAV = [
  {
    label: "Learn", icon: Code2, color: "#7c6ee0",
    children: [
      { label: "Web Dev", href: "/tracks/web", desc: "HTML → React → Node.js", color: "#f97316", icon: "◈" },
      { label: "App Dev", href: "/tracks/app", desc: "Flutter, Swift, Kotlin, RN", color: "#5eead4", icon: "◉" },
      { label: "Data Science", href: "/tracks/data", desc: "Python, SQL, ML, R", color: "#f472b6", icon: "◎" },
      { label: "Languages", href: "/tracks", desc: "All 9 languages explained", color: "#7c6ee0", icon: "◇" },
    ],
  },
  {
    label: "Explore", icon: Globe, color: "#5eead4",
    children: [
      { label: "Roadmap", href: "/roadmap", desc: "Stage-by-stage path", color: "#5eead4", icon: "→" },
      { label: "Snippet Library", href: "/snippets", desc: "Copy-paste patterns", color: "#a78bfa", icon: "{ }" },
      { label: "Glossary", href: "/glossary", desc: "Every term, plain English", color: "#60a5fa", icon: "Aa" },
      { label: "Blog", href: "/blog", desc: "Guides & deep dives", color: "#f97316", icon: "✦" },
    ],
  },
  {
    label: "Platform", icon: Zap, color: "#f97316",
    children: [
      { label: "Careers", href: "/careers", desc: "Companies hiring from CJ", color: "#22c55e", icon: "⬡" },
      { label: "Ecosystem", href: "/ecosystem", desc: "Tools & frameworks map", color: "#60a5fa", icon: "◈" },
      // { label: "Changelog",  href: "/logs",      desc: "Platform updates",            color: "#a78bfa", icon: "◌" },
      { label: "About", href: "/about", desc: "Our mission", color: "#5eead4", icon: "◉" },
    ],
  },
];

/* ═══════════════════════════════════════════════════════════════════
   MEGA DROPDOWN — polished redesign
═══════════════════════════════════════════════════════════════════ */
function MegaDrop({ item, onClose }) {
  const shouldReduce = useReducedMotion();

  return (
    <motion.div
      initial={shouldReduce ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={shouldReduce ? { opacity: 0 } : { opacity: 0, y: 4, scale: 0.97 }}
      transition={{ duration: 0.16, ease: [0.25, 1, 0.3, 1] }}
      style={{
        position: "absolute",
        top: "calc(100% + 10px)",
        left: "50%",
        transform: "translateX(-50%)",
        background: "var(--drop-bg)",
        backdropFilter: "blur(28px) saturate(180%)",
        WebkitBackdropFilter: "blur(28px) saturate(180%)",
        border: "1px solid var(--drop-border)",
        borderRadius: 20,
        padding: 8,
        minWidth: 480,
        boxShadow: "var(--drop-shadow)",
        zIndex: 10,
        overflow: "hidden",
      }}
    >
      {/* Accent stripe at top */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 2.5,
        background: `linear-gradient(90deg, transparent 0%, ${item.color}88 40%, ${item.color} 60%, transparent 100%)`,
        borderRadius: "20px 20px 0 0",
      }} />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 5, paddingTop: 6 }}>
        {item.children.map((c, i) => (
          <DropLink key={c.label} c={c} onClose={onClose} index={i} />
        ))}
      </div>
    </motion.div>
  );
}

function DropLink({ c, onClose, index }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      to={c.href}
      onClick={onClose}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 14,
        padding: "16px 16px",
        borderRadius: 14,
        textDecoration: "none",
        transition: "background 0.13s, transform 0.13s",
        background: hovered ? "var(--drop-item-hover)" : "transparent",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Icon badge */}
      <div style={{
        width: 42, height: 42, borderRadius: 12,
        background: hovered ? `${c.color}28` : `${c.color}14`,
        border: `1px solid ${c.color}${hovered ? "60" : "28"}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0, transition: "all 0.13s",
        fontSize: 16, color: c.color,
        fontFamily: "'JetBrains Mono', monospace",
        fontWeight: 700,
      }}>
        {c.icon}
      </div>

      <div style={{ minWidth: 0, paddingTop: 2 }}>
        <p style={{
          fontFamily: "'Syne', sans-serif",
          fontWeight: 700, fontSize: 15,
          color: hovered ? "var(--text-primary)" : "var(--text-secondary)",
          margin: "0 0 4px",
          transition: "color 0.13s",
          whiteSpace: "nowrap",
          display: "flex", alignItems: "center", gap: 5,
        }}>
          {c.label}
          <ArrowUpRight size={13} style={{
            opacity: hovered ? 0.75 : 0,
            transform: hovered ? "translate(2px,-2px)" : "translate(0,0)",
            transition: "opacity 0.13s, transform 0.13s",
            color: c.color,
          }} />
        </p>
        <p style={{
          fontFamily: "'Lora', serif",
          fontSize: 12.5, color: "var(--text-muted)",
          margin: 0, fontStyle: "italic",
          lineHeight: 1.4,
        }}>
          {c.desc}
        </p>
      </div>
    </Link>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   SEARCH MODAL
═══════════════════════════════════════════════════════════════════ */
const QUICK = [
  { label: "HTML", href: "/tracks/web#html" },
  { label: "JavaScript", href: "/tracks/web#javascript" },
  { label: "Flutter", href: "/tracks/app#flutter" },
  { label: "Python", href: "/tracks/data#python" },
  { label: "SQL", href: "/tracks/data#sql" },
  { label: "React", href: "/tracks/web#react" },
  { label: "Roadmap", href: "/roadmap" },
  { label: "Glossary", href: "/glossary" },
  { label: "Blog", href: "/blog" },
  { label: "Snippets", href: "/snippets" },
  { label: "Careers", href: "/careers" },
  { label: "About", href: "/about" },
];

function HeaderSearch({ onClose }) {
  const [q, setQ] = useState("");
  const inp = useRef(null);
  const navigate = useNavigate();

  useEffect(() => { inp.current?.focus(); }, []);

  const results = q.trim()
    ? QUICK.filter(i => i.label.toLowerCase().includes(q.toLowerCase())).slice(0, 8)
    : [];

  const go = href => { navigate(href); onClose(); };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{
        position: "fixed", inset: 0, zIndex: 2000,
        display: "flex", alignItems: "flex-start", justifyContent: "center",
        paddingTop: 90,
        background: "var(--overlay-bg)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
    >
      <div onClick={onClose} style={{ position: "absolute", inset: 0 }} />
      <motion.div
        initial={{ scale: 0.96, y: -12 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.96, y: -12 }}
        transition={{ duration: 0.18, ease: [0.25, 1, 0.3, 1] }}
        style={{
          position: "relative",
          width: "min(560px,92vw)",
          background: "var(--search-bg)",
          border: "1px solid var(--search-border)",
          borderRadius: 18,
          overflow: "hidden",
          boxShadow: "var(--search-shadow)",
        }}
      >
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          padding: "14px 16px",
          borderBottom: "1px solid var(--divider)",
        }}>
          <Search size={15} color="var(--accent-purple)" />
          <input
            ref={inp} value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Search languages, tools, pages…"
            onKeyDown={e => {
              if (e.key === "Escape") onClose();
              if (e.key === "Enter" && results.length > 0) go(results[0].href);
            }}
            style={{
              flex: 1, background: "transparent",
              border: "none", outline: "none",
              fontFamily: "'Syne', sans-serif",
              fontSize: 15, color: "var(--text-primary)",
            }}
          />
          <button onClick={onClose} style={{
            background: "var(--drop-footer)", border: "1px solid var(--divider)",
            borderRadius: 6, cursor: "pointer",
            color: "var(--text-muted)",
            display: "flex", alignItems: "center", justifyContent: "center",
            width: 24, height: 24,
          }}>
            <X size={13} />
          </button>
        </div>

        {q.trim() === "" && (
          <div style={{ padding: "12px 16px 8px" }}>
            <p style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 10, color: "var(--text-muted)",
              letterSpacing: "0.08em", textTransform: "uppercase",
              marginBottom: 10,
            }}>
              Quick links
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {QUICK.slice(0, 9).map(i => (
                <QuickChip key={i.label} label={i.label} onClick={() => go(i.href)} />
              ))}
            </div>
          </div>
        )}

        {results.length > 0 && (
          <div style={{ padding: 6 }}>
            {results.map(r => (
              <SearchResult key={r.label} r={r} go={go} />
            ))}
          </div>
        )}

        {q.trim() !== "" && results.length === 0 && (
          <div style={{
            padding: "32px", textAlign: "center",
            color: "var(--text-muted)",
            fontFamily: "'Syne', sans-serif", fontSize: 14,
          }}>
            No results for "{q}"
          </div>
        )}

        <div style={{
          padding: "8px 16px 10px",
          borderTop: "1px solid var(--divider)",
          display: "flex", gap: 14,
        }}>
          {[["↵", "Navigate"], ["Esc", "Close"]].map(([k, l]) => (
            <span key={k} style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 10, color: "var(--text-muted)",
              display: "flex", alignItems: "center", gap: 5,
            }}>
              <kbd style={{
                padding: "2px 6px", borderRadius: 4,
                border: "1px solid var(--divider)",
                background: "var(--drop-footer)",
                fontSize: 9, lineHeight: 1.5,
              }}>{k}</kbd>{l}
            </span>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

function QuickChip({ label, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        padding: "5px 12px", borderRadius: 8,
        border: `1px solid ${hov ? "rgba(124,110,224,0.5)" : "var(--divider)"}`,
        background: hov ? "rgba(124,110,224,0.15)" : "var(--drop-footer)",
        color: hov ? "var(--text-primary)" : "var(--text-secondary)",
        fontFamily: "'Syne', sans-serif", fontSize: 12.5,
        cursor: "pointer", transition: "all 0.12s",
      }}>
      {label}
    </button>
  );
}

function SearchResult({ r, go }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={() => go(r.href)}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "flex", alignItems: "center", gap: 10,
        width: "100%", padding: "9px 12px",
        borderRadius: 10, border: "none",
        background: hov ? "var(--drop-item-hover)" : "transparent",
        cursor: "pointer", transition: "background 0.12s", textAlign: "left",
      }}>
      <Search size={12} color="var(--accent-purple)" style={{ opacity: 0.6 }} />
      <span style={{
        fontFamily: "'Syne', sans-serif", fontSize: 14,
        color: "var(--text-primary)", fontWeight: 600,
      }}>{r.label}</span>
      <ArrowUpRight size={11} color="var(--text-muted)" style={{ marginLeft: "auto" }} />
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   MOBILE DRAWER
═══════════════════════════════════════════════════════════════════ */
function MobileDrawer({ open, onClose, user }) {
  const [expanded, setEx] = useState(null);
  const navigate = useNavigate();
  const go = href => { navigate(href); onClose(); };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          style={{ position: "fixed", inset: 0, zIndex: 1500 }}
        >
          <div onClick={onClose} style={{
            position: "absolute", inset: 0,
            background: "var(--overlay-bg)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
          }} />
          <motion.div
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ duration: 0.26, ease: [0.25, 1, 0.3, 1] }}
            style={{
              position: "absolute", right: 0, top: 0, bottom: 0,
              width: "min(300px,88vw)",
              background: "var(--search-bg)",
              borderLeft: "1px solid var(--drop-border)",
              display: "flex", flexDirection: "column", overflowY: "auto",
            }}
          >
            {/* Header */}
            <div style={{
              display: "flex", alignItems: "center",
              justifyContent: "space-between",
              padding: "16px 18px",
              borderBottom: "1px solid var(--divider)",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                <CJLogo size={28} />
                <span style={{
                  fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 14,
                  background: "linear-gradient(90deg,#7c6ee0,#5eead4)",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}>CODE JOURNEY</span>
              </div>
              <button onClick={onClose} style={{
                width: 28, height: 28, borderRadius: "50%",
                background: "var(--drop-footer)",
                border: "1px solid var(--divider)",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", color: "var(--text-muted)",
              }}>
                <X size={13} />
              </button>
            </div>

            {/* Items */}
            <div style={{ flex: 1, padding: "10px 10px" }}>
              {NAV.map(item => (
                <div key={item.label} style={{ marginBottom: 3 }}>
                  <button
                    onClick={() => setEx(ex => ex === item.label ? null : item.label)}
                    style={{
                      display: "flex", alignItems: "center", gap: 9,
                      width: "100%", padding: "9px 12px",
                      borderRadius: 10, border: "none",
                      background: expanded === item.label ? "var(--drop-item-hover)" : "transparent",
                      cursor: "pointer", transition: "background 0.13s",
                    }}
                  >
                    <item.icon size={14} color={item.color} />
                    <span style={{
                      fontFamily: "'Syne', sans-serif", fontWeight: 700,
                      fontSize: 13.5, color: "var(--text-primary)", flex: 1, textAlign: "left",
                    }}>{item.label}</span>
                    <ChevronDown size={12} color="var(--text-muted)" style={{
                      transform: expanded === item.label ? "rotate(180deg)" : "none",
                      transition: "transform 0.2s",
                    }} />
                  </button>
                  <AnimatePresence>
                    {expanded === item.label && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: [0.25, 1, 0.3, 1] }}
                        style={{ overflow: "hidden" }}
                      >
                        <div style={{ paddingLeft: 6, paddingBottom: 4, paddingTop: 2 }}>
                          {item.children.map(c => (
                            <MobileNavLink key={c.label} c={c} go={go} />
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div style={{
              padding: "14px 14px",
              borderTop: "1px solid var(--divider)",
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}>
              {user ? (
                <>
                  <button
                    onClick={() => go("/profile")}
                    style={{
                      padding: "10px",
                      borderRadius: 10,
                      border: "none",
                      background: "linear-gradient(135deg,#7c6ee0,#5a52c4)",
                      color: "#fff",
                      fontFamily: "'Syne', sans-serif",
                      fontWeight: 700,
                      fontSize: 13,
                      cursor: "pointer",
                    }}
                  >
                    Profile
                  </button>

                  <button
                    onClick={async () => {

                      await supabase.auth.signOut();
                      go("/");
                    }}
                    style={{
                      padding: "10px",
                      borderRadius: 10,
                      border: "1px solid var(--divider)",
                      background: "transparent",
                      color: "var(--text-primary)",
                      fontFamily: "'Syne', sans-serif",
                      fontWeight: 600,
                      fontSize: 13,
                      cursor: "pointer",
                    }}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => go("/login")}
                    style={{
                      padding: "10px",
                      borderRadius: 10,
                      border: "1px solid var(--drop-border)",
                      background: "transparent",
                      color: "var(--text-primary)",
                      fontFamily: "'Syne', sans-serif",
                      fontWeight: 600,
                      fontSize: 13,
                      cursor: "pointer",
                    }}
                  >
                    Log in
                  </button>

                  <button
                    onClick={() => go("/register")}
                    style={{
                      padding: "10px",
                      borderRadius: 10,
                      border: "none",
                      background: "linear-gradient(135deg,#7c6ee0,#5a52c4)",
                      color: "#fff",
                      fontFamily: "'Syne', sans-serif",
                      fontWeight: 700,
                      fontSize: 13,
                      cursor: "pointer",
                    }}
                  >
                    Get started
                  </button>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function MobileNavLink({ c, go }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={() => go(c.href)}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "flex", alignItems: "center", gap: 10,
        width: "100%", padding: "8px 12px",
        borderRadius: 9, border: "none",
        background: hov ? "var(--drop-item-hover)" : "transparent",
        cursor: "pointer", transition: "background 0.12s", textAlign: "left",
      }}
    >
      <span style={{
        width: 22, height: 22, borderRadius: 6,
        background: `${c.color}18`,
        border: `1px solid ${c.color}30`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 11, color: c.color,
        fontFamily: "'JetBrains Mono', monospace",
        flexShrink: 0,
      }}>{c.icon}</span>
      <span style={{
        fontFamily: "'Syne', sans-serif", fontSize: 13,
        color: "var(--text-secondary)", fontWeight: 500,
      }}>{c.label}</span>
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   MAIN HEADER
═══════════════════════════════════════════════════════════════════ */
export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [activeDrop, setDrop] = useState(null);
  const [searchOpen, setSearch] = useState(false);
  const [mobileOpen, setMobile] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dropTimer = useRef(null);
  const shouldReduce = useReducedMotion();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data?.user || null);
    };

    getUser();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_, session) => {
        setUser(session?.user || null);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => { setDrop(null); setMobile(false); }, [location.pathname]);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const fn = e => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); setSearch(true); }
      if (e.key === "Escape") { setDrop(null); setSearch(false); setMobile(false); }
    };
    document.addEventListener("keydown", fn);
    return () => document.removeEventListener("keydown", fn);
  }, []);

  const openDrop = label => { clearTimeout(dropTimer.current); setDrop(label); };
  const closeDrop = () => { dropTimer.current = setTimeout(() => setDrop(null), 140); };
  const keepDrop = () => clearTimeout(dropTimer.current);

  return (
    <>
      {/* ── CSS VARIABLES (adaptive dark/light + glass) ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600&family=Syne:wght@400;500;600;700;800&family=Lora:ital,wght@0,400;1,400;1,500&display=swap');

        /* ── TOKENS — light defaults, dark override ────────────────── */
        :root {
          --accent-purple: #7c6ee0;
          --accent-teal:   #5eead4;

          /* header pill */
          --pill-bg-rest:     rgba(255,255,255,0.55);
          --pill-bg-scrolled: rgba(255,255,255,0.75);
          --pill-border-rest: rgba(0,0,0,0.08);
          --pill-border-scrolled: rgba(0,0,0,0.13);
          --pill-shadow-rest: 0 2px 20px rgba(0,0,0,0.08);
          --pill-shadow-scrolled: 0 4px 32px rgba(0,0,0,0.14), 0 0 0 0.5px rgba(124,110,224,0.12);

          /* text */
          --text-primary:   rgba(12,10,28,0.92);
          --text-secondary: rgba(12,10,28,0.72);
          --text-muted:     rgba(12,10,28,0.38);

          /* dropdown / search */
          --drop-bg:          rgba(252,251,255,0.94);
          --drop-border:      rgba(0,0,0,0.09);
          --drop-shadow:      0 16px 56px rgba(0,0,0,0.13), 0 0 0 0.5px rgba(124,110,224,0.12);
          --drop-footer:      rgba(124,110,224,0.06);
          --drop-item-hover:  rgba(124,110,224,0.07);

          --search-bg:        rgba(255,255,255,0.96);
          --search-border:    rgba(0,0,0,0.1);
          --search-shadow:    0 20px 70px rgba(0,0,0,0.15);

          --divider:          rgba(0,0,0,0.07);
          --overlay-bg:       rgba(0,0,0,0.35);

          /* nav button */
          --navbtn-color:     rgba(12,10,28,0.62);
          --navbtn-active-bg: rgba(124,110,224,0.1);
          --navbtn-active-color: #5a4fc8;
        }

        @media (prefers-color-scheme: dark) {
          :root {
            --pill-bg-rest:     rgba(10,8,22,0.65);
            --pill-bg-scrolled: rgba(8,6,18,0.88);
            --pill-border-rest: rgba(124,110,224,0.14);
            --pill-border-scrolled: rgba(124,110,224,0.24);
            --pill-shadow-rest: 0 2px 20px rgba(0,0,0,0.28);
            --pill-shadow-scrolled: 0 4px 36px rgba(0,0,0,0.55), 0 0 0 0.5px rgba(124,110,224,0.2);

            --text-primary:   rgba(245,243,255,0.94);
            --text-secondary: rgba(245,243,255,0.72);
            --text-muted:     rgba(245,243,255,0.36);

            --drop-bg:          rgba(10,8,22,0.95);
            --drop-border:      rgba(124,110,224,0.18);
            --drop-shadow:      0 20px 64px rgba(0,0,0,0.65), 0 0 0 0.5px rgba(124,110,224,0.15);
            --drop-footer:      rgba(124,110,224,0.06);
            --drop-item-hover:  rgba(255,255,255,0.05);

            --search-bg:        rgba(10,8,22,0.98);
            --search-border:    rgba(124,110,224,0.3);
            --search-shadow:    0 24px 80px rgba(0,0,0,0.75);

            --divider:          rgba(255,255,255,0.07);
            --overlay-bg:       rgba(0,0,0,0.65);

            --navbtn-color:     rgba(245,243,255,0.6);
            --navbtn-active-bg: rgba(124,110,224,0.14);
            --navbtn-active-color: #c4bbff;
          }
        }

        /* ── GLOBAL ─────────────────────────────────────────────────── */
        *, *::before, *::after { box-sizing: border-box; }

        @keyframes cjShimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }

        /* ── PILL ───────────────────────────────────────────────────── */
        .cj-pill {
          position: fixed; top: 14px; left: 50%;
          transform: translateX(-50%);
          width: min(1020px, calc(100vw - 28px));
          height: 60px;
          display: flex; align-items: center;
          background: var(--pill-bg-rest);
          backdrop-filter: blur(20px) saturate(180%);
          -webkit-backdrop-filter: blur(20px) saturate(180%);
          border-radius: 16px;
          border: 1px solid var(--pill-border-rest);
          box-shadow: var(--pill-shadow-rest);
          transition: background 0.25s, border-color 0.25s, box-shadow 0.25s;
          z-index: 900; padding: 0 16px; gap: 8px;
        }
        .cj-pill.scrolled {
          background: var(--pill-bg-scrolled);
          border-color: var(--pill-border-scrolled);
          box-shadow: var(--pill-shadow-scrolled);
        }

        /* ── LOGO TEXT ──────────────────────────────────────────────── */
        .cj-logo-text {
          font-family: 'Syne', sans-serif;
          font-weight: 800; font-size: 16px; letter-spacing: 0.4px;
          background: linear-gradient(90deg, #7c6ee0 0%, #9b8df0 30%, #5eead4 60%, #7c6ee0 100%);
          background-size: 200% auto;
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: cjShimmer 5s linear infinite;
          white-space: nowrap;
        }

        /* ── NAV BUTTON ─────────────────────────────────────────────── */
        .cj-navbtn {
          display: flex; align-items: center; gap: 4px;
          padding: 6px 12px; border-radius: 9px;
          border: none; background: transparent;
          cursor: pointer;
          font-family: 'Syne', sans-serif;
          font-weight: 600; font-size: 13.5px;
          color: var(--navbtn-color);
          transition: color 0.14s, background 0.14s;
          white-space: nowrap; position: relative;
        }
        .cj-navbtn:hover, .cj-navbtn.active {
          color: var(--navbtn-active-color);
          background: var(--navbtn-active-bg);
        }

        /* ── SEARCH TRIGGER ─────────────────────────────────────────── */
        .cj-search-pill {
          display: flex; align-items: center; gap: 7px;
          padding: 6px 12px; border-radius: 9px;
          border: 1px solid var(--divider);
          background: var(--drop-footer);
          cursor: pointer; transition: all 0.15s;
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px; color: var(--text-muted);
          white-space: nowrap;
        }
        .cj-search-pill:hover {
          border-color: rgba(124,110,224,0.4);
          background: rgba(124,110,224,0.1);
          color: var(--text-secondary);
        }

        /* ── CTA BUTTONS ────────────────────────────────────────────── */
        .cj-cta-login {
          padding: 7px 15px; border-radius: 9px;
          border: 1px solid var(--drop-border);
          background: transparent;
          color: var(--text-secondary);
          font-family: 'Syne', sans-serif; font-weight: 600; font-size: 13px;
          cursor: pointer; transition: all 0.15s; white-space: nowrap;
        }
        .cj-cta-login:hover {
          border-color: rgba(124,110,224,0.5);
          color: var(--text-primary);
          background: var(--navbtn-active-bg);
        }
        .cj-cta-main {
          padding: 7px 17px; border-radius: 9px; border: none;
          background: linear-gradient(135deg,#7c6ee0,#5a52c4);
          color: #fff;
          font-family: 'Syne', sans-serif; font-weight: 700; font-size: 13px;
          cursor: pointer; transition: all 0.15s; white-space: nowrap;
        }
        .cj-cta-main:hover {
          opacity: 0.88; transform: translateY(-1px);
          box-shadow: 0 4px 18px rgba(124,110,224,0.45);
        }

        /* ── HAMBURGER ──────────────────────────────────────────────── */
        .cj-mobile-btn {
          width: 36px; height: 36px; border-radius: 9px;
          border: 1px solid var(--divider);
          background: var(--drop-footer);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; flex-shrink: 0; transition: all 0.14s;
        }
        .cj-mobile-btn:hover { background: var(--navbtn-active-bg); }

        /* ── RESPONSIVE ─────────────────────────────────────────────── */
        @media (max-width: 768px) {
          .cj-pill { height: 54px; top: 10px; border-radius: 14px; }
          .cj-logo-text { font-size: 13px; }
          .cj-desktop-nav { display: none !important; }
          .cj-auth-btns    { display: none !important; }
          .cj-mobile-only  { display: flex !important; }
        }
        @media (min-width: 769px) {
          .cj-mobile-only { display: none !important; }
        }
        .cj-mobile-only { display: none; }

        @media (max-width: 520px) {
          .cj-search-hint { display: none !important; }
          .cj-search-pill { padding: 7px; }
        }
      `}</style>

      {/* ── PILL BAR ── */}
      <div className={`cj-pill${scrolled ? " scrolled" : ""}`}>

        {/* Logo */}
        <Link to="/" style={{
          display: "flex", alignItems: "center",
          gap: 9, textDecoration: "none", flexShrink: 0, marginRight: 6,
        }}>
          <CJLogo size={32} />
          <span className="cj-logo-text">CODE JOURNEY</span>
        </Link>

        {/* Desktop Nav */}
        <div
          className="cj-desktop-nav"
          style={{ display: "flex", alignItems: "center", gap: 2, flex: 1, justifyContent: "center" }}
        >
          {NAV.map(item => (
            <div key={item.label} style={{ position: "relative" }}
              onMouseEnter={() => openDrop(item.label)}
              onMouseLeave={closeDrop}
            >
              <button className={`cj-navbtn${activeDrop === item.label ? " active" : ""}`}>
                {item.label}
                <ChevronDown size={11} style={{
                  opacity: 0.55,
                  transform: activeDrop === item.label ? "rotate(180deg)" : "none",
                  transition: shouldReduce ? "none" : "transform 0.18s",
                }} />
              </button>
              <AnimatePresence>
                {activeDrop === item.label && (
                  <div onMouseEnter={keepDrop} onMouseLeave={closeDrop}>
                    <MegaDrop item={item} onClose={() => setDrop(null)} />
                  </div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* Right zone */}
        <div style={{
          display: "flex", alignItems: "center",
          gap: 7, marginLeft: "auto", flexShrink: 0,
        }}>
          {/* Search */}
          <button className="cj-search-pill" onClick={() => setSearch(true)} aria-label="Search">
            <Search size={13} color="var(--accent-purple)" />
            <span className="cj-search-hint" style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span>Search</span>
              <kbd style={{
                padding: "1px 5px", borderRadius: 4,
                border: "1px solid var(--divider)",
                fontSize: 10, lineHeight: 1.4,
                background: "var(--drop-footer)",
                color: "var(--text-muted)",
                fontFamily: "'JetBrains Mono', monospace",
              }}>⌘K</kbd>
            </span>
          </button>

          {/* Auth — desktop only */}
          <div className="cj-auth-btns" style={{ display: "flex", gap: 5 }}>
            {user ? (
              <button
                className="cj-cta-main"
                onClick={() => navigate("/profile")}
                style={{ display: "flex", alignItems: "center", gap: 6 }}
              >
                Profile
              </button>
            ) : (
              <>
                <button
                  className="cj-cta-login"
                  onClick={() => navigate("/login")}
                >
                  Log in
                </button>
                <button
                  className="cj-cta-main"
                  onClick={() => navigate("/register")}
                >
                  Get started
                </button>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button className="cj-mobile-btn cj-mobile-only"
            onClick={() => setMobile(true)} aria-label="Menu">
            <Menu size={15} color="var(--text-secondary)" />
          </button>
        </div>
      </div>

      {/* Search modal */}
      <AnimatePresence>
        {searchOpen && <HeaderSearch onClose={() => setSearch(false)} />}
      </AnimatePresence>

      {/* Mobile drawer */}
      <MobileDrawer open={mobileOpen} onClose={() => setMobile(false)} user={user} />
    </>
  );
}