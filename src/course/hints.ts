import { lessonHints } from "./lessonHints.ts";
import type { Calculation } from "./types.ts";

/** The lesson fields a hint ladder needs. The full Lesson satisfies this. */
export interface HintLesson {
  labels: string[];
  target: string;
  formula: string;
  terms: [string, string][];
  why: string;
  /** Selects authored level 1 and 2 copy, when it exists for this lesson. */
  id?: string;
}

export type HintLevel = 1 | 2 | 3 | 4;

export interface Hint {
  level: HintLevel;
  title: string;
  body: string;
  /** Levels 3 and 4 need the authored Python program to have produced a trace. */
  needsCalculation: boolean;
}

export const HINT_TITLES: Record<HintLevel, string> = {
  1: "Point me at the right quantity",
  2: "Remind me of the rule",
  3: "Show one computed step",
  4: "Show the worked solution",
};

const show = (value: number) => Number(value.toFixed(6)).toString();

const named = (lesson: Pick<HintLesson, "labels">, i: number) =>
  lesson.labels[i] || `Input ${i + 1}`;

/**
 * A strictly ordered ladder. Level 3 reveals exactly one operation and leaves
 * the prediction editable; level 4 reveals everything and ends the attempt's
 * claim to independent success.
 */
export function hintLadder(
  lesson: HintLesson,
  values: readonly number[],
  calc: Calculation | null,
): Hint[] {
  const authored = lessonHints[lesson.id ?? ""] ?? {};
  const inputs = values
    .map((value, i) => `${named(lesson, i)} = ${show(value)}`)
    .join(", ");
  const first = calc?.stages[0];
  const operations = calc ? Math.max(1, calc.stages.length - 1) : 0;
  return [
    {
      level: 1,
      title: HINT_TITLES[1],
      body: authored.attention
        ? `${authored.attention}

The quantities in play are ${inputs}.`
        : `You are predicting ${lesson.target}. The quantities in play are ${inputs}. ` +
          `Decide which of them the formula touches first, and write that substitution down before computing anything else.`,
      needsCalculation: false,
    },
    {
      level: 2,
      title: HINT_TITLES[2],
      body: authored.rule ?? (
        `${lesson.formula}\n\n` +
        lesson.terms.map(([word, meaning]) => `${word}: ${meaning}`).join("\n") +
        `\n\nWhy it applies here: ${lesson.why}`),
      needsCalculation: false,
    },
    {
      level: 3,
      title: HINT_TITLES[3],
      body: first
        ? `First operation — ${first.label} = ${typeof first.value === "number" ? show(first.value) : first.value}. ` +
          `${operations - 1} operation${operations - 1 === 1 ? "" : "s"} remain. Apply them yourself, then predict.`
        : "Run the lesson's Python program to compute the first operation.",
      needsCalculation: true,
    },
    {
      level: 4,
      title: HINT_TITLES[4],
      body: calc
        ? calc.stages
            .map(
              (s) =>
                `${s.label}: ${typeof s.value === "number" ? show(s.value) : s.value}`,
            )
            .join("\n")
        : "Run the lesson's Python program to compute every operation.",
      needsCalculation: true,
    },
  ];
}

/** Evidence wording for the highest hint level used in an attempt. */
export function hintEvidenceNote(level: number) {
  if (level <= 0)
    return "No hints used. A correct answer on both cases counts as independent success.";
  if (level >= 4)
    return "Worked solution shown. This attempt can still record assisted success, not independent success.";
  return `Hint level ${level} used. This attempt can record assisted success, not independent success.`;
}

