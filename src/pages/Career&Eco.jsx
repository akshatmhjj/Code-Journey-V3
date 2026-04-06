/**
 * Code Journey — Two Pages
 *
 * 1. Careers.jsx  — "Launch Pad" — companies that hire, prep resources, role mapping
 * 2. Ecosystem.jsx — "The Ecosystem" — extended languages, frameworks, modules
 *
 * Both are named exports. Import individually:
 *   import Careers   from "./pages/Careers";
 *   import Ecosystem from "./pages/Ecosystem";
 */

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase, Code2, Brain, Trophy, Target, Zap, Star,
  Globe, ArrowRight, ChevronRight, Layers, Database,
  Smartphone, BarChart2, Server, Shield, Package, Cpu,
  TrendingUp, BookOpen, Terminal, Sparkles, Users,
  CheckCircle2, Clock, Building2, Search, Filter,
  ExternalLink, Hash, GitBranch, Boxes, Atom,
  FlaskConical, Workflow, Network, LayoutGrid,
  PenTool, MonitorSmartphone, Cloud, Lock,
} from "lucide-react";

/* ══════════════════════════════════════════════════════════════
   SHARED THEME
══════════════════════════════════════════════════════════════ */
const THEMES = {
  cosmos:{ shell:"#07080d",deep:"#0c0e18",mid:"#111420",surface:"#161927",panel:"#1a1e2e",hover:"#1e2335",card:"#161927",t1:"#e8eaf2",t2:"#8892b0",t3:"#5a6488",t4:"#2e3660",b1:"rgba(120,130,180,0.08)",b2:"rgba(120,130,180,0.15)",b3:"rgba(120,130,180,0.24)",accent:"#7c6ee0",accentS:"rgba(124,110,224,0.14)",teal:"#5eead4",green:"#22c55e",red:"#f87171",gold:"#fbbf24" },
  void:{ shell:"#000",deep:"#050507",mid:"#0a0a0f",surface:"#0f0f15",panel:"#141419",hover:"#1a1a22",card:"#0f0f15",t1:"#f0f0ff",t2:"#9090b8",t3:"#505070",t4:"#252540",b1:"rgba(100,100,200,0.08)",b2:"rgba(100,100,200,0.14)",b3:"rgba(100,100,200,0.22)",accent:"#8b7ff0",accentS:"rgba(139,127,240,0.14)",teal:"#2dd4bf",green:"#34d399",red:"#fc8181",gold:"#fcd34d" },
  aurora:{ shell:"#040e0e",deep:"#071414",mid:"#0b1c1c",surface:"#102424",panel:"#142a2a",hover:"#1a3333",card:"#102424",t1:"#e0f5f5",t2:"#7ab8b8",t3:"#3d7878",t4:"#1e4444",b1:"rgba(80,200,180,0.08)",b2:"rgba(80,200,180,0.15)",b3:"rgba(80,200,180,0.24)",accent:"#2dd4bf",accentS:"rgba(45,212,191,0.14)",teal:"#5eead4",green:"#4ade80",red:"#f87171",gold:"#fbbf24" },
  nord:{ shell:"#1a1f2e",deep:"#1e2535",mid:"#232c40",surface:"#28334a",panel:"#2d3a50",hover:"#344260",card:"#28334a",t1:"#eceff4",t2:"#9ba8c0",t3:"#5c6a88",t4:"#3a4560",b1:"rgba(136,192,208,0.1)",b2:"rgba(136,192,208,0.18)",b3:"rgba(136,192,208,0.28)",accent:"#88c0d0",accentS:"rgba(136,192,208,0.14)",teal:"#8fbcbb",green:"#a3be8c",red:"#bf616a",gold:"#ebcb8b" },
  light:{ shell:"#f3f4f8",deep:"#fff",mid:"#f0f1f7",surface:"#fff",panel:"#f7f8fc",hover:"#eef0f8",card:"#fff",t1:"#111827",t2:"#4b5680",t3:"#7c87a8",t4:"#c5ccdf",b1:"rgba(80,90,150,0.08)",b2:"rgba(80,90,150,0.15)",b3:"rgba(80,90,150,0.24)",accent:"#6256d0",accentS:"rgba(98,86,208,0.1)",teal:"#0d9488",green:"#16a34a",red:"#dc2626",gold:"#d97706" },
};
const getTheme = () => { try { return THEMES[localStorage.getItem("cj-theme")] || THEMES.cosmos; } catch { return THEMES.cosmos; } };
const applyToDom = (T) => { const r = document.documentElement; [["--cj-shell",T.shell],["--cj-accent",T.accent],["--cj-teal",T.teal],["--cj-t1",T.t1],["--cj-t2",T.t2]].forEach(([k,v]) => r.style.setProperty(k,v)); };

function useTheme() {
  const [T, setT] = useState(getTheme);
  useEffect(() => {
    applyToDom(T);
    const iv = setInterval(() => { const f = getTheme(); if (f.accent !== T.accent) { setT(f); applyToDom(f); } }, 500);
    return () => clearInterval(iv);
  }, [T]);
  useEffect(() => { const fn = () => { const f = getTheme(); setT(f); applyToDom(f); }; window.addEventListener("storage", fn); return () => window.removeEventListener("storage", fn); }, []);
  return T;
}

/* ── Shared styles ── */
const baseStyles = (T) => `
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600&family=Syne:wght@400;500;600;700;800&family=Lora:ital,wght@0,400;0,500;1,400&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
  html{scroll-behavior:smooth;}body{background:${T.shell};}
  ::-webkit-scrollbar{width:5px;}::-webkit-scrollbar-track{background:${T.shell};}
  ::-webkit-scrollbar-thumb{background:${T.hover};border-radius:3px;}
  ::selection{background:${T.accentS};}
  @keyframes cjUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
  @keyframes cjGlow{0%,100%{box-shadow:0 0 20px ${T.accent}44}50%{box-shadow:0 0 48px ${T.accent}77}}
  @keyframes cjFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
  @keyframes cjSpin{from{transform:rotate(0)}to{transform:rotate(360deg)}}
  @keyframes cjPulse{0%,100%{opacity:1}50%{opacity:0.45}}
  @keyframes shimmer{0%{background-position:-200% center}100%{background-position:200% center}}
`;

/* ── Shared primitives ── */
const GridBg = ({ T, masked = true }) => (
  <div style={{ position:"absolute",inset:0,pointerEvents:"none",backgroundImage:`linear-gradient(${T.b1} 1px,transparent 1px),linear-gradient(90deg,${T.b1} 1px,transparent 1px)`,backgroundSize:"52px 52px",maskImage:masked?"radial-gradient(ellipse 80% 60% at 50% 40%,black 30%,transparent 100%)":undefined }} />
);
const Reveal = ({ children, delay=0, y=20, x=0 }) => (
  <motion.div initial={{opacity:0,y,x}} whileInView={{opacity:1,y:0,x:0}} viewport={{once:true,margin:"-50px"}} transition={{duration:0.55,delay,ease:[0.22,1,0.36,1]}}>
    {children}
  </motion.div>
);
const Pill = ({ icon:Icon, label, color, T }) => (
  <div style={{ display:"inline-flex",alignItems:"center",gap:6,padding:"4px 13px",borderRadius:100,background:`${color}14`,border:`1px solid ${color}40`,marginBottom:16 }}>
    {Icon && <Icon size={12} color={color} />}
    <span style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:10,fontWeight:700,color,letterSpacing:"1.8px",textTransform:"uppercase" }}>{label}</span>
  </div>
);

/* ══════════════════════════════════════════════════════════════
   ███████╗██╗██████╗ ███████╗████████╗
   ██╔════╝██║██╔══██╗██╔════╝╚══██╔══╝
   █████╗  ██║██████╔╝███████╗   ██║
   ██╔══╝  ██║██╔══██╗╚════██║   ██║
   ██║     ██║██║  ██║███████║   ██║
   ╚═╝     ╚═╝╚═╝  ╚═╝╚══════╝   ╚═╝

   PAGE 1 — LAUNCH PAD (Careers / Companies)
══════════════════════════════════════════════════════════════ */

/* ── Company Data ── */
const COMPANIES = [
  // FAANG+
  { id:"google",    name:"Google",          logo:"G",  color:"#4285f4",  tier:"FAANG+",   domain:"Search · Cloud · AI",         hq:"Mountain View, CA", stacks:["Python","Go","C++","JavaScript","TypeScript","SQL"],   roles:["SWE","ML Engineer","Data Engineer","DevRel"],     prep:["System Design","LeetCode Hard","Distributed Systems","ML Basics"] },
  { id:"microsoft", name:"Microsoft",       logo:"M",  color:"#00a4ef",  tier:"FAANG+",   domain:"Cloud · Productivity · Gaming",hq:"Redmond, WA",       stacks:["TypeScript","C#","Python","Rust","SQL"],             roles:["SWE","Cloud Engineer","PM","Data Scientist"],     prep:["System Design","OOP","Azure Concepts","Behavioural"] },
  { id:"amazon",    name:"Amazon",          logo:"A",  color:"#ff9900",  tier:"FAANG+",   domain:"E-commerce · Cloud · Logistics",hq:"Seattle, WA",      stacks:["Java","Python","JavaScript","Go","SQL"],             roles:["SDE","Cloud Architect","Data Engineer","PM"],     prep:["Leadership Principles","System Design","DSA"] },
  { id:"meta",      name:"Meta",            logo:"M",  color:"#1877f2",  tier:"FAANG+",   domain:"Social · AR/VR · AI",          hq:"Menlo Park, CA",    stacks:["Python","PHP/Hack","JavaScript","C++","Kotlin"],     roles:["SWE","AI Researcher","Android/iOS Eng","Data Sci"],prep:["LeetCode Hard","System Design","Behavioural"] },
  { id:"apple",     name:"Apple",           logo:"◎",  color:"#555555",  tier:"FAANG+",   domain:"Hardware · Software · Services",hq:"Cupertino, CA",    stacks:["Swift","Objective-C","Python","JavaScript","Rust"],  roles:["iOS Eng","macOS Eng","ML Engineer","Backend SWE"],prep:["Algorithms","Swift/ObjC","Design Patterns","System Design"] },
  // Tier 1
  { id:"netflix",   name:"Netflix",         logo:"N",  color:"#e50914",  tier:"Tier 1",   domain:"Streaming · Content · AI",     hq:"Los Gatos, CA",     stacks:["Java","Python","JavaScript","Go","Kotlin"],          roles:["SWE","Data Scientist","ML Engineer","DevOps"],    prep:["System Design","DSA","Distributed Systems"] },
  { id:"uber",      name:"Uber",            logo:"U",  color:"#000000",  tier:"Tier 1",   domain:"Mobility · Delivery · Freight", hq:"San Francisco, CA", stacks:["Go","Python","JavaScript","Java","Swift"],           roles:["SWE","Data Engineer","ML Eng","Embedded"],        prep:["DSA","System Design","SQL","Maps Concepts"] },
  { id:"airbnb",    name:"Airbnb",          logo:"⊕",  color:"#ff5a5f",  tier:"Tier 1",   domain:"Travel · Hospitality · Payments",hq:"San Francisco,CA", stacks:["JavaScript","TypeScript","Python","Java","SQL"],     roles:["Frontend Eng","Backend Eng","Data Scientist"],   prep:["DSA","React","System Design","Behavioural"] },
  { id:"stripe",    name:"Stripe",          logo:"S",  color:"#635bff",  tier:"Tier 1",   domain:"Payments · Fintech · APIs",    hq:"San Francisco, CA", stacks:["Ruby","JavaScript","Go","Python","TypeScript"],      roles:["SWE","Payments Eng","Security Eng","Data Sci"],  prep:["DSA","API Design","Security Basics","System Design"] },
  { id:"linkedin",  name:"LinkedIn",        logo:"in", color:"#0077b5",  tier:"Tier 1",   domain:"Professional Network · Recruiting",hq:"Sunnyvale, CA",  stacks:["Java","Python","JavaScript","Scala","SQL"],          roles:["SWE","Data Eng","ML Eng","Site Reliability"],    prep:["DSA","System Design","Distributed Systems"] },
  // India-based
  { id:"infosys",   name:"Infosys",         logo:"i",  color:"#007cc3",  tier:"India MNC",domain:"IT Services · Consulting · BPO",hq:"Bengaluru, India",  stacks:["Java","Python","JavaScript","SQL",".NET"],           roles:["Software Eng","Analyst","Cloud Eng","QA"],        prep:["Aptitude","Verbal","Coding (Easy/Med)","Behavioural"] },
  { id:"tcs",       name:"TCS",             logo:"T",  color:"#1e3799",  tier:"India MNC",domain:"IT Services · Digital · IoT",  hq:"Mumbai, India",     stacks:["Java","Python","SQL","JavaScript",".NET"],           roles:["Assistant SE","Analyst","DevOps","Data Analyst"],  prep:["TCS NQT","Aptitude","Verbal Ability","Basic DSA"] },
  { id:"wipro",     name:"Wipro",           logo:"W",  color:"#5f259f",  tier:"India MNC",domain:"IT Services · Cloud · AI",     hq:"Bengaluru, India",  stacks:["Java","Python","SQL","JavaScript","Salesforce"],     roles:["Project Eng","Business Analyst","Cloud Eng"],    prep:["NLTH Test","Aptitude","Logical Reasoning","Coding"] },
  { id:"zoho",      name:"Zoho",            logo:"Z",  color:"#e42527",  tier:"India MNC",domain:"SaaS · CRM · Productivity",   hq:"Chennai, India",    stacks:["Java","JavaScript","Python","SQL","C"],              roles:["SWE","Product Eng","UI Developer","QA"],          prep:["DSA (Medium)","System Design","Aptitude","Coding Test"] },
  { id:"razorpay",  name:"Razorpay",        logo:"R",  color:"#2d9fe2",  tier:"India Startup",domain:"Fintech · Payments · Banking",hq:"Bengaluru, India",stacks:["Go","JavaScript","Python","Java","React"],          roles:["Backend Eng","Frontend Eng","DevOps","Data Eng"], prep:["DSA","System Design","Fintech Basics","Go/Python"] },
  { id:"swiggy",    name:"Swiggy",          logo:"S",  color:"#fc8019",  tier:"India Startup",domain:"Food Delivery · Logistics · Hyperlocal",hq:"Bengaluru",stacks:["Go","Python","JavaScript","Kotlin","SQL"],       roles:["SWE","Backend Eng","Android Eng","Data Analyst"], prep:["DSA","System Design","Logistics Concepts","SQL"] },
  { id:"flipkart",  name:"Flipkart",        logo:"F",  color:"#2874f0",  tier:"India Startup",domain:"E-commerce · Payments · Logistics",hq:"Bengaluru, India",stacks:["Java","Scala","Python","JavaScript","SQL"],    roles:["SDE","Data Eng","ML Eng","Android/iOS"],          prep:["DSA","System Design","Java","Distributed Systems"] },
  { id:"cred",      name:"CRED",            logo:"C",  color:"#1a1a2e",  tier:"India Startup",domain:"Fintech · Lifestyle · Credit",hq:"Bengaluru, India", stacks:["Kotlin","Go","Python","JavaScript","PostgreSQL"],   roles:["Backend Eng","Android Eng","Data Analyst","ML"],  prep:["DSA (Hard)","System Design","Kotlin","Behavioural"] },
];

const TIERS = ["All","FAANG+","Tier 1","India MNC","India Startup"];

const PREP_RESOURCES = [
  { icon:Brain,      color:"#7c6ee0", title:"Data Structures & Algorithms",
    desc:"The universal admission ticket. Arrays, linked lists, trees, graphs, dynamic programming — every company tests these.",
    items:["Arrays & Strings","Recursion & Backtracking","Binary Search","Trees & Graphs","Dynamic Programming","Greedy Algorithms"],
    platforms:["LeetCode","HackerRank","Codeforces","GeeksforGeeks"],
  },
  { icon:Workflow,   color:"#5eead4", title:"System Design",
    desc:"Senior roles and FAANG interviews require designing scalable systems. Even juniors benefit from learning the vocabulary.",
    items:["Load Balancers & CDNs","Database Sharding","Caching Strategies","Message Queues","Microservices","Rate Limiting"],
    platforms:["System Design Primer","ByteByteGo","Grokking the Interview","Educative.io"],
  },
  { icon:Target,     color:"#fbbf24", title:"Aptitude & Reasoning",
    desc:"Indian MNCs (TCS, Infosys, Wipro) have heavy aptitude rounds — quantitative, logical reasoning and verbal ability.",
    items:["Quantitative Aptitude","Logical Reasoning","Verbal Ability","Data Interpretation","Puzzles","Number Series"],
    platforms:["IndiaBix","PrepInsta","Freshersworld","Testbook"],
  },
  { icon:Users,      color:"#22c55e", title:"Behavioural Interviews",
    desc:"The 'soft' round that's actually hard. STAR method, Amazon leadership principles, and knowing how to tell your story.",
    items:["STAR Method","Conflict Resolution","Leadership Examples","Failure Stories","Growth Mindset","Team Collaboration"],
    platforms:["Glassdoor","Levels.fyi","Interviewing.io","Pramp"],
  },
  { icon:Code2,      color:"#f97316", title:"Mock Interviews",
    desc:"Practice under pressure. Nothing prepares you for a real interview like a timed session with a real or simulated interviewer.",
    items:["Timed Coding Sessions","Talking While Coding","Peer Mock Interviews","AI Mock Interviews","Recording & Review"],
    platforms:["Pramp","Interviewing.io","LeetCode Contest","Coderbyte"],
  },
  { icon:Database,   color:"#f472b6", title:"SQL & Databases",
    desc:"Almost every data and backend role will test SQL. Joins, subqueries, window functions, and database design fundamentals.",
    items:["Complex JOINs","Window Functions","Query Optimisation","Indexing","Database Design","Transactions"],
    platforms:["StrataScratch","DataLemur","Mode Analytics","SQLZoo"],
  },
];

const ROLE_TRACKS = [
  {
    role:"Frontend Engineer",
    color:"#818cf8",
    icon:MonitorSmartphone,
    stack:["HTML","CSS","JavaScript","TypeScript","React/Vue"],
    companies:["Meta","Google","Airbnb","Flipkart"],
    salary:"₹8–40 LPA · $90k–$220k",
    what:"Builds everything users see and interact with in the browser.",
  },
  {
    role:"Backend Engineer",
    color:"#5eead4",
    icon:Server,
    stack:["Python","Java","Go","Node.js","SQL"],
    companies:["Amazon","Netflix","Stripe","Razorpay"],
    salary:"₹10–50 LPA · $100k–$250k",
    what:"Designs and builds APIs, databases, and server-side logic.",
  },
  {
    role:"Data Scientist",
    color:"#f472b6",
    icon:BarChart2,
    stack:["Python","R","SQL","Pandas","Scikit-learn"],
    companies:["Google","LinkedIn","Swiggy","Flipkart"],
    salary:"₹8–35 LPA · $95k–$200k",
    what:"Extracts insights from data and builds predictive models.",
  },
  {
    role:"Mobile Engineer",
    color:"#4ade80",
    icon:Smartphone,
    stack:["Flutter","Kotlin","Swift","Dart"],
    companies:["Apple","CRED","Swiggy","Uber"],
    salary:"₹8–40 LPA · $100k–$220k",
    what:"Builds native or cross-platform iOS and Android applications.",
  },
  {
    role:"ML / AI Engineer",
    color:"#f97316",
    icon:Brain,
    stack:["Python","TensorFlow","PyTorch","SQL","Rust"],
    companies:["Google","Meta","Microsoft","Netflix"],
    salary:"₹12–60 LPA · $120k–$350k",
    what:"Designs, trains and deploys machine learning models at scale.",
  },
  {
    role:"Cloud / DevOps",
    color:"#38bdf8",
    icon:Cloud,
    stack:["Python","Go","Bash","Kubernetes","Terraform"],
    companies:["Amazon","Microsoft","Google","Infosys"],
    salary:"₹8–45 LPA · $90k–$210k",
    what:"Manages infrastructure, CI/CD pipelines and cloud services.",
  },
];

/* ── Careers page components ── */
const TierBadge = ({ tier, T }) => {
  const cfg = { "FAANG+":T.gold, "Tier 1":T.accent, "India MNC":T.teal, "India Startup":T.green };
  const c = cfg[tier] || T.t3;
  return <span style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:9,fontWeight:700,padding:"2px 7px",borderRadius:4,letterSpacing:"0.5px",background:`${c}16`,color:c,border:`1px solid ${c}28`,whiteSpace:"nowrap" }}>{tier}</span>;
};

const CompanyCard = ({ company, T, onClick, isActive }) => {
  const [hov, setHov] = useState(false);
  const active = isActive || hov;
  return (
    <motion.div layout onClick={onClick}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      whileHover={{ y:-3 }} transition={{ duration:0.16 }}
      style={{
        background: active ? `${company.color}12` : T.card,
        border: `1px solid ${active ? company.color+"55" : T.b1}`,
        borderRadius:16, padding:"20px", cursor:"pointer",
        transition:"border 0.18s,background 0.18s,box-shadow 0.18s",
        boxShadow: active ? `0 8px 32px ${company.color}20` : "none",
        position:"relative", overflow:"hidden",
      }}>
      {/* Top color strip */}
      <div style={{ position:"absolute",top:0,left:0,right:0,height:2,background:company.color,opacity:active?0.85:0.25,transition:"opacity 0.18s",borderRadius:"16px 16px 0 0" }} />

      <div style={{ display:"flex",alignItems:"flex-start",gap:12,marginBottom:12 }}>
        <div style={{ width:40,height:40,borderRadius:11,background:`${company.color}18`,border:`1.5px solid ${company.color}44`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:800,color:company.color,fontFamily:"'Syne',sans-serif",flexShrink:0 }}>
          {company.logo}
        </div>
        <div style={{ flex:1,minWidth:0 }}>
          <div style={{ display:"flex",alignItems:"center",gap:7,flexWrap:"wrap",marginBottom:3 }}>
            <span style={{ fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:15,color:T.t1 }}>{company.name}</span>
            <TierBadge tier={company.tier} T={T} />
          </div>
          <span style={{ fontFamily:"'Lora',serif",fontSize:12.5,color:T.t3,fontStyle:"italic" }}>{company.domain}</span>
        </div>
      </div>

      {/* Stack chips */}
      <div style={{ display:"flex",gap:5,flexWrap:"wrap",marginBottom:10 }}>
        {company.stacks.slice(0,4).map(s => (
          <span key={s} style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:9.5,fontWeight:600,padding:"2px 6px",borderRadius:4,background:T.panel,color:T.t3,border:`1px solid ${T.b1}` }}>{s}</span>
        ))}
        {company.stacks.length > 4 && <span style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:9.5,color:T.t4,padding:"2px 4px" }}>+{company.stacks.length-4}</span>}
      </div>

      {/* View hint */}
      <div style={{ display:"flex",alignItems:"center",gap:4,color:company.color,opacity:active?1:0,transition:"opacity 0.16s" }}>
        <span style={{ fontFamily:"'Syne',sans-serif",fontSize:11.5,fontWeight:600 }}>View prep guide</span>
        <ChevronRight size={13} />
      </div>
    </motion.div>
  );
};

const CompanyDetail = ({ company, T }) => (
  <motion.div initial={{ opacity:0,y:14,scale:0.99 }} animate={{ opacity:1,y:0,scale:1 }} exit={{ opacity:0,y:10,scale:0.99 }} transition={{ duration:0.24 }}>
    <div style={{ background:T.surface,border:`1px solid ${company.color}33`,borderRadius:20,overflow:"hidden",boxShadow:`0 24px 60px rgba(0,0,0,0.4),0 0 0 1px ${company.color}18` }}>
      {/* Header */}
      <div style={{ background:`linear-gradient(135deg,${company.color}14 0%,transparent 100%)`,borderBottom:`1px solid ${company.color}22`,padding:"28px 28px 22px" }}>
        <div style={{ display:"flex",alignItems:"center",gap:14,marginBottom:10,flexWrap:"wrap" }}>
          <div style={{ width:52,height:52,borderRadius:14,background:`${company.color}18`,border:`1.5px solid ${company.color}44`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,fontWeight:800,color:company.color,fontFamily:"'Syne',sans-serif",flexShrink:0 }}>{company.logo}</div>
          <div>
            <div style={{ display:"flex",alignItems:"center",gap:8,flexWrap:"wrap",marginBottom:4 }}>
              <h3 style={{ fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:22,color:T.t1,margin:0,letterSpacing:"-0.3px" }}>{company.name}</h3>
              <TierBadge tier={company.tier} T={T} />
            </div>
            <p style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:12,color:T.t3,margin:0 }}>{company.hq} · {company.domain}</p>
          </div>
        </div>
      </div>

      {/* Body — 3 columns */}
      <div style={{ padding:"22px 28px",display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:20 }}>
        {/* Tech Stack */}
        <div>
          <p style={{ fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:11,color:T.t3,letterSpacing:"1.2px",textTransform:"uppercase",marginBottom:10 }}>Tech Stack</p>
          <div style={{ display:"flex",flexDirection:"column",gap:6 }}>
            {company.stacks.map(s => (
              <div key={s} style={{ display:"flex",alignItems:"center",gap:7,padding:"6px 10px",background:T.panel,borderRadius:7,border:`1px solid ${T.b1}` }}>
                <span style={{ width:6,height:6,borderRadius:"50%",background:company.color,flexShrink:0 }} />
                <span style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:12.5,color:T.t1 }}>{s}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Roles */}
        <div>
          <p style={{ fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:11,color:T.t3,letterSpacing:"1.2px",textTransform:"uppercase",marginBottom:10 }}>Roles They Hire</p>
          <div style={{ display:"flex",flexDirection:"column",gap:6 }}>
            {company.roles.map(r => (
              <div key={r} style={{ display:"flex",alignItems:"center",gap:7,padding:"6px 10px",background:`${company.color}0c`,borderRadius:7,border:`1px solid ${company.color}22` }}>
                <Briefcase size={11} color={company.color} />
                <span style={{ fontFamily:"'Syne',sans-serif",fontSize:12.5,color:T.t1,fontWeight:500 }}>{r}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Prep focus */}
        <div>
          <p style={{ fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:11,color:T.t3,letterSpacing:"1.2px",textTransform:"uppercase",marginBottom:10 }}>Prep Focus</p>
          <div style={{ display:"flex",flexDirection:"column",gap:6,marginBottom:16 }}>
            {company.prep.map(p => (
              <div key={p} style={{ display:"flex",alignItems:"center",gap:7,padding:"6px 10px",background:T.panel,borderRadius:7,border:`1px solid ${T.b1}` }}>
                <CheckCircle2 size={11} color={T.green} />
                <span style={{ fontFamily:"'Lora',serif",fontSize:12.5,color:T.t2 }}>{p}</span>
              </div>
            ))}
          </div>
          <a href="/register" style={{ display:"flex",alignItems:"center",justifyContent:"center",gap:6,padding:"9px 16px",borderRadius:9,border:"none",background:company.color,color:"#fff",fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:13,cursor:"pointer",textDecoration:"none",transition:"opacity 0.18s" }} onMouseEnter={e=>e.currentTarget.style.opacity="0.85"} onMouseLeave={e=>e.currentTarget.style.opacity="1"}>
            <Target size={13} /> Start Prep
          </a>
        </div>
      </div>
    </div>
  </motion.div>
);

/* ── CAREERS PAGE ── */
export function Careers() {
  const T = useTheme();
  const [activeTier, setActiveTier] = useState("All");
  const [activeCompany, setActiveCompany] = useState(null);
  const [search, setSearch] = useState("");
  const detailRef = useRef(null);

  const filtered = COMPANIES.filter(c => {
    const tierMatch = activeTier === "All" || c.tier === activeTier;
    const searchMatch = !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.stacks.some(s => s.toLowerCase().includes(search.toLowerCase()));
    return tierMatch && searchMatch;
  });

  const handleCompanyClick = (id) => {
    if (activeCompany === id) { setActiveCompany(null); return; }
    setActiveCompany(id);
    setTimeout(() => detailRef.current?.scrollIntoView({ behavior:"smooth", block:"nearest" }), 80);
  };

  const activeData = COMPANIES.find(c => c.id === activeCompany);

  return (
    <>
      <style>{baseStyles(T) + `
        @media(max-width:768px){ .company-detail-grid{grid-template-columns:1fr!important;} .role-grid{grid-template-columns:1fr 1fr!important;} }
        @media(max-width:480px){ .role-grid{grid-template-columns:1fr!important;} }
      `}</style>
      <div style={{ minHeight:"100vh",background:T.shell,color:T.t1,fontFamily:"'Syne',sans-serif" }}>

        {/* HERO */}
        <section style={{ position:"relative",background:T.deep,padding:"100px 24px 72px",overflow:"hidden",borderBottom:`1px solid ${T.b1}` }}>
          <GridBg T={T} />
          <div style={{ position:"absolute",left:"50%",top:"50%",transform:"translate(-50%,-50%)",width:600,height:360,borderRadius:"50%",background:`radial-gradient(ellipse,${T.gold}18 0%,${T.accent}0c 40%,transparent 70%)`,filter:"blur(50px)",pointerEvents:"none" }} />
          <div style={{ maxWidth:780,margin:"0 auto",position:"relative",textAlign:"center" }}>
            <motion.div initial={{ opacity:0,y:10 }} animate={{ opacity:1,y:0 }} transition={{ delay:0.08 }}>
              <Pill icon={Briefcase} label="Launch Pad · Companies & Careers" color={T.gold} T={T} />
            </motion.div>
            <motion.h1 initial={{ opacity:0,y:18 }} animate={{ opacity:1,y:0 }} transition={{ delay:0.16 }}
              style={{ fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:"clamp(34px,5.5vw,62px)",lineHeight:1.07,letterSpacing:"-1.5px",marginBottom:16,color:T.t1 }}>
              Know Where You're<br/><span style={{ color:T.gold }}>Going.</span> Prepare Accordingly.
            </motion.h1>
            <motion.p initial={{ opacity:0,y:14 }} animate={{ opacity:1,y:0 }} transition={{ delay:0.24 }}
              style={{ fontFamily:"'Lora',serif",fontStyle:"italic",fontSize:"clamp(15px,2vw,18px)",color:T.t2,lineHeight:1.82,maxWidth:520,margin:"0 auto 36px" }}>
              Pick a company that interests you. See exactly what tech stack they use, what roles they hire, and how to prepare — mock interviews, DSA, aptitude and behavioural rounds included.
            </motion.p>
            {/* Stat pills */}
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.34 }}
              style={{ display:"flex",justifyContent:"center",gap:10,flexWrap:"wrap" }}>
              {[{n:"18+",l:"Companies"},{n:"6",l:"Role Tracks"},{n:"6",l:"Prep Areas"},{n:"∞",l:"Mock Practice"}].map((s,i)=>(
                <div key={i} style={{ display:"flex",alignItems:"center",gap:6,padding:"6px 14px",background:T.panel,border:`1px solid ${T.b2}`,borderRadius:8 }}>
                  <span style={{ fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:16,color:T.gold }}>{s.n}</span>
                  <span style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:10.5,color:T.t3 }}>{s.l}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* FILTER BAR */}
        <div style={{ background:T.deep,borderBottom:`1px solid ${T.b1}`,padding:"14px 24px",position:"sticky",top:0,zIndex:50,backdropFilter:"blur(16px)" }}>
          <div style={{ maxWidth:1100,margin:"0 auto",display:"flex",alignItems:"center",gap:10,flexWrap:"wrap" }}>
            {/* Search */}
            <div style={{ position:"relative",flex:1,minWidth:180,maxWidth:260 }}>
              <Search size={13} color={T.t3} style={{ position:"absolute",left:10,top:"50%",transform:"translateY(-50%)" }} />
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search company or stack…"
                style={{ width:"100%",background:T.panel,border:`1px solid ${T.b2}`,borderRadius:8,padding:"7px 10px 7px 30px",fontFamily:"'Syne',sans-serif",fontSize:13,color:T.t1,outline:"none" }}
                onFocus={e=>e.target.style.borderColor=T.accent} onBlur={e=>e.target.style.borderColor=T.b2} />
            </div>
            {/* Tier tabs */}
            <div style={{ display:"flex",gap:4,flexWrap:"wrap" }}>
              {TIERS.map(tier => (
                <button key={tier} onClick={() => { setActiveTier(tier); setActiveCompany(null); }}
                  style={{ padding:"6px 13px",borderRadius:8,border:`1px solid ${activeTier===tier?T.gold+"66":T.b1}`,background:activeTier===tier?`${T.gold}14`:"transparent",color:activeTier===tier?T.gold:T.t2,fontFamily:"'Syne',sans-serif",fontWeight:600,fontSize:12.5,cursor:"pointer",transition:"all 0.15s" }}>
                  {tier}
                </button>
              ))}
            </div>
            {activeCompany && <button onClick={()=>setActiveCompany(null)} style={{ fontFamily:"'Syne',sans-serif",fontSize:12,color:T.t3,background:"none",border:"none",cursor:"pointer",marginLeft:"auto",textDecoration:"underline" }}>Close ×</button>}
          </div>
        </div>

        {/* COMPANY GRID */}
        <section style={{ padding:"44px 24px",background:T.mid }}>
          <div style={{ maxWidth:1100,margin:"0 auto" }}>
            <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:14,marginBottom:28 }}>
              {filtered.map((co,i) => (
                <Reveal key={co.id} delay={i*0.04}>
                  <CompanyCard company={co} T={T} onClick={()=>handleCompanyClick(co.id)} isActive={activeCompany===co.id} />
                </Reveal>
              ))}
              {filtered.length===0 && <div style={{ gridColumn:"1/-1",textAlign:"center",padding:"48px 0",color:T.t3,fontFamily:"'Syne',sans-serif",fontSize:15 }}>No companies match that search.</div>}
            </div>
            {/* Detail */}
            <div ref={detailRef}>
              <AnimatePresence>
                {activeData && <CompanyDetail key={activeData.id} company={activeData} T={T} />}
              </AnimatePresence>
            </div>
          </div>
        </section>

        {/* PREP RESOURCES */}
        <section style={{ padding:"72px 24px",background:T.deep,borderTop:`1px solid ${T.b1}` }}>
          <div style={{ maxWidth:1100,margin:"0 auto" }}>
            <Reveal>
              <div style={{ textAlign:"center",marginBottom:48 }}>
                <Pill icon={Target} label="Preparation Toolkit" color={T.accent} T={T} />
                <h2 style={{ fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:"clamp(26px,4vw,40px)",color:T.t1,letterSpacing:"-0.7px",marginBottom:10 }}>What to Prepare, and How</h2>
                <p style={{ fontFamily:"'Lora',serif",fontStyle:"italic",fontSize:16,color:T.t2,maxWidth:440,margin:"0 auto" }}>Six areas that cover 90% of what any company will test.</p>
              </div>
            </Reveal>
            <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:16 }}>
              {PREP_RESOURCES.map((res,i) => (
                <Reveal key={res.title} delay={i*0.07}>
                  <div style={{ background:T.card,border:`1px solid ${T.b1}`,borderRadius:16,padding:"22px",transition:"all 0.2s",position:"relative",overflow:"hidden" }}
                    onMouseEnter={e=>{e.currentTarget.style.borderColor=`${res.color}44`;e.currentTarget.style.transform="translateY(-3px)";}}
                    onMouseLeave={e=>{e.currentTarget.style.borderColor=T.b1;e.currentTarget.style.transform="translateY(0)";}}>
                    <div style={{ position:"absolute",right:-10,top:-10,width:80,height:80,borderRadius:"50%",background:`${res.color}0a`,pointerEvents:"none" }} />
                    <div style={{ width:42,height:42,borderRadius:12,background:`${res.color}16`,border:`1px solid ${res.color}30`,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:14 }}>
                      <res.icon size={19} color={res.color} />
                    </div>
                    <h3 style={{ fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:16,color:T.t1,marginBottom:8,letterSpacing:"-0.2px" }}>{res.title}</h3>
                    <p style={{ fontFamily:"'Lora',serif",fontSize:13.5,color:T.t2,lineHeight:1.7,marginBottom:14 }}>{res.desc}</p>
                    {/* Topics */}
                    <div style={{ display:"flex",flexWrap:"wrap",gap:5,marginBottom:14 }}>
                      {res.items.map(item => (
                        <span key={item} style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:10,fontWeight:600,padding:"2px 7px",borderRadius:4,background:`${res.color}12`,color:res.color,border:`1px solid ${res.color}25` }}>{item}</span>
                      ))}
                    </div>
                    {/* Platforms */}
                    <div style={{ borderTop:`1px solid ${T.b1}`,paddingTop:10 }}>
                      <p style={{ fontFamily:"'Syne',sans-serif",fontSize:10,fontWeight:700,color:T.t4,letterSpacing:"1px",textTransform:"uppercase",marginBottom:6 }}>Practice On</p>
                      <div style={{ display:"flex",flexWrap:"wrap",gap:4 }}>
                        {res.platforms.map(p => (
                          <span key={p} style={{ fontFamily:"'Syne',sans-serif",fontSize:11.5,fontWeight:600,color:T.t2,padding:"2px 8px",background:T.panel,borderRadius:5,border:`1px solid ${T.b1}` }}>{p}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ROLE TRACKS */}
        <section style={{ padding:"72px 24px",background:T.mid,borderTop:`1px solid ${T.b1}` }}>
          <div style={{ maxWidth:1100,margin:"0 auto" }}>
            <Reveal>
              <div style={{ textAlign:"center",marginBottom:44 }}>
                <Pill icon={Briefcase} label="Role Tracks" color={T.teal} T={T} />
                <h2 style={{ fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:"clamp(26px,4vw,40px)",color:T.t1,letterSpacing:"-0.7px",marginBottom:10 }}>Which Role Is Right For You?</h2>
                <p style={{ fontFamily:"'Lora',serif",fontStyle:"italic",fontSize:16,color:T.t2,maxWidth:440,margin:"0 auto" }}>Match your learning track to a job title — and salary range.</p>
              </div>
            </Reveal>
            <div className="role-grid" style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14 }}>
              {ROLE_TRACKS.map((role,i) => (
                <Reveal key={role.role} delay={i*0.07}>
                  <div style={{ background:T.card,border:`1px solid ${T.b1}`,borderRadius:14,padding:"20px",transition:"all 0.2s" }}
                    onMouseEnter={e=>{e.currentTarget.style.borderColor=`${role.color}44`;e.currentTarget.style.transform="translateY(-3px)";}}
                    onMouseLeave={e=>{e.currentTarget.style.borderColor=T.b1;e.currentTarget.style.transform="translateY(0)";}}>
                    <div style={{ width:38,height:38,borderRadius:10,background:`${role.color}16`,border:`1px solid ${role.color}30`,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:12 }}>
                      <role.icon size={17} color={role.color} />
                    </div>
                    <h3 style={{ fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:15,color:T.t1,marginBottom:6 }}>{role.role}</h3>
                    <p style={{ fontFamily:"'Lora',serif",fontSize:13,color:T.t2,lineHeight:1.6,marginBottom:10 }}>{role.what}</p>
                    <div style={{ display:"flex",flexWrap:"wrap",gap:4,marginBottom:10 }}>
                      {role.stack.map(s=><span key={s} style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:9.5,padding:"2px 6px",borderRadius:4,background:`${role.color}12`,color:role.color,border:`1px solid ${role.color}25` }}>{s}</span>)}
                    </div>
                    <div style={{ padding:"7px 10px",background:T.panel,borderRadius:7,border:`1px solid ${T.b1}` }}>
                      <span style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:T.teal,fontWeight:600 }}>{role.salary}</span>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section style={{ padding:"80px 24px",background:T.deep,position:"relative",overflow:"hidden" }}>
          <div style={{ position:"absolute",left:"50%",top:"50%",transform:"translate(-50%,-50%)",width:600,height:300,borderRadius:"50%",background:`radial-gradient(ellipse,${T.gold}14 0%,transparent 70%)`,filter:"blur(40px)",pointerEvents:"none" }} />
          <GridBg T={T} />
          <Reveal>
            <div style={{ maxWidth:520,margin:"0 auto",textAlign:"center",position:"relative" }}>
              <h2 style={{ fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:"clamp(28px,4.5vw,46px)",color:T.t1,marginBottom:14,letterSpacing:"-0.9px",lineHeight:1.1 }}>
                The Dream Company.<br/><span style={{ color:T.gold }}>Start Today.</span>
              </h2>
              <p style={{ fontFamily:"'Lora',serif",fontStyle:"italic",fontSize:16.5,color:T.t2,lineHeight:1.8,marginBottom:34 }}>Start learning the exact stack your target company uses — inside Code Journey, for free.</p>
              <div style={{ display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap" }}>
                <a href="/register" style={{ display:"inline-flex",alignItems:"center",gap:8,padding:"13px 28px",borderRadius:12,border:"none",background:T.gold,color:"#000",fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:15,cursor:"pointer",textDecoration:"none",boxShadow:`0 0 36px ${T.gold}50`,transition:"all 0.18s",animation:"cjGlow 3s ease infinite" }}>
                  <Zap size={15} /> Start Preparing Free
                </a>
                <a href="/languages" style={{ display:"inline-flex",alignItems:"center",gap:7,padding:"13px 22px",borderRadius:12,border:`1px solid ${T.b2}`,background:"transparent",color:T.t1,fontFamily:"'Syne',sans-serif",fontWeight:600,fontSize:15,cursor:"pointer",textDecoration:"none",transition:"all 0.18s" }} onMouseEnter={e=>{e.currentTarget.style.background=T.hover}} onMouseLeave={e=>{e.currentTarget.style.background="transparent"}}>
                  Browse Languages <ArrowRight size={15}/>
                </a>
              </div>
            </div>
          </Reveal>
        </section>

      </div>
    </>
  );
}

/* ══════════════════════════════════════════════════════════════
   ███████╗ ██████╗ ██████╗ ███████╗██╗   ██╗███████╗████████╗███████╗███╗   ███╗
   ██╔════╝██╔════╝██╔═══██╗██╔════╝╚██╗ ██╔╝██╔════╝╚══██╔══╝██╔════╝████╗ ████║
   █████╗  ██║     ██║   ██║███████╗ ╚████╔╝ ███████╗   ██║   █████╗  ██╔████╔██║
   ██╔══╝  ██║     ██║   ██║╚════██║  ╚██╔╝  ╚════██║   ██║   ██╔══╝  ██║╚██╔╝██║
   ███████╗╚██████╗╚██████╔╝███████║   ██║   ███████║   ██║   ███████╗██║ ╚═╝ ██║
   ╚══════╝ ╚═════╝ ╚═════╝ ╚══════╝   ╚═╝   ╚══════╝   ╚═╝   ╚══════╝╚═╝     ╚═╝

   PAGE 2 — THE ECOSYSTEM (Extended Languages, Frameworks, Modules)
══════════════════════════════════════════════════════════════ */

const ECO_TABS = [
  { id:"languages",  label:"Languages",  icon:Code2,     color:"#7c6ee0" },
  { id:"frameworks", label:"Frameworks", icon:Layers,    color:"#5eead4" },
  { id:"databases",  label:"Databases",  icon:Database,  color:"#f472b6" },
  { id:"tools",      label:"Dev Tools",  icon:Terminal,  color:"#fbbf24" },
  { id:"modules",    label:"Key Modules",icon:Package,   color:"#22c55e" },
  { id:"cloud",      label:"Cloud & Ops",icon:Cloud,     color:"#38bdf8" },
];

const ECO_DATA = {
  languages: [
    { name:"JavaScript",color:"#f7df1e",bg:"#1a1800",icon:"JS",maturity:"Mature",use:"Web · Full-stack · Scripting",desc:"The only language that runs natively in every browser. Also runs on the server via Node.js. Ubiquitous." },
    { name:"TypeScript",color:"#60a5fa",bg:"#00111f",icon:"TS",maturity:"Mature",use:"Web · Full-stack · Large Codebases",desc:"JavaScript with static types. Catches bugs before runtime. Now the industry default for serious JS projects." },
    { name:"Python",    color:"#4ade80",bg:"#0a1f0a",icon:"Py",maturity:"Mature",use:"Data Science · AI/ML · Scripting · Web",desc:"The most readable general-purpose language. Dominates AI, data science, and automation." },
    { name:"Rust",      color:"#f97316",bg:"#1a0a00",icon:"Rs",maturity:"Growing",use:"Systems · WebAssembly · Embedded",desc:"Memory-safe systems programming without a garbage collector. Fastest-growing loved language 8 years running." },
    { name:"Go",        color:"#00d4ff",bg:"#001820",icon:"Go",maturity:"Mature",use:"Backend · Cloud · CLIs · DevOps",desc:"Designed by Google for simplicity and performance. Powers Kubernetes, Docker, Terraform and most cloud tooling." },
    { name:"Kotlin",    color:"#a78bfa",bg:"#0c0c1a",icon:"Kt",maturity:"Mature",use:"Android · Backend (JVM)",desc:"Google's preferred Android language. Concise, safe, and 100% interoperable with Java." },
    { name:"Swift",     color:"#f97316",bg:"#1a0a00",icon:"Sw",maturity:"Mature",use:"iOS · macOS · Server-side",desc:"Apple's language for the entire Apple platform. Fast, safe, and expressive." },
    { name:"Dart",      color:"#5eead4",bg:"#001a17",icon:"Dt",maturity:"Growing",use:"Mobile · Web · Desktop (Flutter)",desc:"Google's language for Flutter. Compiles to native ARM, web and desktop with a single codebase." },
    { name:"R",         color:"#f472b6",bg:"#1a0011",icon:"R",maturity:"Mature",use:"Statistics · Data Science · Bioinformatics",desc:"The language of academic statistics. Unmatched for data analysis, econometrics and research reporting." },
    { name:"C++",       color:"#60a5fa",bg:"#00111f",icon:"C++",maturity:"Mature",use:"Systems · Game Dev · Embedded · HFT",desc:"The language of performance. Every game engine, operating system kernel and low-latency trading system uses it." },
    { name:"Ruby",      color:"#f87171",bg:"#1a0000",icon:"Rb",maturity:"Mature",use:"Web (Rails) · Scripting · Automation",desc:"Developer happiness as a design principle. Ruby on Rails invented many conventions that modern web still follows." },
    { name:"Scala",     color:"#ff7043",bg:"#1a0500",icon:"Sc",maturity:"Mature",use:"Big Data · Backend (JVM) · Functional",desc:"Functional + OOP on the JVM. Powers Apache Spark — the standard for big data processing." },
    { name:"PHP",       color:"#818cf8",bg:"#0c0c1a",icon:"PHP",maturity:"Mature",use:"Web · CMS · Server-side",desc:"Powers 78% of the web including WordPress. Laravel makes modern PHP actually enjoyable." },
    { name:"C#",        color:"#7c6ee0",bg:"#0f0a1a",icon:"C#",maturity:"Mature",use:"Game Dev (Unity) · Enterprise · Web",desc:"Microsoft's flagship language. Essential for Unity game development and enterprise .NET applications." },
    { name:"Elixir",    color:"#a78bfa",bg:"#0c0c1a",icon:"Ex",maturity:"Growing",use:"Real-time · Distributed · APIs",desc:"Built on Erlang's VM. Extraordinary for real-time, fault-tolerant distributed systems. WhatsApp's secret weapon." },
    { name:"Zig",       color:"#f7df1e",bg:"#1a1800",icon:"Zg",maturity:"Emerging",use:"Systems · Embedded · WASM",desc:"A next-generation systems language that aims to replace C. No hidden control flow, no hidden allocations." },
  ],
  frameworks: [
    { name:"React",     color:"#61dafb",bg:"#001820",icon:"⚛",use:"Web UI",stack:"JavaScript/TypeScript",desc:"Meta's declarative UI library. The most widely used frontend framework. Component-based, virtual DOM, massive ecosystem." },
    { name:"Next.js",   color:"#fff",bg:"#0a0a0a",icon:"N↗",use:"Full-stack Web",stack:"JavaScript/TypeScript",desc:"React framework with server-side rendering, file-based routing and API routes. The default for production React apps." },
    { name:"Vue.js",    color:"#4ade80",bg:"#0a1f0a",icon:"V",use:"Web UI",stack:"JavaScript/TypeScript",desc:"Progressive framework for building UIs. Gentler learning curve than React. Extremely popular in Asia and Europe." },
    { name:"Angular",   color:"#f87171",bg:"#1a0000",icon:"▲",use:"Enterprise Web",stack:"TypeScript",desc:"Google's batteries-included framework. Opinionated, structured, and the choice for large enterprise SPAs." },
    { name:"Django",    color:"#4ade80",bg:"#0a1f0a",icon:"Dj",use:"Web Backend",stack:"Python",desc:"The 'batteries included' Python web framework. Instagram, Pinterest and Disqus were all built on Django." },
    { name:"FastAPI",   color:"#38bdf8",bg:"#001220",icon:"FA",use:"APIs",stack:"Python",desc:"Modern, fast Python API framework based on type hints. Auto-generates OpenAPI docs. Fastest-growing Python framework." },
    { name:"Spring Boot",color:"#4ade80",bg:"#0a1f0a",icon:"Sp",use:"Enterprise Backend",stack:"Java/Kotlin",desc:"The standard Java backend framework. Powers a vast amount of enterprise software worldwide." },
    { name:"Flutter",   color:"#38bdf8",bg:"#001220",icon:"⬡",use:"Mobile · Web · Desktop",stack:"Dart",desc:"Google's cross-platform UI toolkit. One codebase, native performance on iOS, Android, web and desktop." },
    { name:"Express.js",color:"#f7df1e",bg:"#1a1800",icon:"Ex",use:"Web Backend",stack:"Node.js / JavaScript",desc:"Minimal, unopinionated Node.js framework. The foundation for most Node backend APIs." },
    { name:"Ruby on Rails",color:"#f87171",bg:"#1a0000",icon:"RR",use:"Full-stack Web",stack:"Ruby",desc:"Convention over configuration. Invented migrations, REST conventions and MVC for the web world." },
    { name:"Laravel",   color:"#f97316",bg:"#1a0a00",icon:"Lv",use:"Full-stack Web",stack:"PHP",desc:"Elegant PHP framework with batteries included — ORM, queues, authentication, and a thriving ecosystem." },
    { name:"Svelte",    color:"#ff7043",bg:"#1a0500",icon:"S",use:"Web UI",stack:"JavaScript",desc:"No virtual DOM — compiles to tiny, fast vanilla JS. The highest developer satisfaction of any frontend framework." },
    { name:"Remix",     color:"#818cf8",bg:"#0c0c1a",icon:"Re",use:"Full-stack Web",stack:"JavaScript/TypeScript",desc:"Full-stack React framework focused on web fundamentals — forms, nested routing, and progressive enhancement." },
    { name:"NestJS",    color:"#f87171",bg:"#1a0000",icon:"Nt",use:"Backend APIs",stack:"TypeScript / Node.js",desc:"Angular-inspired backend framework for Node.js. Strongly typed, dependency-injected, enterprise-ready." },
  ],
  databases: [
    { name:"PostgreSQL",color:"#60a5fa",bg:"#00111f",icon:"PG",type:"Relational",model:"SQL",desc:"The world's most advanced open-source relational database. JSON support, full-text search, and rock-solid ACID compliance." },
    { name:"MySQL",     color:"#f97316",bg:"#1a0a00",icon:"My",type:"Relational",model:"SQL",desc:"The world's most popular open-source database. Powers WordPress, Facebook (historically) and half the internet." },
    { name:"MongoDB",   color:"#4ade80",bg:"#0a1f0a",icon:"Mo",type:"Document",model:"NoSQL",desc:"Schema-flexible document database. Stores JSON-like documents. Great for rapid prototyping and variable data shapes." },
    { name:"Redis",     color:"#f87171",bg:"#1a0000",icon:"Rd",type:"In-Memory",model:"Key-Value",desc:"Blazing fast in-memory data store. Used for caching, sessions, pub/sub and real-time leaderboards." },
    { name:"SQLite",    color:"#a78bfa",bg:"#0c0c1a",icon:"SL",type:"Embedded",model:"SQL",desc:"Zero-config file-based relational database. Ships inside every iOS/Android app and most desktop software." },
    { name:"Supabase",  color:"#4ade80",bg:"#0a1f0a",icon:"Su",type:"BaaS",model:"SQL + REST",desc:"Open-source Firebase alternative on top of PostgreSQL. Instant APIs, auth, real-time subscriptions." },
    { name:"Firebase",  color:"#fbbf24",bg:"#1a1200",icon:"Fb",type:"BaaS",model:"NoSQL + Real-time",desc:"Google's mobile/web backend platform. Real-time database, auth, hosting and cloud functions in one package." },
    { name:"Cassandra", color:"#38bdf8",bg:"#001220",icon:"Ca",type:"Wide-Column",model:"NoSQL",desc:"Handles enormous write throughput. Powers Netflix, Instagram's DM inbox and Apple's infrastructure." },
    { name:"ClickHouse",color:"#f97316",bg:"#1a0a00",icon:"CH",type:"Analytical",model:"Columnar SQL",desc:"Lightning-fast OLAP database for analytics queries. Used by Cloudflare, Spotify and ByteDance." },
  ],
  tools: [
    { name:"Git",         color:"#f97316",bg:"#1a0a00",icon:"⎇",category:"Version Control",desc:"The universal version control system. Every professional developer uses Git daily. Non-negotiable." },
    { name:"Docker",      color:"#38bdf8",bg:"#001220",icon:"🐋",category:"Containerisation",desc:"Package applications and dependencies into portable containers. The standard for consistent deployment environments." },
    { name:"Kubernetes",  color:"#60a5fa",bg:"#00111f",icon:"☸",category:"Orchestration",desc:"Google's open-source container orchestrator. Automates deployment, scaling and management of containerised apps." },
    { name:"GitHub",      color:"#e8eaf2",bg:"#0a0a0f",icon:"GH",category:"Code Hosting",desc:"The world's largest code hosting platform. Pull requests, Actions CI/CD, and code review all live here." },
    { name:"VS Code",     color:"#60a5fa",bg:"#00111f",icon:"◈",category:"Editor",desc:"Microsoft's free, open-source editor. The most popular IDE on Earth. Runs even in the browser." },
    { name:"Terraform",   color:"#a78bfa",bg:"#0c0c1a",icon:"TF",category:"Infrastructure as Code",desc:"Declarative infrastructure provisioning. Define cloud resources in code; Terraform makes it real." },
    { name:"Webpack",     color:"#60a5fa",bg:"#00111f",icon:"W",category:"Bundler",desc:"Module bundler for JavaScript. Packs assets, code-splits, and tree-shakes — the backbone of most web build systems." },
    { name:"Vite",        color:"#fbbf24",bg:"#1a1200",icon:"V⚡",category:"Build Tool",desc:"Next-generation frontend tooling. Instant dev server, HMR, and fast production builds. Replacing Webpack in most new projects." },
    { name:"Postman",     color:"#f97316",bg:"#1a0a00",icon:"PM",category:"API Testing",desc:"API design, testing and documentation in one tool. Every backend developer needs this." },
    { name:"Figma",       color:"#f472b6",bg:"#1a0011",icon:"Fig",category:"Design",desc:"Collaborative UI design in the browser. The industry standard for product design and developer handoff." },
    { name:"Linux",       color:"#fbbf24",bg:"#1a1200",icon:"🐧",category:"OS",desc:"The operating system of the internet. Every cloud server, Android phone and supercomputer runs Linux." },
    { name:"Nginx",       color:"#4ade80",bg:"#0a1f0a",icon:"Nx",category:"Web Server",desc:"High-performance web server and reverse proxy. Serves more than 30% of the world's websites." },
  ],
  modules: [
    { name:"NumPy",          lang:"Python",color:"#4ade80",bg:"#0a1f0a",desc:"The foundation of Python data science. Fast, vectorised N-dimensional arrays and mathematical functions." },
    { name:"Pandas",         lang:"Python",color:"#4ade80",bg:"#0a1f0a",desc:"DataFrames for tabular data. Load, filter, group, merge and transform datasets with an expressive API." },
    { name:"Scikit-learn",   lang:"Python",color:"#f97316",bg:"#1a0a00",desc:"Machine learning for Python. Classification, regression, clustering, and model evaluation in a consistent API." },
    { name:"TensorFlow",     lang:"Python",color:"#f97316",bg:"#1a0a00",desc:"Google's open-source machine learning framework. The industry standard for production ML deployments." },
    { name:"PyTorch",        lang:"Python",color:"#f87171",bg:"#1a0000",desc:"Meta's dynamic computation graph framework. The researcher's choice for cutting-edge deep learning." },
    { name:"Matplotlib",     lang:"Python",color:"#60a5fa",bg:"#00111f",desc:"The foundational Python visualisation library. Line charts, scatter plots, histograms, heatmaps and more." },
    { name:"Axios",          lang:"JavaScript",color:"#f7df1e",bg:"#1a1800",desc:"Promise-based HTTP client for browsers and Node.js. The most popular way to make API requests in JS." },
    { name:"Lodash",         lang:"JavaScript",color:"#f7df1e",bg:"#1a1800",desc:"Utility library with 200+ functions for working with arrays, objects and strings. Makes JS feel complete." },
    { name:"Prisma",         lang:"TypeScript",color:"#60a5fa",bg:"#00111f",desc:"Next-generation ORM for TypeScript and Node.js. Type-safe database access with auto-generated types." },
    { name:"Zod",            lang:"TypeScript",color:"#60a5fa",bg:"#00111f",desc:"TypeScript-first schema validation. Parse and validate any data at runtime with a beautiful, composable API." },
    { name:"ggplot2",        lang:"R",color:"#f472b6",bg:"#1a0011",desc:"The grammar of graphics for R. Build layered, publication-quality data visualisations declaratively." },
    { name:"dplyr",          lang:"R",color:"#f472b6",bg:"#1a0011",desc:"Tidyverse data manipulation — filter, select, mutate, group_by, summarise. The standard for R data work." },
    { name:"Tokio",          lang:"Rust",color:"#f97316",bg:"#1a0a00",desc:"Async runtime for Rust. Powers some of the world's highest-throughput network services." },
    { name:"Serde",          lang:"Rust",color:"#f97316",bg:"#1a0a00",desc:"Serialisation/deserialisation framework for Rust. Handles JSON, TOML, YAML with zero-copy efficiency." },
    { name:"http (Dart)",    lang:"Dart",color:"#5eead4",bg:"#001a17",desc:"The official Dart package for HTTP requests. Simple, clean API for REST calls in Flutter apps." },
    { name:"Kotlinx Coroutines",lang:"Kotlin",color:"#a78bfa",bg:"#0c0c1a",desc:"Official Kotlin async library. Lightweight threads (coroutines) and Flow for reactive streams." },
  ],
  cloud: [
    { name:"AWS",           color:"#f97316",bg:"#1a0a00",icon:"AWS",provider:"Amazon",desc:"The largest cloud platform with 200+ services. EC2, S3, Lambda, RDS, SageMaker — the industry default." },
    { name:"Google Cloud",  color:"#4285f4",bg:"#00111f",icon:"GCP",provider:"Google",desc:"Google's cloud. Strong in ML/AI (Vertex AI, BigQuery) and Kubernetes (they invented it). Competitive pricing." },
    { name:"Azure",         color:"#00a4ef",bg:"#001220",icon:"Az",provider:"Microsoft",desc:"Microsoft's cloud. Dominant in enterprise and .NET environments. Best Azure Active Directory integration." },
    { name:"Vercel",        color:"#e8eaf2",bg:"#0a0a0f",icon:"▲",provider:"Vercel",desc:"The best deployment platform for frontend and serverless. Zero-config deploys for Next.js, React and more." },
    { name:"Supabase",      color:"#4ade80",bg:"#0a1f0a",icon:"Su",provider:"Supabase",desc:"Open-source Firebase alternative. PostgreSQL + auth + real-time + storage. Free tier is genuinely generous." },
    { name:"Cloudflare",    color:"#f97316",bg:"#1a0a00",icon:"CF",provider:"Cloudflare",desc:"CDN, DNS, Workers (edge functions), R2 storage and DDoS protection. Runs at the edge, globally." },
    { name:"Railway",       color:"#a78bfa",bg:"#0c0c1a",icon:"Ry",provider:"Railway",desc:"Deploy backends with a single command. Supports any language, Postgres included. Best DX for indie developers." },
    { name:"GitHub Actions",color:"#e8eaf2",bg:"#0a0a0f",icon:"⚙",provider:"GitHub",desc:"CI/CD built into GitHub. Run tests, build Docker images, deploy — all on every push." },
  ],
};

/* ── Ecosystem card ── */
const EcoCard = ({ item, activeTab, T }) => {
  const [hov, setHov] = useState(false);
  const color = item.color;
  return (
    <motion.div layout initial={{ opacity:0,scale:0.97 }} animate={{ opacity:1,scale:1 }} exit={{ opacity:0,scale:0.97 }} transition={{ duration:0.2 }}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ background:hov?`${color}0e`:T.card,border:`1px solid ${hov?color+"44":T.b1}`,borderRadius:14,padding:"18px",transition:"all 0.18s",cursor:"default",position:"relative",overflow:"hidden" }}>
      {/* Top bar */}
      <div style={{ position:"absolute",top:0,left:0,right:0,height:2,background:color,opacity:hov?0.8:0.25,transition:"opacity 0.18s",borderRadius:"14px 14px 0 0" }} />
      {/* Background watermark */}
      <div style={{ position:"absolute",right:-8,bottom:-8,fontSize:48,fontFamily:"'JetBrains Mono',monospace",color:color,opacity:0.04,fontWeight:700,userSelect:"none",pointerEvents:"none",lineHeight:1 }}>{item.icon||item.name?.charAt(0)}</div>

      {/* Header */}
      <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:10 }}>
        {item.icon && (
          <div style={{ width:34,height:34,borderRadius:9,background:item.bg||`${color}14`,border:`1px solid ${color}44`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color,fontFamily:"'JetBrains Mono',monospace",flexShrink:0 }}>
            {typeof item.icon==="string"?item.icon:""}
          </div>
        )}
        <div>
          <p style={{ fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:14.5,color:T.t1,margin:"0 0 2px" }}>{item.name}</p>
          {(item.use||item.type||item.category||item.lang||item.provider) && (
            <span style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:10,color,fontWeight:600 }}>{item.use||item.type||item.category||item.lang||item.provider}</span>
          )}
        </div>
        {item.maturity && (
          <span style={{ marginLeft:"auto",fontFamily:"'JetBrains Mono',monospace",fontSize:9,fontWeight:700,padding:"2px 6px",borderRadius:4,background:`${color}14`,color,border:`1px solid ${color}25`,flexShrink:0 }}>{item.maturity}</span>
        )}
        {item.model && (
          <span style={{ marginLeft:"auto",fontFamily:"'JetBrains Mono',monospace",fontSize:9,fontWeight:700,padding:"2px 6px",borderRadius:4,background:`${color}14`,color,border:`1px solid ${color}25`,flexShrink:0 }}>{item.model}</span>
        )}
        {item.stack && (
          <span style={{ marginLeft:"auto",fontFamily:"'JetBrains Mono',monospace",fontSize:9,fontWeight:700,padding:"2px 6px",borderRadius:4,background:T.panel,color:T.t3,border:`1px solid ${T.b1}`,flexShrink:0,maxWidth:90,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{item.stack}</span>
        )}
      </div>
      <p style={{ fontFamily:"'Lora',serif",fontSize:13,color:T.t2,lineHeight:1.68,margin:0 }}>{item.desc}</p>
    </motion.div>
  );
};

/* ── ECOSYSTEM PAGE ── */
export function Ecosystem() {
  const T = useTheme();
  const [activeTab, setActiveTab] = useState("languages");
  const [search, setSearch] = useState("");

  const tabData = ECO_DATA[activeTab] || [];
  const filtered = search
    ? tabData.filter(item => item.name.toLowerCase().includes(search.toLowerCase()) || item.desc.toLowerCase().includes(search.toLowerCase()) || (item.lang||"").toLowerCase().includes(search.toLowerCase()))
    : tabData;

  const activeTabCfg = ECO_TABS.find(t => t.id === activeTab);

  return (
    <>
      <style>{baseStyles(T) + `
        .eco-tabs::-webkit-scrollbar{height:3px;}
        @media(max-width:600px){ .eco-grid{grid-template-columns:1fr!important;} }
      `}</style>
      <div style={{ minHeight:"100vh",background:T.shell,color:T.t1,fontFamily:"'Syne',sans-serif" }}>

        {/* HERO */}
        <section style={{ position:"relative",background:T.deep,padding:"100px 24px 72px",overflow:"hidden",borderBottom:`1px solid ${T.b1}` }}>
          <GridBg T={T} />
          <div style={{ position:"absolute",left:"50%",top:"50%",transform:"translate(-50%,-50%)",width:600,height:360,borderRadius:"50%",background:`radial-gradient(ellipse,${T.teal}18 0%,${T.accent}0c 40%,transparent 70%)`,filter:"blur(50px)",pointerEvents:"none" }} />

          <div style={{ maxWidth:800,margin:"0 auto",position:"relative",textAlign:"center" }}>
            <motion.div initial={{ opacity:0,y:10 }} animate={{ opacity:1,y:0 }} transition={{ delay:0.08 }}>
              <Pill icon={Boxes} label="The Ecosystem · Languages, Frameworks & Tools" color={T.teal} T={T} />
            </motion.div>
            <motion.h1 initial={{ opacity:0,y:18 }} animate={{ opacity:1,y:0 }} transition={{ delay:0.16 }}
              style={{ fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:"clamp(34px,5.5vw,62px)",lineHeight:1.07,letterSpacing:"-1.5px",marginBottom:16,color:T.t1 }}>
              The Full Picture.<br/><span style={{ color:T.teal }}>Every Piece</span> That Matters.
            </motion.h1>
            <motion.p initial={{ opacity:0,y:14 }} animate={{ opacity:1,y:0 }} transition={{ delay:0.24 }}
              style={{ fontFamily:"'Lora',serif",fontStyle:"italic",fontSize:"clamp(15px,2vw,18px)",color:T.t2,lineHeight:1.82,maxWidth:540,margin:"0 auto 36px" }}>
              16 languages. 14 frameworks. 9 databases. 12 dev tools. 16 key modules. The modern software ecosystem — organised, described, and linked to where you learn each one.
            </motion.p>

            {/* Animated count row */}
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.34 }}
              style={{ display:"flex",justifyContent:"center",gap:8,flexWrap:"wrap" }}>
              {ECO_TABS.map(tab => (
                <div key={tab.id} style={{ display:"flex",alignItems:"center",gap:5,padding:"5px 12px",background:T.panel,border:`1px solid ${T.b2}`,borderRadius:8 }}>
                  <tab.icon size={12} color={tab.color} />
                  <span style={{ fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:13,color:T.t1 }}>{ECO_DATA[tab.id]?.length}</span>
                  <span style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:T.t3 }}>{tab.label}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* TABS + SEARCH BAR */}
        <div style={{ background:T.deep,borderBottom:`1px solid ${T.b1}`,position:"sticky",top:0,zIndex:50,backdropFilter:"blur(16px)" }}>
          <div style={{ maxWidth:1100,margin:"0 auto",padding:"0 24px" }}>
            <div style={{ display:"flex",alignItems:"center",gap:8,flexWrap:"wrap" }}>
              {/* Tabs */}
              <div className="eco-tabs" style={{ display:"flex",gap:2,overflowX:"auto",flex:1,paddingTop:4 }}>
                {ECO_TABS.map(tab => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button key={tab.id} onClick={() => { setActiveTab(tab.id); setSearch(""); }}
                      style={{ display:"flex",alignItems:"center",gap:6,padding:"9px 16px",borderRadius:"9px 9px 0 0",border:"none",cursor:"pointer",background:isActive?`${tab.color}16`:"transparent",color:isActive?tab.color:T.t2,fontFamily:"'Syne',sans-serif",fontWeight:isActive?700:500,fontSize:13,transition:"all 0.15s",borderBottom:isActive?`2px solid ${tab.color}`:"2px solid transparent",flexShrink:0 }}>
                      <tab.icon size={14} />
                      {tab.label}
                    </button>
                  );
                })}
              </div>
              {/* Search */}
              <div style={{ position:"relative",minWidth:180 }}>
                <Search size={13} color={T.t3} style={{ position:"absolute",left:9,top:"50%",transform:"translateY(-50%)" }} />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder={`Search ${activeTabCfg?.label}…`}
                  style={{ width:"100%",background:T.panel,border:`1px solid ${T.b2}`,borderRadius:8,padding:"7px 10px 7px 28px",fontFamily:"'Syne',sans-serif",fontSize:12.5,color:T.t1,outline:"none" }}
                  onFocus={e=>e.target.style.borderColor=activeTabCfg?.color||T.accent} onBlur={e=>e.target.style.borderColor=T.b2} />
              </div>
            </div>
          </div>
        </div>

        {/* GRID */}
        <AnimatePresence mode="wait">
          <motion.section key={activeTab}
            initial={{ opacity:0,y:10 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0,y:-8 }} transition={{ duration:0.2 }}
            style={{ padding:"48px 24px",background:T.mid }}>
            <div style={{ maxWidth:1100,margin:"0 auto" }}>
              {/* Section header */}
              <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:28 }}>
                <div style={{ width:3,height:22,borderRadius:2,background:activeTabCfg?.color }} />
                <activeTabCfg.icon size={18} color={activeTabCfg?.color} />
                <h2 style={{ fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:20,color:T.t1,margin:0 }}>{activeTabCfg?.label}</h2>
                <span style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:T.t3 }}>{filtered.length} entries</span>
                {search && <button onClick={()=>setSearch("")} style={{ marginLeft:"auto",fontFamily:"'Syne',sans-serif",fontSize:12,color:T.t3,background:"none",border:"none",cursor:"pointer",textDecoration:"underline" }}>Clear</button>}
              </div>

              {filtered.length === 0 ? (
                <div style={{ textAlign:"center",padding:"48px 0",color:T.t3,fontFamily:"'Syne',sans-serif" }}>Nothing matched. Try a different search.</div>
              ) : (
                <motion.div layout className="eco-grid" style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:14 }}>
                  <AnimatePresence>
                    {filtered.map((item, i) => (
                      <Reveal key={item.name} delay={i*0.03}>
                        <EcoCard item={item} activeTab={activeTab} T={T} />
                      </Reveal>
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}
            </div>
          </motion.section>
        </AnimatePresence>

        {/* RELATIONSHIPS MAP — horizontal scroll strip */}
        <section style={{ padding:"60px 0",background:T.deep,borderTop:`1px solid ${T.b1}`,overflow:"hidden" }}>
          <div style={{ maxWidth:1100,margin:"0 auto",padding:"0 24px",marginBottom:24 }}>
            <Reveal>
              <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:6 }}>
                <Network size={16} color={T.accent} />
                <h3 style={{ fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:18,color:T.t1,margin:0 }}>Language → Ecosystem</h3>
              </div>
              <p style={{ fontFamily:"'Lora',serif",fontStyle:"italic",fontSize:14.5,color:T.t2 }}>Each language has a flagship framework, preferred database, and a key module that defines how the community works.</p>
            </Reveal>
          </div>
          <div style={{ overflowX:"auto",paddingBottom:12 }}>
            <div style={{ display:"flex",gap:14,padding:"0 24px",width:"max-content" }}>
              {[
                { lang:"JavaScript", color:"#f7df1e", fw:"React / Next.js", db:"MongoDB / PostgreSQL", module:"Axios / Lodash" },
                { lang:"TypeScript", color:"#60a5fa", fw:"Angular / NestJS",  db:"PostgreSQL",          module:"Zod / Prisma" },
                { lang:"Python",     color:"#4ade80", fw:"FastAPI / Django",  db:"PostgreSQL / Redis",  module:"Pandas / Scikit-learn" },
                { lang:"Go",         color:"#00d4ff", fw:"Gin / Echo",        db:"PostgreSQL / Redis",  module:"GORM / Cobra" },
                { lang:"Rust",       color:"#f97316", fw:"Axum / Actix",      db:"SQLite / PostgreSQL", module:"Tokio / Serde" },
                { lang:"Kotlin",     color:"#a78bfa", fw:"Spring Boot / Ktor",db:"PostgreSQL / MySQL",  module:"Coroutines / Ktor-client" },
                { lang:"Dart",       color:"#5eead4", fw:"Flutter",           db:"Firebase / SQLite",   module:"http / dio" },
                { lang:"R",          color:"#f472b6", fw:"Shiny",             db:"PostgreSQL",          module:"ggplot2 / dplyr" },
              ].map((row, i) => (
                <motion.div key={row.lang} initial={{ opacity:0,x:20 }} whileInView={{ opacity:1,x:0 }} viewport={{ once:true }} transition={{ delay:i*0.06 }}
                  style={{ background:T.card,border:`1px solid ${row.color}33`,borderRadius:14,padding:"18px 20px",minWidth:220,flexShrink:0 }}>
                  <div style={{ fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:16,color:row.color,marginBottom:12 }}>{row.lang}</div>
                  {[{label:"Framework",val:row.fw},{label:"Database",val:row.db},{label:"Module",val:row.module}].map(r=>(
                    <div key={r.label} style={{ marginBottom:8 }}>
                      <p style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:T.t4,textTransform:"uppercase",letterSpacing:"1px",margin:"0 0 2px" }}>{r.label}</p>
                      <p style={{ fontFamily:"'Syne',sans-serif",fontSize:12.5,color:T.t1,margin:0,fontWeight:500 }}>{r.val}</p>
                    </div>
                  ))}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* LEARNING PATH NUDGE */}
        <section style={{ padding:"72px 24px",background:T.mid,borderTop:`1px solid ${T.b1}` }}>
          <div style={{ maxWidth:1100,margin:"0 auto" }}>
            <Reveal>
              <div style={{ textAlign:"center",marginBottom:36 }}>
                <Pill icon={Sparkles} label="Where to Start" color={T.gold} T={T} />
                <h2 style={{ fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:"clamp(24px,4vw,38px)",color:T.t1,letterSpacing:"-0.7px",marginBottom:10 }}>Don't Learn Everything. Learn the Right Things.</h2>
                <p style={{ fontFamily:"'Lora',serif",fontStyle:"italic",fontSize:16,color:T.t2,maxWidth:480,margin:"0 auto" }}>The ecosystem looks enormous — and it is. But you only need a tiny slice of it to get your first job.</p>
              </div>
            </Reveal>
            <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:14 }}>
              {[
                { track:"Web Dev",  path:["HTML → CSS","JavaScript","TypeScript","React","Node.js + Express","PostgreSQL"],  color:"#7c6ee0", icon:Globe },
                { track:"App Dev",  path:["Dart basics","Flutter widgets","State management","REST APIs","Firebase/SQLite"],  color:"#5eead4", icon:Smartphone },
                { track:"Data Sci", path:["Python basics","NumPy + Pandas","Matplotlib","SQL","Scikit-learn","A/B Testing"],  color:"#f472b6", icon:BarChart2 },
              ].map((item,i) => (
                <Reveal key={item.track} delay={i*0.1}>
                  <div style={{ background:T.card,border:`1px solid ${item.color}33`,borderRadius:16,padding:"24px",position:"relative",overflow:"hidden" }}>
                    <div style={{ position:"absolute",top:-16,right:-16,width:80,height:80,borderRadius:"50%",background:`${item.color}0c`,pointerEvents:"none" }} />
                    <div style={{ display:"flex",alignItems:"center",gap:9,marginBottom:18 }}>
                      <div style={{ width:38,height:38,borderRadius:10,background:`${item.color}16`,border:`1px solid ${item.color}30`,display:"flex",alignItems:"center",justifyContent:"center" }}>
                        <item.icon size={17} color={item.color} />
                      </div>
                      <h3 style={{ fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:16,color:T.t1,margin:0 }}>{item.track} Path</h3>
                    </div>
                    <div style={{ display:"flex",flexDirection:"column",gap:0 }}>
                      {item.path.map((step,si) => (
                        <div key={step} style={{ display:"flex",alignItems:"center",gap:10 }}>
                          <div style={{ display:"flex",flexDirection:"column",alignItems:"center",width:20,flexShrink:0 }}>
                            <div style={{ width:8,height:8,borderRadius:"50%",background:si===0?item.color:T.b3,border:`1.5px solid ${si===0?item.color:T.b2}`,zIndex:1 }} />
                            {si < item.path.length-1 && <div style={{ width:1,height:24,background:T.b2 }} />}
                          </div>
                          <span style={{ fontFamily:"'Syne',sans-serif",fontSize:13.5,color:si===0?T.t1:T.t2,fontWeight:si===0?600:400,paddingBottom:si<item.path.length-1?0:0,lineHeight:"24px" }}>{step}</span>
                        </div>
                      ))}
                    </div>
                    <a href="/register" style={{ display:"flex",alignItems:"center",justifyContent:"center",gap:7,marginTop:18,padding:"10px",borderRadius:9,border:`1px solid ${item.color}44`,background:`${item.color}10`,color:item.color,fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:13,cursor:"pointer",textDecoration:"none",transition:"all 0.18s" }} onMouseEnter={e=>e.currentTarget.style.background=`${item.color}20`} onMouseLeave={e=>e.currentTarget.style.background=`${item.color}10`}>
                      Start this path <ArrowRight size={14} />
                    </a>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section style={{ padding:"80px 24px",background:T.deep,position:"relative",overflow:"hidden" }}>
          <div style={{ position:"absolute",left:"50%",top:"50%",transform:"translate(-50%,-50%)",width:600,height:300,borderRadius:"50%",background:`radial-gradient(ellipse,${T.teal}14 0%,transparent 70%)`,filter:"blur(40px)",pointerEvents:"none" }} />
          <GridBg T={T} />
          <Reveal>
            <div style={{ maxWidth:520,margin:"0 auto",textAlign:"center",position:"relative" }}>
              <h2 style={{ fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:"clamp(28px,4.5vw,46px)",color:T.t1,marginBottom:14,letterSpacing:"-0.9px",lineHeight:1.1 }}>
                The Ecosystem Is Big.<br/><span style={{ color:T.teal }}>Start Small.</span>
              </h2>
              <p style={{ fontFamily:"'Lora',serif",fontStyle:"italic",fontSize:16.5,color:T.t2,lineHeight:1.8,marginBottom:34 }}>
                Pick one track. Learn the three or four things that matter for it. Build something real. The rest of the ecosystem will make sense from there.
              </p>
              <div style={{ display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap" }}>
                <a href="/languages" style={{ display:"inline-flex",alignItems:"center",gap:8,padding:"13px 28px",borderRadius:12,border:"none",background:T.teal,color:"#000",fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:15,cursor:"pointer",textDecoration:"none",boxShadow:`0 0 36px ${T.teal}44`,transition:"all 0.18s" }}>
                  <Code2 size={15}/> Pick a Track
                </a>
                <a href="/careers" style={{ display:"inline-flex",alignItems:"center",gap:7,padding:"13px 22px",borderRadius:12,border:`1px solid ${T.b2}`,background:"transparent",color:T.t1,fontFamily:"'Syne',sans-serif",fontWeight:600,fontSize:15,cursor:"pointer",textDecoration:"none",transition:"all 0.18s" }} onMouseEnter={e=>{e.currentTarget.style.background=T.hover}} onMouseLeave={e=>{e.currentTarget.style.background="transparent"}}>
                  Target Companies <ArrowRight size={15}/>
                </a>
              </div>
            </div>
          </Reveal>
        </section>

      </div>
    </>
  );
}

export default { Careers, Ecosystem };