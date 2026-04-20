/**
 * Code Journey — Data Science Deep Dive
 */
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BarChart2, ExternalLink, ChevronDown, CheckCircle2, BookOpen, Play } from "lucide-react";

const PT = {
  cosmos:{ shell:"#07080d",deep:"#0c0e18",mid:"#111420",surface:"#161927",panel:"#1a1e2e",hover:"#1e2335",card:"#161927",cardH:"#1c2235",t1:"#e8eaf2",t2:"#8892b0",t3:"#5a6488",t4:"#2e3660",b1:"rgba(120,130,180,0.08)",b2:"rgba(120,130,180,0.15)",b3:"rgba(120,130,180,0.24)",acc:"#f472b6",accS:"rgba(244,114,182,0.14)",teal:"#5eead4",green:"#22c55e",red:"#f87171",gold:"#fbbf24",dark:true},
  void:{   shell:"#000",   deep:"#050507",mid:"#0a0a0f",surface:"#0f0f15",panel:"#141419",hover:"#1a1a22",card:"#0f0f15",cardH:"#161622",t1:"#f0f0ff",t2:"#9090b8",t3:"#505070",t4:"#252540",b1:"rgba(100,100,200,0.08)",b2:"rgba(100,100,200,0.14)",b3:"rgba(100,100,200,0.22)",acc:"#f472b6",accS:"rgba(244,114,182,0.14)",teal:"#2dd4bf",green:"#34d399",red:"#fc8181",gold:"#fcd34d",dark:true},
  aurora:{ shell:"#040e0e",deep:"#071414",mid:"#0b1c1c",surface:"#102424",panel:"#142a2a",hover:"#1a3333",card:"#102424",cardH:"#162e2e",t1:"#e0f5f5",t2:"#7ab8b8",t3:"#3d7878",t4:"#1e4444",b1:"rgba(80,200,180,0.08)",b2:"rgba(80,200,180,0.15)",b3:"rgba(80,200,180,0.24)",acc:"#f472b6",accS:"rgba(244,114,182,0.14)",teal:"#5eead4",green:"#4ade80",red:"#f87171",gold:"#fbbf24",dark:true},
  nord:{   shell:"#1a1f2e",deep:"#1e2535",mid:"#232c40",surface:"#28334a",panel:"#2d3a50",hover:"#344260",card:"#28334a",cardH:"#2e3d55",t1:"#eceff4",t2:"#9ba8c0",t3:"#5c6a88",t4:"#3a4560",b1:"rgba(136,192,208,0.1)",b2:"rgba(136,192,208,0.18)",b3:"rgba(136,192,208,0.28)",acc:"#f472b6",accS:"rgba(244,114,182,0.14)",teal:"#8fbcbb",green:"#a3be8c",red:"#bf616a",gold:"#ebcb8b",dark:true},
  light:{  shell:"#f3f4f8",deep:"#fff",   mid:"#f0f1f7",surface:"#fff",   panel:"#f7f8fc",hover:"#eef0f8",card:"#fff",   cardH:"#f5f6fc",t1:"#111827",t2:"#4b5680",t3:"#7c87a8",t4:"#c5ccdf",b1:"rgba(80,90,150,0.08)",b2:"rgba(80,90,150,0.15)",b3:"rgba(80,90,150,0.24)",acc:"#db2777",accS:"rgba(219,39,119,0.1)",teal:"#0d9488",green:"#16a34a",red:"#dc2626",gold:"#d97706",dark:false},
};
const getT=()=>{try{return PT[localStorage.getItem("cj-theme")]||PT.cosmos;}catch{return PT.cosmos;}};
function useTheme(){const[T,setT]=useState(getT);useEffect(()=>{const iv=setInterval(()=>{const f=getT();if(f.acc!==T.acc)setT(f);},500);return()=>clearInterval(iv);},[T]);useEffect(()=>{const fn=()=>setT(getT());window.addEventListener("storage",fn);return()=>window.removeEventListener("storage",fn);},[]);return T;}

const HL = ({ code, T }) => {
  const lines = code.split("\n");
  const colorize = (line) => {
    let html = line.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
    html = html.replace(/(#.*)/g, m => `<span style="color:#6a9955">${m}</span>`);
    html = html.replace(/(".*?"|'.*?')/g, m => `<span style="color:#ce9178">${m}</span>`);
    html = html.replace(/\b(import|from|def|return|if|else|for|in|True|False|None|class|and|or|not|with|as|print)\b/g, m => `<span style="color:#c792ea">${m}</span>`);
    html = html.replace(/\b(\d+\.?\d*)\b/g, m => `<span style="color:#f78c6c">${m}</span>`);
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
            <span style={{ color:T.t4,width:28,flexShrink:0,userSelect:"none",fontSize:11 }}>{i+1}</span>
            <span style={{ fontSize:12.5,color:T.t2,whiteSpace:"pre" }} dangerouslySetInnerHTML={{ __html:colorize(line) }}/>
          </div>
        ))}
      </div>
    </div>
  );
};

/* Mini bar chart visualization */
const MiniChart = ({ data, color, T }) => {
  const max = Math.max(...data.map(d => d.value));
  return (
    <div style={{ background:T.panel, borderRadius:10, padding:"16px", border:`1px solid ${T.b1}` }}>
      <div style={{ display:"flex", alignItems:"flex-end", gap:8, height:80, marginBottom:8 }}>
        {data.map((d,i) => (
          <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
            <motion.div
              initial={{ height:0 }} animate={{ height:`${(d.value/max)*64}px` }}
              transition={{ duration:0.7, delay:i*0.08, ease:"easeOut" }}
              style={{ width:"100%", background:color, borderRadius:"3px 3px 0 0", opacity:0.7+i*0.06 }}/>
          </div>
        ))}
      </div>
      <div style={{ display:"flex", gap:8 }}>
        {data.map((d,i)=>(
          <div key={i} style={{ flex:1, textAlign:"center" }}>
            <p style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9, color:T.t3, margin:0, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{d.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const Res = ({ icon:Icon, label, sub, href, color, T }) => (
  <a href={href} target="_blank" rel="noreferrer"
    style={{ display:"flex",alignItems:"center",gap:10,padding:"10px 13px",borderRadius:9,border:`1px solid ${T.b1}`,background:T.card,textDecoration:"none",transition:"all 0.16s" }}
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
        <div onClick={()=>setOpen(o=>!o)} style={{ display:"flex",alignItems:"center",gap:14,padding:"18px 20px",background:open?`${lang.color}08`:T.card,cursor:"pointer",transition:"background 0.18s" }}>
          <div style={{ width:44,height:44,borderRadius:12,background:lang.bg,border:`1.5px solid ${lang.color}44`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700,color:lang.color,fontFamily:"'JetBrains Mono',monospace",flexShrink:0 }}>{lang.icon}</div>
          <div style={{ flex:1 }}>
            <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:3 }}>
              <h3 style={{ fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:17,color:T.t1,margin:0 }}>{lang.name}</h3>
              <span style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:9.5,fontWeight:700,padding:"1px 7px",borderRadius:4,background:`${lang.color}14`,color:lang.color,border:`1px solid ${lang.color}28` }}>{lang.level}</span>
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
              <div style={{ padding:"20px",borderTop:`1px solid ${T.b1}`,background:T.mid }}>
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
                {lang.chartData&&(
                  <div style={{ marginBottom:20 }}>
                    <p style={{ fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:11,color:T.t3,letterSpacing:"1.2px",textTransform:"uppercase",marginBottom:10 }}>Visual example: {lang.chartTitle}</p>
                    <MiniChart data={lang.chartData} color={lang.color} T={T}/>
                    <p style={{ fontFamily:"'Lora',serif",fontSize:13,color:T.t3,marginTop:8,fontStyle:"italic" }}>{lang.chartNote}</p>
                  </div>
                )}
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

const DATA_LANGS = [
  {
    name:"Python", icon:"Py", level:"Foundation", color:"#4ade80", bg:"#0a1f0a",
    tagline:"The universal language of data science.",
    analogy:"Python is to data science what Excel is to accountants — except infinitely more powerful. It reads almost like English, which is why scientists, economists, and biologists who've never coded before can learn it in weeks. 90% of everything you'll do in data science — loading data, cleaning it, visualising it, modelling it — happens in Python.",
    topics:["Lists, dicts, loops, list comprehensions", "Functions and lambda expressions", "File I/O — reading CSVs and JSONs", "Error handling with try/except", "Virtual environments and pip"],
    code:`# Python reads almost like English
sales_data = [120, 85, 200, 165, 300, 245, 180]

# Filter months with over 150 sales
good_months = [s for s in sales_data if s > 150]

# Calculate average
average = sum(good_months) / len(good_months)
print(f"Average of good months: {average:.1f}")

# Simple function
def growth_rate(current, previous):
    return ((current - previous) / previous) * 100

print(f"Growth: {growth_rate(300, 245):.1f}%")
# Output: Growth: 22.4%`,
    codeNote:"List comprehensions like [s for s in sales_data if s > 150] are Python's superpower — one line replaces a 4-line loop. This is why data scientists love Python: complex data operations become readable one-liners."
  },
  {
    name:"NumPy & Pandas", icon:"Pd", level:"Core", color:"#60a5fa", bg:"#00111f",
    tagline:"The engine that makes Python fast enough for data.",
    analogy:"Imagine you have a spreadsheet with 1 million rows. Doing a calculation on every row in pure Python would take 10 seconds. NumPy does it in 0.01 seconds — because it uses fast compiled C code under the hood. Pandas is NumPy + a spreadsheet-like interface. Together, they're why Python can handle real-world datasets.",
    topics:["NumPy arrays — fast maths on entire datasets", "Pandas DataFrame — loading and exploring data", "Filtering rows with conditions", "GroupBy — summarising data by category", "Merge/Join — combining multiple datasets", "Handling missing values (NaN)"],
    chartData:[{label:"Jan",value:120},{label:"Feb",value:85},{label:"Mar",value:200},{label:"Apr",value:165},{label:"May",value:300},{label:"Jun",value:245}],
    chartTitle:"Monthly Sales (example Pandas output)",
    chartNote:"This chart is the kind of output you get from a few lines of Pandas + Matplotlib. Real data analysis starts here.",
    code:`import pandas as pd
import numpy as np

# Load a CSV file (could be 10 million rows)
df = pd.read_csv('sales.csv')

# Explore the data
print(df.head())      # first 5 rows
print(df.describe())  # mean, std, min, max of every column

# Filter: only rows where sales > 100
big_sales = df[df['amount'] > 100]

# Group by category and get the mean
by_category = df.groupby('category')['amount'].mean()
print(by_category)

# Add a new calculated column
df['profit'] = df['revenue'] - df['cost']
df['margin'] = (df['profit'] / df['revenue']) * 100`,
    codeNote:"This is the core data science workflow: load → explore → filter → aggregate → transform. These 10 lines replace what would take hours in Excel. df['amount'] > 100 creates a boolean mask that filters the entire million-row dataset instantly."
  },
  {
    name:"Matplotlib & Seaborn", icon:"Plt", level:"Core", color:"#f472b6", bg:"#1a0011",
    tagline:"Turn raw numbers into insight anyone can see.",
    analogy:"Data without visualisation is just a wall of numbers. Matplotlib is like MS Paint — you have full control, but you build everything from scratch. Seaborn is like Canva — beautiful charts with sensible defaults. A data analyst who can't communicate findings visually is like a scientist who publishes results but never writes conclusions.",
    topics:["Line charts, bar charts, scatter plots", "Histograms — showing distributions", "Heatmaps — showing correlations between variables", "Customising titles, labels, colours", "Seaborn for statistical visualisations", "Saving charts as PNG/PDF"],
    chartData:[{label:"20s",value:45},{label:"30s",value:80},{label:"40s",value:65},{label:"50s",value:55},{label:"60s",value:30},{label:"70s",value:15}],
    chartTitle:"Users by age group (example Seaborn output)",
    chartNote:"A distribution chart like this tells a story instantly — most users are in their 30s and 40s. One chart communicates what 200 rows of data can't.",
    code:`import matplotlib.pyplot as plt
import seaborn as sns

# Create a figure with two charts side by side
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))

# Bar chart: sales by month
months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
sales  = [120, 85, 200, 165, 300, 245]
ax1.bar(months, sales, color='#4ade80')
ax1.set_title('Monthly Sales')
ax1.set_ylabel('Units sold')

# Seaborn: correlation heatmap
# Shows which variables are related to each other
corr = df.corr()  # automatically calculates correlations
sns.heatmap(corr, annot=True, cmap='coolwarm', ax=ax2)
ax2.set_title('Feature Correlations')

plt.tight_layout()
plt.savefig('analysis.png', dpi=150)
plt.show()`,
    codeNote:"plt.subplots creates a canvas with two charts. The heatmap shows which columns in your dataset are correlated — if two variables always move together, their cell shows 1.0. This is essential before building any machine learning model."
  },
  {
    name:"SQL", icon:"SQL", level:"Core", color:"#a78bfa", bg:"#0f0a1a",
    tagline:"The language every database speaks.",
    analogy:"Every company stores data in databases, and SQL is how you talk to them. Imagine a library with millions of books — SQL is how you ask the librarian for 'all mystery novels written after 2010 by authors from the UK, sorted by rating'. It's been around since the 1970s and is still the #1 skill expected in every data role. Non-negotiable.",
    topics:["SELECT, WHERE, ORDER BY, LIMIT basics", "Aggregation: COUNT, SUM, AVG, MAX, MIN", "GROUP BY — summarise by category", "JOIN — combine data from multiple tables", "Subqueries and CTEs (WITH clauses)", "Window functions: RANK, LAG, LEAD, SUM OVER"],
    code:`-- Real SQL analysis: top 5 customers by revenue
-- and their growth vs last month

WITH monthly_revenue AS (
  SELECT
    customer_id,
    DATE_TRUNC('month', order_date) AS month,
    SUM(order_total)                AS revenue
  FROM orders
  WHERE status = 'completed'
  GROUP BY 1, 2
),
with_growth AS (
  SELECT
    customer_id, month, revenue,
    LAG(revenue) OVER (
      PARTITION BY customer_id ORDER BY month
    ) AS prev_month_revenue
  FROM monthly_revenue
)
SELECT
  c.name,
  w.revenue,
  ROUND(
    (w.revenue - w.prev_month_revenue)
    / NULLIF(w.prev_month_revenue, 0) * 100, 1
  ) AS growth_pct
FROM with_growth w
JOIN customers c ON c.id = w.customer_id
WHERE w.month = '2026-03-01'
ORDER BY w.revenue DESC
LIMIT 5;`,
    codeNote:"This query uses a CTE (WITH clause) to break a complex question into readable steps. LAG() is a window function that looks at the previous month's revenue for each customer. This kind of query is standard in every data analyst role."
  },
  {
    name:"Machine Learning (Scikit-learn)", icon:"ML", level:"Advanced", color:"#f97316", bg:"#1a0a00",
    tagline:"Teaching computers to spot patterns humans can't see.",
    analogy:"Machine learning is pattern recognition at scale. A spam filter that reads 10 million emails and learns which features make an email spam — that's ML. A house price predictor that looks at 500,000 past sales and learns that bedrooms, location, and square footage predict price — that's ML. You don't program the rules; the algorithm finds them.",
    topics:["What is a model — input features → prediction", "Train/test split — why you hold data back", "Linear Regression — predicting numbers", "Classification — predicting categories", "Decision Trees and Random Forests", "Model evaluation: accuracy, precision, recall", "Feature engineering — making data ML-ready"],
    code:`from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report
import pandas as pd

# Load data: predict if customer will churn
df = pd.read_csv('customers.csv')

# Features (what we know) vs Target (what we predict)
X = df[['age', 'monthly_spend', 'months_active', 'support_tickets']]
y = df['churned']  # 1 = left, 0 = stayed

# Split: 80% to train, 20% to test
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Train a Random Forest model
model = RandomForestClassifier(n_estimators=100)
model.fit(X_train, y_train)

# Evaluate on the held-out test data
predictions = model.predict(X_test)
print(classification_report(y_test, predictions))

# Predict for a new customer
new_customer = [[35, 120, 8, 3]]
print("Churn risk:", model.predict_proba(new_customer)[0][1])`,
    codeNote:"This is the complete ML workflow: load data → define features and target → split → train → evaluate. The test split is crucial — if you train and test on the same data, the model looks perfect but fails in the real world. model.predict_proba gives the probability of churning, not just yes/no."
  },
  {
    name:"R Language", icon:"R", level:"Alternative", color:"#f472b6", bg:"#1a0011",
    tagline:"Built by statisticians, for statisticians.",
    analogy:"R is what academic researchers, economists, biologists, and pharmaceutical companies use. If Python is the Swiss Army knife, R is the surgeon's scalpel — incredibly precise for statistical analysis, built specifically for the kind of work that gets published in academic journals. If you're going into research, healthcare data, or economics — learn R.",
    topics:["Vectors, data frames, lists", "dplyr and tidyr — tidyverse data manipulation", "ggplot2 — publication-quality visualisations", "Statistical tests: t-test, ANOVA, chi-squared", "R Markdown — reproducible research reports", "Linear and logistic regression with native R"],
    code:`library(tidyverse)  # dplyr + ggplot2 + more

# Load and explore data
df <- read_csv("sales.csv")
glimpse(df)  # like df.info() in Pandas

# Tidy data manipulation (pipe-based)
summary_df <- df |>
  filter(status == "completed") |>
  group_by(category, month = floor_date(date, "month")) |>
  summarise(
    total_revenue = sum(amount),
    num_orders    = n(),
    avg_order     = mean(amount)
  ) |>
  arrange(desc(total_revenue))

# Statistical test: is the difference significant?
t.test(amount ~ group, data = df)

# Publication-quality chart
ggplot(summary_df, aes(x = month, y = total_revenue, colour = category)) +
  geom_line(linewidth = 1.2) +
  geom_point(size = 2.5) +
  scale_y_continuous(labels = scales::comma) +
  labs(title = "Revenue by Category", x = NULL, y = "Revenue ($)") +
  theme_minimal()`,
    codeNote:"The pipe operator |> passes data from one function to the next — exactly like a pipeline. R's ggplot2 builds charts in layers: data + aesthetic mappings + geometries + scales + labels + theme. Every step is addable without rewriting from scratch."
  },
];

const DATA_BUILDS = ["EDA report on a public dataset (Titanic, Iris)","Sales dashboard with interactive charts","Customer churn prediction model","A/B test analysis report","Movie recommendation engine"];

const DATA_RESOURCES = [
  { icon:BookOpen, label:"Kaggle Learn",              sub:"Free interactive Python, ML, SQL courses",            href:"https://www.kaggle.com/learn",         color:"#4ade80" },
  { icon:BookOpen, label:"Pandas Documentation",      sub:"Complete Pandas reference and tutorials",             href:"https://pandas.pydata.org/docs",        color:"#60a5fa" },
  { icon:BookOpen, label:"Scikit-learn User Guide",   sub:"Official ML guide with examples",                     href:"https://scikit-learn.org/stable/user_guide.html", color:"#f97316" },
  { icon:BookOpen, label:"Seaborn Gallery",           sub:"Visual examples of every chart type with code",       href:"https://seaborn.pydata.org/examples",   color:"#f472b6" },
  { icon:BookOpen, label:"DataLemur (SQL)",           sub:"SQL practice problems used in real interviews",       href:"https://datalemur.com",                 color:"#a78bfa" },
  { icon:BookOpen, label:"R for Data Science (book)", sub:"Hadley Wickham's free online book for R/tidyverse",   href:"https://r4ds.had.co.nz",               color:"#f472b6" },
  { icon:Play,  label:"StatQuest with Josh Starmer",sub:"Youtube — the best stats and ML explanations ever", href:"https://www.Youtube.com/@statquest",                     color:"#4ade80" },
  { icon:Play,  label:"Alex The Analyst",          sub:"Youtube — SQL and Python for data analysts",         href:"https://www.Youtube.com/@AlexTheAnalyst",               color:"#60a5fa" },
  { icon:Play,  label:"Sentdex",                   sub:"Youtube — Python for data science and ML",           href:"https://www.Youtube.com/@sentdex",                      color:"#f472b6" },
  { icon:Play,  label:"Rob Mulla",                 sub:"Youtube — Kaggle competitions and EDA walkthroughs", href:"https://www.Youtube.com/@robmulla",                     color:"#f97316" },
];

export default function DataScience() {
  const T = useTheme();
  const [activeTab, setActiveTab] = useState("journey");
  const TRACK_COLOR = "#f472b6";

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
          <div style={{ position:"absolute",left:"50%",top:"40%",transform:"translate(-50%,-50%)",width:600,height:400,borderRadius:"50%",background:`radial-gradient(ellipse,#f472b61c 0%,#a78bfa0c 40%,transparent 70%)`,filter:"blur(50px)",pointerEvents:"none" }}/>
          <div style={{ maxWidth:860, margin:"0 auto", position:"relative" }}>
            <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:0.08}}
              style={{ display:"inline-flex",alignItems:"center",gap:7,padding:"4px 14px",borderRadius:100,background:"#f472b614",border:"1px solid #f472b640",marginBottom:20 }}>
              <BarChart2 size={12} color={TRACK_COLOR}/>
              <span style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:10,fontWeight:700,color:TRACK_COLOR,letterSpacing:"1.8px",textTransform:"uppercase" }}>Data Science</span>
            </motion.div>
            <motion.h1 initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} transition={{delay:0.15}}
              style={{ fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:"clamp(36px,6vw,64px)",lineHeight:1.06,letterSpacing:"-1.5px",marginBottom:18,color:T.t1 }}>
              Find meaning<br/><span style={{ color:TRACK_COLOR }}>in the numbers.</span>
            </motion.h1>
            <motion.p initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} transition={{delay:0.24}}
              style={{ fontFamily:"'Lora',serif",fontStyle:"italic",fontSize:"clamp(15px,2vw,18px)",color:T.t2,lineHeight:1.82,maxWidth:560,marginBottom:28 }}>
              Data science is the discipline of asking questions of data and finding answers that change decisions. Netflix uses it to decide which shows to make. Hospitals use it to predict which patients need urgent care. Every company that collects data — which is every company — needs people who can make sense of it.
            </motion.p>
            <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.36}} style={{ display:"flex",flexWrap:"wrap",gap:8 }}>
              {DATA_BUILDS.map(b=>(
                <div key={b} style={{ display:"flex",alignItems:"center",gap:6,padding:"5px 12px",background:T.panel,border:`1px solid ${T.b2}`,borderRadius:8 }}>
                  <CheckCircle2 size={12} color={TRACK_COLOR}/><span style={{ fontFamily:"'Syne',sans-serif",fontSize:12.5,color:T.t1,fontWeight:500 }}>{b}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* WORKFLOW STRIP */}
        <div style={{ background:T.panel, borderBottom:`1px solid ${T.b1}`, padding:"0 24px", overflowX:"auto" }}>
          <div style={{ maxWidth:860, margin:"0 auto", display:"flex", alignItems:"center", gap:0, minHeight:52, flexWrap:"nowrap" }}>
            {["Get Data","Clean Data","Explore (EDA)","Visualise","Model (ML)","Communicate"].map((s,i,arr)=>(
              <React.Fragment key={s}>
                <div style={{ display:"flex",alignItems:"center",gap:6,padding:"0 12px",flexShrink:0 }}>
                  <div style={{ width:22,height:22,borderRadius:6,background:TRACK_COLOR+"20",border:`1px solid ${TRACK_COLOR}44`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:700,color:TRACK_COLOR,fontFamily:"'JetBrains Mono',monospace" }}>{i+1}</div>
                  <span style={{ fontFamily:"'Syne',sans-serif",fontWeight:600,fontSize:12.5,color:T.t1,whiteSpace:"nowrap" }}>{s}</span>
                </div>
                {i<arr.length-1&&<div style={{ color:T.t4,fontSize:16,flexShrink:0,paddingTop:1 }}>›</div>}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* TABS */}
        <div style={{ background:T.deep, borderBottom:`1px solid ${T.b1}`, padding:"0 24px", position:"sticky", top:60, zIndex:40, backdropFilter:"blur(16px)" }}>
          <div style={{ maxWidth:860, margin:"0 auto", display:"flex", gap:2 }}>
            {[{id:"journey",label:"The Journey"},{id:"languages",label:"Languages & Libraries"},{id:"resources",label:"Resources"}].map(tab=>{
              const active = activeTab===tab.id;
              return <button key={tab.id} onClick={()=>setActiveTab(tab.id)} style={{ padding:"12px 16px",borderRadius:"8px 8px 0 0",border:"none",background:active?`${TRACK_COLOR}14`:"transparent",color:active?TRACK_COLOR:T.t2,fontFamily:"'Syne',sans-serif",fontWeight:active?700:500,fontSize:13.5,cursor:"pointer",borderBottom:active?`2px solid ${TRACK_COLOR}`:"2px solid transparent",transition:"all 0.15s" }}>{tab.label}</button>;
            })}
          </div>
        </div>

        <div style={{ maxWidth:860, margin:"0 auto", padding:"44px 24px 80px" }}>

          {activeTab==="journey"&&(
            <div>
              <Reveal><SH n="Phase 1" title="Python and data fundamentals" subtitle="Before any ML, you need to speak the language of data." color="#4ade80" T={T}/></Reveal>
              <Reveal delay={0.05}>
                <div style={{ background:T.card,border:`1px solid ${T.b1}`,borderRadius:14,padding:"22px",marginBottom:28 }}>
                  <p style={{ fontFamily:"'Lora',serif",fontSize:15.5,color:T.t2,lineHeight:1.82,marginBottom:16 }}>Start with Python basics — 2–3 weeks. Don't learn everything; learn what you need for data: loops, functions, list comprehensions, dictionaries. Then jump straight to NumPy and Pandas. Your first real exercise: take a CSV file, load it, clean it (handle missing values), and produce a summary table. That single workflow is the foundation of every data job.</p>
                  <div style={{ background:`#4ade8012`,border:`1px solid #4ade8022`,borderRadius:10,padding:"14px 16px" }}>
                    <p style={{ fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:13,color:"#4ade80",marginBottom:8 }}>📋 The EDA checklist every data analyst knows:</p>
                    {["df.shape — how many rows and columns?","df.dtypes — what type is each column?","df.isnull().sum() — any missing data?","df.describe() — min, max, mean, std of every column","df['col'].value_counts() — most common values in a column"].map(c=>(
                      <div key={c} style={{ display:"flex",gap:8,alignItems:"flex-start",marginBottom:5 }}>
                        <CheckCircle2 size={12} color="#4ade80" style={{ flexShrink:0,marginTop:2 }}/>
                        <span style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:12,color:T.t1 }}>{c}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>

              <Reveal><SH n="Phase 2" title="SQL — the non-negotiable skill" subtitle="Every data job, every company. You must know SQL." color="#a78bfa" T={T}/></Reveal>
              <Reveal delay={0.05}>
                <div style={{ background:T.card,border:`1px solid ${T.b1}`,borderRadius:14,padding:"22px",marginBottom:28 }}>
                  <p style={{ fontFamily:"'Lora',serif",fontSize:15.5,color:T.t2,lineHeight:1.82 }}>Learn SQL in parallel with Python — they complement each other. Data analysts spend most of their time writing SQL to pull the right data from databases. The good news: the fundamentals take 2 weeks. Practice on DataLemur or StrataScratch with real interview questions. Window functions (RANK, LAG) are what separate beginners from job-ready analysts.</p>
                </div>
              </Reveal>

              <Reveal><SH n="Phase 3" title="Visualise first, model later" subtitle="Most data roles need great charts more than ML models." color="#f472b6" T={T}/></Reveal>
              <Reveal delay={0.05}>
                <div style={{ background:T.card,border:`1px solid ${T.b1}`,borderRadius:14,padding:"22px",marginBottom:28 }}>
                  <p style={{ fontFamily:"'Lora',serif",fontSize:15.5,color:T.t2,lineHeight:1.82 }}>A common beginner mistake is rushing to ML. Most data analyst roles require zero ML — they need someone who can take messy data, clean it, summarise it, and present it as a clear chart that a non-technical manager can understand. Master Matplotlib and Seaborn first. The most important skill in data science is storytelling with data.</p>
                </div>
              </Reveal>

              <Reveal><SH n="Phase 4" title="Machine Learning — the final frontier" subtitle="Build models that predict, classify, and cluster." color="#f97316" T={T}/></Reveal>
              <Reveal delay={0.05}>
                <div style={{ background:T.card,border:`1px solid ${T.b1}`,borderRadius:14,padding:"22px" }}>
                  <p style={{ fontFamily:"'Lora',serif",fontSize:15.5,color:T.t2,lineHeight:1.82 }}>Once you understand the data, ML is surprisingly accessible with Scikit-learn. The concepts (train/test split, features, labels, model evaluation) are more important than the code — Scikit-learn makes the code 10 lines. Start with linear regression and decision trees. Kaggle competitions are the best way to apply everything — pick a beginner competition, submit anything, improve. Joining the top 50% is achievable in your first month.</p>
                </div>
              </Reveal>
            </div>
          )}

          {activeTab==="languages"&&(
            <div>
              <Reveal><p style={{ fontFamily:"'Lora',serif",fontStyle:"italic",fontSize:16,color:T.t2,lineHeight:1.82,marginBottom:32 }}>Data science uses libraries more than languages — you write Python, but the real work happens inside NumPy, Pandas, Matplotlib, and Scikit-learn. Some cards include a live chart preview showing what the tool produces.</p></Reveal>
              {DATA_LANGS.map(lang=><LangCard key={lang.name} lang={lang} T={T}/>)}
            </div>
          )}

          {activeTab==="resources"&&(
            <div>
              <Reveal>
                <div style={{ background:"#f472b612",border:"1px solid #f472b630",borderRadius:12,padding:"16px 18px",marginBottom:28 }}>
                  <p style={{ fontFamily:"'Lora',serif",fontSize:15.5,color:T.t1,lineHeight:1.75 }}>🗺️ <strong>Suggested path:</strong> Start with Kaggle Learn (free, interactive, structured). Use StatQuest on Youtube for statistics and ML concepts — Josh Starmer is genuinely the best teacher for this. Alex The Analyst for SQL and Python practicals. DataLemur for SQL interview prep. Join one Kaggle competition as soon as you finish the basics.</p>
                </div>
              </Reveal>
              <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:10 }}>
                {DATA_RESOURCES.map((r,i)=><Reveal key={r.label} delay={i*0.05}><Res {...r} T={T}/></Reveal>)}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}