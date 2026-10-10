import { create } from "zustand";
import {
  activationNames,
  type Activation,
  type NeuronParameters,
} from "../engine/neuron";
import { clampStep, LAST_STEP } from "../engine/timeline";

export const DEFAULT_LAB: NeuronParameters = {
  inputs: [2, -1, 0.5],
  weights: [0.8, -0.4, 1.2],
  bias: 0.5,
  activation: "sigmoid",
};
export type LabStore = {
  missionPrevious: NeuronParameters | null;
  inputs: number[];
  weights: number[];
  bias: number;
  activation: Activation;
  step: number;
  playing: boolean;
  speed: number;
  setInput: (i: number, v: number) => void;
  setWeight: (i: number, v: number) => void;
  setBias: (v: number) => void;
  setActivation: (a: Activation) => void;
  setStep: (step: number) => void;
  setSpeed: (speed: number) => void;
  play: () => void;
  pause: () => void;
  advance: () => void;
  reset: () => void;
};
const snapshot = () => ({
  ...DEFAULT_LAB,
  inputs: [...DEFAULT_LAB.inputs],
  weights: [...DEFAULT_LAB.weights],
  step: 0,
  playing: false,
  speed: 1,
});
function recoveredLab(): Partial<LabStore> {
  try {
    const raw = sessionStorage.getItem("neurallab.recovery");
    if (!raw) return {};
    sessionStorage.removeItem("neurallab.recovery");
    const data = JSON.parse(raw);
    const valid = (p: NeuronParameters) =>
      p &&
      [p.inputs, p.weights].every(
        (a) =>
          Array.isArray(a) &&
          a.length === 3 &&
          a.every(
            (v) =>
              typeof v === "number" && Number.isFinite(v) && Math.abs(v) <= 3,
          ),
      ) &&
      typeof p.bias === "number" &&
      Number.isFinite(p.bias) &&
      Math.abs(p.bias) <= 3 &&
      activationNames.includes(p.activation);
    if (!valid(data)) return {};
    return {
      inputs: data.inputs,
      weights: data.weights,
      bias: data.bias,
      activation: data.activation,
      missionPrevious: valid(data.missionPrevious)
        ? data.missionPrevious
        : null,
    };
  } catch {
    return {};
  }
}
export const useLab = create<LabStore>((set) => ({
  ...snapshot(),
  missionPrevious: null,
  ...recoveredLab(),
  setInput: (i, v) =>
    set((s) => ({
      inputs: s.inputs.map((value, j) => (i === j ? v : value)),
      playing: false,
    })),
  setWeight: (i, v) =>
    set((s) => ({
      weights: s.weights.map((value, j) => (i === j ? v : value)),
      playing: false,
    })),
  setBias: (bias) => set({ bias, playing: false }),
  setActivation: (activation) => set({ activation, playing: false }),
  setStep: (step) => set({ step: clampStep(step), playing: false }),
  setSpeed: (speed) => set({ speed: Math.max(0.25, Math.min(2, speed)) }),
  play: () =>
    set((s) => ({ playing: true, step: s.step === LAST_STEP ? 0 : s.step })),
  pause: () => set({ playing: false }),
  advance: () =>
    set((s) => ({
      step: clampStep(s.step + 1),
      playing: s.step + 1 < LAST_STEP && s.playing,
    })),
  reset: () => set(snapshot()),
}));
