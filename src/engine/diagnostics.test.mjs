import { test } from "node:test";
import assert from "node:assert/strict";
import { diagnose, namedQuantities } from "../course/diagnostics.ts";
import { hintLadder, hintEvidenceNote } from "../course/hints.ts";
import { lessonHints } from "../course/lessonHints.ts";
import { diagnosticPacks } from "../course/diagnosticPacks.ts";
import {
  readProgress,
  recordPractice,
  evidenceState,
} from "../course/progress.ts";
import fs from "node:fs";
import { calculate } from "./beginner.ts";

// catalog.ts imports JSON, which bare Node ESM cannot do; read the same files directly.
const beginnerLessons = ["foundations", "neural", "training"].flatMap((name) =>
  JSON.parse(fs.readFileSync(`src/course/${name}.json`, "utf8")),
);

const lesson = { labels: ["Input x", "Factor", "Offset"], target: "final output" };
// program: result = x * factor + offset. Stages: Read x, Multiply by factor, Add offset, Result.
const values = [2, 3, 1];
const calc = calculate("program", values);

test("the fixture matches the engine the lessons actually use", () => {
  assert.equal(calc.result, 7);
  assert.deepEqual(
    calc.stages.map((s) => s.label),
    ["Read x", "Multiply by factor", "Add offset", "Result"],
  );
});

test("a correct prediction is reported as a match", () => {
  const d = diagnose(7, calc, lesson, values);
  assert.equal(d.category, "match");
  assert.ok(d.certain);
});

test("a reversed sign is identified exactly, not guessed", () => {
  const d = diagnose(-7, calc, lesson, values);
  assert.equal(d.category, "sign");
  assert.ok(d.certain);
  assert.match(d.observation, /sign is reversed/);
});

test("intermediate observations are grammatical for both one and several remaining operations", () => {
  const many = calculate("variance", [2, 4, 6]); // mean, three squared deviations, result
  const d = diagnose(4, many, { labels: ["a", "b", "c"], target: "variance" }, [2, 4, 6]);
  assert.equal(d.category, "intermediate");
  assert.match(d.observation, /operations were not applied/);
});

test("stopping at an intermediate operation names that operation and the remainder", () => {
  const d = diagnose(6, calc, lesson, values);
  assert.equal(d.category, "intermediate");
  assert.ok(d.certain);
  assert.match(d.observation, /Multiply by factor/);
  assert.match(d.observation, /One later operation was not applied/);
});

test("a missing additive term is reported as an exact difference with its name", () => {
  // Half-squared-error style: a guess short by exactly the bias-like offset is
  // caught by the intermediate rule first, so use a model without that stage.
  const gd = calculate("gd", [3, 0.2]); // w - rate*2w = 3 - 1.2 = 1.8
  const d = diagnose(1.3, gd, { labels: ["Weight", "Learning rate"], target: "updated weight" }, [3, 0.2]);
  assert.ok(["offset", "factor", "near", "unmatched", "magnitude"].includes(d.category));
  assert.equal(typeof d.observation, "string");
});

test("an answer off by a named multiplicative factor is flagged as a heuristic", () => {
  const d = diagnose(7 / 3, calc, lesson, values);
  assert.equal(d.category, "factor");
  assert.equal(d.certain, false, "multiplicative matches are heuristics and must be hedged");
  assert.match(d.observation, /Factor/);
});

test("order-of-magnitude errors keep the sign observation separate", () => {
  const d = diagnose(0.07, calc, lesson, values);
  assert.ok(["magnitude", "factor", "offset"].includes(d.category));
});

test("a near miss is distinguished from a scale error and from an unrelated answer", () => {
  assert.equal(diagnose(7.2, calc, lesson, values).category, "near");
  // Same sign, far away: reported as a scale observation rather than a shrug.
  assert.equal(diagnose(412.5, calc, lesson, values).category, "magnitude");
  // Opposite sign and no named relationship: nothing confident can be said.
  assert.equal(diagnose(-413, calc, lesson, values).category, "unmatched");
});

test("non-finite predictions never produce a false diagnosis", () => {
  for (const bad of [NaN, Infinity, -Infinity])
    assert.equal(diagnose(bad, calc, lesson, values).category, "unmatched");
});

test("zero results do not create divide-by-zero or false reciprocal matches", () => {
  const zero = { result: 0, stages: [{ label: "Only step", value: 0 }, { label: "Result", value: 0 }] };
  for (const guess of [0, 1, -1, 1e6]) {
    const d = diagnose(guess, zero, lesson, values);
    assert.ok(Number.isFinite(guess));
    assert.ok(d.observation.length > 0);
    assert.ok(!d.observation.includes("NaN") && !d.observation.includes("Infinity"));
  }
  assert.equal(diagnose(0, zero, lesson, values).category, "match");
});

test("every observation describes the number, never the learner", () => {
  const banned = /\byou (do not|don't|didn't|failed|misunderstand)\b|\byour understanding\b/i;
  for (const guess of [7, -7, 6, 2, 1 / 7, 0.07, 7.2, 412.5, 0]) {
    const d = diagnose(guess, calc, lesson, values);
    assert.doesNotMatch(d.observation, banned, `guess ${guess}: ${d.observation}`);
  }
});

test("named quantities cover inputs and computed operations without the final result", () => {
  const q = namedQuantities(lesson, values, calc);
  assert.ok(q.some((x) => x.name === "Factor" && x.value === 3));
  assert.ok(q.some((x) => x.name === "Multiply by factor" && x.value === 6));
  assert.ok(!q.some((x) => x.name === "Result"));
  assert.equal(new Set(q.map((x) => x.value)).size, q.length, "values are de-duplicated");
});

test("diagnose runs on every authored lesson's own transfer case without throwing", () => {
  for (const l of beginnerLessons) {
    if (l.model === "precision") continue; // needs NumPy, covered by the Python suite
    const c = calculate(l.model, l.cases[1].values);
    for (const guess of [c.result, -c.result, c.result + 1, c.result * 2, 0]) {
      const d = diagnose(guess, c, l, l.cases[1].values);
      assert.ok(d.observation.length > 0, l.id);
      assert.doesNotMatch(d.observation, /NaN|Infinity|undefined/, `${l.id} guess ${guess}`);
    }
    assert.equal(diagnose(c.result, c, l, l.cases[1].values).category, "match", l.id);
  }
});

const sample = beginnerLessons[0];

test("the hint ladder is strictly ordered and only levels 3-4 need a trace", () => {
  const ladder = hintLadder(sample, sample.cases[0].values, null);
  assert.deepEqual(ladder.map((h) => h.level), [1, 2, 3, 4]);
  assert.deepEqual(ladder.map((h) => h.needsCalculation), [false, false, true, true]);
});

test("level 3 reveals exactly one operation and never the result", () => {
  const ladder = hintLadder(sample, [2, 3, 1], calculate(sample.model, [2, 3, 1]));
  const three = ladder[2].body;
  assert.match(three, /Read x/);
  assert.ok(!three.includes("Add offset"), "level 3 must not leak later operations");
  assert.ok(!/\b7\b/.test(three), "level 3 must not leak the result");
});

test("level 4 lists every operation including the result", () => {
  const ladder = hintLadder(sample, [2, 3, 1], calculate(sample.model, [2, 3, 1]));
  for (const label of ["Read x", "Multiply by factor", "Add offset", "Result"])
    assert.match(ladder[3].body, new RegExp(label));
});

test("hint notes separate independent from assisted success", () => {
  assert.match(hintEvidenceNote(0), /independent success/);
  assert.match(hintEvidenceNote(2), /assisted success, not independent/);
  assert.match(hintEvidenceNote(4), /not independent success/);
});

test("unaided passes on both cases record independent success", () => {
  let p = {};
  p = recordPractice(p, "dl-00-001", 0, true, 10, 0);
  assert.equal(evidenceState(p["dl-00-001"]), "attempted");
  p = recordPractice(p, "dl-00-001", 1, true, 20, 0);
  assert.equal(p["dl-00-001"].independentAt, 20);
  assert.equal(evidenceState(p["dl-00-001"]), "independent");
  assert.equal(evidenceState(p["dl-00-001"], true), "retained");
});

test("a hinted pass records assisted success and never independent success", () => {
  let p = {};
  p = recordPractice(p, "dl-00-001", 0, true, 10, 3);
  p = recordPractice(p, "dl-00-001", 1, true, 20, 1);
  assert.equal(p["dl-00-001"].passedAt, 20);
  assert.equal(p["dl-00-001"].independentAt, undefined);
  assert.equal(p["dl-00-001"].hints, 3, "the highest hint level is retained");
  assert.equal(evidenceState(p["dl-00-001"]), "assisted");
});

test("one hinted case blocks independence even when the other case was unaided", () => {
  let p = {};
  p = recordPractice(p, "dl-00-002", 0, true, 10, 0);
  p = recordPractice(p, "dl-00-002", 1, true, 20, 2);
  assert.equal(p["dl-00-002"].independentAt, undefined);
  assert.deepEqual(p["dl-00-002"].independentCases, [0]);
});

test("hint levels are clamped, and clamping cannot manufacture independence", () => {
  let p = recordPractice({}, "dl-00-001", 0, true, 10, 99);
  assert.equal(p["dl-00-001"].hints, 4, "an out-of-range level is clamped to the maximum");
  p = recordPractice(p, "dl-00-001", 1, true, 20, -5);
  assert.deepEqual(p["dl-00-001"].independentCases, [1], "a negative level counts as unaided for that attempt only");
  assert.equal(p["dl-00-001"].independentAt, undefined, "the earlier hinted case still blocks independence");
  assert.equal(p["dl-00-001"].hints, 4, "the highest level ever used is never lowered");
});

test("evidence saved before this change still loads", () => {
  const legacy = JSON.stringify({
    "dl-00-001": { visited: 1, attempts: 2, cases: [0, 1], passedAt: 5 },
  });
  const read = readProgress({ getItem: () => legacy });
  assert.equal(read["dl-00-001"].passedAt, 5);
  assert.equal(evidenceState(read["dl-00-001"]), "assisted");
});

test("corrupt independence claims are rejected rather than trusted", () => {
  const forged = JSON.stringify({
    "dl-00-001": { attempts: 2, cases: [0, 1], passedAt: 5, independentAt: 6, independentCases: [0] },
    "dl-00-002": { attempts: 2, cases: [0], independentCases: [0, 1], independentAt: 7 },
    "dl-00-003": { attempts: 1, cases: [0], hints: 9 },
    "dl-00-004": { attempts: 2, cases: [0, 1], passedAt: 5, independentCases: [0, 1], independentAt: 6 },
  });
  const read = readProgress({ getItem: () => forged });
  assert.equal(read["dl-00-001"], undefined, "independentAt without both independent cases");
  assert.equal(read["dl-00-002"], undefined, "independent cases must be a subset of passed cases");
  assert.equal(read["dl-00-003"], undefined, "hint level out of range");
  assert.equal(read["dl-00-004"].independentAt, 6, "a consistent record survives");
});

// --- extension points used by the authored content packs ---

test("authored hint copy replaces the generic level 1 and 2 wording", () => {
  const authored = beginnerLessons.find((l) => l.id === "dl-00-001");
  const withId = hintLadder(authored, [2, 3, 1], null);
  assert.match(withId[0].body, /Instructions run in the order they are written/);
  assert.match(withId[0].body, /The quantities in play are/, "inputs are still listed");
  const withoutId = hintLadder({ ...authored, id: "dl-99-999" }, [2, 3, 1], null);
  assert.match(withoutId[0].body, /You are predicting/, "lessons without authored copy keep the fallback");
});

test("authored hint copy never leaks a value the learner must predict", () => {
  for (const [id, copy] of Object.entries(lessonHints)) {
    const l = beginnerLessons.find((x) => x.id === id);
    assert.ok(l, `lessonHints entry ${id} has no matching lesson`);
    for (const field of ["attention", "rule"]) {
      const text = copy[field];
      if (!text) continue;
      assert.ok(text.length <= 400, `${id}.${field} is too long to be a nudge`);
      for (const c of l.cases)
        assert.ok(
          !text.includes(String(c.expected)),
          `${id}.${field} contains the expected answer ${c.expected}`,
        );
    }
  }
});

test("a diagnostic pack fires on the slip it targets and stays silent otherwise", () => {
  const gd = calculate("gd", [3, 0.2]); // 3 - 0.2*6 = 1.8
  const l = { labels: ["Weight", "Learning rate"], target: "updated weight", model: "gd" };
  const ascended = diagnose(3 + 0.2 * 6, gd, l, [3, 0.2]);
  assert.equal(ascended.category, "pack");
  assert.equal(ascended.certain, false, "pack rules are hedged unless arithmetic forces them");
  assert.match(ascended.observation, /subtracts the gradient/);
  // A slip that lands on an existing stage is answered by the structural rule,
  // which is certain, so a pack must not shadow it.
  const raw = diagnose(6, gd, l, [3, 0.2]);
  assert.equal(raw.category, "intermediate");
  assert.ok(raw.certain);
  // A correct answer must never reach a pack rule.
  assert.equal(diagnose(1.8, gd, l, [3, 0.2]).category, "match");
  // Without the model there is no pack, and the generic rules still answer.
  assert.notEqual(
    diagnose(3 + 0.2 * 6, gd, { labels: l.labels, target: l.target }, [3, 0.2]).category,
    "pack",
  );
});

test("every pack rule is keyed to a model some lesson actually uses", () => {
  const models = new Set(beginnerLessons.map((l) => l.model));
  for (const model of Object.keys(diagnosticPacks))
    assert.ok(models.has(model), `pack "${model}" matches no lesson model`);
});

test("pack rules stay silent on the authored cases of their own lessons", () => {
  for (const l of beginnerLessons) {
    if (!diagnosticPacks[l.model]) continue;
    for (const c of l.cases) {
      const computed = calculate(l.model, c.values);
      assert.equal(diagnose(c.expected, computed, l, c.values).category, "match", l.id);
    }
  }
});
