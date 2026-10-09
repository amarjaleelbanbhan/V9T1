/** Mathematical reference for scalar activations and vector Softmax. */
import { activate } from './neuron.ts';
export type ScalarActivation = 'sigmoid' | 'tanh' | 'relu' | 'leaky-relu';
export const SCALAR_ACTIVATIONS: readonly ScalarActivation[] = ['sigmoid','tanh','relu','leaky-relu'];
export function scalarActivation(z:number,kind:ScalarActivation,alpha=0.1){
  if (!Number.isFinite(z)||!Number.isFinite(alpha)||alpha<=0||alpha>=1) throw new Error('Finite input and slope 0 < alpha < 1 required');
  if(kind==='leaky-relu')return z<0?alpha*z:z;
  return activate(z,kind);
}
export function scalarDerivative(z:number,kind:ScalarActivation,alpha=0.1):number|null{
  const a=scalarActivation(z,kind,alpha);
  switch(kind){
    case 'sigmoid':return a*(1-a);
    case 'tanh':return 1-a*a;
    case 'relu':return z===0?null:z>0?1:0;
    case 'leaky-relu':return z===0?null:z>0?1:alpha;
  }
}
export function stableSoftmax(logits:readonly number[]):number[]{
  if(!logits.length||!logits.every(Number.isFinite))throw new Error('Softmax requires a nonempty finite vector');
  const max=Math.max(...logits);
  const exp=logits.map(v=>Math.exp(v-max));
  const total=exp.reduce((a,b)=>a+b,0);
  return exp.map(v=>v/total);
}
