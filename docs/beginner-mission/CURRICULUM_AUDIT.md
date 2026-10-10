# Beginner curriculum audit

## Scope and evidence

Inspected the actual catalog, all three authored topic JSON files, generated Python programs and stages, chapter reviews, progress storage, navigation, 2D visual labs and the original neuron scene. Scope: 60 beginner topics in chapters 00–07, 120 worked/transfer cases, 8 mixed chapter reviews and the scalar training project. No intermediate or advanced course has been implemented in this mission.

The original topics already contain definitions, an explanation, relevance, a formula, two cases, a conceptual check, a misconception/debug task, a mini-project and primary reference. The Python calculation engine already produces answers, intermediate stages, grids and curves. Preserve that work.

## Verified gaps and implementation

- Objectives and prerequisite bridges were not shown: each lesson now exposes a goal, topic/chapter prerequisite links and connections to later chapters.
- No supported retrieval history: four per-topic prompt types (concept, formula reconstruction, changed numerical case and misconception repair) require a written attempt before revealing a reference. FSRS starts only after an explicit rating.
- Fixed one-day reminder: the course due-topic filter now reads actual FSRS due cards. Existing guided-practice evidence remains distinct and intact. The legacy one-day helper is retained only for backwards-compatible tests, not used by the new UI.
- No explanation workspace: 60 topic-specific saved drafts with a structured self-review checklist. No keyword scoring or claimed understanding grade.
- No glossary/bookmarks/reload resume: dashboard searches every title and defined term, bookmarks topics and resumes the saved topic/workspace.
- No editable Python: three bounded exercises cover a neuron, repairing the gradient-update sign and NumPy cell multiplication. Existing authored examples remain runnable.
- Weak 3D: selectable neuron and 2–2–1 network, current products/sums/activations, gradient inspection, shared controls and training in the existing backward lab.
- No matrix-cell lab or two-parameter surface: both implemented with linked Python and exact numerical inspectors.
- Markdown lacked math/highlighting: added bounded KaTeX, Python highlighting, nested lists/tables and styled authored callouts.

## Per-topic inventory

“Present” verifies the source fields; it does not certify textbook depth or educational outcomes. Numerical derivations remain the executed staged traces. Added intuition is a chapter-level bridge with an explicit analogy limit, not a claim of a bespoke analogy for every subtopic. The existing mini-projects are self-reviewed.

| ID | Topic | Executed model | Worked / transfer expected | Existing fields | Added learner support |
| --- | --- | --- | --- | --- | --- |
| dl-00-001 | Computers and programs | program | 7 / -7 | Present | Roadmap, prerequisite bridge, hints, 4 recall types, saved explanation, bookmark |
| dl-00-002 | Variables, loops, functions and objects | positive-sum | 5 / 3 | Present | Roadmap, prerequisite bridge, hints, 4 recall types, saved explanation, bookmark |
| dl-00-003 | CPU, RAM, GPU and storage | memory | 24 / 96 | Present | Roadmap, prerequisite bridge, hints, 4 recall types, saved explanation, bookmark |
| dl-00-004 | Loading and cleaning data | clean | 3 / 3 | Present | Roadmap, prerequisite bridge, hints, 4 recall types, saved explanation, bookmark |
| dl-00-005 | Algebra and graphs | line | 7 / -5 | Present | Roadmap, prerequisite bridge, hints, 4 recall types, saved explanation, bookmark |
| dl-00-006 | Probability, mean and variance | variance | 0.6666666666666666 / 0 | Present | Roadmap, prerequisite bridge, hints, 4 recall types, saved explanation, bookmark |
| dl-00-007 | Vectors, matrices and dot products | dot | 5 / 13 | Present | Roadmap, prerequisite bridge, hints, 4 recall types, saved explanation, bookmark |
| dl-00-008 | Derivatives and chain rule | chain | 36 / -8 | Present | Roadmap, prerequisite bridge, hints, 4 recall types, saved explanation, bookmark |
| dl-01-001 | Symbolic versus learned systems | fit-line | 2 / 3 | Present | Roadmap, prerequisite bridge, hints, 4 recall types, saved explanation, bookmark |
| dl-01-002 | Supervised, unsupervised and reinforcement learning | groups | 2 / 1 | Present | Roadmap, prerequisite bridge, hints, 4 recall types, saved explanation, bookmark |
| dl-01-003 | Features, labels and predictions | line | 40 / 50 | Present | Roadmap, prerequisite bridge, hints, 4 recall types, saved explanation, bookmark |
| dl-01-004 | Training, validation and test sets | split | 100 / 100 | Present | Roadmap, prerequisite bridge, hints, 4 recall types, saved explanation, bookmark |
| dl-01-005 | Leakage and split strategies | leakage | 98 / 7 | Present | Roadmap, prerequisite bridge, hints, 4 recall types, saved explanation, bookmark |
| dl-01-006 | Regression and classification | threshold | 1 / 0 | Present | Roadmap, prerequisite bridge, hints, 4 recall types, saved explanation, bookmark |
| dl-01-007 | Confusion matrix, precision, recall and F1 | f1 | 0.6666666666666666 / 0.6666666666666666 | Present | Roadmap, prerequisite bridge, hints, 4 recall types, saved explanation, bookmark |
| dl-01-008 | Bias, variance and generalization | gap | 0.7 / 0.1 | Present | Roadmap, prerequisite bridge, hints, 4 recall types, saved explanation, bookmark |
| dl-01-009 | Neural-network history | history | 1958 / 2012 | Present | Roadmap, prerequisite bridge, hints, 4 recall types, saved explanation, bookmark |
| dl-02-001 | Biological analogy limitations | line | 7 / -2 | Present | Roadmap, prerequisite bridge, hints, 4 recall types, saved explanation, bookmark |
| dl-02-002 | Perceptron and XOR | perceptron | 3 / 1 | Present | Roadmap, prerequisite bridge, hints, 4 recall types, saved explanation, bookmark |
| dl-02-003 | Weights and biases | dense | 7 / -5 | Present | Roadmap, prerequisite bridge, hints, 4 recall types, saved explanation, bookmark |
| dl-02-004 | Linear layers | dense | -3 / 1 | Present | Roadmap, prerequisite bridge, hints, 4 recall types, saved explanation, bookmark |
| dl-02-005 | Sigmoid, tanh, ReLU and leaky ReLU | activations | -0.2 / 2 | Present | Roadmap, prerequisite bridge, hints, 4 recall types, saved explanation, bookmark |
| dl-02-006 | Stable softmax | softmax | 0.2689414213699951 / 0.5 | Present | Roadmap, prerequisite bridge, hints, 4 recall types, saved explanation, bookmark |
| dl-02-007 | Initialization | he | 1 / 0.5 | Present | Roadmap, prerequisite bridge, hints, 4 recall types, saved explanation, bookmark |
| dl-03-001 | Shape, rank and dtype | memory | 24 / 96 | Present | Roadmap, prerequisite bridge, hints, 4 recall types, saved explanation, bookmark |
| dl-03-002 | Broadcasting | broadcast | 22 / 6 | Present | Roadmap, prerequisite bridge, hints, 4 recall types, saved explanation, bookmark |
| dl-03-003 | Indexing and slicing | slice | 50 / 30 | Present | Roadmap, prerequisite bridge, hints, 4 recall types, saved explanation, bookmark |
| dl-03-004 | Memory layout and views | view | 13 / 4 | Present | Roadmap, prerequisite bridge, hints, 4 recall types, saved explanation, bookmark |
| dl-03-005 | float16, float32 and float64 | precision | 4096 / 4097 | Present | Roadmap, prerequisite bridge, hints, 4 recall types, saved explanation, bookmark |
| dl-03-006 | Device placement | device | 0 / 1 | Present | Roadmap, prerequisite bridge, hints, 4 recall types, saved explanation, bookmark |
| dl-03-007 | Autograd graphs | autograd | 12 / -4 | Present | Roadmap, prerequisite bridge, hints, 4 recall types, saved explanation, bookmark |
| dl-04-001 | Dense layer shapes | dense-shape | 8 / 6 | Present | Roadmap, prerequisite bridge, hints, 4 recall types, saved explanation, bookmark |
| dl-04-002 | Batch axis | dense-shape | 2 / 6 | Present | Roadmap, prerequisite bridge, hints, 4 recall types, saved explanation, bookmark |
| dl-04-003 | Matrix multiplication | matmul | 22 / -2 | Present | Roadmap, prerequisite bridge, hints, 4 recall types, saved explanation, bookmark |
| dl-04-004 | Layer composition | compose | 11 / 1 | Present | Roadmap, prerequisite bridge, hints, 4 recall types, saved explanation, bookmark |
| dl-04-005 | Logits versus probabilities | softmax | 0.7310585786300049 / 0.2689414213699951 | Present | Roadmap, prerequisite bridge, hints, 4 recall types, saved explanation, bookmark |
| dl-04-006 | Training versus inference | dropout | 4 / 0 | Present | Roadmap, prerequisite bridge, hints, 4 recall types, saved explanation, bookmark |
| dl-05-001 | MSE and MAE | mse | 2.5 / 2 | Present | Roadmap, prerequisite bridge, hints, 4 recall types, saved explanation, bookmark |
| dl-05-002 | Binary and categorical cross entropy | bce | 0.2231435513142097 / 1.6094379124341003 | Present | Roadmap, prerequisite bridge, hints, 4 recall types, saved explanation, bookmark |
| dl-05-003 | Stable logits losses | logit-loss | 1000 / 1000 | Present | Roadmap, prerequisite bridge, hints, 4 recall types, saved explanation, bookmark |
| dl-05-004 | Gradient descent | gd | 1.6 / -1.6 | Present | Roadmap, prerequisite bridge, hints, 4 recall types, saved explanation, bookmark |
| dl-05-005 | SGD, momentum and Adam | optimizers | 1.51 / 2.31 | Present | Roadmap, prerequisite bridge, hints, 4 recall types, saved explanation, bookmark |
| dl-05-006 | Learning-rate schedules | schedule | 0.025 / 0.025 | Present | Roadmap, prerequisite bridge, hints, 4 recall types, saved explanation, bookmark |
| dl-05-007 | Epochs and mini-batches | batches | 6 / 4 | Present | Roadmap, prerequisite bridge, hints, 4 recall types, saved explanation, bookmark |
| dl-06-001 | Local derivatives | derivative | 4 / -4 | Present | Roadmap, prerequisite bridge, hints, 4 recall types, saved explanation, bookmark |
| dl-06-002 | Chain rule | chain | 8 / -16 | Present | Roadmap, prerequisite bridge, hints, 4 recall types, saved explanation, bookmark |
| dl-06-003 | Output and hidden deltas | hidden-delta | 9 / 0 | Present | Roadmap, prerequisite bridge, hints, 4 recall types, saved explanation, bookmark |
| dl-06-004 | Parameter gradients | weight-gradient | 18 / 6 | Present | Roadmap, prerequisite bridge, hints, 4 recall types, saved explanation, bookmark |
| dl-06-005 | Automatic differentiation | autograd | 12 / 12 | Present | Roadmap, prerequisite bridge, hints, 4 recall types, saved explanation, bookmark |
| dl-06-006 | Finite differences | finite-difference | 4 / -2 | Present | Roadmap, prerequisite bridge, hints, 4 recall types, saved explanation, bookmark |
| dl-06-007 | Vanishing and exploding gradients | depth | 0.0625 / 16 | Present | Roadmap, prerequisite bridge, hints, 4 recall types, saved explanation, bookmark |
| dl-07-001 | Dataset loaders and training loops | batches | 3 / 4 | Present | Roadmap, prerequisite bridge, hints, 4 recall types, saved explanation, bookmark |
| dl-07-002 | Batching and shuffling | batches | 3 / 2 | Present | Roadmap, prerequisite bridge, hints, 4 recall types, saved explanation, bookmark |
| dl-07-003 | Regularization and weight decay | weight-decay | 1.9 / -1.9 | Present | Roadmap, prerequisite bridge, hints, 4 recall types, saved explanation, bookmark |
| dl-07-004 | Dropout | dropout | 4 / 0 | Present | Roadmap, prerequisite bridge, hints, 4 recall types, saved explanation, bookmark |
| dl-07-005 | Batch normalization | batchnorm | -2 / -1 | Present | Roadmap, prerequisite bridge, hints, 4 recall types, saved explanation, bookmark |
| dl-07-006 | Initialization in training | he | 0.7071067811865476 / 0.3535533905932738 | Present | Roadmap, prerequisite bridge, hints, 4 recall types, saved explanation, bookmark |
| dl-07-007 | Early stopping | early-stop | 2 / 1 | Present | Roadmap, prerequisite bridge, hints, 4 recall types, saved explanation, bookmark |
| dl-07-008 | Checkpoints | checkpoint | 6 / -3 | Present | Roadmap, prerequisite bridge, hints, 4 recall types, saved explanation, bookmark |
| dl-07-009 | Training diagnostics | gap | 0.85 / 0.05 | Present | Roadmap, prerequisite bridge, hints, 4 recall types, saved explanation, bookmark |

## Progression and evidence boundaries

Understand terms and intuition → observe the worked trace → interact with current parameters → predict before reveal → check both cases and a reason → recall later with FSRS → explain and apply in a mini-project or training project. Guided correctness, self-rated recall, written drafts and chapter-review passes are separate evidence. None alone proves retained mastery. Numeric prompts use the already-validated canonical transfer cases; changed sandbox inputs do not earn course criteria.

## Learning research

Primary sources: Karpicke & Roediger (2008), https://pubmed.ncbi.nlm.nih.gov/18276894/ ; Karpicke & Bauernschmidt (2011), https://pubmed.ncbi.nlm.nih.gov/21574747/ ; replication and spacing analysis (2016), https://pubmed.ncbi.nlm.nih.gov/26674128/ . These support retrieval with delayed practice as a design rationale. Applying those findings to this particular app is a design inference; no learner study or measured retention improvement has been performed. FSRS uses default parameters, not individually trained parameters.
