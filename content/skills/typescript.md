---
title: TypeScript
domain: web
level: intermediate
hours: 25–40
brief: JavaScript with a safety net — catches bugs before they run.
prereqs:
  - javascript
learn:
  - topic: Basic Types
    detail: string, number, boolean, null, undefined, void — annotate any variable or parameter
  - topic: Arrays & Tuples
    detail: string[] or Array<string> — typed arrays. [string, number] — tuple with fixed positions
  - topic: Interfaces
    detail: "interface User { id: number; name: string } — define the shape of any object"
  - topic: Union Types
    detail: type Role = 'admin' | 'viewer' — the value can only be one of these exact strings
  - topic: Generics
    detail: "function getFirst<T>(arr: T[]): T — write code that works for any type but stays safe"
  - topic: Type Inference
    detail: const name = 'Alex' — TypeScript already knows this is a string. You don't need to write the type.
  - topic: Optional & Readonly
    detail: "name?: string — optional property. readonly id: number — can't be changed after creation"
  - topic: Type Utilities
    detail: Partial<User>, Omit<User,'id'>, Pick<User,'name'> — transform types without repeating yourself
resources:
  - title: The TypeScript Handbook
    url: https://www.typescriptlang.org/docs/handbook/intro.html
    provider: Microsoft
    type: docs
    cost: free
    official: true
  - title: Total TypeScript
    url: https://www.totaltypescript.com
    provider: Matt Pocock
    type: course
    cost: freemium
  - title: Matt Pocock
    url: https://www.youtube.com/@MattPocockUk
    provider: YouTube
    type: video
    cost: free
checked: 2026-10-06
---

## In plain English

TypeScript is like labelling containers in a kitchen. If a container says 'sugar (grams: number)', you can't accidentally pour liquid in it — the system warns you. TypeScript adds type labels to JavaScript variables and function parameters. If you pass a number where a string is expected, TypeScript flags it before you run a single line. Instagram, Airbnb, and Microsoft all use TypeScript in production.

## A first look

```typescript
// 1. Basic type
let name: string = "Alex";

// 2. Function with type
function add(a: number, b: number): number {
  return a + b;
}

// 3. Object type
interface User {
  name: string;
  age: number;
}

// 4. Use it
const user: User = {
  name: "Alex",
  age: 20
};

// 5. Real Example
function greet(user: User) {
  return "Hello " + user.name;
}
```
