import { palette } from "../design/palette";
import { useState } from "react";
import type { NeuronTrace } from "../engine/neuron";
import { formatNumber as fmt } from "../engine/neuron";
import { SceneFrame } from "../components/SceneFrame";
import { SceneNode, SceneEdge, type Point } from "./SceneObjects";
import { NeuronDiagram } from "./NeuronDiagram";
export function NeuronScene({
  inputs,
  weights,
  trace,
  step,
}: {
  inputs: number[];
  weights: number[];
  trace: NeuronTrace;
  step: number;
}) {
  const [selected, setSelected] = useState("sum");
  const points: Point[] = [
      [-3.5, 1.4, -0.6],
      [-3.5, 0, 0.6],
      [-3.5, -1.4, -0.6],
    ],
    sum: Point = [-0.6, 0, 0],
    activation: Point = [1.5, 0, 0.5],
    out: Point = [3.5, 0, 0];
  const description = selected.startsWith("edge")
    ? (() => {
        const i = Number(selected.slice(4));
        return step >= 1
          ? `Input ${i + 1}: ${fmt(inputs[i])} × weight ${fmt(weights[i])} = contribution ${fmt(trace.contributions[i])}`
          : `Input ${i + 1} = ${fmt(inputs[i])}; weight = ${fmt(weights[i])}. Step to Multiply weights for its contribution.`;
      })()
    : selected.startsWith("input")
      ? `Input ${Number(selected.slice(5)) + 1} = ${fmt(inputs[Number(selected.slice(5))])}`
      : selected === "sum"
        ? step < 2
          ? "Step to Sum contributions to inspect the weighted sum."
          : `Weighted sum = ${trace.contributions.map(fmt).join(" + ")} = ${fmt(trace.weightedSum)}. ${step >= 3 ? `Bias = ${fmt(trace.bias)}. z = ${fmt(trace.preActivation)}.` : "Step to Add bias to inspect z."}`
        : selected === "activation"
          ? step < 3
            ? "Step to Add bias to inspect z."
            : step < 5
              ? `Activation input z = ${fmt(trace.preActivation)}. Step to Final output for the result.`
              : `Activation transforms z = ${fmt(trace.preActivation)} into a = ${fmt(trace.output)}.`
          : step >= 5
            ? `Final output = ${fmt(trace.output)}.`
            : "Step to Final output to inspect the result.";
  return (
    <div className="three-wrap">
      <SceneFrame
        label="Selectable 3D neuron calculation"
        fallback={
          <NeuronDiagram
            inputs={inputs}
            weights={weights}
            trace={trace}
            step={step}
          />
        }
      >
        {points.map((p, i) => (
          <group key={i}>
            <SceneNode
              position={p}
              text={`x${i + 1} = ${fmt(inputs[i])}`}
              color={palette.input}
              selected={selected === "input" + i}
              onSelect={() => setSelected("input" + i)}
            />
            <SceneEdge
              a={p}
              b={sum}
              value={weights[i]}
              active={step >= 1}
              selected={selected === "edge" + i}
              onSelect={() => setSelected("edge" + i)}
            />
          </group>
        ))}
        <SceneNode
          position={sum}
          text={step >= 2 ? `Σ = ${fmt(trace.weightedSum)}` : "Σ contributions"}
          color={palette.weight}
          selected={selected === "sum"}
          onSelect={() => setSelected("sum")}
        />
        <SceneEdge
          a={sum}
          b={activation}
          value={1}
          active={step >= 3}
          onSelect={() => setSelected("activation")}
        />
        <SceneNode
          position={activation}
          text={step >= 3 ? `z = ${fmt(trace.preActivation)}` : "Activation"}
          color={palette.weight}
          selected={selected === "activation"}
          onSelect={() => setSelected("activation")}
        />
        <SceneEdge
          a={activation}
          b={out}
          value={1}
          active={step >= 5}
          onSelect={() => setSelected("output")}
        />
        <SceneNode
          position={out}
          text={step >= 5 ? `a = ${fmt(trace.output)}` : "Output: ?"}
          color={palette.input}
          selected={selected === "output"}
          onSelect={() => setSelected("output")}
        />
      </SceneFrame>
      <div className="scene-inspection">
        <div
          className="foundation-choices"
          aria-label="Keyboard neuron inspection"
        >
          {[
            "input0",
            "input1",
            "input2",
            "edge0",
            "edge1",
            "edge2",
            "sum",
            "activation",
            "output",
          ].map((id) => (
            <button
              key={id}
              aria-pressed={selected === id}
              onClick={() => setSelected(id)}
            >
              {id.startsWith("input")
                ? "Input " + (Number(id.slice(5)) + 1)
                : id.startsWith("edge")
                  ? "Weight " + (Number(id.slice(4)) + 1)
                  : id}
            </button>
          ))}
        </div>
        <p role="status" data-testid="neuron-selection">
          {description}
        </p>
        <p className="foundation-mini">
          Slate blue = positive connection · coral = negative · pale aqua =
          selected. Timeline highlights computed stages. Select with the scene
          or the buttons above.
        </p>
      </div>
    </div>
  );
}
