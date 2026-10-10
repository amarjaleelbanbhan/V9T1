# NeuralLab architecture

## Existing system

React 19, TypeScript, Vite 6, Zustand, SVG, Three.js/React Three Fiber, CodeMirror, Markdown/KaTeX and ts-fsrs. There is no application backend or required paid API. Pyodide 0.27.7 runs Python in browser workers. Dependencies and lockfile remain unchanged in this iteration.

`App.tsx` selects lazy-loaded workspaces. `src/engine` contains deterministic mathematics and validation. `src/course` owns authored beginner content, evidence, hints, diagnostics, prerequisites, learning history, scheduling and backups. `src/lessons` composes feature-specific controls and results. `src/visuals` renders model values in SVG/WebGL. `public/python*-worker.js` executes Python; source and parameter changes invalidate applicable worker results. The catalog and Markdown specifications are separate from implemented lessons.

## Ownership and new boundaries

| Boundary | Owner and responsibility |
|---|---|
| Workspace location | `useWorkspace` in `src/store/workspace.ts`: whitelist IDs, URL hash routes, Back/Forward synchronization; browser storage only supplies a resume fallback |
| Shell navigation | `WorkspaceNavigation`: grouping, selected state, mobile focus lifecycle and desktop rail; receives navigation callbacks |
| Neuron parameters | Existing `useLab` store; model computed by `computeNeuron` |
| Bias field challenge | `NeuronMission`: prior parameter snapshot, prediction and last test; writes actual lab state only on explicit learner actions; no course-evidence writes |
| Chapter map | `CourseMap`: derives existing evidence states and recall provenance; delegates topic opening; does not own or migrate persistence |
| Mathematical selection | `NeuronDiagram`: selected node only; contributions, sum, bias and output stay derived from the engine's trace and current timeline stage |
| Shared colors | `palette.ts`: CSS installation and SVG/WebGL values; legacy lesson-local colors remain to be consolidated |

Navigation uses `#/lab/<workspace>` to work on static hosting without server rewrite configuration. It addresses workspaces, not individual beginner topics or parameter snapshots. Invalid workspace IDs fall back to a valid stored/default workspace. Native content anchors remain usable; the skip link focuses the main region without changing the workspace route.

## Data flow

Parameter action → Zustand → existing math engine → diagram, curve and numeric result. Challenge prediction → engine with proposed bias → committed parameter change and explanation. Beginner prediction → pinned Python worker → stages/grid/curve → rendering and authored practice check → existing progress/history. Dashboard map → selected authored topic → existing beginner workspace. FSRS recall provenance remains separate from guided practice.

## Trade-offs and debt

A small whitelist-based hash hook avoids a new router dependency for 18 existing state-selected views. Add a router only if nested routes, query-state sharing or loaders justify it. CSS composition is isolated from historical feature styling so the design can be reviewed incrementally; obsolete rules are not broadly deleted. The large conditional workspace renderer remains because its lazy-import contracts work; only shell navigation was extracted.

Pyodide cold start, lesson-specific styling, fixed transfer cases, topic-level URL state, long dashboard glossary results and unrelated chapter review placement remain. Worker reuse and generated assessments need their own correctness and cancellation investigation. The architecture changes here do not establish learning outcomes or device-wide performance.
