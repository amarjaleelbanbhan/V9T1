/** Binary step perceptron teaching engine. Zero is included in the positive class. */
export type Bit = 0|1;
export type LogicGate = 'and'|'or';
export type LogicExample = {inputs:[Bit,Bit];z:number;output:Bit;target:Bit;correct:boolean};
export const BINARY_INPUTS: readonly [Bit,Bit][]=[[0,0],[0,1],[1,0],[1,1]];
export const GATE_PRESETS: Record<LogicGate,{weights:[number,number];bias:number}>={
 and:{weights:[1,1],bias:-1.5},
 or:{weights:[1,1],bias:-.5}
};
export function perceptron(inputs:readonly number[],weights:readonly number[],bias:number):{z:number;output:Bit}{
 if(inputs.length!==2||weights.length!==2||![...inputs,...weights,bias].every(Number.isFinite))
   throw new Error('Perceptron needs two finite inputs, weights and bias');
 const z=inputs[0]*weights[0]+inputs[1]*weights[1]+bias;
 if(!Number.isFinite(z))throw new Error('Perceptron overflow');
 return {z,output:z>=0?1:0};
}
export function gateTarget(inputs:readonly [Bit,Bit],gate:LogicGate):Bit{
 return gate==='and'?(inputs[0]===1&&inputs[1]===1?1:0):(inputs[0]===1||inputs[1]===1?1:0);
}
export function logicTable(weights:readonly number[],bias:number,gate:LogicGate):LogicExample[]{
 return BINARY_INPUTS.map(inputs=>{
  const actual=perceptron(inputs,weights,bias);
  const target=gateTarget(inputs,gate);
  return {inputs,z:actual.z,output:actual.output,target,correct:actual.output===target};
 });
}
