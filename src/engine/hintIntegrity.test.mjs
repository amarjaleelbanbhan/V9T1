import { test } from 'node:test';
import assert from 'node:assert/strict';
import { hintLadder } from '../course/hints.ts';
import { lessonHints } from '../course/lessonHints.ts';
import { emptyLearning, scheduleRecall, Rating, recalledAfterIndependent, parseLearning } from '../course/learning.ts';

test('authored level-two wording reaches the learner instead of the generic fallback', () => {
  const lesson = { id: 'dl-00-001', labels: ['x'], target: 'output', formula: 'generic formula', terms: [], why: 'generic rationale' };
  assert.equal(hintLadder(lesson, [2], null)[1].body, lessonHints[lesson.id].rule);
});

const id = 'dl-00-001:concept';
const start = () => scheduleRecall(emptyLearning(), id, Rating.Good, 1000);
test('a first rating or early revisit cannot establish later scheduled recall', () => {
  const state = start();
  assert.equal(state.history[0].scheduled, false);
  assert.equal(recalledAfterIndependent(state, 'dl-00-001', 500), false);
  const early = scheduleRecall(state, id, Rating.Good, 1001);
  assert.equal(early.history.at(-1).scheduled, false);
  assert.equal(recalledAfterIndependent(early, 'dl-00-001', 500), false);
});
test('Again on a due card does not count as successful later recall', () => {
  const state = start();
  const failed = scheduleRecall(state, id, Rating.Again, state.cards[id].due.getTime() + 1);
  assert.equal(failed.history.at(-1).scheduled, true);
  assert.equal(recalledAfterIndependent(failed, 'dl-00-001', 500), false);
});
test('Hard, Good and Easy on a due card count as self-rated recall after independent success', () => {
  for (const rating of [Rating.Hard, Rating.Good, Rating.Easy]) {
    const state = start();
    const now = state.cards[id].due.getTime() + 1;
    const reviewed = scheduleRecall(state, id, rating, now);
    assert.equal(recalledAfterIndependent(reviewed, 'dl-00-001', 500), true);
    assert.equal(recalledAfterIndependent(reviewed, 'dl-00-001', now), false);
    assert.equal(recalledAfterIndependent(reviewed, 'dl-00-002', 500), false);
    assert.equal(recalledAfterIndependent(reviewed, 'dl-00-001', undefined), false);
  }
});
test('a later failed due review supersedes a successful due review', () => {
  let state = start();
  state = scheduleRecall(state, id, Rating.Good, state.cards[id].due.getTime() + 1);
  assert.equal(recalledAfterIndependent(state, 'dl-00-001', 500), true);
  state = scheduleRecall(state, id, Rating.Again, state.cards[id].due.getTime() + 1);
  assert.equal(recalledAfterIndependent(state, 'dl-00-001', 500), false);
});
test('scheduled-review provenance survives storage and older histories fail closed', () => {
  let state = start();
  state = scheduleRecall(state, id, Rating.Good, state.cards[id].due.getTime() + 1);
  assert.equal(recalledAfterIndependent(parseLearning(JSON.stringify(state)), 'dl-00-001', 500), true);
  const old = { ...state, history: state.history.map(({ scheduled, ...event }) => event) };
  assert.equal(recalledAfterIndependent(parseLearning(JSON.stringify(old)), 'dl-00-001', 500), false);
  const invalid = { ...state, history: state.history.map(event => ({ ...event, scheduled: 'yes' })) };
  assert.equal(parseLearning(JSON.stringify(invalid)).history.length, 0);
});
