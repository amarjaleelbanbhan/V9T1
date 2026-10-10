import { test } from "node:test";
import assert from "node:assert/strict";
import {
  emptyLearning,
  parseLearning,
  scheduleRecall,
  dueCards,
  practiceEvent,
  recommendLesson,
  Rating,
} from "../course/learning.ts";
import { surfaceLoss, surfacePath } from "./surface.ts";
const now = Date.UTC(2026, 9, 9);
test("FSRS schedules actual cards and round-trips dates and history", () => {
  let state = emptyLearning();
  state = scheduleRecall(state, "dl-00-001:concept", Rating.Good, now);
  assert.equal(state.cards["dl-00-001:concept"].reps, 1);
  assert.equal(state.history[0].rating, Rating.Good);
  assert.ok(state.cards["dl-00-001:concept"].due.getTime() > now);
  const saved = parseLearning(JSON.stringify(state));
  assert.equal(
    saved.cards["dl-00-001:concept"].due.getTime(),
    state.cards["dl-00-001:concept"].due.getTime(),
  );
  assert.deepEqual(dueCards(saved, now), []);
  assert.deepEqual(dueCards(saved, now + 86400000), ["dl-00-001:concept"]);
});
test("Again schedules earlier than Easy; repeated reviews update difficulty and lapses", () => {
  const a = scheduleRecall(
      emptyLearning(),
      "dl-02-003:formula",
      Rating.Again,
      now,
    ),
    e = scheduleRecall(emptyLearning(), "dl-02-003:formula", Rating.Easy, now);
  assert.ok(
    a.cards["dl-02-003:formula"].due < e.cards["dl-02-003:formula"].due,
  );
  const review = scheduleRecall(
    e,
    "dl-02-003:formula",
    Rating.Again,
    e.cards["dl-02-003:formula"].due.getTime(),
  );
  assert.equal(review.cards["dl-02-003:formula"].reps, 2);
  assert.ok(review.cards["dl-02-003:formula"].lapses >= 1);
});
test("corrupt or hostile learning state is filtered without losing valid records", () => {
  assert.deepEqual(parseLearning("{broken"), emptyLearning());
  assert.deepEqual(parseLearning('{"version":2}'), emptyLearning());
  const valid = scheduleRecall(
    emptyLearning(),
    "dl-00-001:concept",
    Rating.Good,
    now,
  );
  const encoded = JSON.parse(JSON.stringify(valid));
  encoded.cards.bad = {};
  encoded.cards["dl-00-002:concept"] = {
    ...encoded.cards["dl-00-001:concept"],
    due: "bad",
  };
  encoded.history.push({ id: "bad", at: NaN });
  encoded.drafts = { "dl-00-001": "x".repeat(9000), __proto__: "bad" };
  encoded.bookmarks = ["bad", "dl-00-001"];
  const restored = parseLearning(JSON.stringify(encoded));
  assert.deepEqual(Object.keys(restored.cards), ["dl-00-001:concept"]);
  assert.equal(restored.drafts["dl-00-001"].length, 8000);
  assert.deepEqual(restored.bookmarks, ["dl-00-001"]);
  assert.equal(restored.history.length, 1);
});
test("adaptive recommendation is transparent and uses due, mistakes, then incomplete order", () => {
  const ids = ["dl-00-001", "dl-00-002"];
  let s = emptyLearning();
  assert.equal(recommendLesson(s, ids, [ids[0]], now).id, ids[1]);
  s = practiceEvent(
    practiceEvent(s, ids[0], false, now),
    ids[0],
    false,
    now + 1,
  );
  assert.equal(recommendLesson(s, ids, [], now).id, ids[0]);
  s = scheduleRecall(s, ids[1] + ":concept", Rating.Again, now);
  assert.equal(recommendLesson(s, ids, [], now + 86400000).id, ids[1]);
});
test("loss surface derivatives match finite differences and known minimum", () => {
  assert.deepEqual(surfaceLoss(2, 1), { loss: 0, dw: 0, db: 0 });
  const h = 1e-5;
  for (const [w, b] of [
    [0, 0],
    [-1, 0.5],
    [3, -2],
  ]) {
    const r = surfaceLoss(w, b);
    assert.ok(
      Math.abs(
        (surfaceLoss(w + h, b).loss - surfaceLoss(w - h, b).loss) / (2 * h) -
          r.dw,
      ) < 1e-8,
    );
    assert.ok(
      Math.abs(
        (surfaceLoss(w, b + h).loss - surfaceLoss(w, b - h).loss) / (2 * h) -
          r.db,
      ) < 1e-8,
    );
  }
  const trace = surfacePath(0, 0, 0.2, 30);
  assert.ok(trace.at(-1).loss < trace[0].loss / 100);
  assert.throws(() => surfacePath(0, 0, 10, 1));
});
test("review history stays bounded and invalid ratings are rejected", () => {
  let s = emptyLearning();
  s.history = Array.from({ length: 2000 }, () => ({
    kind: "practice",
    id: "dl-00-001",
    at: now,
    correct: false,
  }));
  s = scheduleRecall(s, "dl-00-001:concept", Rating.Good, now);
  assert.equal(s.history.length, 2000);
  assert.throws(() => scheduleRecall(s, "dl-00-001:concept", 0, now));
});
import { learningBackup, parseBackup } from "../course/backup.ts";
test("backup round-trips learning plus guided evidence and filters invalid chapter records", () => {
  const s = scheduleRecall(
      emptyLearning(),
      "dl-00-001:concept",
      Rating.Good,
      now,
    ),
    progress = { "dl-00-001": { attempts: 2, cases: [0, 1], passedAt: now } };
  const storage = {
    getItem: (key) =>
      key === "neurallab.beginner.v1"
        ? JSON.stringify(progress)
        : JSON.stringify(["CH-00", "CH-99"]),
  };
  const backup = learningBackup(s, storage);
  const restored = parseBackup(JSON.stringify(backup));
  assert.deepEqual(restored.progress, progress);
  assert.deepEqual(restored.chapters, ["CH-00"]);
  assert.equal(restored.learning.cards["dl-00-001:concept"].reps, 1);
  assert.throws(() => parseBackup('{"version":1}'));
});
test('nonexistent topic IDs cannot become restored lessons, bookmarks or due cards',()=>{const state=scheduleRecall(emptyLearning(),'dl-00-001:concept',Rating.Good,now);const encoded=JSON.parse(JSON.stringify(state));encoded.selected='dl-07-999';encoded.bookmarks=['dl-00-001:concept','dl-07-999','dl-00-001'];encoded.cards['dl-07-999:concept']=encoded.cards['dl-00-001:concept'];const parsed=parseLearning(JSON.stringify(encoded));assert.equal(parsed.selected,'dl-00-001');assert.deepEqual(parsed.bookmarks,['dl-00-001']);assert.deepEqual(Object.keys(parsed.cards),['dl-00-001:concept']);assert.throws(()=>scheduleRecall(state,'dl-07-999:concept',Rating.Good,now));});
