# Beginner implementation checkpoint

The repository's Absolute beginner path is chapters 00–07. All **60 core topic lessons** are authored and implemented. Advanced chapters 08–18 remain specified. This checkpoint describes implementation coverage, not a finding that learners have mastered the material.

| Chapter | Core topics | Interactive coverage |
|---|---:|---|
| 00 Python, data and mathematics | 8 | Program traces, data cleaning, algebra, variance, dot products and derivatives; actual Python variables/control-flow labs |
| 01 AI, ML and evaluation | 9 | Learned slopes, task types, features/targets, splits, leakage, thresholds, F1, generalization and history |
| 02 Neurons and activations | 7 | XOR truth table, affine contributions, activations, stable softmax and initialization |
| 03 Tensors and computation | 7 | Shape/payload, broadcasting, slices, sharing, precision, device compatibility and gradient paths |
| 04 Forward propagation | 6 | Dense shapes, batch axis, matrix products, composition, logits and training-mode behavior |
| 05 Loss and optimization | 7 | MAE/MSE, cross entropy, stable logits loss, descent, optimizer state, schedules and batches |
| 06 Backpropagation | 7 | Local/path derivatives, deltas, parameter gradients, reverse-mode rules, finite differences and depth effects |
| 07 Training and generalization | 9 | Loaders, paired shuffling, decay, dropout, normalization, initialization, stopping, checkpoints and diagnostics |

## Delivered practice

- Every topic has vocabulary, meaning, purpose, formulas, two numerical cases, visual intermediate values, an explanation check, a debugging exercise, a self-reviewed mini-project and a primary reference.
- **120 fixed calculation cases** are exercised in the browser. Editing values opens a sandbox, which does not earn course evidence.
- **Eight mixed chapter reviews** contain 16 numerical tasks and eight explanations. Every item must pass; retakes and feedback are allowed. These are bounded practice checks, not proctored or validated mastery assessments.
- The Python labs execute fixed trusted source in Pyodide 0.27.7, including NumPy inspection, assignments, conditions, repeated lines, function-local scopes and retained object state. Replay controls inspect captured execution rather than pausing the interpreter.
- The capstone actually fits a scalar regression model using SGD, momentum or bias-corrected Adam. It exposes paired seeded batches, computed gradients, weight/bias updates, epoch losses, validation-selected checkpoints, optional early stopping and a held-out comparison with a training-mean baseline.
- Existing neural-network labs remain available, including actual single-example network parameter updates with finite-difference verification.

## Evidence persistence

Topic evidence distinguishes visited, attempted and passed. Topic evidence and chapter review results persist on the current browser. A topic review becomes due after one day; passing guided exercises is not proof of retained understanding. Python and capstone transfer evidence lasts during the visit only. Saved inference checkpoints retain model weights and provenance, but not full optimizer/scheduler/random state for exact training resume.

## Verification

- **132/132 unit tests passed**, including independent numerical identities, finite differences, stable loss/softmax checks, float16 rounding boundaries, real trainer updates, reproducible paired batching and checkpoint selection.
- **33/33 browser tests passed**, including all 120 course cases, eight chapter reviews, actual Python and NumPy, wrong-answer/sandbox handling, persistence, delayed-review timing, cancellation, keyboard, mobile and reduced motion.
- TypeScript/Vite production build passed. The existing main-bundle size warning remains; beginner course and capstone load separately.
- Catalog validation passed: **19 chapters, 149 entries, 20 sources**; all 60 core beginner topics resolve to implemented content, references are valid and prerequisites are acyclic.
- Desktop and 390px screenshots of the course and capstone were inspected. Captured capstone flows had zero page errors and no horizontal overflow.
- Local browser Python tests used authentic pinned CDN assets mirrored into requests because of environment network restrictions. Python results were executed, not mocked. GitHub CI independently uses direct CDN loading and gates each merge.

## Merge sequence

- PR #8: Python variables — merged after passing CI.
- PR #9: Python control flow — merged after passing CI.
- PR #10: beginner foundations — merged after passing CI.
- PR #11: neural computation topics — merged after passing CI.
- PR #12: loss, backpropagation and training topics — merged after passing CI.
- Final capstone/review milestone follows the same test, CI and merge gate.

## Boundaries and next stage

Beginner implementation is the stopping boundary for this cycle. Plan advanced scope separately before beginning chapters 08–18. Independent pedagogical review, learner retention studies, physical-device/screen-reader testing, arbitrary code editing, offline Python caching and exact optimizer-state resume remain future work. The browser does not execute PyTorch/TensorFlow; device/view diagrams explicitly illustrate those concepts. Written mini-projects require human self-review and do not grant automated mastery credit.
