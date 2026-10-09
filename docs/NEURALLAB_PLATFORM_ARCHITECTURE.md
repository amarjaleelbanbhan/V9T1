# NeuralLab platform architecture — first expansion checkpoint

## Verified audit, 2026-10-09

- Repository main: `f8e3d02eee9d50b35050fb911cfb5bdf08568b9f`; PRs 1–6 merged. Nine interactive labs exist, with pure TypeScript computation engines and numerical tests. No AGENTS.md or CONTRIBUTING file appeared in the recursive repository inventory.
- Production Vercel project: `neurallab`, `prj_3ZWDAia7CiSVZSBNUhLfk6Fi9SuK`, Vite. Deployment `dpl_5KJNza2ZcB3eSrS8iYsc3nAtDYZ5` reports READY, production alias neurallab-tau.vercel.app, exact main commit above.
- Main includes a bottom `footnote` with curriculum text, not a newsletter/subscription form. Removed that unwanted bottom section and its unused icon. Main sidebar curriculum remains.
- Existing engines cover narrow teaching examples: scalar neuron, activation functions, dense forward pass, perceptron gates, tensor slicing, loss descent, dense backpropagation and scalar depth gradient chains. They do not establish full-course mastery or production model training.
- Existing Playwright tests cover desktop interactions and selected mobile flows. No lint script exists; TypeScript/build are the static checks. No broad accessibility certification exists.

## Design decisions

Reference sources: Radix color usage https://www.radix-ui.com/colors/docs/overview/usage and Material role guidance https://m3.material.io/styles/color/the-color-system. Radix page retrieved; Material's full page is JS-dependent, so its detailed content was not fully inspected. These references motivate roles rather than decorative color changes.

`src/design/tokens.css` defines background #0B1020, surface #121B30, panel #18223B; input/interaction #638BFF; weight #A78BFA; activation/result #37D6C4; error #FF9078; gradient/highlight #F5C978. Legacy aliases remain for compatibility. Existing green CSS was migrated to semantic roles. The neuron diagram and parameter sliders distinguish input, weight and bias; all labels still carry meaning without color. Some legacy diagram-specific colors remain and need migration before declaring the entire design system complete.

Measured sRGB contrast against the elevated panel: text 14.09:1, muted 8.25:1, blue 5.01:1, violet 5.80:1, aqua 8.70:1, coral 7.15:1, gold 10.15:1. These token-pair checks exceed 4.5:1 for normal text; they do not prove every composite, disabled control or 3D surface meets WCAG. Dark labels on bright primary buttons use the background token. Focus uses gold with a 3px outline. Reduced-motion CSS disables nonessential transitions and animations. Skip link added. Main breakpoints retained and library cards reflow down to 390px.

## Content architecture

`curriculum/deep-learning/catalog.json` is canonical. Stable source, chapter and lesson IDs link prerequisites, reference URLs and specification status. The validation command checks unique IDs, links, chapter documents and cycles. The library browser loads searchable catalog data and chapter text via a separately loaded Vite chunk; no replacement curriculum or mathematical engines were introduced. Chapter specifications are displayed as text, not treated as completed lessons. A rich semantic Markdown renderer is follow-up work.

## Visual architecture

Existing pure engines remain authoritative. React diagrams consume computed traces. Shared specification is in curriculum/deep-learning/visualizations/README.md: input → prediction → computation step → observed state → explanation → challenge. A new teaching renderer must not invent results or silently duplicate existing engines. Use SVG/DOM for small algebra and tensor views. Keep 3D optional where space helps. The existing main bundle remains large; lazy-loading the catalog avoids adding its whole payload to initial startup but does not solve existing Three.js cost.

## Python execution architecture

`public/python-worker.js` uses pinned Pyodide 0.27.7 and actual NumPy. The user supplies only six bounded numbers. The trusted Python source is fixed and traces executed lines through sys.settrace. Events occur before a line, so the snapshot describes the preceding statements; a separate complete frame shows final state. Values, rank, shape, float32 dtype, measured array nbytes and stdout are captured from Python, not fabricated in TypeScript.

Workers are disposed after response, cancellation, timeout and component unmount. A 90-second timeout includes first-load package download. The worker is responsive isolation, not a general security sandbox; no arbitrary user Python, remote server or model.fit training is offered. Trace mode `executed-python` must never be used for existing TypeScript simulations. This prototype needs network access for Pyodide/NumPy; offline caching, cold-load memory profiling, pandas traces and full training instrumentation remain future work.

## Assessments and progression

Each chapter contains an original solved question, numerical transfer prompt, debugging challenge and mini-project. Machine-readable scored question banks and persisted progress are not implemented. The proposed rule requires critical safety/leakage items, mixed-item performance and a delayed transfer check. This is a product hypothesis requiring learner validation. Spaced practice is specified separately from completion; clicks and visits do not imply mastery.

## Acceptance and remaining review

Preserve all nine labs, validate actual numbers, verify keyboard and touch controls, inspect 390px and desktop screenshots, check runtime errors, and run catalog/unit/browser/build checks before review. Physical-device, screen-reader, GPU and full WCAG audits remain outstanding. Preview protection must be inspected separately from production READY state. No production promotion is part of this checkpoint.
