---
title: Python
domain: data
level: beginner
hours: 40–60
brief: The language of data science — readable, fast to write, faster to run with libraries.
prereqs: []
learn:
  - topic: Variables & Types
    detail: Python is dynamically typed — no type declarations. int, float, str, bool, None. Use type hints for clarity.
  - topic: Lists & Dicts
    detail: "[1,2,3] for ordered collections. {'name':'Alex','age':30} for key-value pairs. Both mutable."
  - topic: List Comprehensions
    detail: "[x*2 for x in data if x>0] — filter and transform in one readable line. Faster than a for loop."
  - topic: Functions & Lambda
    detail: "def clean(text): return text.strip().lower(). Lambda: lambda x: x*2. Lambdas for simple one-line transforms."
  - topic: f-strings
    detail: name="Alex"; print(f"Hello {name}") — embed expressions in strings. Cleaner than concatenation.
  - topic: Context Managers
    detail: "with open('data.csv') as f: — automatically closes the file even if an error occurs. Always use with open()."
  - topic: Classes (for DS)
    detail: Use sparingly. You'll mostly use library classes (DataFrame, Model). Know how to read class docs though.
  - topic: Virtual Environments
    detail: python -m venv venv → source venv/bin/activate → pip install pandas. Never install packages globally.
  - topic: Jupyter Notebooks
    detail: .ipynb files. Mix code, output, and text. The standard for exploratory analysis and sharing results.
  - topic: Type Hints
    detail: "def process(df: pd.DataFrame) -> pd.Series: — hints don't enforce types but make code readable and IDE-friendly."
resources:
  - title: The Python Tutorial
    url: https://docs.python.org/3/tutorial/
    provider: Python Software Foundation
    type: docs
    cost: free
    official: true
  - title: "Kaggle Learn: Python"
    url: https://www.kaggle.com/learn/python
    provider: Kaggle
    type: interactive
    cost: free
  - title: sentdex
    url: https://www.youtube.com/@sentdex
    provider: YouTube
    type: video
    cost: free
checked: 2026-10-06
---

## In plain English

Python is to data science what Excel is to accountants — except infinitely more powerful, free, and automatable. It reads almost like English, which is why scientists, economists, and biologists who've never coded before can learn it in weeks. 90% of everything you'll do in data science happens in Python: loading data, cleaning it, visualising it, modelling it.

## A first look

```python
# 1. Variables
name = "Alex"
age = 21

# 2. List
sales = [120, 200, 150]

# 3. Loop
for s in sales:
    print(s)

# 4. Function
def double(x):
    return x * 2

print(double(5))

# 5. List comprehension (important)
high_sales = [s for s in sales if s > 150]

# 6. Dictionary
user = {"name": "Alex", "age": 21}

# 7. Real Example
total = sum(sales)
avg = total / len(sales)

print("Total:", total)
print("Average:", avg)
```python
