/**
 * Modals.jsx — Code Journey Notification & Modal System
 *
 * A complete library of:
 *   Toast notifications (top-right stack, auto-dismiss)
 *   Inline banners (full-width contextual alerts)
 *   Confirmation dialogs (destructive actions)
 *   Rich modals (notes, tasks, updates, settings)
 *   Progress modals (code execution, file upload)
 *
 * All components read from localStorage["cj-theme"].
 * Import { useToast, ToastProvider } for the toast system.
 * Everything else is a self-contained component.
 *
 * USAGE:
 *   Wrap your app in <ToastProvider/>
 *   const { toast } = useToast();
 *   toast.success("Note saved!");
 *   toast.error("Something went wrong.");
 *   ... etc.
 */

import React, {
  useState, useEffect, useRef, useCallback,
  createContext, useContext, useReducer,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check, X, AlertTriangle, Info, Zap,
  BookOpen, CheckSquare, Square, Trash2,
  Bell, Code2, Rocket, Star, ArrowUpRight,
  RefreshCw, Upload, Download, Clock,
  ChevronRight, Sparkles, Globe, Layers,
  FileText, Edit3, Plus, Lock, Shield,
  BarChart2, Smartphone, TrendingUp, Award,
  AlertCircle, WifiOff, CheckCircle, XCircle,
  Terminal, Play, StopCircle, Activity,
  Save, Tag, Flag, User, Settings,
} from "lucide-react";

/* ══ THEME ══════════════════════════════════════════════ */
const PT = {
  cosmos:{ shell:"#07080d",deep:"#0c0e18",mid:"#111420",surface:"#161927",panel:"#1a1e2e",hover:"#1e2335",card:"#161927",cardH:"#1c2235",t1:"#e8eaf2",t2:"#8892b0",t3:"#5a6488",t4:"#2e3660",b1:"rgba(120,130,180,0.08)",b2:"rgba(120,130,180,0.15)",b3:"rgba(120,130,180,0.24)",acc:"#7c6ee0",teal:"#5eead4",green:"#22c55e",red:"#f87171",amber:"#fbbf24",dark:true},
  void:{   shell:"#000",   deep:"#050507",mid:"#0a0a0f",surface:"#0f0f15",panel:"#141419",hover:"#1a1a22",card:"#0f0f15",cardH:"#161622",t1:"#f0f0ff",t2:"#9090b8",t3:"#505070",t4:"#252540",b1:"rgba(100,100,200,0.08)",b2:"rgba(100,100,200,0.14)",b3:"rgba(100,100,200,0.22)",acc:"#8b7ff0",teal:"#2dd4bf",green:"#34d399",red:"#fc8181",amber:"#fcd34d",dark:true},
  aurora:{ shell:"#040e0e",deep:"#071414",mid:"#0b1c1c",surface:"#102424",panel:"#142a2a",hover:"#1a3333",card:"#102424",cardH:"#162e2e",t1:"#e0f5f5",t2:"#7ab8b8",t3:"#3d7878",t4:"#1e4444",b1:"rgba(80,200,180,0.08)",b2:"rgba(80,200,180,0.15)",b3:"rgba(80,200,180,0.24)",acc:"#2dd4bf",teal:"#5eead4",green:"#4ade80",red:"#f87171",amber:"#fbbf24",dark:true},
  nord:{   shell:"#1a1f2e",deep:"#1e2535",mid:"#232c40",surface:"#28334a",panel:"#2d3a50",hover:"#344260",card:"#28334a",cardH:"#2e3d55",t1:"#eceff4",t2:"#9ba8c0",t3:"#5c6a88",t4:"#3a4560",b1:"rgba(136,192,208,0.1)",b2:"rgba(136,192,208,0.18)",b3:"rgba(136,192,208,0.28)",acc:"#88c0d0",teal:"#8fbcbb",green:"#a3be8c",red:"#bf616a",amber:"#ebcb8b",dark:true},
  light:{  shell:"#f8f7ff",deep:"#fff",   mid:"#f0f1f7",surface:"#fff",   panel:"#f7f8fc",hover:"#eef0f8",card:"#fff",   cardH:"#f5f6fc",t1:"#111827",t2:"#4b5680",t3:"#7c87a8",t4:"#c5ccdf",b1:"rgba(80,90,150,0.08)",b2:"rgba(80,90,150,0.15)",b3:"rgba(80,90,150,0.24)",acc:"#6256d0",teal:"#0d9488",green:"#16a34a",red:"#dc2626",amber:"#d97706",dark:false},
};
const getT=()=>{try{return PT[localStorage.getItem("cj-theme")]||PT.cosmos;}catch{return PT.cosmos;}};
function useTheme(){const[T,setT]=useState(getT);useEffect(()=>{const iv=setInterval(()=>{const f=getT();if(f.acc!==T.acc)setT(f);},500);return()=>clearInterval(iv);},[T]);useEffect(()=>{const fn=()=>setT(getT());window.addEventListener("storage",fn);return()=>window.removeEventListener("storage",fn);},[]);return T;}

/* ══ TOAST CONTEXT ════════════════════════════════════ */
const ToastCtx = createContext(null);
let _toastId = 0;

function toastReducer(state, action) {
  switch(action.type) {
    case "ADD":    return [action.payload, ...state].slice(0, 6);
    case "REMOVE": return state.filter(t => t.id !== action.id);
    default:       return state;
  }
}

export function ToastProvider({ children }) {
  const [toasts, dispatch] = useReducer(toastReducer, []);
  const T = useTheme();

  const add = useCallback((variant, message, opts={}) => {
    const id = ++_toastId;
    dispatch({ type:"ADD", payload:{ id, variant, message, ...opts } });
    const dur = opts.duration ?? (variant==="loading" ? 99999 : 4000);
    if (dur < 99999) setTimeout(() => dispatch({ type:"REMOVE", id }), dur);
    return id;
  }, []);

  const remove = useCallback(id => dispatch({ type:"REMOVE", id }), []);

  const toast = {
    success: (msg, opts) => add("success", msg, opts),
    error:   (msg, opts) => add("error",   msg, opts),
    warn:    (msg, opts) => add("warn",    msg, opts),
    info:    (msg, opts) => add("info",    msg, opts),
    loading: (msg, opts) => add("loading", msg, opts),
    custom:  (msg, opts) => add("custom",  msg, opts),
    dismiss: remove,
  };

  return (
    <ToastCtx.Provider value={toast}>
      {children}
      <ToastStack toasts={toasts} dispatch={dispatch} T={T}/>
    </ToastCtx.Provider>
  );
}

export function useToast() {
  return useContext(ToastCtx);
}

/* ══ TOAST VARIANTS ═══════════════════════════════════ */
const TOAST_CFG = {
  success: { icon: CheckCircle, darkColor:"#4ade80", lightColor:"#16a34a", darkBg:"rgba(34,197,94,0.1)",  lightBg:"rgba(22,163,74,0.07)",  darkBorder:"rgba(34,197,94,0.25)",  lightBorder:"rgba(22,163,74,0.22)"  },
  error:   { icon: XCircle,     darkColor:"#f87171", lightColor:"#dc2626", darkBg:"rgba(248,113,113,0.1)",lightBg:"rgba(220,38,38,0.07)",  darkBorder:"rgba(248,113,113,0.25)",lightBorder:"rgba(220,38,38,0.22)"  },
  warn:    { icon: AlertTriangle,darkColor:"#fbbf24", lightColor:"#d97706", darkBg:"rgba(251,191,36,0.1)", lightBg:"rgba(217,119,6,0.07)",  darkBorder:"rgba(251,191,36,0.25)", lightBorder:"rgba(217,119,6,0.22)"  },
  info:    { icon: Info,         darkColor:"#60a5fa", lightColor:"#2563eb", darkBg:"rgba(96,165,250,0.1)", lightBg:"rgba(37,99,235,0.07)",  darkBorder:"rgba(96,165,250,0.25)", lightBorder:"rgba(37,99,235,0.22)"  },
  loading: { icon: RefreshCw,   darkColor:"#a78bfa", lightColor:"#7c3aed", darkBg:"rgba(167,139,250,0.1)",lightBg:"rgba(124,58,237,0.07)", darkBorder:"rgba(167,139,250,0.25)",lightBorder:"rgba(124,58,237,0.22)" },
  custom:  { icon: Sparkles,    darkColor:"#5eead4", lightColor:"#0d9488", darkBg:"rgba(94,234,212,0.1)", lightBg:"rgba(13,148,136,0.07)", darkBorder:"rgba(94,234,212,0.25)", lightBorder:"rgba(13,148,136,0.22)" },
};

function SingleToast({ t, onDismiss, T }) {
  const cfg = TOAST_CFG[t.variant] || TOAST_CFG.info;
  const color  = T.dark ? cfg.darkColor  : cfg.lightColor;
  const bg     = T.dark ? cfg.darkBg     : cfg.lightBg;
  const border = T.dark ? cfg.darkBorder : cfg.lightBorder;
  const Icon   = t.icon || cfg.icon;
  const isLoading = t.variant === "loading";

  return (
    <motion.div
      layout
      initial={{ opacity:0, x:60, scale:0.95 }}
      animate={{ opacity:1, x:0,  scale:1   }}
      exit={{    opacity:0, x:60, scale:0.95, transition:{duration:0.2} }}
      transition={{ type:"spring", stiffness:340, damping:30 }}
      style={{
        display:"flex", alignItems:"flex-start", gap:11,
        padding:"12px 14px",
        background: T.dark ? T.surface : T.white || "#fff",
        border:`1px solid ${border}`,
        borderRadius:12,
        boxShadow: T.dark
          ? `0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px ${border}`
          : `0 4px 20px rgba(0,0,0,0.1), 0 0 0 1px ${border}`,
        minWidth:300, maxWidth:380, width:"100%",
        cursor:"default", position:"relative", overflow:"hidden",
      }}>
      {/* Accent left bar */}
      <div style={{position:"absolute",left:0,top:0,bottom:0,width:3,background:color,borderRadius:"12px 0 0 12px"}}/>

      {/* Icon */}
      <div style={{width:30,height:30,borderRadius:8,background:bg,border:`1px solid ${border}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginLeft:6}}>
        {isLoading
          ? <motion.div animate={{rotate:360}} transition={{duration:0.9,repeat:Infinity,ease:"linear"}}><RefreshCw size={14} color={color}/></motion.div>
          : <Icon size={14} color={color}/>
        }
      </div>

      {/* Content */}
      <div style={{flex:1,minWidth:0}}>
        {t.title && <p style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:13.5,color:T.t1,margin:"0 0 2px",lineHeight:1.3}}>{t.title}</p>}
        <p style={{fontFamily:"'Lora',serif",fontSize:13,color:T.t2,margin:0,lineHeight:1.5,wordBreak:"break-word"}}>{t.message}</p>
        {t.action && (
          <button onClick={t.action.fn}
            style={{fontFamily:"'Syne',sans-serif",fontSize:12,fontWeight:700,color,background:"none",border:"none",cursor:"pointer",padding:"4px 0 0",display:"flex",alignItems:"center",gap:3}}>
            {t.action.label} <ChevronRight size={11}/>
          </button>
        )}
      </div>

      {/* Dismiss */}
      {!isLoading && (
        <button onClick={()=>onDismiss(t.id)}
          style={{width:22,height:22,borderRadius:"50%",background:"transparent",border:`1px solid ${T.b2}`,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0,color:T.t3,transition:"all 0.14s"}}
          onMouseEnter={e=>{e.currentTarget.style.background=T.hover;}}
          onMouseLeave={e=>{e.currentTarget.style.background="transparent";}}>
          <X size={11}/>
        </button>
      )}
    </motion.div>
  );
}

function ToastStack({ toasts, dispatch, T }) {
  return (
    <div style={{position:"fixed",top:80,right:20,zIndex:9999,display:"flex",flexDirection:"column",gap:8,alignItems:"flex-end",pointerEvents:"none"}}>
      <AnimatePresence mode="popLayout">
        {toasts.map(t => (
          <div key={t.id} style={{pointerEvents:"all"}}>
            <SingleToast t={t} onDismiss={id=>dispatch({type:"REMOVE",id})} T={T}/>
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}

/* ══ INLINE BANNER ═══════════════════════════════════ */
export function Banner({ variant="info", title, message, onDismiss, action, T:Tp }) {
  const T = Tp || getT();
  const cfg = TOAST_CFG[variant] || TOAST_CFG.info;
  const color  = T.dark ? cfg.darkColor  : cfg.lightColor;
  const bg     = T.dark ? cfg.darkBg     : cfg.lightBg;
  const border = T.dark ? cfg.darkBorder : cfg.lightBorder;
  const Icon   = cfg.icon;
  return (
    <motion.div initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}}
      style={{display:"flex",alignItems:"flex-start",gap:12,padding:"13px 16px",background:bg,border:`1px solid ${border}`,borderRadius:12,width:"100%"}}>
      <Icon size={16} color={color} style={{flexShrink:0,marginTop:1}}/>
      <div style={{flex:1,minWidth:0}}>
        {title&&<p style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:13.5,color:T.t1,margin:"0 0 3px"}}>{title}</p>}
        <p style={{fontFamily:"'Lora',serif",fontSize:13,color:T.t2,margin:0,lineHeight:1.55}}>{message}</p>
        {action&&<button onClick={action.fn} style={{fontFamily:"'Syne',sans-serif",fontSize:12.5,fontWeight:700,color,background:"none",border:"none",cursor:"pointer",padding:"5px 0 0",display:"flex",alignItems:"center",gap:3}}>{action.label}<ChevronRight size={11}/></button>}
      </div>
      {onDismiss&&<button onClick={onDismiss} style={{background:"none",border:"none",cursor:"pointer",color:T.t3,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",width:24,height:24,borderRadius:6,transition:"background 0.14s"}} onMouseEnter={e=>e.currentTarget.style.background=T.hover} onMouseLeave={e=>e.currentTarget.style.background="none"}><X size={13}/></button>}
    </motion.div>
  );
}

/* ══ MODAL SHELL ═══════════════════════════════════════ */
function ModalShell({ open, onClose, children, maxWidth=480, T }) {
  useEffect(()=>{
    if(!open)return;
    const fn=e=>{if(e.key==="Escape")onClose();};
    document.addEventListener("keydown",fn);
    return()=>document.removeEventListener("keydown",fn);
  },[open,onClose]);

  return (
    <AnimatePresence>
      {open&&(
        <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:0.18}}
          style={{position:"fixed",inset:0,zIndex:5000,display:"flex",alignItems:"center",justifyContent:"center",padding:16,background:"rgba(0,0,0,0.45)",backdropFilter:"blur(6px)"}}>
          <div style={{position:"absolute",inset:0}} onClick={onClose}/>
          <motion.div initial={{scale:0.94,y:16,opacity:0}} animate={{scale:1,y:0,opacity:1}} exit={{scale:0.95,y:10,opacity:0}} transition={{duration:0.22,ease:[0.22,1,0.36,1]}}
            style={{background:T.surface||T.card,border:`1px solid ${T.b2}`,borderRadius:18,width:"100%",maxWidth,position:"relative",boxShadow:T.dark?"0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(120,130,180,0.12)":"0 24px 60px rgba(0,0,0,0.15)",overflow:"hidden"}}>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ── Modal Header ── */
function MHead({ icon:Icon, iconColor, title, subtitle, onClose, T }) {
  return (
    <div style={{display:"flex",alignItems:"flex-start",gap:12,padding:"20px 20px 0"}}>
      {Icon&&<div style={{width:38,height:38,borderRadius:11,background:`${iconColor}16`,border:`1px solid ${iconColor}28`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Icon size={17} color={iconColor}/></div>}
      <div style={{flex:1,minWidth:0}}>
        <h3 style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:17,color:T.t1,margin:"0 0 3px",lineHeight:1.2}}>{title}</h3>
        {subtitle&&<p style={{fontFamily:"'Lora',serif",fontStyle:"italic",fontSize:13,color:T.t3,margin:0,lineHeight:1.5}}>{subtitle}</p>}
      </div>
      <button onClick={onClose} style={{width:28,height:28,borderRadius:"50%",background:"transparent",border:`1px solid ${T.b2}`,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:T.t3,flexShrink:0,transition:"all 0.14s"}} onMouseEnter={e=>{e.currentTarget.style.background=T.hover;}} onMouseLeave={e=>{e.currentTarget.style.background="transparent";}}><X size={13}/></button>
    </div>
  );
}

/* ── Modal Actions ── */
function MActions({ primary, secondary, T }) {
  return (
    <div style={{display:"flex",gap:8,padding:"0 20px 20px",justifyContent:"flex-end"}}>
      {secondary&&<button onClick={secondary.fn} style={{padding:"9px 18px",borderRadius:9,border:`1px solid ${T.b2}`,background:"transparent",color:T.t2,fontFamily:"'Syne',sans-serif",fontWeight:600,fontSize:13.5,cursor:"pointer",transition:"background 0.14s"}} onMouseEnter={e=>e.currentTarget.style.background=T.hover} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>{secondary.label}</button>}
      {primary&&<button onClick={primary.fn} disabled={primary.disabled} style={{padding:"9px 20px",borderRadius:9,border:"none",background:primary.color||T.acc,color:"#fff",fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:13.5,cursor:primary.disabled?"not-allowed":"pointer",opacity:primary.disabled?0.5:1,display:"flex",alignItems:"center",gap:7,transition:"opacity 0.14s"}} onMouseEnter={e=>!primary.disabled&&(e.currentTarget.style.opacity="0.87")} onMouseLeave={e=>e.currentTarget.style.opacity="1"}>{primary.icon&&<primary.icon size={13}/>}{primary.label}</button>}
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   ALL MODAL / NOTIFICATION COMPONENTS
══════════════════════════════════════════════════════ */

/* ── 1. CONFIRM DELETE (Note) ── */
export function ConfirmDeleteNoteModal({ open, onClose, noteTitle, onConfirm, T:Tp }) {
  const T=Tp||getT();
  return (
    <ModalShell open={open} onClose={onClose} maxWidth={420} T={T}>
      <MHead icon={Trash2} iconColor={T.red} title="Delete note?" subtitle={`"${noteTitle}" will be permanently removed.`} onClose={onClose} T={T}/>
      <div style={{padding:"16px 20px"}}>
        <Banner variant="error" message="This action cannot be undone. The note and all its content will be lost forever." T={T}/>
      </div>
      <MActions primary={{label:"Delete note",fn:onConfirm,color:T.red,icon:Trash2}} secondary={{label:"Cancel",fn:onClose}} T={T}/>
    </ModalShell>
  );
}

/* ── 2. NOTE SAVED ── */
export function NoteSavedModal({ open, onClose, noteTitle, T:Tp }) {
  const T=Tp||getT();
  return (
    <ModalShell open={open} onClose={onClose} maxWidth={400} T={T}>
      <div style={{padding:"32px 24px",textAlign:"center"}}>
        <motion.div initial={{scale:0}} animate={{scale:1}} transition={{type:"spring",stiffness:280,delay:0.08}}
          style={{width:52,height:52,borderRadius:"50%",background:`${T.green}16`,border:`1px solid ${T.green}40`,display:"inline-flex",alignItems:"center",justifyContent:"center",marginBottom:14}}>
          <Check size={22} color={T.green}/>
        </motion.div>
        <h3 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:19,color:T.t1,marginBottom:7}}>Note saved</h3>
        <p style={{fontFamily:"'Lora',serif",fontStyle:"italic",fontSize:14,color:T.t3,marginBottom:20,lineHeight:1.65}}>"{noteTitle}" has been saved to your notes.</p>
        <button onClick={onClose} style={{padding:"9px 24px",borderRadius:9,border:"none",background:T.green,color:"#fff",fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:14,cursor:"pointer",transition:"opacity 0.14s"}} onMouseEnter={e=>e.currentTarget.style.opacity="0.85"} onMouseLeave={e=>e.currentTarget.style.opacity="1"}>Got it</button>
      </div>
    </ModalShell>
  );
}

/* ── 3. CREATE NOTE ── */
export function CreateNoteModal({ open, onClose, onSave, T:Tp }) {
  const T=Tp||getT();
  const [title,setTitle]=useState(""); const [body,setBody]=useState(""); const [tag,setTag]=useState("general");
  const tags=["general","html","css","js","react","python","sql","flutter","notes"];
  return (
    <ModalShell open={open} onClose={onClose} maxWidth={500} T={T}>
      <MHead icon={FileText} iconColor={T.acc} title="New note" subtitle="Capture a concept, snippet, or reminder." onClose={onClose} T={T}/>
      <div style={{padding:"16px 20px",display:"flex",flexDirection:"column",gap:12}}>
        <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Note title…"
          style={{width:"100%",background:T.panel,border:`1px solid ${T.b2}`,borderRadius:9,padding:"10px 13px",fontFamily:"'Syne',sans-serif",fontSize:14,color:T.t1,outline:"none",transition:"border 0.14s"}}
          onFocus={e=>e.target.style.borderColor=T.acc} onBlur={e=>e.target.style.borderColor=T.b2}/>
        <textarea value={body} onChange={e=>setBody(e.target.value)} placeholder="What do you want to remember?"
          style={{width:"100%",background:T.panel,border:`1px solid ${T.b2}`,borderRadius:9,padding:"10px 13px",fontFamily:"'Lora',serif",fontSize:14,color:T.t1,outline:"none",resize:"vertical",minHeight:100,lineHeight:1.65,transition:"border 0.14s"}}
          onFocus={e=>e.target.style.borderColor=T.acc} onBlur={e=>e.target.style.borderColor=T.b2}/>
        <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
          {tags.map(t=><button key={t} onClick={()=>setTag(t)}
            style={{padding:"4px 11px",borderRadius:6,border:`1px solid ${tag===t?T.acc+"55":T.b2}`,background:tag===t?`${T.acc}14`:"transparent",color:tag===t?T.acc:T.t3,fontFamily:"'JetBrains Mono',monospace",fontSize:10.5,fontWeight:600,cursor:"pointer",transition:"all 0.13s"}}>
            #{t}
          </button>)}
        </div>
      </div>
      <MActions primary={{label:"Save note",fn:()=>{onSave?.({title,body,tag});onClose();},color:T.acc,icon:Save,disabled:!title.trim()}} secondary={{label:"Cancel",fn:onClose}} T={T}/>
    </ModalShell>
  );
}

/* ── 4. TASK COMPLETED ── */
export function TaskCompletedModal({ open, onClose, taskTitle, xpEarned=20, T:Tp }) {
  const T=Tp||getT();
  return (
    <ModalShell open={open} onClose={onClose} maxWidth={380} T={T}>
      <div style={{padding:"28px 24px",textAlign:"center"}}>
        <motion.div animate={{rotate:[0,-8,8,-5,5,0],scale:[1,1.1,1]}} transition={{duration:0.6,delay:0.1}}
          style={{fontSize:44,marginBottom:12,lineHeight:1}}>🎉</motion.div>
        <h3 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:20,color:T.t1,marginBottom:6}}>Task complete!</h3>
        <p style={{fontFamily:"'Lora',serif",fontStyle:"italic",fontSize:13.5,color:T.t3,marginBottom:18,lineHeight:1.6}}>"{taskTitle}"</p>
        <div style={{display:"inline-flex",alignItems:"center",gap:7,padding:"8px 18px",background:`${T.gold}16`,border:`1px solid ${T.gold}40`,borderRadius:9,marginBottom:20}}>
          <Star size={15} color={T.gold} fill={T.gold}/>
          <span style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:15,color:T.gold}}>+{xpEarned} XP</span>
        </div>
        <br/>
        <button onClick={onClose} style={{padding:"9px 24px",borderRadius:9,border:"none",background:T.acc,color:"#fff",fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:14,cursor:"pointer",transition:"opacity 0.14s"}} onMouseEnter={e=>e.currentTarget.style.opacity="0.85"} onMouseLeave={e=>e.currentTarget.style.opacity="1"}>Keep going →</button>
      </div>
    </ModalShell>
  );
}

/* ── 5. ADD TASK ── */
export function AddTaskModal({ open, onClose, onAdd, T:Tp }) {
  const T=Tp||getT();
  const [title,setTitle]=useState(""); const [priority,setPriority]=useState("medium"); const [dueDate,setDueDate]=useState("");
  const priorities=[{id:"low",color:T.green,label:"Low"},{id:"medium",color:T.amber,label:"Medium"},{id:"high",color:T.red,label:"High"}];
  return (
    <ModalShell open={open} onClose={onClose} maxWidth={460} T={T}>
      <MHead icon={CheckSquare} iconColor={T.acc} title="Add task" subtitle="Add a task to your learning board." onClose={onClose} T={T}/>
      <div style={{padding:"16px 20px",display:"flex",flexDirection:"column",gap:12}}>
        <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="What needs to be done?"
          style={{width:"100%",background:T.panel,border:`1px solid ${T.b2}`,borderRadius:9,padding:"10px 13px",fontFamily:"'Syne',sans-serif",fontSize:14,color:T.t1,outline:"none",transition:"border 0.14s"}}
          onFocus={e=>e.target.style.borderColor=T.acc} onBlur={e=>e.target.style.borderColor=T.b2}/>
        <div>
          <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,fontWeight:700,letterSpacing:"1px",textTransform:"uppercase",color:T.t3,marginBottom:8}}>Priority</p>
          <div style={{display:"flex",gap:8}}>
            {priorities.map(p=><button key={p.id} onClick={()=>setPriority(p.id)}
              style={{flex:1,padding:"8px",borderRadius:8,border:`1px solid ${priority===p.id?p.color+"55":T.b2}`,background:priority===p.id?`${p.color}14`:"transparent",color:priority===p.id?p.color:T.t3,fontFamily:"'Syne',sans-serif",fontSize:13,fontWeight:600,cursor:"pointer",transition:"all 0.13s",display:"flex",alignItems:"center",justifyContent:"center",gap:5}}>
              <Flag size={12}/>{p.label}
            </button>)}
          </div>
        </div>
        <div>
          <label style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,fontWeight:700,letterSpacing:"1px",textTransform:"uppercase",color:T.t3,marginBottom:7,display:"block"}}>Due date (optional)</label>
          <input type="date" value={dueDate} onChange={e=>setDueDate(e.target.value)}
            style={{width:"100%",background:T.panel,border:`1px solid ${T.b2}`,borderRadius:9,padding:"10px 13px",fontFamily:"'Syne',sans-serif",fontSize:14,color:T.t1,outline:"none"}}/>
        </div>
      </div>
      <MActions primary={{label:"Add task",fn:()=>{onAdd?.({title,priority,dueDate});onClose();},color:T.acc,icon:Plus,disabled:!title.trim()}} secondary={{label:"Cancel",fn:onClose}} T={T}/>
    </ModalShell>
  );
}

/* ── 6. CONFIRM DELETE TASK ── */
export function ConfirmDeleteTaskModal({ open, onClose, taskTitle, onConfirm, T:Tp }) {
  const T=Tp||getT();
  return (
    <ModalShell open={open} onClose={onClose} maxWidth={400} T={T}>
      <MHead icon={Trash2} iconColor={T.red} title="Remove task?" subtitle={`"${taskTitle}" will be removed from your board.`} onClose={onClose} T={T}/>
      <div style={{padding:"16px 20px"}}><Banner variant="warn" message="This task and its progress will be deleted. This cannot be undone." T={T}/></div>
      <MActions primary={{label:"Remove",fn:onConfirm,color:T.red,icon:Trash2}} secondary={{label:"Keep it",fn:onClose}} T={T}/>
    </ModalShell>
  );
}

/* ── 7. PLATFORM UPDATE ── */
export function PlatformUpdateModal({ open, onClose, version, updates, T:Tp }) {
  const T=Tp||getT();
  return (
    <ModalShell open={open} onClose={onClose} maxWidth={500} T={T}>
      <MHead icon={Sparkles} iconColor={T.acc} title={`What's new in ${version}`} subtitle="Platform updates — shipped and live." onClose={onClose} T={T}/>
      <div style={{padding:"16px 20px",maxHeight:300,overflowY:"auto"}}>
        {(updates||[]).map((u,i)=>(
          <div key={i} style={{display:"flex",gap:11,alignItems:"flex-start",marginBottom:14}}>
            <div style={{width:28,height:28,borderRadius:7,background:`${u.color||T.acc}14`,border:`1px solid ${u.color||T.acc}28`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:1}}>
              <u.icon size={13} color={u.color||T.acc}/>
            </div>
            <div>
              <p style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:13.5,color:T.t1,margin:"0 0 3px"}}>{u.title}</p>
              <p style={{fontFamily:"'Lora',serif",fontSize:13,color:T.t3,margin:0,lineHeight:1.55}}>{u.desc}</p>
            </div>
          </div>
        ))}
      </div>
      <MActions primary={{label:"Got it",fn:onClose,color:T.acc}} T={T}/>
    </ModalShell>
  );
}

/* ── 8. CODE EXECUTION ── */
export function CodeRunModal({ open, onClose, lang, output, status, T:Tp }) {
  const T=Tp||getT();
  const isSuccess = status==="success";
  const isError   = status==="error";
  const isRunning = status==="running";
  const statusColor = isSuccess?T.green:isError?T.red:T.acc;
  return (
    <ModalShell open={open} onClose={onClose} maxWidth={560} T={T}>
      <div style={{padding:"16px 20px 0",display:"flex",alignItems:"center",gap:10}}>
        <div style={{width:34,height:34,borderRadius:9,background:`${statusColor}16`,border:`1px solid ${statusColor}28`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
          {isRunning
            ? <motion.div animate={{rotate:360}} transition={{duration:0.8,repeat:Infinity,ease:"linear"}}><RefreshCw size={15} color={statusColor}/></motion.div>
            : isSuccess ? <CheckCircle size={15} color={statusColor}/>
            : isError   ? <XCircle size={15} color={statusColor}/>
            : <Terminal size={15} color={statusColor}/>
          }
        </div>
        <div style={{flex:1}}>
          <div style={{display:"flex",alignItems:"center",gap:7}}>
            <h3 style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:16,color:T.t1,margin:0}}>
              {isRunning?"Running…":isSuccess?"Execution complete":"Runtime error"}
            </h3>
            <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,fontWeight:700,padding:"1px 7px",borderRadius:4,background:`${statusColor}14`,color:statusColor,border:`1px solid ${statusColor}28`}}>{lang}</span>
          </div>
        </div>
        <button onClick={onClose} style={{width:26,height:26,borderRadius:"50%",background:"transparent",border:`1px solid ${T.b2}`,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:T.t3}}><X size={12}/></button>
      </div>
      <div style={{padding:"12px 20px"}}>
        <div style={{background:T.deep||T.mid,borderRadius:10,padding:"14px",fontFamily:"'JetBrains Mono',monospace",fontSize:12.5,color:isError?T.red:T.t2,lineHeight:1.7,minHeight:80,maxHeight:200,overflowY:"auto",border:`1px solid ${T.b2}`,whiteSpace:"pre-wrap"}}>
          {isRunning?(
            <motion.span animate={{opacity:[1,0.3,1]}} transition={{duration:1,repeat:Infinity}}>█</motion.span>
          ):output||"No output."}
        </div>
      </div>
      <MActions
        primary={isRunning?null:{label:isError?"Close":"Copy output",fn:()=>{if(!isError)navigator.clipboard?.writeText(output||"");onClose();},color:isError?T.red:T.green}}
        secondary={isRunning?null:{label:"Close",fn:onClose}}
        T={T}/>
    </ModalShell>
  );
}

/* ── 9. STAGE UNLOCKED ── */
export function StageUnlockedModal({ open, onClose, stageName, track, T:Tp }) {
  const T=Tp||getT();
  const trackColors={web:"#7c6ee0",app:"#5eead4",data:"#f472b6"};
  const color = trackColors[track]||T.acc;
  return (
    <ModalShell open={open} onClose={onClose} maxWidth={400} T={T}>
      <div style={{padding:"32px 24px",textAlign:"center"}}>
        <motion.div animate={{scale:[1,1.15,0.95,1.05,1]}} transition={{duration:0.7,delay:0.1}}
          style={{width:64,height:64,borderRadius:20,background:`linear-gradient(135deg,${color},${T.teal})`,display:"inline-flex",alignItems:"center",justifyContent:"center",marginBottom:16,boxShadow:`0 0 32px ${color}55`}}>
          <Rocket size={28} color="#fff"/>
        </motion.div>
        <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10.5,fontWeight:700,letterSpacing:"2px",textTransform:"uppercase",color,marginBottom:8}}>Stage unlocked</p>
        <h3 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:22,color:T.t1,marginBottom:8,letterSpacing:"-0.3px"}}>{stageName}</h3>
        <p style={{fontFamily:"'Lora',serif",fontStyle:"italic",fontSize:14,color:T.t3,marginBottom:22,lineHeight:1.65}}>You've completed the previous stage. The next part of your journey is now available.</p>
        <div style={{display:"flex",gap:8,justifyContent:"center"}}>
          <button onClick={onClose} style={{padding:"9px 18px",borderRadius:9,border:`1px solid ${T.b2}`,background:"transparent",color:T.t2,fontFamily:"'Syne',sans-serif",fontWeight:600,fontSize:13.5,cursor:"pointer"}}>Later</button>
          <button onClick={onClose} style={{padding:"9px 20px",borderRadius:9,border:"none",background:color,color:"#fff",fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:13.5,cursor:"pointer",display:"flex",alignItems:"center",gap:6,boxShadow:`0 4px 16px ${color}44`}}>
            Start stage <ArrowUpRight size={14}/>
          </button>
        </div>
      </div>
    </ModalShell>
  );
}

/* ── 10. OFFLINE / CONNECTION LOST ── */
export function OfflineModal({ open, onRetry, T:Tp }) {
  const T=Tp||getT();
  return (
    <ModalShell open={true} onClose={()=>{}} maxWidth={380} T={T}>
      <div style={{padding:"28px 24px",textAlign:"center"}}>
        <div style={{width:52,height:52,borderRadius:"50%",background:`${T.amber}16`,border:`1px solid ${T.amber}40`,display:"inline-flex",alignItems:"center",justifyContent:"center",marginBottom:14}}>
          <WifiOff size={22} color={T.amber}/>
        </div>
        <h3 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:19,color:T.t1,marginBottom:8}}>No internet connection</h3>
        <p style={{fontFamily:"'Lora',serif",fontStyle:"italic",fontSize:14,color:T.t3,marginBottom:22,lineHeight:1.65}}>Your changes are saved locally and will sync when you reconnect.</p>
        <button onClick={onRetry} style={{padding:"9px 22px",borderRadius:9,border:"none",background:T.amber,color:"#fff",fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:14,cursor:"pointer",display:"inline-flex",alignItems:"center",gap:7}}>
          <RefreshCw size={14}/> Try again
        </button>
      </div>
    </ModalShell>
  );
}

/* ── 11. SESSION EXPIRED ── */
export function SessionExpiredModal({ open, onLogin, T:Tp }) {
  const T=Tp||getT();
  return (
    <ModalShell open={open} onClose={()=>{}} maxWidth={380} T={T}>
      <div style={{padding:"28px 24px",textAlign:"center"}}>
        <div style={{width:52,height:52,borderRadius:"50%",background:`${T.red}14`,border:`1px solid ${T.red}35`,display:"inline-flex",alignItems:"center",justifyContent:"center",marginBottom:14}}>
          <Lock size={22} color={T.red}/>
        </div>
        <h3 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:19,color:T.t1,marginBottom:8}}>Session expired</h3>
        <p style={{fontFamily:"'Lora',serif",fontStyle:"italic",fontSize:14,color:T.t3,marginBottom:22,lineHeight:1.65}}>For your security, we logged you out after 30 minutes of inactivity. Sign in to continue.</p>
        <button onClick={onLogin} style={{padding:"9px 22px",borderRadius:9,border:"none",background:T.acc,color:"#fff",fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:14,cursor:"pointer",display:"inline-flex",alignItems:"center",gap:7}}>
          Sign in <ArrowUpRight size={14}/>
        </button>
      </div>
    </ModalShell>
  );
}

/* ── 12. PROFILE SAVED ── */
export function ProfileSavedModal({ open, onClose, T:Tp }) {
  const T=Tp||getT();
  return (
    <ModalShell open={open} onClose={onClose} maxWidth={380} T={T}>
      <div style={{padding:"28px 24px",textAlign:"center"}}>
        <motion.div initial={{scale:0}} animate={{scale:1}} transition={{type:"spring",stiffness:280,delay:0.08}}
          style={{width:52,height:52,borderRadius:"50%",background:`${T.green}16`,border:`1px solid ${T.green}40`,display:"inline-flex",alignItems:"center",justifyContent:"center",marginBottom:14}}>
          <User size={22} color={T.green}/>
        </motion.div>
        <h3 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:19,color:T.t1,marginBottom:8}}>Profile updated</h3>
        <p style={{fontFamily:"'Lora',serif",fontStyle:"italic",fontSize:14,color:T.t3,marginBottom:22,lineHeight:1.65}}>Your profile changes have been saved successfully.</p>
        <button onClick={onClose} style={{padding:"9px 22px",borderRadius:9,border:"none",background:T.green,color:"#fff",fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:14,cursor:"pointer"}}>Done</button>
      </div>
    </ModalShell>
  );
}

/* ── 13. THEME CHANGED TOAST VARIANT ── */
export function ThemeChangedBanner({ theme, onDismiss, T:Tp }) {
  const T=Tp||getT();
  return (
    <Banner variant="custom" title="Theme applied" message={`Switched to "${theme}" — the platform will feel like this everywhere.`} onDismiss={onDismiss} action={{label:"Change in Profile",fn:()=>window.location.href="/profile"}} T={T}/>
  );
}

/* ── 14. XP EARNED TOAST ── */
export function XpEarnedToast({ xp, reason, T:Tp }) {
  const T=Tp||getT();
  return (
    <div style={{display:"flex",alignItems:"center",gap:10,padding:"11px 14px",background:T.surface||T.card,border:`1px solid ${T.gold}40`,borderRadius:12,boxShadow:`0 4px 20px rgba(0,0,0,0.3)`,minWidth:260}}>
      <div style={{width:34,height:34,borderRadius:10,background:`${T.gold}18`,border:`1px solid ${T.gold}40`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
        <Star size={16} color={T.gold} fill={T.gold}/>
      </div>
      <div>
        <p style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:16,color:T.gold,margin:0}}>+{xp} XP</p>
        <p style={{fontFamily:"'Lora',serif",fontSize:12.5,color:T.t3,margin:0}}>{reason}</p>
      </div>
    </div>
  );
}

/* ── 15. ROADMAP PROGRESS ── */
export function RoadmapProgressModal({ open, onClose, track, stage, completedStages, totalStages, T:Tp }) {
  const T=Tp||getT();
  const pct=Math.round((completedStages/totalStages)*100);
  const trackColors={web:"#7c6ee0",app:"#5eead4",data:"#f472b6"};
  const color=trackColors[track]||T.acc;
  return (
    <ModalShell open={open} onClose={onClose} maxWidth={460} T={T}>
      <MHead icon={TrendingUp} iconColor={color} title="Your progress" subtitle={`${track.charAt(0).toUpperCase()+track.slice(1)} Development Track`} onClose={onClose} T={T}/>
      <div style={{padding:"16px 20px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
          <span style={{fontFamily:"'Syne',sans-serif",fontSize:13,color:T.t2,fontWeight:600}}>Overall completion</span>
          <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:13,color,fontWeight:700}}>{pct}%</span>
        </div>
        <div style={{height:8,borderRadius:4,background:T.b1,overflow:"hidden",marginBottom:20}}>
          <motion.div initial={{width:0}} animate={{width:`${pct}%`}} transition={{duration:0.8,ease:"easeOut"}} style={{height:"100%",background:`linear-gradient(90deg,${color},${T.teal})`,borderRadius:4}}/>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(100px,1fr))",gap:8}}>
          {Array.from({length:totalStages},(_,i)=>{
            const done=i<completedStages;
            const curr=i===completedStages;
            return (
              <div key={i} style={{padding:"9px 10px",borderRadius:9,border:`1px solid ${done?color+"44":curr?color+"66":T.b1}`,background:done?`${color}10`:curr?`${color}18`:"transparent",display:"flex",alignItems:"center",gap:7}}>
                <div style={{width:18,height:18,borderRadius:"50%",background:done?color:curr?`${color}30`:"transparent",border:`1.5px solid ${done?color:curr?color:T.b2}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  {done&&<Check size={10} color="#fff"/>}
                  {curr&&<div style={{width:6,height:6,borderRadius:"50%",background:color}}/>}
                </div>
                <span style={{fontFamily:"'Syne',sans-serif",fontSize:11.5,color:done?T.t1:curr?T.t1:T.t3,fontWeight:done||curr?600:400}}>Stage {i+1}</span>
              </div>
            );
          })}
        </div>
      </div>
      <MActions primary={{label:"Continue stage",fn:onClose,color}} secondary={{label:"Close",fn:onClose}} T={T}/>
    </ModalShell>
  );
}

/* ══════════════════════════════════════════════════════
   DEMO / SHOWCASE PAGE
══════════════════════════════════════════════════════ */
function DemoButton({ label, color, onClick, T }) {
  const [hov,setHov]=useState(false);
  return (
    <button onClick={onClick} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{padding:"8px 16px",borderRadius:9,border:`1px solid ${color}44`,background:hov?`${color}18`:`${color}10`,color,fontFamily:"'Syne',sans-serif",fontWeight:600,fontSize:13,cursor:"pointer",transition:"all 0.14s",display:"flex",alignItems:"center",gap:6,whiteSpace:"nowrap"}}>
      {label}
    </button>
  );
}

function Section({ title, children }) {
  return (
    <div style={{marginBottom:40}}>
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:18}}>
        <h2 style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:18,color:"#e8eaf2",margin:0,letterSpacing:"-0.2px"}}>{title}</h2>
        <div style={{flex:1,height:1,background:"rgba(120,130,180,0.1)"}}/>
      </div>
      <div style={{display:"flex",flexWrap:"wrap",gap:10}}>
        {children}
      </div>
    </div>
  );
}

export default function ModalsShowcase() {
  const T = { ...PT.cosmos, white:"#fff" };

  /* toast-like standalone state for demo */
  const [toasts,setToasts]=useState([]);
  const addToast=(variant,message,title,icon,action)=>{
    const id=Date.now();
    setToasts(prev=>[...prev,{id,variant,message,title,icon,action}].slice(-5));
    if(variant!=="loading") setTimeout(()=>setToasts(prev=>prev.filter(t=>t.id!==id)),4200);
  };

  /* Modal open states */
  const [m,setM]=useState({});
  const open=key=>setM(s=>({...s,[key]:true}));
  const close=key=>setM(s=>({...s,[key]:false}));

  /* Toasts */
  const [toastStack,setStack]=useState([]);
  let tid=useRef(100);
  const pushToast=(variant,message,title,icon,action)=>{
    const id=++tid.current;
    setStack(prev=>[{id,variant,message,title,icon,action},...prev].slice(0,5));
    const dur=variant==="loading"?99999:4200;
    if(dur<99999) setTimeout(()=>setStack(prev=>prev.filter(t=>t.id!==id)),dur);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600&family=Syne:wght@400;500;600;700;800&family=Lora:ital,wght@0,400;0,500;1,400;1,500&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        body{background:#07080d;color:#e8eaf2;font-family:'Syne',sans-serif;}
        ::-webkit-scrollbar{width:5px;}::-webkit-scrollbar-thumb{background:#1e2335;border-radius:3px;}
        ::selection{background:rgba(124,110,224,0.28);}
      `}</style>

      {/* Toast stack (top-right) */}
      <div style={{position:"fixed",top:24,right:24,zIndex:9999,display:"flex",flexDirection:"column",gap:8,alignItems:"flex-end",pointerEvents:"none"}}>
        <AnimatePresence mode="popLayout">
          {toastStack.map(t=>(
            <div key={t.id} style={{pointerEvents:"all"}}>
              <SingleToast t={t} onDismiss={id=>setStack(prev=>prev.filter(x=>x.id!==id))} T={T}/>
            </div>
          ))}
        </AnimatePresence>
      </div>

      {/* All modals */}
      <ConfirmDeleteNoteModal open={m.delNote} onClose={()=>close("delNote")} noteTitle="React hooks deep dive" onConfirm={()=>{close("delNote");pushToast("success","Note deleted.","Done");}} T={T}/>
      <NoteSavedModal open={m.noteSaved} onClose={()=>close("noteSaved")} noteTitle="React hooks deep dive" T={T}/>
      <CreateNoteModal open={m.createNote} onClose={()=>close("createNote")} onSave={()=>{pushToast("success","Note saved!","","",{label:"View notes",fn:()=>{}});}} T={T}/>
      <TaskCompletedModal open={m.taskDone} onClose={()=>close("taskDone")} taskTitle="Complete Stage 2 exercises" xpEarned={35} T={T}/>
      <AddTaskModal open={m.addTask} onClose={()=>close("addTask")} onAdd={()=>{pushToast("success","Task added to your board.");}} T={T}/>
      <ConfirmDeleteTaskModal open={m.delTask} onClose={()=>close("delTask")} taskTitle="Build a weather app" onConfirm={()=>{close("delTask");pushToast("warn","Task removed.");}} T={T}/>
      <PlatformUpdateModal open={m.update} onClose={()=>close("update")} version="v3.1.0"
        updates={[
          {icon:Sparkles,color:"#7c6ee0",title:"AppDev & DataScience pages redesigned",desc:"Sticky TOC, rich content, live code examples with syntax highlighting."},
          {icon:Code2,   color:"#22c55e",title:"Admin log composer unlocked",desc:"Triple-tap the live dot in CJ Logs to access the hidden panel."},
          {icon:Layers,  color:"#5eead4",title:"Roadmap stage cards improved",desc:"Expandable stages with skill cards, project ideas, and resource links."},
          {icon:Shield,  color:"#fbbf24",title:"Session expiry protection",desc:"Auto-logout after 30 minutes of inactivity with a clear modal warning."},
        ]}
        T={T}/>
      <CodeRunModal open={m.codeSuccess} onClose={()=>close("codeSuccess")} lang="JavaScript" status="success" output={`> Running JavaScript...\n\nHello, Code Journey!\nArray sum: 150\nFiltered: [4, 5]\n\nProcess exited with code 0`} T={T}/>
      <CodeRunModal open={m.codeError} onClose={()=>close("codeError")} lang="Python" status="error" output={`Traceback (most recent call last):\n  File "main.py", line 4, in <module>\n    print(result / 0)\nZeroDivisionError: division by zero`} T={T}/>
      <CodeRunModal open={m.codeRun} onClose={()=>close("codeRun")} lang="Python" status="running" output="" T={T}/>
      <StageUnlockedModal open={m.stage} onClose={()=>close("stage")} stageName="Stage 3 — React & Components" track="web" T={T}/>
      <SessionExpiredModal open={m.expired} onLogin={()=>close("expired")} T={T}/>
      <ProfileSavedModal open={m.profile} onClose={()=>close("profile")} T={T}/>
      <RoadmapProgressModal open={m.progress} onClose={()=>close("progress")} track="web" stage="Stage 4" completedStages={3} totalStages={6} T={T}/>

      <div style={{maxWidth:960,margin:"0 auto",padding:"100px 24px 80px"}}>
        {/* Header */}
        <div style={{marginBottom:52}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:7,padding:"4px 14px",borderRadius:100,background:"rgba(124,110,224,0.12)",border:"1px solid rgba(124,110,224,0.3)",marginBottom:18}}>
            <Bell size={11} color="#7c6ee0"/>
            <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,fontWeight:700,color:"#7c6ee0",letterSpacing:"2px",textTransform:"uppercase"}}>CJ Notification System</span>
          </div>
          <h1 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:"clamp(28px,5vw,44px)",color:"#e8eaf2",letterSpacing:"-1px",marginBottom:12,lineHeight:1.08}}>Modals & Notifications</h1>
          <p style={{fontFamily:"'Lora',serif",fontStyle:"italic",fontSize:16,color:"#8892b0",lineHeight:1.8,maxWidth:520}}>The complete notification system for Code Journey. Click any button to preview the component live. Import what you need from this file.</p>
        </div>

        {/* ── TOAST NOTIFICATIONS ── */}
        <Section title="Toast Notifications">
          <DemoButton label="✓ Success"  color="#22c55e" onClick={()=>pushToast("success","Note saved successfully.","")} T={T}/>
          <DemoButton label="✕ Error"    color="#f87171" onClick={()=>pushToast("error","Failed to save. Please try again.","Error",null,{label:"Retry",fn:()=>{}})} T={T}/>
          <DemoButton label="⚠ Warning"  color="#fbbf24" onClick={()=>pushToast("warn","You have unsaved changes.","")} T={T}/>
          <DemoButton label="ℹ Info"     color="#60a5fa" onClick={()=>pushToast("info","Your progress synced across devices.")} T={T}/>
          <DemoButton label="⟳ Loading"  color="#a78bfa" onClick={()=>pushToast("loading","Running your code…","Code execution")} T={T}/>
          <DemoButton label="★ XP Earned" color="#fbbf24" onClick={()=>pushToast("custom","You earned 35 XP for completing Stage 2!","",Star)} T={T}/>
          <DemoButton label="🎉 Stage unlocked" color="#7c6ee0" onClick={()=>pushToast("custom","Stage 3 — React & Components is now available.","Stage unlocked",Rocket)} T={T}/>
          <DemoButton label="📝 Note saved" color="#5eead4" onClick={()=>pushToast("success","\"React hooks\" saved to your notes.","")} T={T}/>
          <DemoButton label="✓ Task done" color="#22c55e" onClick={()=>pushToast("success","Task marked as complete. +20 XP","")} T={T}/>
          <DemoButton label="⚠ Session expiry" color="#f97316" onClick={()=>pushToast("warn","Your session expires in 5 minutes.","Inactivity warning",null,{label:"Stay signed in",fn:()=>{}})} T={T}/>
          <DemoButton label="🌐 Offline" color="#fbbf24" onClick={()=>pushToast("warn","No internet. Changes saved locally.","")} T={T}/>
          <DemoButton label="🔄 Update ready" color="#7c6ee0" onClick={()=>pushToast("info","v3.1.0 is available — refresh to update.","Platform update",null,{label:"Refresh",fn:()=>location.reload()})} T={T}/>
        </Section>

        {/* ── BANNER ALERTS ── */}
        <Section title="Inline Banners">
          <div style={{width:"100%",display:"flex",flexDirection:"column",gap:10}}>
            <Banner variant="success" title="Changes saved" message="Your profile has been updated and synced across all your devices." onDismiss={()=>{}} T={T}/>
            <Banner variant="error"   title="Sync failed" message="We couldn't save your last note. Check your connection and try again." onDismiss={()=>{}} action={{label:"Retry now",fn:()=>{}}} T={T}/>
            <Banner variant="warn"    title="Deprecation notice" message="The Badges system has been temporarily removed. A new gamification system is coming soon." onDismiss={()=>{}} T={T}/>
            <Banner variant="info"    message="Tip: you can run code in 9 languages directly in the CJ IDE — no installation needed." onDismiss={()=>{}} T={T}/>
          </div>
        </Section>

        {/* ── NOTE MODALS ── */}
        <Section title="Notes">
          <DemoButton label="📝 Create note"       color="#7c6ee0" onClick={()=>open("createNote")} T={T}/>
          <DemoButton label="✓ Note saved"         color="#22c55e" onClick={()=>open("noteSaved")} T={T}/>
          <DemoButton label="🗑 Delete note"        color="#f87171" onClick={()=>open("delNote")} T={T}/>
        </Section>

        {/* ── TASK MODALS ── */}
        <Section title="Tasks">
          <DemoButton label="+ Add task"           color="#7c6ee0" onClick={()=>open("addTask")} T={T}/>
          <DemoButton label="✓ Task completed"     color="#22c55e" onClick={()=>open("taskDone")} T={T}/>
          <DemoButton label="🗑 Delete task"        color="#f87171" onClick={()=>open("delTask")} T={T}/>
        </Section>

        {/* ── CODE EXECUTION ── */}
        <Section title="Code Execution">
          <DemoButton label="▶ Running…"           color="#a78bfa" onClick={()=>open("codeRun")} T={T}/>
          <DemoButton label="✓ Execution success"  color="#22c55e" onClick={()=>open("codeSuccess")} T={T}/>
          <DemoButton label="✕ Runtime error"      color="#f87171" onClick={()=>open("codeError")} T={T}/>
        </Section>

        {/* ── PLATFORM / JOURNEY ── */}
        <Section title="Learning Journey">
          <DemoButton label="🚀 Stage unlocked"    color="#7c6ee0" onClick={()=>open("stage")} T={T}/>
          <DemoButton label="📊 View progress"     color="#5eead4" onClick={()=>open("progress")} T={T}/>
          <DemoButton label="✨ Platform update"   color="#7c6ee0" onClick={()=>open("update")} T={T}/>
        </Section>

        {/* ── AUTH / SYSTEM ── */}
        <Section title="Auth & System">
          <DemoButton label="👤 Profile saved"     color="#22c55e" onClick={()=>open("profile")} T={T}/>
          <DemoButton label="🔒 Session expired"   color="#f87171" onClick={()=>open("expired")} T={T}/>
        </Section>

      </div>
    </>
  );
}