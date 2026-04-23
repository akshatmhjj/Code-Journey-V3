/**
 * Blog.jsx  →  /blog
 * Long-form articles from the CJ team.
 * List view + individual article view (overlay, no scroll reset).
 */
import React,{useState,useEffect,useRef}from"react";
import{motion,AnimatePresence}from"framer-motion";
import{BookOpen,ArrowUpRight,Clock,X,ChevronRight}from"lucide-react";

const PT={cosmos:{shell:"#07080d",deep:"#0c0e18",mid:"#111420",surface:"#161927",panel:"#1a1e2e",hover:"#1e2335",card:"#161927",cardH:"#1c2235",t1:"#e8eaf2",t2:"#8892b0",t3:"#5a6488",t4:"#2e3660",b1:"rgba(120,130,180,0.08)",b2:"rgba(120,130,180,0.15)",b3:"rgba(120,130,180,0.24)",acc:"#7c6ee0",teal:"#5eead4",green:"#22c55e",red:"#f87171",amber:"#fbbf24",dark:true},void:{shell:"#000",deep:"#050507",mid:"#0a0a0f",surface:"#0f0f15",panel:"#141419",hover:"#1a1a22",card:"#0f0f15",cardH:"#161622",t1:"#f0f0ff",t2:"#9090b8",t3:"#505070",t4:"#252540",b1:"rgba(100,100,200,0.08)",b2:"rgba(100,100,200,0.14)",b3:"rgba(100,100,200,0.22)",acc:"#8b7ff0",teal:"#2dd4bf",green:"#34d399",red:"#fc8181",amber:"#fcd34d",dark:true},aurora:{shell:"#040e0e",deep:"#071414",mid:"#0b1c1c",surface:"#102424",panel:"#142a2a",hover:"#1a3333",card:"#102424",cardH:"#162e2e",t1:"#e0f5f5",t2:"#7ab8b8",t3:"#3d7878",t4:"#1e4444",b1:"rgba(80,200,180,0.08)",b2:"rgba(80,200,180,0.15)",b3:"rgba(80,200,180,0.24)",acc:"#2dd4bf",teal:"#5eead4",green:"#4ade80",red:"#f87171",amber:"#fbbf24",dark:true},nord:{shell:"#1a1f2e",deep:"#1e2535",mid:"#232c40",surface:"#28334a",panel:"#2d3a50",hover:"#344260",card:"#28334a",cardH:"#2e3d55",t1:"#eceff4",t2:"#9ba8c0",t3:"#5c6a88",t4:"#3a4560",b1:"rgba(136,192,208,0.1)",b2:"rgba(136,192,208,0.18)",b3:"rgba(136,192,208,0.28)",acc:"#88c0d0",teal:"#8fbcbb",green:"#a3be8c",red:"#bf616a",amber:"#ebcb8b",dark:true},light:{shell:"#f3f4f8",deep:"#fff",mid:"#f0f1f7",surface:"#fff",panel:"#f7f8fc",hover:"#eef0f8",card:"#fff",cardH:"#f5f6fc",t1:"#111827",t2:"#4b5680",t3:"#7c87a8",t4:"#c5ccdf",b1:"rgba(80,90,150,0.08)",b2:"rgba(80,90,150,0.15)",b3:"rgba(80,90,150,0.24)",acc:"#6256d0",teal:"#0d9488",green:"#16a34a",red:"#dc2626",amber:"#d97706",dark:false}};
const getT=()=>{try{return PT[localStorage.getItem("cj-theme")]||PT.light;}catch{return PT.light;}};
function useTheme(){const[T,setT]=useState(getT);useEffect(()=>{const iv=setInterval(()=>{const f=getT();if(f.acc!==T.acc)setT(f);},500);return()=>clearInterval(iv);},[T]);useEffect(()=>{const fn=()=>setT(getT());window.addEventListener("storage",fn);return()=>window.removeEventListener("storage",fn);},[]);return T;}

const POSTS = [
  {id:"dart-underrated",color:"#5eead4",tag:"App Dev",date:"2026-04-10",readTime:"5 min",
   title:"Why Dart is the most underrated language for beginners",
   excerpt:"Everyone tells beginners to learn Python or JavaScript. Dart is cleaner, safer, and gets you to a published mobile app faster than both. Here's why we built the App Dev track around it.",
   body:[
     {h:"The null safety advantage",p:"Python and JavaScript will happily let you call a method on null and crash at runtime, often hours into a session when you can't remember what you changed. Dart makes null handling explicit at compile time. You know whether a value can be null before your code runs. For beginners who don't yet have the intuition to spot null-related bugs, this is enormous."},
     {h:"One language, every platform",p:"Dart via Flutter runs on iOS, Android, web, desktop, and embedded devices. You write code once. Other frameworks that claim cross-platform always have platform-specific edge cases. Flutter's approach — drawing its own pixels via Skia/Impeller rather than mapping to native components — means it actually behaves consistently everywhere."},
     {h:"Hot reload as a learning tool",p:"The best way to learn a UI framework is to see changes immediately. Flutter's hot reload is the fastest in the industry — changes appear in under 100ms on most machines. This tightens the feedback loop so dramatically that beginners build intuition about layouts faster than any other framework."},
     {h:"The learning curve is honest",p:"Dart is steeper than Python in the first week. But the difficulty you feel is real complexity — state management, widget trees, null safety — not syntax noise. Every hard thing you learn in Dart is something that will trip you up in real projects anyway. Better to learn it in a structured way."},
   ]},
  {id:"0-to-deployed",color:"#7c6ee0",tag:"Web Dev",date:"2026-04-03",readTime:"8 min",
   title:"From zero to deployed in 30 days: a realistic plan",
   excerpt:"Most 'zero to hero' plans are unrealistic. This one is different — it tells you exactly what to skip, what's actually required, and the single project that proves you can build.",
   body:[
     {h:"What you actually need in 30 days",p:"You don't need to know every HTML tag. You don't need to master CSS animations. You need to be able to: build a page from a mockup, make it responsive, fetch data from an API, handle loading and error states, and deploy it somewhere. That's it. Those five skills get you hired."},
     {h:"The one project worth building",p:"Build a GitHub profile explorer. It hits every required skill: HTML structure for the layout, CSS grid for the repo list, JavaScript async/await for the GitHub API, error handling for rate limits, and Vercel for deployment. It's genuinely interesting to look at, and every potential employer can browse the code and the live site."},
     {h:"What to skip",p:"Skip CSS animations, SVG, Canvas, Web Workers, Service Workers, and 90% of JavaScript features. They're real and useful — but not in month one. The skill that matters most in the first 30 days is the ability to build something complete. Not the breadth of what you know."},
     {h:"The deployment moment",p:"The most important milestone in early web development is the first time you push your code and share a URL with someone who isn't you. It shifts your mental model from 'I'm learning' to 'I build things.' Do this in week 3, not week 12."},
   ]},
  {id:"confusion-tax",color:"#f97316",tag:"Philosophy",date:"2026-03-22",readTime:"4 min",
   title:"The confusion tax: why most learning platforms waste your time",
   excerpt:"Most coding platforms throw 40 languages and 200 topics at beginners and call it 'comprehensive.' We built Code Journey by removing things, not adding them. Here's the thinking.",
   body:[
     {h:"What the confusion tax costs you",p:"Every time you stop to look up whether you should learn Vue or React, Express or Fastify, MySQL or MongoDB — you're paying the confusion tax. It's cognitive overhead that has nothing to do with learning to code. It's the tax of trying to navigate a space you don't have a map of yet."},
     {h:"The opinionated path",p:"Code Journey makes decisions for you. Web track: React. App track: Flutter. Data track: Python + Pandas. These are not the only good choices. They are choices that get you to a job or a shipped product faster than the decision paralysis of researching all the options. You can explore alternatives once you have the fundamentals."},
     {h:"More content is not better content",p:"Most platforms measure their value in the number of courses they offer. We measure ours differently: how quickly can a beginner build something real? Every topic we don't include is a decision that took longer to make than the ones we did include."},
   ]},
  {id:"sql-window-functions",color:"#a78bfa",tag:"Data Science",date:"2026-03-15",readTime:"6 min",
   title:"Window functions are the skill that separates analysts from beginners",
   excerpt:"You can get 80% of data analyst work done with GROUP BY. The other 20% — the nuanced, insightful analysis — needs window functions. And they're not as hard as they look.",
   body:[
     {h:"What window functions actually do",p:"Regular aggregation collapses rows. SUM() with GROUP BY turns 100 rows into 5. Window functions run the same aggregation but keep every row. So you can say 'show me each sale, the total sales for that customer, and what percentage this sale is of their total' — all in one query, without a subquery or join."},
     {h:"LAG and LEAD: the pattern most analysts use weekly",p:"LAG(column) OVER (PARTITION BY customer ORDER BY date) gives you the previous value for that customer. This is how you calculate month-over-month growth, detect sequential events, or find the time between purchases. Once you understand the PARTITION BY and ORDER BY inside OVER(), the rest follows naturally."},
     {h:"The one exercise that makes it click",p:"Write a query that shows each customer's orders with: the order amount, the previous order amount, and the percentage change. The moment that query returns sensible results, window functions click. It usually takes about three attempts."},
   ]},
];

function ArticleOverlay({post, onClose, T}) {
  const scrollRef = useRef(null);
  const [pct,setPct] = useState(0);

  useEffect(()=>{
    const el=scrollRef.current; if(!el)return;
    const fn=()=>setPct(Math.min(1,el.scrollTop/Math.max(1,el.scrollHeight-el.clientHeight)));
    el.addEventListener("scroll",fn,{passive:true}); return()=>el.removeEventListener("scroll",fn);
  },[]);
  useEffect(()=>{
    const fn=e=>{if(e.key==="Escape")onClose();};
    document.addEventListener("keydown",fn); return()=>document.removeEventListener("keydown",fn);
  },[onClose]);

  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
      style={{position:"fixed",inset:0,zIndex:1000,display:"flex"}}>
      <div onClick={onClose} style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.55)",backdropFilter:"blur(6px)"}}/>
      <motion.div initial={{x:"100%"}} animate={{x:0}} exit={{x:"100%"}} transition={{duration:0.3,ease:[0.22,1,0.36,1]}}
        style={{position:"relative",marginLeft:"auto",width:"min(760px,100vw)",height:"100%",background:T.deep,display:"flex",flexDirection:"column",boxShadow:"-20px 0 80px rgba(0,0,0,0.5)",borderLeft:`1px solid ${T.b1}`}}>
        {/* Progress */}
        <div style={{position:"absolute",top:0,left:0,right:0,height:2.5,background:T.b1,zIndex:10}}>
          <motion.div animate={{width:`${pct*100}%`}} transition={{duration:0.06}} style={{height:"100%",background:post.color,borderRadius:"0 2px 2px 0"}}/>
        </div>
        {/* Toolbar */}
        <div style={{display:"flex",alignItems:"center",padding:"0 20px",height:48,borderBottom:`1px solid ${T.b1}`,background:T.deep,flexShrink:0}}>
          <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:T.t3,flex:1}}>/blog/{post.id}</span>
          <span style={{fontFamily:"'Syne',sans-serif",fontSize:10.5,fontWeight:700,color:post.color,background:`${post.color}14`,border:`1px solid ${post.color}28`,padding:"2px 9px",borderRadius:100,marginRight:10}}>{post.tag}</span>
          <button onClick={onClose} style={{width:28,height:28,borderRadius:"50%",background:T.hover,border:`1px solid ${T.b2}`,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:T.t2}}><X size={13}/></button>
        </div>
        {/* Content */}
        <div ref={scrollRef} style={{flex:1,overflowY:"auto",padding:"36px 32px 80px"}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:18,flexWrap:"wrap"}}>
            <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:T.t3}}>{new Date(post.date).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"})}</span>
            <span style={{color:T.t4}}>·</span>
            <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:T.t3,display:"flex",alignItems:"center",gap:4}}><Clock size={11}/>{post.readTime} read</span>
          </div>
          <h1 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:"clamp(22px,3.5vw,32px)",color:T.t1,lineHeight:1.12,marginBottom:18,letterSpacing:"-0.5px"}}>{post.title}</h1>
          <p style={{fontFamily:"'Lora',serif",fontStyle:"italic",fontSize:17,color:T.t2,lineHeight:1.85,marginBottom:32,borderBottom:`1px solid ${T.b1}`,paddingBottom:28}}>{post.excerpt}</p>
          {post.body.map((sec,i)=>(
            <div key={i} style={{marginBottom:36}}>
              <h2 style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:19,color:T.t1,marginBottom:12,letterSpacing:"-0.2px",display:"flex",alignItems:"center",gap:9}}>
                <div style={{width:3,height:20,background:post.color,borderRadius:2,flexShrink:0}}/>
                {sec.h}
              </h2>
              <p style={{fontFamily:"'Lora',serif",fontSize:16,color:T.t2,lineHeight:1.9,paddingLeft:12}}>{sec.p}</p>
              {i<post.body.length-1&&<div style={{height:1,background:T.b1,marginTop:32,marginLeft:12}}/>}
            </div>
          ))}
          <div style={{marginTop:40,paddingTop:24,borderTop:`1px solid ${T.b1}`}}>
            <button onClick={onClose} style={{padding:"9px 20px",borderRadius:8,border:"none",background:post.color,color:"#fff",fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:14,cursor:"pointer"}}>← All Articles</button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Blog() {
  const T = useTheme();
  const [open,setOpen] = useState(null);
  const savedY = useRef(0);

  useEffect(()=>{
    if(open){savedY.current=window.scrollY;document.body.style.cssText=`overflow:hidden;position:fixed;top:-${savedY.current}px;width:100%`;}
    else{document.body.style.cssText="";window.scrollTo(0,savedY.current);}
    return()=>{document.body.style.cssText="";};
  },[open]);

  const [featured,...rest] = POSTS;

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

        <div style={{background:T.deep,borderBottom:`1px solid ${T.b1}`,padding:"96px 24px 52px",position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",inset:0,backgroundImage:`linear-gradient(${T.b1} 1px,transparent 1px),linear-gradient(90deg,${T.b1} 1px,transparent 1px)`,backgroundSize:"48px 48px",maskImage:"radial-gradient(ellipse 70% 70% at 50% 40%,black 20%,transparent 100%)",pointerEvents:"none"}}/>
          <div style={{maxWidth:860,margin:"0 auto",position:"relative"}}>
            <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} style={{display:"inline-flex",alignItems:"center",gap:7,padding:"4px 14px",borderRadius:100,background:`${T.acc}14`,border:`1px solid ${T.acc}40`,marginBottom:18}}>
              <BookOpen size={12} color={T.acc}/>
              <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,fontWeight:700,color:T.acc,letterSpacing:"2px",textTransform:"uppercase"}}>Blog</span>
            </motion.div>
            <motion.h1 initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} transition={{delay:0.08}} style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:"clamp(30px,5vw,50px)",lineHeight:1.07,letterSpacing:"-1px",marginBottom:12,color:T.t1}}>
              Thinking out loud<br/><span style={{color:T.acc}}>about learning to code.</span>
            </motion.h1>
            <motion.p initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.14}} style={{fontFamily:"'Lora',serif",fontStyle:"italic",fontSize:16,color:T.t2,lineHeight:1.75}}>Deep dives, opinions, and practical guides from the Code Journey team.</motion.p>
          </div>
        </div>

        <div style={{maxWidth:860,margin:"0 auto",padding:"40px 24px 80px"}}>
          {/* Featured */}
          <motion.div initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} onClick={()=>setOpen(featured)}
            style={{cursor:"pointer",padding:"28px 32px",borderRadius:18,border:`1px solid ${featured.color}35`,background:`${featured.color}08`,marginBottom:32,borderLeft:`4px solid ${featured.color}`,transition:"all 0.18s"}}
            onMouseEnter={e=>{e.currentTarget.style.background=`${featured.color}12`;}}
            onMouseLeave={e=>{e.currentTarget.style.background=`${featured.color}08`;}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
              <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,fontWeight:700,color:featured.color,background:`${featured.color}14`,border:`1px solid ${featured.color}28`,padding:"2px 9px",borderRadius:100}}>{featured.tag}</span>
              <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:T.t3}}>Featured · {new Date(featured.date).toLocaleDateString("en-IN",{month:"short",year:"numeric"})}</span>
            </div>
            <h2 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:"clamp(20px,3vw,28px)",color:T.t1,marginBottom:12,letterSpacing:"-0.4px",lineHeight:1.2}}>{featured.title}</h2>
            <p style={{fontFamily:"'Lora',serif",fontStyle:"italic",fontSize:15.5,color:T.t2,lineHeight:1.78,marginBottom:16}}>{featured.excerpt}</p>
            <span style={{display:"flex",alignItems:"center",gap:5,fontFamily:"'Syne',sans-serif",fontSize:13.5,fontWeight:700,color:featured.color}}>Read article<ArrowUpRight size={14}/></span>
          </motion.div>

          {/* Grid */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:16}}>
            {rest.map((post,i)=>(
              <motion.div key={post.id} initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:i*0.07+0.2}}
                onClick={()=>setOpen(post)}
                style={{cursor:"pointer",padding:"20px",borderRadius:14,border:`1px solid ${T.b1}`,background:T.card,transition:"all 0.18s",borderTop:`2px solid ${post.color}`}}
                onMouseEnter={e=>{e.currentTarget.style.borderColor=`${post.color}55`;e.currentTarget.style.background=T.cardH;}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor=T.b1;e.currentTarget.style.borderTopColor=post.color;e.currentTarget.style.background=T.card;}}>
                <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:10}}>
                  <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,fontWeight:700,color:post.color,background:`${post.color}14`,border:`1px solid ${post.color}28`,padding:"2px 8px",borderRadius:100}}>{post.tag}</span>
                  <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10.5,color:T.t3}}>{post.readTime} read</span>
                </div>
                <h3 style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:16,color:T.t1,marginBottom:9,lineHeight:1.3}}>{post.title}</h3>
                <p style={{fontFamily:"'Lora',serif",fontSize:13.5,color:T.t3,lineHeight:1.68,marginBottom:12,display:"-webkit-box",WebkitLineClamp:3,WebkitBoxOrient:"vertical",overflow:"hidden"}}>{post.excerpt}</p>
                <span style={{display:"flex",alignItems:"center",gap:4,fontFamily:"'Syne',sans-serif",fontSize:12.5,fontWeight:600,color:post.color}}>Read<ChevronRight size={13}/></span>
              </motion.div>
            ))}
          </div>
        </div>

        <AnimatePresence>
          {open&&<ArticleOverlay post={open} onClose={()=>setOpen(null)} T={T}/>}
        </AnimatePresence>
      </div>
    </>
  );
}