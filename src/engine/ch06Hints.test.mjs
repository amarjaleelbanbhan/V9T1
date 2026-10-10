/**
 * Coverage gate for issue #18.
 *
 * This file is RED until chapter 06 has authored level 1 and 2 hint copy.
 * That is the definition of done for the issue; do not weaken these
 * assertions to make CI green.
 *
 * The quality rules (length, no leaked answers, matching lesson ids) are
 * already enforced for every entry by src/engine/diagnostics.test.mjs.
 * This file only checks that chapter 06 is covered at all, plus the two
 * things that need their own check: level 1 must not restate the formula,
 * and level 2 must not substitute the lesson's own case values.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { lessonHints } from "../course/lessonHints.ts";

const chapter06 = JSON.parse(fs.readFileSync("src/course/training.json", "utf8")).filter(
  (l) => l.chapter === "CH-06",
);

test("chapter 06 has seven lessons to author", () => {
  assert.equal(chapter06.length, 7);
});

test("every chapter 06 lesson has authored level 1 and level 2 copy", () => {
  const missing = chapter06
    .filter((l) => !lessonHints[l.id]?.attention || !lessonHints[l.id]?.rule)
    .map((l) => l.id);
  assert.deepEqual(
    missing,
    [],
    `still to author (see issue #18): ${missing.join(", ") || "none"}`,
  );
});

test("level 1 points attention somewhere instead of restating the formula", () => {
  for (const l of chapter06) {
    const attention = lessonHints[l.id]?.attention;
    if (!attention) continue;
    assert.notEqual(
      attention.trim(),
      l.formula.trim(),
      `${l.id}: level 1 is the formula verbatim; it should direct attention, not state the rule`,
    );
    // A nudge that already contains the whole formula is level 2's job.
    assert.ok(
      !attention.includes(l.formula),
      `${l.id}: level 1 contains the full formula, which belongs to level 2`,
    );
  }
});

test("level 2 states the rule without substituting this lesson's own numbers", () => {
  for (const l of chapter06) {
    const rule = lessonHints[l.id]?.rule;
    if (!rule) continue;
    for (const value of l.cases.flatMap((c) => c.values))
      if (Math.abs(value) >= 2)
        assert.ok(
          !rule.includes(String(value)),
          `${l.id}: level 2 substitutes the case value ${value}; state the rule generally instead`,
        );
  }
});

