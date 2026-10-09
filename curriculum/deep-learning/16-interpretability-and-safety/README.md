---
id: CH-16
title: Interpretability and responsible AI
level: 6
status: specified
prerequisites: ["CH-01", "CH-07"]
source_refs: ["SRC-TORCH", "SRC-GOOGLE"]
---

# Interpretability and responsible AI

## Introduction and learning objectives
An explanation method is evidence about behavior, not proof of correctness. Learn to predict, calculate, inspect and explain the operations below. This is an original chapter specification, not a claim that every listed lesson is authored or implemented.

## Prerequisites
CH-01, CH-07 See [prerequisite graph](../PREREQUISITES.md).

## Topic hierarchy
- `dl-16-001` — saliency limitations
- `dl-16-002` — robustness and adversarial inputs
- `dl-16-003` — privacy
- `dl-16-004` — security
- `dl-16-005` — fairness
- `dl-16-006` — subgroup metrics
- `dl-16-007` — uncertainty
- `dl-16-008` — model and dataset cards

## Simple definition and mathematical intuition
An explanation method is evidence about behavior, not proof of correctness. Start with the numerical example, explain each operation, then generalize the equation.

## Formula and symbols
`error_rate = errors/examples`. Symbols and conventions are introduced alongside the values in the example; framework axis conventions must be displayed explicitly.

## Worked numerical example
Group A: 2/10 errors=.2; group B: 8/10=.8, aggregate=.5.

## Python reference example
```python
rates=[2/10,8/10]
assert sum(rates)/2==.5
```
Small deterministic reference; execution verification is recorded in the checkpoint. Advanced framework training is not simulated by this snippet.

## Common mistake and debugging challenge
Inferring fairness from aggregate accuracy. Construct a failing example, explain its cause, repair it and check the output against an independent calculation.

## Visual demonstration specification
Inspect aggregate and subgroup metrics with sample counts. Require input controls, prediction before reveal, a single-step control, readable numerical state, keyboard operation, touch targets and reduced motion. Diagrams and tables must agree with the computation engine.

## Original conceptual and numerical practice
Question: Can aggregate .5 hide unequal group error rates?

Solution: Yes: .2 and .8 average to .5 for equal sizes.

Transfer problem: change one example parameter, predict the effect, compute it independently and justify the difference. A second reviewer must validate any new question before it is marked assessed.

## Mini-project and expected outcome
Write a model card with failure cases and scoped privacy assumptions. Submit working code, a worked calculation, a failing case and a brief account of limitations.

## Relationships
Prerequisites: CH-01, CH-07. Later dependencies are listed in catalog.json. Specialized branches do not substitute for core training and evaluation skills.

## Completion criteria
Correct numerical answer with reasoning; independently solve a changed-input problem; diagnose the listed mistake; pass the project rubric. Reading or clicking through is not mastery. Proposed pass rule: all critical safety/leakage items correct and at least 80% across mixed items, followed by a delayed transfer check; this threshold is a product decision, not validated learning research.

## Sources and reuse
SRC-TORCH, SRC-GOOGLE. See [source catalog](../SOURCE_CATALOG.md). Content and toy examples here are original. No course figures, datasets or question banks are republished. Advanced topics need lesson-level source review before shipping.
