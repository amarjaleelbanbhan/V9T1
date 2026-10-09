import { activate, type Activation } from './neuron.ts';
export type DenseLayer = {
  weights: number[][]; // rows = destination neurons, columns = source neurons
  biases: number[];
  activation: Activation;
};
export type DenseNeuronTrace = {
  inputs: number[];
  weights: number[];
  contributions: number[];
  weightedSum: number;
  bias: number;
  z: number;
  output: number;
  activation: Activation;
};
export type DenseLayerTrace = { input: number[]; neurons: DenseNeuronTrace[]; output: number[] };
export type ForwardTrace = { input: number[]; layers: DenseLayerTrace[]; output: number[] };
export const DEFAULT_FORWARD_INPUT = [1, 2];
export const DEFAULT_FORWARD_LAYERS: DenseLayer[] = [
  { weights: [[0.6,-0.2],[-0.4,0.8]], biases: [0.1,-0.2], activation:'relu' },
  { weights: [[1.2,-0.5]], biases: [0.3], activation:'sigmoid' }
];
export function denseForward(inputs:readonly number[],layers:readonly DenseLayer[]):ForwardTrace {
  if(!inputs.length || !layers.length || inputs.some(x=>!Number.isFinite(x)))throw new Error('Forward pass requires finite input and nonempty layers');
  let values=[...inputs];
  const traces:DenseLayerTrace[]=[];
  for(const layer of layers){
    if(!layer.weights.length||layer.weights.length!==layer.biases.length)throw new Error('Weights and biases must agree in size');
    const neurons:DenseNeuronTrace[]=layer.weights.map((weights,i)=>{
      if(weights.length!==values.length || !Number.isFinite(layer.biases[i]) || weights.some(w=>!Number.isFinite(w)))
        throw new Error('Layer has invalid dimensions or nonfinite parameters');
      const contributions=weights.map((w,j)=>w*values[j]);
      const weightedSum=contributions.reduce((a,b)=>a+b,0);
      const z=weightedSum+layer.biases[i];
      if(!Number.isFinite(z))throw new Error('Dense layer overflow');
      const output=activate(z,layer.activation);
      if(!Number.isFinite(output))throw new Error('Dense output overflow');
      return {inputs:[...values],weights:[...weights],contributions,weightedSum,bias:layer.biases[i],z,output,activation:layer.activation};
    });
    const output=neurons.map(n=>n.output);
    traces.push({input:[...values],neurons,output});
    values=output;
  }
  return {input:[...inputs],layers:traces,output:values};
}
