# NeuralLab — implementation checkpoint

## Source and branch

- Source files: `docs/LECTURE_TOPIC_INVENTORY.md` (all seven user-supplied lecture summaries, each numbered topic and slide-range preserved) and `docs/LECTURE_IMPLEMENTATION_MATRIX.md` (verified / partial / pending mapping).
- The uploaded outline is a topic summary; the original PowerPoint decks have **not** been individually inspected.
- New work: `feat/lecture-labs` → draft PR #3 against `main`: https://github.com/amarjaleelbanbhan/V9T1/pull/3
- Previous foundation PRs #1 and #2 were already merged to `main` before this branch started.
- Approved emerald/teal design and existing React + Three.js stack are preserved.

## Verified interactive foundation chunks

**6 / 8 expanded foundation chunks accepted** (this is not 6/8 of the entire seven-lecture syllabus).

1. **Week 1 foundations:** Nested AI, ML, DL visual; classification threshold experiment; regression/MAE/MSE.
2. **Artificial neuron:** 3D and SVG visualizations, input/weight/bias sliders, activation plot, stage timeline, math/code/challenge.
3. **Activation functions:** Sigmoid, Tanh, ReLU, Leaky ReLU and stable vector Softmax; curves and derivatives.
4. **Forward propagation:** Actual 2→2→1 network, clickable and separately selectable weighted connections, editable weights/biases/inputs, neuron-level contribution traces, stage inspector and conceptual check.
5. **Tensor representations:** Scalar, vector, matrix, 3D stack; rank, shape, sample indexing and real exclusive-stop slicing with an interactive crop view.
6. **Binary perceptron:** Step activation, AND/OR presets, all four input combinations, editable weights/biases, live truth table and XOR limitation challenge.
7. **Pending:** Full loss/backpropagation/gradient descent/optimizer laboratories.
8. **Pending:** CNN convolutions, padding, stride, kernels and pooling.

Topics outside these chunks — full model evaluation, real MNIST/Keras training, tensor dtypes/4D–5D, biological anatomy, vanishing gradients, train/validation/test, ANN classification workflows, IMDB review preprocessing and modeling, history/ethics — remain tracked as partially complete or planned in the lecture coverage matrix.

## Verification

Successful full-code CI: https://github.com/amarjaleelbanbhan/V9T1/actions/runs/37948019566

- **34/34 Node mathematical unit tests passed.**
- **13/13 Playwright Chromium browser interaction tests passed.**
- **TypeScript type check + Vite production build passed.**
- Checks include narrow mobile layouts for all new labs and existing neuron/foundations/activation regressions.
- Important limits: physical-device screenshot review, comprehensive accessibility audit, real WebGL performance benchmarks, production deployment, and educational review against original slide decks remain outstanding.

## Defect fixes

- Prior issues: unused TypeScript imports, ambiguous activation test selector, 3D HTML overlay DOM unmount bug, neuron prediction challenge that incorrectly assumed increasing weights always raised output.
- Current chunk: unused icon import blocked initial forward build; repaired. Intersecting SVG connection labels intercepted clicks; added an explicit keyboard/touch-friendly connection selector and made label overlays noninteractive. An ambiguous tensor quiz test locator was scoped to the exact answer.

## Mathematical architecture

- Pure deterministic TypeScript computation, independent of rendering.
- **Forward**: validated finite dense weights, inputs/biases, all contributions and layer outputs; independent tests.
- **Tensor**: rectangular shape validation, explicit axis indexing, exclusive-stop slicing, sample selection; not NumPy.
- **Perceptron**: threshold at z ≥ 0, real logic table; manually specified weights, not an actual training process.
- No backend is needed yet. No fake TensorFlow/Keras execution claims. Future modules remain labeled **planned** in sidebar.

## Next executable task

**Course-aligned model evaluation:** Extend Week 1 with an interactive 2×2 confusion matrix, precision = TP/(TP+FP), recall = TP/(TP+FN), and class imbalance examples. Handle undefined metrics correctly when denominators are zero. Test against independently verified examples and browser interactions.

Then implement half squared loss and numerical gradient descent, followed by chain-rule backpropagation, vanishing gradients and actual ANN training experiments. Update coverage matrix only after each lesson's tests pass.
