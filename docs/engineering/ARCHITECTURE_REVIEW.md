# Architecture review — NeuralLab, October 2026

Audit date: 2026-10-10. Base commit: `e565635ff7e54c6fe472b3e3cef98f77d3b7739b` (main, PR #15 merged).
Environment: Node 26.7.0, npm 11.14.1, Vite 6.4.4, Chromium 141 (Playwright build 1223).

This document records what the code actually does, what was verified by running it, and the
technical changes recommended. Design and product direction are in
[PROJECT_RENAISSANCE_2026.md](../PROJECT_RENAISSANCE_2026.md) and
[EXPERIENCE_EVOLUTION.md](../design/EXPERIENCE_EVOLUTION.md). Sequencing is in
[IMPLEMENTATION_ROADMAP.md](./IMPLEMENTATION_ROADMAP.md).

Every claim below is tagged **[verified]** (observed by running code or reading the exact line),
**[inferred]** (follows from read code but not executed), or **[uncertain]**.

---

## 1. Verification performed

| Check | Command | Result |
|---|---|---|
| Dependency install | `npm install` | 234 packages. **Modified `package-lock.json` by +1533/−44 lines** — the committed lockfile is out of sync with `package.json` resolution under npm 11. **[verified]** |
| Curriculum validation | `npm run check:curriculum` | Pass. 19 chapters, 149 lessons, 20 sources, prerequisite graph acyclic; 60 beginner topics covered. **[verified]** |
| Unit tests | `npm test` | **200/200 pass**, 9 suites, 118.9 s. **[verified]** |
| Typecheck + build | `npm run build` | Pass. Bundle sizes in §5. **[verified]** |
| Security advisories | `npm audit` | 2 high, both `playwright <1.55.1` (GHSA-7mvr-c777-76hp), devDependency only. **[verified]** |
| Browser walkthrough | custom Playwright script, Chromium 141 | Neuron lab, curriculum library, markdown reader, beginner course, Python reveal, 390 px mobile. **[verified]** |
| Accessibility scan | axe-core 4.10.2 in-page | 3 views scanned, results in §7. **[verified]** |
| Production deployment | `GET https://neurallab-tau.vercel.app/` | 200, returns the SPA shell only. **[verified]** |
| Repository e2e suite | `npm run test:e2e` | **38/38 pass**, 8.6 min. Caveat: the pinned Playwright 1.55.0 expects Chromium build 1187, whose local download was corrupt; the suite was run unmodified against build 1223 (Chromium 141) via a temporary `launchOptions.executablePath` override. The suite itself was not edited. **[verified, with that caveat]** |

---

## 2. What the system is

NeuralLab is a single-page React 19 application that teaches deep-learning fundamentals by making
each numerical step of a computation inspectable. It has three content systems that barely know
about each other:

```
┌─ Interactive labs (12)          src/lessons/*.tsx + src/engine/*.ts
│    hand-built workspaces, one per concept, each with its own
│    controls, SVG visuals and (since PR #15) a Python panel
│
├─ Beginner course (60 lessons)   src/course/*.json + src/lessons/BeginnerCourse.tsx
│    one uniform lesson schema, driven by a 47-model calculation engine
│
└─ Curriculum library (149 specs) curriculum/deep-learning/**  + CurriculumLibrary.tsx
     Markdown chapter/lesson documents and a validated catalog
```

### Request-to-pixel trace for the product's core interaction

Beginner lesson, "reveal the calculation":

```
user types a prediction            BeginnerCourse.tsx:25  (input, locked once calc exists)
user clicks "Reveal calculation"   BeginnerCourse.tsx:26
  └─ execute()                     BeginnerCourse.tsx:21
       ├─ bounds-check inputs      |v| ≤ 1e6, finite
       ├─ courseCalculationPython(model, values)   src/python/courseStages.ts
       │     → emits a Python program string for this lesson's model
       └─ python.run(source)       src/python/usePythonProgram.ts:run
            └─ Worker(public/python-program-worker.js)
                 ├─ importScripts(jsdelivr pyodide 0.27.7)   ← 11.36 MB, first call only
                 ├─ exec(compile(source,'<lesson>','exec'))
                 └─ json.dumps({output, result}, allow_nan=False)
                      → {result: {result, stages[], cells?, curve?}}
  └─ setCalc(result) → TraceVisual renders stages as bars + a table
  └─ user clicks "Next operation" N times            BeginnerCourse.tsx:26
  └─ at the last stage: numeric comparison + 2-option MCQ   BeginnerCourse.tsx:27
  └─ recordPractice() → localStorage 'neurallab.beginner.v1'   src/course/progress.ts
```

**[verified]** end to end in Chromium, including the Pyodide network calls.

---

## 3. Subsystem assessment

### 3.1 Computation engines — `src/engine/` (strongest part of the codebase)

Ten pure, renderer-independent TypeScript modules: `neuron`, `forward`, `backprop`, `tensor`,
`perceptron`, `activationLab`, `lossGradient`, `gradientDepth`, `foundations`, `trainingProject`,
plus the 47-model `beginner.calculate()`.

**What is well engineered.** These modules validate inputs, throw on non-finite results, and are
covered by 200 tests. More importantly, `src/engine/pythonPrograms.test.mjs` runs **differential
tests against real CPython 3**: for all 60 lessons × 2 cases it executes the generated Python with
`spawnSync('python3', ...)` and asserts the result, every intermediate stage label, every stage
value, every grid cell and every curve point matches the TypeScript engine to 1e-8
(`pythonPrograms.test.mjs:11,19`). The three optimizers are compared update-by-update against
`training.py` (`pythonPrograms.test.mjs:12`). Backpropagation is additionally checked against finite
differences (`trainingProject.test.mjs`). **[verified]**

This is the single thing that makes the project credible as a teaching tool: the numbers shown
cannot silently drift from the numbers Python computes. **Preserve this at all costs** — it is the
asset that most of the proposals in this plan depend on.

**Where it fails.**

- **`calculate()` is dead code in the product.** `grep` shows exactly one definition
  (`src/engine/beginner.ts:4`) and **zero call sites in `src/`** outside tests. The only import of
  that module from UI code is `closeAnswer` (`BeginnerCourse.tsx:7`, `ChapterReview.tsx:1`). A
  fully validated, instant, dependency-free engine for every one of the 60 lessons sits unused while
  the UI blocks on an 11 MB download to compute the same number. **[verified]**
- **`chapterReviews` tasks carry `model` and `values` that nothing reads.** `ChapterReview.tsx`
  consumes only `prompt` and `expected`; `grep` for `.model`/`.values` in that file returns nothing.
  All 16 review items already contain everything needed to render a worked solution through
  `calculate()`. **[verified]**
- `src/engine/foundations.ts`, `activationLab.ts` etc. each define their own colour-free data
  shapes, but the *lessons* that render them hardcode colours (see §6).

### 3.2 Python execution — `public/*.js`, `src/python/`

Two workers with different lifetimes:

| | `python-worker.js` (trace lab) | `python-program-worker.js` (everything else) |
|---|---|---|
| Runtime reuse | **None** — `usePythonExecution.ts` calls `stop()` (worker `terminate()`) inside `onmessage`, so every run re-initialises Pyodide | `let runtime` is module-scoped and reused across messages (`python-program-worker.js:2,6`) |
| Tracing | `sys.settrace` line events with per-frame globals/locals/stdout snapshots | none; stdout capture only |
| User code | fixed programs selected by an `example` key | generated program string, ≤ 60 000 chars |

The `sys.settrace` tracer (`python-worker.js:51–56`) is genuine and good: it captures `f_lineno`,
`f_code.co_name`, filtered locals and globals, and real NumPy `shape`/`dtype`/`nbytes`. The claim in
the README that values are not fabricated in TypeScript holds. **[verified by reading + the
differential tests]**

**Measured cost** (Chromium 141, this machine, jsDelivr):

| Event | Time | Bytes from CDN |
|---|---|---|
| First "Reveal calculation" of a session | **5 149 ms** | **11 361 233** (pyodide.js, pyodide.asm.js, pyodide-lock.json, python_stdlib.zip, pyodide.asm.wasm) |
| Subsequent reveal, same page | **101 ms** | 0 |
| First reveal in a *new tab* | **4 537 ms** | **11 361 233 again** |

**[verified]** The 11 MB is paid once per browser context that opens a worker, not once per user.
On a 3 Mbit/s connection that is ~30 s before the first arithmetic appears; on a metered mobile plan
it is 11 MB of data to multiply 2 × 3 + 1.

Three consequences:

1. **The product's core loop has a hard network dependency for a computation it can already do
   locally in microseconds.** The fix is not to make Pyodide faster — per the Pyodide docs a service
   worker can cache the assets but a loaded interpreter cannot be serialised, so cold start remains.
   The fix is to render from `calculate()` immediately and make Python an explicit *verification*
   step. See roadmap M0-3.
2. `usePythonExecution` destroying its worker per run is an inconsistency with `usePythonProgram`,
   not a correctness bug, but it makes the trace lab pay the full cold start on **every** run.
   **[verified by reading `usePythonExecution.ts` `run()` → `w.onmessage` → `stop()`]**
3. `json.dumps(..., allow_nan=False)` (`python-program-worker.js:15`) turns any NaN/Inf result into
   a thrown error rather than a value. `training.py:79` pre-empts this by raising a readable
   `ValueError` on divergence — which is honest, but means **the single most instructive failure in
   deep learning (a diverging run) is presented as an application error rather than a plotted
   curve**. **[verified by reading; divergence not reproduced in-browser]**

**Security boundary.** The workers are correctly described in their own comments as responsive
isolation, not a sandbox. Input validation is duplicated in the hook (`trace.ts`) and re-applied
inside the worker (`python-worker.js:6–13`) — defence in depth, correct. `MarkdownDocument` passes
`skipHtml` and does not use `rehype-raw`, so curriculum Markdown cannot inject HTML
(`MarkdownDocument.tsx:4`). **[verified]** No `dangerouslySetInnerHTML` anywhere in `src/`.

### 3.3 Routing and state — the clearest structural gap

`App.tsx:60` holds the entire application route in `useState`, and `App.tsx:82` dispatches it
through a 15-branch nested ternary. There is no router, no URL state, no history integration.

Measured consequences **[verified]**:

- Navigating from the neuron lab to the curriculum library leaves the URL at `http://127.0.0.1:5180/`.
- Pressing the browser Back button from any in-app view navigates **out of the application**
  (`about:blank` in a fresh context; the previous site in a real session). In-app navigation creates
  zero history entries.
- No lesson, chapter, or lab can be linked to, bookmarked, shared with a student, or cited from the
  curriculum Markdown.
- Reloading always returns to lesson `neuron`, discarding where the learner was — while their
  *evidence* persists in `localStorage`. Progress is remembered; position is not.

This is a 60-lesson course with no addressable lessons. It is the highest-leverage structural fix in
the plan because several other proposals (deep links from Markdown to labs, resumable sessions,
shareable experiment states) are blocked on it.

Component state is otherwise reasonable: Zustand holds only the neuron lab
(`src/store/lab.ts`, 38 lines, correct clamping and a clean `snapshot()` reset); each lab owns its
own `useState`. There is no global state sprawl. **[verified]**

### 3.4 Content architecture

Three schemas, no shared model:

| Source | Shape | Consumer | Validated by |
|---|---|---|---|
| `curriculum/deep-learning/catalog.json` | chapters, lessons, sources, prerequisites | `CurriculumLibrary` | `scripts/validate-curriculum.mjs` |
| `curriculum/**/*.md` | prose documents | `CurriculumLibrary` via `import.meta.glob` | link resolution in the same script |
| `src/course/{foundations,neural,training}.json` | the `Lesson` interface | `BeginnerCourse` | `scripts/validate-beginner.mjs` |

Measured uniformity of the 60 authored lessons **[verified]**:

- 60/60 have exactly **2 practice cases** and exactly **2 MCQ choices**.
- Correct-answer index is balanced (31 × index 0, 29 × index 1), so there is no positional tell.
- 2–4 vocabulary terms each; 47 distinct calculation models; 27/60 link to an interactive lab.
- Mean explanation length 309 characters.

Two problems follow from the schema, not the authoring:

1. **The assessment items are published alongside the course.** `curriculum/.../dl-06-001.md`
   states "Transfer case — Inputs: [-2]. Result: -4", and `neural.json` expects exactly that for the
   item that grants evidence. The transfer case is the *only* novel-input check in the lesson, and
   its answer is in a public document. **[verified]**
2. **A fixed 2-item bank cannot support spacing.** `dueForReview` (`progress.ts`) marks a lesson due
   after 86 400 000 ms, but re-practice replays the same two numbers the learner has already seen,
   so the review measures recognition, not retrieval. This is a schema limit: `cases: [Case, Case]`
   is typed as a 2-tuple (`src/course/types.ts`).

`CurriculumLibrary.tsx:4` loads **every** Markdown file eagerly
(`import.meta.glob(..., { eager: true })`), which is why that chunk is 428 kB (§5).

### 3.5 Graphics

| | Where | Size | Notes |
|---|---|---|---|
| 3D | `src/visuals/NeuronScene.tsx` only | 77 lines | The *only* `@react-three/fiber` usage in the app |
| 2D SVG | `NeuronDiagram`, `ActivationPlot`, inline SVG in 9 lesson files | — | Hand-written path strings and coordinate maths per lab |

`NeuronScene` is a competent minimal scene: sprite-based labels avoid DOM portals so the 2D/3D
toggle is safe (its own comment at line 11 explains this, correctly), and `CanvasTexture` is disposed
on unmount (line 25). But it hardcodes `Y=[1.48,0,-1.48]` — exactly three inputs — a fixed camera at
distance 11.5/fov 44, and ten literal hex colours including the canvas background `#092328`
(line 72), which is a **teal from a palette the project migrated away from**; the design tokens set
`--background:#0B1020` navy. `index.html:6` still ships `theme-color="#092328"` too. **[verified]**

Three.js + drei + fiber are **statically imported** by `App.tsx:8`, so every first visit downloads
the whole 3D stack whether or not the learner ever views 3D, and regardless of viewport. On the
390 px mobile layout the 3D canvas is ~240 px tall with sprite labels rendering at roughly 5 px —
unreadable — yet 3D is still the default whenever WebGL is available (`App.tsx:58`). **[verified
from the captured 390 px screenshot]**

### 3.6 Testing and CI

Strong where it exists, with specific holes:

- 200 unit tests including real-CPython differential checks — excellent. **[verified]**
- 17 Playwright spec files, **38 tests, all passing** in 8.6 minutes. They exercise every lab, all
  120 course cases, real Pyodide execution, cancellation, keyboard flows, reduced motion and 390 px
  layouts. Coverage of the *journeys* is genuinely good. **[verified]**
- `tsconfig.json` `include` is `["src", "vite.config.ts"]`, so **`tests/` and `scripts/` are never
  typechecked** by `tsc -b`. **[verified]**
- **No linter and no formatter** anywhere in the repo (no `eslint.config.*`, `.eslintrc*`,
  `.prettierrc*`). **[verified]**
- CI (`.github/workflows/ci.yml`) runs `npm install`, not `npm ci`, and sets
  `cache-dependency-path: package.json` while a `package-lock.json` exists. Given that a fresh
  `npm install` here rewrote the lockfile by 1533 lines, CI is not installing a reproducible tree.
  **[verified]**
- No bundle-size budget, no accessibility job, no deploy workflow in the repository (deployment is
  wired through Vercel's git integration, outside version control).

---

## 4. Code style as an architectural risk

The source is written in a near-minified style: `src/styles.css` is 41 302 bytes across 254 lines;
`src/lessons/BeginnerCourse.tsx` is 10 998 bytes across 41 lines, with single lines exceeding 2 000
characters (`BeginnerCourse.tsx:27` renders the visual, the result, the question, the choices and
the submit handler on one line). **[verified]**

This is not a cosmetic complaint. It has measurable costs:

- Line-level `git blame`, review comments and merge conflicts all operate at the granularity of an
  entire feature.
- Stack traces and error boundaries point at a line containing a dozen responsibilities.
- It is the most likely reason there is no linter: most rules would be unusable.

Recommendation: adopt Prettier with a wide `printWidth` and reformat in **one** mechanical commit
with `.git-blame-ignore-revs`, before any feature work in Milestone 1. Low risk, high compounding
return. This is a prerequisite for outside contribution, which a zero-budget educational project
eventually needs.

---

## 5. Performance

Production build **[verified]**:

| Chunk | Raw | gzip |
|---|---|---|
| `index-*.js` | **1 260.78 kB** | 351.17 kB |
| `CurriculumLibrary-*.js` | 428.29 kB | 105.51 kB |
| `BeginnerCourse-*.js` | 115.42 kB | 37.10 kB |
| `TrainingProject-*.js` | 17.32 kB | 6.22 kB |
| `index-*.css` | 40.69 kB | 8.05 kB |

Dev-server module transfer on first paint, largest contributors **[verified]**:
`@react-three/drei` 3 694 kB, three.js chunks 1 566 + 1 253 + 1 076 kB, `lucide-react` 853 kB.

Three concrete causes, all cheap to fix:

1. **The 3D stack is in the entry chunk.** `App.tsx:8` statically imports `NeuronScene`. Converting
   it to `lazy()` behind the existing `view==='3d'` switch moves ~900 kB out of first paint for every
   learner who starts in 2D or on mobile.
2. **`lucide-react` is imported as a barrel** (`App.tsx:4` and most lesson files). Vite tree-shakes
   this in production, but it is 853 kB of dev-server modules and a known source of slow HMR; the
   `lucide-react/icons/*` deep paths remove the cost in both modes.
3. **Every curriculum Markdown document is eager.** `CurriculumLibrary.tsx:4`; switching to
   `eager: false` and `await documents[path]()` makes that chunk a few kB and loads one document on
   demand.

No `manualChunks`, no `build.chunkSizeWarningLimit`, no compression config in `vite.config.ts`
(6 lines total). No `manifest.webmanifest`, no service worker — so no offline operation, and
`GET /favicon.ico` returns 404. **[verified]**

**Server-rendered content: none.** `https://neurallab-tau.vercel.app/` returns only the SPA shell
with the `<title>`. For a free educational product, 149 chapter and lesson documents are invisible
to search engines and to link previews. **[verified]** A pre-render step for the curriculum reader
would be the cheapest discovery channel the project can buy — it costs nothing at build time and
nothing at runtime.

---

## 6. Design-system boundary violation

The CSS is almost token-pure: `src/styles.css` contains **3** hardcoded hex colours
(`#93c5fd`, `#c4b5fd`, `#fff`); everything else resolves through `src/design/tokens.css`.

The *visualisation* layer is the opposite: **92 distinct hardcoded hex colours across 12 `.tsx`
files** **[verified]**.

| File | Distinct hex colours |
|---|---|
| `src/lessons/FoundationsLab.tsx` | 24 |
| `src/lessons/ForwardLab.tsx` | 15 |
| `src/lessons/BackpropLab.tsx` | 15 |
| `src/visuals/NeuronScene.tsx` | 10 |
| `src/lessons/PerceptronLab.tsx` | 10 |
| `src/lessons/LossGradientLab.tsx` | 9 |
| `src/lessons/ActivationExplorer.tsx` | 8 |
| `src/lessons/GradientDepthLab.tsx` | 6 |
| `src/visuals/ActivationPlot.tsx` | 5 |
| `src/visuals/NeuronDiagram.tsx` | 4 |
| `src/lessons/BeginnerCourse.tsx` | 3 |
| `src/lessons/TrainingProject.tsx` | 2 |

Many are survivors of the abandoned green/mint palette (`#B2D7C1`, `#A8D8BE`, `#DAF7BA`, `#BDF6BC`,
`#93BCB0`, `#092328`, `#F4FFF3`). `docs/NEURALLAB_PLATFORM_ARCHITECTURE.md` already flags this as
unfinished; this audit quantifies it.

The root cause is that design tokens exist only as CSS custom properties, which SVG `stroke`/`fill`
attributes and Three.js materials cannot reach without being written by hand. The fix is a single
`src/design/tokens.ts` exporting the same values, generated from or asserted against `tokens.css` in
a unit test so they cannot drift. Roughly 92 edits, zero behaviour change, mechanically verifiable.
**Also fixes a semantic bug**: in `NeuronScene.tsx:47` the variable named `green` holds `#638BFF`,
the *blue* input token — a leftover rename that will mislead the next editor.

---

## 7. Accessibility

axe-core 4.10.2, Chromium 141, 1440 × 900, default state of three views **[verified]**:

| View | Violations |
|---|---|
| Neuron lab | 4: `aria-prohibited-attr` (serious, 1 node), `color-contrast` (serious, 6 nodes), `heading-order` (moderate), `landmark-unique` (moderate) |
| Beginner course | 1: `color-contrast` (serious, 5 nodes) |
| Curriculum library | 1: `color-contrast` (serious, 5 nodes) |

The most consequential is `aria-prohibited-attr` on `.three-wrap`: `NeuronScene.tsx:70` puts
`aria-label` on a plain `<div>` with no role, so **the product's signature visual carries no
accessible name at all** — the one affordance the author wrote is ignored by assistive technology.
Adding `role="img"` makes the existing label valid; a text alternative that reports the current
step and values would make it genuinely usable.

`color-contrast` failures are consistently the `small` "Soon"/week labels in the sidebar
(`.planned .lesson-name small`), i.e. one CSS rule, not a scattered problem.

Typography, measured on rendered nodes **[verified]**:

- Neuron lab: **14 text nodes at 7.5 px, 5 at 9 px, 51 at 10 px** — 70 nodes below 11 px on one screen.
- The stylesheet declares **24 distinct `font-size` values**; 94 of ~140 declarations are ≤ 13 px,
  including one 7 px and one 8 px. There is no type scale.
- Beginner course body paragraphs render at an estimated **171, 155, 142, 133, 133 characters per
  line** at 1440 px against a 45–75 character readability target.
- **29 media queries at 20 distinct breakpoints** (440, 450, 520, 600, 650, 670, 700, 900, 1000,
  1050, 1100, 1120, 1150, 1170, 1180, 1200 …), defined per component.

What is already right and must not be regressed: a skip link (`App.tsx:67`), a global
`prefers-reduced-motion` block, `aria-current` on lesson navigation, `role="status"` on every async
surface, keyboard-operable transport controls, and `0 px` horizontal overflow at 390 px
(**[verified]**).

---

## 8. Dependencies

| Package | Version | Assessment |
|---|---|---|
| react / react-dom | 19 | Current, keep |
| three | ^0.175 | Behind current releases; pinned via `@types/three`. Upgrade only alongside the graphics work |
| @react-three/fiber / drei | ^9 / ^10 | Appropriate, but must become lazy (§5) |
| zustand | ^5 | 38 lines of usage; justified, keep |
| react-markdown + remark-gfm | ^10 / ^4 | Correct choice; needs `remark-math` + a math renderer and a code highlighter (see [EXPERIENCE_EVOLUTION.md](../design/EXPERIENCE_EVOLUTION.md) §5) |
| lucide-react | ^0.468 | Fine; switch to deep imports |
| Pyodide (CDN, pinned) | 0.27.7 | Pinned hash-free CDN URL in two worker files. Upstream is now on CPython-aligned versioning (314.0.7, Sep 2026); `0.27.8` is the maintained tag on the 0.27 line. Upgrading is **not** urgent and should not be bundled with other work |
| @playwright/test | 1.55.0 exact | 2 high advisories; bump to ≥ 1.55.1 |

Nothing in the tree is unmaintained or inappropriately licensed. The notable absences are a linter,
a formatter, and any math/code-highlighting renderer.

---

## 9. Recommended technical changes, in dependency order

| # | Change | Why | Risk |
|---|---|---|---|
| A1 | `src/design/tokens.ts` + a test asserting parity with `tokens.css`; replace the 92 literals | Single source of truth for colour; unblocks every visual change | Very low, mechanical |
| A2 | **Keep Python as the authoritative calculation source.** Reduce its cost instead: warm the worker on course entry so the download overlaps with reading, precache the pinned assets, and offer an explicitly labelled *preview* from `calculate()` that is replaced by the Python result when it arrives | Python execution is a product requirement, not an implementation detail: the lesson text promises the learner that Python computed the numbers. The 11 MB / 5 s cost is real but must be paid off by scheduling and caching, not by swapping the engine | Low — the two paths are already proven equal by `pythonPrograms.test.mjs`, and any preview must be labelled as such |
| A3 | URL routing (lesson/lab/chapter in the path), browser history, resume-last-position | Unblocks deep links, sharing, citations from Markdown, and analytics | Medium — touches `App.tsx` dispatch and three lesson components |
| A4 | `lazy()` the 3D scene; `eager: false` for curriculum Markdown; deep-import icons | ~900 kB + 428 kB out of first paint | Low |
| A5 | `role="img"` + live text alternative on the 3D canvas; fix the `small` contrast rule; heading order | Closes all 6 axe violations | Low |
| A6 | Prettier + a `.git-blame-ignore-revs` reformat commit; ESLint with `react-hooks`; add `tests`/`scripts` to `tsconfig` | Makes the codebase reviewable and contributable | Low, but must be one isolated commit |
| A7 | CI: `npm ci`, lockfile cache key, bundle-size budget, an axe job | Reproducible builds; prevents regression of A4/A5 | Low |
| A8 | Pre-render the curriculum reader to static HTML at build time | The only free discovery channel available to a zero-budget project | Medium |
| A9 | Service-worker precache of the app shell + Pyodide assets | Offline second visits. Note: per Pyodide's docs this removes the *download*, not the interpreter cold start — which is exactly why A2 comes first | Medium |

Explicitly **not** recommended: migrating state management, adopting a meta-framework, replacing
Three.js, replacing Pyodide, or restructuring `src/engine/`. See
[PROJECT_RENAISSANCE_2026.md](../PROJECT_RENAISSANCE_2026.md) §"What not to build".
