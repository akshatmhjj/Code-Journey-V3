import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Globe, Code2, Layers, Zap, BookOpen, ExternalLink,
  CheckCircle2, ChevronRight, Monitor, Play, Link2,
  ArrowUpRight, Sparkles, Target, Hash, Star,
} from "lucide-react";

/* ── THEME ── */
const PT={cosmos:{shell:"#07080d",deep:"#0c0e18",mid:"#111420",surface:"#161927",panel:"#1a1e2e",hover:"#1e2335",card:"#161927",cardH:"#1c2235",t1:"#e8eaf2",t2:"#8892b0",t3:"#5a6488",t4:"#2e3660",b1:"rgba(120,130,180,0.08)",b2:"rgba(120,130,180,0.15)",b3:"rgba(120,130,180,0.24)"},void:{shell:"#000",deep:"#050507",mid:"#0a0a0f",surface:"#0f0f15",panel:"#141419",hover:"#1a1a22",card:"#0f0f15",cardH:"#161622",t1:"#f0f0ff",t2:"#9090b8",t3:"#505070",t4:"#252540",b1:"rgba(100,100,200,0.08)",b2:"rgba(100,100,200,0.14)",b3:"rgba(100,100,200,0.22)"},aurora:{shell:"#040e0e",deep:"#071414",mid:"#0b1c1c",surface:"#102424",panel:"#142a2a",hover:"#1a3333",card:"#102424",cardH:"#162e2e",t1:"#e0f5f5",t2:"#7ab8b8",t3:"#3d7878",t4:"#1e4444",b1:"rgba(80,200,180,0.08)",b2:"rgba(80,200,180,0.15)",b3:"rgba(80,200,180,0.24)"},nord:{shell:"#1a1f2e",deep:"#1e2535",mid:"#232c40",surface:"#28334a",panel:"#2d3a50",hover:"#344260",card:"#28334a",cardH:"#2e3d55",t1:"#eceff4",t2:"#9ba8c0",t3:"#5c6a88",t4:"#3a4560",b1:"rgba(136,192,208,0.1)",b2:"rgba(136,192,208,0.18)",b3:"rgba(136,192,208,0.28)"},light:{shell:"#f3f4f8",deep:"#fff",mid:"#f0f1f7",surface:"#fff",panel:"#f7f8fc",hover:"#eef0f8",card:"#fff",cardH:"#f5f6fc",t1:"#111827",t2:"#4b5680",t3:"#7c87a8",t4:"#c5ccdf",b1:"rgba(80,90,150,0.08)",b2:"rgba(80,90,150,0.15)",b3:"rgba(80,90,150,0.24)"}};
const getT=()=>{try{return PT[localStorage.getItem("cj-theme")]||PT.cosmos;}catch{return PT.cosmos;}};
function useTheme(){const[T,setT]=useState(getT);useEffect(()=>{const iv=setInterval(()=>{const f=getT();if(f.t1!==T.t1)setT(f);},500);return()=>clearInterval(iv);},[T]);useEffect(()=>{const fn=()=>setT(getT());window.addEventListener("storage",fn);return()=>window.removeEventListener("storage",fn);},[]);return T;}

/* ── SYNTAX HIGHLIGHT ── */
function highlight(code){
  return code
    .replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")
    .replace(/(\/\/[^\n]*)/g,'<s style="color:#6a9955">$1</s>')
    .replace(/(<!--[\s\S]*?-->)/g,'<s style="color:#6a9955">$1</s>')
    .replace(/("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)/g,'<s style="color:#ce9178">$1</s>')
    .replace(/\b(function|return|const|let|var|if|else|for|while|async|await|import|export|from|default|class|new|this|typeof|interface|type|extends|implements|void|boolean|string|number|Promise)\b/g,'<s style="color:#c792ea">$1</s>')
    .replace(/\b(\d+\.?\d*)\b/g,'<s style="color:#f78c6c">$1</s>')
    .replace(/<s /g,'<span ').replace(/<\/s>/g,'</span>');
}

const CodeBlock = ({ code, lang, color, T }) => (
  <div style={{background:T.deep,borderRadius:12,overflow:"hidden",border:`1px solid ${T.b2}`,fontFamily:"'JetBrains Mono',monospace",fontSize:13}}>
    <div style={{background:T.panel,padding:"9px 16px",borderBottom:`1px solid ${T.b1}`,display:"flex",alignItems:"center",gap:8}}>
      <div style={{display:"flex",gap:5}}>{["#f47067","#f9c74f","#6fcf97"].map((c,i)=><div key={i} style={{width:10,height:10,borderRadius:"50%",background:c}}/>)}</div>
      <span style={{flex:1,textAlign:"center",fontSize:11,color:T.t3}}>{lang}</span>
      <div style={{width:8,height:8,borderRadius:"50%",background:color}}/>
    </div>
    <div style={{padding:"18px 20px",overflowX:"auto"}}>
      {code.split("\n").map((line,i)=>(
        <div key={i} style={{display:"flex",lineHeight:"1.75"}}>
          <span style={{color:T.t4,width:30,flexShrink:0,userSelect:"none",fontSize:11,paddingTop:1}}>{i+1}</span>
          <span style={{color:T.t2,whiteSpace:"pre"}} dangerouslySetInnerHTML={{__html:highlight(line)}}/>
        </div>
      ))}
    </div>
  </div>
);

/* ── VISUAL DIAGRAM — browser layer illustration ── */
const BrowserLayers = ({ T }) => (
  <svg viewBox="0 0 420 180" style={{width:"100%",maxWidth:420,fontFamily:"'JetBrains Mono',monospace"}}>
    {/* Browser chrome */}
    <rect x="10" y="10" width="400" height="160" rx="8" fill={T.panel} stroke={T.b2} strokeWidth="1"/>
    <rect x="10" y="10" width="400" height="28" rx="8" fill={T.deep} stroke={T.b2} strokeWidth="1"/>
    <rect x="10" y="29" width="400" height="9" fill={T.deep}/>
    <circle cx="30" cy="24" r="4" fill="#f47067" opacity="0.8"/>
    <circle cx="45" cy="24" r="4" fill="#f9c74f" opacity="0.8"/>
    <circle cx="60" cy="24" r="4" fill="#6fcf97" opacity="0.8"/>
    <rect x="90" y="17" width="220" height="14" rx="4" fill={T.b1} stroke={T.b2} strokeWidth="1"/>
    {/* Three layer blocks */}
    <rect x="25" y="50" width="110" height="108" rx="6" fill="#f9731614" stroke="#f9731644" strokeWidth="1.5"/>
    <text x="80" y="98" textAnchor="middle" fill="#f97316" fontSize="11" fontWeight="700">HTML</text>
    <text x="80" y="113" textAnchor="middle" fill="#f97316" fontSize="9" opacity="0.7">Structure</text>
    <text x="80" y="127" textAnchor="middle" fill="#f97316" fontSize="8" opacity="0.5">headings · links</text>
    <text x="80" y="140" textAnchor="middle" fill="#f97316" fontSize="8" opacity="0.5">images · forms</text>
    <rect x="155" y="50" width="110" height="108" rx="6" fill="#818cf814" stroke="#818cf844" strokeWidth="1.5"/>
    <text x="210" y="98" textAnchor="middle" fill="#818cf8" fontSize="11" fontWeight="700">CSS</text>
    <text x="210" y="113" textAnchor="middle" fill="#818cf8" fontSize="9" opacity="0.7">Presentation</text>
    <text x="210" y="127" textAnchor="middle" fill="#818cf8" fontSize="8" opacity="0.5">colors · layout</text>
    <text x="210" y="140" textAnchor="middle" fill="#818cf8" fontSize="8" opacity="0.5">fonts · spacing</text>
    <rect x="285" y="50" width="110" height="108" rx="6" fill="#f7df1e14" stroke="#f7df1e44" strokeWidth="1.5"/>
    <text x="340" y="98" textAnchor="middle" fill="#f7df1e" fontSize="11" fontWeight="700">JavaScript</text>
    <text x="340" y="113" textAnchor="middle" fill="#f7df1e" fontSize="9" opacity="0.7">Behaviour</text>
    <text x="340" y="127" textAnchor="middle" fill="#f7df1e" fontSize="8" opacity="0.5">clicks · APIs</text>
    <text x="340" y="140" textAnchor="middle" fill="#f7df1e" fontSize="8" opacity="0.5">animations · data</text>
  </svg>
);

/* ── MINI CSS FLEXBOX DIAGRAM ── */
const FlexDiagram = ({ T }) => (
  <svg viewBox="0 0 420 140" style={{width:"100%",maxWidth:420,fontFamily:"'JetBrains Mono',monospace"}}>
    <rect x="10" y="10" width="190" height="120" rx="6" fill={T.panel} stroke={T.b2} strokeWidth="1"/>
    <text x="105" y="26" textAnchor="middle" fill={T.t3} fontSize="9" fontWeight="700">FLEXBOX (row)</text>
    {[0,1,2].map(i=><rect key={i} x={20+i*55} y="35" width="45" height="85" rx="4" fill="#818cf820" stroke="#818cf855" strokeWidth="1"/>)}
    {[0,1,2].map(i=><text key={i} x={42+i*55} y="82" textAnchor="middle" fill="#818cf8" fontSize="10" fontWeight="600">{["A","B","C"][i]}</text>)}
    <rect x="220" y="10" width="190" height="120" rx="6" fill={T.panel} stroke={T.b2} strokeWidth="1"/>
    <text x="315" y="26" textAnchor="middle" fill={T.t3} fontSize="9" fontWeight="700">CSS GRID (2×3)</text>
    {[0,1,2,3,4,5].map(i=><rect key={i} x={230+(i%2)*88} y={35+Math.floor(i/2)*28} width="80" height="22" rx="3" fill="#f97316" opacity={0.1+i*0.04} stroke="#f9731655" strokeWidth="1"/>)}
    {[0,1,2,3,4,5].map(i=><text key={i} x={270+(i%2)*88} y={50+Math.floor(i/2)*28} textAnchor="middle" fill="#f97316" fontSize="8">{i+1}</text>)}
  </svg>
);

/* ── REACT COMPONENT TREE DIAGRAM ── */
const ComponentTree = ({ T }) => (
  <svg viewBox="0 0 420 160" style={{width:"100%",maxWidth:420,fontFamily:"'JetBrains Mono',monospace"}}>
    {/* App root */}
    <rect x="160" y="10" width="100" height="28" rx="5" fill="#61dafb20" stroke="#61dafb55" strokeWidth="1.5"/>
    <text x="210" y="28" textAnchor="middle" fill="#61dafb" fontSize="11" fontWeight="700">&lt;App /&gt;</text>
    {/* Lines */}
    <line x1="210" y1="38" x2="100" y2="65" stroke={T.b3} strokeWidth="1.5"/>
    <line x1="210" y1="38" x2="210" y2="65" stroke={T.b3} strokeWidth="1.5"/>
    <line x1="210" y1="38" x2="320" y2="65" stroke={T.b3} strokeWidth="1.5"/>
    {/* Child components */}
    {[["Header",55,"#f97316"],["Feed",160,"#22c55e"],["Sidebar",275,"#a78bfa"]].map(([name,x,color])=>(
      <g key={name}>
        <rect x={x} y="65" width="90" height="26" rx="5" fill={color+"18"} stroke={color+"55"} strokeWidth="1"/>
        <text x={x+45} y="82" textAnchor="middle" fill={color} fontSize="10" fontWeight="600">&lt;{name} /&gt;</text>
      </g>
    ))}
    {/* Grandchildren */}
    <line x1="100" y1="91" x2="60" y2="118" stroke={T.b2} strokeWidth="1"/>
    <line x1="100" y1="91" x2="140" y2="118" stroke={T.b2} strokeWidth="1"/>
    <line x1="205" y1="91" x2="205" y2="118" stroke={T.b2} strokeWidth="1"/>
    {[["Nav",35,"#f97316"],["Logo",115,"#f97316"],["Post",180,"#22c55e"]].map(([name,x,color])=>(
      <g key={name}>
        <rect x={x} y="118" width="70" height="22" rx="4" fill={color+"12"} stroke={color+"33"} strokeWidth="1"/>
        <text x={x+35} y="133" textAnchor="middle" fill={color} fontSize="9">&lt;{name} /&gt;</text>
      </g>
    ))}
    <text x="210" y="155" textAnchor="middle" fill={T.t3} fontSize="8">Each box is a reusable component — write once, use anywhere</text>
  </svg>
);

/* ── DOM INTERACTION DIAGRAM ── */
const DomDiagram = ({ T }) => (
  <svg viewBox="0 0 420 130" style={{width:"100%",maxWidth:420,fontFamily:"'JetBrains Mono',monospace"}}>
    {/* User action */}
    <rect x="10" y="40" width="90" height="50" rx="6" fill="#f7df1e14" stroke="#f7df1e44" strokeWidth="1.5"/>
    <text x="55" y="62" textAnchor="middle" fill="#f7df1e" fontSize="10" fontWeight="700">User</text>
    <text x="55" y="76" textAnchor="middle" fill="#f7df1e" fontSize="9" opacity="0.7">clicks button</text>
    {/* Arrow 1 */}
    <line x1="100" y1="65" x2="140" y2="65" stroke={T.b3} strokeWidth="1.5" strokeDasharray="4,3"/>
    <polygon points="140,60 150,65 140,70" fill={T.b3}/>
    <text x="120" y="58" textAnchor="middle" fill={T.t3} fontSize="8">event</text>
    {/* JS block */}
    <rect x="150" y="40" width="120" height="50" rx="6" fill="#f7df1e14" stroke="#f7df1e55" strokeWidth="1.5"/>
    <text x="210" y="58" textAnchor="middle" fill="#f7df1e" fontSize="10" fontWeight="700">JavaScript</text>
    <text x="210" y="72" textAnchor="middle" fill="#f7df1e" fontSize="9" opacity="0.7">runs your code</text>
    <text x="210" y="84" textAnchor="middle" fill="#f7df1e" fontSize="8" opacity="0.5">fetch data, logic</text>
    {/* Arrow 2 */}
    <line x1="270" y1="65" x2="310" y2="65" stroke={T.b3} strokeWidth="1.5" strokeDasharray="4,3"/>
    <polygon points="310,60 320,65 310,70" fill={T.b3}/>
    <text x="290" y="58" textAnchor="middle" fill={T.t3} fontSize="8">updates</text>
    {/* DOM */}
    <rect x="320" y="40" width="90" height="50" rx="6" fill="#61dafb14" stroke="#61dafb44" strokeWidth="1.5"/>
    <text x="365" y="62" textAnchor="middle" fill="#61dafb" fontSize="10" fontWeight="700">DOM</text>
    <text x="365" y="76" textAnchor="middle" fill="#61dafb" fontSize="9" opacity="0.7">page changes</text>
    {/* Labels */}
    <text x="55" y="110" textAnchor="middle" fill={T.t3} fontSize="8">1. User acts</text>
    <text x="210" y="110" textAnchor="middle" fill={T.t3} fontSize="8">2. Your code runs</text>
    <text x="365" y="110" textAnchor="middle" fill={T.t3} fontSize="8">3. Page updates</text>
    <text x="210" y="122" textAnchor="middle" fill={T.t3} fontSize="8">This loop is how every interactive feature on the web works</text>
  </svg>
);

/* ── ASYNC VISUAL ── */
const AsyncDiagram = ({ T }) => (
  <svg viewBox="0 0 420 130" style={{width:"100%",maxWidth:420,fontFamily:"'JetBrains Mono',monospace"}}>
    {/* Timeline */}
    <text x="10" y="18" fill={T.t3} fontSize="9" fontWeight="700">WITHOUT async (page freezes)</text>
    <rect x="10" y="24" width="400" height="22" rx="4" fill={T.panel} stroke={T.b2} strokeWidth="1"/>
    <rect x="10" y="24" width="160" height="22" rx="4" fill="#f7df1e22" stroke="#f7df1e55" strokeWidth="1"/>
    <text x="90" y="38" textAnchor="middle" fill="#f7df1e" fontSize="9">Your code runs ████ BLOCKED ████</text>
    <rect x="170" y="24" width="240" height="22" rx="4" fill="#f8717122" stroke="#f8717155" strokeWidth="1"/>
    <text x="290" y="38" textAnchor="middle" fill="#f87171" fontSize="9">Waiting for API… page is frozen 🥶</text>
    {/* With async */}
    <text x="10" y="72" fill={T.t3} fontSize="9" fontWeight="700">WITH async/await (page stays responsive)</text>
    <rect x="10" y="78" width="400" height="22" rx="4" fill={T.panel} stroke={T.b2} strokeWidth="1"/>
    <rect x="10" y="78" width="100" height="22" rx="4" fill="#22c55e22" stroke="#22c55e55" strokeWidth="1"/>
    <text x="60" y="92" textAnchor="middle" fill="#22c55e" fontSize="9">Code runs ✓</text>
    <rect x="115" y="78" width="120" height="22" rx="4" fill={T.b1} stroke={T.b2} strokeWidth="1"/>
    <text x="175" y="92" textAnchor="middle" fill={T.t3} fontSize="9">waiting in background…</text>
    <rect x="240" y="78" width="170" height="22" rx="4" fill="#22c55e22" stroke="#22c55e55" strokeWidth="1"/>
    <text x="325" y="92" textAnchor="middle" fill="#22c55e" fontSize="9">API responds → update page ✓</text>
    <text x="210" y="120" textAnchor="middle" fill={T.t3} fontSize="8">async/await lets JavaScript wait for data without freezing the browser tab</text>
  </svg>
);

/* ── RESOURCE PILL ── */
const ResPill = ({ label, href, color, icon:Icon, T }) => (
  <a href={href} target="_blank" rel="noreferrer"
    style={{display:"inline-flex",alignItems:"center",gap:6,padding:"6px 12px",borderRadius:8,border:`1px solid ${color}40`,background:`${color}10`,textDecoration:"none",transition:"all 0.15s",flexShrink:0}}
    onMouseEnter={e=>{e.currentTarget.style.background=`${color}20`;e.currentTarget.style.borderColor=`${color}70`;}}
    onMouseLeave={e=>{e.currentTarget.style.background=`${color}10`;e.currentTarget.style.borderColor=`${color}40`;}}>
    <Icon size={12} color={color}/>
    <span style={{fontFamily:"'Syne',sans-serif",fontSize:12.5,fontWeight:600,color,whiteSpace:"nowrap"}}>{label}</span>
    <ArrowUpRight size={10} color={color} opacity={0.6}/>
  </a>
);

/* ════════════════════════════════════
   SECTION DATA
════════════════════════════════════ */
const SECTIONS = [
  { id:"intro", label:"Overview", icon:"🌐" },
  { id:"html",  label:"HTML",     icon:"‹/›", color:"#f97316" },
  { id:"css",   label:"CSS",      icon:"✦",   color:"#818cf8" },
  { id:"js",    label:"JavaScript",icon:"JS", color:"#f7df1e" },
  { id:"ts",    label:"TypeScript",icon:"TS", color:"#60a5fa" },
  { id:"react", label:"React",    icon:"⚛",   color:"#61dafb" },
  { id:"node",  label:"Node.js",  icon:"N",   color:"#4ade80" },
  { id:"resources", label:"Resources", icon:"📚" },
];

/* ════════════════════════════════════
   MAIN
════════════════════════════════════ */
export default function WebDev() {
  const T = useTheme();
  const [active, setActive] = useState("intro");
  const sectionRefs = useRef({});
  const observerRef = useRef(null);

  /* Intersection observer for scroll-spy */
  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();
    observerRef.current = new IntersectionObserver(
      entries => {
        entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); });
      },
      { rootMargin:"-30% 0px -60% 0px", threshold:0 }
    );
    SECTIONS.forEach(s => {
      const el = document.getElementById(s.id);
      if (el) observerRef.current.observe(el);
    });
    return () => observerRef.current?.disconnect();
  }, [T]);

  const scrollTo = id => {
    document.getElementById(id)?.scrollIntoView({ behavior:"smooth", block:"start" });
  };

  const ACCENT = "#7c6ee0";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600&family=Syne:wght@400;500;600;700;800&family=Lora:ital,wght@0,400;0,500;1,400;1,500&display=swap');
        html{scroll-behavior:smooth;}*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        body{background:${T.shell};}
        ::-webkit-scrollbar{width:5px;}::-webkit-scrollbar-thumb{background:${T.hover};border-radius:3px;}
        ::selection{background:rgba(124,110,224,0.25);}
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        .wd-sec{scroll-margin-top:80px;}
        @media(max-width:900px){.wd-layout{flex-direction:column!important;}.wd-rail{display:none!important;}}
      `}</style>

      <div style={{minHeight:"100vh",background:T.shell,color:T.t1,fontFamily:"'Syne',sans-serif"}}>

        {/* ── HERO ── */}
        <div style={{background:T.deep,borderBottom:`1px solid ${T.b1}`,padding:"96px 24px 56px",position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",inset:0,backgroundImage:`linear-gradient(${T.b1} 1px,transparent 1px),linear-gradient(90deg,${T.b1} 1px,transparent 1px)`,backgroundSize:"48px 48px",maskImage:"radial-gradient(ellipse 80% 80% at 50% 50%,black 20%,transparent 100%)",pointerEvents:"none"}}/>
          <div style={{position:"absolute",left:"60%",top:"50%",transform:"translate(-50%,-50%)",width:500,height:400,borderRadius:"50%",background:`radial-gradient(ellipse,${ACCENT}20 0%,transparent 70%)`,filter:"blur(60px)",pointerEvents:"none"}}/>
          <div style={{maxWidth:1100,margin:"0 auto",position:"relative",display:"flex",alignItems:"center",gap:60,flexWrap:"wrap"}}>
            <div style={{flex:1,minWidth:280}}>
              <div style={{display:"inline-flex",alignItems:"center",gap:7,padding:"4px 14px",borderRadius:100,background:`${ACCENT}14`,border:`1px solid ${ACCENT}40`,marginBottom:20}}>
                <Globe size={12} color={ACCENT}/>
                <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,fontWeight:700,color:ACCENT,letterSpacing:"2px",textTransform:"uppercase"}}>Web Development Track</span>
              </div>
              <h1 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:"clamp(36px,5.5vw,60px)",lineHeight:1.06,letterSpacing:"-1.5px",marginBottom:16,color:T.t1}}>
                Build what the<br/><span style={{color:ACCENT}}>world opens.</span>
              </h1>
              <p style={{fontFamily:"'Lora',serif",fontStyle:"italic",fontSize:"clamp(15px,2vw,18px)",color:T.t2,lineHeight:1.85,maxWidth:500,marginBottom:24}}>
                Websites, web apps, e-commerce, dashboards, APIs — it all runs in a browser. Web development is the most immediately visible skill in software: you write code and someone on the other side of the world can see it in seconds.
              </p>
              {/* Journey at a glance */}
              <div style={{display:"flex",alignItems:"center",gap:0,flexWrap:"wrap",rowGap:8}}>
                {[["HTML",       "#f97316"],["CSS",        "#818cf8"],["JavaScript","#f7df1e"],["TypeScript", "#60a5fa"],["React",      "#61dafb"],["Node.js",    "#4ade80"]].map(([name,color],i,arr)=>(
                  <React.Fragment key={name}>
                    <button onClick={()=>scrollTo(name.toLowerCase().replace(".","").replace("j","j"))} style={{display:"flex",alignItems:"center",gap:5,padding:"5px 11px",borderRadius:7,border:`1px solid ${color}40`,background:`${color}10`,cursor:"pointer",fontFamily:"'Syne',sans-serif",fontWeight:600,fontSize:12.5,color,transition:"all 0.15s"}}
                      onMouseEnter={e=>{e.currentTarget.style.background=`${color}22`;}}
                      onMouseLeave={e=>{e.currentTarget.style.background=`${color}10`;}}>
                      <span style={{width:5,height:5,borderRadius:"50%",background:color,flexShrink:0}}/>
                      {name}
                    </button>
                    {i<arr.length-1&&<ChevronRight size={13} color={T.t4} style={{flexShrink:0}}/>}
                  </React.Fragment>
                ))}
              </div>
            </div>
            {/* Right: browser layer visual */}
            <div style={{flex:"0 0 420px",minWidth:280}}>
              <BrowserLayers T={T}/>
              <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10.5,color:T.t3,textAlign:"center",marginTop:8}}>Every webpage = HTML structure + CSS style + JS behaviour</p>
            </div>
          </div>
        </div>

        {/* ── MAIN LAYOUT ── */}
        <div className="wd-layout" style={{maxWidth:1100,margin:"0 auto",padding:"0 24px",display:"flex",alignItems:"flex-start",gap:0}}>

          {/* LEFT RAIL — sticky TOC */}
          <aside className="wd-rail" style={{width:210,flexShrink:0,position:"sticky",top:70,alignSelf:"flex-start",paddingTop:44,paddingRight:24,paddingBottom:44}}>
            <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9.5,fontWeight:700,letterSpacing:"2px",textTransform:"uppercase",color:T.t3,marginBottom:14}}>On this page</p>
            {SECTIONS.map(s=>{
              const isActive = active===s.id;
              return (
                <button key={s.id} onClick={()=>scrollTo(s.id)}
                  style={{display:"flex",alignItems:"center",gap:9,width:"100%",padding:"8px 10px",borderRadius:8,border:"none",background:isActive?`${s.color||ACCENT}14`:"transparent",cursor:"pointer",textAlign:"left",marginBottom:2,transition:"all 0.14s",borderLeft:isActive?`2px solid ${s.color||ACCENT}`:"2px solid transparent"}}>
                  <span style={{fontSize:13,flexShrink:0}}>{s.icon}</span>
                  <span style={{fontFamily:"'Syne',sans-serif",fontWeight:isActive?700:500,fontSize:13.5,color:isActive?s.color||ACCENT:T.t2,transition:"color 0.14s"}}>{s.label}</span>
                </button>
              );
            })}
            {/* Time estimate */}
            <div style={{marginTop:24,padding:"12px",background:T.panel,borderRadius:10,border:`1px solid ${T.b1}`}}>
              <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:T.t3,textTransform:"uppercase",letterSpacing:"1px",marginBottom:8}}>Estimated time</p>
              <p style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:15,color:ACCENT,margin:0}}>4–6 months</p>
              <p style={{fontFamily:"'Lora',serif",fontSize:12,color:T.t3,margin:"4px 0 0",fontStyle:"italic"}}>to job-ready</p>
            </div>
          </aside>

          {/* RIGHT CONTENT */}
          <main style={{flex:1,minWidth:0,paddingTop:44,paddingBottom:100}}>

            {/* ── OVERVIEW ── */}
            <section id="intro" className="wd-sec" style={{marginBottom:72}}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                <Globe size={20} color={ACCENT}/>
                <h2 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:"clamp(22px,3.5vw,32px)",color:T.t1,margin:0,letterSpacing:"-0.5px"}}>What is Web Development?</h2>
              </div>
              <div style={{height:3,width:44,borderRadius:2,background:ACCENT,marginBottom:24,opacity:0.75}}/>
              <p style={{fontFamily:"'Lora',serif",fontSize:16.5,color:T.t2,lineHeight:1.9,marginBottom:20}}>
                Web development is the craft of building things that live in a browser. It has two main sides: <strong style={{color:T.t1}}>frontend</strong> (what users see — HTML, CSS, JavaScript) and <strong style={{color:T.t1}}>backend</strong> (the server, database, business logic — Node.js, databases, APIs). Most beginners start with frontend.
              </p>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:12,marginBottom:28}}>
                {[
                  {title:"Frontend",   color:"#61dafb",desc:"HTML + CSS + JS — everything visible in the browser. What you see on screen."},
                  {title:"Backend",    color:"#4ade80",desc:"Server + database + API — stores data, handles logic, sends responses to the browser."},
                  {title:"Full-stack", color:ACCENT,   desc:"Both sides. Most web developers eventually learn both — you become far more valuable."},
                ].map(c=>(
                  <div key={c.title} style={{background:T.card,border:`1px solid ${c.color}30`,borderRadius:12,padding:"16px",borderTop:`2px solid ${c.color}`}}>
                    <h3 style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:14,color:c.color,marginBottom:8}}>{c.title}</h3>
                    <p style={{fontFamily:"'Lora',serif",fontSize:13.5,color:T.t2,lineHeight:1.65,margin:0}}>{c.desc}</p>
                  </div>
                ))}
              </div>
              {/* What you'll build */}
              <div style={{background:T.panel,border:`1px solid ${T.b1}`,borderRadius:12,padding:"18px 20px"}}>
                <p style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:11,color:T.t3,letterSpacing:"1.5px",textTransform:"uppercase",marginBottom:12}}>What you'll be able to build</p>
                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:8}}>
                  {["Personal portfolio website","Weather app with real API data","Full e-commerce store","Social media feed with React","REST API with user authentication","Real-time chat application"].map(b=>(
                    <div key={b} style={{display:"flex",gap:7,alignItems:"flex-start"}}>
                      <CheckCircle2 size={13} color={ACCENT} style={{flexShrink:0,marginTop:2}}/>
                      <span style={{fontFamily:"'Syne',sans-serif",fontSize:13,color:T.t1}}>{b}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* ── HTML ── */}
            <section id="html" className="wd-sec" style={{marginBottom:72}}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                <div style={{width:34,height:34,borderRadius:9,background:"#f9731614",border:"1px solid #f9731640",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'JetBrains Mono',monospace",fontSize:12,fontWeight:700,color:"#f97316"}}>‹/›</div>
                <div>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <h2 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:"clamp(22px,3.5vw,30px)",color:T.t1,margin:0,letterSpacing:"-0.4px"}}>HTML</h2>
                    <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:4,background:"#f9731614",color:"#f97316",border:"1px solid #f9731628"}}>Foundation · Week 1–2</span>
                  </div>
                  <p style={{fontFamily:"'Lora',serif",fontStyle:"italic",fontSize:13.5,color:T.t3,margin:0}}>The skeleton of every webpage</p>
                </div>
              </div>
              <div style={{height:3,width:44,borderRadius:2,background:"#f97316",marginBottom:24,opacity:0.75}}/>

              {/* Analogy */}
              <div style={{background:"#f9731610",border:"1px solid #f9731628",borderRadius:12,padding:"16px 20px",marginBottom:24,borderLeft:"4px solid #f97316"}}>
                <p style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:11,color:"#f97316",letterSpacing:"1px",textTransform:"uppercase",marginBottom:8}}>💡 The Analogy</p>
                <p style={{fontFamily:"'Lora',serif",fontSize:15.5,color:T.t1,lineHeight:1.78,margin:0}}>HTML is the <strong>blueprint of a building</strong>. It says "there's a wall here, a door there, a window here" — but it says nothing about colour, decoration, or style. Every webpage that has ever existed starts with HTML. It's not a programming language — it's a <em>structure</em> language. You describe what things are, not what they look like.</p>
              </div>

              <p style={{fontFamily:"'Lora',serif",fontSize:15.5,color:T.t2,lineHeight:1.88,marginBottom:20}}>
                HTML uses <strong style={{color:T.t1}}>tags</strong> wrapped in angle brackets to mark up content. A tag like <code style={{background:T.panel,padding:"1px 6px",borderRadius:4,fontFamily:"'JetBrains Mono',monospace",fontSize:13,color:"#f97316"}}>&lt;h1&gt;</code> tells the browser "this is a main heading." Tags have opening and closing versions, and you nest them inside each other to create structure.
              </p>

              {/* Key concepts */}
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))",gap:8,marginBottom:24}}>
                {[["Tags & Elements","<h1>, <p>, <div>, <img>"],["Attributes","href, src, alt, class, id"],["Semantic HTML","<header>, <main>, <article>"],["Forms","<input>, <button>, <form>"],["Links","<a href='/about'>About</a>"],["Lists","<ul>, <ol>, <li>"]].map(([k,v])=>(
                  <div key={k} style={{background:T.panel,borderRadius:9,padding:"11px 13px",border:`1px solid ${T.b1}`}}>
                    <p style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:12.5,color:"#f97316",marginBottom:4}}>{k}</p>
                    <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:T.t3,margin:0}}>{v}</p>
                  </div>
                ))}
              </div>

              <CodeBlock lang="HTML — a real page structure" color="#f97316" T={T} code={`<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>My Portfolio</title>
    <link rel="stylesheet" href="style.css">
  </head>
  <body>

    <!-- Semantic header with navigation -->
    <header>
      <nav>
        <a href="/">Home</a>
        <a href="/projects">Projects</a>
        <a href="/contact">Contact</a>
      </nav>
    </header>

    <!-- Main content area -->
    <main>
      <section id="hero">
        <h1>Hi, I'm Alex 👋</h1>
        <p>I build things for the web.</p>
        <a href="/projects" class="btn">See my work</a>
      </section>

      <section id="skills">
        <h2>What I know</h2>
        <ul>
          <li>HTML & CSS</li>
          <li>JavaScript</li>
          <li>React</li>
        </ul>
      </section>
    </main>

    <footer>
      <p>© 2026 Alex. Made with HTML.</p>
    </footer>

    <script src="app.js"></script>
  </body>
</html>`}/>
              <p style={{fontFamily:"'Lora',serif",fontStyle:"italic",fontSize:13.5,color:T.t2,lineHeight:1.7,marginTop:14,marginBottom:24}}>This is a complete, real HTML page. Notice how the tags describe what things <em>are</em> (header, nav, main, section, footer) — not what they look like. CSS handles appearance. The browser reads this and builds a tree of elements, which is called the DOM (Document Object Model).</p>

              <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                <ResPill label="MDN HTML Guide" href="https://developer.mozilla.org/en-US/docs/Learn/HTML" color="#f97316" icon={BookOpen} T={T}/>
                <ResPill label="freeCodeCamp HTML" href="https://www.freecodecamp.org/learn/2022/responsive-web-design/" color="#f97316" icon={BookOpen} T={T}/>
                <ResPill label="HTML Full Course – YouTube" href="https://www.youtube.com/watch?v=kUMe1FH4CHE" color="#f97316" icon={Play} T={T}/>
              </div>
            </section>

            {/* ── CSS ── */}
            <section id="css" className="wd-sec" style={{marginBottom:72}}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                <div style={{width:34,height:34,borderRadius:9,background:"#818cf814",border:"1px solid #818cf840",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Syne',sans-serif",fontSize:16,fontWeight:700,color:"#818cf8"}}>✦</div>
                <div>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <h2 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:"clamp(22px,3.5vw,30px)",color:T.t1,margin:0,letterSpacing:"-0.4px"}}>CSS</h2>
                    <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:4,background:"#818cf814",color:"#818cf8",border:"1px solid #818cf828"}}>Foundation · Week 3–5</span>
                  </div>
                  <p style={{fontFamily:"'Lora',serif",fontStyle:"italic",fontSize:13.5,color:T.t3,margin:0}}>Make it beautiful — colours, layouts, animations</p>
                </div>
              </div>
              <div style={{height:3,width:44,borderRadius:2,background:"#818cf8",marginBottom:24,opacity:0.75}}/>

              <div style={{background:"#818cf810",border:"1px solid #818cf828",borderRadius:12,padding:"16px 20px",marginBottom:24,borderLeft:"4px solid #818cf8"}}>
                <p style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:11,color:"#818cf8",letterSpacing:"1px",textTransform:"uppercase",marginBottom:8}}>💡 The Analogy</p>
                <p style={{fontFamily:"'Lora',serif",fontSize:15.5,color:T.t1,lineHeight:1.78,margin:0}}>If HTML is the blueprint, CSS is the <strong>interior design</strong>. It decides the paint colour, furniture arrangement, lighting, and decoration. Without CSS, every webpage is just black text on a white background — plain text like a 1990s terminal. CSS is what turns a structural skeleton into something visually compelling.</p>
              </div>

              <p style={{fontFamily:"'Lora',serif",fontSize:15.5,color:T.t2,lineHeight:1.88,marginBottom:20}}>CSS works by <strong style={{color:T.t1}}>selecting elements</strong> and applying styles to them. The two most important layout tools in modern CSS are <strong style={{color:"#818cf8"}}>Flexbox</strong> (for arranging things in a row or column) and <strong style={{color:"#f97316"}}>Grid</strong> (for complex two-dimensional layouts). Most beginners spend 80% of their CSS time in these two.</p>

              {/* Layout diagram */}
              <div style={{marginBottom:24}}>
                <FlexDiagram T={T}/>
                <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10.5,color:T.t3,textAlign:"center",marginTop:8}}>Flexbox = arrange in one direction · Grid = arrange in two dimensions</p>
              </div>

              <CodeBlock lang="CSS — layout, colour, responsiveness" color="#818cf8" T={T} code={`.hero {
  /* Flexbox: centre children both horizontally and vertically */
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 24px;

  /* Visual */
  background: linear-gradient(135deg, #0c0e18, #161927);
  padding: 80px 24px;
  min-height: 100vh;
}

.hero h1 {
  font-size: clamp(2rem, 5vw, 4rem); /* fluid font size */
  color: #e8eaf2;
  font-weight: 800;
  letter-spacing: -2px;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

/* Hover animation */
.card {
  background: #161927;
  border: 1px solid rgba(120,130,180,0.15);
  border-radius: 14px;
  padding: 24px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(124,110,224,0.15);
}

/* Mobile: reduce padding */
@media (max-width: 640px) {
  .hero { padding: 48px 16px; }
}`}/>
              <p style={{fontFamily:"'Lora',serif",fontStyle:"italic",fontSize:13.5,color:T.t2,lineHeight:1.7,marginTop:14,marginBottom:24}}>The <code style={{fontFamily:"'JetBrains Mono',monospace",fontSize:12,background:T.panel,padding:"1px 5px",borderRadius:3}}>clamp()</code> function makes font sizes fluid — small on mobile, large on desktop, automatically. The <code style={{fontFamily:"'JetBrains Mono',monospace",fontSize:12,background:T.panel,padding:"1px 5px",borderRadius:3}}>@media</code> query changes styles based on screen size — this is responsive design.</p>

              <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                <ResPill label="CSS Tricks" href="https://css-tricks.com" color="#818cf8" icon={BookOpen} T={T}/>
                <ResPill label="Kevin Powell – CSS" href="https://www.youtube.com/@KevinPowell" color="#818cf8" icon={Play} T={T}/>
                <ResPill label="Flexbox Froggy (game)" href="https://flexboxfroggy.com" color="#818cf8" icon={BookOpen} T={T}/>
              </div>
            </section>

            {/* ── JAVASCRIPT ── */}
            <section id="javascript" className="wd-sec" style={{marginBottom:72}}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                <div style={{width:34,height:34,borderRadius:9,background:"#f7df1e14",border:"1px solid #f7df1e40",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'JetBrains Mono',monospace",fontSize:12,fontWeight:700,color:"#f7df1e"}}>JS</div>
                <div>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <h2 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:"clamp(22px,3.5vw,30px)",color:T.t1,margin:0,letterSpacing:"-0.4px"}}>JavaScript</h2>
                    <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:4,background:"#f7df1e14",color:"#f7df1e",border:"1px solid #f7df1e28"}}>Core · Week 6–12</span>
                  </div>
                  <p style={{fontFamily:"'Lora',serif",fontStyle:"italic",fontSize:13.5,color:T.t3,margin:0}}>The brain — makes pages interactive and alive</p>
                </div>
              </div>
              <div style={{height:3,width:44,borderRadius:2,background:"#f7df1e",marginBottom:24,opacity:0.75}}/>

              <div style={{background:"#f7df1e10",border:"1px solid #f7df1e28",borderRadius:12,padding:"16px 20px",marginBottom:24,borderLeft:"4px solid #f7df1e"}}>
                <p style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:11,color:"#f7df1e",letterSpacing:"1px",textTransform:"uppercase",marginBottom:8}}>💡 The Analogy</p>
                <p style={{fontFamily:"'Lora',serif",fontSize:15.5,color:T.t1,lineHeight:1.78,margin:0}}>HTML and CSS are like a beautiful <strong>printed poster</strong> — it looks great but you can't interact with it. JavaScript is what makes the poster come alive: pressing a button changes the text, a form checks your input before submitting, a timer counts down, data loads from the internet without reloading the page. It's the <em>only</em> language that runs natively inside every browser.</p>
              </div>

              {/* DOM interaction diagram */}
              <div style={{marginBottom:24}}>
                <DomDiagram T={T}/>
              </div>

              <CodeBlock lang="JavaScript — events, DOM, async API call" color="#f7df1e" T={T} code={`// 1. Select elements from the page
const searchBtn = document.getElementById('search-btn');
const input     = document.getElementById('search-input');
const results   = document.getElementById('results');

// 2. Listen for a click event
searchBtn.addEventListener('click', async () => {
  const query = input.value.trim();
  if (!query) return;

  results.innerHTML = '<p>Loading...</p>';

  try {
    // 3. Fetch data from an API (doesn't freeze the page)
    const response = await fetch(
      \`https://api.github.com/search/repositories?q=\${query}\`
    );
    const data = await response.json();

    // 4. Update the page with the results
    results.innerHTML = data.items
      .slice(0, 5)
      .map(repo => \`
        <div class="card">
          <h3>\${repo.full_name}</h3>
          <p>\${repo.description || 'No description'}</p>
          <span>⭐ \${repo.stargazers_count.toLocaleString()}</span>
        </div>
      \`)
      .join('');

  } catch (error) {
    results.innerHTML = '<p>Something went wrong.</p>';
  }
});`}/>
              <p style={{fontFamily:"'Lora',serif",fontStyle:"italic",fontSize:13.5,color:T.t2,lineHeight:1.7,marginTop:14,marginBottom:20}}>This is a complete working GitHub search. The <code style={{fontFamily:"'JetBrains Mono',monospace",fontSize:12,background:T.panel,padding:"1px 5px",borderRadius:3}}>async/await</code> pattern fetches data from the internet without freezing the browser tab. The template literal (backtick string) builds HTML from the data and drops it directly into the page.</p>

              {/* Async diagram */}
              <div style={{marginBottom:24}}><AsyncDiagram T={T}/></div>

              <div style={{background:T.panel,border:`1px solid ${T.b1}`,borderRadius:12,padding:"16px 20px",marginBottom:24}}>
                <p style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:11,color:T.t3,letterSpacing:"1.5px",textTransform:"uppercase",marginBottom:12}}>Key JS concepts to learn in order</p>
                <div style={{display:"flex",flexDirection:"column",gap:8}}>
                  {[["1","Variables, types, arrays, objects","The data containers — every program needs these"],["2","Functions and arrow functions","Reusable blocks of code — the building blocks of logic"],["3","DOM manipulation","Select an HTML element, read or change it with JS"],["4","Events (click, input, scroll)","React to things users do on the page"],["5","Fetch API + async/await","Get data from the internet without freezing the page"],["6","ES6+ (destructuring, modules)","Modern JS syntax that makes code cleaner and faster to write"]].map(([n,title,sub])=>(
                    <div key={n} style={{display:"flex",gap:12,alignItems:"flex-start",padding:"10px 12px",background:T.card,borderRadius:8,border:`1px solid ${T.b1}`}}>
                      <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,fontWeight:700,color:"#f7df1e",background:"#f7df1e14",padding:"2px 7px",borderRadius:4,flexShrink:0}}>{n}</span>
                      <div>
                        <p style={{fontFamily:"'Syne',sans-serif",fontWeight:600,fontSize:13.5,color:T.t1,margin:0}}>{title}</p>
                        <p style={{fontFamily:"'Lora',serif",fontSize:12.5,color:T.t3,margin:0,fontStyle:"italic"}}>{sub}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                <ResPill label="javascript.info" href="https://javascript.info" color="#f7df1e" icon={BookOpen} T={T}/>
                <ResPill label="Traversy Media JS" href="https://www.youtube.com/@TraversyMedia" color="#f7df1e" icon={Play} T={T}/>
                <ResPill label="Fireship JS in 100s" href="https://www.youtube.com/watch?v=DHjqpvDnNGE" color="#f7df1e" icon={Play} T={T}/>
              </div>
            </section>

            {/* ── TYPESCRIPT ── */}
            <section id="typescript" className="wd-sec" style={{marginBottom:72}}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                <div style={{width:34,height:34,borderRadius:9,background:"#60a5fa14",border:"1px solid #60a5fa40",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'JetBrains Mono',monospace",fontSize:12,fontWeight:700,color:"#60a5fa"}}>TS</div>
                <div>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <h2 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:"clamp(22px,3.5vw,30px)",color:T.t1,margin:0,letterSpacing:"-0.4px"}}>TypeScript</h2>
                    <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:4,background:"#60a5fa14",color:"#60a5fa",border:"1px solid #60a5fa28"}}>Intermediate · Week 13–15</span>
                  </div>
                  <p style={{fontFamily:"'Lora',serif",fontStyle:"italic",fontSize:13.5,color:T.t3,margin:0}}>JavaScript with a safety net — catches bugs before they happen</p>
                </div>
              </div>
              <div style={{height:3,width:44,borderRadius:2,background:"#60a5fa",marginBottom:24,opacity:0.75}}/>

              <div style={{background:"#60a5fa10",border:"1px solid #60a5fa28",borderRadius:12,padding:"16px 20px",marginBottom:24,borderLeft:"4px solid #60a5fa"}}>
                <p style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:11,color:"#60a5fa",letterSpacing:"1px",textTransform:"uppercase",marginBottom:8}}>💡 The Analogy</p>
                <p style={{fontFamily:"'Lora',serif",fontSize:15.5,color:T.t1,lineHeight:1.78,margin:0}}>TypeScript is like writing a recipe and specifying that "flour" must be measured in <strong>grams (a number)</strong>, not just "some flour." If you try to use a word where a number is expected, TypeScript flags the error <em>before you even run your code</em>. Instagram, Airbnb, and Microsoft use TypeScript. It doesn't change what your code does — it just prevents a whole class of bugs from ever happening.</p>
              </div>

              <CodeBlock lang="TypeScript — types catch bugs before runtime" color="#60a5fa" T={T} code={`// Without TypeScript — this crashes silently at runtime
function getUsername(user) {
  return user.name.toUpperCase(); // crashes if user.name is undefined
}

// With TypeScript — error caught before you ever run it
interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'viewer'; // only these two values allowed
}

function getUsername(user: User): string {
  return user.name.toUpperCase(); // TypeScript guarantees .name exists
}

// Generic type — works with any type, stays type-safe
async function fetchData<T>(url: string): Promise<T> {
  const response = await fetch(url);
  return response.json() as T;
}

// Usage: TypeScript knows exactly what type comes back
const user = await fetchData<User>('/api/user/1');
console.log(user.name); // TypeScript autocompletes this for you`}/>
              <p style={{fontFamily:"'Lora',serif",fontStyle:"italic",fontSize:13.5,color:T.t2,lineHeight:1.7,marginTop:14,marginBottom:24}}>The <code style={{fontFamily:"'JetBrains Mono',monospace",fontSize:12,background:T.panel,padding:"1px 5px",borderRadius:3}}>interface</code> defines the shape of a User object. The <code style={{fontFamily:"'JetBrains Mono',monospace",fontSize:12,background:T.panel,padding:"1px 5px",borderRadius:3}}>'admin' | 'viewer'</code> union type means the role can only be one of those two strings — TypeScript prevents any typo or invalid value.</p>
              <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                <ResPill label="TypeScript Handbook" href="https://www.typescriptlang.org/docs/handbook/intro.html" color="#60a5fa" icon={BookOpen} T={T}/>
                <ResPill label="Total TypeScript" href="https://www.totaltypescript.com" color="#60a5fa" icon={BookOpen} T={T}/>
              </div>
            </section>

            {/* ── REACT ── */}
            <section id="react" className="wd-sec" style={{marginBottom:72}}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                <div style={{width:34,height:34,borderRadius:9,background:"#61dafb14",border:"1px solid #61dafb40",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,fontWeight:700,color:"#61dafb"}}>⚛</div>
                <div>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <h2 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:"clamp(22px,3.5vw,30px)",color:T.t1,margin:0,letterSpacing:"-0.4px"}}>React</h2>
                    <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:4,background:"#61dafb14",color:"#61dafb",border:"1px solid #61dafb28"}}>Framework · Week 16–22</span>
                  </div>
                  <p style={{fontFamily:"'Lora',serif",fontStyle:"italic",fontSize:13.5,color:T.t3,margin:0}}>Build UIs like LEGO — components you assemble, not HTML you repeat</p>
                </div>
              </div>
              <div style={{height:3,width:44,borderRadius:2,background:"#61dafb",marginBottom:24,opacity:0.75}}/>

              <div style={{background:"#61dafb10",border:"1px solid #61dafb28",borderRadius:12,padding:"16px 20px",marginBottom:24,borderLeft:"4px solid #61dafb"}}>
                <p style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:11,color:"#61dafb",letterSpacing:"1px",textTransform:"uppercase",marginBottom:8}}>💡 The Analogy</p>
                <p style={{fontFamily:"'Lora',serif",fontSize:15.5,color:T.t1,lineHeight:1.78,margin:0}}>Imagine building 50 user profile cards on a page. Without React, you'd copy the HTML 50 times. With React, you write it <strong>once as a component</strong> and use <code style={{fontFamily:"'JetBrains Mono',monospace",fontSize:13}}>&lt;UserCard /&gt;</code> wherever you need it, passing in different data each time. React powers Facebook, Instagram, Airbnb, and Netflix. It changed how UIs are built.</p>
              </div>

              {/* Component tree diagram */}
              <div style={{marginBottom:24}}>
                <ComponentTree T={T}/>
              </div>

              <CodeBlock lang="React — component, state, data fetching" color="#61dafb" T={T} code={`import { useState, useEffect } from 'react';

// A reusable component — use it as <UserCard userId={1} />
function UserCard({ userId }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  // useEffect runs after the component renders
  useEffect(() => {
    fetch(\`/api/users/\${userId}\`)
      .then(res => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then(data => { setUser(data); setLoading(false); })
      .catch(err => { setError(err.message); setLoading(false); });
  }, [userId]); // re-runs whenever userId changes

  if (loading) return <div className="skeleton" />;
  if (error)   return <p className="error">Error: {error}</p>;

  return (
    <article className="user-card">
      <img src={user.avatar} alt={user.name} />
      <h2>{user.name}</h2>
      <p>{user.bio}</p>
      <span className="role">{user.role}</span>
    </article>
  );
}

// Use the same component with different data
export default function TeamPage() {
  return (
    <div className="team-grid">
      {[1, 2, 3, 4, 5].map(id => (
        <UserCard key={id} userId={id} />
      ))}
    </div>
  );
}`}/>
              <p style={{fontFamily:"'Lora',serif",fontStyle:"italic",fontSize:13.5,color:T.t2,lineHeight:1.7,marginTop:14,marginBottom:24}}>This component handles three states automatically: loading (showing a skeleton), error (showing the error message), and success (showing the user). The parent uses the same component 5 times with different IDs — React takes care of the rest.</p>
              <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                <ResPill label="React Official Docs" href="https://react.dev" color="#61dafb" icon={BookOpen} T={T}/>
                <ResPill label="Codevolution React" href="https://www.youtube.com/@Codevolution" color="#61dafb" icon={Play} T={T}/>
                <ResPill label="Scrimba React Course" href="https://scrimba.com/learn/learnreact" color="#61dafb" icon={BookOpen} T={T}/>
              </div>
            </section>

            {/* ── NODE.JS ── */}
            <section id="nodejs" className="wd-sec" style={{marginBottom:72}}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                <div style={{width:34,height:34,borderRadius:9,background:"#4ade8014",border:"1px solid #4ade8040",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'JetBrains Mono',monospace",fontSize:13,fontWeight:700,color:"#4ade80"}}>N</div>
                <div>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <h2 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:"clamp(22px,3.5vw,30px)",color:T.t1,margin:0,letterSpacing:"-0.4px"}}>Node.js + Backend</h2>
                    <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:4,background:"#4ade8014",color:"#4ade80",border:"1px solid #4ade8028"}}>Full-stack · Week 23+</span>
                  </div>
                  <p style={{fontFamily:"'Lora',serif",fontStyle:"italic",fontSize:13.5,color:T.t3,margin:0}}>JavaScript on the server — APIs, databases, authentication</p>
                </div>
              </div>
              <div style={{height:3,width:44,borderRadius:2,background:"#4ade80",marginBottom:24,opacity:0.75}}/>

              <div style={{background:"#4ade8010",border:"1px solid #4ade8028",borderRadius:12,padding:"16px 20px",marginBottom:24,borderLeft:"4px solid #4ade80"}}>
                <p style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:11,color:"#4ade80",letterSpacing:"1px",textTransform:"uppercase",marginBottom:8}}>💡 The Analogy</p>
                <p style={{fontFamily:"'Lora',serif",fontSize:15.5,color:T.t1,lineHeight:1.78,margin:0}}>Node.js takes JavaScript — which only ran in browsers — and lets it run on a <strong>server</strong>. This means you can use the same language for both sides of your app. The backend handles things the frontend can't: storing data in a database, sending emails, processing payments, keeping secrets hidden from users.</p>
              </div>

              <CodeBlock lang="Node.js + Express — a real REST API" color="#4ade80" T={T} code={`const express  = require('express');
const bcrypt   = require('bcrypt');
const jwt      = require('jsonwebtoken');
const db       = require('./db'); // your database connection

const app = express();
app.use(express.json());

// POST /api/login — accepts email + password, returns a token
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  // 1. Find user in database
  const user = await db.users.findOne({ email });
  if (!user) return res.status(401).json({ error: 'User not found' });

  // 2. Compare password to stored hash (never store plain passwords!)
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return res.status(401).json({ error: 'Wrong password' });

  // 3. Create a signed token — like a temporary ID card
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);

  res.json({ token, user: { id: user.id, name: user.name } });
});

// Middleware: protect routes by verifying the token
function requireAuth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Not authenticated' });
  }
}

// GET /api/profile — only accessible with a valid token
app.get('/api/profile', requireAuth, async (req, res) => {
  const user = await db.users.findById(req.user.userId);
  res.json(user);
});

app.listen(3000, () => console.log('API running on port 3000'));`}/>
              <p style={{fontFamily:"'Lora',serif",fontStyle:"italic",fontSize:13.5,color:T.t2,lineHeight:1.7,marginTop:14,marginBottom:24}}>This is a real authentication API. Passwords are never stored in plain text — bcrypt hashes them. JWT tokens are like temporary digital ID cards: the server creates one when you log in, and you present it with every future request to prove who you are.</p>
              <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                <ResPill label="Node.js Official Docs" href="https://nodejs.org/docs/latest/api/" color="#4ade80" icon={BookOpen} T={T}/>
                <ResPill label="The Odin Project" href="https://www.theodinproject.com/paths/full-stack-javascript" color="#4ade80" icon={BookOpen} T={T}/>
                <ResPill label="Traversy Media Node" href="https://www.youtube.com/@TraversyMedia" color="#4ade80" icon={Play} T={T}/>
              </div>
            </section>

            {/* ── RESOURCES ── */}
            <section id="resources" className="wd-sec">
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                <span style={{fontSize:22}}>📚</span>
                <h2 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:"clamp(22px,3.5vw,30px)",color:T.t1,margin:0,letterSpacing:"-0.4px"}}>Full Resource Guide</h2>
              </div>
              <div style={{height:3,width:44,borderRadius:2,background:ACCENT,marginBottom:24,opacity:0.75}}/>
              <p style={{fontFamily:"'Lora',serif",fontSize:15.5,color:T.t2,lineHeight:1.88,marginBottom:28}}>The suggested learning order: freeCodeCamp HTML/CSS first (4 weeks). Then javascript.info for JS (at your own pace). Then the official React docs (react.dev — they're genuinely excellent). For projects and backend, The Odin Project. Use YouTube channels for when you want a concept explained visually before diving into documentation.</p>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:10}}>
                {[
                  {label:"MDN Web Docs",          href:"https://developer.mozilla.org",href2:"",color:"#f97316",icon:BookOpen,sub:"The official reference — every HTML, CSS, JS detail"},
                  {label:"The Odin Project",       href:"https://www.theodinproject.com",color:"#818cf8",icon:BookOpen,sub:"Free full-stack curriculum with real projects"},
                  {label:"freeCodeCamp",           href:"https://www.freecodecamp.org",  color:"#22c55e",icon:BookOpen,sub:"Free interactive lessons with certifications"},
                  {label:"javascript.info",        href:"https://javascript.info",       color:"#f7df1e",icon:BookOpen,sub:"The best JS tutorial — beginner to advanced"},
                  {label:"React Docs (react.dev)", href:"https://react.dev",             color:"#61dafb",icon:BookOpen,sub:"Official React guide — excellent writing"},
                  {label:"Traversy Media",         href:"https://www.youtube.com/@TraversyMedia",color:"#f97316",icon:Play,sub:"Crash courses and project builds"},
                  {label:"Kevin Powell (CSS)",     href:"https://www.youtube.com/@KevinPowell",  color:"#818cf8",icon:Play,sub:"The best CSS teacher on the internet"},
                  {label:"Fireship",               href:"https://www.youtube.com/@Fireship",     color:"#f7df1e",icon:Play,sub:"Fast, modern web dev — 100-second concept videos"},
                  {label:"Codevolution (React/TS)",href:"https://www.youtube.com/@Codevolution",  color:"#61dafb",icon:Play,sub:"Deep dive React and TypeScript playlists"},
                ].map(r=>(
                  <a key={r.label} href={r.href} target="_blank" rel="noreferrer"
                    style={{display:"flex",alignItems:"flex-start",gap:12,padding:"14px 16px",borderRadius:12,border:`1px solid ${r.color}28`,background:`${r.color}08`,textDecoration:"none",transition:"all 0.16s"}}
                    onMouseEnter={e=>{e.currentTarget.style.borderColor=`${r.color}55`;e.currentTarget.style.background=`${r.color}14`;}}
                    onMouseLeave={e=>{e.currentTarget.style.borderColor=`${r.color}28`;e.currentTarget.style.background=`${r.color}08`;}}>
                    <div style={{width:32,height:32,borderRadius:8,background:`${r.color}16`,border:`1px solid ${r.color}28`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                      <r.icon size={14} color={r.color}/>
                    </div>
                    <div>
                      <p style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:13.5,color:T.t1,margin:"0 0 4px"}}>{r.label}</p>
                      <p style={{fontFamily:"'Lora',serif",fontSize:12.5,color:T.t3,margin:0,fontStyle:"italic"}}>{r.sub}</p>
                    </div>
                    <ArrowUpRight size={13} color={r.color} style={{marginLeft:"auto",flexShrink:0,opacity:0.7}}/>
                  </a>
                ))}
              </div>
            </section>

          </main>
        </div>
      </div>
    </>
  );
}