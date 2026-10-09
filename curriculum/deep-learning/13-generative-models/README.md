---
id: CH-13
title: Generative models
level: 6
status: specified
prerequisites: ["CH-12"]
source_refs: ["SRC-D2L", "SRC-FASTAI", "SRC-TORCH"]
---

# Generative models

## Introduction and learning objectives
A generative model learns a distribution or a process for producing samples. Learn to predict, calculate, inspect and explain the operations below. This is an original chapter specification, not a claim that every listed lesson is authored or implemented.

## Prerequisites
CH-12 See [prerequisite graph](../PREREQUISITES.md).

## Topic hierarchy
- `dl-13-001` — autoencoders
- `dl-13-002` — VAEs and latent variables
- `dl-13-003` — GAN objectives
- `dl-13-004` — diffusion noise schedules
- `dl-13-005` — sampling
- `dl-13-006` — generative evaluation

## Simple definition and mathematical intuition
A generative model learns a distribution or a process for producing samples. Start with the numerical example, explain each operation, then generalize the equation.

## Formula and symbols
`noisy = sqrt(alpha)*clean + sqrt(1-alpha)*noise`. Symbols and conventions are introduced alongside the values in the example; framework axis conventions must be displayed explicitly.

## Worked numerical example
alpha=1 retains clean; alpha=0 retains noise.

## Python reference example
```python
from math import sqrt
alpha=1
assert sqrt(alpha)*3+sqrt(1-alpha)*7==3
```
Small deterministic reference; execution verification is recorded in the checkpoint. Advanced framework training is not simulated by this snippet.

## Common mistake and debugging challenge
Judging sample quality from selected examples alone. Construct a failing example, explain its cause, repair it and check the output against an independent calculation.

## Visual demonstration specification
Move a noise slider; distinguish a teaching mixture from trained diffusion. Require input controls, prediction before reveal, a single-step control, readable numerical state, keyboard operation, touch targets and reduced motion. Diagrams and tables must agree with the computation engine.

## Original conceptual and numerical practice
Question: What happens to the clean signal at alpha=0?

Solution: Its coefficient is zero.

Transfer problem: change one example parameter, predict the effect, compute it independently and justify the difference. A second reviewer must validate any new question before it is marked assessed.

## Mini-project and expected outcome
Compare reconstruction and generation on a small original dataset. Submit working code, a worked calculation, a failing case and a brief account of limitations.

## Relationships
Prerequisites: CH-12. Later dependencies are listed in catalog.json. Specialized branches do not substitute for core training and evaluation skills.

## Completion criteria
Correct numerical answer with reasoning; independently solve a changed-input problem; diagnose the listed mistake; pass the project rubric. Reading or clicking through is not mastery. Proposed pass rule: all critical safety/leakage items correct and at least 80% across mixed items, followed by a delayed transfer check; this threshold is a product decision, not validated learning research.

## Sources and reuse
SRC-D2L, SRC-FASTAI, SRC-TORCH. See [source catalog](../SOURCE_CATALOG.md). Content and toy examples here are original. No course figures, datasets or question banks are republished. Advanced topics need lesson-level source review before shipping.
