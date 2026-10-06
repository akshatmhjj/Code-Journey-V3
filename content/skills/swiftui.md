---
title: SwiftUI
domain: mobile
level: intermediate
hours: 40–60
brief: SwiftUI is Apple's modern framework for building interfaces on iPhone, iPad, Mac and Watch — declarative views that update automatically when your data changes.
prereqs:
  - swift
learn:
  - topic: Views and modifiers
    detail: Small structs that describe UI, styled with chained modifiers.
  - topic: Layout
    detail: VStack, HStack, ZStack, Grid, List and ScrollView.
  - topic: State
    detail: "@State for local values, @Binding to share them, @Observable models for app data."
  - topic: Navigation
    detail: NavigationStack, sheets and passing data between screens.
  - topic: Data and async
    detail: Load data with async/await and .task; show loading and error states.
  - topic: Persistence
    detail: SwiftData for storing data on the device.
  - topic: Accessibility and Dynamic Type
    detail: VoiceOver labels and text that scales.
  - topic: Previews and UIKit interop
    detail: "#Preview for fast iteration; wrap UIKit when you need it."
resources:
  - title: SwiftUI tutorials
    url: https://developer.apple.com/tutorials/swiftui
    provider: Apple
    type: interactive
    cost: free
    official: true
  - title: Develop in Swift tutorials
    url: https://developer.apple.com/tutorials/develop-in-swift
    provider: Apple
    type: course
    cost: free
    official: true
  - title: SwiftUI documentation
    url: https://developer.apple.com/documentation/swiftui
    provider: Apple
    type: docs
    cost: free
    official: true
  - title: 100 Days of SwiftUI
    url: https://www.hackingwithswift.com/100/swiftui
    provider: Paul Hudson
    type: course
    cost: free
checked: 2026-10-06
---

## In plain English

You describe what each screen should look like for its current data, and SwiftUI handles updating the screen when the data changes. Less code than the older UIKit approach, and the same code adapts across Apple devices.

## A first look

```swift
struct CounterView: View {
    @State private var count = 0
    var body: some View {
        Button("Tapped \(count) times") { count += 1 }
            .buttonStyle(.borderedProminent)
    }
}
```
