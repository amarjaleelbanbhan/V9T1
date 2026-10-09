import {describe,it} from 'node:test';
import assert from 'node:assert/strict';
import {denseForward,DEFAULT_FORWARD_INPUT,DEFAULT_FORWARD_LAYERS} from './forward.ts';
const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-12, String(a)+' != '+String(b));
describe('multi-layer forward pass',()=>{
 it('computes each contribution, hidden activation, and output independently',()=>{
  const v=denseForward(DEFAULT_FORWARD_INPUT,DEFAULT_FORWARD_LAYERS);
  const h=v.layers[0].neurons;
  near(h[0].weightedSum,.2);near(h[0].z,.3);near(h[0].output,.3);
  near(h[1].weightedSum,1.2);near(h[1].z,1);near(h[1].output,1);
  near(v.layers[1].neurons[0].weightedSum,-.14);
  near(v.layers[1].neurons[0].z,.16);
  near(v.output[0],1/(1+Math.exp(-.16)));
  assert.deepEqual(h[0].contributions,[.6,-.4]);
 });
 it('supports a different input and valid negative ReLU preactivation',()=>{
  const t=denseForward([-3,0],[{weights:[[1,2]],biases:[0],activation:'relu'}]);
  assert.equal(t.layers[0].neurons[0].z,-3);assert.deepEqual(t.output,[0]);
 });
 it('supports arbitrary fully connected layer widths',()=>{
  const t=denseForward([1,2,3],[{weights:[[1,1,1],[2,0,-1]],biases:[0,1],activation:'linear'}]);
  assert.deepEqual(t.output,[6,0]);
 });
 it('rejects invalid input, layers and sizes',()=>{
  assert.throws(()=>denseForward([],DEFAULT_FORWARD_LAYERS));
  assert.throws(()=>denseForward([1],[]));
  assert.throws(()=>denseForward([1],[{weights:[[1,2]],biases:[0],activation:'linear'}]));
  assert.throws(()=>denseForward([1],[{weights:[[1]],biases:[NaN],activation:'relu'}]));
 });
 it('rejects numerical overflows',()=>{
  assert.throws(()=>denseForward([1e308],[{weights:[[1e308]],biases:[0],activation:'linear'}]));
 });
});
