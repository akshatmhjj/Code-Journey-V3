---
title: Mobile App Testing
domain: mobile
level: intermediate
hours: 15–25
brief: Testing mobile apps at every level - unit, widget/component and end-to-end on real devices - so releases don't crash on the phones your users actually have.
prereqs:
  - flutter
learn:
  - topic: Unit tests
    detail: Business logic tested without any UI.
  - topic: Widget and component tests
    detail: Render a screen in isolation and interact with it.
  - topic: Integration and end-to-end tests
    detail: Drive the real app on an emulator or device.
  - topic: Device coverage
    detail: Screen sizes, OS versions and low-end Android phones.
  - topic: Mocking the network
    detail: Test offline, slow and error responses.
  - topic: Running in CI
    detail: Automated builds and tests for both platforms.
  - topic: Crash reporting
    detail: Firebase Crashlytics or Sentry to catch what tests miss.
resources:
  - title: Flutter testing overview
    url: https://docs.flutter.dev/testing/overview
    provider: Google
    type: docs
    cost: free
    official: true
  - title: "React Native: Testing"
    url: https://reactnative.dev/docs/testing-overview
    provider: Meta
    type: docs
    cost: free
    official: true
  - title: "Android: Test apps"
    url: https://developer.android.com/training/testing
    provider: Google
    type: docs
    cost: free
    official: true
  - title: Maestro
    url: https://docs.maestro.dev/
    provider: mobile.dev
    type: tool
    cost: free
checked: 2026-10-06
---

## In plain English

A bug on the web can be fixed in minutes. A bug in a mobile app sits on people's phones until they update - and app-store reviews take time. Testing mobile apps well means catching problems before they're installed on thousands of devices.
