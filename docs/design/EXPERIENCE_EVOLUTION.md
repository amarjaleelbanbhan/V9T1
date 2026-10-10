# Experience evolution — design and interaction plan

> Historical audit: measurements below describe `e565635` unless a later checkpoint is named. For current implementation status and product decisions, read [the reconciliation](../PROJECT_RENAISSANCE_2026.md#current-checkpoint-after-pr-25). Research findings remain sourced proposals, not demonstrated NeuralLab learning outcomes.


Date: 2026-10-10. Evidence: screenshots captured at 1440 × 900 and 390 × 844 against commit
`e565635`, axe-core 4.10.2 scans, and computed-style measurements. Supporting findings in
[ARCHITECTURE_REVIEW.md](../engineering/ARCHITECTURE_REVIEW.md) §6–§7.

Captured evidence:
[desktop neuron lab](../assets/neuron-lab-desktop-2026-10-10.png) ·
[beginner lesson](../assets/beginner-lesson-2026-10-10.png) ·
[mobile 390 px](../assets/neuron-lab-mobile-390-2026-10-10.png)

---

## 1. What the current design gets right

Stated first because most of it should survive.

- **The semantic colour idea is correct and rare.** Inputs blue, weights violet, activations aqua,
  errors coral, gradients gold — a learner who internalises that mapping can read any diagram. Very
  few DL tools commit to a semantic palette at all. **Keep the system; fix the enforcement.**
- **Contrast of the token pairs is good.** Measured in a previous checkpoint: text 14.09:1, muted
  8.25:1, blue 5.01:1, violet 5.80:1, aqua 8.70:1, coral 7.15:1, gold 10.15:1 against the panel.
- **Reduced motion is respected globally**, and playback auto-pauses when the preference is set
  (`App.tsx:64`).
- **The mobile layout actually works.** Measured **0 px horizontal overflow at 390 px**; the
  workbench reflows to one column and sliders go two-up.
- **Every asynchronous surface has `role="status"`.** Consistently applied across every lab.
- **The hero treatment is good.** "Inside a Neuron." with the accent period, the tight negative
  tracking, the eyebrow crumb and the LIVE SIMULATION chip read as a designed product.
- **The results row** (big output number, activation curve, Math/Code/Challenge tabs) is the
  strongest composition in the application and is the pattern to extend.

## 2. What is actually wrong

Each item is measured, not asserted.

| # | Problem | Measurement |
|---|---|---|
| V1 | **The design system stops at the CSS boundary.** Charts and 3D invent their own colour | 3 hardcoded hex values in `styles.css`; **92 distinct hex values across 12 `.tsx` files**. Many belong to an abandoned green palette |
| V2 | **The 3D canvas is visibly a different product.** Background `#092328` (teal) inside a `#0B1020` (navy) UI | `NeuronScene.tsx:72`; `index.html:6` still declares `theme-color="#092328"` |
| V3 | **There is no type scale.** | **24 distinct `font-size` values**; 94 of ~140 declarations ≤ 13 px, including one 7 px and one 8 px. On the neuron lab, **14 rendered nodes at 7.5 px, 5 at 9 px, 51 at 10 px** |
| V4 | **Line length far exceeds readable range.** | Beginner-course paragraphs render at an estimated **171 / 155 / 142 / 133 / 133 characters per line** at 1440 px, against a 45–75 target |
| V5 | **No shared breakpoint system.** | **29 media queries at 20 distinct widths**, declared per component |
| V6 | **The largest element on screen carries the least information.** The 3D scene occupies ~800 × 460 px to show six spheres and four short labels; the 2D SVG fallback in the same slot conveys more | see §4 |
| V7 | **The computation trace says the same thing three times.** Bar chart, then a stage table, then the result sentence — identical four rows | `BeginnerCourse.tsx:12,15`; visible in the captured lesson screenshot |
| V8 | **Bars are the wrong encoding for a computation trace.** "Read x = 2", "Multiply by factor = 6", "Add offset = 7", "Result = 7" are rendered as comparable magnitudes; they are a value, an intermediate, and a result | `TraceVisual`, `BeginnerCourse.tsx:12` |
| V9 | **Disabled controls are nearly invisible.** `opacity:.45` on an already low-contrast button; the primary "Check practice" action is hard to see in its disabled state | `styles.css` `button:disabled` |
| V10 | **Every lesson ends with an unrelated chapter-review form.** `<ChapterReview/>` is rendered at the bottom of all 60 lessons, with its own independent chapter selector | `BeginnerCourse.tsx:40` |
| V11 | **Six accessibility violations**, including `aria-prohibited-attr` on the 3D wrapper, which leaves the signature visual with no accessible name | axe-core 4.10.2; detail in ARCHITECTURE_REVIEW §7 |
| V12 | **The primary nav is permanently "active".** `className="active"` is hardcoded on the Learn link regardless of the current view | `App.tsx:68` |
| V13 | **3D is the default on mobile.** At 390 px the canvas is ~240 px tall and sprite labels render at roughly 5 px — unreadable | `App.tsx:58`; visible in the mobile screenshot |
| V14 | **Four full-width primary buttons** stack in the sidebar, outweighing the 17-item lesson list they sit beneath | `App.tsx:80` |

---

## 3. Three design directions

Each is evaluated against explicit criteria. These are directions for the *interface*; the
data-visualisation semantics (§3.4) are shared by all three and are not negotiable.

### Direction 1 — "Instrument"

Scientific instrumentation: an oscilloscope or a wind-tunnel console. The interface is a dark,
precise chassis; all colour belongs to the data.

| | |
|---|---|
| Personality | Calm, exact, slightly austere. The product is a measuring device |
| Colour | Chassis strictly neutral (background / surface / panel / line / text / muted). The five semantic hues appear **only** inside data marks and their legends. Nothing decorative is coloured |
| Typography | One scale: 12 / 14 / 16 / 20 / 28 / 40. A tabular-figures face for all numbers so digits do not jitter as values change — this matters in a product whose numbers update live |
| Layout | Strong 8 px grid, generous whitespace, content column capped at ~72ch |
| Components | Flat panels, 1 px borders, almost no shadow. Controls look like controls |
| Motion | Only value transitions and step changes. Nothing enters or exits decoratively |
| Visualisation | 2D-first. 3D only where the third axis encodes a real dimension |
| Accessibility | Easy: fewer colours, larger type, high contrast by construction |
| References | TensorBoard's density discipline; Observable's chart restraint; aircraft primary flight displays |
| Trade-offs | Risks feeling cold; weak at inviting a nervous beginner in |

### Direction 2 — "Blueprint"

A working drawing: the network as an annotated technical diagram the learner marks up.

| | |
|---|---|
| Personality | Studious, tactile, like a worked example in a good textbook |
| Colour | Light-first with a dark counterpart. Paper surface, ink-blue rules, semantic hues as annotation colours |
| Typography | A text face for prose at 16–18 px with a 68ch measure, a mono face for code and numbers |
| Layout | Two columns: diagram and margin notes, like an annotated figure |
| Components | Visible construction lines; callouts and leader lines as primary UI |
| Motion | Drawing-in: lines are *constructed*, not faded in. Reduced-motion renders the final state |
| Visualisation | Heavily 2D. 3D is an inset, never the main stage |
| Accessibility | Best of the three for text; a light theme suits print, projection and classroom beamers |
| References | Edward Tufte's annotated figures; Bartosz Ciechanowski's explorables; engineering drawings |
| Trade-offs | A light theme is a large rewrite of 41 kB of dark-themed CSS. Less "live instrument", more "page" — which fights the live-recalculation feel that already works |

### Direction 3 — "Signal"

High-energy and cinematic: glow, depth, motion, the network as a living system.

| | |
|---|---|
| Personality | Exciting, demo-friendly, screenshot-friendly |
| Colour | Saturated accents on near-black, bloom and emissive materials |
| Typography | Large display type, tight tracking, heavy weights |
| Motion | Pulses travelling along connections, camera moves, particles |
| Visualisation | 3D-first |
| Accessibility | Hardest: glow destroys contrast, motion must be duplicated for reduced-motion, GPU cost rises |
| References | The indie 3D trainers in [COMPETITIVE_LANDSCAPE.md](../research/COMPETITIVE_LANDSCAPE.md) §2.2 |
| Trade-offs | This is the direction the current `NeuronScene` was reaching for and did not land. It is also the direction where the market is most crowded and most commoditised, and where a solo-maintained project is least able to compete on craft |

### Recommendation: **Direction 1 — Instrument**, with two elements borrowed from Blueprint

Criteria, weighted by what this product is for:

| Criterion | Weight | Instrument | Blueprint | Signal |
|---|---|---|---|---|
| Serves "make the invisible computation legible" | ×3 | 5 | 4 | 2 |
| Accessibility ceiling | ×2 | 5 | 5 | 2 |
| Distance from current CSS (lower cost) | ×2 | 5 | 2 | 3 |
| Differentiates against the reviewed field | ×2 | 4 | 4 | 1 |
| Sustainable by a small team | ×2 | 5 | 4 | 2 |
| Welcoming to a nervous beginner | ×1 | 3 | 5 | 4 |
| **Weighted total** | | **57** | **46** | **26** |

Instrument wins on three grounds that matter more than taste:

1. It is **mostly already built.** The existing dark navy chassis, panel system and semantic tokens
   are Instrument. Adopting it is enforcement and cleanup, not a redesign — which is the right
   amount of change for a project whose content is its real asset.
2. It is the direction where **the product's honesty reads as a design value** rather than a
   limitation. An instrument that says "this measures practice, not mastery" is coherent; a
   cinematic experience that says the same thing is not.
3. Signal is where the hobby 3D trainers already are, and competing there means competing on
   production values with no budget.

**Borrowed from Blueprint:** (a) the annotated-margin pattern for lesson prose, which solves V4
directly; (b) a light theme as a second token set — deferred, but worth keeping the token
architecture ready for it, because classroom projection is a real use case for this content.

### 3.4 Data-visualisation semantics (direction-independent)

Two colour systems, never mixed:

- **Interface palette** — background, surface, panel, line, text, muted. Neutral only.
- **Semantic data palette** — input (blue), weight (violet), activation (aqua), error (coral),
  gradient (gold). Each hue means exactly one thing, in every chart, every diagram, and in 3D.

Rules:

1. Every semantic colour needs a non-colour redundancy: a label, a shape, a position, or a pattern.
   The existing diagrams mostly do this already — keep it.
2. The interface never uses a semantic hue for decoration. The current gold focus ring is the one
   deliberate exception and should stay, because focus visibility outranks purity.
3. Diverging quantities (gradients, residuals) use a single diverging ramp anchored at zero —
   currently `TraceVisual` uses `#fca5a5` for negative and `#93c5fd` for positive, which are neither
   tokens nor a ramp.
4. Sequential magnitudes use one ramp per semantic role, not a rainbow.

**Enforcement is the whole point.** Ship `src/design/tokens.ts` with a unit test asserting parity
against `tokens.css`, then replace all 92 literals. Without the enforcement mechanism this section
will be undone within three pull requests — the project has already migrated its palette once and
the old colours are still in the code.

---

## 4. 2D and 3D: what to do with the graphics

### Diagnosis

The 3D scene is not bad because it is 3D. Taking the failure modes in turn:

| Candidate cause | Verdict |
|---|---|
| Geometry | **Not the problem.** Spheres and cylinders are the right primitives for this diagram |
| Renderer | **Not the problem.** Three.js is fine; the scene is 77 lines and renders correctly |
| **Composition** | **Primary cause.** Six objects in an ~800 × 460 px canvas, occupying maybe 15 % of it. The empty volume communicates nothing |
| **Camera** | **Primary cause.** Fixed at distance 11.5, fov 44, with `OrbitControls` the only motion. The camera never frames anything — it shows one wide shot forever |
| **Colour** | **Primary cause.** Teal background inside a navy app; ten literals; a variable named `green` holding the blue input token (`NeuronScene.tsx:47`) |
| Lighting / materials | Contributing. Ambient 1.6 plus two point lights flattens everything; `emissiveIntensity .18` on the spheres leaves them matte and unlit-looking |
| **Information density** | **Primary cause.** The 2D SVG in the same slot shows bias, the Σ node, the activation box, running values *and* per-edge contributions. The 3D view shows strictly less |
| Text integration | Contributing. Sprite labels do not scale with viewport; at 390 px they are ~5 px tall |
| Accessibility | Contributing. `aria-label` on a role-less `<div>` is ignored (axe `aria-prohibited-attr`) |

**Conclusion: do not remove 3D, and do not invest in it yet.** A single neuron with three inputs is
a 2D object; no third dimension exists to encode. The llm-viz benchmark earns 3D because tensor
*shape* is genuinely three-dimensional and the geometry *is* the explanation. NeuralLab will have
that situation when it has multi-layer networks and tensors worth seeing — which is chapters 08+,
currently specification only.

### Policy

| Situation | Representation |
|---|---|
| Scalar arithmetic, a single neuron, one chain of operations | **2D SVG.** Clearer, accessible, zero bundle cost |
| A function and a point on it (activation curves, loss curves) | **2D SVG with real axes.** Current plots lack tick values and gridlines |
| Matrices, broadcasting, slicing | **2D grid** with cell highlighting — the existing `cells` output already supports this |
| Multi-layer networks where layer width and depth are the lesson | **3D**, and only here |
| Tensor shape / memory layout (chapters 03, 08+) | **3D**, strongest case in the product |
| A process over time (training) | **2D chart + a scrubber.** Not animation. The learner must be able to stop on any step |

### Immediate 3D work (small, within Milestone 1)

1. Background from the token, not `#092328`; all ten literals from `tokens.ts`; rename `green`.
2. `role="img"` on the wrapper plus a live text alternative naming the current step and values.
3. Frame the content: move the camera in, or move the geometry apart, so the subject fills the
   canvas. One-line change, largest visible improvement available.
4. Default to 2D below the `max-width:700px` breakpoint; keep the toggle.
5. `lazy()` the scene so 2D users never download Three.js (~900 kB of first paint).

### Deferred 3D work (Milestone 5, only if chapters 08+ are authored)

Geometry that encodes shape; a camera that *moves between* an overview and a single-weight close-up
as the learner changes focus — the CNN Explainer elastic-zoom mechanic, which is the one interaction
from the reviewed field most worth adopting.

---

## 5. Reading, markdown and notation

`MarkdownDocument` is 5 lines and correct for what it does: `remark-gfm`, `skipHtml`, relative link
interception. Verified in the browser: headings, lists, emphasis, tables and links all render.

Gaps, in priority order:

1. **Measure.** 171 characters per line is the dominant readability problem, and it is one CSS rule
   (`max-width: 68ch` on the prose container) plus the Blueprint margin-note pattern for asides.
2. **Code highlighting.** 12 chapter documents contain fenced code that renders unstyled. A `code`
   component override with a small highlighter; no change to the parser.
3. **Mathematical notation.** The curriculum currently uses Unicode plain text — `d(x²)/dx = 2x`,
   `z = w × x + b`. This is *adequate and arguably preferable* for chapters 00–07, where the whole
   point is that the arithmetic is concrete. It will not survive attention, matrix calculus or
   normalisation layers. Add `remark-math` + KaTeX (≈60 kB gzipped) **when chapter 08+ content is
   written**, not before. Do not retrofit LaTeX onto the beginner chapters: it would make them
   harder, not better.
4. **Diagrams in documents.** Mermaid is tempting and should be resisted for now — it is a large
   dependency for content that does not yet exist.

---

## 6. Interaction and motion

### Motion principles

Every animation must answer "what did the learner learn from that?" Otherwise it is cost.

| Motion | Purpose | Reduced-motion fallback |
|---|---|---|
| Value transition on a number or bar | Shows *direction and size* of change — the core teaching signal | Instant set; keep the before/after labels |
| Step advance on the computation timeline | Shows causal order | Instant; the step indicator still updates |
| Focus / selection | Locates the user | Static ring (already implemented) |
| Panel enter/exit, decorative fades, particles, bloom | None | Remove entirely |

The existing global `prefers-reduced-motion` block is correct. Keep it; do not add motion that
depends on being animated to be understood.

### Interaction fixes, by cost

**Cheap and high value**

- V7/V8: replace the duplicated bar chart + table with **one** trace representation — a vertical
  operation chain where each row shows the operation, its inputs, and its result, with the newly
  revealed row highlighted. The signed-magnitude bar can stay as a *secondary* encoding inside the
  row, not as the primary one.
- V9: give disabled controls a real disabled treatment (reduced saturation + a visible border)
  instead of a flat opacity multiplier.
- V12: derive the nav active state from the current view.
- V10: move `ChapterReview` out of the lesson into its own chapter-level surface, reached from the
  chapter heading.
- V14: make the sidebar CTAs one primary ("Start beginner course") and three text links.
- Reduce the required "Next operation" clicks — currently **3 clicks** to reach the result on the
  simplest lesson — by offering "Reveal all operations" alongside stepping. Keep stepping as the
  default: the stepping *is* the pedagogy, but it must not feel like a toll.

**Medium**

- A persistent **lesson progress rail** showing the four states the product already distinguishes —
  new / visited / attempted / passed — plus "due for review". The data exists in
  `progress.ts`; nothing surfaces it except a text line.
- **Prediction feedback** (the single highest-value learning change; see
  [INNOVATION_OPPORTUNITIES.md](../research/INNOVATION_OPPORTUNITIES.md) A4): show the learner's
  guess against the result on the same axis, annotated with the diagnostic category.
- **Direct manipulation of the value being explained.** In the neuron lab the sliders are in a
  separate column from the diagram. Dragging a weight *on the diagram* and watching the edge and
  downstream values change is the interaction that distinguishes an explorable from a form.

**Deferred**

- Comparison overlays, branching, and the 3D camera path. All depend on the above.

---

## 7. Design acceptance criteria

A change in this plan is done when:

1. `grep -rE '#[0-9a-fA-F]{6}' src --include=*.tsx` returns **0** results, and a unit test fails if
   `tokens.ts` and `tokens.css` disagree.
2. `font-size` declarations in `src/styles.css` resolve to a scale of at most **8** values, with a
   minimum of **12 px** for any text conveying meaning.
3. Prose containers are capped at **68ch**; no rendered paragraph exceeds ~90 characters per line at
   any viewport.
4. Media queries use at most **4** shared breakpoints, declared once as custom media or documented
   constants.
5. axe-core reports **0 serious or critical violations** on the neuron lab, beginner course,
   curriculum library and training project, at 1440 px and 390 px.
6. The 3D canvas has `role="img"` and a text alternative that names the current step and values, and
   is not downloaded by a learner who never opens it.
7. Horizontal overflow remains **0 px** at 390 px (current state — must not regress).
8. Every animation has a reduced-motion path that preserves the information, verified by running the
   suite with the preference forced.

