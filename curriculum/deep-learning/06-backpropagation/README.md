---
id: CH-06
title: Backpropagation
level: 2
status: specified
prerequisites: ["CH-05", "CH-03"]
source_refs: ["SRC-CS231N", "SRC-D2L", "SRC-TORCH"]
---

# Backpropagation

## Introduction and learning objectives
Backpropagation reuses local derivatives to compute parameter gradients. Learn to predict, calculate, inspect and explain the operations below. This is an original chapter specification, not a claim that every listed lesson is authored or implemented.

## Prerequisites
CH-05, CH-03 See [prerequisite graph](../PREREQUISITES.md).

## Topic hierarchy
- `dl-06-001` — local derivatives
- `dl-06-002` — chain rule
- `dl-06-003` — output and hidden deltas
- `dl-06-004` — parameter gradients
- `dl-06-005` — autodiff
- `dl-06-006` — finite differences
- `dl-06-007` — vanishing and exploding gradients

## Simple definition and mathematical intuition
Backpropagation reuses local derivatives to compute parameter gradients. Start with the numerical example, explain each operation, then generalize the equation.

## Formula and symbols
`dL/dw = (prediction-target)*input for half squared error`. Symbols and conventions are introduced alongside the values in the example; framework axis conventions must be displayed explicitly.

## Worked numerical example
x=2, w=3, target=4: prediction=6, dL/dw=4.

## Python reference example
```python
x,w,y=2,3,4
grad=(x*w-y)*x
assert grad==4
```
Small deterministic reference; execution verification is recorded in the checkpoint. Advanced framework training is not simulated by this snippet.

## Common mistake and debugging challenge
Replacing a derivative with its activation value. Construct a failing example, explain its cause, repair it and check the output against an independent calculation.

## Visual demonstration specification
Follow backward arrows with derivative factors and numerical gradient checks. Require input controls, prediction before reveal, a single-step control, readable numerical state, keyboard operation, touch targets and reduced motion. Diagrams and tables must agree with the computation engine.

## Original conceptual and numerical practice
Question: What is dL/dw when x=0?

Solution: 0 for this model; the prediction does not depend on w.

Transfer problem: change one example parameter, predict the effect, compute it independently and justify the difference. A second reviewer must validate any new question before it is marked assessed.

## Mini-project and expected outcome
Independently check every dense-network parameter by central differences. Submit working code, a worked calculation, a failing case and a brief account of limitations.

## Relationships
Prerequisites: CH-05, CH-03. Later dependencies are listed in catalog.json. Specialized branches do not substitute for core training and evaluation skills.

## Completion criteria
Correct numerical answer with reasoning; independently solve a changed-input problem; diagnose the listed mistake; pass the project rubric. Reading or clicking through is not mastery. Proposed pass rule: all critical safety/leakage items correct and at least 80% across mixed items, followed by a delayed transfer check; this threshold is a product decision, not validated learning research.

## Sources and reuse
SRC-CS231N, SRC-D2L, SRC-TORCH. See [source catalog](../SOURCE_CATALOG.md). Content and toy examples here are original. No course figures, datasets or question banks are republished. Advanced topics need lesson-level source review before shipping.
