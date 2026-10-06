---
title: Kotlin
domain: mobile
level: intermediate
hours: 60–100
brief: Android's official language — concise, safe, Jetpack Compose.
prereqs: []
learn:
  - topic: val / var
    detail: val = immutable (like final). var = mutable. Prefer val everywhere. The compiler warns you when you don't need var.
  - topic: Null Safety
    detail: "String? = nullable. String = cannot be null. ?. for safe access. ?: for default. !! forces non-null (use rarely)."
  - topic: Data Classes
    detail: "data class User(val name: String, val email: String) — auto-generates equals(), hashCode(), toString(), copy()"
  - topic: Extension Functions
    detail: fun String.isEmail() = contains('@') — add methods to any class, even standard library ones
  - topic: Coroutines
    detail: suspend fun load() { val data = withContext(Dispatchers.IO) { api.fetch() } } — async without callbacks
  - topic: Flow (reactive)
    detail: Flow<T> is Kotlin's Stream — emit multiple values over time. Collected in a coroutine. Used for real-time UI.
  - topic: Jetpack Compose
    detail: "@Composable fun ProfileCard() — declarative UI like Flutter. States drive re-composition automatically."
  - topic: ViewModel
    detail: Survives screen rotations. Holds UI state. Exposes StateFlow that Compose collects and re-renders on change.
  - topic: Room Database
    detail: "@Entity, @Dao, @Database — SQLite with type safety and coroutine support. The standard local persistence library."
  - topic: Hilt (DI)
    detail: Dependency injection via annotations. @Inject, @HiltViewModel — Hilt provides instances; you declare what you need.
resources:
  - cost: free
    title: Kotlin Docs
    url: https://kotlinlang.org/docs/home.html
    provider: JetBrains
    type: docs
    official: true
  - title: Kotlin on Android
    url: https://developer.android.com/kotlin
    provider: Google
    type: docs
    cost: free
    official: true
  - title: Jetpack Compose
    url: https://developer.android.com/compose
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

Kotlin is what you use when you need deep Android-specific access — Bluetooth, NFC payments, custom camera pipelines, widgets on the Android home screen. Think of it as choosing between a rental car (Flutter — works great, covers 95% of needs) and buying the exact car you want (Kotlin — full control, you own every gear). Google officially recommends Kotlin for all new Android development since 2017.

## A first look

```kotlin
// 1. Variable
val name = "Alex"

// 2. Function
fun add(a: Int, b: Int): Int {
  return a + b
}

// 3. Null safety
var user: String? = null
println(user ?: "Guest")

// 4. Data class
data class User(val name: String)

// 5. Real Example (Compose)
@Composable
fun App() {
  Text("Hello Kotlin")
}
```kotlin
