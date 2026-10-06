---
title: JavaScript
domain: web
level: beginner
hours: 80–120
brief: The brain — makes pages think, respond, and come alive.
prereqs:
  - html
  - css
learn:
  - topic: Variables & Types
    detail: "const, let (not var). Types: string, number, boolean, null, undefined, object, array, symbol."
  - topic: Functions
    detail: "Regular: function greet(name){…} Arrow: const greet = (name) => 'Hello '+name. They're the same but arrow functions have no own 'this'."
  - topic: DOM Manipulation
    detail: document.querySelector('#btn') gets the element. .textContent, .style, .classList let you change it. This is the core skill.
  - topic: Events
    detail: addEventListener('click', fn) — user clicks, scrolls, types, hovers. Your code runs in response.
  - topic: Array Methods
    detail: .map(), .filter(), .reduce(), .find(), .some() — transform data without loops. The backbone of modern JS.
  - topic: Destructuring
    detail: const {name, age} = user — extract values in one line. const [first, ...rest] = arr — same for arrays.
  - topic: Fetch & Promises
    detail: fetch('/api/data') returns a Promise. async/await makes it read like synchronous code without blocking the browser.
  - topic: Error Handling
    detail: try { await fetch(url) } catch(err) { handle gracefully } — always handle what can go wrong.
  - topic: Modules (ES6)
    detail: import {greet} from './utils.js' — split code into files. export makes functions available to other files.
  - topic: Closures
    detail: A function that 'remembers' the variables from where it was created, even after that scope is gone. Counters and event handlers use this constantly.
resources:
  - cost: free
    title: "MDN: JavaScript Guide"
    url: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide
    provider: MDN
    type: docs
    official: true
  - title: The Modern JavaScript Tutorial
    url: https://javascript.info
    provider: javascript.info
    type: course
    cost: free
  - title: Eloquent JavaScript (4th ed.)
    url: https://eloquentjavascript.net
    provider: Marijn Haverbeke
    type: book
    cost: free
  - title: Traversy Media
    url: https://www.youtube.com/@TraversyMedia
    provider: YouTube
    type: video
    cost: free
  - title: JavaScript in 100 Seconds
    url: https://www.youtube.com/watch?v=DHjqpvDnNGE
    provider: Fireship
    type: video
    cost: free
checked: 2026-10-06
---

## In plain English

HTML and CSS are like a beautiful printed poster — it looks great but you can't interact with it. JavaScript is what makes the poster come alive: pressing a button changes the text, a form checks your input before submitting, a timer counts down, data loads from the internet without reloading the page. It's the only language that runs natively inside every browser — no installation needed.

## How it works

Every comment in this code teaches a concept alongside the code. The template literal (backtick string with ${…}) builds HTML from data. The try/catch block ensures a server error shows a friendly message, not a crashed page.

## A first look

```javascript
// 1. Variable
let name = "Alex";

// 2. Function
function greet() {
  console.log("Hello");
}

// 3. Event
document.querySelector("button").addEventListener("click", () => {
  console.log("Clicked");
});

// 4. Change HTML
document.querySelector("h1").textContent = "Changed!";

// 5. Real Example (Fetch)
async function getData() {
  const res = await fetch("https://api.github.com/users");
  const data = await res.json();
  console.log(data);
}
getData();
```
