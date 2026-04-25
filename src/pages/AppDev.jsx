import React,{useState,useEffect,useRef}from"react";
import{motion,AnimatePresence}from"framer-motion";
import{Smartphone,Code2,Layers,ArrowUpRight,CheckCircle2,ChevronRight}from"lucide-react";

/* THEME */
const PT={cosmos:{shell:"#07080d",deep:"#0c0e18",mid:"#111420",surface:"#161927",panel:"#1a1e2e",hover:"#1e2335",card:"#161927",cardH:"#1c2235",t1:"#e8eaf2",t2:"#8892b0",t3:"#5a6488",t4:"#2e3660",b1:"rgba(120,130,180,0.08)",b2:"rgba(120,130,180,0.15)",b3:"rgba(120,130,180,0.24)"},void:{shell:"#000",deep:"#050507",mid:"#0a0a0f",surface:"#0f0f15",panel:"#141419",hover:"#1a1a22",card:"#0f0f15",cardH:"#161622",t1:"#f0f0ff",t2:"#9090b8",t3:"#505070",t4:"#252540",b1:"rgba(100,100,200,0.08)",b2:"rgba(100,100,200,0.14)",b3:"rgba(100,100,200,0.22)"},aurora:{shell:"#040e0e",deep:"#071414",mid:"#0b1c1c",surface:"#102424",panel:"#142a2a",hover:"#1a3333",card:"#102424",cardH:"#162e2e",t1:"#e0f5f5",t2:"#7ab8b8",t3:"#3d7878",t4:"#1e4444",b1:"rgba(80,200,180,0.08)",b2:"rgba(80,200,180,0.15)",b3:"rgba(80,200,180,0.24)"},nord:{shell:"#1a1f2e",deep:"#1e2535",mid:"#232c40",surface:"#28334a",panel:"#2d3a50",hover:"#344260",card:"#28334a",cardH:"#2e3d55",t1:"#eceff4",t2:"#9ba8c0",t3:"#5c6a88",t4:"#3a4560",b1:"rgba(136,192,208,0.1)",b2:"rgba(136,192,208,0.18)",b3:"rgba(136,192,208,0.28)"},light:{shell:"#f3f4f8",deep:"#fff",mid:"#f0f1f7",surface:"#fff",panel:"#f7f8fc",hover:"#eef0f8",card:"#fff",cardH:"#f5f6fc",t1:"#111827",t2:"#4b5680",t3:"#7c87a8",t4:"#c5ccdf",b1:"rgba(80,90,150,0.08)",b2:"rgba(80,90,150,0.15)",b3:"rgba(80,90,150,0.24)"}};
const getT=()=>{try{return PT[localStorage.getItem("cj-theme")]||PT.light;}catch{return PT.light;}};
function useTheme(){const[T,setT]=useState(getT);useEffect(()=>{const iv=setInterval(()=>{const f=getT();if(f.t1!==T.t1)setT(f);},500);return()=>clearInterval(iv);},[T]);useEffect(()=>{const fn=()=>setT(getT());window.addEventListener("storage",fn);return()=>window.removeEventListener("storage",fn);},[]);return T;}

function hl(line,lang="dart"){
  let s=line.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
  s=s.replace(/(\/\/[^\n]*)/g,'<span style="color:#6a9955;font-style:italic">$1</span>');
  s=s.replace(/("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')/g,'<span style="color:#ce9178">$1</span>');
  const kw=lang==="swift"||lang==="kotlin"
    ?/\b(fun|val|var|class|object|data|interface|if|else|when|return|for|while|override|suspend|null|true|false|init|guard|let|struct|enum|protocol|extension|some|any|func|throws|async|await|import)\b/g
    :/\b(void|final|const|var|if|else|return|class|extends|override|async|await|for|while|import|new|this|null|true|false|Future|Stream|Widget|State|StatefulWidget|StatelessWidget|BuildContext|super)\b/g;
  s=s.replace(kw,'<span style="color:#c792ea">$1</span>');
  s=s.replace(/\b(\d+\.?\d*)\b/g,'<span style="color:#f78c6c">$1</span>');
  return s;
}

const CodeWin=({code,title,lang,accent,T})=>{
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
            <span style={{color:T.t2,whiteSpace:"pre"}} dangerouslySetInnerHTML={{__html:hl(line,lang||"dart")}}/>
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
    {links.map(({label,href,type})=>{const isYt=type==="yt";const color=isYt?"#f87171":"#60a5fa";return(
      <a key={label} href={href} target="_blank" rel="noreferrer"
        style={{display:"inline-flex",alignItems:"center",gap:5,padding:"5px 12px",borderRadius:8,border:`1px solid ${color}35`,background:`${color}0c`,textDecoration:"none",transition:"all 0.15s"}}
        onMouseEnter={e=>e.currentTarget.style.background=`${color}1a`}
        onMouseLeave={e=>e.currentTarget.style.background=`${color}0c`}>
        <span style={{fontSize:11}}>{isYt?"▶":"📖"}</span>
        <span style={{fontFamily:"'Syne',sans-serif",fontSize:12.5,fontWeight:600,color}}>{label}</span>
      </a>
    );})}
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

/* SVG - Mobile app layer stack */
const AppStackDiagram=({T})=>(
  <svg viewBox="0 0 480 200" style={{width:"100%",maxWidth:480,display:"block"}}>
    <text x="240" y="14" textAnchor="middle" fill={T.t3} fontSize="11" fontFamily="JetBrains Mono">How Flutter renders to both platforms</text>
    <text x="100" y="32" textAnchor="middle" fill={T.t3} fontSize="10" fontFamily="JetBrains Mono">Your Dart/Flutter Code</text>
    <rect x="10" y="38" width="180" height="28" rx="6" fill="#5eead414" stroke="#5eead455" strokeWidth="1.5"/>
    <text x="100" y="57" textAnchor="middle" fill="#5eead4" fontSize="11" fontFamily="JetBrains Mono" fontWeight="700">Flutter Widgets</text>
    <text x="100" y="86" textAnchor="middle" fill={T.t3} fontSize="9.5" fontFamily="JetBrains Mono">Flutter Engine (C++/Skia)</text>
    <rect x="10" y="90" width="180" height="24" rx="5" fill={T.b1} stroke={T.b2} strokeWidth="1"/>
    <text x="100" y="106" textAnchor="middle" fill={T.t2} fontSize="10" fontFamily="JetBrains Mono">Skia / Impeller rendering</text>
    {/* arrow */}
    <line x1="100" y1="114" x2="60" y2="138" stroke={T.b3} strokeWidth="1.5"/>
    <line x1="100" y1="114" x2="140" y2="138" stroke={T.b3} strokeWidth="1.5"/>
    {/* iOS + Android */}
    {[["iOS (Swift)",30,"#f97316"],["Android (Kotlin)",110,"#a78bfa"]].map(([lbl,x,col])=>(
      <g key={lbl}>
        <rect x={x} y="138" width="90" height="26" rx="5" fill={col+"14"} stroke={col+"44"} strokeWidth="1.5"/>
        <text x={x+45} y="155" textAnchor="middle" fill={col} fontSize="9.5" fontFamily="JetBrains Mono">{lbl}</text>
      </g>
    ))}
    {/* vs */}
    <text x="270" y="14" fill={T.t3} fontSize="10" fontFamily="JetBrains Mono">Native approach</text>
    <text x="280" y="32" fill="#f97316" fontSize="10" fontFamily="JetBrains Mono" fontWeight="700">Swift → iOS only</text>
    <rect x="260" y="38" width="100" height="24" rx="5" fill="#f9731614" stroke="#f9731644" strokeWidth="1.5"/>
    <text x="310" y="55" textAnchor="middle" fill="#f97316" fontSize="10" fontFamily="JetBrains Mono">SwiftUI / UIKit</text>
    <rect x="260" y="70" width="100" height="24" rx="5" fill="#f9731614" stroke="#f9731644" strokeWidth="1.5"/>
    <text x="310" y="87" textAnchor="middle" fill="#f97316" fontSize="10" fontFamily="JetBrains Mono">iOS Platform APIs</text>
    <text x="385" y="32" fill="#a78bfa" fontSize="10" fontFamily="JetBrains Mono" fontWeight="700">Kotlin → Android</text>
    <rect x="370" y="38" width="100" height="24" rx="5" fill="#a78bfa14" stroke="#a78bfa44" strokeWidth="1.5"/>
    <text x="420" y="55" textAnchor="middle" fill="#a78bfa" fontSize="10" fontFamily="JetBrains Mono">Jetpack Compose</text>
    <rect x="370" y="70" width="100" height="24" rx="5" fill="#a78bfa14" stroke="#a78bfa44" strokeWidth="1.5"/>
    <text x="420" y="87" textAnchor="middle" fill="#a78bfa" fontSize="10" fontFamily="JetBrains Mono">Android APIs</text>
    <text x="240" y="130" textAnchor="middle" fill={T.t3} fontSize="9.5" fontFamily="JetBrains Mono">Flutter: one codebase → both stores</text>
    <text x="325" y="130" textAnchor="middle" fill={T.t3} fontSize="9.5" fontFamily="JetBrains Mono">Native: separate codebases, full platform access</text>
  </svg>
);

const WidgetTreeDiagram=({T})=>(
  <svg viewBox="0 0 480 170" style={{width:"100%",maxWidth:480,display:"block"}}>
    <text x="240" y="14" textAnchor="middle" fill={T.t3} fontSize="11" fontFamily="JetBrains Mono">Flutter widget tree - everything is a widget</text>
    <rect x="185" y="22" width="110" height="26" rx="6" fill="#5eead414" stroke="#5eead455" strokeWidth="1.5"/>
    <text x="240" y="39" textAnchor="middle" fill="#5eead4" fontSize="11" fontFamily="JetBrains Mono" fontWeight="700">Scaffold</text>
    <line x1="240" y1="48" x2="120" y2="72" stroke={T.b3} strokeWidth="1.5"/>
    <line x1="240" y1="48" x2="360" y2="72" stroke={T.b3} strokeWidth="1.5"/>
    {[["AppBar",70,"#38bdf8"],["body: Column",310,"#5eead4"]].map(([n,x,c])=>(
      <g key={n}><rect x={x} y="72" width="100" height="24" rx="5" fill={c+"14"} stroke={c+"44"} strokeWidth="1.5"/><text x={x+50} y="88" textAnchor="middle" fill={c} fontSize="10" fontFamily="JetBrains Mono">{n}</text></g>
    ))}
    <line x1="360" y1="96" x2="280" y2="118" stroke={T.b2} strokeWidth="1"/>
    <line x1="360" y1="96" x2="360" y2="118" stroke={T.b2} strokeWidth="1"/>
    <line x1="360" y1="96" x2="440" y2="118" stroke={T.b2} strokeWidth="1"/>
    {[["Text",250,"#f7df1e"],["ElevatedButton",330,"#22c55e"],["Image",410,"#f97316"]].map(([n,x,c])=>(
      <g key={n}><rect x={x-30} y="118" width="78" height="22" rx="4" fill={c+"10"} stroke={c+"44"} strokeWidth="1"/><text x={x+9} y="133" textAnchor="middle" fill={c} fontSize="9" fontFamily="JetBrains Mono">{n}</text></g>
    ))}
    <text x="240" y="160" textAnchor="middle" fill={T.t3} fontSize="9.5" fontFamily="JetBrains Mono">In Flutter: Layout, styling, and behaviour are ALL widgets - no HTML/CSS split</text>
  </svg>
);

const SECTIONS=[
  {id:"overview", label:"Overview",     emoji:"📱", color:"#5eead4"},
  {id:"dart",     label:"Dart",         emoji:"◈",  color:"#5eead4"},
  {id:"flutter",  label:"Flutter",      emoji:"⬡",  color:"#38bdf8"},
  {id:"kotlin",   label:"Kotlin",       emoji:"Kt", color:"#a78bfa"},
  {id:"swift",    label:"Swift",        emoji:"Sw", color:"#f97316"},
  {id:"rn",       label:"React Native", emoji:"RN", color:"#61dafb"},
  {id:"resources",label:"Resources",    emoji:"📚", color:"#22c55e"},
];

export default function AppDev(){
  const T=useTheme();
  const[active,setActive]=useState("overview");
  const obsRef=useRef(null);
  const ACCENT="#5eead4";

  useEffect(()=>{
    if(obsRef.current)obsRef.current.disconnect();
    obsRef.current=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting)setActive(e.target.id);});},{rootMargin:"-20% 0px -65% 0px",threshold:0});
    SECTIONS.forEach(s=>{const el=document.getElementById(s.id);if(el)obsRef.current.observe(el);});
    return()=>obsRef.current?.disconnect();
  },[T]);

  const jump=id=>document.getElementById(id)?.scrollIntoView({behavior:"smooth",block:"start"});

  return(
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600&family=Syne:wght@400;500;600;700;800&family=Lora:ital,wght@0,400;0,500;1,400;1,500&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        html{scroll-behavior:smooth;}body{background:${T.shell};}
        ::-webkit-scrollbar{width:5px;}::-webkit-scrollbar-thumb{background:${T.hover};border-radius:3px;}
        ::selection{background:rgba(94,234,212,0.2);}
        .ad-sec{scroll-margin-top:80px;}
        code{font-family:"'JetBrains Mono',monospace";background:${T.panel};padding:1px 6px;border-radius:4px;font-size:0.88em;color:${ACCENT};}
        @media(max-width:900px){.ad-rail{display:none!important;}.ad-main{padding:40px 20px 80px!important;}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
      `}</style>
      <div style={{minHeight:"100vh",background:T.shell,color:T.t1,fontFamily:"'Syne',sans-serif"}}>

        {/* HERO */}
        <div style={{background:T.deep,borderBottom:`1px solid ${T.b1}`,padding:"96px 24px 56px",position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",inset:0,backgroundImage:`linear-gradient(${T.b1} 1px,transparent 1px),linear-gradient(90deg,${T.b1} 1px,transparent 1px)`,backgroundSize:"48px 48px",maskImage:"radial-gradient(ellipse 80% 80% at 50% 50%,black 20%,transparent 100%)",pointerEvents:"none"}}/>
          <div style={{position:"absolute",left:"65%",top:"50%",transform:"translate(-50%,-50%)",width:500,height:380,borderRadius:"50%",background:`radial-gradient(ellipse,${ACCENT}18 0%,transparent 70%)`,filter:"blur(55px)",pointerEvents:"none"}}/>
          <div style={{maxWidth:1100,margin:"0 auto",position:"relative",display:"flex",alignItems:"center",gap:52,flexWrap:"wrap"}}>
            <div style={{flex:1,minWidth:280,animation:"fadeUp 0.5s ease both"}}>
              <div style={{display:"inline-flex",alignItems:"center",gap:7,padding:"4px 14px",borderRadius:100,background:`${ACCENT}14`,border:`1px solid ${ACCENT}40`,marginBottom:18}}>
                <Smartphone size={12} color={ACCENT}/>
                <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,fontWeight:700,color:ACCENT,letterSpacing:"2px",textTransform:"uppercase"}}>App Development</span>
              </div>
              <h1 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:"clamp(34px,5.5vw,58px)",lineHeight:1.07,letterSpacing:"-1.4px",marginBottom:16,color:T.t1}}>
                Ship to a<br/><span style={{color:ACCENT}}>billion pockets.</span>
              </h1>
              <p style={{fontFamily:"'Lora',serif",fontStyle:"italic",fontSize:"clamp(14px,1.9vw,17.5px)",color:T.t2,lineHeight:1.85,maxWidth:500,marginBottom:24}}>
                Mobile apps are how most people experience software. This track covers five paths - one codebase for both platforms (Flutter, React Native), or deeply native (Kotlin for Android, Swift for iOS). You choose based on your goal.
              </p>
              <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap",rowGap:6}}>
                {SECTIONS.filter(s=>s.id!=="overview"&&s.id!=="resources").map((s,i,arr)=>(
                  <React.Fragment key={s.id}>
                    <button onClick={()=>jump(s.id)} style={{display:"flex",alignItems:"center",gap:5,padding:"4px 11px",borderRadius:7,border:`1px solid ${s.color}40`,background:`${s.color}0e`,cursor:"pointer",fontFamily:"'Syne',sans-serif",fontWeight:600,fontSize:12.5,color:s.color,transition:"all 0.14s"}}
                      onMouseEnter={e=>e.currentTarget.style.background=`${s.color}1e`}
                      onMouseLeave={e=>e.currentTarget.style.background=`${s.color}0e`}>{s.label}</button>
                    {i<arr.length-1&&<ChevronRight size={12} color={T.t4}/>}
                  </React.Fragment>
                ))}
              </div>
            </div>
            <div style={{flex:"0 0 auto",animation:"fadeUp 0.5s ease 0.1s both",opacity:0,animationFillMode:"forwards"}}>
              <AppStackDiagram T={T}/>
            </div>
          </div>
        </div>

        <div style={{maxWidth:1100,margin:"0 auto",padding:"0 24px",display:"flex",alignItems:"flex-start",gap:0}}>
          {/* TOC */}
          <aside className="ad-rail" style={{width:200,flexShrink:0,position:"sticky",top:70,alignSelf:"flex-start",paddingTop:44,paddingRight:22,paddingBottom:44}}>
            <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9.5,fontWeight:700,letterSpacing:"2px",textTransform:"uppercase",color:T.t3,marginBottom:14}}>Contents</p>
            {SECTIONS.map(s=>{const isAct=active===s.id;return(
              <button key={s.id} onClick={()=>jump(s.id)} style={{display:"flex",alignItems:"center",gap:8,width:"100%",padding:"7px 10px",borderRadius:8,border:"none",background:isAct?`${s.color}14`:"transparent",cursor:"pointer",textAlign:"left",marginBottom:2,transition:"all 0.14s",borderLeft:isAct?`2px solid ${s.color}`:"2px solid transparent"}}>
                <span style={{fontSize:12,flexShrink:0}}>{s.emoji}</span>
                <span style={{fontFamily:"'Syne',sans-serif",fontWeight:isAct?700:500,fontSize:13,color:isAct?s.color:T.t2,transition:"color 0.14s"}}>{s.label}</span>
              </button>
            );})}
            <div style={{marginTop:20,padding:"11px 12px",background:T.panel,borderRadius:10,border:`1px solid ${T.b1}`}}>
              <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:T.t3,textTransform:"uppercase",letterSpacing:"0.8px",marginBottom:6}}>Timeline</p>
              <p style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:14.5,color:ACCENT,margin:0}}>5–7 months</p>
              <p style={{fontFamily:"'Lora',serif",fontSize:11.5,color:T.t3,margin:"3px 0 0",fontStyle:"italic"}}>to published app</p>
            </div>
          </aside>

          <main className="ad-main" style={{flex:1,minWidth:0,paddingTop:44,paddingBottom:100}}>

            {/* OVERVIEW */}
            <section id="overview" className="ad-sec">
              <SectionHead num="Intro" title="Choosing Your Path" emoji="📱" color={ACCENT} sub="Cross-platform or native? The right answer depends on your goal." T={T}/>
              <p style={{fontFamily:"'Lora',serif",fontSize:16,color:T.t2,lineHeight:1.92,marginBottom:20}}>
                App development has two strategies: <strong style={{color:"#38bdf8"}}>cross-platform</strong> (write one codebase that runs on iOS and Android) and <strong style={{color:"#f97316"}}>native</strong> (write separately for each platform using Apple's or Google's official tools). Both are valid - the choice depends on your budget, team size, and how deep you need to go into platform-specific features.
              </p>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:28}}>
                {[
                  {title:"Cross-platform (Flutter or React Native)",color:"#38bdf8",items:["One codebase → iOS + Android + Web + Desktop","Faster to build, slightly less native feel","Recommended for beginners and indie developers","Used by: Google Pay, Alibaba, Shopify, Facebook Ads"]},
                  {title:"Native (Kotlin or Swift)",color:"#f97316",items:["iOS only (Swift) or Android only (Kotlin)","Full access to every platform API","Best performance for hardware-intensive apps","Used by: Instagram iOS, WhatsApp Android, Uber"]},
                ].map(p=>(
                  <div key={p.title} style={{background:T.card,border:`1px solid ${p.color}30`,borderRadius:13,padding:"18px",borderTop:`2px solid ${p.color}`}}>
                    <h3 style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:14.5,color:p.color,marginBottom:12}}>{p.title}</h3>
                    {p.items.map(item=>(
                      <div key={item} style={{display:"flex",gap:7,alignItems:"flex-start",marginBottom:7}}>
                        <CheckCircle2 size={12} color={p.color} style={{flexShrink:0,marginTop:2}}/>
                        <span style={{fontFamily:"'Syne',sans-serif",fontSize:13,color:T.t2}}>{item}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
              <div style={{background:`${ACCENT}0c`,border:`1px solid ${ACCENT}28`,borderRadius:12,padding:"14px 18px"}}>
                <p style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:12,color:ACCENT,marginBottom:6}}>🎯 Our recommendation for beginners</p>
                <p style={{fontFamily:"'Lora',serif",fontSize:14.5,color:T.t1,lineHeight:1.72,margin:0}}>Start with <strong>Flutter + Dart</strong>. One language, one framework, runs everywhere. The Dart language is clean and easy to learn if you know JavaScript. Flutter has the best hot-reload experience of any mobile framework - you see changes instantly without rebuilding the app.</p>
              </div>
            </section>

            <Divider T={T}/>

            {/* DART */}
            <section id="dart" className="ad-sec">
              <SectionHead num="Week 1–3" title="Dart" emoji="◈" color="#5eead4" sub="Flutter's language - clean, null-safe, and fast to learn." T={T}/>
              <Analogy accent="#5eead4" T={T} text="Dart is to Flutter what JavaScript is to React - you can't use one without knowing the other, and the language was literally designed to make the framework work well. The good news: Dart reads almost like TypeScript or Java, but cleaner. If you've seen any curly-brace language before, Dart will take you maybe two weeks to feel comfortable in."/>
              <ConceptGrid accent="#5eead4" T={T} items={[
                {k:"var / final / const",   v:"var for mutable variables. final = set once at runtime. const = compile-time constant. Prefer final."},
                {k:"Null Safety",            v:"String? name - the ? means this can be null. String name - this CANNOT be null. The compiler enforces this, preventing crashes."},
                {k:"Named Parameters",       v:"void greet({required String name, int age = 0}) - named params make function calls readable: greet(name: 'Alex')"},
                {k:"Arrow Functions",        v:"int double(int n) => n * 2 - single-expression functions use => instead of {} return. Same as JS."},
                {k:"Classes & Constructors", v:"Dart uses const constructors for immutable objects. class User { final String name; const User(this.name); }"},
                {k:"List / Map / Set",       v:"List<String>, Map<String,int>, Set<int> - typed collections. Every item must match the type."},
                {k:"async / await",          v:"identical to JavaScript's async/await. Future = Promise. Stream = Observable (ongoing data)."},
                {k:"Extension Methods",      v:"extension on String { bool get isEmail => contains('@'); } - add methods to any existing class"},
                {k:"Mixins",                 v:"mixin Serializable on Model { Map toJson() {...} } - share behaviour across classes without inheritance"},
                {k:"Enum with methods",      v:"Dart enums can have fields and methods - enum Status { active, inactive; bool get isActive => this==active; }"},
              ]}/>
              <CodeWin accent="#5eead4" lang="dart" T={T} title="Dart - null safety, classes, async, collections" code={`// NULL SAFETY - the compiler guarantees no null-reference crashes
String nonNullable = "I will never be null";
String? nullable   = null;              // ? marks it as possibly null

// Safe access - only proceeds if name is not null
print(nullable?.toUpperCase());         // prints nothing if null

// Null coalescing - provide a default
String display = nullable ?? "Anonymous";

// CLASSES - clean syntax with named constructors
class User {
  final int    id;
  final String name;
  final String email;
  final String? bio;                     // optional field
  final DateTime createdAt;

  // Primary constructor with this.field shorthand
  const User({
    required this.id,
    required this.name,
    required this.email,
    this.bio,
    required this.createdAt,
  });

  // Factory constructor - for parsing JSON
  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id:        json['id'] as int,
      name:      json['name'] as String,
      email:     json['email'] as String,
      bio:       json['bio'] as String?,
      createdAt: DateTime.parse(json['created_at'] as String),
    );
  }

  // copyWith - create a modified copy without mutation
  User copyWith({ String? name, String? bio }) {
    return User(
      id:        id,
      name:      name ?? this.name,
      email:     email,
      bio:       bio ?? this.bio,
      createdAt: createdAt,
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id, 'name': name, 'email': email, 'bio': bio,
  };
}

// COLLECTIONS - typed and functional
final users = <User>[];

final names   = users.map((u) => u.name).toList();
final admins  = users.where((u) => u.bio != null).toList();
final nameMap = {for (final u in users) u.id: u.name};

// ASYNC - fetch from an API
Future<List<User>> fetchUsers() async {
  final response = await http.get(Uri.parse('/api/users'));

  if (response.statusCode != 200) {
    throw HttpException('Failed: \${response.statusCode}');
  }

  final data = jsonDecode(response.body) as List<dynamic>;
  return data.map((json) => User.fromJson(json)).toList();
}

// STREAM - for real-time data (like Firebase listeners)
Stream<List<User>> watchUsers() async* {
  while (true) {
    yield await fetchUsers();
    await Future.delayed(const Duration(seconds: 30));
  }
}`}/>
              <ResourceRow T={T} links={[
                {label:"Dart Language Tour", href:"https://dart.dev/language",type:"doc"},
                {label:"Dart Null Safety",   href:"https://dart.dev/null-safety",type:"doc"},
                {label:"Flutter Channel",    href:"https://www.youtube.com/@flutterdev",type:"yt"},
              ]}/>
            </section>

            <Divider T={T}/>

            {/* FLUTTER */}
            <section id="flutter" className="ad-sec">
              <SectionHead num="Week 4–10" title="Flutter" emoji="⬡" color="#38bdf8" sub="Everything is a widget - UI, layout, animation, input, all of it." T={T}/>
              <Analogy accent="#38bdf8" T={T} text="In HTML you have different concepts for structure (div), styling (CSS), and events (JS). In Flutter, there is only one concept: the Widget. A Text widget displays text. A Padding widget adds space. A GestureDetector widget detects taps. Even your whole screen is a widget. Nesting widgets inside each other - a widget tree - is the entire mental model. Once that clicks, Flutter feels incredibly logical."/>
              <div style={{marginBottom:20}}>
                <WidgetTreeDiagram T={T}/>
              </div>
              <ConceptGrid accent="#38bdf8" T={T} items={[
                {k:"StatelessWidget",       v:"A widget with no state - given the same inputs, always renders the same output. Text, Icon, Image are examples."},
                {k:"StatefulWidget",        v:"Has state that can change. When setState() is called, Flutter rebuilds only this widget and its children."},
                {k:"Column / Row / Stack",  v:"Column arranges children vertically. Row horizontally. Stack layers children on top of each other."},
                {k:"Expanded / Flexible",   v:"Inside Row/Column, Expanded fills remaining space. flex: 2 means 'take twice as much space as flex: 1'."},
                {k:"ListView / GridView",   v:"ListView.builder creates items lazily - only renders items on screen. Essential for long lists."},
                {k:"Navigator 2.0",         v:"go_router package is the standard. Define routes as paths: '/home', '/profile/:id'. Navigate with context.go('/profile/1')."},
                {k:"Provider / Riverpod",   v:"State management. Provider wraps the widget tree. Riverpod is the improved version - compile-safe, testable."},
                {k:"FutureBuilder",         v:"Builds different UI based on a Future's state: loading, success, or error. No manual setState needed."},
                {k:"AnimationController",   v:"Drive animations with a controller. Tween<double>(begin:0, end:1).animate(controller) - smooth value changes."},
                {k:"Platform Channels",     v:"Call native iOS/Swift or Android/Kotlin code from Flutter when you need APIs Flutter doesn't expose."},
              ]}/>
              <CodeWin accent="#38bdf8" lang="dart" T={T} title="Flutter - stateful widget, API call, FutureBuilder, animations" code={`import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

// ─── DATA MODEL ───────────────────────────────────────────
class Post {
  final int    id;
  final String title;
  final String body;
  const Post({required this.id, required this.title, required this.body});

  factory Post.fromJson(Map<String, dynamic> json) => Post(
    id:    json['id'] as int,
    title: json['title'] as String,
    body:  json['body'] as String,
  );
}

// ─── STATEFUL WIDGET - has state that changes ─────────────
class PostsScreen extends StatefulWidget {
  const PostsScreen({super.key});
  @override
  State<PostsScreen> createState() => _PostsScreenState();
}

class _PostsScreenState extends State<PostsScreen>
    with SingleTickerProviderStateMixin {

  late Future<List<Post>> _future;           // holds the async fetch
  late AnimationController _fabController;   // for the FAB animation
  late Animation<double> _fabAnimation;

  @override
  void initState() {
    super.initState();
    _future = _fetchPosts();

    // Animation: scale from 0 → 1 when screen loads
    _fabController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 400),
    );
    _fabAnimation = CurvedAnimation(
      parent: _fabController,
      curve: Curves.elasticOut,
    );
    _fabController.forward();
  }

  Future<List<Post>> _fetchPosts() async {
    final res = await http.get(
      Uri.parse('https://jsonplaceholder.typicode.com/posts'),
    );
    if (res.statusCode != 200) throw Exception('Failed to load');
    final data = jsonDecode(res.body) as List;
    return data.map((j) => Post.fromJson(j)).take(20).toList();
  }

  @override
  void dispose() {
    _fabController.dispose();             // always clean up controllers
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Posts'),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            // setState triggers a rebuild with the new future
            onPressed: () => setState(() { _future = _fetchPosts(); }),
          ),
        ],
      ),
      // FutureBuilder handles loading/error/success states for you
      body: FutureBuilder<List<Post>>(
        future: _future,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }
          if (snapshot.hasError) {
            return Center(child: Text('Error: \${snapshot.error}'));
          }
          final posts = snapshot.data!;
          return ListView.builder(
            itemCount: posts.length,
            itemBuilder: (context, index) {
              final post = posts[index];
              return ListTile(
                leading: CircleAvatar(child: Text('\${post.id}')),
                title: Text(post.title),
                subtitle: Text(post.body, maxLines: 1,
                  overflow: TextOverflow.ellipsis),
              );
            },
          );
        },
      ),
      // Animated FAB using ScaleTransition
      floatingActionButton: ScaleTransition(
        scale: _fabAnimation,
        child: FloatingActionButton(
          onPressed: () { /* open new post form */ },
          child: const Icon(Icons.add),
        ),
      ),
    );
  }
}`}/>
              <ResourceRow T={T} links={[
                {label:"flutter.dev",               href:"https://flutter.dev/learn",type:"doc"},
                {label:"Robert Brunhage",           href:"https://www.youtube.com/@RobertBrunhage",type:"yt"},
                {label:"Code With Andrea",          href:"https://www.youtube.com/@CodeWithAndrea",type:"yt"},
                {label:"Riverpod Docs",             href:"https://riverpod.dev",type:"doc"},
              ]}/>
            </section>

            <Divider T={T}/>

            {/* KOTLIN */}
            <section id="kotlin" className="ad-sec">
              <SectionHead num="Alternative" title="Kotlin (Android Native)" emoji="Kt" color="#a78bfa" sub="Android's official language - concise, safe, Jetpack Compose." T={T}/>
              <Analogy accent="#a78bfa" T={T} text="Kotlin is what you use when you need deep Android-specific access - Bluetooth, NFC payments, custom camera pipelines, widgets on the Android home screen. Think of it as choosing between a rental car (Flutter - works great, covers 95% of needs) and buying the exact car you want (Kotlin - full control, you own every gear). Google officially recommends Kotlin for all new Android development since 2017."/>
              <ConceptGrid accent="#a78bfa" T={T} items={[
                {k:"val / var",           v:"val = immutable (like final). var = mutable. Prefer val everywhere. The compiler warns you when you don't need var."},
                {k:"Null Safety",          v:"String? = nullable. String = cannot be null. ?. for safe access. ?: for default. !! forces non-null (use rarely)."},
                {k:"Data Classes",         v:"data class User(val name: String, val email: String) - auto-generates equals(), hashCode(), toString(), copy()"},
                {k:"Extension Functions",  v:"fun String.isEmail() = contains('@') - add methods to any class, even standard library ones"},
                {k:"Coroutines",           v:"suspend fun load() { val data = withContext(Dispatchers.IO) { api.fetch() } } - async without callbacks"},
                {k:"Flow (reactive)",      v:"Flow<T> is Kotlin's Stream - emit multiple values over time. Collected in a coroutine. Used for real-time UI."},
                {k:"Jetpack Compose",      v:"@Composable fun ProfileCard() - declarative UI like Flutter. States drive re-composition automatically."},
                {k:"ViewModel",            v:"Survives screen rotations. Holds UI state. Exposes StateFlow that Compose collects and re-renders on change."},
                {k:"Room Database",        v:"@Entity, @Dao, @Database - SQLite with type safety and coroutine support. The standard local persistence library."},
                {k:"Hilt (DI)",            v:"Dependency injection via annotations. @Inject, @HiltViewModel - Hilt provides instances; you declare what you need."},
              ]}/>
              <CodeWin accent="#a78bfa" lang="kotlin" T={T} title="Kotlin - ViewModel, Flow, Coroutines, Jetpack Compose" code={`// DATA LAYER - repository pattern
data class Post(val id: Int, val title: String, val body: String)

interface PostRepository {
  fun getPosts(): Flow<List<Post>>
  suspend fun refreshPosts()
}

// VIEWMODEL - survives rotations, exposes UI state
@HiltViewModel
class PostsViewModel @Inject constructor(
  private val repo: PostRepository
) : ViewModel() {

  // StateFlow: like LiveData but Kotlin-native and cold by default
  private val _state = MutableStateFlow<UiState<List<Post>>>(UiState.Loading)
  val state: StateFlow<UiState<List<Post>>> = _state.asStateFlow()

  init { loadPosts() }

  fun loadPosts() {
    viewModelScope.launch {               // cancelled when ViewModel is cleared
      _state.value = UiState.Loading
      try {
        repo.getPosts()
          .catch { e -> _state.value = UiState.Error(e.message ?: "Error") }
          .collect  { posts -> _state.value = UiState.Success(posts) }
      } catch (e: Exception) {
        _state.value = UiState.Error(e.message ?: "Unknown error")
      }
    }
  }

  fun retry() = loadPosts()
}

// SEALED CLASS - model UI states safely (no nulls, no magic booleans)
sealed class UiState<out T> {
  object Loading                            : UiState<Nothing>()
  data class Success<T>(val data: T)        : UiState<T>()
  data class Error(val message: String)     : UiState<Nothing>()
}

// JETPACK COMPOSE - declarative UI
@Composable
fun PostsScreen(viewModel: PostsViewModel = hiltViewModel()) {
  // collectAsState connects Compose to the StateFlow
  val state by viewModel.state.collectAsState()

  Scaffold(
    topBar = { TopAppBar(title = { Text("Posts") }) }
  ) { padding ->
    Box(modifier = Modifier.padding(padding)) {
      when (val s = state) {
        is UiState.Loading   -> CircularProgressIndicator(Modifier.align(Center))
        is UiState.Error     -> ErrorMessage(s.message) { viewModel.retry() }
        is UiState.Success   -> PostList(s.data)
      }
    }
  }
}

@Composable
fun PostList(posts: List<Post>) {
  LazyColumn {                             // LazyColumn = Flutter's ListView.builder
    items(posts, key = { it.id }) { post ->
      PostCard(post = post)
      HorizontalDivider()
    }
  }
}

@Composable
fun PostCard(post: Post) {
  ListItem(
    headlineContent  = { Text(post.title,  fontWeight = FontWeight.Medium) },
    supportingContent = { Text(post.body, maxLines = 2, overflow = Ellipsis) },
    leadingContent   = { Avatar(text = post.id.toString()) },
  )
}`}/>
              <ResourceRow T={T} links={[
                {label:"Android Kotlin Docs",   href:"https://developer.android.com/kotlin",type:"doc"},
                {label:"Jetpack Compose",       href:"https://developer.android.com/jetpack/compose",type:"doc"},
                {label:"PhilippLackner Android",href:"https://www.youtube.com/@PhilippLackner",type:"yt"},
              ]}/>
            </section>

            <Divider T={T}/>

            {/* SWIFT */}
            <section id="swift" className="ad-sec">
              <SectionHead num="Alternative" title="Swift (iOS Native)" emoji="Sw" color="#f97316" sub="Apple's language - the only way to deeply build for iPhone." T={T}/>
              <Analogy accent="#f97316" T={T} text="Swift is to iOS what Kotlin is to Android. If you want to build something that feels deeply, distinctly native on an iPhone - a camera app with custom filters, an Apple Watch face, a widget on the iOS home screen - Swift is the only way. Apple designed Swift to be safer, faster, and more readable than Objective-C. It compiles directly to machine code, making it genuinely fast."/>
              <ConceptGrid accent="#f97316" T={T} items={[
                {k:"let / var",             v:"let = constant (can't change). var = variable. Swift's type inference means you rarely need to write the type explicitly."},
                {k:"Optionals",             v:"var name: String? = nil - the ? marks a value as possibly absent. Unwrap with if let name { } or name ?? default."},
                {k:"Structs vs Classes",    v:"Structs are value types (copied on assignment) - prefer them. Classes are reference types (shared). Use classes for identity."},
                {k:"Protocols",             v:"Like interfaces. protocol Identifiable { var id: UUID { get } }. A type that 'conforms to' a protocol must implement it."},
                {k:"Generics",             v:"func first<T>(_ array: [T]) -> T? { return array.first } - write once, works for any type"},
                {k:"Closures",             v:"{ (x: Int) -> Int in return x * 2 } - blocks of code you pass around. Shorthand: { $0 * 2 }"},
                {k:"SwiftUI",              v:"Declarative UI like Flutter. @State drives re-renders. VStack, HStack, ZStack for layout. Previews in Xcode."},
                {k:"async/await",          v:"Swift's concurrency model. func loadData() async throws { let user = try await api.fetchUser() }"},
                {k:"@Published / ObservableObject", v:"@Observable marks a class; @State/@Binding drives SwiftUI re-renders. The equivalent of Flutter's setState + ChangeNotifier."},
                {k:"Core Data / SwiftData", v:"Apple's local persistence. SwiftData (iOS 17+) is the modern approach: @Model class Post {}. Automatically persistent."},
              ]}/>
              <CodeWin accent="#f97316" lang="swift" T={T} title="Swift - optionals, async/await, SwiftUI, @Observable" code={`import SwiftUI

// DATA MODEL - struct (value type, preferred in Swift)
struct Post: Identifiable, Decodable {
  let id:    Int
  let title: String
  let body:  String
}

// @Observable - tells SwiftUI to re-render when properties change
@Observable
class PostsViewModel {
  var posts:     [Post]   = []
  var isLoading: Bool     = false
  var errorMessage: String? = nil

  // async/await - no callbacks, reads like synchronous code
  func loadPosts() async {
    isLoading    = true
    errorMessage = nil

    do {
      let url  = URL(string: "https://jsonplaceholder.typicode.com/posts")!
      let (data, response) = try await URLSession.shared.data(from: url)

      guard let http = response as? HTTPURLResponse,
            http.statusCode == 200 else {
        throw URLError(.badServerResponse)
      }

      posts = try JSONDecoder().decode([Post].self, from: data)

    } catch {
      // nil-safe: errorMessage is String? so assigning a String is fine
      errorMessage = error.localizedDescription
    }

    isLoading = false
  }
}

// SWIFTUI VIEW - declarative, driven by ViewModel state
struct PostsView: View {
  @State private var vm = PostsViewModel()

  var body: some View {
    NavigationStack {
      Group {
        if vm.isLoading {
          ProgressView("Loading…")

        } else if let error = vm.errorMessage {
          ContentUnavailableView(
            "Something went wrong",
            systemImage: "exclamationmark.triangle",
            description: Text(error)
          )

        } else {
          List(vm.posts) { post in
            // Navigate to PostDetail - NavigationStack handles the stack
            NavigationLink(destination: PostDetail(post: post)) {
              VStack(alignment: .leading, spacing: 4) {
                Text(post.title)
                  .font(.headline)
                Text(post.body)
                  .font(.caption)
                  .foregroundStyle(.secondary)
                  .lineLimit(2)
              }
              .padding(.vertical, 4)
            }
          }
          .refreshable { await vm.loadPosts() }  // pull-to-refresh
        }
      }
      .navigationTitle("Posts")
      .task { await vm.loadPosts() }             // load when view appears
    }
  }
}

// SEPARATE DETAIL VIEW
struct PostDetail: View {
  let post: Post
  var body: some View {
    ScrollView {
      VStack(alignment: .leading, spacing: 16) {
        Text(post.title).font(.title2.bold())
        Text(post.body).foregroundStyle(.secondary)
      }
      .padding()
    }
    .navigationBarTitleDisplayMode(.inline)
  }
}`}/>
              <ResourceRow T={T} links={[
                {label:"Swift Documentation",    href:"https://swift.org/documentation",type:"doc"},
                {label:"SwiftUI Tutorials",      href:"https://developer.apple.com/tutorials/swiftui",type:"doc"},
                {label:"Hacking with Swift",     href:"https://www.hackingwithswift.com",type:"doc"},
                {label:"Sean Allen Swift",       href:"https://www.youtube.com/@SeanAllen",type:"yt"},
              ]}/>
            </section>

            <Divider T={T}/>

            {/* REACT NATIVE */}
            <section id="rn" className="ad-sec">
              <SectionHead num="Alternative" title="React Native" emoji="RN" color="#61dafb" sub="If you know React, you're 70% of the way to mobile." T={T}/>
              <Analogy accent="#61dafb" T={T} text="React Native is the bridge between web and mobile. You write code that looks almost identical to React - same useState, same useEffect, same component model - but instead of rendering HTML elements, React Native maps them to real native iOS and Android components. View becomes UIView (iOS) or ViewGroup (Android). Text becomes UILabel or TextView. You get native performance without learning two new platforms. Shopify's merchant app, Facebook Ads Manager, and Discord mobile are React Native."/>
              <ConceptGrid accent="#61dafb" T={T} items={[
                {k:"View / Text / Image",    v:"The native equivalents of div, p, img. View is a container. Text renders text (must be inside Text component). Image for local or remote images."},
                {k:"StyleSheet.create",      v:"CSS-like but camelCase. No cascade, no inheritance. Inline styles are allowed but StyleSheet.create is preferred for performance."},
                {k:"Flexbox (default)",      v:"All Views are flex containers by default. flexDirection: 'column' is the default (opposite of web). Layouts work the same as CSS Flexbox."},
                {k:"FlatList",               v:"The performant equivalent of HTML table or map() rendering. Only renders visible items. Use this for any list of items."},
                {k:"Pressable",             v:"The correct way to handle taps. Replace touchables with Pressable - it supports complex press states and accessibility."},
                {k:"React Navigation",       v:"The standard navigation library. Stack navigator, Tab navigator, Drawer navigator. Navigate with navigation.navigate('Profile', { id: 1 })"},
                {k:"AsyncStorage",           v:"@react-native-async-storage/async-storage - key-value store that persists between app launches. Use for tokens, preferences."},
                {k:"Expo",                   v:"Build React Native apps without Xcode or Android Studio. Expo Go app lets you preview instantly on your phone. expo-camera, expo-location, etc."},
                {k:"useColorScheme",         v:"const isDark = useColorScheme() === 'dark' - detect the user's system theme and apply the right colours."},
                {k:"Bridge vs JSI",          v:"Modern RN uses JSI (JavaScript Interface) for direct JS-to-native calls without the asynchronous bridge. Much faster."},
              ]}/>
              <CodeWin accent="#61dafb" lang="js" T={T} title="React Native - FlatList, Pressable, StyleSheet, hooks" code={`import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, FlatList, StyleSheet,
  Pressable, ActivityIndicator, RefreshControl,
  useColorScheme,
} from 'react-native';

// POST TYPE
interface Post {
  id: number;
  title: string;
  body: string;
}

// CUSTOM HOOK - separates data logic from UI
function usePosts() {
  const [posts,      setPosts]     = useState<Post[]>([]);
  const [loading,    setLoading]   = useState(true);
  const [refreshing, setRefreshing]= useState(false);
  const [error,      setError]     = useState<string | null>(null);

  const load = useCallback(async (isRefresh = false) => {
    isRefresh ? setRefreshing(true) : setLoading(true);
    setError(null);
    try {
      const res  = await fetch('https://jsonplaceholder.typicode.com/posts');
      const data = await res.json() as Post[];
      setPosts(data.slice(0, 20));
    } catch (e) {
      setError((e as Error).message);
    } finally {
      isRefresh ? setRefreshing(false) : setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  return { posts, loading, refreshing, error, refresh: () => load(true) };
}

// SINGLE ITEM - pure component for performance
const PostItem = React.memo(({ post, onPress }: { post: Post; onPress: (id: number) => void }) => (
  <Pressable
    style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
    onPress={() => onPress(post.id)}
    accessibilityRole="button"
    accessibilityLabel={post.title}
  >
    <View style={styles.cardHeader}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{post.id}</Text>
      </View>
      <Text style={styles.title} numberOfLines={2}>{post.title}</Text>
    </View>
    <Text style={styles.body} numberOfLines={3}>{post.body}</Text>
  </Pressable>
));

// MAIN SCREEN
export default function PostsScreen({ navigation }) {
  const { posts, loading, refreshing, error, refresh } = usePosts();
  const isDark = useColorScheme() === 'dark';

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#61dafb" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <Pressable style={styles.retryBtn} onPress={refresh}>
          <Text style={styles.retryText}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <FlatList
      data={posts}
      keyExtractor={item => item.id.toString()}
      renderItem={({ item }) => (
        <PostItem post={item} onPress={id => navigation.navigate('Detail', { id })}/>
      )}
      // Pull-to-refresh
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh}/>}
      // Performance: fixed-height items for better scrolling
      getItemLayout={(_, index) => ({ length: 100, offset: 100 * index, index })}
      contentContainerStyle={styles.list}
    />
  );
}

const styles = StyleSheet.create({
  list:         { padding: 16 },
  card:         { backgroundColor: '#161927', borderRadius: 12, padding: 16, marginBottom: 12 },
  cardPressed:  { opacity: 0.75 },
  cardHeader:   { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 8 },
  avatar:       { width: 32, height: 32, borderRadius: 16, backgroundColor: '#61dafb22', alignItems: 'center', justifyContent: 'center' },
  avatarText:   { color: '#61dafb', fontSize: 12, fontWeight: '700' },
  title:        { flex: 1, color: '#e8eaf2', fontWeight: '600', fontSize: 14, lineHeight: 20 },
  body:         { color: '#8892b0', fontSize: 13, lineHeight: 19 },
  centered:     { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16 },
  errorText:    { color: '#f87171', fontSize: 15 },
  retryBtn:     { backgroundColor: '#61dafb22', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 },
  retryText:    { color: '#61dafb', fontWeight: '700' },
});`}/>
              <ResourceRow T={T} links={[
                {label:"React Native Docs", href:"https://reactnative.dev",type:"doc"},
                {label:"Expo Docs",         href:"https://docs.expo.dev",type:"doc"},
                {label:"Fireship RN",       href:"https://www.youtube.com/watch?v=0-S5a0eXPoc",type:"yt"},
                {label:"Simon Grimm",       href:"https://www.youtube.com/@galaxies_dev",type:"yt"},
              ]}/>
            </section>

            <Divider T={T}/>

            {/* RESOURCES */}
            <section id="resources" className="ad-sec">
              <SectionHead num="Reference" title="Resource Guide" emoji="📚" color="#22c55e" sub="The best resources for each path - not every resource, the right ones." T={T}/>
              <p style={{fontFamily:"'Lora',serif",fontSize:16,color:T.t2,lineHeight:1.92,marginBottom:28}}>For Flutter beginners: start with <strong style={{color:T.t1}}>flutter.dev's official codelabs</strong>, then Robert Brunhage and Code With Andrea on YouTube. For React Native: the Expo docs are excellent - start there. For native Android: the official Android Developer site + Philipp Lackner on YouTube. For iOS: Hacking with Swift (free book + tutorials) is unmatched.</p>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:12}}>
                {[
                  {name:"flutter.dev",               href:"https://flutter.dev/learn",type:"doc",desc:"Official Flutter documentation and codelabs. The best starting point."},
                  {name:"dart.dev",                  href:"https://dart.dev/language",type:"doc",desc:"The complete Dart language tour - required before serious Flutter work."},
                  {name:"React Native Docs",         href:"https://reactnative.dev",type:"doc",desc:"Official React Native guide. Use with Expo for the fastest start."},
                  {name:"Hacking with Swift",        href:"https://www.hackingwithswift.com",type:"doc",desc:"Paul Hudson's free iOS course. 100 Days of SwiftUI is the best iOS curriculum available."},
                  {name:"Android Developer (Kotlin)",href:"https://developer.android.com/kotlin",type:"doc",desc:"Google's official Kotlin and Jetpack documentation. Comprehensive and up-to-date."},
                  {name:"Expo Docs",                 href:"https://docs.expo.dev",type:"doc",desc:"Build React Native without native tooling. Start here for RN."},
                  {name:"Robert Brunhage",           href:"https://www.youtube.com/@RobertBrunhage",type:"yt",desc:"Best Flutter tutorials for beginners. Clean, practical projects."},
                  {name:"Code With Andrea",          href:"https://www.youtube.com/@CodeWithAndrea",type:"yt",desc:"Advanced Flutter, Riverpod, and architecture patterns."},
                  {name:"Philipp Lackner (Kotlin)",  href:"https://www.youtube.com/@PhilippLackner",type:"yt",desc:"The best Kotlin/Android/Compose teacher on YouTube."},
                  {name:"Sean Allen (Swift)",        href:"https://www.youtube.com/@SeanAllen",type:"yt",desc:"Swift and SwiftUI from beginner to professional."},
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