import { useState } from "react";
import { BINARY_INPUTS, perceptron } from "../engine/perceptron";
export function XorExperiment() {
  const [weights, setWeights] = useState([1, 1]);
  const [bias, setBias] = useState(-0.5);
  const [tested, setTested] = useState(false);
  const rows = BINARY_INPUTS.map((inputs) => ({
    inputs,
    ...perceptron(inputs, weights, bias),
    target: Number(inputs[0] !== inputs[1]),
  }));
  return (
    <section
      className="foundation-panel"
      aria-label="Construct an XOR boundary"
    >
      <h2>Try to separate XOR with one boundary</h2>
      <p>
        Targets: (0,0) → 0; (0,1) → 1; (1,0) → 1; (1,1) → 0. Adjust the boundary
        w₁x₁ + w₂x₂ + b ≥ 0, then test all four corners.
      </p>
      {weights.map((v, i) => (
        <label className="foundation-range" key={i}>
          XOR weight {i + 1}: {v}
          <input
            type="range"
            min="-3"
            max="3"
            step=".1"
            value={v}
            onChange={(e) => {
              setWeights((old) =>
                old.map((w, j) => (j === i ? Number(e.target.value) : w)),
              );
              setTested(false);
            }}
          />
        </label>
      ))}
      <label className="foundation-range">
        XOR bias: {bias}
        <input
          type="range"
          min="-3"
          max="3"
          step=".1"
          value={bias}
          onChange={(e) => {
            setBias(Number(e.target.value));
            setTested(false);
          }}
        />
      </label>
      <button className="action" onClick={() => setTested(true)}>
        Test XOR boundary
      </button>
      {tested && (
        <div role="status">
          <p>
            {rows.filter((r) => r.output === r.target).length} / 4 corners
            matched.
          </p>
          <ul>
            {rows.map((r) => (
              <li key={r.inputs.join(",")}>
                ({r.inputs.join(", ")}): z={Number(r.z.toFixed(3))}; output{" "}
                {r.output}; target {r.target}
              </li>
            ))}
          </ul>
          <p>
            To classify (0,0) as 0 requires b&lt;0. The two positive corners
            require w₁+b≥0 and w₂+b≥0, so w₁+w₂+b≥−b&gt;0. That forces (1,1) to
            1, contradicting its target. One straight boundary cannot satisfy
            all four constraints.
          </p>
        </div>
      )}
      <p>Sandbox construction, separate from authored-course evidence.</p>
    </section>
  );
}
