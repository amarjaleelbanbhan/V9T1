# Project Renaissance 2026 — NeuralLab product transformation proposal

Status: **accepted direction with historical audit evidence; implementation is tracked separately.**
Date: 2026-10-10 · Base commit: `e565635ff7e54c6fe472b3e3cef98f77d3b7739b`

| Document | Contains |
|---|---|
| **This document** | Assessment, identity, ranked portfolio, direction, adversarial review, open questions |
| [research/COMPETITIVE_LANDSCAPE.md](./research/COMPETITIVE_LANDSCAPE.md) | 15+ products, technology feasibility, learning-science evidence, sources |
| [research/INNOVATION_OPPORTUNITIES.md](./research/INNOVATION_OPPORTUNITIES.md) | 32 candidate ideas, novelty classification, scoring, rejections |
| [design/EXPERIENCE_EVOLUTION.md](./design/EXPERIENCE_EVOLUTION.md) | Three design directions, 2D/3D policy, motion, acceptance criteria |
| [engineering/ARCHITECTURE_REVIEW.md](./engineering/ARCHITECTURE_REVIEW.md) | Verified architecture map, measurements, technical changes |
| [engineering/IMPLEMENTATION_ROADMAP.md](./engineering/IMPLEMENTATION_ROADMAP.md) | Six milestones decomposed into reviewable PRs |

Earlier checkpoints that remain valid and are *not* superseded:
[NEURALLAB_PLATFORM_ARCHITECTURE.md](./NEURALLAB_PLATFORM_ARCHITECTURE.md),
[PYTHON_AND_MARKDOWN_AUDIT.md](./PYTHON_AND_MARKDOWN_AUDIT.md),
[BEGINNER_COMPLETION.md](./BEGINNER_COMPLETION.md).

---

## Current checkpoint after PR #25

Current reviewed base: `0ae811c` (2026-10-10). This checkpoint overrides earlier baseline statements and proposed work where they disagree.

- PR #16 delivered lazy labs and Markdown, rendered mathematics, editable Python, FSRS, backups, resume, scaffolding and the supplied six-colour palette.
- PR #22 delivered deterministic prediction diagnostics, the four-level hint ladder, assisted versus unaided evidence, and stage playback in the beginner course. It also fixed reduced-motion initialization and planned-navigation contrast.
- PR #25 fixed partial-hint grid/curve leaks, authored rule hint rendering, empty prediction matching zero, and recall provenance. Exact-head CI passed 243 unit and 56 browser tests, including all 60 beginner worked/transfer cases. Production was READY on that merged commit.
- Chapter-06 authored hints (#18), per-choice feedback (#19), conceptual diagnostic packs (#20), and keyboard/touch regressions (#21) are tracked in their implementation PRs; this roadmap does not itself close them.
- URL routing, seeded fresh transfer, chapter mission checkpoints, divergence teaching and token consolidation remain future work. No learner-outcome study has been performed.

Product decisions for this cycle: depth in chapters 00–07; Python remains authoritative; preserve the supplied teal/slate palette; retain the pinned runtime until an upgrade is separately verified; keep portable evidence; support game-like problem solving with explicit goals and informative motion. Points, streaks or completion must not imply mastery. Broad formatting, a new theme and chapters 08–18 are separate future decisions.

The 90% action / 10% supporting text split is a design target, not a measured result or a guarantee that a learner will become a master. The old audit and screenshots below remain historical evidence; their counts and defects must not be presented as current observations.

## 0. Reconciliation against PR #16 (added 2026-10-10, after merge `09a9646`)

The audit in sections 1–12 below was performed against `e565635`. **PR #16 then merged and
delivered a large part of Milestone 0 and Milestone 1.** Re-verified on current `main`
(`09a9646`): 208/208 unit tests pass; production build clean; curriculum validation clean.

This section is authoritative where it contradicts anything later in the document.

### 0.1 Already implemented — remove from the plan

| Capability | Evidence on `main` |
|---|---|
| Entry-bundle reduction | Entry chunk is now **266.13 kB / 82.92 kB gzip** (was 1 260.78 kB / 351.17 kB). Three.js, CodeMirror, KaTeX, every lab and **every curriculum document** are separate chunks |
| Lazy 3D and lazy curriculum Markdown | `App.tsx` lazy-loads all labs and scenes; each `dl-NN-NNN.md` is its own ~2.8 kB chunk |
| Mathematical notation and code highlighting | `remark-math` + `rehype-katex` + `rehype-highlight` + a safe `remarkCallouts` plugin |
| Editable Python | `src/components/PythonEditor.tsx` on CodeMirror 6 with `@codemirror/lang-python` |
| Spaced repetition | Real FSRS via `ts-fsrs` in `src/course/learning.ts`, four card kinds per lesson, validated persistence |
| Portable evidence | `src/course/backup.ts` export/import with strict validation |
| Resume last position | `neurallab.workspace` + `learning.selected` |
| Prerequisite scaffolding | `src/course/scaffolding.ts`: per-chapter bridges, per-topic prerequisites, navigable |
| Explanation drafts (Feynman) | `LessonLearning.tsx`, persisted, with a self-review checklist |
| 3D rebuild | `NetworkScene`, `LossSurface`, `SceneObjects`, `SceneFrame` (visibility-gated `frameloop`, `PerformanceMonitor`, error boundary, 2D fallback) |
| Motion controls | `StagePlayer` — play/pause/rewind/replay, pauses when hidden, offscreen or reduced-motion |
| The `aria-prohibited-attr` defect on the 3D canvas | **Fixed.** axe now reports it clean |
| CI reproducibility | `npm ci` with a `package-lock.json` cache key |
| Palette | Six-colour deep-teal/slate-blue set applied across CSS, SVG and scenes |

### 0.2 Implemented but needing polish

| Capability | What is still weak |
|---|---|
| Hints | `scaffolding()` returns one static `<details>` with an analogy and four generic steps identical for every lesson. There is **no progressive ladder** and **no record of hint use** |
| Stage trace | `TraceVisual` still renders the same values three times (bar chart, grid, table) and still needs N manual clicks before the result appears. `StagePlayer` exists but is not wired into the beginner course |
| Chapter review | Still appended to the bottom of all 60 lessons; `tasks[].model` and `.values` are still read by nothing |
| Design tokens | **88 hardcoded hex values across 17 `.tsx` files.** They were recoloured to the new palette by hand rather than referenced from a token module, so the next palette change repeats the work |
| Evidence model | `completed`, `assisted success`, `independent success` and `retained understanding` are not separated. `Evidence` records attempts, cases and `passedAt` only |

### 0.3 Verified defects still open

| Defect | Measurement on `main`, 2026-10-10 |
|---|---|
| No URL routing | In-app navigation leaves the URL unchanged; Back still exits the app. Position is restored from `localStorage`, which is not the same as addressability |
| Python cold start | First reveal of a session: **7 762 ms, 11 361 233 bytes** from the CDN. Nothing warms the worker while the learner reads |
| Accessibility | **1 serious axe violation remains** (down from 6): `color-contrast` on `.planned .lesson-name small`, 5 nodes — one CSS rule |
| Wrong-answer feedback | Still the single string "Prediction differs; review the operations and retry." No diagnosis of *how* the answer was wrong |
| Assessment integrity | Transfer-case answers are still printed in the public curriculum Markdown; still exactly 2 cases and 2 MCQ choices per lesson |
| Divergence | A diverging training run still raises instead of being shown |

### 0.4 New learning interactions (this cycle's work)

Missions with an objective, an action on real mathematical state and visible consequences; a
four-level hint ladder with hint use recorded separately from independent success; deterministic
diagnostic feedback derived from the Python-returned stages; mission progression with scaffolding
removed one step at a time. Specified in [`docs/missions/LEARNING_MISSIONS.md`](./missions/LEARNING_MISSIONS.md).

### 0.5 Experiments requiring learner evaluation

Claims that cannot be settled by engineering and must not be stated as outcomes: whether diagnostic
feedback reduces retries; whether missions beat the current guided lesson; whether generated items
preserve difficulty; whether the prerequisite graph helps learners or only authors; whether any of
this improves retention. Each needs learners, and none is asserted in this plan.

### 0.6 Corrections to this document's earlier research

1. **g = 0.14 was misread.** It is the *overall* pooled retrieval-versus-elaborative-encoding
   comparison across 44 studies, **not** a no-feedback condition. g = 0.50 is the subset where
   feedback was available. Feedback availability moderates that comparison; neither figure is an
   effect size for adding feedback to a product. Corrected in
   [COMPETITIVE_LANDSCAPE.md](./research/COMPETITIVE_LANDSCAPE.md) §5 and
   [INNOVATION_OPPORTUNITIES.md](./research/INNOVATION_OPPORTUNITIES.md) A4.
2. **"Signed-by-hash" overstated a checksum.** A non-cryptographic integrity check detects accidental
   corruption and proves nothing about authorship. Corrected.
3. **Python stays the authoritative calculation source.** An earlier draft proposed rendering lesson
   stages from `calculate()` and demoting Python to verification. That contradicts a product
   requirement: the lesson text promises the learner that Python produced the numbers. The latency
   fix is to warm the worker during reading and precache the pinned assets; any `calculate()` output
   shown before Python returns must be labelled a preview and replaced. Corrected in
   [ARCHITECTURE_REVIEW.md](./engineering/ARCHITECTURE_REVIEW.md) A2 and
   [IMPLEMENTATION_ROADMAP.md](./engineering/IMPLEMENTATION_ROADMAP.md) M0-3.

---

## 1. Executive assessment

NeuralLab is in better shape than its surface suggests, and its problems are not the ones a
conventional redesign would target.

**The thesis of this plan: NeuralLab's most valuable asset is a verification system nobody can see,
and its worst defect is that this system is used to slow the product down instead of to prove it
right.**

Concretely. `src/engine/` contains ten pure TypeScript computation engines, including a 47-model
calculation engine covering all 60 beginner lessons. Those engines are checked, in CI, against real
CPython 3 — every result, every intermediate stage label, every stage value, every grid cell, every
curve point, to 1e-8, for all 60 lessons × 2 cases, plus update-by-update agreement across three
optimizers. No product found in this review does anything comparable. It is the strongest claim to
educational accuracy available to a free browser tool.

And yet `calculate()` has **zero call sites in the user interface**. The application instead
downloads **11 361 233 bytes** of Pyodide and waits **5 149 ms** to compute `2 × 3 + 1` — a number
it could have produced locally in microseconds from an engine that is already proven correct. Every
new browser session pays that cost again.

That inversion is the shape of most of this plan's findings: **the capability exists, the wiring
does not.** The chapter-review items carry `model` and `values` fields that nothing reads. 149
curriculum documents and 12 interactive labs live in the same tab and cannot link to each other. A
validated prerequisite graph is computed at build time and never shown. Four distinct progress
states are tracked and surfaced as one line of text. The design tokens are defined once and then
contradicted by 92 hardcoded colours in the visualisation layer.

The honest verdict: **this is a good product with excellent foundations, two structural omissions
(no latency budget for the Python runtime, no URL routing), and a presentation layer that has not caught up with
the engineering.** It does not need a rewrite. It needs about three weeks of connecting things that
already exist, and then it is positioned in a market gap nothing else occupies.

---

## 2. Verified current state

Everything in this section was observed by running the code on 2026-10-10. Full detail in
[ARCHITECTURE_REVIEW.md](./engineering/ARCHITECTURE_REVIEW.md) §1.

**Works, verified.**

- `npm test` → **200/200 pass**, including the CPython differential suite.
- `npm run test:e2e` → **38/38 pass** (run against Chromium 141 via an executable-path override;
  the suite itself was unmodified).
- `npm run check:curriculum` → 19 chapters, 149 lessons, 20 sources, acyclic prerequisites.
- `npm run build` → clean typecheck and production build.
- Production deployment responds at `https://neurallab-tau.vercel.app/`.
- All 60 beginner lessons load, execute real Python, step through stages, record evidence, and
  persist it.
- Mobile at 390 px: **0 px horizontal overflow**.
- The capstone genuinely trains: seeded splits, SGD/momentum/Adam, L2, early stopping, validation
  selection, held-out evaluation, batch-level inspection, local checkpoint save and restore.

**Broken or materially deficient, verified.**

| | Measurement |
|---|---|
| First calculation of a session | 5 149 ms, 11 361 233 bytes from a CDN; a new tab repeats it |
| Browser Back button | **Leaves the application entirely.** In-app navigation creates no history entries; the URL never changes |
| Entry JavaScript chunk | 1 260.78 kB raw / 351.17 kB gzip; the 3D stack is statically imported and ships to every visitor including mobile 2D users |
| Curriculum chunk | 428.29 kB — every Markdown document is loaded eagerly |
| Hardcoded colours in `.tsx` | 92 distinct values across 12 files, many from an abandoned green palette; the 3D canvas renders `#092328` teal inside a `#0B1020` navy UI |
| Typography | 24 distinct `font-size` values; 70 rendered text nodes below 11 px on one screen; prose lines up to ~171 characters |
| Breakpoints | 29 media queries at 20 distinct widths |
| Accessibility | 6 axe violations across 3 views, including `aria-prohibited-attr` on the 3D wrapper — the signature visual has no accessible name |
| Assessment integrity | The expected answer to every assessed transfer case is printed in the public curriculum Markdown |
| Assessment variety | 60/60 lessons have exactly 2 fixed cases and exactly 2 MCQ choices |
| Dead capability | `calculate()`: 0 UI call sites. `chapterReviews[].tasks[].model`/`.values`: 0 readers |
| Divergence handling | A diverging training run raises an error instead of being shown |
| Tooling | No linter, no formatter; `tests/` and `scripts/` are outside `tsconfig` `include`; CI uses `npm install`, and a fresh install rewrote the lockfile by 1533 lines |
| Discovery | Nothing is server-rendered; 149 documents are invisible to search engines |

---

## 3. Product identity

| Question | Answer |
|---|---|
| What problem does it solve? | Deep learning is taught through notation and metaphor, so beginners can follow a derivation without ever seeing a number change. NeuralLab makes every intermediate value of every computation visible, manipulable and checkable |
| For whom? | A beginner working alone, with a browser, no GPU, no money, and no tolerance for hand-waving. Secondarily: an instructor who needs assignable, verifiable exercises |
| Why would someone use it? | Because it shows the arithmetic, not an animation of the arithmetic — and because it is unusually careful about the difference |
| Why would someone return? | Today: sequence and saved evidence. That is thin. After this plan: because it remembers where they were, gives them different numbers each time, and tells them *why* their answer was wrong |
| What makes it different now? | Differential verification against real CPython; mandatory prediction before reveal; 60 sequenced lessons with per-item evidence; explicit honesty about what that evidence does not prove |
| Strongest hidden capability | `src/engine/beginner.calculate()` — 47 validated models, instant, offline, unused |
| Which features could become signature features? | (1) "This number is verified" as a visible guarantee. (2) Prediction with diagnostic feedback. (3) Failure — divergence, leakage, overfitting — as content rather than error |
| What prevents it from getting better? | Not architecture, not scope. Three things: a network round trip in the core loop, no addressable state, and a presentation layer disconnected from its own design system |
| What should its identity be? | **A verified computational instrument for learning deep learning.** Every number it shows is checkable; every claim about the learner is bounded and stated |
| What should it avoid becoming? | A course platform with streaks and badges; an AI tutor; a generic "visualise anything" renderer; a Playground clone |

The honesty is a product feature, not a disclaimer. "Visited, attempted and passed are distinct.
Guided practice and self-reviewed projects do not prove retained mastery" is a sentence almost no
competing product would ship — and in a market full of overstatement, it is a differentiator worth
protecting. Game-like missions are allowed when their goals require real mathematical actions and their rewards do not overstate the evidence.

---

## 4. Strengths to protect

1. **The CPython differential test suite** (`src/engine/pythonPrograms.test.mjs`). Treat as frozen.
   Everything else in this plan assumes it keeps passing.
2. **Pure, renderer-independent engines.** No React in `src/engine/`. Keep it that way.
3. **Mandatory prediction before reveal.** Endorsed by the 2025–26 literature; learners are
   metacognitively unaware of the benefit, so it must stay required, not optional.
4. **Validated curriculum catalog with an acyclic prerequisite graph** and a CI validator.
5. **The capstone.** The most complete artefact in the product and currently the least visible.
6. **Honest scope language** throughout the UI.
7. **The semantic colour idea** — inputs blue, weights violet, activations aqua, errors coral,
   gradients gold. The idea is right; only enforcement is missing.
8. **Working mobile layout** at 390 px with zero overflow.
9. **38 end-to-end tests** covering real journeys including cancellation, keyboard and reduced
   motion.

---

## 5. Competitive position

Full matrix in [COMPETITIVE_LANDSCAPE.md](./research/COMPETITIVE_LANDSCAPE.md). The short version:

The market splits into **single-concept explainers** (CNN / Diffusion / Transformer Explainer,
llm-viz — beautiful, open source, one topic each, no sequencing, no assessment),
**hyperparameter sandboxes** (TensorFlow Playground, explicitly unsupported by Google and with no
tagged releases; NeuroViz, a May 2026 research prototype with SUS 80.97 from 31 participants), and
**courses with notebooks elsewhere** (d2l.ai — which NeuralLab already cites — Karpathy's
*Zero to Hero*, fast.ai).

**No reviewed product combines a sequenced curriculum, executable computation, and per-item
assessment in one application.** NeuralLab already does. That is the position.

Where it is behind: immediacy (Playground answers in milliseconds), visual craft (CNN Explainer and
llm-viz are in a different class), addressability (everything else has URLs), and evidence of
effectiveness (NeuroViz has a published usability study; NeuralLab has none).

One research finding materially changed this plan: **"rewind and fork a training run" is no longer
novel.** NeuroViz (arXiv:2605.02044, May 2026) published within-epoch forward/backward comparison
with a user study. The idea was demoted from a headline feature to Tier B.

---

## 6. The experience being proposed

Not a list of tools — one loop, tightened.

**Today.** Pick a lesson from a list → read → type a prediction → wait five seconds for a Python
runtime → click "Next operation" three times → see the answer → answer a two-option question → get
told "Prediction differs" → scroll past an unrelated chapter review form.

**Proposed.** Arrive at a URL that is the lesson → the calculation appears instantly, computed
locally and badged as verified → predict → step or reveal → **if wrong, be told specifically what
went wrong** ("your answer equals z before the bias was added"), restate the rule in your own words,
and try again with *different numbers* → follow a link straight into the lab that demonstrates it,
with this lesson's values pre-loaded → break it on purpose and watch the loss diverge instead of
seeing an error → come back tomorrow to a different instance of the same idea, and export your
record when you leave.

Against the Phase 4 questions:

| Can the learner… | Today | After |
|---|---|---|
| Explore it | partly — 12 labs, disconnected | yes — labs reachable from the curriculum with parameters |
| Manipulate it | yes | yes, with direct manipulation on the diagram |
| Understand the process | yes — stage traces | yes, with one clear representation instead of three |
| Predict the result | **yes, already, and required** | unchanged — this is already right |
| Make mistakes safely | partly — mistakes end in an error string | yes — divergence and leakage become content |
| Compare alternatives | no | yes (M5-1, experiment) |
| Save and revisit | partly — evidence persists, position does not | yes — URLs, resume, export |
| Explain what they learned | no | yes — the rephrase step |
| Have the system adapt | no | partly — generated items and real spacing |

---

## 7. Ranked portfolio

P0 = correctness and reliability · P1 = core experience · P2 = differentiated capability ·
P3 = ambitious · R = research. Full specifications and scoring in
[INNOVATION_OPPORTUNITIES.md](./research/INNOVATION_OPPORTUNITIES.md) §2–3.

| Pri | Feature | Why now | Effort | Risk |
|---|---|---|---|---|
| **P0** | Reduce Python latency without replacing Python: warm the worker on course entry, precache assets, optional labelled preview | Python stays authoritative — it is a product requirement. The cost is paid off by scheduling, not by swapping engines | 2–3 d | low–med |
| **P0** | Design tokens reachable from TS/SVG/3D; replace 92 literals | Unblocks every visual change; fixes the teal-in-navy canvas | 1.5–2 d | low |
| **P0** | URL routing and history | Unblocks deep links, sharing, resume, pre-rendering | 2–3 d | med |
| **P0** | Accessibility: 6 violations → 0; 3D gets a real accessible name | The signature visual is currently invisible to assistive technology | 1 d | low |
| **P0** | Bundle: lazy 3D, lazy Markdown, deep icon imports | 1 260 kB → target < 600 kB | 1 d | low |
| **P0** | CI hygiene: `npm ci`, lockfile, Playwright ≥ 1.55.1, typecheck tests | Reproducible builds; closes 2 high advisories | 0.5 d | low |
| **P1** | Type scale, measure, breakpoints, states | 24 font sizes, 171-char lines, 20 breakpoints | 4–5 d | med |
| **P1** | Trace redesign — one representation, not three | The most-used surface says the same thing three times | 2–3 d | med |
| **P1** | **Proportional diagnostic feedback** | Best-evidenced change available: feedback availability strongly moderates the retrieval-practice meta-analysis (overall g = 0.14; g = 0.50 in the feedback-available subset). Current wrong-answer text carries no corrective information | 2–3 d | med |
| **P1** | Rephrase-the-rule step after an error | Rephrasing feedback beats reading it (*J Exp Educ* 2026) | 1 d | low |
| **P1** | Wire the dead chapter-review data into worked solutions | Data already present; near-zero cost | 0.5–1 d | very low |
| **P1** | Progress rail surfacing four existing states | Tracked, never shown | 1–1.5 d | low |
| **P2** | Curriculum ↔ lab deep links with parameters | Connects 149 documents to 12 labs | 4–6 d | low–med |
| **P2** | **Divergence as a lesson** | The most instructive failure in optimisation, currently an error string | 3–4 d | med |
| **P2** | Generated practice items + real spacing | 2 fixed cases per lesson, answers published; d = 0.54 for distributed practice | 6–8 d | med |
| **P2** | Portable evidence export/import | No competitor offers it; makes the honesty inspectable | 1–1.5 d | low |
| **P3** | Branch-and-compare runs | iNNspector's model-lineage mechanic, adapted | 5 d spike | med |
| **P3** | Pre-rendered curriculum for discovery | Only free growth channel available | 5 d spike | med |
| **R** | Rewind-and-fork training | **Demoted** — NeuroViz published it in May 2026 | 5 d spike | med |
| **R** | In-browser transformer inference (chapter 12) | Feasible (transformers.js 4.2.0, WebGPU ~85 %), but chapters 08–18 are specification only | — | high |
| **R** | Editable Python (CodeMirror 6) | Most-wanted, but breaks the correctness guarantee and the threat model | — | high |

---

## 8. Architecture and design direction

**Architecture: evolve, do not rewrite.** The module boundaries are already correct — pure engines,
a thin React layer, workers for Python, validated content as data. The changes are wiring
(`calculate()` into the UI, routing into `App.tsx`, tokens into the visuals), not restructuring.
Explicitly rejected: meta-framework migration, state-management migration, replacing Three.js,
replacing Pyodide, restructuring `src/engine/`.

**Design: "Instrument"** — a precise, neutral chassis where all colour belongs to the data, chosen
over "Blueprint" (light, annotated, textbook) and "Signal" (cinematic, 3D-first) on a weighted
rubric. It wins largely because **it is what the product already half is**, which makes it
enforcement rather than redesign. Two Blueprint elements are borrowed: the annotated-margin pattern
for prose, and keeping the token architecture ready for a light theme (classroom projection is a
real use case). Reasoning in
[EXPERIENCE_EVOLUTION.md](./design/EXPERIENCE_EVOLUTION.md) §3.

**3D: keep it, fix it cheaply, invest later.** The current scene fails on composition, camera,
colour and information density — not on geometry or renderer. A single neuron with three inputs has
no third dimension to encode, so 3D cannot earn its place until chapters 08+ bring multi-layer
networks and tensor shapes. The benchmark is llm-viz, where geometry *is* the explanation. Near-term
work is five small fixes; the ambitious version is gated on content that does not yet exist.

---

## 9. Adversarial review

Three hostile readings, and what changed because of them.

### Skeptical product reviewer

> *"Most of this is cleanup. Where is the product?"*
>
> **Conceded, and deliberate.** Seven of the twenty-one items are P0 cleanup. That is the honest
> answer to a product whose core interaction takes five seconds and whose Back button exits the app.
> The genuinely new capabilities are three: diagnostic feedback, divergence-as-content, and
> generated items. The plan does not pretend otherwise.

> *"Portable evidence export — who asked for this?"*
>
> **Valid.** Nobody asked. Demand is unproven and it is marked so in the scoring. It stays because
> it costs ~1.5 days and the import validator already exists, but it is the first item to cut.

> *"The prerequisite-graph visualisation is a solution looking for a problem."*
>
> **Accepted.** Downgraded in the roadmap to an explicit experiment (M3-5) with instructions to
> remove it if unused.

> *"You rejected an AI tutor. Every competitor will ship one by 2027."*
>
> **Holding the line, with a reason.** The product's single distinguishing claim is that its numbers
> are verified. Placing generated arithmetic beside differentially-tested arithmetic destroys that
> claim for a capability available everywhere else. Revisit only if a local model ships for another
> reason.

### Skeptical staff engineer

> *"Local-first rendering duplicates the Python path. Two sources of truth."*
>
> **Objection accepted; the proposal was changed.** An earlier draft made `calculate()` the default
> display source. The maintainer's requirement is that lesson numbers are produced by real Python,
> and the lesson text says so to the learner. Python stays authoritative. Latency is addressed by
> warming the worker during reading and precaching assets; any `calculate()` output shown before
> Python returns must be labelled a preview and replaced. `pythonPrograms.test.mjs` already asserts
> the two agree for every lesson, stage, grid and curve.

> *"URL routing in a 15-branch ternary will be messy."*
>
> **Fair.** Mitigated by doing it in its own PR (M0-5) before any lesson-component changes, and by
> hand-rolling ~40 lines over the History API rather than adding a router for one string.

> *"Divergence handling weakens a safety guard."*
>
> **Taken seriously.** The guard in `training.py:79` stays and still terminates the run; only the
> *reporting* changes from raise to a marked return. The `allow_nan=False` serialisation constraint
> means non-finite values must be replaced with sentinels before `json.dumps` — called out
> explicitly in M4-1. If the differential test cannot be kept green, the feature is dropped.

> *"Reformatting 2 800 lines will poison `git blame`."*
>
> **Accepted and planned for:** isolated commit, `.git-blame-ignore-revs`, nothing else in that PR.
> The counter-argument stands: single lines over 2 000 characters already make blame useless at
> statement granularity, and are the reason no linter exists.

> *"Generated items could produce nonsense."*
>
> **Real risk, med-scored.** Mitigated with curated per-model ranges, property tests over 10 000
> seeds, and manual review of a sample. If quality cannot be held, the fallback is to hand-author a
> third and fourth case per lesson — less good, still better than two.

> *"Your effort estimates have no basis."*
>
> **Correct.** They come from code inspection, not measured velocity on this repository. Flagged in
> the risk register with an instruction to re-estimate after Milestone 0.

### Skeptical designer and learning scientist

> *"g = 0.50 is from a meta-analysis of laboratory retrieval studies, not from this product — and
> an earlier draft of this plan misread it as a no-feedback versus feedback contrast."*
>
> **Both correct; the earlier draft was wrong and is fixed.** g = 0.14 is the *overall* pooled
> retrieval-versus-elaborative-encoding comparison across 44 studies; g = 0.50 is the subset where
> feedback was available. Feedback availability is a moderator of that comparison, not a measured
> effect of adding feedback. The literature justifies *prioritising* feedback
> quality; it does not predict an effect size here. The roadmap proposes measuring
> retries-to-correct before and after, and states plainly that this is not a controlled study.

> *"A deterministic rule table 'diagnosing' misconceptions from one wrong number is overreach."*
>
> **Agreed, and the design was changed.** Diagnostics are phrased as observations about the number
> ("your answer equals z before the bias was added"), never as claims about the learner. Pattern-based
> misconception diagnosis is explicitly deferred (C4) until generated items provide enough signal.

> *"Keeping 3D at all is sunk-cost reasoning."*
>
> **Partly conceded.** The plan does not defend the current scene: it is below the quality bar set
> by hobby projects, and the recommendation is five cheap fixes plus lazy-loading so non-users never
> download it. Removing it entirely would be defensible; it is retained because the chapter 03 and
> 08+ tensor-shape content is the one case where 3D genuinely earns its place, and deleting a working
> renderer to rebuild it later is worse than leaving it dormant.

> *"Stepping through operations one click at a time is friction dressed up as pedagogy."*
>
> **Half conceded.** The stepping *is* the pedagogy — but three mandatory clicks to see a result the
> learner already predicted is a toll. The plan adds "Reveal all operations" alongside stepping and
> keeps stepping as the default.

> *"Two-option multiple choice is a 50 % coin flip."*
>
> **Fully conceded and currently unaddressed.** The transfer-case numeric answer carries most of the
> evidential weight, which is why its publication in the Markdown is scored as a correctness defect
> (M4-4). Increasing choice counts is not in the plan and should be. **Added to open questions.**

---

## 10. Success criteria

Measured baselines and targets are tabulated in
[IMPLEMENTATION_ROADMAP.md](./engineering/IMPLEMENTATION_ROADMAP.md) §"Success criteria". The four
that matter most:

1. Time to the first calculated number: **5 149 ms → under 100 ms**, with **zero** network bytes.
2. Every lesson, lab and chapter addressable by URL; Back works.
3. Zero hardcoded colours in `.tsx`; zero serious or critical axe violations.
4. **200 unit tests and 38 end-to-end tests never go red**, and the CPython differential suite is
   never weakened.

---

## 11. Open questions for the maintainer

1. **Two-option MCQs.** Raised by the adversarial review and not resolved. Expanding to four options
   means rewriting 60 question items. Worth it?
2. **Published answers in the curriculum Markdown.** Removing them (M4-4) protects assessment
   integrity but strips a worked example from the public documents. Remove, or replace with a
   *different* worked example?
3. **Scope direction.** Finish chapters 08–18 (breadth), or deepen chapters 00–07 (depth)? This plan
   assumes depth; that assumption drives the deferral of math typesetting, in-browser transformers
   and ambitious 3D.
4. **Light theme.** Worth building for classroom projection, or out of scope?
5. **Evidence of effectiveness.** NeuroViz published SUS 80.97 with n = 31. Is a small usability
   study in scope? It is the one thing a competitor has that no amount of engineering supplies.
6. **Pyodide version.** Upstream is at 314.0.7 (Sep 2026); the project pins 0.27.7. Upgrade now as
   an isolated PR, or stay pinned until something requires it? This plan recommends staying pinned.
7. **Portable evidence.** Keep it in the portfolio, or cut it as unproven demand?
8. **Reformat.** Approval needed before M1-1, since it rewrites nearly every source file in one
   commit.

---

## 12. What this plan deliberately does not do

Rejected with reasons in
[INNOVATION_OPPORTUNITIES.md](./research/INNOVATION_OPPORTUNITIES.md) §2 Tier D: meta-framework
migration, replacing Three.js, rewards unrelated to learning evidence, an AI tutor sidebar, replacing Pyodide with a JS
interpreter, a drag-and-drop network builder, a mobile app, WebGPU compute, user accounts and a
backend, and an infinite-canvas curriculum map.

The single sentence behind all ten: **nothing in this plan trades away the fact that every number
NeuralLab shows can be checked.**

