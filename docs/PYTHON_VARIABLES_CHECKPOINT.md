# Python variables milestone

PR #7 was squash merged to main at `5ad33805315faf0862b6bba3d4e388f33683d78c`. The production deployment reached READY for that commit.

## Implemented

- Added a beginner lesson on names, assignment, expressions, output, and ordered execution.
- Runs a fixed trusted six-line program in actual Pyodide Python; captures scalar values and output before each instruction and after completion.
- Requires a numerical prediction before execution. Practice evidence requires correct positive and negative input predictions with a nonzero factor, final-step inspection, and a correct assignment explanation.
- Keeps evidence only during the current lesson visit. Navigation or reload resets it.
- Shares worker lifecycle handling with the existing NumPy inspector, including cancellation, input invalidation, error handling, and a 90-second deadline.
- Added the implemented sublesson and original lesson document to the curriculum. The broader variables, loops, and functions parent lesson remains specified.

## Validation

- 60 unit tests passed.
- 26 Playwright browser tests passed, including actual Python and NumPy execution, positive/negative transfer, wrong predictions, input limits, cancellation, keyboard activation, and mobile layout.
- The restricted local browser used an asset-only mirror of authentic pinned Pyodide 0.27.7 downloads. Python execution and results were not mocked. The NumPy wheel hash matched the upstream lock file.
- Production TypeScript/Vite build passed. The existing large JavaScript chunk warning remains.
- Curriculum validation passed: 19 chapters, 148 lesson entries, 17 sources, valid parent references, and acyclic prerequisites.
- Desktop and mobile screenshots were inspected; no page errors occurred during the captured lesson flows.

## Remaining scope

This milestone does not complete the curriculum. Loops, functions, collections, and further Python/math foundations remain next. Arbitrary Python editing, offline runtime loading, persistent progress, and broader mastery assessments remain unimplemented. Line stepping replays a completed trace; it does not pause a live interpreter.

Next: implement the loops lesson with prediction, actual execution, trace inspection, and transfer checks before expanding to functions.
