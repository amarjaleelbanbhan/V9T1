# Beginner bug audit: Python execution and curriculum reader

Scope: existing beginner learner paths, chapters 00–07. No intermediate or advanced implementation was started. This is a tested audit of these paths, not a claim that the whole application is free of bugs.

## Findings and repairs

| Finding | Repaired behavior |
|---|---|
| Chapter Markdown was displayed verbatim in a pre element | Semantic headings, lists, emphasis, tables, links and fenced code render through react-markdown and remark-gfm; raw HTML is disabled |
| Relative lesson links left the app reader | Chapter and lesson Markdown links resolve against the current document and open inside the reader; Back to chapter restores its index |
| Scrolling the document hid its heading under the sticky header | The document has a scroll margin and receives keyboard focus |
| The neuron Code tab displayed JavaScript, with rounded literals | It displays executable Python with full current parameter precision and a real runtime output |
| The forward Code tab displayed invalid pseudocode | A complete Python loop runs the current two-layer network |
| Course answers and intermediate teaching values were calculated in JavaScript | All 60 topic workspaces execute authored Python; Python returns every stage, grid and curve used by the course renderer |
| Capstone optimization was implemented in JavaScript | Python executes seeded paired batches, SGD/momentum/Adam, regularization, validation selection, early stopping and held-out evaluation |
| Single-example backprop updates used the browser training engine | The Apply training action executes Python gradients and parameter updates before updating the visual network |
| Other visual labs offered no runnable Python implementation | Foundations, perceptron, tensors/NumPy, activations, loss descent and depth chains expose Python programs using current controls |
| Changing a prediction while asynchronous calculation ran could compromise practice evidence | Prediction controls lock during execution; input/case changes cancel pending work and clear results |
| Long Python code expanded mobile grids | Grid children allow shrinking; code panels scroll within the available width |
| Alternate numeric spellings could count as different flow-practice lists | Evidence keys use canonical numeric lists |

## Execution architecture

Pyodide 0.27.7 executes the authored Python inside a worker. The course retains one runtime for its visit; standalone examples and training retain their runtime between successful runs. Cancel, timeout, error and unmount discard pending execution. Each program has a new namespace. The first run needs the pinned CDN assets; actual NumPy is loaded for dtype and tensor inspection. No user-authored arbitrary-code editor or remote Python service was added.

The React interface and continuously responsive legacy graph previews remain browser code. Runnable learner examples, course values, capstone training/evaluation and backprop Apply updates execute Python. Legacy numerical engines remain as independently tested comparison references. Device compatibility, historical facts and similar conceptual examples remain teaching models, not actual GPU execution or learner mastery evidence.

## Regression evidence

- 200 unit tests passed, including Python/engine comparison of both authored cases and every numerical course stage/grid/curve; full batch-gradient and parameter-update comparisons for all three optimizers; stable activation, descent, depth and backprop checks.
- 38/38 browser tests passed. The suite executes all 120 course cases, real Pyodide/NumPy examples, every visual lab's Python program, Python backprop updates, training/evaluation, transfer evidence, local checkpoint restoration, Markdown navigation, cancellation/failing downloads, keyboard, reduced motion and 390px layouts.
- TypeScript/Vite build and catalog validation pass: 19 chapters, 149 entries, 20 sources and 60 implemented core beginner topics.
- Every relative Markdown link under the curriculum resolves to an existing file. Desktop/mobile reader snapshots were inspected; the captured reader flow had zero page errors and zero horizontal overflow.
- Local browser execution uses genuine pinned CDN assets mirrored into requests due to environment network restrictions; Python results are never simulated. CI exercises the same runtime with direct CDN loading.

The existing main JavaScript bundle-size warning remains. Offline Python caching, arbitrary-code editing, physical-device/screen-reader certification and learner-retention research remain outside this repair scope.
