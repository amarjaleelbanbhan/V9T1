import { TransferPrediction } from "../components/TransferPrediction";
import { StagePlayer } from "../components/StagePlayer";
import { lazy, Suspense } from "react";
const NetworkScene = lazy(() =>
  import("../visuals/NetworkScene").then((m) => ({ default: m.NetworkScene })),
);
import { usePythonProgram } from "../python/usePythonProgram";
import { PythonProgram } from "../components/PythonProgram";
import { backpropPython } from "../python/programs";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ChevronRight,
  GitBranch,
  RotateCcw,
  CircleHelp,
} from "lucide-react";
import {
  DEFAULT_FORWARD_INPUT,
  DEFAULT_FORWARD_LAYERS,
  type DenseLayer,
} from "../engine/forward";
import { backpropagate } from "../engine/backprop";
type Edge = { layer: number; neuron: number; source: number };
const INITIAL_EDGE: Edge = { layer: 1, neuron: 0, source: 0 };
const stages = [
  "Forward prediction",
  "Output error",
  "Output delta",
  "Hidden deltas",
  "Parameter gradients",
  "Update weights",
] as const;
const fmt = (v: number) =>
  Math.abs(v) < 0.0005 ? "0" : Number(v.toFixed(4)).toString();
const copyLayers = (src: readonly DenseLayer[]): DenseLayer[] =>
  src.map((l) => ({
    activation: l.activation,
    weights: l.weights.map((r) => [...r]),
    biases: [...l.biases],
  }));
const positions = [
  [
    { x: 80, y: 107 },
    { x: 80, y: 249 },
  ],
  [
    { x: 311, y: 107 },
    { x: 311, y: 249 },
  ],
  [{ x: 545, y: 178 }],
];
function BackwardNetwork({
  trace,
  stage,
  selected,
}: {
  trace: ReturnType<typeof backpropagate>;
  stage: number;
  selected: Edge;
}) {
  const connections: {
    l: number;
    n: number;
    s: number;
    weight: number;
    gradient: number;
  }[] = [];
  trace.layers.forEach((layer, l) =>
    layer.neurons.forEach((neuron, n) =>
      neuron.weights.forEach((gradient, s) =>
        connections.push({
          l,
          n,
          s,
          weight: trace.forward.layers[l].neurons[n].weights[s],
          gradient,
        }),
      ),
    ),
  );
  const reversed = stage >= 2;
  return (
    <svg
      className="backprop-network"
      viewBox="0 0 625 345"
      role="img"
      aria-label={
        "Gradient flow in a 2 to 2 to 1 network, stage " +
        stages[stage] +
        ". Orange lines indicate backward derivatives."
      }
    >
      <defs>
        <marker
          id="backprop-arrow"
          markerWidth="6"
          markerHeight="6"
          refX="4.5"
          refY="3"
          orient="auto"
        >
          <path d="M0 0L6 3L0 6" fill="#F5C47B" />
        </marker>
      </defs>
      {["INPUT", "HIDDEN (ReLU)", "OUTPUT (Sigmoid)"].map((label, i) => (
        <text
          key={i}
          x={positions[i][0].x}
          y="28"
          fill="#D8EDE0"
          fontSize="12"
          fontWeight="700"
          textAnchor="middle"
        >
          {label}
        </text>
      ))}
      {connections.map(({ l, n, s, weight, gradient }) => {
        const a = positions[l][s],
          b = positions[l + 1][n],
          isSelected =
            l === selected.layer &&
            n === selected.neuron &&
            s === selected.source;
        const x1 = a.x + 26,
          x2 = b.x - 26,
          midX = (x1 + x2) / 2,
          midY = (a.y + b.y) / 2;
        const direction = reversed
          ? "M" + x2 + " " + b.y + "L" + x1 + " " + a.y
          : "M" + x1 + " " + a.y + "L" + x2 + " " + b.y;
        return (
          <g key={l + "-" + n + "-" + s} pointerEvents="none">
            <path
              d={direction}
              fill="none"
              stroke={isSelected ? "#F8E6A3" : reversed ? "#F5C47B" : "#6BA3BE"}
              strokeWidth={isSelected ? 4 : 2.5}
              opacity={isSelected ? 1 : 0.58}
              markerEnd={reversed ? "url(#backprop-arrow)" : undefined}
            />
            <rect
              x={midX - 28}
              y={midY - 12}
              width="56"
              height="24"
              rx="7"
              fill={isSelected ? "#43614C" : "#102F2B"}
              stroke={isSelected ? "#F8E6A3" : "#386D58"}
            />
            <text
              x={midX}
              y={midY + 4}
              textAnchor="middle"
              fill="#F2FFF2"
              fontSize="10"
            >
              {stage >= 4 ? fmt(gradient) : fmt(weight)}
            </text>
          </g>
        );
      })}
      {positions.map((column, l) =>
        column.map((pos, n) => {
          const output =
            l === 0
              ? trace.forward.input[n]
              : trace.forward.layers[l - 1].neurons[n].output;
          const delta = l === 0 ? null : trace.layers[l - 1].neurons[n].delta;
          return (
            <g key={l + "-" + n}>
              <circle
                cx={pos.x}
                cy={pos.y}
                r="28"
                stroke={l === 0 ? "#5D967B" : reversed ? "#F3CE8C" : "#6BA3BE"}
                strokeWidth="2"
                fill={l === 0 ? "#133B34" : "#245A43"}
              />
              <text
                x={pos.x}
                y={pos.y + 4}
                textAnchor="middle"
                fontSize="12"
                fill="#E9FFEA"
                fontWeight="700"
              >
                {stage >= 3 && delta !== null ? fmt(delta) : fmt(output)}
              </text>
              <text
                x={pos.x}
                y={pos.y + 47}
                textAnchor="middle"
                fontSize="11"
                fill="#BBDCCD"
              >
                {l === 0 ? "x" + (n + 1) : l === 1 ? "h" + (n + 1) : "ŷ"}
              </text>
            </g>
          );
        }),
      )}
      <text x="310" y="320" textAnchor="middle" fill="#A8D3B8" fontSize="11">
        {stage <= 1
          ? "Forward signal → (green connections)"
          : "Gradient flows ← from loss toward earlier weights"}
      </text>
    </svg>
  );
}
export function BackpropLab() {
  const [view3d, setView3d] = useState(false);
  const python = usePythonProgram<{ loss: number; updated: DenseLayer[] }>();
  const [inputs, setInputs] = useState<number[]>([...DEFAULT_FORWARD_INPUT]);
  const [layers, setLayers] = useState<DenseLayer[]>(() =>
    copyLayers(DEFAULT_FORWARD_LAYERS),
  );
  const [target, setTarget] = useState(1);
  const [learningRate, setLearningRate] = useState(0.2);
  const [stage, setStage] = useState(0);
  const [selected, setSelected] = useState<Edge>(INITIAL_EDGE);
  const [answer, setAnswer] = useState<"earlier" | "later" | null>(null);
  const [lastUpdate, setLastUpdate] = useState<{
    previous: number;
    next: number;
  } | null>(null);
  const trace = useMemo(
    () => backpropagate(inputs, layers, target),
    [inputs, layers, target],
  );
  const neuron = trace.layers[selected.layer].neurons[selected.neuron];
  const forwardNeuron =
    trace.forward.layers[selected.layer].neurons[selected.neuron];
  const weight =
    layers[selected.layer].weights[selected.neuron][selected.source];
  const gradient = neuron.weights[selected.source];
  const setStep = (v: number) => {
    setStage(Math.max(0, Math.min(5, v)));
  };
  const changeWeight = (v: number) => {
    setLastUpdate(null);
    setLayers((old) =>
      old.map((l, i) =>
        i !== selected.layer
          ? l
          : {
              ...l,
              weights: l.weights.map((r, j) =>
                j !== selected.neuron
                  ? r
                  : r.map((w, k) => (k === selected.source ? v : w)),
              ),
            },
      ),
    );
  };
  const changeBias = (li: number, j: number, v: number) => {
    setLastUpdate(null);
    setLayers((old) =>
      old.map((l, i) =>
        i === li
          ? { ...l, biases: l.biases.map((b, k) => (k === j ? v : b)) }
          : l,
      ),
    );
  };
  const apply = async () => {
    const result = await python.run(
      backpropPython(inputs, layers, target, learningRate),
    );
    if (!result) return;
    setLastUpdate({
      previous: result.loss,
      next: backpropagate(inputs, result.updated, target).loss,
    });
    setLayers(result.updated);
    setStep(5);
  };
  useEffect(() => {
    python.reset();
  }, [inputs, layers, target, learningRate]);
  const reset = () => {
    setInputs([...DEFAULT_FORWARD_INPUT]);
    setLayers(copyLayers(DEFAULT_FORWARD_LAYERS));
    setTarget(1);
    setLearningRate(0.2);
    setStep(0);
    setSelected(INITIAL_EDGE);
    setAnswer(null);
    setLastUpdate(null);
  };
  const activeExplanation =
    stage === 0
      ? "Compute input → hidden ReLU → output Sigmoid. Every displayed neuron value comes from the forward engine."
      : stage === 1
        ? "Half-squared loss: L = ½(ŷ − target)², so the upstream output gradient is ŷ − target."
        : stage === 2
          ? "Output delta: dL/dz_out = (ŷ − target) × sigmoid′(z_out)."
          : stage === 3
            ? "Hidden deltas: dL/dz_hidden = (output weight × output delta) × ReLU′(z_hidden)."
            : stage === 4
              ? "Every weight gradient is its destination-neuron delta multiplied by its source activation."
              : "A gradient descent update subtracts the learning rate times the gradient from each weight and bias.";
  return (
    <div className="foundation-page backprop-lab">
      <div className="heading">
        <div>
          <div className="crumb">
            <span>LECTURE 04</span>
            <ChevronRight size={15} />
            <span>CHAIN RULE · BACKPROPAGATION</span>
          </div>
          <h1>
            Reverse the signal<span className="dot">.</span>
          </h1>
          <p className="subtitle">
            Follow the loss backward through a genuine 2 → 2 → 1 network.
            Inspect every weight gradient and apply a training update.
          </p>
        </div>
        <div className="module-chip">
          <GitBranch size={15} /> TRUE CHAIN RULE
        </div>
      </div>
      <section
        className="foundation-panel"
        aria-label="Interactive backpropagation visualizer"
      >
        <div className="foundation-panel-heading">
          <div>
            <p className="eyebrow">FORWARD → LOSS → BACKWARD → UPDATE</p>
            <h2>How does an earlier weight know to change?</h2>
          </div>
          <GitBranch size={22} />
        </div>
        <div className="backprop-layout">
          <div className="foundation-chart-card">
            <button aria-pressed={view3d} onClick={() => setView3d((v) => !v)}>
              {view3d ? "Use 2D gradients" : "Explore 3D gradients"}
            </button>
            {view3d ? (
              <Suspense fallback={<p>Loading gradient network…</p>}>
                <NetworkScene
                  trace={trace.forward}
                  backward={trace}
                  selected={selected}
                  onSelect={setSelected}
                />
              </Suspense>
            ) : (
              <BackwardNetwork
                trace={trace}
                stage={stage}
                selected={selected}
              />
            )}
            <div
              className="compact-network"
              aria-label="Selected derivative path"
            >
              <p>{stages[stage]}</p>
              <p>Selected weight: {fmt(weight)}</p>
              <p>
                Source activation: {fmt(forwardNeuron.inputs[selected.source])}
              </p>
              <p>
                {stage >= 3
                  ? `Destination delta: ${fmt(neuron.upstream)} × ${fmt(neuron.derivative)} = ${fmt(neuron.delta)}`
                  : "Step to Hidden deltas to inspect derivative factors."}
              </p>
              <p>
                {stage >= 4
                  ? `Gradient: ${fmt(neuron.delta)} × ${fmt(forwardNeuron.inputs[selected.source])} = ${fmt(gradient)}`
                  : "Step to Parameter gradients to reveal the selected derivative."}
              </p>
            </div>
            <section
              className="foundation-panel"
              aria-label="Explain selected gradient"
            >
              <div className="foundation-panel-heading">
                <div>
                  <p className="eyebrow">TRACE THE CHAIN RULE</p>
                  <h2>
                    Selected connection:{" "}
                    {selected.layer === 0
                      ? "Input " +
                        (selected.source + 1) +
                        " → Hidden " +
                        (selected.neuron + 1)
                      : "Hidden " + (selected.source + 1) + " → Output"}
                  </h2>
                </div>
              </div>
              <div className="backprop-equations">
                <div>
                  <span>1. Destination delta (dL/dz)</span>
                  <strong data-testid="backprop-delta">
                    {fmt(neuron.upstream)} × {fmt(neuron.derivative)} ={" "}
                    {fmt(neuron.delta)}
                  </strong>
                </div>
                <div>
                  <span>2. Source activation</span>
                  <strong data-testid="backprop-source">
                    {fmt(forwardNeuron.inputs[selected.source])}
                  </strong>
                </div>
                <div>
                  <span>3. Weight gradient (dL/dw)</span>
                  <strong data-testid="backprop-edge-gradient">
                    {fmt(neuron.delta)} ×{" "}
                    {fmt(forwardNeuron.inputs[selected.source])} ={" "}
                    {fmt(gradient)}
                  </strong>
                </div>
                <div>
                  <span>4. Proposed gradient update</span>
                  <strong data-testid="backprop-proposed-weight">
                    {fmt(weight)} − {fmt(learningRate)} × ({fmt(gradient)}) ={" "}
                    {fmt(weight - learningRate * gradient)}
                  </strong>
                </div>
              </div>
              <p className="foundation-note">
                {selected.layer === 0
                  ? "For hidden neurons, the upstream term is a weighted sum of next-layer deltas. ReLU multiplies it by 1 for positive z and 0 for negative z."
                  : "For the final output, the upstream term is (ŷ − target); multiply it by the Sigmoid derivative before computing the weight gradient."}
              </p>
              <p role="status" aria-label="Python training status">
                {python.status}
              </p>
              <button disabled={!python.busy} onClick={python.cancel}>
                Cancel Python update
              </button>
              <div className="backprop-apply-row">
                <button
                  type="button"
                  className="backprop-apply"
                  disabled={python.busy}
                  onClick={apply}
                >
                  Apply one training step <ArrowRight size={16} />
                </button>
                {lastUpdate && (
                  <p role="status" data-testid="backprop-training-change">
                    Before loss {fmt(lastUpdate.previous)} → After loss{" "}
                    {fmt(lastUpdate.next)}.{" "}
                    {lastUpdate.next < lastUpdate.previous
                      ? "This sample improved."
                      : lastUpdate.next > lastUpdate.previous
                        ? "This sample worsened."
                        : "This sample was unchanged."}
                  </p>
                )}
              </div>
            </section>
            <StagePlayer
              step={stage}
              count={stages.length}
              onStep={setStep}
              label="Backward playback"
            />
            <div
              className="backprop-stages"
              role="group"
              aria-label="Backpropagation stages"
            >
              {stages.map((s, i) => (
                <button
                  key={s}
                  type="button"
                  className={stage === i ? "picked" : ""}
                  aria-pressed={stage === i}
                  onClick={() => setStep(i)}
                >
                  {i + 1}. {s}
                </button>
              ))}
            </div>
            <div
              className="loss-transport"
              role="group"
              aria-label="Backpropagation playback"
            >
              <button
                type="button"
                aria-label="Previous stage"
                disabled={stage === 0}
                onClick={() => setStep(stage - 1)}
              >
                <ArrowLeft size={16} /> Previous
              </button>
              <button
                type="button"
                aria-label="Next stage"
                disabled={stage === 5}
                onClick={() => setStep(stage + 1)}
              >
                Next <ArrowRight size={16} />
              </button>
            </div>
            <p
              className="backprop-stage-note"
              data-testid="backprop-stage-note"
            >
              {activeExplanation}
            </p>
            <div className="backprop-summary">
              <div>
                <span>Prediction (ŷ)</span>
                <strong data-testid="backprop-prediction">
                  {fmt(trace.prediction)}
                </strong>
              </div>
              <div>
                <span>Target (y)</span>
                <strong>{fmt(target)}</strong>
              </div>
              <div>
                <span>Loss (L)</span>
                <strong data-testid="backprop-loss">{fmt(trace.loss)}</strong>
              </div>
            </div>
          </div>
          <div className="foundation-parameter-card">
            <div className="foundation-parameter-header">
              <h3>Live controls</h3>
              <button
                type="button"
                onClick={reset}
                aria-label="Reset backpropagation"
              >
                <RotateCcw size={15} /> Reset
              </button>
            </div>
            <label className="foundation-range" htmlFor="backprop-target">
              <span>
                Target y <strong>{fmt(target)}</strong>
              </span>
              <input
                id="backprop-target"
                type="range"
                disabled={python.busy}
                min="0"
                max="1"
                step=".1"
                value={target}
                onChange={(e) => {
                  setTarget(Number(e.target.value));
                  setLastUpdate(null);
                }}
              />
            </label>
            <label className="foundation-range" htmlFor="backprop-rate">
              <span>
                Learning rate η <strong>{fmt(learningRate)}</strong>
              </span>
              <input
                id="backprop-rate"
                type="range"
                disabled={python.busy}
                min="0"
                max=".5"
                step=".05"
                value={learningRate}
                onChange={(e) => setLearningRate(Number(e.target.value))}
              />
            </label>
            {inputs.map((value, i) => (
              <label
                className="foundation-range"
                key={i}
                htmlFor={"backprop-input-" + i}
              >
                <span>
                  Input x{i + 1}
                  <strong>{fmt(value)}</strong>
                </span>
                <input
                  id={"backprop-input-" + i}
                  type="range"
                  disabled={python.busy}
                  min="-2"
                  max="3"
                  step=".1"
                  value={value}
                  onChange={(e) => {
                    setInputs((old) =>
                      old.map((n, j) => (i === j ? Number(e.target.value) : n)),
                    );
                    setLastUpdate(null);
                  }}
                />
              </label>
            ))}
            <p className="eyebrow">SELECT A WEIGHT TO INSPECT</p>
            <div
              className="backprop-edge-buttons"
              role="group"
              aria-label="Select gradient connection"
            >
              {layers.flatMap((layer, l) =>
                layer.weights.flatMap((row, n) =>
                  row.map((_, s) => {
                    const label =
                      l === 0
                        ? "Input " + (s + 1) + " to Hidden " + (n + 1)
                        : "Hidden " + (s + 1) + " to Output";
                    const active =
                      l === selected.layer &&
                      n === selected.neuron &&
                      s === selected.source;
                    return (
                      <button
                        type="button"
                        key={l + "-" + n + "-" + s}
                        aria-label={"Inspect " + label}
                        aria-pressed={active}
                        className={active ? "picked" : ""}
                        onClick={() =>
                          setSelected({ layer: l, neuron: n, source: s })
                        }
                      >
                        {label}
                      </button>
                    );
                  }),
                ),
              )}
            </div>
            <label className="foundation-range" htmlFor="backprop-weight">
              <span>
                Selected weight <strong>{fmt(weight)}</strong>
              </span>
              <input
                id="backprop-weight"
                type="range"
                disabled={python.busy}
                min="-2"
                max="2"
                step=".1"
                value={weight}
                onChange={(e) => changeWeight(Number(e.target.value))}
              />
            </label>
            <p className="eyebrow">NEURON BIASES</p>
            {layers.map((layer, l) =>
              layer.biases.map((b, n) => (
                <label
                  key={l + "-" + n}
                  className="foundation-range"
                  htmlFor={"backprop-bias-" + l + "-" + n}
                >
                  <span>
                    {l === 0 ? "Hidden " + (n + 1) : "Output"} bias
                    <strong>{fmt(b)}</strong>
                  </span>
                  <input
                    id={"backprop-bias-" + l + "-" + n}
                    type="range"
                    disabled={python.busy}
                    min="-2"
                    max="2"
                    step=".1"
                    value={b}
                    onChange={(e) => changeBias(l, n, Number(e.target.value))}
                  />
                </label>
              )),
            )}
          </div>
        </div>
      </section>
      <section className="foundation-panel foundation-review">
        <div>
          <p className="eyebrow">CHECK YOUR UNDERSTANDING</p>
          <h2>
            <CircleHelp size={18} /> Which order does backpropagation use?
          </h2>
          <p className="foundation-copy">
            Gradients must be known at the output before they can reach earlier
            hidden weights.
          </p>
        </div>
        <div className="foundation-review-actions">
          <button
            type="button"
            className={answer === "earlier" ? "picked" : ""}
            aria-pressed={answer === "earlier"}
            onClick={() => setAnswer("earlier")}
          >
            Hidden → Output
          </button>
          <button
            type="button"
            className={answer === "later" ? "picked" : ""}
            aria-pressed={answer === "later"}
            onClick={() => setAnswer("later")}
          >
            Output → Hidden
          </button>
          {answer && (
            <div role="status" className="foundation-answer">
              {answer === "later"
                ? "Correct. The backward pass starts at the output loss and propagates derivatives toward earlier layers."
                : "Not quite. Forward values travel from inputs to outputs; backward gradients travel from outputs toward earlier layers."}
            </div>
          )}
        </div>
      </section>
      <TransferPrediction
        prompt="A fresh ReLU connection has input −2, weight −0.5, bias 0 and target 0. With half-squared loss, predict dL/dw."
        expected={
          backpropagate(
            [-2],
            [{ weights: [[-0.5]], biases: [0], activation: "relu" }],
            0,
          ).layers[0].neurons[0].weights[0]
        }
        explanation="Forward output is 1. The destination delta is (1−0)×1, and the weight gradient multiplies that delta by source activation −2."
      />
      <p className="footnote">
        Lecture 04: chain rule and backpropagation. Uses half-squared error and
        the existing 2 → 2 → 1 forward model (hidden ReLU, output Sigmoid). ReLU
        at exactly zero uses a zero subgradient. This is a single-example
        gradient update, not batch training or a library-powered model.
      </p>
      <PythonProgram
        source={backpropPython(inputs, layers, target, learningRate)}
      />
    </div>
  );
}
