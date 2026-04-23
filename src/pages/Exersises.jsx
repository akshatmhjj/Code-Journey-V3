/**
 * Exercises.jsx  →  /practice
 * Header nav: "Practice" link
 * 
 * Per-language coding challenges with:
 * - Difficulty filter (Easy / Medium / Hard)
 * - Inline mini-editor (textarea, not full IDE)
 * - Test case runner (simulated)
 * - Solution reveal after attempt
 * - XP reward on pass
 */
import React,{useState,useEffect,useRef}from"react";
import{motion,AnimatePresence}from"framer-motion";
import{Code2,CheckCircle2,XCircle,ChevronDown,ChevronRight,Zap,Star,Lock,Play,Eye,EyeOff,Filter,RotateCcw,Trophy,Flame}from"lucide-react";

const PT={cosmos:{shell:"#07080d",deep:"#0c0e18",mid:"#111420",surface:"#161927",panel:"#1a1e2e",hover:"#1e2335",card:"#161927",cardH:"#1c2235",t1:"#e8eaf2",t2:"#8892b0",t3:"#5a6488",t4:"#2e3660",b1:"rgba(120,130,180,0.08)",b2:"rgba(120,130,180,0.15)",b3:"rgba(120,130,180,0.24)",acc:"#7c6ee0",teal:"#5eead4",green:"#22c55e",red:"#f87171",amber:"#fbbf24",dark:true},void:{shell:"#000",deep:"#050507",mid:"#0a0a0f",surface:"#0f0f15",panel:"#141419",hover:"#1a1a22",card:"#0f0f15",cardH:"#161622",t1:"#f0f0ff",t2:"#9090b8",t3:"#505070",t4:"#252540",b1:"rgba(100,100,200,0.08)",b2:"rgba(100,100,200,0.14)",b3:"rgba(100,100,200,0.22)",acc:"#8b7ff0",teal:"#2dd4bf",green:"#34d399",red:"#fc8181",amber:"#fcd34d",dark:true},aurora:{shell:"#040e0e",deep:"#071414",mid:"#0b1c1c",surface:"#102424",panel:"#142a2a",hover:"#1a3333",card:"#102424",cardH:"#162e2e",t1:"#e0f5f5",t2:"#7ab8b8",t3:"#3d7878",t4:"#1e4444",b1:"rgba(80,200,180,0.08)",b2:"rgba(80,200,180,0.15)",b3:"rgba(80,200,180,0.24)",acc:"#2dd4bf",teal:"#5eead4",green:"#4ade80",red:"#f87171",amber:"#fbbf24",dark:true},nord:{shell:"#1a1f2e",deep:"#1e2535",mid:"#232c40",surface:"#28334a",panel:"#2d3a50",hover:"#344260",card:"#28334a",cardH:"#2e3d55",t1:"#eceff4",t2:"#9ba8c0",t3:"#5c6a88",t4:"#3a4560",b1:"rgba(136,192,208,0.1)",b2:"rgba(136,192,208,0.18)",b3:"rgba(136,192,208,0.28)",acc:"#88c0d0",teal:"#8fbcbb",green:"#a3be8c",red:"#bf616a",amber:"#ebcb8b",dark:true},light:{shell:"#f3f4f8",deep:"#fff",mid:"#f0f1f7",surface:"#fff",panel:"#f7f8fc",hover:"#eef0f8",card:"#fff",cardH:"#f5f6fc",t1:"#111827",t2:"#4b5680",t3:"#7c87a8",t4:"#c5ccdf",b1:"rgba(80,90,150,0.08)",b2:"rgba(80,90,150,0.15)",b3:"rgba(80,90,150,0.24)",acc:"#6256d0",teal:"#0d9488",green:"#16a34a",red:"#dc2626",amber:"#d97706",dark:false}};
const getT=()=>{try{return PT[localStorage.getItem("cj-theme")]||PT.light;}catch{return PT.light;}};
function useTheme(){const[T,setT]=useState(getT);useEffect(()=>{const iv=setInterval(()=>{const f=getT();if(f.acc!==T.acc)setT(f);},500);return()=>clearInterval(iv);},[T]);useEffect(()=>{const fn=()=>setT(getT());window.addEventListener("storage",fn);return()=>window.removeEventListener("storage",fn);},[]);return T;}

/* ── DATA ── */
const CHALLENGES = [
  // JS
  {id:"js-1",lang:"javascript",langColor:"#f7df1e",difficulty:"easy",title:"Reverse a String",xp:10,
   description:"Write a function `reverseString(str)` that returns the string reversed.\n\nExample:\n  reverseString('hello')  →  'olleh'\n  reverseString('CJ')     →  'JC'",
   starter:"function reverseString(str) {\n  // your code here\n}",
   tests:[{input:"reverseString('hello')",expected:"olleh"},{input:"reverseString('CJ')",expected:"JC"},{input:"reverseString('')",expected:""}],
   solution:"function reverseString(str) {\n  return str.split('').reverse().join('');\n}",
   hint:"Try converting the string to an array, reversing it, then joining back to a string.",
   tags:["strings","arrays"]},
  {id:"js-2",lang:"javascript",langColor:"#f7df1e",difficulty:"easy",title:"FizzBuzz",xp:10,
   description:"Write a function `fizzBuzz(n)` that returns an array of numbers 1 to n, but:\n- Replace multiples of 3 with 'Fizz'\n- Replace multiples of 5 with 'Buzz'\n- Replace multiples of both with 'FizzBuzz'\n\nExample:\n  fizzBuzz(5)  →  [1, 2, 'Fizz', 4, 'Buzz']",
   starter:"function fizzBuzz(n) {\n  // your code here\n}",
   tests:[{input:"JSON.stringify(fizzBuzz(5))",expected:'[1,2,"Fizz",4,"Buzz"]'},{input:"JSON.stringify(fizzBuzz(15)).slice(-12)",expected:'"FizzBuzz"]'}],
   solution:"function fizzBuzz(n) {\n  return Array.from({length:n},(_,i)=>{\n    const num=i+1;\n    if(num%15===0)return'FizzBuzz';\n    if(num%3===0)return'Fizz';\n    if(num%5===0)return'Buzz';\n    return num;\n  });\n}",
   hint:"Use the modulo operator % to check divisibility. Check 15 first (both 3 and 5).",
   tags:["loops","conditionals"]},
  {id:"js-3",lang:"javascript",langColor:"#f7df1e",difficulty:"medium",title:"Group By Property",xp:25,
   description:"Write a function `groupBy(arr, key)` that groups an array of objects by a given key.\n\nExample:\n  groupBy([{lang:'JS',level:'easy'},{lang:'JS',level:'hard'},{lang:'Python',level:'easy'}], 'lang')\n  →  { JS: [{...},{...}], Python: [{...}] }",
   starter:"function groupBy(arr, key) {\n  // your code here\n}",
   tests:[{input:"Object.keys(groupBy([{l:'a'},{l:'b'},{l:'a'}],'l')).sort().join()",expected:"a,b"},{input:"groupBy([{l:'a'},{l:'b'},{l:'a'}],'l')['a'].length",expected:"2"}],
   solution:"function groupBy(arr, key) {\n  return arr.reduce((acc, item) => {\n    const k = item[key];\n    if (!acc[k]) acc[k] = [];\n    acc[k].push(item);\n    return acc;\n  }, {});\n}",
   hint:"Use Array.reduce() to accumulate an object. For each item, check if the key exists in the accumulator.",
   tags:["arrays","objects","reduce"]},
  {id:"js-4",lang:"javascript",langColor:"#f7df1e",difficulty:"medium",title:"Debounce Function",xp:30,
   description:"Implement a `debounce(fn, delay)` function.\nA debounced function only executes after `delay` ms have passed since the last call.\nUsed in search boxes to avoid firing on every keystroke.\n\nExample:\n  const search = debounce(query => fetchResults(query), 300);\n  // rapid calls: only the last one fires after 300ms",
   starter:"function debounce(fn, delay) {\n  // your code here\n}",
   tests:[{input:"typeof debounce(()=>{},100)",expected:"function"},{input:"(()=>{let c=0;const d=debounce(()=>c++,50);d();d();d();return new Promise(r=>setTimeout(()=>r(c),100));}).toString().includes('Promise')",expected:"true"}],
   solution:"function debounce(fn, delay) {\n  let timer;\n  return function(...args) {\n    clearTimeout(timer);\n    timer = setTimeout(() => fn.apply(this, args), delay);\n  };\n}",
   hint:"Use setTimeout and clearTimeout. Each call should cancel the previous timer and start a new one.",
   tags:["closures","timers","performance"]},
  {id:"js-5",lang:"javascript",langColor:"#f7df1e",difficulty:"hard",title:"Deep Clone Object",xp:40,
   description:"Write `deepClone(obj)` that creates a deep copy of a nested object or array. Handles: objects, arrays, strings, numbers, booleans, null.\n\nExample:\n  const a = {x: {y: [1,2,3]}};\n  const b = deepClone(a);\n  b.x.y.push(4);\n  a.x.y.length === 3  // true — original unaffected",
   starter:"function deepClone(obj) {\n  // your code here\n}",
   tests:[{input:"(()=>{const a={x:{y:[1,2]}};const b=deepClone(a);b.x.y.push(3);return a.x.y.length;})()",expected:"2"},{input:"deepClone(null)",expected:"null"},{input:"JSON.stringify(deepClone([1,[2,3]]))",expected:"[1,[2,3]]"}],
   solution:"function deepClone(obj) {\n  if (obj === null || typeof obj !== 'object') return obj;\n  if (Array.isArray(obj)) return obj.map(deepClone);\n  return Object.fromEntries(\n    Object.entries(obj).map(([k,v]) => [k, deepClone(v)])\n  );\n}",
   hint:"Check the type first. Recursively clone for objects and arrays. Primitives can be returned as-is.",
   tags:["recursion","objects","arrays"]},
  // Python
  {id:"py-1",lang:"python",langColor:"#4ade80",difficulty:"easy",title:"Count Word Frequency",xp:10,
   description:"Write a function `word_freq(text)` that returns a dictionary with each word's frequency (case-insensitive).\n\nExample:\n  word_freq('the cat sat on the mat')\n  →  {'the':2,'cat':1,'sat':1,'on':1,'mat':1}",
   starter:"def word_freq(text):\n    # your code here\n    pass",
   tests:[{input:"word_freq('the cat the')['the']",expected:"2"},{input:"word_freq('Hello hello')['hello']",expected:"2"},{input:"len(word_freq('a b c'))",expected:"3"}],
   solution:"def word_freq(text):\n    words = text.lower().split()\n    freq = {}\n    for word in words:\n        freq[word] = freq.get(word, 0) + 1\n    return freq",
   hint:"Split the text into words, convert to lowercase. Use a dictionary and dict.get() to count.",
   tags:["dictionaries","strings"]},
  {id:"py-2",lang:"python",langColor:"#4ade80",difficulty:"medium",title:"Flatten Nested List",xp:25,
   description:"Write a function `flatten(lst)` that flattens a deeply nested list into a single list.\n\nExample:\n  flatten([1,[2,[3,[4]]],5])  →  [1,2,3,4,5]\n  flatten([[1,2],[3,[4,5]]])   →  [1,2,3,4,5]",
   starter:"def flatten(lst):\n    # your code here\n    pass",
   tests:[{input:"flatten([1,[2,[3]]])",expected:"[1, 2, 3]"},{input:"flatten([1,2,3])",expected:"[1, 2, 3]"},{input:"flatten([[1,[2]],[3]])",expected:"[1, 2, 3]"}],
   solution:"def flatten(lst):\n    result = []\n    for item in lst:\n        if isinstance(item, list):\n            result.extend(flatten(item))\n        else:\n            result.append(item)\n    return result",
   hint:"Use recursion. For each item, check if it's a list (isinstance). If yes, recursively flatten it.",
   tags:["recursion","lists"]},
  {id:"py-3",lang:"python",langColor:"#4ade80",difficulty:"hard",title:"LRU Cache",xp:45,
   description:"Implement an LRU (Least Recently Used) cache class with get(key) and put(key, value) methods.\n- get(key): return value or -1 if not found\n- put(key, value): insert/update. If at capacity, evict the least recently used item.\n\nLRU Cache(capacity=2):\n  put(1,1) → {1:1}\n  put(2,2) → {1:1, 2:2}\n  get(1)   → 1 (1 is now most recent)\n  put(3,3) → evicts 2, {1:1, 3:3}",
   starter:"class LRUCache:\n    def __init__(self, capacity):\n        # your code here\n        pass\n\n    def get(self, key):\n        # your code here\n        pass\n\n    def put(self, key, value):\n        # your code here\n        pass",
   tests:[{input:"c=LRUCache(2);c.put(1,1);c.put(2,2);c.get(1)",expected:"1"},{input:"c=LRUCache(2);c.put(1,1);c.put(2,2);c.get(1);c.put(3,3);c.get(2)",expected:"-1"}],
   solution:"from collections import OrderedDict\nclass LRUCache:\n    def __init__(self, capacity):\n        self.cap = capacity\n        self.cache = OrderedDict()\n    def get(self, key):\n        if key not in self.cache: return -1\n        self.cache.move_to_end(key)\n        return self.cache[key]\n    def put(self, key, value):\n        if key in self.cache: self.cache.move_to_end(key)\n        self.cache[key] = value\n        if len(self.cache) > self.cap:\n            self.cache.popitem(last=False)",
   hint:"Use OrderedDict from collections. move_to_end() marks an item as recently used. popitem(last=False) removes the oldest.",
   tags:["data-structures","OrderedDict","caching"]},
  // SQL
  {id:"sql-1",lang:"sql",langColor:"#a78bfa",difficulty:"easy",title:"Top 5 by Sales",xp:10,
   description:"Given a table `orders(id, customer, amount, date)`, write a query to return the top 5 customers by total amount, highest first.\n\nExpected columns: customer, total_amount",
   starter:"SELECT\n  -- your query here\nFROM orders\n-- ...",
   tests:[{input:"query_contains_group_by",expected:"true"},{input:"query_contains_order_by_desc",expected:"true"},{input:"query_contains_limit_5",expected:"true"}],
   solution:"SELECT\n  customer,\n  SUM(amount) AS total_amount\nFROM orders\nGROUP BY customer\nORDER BY total_amount DESC\nLIMIT 5;",
   hint:"Use GROUP BY customer, SUM(amount), ORDER BY … DESC, LIMIT 5.",
   tags:["aggregation","GROUP BY","ORDER BY"]},
  {id:"sql-2",lang:"sql",langColor:"#a78bfa",difficulty:"medium",title:"Month-over-Month Growth",xp:30,
   description:"Using table `monthly_revenue(month DATE, revenue NUMERIC)`, write a query that shows each month, its revenue, and the growth % vs the previous month.\n\nColumns: month, revenue, prev_revenue, growth_pct",
   starter:"SELECT\n  -- your query here\nFROM monthly_revenue\n-- ...",
   tests:[{input:"query_uses_lag",expected:"true"},{input:"query_uses_over",expected:"true"}],
   solution:"SELECT\n  month,\n  revenue,\n  LAG(revenue) OVER (ORDER BY month) AS prev_revenue,\n  ROUND(\n    (revenue - LAG(revenue) OVER (ORDER BY month))\n    / NULLIF(LAG(revenue) OVER (ORDER BY month), 0) * 100, 1\n  ) AS growth_pct\nFROM monthly_revenue\nORDER BY month;",
   hint:"Use the LAG() window function with OVER (ORDER BY month) to access the previous row's value.",
   tags:["window functions","LAG","CTEs"]},
  // TypeScript
  {id:"ts-1",lang:"typescript",langColor:"#60a5fa",difficulty:"medium",title:"Generic Stack",xp:25,
   description:"Implement a generic `Stack<T>` class with:\n- push(item: T): void\n- pop(): T | undefined\n- peek(): T | undefined\n- get size(): number\n- get isEmpty(): boolean\n\nThe class must be type-safe — Stack<number> only accepts numbers.",
   starter:"class Stack<T> {\n  // your code here\n}",
   tests:[{input:"const s=new Stack<number>();s.push(1);s.push(2);s.pop()",expected:"2"},{input:"const s=new Stack<string>();s.push('a');s.size",expected:"1"},{input:"new Stack().isEmpty",expected:"true"}],
   solution:"class Stack<T> {\n  private items: T[] = [];\n  push(item: T): void { this.items.push(item); }\n  pop(): T|undefined { return this.items.pop(); }\n  peek(): T|undefined { return this.items[this.items.length-1]; }\n  get size(): number { return this.items.length; }\n  get isEmpty(): boolean { return this.items.length===0; }\n}",
   hint:"Use a private T[] array as the backing store. Generics let TypeScript enforce the item type at compile time.",
   tags:["generics","classes","data-structures"]},
];

const LANG_MAP = {javascript:"JS",python:"Py",typescript:"TS",sql:"SQL",dart:"Dart",react:"React"};
const DIFF_COLOR = {easy:"#22c55e",medium:"#f7df1e",hard:"#f87171"};
const DIFF_XP = {easy:10,medium:25,hard:40};

/* simulated test runner */
function runTests(code, tests, lang) {
  if(lang==="sql") {
    const low = code.toLowerCase();
    return tests.map(t => {
      let pass = false;
      if(t.input==="query_contains_group_by") pass=low.includes("group by");
      else if(t.input==="query_contains_order_by_desc") pass=low.includes("order by")&&low.includes("desc");
      else if(t.input==="query_contains_limit_5") pass=low.includes("limit 5");
      else if(t.input==="query_uses_lag") pass=low.includes("lag(");
      else if(t.input==="query_uses_over") pass=low.includes("over (")&&low.includes("over(");
      return {input:t.input,expected:t.expected,actual:pass?t.expected:"false",pass};
    });
  }
  return tests.map(t => {
    try {
      const fullCode = code + "\n" + "const __result__ = String(" + t.input + ");";
      const fn = new Function(fullCode + "\nreturn __result__;");
      const actual = fn();
      return {input:t.input,expected:String(t.expected),actual,pass:actual===String(t.expected)};
    } catch(e) {
      return {input:t.input,expected:String(t.expected),actual:"Error: "+e.message,pass:false};
    }
  });
}

/* ── CHALLENGE CARD ── */
function ChallengeCard({ch, onOpen, solved, T}) {
  const [hov,setHov]=useState(false);
  const dc = DIFF_COLOR[ch.difficulty];
  return (
    <motion.div layout initial={{opacity:0,y:12}} animate={{opacity:1,y:0}}
      onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      onClick={()=>onOpen(ch)}
      style={{background:hov?T.cardH:T.card,border:`1px solid ${hov?T.acc+"44":T.b1}`,borderRadius:14,padding:"18px 20px",cursor:"pointer",transition:"all 0.18s",transform:hov?"translateY(-2px)":"none",boxShadow:hov?`0 6px 24px ${T.acc}12`:"none",position:"relative",overflow:"hidden"}}>
      {solved&&<div style={{position:"absolute",top:0,right:0,width:0,height:0,borderLeft:"28px solid transparent",borderTop:`28px solid ${T.green}`,opacity:0.8}}/>}
      {solved&&<CheckCircle2 size={11} color="#fff" style={{position:"absolute",top:3,right:3}}/>}
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10,flexWrap:"wrap"}}>
        <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10.5,fontWeight:700,color:ch.langColor,background:`${ch.langColor}14`,border:`1px solid ${ch.langColor}28`,padding:"2px 8px",borderRadius:4}}>{LANG_MAP[ch.lang]||ch.lang}</span>
        <span style={{fontFamily:"'Syne',sans-serif",fontSize:10.5,fontWeight:700,color:dc,background:`${dc}14`,border:`1px solid ${dc}28`,padding:"2px 8px",borderRadius:100,textTransform:"capitalize"}}>{ch.difficulty}</span>
        <span style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:3,fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:T.amber}}>
          <Star size={11} fill={T.amber} color={T.amber}/>{ch.xp} XP
        </span>
      </div>
      <h3 style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:16,color:T.t1,marginBottom:7}}>{ch.title}</h3>
      <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
        {ch.tags.map(tag=><span key={tag} style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9.5,color:T.t4,background:T.active||T.hover,border:`1px solid ${T.b1}`,padding:"1px 6px",borderRadius:3}}>#{tag}</span>)}
      </div>
    </motion.div>
  );
}

/* ── CHALLENGE MODAL ── */
function ChallengeModal({ch, onClose, onSolve, solved:initSolved, T}) {
  const [code,setCode]     = useState(ch.starter);
  const [results,setRes]   = useState(null);
  const [running,setRun]   = useState(false);
  const [showSol,setSol]   = useState(false);
  const [showHint,setHint] = useState(false);
  const [solved,setSolved] = useState(initSolved);
  const ta = useRef(null);

  const run = () => {
    setRun(true);
    setTimeout(()=>{
      const res = runTests(code, ch.tests, ch.lang);
      setRes(res);
      setRun(false);
      if(res.every(r=>r.pass)&&!solved){setSolved(true);onSolve(ch.id,ch.xp);}
    },600);
  };

  const allPass = results&&results.every(r=>r.pass);

  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
      style={{position:"fixed",inset:0,zIndex:2000,display:"flex",alignItems:"flex-start",justifyContent:"center",background:"rgba(0,0,0,0.6)",backdropFilter:"blur(8px)",padding:"60px 16px 16px",overflowY:"auto"}}>
      <div onClick={onClose} style={{position:"fixed",inset:0,zIndex:-1}}/>
      <motion.div initial={{scale:0.95,y:20}} animate={{scale:1,y:0}} exit={{scale:0.95}}
        style={{background:T.surface||T.card,border:`1px solid ${T.b2}`,borderRadius:18,width:"100%",maxWidth:800,boxShadow:`0 24px 80px rgba(0,0,0,0.5)`,overflow:"hidden"}}>
        
        {/* Header */}
        <div style={{padding:"20px 24px",borderBottom:`1px solid ${T.b1}`,display:"flex",alignItems:"center",gap:12}}>
          <div style={{flex:1}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
              <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10.5,fontWeight:700,color:ch.langColor,background:`${ch.langColor}14`,border:`1px solid ${ch.langColor}28`,padding:"2px 8px",borderRadius:4}}>{LANG_MAP[ch.lang]||ch.lang}</span>
              <span style={{fontFamily:"'Syne',sans-serif",fontSize:10.5,fontWeight:700,color:DIFF_COLOR[ch.difficulty],textTransform:"capitalize"}}>{ch.difficulty}</span>
              <span style={{display:"flex",alignItems:"center",gap:3,fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:T.amber,marginLeft:"auto"}}><Star size={11} fill={T.amber} color={T.amber}/>{ch.xp} XP</span>
            </div>
            <h2 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:19,color:T.t1,margin:0}}>{ch.title}</h2>
          </div>
          <button onClick={onClose} style={{width:28,height:28,borderRadius:"50%",background:T.hover,border:`1px solid ${T.b2}`,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:T.t2}}><XCircle size={13}/></button>
        </div>

        <div style={{display:"flex",gap:0,minHeight:420}}>
          {/* Left: problem */}
          <div style={{width:"42%",flexShrink:0,padding:"20px",borderRight:`1px solid ${T.b1}`,display:"flex",flexDirection:"column",gap:16}}>
            <div>
              <p style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:11,color:T.t3,letterSpacing:"1.2px",textTransform:"uppercase",marginBottom:10}}>Problem</p>
              <pre style={{fontFamily:"'Lora',serif",fontSize:13.5,color:T.t2,lineHeight:1.78,whiteSpace:"pre-wrap",margin:0}}>{ch.description}</pre>
            </div>
            <div>
              <button onClick={()=>setHint(h=>!h)} style={{display:"flex",alignItems:"center",gap:5,fontFamily:"'Syne',sans-serif",fontSize:12.5,fontWeight:600,color:T.amber,background:`${T.amber}0e`,border:`1px solid ${T.amber}28`,borderRadius:7,padding:"5px 12px",cursor:"pointer",width:"100%",transition:"background 0.14s"}}
                onMouseEnter={e=>e.currentTarget.style.background=`${T.amber}18`}
                onMouseLeave={e=>e.currentTarget.style.background=`${T.amber}0e`}>
                {showHint?"Hide hint":"💡 Show hint"}<ChevronDown size={13} style={{marginLeft:"auto",transform:showHint?"rotate(180deg)":"none",transition:"transform 0.18s"}}/>
              </button>
              <AnimatePresence>
                {showHint&&<motion.div initial={{height:0,opacity:0}} animate={{height:"auto",opacity:1}} exit={{height:0,opacity:0}} style={{overflow:"hidden"}}>
                  <p style={{fontFamily:"'Lora',serif",fontStyle:"italic",fontSize:13,color:T.t2,lineHeight:1.65,padding:"10px 12px",background:T.panel,borderRadius:"0 0 8px 8px",marginTop:4}}>{ch.hint}</p>
                </motion.div>}
              </AnimatePresence>
            </div>
            {/* Test results */}
            {results&&(
              <div>
                <p style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:11,color:T.t3,letterSpacing:"1.2px",textTransform:"uppercase",marginBottom:8}}>Test Results</p>
                {results.map((r,i)=>(
                  <div key={i} style={{display:"flex",alignItems:"center",gap:7,padding:"8px 10px",borderRadius:8,border:`1px solid ${r.pass?T.green+"44":T.red+"44"}`,background:r.pass?`${T.green}08`:`${T.red}08`,marginBottom:6}}>
                    {r.pass?<CheckCircle2 size={13} color={T.green}/>:<XCircle size={13} color={T.red}/>}
                    <div style={{flex:1,minWidth:0}}>
                      <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10.5,color:r.pass?T.green:T.red,margin:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>Test {i+1}: {r.pass?"Passed":"Failed"}</p>
                      {!r.pass&&<p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:T.t3,margin:0}}>Got: {r.actual}</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}
            {allPass&&<div style={{padding:"12px 14px",background:`${T.green}10`,border:`1px solid ${T.green}30`,borderRadius:10,textAlign:"center"}}>
              <p style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:15,color:T.green,margin:0}}>🎉 All tests passed! +{ch.xp} XP</p>
            </div>}
          </div>

          {/* Right: editor */}
          <div style={{flex:1,display:"flex",flexDirection:"column"}}>
            <div style={{background:T.panel,padding:"9px 16px",borderBottom:`1px solid ${T.b1}`,display:"flex",alignItems:"center",gap:6}}>
              <div style={{display:"flex",gap:5}}>{["#f47067","#f9c74f","#6fcf97"].map((c,i)=><div key={i} style={{width:9,height:9,borderRadius:"50%",background:c}}/>)}</div>
              <span style={{flex:1,textAlign:"center",fontSize:11,color:T.t3,fontFamily:"'JetBrains Mono',monospace"}}>{ch.lang} editor</span>
              <button onClick={()=>setCode(ch.starter)} style={{background:"transparent",border:"none",cursor:"pointer",color:T.t3,display:"flex",alignItems:"center",gap:4,fontSize:11,fontFamily:"'JetBrains Mono',monospace"}}><RotateCcw size={11}/>reset</button>
            </div>
            <textarea ref={ta} value={code} onChange={e=>setCode(e.target.value)}
              spellCheck={false}
              style={{flex:1,background:T.deep,color:T.t2,fontFamily:"'JetBrains Mono',monospace",fontSize:13,padding:"16px 18px",border:"none",outline:"none",resize:"none",lineHeight:1.72,minHeight:220}}/>
            <div style={{padding:"12px 16px",borderTop:`1px solid ${T.b1}`,display:"flex",gap:8,alignItems:"center"}}>
              <button onClick={run} disabled={running}
                style={{display:"flex",alignItems:"center",gap:7,padding:"9px 20px",borderRadius:9,border:"none",background:T.acc,color:"#fff",fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:13.5,cursor:running?"not-allowed":"pointer",opacity:running?0.7:1,transition:"all 0.16s"}}>
                {running?<motion.div animate={{rotate:360}} transition={{duration:0.7,repeat:Infinity,ease:"linear"}} style={{width:14,height:14,borderRadius:"50%",border:"2px solid rgba(255,255,255,0.3)",borderTop:"2px solid #fff"}}/>:<Play size={13}/>}
                {running?"Running…":"Run Tests"}
              </button>
              <button onClick={()=>setSol(s=>!s)}
                style={{display:"flex",alignItems:"center",gap:6,padding:"9px 16px",borderRadius:9,border:`1px solid ${T.b2}`,background:"transparent",color:T.t2,fontFamily:"'Syne',sans-serif",fontWeight:600,fontSize:13,cursor:"pointer",transition:"all 0.15s"}}
                onMouseEnter={e=>e.currentTarget.style.background=T.hover}
                onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                {showSol?<EyeOff size={13}/>:<Eye size={13}/>}{showSol?"Hide solution":"View solution"}
              </button>
            </div>
            <AnimatePresence>
              {showSol&&<motion.div initial={{height:0}} animate={{height:"auto"}} exit={{height:0}} style={{overflow:"hidden",borderTop:`1px solid ${T.b1}`}}>
                <pre style={{padding:"14px 18px",fontFamily:"'JetBrains Mono',monospace",fontSize:12.5,color:T.teal,background:T.deep,margin:0,whiteSpace:"pre-wrap"}}>{ch.solution}</pre>
              </motion.div>}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ── MAIN ── */
export default function Exercises() {
  const T = useTheme();
  const [filterLang,setLang]   = useState("all");
  const [filterDiff,setDiff]   = useState("all");
  const [open,setOpen]         = useState(null);
  const [solved,setSolved]     = useState(()=>{try{return JSON.parse(localStorage.getItem("cj-solved")||"{}");}catch{return {};}});
  const [totalXp,setXp]        = useState(()=>{try{return parseInt(localStorage.getItem("cj-xp")||"0");}catch{return 0;}});

  const handleSolve = (id,xp) => {
    if(solved[id])return;
    const ns={...solved,[id]:true};
    setSolved(ns);
    const nx=totalXp+xp;
    setXp(nx);
    try{localStorage.setItem("cj-solved",JSON.stringify(ns));localStorage.setItem("cj-xp",String(nx));}catch(e){}
  };

  const langs = [...new Set(CHALLENGES.map(c=>c.lang))];
  const filtered = CHALLENGES.filter(c=>(filterLang==="all"||c.lang===filterLang)&&(filterDiff==="all"||c.difficulty===filterDiff));
  const solvedCount = Object.keys(solved).length;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600&family=Syne:wght@400;500;600;700;800&family=Lora:ital,wght@0,400;0,500;1,400;1,500&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        body{background:${T.shell};}
        ::-webkit-scrollbar{width:5px;}::-webkit-scrollbar-thumb{background:${T.hover};border-radius:3px;}
        ::selection{background:rgba(124,110,224,0.25);}
        @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
      `}</style>
      <div style={{minHeight:"100vh",background:T.shell,color:T.t1,fontFamily:"'Syne',sans-serif"}}>

        {/* HERO */}
        <div style={{background:T.deep,borderBottom:`1px solid ${T.b1}`,padding:"96px 24px 52px",position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",inset:0,backgroundImage:`linear-gradient(${T.b1} 1px,transparent 1px),linear-gradient(90deg,${T.b1} 1px,transparent 1px)`,backgroundSize:"48px 48px",maskImage:"radial-gradient(ellipse 70% 70% at 50% 40%,black 20%,transparent 100%)",pointerEvents:"none"}}/>
          <div style={{position:"absolute",left:"50%",top:"50%",transform:"translate(-50%,-50%)",width:600,height:400,borderRadius:"50%",background:`radial-gradient(ellipse,${T.acc}1c 0%,transparent 70%)`,filter:"blur(50px)",pointerEvents:"none"}}/>
          <div style={{maxWidth:1000,margin:"0 auto",position:"relative"}}>
            <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} style={{display:"inline-flex",alignItems:"center",gap:7,padding:"4px 14px",borderRadius:100,background:`${T.acc}14`,border:`1px solid ${T.acc}40`,marginBottom:18}}>
              <Code2 size={12} color={T.acc}/>
              <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,fontWeight:700,color:T.acc,letterSpacing:"2px",textTransform:"uppercase"}}>Practice</span>
            </motion.div>
            <motion.h1 initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:0.08}} style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:"clamp(32px,5.5vw,56px)",lineHeight:1.07,letterSpacing:"-1.2px",marginBottom:14,color:T.t1}}>
              Write code.<br/><span style={{color:T.acc}}>Get better.</span>
            </motion.h1>
            <motion.p initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:0.14}} style={{fontFamily:"'Lora',serif",fontStyle:"italic",fontSize:"clamp(14px,2vw,17px)",color:T.t2,lineHeight:1.82,maxWidth:480,marginBottom:28}}>
              Challenges tied to each track. Run real test cases, reveal hints, check solutions. Every solved challenge earns XP.
            </motion.p>
            {/* Stats */}
            <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.2}} style={{display:"flex",gap:16,flexWrap:"wrap"}}>
              {[{icon:Trophy,color:T.acc,label:"Solved",val:`${solvedCount}/${CHALLENGES.length}`},{icon:Flame,color:T.amber,label:"XP Earned",val:totalXp},{icon:Zap,color:T.teal,label:"Challenges",val:CHALLENGES.length}].map(s=>(
                <div key={s.label} style={{display:"flex",alignItems:"center",gap:9,padding:"10px 16px",background:T.panel,border:`1px solid ${T.b1}`,borderRadius:11}}>
                  <s.icon size={16} color={s.color}/>
                  <div>
                    <p style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:18,color:s.color,margin:0,lineHeight:1}}>{s.val}</p>
                    <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9.5,color:T.t3,margin:0}}>{s.label}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* FILTERS */}
        <div style={{background:T.deep,borderBottom:`1px solid ${T.b1}`,padding:"0 24px",position:"sticky",top:60,zIndex:40,backdropFilter:"blur(16px)"}}>
          <div style={{maxWidth:1000,margin:"0 auto",height:48,display:"flex",alignItems:"center",gap:8,overflowX:"auto"}}>
            <Filter size={13} color={T.t3}/>
            {/* Language filter */}
            {["all",...langs].map(l=>{
              const active=filterLang===l;
              return <button key={l} onClick={()=>setLang(l)}
                style={{padding:"4px 12px",borderRadius:7,border:`1px solid ${active?T.acc+"44":T.b1}`,background:active?`${T.acc}14`:"transparent",color:active?T.acc:T.t2,fontFamily:"'Syne',sans-serif",fontWeight:active?700:500,fontSize:12.5,cursor:"pointer",flexShrink:0,transition:"all 0.14s"}}>
                {l==="all"?"All":LANG_MAP[l]||l}
              </button>;
            })}
            <div style={{width:1,height:20,background:T.b2,flexShrink:0}}/>
            {["all","easy","medium","hard"].map(d=>{
              const active=filterDiff===d;
              const c=d==="all"?T.acc:DIFF_COLOR[d];
              return <button key={d} onClick={()=>setDiff(d)}
                style={{padding:"4px 12px",borderRadius:7,border:`1px solid ${active?c+"44":T.b1}`,background:active?`${c}14`:"transparent",color:active?c:T.t2,fontFamily:"'Syne',sans-serif",fontWeight:active?700:500,fontSize:12.5,cursor:"pointer",flexShrink:0,transition:"all 0.14s",textTransform:"capitalize"}}>
                {d}
              </button>;
            })}
            <span style={{marginLeft:"auto",fontFamily:"'JetBrains Mono',monospace",fontSize:10.5,color:T.t3,flexShrink:0}}>{filtered.length} challenges</span>
          </div>
        </div>

        {/* GRID */}
        <div style={{maxWidth:1000,margin:"0 auto",padding:"36px 24px 80px"}}>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:14}}>
            <AnimatePresence mode="popLayout">
              {filtered.map(ch=>(
                <ChallengeCard key={ch.id} ch={ch} onOpen={setOpen} solved={!!solved[ch.id]} T={T}/>
              ))}
            </AnimatePresence>
          </div>
          {filtered.length===0&&<div style={{textAlign:"center",padding:"60px 0",color:T.t3,fontFamily:"'Syne',sans-serif"}}>No challenges match this filter.</div>}
        </div>

        {/* MODAL */}
        <AnimatePresence>
          {open&&<ChallengeModal ch={open} onClose={()=>setOpen(null)} onSolve={handleSolve} solved={!!solved[open.id]} T={T}/>}
        </AnimatePresence>
      </div>
    </>
  );
}