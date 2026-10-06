---
title: Machine Learning
domain: data
level: intermediate
hours: 80–120
brief: Teaching computers to find patterns humans can't see.
prereqs:
  - python
  - pandas
  - statistics
learn:
  - topic: What is a Model
    detail: A mathematical function that maps inputs (features) to outputs (predictions). You train it on historical data to learn the mapping.
  - topic: Train / Test Split
    detail: Train on 80%, evaluate on the held-out 20%. Testing on training data is cheating — the model memorised it. NEVER do this.
  - topic: Overfitting
    detail: The model memorised the training data too well — 98% accuracy in training, 60% on new data. Reduce complexity or add more data.
  - topic: Linear Regression
    detail: Predict a continuous number (house price, sales amount). Assumes a linear relationship between features and target.
  - topic: Logistic Regression
    detail: Predict a category (spam/not spam, churn/retain). Despite the name, it's a classification algorithm.
  - topic: Decision Trees
    detail: A tree of if-then rules learned from data. Interpretable. Random Forest = hundreds of trees voting together (more accurate).
  - topic: Model Evaluation
    detail: "Regression: MAE, RMSE, R². Classification: accuracy, precision, recall, F1, AUC-ROC. Choose the metric that matches your business goal."
  - topic: Feature Engineering
    detail: Transform raw data into informative features. Normalise numeric features. Encode categoricals. Remove correlated features. This is 80% of the work.
  - topic: Cross-Validation
    detail: Split data into 5 folds, train/test 5 times on different splits. The average score is much more reliable than one train/test split.
  - topic: GridSearchCV
    detail: Automatically try all combinations of hyperparameters and return the best. Pass param_grid={'n_estimators':[100,200], 'max_depth':[3,5,7]}.
resources:
  - title: scikit-learn User Guide
    url: https://scikit-learn.org/stable/user_guide.html
    provider: scikit-learn
    type: docs
    cost: free
    official: true
  - cost: free
    title: Machine Learning Crash Course
    url: https://developers.google.com/machine-learning/crash-course
    provider: Google
    type: course
  - title: "Kaggle Learn: Intro to Machine Learning"
    url: https://www.kaggle.com/learn/intro-to-machine-learning
    provider: Kaggle
    type: interactive
    cost: free
  - title: StatQuest with Josh Starmer
    url: https://www.youtube.com/@statquest
    provider: YouTube
    type: video
    cost: free
  - title: Hands-On Machine Learning (3rd ed.)
    url: https://www.oreilly.com/library/view/hands-on-machine-learning/9781098125967/
    provider: Aurélien Géron
    type: book
    cost: paid
checked: 2026-10-06
---

## In plain English

Machine learning is pattern recognition at scale. A spam filter that reads 10 million emails and learns which words and patterns correlate with spam — that's ML. A price predictor that studied 500,000 past property sales and learned that bedrooms, location, age, and square footage together predict price — that's ML. You don't program the rules. The algorithm finds them from the data.

## A first look

```python
from sklearn.linear_model import LinearRegression
import numpy as np

# 1. Data (features and labels)
X = np.array([[1], [2], [3], [4]])
y = np.array([2, 4, 6, 8])

# 2. Model
model = LinearRegression()

# 3. Train
model.fit(X, y)

# 4. Predict
pred = model.predict([[5]])

print(pred)

# 5. Real idea
# model learned: y = 2x
```python
