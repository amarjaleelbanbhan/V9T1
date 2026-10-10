/**
 * Authoring aid for issue #20.
 *
 * Before writing a diagnostic pack rule you must know which values already
 * appear as stages in the executed trace. Any slip landing on one of those is
 * already named, exactly and with certainty, by the generic `intermediate`
 * rule, which runs before packs — a pack rule for it would be dead code.
 *
 * This prints the stages for every lesson using a model, plus what the current
 * diagnostics say about a few candidate wrong answers.
 *
 *   node --experimental-strip-types scripts/trace-stages.mjs weight-gradient
 *   node --experimental-strip-types scripts/trace-stages.mjs weight-gradient 9 18 -18
 */
import fs from "node:fs";
import { calculate } from "../src/engine/beginner.ts";
import { diagnose } from "../src/course/diagnostics.ts";

const [model, ...probes] = process.argv.slice(2);
if (!model) {
  console.error("Usage: trace-stages.mjs <model> [candidate wrong answers...]");
  process.exit(1);
}
const lessons = ["foundations", "neural", "training"]
  .flatMap((name) => JSON.parse(fs.readFileSync(`src/course/${name}.json`, "utf8")))
  .filter((l) => l.model === model);

if (!lessons.length) {
  console.error(`No lesson uses model "${model}".`);
  process.exit(1);
}

for (const l of lessons) {
  console.log("\n" + "─".repeat(78));
  console.log(`${l.id}  ${l.title}   target: ${l.target}`);
  console.log(`labels: ${l.labels.join(" | ")}`);
  for (const [i, c] of l.cases.entries()) {
    const calc = calculate(model, c.values);
    console.log(`\n  ${i ? "transfer" : "worked  "} inputs ${JSON.stringify(c.values)} -> ${calc.result}`);
    console.log(`  STAGES ALREADY IN THE TRACE (do not write a pack rule for these):`);
    for (const s of calc.stages) console.log(`    ${String(s.value).padStart(14)}   ${s.label}`);
    for (const probe of probes) {
      const guess = Number(probe);
      if (!Number.isFinite(guess)) continue;
      const d = diagnose(guess, calc, l, c.values);
      console.log(`  probe ${String(guess).padStart(10)} -> [${d.category}${d.certain ? "" : ", hedged"}] ${d.observation}`);
    }
  }
}
console.log("\n" + "─".repeat(78));
console.log("A probe reported as `intermediate` is already handled. Target the others.");

