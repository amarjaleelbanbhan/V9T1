# Quality and release checks

Preserve authored content, mathematical models, local evidence schema, hints, recall provenance, Python authority, checkpoints, backups and the 2D/3D alternatives. A visual change must not reveal an assessment answer early or award false evidence.

## Verification strategy

- `npm run check:curriculum`: catalog, sources, prerequisite graph and authored-topic coverage.
- `npm test`: existing mathematical, Python, scheduling, diagnostic and evidence tests. Confirm test counts; a zero-test run is insufficient.
- `npm run build`: TypeScript and production output. Chunk warnings are observations, not a passing performance budget.
- `npm run test:e2e`: real Chromium interactions and Python execution, including all 60 authored worked/transfer cases. Local cloud checks use an ignored system-Chromium override and the supported authentic pinned asset mirror; CI uses its existing pinned browser/CDN path.
- `tests/workspace-experience.spec.ts`: URL reload/history, mobile focus and Escape, correct/incorrect bias experiments, unchanged course evidence, timeline-aware inspection and chapter-map navigation.
- `scripts/capture-workspaces.mjs`: repeatable desktop/mobile images and overflow inventory, not a substitute for functional tests. Run a development or production-preview server on 4173, then `NEURALLAB_CHROMIUM=/usr/bin/chromium node scripts/capture-workspaces.mjs after`. `CAPTURE_PORT` and `NEURALLAB_EVIDENCE_DIR` can select another instance/artifact directory.

For a stable cloud acceptance run, build first and run `npm run preview -- --host 127.0.0.1 --port 4173 --strictPort` in a persistent terminal, then run Playwright against that existing server with `--grep-invert 'Markdown rejects raw HTML'`. That security test imports Vite source modules: run it separately against the development server with `--grep 'Markdown rejects raw HTML'`. Cold development-module loading was slow in this instance; production preview removes that variability without substituting fake Python execution.

## Accessibility and responsive targets

WCAG 2.2 AA is the target. Check native labels, semantic headings, contrast, keyboard selection, focus visibility/obscuring, drawer containment, status announcements and reduced-motion behavior. Automated axe scans cannot establish full compliance. SVG node selection has equivalent HTML buttons and a textual calculation; labels accompany colors.

Screenshot coverage: all 18 workspaces at 1440×1000 and 390×844. Verify a tablet viewport and representative changed interactions separately. Browser screenshots do not establish low-end physical-device, assistive-technology or every intermediate-width coverage.

## Performance and security

Target real-user LCP ≤2.5 s, INP ≤200 ms, CLS ≤0.1. Do not present local lab timing, cached navigation or build size as proof that these thresholds hold in production. Preserve lazy-loaded lessons and scenes, demand rendering, visibility cleanup and reduced-motion support. Avoid adding fonts, animation frameworks or dependencies without demonstrated need.

Keep TLS and package checksum checks enabled. Python execution is isolated in a worker for responsiveness; editable-source restrictions do not constitute a server security sandbox. Preserve input limits, cancellation, stale-result guards and output bounds. No new credentials, backend, analytics, network service or storage schema is introduced.

## Acceptance and reporting

Every changed behavior needs a functional check. Existing critical journeys must remain usable. Before/after images must identify the baseline commit, viewport and state. Separate passed, failed, skipped and unrun checks. Record actual results in [the delivery report](docs/engineering/WORKSPACE_RENAISSANCE.md); leave full accessibility certification, field metrics and learner-outcome measurements explicitly unmeasured.
