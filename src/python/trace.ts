export interface TensorSnapshot { shape:number[];rank:number;dtype:string;values:number[][];payload_bytes:number }
export interface PythonFrame {line:number;phase:'before-line'|'complete';tensor:TensorSnapshot|null;stdout:string}
export interface PythonTrace {version:1;mode:'executed-python';source:string;frames:PythonFrame[]}
export const PYTHON_SOURCE='import numpy as np\nx = np.array(values, dtype=np.float32)\nprint(x.shape)\nprint(x.dtype)\nprint(x.nbytes)';
export function validateValues(values:unknown): asserts values is number[][] {
 if(!Array.isArray(values)||values.length!==2||values.some(row=>!Array.isArray(row)||row.length!==3||row.some(n=>typeof n!=='number'||!Number.isFinite(n)||Math.abs(n)>1e6)))throw new Error('Use a 2 × 3 matrix with finite numbers between -1000000 and 1000000.');
}
