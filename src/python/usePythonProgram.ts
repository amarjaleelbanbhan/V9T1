import { useEffect, useRef, useState } from "react";
export type ExecutionPhase =
  | "idle"
  | "loading"
  | "executing"
  | "canceled"
  | "invalidated"
  | "failed"
  | "completed";
export function usePythonProgram<T>() {
  const [phase, setPhase] = useState<ExecutionPhase>("idle");
  const worker = useRef<Worker | null>(null),
    timer = useRef<ReturnType<typeof setTimeout> | null>(null),
    resolve = useRef<((value: T | null) => void) | null>(null);
  const [busy, setBusy] = useState(false),
    [status, setStatus] = useState("Ready. First run downloads Python."),
    [output, setOutput] = useState("");
  const stop = () => {
    worker.current?.terminate();
    worker.current = null;
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
    resolve.current?.(null);
    resolve.current = null;
  };
  useEffect(() => () => stop(), []);
  const cancel = () => {
    setPhase("canceled");
    stop();
    setBusy(false);
    setOutput("");
    setStatus("Canceled. No result retained.");
  };
  const reset = () => {
    setPhase((old) => (old === "idle" ? "idle" : "invalidated"));
    if (resolve.current) stop();
    setBusy(false);
    setOutput("");
    setStatus("Ready. Run Python with current inputs.");
  };
  const run = (
    source: string,
    numpy = false,
    editable = false,
  ): Promise<T | null> => {
    if (resolve.current || editable) stop();
    setOutput("");
    setBusy(true);
    setPhase("loading");
    setStatus("Loading Python and executing your current inputs…");
    return new Promise((done) => {
      resolve.current = done;
      const w =
        worker.current ||
        new Worker(`${import.meta.env.BASE_URL}python-program-worker.js`);
      worker.current = w;
      const finish = (message: string, result: T | null, stdout = "") => {
        if (worker.current !== w) return;
        const complete = resolve.current;
        resolve.current = null;
        if (timer.current) clearTimeout(timer.current);
        timer.current = null;
        setBusy(false);
        setPhase(result === null ? "failed" : "completed");
        setStatus(message);
        setOutput(stdout);
        if (result === null) {
          w.terminate();
          worker.current = null;
        }
        complete?.(result);
      };
      w.onmessage = ({ data }) => {
        if (data.ready) {
          setPhase("executing");
          setStatus("Executing Python with current inputs…");
          if (editable) {
            if (timer.current) clearTimeout(timer.current);
            timer.current = setTimeout(
              () =>
                finish("Python stopped after 10 seconds of execution.", null),
              10000,
            );
          }
          return;
        }
        finish(
          data.error || "Executed Python.",
          data.error ? null : data.result,
          data.output || "",
        );
        if (editable && worker.current === w) {
          w.terminate();
          worker.current = null;
        }
      };
      w.onerror = () =>
        finish(
          "Python runtime could not load. Check your connection and retry.",
          null,
        );
      timer.current = setTimeout(
        () =>
          finish(
            "Python stopped after 90 seconds. Retry when downloads are available.",
            null,
          ),
        90000,
      );
      w.postMessage({ source, numpy, editable });
    });
  };
  return { busy, status, phase, output, run, cancel, reset };
}
