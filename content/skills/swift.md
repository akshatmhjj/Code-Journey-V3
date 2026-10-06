---
title: Swift
domain: mobile
level: intermediate
hours: 60–100
brief: Apple's language — the only way to deeply build for iPhone.
prereqs: []
learn:
  - topic: let / var
    detail: let = constant (can't change). var = variable. Swift's type inference means you rarely need to write the type explicitly.
  - topic: Optionals
    detail: "var name: String? = nil — the ? marks a value as possibly absent. Unwrap with if let name { } or name ?? default."
  - topic: Structs vs Classes
    detail: Structs are value types (copied on assignment) — prefer them. Classes are reference types (shared). Use classes for identity.
  - topic: Protocols
    detail: "Like interfaces. protocol Identifiable { var id: UUID { get } }. A type that 'conforms to' a protocol must implement it."
  - topic: Generics
    detail: "func first<T>(_ array: [T]) -> T? { return array.first } — write once, works for any type"
  - topic: Closures
    detail: "{ (x: Int) -> Int in return x * 2 } — blocks of code you pass around. Shorthand: { $0 * 2 }"
  - topic: SwiftUI
    detail: Declarative UI like Flutter. @State drives re-renders. VStack, HStack, ZStack for layout. Previews in Xcode.
  - topic: async/await
    detail: Swift's concurrency model. func loadData() async throws { let user = try await api.fetchUser() }
  - topic: "@Published / ObservableObject"
    detail: "@Observable marks a class; @State/@Binding drives SwiftUI re-renders. The equivalent of Flutter's setState + ChangeNotifier."
  - topic: Core Data / SwiftData
    detail: "Apple's local persistence. SwiftData (iOS 17+) is the modern approach: @Model class Post {}. Automatically persistent."
resources:
  - title: Swift Documentation
    url: https://www.swift.org/documentation/
    provider: Apple
    type: docs
    cost: free
    official: true
  - title: SwiftUI Tutorials
    url: https://developer.apple.com/tutorials/swiftui
    provider: Apple
    type: interactive
    cost: free
    official: true
  - title: Hacking with Swift
    url: https://www.hackingwithswift.com
    provider: Paul Hudson
    type: course
    cost: freemium
  - title: Sean Allen
    url: https://www.youtube.com/@SeanAllen
    provider: YouTube
    type: video
    cost: free
checked: 2026-10-06
---

## In plain English

Swift is to iOS what Kotlin is to Android. If you want to build something that feels deeply, distinctly native on an iPhone — a camera app with custom filters, an Apple Watch face, a widget on the iOS home screen — Swift is the only way. Apple designed Swift to be safer, faster, and more readable than Objective-C. It compiles directly to machine code, making it genuinely fast.

## A first look

```swift
// 1. Variable
let name = "Alex"

// 2. Function
func greet() {
  print("Hello")
}

// 3. Optional
var user: String? = nil
print(user ?? "Guest")

// 4. Struct
struct User {
  let name: String
}

// 5. Real Example
import SwiftUI

struct ContentView: View {
  var body: some View {
    Text("Hello Swift")
  }
}
```swift
