---
id: CH-02
title: Neurons and activations
level: 2
status: specified
prerequisites: ["CH-00", "CH-01"]
source_refs: ["SRC-D2L", "SRC-CS231N"]
---

# Neurons and activations

## Introduction and learning objectives
Weights scale inputs; bias shifts the activation threshold. Learn to predict, calculate, inspect and explain the operations below. This is an original chapter specification, not a claim that every listed lesson is authored or implemented.

## Prerequisites
CH-00, CH-01 See [prerequisite graph](../PREREQUISITES.md).

## Topic hierarchy
- `dl-02-001` — biological analogy limitations
- `dl-02-002` — perceptron and XOR
- `dl-02-003` — weights and biases
- `dl-02-004` — linear layers
- `dl-02-005` — sigmoid, tanh, ReLU, leaky ReLU
- `dl-02-006` — stable softmax
- `dl-02-007` — initialization

## Simple definition and mathematical intuition
Weights scale inputs; bias shifts the activation threshold. Start with the numerical example, explain each operation, then generalize the equation.

## Formula and symbols
`a = max(0, sum(x_i*w_i)+b)`. Symbols and conventions are introduced alongside the values in the example; framework axis conventions must be displayed explicitly.

## Worked numerical example
x=[1,2], w=[2,-3], b=1: z=-3 and ReLU output=0.

## Python reference example
```python
z=1*2+2*(-3)+1
a=max(0,z)
assert a == 0
```
Small deterministic reference; execution verification is recorded in the checkpoint. Advanced framework training is not simulated by this snippet.

## Common mistake and debugging challenge
Treating softmax as independent scalar sigmoid. Construct a failing example, explain its cause, repair it and check the output against an independent calculation.

## Visual demonstration specification
Separate blue inputs, violet weights and aqua activations; show numeric labels. Require input controls, prediction before reveal, a single-step control, readable numerical state, keyboard operation, touch targets and reduced motion. Diagrams and tables must agree with the computation engine.

## Original conceptual and numerical practice
Question: What does bias=5 produce for the same inputs?

Solution: z=1, ReLU=1.

Transfer problem: change one example parameter, predict the effect, compute it independently and justify the difference. A second reviewer must validate any new question before it is marked assessed.

## Mini-project and expected outcome
Build AND/OR gates and explain why one perceptron fails XOR. Submit working code, a worked calculation, a failing case and a brief account of limitations.

## Relationships
Prerequisites: CH-00, CH-01. Later dependencies are listed in catalog.json. Specialized branches do not substitute for core training and evaluation skills.

## Completion criteria
Correct numerical answer with reasoning; independently solve a changed-input problem; diagnose the listed mistake; pass the project rubric. Reading or clicking through is not mastery. Proposed pass rule: all critical safety/leakage items correct and at least 80% across mixed items, followed by a delayed transfer check; this threshold is a product decision, not validated learning research.

## Sources and reuse
SRC-D2L, SRC-CS231N. See [source catalog](../SOURCE_CATALOG.md). Content and toy examples here are original. No course figures, datasets or question banks are republished. Advanced topics need lesson-level source review before shipping.
