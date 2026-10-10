import type { ExecutionPhase } from "./usePythonProgram";
import { useEffect, useRef, useState } from "react";
import {
  validateScalarInputs,
  validateSequence,
  validateValues,
  type PythonRequest,
  type PythonTrace,
} from "./trace";
export function usePythonExecution() {
  const [phase, setPhase] = useState<ExecutionPhase>("idle");
  const [trace, setTrace] = useState<PythonTrace | null>(null);
  const [status, setStatus] = useState(
    "Ready. First run downloads the Python runtime.",
  );
  const [busy, setBusy] = useState(false);
  const worker = useRef<Worker | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stop = () => {
    worker.current?.terminate();
    worker.current = null;
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
  };
  useEffect(
    () => () => {
      worker.current?.terminate();
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );
  const reset = () => {
    setPhase("invalidated");
    stop();
    setTrace(null);
    setBusy(false);
    setStatus("Ready. Inputs changed; run again to inspect new values.");
  };
  const cancel = () => {
    setPhase("canceled");
    stop();
    setTrace(null);
    setBusy(false);
    setStatus("Canceled. Worker and runtime discarded.");
  };
  const run = (request: PythonRequest) => {
    stop();
    setTrace(null);
    try {
      if (request.example === "array") validateValues(request.values);
      else if (request.example === "variables")
        validateScalarInputs(request.values);
      else validateSequence(request.values);
      setPhase("loading");
      setBusy(true);
      setStatus("Loading pinned Pyodide 0.27.7 and executing Python…");
      const w = new Worker(`${import.meta.env.BASE_URL}python-worker.js`);
      worker.current = w;
      w.onmessage = ({ data }) => {
        if (worker.current !== w) return;
        if (data.ready) {
          setPhase("executing");
          setStatus("Executing Python and capturing events…");
          return;
        }
        stop();
        setBusy(false);
        setPhase(data.error ? "failed" : "completed");
        if (data.error) {
          setStatus(data.error);
          return;
        }
        setTrace(data.trace);
        setStatus("Executed Python. Step through captured line events.");
      };
      w.onerror = () => {
        if (worker.current !== w) return;
        stop();
        setBusy(false);
        setPhase("failed");
        setStatus("Runtime could not load. Check network access and retry.");
      };
      timer.current = setTimeout(() => {
        stop();
        setBusy(false);
        setPhase("failed");
        setStatus(
          "Stopped after 90 seconds. No result claimed; retry when runtime downloads are available.",
        );
      }, 90_000);
      w.postMessage(request);
    } catch (e) {
      setPhase("failed");
      setBusy(false);
      setStatus(String(e));
    }
  };
  return { trace, status, phase, busy, run, cancel, reset };
}
