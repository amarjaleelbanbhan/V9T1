---
id: CH-03
title: Tensors and computation
level: 3
status: specified
prerequisites: ["CH-00"]
source_refs: ["SRC-NUMPY", "SRC-TORCH", "SRC-TF"]
---

# Tensors and computation

## Introduction and learning objectives
Rank counts axes; element count is the product of shape dimensions. Learn to predict, calculate, inspect and explain the operations below. This is an original chapter specification, not a claim that every listed lesson is authored or implemented.

## Prerequisites
CH-00 See [prerequisite graph](../PREREQUISITES.md).

## Topic hierarchy
- `dl-03-001` — shape, rank and dtype
- `dl-03-002` — broadcasting
- `dl-03-003` — indexing and slicing
- `dl-03-004` — memory layout and views
- `dl-03-005` — float16, float32, float64
- `dl-03-006` — device placement
- `dl-03-007` — autograd graphs

## Simple definition and mathematical intuition
Rank counts axes; element count is the product of shape dimensions. Start with the numerical example, explain each operation, then generalize the equation.

## Formula and symbols
`payload_bytes = product(shape) * itemsize`. Symbols and conventions are introduced alongside the values in the example; framework axis conventions must be displayed explicitly.

## Worked numerical example
A 2 by 3 float32 array has rank 2 and 24 payload bytes.

## Python reference example
```python
import numpy as np
x=np.array([[1,2,3],[4,5,6]],dtype=np.float32)
assert x.shape==(2,3) and x.nbytes==24
```
Small deterministic reference; execution verification is recorded in the checkpoint. Advanced framework training is not simulated by this snippet.

## Common mistake and debugging challenge
Calling payload bytes total process memory. Construct a failing example, explain its cause, repair it and check the output against an independent calculation.

## Visual demonstration specification
Highlight executed lines and inspect shape, dtype, values and measured nbytes. Require input controls, prediction before reveal, a single-step control, readable numerical state, keyboard operation, touch targets and reduced motion. Diagrams and tables must agree with the computation engine.

## Original conceptual and numerical practice
Question: How many payload bytes for shape (4,3), float64?

Solution: 96 bytes, excluding Python object and runtime overhead.

Transfer problem: change one example parameter, predict the effect, compute it independently and justify the difference. A second reviewer must validate any new question before it is marked assessed.

## Mini-project and expected outcome
Build a shape inspector and debug incompatible broadcasting. Submit working code, a worked calculation, a failing case and a brief account of limitations.

## Relationships
Prerequisites: CH-00. Later dependencies are listed in catalog.json. Specialized branches do not substitute for core training and evaluation skills.

## Completion criteria
Correct numerical answer with reasoning; independently solve a changed-input problem; diagnose the listed mistake; pass the project rubric. Reading or clicking through is not mastery. Proposed pass rule: all critical safety/leakage items correct and at least 80% across mixed items, followed by a delayed transfer check; this threshold is a product decision, not validated learning research.

## Sources and reuse
SRC-NUMPY, SRC-TORCH, SRC-TF. See [source catalog](../SOURCE_CATALOG.md). Content and toy examples here are original. No course figures, datasets or question banks are republished. Advanced topics need lesson-level source review before shipping.
