import {test} from 'node:test';import assert from 'node:assert/strict';import {validateValues} from '../python/trace.ts';
test('Python matrix boundary accepts numeric input and rejects arbitrary or unbounded values',()=>{validateValues([[1,2,3],[4,5,6]]);for(const v of [null,[[1,2],[3,4]],[[1,2,3],[4,5,Infinity]],[[1,2,3],[4,5,1000001]],[[1,2,3],[4,5,'import os']]])assert.throws(()=>validateValues(v));});
import {validateScalarInputs} from '../python/trace.ts';
test('fixed scalar program rejects wrong shapes, nonfinite numbers and source strings',()=>{validateScalarInputs([-2,4]);validateScalarInputs([.25,0]);for(const v of [[],[1],[1,2,3],[Infinity,2],[1000001,2],['print(1)',2],[null,2]])assert.throws(()=>validateScalarInputs(v));});
import {validateSequence} from '../python/trace.ts';
test('bounded Python sequences reject malformed data before execution',()=>{validateSequence([2,-1,3]);for(const v of [[],[1,2],[1,2,3,4],[1,2,NaN],[1,2,'self.total=99'],[1,2,1000001]])assert.throws(()=>validateSequence(v));});
