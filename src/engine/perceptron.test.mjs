import{describe,it}from'node:test';
import assert from'node:assert/strict';
import{perceptron,logicTable,GATE_PRESETS,BINARY_INPUTS}from'./perceptron.ts';
describe('perceptron step activation and logic gates',()=>{
 it('AND preset produces all four correct binary outputs',()=>{
  const p=GATE_PRESETS.and,table=logicTable(p.weights,p.bias,'and');
  assert.deepEqual(table.map(t=>t.output),[0,0,0,1]);
  assert.equal(table.every(t=>t.correct),true);
 });
 it('OR preset produces all four correct binary outputs',()=>{
  const p=GATE_PRESETS.or,table=logicTable(p.weights,p.bias,'or');
  assert.deepEqual(table.map(t=>t.output),[0,1,1,1]);
  assert.equal(table.every(t=>t.correct),true);
 });
 it('includes threshold zero in positive class',()=>{
  assert.deepEqual(perceptron([0,0],[1,1],0),{z:0,output:1});
 });
 it('shows bias can break a previously correct gate',()=>{
  const table=logicTable([1,1],-.2,'and');
  assert.equal(table.filter(t=>t.correct).length,2);
 });
 it('rejects invalid vectors and overflow',()=>{
  assert.throws(()=>perceptron([1],[1,1],0));
  assert.throws(()=>perceptron([1,0],[Infinity,0],0));
  assert.throws(()=>perceptron([1e308,1e308],[1e308,1e308],0));
  assert.equal(BINARY_INPUTS.length,4);
 });
});
