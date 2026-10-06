---
title: Tailwind CSS
domain: web
level: beginner
hours: 10–20
brief: "Tailwind CSS is a utility-first framework: you style elements with small classes like 'flex gap-4 text-lg' instead of writing separate CSS files. Fast, consistent and very popular."
prereqs:
  - css
learn:
  - topic: Utility classes
    detail: Spacing, colour, typography and layout as small composable classes.
  - topic: Responsive prefixes
    detail: "md:, lg: — mobile-first breakpoints right in the markup."
  - topic: States
    detail: "hover:, focus-visible:, disabled:, dark: — without writing selectors."
  - topic: Theme and design tokens
    detail: Define colours, fonts and spacing once; use them everywhere.
  - topic: Layout
    detail: Flexbox and Grid utilities for real page layouts.
  - topic: Avoiding class soup
    detail: Extract components, not @apply everywhere.
  - topic: Still know CSS
    detail: Tailwind is CSS — specificity, the cascade and layout still matter.
resources:
  - title: Tailwind CSS documentation
    url: https://tailwindcss.com/docs
    provider: Tailwind Labs
    type: docs
    cost: free
    official: true
  - title: Tailwind Play
    url: https://play.tailwindcss.com/
    provider: Tailwind Labs
    type: tool
    cost: free
    official: true
  - title: Tailwind CSS on YouTube
    url: https://www.youtube.com/@TailwindLabs
    provider: Tailwind Labs
    type: video
    cost: free
checked: 2026-10-06
---

## In plain English

Instead of naming a class "card" and writing its styles in another file, you write the styles directly: `class="rounded-lg border p-4 shadow"`. It feels odd for a day, then very fast — and every page ends up using the same spacing and colours.

## Learn CSS first

Tailwind is a shortcut, not a replacement. When a layout breaks, you'll fix it with your understanding of CSS.
