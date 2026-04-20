/**
 * CJ Header — Enhanced navigation
 *
 * AUTH COMMENTED OUT for UI development.
 * Search for "// AUTH:" to find all commented auth blocks.
 * When you're ready to re-enable, uncomment those lines.
 */

import { useLayoutEffect, useRef, useState, useEffect } from "react";
import { gsap } from "gsap";
import { GoArrowUpRight } from "react-icons/go";
import { Link, useNavigate } from "react-router-dom";
// AUTH: import { useAuth } from "../context/AuthContext";

/* ─── CJ logo — pure CSS, no image dependency ─── */
const CJLogo = () => (
    <div style={{
        width: "clamp(26px, 6vw, 36px)",
        height: "clamp(26px, 6vw, 36px)",
        fontSize: "clamp(10px, 2.5vw, 14px)",
        borderRadius: 10, flexShrink: 0,
        background: "linear-gradient(135deg, #7c6ee0, #5eead4)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontWeight: 800, color: "#fff",
        fontFamily: "'Syne', sans-serif",
        boxShadow: "0 0 16px rgba(124,110,224,0.45)",
        transition: "box-shadow 0.2s",
    }}>
        CJ
    </div>
);

const NAV_ITEMS = [
    {
        label: "Trackz",
        bgColor: "#0a0714",
        accentColor: "#7c6ee0",
        links: [
            { label: "Web Development", href: "/tracks/web" },
            { label: "App Development", href: "/tracks/app" },
            { label: "Data Science", href: "/tracks/data" },
            // { label: "Database", href: "/database" },
        ],
    },
    {
        label: "Look-Outs",
        bgColor: "#0e0a1c",
        accentColor: "#5eead4",
        links: [
            { label: "Roadmap", href: "/roadmap" },
            { label: "TrackList", href: "/tracks" },
            // { label: "Code Journey Editor", href: "/editor" },
        ],
    },
    {
        label: "Explore",
        bgColor: "#12101f",
        accentColor: "#f97316",
        links: [
            { label: "What Are We ?", href: "/about" },
            // { label: "Hall Of Badges", href: "/badges" },
            // { label: "Logs and Updates", href: "/logs" },
        ],
    },
];

export default function Header() {
    // AUTH: const { user, logout, loading } = useAuth();
    // AUTH: const navigate = useNavigate();

    /* ── Mock for UI dev ── */
    const user = null;
    const loading = false;
    const navigate = useNavigate();

    const [isOpen, setIsOpen] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [hoveredCard, setHoveredCard] = useState(null);

    const navRef = useRef(null);
    const cardsRef = useRef([]);
    const tlRef = useRef(null);

    /* ── Scroll detection for top-bar opacity shift ── */
    useEffect(() => {
        const fn = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", fn, { passive: true });
        return () => window.removeEventListener("scroll", fn);
    }, []);

    /* ── GSAP height calculation ── */
    const getHeight = () => {
        const navEl = navRef.current;
        if (!navEl) return 280;
        const isMobile = window.matchMedia("(max-width: 768px)").matches;
        if (isMobile) {
            const content = navEl.querySelector(".cj-nav-content");
            if (content) {
                const prev = { vis: content.style.visibility, pe: content.style.pointerEvents, pos: content.style.position, h: content.style.height };
                content.style.visibility = "visible";
                content.style.pointerEvents = "auto";
                content.style.position = "static";
                content.style.height = "auto";
                content.offsetHeight;
                const h = 60 + content.scrollHeight + 16;
                Object.assign(content.style, { visibility: prev.vis, pointerEvents: prev.pe, position: prev.pos, height: prev.h });
                return h;
            }
        }
        return 280;
    };

    const buildTL = () => {
        const navEl = navRef.current;
        if (!navEl) return null;
        gsap.set(navEl, { height: 60, overflow: "hidden" });
        gsap.set(cardsRef.current, { y: 40, opacity: 0 });
        const tl = gsap.timeline({ paused: true });
        tl.to(navEl, { height: getHeight, duration: 0.42, ease: "power3.out" });
        tl.to(cardsRef.current, { y: 0, opacity: 1, duration: 0.38, ease: "power3.out", stagger: 0.07 }, "-=0.15");
        return tl;
    };

    useLayoutEffect(() => {
        const tl = buildTL();
        tlRef.current = tl;
        return () => { tl?.kill(); tlRef.current = null; };
    }, []);

    useLayoutEffect(() => {
        const onResize = () => {
            if (!tlRef.current) return;
            if (isExpanded) {
                gsap.set(navRef.current, { height: getHeight() });
                tlRef.current.kill();
                const tl = buildTL();
                if (tl) { tl.progress(1); tlRef.current = tl; }
            } else {
                tlRef.current.kill();
                tlRef.current = buildTL();
            }
        };
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, [isExpanded]);

    const toggleMenu = () => {
        const tl = tlRef.current;
        if (!tl) return;
        if (!isExpanded) {
            setIsOpen(true); setIsExpanded(true); tl.play(0);
        } else {
            setIsOpen(false);
            tl.eventCallback("onReverseComplete", () => setIsExpanded(false));
            tl.reverse();
        }
    };

    const setCardRef = (i) => (el) => { if (el) cardsRef.current[i] = el; };

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=Syne:wght@400;500;600;700;800&display=swap');

        .cj-header-wrap {
          position: fixed;
          left: 50%;
          transform: translateX(-50%);
          width: 92%;
          max-width: 920px;
          z-index: 999;
          top: 1.2em;
        }

        @media (min-width: 768px) {
          .cj-header-wrap { top: 1.8em; }
        }

        /* Gradient border via pseudo-element */
        .cj-nav {
          position: relative;
          border-radius: 14px;
          will-change: height;
        }

        /* The glowing gradient border frame */
        .cj-nav::before {
          content: '';
          position: absolute;
          inset: -1px;
          border-radius: 15px;
          padding: 1px;
          background: linear-gradient(135deg, rgba(124,110,224,0.5) 0%, rgba(94,234,212,0.3) 50%, rgba(124,110,224,0.2) 100%);
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
          transition: opacity 0.3s;
          opacity: 0.6;
          z-index: 3;
        }

        .cj-nav:hover::before,
        .cj-nav.open::before {
          opacity: 1;
        }

        .cj-hamburger-line {
          width: 22px;
          height: 2.8px;
          background: #443cae;
          border-radius: 2px;
          transition: all 0.28s cubic-bezier(0.4,0,0.2,1);
          transform-origin: center;
        }

        .cj-hamburger-line.top.open    { transform: translateY(4px) rotate(45deg);  }
        .cj-hamburger-line.bottom.open { transform: translateY(-4px) rotate(-45deg); }

        .cj-nav-card {
          border-radius: 10px;
          transition: box-shadow 0.2s, transform 0.2s;
        }

        .cj-nav-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-family: 'Syne', sans-serif;
          font-size: 14px;
          font-weight: 500;
          color: rgba(255,255,255,0.55);
          text-decoration: none;
          transition: color 0.18s, gap 0.18s;
          padding: 2px 0;
        }

        .cj-nav-link:hover {
          color: rgba(255,255,255,0.95);
          gap: 9px;
        }

        .cj-nav-link svg {
          opacity: 0.4;
          transition: opacity 0.18s;
        }

        .cj-nav-link:hover svg {
          opacity: 0.9;
        }

        .cj-cta {
        font-family: 'Syne', sans-serif;
        font-weight: 700;
        font-size: clamp(11px, 2.5vw, 13px);
        border: none;
        border-radius: clamp(7px, 1.5vw, 9px);
        padding: clamp(6px, 1.5vw, 8px) clamp(12px, 3vw, 18px);
        cursor: pointer;
        transition: all 0.18s;
        letter-spacing: 0.2px;
        }

        .cj-cta:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 20px rgba(124,110,224,0.45);
        }

        @keyframes cjHeaderShimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }

        .cj-logo-text {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: 18px;
          letter-spacing: 0.5px;
          background: linear-gradient(90deg, #fe9494 0%, #c4bbff 30%, #5eead4 55%, #fe9494 80%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: cjHeaderShimmer 4s linear infinite;
        }
          @media (max-width: 768px) {
  .cj-logo-text {
    font-size: 14px;
  }
      `}</style>

            <div className="cj-header-wrap">
                <nav
                    ref={navRef}
                    className={`cj-nav ${isOpen ? "open" : ""}`}
                    style={{
                        height: 60,
                        overflow: "hidden",
                        background: scrolled
                            ? "rgba(255, 255, 255, 0.25)"
                            : "rgba(255, 255, 255, 0.2)",
                        backdropFilter: "blur(10px)",
                        WebkitBackdropFilter: "blur(10px)",
                        boxShadow: scrolled
                            ? "0 8px 40px rgba(0,0,0,0.5), 0 0 0 0.5px rgba(120,130,180,0.15)"
                            : "0 4px 24px rgba(0,0,0,0.3)",
                        transition: "background 0.3s, box-shadow 0.3s",
                    }}>

                    {/* ── Top bar ── */}
                    <div
                        style={{
                            position: "absolute",
                            inset: "0 0 auto 0",
                            height: 60,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "0 14px",
                            zIndex: 2,
                        }}
                    >

                        {/* LEFT — Hamburger */}
                        <div
                            role="button"
                            tabIndex={0}
                            aria-label={isOpen ? "Close menu" : "Open menu"}
                            onClick={toggleMenu}
                            onKeyDown={(e) => e.key === "Enter" && toggleMenu()}
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 5.5,
                                cursor: "pointer",
                                padding: "6px",
                                borderRadius: 7,
                            }}
                        >
                            <div className={`cj-hamburger-line top ${isOpen ? "open" : ""}`} />
                            <div className={`cj-hamburger-line bottom ${isOpen ? "open" : ""}`} />
                        </div>

                        {/* CENTER — Logo (TRUE CENTER) */}
                        <div
                            style={{
                                position: "absolute",
                                left: "50%",
                                top: "50%",
                                transform: "translate(-50%, -50%)",
                            }}
                        >
                            <Link
                                to="/"
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "clamp(6px, 2vw, 10px)",
                                    textDecoration: "none",
                                }}
                            >
                                <CJLogo />
                                <span className="cj-logo-text">CODE JOURNEY</span>
                            </Link>
                        </div>

                        {/* RIGHT — CTA */}
                        <div>
                            <button
                                className="cj-cta"
                                onClick={() => navigate("/auth")}
                                style={{
                                    background: "linear-gradient(135deg, #7c6ee0, #5a52c4)",
                                    color: "#fff",
                                }}
                            >
                                Get Started
                            </button>
                        </div>
                    </div>

                    {/* ── Dropdown cards ── */}
                    <div
                        className="cj-nav-content"
                        aria-hidden={!isExpanded}
                        style={{
                            position: "absolute", left: 0, right: 0, top: 60, bottom: 0,
                            padding: "10px 10px 10px",
                            display: "flex", flexDirection: "column", gap: 8,
                            zIndex: 1,
                            visibility: isExpanded ? "visible" : "hidden",
                            pointerEvents: isExpanded ? "auto" : "none",
                        }}
                    // md: row layout
                    >
                        <style>{`
              @media (min-width: 768px) {
                .cj-nav-content {
                  flex-direction: row !important;
                  align-items: stretch !important;
                }
              }
            `}</style>

                        {NAV_ITEMS.map((item, i) => (
                            <div
                                key={item.label}
                                ref={setCardRef(i)}
                                className="cj-nav-card"
                                onMouseEnter={() => setHoveredCard(i)}
                                onMouseLeave={() => setHoveredCard(null)}
                                style={{
                                    flex: "1 1 0%",
                                    minHeight: 60,
                                    padding: "14px 16px",
                                    background: hoveredCard === i
                                        ? "rgba(15, 12, 12, 0.7)"
                                        : "rgba(25, 22, 22, 0.8)",
                                    backdropFilter: "blur(12px)",
                                    WebkitBackdropFilter: "blur(12px)",
                                    boxShadow: hoveredCard === i
                                        ? `0 0 0 1px ${item.accentColor}44, inset 0 0 30px ${item.accentColor}08`
                                        : `0 0 0 1px rgba(255,255,255,0.04)`,
                                    transform: hoveredCard === i ? "translateY(-1px)" : "translateY(0)",
                                    display: "flex", flexDirection: "column", gap: 10,
                                }}>

                                {/* Card label with accent underline */}
                                <div style={{ position: "relative", display: "inline-block" }}>
                                    <span style={{
                                        fontFamily: "'Syne', sans-serif",
                                        fontSize: "clamp(16px, 2vw, 21px)",
                                        fontWeight: 700,
                                        color: "rgba(255,255,255,0.9)",
                                        letterSpacing: "-0.3px",
                                    }}>
                                        {item.label}
                                    </span>
                                    <div style={{
                                        position: "absolute", bottom: -3, left: 0,
                                        height: 2, borderRadius: 1,
                                        background: item.accentColor,
                                        width: hoveredCard === i ? "100%" : "0%",
                                        transition: "width 0.25s ease",
                                        opacity: 0.7,
                                    }} />
                                </div>

                                {/* Links */}
                                <div style={{
                                    marginTop: "auto", display: "flex",
                                    flexDirection: "column", gap: 2,
                                }}>
                                    {item.links.map(lnk => (
                                        <a key={lnk.label} href={lnk.href || "#"}
                                            className="cj-nav-link">
                                            <GoArrowUpRight
                                                size={13}
                                                color={item.accentColor}
                                                style={{ flexShrink: 0 }}
                                            />
                                            {lnk.label}
                                        </a>
                                    ))}
                                </div>

                                {/* Corner accent dot */}
                                <div style={{
                                    position: "absolute", top: 12, right: 12,
                                    width: 5, height: 5, borderRadius: "50%",
                                    background: item.accentColor,
                                    opacity: hoveredCard === i ? 0.9 : 0.25,
                                    transition: "opacity 0.18s",
                                }} />
                            </div>
                        ))}
                    </div>
                </nav>
            </div>
        </>
    );
}