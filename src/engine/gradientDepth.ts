/** Simple scalar repeated-chain teaching model, not a trained neural network.
 * At each depth h_i = activation(weight*h_(i-1)+bias).
 * The derivative d h_depth/d h_0 equals product of local factors.
 */
import { activate, type Activation } from './neuron.ts';
export type ChainStep={layer:number;input:number;z:number;output:number;slope:number;localFactor:number;gradient:number};
export type ChainTrace={steps:ChainStep[];output:number;totalGradient:number};
export function gradientChain(depth:number,kind:Activation,weight:number,input:number,bias:number):ChainTrace{
 if(!Number.isInteger(depth)||depth<1||depth>32)throw new Error('Depth must be an integer 1..32');
 if(![weight,input,bias].every(Number.isFinite))throw new Error('Finite parameters required');
 const steps:ChainStep[]=[];let h=input,g=1;
 for(let layer=1;layer<=depth;layer++){
  const z=weight*h+bias;
  if(!Number.isFinite(z))throw new Error('Layer overflow');
  const output=activate(z,kind);
  const slope=kind==='sigmoid'?output*(1-output):kind==='tanh'?1-output*output:kind==='relu'?(z>0?1:0):1;
  const localFactor=weight*slope;g*=localFactor;
  if(![output,slope,localFactor,g].every(Number.isFinite))throw new Error('Chain gradient overflow');
  steps.push({layer,input:h,z,output,slope,localFactor,gradient:g});h=output;
 }
 return {steps,output:h,totalGradient:g};
}
