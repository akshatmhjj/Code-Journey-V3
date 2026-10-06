---
title: How the Internet Works
domain: foundations
level: beginner
hours: 8–15
brief: What actually happens between typing a web address and seeing a page - DNS, IP addresses, HTTP requests and responses, and how browsers turn code into pixels.
prereqs: []
learn:
  - topic: Clients and servers
    detail: A browser (client) asks; a server answers. Everything on the web is this conversation.
  - topic: IP addresses and DNS
    detail: DNS turns codejourney.space into an IP address, like a phone book for the internet.
  - topic: HTTP requests and responses
    detail: Methods (GET, POST), status codes (200, 404, 500), headers and bodies.
  - topic: HTTPS and TLS
    detail: How encryption keeps data private in transit, and why the padlock matters.
  - topic: How browsers render
    detail: HTML becomes the DOM, CSS styles it, JavaScript changes it, and the browser paints pixels.
  - topic: Caching and CDNs
    detail: Why the second visit is faster, and how content is served from near the user.
  - topic: Using DevTools
    detail: Read the Network tab to see every request a page makes.
resources:
  - title: "MDN: An overview of HTTP"
    url: https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview
    provider: MDN
    type: docs
    cost: free
    official: true
  - title: "Cloudflare Learning Center: What is DNS?"
    url: https://www.cloudflare.com/learning/dns/what-is-dns/
    provider: Cloudflare
    type: article
    cost: free
  - title: How browsers work
    url: https://web.dev/articles/howbrowserswork
    provider: web.dev
    type: article
    cost: free
  - title: High Performance Browser Networking (free book)
    url: https://hpbn.co/
    provider: Ilya Grigorik
    type: book
    cost: free
checked: 2026-10-06
---

## In plain English

When you open a website, your browser looks up the site's address (DNS), connects to that server securely (TLS), asks for a page (an HTTP request), and gets back HTML, CSS and JavaScript (the response). It then builds the page and draws it. Every web, mobile and backend job builds on this cycle.

## Why it matters

"What happens when you type a URL into a browser?" is a classic interview question for a reason. Debugging slow pages, broken APIs and CORS errors all start here.
