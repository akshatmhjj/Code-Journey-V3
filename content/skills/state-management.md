---
title: State Management
domain: web
level: intermediate
hours: 15–25
brief: Deciding where data lives in an app and how it changes - local component state, shared state, and server data that needs caching and syncing.
prereqs:
  - react
learn:
  - topic: Local state first
    detail: useState for things only one component cares about.
  - topic: Lifting state up
    detail: Move state to the nearest common parent when two components share it.
  - topic: Derived state
    detail: Compute values from state instead of storing copies that drift.
  - topic: Context
    detail: Share rarely-changing values (theme, current user) without prop drilling.
  - topic: Server state
    detail: Data from APIs needs caching, refetching and loading states - TanStack Query handles this.
  - topic: Global stores
    detail: Zustand or Redux Toolkit when many distant parts of the app share changing state.
  - topic: URL as state
    detail: Filters, tabs and search queries often belong in the URL.
resources:
  - title: "React: Managing state"
    url: https://react.dev/learn/managing-state
    provider: Meta
    type: docs
    cost: free
    official: true
  - title: TanStack Query overview
    url: https://tanstack.com/query/latest/docs/framework/react/overview
    provider: TanStack
    type: docs
    cost: free
    official: true
  - title: Redux Essentials tutorial
    url: https://redux.js.org/tutorials/essentials/part-1-overview-concepts
    provider: Redux
    type: docs
    cost: free
    official: true
  - title: Zustand
    url: https://zustand.docs.pmnd.rs/
    provider: Poimandres
    type: docs
    cost: free
checked: 2026-10-06
---

## In plain English

State is anything that can change: what's typed in a box, whether a menu is open, the list of products from the server. Most bugs in apps come from the same data living in two places. Good state management means one source of truth, as close as possible to where it's used.
