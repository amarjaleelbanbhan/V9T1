# Implementation roadmap

Date: 2026-10-10. Base: `e565635`. Reads with
[ARCHITECTURE_REVIEW.md](./ARCHITECTURE_REVIEW.md) (A1–A9 technical changes),
[INNOVATION_OPPORTUNITIES.md](../research/INNOVATION_OPPORTUNITIES.md) (A1–A9, B1–B8 proposals) and
[EXPERIENCE_EVOLUTION.md](../design/EXPERIENCE_EVOLUTION.md) (V1–V14 design defects).

Every milestone below is decomposed into pull requests sized for one review sitting. **There is no
big-bang PR in this plan.** Effort is given in engineer-days at a pace that includes tests and
review, assuming one developer familiar with the codebase; ranges reflect genuine uncertainty.

---

## Quality gates (apply to every PR)

| Gate | Command / check | Must |
|---|---|---|
| Curriculum | `npm run check:curriculum` | pass |
| Unit | `npm test` | **200+ pass, 0 fail** — the Python/TypeScript differential tests are non-negotiable |
| Types + build | `npm run build` | pass |
| Browser | `npm run test:e2e` | **38+ pass, 0 fail** |
| Bundle | entry chunk must not grow | enforce after M0-4 |
| Accessibility | axe-core: 0 serious/critical | enforce after M1-4 |
| Scope | implementation PRs change ≤ ~400 lines of non-generated source | guidance, not a hard rule |

---

## Milestone 0 — Stabilise and unblock (≈ 7–10 days)

**Goal.** Remove the measured defects that make the product slower, less reliable and less
reviewable than its content deserves. No new capability.

**Definition of done.** First calculation is instant and works offline; every view is addressable;
entry bundle reduced by ≥ 40 %; CI installs reproducibly.

| PR | Scope | Files | Effort | Risk | Rollback |
|---|---|---|---|---|---|
| **M0-1** | CI hygiene: `npm ci`, `cache-dependency-path: package-lock.json`, regenerate the lockfile, bump `@playwright/test` to ≥ 1.55.1 (closes GHSA-7mvr-c777-76hp), add `tests`/`scripts` to `tsconfig.json` | `.github/workflows/ci.yml`, `package.json`, `package-lock.json`, `tsconfig.json` | 0.5 | low | revert |
| **M0-2** | `src/design/tokens.ts` + parity test; replace **92** hex literals across 12 `.tsx` files; fix `index.html` `theme-color`; rename the misleading `green` variable in `NeuronScene.tsx:47` | `src/design/`, `src/visuals/*`, `src/lessons/*`, `index.html` | 1.5–2 | low | revert; purely presentational |
| **M0-3** | **Reduce Python latency without replacing Python.** Warm the shared worker when the course mounts so the runtime downloads while the learner reads; precache the pinned assets; optionally show a clearly labelled `calculate()` *preview* that the Python result overwrites on arrival. Python remains the authoritative source for every displayed number | `src/lessons/BeginnerCourse.tsx`, `src/python/usePythonProgram.ts` | 2–3 | low–med | remove the warm-up and the preview flag |
| **M0-4** | Bundle: `lazy()` `NeuronScene` behind the 2D/3D switch; `eager:false` for the curriculum Markdown glob; deep-import `lucide-react` icons | `src/App.tsx`, `src/lessons/CurriculumLibrary.tsx`, all icon imports | 1 | low | revert |
| **M0-5** | **URL routing.** Lesson/lab/chapter in the path; History API integration; restore on load; derive the nav active state (fixes V12) | `src/App.tsx`, `BeginnerCourse.tsx`, `CurriculumLibrary.tsx`, new `src/router.ts` | 2–3 | med | revert; no data migration involved |
| **M0-6** | Accessibility: `role="img"` + live text alternative on the 3D canvas; fix the `small` contrast rule; heading order; landmark labelling; favicon | `src/visuals/NeuronScene.tsx`, `src/styles.css`, `src/App.tsx`, `public/` | 1 | low | revert |

**Dependencies.** M0-2 → every later visual PR. M0-5 → M2-1, M3-1, M4-3.
**Testing.** M0-3 needs a test asserting the rendered stages equal `calculate()` output for a
sample of lessons, plus an e2e test that the first reveal produces a result with the network
offline. M0-5 needs e2e tests for deep link, reload and browser Back.
**Acceptance.** Time-to-first-number < 100 ms (baseline 5 149 ms); first-reveal CDN bytes = 0
(baseline 11 361 233); entry chunk < 750 kB (baseline 1 260.78 kB); Back returns to the previous
in-app view; `grep -rE '#[0-9a-fA-F]{6}' src --include=*.tsx` returns nothing; axe serious/critical
= 0 on the four main views.

---

## Milestone 1 — Design foundation (≈ 6–8 days)

**Goal.** One coherent interface language, enforced mechanically, in the Instrument direction.

| PR | Scope | Effort | Risk |
|---|---|---|---|
| **M1-1** | Prettier config + one mechanical reformat commit + `.git-blame-ignore-revs`. **Nothing else in this PR** | 0.5 | low (diff is enormous but mechanical) |
| **M1-2** | ESLint flat config with `react-hooks` and `jsx-a11y`; `npm run lint`; add to CI. Fix what it finds or suppress with recorded reasons | 1–1.5 | low |
| **M1-3** | Type scale: collapse 24 `font-size` values to 8; 12 px floor; `max-width:68ch` on prose; tabular figures for live numerals | 1.5 | med — touches most of `styles.css` |
| **M1-4** | Breakpoints: 20 widths → 4 shared custom-media values | 1 | med — regression risk across labs; covered by the existing 390 px e2e tests |
| **M1-5** | Component states: real disabled treatment (V9), selection states, focus consistency | 1 | low |
| **M1-6** | Layout: sidebar CTA hierarchy (V14), move `ChapterReview` out of the lesson into a chapter surface (V10), default 2D below 700 px (V13) | 1–1.5 | low–med |

**Acceptance.** All eight criteria in [EXPERIENCE_EVOLUTION.md](../design/EXPERIENCE_EVOLUTION.md)
§7. Visual review at 390 / 768 / 1440 px against the captured baselines in `docs/assets/`.

---

## Milestone 2 — Core experience (≈ 8–11 days)

**Goal.** Make the learning loop itself better, using evidence from the learning-science review.

| PR | Scope | Effort | Risk |
|---|---|---|---|
| **M2-1** | **Trace redesign.** One representation instead of bar chart + table + sentence (V7/V8); operation-chain rows; "Reveal all operations" alongside stepping | 2–3 | med — it is the most-used surface in the product |
| **M2-2** | **Proportional feedback.** Deterministic diagnostic table (sign error, missing bias, order of magnitude, correct-for-worked-not-transfer); learner's guess plotted against the result | 2–3 | med — must read as observation, not verdict |
| **M2-3** | **Rephrase step.** After a wrong prediction, a short free-text restatement, stored, never auto-graded | 1 | low |
| **M2-4** | **Wire the dead review data.** Worked solutions in `ChapterReview` via `calculate()` using the already-present `model`/`values` | 0.5–1 | very low |
| **M2-5** | **Progress rail.** Surface new / visited / attempted / passed / due directly in navigation | 1–1.5 | low |
| **M2-6** | **Portable evidence.** Export/import JSON with strict validation on import, and explicit language about what it attests | 1–1.5 | low |

**Acceptance.** Every wrong prediction produces a diagnostic that names *what* was wrong, not only
*that* it was wrong; `ChapterReview` shows a worked solution on failure; evidence survives an
export/import round trip and a malformed import is rejected without data loss.
**Measurement.** Record retries-to-correct per lesson before and after M2-2 as the primary signal.
This is not a controlled study and must not be reported as one.

---

## Milestone 3 — Connect the three content systems (≈ 6–8 days)

**Goal.** Stop running three products in one tab.

| PR | Scope | Effort | Risk |
|---|---|---|---|
| **M3-1** | `lab:` link scheme with a strict parameter allowlist, resolved by the existing `onDocument` interceptor; validation reuses the engines' existing range checks | 1.5–2 | low–med — treat link parameters as untrusted input |
| **M3-2** | Author `lab:` links into the chapter documents for the 27 lessons that already declare a `lab`, and add them for the other 33 where one applies | 1.5–2 | low (content work) |
| **M3-3** | Bidirectional: every lab links back to its curriculum document and its beginner lesson | 1 | low |
| **M3-4** | Shareable lab state — serialise the current parameters into the URL | 1 | low |
| **M3-5** | Render the validated prerequisite graph from `catalog.json` on the library page as a navigable structure | 1.5–2 | low; **treat as an experiment** (C8) and remove it if unused |

**Acceptance.** From any chapter document a learner can reach the lab that demonstrates it with the
document's own numbers pre-loaded, and return. No `lab:` URL can push a value outside an engine's
validated domain (property test).

---

## Milestone 4 — Differentiating capabilities (≈ 10–14 days)

**Goal.** Build the things no competitor in the review has.

| PR | Scope | Effort | Risk |
|---|---|---|---|
| **M4-1** | **Divergence as a lesson.** `training.py` returns a truncated history with a `diverged` marker instead of raising; the TypeScript twin matches; the chart renders the climb and names the batch where it broke. Non-finite values are replaced with sentinels before `json.dumps(allow_nan=False)` | 3–4 | med — must not weaken the existing guard, and the differential test must still pass |
| **M4-2** | **Generated practice items** for the 5 most-used calculation models, seeded and reproducible, with property tests for domain validity | 3–4 | med — generation quality; review a sample by hand |
| **M4-3** | Extend generation to the remaining models; replace fixed review items with generated ones; implement expanding spacing intervals in place of the fixed 24 hours | 3–4 | med |
| **M4-4** | Remove the published answers from the curriculum Markdown transfer cases, or replace them with worked *examples* that are not the assessed items | 1 | low — content change, but it is an assessment-integrity fix |

**Dependencies.** M4-4 is only safe after M4-2/M4-3 provide item variety, otherwise the lesson
documents lose a worked example and gain nothing.
**Acceptance.** A diverging run is visible as a chart rather than an error string, and the engines
still agree to 1e-8 on non-diverging runs; a learner practising the same lesson twice receives
different numbers; no generated case throws from `calculate()` across 10 000 seeds.

---

## Milestone 5 — Experimental frontier (timeboxed, 5 days each, prototype only)

Each is a spike behind a flag with a written go/no-go. **None is approved for production.**

| Experiment | Question to answer | Kill criterion |
|---|---|---|
| **M5-1** Branch and compare runs (B1) | Does overlaying two runs that differ in one setting actually change what a learner concludes? | Learners cannot state the difference after using it |
| **M5-2** Rewind and fork (B2) | Is forking from update *k* worth the state-management cost, given NeuroViz already published the within-epoch version? | Requires changes to `training.py` that threaten the differential tests |
| **M5-3** Pre-rendered curriculum (B6) | Do pre-rendered chapter pages get indexed, and does anyone arrive through them? | No measurable traffic after 8 weeks |
| **M5-4** 3D that encodes shape (B8) | Only start once chapter 08+ content exists | No multi-layer content to visualise |
| **M5-5** Editable Python (C2) | Can arbitrary learner code be offered without weakening the correctness claim? | No credible answer to "how do we know this output is right?" |

---

## Sequence summary

```
M0-1 ─┐
M0-2 ─┼─→ M1-1 → M1-2 → M1-3 → M1-4 → M1-5 → M1-6
M0-3 ─┤                    │
M0-4 ─┤                    └─→ M2-1 → M2-2 → M2-3
M0-5 ─┼─→ M3-1 → M3-2 → M3-3 → M3-4        M2-4
M0-6 ─┘        └─→ M3-5 (experiment)        M2-5
                                            M2-6
                                             │
                        M4-2 → M4-3 → M4-4 ──┘
                        M4-1 (independent)
                                             │
                                          M5-x
```

Critical path: **M0-2 → M0-3 → M0-5 → M1-3 → M2-1 → M2-2**. Everything else can be parallelised or
deferred without blocking.

---

## Risk register

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| The Python/TypeScript differential tests are weakened to make a change easier | low | **severe** — it is the product's credibility | Treat `pythonPrograms.test.mjs` as frozen. Any PR touching it requires an explicit justification in the description |
| The M1-1 reformat makes `git blame` unusable | certain | medium | `.git-blame-ignore-revs`, isolated commit, nothing else in that PR |
| M1-3/M1-4 regress a lab layout | medium | medium | The 38-test e2e suite already covers 390 px for most labs; add the missing ones first |
| M4-2 generates degenerate or misleading cases | medium | medium | Curated ranges per model, property tests, manual review of a sample per model |
| Pyodide CDN unavailable | low | low **after M0-3**, high before | M0-3 removes it from the critical path; the "Verify in Python" action degrades to a clear message |
| Scope creep into a rewrite | medium | high | The rejected list in [INNOVATION_OPPORTUNITIES.md](../research/INNOVATION_OPPORTUNITIES.md) §2 Tier D is the standing answer |
| Effort estimates are wrong | high | medium | They are ranges from code inspection, not from measured velocity on this repository. Re-estimate after M0 |

---

## Success criteria for the whole programme

| Dimension | Baseline (2026-10-10, measured) | Target |
|---|---|---|
| Time to first calculated number | 5 149 ms | < 100 ms |
| Network bytes before the first calculation | 11 361 233 | 0 |
| Entry chunk | 1 260.78 kB raw / 351.17 kB gzip | < 600 kB / < 180 kB |
| Hardcoded hex colours in `.tsx` | 92 | 0 |
| Distinct `font-size` values | 24 | ≤ 8 |
| Distinct breakpoints | 20 | ≤ 4 |
| axe serious/critical violations | 6 across 3 views | 0 across 4 views |
| Addressable views | 1 URL | every lesson, lab and chapter |
| Distinct practice items per lesson | 2, with answers published | unbounded, generated, reproducible |
| Unit / e2e tests | 200 / 38 passing | never fewer, never red |
