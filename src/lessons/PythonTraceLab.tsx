import { TransferPrediction } from "../components/TransferPrediction";
import { useState } from "react";
import { PYTHON_SOURCE } from "../python/trace";
import { usePythonExecution } from "../python/usePythonExecution";
export function PythonTraceLab() {
  const [values, setValues] = useState(["1", "2", "3", "4", "5", "6"]);
  const [index, setIndex] = useState(0);
  const {
    trace,
    status,
    busy,
    run: execute,
    cancel,
    reset,
  } = usePythonExecution();
  const run = () => {
    setIndex(0);
    const parsed = values.map((v) => (v.trim() ? Number(v) : NaN));
    execute({
      example: "array",
      values: [parsed.slice(0, 3), parsed.slice(3)],
    });
  };
  const frame = trace?.frames[index];
  return (
    <section aria-label="Python execution visualization">
      <p className="eyebrow">ACTUAL EXECUTED PYTHON · BOUNDED NUMPY EXAMPLE</p>
      <h1>
        Watch an array come alive<span className="dot">.</span>
      </h1>
      <p className="subtitle">
        Edit six numeric inputs. Run a fixed Python program, then inspect its
        captured line events. This prototype does not run arbitrary code or
        train models.
      </p>
      <div className="python-grid">
        {values.map((v, i) => (
          <label key={i}>
            x[{Math.floor(i / 3)}, {i % 3}]
            <input
              className="python-input"
              type="number"
              min={-1e6}
              max={1e6}
              value={v}
              disabled={busy}
              onChange={(e) => {
                setValues((old) =>
                  old.map((x, j) => (j === i ? e.target.value : x)),
                );
                setIndex(0);
                reset();
              }}
            />
          </label>
        ))}
      </div>
      <TransferPrediction
        prompt="Predict this 2×3 float32 array’s data payload in bytes. Each element uses 4 bytes; exclude runtime and object overhead."
        expected={2 * 3 * 4}
        explanation="Six elements × four bytes = 24 bytes, regardless of their numeric values."
      />
      <div className="python-actions">
        <button onClick={run} disabled={busy}>
          Run Python
        </button>
        <button className="cancel" disabled={!busy} onClick={cancel}>
          Cancel execution
        </button>
        <button
          disabled={!trace || index === 0}
          onClick={() => setIndex((i) => i - 1)}
        >
          Previous line
        </button>
        <button
          disabled={!trace || index >= trace.frames.length - 1}
          onClick={() => setIndex((i) => i + 1)}
        >
          Next line
        </button>
      </div>
      <p role="status">{status}</p>
      <div className="python-code" aria-label="Python source">
        {(trace?.source || PYTHON_SOURCE).split("\n").map((line, i) => (
          <div key={i} className={frame?.line === i + 1 ? "current-line" : ""}>
            <code>
              {i + 1} · {line}
            </code>
          </div>
        ))}
      </div>
      <p className="foundation-copy">
        {frame
          ? frame.phase === "complete"
            ? "Execution complete. Final state."
            : `Before line ${frame.line}: state reflects previous completed statements.`
          : "The trace appears after successful execution."}
      </p>
      {frame?.tensor && (
        <>
          <table
            className="array-values"
            aria-label="Captured array rows and columns"
          >
            <thead>
              <tr>
                <th>Row / column</th>
                {frame.tensor.values[0].map((_, i) => (
                  <th key={i}>Column {i}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {frame.tensor.values.map((row, i) => (
                <tr key={i}>
                  <th>Row {i}</th>
                  {row.map((value, j) => (
                    <td className="python-cell" key={j}>
                      {value}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <div className="python-metrics">
            <span>Shape: ({frame.tensor.shape.join(", ")})</span>
            <span>Rank: {frame.tensor.rank}</span>
            <span>dtype: {frame.tensor.dtype}</span>
            <span>Measured payload: {frame.tensor.payload_bytes} bytes</span>
          </div>
        </>
      )}
      <p className="foundation-mini">
        Payload excludes object overhead and Python/WASM runtime memory. This
        runtime is network-dependent on first load; offline support has not been
        implemented.
      </p>
      <h2>Captured output</h2>
      <pre className="python-code">
        {frame?.stdout || "No output at this step."}
      </pre>
    </section>
  );
}
