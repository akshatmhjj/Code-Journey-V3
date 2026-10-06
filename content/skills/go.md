---
title: Go
domain: cloud-devops
level: intermediate
hours: 40–60
brief: Go is a simple, fast, compiled language built at Google. It's the language of much cloud infrastructure — Docker, Kubernetes and Terraform are all written in Go.
prereqs:
  - git
learn:
  - topic: Syntax and types
    detail: Variables, functions, structs, slices and maps.
  - topic: Errors as values
    detail: if err != nil — explicit error handling instead of exceptions.
  - topic: Interfaces
    detail: Small, implicit interfaces that make code easy to test.
  - topic: Packages and modules
    detail: go mod, imports and project layout.
  - topic: Concurrency
    detail: Goroutines, channels, select and sync primitives.
  - topic: Standard library
    detail: net/http, encoding/json, context and testing — often enough on their own.
  - topic: Testing
    detail: go test, table-driven tests and benchmarks.
  - topic: Building CLIs and services
    detail: Single static binaries that are easy to ship.
resources:
  - title: A Tour of Go
    url: https://go.dev/tour/
    provider: Go team
    type: interactive
    cost: free
    official: true
  - title: Effective Go
    url: https://go.dev/doc/effective_go
    provider: Go team
    type: docs
    cost: free
    official: true
  - title: Go by Example
    url: https://gobyexample.com/
    provider: Mark McGranaghan
    type: docs
    cost: free
  - title: Learn Go with Tests
    url: https://quii.gitbook.io/learn-go-with-tests
    provider: Chris James
    type: book
    cost: free
checked: 2026-10-06
---

## In plain English

Go was designed to be boring in a good way: a small language that compiles fast, runs fast and is easy to read in a large team. Its built-in concurrency makes it a natural fit for servers and infrastructure tools.

## A first look

```go
package main

import ("fmt"; "net/http")

func main() {
    http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
        fmt.Fprintln(w, "Hello from Go")
    })
    http.ListenAndServe(":8080", nil)
}
```
