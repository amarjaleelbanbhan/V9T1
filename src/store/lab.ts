import { create } from 'zustand';
import type { Activation, NeuronParameters } from '../engine/neuron';
import { clampStep, LAST_STEP } from '../engine/timeline';

export const DEFAULT_LAB: NeuronParameters = {
  inputs: [2, -1, 0.5], weights: [0.8, -0.4, 1.2], bias: 0.5, activation: 'sigmoid',
};
export type LabStore = {
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
const snapshot = () => ({ ...DEFAULT_LAB, inputs: [...DEFAULT_LAB.inputs], weights: [...DEFAULT_LAB.weights], step: 0, playing: false, speed: 1 });
export const useLab = create<LabStore>((set) => ({
  ...snapshot(),
  setInput: (i, v) => set((s) => ({ inputs: s.inputs.map((value,j) => i === j ? v : value), playing:false })),
  setWeight: (i, v) => set((s) => ({ weights: s.weights.map((value,j) => i === j ? v : value), playing:false })),
  setBias: (bias) => set({ bias, playing:false }),
  setActivation: (activation) => set({ activation, playing:false }),
  setStep: (step) => set({step:clampStep(step),playing:false}),
  setSpeed: (speed) => set({speed: Math.max(.25,Math.min(2,speed))}),
  play: () => set(s => ({playing:true,step:s.step===LAST_STEP ? 0 : s.step})),
  pause: () => set({playing:false}),
  advance: () => set(s=>({step:clampStep(s.step+1),playing:s.step+1<LAST_STEP && s.playing})),
  reset: () => set(snapshot()),
}));
