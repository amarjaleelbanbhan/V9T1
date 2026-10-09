import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { activate, computeNeuron, formatNumber } from './neuron.ts';
import { clampStep, LAST_STEP } from './timeline.ts';
const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-12, `${a} is not close to ${b}`);
describe('math engine',()=>{
  it('computes weighted contributions and bias independently',()=>{
    const t=computeNeuron({ inputs:[2,-1,.5], weights:[.8,-.4,1.2],bias:.5,activation:'sigmoid' });
    t.contributions.forEach((x,i)=>near(x,[1.6,.4,.6][i]));
    near(t.weightedSum,2.6); near(t.preActivation,3.1); near(t.output,1/(1+Math.exp(-3.1)));
  });
  it('handles negative weights, zero and relu',()=>{
    const t=computeNeuron({inputs:[3,0],weights:[-2,200],bias:0,activation:'relu'});
    assert.equal(t.preActivation,-6); assert.equal(t.output,0);
  });
  it('handles all activation modes and sigmoid extremes',()=>{
    near(activate(-1000,'sigmoid'),0);near(activate(1000,'sigmoid'),1);
    near(activate(0,'sigmoid'),.5);near(activate(0,'tanh'),0);
    assert.equal(activate(-4,'linear'),-4);
  });
  it('rejects invalid vectors and nonfinite parameters',()=>{
    assert.throws(()=>computeNeuron({inputs:[1],weights:[],bias:0,activation:'linear'}));
    assert.throws(()=>computeNeuron({inputs:[1],weights:[1],bias:Infinity,activation:'linear'}));
  });
  it('rejects overflow instead of rendering an invalid result',()=>{
    assert.throws(()=>computeNeuron({inputs:[1e308],weights:[1e308],bias:0,activation:'linear'}));
  });
  it('clamps timeline steps',()=>{assert.equal(clampStep(-4),0);assert.equal(clampStep(99),LAST_STEP);});
  it('formats near-zero values',()=>{assert.equal(formatNumber(0.00001),'0');assert.equal(formatNumber(3.142),'3.142');});
});
