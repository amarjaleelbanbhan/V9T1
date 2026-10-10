/**
 * Coverage gate for issue #20.
 *
 * RED until chapter 06 has at least two diagnostic pack rules. That is the
 * definition of done; do not relax these assertions to make CI green.
 *
 * The invariants that protect learners from a misfiring rule already live in
 * src/engine/diagnostics.test.mjs ("pack rules stay silent on the authored
 * cases of their own lessons", "every pack rule is keyed to a model some
 * lesson actually uses"). Those must keep passing.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { diagnosticPacks } from "../course/diagnosticPacks.ts";
import { diagnose } from "../course/diagnostics.ts";
import { calculate } from "./beginner.ts";

const CH06_MODELS = ["chain", "depth", "hidden-delta", "weight-gradient"];
const lessons = JSON.parse(fs.readFileSync("src/course/training.json", "utf8")).filter(
  (l) => l.chapter === "CH-06",
);

test("chapter 06 has at least two diagnostic pack rules", () => {
  const covered = CH06_MODELS.filter((m) => (diagnosticPacks[m] ?? []).length > 0);
  assert.ok(
    covered.length >= 2,
    `only ${covered.length} of ${CH06_MODELS.length} chapter 06 models have a pack (see issue #20). ` +
      `Covered: ${covered.join(", ") || "none"}`,
  );
});

test("no chapter 06 pack rule duplicates a value already in the trace", () => {
  for (const l of lessons) {
    const rules = diagnosticPacks[l.model] ?? [];
    if (!rules.length) continue;
    for (const c of l.cases) {
      const calc = calculate(l.model, c.values);
      for (const stage of calc.stages) {
        if (typeof stage.value !== "number") continue;
        const d = diagnose(stage.value, calc, l, c.values);
        assert.notEqual(
          d.category,
          "pack",
          `${l.id}: a pack rule shadowed stage "${stage.label}" (${stage.value}), ` +
            `which the generic intermediate rule already names with certainty`,
        );
      }
    }
  }
});

test("chapter 06 pack rules never fire on a correct answer", () => {
  for (const l of lessons) {
    if (!(diagnosticPacks[l.model] ?? []).length) continue;
    for (const c of l.cases) {
      const calc = calculate(l.model, c.values);
      assert.equal(diagnose(c.expected, calc, l, c.values).category, "match", l.id);
    }
  }
});

