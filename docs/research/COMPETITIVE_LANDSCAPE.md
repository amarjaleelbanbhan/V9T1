# Competitive landscape — interactive deep-learning education, October 2026

Research date: 2026-10-10. All claims are sourced; where a claim comes from secondary coverage
rather than a primary artefact it is marked **[secondary]**. Marketing copy is excluded — only
demonstrated functionality is recorded.

Companion documents: [INNOVATION_OPPORTUNITIES.md](./INNOVATION_OPPORTUNITIES.md) turns the gaps
found here into ranked proposals; [ARCHITECTURE_REVIEW.md](../engineering/ARCHITECTURE_REVIEW.md)
records what NeuralLab can already do.

---

## 1. How this market is actually shaped

The category that NeuralLab sits in is not "learning management systems". It is three loosely
connected traditions:

1. **Single-concept explainers** — one model, one page, one deep interaction loop. Georgia Tech's
   Polo Club has effectively defined the genre (CNN Explainer, Diffusion Explainer, Transformer
   Explainer). They are beautiful, free, open source, and each covers exactly one topic.
2. **Hyperparameter sandboxes** — TensorFlow Playground and its descendants. One screen, immediate
   feedback, no curriculum, no assessment, outgrown in days.
3. **Linear courses with notebooks** — d2l.ai, Karpathy's *Neural Networks: Zero to Hero*, fast.ai.
   Deep and rigorous, but the interaction is "read, then run a notebook elsewhere".

Nobody occupies the intersection: **a sequenced curriculum where every step is both executable and
assessed, inside one application**. That intersection is where NeuralLab already is. The strategic
finding of this research is not that NeuralLab needs new features to be different — it is that
NeuralLab is already differentiated and is under-executing on the thing that differentiates it.

---

## 2. Competitive intelligence matrix

### 2.1 Single-concept explainers

**CNN Explainer** — <https://poloclub.github.io/cnn-explainer/>
| | |
|---|---|
| Target user | Beginners taking a first step into CNNs |
| Core functionality | Interactive walkthrough of a trained CNN classifying an image, layer by layer down to individual convolution windows |
| Design strengths | Fluid movement between a whole-network overview and a single-kernel detail view; the elastic-overview-to-detail transition is the mechanic worth studying |
| Technical strengths | Runs a real trained model in-browser; TVCG 2020 paper with evaluation |
| Weaknesses | One architecture, one dataset, frozen weights — you cannot train, break, or extend it |
| Open source | Yes (poloclub/cnn-explainer) |
| Gap | No sequencing, no assessment, no learner state |
| Opportunity for NeuralLab | Its zoom-between-levels interaction is directly transferable to the neuron → layer → network scale NeuralLab already models |

**Diffusion Explainer** — <https://poloclub.github.io/diffusion-explainer/>
| | |
|---|---|
| Target user | Non-experts curious about Stable Diffusion |
| Core functionality | Visual overview of Stable Diffusion's components with drill-down explanations; prompt and hyperparameter editing without installation |
| Design strengths | Timestep-based animation as the primary navigation device; smooth abstraction-level changes |
| Technical strengths | Browser-delivered, no GPU required |
| Weaknesses | Pre-computed trajectories for a fixed prompt set rather than arbitrary generation |
| Open source | Yes, github.com/poloclub/diffusion-explainer |
| Reach | Reported >7 200 users across 113 countries **[secondary: 2024 paper coverage]** |
| Gap / opportunity | Demonstrates that a *fixed, pre-computed* interactive trajectory is pedagogically acceptable — relevant to NeuralLab's "replay a training run" proposals |

**Transformer Explainer** — <https://poloclub.github.io/transformer-explainer/>
| | |
|---|---|
| Target user | Non-experts learning how an LLM predicts the next token |
| Core functionality | A **live GPT-2 running locally in the browser**; users type their own text, adjust temperature, and watch internals update in real time |
| Design strengths | Sankey-style token flow; real-time temperature manipulation that visibly changes the output distribution |
| Technical strengths | Full model inference client-side, no backend |
| Weaknesses | GPT-2 only; no training, no gradients, no assessment |
| Open source | MIT |
| Reach / provenance | IEEE VIS 2024 poster → AAAI 2025 (125 000 users reported) → full paper at CHI '26, Barcelona, April 2026 **[secondary]**; co-developed with IBM Research |
| Gap | Inference only — a learner never sees a weight change |
| Opportunity | Proof that in-browser inference of a real model at this scale is viable in 2026, which de-risks NeuralLab's chapter 12 |

The CHI '26 paper makes a point worth quoting in spirit: this family of tools has **not** converged
on a single design pattern — different model families demand different visualisation and
interaction techniques. That is an argument against NeuralLab building one generic "visualise
anything" renderer.

**llm-viz / LLM Visualization** — <https://bbycroft.net/llm>, github.com/bbycroft/llm-viz
| | |
|---|---|
| Core functionality | A full GPT-style transformer rendered as a navigable 3D scene with real minGPT demo weights (a toy model that sorts A/B/C) |
| Design strengths | The strongest existing argument that 3D can carry real meaning: the third dimension encodes tensor shape, so *size and arrangement are the explanation* |
| Technical strengths | ~5.5k stars, TypeScript, custom WebGL renderer **[secondary]** |
| Weaknesses | Guided walkthrough rather than open experimentation; heavy; no training, no assessment |
| Open source | MIT, with the author's homepage and third-party assets carved out — check paths before vendoring |
| Opportunity | **This is the benchmark NeuralLab's 3D should be measured against.** llm-viz earns 3D because the geometry *is* the data layout; NeuralLab's current scene places six spheres in a mostly empty volume and earns nothing |

### 2.2 Hyperparameter sandboxes

**TensorFlow Playground** — <https://playground.tensorflow.org>
| | |
|---|---|
| Target user | Anyone, first 60 minutes of neural networks |
| Core functionality | Train a small MLP on 2-D toy datasets; live decision boundary, per-neuron feature visualisation |
| Design strengths | Still the best "change one thing, see the consequence immediately" loop in the field. Every control is on one screen |
| Technical strengths | Its own small TypeScript feedforward implementation — not TensorFlow.js; Apache-2.0, ~13k stars |
| Weaknesses | Google's own documentation states it is **not an official Google product and is not supported by Google**; the repository has **no tagged releases** — stable but frozen. No model export, no real data, no curriculum, no assessment |
| Gap | Intuition only. Nothing explains *why*; nothing checks whether you learned |
| Opportunity | Its immediacy is the bar NeuralLab's labs must clear. NeuralLab currently fails that bar by routing a 2 × 3 + 1 calculation through an 11 MB runtime |

**Deeper Playground** — <https://deeperplayground.org/> — a fork adding features and switching the
classification objective from squared loss to log loss; the author notes the change is invisible in
the UI. A useful cautionary example: a correctness improvement nobody can see is not a product
improvement. **[secondary]**

**NeuroViz** — <https://neuroviz.org>, arXiv:2605.02044 (Sharma & Rawassizadeh, v1 2026-05-03, v2 2026-05-23)
| | |
|---|---|
| Core functionality | Real-time exploration of fully connected network training: architecture, activations, learning rate and dataset are adjustable; shows weight updates **and** activation signals across forward *and backward* passes, comparing pre- and post-update state within an epoch |
| Evidence | User study, n = 31, compared against six established tools: SUS **80.97**, clarity rank 2.47, usefulness 2.23; >70 % reported substantially increased perceived training transparency |
| Weaknesses | Research prototype; no curriculum, assessment, or persistence; sustainability unknown |
| Why it matters most | **This is the closest direct competitor to NeuralLab's core claim, it is five months old, and it has published usability evidence NeuralLab does not have.** Its pre/post-update comparison within an epoch is precisely the "Gradient Descent Time Machine" idea — already built and evaluated by someone else |

**Neural Network Journey** (nn-visualizer.onrender.com) and **NeuralCanvas**
(github.com/queenjj11/NeuralCanvas) — two 2025–26 hobby/indie 3D trainers. Both render spheres as
neurons with activation-mapped intensity and weight-mapped connection thickness; NeuralCanvas
supports Iris/Wine/Digits/Two-Moons. Neither has curriculum or assessment; maintenance and
longevity unverified. **[secondary]** They establish that "3D neurons as glowing spheres" is now a
commodity visual, not a differentiator — relevant to NeuralLab's current `NeuronScene`.

### 2.3 Model inspection tools (adjacent, not competing)

- **Netron** — architecture viewer for real model files across frameworks. Layer-level, static, no
  learning scaffolding. Complements rather than competes.
- **TensorBoard** — training metrics and computational graphs down to single operations. Aimed at
  practitioners with a training job already running.
- **iNNspector** (arXiv:2407.17998) — visual deep-model debugging; extends architecture views with a
  higher-order graph relating *model generations* to each other. **The "compare lineages of models"
  idea is the most transferable research mechanic found in this review** and underpins the branching
  proposal in [INNOVATION_OPPORTUNITIES.md](./INNOVATION_OPPORTUNITIES.md).
- **ActiVis**, **DeepEyes** — expert-facing activation inspection and training monitoring.

### 2.4 Curricula and textbooks

- **d2l.ai (Dive into Deep Learning)** — the source NeuralLab already cites throughout its lesson
  documents. Rigorous, free, multi-framework, notebook-driven. Its interaction model is "read, then
  run elsewhere"; there is no in-page assessment and no state.
- **Karpathy, *Neural Networks: Zero to Hero* / micrograd** — MIT licensed; micrograd is a scalar
  autograd engine small enough to read end to end, then makemore, then GPT from scratch. The
  pedagogical gold standard for *building up from one scalar derivative*, delivered as video +
  notebooks. **Directly relevant**: NeuralLab's chapters 02–06 cover the same ladder but
  interactively — this is the clearest "same content, different medium" comparison in the market.
- **neuralnetworksanddeeplearning.com** (Nielsen) — the canonical free interactive book; still the
  default recommendation alongside Playground.
- **fast.ai** — top-down, practitioner-first. Opposite pedagogical philosophy to NeuralLab's
  bottom-up numerical approach; worth knowing, not worth copying.

### 2.5 Authoring and runtime infrastructure (reusable, not competitive)

- **JupyterLite** — a full JupyterLab distribution in the browser on Pyodide, kernel in a Web
  Worker, served as cacheable static files, no application server. Supports ipywidgets, matplotlib,
  plotly, altair, bqplot.
- **marimo** (`marimo export html-wasm`, marimo.app) — reactive Python notebooks running entirely
  client-side on Pyodide. Education is a stated primary use case. **Its reactivity claim is directly
  relevant**: code, outputs and program state are always consistent, which removes the
  out-of-order-execution failure that plagues students in classic notebooks.
- Both come with the same honest caveat that applies to NeuralLab: Pyodide has limited compute and
  limited package coverage, and is **not suited to modern ML workflows** — it is suited to exactly
  the small deterministic teaching computations NeuralLab already runs. NeuralLab's scope choice is
  correct; this research validates it rather than challenging it.

---

## 3. Technology feasibility, verified for October 2026

| Capability | Status | Implication for NeuralLab |
|---|---|---|
| **In-browser LLM inference** | `@huggingface/transformers` 4.2.0 (WebGPU runtime rewritten in C++ with the ONNX Runtime team, ~200 architectures); `onnxruntime-web` 1.26.0; BERT embeddings up to 4× faster; GPT-OSS 20B ≈ 60 tok/s on an M4 Pro Max | Chapter 12 (attention/transformers) can be made genuinely interactive without a server. **But not as a core dependency** — see below |
| **WebGPU availability** | ≈ 85 % global support as of March 2026 per caniuse, cited in the transformers.js docs; the documented pattern is `{ device: navigator.gpu ? 'webgpu' : 'wasm' }` | Any WebGPU feature needs a WASM fallback and must be optional. Not a foundation |
| **Pyodide** | Upstream moved to CPython-aligned versioning; 314.0.7 released 2026-09-14. NeuralLab pins 0.27.7; 0.27.8 is the maintained tag on that line | Upgrade is a standalone, low-priority task. Do not bundle it with feature work |
| **Pyodide offline caching** | Officially documented via service worker (https/localhost only; `pyodide.asm.mjs` must be statically imported and passed through `_createPyodideModule` because service workers forbid dynamic `import()`). **Caching removes the download, not the interpreter cold start** — a loaded Pyodide instance cannot be serialised | This is decisive. Measured cold start in NeuralLab is 5.1 s with an 11.36 MB download; caching removes the 11 MB but leaves seconds of startup. **Therefore the fix for NeuralLab's core loop is not caching — it is rendering from the local TypeScript engine first** |
| **Math rendering** | KaTeX ≈ 60 kB gzipped, best visual fidelity; Temml emits MathML, smaller output, better LaTeX coverage; MathML displays in all three engines since Jan 2023 but quality varies. Canonical React pipeline is `remark-math` + `rehype-katex` + the KaTeX stylesheet (the omitted stylesheet is the single most common failure) | NeuralLab's curriculum currently uses plain Unicode (`d(x²)/dx = 2x`). Adequate for chapters 00–07, insufficient for attention and matrix calculus |
| **In-browser code editing** | CodeMirror 6 ≈ 50–200 kB vs Monaco 2–5 MB; Replit measured monaco + friends at 5.01 MB parsed+gzipped vs 1.26 MB for CodeMirror with all their extensions. CodeMirror lazy-loads via dynamic import; Monaco effectively cannot. CodeMirror 6 is the only one usable on mobile | If NeuralLab ever offers editable Python, CodeMirror 6 is the only defensible choice |

---

## 4. Gaps this research actually supports

Each gap below is stated only where the evidence above supports it. Speculative gaps were discarded.

| # | Gap | Evidence | Strength |
|---|---|---|---|
| G1 | **No competitor combines a sequenced curriculum, executable computation, and per-item assessment in one application.** Explainers have no sequencing or assessment; Playground has neither; d2l/Karpathy have sequencing but their execution lives in notebooks elsewhere | §2.1–2.4, all entries | Strong |
| G2 | **Nobody shows a learner the consequences of a *wrong* configuration as a first-class outcome.** Playground lets you diverge but does not explain it; NeuroViz visualises training but was not described as teaching failure; NeuralLab raises an error (`training.py:79`) | §2.2, ARCHITECTURE_REVIEW §3.2 | Moderate — absence of evidence, not proof of absence |
| G3 | **Prediction-before-reveal is rare in shipped products and strongly supported by evidence.** 2025–26 literature converges on prediction-error magnitude as the mechanism behind testing, pretesting, spacing and generation effects, with **corrective feedback as a strong moderator**. In the retrieval-vs-elaborative-encoding meta-analysis (*Educ Psychol Rev*, Dec 2025) the **overall** advantage of retrieval practice over elaborative encoding is g = 0.14; the subset of studies **in which feedback was available** shows g = 0.50. g = 0.14 is the pooled overall comparison, **not** a no-feedback condition, and neither figure is an effect of feedback alone. Learners are also metacognitively unaware of the prediction benefit, so it must be *required*, not offered | §5 below | Strong |
| G4 | **3D is used decoratively almost everywhere.** llm-viz is the exception because its geometry encodes tensor shape; the indie 3D trainers render glowing spheres that carry no information the 2D view lacks | §2.1, §2.2 | Strong |
| G5 | **Browser-local persistence is universal and universally thin.** No competitor reviewed offers export, import, or portable learner evidence | all entries | Moderate |
| G6 | **No reviewed educational tool is server-rendered.** NeuralLab's 149 curriculum documents are therefore competing for discovery against nothing — a pre-rendered curriculum would be unusual in this category | ARCHITECTURE_REVIEW §5 | Moderate |

---

## 5. Learning-science evidence base

Relevant because NeuralLab already implements prediction-before-reveal and a 1-day review interval,
and the literature says specific things about both.

| Finding | Source | Consequence for NeuralLab |
|---|---|---|
| Retrieval practice beats elaborative encoding by g = 0.14 **overall** (pooled across 44 studies). Within that set, studies **where feedback was available** show g = 0.50, and the authors report elaborative encoding becoming comparatively more beneficial when feedback is unavailable. Read correctly: feedback availability is a **moderator of the retrieval-vs-elaboration comparison**, not a measured effect size for adding feedback to a product | Retrieval Practice versus Elaborative Encoding: A Systematic and Meta-analytic Review, *Educational Psychology Review*, Dec 2025 (44 studies) | Justifies **prioritising** feedback quality. It does **not** predict a specific gain here. NeuralLab's current wrong-answer text, "Prediction differs; review the operations and retry.", carries no corrective information at all, which is the gap worth closing |
| Distributed practice: d = 0.54, 95 % CI [0.31, 0.77], larger effects at longer retention intervals | *Behavioural Sciences*, June 2025, classroom meta-analysis | Spacing is worth implementing properly. A fixed 24-hour interval with the same two numbers is not spacing |
| Errorful generation helps **only with corrective feedback**, and *rephrasing* feedback beats reading or copying it | *Journal of Experimental Education*, 2026 | A "state the rule in your own words" step after a wrong prediction is evidence-backed, cheap, and needs no AI to be useful |
| Learners are metacognitively unaware of the errorful-generation benefit and under-adopt it | Metcalfe, *Annual Review of Psychology*, "Learning from Errors"; and follow-ups | NeuralLab is **right** to make the prediction mandatory before reveal. Keep it. Do not make it skippable |
| Prediction-error magnitude predicts memory updating | *Psychonomic Bulletin & Review*, 2026 | Feedback should be proportional to how wrong the learner was, not binary |
| Benefits of errorful generation are confined to *semantically plausible* guesses | Clark et al. 2021 | Free-numeric prediction without constraint may be below the useful threshold; structured prediction (direction, order of magnitude, sign) is likelier to help |

---

## 6. Where NeuralLab actually stands

Honest positioning against the field, based on §2 and the architecture audit:

**Ahead of the field**
- Differential verification of every displayed number against real CPython — no reviewed competitor
  does this, and it is the foundation of any claim to educational accuracy.
- 60 sequenced lessons with per-item evidence, plus a capstone with validation selection, early
  stopping and a held-out-evaluation policy check. No explainer has anything comparable.
- Mandatory prediction before reveal, which the 2025–26 literature endorses and almost nobody ships.
- Explicit, repeated honesty about what its evidence does *not* prove. Rare and worth protecting.

**Behind the field**
- Interaction immediacy: Playground responds in milliseconds; NeuralLab's first calculation costs
  5.1 s and 11 MB.
- Visual craft: CNN Explainer and llm-viz are in a different class, and NeuralLab's 3D is below the
  commodity level set by hobby projects.
- Addressability: every competitor reviewed has linkable content; NeuralLab has one URL.
- Evidence of effectiveness: NeuroViz has SUS 80.97 with n = 31. NeuralLab has none.

**Uncontested**
- The combination in G1. Nothing in this review occupies it.

---

## Sources

Retrieved 2026-10-10 unless stated.

- [NeuroViz: Real-time Interactive Visualization of Forward and Backward Passes in Neural Network Training — arXiv:2605.02044](https://arxiv.org/abs/2605.02044) (Sharma & Rawassizadeh, v1 2026-05-03, v2 2026-05-23) · [neuroviz.org](https://neuroviz.org)
- [Transformer Explainer — CHI '26 paper (PDF)](https://poloclub.github.io/papers/26-chi-transformer-explainer.pdf) · [ACM DL](https://dl.acm.org/doi/10.1145/3772318.3791725) · [demo](https://poloclub.github.io/transformer-explainer/)
- [CNN Explainer — TVCG 2020 (PDF)](https://poloclub.github.io/papers/20-vis-cnnexplainer.pdf)
- [Diffusion Explainer — arXiv:2404.16069](https://arxiv.org/html/2404.16069v1)
- [iNNspector: Visual, Interactive Deep Model Debugging — arXiv:2407.17998](https://arxiv.org/pdf/2407.17998)
- [TensorFlow Playground — repository](https://github.com/tensorflow/playground) · [Google ML EDU support note that it is unsupported](https://support.google.com/machinelearningeducation/answer/7654447?hl=en)
- [Deeper Playground](https://deeperplayground.org/)
- [bbycroft/llm-viz](https://github.com/bbycroft/llm-viz) · [demo](https://bbycroft.net/llm)
- [karpathy/nn-zero-to-hero](https://github.com/karpathy/nn-zero-to-hero) (MIT)
- [NeuralCanvas](https://github.com/queenjj11/NeuralCanvas) · [Neural Network Journey](https://nn-visualizer.onrender.com/)
- [Transformers.js 4.0.0 release](https://github.com/huggingface/transformers.js/releases/tag/4.0.0) · [WebGPU guide](https://huggingface.co/docs/transformers.js/guides/webgpu)
- [Pyodide releases](https://github.com/pyodide/pyodide/releases) · [Using Pyodide in a service worker](https://pyodide.org/en/stable/usage/service-worker.html) · [Related projects](https://pyodide.org/en/stable/project/related-projects.html)
- [marimo on Pyodide](https://blog.pyodide.org/posts/marimo/) · [marimo WASM deploy docs](https://marimo.io/features/feat-deploy) · [JupyterLite](https://pypi.org/project/jupyterlite/)
- [Replit: Betting on CodeMirror](https://blog.replit.com/codemirror) · [Monaco vs CodeMirror 6 vs Sandpack, 2026](https://www.pkgpulse.com/guides/monaco-editor-vs-codemirror-6-vs-sandpack-in-browser-2026)
- [Announcing Temml — KaTeX discussion #2800](https://github.com/KaTeX/KaTeX/discussions/2800) · [react-markdown math docs](https://github.com/remarkjs/react-markdown)
- [Retrieval Practice versus Elaborative Encoding: A Systematic and Meta-analytic Review, *Educ Psychol Rev* (Dec 2025)](https://link.springer.com/article/10.1007/s10648-025-10076-6)
- [The Distributed Practice Effect on Classroom Learning: A Meta-Analytic Review (2025)](https://pubmed.ncbi.nlm.nih.gov/40564553/)
- [Learning from mistakes: objective and subjective error magnitudes predict the testing effect (2026)](https://link.springer.com/article/10.3758/s13423-026-03009-z)
- [Generative Processing Strengthens Learning Across Errorful and Non-Errorful Contexts (2026)](https://www.tandfonline.com/doi/abs/10.1080/00220973.2026.2636103)
- [Metcalfe, Learning from Errors, *Annual Review of Psychology*](https://www.annualreviews.org/content/journals/10.1146/annurev-psych-010416-044022)
