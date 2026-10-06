---
title: Data Visualization
domain: data
level: beginner
hours: 20–30
brief: Turn numbers into insight anyone can see.
prereqs:
  - pandas
learn:
  - topic: plt.subplots()
    detail: fig, ax = plt.subplots() - creates a figure and axes. fig.savefig('chart.png', dpi=150) to save it.
  - topic: Bar charts
    detail: ax.bar(categories, values) - compare quantities across categories. Horizontal with barh() for long labels.
  - topic: Line charts
    detail: "ax.plot(x, y, marker='o') - show trends over time. Multiple lines: call plot() again with a different series."
  - topic: Scatter plots
    detail: ax.scatter(x, y, c=color_col, alpha=0.6) - show relationships between two numeric variables.
  - topic: Histograms
    detail: ax.hist(data, bins=30, edgecolor='white') - show the distribution of a single numeric variable.
  - topic: Box plots
    detail: seaborn.boxplot(data=df, x='category', y='value') - show median, IQR, and outliers per group.
  - topic: Heatmaps
    detail: sns.heatmap(df.corr(), annot=True, cmap='coolwarm') - show correlations between all numeric columns.
  - topic: FacetGrid
    detail: sns.FacetGrid(df, col='category').map(sns.histplot, 'value') - the same chart repeated per category.
  - topic: Styling
    detail: plt.style.use('dark_background'). seaborn.set_theme(style='whitegrid'). Always label axes and add titles.
  - topic: Plotly (interactive)
    detail: px.bar(df, x='month', y='revenue', color='category') - hover-over data. For dashboards and presentations.
resources:
  - title: Matplotlib Gallery
    url: https://matplotlib.org/stable/gallery/index.html
    provider: Matplotlib
    type: docs
    cost: free
    official: true
  - title: seaborn Tutorial
    url: https://seaborn.pydata.org/tutorial.html
    provider: seaborn
    type: docs
    cost: free
    official: true
  - title: Plotly Express
    url: https://plotly.com/python/plotly-express/
    provider: Plotly
    type: docs
    cost: free
    official: true
  - title: Rob Mulla
    url: https://www.youtube.com/@robmulla
    provider: YouTube
    type: video
    cost: free
checked: 2026-10-06
---

## In plain English

A table of 10,000 numbers tells you nothing at a glance. A histogram of those same numbers instantly reveals the distribution - whether it's normal, skewed, bimodal. This is why visualisation is not optional. Matplotlib is the foundation - low-level, full control. Seaborn builds on top with statistical charts that would take 50 lines in Matplotlib but take one line in Seaborn.

## A first look

```python
import matplotlib.pyplot as plt

# 1. Data
months = ["Jan", "Feb", "Mar"]
sales = [100, 200, 150]

# 2. Line chart
plt.plot(months, sales)

# 3. Labels
plt.title("Sales Over Time")
plt.xlabel("Month")
plt.ylabel("Sales")

# 4. Show chart
plt.show()

# 5. Bar chart
plt.bar(months, sales)
plt.show()
```python
