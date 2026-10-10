import { useEffect, useState } from "react";
import { LEARNING_KEY, parseLearning, type LearningState } from "./learning";
let current: LearningState | undefined;
const listeners = new Set<() => void>();
let saved = true;
const read = () => {
  if (!current) {
    try {
      current = parseLearning(localStorage.getItem(LEARNING_KEY));
    } catch {
      current = parseLearning(null);
      saved = false;
    }
  }
  return current;
};
export function updateLearning(update: (old: LearningState) => LearningState) {
  current = update(read());
  try {
    localStorage.setItem(LEARNING_KEY, JSON.stringify(current));
    saved = true;
  } catch {
    saved = false;
  }
  listeners.forEach((fn) => fn());
}
export function useLearning() {
  const [state, setState] = useState(read);
  const [stored, setStored] = useState(saved);
  useEffect(() => {
    const fn = () => {
      setState(read());
      setStored(saved);
    };
    listeners.add(fn);
    const sync = (e: StorageEvent) => {
      if (e.key === LEARNING_KEY) {
        current = parseLearning(e.newValue);
        fn();
      }
    };
    window.addEventListener("storage", sync);
    return () => {
      listeners.delete(fn);
      window.removeEventListener("storage", sync);
    };
  }, []);
  return { state, saved: stored, update: updateLearning };
}
