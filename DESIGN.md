# Scientific fieldbook design

The visual identity retains deep teal, slate-blue inputs, teal weights/activations, pale gradients and coral errors. A quiet frame surrounds expressive computations. Shared styles apply to all 18 workspaces; this is an incremental evolution of the application, not a theme or framework replacement.

## Foundations

[`palette.ts`](src/design/palette.ts) owns the shared colors, installs CSS variables before React mounts, and supplies SVG/WebGL primitives. `tokens.css` holds spacing and legacy aliases. [`workspace.css`](src/design/workspace.css) supplies the new shared composition and semantic surface roles, loaded after existing feature styles. Some historical lesson-specific SVG colors remain; further consolidation should be measured and incremental.

System sans-serif handles instructions and controls. A system serif distinguishes lesson titles and chapter maps; a system monospace handles changing numbers. No remote fonts or new runtime dependencies are required. Titles are 32–47 px, instructions generally 14 px, supporting copy 12–13 px. Small sidebar metadata remains 10–11 px; this is a documented compromise for navigation density, not a claim that every text size was fixed.

Use a 4/8 px spacing foundation, 20–28 px between functional regions, 5–8 px control/surface radii. Borders separate work rather than wrapping every paragraph in a rounded card. Nested interactive panels retain visible containment. Explanations use bounded line length; diagrams may use the full workspace.

## Component and interaction rules

- Navigation: an introductory entry, experiment labs, workshops, curriculum, and collapsed planned topics. The desktop rail scrolls within the viewport. The mobile drawer has an accessible name, focus trap, Escape dismissal, focus restoration and a backdrop.
- Experiment: objective → editable mathematical state → inspectable result. The new bias challenge records a test against the existing engine, labels its sandbox status, rejects altered fixed settings and offers restoration.
- Diagram: adjacent HTML buttons select mathematical nodes. The SVG and text inspector share the model; unreached stages remain unrevealed. Numbers and text convey meaning alongside color.
- Progress: chapter stations expand to real authored topics. Display assisted, unaided and later recall labels separately. Do not relabel these as mastery or fabricate a percentage score.
- Async results: preserve existing loading, cancellation and error status. Parameters changing must invalidate applicable outputs; native disabled states remain visible.

## Responsive, motion and accessibility

Shell thresholds are 1180, 900, 700 and 440 px. Existing feature breakpoints are retained. At 900 px the rail becomes a drawer; below 700 px the workbench and chapter-topic list stack. Touch controls have visible boundaries; focus has a contrasting 2 px outline. Scroll margins account for the sticky header. Treat WCAG 2.2 AA as the target, not certified conformance.

Transitions are 140–220 ms and explain interaction state only. Reduced motion disables transitions and preserves manual calculation stepping. The neuron workspace starts in 2D: its graph has no third mathematical dimension, and the keyboard node inspector is immediately available. 3D remains an explicit option. Existing 3D demand rendering, visibility gating, camera controls and 2D fallback remain. Do not add perpetual background animation or make 3D mandatory for a flat computation.

Avoid decorative glows, gradient cards for every section, repeating feature grids, accidental color meanings and animations that suggest an uncomputed result. Screenshot and accessibility evidence is recorded separately from these rules.
