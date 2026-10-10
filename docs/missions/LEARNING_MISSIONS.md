# Learning missions, hint ladder and diagnostics — design contract

Date: 2026-10-10. Reviewed base: `0ae811c` (after PR #25). Hints and diagnostics exist; the mission catalogue below is proposed, not shipped.
Target experience: roughly **90 % of learning time spent acting on real mathematical state**, 10 %
on concise supporting text.

This is the contract the implementation PRs and the teammate issues both refer to. It describes
behaviour and data shapes, not UI copy.

---

## 1. The learning cycle

Every mission moves the learner through the same seven beats. A mission that skips a beat should
say which one and why.

| Beat | What the learner does | What the system must supply |
|---|---|---|
| **Observe** | Looks at real state: values, shapes, a trace, a scene | Values produced by the authored Python program, never invented in the browser |
| **Predict** | Commits to an answer *before* any reveal | A locked prediction control; no reveal path that bypasses it |
| **Manipulate** | Changes one thing and sees the consequence | The change must recompute through the same engine, not a mock |
| **Solve** | Reaches the objective | A success criterion stated in advance |
| **Explain** | States the rule that made it work | Free text, stored, never auto-graded |
| **Transfer** | Solves a fresh instance without hints | A different instance of the same idea |
| **Revisit** | Returns later | FSRS scheduling already exists in `src/course/learning.ts` |

## 2. Evidence model — four distinct states

The product must never collapse these. `src/course/progress.ts` records per-case hint evidence and `independentAt`; due-review provenance lives in `learning.history`.

| State | Definition | Stored as |
|---|---|---|
| **Completed** | The learner visited or attempted the activity; this does not establish success | `visited` / `attempts` |
| **Assisted success** | Practice criteria met using hint level ≥ 1 | `passedAt` with `hints > 0` |
| **Independent success** | Correct on both the worked and transfer case with **hint level 0** | `independentAt` |
| **Retained understanding** | Independent success plus the latest later due FSRS review self-rated Hard, Good or Easy (Again does not count) | derived from `independentAt` + due-review events in `learning.history` |

Finishing the site is not mastery, and nothing in the interface may imply it. Independent success is
the strongest claim the product may make without learner research.

## 3. Hint ladder

Four levels, strictly ordered, each requested explicitly. The highest level reached is recorded
against the attempt and suppresses independent-success evidence.

| Level | Name | Source | Needs Python |
|---|---|---|---|
| 1 | **Attention** | Directs attention to a quantity or dependency without stating the rule or an answer | no |
| 2 | **Rule** | The lesson formula with its symbols defined, plus why it applies | no |
| 3 | **One step** | The *first* operation of the Python trace, with its computed value — and nothing after it | yes |
| 4 | **Worked solution** | Every operation and the result | yes |

Levels 3 and 4 execute the same authored Python program the lesson already runs. Level 3 must not
reveal later stages, completed grids or full curves; the prediction stays editable after level 3. Level 4 requires a finite non-empty prediction and locks it. The latest recall is a self-rating, not a graded retention or mastery measure; legacy histories without due provenance cannot establish it.

## 4. Diagnostic feedback

When a prediction is wrong, the learner is told **what is observably different about their number**,
derived from the Python-returned `Calculation`. Rules are deterministic and unit tested; no model,
no network, no cost.

Required ordering (first confident match wins):

| # | Category | Condition | Form of the observation |
|---|---|---|---|
| 1 | `match` | within `closeAnswer` tolerance | correct |
| 2 | `sign` | magnitude matches, sign is reversed | "The magnitude matches; the sign is reversed." |
| 3 | `intermediate` | equals a non-final numeric stage | "Your answer equals the value after *&lt;stage&gt;*. N later operations were not applied." |
| 4 | `pack` | guarded chapter-specific slip, after structural checks | observation about the number, with `certain: false` unless justified |
| 5 | `offset` | result − guess equals a named input or stage value | "Your answer differs from the result by exactly X, which is *&lt;name&gt;*." |
| 6 | `factor` | result ÷ guess equals a named input or stage value | "Your answer is smaller than the result by a factor of *&lt;name&gt;* = k." |
| 7 | `reciprocal` | guess ≈ 1 / result | "Your answer is the reciprocal of the result." |
| 8 | `magnitude` | same sign, ratio ≥ 10 or ≤ 0.1 | order-of-magnitude observation |
| 9 | `near` | within 5 % | "Very close — check rounding and the number of operations applied." |
| 10 | `unmatched` | none of the above | states the gap and points at the trace |

**Phrasing rule.** Every message is an observation about *the number*. None may be a conclusion
about the learner ("you don't understand the chain rule" is forbidden; "your answer equals the value
before the bias was added" is correct). Generic categories 5–9 are heuristics and must carry a
`certain: false` flag so the interface can hedge them.

## 5. Mission catalogue for chapters 00–07

Each proposed mission uses existing mathematical state. The table names reference models; implementations must execute the corresponding authored Python program before displaying assessed numerical results. Pure TypeScript engines remain differential-test references, not replacements for Python.

| Mission | Chapter | Mechanic | Engine |
|---|---|---|---|
| Reach the target output | 02 | Adjust one weight until the neuron output is within tolerance of a target | `engine/neuron` |
| Build the dot product | 03 | Select matrix cells in the order that forms a named output element | `engine/tensor` |
| Trace the forward path | 04 | Choose which activations feed the next layer, in order | `engine/forward` |
| Predict the gradient sign | 05/06 | Commit to +/−/0 before the value is shown | `engine/lossGradient`, `engine/backprop` |
| Order the chain rule | 06 | Arrange local derivative factors into the correct product | `engine/backprop` |
| Repair the broken update | 06/07 | A deliberately wrong update (missing bias, wrong sign, stale activation); find and fix it | `engine/backprop` |
| Compare two learning rates | 05 | Run both, explain the trajectories | `engine/lossGradient` |
| Make it diverge, then repair it | 07 | Drive the capstone to divergence, inspect where it broke, fix it | `python/training.py` |
| Spot the leakage | 01/07 | Choose a valid evaluation decision among plausible invalid ones | `engine/beginner` |
| Fresh transfer | all | A seeded, generated instance with no hints available | `engine/beginner` |

## 6. Progression rules

- One new difficulty per mission; never two.
- Scaffolding is removed across a chapter: hints available → hints cost evidence → no hints.
- A chapter ends with a mixed checkpoint drawing on at least three of its missions.
- Later missions unlock on **stated** criteria (e.g. "independent success on dl-06-003"), always
  visible, never hidden.
- Every earlier mission stays replayable, and optional exploration is never gated.
- Points or badges, if added, attach to a demonstrated action and never to time spent or clicks.

## 7. Interaction requirements

- Every drag has a keyboard equivalent (arrow keys + Enter) and a tap equivalent.
- Exact numbers are always available next to any visual encoding.
- Selecting any element states what it represents, where its value came from, and what changes
  downstream.
- Motion: pause, rewind, replay and speed, via the existing `StagePlayer`; stops when hidden or
  offscreen; reduced-motion preserves all information.

## 8. Out of scope for this cycle

Intermediate/advanced chapters, any paid API, any backend, model-generated feedback, and any claim
of mastery beyond independent success.

