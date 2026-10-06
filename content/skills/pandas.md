---
title: NumPy & Pandas
domain: data
level: beginner
hours: 30–50
brief: The engine that makes Python fast enough for real data.
prereqs:
  - python
learn:
  - topic: NumPy Arrays
    detail: np.array([1,2,3]) - like a list but typed and fast. Supports element-wise operations without loops.
  - topic: Broadcasting
    detail: array * 1.08 multiplies every element. array[array > 100] filters without a loop. This is the core NumPy pattern.
  - topic: DataFrame
    detail: pd.read_csv('data.csv') loads it. df.head() shows first 5 rows. df.info() shows types. df.describe() shows statistics.
  - topic: Selecting data
    detail: df['column'] for a series. df[['a','b']] for multiple columns. df.loc[row,col] for labels. df.iloc[0,0] for positions.
  - topic: Filtering rows
    detail: df[df['sales'] > 100] - boolean mask. df.query('sales > 100 and region == "North"') - readable string syntax.
  - topic: GroupBy
    detail: df.groupby('category')['amount'].agg(['mean','sum','count']) - summarise by category in one line.
  - topic: Merge / Join
    detail: pd.merge(customers, orders, on='customer_id', how='left') - same as SQL LEFT JOIN. Combine related DataFrames.
  - topic: Missing Values
    detail: df.isnull().sum() - count NaNs per column. df.dropna() removes rows. df.fillna(0) replaces NaN with zero.
  - topic: apply() / map()
    detail: df['name'].apply(str.upper) - apply any function to a column. .map() for Series, .apply() for row/column-level.
  - topic: pd.to_datetime()
    detail: Convert string dates to datetime objects. Then df['date'].dt.month, dt.year, dt.day_name() give time features.
resources:
  - title: "pandas: Getting started"
    url: https://pandas.pydata.org/docs/getting_started/index.html
    provider: pandas
    type: docs
    cost: free
    official: true
  - title: "Kaggle Learn: Pandas"
    url: https://www.kaggle.com/learn/pandas
    provider: Kaggle
    type: interactive
    cost: free
  - title: Alex The Analyst
    url: https://www.youtube.com/@AlexTheAnalyst
    provider: YouTube
    type: video
    cost: free
checked: 2026-10-06
---

## In plain English

Imagine you have a spreadsheet with 1 million rows and you need to multiply every value in a column by 1.08 (a tax rate). In plain Python this would loop 1 million times and take maybe 10 seconds. NumPy does it in 0.01 seconds because it uses compiled C code under the hood. Pandas is NumPy plus a spreadsheet interface - you get row labels, column names, and the ability to combine datasets like SQL joins.

## A first look

```python
import pandas as pd

# 1. Create DataFrame
data = {
    "name": ["A", "B", "C"],
    "sales": [100, 200, 150]
}

df = pd.DataFrame(data)

# 2. View data
print(df.head())

# 3. Select column
print(df["sales"])

# 4. Filter
high = df[df["sales"] > 150]

# 5. Add new column
df["double_sales"] = df["sales"] * 2

# 6. Grouping (basic idea)
print(df["sales"].mean())

# 7. Real Example
total_sales = df["sales"].sum()
print("Total:", total_sales)
```python
