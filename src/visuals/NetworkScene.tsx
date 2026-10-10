import { palette } from '../design/palette';
import { useState } from "react";
import type { ForwardTrace } from "../engine/forward";
import type { BackpropTrace } from "../engine/backprop";
import { SceneFrame } from "../components/SceneFrame";
import { SceneNode, SceneEdge, type Point } from "./SceneObjects";
type Edge = { layer: number; neuron: number; source: number };
const fmt = (n: number) => Number(n.toFixed(5)).toString();
const positions: Point[][] = [
  [
    [-3, 1.15, -0.65],
    [-3, -1.15, 0.65],
  ],
  [
    [0, 1.15, 0.65],
    [0, -1.15, -0.65],
  ],
  [[3, 0, 0]],
];
export function NetworkScene({
  trace,
  selected,
  onSelect,
  step = 4,
  backward,
}: {
  trace: ForwardTrace;
  selected: Edge;
  onSelect: (edge: Edge) => void;
  step?: number;
  backward?: BackpropTrace;
}) {
  const [node, setNode] = useState<[number, number]>([0, 0]);
  const inspected = trace.layers[node[0]].neurons[node[1]];
  const fallback = (
    <p>
      3D unavailable. Choose 2D above; the same connection controls and
      numerical inspector remain available.
    </p>
  );
  return (
    <>
      <SceneFrame label="Layered 3D network" fallback={fallback}>
        {trace.layers.map((layer, l) =>
          layer.neurons.map((n, j) => (
            <group key={l + "-" + j}>
              {n.weights.map((w, s) => (
                <SceneEdge
                  key={s}
                  a={positions[l][s]}
                  b={positions[l + 1][j]}
                  value={
                    backward ? backward.layers[l].neurons[j].weights[s] : w
                  }
                  active={step >= (l === 0 ? 1 : 3)}
                  selected={
                    selected.layer === l &&
                    selected.neuron === j &&
                    selected.source === s
                  }
                  onSelect={() => {
                    onSelect({ layer: l, neuron: j, source: s });
                    setNode([l, j]);
                  }}
                />
              ))}
              <SceneNode
                position={positions[l + 1][j]}
                text={`${l === 0 ? "h" + (j + 1) : "ŷ"} = ${step >= (l === 0 ? 2 : 4) ? fmt(n.output) : "?"}`}
                color={l === 0 ? palette.input : palette.weight}
                selected={node[0] === l && node[1] === j}
                onSelect={() => setNode([l, j])}
              />
            </group>
          )),
        )}
        {trace.input.map((x, i) => (
          <SceneNode
            key={i}
            position={positions[0][i]}
            text={`x${i + 1} = ${fmt(x)}`}
            color={palette.input}
            onSelect={() =>
              onSelect({ layer: 0, neuron: selected.neuron, source: i })
            }
          />
        ))}
      </SceneFrame>
      <div className="scene-inspection">
        <div className="foundation-choices">
          {trace.layers.flatMap((l, i) =>
            l.neurons.map((_, j) => (
              <button
                key={i + "-" + j}
                aria-pressed={node[0] === i && node[1] === j}
                onClick={() => setNode([i, j])}
              >
                Inspect {i === 0 ? "hidden " + (j + 1) : "output neuron"}
              </button>
            )),
          )}
        </div>
        <p data-testid="network-neuron-calculation">
          Weighted sum = {fmt(inspected.weightedSum)}. z ={" "}
          {inspected.contributions.map(fmt).join(" + ")} + bias (
          {fmt(inspected.bias)}) = {fmt(inspected.z)}. {inspected.activation}(z)
          = {fmt(inspected.output)}.
        </p>
        {backward && (
          <p>
            Loss = {fmt(backward.loss)} · prediction {fmt(backward.prediction)}{" "}
            · target {fmt(backward.target)}. Selected neuron δ ={" "}
            {fmt(backward.layers[node[0]].neurons[node[1]].delta)}. Edge colors
            now indicate the sign of dL/dw. Gradients travel output → hidden;
            values and editable parameters are shared with 2D.
          </p>
        )}
      </div>
    </>
  );
}
