---
title: C++
domain: specialist
level: advanced
hours: 80–150
brief: C++ gives programmers direct control over memory and performance. It powers game engines like Unreal, embedded systems, browsers, trading systems and much performance-critical software.
prereqs: []
learn:
  - topic: Basics
    detail: Types, functions, references and the compile–link process.
  - topic: Memory
    detail: Stack vs heap, pointers, and why manual memory management is hard.
  - topic: RAII and smart pointers
    detail: unique_ptr and shared_ptr — modern, safer ownership.
  - topic: Classes
    detail: Constructors, destructors, copy and move semantics.
  - topic: The standard library
    detail: vector, map, string, algorithms and iterators.
  - topic: Templates
    detail: Generic code, and reading template error messages.
  - topic: Build systems and debugging
    detail: CMake, compiler warnings, sanitizers and a debugger.
  - topic: Performance
    detail: Cache-friendly data, avoiding copies and profiling.
resources:
  - title: cppreference
    url: https://en.cppreference.com/w/
    provider: cppreference.com
    type: docs
    cost: free
    official: true
  - title: C++ Core Guidelines
    url: https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines
    provider: Standard C++ Foundation
    type: docs
    cost: free
    official: true
  - title: LearnCpp.com
    url: https://www.learncpp.com/
    provider: LearnCpp
    type: course
    cost: free
  - title: Exercism C++ track
    url: https://exercism.org/tracks/cpp
    provider: Exercism
    type: practice
    cost: free
checked: 2026-10-06
---

## In plain English

Most languages manage memory for you. C++ lets you manage it yourself, which makes it extremely fast — and makes mistakes more dangerous. Modern C++ (C++17 and later) gives you safer tools, and learning them is what separates good C++ from painful C++.
