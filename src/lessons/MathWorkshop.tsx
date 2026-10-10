import { lazy, Suspense, useState } from "react";
import { PythonProgram } from "../components/PythonProgram";
import { surfacePath, surfaceLoss } from "../engine/surface";
const LossSurface = lazy(() =>
  import("../visuals/LossSurface").then((m) => ({ default: m.LossSurface })),
);
const fmt = (n: number) => Number(n.toFixed(4)).toString();
export function MathWorkshop() {
  const [a, setA] = useState([
      [1, 2],
      [3, 4],
    ]),
    [b, setB] = useState([
      [2, 0],
      [-1, 1],
    ]),
    [cell, setCell] = useState([0, 0]),
    [w, setW] = useState(0),
    [bias, setBias] = useState(0),
    [rate, setRate] = useState(0.2),
    [step, setStep] = useState(0),
    [view, setView] = useState(false),
    [guess, setGuess] = useState(""),
    [reveal, setReveal] = useState(false);
  const product = a.map((row) =>
    b[0].map((_, j) => row.reduce((sum, x, k) => sum + x * b[k][j], 0)),
  );
  const path = surfacePath(w, bias, rate, step),
    last = path.at(-1)!;
  const source = `import numpy as np\nA = np.array(${JSON.stringify(a)})\nB = np.array(${JSON.stringify(b)})\nC = A @ B\nresult = {"cells": C.tolist(), "selected": float(C[${cell[0]}, ${cell[1]}])}\nprint(result)`;
  return (
    <section aria-label="Mathematics workshop">
      <p className="eyebrow">TWO SPATIAL IDEAS · REAL NUMERICAL STATE</p>
      <h1>
        Inspect a cell. Follow a slope<span className="dot">.</span>
      </h1>
      <section className="foundation-panel">
        <h2>Matrix multiplication: row meets column</h2>
        <p>
          For C = A @ B, C[i,j] = Σ A[i,k]B[k,j]. The shared k dimension is
          contracted, not multiplied element by element. Select an output cell
          and trace its products.
        </p>
        <div className="matrix-inputs">
          {[a, b].map((m, n) => (
            <fieldset key={n}>
              <legend>{n === 0 ? "Matrix A" : "Matrix B"} · 2×2</legend>
              {m.map((row, i) => (
                <div key={i}>
                  {row.map((v, j) => (
                    <label key={j}>
                      {n === 0 ? "A" : "B"}[{i},{j}]
                      <input
                        type="number"
                        min="-10"
                        max="10"
                        step=".1"
                        value={v}
                        onChange={(e) => {
                          const x = Number(e.target.value);
                          if (Number.isFinite(x) && Math.abs(x) <= 10)
                            (n === 0 ? setA : setB)((old) =>
                              old.map((r, k) =>
                                k === i
                                  ? r.map((y, t) => (t === j ? x : y))
                                  : r,
                              ),
                            );
                        }}
                      />
                    </label>
                  ))}
                </div>
              ))}
            </fieldset>
          ))}
        </div>
        <table aria-label="Select output matrix cell">
          <tbody>
            {product.map((row, i) => (
              <tr key={i}>
                {row.map((v, j) => (
                  <td key={j}>
                    <button
                      aria-pressed={cell[0] === i && cell[1] === j}
                      aria-label={`Inspect C[${i},${j}]`}
                      onClick={() => setCell([i, j])}
                    >
                      {fmt(v)}
                    </button>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <p className="formula" data-testid="matrix-cell-equation">
          C[{cell.join(",")}] ={" "}
          {a[cell[0]]
            .map((v, k) => `(${fmt(v)} × ${fmt(b[k][cell[1]])})`)
            .join(" + ")}{" "}
          = {fmt(product[cell[0]][cell[1]])}
        </p>
        <button
          onClick={() => {
            setA([
              [1, 2],
              [3, 4],
            ]);
            setB([
              [2, 0],
              [-1, 1],
            ]);
            setCell([0, 0]);
          }}
        >
          Reset matrices
        </button>
        <PythonProgram source={source} numpy />
      </section>
      <section className="foundation-panel">
        <h2>Loss landscape: weight and bias are two axes</h2>
        <p>
          Three fixed data points: (−1,−1), (0,1), (1,3). Model: ŷ = wx + b. L =
          mean[½(ŷ−y)²]. Height is loss; the white trail records gradient steps,
          and gold marks the current step. Unlike a decorative landscape, every
          height comes from this formula.
        </p>
        <div className="basics-inputs">
          {[
            ["Initial weight", w, setW],
            ["Initial bias", bias, setBias],
            ["Learning rate", rate, setRate],
          ].map(([label, value, set]) => (
            <label key={String(label)}>
              {String(label)}
              <input
                type="range"
                min={label === "Learning rate" ? 0 : -2}
                max={label === "Learning rate" ? 1.5 : 3}
                step=".05"
                value={Number(value)}
                onChange={(e) => {
                  (set as (n: number) => void)(Number(e.target.value));
                  setStep(0);
                  setReveal(false);
                  setGuess("");
                }}
              />
              <span>{fmt(Number(value))}</span>
            </label>
          ))}
        </div>
        <label className="writing-label">
          Predict the loss after one update
          <input
            type="number"
            value={guess}
            disabled={reveal}
            onChange={(e) => setGuess(e.target.value)}
          />
        </label>
        <button
          disabled={!guess.trim() || !Number.isFinite(Number(guess)) || reveal}
          onClick={() => {
            setReveal(true);
            setStep(1);
          }}
        >
          Reveal descent step
        </button>
        <button
          disabled={!reveal || step >= 30}
          onClick={() => setStep((s) => s + 1)}
        >
          Next descent step
        </button>
        <button disabled={step === 0} onClick={() => setStep((s) => s - 1)}>
          Rewind descent
        </button>
        <button
          onClick={() => {
            setStep(0);
            setReveal(false);
            setGuess("");
          }}
        >
          Replay descent
        </button>
        <button aria-pressed={view} onClick={() => setView((v) => !v)}>
          {view ? "Use 2D contour" : "Explore 3D surface"}
        </button>
        {view && (
          <Suspense fallback={<p>Loading loss surface…</p>}>
            <LossSurface weight={w} bias={bias} rate={rate} step={step} />
          </Suspense>
        )}
        <svg
          className="surface-contour"
          viewBox="0 0 500 300"
          role="img"
          aria-label="2D contour of the same weight-bias loss with exact gradient descent path"
        >
          <rect x="30" y="10" width="430" height="245" fill="#111d34" />
          {[0.1, 0.3, 0.7, 1.5, 3].map((l) => (
            <ellipse
              key={l}
              cx="288"
              cy="132.5"
              rx={Math.sqrt(3 * l) * 86}
              ry={Math.sqrt(2 * l) * 49}
              fill="none"
              stroke="#638bff"
            />
          ))}
          <polyline
            points={path
              .map(
                (p) =>
                  `${30 + (p.weight + 1) * 86},${255 - (p.bias + 1.5) * 49}`,
              )
              .join(" ")}
            fill="none"
            stroke="#f6ce78"
            strokeWidth="3"
          />
          {path.map((p, i) => (
            <circle
              key={i}
              cx={30 + (p.weight + 1) * 86}
              cy={255 - (p.bias + 1.5) * 49}
              r="4"
              fill="#f6ce78"
            />
          ))}
          <text x="30" y="280" fill="currentColor">
            weight → · center w=2, b=1 · bias ↑
          </text>
        </svg>
        <p data-testid="surface-values">
          Step {step}: weight {fmt(last.weight)} · bias {fmt(last.bias)} · loss{" "}
          {fmt(last.loss)} · dL/dw {fmt(last.dw)} · dL/db {fmt(last.db)}.
        </p>
        {reveal && (
          <p>
            {Math.abs(surfacePath(w, bias, rate, 1)[1].loss - Number(guess)) <
            0.001
              ? "Prediction matched within 0.001."
              : "Compare your prediction with the first descent step."}{" "}
            Update: w ← w − η dL/dw; b ← b − η dL/db.
          </p>
        )}
        <p>
          Minimum: w=2, b=1, loss={surfaceLoss(2, 1).loss}. Larger steps may
          overshoot. Surface height is clipped at loss 12; exact values above
          are never clipped.
        </p>
        <PythonProgram
          source={`points = [(-1, -1), (0, 1), (1, 3)]\nw, b, rate = ${w}, ${bias}, ${rate}\ntrace = []\nfor i in range(${step + 1}):\n    errors = [w*x + b - y for x, y in points]\n    loss = sum(0.5*e*e for e in errors)/3\n    dw = sum(e*x for e, (x, y) in zip(errors, points))/3\n    db = sum(errors)/3\n    trace.append({"weight": w, "bias": b, "loss": loss, "dw": dw, "db": db})\n    w -= rate*dw\n    b -= rate*db\nresult = trace\nprint(result)`}
        />
      </section>
    </section>
  );
}
