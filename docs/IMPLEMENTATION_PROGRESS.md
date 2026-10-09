# NeuralLab implementation checkpoint

## Repository and architectural baseline

- Repository: `amarjaleelbanbhan/V9T1`, branch: `feat/neurallab-foundation`; base branch `main` remains unchanged until the draft PR is reviewed.
- On 2026-10-09 the baseline had only a six-byte README. The approved React 19/Vite/TypeScript, Three.js/React Three Fiber, Zustand and green/teal design are in the feature branch.
- Browser-based mathematical simulations are written in JavaScript/TypeScript. No Python or TensorFlow execution is claimed.
- User-provided Sukkur IBA Fall 2026 Deep Learning outline governs the module order and subject coverage. Added teaching datasets are explicitly illustrative.

## Verified foundation milestones

**3 / 6 foundation chunks accepted.**

1. **Accepted — Interactive artificial neuron (Week 2).** Edit inputs, weights, bias and activation; inspect 3D/2D, calculations, code, stage timeline and predictive challenge.
2. **Accepted — Visual foundations (Week 1).** Interactive nested AI ⊃ ML ⊃ Deep Learning family map, classification threshold with accuracy/confusion counts, regression line and MAE/MSE, conceptual challenge, mobile navigation.
3. **Accepted — Activation explorer (Week 4).** Compare Sigmoid, Tanh, ReLU and Leaky ReLU on a shared plot, examine input/output and mathematical derivative (including undefined derivative at zero), and manipulate a three-class numerically stable vector Softmax.
4. **Pending — Multi-layer forward propagation (Weeks 3–4).** Build a small dense network engine and inspectable layer-by-layer visualization.
5. **Pending — Backpropagation, loss and optimizers (Weeks 3–7).**
6. **Pending — CNN operations (Week 8), including convolution, filter/kernel, stride, padding and pooling.**

Future syllabus topics (advanced CNN case studies, text preprocessing, RNN/LSTM/GRU and Transformers) are planned, not falsely presented as ready.

## Verified checks (2026-10-09)

- CI run for code commit `0a0b5f63827b5a4e5cd9b26c4d9c540f33b7b0d3`: https://github.com/amarjaleelbanbhan/V9T1/actions/runs/37944811233
- Node.js unit tests: **18/18 passed**, including 7 original neuron/timeline cases, 6 Week 1 cases and 5 activation function cases.
- TypeScript check + Vite production build: **passed**.
- Playwright Chromium browser tests: **7/7 passed**. Coverage includes neuron parameter updates, timeline/2D view, challenge correctness for negative inputs and ReLU, Week 1 task switching and metrics, activation/Softmax interactions, and three mobile viewport checks.
- No browser page errors were observed in tests that explicitly capture page errors.
- **Not yet verified:** manual screenshot inspection on physical devices, full WCAG accessibility audit, graphics performance benchmarking, or deployment to a public URL. Browser smoke tests do not establish all of these.

## Defects identified and corrected

- Unused TypeScript import blocked initial production build — corrected.
- Ambiguous browser selector matched both a dropdown and a graph — corrected.
- Three.js HTML labels caused a DOM unmount error when switching 3D to 2D — replaced with texture sprites.
- Neuron prediction challenge previously assumed sigmoid and positive input — now computes the actual counterfactual from the shared neuron engine and supports increased/decreased/unchanged output.

## Design and implementation boundaries

- Preserve chosen emerald/teal theme: `#092328` background, `#12544F` surface, `#2A835F` primary and `#8BBB92` highlight.
- Prefer 2D SVG for threshold diagrams and activation graphs; only use 3D where it teaches structure better.
- All learning values derive from pure tested math functions, never from hardcoded animation-only numbers.
- No backend, account system or saved progress yet.
- Keep future lessons visually marked planned until functional and tested.

## Next executable task

**Chunk 4: Multi-layer forward propagation.** Implement a two-layer, small fixed-topology network with editable inputs/weights/biases. Build a pure, deterministic engine that exposes every multiplication, sum, preactivation and postactivation per neuron. Map the trace to an accessible interactive layer diagram and a step timeline. Connect mathematical formulas and numerical output to the same trace. Add unit tests with independently worked examples and browser tests for controls, navigation, and mobile behavior. Do not begin backpropagation until the forward pass is verified.

Work cycle: inspect → implement → run → test → inspect → fix → verify → checkpoint.
