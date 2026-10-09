---
id: CH-11
title: Text representations
level: 5
status: specified
prerequisites: ["CH-10"]
source_refs: ["SRC-CS224N", "SRC-HF"]
---

# Text representations

## Introduction and learning objectives
A tokenizer maps text pieces to IDs; embeddings map IDs to learned vectors. Learn to predict, calculate, inspect and explain the operations below. This is an original chapter specification, not a claim that every listed lesson is authored or implemented.

## Prerequisites
CH-10 See [prerequisite graph](../PREREQUISITES.md).

## Topic hierarchy
- `dl-11-001` — text cleaning
- `dl-11-002` — tokenization
- `dl-11-003` — subword vocabularies
- `dl-11-004` — embeddings
- `dl-11-005` — sequence representations
- `dl-11-006` — language modeling
- `dl-11-007` — data leakage and evaluation

## Simple definition and mathematical intuition
A tokenizer maps text pieces to IDs; embeddings map IDs to learned vectors. Start with the numerical example, explain each operation, then generalize the equation.

## Formula and symbols
`embedding_table shape = (vocabulary_size, embedding_dim)`. Symbols and conventions are introduced alongside the values in the example; framework axis conventions must be displayed explicitly.

## Worked numerical example
Vocabulary 100, dimension 8: 800 stored scalar parameters.

## Python reference example
```python
vocab,dim=100,8
assert vocab*dim==800
```
Small deterministic reference; execution verification is recorded in the checkpoint. Advanced framework training is not simulated by this snippet.

## Common mistake and debugging challenge
Confusing a token ID with a semantic distance. Construct a failing example, explain its cause, repair it and check the output against an independent calculation.

## Visual demonstration specification
Inspect text, token boundaries, IDs and embedding rows. Require input controls, prediction before reveal, a single-step control, readable numerical state, keyboard operation, touch targets and reduced motion. Diagrams and tables must agree with the computation engine.

## Original conceptual and numerical practice
Question: Does ID 10 imply similarity to ID 11?

Solution: No; IDs index vocabulary entries.

Transfer problem: change one example parameter, predict the effect, compute it independently and justify the difference. A second reviewer must validate any new question before it is marked assessed.

## Mini-project and expected outcome
Build a tiny vocabulary and investigate unknown words and padding. Submit working code, a worked calculation, a failing case and a brief account of limitations.

## Relationships
Prerequisites: CH-10. Later dependencies are listed in catalog.json. Specialized branches do not substitute for core training and evaluation skills.

## Completion criteria
Correct numerical answer with reasoning; independently solve a changed-input problem; diagnose the listed mistake; pass the project rubric. Reading or clicking through is not mastery. Proposed pass rule: all critical safety/leakage items correct and at least 80% across mixed items, followed by a delayed transfer check; this threshold is a product decision, not validated learning research.

## Sources and reuse
SRC-CS224N, SRC-HF. See [source catalog](../SOURCE_CATALOG.md). Content and toy examples here are original. No course figures, datasets or question banks are republished. Advanced topics need lesson-level source review before shipping.
