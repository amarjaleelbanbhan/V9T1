import { useState } from "react";
/** Separate sandbox practice. The expected result stays hidden until a finite prediction is submitted. */
export function TransferPrediction({
  prompt,
  expected,
  explanation,
}: {
  prompt: string;
  expected: number;
  explanation: string;
}) {
  const [prediction, setPrediction] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const valid = prediction.trim() !== "" && Number.isFinite(Number(prediction));
  return (
    <section
      className="foundation-panel transfer-prediction"
      aria-label="Fresh transfer prediction"
    >
      <p className="eyebrow">PREDICT BEFORE REVEAL · SANDBOX PRACTICE</p>
      <h2>{prompt}</h2>
      <label>
        Transfer prediction
        <input
          type="number"
          step="any"
          value={prediction}
          disabled={submitted}
          onChange={(e) => setPrediction(e.target.value)}
        />
      </label>
      <button
        className="action"
        disabled={!valid || submitted}
        onClick={() => setSubmitted(true)}
      >
        Check transfer prediction
      </button>
      {submitted && (
        <div role="status">
          <p>
            {Math.abs(Number(prediction) - expected) < 0.0001
              ? "Prediction matched."
              : "Compare the calculation with your prediction."}{" "}
            Expected: {Number(expected.toFixed(6))}. {explanation}
          </p>
          <button
            onClick={() => {
              setSubmitted(false);
              setPrediction("");
            }}
          >
            Try this prediction again
          </button>
        </div>
      )}
      <p>
        Exploratory feedback only; this task does not award authored-course
        credit or independent mastery.
      </p>
    </section>
  );
}
