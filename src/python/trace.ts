export interface TensorSnapshot { shape:number[];rank:number;dtype:string;values:number[][];payload_bytes:number }
export interface ScalarSnapshot {value:number;type:'int'|'float'}
export interface PythonFrame {line:number;phase:'before-line'|'complete';tensor:TensorSnapshot|null;variables:Record<string,ScalarSnapshot>;stdout:string}
export interface PythonTrace {version:1;mode:'executed-python';source:string;frames:PythonFrame[]}
export type PythonRequest={example:'array';values:number[][]}|{example:'variables';values:[number,number]};
export const PYTHON_SOURCE='import numpy as np\nx = np.array(values, dtype=np.float32)\nprint(x.shape)\nprint(x.dtype)\nprint(x.nbytes)';
const bounded=(n:unknown)=>typeof n==='number'&&Number.isFinite(n)&&Math.abs(n)<=1e6;
export function validateValues(values:unknown): asserts values is number[][] {
 if(!Array.isArray(values)||values.length!==2||values.some(row=>!Array.isArray(row)||row.length!==3||row.some(n=>!bounded(n))))throw new Error('Use a 2 × 3 matrix with finite numbers between -1000000 and 1000000.');
}
export function validateScalarInputs(values:unknown): asserts values is [number,number] {
 if(!Array.isArray(values)||values.length!==2||values.some(n=>!bounded(n)))throw new Error('Enter two finite numbers between -1000000 and 1000000.');
}
