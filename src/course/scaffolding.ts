import type { Lesson } from "./types";
export const chapterBridges: Record<
  string,
  {
    prerequisites: string[];
    analogy: string;
    limit: string;
    connection: string;
  }
> = {
  "CH-00": {
    prerequisites: [],
    analogy:
      "Think of a program as a recipe: values are ingredients and instructions transform them in a specified order.",
    limit:
      "A processor follows instructions; it cannot judge whether your recipe answers the intended question.",
    connection:
      "Vectors and derivatives in this chapter become neuron inputs and training gradients.",
  },
  "CH-01": {
    prerequisites: ["dl-00-004", "dl-00-006"],
    analogy:
      "A training split is a practice paper, validation is a rehearsal, and the untouched test set is the final assessment.",
    limit:
      "Repeatedly tuning on the final assessment leaks information; a single score does not establish real-world reliability.",
    connection:
      "Choose the task, split and metric before constructing a network.",
  },
  "CH-02": {
    prerequisites: ["dl-00-005", "dl-00-007"],
    analogy:
      "A weighted score combines several pieces of evidence. Bias shifts the baseline and activation transforms the score.",
    limit:
      "An artificial neuron is a mathematical function, not a faithful simulation of a biological cell.",
    connection:
      "A dense layer computes many weighted scores together; nonlinearities let layers represent nonlinear patterns.",
  },
  "CH-03": {
    prerequisites: ["dl-00-007", "dl-02-004"],
    analogy:
      "A tensor is an indexed collection: axes are coordinates, shape gives the allowed index ranges, and dtype sets the representation.",
    limit:
      "A tensor is not automatically a spatial object; a batch axis can enumerate independent examples.",
    connection: "Shape contracts must hold at each layer and in its gradients.",
  },
  "CH-04": {
    prerequisites: ["dl-02-004", "dl-03-001"],
    analogy:
      "A forward pass is an assembly line: each layer receives the preceding layer’s outputs.",
    limit:
      "A forward pass with fixed parameters makes a prediction; it does not update those parameters.",
    connection:
      "Record intermediate sums and activations here; backpropagation will reuse them.",
  },
  "CH-05": {
    prerequisites: ["dl-00-008", "dl-04-005"],
    analogy:
      "Loss is a height to descend; a gradient is the local uphill direction and the learning rate controls the step size.",
    limit:
      "The terrain changes with the model and data. A local downhill step does not guarantee a global optimum.",
    connection:
      "Backpropagation supplies the parameter derivatives used by the optimizer.",
  },
  "CH-06": {
    prerequisites: ["dl-00-008", "dl-04-004", "dl-05-004"],
    analogy:
      "Trace responsibility backward through a calculation: multiply local sensitivities along paths and add contributions where paths meet.",
    limit:
      "Gradients are derivatives, not amounts of blame or guarantees that a parameter is causally important.",
    connection:
      "Compare analytic gradients with finite differences, then use them in a training step.",
  },
  "CH-07": {
    prerequisites: ["dl-01-004", "dl-05-007", "dl-06-004"],
    analogy:
      "Training is repeated practice with checkpoints; validation checks transfer to examples that were not used for updates.",
    limit:
      "A lower training loss alone is not evidence of better generalization. Keep the test split untouched.",
    connection:
      "Combine batching, gradient calculation, optimization and validation in the beginner training project.",
  },
};
const topicPrerequisites: Record<string, string[]> = {
  "dl-00-002": ["dl-00-001"],
  "dl-00-007": ["dl-00-005"],
  "dl-00-008": ["dl-00-005"],
  "dl-01-005": ["dl-01-004"],
  "dl-01-007": ["dl-01-006", "dl-00-006"],
  "dl-02-005": ["dl-02-003"],
  "dl-02-006": ["dl-02-005"],
  "dl-02-007": ["dl-02-003", "dl-00-006"],
  "dl-03-002": ["dl-03-001"],
  "dl-03-003": ["dl-03-001"],
  "dl-03-004": ["dl-03-003"],
  "dl-03-007": ["dl-00-008", "dl-04-004"],
  "dl-04-003": ["dl-00-007", "dl-04-001"],
  "dl-04-004": ["dl-04-003", "dl-02-005"],
  "dl-05-002": ["dl-04-005"],
  "dl-05-003": ["dl-05-002"],
  "dl-05-005": ["dl-05-004"],
  "dl-05-006": ["dl-05-005"],
  "dl-06-002": ["dl-06-001"],
  "dl-06-003": ["dl-06-002", "dl-04-004"],
  "dl-06-004": ["dl-06-003"],
  "dl-06-005": ["dl-06-004"],
  "dl-06-006": ["dl-06-001"],
  "dl-06-007": ["dl-06-002"],
  "dl-07-003": ["dl-05-004"],
  "dl-07-004": ["dl-04-006"],
  "dl-07-005": ["dl-00-006"],
  "dl-07-006": ["dl-02-007"],
  "dl-07-007": ["dl-01-004"],
  "dl-07-008": ["dl-07-007"],
  "dl-07-009": ["dl-01-008", "dl-07-007"],
};
export function scaffolding(lesson: Lesson) {
  const bridge = chapterBridges[lesson.chapter];
  return {
    ...bridge,
    prerequisites: topicPrerequisites[lesson.id] || bridge.prerequisites,
    objective: `Predict ${lesson.target}, inspect the Python operations, and justify the result for a changed case.`,
    steps: [
      "Name each input and its unit or shape.",
      "Substitute the given inputs into the formula.",
      "Follow each operation in the Python trace; check signs, axes and boundaries.",
      "Compare your prediction, explain any difference, then change one input.",
    ],
  };
}
export type RecallKind = "concept" | "formula" | "mistake" | "number";
export function recallCard(lesson: Lesson, kind: RecallKind) {
  switch (kind) {
    case "concept":
      return {
        prompt: lesson.question,
        answer: lesson.choices[lesson.correct] + ". " + lesson.reason,
      };
    case "formula":
      return {
        prompt: `Reconstruct the rule for ${lesson.title}. Define the symbols and explain when the rule applies.`,
        answer: lesson.formula + "\n" + lesson.explanation,
      };
    case "mistake":
      return {
        prompt: `Find and repair this misconception: ${lesson.mistake}`,
        answer: lesson.debug,
      };
    case "number":
      return {
        prompt: `Without running the code, predict ${lesson.target} for the transfer inputs: ${lesson.cases[1].values.map((v, i) => `${lesson.labels[i] || "Input " + (i + 1)} = ${v}`).join("; ")}. Show your steps.`,
        answer: `Expected: ${lesson.cases[1].expected}. ${lesson.reason} Compare your working with the Python trace.`,
      };
  }
}
