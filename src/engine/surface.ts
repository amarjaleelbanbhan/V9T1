export const SURFACE_DATA = [
  [-1, -1],
  [0, 1],
  [1, 3],
] as const;
export function surfaceLoss(weight: number, bias: number) {
  if (![weight, bias].every(Number.isFinite))
    throw Error("Use finite parameters");
  let loss = 0,
    dw = 0,
    db = 0;
  for (const [x, y] of SURFACE_DATA) {
    const e = weight * x + bias - y;
    loss += 0.5 * e * e;
    dw += e * x;
    db += e;
  }
  return { loss: loss / 3, dw: dw / 3, db: db / 3 };
}
export function surfacePath(
  weight: number,
  bias: number,
  rate: number,
  count: number,
) {
  if (
    ![weight, bias, rate].every(Number.isFinite) ||
    rate < 0 ||
    rate > 1.5 ||
    !Number.isInteger(count) ||
    count < 0 ||
    count > 40
  )
    throw Error("Invalid descent settings");
  const result = [];
  for (let i = 0; i <= count; i++) {
    const r = surfaceLoss(weight, bias);
    result.push({ weight, bias, ...r });
    weight -= rate * r.dw;
    bias -= rate * r.db;
  }
  return result;
}
