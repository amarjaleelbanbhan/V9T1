import { useEffect, useState } from "react";

export const workspaceIds = [
  "intro",
  "neuron",
  "activation",
  "propagation",
  "tensor",
  "perceptron",
  "loss",
  "backprop",
  "gradient-depth",
  "library",
  "python",
  "python-basics",
  "python-flow",
  "beginner",
  "training-project",
  "dashboard",
  "python-workshop",
  "math-workshop",
] as const;
export type ActiveLesson = (typeof workspaceIds)[number];
export function workspaceFromHash(hash: string): ActiveLesson | undefined {
  const id = hash.match(/^#\/lab\/([a-z-]+)(?:\?.*)?$/)?.[1];
  return workspaceIds.includes(id as ActiveLesson)
    ? (id as ActiveLesson)
    : undefined;
}
function initialWorkspace(): ActiveLesson {
  const linked = workspaceFromHash(window.location.hash);
  if (linked) return linked;
  try {
    const saved = localStorage.getItem("neurallab.workspace");
    if (workspaceIds.includes(saved as ActiveLesson))
      return saved as ActiveLesson;
  } catch {
    /* A private browser can still use every workspace. */
  }
  return "neuron";
}
/** The URL owns navigation; storage is only a fallback for a new visit. */
export function useWorkspace() {
  const [active, setActive] = useState<ActiveLesson>(initialWorkspace);
  useEffect(() => {
    const sync = () => {
      const id = workspaceFromHash(window.location.hash);
      if (id) setActive(id);
    };
    window.addEventListener("hashchange", sync);
    window.addEventListener("popstate", sync);
    return () => {
      window.removeEventListener("hashchange", sync);
      window.removeEventListener("popstate", sync);
    };
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem("neurallab.workspace", active);
    } catch {}
    if (!workspaceFromHash(window.location.hash)) {
      history.replaceState(null, "", `#/lab/${active}`);
    }
  }, [active]);
  const navigate = (id: ActiveLesson) => {
    if (id !== active) history.pushState(null, "", `#/lab/${id}`);
    setActive(id);
  };
  return [active, navigate] as const;
}

/** Validated nested selection participates in the same hash history as workspaces. */
export function useWorkspaceSelection(
  workspace: ActiveLesson,
  parameter: string,
  valid: readonly string[],
  fallback: string,
) {
  const read = () => {
    const value = new URLSearchParams(
      window.location.hash.split("?")[1] || "",
    ).get(parameter);
    return value && valid.includes(value) ? value : fallback;
  };
  const [selection, setSelection] = useState(read);
  useEffect(() => {
    const sync = () => setSelection(read());
    window.addEventListener("hashchange", sync);
    window.addEventListener("popstate", sync);
    return () => {
      window.removeEventListener("hashchange", sync);
      window.removeEventListener("popstate", sync);
    };
  }, [workspace, parameter, fallback]);
  const select = (value: string) => {
    if (!valid.includes(value)) return;
    const hash = `#/lab/${workspace}?${parameter}=${encodeURIComponent(value)}`;
    if (window.location.hash !== hash) history.pushState(null, "", hash);
    setSelection(value);
  };
  return [selection, select] as const;
}
