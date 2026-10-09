---
id: CH-10
title: Sequences and RNNs
level: 5
status: specified
prerequisites: ["CH-07"]
source_refs: ["SRC-D2L", "SRC-CS224N"]
---

# Sequences and RNNs

## Introduction and learning objectives
A recurrent state carries information across ordered steps. Learn to predict, calculate, inspect and explain the operations below. This is an original chapter specification, not a claim that every listed lesson is authored or implemented.

## Prerequisites
CH-07 See [prerequisite graph](../PREREQUISITES.md).

## Topic hierarchy
- `dl-10-001` — sequence axes
- `dl-10-002` — recurrence
- `dl-10-003` — RNN, LSTM, GRU
- `dl-10-004` — hidden states
- `dl-10-005` — BPTT
- `dl-10-006` — masking and padding
- `dl-10-007` — time-series splits and forecasting

## Simple definition and mathematical intuition
A recurrent state carries information across ordered steps. Start with the numerical example, explain each operation, then generalize the equation.

## Formula and symbols
`h_t = tanh(W_x*x_t + W_h*h_previous + b)`. Symbols and conventions are introduced alongside the values in the example; framework axis conventions must be displayed explicitly.

## Worked numerical example
For a linear teaching recurrence h_t=x_t+.5*h_previous, [2,2] gives [2,3].

## Python reference example
```python
h=0
for x in [2,2]:
    h=x+0.5*h
assert h==3
```
Small deterministic reference; execution verification is recorded in the checkpoint. Advanced framework training is not simulated by this snippet.

## Common mistake and debugging challenge
Randomly splitting future observations into training data. Construct a failing example, explain its cause, repair it and check the output against an independent calculation.

## Visual demonstration specification
Unroll two timesteps and link shared weights. Label linear simplification. Require input controls, prediction before reveal, a single-step control, readable numerical state, keyboard operation, touch targets and reduced motion. Diagrams and tables must agree with the computation engine.

## Original conceptual and numerical practice
Question: Why are chronological forecasting splits useful?

Solution: They avoid training on future information when predicting the past.

Transfer problem: change one example parameter, predict the effect, compute it independently and justify the difference. A second reviewer must validate any new question before it is marked assessed.

## Mini-project and expected outcome
Forecast a synthetic signal and compare against persistence. Submit working code, a worked calculation, a failing case and a brief account of limitations.

## Relationships
Prerequisites: CH-07. Later dependencies are listed in catalog.json. Specialized branches do not substitute for core training and evaluation skills.

## Completion criteria
Correct numerical answer with reasoning; independently solve a changed-input problem; diagnose the listed mistake; pass the project rubric. Reading or clicking through is not mastery. Proposed pass rule: all critical safety/leakage items correct and at least 80% across mixed items, followed by a delayed transfer check; this threshold is a product decision, not validated learning research.

## Sources and reuse
SRC-D2L, SRC-CS224N. See [source catalog](../SOURCE_CATALOG.md). Content and toy examples here are original. No course figures, datasets or question banks are republished. Advanced topics need lesson-level source review before shipping.
