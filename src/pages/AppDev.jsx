/**
 * Code Journey — App Development Deep Dive
 */
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Smartphone, ExternalLink, ChevronDown, CheckCircle2, ChevronRight, BookOpen, Play } from "lucide-react";

const PT = {
  cosmos:{ shell:"#07080d",deep:"#0c0e18",mid:"#111420",surface:"#161927",panel:"#1a1e2e",hover:"#1e2335",card:"#161927",cardH:"#1c2235",t1:"#e8eaf2",t2:"#8892b0",t3:"#5a6488",t4:"#2e3660",b1:"rgba(120,130,180,0.08)",b2:"rgba(120,130,180,0.15)",b3:"rgba(120,130,180,0.24)",acc:"#5eead4",accS:"rgba(94,234,212,0.14)",teal:"#5eead4",green:"#22c55e",red:"#f87171",gold:"#fbbf24",dark:true},
  void:{   shell:"#000",   deep:"#050507",mid:"#0a0a0f",surface:"#0f0f15",panel:"#141419",hover:"#1a1a22",card:"#0f0f15",cardH:"#161622",t1:"#f0f0ff",t2:"#9090b8",t3:"#505070",t4:"#252540",b1:"rgba(100,100,200,0.08)",b2:"rgba(100,100,200,0.14)",b3:"rgba(100,100,200,0.22)",acc:"#2dd4bf",accS:"rgba(45,212,191,0.14)",teal:"#2dd4bf",green:"#34d399",red:"#fc8181",gold:"#fcd34d",dark:true},
  aurora:{ shell:"#040e0e",deep:"#071414",mid:"#0b1c1c",surface:"#102424",panel:"#142a2a",hover:"#1a3333",card:"#102424",cardH:"#162e2e",t1:"#e0f5f5",t2:"#7ab8b8",t3:"#3d7878",t4:"#1e4444",b1:"rgba(80,200,180,0.08)",b2:"rgba(80,200,180,0.15)",b3:"rgba(80,200,180,0.24)",acc:"#5eead4",accS:"rgba(94,234,212,0.14)",teal:"#5eead4",green:"#4ade80",red:"#f87171",gold:"#fbbf24",dark:true},
  nord:{   shell:"#1a1f2e",deep:"#1e2535",mid:"#232c40",surface:"#28334a",panel:"#2d3a50",hover:"#344260",card:"#28334a",cardH:"#2e3d55",t1:"#eceff4",t2:"#9ba8c0",t3:"#5c6a88",t4:"#3a4560",b1:"rgba(136,192,208,0.1)",b2:"rgba(136,192,208,0.18)",b3:"rgba(136,192,208,0.28)",acc:"#8fbcbb",accS:"rgba(136,192,208,0.14)",teal:"#8fbcbb",green:"#a3be8c",red:"#bf616a",gold:"#ebcb8b",dark:true},
  light:{  shell:"#f3f4f8",deep:"#fff",   mid:"#f0f1f7",surface:"#fff",   panel:"#f7f8fc",hover:"#eef0f8",card:"#fff",   cardH:"#f5f6fc",t1:"#111827",t2:"#4b5680",t3:"#7c87a8",t4:"#c5ccdf",b1:"rgba(80,90,150,0.08)",b2:"rgba(80,90,150,0.15)",b3:"rgba(80,90,150,0.24)",acc:"#0d9488",accS:"rgba(13,148,136,0.1)",teal:"#0d9488",green:"#16a34a",red:"#dc2626",gold:"#d97706",dark:false},
};
const getT=()=>{try{return PT[localStorage.getItem("cj-theme")]||PT.cosmos;}catch{return PT.cosmos;}};
function useTheme(){const[T,setT]=useState(getT);useEffect(()=>{const iv=setInterval(()=>{const f=getT();if(f.teal!==T.teal)setT(f);},500);return()=>clearInterval(iv);},[T]);useEffect(()=>{const fn=()=>setT(getT());window.addEventListener("storage",fn);return()=>window.removeEventListener("storage",fn);},[]);return T;}

const HL = ({ code, T }) => {
  const lines = code.split("\n");
  const colorize = (line) => {
    let html = line.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
    html = html.replace(/(".*?"|'.*?')/g, m => `<span style="color:#ce9178">${m}</span>`);
    html = html.replace(/\b(fun|val|var|if|else|return|class|object|data|is|when|override|suspend|fun|import|package|Widget|StatelessWidget|StatefulWidget|State|BuildContext|super|this|null|true|false|void|final|const|new|await|async)\b/g, m => `<span style="color:#c792ea">${m}</span>`);
    html = html.replace(/\b(\d+\.?\d*)\b/g, m => `<span style="color:#f78c6c">${m}</span>`);
    html = html.replace(/(\/\/.*)/g, m => `<span style="color:#6a9955">${m}</span>`);
    return html;
  };
  return (
    <div style={{ background:T.deep, borderRadius:10, overflow:"hidden", border:`1px solid ${T.b2}`, fontFamily:"'JetBrains Mono',monospace" }}>
      <div style={{ background:T.panel, padding:"8px 14px", borderBottom:`1px solid ${T.b1}`, display:"flex", gap:5 }}>
        {["#f47067","#f9c74f","#6fcf97"].map((c,i)=><div key={i} style={{ width:10,height:10,borderRadius:"50%",background:c }}/>)}
      </div>
      <div style={{ padding:"16px", overflowX:"auto" }}>
        {lines.map((line,i)=>(
          <div key={i} style={{ display:"flex", lineHeight:"1.72" }}>
            <span style={{ color:T.t4, width:28, flexShrink:0, userSelect:"none", fontSize:11 }}>{i+1}</span>
            <span style={{ fontSize:12.5, color:T.t2, whiteSpace:"pre" }} dangerouslySetInnerHTML={{ __html:colorize(line) }}/>
          </div>
        ))}
      </div>
    </div>
  );
};

const Res = ({ icon:Icon, label, sub, href, color, T }) => (
  <a href={href} target="_blank" rel="noreferrer"
    style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 13px", borderRadius:9, border:`1px solid ${T.b1}`, background:T.card, textDecoration:"none", transition:"all 0.16s" }}
    onMouseEnter={e=>{e.currentTarget.style.borderColor=`${color}55`;e.currentTarget.style.background=T.cardH;}}
    onMouseLeave={e=>{e.currentTarget.style.borderColor=T.b1;e.currentTarget.style.background=T.card;}}>
    <div style={{ width:32,height:32,borderRadius:8,background:`${color}16`,border:`1px solid ${color}28`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
      <Icon size={14} color={color}/>
    </div>
    <div style={{ minWidth:0 }}>
      <p style={{ fontFamily:"'Syne',sans-serif",fontWeight:600,fontSize:13,color:T.t1,margin:0,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis" }}>{label}</p>
      <p style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:T.t3,margin:0 }}>{sub}</p>
    </div>
    <ExternalLink size={12} color={T.t3} style={{ marginLeft:"auto",flexShrink:0 }}/>
  </a>
);
const Reveal=({children,delay=0,y=18})=>(<motion.div initial={{opacity:0,y}} whileInView={{opacity:1,y:0}} viewport={{once:true,margin:"-40px"}} transition={{duration:0.55,delay,ease:[0.22,1,0.36,1]}}>{children}</motion.div>);
const SH=({n,title,subtitle,color,T})=>(<div style={{marginBottom:32}}><div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}><span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,fontWeight:700,color,background:`${color}14`,border:`1px solid ${color}28`,padding:"2px 8px",borderRadius:4}}>{n}</span><h2 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:"clamp(22px,3.5vw,30px)",color:T.t1,margin:0,letterSpacing:"-0.5px"}}>{title}</h2></div><p style={{fontFamily:"'Lora',serif",fontStyle:"italic",fontSize:16,color:T.t2,lineHeight:1.75,margin:0}}>{subtitle}</p><div style={{height:3,width:40,borderRadius:2,background:color,marginTop:12,opacity:0.75}}/></div>);

const LangCard = ({ lang, T }) => {
  const [open, setOpen] = useState(false);
  return (
    <Reveal>
      <div style={{ border:`1px solid ${open?lang.color+"44":T.b1}`, borderRadius:14, overflow:"hidden", marginBottom:14, transition:"border 0.18s" }}>
        <div onClick={()=>setOpen(o=>!o)} style={{ display:"flex", alignItems:"center", gap:14, padding:"18px 20px", background:open?`${lang.color}08`:T.card, cursor:"pointer", transition:"background 0.18s" }}>
          <div style={{ width:44,height:44,borderRadius:12,background:lang.bg,border:`1.5px solid ${lang.color}44`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700,color:lang.color,fontFamily:"'JetBrains Mono',monospace",flexShrink:0 }}>{lang.icon}</div>
          <div style={{ flex:1 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:3 }}>
              <h3 style={{ fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:17,color:T.t1,margin:0 }}>{lang.name}</h3>
              <span style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:9.5,fontWeight:700,padding:"1px 7px",borderRadius:4,background:`${lang.color}14`,color:lang.color,border:`1px solid ${lang.color}28` }}>{lang.level}</span>
              {lang.platforms&&<span style={{ fontFamily:"'Syne',sans-serif",fontSize:11,color:T.t3 }}>{lang.platforms}</span>}
            </div>
            <p style={{ fontFamily:"'Lora',serif",fontSize:13.5,color:T.t3,margin:0,fontStyle:"italic" }}>{lang.tagline}</p>
          </div>
          <motion.div animate={{ rotate:open?180:0 }} transition={{ duration:0.2 }}>
            <ChevronDown size={18} color={open?lang.color:T.t3}/>
          </motion.div>
        </div>
        <AnimatePresence initial={false}>
          {open&&(
            <motion.div initial={{height:0,opacity:0}} animate={{height:"auto",opacity:1}} exit={{height:0,opacity:0}} transition={{duration:0.26,ease:[0.4,0,0.2,1]}}>
              <div style={{ padding:"20px", borderTop:`1px solid ${T.b1}`, background:T.mid }}>
                <div style={{ background:`${lang.color}0c`,border:`1px solid ${lang.color}22`,borderRadius:10,padding:"13px 15px",marginBottom:18 }}>
                  <p style={{ fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:11,color:lang.color,letterSpacing:"1px",textTransform:"uppercase",marginBottom:5 }}>💡 Think of it as…</p>
                  <p style={{ fontFamily:"'Lora',serif",fontSize:14.5,color:T.t1,lineHeight:1.72,margin:0 }}>{lang.analogy}</p>
                </div>
                <p style={{ fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:11,color:T.t3,letterSpacing:"1.2px",textTransform:"uppercase",marginBottom:10 }}>What you'll learn</p>
                <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:8,marginBottom:20 }}>
                  {lang.topics.map((t,i)=>(
                    <div key={i} style={{ display:"flex",gap:8,alignItems:"flex-start",padding:"8px 10px",background:T.panel,borderRadius:8,border:`1px solid ${T.b1}` }}>
                      <CheckCircle2 size={13} color={lang.color} style={{ flexShrink:0,marginTop:1 }}/>
                      <span style={{ fontFamily:"'Syne',sans-serif",fontSize:12.5,color:T.t1 }}>{t}</span>
                    </div>
                  ))}
                </div>
                <p style={{ fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:11,color:T.t3,letterSpacing:"1.2px",textTransform:"uppercase",marginBottom:10 }}>Real example</p>
                <HL code={lang.code} T={T}/>
                <p style={{ fontFamily:"'Lora',serif",fontSize:13.5,color:T.t2,lineHeight:1.7,marginTop:12,fontStyle:"italic" }}>{lang.codeNote}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Reveal>
  );
};

const APP_LANGS = [
  {
    name:"Dart", icon:"◈", level:"Foundation", color:"#5eead4", bg:"#001a17", platforms:"for Flutter",
    tagline:"Clean, fast, null-safe — Flutter's language.",
    analogy:"Dart is to Flutter what JavaScript is to React. You can't use Flutter without Dart, and Dart was literally designed by Google to be the best language for building Flutter apps. The good news: it's one of the cleanest languages to learn. If you've seen JavaScript or Java, Dart will feel familiar but cleaner.",
    topics:["Variables (var, final, const) and null safety", "Functions, named parameters, arrow syntax", "Classes, constructors, inheritance", "Lists, Maps, and higher-order methods", "async/await and Futures", "Streams — for real-time data flow"],
    code:`// Null-safe Dart — no accidental null crashes
class User {
  final String name;
  final String? bio; // ? means it can be null

  const User({ required this.name, this.bio });

  String get greeting => 'Hello, $name!';
}

// Async function — fetches data from an API
Future<User> fetchUser(int id) async {
  final response = await http.get(
    Uri.parse('https://api.example.com/users/$id')
  );
  final data = jsonDecode(response.body);
  return User(name: data['name'], bio: data['bio']);
}`,
    codeNote:"The ? after String means the bio field is optional — it might be null. Dart's null safety forces you to handle this case, preventing a whole class of crashes. The async/await pattern is identical to JavaScript's."
  },
  {
    name:"Flutter", icon:"⬡", level:"Core", color:"#38bdf8", bg:"#001220", platforms:"iOS · Android · Web · Desktop",
    tagline:"One codebase. Every screen.",
    analogy:"Before Flutter, if you wanted your app on iPhone AND Android, you needed two separate teams writing the same app twice — once in Swift, once in Kotlin. Flutter lets one team write it once in Dart and it runs natively on both. Meta uses React Native, Alibaba uses Flutter — both are billion-dollar solutions to the same problem.",
    topics:["Everything is a Widget — Text, Button, Container", "Stateless vs Stateful widgets", "Column, Row, Stack, ListView layouts", "State management with Provider or Riverpod", "Navigation and routes between screens", "HTTP requests and JSON parsing", "Publishing to App Store and Play Store"],
    code:`// A real stateful counter widget
class Counter extends StatefulWidget {
  const Counter({super.key});

  @override
  State<Counter> createState() => _CounterState();
}

class _CounterState extends State<Counter> {
  int _count = 0;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Counter')),
      body: Center(
        child: Text(
          '$_count',
          style: const TextStyle(fontSize: 64),
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => setState(() => _count++),
        child: const Icon(Icons.add),
      ),
    );
  }
}`,
    codeNote:"This is a complete, runnable Flutter screen. When you tap the +, setState() tells Flutter 'something changed, re-draw the widget'. Flutter only redraws what changed — this is why Flutter apps feel as fast as native code."
  },
  {
    name:"Kotlin", icon:"Kt", level:"Advanced", color:"#a78bfa", bg:"#0c0c1a", platforms:"Android native",
    tagline:"Android's official language. Concise and safe.",
    analogy:"Kotlin is what you use when you want deep Android-native access — custom camera control, Bluetooth, NFC payments. Think of it as the 'native' option: more power, more control, steeper learning curve. Google officially recommends Kotlin for all new Android development. It replaced Java because it writes the same thing in half the lines with far fewer bugs.",
    topics:["val/var, data classes, when expressions", "Null safety (? and !! operators)", "Extension functions — add methods to any class", "Coroutines — lightweight async without callback hell", "Jetpack Compose — modern declarative UI for Android", "ViewModel and LiveData — app architecture patterns"],
    code:`// Coroutines + Flow for real-time data
class WeatherViewModel : ViewModel() {
  private val _weather = MutableStateFlow<Weather?>(null)
  val weather: StateFlow<Weather?> = _weather

  fun loadWeather(city: String) {
    viewModelScope.launch {
      try {
        val result = weatherRepo.getWeather(city)
        _weather.value = result
      } catch (e: Exception) {
        // handle error
      }
    }
  }
}

// Jetpack Compose UI that reacts to the data
@Composable
fun WeatherScreen(vm: WeatherViewModel) {
  val weather by vm.weather.collectAsState()
  weather?.let { Text("\${it.city}: \${it.temp}°C") }
}`,
    codeNote:"This is the recommended Android architecture pattern in 2024. The ViewModel fetches data using coroutines (no callback mess). The Compose UI automatically re-renders when the weather state changes. Clean, readable, no boilerplate."
  },
  {
    name:"Swift", icon:"Sw", level:"Advanced", color:"#f97316", bg:"#1a0a00", platforms:"iOS · macOS · watchOS",
    tagline:"Apple's language. The only way to truly build for iPhone.",
    analogy:"Swift is to Apple what Kotlin is to Android. If you want to build something that feels deeply native on an iPhone — custom camera apps, Apple Watch faces, widgets on the home screen — Swift is what you use. Apple made Swift specifically to replace Objective-C with something modern, safe, and fast. It compiles to machine code so apps are blazing fast.",
    topics:["Optionals — Swift's null safety system", "Structs and Classes — when to use which", "Protocols — Swift's version of interfaces", "Closures — functions that capture their environment", "SwiftUI — Apple's declarative UI framework", "Combine and async/await for networking"],
    code:`// SwiftUI — Apple's modern UI framework
import SwiftUI

struct ProfileView: View {
  @State private var name = ""
  @State private var isLoading = false

  var body: some View {
    VStack(spacing: 16) {
      TextField("Enter your name", text: $name)
        .textFieldStyle(.roundedBorder)

      Button("Greet") {
        isLoading = true
        // API call would go here
      }
      .buttonStyle(.borderedProminent)
      .disabled(name.isEmpty)

      if isLoading {
        ProgressView("Loading...")
      }
    }
    .padding()
  }
}`,
    codeNote:"SwiftUI uses a declarative style — you describe WHAT the UI should look like, not HOW to build it. The @State property wrapper automatically re-renders the view when name changes. The $ before name creates a two-way binding between the TextField and the variable."
  },
  {
    name:"React Native", icon:"RN", level:"Framework", color:"#61dafb", bg:"#001820", platforms:"iOS · Android",
    tagline:"Write React. Get a real mobile app.",
    analogy:"If you already know React from web development, React Native is the fastest path to mobile. You write almost identical code — components, props, state, hooks — and instead of rendering HTML divs, React Native maps them to real native mobile components. Instagram's early mobile app was React Native. Shopify's merchant app is React Native.",
    topics:["View, Text, Image — the native equivalents of div, p, img", "StyleSheet — CSS-like styling but for mobile", "FlatList and ScrollView for long content", "React Navigation — screen navigation patterns", "Async Storage — local data persistence", "Expo — build without Xcode or Android Studio"],
    code:`import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Count: {count}</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => setCount(c => c + 1)}
      >
        <Text style={styles.btnText}>Tap me</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title:     { fontSize: 32, fontWeight: 'bold', marginBottom: 24 },
  button:    { backgroundColor: '#61dafb', padding: 16, borderRadius: 8 },
  btnText:   { color: '#000', fontWeight: '600' },
});`,
    codeNote:"Notice how familiar this is if you know React — useState, JSX, event handlers. The main differences: View instead of div, Text instead of p, TouchableOpacity instead of button, StyleSheet instead of CSS. Your existing React knowledge transfers almost 1:1."
  },
];

const APP_BUILDS = ["A to-do app for iPhone and Android","A real-time chat app with Firebase","A weather app with animations","An e-commerce app with cart functionality","A custom camera app with filters"];

const APP_RESOURCES = [
  { icon:BookOpen, label:"Flutter Official Docs",    sub:"flutter.dev — comprehensive Flutter guide",               href:"https://flutter.dev/learn",         color:"#38bdf8" },
  { icon:BookOpen, label:"Dart Language Tour",       sub:"dart.dev — complete Dart language guide",                href:"https://dart.dev/language",         color:"#5eead4" },
  { icon:BookOpen, label:"Apple Developer Docs",     sub:"Swift and SwiftUI official documentation",               href:"https://developer.apple.com/documentation/swiftui", color:"#f97316" },
  { icon:BookOpen, label:"Android Developer (Kotlin)",sub:"Kotlin and Jetpack official Android guide",             href:"https://developer.android.com/kotlin", color:"#a78bfa" },
  { icon:BookOpen, label:"React Native Docs",        sub:"reactnative.dev — official RN guide",                    href:"https://reactnative.dev",            color:"#61dafb" },
  { icon:BookOpen, label:"Expo Docs",                sub:"Build React Native apps without native tooling",          href:"https://docs.expo.dev",              color:"#f9c74f" },
  { icon:Play,  label:"Robert Brunhage (Flutter)",sub:"Youtube — best Flutter beginner tutorials",               href:"https://www.Youtube.com/@RobertBrunhage",           color:"#38bdf8" },
  { icon:Play,  label:"Code With Andrea (Flutter)",sub:"Youtube — Flutter + Dart deep dives",                  href:"https://www.Youtube.com/@CodeWithAndrea",           color:"#5eead4" },
  { icon:Play,  label:"Hacking with Swift",       sub:"Youtube — Swift and SwiftUI courses",                    href:"https://www.Youtube.com/@twostraws",                color:"#f97316" },
  { icon:Play,  label:"Fireship (React Native)",  sub:"Youtube — quick RN overviews and projects",              href:"https://www.Youtube.com/@Fireship",                 color:"#61dafb" },
];

export default function AppDev() {
  const T = useTheme();
  const [activeTab, setActiveTab] = useState("journey");
  const TRACK_COLOR = T.teal;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600&family=Syne:wght@400;500;600;700;800&family=Lora:ital,wght@0,400;0,500;1,400;1,500&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}body{background:${T.shell};}
        ::-webkit-scrollbar{width:5px;}::-webkit-scrollbar-thumb{background:${T.hover};border-radius:3px;}
        ::selection{background:${T.accS};}
        @keyframes cjUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
      `}</style>
      <div style={{ minHeight:"100vh", background:T.shell, color:T.t1, fontFamily:"'Syne',sans-serif" }}>

        {/* HERO */}
        <section style={{ background:T.deep, borderBottom:`1px solid ${T.b1}`, padding:"100px 24px 56px", position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute",inset:0,pointerEvents:"none",backgroundImage:`linear-gradient(${T.b1} 1px,transparent 1px),linear-gradient(90deg,${T.b1} 1px,transparent 1px)`,backgroundSize:"52px 52px",maskImage:"radial-gradient(ellipse 80% 60% at 50% 40%,black 30%,transparent 100%)" }}/>
          <div style={{ position:"absolute",left:"50%",top:"40%",transform:"translate(-50%,-50%)",width:600,height:400,borderRadius:"50%",background:`radial-gradient(ellipse,${T.teal}1c 0%,${T.teal}0c 40%,transparent 70%)`,filter:"blur(50px)",pointerEvents:"none" }}/>
          <div style={{ maxWidth:860, margin:"0 auto", position:"relative" }}>
            <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:0.08}}
              style={{ display:"inline-flex", alignItems:"center", gap:7, padding:"4px 14px", borderRadius:100, background:`${T.teal}14`, border:`1px solid ${T.teal}40`, marginBottom:20 }}>
              <Smartphone size={12} color={T.teal}/>
              <span style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:10,fontWeight:700,color:T.teal,letterSpacing:"1.8px",textTransform:"uppercase" }}>App Development</span>
            </motion.div>
            <motion.h1 initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} transition={{delay:0.15}}
              style={{ fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:"clamp(36px,6vw,64px)",lineHeight:1.06,letterSpacing:"-1.5px",marginBottom:18,color:T.t1 }}>
              Ship to a<br/><span style={{ color:T.teal }}>billion pockets.</span>
            </motion.h1>
            <motion.p initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} transition={{delay:0.24}}
              style={{ fontFamily:"'Lora',serif",fontStyle:"italic",fontSize:"clamp(15px,2vw,18px)",color:T.t2,lineHeight:1.82,maxWidth:560,marginBottom:28 }}>
              App development puts your software on the device people carry everywhere. From a Flutter app that runs on iPhone AND Android from the same code, to a deeply native iOS experience — this track is about building things people hold in their hands.
            </motion.p>
            <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.36}} style={{ display:"flex",flexWrap:"wrap",gap:8 }}>
              {APP_BUILDS.map(b=>(
                <div key={b} style={{ display:"flex",alignItems:"center",gap:6,padding:"5px 12px",background:T.panel,border:`1px solid ${T.b2}`,borderRadius:8 }}>
                  <CheckCircle2 size={12} color={T.teal}/><span style={{ fontFamily:"'Syne',sans-serif",fontSize:12.5,color:T.t1,fontWeight:500 }}>{b}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* COMPARISON STRIP */}
        <div style={{ background:T.panel, borderBottom:`1px solid ${T.b1}`, padding:"0 24px", overflowX:"auto" }}>
          <div style={{ maxWidth:860, margin:"0 auto", display:"flex", gap:0, minHeight:52, alignItems:"center", flexWrap:"nowrap" }}>
            {[
              { name:"Flutter/Dart", desc:"Cross-platform (iOS + Android + Web)", color:"#38bdf8", rec:"Best for beginners" },
              { name:"React Native", desc:"Cross-platform (if you know React)", color:"#61dafb", rec:"Best if you know JS" },
              { name:"Kotlin",       desc:"Android native — maximum control", color:"#a78bfa", rec:"Android specialist" },
              { name:"Swift",        desc:"iOS/macOS native — Apple ecosystem", color:"#f97316", rec:"Apple specialist" },
            ].map((p,i,arr)=>(
              <React.Fragment key={p.name}>
                <div style={{ display:"flex",flexDirection:"column",padding:"10px 16px",flexShrink:0 }}>
                  <div style={{ display:"flex",alignItems:"center",gap:6,marginBottom:2 }}>
                    <div style={{ width:6,height:6,borderRadius:"50%",background:p.color,flexShrink:0 }}/>
                    <span style={{ fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:12.5,color:T.t1 }}>{p.name}</span>
                  </div>
                  <span style={{ fontFamily:"'Lora',serif",fontSize:11.5,color:T.t3,fontStyle:"italic" }}>{p.rec}</span>
                </div>
                {i<arr.length-1&&<div style={{ width:1,height:32,background:T.b2,flexShrink:0 }}/>}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* TABS */}
        <div style={{ background:T.deep, borderBottom:`1px solid ${T.b1}`, padding:"0 24px", position:"sticky", top:60, zIndex:40, backdropFilter:"blur(16px)" }}>
          <div style={{ maxWidth:860, margin:"0 auto", display:"flex", gap:2 }}>
            {[{id:"journey",label:"The Journey"},{id:"languages",label:"Languages & Frameworks"},{id:"resources",label:"Resources"}].map(tab=>{
              const active = activeTab===tab.id;
              return <button key={tab.id} onClick={()=>setActiveTab(tab.id)} style={{ padding:"12px 16px",borderRadius:"8px 8px 0 0",border:"none",background:active?`${T.teal}14`:"transparent",color:active?T.teal:T.t2,fontFamily:"'Syne',sans-serif",fontWeight:active?700:500,fontSize:13.5,cursor:"pointer",borderBottom:active?`2px solid ${T.teal}`:"2px solid transparent",transition:"all 0.15s" }}>{tab.label}</button>;
            })}
          </div>
        </div>

        <div style={{ maxWidth:860, margin:"0 auto", padding:"44px 24px 80px" }}>

          {activeTab==="journey"&&(
            <div>
              <Reveal><SH n="Phase 1" title="Pick your path first" subtitle="Before writing a line of code, decide: cross-platform or native?" color={T.teal} T={T}/></Reveal>
              <Reveal delay={0.05}>
                <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:36 }}>
                  {[
                    { title:"Cross-Platform (Flutter or React Native)", color:"#38bdf8", items:["One codebase → iOS + Android","Faster to build, slightly less native feel","Flutter if starting fresh, RN if you know React","Used by: Google Pay, Alibaba, Shopify"], rec:"Recommended for most beginners" },
                    { title:"Native (Kotlin or Swift)", color:"#f97316", items:["iOS-only (Swift) or Android-only (Kotlin)","Deeper hardware access and native performance","Longer to develop the same feature","Used by: Instagram iOS, WhatsApp Android"], rec:"Choose if you're targeting one platform deeply" },
                  ].map(p=>(
                    <div key={p.title} style={{ background:T.card,border:`1px solid ${p.color}30`,borderRadius:14,padding:"20px",borderTop:`3px solid ${p.color}` }}>
                      <h3 style={{ fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:15,color:T.t1,marginBottom:12 }}>{p.title}</h3>
                      {p.items.map(item=>(
                        <div key={item} style={{ display:"flex",gap:8,alignItems:"flex-start",marginBottom:7 }}>
                          <CheckCircle2 size={12} color={p.color} style={{ flexShrink:0,marginTop:1 }}/>
                          <span style={{ fontFamily:"'Syne',sans-serif",fontSize:12.5,color:T.t2 }}>{item}</span>
                        </div>
                      ))}
                      <div style={{ marginTop:12,padding:"6px 10px",background:`${p.color}10`,borderRadius:6,border:`1px solid ${p.color}25` }}>
                        <span style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:10.5,color:p.color,fontWeight:600 }}>{p.rec}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Reveal>

              <Reveal><SH n="Phase 2" title="The Flutter path (recommended start)" subtitle="Learn Dart for 2 weeks, then Flutter for 4–6." color="#38bdf8" T={T}/></Reveal>
              <Reveal delay={0.05}>
                <div style={{ background:T.card,border:`1px solid ${T.b1}`,borderRadius:14,padding:"22px",marginBottom:28 }}>
                  <p style={{ fontFamily:"'Lora',serif",fontSize:15.5,color:T.t2,lineHeight:1.82,marginBottom:16 }}>Start with Dart — spend 2 weeks getting comfortable with classes, null safety, and async/await. Then jump to Flutter. Your first week of Flutter will feel like confusion — everything is a Widget, and you're nesting them inside each other. That's normal. By week 3, it'll click: a Flutter UI is just a tree of widgets, and you learn the most common ones by building.</p>
                  <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))",gap:10 }}>
                    {[["Weeks 1–2","Dart basics and null safety"],["Weeks 3–4","Flutter: layouts, StatelessWidget"],["Weeks 5–6","StatefulWidget, state, navigation"],["Weeks 7–8","API calls, real data, Firebase"],["Week 9+","Polish, animations, publish"]].map(([t,d])=>(
                      <div key={t} style={{ padding:"11px 13px",background:T.panel,borderRadius:9,border:`1px solid ${T.b1}` }}>
                        <p style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:"#38bdf8",fontWeight:700,marginBottom:4 }}>{t}</p>
                        <p style={{ fontFamily:"'Syne',sans-serif",fontSize:12.5,color:T.t1,margin:0 }}>{d}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>

              <Reveal><SH n="Phase 3" title="Your first published app" subtitle="Getting something in the App Store or Play Store." color="#a78bfa" T={T}/></Reveal>
              <Reveal delay={0.05}>
                <div style={{ background:T.card,border:`1px solid ${T.b1}`,borderRadius:14,padding:"22px" }}>
                  <p style={{ fontFamily:"'Lora',serif",fontSize:15.5,color:T.t2,lineHeight:1.82 }}>The moment that makes it real: publishing your first app. With Flutter, you write code once and submit to both stores. With Expo (React Native), same story. Expect the process to take a few days — both Apple and Google review apps before they go live. A published app, even a simple one, is worth more in a portfolio than 10 tutorial projects.</p>
                </div>
              </Reveal>
            </div>
          )}

          {activeTab==="languages"&&(
            <div>
              <Reveal><p style={{ fontFamily:"'Lora',serif",fontStyle:"italic",fontSize:16,color:T.t2,lineHeight:1.82,marginBottom:32 }}>Five paths to the same destination — a working mobile app. Click to expand each one and see what you'll learn, with real code.</p></Reveal>
              {APP_LANGS.map(lang=><LangCard key={lang.name} lang={lang} T={T}/>)}
            </div>
          )}

          {activeTab==="resources"&&(
            <div>
              <Reveal>
                <div style={{ background:`${T.teal}10`,border:`1px solid ${T.teal}28`,borderRadius:12,padding:"16px 18px",marginBottom:28 }}>
                  <p style={{ fontFamily:"'Lora',serif",fontSize:15.5,color:T.t1,lineHeight:1.75 }}>🗺️ <strong>Suggested path:</strong> For Flutter beginners → start with Robert Brunhage or Code With Andrea on Youtube, use flutter.dev for reference. For React Native → Expo docs + Fireship for quick concepts. For native development → Hacking with Swift (iOS) or the official Android developer guide (Kotlin).</p>
                </div>
              </Reveal>
              <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:10 }}>
                {APP_RESOURCES.map((r,i)=><Reveal key={r.label} delay={i*0.05}><Res {...r} T={T}/></Reveal>)}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}