# NeuralLab: evidence-driven design and engineering roast

Inspected 10 October 2026. Audited checkout: `/workspace/V9T1`, commit `75df2438839a1ee80821c30cee27009a408689f6`, branch `feat/learning-workspace-renaissance`. The audit targets the current redesigned application, not its older baseline. No application code, tests, dependencies or tracked documentation were changed. Audit scripts and artifacts live outside the checkout.

Read this with [the complete page audit](PAGES.md), [the ranked implementation backlog](BACKLOG.md), [the screenshot gallery](index.html), and the raw browser records under `evidence/`.

## A. Executive roast

**The software has more discipline than the learning interface.** The mathematical engines, Python traces and evidence rules execute real operations. The interface still presents those operations as long worksheets with a navigation system bolted beside them. It makes the student manage the product's organization while trying to learn the subject.

The accusation that this is merely a fake AI-generated demo is not supported. A tested gradient update changed loss from **0.1058 to 0.0768**; Softmax still summed to **1.000** after changing a logit; a matrix edit changed the selected result to **8**; the bias challenge produced **0** for the wrong attempt and **1.5** for the right one. Those are functioning models. Screenshots cannot tell who wrote the code, and this audit makes no authorship claim.

The student-project impression comes from unfinished product composition: microscopic graph labels, equal-looking action buttons, support activities piled below the main task, competing navigation vocabularies, disconnected persistence rules, and feature-specific styling surviving beneath a shared theme. The teal and serif shell is recognizable. Repeating it does not solve the task hierarchy inside each workspace.

At **320px**, neuron weight labels render at approximately **4.97px**, the first beginner prediction begins **2,344px** down the document, and the curriculum index is **8,849px** tall. The absence of horizontal overflow is a weak victory when the mathematics is unreadable and the learner's task is several screens away.

There are also real failures beneath the visual polish. A blocked curriculum chunk erased the entire app, including navigation. The modal drawer allowed the header to navigate behind it. Leaving the bias challenge retained its parameters but discarded its recovery snapshot. These are reproducible defects, not aesthetic dislikes.

The interface spends too much effort announcing that its calculations are “actual,” “real,” or “never decorative.” Demonstrate that through inspectable values. Students should encounter the problem, their prediction and its consequence before a defense of the implementation.

### First impression: ten direct answers

1. **Educational product or demo?** An engineered learning prototype. It has authentic computations and course records; its journeys and recovery behavior are unfinished.
2. **Recognizable identity?** Yes: near-black teal, slate/aqua signals and serif titles. Legacy chart greens, amber highlights, native blue sliders and the gray editor weaken its consistency.
3. **Careful or assembled?** The shell is deliberate. The interior pages often feel accumulated: a main experiment, metrics, a binary check, a footnote and a code listing repeat regardless of the concept.
4. **Hierarchy?** Clear workspace titles; weaker hierarchy among controls, proof, practice, recall and reference material. The beginner course is the clearest failure.
5. **Expensive, cheap, generic or distinctive?** Restrained laboratory styling with prototype-level detail. The 5px mathematics, native cancellation button and mismatched editor expose the unfinished work more than any missing animation.
6. **Trust?** Trust the bounded examples enough to experiment, supported by inspected engines and functional checks. Do not infer validated teaching effectiveness, universal reliability or mastery from them.
7. **Would students explore?** The live graph and visible controls invite exploration. Whether students actually engage requires observation; the dense controls and long support sections add friction.
8. **Memorable?** The neuron equation and dark fieldbook identity are recognizable. Most other labs have the same visual silhouette, reducing topic-specific memory cues.
9. **Application or boxed HTML?** The numerical core behaves as an application. Course and library composition often behaves as a long document; topic/document history and contextual task transitions are missing.
10. **Five most embarrassing visual problems:** tiny mobile graph labels; a first beginner prediction below 2,344px; repeated blue metric tiles inside larger containers; a gray syntax editor and native blue sliders breaking the visual system; inconsistent module/week/lecture/sidebar numbering that looks like course metadata leaked into product navigation.

## Inspection coverage and limits

System Chromium 154 inspected all **18 workspace routes at 1440, 1280, 768, 390 and 320px**: **90 full-page captures in a fresh browser context per width**, DOM inventories, headings, control sizes, source references, scrolling and startup error checks. All 90 starting states had zero horizontal page overflow and no JavaScript startup errors. This does not prove every interactive state fits.

Fresh interactions exercised every workspace, mostly at 768px, with additional 320px navigation, mission, 3D, loss and layout probes. Real Python used the existing authentic pinned Pyodide 0.27.7 asset mirror; no calculation was mocked. Direct CDN execution was also tried without the mirror: this environment's Chromium rejected the certificate with `ERR_CERT_AUTHORITY_INVALID`. That is an environment-specific access limitation, not proof that the public product universally fails.

The audit ran **36 axe-core scans**: all 18 workspaces at 1440 and 390px. **Nine scans flagged 53 node occurrences**, counting the same nodes again across widths, across five workspaces. Contrast, SVG semantics and keyboard scrolling defects are detailed below. Automated results are not full WCAG certification; incomplete contrast/link cases, screen-reader behavior and actual touch devices need separate assessment.

The earlier validation logs on the same implementation are supporting evidence: 254 unit tests, 63 production browser tests, the separate development-only Markdown security test and all 60 authored worked/transfer lesson pairs. They are **not described as rerun during this audit**. Fresh audit interaction assertions are recorded separately. Test-harness selector/timing mistakes are retained in logs and corrected; they are not product defects. Reduced-motion playback passed after waiting for the browser preference change to apply.

Library traversal and document coverage are recorded in `evidence/library-documents.json`; the coverage appendix below gives exact totals and omissions. Planned specifications are not implemented interactive lesson routes. No learner study, physical-device performance measurement, browser compatibility matrix, assistive-technology certification or field Core Web Vitals measurement was performed.

## B. Top 20 problems

The order combines likelihood, task obstruction and breadth. “High” does not mean a security vulnerability. All observations below are verified browser behavior, inspected implementation behavior, or explicitly identified design judgments.

| Rank | ID | Problem | Type |
|---|---|---|---|
| 1 | R01 | A lazy download failure removes the entire app and its navigation | Reproduced reliability defect |
| 2 | R02 | Mobile graph text shrinks to approximately 5–8px | Measured readability weakness |
| 3 | R03 | The beginner prediction task is buried behind support and administration | Measured layout weakness |
| 4 | R04 | The modal drawer permits background navigation and external focus | Reproduced modal defect |
| 5 | R05 | Leaving a mission removes recovery while retaining challenge parameters | Reproduced state-ownership defect |
| 6 | R06 | Tensor indices, activation legends and editor tokens fail contrast | Automated and computed-style finding |
| 7 | R07 | Gradient SVG hides interactive semantics; Space does not select layers | Automated and keyboard defect |
| 8 | R08 | Mobile truth-table scrolling lacks a keyboard focus target | Automated/source finding |
| 9 | R09 | Inspector tabs omit expected tab keyboard/panel behavior | Keyboard/source finding |
| 10 | R10 | Topics and reference documents have no individual URLs/history | Reproduced navigation limitation |
| 11 | R11 | First chapter detail opens thousands of pixels after its catalog entry | Measured layout weakness |
| 12 | R12 | Chapter review remains on CH-00 when the learner opens a CH-07 topic | Reproduced context mismatch |
| 13 | R13 | Lab/project practice and authored-course persistence have incompatible lifetimes | Source/visible-contract weakness |
| 14 | R14 | Primary, secondary, disabled and transport actions compete visually | Design judgment supported by captures |
| 15 | R15 | Shared styling overlays a second set of feature-specific rules | Source maintainability finding |
| 16 | R16 | Several end checks test recognition after exposing the principle | Educational design weakness; outcomes unmeasured |
| 17 | R17 | Gradient/contour plots lack enough readable scale information | Visible/source interpretation weakness |
| 18 | R18 | Matrix inputs silently discard invalid edits | Reproduced input-feedback defect |
| 19 | R19 | Dashboard search produces unexplained empty results | Reproduced empty-state defect |
| 20 | R20 | Unrelated labs repeat the same container/metric/check rhythm | Design judgment supported by multiple pages |

Each ID has exact evidence, root cause, user impact, fix, priority, complexity, dependencies and acceptance criteria in [BACKLOG.md](BACKLOG.md). Additional engineering findings are below; nothing is being fixed as part of this audit.

## C. Page-by-page review

[PAGES.md](PAGES.md) gives a separate review of all 18 actual routes, including first impression, visual/layout/interaction/engineering/educational problems, preservation decisions, page-specific redesign and priority. The gallery has every requested width; it also includes changed states, failure probes and chapter documents.

## D. Design system critique

### Detected generic patterns: purpose and remedy

| Pattern and location | Why it feels assembled; actual harm | Principle | Decision and practical alternative |
|---|---|---|---|
| Nested rounded experiment/parameter/metric containers across tensor, activation, backprop and loss | Many values have the same blue background and visual emphasis; supporting arithmetic competes with the model | Hierarchy and grouping by task | Improve. Preserve containers around editable systems; render supporting calculations as a ledger or inline equation |
| Repeated eyebrow → headline → two-column experiment → concept check → footnote/code sequence | The template dominates differences between slicing, gradients and classification | Task-specific composition and rhythm | Replace page composition incrementally; retain shared primitives and real calculations |
| Repeated “actual/real/not decorative” copy | Describes implementation provenance instead of the next learner action; useful limits blend with defensive copy | Relevance and progressive disclosure | Simplify. One objective above the interaction; place authority, scope and source details in an expandable reference area |
| Decorative section icons and repeated LIVE badges | Usually add little information beyond an adjacent title; they consume attention in already dense headers | Signal-to-noise | Remove redundant instances; preserve icons with recognizable functions such as navigation and reset |
| Identical emphasis on multiple buttons, especially pre-execution Python states | Disabled transport resembles the action that starts learning | Action hierarchy and state clarity | Improve shared action variants and group controls by phase |
| Feature-specific green/amber graph colors and gray editor | Meaning and identity drift between pages despite a palette module | Consistency and semantic color | Consolidate state colors and syntax roles; do not remove useful negative/selected distinctions |

The current inspected version does **not** support a roast about floating particles, random auto-spinning objects, ubiquitous glassmorphism, purple SaaS styling or an oversized marketing hero. Those are absent. The prominent problem is repetitive task composition. Cards, Flexbox and gradients are not defects by themselves.

### Color

The background/text pairing is readable in the scanned states; several selected/dimmed states are not. Selected tensor index text measures **2.28:1** against its aqua fill. Inactive activation legend text measures **3.58:1** after opacity. Editor red tokens measure **4.08:1** on the active line and **4.38:1** elsewhere. These particular small-text states need **4.5:1**.

Do not throw away the teal/slate palette. Separate mathematical roles from interactive states: input, weight, negative contribution, selected connection, positive outcome and error should have documented meanings. A selected fill must not reduce text contrast. Multiple “teal” aliases and ad hoc greens are a maintenance problem, not evidence that teal is inherently generic.

### Typography and density

Serif titles create a real distinction between workspace identity and utility controls. The failure is the lower end of the scale: 9–11px metadata, 8px mobile timeline labels and scaled SVG text around 5px. Large titles and output numbers cannot compensate for illegible operands. Supporting prose is generally bounded in width, but the course loads vocabulary, caveats, recall and explanation into the same vertical task.

Use readable body and mathematical labels, tabular numbers where values change, and a compact but consistent metadata scale. Essential diagram labels need a responsive design, not merely a smaller SVG. Mathematical notation should remain connected to the selected object and stage.

### Spacing, surfaces and motion

Spacing is mostly consistent within individual pages. Cross-page surface language remains mixed: the shared layer removes some panel borders while nested panels keep their historical treatment; metric blue boxes still dominate several labs. The neuron diagram ends well before its tall parameter rail, leaving a large quiet region before the result row. On mobile the result row becomes a separate destination far below the controls.

Motion is largely purposeful: stage replay, changing numerical state and optional 3D camera navigation. Reduced motion pauses neuron playback; visibility/demand-rendering cleanup is implemented. There is no evidence of perpetual decorative animation. Preserve that restraint. Improve the relationship between selected stage, diagram, inspector and displayed final values instead of adding animation libraries.

### Major component decisions

| Component | Visual/function/interaction assessment | Accessibility and engineering assessment | Decision |
|---|---|---|---|
| Header | Brand, Learn, Curriculum and My learning are clear on desktop; Learn always targets neuron. Mobile hides global links behind an unlabeled-by-sight book icon | Native links exist for global navigation; background header remains active during modal | Refine destination wording and modal ownership |
| Sidebar | Useful groupings, but module/week/lecture numbering mixes systems; long independently scrolling list | Buttons prevent native link actions; named drawer, Escape and focus restoration work, background isolation fails | Keep grouping; use genuine links and coherent ordering |
| Workspace title/“hero” | No marketing hero; serif headings provide identity, repeated badges add clutter | Headings are present; copied module metadata is inconsistent | Keep titles; remove redundant status decoration |
| Buttons | Many correct disabled states, weak relative emphasis; training cancel escapes shared styling | Main controls are labeled; several custom widget keyboard contracts are incomplete | Consolidate a small action hierarchy |
| Panels/cards | Useful boundaries for an experiment; too many arithmetic/metric tiles repeat the same look | Shared global selectors create cascade coupling | Reuse boundaries, simplify proof and reference surfaces |
| Inputs/sliders | Numerical manipulation is real; native blue sliders and silent invalid matrix edits break consistency | Many labels include current value/endpoints; 16px range boxes are not automatically WCAG failures because spacing exceptions matter | Refine editing feedback and touch/keyboard affordances |
| Tabs/mode switches | Function toggles usually expose pressed state; neuron tabs imply richer behavior than they implement | Missing tab-panel linkage/arrow navigation; plain button groups elsewhere are more honest | Implement a complete tab widget or use button-group semantics |
| Modal drawer | Visually contained with scrim and scrolling | Header remains outside the scrim and interactive; focus moves outside on route change | Correct modal semantics/behavior |
| Tooltips | Mostly native title hints, not an elaborate tooltip system | Accessible names already identify important controls; native hover hints are supplementary | Preserve when useful; do not introduce hover-only instructions |
| Lesson panels | Vocabulary, real Python, hint ladder and diagnostics all exist; too many compete at once | Evidence gates/hint provenance are tested; topic selection and chapter review context are separate | Recompose into task plus optional help/review |
| Progress/map | Assisted, unaided and recall states are differentiated in text; dots are too subtle to carry the hierarchy | Model-derived states and native details are appropriate; sidebar lab practice has different persistence | Preserve honest states; clarify scope and resumable workflow |
| 2D diagrams | Model-connected, often directly selectable; mobile text scaling fails | HTML equivalents exist for some diagrams; gradient chart semantics remain defective | Keep 2D primary and redesign small-screen inspection |
| 3D scenes | Optional, selectable and numerically connected; little additional value for a single flat neuron | Error fallback, keyboard alternatives and demand rendering exist; inspectors can show final values before timeline labels do | Preserve optional scenes; align stage semantics and reserve 3D emphasis for spatial concepts |
| Quizzes/challenges | Bias mission requires an actual solution; several binary checks mostly confirm recognition | Feedback is visible/named, course practice distinguishes hints and sandbox actions | Preserve computations, add carefully validated fresh transfer tasks |
| Feedback/loading | Prediction differences and exact equations are useful; raw runtime errors and “inputs changed” on initial render are clumsy | Cancellation/stale-result behavior works in checked cases; root lazy errors are uncontained | Add coherent async state language and recovery |
| Footer/source notes | No unified commercial footer; small page-specific scope/source notes are present | Sources/limits deserve preservation, but dense low-emphasis notes are hard to scan | Move references/limits into a consistent secondary disclosure |

## E. Engineering audit

| Finding | Exact implementation | Why it matters and practical correction |
|---|---|---|
| E01: mismatched state lifetimes | [NeuronMission](/workspace/V9T1/src/components/NeuronMission.tsx:11) local snapshot versus Zustand lab | R05 reproduced data recovery loss. Move ownership or define exit restoration; no app-wide state rewrite needed |
| E02: loading without route error containment | [App workspace renderer](/workspace/V9T1/src/App.tsx:83), [root render](/workspace/V9T1/src/main.tsx:10) | R01 reproduced blank root. Put a workspace-level error boundary around lazy content while retaining shell navigation; keep SceneBoundary |
| E03: two global styling layers | [main imports](/workspace/V9T1/src/main.tsx:5), [workspace overrides](/workspace/V9T1/src/design/workspace.css:22), `src/styles.css` | 593 legacy rule blocks plus 276 shared-layer blocks, 17 combined `!important` occurrences. This count is maintenance evidence, not a performance benchmark. Consolidate one primitive at a time |
| E04: compressed hand-maintained components | `BeginnerCourse.tsx` 90 lines, `TrainingProject.tsx` 25, `CurriculumLibrary.tsx` 19, `ChapterReview.tsx` 10 | These are not generated bundles: multiple state transitions and full forms occupy single source lines. Formatting would make review/debugging safer; extract only boundaries with distinct responsibility |
| E05: root knows shell and the complete neuron workspace | [App](/workspace/V9T1/src/App.tsx:59) and [conditional renderer](/workspace/V9T1/src/App.tsx:83) | Navigation, playback lifecycle, challenge, parameters and inspector coexist in the root. It is not automatically a god component: domain models are already separate. Extract NeuronWorkspace when changing that task, then use a typed workspace registry if it reduces the branching contract |
| E06: initial/async statuses are inconsistent | [PythonProgram source-reset effect](/workspace/V9T1/src/components/PythonProgram.tsx:5), [runtime hook](/workspace/V9T1/src/python/usePythonProgram.ts:4) | On an untouched page, the source effect changes Ready to Inputs changed. The generic hook groups loading/execution until success/error and allows a 90-second wait. Distinguish idle, loading runtime, running, canceled, invalidated and failed without fabricating download progress |
| E07: child selections lack route ownership | [workspace parser](/workspace/V9T1/src/store/workspace.ts:5), [course selected state](/workspace/V9T1/src/lessons/BeginnerCourse.tsx:76), [library document state](/workspace/V9T1/src/lessons/CurriculumLibrary.tsx:7) | Workspace hash routing is a sensible small abstraction, but not enough for topic/document sharing. Extend valid nested state; a framework/router migration is not required |
| E08: custom widget contracts are incomplete | [tabs](/workspace/V9T1/src/App.tsx:103), [gradient rect buttons](/workspace/V9T1/src/lessons/GradientDepthLab.tsx:41) | Verified failures are semantic/keyboard contracts. Correct these small components and test behavior; changing the math engine would be irrelevant |

No evidence supports a wholesale framework rewrite, removal of Zustand, replacement of SVG, or a blanket claim that dependencies are unnecessary. CodeMirror edits code, KaTeX renders math, Pyodide executes Python, R3F supports optional spatial views and FSRS schedules recall. Domain engines, worker isolation, bounds, cancellation, backup validation and tests already provide useful boundaries. New rerender hot spots, memory leaks and browser security vulnerabilities were **not established** by this audit.

Production output previously measured from the same implementation: entry JS **275.59kB / 85.81kB gzip**; Python editor chunk **466.69kB / 156.56kB gzip**; library chunk **689.83kB / 199.75kB gzip**; scene objects **888.85kB / 240.16kB gzip**. Lazy loading contains some cost. These sizes do not establish real-user LCP/INP/CLS or low-end-device responsiveness. Investigate the library/editor import graph before adding dependencies; keep 3D optional.

## Professional engineer versus vibe coder test

**Product/design maturity: incomplete.** There is a consistent shell and a purposeful palette. The task itself is not consistently the organizing unit: mobile graph readability, lesson discoverability, contextual review, nested navigation and recovery need work. Aesthetic resemblance cannot establish authorship.

**Software engineering maturity: meaningful domain separation with incomplete UI contracts.** Mathematical logic, course evidence and workers are separated and tested. The reproduced failures sit at ownership boundaries, async recovery, accessibility and styling composition. Tests are extensive but their earlier sampled accessibility coverage missed five workspaces' defects. Attractive screenshots and passing builds did not cover those states.

Verified: browser behaviors and source mechanisms listed above. Probable: dense composition raises cognitive load and fixed binary checks provide weak independent-transfer evidence. Not verified: actual retention, learner completion/engagement, field speed, assistive-technology conformance and low-end-device behavior.

## Professional scorecard

These are **qualitative reviewer ratings**, not measurements or validated research scores. A score is not an average of test counts. “Not verified” deliberately replaces unsupported effectiveness/performance guesses.

| Category | Score | Concrete evidence |
|---|---:|---|
| First impression | 6/10 | Recognizable fieldbook shell; tiny support/graph text and repeated workbench rhythm expose prototype detail |
| Visual identity | 7/10 | Teal/slate/aqua and serif workspace titles recur; gray editor, native blue sliders and historical chart greens weaken coherence |
| Layout and organization | 5/10 | Beginner prediction at y=2344 on 320px; first library detail jump to y=4298 at 768px; support flows compete |
| Typography | 4/10 | Readable titles/prose but 4.97px effective graph labels and 8px mobile timeline labels |
| Color system | 5/10 | Shared palette exists; selected tensor, inactive legend and syntax-token contrast fail |
| Component consistency | 5/10 | Common shell/buttons coexist with native cancel, independent playback patterns and 869 total CSS rule blocks |
| Navigation and usability | 5/10 | Workspace URLs/history and drawer Escape work; nested URLs absent, modal background navigation and mission recovery fail |
| Interactive experience | 7/10 | Verified model changes across all workspaces; weak recognition checks, disconnected result positioning and recovery reduce value |
| Educational effectiveness | Not verified | Real operations/prediction gates exist, but no learner study or delayed-transfer outcome measurement |
| Animation quality | 7/10 | Stage playback and optional camera movement have purpose; reduced motion pauses playback; stage/inspector semantics need alignment |
| Mobile responsiveness | 5/10 | All five-width starting states fit horizontally; readable operands and task proximity fail at narrow widths |
| Accessibility | 4/10 | 53 flagged node occurrences in nine of 36 scans, plus tab/modal/Space behavior; no screen-reader certification |
| Performance | Not verified | Static payloads and local load records available; no field CWV, controlled device benchmark or meaningful INP study |
| Engineering architecture | 7/10 | Engines/workers/course evidence are separate and tested; root recovery, state lifetime and cascade contracts fail |
| Overall product quality | 6/10 | Authentic, extensible experiments with an unfinished learner journey and reproducible UI failures |

## F. Gold standard blueprint

The stronger version should feel like a numerical instrument with a lesson attached. Preserve the dark scientific identity, engines, authored content, evidence provenance, backups and optional spatial views. Change the composition and contracts around them.

1. **One task occupies the first screen.** Display the objective, the quantity the learner can change, a prediction input and the relevant result/diagram. Introduce recall, explanation and review after the task or through intentional secondary navigation. Keep the actual assessment gates.
2. **Controls and consequences stay together.** On desktop, place selected-edge controls beside its equation. On mobile, show a readable compact graph and a selected-object strip immediately above inputs/result. Put exhaustive trace tables behind “Inspect the calculation.”
3. **Navigation describes available work.** Use a beginner path, experiment topics, coding/math workshops and a reference library with clearly labeled specifications. Standardize one ordering system; retain historical lecture mapping as secondary reference. Topics and documents need shareable URLs and normal links.
4. **Each concept earns its own composition.** Tensor slicing should look like a selected region with index handles; backprop should read like a derivative path/ledger; loss should keep plot, current step and update equation together. All can use the same buttons, type scale and surface primitives.
5. **Learning checks require an action with a consequence.** Ask the learner to construct a slice, choose a gradient sign on fresh parameters, diagnose a stalled ReLU or attempt a decision boundary. Keep immediate checks for orientation and distinguish them from transfer evidence.
6. **2D supplies clarity; 3D earns emphasis through a spatial relationship.** The single-neuron scene is optional inspection. The weight/bias/loss surface can justify 3D because height represents a third variable. Label axes and levels; keep equivalent numerical/2D access. No extra spinning or particles are needed.
7. **Failure preserves agency.** A failed download leaves navigation and a retry option. Loading can be canceled. Invalid matrix edits explain the accepted domain. Leaving a mission preserves recovery. Saved and visit-only work have an explicit, coherent scope.

The [page audit](PAGES.md) describes the concrete replacement composition for each route; these are incremental changes supported by the current architecture.

## G. Implementation roadmap

**Stage 1 — Repair contracts before decorating.** R01, R04–R09 and R18–R19. Keep the shell alive, preserve mission recovery, isolate the drawer, fix contrast/SVG/scroll/tab behavior and input/empty-state feedback. Reproduce each failure in an acceptance check. Most fixes are small and independent.

**Stage 2 — Make mobile mathematics and the first task usable.** R02–R03 and R14. Redesign narrow-screen graph inspection, colocate control/result, clarify action hierarchy and progressively disclose support activities. Preserve Python authority, hints and existing evidence gates.

**Stage 3 — Give navigation and progression a coherent contract.** R10–R13. Add nested topic/document URL state, reconstruct library browsing, connect review context and decide which exploratory practice should resume. Persistence/backup changes require migration and provenance decisions; do not silently convert lab attempts into course credit.

**Stage 4 — Consolidate the language and deepen selected tasks.** R15–R17 and R20. Retire duplicate primitive styling with evidence, label charts and replace selected recognition checks with validated transfer activities. Begin with tensor, activation and perceptron before expanding everywhere. Run learner sessions to establish educational outcomes.

Estimated complexities are rough implementation scope, not delivery promises: S = local component/rule change with verification; M = coordinated interaction/layout change; L = cross-feature persistence/content work. Dependencies and measurable acceptance criteria are in the backlog. No deployment or implementation PR is part of this audit.

## H. Evidence package

- `evidence/inspection.json`: 90 route/width records, full visible text, headings, control dimensions, resource/navigation observations and 36 axe results.
- `evidence/interactions.json`: fresh model, Python, navigation and keyboard checks; one initial wrong loss-selector attempt is recorded as a harness failure and corrected in confirmations.
- `evidence/probes.json`: legibility/task-position, modal, lazy-failure, hover/motion and direct-CDN probes. Initial motion sampling raced the preference update; corrected confirmation passes.
- `evidence/confirmations.json`: corrected loss selector, mission exit/return recovery loss and reduced-motion behavior.
- `evidence/library-documents.json`: real UI chapter/document traversal and text.
- `index.html`: all five-width screenshots and changed/probe/chapter states.
- `findings.json` and `BACKLOG.md`: ranked findings with source/evidence/acceptance contracts.
- `tools/`: audit-only browser scripts, all outside the repository.

Review the screenshots at their actual dimensions. A long image resized to fit a chat window can make text look smaller than it is; the 4.97px graph finding uses the browser's SVG transform, not a resized screenshot. Source line numbers are from the audited commit. No numerical learning gains, accessibility certification or universal network failure is claimed.

## Library coverage appendix

All 19 chapter readers were opened in Chromium at 1280px. Their 83 internal Markdown link visits rendered successfully, covering 63 unique documents: 60 catalog lesson documents, one extra math-workshop guide and two shared prerequisite/source documents revisited by planned chapters. The 149-item catalog contains 62 entries with Markdown documents and 87 planned catalog-only specifications. Those 87 have no separate document to open; their chapter overviews and topic listings were inspected, and they are not represented as implemented lessons.

Two authored Python documents are not linked by the CH-00 reader: `variables-and-data-flow.md` and `control-flow.md`. Their corresponding interactive labs are reachable in navigation; the gap concerns specification discoverability. The 149-item count must not be confused with 149 full Markdown lessons. The traversal inventory names every document and preserves its rendered text in `library-documents.json`; `DOCUMENTS.md` indexes each inspected document separately. No linked-document navigation errors occurred.
