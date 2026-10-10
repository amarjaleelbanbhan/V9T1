export type Optimizer='sgd'|'momentum'|'adam';
export interface TrainingConfig {rate:number;epochs:number;batchSize:number;seed:number;shuffle:boolean;decay:number;optimizer:Optimizer;patience:number}
export interface Point {id:string;x:number;y:number}
export interface Model {w:number;b:number}
export interface BatchEvent {epoch:number;ids:string[];before:Model;predictions:number[];targets:number[];gw:number;gb:number;after:Model}
export interface EpochEvent {epoch:number;training:number;validation:number;model:Model}
export interface TrainingRun {config:TrainingConfig;train:Point[];validation:Point[];test:Point[];batches:BatchEvent[];history:EpochEvent[];best:Model;bestEpoch:number;initial:Model;stopped:boolean;baseline:number}
export const defaultConfig:TrainingConfig={rate:.05,epochs:60,batchSize:2,seed:42,shuffle:true,decay:0,optimizer:'sgd',patience:0};
function random(seed:number){let state=seed>>>0;return ()=>{state=(Math.imul(1664525,state)+1013904223)>>>0;return state/4294967296;};}
export function splitData(seed:number){const r=random(seed);const make=(xs:number[],prefix:string)=>xs.map((x,i)=>({id:prefix+i,x,y:2*x+1+(r()-.5)*.08}));return {train:make([-1,-.6,-.2,.2,.6,1],'train-'),validation:make([-.9,-.3,.3,.9],'val-'),test:make([-.8,-.4,0,.4,.8],'test-')};}
export function previewFirstBatch(config:TrainingConfig){if(!Number.isInteger(config.seed)||config.seed<0||config.seed>0xffffffff||!Number.isInteger(config.batchSize)||config.batchSize<1||config.batchSize>6)return [];const rows=[...splitData(config.seed).train],r=random(config.seed^0x12345678);if(config.shuffle)for(let i=rows.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[rows[i],rows[j]]=[rows[j],rows[i]];}return rows.slice(0,config.batchSize);}
export function evaluate(points:Point[],model:Model){if(!points.length)throw Error('Evaluation requires data.');const values=points.map(p=>.5*(model.w*p.x+model.b-p.y)**2);const result=values.reduce((a,b)=>a+b,0)/points.length;if(!Number.isFinite(result))throw Error('Nonfinite loss; stop and inspect the first failing update.');return result;}
export function batchGradient(points:Point[],model:Model,decay=0){if(!points.length||![model.w,model.b,decay,...points.flatMap(p=>[p.x,p.y])].every(Number.isFinite)||decay<0)throw Error('Gradient calculation requires a nonempty finite batch and nonnegative penalty.');const errors=points.map(p=>model.w*p.x+model.b-p.y);const gw=errors.reduce((s,e,i)=>s+e*points[i].x,0)/points.length+decay*model.w;const gb=errors.reduce((s,e)=>s+e,0)/points.length;return {gw,gb};}
export function trainProject(config:TrainingConfig):TrainingRun{
 if(!Number.isFinite(config.rate)||config.rate<=0||config.rate>2||!Number.isInteger(config.epochs)||config.epochs<1||config.epochs>200||!Number.isInteger(config.batchSize)||config.batchSize<1||config.batchSize>6||!Number.isInteger(config.seed)||config.seed<0||config.seed>0xffffffff||!Number.isFinite(config.decay)||config.decay<0||config.decay>1||!['sgd','momentum','adam'].includes(config.optimizer)||!Number.isInteger(config.patience)||config.patience<0||config.patience>20||typeof config.shuffle!=='boolean')throw Error('Use rate (0,2], epochs 1–200, batch 1–6, seed 0–4294967295, decay 0–1 and patience 0–20.');
 const data=splitData(config.seed),r=random(config.seed^0x12345678),initial={w:-.5,b:0},model={...initial};let mw=0,mb=0,vw=0,vb=0,t=0,best={...model},bestEpoch=0,bestLoss=evaluate(data.validation,model),wait=0,stopped=false;
 const batches:BatchEvent[]=[],history:EpochEvent[]=[{epoch:0,training:evaluate(data.train,model),validation:bestLoss,model:{...model}}];
 for(let epoch=1;epoch<=config.epochs;epoch++){
  const rows=[...data.train];if(config.shuffle)for(let i=rows.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[rows[i],rows[j]]=[rows[j],rows[i]];}
  for(let start=0;start<rows.length;start+=config.batchSize){const batch=rows.slice(start,start+config.batchSize),before={...model},predictions=batch.map(p=>model.w*p.x+model.b),{gw,gb}=batchGradient(batch,model,config.decay);t++;
   if(config.optimizer==='sgd'){model.w-=config.rate*gw;model.b-=config.rate*gb;}
   else if(config.optimizer==='momentum'){mw=.9*mw+gw;mb=.9*mb+gb;model.w-=config.rate*mw;model.b-=config.rate*mb;}
   else {mw=.9*mw+.1*gw;mb=.9*mb+.1*gb;vw=.999*vw+.001*gw*gw;vb=.999*vb+.001*gb*gb;model.w-=config.rate*(mw/(1-.9**t))/(Math.sqrt(vw/(1-.999**t))+1e-8);model.b-=config.rate*(mb/(1-.9**t))/(Math.sqrt(vb/(1-.999**t))+1e-8);}
   if(![model.w,model.b,gw,gb].every(Number.isFinite)||Math.max(Math.abs(model.w),Math.abs(model.b))>1e8)throw Error('Unstable update; lower the learning rate and inspect gradients. No completed run is claimed.');
   batches.push({epoch,ids:batch.map(p=>p.id),before,predictions,targets:batch.map(p=>p.y),gw,gb,after:{...model}});
  }
  const training=evaluate(data.train,model),validation=evaluate(data.validation,model);history.push({epoch,training,validation,model:{...model}});
  if(validation<bestLoss-1e-10){bestLoss=validation;best={...model};bestEpoch=epoch;wait=0;}else wait++;
  if(config.patience&&wait>=config.patience){stopped=true;break;}
 }
 const yMean=data.train.reduce((s,p)=>s+p.y,0)/data.train.length;return {config:{...config},...data,batches,history,best,bestEpoch,initial,stopped,baseline:evaluate(data.test,{w:0,b:yMean})};
}
