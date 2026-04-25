/**
 * Code Journey - About Us
 *
 * Theme syncs with the platform theme via localStorage + CSS variables
 * (same strategy as Home.jsx and Profile.jsx).
 */

import React, { useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import {
  ArrowRight, Compass, Layers, Zap, BookOpen, Users,
  Map, Brain, Sparkles, Code2, Star, Heart, Target,
  ChevronDown, Globe, Terminal, Lightbulb, Shield,
} from "lucide-react";

/* ══════════════════════════════════════════════════════════════
   THEME SYSTEM (mirrors Home.jsx / Profile.jsx)
══════════════════════════════════════════════════════════════ */
const THEMES = {
  cosmos: {
    shell:"#07080d", deep:"#0c0e18", mid:"#111420", surface:"#161927",
    panel:"#1a1e2e", hover:"#1e2335", card:"#161927",
    t1:"#e8eaf2", t2:"#8892b0", t3:"#5a6488", t4:"#2e3660",
    b1:"rgba(120,130,180,0.08)", b2:"rgba(120,130,180,0.15)",
    accent:"#7c6ee0", accentS:"rgba(124,110,224,0.14)",
    teal:"#5eead4", green:"#22c55e", red:"#f87171", gold:"#fbbf24",
  },
  // void: {
  //   shell:"#000000", deep:"#050507", mid:"#0a0a0f", surface:"#0f0f15",
  //   panel:"#141419", hover:"#1a1a22", card:"#0f0f15",
  //   t1:"#f0f0ff", t2:"#9090b8", t3:"#505070", t4:"#252540",
  //   b1:"rgba(100,100,200,0.08)", b2:"rgba(100,100,200,0.14)",
  //   accent:"#8b7ff0", accentS:"rgba(139,127,240,0.14)",
  //   teal:"#2dd4bf", green:"#34d399", red:"#fc8181", gold:"#fcd34d",
  // },
  // aurora: {
  //   shell:"#040e0e", deep:"#071414", mid:"#0b1c1c", surface:"#102424",
  //   panel:"#142a2a", hover:"#1a3333", card:"#102424",
  //   t1:"#e0f5f5", t2:"#7ab8b8", t3:"#3d7878", t4:"#1e4444",
  //   b1:"rgba(80,200,180,0.08)", b2:"rgba(80,200,180,0.15)",
  //   accent:"#2dd4bf", accentS:"rgba(45,212,191,0.14)",
  //   teal:"#5eead4", green:"#4ade80", red:"#f87171", gold:"#fbbf24",
  // },
  // nord: {
  //   shell:"#1a1f2e", deep:"#1e2535", mid:"#232c40", surface:"#28334a",
  //   panel:"#2d3a50", hover:"#344260", card:"#28334a",
  //   t1:"#eceff4", t2:"#9ba8c0", t3:"#5c6a88", t4:"#3a4560",
  //   b1:"rgba(136,192,208,0.1)", b2:"rgba(136,192,208,0.18)",
  //   accent:"#88c0d0", accentS:"rgba(136,192,208,0.14)",
  //   teal:"#8fbcbb", green:"#a3be8c", red:"#bf616a", gold:"#ebcb8b",
  // },
  light: {
    shell:"#f3f4f8", deep:"#ffffff", mid:"#f0f1f7", surface:"#ffffff",
    panel:"#f7f8fc", hover:"#eef0f8", card:"#ffffff",
    t1:"#111827", t2:"#4b5680", t3:"#7c87a8", t4:"#c5ccdf",
    b1:"rgba(80,90,150,0.08)", b2:"rgba(80,90,150,0.15)",
    accent:"#6256d0", accentS:"rgba(98,86,208,0.1)",
    teal:"#0d9488", green:"#16a34a", red:"#dc2626", gold:"#d97706",
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
  .forEach(([k,v]) => r.style.setProperty(k,v));
};

/* ══════════════════════════════════════════════════════════════
   REVEAL WRAPPER
══════════════════════════════════════════════════════════════ */
const Reveal = ({ children, delay=0, y=28, x=0, once=true }) => (
  <motion.div
    initial={{ opacity:0, y, x }}
    whileInView={{ opacity:1, y:0, x:0 }}
    viewport={{ once, margin:"-60px" }}
    transition={{ duration:0.65, delay, ease:[0.22,1,0.36,1] }}>
    {children}
  </motion.div>
);

/* ══════════════════════════════════════════════════════════════
   DECORATIVE GRID BG
══════════════════════════════════════════════════════════════ */
const GridBg = ({ T, masked = true }) => (
  <div style={{
    position:"absolute", inset:0, pointerEvents:"none",
    backgroundImage:`linear-gradient(${T.b1} 1px, transparent 1px), linear-gradient(90deg, ${T.b1} 1px, transparent 1px)`,
    backgroundSize:"52px 52px",
    maskImage: masked
      ? "radial-gradient(ellipse 80% 60% at 50% 40%, black 30%, transparent 100%)"
      : undefined,
    opacity: 0.7,
  }}/>
);

/* ══════════════════════════════════════════════════════════════
   FLOATING CODE TOKENS (hero dressing)
══════════════════════════════════════════════════════════════ */
const TOKENS = ["beginner","import","learn","build","const","explore","fn ","roadmap","if(confused)","grow","{ }","=>","pick a track"];
const FloatingTokens = ({ T }) => {
  const pts = useRef(Array.from({length:14},(_,i)=>({
    id:i, sym:TOKENS[i%TOKENS.length],
    x:5+Math.random()*90, y:5+Math.random()*90,
    size:10+Math.random()*4, dur:18+Math.random()*18,
    delay:Math.random()*10, op:0.04+Math.random()*0.08,
  }))).current;
  return (
    <div style={{position:"absolute",inset:0,overflow:"hidden",pointerEvents:"none"}}>
      {pts.map(p=>(
        <motion.span key={p.id}
          initial={{y:0,opacity:p.op}}
          animate={{y:[-12,12,-12],opacity:[p.op,p.op*1.7,p.op]}}
          transition={{duration:p.dur,delay:p.delay,repeat:Infinity,ease:"easeInOut"}}
          style={{
            position:"absolute",left:`${p.x}%`,top:`${p.y}%`,
            fontFamily:"'JetBrains Mono',monospace",fontSize:p.size,
            color:T.accent,userSelect:"none",whiteSpace:"nowrap",
          }}>
          {p.sym}
        </motion.span>
      ))}
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════
   STAT COUNTER
══════════════════════════════════════════════════════════════ */
const StatCounter = ({ value, label, color, icon:Icon, T }) => (
  <motion.div
    initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}}
    viewport={{once:true}} transition={{duration:0.5}}
    style={{
      display:"flex",flexDirection:"column",alignItems:"center",
      gap:8,padding:"24px 16px",textAlign:"center",
    }}>
    <div style={{
      width:48,height:48,borderRadius:14,
      background:`${color}16`,border:`1px solid ${color}30`,
      display:"flex",alignItems:"center",justifyContent:"center",marginBottom:4,
    }}>
      <Icon size={20} color={color}/>
    </div>
    <span style={{
      fontFamily:"'Syne',sans-serif",fontWeight:800,
      fontSize:"clamp(28px,4vw,42px)",color:color,lineHeight:1,letterSpacing:"-1px",
    }}>{value}</span>
    <span style={{
      fontFamily:"'JetBrains Mono',monospace",fontSize:11,
      color:T.t3,textTransform:"uppercase",letterSpacing:"1.5px",
    }}>{label}</span>
  </motion.div>
);

/* ══════════════════════════════════════════════════════════════
   PRINCIPLE CARD
══════════════════════════════════════════════════════════════ */
const PrincipleCard = ({ icon:Icon, title, body, color, T, index }) => {
  const [hov,setHov]=useState(false);
  return (
    <Reveal delay={index*0.08} y={20}>
      <div
        onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
        style={{
          background:T.card,border:`1px solid ${hov ? color+"44" : T.b1}`,
          borderRadius:18,padding:"28px 24px",
          transition:"all 0.22s cubic-bezier(0.4,0,0.2,1)",
          transform:hov?"translateY(-5px)":"translateY(0)",
          boxShadow:hov?`0 16px 48px ${color}12`:"none",
          position:"relative",overflow:"hidden",
          display:"flex",flexDirection:"column",gap:14,
        }}>
        {/* Background blob */}
        <div style={{
          position:"absolute",right:-20,top:-20,width:100,height:100,
          borderRadius:"50%",
          background:`radial-gradient(ellipse, ${color}14 0%, transparent 70%)`,
          pointerEvents:"none",transition:"opacity 0.22s",
          opacity:hov?1:0.4,
        }}/>
        {/* Top accent bar */}
        <div style={{
          position:"absolute",top:0,left:0,right:0,height:2,
          background:color,borderRadius:"18px 18px 0 0",
          opacity:hov?0.8:0.25,transition:"opacity 0.22s",
        }}/>
        <div style={{
          width:44,height:44,borderRadius:12,
          background:`${color}16`,border:`1px solid ${color}30`,
          display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,
        }}>
          <Icon size={20} color={color}/>
        </div>
        <h3 style={{
          fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:17,
          color:T.t1,margin:0,letterSpacing:"-0.2px",lineHeight:1.25,
        }}>{title}</h3>
        <p style={{
          fontFamily:"'Lora',serif",fontSize:14.5,
          color:T.t2,lineHeight:1.78,margin:0,
        }}>{body}</p>
      </div>
    </Reveal>
  );
};

/* ══════════════════════════════════════════════════════════════
   TIMELINE STEP
══════════════════════════════════════════════════════════════ */
const TimelineStep = ({ step, isLast, T }) => {
  const [hov,setHov]=useState(false);
  return (
    <Reveal delay={step.index*0.1} x={step.index%2===0 ? -20 : 20}>
      <div style={{display:"flex",gap:0,alignItems:"stretch"}}>
        {/* Left: number + line */}
        <div style={{
          display:"flex",flexDirection:"column",alignItems:"center",
          paddingRight:24,flexShrink:0,
        }}>
          <div style={{
            width:48,height:48,borderRadius:"50%",flexShrink:0,
            background:hov?`${step.color}22`:T.panel,
            border:`1.5px solid ${hov?step.color:T.b2}`,
            display:"flex",alignItems:"center",justifyContent:"center",
            transition:"all 0.2s",zIndex:1,
          }}>
            <span style={{
              fontFamily:"'JetBrains Mono',monospace",fontSize:13,fontWeight:700,
              color:step.color,opacity:hov?1:0.7,transition:"opacity 0.2s",
            }}>{step.n}</span>
          </div>
          {!isLast && (
            <div style={{
              width:1,flex:1,minHeight:40,marginTop:8,
              background:`linear-gradient(to bottom, ${step.color}60, transparent)`,
            }}/>
          )}
        </div>

        {/* Right: content */}
        <div
          onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
          style={{
            flex:1,paddingBottom:isLast?0:40,paddingTop:8,
          }}>
          <div style={{
            display:"flex",alignItems:"center",gap:10,marginBottom:8,flexWrap:"wrap",
          }}>
            <span style={{
              fontFamily:"'JetBrains Mono',monospace",fontSize:10,fontWeight:700,
              padding:"2px 8px",borderRadius:5,
              background:`${step.color}18`,color:step.color,
              border:`1px solid ${step.color}30`,letterSpacing:"0.5px",
            }}>{step.tag}</span>
          </div>
          <h3 style={{
            fontFamily:"'Syne',sans-serif",fontWeight:700,
            fontSize:"clamp(17px,2.5vw,21px)",color:T.t1,
            marginBottom:10,letterSpacing:"-0.3px",lineHeight:1.2,
          }}>{step.title}</h3>
          <p style={{
            fontFamily:"'Lora',serif",fontSize:15.5,
            color:T.t2,lineHeight:1.82,
          }}>{step.body}</p>
        </div>
      </div>
    </Reveal>
  );
};

/* ══════════════════════════════════════════════════════════════
   PROBLEM / SOLUTION SPLIT CARD
══════════════════════════════════════════════════════════════ */
const ProblemSolution = ({ T }) => {
  const problems = [
    "Hundreds of tutorials, zero clear starting point",
    "Documentation written for people who already know",
    "No guidance on which tech stack actually fits you",
    "Beginners quit because they feel permanently confused",
    "The gap between 'hello world' and a real project feels infinite",
  ];
  const solutions = [
    "Curated, minimal information - only what you actually need first",
    "Plain-language explanations using real-world analogies",
    "Track system that maps your interest to a specific learning path",
    "Micro-wins and XP every step to keep momentum alive",
    "A structured bridge: exercises before the scary real projects",
  ];
  return (
    <div style={{display:"grid",gridTemplateColumns:"2fr 2fr",gap:30}}>
      {/* Problem */}
      <Reveal x={-20}>
        <div style={{
          background:T.card,border:`1px solid ${T.red}28`,
          borderRadius:18,padding:"28px 26px",
          borderTop:`3px solid ${T.red}`,
        }}>
          <div style={{display:"flex",alignItems:"center",gap:9,marginBottom:20}}>
            <div style={{
              width:32,height:32,borderRadius:9,
              background:`${T.red}16`,border:`1px solid ${T.red}30`,
              display:"flex",alignItems:"center",justifyContent:"center",
            }}>
              <span style={{fontSize:16}}>✗</span>
            </div>
            <h3 style={{
              fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:16,
              color:T.red,margin:0,letterSpacing:"-0.2px",
            }}>The Problem Today</h3>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:11}}>
            {problems.map((p,i)=>(
              <div key={i} style={{display:"flex",gap:10,alignItems:"flex-start"}}>
                <div style={{
                  width:18,height:18,borderRadius:"50%",flexShrink:0,
                  background:`${T.red}14`,border:`1px solid ${T.red}35`,
                  display:"flex",alignItems:"center",justifyContent:"center",marginTop:1,
                }}>
                  <span style={{fontSize:10,color:T.red,fontWeight:700}}>✗</span>
                </div>
                <p style={{
                  fontFamily:"'Lora',serif",fontSize:14,
                  color:T.t2,lineHeight:1.65,margin:0,
                }}>{p}</p>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      {/* Solution */}
      <Reveal x={20}>
        <div style={{
          background:T.card,border:`1px solid ${T.green}28`,
          borderRadius:18,padding:"28px 26px",
          borderTop:`3px solid ${T.green}`,
        }}>
          <div style={{display:"flex",alignItems:"center",gap:9,marginBottom:20}}>
            <div style={{
              width:32,height:32,borderRadius:9,
              background:`${T.green}16`,border:`1px solid ${T.green}30`,
              display:"flex",alignItems:"center",justifyContent:"center",
            }}>
              <span style={{fontSize:16}}>✓</span>
            </div>
            <h3 style={{
              fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:16,
              color:T.green,margin:0,letterSpacing:"-0.2px",
            }}>The CJ Way</h3>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:11}}>
            {solutions.map((s,i)=>(
              <div key={i} style={{display:"flex",gap:10,alignItems:"flex-start"}}>
                <div style={{
                  width:18,height:18,borderRadius:"50%",flexShrink:0,
                  background:`${T.green}14`,border:`1px solid ${T.green}35`,
                  display:"flex",alignItems:"center",justifyContent:"center",marginTop:1,
                }}>
                  <span style={{fontSize:10,color:T.green,fontWeight:700}}>✓</span>
                </div>
                <p style={{
                  fontFamily:"'Lora',serif",fontSize:14,
                  color:T.t2,lineHeight:1.65,margin:0,
                }}>{s}</p>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════
   SECTION LABEL (reusable pill + heading pattern)
══════════════════════════════════════════════════════════════ */
const SectionLabel = ({ icon:Icon, pill, heading, sub, color, T, center=false }) => (
  <div style={{
    textAlign:center?"center":"left",
    marginBottom:56,
    display:"flex",flexDirection:"column",
    alignItems:center?"center":"flex-start",
    gap:14,
  }}>
    <div style={{
      display:"inline-flex",alignItems:"center",gap:7,
      padding:"4px 14px",borderRadius:100,
      background:`${color}14`,border:`1px solid ${color}40`,
    }}>
      <Icon size={12} color={color}/>
      <span style={{
        fontFamily:"'JetBrains Mono',monospace",fontSize:10,fontWeight:700,
        color:color,letterSpacing:"1.8px",textTransform:"uppercase",
      }}>{pill}</span>
    </div>
    <h2 style={{
      fontFamily:"'Syne',sans-serif",fontWeight:800,
      fontSize:"clamp(28px,4vw,46px)",
      color:T.t1,margin:0,letterSpacing:"-0.8px",
      lineHeight:1.12,maxWidth:center?"none":600,
    }}>{heading}</h2>
    {sub&&(
      <p style={{
        fontFamily:"'Lora',serif",fontStyle:"italic",fontSize:17,
        color:T.t2,lineHeight:1.8,
        maxWidth:center?520:"none",margin:0,
      }}>{sub}</p>
    )}
    <div style={{
      height:3,width:44,borderRadius:2,background:color,opacity:0.7,
      marginTop:4,
    }}/>
  </div>
);

/* ══════════════════════════════════════════════════════════════
   MANIFESTO QUOTE BLOCK
══════════════════════════════════════════════════════════════ */
const ManifestoQuote = ({ T }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target:ref, offset:["start end","end start"] });
  const opacity = useTransform(scrollYProgress,[0.1,0.4,0.8,1],[0,1,1,0.3]);
  const scale   = useTransform(scrollYProgress,[0.1,0.4],[0.96,1]);
  return (
    <motion.div ref={ref} style={{opacity,scale}}
      className="manifesto-wrap">
      <div style={{
        position:"relative",overflow:"hidden",
        background:`linear-gradient(135deg, ${T.accent}0a 0%, ${T.teal}06 50%, transparent 100%)`,
        border:`1px solid ${T.b2}`,
        borderLeft:`4px solid ${T.accent}`,
        borderRadius:"0 18px 18px 0",
        padding:"40px 40px 40px 44px",
      }}>
        {/* Large quote mark */}
        <div style={{
          position:"absolute",top:-10,left:16,
          fontFamily:"'Lora',serif",fontSize:120,lineHeight:1,
          color:T.accent,opacity:0.08,fontStyle:"italic",
          userSelect:"none",pointerEvents:"none",
        }}>"</div>

        <p style={{
          fontFamily:"'Lora',serif",fontStyle:"italic",
          fontSize:"clamp(18px,2.5vw,24px)",
          color:T.t1,lineHeight:1.75,
          position:"relative",margin:0,letterSpacing:"0.01em",
        }}>
          Code Journey{" "}
          <span style={{color:T.accent,fontStyle:"normal",fontWeight:700}}>
            minimises the gap
          </span>{" "}
          between beginners and the existing clustered, scattered ocean of data -
          by giving only the required and needed information about a resource,
          then recommending a tutorial or practice session{" "}
          <span style={{color:T.teal,fontStyle:"normal",fontWeight:700}}>
            before jumping into the confusing solutions
          </span>{" "}
          already out there in the market.
        </p>
        <div style={{
          marginTop:20,display:"flex",alignItems:"center",gap:10,
        }}>
          <div style={{
            width:32,height:32,borderRadius:9,
            background:`linear-gradient(135deg,${T.accent},${T.teal})`,
            display:"flex",alignItems:"center",justifyContent:"center",
            fontSize:12,fontWeight:800,color:"#fff",fontFamily:"'Syne',sans-serif",
          }}>CJ</div>
          <div>
            <p style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:13,color:T.t1,margin:0}}>Code Journey</p>
            <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10.5,color:T.t3,margin:0}}>Platform Mission</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

/* ══════════════════════════════════════════════════════════════
   MAIN
══════════════════════════════════════════════════════════════ */
export default function About() {
  const [T, setT] = useState(getTheme());

  /* Theme sync */
  useEffect(() => {
    applyToDom(T);
    const iv = setInterval(() => {
      const fresh = getTheme();
      if (fresh.accent !== T.accent) { setT(fresh); applyToDom(fresh); }
    }, 500);
    return () => clearInterval(iv);
  }, [T]);
  useEffect(() => {
    const fn = () => { const f = getTheme(); setT(f); applyToDom(f); };
    window.addEventListener("storage", fn);
    return () => window.removeEventListener("storage", fn);
  }, []);

  /* DATA */
  const principles = [
    { icon:Compass,   color:"#7c6ee0", title:"Clarity Before Depth",
      body:"We don't teach everything at once. We teach what matters first. Every explanation is trimmed to what a beginner actually needs at that stage - no more, no less." },
    { icon:Map,       color:"#5eead4", title:"Direction, Not Dumping",
      body:"The internet has unlimited information about code. Code Journey has curated, opinionated paths. We tell you which road to take before handing you the map." },
    { icon:Lightbulb, color:"#fbbf24", title:"Try Before You Theorise",
      body:"We recommend building something tiny before reading the docs. Hands-on output first, conceptual depth second. That's the order that makes knowledge stick." },
    { icon:Target,    color:"#22c55e", title:"Fit, Then Expertise",
      body:"Spending a year deep in the wrong stack is costly. CJ helps you discover your fit - web, app, or data - before you commit your full energy to mastering it." },
    { icon:Heart,     color:"#ec4899", title:"Beginner-First, Always",
      body:"Every word on this platform is written as if the reader just googled 'how to learn coding' for the very first time. No assumed knowledge, ever." },
    { icon:Shield,    color:"#f97316", title:"Safe to Be Confused",
      body:"Confusion is not failure - it is the normal state of learning. Code Journey is designed so that confusion is a signal to go slower, not a reason to quit." },
  ];

  const timelineSteps = [
    { index:0, n:"01", tag:"Discover", color:"#7c6ee0",
      title:"Pick a direction that excites you",
      body:"Before writing a single line of code, you explore the three career tracks - Web Development, App Development and Data Science. You watch short introductions, read plain-language descriptions, and choose the one that genuinely interests you. No pressure to be certain. You can always change tracks." },
    { index:1, n:"02", tag:"Learn Lightly", color:"#5eead4",
      title:"Get comfortable with the fundamentals",
      body:"Once you have a track, CJ introduces the language and concepts that power it - using real-life analogies, not academic definitions. You learn only what is essential for a beginner in that track. Everything else is marked as 'optional depth' that you can explore when you are ready." },
    // { index:2, n:"03", tag:"Build Something", color:"#fbbf24",
    //   title:"Write code inside the browser, immediately",
    //   body:"The Code Journey IDE is built into the platform. No downloads. No environment setup. No Stack Overflow rabbit holes. You write real code, run it, and see output in the same window. Small, satisfying exercises confirm that you actually understand what you just learned." },
    // { index:3, n:"04", tag:"AI Guidance", color:"#22c55e",
    //   title:"Get unstuck without being given the answer",
    //   body:"The built-in AI Tutor reads your current code, your exercise and your test results. It gives progressive hints - nudging you toward the solution without spoiling it. You solve problems. You earn understanding, not just answers." },
    { index:2, n:"03", tag:"Grow", color:"#ec4899",
      title:"Build consistency with streaks and XP",
      body:"Short daily sessions beat occasional long ones. Streaks, XP rewards and a five-tier level system make showing up each day feel meaningful. The platform rewards habit, not just completion. By the time you finish a track, you are ready to engage with the larger ecosystem - frameworks, tools, deep documentation - without being overwhelmed by it." },
  ];

  const stats = [
    { value:"10",   label:"Languages",     color:"#7c6ee0", icon:Code2    },
    { value:"3",   label:"Career Tracks", color:"#5eead4", icon:Layers   },
    { value:"50+", label:"Snippets",     color:"#fbbf24", icon:BookOpen  },
    { value:"0",   label:"Confusion Tax", color:"#22c55e", icon:Sparkles },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600&family=Syne:wght@400;500;600;700;800&family=Lora:ital,wght@0,400;0,500;1,400;1,500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background: ${T.shell}; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: ${T.shell}; }
        ::-webkit-scrollbar-thumb { background: ${T.hover}; border-radius: 3px; }
        ::selection { background: ${T.accentS}; }
        @keyframes cjGlow { 0%,100%{box-shadow:0 0 20px ${T.accent}40} 50%{box-shadow:0 0 50px ${T.accent}70} }
        @keyframes cjPulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
        @keyframes cjFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @media(max-width:768px){
          .ps-grid { grid-template-columns: 1fr !important; }
          .principles-grid { grid-template-columns: 1fr !important; }
          .about-hero-inner { flex-direction: column !important; gap: 40px !important; }
          .team-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media(max-width:480px){
          .team-grid { grid-template-columns: 1fr !important; }
          .stats-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>

      <div style={{
        minHeight:"100vh",background:T.shell,color:T.t1,
        fontFamily:"'Syne',sans-serif",overflowX:"hidden",
      }}>

        {/* ══════════════════════════════════════════════════
            HERO
        ══════════════════════════════════════════════════ */}
        <section style={{
          position:"relative",minHeight:"100vh",
          display:"flex",flexDirection:"column",
          alignItems:"center",justifyContent:"center",
          overflow:"hidden",padding:"120px 24px 80px",
        }}>
          <GridBg T={T}/>
          <FloatingTokens T={T}/>

          {/* Radial glow */}
          <div style={{
            position:"absolute",left:"50%",top:"40%",
            transform:"translate(-50%,-50%)",
            width:700,height:500,borderRadius:"50%",
            background:`radial-gradient(ellipse, ${T.accent}22 0%, ${T.teal}0e 40%, transparent 70%)`,
            filter:"blur(50px)",pointerEvents:"none",
          }}/>

          <div style={{
            position:"relative",zIndex:2,
            maxWidth:760,width:"100%",textAlign:"center",
          }}>
            {/* Pill */}
            <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:0.1}}
              style={{
                display:"inline-flex",alignItems:"center",gap:7,
                padding:"5px 16px",borderRadius:100,marginBottom:28,
                background:`${T.accent}14`,border:`1px solid ${T.accent}40`,
              }}>
              <Heart size={13} color={T.accent}/>
              <span style={{
                fontFamily:"'JetBrains Mono',monospace",fontSize:10.5,
                fontWeight:700,color:T.accent,letterSpacing:"1.5px",textTransform:"uppercase",
              }}>Our Story</span>
            </motion.div>

            {/* Heading */}
            <motion.h1
              initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.18}}
              style={{
                fontFamily:"'Syne',sans-serif",fontWeight:800,
                fontSize:"clamp(38px,6vw,72px)",
                lineHeight:1.06,letterSpacing:"-2px",
                marginBottom:24,color:T.t1,
              }}>
              We Built the<br/>
              <span style={{color:T.accent}}>Starting Point</span><br/>
              Nobody Had.
            </motion.h1>

            {/* Sub */}
            <motion.p
              initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:0.28}}
              style={{
                fontFamily:"'Lora',serif",fontStyle:"italic",
                fontSize:"clamp(16px,2.2vw,20px)",
                color:T.t2,lineHeight:1.82,marginBottom:44,
                maxWidth:580,margin:"0 auto 44px",
              }}>
              Code Journey exists because being a beginner in software engineering
              shouldn't mean drowning in a sea of scattered resources with no idea
              which shore to swim toward.
            </motion.p>

            {/* CTA */}
            <motion.div
              initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:0.38}}
              style={{display:"flex",gap:14,justifyContent:"center",flexWrap:"wrap"}}>
              <a href="/register"
                style={{
                  display:"inline-flex",alignItems:"center",gap:8,
                  padding:"13px 26px",borderRadius:12,border:"none",
                  background:T.accent,color:"#fff",
                  fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:15,
                  cursor:"pointer",textDecoration:"none",
                  boxShadow:`0 0 32px ${T.accent}50`,
                  transition:"all 0.18s",animation:"cjGlow 3s ease infinite",
                }}>
                Start Learning Free <ArrowRight size={16}/>
              </a>
              <a href="#mission"
                style={{
                  display:"inline-flex",alignItems:"center",gap:8,
                  padding:"13px 22px",borderRadius:12,
                  border:`1px solid ${T.b2}`,background:"transparent",
                  color:T.t1,fontFamily:"'Syne',sans-serif",fontWeight:600,
                  fontSize:15,cursor:"pointer",textDecoration:"none",
                  transition:"all 0.18s",
                }}
                onMouseEnter={e=>{e.currentTarget.style.background=T.hover;e.currentTarget.style.borderColor=T.b3;}}
                onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.borderColor=T.b2;}}>
                Read Our Mission
              </a>
            </motion.div>
          </div>

          {/* Scroll cue */}
          <motion.div
            initial={{opacity:0}} animate={{opacity:1}} transition={{delay:1}}
            style={{
              position:"absolute",bottom:32,left:"50%",transform:"translateX(-50%)",
              display:"flex",flexDirection:"column",alignItems:"center",gap:6,cursor:"pointer",
            }}
            onClick={()=>document.getElementById("mission")?.scrollIntoView({behavior:"smooth"})}>
            <span style={{
              fontFamily:"'JetBrains Mono',monospace",fontSize:10,
              color:T.t3,letterSpacing:"2px",textTransform:"uppercase",
            }}>scroll</span>
            <motion.div animate={{y:[0,6,0]}} transition={{duration:1.6,repeat:Infinity}}>
              <ChevronDown size={18} color={T.t3}/>
            </motion.div>
          </motion.div>
        </section>

        {/* ══════════════════════════════════════════════════
            MISSION STATEMENT
        ══════════════════════════════════════════════════ */}
        <section id="mission" style={{
          padding:"100px 24px",background:T.deep,position:"relative",overflow:"hidden",
        }}>
          <GridBg T={T} masked={false}/>
          <div style={{maxWidth:900,margin:"0 auto",position:"relative"}}>
            <Reveal>
              <SectionLabel
                icon={Compass} pill="Our Mission" color={T.accent} T={T} center
                heading="Clarity Is the Product"
                sub="Not tutorials. Not videos. Not a course catalogue. The product is clarity - knowing where you are, what you need next, and why."
              />
            </Reveal>

            <Reveal delay={0.1}>
              <ManifestoQuote T={T}/>
            </Reveal>

            {/* Three pillars */}
            <div style={{
              display:"grid",gridTemplateColumns:"repeat(3,1fr)",
              gap:16,marginTop:48,
            }}
              className="principles-grid">
              {[
                { icon:Globe,    color:T.accent, label:"Who We Serve",
                  text:"Beginners in software engineering who are still figuring out what role or what tech stack they actually want - before committing to years of study in one direction." },
                { icon:Zap,      color:T.teal,   label:"What We Do",
                  text:"We surface only the information a beginner needs at each step, recommend practice before theory, and provide a structured path from confusion to confident momentum." },
                { icon:Brain,    color:T.gold,   label:"Why We Exist",
                  text:"The existing resources are incredible - but they are built for people who already know what they want. We are the bridge that gets you ready to use those resources effectively." },
              ].map((p,i)=>(
                <Reveal key={p.label} delay={i*0.1} y={16}>
                  <div style={{
                    background:T.card,border:`1px solid ${T.b1}`,
                    borderRadius:16,padding:"24px 22px",
                    display:"flex",flexDirection:"column",gap:12,
                  }}>
                    <div style={{
                      width:40,height:40,borderRadius:11,
                      background:`${p.color}16`,border:`1px solid ${p.color}30`,
                      display:"flex",alignItems:"center",justifyContent:"center",
                    }}>
                      <p.icon size={18} color={p.color}/>
                    </div>
                    <h4 style={{
                      fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:15,
                      color:T.t1,margin:0,
                    }}>{p.label}</h4>
                    <p style={{
                      fontFamily:"'Lora',serif",fontSize:14,
                      color:T.t2,lineHeight:1.72,margin:0,
                    }}>{p.text}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════
            STATS
        ══════════════════════════════════════════════════ */}
        <section style={{
          background:T.panel,borderTop:`1px solid ${T.b1}`,
          borderBottom:`1px solid ${T.b1}`,padding:"12px 24px",
        }}>
          <div style={{
            maxWidth:860,margin:"0 auto",
            display:"grid",gridTemplateColumns:"repeat(4,1fr)",
            gap:0,
          }}
            className="stats-grid">
            {stats.map((s,i,arr)=>(
              <div key={s.label} style={{
                borderRight:i<arr.length-1?`1px solid ${T.b1}`:"none",
              }}>
                <StatCounter {...s} T={T}/>
              </div>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════════════════
            THE PROBLEM WE'RE SOLVING
        ══════════════════════════════════════════════════ */}
        <section style={{padding:"100px 24px",position:"relative",overflow:"hidden"}}>
          <div style={{maxWidth:1060,margin:"0 auto"}}>
            <Reveal>
              <SectionLabel
                icon={Target} pill="The Problem" color={T.red} T={T}
                heading="Being a Beginner Is Broken"
                sub="Every resource assumes you already know what you want. We don't think that's acceptable."
              />
            </Reveal>

            {/* Big pull quote */}
            <Reveal delay={0.05}>
              <div style={{
                background:`linear-gradient(135deg,${T.accent}0d,${T.teal}08)`,
                border:`1px solid ${T.b2}`,borderRadius:18,
                padding:"36px 36px 36px 40px",marginBottom:36,
                borderLeft:`4px solid ${T.accent}`,position:"relative",overflow:"hidden",
              }}>
                <div style={{
                  position:"absolute",top:-8,left:14,
                  fontFamily:"'Lora',serif",fontSize:100,lineHeight:1,
                  color:T.accent,opacity:0.07,fontStyle:"italic",userSelect:"none",
                }}>"</div>
                <p style={{
                  fontFamily:"'Lora',serif",fontStyle:"italic",
                  fontSize:"clamp(16px,2vw,21px)",color:T.t1,
                  lineHeight:1.72,position:"relative",margin:0,
                }}>
                  A beginner in software engineering today faces an impossible choice:
                  pick a tutorial from thousands, pick a language from dozens, pick a
                  role from a list they barely understand - and somehow start building
                  knowledge on a foundation that doesn't yet exist.
                  <span style={{
                    color:T.accent,fontStyle:"normal",fontWeight:700,display:"block",marginTop:12,
                  }}>Code Journey is the foundation layer.</span>
                </p>
              </div>
            </Reveal>

            {/* Problem / Solution split */}
            {/* <div className="ps-grid"
              style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:20}}>
              <ProblemSolution T={T}/>
            </div> */}
          </div>
        </section>

        {/* ══════════════════════════════════════════════════
            PRINCIPLES
        ══════════════════════════════════════════════════ */}
        <section style={{padding:"100px 24px",background:T.deep,position:"relative",overflow:"hidden"}}>
          <div style={{
            position:"absolute",left:"50%",top:"50%",
            transform:"translate(-50%,-50%)",
            width:600,height:400,borderRadius:"50%",
            background:`radial-gradient(ellipse,${T.accent}0a 0%,transparent 70%)`,
            filter:"blur(60px)",pointerEvents:"none",
          }}/>
          <div style={{maxWidth:1060,margin:"0 auto",position:"relative"}}>
            <Reveal>
              <SectionLabel
                icon={Star} pill="Our Principles" color={T.gold} T={T} center
                heading="What We Stand For"
                sub="Six things we will never compromise on, no matter how the platform grows."
              />
            </Reveal>
            <div style={{
              display:"grid",
              gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",
              gap:18,
            }}
              className="principles-grid">
              {principles.map((p,i)=>(
                <PrincipleCard key={p.title} {...p} T={T} index={i}/>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════
            HOW IT WORKS - TIMELINE
        ══════════════════════════════════════════════════ */}
        <section style={{padding:"100px 24px",position:"relative",overflow:"hidden"}}>
          <div style={{maxWidth:780,margin:"0 auto"}}>
            <Reveal>
              <SectionLabel
                icon={Map} pill="The Journey" color={T.teal} T={T}
                heading="From Confused to Confident"
                sub="Every learner on Code Journey follows the same five-stage arc - but at their own speed."
              />
            </Reveal>
            <div style={{position:"relative"}}>
              {timelineSteps.map((step,i)=>(
                <TimelineStep
                  key={step.n}
                  step={step}
                  isLast={i===timelineSteps.length-1}
                  T={T}
                />
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════
            WHO THIS IS FOR
        ══════════════════════════════════════════════════ */}
        <section style={{
          padding:"100px 24px",background:T.deep,
          position:"relative",overflow:"hidden",
        }}>
          <GridBg T={T} masked={false}/>
          <div style={{
            position:"absolute",right:"10%",top:"20%",
            width:300,height:300,borderRadius:"50%",
            background:`radial-gradient(ellipse,${T.teal}0c 0%,transparent 70%)`,
            filter:"blur(50px)",pointerEvents:"none",
          }}/>

          <div style={{maxWidth:1060,margin:"0 auto",position:"relative"}}>
            <Reveal>
              <SectionLabel
                icon={Users} pill="Who We're For" color={T.green} T={T}
                heading="You Belong Here If…"
                sub="CODE JOURNEY is deliberately built for a specific kind of person."
              />
            </Reveal>

            <div style={{
              display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",
              gap:14,
            }}>
              {[
                { emoji:"🤔", title:"You Don't Know Where to Start",
                  body:"You've seen 'learn to code' videos but can't decide between Python, JavaScript, or something else. That's exactly where CJ begins." },
                { emoji:"😵", title:"You Feel Overwhelmed by Options",
                  body:"React, Vue, Angular, Django, Flutter - the list never ends. CJ removes the noise and tells you what to focus on for your specific goal." },
                { emoji:"🎯", title:"You Want to Explore Before Committing",
                  body:"You want to try web dev, app dev and data science before deciding where to go deep. CJ's three tracks let you do exactly that." },
                { emoji:"⚡", title:"You Learn by Doing",
                  body:"You get bored reading theory without practice. Code Journey puts code exercises before explanations, not after." },
                { emoji:"🔁", title:"You've Started and Stopped Before",
                  body:"You've tried online courses but dropped off. The streak system and AI tutor are specifically designed to catch you before you fall off." },
                { emoji:"🚀", title:"You Want to Go Somewhere Real",
                  body:"You aren't learning to code as a hobby - you want a career, a freelance income, or the ability to build real things. CJ is built for that ambition." },
              ].map((card,i)=>(
                <Reveal key={card.title} delay={i*0.07} y={18}>
                  <div
                    style={{
                      background:T.card,border:`1px solid ${T.b1}`,
                      borderRadius:16,padding:"22px 20px",
                      transition:"all 0.2s",cursor:"default",
                    }}
                    onMouseEnter={e=>{e.currentTarget.style.borderColor=T.b3;e.currentTarget.style.transform="translateY(-3px)";}}
                    onMouseLeave={e=>{e.currentTarget.style.borderColor=T.b1;e.currentTarget.style.transform="translateY(0)";}}>
                    <span style={{fontSize:26,display:"block",marginBottom:12}}>{card.emoji}</span>
                    <h4 style={{
                      fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:15,
                      color:T.t1,marginBottom:8,letterSpacing:"-0.1px",
                    }}>{card.title}</h4>
                    <p style={{
                      fontFamily:"'Lora',serif",fontSize:14,
                      color:T.t2,lineHeight:1.7,margin:0,
                    }}>{card.body}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════
            PLATFORM SNAPSHOT
        ══════════════════════════════════════════════════ */}
        {/* <section style={{padding:"100px 24px",position:"relative",overflow:"hidden"}}>
          <div style={{maxWidth:1060,margin:"0 auto"}}>
            <Reveal>
              <SectionLabel
                icon={Terminal} pill="The Platform" color={T.accent} T={T}
                heading="One Platform. Complete Toolkit."
                sub="Everything you need is inside Code Journey - nothing is outsourced to a different tab."
              />
            </Reveal>
            <div style={{
              display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:14,
            }}>
              {[
                { icon:Code2,     color:"#7c6ee0", title:"9-Language IDE",         desc:"JavaScript, Python, TypeScript, Rust, SQL, Flutter, R, Kotlin, HTML/CSS - one editor, zero setup." },
                { icon:Brain,     color:"#5eead4", title:"Context-Aware AI Tutor", desc:"Reads your code and exercise automatically. Gives progressive hints - not direct answers." },
                { icon:BookOpen,  color:"#fbbf24", title:"Curated Exercises",      desc:"Every exercise is designed for a beginner at that exact stage. No accidental difficulty spikes." },
                { icon:Zap,       color:"#22c55e", title:"Streak & XP System",     desc:"Daily streaks, XP rewards and five tiers of progression to keep you consistent." },
                { icon:Layers,    color:"#ec4899", title:"Three Career Tracks",    desc:"Web, App and Data Science - each with a curated sequence built for that goal." },
                { icon:Globe,     color:"#f97316", title:"Logs & Changelog",       desc:"Full transparency on what's released, what's deprecated and what's improving." },
              ].map((f,i)=>(
                <Reveal key={f.title} delay={i*0.07} y={16}>
                  <div
                    style={{
                      background:T.card,border:`1px solid ${T.b1}`,
                      borderRadius:16,padding:"22px 20px",
                      transition:"all 0.2s",cursor:"default",
                      display:"flex",flexDirection:"column",gap:12,
                    }}
                    onMouseEnter={e=>{e.currentTarget.style.borderColor=`${f.color}44`;e.currentTarget.style.transform="translateY(-3px)";}}
                    onMouseLeave={e=>{e.currentTarget.style.borderColor=T.b1;e.currentTarget.style.transform="translateY(0)";}}>
                    <div style={{
                      width:40,height:40,borderRadius:11,
                      background:`${f.color}16`,border:`1px solid ${f.color}30`,
                      display:"flex",alignItems:"center",justifyContent:"center",
                    }}>
                      <f.icon size={18} color={f.color}/>
                    </div>
                    <h4 style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:15,color:T.t1,margin:0}}>{f.title}</h4>
                    <p style={{fontFamily:"'Lora',serif",fontSize:13.5,color:T.t2,lineHeight:1.7,margin:0}}>{f.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section> */}

        {/* ══════════════════════════════════════════════════
            FINAL CTA
        ══════════════════════════════════════════════════ */}
        <section style={{
          padding:"120px 24px",background:T.deep,
          position:"relative",overflow:"hidden",
        }}>
          {/* Glow */}
          <div style={{
            position:"absolute",left:"50%",top:"50%",
            transform:"translate(-50%,-50%)",
            width:700,height:400,borderRadius:"50%",
            background:`radial-gradient(ellipse,${T.accent}1c 0%,${T.teal}0c 40%,transparent 70%)`,
            filter:"blur(40px)",pointerEvents:"none",
          }}/>
          <GridBg T={T}/>

          <Reveal>
            <div style={{
              maxWidth:640,margin:"0 auto",
              textAlign:"center",position:"relative",
            }}>
              {/* CJ mark */}
              <motion.div
                animate={{y:[0,-6,0]}}
                transition={{duration:3,repeat:Infinity,ease:"easeInOut"}}
                style={{
                  display:"inline-flex",width:64,height:64,borderRadius:18,
                  background:`linear-gradient(135deg,${T.accent},${T.teal})`,
                  alignItems:"center",justifyContent:"center",
                  fontSize:24,fontWeight:800,color:"#fff",
                  fontFamily:"'Syne',sans-serif",marginBottom:28,
                  boxShadow:`0 0 40px ${T.accent}50`,
                }}>
                CJ
              </motion.div>

              <h2 style={{
                fontFamily:"'Syne',sans-serif",fontWeight:800,
                fontSize:"clamp(32px,5vw,54px)",
                color:T.t1,marginBottom:18,
                letterSpacing:"-1.2px",lineHeight:1.1,
              }}>
                Ready to Find Your<br/>
                <span style={{color:T.accent}}>Starting Point?</span>
              </h2>

              <p style={{
                fontFamily:"'Lora',serif",fontStyle:"italic",
                fontSize:18,color:T.t2,lineHeight:1.82,marginBottom:44,
              }}>
                No credit card. No downloads. No prior knowledge.
                Just open the browser and take the first step.
              </p>

              <div style={{display:"flex",gap:14,justifyContent:"center",flexWrap:"wrap"}}>
                <a href="/register"
                  style={{
                    display:"inline-flex",alignItems:"center",gap:9,
                    padding:"15px 32px",borderRadius:13,border:"none",
                    background:T.accent,color:"#fff",
                    fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:16,
                    cursor:"pointer",textDecoration:"none",
                    boxShadow:`0 0 40px ${T.accent}55`,
                    transition:"all 0.18s",letterSpacing:"0.2px",
                    animation:"cjGlow 3s ease infinite",
                  }}>
                  Begin Free <ArrowRight size={18}/>
                </a>
                {/* <a href="/"
                  style={{
                    display:"inline-flex",alignItems:"center",gap:8,
                    padding:"15px 24px",borderRadius:13,
                    border:`1px solid ${T.b2}`,background:"transparent",
                    color:T.t1,fontFamily:"'Syne',sans-serif",fontWeight:600,
                    fontSize:16,cursor:"pointer",textDecoration:"none",
                    transition:"all 0.18s",
                  }}
                  onMouseEnter={e=>{e.currentTarget.style.background=T.hover;e.currentTarget.style.borderColor=T.b3;}}
                  onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.borderColor=T.b2;}}>
                  Back to Home
                </a> */}
              </div>

              {/* Trust */}
              <div style={{
                marginTop:36,display:"flex",alignItems:"center",
                justifyContent:"center",gap:24,flexWrap:"wrap",
              }}>
                {["Free to start","Zero confusion tax","Built for beginners"].map(t=>(
                  <div key={t} style={{display:"flex",alignItems:"center",gap:6}}>
                    <div style={{width:6,height:6,borderRadius:"50%",background:T.green}}/>
                    <span style={{
                      fontFamily:"'JetBrains Mono',monospace",fontSize:11.5,
                      color:T.t3,fontWeight:600,
                    }}>{t}</span>
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