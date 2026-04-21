/**
 * Glossary.jsx  →  /glossary
 * Every technical term explained in plain English.
 * Searchable, alphabetically grouped, anchor links.
 */
import React,{useState,useEffect,useMemo,useRef}from"react";
import{motion}from"framer-motion";
import{Hash,Search,X}from"lucide-react";

const PT={cosmos:{shell:"#07080d",deep:"#0c0e18",mid:"#111420",surface:"#161927",panel:"#1a1e2e",hover:"#1e2335",card:"#161927",cardH:"#1c2235",t1:"#e8eaf2",t2:"#8892b0",t3:"#5a6488",t4:"#2e3660",b1:"rgba(120,130,180,0.08)",b2:"rgba(120,130,180,0.15)",b3:"rgba(120,130,180,0.24)",acc:"#7c6ee0",teal:"#5eead4",green:"#22c55e",red:"#f87171",amber:"#fbbf24",dark:true},void:{shell:"#000",deep:"#050507",mid:"#0a0a0f",surface:"#0f0f15",panel:"#141419",hover:"#1a1a22",card:"#0f0f15",cardH:"#161622",t1:"#f0f0ff",t2:"#9090b8",t3:"#505070",t4:"#252540",b1:"rgba(100,100,200,0.08)",b2:"rgba(100,100,200,0.14)",b3:"rgba(100,100,200,0.22)",acc:"#8b7ff0",teal:"#2dd4bf",green:"#34d399",red:"#fc8181",amber:"#fcd34d",dark:true},aurora:{shell:"#040e0e",deep:"#071414",mid:"#0b1c1c",surface:"#102424",panel:"#142a2a",hover:"#1a3333",card:"#102424",cardH:"#162e2e",t1:"#e0f5f5",t2:"#7ab8b8",t3:"#3d7878",t4:"#1e4444",b1:"rgba(80,200,180,0.08)",b2:"rgba(80,200,180,0.15)",b3:"rgba(80,200,180,0.24)",acc:"#2dd4bf",teal:"#5eead4",green:"#4ade80",red:"#f87171",amber:"#fbbf24",dark:true},nord:{shell:"#1a1f2e",deep:"#1e2535",mid:"#232c40",surface:"#28334a",panel:"#2d3a50",hover:"#344260",card:"#28334a",cardH:"#2e3d55",t1:"#eceff4",t2:"#9ba8c0",t3:"#5c6a88",t4:"#3a4560",b1:"rgba(136,192,208,0.1)",b2:"rgba(136,192,208,0.18)",b3:"rgba(136,192,208,0.28)",acc:"#88c0d0",teal:"#8fbcbb",green:"#a3be8c",red:"#bf616a",amber:"#ebcb8b",dark:true},light:{shell:"#f3f4f8",deep:"#fff",mid:"#f0f1f7",surface:"#fff",panel:"#f7f8fc",hover:"#eef0f8",card:"#fff",cardH:"#f5f6fc",t1:"#111827",t2:"#4b5680",t3:"#7c87a8",t4:"#c5ccdf",b1:"rgba(80,90,150,0.08)",b2:"rgba(80,90,150,0.15)",b3:"rgba(80,90,150,0.24)",acc:"#6256d0",teal:"#0d9488",green:"#16a34a",red:"#dc2626",amber:"#d97706",dark:false}};
const getT=()=>{try{return PT[localStorage.getItem("cj-theme")]||PT.cosmos;}catch{return PT.cosmos;}};
function useTheme(){const[T,setT]=useState(getT);useEffect(()=>{const iv=setInterval(()=>{const f=getT();if(f.acc!==T.acc)setT(f);},500);return()=>clearInterval(iv);},[T]);useEffect(()=>{const fn=()=>setT(getT());window.addEventListener("storage",fn);return()=>window.removeEventListener("storage",fn);},[]);return T;}

const TERMS = [
  {term:"API",           cat:"web",   def:"Application Programming Interface. A way for two pieces of software to talk to each other. When your weather app shows the current temperature, it's calling a weather API to get that data. You send a request to a URL, you get back structured data (usually JSON)."},
  {term:"Array",         cat:"core",  def:"An ordered collection of values stored in a single variable. In JavaScript: [1, 2, 3]. In Python: [1, 2, 3]. Arrays are zero-indexed — the first element is at index 0."},
  {term:"Async / Await", cat:"core",  def:"A way to write code that waits for slow operations (like fetching data from a server) without freezing the entire program. async marks a function as asynchronous. await pauses inside that function until a Promise resolves. The page stays responsive while waiting."},
  {term:"Boolean",       cat:"core",  def:"A value that is either true or false. Named after mathematician George Boole. Used in if statements, filters, and toggles. In JavaScript, values like 0, '', null, undefined, and NaN are 'falsy' — they behave like false in conditionals."},
  {term:"Callback",      cat:"core",  def:"A function you pass as an argument to another function, to be called later. 'Call me back when you're done.' button.addEventListener('click', callback). Before async/await, callbacks were how all async code was written, leading to 'callback hell'."},
  {term:"Closure",       cat:"js",    def:"A function that 'closes over' the variables in its surrounding scope — it remembers them even after the outer function has finished running. Example: a counter function that returns increment/decrement functions which share the same private count variable."},
  {term:"Component",     cat:"react", def:"A reusable, self-contained piece of UI. In React, a component is a function that takes props and returns JSX. In Flutter, everything is a widget — a type of component. Think of components like LEGO bricks: you build small reusable pieces and assemble them into screens."},
  {term:"CSS",           cat:"web",   def:"Cascading Style Sheets. The language that styles HTML — colours, fonts, spacing, layout, animations. 'Cascading' means later rules override earlier ones. Flexbox and Grid are CSS's two main layout systems."},
  {term:"Compile",       cat:"core",  def:"Converting source code you write (TypeScript, Kotlin, Swift) into something a machine or runtime can execute. TypeScript compiles to JavaScript. Kotlin compiles to JVM bytecode or native code. Interpreted languages like Python don't need a compile step — they run line by line."},
  {term:"DOM",           cat:"web",   def:"Document Object Model. The browser's tree-shaped representation of your HTML. When JavaScript does document.querySelector('#btn'), it's navigating this tree. React and Flutter build their own virtual versions of this tree to update only what changed."},
  {term:"Dependency",    cat:"core",  def:"External code your project relies on. Installed with npm (JavaScript), pip (Python), or pub (Dart). A package.json or pubspec.yaml lists all your dependencies. node_modules or .dart_tool contains the installed code."},
  {term:"Event",         cat:"web",   def:"Something that happens in the browser — a click, scroll, key press, form submit. You listen for events with addEventListener. Events bubble up the DOM tree unless you call event.stopPropagation()."},
  {term:"Fetch API",     cat:"web",   def:"A browser built-in for making HTTP requests. fetch('/api/data') returns a Promise. You await it, then call .json() to parse the response body. Always wrap in try/catch to handle network errors."},
  {term:"Function",      cat:"core",  def:"A reusable block of code that takes inputs (parameters) and produces an output (return value). Functions are the core unit of reuse in programming. In JavaScript, functions are 'first-class' — you can pass them as arguments, return them from other functions, and store them in variables."},
  {term:"Git",           cat:"tools", def:"A version control system that tracks changes to your code over time. git add, git commit, git push, git pull. GitHub stores your git repos in the cloud. Branching lets multiple people work on the same project without overwriting each other's changes."},
  {term:"Hook",          cat:"react", def:"A React function that lets you use state and lifecycle features inside function components. useState, useEffect, useRef, useCallback, useMemo are built-in hooks. The rules: only call hooks at the top level of your component, never inside loops or conditions."},
  {term:"HTML",          cat:"web",   def:"HyperText Markup Language. The structure of every webpage — headings, paragraphs, links, images, forms. Not a programming language — it's a markup language. You describe what elements are (<h1> means 'main heading') but not what they do or look like."},
  {term:"HTTP",          cat:"web",   def:"HyperText Transfer Protocol. The language of the web. Every time you open a page or call an API, your browser sends an HTTP request (GET, POST, PUT, DELETE) and the server sends back a response with a status code (200 = OK, 404 = Not Found, 500 = Server Error)."},
  {term:"Interface",     cat:"ts",    def:"In TypeScript, a named type that describes the shape of an object. interface User { id: number; name: string }. In object-oriented languages, an interface defines what methods a class must implement, without specifying how."},
  {term:"JSON",          cat:"core",  def:"JavaScript Object Notation. A text format for storing and transferring structured data. { \"name\": \"Alex\", \"age\": 30 }. APIs return JSON. JSON.parse() converts a JSON string to a JavaScript object. JSON.stringify() converts back."},
  {term:"Library",       cat:"core",  def:"Pre-written code you can import and use. React is a library (just the UI layer). Libraries are more focused than frameworks. You call library code. The framework calls your code (inversion of control)."},
  {term:"Middleware",    cat:"web",   def:"Functions that run between an HTTP request arriving and your route handler responding. Used for: authentication, logging, parsing request bodies, rate limiting. In Express: app.use(middleware). Order matters."},
  {term:"Module",        cat:"core",  def:"A file (or group of files) that exports functions, classes, or values for other files to use. import { greet } from './utils.js' in JavaScript. from utils import greet in Python. Modules are how you split large codebases into maintainable pieces."},
  {term:"Null / Undefined",cat:"core",def:"Two ways to represent 'nothing'. null is intentional absence — you explicitly set it. undefined is accidental absence — a variable declared but not assigned. TypeScript's null safety forces you to handle both before using a value."},
  {term:"Object",        cat:"core",  def:"A collection of key-value pairs. { name: 'Alex', age: 30 }. Objects can contain any type of value including other objects and arrays. In JavaScript, almost everything is an object — arrays, functions, dates."},
  {term:"Promise",       cat:"js",    def:"An object representing a future value that may not exist yet. Pending → Fulfilled (with a value) or Rejected (with an error). fetch() returns a Promise. You resolve it with .then().catch() or async/await."},
  {term:"Props",         cat:"react", def:"Short for properties — data you pass into a React component from its parent. <UserCard name='Alex' role='admin' />. The component receives props as a function argument and uses them to render. Props are read-only — a child never modifies them."},
  {term:"Recursion",     cat:"core",  def:"A function that calls itself. Used when a problem can be broken into smaller versions of itself — flattening nested arrays, traversing a tree, calculating fibonacci. Always needs a base case to stop. Without it: infinite recursion → stack overflow."},
  {term:"REST API",      cat:"web",   def:"Representational State Transfer — an architectural style for APIs. Use HTTP verbs: GET to read, POST to create, PUT/PATCH to update, DELETE to remove. Responses are usually JSON. Stateless — each request is independent."},
  {term:"State",         cat:"react", def:"Data that belongs to a component and causes it to re-render when changed. In React: const [count, setCount] = useState(0). You never mutate state directly — you call the setter function and React re-renders. State flows down; events flow up."},
  {term:"Scope",         cat:"core",  def:"Where a variable is accessible. Block scope: inside {} curly braces (let, const). Function scope: inside the function (var). Global scope: everywhere. Closures let inner functions access outer scope variables even after the outer function returns."},
  {term:"Type",          cat:"ts",    def:"A label that tells the compiler what kind of value a variable holds — string, number, boolean, or complex types like User[]. TypeScript's type system catches bugs at compile time by enforcing that you use values correctly."},
  {term:"useState",      cat:"react", def:"A React hook for adding state to a function component. const [value, setValue] = useState(initialValue). When setValue is called, React re-renders the component with the new value. The initial value is only used on the first render."},
  {term:"useEffect",     cat:"react", def:"A React hook for running side effects (fetch data, set up subscriptions, update the document title) after render. The dependency array [] controls when it re-runs. An empty [] runs once on mount. A cleanup function prevents memory leaks."},
  {term:"Virtual DOM",   cat:"react", def:"React's in-memory representation of the actual DOM. When state changes, React rebuilds the virtual DOM, diffs it against the previous version, and updates only the changed parts in the real DOM. Much faster than updating the whole page."},
  {term:"Widget",        cat:"app",   def:"Flutter's fundamental building block — equivalent to a React component. Everything in Flutter is a widget: layout (Column, Row), styling (Padding, Container), interaction (GestureDetector), and even the whole screen (Scaffold). Widgets are composable and immutable."},
  {term:"npm",           cat:"tools", def:"Node Package Manager. The tool for installing JavaScript libraries. npm install react installs React and adds it to package.json. node_modules contains all installed packages. Never commit node_modules to git — use npm install to regenerate it."},
  {term:"pip",           cat:"tools", def:"Python's package installer. pip install pandas installs Pandas. requirements.txt lists all dependencies. Always use a virtual environment (python -m venv venv) so packages don't conflict between projects."},
  {term:"REST",          cat:"web",   def:"See REST API."},
  {term:"SQL",           cat:"data",  def:"Structured Query Language. The language for talking to relational databases. SELECT * FROM users WHERE active = true. Has been the standard since the 1970s and is used in every company that has data (every company)."},
  {term:"Null Safety",   cat:"app",   def:"A language feature (Dart, TypeScript, Kotlin, Swift) that makes the compiler enforce that you handle the case where a value might be absent. String? name means it might be null. String name means it is guaranteed non-null. Eliminates entire category of null-reference crashes."},
  {term:"Framework",     cat:"core",  def:"A bigger structure than a library — it provides the skeleton of your app and calls your code at the right times. Flutter is a framework (it controls the rendering loop). Express is a minimal framework. The framework dictates the architecture."},
  {term:"Coroutine",     cat:"app",   def:"Kotlin's lightweight concurrency primitive. Like a thread but much cheaper. viewModelScope.launch { } starts a coroutine. suspend fun makes a function pauseable without blocking a thread. Conceptually similar to JavaScript's async/await."},
  {term:"ORM",           cat:"web",   def:"Object-Relational Mapper. Translates between your programming language's objects and database rows. Prisma (JS/TS), SQLAlchemy (Python), Room (Android). Instead of writing SQL, you write: prisma.user.findMany({ where: { active: true } })."},
  {term:"JWT",           cat:"web",   def:"JSON Web Token. A signed string that proves who you are. Created on login, sent with every future request in the Authorization header. The server verifies the signature — no database lookup needed. Has an expiry time. Never put sensitive data in it."},
  {term:"CI/CD",         cat:"tools", def:"Continuous Integration / Continuous Deployment. Automatically run tests and deploy your app whenever you push code. GitHub Actions is the most common tool. Every push triggers: lint → test → build → deploy. Removes the 'it works on my machine' problem."},
];

export default function Glossary() {
  const T = useTheme();
  const [q,setQ] = useState("");

  const filtered = useMemo(()=>{
    if(!q.trim()) return TERMS;
    const low=q.toLowerCase();
    return TERMS.filter(t=>t.term.toLowerCase().includes(low)||t.def.toLowerCase().includes(low));
  },[q]);

  const grouped = useMemo(()=>{
    const g = {};
    filtered.forEach(t=>{
      const letter = t.term[0].toUpperCase();
      if(!g[letter])g[letter]=[];
      g[letter].push(t);
    });
    return Object.entries(g).sort((a,b)=>a[0].localeCompare(b[0]));
  },[filtered]);

  const alphabet = [...new Set(TERMS.map(t=>t.term[0].toUpperCase()))].sort();
  const CAT_COLOR = {web:T.acc,core:"#60a5fa",react:"#61dafb",app:"#5eead4",data:"#f472b6",ts:"#60a5fa",js:"#f7df1e",tools:"#fbbf24"};

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600&family=Syne:wght@400;500;600;700;800&family=Lora:ital,wght@0,400;0,500;1,400;1,500&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        body{background:${T.shell};}
        ::-webkit-scrollbar{width:5px;}::-webkit-scrollbar-thumb{background:${T.hover};border-radius:3px;}
        ::selection{background:rgba(124,110,224,0.25);}
        .gl-term{scroll-margin-top:80px;}
        @media(max-width:800px){.gl-alpha{display:none!important;}}
      `}</style>
      <div style={{minHeight:"100vh",background:T.shell,color:T.t1,fontFamily:"'Syne',sans-serif"}}>

        {/* HERO */}
        <div style={{background:T.deep,borderBottom:`1px solid ${T.b1}`,padding:"96px 24px 52px",position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",inset:0,backgroundImage:`linear-gradient(${T.b1} 1px,transparent 1px),linear-gradient(90deg,${T.b1} 1px,transparent 1px)`,backgroundSize:"48px 48px",maskImage:"radial-gradient(ellipse 70% 70% at 50% 40%,black 20%,transparent 100%)",pointerEvents:"none"}}/>
          <div style={{maxWidth:700,margin:"0 auto",position:"relative",textAlign:"center"}}>
            <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} style={{display:"inline-flex",alignItems:"center",gap:7,padding:"4px 14px",borderRadius:100,background:`${T.acc}14`,border:`1px solid ${T.acc}40`,marginBottom:18}}>
              <Hash size={12} color={T.acc}/>
              <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,fontWeight:700,color:T.acc,letterSpacing:"2px",textTransform:"uppercase"}}>Glossary</span>
            </motion.div>
            <motion.h1 initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} transition={{delay:0.08}} style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:"clamp(30px,5vw,50px)",lineHeight:1.07,letterSpacing:"-1px",marginBottom:12,color:T.t1}}>
              Every term,<br/><span style={{color:T.acc}}>plain English.</span>
            </motion.h1>
            <motion.p initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:0.14}} style={{fontFamily:"'Lora',serif",fontStyle:"italic",fontSize:16,color:T.t2,lineHeight:1.75,marginBottom:28}}>{TERMS.length} terms defined. No jargon in the definitions.</motion.p>
            {/* Search */}
            <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.18}} style={{position:"relative",maxWidth:480,margin:"0 auto"}}>
              <Search size={16} color={T.t3} style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",pointerEvents:"none"}}/>
              <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search terms…"
                style={{width:"100%",background:T.surface||T.card,border:`1.5px solid ${q?T.acc+"77":T.b2}`,borderRadius:11,padding:"12px 40px 12px 42px",fontFamily:"'Syne',sans-serif",fontSize:15,color:T.t1,outline:"none",transition:"border 0.16s"}}/>
              {q&&<button onClick={()=>setQ("")} style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:T.t3}}><X size={14}/></button>}
            </motion.div>
          </div>
        </div>

        <div style={{maxWidth:1000,margin:"0 auto",padding:"0 24px",display:"flex",alignItems:"flex-start",gap:0}}>
          {/* Alpha sidebar */}
          <aside className="gl-alpha" style={{width:44,flexShrink:0,position:"sticky",top:70,alignSelf:"flex-start",paddingTop:36,paddingRight:12,display:"flex",flexDirection:"column",gap:2}}>
            {alphabet.map(l=>(
              <a key={l} href={`#letter-${l}`} style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,fontWeight:700,color:T.t3,textDecoration:"none",padding:"2px 6px",borderRadius:5,transition:"all 0.13s",textAlign:"center"}}
                onMouseEnter={e=>{e.currentTarget.style.background=T.hover;e.currentTarget.style.color=T.acc;}}
                onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.color=T.t3;}}>{l}</a>
            ))}
          </aside>

          {/* Terms */}
          <main style={{flex:1,paddingTop:36,paddingBottom:80}}>
            {grouped.map(([letter,terms])=>(
              <div key={letter} id={`letter-${letter}`} style={{marginBottom:40,scrollMarginTop:80}}>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:18}}>
                  <span style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:28,color:T.acc,lineHeight:1,flexShrink:0}}>{letter}</span>
                  <div style={{flex:1,height:1,background:`linear-gradient(to right,${T.b2},transparent)`}}/>
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:10}}>
                  {terms.map(t=>{
                    const color = CAT_COLOR[t.cat]||T.acc;
                    return (
                      <div key={t.term} id={t.term.toLowerCase().replace(/[^a-z]/g,"-")} className="gl-term"
                        style={{padding:"16px 20px",borderRadius:13,border:`1px solid ${T.b1}`,background:T.card,borderLeft:`3px solid ${color}`}}>
                        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:7}}>
                          <h3 style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:16,color:T.t1,margin:0}}>{t.term}</h3>
                          <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9.5,fontWeight:700,color,background:`${color}14`,border:`1px solid ${color}28`,padding:"1px 7px",borderRadius:100,textTransform:"uppercase",letterSpacing:"0.5px"}}>{t.cat}</span>
                        </div>
                        <p style={{fontFamily:"'Lora',serif",fontSize:14.5,color:T.t2,lineHeight:1.78,margin:0}}>{t.def}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
            {grouped.length===0&&<div style={{textAlign:"center",padding:"60px 0",color:T.t3,fontFamily:"'Syne',sans-serif"}}>No terms found.</div>}
          </main>
        </div>
      </div>
    </>
  );
}