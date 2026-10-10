import { validateWorkshop } from "../engine/workshopValidation";
import { lazy, Suspense, useEffect, useState } from "react";
import { usePythonProgram } from "../python/usePythonProgram";
const PythonEditor = lazy(() =>
  import("../components/PythonEditor").then((m) => ({
    default: m.PythonEditor,
  })),
);
const templates = [
  {
    name: "Neuron calculation",
    prompt:
      "Compute contributions, z and a ReLU output. Predict before running, then edit the weights and explain what changed.",
    source: `inputs = [2.0, -1.0, 0.5]\nweights = [0.8, -0.4, 1.2]\nbias = 0.5\ncontributions = [x * w for x, w in zip(inputs, weights)]\nz = sum(contributions) + bias\noutput = max(0.0, z)\nresult = {"contributions": contributions, "z": z, "output": output}\nprint(result)`,
    expected: 3.1,
  },
  {
    name: "Repair a gradient update",
    prompt:
      "The code below moves uphill. Repair the update to minimize (weight - 3)². Predict the new weight before running.",
    source: `weight = 1.0\nrate = 0.1\ngradient = 2 * (weight - 3)\nnew_weight = weight + rate * gradient  # Repair this sign\nresult = {"gradient": gradient, "output": new_weight}\nprint(result)`,
    expected: 1.4,
  },
  {
    name: "NumPy matrix cells",
    prompt:
      "Predict the bottom-right cell of A @ B. Use the selected row and column.",
    source: `import numpy as np\nA = np.array([[1.0, 2.0], [3.0, 4.0]])\nB = np.array([[2.0, 0.0], [-1.0, 1.0]])\nC = A @ B\nresult = {"cells": C.tolist(), "output": float(C[1, 1])}\nprint(result)`,
    expected: 4,
  },
];
export function PythonWorkshop() {
  const [index, setIndex] = useState(0),
    [source, setSource] = useState(templates[0].source),
    [guess, setGuess] = useState(""),
    [result, setResult] = useState<Record<string, unknown> | null>(null);
  const p = usePythonProgram<Record<string, unknown>>();
  useEffect(() => () => p.cancel(), []);
  const reset = (i: number) => {
    p.reset();
    setIndex(i);
    setSource(templates[i].source);
    setResult(null);
    setGuess("");
  };
  return (
    <section aria-label="Editable Python workshop">
      <p className="eyebrow">READ → PREDICT → EDIT → RUN → EXPLAIN</p>
      <h1>
        Make the code your own<span className="dot">.</span>
      </h1>
      <p className="subtitle">
        Python executes in your browser. Inspect the returned numerical state
        rather than memorizing a screenshot.
      </p>
      <section className="foundation-panel">
        <div className="foundation-choices">
          {templates.map((t, i) => (
            <button
              key={t.name}
              aria-pressed={i === index}
              onClick={() => reset(i)}
            >
              {t.name}
            </button>
          ))}
        </div>
        <h2>{templates[index].name}</h2>
        <p>{templates[index].prompt}</p>
        <label className="writing-label">
          Predicted output
          <input
            type="number"
            value={guess}
            disabled={!!result || p.busy}
            onChange={(e) => setGuess(e.target.value)}
          />
        </label>
        <Suspense fallback={<p>Loading Python editor…</p>}>
          <PythonEditor
            value={source}
            onChange={(s) => {
              p.reset();
              setSource(s);
              setResult(null);
              setGuess("");
            }}
          />
        </Suspense>
        <div className="python-actions">
          <button
            disabled={
              p.busy || !guess.trim() || !Number.isFinite(Number(guess))
            }
            onClick={async () => {
              setResult(null);
              setResult(await p.run(source, index === 2, true));
            }}
          >
            Execute edited Python
          </button>
          <button
            disabled={!p.busy}
            onClick={() => {
              p.cancel();
              setResult(null);
            }}
          >
            Stop edited Python
          </button>
          <button onClick={() => reset(index)}>Reset exercise code</button>
        </div>
        <p role="status">{p.status}</p>
        {result && (
          <>
            <p role="status" data-testid="workshop-contract">
              {validateWorkshop(index, result)
                ? "The executed values satisfy this exercise’s numerical contract."
                : "The program executed, but its returned values do not satisfy the intended exercise. Compare every required field with the task."}{" "}
              This is sandbox validation, separate from assessed course
              evidence.
            </p>
            <pre className="python-code" data-testid="workshop-result">
              {JSON.stringify(result, null, 2)}
            </pre>
            <p>
              {typeof result.output === "number" &&
              Math.abs(result.output - Number(guess)) < 1e-6
                ? "Your prediction matches the executed output."
                : "Compare your prediction with the returned output and trace the difference."}{" "}
              Sandbox comparison only; matching your prediction does not
              validate the intended task. For the intended exercise, expected
              output is {templates[index].expected}. Edited programs may
              intentionally give a different answer.
            </p>
            {Array.isArray(result.contributions) &&
              result.contributions.every(
                (x) => typeof x === "number" && Number.isFinite(x),
              ) && (
                <div
                  className="contribution-bars"
                  aria-label="Python calculated contributions"
                >
                  {result.contributions.map((x, i) => (
                    <div key={i}>
                      <span>
                        x{i + 1}w{i + 1}: {String(x)}
                      </span>
                      <meter min={-10} max={10} value={Number(x)} />
                    </div>
                  ))}
                </div>
              )}
            {Array.isArray(result.cells) &&
              result.cells.every(
                (row) =>
                  Array.isArray(row) &&
                  row.every((x) => typeof x === "number" && Number.isFinite(x)),
              ) && (
                <table aria-label="Python computed matrix">
                  <tbody>
                    {(result.cells as number[][]).map((row, i) => (
                      <tr key={i}>
                        {row.map((v, j) => (
                          <td key={j}>{v}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
          </>
        )}
        <details>
          <summary>Runtime and package limits</summary>
          <p>
            Editable code runs in a fresh, disposable worker. Only math and
            NumPy imports are supported here. Output is capped at 20,000
            characters, source at 20,000 characters, and execution at 10 seconds
            after runtime loading. Cancel terminates the worker. First use needs
            an internet download; offline reload is not guaranteed. This is
            browser isolation, not a server security sandbox. Do not put secrets
            in code. PyTorch and TensorFlow are not installed.
          </p>
        </details>
      </section>
    </section>
  );
}
