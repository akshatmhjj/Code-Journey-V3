---
title: Flutter
domain: mobile
level: intermediate
hours: 70–100
brief: Everything is a widget - UI, layout, animation, input, all of it.
prereqs:
  - dart
learn:
  - topic: StatelessWidget
    detail: A widget with no state - given the same inputs, always renders the same output. Text, Icon, Image are examples.
  - topic: StatefulWidget
    detail: Has state that can change. When setState() is called, Flutter rebuilds only this widget and its children.
  - topic: Column / Row / Stack
    detail: Column arranges children vertically. Row horizontally. Stack layers children on top of each other.
  - topic: Expanded / Flexible
    detail: "Inside Row/Column, Expanded fills remaining space. flex: 2 means 'take twice as much space as flex: 1'."
  - topic: ListView / GridView
    detail: ListView.builder creates items lazily - only renders items on screen. Essential for long lists.
  - topic: Navigator 2.0
    detail: "go_router package is the standard. Define routes as paths: '/home', '/profile/:id'. Navigate with context.go('/profile/1')."
  - topic: Provider / Riverpod
    detail: State management. Provider wraps the widget tree. Riverpod is the improved version - compile-safe, testable.
  - topic: FutureBuilder
    detail: "Builds different UI based on a Future's state: loading, success, or error. No manual setState needed."
  - topic: AnimationController
    detail: Drive animations with a controller. Tween<double>(begin:0, end:1).animate(controller) - smooth value changes.
  - topic: Platform Channels
    detail: Call native iOS/Swift or Android/Kotlin code from Flutter when you need APIs Flutter doesn't expose.
resources:
  - title: Learn Flutter
    url: https://docs.flutter.dev/get-started/learn-flutter
    provider: Google
    type: docs
    cost: free
    official: true
  - title: Robert Brunhage
    url: https://www.youtube.com/@RobertBrunhage
    provider: YouTube
    type: video
    cost: free
  - title: Code With Andrea
    url: https://www.youtube.com/@CodeWithAndrea
    provider: YouTube
    type: video
    cost: free
  - title: Riverpod Docs
    url: https://riverpod.dev
    provider: Riverpod
    type: docs
    cost: free
checked: 2026-10-06
---

## In plain English

In HTML you have different concepts for structure (div), styling (CSS), and events (JS). In Flutter, there is only one concept: the Widget. A Text widget displays text. A Padding widget adds space. A GestureDetector widget detects taps. Even your whole screen is a widget. Nesting widgets inside each other - a widget tree - is the entire mental model. Once that clicks, Flutter feels incredibly logical.

## A first look

```dart
// 1. Basic widget
import 'package:flutter/material.dart';

void main() {
  runApp(MaterialApp(home: Text("Hello")));
}

// 2. Scaffold layout
Scaffold(
  appBar: AppBar(title: Text("App")),
  body: Center(child: Text("Welcome")),
);

// 3. Button
ElevatedButton(
  onPressed: () {
    print("Clicked");
  },
  child: Text("Click Me"),
);

// 4. State
int count = 0;

// 5. Real Example
class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Scaffold(
        body: Center(child: Text("Hello App")),
      ),
    );
  }
}
```dart
