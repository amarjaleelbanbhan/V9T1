/** Chain-rule reverse pass for the existing denseForward engine.
 * Loss: L = 0.5 * (yhat - target)^2 for ONE scalar output.
 * ReLU at z === 0 uses the documented zero-subgradient convention.
 */
import { denseForward, type DenseLayer, type ForwardTrace } from './forward.ts';
import type { Activation } from './neuron.ts';

export type NeuronGradient = {
  upstream: number; // dL / d activation output
  derivative: number; // d activation output / dz
  delta: number; // dL/dz = upstream * derivative
  weights: number[]; // dL/d weight[j] = delta * layerInput[j]
  bias: number; // dL/dbias = delta
};
export type LayerGradient = { neurons: NeuronGradient[] };
export type BackpropTrace = {
  forward: ForwardTrace;
  target: number;
  prediction: number;
  loss: number;
  dLossDOutput: number;
  layers: LayerGradient[];
};
function activationSlope(kind: Activation, z: number, output: number): number {
  switch (kind) {
    case 'sigmoid': return output * (1-output);
    case 'tanh': return 1-output*output;
    case 'relu': return z > 0 ? 1 : 0; // at 0, choose zero subgradient
    case 'linear': return 1;
    default: throw new Error('Unsupported activation in backward pass');
  }
}
export function backpropagate(inputs: readonly number[], layers: readonly DenseLayer[], target: number): BackpropTrace {
  if(!Number.isFinite(target))throw new Error('Target must be finite');
  const forward = denseForward(inputs,layers);
  if(forward.output.length!==1)throw new Error('Backprop lab requires a single output');
  const prediction=forward.output[0];
  const dLossDOutput=prediction-target;
  const loss=.5*dLossDOutput*dLossDOutput;
  if(!Number.isFinite(loss)||!Number.isFinite(dLossDOutput))throw new Error('Loss overflow');
  const result: LayerGradient[]=Array.from({length:layers.length},()=>({neurons:[]}));
  for(let layerIndex=layers.length-1;layerIndex>=0;layerIndex--){
    const neurons=forward.layers[layerIndex].neurons;
    const gradients:NeuronGradient[]=neurons.map((neuron,j)=>{
      const upstream=layerIndex===layers.length-1
        ? dLossDOutput
        : result[layerIndex+1].neurons.reduce((sum,next,k)=>sum+layers[layerIndex+1].weights[k][j]*next.delta,0);
      const derivative=activationSlope(neuron.activation,neuron.z,neuron.output);
      const delta=upstream*derivative;
      const weights=neuron.inputs.map(x=>delta*x);
      const bias=delta;
      if(![upstream,derivative,delta,bias,...weights].every(Number.isFinite))throw new Error('Gradient overflow');
      return {upstream,derivative,delta,weights,bias};
    });
    result[layerIndex]={neurons:gradients};
  }
  return {forward,target,prediction,loss,dLossDOutput,layers:result};
}
export function applyGradients(layers: readonly DenseLayer[], gradients: readonly LayerGradient[], learningRate:number):DenseLayer[]{
  if(!Number.isFinite(learningRate)||learningRate<0||learningRate>1)throw new Error('Learning rate must be from 0 to 1');
  if(layers.length!==gradients.length)throw new Error('Layer/gradient count mismatch');
  return layers.map((layer,l)=>{
    if(layer.weights.length!==gradients[l].neurons.length||layer.biases.length!==gradients[l].neurons.length)
      throw new Error('Neuron/gradient count mismatch');
    const weights=layer.weights.map((row,j)=>{
      const g=gradients[l].neurons[j].weights;
      if(row.length!==g.length)throw new Error('Gradient dimension mismatch');
      return row.map((w,k)=>w-learningRate*g[k]);
    });
    const biases=layer.biases.map((b,j)=>b-learningRate*gradients[l].neurons[j].bias);
    if(![...weights.flat(),...biases].every(Number.isFinite))throw new Error('Update overflow');
    return {weights,biases,activation:layer.activation};
  });
}
export function trainOneStep(inputs:readonly number[],layers:readonly DenseLayer[],target:number,learningRate:number){
  const before=backpropagate(inputs,layers,target);
  const updated=applyGradients(layers,before.layers,learningRate);
  const after=backpropagate(inputs,updated,target);
  return {before,updated,after};
}
