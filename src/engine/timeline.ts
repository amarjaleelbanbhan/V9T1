export const TIMELINE = [
  { label: 'Read inputs', short: 'INPUT', explanation: 'Start with the three input values.' },
  { label: 'Multiply weights', short: 'MULTIPLY', explanation: 'Multiply each input by the weight on its connection.' },
  { label: 'Add contributions', short: 'SUM', explanation: 'Add the weighted contributions together.' },
  { label: 'Add bias', short: 'BIAS', explanation: 'Add bias to the weighted sum to get the pre-activation value z.' },
  { label: 'Apply activation', short: 'ACTIVATE', explanation: 'Pass z through the selected activation function.' },
  { label: 'Inspect output', short: 'OUTPUT', explanation: 'Read the final result and test another parameter.' },
] as const;
export const LAST_STEP = TIMELINE.length - 1;
export function clampStep(value: number) { return Math.max(0, Math.min(LAST_STEP, Math.round(value))); }
