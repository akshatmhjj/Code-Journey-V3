---
title: Web Accessibility
domain: web
level: intermediate
hours: 20–30
brief: Building interfaces everyone can use - including people using screen readers, keyboards, zoom or voice control. It's a legal requirement in many places and simply good engineering.
prereqs:
  - html
  - css
learn:
  - topic: Semantic HTML
    detail: Use button, nav, main, label and headings properly - most accessibility comes free.
  - topic: Keyboard access
    detail: Everything works with Tab, Enter, Space and Escape, with a visible focus ring.
  - topic: Screen readers
    detail: Accessible names, alt text, and announcing changes with live regions.
  - topic: Colour and contrast
    detail: WCAG contrast ratios - 4.5:1 for body text - and never colour alone.
  - topic: ARIA, sparingly
    detail: Use ARIA only when HTML can't express it; wrong ARIA is worse than none.
  - topic: Forms
    detail: Labels, error messages and instructions that are announced.
  - topic: Motion and zoom
    detail: Respect prefers-reduced-motion and support 200% zoom.
  - topic: Testing
    detail: Lighthouse and axe, then real keyboard and screen-reader checks.
resources:
  - title: "W3C: Introduction to Web Accessibility"
    url: https://www.w3.org/WAI/fundamentals/accessibility-intro/
    provider: W3C WAI
    type: docs
    cost: free
    official: true
  - title: WCAG 2.2 Quick Reference
    url: https://www.w3.org/WAI/WCAG22/quickref/
    provider: W3C WAI
    type: docs
    cost: free
    official: true
  - title: "MDN: Accessibility"
    url: https://developer.mozilla.org/en-US/docs/Web/Accessibility
    provider: MDN
    type: docs
    cost: free
    official: true
  - title: Learn Accessibility
    url: https://web.dev/learn/accessibility
    provider: web.dev
    type: course
    cost: free
  - title: The A11Y Project checklist
    url: https://www.a11yproject.com/checklist/
    provider: The A11Y Project
    type: docs
    cost: free
checked: 2026-10-06
---

## In plain English

Some people navigate with a keyboard, some hear pages through a screen reader, some zoom to 300%. Accessibility means your app works for all of them. Most of it comes from using HTML correctly and testing with a keyboard.

## Why it matters

Laws in the EU, US and elsewhere increasingly require it, AI-generated UI often gets it wrong, and it's a clear sign of a careful frontend engineer.
