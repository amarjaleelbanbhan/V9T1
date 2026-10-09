# NeuralLab implementation checkpoint

## Baseline

2026-10-09: Private repository `amarjaleelbanbhan/V9T1`, feature branch `feat/neurallab-foundation`. Baseline was only `README.md` (`# V9T1`). There was no existing app architecture to preserve. The user-approved React/Three.js architecture and emerald/teal visual identity are implemented in the new app.

## Accepted development chunks

**Progress: 1 / 6 planned foundation chunks accepted.**

1. **Accepted — Application foundation + live neuron lab.** React 19 + Vite + TypeScript, Zustand state, pure neuron engine, WebGL 3D renderer with native texture-sprite labels, SVG 2D view, step timeline, controls, math/code/challenge inspector, activation graph, mobile navigation.
2. Pending — Guided foundations (Week 1) lesson and student learning objectives.
3. Pending — Dedicated activation functions explorer (Week 4) with comparisons.
4. Pending — Multi-layer forward propagation (Weeks 3–4) with inspectable connections.
5. Pending — Backpropagation, loss and optimizer labs (Weeks 3–7).
6. Pending — CNN operations (Week 8), including stride/padding/kernel experiments.

The rest of the curriculum remains explicitly **planned**, not implemented.

## Verified tests — 2026-10-09

- Node mathematical unit tests: **7/7 passed** (independent weighted sum, negative/zero cases, activation boundaries, invalid dimensions, overflow, timeline, formatting).
- GitHub Actions installs packages and runs the TypeScript production build: **passed**.
- Playwright Chromium: **2/2 browser tests passed**, including editable parameter computation, activation switching, selected timeline stages, 3D-to-2D switching, math/code/challenge operation, reset, no page errors, and viewport 390×844 with no horizontal overflow.
- Successful GitHub Actions run: https://github.com/amarjaleelbanbhan/V9T1/actions/runs/37942043766
- Manual screenshot-by-screenshot visual inspection on multiple physical devices: **not performed**. Browser checks are automated, not a substitute for manual visual and accessibility evaluation.

## Defects discovered and corrected

- TypeScript unused import in App blocked build; corrected and rerun.
- Playwright test accidentally matched activation dropdown and plot; made role-specific.
- 3D labels implemented with DOM Html overlays caused a runtime `removeChild` error on 3D-to-2D unmount; replaced with Three.js CanvasTexture sprites. Browser test now passes with zero page errors.

## Architectural decisions

- No backend yet; local browser computation, no fake Python/TensorFlow execution.
- Engine is independent of React/rendering and all views derive from its trace.
- SVG fallback for WebGL-unavailable browsers.
- Preserve dark teal design tokens: `#092328`, `#12544F`, `#2A835F`, `#8BBB92`.
- Do not show unavailable curriculum lessons as working pages.
- Keep tests attached to every incremental milestone.

## Next executable task

Implement a small, conceptually grounded **Week 1 visual foundations lesson** (AI vs ML vs Deep Learning) in the existing lesson framework. Add interactive actions and comprehension checks. Verify math, navigation, mobile view, and accessibility before proceeding to the next milestone.
