---
id: CH-15
title: Efficient training
level: 6
status: specified
prerequisites: ["CH-07", "CH-03"]
source_refs: ["SRC-TORCH", "SRC-HF"]
---

# Efficient training

## Introduction and learning objectives
Efficiency must be measured against accuracy, hardware and workload. Learn to predict, calculate, inspect and explain the operations below. This is an original chapter specification, not a claim that every listed lesson is authored or implemented.

## Prerequisites
CH-07, CH-03 See [prerequisite graph](../PREREQUISITES.md).

## Topic hierarchy
- `dl-15-001` — profiling
- `dl-15-002` — distributed training
- `dl-15-003` — gradient accumulation
- `dl-15-004` — mixed precision
- `dl-15-005` — loss scaling
- `dl-15-006` — quantization
- `dl-15-007` — PEFT
- `dl-15-008` — distillation
- `dl-15-009` — compression
- `dl-15-010` — memory budgeting

## Simple definition and mathematical intuition
Efficiency must be measured against accuracy, hardware and workload. Start with the numerical example, explain each operation, then generalize the equation.

## Formula and symbols
`raw_weight_bytes = parameter_count * bytes_per_parameter`. Symbols and conventions are introduced alongside the values in the example; framework axis conventions must be displayed explicitly.

## Worked numerical example
1000 float32 weights need 4000 payload bytes; optimizer and activations are extra.

## Python reference example
```python
parameters=1000
assert parameters*4==4000
```
Small deterministic reference; execution verification is recorded in the checkpoint. Advanced framework training is not simulated by this snippet.

## Common mistake and debugging challenge
Claiming twofold end-to-end speed from halving weight precision. Construct a failing example, explain its cause, repair it and check the output against an independent calculation.

## Visual demonstration specification
Show separate parameter, activation, gradient and optimizer memory budgets. Require input controls, prediction before reveal, a single-step control, readable numerical state, keyboard operation, touch targets and reduced motion. Diagrams and tables must agree with the computation engine.

## Original conceptual and numerical practice
Question: Does 4000 bytes describe all training memory?

Solution: No; activations, gradients, optimizer state and runtime overhead also count.

Transfer problem: change one example parameter, predict the effect, compute it independently and justify the difference. A second reviewer must validate any new question before it is marked assessed.

## Mini-project and expected outcome
Profile a baseline and report quality, latency and peak memory tradeoffs. Submit working code, a worked calculation, a failing case and a brief account of limitations.

## Relationships
Prerequisites: CH-07, CH-03. Later dependencies are listed in catalog.json. Specialized branches do not substitute for core training and evaluation skills.

## Completion criteria
Correct numerical answer with reasoning; independently solve a changed-input problem; diagnose the listed mistake; pass the project rubric. Reading or clicking through is not mastery. Proposed pass rule: all critical safety/leakage items correct and at least 80% across mixed items, followed by a delayed transfer check; this threshold is a product decision, not validated learning research.

## Sources and reuse
SRC-TORCH, SRC-HF. See [source catalog](../SOURCE_CATALOG.md). Content and toy examples here are original. No course figures, datasets or question banks are republished. Advanced topics need lesson-level source review before shipping.
