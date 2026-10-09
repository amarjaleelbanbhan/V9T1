import {describe,it} from 'node:test';
import assert from 'node:assert/strict';
import {DEFAULT_FORWARD_INPUT,DEFAULT_FORWARD_LAYERS,denseForward} from './forward.ts';
import {backpropagate,applyGradients,trainOneStep} from './backprop.ts';
const near=(a,b,tolerance=1e-8)=>assert.ok(Math.abs(a-b)<tolerance, String(a)+' != '+String(b));
const clone=()=>DEFAULT_FORWARD_LAYERS.map(l=>({activation:l.activation,weights:l.weights.map(r=>[...r]),biases:[...l.biases]}));
const shift=(layers,l,n,s,amount)=>{const modified=clone();if(s===-1)modified[l].biases[n]+=amount;else modified[l].weights[n][s]+=amount;return modified;};
describe('multi-layer backprop and chain rule',()=>{
 it('matches independent hand chain calculations at output and hidden neurons',()=>{
   const r=backpropagate(DEFAULT_FORWARD_INPUT,DEFAULT_FORWARD_LAYERS,1);
   const a=1/(1+Math.exp(-.16));
   const outputDelta=(a-1)*a*(1-a);
   near(r.prediction,a);near(r.loss,.5*(a-1)**2);
   near(r.dLossDOutput,a-1);
   near(r.layers[1].neurons[0].derivative,a*(1-a));
   near(r.layers[1].neurons[0].delta,outputDelta);
   near(r.layers[1].neurons[0].weights[0],outputDelta*.3);
   near(r.layers[1].neurons[0].weights[1],outputDelta*1);
   near(r.layers[0].neurons[0].delta,1.2*outputDelta);
   near(r.layers[0].neurons[1].delta,-.5*outputDelta);
   near(r.layers[0].neurons[0].weights[1],2*1.2*outputDelta);
   near(r.layers[0].neurons[1].bias,-.5*outputDelta);
 });
 it('matches central finite differences for every weight and bias',()=>{
   const h=1e-5,base=clone(),analytical=backpropagate(DEFAULT_FORWARD_INPUT,base,1);
   for(let l=0;l<base.length;l++)for(let n=0;n<base[l].weights.length;n++){
     for(let s=0;s<base[l].weights[n].length;s++){
       const plus=backpropagate(DEFAULT_FORWARD_INPUT,shift(base,l,n,s,h),1).loss;
       const minus=backpropagate(DEFAULT_FORWARD_INPUT,shift(base,l,n,s,-h),1).loss;
       near(analytical.layers[l].neurons[n].weights[s],(plus-minus)/(2*h),1e-7);
     }
     const p=backpropagate(DEFAULT_FORWARD_INPUT,shift(base,l,n,-1,h),1).loss;
     const m=backpropagate(DEFAULT_FORWARD_INPUT,shift(base,l,n,-1,-h),1).loss;
     near(analytical.layers[l].neurons[n].bias,(p-m)/(2*h),1e-7);
   }
 });
 it('makes a real parameter update and lowers default sample loss',()=>{
   const input=clone(),start=JSON.stringify(input);
   const result=trainOneStep(DEFAULT_FORWARD_INPUT,input,1,.2);
   assert.ok(result.after.loss<result.before.loss);
   near(result.updated[1].weights[0][0],input[1].weights[0][0]-.2*result.before.layers[1].neurons[0].weights[0]);
   assert.equal(JSON.stringify(input),start,'must never mutate caller model');
   assert.equal(result.after.forward.output.length,1);
 });
 it('handles zero gradients when hidden ReLU units are inactive',()=>{
   const layers=[{weights:[[1,0]],biases:[-2],activation:'relu'},{weights:[[1]],biases:[0],activation:'sigmoid'}];
   const r=backpropagate([1,0],layers,1);
   near(r.layers[0].neurons[0].delta,0);near(r.layers[0].neurons[0].weights[0],0);
 });
 it('uses explicit zero ReLU subgradient at z=0 and rejects missing scalar output',()=>{
   const layers=[{weights:[[1]],biases:[-1],activation:'relu'},{weights:[[1]],biases:[0],activation:'sigmoid'}];
   const r=backpropagate([1],layers,1);
   near(r.layers[0].neurons[0].derivative,0);
   assert.throws(()=>backpropagate([1],[{weights:[[1],[2]],biases:[0,0],activation:'linear'}],1));
 });
 it('supports a linear output, and rejects invalid loss/update parameters',()=>{
   const r=backpropagate([2],[{weights:[[3]],biases:[0],activation:'linear'}],5);
   near(r.prediction,6);near(r.loss,.5);near(r.layers[0].neurons[0].weights[0],2);
   assert.throws(()=>backpropagate(DEFAULT_FORWARD_INPUT,DEFAULT_FORWARD_LAYERS,NaN));
   assert.throws(()=>applyGradients(DEFAULT_FORWARD_LAYERS,r.layers,.2));
   assert.throws(()=>applyGradients(DEFAULT_FORWARD_LAYERS,backpropagate(DEFAULT_FORWARD_INPUT,DEFAULT_FORWARD_LAYERS,1).layers,Infinity));
 });
 it('respects zero learning rate and remains consistent with dense forward engine',()=>{
   const input=clone();
   const r=trainOneStep(DEFAULT_FORWARD_INPUT,input,1,0);
   near(r.before.loss,r.after.loss);
   near(r.after.prediction,denseForward(DEFAULT_FORWARD_INPUT,input).output[0]);
 });
});
