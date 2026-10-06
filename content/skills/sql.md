---
title: SQL
domain: data
level: beginner
hours: 30–50
brief: The language every database speaks - non-negotiable for data roles.
prereqs: []
learn:
  - topic: SELECT + WHERE
    detail: SELECT name, salary FROM employees WHERE department = 'Engineering' ORDER BY salary DESC LIMIT 10
  - topic: Aggregation
    detail: COUNT(*), SUM(amount), AVG(score), MAX(date), MIN(price) - collapse many rows into one summary row
  - topic: GROUP BY
    detail: GROUP BY category - split rows into groups, then aggregate each group. WHERE filters before grouping, HAVING after.
  - topic: JOINs
    detail: INNER JOIN - only matching rows. LEFT JOIN - all left rows + matches. Use ON to specify the join condition.
  - topic: Subqueries
    detail: SELECT * FROM orders WHERE customer_id IN (SELECT id FROM customers WHERE country = 'India')
  - topic: CTEs (WITH clauses)
    detail: WITH monthly AS (SELECT ...) SELECT * FROM monthly - name a subquery and reference it. Essential for readability.
  - topic: Window Functions
    detail: RANK() OVER (PARTITION BY region ORDER BY sales DESC) - analytics without collapsing rows. The senior analyst skill.
  - topic: Date functions
    detail: DATE_TRUNC('month', created_at), EXTRACT(year FROM date), date + INTERVAL '7 days' - work with time data
  - topic: CASE WHEN
    detail: CASE WHEN score >= 90 THEN 'A' WHEN score >= 80 THEN 'B' ELSE 'C' END - conditional column values
  - topic: NULL handling
    detail: COALESCE(value, 0) returns first non-null. IS NULL / IS NOT NULL for filtering. NULLIF(a, b) returns null if a=b.
resources:
  - cost: free
    title: PostgreSQL Tutorial
    url: https://www.postgresql.org/docs/current/tutorial.html
    provider: PostgreSQL
    type: docs
    official: true
  - cost: free
    title: SQLBolt
    url: https://sqlbolt.com
    provider: SQLBolt
    type: interactive
  - title: DataLemur
    url: https://datalemur.com
    provider: DataLemur
    type: practice
    cost: freemium
  - title: StrataScratch
    url: https://www.stratascratch.com
    provider: StrataScratch
    type: practice
    cost: freemium
  - title: Alex The Analyst
    url: https://www.youtube.com/@AlexTheAnalyst
    provider: YouTube
    type: video
    cost: free
  - title: SQL Tutorial for Data Analysis
    url: https://mode.com/sql-tutorial
    provider: Mode
    type: course
    cost: free
checked: 2026-10-06
---

## In plain English

Every company stores data in databases, and SQL is how you talk to them. Think of a database like a library with millions of books (rows), organised into sections (tables). SQL is how you ask the librarian: 'Give me all mystery novels published after 2010 by British authors, sorted by rating, and tell me how many there are per author.' SQL has been around since the 1970s and is still the #1 expected skill in every data analyst job description.

## A first look

```sql
-- 1. Select all
SELECT * FROM sales;

-- 2. Select specific columns
SELECT name, amount FROM sales;

-- 3. Filter
SELECT * FROM sales
WHERE amount > 100;

-- 4. Sort
SELECT * FROM sales
ORDER BY amount DESC;

-- 5. Count
SELECT COUNT(*) FROM sales;

-- 6. Group
SELECT category, SUM(amount)
FROM sales
GROUP BY category;

-- 7. Real Example
SELECT category, SUM(amount) AS total
FROM sales
GROUP BY category
ORDER BY total DESC;
```sql
