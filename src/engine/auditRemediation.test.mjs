import {test} from 'node:test';
import assert from 'node:assert/strict';
import {learningBackup,parseBackup} from '../course/backup.ts';
import {emptyLearning,parseLearning} from '../course/learning.ts';
import {scalarActivation} from './activationLab.ts';
import {sliceMatrix,tensorShape} from './tensor.ts';
import {BINARY_INPUTS,perceptron} from './perceptron.ts';
import {surfaceLoss} from './surface.ts';
test('sandbox drafts migrate through v1 backups without awarding course evidence',()=>{
 const state={...emptyLearning(),sandboxDrafts:{'basics-inputs':'["3","-2"]','project-direction':'"increase"',unknown:'injected'}};
 const restored=parseBackup(JSON.stringify(learningBackup(state,{getItem:()=>null})));
 assert.equal(restored.learning.sandboxDrafts['basics-inputs'],'["3","-2"]');
 assert.equal(restored.learning.sandboxDrafts.unknown,undefined);
 assert.deepEqual(restored.learning.history,[]);
 assert.deepEqual(restored.progress,{});
 assert.equal(parseBackup(JSON.stringify(emptyLearning())).learning.version,1);
 const raw={...emptyLearning(),sandboxDrafts:{'flow-guess':'x'.repeat(9000),'flow-numbers':42}};
 assert.equal(parseLearning(JSON.stringify(raw)).sandboxDrafts['flow-guess'].length,8000);
 assert.equal(parseLearning(JSON.stringify(raw)).sandboxDrafts['flow-numbers'],undefined);
});
test('fresh transfer tasks and contour labels agree with existing numerical engines',()=>{
 const matrix=Array.from({length:4},(_,i)=>Array.from({length:5},(_,j)=>i*5+j));
 assert.deepEqual(tensorShape(sliceMatrix(matrix,1,4,2,4)),[3,2]);
 assert.equal(scalarActivation(-3.5,'leaky-relu'),-.35000000000000003);
 for(const [w,b] of [[0,0],[2,1],[3,-1]])assert.ok(Math.abs(surfaceLoss(w,b).loss-((w-2)**2/3+(b-1)**2/2))<1e-12);
 for(const w1 of [-2,-1,0,1,2])for(const w2 of [-2,-1,0,1,2])for(const b of [-2,-1,0,1,2])assert.ok(BINARY_INPUTS.some(input=>perceptron(input,[w1,w2],b).output!==Number(input[0]!==input[1])));
});

test('workshop contracts reject a guessed output without the required calculation fields',async()=>{
 const {validateWorkshop}=await import('./workshopValidation.ts');
 assert.equal(validateWorkshop(0,{output:3.1}),false);
 assert.equal(validateWorkshop(0,{output:3.1,z:3.1,contributions:[1.6,.4,.6]}),true);
 assert.equal(validateWorkshop(1,{output:1.4,gradient:4}),false);
 assert.equal(validateWorkshop(1,{output:1.4,gradient:-4}),true);
 assert.equal(validateWorkshop(2,{output:4,cells:[[0,2],[2,4]]}),true);
 assert.equal(validateWorkshop(2,{output:4,cells:[[99,2],[2,4]]}),false);
});
