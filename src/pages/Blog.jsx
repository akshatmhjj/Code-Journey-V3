/**
 * Blog.jsx  →  /blog
 * Long-form articles from the CJ team.
 * List view + individual article view (overlay, no scroll reset).
 */
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, ArrowUpRight, Clock, X, ChevronRight } from "lucide-react";

const PT = { cosmos: { shell: "#07080d", deep: "#0c0e18", mid: "#111420", surface: "#161927", panel: "#1a1e2e", hover: "#1e2335", card: "#161927", cardH: "#1c2235", t1: "#e8eaf2", t2: "#8892b0", t3: "#5a6488", t4: "#2e3660", b1: "rgba(120,130,180,0.08)", b2: "rgba(120,130,180,0.15)", b3: "rgba(120,130,180,0.24)", acc: "#7c6ee0", teal: "#5eead4", green: "#22c55e", red: "#f87171", amber: "#fbbf24", dark: true }, void: { shell: "#000", deep: "#050507", mid: "#0a0a0f", surface: "#0f0f15", panel: "#141419", hover: "#1a1a22", card: "#0f0f15", cardH: "#161622", t1: "#f0f0ff", t2: "#9090b8", t3: "#505070", t4: "#252540", b1: "rgba(100,100,200,0.08)", b2: "rgba(100,100,200,0.14)", b3: "rgba(100,100,200,0.22)", acc: "#8b7ff0", teal: "#2dd4bf", green: "#34d399", red: "#fc8181", amber: "#fcd34d", dark: true }, aurora: { shell: "#040e0e", deep: "#071414", mid: "#0b1c1c", surface: "#102424", panel: "#142a2a", hover: "#1a3333", card: "#102424", cardH: "#162e2e", t1: "#e0f5f5", t2: "#7ab8b8", t3: "#3d7878", t4: "#1e4444", b1: "rgba(80,200,180,0.08)", b2: "rgba(80,200,180,0.15)", b3: "rgba(80,200,180,0.24)", acc: "#2dd4bf", teal: "#5eead4", green: "#4ade80", red: "#f87171", amber: "#fbbf24", dark: true }, nord: { shell: "#1a1f2e", deep: "#1e2535", mid: "#232c40", surface: "#28334a", panel: "#2d3a50", hover: "#344260", card: "#28334a", cardH: "#2e3d55", t1: "#eceff4", t2: "#9ba8c0", t3: "#5c6a88", t4: "#3a4560", b1: "rgba(136,192,208,0.1)", b2: "rgba(136,192,208,0.18)", b3: "rgba(136,192,208,0.28)", acc: "#88c0d0", teal: "#8fbcbb", green: "#a3be8c", red: "#bf616a", amber: "#ebcb8b", dark: true }, light: { shell: "#f3f4f8", deep: "#fff", mid: "#f0f1f7", surface: "#fff", panel: "#f7f8fc", hover: "#eef0f8", card: "#fff", cardH: "#f5f6fc", t1: "#111827", t2: "#4b5680", t3: "#7c87a8", t4: "#c5ccdf", b1: "rgba(80,90,150,0.08)", b2: "rgba(80,90,150,0.15)", b3: "rgba(80,90,150,0.24)", acc: "#6256d0", teal: "#0d9488", green: "#16a34a", red: "#dc2626", amber: "#d97706", dark: false } };
const getT = () => { try { return PT[localStorage.getItem("cj-theme")] || PT.light; } catch { return PT.light; } };
function useTheme() { const [T, setT] = useState(getT); useEffect(() => { const iv = setInterval(() => { const f = getT(); if (f.acc !== T.acc) setT(f); }, 500); return () => clearInterval(iv); }, [T]); useEffect(() => { const fn = () => setT(getT()); window.addEventListener("storage", fn); return () => window.removeEventListener("storage", fn); }, []); return T; }

const POSTS = [
{
  id: "why-people-quit",
  color: "#f59e0b",
  tag: "Philosophy",
  date: "2026-04-12",
  readTime: "4 min",
  title: "Why most people quit coding (and how not to)",
  excerpt: "It’s not because coding is hard. It’s because expectations are wrong.",
  body: [
    {
      h: "Unrealistic timelines",
      p: "People expect to become job-ready in 2–3 months because of YouTube thumbnails and 'zero to hero' promises. When reality doesn’t match that expectation, it feels like failure — even when you’re actually improving. Coding is difficult not because of syntax, but because you’re building problem-solving ability from scratch. That takes time, no matter how fast you want it to happen."
    },
    {
      h: "No feedback loop",
      p: "If you’re only watching tutorials or reading, you’re not getting real feedback. Feedback comes from building — seeing something break, debugging it, and finally making it work. Without that loop, your brain doesn’t register progress, so motivation drops even when you’re learning."
    },
    {
      h: "The fix",
      p: "Shrink your goals aggressively. Instead of 'build an app', aim for 'render a button', then 'handle a click', then 'fetch data'. Small wins stack faster than motivation ever will. The people who succeed aren’t more motivated — they just made progress visible."
    }
  ]
},

{
  id: "dart-underrated",
  color: "#5eead4",
  tag: "App Dev",
  date: "2026-04-10",
  readTime: "4 min",
  title: "Why Dart is the most underrated language for beginners",
  excerpt: "Everyone tells beginners to learn Python or JavaScript. Dart is cleaner, safer, and gets you to a published mobile app faster than both.",
  body: [
    {
      h: "The null safety advantage",
      p: "In JavaScript or Python, null errors often appear at runtime — sometimes long after you wrote the code. Dart forces you to think about null upfront. That means fewer hidden bugs and less confusion. For beginners, this removes an entire category of frustration before it even happens."
    },
    {
      h: "One language, every platform",
      p: "Dart with Flutter runs on mobile, web, desktop, and more. You don’t need to switch ecosystems or learn separate tools for each platform. This consistency matters early on because it lets you focus on building instead of constantly adapting."
    },
    {
      h: "Hot reload as a learning tool",
      p: "Flutter’s hot reload gives instant feedback — you change something, and it updates immediately. That tight loop helps beginners build intuition faster. Instead of guessing how layouts behave, you see it in real time."
    },
    {
      h: "The learning curve is honest",
      p: "Dart feels harder in the beginning, but it teaches real concepts — structure, typing, and state. That initial difficulty pays off because you’re learning things that actually matter in real projects, not just shortcuts."
    }
  ]
},

{
  id: "0-to-deployed",
  color: "#7c6ee0",
  tag: "Web Dev",
  date: "2026-04-03",
  readTime: "3 min",
  title: "From zero to deployed in 30 days: a realistic plan",
  excerpt: "Most plans are unrealistic. This one focuses on what actually matters.",
  body: [
    {
      h: "What you actually need",
      p: "You don’t need to know everything. You need to build layouts, fetch data, handle errors, and deploy. That’s enough to create real projects. Everything else can come later once you have something working."
    },
    {
      h: "The one project",
      p: "A GitHub profile explorer is perfect because it covers everything — layout, API calls, error states, and deployment. It’s simple enough to finish but real enough to matter."
    },
    {
      h: "What to skip",
      p: "Skip advanced topics early on. Animations, complex APIs, and edge optimizations slow you down. The first goal is completion, not perfection."
    },
    {
      h: "Deployment shift",
      p: "Deploying your first project changes your mindset. You stop feeling like a learner and start thinking like a builder. That shift is more important than any tutorial."
    }
  ]
},

{
  id: "confusion-tax",
  color: "#f97316",
  tag: "Philosophy",
  date: "2026-03-22",
  readTime: "2 min",
  title: "The confusion tax",
  excerpt: "Too many choices slow you down more than you think.",
  body: [
    {
      h: "What it costs",
      p: "Every time you compare tools instead of using one, you waste mental energy. That energy should go into building. Beginners don’t need options — they need direction."
    },
    {
      h: "Opinionated paths",
      p: "Choosing one stack removes decision fatigue. It doesn’t mean it’s the best — it means it’s good enough to move forward. Progress beats perfection."
    },
    {
      h: "Less is more",
      p: "The fastest learners aren’t the ones consuming the most content — they’re the ones focused on the right content. Removing noise is a skill."
    }
  ]
},

{
  id: "sql-window-functions",
  color: "#a78bfa",
  tag: "Data Science",
  date: "2026-03-15",
  readTime: "2 min",
  title: "Window functions explained",
  excerpt: "The skill that separates beginners from real analysts.",
  body: [
    {
      h: "What they do",
      p: "Window functions let you calculate values across rows without collapsing them. That means you keep full datasets while still analyzing patterns inside them."
    },
    {
      h: "Why they matter",
      p: "Most real analysis involves comparisons — previous values, rankings, trends. Window functions make those patterns easy to express in a single query."
    },
    {
      h: "How to learn",
      p: "Start with LAG and LEAD. Once you understand how data flows across rows, everything else becomes easier. It’s less about syntax and more about thinking in sequences."
    }
  ]
},

{
  id: "tutorial-trap",
  color: "#ef4444",
  tag: "Mindset",
  date: "2026-04-20",
  readTime: "2 min",
  title: "The tutorial trap",
  excerpt: "Why tutorials feel useful but don’t build real skill.",
  body: [
    {
      h: "Recognition vs recall",
      p: "Watching code makes things feel easy because you’re recognizing patterns. But real skill is writing code without guidance. That gap is why tutorials don’t translate into building ability."
    },
    {
      h: "False progress",
      p: "Completing tutorials feels productive, but you didn’t make decisions. Real development is about deciding structure, fixing bugs, and figuring things out when nothing is clear."
    },
    {
      h: "Break the cycle",
      p: "Rebuild everything without looking. It will feel slow and frustrating, but that’s where learning actually happens. Struggle is not failure — it’s progress."
    }
  ]
},

{
  id: "dsa-myth",
  color: "#22c55e",
  tag: "Career",
  date: "2026-04-18",
  readTime: "2 min",
  title: "The DSA myth",
  excerpt: "Why beginners focus on the wrong thing.",
  body: [
    {
      h: "What matters first",
      p: "Projects show you can build. That’s what gets attention early. Algorithms don’t matter if you can’t create working applications."
    },
    {
      h: "Where DSA fits",
      p: "DSA matters later when you optimize or prepare for specific interviews. Without context, it feels abstract and disconnected."
    },
    {
      h: "Right sequence",
      p: "Build first, understand fundamentals, then learn DSA. This order makes everything easier and more meaningful."
    }
  ]
},

{
  id: "state-management-simple",
  color: "#3b82f6",
  tag: "Web Dev",
  date: "2026-04-16",
  readTime: "2 min",
  title: "State management explained simply",
  excerpt: "It’s one idea, not many tools.",
  body: [
    {
      h: "What state is",
      p: "State is just data that changes — like user input or login status. Every interactive app is built around state changes."
    },
    {
      h: "The problem",
      p: "When multiple components need the same data, passing it around becomes messy. That’s where confusion starts."
    },
    {
      h: "The solution",
      p: "State management centralizes data so everything can access it easily. Tools differ, but the idea stays the same."
    }
  ]
},

{
  id: "api-basics",
  color: "#a855f7",
  tag: "Web Dev",
  date: "2026-04-08",
  readTime: "2 min",
  title: "APIs explained simply",
  excerpt: "Understanding this unlocks real-world apps.",
  body: [
    {
      h: "The core idea",
      p: "An API connects your app to a server. You request data, it responds. That’s the foundation of modern apps."
    },
    {
      h: "How it works",
      p: "Every request includes a URL and method. The server processes it and sends back data, usually JSON. This pattern is everywhere."
    },
    {
      h: "Why it matters",
      p: "Without APIs, apps can’t fetch data, authenticate users, or interact with services. Understanding them moves you beyond static projects."
    }
  ]
}
];

function ArticleOverlay({ post, onClose, T }) {
  const scrollRef = useRef(null);
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const el = scrollRef.current; if (!el) return;
    const fn = () => setPct(Math.min(1, el.scrollTop / Math.max(1, el.scrollHeight - el.clientHeight)));
    el.addEventListener("scroll", fn, { passive: true }); return () => el.removeEventListener("scroll", fn);
  }, []);
  useEffect(() => {
    const fn = e => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", fn); return () => document.removeEventListener("keydown", fn);
  }, [onClose]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex" }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)" }} />
      <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        style={{ position: "relative", marginLeft: "auto", width: "min(760px,100vw)", height: "100%", background: T.deep, display: "flex", flexDirection: "column", boxShadow: "-20px 0 80px rgba(0,0,0,0.5)", borderLeft: `1px solid ${T.b1}` }}>
        {/* Progress */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2.5, background: T.b1, zIndex: 10 }}>
          <motion.div animate={{ width: `${pct * 100}%` }} transition={{ duration: 0.06 }} style={{ height: "100%", background: post.color, borderRadius: "0 2px 2px 0" }} />
        </div>
        {/* Toolbar */}
        <div style={{ display: "flex", alignItems: "center", padding: "0 20px", height: 48, borderBottom: `1px solid ${T.b1}`, background: T.deep, flexShrink: 0 }}>
          <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: T.t3, flex: 1 }}>/blog/{post.id}</span>
          <span style={{ fontFamily: "'Syne',sans-serif", fontSize: 10.5, fontWeight: 700, color: post.color, background: `${post.color}14`, border: `1px solid ${post.color}28`, padding: "2px 9px", borderRadius: 100, marginRight: 10 }}>{post.tag}</span>
          <button onClick={onClose} style={{ width: 28, height: 28, borderRadius: "50%", background: T.hover, border: `1px solid ${T.b2}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: T.t2 }}><X size={13} /></button>
        </div>
        {/* Content */}
        <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", padding: "36px 32px 80px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18, flexWrap: "wrap" }}>
            <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: T.t3 }}>{new Date(post.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
            <span style={{ color: T.t4 }}>·</span>
            <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: T.t3, display: "flex", alignItems: "center", gap: 4 }}><Clock size={11} />{post.readTime} read</span>
          </div>
          <h1 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "clamp(22px,3.5vw,32px)", color: T.t1, lineHeight: 1.12, marginBottom: 18, letterSpacing: "-0.5px" }}>{post.title}</h1>
          <p style={{ fontFamily: "'Lora',serif", fontStyle: "italic", fontSize: 17, color: T.t2, lineHeight: 1.85, marginBottom: 32, borderBottom: `1px solid ${T.b1}`, paddingBottom: 28 }}>{post.excerpt}</p>
          {post.body.map((sec, i) => (
            <div key={i} style={{ marginBottom: 36 }}>
              <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 19, color: T.t1, marginBottom: 12, letterSpacing: "-0.2px", display: "flex", alignItems: "center", gap: 9 }}>
                <div style={{ width: 3, height: 20, background: post.color, borderRadius: 2, flexShrink: 0 }} />
                {sec.h}
              </h2>
              <p style={{ fontFamily: "'Lora',serif", fontSize: 16, color: T.t2, lineHeight: 1.9, paddingLeft: 12 }}>{sec.p}</p>
              {i < post.body.length - 1 && <div style={{ height: 1, background: T.b1, marginTop: 32, marginLeft: 12 }} />}
            </div>
          ))}
          <div style={{ marginTop: 40, paddingTop: 24, borderTop: `1px solid ${T.b1}` }}>
            <button onClick={onClose} style={{ padding: "9px 20px", borderRadius: 8, border: "none", background: post.color, color: "#fff", fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>← All Articles</button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Blog() {
  const T = useTheme();
  const [open, setOpen] = useState(null);
  const savedY = useRef(0);

  useEffect(() => {
    if (open) { savedY.current = window.scrollY; document.body.style.cssText = `overflow:hidden;position:fixed;top:-${savedY.current}px;width:100%`; }
    else { document.body.style.cssText = ""; window.scrollTo(0, savedY.current); }
    return () => { document.body.style.cssText = ""; };
  }, [open]);

  const [featured, ...rest] = POSTS;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600&family=Syne:wght@400;500;600;700;800&family=Lora:ital,wght@0,400;0,500;1,400;1,500&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        body{background:${T.shell};}
        ::-webkit-scrollbar{width:5px;}::-webkit-scrollbar-thumb{background:${T.hover};border-radius:3px;}
        ::selection{background:rgba(124,110,224,0.25);}
        @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
      `}</style>
      <div style={{ minHeight: "100vh", background: T.shell, color: T.t1, fontFamily: "'Syne',sans-serif" }}>

        <div style={{ background: T.deep, borderBottom: `1px solid ${T.b1}`, padding: "96px 24px 52px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(${T.b1} 1px,transparent 1px),linear-gradient(90deg,${T.b1} 1px,transparent 1px)`, backgroundSize: "48px 48px", maskImage: "radial-gradient(ellipse 70% 70% at 50% 40%,black 20%,transparent 100%)", pointerEvents: "none" }} />
          <div style={{ maxWidth: 860, margin: "0 auto", position: "relative" }}>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "4px 14px", borderRadius: 100, background: `${T.acc}14`, border: `1px solid ${T.acc}40`, marginBottom: 18 }}>
              <BookOpen size={12} color={T.acc} />
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, fontWeight: 700, color: T.acc, letterSpacing: "2px", textTransform: "uppercase" }}>Blog</span>
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "clamp(30px,5vw,50px)", lineHeight: 1.07, letterSpacing: "-1px", marginBottom: 12, color: T.t1 }}>
              Thinking out loud<br /><span style={{ color: T.acc }}>about learning to code.</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.14 }} style={{ fontFamily: "'Lora',serif", fontStyle: "italic", fontSize: 16, color: T.t2, lineHeight: 1.75 }}>Deep dives, opinions, and practical guides from the Code Journey team.</motion.p>
          </div>
        </div>

        <div style={{ maxWidth: 860, margin: "0 auto", padding: "40px 24px 80px" }}>
          {/* Featured */}
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} onClick={() => setOpen(featured)}
            style={{ cursor: "pointer", padding: "28px 32px", borderRadius: 18, border: `1px solid ${featured.color}35`, background: `${featured.color}08`, marginBottom: 32, borderLeft: `4px solid ${featured.color}`, transition: "all 0.18s" }}
            onMouseEnter={e => { e.currentTarget.style.background = `${featured.color}12`; }}
            onMouseLeave={e => { e.currentTarget.style.background = `${featured.color}08`; }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, fontWeight: 700, color: featured.color, background: `${featured.color}14`, border: `1px solid ${featured.color}28`, padding: "2px 9px", borderRadius: 100 }}>{featured.tag}</span>
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: T.t3 }}>Featured · {new Date(featured.date).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}</span>
            </div>
            <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "clamp(20px,3vw,28px)", color: T.t1, marginBottom: 12, letterSpacing: "-0.4px", lineHeight: 1.2 }}>{featured.title}</h2>
            <p style={{ fontFamily: "'Lora',serif", fontStyle: "italic", fontSize: 15.5, color: T.t2, lineHeight: 1.78, marginBottom: 16 }}>{featured.excerpt}</p>
            <span style={{ display: "flex", alignItems: "center", gap: 5, fontFamily: "'Syne',sans-serif", fontSize: 13.5, fontWeight: 700, color: featured.color }}>Read article<ArrowUpRight size={14} /></span>
          </motion.div>

          {/* Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 16 }}>
            {rest.map((post, i) => (
              <motion.div key={post.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 + 0.2 }}
                onClick={() => setOpen(post)}
                style={{ cursor: "pointer", padding: "20px", borderRadius: 14, border: `1px solid ${T.b1}`, background: T.card, transition: "all 0.18s", borderTop: `2px solid ${post.color}` }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = `${post.color}55`; e.currentTarget.style.background = T.cardH; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = T.b1; e.currentTarget.style.borderTopColor = post.color; e.currentTarget.style.background = T.card; }}>
                <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 10 }}>
                  <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, fontWeight: 700, color: post.color, background: `${post.color}14`, border: `1px solid ${post.color}28`, padding: "2px 8px", borderRadius: 100 }}>{post.tag}</span>
                  <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10.5, color: T.t3 }}>{post.readTime} read</span>
                </div>
                <h3 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 16, color: T.t1, marginBottom: 9, lineHeight: 1.3 }}>{post.title}</h3>
                <p style={{ fontFamily: "'Lora',serif", fontSize: 13.5, color: T.t3, lineHeight: 1.68, marginBottom: 12, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{post.excerpt}</p>
                <span style={{ display: "flex", alignItems: "center", gap: 4, fontFamily: "'Syne',sans-serif", fontSize: 12.5, fontWeight: 600, color: post.color }}>Read<ChevronRight size={13} /></span>
              </motion.div>
            ))}
          </div>
        </div>

        <AnimatePresence>
          {open && <ArticleOverlay post={open} onClose={() => setOpen(null)} T={T} />}
        </AnimatePresence>
      </div>
    </>
  );
}