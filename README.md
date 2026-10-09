# NeuralLab

A visual-first Deep Learning classroom. This project implements six **interactive foundations, neuron, perceptron, tensor, forward propagation and activation lessons**, not a fully populated curriculum.

## Six interactive learning milestones

- Build AND and OR perceptron decision rules, inspect the live truth table, and test the XOR limitation.
- Explore tensor rank, shape, samples axis and real NumPy-like slicing on small JavaScript arrays.
- Follow the full 2 → 2 → 1 dense forward pass with clickable weighted connections, editable parameters, step-by-step arithmetic, and code view.
- Compare Sigmoid, Tanh, ReLU, Leaky ReLU and vector Softmax with a live graph, gradients and class probabilities.
- Explore the Week 1 AI/ML/Deep Learning hierarchy, classification thresholds, live confusion matrix, precision/recall, regression errors, and concept challenge.
- Edit three inputs, three weights (including negative values), and a bias.
- Choose sigmoid, tanh, ReLU, or linear activation.
- Watch the exact weighted contributions, sum, preactivation, and output update together.
- Compare a manipulable Three.js scene with an accessible SVG diagram.
- Play, pause, jump to, and step through six calculation stages at adjustable speed.
- Inspect a synchronized mathematical expression or equivalent JavaScript code.
- Predict and test the effect of increasing a weight.

## Local development

```bash
npm install
npm run dev
npm test
npm run build
npm run test:e2e
```

Node.js 22+ recommended. `npm test` uses the built-in Node test runner and requires no third-party runtime dependencies. Browser visualization and production build require npm dependencies.

## Architecture

- `src/engine/` pure, deterministic math and timeline; testable without a browser
- `src/store/` Zustand state as single source of truth for controls and renderers
- `src/visuals/` Three.js scene, 2D SVG diagram, activation curve
- `src/components/` accessible controls
- `src/content/` course-aligned modules; future lessons explicitly marked *planned*
- `docs/IMPLEMENTATION_PROGRESS.md` verified checkpoint and next task

The calculation engine executes JavaScript in the browser. The site does **not** run a pretrained neural network, TensorFlow, or Python. All scene values derive from actual neuron calculations. 3D rendering requires WebGL; an SVG mode is provided when WebGL is unavailable.

## Color system

Use the selected green/teal design: `#092328` background, `#12544F` secondary surfaces, `#2A835F` active objects and `#8BBB92` positive highlights. Negative-weight connections additionally use amber for differentiation and have signed numeric labels.

## Curriculum source

The module list follows the *Deep Learning Course Outline — Sukkur IBA University, Khairpur Campus, Fall 2026*. Other modules are shown as planned and are not represented as completed lessons.

## Lecture coverage

The complete seven-lecture requirements are preserved in [`docs/LECTURE_TOPIC_INVENTORY.md`](docs/LECTURE_TOPIC_INVENTORY.md). Use [`docs/LECTURE_IMPLEMENTATION_MATRIX.md`](docs/LECTURE_IMPLEMENTATION_MATRIX.md) to distinguish implemented interactive material from topics awaiting implementation. Implementation/test checkpoints are in [`docs/IMPLEMENTATION_PROGRESS.md`](docs/IMPLEMENTATION_PROGRESS.md).
