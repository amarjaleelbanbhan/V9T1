import { useState, type SetStateAction } from "react";
import { useLearning, updateLearning } from "./useLearning";
/** Resumable exploratory inputs are stored separately from course evidence and executable results. */
export function useSandboxDraft<T>(
  key: string,
  fallback: T,
  valid: (value: unknown) => value is T,
) {
  const { state, saved } = useLearning();
  const [value, setValue] = useState<T>(() => {
    try {
      const parsed = JSON.parse(state.sandboxDrafts?.[key] || "null");
      return valid(parsed) ? parsed : fallback;
    } catch {
      return fallback;
    }
  });
  const update = (action: SetStateAction<T>) => {
    const next =
      typeof action === "function" ? (action as (old: T) => T)(value) : action;
    setValue(next);
    updateLearning((old) => ({
      ...old,
      sandboxDrafts: { ...old.sandboxDrafts, [key]: JSON.stringify(next) },
    }));
  };
  return [value, update, saved] as const;
}
export const numericStrings =
  (length: number) =>
  (value: unknown): value is string[] =>
    Array.isArray(value) &&
    value.length === length &&
    value.every((v) => typeof v === "string" && v.length <= 40);
export const shortText = (value: unknown): value is string =>
  typeof value === "string" && value.length <= 100;
