import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { FaTwitter, FaInstagram, FaGithub, FaLinkedinIn } from "react-icons/fa";
import { ArrowUpRight, Zap, Code2, Globe, BookOpen, Mail } from "lucide-react";

/* ─── Fixed dark cosmic palette — never changes with platform theme ─── */
const C = {
  bg:       "#04050a",
  deep:     "#060810",
  surface:  "#0c0e1a",
  card:     "#0f1120",
  t1:       "#e8eaf2",
  t2:       "#6b7494",
  t3:       "#3a4060",
  accent:   "#7c6ee0",
  teal:     "#5eead4",
  green:    "#22c55e",
  gold:     "#fbbf24",
  b1:       "rgba(120,130,180,0.07)",
  b2:       "rgba(120,130,180,0.13)",
  b3:       "rgba(120,130,180,0.22)",
};

/* ─── Floating code particles ─── */
const SYMBOLS = ["const","=>","fn ","def ","{}","[]","<T>","async","import","type","let","::","null","0x"];

const Particles = () => {
  const pts = useRef(
    Array.from({ length: 22 }, (_, i) => ({
      id: i,
      sym: SYMBOLS[i % SYMBOLS.length],
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 10 + Math.random() * 5,
      dur: 20 + Math.random() * 20,
      delay: Math.random() * 10,
      op: 0.03 + Math.random() * 0.07,
    }))
  ).current;

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      {pts.map(p => (
        <motion.span key={p.id}
          initial={{ y: 0, opacity: p.op }}
          animate={{ y: [-15, 15, -15], opacity: [p.op, p.op * 1.8, p.op] }}
          transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute", left: `${p.x}%`, top: `${p.y}%`,
            fontFamily: "'JetBrains Mono', monospace", fontSize: p.size,
            color: "whitesmoke", userSelect: "none", whiteSpace: "nowrap",
          }}>
          {p.sym}
        </motion.span>
      ))}
    </div>
  );
};

/* ─── Grid overlay ─── */
const GridOverlay = () => (
  <div style={{
    position: "absolute", inset: 0, pointerEvents: "none",
    backgroundImage: `linear-gradient(${C.b1} 1px, transparent 1px), linear-gradient(90deg, ${C.b1} 1px, transparent 1px)`,
    backgroundSize: "56px 56px",
    maskImage: "linear-gradient(to top, black 0%, black 60%, transparent 100%)",
  }} />
);

/* ─── Link group ─── */
const LinkGroup = ({ title, links }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
    <h4 style={{
      fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 700,
      letterSpacing: "2px", textTransform: "uppercase", color: C.t3, margin: 0,
    }}>{title}</h4>
    {links.map(link => (
      <a key={link.label} href={link.href || "#"}
        style={{
          display: "inline-flex", alignItems: "center", gap: 5,
          fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 500,
          color: C.t2, textDecoration: "none", transition: "all 0.16s", width: "fit-content",
        }}
        onMouseEnter={e => { e.currentTarget.style.color = C.t1; e.currentTarget.style.gap = "8px"; }}
        onMouseLeave={e => { e.currentTarget.style.color = C.t2; e.currentTarget.style.gap = "5px"; }}>
        <ArrowUpRight size={13} style={{ opacity: 0.5, transition: "opacity 0.16s" }}
          onMouseEnter={e => e.currentTarget.style.opacity = "1"}
          onMouseLeave={e => e.currentTarget.style.opacity = "0.5"}
        />
        {link.label}
      </a>
    ))}
  </div>
);

/* ─── Animated scan line ─── */
const ScanLine = () => (
  <motion.div
    initial={{ x: "-100%" }}
    animate={{ x: "200%" }}
    transition={{ duration: 4, repeat: Infinity, ease: "linear", repeatDelay: 6 }}
    style={{
      position: "absolute", top: 0, left: 0, bottom: 0, width: "50%",
      background: `linear-gradient(90deg, transparent, ${C.accent}08, ${C.teal}06, transparent)`,
      pointerEvents: "none", zIndex: 0,
    }} />
);

/* ══════════════════════════════════════════════════════════════
   FOOTER
══════════════════════════════════════════════════════════════ */
export default function Footer() {
  const footerRef = useRef(null);
  const [year] = useState(new Date().getFullYear());

  const cols = [
    {
      title: "Learn",
      links: [
        { label: "All Languages",     href: "/languages" },
        { label: "Web Development",   href: "/tracks/web" },
        { label: "App Development",   href: "/tracks/app" },
        { label: "Data Science",      href: "/tracks/data" },

      ],
    },
    {
      title: "Platform",
      links: [
        // { label: "Features",          href: "/features" },
        { label: "Roadmap",           href: "/roadmap" },
        { label: "CJ Logs",           href: "/logs" },
        { label: "Code Journey IDE",  href: "/editor" },
        { label: "Career",    href: "/careers" },
        { label: "Ecosystem",       href: "/ecosystem" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About",             href: "/about" },
        // { label: "Blog",              href: "/blog" },
        { label: "FAQ",               href: "/faq" },
        // { label: "Privacy Policy",    href: "/privacy-policy" },
        // { label: "Terms & Conditions",href: "/terms" },
      ],
    },
  ];

  const socials = [
    { icon: FaTwitter,   href: "#",  label: "Twitter"  },
    { icon: FaInstagram, href: "https://www.instagram.com/codejourneyhq/?hl=en", label: "Instagram" },
    { icon: FaGithub,    href: "#",  label: "GitHub"   },
    { icon: FaLinkedinIn,href: "#",  label: "LinkedIn" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600&family=Syne:wght@400;500;600;700;800&family=Lora:ital@0;1&display=swap');

        @keyframes cjFooterGlow {
          0%,100% { opacity: 0.6; }
          50%      { opacity: 1;   }
        }
        @keyframes cjSpin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }

        .cj-footer-social:hover svg {
          color: ${C.accent} !important;
        }
        .cj-footer-social:hover {
          border-color: ${C.accent}55 !important;
          background: ${C.accent}14 !important;
          transform: translateY(-2px);
        }
      `}</style>

      {/*
        STICKY BEHIND EFFECT:
        position: sticky + bottom: 0 + low z-index.
        The content above (with higher z-index + matching background) scrolls over this.
      */}
      <footer
        ref={footerRef}
        style={{
          position: "sticky",
          bottom: 0,
          zIndex: 0,
          background: C.bg,
          overflow: "hidden",
          fontFamily: "'Syne', sans-serif",
        }}>

        {/* ── Background layers ── */}
        <GridOverlay />
        <Particles />
        <ScanLine />

        {/* Radial glows */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          <div style={{
            position: "absolute", left: "20%", top: "30%",
            width: 500, height: 500, borderRadius: "50%",
            background: `radial-gradient(ellipse, ${C.accent}12 0%, transparent 65%)`,
            filter: "blur(40px)",
          }} />
          <div style={{
            position: "absolute", right: "15%", bottom: 0,
            width: 400, height: 300, borderRadius: "50%",
            background: `radial-gradient(ellipse, ${C.teal}0a 0%, transparent 70%)`,
            filter: "blur(50px)",
          }} />
        </div>

        {/* ── Top border glow ── */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 1,
          background: `linear-gradient(90deg, transparent 0%, ${C.accent}60 25%, ${C.teal}50 50%, ${C.accent}60 75%, transparent 100%)`,
          animation: "cjFooterGlow 4s ease infinite",
        }} />

        {/* ═══════════════════════════════════════
            MAIN CONTENT
        ═══════════════════════════════════════ */}
        <div style={{ position: "relative", zIndex: 1, padding: "72px 40px 0", maxWidth: 1200, margin: "0 auto" }}>

          {/* ── Giant wordmark ── */}
          <div style={{ marginBottom: 60, overflow: "hidden" }}>
            <motion.h2
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              style={{
                fontFamily: "'Syne', sans-serif",
                fontWeight: 800,
                fontSize: "clamp(52px, 8vw, 110px)",
                lineHeight: 0.9,
                letterSpacing: "-3px",
                margin: 0,
                // Split gradient: top half bright, bottom fades to invisible
                background: `linear-gradient(180deg, ${C.t1} 0%, ${C.t1} 40%, ${C.t2} 70%, transparent 100%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                userSelect: "none",
              }}>
              CODE<br />
              <span style={{
                background: `linear-gradient(180deg, ${C.accent} 0%, ${C.teal} 55%, transparent 100%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>JOURNEY</span>
            </motion.h2>
          </div>

          {/* ── Content row ── */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr 1fr",
            gap: 48,
            flexWrap: "wrap",
          }}>

            {/* Brand column */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.05 }}
              style={{ display: "flex", flexDirection: "column", gap: 24 }}>

              {/* CJ Logo mark */}
              {/* <div style={{
                width: 48, height: 48, borderRadius: 13,
                background: `linear-gradient(135deg, ${C.accent}, ${C.teal})`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 18, fontWeight: 800, color: "#fff",
                boxShadow: `0 0 24px ${C.accent}40`,
              }}>CJ</div>

              <p style={{
                fontFamily: "'Lora', serif", fontStyle: "italic",
                fontSize: 14.5, color: C.t2, lineHeight: 1.78, maxWidth: 220, margin: 0,
              }}>
                A browser-native multi-language learning platform. Web, app and data science — one IDE, zero setup.
              </p> */}

              {/* Newsletter mini */}
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <span style={{
                  fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5,
                  fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase",
                  color: C.t3,
                }}>Stay Updated</span>
                <div style={{ display: "flex", gap: 0 }}>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    style={{
                      flex: 1, background: C.surface,
                      border: `1px solid ${C.b2}`, borderRight: "none",
                      borderRadius: "8px 0 0 8px", padding: "8px 12px",
                      fontFamily: "'Syne', sans-serif", fontSize: 12,
                      color: C.t1, outline: "none",
                    }}
                    onFocus={e => e.target.style.borderColor = C.accent}
                    onBlur={e => e.target.style.borderColor = C.b2}
                  />
                  <button style={{
                    padding: "8px 14px", background: C.accent,
                    border: `1px solid ${C.accent}`, borderRadius: "0 8px 8px 0",
                    color: "#fff", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "opacity 0.15s",
                  }}
                    onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
                    onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
                    <Mail size={14} />
                  </button>
                </div>
              </div>

              {/* Socials */}
              <div style={{ display: "flex", gap: 8 }}>
                {socials.map(s => (
                  <a key={s.label} href={s.href} aria-label={s.label}
                    className="cj-footer-social"
                    style={{
                      width: 34, height: 34, borderRadius: 9,
                      border: `1px solid ${C.b2}`,
                      background: C.surface,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      transition: "all 0.18s", textDecoration: "none",
                    }}>
                    <s.icon size={14} color={C.t2} />
                  </a>
                ))}
              </div>
            </motion.div>

            {/* Link columns */}
            {cols.map((col, i) => (
              <motion.div key={col.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 + i * 0.06 }}>
                <LinkGroup title={col.title} links={col.links} />
              </motion.div>
            ))}
          </div>

          {/* ── Stats strip ── */}
          {/* <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            style={{
              display: "flex", gap: 0, marginTop: 60,
              borderTop: `1px solid ${C.b1}`, borderBottom: `1px solid ${C.b1}`,
              flexWrap: "wrap",
            }}>
            {[
              { icon: Code2,   label: "Languages",     value: "9"    },
              { icon: Zap,     label: "Exercises",      value: "50+"  },
              { icon: Globe,   label: "Career Tracks",  value: "3"    },
              { icon: BookOpen,label: "Learners",       value: "∞"    },
            ].map((stat, i, arr) => (
              <div key={stat.label} style={{
                flex: "1 1 120px",
                display: "flex", alignItems: "center", gap: 10,
                padding: "18px 24px",
                borderRight: i < arr.length - 1 ? `1px solid ${C.b1}` : "none",
              }}>
                <stat.icon size={16} color={C.accent} style={{ flexShrink: 0 }} />
                <div>
                  <p style={{
                    fontFamily: "'Syne', sans-serif", fontWeight: 800,
                    fontSize: 18, color: C.t1, margin: 0, lineHeight: 1,
                  }}>{stat.value}</p>
                  <p style={{
                    fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
                    color: C.t3, margin: "2px 0 0",
                    textTransform: "uppercase", letterSpacing: "0.5px",
                  }}>{stat.label}</p>
                </div>
              </div>
            ))}
          </motion.div> */}

          {/* ── Bottom bar ── */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "22px 0 28px", gap: 16, flexWrap: "wrap",
          }}>
            <p style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: 11.5,
              color: C.t3, margin: 0,
            }}>
              © {year} Code Journey. All rights reserved.
            </p>

            <div style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
              {[
                { label: "Privacy",  href: "/privacy-policy" },
                { label: "Terms",    href: "/terms"          },
                { label: "Licensing",href: "/licensing"      },
              ].map(l => (
                <a key={l.label} href={l.href} style={{
                  fontFamily: "'Syne', sans-serif", fontSize: 12.5, fontWeight: 500,
                  color: C.t3, textDecoration: "none", transition: "color 0.15s",
                }}
                  onMouseEnter={e => e.currentTarget.style.color = C.t1}
                  onMouseLeave={e => e.currentTarget.style.color = C.t3}>
                  {l.label}
                </a>
              ))}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: C.green, animation: "cjFooterGlow 2.5s ease infinite" }} />
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: C.t3 }}>
                All systems operational
              </span>
            </div>
          </div>

        </div>
      </footer>

      {/*
        RESPONSIVE: collapse grid to single column on small screens
      */}
      <style>{`
        @media (max-width: 900px) {
          footer > div > div[style*="grid-template-columns: 1fr 1fr 1fr 1fr"] {
            grid-template-columns: 1fr 1fr !important;
            gap: 36px !important;
          }
        }
        @media (max-width: 560px) {
          footer > div > div[style*="grid-template-columns"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </>
  );
}