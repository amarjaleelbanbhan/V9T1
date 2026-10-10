import { TransferPrediction } from "../components/TransferPrediction";
import { PythonProgram } from "../components/PythonProgram";
import { useMemo, useState } from "react";
import { ChevronRight, Boxes, RotateCcw, CircleHelp } from "lucide-react";
import {
  DEMO_VECTOR,
  DEMO_MATRIX,
  DEMO_BATCH,
  tensorShape,
  tensorRank,
  tensorAt,
  sliceMatrix,
  selectBatchSample,
  type Tensor,
} from "../engine/tensor";
type Mode = "scalar" | "vector" | "matrix" | "batch";
const labels: { id: Mode; title: string }[] = [
  { id: "scalar", title: "0D · Scalar" },
  { id: "vector", title: "1D · Vector" },
  { id: "matrix", title: "2D · Matrix" },
  { id: "batch", title: "3D · Stack" },
];
const formatShape = (d: number[]) =>
  d.length === 0
    ? "()"
    : "(" + d.join(", ") + (d.length === 1 ? "," : "") + ")";
export function TensorLab() {
  const [mode, setMode] = useState<Mode>("batch");
  const [sample, setSample] = useState(0);
  const [rowStart, setRowStart] = useState(0);
  const [rowStop, setRowStop] = useState(3);
  const [colStart, setColStart] = useState(0);
  const [colStop, setColStop] = useState(3);
  const [answer, setAnswer] = useState<"rank" | "length" | null>(null);
  const tensor: Tensor =
    mode === "scalar"
      ? 7
      : mode === "vector"
        ? DEMO_VECTOR
        : mode === "matrix"
          ? DEMO_MATRIX
          : DEMO_BATCH;
  const shape = tensorShape(tensor);
  const matrix =
    mode === "batch" ? selectBatchSample(DEMO_BATCH, sample) : DEMO_MATRIX;
  const crop = useMemo(
    () => sliceMatrix(matrix, rowStart, rowStop, colStart, colStop),
    [matrix, rowStart, rowStop, colStart, colStop],
  );
  const selectedValue =
    mode === "batch"
      ? tensorAt(DEMO_BATCH, [sample, rowStart, colStart])
      : mode === "matrix"
        ? tensorAt(DEMO_MATRIX, [rowStart, colStart])
        : mode === "vector"
          ? tensorAt(DEMO_VECTOR, [0])
          : 7;
  const reset = () => {
    setSample(0);
    setRowStart(0);
    setRowStop(3);
    setColStart(0);
    setColStop(3);
    setAnswer(null);
  };
  return (
    <div className="foundation-page tensor-lab">
      <div className="heading">
        <div>
          <div className="crumb">
            <span>LECTURE 03</span>
            <ChevronRight size={15} />
            <span>MATHEMATICAL BUILDING BLOCKS</span>
          </div>
          <h1>
            See the shape of data<span className="dot">.</span>
          </h1>
          <p className="subtitle">
            Inspect rank, shape, axes and slices with actual tensor values.
          </p>
        </div>
        <div className="module-chip">
          <Boxes size={15} /> INTERACTIVE TENSORS
        </div>
      </div>
      <section className="foundation-panel">
        <div className="foundation-panel-heading">
          <div>
            <p className="eyebrow">DISCOVER · DATA DIMENSIONS</p>
            <h2>The same numbers can have different structures.</h2>
          </div>
          <Boxes size={21} />
        </div>
        <div
          role="group"
          aria-label="Choose tensor rank"
          className="activation-kind-buttons"
        >
          {labels.map((item) => (
            <button
              key={item.id}
              type="button"
              className={mode === item.id ? "picked" : ""}
              aria-pressed={mode === item.id}
              onClick={() => {
                setMode(item.id);
                reset();
              }}
            >
              {item.title}
            </button>
          ))}
        </div>
        <div className="tensor-layout">
          <div className="foundation-chart-card">
            <div className="tensor-metrics">
              <div>
                <span>Rank · ndim</span>
                <strong data-testid="tensor-rank">{tensorRank(tensor)}</strong>
              </div>
              <div>
                <span>Shape</span>
                <strong data-testid="tensor-shape">{formatShape(shape)}</strong>
              </div>
              <div>
                <span>Data type</span>
                <strong>float64 (Python example)</strong>
              </div>
            </div>
            <div
              className="tensor-visual"
              role="group"
              aria-label={
                "Tensor of rank " +
                shape.length +
                " and shape " +
                formatShape(shape)
              }
            >
              {mode === "scalar" ? (
                <div className="tensor-cell scalar">{String(tensor)}</div>
              ) : mode === "vector" ? (
                <div className="tensor-row">
                  {DEMO_VECTOR.map((v, i) => (
                    <div className="tensor-cell" key={i}>
                      <small>[{i}]</small>
                      {v}
                    </div>
                  ))}
                </div>
              ) : (
                <div
                  className="tensor-matrix"
                  aria-label="Selected matrix values"
                >
                  {matrix.map((row, i) => (
                    <div className="tensor-row" key={i}>
                      {row.map((v, j) => (
                        <button
                          type="button"
                          aria-label={`Select tensor cell ${i},${j}: ${v}`}
                          aria-pressed={
                            i >= rowStart &&
                            i < rowStop &&
                            j >= colStart &&
                            j < colStop
                          }
                          onClick={() => {
                            setRowStart(i);
                            setRowStop(i + 1);
                            setColStart(j);
                            setColStop(j + 1);
                          }}
                          key={j}
                          className={
                            "tensor-cell " +
                            (i >= rowStart &&
                            i < rowStop &&
                            j >= colStart &&
                            j < colStop
                              ? "selected"
                              : "")
                          }
                        >
                          <small>{"[" + i + "," + j + "]"}</small>
                          {v}
                        </button>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
            {(mode === "matrix" || mode === "batch") && (
              <p className="selected-region" role="status">
                Selected [{rowStart}:{rowStop}, {colStart}:{colStop}] → shape{" "}
                {formatShape(tensorShape(crop))}; values {JSON.stringify(crop)}.
                Select a cell to focus its row and column.
              </p>
            )}
            <p className="foundation-mini">
              A scalar is rank 0. A vector of 4 values is rank 1 with shape
              (4,), not rank 4. Run the matching NumPy program below to inspect
              actual Python shape, dtype and slices.
            </p>
            {mode === "batch" && (
              <p className="foundation-note">
                The leading dimension is the samples axis: two samples, each a 3
                × 3 matrix. Select either sample with the control.
              </p>
            )}
          </div>
          <div className="foundation-parameter-card">
            <div className="foundation-parameter-header">
              <h3>Tensor inspector</h3>
              <button type="button" onClick={reset}>
                <RotateCcw size={15} /> Reset
              </button>
            </div>
            {mode === "batch" && (
              <label className="foundation-range" htmlFor="tensor-sample">
                <span>
                  Sample index <strong>{sample}</strong>
                </span>
                <input
                  id="tensor-sample"
                  type="range"
                  min="0"
                  max="1"
                  step="1"
                  value={sample}
                  onChange={(e) => setSample(Number(e.target.value))}
                />
              </label>
            )}
            {mode === "matrix" || mode === "batch" ? (
              <>
                <p className="eyebrow">SLICE · END INDEX EXCLUDED</p>
                <label className="foundation-range" htmlFor="tensor-row-start">
                  <span>
                    Row start <strong>{rowStart}</strong>
                  </span>
                  <input
                    id="tensor-row-start"
                    type="range"
                    min="0"
                    max={rowStop - 1}
                    step="1"
                    value={rowStart}
                    onChange={(e) => setRowStart(Number(e.target.value))}
                  />
                </label>
                <label className="foundation-range" htmlFor="tensor-row-stop">
                  <span>
                    Row stop (exclusive) <strong>{rowStop}</strong>
                  </span>
                  <input
                    id="tensor-row-stop"
                    type="range"
                    min={rowStart + 1}
                    max="3"
                    step="1"
                    value={rowStop}
                    onChange={(e) => setRowStop(Number(e.target.value))}
                  />
                </label>
                <label className="foundation-range" htmlFor="tensor-col-start">
                  <span>
                    Column start <strong>{colStart}</strong>
                  </span>
                  <input
                    id="tensor-col-start"
                    type="range"
                    min="0"
                    max={colStop - 1}
                    step="1"
                    value={colStart}
                    onChange={(e) => setColStart(Number(e.target.value))}
                  />
                </label>
                <label className="foundation-range" htmlFor="tensor-col-stop">
                  <span>
                    Column stop (exclusive) <strong>{colStop}</strong>
                  </span>
                  <input
                    id="tensor-col-stop"
                    type="range"
                    min={colStart + 1}
                    max="3"
                    step="1"
                    value={colStop}
                    onChange={(e) => setColStop(Number(e.target.value))}
                  />
                </label>
                <div className="tensor-inspect-result">
                  <span>
                    Slice: [{rowStart}:{rowStop}, {colStart}:{colStop}]
                  </span>
                  <strong data-testid="tensor-slice-shape">
                    {formatShape(tensorShape(crop))}
                  </strong>
                  <small data-testid="tensor-slice-values">
                    {JSON.stringify(crop)}
                  </small>
                </div>
              </>
            ) : (
              <div className="tensor-inspect-result">
                <span>Indexed value</span>
                <strong data-testid="tensor-index-value">
                  {selectedValue}
                </strong>
                <small>
                  {mode === "vector"
                    ? "The first index selects the first vector element."
                    : "A 0D scalar needs no index."}
                </small>
              </div>
            )}
            <p className="foundation-mini">
              Changing a range updates the actual cropped values. A slice
              includes its start index and excludes its stop index.
            </p>
          </div>
        </div>
      </section>
      <section className="foundation-panel foundation-review">
        <div>
          <p className="eyebrow">QUIZ · TENSOR DIMENSIONS</p>
          <h2>
            <CircleHelp size={19} /> A vector containing 10 values has which
            rank?
          </h2>
        </div>
        <div className="foundation-review-actions">
          <button
            type="button"
            className={answer === "rank" ? "picked" : ""}
            aria-pressed={answer === "rank"}
            onClick={() => setAnswer("rank")}
          >
            Rank 1
          </button>
          <button
            type="button"
            className={answer === "length" ? "picked" : ""}
            aria-pressed={answer === "length"}
            onClick={() => setAnswer("length")}
          >
            Rank 10
          </button>
          {answer && (
            <div role="status" className="foundation-answer">
              {answer === "rank"
                ? "Correct: rank counts axes, not elements. The shape is (10,)."
                : "Not quite. Ten elements make the vector length 10, but it still has one axis, so rank is 1."}
            </div>
          )}
        </div>
      </section>
      <TransferPrediction
        prompt="A fresh 4×5 matrix is sliced [1:4, 2:4]. How many values remain?"
        expected={3 * 2}
        explanation="Three rows and two columns remain; stop indices are excluded."
      />
      <p className="footnote">
        Course mapping: Chapter 2 and Lecture 03, tensor rank/shape/data type,
        samples axis, and slicing. This lab uses small teaching arrays rather
        than downloading MNIST.
      </p>
      <PythonProgram
        source={`import numpy as np\nx = np.array(${JSON.stringify(tensor)}, dtype=np.float64)\nprint("shape:", x.shape, "rank:", x.ndim, "dtype:", x.dtype)\n${mode === "batch" ? `matrix = x[${sample}]\n` : mode === "matrix" ? "matrix = x\n" : ""}${mode === "batch" || mode === "matrix" ? `result = matrix[${rowStart}:${rowStop}, ${colStart}:${colStop}].tolist()` : "result = x.tolist()"}\nprint(result)`}
        numpy
      />
    </div>
  );
}
