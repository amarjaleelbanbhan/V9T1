# Verification and boundaries

## Reproducible checks

- `npm ci --no-audit --no-fund` uses the committed dependency lock.
- `npm run check:curriculum`: 19 chapters, 149 catalog lessons, 20 sources; 60 authored beginner topics and their routes validated.
- `npm test`: 208 tests passed, including all existing numerical/Python regressions and new FSRS, storage, backup, recommendation and loss-surface tests.
- `npm run build`: TypeScript and Vite production build passed. Large optional Markdown and Three chunks still trigger the existing bundle-size warning.
- Browser verification: final result is recorded with the PR checks. The local command uses `NEURALLAB_PYODIDE_ASSETS=/workspace/scratch/f9dbdc03cf7b/pyodide-assets npx playwright test`. This mirror supplies genuine pinned Pyodide/NumPy assets; it does not mock Python calculations. GitHub CI uses the public pinned CDN.
- `node scripts/capture-beginner.mjs`: renders six after screenshots for visual review; two baseline screenshots are retained.
- `git diff --check`: no whitespace errors.

## Covered behavior

Every beginner worked/transfer case; numerical and conceptual evidence; mixed chapter review; actual Python and NumPy execution; stale result clearing; source edits; cancellation; invalid imports; bounded output; syntax failure; infinite-loop timeout; malformed returned visual data; retained draft/bookmark/FSRS schedule; corrupt/nonexistent topic fallback; glossary; restored topic; matrix-cell formula; loss surface and finite differences; 3D inspection; keyboard stage rewind; 2D alternative; WebGL unavailable fallback; repeated scene switching; semantic Markdown, MathML, nested lists, callouts, syntax highlighting and rejection of raw HTML/unsafe links; narrow mobile layout and reduced motion.

## Known limits

- No learner trial has measured comprehension, exam results or retention gains. Guided criteria, recall ratings and explanation checklists must not be described as mastery certification.
- FSRS uses default parameters with target retention 0.9, not individually fitted parameters or a measured 90% retention rate. Logs are bounded to the most recent 2,000 events.
- Prerequisite hints and analogies are curated at topic/chapter level; executed stages provide the numerical derivations. The audit does not claim every topic is equivalent to a full textbook chapter.
- Edited Python runs in a disposable browser worker, with 20,000-character source/output limits, a 1 MB serialized result limit and 10-second execution limit after runtime/package loading. First downloads have a 90-second overall timeout. A worker does not provide an operating-system memory quota or a server security sandbox. The editor is for supported math/NumPy exercises, not arbitrary privileged scripts. No secrets should be embedded.
- Browser storage can be cleared or denied. The UI reports storage failure; backup exports include learning, guided practice and chapter reviews. There is no automatic cross-device account sync.
- First Python use needs an internet download. Offline reload is not guaranteed. No full PyTorch/TensorFlow environment is installed.
- The 3D network topology and 2×2 matrix exercise are intentionally small. The loss surface is a labeled convex example; its clipped geometry does not replace the exact numerical inspector.
- Tested in Chromium and mobile emulation, not physical mobile Safari or every GPU. WebGL fallback retains the course. There is no quantified low-end-device FPS target or long-duration heap certification.
- Intermediate and advanced chapters remain planned. This PR completes the coordinated beginner improvement mission, not the entire eventual deep-learning platform.

## Git and merge gate

Repository: https://github.com/amarjaleelbanbhan/V9T1 . Base: `e565635ff7e54c6fe472b3e3cef98f77d3b7739b`. One implementation branch: `feature/beginner-learning-workspace`. One PR: https://github.com/amarjaleelbanbhan/V9T1/pull/16 . Logical commits separate implementation from curriculum/audit/visual evidence. Final-head CI, review state and mergeability must pass before the authorized squash merge. The PR’s checks and merge event are the authoritative final SHA/status record; no force push is used.
