/** Small, deterministic rectangular tensor demonstrations. Not a NumPy runtime. */
export type Tensor = number | Tensor[];
export const DEMO_VECTOR = [1,2,3,4];
export const DEMO_MATRIX = [[1,2,3],[4,5,6],[7,8,9]];
export const DEMO_BATCH = [DEMO_MATRIX,[[10,11,12],[13,14,15],[16,17,18]]];
export function tensorShape(data:Tensor):number[]{
  if(typeof data==='number'){
    if(!Number.isFinite(data))throw new Error('Tensor elements must be finite');
    return [];
  }
  if(!Array.isArray(data)||!data.length)throw new Error('Tensor arrays must be nonempty');
  const shape=tensorShape(data[0]);
  for(const v of data.slice(1)){
    const next=tensorShape(v);
    if(next.length!==shape.length||next.some((n,i)=>n!==shape[i]))throw new Error('Tensor must be rectangular');
  }
  return [data.length,...shape];
}
export function tensorRank(data:Tensor):number{return tensorShape(data).length;}
export function tensorAt(data:Tensor,indices:readonly number[]):number{
  const shape=tensorShape(data);
  if(indices.length!==shape.length)throw new Error('Index count must match tensor rank');
  let node:Tensor=data;
  for(let i=0;i<indices.length;i++){
    const index=indices[i];
    if(!Number.isInteger(index)||index<0||index>=shape[i]||!Array.isArray(node))throw new Error('Tensor index out of bounds');
    node=node[index];
  }
  if(typeof node!=='number')throw new Error('Tensor index did not resolve to a scalar');
  return node;
}
export function sliceMatrix(matrix:number[][],rowStart:number,rowStop:number,colStart:number,colStop:number):number[][]{
  const shape=tensorShape(matrix);
  if(shape.length!==2)throw new Error('Cropping requires a matrix');
  const valid=(a:number,b:number,n:number)=>Number.isInteger(a)&&Number.isInteger(b)&&a>=0&&b<=n&&a<b;
  if(!valid(rowStart,rowStop,shape[0])||!valid(colStart,colStop,shape[1]))throw new Error('Invalid slice bounds');
  return matrix.slice(rowStart,rowStop).map(row=>row.slice(colStart,colStop));
}
export function selectBatchSample(batch:number[][][],index:number):number[][]{
  const shape=tensorShape(batch);
  if(shape.length!==3||!Number.isInteger(index)||index<0||index>=shape[0])throw new Error('Invalid batch index');
  return batch[index].map(row=>[...row]);
}
