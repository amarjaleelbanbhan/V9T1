---
id: CH-08
title: Convolution operations
level: 4
status: specified
prerequisites: ["CH-04", "CH-03"]
source_refs: ["SRC-CS231N", "SRC-D2L"]
---

# Convolution operations

## Introduction and learning objectives
A convolution layer shares a filter across spatial positions. Learn to predict, calculate, inspect and explain the operations below. This is an original chapter specification, not a claim that every listed lesson is authored or implemented.

## Prerequisites
CH-04, CH-03 See [prerequisite graph](../PREREQUISITES.md).

## Topic hierarchy
- `dl-08-001` — image tensor axes
- `dl-08-002` — cross-correlation versus convolution
- `dl-08-003` — kernels
- `dl-08-004` — channels
- `dl-08-005` — padding, stride and dilation
- `dl-08-006` — pooling
- `dl-08-007` — receptive fields

## Simple definition and mathematical intuition
A convolution layer shares a filter across spatial positions. Start with the numerical example, explain each operation, then generalize the equation.

## Formula and symbols
`out = floor((n + 2p - d*(k-1) - 1)/s) + 1`. Symbols and conventions are introduced alongside the values in the example; framework axis conventions must be displayed explicitly.

## Worked numerical example
n=5, k=3, p=0, s=1, d=1 gives output length 3.

## Python reference example
```python
n,k,p,s,d=5,3,0,1,1
assert (n+2*p-d*(k-1)-1)//s+1==3
```
Small deterministic reference; execution verification is recorded in the checkpoint. Advanced framework training is not simulated by this snippet.

## Common mistake and debugging challenge
Forgetting channel summation or dilation. Construct a failing example, explain its cause, repair it and check the output against an independent calculation.

## Visual demonstration specification
Drag a kernel and show aligned products and output cells. Require input controls, prediction before reveal, a single-step control, readable numerical state, keyboard operation, touch targets and reduced motion. Diagrams and tables must agree with the computation engine.

## Original conceptual and numerical practice
Question: What output length with n=5,k=3,p=1,s=1?

Solution: 5 for dilation 1.

Transfer problem: change one example parameter, predict the effect, compute it independently and justify the difference. A second reviewer must validate any new question before it is marked assessed.

## Mini-project and expected outcome
Implement a tiny 2D cross-correlation and compare a framework result. Submit working code, a worked calculation, a failing case and a brief account of limitations.

## Relationships
Prerequisites: CH-04, CH-03. Later dependencies are listed in catalog.json. Specialized branches do not substitute for core training and evaluation skills.

## Completion criteria
Correct numerical answer with reasoning; independently solve a changed-input problem; diagnose the listed mistake; pass the project rubric. Reading or clicking through is not mastery. Proposed pass rule: all critical safety/leakage items correct and at least 80% across mixed items, followed by a delayed transfer check; this threshold is a product decision, not validated learning research.

## Sources and reuse
SRC-CS231N, SRC-D2L. See [source catalog](../SOURCE_CATALOG.md). Content and toy examples here are original. No course figures, datasets or question banks are republished. Advanced topics need lesson-level source review before shipping.
