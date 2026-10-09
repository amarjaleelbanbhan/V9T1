import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {CLASSIFICATION_SAMPLES,REGRESSION_SAMPLES,evaluateClassification,evaluateRegression} from './foundations.ts';
const scores=CLASSIFICATION_SAMPLES.map(x=>x.score), labels=CLASSIFICATION_SAMPLES.map(x=>x.label);
const xs=REGRESSION_SAMPLES.map(x=>x.x), ys=REGRESSION_SAMPLES.map(x=>x.y);
describe('Week 1 mathematical experiments',()=>{
  it('computes classification accuracy and confusion counts',()=>{
    const v=evaluateClassification(scores,labels,.5);
    assert.equal(v.accuracy,1);assert.equal(v.correct,6);
    assert.deepEqual([v.tp,v.tn,v.fp,v.fn],[3,3,0,0]);
  });
  it('detects false negatives at a higher threshold',()=>{
    const v=evaluateClassification(scores,labels,.7);
    assert.equal(v.correct,5);assert.equal(v.fn,1);assert.equal(v.fp,0);
  });
  it('detects false positives at a lower threshold',()=>{
    const v=evaluateClassification(scores,labels,.3);
    assert.equal(v.correct,5);assert.equal(v.fp,1);assert.equal(v.fn,0);
  });
  it('includes the threshold boundary and rejects invalid data',()=>{
    assert.equal(evaluateClassification([.6],[1],.6).predictions[0],1);
    assert.throws(()=>evaluateClassification([.2],[1,0],.5));
    assert.throws(()=>evaluateClassification([1.4],[1],.5));
    assert.throws(()=>evaluateClassification([.2],[1],Infinity));
  });
  it('computes precision, recall and undefined denominators honestly',()=>{
    const lowered=evaluateClassification(scores,labels,.3);
    assert.equal(lowered.precision,.75);assert.equal(lowered.recall,1);
    const raised=evaluateClassification(scores,labels,.7);
    assert.equal(raised.precision,1);assert.ok(Math.abs(raised.recall-2/3)<1e-12);
    const noPositives=evaluateClassification([.1],[0],.9);
    assert.equal(noPositives.precision,null);assert.equal(noPositives.recall,null);
    const missed=evaluateClassification([.1],[1],.9);
    assert.equal(missed.precision,null);assert.equal(missed.recall,0);
  });
  it('computes MAE and MSE independently',()=>{
    const v=evaluateRegression(xs,ys,.8,.6);
    assert.ok(Math.abs(v.mae-.8)<1e-12);
    assert.ok(Math.abs(v.mse-.72)<1e-12);
  });
  it('recognizes a perfect line and rejects invalid regression data',()=>{
    const v=evaluateRegression(xs,ys,1,1);
    assert.equal(v.mae,0);assert.equal(v.mse,0);
    assert.throws(()=>evaluateRegression([1e308],[1],1e308,1));
    assert.throws(()=>evaluateRegression([1,2],[2],1,0));
  });
});
