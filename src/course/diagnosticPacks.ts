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

/** A pack must defer to correct answers, reversed signs and exact trace stages. */
function uncoveredSlip({guess, result, calc, close}: PackContext, slip: number) {
  return Number.isFinite(guess) && Number.isFinite(result) && Number.isFinite(slip) &&
    !close(guess, result) && !(result !== 0 && close(guess, -result)) &&
    !calc.stages.some(s => typeof s.value === "number" && close(guess, s.value)) &&
    close(guess, slip);
}

export const diagnosticPacks: Record<string, PackRule[]> = {
  chain: [
    {
      id: "chain-added-not-multiplied",
      certain: false,
      match: (context) => {
        const outer = context.calc.stages.find(s => s.label === "dy/du = 2u")?.value;
        const inner = context.calc.stages.find(s => s.label === "du/dx")?.value;
        if (typeof outer !== "number" || typeof inner !== "number") return null;
        return uncoveredSlip(context, outer + inner)
          ? "Your answer equals the sum of dy/du and du/dx. Along this composed path those local sensitivities multiply: dy/dx = (dy/du) × (du/dx)."
          : null;
      },
    },
  ],
  depth: [
    {
      id: "depth-multiplied-not-powered",
      certain: false,
      match: (context) => {
        const [factor, depth] = context.values;
        if (!Number.isFinite(factor) || !Number.isInteger(depth) || depth < 1 || depth > 20 || Math.abs(factor) > 5) return null;
        return uncoveredSlip(context, factor * depth)
          ? "Your answer equals the local factor multiplied by the path depth. Each link multiplies the arriving sensitivity again, so a shared factor f across d links gives f^d rather than f × d."
          : null;
      },
    },
  ],
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

