# Tensors and computation

Implemented topic lessons in the beginner course. Guided practice does not establish retained mastery.

## Learning sequence

- [Shape, rank and dtype](lessons/dl-03-001.md) — dl-03-001
- [Broadcasting](lessons/dl-03-002.md) — dl-03-002
- [Indexing and slicing](lessons/dl-03-003.md) — dl-03-003
- [Memory layout and views](lessons/dl-03-004.md) — dl-03-004
- [float16, float32 and float64](lessons/dl-03-005.md) — dl-03-005
- [Device placement](lessons/dl-03-006.md) — dl-03-006
- [Autograd graphs](lessons/dl-03-007.md) — dl-03-007

## Practice and project rubric

Predict both fixed cases, inspect the operations, and explain the result. Wrong answers and custom sandbox inputs earn no passing evidence. Mini-projects require independent calculations, changed inputs, a diagnosed defect and stated limitations. They are self-reviewed. Browser-local evidence distinguishes visited, attempted and passed; recall cards become due according to FSRS after an explicit retrieval rating.

## Execution and scope

Authored Python programs execute course answers through Pyodide. Python returns each intermediate value, grid and curve; browser drawing code displays that data. The capstone runs its optimizer updates and held-out evaluation in Python. GPU/device and array-view diagrams illustrate concepts without claiming real framework/device execution. Advanced chapters remain specified.

## Worked memory check

A 2 by 3 float32 array has tensor rank 2, six elements and 24 payload bytes. This excludes Python object and runtime overhead. Verify it in the actual Python execution lab.
