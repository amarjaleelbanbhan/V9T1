---
id: CH-12
title: Attention and transformers
level: 5
status: specified
prerequisites: ["CH-11", "CH-03"]
source_refs: ["SRC-CS224N", "SRC-HF", "SRC-D2L"]
---

# Attention and transformers

## Introduction and learning objectives
Attention forms weighted combinations of value vectors. Learn to predict, calculate, inspect and explain the operations below. This is an original chapter specification, not a claim that every listed lesson is authored or implemented.

## Prerequisites
CH-11, CH-03 See [prerequisite graph](../PREREQUISITES.md).

## Topic hierarchy
- `dl-12-001` — Q,K,V
- `dl-12-002` — scaled dot-product attention
- `dl-12-003` — causal and padding masks
- `dl-12-004` — positional encodings
- `dl-12-005` — multi-head attention
- `dl-12-006` — encoder and decoder
- `dl-12-007` — BERT and GPT styles
- `dl-12-008` — fine-tuning
- `dl-12-009` — RAG
- `dl-12-010` — language-model evaluation

## Simple definition and mathematical intuition
Attention forms weighted combinations of value vectors. Start with the numerical example, explain each operation, then generalize the equation.

## Formula and symbols
`attention = softmax(QK_transpose/sqrt(d_k))V`. Symbols and conventions are introduced alongside the values in the example; framework axis conventions must be displayed explicitly.

## Worked numerical example
Equal scores over values [2,6] give weights [.5,.5] and result 4.

## Python reference example
```python
weights=[.5,.5]
values=[2,6]
assert sum(w*v for w,v in zip(weights,values))==4
```
Small deterministic reference; execution verification is recorded in the checkpoint. Advanced framework training is not simulated by this snippet.

## Common mistake and debugging challenge
Assuming attention weights alone explain causality. Construct a failing example, explain its cause, repair it and check the output against an independent calculation.

## Visual demonstration specification
Edit Q/K scores, mask a cell and inspect normalized rows. Require input controls, prediction before reveal, a single-step control, readable numerical state, keyboard operation, touch targets and reduced motion. Diagrams and tables must agree with the computation engine.

## Original conceptual and numerical practice
Question: What output do equal scores give for values [1,5]?

Solution: 3, the equally weighted average.

Transfer problem: change one example parameter, predict the effect, compute it independently and justify the difference. A second reviewer must validate any new question before it is marked assessed.

## Mini-project and expected outcome
Implement tiny masked attention and a retrieval evaluation with provenance. Submit working code, a worked calculation, a failing case and a brief account of limitations.

## Relationships
Prerequisites: CH-11, CH-03. Later dependencies are listed in catalog.json. Specialized branches do not substitute for core training and evaluation skills.

## Completion criteria
Correct numerical answer with reasoning; independently solve a changed-input problem; diagnose the listed mistake; pass the project rubric. Reading or clicking through is not mastery. Proposed pass rule: all critical safety/leakage items correct and at least 80% across mixed items, followed by a delayed transfer check; this threshold is a product decision, not validated learning research.

## Sources and reuse
SRC-CS224N, SRC-HF, SRC-D2L. See [source catalog](../SOURCE_CATALOG.md). Content and toy examples here are original. No course figures, datasets or question banks are republished. Advanced topics need lesson-level source review before shipping.
