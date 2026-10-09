---
id: CH-07
title: Training and generalization
level: 2
status: specified
prerequisites: ["CH-06", "CH-01"]
source_refs: ["SRC-D2L", "SRC-SKLEARN", "SRC-TORCH"]
---

# Training and generalization

## Introduction and learning objectives
Training error alone does not establish generalization. Learn to predict, calculate, inspect and explain the operations below. This is an original chapter specification, not a claim that every listed lesson is authored or implemented.

## Prerequisites
CH-06, CH-01 See [prerequisite graph](../PREREQUISITES.md).

## Topic hierarchy
- `dl-07-001` — dataset loaders and training loops
- `dl-07-002` — batching and shuffling
- `dl-07-003` — regularization and weight decay
- `dl-07-004` — dropout
- `dl-07-005` — batch normalization
- `dl-07-006` — initialization
- `dl-07-007` — early stopping
- `dl-07-008` — checkpoints
- `dl-07-009` — diagnostics

## Simple definition and mathematical intuition
Training error alone does not establish generalization. Start with the numerical example, explain each operation, then generalize the equation.

## Formula and symbols
`mean_loss = sum(sample_losses)/N`. Symbols and conventions are introduced alongside the values in the example; framework axis conventions must be displayed explicitly.

## Worked numerical example
Sample losses [1,3,2] have mean 2.

## Python reference example
```python
losses=[1,3,2]
assert sum(losses)/len(losses)==2
```
Small deterministic reference; execution verification is recorded in the checkpoint. Advanced framework training is not simulated by this snippet.

## Common mistake and debugging challenge
Leaving dropout active during evaluation. Construct a failing example, explain its cause, repair it and check the output against an independent calculation.

## Visual demonstration specification
Compare training and validation curves and inspect batches. Require input controls, prediction before reveal, a single-step control, readable numerical state, keyboard operation, touch targets and reduced motion. Diagrams and tables must agree with the computation engine.

## Original conceptual and numerical practice
Question: Does lower train loss guarantee better test performance?

Solution: No; overfitting and distribution changes can reduce test performance.

Transfer problem: change one example parameter, predict the effect, compute it independently and justify the difference. A second reviewer must validate any new question before it is marked assessed.

## Mini-project and expected outcome
Train a small model, save its checkpoint and explain a validation gap. Submit working code, a worked calculation, a failing case and a brief account of limitations.

## Relationships
Prerequisites: CH-06, CH-01. Later dependencies are listed in catalog.json. Specialized branches do not substitute for core training and evaluation skills.

## Completion criteria
Correct numerical answer with reasoning; independently solve a changed-input problem; diagnose the listed mistake; pass the project rubric. Reading or clicking through is not mastery. Proposed pass rule: all critical safety/leakage items correct and at least 80% across mixed items, followed by a delayed transfer check; this threshold is a product decision, not validated learning research.

## Sources and reuse
SRC-D2L, SRC-SKLEARN, SRC-TORCH. See [source catalog](../SOURCE_CATALOG.md). Content and toy examples here are original. No course figures, datasets or question banks are republished. Advanced topics need lesson-level source review before shipping.
