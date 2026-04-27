/**
 * CJLoader.jsx — Code Journey Universal Loading System
 *
 * EXPORTS:
 *   default  CJLoader      — full-screen loading overlay (page transitions, auth check, profile fetch)
 *   named    CJSpinner     — small inline spinner (buttons, cards, small sections)
 *   named    CJPageLoader  — wraps React Router to show loader between route changes
 *   named    withLoader    — HOC: wraps any component, shows loader while `loading` prop is true
 *   named    useCJLoader   — hook: programmatic show/hide from anywhere
 *
 * USAGE GUIDE at bottom of file.
 */

import React, {
  useState, useEffect, useRef, createContext, useContext, useCallback,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";

/* ── theme-aware background ───────────────────────────────── */
const getBg = () => {
  try {
    const k = localStorage.getItem("cj-theme") || "light";
    const map = {
      cosmos: { bg:"#07080d", t1:"#e8eaf2", t3:"#5a6488" },
      void:   { bg:"#000000", t1:"#f0f0ff", t3:"#505070" },
      aurora: { bg:"#040e0e", t1:"#e0f5f5", t3:"#3d7878" },
      nord:   { bg:"#1a1f2e", t1:"#eceff4", t3:"#5c6a88" },
      light:  { bg:"#f3f4f8", t1:"#111827", t3:"#7c87a8" },
    };
    return map[k] || map.cosmos;
  } catch { return { bg:"#07080d", t1:"#e8eaf2", t3:"#5a6488" }; }
};

/* ── language orbit dots ──────────────────────────────────── */
const LANGS = [
  { label:"JS",  color:"#f7df1e", angle:0   },
  { label:"Py",  color:"#4ade80", angle:60  },
  { label:"TS",  color:"#60a5fa", angle:120 },
  { label:"Kt",  color:"#a78bfa", angle:180 },
  { label:"Sw",  color:"#f97316", angle:240 },
  { label:"SQL", color:"#f472b6", angle:300 },
];

/* ══════════════════════════════════════════════════════════
   FULL-SCREEN LOADER
══════════════════════════════════════════════════════════ */
export default function CJLoader({
  message = "Loading…",   // text shown below logo
  minTime = 600,          // minimum ms to show (prevents flicker on fast loads)
  onDone,                 // optional callback when minTime has elapsed
}) {
  const theme = getBg();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => {
      setVisible(false);
      onDone?.();
    }, minTime);
    return () => clearTimeout(t);
  }, [minTime, onDone]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="cj-loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.4, ease: "easeInOut" } }}
          style={{
            position: "fixed", inset: 0, zIndex: 9999,
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            background: theme.bg,
            gap: 28,
          }}
        >
          {/* subtle grid texture */}
          <div style={{
            position: "absolute", inset: 0, pointerEvents: "none",
            backgroundImage: `linear-gradient(rgba(124,110,224,0.04) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(124,110,224,0.04) 1px, transparent 1px)`,
            backgroundSize: "48px 48px",
          }} />

          {/* radial glow behind logo */}
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            style={{
              position: "absolute",
              width: 260, height: 260, borderRadius: "50%",
              background: "radial-gradient(ellipse, rgba(124,110,224,0.22) 0%, transparent 70%)",
              filter: "blur(20px)", pointerEvents: "none",
            }}
          />

          {/* ── LOGO + ORBIT ── */}
          <div style={{ position: "relative", width: 160, height: 160 }}>
            {/* orbit ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              style={{ position: "absolute", inset: 0 }}
            >
              {LANGS.map(l => {
                const rad = (l.angle * Math.PI) / 180;
                const r   = 72;
                const cx  = 80 + r * Math.cos(rad) - 14;
                const cy  = 80 + r * Math.sin(rad) - 14;
                return (
                  <div key={l.label} style={{
                    position: "absolute", left: cx, top: cy,
                    width: 28, height: 28, borderRadius: "50%",
                    background: `${l.color}18`,
                    border: `1.5px solid ${l.color}55`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <span style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 7.5, fontWeight: 700, color: l.color,
                    }}>{l.label}</span>
                  </div>
                );
              })}
            </motion.div>

            {/* counter-rotating inner ring (slower, opposite) */}
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
              style={{
                position: "absolute", inset: 20,
                borderRadius: "50%",
                border: "1px dashed rgba(124,110,224,0.18)",
              }}
            />

            {/* CJ SVG logo — strokes draw themselves */}
            <div style={{
              position: "absolute", inset: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <svg width="64" height="64" viewBox="0 0 36 36" fill="none">
                <defs>
                  <linearGradient id="ll1" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
                    <stop offset="0%"   stopColor="#7c6ee0" />
                    <stop offset="52%"  stopColor="#5eead4" />
                    <stop offset="100%" stopColor="#7c6ee0" />
                  </linearGradient>
                  <linearGradient id="ll2" x1="0" y1="36" x2="36" y2="0" gradientUnits="userSpaceOnUse">
                    <stop offset="0%"  stopColor="#7c6ee0" stopOpacity="0.22"/>
                    <stop offset="100%" stopColor="#5eead4" stopOpacity="0.08"/>
                  </linearGradient>
                </defs>
                {/* frame */}
                <rect x="1" y="1" width="34" height="34" rx="10"
                  fill="url(#ll2)" stroke="url(#ll1)" strokeWidth="1.2" opacity="0.9"/>
                {/* C — animated draw */}
                <motion.path
                  d="M22 12.5 C17.5 10 10.5 11.2 10.5 18 C10.5 24.8 17.5 26 22 23.5"
                  stroke="url(#ll1)" strokeWidth="2.4" strokeLinecap="round" fill="none"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.9, delay: 0.1, ease: "easeInOut", repeat: Infinity, repeatDelay: 1.8 }}
                />
                {/* J stem — animated draw */}
                <motion.path
                  d="M25.5 12.2 L25.5 21.5 C25.5 24.8 22.5 26.5 19.8 25.5"
                  stroke="url(#ll1)" strokeWidth="2.4" strokeLinecap="round" fill="none"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.9, delay: 0.4, ease: "easeInOut", repeat: Infinity, repeatDelay: 1.8 }}
                />
                {/* J dot — pops in */}
                <motion.circle cx="25.5" cy="11.8" r="1.6" fill="#5eead4"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 0.96 }}
                  transition={{ duration: 0.22, delay: 0.85, repeat: Infinity, repeatDelay: 2.47 }}
                />
              </svg>
            </div>
          </div>

          {/* ── TEXT ── */}
          <div style={{ textAlign: "center", position: "relative" }}>
            {/* brand name */}
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              style={{
                fontFamily: "'Syne', sans-serif", fontWeight: 800,
                fontSize: 16, letterSpacing: "0.3px",
                background: "linear-gradient(90deg,#fff 0%,#c4bbff 35%,#5eead4 60%,#fff 85%)",
                backgroundSize: "220% auto",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                animation: "cjLoaderShimmer 3.5s linear infinite",
                marginBottom: 8,
              }}
            >
              CODE JOURNEY
            </motion.p>

            {/* message */}
            <motion.p
              key={message}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 11.5, color: theme.t3,
                letterSpacing: "0.8px",
                animation: "cjLoaderPulse 1.8s ease-in-out infinite",
              }}
            >
              {message}
            </motion.p>
          </div>

          {/* ── PROGRESS BAR ── */}
          <motion.div
            style={{
              position: "absolute", bottom: 0, left: 0, right: 0,
              height: 2.5,
              background: "rgba(124,110,224,0.12)",
            }}
          >
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
              style={{
                height: "100%", width: "45%",
                background: "linear-gradient(90deg, transparent, #7c6ee0, #5eead4, transparent)",
              }}
            />
          </motion.div>

          <style>{`
            @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&family=Syne:wght@700;800&display=swap');
            @keyframes cjLoaderShimmer {
              0%   { background-position: -220% center; }
              100% { background-position:  220% center; }
            }
            @keyframes cjLoaderPulse {
              0%,100% { opacity: 0.45; }
              50%     { opacity: 0.9; }
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ══════════════════════════════════════════════════════════
   INLINE SPINNER — for buttons, cards, small areas
   Usage: <CJSpinner size={20} color="#7c6ee0" />
══════════════════════════════════════════════════════════ */
export function CJSpinner({ size = 22, color = "#7c6ee0", thickness = 2.5 }) {
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
      style={{
        width: size, height: size, borderRadius: "50%", flexShrink: 0,
        border: `${thickness}px solid ${color}28`,
        borderTop: `${thickness}px solid ${color}`,
      }}
    />
  );
}

/* ══════════════════════════════════════════════════════════
   SECTION LOADER — for data-fetching within a page
   Usage: <CJSectionLoader message="Fetching notes…" height={200} />
══════════════════════════════════════════════════════════ */
export function CJSectionLoader({ message = "Loading…", height = 180 }) {
  const theme = getBg();
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      style={{
        height, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", gap: 14,
      }}
    >
      {/* mini orbit logo */}
      <div style={{ position: "relative", width: 52, height: 52 }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          style={{
            position: "absolute", inset: 0, borderRadius: "50%",
            border: "1.5px dashed rgba(124,110,224,0.3)",
          }}
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
          style={{
            position: "absolute", inset: 6, borderRadius: "50%",
            border: "1px solid rgba(94,234,212,0.25)",
          }}
        />
        <div style={{
          position: "absolute", inset: 0, display: "flex",
          alignItems: "center", justifyContent: "center",
        }}>
          <svg width="26" height="26" viewBox="0 0 36 36" fill="none">
            <defs>
              <linearGradient id="sl1" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
                <stop offset="0%"   stopColor="#7c6ee0"/>
                <stop offset="100%" stopColor="#5eead4"/>
              </linearGradient>
            </defs>
            <rect x="1" y="1" width="34" height="34" rx="10"
              fill="rgba(124,110,224,0.1)" stroke="url(#sl1)" strokeWidth="1.2"/>
            <path d="M22 12.5 C17.5 10 10.5 11.2 10.5 18 C10.5 24.8 17.5 26 22 23.5"
              stroke="url(#sl1)" strokeWidth="2.3" strokeLinecap="round" fill="none"/>
            <path d="M25.5 12.2 L25.5 21.5 C25.5 24.8 22.5 26.5 19.8 25.5"
              stroke="url(#sl1)" strokeWidth="2.3" strokeLinecap="round" fill="none"/>
            <circle cx="25.5" cy="11.8" r="1.5" fill="#5eead4"/>
          </svg>
        </div>
      </div>

      <p style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 11, color: theme.t3,
        letterSpacing: "0.6px",
        animation: "cjLoaderPulse 1.8s ease-in-out infinite",
      }}>{message}</p>
      <style>{`
        @keyframes cjLoaderPulse{0%,100%{opacity:0.4}50%{opacity:0.85}}
      `}</style>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════
   GLOBAL LOADER CONTEXT — programmatic control from anywhere
══════════════════════════════════════════════════════════ */
const LoaderCtx = createContext(null);

export function CJLoaderProvider({ children }) {
  const [state, setState] = useState({ visible: false, message: "Loading…" });

  const show = useCallback((message = "Loading…") => {
    setState({ visible: true, message });
  }, []);

  const hide = useCallback(() => {
    setState(s => ({ ...s, visible: false }));
  }, []);

  return (
    <LoaderCtx.Provider value={{ show, hide }}>
      {children}
      <AnimatePresence>
        {state.visible && (
          <CJLoader message={state.message} minTime={0} onDone={hide} />
        )}
      </AnimatePresence>
    </LoaderCtx.Provider>
  );
}

export function useCJLoader() {
  const ctx = useContext(LoaderCtx);
  if (!ctx) throw new Error("useCJLoader must be used inside <CJLoaderProvider>");
  return ctx; // { show(message), hide() }
}

/* ══════════════════════════════════════════════════════════
   ROUTE TRANSITION LOADER — shows on every page navigation
══════════════════════════════════════════════════════════ */
export function CJPageLoader() {
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const prev = useRef(location.pathname);

  useEffect(() => {
    if (location.pathname === prev.current) return;
    prev.current = location.pathname;
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, [location.pathname]);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          key="route-loader"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          style={{
            position: "fixed", inset: 0, zIndex: 8000,
            display: "flex", alignItems: "center", justifyContent: "center",
            background: getBg().bg,
          }}
        >
          <CJSectionLoader message="Navigating…" height={300} />
          <motion.div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 2.5, background: "rgba(124,110,224,0.1)" }}>
            <motion.div initial={{ x:"-100%" }} animate={{ x:"100%" }} transition={{ duration:0.9, repeat:Infinity, ease:"easeInOut" }}
              style={{ height:"100%", width:"40%", background:"linear-gradient(90deg,transparent,#7c6ee0,#5eead4,transparent)" }}/>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ══════════════════════════════════════════════════════════
   HOC withLoader — wraps any component, shows loader while loading=true
   Usage: const SafeProfile = withLoader(Profile);
          <SafeProfile loading={isAuthChecking} message="Checking session…" />
══════════════════════════════════════════════════════════ */
export function withLoader(WrappedComponent, defaultMessage = "Loading…") {
  return function LoadedComponent({ loading, loaderMessage, ...props }) {
    return (
      <>
        <AnimatePresence>
          {loading && <CJLoader message={loaderMessage || defaultMessage} minTime={0} />}
        </AnimatePresence>
        {!loading && <WrappedComponent {...props} />}
      </>
    );
  };
}

/* ══════════════════════════════════════════════════════════

  HOW TO APPLY ACROSS THE WHOLE WEBSITE
  ══════════════════════════════════════

  1. WRAP YOUR APP (index.jsx / App.jsx):

     import { CJLoaderProvider, CJPageLoader } from "./components/CJLoader";

     function App() {
       return (
         <CJLoaderProvider>
           <BrowserRouter>
             <CJPageLoader />        ← shows on every route change
             <Header />
             <Routes>
               <Route path="/" element={<Home />} />
               ...all your routes...
             </Routes>
             <Footer />
           </BrowserRouter>
         </CJLoaderProvider>
       );
     }

  ──────────────────────────────────────────────────────────

  2. AUTH CHECK (first load, session check):

     import CJLoader from "./components/CJLoader";

     function ProtectedRoute({ children }) {
       const [checking, setChecking] = useState(true);
       useEffect(() => {
         supabase.auth.getUser().then(() => setChecking(false));
       }, []);
       if (checking) return <CJLoader message="Checking session…" />;
       return children;
     }

  ──────────────────────────────────────────────────────────

  3. PROFILE FETCH (already in Profile.jsx — replace the Loader2 spinner):

     // Replace your current loading return with:
     if (loading) return <CJLoader message="Loading your profile…" />;

  ──────────────────────────────────────────────────────────

  4. PROGRAMMATIC (trigger from any component — e.g. after form submit):

     import { useCJLoader } from "./components/CJLoader";

     function MyForm() {
       const { show, hide } = useCJLoader();

       const handleSubmit = async () => {
         show("Saving changes…");
         await saveToSupabase();
         hide();
       };
     }

  ──────────────────────────────────────────────────────────

  5. INLINE SPINNER (buttons, small areas):

     import { CJSpinner } from "./components/CJLoader";

     <button disabled={loading}>
       {loading ? <CJSpinner size={16} color="#fff" /> : "Save"}
     </button>

  ──────────────────────────────────────────────────────────

  6. SECTION LOADER (notes list, tasks, any data fetch inside a page):

     import { CJSectionLoader } from "./components/CJLoader";

     {loadingNotes
       ? <CJSectionLoader message="Fetching notes…" height={220} />
       : <NoteGrid notes={notes} />
     }

  ──────────────────────────────────────────────────────────

  SUMMARY — what to use where:

  Situation                         Component
  ─────────────────────────────── ─────────────────────────
  Page-to-page navigation         CJPageLoader (in App.jsx, auto)
  Auth / session check            CJLoader message="Checking session…"
  Profile / data first fetch      CJLoader message="Loading your profile…"
  Any async action (form submit)  useCJLoader → show() / hide()
  Button loading state            CJSpinner size={16}
  Notes / tasks list loading      CJSectionLoader
  Gate a whole component          withLoader(Component)

══════════════════════════════════════════════════════════ */