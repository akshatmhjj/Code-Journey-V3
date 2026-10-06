---
title: PyTorch
domain: ai
level: intermediate
hours: 30–50
brief: PyTorch is the most widely used deep learning framework in research and industry — tensors, automatic gradients and building blocks for training neural networks.
prereqs:
  - python
  - deep-learning
learn:
  - topic: Tensors
    detail: Multi-dimensional arrays on CPU or GPU.
  - topic: Autograd
    detail: Automatic gradients for any computation.
  - topic: nn.Module
    detail: Define models from layers.
  - topic: The training loop
    detail: Forward pass, loss, backward pass, optimiser step.
  - topic: Datasets and DataLoaders
    detail: Batching, shuffling and loading data efficiently.
  - topic: GPUs
    detail: Moving models and data to a device; mixed precision.
  - topic: Saving and loading
    detail: Checkpoints and exporting models for serving.
resources:
  - title: PyTorch tutorials
    url: https://docs.pytorch.org/tutorials/
    provider: PyTorch
    type: docs
    cost: free
    official: true
  - title: PyTorch documentation
    url: https://docs.pytorch.org/docs/stable/index.html
    provider: PyTorch
    type: docs
    cost: free
    official: true
  - title: Learn PyTorch for Deep Learning
    url: https://www.learnpytorch.io/
    provider: Daniel Bourke
    type: course
    cost: free
checked: 2026-10-06
---

## A first look

```python
import torch
from torch import nn

model = nn.Sequential(nn.Linear(10, 32), nn.ReLU(), nn.Linear(32, 1))
opt = torch.optim.Adam(model.parameters(), lr=1e-3)

for x, y in loader:
    loss = nn.functional.mse_loss(model(x), y)
    opt.zero_grad()
    loss.backward()
    opt.step()
```
