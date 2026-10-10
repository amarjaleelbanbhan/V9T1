# NeuralLab: page-by-page roast

Audited commit: `75df2438839a1ee80821c30cee27009a408689f6`. Every route below was opened in Chromium at 1440, 1280, 768, 390 and 320px. Every workspace also received a fresh representative interaction check; deeper authored-topic coverage from the preceding implementation verification is explicitly reused, not claimed as rerun. Images include all page content at starting state. Model/changed states are in the gallery and JSON records.

“Educational problems” describe the task design; they do not establish measured harm to retention. “What works” identifies functionality to preserve, not compliments. Source references point into the existing checkout.

## 1. Inside a Neuron — `#/lab/neuron`

**First impression:** A distinctive numerical workbench with an introductory mission. It becomes an oversized control-and-results stack on a phone.

**Visual problems:** At 320px, the SVG weight labels render at 4.97px, node numbers at 7.87px and timeline text at 8px. The selected-node button strip is more legible than the graph it describes. The desktop parameter rail is considerably taller than the diagram/playback region; the result row sits beneath both.

**Layout problems:** The main result starts at y=2088px on 320px. The challenge is prominent, but a learner adjusting bias must move between the mission input, diagram, parameter controls and result. Four transport buttons, six stage buttons and six node buttons compete in the same area.

**Interaction problems:** ArrowRight does nothing in the ARIA inspector tabs. Leaving the loaded bias mission and returning keeps bias -2 while removing restoration. The 3D output inspector reveals 0.957 while the step-1 graph still says “?”; final output is also visible elsewhere. That is inconsistent stage storytelling, not proof of false assessment credit.

**Engineering problems:** [NeuronMission](/workspace/V9T1/src/components/NeuronMission.tsx:11) owns a local recovery snapshot while the lab store survives unmount. [App tabs](/workspace/V9T1/src/App.tsx:103) omit tabpanel linkage and keyboard handling. [NeuronDiagram](/workspace/V9T1/src/visuals/NeuronDiagram.tsx:8) scales fixed geometry.

**Educational problems:** The mission says “Test & explain” but accepts only a numerical bias; no learner explanation is collected. It is a useful bounded experiment, not evidence of transfer. Timeline concealment and final-value inspectors need a consistent exploration/reveal policy.

**What works:** Keyboard changes updated the real output from 0.957 to 0.98. Wrong/correct mission biases produced 0 and 1.5. Exact equations, step inspection and optional 3D are worth retaining.

**Specific redesign direction:** Put objective, selected contribution, predicted bias and resulting activation into one compact task region. At narrow widths, show a staged graph with readable HTML operands and an adjacent result strip. Make exhaustive parameters/trace secondary, retain explicit 3D, and preserve recovery across navigation.

**Priority:** High — R02, R05, R09, R14. [Desktop](evidence/before/neuron-1440.png) · [320px](evidence/before/neuron-320.png) · [changed state](evidence/before/state-neuron-768.png).

## 2. Names, values, instructions — `#/lab/python-basics`

**First impression:** A readable introductory worksheet that spends its first section defining vocabulary before the trace can exist.

**Visual problems:** The three large “Not assigned” blue cards dominate an empty trace state. Four similarly styled execution/transport buttons appear before the learner has a result. The cancel button is coral but initially disabled; its visual prominence is unnecessary at that moment.

**Layout problems:** Vocabulary, three inputs, execution actions, code, variable cards, output and transfer evidence occupy separate vertical regions. On a phone, the source and values become distant rather than showing assignment as a spatial relationship.

**Interaction problems:** Real execution must complete before stepping becomes available. After leaving or reloading, attempts disappear. The page honestly says that, but moving to a related concept interrupts the practice workflow.

**Engineering problems:** [PythonBasicsLab](/workspace/V9T1/src/lessons/PythonBasicsLab.tsx:5) owns attempts locally. Its source packs execution, attempt recording and complete JSX into a very compressed component. The worker interface is separate and should stay separate.

**Educational problems:** The stored-assignment distinction is meaningful. The evidence checklist is a visit-local goal with fixed suggested examples; it does not establish durable transfer. Showing vocabulary and the whole support sequence before an action adds orientation cost.

**What works:** Python computed product 6, stepping reached the final stored value, and the assignment explanation check operated. Positive/negative-input practice asks for more than a page visit.

**Specific redesign direction:** Start with the current instruction and two adjacent name/value slots. Ask for the next value, run, then animate the assignment and explicitly show that later x changes do not rerun product. Disclose vocabulary inline. Preserve intended practice drafts when moving between tools without granting course credit.

**Priority:** Medium — R13, R14, R20. [Desktop](evidence/before/python-basics-1440.png) · [320px](evidence/before/python-basics-320.png) · [executed state](evidence/before/state-python-basics-768.png).

## 3. Follow repetition and calls — `#/lab/python-flow`

**First impression:** Three useful execution examples arranged as another form followed by a transcript.

**Visual problems:** The mode buttons, five action buttons and supporting terminology are dense and mostly equal in emphasis. The initial page hides the source until execution, leaving a large instructional state instead of a visible loop/call model.

**Layout problems:** Mode explanation, vocabulary, inputs, prediction, action row, globals, locals and output are sequential. The relationship between a function call and its scope is described through JSON blocks rather than visually grouped around the call.

**Interaction problems:** Mode/input changes correctly invalidate results. Fresh execution of the positive-item loop produced total 5. The “Inspect completed trace” shortcut can bypass step-by-step replay; that is useful exploration, but not by itself a reasoning check.

**Engineering problems:** [PythonFlowLab](/workspace/V9T1/src/lessons/PythonFlowLab.tsx:10) keeps evidence visit-local and embeds mode content/logic in a compact source file. It separates worker execution from display, which should be retained.

**Educational problems:** The scope concept is real, but raw globals/locals JSON makes the learner translate program structure into a visual model themselves. Two distinct lists are a sensible criterion, yet a completed visit is not resumed elsewhere.

**What works:** Actual conditions, call-local values and retained object state are implemented; the fresh loop trace and conceptual response worked. Existing verification covers the other modes on the same implementation.

**Specific redesign direction:** Give loops a highlighted collection/cursor, functions a call frame that opens and closes, and objects an instance-state panel. Keep captured Python events as the authority. Reveal transport after execution and place the prediction beside the relevant transition.

**Priority:** Medium — R13, R14, R20. [Desktop](evidence/before/python-flow-1440.png) · [320px](evidence/before/python-flow-320.png) · [executed state](evidence/before/state-python-flow-768.png).

## 4. Build intuition before networks — `#/lab/intro`

**First impression:** A broad foundations lesson combining a taxonomy diagram, a prediction task, metrics and a quiz. It lacks one dominant learner objective.

**Visual problems:** The green nested AI/ML/DL illustration belongs to an older visual dialect. Accuracy, precision, recall and confusion matrix appear as several blue containers inside another container. The chart beside the metric stack stretches into a large quiet area.

**Layout problems:** Concept selection and classification/regression experiments are unrelated task modes on the same long page. They have similar section emphasis. The source listing/code actions arrive as a long tail rather than an intentional inspection state.

**Interaction problems:** Changing the threshold genuinely changed accuracy from 100% to 67%; the regression check returned valid feedback. The family-map buttons primarily switch explanatory content, so that portion is an interactive reference, not a model experiment.

**Engineering problems:** [FoundationsLab](/workspace/V9T1/src/lessons/FoundationsLab.tsx:113) derives metrics from the classification model. Feature-local chart colors/styles remain separate from shared palette roles; the initial executable-Python block reports “Inputs changed” despite no learner edit.

**Educational problems:** Accuracy, precision and recall are meaningful but introduced simultaneously. The continuous-number check repeats the distinction just explained. A more concrete error trade-off task would force the student to inspect consequences.

**What works:** Target/predicted labels and real confusion counts allow causal experimentation. Preserve the bounded-dataset disclaimer and source mapping, in secondary reference UI.

**Specific redesign direction:** Make a single classification mission: choose a threshold under a stated false-positive/false-negative cost, predict affected samples and inspect the result. Keep regression as a clear alternate task and taxonomy as compact prerequisite help. Render metrics in a ledger next to the plot.

**Priority:** Medium — R14–R16, R20. [Desktop](evidence/before/intro-1440.png) · [320px](evidence/before/intro-320.png) · [changed state](evidence/before/state-intro-768.png).

## 5. One neuron, a decision — `#/lab/perceptron`

**First impression:** A comprehensible gate simulator followed by a truth-table worksheet. The XOR challenge feels appended.

**Visual problems:** The live plot, parameter panel, three metric boxes and full-width table repeat information with similar weight. Green/amber labeling differs from the shared slate/coral selection language. The table becomes an internal horizontal scroll region on mobile.

**Layout problems:** Parameters and a selected point sit above the complete truth table; a learner must move between them to compare all four cases. The XOR question appears below a large table even though there is no XOR target mode in the experiment.

**Interaction problems:** OR matched four cases; increasing bias reduced that to three, proving the controls affect the actual gate. The scrolling truth table lacks keyboard focus entry at 390px. This is an accessibility defect, not a page-overflow defect.

**Engineering problems:** [PerceptronLab](/workspace/V9T1/src/lessons/PerceptronLab.tsx:61) uses a scroll wrapper without focusable content. AND/OR state and mathematical calculations are already explicit; they do not need a rewrite.

**Educational problems:** Yes/No on XOR tests recognition of a limitation. Students cannot try separating its four target points with this page's existing modes, which weakens the explanation of why the limitation exists.

**What works:** Real weighted sums, threshold outputs, point selection and all-case truth-table agreement. The step convention is stated explicitly.

**Specific redesign direction:** Keep plot and four-case result strip together. Add an explicit XOR exploration with a boundary and misclassified points, then ask the learner to explain what stays impossible. Make each narrow-screen row reveal its arithmetic without losing table headers.

**Priority:** High for keyboard scrolling; Medium for composition — R08, R16, R20. [Desktop](evidence/before/perceptron-1440.png) · [390px](evidence/before/perceptron-390.png) · [changed state](evidence/before/state-perceptron-768.png).

## 6. See the shape of data — `#/lab/tensor`

**First impression:** A tensor inspector with a parameter form beside it. The many containers distract from the selected slice.

**Visual problems:** Selected cell index text is 10px with 2.28:1 contrast. Rank, shape and dtype get separate large blue boxes. The type description wraps while the useful coordinates are tiny. Selected and unselected cells deserve readable, distinguishable states.

**Layout problems:** Slice controls and the sliced result are separated from the matrix, especially on mobile. Five range controls force a learner to reconstruct which boundary changed instead of interacting with the region being sliced.

**Interaction problems:** Changing sample updated actual values from 1–9 to 10–18; changing row start produced shape (2,3). This is not fake interaction. Cells themselves are presentation rather than direct selection; index/range controls are the operative interface.

**Engineering problems:** [TensorLab](/workspace/V9T1/src/lessons/TensorLab.tsx:34) and selection styles combine the failing foreground/fill. Existing slicing/rank functions provide reusable domain logic.

**Educational problems:** The end question asks rank 1 versus rank 10 immediately after explaining rank counts axes. It offers immediate reinforcement but little independent transfer. Dtype here is a fixed Python example, not a manipulable concept.

**What works:** Real rank/shape/sample selection and exclusive-stop slicing, with explicit numeric result and genuine NumPy code.

**Specific redesign direction:** Place readable coordinates on the selected row/column edges; keep start/stop controls adjacent to a highlighted slice. Ask for a requested shape before revealing the crop, then diagnose off-by-one choices from actual indices. Keep rank/dtype in a compact information strip.

**Priority:** High for contrast/readability — R02, R06, R16, R20. [Desktop](evidence/before/tensor-1440.png) · [320px](evidence/before/tensor-320.png) · [changed state](evidence/before/state-tensor-768.png).

## 7. Follow every signal — `#/lab/propagation`

**First impression:** A working small network crowded by connection selectors and playback controls.

**Visual problems:** At narrow widths the network shrinks into a diagram much smaller than its button lists. The six connection buttons, stage-player controls and five stage buttons take more space than the graph. Many labels become the same blue box.

**Layout problems:** Selecting a connection in the graph updates a parameter panel placed much farther down on mobile. Final prediction and its math appear after the tall workbench. Controls and consequences are not kept together.

**Interaction problems:** Enter on a weighted SVG connection selected it, and changing the connection weight changed the actual page's mathematical values. 3D is optional. The initial final-stage view is good for exploration, but the direction check is essentially recognition after the input-to-output diagram already shows the answer.

**Engineering problems:** [ForwardLab](/workspace/V9T1/src/lessons/ForwardLab.tsx:37) now has group semantics and Enter/Space support. Preserve this correction; use it to guide gradient-depth semantics. Input/layer/selection ownership is explicit.

**Educational problems:** The computation is meaningful, but the easiest route is looking at a complete graph and clicking a binary direction answer. It needs a prediction or construction involving a genuinely changed connection.

**What works:** Exact edge contributions, editable biases/weights, shared layer trace, keyboard selection and optional 3D inspection.

**Specific redesign direction:** A selected-edge strip should show source × weight → contribution and destination output beside the graph at every width. Make stage replay one compact control. Ask for a weight/contribution producing a target hidden activation before revealing the full pass.

**Priority:** High for mobile readability; Medium for teaching task — R02, R14, R16, R20. [Desktop](evidence/before/propagation-1440.png) · [320px](evidence/before/propagation-320.png) · [changed state](evidence/before/state-propagation-768.png).

## 8. Reverse the signal — `#/lab/backprop`

**First impression:** A mathematically substantial lesson presented as a network plus a long calculation dump.

**Visual problems:** Multiple layers of blue containers hold prediction, target, loss, delta, source activation, gradient and proposed update. They receive similar emphasis despite distinct roles. The code listing makes the desktop page 3180px high and the 320px page 4839px high.

**Layout problems:** The derivative chain and Apply one training step live below the large graph/control workbench. A mobile learner cannot comfortably compare the selected edge, local factors and changed loss in one region.

**Interaction problems:** Fresh Python update reduced loss from 0.1058 to 0.0768. This is a real update, not a cosmetic animation. The step-1 graph and below-graph derivative inspector show different levels of reveal, making the timeline's instructional contract unclear.

**Engineering problems:** [BackpropLab](/workspace/V9T1/src/lessons/BackpropLab.tsx) uses domain traces and Python update results; preserve these authorities and stale-state handling. Feature-specific surfaces and stage controls remain separate from the neuron implementation.

**Educational problems:** It supplies all relevant arithmetic, but assembling the causal chain from several tiles is left to the learner. A two-choice direction check barely interrogates that chain.

**What works:** Selected gradients, exact local factors, proposed update, genuine applied step and before/after loss feedback.

**Specific redesign direction:** Turn the selected path into a derivative ledger: output error → activation slope → hidden contribution → selected gradient → proposed weight. Highlight its matching graph path. Ask the learner to fill or predict one factor, then show how the update changes loss. Keep the complete Python source behind explicit inspection.

**Priority:** High for task readability; Medium for refinement — R02, R14, R20. [Desktop](evidence/before/backprop-1440.png) · [320px](evidence/before/backprop-320.png) · [updated state](evidence/before/state-backprop-768.png).

## 9. Shape the signal — `#/lab/activation`

**First impression:** A usable curve explorer with an inactive legend faded past readable contrast.

**Visual problems:** Inactive legend text is 10px at 3.58:1. Small legend entries, five function buttons, two metric boxes and explanatory notes compete. The curve is the primary visual, but its current value/local derivative are separated on a phone.

**Layout problems:** Scalar functions and vector Softmax share the same container even though they are different operations. This is manageable, but the form of the teaching task should change with the operation rather than retaining a generic controls/card pattern.

**Interaction problems:** Leaky ReLU at -2 yielded -0.2; changing a Softmax logit kept the sum 1.000. The bottom ReLU/Leaky question already has its answer in the visible curve/note. Immediate feedback is useful but provides no new difficulty.

**Engineering problems:** [ActivationExplorer](/workspace/V9T1/src/lessons/ActivationExplorer.tsx:59) dims the whole legend entry with opacity. [Palette](/workspace/V9T1/src/design/palette.ts:2) does not currently own all activation state colors.

**Educational problems:** Comparing local slope and output is valuable. The current recognition check does little to make students diagnose saturation, dead ReLU regions or relative Softmax scores.

**What works:** Stable real Softmax, real scalar outputs/slopes and a shared coordinate system.

**Specific redesign direction:** Keep the plot and point inspector together, with a readable tangent/local-slope view. Ask learners to predict what changing z does in a saturated region. For Softmax, ask for a relative-score change and show all probabilities responding. Preserve text identities alongside color.

**Priority:** High for contrast — R06; Medium for task — R16, R20. [Desktop](evidence/before/activation-1440.png) · [320px](evidence/before/activation-320.png) · [changed state](evidence/before/state-activation-768.png).

## 10. Follow the loss downhill — `#/lab/loss`

**First impression:** A plot with correct arithmetic whose controls and proof extend into a separate worksheet.

**Visual problems:** Plot metrics, five arithmetic boxes, parameters, direction choices and Python source repeat the same blue-and-teal emphasis. The source tail adds considerable height. The two modes have different mathematics but a largely identical appearance.

**Layout problems:** The prediction question is below the plot, controls and full update equation that can already reveal its answer. At 320px the page is 3444px tall. The learner moves between the update strip and the starting-parameter panel.

**Interaction problems:** The corrected fresh audit clicked the control's actual accessible name, Next update, and verified weight 2 → 1.8 at 320px. The initial audit's “Next” selector failure was a harness mistake, not an app failure. Prior unchanged-source tests cover zero rate and oscillation.

**Engineering problems:** [LossGradientLab](/workspace/V9T1/src/lessons/LossGradientLab.tsx:67) names transport correctly. Shared stage playback is not used here; a distinct playback lifecycle and presentation remain. Consolidation should preserve its behavior.

**Educational problems:** The causal math is available, but the direction check follows its worked answer. Overshoot/oscillation need an intentional comparison task rather than incidental discovery through a rate slider.

**What works:** Actual loss, gradient and iterative update, explicit step transport, bounded parameter state and Python equivalent.

**Specific redesign direction:** Place the prediction directly beside the current point before the next update. Keep current gradient and proposed movement in a compact strip under the plot; show full derivation on demand. Offer stable/oscillating/unchanged experiments with learner diagnosis.

**Priority:** Medium — R14, R16, R20. [Desktop](evidence/before/loss-1440.png) · [320px](evidence/before/loss-320.png) · [updated state](evidence/before/state-loss-320.png).

## 11. See gradients fade — `#/lab/gradient-depth`

**First impression:** A genuine chain experiment with a visually clean chart that hides too much of its reading contract.

**Visual problems:** Tiny bars compress toward zero, but the log-transformed vertical scale has no numeric ticks. Historical green/amber colors differ from other network charts. The exact inspector is a large box beneath the graph.

**Layout problems:** The chosen layer, controls and total derivative are separated on mobile. Layer depth selection occurs in a small SVG target while the large controls reset selection to the beginning.

**Interaction problems:** Axe flags focusable descendants of an image-role SVG. Space on layer 3 leaves layer 1 selected; Enter selects layer 3. Linear activation with weight 2 and depth 12 yielded derivative magnitude 4096, confirming the math reacts correctly.

**Engineering problems:** [GradientDepthLab](/workspace/V9T1/src/lessons/GradientDepthLab.tsx:29) declares role=img; [custom buttons](/workspace/V9T1/src/lessons/GradientDepthLab.tsx:41) implement Enter alone. These are local widget defects.

**Educational problems:** Learners can inspect exact factors but cannot read magnitude from the unlabeled transformed axis. “More layers shrink gradients” is appropriately qualified; the page needs a diagnostic question to make that qualification active.

**What works:** Exact chain products, signed/local values and deterministic vanishing/amplification examples.

**Specific redesign direction:** Use a grouped chart with readable scale labels and an HTML layer selector. Keep local factor, cumulative derivative and selected bar together. Ask the learner to diagnose whether a changed weight, saturation or zero ReLU slope causes the observed result.

**Priority:** High — R07; Medium for chart literacy — R17. [Desktop](evidence/before/gradient-depth-1440.png) · [320px](evidence/before/gradient-depth-320.png) · [changed state](evidence/before/state-gradient-depth-768.png).

## 12. Learn, calculate, explain — `#/lab/beginner`

**First impression:** A curriculum management page, lesson worksheet, recall tool, writing exercise and review form stacked into one destination.

**Visual problems:** The first screen emphasizes evidence states and caveats; the main exercise is much farther down. The nested topic list becomes a 338px scroll viewport over 4803px of topic buttons at 320px. Vocabulary, instructions, hints, writing and self-review each add another region.

**Layout problems:** First prediction at y=2344px; full first lesson 6434px tall on 320px. There is a global rail and a second course navigation. The mixed chapter review begins near y=5428px and defaults to CH-00 independent of the selected topic.

**Interaction problems:** Fresh Python revealed the first worked result 7. Switching to Training diagnostics kept the same URL and CH-00 review selection. Wrong predictions, hints and evidence have real gates; the volume of surrounding controls obscures them.

**Engineering problems:** [BeginnerCourse](/workspace/V9T1/src/lessons/BeginnerCourse.tsx:23) combines lesson workspace state/transitions and rendering; [ChapterReview](/workspace/V9T1/src/lessons/ChapterReview.tsx:5) owns independent context. Topic state is outside the URL.

**Educational problems:** This does not visually deliver the stated approximately 90% experimentation philosophy. The ratio is not measured, but the first-action position demonstrates the contradiction in task order. Written mini-projects are self-reviewed, not automated mastery. Fixed authored transfer cases can be revisited after seeing solutions; independent competence needs fresh validated problems and learner evidence.

**What works:** Sixty authored topics, predict-before-reveal Python, progressive hints, diagnostics, assisted/unaided provenance, explanations, recall and backups. Preserve these rather than replacing the course.

**Specific redesign direction:** One topic route and one task screen with a compact topic switcher. Offer vocabulary/hints beside the task. After practice, offer explain/recall deliberately and present the current chapter review at a checkpoint. Keep evidence policy concise and link its full definitions.

**Priority:** High — R03, R10; Medium — R12, R16. [Desktop](evidence/before/beginner-1440.png) · [320px](evidence/before/beginner-320.png) · [changed topic](evidence/before/state-beginner-768.png).

## 13. Train a model you can inspect — `#/lab/training-project`

**First impression:** A real training tool asking a beginner to configure several advanced settings before seeing a model.

**Visual problems:** Eight configuration controls, split/regularization vocabulary, first-batch table, direction choices, training/evaluation/checkpoint buttons and a native disabled cancel control crowd the initial page. Controls have little hierarchy by learner importance.

**Layout problems:** First-update prediction is below configuration and preview; transfer evidence and checkpoint restoration follow the results. On mobile the page is nearly 3000px even before results expand it.

**Interaction problems:** Fresh execution produced validation-selected w=1.962746 and b=0.980556; held-out half-MSE 0.000854 beat the baseline 0.638726. The inference checkpoint saves; project transfer evidence lasts only this visit. A student returning to inspect the saved model loses the practice workflow.

**Engineering problems:** [TrainingProject](/workspace/V9T1/src/lessons/TrainingProject.tsx:11) owns config/run/test/checkpoint/evidence in one compressed component. Split identities, genuine updates and held-out authority are separate domain contracts worth retaining.

**Educational problems:** The project exposes regularization, patience, seed, optimizer and batch size before learners have a baseline mental model. Checkpoint limitations are correctly disclosed; they should not be mistaken for exact training continuation.

**What works:** Seeded paired rows, real optimizers, validation selection, test isolation, update inspection and inference checkpoints.

**Specific redesign direction:** Begin with a preset dataset/model and one learning-rate decision. Show fitted line/loss/first update, then disclose optimizer/batch/regularization settings as experiments. Make validation selection and held-out evaluation distinct workflow stages with resumable draft state.

**Priority:** Medium — R13, R14, R20. [Desktop](evidence/before/training-project-1440.png) · [320px](evidence/before/training-project-320.png) · [trained state](evidence/before/state-training-project-768.png).

## 14. Explore your learning path — `#/lab/library`

**First impression:** An ambitious reference catalog that visually overpromises a learning path unless the student reads its implementation-status caveat.

**Visual problems:** Nineteen long chapter summaries and topic lists form a repeated two-column editorial grid. On mobile that becomes an 8849px single-column index. Status metadata is small while every chapter's read-specification action is similarly prominent.

**Layout problems:** Chapter detail is appended after the entire grid. Opening the first chapter at 768px jumps to y=4298px. Search helps, but reading and returning to the original result is still a disorienting context switch.

**Interaction problems:** Search for attention yielded one chapter; all 19 chapter readers and 83 internal link visits are browser-traversed in the coverage appendix. Two authored CH-00 Python documents lack reader links; 87 planned catalog entries deliberately lack separate Markdown documents. URLs remain the workspace URL, so a document cannot be shared and Back does not navigate the document sequence. Blocking the library chunk erased the whole app.

**Engineering problems:** [CurriculumLibrary](/workspace/V9T1/src/lessons/CurriculumLibrary.tsx:16) renders every catalog card before detail; local selection/documentPath is independent of URL state. Dynamic import rendering needs root error containment.

**Educational problems:** A specification library supports reference/research; it does not supply all 149 implemented learning activities. The title and broad zero-to-advanced framing require stronger separation between available practice and planned specifications.

**What works:** Search/filter, source-backed documents, math/code rendering, internal document loading and clear written implementation limits.

**Specific redesign direction:** A compact searchable chapter index beside readable detail on desktop, dedicated detail with a clear return path on mobile, deep document links and strong “Practice available / Reference specification” labels. Keep source content and provenance.

**Priority:** High — R01, R10, R11. [Desktop](evidence/before/library-1440.png) · [320px](evidence/before/library-320.png) · [chapter state](evidence/before/chapter-CH-00.png).

## 15. Watch an array come alive — `#/lab/python`

**First impression:** A bounded NumPy demo with empty output until the runtime downloads.

**Visual problems:** Six numeric inputs and a prominent action row take precedence over a short source listing. Initial and empty output are plain text with little explanatory structure. The computation is much narrower than the “execution lab” navigation label suggests, although scope is stated in the page copy.

**Layout problems:** Inputs, source, trace, payload caveat and captured output appear in separate regions. The shape/rank/dtype/bytes concepts could be attached directly to the array representation.

**Interaction problems:** Fresh authentic Python produced shape (2,3), float32, rank 2 and 24-byte data payload; stepping worked. Direct CDN access failed because of the cloud browser certificate. Offline loading is not implemented, and the page correctly says so.

**Engineering problems:** [PythonTraceLab](/workspace/V9T1/src/lessons/PythonTraceLab.tsx) wraps a fixed worker program with six editable values. It should remain a bounded exercise, distinct from the editable workshop.

**Educational problems:** Changing cell values does not change shape/dtype in this fixed exercise, so much of the concept is observed rather than investigated. Running and stepping without predicting a property is weaker than the neighboring beginner tasks.

**What works:** Genuine NumPy execution, captured line events and an accurate distinction between data payload and runtime/object overhead.

**Specific redesign direction:** Keep array cells and shape/dtype/payload annotations together. Ask for a predicted property before running; offer a small validated alternative shape/dtype exercise if teaching those relationships, without pretending to be a general Python runner.

**Priority:** Medium — R14, R16, R20. [Desktop](evidence/before/python-1440.png) · [320px](evidence/before/python-320.png) · [executed state](evidence/before/state-python-768.png).

## 16. Keep the learning moving — `#/lab/dashboard`

**First impression:** A useful next-step screen that continues into a course map, scheduling explanation, glossary, history and backup administration.

**Visual problems:** Four statistics, a recommendation, eight chapter stations and a glossary compete for attention. The glossary renders all 60 topic definitions inside a 650px scrolling region; it is bounded, not an unbounded 60-card page. The overall 320px page is still 4365px tall.

**Layout problems:** Review queue follows the large map. Glossary and backup make the same destination both a study hub and data-management screen. Multiple scroll regions add another browsing mode.

**Interaction problems:** Map selection opens a real authored lesson. A no-match glossary search gives zero articles and no message. The recommended/Resume actions may point to the same first topic in an empty profile; their relative importance is unclear.

**Engineering problems:** [LearningDashboard](/workspace/V9T1/src/lessons/LearningDashboard.tsx:135) lacks an empty-state branch. [CourseMap](/workspace/V9T1/src/components/CourseMap.tsx:11) correctly derives existing evidence. Preserve that ownership and backup validation.

**Educational problems:** Explanations of FSRS rules and evidence limits are honest but too prominent for a next-action hub. The glossary encourages reference browsing, not necessarily retrieval. Recall logs are activity records; their count should not be mistaken for retained competence.

**What works:** Recommendations, real topic opening, assisted/unaided/recall distinctions, schedules, drafts and portable backups.

**Specific redesign direction:** Lead with one next task and a compact due-review summary. Keep the map as expandable progress context. Search should return concise matches/count/empty guidance; full glossary and data management can be intentional secondary destinations/disclosures.

**Priority:** Medium; Low for the local empty-state fix — R19, R20. [Desktop](evidence/before/dashboard-1440.png) · [320px](evidence/before/dashboard-320.png) · [search state](evidence/before/state-dashboard-search-768.png).

## 17. Make the code your own — `#/lab/python-workshop`

**First impression:** The most direct task-oriented workspace, but its gray One Dark editor visibly belongs to another theme.

**Visual problems:** Red syntax tokens fail contrast at 4.08:1 on the active line and 4.38:1 elsewhere. The editor uses gray backgrounds despite the surrounding teal surfaces; code output is raw JSON. Reset can look more actionable than Execute when a prediction is empty.

**Layout problems:** The prediction field sits above the editor; results and explanation sit below it. A coding exercise can tolerate this, but long source/result states need an integrated comparison rather than another vertical dump.

**Interaction problems:** Editing result output to 3 and predicting 3 executed correctly. Changing source cleared stale output. Real source errors and execution limits are implemented and previously tested; fresh audit did not rerun every bound/infinite-loop case.

**Engineering problems:** [PythonEditor](/workspace/V9T1/src/components/PythonEditor.tsx:29) combines One Dark with an additional theme; rendered token/background contrast still fails. Editor cleanup, read-only support and external-value synchronization are explicit and should stay.

**Educational problems:** Templates provide authentic editing tasks; explanation text is self-reviewed rather than automatically graded. A direct edit returning the guessed number can satisfy the displayed match without demonstrating the original mathematical task, so prediction matching alone is not an assessment.

**What works:** Actual editable Python, source invalidation, worker bounds, syntax errors and a separate NumPy exercise.

**Specific redesign direction:** Use contrast-tested syntax roles within the teal system. Give each template one precise success condition with model-derived checks where appropriate, preserve unrestricted exploratory edits within current bounds, and distinguish “output matched” from “task solved.”

**Priority:** High for contrast — R06; Medium for task contracts — R14, R16. [Desktop](evidence/before/python-workshop-1440.png) · [320px](evidence/before/python-workshop-320.png) · [edited state](evidence/before/state-python-workshop-768.png).

## 18. Inspect a cell. Follow a slope. — `#/lab/math-workshop`

**First impression:** Two mathematically related but operationally separate tools placed in a long page. Native blue range controls visibly break the shared language.

**Visual problems:** Matrix fieldsets, result-cell buttons, equation, source code, three sliders, prediction field, action row, contour, values and another source listing create a mixed document/tool silhouette. The contour has no numerical coordinate ticks or labeled loss levels.

**Layout problems:** A matrix exercise and weight/bias loss descent occupy separate sections. Their relationship is not explained as a task sequence. The first Python listing separates them further. On 320px the page is 3290px tall before expanded result states.

**Interaction problems:** Selecting C[1,1] and changing B[1,1] to 2 produced 8. Entering 999 silently left the field at 2. The predicted first descent loss produced 1.3215 from an initial 1.8333. Optional 3D maps loss to height; equivalent numerical values remain available.

**Engineering problems:** [MathWorkshop input handler](/workspace/V9T1/src/lessons/MathWorkshop.tsx:59) discards invalid text. [Contour](/workspace/V9T1/src/lessons/MathWorkshop.tsx:198) draws actual fixed-dataset ellipse levels but leaves them unlabeled; correct mathematics does not make the plot self-explanatory.

**Educational problems:** Row×column inspection is meaningful; keeping source/result together would strengthen it. The contour requires students to infer coordinates and level meaning. 3D is educationally justified here through weight, bias and loss, provided the axes/readout remain clear.

**What works:** Exact matrix products, selected-cell formula, genuine Python equivalents, real descent path and a mathematical loss surface.

**Specific redesign direction:** Give matrix multiplication a row/column highlight crossing at the chosen output cell, with editable draft text and inline validation. Give loss descent a separately selectable task with labeled contours, point inspector and predicted next step. Preserve both domain implementations and optional 3D.

**Priority:** Medium — R17, R18, R20. [Desktop](evidence/before/math-workshop-1440.png) · [320px](evidence/before/math-workshop-320.png) · [changed state](evidence/before/state-math-workshop-768.png).
