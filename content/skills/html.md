---
title: HTML
domain: web
level: beginner
hours: 15–25
brief: The skeleton of every webpage — structure without style.
prereqs: []
learn:
  - topic: Tags & Elements
    detail: <h1>–<h6>, <p>, <div>, <span>, <a>, <img> — the vocabulary of HTML
  - topic: Attributes
    detail: href, src, alt, class, id — extra information attached to tags
  - topic: Semantic HTML
    detail: <header>, <nav>, <main>, <article>, <section>, <footer> — tags with meaning
  - topic: Forms & Inputs
    detail: <form>, <input>, <button>, <select>, <textarea> — how users send data
  - topic: Media
    detail: <img>, <video>, <audio>, <iframe> — embedding content
  - topic: The DOM
    detail: The browser turns your HTML into a tree of objects — JS reads and changes this tree
resources:
  - title: "MDN: Learn HTML"
    url: https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content
    provider: MDN
    type: docs
    cost: free
    official: true
  - title: freeCodeCamp Responsive Web Design
    url: https://www.freecodecamp.org/learn/2022/responsive-web-design/
    provider: freeCodeCamp
    type: interactive
    cost: free
  - title: HTML Full Course for Beginners
    url: https://www.youtube.com/watch?v=kUMe1FH4CHE
    provider: Dave Gray
    type: video
    cost: free
checked: 2026-10-06
---

## In plain English

HTML is the blueprint of a building. It says 'there's a wall here, a door there, a window here' — but says nothing about colour or decoration. Every webpage ever made starts with HTML. It's not a programming language — it's a structure language. You describe what things are, not what they look like or do.

## How it works

HTML uses tags wrapped in angle brackets. A tag like <h1> tells the browser "this is a main heading." Tags have an opening and closing form. You nest them inside each other to build hierarchy — this nested structure becomes the DOM (Document Object Model) that JavaScript can later manipulate.

## A first look

```html
<!-- 1. Heading -->
<h1>Hello World</h1>

<!-- 2. Paragraph -->
<p>This is my first website</p>

<!-- 3. Link -->
<a href="https://google.com">Go to Google</a>

<!-- 4. Combine them -->
<h1>My Site</h1>
<p>Welcome here</p>
<a href="#">Explore</a>

<!-- 5. Real Example (Full Page) -->
<!DOCTYPE html>
<html>
  <body>
    <h1>My Portfolio</h1>
    <p>I build things for the web</p>
    <a href="#">See my work</a>
  </body>
</html>
```
