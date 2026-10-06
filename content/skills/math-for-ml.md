---
title: Maths for Machine Learning
domain: foundations
level: intermediate
hours: 60–100
brief: The maths machine learning is built on — linear algebra, calculus and probability — at the level you need to understand models, not to prove theorems.
prereqs:
  - python
learn:
  - topic: Vectors and matrices
    detail: Data as vectors, models as matrix operations, dot products as similarity.
  - topic: Matrix multiplication and transformations
    detail: What a layer in a neural network actually computes.
  - topic: Derivatives and gradients
    detail: How a small change in input changes output — the heart of training.
  - topic: The chain rule
    detail: How gradients flow backwards through layers (backpropagation).
  - topic: Probability
    detail: Random variables, distributions, expectation and Bayes' rule.
  - topic: Optimisation
    detail: Gradient descent, learning rates and why training sometimes diverges.
  - topic: Eigenvectors and PCA
    detail: Finding the directions that matter most in data.
resources:
  - title: Mathematics for Machine Learning (free book)
    url: https://mml-book.github.io/
    provider: Deisenroth, Faisal & Ong
    type: book
    cost: free
  - title: Essence of Linear Algebra
    url: https://www.3blue1brown.com/topics/linear-algebra
    provider: 3Blue1Brown
    type: video
    cost: free
  - title: Essence of Calculus
    url: https://www.3blue1brown.com/topics/calculus
    provider: 3Blue1Brown
    type: video
    cost: free
  - title: "Khan Academy: Linear algebra"
    url: https://www.khanacademy.org/math/linear-algebra
    provider: Khan Academy
    type: course
    cost: free
checked: 2026-10-06
---

## In plain English

A machine learning model is a big mathematical function with adjustable numbers. Training means nudging those numbers to reduce error — using gradients from calculus, on data stored as matrices from linear algebra, with uncertainty described by probability.

## How much do you need?

Enough to read a model's equations, understand why training behaves the way it does, and debug it. Intuition — from visual resources like 3Blue1Brown — plus practice in NumPy is worth more than memorising proofs.
