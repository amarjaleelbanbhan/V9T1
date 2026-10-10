# NeuralLab

A visual Deep Learning classroom built with React, TypeScript, Vite and Three.js.

The beginner path covers chapters 00–07 with **60 authored topic lessons**, **120 worked/transfer calculation cases**, **eight mixed chapter reviews**, actual Python traces, and a small regression-training project. Existing neuron, perceptron, tensor, forward/backpropagation, activation, loss and gradient-depth labs remain available. Advanced chapters 08–18 are specified for later implementation.

Start with **Start beginner course** in the navigation. Every topic introduces terms, purpose, formulas, stepwise calculations, explanation checks, debugging and a self-reviewed mini-project. Course evidence distinguishes visited, attempted and passed; it is stored on the current browser. A review becomes due after one day. These bounded checks do not establish retained mastery.

## Runtime and training

- Python labs run fixed trusted code using pinned Pyodide 0.27.7, optionally NumPy. Numeric inputs are editable; arbitrary code editing is not supported. The first runtime load requires network access. Stepping replays completed captures.
- Course answers execute authored Python programs in Pyodide, including the intermediate values, grids and curves drawn by the browser. Every interactive lab exposes a runnable Python example. The capstone trains and evaluates in Python and fits a line using SGD, momentum or Adam, paired seeded batches, training/validation separation, optional early stopping and L2 penalty. Test data does not select the checkpoint.
- Inference checkpoints persist locally with model weights and provenance. Exact optimizer-state resume is not implemented. The app does not run browser PyTorch or TensorFlow.
- Three.js has a 2D SVG fallback. The navy palette uses blue inputs, violet weights, aqua activations, coral errors and gold gradients.

## Development and validation

```bash
npm install
npm run dev
npm run check:curriculum
npm test
npm run build
npx playwright install chromium
npm run test:e2e
```

Node.js 22+ is recommended. Restricted local environments can set `NEURALLAB_PYODIDE_ASSETS` to authentic downloaded pinned runtime assets for browser tests. This mirrors asset requests; Python execution is not mocked. CI uses the CDN directly.

## Architecture and scope

`src/engine/` contains deterministic math and training engines; `src/course/` contains authored lessons and evidence handling. `curriculum/deep-learning/` holds the canonical catalog and lesson documents. `src/visuals/` preserves the 2D/3D workspaces.

See [beginner completion checkpoint](docs/BEGINNER_COMPLETION.md), [coverage](curriculum/deep-learning/COVERAGE_MATRIX.md), [sources](curriculum/deep-learning/SOURCE_CATALOG.md) and [research gaps](curriculum/deep-learning/RESEARCH_GAPS.md). The course outline and research path set scope; empirical learning effectiveness, independent project grading, low-end physical-device testing, comprehensive accessibility review and offline runtime caching remain future work.

Product direction and historical audit: [Project Renaissance 2026](docs/PROJECT_RENAISSANCE_2026.md). Current status is recorded in its reconciliation; proposed missions are described in [Learning missions](docs/missions/LEARNING_MISSIONS.md).

