// import { useLayoutEffect, useRef, useState, useEffect } from "react";
// import { gsap } from "gsap";
// import { GoArrowUpRight } from "react-icons/go";
// import { Link, useNavigate } from "react-router-dom";
// // AUTH: import { useAuth } from "../context/AuthContext";

// /* ─── CJ logo — pure CSS, no image dependency ─── */
// const CJLogo = () => (
//     <div style={{
//         width: "clamp(26px, 6vw, 36px)",
//         height: "clamp(26px, 6vw, 36px)",
//         fontSize: "clamp(10px, 2.5vw, 14px)",
//         borderRadius: 10, flexShrink: 0,
//         background: "linear-gradient(135deg, #7c6ee0, #5eead4)",
//         display: "flex", alignItems: "center", justifyContent: "center",
//         fontWeight: 800, color: "#fff",
//         fontFamily: "'Syne', sans-serif",
//         boxShadow: "0 0 16px rgba(124,110,224,0.45)",
//         transition: "box-shadow 0.2s",
//     }}>
//         CJ
//     </div>
// );

// const NAV_ITEMS = [
//     {
//         label: "Trackz",
//         bgColor: "#0a0714",
//         accentColor: "#7c6ee0",
//         links: [
//             { label: "Web Development", href: "/tracks/web" },
//             { label: "App Development", href: "/tracks/app" },
//             { label: "Data Science", href: "/tracks/data" },
//             // { label: "Database", href: "/database" },
//         ],
//     },
//     {
//         label: "Look-Outs",
//         bgColor: "#0e0a1c",
//         accentColor: "#5eead4",
//         links: [
//             { label: "Roadmap", href: "/roadmap" },
//             { label: "TrackList", href: "/tracks" },
//             // { label: "Code Journey Editor", href: "/editor" },
//         ],
//     },
//     {
//         label: "Explore",
//         bgColor: "#12101f",
//         accentColor: "#f97316",
//         links: [
//             { label: "What Are We ?", href: "/about" },
//             // { label: "Hall Of Badges", href: "/badges" },
//             // { label: "Logs and Updates", href: "/logs" },
//         ],
//     },
// ];

// export default function Header() {
//     // AUTH: const { user, logout, loading } = useAuth();
//     // AUTH: const navigate = useNavigate();

//     /* ── Mock for UI dev ── */
//     const user = null;
//     const loading = false;
//     const navigate = useNavigate();

//     const [isOpen, setIsOpen] = useState(false);
//     const [isExpanded, setIsExpanded] = useState(false);
//     const [scrolled, setScrolled] = useState(false);
//     const [hoveredCard, setHoveredCard] = useState(null);

//     const navRef = useRef(null);
//     const cardsRef = useRef([]);
//     const tlRef = useRef(null);

//     /* ── Scroll detection for top-bar opacity shift ── */
//     useEffect(() => {
//         const fn = () => setScrolled(window.scrollY > 20);
//         window.addEventListener("scroll", fn, { passive: true });
//         return () => window.removeEventListener("scroll", fn);
//     }, []);

//     /* ── GSAP height calculation ── */
//     const getHeight = () => {
//         const navEl = navRef.current;
//         if (!navEl) return 280;
//         const isMobile = window.matchMedia("(max-width: 768px)").matches;
//         if (isMobile) {
//             const content = navEl.querySelector(".cj-nav-content");
//             if (content) {
//                 const prev = { vis: content.style.visibility, pe: content.style.pointerEvents, pos: content.style.position, h: content.style.height };
//                 content.style.visibility = "visible";
//                 content.style.pointerEvents = "auto";
//                 content.style.position = "static";
//                 content.style.height = "auto";
//                 content.offsetHeight;
//                 const h = 60 + content.scrollHeight + 16;
//                 Object.assign(content.style, { visibility: prev.vis, pointerEvents: prev.pe, position: prev.pos, height: prev.h });
//                 return h;
//             }
//         }
//         return 280;
//     };

//     const buildTL = () => {
//         const navEl = navRef.current;
//         if (!navEl) return null;
//         gsap.set(navEl, { height: 60, overflow: "hidden" });
//         gsap.set(cardsRef.current, { y: 40, opacity: 0 });
//         const tl = gsap.timeline({ paused: true });
//         tl.to(navEl, { height: getHeight, duration: 0.42, ease: "power3.out" });
//         tl.to(cardsRef.current, { y: 0, opacity: 1, duration: 0.38, ease: "power3.out", stagger: 0.07 }, "-=0.15");
//         return tl;
//     };

//     useLayoutEffect(() => {
//         const tl = buildTL();
//         tlRef.current = tl;
//         return () => { tl?.kill(); tlRef.current = null; };
//     }, []);

//     useLayoutEffect(() => {
//         const onResize = () => {
//             if (!tlRef.current) return;
//             if (isExpanded) {
//                 gsap.set(navRef.current, { height: getHeight() });
//                 tlRef.current.kill();
//                 const tl = buildTL();
//                 if (tl) { tl.progress(1); tlRef.current = tl; }
//             } else {
//                 tlRef.current.kill();
//                 tlRef.current = buildTL();
//             }
//         };
//         window.addEventListener("resize", onResize);
//         return () => window.removeEventListener("resize", onResize);
//     }, [isExpanded]);

//     const toggleMenu = () => {
//         const tl = tlRef.current;
//         if (!tl) return;
//         if (!isExpanded) {
//             setIsOpen(true); setIsExpanded(true); tl.play(0);
//         } else {
//             setIsOpen(false);
//             tl.eventCallback("onReverseComplete", () => setIsExpanded(false));
//             tl.reverse();
//         }
//     };

//     const setCardRef = (i) => (el) => { if (el) cardsRef.current[i] = el; };

//     return (
//         <>
//             <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=Syne:wght@400;500;600;700;800&display=swap');

//         .cj-header-wrap {
//           position: fixed;
//           left: 50%;
//           transform: translateX(-50%);
//           width: 92%;
//           max-width: 920px;
//           z-index: 999;
//           top: 1.2em;
//         }

//         @media (min-width: 768px) {
//           .cj-header-wrap { top: 1.8em; }
//         }

//         /* Gradient border via pseudo-element */
//         .cj-nav {
//           position: relative;
//           border-radius: 14px;
//           will-change: height;
//         }

//         /* The glowing gradient border frame */
//         .cj-nav::before {
//           content: '';
//           position: absolute;
//           inset: -1px;
//           border-radius: 15px;
//           padding: 1px;
//           background: linear-gradient(135deg, rgba(124,110,224,0.5) 0%, rgba(94,234,212,0.3) 50%, rgba(124,110,224,0.2) 100%);
//           -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
//           -webkit-mask-composite: xor;
//           mask-composite: exclude;
//           pointer-events: none;
//           transition: opacity 0.3s;
//           opacity: 0.6;
//           z-index: 3;
//         }

//         .cj-nav:hover::before,
//         .cj-nav.open::before {
//           opacity: 1;
//         }

//         .cj-hamburger-line {
//           width: 22px;
//           height: 2.8px;
//           background: #443cae;
//           border-radius: 2px;
//           transition: all 0.28s cubic-bezier(0.4,0,0.2,1);
//           transform-origin: center;
//         }

//         .cj-hamburger-line.top.open    { transform: translateY(4px) rotate(45deg);  }
//         .cj-hamburger-line.bottom.open { transform: translateY(-4px) rotate(-45deg); }

//         .cj-nav-card {
//           border-radius: 10px;
//           transition: box-shadow 0.2s, transform 0.2s;
//         }

//         .cj-nav-link {
//           display: inline-flex;
//           align-items: center;
//           gap: 6px;
//           font-family: 'Syne', sans-serif;
//           font-size: 14px;
//           font-weight: 500;
//           color: rgba(255,255,255,0.55);
//           text-decoration: none;
//           transition: color 0.18s, gap 0.18s;
//           padding: 2px 0;
//         }

//         .cj-nav-link:hover {
//           color: rgba(255,255,255,0.95);
//           gap: 9px;
//         }

//         .cj-nav-link svg {
//           opacity: 0.4;
//           transition: opacity 0.18s;
//         }

//         .cj-nav-link:hover svg {
//           opacity: 0.9;
//         }

//         .cj-cta {
//         font-family: 'Syne', sans-serif;
//         font-weight: 700;
//         font-size: clamp(11px, 2.5vw, 13px);
//         border: none;
//         border-radius: clamp(7px, 1.5vw, 9px);
//         padding: clamp(6px, 1.5vw, 8px) clamp(12px, 3vw, 18px);
//         cursor: pointer;
//         transition: all 0.18s;
//         letter-spacing: 0.2px;
//         }

//         .cj-cta:hover {
//           transform: translateY(-1px);
//           box-shadow: 0 4px 20px rgba(124,110,224,0.45);
//         }

//         @keyframes cjHeaderShimmer {
//           0%   { background-position: -200% center; }
//           100% { background-position:  200% center; }
//         }

//         .cj-logo-text {
//           font-family: 'Syne', sans-serif;
//           font-weight: 800;
//           font-size: 18px;
//           letter-spacing: 0.5px;
//           background: linear-gradient(90deg, #c4bbff 0%, #fe9494 30%, #5eead4 55%, #c4bbff 80%);
//           background-size: 200% auto;
//           -webkit-background-clip: text;
//           -webkit-text-fill-color: transparent;
//           background-clip: text;
//           animation: cjHeaderShimmer 4s linear infinite;
//         }
//           @media (max-width: 768px) {
//   .cj-logo-text {
//     font-size: 14px;
//   }
//       `}</style>

//             <div className="cj-header-wrap">
//                 <nav
//                     ref={navRef}
//                     className={`cj-nav ${isOpen ? "open" : ""}`}
//                     style={{
//                         height: 60,
//                         overflow: "hidden",
//                         background: scrolled
//                             ? "rgba(255, 255, 255, 0.25)"
//                             : "rgba(255, 255, 255, 0.2)",
//                         backdropFilter: "blur(10px)",
//                         WebkitBackdropFilter: "blur(10px)",
//                         boxShadow: scrolled
//                             ? "0 8px 40px rgba(0,0,0,0.5), 0 0 0 0.5px rgba(120,130,180,0.15)"
//                             : "0 4px 24px rgba(0,0,0,0.3)",
//                         transition: "background 0.3s, box-shadow 0.3s",
//                     }}>

//                     {/* ── Top bar ── */}
//                     <div
//                         style={{
//                             position: "absolute",
//                             inset: "0 0 auto 0",
//                             height: 60,
//                             display: "flex",
//                             alignItems: "center",
//                             justifyContent: "space-between",
//                             padding: "0 14px",
//                             zIndex: 2,
//                         }}
//                     >

//                         {/* LEFT — Hamburger */}
//                         <div
//                             role="button"
//                             tabIndex={0}
//                             aria-label={isOpen ? "Close menu" : "Open menu"}
//                             onClick={toggleMenu}
//                             onKeyDown={(e) => e.key === "Enter" && toggleMenu()}
//                             style={{
//                                 display: "flex",
//                                 flexDirection: "column",
//                                 gap: 5.5,
//                                 cursor: "pointer",
//                                 padding: "6px",
//                                 borderRadius: 7,
//                             }}
//                         >
//                             <div className={`cj-hamburger-line top ${isOpen ? "open" : ""}`} />
//                             <div className={`cj-hamburger-line bottom ${isOpen ? "open" : ""}`} />
//                         </div>

//                         {/* CENTER — Logo (TRUE CENTER) */}
//                         <div
//                             style={{
//                                 position: "absolute",
//                                 left: "50%",
//                                 top: "50%",
//                                 transform: "translate(-50%, -50%)",
//                             }}
//                         >
//                             <Link
//                                 to="/"
//                                 style={{
//                                     display: "flex",
//                                     alignItems: "center",
//                                     gap: "clamp(6px, 2vw, 10px)",
//                                     textDecoration: "none",
//                                 }}
//                             >
//                                 <CJLogo />
//                                 <span className="cj-logo-text">CODE JOURNEY</span>
//                             </Link>
//                         </div>

//                         {/* RIGHT — CTA */}
//                         <div>
//                             <button
//                                 className="cj-cta"
//                                 onClick={() => navigate("/auth")}
//                                 style={{
//                                     background: "linear-gradient(135deg, #7c6ee0, #5a52c4)",
//                                     color: "#fff",
//                                 }}
//                             >
//                                 Get Started
//                             </button>
//                         </div>
//                     </div>

//                     {/* ── Dropdown cards ── */}
//                     <div
//                         className="cj-nav-content"
//                         aria-hidden={!isExpanded}
//                         style={{
//                             position: "absolute", left: 0, right: 0, top: 60, bottom: 0,
//                             padding: "10px 10px 10px",
//                             display: "flex", flexDirection: "column", gap: 8,
//                             zIndex: 1,
//                             visibility: isExpanded ? "visible" : "hidden",
//                             pointerEvents: isExpanded ? "auto" : "none",
//                         }}
//                     // md: row layout
//                     >
//                         <style>{`
//               @media (min-width: 768px) {
//                 .cj-nav-content {
//                   flex-direction: row !important;
//                   align-items: stretch !important;
//                 }
//               }
//             `}</style>

//                         {NAV_ITEMS.map((item, i) => (
//                             <div
//                                 key={item.label}
//                                 ref={setCardRef(i)}
//                                 className="cj-nav-card"
//                                 onMouseEnter={() => setHoveredCard(i)}
//                                 onMouseLeave={() => setHoveredCard(null)}
//                                 style={{
//                                     flex: "1 1 0%",
//                                     minHeight: 60,
//                                     padding: "14px 16px",
//                                     background: hoveredCard === i
//                                         ? "rgba(15, 12, 12, 0.7)"
//                                         : "rgba(25, 22, 22, 0.8)",
//                                     backdropFilter: "blur(12px)",
//                                     WebkitBackdropFilter: "blur(12px)",
//                                     boxShadow: hoveredCard === i
//                                         ? `0 0 0 1px ${item.accentColor}44, inset 0 0 30px ${item.accentColor}08`
//                                         : `0 0 0 1px rgba(255,255,255,0.04)`,
//                                     transform: hoveredCard === i ? "translateY(-1px)" : "translateY(0)",
//                                     display: "flex", flexDirection: "column", gap: 10,
//                                 }}>

//                                 {/* Card label with accent underline */}
//                                 <div style={{ position: "relative", display: "inline-block" }}>
//                                     <span style={{
//                                         fontFamily: "'Syne', sans-serif",
//                                         fontSize: "clamp(16px, 2vw, 21px)",
//                                         fontWeight: 700,
//                                         color: "rgba(255,255,255,0.9)",
//                                         letterSpacing: "-0.3px",
//                                     }}>
//                                         {item.label}
//                                     </span>
//                                     <div style={{
//                                         position: "absolute", bottom: -3, left: 0,
//                                         height: 2, borderRadius: 1,
//                                         background: item.accentColor,
//                                         width: hoveredCard === i ? "100%" : "0%",
//                                         transition: "width 0.25s ease",
//                                         opacity: 0.7,
//                                     }} />
//                                 </div>

//                                 {/* Links */}
//                                 <div style={{
//                                     marginTop: "auto", display: "flex",
//                                     flexDirection: "column", gap: 2,
//                                 }}>
//                                     {item.links.map(lnk => (
//                                         <a key={lnk.label} href={lnk.href || "#"}
//                                             className="cj-nav-link">
//                                             <GoArrowUpRight
//                                                 size={13}
//                                                 color={item.accentColor}
//                                                 style={{ flexShrink: 0 }}
//                                             />
//                                             {lnk.label}
//                                         </a>
//                                     ))}
//                                 </div>

//                                 {/* Corner accent dot */}
//                                 <div style={{
//                                     position: "absolute", top: 12, right: 12,
//                                     width: 5, height: 5, borderRadius: "50%",
//                                     background: item.accentColor,
//                                     opacity: hoveredCard === i ? 0.9 : 0.25,
//                                     transition: "opacity 0.18s",
//                                 }} />
//                             </div>
//                         ))}
//                     </div>
//                 </nav>
//             </div>
//         </>
//     );
// }


import React,{useState,useEffect,useRef,useCallback}from"react";
import{motion,AnimatePresence}from"framer-motion";
import{Link,useLocation,useNavigate}from"react-router-dom";
import{Search,X,Menu,ArrowUpRight,Code2,Globe,Map,BookOpen,Smartphone,BarChart2,Hash,ChevronDown,Zap}from"lucide-react";

/* ══ LOGO — exported so every page can import it ════════════════════ */
export function CJLogo({size=36}){
  return(
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Code Journey">
      <defs>
        <linearGradient id="cjg1" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#7c6ee0"/>
          <stop offset="55%" stopColor="#5eead4"/>
          <stop offset="100%" stopColor="#7c6ee0"/>
        </linearGradient>
        <linearGradient id="cjg2" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#7c6ee0" stopOpacity="0.25"/>
          <stop offset="100%" stopColor="#5eead4" stopOpacity="0.1"/>
        </linearGradient>
        <filter id="cjglow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur"/>
          <feComposite in="SourceGraphic" in2="blur" operator="over"/>
        </filter>
      </defs>
      {/* Outer rounded square */}
      <rect x="1" y="1" width="34" height="34" rx="10" fill="url(#cjg2)" stroke="url(#cjg1)" strokeWidth="1.2" opacity="0.8"/>
      {/* C shape */}
      <path d="M22 12.5 C18 10.5 11 11.5 11 18 C11 24.5 18 25.5 22 23.5" stroke="url(#cjg1)" strokeWidth="2.2" strokeLinecap="round" fill="none" filter="url(#cjglow)"/>
      {/* J shape */}
      <path d="M25 12 L25 21 C25 24.5 22.5 26.5 19.5 25.5" stroke="url(#cjg1)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" filter="url(#cjglow)"/>
      {/* Top dot on J */}
      <circle cx="25" cy="12" r="1.4" fill="#5eead4" opacity="0.9"/>
      {/* Accent corner spark */}
      <circle cx="5" cy="5" r="1.2" fill="#7c6ee0" opacity="0.5"/>
      <circle cx="31" cy="31" r="1.2" fill="#5eead4" opacity="0.5"/>
    </svg>
  );
}

/* ══ NAV STRUCTURE ══════════════════════════════════════════════════ */
const NAV=[
  {label:"Learn",      icon:Code2,    color:"#7c6ee0",children:[
    {label:"Web Dev",         href:"/tracks/web",     desc:"HTML → React → Node.js",      color:"#f97316"},
    {label:"App Dev",         href:"/tracks/app",     desc:"Flutter, Swift, Kotlin, RN",  color:"#5eead4"},
    {label:"Data Science",    href:"/tracks/data",    desc:"Python, SQL, ML, R",           color:"#f472b6"},
    {label:"Languages",       href:"/languages",      desc:"All 9 languages explained",    color:"#7c6ee0"},
    {label:"Practice",        href:"/practice",       desc:"Coding challenges + XP",       color:"#22c55e"},
  ]},
  {label:"Explore",    icon:Globe,    color:"#5eead4",children:[
    {label:"Roadmap",         href:"/roadmap",        desc:"Stage-by-stage learning path", color:"#5eead4"},
    {label:"Snippet Library", href:"/snippets",       desc:"Copy-paste code patterns",     color:"#a78bfa"},
    {label:"Glossary",        href:"/glossary",       desc:"Every term, plain English",    color:"#60a5fa"},
    {label:"Leaderboard",     href:"/leaderboard",    desc:"Top learners by XP",           color:"#fbbf24"},
    {label:"Blog",            href:"/blog",           desc:"Guides & deep dives",          color:"#f97316"},
  ]},
  {label:"Platform",   icon:Zap,      color:"#f97316",children:[
    {label:"Editor / IDE",    href:"/editor",         desc:"In-browser multi-language IDE", color:"#f7df1e"},
    {label:"Careers",         href:"/careers",        desc:"Companies hiring from CJ",     color:"#22c55e"},
    {label:"Ecosystem",       href:"/ecosystem",      desc:"Tools & frameworks map",       color:"#60a5fa"},
    {label:"Changelog",       href:"/logs",           desc:"Platform updates & releases",  color:"#a78bfa"},
    {label:"About",           href:"/about",          desc:"Our mission",                  color:"#5eead4"},
  ]},
];

/* ══ MEGA-DROP ══════════════════════════════════════════════════════ */
function MegaDrop({item,onClose,T}){
  return(
    <motion.div initial={{opacity:0,y:6,scale:0.98}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:4,scale:0.98}}
      transition={{duration:0.18,ease:[0.22,1,0.36,1]}}
      style={{position:"absolute",top:"calc(100% + 10px)",left:"50%",transform:"translateX(-50%)",
        background:"rgba(8,6,20,0.96)",backdropFilter:"blur(24px)",WebkitBackdropFilter:"blur(24px)",
        border:"1px solid rgba(124,110,224,0.18)",borderRadius:14,padding:"10px",minWidth:340,
        boxShadow:"0 20px 60px rgba(0,0,0,0.6),0 0 0 0.5px rgba(124,110,224,0.15)"}}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:4}}>
        {item.children.map(c=>(
          <Link key={c.label} to={c.href} onClick={onClose}
            style={{display:"flex",alignItems:"flex-start",gap:10,padding:"10px 12px",borderRadius:9,textDecoration:"none",transition:"background 0.14s"}}
            onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,0.05)"}
            onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
            <div style={{width:6,height:6,borderRadius:"50%",background:c.color,flexShrink:0,marginTop:7}}/>
            <div>
              <p style={{fontFamily:"'Syne',sans-serif",fontWeight:600,fontSize:13.5,color:"rgba(255,255,255,0.9)",margin:"0 0 2px"}}>{c.label}</p>
              <p style={{fontFamily:"'Lora',serif",fontSize:12,color:"rgba(255,255,255,0.38)",margin:0,fontStyle:"italic"}}>{c.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </motion.div>
  );
}

/* ══ INLINE SEARCH ══════════════════════════════════════════════════ */
const QUICK=[
  {label:"HTML",href:"/tracks/web#html"},{label:"JavaScript",href:"/tracks/web#javascript"},
  {label:"Flutter",href:"/tracks/app#flutter"},{label:"Python",href:"/tracks/data#python"},
  {label:"SQL",href:"/tracks/data#sql"},{label:"React",href:"/tracks/web#react"},
  {label:"Practice",href:"/practice"},{label:"Roadmap",href:"/roadmap"},
  {label:"Glossary",href:"/glossary"},{label:"Blog",href:"/blog"},
  {label:"Snippets",href:"/snippets"},{label:"Leaderboard",href:"/leaderboard"},
  {label:"Careers",href:"/careers"},{label:"Changelog",href:"/logs"},
  {label:"Editor",href:"/editor"},{label:"About",href:"/about"},
];

function HeaderSearch({onClose}){
  const[q,setQ]=useState("");
  const inp=useRef(null);
  useEffect(()=>{inp.current?.focus();},[]);
  const results=q.trim()?QUICK.filter(i=>i.label.toLowerCase().includes(q.toLowerCase())).slice(0,8):[];
  const navigate=useNavigate();
  const go=href=>{navigate(href);onClose();};
  return(
    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
      style={{position:"fixed",inset:0,zIndex:2000,display:"flex",alignItems:"flex-start",justifyContent:"center",paddingTop:80,background:"rgba(0,0,0,0.7)",backdropFilter:"blur(10px)"}}>
      <div onClick={onClose} style={{position:"absolute",inset:0}}/>
      <motion.div initial={{scale:0.96,y:-10}} animate={{scale:1,y:0}} exit={{scale:0.96,y:-10}}
        style={{position:"relative",width:"min(560px,92vw)",background:"rgba(10,8,24,0.98)",border:"1px solid rgba(124,110,224,0.3)",borderRadius:16,overflow:"hidden",boxShadow:"0 24px 80px rgba(0,0,0,0.7)"}}>
        <div style={{display:"flex",alignItems:"center",gap:10,padding:"14px 16px",borderBottom:"1px solid rgba(124,110,224,0.12)"}}>
          <Search size={16} color="#7c6ee0"/>
          <input ref={inp} value={q} onChange={e=>setQ(e.target.value)} placeholder="Search languages, tools, pages…"
            onKeyDown={e=>{if(e.key==="Escape")onClose();if(e.key==="Enter"&&results.length>0)go(results[0].href);}}
            style={{flex:1,background:"transparent",border:"none",outline:"none",fontFamily:"'Syne',sans-serif",fontSize:15,color:"rgba(255,255,255,0.9)"}}/>
          <button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",color:"rgba(255,255,255,0.4)",display:"flex"}}><X size={15}/></button>
        </div>
        {q.trim()===''&&(
          <div style={{padding:"12px 16px"}}>
            <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:"rgba(255,255,255,0.3)",letterSpacing:"1px",textTransform:"uppercase",marginBottom:8}}>Quick links</p>
            <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
              {QUICK.slice(0,8).map(i=>(
                <button key={i.label} onClick={()=>go(i.href)}
                  style={{padding:"4px 11px",borderRadius:7,border:"1px solid rgba(124,110,224,0.2)",background:"rgba(124,110,224,0.08)",color:"rgba(255,255,255,0.65)",fontFamily:"'Syne',sans-serif",fontSize:12.5,cursor:"pointer",transition:"all 0.13s"}}
                  onMouseEnter={e=>{e.currentTarget.style.background="rgba(124,110,224,0.2)";e.currentTarget.style.color="#fff";}}
                  onMouseLeave={e=>{e.currentTarget.style.background="rgba(124,110,224,0.08)";e.currentTarget.style.color="rgba(255,255,255,0.65)";}}>
                  {i.label}
                </button>
              ))}
            </div>
          </div>
        )}
        {results.length>0&&(
          <div style={{padding:"8px"}}>
            {results.map((r,i)=>(
              <button key={r.label} onClick={()=>go(r.href)}
                style={{display:"flex",alignItems:"center",gap:10,width:"100%",padding:"10px 12px",borderRadius:9,border:"none",background:"transparent",cursor:"pointer",transition:"background 0.13s",textAlign:"left"}}
                onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,0.06)"}
                onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                <Search size={13} color="rgba(124,110,224,0.6)"/>
                <span style={{fontFamily:"'Syne',sans-serif",fontSize:14,color:"rgba(255,255,255,0.85)",fontWeight:600}}>{r.label}</span>
                <ArrowUpRight size={12} color="rgba(255,255,255,0.25)" style={{marginLeft:"auto"}}/>
              </button>
            ))}
          </div>
        )}
        {q.trim()!==''&&results.length===0&&(
          <div style={{padding:"28px",textAlign:"center",color:"rgba(255,255,255,0.3)",fontFamily:"'Syne',sans-serif",fontSize:14}}>No results for "{q}"</div>
        )}
        <div style={{padding:"8px 16px 10px",borderTop:"1px solid rgba(124,110,224,0.08)",display:"flex",gap:12}}>
          {[["↵","Navigate"],["Esc","Close"]].map(([k,l])=>(
            <span key={k} style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:"rgba(255,255,255,0.25)",display:"flex",alignItems:"center",gap:4}}>
              <span style={{padding:"2px 5px",borderRadius:4,border:"1px solid rgba(255,255,255,0.12)",fontSize:9}}>{k}</span>{l}
            </span>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ══ MOBILE DRAWER ══════════════════════════════════════════════════ */
function MobileDrawer({open,onClose}){
  const[expanded,setEx]=useState(null);
  const navigate=useNavigate();
  const go=href=>{navigate(href);onClose();};
  return(
    <AnimatePresence>
      {open&&(
        <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
          style={{position:"fixed",inset:0,zIndex:1500,display:"flex",flexDirection:"column"}}>
          <div onClick={onClose} style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.6)",backdropFilter:"blur(8px)"}}/>
          <motion.div initial={{x:"100%"}} animate={{x:0}} exit={{x:"100%"}} transition={{duration:0.28,ease:[0.22,1,0.36,1]}}
            style={{position:"absolute",right:0,top:0,bottom:0,width:"min(320px,88vw)",background:"rgba(8,6,20,0.98)",borderLeft:"1px solid rgba(124,110,224,0.2)",display:"flex",flexDirection:"column",overflowY:"auto"}}>
            {/* Drawer header */}
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"18px 20px",borderBottom:"1px solid rgba(124,110,224,0.1)"}}>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <CJLogo size={30}/>
                <span style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:15,background:"linear-gradient(90deg,#fff,#c4bbff,#5eead4,#fff)",backgroundSize:"200% auto",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text"}}>CODE JOURNEY</span>
              </div>
              <button onClick={onClose} style={{width:30,height:30,borderRadius:"50%",background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:"rgba(255,255,255,0.6)"}}>
                <X size={14}/>
              </button>
            </div>
            {/* Nav items */}
            <div style={{flex:1,padding:"12px"}}>
              {NAV.map(item=>(
                <div key={item.label} style={{marginBottom:4}}>
                  <button onClick={()=>setEx(ex=>ex===item.label?null:item.label)}
                    style={{display:"flex",alignItems:"center",gap:8,width:"100%",padding:"10px 14px",borderRadius:10,border:"none",background:expanded===item.label?"rgba(124,110,224,0.1)":"transparent",cursor:"pointer",transition:"background 0.14s"}}>
                    <item.icon size={15} color={item.color}/>
                    <span style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:14,color:"rgba(255,255,255,0.9)",flex:1,textAlign:"left"}}>{item.label}</span>
                    <ChevronDown size={13} color="rgba(255,255,255,0.3)" style={{transform:expanded===item.label?"rotate(180deg)":"none",transition:"transform 0.2s"}}/>
                  </button>
                  <AnimatePresence>
                    {expanded===item.label&&(
                      <motion.div initial={{height:0,opacity:0}} animate={{height:"auto",opacity:1}} exit={{height:0,opacity:0}} style={{overflow:"hidden"}}>
                        <div style={{paddingLeft:8,paddingBottom:4}}>
                          {item.children.map(c=>(
                            <button key={c.label} onClick={()=>go(c.href)}
                              style={{display:"flex",alignItems:"center",gap:10,width:"100%",padding:"8px 14px",borderRadius:8,border:"none",background:"transparent",cursor:"pointer",transition:"background 0.13s",textAlign:"left"}}
                              onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,0.05)"}
                              onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                              <div style={{width:5,height:5,borderRadius:"50%",background:c.color,flexShrink:0}}/>
                              <span style={{fontFamily:"'Syne',sans-serif",fontSize:13,color:"rgba(255,255,255,0.7)",fontWeight:500}}>{c.label}</span>
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
            {/* Bottom CTA */}
            <div style={{padding:"16px",borderTop:"1px solid rgba(124,110,224,0.1)",display:"flex",gap:8}}>
              <button onClick={()=>go("/auth")} style={{flex:1,padding:"11px",borderRadius:10,border:"1px solid rgba(124,110,224,0.4)",background:"transparent",color:"rgba(255,255,255,0.8)",fontFamily:"'Syne',sans-serif",fontWeight:600,fontSize:13.5,cursor:"pointer"}}>Log in</button>
              <button onClick={()=>go("/auth")} style={{flex:1,padding:"11px",borderRadius:10,border:"none",background:"linear-gradient(135deg,#7c6ee0,#5a52c4)",color:"#fff",fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:13.5,cursor:"pointer"}}>Get started</button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ══ MAIN HEADER ════════════════════════════════════════════════════ */
export default function Header(){
  const[scrolled,setScrolled]=useState(false);
  const[activeDrop,setDrop]=useState(null);
  const[searchOpen,setSearch]=useState(false);
  const[mobileOpen,setMobile]=useState(false);
  const location=useLocation();
  const dropTimer=useRef(null);
  const navigate=useNavigate();

  /* Close on route change */
  useEffect(()=>{setDrop(null);setMobile(false);},[location.pathname]);

  /* Scroll detect */
  useEffect(()=>{
    const fn=()=>setScrolled(window.scrollY>10);
    window.addEventListener("scroll",fn,{passive:true});
    return()=>window.removeEventListener("scroll",fn);
  },[]);

  /* Cmd/Ctrl+K → search */
  useEffect(()=>{
    const fn=e=>{if((e.metaKey||e.ctrlKey)&&e.key==="k"){e.preventDefault();setSearch(true);}};
    document.addEventListener("keydown",fn);
    return()=>document.removeEventListener("keydown",fn);
  },[]);

  const openDrop=label=>{clearTimeout(dropTimer.current);setDrop(label);};
  const closeDrop=()=>{dropTimer.current=setTimeout(()=>setDrop(null),120);};
  const keepDrop=()=>clearTimeout(dropTimer.current);

  const isActive=path=>location.pathname===path||location.pathname.startsWith(path+"/");

  return(
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600&family=Syne:wght@400;500;600;700;800&display=swap');
        *,*::before,*::after{box-sizing:border-box;}

        /* ── GLOBAL OVERLAP FIX — add to Layout.jsx or index.css ──────
           html { scroll-padding-top: 96px; }
           .page-content { padding-top: 96px; }
           Every hero with padding-top:96px will clear the 64px header
           + 16px top gap = 80px. The extra 16px = breathing room.
        ─────────────────────────────────────────────────────────────── */

        @keyframes cjShimmer{0%{background-position:-200% center}100%{background-position:200% center}}
        @keyframes cjPulse{0%,100%{box-shadow:0 0 0 0 rgba(124,110,224,0.4)}50%{box-shadow:0 0 0 5px rgba(124,110,224,0)}}

        .cj-pill{
          position:fixed;top:14px;left:50%;transform:translateX(-50%);
          width:min(1000px,calc(100vw - 28px));height:60px;
          display:flex;align-items:center;
          background:${scrolled?"rgba(6,4,18,0.92)":"rgba(10,8,24,0.78)"};
          backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);
          border-radius:16px;
          border:1px solid ${scrolled?"rgba(124,110,224,0.22)":"rgba(124,110,224,0.12)"};
          box-shadow:${scrolled?"0 8px 40px rgba(0,0,0,0.55),0 0 0 0.5px rgba(124,110,224,0.2)":"0 4px 20px rgba(0,0,0,0.3)"};
          transition:background 0.3s,border-color 0.3s,box-shadow 0.3s;
          z-index:900;padding:0 14px;gap:8px;
        }

        .cj-logo-text{
          font-family:'Syne',sans-serif;font-weight:800;font-size:17px;letter-spacing:0.3px;
          background:linear-gradient(90deg,#ffffff 0%,#c4bbff 30%,#5eead4 55%,#ffffff 80%);
          background-size:200% auto;
          -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
          animation:cjShimmer 5s linear infinite;white-space:nowrap;
        }

        .cj-navbtn{
          display:flex;align-items:center;gap:5px;padding:6px 11px;border-radius:8px;
          border:none;background:transparent;cursor:pointer;
          font-family:'Syne',sans-serif;font-weight:600;font-size:13.5px;
          color:rgba(255,255,255,0.62);transition:all 0.15s;white-space:nowrap;
        }
        .cj-navbtn:hover,.cj-navbtn.active{color:rgba(255,255,255,0.95);background:rgba(255,255,255,0.07);}
        .cj-navbtn.active{color:#c4bbff;}

        .cj-search-pill{
          display:flex;align-items:center;gap:7px;
          padding:6px 12px;border-radius:9px;
          border:1px solid rgba(124,110,224,0.2);
          background:rgba(124,110,224,0.07);
          cursor:pointer;transition:all 0.16s;
          font-family:'JetBrains Mono',monospace;font-size:12px;color:rgba(255,255,255,0.38);
          white-space:nowrap;
        }
        .cj-search-pill:hover{border-color:rgba(124,110,224,0.4);background:rgba(124,110,224,0.13);color:rgba(255,255,255,0.65);}

        .cj-cta-login{
          padding:7px 14px;border-radius:9px;border:1px solid rgba(124,110,224,0.4);
          background:transparent;color:rgba(255,255,255,0.75);
          font-family:'Syne',sans-serif;font-weight:600;font-size:13px;cursor:pointer;
          transition:all 0.16s;white-space:nowrap;
        }
        .cj-cta-login:hover{border-color:rgba(124,110,224,0.7);color:#fff;background:rgba(124,110,224,0.1);}

        .cj-cta-main{
          padding:7px 16px;border-radius:9px;border:none;
          background:linear-gradient(135deg,#7c6ee0,#5a52c4);
          color:#fff;font-family:'Syne',sans-serif;font-weight:700;font-size:13px;
          cursor:pointer;transition:all 0.16s;white-space:nowrap;
        }
        .cj-cta-main:hover{opacity:0.88;transform:translateY(-1px);box-shadow:0 4px 18px rgba(124,110,224,0.5);}

        .cj-mobile-btn{
          width:36px;height:36px;border-radius:9px;border:1px solid rgba(255,255,255,0.1);
          background:rgba(255,255,255,0.05);display:flex;align-items:center;justify-content:center;
          cursor:pointer;flex-shrink:0;transition:all 0.15s;
        }
        .cj-mobile-btn:hover{background:rgba(255,255,255,0.1);}

        @media(max-width:640px){
          .cj-pill{height:54px;top:10px;border-radius:14px;}
          .cj-logo-text{font-size:14px;}
        }
      `}</style>

      {/* ── PILL BAR ── */}
      <div className="cj-pill">
        {/* Logo */}
        <Link to="/" style={{display:"flex",alignItems:"center",gap:9,textDecoration:"none",flexShrink:0,marginRight:4}}>
          <CJLogo size={34}/>
          <span className="cj-logo-text">CODE JOURNEY</span>
        </Link>

        {/* DESKTOP NAV — hidden ≤768 */}
        <div style={{display:"flex",alignItems:"center",gap:2,flex:1,justifyContent:"center"}} className="cj-desktop-nav">
          <style>{`@media(max-width:768px){.cj-desktop-nav{display:none!important;}}`}</style>
          {NAV.map(item=>(
            <div key={item.label} style={{position:"relative"}}
              onMouseEnter={()=>openDrop(item.label)} onMouseLeave={closeDrop}>
              <button className={`cj-navbtn${activeDrop===item.label?" active":""}`}>
                {item.label}<ChevronDown size={12} style={{opacity:0.5,transform:activeDrop===item.label?"rotate(180deg)":"none",transition:"transform 0.18s"}}/>
              </button>
              <AnimatePresence>
                {activeDrop===item.label&&(
                  <div onMouseEnter={keepDrop} onMouseLeave={closeDrop}>
                    <MegaDrop item={item} onClose={()=>setDrop(null)}/>
                  </div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* RIGHT ZONE */}
        <div style={{display:"flex",alignItems:"center",gap:6,marginLeft:"auto",flexShrink:0}}>
          {/* Search pill — desktop shows text hint, mobile shows just icon */}
          <button className="cj-search-pill" onClick={()=>setSearch(true)}
            aria-label="Search">
            <Search size={13}/>
            <span className="cj-search-hint" style={{display:"flex",alignItems:"center",gap:6}}>
              <span>Search</span>
              <span style={{padding:"1px 5px",borderRadius:4,border:"1px solid rgba(255,255,255,0.12)",fontSize:10,lineHeight:1.4}}>⌘K</span>
            </span>
            <style>{`@media(max-width:640px){.cj-search-hint{display:none!important;}}`}</style>
          </button>

          {/* Auth — desktop only */}
          <div className="cj-auth-btns" style={{display:"flex",gap:5}}>
            <style>{`@media(max-width:768px){.cj-auth-btns{display:none!important;}}`}</style>
            <button className="cj-cta-login" onClick={()=>navigate("/auth")}>Log in</button>
            <button className="cj-cta-main" onClick={()=>navigate("/auth")}>Get started</button>
          </div>

          {/* Mobile hamburger */}
          <button className="cj-mobile-btn cj-mobile-only" onClick={()=>setMobile(true)} aria-label="Menu">
            <style>{`.cj-mobile-only{display:none!important;}@media(max-width:768px){.cj-mobile-only{display:flex!important;}}`}</style>
            <Menu size={16} color="rgba(255,255,255,0.8)"/>
          </button>
        </div>
      </div>

      {/* Search modal */}
      <AnimatePresence>
        {searchOpen&&<HeaderSearch onClose={()=>setSearch(false)}/>}
      </AnimatePresence>

      {/* Mobile drawer */}
      <MobileDrawer open={mobileOpen} onClose={()=>setMobile(false)}/>
    </>
  );
}