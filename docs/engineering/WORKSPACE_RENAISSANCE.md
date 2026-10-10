# Workspace renaissance: implementation and evidence

Date: 2026-10-10. Original baseline: `d1d04fe6986d94c4e145e2c538f74838cb0de94c`. Branch: `feat/learning-workspace-renaissance`. This report covers a coherent iteration of the requested transformation; it does not claim the whole research/learning roadmap is complete.

Living references: [Product](../../PRODUCT.md) · [Design](../../DESIGN.md) · [Architecture](../../ARCHITECTURE.md) · [Quality](../../QUALITY.md).

## What changed and why

The original product already had tested math, Python execution, authored practice, hint provenance, FSRS and backups. Rebuilding these would discard value. The observable problems were an undifferentiated long sidebar, permanently active Learn navigation, no addressable workspaces/history, small dense controls, repeated rounded gradient surfaces, prose-heavy progression and a neuron diagram that could not be inspected in 2D.

The delivered slice:

- Refactor the shell rail into an introductory course entry, experiment labs, workshops, curriculum and planned topics. Retain every available feature. Use a scrolling desktop rail and a mobile focus-contained drawer.
- Add whitelist-based hash workspace URLs, reload support and browser Back/Forward. Correct global selected-state indicators. Preserve storage as a new-visit resume fallback.
- Apply a scientific fieldbook composition to all 18 workspaces: quiet borders, readable body text, distinctive system-serif titles, tabular numerical typography, fewer repetitive rounded/gradient panels, and responsive controls. Preserve the supplied palette; add no runtime dependency.
- Add a chapter map derived from existing evidence and recall provenance. It expands to the actual authored topics and labels assisted/unaided practice without a mastery score or content lock.
- Add a bias mission to the existing neuron lab. The learner predicts a bias, tests the real `computeNeuron` result, gets an equation-backed explanation and restores the previous numeric configuration. Changed fixed settings disable the mission check. No course credit is awarded.
- Start the neuron lab in 2D, where the graph communicates the full calculation without loading the 3D scene bundle on entry. Keep 3D available by explicit selection. Add keyboard-accessible 2D node inspection, following the current computation stage. Consolidate shared SVG/WebGL colors. Preserve existing 3D camera controls, demand rendering, performance adaptation and 2D fallback.
- Fix audited accessibility defects: expose the interactive forward SVG as a group with keyboard-operable connections; make horizontally scrollable Python source/output keyboard-focusable; give 3D frame groups a valid accessible role.

## Inventory and decisions

All 18 initial workspaces were inspected in source and captured at 1440×1000 and 390×844. Existing functional browser tests are retained; screenshots alone do not prove every state works. Baseline images were recaptured from a temporary exported archive of the exact original commit after finding a capture race; no Git worktree or tracked baseline modification was created.

| Workspace | Existing value kept | This iteration | Remaining opportunity |
|---|---|---|---|
| Artificial neuron | Live model, parameters, timeline, Python, prediction challenge, 2D/3D | Extend: bias mission and inspectable 2D nodes; polish workbench | Fresh transfer challenges; more compact inspector on narrow screens |
| Python variables | Executed traces, variable/data-flow exercises | Polish shared typography/navigation | Concept-specific mission composition |
| Python flow | Loops, functions, objects and trace stepping | Polish shared surfaces/controls | More independently varied problems |
| Foundations | Family map, metrics, evaluation experiments | Polish hierarchy and reading widths | Consolidate lesson-specific chart tokens |
| Perceptron | Tested gates, decisions and numeric feedback | Polish composition/control legibility | Connect practice to a cross-lab mission |
| Tensors | Rank, slicing, batch selection and Python | Polish diagram/control surfaces | More accessible selection across larger tensors |
| Forward propagation | Editable connections and exact layer calculations | Polish colors; fix SVG group semantics | Extend graph-construction exercises |
| Backpropagation | Chain rule, gradient inspector and true update | Preserve engine; polish shared surface | Learner-constructed gradient paths |
| Activation | Scalar curves, derivatives and stable Softmax | Polish shared panel composition | Compare multiple functions in a single task |
| Loss | Gradient steps, learning rate and Python | Polish result/parameter hierarchy | Teach divergence as an inspectable state |
| Gradient depth | Exact gradient chains, vanishing/exploding behavior | Polish shared typography/navigation | Fresh diagnosis tasks |
| Beginner course | 60 authored lessons, prediction gates, hints, diagnostics, evidence | Polish reading/trace surfaces; scroll topic navigation | Topic URLs, mission checkpoints and review placement |
| Training project | Seeded paired batches, three optimizers, separate splits, checkpoints | Polish vocabulary/configuration surfaces | Exact optimizer-state resume; divergence explanation |
| Library | 19 chapters, 149 specs, Markdown/math and sources | Polish editorial rows and document composition | Reduce initial catalog density; distinguish specs further |
| Python execution | Genuine array trace and stepping | Polish shared surfaces | Additional variable-program tasks |
| My learning | Recommendation, FSRS, glossary, explanations and backups | Extend: chapter evidence map | Compress large glossary search results |
| Editable Python | Real editing, errors, bounds and NumPy | Polish shared editor/workshop composition | More authored advanced coding exercises |
| Matrix & loss | Cell inspection and mathematically sampled loss surface | Polish hierarchy; fix scrollable source focus | Expand contours/camera work with physical-device evidence |

No page, math engine, lesson schema, persistence contract or framework was replaced. Shared colors were refactored because duplicate literals prevent reliable consistency; the major conditional lazy workspace renderer was retained because it still has a clear, working contract.

## Research influencing decisions

Official source documents were retrieved on 2026-10-10 through their public GitHub repositories and read. Public product/documentation sites returned 403 under the cloud policy; they were not claimed as freshly browsed.

| Source | Decision influenced |
|---|---|
| [React: choosing state structure](https://github.com/reactjs/react.dev/blob/main/src/content/learn/choosing-the-state-structure.md) | Derive chapter labels and challenge outputs from existing models; do not duplicate evidence or introduce a new completion state |
| [React: effects](https://github.com/reactjs/react.dev/blob/main/src/content/learn/you-might-not-need-an-effect.md) | Keep mathematical derivation in render; effects only synchronize browser navigation, storage, focus and subscriptions |
| [WCAG 2.2: focus not obscured](https://github.com/w3c/wcag/blob/main/understanding/22/focus-not-obscured-minimum.html) | Focus-contained drawer, Escape/restoration and sticky-header scroll offsets |
| [React Three Fiber: scaling performance](https://github.com/pmndrs/react-three-fiber/blob/master/docs/advanced/scaling-performance.mdx) | Preserve existing demand rendering and visibility gating; no decorative perpetual WebGL animation |
| Existing [competitive research](../research/COMPETITIVE_LANDSCAPE.md) and [design audit](../design/EXPERIENCE_EVOLUTION.md) | Transfer overview-to-detail inspection and restrained scientific controls; do not clone references or repeat historical defects/counts as current findings |

The existing learning-science research supports retrieval, feedback and scaffolding as design directions. This iteration conducts no learner experiment and makes no claim of increased retention or teaching effectiveness. No Motion/GSAP/D3/UI toolkit was needed: native HTML, SVG and current dependencies cover the delivered behavior.

## Verification

Environment: Node 24.19.0, npm 11.9.0, Python 3.12.14 and system Chromium 154. The cloud's Playwright browser-download domains are blocked; browser checks use an ignored local executable override, not CI's exact pinned browser. Authentic Pyodide 0.27.7 files are fetched over verified HTTPS; the NumPy wheel matches the runtime lockfile SHA-256. Execution is real, not mocked.

Baseline: curriculum validation passed; 254/254 unit tests passed; typecheck/build passed. Four completed representative browser tests passed, including a real Python backprop update. The initial full baseline browser run was deliberately interrupted during the long course case; remaining tests were unrun, not reported passed.

Final checks on the frozen implementation:

| Check | Result | Scope |
|---|---|---|
| Curriculum validation | Passed | 19 chapters, 149 specifications, 20 sources, 60 authored beginner topics |
| Unit tests | 254 passed, zero failures/skips | Nine suites, including mathematical and Python correctness |
| Production typecheck/build | Passed | Vite chunk-size warnings retained and reported |
| Production browser run | 63 passed; one development-only test failed to import its module | 64 selected tests; real Python, scene lifecycle, learning evidence, training and new interactions |
| Markdown security check | Passed separately on confirmed Vite development server | Raw HTML and unsafe links rejected; trusted math rendered |
| Authored course case check | Passed in the earlier development run | All 60 topics × worked/transfer cases, explanation and reload persistence; assessment/engine code unchanged afterward |
| Automated accessibility | Zero violations in 12 final sampled scans | Six representative workspaces × desktop/mobile; baseline four flagged nodes across three scans |

Axe still marks contrast and link-in-text-block cases for manual review. Keyboard tests and responsive checks supplement the scan; this is not full WCAG conformance certification. The one production failure is the Markdown security test's direct imports of Vite-only source URLs; it passed separately in 4.1 seconds on the confirmed Vite development server. An initial server-switch attempt left the preview child process alive and repeated the same import failure; the preview process was stopped and the dev HTML verified before the successful rerun. The long authored-course case check is reused rather than falsely described as rerun on the final production server.

The current-instance setup was repeated using the saved installation script. `install_script` and `start_skill` were saved in the environment draft. Saving did not publish or validate a new task.

Earlier development verification exposed regressions in library URL assertions, the forward SVG role, workshop accessible names, and computed-hint timing. The names and roles were corrected, URL assertions now preserve the actual current workspace URL, and the computed third hint uses the established 95-second Python budget. Noncomputed hints retain their short budget. The first mixed development run recorded 35 passed, 8 failed, 1 interrupted and 20 unrun; it is not a passing suite. A subsequent development run was stopped after cold module loading produced blank-shell timeouts. Production-preview acceptance avoids that development loading variability; it does not replace Python execution or drop correctness assertions.

## Before and after comparison

| Area | Original | Delivered | Evidence |
|---|---|---|---|
| Visual identity | Repeated rounded/gradient panels and uniform cards | Fieldbook typography, quieter rules, editorial rows and distinct workbench surfaces | Paired full-page images for every workspace |
| Navigation | Storage-selected view; dense shared rail | Workspace URLs, browser history, grouped rail and mobile focus-contained drawer | URL/reload/history and keyboard browser tests |
| Learning interaction | Existing predictions, Python, evidence and reviews | Preserved; bias mission with genuine model feedback, node inspector and chapter evidence map added | Correct/wrong/fixed-settings/restore tests and interaction images |
| 2D/3D | Existing educational scene alternatives | 2D default for the neuron; explicit 3D retained with named frame semantics | Diagram tests, 3D canvas check and scene lifecycle tests |
| Accessibility | Four flagged nodes across three of 12 sampled scans | Interactive SVG group and keyboard-scrollable source/output fixes | Before/after axe JSON; manual keyboard tests |
| Performance | Entry JS 266.17 kB / 82.94 kB gzip | Entry JS 275.59 kB / 85.81 kB gzip; CSS 66.35 kB / 12.96 kB gzip | Vite build output; entry bundle grows, no field-speed improvement claimed |
| Reliability | Curriculum, 254 unit checks and representative browser baseline passed | Same engines retained; new navigation, mission and inspection coverage | Final verification logs and test sources |

Large lazy library/scene chunks remain and Vite reports chunk-size warnings. Real-user LCP, INP and CLS, learner outcomes and physical low-end-device behavior were not measured.

## Evidence and limits

The standalone gallery and complete screenshot bundle are outside the checkout at `/workspace/v9t1-evidence`; links are provided in the delivery message. Use the capture script for future comparisons. The final inventories contain 36 before and 36 after captures with zero horizontal-overflow flags. Separate interaction checks at 1440, 820 and 390 px verified the mission output, drawer behavior and layout; the explicit 3D neuron canvas and seeded evidence-map labels were also checked. Screenshots are starting states with empty local evidence and reduced motion; changed interaction states have separate images and browser tests.

Measurements distinguish actual observations from goals. Core Web Vitals are field goals, not measured outcomes. No empirical educational score, accessibility certification, low-end physical-device result, production deployment or fresh-task restoration is claimed. Shared styling improves every workspace, but bespoke missions and major composition refinements for every lab remain future work.

GitHub native read access was verified. The GitHub API returned Forbidden, so PR creation is blocked by available API access; a local reviewable branch and commits are the delivery fallback. Implementation commits are `08f445e` and `d265d86`; the final documentation commit follows them. Local-only commit restoration in future cloud tasks is not independently verified. No credential values were requested or extracted.
