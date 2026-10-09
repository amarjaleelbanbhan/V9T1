---
id: dl-00-002-variables
title: Python Variables and Data Flow
chapter: CH-00
level: beginner
parent_id: dl-00-002
prerequisites: [dl-00-001]
estimated_minutes: 25
visual_priority: high
source_refs: [SRC-PYTHON]
status: implemented
route_id: python-basics
---

# Python Variables and Data Flow

## Introduction
A computer follows instructions. This lesson introduces names, numeric values and ordered assignments through a six-line program. It covers a small part of the Python foundation; loops, functions, lists and objects remain separate work.

## Objectives and measurable skills
1. Predict a multiplication before execution, including a negative input.
2. Identify the value bound to each name before and after assignment.
3. Explain why a stored result does not update when an earlier input changes.
4. Distinguish assignment from printed output.

## Prerequisites
Read a small sequence of instructions and multiply two numbers. No coding background is needed. `dl-00-001` supplies context about programs; its full interactive lesson remains specified, so the current UI contains a short contextual explanation rather than pretending the prerequisite is complete.

## Vocabulary
- Variable: a name referring to a value.
- Assignment: evaluate the expression on the right of `=`, then bind the name on the left.
- Expression: something that can be evaluated to produce a value.
- Output: displayed information, produced here by `print`.

These original explanations describe the numeric program below; they are not a complete account of Python references or mutable objects.

## Numerical intuition and symbols
For this program, `product = x * factor` stores the number obtained by multiplication at that point in execution. `x` is the starting number, `factor` is the multiplier, and `*` is the multiplication operator. `=` is an instruction to assign a result; it is not a mathematical claim that will keep itself true after future changes.

## Worked example and Python
```python
x = 2
factor = 3
product = x * factor
x = x + 1
print(product)
print(x)
```

After line 1: x refers to 2. After line 2: factor refers to 3. After line 3: product refers to 6. After line 4: x refers to 3; product still refers to 6. The output is 6 followed by 3 on the next line. The multiplication was evaluated before x changed.

## Visual and execution specification
The user edits two numeric inputs and predicts product. The fixed trusted program runs in Pyodide; scalar names and values are captured through the shared trace pipeline. Three cards display x, factor and product. Each line-event snapshot describes the state before the highlighted instruction; a separate final event contains completed output. Runtime loading and tracing are real; replaying captured events does not re-execute Python one instruction at a time.

Controls: run prediction, cancel, previous instruction, next instruction. Changing input invalidates the current trace and explanation; recorded prior practice attempts remain for the current session. No arbitrary-code editor, object-memory-address diagram or spreadsheet-style reactive recalculation is implied.

## Original exercises and verified solutions
- Numerical prediction: x=2, factor=3. Product is 6; final x is 3.
- Transfer: x=-2, factor=4. Product is -8; final x is -1.
- Zero: x=0, factor=5. Product is 0; final x is 1. This is useful practice but does not satisfy the positive/negative transfer gates.
- Fraction: x=.25, factor=4. Product is 1.0; final x is 1.25. Python can represent both integer and floating-point values; the exact captured type is displayed.
- Concept: Why does product keep its earlier value? Its assignment executed once. A later assignment to x does not revisit that instruction.

## Common mistakes and debugging challenge
Mistake: interpreting assignment as a live formula. Inspect product on both sides of `x = x + 1` and explain the unchanged value. Another mistake is expecting assignment to print automatically; compare the output before and after the print statements.

Debugging challenge, specified for later arbitrary-code practice: move multiplication before the first assignment to x. Explain why that order would cause a name lookup error. The current fixed program does not let learners reorder arbitrary code.

## Mini-project and expected outcome
On paper, build a two-input cost calculation with an intermediate total. Predict its state after changing one input. Explain which assignment must execute again to update the total. A complete project should include code, an expected-output calculation and an explanation of instruction order. The in-app prototype grades the bounded multiplication transfer examples only.

## Completion criteria
Within the current lesson visit, correctly predict a nonzero-factor positive-x run and a nonzero-factor negative-x run, reach the final trace and select the correct assignment explanation. Numerical comparison uses relative tolerance `1e-9 * max(1, abs(actual))`. This is practice evidence for the bounded lesson, not independently validated Python mastery. Leaving or reloading the lesson resets attempts. Attempts are not persisted and the explanation is a conceptual choice, not an essay assessment.

## Sources and licenses
Python 3.12 introduction: https://docs.python.org/3.12/tutorial/introduction.html, checked 2026-10-09. Licensing page: https://docs.python.org/3.12/license.html. Material is linked; definitions, examples, questions and visualization here are original. No third-party figures or exercise banks are copied.

## Relationships
Feeds arithmetic expressions, lists, loops, functions and tensor creation. Parent `dl-00-002` remains specified because this sublesson alone does not implement all of that broader topic.
