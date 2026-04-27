import React, { useEffect, useState, useCallback } from "react";
// import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
// import api from "../lib/api";
import {
  User, Mail, LogOut, FileText, LayoutDashboard,
  StickyNote, Settings, Trash2, Loader2, ClipboardList,
  Menu, X, Home, Plus, Pencil, Check, ChevronRight,
  Palette, Moon, Sun, Sunset, Activity, TrendingUp,
  Calendar, Star, Zap, ArrowRight, Circle, CheckCircle2,
  AlertTriangle, Flag,
} from "lucide-react";
import { supabase } from "../lib/supabase";
import CJLoader from "../components/Cjloader";

/* ─── Mock alert (replace with real useAlert when wired) ───── */
const useAlert = () => ({ showAlert: (m, t) => console.log(`[${t}] ${m}`) });

/* ══════════════════════════════════════════════════════════════
   FONTS + GLOBAL KEYFRAMES
══════════════════════════════════════════════════════════════ */
const FontLink = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600&family=Syne:wght@400;500;600;700;800&family=Lora:ital,wght@0,400;0,500;1,400&display=swap');
    *{box-sizing:border-box;}
    @keyframes spin    { from{transform:rotate(0)} to{transform:rotate(360deg)} }
    @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
    @keyframes fadeUp  { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
    @keyframes pulse   { 0%,100%{opacity:1} 50%{opacity:0.5} }
  `}</style>
);

/* ══════════════════════════════════════════════════════════════
   THEME DEFINITIONS  (all 5 - cosmos default, light enabled,
   others commented out in Settings to keep UI clean)
══════════════════════════════════════════════════════════════ */
const THEMES = {
  cosmos: {
    key: "cosmos", label: "Dark Cosmos", icon: Moon,
    description: "Deep space dark - the default CJ experience",
    shell: "#07080d", deep: "#0c0e18", mid: "#111420", surface: "#161927",
    panel: "#1a1e2e", hover: "#1e2335", active: "#252b42",
    card: "#161927", cardHov: "#1c2235",
    t1: "#e8eaf2", t2: "#8892b0", t3: "#5a6488", t4: "#2e3660",
    b1: "rgba(120,130,180,0.08)", b2: "rgba(120,130,180,0.15)", b3: "rgba(120,130,180,0.24)",
    accent: "#7c6ee0", accentS: "rgba(124,110,224,0.15)",
    teal: "#5eead4", green: "#22c55e", red: "#f87171", gold: "#fbbf24",
    sidebarBorder: "rgba(120,130,180,0.1)",
  },
  // void: {
  //   key:"void", label:"Pure Void", icon:Moon,
  //   description:"Pitch black minimal - maximum contrast",
  //   shell:"#000000", deep:"#050507", mid:"#0a0a0f", surface:"#0f0f15",
  //   panel:"#141419", hover:"#1a1a22", active:"#202030",
  //   card:"#0f0f15", cardHov:"#161622",
  //   t1:"#f0f0ff", t2:"#9090b8", t3:"#505070", t4:"#252540",
  //   b1:"rgba(100,100,200,0.08)", b2:"rgba(100,100,200,0.14)", b3:"rgba(100,100,200,0.22)",
  //   accent:"#8b7ff0", accentS:"rgba(139,127,240,0.15)",
  //   teal:"#2dd4bf", green:"#34d399", red:"#fc8181", gold:"#fcd34d",
  //   sidebarBorder:"rgba(100,100,200,0.1)",
  // },
  // aurora: {
  //   key:"aurora", label:"Aurora", icon:Sunset,
  //   description:"Deep teal night - northern lights inspired",
  //   shell:"#040e0e", deep:"#071414", mid:"#0b1c1c", surface:"#102424",
  //   panel:"#142a2a", hover:"#1a3333", active:"#1f3d3d",
  //   card:"#102424", cardHov:"#162e2e",
  //   t1:"#e0f5f5", t2:"#7ab8b8", t3:"#3d7878", t4:"#1e4444",
  //   b1:"rgba(80,200,180,0.08)", b2:"rgba(80,200,180,0.15)", b3:"rgba(80,200,180,0.24)",
  //   accent:"#2dd4bf", accentS:"rgba(45,212,191,0.15)",
  //   teal:"#5eead4", green:"#4ade80", red:"#f87171", gold:"#fbbf24",
  //   sidebarBorder:"rgba(80,200,180,0.12)",
  // },
  // nord: {
  //   key:"nord", label:"Nord", icon:Moon,
  //   description:"Arctic steel blue - calm and focused",
  //   shell:"#1a1f2e", deep:"#1e2535", mid:"#232c40", surface:"#28334a",
  //   panel:"#2d3a50", hover:"#344260", active:"#3a4a6e",
  //   card:"#28334a", cardHov:"#2e3d55",
  //   t1:"#eceff4", t2:"#9ba8c0", t3:"#5c6a88", t4:"#3a4560",
  //   b1:"rgba(136,192,208,0.1)", b2:"rgba(136,192,208,0.18)", b3:"rgba(136,192,208,0.28)",
  //   accent:"#88c0d0", accentS:"rgba(136,192,208,0.15)",
  //   teal:"#8fbcbb", green:"#a3be8c", red:"#bf616a", gold:"#ebcb8b",
  //   sidebarBorder:"rgba(136,192,208,0.14)",
  // },
  light: {
    key: "light", label: "Light", icon: Sun,
    description: "Clean white - for bright environments",
    shell: "#f3f4f8", deep: "#ffffff", mid: "#f0f1f7", surface: "#ffffff",
    panel: "#f7f8fc", hover: "#eef0f8", active: "#e5e8f5",
    card: "#ffffff", cardHov: "#f5f6fc",
    t1: "#111827", t2: "#4b5680", t3: "#7c87a8", t4: "#c5ccdf",
    b1: "rgba(80,90,150,0.08)", b2: "rgba(80,90,150,0.15)", b3: "rgba(80,90,150,0.24)",
    accent: "#6256d0", accentS: "rgba(98,86,208,0.1)",
    teal: "#0d9488", green: "#16a34a", red: "#dc2626", gold: "#d97706",
    sidebarBorder: "rgba(80,90,150,0.1)",
  },
};

const getStoredTheme = () => { try { return localStorage.getItem("cj-theme") || "light"; } catch { return "light"; } };
const setStoredTheme = (k) => { try { localStorage.setItem("cj-theme", k); } catch { } };

/* ══════════════════════════════════════════════════════════════
   SHARED ATOMS
══════════════════════════════════════════════════════════════ */
const Av = ({ name, size = 44, T }) => (
  <div style={{
    width: size, height: size, borderRadius: "50%", flexShrink: 0,
    background: `linear-gradient(135deg,${T.accent},${T.teal})`,
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: size * 0.38, fontWeight: 700, color: "#fff",
    fontFamily: "'Syne',sans-serif", boxShadow: `0 0 0 2px ${T.accentS}`,
  }}>
    {name?.charAt(0).toUpperCase() || "U"}
  </div>
);

function NavItem({ id, label, icon: Icon, activeSection, setActiveSection, navigate, setSidebarOpen, T }) {
  const active = activeSection === id;
  return (
    <button
      onClick={() => { if (id === "home") navigate("/"); else setActiveSection(id); setSidebarOpen(false); }}
      style={{
        width: "100%", display: "flex", alignItems: "center", gap: 10,
        padding: "9px 12px", borderRadius: 9, border: "none", cursor: "pointer",
        background: active ? T.accentS : "transparent",
        color: active ? T.accent : T.t2,
        fontFamily: "'Syne',sans-serif", fontWeight: active ? 600 : 500, fontSize: 13.5,
        transition: "all 0.14s", textAlign: "left",
        borderLeft: active ? `2px solid ${T.accent}` : "2px solid transparent",
      }}
      onMouseEnter={e => { if (!active) { e.currentTarget.style.background = T.hover; e.currentTarget.style.color = T.t1; } }}
      onMouseLeave={e => { if (!active) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = T.t2; } }}>
      <Icon size={15} />{label}
      {active && <ChevronRight size={12} style={{ marginLeft: "auto", opacity: 0.4 }} />}
    </button>
  );
}

/* ══════════════════════════════════════════════════════════════
   CJ MODAL SHELL  - used by all dialogs
══════════════════════════════════════════════════════════════ */
function CJModal({ open, onClose, children, maxWidth = 460, T }) {
  useEffect(() => {
    if (!open) return;
    const fn = e => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", fn);
    return () => document.removeEventListener("keydown", fn);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          style={{
            position: "fixed", inset: 0, zIndex: 999,
            display: "flex", alignItems: "center", justifyContent: "center",
            background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)",
            padding: "0 16px",
          }}>
          <div onClick={onClose} style={{ position: "absolute", inset: 0 }} />
          <motion.div
            initial={{ scale: 0.94, opacity: 0, y: 14 }} animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.94, opacity: 0, y: 8 }} transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            style={{
              background: T.surface, border: `1px solid ${T.b2}`,
              borderRadius: 18, padding: 28,
              width: "100%", maxWidth, maxHeight: "90vh",
              overflowY: "auto", position: "relative",
              boxShadow: "0 24px 64px rgba(0,0,0,0.5)",
            }}>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ── Modal header row helper ── */
function ModalHead({ title, onClose, T }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22 }}>
      <h3 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 17, color: T.t1, margin: 0 }}>{title}</h3>
      <button onClick={onClose} style={{
        width: 30, height: 30, borderRadius: "50%", background: T.hover, border: `1px solid ${T.b1}`,
        display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: T.t2,
      }}><X size={14} /></button>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   NOTE MODAL  (create / edit)
══════════════════════════════════════════════════════════════ */
function NoteModal({ editingNote, title, setTitle, content, setContent, onClose, onSubmit, isLoading, T }) {
  return (
    <CJModal open onClose={onClose} maxWidth={460} T={T}>
      <ModalHead title={editingNote ? "✏️ Edit Note" : "📝 New Note"} onClose={onClose} T={T} />
      <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <input type="text" placeholder="Note title…" value={title} onChange={e => setTitle(e.target.value)} required
          style={{
            width: "100%", background: T.mid, border: `1.5px solid ${T.b2}`,
            borderRadius: 10, padding: "11px 14px",
            fontFamily: "'Syne',sans-serif", fontSize: 14, color: T.t1, outline: "none", transition: "border 0.14s",
          }}
          onFocus={e => e.target.style.borderColor = T.accent}
          onBlur={e => e.target.style.borderColor = T.b2} />
        <textarea placeholder="Write your note here…" value={content} onChange={e => setContent(e.target.value)} required rows={5}
          style={{
            width: "100%", background: T.mid, border: `1.5px solid ${T.b2}`,
            borderRadius: 10, padding: "11px 14px",
            fontFamily: "'Lora',serif", fontSize: 14, color: T.t1,
            outline: "none", resize: "vertical", lineHeight: 1.7, transition: "border 0.14s",
          }}
          onFocus={e => e.target.style.borderColor = T.accent}
          onBlur={e => e.target.style.borderColor = T.b2} />
        <button type="submit" disabled={isLoading} style={{
          padding: "11px 0", borderRadius: 10, border: "none",
          background: isLoading ? T.hover : T.accent,
          color: isLoading ? T.t3 : "#fff",
          fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 14,
          cursor: isLoading ? "not-allowed" : "pointer", transition: "all 0.16s",
        }}>
          {isLoading ? (editingNote ? "Updating…" : "Saving…") : editingNote ? "Update Note" : "Save Note"}
        </button>
      </form>
    </CJModal>
  );
}

/* ══════════════════════════════════════════════════════════════
   CONFIRM DELETE MODAL  (shared for notes + tasks + account)
══════════════════════════════════════════════════════════════ */
function ConfirmModal({ open, onClose, onConfirm, title, message, confirmLabel = "Delete", confirmColor, T }) {
  if (!open) return null;
  const color = confirmColor || T.red;
  return (
    <CJModal open={open} onClose={onClose} maxWidth={420} T={T}>
      {/* Danger icon */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, textAlign: "center" }}>
        <div style={{
          width: 52, height: 52, borderRadius: "50%",
          background: `${color}14`, border: `1px solid ${color}35`,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <AlertTriangle size={22} color={color} />
        </div>
        <div>
          <h3 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 18, color: T.t1, margin: "0 0 8px" }}>{title}</h3>
          <p style={{ fontFamily: "'Lora',serif", fontStyle: "italic", fontSize: 14, color: T.t2, lineHeight: 1.7, margin: 0 }}>{message}</p>
        </div>
        <div style={{ display: "flex", gap: 10, width: "100%" }}>
          <button onClick={onClose} style={{
            flex: 1, padding: "10px", borderRadius: 10,
            border: `1px solid ${T.b2}`, background: "transparent",
            color: T.t2, fontFamily: "'Syne',sans-serif", fontWeight: 600,
            fontSize: 14, cursor: "pointer", transition: "all 0.14s",
          }}
            onMouseEnter={e => { e.currentTarget.style.background = T.hover; e.currentTarget.style.color = T.t1; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = T.t2; }}>
            Cancel
          </button>
          <button onClick={onConfirm} style={{
            flex: 1, padding: "10px", borderRadius: 10, border: "none",
            background: `${color}18`, color,
            fontFamily: "'Syne',sans-serif", fontWeight: 700,
            fontSize: 14, cursor: "pointer", transition: "all 0.15s",
            border: `1px solid ${color}44`,
          }}
            onMouseEnter={e => { e.currentTarget.style.background = `${color}28`; }}
            onMouseLeave={e => { e.currentTarget.style.background = `${color}18`; }}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </CJModal>
  );
}

/* ══════════════════════════════════════════════════════════════
   TASK MODAL  (create new task)
══════════════════════════════════════════════════════════════ */
function TaskModal({ open, onClose, onSubmit, taskTitle, setTaskTitle, taskDesc, setTaskDesc, taskPriority, setTaskPriority, T }) {
  const priorityOpts = [
    { value: "low", label: "Low", color: T.teal },
    { value: "medium", label: "Medium", color: T.gold },
    { value: "high", label: "High", color: T.red },
  ];
  return (
    <CJModal open={open} onClose={onClose} maxWidth={440} T={T}>
      <ModalHead title="📋 New Task" onClose={onClose} T={T} />
      <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <input placeholder="Task title…" value={taskTitle} onChange={e => setTaskTitle(e.target.value)} required
          style={{
            width: "100%", background: T.mid, border: `1.5px solid ${T.b2}`,
            borderRadius: 10, padding: "11px 14px",
            fontFamily: "'Syne',sans-serif", fontSize: 14, color: T.t1, outline: "none", transition: "border 0.14s",
          }}
          onFocus={e => e.target.style.borderColor = T.accent}
          onBlur={e => e.target.style.borderColor = T.b2} />
        <textarea placeholder="Description (optional)…" value={taskDesc} onChange={e => setTaskDesc(e.target.value)} rows={3}
          style={{
            width: "100%", background: T.mid, border: `1.5px solid ${T.b2}`,
            borderRadius: 10, padding: "11px 14px",
            fontFamily: "'Lora',serif", fontSize: 13.5, color: T.t1,
            outline: "none", resize: "vertical", lineHeight: 1.7, transition: "border 0.14s",
          }}
          onFocus={e => e.target.style.borderColor = T.accent}
          onBlur={e => e.target.style.borderColor = T.b2} />
        {/* Priority selector - pill style */}
        <div>
          <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, fontWeight: 700, letterSpacing: "1.2px", textTransform: "uppercase", color: T.t3, marginBottom: 8 }}>Priority</p>
          <div style={{ display: "flex", gap: 8 }}>
            {priorityOpts.map(opt => (
              <button key={opt.value} type="button" onClick={() => setTaskPriority(opt.value)}
                style={{
                  flex: 1, padding: "8px 0", borderRadius: 9,
                  border: `1.5px solid ${taskPriority === opt.value ? opt.color + "66" : T.b2}`,
                  background: taskPriority === opt.value ? `${opt.color}14` : "transparent",
                  color: taskPriority === opt.value ? opt.color : T.t3,
                  fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 12.5,
                  cursor: "pointer", transition: "all 0.14s",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
                }}>
                <Flag size={11} />{opt.label}
              </button>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button type="button" onClick={onClose} style={{
            flex: 1, padding: "11px", borderRadius: 10,
            border: `1px solid ${T.b2}`, background: "transparent",
            color: T.t2, fontFamily: "'Syne',sans-serif", fontWeight: 600, fontSize: 14, cursor: "pointer",
          }}>Cancel</button>
          <button type="submit" style={{
            flex: 2, padding: "11px", borderRadius: 10, border: "none",
            background: T.accent, color: "#fff",
            fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 14, cursor: "pointer",
          }}>Save Task</button>
        </div>
      </form>
    </CJModal>
  );
}

/* ══════════════════════════════════════════════════════════════
   NOTE CARD
══════════════════════════════════════════════════════════════ */
const NOTE_COLORS = ["#7c6ee0", "#22c55e", "#f97316", "#ec4899", "#3b82f6", "#f59e0b"];
const noteColor = title => NOTE_COLORS[title.charCodeAt(0) % NOTE_COLORS.length];

function NoteCard({ note, onEdit, onDelete, T }) {
  const [hov, setHov] = useState(false);
  const color = noteColor(note.title);
  return (
    <motion.div layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        background: T.card, borderRadius: 14, padding: "20px",
        border: hov ? `1px solid ${color}44` : `1px solid ${T.b1}`,
        transition: "all 0.18s",
        transform: hov ? "translateY(-3px)" : "translateY(0)",
        boxShadow: hov ? `0 8px 28px ${color}18` : "none",
        display: "flex", flexDirection: "column", gap: 10,
        position: "relative", overflow: "hidden",
      }}>
      {/* Top accent bar */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 3,
        background: color, borderRadius: "14px 14px 0 0",
        opacity: hov ? 1 : 0.5, transition: "opacity 0.18s",
      }} />
      <h3 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 15, color: T.t1, margin: 0, paddingTop: 4 }}>{note.title}</h3>
      <p style={{
        fontFamily: "'Lora',serif", fontSize: 13.5, color: T.t2, lineHeight: 1.65, margin: 0,
        display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden", whiteSpace: "pre-wrap",
      }}>{note.content}</p>
      <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
        {[{ label: "Edit", icon: Pencil, fn: () => onEdit(note), hoverColor: color },
        { label: "Delete", icon: Trash2, fn: () => onDelete(note), hoverColor: T.red }].map(btn => (
          <button key={btn.label} onClick={btn.fn} style={{
            flex: 1, padding: "6px 0", borderRadius: 8,
            border: `1px solid ${T.b2}`, background: T.hover,
            color: T.t2, fontSize: 12, fontWeight: 600, cursor: "pointer",
            fontFamily: "'Syne',sans-serif",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 5, transition: "all 0.14s",
          }}
            onMouseEnter={e => { e.currentTarget.style.background = `${btn.hoverColor}20`; e.currentTarget.style.color = btn.hoverColor; e.currentTarget.style.borderColor = `${btn.hoverColor}44`; }}
            onMouseLeave={e => { e.currentTarget.style.background = T.hover; e.currentTarget.style.color = T.t2; e.currentTarget.style.borderColor = T.b2; }}>
            <btn.icon size={12} />{btn.label}
          </button>
        ))}
      </div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════════
   MAIN PROFILE COMPONENT
══════════════════════════════════════════════════════════════ */
export default function Profile() {
  /* ── state ── */
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { showAlert } = useAlert();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  /* theme */
  const [themeKey, setThemeKey] = useState(getStoredTheme);
  const T = THEMES[themeKey] || THEMES.cosmos;

  /* notes */
  const [notes, setNotes] = useState([]);
  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [editingNote, setEditingNote] = useState(null);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [noteLoading, setNoteLoading] = useState(false);
  const [loadingNotes, setLoadingNotes] = useState(true);
  /* note delete confirm */
  const [noteToDelete, setNoteToDelete] = useState(null);
  const [confirmNoteOpen, setConfirmNoteOpen] = useState(false);

  /* tasks */
  const [tasks, setTasks] = useState([]);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDesc, setTaskDesc] = useState("");
  const [taskPriority, setTaskPriority] = useState("medium");
  /* task delete confirm */
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [confirmTaskOpen, setConfirmTaskOpen] = useState(false);

  /* activity */
  const [activity, setActivity] = useState([]);

  /* account delete */
  const [confirmAccountOpen, setConfirmAccountOpen] = useState(false);

  /* ── theme apply ── */
  const applyTheme = useCallback((key) => {
    setThemeKey(key); setStoredTheme(key);
    const th = THEMES[key];
    if (th) {
      [["--cj-shell", th.shell], ["--cj-deep", th.deep], ["--cj-surface", th.surface],
      ["--cj-accent", th.accent], ["--cj-teal", th.teal],
      ["--cj-t1", th.t1], ["--cj-t2", th.t2], ["--cj-t3", th.t3]]
        .forEach(([k, v]) => document.documentElement.style.setProperty(k, v));
    }
    showAlert(`Theme → "${THEMES[key]?.label}"`, "success");
  }, [showAlert]);

  /* ── auth + profile ── */
  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data: userData } = await supabase.auth.getUser();
      const cu = userData?.user;
      if (!cu) { setLoading(false); return; }
      setUser(cu);
      if (!sessionStorage.getItem("login_logged")) {
        logActivity("User logged in");
        sessionStorage.setItem("login_logged", "true");
      }
      const { data } = await supabase.from("profiles").select("*").eq("id", cu.id).single();
      if (data) setProfile({ name: data.full_name, email: data.email, username: data.email.split("@")[0] });
      setLoading(false);
    })();
  }, []);

  useEffect(() => { applyTheme(themeKey); }, []); // eslint-disable-line

  /* hide main header/footer while on profile */
  useEffect(() => {
    const h = document.querySelector("header"); const f = document.querySelector("footer");
    if (h) h.style.display = "none"; if (f) f.style.display = "none";
    return () => { if (h) h.style.display = ""; if (f) f.style.display = ""; };
  }, []);

  /* ── data fetchers ── */
  const fetchNotes = async () => {
    if (!user) return;
    setLoadingNotes(true);
    const { data, error } = await supabase.from("notes").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
    if (!error) setNotes(data || []);
    setLoadingNotes(false);
  };
  useEffect(() => { if (user) fetchNotes(); }, [user]);

  const fetchTasks = async () => {
    if (!user) return;
    const { data, error } = await supabase.from("tasks").select("*").eq("user_id", user.id);
    if (!error) setTasks(data || []);
  };
  useEffect(() => { if (user) fetchTasks(); }, [user]);

  const fetchActivity = async () => {
    if (!user) return;
    const { data, error } = await supabase.from("activity_logs").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(5);
    if (!error) setActivity(data || []);
  };
  useEffect(() => { if (user) fetchActivity(); }, [user]);

  const logActivity = async (action) => {
    if (!user) return;
    await supabase.from("activity_logs").insert([{ user_id: user.id, action }]);
    fetchActivity();
  };

  /* ── note handlers ── */
  const handleEdit = note => { setEditingNote(note); setNoteTitle(note.title); setNoteContent(note.content); setShowNoteModal(true); };
  const closeNoteModal = () => { setShowNoteModal(false); setEditingNote(null); setNoteTitle(""); setNoteContent(""); };

  const handleNoteSubmit = async e => {
    e.preventDefault(); setNoteLoading(true);
    try {
      if (editingNote) {
        const { error } = await supabase.from("notes").update({ title: noteTitle, content: noteContent }).eq("id", editingNote.id);
        if (error) throw error;
        showAlert("Updated.", "success"); logActivity("Updated a note");
      } else {
        const { error } = await supabase.from("notes").insert([{ user_id: user.id, title: noteTitle, content: noteContent }]);
        if (error) throw error;
        showAlert("Saved.", "success"); logActivity("Created a note");
      }
      closeNoteModal(); fetchNotes();
    } catch (err) { console.log(err.message); showAlert("Failed.", "error"); }
    setNoteLoading(false);
  };

  /* confirm delete note */
  const handleDeleteNote = note => { setNoteToDelete(note); setConfirmNoteOpen(true); };
  const confirmDeleteNote = async () => {
    if (!noteToDelete) return;
    const { error } = await supabase.from("notes").delete().eq("id", noteToDelete.id);
    if (!error) { fetchNotes(); logActivity("Deleted a note"); }
    setConfirmNoteOpen(false); setNoteToDelete(null);
  };

  /* ── task handlers ── */
  const handleTaskSubmit = async e => {
    e.preventDefault(); if (!taskTitle.trim()) return;
    const { error } = await supabase.from("tasks").insert([{ user_id: user.id, title: taskTitle, description: taskDesc, status: "pending", priority: taskPriority }]);
    if (!error) { fetchTasks(); logActivity(`Created task: ${taskTitle}`); }
    setTaskTitle(""); setTaskDesc(""); setTaskPriority("medium"); setShowTaskModal(false);
  };

  /* confirm delete task */
  const handleDeleteTask = task => { setTaskToDelete(task); setConfirmTaskOpen(true); };
  const confirmDeleteTask = async () => {
    if (!taskToDelete) return;
    const { error } = await supabase.from("tasks").delete().eq("id", taskToDelete.id);
    if (!error) { fetchTasks(); logActivity("Deleted a task"); }
    setConfirmTaskOpen(false); setTaskToDelete(null);
  };

  const toggleTaskStatus = async (task) => {
    const newStatus = task.status === "completed" ? "pending" : "completed";

    const { error } = await supabase
      .from("tasks")
      .update({ status: newStatus })
      .eq("id", task.id);

    if (error) {
      console.log(error);
      showAlert("Failed to update task", "error");
      return;
    }

    fetchTasks();
    logActivity(`Marked task "${task.title}" as ${newStatus}`);
  };

  /* ── logout ── */
  const handleLogout = async () => {
    await supabase.auth.signOut(); navigate("/");
  };

  /* ── helpers ── */
  const timeAgo = date => {
    const diff = Math.floor((new Date() - new Date(date)) / 1000);
    if (diff < 60) return "just now";
    const m = Math.floor(diff / 60); if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60); if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
  };

  /* ═══════════════════════════════════════════════════════
     LOADING / NO PROFILE
  ═══════════════════════════════════════════════════════ */
  if (loading || actionLoading) {
    return (
      <CJLoader
        message={loading ? "Loading your profile…" : "Processing…"}
        minTime={600}
      />
    );
  }
  if (!profile) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: T.shell }}>
      <FontLink /><p style={{ fontFamily: "'Syne',sans-serif", color: T.t2 }}>No profile found.</p>
    </div>
  );

  /* ═══════════════════════════════════════════════════════
     RENDER SECTIONS
  ═══════════════════════════════════════════════════════ */

  /* ── DASHBOARD ── */
  const renderDashboard = () => {
    const metrics = [
      { label: "Notes", value: notes.length, unit: "total", color: T.accent, icon: StickyNote },
      { label: "Tasks", value: tasks.filter(t => t.status === "completed").length, unit: "done", color: T.teal, icon: CheckCircle2 },
      { label: "Streak", value: "7", unit: "days", color: T.gold, icon: Zap },
      { label: "XP", value: "340", unit: "pts", color: T.green, icon: Star },
    ];
    const activityList = activity.length
      ? activity.map(a => ({ label: a.action, time: timeAgo(a.created_at), icon: Activity, color: T.accent }))
      : [{ label: "No activity yet", time: "", icon: Activity, color: T.t3 }];

    return (
      <div style={{ paddingBottom: 60, animation: "fadeUp 0.35s ease both" }}>
        {/* Hero banner */}
        <div style={{
          position: "relative", overflow: "hidden",
          background: `linear-gradient(135deg,${T.accent}22 0%,${T.teal}14 50%,transparent 100%)`,
          borderBottom: `1px solid ${T.b1}`, padding: "40px 32px 32px",
        }}>
          <div style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.04, backgroundImage: `linear-gradient(${T.t1} 1px,transparent 1px),linear-gradient(90deg,${T.t1} 1px,transparent 1px)`, backgroundSize: "32px 32px" }} />
          <div style={{ position: "absolute", right: 32, top: "50%", transform: "translateY(-50%)", fontSize: 140, fontWeight: 800, fontFamily: "'Syne',sans-serif", color: T.accent, opacity: 0.04, lineHeight: 1, userSelect: "none", pointerEvents: "none" }}>
            {profile.name?.charAt(0).toUpperCase() || "U"}
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 24, flexWrap: "wrap", position: "relative" }}>
            <div style={{ width: 80, height: 80, borderRadius: 20, flexShrink: 0, background: `linear-gradient(135deg,${T.accent},${T.teal})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 34, fontWeight: 800, color: "#fff", fontFamily: "'Syne',sans-serif", boxShadow: `0 0 0 3px ${T.accentS},0 12px 32px ${T.accent}30` }}>
              {profile.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "2px 10px", borderRadius: 100, marginBottom: 8, background: `${T.green}14`, border: `1px solid ${T.green}40` }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: T.green, animation: "pulse 2s ease infinite" }} />
                <span style={{ fontSize: 10, fontWeight: 700, color: T.green, fontFamily: "'JetBrains Mono',monospace", letterSpacing: "1px", textTransform: "uppercase" }}>Active</span>
              </div>
              <h1 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 28, color: T.t1, margin: "0 0 4px", lineHeight: 1.1, letterSpacing: "-0.5px" }}>{profile.name}</h1>
              <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: T.t3 }}>@{profile.username}</span>
                <div style={{ width: 1, height: 12, background: T.b2 }} />
                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: T.t3, display: "flex", alignItems: "center", gap: 4 }}><Mail size={11} />{profile.email}</span>
              </div>
            </div>
            <div style={{ background: T.panel, border: `1px solid ${T.b2}`, borderRadius: 10, padding: "10px 14px", textAlign: "center", flexShrink: 0 }}>
              <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: T.t3, textTransform: "uppercase", letterSpacing: "1px", margin: "0 0 3px" }}>Member since</p>
              <p style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 14, color: T.t1, margin: 0 }}>Jan 2024</p>
            </div>
          </div>
        </div>

        {/* Metric strip */}
        <div style={{ padding: "24px 32px 0", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 12 }}>
          {metrics.map((m, i) => (
            <motion.div key={m.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
              style={{ background: T.card, border: `1px solid ${T.b1}`, borderRadius: 14, padding: "16px 18px", position: "relative", overflow: "hidden", cursor: "default", transition: "all 0.18s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = m.color + "55"; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = T.b1; e.currentTarget.style.transform = "translateY(0)"; }}>
              <div style={{ position: "absolute", right: -4, bottom: -4, opacity: 0.05 }}><m.icon size={60} color={m.color} /></div>
              <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 10 }}>
                <div style={{ width: 24, height: 24, borderRadius: 6, background: `${m.color}18`, display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${m.color}30` }}>
                  <m.icon size={12} color={m.color} />
                </div>
                <span style={{ fontFamily: "'Syne',sans-serif", fontSize: 11, fontWeight: 600, color: T.t3, letterSpacing: "0.5px", textTransform: "uppercase" }}>{m.label}</span>
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 5 }}>
                <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 30, color: m.color, lineHeight: 1 }}>{m.value}</span>
                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: T.t3 }}>{m.unit}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Activity + Quick nav */}
        <div style={{ padding: "24px 32px 0", display: "grid", gridTemplateColumns: "1fr auto", gap: 20, alignItems: "start" }}>
          <div style={{ background: T.card, border: `1px solid ${T.b1}`, borderRadius: 16, overflow: "hidden" }}>
            <div style={{ padding: "14px 20px", borderBottom: `1px solid ${T.b1}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Activity size={14} color={T.accent} />
                <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 13, color: T.t1 }}>Activity Feed</span>
              </div>
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9.5, color: T.t3, letterSpacing: "1px" }}>RECENT</span>
            </div>
            {activityList.map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 + 0.2 }}
                style={{ display: "flex", alignItems: "center", gap: 14, padding: "13px 20px", borderBottom: i < activityList.length - 1 ? `1px solid ${T.b1}` : "none", transition: "background 0.14s", cursor: "default" }}
                onMouseEnter={e => e.currentTarget.style.background = T.hover}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <div style={{ width: 30, height: 30, borderRadius: 8, background: `${item.color}14`, border: `1px solid ${item.color}28`, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <item.icon size={13} color={item.color} />
                </div>
                <p style={{ flex: 1, fontFamily: "'Syne',sans-serif", fontSize: 13, color: T.t1, margin: 0, fontWeight: 500, lineHeight: 1.3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.label}</p>
                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10.5, color: T.t3, flexShrink: 0 }}>{item.time}</span>
              </motion.div>
            ))}
          </div>

          <div className="dashboard-quick-cards" style={{ display: "flex", flexDirection: "column", gap: 10, width: 180 }}>
            {[
              { label: "My Notes", icon: StickyNote, color: T.gold, section: "notes", count: notes.length, unit: "entries" },
              { label: "My Tasks", icon: ClipboardList, color: T.teal, section: "tasks", count: `${tasks.filter(t => t.status === "completed").length}/${tasks.length}`, unit: "done" },
              { label: "Theme", icon: Palette, color: T.accent, section: "settings", count: null },
            ].map((item, i) => (
              <motion.button key={item.label} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 + 0.15 }}
                onClick={() => setActiveSection(item.section)}
                style={{ background: T.card, border: `1px solid ${T.b1}`, borderRadius: 14, padding: "16px", cursor: "pointer", textAlign: "left", transition: "all 0.16s", display: "flex", flexDirection: "column", gap: 10, outline: "none" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = `${item.color}55`; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = T.b1; e.currentTarget.style.transform = "translateY(0)"; }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: `${item.color}16`, border: `1px solid ${item.color}30`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <item.icon size={16} color={item.color} />
                </div>
                <div>
                  <p style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 13, color: T.t1, margin: "0 0 2px" }}>{item.label}</p>
                  {item.count !== null && <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: T.t3, margin: 0 }}>{item.count} {item.unit}</p>}
                </div>
                <ArrowRight size={13} color={T.t3} style={{ alignSelf: "flex-end" }} />
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  /* ── NOTES ── */
  const renderNotes = () => (
    <div style={{ padding: "32px 28px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 3, height: 24, borderRadius: 2, background: T.gold }} />
          <StickyNote size={20} color={T.gold} />
          <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 22, color: T.t1, margin: 0, letterSpacing: "-0.3px" }}>My Notes</h2>
        </div>
        <button onClick={() => setShowNoteModal(true)} style={{
          display: "flex", alignItems: "center", gap: 7, padding: "9px 18px", borderRadius: 10,
          border: "none", background: T.gold, color: "#000",
          fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 13, cursor: "pointer", transition: "opacity 0.16s",
        }}
          onMouseEnter={e => e.currentTarget.style.opacity = "0.86"}
          onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
          <Plus size={15} />New Note
        </button>
      </div>

      {loadingNotes ? (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "60px 0", gap: 12 }}>
          <div style={{ width: 32, height: 32, border: `3px solid ${T.gold}`, borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
          <p style={{ fontFamily: "'Syne',sans-serif", color: T.t3, fontSize: 13 }}>Loading notes…</p>
        </div>
      ) : notes.length === 0 ? (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "60px 0", gap: 10 }}>
          <StickyNote size={40} color={T.t4} />
          <p style={{ fontFamily: "'Syne',sans-serif", color: T.t3, fontSize: 14, fontWeight: 600 }}>No notes yet</p>
          <p style={{ fontFamily: "'Lora',serif", color: T.t3, fontSize: 13, fontStyle: "italic" }}>Create your first note to get started.</p>
        </div>
      ) : (
        <motion.div layout style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 16 }}>
          <AnimatePresence>{notes.map(n => <NoteCard key={n.id} note={n} onEdit={handleEdit} onDelete={handleDeleteNote} T={T} />)}</AnimatePresence>
        </motion.div>
      )}
    </div>
  );

  /* ── TASKS ── */
  const renderTasks = () => {
    const done = tasks.filter(t => t.status === "completed");
    const todo = tasks.filter(t => t.status !== "completed");
    const progress = tasks.length ? Math.round((done.length / tasks.length) * 100) : 0;
    const priorityColor = { high: T.red, medium: T.gold, low: T.teal };
    const tagColors = ["#7c6ee0", "#22c55e", "#f97316", "#ec4899", "#3b82f6", "#f59e0b"];
    const tagColor = tag => tag ? tagColors[tag.charCodeAt(0) % tagColors.length] : tagColors[0];

    function TaskRow({ task }) {
      const [hov, setHov] = useState(false);
      const pc = priorityColor[task.priority] || T.t3;
      const tc = tagColor(task.tag);
      return (
        <motion.div layout initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
          onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
          style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 13px", borderRadius: 12, background: hov ? T.hover : T.mid, border: hov ? `1px solid ${T.b2}` : `1px solid ${T.b1}`, transition: "all 0.16s", cursor: "default" }}>
          <div
            onClick={() => toggleTaskStatus(task)}
            style={{
              width: 22,
              height: 22,
              borderRadius: "50%",
              flexShrink: 0,
              border: `2px solid ${task.status === "completed" ? T.green : T.b2}`,
              background: task.status === "completed" ? `${T.green}22` : "transparent",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer"
            }}
          >
            {task.status === "completed" && <Check size={11} color={T.green} />}
          </div>
          <span style={{ flex: 1, fontFamily: "'Syne',sans-serif", fontSize: 13.5, color: task.status === "completed" ? T.t3 : T.t1, textDecoration: task.status === "completed" ? "line-through" : "none", lineHeight: 1.3 }}>{task.title}</span>
          <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9.5, fontWeight: 700, padding: "2px 7px", borderRadius: 4, background: `${tc}18`, color: tc, border: `1px solid ${tc}33`, flexShrink: 0, letterSpacing: "0.3px" }}>{task.tag || "general"}</span>
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: pc, flexShrink: 0, title: task.priority }} />
          <button onClick={() => handleDeleteTask(task)} style={{ background: "transparent", border: "none", cursor: "pointer", color: T.t3, display: "flex", alignItems: "center", justifyContent: "center", padding: 2, transition: "color 0.13s" }}
            onMouseEnter={e => e.currentTarget.style.color = T.red}
            onMouseLeave={e => e.currentTarget.style.color = T.t3}>
            <Trash2 size={14} />
          </button>
        </motion.div>
      );
    }

    return (
      <div style={{ padding: "32px 28px", animation: "fadeUp 0.35s ease both" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 28 }}>
          <div style={{ width: 3, height: 24, borderRadius: 2, background: T.teal }} />
          <ClipboardList size={20} color={T.teal} />
          <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 22, color: T.t1, margin: 0, letterSpacing: "-0.3px" }}>My Tasks</h2>
        </div>

        {/* Progress card */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          style={{ background: T.card, border: `1px solid ${T.b1}`, borderRadius: 16, padding: "22px 24px", marginBottom: 24, display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap", overflow: "hidden", position: "relative" }}>
          <div style={{ position: "absolute", right: -20, top: -20, width: 120, height: 120, borderRadius: "50%", background: `${T.teal}08`, border: `1px solid ${T.teal}18` }} />
          <div style={{ position: "relative", width: 80, height: 80, flexShrink: 0 }}>
            <svg width="80" height="80" viewBox="0 0 80 80" style={{ transform: "rotate(-90deg)" }}>
              <circle cx="40" cy="40" r="32" fill="none" stroke={T.b2} strokeWidth="6" />
              <circle cx="40" cy="40" r="32" fill="none" stroke={T.teal} strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 32}`}
                strokeDashoffset={`${2 * Math.PI * 32 * (1 - progress / 100)}`}
                style={{ transition: "stroke-dashoffset 0.6s ease" }} />
            </svg>
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 14, color: T.teal }}>{progress}%</span>
            </div>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 17, color: T.t1, margin: "0 0 10px" }}>{done.length} of {tasks.length} tasks done</p>
            <div style={{ height: 5, borderRadius: 3, background: T.b1, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${progress}%`, borderRadius: 3, background: `linear-gradient(90deg,${T.accent},${T.teal})`, transition: "width 0.6s ease" }} />
            </div>
          </div>
          <div style={{ display: "flex", gap: 12, flexShrink: 0 }}>
            {[{ label: "Done", value: done.length, color: T.green }, { label: "Todo", value: todo.length, color: T.gold }].map(s => (
              <div key={s.label} style={{ textAlign: "center", background: T.mid, borderRadius: 10, padding: "10px 14px", border: `1px solid ${T.b1}` }}>
                <p style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 22, color: s.color, margin: 0, lineHeight: 1 }}>{s.value}</p>
                <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: T.t3, margin: "3px 0 0", textTransform: "uppercase", letterSpacing: "0.5px" }}>{s.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Task columns */}
        <div className="tasks-columns" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12, padding: "8px 14px", background: T.card, borderRadius: 10, border: `1px solid ${T.b1}` }}>
              <Circle size={13} color={T.gold} />
              <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 12, color: T.t2, letterSpacing: "0.8px", textTransform: "uppercase", flex: 1 }}>To Do</span>
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10.5, color: T.gold, background: `${T.gold}16`, padding: "1px 7px", borderRadius: 4, fontWeight: 700 }}>{todo.length}</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {todo.map(t => <TaskRow key={t.id} task={t} />)}
            </div>
            <button onClick={() => setShowTaskModal(true)}
              style={{ marginTop: 10, width: "100%", padding: "10px 14px", borderRadius: 10, border: `1.5px dashed ${T.b2}`, background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, color: T.t3, fontFamily: "'Syne',sans-serif", fontSize: 13, fontWeight: 600, transition: "all 0.14s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = T.accent; e.currentTarget.style.color = T.accent; e.currentTarget.style.background = T.accentS; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = T.b2; e.currentTarget.style.color = T.t3; e.currentTarget.style.background = "transparent"; }}>
              <Plus size={14} />Add task
            </button>
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12, padding: "8px 14px", background: T.card, borderRadius: 10, border: `1px solid ${T.b1}` }}>
              <CheckCircle2 size={13} color={T.green} />
              <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 12, color: T.t2, letterSpacing: "0.8px", textTransform: "uppercase", flex: 1 }}>Completed</span>
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10.5, color: T.green, background: `${T.green}16`, padding: "1px 7px", borderRadius: 4, fontWeight: 700 }}>{done.length}</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {done.map(t => <TaskRow key={t.id} task={t} />)}
            </div>
          </div>
        </div>

        {/* Priority legend */}
        <div style={{ marginTop: 20, display: "flex", alignItems: "center", gap: 16, padding: "10px 14px", background: T.card, borderRadius: 10, border: `1px solid ${T.b1}`, flexWrap: "wrap" }}>
          <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: T.t3, textTransform: "uppercase", letterSpacing: "1px" }}>Priority:</span>
          {Object.entries({ high: T.red, medium: T.gold, low: T.teal }).map(([k, v]) => (
            <div key={k} style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: v }} />
              <span style={{ fontFamily: "'Syne',sans-serif", fontSize: 11.5, color: T.t3, textTransform: "capitalize" }}>{k}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  /* ── SETTINGS ── */
  const renderSettings = () => (
    <div style={{ padding: "32px 28px", animation: "fadeUp 0.35s ease both" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
        <div style={{ width: 3, height: 24, borderRadius: 2, background: T.accent }} />
        <Palette size={20} color={T.accent} />
        <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 22, color: T.t1, margin: 0, letterSpacing: "-0.3px" }}>Platform Theme</h2>
      </div>
      <p style={{ fontFamily: "'Lora',serif", fontSize: 15, color: T.t2, lineHeight: 1.75, maxWidth: 520, marginBottom: 28, fontStyle: "italic", paddingLeft: 13 }}>
        Change the colour scheme of your entire Code Journey workspace. Your choice persists across sessions.
      </p>
      <div className="theme-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 14, maxWidth: 800 }}>
        {Object.values(THEMES).map((th, i) => {
          const active = themeKey === th.key;
          const Icon = th.icon;
          return (
            <motion.button key={th.key} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
              onClick={() => applyTheme(th.key)}
              style={{ background: th.deep, border: active ? `2px solid ${th.accent}` : `1px solid ${th.b2}`, borderRadius: 14, padding: "18px 16px", cursor: "pointer", textAlign: "left", transition: "all 0.2s", outline: "none", position: "relative", boxShadow: active ? `0 0 24px ${th.accent}28` : "none", transform: active ? "scale(1.02)" : "scale(1)" }}>
              {active && (
                <div style={{ position: "absolute", top: 12, right: 12, width: 20, height: 20, borderRadius: "50%", background: th.accent, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 10px ${th.accent}60` }}>
                  <Check size={11} color="#fff" />
                </div>
              )}
              <div style={{ display: "flex", gap: 5, marginBottom: 14 }}>
                {[th.shell, th.accent, th.teal, th.green].map((c, j) => (
                  <div key={j} style={{ width: 16, height: 16, borderRadius: "50%", background: c, border: "1.5px solid rgba(255,255,255,0.12)" }} />
                ))}
              </div>
              <div style={{ height: 3, borderRadius: 2, marginBottom: 14, background: `linear-gradient(90deg,${th.accent},${th.teal})` }} />
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5 }}>
                <Icon size={13} color={th.accent} />
                <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 13.5, color: th.t1 }}>{th.label}</span>
              </div>
              <p style={{ fontFamily: "'Lora',serif", fontSize: 11.5, color: th.t3, margin: 0, lineHeight: 1.4, fontStyle: "italic" }}>{th.description}</p>
            </motion.button>
          );
        })}
      </div>

      {/* Danger zone */}
      {/* <div style={{ marginTop: 40, padding: "20px 22px", borderRadius: 14, border: `1px solid ${T.red}28`, background: `${T.red}06` }}>
        <p style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 12, color: T.red, letterSpacing: "1px", textTransform: "uppercase", marginBottom: 12 }}>Danger Zone</p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div>
            <p style={{ fontFamily: "'Syne',sans-serif", fontWeight: 600, fontSize: 14, color: T.t1, margin: "0 0 3px" }}>Delete account</p>
            <p style={{ fontFamily: "'Lora',serif", fontStyle: "italic", fontSize: 13, color: T.t3, margin: 0 }}>Permanently removes your account and all data. Cannot be undone.</p>
          </div>
          <button onClick={() => setConfirmAccountOpen(true)} style={{ padding: "9px 20px", borderRadius: 10, border: `1px solid ${T.red}44`, background: `${T.red}10`, color: T.red, fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 13, cursor: "pointer", transition: "all 0.14s", whiteSpace: "nowrap", flexShrink: 0 }}
            onMouseEnter={e => { e.currentTarget.style.background = `${T.red}20`; }}
            onMouseLeave={e => { e.currentTarget.style.background = `${T.red}10`; }}>
            Delete account
          </button>
        </div>
      </div> */}
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard": return renderDashboard();
      case "notes": return renderNotes();
      case "tasks": return renderTasks();
      case "settings": return renderSettings();
      default: return null;
    }
  };

  /* ═══════════════════════════════════════════════════════
     SHELL
  ═══════════════════════════════════════════════════════ */
  return (
    <>
      <FontLink />
      <style>{`
        input::placeholder,textarea::placeholder{color:${T.t4};}
        select{color-scheme:dark;}
        ::-webkit-scrollbar{width:4px;}
        ::-webkit-scrollbar-thumb{background:${T.active};border-radius:3px;}
        ::-webkit-scrollbar-track{background:transparent;}
      `}</style>

      <div style={{ minHeight: "100vh", display: "flex", background: T.shell, fontFamily: "'Syne',sans-serif", color: T.t1, overflow: "hidden" }}>

        {/* ── SIDEBAR ── */}
        <aside className="cj-sidebar" style={{
          position: "fixed", top: 0, left: 0, height: "100vh", width: 230,
          background: T.deep, borderRight: `1px solid ${T.sidebarBorder}`,
          display: "flex", flexDirection: "column", zIndex: 40,
          transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.26s cubic-bezier(0.4,0,0.2,1)",
        }}>
          {/* Sidebar top */}
          <div style={{ padding: "20px 18px 16px", borderBottom: `1px solid ${T.sidebarBorder}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Av name={profile.name} size={36} T={T} />
              <div>
                <p style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 13.5, color: T.t1, margin: "0 0 1px", lineHeight: 1 }}>{profile.name}</p>
                <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10.5, color: T.t3, margin: 0 }}>@{profile.username}</p>
              </div>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="cj-sidebar-close"
              style={{ background: "none", border: "none", cursor: "pointer", color: T.t3, padding: 2, display: "flex" }}>
              <X size={16} />
            </button>
          </div>

          <nav style={{ padding: "14px 12px", flex: 1, display: "flex", flexDirection: "column" }}>
            {[
              { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
              { id: "notes", label: "Notes", icon: StickyNote },
              { id: "tasks", label: "Tasks", icon: ClipboardList },
              { id: "settings", label: "Theme", icon: Palette },
            ].map(item => (
              <NavItem key={item.id} {...item} activeSection={activeSection} setActiveSection={setActiveSection} navigate={navigate} setSidebarOpen={setSidebarOpen} T={T} />
            ))}
          </nav>

          <div className="sidebar-footer" style={{ padding: "14px 12px", borderTop: `1px solid ${T.sidebarBorder}` }}>
            <button onClick={handleLogout} style={{ width: "100%", display: "flex", alignItems: "center", gap: 9, padding: "9px 12px", borderRadius: 9, border: "none", background: "transparent", color: T.red, fontFamily: "'Syne',sans-serif", fontWeight: 600, fontSize: 13, cursor: "pointer", transition: "background 0.14s" }}
              onMouseEnter={e => e.currentTarget.style.background = `${T.red}14`}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
              <LogOut size={15} />Log Out
            </button>
          </div>
        </aside>

        {sidebarOpen && <div onClick={() => setSidebarOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 35, backdropFilter: "blur(4px)" }} />}

        {/* ── MAIN ── */}
        <main className="cj-main" style={{ flex: 1, minHeight: "100vh", display: "flex", flexDirection: "column" }}>
          {/* Topbar */}
          <div style={{ background: T.deep, borderBottom: `1px solid ${T.sidebarBorder}`, padding: "0 20px", display: "flex", alignItems: "center", height: 52, gap: 14, flexShrink: 0 }}>
            <button className="sidebar-toggle-button" onClick={() => setSidebarOpen(true)}
              style={{ background: T.hover, border: `1px solid ${T.b1}`, borderRadius: 8, width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: T.t2, flexShrink: 0 }}>
              <Menu size={17} />
            </button>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, fontFamily: "'JetBrains Mono',monospace", color: T.t3 }}>
              <span>profile</span><span style={{ opacity: 0.4 }}>›</span>
              <span style={{ color: T.accent }}>{activeSection === "settings" ? "theme" : activeSection}</span>
            </div>
            <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontFamily: "'Syne',sans-serif", fontSize: 13, color: T.t2, fontWeight: 500 }}>Hello, {profile.name?.split(" ")[0] || "there"}</span>
              <Av name={profile.name} size={30} T={T} />
            </div>
          </div>

          {/* Content */}
          <div style={{ flex: 1, overflowY: "auto", background: T.mid }}>
            <AnimatePresence mode="wait">
              <motion.div key={activeSection}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.18 }}
                style={{ minHeight: "100%" }}>
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>

        {/* Responsive styles */}
        <style>{`
          .cj-sidebar{min-height:100vh!important;height:100vh!important;display:flex!important;flex-direction:column!important;}
          .sidebar-footer{margin-top:auto!important;}
          @media(min-width:768px){
            .cj-sidebar{position:sticky!important;transform:translateX(0)!important;flex-shrink:0;height:100vh;top:0;align-self:flex-start;}
            .cj-sidebar-close{display:none!important;}
            .sidebar-toggle-button{display:none!important;}
          }
          @media(max-width:767px){
            .cj-sidebar{position:fixed!important;}
            .dashboard-quick-cards{display:none!important;}
            .tasks-columns{grid-template-columns:1fr!important;}
            .theme-grid{grid-template-columns:1fr!important;}
          }
        `}</style>

        {/* ════ ALL MODALS ════════════════════════════════ */}

        {/* Note create/edit */}
        {showNoteModal && (
          <NoteModal
            editingNote={editingNote}
            title={noteTitle} setTitle={setNoteTitle}
            content={noteContent} setContent={setNoteContent}
            onClose={closeNoteModal} onSubmit={handleNoteSubmit}
            isLoading={noteLoading} T={T} />
        )}

        {/* Confirm delete note */}
        <ConfirmModal
          open={confirmNoteOpen}
          onClose={() => { setConfirmNoteOpen(false); setNoteToDelete(null); }}
          onConfirm={confirmDeleteNote}
          title="Delete Note?"
          message={`"${noteToDelete?.title}" will be permanently removed. This cannot be undone.`}
          confirmLabel="Delete note"
          T={T} />

        {/* Task create */}
        <TaskModal
          open={showTaskModal}
          onClose={() => { setShowTaskModal(false); setTaskTitle(""); setTaskDesc(""); setTaskPriority("medium"); }}
          onSubmit={handleTaskSubmit}
          taskTitle={taskTitle} setTaskTitle={setTaskTitle}
          taskDesc={taskDesc} setTaskDesc={setTaskDesc}
          taskPriority={taskPriority} setTaskPriority={setTaskPriority}
          T={T} />

        {/* Confirm delete task */}
        <ConfirmModal
          open={confirmTaskOpen}
          onClose={() => { setConfirmTaskOpen(false); setTaskToDelete(null); }}
          onConfirm={confirmDeleteTask}
          title="Remove Task?"
          message={`"${taskToDelete?.title}" will be deleted from your board.`}
          confirmLabel="Remove task"
          T={T} />

        {/* Confirm delete account */}
        <ConfirmModal
          open={confirmAccountOpen}
          onClose={() => setConfirmAccountOpen(false)}
          onConfirm={async () => {
            setConfirmAccountOpen(false);
            await supabase.auth.signOut();
            navigate("/");
          }}
          title="Delete Account?"
          message="This will permanently delete your account, all notes, tasks, and activity. This cannot be undone."
          confirmLabel="Delete forever"
          T={T} />

      </div>
    </>
  );
}