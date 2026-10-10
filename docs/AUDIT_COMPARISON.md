# NeuralLab audit comparison

Baseline: `75df2438839a1ee80821c30cee27009a408689f6`, clean before implementation. No audited fix was already present. Remediation branch: `fix/audit-remediation`.

The mathematical engines, React/Vite structure, 60 authored lessons, actual Python execution, FSRS and assisted/unaided evidence remain. All 18 workspaces have matching five-width screenshots and a representative changed-state interaction. [Complete gallery](audit/GALLERY.md); [original audit](audit/ORIGINAL_AUDIT.md); [acceptance tracker](AUDIT_REMEDIATION.md).

## Validation

Production build, TypeScript and ESLint pass. All 257 unit tests pass. The full 77-test browser run passes, as do 10 targeted checks covering the final library changes and two additional recovery/native-link regressions. Curriculum validation checks 19 chapters, 149 catalog lessons, 20 sources and all 60 authored lesson definitions. The browser run exercises worked and transfer cases for all 60 authored lessons. The document-discovery probe verifies all 95 Markdown references are linked.

The 90 production captures have zero page-level horizontal overflow and zero page errors. All 36 initial-state WCAG-tag axe scans have zero violations. Additional selected tensor, activation and editor scans also have zero violations; axe incomplete checks remain in the JSON. Targeted computed text contrast is at least 8.31:1 for selected tensor values/indices, 13.25:1 for activation legends and 9.99:1 for editor tokens. These are inspected state measurements, not an accessibility certification.

At 320px the first beginner prediction is y=1123.625px (audit: 2344px), inside two 844px viewports. Mobile mathematical equivalents are 14px; selected mathematical readouts at larger widths are 12–15px. The truth table scrolls using ArrowRight at both 320/390px with a visible focus outline. Production chunk-abort testing preserves the shell, reload recovers the document, and the mission snapshot restores afterwards.

Python verification serves the authentic pinned Pyodide 0.27.7 assets from an existing local mirror through the browser route fixture. It does not mock Python outputs. Direct CDN failure, cancellation and stale-result recovery are tested separately. First-use download still requires network access in the shipped app; offline support is not claimed.

## Findings

### R01

A workspace boundary keeps navigation mounted; a fresh lazy instance retries, and explicit reload preserves neuron recovery state because Chromium caches rejected imports.

Verified by: tests/audit-remediation.spec.ts: failed lazy download; production blocked-chunk probe. Observed: The production shell and retry/reload controls remain visible after an aborted chunk; reloading loads the library and restores the mission. Evidence: [evidence](audit/evidence/after/error-library-320.png); [tracker acceptance criteria](AUDIT_REMEDIATION.md). Status: Verified.

### R02

Compact staged HTML values replace scaled mobile diagrams; selected connection and derivative math stay beside their controls. A current-calculation strip sits beside neuron parameters. Timeline uses three columns on mobile.

Verified by: Five-width readable-math probes; forward/backprop/neuron browser scenarios. Observed: The measured mobile HTML math is 14px; selected mathematical inspector text is 12–15px at all five widths. No page overflow was observed. Evidence: [evidence](audit/evidence/after/neuron-320.png); [tracker acceptance criteria](AUDIT_REMEDIATION.md). Status: Verified.

### R03

The objective and prediction precede optional explanation; topic navigation and saved evidence are disclosures. Existing recall/explanation gates remain unchanged.

Verified by: 320px position probe; all 60 worked and transfer authored lessons; keyboard hint/review tests. Observed: The first prediction starts at y=1123.625px on 320px, versus y=2344px in the audit. All 60 authored worked/transfer cases still satisfy their gates. Evidence: [evidence](audit/evidence/after/beginner-320.png); [tracker acceptance criteria](AUDIT_REMEDIATION.md). Status: Verified.

### R04

Header and main become inert; the scrim covers the viewport. Focus traps inside the drawer, Escape restores the trigger, and navigation/resize closes it.

Verified by: Drawer isolation regression and production pointer/focus/resize probe. Observed: Mouse and touchscreen activation through the open scrim cannot change the route; 40 Tabs remain in the dialog, Escape restores focus, and desktop resize removes inert state. Evidence: [evidence](audit/evidence/after/drawer-focus-390.png); [tracker acceptance criteria](AUDIT_REMEDIATION.md). Status: Verified.

### R05

The mission snapshot belongs to the persistent lab store; copies of all parameters survive workspace unmount and remain available after reset. Restore clears the snapshot explicitly.

Verified by: Mission navigation/recovery regression; mission altered-setup, wrong/correct and restoration tests. Observed: Navigation returns with restoration available. Wrong/correct biases still produce 0 and 1.5, and restore returns the prior experiment. Evidence: [evidence](audit/evidence/after/state-neuron-768.png); [tracker acceptance criteria](AUDIT_REMEDIATION.md). Status: Verified.

### R06

Tensor selection uses a dark panel with readable indices; activation legend text is not faded; CodeMirror uses explicit scientific syntax colors on dark surfaces.

Verified by: 36 initial-state axe scans; mobile/desktop selected-state axe scans; computed rendered contrast ratios. Observed: Targeted rendered contrast minima are tensor 8.31:1, legend 13.25:1 and editor 9.99:1. Selected-state mobile/desktop axe scans report no violations. Evidence: [evidence](audit/evidence/after/contrast-final.json); [tracker acceptance criteria](AUDIT_REMEDIATION.md). Status: Verified.

### R07

The interactive chart is a named group. Layer controls expose pressed state and prevent default for Enter/Space; a native layer select supplies the same exact inspector.

Verified by: Space selection regression, existing depth test, changed-state Enter/Space comparison, axe. Observed: Space and Enter both select Layer 3 and show its exact accumulated derivative 0.0096416; native layer selection remains available. Evidence: [evidence](audit/evidence/after/state-gradient-depth-768.png); [tracker acceptance criteria](AUDIT_REMEDIATION.md). Status: Verified.

### R08

The table overflow region is named, focusable, and has a visible focus outline. The native table and column headers remain.

Verified by: 320/390px focus plus ArrowRight scroll probes; axe scrollable-region-focusable. Observed: At both mobile widths ArrowRight changes scrollLeft to 40px, with a solid focus outline and all six native column headers. Evidence: [evidence](audit/evidence/after/probe-truth-table-keyboard-320.png); [tracker acceptance criteria](AUDIT_REMEDIATION.md). Status: Verified.

### R09

Inspector tabs have linked IDs/panels, a single tab stop and roving ArrowLeft/Right/Home/End focus. Panel content stays keyboard reachable.

Verified by: Roving-focus regression and neuron changed-state ArrowRight comparison. Observed: ArrowRight moves Math to Code, with the Code panel linked by aria-labelledby. Home/End select the first/last tabs. Evidence: [evidence](audit/evidence/after/state-neuron-768.png); [tracker acceptance criteria](AUDIT_REMEDIATION.md). Status: Verified.

### R10

Validated topic and document query parameters own nested selection and browser history. Authored items are native anchors. All imported reference documents appear in the document index, including CH00 extras.

Verified by: Topic Back/Forward/refresh/invalid-ID regressions; library browser coverage and document URL probe. Observed: All 95 Markdown references are discoverable. Fresh-context deep URLs and Back/Forward restore the chosen document/topic; Markdown references expose native deep links. Evidence: [evidence](audit/evidence/after/state-library-768.png); [tracker acceptance criteria](AUDIT_REMEDIATION.md). Status: Verified.

### R11

Compact chapter navigation sits beside desktop reading. Mobile hides the index in reading mode, with an explicit return restoring query and index scroll. Specification and implemented practice are labeled.

Verified by: Library detail/search regression; existing Markdown and library scenarios; five widths. Observed: First, middle and last chapter documents open in the first mobile viewport. Returning keeps the search value; no intervening chapter contents must be traversed. Evidence: [evidence](audit/evidence/after/library-320.png); [tracker acceptance criteria](AUDIT_REMEDIATION.md). Status: Verified.

### R12

Review receives the current lesson chapter, resets context when that chapter changes, and retains a deliberate review choice within that context. Persisted reviews keep chapter identity.

Verified by: Chapter 7 context regression; mixed reviews for every implemented chapter. Observed: Selecting Training diagnostics selects chapter 7 review. Mixed reviews pass independently for every implemented chapter, retaining their chapter identity. Evidence: [evidence](audit/evidence/after/state-beginner-768.png); [tracker acceptance criteria](AUDIT_REMEDIATION.md). Status: Verified.

### R13

Bounded whitelisted sandbox input/prediction drafts resume and travel in existing version-1 backups. Execution traces and practice checks remain visit-local and explicitly require rerunning. Course evidence and inference checkpoints retain their original provenance.

Verified by: Draft-refresh browser regression; sandbox backup/parser unit tests; backup/provenance/training tests. Observed: A resumed basics draft retains x=-3 and prediction=-9 but has no assigned Python result until re-executed. Version-1 sandbox backup/parser checks pass. Evidence: [evidence](audit/evidence/after/state-python-basics-768.png); [tracker acceptance criteria](AUDIT_REMEDIATION.md). Status: Verified.

### R14

One action stylesheet owns execution variants: primary run, secondary transport, subdued unavailable actions and consistent danger cancellation. Source is optional; ready/loading/executing states explain availability.

Verified by: Execution/cancel/stale-input browser scenarios and five-width gallery inspection. Observed: Run actions are pale aqua, cancel actions use coral outlines, and unavailable transport is subdued. All execution/cancel/stale-result scenarios pass. Evidence: [evidence](audit/evidence/after/python-flow-320.png); [tracker acceptance criteria](AUDIT_REMEDIATION.md). Status: Verified.

### R15

Migrated execution-action variants into a single stylesheet and removed the competing legacy Python action colors. Selected tensor/legend and editor syntax roles use the supplied palette. Broader legacy CSS remains intentionally incremental.

Verified by: Source cascade inspection; five-width screenshots; all execution interactions. Observed: The migrated Python action color declarations have one stylesheet owner; competing legacy rules are removed. All five-width initial images and interactions remain valid. Evidence: [evidence](audit/evidence/after/python-basics-1440.png); [tracker acceptance criteria](AUDIT_REMEDIATION.md). Status: Verified.

### R16

Fresh numerical transfer tasks require a finite prediction before reveal; XOR lets learners construct and test a boundary. Workshop validates all required mathematical fields. Exploratory feedback never awards authored mastery.

Verified by: Transfer reveal/course-isolation browser regression; XOR and workshop-contract unit tests. Observed: Fresh tensor prediction 6 and activation prediction -0.35 match after submission; the XOR construction yields 3/4 with the shown boundary. Incomplete workshop payloads do not satisfy the exercise contract. Evidence: [evidence](audit/evidence/after/state-perceptron-768.png); [tracker acceptance criteria](AUDIT_REMEDIATION.md). Status: Verified.

### R17

Loss shows numerical y ticks; depth explains its inverse logarithmic scale with numeric magnitudes; contour has coordinate ticks and actual loss levels from its anisotropic quadratic.

Verified by: Engine/contour unit checks; loss, depth and matrix/surface browser tests; mobile/desktop visual inspection. Observed: The depth readout agrees with its logarithmic scale, loss update moves w=2 to 1.8, and the quadratic contour descent reaches loss 1.3215 after one update. Evidence: [evidence](audit/evidence/after/math-workshop-320.png); [tracker acceptance criteria](AUDIT_REMEDIATION.md). Status: Verified.

### R18

Text drafts retain blank, transient minus, nonfinite and out-of-range entries with explicit validation. Computation keeps the last valid matrix and updates exactly when corrected. Selected A row and B column expose the dot product operands.

Verified by: Invalid-draft regression; matrix B[1,1]=2 gives C[1,1]=8 and genuine NumPy output. Observed: Invalid 999 remains visibly invalid while the last valid calculation is retained. Valid B[1,1]=2 updates C[1,1] to 8 and genuine NumPy returns the same value. Evidence: [evidence](audit/evidence/after/state-math-workshop-768.png); [tracker acceptance criteria](AUDIT_REMEDIATION.md). Status: Verified.

### R19

A status announces match count or an explicit no-match message. Show all topics clears the filter without removing focus unexpectedly. Recommendation is the first actionable section.

Verified by: Dashboard empty/search regression and changed-state probe. Observed: A zero-match search announces an explicit message and clear-search restores results; its action also opens the exact authored topic URL. Evidence: [evidence](audit/evidence/after/state-dashboard-768.png); [tracker acceptance criteria](AUDIT_REMEDIATION.md). Status: Verified.

### R20

Task compositions now emphasize tensor-region selection, selected derivative chain, loss prediction, executable assignment/scope, matrix operands, simple training decision, library reader, dashboard recommendation, and fresh transfer tasks. Shared source is disclosed and secondary.

Verified by: All 18 routes at five widths; representative changed-state checks; existing meaningful browser scenarios. Observed: All 18 task compositions and representative changed states render without page errors across the gallery. Source remains available in disclosures and existing controls continue to work. Evidence: [gallery](audit/GALLERY.md); [tracker acceptance criteria](AUDIT_REMEDIATION.md). Status: Verified.

## Persistence and assessment contract

Sandbox basics/flow/training inputs and predictions resume on the same browser, are validated and bounded, and travel in existing version-1 learning backups. Importing a backup restores draft data for the next workspace mount/reload. Executed traces and sandbox practice checks are visit-local; resumed drafts require genuine re-execution. They never write authored course evidence. Authored worked/transfer attempts, hint provenance, explanations, recall ratings, mixed review identity and inference checkpoints retain their existing storage and backup contracts. A checkpoint restores inference parameters; it is not exact training continuation.

Fresh sandbox transfer tasks hide their numerical answer until a finite prediction is submitted. Recognition questions remain orientation checks. XOR has a real four-corner construction experiment, and editable workshop exercise validation requires all specified fields. No learner study, retention improvement, field performance improvement or independent mastery is claimed.

## Review and limitations

Execution-action styles are consolidated incrementally. Legacy styling outside that primitive remains; broad removal would add unnecessary regression risk. Existing large curriculum/WebGL chunks still trigger Vite's size advisory and remain lazy. The optional 3D renderer retains the tested 2D fallback.

[Draft PR #27](https://github.com/amarjaleelbanbhan/V9T1/pull/27) is open. The connected GitHub app published the preserved audited baseline and focused remediation commits; every published tree matches the corresponding local tree. The CLI token was unavailable. No merge or production promotion is part of this remediation. Remote commit references are in the tracker.
