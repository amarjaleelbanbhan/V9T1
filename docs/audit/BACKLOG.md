# Ranked implementation backlog

No changes are implemented by this audit. S = local component/rule change; M = coordinated interaction/layout change; L = cross-feature persistence/content work. These estimates describe scope, not promised dates.

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
