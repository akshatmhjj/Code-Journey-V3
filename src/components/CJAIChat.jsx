import React, {
    useState, useEffect, useRef, useCallback, createContext, useContext,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../lib/supabase";

/* ══ THEME ══════════════════════════════════════════════════ */
const THEMES = {
    cosmos: { bg: "#07080d", surface: "#161927", panel: "#1a1e2e", card: "#0c0e18", hover: "#1e2335", t1: "#e8eaf2", t2: "#8892b0", t3: "#5a6488", b1: "rgba(120,130,180,0.1)", b2: "rgba(120,130,180,0.18)", acc: "#7c6ee0", teal: "#5eead4", dark: true },
    void: { bg: "#000", surface: "#0f0f15", panel: "#141419", card: "#050507", hover: "#1a1a22", t1: "#f0f0ff", t2: "#9090b8", t3: "#505070", b1: "rgba(100,100,200,0.1)", b2: "rgba(100,100,200,0.18)", acc: "#8b7ff0", teal: "#2dd4bf", dark: true },
    aurora: { bg: "#040e0e", surface: "#102424", panel: "#142a2a", card: "#071414", hover: "#1a3333", t1: "#e0f5f5", t2: "#7ab8b8", t3: "#3d7878", b1: "rgba(80,200,180,0.1)", b2: "rgba(80,200,180,0.18)", acc: "#2dd4bf", teal: "#5eead4", dark: true },
    nord: { bg: "#1a1f2e", surface: "#28334a", panel: "#2d3a50", card: "#1e2535", hover: "#344260", t1: "#eceff4", t2: "#9ba8c0", t3: "#5c6a88", b1: "rgba(136,192,208,0.1)", b2: "rgba(136,192,208,0.18)", acc: "#88c0d0", teal: "#8fbcbb", dark: true },
    light: { bg: "#f3f4f8", surface: "#fff", panel: "#f7f8fc", card: "#fff", hover: "#eef0f8", t1: "#111827", t2: "#4b5680", t3: "#7c87a8", b1: "rgba(80,90,150,0.08)", b2: "rgba(80,90,150,0.15)", acc: "#6256d0", teal: "#0d9488", dark: false },
};
const getT = () => { try { return THEMES[localStorage.getItem("cj-theme")] || THEMES.light; } catch { return THEMES.light; } };
function useTheme() { const [T, set] = useState(getT); useEffect(() => { const iv = setInterval(() => { const f = getT(); if (f.acc !== T.acc) set(f); }, 500); return () => clearInterval(iv); }, [T]); return T; }

/* ══ GEMINI API CALL ════════════════════════════════════════ */
const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

/* The system prompt — this is what trains the bot to be CJ-specific */
const SYSTEM_PROMPT = `You are CJ AI, the intelligent assistant for Code Journey — a browser-native learning platform for software engineering beginners.

YOUR IDENTITY:
- Name: CJ AI
- Platform: Code Journey (codejourney.dev)
- Purpose: Help learners understand programming concepts, navigate the platform, and make progress on their learning path

WHAT YOU HELP WITH:
1. Explaining programming concepts from any of the three CJ tracks:
   - Web Dev: HTML, CSS, JavaScript, TypeScript, React, Node.js
   - App Dev: Flutter, Dart, Kotlin, Swift, React Native
   - Data Science: Python, NumPy, Pandas, SQL, Machine Learning, R
2. Answering questions about how Code Journey works (roadmap, exercises, glossary, IDE, profile, notes, tasks)
3. Helping users understand code snippets they highlight and send you
4. Giving career advice specific to the three tracks
5. Explaining technical terms in plain English
6. Helping debug or understand code examples

HOW YOU RESPOND:
- Be concise but complete. No padding, no filler.
- Use plain English analogies for complex concepts — the CJ way
- Format code with triple backticks and the language name
- Use **bold** for key terms
- Use numbered lists for steps, bullet points for options
- Keep responses focused — if you can answer in 3 sentences, do it in 3 sentences
- For code questions, always show a real, working example

WHAT YOU DON'T DO:
- Answer questions completely unrelated to coding, tech, or the Code Journey platform
- Write essays, stories, poems, or non-technical content
- Give financial, legal, or medical advice
- Discuss competitor platforms in detail

If someone asks something outside your scope, respond with:
"I'm CJ AI — I'm here to help with coding and Code Journey questions. For [their topic], I'd suggest searching elsewhere. Is there something about your learning journey I can help with?"

PLATFORM CONTEXT:
- Code Journey has three learning tracks: Web Development, App Development, Data Science
- Users progress through stages on each track
- The platform has: a Roadmap, an in-browser IDE (coming soon), Practice exercises, Glossary, Snippet Library, Blog, Leaderboard, Profile with Notes and Tasks
- The IDE and AI Tutor features are coming in a future release
- Streaks track daily engagement; XP will launch with the exercises system
- Theme options: Cosmos (dark), Void, Aurora, Nord, Light

Always be encouraging. Learning to code is hard — acknowledge that and be warm about it.`;

async function askGemini(messages) {
    if (!API_KEY) throw new Error("VITE_GEMINI_API_KEY not set in .env");

    // Build conversation history for Gemini
    const contents = messages.map(m => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
    }));

    const res = await fetch(`${GEMINI_URL}?key=${API_KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
            contents,
            generationConfig: {
                temperature: 0.7,
                topP: 0.85,
                maxOutputTokens: 1024,
            },
            safetySettings: [
                { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
                { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
                { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
                { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
            ],
        }),
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        if (res.status === 429) throw new Error("Rate limit reached. Please wait a moment and try again.");
        throw new Error(err?.error?.message || `API error ${res.status}`);
    }

    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error("No response received.");
    return text;
}

/* ══ MARKDOWN FORMATTER ═════════════════════════════════════ */
function formatMessage(text, T) {
    const lines = text.split("\n");
    const result = [];
    let i = 0;

    while (i < lines.length) {
        const line = lines[i];

        // Code block
        if (line.startsWith("```")) {
            const lang = line.slice(3).trim();
            const codeLines = [];
            i++;
            while (i < lines.length && !lines[i].startsWith("```")) {
                codeLines.push(lines[i]);
                i++;
            }
            result.push(
                <div key={i} style={{
                    background: T.dark ? "#0a0c15" : "#f0f1f7",
                    border: `1px solid ${T.b2}`,
                    borderRadius: 8, overflow: "hidden", margin: "8px 0",
                }}>
                    {lang && (
                        <div style={{
                            padding: "4px 10px", background: T.dark ? "#111420" : "#e5e7f0",
                            fontFamily: "'JetBrains Mono',monospace", fontSize: 9.5,
                            color: T.acc, fontWeight: 700, letterSpacing: "0.5px",
                            textTransform: "uppercase",
                        }}>{lang}</div>
                    )}
                    <pre style={{
                        margin: 0, padding: "10px 12px", overflowX: "auto",
                        fontFamily: "'JetBrains Mono',monospace", fontSize: 12,
                        color: T.dark ? "#e8eaf2" : "#1e2235", lineHeight: 1.65,
                    }}>
                        {codeLines.join("\n")}
                    </pre>
                </div>
            );
            i++;
            continue;
        }

        // Numbered list
        if (/^\d+\.\s/.test(line)) {
            const items = [];
            while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
                items.push(lines[i].replace(/^\d+\.\s/, ""));
                i++;
            }
            result.push(
                <ol key={i} style={{ margin: "6px 0 6px 16px", padding: 0, color: T.t2, fontFamily: "'Lora',serif", fontSize: 13.5, lineHeight: 1.72 }}>
                    {items.map((it, j) => <li key={j} style={{ marginBottom: 3 }} dangerouslySetInnerHTML={{ __html: inlineFormat(it, T) }} />)}
                </ol>
            );
            continue;
        }

        // Bullet list
        if (/^[-*•]\s/.test(line)) {
            const items = [];
            while (i < lines.length && /^[-*•]\s/.test(lines[i])) {
                items.push(lines[i].replace(/^[-*•]\s/, ""));
                i++;
            }
            result.push(
                <ul key={i} style={{ margin: "6px 0 6px 12px", padding: 0, color: T.t2, fontFamily: "'Lora',serif", fontSize: 13.5, lineHeight: 1.72, listStyle: "none" }}>
                    {items.map((it, j) => (
                        <li key={j} style={{ display: "flex", gap: 7, marginBottom: 3, alignItems: "flex-start" }}>
                            <span style={{ color: T.acc, flexShrink: 0, marginTop: 3, fontSize: 8 }}>◆</span>
                            <span dangerouslySetInnerHTML={{ __html: inlineFormat(it, T) }} />
                        </li>
                    ))}
                </ul>
            );
            continue;
        }

        // Empty line
        if (line.trim() === "") { result.push(<div key={i} style={{ height: 6 }} />); i++; continue; }

        // Regular paragraph
        result.push(
            <p key={i} style={{ margin: "3px 0", color: T.t2, fontFamily: "'Lora',serif", fontSize: 13.5, lineHeight: 1.78 }}
                dangerouslySetInnerHTML={{ __html: inlineFormat(line, T) }} />
        );
        i++;
    }
    return result;
}

function inlineFormat(text, T) {
    return text
        .replace(/\*\*(.*?)\*\*/g, `<strong style="color:${T.t1};font-family:'Syne',sans-serif;font-weight:700">$1</strong>`)
        .replace(/`(.*?)`/g, `<code style="background:${T.dark ? "#111420" : "#e5e7f0"};color:${T.acc};padding:1px 5px;border-radius:4px;font-family:'JetBrains Mono',monospace;font-size:11.5px">$1</code>`)
        .replace(/\*(.*?)\*/g, `<em>$1</em>`);
}

/* ══ TEXT SELECTION TOOLTIP ═════════════════════════════════ */
function SelectionTooltip({ onAsk, T }) {
    const [tooltip, setTooltip] = useState(null);
    const timerRef = useRef(null);

    useEffect(() => {
        const handleSelection = () => {
            clearTimeout(timerRef.current);
            timerRef.current = setTimeout(() => {
                const sel = window.getSelection();
                const text = sel?.toString().trim();
                if (!text || text.length < 3 || text.length > 500) { setTooltip(null); return; }

                const range = sel.getRangeAt(0);
                const rect = range.getBoundingClientRect();
                setTooltip({
                    text,
                    x: rect.left + rect.width / 2,
                    y: rect.top + window.scrollY - 44,
                });
            }, 260);
        };

        const handleClick = e => {
            if (!e.target.closest(".cjai-tooltip")) {
                clearTimeout(timerRef.current);
                timerRef.current = setTimeout(() => {
                    if (!window.getSelection()?.toString().trim()) setTooltip(null);
                }, 180);
            }
        };

        document.addEventListener("mouseup", handleSelection);
        document.addEventListener("touchend", handleSelection);
        document.addEventListener("mousedown", handleClick);
        return () => {
            document.removeEventListener("mouseup", handleSelection);
            document.removeEventListener("touchend", handleSelection);
            document.removeEventListener("mousedown", handleClick);
            clearTimeout(timerRef.current);
        };
    }, []);

    if (!tooltip) return null;

    return (
        <AnimatePresence>
            <motion.div
                className="cjai-tooltip"
                initial={{ opacity: 0, y: 6, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 4, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                style={{
                    position: "absolute",
                    left: tooltip.x,
                    top: tooltip.y,
                    transform: "translateX(-50%)",
                    zIndex: 8000,
                    background: T.dark ? "rgba(10,8,22,0.97)" : "rgba(255,255,255,0.97)",
                    border: `1px solid ${T.acc}55`,
                    borderRadius: 10,
                    boxShadow: `0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px ${T.acc}22`,
                    backdropFilter: "blur(16px)",
                    overflow: "hidden",
                }}
            >
                <button
                    onClick={() => {
                        onAsk(`What is this? Please explain: "${tooltip.text}"`);
                        setTooltip(null);
                        window.getSelection()?.removeAllRanges();
                    }}
                    style={{
                        display: "flex", alignItems: "center", gap: 7,
                        padding: "8px 13px",
                        background: "transparent", border: "none", cursor: "pointer",
                        fontFamily: "'Syne',sans-serif", fontWeight: 700,
                        fontSize: 12.5, color: T.acc,
                        whiteSpace: "nowrap",
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = `${T.acc}14`}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                    {/* CJ logo mini */}
                    <svg width="16" height="16" viewBox="0 0 36 36" fill="none">
                        <defs>
                            <linearGradient id="ttg" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
                                <stop offset="0%" stopColor="#7c6ee0" /><stop offset="100%" stopColor="#5eead4" />
                            </linearGradient>
                        </defs>
                        <rect x="1" y="1" width="34" height="34" rx="9" fill="rgba(124,110,224,0.12)" stroke="url(#ttg)" strokeWidth="1.3" />
                        <path d="M22 12.5 C17.5 10 10.5 11.2 10.5 18 C10.5 24.8 17.5 26 22 23.5" stroke="url(#ttg)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                        <path d="M25.5 12.2 L25.5 21.5 C25.5 24.8 22.5 26.5 19.8 25.5" stroke="url(#ttg)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                        <circle cx="25.5" cy="11.8" r="1.7" fill="#5eead4" />
                    </svg>
                    Ask CJ AI
                    {/* <span style={{
            fontSize: 9.5, color: T.t3, fontFamily: "'JetBrains Mono',monospace",
            background: T.b1, padding: "1px 5px", borderRadius: 4, border: `1px solid ${T.b2}`,
          }}>
            {tooltip.text.length > 22 ? tooltip.text.slice(0, 22) + "…" : tooltip.text}
          </span> */}
                </button>
            </motion.div>
        </AnimatePresence>
    );
}

/* ══ MAIN CHAT COMPONENT ════════════════════════════════════ */
export default function CJAIChat({ isLoggedIn = false }) {
    const T = useTheme();
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            id: 0, role: "assistant",
            content: "Hey! I'm **CJ AI** — your Code Journey assistant.\n\nAsk me anything about the tracks, languages, how the platform works, or highlight any text on the page and send it my way.\n\nWhat are you working on?",
        },
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const bottomRef = useRef(null);
    const inputRef = useRef(null);
    const idRef = useRef(1);

    // Scroll to bottom on new messages
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading]);

    // Focus input when opened
    useEffect(() => {
        if (open) setTimeout(() => inputRef.current?.focus(), 180);
    }, [open]);

    const typeWriter = (fullText, id) => {
        let index = 0;

        setMessages(prev => [
            ...prev,
            { id, role: "assistant", content: "" } 
        ]);

        const interval = setInterval(() => {
            index++;

            setMessages(prev =>
                prev.map(msg =>
                    msg.id === id
                        ? { ...msg, content: fullText.slice(0, index) }
                        : msg
                )
            );

            if (index >= fullText.length) {
                clearInterval(interval);
            }
        }, 12); 
    };

    const sendMessage = useCallback(async (text) => {
        const trimmed = (text || input).trim();
        if (!trimmed || loading) return;

        setInput("");
        setError(null);

        const userMsg = { id: ++idRef.current, role: "user", content: trimmed };
        const newMessages = [...messages, userMsg];
        setMessages(newMessages);
        setLoading(true);

        // If chat is closed, open it
        setOpen(true);

        try {
            // Only send last 12 messages to stay within context limits
            const context = newMessages.slice(-12);
            const reply = await askGemini(context);
            const newId = ++idRef.current;
            typeWriter(reply, newId);
        } catch (err) {
            setError(err.message || "Something went wrong. Try again.");
        } finally {
            setLoading(false);
        }
    }, [input, messages, loading]);

    const handleKey = e => {
        if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
    };

    // Suggested questions shown at start
    const suggestions = [
        "What track should I start with?",
        "Explain React hooks simply",
        "What is a Promise in JavaScript?",
        "How does the roadmap work?",
        "Difference between Flutter and React Native?",
        "What is SQL used for?",
    ];

    if (!isLoggedIn) return null; // Gate: don't render for logged-out users

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600&family=Syne:wght@400;600;700;800&family=Lora:ital,wght@0,400;0,500;1,400&display=swap');

        @keyframes cjaiPulse {
          0%,100% { box-shadow: 0 0 0 0 rgba(124,110,224,0.5); }
          50%      { box-shadow: 0 0 0 8px rgba(124,110,224,0); }
        }
        @keyframes cjaiShimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        @keyframes cjaiDots {
          0%,80%,100% { transform: scale(0.6); opacity: 0.4; }
          40%          { transform: scale(1);   opacity: 1;   }
        }

        .cjai-bubble { animation: cjaiPulse 2.5s ease infinite; }
        .cjai-bubble:hover { animation: none; transform: scale(1.06); }

        .cjai-input:focus { outline: none; }
        .cjai-input::placeholder { color: ${T.t3}; }

        .cjai-msg-user   { align-self: flex-end;   }
        .cjai-msg-assist { align-self: flex-start;  }

        /* Scrollbar inside chat */
        .cjai-scroll::-webkit-scrollbar { width: 3px; }
        .cjai-scroll::-webkit-scrollbar-thumb { background: ${T.b2}; border-radius: 2px; }

        /* Mobile full-screen */
        @media (max-width: 480px) {
          .cjai-window {
            bottom: 82px !important;
            right: 12px  !important;
            left: auto   !important;
            width: calc(100vw - 80px) !important;
            height: 72vh  !important;
            max-height: 520px !important;
            border-radius: 16px !important;
          }
        }
      `}</style>

            {/* ── TEXT SELECTION TOOLTIP ── */}
            <SelectionTooltip onAsk={sendMessage} T={T} />

            {/* ── CHAT WINDOW ── */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        className="cjai-window"
                        initial={{ opacity: 0, scale: 0.92, y: 16 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.92, y: 12 }}
                        transition={{ type: "spring", stiffness: 360, damping: 30 }}
                        style={{
                            position: "fixed",
                            bottom: 90, right: 20,
                            width: 380, height: 560,
                            background: T.surface,
                            border: `1px solid ${T.b2}`,
                            borderRadius: 18,
                            display: "flex", flexDirection: "column",
                            overflow: "hidden",
                            boxShadow: T.dark
                                ? "0 24px 80px rgba(0,0,0,0.65), 0 0 0 0.5px rgba(124,110,224,0.2)"
                                : "0 16px 56px rgba(0,0,0,0.18), 0 0 0 0.5px rgba(98,86,208,0.15)",
                            zIndex: 7000,
                        }}
                    >
                        {/* ── HEADER ── */}
                        <div style={{
                            display: "flex", alignItems: "center", gap: 10,
                            padding: "14px 16px",
                            background: T.dark ? "rgba(12,10,28,0.9)" : T.panel,
                            borderBottom: `1px solid ${T.b1}`,
                            flexShrink: 0,
                        }}>
                            {/* CJ logo */}
                            <svg width="32" height="32" viewBox="0 0 36 36" fill="none" style={{ flexShrink: 0 }}>
                                <defs>
                                    <linearGradient id="hg" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
                                        <stop offset="0%" stopColor="#7c6ee0" />
                                        <stop offset="100%" stopColor="#5eead4" />
                                    </linearGradient>
                                </defs>
                                <rect x="1" y="1" width="34" height="34" rx="10" fill="rgba(124,110,224,0.12)" stroke="url(#hg)" strokeWidth="1.2" />
                                <path d="M22 12.5 C17.5 10 10.5 11.2 10.5 18 C10.5 24.8 17.5 26 22 23.5" stroke="url(#hg)" strokeWidth="2.3" strokeLinecap="round" fill="none" />
                                <path d="M25.5 12.2 L25.5 21.5 C25.5 24.8 22.5 26.5 19.8 25.5" stroke="url(#hg)" strokeWidth="2.3" strokeLinecap="round" fill="none" />
                                <circle cx="25.5" cy="11.8" r="1.5" fill="#5eead4" opacity="0.95" />
                            </svg>

                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 15 }}>
                                    <p style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 14.5, color: T.t1, margin: 0 }}>CJ AI</p>
                                    <div style={{
                                        display: "flex", alignItems: "center", gap: 4,
                                        padding: "0px 4x", borderRadius: 100,
                                        background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.3)",
                                    }}>
                                        <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 7, color: "#22c55e", fontWeight: 700 }}>ONLINE</span>
                                    </div>
                                </div>
                                <p style={{ fontFamily: "'Lora',serif", fontStyle: "italic", fontSize: 11, color: T.t3, margin: 0 }}>
                                    Code Journey Assistant
                                </p>
                            </div>

                            {/* Clear + Close */}
                            <div style={{ display: "flex", gap: 4 }}>
                                <button
                                    onClick={() => setMessages([messages[0]])}
                                    title="Clear chat"
                                    style={{
                                        width: 28, height: 28, borderRadius: 7,
                                        background: "transparent", border: `1px solid ${T.b1}`,
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        cursor: "pointer", color: T.t3, transition: "all 0.14s",
                                        fontFamily: "'JetBrains Mono',monospace", fontSize: 9.5,
                                    }}
                                    onMouseEnter={e => { e.currentTarget.style.background = T.hover; e.currentTarget.style.color = T.t2; }}
                                    onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = T.t3; }}>
                                    ↺
                                </button>
                                <button
                                    onClick={() => setOpen(false)}
                                    title="Close chat"
                                    style={{
                                        width: 28, height: 28, borderRadius: 7,
                                        background: "transparent", border: `1px solid ${T.b1}`,
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        cursor: "pointer", color: T.t3, transition: "all 0.14s",
                                        fontSize: 14, lineHeight: 1,
                                    }}
                                    onMouseEnter={e => { e.currentTarget.style.background = T.hover; e.currentTarget.style.color = T.t2; }}
                                    onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = T.t3; }}>
                                    ×
                                </button>
                            </div>
                        </div>

                        {/* ── MESSAGES ── */}
                        <div className="cjai-scroll" style={{
                            flex: 1, overflowY: "auto", overscrollBehavior: "contain",
                            padding: "14px 14px 8px",
                            display: "flex", flexDirection: "column", gap: 12,
                        }}>
                            {messages.map((msg) => (
                                <div key={msg.id}
                                    className={msg.role === "user" ? "cjai-msg-user" : "cjai-msg-assist"}
                                    style={{ display: "flex", maxWidth: "88%" }}>
                                    {msg.role === "assistant" && (
                                        <div style={{
                                            width: 22, height: 22, borderRadius: 6, flexShrink: 0,
                                            background: "linear-gradient(135deg,#7c6ee0,#5eead4)",
                                            display: "flex", alignItems: "center", justifyContent: "center",
                                            fontSize: 9, fontWeight: 800, color: "#fff",
                                            fontFamily: "'Syne',sans-serif", marginRight: 8, marginTop: 2,
                                        }}>CJ</div>
                                    )}
                                    <div style={{
                                        padding: msg.role === "user" ? "9px 13px" : "10px 13px",
                                        borderRadius: msg.role === "user"
                                            ? "14px 14px 4px 14px"
                                            : "4px 14px 14px 14px",
                                        background: msg.role === "user"
                                            ? `linear-gradient(135deg, ${T.acc}, ${T.acc}cc)`
                                            : T.dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)",
                                        border: msg.role === "user"
                                            ? "none"
                                            : `1px solid ${T.b1}`,
                                        maxWidth: "100%",
                                    }}>
                                        {msg.role === "user" ? (
                                            <p style={{
                                                fontFamily: "'Syne',sans-serif", fontSize: 13.5,
                                                color: "#fff", margin: 0, lineHeight: 1.55,
                                                wordBreak: "break-word",
                                            }}>{msg.content}</p>
                                        ) : (
                                            <div style={{ minWidth: 0 }}>
                                                {formatMessage(msg.content, T)}
                                            </div>
                                        )}z
                                    </div>
                                </div>
                            ))}

                            {/* Typing indicator */}
                            {loading && (
                                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                    <div style={{
                                        width: 22, height: 22, borderRadius: 6, flexShrink: 0,
                                        background: "linear-gradient(135deg,#7c6ee0,#5eead4)",
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        fontSize: 9, fontWeight: 800, color: "#fff",
                                        fontFamily: "'Syne',sans-serif",
                                    }}>CJ</div>
                                    <div style={{
                                        padding: "10px 14px", borderRadius: "4px 14px 14px 14px",
                                        background: T.dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)",
                                        border: `1px solid ${T.b1}`,
                                        display: "flex", gap: 4, alignItems: "center",
                                    }}>
                                        {[0, 1, 2].map(i => (
                                            <div key={i} style={{
                                                width: 6, height: 6, borderRadius: "50%",
                                                background: T.acc, opacity: 0.7,
                                                animation: `cjaiDots 1.2s ease infinite`,
                                                animationDelay: `${i * 0.2}s`,
                                            }} />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Error */}
                            {error && (
                                <div style={{
                                    padding: "9px 12px", borderRadius: 10,
                                    background: "rgba(248,113,113,0.08)",
                                    border: "1px solid rgba(248,113,113,0.25)",
                                    fontFamily: "'Syne',sans-serif", fontSize: 12.5,
                                    color: "#f87171", lineHeight: 1.5,
                                }}>
                                    {error}
                                </div>
                            )}

                            {/* Suggestions (shown when only greeting is visible) */}
                            {messages.length === 1 && !loading && (
                                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 4 }}>
                                    {suggestions.map(s => (
                                        <button key={s} onClick={() => sendMessage(s)} style={{
                                            padding: "5px 11px", borderRadius: 8,
                                            border: `1px solid ${T.b2}`,
                                            background: T.dark ? "rgba(124,110,224,0.07)" : "rgba(98,86,208,0.06)",
                                            color: T.t3, fontFamily: "'Syne',sans-serif", fontWeight: 500,
                                            fontSize: 11.5, cursor: "pointer", transition: "all 0.13s",
                                            textAlign: "left", lineHeight: 1.4,
                                        }}
                                            onMouseEnter={e => { e.currentTarget.style.borderColor = `${T.acc}55`; e.currentTarget.style.color = T.acc; }}
                                            onMouseLeave={e => { e.currentTarget.style.borderColor = T.b2; e.currentTarget.style.color = T.t3; }}>
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            )}

                            <div ref={bottomRef} />
                        </div>

                        {/* ── INPUT ── */}
                        <div style={{
                            padding: "10px 12px",
                            borderTop: `1px solid ${T.b1}`,
                            background: T.dark ? "rgba(8,6,18,0.6)" : T.panel,
                            flexShrink: 0,
                        }}>
                            <div style={{
                                display: "flex", alignItems: "flex-end", gap: 8,
                                background: T.dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)",
                                border: `1.5px solid ${T.b2}`,
                                borderRadius: 12, padding: "6px 10px 6px 14px",
                                transition: "border-color 0.15s",
                            }}
                                onFocusCapture={e => e.currentTarget.style.borderColor = `${T.acc}66`}
                                onBlurCapture={e => e.currentTarget.style.borderColor = T.b2}>
                                <textarea
                                    ref={inputRef}
                                    className="cjai-input"
                                    value={input}
                                    onChange={e => setInput(e.target.value)}
                                    onKeyDown={handleKey}
                                    placeholder="Ask CJ AI anything…"
                                    rows={1}
                                    disabled={loading}
                                    style={{
                                        flex: 1, background: "transparent", border: "none",
                                        resize: "none", fontFamily: "'Syne',sans-serif",
                                        fontSize: 13.5, color: T.t1, lineHeight: 1.5,
                                        maxHeight: 100, overflowY: "auto",
                                        minHeight: 20,
                                    }}
                                    onInput={e => {
                                        e.target.style.height = "auto";
                                        e.target.style.height = Math.min(e.target.scrollHeight, 100) + "px";
                                    }}
                                />
                                <button
                                    onClick={() => sendMessage()}
                                    disabled={!input.trim() || loading}
                                    style={{
                                        width: 24, height: 24, borderRadius: 9, border: "none",
                                        background: !input.trim() || loading ? T.b1 : `linear-gradient(135deg,${T.acc},${T.teal}88)`,
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        cursor: !input.trim() || loading ? "not-allowed" : "pointer",
                                        flexShrink: 0, transition: "all 0.16s",
                                        boxShadow: !input.trim() || loading ? "none" : `0 2px 12px ${T.acc}44`,
                                    }}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                        <path d="M22 2L11 13" stroke={!input.trim() || loading ? T.t3 : "#fff"} strokeWidth="2.2" strokeLinecap="round" />
                                        <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke={!input.trim() || loading ? T.t3 : "#fff"} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>
                            </div>
                            <p style={{
                                fontFamily: "'JetBrains Mono',monospace", fontSize: 9.5,
                                color: T.t3, margin: "5px 2px 0", letterSpacing: "0.3px",
                            }}>Enter to send · Shift+Enter for new line</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── FAB BUTTON ── */}
            <motion.button
                className="cjai-bubble"
                onClick={() => setOpen(o => !o)}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.94 }}
                style={{
                    position: "fixed", bottom: 22, right: 22,
                    width: 56, height: 56, borderRadius: "50%",
                    border: "none", cursor: "pointer",
                    background: open
                        ? T.dark ? "rgba(20,18,40,0.95)" : "rgba(255,255,255,0.95)"
                        : "linear-gradient(135deg, #ff3b3b, #1a0000)",
                    boxShadow: open
                        ? `0 4px 20px rgba(0,0,0,0.4), 0 0 0 1px ${T.acc}44`
                        : "0 4px 24px rgba(124,110,224,0.55)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    zIndex: 6999,
                    transition: "background 0.22s, box-shadow 0.22s",
                }}
                aria-label={open ? "Close CJ AI" : "Open CJ AI"}
            >
                <AnimatePresence mode="wait">
                    {open ? (
                        <motion.span key="close"
                            initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.18 }}
                            style={{ fontSize: 22, color: T.acc, lineHeight: 1, display: "flex" }}>
                            ×
                        </motion.span>
                    ) : (
                        <motion.svg key="logo"
                            initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.18 }}
                            width="28" height="28" viewBox="0 0 36 36" fill="none">
                            <path d="M22 12.5 C17.5 10 10.5 11.2 10.5 18 C10.5 24.8 17.5 26 22 23.5"
                                stroke="#fff" strokeWidth="2.8" strokeLinecap="round" fill="none" />
                            <path d="M25.5 12.2 L25.5 21.5 C25.5 24.8 22.5 26.5 19.8 25.5"
                                stroke="#fff" strokeWidth="2.8" strokeLinecap="round" fill="none" />
                            <circle cx="25.5" cy="11.8" r="2" fill="#fff" opacity="0.9" />
                        </motion.svg>
                    )}
                </AnimatePresence>
            </motion.button>
        </>
    );
}
