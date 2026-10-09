import{describe,it}from'node:test';
import assert from'node:assert/strict';
import{evaluateLoss,descentTrace}from'./lossGradient.ts';
const close=(a,b)=>assert.ok(Math.abs(a-b)<1e-12,`${a} != ${b}`);
const base={mode:'half-squared',input:1,target:1,bias:0,learningRate:.2,initialWeight:2,updates:3};
describe('loss functions and numerical gradient descent',()=>{
  it('calculates half squared error and the chain-rule derivative for a linear prediction',()=>{
    const r=evaluateLoss('half-squared',1.5,2,1,0);
    close(r.prediction,3);close(r.error,2);close(r.loss,2);close(r.gradient,4);
  });
  it('steps weight opposite the derivative and decreases loss',()=>{
    const t=descentTrace(base);
    close(t[0].weight,2);close(t[0].loss,.5);close(t[0].gradient,1);
    close(t[0].nextWeight,1.8);close(t[1].loss,.32);
    assert.equal(t.length,4);assert.equal(t[3].nextWeight,null);
  });
  it('reproduces Lecture 04 worked example L(w)=w²',()=>{
    const t=descentTrace({...base,mode:'weight-squared',initialWeight:2,updates:2});
    close(t[0].loss,4);close(t[0].gradient,4);close(t[1].weight,1.2);
    close(t[1].loss,1.44);close(t[2].weight,.72);close(t[2].loss,.5184);
  });
  it('uses a negative gradient to move a negative weight upward',()=>{
    const t=descentTrace({...base,mode:'weight-squared',initialWeight:-2,updates:1});
    close(t[0].gradient,-4);close(t[1].weight,-1.2);
  });
  it('shows learning rate 1 can oscillate rather than converge for w²',()=>{
    const t=descentTrace({...base,mode:'weight-squared',initialWeight:2,learningRate:1,updates:2});
    close(t[1].weight,-2);close(t[2].weight,2);close(t[2].loss,4);
  });
  it('handles zero gradient and zero input',()=>{
    const v=evaluateLoss('half-squared',3,0,1,0);
    close(v.loss,.5);close(v.gradient,0);
    const t=descentTrace({...base,input:0,updates:2});
    assert.equal(t[2].weight,2);
  });
  it('rejects invalid or overflow parameters',()=>{
    assert.throws(()=>descentTrace({...base,updates:-1}));
    assert.throws(()=>descentTrace({...base,learningRate:Infinity}));
    assert.throws(()=>descentTrace({...base,learningRate:2}));
    assert.throws(()=>evaluateLoss('weight-squared',1e308));
    assert.throws(()=>evaluateLoss('half-squared',1e308,1e308,0,0));
    assert.throws(()=>descentTrace({...base,updates:1.5}));
  });
});
