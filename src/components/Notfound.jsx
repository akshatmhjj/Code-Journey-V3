/**
 * NotFound.jsx  →  /404
 * On-brand 404 with helpful navigation.
 */
import React,{useState,useEffect}from"react";
import{motion}from"framer-motion";
import{Globe,Smartphone,BarChart2,Code2,Map,BookOpen,ArrowLeft,Home,Search}from"lucide-react";

const PT={cosmos:{shell:"#07080d",deep:"#0c0e18",mid:"#111420",surface:"#161927",panel:"#1a1e2e",hover:"#1e2335",card:"#161927",cardH:"#1c2235",t1:"#e8eaf2",t2:"#8892b0",t3:"#5a6488",t4:"#2e3660",b1:"rgba(120,130,180,0.08)",b2:"rgba(120,130,180,0.15)",b3:"rgba(120,130,180,0.24)",acc:"#7c6ee0",teal:"#5eead4",green:"#22c55e",red:"#f87171",amber:"#fbbf24",dark:true},void:{shell:"#000",deep:"#050507",mid:"#0a0a0f",surface:"#0f0f15",panel:"#141419",hover:"#1a1a22",card:"#0f0f15",cardH:"#161622",t1:"#f0f0ff",t2:"#9090b8",t3:"#505070",t4:"#252540",b1:"rgba(100,100,200,0.08)",b2:"rgba(100,100,200,0.14)",b3:"rgba(100,100,200,0.22)",acc:"#8b7ff0",teal:"#2dd4bf",green:"#34d399",red:"#fc8181",amber:"#fcd34d",dark:true},aurora:{shell:"#040e0e",deep:"#071414",mid:"#0b1c1c",surface:"#102424",panel:"#142a2a",hover:"#1a3333",card:"#102424",cardH:"#162e2e",t1:"#e0f5f5",t2:"#7ab8b8",t3:"#3d7878",t4:"#1e4444",b1:"rgba(80,200,180,0.08)",b2:"rgba(80,200,180,0.15)",b3:"rgba(80,200,180,0.24)",acc:"#2dd4bf",teal:"#5eead4",green:"#4ade80",red:"#f87171",amber:"#fbbf24",dark:true},nord:{shell:"#1a1f2e",deep:"#1e2535",mid:"#232c40",surface:"#28334a",panel:"#2d3a50",hover:"#344260",card:"#28334a",cardH:"#2e3d55",t1:"#eceff4",t2:"#9ba8c0",t3:"#5c6a88",t4:"#3a4560",b1:"rgba(136,192,208,0.1)",b2:"rgba(136,192,208,0.18)",b3:"rgba(136,192,208,0.28)",acc:"#88c0d0",teal:"#8fbcbb",green:"#a3be8c",red:"#bf616a",amber:"#ebcb8b",dark:true},light:{shell:"#f3f4f8",deep:"#fff",mid:"#f0f1f7",surface:"#fff",panel:"#f7f8fc",hover:"#eef0f8",card:"#fff",cardH:"#f5f6fc",t1:"#111827",t2:"#4b5680",t3:"#7c87a8",t4:"#c5ccdf",b1:"rgba(80,90,150,0.08)",b2:"rgba(80,90,150,0.15)",b3:"rgba(80,90,150,0.24)",acc:"#6256d0",teal:"#0d9488",green:"#16a34a",red:"#dc2626",amber:"#d97706",dark:false}};
const getT=()=>{try{return PT[localStorage.getItem("cj-theme")]||PT.light;}catch{return PT.light;}};
function useTheme(){const[T,setT]=useState(getT);useEffect(()=>{const iv=setInterval(()=>{const f=getT();if(f.acc!==T.acc)setT(f);},500);return()=>clearInterval(iv);},[T]);useEffect(()=>{const fn=()=>setT(getT());window.addEventListener("storage",fn);return()=>window.removeEventListener("storage",fn);},[]);return T;}

const LINKS=[
  {href:"/",          icon:Home,       label:"Home",            color:"#7c6ee0"},
  {href:"/tracks/web",icon:Globe,      label:"Web Dev Track",   color:"#f97316"},
  {href:"/tracks/app",icon:Smartphone, label:"App Dev Track",   color:"#5eead4"},
  {href:"/tracks/data",icon:BarChart2, label:"Data Science",    color:"#f472b6"},
  {href:"/practice",  icon:Code2,      label:"Practice",        color:"#7c6ee0"},
  {href:"/roadmap",   icon:Map,        label:"Roadmap",         color:"#22c55e"},
  {href:"/blog",      icon:BookOpen,   label:"Blog",            color:"#f97316"},
  {href:"/search",    icon:Search,     label:"Search",          color:"#60a5fa"},
];

export default function NotFound() {
  const T = useTheme();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600&family=Syne:wght@400;500;600;700;800&family=Lora:ital,wght@0,400;0,500;1,400;1,500&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        body{background:${T.shell};}
        ::selection{background:rgba(124,110,224,0.25);}
        @keyframes cjFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
        @keyframes cjGlow{0%,100%{box-shadow:0 0 20px ${T.acc}44}50%{box-shadow:0 0 50px ${T.acc}77}}
      `}</style>
      <div style={{minHeight:"100vh",background:T.shell,color:T.t1,fontFamily:"'Syne',sans-serif",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"40px 24px",textAlign:"center",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,backgroundImage:`linear-gradient(${T.b1} 1px,transparent 1px),linear-gradient(90deg,${T.b1} 1px,transparent 1px)`,backgroundSize:"48px 48px",pointerEvents:"none"}}/>
        <div style={{position:"absolute",left:"50%",top:"50%",transform:"translate(-50%,-50%)",width:600,height:500,borderRadius:"50%",background:`radial-gradient(ellipse,${T.acc}18 0%,transparent 65%)`,filter:"blur(50px)",pointerEvents:"none"}}/>

        {/* 404 number */}
        <motion.div initial={{opacity:0,scale:0.8}} animate={{opacity:1,scale:1}} transition={{type:"spring",stiffness:200}}
          style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:"clamp(80px,18vw,160px)",lineHeight:0.9,letterSpacing:"-8px",color:"transparent",WebkitTextStroke:`2px ${T.acc}40`,marginBottom:0,position:"relative",animation:"cjFloat 4s ease-in-out infinite",userSelect:"none"}}>
          404
          <div style={{position:"absolute",inset:0,background:`linear-gradient(135deg,${T.acc}22,${T.teal}14)`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text"}}>404</div>
        </motion.div>

        {/* CJ Logo */}
        <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:0.15}}
          style={{width:52,height:52,borderRadius:16,background:`linear-gradient(135deg,${T.acc},${T.teal})`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:18,color:"#fff",marginBottom:20,animation:"cjGlow 3s ease infinite"}}>
          CJ
        </motion.div>

        <motion.h1 initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:0.2}}
          style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:"clamp(22px,4vw,36px)",color:T.t1,marginBottom:12,letterSpacing:"-0.5px",lineHeight:1.15}}>
          This page doesn't exist yet.
        </motion.h1>
        <motion.p initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.26}}
          style={{fontFamily:"'Lora',serif",fontStyle:"italic",fontSize:16,color:T.t2,lineHeight:1.75,maxWidth:440,marginBottom:36}}>
          Maybe it was moved, maybe it was never here, or maybe you're a tiny bit lost. Either way - here's where you actually want to go:
        </motion.p>

        {/* Quick links grid */}
        <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:0.32}}
          style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(150px,1fr))",gap:10,maxWidth:580,width:"100%",marginBottom:32}}>
          {LINKS.map(l=>(
            <a key={l.href} href={l.href}
              style={{display:"flex",alignItems:"center",gap:8,padding:"10px 14px",borderRadius:10,border:`1px solid ${l.color}30`,background:`${l.color}08`,textDecoration:"none",transition:"all 0.15s"}}
              onMouseEnter={e=>{e.currentTarget.style.background=`${l.color}18`;e.currentTarget.style.borderColor=`${l.color}55`;}}
              onMouseLeave={e=>{e.currentTarget.style.background=`${l.color}08`;e.currentTarget.style.borderColor=`${l.color}30`;}}>
              <l.icon size={14} color={l.color}/>
              <span style={{fontFamily:"'Syne',sans-serif",fontSize:13,fontWeight:600,color:T.t1}}>{l.label}</span>
            </a>
          ))}
        </motion.div>

        <motion.a href="/" initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.4}}
          style={{display:"inline-flex",alignItems:"center",gap:7,padding:"11px 22px",borderRadius:10,border:"none",background:T.acc,color:"#fff",fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:14,textDecoration:"none",boxShadow:`0 4px 20px ${T.acc}44`,transition:"opacity 0.16s"}}
          onMouseEnter={e=>e.currentTarget.style.opacity="0.85"}
          onMouseLeave={e=>e.currentTarget.style.opacity="1"}>
          <ArrowLeft size={14}/> Back to Home
        </motion.a>
      </div>
    </>
  );
}