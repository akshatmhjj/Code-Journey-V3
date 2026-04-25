import { useState, useEffect, useRef } from "react";

// ─── Google Fonts ───────────────────────────────────────────────────────────
const FontLoader = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,300;0,400;0,500;0,600;1,400&family=Syne:wght@400;500;600;700;800&display=swap');
  `}</style>
);

// ─── Design Tokens ──────────────────────────────────────────────────────────
const themes = {
  light: {
    void: "#f3f4f6", deep: "#ffffff", mid: "#f8f9fb", surface: "#ffffff", panel: "#f5f7fa",
    hover: "#e2e8f0", active: "#cbd5e1",
    purple: "#6b7280", teal: "#1d4ed8", warm: "#374151", pink: "#6d28d9", gold: "#b45309", green: "#15803d", red: "#b91c1c",
    text1: "#000000", text2: "#1e293b", text3: "#475569",
    b1: "rgba(148,163,184,0.20)", b2: "rgba(148,163,184,0.12)", b3: "rgba(148,163,184,0.08)",
    cKw: "#2563eb", cFn: "#000000", cStr: "#14b8a6", cNum: "#0284c7", cCm: "#64748b", cOp: "#475569", cCls: "#000000", cTag: "#6366f1", cAtr: "#000000", cVal: "#000000", cVar: "#000000",
  },
  dark: {
    void: "#1e1e1e", deep: "#252526", mid: "#1e1e1e", surface: "#1e1e1e", panel: "#2d2d30", 
    hover: "#2c2c2e", active: "#3c3c3f",
    purple: "#c0c5ce", teal: "#4fd1c5", warm: "#9ca3af", pink: "#bd93f9", gold: "#f59e0b", green: "#34d399", red: "#f87171",
    text1: "#ffffff", text2: "#e2e8f0", text3: "#94a3b8",
    b1: "rgba(173,184,195,0.25)", b2: "rgba(173,184,195,0.12)", b3: "rgba(173,184,195,0.08)",
    cKw: "#569cd6", cFn: "#dcdcaa", cStr: "#ce9178", cNum: "#b5cea8", cCm: "#6a9955", cOp: "#d4d4d4", cCls: "#4ec9b0", cTag: "#569cd6", cAtr: "#9cdcfe", cVal: "#b5cea8", cVar: "#9cdcfe",
  }
};
let T = themes.light;

// ─── SVG Icons ──────────────────────────────────────────────────────────────
const Icon = ({ name, size = 18, color = themes.light.text3, style = {} }) => {
  const s = { width: size, height: size, flexShrink: 0, ...style };
  const paths = {
    explorer:   <><rect x="3" y="3" width="7" height="8" rx="1"/><rect x="3" y="13" width="7" height="8" rx="1"/><rect x="13" y="3" width="8" height="18" rx="1"/></>,
    search:     <><circle cx="11" cy="11" r="7"/><line x1="16.5" y1="16.5" x2="21" y2="21"/></>,
    git:        <><line x1="6" y1="3" x2="6" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M18 9a9 9 0 01-9 9"/></>,
    extensions: <><path d="M20.5 10H19V8.5a1.5 1.5 0 00-3 0V10h-1.5a1.5 1.5 0 000 3H16v1.5a1.5 1.5 0 003 0V13h1.5a1.5 1.5 0 000-3z"/><path d="M9.5 14a1.5 1.5 0 011.5 1.5V17h1.5a1.5 1.5 0 010 3H11v1.5a1.5 1.5 0 01-3 0V20H6.5a1.5 1.5 0 010-3H8v-1.5A1.5 1.5 0 019.5 14z"/></>,
    ai:         <><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.44-4.04A2.5 2.5 0 0 1 9.5 2"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.44-4.04A2.5 2.5 0 0 0 14.5 2"/></>,
    profile:    <><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></>,
    settings:   <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></>,
    folder:     <><path d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></>,
    file:       <><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></>,
    play:       <><polygon points="5 3 19 12 5 21 5 3"/></>,
    terminal:   <><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></>,
    close:      <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>,
    chevDown:   <><polyline points="6 9 12 15 18 9"/></>,
    chevRight:  <><polyline points="9 18 15 12 9 6"/></>,
    panel:      <><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="15" x2="21" y2="15"/></>,
    sidebar:    <><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="3" x2="9" y2="21"/></>,
    check:      <><polyline points="20 6 9 17 4 12"/></>,
    copy:       <><rect x="9" y="9" width="13" height="13" rx="2" fill="none"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></>,
    check:      <><polyline points="20 6 9 17 4 12"/></>,
    warning:    <><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></>,
    info:       <><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></>,
    plus:       <><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>,
    more:       <><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></>,
    trash:      <><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/></>,
    copy:       <><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></>,
    sun:       <><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></>,
    moon:      <><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></>,
    minimize:   <><line x1="5" y1="12" x2="19" y2="12"/></>,
    maximize:   <><rect x="3" y="3" width="18" height="18" rx="2"/></>,
    refresh:    <><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></>,
  };
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={s}>
      {paths[name]}
    </svg>
  );
};

// ─── Language Definitions ────────────────────────────────────────────────────
const LANGUAGES = {
  javascript: {
    name: "JavaScript", label: "JS", ext: ".js",
    dotColor: "#f9c74f",
    files: [
      { name: "main.js", type: "file" },
      { name: "utils.js", type: "file" },
      { name: "components", type: "folder", children: [
        { name: "App.js", type: "file" },
        { name: "Button.js", type: "file" },
      ]},
      { name: "index.html", type: "file" },
      { name: "style.css", type: "file" },
    ],
    challenge: { title: "Fibonacci Sequence", badge: "Exercise 7", desc: "Write a function that returns the nth Fibonacci number using recursion or dynamic programming.", hints: ["Think about base cases: fib(0) = 0 and fib(1) = 1", "Each number is the sum of the two preceding numbers", "Use memoization (cache) to avoid redundant recursive calls and improve performance from O(2^n) to O(n)"] },
    tests: [
      { label: "fib(0) → 0", status: "pass" },
      { label: "fib(1) → 1", status: "pass" },
      { label: "fib(10) → expected 55", status: "fail" },
      { label: "fib(20) → not run", status: "pending" },
    ],
    code: `// 🚀 Code Journey - JavaScript · Exercise 7
// Topic: Recursion & Dynamic Programming

/**
 * Returns the nth Fibonacci number.
 * @param {number} n - The index in the Fibonacci sequence
 * @returns {number} The nth Fibonacci number
 */
function fibonacci(n) {
  // TODO: implement fibonacci logic
  if (n <= 1) return n;

  return fibonacci(n - 1) + fibonacci(n - 2);
}

// Test your function
console.log(fibonacci(10)); // expected: 55
console.log(fibonacci(20)); // expected: 6765

// ─── Bonus: Memoized version ───────────────────────────────
const memo = {};

function fibMemo(n) {
  if (n in memo) return memo[n];
  if (n <= 1)    return n;
  return memo[n] = fibMemo(n - 1) + fibMemo(n - 2);
}`,
    terminalLines: [
      { type: "prompt", text: "node main.js" },
      { type: "out",    text: "55" },
      { type: "out",    text: "6765" },
      { type: "success",text: "✓ Tests passed: 2/4" },
      { type: "warning",text: "⚠  fib(10) returned undefined - check your logic" },
    ],
  },
  typescript: {
    name: "TypeScript", label: "TS", ext: ".ts",
    dotColor: "#4fc3f7",
    files: [
      { name: "main.ts", type: "file" },
      { name: "types.ts", type: "file" },
      { name: "Stack.ts", type: "file" },
      { name: "tsconfig.json", type: "file" },
    ],
    challenge: { title: "Generic Stack<T>", badge: "Exercise 12", desc: "Implement a fully type-safe generic Stack<T> class with push, pop, peek and isEmpty methods.", hints: ["Define the class with a generic type parameter <T>", "Use a private array items: T[] to store the stack elements", "Remember pop() should return T | undefined for empty stacks"] },
    tests: [
      { label: "push() adds element", status: "pass" },
      { label: "pop() removes top", status: "pass" },
      { label: "peek() returns top", status: "fail" },
      { label: "isEmpty() works", status: "pending" },
    ],
    code: `// 🚀 Code Journey - TypeScript · Exercise 12
// Topic: Generics & Type Safety

class Stack<T> {
  private items: T[] = [];

  push(item: T): void {
    this.items.push(item);
  }

  pop(): T | undefined {
    return this.items.pop();
  }

  peek(): T | undefined {
    return this.items[this.items.length - 1];
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  get size(): number {
    return this.items.length;
  }
}

// Usage example
const numStack = new Stack<number>();
numStack.push(1);
numStack.push(2);
numStack.push(3);

console.log(numStack.peek()); // 3
console.log(numStack.size);   // 3
console.log(numStack.pop());  // 3`,
    terminalLines: [
      { type: "prompt",  text: "tsc Stack.ts && node Stack.js" },
      { type: "success", text: "✓ Compilation successful - 0 errors" },
      { type: "out",     text: "3" },
      { type: "out",     text: "3" },
      { type: "out",     text: "3" },
      { type: "success", text: "✓ All type checks passed" },
    ],
  },
  python: {
    name: "Python", label: "Py", ext: ".py",
    dotColor: "#6fcf97",
    files: [
      { name: "main.py", type: "file" },
      { name: "analysis.py", type: "file" },
      { name: "data", type: "folder", children: [
        { name: "dataset.csv", type: "file" },
        { name: "cleaned.csv", type: "file" },
      ]},
      { name: "requirements.txt", type: "file" },
    ],
    challenge: { title: "Data Analysis", badge: "Exercise 18", desc: "Load a CSV dataset, compute descriptive statistics and visualize the distribution using pandas and matplotlib.", hints: ["Use pd.read_csv() to load the dataset", "df.describe() gives you all key statistics at once", "Use plt.hist() with bins parameter to control granularity"] },
    tests: [
      { label: "CSV loads without error", status: "pass" },
      { label: "mean computed correctly", status: "pass" },
      { label: "std deviation correct", status: "fail" },
      { label: "plot renders", status: "pending" },
    ],
    code: `# 🚀 Code Journey - Python · Exercise 18
# Topic: Data Analysis with Pandas & Matplotlib

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from pathlib import Path

# ─── Load & Inspect ─────────────────────────────────────────
df = pd.read_csv('data/dataset.csv')
print(df.head())
print(df.describe())

# ─── Compute Statistics ─────────────────────────────────────
mean_val = np.mean(df['value'])
std_val  = np.std(df['value'])
median   = np.median(df['value'])

print(f"Mean:   {mean_val:.2f}")
print(f"Std:    {std_val:.2f}")
print(f"Median: {median:.2f}")

# ─── Visualize Distribution ──────────────────────────────────
fig, axes = plt.subplots(1, 2, figsize=(12, 5))

axes[0].hist(df['value'], bins=20, color='#7c6ee0', edgecolor='white')
axes[0].set_title('Distribution')

axes[1].boxplot(df['value'])
axes[1].set_title('Box Plot')

plt.tight_layout()
plt.savefig('output.png', dpi=150)
plt.show()`,
    terminalLines: [
      { type: "prompt",  text: "python main.py" },
      { type: "out",     text: "   value  score  category" },
      { type: "out",     text: "0   48.2   91.3  A" },
      { type: "out",     text: "Mean:   48.23  Std:  14.57" },
      { type: "success", text: "✓ Plot saved to output.png" },
    ],
  },
  html: {
    name: "HTML/CSS", label: "</>", ext: ".html",
    dotColor: "#f97316",
    files: [
      { name: "index.html", type: "file" },
      { name: "style.css", type: "file" },
      { name: "script.js", type: "file" },
      { name: "assets", type: "folder", children: [
        { name: "logo.svg", type: "file" },
      ]},
    ],
    challenge: { title: "Responsive Card Grid", badge: "Exercise 5", desc: "Build a responsive card grid with CSS Grid & Flexbox, hover animations and a mobile-first approach.", hints: ["Use grid-template-columns: repeat(auto-fit, minmax(240px,1fr))", "Add transition: transform 0.3s to card for smooth hover", "Media queries should adjust padding and font sizes for mobile"] },
    tests: [
      { label: "Valid HTML5 markup", status: "pass" },
      { label: "Grid layout correct", status: "pass" },
      { label: "Hover animation works", status: "fail" },
      { label: "Mobile responsive", status: "pending" },
    ],
    code: `<!-- 🚀 Code Journey - HTML/CSS · Exercise 5 -->
<!-- Topic: CSS Grid, Flexbox & Animations -->

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Card Grid</title>
  <style>
    /* ── Reset & Base ─────────────────────────────── */
    *, *::before, *::after { box-sizing: border-box; margin: 0; }

    body {
      font-family: 'Inter', sans-serif;
      background: #0f1117;
      color: #e8eaf2;
      padding: 2rem;
    }

    /* ── Responsive Grid ──────────────────────────── */
    .card-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 1.5rem;
    }

    /* ── Card Component ───────────────────────────── */
    .card {
      background: #1c2030;
      border: 1px solid rgba(120,130,180,0.12);
      border-radius: 12px;
      padding: 1.5rem;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      cursor: pointer;
    }

    /* TODO: add hover effect here */
    .card:hover {
      /* your code here */
    }
  </style>
</head>
<body>
  <section class="card-grid">
    <div class="card">Card One</div>
    <div class="card">Card Two</div>
    <div class="card">Card Three</div>
  </section>
</body>
</html>`,
    terminalLines: [
      { type: "prompt",  text: "npx serve ." },
      { type: "success", text: "✓ Serving at http://localhost:3000" },
      { type: "out",     text: "GET / 200 OK  3ms" },
      { type: "out",     text: "GET /style.css 200 OK  1ms" },
    ],
  },
  dart: {
    name: "Flutter", label: "Fl", ext: ".dart",
    dotColor: "#5eead4",
    files: [
      { name: "main.dart", type: "file" },
      { name: "widgets", type: "folder", children: [
        { name: "counter.dart", type: "file" },
        { name: "button.dart", type: "file" },
      ]},
      { name: "pubspec.yaml", type: "file" },
    ],
    challenge: { title: "Stateful Widget", badge: "Exercise 9", desc: "Build a Flutter counter app with a custom StatefulWidget, animated FAB and a styled Material UI.", hints: ["Extend StatefulWidget and create the corresponding State class", "Call setState() inside any method that changes state", "Use AnimatedContainer for smooth UI transitions"] },
    tests: [
      { label: "Widget renders", status: "pass" },
      { label: "Counter increments", status: "pass" },
      { label: "Animation plays", status: "fail" },
      { label: "Decrement works", status: "pending" },
    ],
    code: `// 🚀 Code Journey - Flutter · Exercise 9
// Topic: Stateful Widgets & setState

import 'package:flutter/material.dart';

void main() => runApp(const MyApp());

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Code Journey Counter',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF7C6EE0),
          brightness: Brightness.dark,
        ),
      ),
      home: const CounterPage(),
    );
  }
}

class CounterPage extends StatefulWidget {
  const CounterPage({super.key});

  @override
  State<CounterPage> createState() => _CounterPageState();
}

class _CounterPageState extends State<CounterPage> {
  int _counter = 0;

  void _increment() => setState(() => _counter++);

  // TODO: add _decrement method

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Text('$_counter',
          style: Theme.of(context).textTheme.displayLarge),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: _increment,
        child: const Icon(Icons.add),
      ),
    );
  }
}`,
    terminalLines: [
      { type: "prompt",  text: "flutter run -d chrome" },
      { type: "out",     text: "Launching lib/main.dart on Chrome..." },
      { type: "out",     text: "Compiling lib/main.dart for the Web..." },
      { type: "success", text: "✓ Built successfully in 4.2s" },
      { type: "out",     text: "Debug service: http://127.0.0.1:8181" },
    ],
  },
  sql: {
    name: "SQL", label: "DB", ext: ".sql",
    dotColor: "#94a3b8",
    files: [
      { name: "queries.sql", type: "file" },
      { name: "schema.sql", type: "file" },
      { name: "seed.sql", type: "file" },
      { name: "README.md", type: "file" },
    ],
    challenge: { title: "Advanced Joins", badge: "Exercise 14", desc: "Write a query to find the top 5 customers by total order value using JOINs, GROUP BY and HAVING.", hints: ["Use INNER JOIN to connect customers and orders tables", "GROUP BY customer_id, then use SUM(total_amount)", "HAVING filters groups - use it instead of WHERE for aggregates"] },
    tests: [
      { label: "JOIN syntax correct", status: "pass" },
      { label: "GROUP BY valid", status: "pass" },
      { label: "HAVING filter works", status: "fail" },
      { label: "Returns 5 rows", status: "pending" },
    ],
    code: `-- 🚀 Code Journey - SQL · Exercise 14
-- Topic: Advanced Joins, Aggregation & Filtering

-- ─── Schema Reference ────────────────────────────────────────
-- customers(customer_id, name, email, created_at)
-- orders(order_id, customer_id, total_amount, status, placed_at)
-- order_items(item_id, order_id, product_id, qty, unit_price)

-- ─── Your Query ──────────────────────────────────────────────
-- Find top 5 customers by total order value (completed orders only)

SELECT
    c.customer_id,
    c.name,
    c.email,
    COUNT(o.order_id)          AS total_orders,
    SUM(o.total_amount)        AS lifetime_value,
    AVG(o.total_amount)        AS avg_order_value
FROM
    customers AS c
    INNER JOIN orders AS o
        ON c.customer_id = o.customer_id
WHERE
    o.status = 'completed'
GROUP BY
    c.customer_id,
    c.name,
    c.email
HAVING
    -- TODO: add HAVING filter here (> $1000 lifetime value)
ORDER BY
    lifetime_value DESC
LIMIT 5;`,
    terminalLines: [
      { type: "prompt",  text: "psql -d journeydb -f queries.sql" },
      { type: "out",     text: " customer_id | name          | lifetime_value" },
      { type: "out",     text: "─────────────┼───────────────┼────────────────" },
      { type: "out",     text: " 142         | Alice Johnson | $24,800.00" },
      { type: "out",     text: " 089         | Bob Chen      | $19,450.00" },
      { type: "success", text: "✓ Query returned 5 rows (22ms)" },
    ],
  },
  r: {
    name: "R", label: "R", ext: ".R",
    dotColor: "#e879a0",
    files: [
      { name: "analysis.R", type: "file" },
      { name: "data.csv", type: "file" },
      { name: "plots", type: "folder", children: [
        { name: "residuals.png", type: "file" },
      ]},
      { name: "report.Rmd", type: "file" },
    ],
    challenge: { title: "Linear Regression", badge: "Exercise 6", desc: "Perform a linear regression on the dataset and visualize residuals using ggplot2.", hints: ["Use lm(y ~ x, data = df) to fit the model", "Call summary(model) to inspect R² and p-values", "ggplot2's geom_smooth(method='lm') overlays the regression line"] },
    tests: [
      { label: "Data loads cleanly", status: "pass" },
      { label: "lm() model fits", status: "pass" },
      { label: "R² > 0.8 achieved", status: "fail" },
      { label: "Residual plot saved", status: "pending" },
    ],
    code: `# 🚀 Code Journey - R Language · Exercise 6
# Topic: Linear Regression & ggplot2 Visualization

library(ggplot2)
library(dplyr)
library(broom)

# ─── Load & Inspect Data ────────────────────────────────────
df <- read.csv("data.csv")
glimpse(df)

# ─── Fit Linear Model ───────────────────────────────────────
model <- lm(y ~ x, data = df)
summary(model)

# Tidy the model output
tidy(model)
glance(model)  # R², AIC, BIC

# ─── Visualize Regression ───────────────────────────────────
ggplot(df, aes(x = x, y = y)) +
  geom_point(alpha = 0.6, color = "#7c6ee0", size = 2) +
  geom_smooth(method = "lm", color = "#5eead4", se = TRUE) +
  labs(
    title    = "Linear Regression: Y ~ X",
    subtitle = paste("R² =", round(summary(model)$r.squared, 3)),
    x = "X Variable",
    y = "Y Variable"
  ) +
  theme_minimal()

# ─── Residual Plot ──────────────────────────────────────────
# TODO: create residual plot here
plot(model, which = 1)`,
    terminalLines: [
      { type: "prompt",  text: "Rscript analysis.R" },
      { type: "out",     text: "Call: lm(formula = y ~ x, data = df)" },
      { type: "out",     text: "Multiple R-squared: 0.8234" },
      { type: "out",     text: "p-value: 2.14e-08 ***" },
      { type: "success", text: "✓ Plots saved to plots/" },
    ],
  },
  kotlin: {
    name: "Kotlin", label: "Kt", ext: ".kt",
    dotColor: "#c792ea",
    files: [
      { name: "Main.kt", type: "file" },
      { name: "Flow.kt", type: "file" },
      { name: "models", type: "folder", children: [
        { name: "User.kt", type: "file" },
      ]},
      { name: "build.gradle.kts", type: "file" },
    ],
    challenge: { title: "Coroutines & Flow", badge: "Exercise 11", desc: "Implement a data stream using Kotlin Flow and coroutines with proper error handling and cancellation.", hints: ["Use flow { emit(value) } to create a cold flow", "Wrap collection in a try/catch or use .catch { } operator", "Use flowOn(Dispatchers.IO) to shift computation off main thread"] },
    tests: [
      { label: "Flow emits values", status: "pass" },
      { label: "Error handling works", status: "pass" },
      { label: "Cancellation safe", status: "fail" },
      { label: "Backpressure handled", status: "pending" },
    ],
    code: `// 🚀 Code Journey - Kotlin · Exercise 11
// Topic: Coroutines, Flow & Error Handling

import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*

// ─── Simple Number Flow ──────────────────────────────────────
fun numberFlow(): Flow<Int> = flow {
    for (i in 1..10) {
        emit(i)
        delay(100L)
    }
}

// ─── Flow with Transformation ────────────────────────────────
fun squaredFlow(): Flow<String> = numberFlow()
    .filter  { it % 2 == 0 }
    .map     { "Square of \$it = \${it * it}" }
    .catch   { e -> emit("Error: \${e.message}") }
    .flowOn  (Dispatchers.Default)

// ─── Main Entry Point ────────────────────────────────────────
suspend fun main() = coroutineScope {
    println("── Number Flow ──────────────────")
    numberFlow()
        .catch { e -> println("Error: $e") }
        .collect { println(it) }

    println("── Squared Even Numbers ─────────")
    squaredFlow()
        .collect { println(it) }

    // TODO: Add timeout & cancellation handling
}`,
    terminalLines: [
      { type: "prompt",  text: "kotlinc Main.kt -include-runtime -d app.jar && java -jar app.jar" },
      { type: "out",     text: "── Number Flow ──────────────────" },
      { type: "out",     text: "1 2 3 4 5 6 7 8 9 10" },
      { type: "out",     text: "── Squared Even Numbers ─────────" },
      { type: "success", text: "✓ Flow completed. No errors." },
    ],
  },
  rust: {
    name: "Rust", label: "Rs", ext: ".rs",
    dotColor: "#f97316",
    files: [
      { name: "main.rs", type: "file" },
      { name: "lib.rs", type: "file" },
      { name: "tests", type: "folder", children: [
        { name: "integration_test.rs", type: "file" },
      ]},
      { name: "Cargo.toml", type: "file" },
    ],
    challenge: { title: "Ownership & Borrowing", badge: "Exercise 3", desc: "Implement safe string manipulation functions demonstrating Rust's ownership system and borrow checker.", hints: ["&str is a borrowed string slice - no ownership transfer", "Use .chars().rev().collect::<String>() to reverse", "Avoid cloning unless necessary - use references"] },
    tests: [
      { label: "reverse_words correct", status: "pass" },
      { label: "Borrow checker happy", status: "pass" },
      { label: "No unnecessary clones", status: "fail" },
      { label: "Edge cases handled", status: "pending" },
    ],
    code: `// 🚀 Code Journey - Rust · Exercise 3
// Topic: Ownership, Borrowing & String Manipulation

// ─── Reverse Words ───────────────────────────────────────────
fn reverse_words(input: &str) -> String {
    input
        .split_whitespace()
        .rev()
        .collect::<Vec<&str>>()
        .join(" ")
}

// ─── Palindrome Check ────────────────────────────────────────
fn is_palindrome(s: &str) -> bool {
    let cleaned: String = s
        .chars()
        .filter(|c| c.is_alphanumeric())
        .map(|c| c.to_lowercase().next().unwrap())
        .collect();

    cleaned == cleaned.chars().rev().collect::<String>()
}

// ─── Count Words ─────────────────────────────────────────────
fn word_count(text: &str) -> usize {
    text.split_whitespace().count()
}

fn main() {
    let sentence = "hello world rust";
    println!("Reversed: {}", reverse_words(sentence));
    println!("Palindrome: {}", is_palindrome("racecar"));
    println!("Word count: {}", word_count(sentence));

    // TODO: add capitalize_words function
}

// ─── Unit Tests ──────────────────────────────────────────────
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_reverse() {
        assert_eq!(reverse_words("a b c"), "c b a");
    }
}`,
    terminalLines: [
      { type: "prompt",  text: "cargo test && cargo run" },
      { type: "out",     text: "   Compiling journey v0.1.0" },
      { type: "out",     text: "    Finished test [unoptimized] target(s)" },
      { type: "out",     text: "test tests::test_reverse ... ok" },
      { type: "out",     text: "Reversed: rust world hello" },
      { type: "success", text: "✓ All tests passed. No borrow check errors." },
    ],
  },
};

// ─── Syntax Highlighter ──────────────────────────────────────────────────────
function highlight(code, lang) {
  const lines = code.split("\n");
  return lines.map((line, idx) => ({ raw: line, idx }));
}

function CodeLine({ line, lang, isActive, theme = themes.light }) {
  const raw = line.raw;
  // very lightweight highlight per token pattern
  const tokens = [];
  let rest = raw;
  let key = 0;

  const push = (text, color, italic = false) => {
    if (!text) return;
    tokens.push(
      <span key={key++} style={{ color, fontStyle: italic ? "italic" : "normal" }}>{text}</span>
    );
  };

  // comment
  if (/^\s*(\/\/|#|--|<!--)/.test(rest)) {
    push(rest, theme.cCm, true);
    return <div style={{ display: "flex", minHeight: 22, lineHeight: "22px", background: isActive ? `rgba(124,110,224,0.07)` : "transparent", borderRadius: 2, paddingLeft: 0 }}>{tokens}</div>;
  }

  // tokenize simple patterns
  const tokenize = (str) => {
    // strings
    str = str.replace(/(["'`])(?:(?!\1)[^\\]|\\.)*?\1/g, m => `<STR>${m}</STR>`);
    return str;
  };

  // We'll do a simple pass
  const segments = [];
  let i = 0;
  const chars = raw;

  // simple regex-based approach
  const rules = [
    { re: /^(\/\/.*|#.*|--.*|<!--.*-->?)/, color: theme.cCm, italic: true },
    { re: /^("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)/, color: theme.cStr },
    { re: /^(\b(?:function|const|let|var|return|if|else|for|while|class|import|export|default|extends|implements|interface|type|from|as|void|int|string|boolean|private|public|override|suspend|fun|val|where|in|AND|OR|SELECT|FROM|WHERE|GROUP BY|HAVING|ORDER BY|LIMIT|INNER JOIN|ON|AS|LEFT|RIGHT|JOIN|null|undefined|true|false|new|this|super|async|await|yield|try|catch|finally|throw|static|abstract|readonly|enum|namespace|module|require|library|fn|struct|impl|use|pub|mut|ref|mod|trait|match|Some|None|Ok|Err)\b)/, color: theme.cKw },
    { re: /^(\b[A-Z][a-zA-Z0-9_]*\b)/, color: theme.cCls },
    { re: /^([a-zA-Z_$][a-zA-Z0-9_$]*(?=\s*\())/, color: theme.cFn },
    { re: /^(\b\d+\.?\d*\b)/, color: theme.cNum },
    { re: /^([+\-*/%=!<>&|?:^~]+)/, color: theme.cOp },
    { re: /^([a-zA-Z_$][a-zA-Z0-9_$]*)/, color: theme.text1 },
    { re: /^(\s+)/, color: "transparent" },
    { re: /^(.)/, color: theme.text1 },
  ];

  let rem = raw;
  const parts = [];
  while (rem.length > 0) {
    let matched = false;
    for (const rule of rules) {
      const m = rem.match(rule.re);
      if (m) {
        parts.push({ text: m[1], color: rule.color, italic: rule.italic || false });
        rem = rem.slice(m[1].length);
        matched = true;
        break;
      }
    }
    if (!matched) { parts.push({ text: rem[0], color: T.text2 }); rem = rem.slice(1); }
  }

  return (
    <div style={{ display: "flex", minHeight: 22, lineHeight: "22px", background: isActive ? `rgba(124,110,224,0.07)` : "transparent", borderRadius: 2, whiteSpace: "pre" }}>
      {parts.map((p, i) => (
        <span key={i} style={{ color: p.color, fontStyle: p.italic ? "italic" : "normal" }}>{p.text}</span>
      ))}
    </div>
  );
}

// ─── Cursor Blink ────────────────────────────────────────────────────────────
const Cursor = () => (
  <span style={{
    display: "inline-block", width: 2, height: 16,
    background: T.teal,
    marginLeft: 1, verticalAlign: "text-bottom",
    animation: "cjBlink 1.1s ease infinite",
  }} />
);

// ─── Activity Bar Icon ────────────────────────────────────────────────────────
const ActIcon = ({ icon, tooltip, active, badge, onClick, theme = themes.light }) => {
  const [hov, setHov] = useState(false);
  return (
    <div onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        width: 40, height: 40, borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center",
        cursor: "pointer", position: "relative", transition: "all 0.18s",
        background: active ? theme.active : hov ? theme.hover : "transparent",
      }}>
      {active && <div style={{ position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)", width: 2.5, height: 22, background: theme.teal, borderRadius: "0 2px 2px 0" }} />}
      <Icon name={icon} color={active || hov ? theme.teal : theme.text3} size={18} />
      {badge && <div style={{ position: "absolute", top: 7, right: 7, width: 7, height: 7, background: theme.red, borderRadius: "50%" }} />}
      {hov && (
        <div style={{
          position: "absolute", left: "calc(100% + 10px)", top: "50%", transform: "translateY(-50%)",
          background: theme.surface, border: `1px solid ${theme.b2}`, color: theme.text1,
          fontSize: 11, padding: "4px 9px", borderRadius: 5, whiteSpace: "nowrap",
          pointerEvents: "none", zIndex: 999, fontFamily: "'Syne', sans-serif", fontWeight: 500,
          boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
        }}>{tooltip}</div>
      )}
    </div>
  );
};

// ─── Lang Chip ───────────────────────────────────────────────────────────────
const LangChip = ({ langKey, data, active, onClick, theme = themes.light }) => {
  const [hov, setHov] = useState(false);
  return (
    <div onClick={() => onClick(langKey)} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        padding: "6px 4px", borderRadius: 6, textAlign: "center", fontSize: 10, fontWeight: 700,
        cursor: "pointer", border: `1px solid ${active ? theme.purple : hov ? theme.b3 : theme.b1}`,
        background: active ? "rgba(124,110,224,0.14)" : hov ? theme.hover : theme.mid,
        color: active ? theme.purple : hov ? theme.purpleL : theme.text2,
        transition: "all 0.15s", letterSpacing: "0.2px",
        fontFamily: "'Syne', sans-serif",
        boxShadow: active ? "0 0 12px rgba(124,110,224,0.12)" : "none",
      }}>
      <div style={{ fontSize: 13, marginBottom: 2, letterSpacing: 0 }}>{data.label}</div>
      <div style={{ fontSize: 9, letterSpacing: "0.3px", opacity: 0.85 }}>{data.name.split("/")[0]}</div>
    </div>
  );
};

// ─── File Tree ───────────────────────────────────────────────────────────────
const FileNode = ({ node, depth = 0, dotColor, activeFile, onSelect, theme = themes.light }) => {
  const [open, setOpen] = useState(depth === 0);
  const isFolder = node.type === "folder";
  const isActive = !isFolder && node.name === activeFile;
  const [hov, setHov] = useState(false);

  return (
    <div>
      <div
        onClick={() => isFolder ? setOpen(o => !o) : onSelect(node.name)}
        onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
        style={{
          display: "flex", alignItems: "center", gap: 7,
          padding: `4px 14px 4px ${14 + depth * 14}px`,
          cursor: "pointer", fontSize: 12.5, fontFamily: "'JetBrains Mono', monospace",
          color: isActive ? theme.text1 : hov ? theme.text1 : theme.text2,
          background: isActive ? theme.active : hov ? theme.hover : "transparent",
          transition: "all 0.12s", position: "relative",
          borderLeft: isActive ? `2px solid ${theme.purple}` : "2px solid transparent",
        }}>
        {isFolder
          ? <Icon name={open ? "chevDown" : "chevRight"} size={11} color={theme.text3} />
          : <div style={{ width: 7, height: 7, borderRadius: "50%", background: dotColor, flexShrink: 0 }} />
        }
        {isFolder && <Icon name="folder" size={14} color={theme.gold} style={{ marginLeft: -2 }} />}
        <span style={{ fontWeight: isFolder ? 600 : 400 }}>{node.name}</span>
      </div>
      {isFolder && open && node.children?.map((child, i) => (
        <FileNode key={i} node={child} depth={depth + 1} dotColor={dotColor} activeFile={activeFile} onSelect={onSelect} theme={theme} />
      ))}
    </div>
  );
};

// ─── Tab ─────────────────────────────────────────────────────────────────────
const Tab = ({ name, dotColor, active, modified, onClick, onClose, theme = themes.light }) => {
  const [hov, setHov] = useState(false);
  return (
    <div onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        display: "flex", alignItems: "center", gap: 7, padding: "0 14px",
        height: "100%", minWidth: 130, maxWidth: 200,
        cursor: "pointer", borderRight: `1px solid ${theme.b1}`,
        background: active ? theme.mid : hov ? theme.hover : "transparent",
        borderBottom: active ? `2px solid ${theme.purple}` : "2px solid transparent",
        transition: "all 0.13s", position: "relative", flexShrink: 0,
        fontFamily: "'JetBrains Mono', monospace",
      }}>
      <div style={{ width: 6, height: 6, borderRadius: "50%", background: dotColor, flexShrink: 0 }} />
      <span style={{ fontSize: 12, color: active ? theme.text1 : theme.text3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>{name}</span>
      {modified && <div style={{ width: 5, height: 5, borderRadius: "50%", background: theme.warm, flexShrink: 0 }} />}
      <div onClick={e => { e.stopPropagation(); onClose(); }}
        style={{
          width: 16, height: 16, display: "flex", alignItems: "center", justifyContent: "center",
          borderRadius: 3, opacity: hov || active ? 1 : 0, transition: "opacity 0.13s",
          color: theme.text3, fontSize: 14, flexShrink: 0,
        }}>
        <Icon name="close" size={11} color={theme.text3} />
      </div>
    </div>
  );
};

// ─── Test Case ───────────────────────────────────────────────────────────────
const TestCase = ({ label, status, theme = themes.light }) => {
  const cfg = {
    pass:    { bg: "rgba(111,207,151,0.07)", color: theme.green,  border: "rgba(111,207,151,0.2)", icon: "check",   label: "✓" },
    fail:    { bg: "rgba(244,112,103,0.07)", color: theme.red,    border: "rgba(244,112,103,0.2)", icon: "close",   label: "✗" },
    pending: { bg: theme.mid,                   color: theme.text3,  border: theme.b1,                   icon: "minimize", label: "○" },
  }[status];
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 10px", borderRadius: 5, background: cfg.bg, border: `1px solid ${cfg.border}`, fontSize: 11.5, fontFamily: "'JetBrains Mono', monospace", color: cfg.color }}>
      <span>{cfg.label}</span>
      <span style={{ color: theme.text2, fontSize: 11 }}>{label}</span>
    </div>
  );
};

// ─── Terminal Line ────────────────────────────────────────────────────────────
const TermLine = ({ line, theme = themes.light }) => {
  const cfg = {
    prompt:  { prompt: true },
    out:     { color: theme.text2 },
    success: { color: theme.green },
    warning: { color: theme.gold },
    error:   { color: theme.red },
  }[line.type] || { color: theme.text2 };
  if (cfg.prompt) return (
    <div style={{ display: "flex", gap: 8, alignItems: "baseline", lineHeight: 1.7 }}>
      <span style={{ color: theme.teal, flexShrink: 0 }}>cj@workspace:~$</span>
      <span style={{ color: theme.text1 }}>{line.text}</span>
    </div>
  );
  return <div style={{ color: cfg.color, lineHeight: 1.7, paddingLeft: 4 }}>{line.text}</div>;
};

// ─── Minimap ──────────────────────────────────────────────────────────────────
const Minimap = ({ code, activeLine, theme = themes.light, onScrollToLine }) => {
  const lines = code.split("\n");
  const [hoveredLine, setHoveredLine] = useState(null);

  return (
    <div style={{ width: 56, background: theme.deep, borderLeft: `1px solid ${theme.b1}`, padding: "14px 6px", overflowY: "hidden", position: "relative", flexShrink: 0 }}>
      <div style={{ position: "absolute", right: 0, top: 14, width: "100%", height: 54, background: "rgba(124,110,224,0.07)", border: "1px solid rgba(124,110,224,0.15)", borderRadius: 2 }} />
      {lines.map((line, i) => {
        const len = line.trimStart().length;
        const indent = line.length - line.trimStart().length;
        const isKw = /\b(function|class|const|let|var|import|def|fn|fun|SELECT|FROM)\b/.test(line);
        const isStr = /["'`]/.test(line);
        const isCm = /^\s*(\/\/|#|--)/.test(line);
        const color = isCm ? theme.cCm : isKw ? "rgba(199,146,234,0.45)" : isStr ? "rgba(195,232,141,0.35)" : "rgba(120,130,180,0.18)";
        const w = Math.min(100, (len / 60) * 100);
        return (
          <div key={i} 
            onMouseEnter={() => setHoveredLine(i)}
            onMouseLeave={() => setHoveredLine(null)}
            onClick={() => onScrollToLine && onScrollToLine(i)}
            style={{ height: 3, marginBottom: 1, marginLeft: `${(indent / 60) * 100}%`, width: `${w}%`, borderRadius: 1, background: i === activeLine ? "rgba(94,234,212,0.5)" : color, cursor: "pointer" }} />
        );
      })}
      {hoveredLine !== null && (
        <div style={{
          position: "absolute", left: -200, top: hoveredLine * 3 + 14, 
          background: theme.surface, border: `1px solid ${theme.b2}`, color: theme.text1,
          fontSize: 11, padding: "4px 8px", borderRadius: 4, whiteSpace: "nowrap",
          pointerEvents: "none", zIndex: 1000, maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis",
          boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
        }}>
          {hoveredLine + 1}: {lines[hoveredLine]?.trim() || ""}
        </div>
      )}
    </div>
  );
};

// ─── Main IDE ─────────────────────────────────────────────────────────────────
export default function CodeJourneyIDE() {
  const [currentLang, setCurrentLang] = useState("javascript");
  const [activeTab, setActiveTab] = useState(0);
  const [tabs, setTabs] = useState([{ name: "main.js", modified: false }]);
  const [activeFile, setActiveFile] = useState("main.js");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [rightPanelOpen, setRightPanelOpen] = useState(true);
  const [panelOpen, setPanelOpen] = useState(true);
  const [panelExpanded, setPanelExpanded] = useState(false);
  const [panelSize, setPanelSize] = useState(185);
  const [panelTab, setPanelTab] = useState("terminal");
  const [themeMode, setThemeMode] = useState("light");
  const [activeActIcon, setActiveActIcon] = useState("explorer");
  const [langTrackOpen, setLangTrackOpen] = useState(true);
  const [fileTreeOpen, setFileTreeOpen] = useState(true);
  const [codeScrollTop, setCodeScrollTop] = useState(0);
  const [codeViewHeight, setCodeViewHeight] = useState(0);
  const [activeLine, setActiveLine] = useState(7);
  const [running, setRunning] = useState(false);
  const [termLines, setTermLines] = useState([]);
  const [tests, setTests] = useState(null);
  const [hint3Revealed, setHint3Revealed] = useState(false);
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [xp] = useState(87);
  const [streak] = useState(7);
  const [copied, setCopied] = useState(false);
  const termRef = useRef(null);
  const codeRef = useRef(null);

  const lang = LANGUAGES[currentLang];
  const T = themes[themeMode];

  useEffect(() => {
    const appTheme = themes[themeMode];
    document.body.style.backgroundColor = appTheme.void;
    document.body.style.color = appTheme.text1;
  }, [themeMode]);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => {
    setTests(lang.tests);
    setHint3Revealed(false);
    setTermLines([]);
    const first = lang.files.find(f => f.type === "file");
    const firstName = first ? first.name : lang.name;
    setActiveFile(firstName);
    setTabs([{ name: firstName, modified: false }]);
    setActiveTab(0);
  }, [currentLang]);

  const switchLang = (key) => {
    setCurrentLang(key);
  };

  const openFile = (name) => {
    setActiveFile(name);
    const exists = tabs.findIndex(t => t.name === name);
    if (exists >= 0) {
      setActiveTab(exists);
      return;
    }
    const newTabs = [...tabs, { name, modified: false }];
    setTabs(newTabs);
    setActiveTab(newTabs.length - 1);
  };

  const scrollToLine = (lineIndex) => {
    if (codeRef.current) {
      codeRef.current.scrollTop = lineIndex * 22;
    }
  };

  const closeTab = (idx) => {
    if (tabs.length === 1) return;
    const newTabs = tabs.filter((_, i) => i !== idx);
    setTabs(newTabs);
    setActiveTab(Math.min(idx, newTabs.length - 1));
    setActiveFile(newTabs[Math.min(idx, newTabs.length - 1)].name);
  };

  const runCode = () => {
    setRunning(true);
    setPanelOpen(true);
    setPanelTab("terminal");
    setTermLines([]);
    lang.terminalLines.forEach((line, i) => {
      setTimeout(() => {
        setTermLines(prev => [...prev, line]);
        if (termRef.current) termRef.current.scrollTop = termRef.current.scrollHeight;
        if (i === lang.terminalLines.length - 1) {
          setRunning(false);
          setTests(prev => prev?.map(t => t.status === "fail" ? { ...t, status: "pass" } : t.status === "pending" ? { ...t, status: "pass" } : t));
        }
      }, i * 280 + 100);
    });
  };

  const codeLines = lang.code.split("\n");

  return (
    <>
      <FontLoader />
      <style>{`
        @keyframes cjBlink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes cjFadeIn { from{opacity:0;transform:translateY(3px)} to{opacity:1;transform:translateY(0)} }
        @keyframes cjSlideIn { from{opacity:0;transform:translateX(-8px)} to{opacity:1;transform:translateX(0)} }
        ::-webkit-scrollbar{width:5px;height:5px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:${T.active};border-radius:3px}
        ::-webkit-scrollbar-thumb:hover{background:${T.hover}}
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .cj-simple-hover:hover { background: rgba(100,110,120,0.08) !important; }
        .cj-btn:hover { filter: brightness(0.96); }
        .cj-tab:hover { background: rgba(100,110,120,0.06) !important; }
      `}</style>

      <div style={{
        display: "flex", flexDirection: "column",
        width: "100%", height: "100vh", minHeight: 700,
        background: T.void, fontFamily: "'Syne', sans-serif",
        color: T.text1, overflow: "hidden",
        userSelect: "none",
      }}>

        {/* ── TITLE BAR ── */}
        <div style={{
          display: "flex", alignItems: "center", height: 44,
          background: T.deep, borderBottom: `1px solid ${T.b1}`,
          padding: "0 16px", gap: 12, flexShrink: 0,
        }}>
          {/* Dots (UI decoration, hidden for minimal classic mode) */}
          {/* <div style={{ display: "flex", gap: 6, alignItems: "center", marginRight: 8 }}>
            {[T.red, T.gold, T.green].map((c, i) => (
              <div key={i} style={{ width: 11, height: 11, borderRadius: "50%", background: c, cursor: "pointer", opacity: 0.85 }} />
            ))}
          </div> */}

          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 9, marginRight: 8 }}>
            <img src="/favicon.svg" alt="Code Journey" style={{ width: 28, height: 28 }} />
            <span style={{ fontSize: 13, fontWeight: 700, color: T.text1, letterSpacing: "0.5px" }}>
              CJ <span style={{ color: T.teal }}>Editor</span>
            </span>
          </div>

          {/* Menu (non-functional, comment out for cleaner UI) */}
          {/* ["File","Edit","View","Run","Terminal","Help"].map(m => (
            <div key={m} style={{
              fontSize: 12, color: T.text2, padding: "4px 10px", borderRadius: 4,
              cursor: "pointer", fontWeight: 500, transition: "all 0.15s",
            }}
              onMouseEnter={e => { e.currentTarget.style.background = T.hover; e.currentTarget.style.color = T.text1; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = T.text2; }}
            >{m}</div>
          )) */}

          {/* Breadcrumb (not needed for minimal UX) */}
          {/* <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: T.text3, fontFamily: "'JetBrains Mono', monospace" }}>
              <span>workspace</span>
              <span style={{ opacity: 0.4 }}>›</span>
              <span>exercises</span>
              <span style={{ opacity: 0.4 }}>›</span>
              <span style={{ color: T.teal }}>{activeFile}</span>
            </div>
          </div> */}

          {/* Actions */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1 }}>
            <button className="cj-btn cj-simple-hover" onClick={() => setSidebarOpen(o => !o)}
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 11px", borderRadius: 5, fontSize: 11, fontWeight: 600, cursor: "pointer", background: "transparent", color: T.text2, border: `1px solid ${T.b2}`, fontFamily: "'Syne', sans-serif", transition: "all 0.2s" }}>
              <Icon name="sidebar" size={13} color="currentColor" /> Explorer
            </button>
            <button className="cj-btn cj-simple-hover" onClick={() => setThemeMode(m => m === "light" ? "dark" : "light")}
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 11px", borderRadius: 5, fontSize: 11, fontWeight: 700, cursor: "pointer", background: "transparent", color: T.text2, border: `1px solid ${T.b2}`, fontFamily: "'Syne', sans-serif", transition: "all 0.2s" }}>
              <Icon name={themeMode === "light" ? "moon" : "sun"} size={14} color={T.text2} />
            </button>
            <div style={{ flex: 1 }} />
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <button className="cj-btn cj-simple-hover" onClick={() => setRightPanelOpen(o => !o)}
                style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 11px", borderRadius: 5, fontSize: 11, fontWeight: 600, cursor: "pointer", background: "transparent", color: T.text2, border: `1px solid ${T.b2}`, fontFamily: "'Syne', sans-serif", transition: "all 0.2s" }}>
                <Icon name="panel" size={13} color="currentColor" /> Panel
              </button>
              <button onClick={runCode} disabled={running}
                style={{ display: "flex", alignItems: "center", gap: 7, padding: "5px 16px", borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: running ? "not-allowed" : "pointer", background: running ? "#5a52c0" : T.purple, color: "white", border: "none", fontFamily: "'Syne', sans-serif", transition: "all 0.2s", letterSpacing: "0.3px", boxShadow: running ? "none" : "0 0 20px rgba(124,110,224,0.25)" }}>
                {running
                  ? <><Icon name="refresh" size={13} color="white" style={{ animation: "cjBlink 0.8s linear infinite" }} /> Running...</>
                  : <><Icon name="play" size={13} color="white" /> Run Code</>}
              </button>
            </div>
          </div>
        </div>

        {/* ── MAIN AREA ── */}
        <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

          {/* ── ACTIVITY BAR ── */}
          {/* <div style={{
            width: 52, background: T.deep, borderRight: `1px solid ${T.b1}`,
            display: "flex", flexDirection: "column", alignItems: "center",
            padding: "8px 0", gap: 3, flexShrink: 0,
          }}>
            {[
              { icon: "explorer",   tip: "Explorer",   key: "explorer" },
              { icon: "search",     tip: "Search",     key: "search" },
              { icon: "git",        tip: "Source Control", key: "git", badge: true },
              { icon: "extensions", tip: "Extensions", key: "extensions" },
              { icon: "ai",         tip: "AI Tutor",   key: "ai" },
            ].map(item => (
              <ActIcon key={item.key} icon={item.icon} tooltip={item.tip} badge={item.badge}
                theme={T}
                active={activeActIcon === item.key}
                onClick={() => { setActiveActIcon(item.key); if (item.key === "explorer") setSidebarOpen(true); }} />
            ))}
            <div style={{ flex: 1 }} />
            <ActIcon icon="profile"  tooltip="Profile"  active={false} onClick={() => {}} />
            <ActIcon icon="settings" tooltip="Settings" active={false} onClick={() => {}} />
          </div> */}

          {/* ── SIDEBAR ── */}
          <div style={{
            width: sidebarOpen ? 232 : 0, background: T.panel,
            borderRight: sidebarOpen ? `1px solid ${T.b1}` : "none",
            display: "flex", flexDirection: "column", overflow: "hidden",
            transition: "width 0.22s cubic-bezier(0.4,0,0.2,1)", flexShrink: 0,
          }}>
            {/* Sidebar Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", borderBottom: `1px solid ${T.b1}`, flexShrink: 0, minWidth: 232 }}>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "1.5px", color: T.text3, textTransform: "uppercase" }}>Explorer</span>
              <div style={{ display: "flex", gap: 4 }}>
                {["plus","more"].map(ic => (
                  <div key={ic} className="cj-simple-hover" style={{ width: 18, height: 18, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", borderRadius: 3 }}>
                    <Icon name={ic} size={13} color={T.text3} />
                  </div>
                ))}
              </div>
            </div>

            {/* Language Switcher */}
            <div style={{ padding: "10px 10px 8px", flexShrink: 0, minWidth: 232 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <span style={{ fontSize: 9, letterSpacing: "1.5px", fontWeight: 700, textTransform: "uppercase", color: T.text3, paddingLeft: 4 }}>Language Track</span>
                <div onClick={() => setLangTrackOpen(o => !o)} style={{ cursor: "pointer", paddingRight: 4 }}>
                  <Icon name={langTrackOpen ? "chevDown" : "chevRight"} size={11} color={T.text3} />
                </div>
              </div>
              <div style={{
                maxHeight: langTrackOpen ? 250 : 0,
                opacity: langTrackOpen ? 1 : 0,
                overflow: "hidden",
                transition: "max-height 0.28s ease, opacity 0.22s ease",
              }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 4, paddingBottom: 8 }}>
                  {Object.entries(LANGUAGES).map(([key, data]) => (
                    <LangChip key={key} langKey={key} data={data} active={currentLang === key} onClick={switchLang} theme={T} />
                  ))}
                </div>
              </div>
            </div>

            {/* Divider */}
            <div style={{ height: 1, background: T.b1, margin: "0 14px", flexShrink: 0 }} />

            {/* File Tree */}
            <div style={{ flex: 1, overflowY: "auto", padding: "6px 0", minWidth: 232 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 14px 4px" }}>
                <span style={{ fontSize: 9, letterSpacing: "1.5px", fontWeight: 700, textTransform: "uppercase", color: T.text3 }}>Workspace</span>
                <span onClick={() => setFileTreeOpen(o => !o)} style={{ cursor: "pointer" }}>
                  <Icon name={fileTreeOpen ? "chevDown" : "chevRight"} size={11} color={T.text3} />
                </span>
              </div>

              <div style={{
                maxHeight: fileTreeOpen ? 999 : 0,
                opacity: fileTreeOpen ? 1 : 0,
                overflow: "hidden",
                transition: "max-height 0.28s ease, opacity 0.22s ease",
              }}>
                <div style={{ padding: "4px 14px 4px", display: "flex", alignItems: "center", gap: 7, cursor: "pointer" }}
                  onMouseEnter={e => e.currentTarget.style.background = T.hover}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <Icon name="folder" size={14} color={T.gold} />
                  <span style={{ fontSize: 12.5, fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, color: T.text2 }}>exercises</span>
                </div>
                {lang.files.map((node, i) => (
                  <FileNode key={`${currentLang}-${i}`} node={node} depth={1} dotColor={lang.dotColor} activeFile={activeFile} onSelect={openFile} theme={T} />
                ))}
              </div>

              {/* Optional: collapsed panel placeholder */}
              {/* {!fileTreeOpen && (
                <div style={{ padding: "10px 14px", color: T.text3, fontSize: 11, fontStyle: "italic" }}>
                  Workspace file list is collapsed. Click the arrow to expand.
                </div>
              )} */}
            </div>
          </div>

          {/* ── EDITOR AREA ── */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", background: T.mid }}>

            {/* Tab Bar */}
            <div style={{
              display: "flex", alignItems: "stretch", height: 38,
              background: T.deep, borderBottom: `1px solid ${T.b1}`,
              overflowX: "auto", flexShrink: 0,
            }}>
              {tabs.map((tab, i) => (
                <Tab key={`${tab.name}-${i}`} name={tab.name} dotColor={lang.dotColor}
                  active={activeTab === i} modified={tab.modified}
                  onClick={() => { setActiveTab(i); setActiveFile(tab.name); }}
                  onClose={() => closeTab(i)} theme={T} />
              ))}
              <div style={{ flex: 1 }} />
              <div style={{ display: "flex", alignItems: "center", paddingRight: 10, gap: 4 }}>
                <div className="cj-simple-hover" style={{ width: 26, height: 26, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", borderRadius: 4 }}
                  onClick={() => { navigator.clipboard.writeText(lang.code); setCopied(true); setTimeout(() => setCopied(false), 2000); }}>
                  <Icon name={copied ? "check" : "copy"} size={14} color={copied ? T.green : T.text3} />
                </div>
                <div className="cj-simple-hover" style={{ width: 26, height: 26, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", borderRadius: 4 }}>
                  <Icon name="more" size={14} color={T.text3} />
                </div>
              </div>
            </div>

            {/* Editor */}
            <div style={{ flex: 1, display: "flex", overflow: "hidden", position: "relative" }}>
              {/* Gutter */}
              <div style={{
                width: 56, padding: "16px 0", background: T.mid,
                display: "flex", flexDirection: "column", alignItems: "flex-end",
                paddingRight: 14, flexShrink: 0, borderRight: `1px solid ${T.b1}`,
              }}>
                {codeLines.map((_, i) => (
                  <div key={i} onClick={() => setActiveLine(i)}
                    style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: i === activeLine ? T.teal : T.text3, lineHeight: "22px", cursor: "pointer", fontWeight: i === activeLine ? 500 : 400, transition: "color 0.12s" }}>
                    {i + 1}
                  </div>
                ))}
              </div>

              {/* Code */}
              <div ref={codeRef} onClick={() => setShowAutocomplete(false)} style={{ flex: 1, padding: "16px 0 16px 20px", overflowY: "auto", overflowX: "auto", position: "relative", cursor: "text" }}>
                {codeLines.map((line, i) => (
                  <div key={`${currentLang}-${i}`} onClick={() => setActiveLine(i)}
                    style={{
                      display: "flex", minHeight: 22, lineHeight: "22px",
                      background: i === activeLine ? "rgba(124,110,224,0.06)" : "transparent",
                      borderRadius: 2, whiteSpace: "pre", paddingRight: 20,
                      animation: `cjFadeIn 0.1s ease ${i * 8}ms both`,
                      fontFamily: "'JetBrains Mono', monospace", fontSize: 13,
                    }}>
                    <CodeLine line={{ raw: line }} lang={currentLang} isActive={i === activeLine} theme={T} />
                    {i === activeLine && <Cursor />}
                  </div>
                ))}
                {/* Autocomplete hint */}
                {showAutocomplete && (
                  <div style={{
                    position: "absolute", top: 60, left: 180,
                    background: T.surface, border: `1px solid ${T.b2}`,
                    borderRadius: 6, width: 200, boxShadow: "0 8px 28px rgba(0,0,0,0.45)",
                    zIndex: 50, overflow: "hidden",
                  }}>
                    {[
                      { label: "console", kind: "obj" },
                      { label: "function", kind: "kw" },
                      { label: "fibonacci", kind: "fn" },
                      { label: "return", kind: "kw" },
                    ].map((item, i) => (
                      <div key={i} style={{
                        display: "flex", alignItems: "center", gap: 8, padding: "6px 10px",
                        fontSize: 12, fontFamily: "'JetBrains Mono', monospace",
                        color: i === 0 ? T.text1 : T.text2,
                        background: i === 0 ? T.active : "transparent",
                        cursor: "pointer", transition: "background 0.1s",
                      }}
                        onMouseEnter={e => e.currentTarget.style.background = T.active}
                        onMouseLeave={e => e.currentTarget.style.background = i === 0 ? T.active : "transparent"}>
                        <span style={{ flex: 1 }}>{item.label}</span>
                        <span style={{ fontSize: 10, padding: "1px 5px", borderRadius: 3, background: item.kind === "kw" ? "rgba(199,146,234,0.15)" : item.kind === "fn" ? "rgba(130,170,255,0.12)" : "rgba(94,234,212,0.1)", color: item.kind === "kw" ? T.cKw : item.kind === "fn" ? T.cFn : T.teal, fontWeight: 600 }}>{item.kind}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Minimap */}
              <Minimap code={lang.code} activeLine={activeLine} theme={T} onScrollToLine={scrollToLine} />
            </div>

            {/* ── PANEL ── */}
            <div style={{
              height: panelOpen ? (panelExpanded ? 400 : 185) : 32, background: T.deep,
              borderTop: `1px solid ${T.b1}`, display: "flex", flexDirection: "column",
              flexShrink: 0, transition: "height 0.2s cubic-bezier(0.4,0,0.2,1)",
            }}>
              {/* Panel Tabs */}
              <div style={{ display: "flex", alignItems: "center", height: 32, borderBottom: panelOpen ? `1px solid ${T.b1}` : "none", padding: "0 10px", gap: 2, flexShrink: 0 }}>
                {[
                  { key: "terminal", label: "Terminal" },
                  { key: "output",   label: "Output" },
                  { key: "problems", label: "Problems", badge: 2 },
                  { key: "console",  label: "Console" },
                ].map(t => (
                  <div key={t.key} onClick={() => { setPanelTab(t.key); setPanelOpen(true); }} className="cj-tab"
                    style={{
                      fontSize: 11.5, padding: "4px 11px", borderRadius: 5, cursor: "pointer",
                      fontWeight: 600, letterSpacing: "0.3px", transition: "all 0.15s", display: "flex", alignItems: "center", gap: 5,
                      color: panelTab === t.key ? T.teal : T.text3,
                      background: panelTab === t.key ? "rgba(94,234,212,0.07)" : "transparent",
                    }}>
                    {t.label}
                    {t.badge && <span style={{ fontSize: 10, background: "rgba(244,112,103,0.18)", color: T.red, borderRadius: 100, padding: "1px 5px" }}>{t.badge}</span>}
                  </div>
                ))}
                <div style={{ marginLeft: "auto", display: "flex", gap: 4 }}>
                  {[
                    { ic: "trash",    action: () => setTermLines([]) },
                    { ic: panelOpen ? "minimize" : "maximize", action: () => setPanelOpen(o => !o) },
                    { ic: panelExpanded ? "minimize" : "maximize", action: () => setPanelExpanded(o => !o) },
                    { ic: "panel",    action: () => { setPanelOpen(false); setPanelExpanded(false); } },
                  ].map((btn, i) => (
                    <div key={i} onClick={btn.action}
                      style={{ width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", borderRadius: 4, transition: "background 0.13s" }}
                      onMouseEnter={e => e.currentTarget.style.background = T.hover}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                      <Icon name={btn.ic} size={13} color={T.text3} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Terminal Content */}
              {panelOpen && (
                <div ref={termRef} style={{ flex: 1, padding: "10px 16px", fontFamily: "'JetBrains Mono', monospace", fontSize: 12.5, overflowY: "auto", lineHeight: 1.75 }}>
                  {panelTab === "terminal" && (
                    <>
                      {termLines.length === 0 && (
                        <div style={{ color: T.text3, fontSize: 12 }}>
                          Press <span style={{ color: T.teal }}>▶ Run Code</span> to execute your code here...
                        </div>
                      )}
                      {termLines.map((line, i) => <TermLine key={i} line={line} theme={T} />)}
                      {termLines.length > 0 && !running && (
                        <div style={{ display: "flex", gap: 8, marginTop: 2 }}>
                          <span style={{ color: T.teal }}>cj@workspace:~$</span>
                          <Cursor />
                        </div>
                      )}
                    </>
                  )}
                  {panelTab === "problems" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, color: T.red, fontSize: 12 }}>
                        <Icon name="close" size={13} color={T.red} />
                        <span style={{ color: T.text2 }}>Line 8:</span> Missing return statement in recursive branch
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, color: T.gold, fontSize: 12 }}>
                        <Icon name="warning" size={13} color={T.gold} />
                        <span style={{ color: T.text2 }}>Line 21:</span> Variable <span style={{ color: T.cFn }}>'memo'</span> is declared but never used
                      </div>
                    </div>
                  )}
                  {panelTab === "output" && (
                    <div style={{ color: T.text3, fontSize: 12 }}>
                      {termLines.length === 0 ? "No output yet. Run your code first." : termLines.filter(l => l.type === "out").map((l, i) => <div key={i} style={{ color: T.text2 }}>{l.text}</div>)}
                    </div>
                  )}
                  {panelTab === "console" && (
                    <div style={{ color: T.text3, fontSize: 12 }}>Console ready - JavaScript errors will appear here.</div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* ── RIGHT PANEL ── */}
          <div style={{
            width: rightPanelOpen ? 52 : 0, background: T.panel,
            borderLeft: rightPanelOpen ? `1px solid ${T.b1}` : "none",
            display: "flex", flexDirection: "column", overflow: "hidden",
            transition: "width 0.22s cubic-bezier(0.4,0,0.2,1)", flexShrink: 0,
          }}>
            <div style={{ minWidth: 52, display: "flex", flexDirection: "column", alignItems: "center", padding: "8px 0", gap: 3, height: "100%" }}>
              {[
                { icon: "explorer",   tip: "Explorer",   key: "explorer" },
                { icon: "search",     tip: "Search",     key: "search" },
                { icon: "git",        tip: "Source Control", key: "git", badge: true },
                { icon: "extensions", tip: "Extensions", key: "extensions" },
                { icon: "ai",         tip: "AI Tutor",   key: "ai" },
              ].map(item => (
                <ActIcon key={item.key} icon={item.icon} tooltip={item.tip} badge={item.badge}
                  theme={T}
                  active={activeActIcon === item.key}
                  onClick={() => { setActiveActIcon(item.key); if (item.key === "explorer") setSidebarOpen(true); }} />
              ))}
              <div style={{ flex: 1 }} />
              <ActIcon icon="profile"  tooltip="Profile"  active={false} onClick={() => {}} />
              <ActIcon icon="settings" tooltip="Settings" active={false} onClick={() => {}} />
            </div>
          </div>
        </div>

        {/* ── STATUS BAR ── */}
        <div style={{
          height: 24, background: T.purple,
          display: "flex", alignItems: "center", padding: "0 14px", gap: 14, flexShrink: 0,
        }}>
          {[
            { icon: null, dot: true, text: lang.name },
            { icon: null, text: "⎇  main" },
            { icon: null, text: `⚠ 2 Problems` },
          ].map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "rgba(255,255,255,0.82)", cursor: "pointer", padding: "0 4px", borderRadius: 3, fontWeight: 500 }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.12)"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
              {s.dot && <div style={{ width: 6, height: 6, borderRadius: "50%", background: T.teal }} />}
              {s.text}
            </div>
          ))}
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 14 }}>
            {[
              `Ln ${activeLine + 1}, Col 24`,
              "UTF-8",
              "Spaces: 2",
              running ? "⟳ Running…" : "✓ Ready",
            ].map((s, i) => (
              <div key={i} style={{ fontSize: 11, color: "rgba(255,255,255,0.82)", cursor: "pointer", padding: "0 4px", borderRadius: 3 }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.12)"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                {s}
              </div>
            ))}
          </div>
        </div>

      </div>
    </>
  );
}