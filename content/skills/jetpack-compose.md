---
title: Jetpack Compose
domain: mobile
level: intermediate
hours: 40–60
brief: Jetpack Compose is Android's modern way to build interfaces in Kotlin - you describe what the screen should look like for a given state, and Compose keeps it up to date.
prereqs:
  - kotlin
learn:
  - topic: Composable functions
    detail: "@Composable functions that describe UI from data."
  - topic: Layouts
    detail: Column, Row, Box, LazyColumn and modifiers for spacing and size.
  - topic: State and recomposition
    detail: remember, mutableStateOf and why the UI redraws when state changes.
  - topic: State hoisting
    detail: Keep state in the caller so composables stay reusable and testable.
  - topic: ViewModel and lifecycle
    detail: Hold screen state that survives rotation; collect StateFlow safely.
  - topic: Navigation
    detail: Navigation Compose for moving between screens with arguments.
  - topic: Material 3 and theming
    detail: Colours, typography, dark mode and dynamic colour.
  - topic: Side effects
    detail: LaunchedEffect and friends for loading data and one-off events.
  - topic: Testing and previews
    detail: "@Preview for fast iteration and Compose UI tests."
resources:
  - title: Jetpack Compose
    url: https://developer.android.com/compose
    provider: Google
    type: docs
    cost: free
    official: true
  - title: Android Basics with Compose
    url: https://developer.android.com/courses/android-basics-compose/course
    provider: Google
    type: course
    cost: free
    official: true
  - title: Thinking in Compose
    url: https://developer.android.com/develop/ui/compose/mental-model
    provider: Google
    type: docs
    cost: free
    official: true
  - title: Now in Android (reference app)
    url: https://github.com/android/nowinandroid
    provider: Google
    type: docs
    cost: free
    official: true
  - title: Philipp Lackner
    url: https://www.youtube.com/@PhilippLackner
    provider: YouTube
    type: video
    cost: free
checked: 2026-10-06
---

## In plain English

The old Android way was to build screens in XML, then write code to find and update each view. In Compose you write a Kotlin function that says "given this data, show this" - and when the data changes, Compose redraws the parts that need it.

## A first look

```kotlin
@Composable
fun Counter() {
    var count by remember { mutableStateOf(0) }
    Button(onClick = { count++ }) {
        Text("Tapped $count times")
    }
}
```
