/** Lecture 04: analytic gradient descent on two illustrative, one-parameter losses. */
export type LossMode='half-squared'|'weight-squared';
export type LossOptions={mode:LossMode;input:number;target:number;bias:number;learningRate:number;initialWeight:number;updates:number};
export type DescentStep={iteration:number;weight:number;prediction:number|null;error:number|null;loss:number;gradient:number;nextWeight:number|null};
function finite(values:readonly number[]){return values.every(Number.isFinite);}
export function evaluateLoss(mode:LossMode,weight:number,input=1,target=1,bias=0){
  if(!finite([weight,input,target,bias]))throw new Error('All loss parameters must be finite');
  if(mode==='weight-squared'){
    const loss=weight*weight,gradient=2*weight;
    if(!finite([loss,gradient]))throw new Error('Loss arithmetic overflow');
    return {prediction:null,error:null,loss,gradient};
  }
  if(mode!=='half-squared')throw new Error('Unknown loss mode');
  const prediction=weight*input+bias,error=prediction-target,loss=.5*error*error,gradient=error*input;
  if(!finite([prediction,error,loss,gradient]))throw new Error('Loss arithmetic overflow');
  return {prediction,error,loss,gradient};
}
export function descentTrace(p:LossOptions):DescentStep[]{
  if(!finite([p.input,p.target,p.bias,p.learningRate,p.initialWeight])||
     p.learningRate<0||p.learningRate>1||!Number.isInteger(p.updates)||p.updates<0||p.updates>30)
    throw new Error('Invalid gradient descent parameters');
  const trace:DescentStep[]=[];
  let weight=p.initialWeight;
  for(let i=0;i<=p.updates;i++){
    const {prediction,error,loss,gradient}=evaluateLoss(p.mode,weight,p.input,p.target,p.bias);
    const nextWeight=i===p.updates?null:weight-p.learningRate*gradient;
    if(nextWeight!==null&&!Number.isFinite(nextWeight))throw new Error('Gradient update overflow');
    trace.push({iteration:i,weight,prediction,error,loss,gradient,nextWeight});
    if(nextWeight!==null)weight=nextWeight;
  }
  return trace;
}
