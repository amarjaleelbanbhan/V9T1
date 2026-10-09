import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {scalarActivation,scalarDerivative,stableSoftmax} from './activationLab.ts';
const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-12, a+' differs from '+b);
describe('activation lab numerical correctness',()=>{
  it('computes sigmoid, tanh, ReLU, and leaky ReLU',()=>{
    near(scalarActivation(0,'sigmoid'),.5);
    near(scalarActivation(0,'tanh'),0);
    near(scalarActivation(-2,'relu'),0);
    near(scalarActivation(-2,'leaky-relu'),-.2);
    near(scalarActivation(3,'leaky-relu'),3);
  });
  it('calculates derivatives and handles ReLU corner honestly',()=>{
    near(scalarDerivative(0,'sigmoid'),.25);
    near(scalarDerivative(0,'tanh'),1);
    near(scalarDerivative(-2,'relu'),0);
    near(scalarDerivative(-2,'leaky-relu'),.1);
    assert.equal(scalarDerivative(0,'relu'),null);
    assert.equal(scalarDerivative(0,'leaky-relu'),null);
  });
  it('stabilizes huge Softmax logits',()=>{
    const p=stableSoftmax([1000,1001,1002]);
    near(p.reduce((a,b)=>a+b,0),1);
    assert.ok(p[2]>p[1]&&p[1]>p[0]);
    assert.ok(p.every(Number.isFinite));
  });
  it('Softmax is invariant to adding the same constant',()=>{
    const a=stableSoftmax([-2,1,4]), b=stableSoftmax([3,6,9]);
    a.forEach((p,i)=>near(p,b[i]));
  });
  it('rejects invalid scalar or vector parameters',()=>{
    assert.throws(()=>scalarActivation(Infinity,'sigmoid'));
    assert.throws(()=>scalarActivation(1,'leaky-relu',0));
    assert.throws(()=>stableSoftmax([]));
    assert.throws(()=>stableSoftmax([1,NaN]));
  });
});
