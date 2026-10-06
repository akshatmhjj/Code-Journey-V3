---
title: Cross-platform Mobile Engineer
aliases: [Mobile Developer, Flutter Developer, React Native Developer, App Developer]
summary: Cross-platform mobile engineers build one app that runs on both iPhone and Android — usually with Flutter or React Native — and get it through the app stores and onto people's phones.
whereTheyWork: Startups and product companies that need both platforms with a small team, agencies building client apps, and fintech, delivery and consumer apps.
dayInLife:
  - Build a new screen from a Figma design and make it feel right on both iOS and Android.
  - Connect the screen to an API and handle slow networks and offline states.
  - Chase a crash that only happens on one Android model.
  - Prepare a release — version numbers, screenshots, store notes — and submit it for review.
  - Decide whether a feature needs a small piece of native code.
stages:
  - name: Foundations
    summary: Programming basics in the language your framework uses, plus Git.
    skills: [git, command-line, dart, how-the-internet-works]
    project: A small Dart command-line program (a quiz or budget tracker) using classes, lists and async code.
    doneWhen: You're comfortable with variables, functions, classes, null safety and async/await in Dart.
    weeks: 6–8
  - name: Core
    summary: Building real screens, navigation and data.
    skills: [flutter, state-management, rest-apis, accessibility]
    project: A weather or recipes app with several screens, navigation, a live API, loading and error states, and dark mode.
    doneWhen: You can build any screen from a design and keep state predictable as the app grows.
    weeks: 12–16
  - name: Job-ready
    summary: Testing, authentication and shipping to both stores.
    skills: [mobile-testing, authentication, app-store-publishing, ci-cd, ai-coding-tools]
    project: Publish an app to Google Play and the App Store (or TestFlight) with sign-in, tests and a CI build.
    doneWhen: A stranger can install your app from a store link — and it doesn't crash.
    weeks: 8–12
  - name: Senior
    summary: Performance, native integration and app architecture.
    skills: [system-design, kotlin, swift, observability]
    project: Write a small native module (Kotlin or Swift) your Flutter app calls, and add crash reporting and performance monitoring.
    doneWhen: You can explain your app's architecture and make it fast on a cheap Android phone.
skills:
  must: [dart, flutter, git, rest-apis, state-management, app-store-publishing]
  should: [mobile-testing, authentication, accessibility, ci-cd, ai-coding-tools]
  nice: [react-native, kotlin, swift, system-design, observability]
tools: [VS Code or Android Studio, Xcode (needs a Mac for iOS builds), Flutter DevTools, Firebase, an Android phone and an emulator, App Store Connect, Google Play Console, an AI coding assistant]
interview:
  rounds:
    - Recruiter screen
    - Language and framework fundamentals (widgets, state, lifecycle, async)
    - Take-home or live build of a small app screen with an API
    - Architecture discussion for mid-level and above (state, offline, navigation)
    - Behavioural round
  practice:
    - { title: Tech Interview Handbook, url: "https://www.techinterviewhandbook.org/", provider: Yangshun Tay, type: docs, cost: free }
    - { title: Frontend Mentor (mobile-first designs to build), url: "https://www.frontendmentor.io/", provider: Frontend Mentor, type: practice, cost: freemium }
    - { title: Flutter samples, url: "https://github.com/flutter/samples", provider: Google, type: docs, cost: free, official: true }
aiImpact: AI assistants are good at generating widgets and boilerplate, so building a basic screen is no longer a differentiator. Mobile engineers stand out by handling what's genuinely hard on phones — performance on cheap devices, offline behaviour, platform quirks, accessibility and getting through store review.
market:
  - text: Flutter and React Native are the two dominant cross-platform frameworks; both appear among the most-used frameworks in the Stack Overflow Developer Survey.
    source: { title: Stack Overflow Developer Survey, url: "https://survey.stackoverflow.co/" }
  - text: Many companies hire one cross-platform team instead of separate iOS and Android teams, especially at startup size.
adjacent: [frontend-engineer, android-engineer, ios-engineer, full-stack-engineer]
updated: 2026-10-06
---

## Is this role for you?

Mobile suits people who love the feel of an app in their hand — smooth scrolling, the right animation, a button exactly where your thumb lands. You'll deal with two platforms' quirks and app-store rules, which takes patience.

## Flutter or React Native?

This route uses **Flutter** — one language (Dart), consistent UI on both platforms, and excellent tooling. If you already know React, **React Native** gets you to mobile faster because you reuse what you know. Both are hired for; check job posts near you. Going fully native instead? See [Android](/roles/android-engineer) or [iOS](/roles/ios-engineer).
