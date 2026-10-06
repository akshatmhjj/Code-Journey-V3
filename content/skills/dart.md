---
title: Dart
domain: mobile
level: beginner
hours: 20–35
brief: Flutter's language — clean, null-safe, and fast to learn.
prereqs: []
learn:
  - topic: var / final / const
    detail: var for mutable variables. final = set once at runtime. const = compile-time constant. Prefer final.
  - topic: Null Safety
    detail: String? name — the ? means this can be null. String name — this CANNOT be null. The compiler enforces this, preventing crashes.
  - topic: Named Parameters
    detail: "void greet({required String name, int age = 0}) — named params make function calls readable: greet(name: 'Alex')"
  - topic: Arrow Functions
    detail: int double(int n) => n * 2 — single-expression functions use => instead of {} return. Same as JS.
  - topic: Classes & Constructors
    detail: Dart uses const constructors for immutable objects. class User { final String name; const User(this.name); }
  - topic: List / Map / Set
    detail: List<String>, Map<String,int>, Set<int> — typed collections. Every item must match the type.
  - topic: async / await
    detail: identical to JavaScript's async/await. Future = Promise. Stream = Observable (ongoing data).
  - topic: Extension Methods
    detail: extension on String { bool get isEmail => contains('@'); } — add methods to any existing class
  - topic: Mixins
    detail: mixin Serializable on Model { Map toJson() {...} } — share behaviour across classes without inheritance
  - topic: Enum with methods
    detail: Dart enums can have fields and methods — enum Status { active, inactive; bool get isActive => this==active; }
resources:
  - title: Dart Language Tour
    url: https://dart.dev/language
    provider: Google
    type: docs
    cost: free
    official: true
  - title: Sound Null Safety
    url: https://dart.dev/null-safety
    provider: Google
    type: docs
    cost: free
    official: true
  - title: Flutter (official channel)
    url: https://www.youtube.com/@flutterdev
    provider: Google
    type: video
    cost: free
    official: true
checked: 2026-10-06
---

## In plain English

Dart is to Flutter what JavaScript is to React — you can't use one without knowing the other, and the language was literally designed to make the framework work well. The good news: Dart reads almost like TypeScript or Java, but cleaner. If you've seen any curly-brace language before, Dart will take you maybe two weeks to feel comfortable in.

## A first look

```dart
// 1. Variable
var name = "Alex";

// 2. Function
int add(int a, int b) {
  return a + b;
}

// 3. Null safety
String? user;
print(user ?? "Guest");

// 4. Simple class
class User {
  String name;
  User(this.name);
}

// 5. Real Example
Future<void> fetchData() async {
  print("Loading...");
  await Future.delayed(Duration(seconds: 1));
  print("Done");
}
fetchData();
```dart
