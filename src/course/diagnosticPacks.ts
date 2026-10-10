import type { Calculation } from "./types.ts";
import type { Quantity } from "./diagnostics.ts";

/**
 * Chapter-specific wrong-answer rules, consulted after the exact structural
 * checks (match / sign / intermediate) and before the generic arithmetic
 * heuristics. A pack exists to name a *known* conceptual slip for one
 * calculation model, which the generic rules can only describe arithmetically.
 *
 * Rules for authoring:
 *  - Key the pack by the lesson's `model`, not by its id, so every lesson using
 *    that calculation benefits.
 *  - `match` returns an observation string, or null when the rule does not fire.
 *    Returning null must be the common case; a pack that always fires is a bug.
 *  - Observations describe the number. Never the learner. "Your answer equals
 *    the activation value rather than its derivative" is right;
 *    "you confused activations with derivatives" is not.
 *  - Set `certain: false` unless the arithmetic can only have one explanation.
 *  - Every rule needs a test in src/engine/diagnostics.test.mjs proving it fires
 *    on the slip it targets and stays silent on a correct answer.
 *  - Do not re-describe a value that already appears as a stage in the trace.
 *    The generic `intermediate` rule names those exactly and with certainty,
 *    and runs first. Packs are for slips that produce a number the trace does
 *    not contain.
 */
export interface PackContext {
  guess: number;
  result: number;
  calc: Calculation;
  values: readonly number[];
  quantities: Quantity[];
  /** Relative tolerance comparison shared with the rest of the course. */
  close: (a: number, b: number) => boolean;
}

export interface PackRule {
  id: string;
  certain: boolean;
  match(context: PackContext): string | null;
}

export const diagnosticPacks: Record<string, PackRule[]> = {
  // -------------------------------------------------------------------
  // Issue #20: chapter 06. Uncomment and implement at least two.
  // First run, for each model you target:
  //   node --experimental-strip-types scripts/trace-stages.mjs chain 6 10
  // Anything the tool reports as [intermediate] is already handled.
  //
  // chain: [          // dl-06-002, y = (s*x)^2, dy/dx = 2*s^2*x
  //   {
  //     id: "chain-added-not-multiplied",
  //     certain: false,
  //     match: ({ guess, values, close }) => {
  //       const [x, s] = values;
  //       if (![x, s].every(Number.isFinite)) return null;
  //       // Local derivatives along one path multiply; adding them is the slip.
  //       return close(guess, 2 * s * x + s) ? "…" : null;
  //     },
  //   },
  // ],
  // depth: [          // dl-06-007, factor^depth
  //   // Slip to target: factor multiplied by depth instead of raised to it.
  // ],
  // -------------------------------------------------------------------

  // Worked example. dl-05-001 and friends use `gd`: w - rate * 2w.
  gd: [
    {
      id: "gd-ascended",
      certain: false,
      match: ({ guess, values, close }) => {
        const [w, rate] = values;
        if (!Number.isFinite(w) || !Number.isFinite(rate) || rate === 0)
          return null;
        // Adding the gradient instead of subtracting it moves uphill.
        return close(guess, w + rate * 2 * w)
          ? "Your answer is the weight moved in the +gradient direction. Gradient descent subtracts the gradient: w - rate x dL/dw."
          : null;
      },
    },
  ],
};

/*
 * Deliberately NOT a rule here: "answered 2w, the raw gradient". The gradient is
 * already a stage of the executed trace, so the generic `intermediate` rule
 * names it exactly and with certainty. Before writing a pack rule, check whether
 * the slip lands on a value the trace already contains - if it does, the
 * structural rule is strictly better and a pack rule would only shadow it.
 */
