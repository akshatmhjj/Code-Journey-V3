---
title: React
domain: web
level: intermediate
hours: 60–90
brief: Build UIs like LEGO - components you assemble, not HTML you repeat.
prereqs:
  - javascript
learn:
  - topic: Components
    detail: Function components are the only way. They take props, return JSX. Think of them as custom HTML tags.
  - topic: Props
    detail: <UserCard name='Alex' role='admin' /> - pass data into a component like HTML attributes
  - topic: useState
    detail: const [count, setCount] = useState(0) - when state changes, React re-renders only the affected component
  - topic: useEffect
    detail: "Runs after render. Use for: fetching data, subscriptions, DOM manipulation. Cleanup with return fn."
  - topic: useRef
    detail: Holds a value across renders without causing re-renders. Also the way to access actual DOM elements.
  - topic: useCallback/useMemo
    detail: Prevent expensive recalculations and function re-creation on every render. Use when profiling shows slowness.
  - topic: Context API
    detail: Share state globally without prop-drilling. createContext → Provider wraps the tree → useContext reads it.
  - topic: React Router
    detail: <BrowserRouter> → <Routes> → <Route path='/about' element={<About/>}/> - client-side navigation
  - topic: React Query / SWR
    detail: Server state management. Handles caching, background refetching, loading/error states for you.
  - topic: Forms
    detail: "Controlled: value={state} onChange={setState}. Uncontrolled: useRef. React Hook Form for complex forms."
resources:
  - title: react.dev - Learn React
    url: https://react.dev/learn
    provider: Meta
    type: docs
    cost: free
    official: true
  - title: Codevolution
    url: https://www.youtube.com/@Codevolution
    provider: YouTube
    type: video
    cost: free
  - title: Learn React
    url: https://scrimba.com/learn/learnreact
    provider: Scrimba
    type: interactive
    cost: freemium
  - title: React in 100 Seconds
    url: https://www.youtube.com/watch?v=Tn6-PIqc4UM
    provider: Fireship
    type: video
    cost: free
checked: 2026-10-06
---

## In plain English

Imagine building a table of 50 user profiles. Without React, you'd paste the same HTML block 50 times. With React, you write it once as a UserCard component and write <UserCard user={alex} /> wherever you need it. When you update the design, you change one file and every card updates. React is why Facebook, Airbnb, Netflix, and Instagram's frontends don't fall apart when they have 10,000 UI elements on screen.

## A first look

```jsx
// 1. Simple component
function App() {
  return <h1>Hello</h1>;
}

// 2. Using props
function Card(props) {
  return <h2>{props.name}</h2>;
}

// 3. State
import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}

// 4. Real Example
function UserCard({ name }) {
  return <div>{name}</div>;
}
```
