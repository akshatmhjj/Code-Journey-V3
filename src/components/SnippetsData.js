export const SNIPS = [

/* ================= HTML ================= */
{
id:"html-layout",lang:"html",title:"Layout",desc:"Basic layout",tags:["layout"],
code:`<!DOCTYPE html>
<html>
<head>
  <title>App</title>
  <style>body{margin:0;font-family:sans-serif}</style>
</head>
<body>
  <header>Header</header>
  <main><h1>Hello</h1></main>
  <footer>Footer</footer>
</body>
</html>`
},
{
id:"html-form",lang:"html",title:"Form",desc:"Submit form",tags:["form"],
code:`<form onsubmit="handle(event)">
  <input id="name" placeholder="Name"/>
  <button>Send</button>
</form>
<script>
function handle(e){
  e.preventDefault();
  console.log(name.value);
}
</script>`
},
{
id:"html-table",lang:"html",title:"Table",desc:"Table UI",tags:["table"],
code:`<table border="1">
<tr><th>Name</th><th>Age</th></tr>
<tr><td>A</td><td>20</td></tr>
<tr><td>B</td><td>25</td></tr>
</table>`
},
{
id:"html-card",lang:"html",title:"Card",desc:"UI card",tags:["ui"],
code:`<div class="card">
  <img src="img.jpg" width="100%"/>
  <h3>Title</h3>
  <button onclick="alert('Hi')">Click</button>
</div>`
},
{
id:"html-media",lang:"html",title:"Media",desc:"Audio video",tags:["media"],
code:`<video controls width="300">
  <source src="a.mp4">
</video>
<audio controls>
  <source src="a.mp3">
</audio>`
},

/* ================= CSS ================= */
{
id:"css-flex",lang:"css",title:"Flex",desc:"Center",tags:["layout"],
code:`.box{
  display:flex;
  justify-content:center;
  align-items:center;
  height:100vh;
  background:#111;
  color:#fff;
}`
},
{
id:"css-grid",lang:"css",title:"Grid",desc:"Grid layout",tags:["layout"],
code:`.grid{
  display:grid;
  grid-template-columns:repeat(3,1fr);
  gap:10px;
}
.item{background:#eee;padding:10px}`
},
{
id:"css-card",lang:"css",title:"Card",desc:"Card style",tags:["ui"],
code:`.card{
  padding:16px;
  border-radius:10px;
  box-shadow:0 4px 10px rgba(0,0,0,.2);
  transition:.3s;
}`
},
{
id:"css-hover",lang:"css",title:"Hover",desc:"Hover effect",tags:["anim"],
code:`.btn{
  padding:10px;
}
.btn:hover{
  transform:scale(1.1);
  background:#333;
  color:#fff;
}`
},
{
id:"css-scroll",lang:"css",title:"Scroll",desc:"Hide scroll",tags:["ui"],
code:`body{overflow:auto}
::-webkit-scrollbar{
  width:0;
}`
},

/* ================= JAVASCRIPT ================= */
{
id:"js-fetch",lang:"javascript",title:"Fetch",desc:"API call",tags:["api"],
code:`async function getData(url){
  try{
    const res=await fetch(url);
    if(!res.ok) throw Error();
    const data=await res.json();
    console.log(data);
    return data;
  }catch(e){
    console.log(e);
  }
}`
},
{
id:"js-debounce",lang:"javascript",title:"Debounce",desc:"Delay fn",tags:["perf"],
code:`function debounce(fn,d=300){
  let t;
  return(...a)=>{
    clearTimeout(t);
    t=setTimeout(()=>fn(...a),d);
  }
}`
},
{
id:"js-clone",lang:"javascript",title:"Clone",desc:"Deep copy",tags:["obj"],
code:`function clone(o){
  if(typeof o!=="object") return o;
  const r={};
  for(let k in o){
    r[k]=clone(o[k]);
  }
  return r;
}`
},
{
id:"js-sleep",lang:"javascript",title:"Sleep",desc:"Delay",tags:["async"],
code:`const sleep=ms=>new Promise(r=>setTimeout(r,ms));
async function run(){
  console.log("start");
  await sleep(1000);
  console.log("end");
}`
},
{
id:"js-throttle",lang:"javascript",title:"Throttle",desc:"Limit",tags:["perf"],
code:`function throttle(fn,l=300){
  let w=false;
  return(...a)=>{
    if(!w){
      fn(...a);
      w=true;
      setTimeout(()=>w=false,l);
    }
  }
}`
},

/* ================= TYPESCRIPT ================= */
{
id:"ts-fetch",lang:"typescript",title:"Fetch",desc:"Typed",tags:["api"],
code:`async function fetchData<T>(url:string):Promise<T|null>{
  try{
    const r=await fetch(url);
    return await r.json() as T;
  }catch{return null;}
}`
},
{
id:"ts-result",lang:"typescript",title:"Result",desc:"Safe",tags:["types"],
code:`type Result<T> =
 {ok:true,data:T}|
 {ok:false,error:Error};

async function safe<T>(fn:()=>Promise<T>):Promise<Result<T>>{
  try{return {ok:true,data:await fn()};}
  catch(e){return {ok:false,error:e as Error};}
}`
},
{
id:"ts-enum",lang:"typescript",title:"Enum",desc:"Roles",tags:["types"],
code:`enum Role{Admin="ADMIN",User="USER"}

function check(r:Role){
  return r===Role.Admin;
}`
},
{
id:"ts-guard",lang:"typescript",title:"Guard",desc:"Type check",tags:["types"],
code:`function isStr(x:any):x is string{
  return typeof x==="string";
}

function run(x:any){
  if(isStr(x)) console.log(x);
}`
},
{
id:"ts-update",lang:"typescript",title:"Update",desc:"Partial",tags:["types"],
code:`type User={name:string;age:number};

function update(u:User,p:Partial<User>){
  return {...u,...p};
}`
},

/* ================= NODE ================= */
{
id:"node-server",lang:"nodejs",title:"Server",desc:"Basic",tags:["server"],
code:`const http=require("http");

http.createServer((req,res)=>{
  res.writeHead(200,{"Content-Type":"text/plain"});
  res.write("Hello");
  res.end();
}).listen(3000);`
},
{
id:"node-route",lang:"nodejs",title:"Route",desc:"Routing",tags:["server"],
code:`const http=require("http");

http.createServer((req,res)=>{
  if(req.url==="/") res.end("Home");
  else res.end("404");
}).listen(3000);`
},
{
id:"node-json",lang:"nodejs",title:"JSON",desc:"Send JSON",tags:["api"],
code:`const http=require("http");

http.createServer((req,res)=>{
  res.setHeader("Content-Type","application/json");
  res.end(JSON.stringify({msg:"ok"}));
}).listen(3000);`
},
{
id:"node-fs",lang:"nodejs",title:"FS",desc:"Read file",tags:["fs"],
code:`const fs=require("fs");

fs.readFile("a.txt","utf8",(e,d)=>{
  if(!e) console.log(d);
});`
},
{
id:"node-env",lang:"nodejs",title:"Env",desc:"Vars",tags:["env"],
code:`require("dotenv").config();

console.log(process.env.KEY);`
},

/* ================= SQL ================= */
{
id:"sql-select",lang:"sql",title:"Select",desc:"Get data",tags:["basic"],
code:`SELECT name,age
FROM users
WHERE age>18
ORDER BY age DESC;`
},
{
id:"sql-insert",lang:"sql",title:"Insert",desc:"Add",tags:["basic"],
code:`INSERT INTO users(name,age)
VALUES('A',20),('B',22);`
},
{
id:"sql-update",lang:"sql",title:"Update",desc:"Modify",tags:["basic"],
code:`UPDATE users
SET age=age+1
WHERE active=1;`
},
{
id:"sql-delete",lang:"sql",title:"Delete",desc:"Remove",tags:["basic"],
code:`DELETE FROM users
WHERE age<18;`
},
{
id:"sql-join",lang:"sql",title:"Join",desc:"Combine",tags:["join"],
code:`SELECT u.name,o.total
FROM users u
JOIN orders o
ON u.id=o.user_id;`
},

/* ================= REACT ================= */
{
id:"r-fetch",lang:"react",title:"Fetch Hook",desc:"Fetch",tags:["hook"],
code:`function useFetch(url){
  const [d,setD]=useState(null);
  useEffect(()=>{
    fetch(url).then(r=>r.json()).then(setD);
  },[url]);
  return d;
}`
},
{
id:"r-local",lang:"react",title:"Local",desc:"Storage",tags:["hook"],
code:`function useLocal(k,v){
  const [val,setVal]=useState(v);
  useEffect(()=>{
    localStorage.setItem(k,JSON.stringify(val));
  },[val]);
  return [val,setVal];
}`
},
{
id:"r-toggle",lang:"react",title:"Toggle",desc:"Bool",tags:["hook"],
code:`function useToggle(i=false){
  const [v,setV]=useState(i);
  return [v,()=>setV(x=>!x)];
}`
},
{
id:"r-debounce",lang:"react",title:"Debounce",desc:"Delay",tags:["hook"],
code:`function useDebounce(v,d=300){
  const [val,setVal]=useState(v);
  useEffect(()=>{
    const t=setTimeout(()=>setVal(v),d);
    return()=>clearTimeout(t);
  },[v]);
  return val;
}`
},
{
id:"r-memo",lang:"react",title:"Memo",desc:"Optimize",tags:["perf"],
code:`const Comp=({v})=>{
  return <div>{v}</div>;
}

export default React.memo(Comp);`
},

/* ================= DART ================= */
{
id:"dart-main",lang:"dart",title:"Main",desc:"Basic",tags:["base"],
code:`void main(){
  print("Hello");
  greet("Dev");
}

void greet(String n){
  print("Hi $n");
}`
},
{
id:"dart-list",lang:"dart",title:"List",desc:"Map",tags:["list"],
code:`var nums=[1,2,3];
var doubled=nums.map((e)=>e*2).toList();

print(doubled);`
},
{
id:"dart-class",lang:"dart",title:"Class",desc:"Model",tags:["oop"],
code:`class User{
  String name;
  User(this.name);
}

void main(){
  print(User("A").name);
}`
},
{
id:"dart-async",lang:"dart",title:"Async",desc:"Future",tags:["async"],
code:`Future run() async{
  await Future.delayed(Duration(seconds:1));
  print("Done");
}`
},
{
id:"dart-null",lang:"dart",title:"Null",desc:"Safety",tags:["base"],
code:`String? name;

void main(){
  print(name ?? "Guest");
}`
},

/* ================= FLUTTER ================= */
{
id:"fl-container",lang:"flutter",title:"Container",desc:"UI",tags:["ui"],
code:`Container(
  padding:EdgeInsets.all(10),
  child:Text("Hello"),
)`
},
{
id:"fl-list",lang:"flutter",title:"List",desc:"ListView",tags:["ui"],
code:`ListView.builder(
  itemCount:5,
  itemBuilder:(c,i){
    return Text("$i");
  },
)`
},
{
id:"fl-nav",lang:"flutter",title:"Nav",desc:"Navigate",tags:["nav"],
code:`Navigator.push(
 context,
 MaterialPageRoute(builder:(_)=>Page()),
);`
},
{
id:"fl-state",lang:"flutter",title:"State",desc:"Update",tags:["state"],
code:`setState(() {
  count++;
});`
},
{
id:"fl-future",lang:"flutter",title:"Future",desc:"Async UI",tags:["async"],
code:`FutureBuilder(
 future:fetch(),
 builder:(c,s){
  if(s.hasData) return Text("Done");
  return CircularProgressIndicator();
 });`
},

/* ================= SWIFT ================= */
{
id:"swift-func",lang:"swift",title:"Func",desc:"Basic",tags:["base"],
code:`func greet(name:String)->String{
 return "Hello \(name)"
}`
},
{
id:"swift-opt",lang:"swift",title:"Optional",desc:"Null",tags:["base"],
code:`var n:String?="A"

print(n ?? "Guest")`
},
{
id:"swift-arr",lang:"swift",title:"Array",desc:"Map",tags:["list"],
code:`let nums=[1,2,3]

let d=nums.map{$0*2}`
},
{
id:"swift-class",lang:"swift",title:"Class",desc:"Model",tags:["oop"],
code:`class User{
 var name:String
 init(n:String){name=n}
}`
},
{
id:"swift-api",lang:"swift",title:"API",desc:"Fetch",tags:["net"],
code:`URLSession.shared.dataTask(with:url){
 d,_,_ in print(d)
}.resume()`
},

/* ================= PYTHON ================= */
{
id:"py-read",lang:"python",title:"Read",desc:"File",tags:["file"],
code:`with open("a.txt") as f:
  data=f.read()
  print(data)`
},
{
id:"py-json",lang:"python",title:"JSON",desc:"Parse",tags:["file"],
code:`import json

with open("a.json") as f:
  data=json.load(f)
  print(data)`
},
{
id:"py-loop",lang:"python",title:"Loop",desc:"Iter",tags:["base"],
code:`for i in range(5):
  print(i)`
},
{
id:"py-func",lang:"python",title:"Func",desc:"Basic",tags:["base"],
code:`def greet(n):
  return "Hello "+n

print(greet("Dev"))`
},
{
id:"py-env",lang:"python",title:"Env",desc:"Vars",tags:["env"],
code:`import os

print(os.getenv("KEY"))`
},

/* ================= R ================= */
{
id:"r-read",lang:"r",title:"Read",desc:"CSV",tags:["data"],
code:`data<-read.csv("a.csv")

head(data)`
},
{
id:"r-plot",lang:"r",title:"Plot",desc:"Graph",tags:["viz"],
code:`x<-c(1,2,3)
y<-c(2,4,6)

plot(x,y)`
},
{
id:"r-mean",lang:"r",title:"Mean",desc:"Avg",tags:["stats"],
code:`mean(c(1,2,3))`
},
{
id:"r-filter",lang:"r",title:"Filter",desc:"Subset",tags:["data"],
code:`subset(data,age>18)`
},
{
id:"r-dplyr",lang:"r",title:"Select",desc:"Cols",tags:["data"],
code:`library(dplyr)

data%>%select(name)`
},

/* ================= KOTLIN ================= */
{
id:"kt-func",lang:"kotlin",title:"Func",desc:"Basic",tags:["base"],
code:`fun greet(n:String):String{
 return "Hello $n"
}`
},
{
id:"kt-null",lang:"kotlin",title:"Null",desc:"Safe",tags:["base"],
code:`var n:String?=null

println(n?: "Guest")`
},
{
id:"kt-list",lang:"kotlin",title:"List",desc:"Map",tags:["list"],
code:`val nums=listOf(1,2,3)

val d=nums.map{it*2}`
},
{
id:"kt-class",lang:"kotlin",title:"Class",desc:"Model",tags:["oop"],
code:`data class User(val n:String)`
},
{
id:"kt-cor",lang:"kotlin",title:"Coroutine",desc:"Async",tags:["async"],
code:`GlobalScope.launch{
 delay(1000)
 println("Done")
}`
},

/* ================= RUST ================= */
{
id:"rs-func",lang:"rust",title:"Func",desc:"Basic",tags:["base"],
code:`fn greet(n:&str)->String{
 format!("Hello {}",n)
}`
},
{
id:"rs-var",lang:"rust",title:"Var",desc:"Mutable",tags:["base"],
code:`let mut x=5;
x+=1;`
},
{
id:"rs-vec",lang:"rust",title:"Vec",desc:"Map",tags:["list"],
code:`let v=vec![1,2,3];
let d:Vec<_>=v.iter().map(|x|x*2).collect();`
},
{
id:"rs-match",lang:"rust",title:"Match",desc:"Control",tags:["ctrl"],
code:`match x{
 1=>println!("one"),
 _=>println!("other")
}`
},
{
id:"rs-file",lang:"rust",title:"File",desc:"Read",tags:["file"],
code:`use std::fs;

let d=fs::read_to_string("a.txt").unwrap();`
}

];

export const LANG_META = {
  javascript: { color: "#f7df1e", label: "JS" },
  typescript: { color: "#60a5fa", label: "TS" },
  react: { color: "#61dafb", label: "JSX" },
  python: { color: "#4ade80", label: "PY" },
  sql: { color: "#a78bfa", label: "SQL" },
  html: { color: "#f97316", label: "HTML" },
  css: { color: "#38bdf8", label: "CSS" },
  nodejs: { color: "#22c55e", label: "NODE" },
  dart: { color: "#00bcd4", label: "DART" },
  flutter: { color: "#42a5f5", label: "FLTR" },
  swift: { color: "#f59e0b", label: "SWFT" },
  r: { color: "#3b82f6", label: "R" },
  kotlin: { color: "#a855f7", label: "KT" },
  rust: { color: "#f97316", label: "RS" },
};