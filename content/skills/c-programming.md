---
title: C Programming
domain: specialist
level: intermediate
hours: 50–80
brief: C is the language closest to the hardware that's still widely used — the foundation of operating systems, firmware and embedded devices.
prereqs: []
learn:
  - topic: Syntax and compilation
    detail: Types, functions, headers and how source becomes a binary.
  - topic: Pointers
    detail: Addresses, dereferencing and pointer arithmetic.
  - topic: Arrays and strings
    detail: Contiguous memory and null-terminated strings.
  - topic: Memory management
    detail: malloc, free, and avoiding leaks and overflows.
  - topic: Structs and unions
    detail: Grouping data and mapping hardware registers.
  - topic: Bitwise operations
    detail: Masks and shifts for setting and reading hardware bits.
  - topic: volatile and const
    detail: Telling the compiler about hardware and read-only data.
  - topic: Tooling
    detail: gcc/clang, Makefiles, a debugger and compiler warnings.
resources:
  - title: "cppreference: C language"
    url: https://en.cppreference.com/w/c
    provider: cppreference.com
    type: docs
    cost: free
    official: true
  - title: Beej's Guide to C Programming
    url: https://beej.us/guide/bgc/
    provider: Brian Hall
    type: book
    cost: free
  - title: CS50x
    url: https://cs50.harvard.edu/x/
    provider: Harvard
    type: course
    cost: free
  - title: Exercism C track
    url: https://exercism.org/tracks/c
    provider: Exercism
    type: practice
    cost: free
checked: 2026-10-06
---

## In plain English

C gives you almost no safety net — no garbage collector, no bounds checks — and in return you control exactly what the machine does. That's why it's still the language of firmware, operating systems and anything where every byte and microsecond counts.
