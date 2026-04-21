/**
 * Snippets.jsx  →  /snippets
 * Searchable library of copy-paste code patterns.
 * Organized by language, filterable by tag.
 */
import React,{useState,useEffect,useMemo}from"react";
import{motion,AnimatePresence}from"framer-motion";
import{Code2,Copy,Check,Search,Filter,X}from"lucide-react";

const PT={cosmos:{shell:"#07080d",deep:"#0c0e18",mid:"#111420",surface:"#161927",panel:"#1a1e2e",hover:"#1e2335",card:"#161927",cardH:"#1c2235",t1:"#e8eaf2",t2:"#8892b0",t3:"#5a6488",t4:"#2e3660",b1:"rgba(120,130,180,0.08)",b2:"rgba(120,130,180,0.15)",b3:"rgba(120,130,180,0.24)",acc:"#7c6ee0",teal:"#5eead4",green:"#22c55e",red:"#f87171",amber:"#fbbf24",dark:true},void:{shell:"#000",deep:"#050507",mid:"#0a0a0f",surface:"#0f0f15",panel:"#141419",hover:"#1a1a22",card:"#0f0f15",cardH:"#161622",t1:"#f0f0ff",t2:"#9090b8",t3:"#505070",t4:"#252540",b1:"rgba(100,100,200,0.08)",b2:"rgba(100,100,200,0.14)",b3:"rgba(100,100,200,0.22)",acc:"#8b7ff0",teal:"#2dd4bf",green:"#34d399",red:"#fc8181",amber:"#fcd34d",dark:true},aurora:{shell:"#040e0e",deep:"#071414",mid:"#0b1c1c",surface:"#102424",panel:"#142a2a",hover:"#1a3333",card:"#102424",cardH:"#162e2e",t1:"#e0f5f5",t2:"#7ab8b8",t3:"#3d7878",t4:"#1e4444",b1:"rgba(80,200,180,0.08)",b2:"rgba(80,200,180,0.15)",b3:"rgba(80,200,180,0.24)",acc:"#2dd4bf",teal:"#5eead4",green:"#4ade80",red:"#f87171",amber:"#fbbf24",dark:true},nord:{shell:"#1a1f2e",deep:"#1e2535",mid:"#232c40",surface:"#28334a",panel:"#2d3a50",hover:"#344260",card:"#28334a",cardH:"#2e3d55",t1:"#eceff4",t2:"#9ba8c0",t3:"#5c6a88",t4:"#3a4560",b1:"rgba(136,192,208,0.1)",b2:"rgba(136,192,208,0.18)",b3:"rgba(136,192,208,0.28)",acc:"#88c0d0",teal:"#8fbcbb",green:"#a3be8c",red:"#bf616a",amber:"#ebcb8b",dark:true},light:{shell:"#f3f4f8",deep:"#fff",mid:"#f0f1f7",surface:"#fff",panel:"#f7f8fc",hover:"#eef0f8",card:"#fff",cardH:"#f5f6fc",t1:"#111827",t2:"#4b5680",t3:"#7c87a8",t4:"#c5ccdf",b1:"rgba(80,90,150,0.08)",b2:"rgba(80,90,150,0.15)",b3:"rgba(80,90,150,0.24)",acc:"#6256d0",teal:"#0d9488",green:"#16a34a",red:"#dc2626",amber:"#d97706",dark:false}};
const getT=()=>{try{return PT[localStorage.getItem("cj-theme")]||PT.cosmos;}catch{return PT.cosmos;}};
function useTheme(){const[T,setT]=useState(getT);useEffect(()=>{const iv=setInterval(()=>{const f=getT();if(f.acc!==T.acc)setT(f);},500);return()=>clearInterval(iv);},[T]);useEffect(()=>{const fn=()=>setT(getT());window.addEventListener("storage",fn);return()=>window.removeEventListener("storage",fn);},[]);return T;}

const SNIPS = [
  // JS/TS
  {id:"js-fetch",    lang:"javascript",color:"#f7df1e",title:"Fetch JSON from API",         tags:["fetch","async","api"],      code:`async function getData(url) {\n  try {\n    const res = await fetch(url);\n    if (!res.ok) throw new Error(\`HTTP \${res.status}\`);\n    return await res.json();\n  } catch (err) {\n    console.error('Fetch failed:', err);\n    return null;\n  }\n}`},
  {id:"js-debounce", lang:"javascript",color:"#f7df1e",title:"Debounce",                    tags:["performance","events"],     code:`function debounce(fn, delay = 300) {\n  let timer;\n  return (...args) => {\n    clearTimeout(timer);\n    timer = setTimeout(() => fn(...args), delay);\n  };\n}`},
  {id:"js-deepclone",lang:"javascript",color:"#f7df1e",title:"Deep Clone Object",           tags:["objects","utilities"],      code:`function deepClone(obj) {\n  if (obj === null || typeof obj !== 'object') return obj;\n  if (Array.isArray(obj)) return obj.map(deepClone);\n  return Object.fromEntries(\n    Object.entries(obj).map(([k,v]) => [k, deepClone(v)])\n  );\n}`},
  {id:"js-groupby",  lang:"javascript",color:"#f7df1e",title:"Group Array by Key",          tags:["arrays","objects"],         code:`const groupBy = (arr, key) =>\n  arr.reduce((acc, item) => ({\n    ...acc,\n    [item[key]]: [...(acc[item[key]] || []), item]\n  }), {});`},
  {id:"js-sleep",    lang:"javascript",color:"#f7df1e",title:"Sleep (async delay)",         tags:["async","utilities"],        code:`const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));\n\n// Usage:\nawait sleep(1000); // wait 1 second`},
  {id:"js-localstorage",lang:"javascript",color:"#f7df1e",title:"localStorage with expiry",tags:["storage","browser"],        code:`function setWithExpiry(key, value, ttlMs) {\n  localStorage.setItem(key, JSON.stringify({\n    value,\n    expiry: Date.now() + ttlMs\n  }));\n}\n\nfunction getWithExpiry(key) {\n  const item = JSON.parse(localStorage.getItem(key) || 'null');\n  if (!item) return null;\n  if (Date.now() > item.expiry) { localStorage.removeItem(key); return null; }\n  return item.value;\n}`},
  // TypeScript
  {id:"ts-fetch",    lang:"typescript",color:"#60a5fa",title:"Typed Fetch Wrapper",         tags:["fetch","generics","api"],   code:`async function fetchData<T>(url: string): Promise<T | null> {\n  try {\n    const res = await fetch(url);\n    if (!res.ok) throw new Error(\`HTTP \${res.status}\`);\n    return await res.json() as T;\n  } catch {\n    return null;\n  }\n}\n\n// Usage:\nconst user = await fetchData<User>('/api/user/1');`},
  {id:"ts-result",   lang:"typescript",color:"#60a5fa",title:"Result Type Pattern",         tags:["error-handling","types"],   code:`type Result<T, E = Error> =\n  | { ok: true;  data: T }\n  | { ok: false; error: E };\n\nasync function safeOp<T>(fn: () => Promise<T>): Promise<Result<T>> {\n  try   { return { ok: true,  data:  await fn() }; }\n  catch(e){ return { ok: false, error: e as Error }; }\n}`},
  {id:"ts-readonly", lang:"typescript",color:"#60a5fa",title:"Deep Readonly Utility",       tags:["types","utilities"],        code:`type DeepReadonly<T> = {\n  readonly [K in keyof T]: T[K] extends object\n    ? DeepReadonly<T[K]>\n    : T[K];\n};`},
  // React
  {id:"r-usefetch",  lang:"react",     color:"#61dafb",title:"useFetch Hook",               tags:["hooks","async","api"],      code:`function useFetch<T>(url: string) {\n  const [data,    setData]    = useState<T | null>(null);\n  const [loading, setLoading] = useState(true);\n  const [error,   setError]   = useState<string | null>(null);\n\n  useEffect(() => {\n    let cancelled = false;\n    (async () => {\n      try {\n        const res  = await fetch(url);\n        const json = await res.json();\n        if (!cancelled) setData(json);\n      } catch (e) {\n        if (!cancelled) setError((e as Error).message);\n      } finally {\n        if (!cancelled) setLoading(false);\n      }\n    })();\n    return () => { cancelled = true; };\n  }, [url]);\n\n  return { data, loading, error };\n}`},
  {id:"r-uselocal",  lang:"react",     color:"#61dafb",title:"useLocalStorage Hook",        tags:["hooks","storage"],          code:`function useLocalStorage<T>(key: string, initial: T) {\n  const [value, setValue] = useState<T>(() => {\n    try { return JSON.parse(localStorage.getItem(key) || ''); }\n    catch { return initial; }\n  });\n\n  const set = (v: T | ((prev: T) => T)) => {\n    const next = typeof v === 'function' ? (v as Function)(value) : v;\n    setValue(next);\n    localStorage.setItem(key, JSON.stringify(next));\n  };\n\n  return [value, set] as const;\n}`},
  {id:"r-portal",    lang:"react",     color:"#61dafb",title:"Modal Portal",                tags:["ui","portals"],             code:`import { createPortal } from 'react-dom';\n\nfunction Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {\n  useEffect(() => {\n    const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };\n    document.addEventListener('keydown', fn);\n    return () => document.removeEventListener('keydown', fn);\n  }, [onClose]);\n\n  return createPortal(\n    <div className="modal-backdrop" onClick={onClose}>\n      <div onClick={e => e.stopPropagation()}>{children}</div>\n    </div>,\n    document.body\n  );\n}`},
  // Python
  {id:"py-retry",    lang:"python",    color:"#4ade80",title:"Retry Decorator",             tags:["utilities","errors"],       code:`import time\nimport functools\n\ndef retry(times=3, delay=1.0, exceptions=(Exception,)):\n    def decorator(fn):\n        @functools.wraps(fn)\n        def wrapper(*args, **kwargs):\n            for attempt in range(1, times + 1):\n                try:\n                    return fn(*args, **kwargs)\n                except exceptions as e:\n                    if attempt == times: raise\n                    time.sleep(delay * attempt)\n        return wrapper\n    return decorator\n\n@retry(times=3, delay=0.5)\ndef fetch_data(url): ...`},
  {id:"py-flatten",  lang:"python",    color:"#4ade80",title:"Flatten Nested List",         tags:["lists","recursion"],        code:`def flatten(lst):\n    result = []\n    for item in lst:\n        if isinstance(item, list):\n            result.extend(flatten(item))\n        else:\n            result.append(item)\n    return result\n\n# Or one-liner for one level deep:\nflat = [x for sub in nested for x in sub]`},
  {id:"py-timer",    lang:"python",    color:"#4ade80",title:"Timer Context Manager",       tags:["utilities","performance"],  code:`import time\nfrom contextlib import contextmanager\n\n@contextmanager\ndef timer(label=''):\n    start = time.perf_counter()\n    try:\n        yield\n    finally:\n        ms = (time.perf_counter() - start) * 1000\n        print(f'{label}: {ms:.1f}ms')\n\nwith timer('load data'):\n    df = pd.read_csv('big_file.csv')`},
  // SQL
  {id:"sql-running", lang:"sql",       color:"#a78bfa",title:"Running Total",               tags:["window-functions","analytics"],code:`SELECT\n  date,\n  amount,\n  SUM(amount) OVER (\n    ORDER BY date\n    ROWS UNBOUNDED PRECEDING\n  ) AS running_total\nFROM transactions\nORDER BY date;`},
  {id:"sql-rank",    lang:"sql",       color:"#a78bfa",title:"Rank Within Groups",          tags:["window-functions","analytics"],code:`SELECT\n  customer_id,\n  order_date,\n  amount,\n  RANK() OVER (\n    PARTITION BY customer_id\n    ORDER BY amount DESC\n  ) AS rank_by_amount\nFROM orders;`},
  {id:"sql-gaps",    lang:"sql",       color:"#a78bfa",title:"Month-over-Month Growth",     tags:["LAG","analytics"],          code:`SELECT\n  month,\n  revenue,\n  LAG(revenue) OVER (ORDER BY month) AS prev_month,\n  ROUND(\n    (revenue - LAG(revenue) OVER (ORDER BY month))\n    / NULLIF(LAG(revenue) OVER (ORDER BY month), 0) * 100\n  , 1) AS growth_pct\nFROM monthly_revenue;`},
  {id:"sql-dedup",   lang:"sql",       color:"#a78bfa",title:"Deduplicate — keep latest",   tags:["CTE","dedup"],              code:`WITH ranked AS (\n  SELECT *,\n    ROW_NUMBER() OVER (\n      PARTITION BY email\n      ORDER BY created_at DESC\n    ) AS rn\n  FROM users\n)\nSELECT * FROM ranked WHERE rn = 1;`},
];

function hl(line) {
  let s = line.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
  s = s.replace(/(\/\/[^\n]*|#[^\n]*)/g,'<span style="color:#6a9955;font-style:italic">$1</span>');
  s = s.replace(/("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)/g,'<span style="color:#ce9178">$1</span>');
  s = s.replace(/\b(function|return|const|let|var|if|else|for|while|async|await|import|export|from|class|type|interface|def|SELECT|FROM|WHERE|GROUP|ORDER|OVER|PARTITION|LAG|ROW_NUMBER|RANK|WITH|NULLIF|ROUND)\b/g,'<span style="color:#c792ea">$1</span>');
  s = s.replace(/\b(\d+\.?\d*)\b/g,'<span style="color:#f78c6c">$1</span>');
  return s;
}

function SnipCard({s, T}) {
  const [copied,setCopied]=useState(false);
  const [hov,setHov]=useState(false);
  const copy=()=>{try{navigator.clipboard.writeText(s.code);}catch(e){}setCopied(true);setTimeout(()=>setCopied(false),1800);};
  return (
    <motion.div layout initial={{opacity:0,y:10}} animate={{opacity:1,y:0}}
      onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{background:T.card,border:`1px solid ${hov?s.color+"44":T.b1}`,borderRadius:14,overflow:"hidden",transition:"all 0.18s",transform:hov?"translateY(-2px)":"none",boxShadow:hov?`0 6px 24px ${s.color}12`:"none"}}>
      {/* Header */}
      <div style={{padding:"12px 16px",borderBottom:`1px solid ${T.b1}`,display:"flex",alignItems:"center",gap:8}}>
        <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,fontWeight:700,color:s.color,background:`${s.color}14`,border:`1px solid ${s.color}28`,padding:"2px 7px",borderRadius:4}}>{s.lang}</span>
        <h3 style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:14,color:T.t1,margin:0,flex:1}}>{s.title}</h3>
        <button onClick={copy}
          style={{display:"flex",alignItems:"center",gap:4,padding:"4px 10px",borderRadius:7,border:`1px solid ${T.b2}`,background:copied?`${T.green}14`:"transparent",color:copied?T.green:T.t3,fontFamily:"'JetBrains Mono',monospace",fontSize:10.5,cursor:"pointer",transition:"all 0.15s"}}>
          {copied?<Check size={11}/>:<Copy size={11}/>}{copied?"copied":"copy"}
        </button>
      </div>
      {/* Code */}
      <div style={{padding:"14px 16px",overflowX:"auto",background:T.deep,fontFamily:"'JetBrains Mono',monospace",fontSize:12.5}}>
        {s.code.split("\n").map((line,i)=>(
          <div key={i} style={{display:"flex",lineHeight:"1.7",minHeight:"1.7em"}}>
            <span style={{color:T.t4,width:26,flexShrink:0,userSelect:"none",fontSize:10.5}}>{i+1}</span>
            <span style={{color:T.t2,whiteSpace:"pre"}} dangerouslySetInnerHTML={{__html:hl(line)}}/>
          </div>
        ))}
      </div>
      {/* Tags */}
      <div style={{padding:"8px 16px",borderTop:`1px solid ${T.b1}`,display:"flex",gap:5,flexWrap:"wrap"}}>
        {s.tags.map(t=><span key={t} style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9.5,color:T.t4,background:T.hover,border:`1px solid ${T.b1}`,padding:"1px 6px",borderRadius:3}}>#{t}</span>)}
      </div>
    </motion.div>
  );
}

const LANGS = [...new Set(SNIPS.map(s=>s.lang))];
const ALL_TAGS = [...new Set(SNIPS.flatMap(s=>s.tags))].sort();

export default function Snippets() {
  const T = useTheme();
  const [q,setQ]         = useState("");
  const [filterLang,setL]= useState("all");
  const [filterTag,setT2]= useState("all");

  const filtered = useMemo(()=>{
    return SNIPS.filter(s=>{
      const matchQ  = !q.trim()||(s.title+s.tags.join(" ")).toLowerCase().includes(q.toLowerCase());
      const matchL  = filterLang==="all"||s.lang===filterLang;
      const matchT  = filterTag==="all"||s.tags.includes(filterTag);
      return matchQ&&matchL&&matchT;
    });
  },[q,filterLang,filterTag]);

  const LANG_COLOR={javascript:"#f7df1e",typescript:"#60a5fa",react:"#61dafb",python:"#4ade80",sql:"#a78bfa",dart:"#5eead4"};

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600&family=Syne:wght@400;500;600;700;800&family=Lora:ital,wght@0,400;0,500;1,400;1,500&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        body{background:${T.shell};}
        ::-webkit-scrollbar{width:5px;}::-webkit-scrollbar-thumb{background:${T.hover};border-radius:3px;}
        ::selection{background:rgba(124,110,224,0.25);}
        @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
      `}</style>
      <div style={{minHeight:"100vh",background:T.shell,color:T.t1,fontFamily:"'Syne',sans-serif"}}>
        <div style={{background:T.deep,borderBottom:`1px solid ${T.b1}`,padding:"96px 24px 52px",position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",inset:0,backgroundImage:`linear-gradient(${T.b1} 1px,transparent 1px),linear-gradient(90deg,${T.b1} 1px,transparent 1px)`,backgroundSize:"48px 48px",maskImage:"radial-gradient(ellipse 70% 70% at 50% 40%,black 20%,transparent 100%)",pointerEvents:"none"}}/>
          <div style={{maxWidth:900,margin:"0 auto",position:"relative"}}>
            <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} style={{display:"inline-flex",alignItems:"center",gap:7,padding:"4px 14px",borderRadius:100,background:`${T.acc}14`,border:`1px solid ${T.acc}40`,marginBottom:18}}>
              <Code2 size={12} color={T.acc}/>
              <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,fontWeight:700,color:T.acc,letterSpacing:"2px",textTransform:"uppercase"}}>Snippet Library</span>
            </motion.div>
            <motion.h1 initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} transition={{delay:0.08}} style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:"clamp(30px,5vw,52px)",lineHeight:1.07,letterSpacing:"-1.1px",marginBottom:12,color:T.t1}}>
              Copy. Paste.<br/><span style={{color:T.acc}}>Understand.</span>
            </motion.h1>
            <motion.p initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.14}} style={{fontFamily:"'Lora',serif",fontStyle:"italic",fontSize:16,color:T.t2,lineHeight:1.75,maxWidth:480,marginBottom:24}}>{SNIPS.length} patterns. Every snippet is commented and production-ready.</motion.p>
            {/* Search */}
            <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.18}} style={{position:"relative",maxWidth:480}}>
              <Search size={16} color={T.t3} style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",pointerEvents:"none"}}/>
              <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search snippets…"
                style={{width:"100%",background:T.surface||T.card,border:`1.5px solid ${q?T.acc+"77":T.b2}`,borderRadius:11,padding:"12px 40px 12px 42px",fontFamily:"'Syne',sans-serif",fontSize:14,color:T.t1,outline:"none",transition:"border 0.16s"}}/>
              {q&&<button onClick={()=>setQ("")} style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:T.t3}}><X size={14}/></button>}
            </motion.div>
          </div>
        </div>

        {/* FILTERS */}
        <div style={{background:T.deep,borderBottom:`1px solid ${T.b1}`,padding:"0 24px",position:"sticky",top:60,zIndex:40,backdropFilter:"blur(16px)"}}>
          <div style={{maxWidth:900,margin:"0 auto",minHeight:48,display:"flex",alignItems:"center",gap:6,overflowX:"auto",padding:"4px 0"}}>
            <Filter size={13} color={T.t3} style={{flexShrink:0}}/>
            {["all",...LANGS].map(l=>{
              const active=filterLang===l;
              const c=l==="all"?T.acc:(LANG_COLOR[l]||T.acc);
              return <button key={l} onClick={()=>setL(l)}
                style={{padding:"4px 12px",borderRadius:7,border:`1px solid ${active?c+"44":T.b1}`,background:active?`${c}14`:"transparent",color:active?c:T.t2,fontFamily:"'Syne',sans-serif",fontWeight:active?700:500,fontSize:12.5,cursor:"pointer",flexShrink:0,transition:"all 0.13s",textTransform:"capitalize"}}>
                {l}
              </button>;
            })}
            <div style={{width:1,height:18,background:T.b2,flexShrink:0}}/>
            <div style={{display:"flex",gap:4,overflowX:"auto",flexShrink:0}}>
              {["all",...ALL_TAGS.slice(0,12)].map(tg=>{
                const active=filterTag===tg;
                return <button key={tg} onClick={()=>setT2(tg)}
                  style={{padding:"3px 9px",borderRadius:6,border:`1px solid ${active?T.acc+"55":T.b1}`,background:active?`${T.acc}12`:"transparent",color:active?T.acc:T.t3,fontFamily:"'JetBrains Mono',monospace",fontSize:10.5,cursor:"pointer",flexShrink:0,transition:"all 0.13s"}}>
                  {tg==="all"?"all":"#"+tg}
                </button>;
              })}
            </div>
            <span style={{marginLeft:"auto",fontFamily:"'JetBrains Mono',monospace",fontSize:10.5,color:T.t3,flexShrink:0}}>{filtered.length}</span>
          </div>
        </div>

        {/* GRID */}
        <div style={{maxWidth:900,margin:"0 auto",padding:"32px 24px 80px"}}>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(360px,1fr))",gap:16}}>
            <AnimatePresence mode="popLayout">
              {filtered.map(s=><SnipCard key={s.id} s={s} T={T}/>)}
            </AnimatePresence>
          </div>
          {filtered.length===0&&<div style={{textAlign:"center",padding:"60px 0",color:T.t3,fontFamily:"'Syne',sans-serif"}}>No snippets match this filter.</div>}
        </div>
      </div>
    </>
  );
}