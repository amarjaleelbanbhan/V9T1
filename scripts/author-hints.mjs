/**
 * Authoring aid for issue #18.
 *
 * Prints, for one chapter, everything you need to write hint levels 1 and 2:
 * the lesson's own wording, the slip it already names, and the generic hint
 * text your entry will replace. Levels 3 and 4 come from the executed Python
 * trace and are shown here only so you can see the line your level 1 must not
 * cross.
 *
 *   node --experimental-strip-types scripts/author-hints.mjs CH-06
 *   node --experimental-strip-types scripts/author-hints.mjs CH-06 dl-06-003
 */
import fs from "node:fs";
import { hintLadder } from "../src/course/hints.ts";
import { calculate } from "../src/engine/beginner.ts";

const [chapter = "CH-06", only] = process.argv.slice(2);
const lessons = ["foundations", "neural", "training"]
  .flatMap((name) => JSON.parse(fs.readFileSync(`src/course/${name}.json`, "utf8")))
  .filter((l) => l.chapter === chapter && (!only || l.id === only));

if (!lessons.length) {
  console.error(`No lessons for ${chapter}${only ? " / " + only : ""}.`);
  process.exit(1);
}

const rule = (s) => "\n" + "─".repeat(78) + "\n" + s;
for (const l of lessons) {
  const values = l.cases[0].values;
  let calc = null;
  try {
    calc = l.model === "precision" ? null : calculate(l.model, values);
  } catch (error) {
    console.warn(`  (could not compute ${l.id}: ${error.message})`);
  }
  const ladder = hintLadder(l, values, calc);

  console.log(rule(`${l.id}  ${l.title}   [model: ${l.model}]`));
  console.log(`TARGET      ${l.target}`);
  console.log(`FORMULA     ${l.formula}`);
  console.log(`LABELS      ${l.labels.join(" | ")}`);
  console.log(`TERMS       ${l.terms.map(([w, m]) => `${w} = ${m}`).join("\n            ")}`);
  console.log(`EXPLANATION ${l.explanation}`);
  console.log(`WHY         ${l.why}`);
  console.log(`MISTAKE     ${l.mistake}      <-- usually the best clue for level 1`);
  console.log(`DEBUG       ${l.debug}`);
  console.log(`REASON      ${l.reason}`);
  console.log(`CASES       worked ${JSON.stringify(l.cases[0].values)} -> ${l.cases[0].expected}`);
  console.log(`            transfer ${JSON.stringify(l.cases[1].values)} -> ${l.cases[1].expected}`);
  console.log(`\nCURRENT LEVEL 1 (generic, you are replacing this):\n  ${ladder[0].body.replace(/\n/g, "\n  ")}`);
  console.log(`\nCURRENT LEVEL 2 (generic, you are replacing the trailing clause):\n  ${ladder[1].body.replace(/\n/g, "\n  ")}`);
  if (calc) {
    console.log(`\nLEVEL 3 (generated, do not author; your level 1 must stay well short of this):\n  ${ladder[2].body}`);
    console.log(`\nSTAGES in the trace: ${calc.stages.map((s) => `${s.label}=${s.value}`).join(" | ")}`);
  }
}
console.log(rule(`${lessons.length} lesson(s). Write entries in src/course/lessonHints.ts.`));

