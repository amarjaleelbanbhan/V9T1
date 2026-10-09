# Full lecture coverage and implementation map

Source: `docs/LECTURE_TOPIC_INVENTORY.md` (user-supplied summary of seven lecture sets, 550 lines). The **original PowerPoint slide decks were not uploaded here**. The source inventory preserves the individual numbered topics and slide ranges; this file maps them to product work.

## Status labels

- **Interactive**: a tested computation/view exists in NeuralLab.
- **Partial**: representative concepts are interactive; listed lecture subtopics remain.
- **Planned**: requirements recorded, no claim of interactive implementation.

| Lecture and original topic cluster | NeuralLab coverage | Status | Next implementation |
|---|---|---|---|
| Lecture 01 slides 2–3: Data, Cambridge Analytica, privacy | AI/ML/DL foundations introduction only | Planned | Data-value/privacy decision simulation, with sourced ethical case context |
| Lecture 01 slides 4–7: Symbolic AI, expert systems, AI–ML–DL | Nested AI ⊃ ML ⊃ DL visual | Partial | Rule-based vs learned-decision comparison |
| Lecture 01 slides 8–9: Traditional programs, learned patterns, RGB vs HSV | ML prediction examples | Partial | Rule-to-data pipeline and RGB↔HSV model |
| Lecture 01 slides 10–12: Layered representations and digit recognition | 2→2→1 forward network | Partial | Hierarchical feature visualizer |
| Lecture 01 slides 13–16: Training loop, weights, loss, optimizer | Neuron and forward pass | Partial | Actual gradient, loss and update cycle |
| Lecture 01 slides 17–25: DL achievements, chronology, GPU, open-source frameworks | Inventory recorded | Planned | Concise interactive timeline and hardware trade-offs |
| Machine Learning Foundations slides 3–8: Supervised, unsupervised, reinforcement | Classification/regression task explorer | Partial | Clustering and reward/agent lab |
| Machine Learning Foundations slides 9–15: Confusion matrix, precision, recall, imbalance | Live 2×2 confusion matrix, TP/TN/FP/FN, accuracy, precision and recall driven by threshold | Partial | Class imbalance and explicit precision/recall trade-off study |
| Machine Learning Foundations slides 16–25: MNIST, Keras Dense, compile, train, evaluate | Inventory recorded | Planned | Pixel-grid 28×28, preprocessing, then training in browser only when genuine |
| Chapter 2 slides 3–8: First ANN and overfitting | Small fixed-weight forward pass | Partial | Mini dataset training and overfit comparison |
| Chapter 2 slides 9–15: Rank, shape, dtype, slicing, real-world tensor shapes | Interactive scalar/vector/matrix/batch rank, shape and slicing | Partial | dtype, larger ranks and image crops |
| Lecture 03 slides 1–25: Tensor dimensions, MNIST shapes, slicing, batches, real-world shapes | Interactive shape/rank, sample axis and slicing | Partial | 4D/5D, batch creation, image arrays |
| Lecture 03 slides 26–37: Artificial neurons, dot product, layers, nonlinear activation | Neuron, activation explorer, dense forward pass | Partial | NumPy-parallel code and deeper layers |
| Complete Neuron Story slides 2–5: Biological neuron anatomy and analogy | Inventory recorded | Planned | Interactive dendrite/soma/axon/synapse mapped to artificial neuron |
| Complete Neuron Story slides 6–13: Weights, bias, net input, ReLU | Interactive neuron, all relevant arithmetic | Interactive | Add detailed lecture-specific guided challenges |
| Complete Neuron Story slides 14–17: Perceptron and AND/OR truth tables | Interactive binary perceptron with AND/OR presets, editable weights/bias, all four truth-table rows and XOR challenge | Interactive | Expand to guided manual calculations |
| Complete Neuron Story slides 18–24: Neuron→layer→network, forward pass | 2→2→1 network with editable edges and step inspector | Interactive | Additional preset networks |
| Complete Neuron Story slide 25: Half squared error | Inventory recorded | Planned | Loss explorer |
| Lecture 04 slides 2–3: Forward propagation | Editable 2→2→1 network and trace | Interactive | More cases and independently reviewed examples |
| Lecture 04 slides 4–20: Error, derivatives, GD, chain rule, backprop | Inventory recorded | Planned | Numerical gradient descent and chain-rule reverse pass |
| Lecture 05 slides 1–17: Sigmoid derivatives, vanishing gradients | Scalar activation derivatives | Partial | Multiplicative chain gradient explorer and vanishing-gradient visual |
| Lecture 05 slides 18–64: ANN train/test, Keras, BCE, epochs, accuracy and loss graphs | Inventory recorded | Planned | Small real trained model, split controls, validation curve |
| Lecture 05 slides 65–93: IMDB vectors, multi-hot, 10K features, Dense model, overfitting | Inventory recorded | Planned | Review token vectorization, sentiment classification and validation experiment |

## Lecture-order delivery queues

**Queue A — Exam mathematical intuition:** Half squared loss; numerical gradient descent; chain-rule backprop and vanishing gradients. Basic confusion matrix, precision and recall are now interactive, but class-imbalance experiments remain pending. Perceptron AND/OR gates are now implemented and verified. These build directly on accepted neuron and forward-pass labs.

**Queue B — Data and applied ML:** Tensor dtypes / 4D–5D shapes / MNIST preprocessing; classification paradigms; train/test splitting and data leakage; minibatch training; real loss/accuracy plots and generalization checks.

**Queue C — Broader history and real-world context:** Data and privacy, symbolic AI vs learned systems, RGB/HSV representations, history/hardware, biological analogy, actual MNIST and IMDB studies.

## Important implementation constraints

- This is an acceptance inventory, **not a statement that every bullet is already interactive**.
- Do not imply Keras, TensorFlow, PyTorch, MNIST or IMDB datasets are executed or loaded when only illustrative examples are used.
- Calculated mathematical values must derive from testable functions, not hardcoded SVG displays.
- Preserve the current React/Three.js stack and emerald design palette.
- Each new interactive cluster needs working controls, concept-check exercise, and unit/browser tests; move its row toward *Interactive* only after verification.
