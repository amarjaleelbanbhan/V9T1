---
id: CH-18
title: Research and capstones
level: 7
status: specified
prerequisites: ["CH-17"]
source_refs: ["SRC-CS231N", "SRC-CS224N", "SRC-D2L"]
---

# Research and capstones

## Introduction and learning objectives
A reproduction tests whether a claim survives an explicit experimental protocol. Learn to predict, calculate, inspect and explain the operations below. This is an original chapter specification, not a claim that every listed lesson is authored or implemented.

## Prerequisites
CH-17 See [prerequisite graph](../PREREQUISITES.md).

## Topic hierarchy
- `dl-18-001` — reading and critiquing papers
- `dl-18-002` — reproduction
- `dl-18-003` — experiment tracking
- `dl-18-004` — hyperparameter search
- `dl-18-005` — benchmarking
- `dl-18-006` — ablations
- `dl-18-007` — dataset quality
- `dl-18-008` — unstable training debugging
- `dl-18-009` — capstones

## Simple definition and mathematical intuition
A reproduction tests whether a claim survives an explicit experimental protocol. Start with the numerical example, explain each operation, then generalize the equation.

## Formula and symbols
`difference = measured_score - baseline_score`. Symbols and conventions are introduced alongside the values in the example; framework axis conventions must be displayed explicitly.

## Worked numerical example
Scores .82 and .80 differ by .02; this alone does not establish statistical significance.

## Python reference example
```python
score,baseline=.82,.80
assert abs((score-baseline)-.02)<1e-12
```
Small deterministic reference; execution verification is recorded in the checkpoint. Advanced framework training is not simulated by this snippet.

## Common mistake and debugging challenge
Selecting the best test-set run as the reported result. Construct a failing example, explain its cause, repair it and check the output against an independent calculation.

## Visual demonstration specification
Compare seeds, confidence intervals, compute budgets and ablations. Require input controls, prediction before reveal, a single-step control, readable numerical state, keyboard operation, touch targets and reduced motion. Diagrams and tables must agree with the computation engine.

## Original conceptual and numerical practice
Question: Does a .02 gain from one seed establish robustness?

Solution: No; evaluate variability and confounders under a controlled protocol.

Transfer problem: change one example parameter, predict the effect, compute it independently and justify the difference. A second reviewer must validate any new question before it is marked assessed.

## Mini-project and expected outcome
Reproduce a bounded result and publish code, protocol and negative findings. Submit working code, a worked calculation, a failing case and a brief account of limitations.

## Relationships
Prerequisites: CH-17. Later dependencies are listed in catalog.json. Specialized branches do not substitute for core training and evaluation skills.

## Completion criteria
Correct numerical answer with reasoning; independently solve a changed-input problem; diagnose the listed mistake; pass the project rubric. Reading or clicking through is not mastery. Proposed pass rule: all critical safety/leakage items correct and at least 80% across mixed items, followed by a delayed transfer check; this threshold is a product decision, not validated learning research.

## Sources and reuse
SRC-CS231N, SRC-CS224N, SRC-D2L. See [source catalog](../SOURCE_CATALOG.md). Content and toy examples here are original. No course figures, datasets or question banks are republished. Advanced topics need lesson-level source review before shipping.
