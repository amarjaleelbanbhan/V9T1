import {describe,it} from 'node:test';
import assert from 'node:assert/strict';
import {tensorRank,tensorShape,tensorAt,sliceMatrix,selectBatchSample,DEMO_BATCH,DEMO_MATRIX} from './tensor.ts';
describe('tensor fundamentals',()=>{
 it('calculates scalar, vector, matrix and stack shapes',()=>{
  assert.deepEqual(tensorShape(7),[]);
  assert.deepEqual(tensorShape([1,2,3]),[3]);
  assert.deepEqual(tensorShape(DEMO_MATRIX),[3,3]);
  assert.deepEqual(tensorShape(DEMO_BATCH),[2,3,3]);
  assert.equal(tensorRank(DEMO_BATCH),3);
 });
 it('distinguishes vector length from rank',()=>{
  assert.equal(tensorRank([1,2,3,4]),1);
  assert.deepEqual(tensorShape([1,2,3,4]),[4]);
 });
 it('indexes values along all specified axes',()=>{
  assert.equal(tensorAt(DEMO_BATCH,[1,2,1]),17);
  assert.equal(tensorAt(DEMO_MATRIX,[0,2]),3);
  assert.throws(()=>tensorAt(DEMO_BATCH,[2,0,0]));
  assert.throws(()=>tensorAt(DEMO_MATRIX,[0]));
 });
 it('slices a matrix using exclusive stop indices',()=>{
  assert.deepEqual(sliceMatrix(DEMO_MATRIX,1,3,0,2),[[4,5],[7,8]]);
  assert.deepEqual(sliceMatrix(DEMO_MATRIX,0,1,2,3),[[3]]);
 });
 it('selects a batch sample without mutating the original',()=>{
  const sample=selectBatchSample(DEMO_BATCH,1);
  assert.deepEqual(sample,[[10,11,12],[13,14,15],[16,17,18]]);
  sample[0][0]=999;assert.equal(DEMO_BATCH[1][0][0],10);
 });
 it('rejects ragged tensors, NaN and bad slice bounds',()=>{
  assert.throws(()=>tensorShape([[1,2],[3]]));
  assert.throws(()=>tensorShape([NaN]));
  assert.throws(()=>tensorShape([]));
  assert.throws(()=>sliceMatrix(DEMO_MATRIX,1,1,0,1));
  assert.throws(()=>sliceMatrix(DEMO_MATRIX,0,3,1,4));
  assert.throws(()=>selectBatchSample(DEMO_BATCH,-1));
 });
});
