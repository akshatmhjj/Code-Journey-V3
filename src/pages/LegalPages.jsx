/**
 * CJ — Legal & Info Pages
 * Export: FAQ, Privacy, Terms, Licensing
 *
 * Each page is a named export. Import individually:
 *   import { FAQ }       from "./pages/LegalPages";
 *   import { Privacy }   from "./pages/LegalPages";
 *   import { Terms }     from "./pages/LegalPages";
 *   import { Licensing } from "./pages/LegalPages";
 */

import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown, Shield, FileText, Scale, BookOpen,
  HelpCircle, ArrowRight, CheckCircle2, XCircle,
  Lock, Eye, Database, Mail, Globe, Zap,
} from "lucide-react";

/* ══════════════════════════════════════════════════════════════
   SHARED THEME SYSTEM
══════════════════════════════════════════════════════════════ */
const THEMES = {
  cosmos: {
    shell:"#07080d",deep:"#0c0e18",mid:"#111420",surface:"#161927",
    panel:"#1a1e2e",hover:"#1e2335",card:"#161927",
    t1:"#e8eaf2",t2:"#8892b0",t3:"#5a6488",t4:"#2e3660",
    b1:"rgba(120,130,180,0.08)",b2:"rgba(120,130,180,0.15)",b3:"rgba(120,130,180,0.24)",
    accent:"#7c6ee0",accentS:"rgba(124,110,224,0.14)",
    teal:"#5eead4",green:"#22c55e",red:"#f87171",gold:"#fbbf24",
  },
  void:{
    shell:"#000000",deep:"#050507",mid:"#0a0a0f",surface:"#0f0f15",
    panel:"#141419",hover:"#1a1a22",card:"#0f0f15",
    t1:"#f0f0ff",t2:"#9090b8",t3:"#505070",t4:"#252540",
    b1:"rgba(100,100,200,0.08)",b2:"rgba(100,100,200,0.14)",b3:"rgba(100,100,200,0.22)",
    accent:"#8b7ff0",accentS:"rgba(139,127,240,0.14)",
    teal:"#2dd4bf",green:"#34d399",red:"#fc8181",gold:"#fcd34d",
  },
  aurora:{
    shell:"#040e0e",deep:"#071414",mid:"#0b1c1c",surface:"#102424",
    panel:"#142a2a",hover:"#1a3333",card:"#102424",
    t1:"#e0f5f5",t2:"#7ab8b8",t3:"#3d7878",t4:"#1e4444",
    b1:"rgba(80,200,180,0.08)",b2:"rgba(80,200,180,0.15)",b3:"rgba(80,200,180,0.24)",
    accent:"#2dd4bf",accentS:"rgba(45,212,191,0.14)",
    teal:"#5eead4",green:"#4ade80",red:"#f87171",gold:"#fbbf24",
  },
  nord:{
    shell:"#1a1f2e",deep:"#1e2535",mid:"#232c40",surface:"#28334a",
    panel:"#2d3a50",hover:"#344260",card:"#28334a",
    t1:"#eceff4",t2:"#9ba8c0",t3:"#5c6a88",t4:"#3a4560",
    b1:"rgba(136,192,208,0.1)",b2:"rgba(136,192,208,0.18)",b3:"rgba(136,192,208,0.28)",
    accent:"#88c0d0",accentS:"rgba(136,192,208,0.14)",
    teal:"#8fbcbb",green:"#a3be8c",red:"#bf616a",gold:"#ebcb8b",
  },
  light:{
    shell:"#f3f4f8",deep:"#ffffff",mid:"#f0f1f7",surface:"#ffffff",
    panel:"#f7f8fc",hover:"#eef0f8",card:"#ffffff",
    t1:"#111827",t2:"#4b5680",t3:"#7c87a8",t4:"#c5ccdf",
    b1:"rgba(80,90,150,0.08)",b2:"rgba(80,90,150,0.15)",b3:"rgba(80,90,150,0.24)",
    accent:"#6256d0",accentS:"rgba(98,86,208,0.1)",
    teal:"#0d9488",green:"#16a34a",red:"#dc2626",gold:"#d97706",
  },
};

const getTheme = () => {
  try { return THEMES[localStorage.getItem("cj-theme")] || THEMES.cosmos; }
  catch { return THEMES.cosmos; }
};
const applyToDom = (T) => {
  const r = document.documentElement;
  [["--cj-shell",T.shell],["--cj-deep",T.deep],["--cj-surface",T.surface],
   ["--cj-accent",T.accent],["--cj-teal",T.teal],
   ["--cj-t1",T.t1],["--cj-t2",T.t2],["--cj-t3",T.t3]]
  .forEach(([k,v])=>r.style.setProperty(k,v));
};

function useTheme() {
  const [T, setT] = useState(getTheme);
  useEffect(() => {
    applyToDom(T);
    const iv = setInterval(() => {
      const f = getTheme(); if (f.accent !== T.accent) { setT(f); applyToDom(f); }
    }, 500);
    return () => clearInterval(iv);
  }, [T]);
  useEffect(() => {
    const fn = () => { const f = getTheme(); setT(f); applyToDom(f); };
    window.addEventListener("storage", fn);
    return () => window.removeEventListener("storage", fn);
  }, []);
  return T;
}

/* ══════════════════════════════════════════════════════════════
   SHARED STYLES STRING
══════════════════════════════════════════════════════════════ */
const sharedStyles = (T) => `
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600&family=Syne:wght@400;500;600;700;800&family=Lora:ital,wght@0,400;0,500;1,400;1,500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { background: ${T.shell}; }
  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-track { background: ${T.shell}; }
  ::-webkit-scrollbar-thumb { background: ${T.hover}; border-radius: 3px; }
  ::selection { background: ${T.accentS}; }
  @keyframes cjUp { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
`;

/* ══════════════════════════════════════════════════════════════
   SHARED COMPONENTS
══════════════════════════════════════════════════════════════ */

/* Page hero header */
const PageHero = ({ icon: Icon, pill, title, subtitle, accent, T, updated }) => (
  <div style={{
    position:"relative",background:T.deep,
    borderBottom:`1px solid ${T.b1}`,
    padding:"100px 24px 56px",overflow:"hidden",
  }}>
    {/* Grid bg */}
    <div style={{
      position:"absolute",inset:0,pointerEvents:"none",
      backgroundImage:`linear-gradient(${T.b1} 1px, transparent 1px),linear-gradient(90deg,${T.b1} 1px,transparent 1px)`,
      backgroundSize:"52px 52px",
      maskImage:"radial-gradient(ellipse 70% 60% at 50% 40%,black 30%,transparent 100%)",
    }}/>
    {/* Glow */}
    <div style={{
      position:"absolute",left:"50%",top:"50%",
      transform:"translate(-50%,-50%)",
      width:500,height:300,borderRadius:"50%",
      background:`radial-gradient(ellipse,${accent}1c 0%,transparent 70%)`,
      filter:"blur(40px)",pointerEvents:"none",
    }}/>
    <div style={{maxWidth:760,margin:"0 auto",position:"relative",textAlign:"center"}}>
      {/* Icon bubble */}
      <motion.div initial={{opacity:0,scale:0.8}} animate={{opacity:1,scale:1}}
        transition={{duration:0.5}}
        style={{
          display:"inline-flex",width:56,height:56,borderRadius:16,
          background:`${accent}16`,border:`1px solid ${accent}40`,
          alignItems:"center",justifyContent:"center",marginBottom:20,
        }}>
        <Icon size={24} color={accent}/>
      </motion.div>

      {/* Pill */}
      <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:0.1}}
        style={{
          display:"inline-flex",alignItems:"center",gap:6,
          padding:"3px 12px",borderRadius:100,
          background:`${accent}14`,border:`1px solid ${accent}40`,
          marginBottom:16,
        }}>
        <span style={{
          fontFamily:"'JetBrains Mono',monospace",fontSize:10,fontWeight:700,
          color:accent,letterSpacing:"1.5px",textTransform:"uppercase",
        }}>{pill}</span>
      </motion.div>

      <motion.h1 initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:0.18}}
        style={{
          fontFamily:"'Syne',sans-serif",fontWeight:800,
          fontSize:"clamp(30px,5vw,52px)",
          color:T.t1,letterSpacing:"-1px",lineHeight:1.1,marginBottom:14,
        }}>{title}</motion.h1>

      <motion.p initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:0.26}}
        style={{
          fontFamily:"'Lora',serif",fontStyle:"italic",fontSize:17,
          color:T.t2,lineHeight:1.78,maxWidth:520,margin:"0 auto",
        }}>{subtitle}</motion.p>

      {updated && (
        <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.36}}
          style={{
            marginTop:20,display:"inline-flex",alignItems:"center",gap:6,
            fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:T.t3,
            padding:"3px 10px",borderRadius:5,
            background:T.panel,border:`1px solid ${T.b1}`,
          }}>
          <span style={{width:6,height:6,borderRadius:"50%",background:T.green,flexShrink:0,display:"inline-block"}}/>
          Last updated: {updated}
        </motion.div>
      )}
    </div>
  </div>
);

/* Section block */
const Section = ({ children, T, alt=false }) => (
  <div style={{background:alt?T.deep:T.mid,borderBottom:`1px solid ${T.b1}`,padding:"60px 24px"}}>
    <div style={{maxWidth:820,margin:"0 auto"}}>{children}</div>
  </div>
);

/* Section heading inside content */
const H2 = ({ children, accent, T }) => (
  <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:20,marginTop:4}}>
    <div style={{width:3,height:22,borderRadius:2,background:accent,flexShrink:0}}/>
    <h2 style={{
      fontFamily:"'Syne',sans-serif",fontWeight:700,
      fontSize:"clamp(18px,2.5vw,22px)",
      color:T.t1,margin:0,letterSpacing:"-0.2px",
    }}>{children}</h2>
  </div>
);

/* Prose paragraph */
const P = ({ children, T }) => (
  <p style={{
    fontFamily:"'Lora',serif",fontSize:16,color:T.t2,
    lineHeight:1.88,marginBottom:16,
  }}>{children}</p>
);

/* Bullet list */
const BulletList = ({ items, accent, T }) => (
  <ul style={{listStyle:"none",display:"flex",flexDirection:"column",gap:9,marginBottom:18}}>
    {items.map((item,i)=>(
      <li key={i} style={{display:"flex",gap:10,alignItems:"flex-start"}}>
        <div style={{
          width:18,height:18,borderRadius:"50%",flexShrink:0,
          background:`${accent}16`,border:`1px solid ${accent}30`,
          display:"flex",alignItems:"center",justifyContent:"center",marginTop:2,
        }}>
          <span style={{fontSize:10,color:accent,fontWeight:700}}>›</span>
        </div>
        <span style={{fontFamily:"'Lora',serif",fontSize:15.5,color:T.t2,lineHeight:1.72}}>{item}</span>
      </li>
    ))}
  </ul>
);

/* Highlight box */
const Callout = ({ icon:Icon, text, color, T }) => (
  <div style={{
    display:"flex",gap:12,alignItems:"flex-start",
    background:`${color}0e`,border:`1px solid ${color}30`,
    borderRadius:12,padding:"14px 16px",marginBottom:18,
  }}>
    <div style={{
      width:32,height:32,borderRadius:8,flexShrink:0,
      background:`${color}18`,border:`1px solid ${color}30`,
      display:"flex",alignItems:"center",justifyContent:"center",
    }}>
      <Icon size={15} color={color}/>
    </div>
    <p style={{
      fontFamily:"'Lora',serif",fontSize:14.5,color:T.t1,
      lineHeight:1.72,margin:0,
    }}>{text}</p>
  </div>
);

/* Contact footer strip */
const ContactStrip = ({ T }) => (
  <div style={{
    background:T.deep,borderTop:`1px solid ${T.b1}`,padding:"48px 24px",
  }}>
    <div style={{
      maxWidth:820,margin:"0 auto",
      display:"flex",alignItems:"center",justifyContent:"space-between",
      flexWrap:"wrap",gap:20,
    }}>
      <div>
        <h3 style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:17,color:T.t1,marginBottom:6}}>
          Still have questions?
        </h3>
        <p style={{fontFamily:"'Lora',serif",fontSize:14.5,color:T.t2,margin:0,fontStyle:"italic"}}>
          We're happy to clarify anything. Reach out directly.
        </p>
      </div>
      <a href="mailto:work.codejourney@gmail.com"
        style={{
          display:"inline-flex",alignItems:"center",gap:8,
          padding:"11px 22px",borderRadius:10,border:`1px solid ${T.accent}55`,
          background:`${T.accent}14`,color:T.accent,
          fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:14,
          textDecoration:"none",transition:"all 0.18s",
        }}
        onMouseEnter={e=>{e.currentTarget.style.background=`${T.accent}22`;}}
        onMouseLeave={e=>{e.currentTarget.style.background=`${T.accent}14`;}}>
        <Mail size={15}/> work.codejourney@gmail.com
      </a>
    </div>
  </div>
);

/* ══════════════════════════════════════════════════════════════
   FAQ
══════════════════════════════════════════════════════════════ */
const FAQ_DATA = [
  {
    category:"Getting Started",
    color:"#7c6ee0",
    items:[
      {
        q:"What exactly is Code Journey?",
        a:"Code Journey is a browser-native learning platform for beginners in software engineering who are still figuring out which role or tech stack they want to pursue. Instead of dumping thousands of resources at you, CJ gives you only the information you need at each step, recommends practice before theory, and helps you discover your direction — web development, app development, or data science — before committing to one path.",
      },
      {
        q:"Do I need any prior coding experience to start?",
        a:"Zero. Code Journey is specifically designed for people who have never written a line of code. Every concept is explained using plain-language analogies, and every exercise starts from the very beginning of the relevant language.",
      },
      {
        q:"Is Code Journey free?",
        a:"Yes — getting started is completely free. Create an account, pick a track, and begin learning immediately. No credit card is required.",
      },
      {
        q:"How is this different from YouTube tutorials or Udemy courses?",
        a:"YouTube and Udemy are excellent — but they are built for people who already know what they want to learn. CJ is built for the step before that: discovering your direction, getting comfortable with the basics, and building enough confidence to engage with those platforms without feeling lost.",
      },
    ],
  },
  {
    category:"Learning Tracks",
    color:"#5eead4",
    items:[
      {
        q:"What are the three learning tracks?",
        a:"Web Development covers the technologies that power websites and web apps — JavaScript, TypeScript, HTML and CSS. App Development covers mobile and cross-platform apps — Flutter, Kotlin and Dart. Data Science covers analysis and machine learning — Python, R and SQL. Each track has its own curated sequence of exercises.",
      },
      {
        q:"Can I switch tracks after I start?",
        a:"Yes. Your progress is saved per track. You can explore all three at your own pace and switch freely. Many learners dip into multiple tracks before committing to one — that's exactly what CJ is designed for.",
      },
      {
        q:"Which track should I pick if I don't know what I want?",
        a:"Start with Web Development. It is the most immediately visual — you see results in a browser almost immediately — which makes it the easiest for beginners to stay motivated. You can always branch into App or Data Science once you have some momentum.",
      },
    ],
  },
  {
    category:"The IDE & Code Runner",
    color:"#fbbf24",
    items:[
      {
        q:"Do I need to install anything?",
        a:"Nothing. The Code Journey IDE runs entirely in your browser. No Node.js, no Python installation, no terminal setup. You open the platform and write code immediately.",
      },
      {
        q:"How does code actually run in the browser?",
        a:"Code runs inside a sandboxed WebAssembly container. Each execution is isolated — 30-second CPU limit, 128 MB memory cap, no network access. Output streams line-by-line into the terminal panel exactly as it would in a local environment.",
      },
      {
        q:"Which languages can I run?",
        a:"JavaScript, TypeScript, Python, Rust, SQL (PostgreSQL dialect), Dart, Kotlin, R and HTML/CSS live preview — all at launch.",
      },
    ],
  },
  {
    category:"AI Tutor",
    color:"#22c55e",
    items:[
      {
        q:"How does the AI Tutor work?",
        a:"When you open the Tutor panel, it already has your current file, the exercise description, which tests are passing or failing, and your last few terminal outputs. You ask a question and it responds with context already loaded — no copy-pasting required.",
      },
      {
        q:"Will the AI just give me the answer?",
        a:"No. The Tutor follows a three-rung hint ladder: first a conceptual nudge, then a structural hint, then a partial implementation if you're still stuck. Solving from the first rung earns full XP; each rung used reduces your award. The goal is understanding, not completion.",
      },
    ],
  },
  {
    category:"Account & Progress",
    color:"#f97316",
    items:[
      {
        q:"Is my progress saved?",
        a:"Yes. All exercise completions, XP, streaks and notes are saved to your account and synced across devices.",
      },
      {
        q:"What are streaks and XP?",
        a:"Complete at least one exercise per day to maintain your streak. Every exercise awards XP based on difficulty, hints used, and solve speed. XP moves you through five tiers: Novice, Apprentice, Practitioner, Expert and Master.",
      },
      {
        q:"How do I delete my account?",
        a:"Go to your Profile page, scroll to the bottom of the sidebar, and click Delete Account. You will be asked to confirm. Deletion is immediate and permanent — all data is removed.",
      },
    ],
  },
];

const FAQItem = ({ item, accent, T }) => {
  const [open, setOpen] = useState(false);
  return (
    <div style={{
      borderBottom:`1px solid ${T.b1}`,overflow:"hidden",
    }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width:"100%",display:"flex",alignItems:"center",justifyContent:"space-between",
          gap:16,padding:"20px 0",background:"none",border:"none",cursor:"pointer",
          textAlign:"left",
        }}>
        <span style={{
          fontFamily:"'Syne',sans-serif",fontWeight:600,
          fontSize:"clamp(14px,1.8vw,16px)",color:T.t1,lineHeight:1.35,flex:1,
        }}>{item.q}</span>
        <motion.div animate={{rotate:open?180:0}} transition={{duration:0.22}}>
          <ChevronDown size={18} color={open?accent:T.t3}/>
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{height:0,opacity:0}}
            animate={{height:"auto",opacity:1}}
            exit={{height:0,opacity:0}}
            transition={{duration:0.24,ease:[0.4,0,0.2,1]}}>
            <div style={{paddingBottom:20}}>
              <p style={{
                fontFamily:"'Lora',serif",fontSize:15.5,
                color:T.t2,lineHeight:1.82,margin:0,
              }}>{item.a}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export function FAQ() {
  const T = useTheme();
  return (
    <>
      <style>{sharedStyles(T)}</style>
      <div style={{minHeight:"100vh",background:T.shell,color:T.t1}}>

        <PageHero
          icon={HelpCircle} pill="FAQ"
          title="Frequently Asked Questions"
          subtitle="Everything you need to know about Code Journey — from how it works to what it costs."
          accent={T.accent} T={T}
        />

        {FAQ_DATA.map((cat, ci) => (
          <Section key={cat.category} T={T} alt={ci%2===1}>
            {/* Category label */}
            <div style={{
              display:"inline-flex",alignItems:"center",gap:6,
              padding:"3px 11px",borderRadius:100,
              background:`${cat.color}14`,border:`1px solid ${cat.color}40`,marginBottom:28,
            }}>
              <span style={{
                fontFamily:"'JetBrains Mono',monospace",fontSize:10,fontWeight:700,
                color:cat.color,letterSpacing:"1.5px",textTransform:"uppercase",
              }}>{cat.category}</span>
            </div>

            <div>
              {cat.items.map((item, i) => (
                <motion.div key={i}
                  initial={{opacity:0,y:12}} whileInView={{opacity:1,y:0}}
                  viewport={{once:true}} transition={{delay:i*0.06}}>
                  <FAQItem item={item} accent={cat.color} T={T}/>
                </motion.div>
              ))}
            </div>
          </Section>
        ))}

        <ContactStrip T={T}/>
      </div>
    </>
  );
}

/* ══════════════════════════════════════════════════════════════
   PRIVACY POLICY
══════════════════════════════════════════════════════════════ */
export function Privacy() {
  const T = useTheme();
  const accent = T.teal;
  return (
    <>
      <style>{sharedStyles(T)}</style>
      <div style={{minHeight:"100vh",background:T.shell,color:T.t1}}>

        <PageHero
          icon={Lock} pill="Privacy Policy"
          title="Your Privacy Matters"
          subtitle="We collect only what we need, use it only as described here, and never sell it. Full stop."
          accent={accent} T={T} updated="April 2026"
        />

        <Section T={T}>
          <H2 accent={accent} T={T}>Who We Are</H2>
          <P T={T}>Code Journey ("CJ", "we", "us", "our") is a web-based learning platform for beginners in software engineering. We are accessible at codejourney.dev. When you use our platform you trust us with information about you — this policy explains exactly what we collect, why, and what rights you have over it.</P>

          <Callout icon={Shield} color={accent} T={T}
            text="We do not sell, rent or trade your personal data to any third party. This is not a legal formality — it is a core principle of how Code Journey operates."/>
        </Section>

        <Section T={T} alt>
          <H2 accent={accent} T={T}>What We Collect and Why</H2>
          <P T={T}>We collect the minimum information needed to operate the platform. Here is what that means in practice:</P>

          {[
            {
              title:"Account Information",
              color:"#7c6ee0",
              items:[
                "Name and email address — used to identify your account and send essential service emails.",
                "Username — displayed on your public profile and leaderboard.",
                "Password — stored as a one-way bcrypt hash. We cannot read your password.",
              ]
            },
            {
              title:"Learning Activity",
              color:accent,
              items:[
                "Exercises completed, XP earned, streaks, and level progression.",
                "Notes you create and save inside the platform.",
                "Code written in the IDE is not stored after your session ends unless you explicitly save it.",
              ]
            },
            {
              title:"Technical Data",
              color:T.gold,
              items:[
                "Browser type and version, operating system — used for compatibility and bug fixing only.",
                "IP address — used for fraud prevention and rate limiting. Not linked to your profile.",
                "Error logs — used to fix bugs. Do not contain code you write.",
              ]
            },
          ].map((block,i)=>(
            <div key={i} style={{marginBottom:24}}>
              <div style={{
                display:"inline-flex",alignItems:"center",gap:6,
                padding:"2px 10px",borderRadius:5,
                background:`${block.color}14`,border:`1px solid ${block.color}30`,marginBottom:10,
              }}>
                <span style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:12,color:block.color}}>{block.title}</span>
              </div>
              <BulletList items={block.items} accent={block.color} T={T}/>
            </div>
          ))}
        </Section>

        <Section T={T}>
          <H2 accent={accent} T={T}>Cookies</H2>
          <P T={T}>We use a minimal set of cookies to keep the platform functional:</P>
          <BulletList T={T} accent={accent} items={[
            "Session cookie — keeps you logged in between page loads. Expires when you log out or close the browser.",
            "Theme preference — stored in localStorage (not a cookie). Stores your selected platform colour theme locally.",
            "No advertising cookies. No cross-site tracking cookies. No third-party analytics cookies.",
          ]}/>
        </Section>

        <Section T={T} alt>
          <H2 accent={accent} T={T}>How We Use Your Data</H2>
          <P T={T}>Your data is used for exactly these purposes and nothing else:</P>
          <BulletList T={T} accent={accent} items={[
            "To operate your account and display your progress across the platform.",
            "To send transactional emails — password reset, account verification, critical service notices.",
            "To improve the platform — aggregate, anonymised usage patterns help us identify which exercises are too hard, too easy or unclear.",
            "To enforce our Terms of Service and prevent abuse.",
          ]}/>
          <Callout icon={Eye} color={accent} T={T}
            text="We do not use your data for advertising, profiling, or any purpose not listed above. We do not share your data with third parties except as required to operate the platform (e.g. email delivery) or by law."/>
        </Section>

        <Section T={T}>
          <H2 accent={accent} T={T}>Data Retention</H2>
          <P T={T}>Your account data is retained for as long as your account exists. When you delete your account, all personal data — including your name, email, progress records, notes and exercise history — is permanently deleted within 30 days. Anonymised aggregate statistics (e.g. "exercise X was completed 4,000 times") are retained indefinitely as they contain no personal data.</P>
        </Section>

        <Section T={T} alt>
          <H2 accent={accent} T={T}>Your Rights</H2>
          <P T={T}>Depending on where you live, you may have the right to:</P>
          <BulletList T={T} accent={accent} items={[
            "Access — request a copy of all data we hold about you.",
            "Correction — ask us to fix inaccurate data.",
            "Deletion — request that all your personal data be permanently erased.",
            "Portability — receive your data in a structured, machine-readable format.",
            "Objection — object to how we process your data.",
          ]}/>
          <P T={T}>To exercise any of these rights, email us at <span style={{color:accent,fontFamily:"'JetBrains Mono',monospace"}}>work.codejourney@gmail.com</span>. We will respond within 30 days.</P>
        </Section>

        <Section T={T}>
          <H2 accent={accent} T={T}>Security</H2>
          <P T={T}>We use HTTPS for all data transmission, bcrypt hashing for all passwords, and access controls to ensure only authorised personnel can access production data. No system is perfectly secure — if you discover a vulnerability, please disclose it responsibly to <span style={{color:accent,fontFamily:"'JetBrains Mono',monospace"}}>work.codejourney@gmail.com</span>.</P>
        </Section>

        <Section T={T} alt>
          <H2 accent={accent} T={T}>Changes to This Policy</H2>
          <P T={T}>If we make material changes to this policy, we will notify you via email and display a notice on the platform at least 14 days before the change takes effect. The "Last updated" date at the top of this page reflects the most recent revision.</P>
        </Section>

        <ContactStrip T={T}/>
      </div>
    </>
  );
}

/* ══════════════════════════════════════════════════════════════
   TERMS & CONDITIONS
══════════════════════════════════════════════════════════════ */
export function Terms() {
  const T = useTheme();
  const accent = T.gold;
  return (
    <>
      <style>{sharedStyles(T)}</style>
      <div style={{minHeight:"100vh",background:T.shell,color:T.t1}}>

        <PageHero
          icon={FileText} pill="Terms & Conditions"
          title="Terms of Service"
          subtitle="Please read these terms before using Code Journey. They are written to be clear, not deliberately complex."
          accent={accent} T={T} updated="April 2026"
        />

        <Section T={T}>
          <H2 accent={accent} T={T}>Acceptance of Terms</H2>
          <P T={T}>By creating an account or using any part of Code Journey, you agree to these Terms of Service. If you do not agree, please do not use the platform. These terms apply to all visitors, registered users and anyone who accesses or uses any part of the Code Journey service.</P>
        </Section>

        <Section T={T} alt>
          <H2 accent={accent} T={T}>Eligibility</H2>
          <P T={T}>Code Journey is open to anyone aged 13 or older. If you are under 18, you should review these terms with a parent or guardian. By using the platform you confirm that the information you provide during registration is accurate.</P>
        </Section>

        <Section T={T}>
          <H2 accent={accent} T={T}>Your Account</H2>
          <BulletList T={T} accent={accent} items={[
            "You are responsible for maintaining the confidentiality of your account credentials.",
            "You are responsible for all activity that occurs under your account.",
            "You must notify us immediately at work.codejourney@gmail.com if you suspect unauthorised access to your account.",
            "We reserve the right to suspend or terminate accounts that violate these terms.",
            "One account per person. Creating multiple accounts to gain unfair advantages on leaderboards is prohibited.",
          ]}/>
        </Section>

        <Section T={T} alt>
          <H2 accent={accent} T={T}>Acceptable Use</H2>
          <P T={T}>You agree not to use Code Journey to:</P>
          <BulletList T={T} accent={T.red} items={[
            "Upload, share or execute malicious code, malware or exploits.",
            "Attempt to reverse-engineer, bypass or interfere with the sandboxed execution environment.",
            "Scrape, harvest or systematically collect data from the platform using automated means.",
            "Impersonate another user or Code Journey staff.",
            "Use the platform for commercial tutoring or course creation without written permission.",
            "Engage in any activity that disrupts the service for other users.",
          ]}/>
          <Callout icon={Shield} color={accent} T={T}
            text="Code Journey is a learning environment. Keep it that way. Abusive behaviour, harassment of other users, or attempts to game the XP/streak system will result in immediate account termination."/>
        </Section>

        <Section T={T}>
          <H2 accent={accent} T={T}>Intellectual Property</H2>
          <P T={T}>All content on Code Journey — including exercise descriptions, platform copy, UI design, the Code Journey IDE interface, and the CJ brand assets — is owned by Code Journey and protected by applicable intellectual property law. You may not reproduce, distribute or create derivative works from platform content without explicit written permission.</P>
          <P T={T}>Code you write in the IDE is yours. We do not claim ownership of the solutions, scripts or programmes you create while using the platform.</P>
        </Section>

        <Section T={T} alt>
          <H2 accent={accent} T={T}>Third-Party Services</H2>
          <P T={T}>Code Journey uses a small number of third-party services to operate — including email delivery infrastructure and the WebAssembly execution runtime. These services process data only as necessary to provide their function and are contractually bound to handle your data in accordance with our Privacy Policy. We are not responsible for the content or practices of any third-party websites linked from the platform.</P>
        </Section>

        <Section T={T}>
          <H2 accent={accent} T={T}>Availability and Changes</H2>
          <P T={T}>We aim for the platform to be available at all times but cannot guarantee uninterrupted access. We may modify, suspend or discontinue any feature at any time. For significant changes that affect your core experience, we will provide reasonable advance notice.</P>
        </Section>

        <Section T={T} alt>
          <H2 accent={accent} T={T}>Disclaimers and Limitation of Liability</H2>
          <P T={T}>Code Journey is provided "as is" without warranty of any kind. We do not guarantee that the platform will meet your requirements or that learning outcomes will match your expectations — learning is a personal process that depends on your effort and circumstances.</P>
          <P T={T}>To the maximum extent permitted by law, Code Journey shall not be liable for any indirect, incidental, special or consequential damages arising from your use of the platform.</P>
        </Section>

        <Section T={T}>
          <H2 accent={accent} T={T}>Account Termination</H2>
          <P T={T}>You may delete your account at any time from the Profile page. We may suspend or terminate accounts that violate these terms, with or without prior notice depending on the severity of the violation. On termination, your right to use the platform ceases immediately. Personal data is deleted as described in the Privacy Policy.</P>
        </Section>

        <Section T={T} alt>
          <H2 accent={accent} T={T}>Changes to These Terms</H2>
          <P T={T}>We may update these terms from time to time. When we do, we will update the "Last updated" date above and, for material changes, notify you via email at least 14 days before the new terms take effect. Continuing to use the platform after that date constitutes acceptance of the revised terms.</P>
        </Section>

        <Section T={T}>
          <H2 accent={accent} T={T}>Governing Law</H2>
          <P T={T}>These terms are governed by and construed in accordance with applicable law. If any provision of these terms is found to be invalid or unenforceable, the remaining provisions shall continue in full force and effect.</P>
          <P T={T}>For any questions about these terms, contact us at <span style={{color:accent,fontFamily:"'JetBrains Mono',monospace"}}>work.codejourney@gmail.com</span>.</P>
        </Section>

        <ContactStrip T={T}/>
      </div>
    </>
  );
}

/* ══════════════════════════════════════════════════════════════
   LICENSING
══════════════════════════════════════════════════════════════ */
export function Licensing() {
  const T = useTheme();
  const accent = "#f97316";

  const licenseBlocks = [
    {
      title:"Platform Content",
      icon:BookOpen,
      color:"#7c6ee0",
      type:"Proprietary",
      summary:"All Code Journey platform content, exercises, explanations, brand assets and UI design are proprietary and copyrighted by Code Journey.",
      allowed:[
        "Personal, non-commercial use of the learning content on the platform.",
        "Quoting brief passages for educational discussion with attribution.",
        "Sharing screenshots or recordings of your own code running on the platform.",
      ],
      notAllowed:[
        "Reproducing exercises or explanations on other websites or platforms.",
        "Selling, sublicensing or redistributing any platform content.",
        "Creating competing services based on platform content.",
        "Removing copyright notices or attributions.",
      ],
    },
    {
      title:"Your Code",
      icon:Globe,
      color:"#5eead4",
      type:"Yours",
      summary:"Code you write in the Code Journey IDE is entirely your intellectual property. We make no claim over solutions, scripts or programmes you create while using the platform.",
      allowed:[
        "Use your solutions for any personal or commercial project.",
        "Publish your code on GitHub, portfolio sites or anywhere else.",
        "Build commercial products using code you wrote on CJ.",
        "Share your solutions freely with others.",
      ],
      notAllowed:[],
    },
    // {
    //   title:"Open Source Components",
    //   icon:Database,
    //   color:accent,
    //   type:"Mixed Open Source",
    //   summary:"Code Journey is built using open source software. We gratefully acknowledge the following licences under which those components are used.",
    //   allowed:[],
    //   notAllowed:[],
    //   table:[
    //     { name:"React",           license:"MIT",        use:"UI framework"             },
    //     { name:"Framer Motion",   license:"MIT",        use:"Animations"               },
    //     { name:"GSAP",            license:"Standard",   use:"Header animations"        },
    //     { name:"Lucide React",    license:"ISC",        use:"Icon system"              },
    //     { name:"Material-UI",     license:"MIT",        use:"Dialog components"        },
    //     { name:"Tailwind CSS",    license:"MIT",        use:"Utility CSS"              },
    //     { name:"React Router",    license:"MIT",        use:"Client routing"           },
    //     { name:"WebAssembly",     license:"Apache 2.0", use:"Sandboxed code execution" },
    //     { name:"JetBrains Mono",  license:"OFL 1.1",    use:"Code editor font"         },
    //     { name:"Syne",            license:"OFL 1.1",    use:"UI display font"          },
    //     { name:"Lora",            license:"OFL 1.1",    use:"Body & editorial font"    },
    //   ],
    // },
    {
      title:"Trademark",
      icon:Scale,
      color:T.gold,
      type:"Trademark",
      summary:"The Code Journey name, CJ logo mark, and associated brand assets are trademarks of Code Journey. They may not be used without written permission.",
      allowed:[
        "Referring to Code Journey by name in editorial or educational content.",
        "Linking to codejourney.dev from your website or blog.",
        "Mentioning CJ as a tool you use in your portfolio or resume.",
      ],
      notAllowed:[
        "Using the CJ logo mark in your own projects, apps or promotional material.",
        "Creating merchandise featuring the Code Journey name or logo.",
        "Registering domain names, social handles or company names that include 'Code Journey'.",
      ],
    },
  ];

  return (
    <>
      <style>{sharedStyles(T)}</style>
      <div style={{minHeight:"100vh",background:T.shell,color:T.t1}}>

        <PageHero
          icon={Scale} pill="Licensing"
          title="Licensing & Usage Rights"
          subtitle="What you can do with Code Journey's content, your own code, and the open source components we use."
          accent={accent} T={T} updated="April 2026"
        />

        {licenseBlocks.map((block, bi) => (
          <Section key={block.title} T={T} alt={bi%2===1}>
            <motion.div initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}}
              viewport={{once:true}} transition={{duration:0.5}}>

              {/* Block header */}
              <div style={{
                display:"flex",alignItems:"center",gap:14,marginBottom:22,flexWrap:"wrap",
              }}>
                <div style={{
                  width:44,height:44,borderRadius:12,
                  background:`${block.color}16`,border:`1px solid ${block.color}30`,
                  display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,
                }}>
                  <block.icon size={20} color={block.color}/>
                </div>
                <div>
                  <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
                    <h2 style={{
                      fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:20,
                      color:T.t1,margin:0,letterSpacing:"-0.2px",
                    }}>{block.title}</h2>
                    <span style={{
                      fontFamily:"'JetBrains Mono',monospace",fontSize:10,fontWeight:700,
                      padding:"2px 9px",borderRadius:4,letterSpacing:"0.5px",
                      background:`${block.color}14`,color:block.color,border:`1px solid ${block.color}30`,
                    }}>{block.type}</span>
                  </div>
                </div>
              </div>

              <div style={{
                height:2,width:40,borderRadius:2,background:block.color,
                opacity:0.6,marginBottom:20,
              }}/>

              <P T={T}>{block.summary}</P>

              {/* Allowed / Not Allowed split */}
              {(block.allowed.length > 0 || block.notAllowed.length > 0) && (
                <div style={{
                  display:"grid",
                  gridTemplateColumns:block.notAllowed.length===0?"1fr":"1fr 1fr",
                  gap:16,marginTop:8,
                }}>
                  {block.allowed.length > 0 && (
                    <div style={{
                      background:`${T.green}08`,border:`1px solid ${T.green}28`,
                      borderRadius:12,padding:"18px 16px",
                    }}>
                      <div style={{
                        display:"flex",alignItems:"center",gap:6,marginBottom:12,
                      }}>
                        <CheckCircle2 size={14} color={T.green}/>
                        <span style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:13,color:T.green}}>Permitted</span>
                      </div>
                      <div style={{display:"flex",flexDirection:"column",gap:8}}>
                        {block.allowed.map((item,i)=>(
                          <div key={i} style={{display:"flex",gap:8,alignItems:"flex-start"}}>
                            <span style={{color:T.green,fontSize:12,flexShrink:0,marginTop:2}}>✓</span>
                            <span style={{fontFamily:"'Lora',serif",fontSize:14,color:T.t2,lineHeight:1.65}}>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {block.notAllowed.length > 0 && (
                    <div style={{
                      background:`${T.red}08`,border:`1px solid ${T.red}28`,
                      borderRadius:12,padding:"18px 16px",
                    }}>
                      <div style={{
                        display:"flex",alignItems:"center",gap:6,marginBottom:12,
                      }}>
                        <XCircle size={14} color={T.red}/>
                        <span style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:13,color:T.red}}>Not Permitted</span>
                      </div>
                      <div style={{display:"flex",flexDirection:"column",gap:8}}>
                        {block.notAllowed.map((item,i)=>(
                          <div key={i} style={{display:"flex",gap:8,alignItems:"flex-start"}}>
                            <span style={{color:T.red,fontSize:12,flexShrink:0,marginTop:2}}>✗</span>
                            <span style={{fontFamily:"'Lora',serif",fontSize:14,color:T.t2,lineHeight:1.65}}>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Open source table */}
              {block.table && (
                <div style={{
                  marginTop:20,border:`1px solid ${T.b2}`,
                  borderRadius:12,overflow:"hidden",
                }}>
                  {/* Table header */}
                  <div style={{
                    display:"grid",gridTemplateColumns:"1fr 1fr 2fr",
                    background:T.panel,borderBottom:`1px solid ${T.b1}`,
                    padding:"10px 16px",
                  }}>
                    {["Package","Licence","Used For"].map(h=>(
                      <span key={h} style={{
                        fontFamily:"'JetBrains Mono',monospace",fontSize:10,fontWeight:700,
                        color:T.t3,textTransform:"uppercase",letterSpacing:"1px",
                      }}>{h}</span>
                    ))}
                  </div>
                  {block.table.map((row,i)=>(
                    <div key={i} style={{
                      display:"grid",gridTemplateColumns:"1fr 1fr 2fr",
                      padding:"11px 16px",
                      background:i%2===0?T.card:T.panel,
                      borderBottom:i<block.table.length-1?`1px solid ${T.b1}`:"none",
                    }}>
                      <span style={{fontFamily:"'Syne',sans-serif",fontWeight:600,fontSize:13.5,color:T.t1}}>{row.name}</span>
                      <span style={{
                        fontFamily:"'JetBrains Mono',monospace",fontSize:11,
                        color:block.color,fontWeight:600,
                      }}>{row.license}</span>
                      <span style={{fontFamily:"'Lora',serif",fontSize:13.5,color:T.t2}}>{row.use}</span>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </Section>
        ))}

        {/* Full attribution notice */}
        <Section T={T} alt>
          <Callout icon={Zap} color={accent} T={T}
            text="Full attribution notices and licence texts for all open source dependencies are available in the platform repository. If you believe we have omitted or incorrectly attributed any component, please email work.codejourney@gmail.com and we will correct it promptly."/>
          <P T={T}>For licensing enquiries — including permission to use Code Journey content in educational settings, media, or derivative works — please email <span style={{color:accent,fontFamily:"'JetBrains Mono',monospace"}}>work.codejourney@gmail.com</span> with the subject line <span style={{color:T.t1,fontFamily:"'JetBrains Mono',monospace"}}>[Licensing Enquiry]</span>. We respond to all licensing requests within 5 business days.</P>
        </Section>

        <ContactStrip T={T}/>
      </div>
    </>
  );
}

/* Default export — re-exports all four for convenience */
export default { FAQ, Privacy, Terms, Licensing };