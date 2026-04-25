/**
 * Code Journey - Languages Page
 * Three tracks: Web Dev · App Dev · Data Science
 * Each with language cards, sub-topic chips, and a live "what you'll build" preview
 */

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import {
  Globe, Smartphone, BarChart2, ArrowRight, Code2, Zap,
  ChevronRight, Play, Star, Clock, Layers, Terminal,
  BookOpen, Sparkles, CheckCircle2, Lock, Cpu, Database,
  TrendingUp, Package, Paintbrush, Server, Shield, Brain,
} from "lucide-react";

/* ══════════════════════════════════════════════════════════════
   THEME
══════════════════════════════════════════════════════════════ */
const THEMES = {
  cosmos:{ shell:"#07080d",deep:"#0c0e18",mid:"#111420",surface:"#161927",panel:"#1a1e2e",hover:"#1e2335",card:"#161927",t1:"#e8eaf2",t2:"#8892b0",t3:"#5a6488",t4:"#2e3660",b1:"rgba(120,130,180,0.08)",b2:"rgba(120,130,180,0.15)",b3:"rgba(120,130,180,0.24)",accent:"#7c6ee0",accentS:"rgba(124,110,224,0.14)",teal:"#5eead4",green:"#22c55e",red:"#f87171",gold:"#fbbf24" },
  void:{ shell:"#000",deep:"#050507",mid:"#0a0a0f",surface:"#0f0f15",panel:"#141419",hover:"#1a1a22",card:"#0f0f15",t1:"#f0f0ff",t2:"#9090b8",t3:"#505070",t4:"#252540",b1:"rgba(100,100,200,0.08)",b2:"rgba(100,100,200,0.14)",b3:"rgba(100,100,200,0.22)",accent:"#8b7ff0",accentS:"rgba(139,127,240,0.14)",teal:"#2dd4bf",green:"#34d399",red:"#fc8181",gold:"#fcd34d" },
  aurora:{ shell:"#040e0e",deep:"#071414",mid:"#0b1c1c",surface:"#102424",panel:"#142a2a",hover:"#1a3333",card:"#102424",t1:"#e0f5f5",t2:"#7ab8b8",t3:"#3d7878",t4:"#1e4444",b1:"rgba(80,200,180,0.08)",b2:"rgba(80,200,180,0.15)",b3:"rgba(80,200,180,0.24)",accent:"#2dd4bf",accentS:"rgba(45,212,191,0.14)",teal:"#5eead4",green:"#4ade80",red:"#f87171",gold:"#fbbf24" },
  nord:{ shell:"#1a1f2e",deep:"#1e2535",mid:"#232c40",surface:"#28334a",panel:"#2d3a50",hover:"#344260",card:"#28334a",t1:"#eceff4",t2:"#9ba8c0",t3:"#5c6a88",t4:"#3a4560",b1:"rgba(136,192,208,0.1)",b2:"rgba(136,192,208,0.18)",b3:"rgba(136,192,208,0.28)",accent:"#88c0d0",accentS:"rgba(136,192,208,0.14)",teal:"#8fbcbb",green:"#a3be8c",red:"#bf616a",gold:"#ebcb8b" },
  light:{ shell:"#f3f4f8",deep:"#fff",mid:"#f0f1f7",surface:"#fff",panel:"#f7f8fc",hover:"#eef0f8",card:"#fff",t1:"#111827",t2:"#4b5680",t3:"#7c87a8",t4:"#c5ccdf",b1:"rgba(80,90,150,0.08)",b2:"rgba(80,90,150,0.15)",b3:"rgba(80,90,150,0.24)",accent:"#6256d0",accentS:"rgba(98,86,208,0.1)",teal:"#0d9488",green:"#16a34a",red:"#dc2626",gold:"#d97706" },
};
const getTheme=()=>{ try{return THEMES[localStorage.getItem("cj-theme")]||THEMES.light}catch{return THEMES.light} };
const applyToDom=(T)=>{ const r=document.documentElement;[["--cj-shell",T.shell],["--cj-accent",T.accent],["--cj-teal",T.teal],["--cj-t1",T.t1],["--cj-t2",T.t2]].forEach(([k,v])=>r.style.setProperty(k,v)) };
function useTheme(){ const[T,setT]=useState(getTheme);useEffect(()=>{ applyToDom(T);const iv=setInterval(()=>{ const f=getTheme();if(f.accent!==T.accent){setT(f);applyToDom(f)} },500);return()=>clearInterval(iv) },[T]);useEffect(()=>{ const fn=()=>{const f=getTheme();setT(f);applyToDom(f)};window.addEventListener("storage",fn);return()=>window.removeEventListener("storage",fn) },[]);return T }

/* ══════════════════════════════════════════════════════════════
   DATA
══════════════════════════════════════════════════════════════ */
const TRACKS = [
  {
    id:"web",
    label:"Web Development",
    icon:Globe,
    color:"#7c6ee0",
    tint:"rgba(124,110,224,0.1)",
    tagline:"Build what the world sees",
    description:"From a single webpage to a full-stack application - web development is the most immediately visible discipline in software. You write code, refresh a browser, and see results in seconds.",
    youllBuild:["Personal portfolio websites","Interactive to-do and notes apps","REST APIs and backend services","Full-stack web applications"],
    languages:[
      {
        id:"html",name:"HTML",label:"HTML",color:"#f97316",bg:"#1a0a00",
        icon:"‹/›",level:"Foundation",time:"1–2 weeks",
        tagline:"The skeleton of every webpage",
        about:"HTML (HyperText Markup Language) is not a programming language - it is a structure language. It defines the building blocks of every page on the web: headings, paragraphs, images, links, forms. Every website you have ever visited starts here.",
        topics:[
          {name:"Elements & Tags",icon:Code2,desc:"The vocabulary of HTML - headings, paragraphs, divs, spans, images, links and semantic tags like <article>, <section> and <nav>."},
          {name:"Forms & Inputs",icon:Layers,desc:"Collecting user input - text fields, dropdowns, checkboxes, radio buttons and the <form> element that ties them together."},
          {name:"Semantic HTML",icon:BookOpen,desc:"Writing HTML that means something - using the right tag for the right job so browsers, screen readers and search engines all understand your content."},
          {name:"Accessibility",icon:Shield,desc:"Making your pages usable by everyone - ARIA roles, alt text, keyboard navigation and contrast requirements."},
        ],
        snippet:`<!-- A semantic HTML page -->
<header>
  <nav>
    <a href="/">Home</a>
  </nav>
</header>
<main>
  <article>
    <h1>Hello, World</h1>
    <p>This is semantic HTML.</p>
  </article>
</main>`,
      },
      {
        id:"css",name:"CSS",label:"CSS",color:"#818cf8",bg:"#0c0c1a",
        icon:"✦",level:"Foundation",time:"2–3 weeks",
        tagline:"Make it look like something",
        about:"CSS (Cascading Style Sheets) is the design language of the web. It controls colours, fonts, layout, spacing, animations and everything visual. Modern CSS with Flexbox and Grid lets you build any layout without a single line of JavaScript.",
        topics:[
          {name:"Selectors & Specificity",icon:Code2,desc:"Targeting elements precisely - classes, IDs, pseudo-selectors (:hover, :focus, ::before) and understanding the cascade."},
          {name:"Flexbox & Grid",icon:Layers,desc:"The two layout superpowers of modern CSS. Flexbox for one-dimensional layouts; Grid for two-dimensional page structures."},
          {name:"Responsive Design",icon:Smartphone,desc:"Making pages that look good on any screen size - media queries, fluid units (rem, %, vw) and mobile-first strategy."},
          {name:"Animations",icon:Sparkles,desc:"CSS transitions and keyframe animations - bringing interfaces to life without JavaScript."},
        ],
        snippet:`.card {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem;
  border-radius: 12px;
  background: #161927;
  transition: transform 0.2s ease;
}

.card:hover {
  transform: translateY(-4px);
}`,
      },
      {
        id:"javascript",name:"JavaScript",label:"JS",color:"#f7df1e",bg:"#1a1800",
        icon:"JS",level:"Core",time:"4–8 weeks",
        tagline:"Make it do things",
        about:"JavaScript is the only programming language that runs natively in every browser. It makes pages interactive - responding to clicks, fetching data, updating the UI without a reload. It also runs on the server via Node.js, making it the most versatile language in web development.",
        topics:[
          {name:"Variables & Types",icon:Code2,desc:"let, const, var - and why it matters. Primitives: string, number, boolean, null, undefined, Symbol, BigInt."},
          {name:"Functions & Scope",icon:Layers,desc:"Declarations, expressions, arrow functions, closures, and how JavaScript handles the concept of 'where a variable lives'."},
          {name:"DOM Manipulation",icon:Globe,desc:"Selecting, modifying and creating HTML elements with JavaScript - the bridge between code and what users see."},
          {name:"Async / Promises",icon:Zap,desc:"Handling time-delayed operations - callbacks, Promises, async/await, and fetching data from APIs."},
          {name:"ES6+ Features",icon:Sparkles,desc:"Destructuring, spread/rest, template literals, optional chaining, modules - modern JavaScript that reads cleanly."},
        ],
        snippet:`// Fetch data from an API
async function getUser(id) {
  const res = await fetch(
    \`/api/users/\${id}\`
  );
  const { name, email } = await res.json();
  return { name, email };
}

getUser(1).then(console.log);`,
      },
      {
        id:"typescript",name:"TypeScript",label:"TS",color:"#60a5fa",bg:"#00111f",
        icon:"TS",level:"Advanced",time:"2–4 weeks",
        tagline:"JavaScript with a safety net",
        about:"TypeScript adds a static type system on top of JavaScript. It catches bugs before your code runs, makes large codebases navigable, and is now the default choice for professional JavaScript development - used by Microsoft, Google, Airbnb and the teams behind React, Vue and Angular.",
        topics:[
          {name:"Types & Interfaces",icon:Code2,desc:"Defining the shape of data - primitive types, union types, intersection types, and interfaces for object structures."},
          {name:"Generics",icon:Layers,desc:"Writing reusable code that works with any type while remaining type-safe - the most powerful feature in TypeScript."},
          {name:"Classes & OOP",icon:Shield,desc:"TypeScript makes object-oriented patterns explicit - access modifiers (public, private, protected), abstract classes and decorators."},
          {name:"Type Utilities",icon:Sparkles,desc:"Partial, Required, Readonly, Pick, Omit - TypeScript's built-in utility types that transform existing types."},
        ],
        snippet:`interface User {
  id: number;
  name: string;
  email: string;
}

async function getUser(
  id: number
): Promise<User> {
  const res = await fetch(\`/api/users/\${id}\`);
  return res.json() as Promise<User>;
}`,
      },
    ],
  },
  {
    id:"app",
    label:"App Development",
    icon:Smartphone,
    color:"#5eead4",
    tint:"rgba(94,234,212,0.08)",
    tagline:"Ship to a billion pockets",
    description:"App development puts your software on iOS and Android - the devices people carry everywhere. Modern cross-platform frameworks let you write one codebase that runs natively on both.",
    youllBuild:["To-do and productivity apps","Weather and news apps","E-commerce mobile frontends","Cross-platform tools with native performance"],
    languages:[
      {
        id:"dart",name:"Dart",label:"Dart",color:"#5eead4",bg:"#001a17",
        icon:"◈",level:"Foundation",time:"2–3 weeks",
        tagline:"The language Flutter speaks",
        about:"Dart is a modern, strongly-typed language developed by Google. It compiles to native ARM code for mobile and desktop, and to JavaScript for the web. Its clean syntax and strong type system make it genuinely enjoyable to write - and Flutter's hot-reload makes seeing results instant.",
        topics:[
          {name:"Syntax & Types",icon:Code2,desc:"Variables, functions, classes and Dart's type system - null safety by default, which prevents an entire category of runtime crashes."},
          {name:"Collections",icon:Layers,desc:"List, Set and Map - Dart's core data structures and the powerful methods (map, filter, reduce) for transforming them."},
          {name:"Async in Dart",icon:Zap,desc:"Futures, async/await, and Streams - how Dart handles operations that take time without blocking the UI thread."},
          {name:"OOP Principles",icon:Shield,desc:"Classes, inheritance, mixins and interfaces - Dart's object-oriented features that Flutter's widget system is built on."},
        ],
        snippet:`// Null-safe Dart
class User {
  final String name;
  final String? bio; // nullable

  const User({
    required this.name,
    this.bio,
  });
}

Future<User> fetchUser() async {
  await Future.delayed(Duration(seconds: 1));
  return User(name: 'Alex');
}`,
      },
      {
        id:"flutter",name:"Flutter",label:"Flutter",color:"#38bdf8",bg:"#001220",
        icon:"⬡",level:"Core",time:"4–6 weeks",
        tagline:"One codebase, every platform",
        about:"Flutter is Google's UI toolkit for building natively compiled applications for mobile, web and desktop from a single codebase. Everything in Flutter is a Widget - composable, reusable UI building blocks that make UIs feel fluid and consistent across platforms.",
        topics:[
          {name:"Widgets",icon:Layers,desc:"Stateless and Stateful widgets - the two building blocks of every Flutter UI. Understanding how the widget tree renders."},
          {name:"State Management",icon:Brain,desc:"Managing data that changes - setState for simple cases, Provider and Riverpod for larger apps. How Flutter re-renders efficiently."},
          {name:"Navigation",icon:Globe,desc:"Moving between screens - Navigator 2.0, named routes and the GoRouter package for complex navigation patterns."},
          {name:"Networking",icon:Server,desc:"Fetching data from APIs with http and dio packages, parsing JSON, and displaying async data with FutureBuilder."},
          {name:"Animations",icon:Sparkles,desc:"Flutter's animation system - implicit animations (AnimatedContainer), explicit animations (AnimationController) and Hero transitions."},
        ],
        snippet:`// Stateful widget
class Counter extends StatefulWidget {
  const Counter({super.key});
  @override
  State<Counter> createState()
    => _CounterState();
}

class _CounterState extends State<Counter> {
  int _count = 0;

  @override
  Widget build(BuildContext context) {
    return FloatingActionButton(
      onPressed: () =>
        setState(() => _count++),
      child: Text('$_count'),
    );
  }
}`,
      },
      {
        id:"kotlin",name:"Kotlin",label:"Kotlin",color:"#a78bfa",bg:"#0c0c1a",
        icon:"Kt",level:"Advanced",time:"4–6 weeks",
        tagline:"Android's official language",
        about:"Kotlin is the officially preferred language for Android development, created by JetBrains. It eliminates most of Java's verbosity while adding powerful features like coroutines for asynchronous programming, data classes, and null safety. It is concise, expressive, and production-ready.",
        topics:[
          {name:"Kotlin Basics",icon:Code2,desc:"val/var, data classes, when expressions, string templates and the features that make Kotlin dramatically less verbose than Java."},
          {name:"Coroutines",icon:Zap,desc:"Kotlin's approach to async programming - suspending functions, launch/async builders, and Flow for reactive data streams."},
          {name:"Extension Functions",icon:Sparkles,desc:"Adding behaviour to existing classes without inheriting from them - one of Kotlin's most powerful features."},
          {name:"Jetpack Compose",icon:Layers,desc:"Kotlin's declarative UI toolkit for Android - writing UI as composable functions, similar to Flutter's widget model."},
        ],
        snippet:`// Coroutine with Flow
fun numberFlow(): Flow<Int> = flow {
  for (i in 1..10) {
    emit(i)
    delay(100)
  }
}

suspend fun main() {
  numberFlow()
    .filter { it % 2 == 0 }
    .map    { it * it      }
    .collect { println(it) }
}`,
      },
    ],
  },
  {
    id:"data",
    label:"Data Science",
    icon:BarChart2,
    color:"#f472b6",
    tint:"rgba(244,114,182,0.08)",
    tagline:"Find meaning in numbers",
    description:"Data science is the discipline of extracting insight from data. It combines programming, statistics and domain knowledge to answer questions, build predictive models, and inform decisions.",
    youllBuild:["Data dashboards and visualisations","Predictive models for classification and regression","SQL-powered analytics reports","Statistical analyses and research scripts"],
    languages:[
      {
        id:"python-ds",name:"Python",label:"Python",color:"#4ade80",bg:"#0a1f0a",
        icon:"Py",level:"Foundation",time:"3–5 weeks",
        tagline:"The language of data science",
        about:"Python dominates data science because of its ecosystem: NumPy for arrays, Pandas for tabular data, Matplotlib and Seaborn for visualisation, and Scikit-learn for machine learning. Its readable syntax makes complex analysis feel approachable even for beginners.",
        topics:[
          {name:"NumPy",icon:Cpu,desc:"The foundation of Python data science - fast, vectorised array operations that make mathematical computation efficient."},
          {name:"Pandas",icon:Database,desc:"DataFrames for tabular data - loading CSVs, filtering rows, grouping, merging and transforming datasets."},
          {name:"Matplotlib & Seaborn",icon:TrendingUp,desc:"Visualising data - line charts, histograms, scatter plots, heatmaps and customised publication-ready figures."},
          {name:"Scikit-learn",icon:Brain,desc:"Machine learning in Python - linear regression, classification, clustering, train/test splits and model evaluation."},
        ],
        snippet:`import pandas as pd
import matplotlib.pyplot as plt

# Load and explore
df = pd.read_csv('data.csv')
print(df.describe())

# Visualise
df.groupby('category')['value'] \
  .mean() \
  .sort_values() \
  .plot(kind='barh')

plt.title('Mean by Category')
plt.tight_layout()
plt.show()`,
      },
      {
        id:"r",name:"R Language",label:"R",color:"#f472b6",bg:"#1a0011",
        icon:"R",level:"Core",time:"3–5 weeks",
        tagline:"Built for statistics",
        about:"R was designed by statisticians for statisticians. It is the language of academia, biomedical research, economics and any domain where rigorous statistical methodology is required. The tidyverse collection of packages (dplyr, ggplot2, tidyr) makes data manipulation and visualisation elegant.",
        topics:[
          {name:"Vectors & Data Frames",icon:Database,desc:"R's native data structures - vectors, lists, matrices and data frames - and how they map to real-world tabular data."},
          {name:"dplyr & tidyr",icon:Layers,desc:"The tidyverse approach to data manipulation - filter, select, mutate, group_by, summarise, pivot_wider and pivot_longer."},
          {name:"ggplot2",icon:TrendingUp,desc:"The grammar of graphics - building complex, layered visualisations by composing geoms, scales and themes."},
          {name:"Statistical Tests",icon:Brain,desc:"t-tests, ANOVA, chi-squared, correlation - applying real statistical tests to data and interpreting results."},
          {name:"R Markdown",icon:BookOpen,desc:"Combining R code, output and prose in a single reproducible document - the standard for statistical reporting."},
        ],
        snippet:`library(ggplot2)
library(dplyr)

# Load and summarise
df <- read.csv("data.csv")

# Tidy transformation
summary_df <- df |>
  group_by(category) |>
  summarise(mean_val = mean(value))

# Visualise
ggplot(summary_df,
  aes(x = category, y = mean_val)) +
  geom_col(fill = "#f472b6") +
  theme_minimal()`,
      },
      {
        id:"sql",name:"SQL",label:"SQL",color:"#a78bfa",bg:"#0f0a1a",
        icon:"SQL",level:"Foundation",time:"2–3 weeks",
        tagline:"The language databases speak",
        about:"SQL (Structured Query Language) is how you talk to relational databases. Every company that stores data - which is every company - uses SQL somewhere. It is the most universally required skill in data roles and one of the most transferable skills in all of software engineering.",
        topics:[
          {name:"SELECT & Filtering",icon:Database,desc:"The foundation of SQL - retrieving data with SELECT, filtering rows with WHERE, sorting with ORDER BY and limiting with LIMIT."},
          {name:"JOINs",icon:Layers,desc:"Combining data from multiple tables - INNER, LEFT, RIGHT and FULL joins, and when to use each one."},
          {name:"Aggregation",icon:TrendingUp,desc:"GROUP BY, COUNT, SUM, AVG, MIN, MAX - collapsing many rows into summary statistics."},
          {name:"Subqueries & CTEs",icon:Code2,desc:"Writing queries inside queries - subqueries for one-off lookups, and WITH (CTE) for readable, reusable logic."},
          {name:"Window Functions",icon:Sparkles,desc:"ROW_NUMBER, RANK, LAG, LEAD, SUM OVER - computing values across a related set of rows without collapsing them."},
        ],
        snippet:`-- Top 5 customers by revenue
WITH customer_totals AS (
  SELECT
    c.name,
    SUM(o.amount) AS total
  FROM customers c
  JOIN orders o
    ON c.id = o.customer_id
  WHERE o.status = 'completed'
  GROUP BY c.name
)
SELECT *
FROM customer_totals
ORDER BY total DESC
LIMIT 5;`,
      },
    ],
  },
];

/* ══════════════════════════════════════════════════════════════
   COMPONENTS
══════════════════════════════════════════════════════════════ */

/* Animated grid background */
const GridBg = ({ T }) => (
  <div style={{position:"absolute",inset:0,pointerEvents:"none",backgroundImage:`linear-gradient(${T.b1} 1px,transparent 1px),linear-gradient(90deg,${T.b1} 1px,transparent 1px)`,backgroundSize:"52px 52px",maskImage:"radial-gradient(ellipse 80% 60% at 50% 40%,black 30%,transparent 100%)"}}/>
);

/* Reveal wrapper */
const Reveal=({children,delay=0,y=20,x=0})=>(
  <motion.div initial={{opacity:0,y,x}} whileInView={{opacity:1,y:0,x:0}} viewport={{once:true,margin:"-50px"}} transition={{duration:0.55,delay,ease:[0.22,1,0.36,1]}}>
    {children}
  </motion.div>
);

/* Level badge */
const LevelBadge = ({ level, T }) => {
  const cfg = { Foundation:{color:"#22c55e"}, Core:{color:"#7c6ee0"}, Advanced:{color:"#f97316"} };
  const c = cfg[level]?.color || T.t3;
  return (
    <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9.5,fontWeight:700,padding:"2px 8px",borderRadius:4,letterSpacing:"0.5px",background:`${c}16`,color:c,border:`1px solid ${c}30`}}>{level}</span>
  );
};

/* Code snippet window */
const CodeSnippet = ({ code, lang, color, T }) => (
  <div style={{background:T.deep,border:`1px solid ${T.b2}`,borderRadius:12,overflow:"hidden",fontFamily:"'JetBrains Mono',monospace",fontSize:12.5}}>
    {/* Chrome */}
    <div style={{background:T.panel,borderBottom:`1px solid ${T.b1}`,padding:"9px 14px",display:"flex",alignItems:"center",gap:8}}>
      <div style={{display:"flex",gap:5}}>{["#f47067","#f9c74f","#6fcf97"].map((c,i)=><div key={i} style={{width:9,height:9,borderRadius:"50%",background:c}}/>)}</div>
      <span style={{flex:1,textAlign:"center",fontSize:10.5,color:T.t3}}>{lang}</span>
      <div style={{width:6,height:6,borderRadius:"50%",background:color}}/>
    </div>
    {/* Code */}
    <div style={{padding:"16px",overflowX:"auto"}}>
      {code.split("\n").map((line,i)=>{
        const kws=/(function|return|const|let|var|async|await|class|import|from|def|import|for|in|if|match|fn|pub|use|mod|val|fun|suspend|emit|delay|filter|map|collect|super|override|setState)/g;
        const parts=[];let rest=line,k=0;
        while(rest.length){
          const m=kws.exec(rest);
          if(!m){parts.push(<span key={k++} style={{color:T.t2}}>{rest}</span>);break}
          if(m.index>0)parts.push(<span key={k++} style={{color:T.t2}}>{rest.slice(0,m.index)}</span>);
          parts.push(<span key={k++} style={{color:"#c792ea"}}>{m[0]}</span>);
          rest=rest.slice(m.index+m[0].length);kws.lastIndex=0;
        }
        return <div key={i} style={{lineHeight:"1.75",whiteSpace:"pre"}}>{parts}</div>;
      })}
    </div>
  </div>
);

/* Topic card */
const TopicCard = ({ topic, color, T }) => {
  const [hov,setHov]=useState(false);
  return (
    <div onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{background:hov?T.hover:T.panel,border:`1px solid ${hov?color+"44":T.b1}`,borderRadius:12,padding:"16px",transition:"all 0.18s",cursor:"default",display:"flex",flexDirection:"column",gap:10}}>
      <div style={{display:"flex",alignItems:"center",gap:8}}>
        <div style={{width:30,height:30,borderRadius:8,background:`${color}16`,border:`1px solid ${color}28`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
          <topic.icon size={14} color={color}/>
        </div>
        <span style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:13.5,color:T.t1}}>{topic.name}</span>
      </div>
      <AnimatePresence>
        {hov && (
          <motion.p initial={{opacity:0,height:0}} animate={{opacity:1,height:"auto"}} exit={{opacity:0,height:0}} transition={{duration:0.2}}
            style={{fontFamily:"'Lora',serif",fontSize:13,color:T.t2,lineHeight:1.65,margin:0,overflow:"hidden"}}>
            {topic.desc}
          </motion.p>
        )}
      </AnimatePresence>
      {!hov && <p style={{fontFamily:"'Lora',serif",fontSize:12.5,color:T.t3,lineHeight:1.5,margin:0}}>{topic.desc.slice(0,72)}…</p>}
    </div>
  );
};

/* Language detail panel */
const LangPanel = ({ lang, trackColor, T, onClose }) => (
  <motion.div initial={{opacity:0,y:16,scale:0.98}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:12,scale:0.98}} transition={{duration:0.26}}>
    <div style={{background:T.surface,border:`1px solid ${lang.color}33`,borderRadius:20,overflow:"hidden",boxShadow:`0 24px 60px rgba(0,0,0,0.5),0 0 0 1px ${lang.color}22`}}>
      {/* Panel header */}
      <div style={{background:`linear-gradient(135deg,${lang.color}14 0%,transparent 100%)`,borderBottom:`1px solid ${lang.color}22`,padding:"28px 28px 24px",position:"relative"}}>
        <button onClick={onClose} style={{position:"absolute",top:16,right:16,width:28,height:28,borderRadius:"50%",background:T.hover,border:`1px solid ${T.b1}`,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:T.t2,fontSize:16,lineHeight:1}}>×</button>

        <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:14,flexWrap:"wrap"}}>
          <div style={{width:52,height:52,borderRadius:14,background:lang.bg,border:`1px solid ${lang.color}44`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,fontWeight:700,color:lang.color,fontFamily:"'JetBrains Mono',monospace",flexShrink:0}}>
            {lang.icon}
          </div>
          <div>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4,flexWrap:"wrap"}}>
              <h2 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:22,color:T.t1,margin:0,letterSpacing:"-0.3px"}}>{lang.name}</h2>
              <LevelBadge level={lang.level} T={T}/>
            </div>
            <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:12,color:lang.color,margin:0}}>{lang.tagline}</p>
          </div>
          <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:5,padding:"4px 10px",background:`${T.teal}12`,border:`1px solid ${T.teal}28`,borderRadius:7}}>
            <Clock size={12} color={T.teal}/>
            <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:T.teal}}>{lang.time}</span>
          </div>
        </div>

        <p style={{fontFamily:"'Lora',serif",fontSize:15.5,color:T.t2,lineHeight:1.8,margin:0}}>{lang.about}</p>
      </div>

      {/* Body: topics + snippet */}
      <div style={{padding:"24px 28px",display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
        <div>
          <h3 style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:13,color:T.t3,letterSpacing:"1.2px",textTransform:"uppercase",marginBottom:12}}>What You'll Learn</h3>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {lang.topics.map((t,i)=><TopicCard key={i} topic={t} color={lang.color} T={T}/>)}
          </div>
        </div>
        <div>
          <h3 style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:13,color:T.t3,letterSpacing:"1.2px",textTransform:"uppercase",marginBottom:12}}>Code Sample</h3>
          <CodeSnippet code={lang.snippet} lang={lang.name} color={lang.color} T={T}/>
          <a href="/register" style={{display:"flex",alignItems:"center",gap:7,marginTop:14,padding:"11px 18px",borderRadius:10,border:"none",background:lang.color,color:"#000",fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:13.5,cursor:"pointer",textDecoration:"none",transition:"all 0.18s",justifyContent:"center"}}>
            <Play size={14}/> Start {lang.name} Exercises
          </a>
        </div>
      </div>
    </div>
  </motion.div>
);

/* Language card (in grid) */
const LangCard = ({ lang, T, onClick, isActive }) => {
  const [hov,setHov]=useState(false);
  return (
    <motion.div layout onClick={onClick}
      onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      whileHover={{y:-4}} transition={{duration:0.18}}
      style={{
        background:isActive?`${lang.color}14`:T.card,
        border:`1px solid ${isActive||hov?lang.color+"44":T.b1}`,
        borderRadius:16,padding:"20px",cursor:"pointer",
        boxShadow:isActive||hov?`0 8px 32px ${lang.color}18`:"none",
        display:"flex",flexDirection:"column",gap:12,
        transition:"border 0.18s,background 0.18s,box-shadow 0.18s",
      }}>
      {/* Top accent line */}
      <div style={{height:2,borderRadius:2,background:lang.color,opacity:isActive?0.9:0.3,transition:"opacity 0.18s"}}/>

      {/* Icon + name */}
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        <div style={{width:38,height:38,borderRadius:10,background:lang.bg,border:`1px solid ${lang.color}44`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,color:lang.color,fontFamily:"'JetBrains Mono',monospace",flexShrink:0}}>
          {lang.icon}
        </div>
        <div>
          <p style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:15,color:T.t1,margin:"0 0 2px"}}>{lang.name}</p>
          <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10.5,color:lang.color,margin:0}}>{lang.tagline}</p>
        </div>
      </div>

      {/* Meta */}
      <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
        <LevelBadge level={lang.level} T={T}/>
        <div style={{display:"flex",alignItems:"center",gap:4,marginLeft:"auto"}}>
          <Clock size={11} color={T.t3}/>
          <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10.5,color:T.t3}}>{lang.time}</span>
        </div>
      </div>

      {/* CTA hint */}
      <div style={{display:"flex",alignItems:"center",gap:5,color:lang.color,opacity:isActive||hov?1:0,transition:"opacity 0.18s"}}>
        <span style={{fontFamily:"'Syne',sans-serif",fontSize:12,fontWeight:600}}>View details</span>
        <ChevronRight size={13}/>
      </div>
    </motion.div>
  );
};

/* Track tab button */
const TrackTab = ({ track, isActive, onClick, T }) => {
  const [hov,setHov]=useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{
        display:"flex",alignItems:"center",gap:8,
        padding:"10px 20px",borderRadius:12,border:"none",cursor:"pointer",
        background:isActive?`${track.color}16`:(hov?T.hover:"transparent"),
        color:isActive?track.color:(hov?T.t1:T.t2),
        fontFamily:"'Syne',sans-serif",fontWeight:isActive?700:500,fontSize:14,
        transition:"all 0.16s",flexShrink:0,
        borderBottom:isActive?`2px solid ${track.color}`:"2px solid transparent",
        borderRadius:"10px 10px 0 0",
      }}>
      <track.icon size={15}/>
      <span>{track.label}</span>
      <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10.5,padding:"1px 6px",borderRadius:4,background:`${track.color}20`,color:track.color,fontWeight:700}}>{track.languages.length}</span>
    </button>
  );
};

/* Build preview chip */
const BuildChip = ({ text, T, color }) => (
  <div style={{display:"flex",alignItems:"center",gap:8,padding:"10px 14px",background:T.panel,border:`1px solid ${T.b1}`,borderRadius:10}}>
    <CheckCircle2 size={13} color={color}/>
    <span style={{fontFamily:"'Syne',sans-serif",fontSize:13,color:T.t1,fontWeight:500}}>{text}</span>
  </div>
);

/* ══════════════════════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════════════════════ */
export default function Languages() {
  const T = useTheme();
  const [activeTrack, setActiveTrack] = useState("web");
  const [activeLang, setActiveLang] = useState(null);
  const detailRef = useRef(null);

  const track = TRACKS.find(t => t.id === activeTrack);

  const handleLangClick = (langId) => {
    if (activeLang === langId) { setActiveLang(null); return; }
    setActiveLang(langId);
    // Scroll to detail after short delay
    setTimeout(() => detailRef.current?.scrollIntoView({ behavior:"smooth", block:"nearest" }), 80);
  };

  const activeLangData = track?.languages.find(l => l.id === activeLang);

  // Reset active lang when track changes
  useEffect(() => { setActiveLang(null); }, [activeTrack]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600&family=Syne:wght@400;500;600;700;800&family=Lora:ital,wght@0,400;0,500;1,400;1,500&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        html{scroll-behavior:smooth;}
        body{background:${T.shell};}
        ::-webkit-scrollbar{width:5px;}
        ::-webkit-scrollbar-track{background:${T.shell};}
        ::-webkit-scrollbar-thumb{background:${T.hover};border-radius:3px;}
        ::selection{background:${T.accentS};}
        @keyframes cjGlow{0%,100%{box-shadow:0 0 20px ${T.accent}40}50%{box-shadow:0 0 50px ${T.accent}70}}
        @keyframes cjFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
        @media(max-width:768px){
          .lang-detail-grid{grid-template-columns:1fr!important;}
          .track-tabs{overflow-x:auto;-webkit-overflow-scrolling:touch;}
        }
        @media(max-width:560px){
          .lang-grid{grid-template-columns:1fr!important;}
        }
      `}</style>

      <div style={{minHeight:"100vh",background:T.shell,color:T.t1,fontFamily:"'Syne',sans-serif"}}>

        {/* ── HERO ── */}
        <section style={{position:"relative",background:T.deep,padding:"100px 24px 72px",overflow:"hidden"}}>
          <GridBg T={T}/>
          {/* Glow */}
          <div style={{position:"absolute",left:"50%",top:"50%",transform:"translate(-50%,-50%)",width:600,height:400,borderRadius:"50%",background:`radial-gradient(ellipse,${T.accent}1c 0%,${T.teal}0c 40%,transparent 70%)`,filter:"blur(50px)",pointerEvents:"none"}}/>

          <div style={{maxWidth:820,margin:"0 auto",position:"relative",textAlign:"center"}}>
            {/* Pill */}
            <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:0.08}}
              style={{display:"inline-flex",alignItems:"center",gap:7,padding:"4px 14px",borderRadius:100,background:`${T.accent}14`,border:`1px solid ${T.accent}40`,marginBottom:22}}>
              <Code2 size={12} color={T.accent}/>
              <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,fontWeight:700,color:T.accent,letterSpacing:"1.8px",textTransform:"uppercase"}}>Languages & Tracks</span>
            </motion.div>

            <motion.h1 initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} transition={{delay:0.14}}
              style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:"clamp(34px,5.5vw,64px)",lineHeight:1.07,letterSpacing:"-1.5px",marginBottom:18,color:T.t1}}>
              Every Language.<br/>
              <span style={{color:T.accent}}>One Place</span> to Begin.
            </motion.h1>

            <motion.p initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} transition={{delay:0.22}}
              style={{fontFamily:"'Lora',serif",fontStyle:"italic",fontSize:"clamp(15px,2vw,18px)",color:T.t2,lineHeight:1.82,maxWidth:560,margin:"0 auto 40px"}}>
              Pick a track. Explore the languages inside it. See what you'll build, what topics you'll cover, and what real code looks like - before writing your first line.
            </motion.p>

            {/* Floating language tags */}
            <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.35}}
              style={{display:"flex",justifyContent:"center",gap:8,flexWrap:"wrap"}}>
              {["JS","TS","Py","R","SQL","Flutter","Kt","Dart","Rust"].map((l,i)=>(
                <motion.span key={l}
                  animate={{y:[0,-5,0]}} transition={{duration:2.5+i*0.3,repeat:Infinity,delay:i*0.2}}
                  style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11.5,fontWeight:700,padding:"3px 10px",borderRadius:6,background:T.panel,color:T.t2,border:`1px solid ${T.b2}`}}>
                  {l}
                </motion.span>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── TRACK TABS ── */}
        <div style={{background:T.deep,borderBottom:`1px solid ${T.b1}`,position:"sticky",top:0,zIndex:50,backdropFilter:"blur(16px)"}}>
          <div style={{maxWidth:1100,margin:"0 auto",padding:"0 24px"}}>
            <div className="track-tabs" style={{display:"flex",gap:4,paddingTop:4}}>
              {TRACKS.map(track=>(
                <TrackTab key={track.id} track={track} isActive={activeTrack===track.id} onClick={()=>setActiveTrack(track.id)} T={T}/>
              ))}
            </div>
          </div>
        </div>

        {/* ── TRACK CONTENT ── */}
        <AnimatePresence mode="wait">
          <motion.div key={activeTrack}
            initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}}
            transition={{duration:0.22}}>

            {/* Track intro */}
            <section style={{background:track.tint,borderBottom:`1px solid ${T.b1}`,padding:"44px 24px"}}>
              <div style={{maxWidth:1100,margin:"0 auto",display:"flex",alignItems:"flex-start",gap:48,flexWrap:"wrap"}}>

                <div style={{flex:1,minWidth:280}}>
                  {/* Track badge */}
                  <div style={{display:"inline-flex",alignItems:"center",gap:7,padding:"4px 13px",borderRadius:100,background:`${track.color}16`,border:`1px solid ${track.color}40`,marginBottom:16}}>
                    <track.icon size={13} color={track.color}/>
                    <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,fontWeight:700,color:track.color,letterSpacing:"1.5px",textTransform:"uppercase"}}>{track.label}</span>
                  </div>
                  <h2 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:"clamp(22px,3.5vw,34px)",color:T.t1,marginBottom:12,letterSpacing:"-0.4px",lineHeight:1.15}}>
                    {track.tagline}
                  </h2>
                  <p style={{fontFamily:"'Lora',serif",fontSize:16,color:T.t2,lineHeight:1.82,maxWidth:480}}>{track.description}</p>
                </div>

                {/* What you'll build */}
                <div style={{minWidth:240}}>
                  <p style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:11,color:T.t3,letterSpacing:"1.5px",textTransform:"uppercase",marginBottom:12}}>What You'll Build</p>
                  <div style={{display:"flex",flexDirection:"column",gap:8}}>
                    {track.youllBuild.map((item,i)=>(
                      <Reveal key={i} delay={i*0.07}>
                        <BuildChip text={item} T={T} color={track.color}/>
                      </Reveal>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Language grid */}
            <section style={{padding:"48px 24px",background:T.mid}}>
              <div style={{maxWidth:1100,margin:"0 auto"}}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:28,flexWrap:"wrap",gap:10}}>
                  <h3 style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:18,color:T.t1,margin:0}}>
                    Languages in this track
                    <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:12,color:T.t3,marginLeft:10,fontWeight:400}}>- click to explore</span>
                  </h3>
                  {activeLang && (
                    <button onClick={()=>setActiveLang(null)} style={{fontFamily:"'Syne',sans-serif",fontSize:12.5,fontWeight:600,color:T.t3,background:"none",border:"none",cursor:"pointer",textDecoration:"underline"}}>
                      Close detail ×
                    </button>
                  )}
                </div>

                {/* Cards */}
                <div className="lang-grid" style={{display:"grid",gridTemplateColumns:`repeat(auto-fill,minmax(220px,1fr))`,gap:14,marginBottom:28}}>
                  {track.languages.map((lang,i)=>(
                    <Reveal key={lang.id} delay={i*0.07}>
                      <LangCard lang={lang} T={T} onClick={()=>handleLangClick(lang.id)} isActive={activeLang===lang.id}/>
                    </Reveal>
                  ))}
                </div>

                {/* Detail panel */}
                <div ref={detailRef}>
                  <AnimatePresence>
                    {activeLangData && (
                      <div className="lang-detail-grid">
                        <LangPanel lang={activeLangData} trackColor={track.color} T={T} onClose={()=>setActiveLang(null)}/>
                      </div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </section>

          </motion.div>
        </AnimatePresence>

        {/* ── COMPARISON TABLE ── */}
        <section style={{padding:"72px 24px",background:T.deep,borderTop:`1px solid ${T.b1}`}}>
          <div style={{maxWidth:1000,margin:"0 auto"}}>
            <Reveal>
              <div style={{textAlign:"center",marginBottom:44}}>
                <div style={{display:"inline-flex",alignItems:"center",gap:6,padding:"4px 13px",borderRadius:100,background:`${T.teal}14`,border:`1px solid ${T.teal}40`,marginBottom:14}}>
                  <Layers size={12} color={T.teal}/>
                  <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,fontWeight:700,color:T.teal,letterSpacing:"1.5px",textTransform:"uppercase"}}>Quick Comparison</span>
                </div>
                <h2 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:"clamp(24px,3.5vw,38px)",color:T.t1,letterSpacing:"-0.6px",marginBottom:10}}>All Languages at a Glance</h2>
                <p style={{fontFamily:"'Lora',serif",fontStyle:"italic",fontSize:16,color:T.t2,maxWidth:440,margin:"0 auto"}}>Not sure which track to start with? Compare by what excites you.</p>
              </div>
            </Reveal>

            {/* Table */}
            <Reveal delay={0.1}>
              <div style={{border:`1px solid ${T.b2}`,borderRadius:16,overflow:"hidden"}}>
                {/* Header */}
                <div style={{display:"grid",gridTemplateColumns:"1.5fr 1fr 1fr 1fr 1.5fr",background:T.panel,borderBottom:`1px solid ${T.b1}`,padding:"12px 20px"}}>
                  {["Language","Track","Level","Time","Best For"].map(h=>(
                    <span key={h} style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,fontWeight:700,color:T.t3,textTransform:"uppercase",letterSpacing:"1px"}}>{h}</span>
                  ))}
                </div>
                {TRACKS.flatMap(track=>
                  track.languages.map((lang,li)=>(
                    <div key={lang.id}
                      style={{display:"grid",gridTemplateColumns:"1.5fr 1fr 1fr 1fr 1.5fr",padding:"13px 20px",background:li%2===0?T.card:T.panel,borderBottom:`1px solid ${T.b1}`,alignItems:"center",gap:4,transition:"background 0.15s",cursor:"pointer"}}
                      onClick={()=>{ setActiveTrack(track.id); setTimeout(()=>{ setActiveLang(lang.id); setTimeout(()=>detailRef.current?.scrollIntoView({behavior:"smooth",block:"nearest"}),80) },100) }}
                      onMouseEnter={e=>e.currentTarget.style.background=T.hover}
                      onMouseLeave={e=>e.currentTarget.style.background=li%2===0?T.card:T.panel}>
                      {/* Language */}
                      <div style={{display:"flex",alignItems:"center",gap:9}}>
                        <div style={{width:26,height:26,borderRadius:7,background:lang.bg,border:`1px solid ${lang.color}44`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9.5,fontWeight:700,color:lang.color,fontFamily:"'JetBrains Mono',monospace",flexShrink:0}}>{lang.icon}</div>
                        <span style={{fontFamily:"'Syne',sans-serif",fontWeight:600,fontSize:13.5,color:T.t1}}>{lang.name}</span>
                      </div>
                      {/* Track */}
                      <div style={{display:"flex",alignItems:"center",gap:5}}>
                        <track.icon size={12} color={track.color}/>
                        <span style={{fontFamily:"'Syne',sans-serif",fontSize:12,color:T.t2}}>{track.id==="web"?"Web":track.id==="app"?"App":"Data"}</span>
                      </div>
                      {/* Level */}
                      <LevelBadge level={lang.level} T={T}/>
                      {/* Time */}
                      <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11.5,color:T.t3}}>{lang.time}</span>
                      {/* Tagline */}
                      <span style={{fontFamily:"'Lora',serif",fontSize:13,color:T.t2,fontStyle:"italic"}}>{lang.tagline}</span>
                    </div>
                  ))
                )}
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── CTA ── */}
        <section style={{padding:"90px 24px",position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",left:"50%",top:"50%",transform:"translate(-50%,-50%)",width:600,height:350,borderRadius:"50%",background:`radial-gradient(ellipse,${T.accent}1c 0%,transparent 70%)`,filter:"blur(40px)",pointerEvents:"none"}}/>
          <GridBg T={T}/>
          <Reveal>
            <div style={{maxWidth:560,margin:"0 auto",textAlign:"center",position:"relative"}}>
              <motion.div animate={{y:[0,-6,0]}} transition={{duration:3,repeat:Infinity}}
                style={{display:"inline-flex",width:56,height:56,borderRadius:16,background:`linear-gradient(135deg,${T.accent},${T.teal})`,alignItems:"center",justifyContent:"center",fontSize:22,fontWeight:800,color:"#fff",fontFamily:"'Syne',sans-serif",marginBottom:22,boxShadow:`0 0 36px ${T.accent}50`}}>
                CJ
              </motion.div>
              <h2 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:"clamp(28px,4.5vw,46px)",color:T.t1,marginBottom:14,letterSpacing:"-0.9px",lineHeight:1.1}}>
                Pick a Track.<br/><span style={{color:T.accent}}>Start Building.</span>
              </h2>
              <p style={{fontFamily:"'Lora',serif",fontStyle:"italic",fontSize:17,color:T.t2,lineHeight:1.8,marginBottom:36}}>
                No install. No credit card. Open your browser and write your first line of real code today.
              </p>
              <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap"}}>
                <a href="/register" style={{display:"inline-flex",alignItems:"center",gap:8,padding:"13px 28px",borderRadius:12,border:"none",background:T.accent,color:"#fff",fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:15,cursor:"pointer",textDecoration:"none",boxShadow:`0 0 36px ${T.accent}55`,transition:"all 0.18s",animation:"cjGlow 3s ease infinite"}}>
                  <Zap size={15}/> Start Free
                </a>
                <a href="/about" style={{display:"inline-flex",alignItems:"center",gap:7,padding:"13px 22px",borderRadius:12,border:`1px solid ${T.b2}`,background:"transparent",color:T.t1,fontFamily:"'Syne',sans-serif",fontWeight:600,fontSize:15,cursor:"pointer",textDecoration:"none",transition:"all 0.18s"}}
                  onMouseEnter={e=>{e.currentTarget.style.background=T.hover;e.currentTarget.style.borderColor=T.b3;}}
                  onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.borderColor=T.b2;}}>
                  About CJ <ArrowRight size={15}/>
                </a>
              </div>
              <div style={{marginTop:28,display:"flex",justifyContent:"center",gap:20,flexWrap:"wrap"}}>
                {["10 languages","3 tracks","Zero setup"].map(t=>(
                  <div key={t} style={{display:"flex",alignItems:"center",gap:5}}>
                    <div style={{width:5,height:5,borderRadius:"50%",background:T.green}}/>
                    <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11.5,color:T.t3,fontWeight:600}}>{t}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </section>

      </div>
    </>
  );
}