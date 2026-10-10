# NeuralLab audit remediation

Baseline: clean `75df2438839a1ee80821c30cee27009a408689f6`; branch `fix/audit-remediation`. Original audit retained in `docs/audit/`. Screenshots: [matching gallery](audit/GALLERY.md). No findings previously fixed.

States: Not started → In progress → Implemented → Verified; Blocked with evidence only for demonstrated constraints.

## 1. R01 — A failed workspace chunk destroys the entire app

**Page/component:** All lazy workspaces

**Problem:** A failed workspace chunk destroys the entire app

**Evidence:** Blocking CurriculumLibrary-mMemtMU4.js produced a dynamic-import error, empty body text, zero main regions and zero retry buttons.

**Source:** src/App.tsx:83; src/main.tsx:10

**Root cause:** Suspense handles loading but the workspace lazy renderer has no surrounding error boundary. The scene-specific boundary does not cover these imports.

**User impact:** A recoverable download problem removes navigation and all useful content.

**Proposed fix:** Keep the shell mounted; contain workspace failures and offer retry/reload and a route to another lab.

**Priority:** High

**Estimated complexity:** S–M

**Dependencies:** None; verify existing behavior.

**Acceptance criteria:** Abort a lazy JS request; shell and accessible error status remain, retry/reload is operable, and another lab can open.


**Status:** Verified

**Files affected:** src/App.tsx; src/components/WorkspaceBoundary.tsx.

**Tests required / performed:** tests/audit-remediation.spec.ts: failed lazy download; production blocked-chunk probe.

**Implemented correction:** A workspace boundary keeps navigation mounted; a fresh lazy instance retries, and explicit reload preserves neuron recovery state because Chromium caches rejected imports.

**Evidence of completion:** [Evidence](audit/evidence/after/error-library-320.png); [comparison and observed results](AUDIT_COMPARISON.md#r01).

**Commit reference:** `e26dbe1` (workspace/state/shared primitives), `52876b6` (lab flows and regression coverage); follow-ups `7a2eddd` (document reload) and `3507106` (native Markdown links).

## 2. R02 — Responsive mathematics shrinks below readable size

**Page/component:** Neuron and network diagrams; mobile

**Problem:** Responsive mathematics shrinks below readable size

**Evidence:** At 320px, neuron weight labels have an effective SVG font size of 4.97px, node values 7.87px and timeline labels 8px. Output begins at y=2088px.

**Source:** src/visuals/NeuronDiagram.tsx:8; src/design/workspace.css:48; src/design/workspace.css:69

**Root cause:** A fixed 700-unit SVG is scaled into a 290px area; the layout treats fitting as usability.

**User impact:** Students cannot comfortably read the numbers needed to reason about the model.

**Proposed fix:** Use a compact staged graph with readable HTML values, selected-edge detail beside controls, and optional pan/zoom for the full network.

**Priority:** High

**Estimated complexity:** M

**Dependencies:** None; verify existing behavior.

**Acceptance criteria:** At 320/390/768px, essential mathematical labels have a readable equivalent at least 12px; selected parameter and resulting value can be compared without scrolling multiple screens.


**Status:** Verified

**Files affected:** src/visuals/NeuronDiagram.tsx; src/components/NeuronWorkspace.tsx; src/lessons/ForwardLab.tsx; src/lessons/BackpropLab.tsx; src/design/workspace.css.

**Tests required / performed:** Five-width readable-math probes; forward/backprop/neuron browser scenarios.

**Implemented correction:** Compact staged HTML values replace scaled mobile diagrams; selected connection and derivative math stay beside their controls. A current-calculation strip sits beside neuron parameters. Timeline uses three columns on mobile.

**Evidence of completion:** [Evidence](audit/evidence/after/neuron-320.png); [comparison and observed results](AUDIT_COMPARISON.md#r02).

**Commit reference:** `e26dbe1` (workspace/state/shared primitives), `52876b6` (lab flows and regression coverage); follow-ups `7a2eddd` (document reload) and `3507106` (native Markdown links).

## 3. R03 — The first learning task is buried behind administration and explanation

**Page/component:** Beginner course

**Problem:** The first learning task is buried behind administration and explanation

**Evidence:** At 320px the Your prediction label begins at y=2344px; the full first lesson is 6434px tall. Topic navigation has a 338px viewport around 4803px of content.

**Source:** src/lessons/BeginnerCourse.tsx:54; src/lessons/BeginnerCourse.tsx:87; src/components/LessonLearning.tsx:26

**Root cause:** Evidence caveats, topic navigation, vocabulary and every support activity are composed as one mandatory vertical document.

**User impact:** New learners scroll through instructions before doing the exercise and lose the task when opening support activities.

**Proposed fix:** Lead with one objective and prediction workspace; disclose vocabulary, evidence policy, recall, explanation and mixed review at their relevant moments.

**Priority:** High

**Estimated complexity:** M

**Dependencies:** R02

**Acceptance criteria:** At 320px a learner reaches the first editable prediction within two initial viewports; recall and review remain discoverable and keyboard usable, and existing assessment gates remain intact.


**Status:** Verified

**Files affected:** src/lessons/BeginnerCourse.tsx.

**Tests required / performed:** 320px position probe; all 60 worked and transfer authored lessons; keyboard hint/review tests.

**Implemented correction:** The objective and prediction precede optional explanation; topic navigation and saved evidence are disclosures. Existing recall/explanation gates remain unchanged.

**Evidence of completion:** [Evidence](audit/evidence/after/beginner-320.png); [comparison and observed results](AUDIT_COMPARISON.md#r03).

**Commit reference:** `e26dbe1` (workspace/state/shared primitives), `52876b6` (lab flows and regression coverage); follow-ups `7a2eddd` (document reload) and `3507106` (native Markdown links).

## 4. R04 — The modal allows background navigation

**Page/component:** Mobile drawer and header

**Problem:** The modal allows background navigation

**Evidence:** With the drawer open, clicking My learning changes to dashboard while the dialog stays visible; header has no inert attribute and focus moves to MAIN outside the dialog.

**Source:** src/components/WorkspaceNavigation.tsx:22; src/components/WorkspaceNavigation.tsx:49; src/App.tsx:78

**Root cause:** The scrim excludes the header; focus containment only wraps first/last elements and background controls remain active.

**User impact:** The declared modal state disagrees with real interaction and focus behavior.

**Proposed fix:** Make non-dialog content inert while open, or redesign the navigation as a nonmodal drawer with correct semantics; preserve Escape and restoration.

**Priority:** High

**Estimated complexity:** S

**Dependencies:** None; verify existing behavior.

**Acceptance criteria:** While a modal drawer is open, mouse, touch and keyboard cannot activate background controls; focus stays inside, Escape restores the trigger, and resizing closes cleanly.


**Status:** Verified

**Files affected:** src/App.tsx; src/components/WorkspaceNavigation.tsx; src/design/workspace.css.

**Tests required / performed:** Drawer isolation regression and production pointer/focus/resize probe.

**Implemented correction:** Header and main become inert; the scrim covers the viewport. Focus traps inside the drawer, Escape restores the trigger, and navigation/resize closes it.

**Evidence of completion:** [Evidence](audit/evidence/after/drawer-focus-390.png); [comparison and observed results](AUDIT_COMPARISON.md#r04).

**Commit reference:** `e26dbe1` (workspace/state/shared primitives), `52876b6` (lab flows and regression coverage); follow-ups `7a2eddd` (document reload) and `3507106` (native Markdown links).

## 5. R05 — Leaving the mission discards the experiment recovery snapshot

**Page/component:** Neuron bias mission

**Problem:** Leaving the mission discards the experiment recovery snapshot

**Evidence:** Bias was 0.5, loading set it to -2; after navigating to dashboard and returning it remained -2, with zero Restore my experiment buttons and a fresh Load button.

**Source:** src/components/NeuronMission.tsx:11; src/components/NeuronMission.tsx:18; src/store/lab.ts

**Root cause:** Parameters live in Zustand while the saved prior experiment lives in a component that unmounts on navigation.

**User impact:** Exploring another workspace silently removes the promised way to restore the learner's experiment.

**Proposed fix:** Give the mission transaction one owner with a lifecycle matching the lab, or restore explicitly on exit; retain the exact prior numeric configuration.

**Priority:** High

**Estimated complexity:** S–M

**Dependencies:** None; verify existing behavior.

**Acceptance criteria:** Load mission, visit another workspace, return and restore original inputs, weights, bias and activation; correct/incorrect feedback and course-evidence isolation still pass.


**Status:** Verified

**Files affected:** src/store/lab.ts; src/components/NeuronMission.tsx.

**Tests required / performed:** Mission navigation/recovery regression; mission altered-setup, wrong/correct and restoration tests.

**Implemented correction:** The mission snapshot belongs to the persistent lab store; copies of all parameters survive workspace unmount and remain available after reset. Restore clears the snapshot explicitly.

**Evidence of completion:** [Evidence](audit/evidence/after/state-neuron-768.png); [comparison and observed results](AUDIT_COMPARISON.md#r05).

**Commit reference:** `e26dbe1` (workspace/state/shared primitives), `52876b6` (lab flows and regression coverage); follow-ups `7a2eddd` (document reload) and `3507106` (native Markdown links).

## 6. R06 — Three visual states fail text contrast

**Page/component:** Tensor, activation and Python editor

**Problem:** Three visual states fail text contrast

**Evidence:** Selected tensor indices: 2.28:1 at 10px. Dimmed activation legends: 3.58:1 at 10px. CodeMirror red syntax: 4.08:1 on active line and 4.38:1 elsewhere at 14px. Expected minimum is 4.5:1 for this text.

**Source:** src/lessons/TensorLab.tsx:34; src/lessons/ActivationExplorer.tsx:59; src/components/PythonEditor.tsx:29; src/styles.css

**Root cause:** Semantic selection fills, opacity dimming and editor syntax colors were not tested in their combined rendered states.

**User impact:** Indices, curve identities and editable code are harder to read; the selected state can reduce legibility.

**Proposed fix:** Adjust foregrounds or selected fills and use contrast-safe inactive text; test editor token colors against both backgrounds.

**Priority:** High

**Estimated complexity:** S

**Dependencies:** None; verify existing behavior.

**Acceptance criteria:** Axe contrast passes at desktop/mobile in selected tensor, all activation selections and active/inactive code lines; preserve mathematical color meanings.


**Status:** Verified

**Files affected:** src/components/PythonEditor.tsx; src/lessons/ActivationExplorer.tsx; src/design/workspace.css.

**Tests required / performed:** 36 initial-state axe scans; mobile/desktop selected-state axe scans; computed rendered contrast ratios.

**Implemented correction:** Tensor selection uses a dark panel with readable indices; activation legend text is not faded; CodeMirror uses explicit scientific syntax colors on dark surfaces.

**Evidence of completion:** [Evidence](audit/evidence/after/contrast-final.json); [comparison and observed results](AUDIT_COMPARISON.md#r06).

**Commit reference:** `e26dbe1` (workspace/state/shared primitives), `52876b6` (lab flows and regression coverage); follow-ups `7a2eddd` (document reload) and `3507106` (native Markdown links).

## 7. R07 — Interactive chart semantics and Space activation are broken

**Page/component:** Gradient depth chart

**Problem:** Interactive chart semantics and Space activation are broken

**Evidence:** Axe flags the SVG role=img with focusable descendants. Space on Inspect layer 3 keeps Layer 1 selected; Enter selects Layer 3.

**Source:** src/lessons/GradientDepthLab.tsx:29; src/lessons/GradientDepthLab.tsx:41

**Root cause:** An interactive widget is exposed as a single image; custom role=button handles only Enter.

**User impact:** Assistive technology can miss child controls and keyboard activation is inconsistent with buttons.

**Proposed fix:** Expose a grouped interactive chart with named controls supporting Enter and Space, and an equivalent textual layer selector.

**Priority:** High

**Estimated complexity:** S

**Dependencies:** None; verify existing behavior.

**Acceptance criteria:** No nested-interactive violation; keyboard and assistive names identify each layer; Enter and Space select the same layer and update the exact inspector.


**Status:** Verified

**Files affected:** src/lessons/GradientDepthLab.tsx.

**Tests required / performed:** Space selection regression, existing depth test, changed-state Enter/Space comparison, axe.

**Implemented correction:** The interactive chart is a named group. Layer controls expose pressed state and prevent default for Enter/Space; a native layer select supplies the same exact inspector.

**Evidence of completion:** [Evidence](audit/evidence/after/state-gradient-depth-768.png); [comparison and observed results](AUDIT_COMPARISON.md#r07).

**Commit reference:** `e26dbe1` (workspace/state/shared primitives), `52876b6` (lab flows and regression coverage); follow-ups `7a2eddd` (document reload) and `3507106` (native Markdown links).

## 8. R08 — Scrollable truth table lacks a keyboard focus entry

**Page/component:** Perceptron truth table, mobile

**Problem:** Scrollable truth table lacks a keyboard focus entry

**Evidence:** Axe flags .perceptron-table as scrollable-region-focusable at 390px.

**Source:** src/lessons/PerceptronLab.tsx:61; src/styles.css

**Root cause:** Horizontal overflow is handled visually but the wrapper has no focusable content or focus target.

**User impact:** Keyboard users cannot reliably inspect the offscreen result columns.

**Proposed fix:** Name and focus the scrolling region with a visible focus outline, or use a narrow-screen row disclosure preserving table relationships.

**Priority:** High

**Estimated complexity:** S

**Dependencies:** None; verify existing behavior.

**Acceptance criteria:** At 320/390px keyboard users can reach and scroll every column; axe rule passes and header/value relationships remain understandable.


**Status:** Verified

**Files affected:** src/lessons/PerceptronLab.tsx; src/design/workspace.css.

**Tests required / performed:** 320/390px focus plus ArrowRight scroll probes; axe scrollable-region-focusable.

**Implemented correction:** The table overflow region is named, focusable, and has a visible focus outline. The native table and column headers remain.

**Evidence of completion:** [Evidence](audit/evidence/after/probe-truth-table-keyboard-320.png); [comparison and observed results](AUDIT_COMPARISON.md#r08).

**Commit reference:** `e26dbe1` (workspace/state/shared primitives), `52876b6` (lab flows and regression coverage); follow-ups `7a2eddd` (document reload) and `3507106` (native Markdown links).

## 9. R09 — ARIA tabs are ordinary buttons dressed as a tab widget

**Page/component:** Neuron computation inspector tabs

**Problem:** ARIA tabs are ordinary buttons dressed as a tab widget

**Evidence:** ArrowRight while Math is focused leaves focus and selection on Math. All tabs remain normal tab stops; source lacks linked tabpanel/aria-controls and tab keyboard handling.

**Source:** src/App.tsx:103

**Root cause:** Only tablist/tab roles and selected appearance were added, without the corresponding interaction contract.

**User impact:** Keyboard and assistive-technology expectations do not match the widget.

**Proposed fix:** Implement linked tab panels and roving focus with arrow/Home/End handling, or use an honestly named button group.

**Priority:** Medium

**Estimated complexity:** S

**Dependencies:** None; verify existing behavior.

**Acceptance criteria:** If tabs remain, arrow keys move between tabs, one tab is in the tab sequence, selected panel is named/linked and all content stays reachable.


**Status:** Verified

**Files affected:** src/components/NeuronWorkspace.tsx.

**Tests required / performed:** Roving-focus regression and neuron changed-state ArrowRight comparison.

**Implemented correction:** Inspector tabs have linked IDs/panels, a single tab stop and roving ArrowLeft/Right/Home/End focus. Panel content stays keyboard reachable.

**Evidence of completion:** [Evidence](audit/evidence/after/state-neuron-768.png); [comparison and observed results](AUDIT_COMPARISON.md#r09).

**Commit reference:** `e26dbe1` (workspace/state/shared primitives), `52876b6` (lab flows and regression coverage); follow-ups `7a2eddd` (document reload) and `3507106` (native Markdown links).

## 10. R10 — Deep navigation has no deep URL or history

**Page/component:** Beginner topics and curriculum documents

**Problem:** Deep navigation has no deep URL or history

**Evidence:** Selecting Training diagnostics leaves #/lab/beginner unchanged; opening a chapter leaves #/lab/library unchanged. Workspace history works, nested lesson/document history is absent. Two authored CH-00 Python document files are not linked in the chapter reader; 87 other catalog entries are deliberately planned without separate Markdown documents.

**Source:** src/store/workspace.ts:5; src/lessons/BeginnerCourse.tsx:76; src/lessons/CurriculumLibrary.tsx:7

**Root cause:** The route model owns only the workspace; selection belongs to local state/storage.

**User impact:** Students cannot share their exact lesson/document or reliably use Back between them; native open-in-new-tab is absent from sidebar button destinations.

**Proposed fix:** Extend the existing whitelist URL state to valid topic and document IDs; use anchors for real destinations while preserving storage fallback.

**Priority:** High

**Estimated complexity:** M

**Dependencies:** None; verify existing behavior.

**Acceptance criteria:** Copy/reload an exact topic/document URL in a clean context; Back/Forward restores prior topic/document, invalid IDs fall back safely, native link actions work. Every available authored reference document has a discoverable link; planned catalog-only entries remain clearly labeled.


**Status:** Verified

**Files affected:** src/store/workspace.ts; src/lessons/BeginnerCourse.tsx; src/lessons/CurriculumLibrary.tsx; src/components/MarkdownDocument.tsx.

**Tests required / performed:** Topic Back/Forward/refresh/invalid-ID regressions; library browser coverage and document URL probe.

**Implemented correction:** Validated topic and document query parameters own nested selection and browser history. Authored items are native anchors. All imported reference documents appear in the document index, including CH00 extras and all general references. Markdown document links expose the same native deep URLs.

**Evidence of completion:** [Evidence](audit/evidence/after/state-library-768.png); [comparison and observed results](AUDIT_COMPARISON.md#r10).

**Commit reference:** `e26dbe1` (workspace/state/shared primitives), `52876b6` (lab flows and regression coverage); follow-ups `7a2eddd` (document reload) and `3507106` (native Markdown links).

## 11. R11 — Chapter detail opens after the entire catalog

**Page/component:** Curriculum library

**Problem:** Chapter detail opens after the entire catalog

**Evidence:** At 768px the catalog starts 4909px tall; opening its first chapter scrolls to y=4298. At 320px the unfiltered catalog is 8849px tall.

**Source:** src/lessons/CurriculumLibrary.tsx:11; src/lessons/CurriculumLibrary.tsx:16; src/lessons/CurriculumLibrary.tsx:17

**Root cause:** The detail article is appended after all 19 chapter summaries, then the page scrolls to it.

**User impact:** Opening the first item jumps far away from its context and returning requires a large scroll or filter reset.

**Proposed fix:** Use a persistent compact chapter index with adjacent desktop detail and a dedicated mobile detail state with explicit return-to-results.

**Priority:** High

**Estimated complexity:** M

**Dependencies:** R10

**Acceptance criteria:** Open first/middle/last chapter without traversing other chapter content; return preserves query, chapter and scroll position; label implemented practice versus specifications.


**Status:** Verified

**Files affected:** src/lessons/CurriculumLibrary.tsx; src/design/workspace.css.

**Tests required / performed:** Library detail/search regression; existing Markdown and library scenarios; five widths.

**Implemented correction:** Compact chapter navigation sits beside desktop reading. Mobile hides the index in reading mode, with an explicit return restoring query and index scroll. Specification and implemented practice are labeled.

**Evidence of completion:** [Evidence](audit/evidence/after/library-320.png); [comparison and observed results](AUDIT_COMPARISON.md#r11).

**Commit reference:** `e26dbe1` (workspace/state/shared primitives), `52876b6` (lab flows and regression coverage); follow-ups `7a2eddd` (document reload) and `3507106` (native Markdown links).

## 12. R12 — Review selection does not follow the selected lesson chapter

**Page/component:** Mixed chapter review

**Problem:** Review selection does not follow the selected lesson chapter

**Evidence:** After switching from first topic to Training diagnostics, Review chapter remained value 0 (CH-00). The review starts at CH-00 on each component mount.

**Source:** src/lessons/BeginnerCourse.tsx:88; src/lessons/ChapterReview.tsx:5

**Root cause:** ChapterReview owns an independent default chapter and receives no current-chapter context.

**User impact:** The bottom of a CH-07 lesson presents unrelated CH-00 review unless the learner notices and changes the selector.

**Proposed fix:** Offer the current chapter's review at its checkpoint, with an explicit option to choose another chapter.

**Priority:** Medium

**Estimated complexity:** S

**Dependencies:** R03

**Acceptance criteria:** Selecting a lesson in each chapter presents the intended contextual review; deliberate cross-chapter selection remains available and persisted results retain their correct chapter identity.


**Status:** Verified

**Files affected:** src/lessons/BeginnerCourse.tsx; src/lessons/ChapterReview.tsx.

**Tests required / performed:** Chapter 7 context regression; mixed reviews for every implemented chapter.

**Implemented correction:** Review receives the current lesson chapter, resets context when that chapter changes, and retains a deliberate review choice within that context. Persisted reviews keep chapter identity.

**Evidence of completion:** [Evidence](audit/evidence/after/state-beginner-768.png); [comparison and observed results](AUDIT_COMPARISON.md#r12).

**Commit reference:** `e26dbe1` (workspace/state/shared primitives), `52876b6` (lab flows and regression coverage); follow-ups `7a2eddd` (document reload) and `3507106` (native Markdown links).

## 13. R13 — Practice disappears when moving between tools

**Page/component:** Python basics/flow and training project

**Problem:** Practice disappears when moving between tools

**Evidence:** These components own attempts/evidence in useState and say it lasts for the visit; authored beginner evidence and inference checkpoints persist. Reloading tools resets their transfer evidence by construction.

**Source:** src/lessons/PythonBasicsLab.tsx:5; src/lessons/PythonFlowLab.tsx:10; src/lessons/TrainingProject.tsx:11

**Root cause:** Sandbox practice, authored course progress and checkpoint persistence have separate contracts with no coherent learner handoff.

**User impact:** A student can complete an experiment, leave to inspect a related concept and lose its transfer record. The labels are honest, but the workflow is fragmented.

**Proposed fix:** Decide which practice belongs to a saved draft/history; preserve provenance and distinguish exploratory attempts from course evidence without inventing mastery.

**Priority:** Medium

**Estimated complexity:** M–L

**Dependencies:** R10

**Acceptance criteria:** A documented evidence contract survives reload/navigation for intended records, backups include them where appropriate, and exploratory actions never grant authored course credit.


**Status:** Verified

**Files affected:** src/course/learning.ts; src/course/useSandboxDraft.ts; src/lessons/PythonBasicsLab.tsx; src/lessons/PythonFlowLab.tsx; src/lessons/TrainingProject.tsx.

**Tests required / performed:** Draft-refresh browser regression; sandbox backup/parser unit tests; backup/provenance/training tests.

**Implemented correction:** Bounded whitelisted sandbox input/prediction drafts resume and travel in existing version-1 backups. Execution traces and practice checks remain visit-local and explicitly require rerunning. Course evidence and inference checkpoints retain their original provenance.

**Evidence of completion:** [Evidence](audit/evidence/after/state-python-basics-768.png); [comparison and observed results](AUDIT_COMPARISON.md#r13).

**Commit reference:** `e26dbe1` (workspace/state/shared primitives), `52876b6` (lab flows and regression coverage); follow-ups `7a2eddd` (document reload) and `3507106` (native Markdown links).

## 14. R14 — Primary, secondary and unavailable actions compete visually

**Page/component:** Shared buttons and learning controls

**Problem:** Primary, secondary and unavailable actions compete visually

**Evidence:** Python flow initially shows five similarly styled execution/transport buttons. Neuron mixes inspect-node buttons, four transport buttons and six timeline buttons. Training's Cancel Python training is a native-style button outside the styled action group.

**Source:** src/styles.css:226; src/design/workspace.css:53; src/lessons/TrainingProject.tsx:19; src/App.tsx:89

**Root cause:** Styling follows container selectors instead of action importance; duplicate transport systems have different labels and grouping.

**User impact:** The next meaningful action is harder to find and disabled controls take attention before there is a result to navigate.

**Proposed fix:** Define primary/secondary/quiet/danger controls; place playback near its visualization, and reveal result-only controls when usable.

**Priority:** Medium

**Estimated complexity:** M

**Dependencies:** None; verify existing behavior.

**Acceptance criteria:** Each task has a visually dominant next action; cancellation looks consistent, transport remains keyboard accessible, and empty states explain why the task is not ready.


**Status:** Verified

**Files affected:** src/design/actions.css; src/styles.css; src/design/workspace.css; src/components/PythonProgram.tsx; src/lessons/TrainingProject.tsx.

**Tests required / performed:** Execution/cancel/stale-input browser scenarios and five-width gallery inspection.

**Implemented correction:** One action stylesheet owns execution variants: primary run, secondary transport, subdued unavailable actions and consistent danger cancellation. Source is optional; ready/loading/executing states explain availability.

**Evidence of completion:** [Evidence](audit/evidence/after/python-flow-320.png); [comparison and observed results](AUDIT_COMPARISON.md#r14).

**Commit reference:** `e26dbe1` (workspace/state/shared primitives), `52876b6` (lab flows and regression coverage); follow-ups `7a2eddd` (document reload) and `3507106` (native Markdown links).

## 15. R15 — The design system is an override layer over surviving feature dialects

**Page/component:** Shared styling and chart colors

**Problem:** The design system is an override layer over surviving feature dialects

**Evidence:** styles.css has 593 rule blocks and workspace.css adds 276, with 17 total !important occurrences. Palette tokens coexist with literal green/amber chart colors and a gray One Dark editor.

**Source:** src/main.tsx:5; src/design/workspace.css:22; src/lessons/GradientDepthLab.tsx:30; src/visuals/NeuronDiagram.tsx:11; src/components/PythonEditor.tsx:29

**Root cause:** Incremental restyling preserved old selectors and adds broad global overrides; shared palette migration is incomplete.

**User impact:** A component's appearance depends on cascade order and feature context; local fixes can create cross-page inconsistencies.

**Proposed fix:** Consolidate one primitive at a time into explicit surface, action and chart roles; retire superseded rules only with comparison evidence.

**Priority:** Medium

**Estimated complexity:** M

**Dependencies:** R06, R14

**Acceptance criteria:** A migrated primitive has one owner, no competing legacy declaration and defined state colors; all five-width screenshots and relevant interactions remain valid.


**Status:** Verified

**Files affected:** src/design/actions.css; src/main.tsx; src/styles.css; src/design/workspace.css; src/components/PythonEditor.tsx.

**Tests required / performed:** Source cascade inspection; five-width screenshots; all execution interactions.

**Implemented correction:** Migrated execution-action variants into a single stylesheet and removed the competing legacy Python action colors. Selected tensor/legend and editor syntax roles use the supplied palette. Broader legacy CSS remains intentionally incremental.

**Evidence of completion:** [Evidence](audit/evidence/after/python-basics-1440.png); [comparison and observed results](AUDIT_COMPARISON.md#r15).

**Commit reference:** `e26dbe1` (workspace/state/shared primitives), `52876b6` (lab flows and regression coverage); follow-ups `7a2eddd` (document reload) and `3507106` (native Markdown links).

## 16. R16 — Several checks verify recognition after teaching the answer

**Page/component:** Lab concept checks

**Problem:** Several checks verify recognition after teaching the answer

**Evidence:** Tensor asks rank 1 versus rank 10 while the same page explains rank counts axes. Activation asks ReLU versus Leaky ReLU at -2 after the graph/note exposes the behavior. Perceptron's XOR check offers Yes/No without an XOR experiment.

**Source:** src/lessons/TensorLab.tsx:54; src/lessons/ActivationExplorer.tsx:84; src/lessons/PerceptronLab.tsx:67

**Root cause:** One reusable end-of-page binary-question pattern substitutes for topic-specific transfer tasks.

**User impact:** Checks can support immediate feedback but provide weak evidence of independent understanding; no learner-outcome improvement is established.

**Proposed fix:** Preserve quick checks as orientation; add fresh predict-before-reveal tasks such as choosing a slice, diagnosing a saturated derivative, or attempting an XOR boundary.

**Priority:** Medium

**Estimated complexity:** M

**Dependencies:** R03

**Acceptance criteria:** A new task requires a prediction/construction on unseen valid parameters, offers evidence-based feedback, and does not reveal its answer before submission or relabel existing checks as mastery.


**Status:** Verified

**Files affected:** src/components/TransferPrediction.tsx; src/components/XorExperiment.tsx; src/engine/workshopValidation.ts; relevant lab components.

**Tests required / performed:** Transfer reveal/course-isolation browser regression; XOR and workshop-contract unit tests.

**Implemented correction:** Fresh numerical transfer tasks require a finite prediction before reveal; XOR lets learners construct and test a boundary. Workshop validates all required mathematical fields. Exploratory feedback never awards authored mastery.

**Evidence of completion:** [Evidence](audit/evidence/after/state-perceptron-768.png); [comparison and observed results](AUDIT_COMPARISON.md#r16).

**Commit reference:** `e26dbe1` (workspace/state/shared primitives), `52876b6` (lab flows and regression coverage); follow-ups `7a2eddd` (document reload) and `3507106` (native Markdown links).

## 17. R17 — Plots are correct enough to compute but weakly equipped to be read

**Page/component:** Gradient chart and loss contour

**Problem:** Plots are correct enough to compute but weakly equipped to be read

**Evidence:** Gradient-depth says log-scaled but its vertical axis has no numerical tick values. The loss contour draws five unlabeled levels with direction text, no coordinate ticks or level legend.

**Source:** src/lessons/GradientDepthLab.tsx:30; src/lessons/MathWorkshop.tsx:198

**Root cause:** Charts prioritize a clean illustration and an exact inspector without fully exposing their coordinate/scale contract.

**User impact:** Students can inspect a selected value but cannot easily interpret magnitude or contour distance directly from the plot.

**Proposed fix:** Add readable axes/ticks, level labels and selected-point linkage; retain exact model values and disclose clipping/scales.

**Priority:** Medium

**Estimated complexity:** S–M

**Dependencies:** R02

**Acceptance criteria:** At desktop/mobile a learner can identify axis variables, scale and contour/layer values from labels; mathematical levels and path still agree with the engine.


**Status:** Verified

**Files affected:** src/lessons/LossGradientLab.tsx; src/lessons/GradientDepthLab.tsx; src/lessons/MathWorkshop.tsx.

**Tests required / performed:** Engine/contour unit checks; loss, depth and matrix/surface browser tests; mobile/desktop visual inspection.

**Implemented correction:** Loss shows numerical y ticks; depth explains its inverse logarithmic scale with numeric magnitudes; contour has coordinate ticks and actual loss levels from its anisotropic quadratic.

**Evidence of completion:** [Evidence](audit/evidence/after/math-workshop-320.png); [comparison and observed results](AUDIT_COMPARISON.md#r17).

**Commit reference:** `e26dbe1` (workspace/state/shared primitives), `52876b6` (lab flows and regression coverage); follow-ups `7a2eddd` (document reload) and `3507106` (native Markdown links).

## 18. R18 — Invalid values are silently replaced instead of explained

**Page/component:** Matrix inputs

**Problem:** Invalid values are silently replaced instead of explained

**Evidence:** Filling B[1,1] with 999 leaves the input at its old value 2. No invalid-input message appears; deleting the input is converted through Number('') to 0.

**Source:** src/lessons/MathWorkshop.tsx:59

**Root cause:** The controlled input stores only accepted numeric values and discards the user's editing text.

**User impact:** Learners cannot tell whether their input was accepted, rejected or changed, and transient editing states are awkward.

**Proposed fix:** Keep draft text separately, validate on an explicit boundary, and show an associated inline range/finite-number message.

**Priority:** Medium

**Estimated complexity:** S

**Dependencies:** None; verify existing behavior.

**Acceptance criteria:** Blank, transient minus, out-of-range and nonfinite input states have understandable feedback; no silent computation with an unintended replacement value; valid values still update the matrix exactly.


**Status:** Verified

**Files affected:** src/lessons/MathWorkshop.tsx.

**Tests required / performed:** Invalid-draft regression; matrix B[1,1]=2 gives C[1,1]=8 and genuine NumPy output.

**Implemented correction:** Text drafts retain blank, transient minus, nonfinite and out-of-range entries with explicit validation. Computation keeps the last valid matrix and updates exactly when corrected. Selected A row and B column expose the dot product operands.

**Evidence of completion:** [Evidence](audit/evidence/after/state-math-workshop-768.png); [comparison and observed results](AUDIT_COMPARISON.md#r18).

**Commit reference:** `e26dbe1` (workspace/state/shared primitives), `52876b6` (lab flows and regression coverage); follow-ups `7a2eddd` (document reload) and `3507106` (native Markdown links).

## 19. R19 — No-match search produces an unexplained blank region

**Page/component:** Dashboard glossary search

**Problem:** No-match search produces an unexplained blank region

**Evidence:** Searching zzzz-no-match rendered zero glossary articles and an empty string, without a result count or no-results message.

**Source:** src/lessons/LearningDashboard.tsx:135

**Root cause:** The filter renders the map result directly without an empty-state/status branch.

**User impact:** Students cannot distinguish no results from a failed display and receive no recovery suggestion.

**Proposed fix:** Provide an announced result count, no-results explanation and clear-filter action; consider compact results instead of all definitions by default.

**Priority:** Low

**Estimated complexity:** S

**Dependencies:** None; verify existing behavior.

**Acceptance criteria:** Zero and nonzero result states are announced without excessive chatter; clear filter restores all results and keyboard focus stays stable.


**Status:** Verified

**Files affected:** src/lessons/LearningDashboard.tsx.

**Tests required / performed:** Dashboard empty/search regression and changed-state probe.

**Implemented correction:** A status announces match count or an explicit no-match message. Show all topics clears the filter without removing focus unexpectedly. Recommendation is the first actionable section.

**Evidence of completion:** [Evidence](audit/evidence/after/state-dashboard-768.png); [comparison and observed results](AUDIT_COMPARISON.md#r19).

**Commit reference:** `e26dbe1` (workspace/state/shared primitives), `52876b6` (lab flows and regression coverage); follow-ups `7a2eddd` (document reload) and `3507106` (native Markdown links).

## 20. R20 — Unrelated learning tasks keep the same visual rhythm

**Page/component:** Shared experiment surfaces

**Problem:** Unrelated learning tasks keep the same visual rhythm

**Evidence:** Foundation, tensor, activation, forward, backprop and loss repeat heading/eyebrow, two rounded workbench containers, smaller blue metric containers, binary check and source/code tail. Backprop's four derivative/update tiles resemble loss's five arithmetic tiles despite different teaching tasks.

**Source:** src/design/workspace.css:41; src/design/workspace.css:45; src/lessons/BackpropLab.tsx; src/lessons/LossGradientLab.tsx:90

**Root cause:** Shared panel/metric patterns are applied more consistently than task-specific composition.

**User impact:** Primary experimentation, supporting proof and reference material lose differentiation; familiarity becomes monotony rather than orientation.

**Proposed fix:** Keep a shared shell but compose around the learning operation: a trace ledger for backprop, a plot-and-step strip for optimization, and a row/column inspector for tensors. Use boxes for boundaries, not every number.

**Priority:** Medium

**Estimated complexity:** M

**Dependencies:** R02, R14, R15

**Acceptance criteria:** Each lab has one identifiable primary interaction and subordinate supporting proof; existing controls/content remain available, and before/after evidence shows distinction without introducing new dependencies or layouts for their own sake.

**Status:** Verified

**Files affected:** src/lessons/*.tsx; src/components/NeuronWorkspace.tsx; src/components/PythonProgram.tsx; src/design/workspace.css.

**Tests required / performed:** All 18 routes at five widths; representative changed-state checks; existing meaningful browser scenarios.

**Implemented correction:** Task compositions now emphasize tensor-region selection, selected derivative chain, loss prediction, executable assignment/scope, matrix operands, simple training decision, library reader, dashboard recommendation, and fresh transfer tasks. Shared source is disclosed and secondary.

**Evidence of completion:** [Five-width gallery](audit/GALLERY.md); [comparison and observed results](AUDIT_COMPARISON.md#r20).

**Commit reference:** `e26dbe1` (workspace/state/shared primitives), `52876b6` (lab flows and regression coverage); follow-ups `7a2eddd` (document reload) and `3507106` (native Markdown links).

## E01 — Mission snapshot ownership

**Original problem / planned correction:** Mission snapshot ownership.

**Root cause:** The recovery snapshot was local while lab parameters survived unmount.

**Files affected:** src/store/lab.ts; src/components/NeuronMission.tsx.

**Dependencies:** R05.

**Status:** Verified

**Tests required / acceptance criteria:** Shared snapshot ownership and exact restoration. R05 regression.

**Evidence of completion:** [Comparison](AUDIT_COMPARISON.md); [route and state gallery](audit/GALLERY.md).

**Commit reference:** `e26dbe1` (workspace/state/shared primitives), `52876b6` (lab flows and regression coverage); follow-ups `7a2eddd` (document reload) and `3507106` (native Markdown links).

## E02 — Workspace lazy error containment

**Original problem / planned correction:** Workspace lazy error containment.

**Root cause:** Suspense did not contain rejected imports.

**Files affected:** src/components/WorkspaceBoundary.tsx; src/App.tsx.

**Dependencies:** R01.

**Status:** Verified

**Tests required / acceptance criteria:** Isolated retryable workspaces outside the shell, production retry/reload proof. R01.

**Evidence of completion:** [Comparison](AUDIT_COMPARISON.md); [route and state gallery](audit/GALLERY.md).

**Commit reference:** `e26dbe1` (workspace/state/shared primitives), `52876b6` (lab flows and regression coverage); follow-ups `7a2eddd` (document reload) and `3507106` (native Markdown links).

## E03 — Incremental styling consolidation

**Original problem / planned correction:** Incremental styling consolidation.

**Root cause:** Execution actions had repeated context-specific colors.

**Files affected:** src/design/actions.css; src/styles.css; src/design/workspace.css.

**Dependencies:** R15.

**Status:** Verified

**Tests required / acceptance criteria:** One action variant owner, superseded Python rules removed. R14/R15.

**Evidence of completion:** [Comparison](AUDIT_COMPARISON.md); [route and state gallery](audit/GALLERY.md).

**Commit reference:** `e26dbe1` (workspace/state/shared primitives), `52876b6` (lab flows and regression coverage); follow-ups `7a2eddd` (document reload) and `3507106` (native Markdown links).

## E04 — Reviewable component boundaries

**Original problem / planned correction:** Reviewable component boundaries.

**Root cause:** Compressed large JSX obscured ownership.

**Files affected:** src/lessons/*.tsx; src/components/NeuronWorkspace.tsx; src/components/TransferPrediction.tsx; src/components/XorExperiment.tsx.

**Dependencies:** R20.

**Status:** Verified

**Tests required / acceptance criteria:** Formatted lessons; extracted neuron orchestration, sandbox persistence and transfer/XOR tasks. Lint, types, meaningful unit/browser tests.

**Evidence of completion:** [Comparison](AUDIT_COMPARISON.md); [route and state gallery](audit/GALLERY.md).

**Commit reference:** `e26dbe1` (workspace/state/shared primitives), `52876b6` (lab flows and regression coverage); follow-ups `7a2eddd` (document reload) and `3507106` (native Markdown links).

## E05 — Root responsibility separation

**Original problem / planned correction:** Root responsibility separation.

**Root cause:** App combined root shell and the complete neuron experiment.

**Files affected:** src/App.tsx; src/components/NeuronWorkspace.tsx.

**Dependencies:** R01/R09.

**Status:** Verified

**Tests required / acceptance criteria:** Root shell owns route/navigation; neuron owns computation lifecycle and view. Route registry keeps all 18 workspaces.

**Evidence of completion:** [Comparison](AUDIT_COMPARISON.md); [route and state gallery](audit/GALLERY.md).

**Commit reference:** `e26dbe1` (workspace/state/shared primitives), `52876b6` (lab flows and regression coverage); follow-ups `7a2eddd` (document reload) and `3507106` (native Markdown links).

## E06 — Coherent async execution states

**Original problem / planned correction:** Coherent async execution states.

**Root cause:** Status messages mixed download, execution and stale results.

**Files affected:** src/python/usePythonProgram.ts; src/python/usePythonExecution.ts; public/python-program-worker.js; public/python-worker.js.

**Dependencies:** R13.

**Status:** Verified

**Tests required / acceptance criteria:** Explicit idle/loading/executing/canceled/invalidated/failed/completed phases and worker-ready signals. Worker identity, cancellation and budgets remain enforced.

**Evidence of completion:** [Comparison](AUDIT_COMPARISON.md); [route and state gallery](audit/GALLERY.md).

**Commit reference:** `e26dbe1` (workspace/state/shared primitives), `52876b6` (lab flows and regression coverage); follow-ups `7a2eddd` (document reload) and `3507106` (native Markdown links).

## E07 — Nested URL ownership

**Original problem / planned correction:** Nested URL ownership.

**Root cause:** Nested selections were disconnected from URL history.

**Files affected:** src/store/workspace.ts; src/lessons/BeginnerCourse.tsx; src/lessons/CurriculumLibrary.tsx; src/components/MarkdownDocument.tsx.

**Dependencies:** R10.

**Status:** Verified

**Tests required / acceptance criteria:** Shared validated nested selection hook; native authored links; Back/Forward/reload coverage. R10.

**Evidence of completion:** [Comparison](AUDIT_COMPARISON.md); [route and state gallery](audit/GALLERY.md).

**Commit reference:** `e26dbe1` (workspace/state/shared primitives), `52876b6` (lab flows and regression coverage); follow-ups `7a2eddd` (document reload) and `3507106` (native Markdown links).

## E08 — Keyboard and semantic contracts

**Original problem / planned correction:** Keyboard and semantic contracts.

**Root cause:** Custom widgets only partially implemented native/ARIA contracts.

**Files affected:** src/components/WorkspaceNavigation.tsx; src/components/NeuronWorkspace.tsx; src/lessons/GradientDepthLab.tsx; src/lessons/PerceptronLab.tsx.

**Dependencies:** R04/R07/R08/R09.

**Status:** Verified

**Tests required / acceptance criteria:** Inert drawer, proper tabs, Enter/Space layer controls, focusable named truth-table overflow. R04/R07/R08/R09.

**Evidence of completion:** [Comparison](AUDIT_COMPARISON.md); [route and state gallery](audit/GALLERY.md).

**Commit reference:** `e26dbe1` (workspace/state/shared primitives), `52876b6` (lab flows and regression coverage); follow-ups `7a2eddd` (document reload) and `3507106` (native Markdown links).

## Route verification

- [x] `/lab/neuron` — task, changed states, keyboard, five widths, mathematics and provenance.
- [x] `/lab/python-basics` — task, changed states, keyboard, five widths, mathematics and provenance.
- [x] `/lab/python-flow` — task, changed states, keyboard, five widths, mathematics and provenance.
- [x] `/lab/intro` — task, changed states, keyboard, five widths, mathematics and provenance.
- [x] `/lab/perceptron` — task, changed states, keyboard, five widths, mathematics and provenance.
- [x] `/lab/tensor` — task, changed states, keyboard, five widths, mathematics and provenance.
- [x] `/lab/propagation` — task, changed states, keyboard, five widths, mathematics and provenance.
- [x] `/lab/backprop` — task, changed states, keyboard, five widths, mathematics and provenance.
- [x] `/lab/activation` — task, changed states, keyboard, five widths, mathematics and provenance.
- [x] `/lab/loss` — task, changed states, keyboard, five widths, mathematics and provenance.
- [x] `/lab/gradient-depth` — task, changed states, keyboard, five widths, mathematics and provenance.
- [x] `/lab/beginner` — task, changed states, keyboard, five widths, mathematics and provenance.
- [x] `/lab/training-project` — task, changed states, keyboard, five widths, mathematics and provenance.
- [x] `/lab/library` — task, changed states, keyboard, five widths, mathematics and provenance.
- [x] `/lab/python` — task, changed states, keyboard, five widths, mathematics and provenance.
- [x] `/lab/dashboard` — task, changed states, keyboard, five widths, mathematics and provenance.
- [x] `/lab/python-workshop` — task, changed states, keyboard, five widths, mathematics and provenance.
- [x] `/lab/math-workshop` — task, changed states, keyboard, five widths, mathematics and provenance.

## Publication status

Local implementation and evidence are complete. [Draft PR #27](https://github.com/amarjaleelbanbhan/V9T1/pull/27) is open on `fix/audit-remediation`. The connected GitHub app published the branch after CLI authentication was unavailable. No merge has occurred. The PR description is prepared in [AUDIT_PR_DESCRIPTION.md](AUDIT_PR_DESCRIPTION.md).

## Published commit references

The API publishes different commit metadata from the local Git history. Each pair below has the **same verified file tree**. Local source commits are retained in each published commit message.

| Local source commit | Published GitHub commit |
|---|---|
| `75df243` | [eb9637c](https://github.com/amarjaleelbanbhan/V9T1/commit/eb9637c18bb5467c6c3375716b44dcd07e8754dd) |
| `513566b` | [f2ccd41](https://github.com/amarjaleelbanbhan/V9T1/commit/f2ccd41bd406565535abfd1059c2989916c8f4ca) |
| `e26dbe1` | [0eff0af](https://github.com/amarjaleelbanbhan/V9T1/commit/0eff0afdaf0d31a197c877d28be994c98d3dc11e) |
| `52876b6` | [55345b2](https://github.com/amarjaleelbanbhan/V9T1/commit/55345b2f849f6f5595398c28dfb12d4feb7fd347) |
| `7a2eddd` | [4512a61](https://github.com/amarjaleelbanbhan/V9T1/commit/4512a6117281ca4bbbb223136c6c77005c9d4353) |
| `3507106` | [00452ee](https://github.com/amarjaleelbanbhan/V9T1/commit/00452eee7489811138aae621a6946e4b9a658f12) |
| `9b76e03` | [e597200](https://github.com/amarjaleelbanbhan/V9T1/commit/e59720073d8abcaec61f1f7c428df6d5c605fd87) |
