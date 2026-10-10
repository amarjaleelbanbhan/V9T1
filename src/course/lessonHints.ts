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
  // ---------------------------------------------------------------------
  // Issue #18: chapter 06. Uncomment and fill each entry.
  // Run `node --experimental-strip-types scripts/author-hints.mjs CH-06`
  // to see each lesson's own wording and the generic text you are replacing.
  //
  // "dl-06-001": { attention: "", rule: "" },   // derivative        - local derivative
  // "dl-06-002": { attention: "", rule: "" },   // chain             - dy/dx
  // "dl-06-003": { attention: "", rule: "" },   // hidden-delta      - hidden delta
  // "dl-06-004": { attention: "", rule: "" },   // weight-gradient   - first hidden-weight gradient
  // "dl-06-005": { attention: "", rule: "" },   // autograd          - reverse-mode derivative
  // "dl-06-006": { attention: "", rule: "" },   // finite-difference - estimated derivative
  // "dl-06-007": { attention: "", rule: "" },   // depth             - path gradient
  // ---------------------------------------------------------------------
  "dl-00-001": {
    attention:
      "Instructions run in the order they are written. Find which of your inputs is touched first, and note that changing that order would change the answer.",
    rule: "A program is a sequence, not a formula that settles all at once. Apply one operation, keep its output, then apply the next to that output.",
  },
};
