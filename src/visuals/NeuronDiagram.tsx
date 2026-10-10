import { palette } from "../design/palette";
import { useState } from "react";
import type { NeuronTrace } from "../engine/neuron";
import { formatNumber } from "../engine/neuron";
export function NeuronDiagram({
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
  const detail = selected.startsWith("input")
    ? (() => {
        const i = Number(selected.slice(5));
        return step >= 1
          ? `x${i + 1} × w${i + 1} = ${formatNumber(inputs[i])} × ${formatNumber(weights[i])} = ${formatNumber(trace.contributions[i])}`
          : `Input ${i + 1} = ${formatNumber(inputs[i])}. Step to Multiply weights to inspect its contribution.`;
      })()
    : selected === "sum"
      ? step >= 2
        ? `Σ = ${trace.contributions.map(formatNumber).join(" + ")} = ${formatNumber(trace.weightedSum)}`
        : "Step to Sum contributions to inspect the weighted sum."
      : selected === "activation"
        ? step >= 3
          ? `z = ${formatNumber(trace.weightedSum)} + (${formatNumber(trace.bias)}) = ${formatNumber(trace.preActivation)}`
          : "Step to Add bias to inspect the activation input."
        : step >= 5
          ? `a = f(${formatNumber(trace.preActivation)}) = ${formatNumber(trace.output)}`
          : "Step to Final output to inspect the result.";
  return (
    <div className="neuron-map">
      <div className="compact-neuron" aria-label="Staged neuron calculation">
        <p>Inputs → weighted sum → bias → activation</p>
        <div>
          {inputs.map((value, i) => (
            <button
              key={i}
              aria-pressed={selected === "input" + i}
              onClick={() => setSelected("input" + i)}
            >
              <span>
                x{i + 1} = {formatNumber(value)} · w{i + 1} ={" "}
                {formatNumber(weights[i])}
              </span>
              <strong>
                {step >= 1
                  ? `Contribution: ${formatNumber(trace.contributions[i])}`
                  : "Contribution hidden until Multiply weights"}
              </strong>
            </button>
          ))}
        </div>
        <button
          aria-pressed={selected === "sum"}
          onClick={() => setSelected("sum")}
        >
          Σ ={" "}
          {step >= 2
            ? formatNumber(trace.weightedSum)
            : "Inspect Sum contributions"}
        </button>
        <button
          aria-pressed={selected === "activation"}
          onClick={() => setSelected("activation")}
        >
          Bias {formatNumber(trace.bias)} · z ={" "}
          {step >= 3 ? formatNumber(trace.preActivation) : "Inspect Add bias"}
        </button>
        <button
          aria-pressed={selected === "output"}
          onClick={() => setSelected("output")}
        >
          Output ={" "}
          {step >= 5 ? formatNumber(trace.output) : "Inspect Final output"}
        </button>
      </div>
      <svg
        viewBox="0 0 700 360"
        className="diagram"
        role="img"
        aria-label="Neuron computation graph with input nodes, weighted sum, bias, activation and output"
      >
        <defs>
          <linearGradient id="wire-grad">
            <stop stopColor={palette.input} />
            <stop offset="1" stopColor={palette.weight} />
          </linearGradient>
        </defs>
        {inputs.map((input, i) => {
          const y = 74 + i * 100;
          return (
            <g
              key={i}
              opacity={
                selected.startsWith("input") && selected !== "input" + i
                  ? 0.45
                  : 1
              }
            >
              <path
                d={`M 117 ${y} Q 245 ${y} 290 174`}
                stroke={
                  step >= 1
                    ? weights[i] < 0
                      ? "#F6B679"
                      : palette.input
                    : "var(--line)"
                }
                fill="none"
                strokeWidth="4"
                strokeLinecap="round"
              />
              <circle
                cx="94"
                cy={y}
                r="30"
                fill="var(--panel)"
                stroke="var(--input)"
                strokeWidth="2"
              />
              <text x="94" y={y + 5} className="svg-main" textAnchor="middle">
                {formatNumber(input)}
              </text>
              <text
                x="198"
                y={y - 15}
                style={{ fill: "var(--weight)" }}
                className="svg-small"
                textAnchor="middle"
              >
                w={formatNumber(weights[i])}
              </text>
              <text x="210" y={y + 22} className="svg-em" textAnchor="middle">
                {step >= 1 ? formatNumber(trace.contributions[i]) : "×"}
              </text>
            </g>
          );
        })}
        <circle
          cx="320"
          cy="174"
          r="44"
          fill="var(--panel)"
          stroke="var(--input)"
          strokeWidth="2"
        />
        <text x="320" y="183" className="svg-sigma" textAnchor="middle">
          Σ
        </text>
        <path
          d="M 365 174 H 460"
          stroke={step >= 3 ? palette.input : "var(--line)"}
          strokeWidth="4"
        />
        <rect
          x="459"
          y="135"
          width="85"
          height="78"
          rx="20"
          fill="var(--panel)"
          stroke="var(--input)"
          strokeWidth="2"
        />
        <text x="501" y="182" className="svg-main" textAnchor="middle">
          f(z)
        </text>
        <path
          d="M 544 174 H 610"
          stroke={step >= 5 ? palette.input : "var(--line)"}
          strokeWidth="4"
        />
        <circle
          cx="634"
          cy="174"
          r="31"
          fill="var(--panel)"
          stroke="var(--input)"
          strokeWidth="2"
        />
        <text x="634" y="180" className="svg-main" textAnchor="middle">
          {step >= 5 ? formatNumber(trace.output) : "?"}
        </text>
        <rect
          x="269"
          y="257"
          width="105"
          height="48"
          rx="12"
          fill="#123A41"
          stroke="var(--input)"
        />
        <text x="321" y="286" className="svg-main" textAnchor="middle">
          b = {formatNumber(trace.bias)}
        </text>
        <path
          d="M 321 257 V 222"
          stroke="var(--input)"
          strokeWidth="3"
          strokeDasharray="4 5"
        />
        <text x="321" y="55" className="svg-label" textAnchor="middle">
          {step >= 2 ? `Sum: ${formatNumber(trace.weightedSum)}` : "SUM"}
        </text>
        <text x="501" y="110" className="svg-label" textAnchor="middle">
          {step >= 3
            ? `z = ${formatNumber(trace.preActivation)}`
            : "ACTIVATION"}
        </text>
        <text x="634" y="110" className="svg-label" textAnchor="middle">
          OUTPUT
        </text>
      </svg>
      <div className="node-inspector">
        <div
          className="node-controls"
          role="group"
          aria-label="Inspect computation nodes"
        >
          {[
            ...inputs.map((_, i) => ({
              id: "input" + i,
              label: "Input " + (i + 1),
            })),
            { id: "sum", label: "Weighted sum" },
            { id: "activation", label: "Bias & activation" },
            { id: "output", label: "Output" },
          ].map((node) => (
            <button
              key={node.id}
              aria-pressed={selected === node.id}
              onClick={() => setSelected(node.id)}
              aria-label={`Inspect ${node.label.toLowerCase()}`}
            >
              {node.label}
            </button>
          ))}
        </div>
        <p role="status">{detail}</p>
      </div>
    </div>
  );
}
