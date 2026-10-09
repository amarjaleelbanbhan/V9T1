---
id: CH-05
title: Loss and optimization
level: 2
status: specified
prerequisites: ["CH-04"]
source_refs: ["SRC-CS231N", "SRC-D2L"]
---

# Loss and optimization

## Introduction and learning objectives
A loss measures error; an optimizer changes parameters using gradients. Learn to predict, calculate, inspect and explain the operations below. This is an original chapter specification, not a claim that every listed lesson is authored or implemented.

## Prerequisites
CH-04 See [prerequisite graph](../PREREQUISITES.md).

## Topic hierarchy
- `dl-05-001` — MSE and MAE
- `dl-05-002` — binary and categorical cross entropy
- `dl-05-003` — stable logits losses
- `dl-05-004` — gradient descent
- `dl-05-005` — SGD, momentum, Adam
- `dl-05-006` — learning-rate schedules
- `dl-05-007` — epochs and mini-batches

## Simple definition and mathematical intuition
A loss measures error; an optimizer changes parameters using gradients. Start with the numerical example, explain each operation, then generalize the equation.

## Formula and symbols
`w_next = w - learning_rate * gradient`. Symbols and conventions are introduced alongside the values in the example; framework axis conventions must be displayed explicitly.

## Worked numerical example
L=w^2, w=2, lr=.1: gradient=4; next w=1.6 and loss=2.56.

## Python reference example
```python
w=2.0
w-=0.1*(2*w)
assert abs(w-1.6)<1e-12
```
Small deterministic reference; execution verification is recorded in the checkpoint. Advanced framework training is not simulated by this snippet.

## Common mistake and debugging challenge
Taking a step in the gradient direction. Construct a failing example, explain its cause, repair it and check the output against an independent calculation.

## Visual demonstration specification
Draw a loss curve with tangent and editable update arrows. Require input controls, prediction before reveal, a single-step control, readable numerical state, keyboard operation, touch targets and reduced motion. Diagrams and tables must agree with the computation engine.

## Original conceptual and numerical practice
Question: For w=-2 and lr=.1, what is next w?

Solution: -1.6, because gradient is -4.

Transfer problem: change one example parameter, predict the effect, compute it independently and justify the difference. A second reviewer must validate any new question before it is marked assessed.

## Mini-project and expected outcome
Compare stable, oscillating and divergent step sizes. Submit working code, a worked calculation, a failing case and a brief account of limitations.

## Relationships
Prerequisites: CH-04. Later dependencies are listed in catalog.json. Specialized branches do not substitute for core training and evaluation skills.

## Completion criteria
Correct numerical answer with reasoning; independently solve a changed-input problem; diagnose the listed mistake; pass the project rubric. Reading or clicking through is not mastery. Proposed pass rule: all critical safety/leakage items correct and at least 80% across mixed items, followed by a delayed transfer check; this threshold is a product decision, not validated learning research.

## Sources and reuse
SRC-CS231N, SRC-D2L. See [source catalog](../SOURCE_CATALOG.md). Content and toy examples here are original. No course figures, datasets or question banks are republished. Advanced topics need lesson-level source review before shipping.
