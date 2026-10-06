---
title: Web Animation & Interaction
domain: web
level: intermediate
hours: 20–30
brief: Using motion to make interfaces feel responsive and understandable - CSS transitions, keyframes, the Web Animations API and motion libraries - without hurting performance or accessibility.
prereqs:
  - css
  - javascript
learn:
  - topic: Why animate
    detail: Show cause and effect, guide attention and smooth changes in state.
  - topic: Transitions
    detail: Animate between states on hover, focus and class changes.
  - topic: Keyframes
    detail: Multi-step animations with @keyframes.
  - topic: Easing and duration
    detail: Natural easing curves and durations that feel quick, not sluggish.
  - topic: Performance
    detail: Animate transform and opacity; avoid layout-triggering properties.
  - topic: JavaScript animation
    detail: The Web Animations API and libraries like Motion for gestures and layout animation.
  - topic: View transitions
    detail: Animate between pages and states with the View Transitions API.
  - topic: Reduced motion
    detail: Respect prefers-reduced-motion for people who need less movement.
resources:
  - title: "MDN: Using CSS animations"
    url: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_animations/Using_CSS_animations
    provider: MDN
    type: docs
    cost: free
    official: true
  - title: "MDN: Web Animations API"
    url: https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API
    provider: MDN
    type: docs
    cost: free
    official: true
  - title: "MDN: View Transition API"
    url: https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API
    provider: MDN
    type: docs
    cost: free
    official: true
  - title: Motion documentation
    url: https://motion.dev/docs
    provider: Motion
    type: docs
    cost: free
  - title: An Interactive Guide to CSS Transitions
    url: https://www.joshwcomeau.com/animation/css-transitions/
    provider: Josh W. Comeau
    type: article
    cost: free
checked: 2026-10-06
---

## In plain English

When a menu slides in from the button you tapped, you understand where it came from. Good animation explains what's happening; bad animation just makes you wait. The craft is choosing the right motion, keeping it fast and smooth, and switching it off for people who need less.
