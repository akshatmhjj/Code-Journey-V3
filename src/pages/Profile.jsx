import React, { useEffect, useState, useCallback } from "react";
// import { useAuth } from "../context/AuthContext";
// import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
// import api from "../lib/api";
import {
  User, Mail, LogOut, FileText, LayoutDashboard,
  StickyNote, Settings, Trash2, Loader2, ClipboardList,
  Menu, X, Home, Plus, Pencil, Check, ChevronRight,
  Palette, Moon, Sun, Sunset, Activity, TrendingUp,
  Calendar, Star, Zap, ArrowRight, Circle, CheckCircle2,
} from "lucide-react";
// import { useAlert } from "../context/AlertContext";
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, Fade,
} from "@mui/material";
// import { getNotes, createNote, updateNote, deleteNote } from "../lib/api";

/* ─── Mock hooks & API ─────────────────────────────────────── */
const useAlert = () => ({ showAlert: (m, t) => console.log(`[${t}] ${m}`) });
const getNotes = async () => ({ notes: [
  { _id:"1", title:"Project Setup",   content:"Started working on the profile UI design with modern themes and responsive layout." },
  { _id:"2", title:"Theme System",    content:"Implemented 5 beautiful themes: Cosmos, Void, Aurora, Nord, and Light. Each with unique color palettes." },
  { _id:"3", title:"Components",      content:"Created reusable components like Avatar, StatCard, NoteCard, and SectionHeading." },
]});
const createNote = async (d) => console.log("createNote", d);
const updateNote = async (id, d) => console.log("updateNote", id, d);
const deleteNote = async (id) => console.log("deleteNote", id);
const api = { get: async () => ({ data: { user: { _id:"1", name:"John Doe", email:"john@example.com", username:"johndoe" }}}), delete: async () => {} };

/* ─── Fonts ────────────────────────────────────────────────── */
const FontLink = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600&family=Syne:wght@400;500;600;700;800&family=Lora:ital,wght@0,400;0,500;1,400&display=swap');
    *{box-sizing:border-box;}
    @keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}
    @keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
    @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
    @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}
  `}</style>
);

/* ─── Themes ───────────────────────────────────────────────── */
const THEMES = {
  cosmos: { key:"cosmos", label:"Dark", icon:Moon, description:"Deep space dark — the default CJ experience",
    shell:"#07080d", deep:"#0c0e18", mid:"#111420", surface:"#161927", panel:"#1a1e2e", hover:"#1e2335", active:"#252b42",
    card:"#161927", cardHov:"#1c2235",
    t1:"#e8eaf2", t2:"#8892b0", t3:"#5a6488", t4:"#2e3660",
    b1:"rgba(120,130,180,0.08)", b2:"rgba(120,130,180,0.15)", b3:"rgba(120,130,180,0.24)",
    accent:"#7c6ee0", accentS:"rgba(124,110,224,0.15)", teal:"#5eead4", green:"#22c55e", red:"#f87171", gold:"#fbbf24",
    sidebarBorder:"rgba(120,130,180,0.1)" },
  // void: { key:"void", label:"Pure Void", icon:Moon, description:"Pitch black minimal — maximum contrast",
  //   shell:"#000000", deep:"#050507", mid:"#0a0a0f", surface:"#0f0f15", panel:"#141419", hover:"#1a1a22", active:"#202030",
  //   card:"#0f0f15", cardHov:"#161622",
  //   t1:"#f0f0ff", t2:"#9090b8", t3:"#505070", t4:"#252540",
  //   b1:"rgba(100,100,200,0.08)", b2:"rgba(100,100,200,0.14)", b3:"rgba(100,100,200,0.22)",
  //   accent:"#8b7ff0", accentS:"rgba(139,127,240,0.15)", teal:"#2dd4bf", green:"#34d399", red:"#fc8181", gold:"#fcd34d",
  //   sidebarBorder:"rgba(100,100,200,0.1)" },
  // aurora: { key:"aurora", label:"Aurora", icon:Sunset, description:"Deep teal night — northern lights inspired",
  //   shell:"#040e0e", deep:"#071414", mid:"#0b1c1c", surface:"#102424", panel:"#142a2a", hover:"#1a3333", active:"#1f3d3d",
  //   card:"#102424", cardHov:"#162e2e",
  //   t1:"#e0f5f5", t2:"#7ab8b8", t3:"#3d7878", t4:"#1e4444",
  //   b1:"rgba(80,200,180,0.08)", b2:"rgba(80,200,180,0.15)", b3:"rgba(80,200,180,0.24)",
  //   accent:"#2dd4bf", accentS:"rgba(45,212,191,0.15)", teal:"#5eead4", green:"#4ade80", red:"#f87171", gold:"#fbbf24",
  //   sidebarBorder:"rgba(80,200,180,0.12)" },
  // nord: { key:"nord", label:"Nord", icon:Moon, description:"Arctic steel blue — calm and focused",
  //   shell:"#1a1f2e", deep:"#1e2535", mid:"#232c40", surface:"#28334a", panel:"#2d3a50", hover:"#344260", active:"#3a4a6e",
  //   card:"#28334a", cardHov:"#2e3d55",
  //   t1:"#eceff4", t2:"#9ba8c0", t3:"#5c6a88", t4:"#3a4560",
  //   b1:"rgba(136,192,208,0.1)", b2:"rgba(136,192,208,0.18)", b3:"rgba(136,192,208,0.28)",
  //   accent:"#88c0d0", accentS:"rgba(136,192,208,0.15)", teal:"#8fbcbb", green:"#a3be8c", red:"#bf616a", gold:"#ebcb8b",
  //   sidebarBorder:"rgba(136,192,208,0.14)" },
  light: { key:"light", label:"Light", icon:Sun, description:"Clean white — for bright environments",
    shell:"#f3f4f8", deep:"#ffffff", mid:"#f0f1f7", surface:"#ffffff", panel:"#f7f8fc", hover:"#eef0f8", active:"#e5e8f5",
    card:"#ffffff", cardHov:"#f5f6fc",
    t1:"#111827", t2:"#4b5680", t3:"#7c87a8", t4:"#c5ccdf",
    b1:"rgba(80,90,150,0.08)", b2:"rgba(80,90,150,0.15)", b3:"rgba(80,90,150,0.24)",
    accent:"#6256d0", accentS:"rgba(98,86,208,0.1)", teal:"#0d9488", green:"#16a34a", red:"#dc2626", gold:"#d97706",
    sidebarBorder:"rgba(80,90,150,0.1)" },
};

const getStoredTheme = () => { try { return localStorage.getItem("cj-theme")||"light"; } catch { return "light"; } };
const setStoredTheme = (k) => { try { localStorage.setItem("cj-theme",k); } catch {} };

/* ─── Shared atoms ─────────────────────────────────────────── */
const Av = ({ name, size=44, T }) => (
  <div style={{ width:size, height:size, borderRadius:"50%", flexShrink:0,
    background:`linear-gradient(135deg,${T.accent},${T.teal})`,
    display:"flex", alignItems:"center", justifyContent:"center",
    fontSize:size*0.38, fontWeight:700, color:"#fff",
    fontFamily:"'Syne',sans-serif", boxShadow:`0 0 0 2px ${T.accentS}` }}>
    {name?.charAt(0).toUpperCase()||"U"}
  </div>
);

const NavItem = ({ id, label, icon:Icon, activeSection, setActiveSection, navigate, setSidebarOpen, T }) => {
  const active = activeSection===id;
  return (
    <button onClick={()=>{ if(id==="home") navigate("/"); else setActiveSection(id); setSidebarOpen(false); }}
      style={{ width:"100%", display:"flex", alignItems:"center", gap:10, padding:"9px 12px", borderRadius:9,
        border:"none", cursor:"pointer", background:active?T.accentS:"transparent", color:active?T.accent:T.t2,
        fontFamily:"'Syne',sans-serif", fontWeight:active?600:500, fontSize:13.5, transition:"all 0.14s",
        textAlign:"left", borderLeft:active?`2px solid ${T.accent}`:"2px solid transparent" }}
      onMouseEnter={e=>{ if(!active){e.currentTarget.style.background=T.hover;e.currentTarget.style.color=T.t1;} }}
      onMouseLeave={e=>{ if(!active){e.currentTarget.style.background="transparent";e.currentTarget.style.color=T.t2;} }}>
      <Icon size={16}/>{label}
      {active&&<ChevronRight size={13} style={{marginLeft:"auto",opacity:0.5}}/>}
    </button>
  );
};

/* ─── Note components (unchanged per request) ─────────────── */
const NoteCard = ({ note, onEdit, onDelete, T }) => {
  const [hov,setHov]=useState(false);
  const cols=["#7c6ee0","#22c55e","#f97316","#ec4899","#3b82f6","#f59e0b"];
  const color=cols[note.title.charCodeAt(0)%cols.length];
  return (
    <motion.div layout initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} exit={{opacity:0,scale:0.95}}
      onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{ background:T.card, borderRadius:14, padding:"20px",
        border:hov?`1px solid ${color}44`:`1px solid ${T.b1}`,
        transition:"all 0.18s", transform:hov?"translateY(-3px)":"translateY(0)",
        boxShadow:hov?`0 8px 28px ${color}18`:"none",
        display:"flex", flexDirection:"column", gap:10, position:"relative", overflow:"hidden" }}>
      <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:color,
        borderRadius:"14px 14px 0 0",opacity:hov?1:0.5,transition:"opacity 0.18s"}}/>
      <h3 style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:15,color:T.t1,margin:0,paddingTop:4}}>{note.title}</h3>
      <p style={{fontFamily:"'Lora',serif",fontSize:13.5,color:T.t2,lineHeight:1.65,margin:0,
        display:"-webkit-box",WebkitLineClamp:3,WebkitBoxOrient:"vertical",overflow:"hidden"}}>{note.content}</p>
      <div style={{display:"flex",gap:8,marginTop:4}}>
        <button onClick={()=>onEdit(note)}
          style={{flex:1,padding:"6px 0",borderRadius:8,border:`1px solid ${T.b2}`,background:T.hover,
            color:T.t2,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"'Syne',sans-serif",
            display:"flex",alignItems:"center",justifyContent:"center",gap:5,transition:"all 0.14s"}}
          onMouseEnter={e=>{e.currentTarget.style.background=color+"22";e.currentTarget.style.color=color;e.currentTarget.style.borderColor=color+"44";}}
          onMouseLeave={e=>{e.currentTarget.style.background=T.hover;e.currentTarget.style.color=T.t2;e.currentTarget.style.borderColor=T.b2;}}>
          <Pencil size={12}/>Edit
        </button>
        <button onClick={()=>onDelete(note)}
          style={{flex:1,padding:"6px 0",borderRadius:8,border:`1px solid ${T.b2}`,background:T.hover,
            color:T.t2,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"'Syne',sans-serif",
            display:"flex",alignItems:"center",justifyContent:"center",gap:5,transition:"all 0.14s"}}
          onMouseEnter={e=>{e.currentTarget.style.background=`${T.red}18`;e.currentTarget.style.color=T.red;e.currentTarget.style.borderColor=`${T.red}44`;}}
          onMouseLeave={e=>{e.currentTarget.style.background=T.hover;e.currentTarget.style.color=T.t2;e.currentTarget.style.borderColor=T.b2;}}>
          <Trash2 size={12}/>Delete
        </button>
      </div>
    </motion.div>
  );
};

const NoteModal = ({ editingNote, title, setTitle, content, setContent, onClose, onSubmit, isLoading, T }) => (
  <AnimatePresence>
    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
      style={{position:"fixed",inset:0,zIndex:999,display:"flex",alignItems:"center",justifyContent:"center",
        background:"rgba(0,0,0,0.6)",backdropFilter:"blur(8px)",padding:"0 16px"}}>
      <motion.div initial={{scale:0.93,opacity:0,y:16}} animate={{scale:1,opacity:1,y:0}} exit={{scale:0.93,opacity:0}}
        transition={{duration:0.22,ease:"easeOut"}}
        style={{background:T.surface,border:`1px solid ${T.b2}`,borderRadius:18,padding:28,
          width:"100%",maxWidth:460,maxHeight:"90vh",overflowY:"auto",position:"relative"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:22}}>
          <h3 style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:17,color:T.t1,margin:0}}>
            {editingNote?"✏️ Edit Note":"📝 New Note"}
          </h3>
          <button onClick={onClose} style={{width:30,height:30,borderRadius:"50%",background:T.hover,border:`1px solid ${T.b1}`,
            display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:T.t2}}>
            <X size={14}/>
          </button>
        </div>
        <form onSubmit={onSubmit} style={{display:"flex",flexDirection:"column",gap:14}}>
          <input type="text" placeholder="Note title…" value={title} onChange={e=>setTitle(e.target.value)} required
            style={{width:"100%",background:T.mid,border:`1px solid ${T.b2}`,borderRadius:10,padding:"11px 14px",
              fontFamily:"'Syne',sans-serif",fontSize:14,color:T.t1,outline:"none",transition:"border 0.14s"}}
            onFocus={e=>e.target.style.borderColor=T.accent} onBlur={e=>e.target.style.borderColor=T.b2}/>
          <textarea placeholder="Write your note here…" value={content} onChange={e=>setContent(e.target.value)} required rows={5}
            style={{width:"100%",background:T.mid,border:`1px solid ${T.b2}`,borderRadius:10,padding:"11px 14px",
              fontFamily:"'Lora',serif",fontSize:14,color:T.t1,outline:"none",resize:"vertical",lineHeight:1.7,transition:"border 0.14s"}}
            onFocus={e=>e.target.style.borderColor=T.accent} onBlur={e=>e.target.style.borderColor=T.b2}/>
          <button type="submit" disabled={isLoading}
            style={{padding:"11px 0",borderRadius:10,border:"none",background:isLoading?T.hover:T.accent,
              color:isLoading?T.t3:"#fff",fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:14,
              cursor:isLoading?"not-allowed":"pointer",transition:"all 0.16s",letterSpacing:"0.3px"}}>
            {isLoading?(editingNote?"Updating…":"Saving…"):editingNote?"Update Note":"Save Note"}
          </button>
        </form>
      </motion.div>
    </motion.div>
  </AnimatePresence>
);

/* ══════════════════════════════════════════════════════════════
   MAIN
══════════════════════════════════════════════════════════════ */
export default function Profile() {
  const mockUser = { _id:"mock-123", name:"John Doe", email:"john@example.com", username:"johndoe" };
  const [profile,setProfile]=useState(mockUser);
  const [loading,setLoading]=useState(true);
  const [actionLoading,setActionLoading]=useState(false);
  const [confirmOpen,setConfirmOpen]=useState(false);
  const [activeSection,setActiveSection]=useState("dashboard");
  const [sidebarOpen,setSidebarOpen]=useState(false);
  const {showAlert}=useAlert();
  const navigate=()=>console.log("navigate");

  const [themeKey,setThemeKey]=useState(getStoredTheme);
  const T=THEMES[themeKey]||THEMES.cosmos;

  const [notes,setNotes]=useState([]);
  const [title,setTitle]=useState("");
  const [content,setContent]=useState("");
  const [editingNote,setEditingNote]=useState(null);
  const [showModal,setShowModal]=useState(false);
  const [isLoading,setIsLoading]=useState(false);
  const [loadingNotes,setLoadingNotes]=useState(true);
  const [noteToDelete,setNoteToDelete]=useState(null);
  const [confirmNoteOpen,setConfirmNoteOpen]=useState(false);

  const applyTheme=useCallback((key)=>{
    setThemeKey(key); setStoredTheme(key);
    const th=THEMES[key];
    if(th&&document.documentElement){
      [["--cj-shell",th.shell],["--cj-deep",th.deep],["--cj-surface",th.surface],
       ["--cj-accent",th.accent],["--cj-teal",th.teal],["--cj-t1",th.t1],["--cj-t2",th.t2],["--cj-t3",th.t3]]
       .forEach(([k,v])=>document.documentElement.style.setProperty(k,v));
    }
    showAlert(`Theme → "${THEMES[key]?.label}"`, "success");
  },[showAlert]);

  useEffect(()=>{ applyTheme(themeKey); },[]);// eslint-disable-line

  const fetchNotes=async()=>{ setLoadingNotes(true); try{ const r=await getNotes(); setNotes(r.notes||[]); }catch(e){console.error(e);} finally{setLoadingNotes(false);} };
  useEffect(()=>{ fetchNotes(); },[]);
  useEffect(()=>{ setLoading(false); },[]);
  useEffect(()=>{
    const h=document.querySelector("header"); const f=document.querySelector("footer");
    if(h)h.style.display="none"; if(f)f.style.display="none";
    return()=>{ if(h)h.style.display=""; if(f)f.style.display=""; };
  },[]);

  const handleEdit=(note)=>{ setEditingNote(note); setTitle(note.title); setContent(note.content); setShowModal(true); };
  const handleDelete=(note)=>{ setNoteToDelete(note); setConfirmNoteOpen(true); };
  const confirmDeleteNote=async()=>{
    if(!noteToDelete)return;
    try{ await deleteNote(noteToDelete._id); showAlert("Note deleted.","success"); await fetchNotes(); }
    catch{ showAlert("Failed.","error"); } finally{ setConfirmNoteOpen(false); setNoteToDelete(null); }
  };
  const handleNoteSubmit=async(e)=>{
    e.preventDefault(); setIsLoading(true);
    try{
      if(editingNote){ await updateNote(editingNote._id,{title,content}); showAlert("Updated.","success"); }
      else{ await createNote({title,content}); showAlert("Saved.","success"); }
      setTitle(""); setContent(""); setShowModal(false); setEditingNote(null); await fetchNotes();
    }catch{ showAlert("Failed.","error"); } finally{ setIsLoading(false); }
  };
  const closeModal=()=>{ setShowModal(false); setEditingNote(null); setTitle(""); setContent(""); };
  const handleLogout=()=>showAlert("Logout disabled in dev mode","info");
  const handleDeleteConfirm=()=>{ setConfirmOpen(false); showAlert("Deletion disabled in dev mode","info"); };

  if(loading||actionLoading) return (
    <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:T.shell,gap:14}}>
      <FontLink/><Loader2 style={{color:T.accent,animation:"spin 1s linear infinite"}} size={36}/>
      <p style={{fontFamily:"'Syne',sans-serif",color:T.t3,fontSize:14}}>{loading?"Loading your profile…":"Processing…"}</p>
    </div>
  );
  if(!profile) return <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:T.shell}}><FontLink/><p style={{fontFamily:"'Syne',sans-serif",color:T.t2}}>No profile found.</p></div>;

  /* ──────────────────────────────────────────────────────────
     DASHBOARD — editorial layout with banner + metric strip + feed
  ────────────────────────────────────────────────────────── */
  const renderDashboard=()=>{
    const metrics=[
      { label:"Notes", value:loadingNotes?"…":String(notes.length), unit:"total", color:T.accent, icon:StickyNote },
      { label:"Tasks",  value:"8",   unit:"done",   color:T.teal,   icon:CheckCircle2 },
      { label:"Streak", value:"7",   unit:"days",   color:T.gold,   icon:Zap },
      { label:"XP",     value:"340", unit:"points",  color:T.green,  icon:Star },
    ];
    const activity=[
      { icon:StickyNote,  label:"Created 3 new notes",                   time:"2h ago",  color:T.accent },
      { icon:CheckCircle2,label:"Completed task: Implement notes CRUD",  time:"5h ago",  color:T.green },
      { icon:Activity,    label:"7-day coding streak maintained",         time:"Today",   color:T.gold },
      { icon:Settings,    label:"Switched to Dark Cosmos theme",          time:"Yesterday",color:T.teal },
      { icon:User,        label:"Profile information updated",            time:"2d ago",  color:T.t3 },
    ];
    return (
      <div style={{padding:"0 0 60px", animation:"fadeUp 0.35s ease both"}}>

        {/* ── Hero banner ── */}
        <div style={{position:"relative",overflow:"hidden",
          background:`linear-gradient(135deg, ${T.accent}22 0%, ${T.teal}14 50%, transparent 100%)`,
          borderBottom:`1px solid ${T.b1}`, padding:"40px 32px 32px"}}>

          {/* Decorative grid lines */}
          <div style={{position:"absolute",inset:0,pointerEvents:"none",opacity:0.04,
            backgroundImage:`linear-gradient(${T.t1} 1px, transparent 1px), linear-gradient(90deg, ${T.t1} 1px, transparent 1px)`,
            backgroundSize:"32px 32px"}}/>

          {/* Large initial watermark */}
          <div style={{position:"absolute",right:32,top:"50%",transform:"translateY(-50%)",
            fontSize:140,fontWeight:800,fontFamily:"'Syne',sans-serif",
            color:T.accent,opacity:0.04,lineHeight:1,userSelect:"none",pointerEvents:"none"}}>
            {profile.name?.charAt(0).toUpperCase()||"U"}
          </div>

          <div style={{display:"flex",alignItems:"flex-end",gap:24,flexWrap:"wrap",position:"relative"}}>
            {/* Avatar - large */}
            <div style={{width:80,height:80,borderRadius:20,flexShrink:0,
              background:`linear-gradient(135deg,${T.accent},${T.teal})`,
              display:"flex",alignItems:"center",justifyContent:"center",
              fontSize:34,fontWeight:800,color:"#fff",fontFamily:"'Syne',sans-serif",
              boxShadow:`0 0 0 3px ${T.accentS}, 0 12px 32px ${T.accent}30`}}>
              {profile.name?.charAt(0).toUpperCase()||"U"}
            </div>

            <div style={{flex:1,minWidth:0}}>
              {/* Status pill */}
              <div style={{display:"inline-flex",alignItems:"center",gap:5,
                padding:"2px 10px",borderRadius:100,marginBottom:8,
                background:`${T.green}14`,border:`1px solid ${T.green}40`}}>
                <div style={{width:6,height:6,borderRadius:"50%",background:T.green,
                  animation:"pulse 2s ease infinite"}}/>
                <span style={{fontSize:10,fontWeight:700,color:T.green,fontFamily:"'JetBrains Mono',monospace",
                  letterSpacing:"1px",textTransform:"uppercase"}}>Active</span>
              </div>

              <h1 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:28,
                color:T.t1,margin:"0 0 4px",lineHeight:1.1,letterSpacing:"-0.5px"}}>
                {profile.name}
              </h1>
              <div style={{display:"flex",alignItems:"center",gap:14,flexWrap:"wrap"}}>
                <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:12,color:T.t3}}>
                  @{profile.username}
                </span>
                <div style={{width:1,height:12,background:T.b2}}/>
                <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:12,color:T.t3,
                  display:"flex",alignItems:"center",gap:4}}>
                  <Mail size={11}/>{profile.email}
                </span>
              </div>
            </div>

            {/* Member since tag */}
            <div style={{background:T.panel,border:`1px solid ${T.b2}`,borderRadius:10,
              padding:"10px 14px",textAlign:"center",flexShrink:0}}>
              <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:T.t3,
                textTransform:"uppercase",letterSpacing:"1px",margin:"0 0 3px"}}>Member since</p>
              <p style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:14,color:T.t1,margin:0}}>Jan 2024</p>
            </div>
          </div>
        </div>

        {/* ── Metric strip ── */}
        <div style={{padding:"24px 32px 0",
          display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:12}}>
          {metrics.map((m,i)=>(
            <motion.div key={m.label}
              initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:i*0.07}}
              style={{background:T.card,border:`1px solid ${T.b1}`,borderRadius:14,
                padding:"16px 18px",position:"relative",overflow:"hidden",cursor:"default",
                transition:"all 0.18s"}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=m.color+"55";e.currentTarget.style.transform="translateY(-2px)";}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor=T.b1;e.currentTarget.style.transform="translateY(0)";}}>
              {/* Background icon watermark */}
              <div style={{position:"absolute",right:-4,bottom:-4,opacity:0.05}}>
                <m.icon size={60} color={m.color}/>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:10}}>
                <div style={{width:24,height:24,borderRadius:6,background:`${m.color}18`,
                  display:"flex",alignItems:"center",justifyContent:"center",
                  border:`1px solid ${m.color}30`}}>
                  <m.icon size={12} color={m.color}/>
                </div>
                <span style={{fontFamily:"'Syne',sans-serif",fontSize:11,fontWeight:600,
                  color:T.t3,letterSpacing:"0.5px",textTransform:"uppercase"}}>{m.label}</span>
              </div>
              <div style={{display:"flex",alignItems:"baseline",gap:5}}>
                <span style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:30,
                  color:m.color,lineHeight:1}}>{m.value}</span>
                <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:T.t3}}>{m.unit}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── Two column: activity + quick actions ── */}
        <div style={{padding:"24px 32px 0",display:"grid",
          gridTemplateColumns:"1fr auto",gap:20,alignItems:"start"}}>

          {/* Activity feed */}
          <div style={{background:T.card,border:`1px solid ${T.b1}`,borderRadius:16,overflow:"hidden"}}>
            {/* Feed header */}
            <div style={{padding:"16px 20px",borderBottom:`1px solid ${T.b1}`,
              display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <Activity size={15} color={T.accent}/>
                <span style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:13,color:T.t1}}>Activity Feed</span>
              </div>
              <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:T.t3}}>RECENT</span>
            </div>

            {/* Feed items */}
            {activity.map((item,i)=>(
              <motion.div key={i}
                initial={{opacity:0,x:-8}} animate={{opacity:1,x:0}} transition={{delay:i*0.06+0.2}}
                style={{display:"flex",alignItems:"center",gap:14,padding:"14px 20px",
                  borderBottom:i<activity.length-1?`1px solid ${T.b1}`:"none",
                  transition:"background 0.14s",cursor:"default"}}
                onMouseEnter={e=>e.currentTarget.style.background=T.hover}
                onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                {/* Icon bubble */}
                <div style={{width:32,height:32,borderRadius:9,background:`${item.color}14`,
                  border:`1px solid ${item.color}28`,flexShrink:0,
                  display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <item.icon size={14} color={item.color}/>
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <p style={{fontFamily:"'Syne',sans-serif",fontSize:13,color:T.t1,
                    margin:0,fontWeight:500,lineHeight:1.3,
                    overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{item.label}</p>
                </div>
                <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10.5,
                  color:T.t3,flexShrink:0}}>{item.time}</span>
              </motion.div>
            ))}
          </div>

          {/* Quick nav cards */}
          <div className="dashboard-quick-cards" style={{display:"flex",flexDirection:"column",gap:10,width:180}}>
            {[
              {label:"My Notes",  icon:StickyNote,  color:T.gold,   section:"notes",   count:notes.length},
              {label:"My Tasks",  icon:ClipboardList,color:T.teal,  section:"tasks",   count:"8/10"},
              {label:"Settings",  icon:Settings,    color:T.accent, section:"settings",count:null},
            ].map((item,i)=>(
              <motion.button key={item.label}
                initial={{opacity:0,x:12}} animate={{opacity:1,x:0}} transition={{delay:i*0.08+0.15}}
                onClick={()=>setActiveSection(item.section)}
                style={{background:T.card,border:`1px solid ${T.b1}`,borderRadius:14,
                  padding:"16px",cursor:"pointer",textAlign:"left",transition:"all 0.16s",
                  display:"flex",flexDirection:"column",gap:10,outline:"none"}}
                onMouseEnter={e=>{ e.currentTarget.style.borderColor=`${item.color}55`; e.currentTarget.style.transform="translateY(-2px)"; }}
                onMouseLeave={e=>{ e.currentTarget.style.borderColor=T.b1; e.currentTarget.style.transform="translateY(0)"; }}>
                <div style={{width:36,height:36,borderRadius:10,background:`${item.color}16`,
                  border:`1px solid ${item.color}30`,
                  display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <item.icon size={16} color={item.color}/>
                </div>
                <div>
                  <p style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:13,
                    color:T.t1,margin:"0 0 2px"}}>{item.label}</p>
                  {item.count!==null&&(
                    <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:T.t3,margin:0}}>
                      {item.count} {typeof item.count==="number"?"entries":"completed"}
                    </p>
                  )}
                </div>
                <ArrowRight size={13} color={T.t3} style={{alignSelf:"flex-end"}}/>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  /* ──────────────────────────────────────────────────────────
     NOTES (unchanged per request)
  ────────────────────────────────────────────────────────── */
  const renderNotes=()=>(
    <div style={{padding:"32px 28px"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:28,flexWrap:"wrap",gap:12}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:3,height:24,borderRadius:2,background:T.gold}}/>
          <StickyNote size={20} color={T.gold}/>
          <h2 style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:22,color:T.t1,margin:0,letterSpacing:"-0.3px"}}>My Notes</h2>
        </div>
        <button onClick={()=>setShowModal(true)}
          style={{display:"flex",alignItems:"center",gap:7,padding:"9px 18px",borderRadius:10,
            border:"none",background:T.gold,color:"#000",fontFamily:"'Syne',sans-serif",
            fontWeight:700,fontSize:13,cursor:"pointer",transition:"all 0.16s",letterSpacing:"0.2px"}}
          onMouseEnter={e=>e.currentTarget.style.opacity="0.88"}
          onMouseLeave={e=>e.currentTarget.style.opacity="1"}>
          <Plus size={15}/>New Note
        </button>
      </div>
      {showModal&&<NoteModal editingNote={editingNote} title={title} setTitle={setTitle} content={content} setContent={setContent} onClose={closeModal} onSubmit={handleNoteSubmit} isLoading={isLoading} T={T}/>}
      {loadingNotes?(
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"60px 0",gap:12}}>
          <div style={{width:32,height:32,border:`3px solid ${T.gold}`,borderTopColor:"transparent",borderRadius:"50%",animation:"spin 0.8s linear infinite"}}/>
          <p style={{fontFamily:"'Syne',sans-serif",color:T.t3,fontSize:13}}>Loading notes…</p>
        </div>
      ):notes.length===0?(
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"60px 0",gap:10}}>
          <StickyNote size={40} color={T.t4}/><p style={{fontFamily:"'Syne',sans-serif",color:T.t3,fontSize:14,fontWeight:600}}>No notes yet</p>
          <p style={{fontFamily:"'Lora',serif",color:T.t3,fontSize:13,fontStyle:"italic"}}>Create your first note to get started.</p>
        </div>
      ):(
        <motion.div layout style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:16}}>
          <AnimatePresence>{notes.map(n=><NoteCard key={n._id} note={n} onEdit={handleEdit} onDelete={handleDelete} T={T}/>)}</AnimatePresence>
        </motion.div>
      )}
    </div>
  );

  /* ──────────────────────────────────────────────────────────
     TASKS — redesigned: two-column kanban-style with visual progress
  ────────────────────────────────────────────────────────── */
  const renderTasks=()=>{
    const taskList=[
      { id:1, text:"Build a cool dashboard UI",   done:true,  priority:"high",   tag:"Design"   },
      { id:2, text:"Implement notes CRUD",         done:true,  priority:"high",   tag:"Feature"  },
      { id:3, text:"Sync with backend API",        done:false, priority:"medium", tag:"Backend"  },
      { id:4, text:"Add mobile responsiveness",    done:false, priority:"medium", tag:"UI"       },
      { id:5, text:"Write unit tests",             done:false, priority:"low",    tag:"QA"       },
    ];
    const done=taskList.filter(t=>t.done);
    const todo=taskList.filter(t=>!t.done);
    const progress=Math.round((done.length/taskList.length)*100);

    const priorityColor={ high:T.red, medium:T.gold, low:T.teal };
    const tagColor=["#7c6ee0","#22c55e","#f97316","#ec4899","#3b82f6","#f59e0b"];
    const getTagColor=(tag)=>tagColor[tag.charCodeAt(0)%tagColor.length];

    const TaskRow=({task})=>{
      const [hov,setHov]=useState(false);
      const pc=priorityColor[task.priority];
      const tc=getTagColor(task.tag);
      return(
        <motion.div layout initial={{opacity:0,x:-6}} animate={{opacity:1,x:0}}
          onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
          style={{display:"flex",alignItems:"center",gap:12,padding:"12px 14px",borderRadius:12,
            background:hov?T.hover:T.mid,border:hov?`1px solid ${T.b2}`:`1px solid ${T.b1}`,
            transition:"all 0.16s",cursor:"default"}}>
          {/* Done circle */}
          <div style={{width:22,height:22,borderRadius:"50%",flexShrink:0,
            border:`2px solid ${task.done?T.green:T.b2}`,
            background:task.done?`${T.green}22`:"transparent",
            display:"flex",alignItems:"center",justifyContent:"center"}}>
            {task.done&&<Check size={11} color={T.green}/>}
          </div>
          {/* Text */}
          <span style={{flex:1,fontFamily:"'Syne',sans-serif",fontSize:13.5,
            color:task.done?T.t3:T.t1,
            textDecoration:task.done?"line-through":"none",lineHeight:1.3}}>{task.text}</span>
          {/* Tag pill */}
          <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9.5,fontWeight:700,
            padding:"2px 7px",borderRadius:4,background:`${tc}18`,color:tc,
            border:`1px solid ${tc}33`,flexShrink:0,letterSpacing:"0.3px"}}>{task.tag}</span>
          {/* Priority dot */}
          <div style={{width:7,height:7,borderRadius:"50%",background:pc,flexShrink:0}}/>
        </motion.div>
      );
    };

    return(
      <div style={{padding:"32px 28px",animation:"fadeUp 0.35s ease both"}}>
        {/* Header */}
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:28}}>
          <div style={{width:3,height:24,borderRadius:2,background:T.teal}}/>
          <ClipboardList size={20} color={T.teal}/>
          <h2 style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:22,color:T.t1,margin:0,letterSpacing:"-0.3px"}}>My Tasks</h2>
        </div>

        {/* Progress overview card */}
        <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}}
          style={{background:T.card,border:`1px solid ${T.b1}`,borderRadius:16,
            padding:"22px 24px",marginBottom:24,
            display:"flex",alignItems:"center",gap:24,flexWrap:"wrap",overflow:"hidden",position:"relative"}}>
          {/* Background decoration */}
          <div style={{position:"absolute",right:-20,top:-20,width:120,height:120,borderRadius:"50%",
            background:`${T.teal}08`,border:`1px solid ${T.teal}18`}}/>
          <div style={{position:"absolute",right:20,top:20,width:70,height:70,borderRadius:"50%",
            background:`${T.teal}06`,border:`1px solid ${T.teal}14`}}/>

          {/* Circular progress */}
          <div style={{position:"relative",width:80,height:80,flexShrink:0}}>
            <svg width="80" height="80" viewBox="0 0 80 80" style={{transform:"rotate(-90deg)"}}>
              <circle cx="40" cy="40" r="32" fill="none" stroke={T.b2} strokeWidth="6"/>
              <circle cx="40" cy="40" r="32" fill="none" stroke={T.teal} strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={`${2*Math.PI*32}`}
                strokeDashoffset={`${2*Math.PI*32*(1-progress/100)}`}
                style={{transition:"stroke-dashoffset 0.6s ease"}}/>
            </svg>
            <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
              <span style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:17,color:T.teal}}>{progress}%</span>
            </div>
          </div>

          <div style={{flex:1,minWidth:0}}>
            <p style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:17,color:T.t1,margin:"0 0 4px"}}>
              {done.length} of {taskList.length} tasks done
            </p>
            {/* <p style={{fontFamily:"'Lora',serif",fontSize:13.5,color:T.t2,margin:"0 0 14px",fontStyle:"italic"}}>
              {todo.length} remaining — keep going!
            </p> */}
            {/* Progress bar */}
            <div style={{height:5,borderRadius:3,background:T.b1,overflow:"hidden"}}>
              <div style={{height:"100%",width:`${progress}%`,borderRadius:3,
                background:`linear-gradient(90deg,${T.accent},${T.teal})`,transition:"width 0.6s ease"}}/>
            </div>
          </div>

          {/* Quick stats */}
          <div style={{display:"flex",gap:12,flexShrink:0}}>
            {[{label:"Done",value:done.length,color:T.green},{label:"Todo",value:todo.length,color:T.gold}].map(s=>(
              <div key={s.label} style={{textAlign:"center",background:T.mid,borderRadius:10,
                padding:"10px 14px",border:`1px solid ${T.b1}`}}>
                <p style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:22,
                  color:s.color,margin:0,lineHeight:1}}>{s.value}</p>
                <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,
                  color:T.t3,margin:"3px 0 0",textTransform:"uppercase",letterSpacing:"0.5px"}}>{s.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Task columns */}
        <div className="tasks-columns" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
          {/* To Do */}
          <div>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12,
              padding:"8px 14px",background:T.card,borderRadius:10,border:`1px solid ${T.b1}`}}>
              <Circle size={13} color={T.gold}/>
              <span style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:12,color:T.t2,
                letterSpacing:"0.8px",textTransform:"uppercase",flex:1}}>To Do</span>
              <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10.5,color:T.gold,
                background:`${T.gold}16`,padding:"1px 7px",borderRadius:4,fontWeight:700}}>{todo.length}</span>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {todo.map(t=><TaskRow key={t.id} task={t}/>)}
            </div>
            {/* Coming soon input */}
            <div style={{marginTop:10,padding:"11px 14px",borderRadius:12,
              border:`1px dashed ${T.b2}`,display:"flex",alignItems:"center",gap:8,
              background:"transparent",cursor:"default"}}>
              <Plus size={14} color={T.t4}/>
              <span style={{fontFamily:"'Syne',sans-serif",fontSize:12.5,color:T.t4,fontStyle:"italic"}}>Add task — coming soon</span>
            </div>
          </div>

          {/* Completed */}
          <div>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12,
              padding:"8px 14px",background:T.card,borderRadius:10,border:`1px solid ${T.b1}`}}>
              <CheckCircle2 size={13} color={T.green}/>
              <span style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:12,color:T.t2,
                letterSpacing:"0.8px",textTransform:"uppercase",flex:1}}>Completed</span>
              <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10.5,color:T.green,
                background:`${T.green}16`,padding:"1px 7px",borderRadius:4,fontWeight:700}}>{done.length}</span>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {done.map(t=><TaskRow key={t.id} task={t}/>)}
            </div>
          </div>
        </div>

        {/* Priority legend */}
        <div style={{marginTop:20,display:"flex",alignItems:"center",gap:16,padding:"10px 14px",
          background:T.card,borderRadius:10,border:`1px solid ${T.b1}`,flexWrap:"wrap"}}>
          <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:T.t3,
            textTransform:"uppercase",letterSpacing:"1px"}}>Priority:</span>
          {Object.entries(priorityColor).map(([k,v])=>(
            <div key={k} style={{display:"flex",alignItems:"center",gap:5}}>
              <div style={{width:7,height:7,borderRadius:"50%",background:v}}/>
              <span style={{fontFamily:"'Syne',sans-serif",fontSize:11.5,color:T.t3,textTransform:"capitalize"}}>{k}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  /* ──────────────────────────────────────────────────────────
     SETTINGS — theme switcher only
  ────────────────────────────────────────────────────────── */
  const renderSettings=()=>(
    <div style={{padding:"32px 28px",animation:"fadeUp 0.35s ease both"}}>
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:28}}>
        <div style={{width:3,height:24,borderRadius:2,background:T.accent}}/>
        <Palette size={20} color={T.accent}/>
        <h2 style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:22,color:T.t1,margin:0,letterSpacing:"-0.3px"}}>Platform Theme</h2>
      </div>

      <p style={{fontFamily:"'Lora',serif",fontSize:15,color:T.t2,lineHeight:1.75,
        maxWidth:520,marginBottom:28,fontStyle:"italic"}}>
        Change the colour scheme of your entire Code Journey workspace. Your choice persists across sessions.
      </p>

      <div className="theme-grid" style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:14,maxWidth:800}}>
        {Object.values(THEMES).map((th,i)=>{
          const active=themeKey===th.key;
          const Icon=th.icon;
          return(
            <motion.button key={th.key}
              initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:i*0.07}}
              onClick={()=>applyTheme(th.key)}
              style={{background:th.deep,border:active?`2px solid ${th.accent}`:`1px solid ${th.b2}`,
                borderRadius:14,padding:"18px 16px",cursor:"pointer",textAlign:"left",
                transition:"all 0.2s",outline:"none",position:"relative",
                boxShadow:active?`0 0 24px ${th.accent}28`:"none",
                transform:active?"scale(1.02)":"scale(1)"}}>

              {/* Active badge */}
              {active&&(
                <div style={{position:"absolute",top:12,right:12,width:20,height:20,borderRadius:"50%",
                  background:th.accent,display:"flex",alignItems:"center",justifyContent:"center",
                  boxShadow:`0 0 10px ${th.accent}60`}}>
                  <Check size={11} color="#fff"/>
                </div>
              )}

              {/* Colour swatches */}
              <div style={{display:"flex",gap:5,marginBottom:14}}>
                {[th.shell,th.accent,th.teal,th.green].map((c,j)=>(
                  <div key={j} style={{width:16,height:16,borderRadius:"50%",background:c,
                    border:"1.5px solid rgba(255,255,255,0.12)"}}/>
                ))}
              </div>

              {/* Preview mini-bar */}
              <div style={{height:3,borderRadius:2,marginBottom:14,overflow:"hidden",
                background:`linear-gradient(90deg,${th.accent},${th.teal})`}}/>

              <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:5}}>
                <Icon size={13} color={th.accent}/>
                <span style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:13.5,color:th.t1}}>{th.label}</span>
              </div>
              <p style={{fontFamily:"'Lora',serif",fontSize:11.5,color:th.t3,margin:0,lineHeight:1.4,fontStyle:"italic"}}>{th.description}</p>
            </motion.button>
          );
        })}
      </div>
    </div>
  );

  const renderContent=()=>{
    switch(activeSection){
      case "dashboard": return renderDashboard();
      case "notes":     return renderNotes();
      case "tasks":     return renderTasks();
      case "settings":  return renderSettings();
      default:          return null;
    }
  };

  /* ──────────────────────────────────────────────────────────
     SHELL
  ────────────────────────────────────────────────────────── */
  return(
    <>
      <FontLink/>
      <style>{`
        input::placeholder, textarea::placeholder { color: ${T.t4}; }
        ::-webkit-scrollbar{width:4px;} ::-webkit-scrollbar-thumb{background:${T.active};border-radius:3px;} ::-webkit-scrollbar-track{background:transparent;}
      `}</style>

      <div style={{minHeight:"100vh",display:"flex",background:T.shell,fontFamily:"'Syne',sans-serif",color:T.t1,overflow:"hidden"}}>

        {/* ── Sidebar ── */}
        <aside className="cj-sidebar" style={{
          position:"fixed",top:0,left:0,height:"100vh",minHeight:"100vh",width:230,
          background:T.deep,borderRight:`1px solid ${T.sidebarBorder}`,
          display:"flex",flexDirection:"column",zIndex:40,
          transform:sidebarOpen?"translateX(0)":"translateX(-100%)",
          transition:"transform 0.26s cubic-bezier(0.4,0,0.2,1)"}}>

          {/* Sidebar top */}
          <div style={{padding:"20px 18px 16px",borderBottom:`1px solid ${T.sidebarBorder}`,
            display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <Av name={profile.name} size={36} T={T}/>
              <div>
                <p style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:13.5,color:T.t1,margin:"0 0 1px",lineHeight:1}}>{profile.name}</p>
                <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10.5,color:T.t3,margin:0}}>@{profile.username}</p>
              </div>
            </div>
            <button onClick={()=>setSidebarOpen(false)} className="cj-sidebar-close"
              style={{background:"none",border:"none",cursor:"pointer",color:T.t3,padding:2,display:"flex"}}>
              <X size={16}/>
            </button>
          </div>

          <nav style={{padding:"14px 12px",flex:1,display:"flex",flexDirection:"column"}}>
            {[
              // {id:"home",      label:"Home",      icon:Home},
              {id:"dashboard", label:"Dashboard", icon:LayoutDashboard},
              {id:"notes",     label:"Notes",     icon:StickyNote},
              {id:"tasks",     label:"Tasks",     icon:ClipboardList},
              {id:"settings",  label:"Theme",     icon:Palette},
            ].map(item=>(
              <NavItem key={item.id} {...item} activeSection={activeSection} setActiveSection={setActiveSection} navigate={navigate} setSidebarOpen={setSidebarOpen} T={T}/>
            ))}
          </nav>

          <div className="sidebar-footer" style={{padding:"14px 12px",borderTop:`1px solid ${T.sidebarBorder}`}}>
            <button onClick={handleLogout}
              style={{width:"100%",display:"flex",alignItems:"center",gap:9,padding:"9px 12px",
                borderRadius:9,border:"none",background:"transparent",color:T.red,
                fontFamily:"'Syne',sans-serif",fontWeight:600,fontSize:13,cursor:"pointer",
                marginBottom:4,transition:"background 0.14s"}}
              onMouseEnter={e=>e.currentTarget.style.background=`${T.red}14`}
              onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
              <LogOut size={15}/>Log Out
            </button>
            {/* <button onClick={()=>setConfirmOpen(true)}
              style={{width:"100%",display:"flex",alignItems:"center",gap:9,padding:"9px 12px",
                borderRadius:9,border:"none",background:"transparent",color:T.t3,
                fontFamily:"'Syne',sans-serif",fontWeight:600,fontSize:13,cursor:"pointer",transition:"background 0.14s"}}
              onMouseEnter={e=>e.currentTarget.style.background=T.hover}
              onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
              <Trash2 size={15}/>Delete Account
            </button> */}
          </div>
        </aside>

        {sidebarOpen&&<div onClick={()=>setSidebarOpen(false)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.55)",zIndex:35,backdropFilter:"blur(4px)"}}/>}

        {/* ── Main ── */}
        <main className="cj-main" style={{flex:1,minHeight:"100vh",display:"flex",flexDirection:"column"}}>

          {/* Topbar */}
          <div style={{background:T.deep,borderBottom:`1px solid ${T.sidebarBorder}`,
            padding:"0 20px",display:"flex",alignItems:"center",height:52,gap:14,flexShrink:0}}>
            <button className="sidebar-toggle-button" onClick={()=>setSidebarOpen(true)}
              style={{background:T.hover,border:`1px solid ${T.b1}`,borderRadius:8,
                width:34,height:34,display:"flex",alignItems:"center",justifyContent:"center",
                cursor:"pointer",color:T.t2,flexShrink:0}}>
              <Menu size={17}/>
            </button>

            <div style={{display:"flex",alignItems:"center",gap:6,fontSize:12.5,
              fontFamily:"'JetBrains Mono',monospace",color:T.t3}}>
              <span>profile</span><span style={{opacity:0.4}}>›</span>
              <span style={{color:T.accent}}>{activeSection==="settings"?"theme":activeSection}</span>
            </div>

            <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:10}}>
              {/* <div onClick={()=>setActiveSection("settings")}
                style={{display:"flex",alignItems:"center",gap:6,padding:"4px 10px",
                  borderRadius:7,background:T.panel,border:`1px solid ${T.b1}`,cursor:"pointer"}}>
                <div style={{width:8,height:8,borderRadius:"50%",background:T.accent,
                  animation:"pulse 3s ease infinite"}}/>
                <span style={{fontFamily:"'Syne',sans-serif",fontSize:11.5,color:T.t3,fontWeight:600}}>
                  {THEMES[themeKey]?.label}
                </span>
              </div> */}
              <span style={{fontFamily:"'Syne',sans-serif",fontSize:13,color:T.t2,fontWeight:500}}>
                Hello, {profile.name?.split(" ")[0]||"there"}
              </span>
              <Av name={profile.name} size={30} T={T}/>
            </div>
          </div>

          {/* Content */}
          <div style={{flex:1,overflowY:"auto",background:T.mid}}>
            <AnimatePresence mode="wait">
              <motion.div key={activeSection}
                initial={{opacity:0,y:10}} animate={{opacity:1,y:0}}
                exit={{opacity:0,y:-6}} transition={{duration:0.18}}
                style={{minHeight:"100%"}}>
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>

        {/* Responsive sidebar */}
        <style>{`
          .cj-sidebar{min-height:100vh!important;height:100vh!important;display:flex!important;flex-direction:column!important;}
          .sidebar-footer{margin-top:auto!important;}

          @media(min-width:768px){
            .cj-sidebar{position:sticky!important;transform:translateX(0)!important;flex-shrink:0;height:100vh;top:0;align-self:flex-start;}
            .cj-sidebar-close{display:none!important;}
            .cj-main{margin-left:0!important;}
          }
          @media(max-width:767px){
            .cj-sidebar{position:fixed!important;}
            .dashboard-quick-cards{display:none!important;} /* remove quick nav redirects on mobile */
            .tasks-columns{grid-template-columns:1fr!important;} /* task columns stack on mobile */
            .theme-grid{grid-template-columns:1fr!important;} /* theme cards one column on mobile */
            .sidebar-toggle-button{display:flex!important;}
          }
          @media(min-width:768px){
            .sidebar-toggle-button{display:none!important;}
          }
        `}</style>

        {/* Note delete dialog */}
        {/* <Dialog open={confirmNoteOpen} TransitionComponent={Fade} keepMounted onClose={()=>setConfirmNoteOpen(false)}
          PaperProps={{style:{background:T.surface,border:`1px solid ${T.b2}`,borderRadius:14,color:T.t1}}}>
          <DialogTitle style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:16,color:T.t1}}>Delete Note</DialogTitle>
          <DialogContent style={{fontFamily:"'Lora',serif",fontSize:14,color:T.t2,lineHeight:1.6}}>
            Delete <strong style={{color:T.t1}}>"{noteToDelete?.title}"</strong>? This cannot be undone.
          </DialogContent>
          <DialogActions style={{padding:"12px 20px 16px"}}>
            <Button onClick={()=>setConfirmNoteOpen(false)} style={{fontFamily:"'Syne',sans-serif",color:T.t2}}>Cancel</Button>
            <Button onClick={confirmDeleteNote} style={{fontFamily:"'Syne',sans-serif",color:T.red,fontWeight:700}}>Delete</Button>
          </DialogActions>
        </Dialog> */}

        {/* Account delete dialog */}
        {/* <Dialog open={confirmOpen} TransitionComponent={Fade} keepMounted onClose={()=>setConfirmOpen(false)}
          PaperProps={{style:{background:T.surface,border:`1px solid ${T.b2}`,borderRadius:14,color:T.t1}}}>
          <DialogTitle style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:16,color:T.t1}}>Delete Account</DialogTitle>
          <DialogContent style={{fontFamily:"'Lora',serif",fontSize:14,color:T.t2,lineHeight:1.6}}>
            This will <strong style={{color:T.red}}>permanently delete</strong> your account and all data. This cannot be undone.
          </DialogContent>
          <DialogActions style={{padding:"12px 20px 16px"}}>
            <Button onClick={()=>setConfirmOpen(false)} style={{fontFamily:"'Syne',sans-serif",color:T.t2}}>Cancel</Button>
            <Button onClick={handleDeleteConfirm} style={{fontFamily:"'Syne',sans-serif",color:T.red,fontWeight:700}}>Delete Forever</Button>
          </DialogActions>
        </Dialog> */}
      </div>
    </>
  );
}