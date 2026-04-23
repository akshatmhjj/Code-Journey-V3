import React,{useState,useEffect,useRef}from"react";
import{motion,AnimatePresence}from"framer-motion";
import{Globe,Code2,Layers,Zap,BookOpen,ExternalLink,ChevronRight,ArrowUpRight,CheckCircle2,Play}from"lucide-react";

/* THEME */
const PT={cosmos:{shell:"#07080d",deep:"#0c0e18",mid:"#111420",surface:"#161927",panel:"#1a1e2e",hover:"#1e2335",card:"#161927",cardH:"#1c2235",t1:"#e8eaf2",t2:"#8892b0",t3:"#5a6488",t4:"#2e3660",b1:"rgba(120,130,180,0.08)",b2:"rgba(120,130,180,0.15)",b3:"rgba(120,130,180,0.24)"},void:{shell:"#000",deep:"#050507",mid:"#0a0a0f",surface:"#0f0f15",panel:"#141419",hover:"#1a1a22",card:"#0f0f15",cardH:"#161622",t1:"#f0f0ff",t2:"#9090b8",t3:"#505070",t4:"#252540",b1:"rgba(100,100,200,0.08)",b2:"rgba(100,100,200,0.14)",b3:"rgba(100,100,200,0.22)"},aurora:{shell:"#040e0e",deep:"#071414",mid:"#0b1c1c",surface:"#102424",panel:"#142a2a",hover:"#1a3333",card:"#102424",cardH:"#162e2e",t1:"#e0f5f5",t2:"#7ab8b8",t3:"#3d7878",t4:"#1e4444",b1:"rgba(80,200,180,0.08)",b2:"rgba(80,200,180,0.15)",b3:"rgba(80,200,180,0.24)"},nord:{shell:"#1a1f2e",deep:"#1e2535",mid:"#232c40",surface:"#28334a",panel:"#2d3a50",hover:"#344260",card:"#28334a",cardH:"#2e3d55",t1:"#eceff4",t2:"#9ba8c0",t3:"#5c6a88",t4:"#3a4560",b1:"rgba(136,192,208,0.1)",b2:"rgba(136,192,208,0.18)",b3:"rgba(136,192,208,0.28)"},light:{shell:"#f3f4f8",deep:"#fff",mid:"#f0f1f7",surface:"#fff",panel:"#f7f8fc",hover:"#eef0f8",card:"#fff",cardH:"#f5f6fc",t1:"#111827",t2:"#4b5680",t3:"#7c87a8",t4:"#c5ccdf",b1:"rgba(80,90,150,0.08)",b2:"rgba(80,90,150,0.15)",b3:"rgba(80,90,150,0.24)"}};
const getT=()=>{try{return PT[localStorage.getItem("cj-theme")]||PT.light;}catch{return PT.light;}};
function useTheme(){const[T,setT]=useState(getT);useEffect(()=>{const iv=setInterval(()=>{const f=getT();if(f.t1!==T.t1)setT(f);},500);return()=>clearInterval(iv);},[T]);useEffect(()=>{const fn=()=>setT(getT());window.addEventListener("storage",fn);return()=>window.removeEventListener("storage",fn);},[]);return T;}

/* SYNTAX HIGHLIGHT */
function hl(line){
  let s=line.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
  s=s.replace(/(\/\/[^\n]*)/g,'<span style="color:#6a9955;font-style:italic">$1</span>');
  s=s.replace(/(<!--.*?-->)/g,'<span style="color:#6a9955;font-style:italic">$1</span>');
  s=s.replace(/("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)/g,'<span style="color:#ce9178">$1</span>');
  s=s.replace(/\b(function|return|const|let|var|if|else|for|while|async|await|import|export|from|default|class|new|this|typeof|interface|type|extends|Promise|void|boolean|string|number)\b/g,'<span style="color:#c792ea">$1</span>');
  s=s.replace(/\b(\d+\.?\d*)\b/g,'<span style="color:#f78c6c">$1</span>');
  return s;
}

const CodeWin=({code,title,accent,T})=>{
  const[copied,setCopied]=useState(false);
  const copy=()=>{try{navigator.clipboard.writeText(code);}catch(e){}setCopied(true);setTimeout(()=>setCopied(false),1800);};
  return(
    <div style={{borderRadius:13,overflow:"hidden",border:`1px solid ${T.b2}`,background:T.deep}}>
      <div style={{background:T.panel,padding:"9px 16px",borderBottom:`1px solid ${T.b1}`,display:"flex",alignItems:"center",gap:8}}>
        <div style={{display:"flex",gap:5}}>{["#f47067","#f9c74f","#6fcf97"].map((c,i)=><div key={i} style={{width:9,height:9,borderRadius:"50%",background:c}}/>)}</div>
        <span style={{flex:1,textAlign:"center",fontSize:11,color:T.t3,fontFamily:"'JetBrains Mono',monospace"}}>{title}</span>
        <button onClick={copy} style={{padding:"2px 9px",borderRadius:5,border:`1px solid ${T.b2}`,background:"transparent",fontSize:10,color:copied?accent:T.t3,cursor:"pointer",fontFamily:"'JetBrains Mono',monospace",transition:"color 0.14s"}}>{copied?"copied ✓":"copy"}</button>
      </div>
      <div style={{padding:"16px 18px",overflowX:"auto",fontFamily:"'JetBrains Mono',monospace",fontSize:12.5}}>
        {code.split("\n").map((line,i)=>(
          <div key={i} style={{display:"flex",lineHeight:"1.72",minHeight:"1.72em"}}>
            <span style={{color:T.t4,width:28,flexShrink:0,userSelect:"none",fontSize:10.5}}>{i+1}</span>
            <span style={{color:T.t2,whiteSpace:"pre"}} dangerouslySetInnerHTML={{__html:hl(line)}}/>
          </div>
        ))}
      </div>
    </div>
  );
};

const Analogy=({text,accent,T})=>(
  <div style={{background:`${accent}0d`,borderLeft:`3px solid ${accent}`,borderRadius:"0 10px 10px 0",padding:"14px 18px",margin:"18px 0"}}>
    <p style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:10.5,color:accent,letterSpacing:"1.2px",textTransform:"uppercase",marginBottom:7}}>💡 Think of it this way</p>
    <p style={{fontFamily:"'Lora',serif",fontStyle:"italic",fontSize:15.5,color:T.t1,lineHeight:1.8,margin:0}}>{text}</p>
  </div>
);

const ConceptGrid=({items,accent,T})=>(
  <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:10,marginBottom:20}}>
    {items.map(({k,v})=>(
      <div key={k} style={{padding:"13px 15px",borderRadius:11,border:`1px solid ${T.b1}`,background:T.card,transition:"all 0.15s"}}
        onMouseEnter={e=>{e.currentTarget.style.borderColor=`${accent}44`;e.currentTarget.style.background=T.cardH;}}
        onMouseLeave={e=>{e.currentTarget.style.borderColor=T.b1;e.currentTarget.style.background=T.card;}}>
        <p style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:13,color:accent,margin:"0 0 5px"}}>{k}</p>
        <p style={{fontFamily:"'Lora',serif",fontSize:13,color:T.t2,lineHeight:1.65,margin:0}}>{v}</p>
      </div>
    ))}
  </div>
);

const ResourceRow=({links,T})=>(
  <div style={{display:"flex",flexWrap:"wrap",gap:8,paddingTop:4}}>
    {links.map(({label,href,type})=>{
      const isYt=type==="yt";
      const color=isYt?"#f87171":"#60a5fa";
      return(
        <a key={label} href={href} target="_blank" rel="noreferrer"
          style={{display:"inline-flex",alignItems:"center",gap:5,padding:"5px 12px",borderRadius:8,border:`1px solid ${color}35`,background:`${color}0c`,textDecoration:"none",transition:"all 0.15s"}}
          onMouseEnter={e=>{e.currentTarget.style.background=`${color}1a`;}}
          onMouseLeave={e=>{e.currentTarget.style.background=`${color}0c`;}}>
          <span style={{fontSize:11}}>{isYt?"▶":"📖"}</span>
          <span style={{fontFamily:"'Syne',sans-serif",fontSize:12.5,fontWeight:600,color}}>{label}</span>
        </a>
      );
    })}
  </div>
);

const SectionHead=({num,title,emoji,color,sub,T})=>(
  <div style={{marginBottom:28}}>
    <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
      <div style={{width:36,height:36,borderRadius:10,background:`${color}18`,border:`1px solid ${color}35`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:18}}>{emoji}</div>
      <div>
        <div style={{display:"flex",alignItems:"center",gap:9}}>
          <h2 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:"clamp(20px,3vw,28px)",color:T.t1,margin:0,letterSpacing:"-0.4px"}}>{title}</h2>
          <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10.5,fontWeight:700,color,background:`${color}14`,border:`1px solid ${color}28`,padding:"2px 8px",borderRadius:5}}>{num}</span>
        </div>
        <p style={{fontFamily:"'Lora',serif",fontStyle:"italic",fontSize:13.5,color:T.t3,margin:0}}>{sub}</p>
      </div>
    </div>
    <div style={{height:2,width:48,borderRadius:2,background:color,opacity:0.7}}/>
  </div>
);

const Divider=({T})=><div style={{height:1,background:`linear-gradient(to right,${T.b2},${T.b1},transparent)`,margin:"60px 0"}}/>;

/* SVG DIAGRAMS */
const DomTree=({T})=>(
  <svg viewBox="0 0 480 200" style={{width:"100%",maxWidth:480,display:"block"}}>
    <text x="240" y="18" textAnchor="middle" fill={T.t3} fontSize="11" fontFamily="JetBrains Mono">DOM Tree — every HTML tag becomes a node</text>
    {/* document */}
    <rect x="190" y="26" width="100" height="26" rx="5" fill="#f9731614" stroke="#f9731655" strokeWidth="1.5"/>
    <text x="240" y="43" textAnchor="middle" fill="#f97316" fontSize="11" fontFamily="JetBrains Mono">&lt;html&gt;</text>
    {/* lines */}
    <line x1="240" y1="52" x2="120" y2="78" stroke={T.b3} strokeWidth="1.5"/>
    <line x1="240" y1="52" x2="360" y2="78" stroke={T.b3} strokeWidth="1.5"/>
    {/* head + body */}
    {[["&lt;head&gt;",70,"#818cf8"],["&lt;body&gt;",310,"#f7df1e"]].map(([txt,x,col])=>(
      <g key={txt}><rect x={x} y="78" width="100" height="26" rx="5" fill={col+"14"} stroke={col+"55"} strokeWidth="1.5"/><text x={x+50} y="95" textAnchor="middle" fill={col} fontSize="11" fontFamily="JetBrains Mono">{txt}</text></g>
    ))}
    {/* body children */}
    <line x1="360" y1="104" x2="270" y2="130" stroke={T.b2} strokeWidth="1"/>
    <line x1="360" y1="104" x2="360" y2="130" stroke={T.b2} strokeWidth="1"/>
    <line x1="360" y1="104" x2="450" y2="130" stroke={T.b2} strokeWidth="1"/>
    {[["&lt;nav&gt;",220,"#22c55e"],["&lt;main&gt;",310,"#22c55e"],["&lt;footer&gt;",400,"#22c55e"]].map(([txt,x,col])=>(
      <g key={txt}><rect x={x-40} y="130" width="90" height="24" rx="4" fill={col+"0e"} stroke={col+"44"} strokeWidth="1"/><text x={x} y="146" textAnchor="middle" fill={col} fontSize="10" fontFamily="JetBrains Mono">{txt}</text></g>
    ))}
    {/* main children */}
    <line x1="360" y1="154" x2="310" y2="175" stroke={T.b2} strokeWidth="1"/>
    <line x1="360" y1="154" x2="410" y2="175" stroke={T.b2} strokeWidth="1"/>
    {[["&lt;h1&gt;",270],["&lt;p&gt;",370]].map(([txt,x])=>(
      <g key={txt}><rect x={x-30} y="174" width="65" height="20" rx="3" fill={T.b1} stroke={T.b2} strokeWidth="1"/><text x={x} y="188" textAnchor="middle" fill={T.t3} fontSize="9.5" fontFamily="JetBrains Mono">{txt}</text></g>
    ))}
  </svg>
);

const FlexGridDiagram=({T})=>(
  <svg viewBox="0 0 480 160" style={{width:"100%",maxWidth:480,display:"block"}}>
    <text x="118" y="15" textAnchor="middle" fill={T.t3} fontSize="11" fontFamily="JetBrains Mono">Flexbox — one direction</text>
    <rect x="10" y="22" width="216" height="128" rx="6" fill={T.panel} stroke={T.b2} strokeWidth="1"/>
    {[0,1,2].map(i=>(
      <g key={i}>
        <rect x={20+i*68} y="32" width="58" height="108" rx="4" fill="#818cf814" stroke="#818cf855" strokeWidth="1"/>
        <text x={49+i*68} y="92" textAnchor="middle" fill="#818cf8" fontSize="13" fontFamily="JetBrains Mono" fontWeight="700">{["A","B","C"][i]}</text>
      </g>
    ))}
    <text x="362" y="15" textAnchor="middle" fill={T.t3} fontSize="11" fontFamily="JetBrains Mono">Grid — two directions</text>
    <rect x="254" y="22" width="216" height="128" rx="6" fill={T.panel} stroke={T.b2} strokeWidth="1"/>
    {[0,1,2,3,4,5].map(i=>(
      <g key={i}>
        <rect x={264+(i%3)*68} y={32+Math.floor(i/3)*56} width="58" height="48" rx="4" fill="#f9731614" stroke="#f9731655" strokeWidth="1"/>
        <text x={293+(i%3)*68} y={62+Math.floor(i/3)*56} textAnchor="middle" fill="#f97316" fontSize="11" fontFamily="JetBrains Mono">{i+1}</text>
      </g>
    ))}
  </svg>
);

const AsyncDiagram=({T})=>(
  <svg viewBox="0 0 480 130" style={{width:"100%",maxWidth:480,display:"block"}}>
    <text x="10" y="16" fill={T.t3} fontSize="10.5" fontFamily="JetBrains Mono" fontWeight="700">Without async — UI freezes while waiting</text>
    <rect x="10" y="22" width="460" height="22" rx="4" fill={T.panel} stroke={T.b2} strokeWidth="1"/>
    <rect x="10" y="22" width="160" height="22" rx="4" fill="#f7df1e1a" stroke="#f7df1e55" strokeWidth="1"/>
    <text x="90" y="37" textAnchor="middle" fill="#f7df1e" fontSize="10" fontFamily="JetBrains Mono">code runs</text>
    <rect x="170" y="22" width="300" height="22" rx="4" fill="#f871711a" stroke="#f8717155" strokeWidth="1"/>
    <text x="320" y="37" textAnchor="middle" fill="#f87171" fontSize="10" fontFamily="JetBrains Mono">⚠ waiting for server… UI frozen 🥶</text>

    <text x="10" y="68" fill={T.t3} fontSize="10.5" fontFamily="JetBrains Mono" fontWeight="700">With async/await — UI stays alive</text>
    <rect x="10" y="74" width="460" height="22" rx="4" fill={T.panel} stroke={T.b2} strokeWidth="1"/>
    <rect x="10" y="74" width="130" height="22" rx="4" fill="#22c55e1a" stroke="#22c55e55" strokeWidth="1"/>
    <text x="75" y="89" textAnchor="middle" fill="#22c55e" fontSize="10" fontFamily="JetBrains Mono">code runs ✓</text>
    <rect x="145" y="74" width="130" height="22" rx="4" fill={T.b1} stroke={T.b2} strokeWidth="1"/>
    <text x="210" y="89" textAnchor="middle" fill={T.t4} fontSize="10" fontFamily="JetBrains Mono">fetching… (bg) ⟳</text>
    <rect x="280" y="74" width="190" height="22" rx="4" fill="#22c55e1a" stroke="#22c55e55" strokeWidth="1"/>
    <text x="375" y="89" textAnchor="middle" fill="#22c55e" fontSize="10" fontFamily="JetBrains Mono">response → update UI ✓</text>
    <text x="240" y="120" textAnchor="middle" fill={T.t3} fontSize="10" fontFamily="JetBrains Mono">async/await lets JavaScript wait without blocking the browser tab</text>
  </svg>
);

const ComponentDiagram=({T})=>(
  <svg viewBox="0 0 480 180" style={{width:"100%",maxWidth:480,display:"block"}}>
    <text x="240" y="15" textAnchor="middle" fill={T.t3} fontSize="11" fontFamily="JetBrains Mono">React Component Tree — write once, reuse everywhere</text>
    <rect x="185" y="22" width="110" height="28" rx="6" fill="#61dafb1a" stroke="#61dafb55" strokeWidth="1.5"/>
    <text x="240" y="41" textAnchor="middle" fill="#61dafb" fontSize="11" fontFamily="JetBrains Mono" fontWeight="700">&lt;App /&gt;</text>
    <line x1="240" y1="50" x2="100" y2="76" stroke={T.b3} strokeWidth="1.5"/>
    <line x1="240" y1="50" x2="240" y2="76" stroke={T.b3} strokeWidth="1.5"/>
    <line x1="240" y1="50" x2="380" y2="76" stroke={T.b3} strokeWidth="1.5"/>
    {[["&lt;Header/&gt;",50,"#f97316"],["&lt;Feed/&gt;",190,"#22c55e"],["&lt;Sidebar/&gt;",330,"#a78bfa"]].map(([n,x,c])=>(
      <g key={n}><rect x={x} y="76" width="100" height="26" rx="5" fill={c+"14"} stroke={c+"44"} strokeWidth="1.5"/><text x={x+50} y="93" textAnchor="middle" fill={c} fontSize="10" fontFamily="JetBrains Mono" fontWeight="700">{n}</text></g>
    ))}
    <line x1="100" y1="102" x2="60" y2="126" stroke={T.b2} strokeWidth="1"/>
    <line x1="100" y1="102" x2="140" y2="126" stroke={T.b2} strokeWidth="1"/>
    <line x1="240" y1="102" x2="205" y2="126" stroke={T.b2} strokeWidth="1"/>
    <line x1="240" y1="102" x2="275" y2="126" stroke={T.b2} strokeWidth="1"/>
    {[["&lt;Logo/&gt;",20],["&lt;Nav/&gt;",100],["&lt;Post/&gt;",165],["&lt;Post/&gt;",245]].map(([n,x])=>(
      <g key={x}><rect x={x} y="126" width="72" height="22" rx="4" fill={T.b1} stroke={T.b2} strokeWidth="1"/><text x={x+36} y="141" textAnchor="middle" fill={T.t3} fontSize="9" fontFamily="JetBrains Mono">{n}</text></g>
    ))}
    <text x="240" y="170" textAnchor="middle" fill={T.t3} fontSize="9.5" fontFamily="JetBrains Mono">Each box is independent — change one without breaking others</text>
  </svg>
);

/* TOC */
const SECTIONS=[
  {id:"overview",   label:"Overview",    emoji:"🌐", color:"#7c6ee0"},
  {id:"html",       label:"HTML",        emoji:"‹/›", color:"#f97316"},
  {id:"css",        label:"CSS",         emoji:"✦",  color:"#818cf8"},
  {id:"javascript", label:"JavaScript",  emoji:"JS", color:"#f7df1e"},
  {id:"typescript", label:"TypeScript",  emoji:"TS", color:"#60a5fa"},
  {id:"react",      label:"React",       emoji:"⚛",  color:"#61dafb"},
  {id:"node",       label:"Node.js",     emoji:"N",  color:"#4ade80"},
  {id:"resources",  label:"Resources",   emoji:"📚", color:"#a78bfa"},
];

export default function WebDev(){
  const T=useTheme();
  const[active,setActive]=useState("overview");
  const obsRef=useRef(null);

  useEffect(()=>{
    if(obsRef.current)obsRef.current.disconnect();
    obsRef.current=new IntersectionObserver(entries=>{
      entries.forEach(e=>{if(e.isIntersecting)setActive(e.target.id);});
    },{rootMargin:"-20% 0px -65% 0px",threshold:0});
    SECTIONS.forEach(s=>{const el=document.getElementById(s.id);if(el)obsRef.current.observe(el);});
    return()=>obsRef.current?.disconnect();
  },[T]);

  const jump=id=>document.getElementById(id)?.scrollIntoView({behavior:"smooth",block:"start"});
  const ACCENT="#7c6ee0";

  return(
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600&family=Syne:wght@400;500;600;700;800&family=Lora:ital,wght@0,400;0,500;1,400;1,500&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        html{scroll-behavior:smooth;}body{background:${T.shell};}
        ::-webkit-scrollbar{width:5px;}::-webkit-scrollbar-thumb{background:${T.hover};border-radius:3px;}
        ::selection{background:rgba(124,110,224,0.25);}
        .wd-sec{scroll-margin-top:80px;}
        code{fontFamily:"'JetBrains Mono',monospace";background:${T.panel};padding:1px 6px;borderRadius:4px;fontSize:0.88em;color:${ACCENT};}
        @media(max-width:900px){.wd-rail{display:none!important;}.wd-main{padding:40px 20px 80px!important;}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
      `}</style>

      <div style={{minHeight:"100vh",background:T.shell,color:T.t1,fontFamily:"'Syne',sans-serif"}}>

        {/* HERO */}
        <div style={{background:T.deep,borderBottom:`1px solid ${T.b1}`,padding:"96px 24px 56px",position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",inset:0,backgroundImage:`linear-gradient(${T.b1} 1px,transparent 1px),linear-gradient(90deg,${T.b1} 1px,transparent 1px)`,backgroundSize:"48px 48px",maskImage:"radial-gradient(ellipse 80% 80% at 50% 50%,black 20%,transparent 100%)",pointerEvents:"none"}}/>
          <div style={{position:"absolute",left:"65%",top:"50%",transform:"translate(-50%,-50%)",width:500,height:380,borderRadius:"50%",background:`radial-gradient(ellipse,${ACCENT}1e 0%,transparent 70%)`,filter:"blur(55px)",pointerEvents:"none"}}/>
          <div style={{maxWidth:1100,margin:"0 auto",position:"relative",display:"flex",alignItems:"center",gap:52,flexWrap:"wrap"}}>
            <div style={{flex:1,minWidth:280,animation:"fadeUp 0.5s ease both"}}>
              <div style={{display:"inline-flex",alignItems:"center",gap:7,padding:"4px 14px",borderRadius:100,background:`${ACCENT}14`,border:`1px solid ${ACCENT}40`,marginBottom:18}}>
                <Globe size={12} color={ACCENT}/>
                <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,fontWeight:700,color:ACCENT,letterSpacing:"2px",textTransform:"uppercase"}}>Web Development</span>
              </div>
              <h1 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:"clamp(34px,5.5vw,58px)",lineHeight:1.07,letterSpacing:"-1.4px",marginBottom:16,color:T.t1}}>
                Build what the<br/><span style={{color:ACCENT}}>whole world sees.</span>
              </h1>
              <p style={{fontFamily:"'Lora',serif",fontStyle:"italic",fontSize:"clamp(14px,1.9vw,17.5px)",color:T.t2,lineHeight:1.85,maxWidth:500,marginBottom:24}}>
                From a blank file to a live product someone on the other side of the world can open in their browser. Web development is the most visible, most immediately rewarding skill in software engineering.
              </p>
              <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap",rowGap:6}}>
                {SECTIONS.filter(s=>s.id!=="overview"&&s.id!=="resources").map((s,i,arr)=>(
                  <React.Fragment key={s.id}>
                    <button onClick={()=>jump(s.id)} style={{display:"flex",alignItems:"center",gap:5,padding:"4px 11px",borderRadius:7,border:`1px solid ${s.color}40`,background:`${s.color}0e`,cursor:"pointer",fontFamily:"'Syne',sans-serif",fontWeight:600,fontSize:12.5,color:s.color,transition:"all 0.14s"}}
                      onMouseEnter={e=>e.currentTarget.style.background=`${s.color}1e`}
                      onMouseLeave={e=>e.currentTarget.style.background=`${s.color}0e`}>
                      {s.label}
                    </button>
                    {i<arr.length-1&&<ChevronRight size={12} color={T.t4}/>}
                  </React.Fragment>
                ))}
              </div>
            </div>
            <div style={{flex:"0 0 auto",animation:"fadeUp 0.5s ease 0.1s both",opacity:0,animationFillMode:"forwards"}}>
              <DomTree T={T}/>
              <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:T.t3,textAlign:"center",marginTop:8}}>Every webpage is a tree of HTML elements</p>
            </div>
          </div>
        </div>

        {/* LAYOUT */}
        <div style={{maxWidth:1100,margin:"0 auto",padding:"0 24px",display:"flex",alignItems:"flex-start",gap:0}}>

          {/* LEFT TOC RAIL */}
          <aside className="wd-rail" style={{width:200,flexShrink:0,position:"sticky",top:70,alignSelf:"flex-start",paddingTop:44,paddingRight:22,paddingBottom:44}}>
            <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9.5,fontWeight:700,letterSpacing:"2px",textTransform:"uppercase",color:T.t3,marginBottom:14}}>Contents</p>
            {SECTIONS.map(s=>{
              const isAct=active===s.id;
              return(
                <button key={s.id} onClick={()=>jump(s.id)}
                  style={{display:"flex",alignItems:"center",gap:8,width:"100%",padding:"7px 10px",borderRadius:8,border:"none",background:isAct?`${s.color}14`:"transparent",cursor:"pointer",textAlign:"left",marginBottom:2,transition:"all 0.14s",borderLeft:isAct?`2px solid ${s.color}`:"2px solid transparent"}}>
                  <span style={{fontSize:12,flexShrink:0}}>{s.emoji}</span>
                  <span style={{fontFamily:"'Syne',sans-serif",fontWeight:isAct?700:500,fontSize:13,color:isAct?s.color:T.t2,transition:"color 0.14s"}}>{s.label}</span>
                </button>
              );
            })}
            <div style={{marginTop:20,padding:"11px 12px",background:T.panel,borderRadius:10,border:`1px solid ${T.b1}`}}>
              <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:T.t3,textTransform:"uppercase",letterSpacing:"0.8px",marginBottom:6}}>Timeline</p>
              <p style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:14.5,color:ACCENT,margin:0}}>4–6 months</p>
              <p style={{fontFamily:"'Lora',serif",fontSize:11.5,color:T.t3,margin:"3px 0 0",fontStyle:"italic"}}>to job-ready</p>
            </div>
          </aside>

          {/* MAIN CONTENT */}
          <main className="wd-main" style={{flex:1,minWidth:0,paddingTop:44,paddingBottom:100}}>

            {/* OVERVIEW */}
            <section id="overview" className="wd-sec" style={{marginBottom:0}}>
              <SectionHead num="Intro" title="What is Web Development?" emoji="🌐" color={ACCENT} sub="The complete picture before you write a single line." T={T}/>
              <p style={{fontFamily:"'Lora',serif",fontSize:16,color:T.t2,lineHeight:1.92,marginBottom:20}}>
                Every website you've ever opened is built from the same three layers: <strong style={{color:"#f97316"}}>HTML</strong> (the structure — what's on the page), <strong style={{color:"#818cf8"}}>CSS</strong> (the styling — what it looks like), and <strong style={{color:"#f7df1e"}}>JavaScript</strong> (the behaviour — what it does when you interact). This track teaches you all three, then adds TypeScript, React, and Node.js to make you a full-stack developer.
              </p>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:12,marginBottom:24}}>
                {[
                  {k:"Frontend",    v:"HTML+CSS+JS — what users see and touch",       color:"#61dafb"},
                  {k:"Backend",     v:"Server + database + API — stores and processes data", color:"#4ade80"},
                  {k:"Full-stack",  v:"Both sides — the most hirable profile",         color:ACCENT},
                ].map(c=>(
                  <div key={c.k} style={{padding:"14px 16px",borderRadius:12,border:`1px solid ${c.color}30`,background:T.card,borderTop:`2px solid ${c.color}`}}>
                    <p style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:14,color:c.color,marginBottom:6}}>{c.k}</p>
                    <p style={{fontFamily:"'Lora',serif",fontSize:13.5,color:T.t2,lineHeight:1.65,margin:0}}>{c.v}</p>
                  </div>
                ))}
              </div>
              <div style={{background:T.panel,border:`1px solid ${T.b1}`,borderRadius:12,padding:"16px 20px",marginBottom:16}}>
                <p style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:11,color:T.t3,letterSpacing:"1.5px",textTransform:"uppercase",marginBottom:12}}>What you'll build on this track</p>
                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:8}}>
                  {["Personal portfolio website","Weather app with live API data","E-commerce product page","React dashboard with charts","REST API with authentication","Real-time chat with WebSockets"].map(b=>(
                    <div key={b} style={{display:"flex",gap:7,alignItems:"flex-start"}}>
                      <CheckCircle2 size={13} color={ACCENT} style={{flexShrink:0,marginTop:2}}/>
                      <span style={{fontFamily:"'Syne',sans-serif",fontSize:13,color:T.t1}}>{b}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <Divider T={T}/>

            {/* HTML */}
            <section id="html" className="wd-sec" style={{marginBottom:0}}>
              <SectionHead num="Week 1–2" title="HTML" emoji="‹/›" color="#f97316" sub="The skeleton of every webpage — structure without style." T={T}/>
              <Analogy accent="#f97316" T={T} text="HTML is the blueprint of a building. It says 'there's a wall here, a door there, a window here' — but says nothing about colour or decoration. Every webpage ever made starts with HTML. It's not a programming language — it's a structure language. You describe what things are, not what they look like or do."/>
              <p style={{fontFamily:"'Lora',serif",fontSize:15.5,color:T.t2,lineHeight:1.9,marginBottom:18}}>
                HTML uses <strong style={{color:"#f97316"}}>tags</strong> wrapped in angle brackets. A tag like <code>&lt;h1&gt;</code> tells the browser "this is a main heading." Tags have an opening and closing form. You nest them inside each other to build hierarchy — this nested structure becomes the DOM (Document Object Model) that JavaScript can later manipulate.
              </p>
              <ConceptGrid accent="#f97316" T={T} items={[
                {k:"Tags & Elements",     v:"<h1>–<h6>, <p>, <div>, <span>, <a>, <img> — the vocabulary of HTML"},
                {k:"Attributes",          v:"href, src, alt, class, id — extra information attached to tags"},
                {k:"Semantic HTML",       v:"<header>, <nav>, <main>, <article>, <section>, <footer> — tags with meaning"},
                {k:"Forms & Inputs",      v:"<form>, <input>, <button>, <select>, <textarea> — how users send data"},
                {k:"Media",               v:"<img>, <video>, <audio>, <iframe> — embedding content"},
                {k:"The DOM",             v:"The browser turns your HTML into a tree of objects — JS reads and changes this tree"},
              ]}/>
              <CodeWin accent="#f97316" T={T} title="HTML — complete page structure" code={`<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>My Portfolio</title>
    <link rel="stylesheet" href="style.css" />
  </head>
  <body>

    <!-- Semantic header tells browsers AND screen readers this is navigation -->
    <header>
      <nav>
        <a href="/" aria-current="page">Home</a>
        <a href="/projects">Projects</a>
        <a href="/contact">Contact</a>
      </nav>
    </header>

    <!-- main wraps the page's primary content — only one per page -->
    <main>
      <section id="hero">
        <h1>Hi, I'm Alex 👋</h1>
        <p>I build things for the web.</p>
        <!-- href can be a URL, an anchor (#hero), or email (mailto:) -->
        <a href="#projects" class="btn-primary">See my work</a>
      </section>

      <section id="projects">
        <h2>Projects</h2>
        <!-- article = self-contained piece of content -->
        <article class="project-card">
          <img src="weather.png" alt="Weather app screenshot" />
          <h3>Weather App</h3>
          <p>Fetches real weather from an API using JavaScript.</p>
        </article>
      </section>
    </main>

    <footer>
      <p>© 2026 Alex. Built with HTML, CSS, JavaScript.</p>
    </footer>

    <!-- Scripts go at the end so HTML loads first -->
    <script src="app.js"></script>
  </body>
</html>`}/>
              <p style={{fontFamily:"'Lora',serif",fontStyle:"italic",fontSize:13.5,color:T.t2,lineHeight:1.72,marginTop:12,marginBottom:20}}>Every comment in this code explains <em>why</em> not just what. <code>&lt;main&gt;</code> should appear once. <code>alt</code> on images is for screen readers. Scripts at the end lets the HTML paint before JS loads. These small habits make your code professional from day one.</p>
              <ResourceRow T={T} links={[
                {label:"MDN HTML Guide",   href:"https://developer.mozilla.org/en-US/docs/Learn/HTML",type:"doc"},
                {label:"freeCodeCamp HTML",href:"https://www.freecodecamp.org/learn/2022/responsive-web-design/",type:"doc"},
                {label:"HTML Full Course", href:"https://www.youtube.com/watch?v=kUMe1FH4CHE",type:"yt"},
              ]}/>
            </section>

            <Divider T={T}/>

            {/* CSS */}
            <section id="css" className="wd-sec" style={{marginBottom:0}}>
              <SectionHead num="Week 3–6" title="CSS" emoji="✦" color="#818cf8" sub="Paint, furniture, lighting — make the blueprint beautiful." T={T}/>
              <Analogy accent="#818cf8" T={T} text="If HTML is the blueprint, CSS is the interior design. It decides the wall colour, furniture arrangement, lighting, and decoration. Without CSS, every webpage is plain black text on a white background — like a Word document from 1994. CSS is what turns a structural skeleton into something people want to look at."/>
              <p style={{fontFamily:"'Lora',serif",fontSize:15.5,color:T.t2,lineHeight:1.9,marginBottom:18}}>
                CSS works by selecting elements and applying rules. The <strong style={{color:"#818cf8"}}>cascade</strong> means later rules override earlier ones (hence Cascading Style Sheets). The two biggest layout tools you'll live in are <strong style={{color:"#818cf8"}}>Flexbox</strong> (arrange things in a row or column) and <strong style={{color:"#f97316"}}>Grid</strong> (arrange things in rows and columns simultaneously).
              </p>
              <div style={{marginBottom:20}}>
                <FlexGridDiagram T={T}/>
                <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:T.t3,textAlign:"center",marginTop:7}}>Flexbox = one direction at a time · Grid = two directions simultaneously</p>
              </div>
              <ConceptGrid accent="#818cf8" T={T} items={[
                {k:"Selectors",          v:"element, .class, #id, [attr], :hover, :focus, ::before — target any element"},
                {k:"Box Model",          v:"Every element = content + padding + border + margin. Understanding this unlocks all layouts."},
                {k:"Flexbox",            v:"display:flex — arrange children in a row or column. justify-content and align-items do most of the work."},
                {k:"CSS Grid",           v:"display:grid — define rows AND columns. grid-template-columns: repeat(3, 1fr) makes three equal columns instantly."},
                {k:"Responsive Design",  v:"@media (max-width: 640px) {} — change styles based on screen size. Mobile-first is the professional approach."},
                {k:"Custom Properties",  v:"--brand-color: #7c6ee0 — define values once, use everywhere. Changing a theme becomes one line."},
                {k:"Transitions & Anim", v:"transition: all 0.2s ease — smooth property changes on hover. @keyframes for complex animations."},
                {k:"clamp() & fluid type",v:"font-size: clamp(1rem, 2.5vw, 2rem) — text that scales perfectly between screen sizes without media queries."},
              ]}/>
              <CodeWin accent="#818cf8" T={T} title="CSS — box model, flexbox, grid, responsive, animations" code={`/* Custom properties — the foundation of a design system */
:root {
  --brand:   #7c6ee0;
  --teal:    #5eead4;
  --text-1:  #e8eaf2;
  --text-2:  #8892b0;
  --card-bg: #161927;
  --radius:  12px;
}

/* Hero — centred with flex, full viewport height */
.hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 80px 24px;
  text-align: center;
  background: radial-gradient(ellipse at 50% 40%, rgba(124,110,224,0.15), transparent 70%);
}

/* Fluid typography — scales between 2rem and 5rem */
.hero h1 {
  font-size: clamp(2rem, 5vw, 5rem);
  font-weight: 800;
  letter-spacing: -2px;
  line-height: 1.06;
}

/* Card grid — fills available space automatically */
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  padding: 0 24px;
}

/* Card with lift-on-hover */
.card {
  background: var(--card-bg);
  border: 1px solid rgba(120, 130, 180, 0.12);
  border-radius: var(--radius);
  padding: 24px;
  transition: transform 0.22s ease, box-shadow 0.22s ease;
}
.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 48px rgba(124, 110, 224, 0.18);
}

/* Responsive — below 640px, stack navigation vertically */
@media (max-width: 640px) {
  nav { flex-direction: column; gap: 8px; }
  .hero { padding: 48px 16px; }
}

/* Button with animated shimmer sweep */
.btn {
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, var(--brand), var(--teal));
  color: white;
  border: none;
  padding: 12px 28px;
  border-radius: 10px;
  font-weight: 700;
  cursor: pointer;
}
.btn::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.12) 50%, transparent 60%);
  transform: translateX(-100%);
  transition: transform 0.55s ease;
}
.btn:hover::after { transform: translateX(100%); }`}/>
              <p style={{fontFamily:"'Lora',serif",fontStyle:"italic",fontSize:13.5,color:T.t2,lineHeight:1.72,marginTop:12,marginBottom:20}}>The <code>clamp()</code> function is one of the most powerful in modern CSS — it creates a value with a minimum, preferred, and maximum. <code>clamp(2rem, 5vw, 5rem)</code> means "be 5% of viewport width, but never smaller than 2rem or larger than 5rem."</p>
              <ResourceRow T={T} links={[
                {label:"CSS Tricks",         href:"https://css-tricks.com",type:"doc"},
                {label:"Kevin Powell – CSS", href:"https://www.youtube.com/@KevinPowell",type:"yt"},
                {label:"Flexbox Froggy",     href:"https://flexboxfroggy.com",type:"doc"},
                {label:"Grid Garden",        href:"https://cssgridgarden.com",type:"doc"},
              ]}/>
            </section>

            <Divider T={T}/>

            {/* JAVASCRIPT */}
            <section id="javascript" className="wd-sec" style={{marginBottom:0}}>
              <SectionHead num="Week 7–14" title="JavaScript" emoji="JS" color="#f7df1e" sub="The brain — makes pages think, respond, and come alive." T={T}/>
              <Analogy accent="#f7df1e" T={T} text="HTML and CSS are like a beautiful printed poster — it looks great but you can't interact with it. JavaScript is what makes the poster come alive: pressing a button changes the text, a form checks your input before submitting, a timer counts down, data loads from the internet without reloading the page. It's the only language that runs natively inside every browser — no installation needed."/>
              <div style={{marginBottom:20}}>
                <AsyncDiagram T={T}/>
              </div>
              <ConceptGrid accent="#f7df1e" T={T} items={[
                {k:"Variables & Types",   v:"const, let (not var). Types: string, number, boolean, null, undefined, object, array, symbol."},
                {k:"Functions",           v:"Regular: function greet(name){…}  Arrow: const greet = (name) => 'Hello '+name. They're the same but arrow functions have no own 'this'."},
                {k:"DOM Manipulation",    v:"document.querySelector('#btn') gets the element. .textContent, .style, .classList let you change it. This is the core skill."},
                {k:"Events",              v:"addEventListener('click', fn) — user clicks, scrolls, types, hovers. Your code runs in response."},
                {k:"Array Methods",       v:".map(), .filter(), .reduce(), .find(), .some() — transform data without loops. The backbone of modern JS."},
                {k:"Destructuring",       v:"const {name, age} = user — extract values in one line. const [first, ...rest] = arr — same for arrays."},
                {k:"Fetch & Promises",    v:"fetch('/api/data') returns a Promise. async/await makes it read like synchronous code without blocking the browser."},
                {k:"Error Handling",      v:"try { await fetch(url) } catch(err) { handle gracefully } — always handle what can go wrong."},
                {k:"Modules (ES6)",       v:"import {greet} from './utils.js' — split code into files. export makes functions available to other files."},
                {k:"Closures",            v:"A function that 'remembers' the variables from where it was created, even after that scope is gone. Counters and event handlers use this constantly."},
              ]}/>
              <CodeWin accent="#f7df1e" T={T} title="JavaScript — DOM, events, fetch, async/await, error handling" code={`// 1. VARIABLES — const for things that don't change, let for things that do
const API_URL = 'https://api.github.com/search/repositories';

// 2. DOM SELECTION — querySelector finds the first matching element
const searchInput = document.querySelector('#search');
const searchBtn   = document.querySelector('#search-btn');
const resultsEl   = document.querySelector('#results');

// 3. ARRAY METHODS — .map turns each item into HTML
function renderRepos(repos) {
  return repos
    .filter(repo => !repo.fork)               // .filter removes unwanted items
    .slice(0, 8)                              // take only the first 8
    .map(repo => \`
      <div class="card">
        <h3><a href="\${repo.html_url}">\${repo.full_name}</a></h3>
        <p>\${repo.description || 'No description'}</p>
        <div class="meta">
          <span>⭐ \${repo.stargazers_count.toLocaleString()}</span>
          <span>🍴 \${repo.forks_count.toLocaleString()}</span>
          <span>\${repo.language || 'Unknown'}</span>
        </div>
      </div>
    \`)
    .join('');                                 // .join combines array into one string
}

// 4. ASYNC/AWAIT — fetch data without freezing the page
async function searchGitHub(query) {
  if (!query.trim()) return;

  resultsEl.innerHTML = '<p class="loading">Searching…</p>';

  try {
    // await pauses HERE until the server responds — but doesn't block the browser
    const response = await fetch(\`\${API_URL}?q=\${query}&sort=stars&per_page=8\`);

    if (!response.ok) {
      throw new Error(\`Server error: \${response.status}\`);
    }

    const data = await response.json();    // parse JSON response
    resultsEl.innerHTML = renderRepos(data.items);

  } catch (error) {
    // 5. ERROR HANDLING — always catch what can go wrong
    resultsEl.innerHTML = \`<p class="error">Oops: \${error.message}</p>\`;
    console.error('Search failed:', error);
  }
}

// 6. EVENTS — listen for user interactions
searchBtn.addEventListener('click', () => {
  searchGitHub(searchInput.value);
});

// 7. KEYBOARD EVENTS — also search on Enter key
searchInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') searchGitHub(event.target.value);
});

// 8. CLOSURES — counter that remembers its own state
function makeCounter(start = 0) {
  let count = start;          // this variable is "closed over"
  return {
    increment: () => ++count,
    decrement: () => --count,
    value: () => count,
  };
}
const counter = makeCounter(10);
counter.increment(); // 11
counter.increment(); // 12`}/>
              <p style={{fontFamily:"'Lora',serif",fontStyle:"italic",fontSize:13.5,color:T.t2,lineHeight:1.72,marginTop:12,marginBottom:20}}>Every comment in this code teaches a concept alongside the code. The template literal (backtick string with <code>${'{'}…{'}'}</code>) builds HTML from data. The <code>try/catch</code> block ensures a server error shows a friendly message, not a crashed page.</p>
              <ResourceRow T={T} links={[
                {label:"javascript.info",     href:"https://javascript.info",type:"doc"},
                {label:"Eloquent JavaScript", href:"https://eloquentjavascript.net",type:"doc"},
                {label:"Traversy Media JS",   href:"https://www.youtube.com/@TraversyMedia",type:"yt"},
                {label:"Fireship JS in 100s", href:"https://www.youtube.com/watch?v=DHjqpvDnNGE",type:"yt"},
              ]}/>
            </section>

            <Divider T={T}/>

            {/* TYPESCRIPT */}
            <section id="typescript" className="wd-sec" style={{marginBottom:0}}>
              <SectionHead num="Week 15–17" title="TypeScript" emoji="TS" color="#60a5fa" sub="JavaScript with a safety net — catches bugs before they run." T={T}/>
              <Analogy accent="#60a5fa" T={T} text="TypeScript is like labelling containers in a kitchen. If a container says 'sugar (grams: number)', you can't accidentally pour liquid in it — the system warns you. TypeScript adds type labels to JavaScript variables and function parameters. If you pass a number where a string is expected, TypeScript flags it before you run a single line. Instagram, Airbnb, and Microsoft all use TypeScript in production."/>
              <ConceptGrid accent="#60a5fa" T={T} items={[
                {k:"Basic Types",          v:"string, number, boolean, null, undefined, void — annotate any variable or parameter"},
                {k:"Arrays & Tuples",      v:"string[] or Array<string> — typed arrays. [string, number] — tuple with fixed positions"},
                {k:"Interfaces",           v:"interface User { id: number; name: string } — define the shape of any object"},
                {k:"Union Types",          v:"type Role = 'admin' | 'viewer' — the value can only be one of these exact strings"},
                {k:"Generics",             v:"function getFirst<T>(arr: T[]): T — write code that works for any type but stays safe"},
                {k:"Type Inference",       v:"const name = 'Alex' — TypeScript already knows this is a string. You don't need to write the type."},
                {k:"Optional & Readonly",  v:"name?: string — optional property. readonly id: number — can't be changed after creation"},
                {k:"Type Utilities",       v:"Partial<User>, Omit<User,'id'>, Pick<User,'name'> — transform types without repeating yourself"},
              ]}/>
              <CodeWin accent="#60a5fa" T={T} title="TypeScript — interfaces, generics, union types, utilities" code={`// TypeScript = JavaScript + types. It compiles to plain JavaScript.

// INTERFACE — defines the exact shape of an object
interface User {
  id:        number;
  name:      string;
  email:     string;
  role:      'admin' | 'editor' | 'viewer'; // union type — only these 3 values
  createdAt: Date;
  bio?:      string;                         // ? means optional
}

// FUNCTION TYPES — parameters and return value are explicit
function formatUser(user: User): string {
  // TypeScript guarantees user.name is a string here
  return \`\${user.name} (\${user.role})\`;
}

// TypeScript catches mistakes BEFORE runtime:
// formatUser({ id: 1, name: 42 })
// Error: Type 'number' is not assignable to type 'string'

// GENERICS — reusable logic that works for any type
async function fetchData<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
  return res.json() as T;
}

// Usage: TypeScript knows the type of the result
const user   = await fetchData<User>('/api/users/1');
const users  = await fetchData<User[]>('/api/users');

// TYPE UTILITIES — transform existing types
type NewUser       = Omit<User, 'id' | 'createdAt'>;  // for create forms
type UpdateUser    = Partial<User>;                     // all fields optional
type PublicUser    = Pick<User, 'id' | 'name'>;        // expose only these

// DISCRIMINATED UNION — model complex state safely
type ApiState<T> =
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error';   message: string };

function renderState<T>(state: ApiState<T>) {
  switch (state.status) {
    case 'loading': return 'Loading…';
    case 'success': return JSON.stringify(state.data);
    case 'error':   return \`Error: \${state.message}\`;
  }
}`}/>
              <ResourceRow T={T} links={[
                {label:"TypeScript Handbook",  href:"https://www.typescriptlang.org/docs/handbook/intro.html",type:"doc"},
                {label:"Total TypeScript",     href:"https://www.totaltypescript.com",type:"doc"},
                {label:"Matt Pocock YT",       href:"https://www.youtube.com/@MattPocockUk",type:"yt"},
              ]}/>
            </section>

            <Divider T={T}/>

            {/* REACT */}
            <section id="react" className="wd-sec" style={{marginBottom:0}}>
              <SectionHead num="Week 18–24" title="React" emoji="⚛" color="#61dafb" sub="Build UIs like LEGO — components you assemble, not HTML you repeat." T={T}/>
              <Analogy accent="#61dafb" T={T} text="Imagine building a table of 50 user profiles. Without React, you'd paste the same HTML block 50 times. With React, you write it once as a UserCard component and write <UserCard user={alex} /> wherever you need it. When you update the design, you change one file and every card updates. React is why Facebook, Airbnb, Netflix, and Instagram's frontends don't fall apart when they have 10,000 UI elements on screen."/>
              <div style={{marginBottom:20}}>
                <ComponentDiagram T={T}/>
              </div>
              <ConceptGrid accent="#61dafb" T={T} items={[
                {k:"Components",        v:"Function components are the only way. They take props, return JSX. Think of them as custom HTML tags."},
                {k:"Props",             v:"<UserCard name='Alex' role='admin' /> — pass data into a component like HTML attributes"},
                {k:"useState",          v:"const [count, setCount] = useState(0) — when state changes, React re-renders only the affected component"},
                {k:"useEffect",         v:"Runs after render. Use for: fetching data, subscriptions, DOM manipulation. Cleanup with return fn."},
                {k:"useRef",            v:"Holds a value across renders without causing re-renders. Also the way to access actual DOM elements."},
                {k:"useCallback/useMemo",v:"Prevent expensive recalculations and function re-creation on every render. Use when profiling shows slowness."},
                {k:"Context API",       v:"Share state globally without prop-drilling. createContext → Provider wraps the tree → useContext reads it."},
                {k:"React Router",      v:"<BrowserRouter> → <Routes> → <Route path='/about' element={<About/>}/> — client-side navigation"},
                {k:"React Query / SWR", v:"Server state management. Handles caching, background refetching, loading/error states for you."},
                {k:"Forms",             v:"Controlled: value={state} onChange={setState}. Uncontrolled: useRef. React Hook Form for complex forms."},
              ]}/>
              <CodeWin accent="#61dafb" T={T} title="React — hooks, props, data fetching, error boundaries" code={`import { useState, useEffect, useCallback } from 'react';

// COMPONENT — accepts props, returns JSX
interface UserCardProps {
  userId: number;
  onDelete?: (id: number) => void;
}

function UserCard({ userId, onDelete }: UserCardProps) {
  // STATE — causes re-render when updated
  const [user,    setUser]    = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);

  // EFFECT — runs after render, re-runs when userId changes
  useEffect(() => {
    let cancelled = false;                     // prevents stale updates

    async function load() {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchData<User>(\`/api/users/\${userId}\`);
        if (!cancelled) setUser(data);         // only update if still mounted
      } catch (err) {
        if (!cancelled) setError((err as Error).message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };        // cleanup — runs on unmount
  }, [userId]);                                // re-fetch when userId changes

  // CALLBACK — stable function reference, won't recreate on every render
  const handleDelete = useCallback(() => {
    onDelete?.(userId);
  }, [userId, onDelete]);

  // CONDITIONAL RENDERING — show different UI based on state
  if (loading) return <div className="skeleton-card" />;
  if (error)   return <div className="error-card">Error: {error}</div>;
  if (!user)   return null;

  return (
    <article className="user-card">
      <img src={user.avatar} alt={user.name} loading="lazy" />
      <div>
        <h3>{user.name}</h3>
        <p>{user.bio}</p>
        <span className={\`badge badge--\${user.role}\`}>{user.role}</span>
      </div>
      {onDelete && (
        <button onClick={handleDelete} aria-label="Delete user">×</button>
      )}
    </article>
  );
}

// PARENT — uses the component multiple times with different data
function TeamPage() {
  const [deletedIds, setDeletedIds] = useState<number[]>([]);

  const handleDelete = useCallback((id: number) => {
    setDeletedIds(prev => [...prev, id]);
  }, []);

  return (
    <section className="team-grid">
      {[1, 2, 3, 4, 5, 6].map(id =>
        // key helps React track which item is which during updates
        !deletedIds.includes(id) && (
          <UserCard key={id} userId={id} onDelete={handleDelete} />
        )
      )}
    </section>
  );
}`}/>
              <ResourceRow T={T} links={[
                {label:"React Docs (react.dev)",   href:"https://react.dev",type:"doc"},
                {label:"Codevolution React",       href:"https://www.youtube.com/@Codevolution",type:"yt"},
                {label:"Scrimba React Course",     href:"https://scrimba.com/learn/learnreact",type:"doc"},
                {label:"Fireship React in 100s",   href:"https://www.youtube.com/watch?v=Tn6-PIqc4UM",type:"yt"},
              ]}/>
            </section>

            <Divider T={T}/>

            {/* NODE.JS */}
            <section id="node" className="wd-sec" style={{marginBottom:0}}>
              <SectionHead num="Week 25+" title="Node.js + Backend" emoji="N" color="#4ade80" sub="JavaScript on the server — APIs, databases, authentication." T={T}/>
              <Analogy accent="#4ade80" T={T} text="Node.js takes JavaScript — which only lived in browsers — and lets it run on a server. Think of a restaurant: the frontend is the dining room (what customers see), and Node.js is the kitchen (where orders are processed, food is prepared, and records are kept). The kitchen handles things the dining room can't: storing data permanently, sending emails, processing payments, keeping secrets hidden from customers."/>
              <ConceptGrid accent="#4ade80" T={T} items={[
                {k:"Express.js",         v:"The most popular Node.js framework. Create routes with app.get('/path', handler). Middleware for auth, logging, parsing."},
                {k:"REST API Design",    v:"GET (read), POST (create), PUT/PATCH (update), DELETE. Return JSON. Use HTTP status codes (200, 201, 400, 401, 404, 500)."},
                {k:"Middleware",         v:"Functions that run between request and response: authenticate user, parse JSON body, log requests, validate inputs."},
                {k:"PostgreSQL + Prisma",v:"Prisma ORM gives you type-safe database access. Define your schema once, get auto-generated, type-checked queries."},
                {k:"JWT Authentication", v:"JSON Web Tokens — sign a token on login, verify it on every protected request. Never store plain passwords."},
                {k:"Environment Variables",v:".env files keep secrets (DB passwords, API keys) out of your code. Never commit them to git."},
                {k:"Error Handling",     v:"Global error middleware catches unhandled errors. Never expose stack traces to users in production."},
                {k:"Deployment",         v:"Railway (backend + DB) or Render for hosting. Vercel for frontend. Environment variables set in the dashboard."},
              ]}/>
              <CodeWin accent="#4ade80" T={T} title="Node.js + Express — REST API with auth, Prisma, middleware" code={`import express   from 'express';
import bcrypt    from 'bcrypt';
import jwt       from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const app    = express();
const prisma = new PrismaClient();
const SECRET = process.env.JWT_SECRET!;    // never hardcode secrets

app.use(express.json());                   // parse JSON request bodies

// MIDDLEWARE — runs before the route handler
function requireAuth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1]; // Bearer <token>
  if (!token) return res.status(401).json({ error: 'No token' });

  try {
    req.user = jwt.verify(token, SECRET);  // throws if invalid or expired
    next();                                 // pass to the route handler
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}

// POST /auth/register — create a new account
app.post('/auth/register', async (req, res) => {
  const { name, email, password } = req.body;

  // Check for existing user
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return res.status(409).json({ error: 'Email already in use' });

  // Hash the password — NEVER store plain text
  const passwordHash = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: { name, email, passwordHash },
    select: { id: true, name: true, email: true }, // never return passwordHash
  });

  // Sign a JWT — like issuing a temporary ID card
  const token = jwt.sign({ userId: user.id }, SECRET, { expiresIn: '7d' });

  res.status(201).json({ token, user });
});

// POST /auth/login
app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

  const token = jwt.sign({ userId: user.id }, SECRET, { expiresIn: '7d' });
  res.json({ token, user: { id: user.id, name: user.name } });
});

// GET /profile — protected route
app.get('/profile', requireAuth, async (req, res) => {
  const user = await prisma.user.findUnique({
    where:  { id: req.user.userId },
    select: { id: true, name: true, email: true, createdAt: true },
  });
  res.json(user);
});

// Global error handler — catches anything that throws
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(3000, () => console.log('API running on :3000'));`}/>
              <ResourceRow T={T} links={[
                {label:"Node.js Docs",        href:"https://nodejs.org/docs",type:"doc"},
                {label:"Prisma Docs",         href:"https://www.prisma.io/docs",type:"doc"},
                {label:"The Odin Project",    href:"https://www.theodinproject.com",type:"doc"},
                {label:"Traversy Media Node", href:"https://www.youtube.com/@TraversyMedia",type:"yt"},
              ]}/>
            </section>

            <Divider T={T}/>

            {/* RESOURCES */}
            <section id="resources" className="wd-sec">
              <SectionHead num="Reference" title="Full Resource Guide" emoji="📚" color="#a78bfa" sub="Curated — not exhaustive. These are the ones that actually teach." T={T}/>
              <p style={{fontFamily:"'Lora',serif",fontSize:16,color:T.t2,lineHeight:1.92,marginBottom:28}}>Suggested sequence: <strong style={{color:T.t1}}>freeCodeCamp</strong> for HTML/CSS fundamentals (interactive, free, certificated). Then <strong style={{color:T.t1}}>javascript.info</strong> for JavaScript — it's genuinely the best JS tutorial written. Then <strong style={{color:T.t1}}>react.dev</strong> for React (the official docs are excellent). For backend: The Odin Project. Use YouTube channels when you want a concept explained visually before reading the documentation.</p>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:12}}>
                {[
                  {name:"MDN Web Docs",           href:"https://developer.mozilla.org",type:"doc",desc:"The authoritative reference for HTML, CSS, and JavaScript. Bookmark it."},
                  {name:"The Odin Project",        href:"https://www.theodinproject.com",type:"doc",desc:"Free full-stack curriculum with real projects. One of the best free resources."},
                  {name:"freeCodeCamp",            href:"https://www.freecodecamp.org",type:"doc",desc:"Interactive lessons with certificates. Great for HTML/CSS and JavaScript fundamentals."},
                  {name:"javascript.info",         href:"https://javascript.info",type:"doc",desc:"The best JavaScript tutorial on the internet — beginner to advanced."},
                  {name:"react.dev",               href:"https://react.dev",type:"doc",desc:"Official React documentation with interactive examples. Genuinely well-written."},
                  {name:"Traversy Media",          href:"https://www.youtube.com/@TraversyMedia",type:"yt",desc:"Project-based web dev tutorials. Crash courses and full builds."},
                  {name:"Kevin Powell (CSS)",      href:"https://www.youtube.com/@KevinPowell",type:"yt",desc:"The best CSS teacher on the internet. If you struggle with CSS, watch Kevin."},
                  {name:"Fireship",                href:"https://www.youtube.com/@Fireship",type:"yt",desc:"100-second concept videos and longer deep dives. Modern, fast, accurate."},
                  {name:"Codevolution",            href:"https://www.youtube.com/@Codevolution",type:"yt",desc:"Deep React and TypeScript playlists — methodical, thorough."},
                ].map(r=>(
                  <a key={r.name} href={r.href} target="_blank" rel="noreferrer"
                    style={{display:"flex",alignItems:"flex-start",gap:12,padding:"14px 16px",borderRadius:12,border:`1px solid ${r.type==="yt"?"#f87171":"#60a5fa"}28`,background:r.type==="yt"?"#f871710a":"#60a5fa0a",textDecoration:"none",transition:"all 0.16s"}}
                    onMouseEnter={e=>{e.currentTarget.style.background=r.type==="yt"?"#f8717116":"#60a5fa16";}}
                    onMouseLeave={e=>{e.currentTarget.style.background=r.type==="yt"?"#f871710a":"#60a5fa0a";}}>
                    <span style={{fontSize:16,flexShrink:0,marginTop:2}}>{r.type==="yt"?"▶":"📖"}</span>
                    <div>
                      <p style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:14,color:T.t1,margin:"0 0 4px"}}>{r.name}</p>
                      <p style={{fontFamily:"'Lora',serif",fontSize:13,color:T.t3,margin:0,lineHeight:1.55,fontStyle:"italic"}}>{r.desc}</p>
                    </div>
                    <ArrowUpRight size={13} color={T.t4} style={{marginLeft:"auto",flexShrink:0,marginTop:4}}/>
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