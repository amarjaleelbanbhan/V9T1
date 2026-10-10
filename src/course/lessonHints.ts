/**
 * Per-lesson wording for hint levels 1 and 2.
 *
 * Levels 3 and 4 are generated from the executed Python trace and are never
 * authored by hand. Levels 1 and 2 fall back to a generic form built from the
 * lesson's labels, formula and terms; an entry here replaces that fallback with
 * something specific to the idea being taught.
 *
 * Rules for authoring:
 *  - `attention` points at a quantity or a relationship. It must not state the
 *    rule, and it must never contain the answer or any intermediate value.
 *  - `rule` states the rule and defines its symbols. It may restate the formula
 *    but must not substitute the lesson's own case values into it.
 *  - Keep both under roughly 300 characters. These are nudges, not paragraphs.
 */
export interface LessonHintCopy {
  attention?: string;
  rule?: string;
}

export const lessonHints: Record<string, LessonHintCopy> = {
  "dl-06-001": {
    attention: "Picture a small move to the right on the squared curve. Does its height rise or fall near the current input? The height and its local slope are different quantities.",
    rule: "For y = x², dy/dx is twice x. Here x is the immediate input; dy/dx measures the local change in y per change in x, rather than the current height y.",
  },
  "dl-06-002": {
    attention: "Follow the dependency from x to the scaled intermediate, then to its square. Which sensitivity belongs to each link in that same path?",
    rule: "The chain rule is dy/dx = (dy/du) × (du/dx). For u = sx and y = u², dy/du is twice u and du/dx is s; s is the scale and u is the intermediate value.",
  },
  "dl-06-003": {
    attention: "Locate the hidden preactivation before looking at the output error. Is that hidden unit on the active or inactive side of its ReLU?",
    rule: "δ_hidden = δ_output × w_output × ReLU′(z_hidden). δ_output is prediction minus target for half squared loss. w_output carries sensitivity backward; the activation derivative gates it, with a zero subgradient at the corner here.",
  },
  "dl-06-004": {
    attention: "Mark the signal entering the hidden weight, then compare how a change in that weight and a change in its bias enter the preactivation. Are their local sensitivities the same?",
    rule: "dL/dw = δ × x and dL/db = δ. δ is loss sensitivity to this unit's preactivation, x enters the weight, and the bias enters additively with unit sensitivity.",
  },
  "dl-06-005": {
    attention: "The squared input appears through two multiplication paths. Follow both backward, then distinguish saved gradient buffers from the model's parameter values.",
    rule: "Reverse mode multiplies local sensitivities along a path and adds contributions where paths meet. For y = sx², dy/dx = sx + sx. x is the reused input and s is the scale; clear buffers between independent updates.",
  },
  "dl-06-006": {
    attention: "Look at the two input positions on either side of x. How far apart are they? Consider what happens when their computed outputs become almost indistinguishable.",
    rule: "The central difference divides f(x+h) − f(x−h) by twice h. x is the center and h is a positive perturbation. This estimates a smooth local slope; very small h can expose floating-point cancellation.",
  },
  "dl-06-007": {
    attention: "Follow the same sensitivity through each layer in the path. Does each link shrink, preserve, or enlarge the signal that arrives from the previous link?",
    rule: "A path gradient is the product of its local factors. With a shared factor f across d links it is f^d; f is local sensitivity and d is path depth. Clipping caps large magnitudes without restoring a vanished signal.",
  },
  "dl-00-001": {
    attention:
      "Instructions run in the order they are written. Find which of your inputs is touched first, and note that changing that order would change the answer.",
    rule: "A program is a sequence, not a formula that settles all at once. Apply one operation, keep its output, then apply the next to that output.",
  },
};

