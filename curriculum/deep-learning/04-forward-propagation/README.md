---
id: CH-04
title: Forward propagation
level: 2
status: specified
prerequisites: ["CH-02", "CH-03"]
source_refs: ["SRC-D2L", "SRC-CS231N"]
---

# Forward propagation

## Introduction and learning objectives
A forward pass applies layers to obtain predictions. Learn to predict, calculate, inspect and explain the operations below. This is an original chapter specification, not a claim that every listed lesson is authored or implemented.

## Prerequisites
CH-02, CH-03 See [prerequisite graph](../PREREQUISITES.md).

## Topic hierarchy
- `dl-04-001` — dense layer shapes
- `dl-04-002` — batch axis
- `dl-04-003` — matrix multiplication
- `dl-04-004` — layer composition
- `dl-04-005` — logits versus probabilities
- `dl-04-006` — training versus inference

## Simple definition and mathematical intuition
A forward pass applies layers to obtain predictions. Start with the numerical example, explain each operation, then generalize the equation.

## Formula and symbols
`H = f(XW + b)`. Symbols and conventions are introduced alongside the values in the example; framework axis conventions must be displayed explicitly.

## Worked numerical example
[1,2] dot [3,4] plus 1 produces 12 before activation.

## Python reference example
```python
x=[1,2]
w=[3,4]
z=sum(a*b for a,b in zip(x,w))+1
assert z==12
```
Small deterministic reference; execution verification is recorded in the checkpoint. Advanced framework training is not simulated by this snippet.

## Common mistake and debugging challenge
Transposing weights inconsistently between code and diagram. Construct a failing example, explain its cause, repair it and check the output against an independent calculation.

## Visual demonstration specification
Advance contribution, sum, bias, activation and output stages. Require input controls, prediction before reveal, a single-step control, readable numerical state, keyboard operation, touch targets and reduced motion. Diagrams and tables must agree with the computation engine.

## Original conceptual and numerical practice
Question: What shape does (5,3) @ (3,2) produce?

Solution: (5,2): shared inner dimension is contracted.

Transfer problem: change one example parameter, predict the effect, compute it independently and justify the difference. A second reviewer must validate any new question before it is marked assessed.

## Mini-project and expected outcome
Verify a 2-to-2-to-1 network by hand and with the existing engine. Submit working code, a worked calculation, a failing case and a brief account of limitations.

## Relationships
Prerequisites: CH-02, CH-03. Later dependencies are listed in catalog.json. Specialized branches do not substitute for core training and evaluation skills.

## Completion criteria
Correct numerical answer with reasoning; independently solve a changed-input problem; diagnose the listed mistake; pass the project rubric. Reading or clicking through is not mastery. Proposed pass rule: all critical safety/leakage items correct and at least 80% across mixed items, followed by a delayed transfer check; this threshold is a product decision, not validated learning research.

## Sources and reuse
SRC-D2L, SRC-CS231N. See [source catalog](../SOURCE_CATALOG.md). Content and toy examples here are original. No course figures, datasets or question banks are republished. Advanced topics need lesson-level source review before shipping.
