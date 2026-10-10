/** Bounded exercise contracts, distinct from whether an edited program matches a prediction. */
export function validateWorkshop(
  index: number,
  result: Record<string, unknown>,
): boolean {
  const close = (value: unknown, expected: number) =>
    typeof value === "number" &&
    Number.isFinite(value) &&
    Math.abs(value - expected) < 1e-6;
  if (index === 0)
    return (
      close(result.output, 3.1) &&
      close(result.z, 3.1) &&
      Array.isArray(result.contributions) &&
      result.contributions.length === 3 &&
      result.contributions.every((v, i) => close(v, [1.6, 0.4, 0.6][i]))
    );
  if (index === 1)
    return close(result.output, 1.4) && close(result.gradient, -4);
  if (index === 2)
    return (
      close(result.output, 4) &&
      Array.isArray(result.cells) &&
      result.cells.length === 2 &&
      result.cells.every(
        (row, i) =>
          Array.isArray(row) &&
          row.length === 2 &&
          row.every((value, j) =>
            close(
              value,
              [
                [0, 2],
                [2, 4],
              ][i][j],
            ),
          ),
      )
    );
  return false;
}
