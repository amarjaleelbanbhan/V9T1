/** Deterministic educational neuron, independent of React and the renderer. */
export type Activation = 'sigmoid' | 'tanh' | 'relu' | 'linear';
export type NeuronParameters = {
  inputs: readonly number[];
  weights: readonly number[];
  bias: number;
  activation: Activation;
};
export type NeuronTrace = {
  contributions: number[];
  weightedSum: number;
  bias: number;
  preActivation: number;
  output: number;
  activation: Activation;
};

export const activationNames: readonly Activation[] = ['sigmoid', 'tanh', 'relu', 'linear'];

export function activate(z: number, kind: Activation): number {
  switch (kind) {
    case 'sigmoid': {
      // Two branches avoid overflows for extreme negative arguments.
      const exp = Math.exp(-Math.abs(z));
      return z >= 0 ? 1 / (1 + exp) : exp / (1 + exp);
    }
    case 'tanh': return Math.tanh(z);
    case 'relu': return Math.max(0, z);
    case 'linear': return z;
    default: throw new Error('Unsupported activation function');
  }
}

export function computeNeuron(p: NeuronParameters): NeuronTrace {
  if (p.inputs.length === 0 || p.inputs.length !== p.weights.length) {
    throw new Error('Inputs and weights must have the same nonzero length');
  }
  if (![...p.inputs, ...p.weights, p.bias].every(Number.isFinite)) {
    throw new Error('Neuron parameters must be finite numbers');
  }
  const contributions = p.inputs.map((value, index) => value * p.weights[index]);
  const weightedSum = contributions.reduce((acc, value) => acc + value, 0);
  const preActivation = weightedSum + p.bias;
  if (!Number.isFinite(preActivation)) throw new Error('Neuron calculation overflow');
  return {
    contributions, weightedSum, bias: p.bias, preActivation,
    output: activate(preActivation, p.activation), activation: p.activation,
  };
}

export function formatNumber(value: number): string {
  return Math.abs(value) < 0.0005 ? '0' : Number(value.toFixed(3)).toString();
}
