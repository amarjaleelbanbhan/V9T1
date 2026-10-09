---
id: CH-00
title: Python, data and mathematics
level: 0
status: specified
prerequisites: []
source_refs: ["SRC-NUMPY", "SRC-PANDAS", "SRC-D2L"]
---

# Python, data and mathematics

## Introduction and learning objectives
A tensor is an indexed collection of numbers; shape lists axis lengths. Learn to predict, calculate, inspect and explain the operations below. This is an original chapter specification, not a claim that every listed lesson is authored or implemented.

## Prerequisites
None; start here. See [prerequisite graph](../PREREQUISITES.md).

## Topic hierarchy
- `dl-00-001` — computers and programs
- `dl-00-002` — variables, loops, functions, objects
- `dl-00-003` — CPU, RAM, GPU, storage
- `dl-00-004` — loading and cleaning data
- `dl-00-005` — algebra and graphs
- `dl-00-006` — probability, mean and variance
- `dl-00-007` — vectors, matrices, dot products
- `dl-00-008` — derivatives and chain rule

## Simple definition and mathematical intuition
A tensor is an indexed collection of numbers; shape lists axis lengths. Start with the numerical example, explain each operation, then generalize the equation.

## Formula and symbols
`z = sum(x_i * w_i) + b`. Symbols and conventions are introduced alongside the values in the example; framework axis conventions must be displayed explicitly.

## Worked numerical example
x=[2,3], w=[4,-1], b=1 gives z=6.

## Python reference example
```python
x=[2,3]
w=[4,-1]
z=sum(a*b for a,b in zip(x,w))+1
assert z == 6
```
Small deterministic reference; execution verification is recorded in the checkpoint. Advanced framework training is not simulated by this snippet.

## Common mistake and debugging challenge
Confusing list concatenation with numerical addition. Construct a failing example, explain its cause, repair it and check the output against an independent calculation.

## Visual demonstration specification
Trace array creation and draw each multiply before summing. Require input controls, prediction before reveal, a single-step control, readable numerical state, keyboard operation, touch targets and reduced motion. Diagrams and tables must agree with the computation engine.

## Original conceptual and numerical practice
Question: Predict the dot product when the first input doubles.

Solution: 14: (4*4)+(3*-1)+1.

Transfer problem: change one example parameter, predict the effect, compute it independently and justify the difference. A second reviewer must validate any new question before it is marked assessed.

## Mini-project and expected outcome
Compute mean and dot products without a framework. Submit working code, a worked calculation, a failing case and a brief account of limitations.

## Relationships
Prerequisites: entry chapter. Later dependencies are listed in catalog.json. Specialized branches do not substitute for core training and evaluation skills.

## Completion criteria
Correct numerical answer with reasoning; independently solve a changed-input problem; diagnose the listed mistake; pass the project rubric. Reading or clicking through is not mastery. Proposed pass rule: all critical safety/leakage items correct and at least 80% across mixed items, followed by a delayed transfer check; this threshold is a product decision, not validated learning research.

## Sources and reuse
SRC-NUMPY, SRC-PANDAS, SRC-D2L. See [source catalog](../SOURCE_CATALOG.md). Content and toy examples here are original. No course figures, datasets or question banks are republished. Advanced topics need lesson-level source review before shipping.

## Implemented sublesson

[Python Variables and Data Flow](lessons/variables-and-data-flow.md) (`dl-00-002-variables`, route `python-basics`) is available. It covers ordered numeric assignments and bounded transfer practice; the remaining chapter is still specified.
