---
title: Game Developer
aliases: [Game Programmer, Gameplay Engineer, Unity Developer, Unreal Developer]
summary: Game developers program the systems that make games work - gameplay, physics, AI, input, UI and performance - usually with engines like Unity, Unreal or Godot.
whereTheyWork: Game studios of every size, mobile game companies, indie teams, and simulation, training and XR companies.
dayInLife:
  - Implement a new gameplay mechanic from a designer's spec.
  - Tune character movement until it feels responsive.
  - Profile a level that drops below 60 frames per second and fix it.
  - Fix a physics bug where players fall through the floor.
  - Prototype an idea in a day to see if it's fun.
stages:
  - name: Foundations
    summary: Programming, maths and game loops.
    skills: [csharp, game-math, git, data-structures-algorithms]
    project: Make a complete tiny game (Pong, Snake or Flappy Bird) from scratch, with a start screen, scoring and game over.
    doneWhen: You can explain the game loop, vectors and basic collision, and finish a small game.
    weeks: 10–14
  - name: Core
    summary: A game engine, properly.
    skills: [unity, ui-design]
    project: A small 2D or 3D game in Unity with several levels, enemies, sound, menus and save data - published on itch.io.
    doneWhen: You can build gameplay systems in an engine without following a tutorial step by step.
    weeks: 14–20
  - name: Job-ready
    summary: Performance, C++ and teamwork.
    skills: [cpp, testing-basics, ai-coding-tools]
    project: Join a game jam with a team, ship a game in a weekend, and profile and optimise one of your projects.
    doneWhen: Your portfolio has two or three finished, playable games and you can talk through their code.
    weeks: 12–16
  - name: Senior
    summary: Engine and systems depth.
    skills: [system-design, technical-writing]
    project: Build a reusable system (dialogue, inventory, networking) used across projects, with documentation.
    doneWhen: You design core systems others on the team build on.
skills:
  must: [csharp, unity, game-math, git, data-structures-algorithms]
  should: [cpp, testing-basics, ui-design]
  nice: [system-design, ai-coding-tools, technical-writing]
tools: [Unity (C#) or Unreal Engine (C++) or Godot, Visual Studio or Rider, Git with LFS, a profiler, Blender basics, itch.io, an AI coding assistant]
interview:
  rounds:
    - Recruiter screen
    - Portfolio review - playable games you made and the code behind them
    - Coding - C# or C++, maths and algorithms
    - Engine-specific questions or a take-home gameplay task
    - Behavioural round on teamwork and finishing projects
  practice:
    - { title: itch.io game jams, url: "https://itch.io/jams", provider: itch.io, type: practice, cost: free }
    - { title: Game Programming Patterns (free online book), url: "https://gameprogrammingpatterns.com/", provider: Robert Nystrom, type: book, cost: free }
    - { title: Unity Learn, url: "https://learn.unity.com/", provider: Unity, type: course, cost: free, official: true }
aiImpact: AI tools now help with code, placeholder art and prototyping, letting small teams build more. Finished, polished, fun games still depend on game-feel, performance and design judgement - and a portfolio of shipped games remains the strongest signal for hiring.
market:
  - text: The games industry is competitive and hiring is cyclical; a portfolio of finished, playable games matters more than credentials.
  - text: Unity (C#) dominates mobile and indie games; Unreal (C++) dominates high-end console and PC titles.
adjacent: [embedded-engineer, frontend-engineer, cross-platform-mobile-engineer]
updated: 2026-10-06
---

## Is this role for you?

Game development suits people who love games *and* enjoy the hard engineering behind them - maths, performance, and systems that must run 60 times a second. Expect long iteration on "feel".

## Finish things

The single best thing you can do is finish small games. Game jams (48-hour challenges) are the fastest way to build a portfolio and meet people in the industry.

## Unity or Unreal?

This route uses Unity and C# because it's beginner-friendly and dominant on mobile and indie. Unreal and C++ are the standard at large studios making console and PC games; Godot is a popular free, open-source option.
