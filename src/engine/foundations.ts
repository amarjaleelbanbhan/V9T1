/** Week 1: deterministic classification and regression teaching experiments. */
export const CLASSIFICATION_SAMPLES = [
  { score: 0.1, label: 0 }, { score: 0.28, label: 0 },
  { score: 0.42, label: 0 }, { score: 0.6, label: 1 },
  { score: 0.76, label: 1 }, { score: 0.92, label: 1 }
] as const;
export const REGRESSION_SAMPLES = [
  { x: 0, y: 1 }, { x: 1, y: 2 }, { x: 2, y: 3 },
  { x: 3, y: 4 }, { x: 4, y: 5 }
] as const;

function valid(value: number): boolean { return Number.isFinite(value); }
export function evaluateClassification(
  scores: readonly number[], labels: readonly number[], threshold: number
) {
  if (!scores.length || scores.length !== labels.length || !valid(threshold) || threshold < 0 || threshold > 1 ||
      scores.some(v => !valid(v) || v < 0 || v > 1) || labels.some(v => v !== 0 && v !== 1)) {
    throw new Error('Classification requires valid scores, binary labels and a threshold from 0 to 1');
  }
  const predictions = scores.map(score => Number(score >= threshold));
  const correct = predictions.reduce((n, predicted, i) => n + Number(predicted === labels[i]), 0);
  const tp = predictions.filter((p,i)=>p===1 && labels[i]===1).length;
  const tn = predictions.filter((p,i)=>p===0 && labels[i]===0).length;
  const fp = predictions.filter((p,i)=>p===1 && labels[i]===0).length;
  const fn = predictions.filter((p,i)=>p===0 && labels[i]===1).length;
  const precision=tp+fp===0?null:tp/(tp+fp);
  const recall=tp+fn===0?null:tp/(tp+fn);
  return {predictions,correct,total:labels.length,accuracy:correct/labels.length,tp,tn,fp,fn,precision,recall};
}
export function evaluateRegression(
  xs: readonly number[], targets: readonly number[], slope: number, intercept: number
) {
  if (!xs.length || xs.length !== targets.length || ![...xs,...targets,slope,intercept].every(valid)) {
    throw new Error('Regression requires matched finite inputs and targets');
  }
  const predictions = xs.map(x=>slope*x+intercept);
  if (!predictions.every(valid)) throw new Error('Regression prediction overflow');
  const errors = predictions.map((p,i)=>p-targets[i]);
  const mae=errors.reduce((sum,e)=>sum+Math.abs(e),0)/errors.length;
  const mse=errors.reduce((sum,e)=>sum+e*e,0)/errors.length;
  if (![mae,mse].every(valid)) throw new Error('Regression metric overflow');
  return {predictions,errors,mae,mse};
}
