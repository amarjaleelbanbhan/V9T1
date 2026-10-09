---
id: CH-01
title: AI, ML and evaluation
level: 1
status: specified
prerequisites: ["CH-00"]
source_refs: ["SRC-GOOGLE", "SRC-SKLEARN"]
---

# AI, ML and evaluation

## Introduction and learning objectives
A held-out test estimates performance on unseen data from its sampling setting. Learn to predict, calculate, inspect and explain the operations below. This is an original chapter specification, not a claim that every listed lesson is authored or implemented.

## Prerequisites
CH-00 See [prerequisite graph](../PREREQUISITES.md).

## Topic hierarchy
- `dl-01-001` — symbolic versus learned systems
- `dl-01-002` — supervised, unsupervised, reinforcement learning
- `dl-01-003` — features, labels, predictions
- `dl-01-004` — train, validation, test
- `dl-01-005` — leakage and split strategies
- `dl-01-006` — regression and classification
- `dl-01-007` — confusion matrix, precision, recall, F1
- `dl-01-008` — bias, variance and generalization
- `dl-01-009` — neural-network history

## Simple definition and mathematical intuition
A held-out test estimates performance on unseen data from its sampling setting. Start with the numerical example, explain each operation, then generalize the equation.

## Formula and symbols
`precision = TP/(TP+FP); recall = TP/(TP+FN)`. Symbols and conventions are introduced alongside the values in the example; framework axis conventions must be displayed explicitly.

## Worked numerical example
TP=3, FP=1, FN=2: precision=.75, recall=.6, F1=2/3.

## Python reference example
```python
tp,fp,fn=3,1,2
f1=2*tp/(2*tp+fp+fn)
assert abs(f1-2/3)<1e-12
```
Small deterministic reference; execution verification is recorded in the checkpoint. Advanced framework training is not simulated by this snippet.

## Common mistake and debugging challenge
Scaling the whole dataset before splitting leaks information. Construct a failing example, explain its cause, repair it and check the output against an independent calculation.

## Visual demonstration specification
Move a threshold and see four labeled confusion cells. Require input controls, prediction before reveal, a single-step control, readable numerical state, keyboard operation, touch targets and reduced motion. Diagrams and tables must agree with the computation engine.

## Original conceptual and numerical practice
Question: What is recall when TP=3 and FN=2?

Solution: 0.6; use actual positives as denominator.

Transfer problem: change one example parameter, predict the effect, compute it independently and justify the difference. A second reviewer must validate any new question before it is marked assessed.

## Mini-project and expected outcome
Compare a baseline and threshold model on a held-out synthetic split. Submit working code, a worked calculation, a failing case and a brief account of limitations.

## Relationships
Prerequisites: CH-00. Later dependencies are listed in catalog.json. Specialized branches do not substitute for core training and evaluation skills.

## Completion criteria
Correct numerical answer with reasoning; independently solve a changed-input problem; diagnose the listed mistake; pass the project rubric. Reading or clicking through is not mastery. Proposed pass rule: all critical safety/leakage items correct and at least 80% across mixed items, followed by a delayed transfer check; this threshold is a product decision, not validated learning research.

## Sources and reuse
SRC-GOOGLE, SRC-SKLEARN. See [source catalog](../SOURCE_CATALOG.md). Content and toy examples here are original. No course figures, datasets or question banks are republished. Advanced topics need lesson-level source review before shipping.
