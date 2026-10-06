---
title: Statistics
domain: data
level: intermediate
hours: 40–60
brief: The maths behind why your conclusions are actually true.
prereqs: []
learn:
  - topic: Descriptive Stats
    detail: Mean, median, mode, variance, std deviation, skewness. df.describe() gives all of these for a DataFrame.
  - topic: Distributions
    detail: Normal (bell curve), Poisson (rare events), Binomial (yes/no trials). Knowing which distribution fits your data matters.
  - topic: Central Limit Theorem
    detail: Take enough samples and their means will be normally distributed - even if the original data isn't. The foundation of inference.
  - topic: Hypothesis Testing
    detail: "H₀ (null: no difference) vs H₁ (alternative: there is a difference). p-value < 0.05 means reject H₀."
  - topic: t-test
    detail: Comparing means of two groups. scipy.stats.ttest_ind(group_a, group_b) - are these groups statistically different?
  - topic: Chi-squared test
    detail: Testing if two categorical variables are related. Are conversion rates different by device type?
  - topic: Correlation vs Causation
    detail: df.corr() shows correlation. But correlation ≠ causation. Ice cream sales correlate with drowning rates (both increase in summer).
  - topic: Effect Size
    detail: A result can be statistically significant but practically meaningless. Cohen's d measures how large the real difference is.
  - topic: Confidence Intervals
    detail: "'95% CI: [12.3, 18.7]' - we're 95% sure the true value is in this range. More informative than just the mean."
  - topic: A/B Testing
    detail: Assign users randomly to control/treatment, measure the metric, run a t-test. Minimum sample size matters - calculate it first.
resources:
  - title: SciPy statistics tutorial (scipy.stats)
    url: https://docs.scipy.org/doc/scipy/tutorial/stats.html
    provider: SciPy
    type: docs
    cost: free
    official: true
  - cost: free
    title: OpenIntro Statistics (free book)
    url: https://www.openintro.org/book/os/
    provider: OpenIntro
    type: book
  - title: StatQuest with Josh Starmer
    url: https://www.youtube.com/@statquest
    provider: YouTube
    type: video
    cost: free
  - title: Think Stats (free book)
    url: https://greenteapress.com/wp/think-stats-3e/
    provider: Allen B. Downey
    type: book
    cost: free
  - title: "Khan Academy: Statistics and Probability"
    url: https://www.khanacademy.org/math/statistics-probability
    provider: Khan Academy
    type: course
    cost: free
checked: 2026-10-06
---

## In plain English

Statistics is the language of uncertainty. Without it, you might look at two groups and say 'group A did better than group B' - but was that difference real, or just random noise? Statistics gives you the tools to answer that question with a number: 'there's a 97% probability that this difference is real, not coincidence.' Every A/B test, every ML model evaluation, every business report needs this foundation.

## A first look

```python
import numpy as np

data = [10, 20, 30, 40, 50]

# 1. Mean
print(np.mean(data))

# 2. Median
print(np.median(data))

# 3. Standard deviation
print(np.std(data))

# 4. Simple comparison
group_a = [10, 12, 14]
group_b = [20, 22, 24]

print(np.mean(group_a))
print(np.mean(group_b))

# 5. Real Example
if np.mean(group_b) > np.mean(group_a):
    print("Group B performs better")
```python
