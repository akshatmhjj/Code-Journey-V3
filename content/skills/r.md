---
title: R
domain: data
level: intermediate
hours: 40–60
brief: Built by statisticians, for statisticians - the academic standard.
prereqs: []
learn:
  - topic: Vectors & DataFrames
    detail: c(1,2,3) is a vector. data.frame() is R's DataFrame. tibble() from tidyverse is cleaner.
  - topic: The Pipe Operator
    detail: data |> filter() |> group_by() |> summarise() - chain operations left-to-right. Identical mental model to Python method chaining.
  - topic: dplyr (data manipulation)
    detail: filter(), select(), mutate(), group_by(), summarise(), arrange(), join_left() - equivalent to Pandas operations.
  - topic: tidyr (reshaping)
    detail: pivot_wider() and pivot_longer() - reshape data between wide and long format. Essential for visualisation.
  - topic: ggplot2 (visualisation)
    detail: ggplot(data, aes(x=month, y=revenue)) + geom_line() + geom_point() + theme_minimal() - layered grammar of graphics.
  - topic: Statistical Tests
    detail: t.test(), chisq.test(), aov(), lm() - native R has every statistical test you'll ever need.
  - topic: lm() Linear Models
    detail: model <- lm(salary ~ years_exp + education, data=df) - formula syntax. summary(model) gives coefficients, p-values, R².
  - topic: R Markdown
    detail: Mix R code, output, and prose in one document. Knit to HTML, PDF, or Word. The standard format for reproducible research.
  - topic: Shiny
    detail: Build interactive web dashboards entirely in R - sliders, dropdowns, reactive charts. No JavaScript needed.
  - topic: Bioconductor
    detail: The R ecosystem for genomics and bioinformatics - 2,000+ packages for biological data analysis.
resources:
  - cost: free
    title: An Introduction to R
    url: https://cran.r-project.org/doc/manuals/r-release/R-intro.html
    provider: R Project
    type: docs
    official: true
  - title: ggplot2
    url: https://ggplot2.tidyverse.org
    provider: Posit / tidyverse
    type: docs
    cost: free
    official: true
  - title: R for Data Science (2e)
    url: https://r4ds.hadley.nz/
    provider: Wickham, Çetinkaya-Rundel, Grolemund
    type: book
    cost: free
  - title: TidyTuesday
    url: https://github.com/rfordatascience/tidytuesday
    provider: R4DS Community
    type: practice
    cost: free
  - title: David Robinson
    url: https://www.youtube.com/@drob
    provider: YouTube
    type: video
    cost: free
checked: 2026-10-06
---

## In plain English

R is the language of research papers, pharmaceutical trials, economics departments, and academic statistics. If Python is the Swiss Army knife, R is the surgeon's scalpel - extremely precise for statistical analysis, built specifically for the kind of rigorous work that gets published in peer-reviewed journals. If you're going into biostatistics, academic research, economics, or clinical data - learn R. ggplot2 alone produces better charts than Matplotlib by default.

## A first look

```r
# 1. Vector
data <- c(10, 20, 30)

# 2. Mean
mean(data)

# 3. Data frame
df <- data.frame(
  name = c("A", "B", "C"),
  sales = c(100, 200, 150)
)

# 4. Filter
df[df$sales > 150, ]

# 5. Plot
plot(df$sales)

# 6. Real Example
total <- sum(df$sales)
print(total)
```r
