---
title: CSS
domain: web
level: beginner
hours: 40–60
brief: Paint, furniture, lighting — make the blueprint beautiful.
prereqs:
  - html
learn:
  - topic: Selectors
    detail: "element, .class, #id, [attr], :hover, :focus, ::before — target any element"
  - topic: Box Model
    detail: Every element = content + padding + border + margin. Understanding this unlocks all layouts.
  - topic: Flexbox
    detail: display:flex — arrange children in a row or column. justify-content and align-items do most of the work.
  - topic: CSS Grid
    detail: "display:grid — define rows AND columns. grid-template-columns: repeat(3, 1fr) makes three equal columns instantly."
  - topic: Responsive Design
    detail: "@media (max-width: 640px) {} — change styles based on screen size. Mobile-first is the professional approach."
  - topic: Custom Properties
    detail: "--brand-color: #7c6ee0 — define values once, use everywhere. Changing a theme becomes one line."
  - topic: Transitions & Anim
    detail: "transition: all 0.2s ease — smooth property changes on hover. @keyframes for complex animations."
  - topic: clamp() & fluid type
    detail: "font-size: clamp(1rem, 2.5vw, 2rem) — text that scales perfectly between screen sizes without media queries."
resources:
  - cost: free
    title: "MDN: CSS styling basics"
    url: https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics
    provider: MDN
    type: docs
    official: true
  - title: CSS-Tricks
    url: https://css-tricks.com
    provider: CSS-Tricks
    type: article
    cost: free
  - title: Kevin Powell
    url: https://www.youtube.com/@KevinPowell
    provider: YouTube
    type: video
    cost: free
  - title: Flexbox Froggy
    url: https://flexboxfroggy.com
    provider: Codepip
    type: interactive
    cost: free
  - title: Grid Garden
    url: https://cssgridgarden.com
    provider: Codepip
    type: interactive
    cost: free
checked: 2026-10-06
---

## In plain English

If HTML is the blueprint, CSS is the interior design. It decides the wall colour, furniture arrangement, lighting, and decoration. Without CSS, every webpage is plain black text on a white background — like a Word document from 1994. CSS is what turns a structural skeleton into something people want to look at.

## How it works

CSS works by selecting elements and applying rules. The cascade means later rules override earlier ones (hence Cascading Style Sheets). The two biggest layout tools you'll live in are Flexbox (arrange things in a row or column) and Grid (arrange things in rows and columns simultaneously).

## A first look

```css
/* 1. Change text color */
h1 {
  color: red;
}

/* 2. Add background */
body {
  background: black;
  color: white;
}

/* 3. Center content using flex */
.container {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 4. Simple button */
button {
  background: blue;
  color: white;
  padding: 10px;
}

/* 5. Real Example */
.card {
  padding: 20px;
  border-radius: 10px;
  background: #161927;
  transition: 0.2s;
}
.card:hover {
  transform: translateY(-5px);
}
```
