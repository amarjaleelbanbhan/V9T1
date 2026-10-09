import {describe,it} from 'node:test';
import assert from 'node:assert/strict';
import {gradientChain} from './gradientDepth.ts';
const near=(a,b,tol=1e-7)=>assert.ok(Math.abs(a-b)<tol,a+' versus '+b);
describe('depth gradient chain',()=>{
 it('linear chain is exactly the weight raised to depth',()=>{for(const n of [1,2,4,8,16])near(gradientChain(n,'linear',.5,2,0).totalGradient,.5**n)});
 it('identity chain keeps derivative equal to one',()=>near(gradientChain(32,'linear',1,2,0).totalGradient,1));
 it('repeated factors greater than one amplify gradients',()=>near(gradientChain(8,'linear',1.5,.01,0).totalGradient,1.5**8));
 it('sigmoid saturates and attenuates gradients',()=>{const r=gradientChain(12,'sigmoid',1,5,0);assert.ok(r.totalGradient<1e-8);assert.ok(r.steps.every(s=>s.slope<=.25))});
 it('dead ReLU stops the derivative',()=>{const r=gradientChain(8,'relu',1,-1,0);near(r.totalGradient,0);assert.ok(r.steps.every(s=>s.gradient===0))});
 it('ReLU uses the zero subgradient at the kink',()=>near(gradientChain(1,'relu',1,0,0).totalGradient,0));
 it('tanh follows exact local chain products',()=>{const r=gradientChain(5,'tanh',.7,.2,.1);near(r.totalGradient,r.steps.reduce((p,s)=>p*s.localFactor,1))});
 it('matches numerical finite difference derivatives for smooth nonzero cases',()=>{
  const eps=1e-5;
  for(const k of ['linear','sigmoid','tanh','relu'])for(const n of [1,3,7]){
   const p=gradientChain(n,k,.7,.8,.15),up=gradientChain(n,k,.7,.8+eps,.15),dn=gradientChain(n,k,.7,.8-eps,.15);
   near(p.totalGradient,(up.output-dn.output)/(2*eps),1e-7);
  }
 });
 it('rejects invalid depth and nonfinite inputs',()=>{
  for(const n of [-1,0,2.5,33])assert.throws(()=>gradientChain(n,'sigmoid',1,0,0));
  assert.throws(()=>gradientChain(3,'linear',Infinity,0,0));
 });
});
