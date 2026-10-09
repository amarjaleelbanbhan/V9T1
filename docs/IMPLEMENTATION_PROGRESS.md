# Current implementation checkpoint

See [BEGINNER_COMPLETION.md](BEGINNER_COMPLETION.md) for the current 60-topic beginner path, verification and boundaries. PRs #8–12 supersede the historical implementation counts and green palette below.

---

## Historical checkpoint (preserved for provenance)

# NeuralLab implementation checkpoint — 2026-10-09

## GitHub scope
- Repository: `amarjaleelbanbhan/V9T1`.
- **PR #4 merged to `main`** as commit `d52a17ea27ddf77d837018c90e9ccc5c8a37f08f` after all checks passed.
- New branch: `feat/backprop-chain-rule-lab`, draft PR #5: https://github.com/amarjaleelbanbhan/V9T1/pull/5 — **not merged**.
- The supplied seven-lecture summary is preserved in `docs/LECTURE_TOPIC_INVENTORY.md`; a topic-by-topic coverage matrix is in `docs/LECTURE_IMPLEMENTATION_MATRIX.md`. The actual PPT source decks were not individually inspected.
- Preserve approved emerald/teal design, Vite/React/TypeScript/Three.js and independent pure math engines.

## Implemented and tested — eight interactive labs

1. AI/ML/DL Foundations: nested family, classification/regression, confusion matrix, precision/recall, MAE/MSE.
2. Artificial Neuron: 2D/3D, edit inputs/weights/bias, numerical trace and activation/challenges.
3. Perceptron & Logic Gates: AND/OR truth tables, step output, editable weights, XOR concept check.
4. Tensor & Slicing: scalar/vector/matrix/3D batch, rank, shapes, indexing and exclusive-end slicing.
5. Forward Propagation: editable 2→2→1 dense model, weight inspector and layer arithmetic.
6. Activation Functions: Sigmoid, Tanh, ReLU, Leaky ReLU, stable vector Softmax.
7. Loss & Gradient Descent: half-squared loss, L(w)=w², real derivative and step timeline.
8. **NEW Backpropagation & Chain Rule**: reuse exact denseForward trace; half-squared error; output/hidden chain-rule deltas; gradients for every weight and bias; reverse-flow SVG; inspectable selected connections; adjustable input/target/learning rate and parameter sliders; one **real single-example** full-network update with before/after loss.

**Important scope:** eight interactive labs does NOT mean the entire seven-lecture program is implemented or validated.

## Verification
The fully executed CI run for `68cba7d20c88f363c6d8cb462b6ea1d52a812a9f` is successful:
https://github.com/amarjaleelbanbhan/V9T1/actions/runs/37955635021

- **49/49** Node numerical tests passed (new backprop tests include independently derived chain-rule examples, central finite differences for every weight and bias, zero ReLU subgradient, a valid training update and invalid cases).
- **18/18** Chromium browser tests passed, including new gradient selection, training update and 390px mobile viewport.
- TypeScript checks and production Vite build passed.
- The first browser run found a test formatting mismatch: graph displays four decimal places (0.5399), while the test expected three (0.54). Test corrected and full re-run passed.
- Still outstanding: real-device screenshot review, comprehensive WCAG audit, performance benchmarks, full curriculum review against actual teacher PowerPoints, public deployment.

## Mathematical conventions
- A single scalar output and half-squared error: L=½(ŷ−y)².
- Output delta: δ_out=(ŷ−y) × sigmoid′(z_out).
- Hidden delta: δ_h=ReLU′(z_h) Σ (output-weight × output-delta).
- Weight gradient: ∂L/∂w=δ × layer source activation; bias gradient=δ.
- ReLU at exactly z=0 is non-differentiable; the implementation explicitly chooses zero subgradient.
- Update: parameter ← parameter − η×gradient. A single example, single step is not a full training pipeline.
- Analytic gradients verified against central finite differences; default model updates reduce default-sample loss.
- The computation is pure TypeScript; nothing here claims PyTorch, NumPy, Keras or TensorFlow model training.

## Next milestone
**Vanishing & exploding gradient visualizer (Lecture 05 slides 1–17)**: demonstrate repeated chain-rule products across increasing depths, activation choices and corresponding gradient magnitudes. Use numerical examples that distinguish saturation, zero ReLU gradients and non-saturating behavior; include proper educational limits and automated tests.

**Parallel later syllabus milestone**: CNN convolution/pooling (Week 8); after that a genuinely trained ANN with train/test split, loss/accuracy plots, then MNIST and IMDB workflows. Additional unresolved topics remain in coverage matrix.

Continue the established inspect → implement → test → fix → verify → checkpoint workflow. Work on new feature branches after review/merge; do not automatically merge new PRs or rewrite stable modules.

