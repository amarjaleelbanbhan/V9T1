import { closeAnswer } from "../engine/beginner.ts";
import { diagnosticPacks } from "./diagnosticPacks.ts";
import type { Calculation } from "./types.ts";

/** The lesson fields a diagnosis needs. The full Lesson satisfies this. */
export interface DiagnosticLesson {
  labels: string[];
  target: string;
  /** Selects a chapter-specific rule pack, when one exists for this model. */
  model?: string;
}

/** Observations about a wrong number. Never a conclusion about the learner. */
export type DiagnosticCategory =
  | "match"
  | "sign"
  | "intermediate"
  | "pack"
  | "offset"
  | "factor"
  | "reciprocal"
  | "magnitude"
  | "near"
  | "unmatched";

export interface Diagnostic {
  category: DiagnosticCategory;
  observation: string;
  /** False for heuristic matches, so the interface can hedge them. */
  certain: boolean;
}

export interface Quantity {
  name: string;
  value: number;
}

const label = (lesson: Pick<DiagnosticLesson, "labels">, index: number) =>
  lesson.labels[index] || `Input ${index + 1}`;

const show = (value: number) => Number(value.toFixed(6)).toString();

/**
 * Named numbers the learner can see: the inputs they typed and every computed
 * operation except the final result row the engines always append.
 */
export function namedQuantities(
  lesson: Pick<DiagnosticLesson, "labels">,
  values: readonly number[],
  calc: Calculation,
): Quantity[] {
  const out: Quantity[] = [];
  const add = (name: string, value: number) => {
    if (!Number.isFinite(value) || value === 0) return;
    if (out.some((q) => closeAnswer(q.value, value))) return;
    out.push({ name, value });
  };
  values.forEach((value, i) => add(label(lesson, i), value));
  calc.stages.slice(0, -1).forEach((stage) => {
    if (typeof stage.value === "number") add(stage.label, stage.value);
  });
  return out;
}

/** Index of the first non-final stage whose computed value equals the guess. */
function matchingStage(guess: number, calc: Calculation) {
  return calc.stages
    .slice(0, -1)
    .findIndex(
      (stage) =>
        typeof stage.value === "number" && closeAnswer(guess, stage.value),
    );
}

/**
 * First confident match wins. Ordering is part of the contract in
 * docs/missions/LEARNING_MISSIONS.md section 4.
 */
export function diagnose(
  guess: number,
  calc: Calculation,
  lesson: DiagnosticLesson,
  values: readonly number[],
): Diagnostic {
  const result = calc.result;
  if (!Number.isFinite(guess))
    return {
      category: "unmatched",
      observation: "Enter a finite number before revealing the calculation.",
      certain: true,
    };
  if (closeAnswer(guess, result))
    return {
      category: "match",
      observation: `Your prediction matches the computed ${lesson.target}.`,
      certain: true,
    };

  if (result !== 0 && guess !== 0 && closeAnswer(guess, -result))
    return {
      category: "sign",
      observation: `The magnitude matches, but the sign is reversed: the result is ${show(result)}, not ${show(guess)}. Check which quantity is subtracted, and the sign of every input.`,
      certain: true,
    };

  const stage = matchingStage(guess, calc);
  if (stage >= 0) {
    const remaining = calc.stages.length - 2 - stage;
    return {
      category: "intermediate",
      observation:
        `Your answer equals the value after "${calc.stages[stage].label}" (${show(guess)}). ` +
        (remaining > 0
          ? remaining === 1
            ? "One later operation was not applied."
            : `${remaining} later operations were not applied.`
          : "The final operation was not applied."),
      certain: true,
    };
  }

  const quantities = namedQuantities(lesson, values, calc);

  // Chapter packs name known conceptual slips that generic arithmetic cannot.
  for (const rule of diagnosticPacks[lesson.model ?? ""] ?? []) {
    const observation = rule.match({
      guess,
      result,
      calc,
      values,
      quantities,
      close: closeAnswer,
    });
    if (observation)
      return { category: "pack", observation, certain: rule.certain };
  }

  const difference = result - guess;
  const offset = quantities.find((q) => closeAnswer(difference, q.value));
  if (offset)
    return {
      category: "offset",
      observation: `Your answer differs from the result by exactly ${show(difference)}, which is "${offset.name}". That term may have been left out.`,
      certain: false,
    };

  if (guess !== 0) {
    const ratio = result / guess;
    const factor = Number.isFinite(ratio)
      ? quantities.find(
          (q) => !closeAnswer(ratio, 1) && closeAnswer(ratio, q.value),
        )
      : undefined;
    if (factor)
      return {
        category: "factor",
        observation: `The result is your answer multiplied by ${show(ratio)}, which equals "${factor.name}". That factor may have been applied once too few or too many times.`,
        certain: false,
      };
    if (result !== 0 && closeAnswer(guess, 1 / result))
      return {
        category: "reciprocal",
        observation: `Your answer is the reciprocal of the result (1 / ${show(result)}). Check which quantity divides which.`,
        certain: false,
      };
  }

  if (result !== 0 && guess !== 0 && Math.sign(result) === Math.sign(guess)) {
    const ratio = Math.abs(result / guess);
    if (ratio >= 10 || ratio <= 0.1)
      return {
        category: "magnitude",
        observation: `The sign is right, but the size is off by about ${show(ratio >= 10 ? ratio : 1 / ratio)}×. Re-check the order of operations and any power or division.`,
        certain: false,
      };
  }

  const relative = Math.abs(difference) / Math.max(1, Math.abs(result));
  if (relative <= 0.05)
    return {
      category: "near",
      observation: `Very close: ${show(guess)} against ${show(result)}. Check rounding and whether every operation was applied.`,
      certain: false,
    };

  return {
    category: "unmatched",
    observation: `Your answer is ${show(guess)}; the computed ${lesson.target} is ${show(result)}. Step through the operations and find the first one where your working differs.`,
    certain: true,
  };
}
