# Feature opportunity register

The goal is beginner understanding and a resumable learning loop, not an unlimited catalog of widgets. Existing lessons, 2D plots, chapter reviews, source references and Python calculations were preserved.

| Opportunity | Learner benefit / objective | Existing coverage | Complexity / maintenance | Performance / budget | Verification | Decision |
| --- | --- | --- | --- | --- | --- | --- |
| Lesson roadmap and prerequisite links | Connect concepts before calculating | Implicit only | Small curated chapter bridges | Negligible; $0 | Catalog validation, browser navigation | Implemented |
| Four recall prompts per topic | Retrieve concept, formula, number and misconception repair | Guided MCQ only | Small authored-content adapter | Lazy shared learner chunk; $0 | Reveal gating, FSRS/date/history tests | Implemented |
| FSRS schedule | Return when a card is due | Fixed one-day rule | OSS scheduler; default parameters | Local state; $0 | Ratings, lapses, corruption and round-trip tests | Implemented |
| Feynman drafts/checklist | Explain, locate a gap and revise | Self-reviewed mini-project text | Simple per-topic editor/checklist | 8,000-character draft cap; $0 | Save/reload and self-review semantics | Implemented |
| Dashboard/glossary/bookmarks | Resume and find needed vocabulary | Lesson navigation only | Small browser-local state | 60-topic search; $0 | Bookmark/search/resume mobile flows | Implemented |
| Transparent adaptive recommendation | Prioritize due cards and repeated mistakes | None | Deterministic documented rule | No paid inference | Recommendation order unit tests | Implemented |
| Learning backup | Preserve drafts and recall schedules | Browser storage only | JSON schema validation | Local export/import; $0 | Corrupt record tests | Implemented; guided evidence and chapter reviews are included |
| Edited Python exercises | Connect changed code to output and visuals | Authored runnable examples | CodeMirror + disposable Pyodide worker | Lazy editor; bounded time/source/output; $0 | Real Python, NumPy, syntax/errors/cancel/timeout | Implemented |
| Selectable 3D neuron | Inspect products, sum and activation in depth | Static coplanar spheres | Shared scene objects/frame | Demand rendering, reduced DPR, lazy; $0 | Selection/camera/fallback and screenshots | Implemented |
| Layered 3D network and gradients | See neuron calculations and reverse sensitivity | Good existing 2D labs | Reuse actual forward/backprop engines and controls | Optional scene; $0 | Math consistency, transport and 2D alternative | Implemented |
| Orbit, zoom, pan and reset | Navigate spatial representation | Pan disabled | Existing Drei | On-demand; no paid assets | Camera control browser flow | Implemented |
| Matrix-cell inspector | Understand contracted axis in multiplication | Course table only | Fixed 2×2 editable matrices | Small SVG/DOM plus real NumPy | Changed cell formula and executed output | Implemented |
| Two-parameter loss surface | Connect derivatives to height and path | Good 1D descent lab | Exact convex example + shared scene | Capped geometry/path; $0 | Finite differences, known minimum, Python alignment | Implemented |
| Math/callouts/highlighting | Read Markdown as a structured lesson | GFM only | Maintained remark/rehype/KaTeX | Lazy document reader and fonts; $0 | MathML, Python tokens, nested lists and table | Implemented |
| Mixed exam review | Practice across each chapter | Eight existing numerical/conceptual reviews | Preserve existing assessment | No new duplicate bank | Existing full chapter tests | Preserved |
| New graph editor framework | Arbitrary network topology | Fixed beginner network adequate | High state/shape complexity | Extra bundle | No beginner objective requires it | Deferred |
| Automated explanation grading | External conceptual assessment | Self-review only | Needs evaluation and possibly a model | Paid APIs excluded; local model not justified | Cannot truthfully certify understanding | Deferred |
| Cloud sync/accounts | Cross-device progress | Local state and backup | Server/auth/data obligations | Beyond static $0 design | No verified need for this mission | Deferred |
| Full offline Python installer | Guaranteed reload offline | Loaded worker runs locally | Large multi-origin asset caching/versioning | Significant download/storage | Not guaranteed by browser cache | Deferred; limits shown |
| Full PyTorch/TensorFlow exercises | Framework-level training | Scalar/NumPy beginner labs | Large runtime compatibility costs | Not practical in current browser package set | Not advertised as installed | Deferred |

## Useful reuse

No React Flow, D3, Monaco or second rendering engine was installed. Three/R3F/Drei provide the spatial infrastructure; CodeMirror handles editor behavior; FSRS schedules review; remark/rehype handle document structure. Small numerical engines remain independently testable. Existing Python programs still execute learner arithmetic and return the visual data.
