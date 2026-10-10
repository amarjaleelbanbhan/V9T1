# Innovation opportunities — candidate ideas, novelty, feasibility

Date: 2026-10-10. Evidence base:
[COMPETITIVE_LANDSCAPE.md](./COMPETITIVE_LANDSCAPE.md) (market + learning science) and
[ARCHITECTURE_REVIEW.md](../engineering/ARCHITECTURE_REVIEW.md) (what the code can already do).

32 candidates were generated and are all recorded below, including the rejected ones. Nine are
recommended. **No idea here is claimed as a world first.** Novelty is classified on this scale:

- **E** — Established feature somewhere in the market
- **EB** — Established idea, clear opportunity for a *better* implementation here
- **UC** — Uncommon combination of otherwise ordinary parts
- **RS** — Research-stage; prototypes exist in papers, not in shipped products
- **AN** — Apparently novel in this category; **not exhaustively verified**

---

## 1. The honest starting point

Before proposing anything: NeuralLab already contains, fully built and tested, several of the
"ambitious" ideas that a generic transformation plan would propose as new.

| Proposed-sounding capability | Already shipped | Where |
|---|---|---|
| Prediction-before-reveal | Yes, and **mandatory** | `BeginnerCourse.tsx:25–26`, `TrainingProject.tsx:19` |
| Step-by-step computation trace | Yes | `TraceVisual`, `BeginnerCourse.tsx:10–15` |
| Real Python execution of the displayed numbers | Yes | `public/python-program-worker.js` |
| Mini-batch-by-mini-batch training inspection | Yes | `TrainingProject.tsx:21` |
| Validation-based checkpoint selection + held-out policy check | Yes | `TrainingProject.tsx:21`, `training.py` |
| Local model checkpoint save/restore and inference | Yes | `TrainingProject.tsx:24` |
| Spaced review scheduling | Yes, crudely (fixed 24 h) | `progress.ts:dueForReview` |
| Multi-level representation (prose / formula / stages / Python) | Yes, within a lesson | `BeginnerCourse.tsx:23,28` |

The highest-value work is therefore **not inventing capabilities. It is removing the friction that
stops learners from reaching the capabilities that exist**, and deepening the two or three that are
genuinely differentiating.

---

## 2. Candidate ideas

### Tier A — recommended

---

#### A1. Instant local computation, Python as verification

**Mechanism.** Render every lesson's stages from `calculate()` (`src/engine/beginner.ts:4`)
synchronously on reveal. Keep the Python panel, but as an explicit "Verify this in Python" action
that re-runs the same case and displays a match/mismatch badge against the local result.

**Problem solved.** Measured: the first calculation of a session costs **5 149 ms and 11 361 233
bytes**; a new tab pays it again. The learner's first impression of a lesson about multiplying three
numbers is a multi-second spinner. On metered mobile data the course is effectively unusable.

**What exists.** The entire engine, validated against CPython for all 60 lessons × 2 cases, every
stage label, every stage value, every grid and curve (`pythonPrograms.test.mjs:19`). It has **zero
call sites in the UI**.

**What must be built.** Wire `calculate()` into `LessonWorkspace`; move the Python call behind a
button; add a comparison badge. Roughly one component plus one hook change.

**Novelty.** E — this is not an innovation, it is a correction. Listed first because it is the
single highest-value change in the plan.

**Why it also makes the product better, not just faster.** Showing "local engine: 7 · Python: 7 ·
match" turns a hidden implementation detail into a visible claim about correctness — which is
NeuralLab's actual differentiator. The verification becomes a *feature* instead of a tax.

**Risk.** Low. Divergence between the two paths is already a test failure.

---

#### A2. Addressable lessons (URL routing)

**Mechanism.** Put lesson/lab/chapter identity in the URL; restore state on load; integrate browser
history.

**Problem solved.** Verified: in-app navigation never changes the URL, and browser Back exits the
application entirely. A teacher cannot assign lesson `dl-06-003`. A curriculum Markdown document
cannot link to the lab that demonstrates it. A learner cannot resume.

**What exists.** A single `activeLesson` string in `App.tsx:60` and stable IDs everywhere
(`dl-NN-NNN`, chapter slugs, lab keys). The hard part — stable identity — is already done.

**What must be built.** Either `react-router` (~15 kB) or roughly 40 lines over the History API.
Given the dispatch is one ternary over a string union, the hand-rolled version is adequate and adds
no dependency.

**Novelty.** E. **Unblocks** A3, A6, A9 and the pre-render in the architecture plan.

**Risk.** Medium — touches the top-level dispatch and three components that take an `initialLesson`.

---

#### A3. Divergence as a lesson, not an error

**Mechanism.** When a training configuration diverges, stop raising. Return the partial history with
the step at which the update became non-finite, and render it: the loss curve climbing, the weight
magnitude exploding, the exact batch where `|w| > 1e8`, and a one-screen explanation tied to the
learning rate.

**Problem solved.** Divergence is the most common and most instructive failure in optimisation.
NeuralLab currently presents it as `ValueError: Unstable update; lower the learning rate…`
(`training.py:80`) — correct, honest, and pedagogically wasted. No reviewed competitor treats
failure as content (gap G2).

**What exists.** `training.py` already detects the condition precisely and already records a full
per-batch history. The change is to return instead of raise, and to render the truncated run.

**What must be built.** A "diverged" branch in `TrainingRun`, matching handling in the TypeScript
engine (so the differential test still passes), and a chart state for it. Note
`json.dumps(..., allow_nan=False)` means non-finite values must be replaced with a sentinel before
serialisation.

**Novelty.** **UC** — teaching through deliberate failure is well established in education; shipping
it as a first-class state in a DL visualiser appears uncommon. Not verified exhaustively.

**Risk.** Low–medium. Must not weaken the existing guard: the run is still *reported* as failed, it
is merely *shown*.

---

#### A4. Proportional, explanatory feedback

**Mechanism.** Replace "Prediction differs; review the operations and retry." with feedback keyed to
*how* and *how much* the prediction was wrong: right magnitude wrong sign; off by exactly the bias
term; correct for the worked case but not the transfer case; order of magnitude out. Then require a
short free-text restatement of the rule before the item can be retried.

**Problem solved.** This is the best-evidenced change available. In the 44-study
retrieval-vs-elaborative-encoding meta-analysis (*Educ Psychol Rev*, Dec 2025) the **overall**
advantage of retrieval practice is g = 0.14, rising to g = 0.50 **in the subset where feedback was
available**; g = 0.14 is the pooled overall comparison, not a no-feedback condition, and neither
number is an effect size for adding feedback. The defensible reading is that feedback availability
moderates the comparison strongly enough to prioritise it. Separately, rephrasing feedback beats
reading it (*J Exp Educ*, 2026); error magnitude predicts memory updating (2026). NeuralLab is
currently in the low-g condition.

**What exists.** `closeAnswer()` already computes a relative difference; every lesson already
carries a `reason` and a `mistake` string; the stage list makes the arithmetic available for
comparison against the learner's number.

**What must be built.** A small rule table mapping (guess, result, stages) → diagnostic category,
plus a text field whose content is stored but **not** auto-graded. No AI required, and deliberately
so: a deterministic rule table is inspectable, testable, free, and works offline.

**Novelty.** **EB.** Intelligent tutoring systems have done diagnostic feedback for decades; almost
no free browser DL tool does.

**Risk.** Low. The main risk is over-claiming diagnosis from one wrong number — mitigated by phrasing
diagnostics as observations ("your answer equals z before the bias was added") rather than verdicts.

---

#### A5. Design tokens that reach the canvas

**Mechanism.** `src/design/tokens.ts` exporting the same values as `tokens.css`, with a unit test
asserting parity; replace the 92 hardcoded hex literals in 12 `.tsx` files.

**Problem solved.** Verified: the CSS has 3 hardcoded colours, the visualisation layer has 92, many
from an abandoned green palette. This is why the 3D canvas renders a teal background inside a navy
application, and why no two charts agree on what "a weight" looks like.

**Novelty.** E. Listed in Tier A because every visual proposal downstream depends on it.

**Risk.** Very low, mechanical, individually verifiable.

---

#### A6. Curriculum ↔ lab deep links

**Mechanism.** Once A2 exists, make `curriculum/**/*.md` able to link to a lab or lesson with
specific parameters — for example a link whose target is `lab:gradient-depth?depth=12&kind=sigmoid`.
The existing
`onDocument` resolver in `CurriculumLibrary.tsx:15` already intercepts relative links; extend it to a
`lab:` scheme with a strict allowlist of parameters.

**Problem solved.** The three content systems are disconnected. 149 specification documents and 12
labs sit in the same application and cannot refer to each other. Only 27 of 60 lessons link to a
lab, and those links carry no state.

**What exists.** The link interception, the stable IDs, and labs whose state is already a small
parameter set.

**Novelty.** **UC.** Parameterised deep links into an interactive figure are standard on the web;
inside a self-contained curriculum reader that also owns the figures, uncommon.

**Risk.** Low, given a strict allowlist and validation (which the engines already perform).

---

#### A7. Generated practice items

**Mechanism.** For each of the 47 calculation models, add a generator producing fresh, bounded,
pedagogically equivalent input values with a known answer, seeded so an item can be reproduced and
cited.

**Problem solved.** Two measured issues. (i) All 60 lessons have exactly two fixed cases, and the
answers to both are published in the public curriculum Markdown — the transfer case's expected
result is printed in the lesson document. (ii) Spacing requires novel retrieval; replaying the same
two numbers after 24 hours measures recognition. Distributed practice shows d = 0.54 with larger
effects at longer intervals — worth implementing properly.

**What exists.** 47 validated models with explicit input-domain checks (`beginner.ts` throws precise
range errors per model), which is most of a generator specification already.

**What must be built.** A seeded generator per model family — not per model; most share a shape —
plus a property test asserting each generated case stays inside the model's valid domain and that
`calculate()` agrees with the Python program for a sample of generated cases.

**Novelty.** **E** (parameterised question banks are standard), **EB** in this product.

**Risk.** Medium. Badly generated values can be degenerate or mathematically uninteresting. Mitigate
by generating from curated ranges per model and reviewing a sample.

**Note:** this also fixes a quieter problem — the `history` model (`beginner.ts:26`) computes
`result = a`, i.e. the learner's required prediction is literally the input they typed. That item
grants evidence for free.

---

#### A8. Wire the dead chapter-review data

**Mechanism.** `chapterReviews` tasks already carry `model` and `values`; nothing reads them. After
a failed mixed review, render the full worked solution through `calculate()`.

**Problem solved.** Mixed reviews currently say "expected 0.666667; revisit its lesson operations" —
the low-feedback condition again, in the one place designed for transfer.

**What exists.** Everything. Verified: `ChapterReview.tsx` references neither `.model` nor
`.values`, and both are populated for all 16 tasks.

**Novelty.** E. Included because the cost is near zero and it compounds with A4.

**Risk.** Very low.

---

#### A9. Portable evidence

**Mechanism.** Export and import the learner's evidence as a plain JSON file carrying a non-cryptographic
integrity checksum, which detects accidental corruption and nothing else. It is **not** a signature
and proves no authorship; show what it
does and does not attest.

**Problem solved.** 60 lessons of evidence live in one `localStorage` key and vanish with a cleared
cache or a changed browser. No competitor reviewed offers portability (gap G5). The project's own
honesty about evidence ("not retained mastery") becomes more credible when the artefact is
inspectable.

**What exists.** `readProgress` already performs strict structural validation
(`progress.ts`) — the hard part of safe import.

**Novelty.** **UC** at this scale; verifiable-credential patterns exist in formal education but not
in free explainers.

**Risk.** Low. Must not imply the export is a credential. Phrase as a transcript of local practice.

---

### Tier B — worth building, after Tier A

| # | Idea | Mechanism | Novelty | Why later |
|---|---|---|---|---|
| B1 | **Branch-and-compare training runs** | Keep N completed `TrainingRun` results in memory; overlay their loss curves and parameter trajectories; label by the setting that differs | RS — iNNspector's model-generation graph is the research precedent; NeuroViz already does within-epoch pre/post comparison | Needs A2 (addressable state) to be shareable, and the chart work from the design plan |
| B2 | **Rewind and fork a training run** | `TrainingRun.batches` already stores `before`/`after` for every update. Let the learner scrub to update *k*, change the learning rate, and re-run from that exact state | **EB** — the "Gradient Descent Time Machine". NeuroViz has published the within-epoch half of this with SUS 80.97, so the idea is validated but no longer novel | Requires `train()` to accept an initial model + optimizer state; a real but contained change to `training.py` and its TypeScript twin |
| B3 | **Counterfactual single-parameter probe** | "What if w₁ were 0?" computed for real against the current engine, shown as a delta against the actual run | EB — the neuron lab's `Challenge` component (`App.tsx:38`) is already a one-parameter version of this | Generalising it needs the engines to expose a uniform "recompute with override" entry point |
| B4 | **Math typesetting for chapters 08+** | `remark-math` + KaTeX (≈60 kB gzipped) in `MarkdownDocument` | E | Chapters 00–07 genuinely do not need it; attention and matrix calculus do. Build it when writing that content |
| B5 | **Code highlighting in curriculum Markdown** | A `code` component override using a lightweight highlighter; 12 chapter documents contain fenced code that currently renders unstyled | E | Cheap, cosmetic, bundle with B4 |
| B6 | **Pre-rendered curriculum for discovery** | Build-time static HTML for the 149 reader routes | **UC** in this category — no reviewed competitor is server-rendered | Depends on A2; the only free growth channel available |
| B7 | **Offline shell + Pyodide precache** | Service worker precaching the app shell and the pinned Pyodide assets | E | Explicitly *after* A1, because per Pyodide's docs caching removes the download but not the interpreter cold start. Doing B7 without A1 would hide the problem rather than fix it |
| B8 | **Scale-aware 3D with a real camera path** | Replace the fixed 6-sphere arrangement with a scene whose geometry encodes shape, and a camera that moves between whole-network and single-weight framing | **EB** — llm-viz is the benchmark; see [EXPERIENCE_EVOLUTION.md](../design/EXPERIENCE_EVOLUTION.md) §4 | Only worth doing once there is a multi-layer network worth looking at |

### Tier C — research, not yet justified

| # | Idea | Why it is interesting | Why it is not yet justified |
|---|---|---|---|
| C1 | In-browser transformer inference for chapter 12 | transformers.js 4.2.0 + ONNX Runtime Web 1.26.0 make it genuinely feasible; Transformer Explainer proves it at GPT-2 scale | Chapters 08–18 are *specification only*. Building the runtime before the curriculum inverts the dependency. Also WebGPU is ~85 % available, so a WASM fallback path doubles the work |
| C2 | Editable Python with CodeMirror 6 | The most requested capability for any teaching tool; CodeMirror 6 at 50–200 kB is affordable; JupyterLite and marimo prove the pattern | Changes the threat model fundamentally. Today every executed program is authored and the workers are honestly documented as "not a sandbox". Arbitrary user code needs a real review, and the differential tests that make NeuralLab trustworthy do not cover user-written code. Prototype in a sandboxed route first |
| C3 | Learning-by-teaching / explain-to-a-simulated-student | Strong pedagogical literature | Any credible version needs a language model. Core functionality must not require a paid API, and a local model is a large dependency for one feature. Revisit only if C1 ships a local model for other reasons |
| C4 | Misconception diagnosis from response patterns | The lesson data already carries a `mistake` string per lesson | Diagnosis from 2-option MCQs and two fixed numeric cases is not statistically defensible. **Depends on A7** (item variety) before it can mean anything. The honest intermediate step is A4 |
| C5 | Collaborative/multiplayer workspace | Shared debugging is a real classroom need | Requires a server. Breaks the zero-budget constraint. A shareable URL (A2 + A6) covers most of the value |
| C6 | Adaptive path selection | Personalised sequencing | Needs far more signal per learner than two cases and one MCQ provide. Revisit after A7 |
| C7 | Voice / speech-driven exploration | Hands-free inspection | No evidence of demand in this category; accessibility is better served by fixing the six axe violations |
| C8 | Knowledge graph over the curriculum | `catalog.json` already encodes a validated acyclic prerequisite graph | The graph exists and is validated; the question is whether *visualising* it helps learners or only authors. Cheap experiment: render it on the library page and measure whether anyone uses it |

### Tier D — rejected

| # | Idea | Reason for rejection |
|---|---|---|
| D1 | Rewrite to Next.js / Remix | No requirement needs it. Pre-rendering (B6) can be a build script. An architectural rewrite would consume the whole roadmap and risk the differential test harness |
| D2 | Replace Three.js with a different renderer | The 3D problem is composition, camera, colour and information density — not the renderer. Swapping libraries would not change the screenshot |
| D3 | Gamification: streaks, points, badges, leaderboards | Directly contradicts the product's most distinctive trait: refusing to overstate what its evidence proves. Artificial engagement would cheapen the honesty that makes it credible |
| D4 | AI tutor chat sidebar | Would require a paid API for quality, cannot be verified against the engines, and risks presenting generated arithmetic beside differentially-tested arithmetic. The feedback problem is better solved by A4 |
| D5 | Replace Pyodide with a JavaScript Python interpreter | Would destroy the one claim that distinguishes the project: the displayed numbers are produced by real CPython |
| D6 | Drag-and-drop network builder | Playground-style configuration is well covered elsewhere and does not serve a *sequenced* curriculum. Would absorb large effort for a commodity capability |
| D7 | Mobile app (React Native / wrapper) | The responsive web layout already works at 390 px with zero horizontal overflow. A wrapper adds distribution cost for no capability |
| D8 | WebGPU compute for training | The largest model in the product fits two parameters. There is nothing to accelerate |
| D9 | User accounts and a backend | Breaks zero-budget operation. A9 (portable evidence) delivers the real need without a server |
| D10 | Rendering the curriculum as an infinite-canvas mind map | Attractive demo, no identified learner problem, high cost, poor accessibility |

---

## 3. Scoring

Scale 1–5 per criterion. **Impact** = benefit to a real learner. **Evidence** = strength of the
proof that the problem exists. **Feasibility** = inverse of difficulty. **Identity** = fit with the
product's character (honest, inspectable, verifiable, free). Cost, risk and maintenance are
subtracted. "Unc." records where the score is least secure.

| Idea | Impact | Evidence | Differentiation | Feasibility | Identity | − Cost | − Risk | − Maint. | **Total** | Unc. |
|---|---|---|---|---|---|---|---|---|---|---|
| **A1** Local-first computation | 5 | 5 | 3 | 5 | 5 | −1 | −1 | −1 | **20** | low |
| **A5** Tokens on the canvas | 4 | 5 | 2 | 5 | 4 | −1 | −1 | −1 | **17** | low |
| **A2** URL routing | 5 | 5 | 2 | 4 | 4 | −2 | −2 | −1 | **15** | low |
| **A4** Proportional feedback | 5 | 5 | 4 | 4 | 5 | −2 | −2 | −2 | **17** | med — effect size is from the literature, not from this product |
| **A8** Wire review data | 3 | 4 | 2 | 5 | 4 | −1 | −1 | −1 | **15** | low |
| **A3** Divergence as a lesson | 4 | 4 | 5 | 4 | 5 | −2 | −2 | −1 | **17** | med |
| **A6** Curriculum ↔ lab links | 4 | 4 | 4 | 4 | 5 | −2 | −1 | −2 | **16** | low |
| **A7** Generated items | 5 | 5 | 3 | 3 | 4 | −3 | −3 | −3 | **11** | med — generation quality |
| **A9** Portable evidence | 3 | 3 | 4 | 4 | 5 | −1 | −1 | −1 | **16** | med — demand unproven |
| B1 Branch-and-compare | 4 | 3 | 4 | 3 | 5 | −3 | −2 | −2 | **12** | med |
| B2 Rewind and fork | 5 | 4 | 3 | 2 | 5 | −4 | −3 | −3 | **9** | med — NeuroViz already shipped half of it |
| B6 Pre-rendered curriculum | 4 | 3 | 4 | 3 | 4 | −3 | −2 | −2 | **11** | high — discovery benefit unmeasured |
| B7 Offline shell | 3 | 4 | 2 | 3 | 4 | −3 | −2 | −3 | **8** | low |
| B8 Scale-aware 3D | 3 | 4 | 4 | 2 | 3 | −4 | −3 | −3 | **6** | high |
| C1 In-browser transformer | 4 | 2 | 5 | 2 | 3 | −5 | −4 | −4 | **3** | high |
| C2 Editable Python | 5 | 3 | 4 | 2 | 2 | −4 | −5 | −4 | **3** | high |

Scores are a sorting aid, not a decision procedure. The ordering that matters is the dependency
graph: **A5 and A1 before everything; A2 before A6 and B6; A7 before C4 and C6.**

---

## 4. Cheapest validating experiment per recommended idea

| Idea | Smallest thing that would tell us whether it is worth it |
|---|---|
| A1 | Render one lesson from `calculate()` behind a flag; measure time-to-first-number against the current 5 149 ms |
| A2 | Hash-based routing for the beginner course only; check that reload restores the lesson |
| A3 | Make one diverging configuration return a truncated history and render it; show it to three learners and ask what they think happened |
| A4 | Hand-write the diagnostic table for one chapter (7 lessons) and compare retry-to-correct counts against the other chapters |
| A6 | One `lab:` link in one chapter document |
| A7 | Generators for the five most-used models; property-test that every generated case stays in domain |
| A9 | Export only; import can wait until someone asks for it |
| B1 | Overlay two already-completed runs; no persistence, no sharing |
| B6 | Pre-render three chapter pages; check whether they get indexed at all |

---

## 5. Originality statement

Nothing in this document is claimed to be a world first. The three ideas with the strongest claim to
being *uncommon* in shipped products — A3 (failure as content), A6 (parameterised deep links from
curriculum into labs) and A9 (portable learner evidence) — are classified **UC**, meaning no example
was found in the reviewed set, which is not the same as proving none exists. B2, the most
spectacular-sounding idea, was **downgraded** after research: NeuroViz (arXiv:2605.02044, May 2026)
published a within-epoch forward/backward comparison with a usability study five months ago, so
"rewind training" is no longer novel territory. That downgrade is the kind of finding this research
was for.
