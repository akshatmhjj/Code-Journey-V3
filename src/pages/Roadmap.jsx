/**
 * Code Journey - Roadmap
 *
 * An interactive, visual learning roadmap.
 * Three tracks × multiple stages × expandable skill nodes.
 * Theme syncs from Profile > Settings via localStorage.
 */

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Globe, Smartphone, BarChart2, ChevronDown, CheckCircle2,
  Lock, Circle, Zap, ArrowRight, BookOpen, Code2, Star,
  Layers, Database, Brain, Terminal, Sparkles, Target,
  Clock, Play, Trophy, Map, Compass, Flag,
} from "lucide-react";

/* ══════════════════════════════════════════════════════════════
   THEME SYNC  (identical pattern to Home / About / Languages)
══════════════════════════════════════════════════════════════ */
const THEMES = {
  cosmos:{ shell:"#07080d",deep:"#0c0e18",mid:"#111420",surface:"#161927",panel:"#1a1e2e",hover:"#1e2335",card:"#161927",t1:"#e8eaf2",t2:"#8892b0",t3:"#5a6488",t4:"#2e3660",b1:"rgba(120,130,180,0.08)",b2:"rgba(120,130,180,0.15)",b3:"rgba(120,130,180,0.24)",accent:"#7c6ee0",accentS:"rgba(124,110,224,0.14)",teal:"#5eead4",green:"#22c55e",red:"#f87171",gold:"#fbbf24" },
  void:{   shell:"#000",   deep:"#050507",mid:"#0a0a0f",surface:"#0f0f15",panel:"#141419",hover:"#1a1a22",card:"#0f0f15",t1:"#f0f0ff",t2:"#9090b8",t3:"#505070",t4:"#252540",b1:"rgba(100,100,200,0.08)",b2:"rgba(100,100,200,0.14)",b3:"rgba(100,100,200,0.22)",accent:"#8b7ff0",accentS:"rgba(139,127,240,0.14)",teal:"#2dd4bf",green:"#34d399",red:"#fc8181",gold:"#fcd34d" },
  aurora:{ shell:"#040e0e",deep:"#071414",mid:"#0b1c1c",surface:"#102424",panel:"#142a2a",hover:"#1a3333",card:"#102424",t1:"#e0f5f5",t2:"#7ab8b8",t3:"#3d7878",t4:"#1e4444",b1:"rgba(80,200,180,0.08)",b2:"rgba(80,200,180,0.15)",b3:"rgba(80,200,180,0.24)",accent:"#2dd4bf",accentS:"rgba(45,212,191,0.14)",teal:"#5eead4",green:"#4ade80",red:"#f87171",gold:"#fbbf24" },
  nord:{   shell:"#1a1f2e",deep:"#1e2535",mid:"#232c40",surface:"#28334a",panel:"#2d3a50",hover:"#344260",card:"#28334a",t1:"#eceff4",t2:"#9ba8c0",t3:"#5c6a88",t4:"#3a4560",b1:"rgba(136,192,208,0.1)",b2:"rgba(136,192,208,0.18)",b3:"rgba(136,192,208,0.28)",accent:"#88c0d0",accentS:"rgba(136,192,208,0.14)",teal:"#8fbcbb",green:"#a3be8c",red:"#bf616a",gold:"#ebcb8b" },
  light:{  shell:"#f3f4f8",deep:"#fff",   mid:"#f0f1f7",surface:"#fff",   panel:"#f7f8fc",hover:"#eef0f8",card:"#fff",   t1:"#111827",t2:"#4b5680",t3:"#7c87a8",t4:"#c5ccdf",b1:"rgba(80,90,150,0.08)",b2:"rgba(80,90,150,0.15)",b3:"rgba(80,90,150,0.24)",accent:"#6256d0",accentS:"rgba(98,86,208,0.1)",teal:"#0d9488",green:"#16a34a",red:"#dc2626",gold:"#d97706" },
};
const getTheme = () => { try { return THEMES[localStorage.getItem("cj-theme")] || THEMES.cosmos; } catch { return THEMES.cosmos; } };
const applyToDom = (T) => { try { const r = document.documentElement; [["--cj-shell",T.shell],["--cj-accent",T.accent],["--cj-teal",T.teal],["--cj-t1",T.t1],["--cj-t2",T.t2]].forEach(([k,v]) => r.style.setProperty(k,v)); } catch {} };

function useTheme() {
  const [T, setT] = useState(getTheme);
  useEffect(() => {
    applyToDom(T);
    const iv = setInterval(() => { const f = getTheme(); if (f.accent !== T.accent) { setT(f); applyToDom(f); } }, 500);
    return () => clearInterval(iv);
  }, [T]);
  useEffect(() => { const fn = () => { const f = getTheme(); setT(f); applyToDom(f); }; window.addEventListener("storage", fn); return () => window.removeEventListener("storage", fn); }, []);
  return T;
}

/* ══════════════════════════════════════════════════════════════
   ROADMAP DATA
══════════════════════════════════════════════════════════════ */
const TRACKS = [
  {
    id: "web",
    label: "Web Development",
    icon: Globe,
    color: "#7c6ee0",
    tagline: "From zero to full-stack",
    description: "Build everything from simple static pages to complete web applications. Web dev is the most visual and immediately rewarding track - you see results in seconds.",
    duration: "4–6 months",
    outcome: "Junior Frontend or Full-Stack Developer",
    stages: [
      {
        id: "web-s1",
        title: "Stage 1 - The Foundation",
        subtitle: "What every webpage is made of",
        emoji: "🧱",
        color: "#f97316",
        duration: "2–3 weeks",
        locked: false,
        description: "Before writing a single line of JavaScript, you need to understand the structure and presentation layer of the web. This stage is fast, visual, and deeply satisfying.",
        skills: [
          { name:"HTML Basics",        icon:Code2,   desc:"Tags, elements, attributes, semantic structure - the skeleton every browser renders.", level:"Essential" },
          { name:"CSS Fundamentals",   icon:Layers,  desc:"Selectors, the box model, colours, fonts, and your first styled page.", level:"Essential" },
          { name:"Flexbox & Grid",     icon:Target,  desc:"The two layout superpowers of modern CSS. Master these and you can build any layout.", level:"Essential" },
          { name:"Responsive Design",  icon:Smartphone,desc:"Media queries, fluid units (rem, %), and mobile-first thinking.", level:"Essential" },
        ],
        projects: ["Personal bio page","Responsive product card","CSS animation showcase"],
        resources: ["MDN Web Docs","CSS-Tricks","freeCodeCamp (HTML/CSS)"],
      },
      {
        id: "web-s2",
        title: "Stage 2 - Make It Interactive",
        subtitle: "JavaScript from scratch",
        emoji: "⚡",
        color: "#f7df1e",
        duration: "4–6 weeks",
        locked: false,
        description: "JavaScript is what makes websites respond to clicks, fetch data, and update without page reloads. This is where programming truly begins.",
        skills: [
          { name:"Variables & Data Types",  icon:Code2,    desc:"let, const, strings, numbers, booleans, arrays, objects - the vocabulary of JS.", level:"Essential" },
          { name:"Functions & Scope",       icon:Zap,      desc:"Declarations, arrow functions, closures, and why scope matters.", level:"Essential" },
          { name:"DOM Manipulation",        icon:Globe,    desc:"Selecting elements, changing content, handling click events.", level:"Essential" },
          { name:"Async JavaScript",        icon:Clock,    desc:"Callbacks, Promises, async/await - handling time-delayed operations.", level:"Essential" },
          { name:"Fetch API",               icon:Database, desc:"Calling REST APIs, handling JSON responses, and displaying dynamic data.", level:"Important" },
          { name:"ES6+ Features",           icon:Sparkles, desc:"Destructuring, spread, optional chaining, template literals, modules.", level:"Important" },
        ],
        projects: ["Interactive quiz app","Weather app using a public API","To-do list with localStorage"],
        resources: ["javascript.info","Eloquent JavaScript","The Odin Project"],
      },
      {
        id: "web-s3",
        title: "Stage 3 - Go TypeScript",
        subtitle: "JavaScript with a safety net",
        emoji: "🛡️",
        color: "#60a5fa",
        duration: "2–3 weeks",
        locked: false,
        description: "TypeScript adds static typing to JavaScript. It catches bugs before runtime, makes codebases navigable, and is now the default in professional development.",
        skills: [
          { name:"Types & Interfaces",  icon:Code2,    desc:"string, number, boolean, union types, and defining object shapes with interfaces.", level:"Essential" },
          { name:"Generics",            icon:Layers,   desc:"Writing reusable functions and classes that work with any type safely.", level:"Important" },
          { name:"Type Utilities",      icon:Sparkles, desc:"Partial, Omit, Pick, Required - transforming existing types without repetition.", level:"Good to Know" },
        ],
        projects: ["Refactor JS project to TypeScript","Type-safe API wrapper","Generic data fetch hook"],
        resources:["TypeScript Handbook","Total TypeScript","Matt Pocock's TypeScript tips"],
      },
      {
        id: "web-s4",
        title: "Stage 4 - React & Components",
        subtitle: "Building UIs the modern way",
        emoji: "⚛️",
        color: "#61dafb",
        duration: "4–6 weeks",
        locked: false,
        description: "React is the most widely used frontend library. It introduces component thinking - building UIs as reusable, composable pieces of logic and markup.",
        skills: [
          { name:"Components & Props",   icon:Layers,   desc:"Function components, passing data down, component composition patterns.", level:"Essential" },
          { name:"State & Hooks",        icon:Zap,      desc:"useState, useEffect, useRef, useCallback - managing data that changes over time.", level:"Essential" },
          { name:"React Router",         icon:Globe,    desc:"Client-side routing, nested routes, navigation guards.", level:"Essential" },
          { name:"Context API",          icon:Code2,    desc:"Sharing state across a component tree without prop drilling.", level:"Important" },
          { name:"React Query / SWR",    icon:Database, desc:"Data fetching, caching, and server-state management.", level:"Important" },
        ],
        projects:["Multi-page React app","Blog with React Router","Real API dashboard with loading states"],
        resources:["react.dev","Scrimba React Course","Fireship React in 100 Seconds"],
      },
      {
        id: "web-s5",
        title: "Stage 5 - Backend & Databases",
        subtitle: "Server-side and data persistence",
        emoji: "🗄️",
        color: "#4ade80",
        duration: "4–5 weeks",
        locked: false,
        description: "A frontend alone can't save data permanently. This stage introduces you to Node.js, REST APIs, and SQL databases - completing the full-stack picture.",
        skills: [
          { name:"Node.js & Express",   icon:Terminal, desc:"Building HTTP servers, routing, middleware, and request/response cycles.", level:"Essential" },
          { name:"REST API Design",     icon:Globe,    desc:"CRUD operations, status codes, JSON responses, API versioning.", level:"Essential" },
          { name:"PostgreSQL & SQL",    icon:Database, desc:"Tables, queries, joins, indexes - persisting and retrieving structured data.", level:"Essential" },
          { name:"Authentication",      icon:Lock,     desc:"JWT tokens, sessions, bcrypt password hashing, and protected routes.", level:"Important" },
          { name:"Prisma ORM",          icon:Layers,   desc:"Type-safe database access for TypeScript - migrations, queries, relations.", level:"Important" },
        ],
        projects:["REST API with auth","Full-stack notes app","Blog platform with users and posts"],
        resources:["Node.js docs","The Odin Project (Node)","Prisma docs"],
      },
      {
        id: "web-s6",
        title: "Stage 6 - Deploy & Ship",
        subtitle: "Real projects on the real web",
        emoji: "🚀",
        color: "#a78bfa",
        duration: "1–2 weeks",
        locked: false,
        description: "A portfolio project only counts when it's live. This stage covers deploying your full-stack app, setting up CI/CD, and sharing your work with the world.",
        skills: [
          { name:"Git & GitHub",         icon:Code2,    desc:"Version control, branching, pull requests - the workflow every developer uses.", level:"Essential" },
          { name:"Vercel / Railway",     icon:Zap,      desc:"Deploying frontend and backend with zero-config. Environment variables and domains.", level:"Essential" },
          { name:"Environment Config",   icon:Terminal, desc:".env files, secrets management, and configuring apps for production.", level:"Important" },
        ],
        projects:["Deployed full-stack app","CI/CD pipeline with GitHub Actions","Custom domain on Vercel"],
        resources:["Vercel docs","Railway docs","GitHub Actions quickstart"],
      },
    ],
  },

  {
    id: "app",
    label: "App Development",
    icon: Smartphone,
    color: "#5eead4",
    tagline: "Ship to a billion pockets",
    description: "Build native and cross-platform mobile apps for iOS and Android. Flutter lets you write one codebase that runs on both with native performance and beautiful UIs.",
    duration: "4–6 months",
    outcome: "Junior Mobile / Flutter Developer",
    stages: [
      {
        id: "app-s1",
        title: "Stage 1 - Dart Foundations",
        subtitle: "The language Flutter speaks",
        emoji: "◈",
        color: "#5eead4",
        duration: "2–3 weeks",
        locked: false,
        description: "Dart is Flutter's language. It's clean, strongly typed, and null-safe by default. Understanding it deeply will make Flutter click much faster.",
        skills: [
          { name:"Dart Syntax",          icon:Code2,    desc:"Variables, functions, classes, control flow - Dart's readable, Java-inspired syntax.", level:"Essential" },
          { name:"Null Safety",          icon:Lock,     desc:"Dart's type system prevents null reference errors at compile time.", level:"Essential" },
          { name:"Collections",          icon:Layers,   desc:"List, Map, Set - and the powerful higher-order methods (map, filter, reduce).", level:"Essential" },
          { name:"Async & Futures",      icon:Zap,      desc:"Future, async/await, Stream - Dart's non-blocking programming model.", level:"Essential" },
          { name:"OOP in Dart",          icon:Code2,    desc:"Classes, constructors, inheritance, mixins, and interfaces.", level:"Important" },
        ],
        projects:["CLI calculator","Async data fetcher","Class hierarchy exercise"],
        resources:["dart.dev","Dart Apprentice (book)","Flutter official channel"],
      },
      {
        id: "app-s2",
        title: "Stage 2 - Flutter Basics",
        subtitle: "Widgets, widgets, widgets",
        emoji: "⬡",
        color: "#38bdf8",
        duration: "3–4 weeks",
        locked: false,
        description: "In Flutter, everything is a widget. This stage teaches you the widget tree, layout primitives, and how Flutter renders UIs so efficiently.",
        skills: [
          { name:"Stateless Widgets",    icon:Layers,   desc:"Pure presentation components - Column, Row, Container, Text, Icon, Image.", level:"Essential" },
          { name:"Stateful Widgets",     icon:Zap,      desc:"State that changes over time - setState, the widget lifecycle.", level:"Essential" },
          { name:"Layout Widgets",       icon:Target,   desc:"Padding, Expanded, Flexible, Stack, GridView, ListView.", level:"Essential" },
          { name:"Material & Cupertino", icon:Smartphone,desc:"Platform-appropriate UI components - buttons, cards, dialogs, navigation bars.", level:"Essential" },
          { name:"Navigation",           icon:Globe,    desc:"Navigator 2.0, named routes, passing data between screens.", level:"Important" },
        ],
        projects:["Counter app","Product listing UI","Multi-screen onboarding flow"],
        resources:["flutter.dev","Flutter & Dart Udemy (Maximilian)","Fireship Flutter in 100s"],
      },
      {
        id: "app-s3",
        title: "Stage 3 - State Management",
        subtitle: "Managing data that changes",
        emoji: "🧠",
        color: "#a78bfa",
        duration: "3–4 weeks",
        locked: false,
        description: "Real apps have complex, shared state. This stage introduces the most widely used state management patterns in Flutter.",
        skills: [
          { name:"Provider",             icon:Brain,    desc:"The official lightweight state management solution. Context-based, easy to learn.", level:"Essential" },
          { name:"Riverpod",             icon:Zap,      desc:"A more powerful Provider replacement - compile-safe, testable, and composable.", level:"Important" },
          { name:"BLoC Pattern",         icon:Layers,   desc:"Business Logic Component - separating UI from business logic with streams.", level:"Good to Know" },
        ],
        projects:["Shopping cart with Provider","Auth state with Riverpod","Counter with BLoC"],
        resources:["riverpod.dev","Flutter BLoC library docs","ResoCoder tutorials"],
      },
      {
        id: "app-s4",
        title: "Stage 4 - Networking & Data",
        subtitle: "Fetching and storing real data",
        emoji: "🌐",
        color: "#4ade80",
        duration: "3–4 weeks",
        locked: false,
        description: "Mobile apps are useless without data. Learn to call REST APIs, parse JSON, and persist data locally and in the cloud.",
        skills: [
          { name:"http & dio Packages",  icon:Globe,    desc:"Making GET/POST/PUT/DELETE requests, handling headers and auth tokens.", level:"Essential" },
          { name:"JSON Serialisation",   icon:Code2,    desc:"fromJson / toJson, jsonDecode, json_serializable code generation.", level:"Essential" },
          { name:"Firebase",             icon:Zap,      desc:"Firestore real-time database, Firebase Auth, and Firebase Storage.", level:"Important" },
          { name:"SQLite (Drift/Hive)",  icon:Database, desc:"Local data persistence for offline-first apps.", level:"Important" },
        ],
        projects:["News reader app","Firebase-backed chat","Offline notes with SQLite"],
        resources:["pub.dev/packages/dio","Firebase Flutter docs","Hive docs"],
      },
      {
        id: "app-s5",
        title: "Stage 5 - Polish & Ship",
        subtitle: "From prototype to App Store",
        emoji: "🏁",
        color: "#f97316",
        duration: "2–3 weeks",
        locked: false,
        description: "The difference between a demo and a real app is polish, testing, and deployment. This stage covers animations, performance, and publishing.",
        skills: [
          { name:"Animations",           icon:Sparkles, desc:"AnimatedContainer, AnimationController, Hero transitions, page transitions.", level:"Important" },
          { name:"Responsive UI",        icon:Target,   desc:"LayoutBuilder, adaptive layouts for phones and tablets.", level:"Important" },
          { name:"Testing",              icon:CheckCircle2, desc:"Unit tests, widget tests, and integration tests in Flutter.", level:"Good to Know" },
          { name:"App Store Deployment", icon:Flag,     desc:"Build signing, app icons, splash screens, and submitting to Play Store / App Store.", level:"Essential" },
        ],
        projects:["Animated onboarding","Tablet-adaptive app","Published app on Play Store"],
        resources:["Flutter animation docs","Codemagic CI/CD","Flutter publishing guide"],
      },
    ],
  },

  {
    id: "data",
    label: "Data Science",
    icon: BarChart2,
    color: "#f472b6",
    tagline: "Extract insight from everything",
    description: "Data science combines programming, statistics, and domain knowledge. Learn Python, SQL, and machine learning to answer questions with data and build predictive models.",
    duration: "5–7 months",
    outcome: "Junior Data Analyst / Data Scientist",
    stages: [
      {
        id: "data-s1",
        title: "Stage 1 - Python for Data",
        subtitle: "The language of data science",
        emoji: "🐍",
        color: "#4ade80",
        duration: "3–4 weeks",
        locked: false,
        description: "Python is the universal language of data science. Before touching statistics or ML, get comfortable with Python and the core data manipulation libraries.",
        skills: [
          { name:"Python Basics",        icon:Code2,    desc:"Variables, loops, functions, list comprehensions, file I/O.", level:"Essential" },
          { name:"NumPy",                icon:Database, desc:"Fast numerical arrays, vectorised operations, broadcasting.", level:"Essential" },
          { name:"Pandas",               icon:Layers,   desc:"DataFrames - loading, filtering, grouping, merging, and transforming tabular data.", level:"Essential" },
          { name:"Jupyter Notebooks",    icon:BookOpen, desc:"The standard environment for exploratory data analysis and reproducible research.", level:"Essential" },
        ],
        projects:["Exploratory data analysis on a public dataset","CSV cleaning and transformation","Pandas aggregation exercise"],
        resources:["Python official tutorial","Kaggle Learn (Python)","Pandas documentation"],
      },
      {
        id: "data-s2",
        title: "Stage 2 - SQL for Data",
        subtitle: "Talk to every database on the planet",
        emoji: "🗄️",
        color: "#a78bfa",
        duration: "2–3 weeks",
        locked: false,
        description: "SQL is non-negotiable in data roles. Every dataset lives in a database. Learn to extract, aggregate, and join data with professional-grade SQL.",
        skills: [
          { name:"SELECT & Filtering",   icon:Database, desc:"WHERE, ORDER BY, LIMIT - retrieving exactly the data you need.", level:"Essential" },
          { name:"Aggregation",          icon:BarChart2,desc:"GROUP BY, COUNT, SUM, AVG, MIN, MAX - collapsing rows into summaries.", level:"Essential" },
          { name:"JOINs",                icon:Layers,   desc:"INNER, LEFT, RIGHT, FULL - combining data from multiple tables.", level:"Essential" },
          { name:"Window Functions",     icon:Sparkles, desc:"ROW_NUMBER, RANK, LAG, LEAD, SUM OVER - analysis without losing row detail.", level:"Important" },
          { name:"CTEs",                 icon:Code2,    desc:"WITH clauses - writing readable, reusable query logic.", level:"Important" },
        ],
        projects:["Sales analysis SQL report","Cohort retention query","Top N customers by revenue"],
        resources:["DataLemur","StrataScratch","Mode Analytics SQL tutorial"],
      },
      {
        id: "data-s3",
        title: "Stage 3 - Visualisation",
        subtitle: "Make data tell a story",
        emoji: "📊",
        color: "#f97316",
        duration: "2–3 weeks",
        locked: false,
        description: "Data without visualisation is just numbers. Learn to build charts that communicate insight clearly and beautifully.",
        skills: [
          { name:"Matplotlib",           icon:BarChart2,desc:"The foundational Python visualisation library - line, bar, scatter, histogram.", level:"Essential" },
          { name:"Seaborn",              icon:Sparkles, desc:"Statistical data visualisation built on Matplotlib - heatmaps, distributions, pair plots.", level:"Essential" },
          { name:"Plotly",               icon:Target,   desc:"Interactive charts for dashboards and presentations.", level:"Good to Know" },
        ],
        projects:["Sales dashboard","Distribution comparison chart","Correlation heatmap"],
        resources:["Matplotlib gallery","Seaborn tutorial","Plotly Express quickstart"],
      },
      {
        id: "data-s4",
        title: "Stage 4 - Statistics",
        subtitle: "The math behind the answers",
        emoji: "📐",
        color: "#60a5fa",
        duration: "3–4 weeks",
        locked: false,
        description: "Good data scientists understand why their models make predictions. This stage covers the core statistical concepts that underpin every ML algorithm.",
        skills: [
          { name:"Descriptive Statistics", icon:BarChart2, desc:"Mean, median, mode, variance, standard deviation, skewness.", level:"Essential" },
          { name:"Probability Basics",    icon:Brain,    desc:"Distributions, conditional probability, Bayes' theorem.", level:"Essential" },
          { name:"Hypothesis Testing",    icon:Target,   desc:"t-tests, chi-squared tests, p-values, and what statistical significance actually means.", level:"Essential" },
          { name:"Correlation vs Causation", icon:Layers, desc:"Pearson correlation, confounding variables, and the most important distinction in data.", level:"Important" },
        ],
        projects:["A/B test analysis","Statistical report from a dataset","Hypothesis test on real data"],
        resources:["StatQuest (YouTube)","Think Stats (free book)","Khan Academy Statistics"],
      },
      {
        id: "data-s5",
        title: "Stage 5 - Machine Learning",
        subtitle: "Teaching computers to learn",
        emoji: "🤖",
        color: "#f472b6",
        duration: "6–8 weeks",
        locked: false,
        description: "Machine learning is the discipline of building systems that improve with experience. Scikit-learn makes classical ML accessible from day one.",
        skills: [
          { name:"Linear Regression",    icon:BarChart2,desc:"Predicting continuous values - the simplest and most interpretable ML model.", level:"Essential" },
          { name:"Classification",       icon:Brain,    desc:"Logistic regression, decision trees, random forests - predicting categories.", level:"Essential" },
          { name:"Model Evaluation",     icon:Target,   desc:"Train/test splits, cross-validation, accuracy, precision, recall, F1.", level:"Essential" },
          { name:"Feature Engineering",  icon:Sparkles, desc:"Encoding, scaling, imputation - preparing raw data for ML models.", level:"Essential" },
          { name:"Clustering",           icon:Layers,   desc:"K-means, DBSCAN - finding natural groups in unlabelled data.", level:"Important" },
        ],
        projects:["House price predictor","Spam email classifier","Customer segmentation"],
        resources:["Scikit-learn user guide","Kaggle Learn (ML)","Hands-On ML (Aurélien Géron)"],
      },
      {
        id: "data-s6",
        title: "Stage 6 - Portfolio & Deployment",
        subtitle: "From notebook to production",
        emoji: "📦",
        color: "#fbbf24",
        duration: "2–3 weeks",
        locked: false,
        description: "A data science portfolio is your job application. Learn to package your work, deploy models as APIs, and present findings to non-technical stakeholders.",
        skills: [
          { name:"Streamlit",            icon:Globe,    desc:"Build interactive data apps with pure Python - deploy ML models with a UI in minutes.", level:"Essential" },
          { name:"FastAPI for ML",       icon:Terminal, desc:"Wrapping a trained model as a REST endpoint for production consumption.", level:"Important" },
          { name:"Kaggle Competitions",  icon:Trophy,   desc:"Practising on public competitions - feature engineering, ensembling, and leaderboard thinking.", level:"Good to Know" },
        ],
        projects:["Interactive ML demo with Streamlit","Model served as FastAPI endpoint","Kaggle competition submission"],
        resources:["Streamlit docs","Kaggle.com","FastAPI ML tutorial"],
      },
    ],
  },
];

/* ══════════════════════════════════════════════════════════════
   LEVEL BADGE
══════════════════════════════════════════════════════════════ */
const LevelBadge = ({ level, T }) => {
  const cfg = {
    "Essential":   { c:"#22c55e" },
    "Important":   { c:"#7c6ee0" },
    "Good to Know":{ c:"#f97316" },
  };
  const c = cfg[level]?.c || T.t3;
  return (
    <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9, fontWeight:700, padding:"2px 6px", borderRadius:4, letterSpacing:"0.4px", background:`${c}16`, color:c, border:`1px solid ${c}28`, whiteSpace:"nowrap", flexShrink:0 }}>
      {level}
    </span>
  );
};

/* ══════════════════════════════════════════════════════════════
   SKILL CARD - inside an expanded stage
══════════════════════════════════════════════════════════════ */
const SkillCard = ({ skill, color, T }) => {
  const [hov, setHov] = useState(false);
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ background:hov?T.hover:T.panel, border:`1px solid ${hov?color+"44":T.b1}`, borderRadius:11, padding:"13px 14px", transition:"all 0.16s", display:"flex", flexDirection:"column", gap:8 }}>
      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
        <div style={{ width:28, height:28, borderRadius:7, background:`${color}16`, border:`1px solid ${color}28`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
          <skill.icon size={13} color={color} />
        </div>
        <span style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:13, color:T.t1, flex:1 }}>{skill.name}</span>
        <LevelBadge level={skill.level} T={T} />
      </div>
      <p style={{ fontFamily:"'Lora',serif", fontSize:13, color:T.t2, lineHeight:1.65, margin:0 }}>{skill.desc}</p>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════
   STAGE CARD - collapsible
══════════════════════════════════════════════════════════════ */
const StageCard = ({ stage, trackColor, stageIndex, isLast, T }) => {
  const [open, setOpen] = useState(false);

  const statusColors = {
    done:    { bg:`${T.green}16`, border:`${T.green}40`, text:T.green },
    current: { bg:`${stage.color}16`, border:`${stage.color}55`, text:stage.color },
    locked:  { bg:T.panel, border:T.b1, text:T.t3 },
  };
  // For this UI all stages are available (no user auth) - show them all as "current"
  const status = "current";
  const sc = statusColors[status];

  return (
    <div style={{ display:"flex", gap:0 }}>
      {/* Spine */}
      <div style={{ display:"flex", flexDirection:"column", alignItems:"center", width:48, flexShrink:0 }}>
        {/* Stage number bubble */}
        <motion.div
          whileHover={{ scale:1.1 }}
          style={{ width:44, height:44, borderRadius:"50%", background:sc.bg, border:`2px solid ${sc.border}`, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", zIndex:1, transition:"all 0.18s", flexShrink:0 }}
          onClick={() => setOpen(o => !o)}>
          <span style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:15, color:sc.text }}>{stage.emoji}</span>
        </motion.div>
        {!isLast && (
          <div style={{ width:2, flex:1, minHeight:32, background:`linear-gradient(to bottom, ${stage.color}60, ${stage.color}20, transparent)`, marginTop:4 }} />
        )}
      </div>

      {/* Content */}
      <div style={{ flex:1, paddingLeft:20, paddingBottom:isLast?0:36 }}>
        {/* Stage header */}
        <div
          onClick={() => setOpen(o => !o)}
          style={{ display:"flex", alignItems:"flex-start", gap:12, marginBottom:open?16:0, cursor:"pointer", paddingTop:10 }}>
          <div style={{ flex:1 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap", marginBottom:4 }}>
              <span style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:"clamp(15px,2.5vw,18px)", color:T.t1, letterSpacing:"-0.2px", lineHeight:1.2 }}>{stage.title}</span>
              <div style={{ display:"flex", alignItems:"center", gap:4, padding:"2px 9px", borderRadius:100, background:`${stage.color}14`, border:`1px solid ${stage.color}35` }}>
                <Clock size={10} color={stage.color} />
                <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10, color:stage.color, fontWeight:600 }}>{stage.duration}</span>
              </div>
            </div>
            <p style={{ fontFamily:"'Lora',serif", fontStyle:"italic", fontSize:14, color:T.t3, margin:0 }}>{stage.subtitle}</p>
          </div>
          <motion.div animate={{ rotate:open?180:0 }} transition={{ duration:0.2 }} style={{ marginTop:12, flexShrink:0 }}>
            <ChevronDown size={18} color={open?stage.color:T.t3} />
          </motion.div>
        </div>

        {/* Expanded body */}
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              initial={{ height:0, opacity:0 }}
              animate={{ height:"auto", opacity:1 }}
              exit={{ height:0, opacity:0 }}
              transition={{ duration:0.28, ease:[0.4,0,0.2,1] }}>
              <div style={{ overflow:"hidden" }}>
                {/* Description */}
                <div style={{ background:`${stage.color}08`, border:`1px solid ${stage.color}22`, borderRadius:12, padding:"14px 16px", marginBottom:18 }}>
                  <p style={{ fontFamily:"'Lora',serif", fontSize:15, color:T.t2, lineHeight:1.78, margin:0 }}>{stage.description}</p>
                </div>

                {/* Skills grid */}
                <p style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:11, color:T.t3, letterSpacing:"1.5px", textTransform:"uppercase", marginBottom:10 }}>Skills in this stage</p>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))", gap:10, marginBottom:20 }}>
                  {stage.skills.map((sk, i) => (
                    <motion.div key={sk.name} initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.05 }}>
                      <SkillCard skill={sk} color={stage.color} T={T} />
                    </motion.div>
                  ))}
                </div>

                {/* Projects + Resources */}
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:16 }}>
                  <div style={{ background:T.panel, border:`1px solid ${T.b1}`, borderRadius:10, padding:"14px 16px" }}>
                    <p style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:11, color:T.t3, letterSpacing:"1.2px", textTransform:"uppercase", marginBottom:10 }}>Build These</p>
                    {stage.projects.map(p => (
                      <div key={p} style={{ display:"flex", alignItems:"center", gap:7, marginBottom:7 }}>
                        <div style={{ width:5, height:5, borderRadius:"50%", background:stage.color, flexShrink:0 }} />
                        <span style={{ fontFamily:"'Syne',sans-serif", fontSize:13, color:T.t1, fontWeight:500 }}>{p}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ background:T.panel, border:`1px solid ${T.b1}`, borderRadius:10, padding:"14px 16px" }}>
                    <p style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:11, color:T.t3, letterSpacing:"1.2px", textTransform:"uppercase", marginBottom:10 }}>Learn From</p>
                    {stage.resources.map(r => (
                      <div key={r} style={{ display:"flex", alignItems:"center", gap:7, marginBottom:7 }}>
                        <BookOpen size={11} color={stage.color} style={{ flexShrink:0 }} />
                        <span style={{ fontFamily:"'Syne',sans-serif", fontSize:13, color:T.t1, fontWeight:500 }}>{r}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* <a href="/register" style={{ display:"inline-flex", alignItems:"center", gap:7, padding:"9px 18px", borderRadius:9, border:`1px solid ${stage.color}44`, background:`${stage.color}12`, color:stage.color, fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:13, cursor:"pointer", textDecoration:"none", transition:"all 0.16s" }} onMouseEnter={e=>e.currentTarget.style.background=`${stage.color}22`} onMouseLeave={e=>e.currentTarget.style.background=`${stage.color}12`}>
                  <Play size={13} /> Start practising this stage
                </a> */}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════
   TRACK TAB
══════════════════════════════════════════════════════════════ */
const TrackTab = ({ track, isActive, onClick, T }) => {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ display:"flex", alignItems:"center", gap:8, padding:"10px 18px", borderRadius:"10px 10px 0 0", border:"none", cursor:"pointer", background:isActive?`${track.color}16`:(hov?T.hover:"transparent"), color:isActive?track.color:(hov?T.t1:T.t2), fontFamily:"'Syne',sans-serif", fontWeight:isActive?700:500, fontSize:14, transition:"all 0.15s", borderBottom:isActive?`2px solid ${track.color}`:"2px solid transparent", flexShrink:0 }}>
      <track.icon size={15} />
      <span>{track.label}</span>
      <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10, padding:"1px 6px", borderRadius:4, background:`${track.color}20`, color:track.color, fontWeight:700 }}>{track.stages.length}</span>
    </button>
  );
};

/* ══════════════════════════════════════════════════════════════
   REVEAL
══════════════════════════════════════════════════════════════ */
const Reveal = ({ children, delay=0, y=20 }) => (
  <motion.div initial={{ opacity:0, y }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true, margin:"-50px" }} transition={{ duration:0.55, delay, ease:[0.22,1,0.36,1] }}>
    {children}
  </motion.div>
);

/* ══════════════════════════════════════════════════════════════
   GRID BACKGROUND
══════════════════════════════════════════════════════════════ */
const GridBg = ({ T }) => (
  <div style={{ position:"absolute", inset:0, pointerEvents:"none", backgroundImage:`linear-gradient(${T.b1} 1px,transparent 1px),linear-gradient(90deg,${T.b1} 1px,transparent 1px)`, backgroundSize:"52px 52px", maskImage:"radial-gradient(ellipse 80% 60% at 50% 40%,black 30%,transparent 100%)" }} />
);

/* ══════════════════════════════════════════════════════════════
   MAIN
══════════════════════════════════════════════════════════════ */
export default function Roadmap() {
  const T = useTheme();
  const [activeTrack, setActiveTrack] = useState("web");
  const track = TRACKS.find(t => t.id === activeTrack);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600&family=Syne:wght@400;500;600;700;800&family=Lora:ital,wght@0,400;0,500;1,400;1,500&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        html{scroll-behavior:smooth;}
        body{background:${T.shell};}
        ::-webkit-scrollbar{width:5px;}::-webkit-scrollbar-track{background:${T.shell};}
        ::-webkit-scrollbar-thumb{background:${T.hover};border-radius:3px;}
        ::selection{background:${T.accentS};}
        @keyframes cjUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
        @keyframes cjGlow{0%,100%{box-shadow:0 0 20px ${T.accent}44}50%{box-shadow:0 0 48px ${T.accent}77}}
        @keyframes cjFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
        .track-tabs{overflow-x:auto;-webkit-overflow-scrolling:touch;}
        .track-tabs::-webkit-scrollbar{height:3px;}
        @media(max-width:640px){
          .stage-detail-grid{grid-template-columns:1fr!important;}
          .skill-grid{grid-template-columns:1fr!important;}
        }
      `}</style>

      <div style={{ minHeight:"100vh", background:T.shell, color:T.t1, fontFamily:"'Syne',sans-serif" }}>

        {/* ── HERO ── */}
        <section style={{ position:"relative", background:T.deep, padding:"100px 24px 72px", overflow:"hidden", borderBottom:`1px solid ${T.b1}` }}>
          <GridBg T={T} />
          <div style={{ position:"absolute", left:"50%", top:"50%", transform:"translate(-50%,-50%)", width:600, height:360, borderRadius:"50%", background:`radial-gradient(ellipse,${T.accent}1c 0%,${T.teal}0c 40%,transparent 70%)`, filter:"blur(50px)", pointerEvents:"none" }} />

          <div style={{ maxWidth:800, margin:"0 auto", position:"relative", textAlign:"center" }}>
            <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.08 }}
              style={{ display:"inline-flex", alignItems:"center", gap:7, padding:"4px 14px", borderRadius:100, background:`${T.accent}14`, border:`1px solid ${T.accent}40`, marginBottom:22 }}>
              <Map size={12} color={T.accent} />
              <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10, fontWeight:700, color:T.accent, letterSpacing:"1.8px", textTransform:"uppercase" }}>Learning Roadmap</span>
            </motion.div>

            <motion.h1 initial={{ opacity:0, y:18 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.15 }}
              style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:"clamp(34px,5.5vw,64px)", lineHeight:1.07, letterSpacing:"-1.5px", marginBottom:18, color:T.t1 }}>
              Your Path.<br />
              <span style={{ color:T.accent }}>Stage by Stage.</span>
            </motion.h1>

            <motion.p initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.24 }}
              style={{ fontFamily:"'Lora',serif", fontStyle:"italic", fontSize:"clamp(15px,2vw,19px)", color:T.t2, lineHeight:1.82, maxWidth:560, margin:"0 auto 36px" }}>
              Pick a track. Follow the stages in order. Each stage tells you exactly what to learn, what to build, and where to learn it - no guessing, no overwhelm.
            </motion.p>

            {/* Track overview pills */}
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.36 }}
              style={{ display:"flex", justifyContent:"center", gap:12, flexWrap:"wrap" }}>
              {TRACKS.map(t => (
                <div key={t.id} onClick={() => setActiveTrack(t.id)}
                  style={{ display:"flex", alignItems:"center", gap:7, padding:"8px 16px", borderRadius:10, background:activeTrack===t.id?`${t.color}16`:T.panel, border:`1px solid ${activeTrack===t.id?t.color+"44":T.b1}`, cursor:"pointer", transition:"all 0.18s" }}>
                  <t.icon size={14} color={t.color} />
                  <span style={{ fontFamily:"'Syne',sans-serif", fontWeight:600, fontSize:13.5, color:activeTrack===t.id?t.color:T.t2 }}>{t.label}</span>
                  <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10.5, color:activeTrack===t.id?t.color:T.t3 }}>{t.duration}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── STICKY TRACK TABS ── */}
        {/* <div style={{ background:T.deep, borderBottom:`1px solid ${T.b1}`, position:"sticky", top:0, zIndex:50, backdropFilter:"blur(16px)" }}>
          <div style={{ maxWidth:1000, margin:"0 auto", padding:"0 24px" }}>
            <div className="track-tabs" style={{ display:"flex", gap:2, paddingTop:4 }}>
              {TRACKS.map(tr => (
                <TrackTab key={tr.id} track={tr} isActive={activeTrack===tr.id} onClick={() => setActiveTrack(tr.id)} T={T} />
              ))}
            </div>
          </div>
        </div> */}

        {/* ── TRACK CONTENT ── */}
        <AnimatePresence mode="wait">
          <motion.div key={activeTrack} initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-8 }} transition={{ duration:0.22 }}>

            {/* Track intro banner */}
            <section style={{ background:`${track.color}08`, borderBottom:`1px solid ${track.color}22`, padding:"40px 24px" }}>
              <div style={{ maxWidth:1000, margin:"0 auto", display:"flex", alignItems:"flex-start", gap:48, flexWrap:"wrap" }}>
                <div style={{ flex:1, minWidth:260 }}>
                  <div style={{ display:"inline-flex", alignItems:"center", gap:7, padding:"4px 13px", borderRadius:100, background:`${track.color}16`, border:`1px solid ${track.color}40`, marginBottom:14 }}>
                    <track.icon size={13} color={track.color} />
                    <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10, fontWeight:700, color:track.color, letterSpacing:"1.5px", textTransform:"uppercase" }}>{track.label}</span>
                  </div>
                  <h2 style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:"clamp(22px,3.5vw,34px)", color:T.t1, marginBottom:10, letterSpacing:"-0.4px", lineHeight:1.15 }}>{track.tagline}</h2>
                  <p style={{ fontFamily:"'Lora',serif", fontSize:16, color:T.t2, lineHeight:1.82, maxWidth:500 }}>{track.description}</p>
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:12, minWidth:200 }}>
                  {[
                    { label:"Timeline",  val:track.duration,  icon:Clock   },
                    { label:"Outcome",   val:track.outcome,   icon:Flag    },
                    { label:"Stages",    val:`${track.stages.length} stages`, icon:Layers },
                  ].map(item => (
                    <div key={item.label} style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 14px", background:T.card, border:`1px solid ${T.b1}`, borderRadius:10 }}>
                      <div style={{ width:32, height:32, borderRadius:8, background:`${track.color}14`, border:`1px solid ${track.color}30`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                        <item.icon size={14} color={track.color} />
                      </div>
                      <div>
                        <p style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9, color:T.t3, textTransform:"uppercase", letterSpacing:"1px", margin:"0 0 2px" }}>{item.label}</p>
                        <p style={{ fontFamily:"'Syne',sans-serif", fontSize:13.5, color:T.t1, margin:0, fontWeight:600 }}>{item.val}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* How to use hint */}
            <div style={{ background:T.mid, padding:"14px 24px", borderBottom:`1px solid ${T.b1}` }}>
              <div style={{ maxWidth:1000, margin:"0 auto" }}>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <Sparkles size={13} color={T.accent} />
                  <span style={{ fontFamily:"'Syne',sans-serif", fontSize:13, color:T.t3, fontWeight:500 }}>
                    Click any stage card to expand it and see the full skills, projects and resources.
                    Follow stages <strong style={{ color:T.t2 }}>in order</strong> - each one builds on the last.
                  </span>
                </div>
              </div>
            </div>

            {/* ── STAGE TIMELINE ── */}
            <section style={{ padding:"56px 24px 100px", background:T.mid }}>
              <div style={{ maxWidth:1000, margin:"0 auto" }}>
                <div style={{ display:"flex", flexDirection:"column", gap:0 }}>
                  {track.stages.map((stage, i) => (
                    <Reveal key={stage.id} delay={i*0.06}>
                      <StageCard
                        stage={stage}
                        trackColor={track.color}
                        stageIndex={i}
                        isLast={i === track.stages.length - 1}
                        T={T}
                      />
                    </Reveal>
                  ))}
                </div>
              </div>
            </section>

          </motion.div>
        </AnimatePresence>

        {/* ── HOW TO USE THE ROADMAP ── */}
        <section style={{ padding:"72px 24px", background:T.deep, borderTop:`1px solid ${T.b1}` }}>
          <div style={{ maxWidth:1000, margin:"0 auto" }}>
            <Reveal>
              <div style={{ textAlign:"center", marginBottom:44 }}>
                <div style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"4px 13px", borderRadius:100, background:`${T.teal}14`, border:`1px solid ${T.teal}40`, marginBottom:14 }}>
                  <Compass size={12} color={T.teal} />
                  <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10, fontWeight:700, color:T.teal, letterSpacing:"1.5px", textTransform:"uppercase" }}>How to Use This Roadmap</span>
                </div>
                <h2 style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:"clamp(24px,4vw,38px)", color:T.t1, letterSpacing:"-0.6px", marginBottom:10 }}>A Map, Not a To-Do List</h2>
                <p style={{ fontFamily:"'Lora',serif", fontStyle:"italic", fontSize:16, color:T.t2, maxWidth:480, margin:"0 auto" }}>The roadmap tells you what order to learn in. The platform tells you how. Use both together.</p>
              </div>
            </Reveal>

            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))", gap:16 }}>
              {[
                { n:"01", icon:Compass, color:T.accent,  title:"Pick a track",        desc:"Choose Web, App or Data Science based on what excites you - not what sounds impressive." },
                { n:"02", icon:Target,  color:T.teal,    title:"Complete one stage",   desc:"Don't jump ahead. Finish each stage's skills and build at least one of the suggested projects as per your track." },
                { n:"03", icon:Code2,   color:T.gold,    title:"Practise the code",  desc:"Every skill has corresponding snippets inside Code Journey. Write real code, get real feedback." },
                { n:"04", icon:Trophy,  color:T.green,   title:"Move to the next",     desc:"Only move forward when you can build a project from that stage without looking everything up." },
              ].map((step, i) => (
                <Reveal key={step.n} delay={i*0.08} y={16}>
                  <div style={{ background:T.card, border:`1px solid ${T.b1}`, borderRadius:16, padding:"22px 20px", transition:"all 0.2s" }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = `${step.color}44`; e.currentTarget.style.transform = "translateY(-3px)"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = T.b1; e.currentTarget.style.transform = "translateY(0)"; }}>
                    <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
                      <div style={{ width:36, height:36, borderRadius:10, background:`${step.color}16`, border:`1px solid ${step.color}30`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                        <step.icon size={16} color={step.color} />
                      </div>
                      <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:12, fontWeight:700, color:step.color }}>{step.n}</span>
                    </div>
                    <h3 style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:15, color:T.t1, marginBottom:7 }}>{step.title}</h3>
                    <p style={{ fontFamily:"'Lora',serif", fontSize:13.5, color:T.t2, lineHeight:1.7, margin:0 }}>{step.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section style={{ padding:"80px 24px", position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", left:"50%", top:"50%", transform:"translate(-50%,-50%)", width:600, height:300, borderRadius:"50%", background:`radial-gradient(ellipse,${T.accent}1c 0%,transparent 70%)`, filter:"blur(40px)", pointerEvents:"none" }} />
          <div style={{ position:"absolute", inset:0, pointerEvents:"none", backgroundImage:`linear-gradient(${T.b1} 1px,transparent 1px),linear-gradient(90deg,${T.b1} 1px,transparent 1px)`, backgroundSize:"52px 52px", maskImage:"radial-gradient(ellipse 70% 70% at 50% 50%,black 30%,transparent 100%)" }} />
          <Reveal>
            <div style={{ maxWidth:540, margin:"0 auto", textAlign:"center", position:"relative" }}>
              <motion.div animate={{ y:[0,-6,0] }} transition={{ duration:3, repeat:Infinity }}
                style={{ display:"inline-flex", width:56, height:56, borderRadius:16, background:`linear-gradient(135deg,${T.accent},${T.teal})`, alignItems:"center", justifyContent:"center", fontSize:22, fontWeight:800, color:"#fff", fontFamily:"'Syne',sans-serif", marginBottom:22, boxShadow:`0 0 36px ${T.accent}50` }}>
                CJ
              </motion.div>
              <h2 style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:"clamp(28px,4.5vw,46px)", color:T.t1, marginBottom:14, letterSpacing:"-0.9px", lineHeight:1.1 }}>
                The Roadmap Is Here.<br /><span style={{ color:T.accent }}>Start Walking It.</span>
              </h2>
              <p style={{ fontFamily:"'Lora',serif", fontStyle:"italic", fontSize:17, color:T.t2, lineHeight:1.8, marginBottom:36 }}>
                Pick a stage. Practice your first line. That's it - the rest follows naturally.
              </p>
              <div style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap" }}>
                <a href="/register" style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"13px 28px", borderRadius:12, border:"none", background:T.accent, color:"#fff", fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:15, cursor:"pointer", textDecoration:"none", boxShadow:`0 0 36px ${T.accent}55`, transition:"all 0.18s", animation:"cjGlow 3s ease infinite" }}>
                  <Zap size={15} /> Start Free
                </a>
                <a href="/tracks" style={{ display:"inline-flex", alignItems:"center", gap:7, padding:"13px 22px", borderRadius:12, border:`1px solid ${T.b2}`, background:"transparent", color:T.t1, fontFamily:"'Syne',sans-serif", fontWeight:600, fontSize:15, cursor:"pointer", textDecoration:"none", transition:"all 0.18s" }}
                  onMouseEnter={e => { e.currentTarget.style.background = T.hover; e.currentTarget.style.borderColor = T.b3; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = T.b2; }}>
                  Browse Languages <ArrowRight size={15} />
                </a>
              </div>
              <div style={{ marginTop:28, display:"flex", justifyContent:"center", gap:20, flexWrap:"wrap" }}>
                {["3 tracks","18 stages total","Zero prerequisites"].map(t => (
                  <div key={t} style={{ display:"flex", alignItems:"center", gap:5 }}>
                    <div style={{ width:5, height:5, borderRadius:"50%", background:T.green }} />
                    <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:11.5, color:T.t3, fontWeight:600 }}>{t}</span>
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