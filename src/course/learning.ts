import { createEmptyCard, fsrs, Rating, type Card, type Grade } from "ts-fsrs";
export { Rating };
export interface RecallEvent {
  id: string;
  at: number;
  rating: Grade;
  due: number;
  kind: "recall";
}
export interface MistakeEvent {
  id: string;
  at: number;
  correct: boolean;
  kind: "practice";
}
export interface LearningState {
  version: 1;
  cards: Record<string, Card>;
  history: (RecallEvent | MistakeEvent)[];
  drafts: Record<string, string>;
  bookmarks: string[];
  selected: string;
}
export const LEARNING_KEY = "neurallab.learning.v1";
export const emptyLearning = (): LearningState => ({
  version: 1,
  cards: {},
  history: [],
  drafts: {},
  bookmarks: [],
  selected: "dl-00-001",
});
const topicCounts = [8, 9, 7, 7, 6, 7, 7, 9];
export function isLessonId(id: string) {
  const match = /^dl-0([0-7])-(\d{3})$/.exec(id);
  return !!match && Number(match[2]) >= 1 && Number(match[2]) <= topicCounts[Number(match[1])];
}
const validId = (id: unknown) => {
  if (typeof id !== "string" || id.split(":").length > 2) return false;
  const [lesson, kind] = id.split(":");
  return isLessonId(lesson) && (kind === undefined || ["concept", "formula", "mistake", "number"].includes(kind));
};
const engine = fsrs({ enable_fuzz: false, request_retention: 0.9 });
export function parseLearning(raw: string | null): LearningState {
  try {
    const v = JSON.parse(raw || "null");
    if (v?.version !== 1) return emptyLearning();
    const out = emptyLearning();
    for (const [id, value] of Object.entries(v.cards || {})) {
      if (!validId(id)) continue;
      const c = value as Card;
      const due = new Date(c.due),
        last = c.last_review ? new Date(c.last_review) : undefined;
      if (
        !Number.isFinite(due.getTime()) ||
        (last && !Number.isFinite(last.getTime())) ||
        ![0, 1, 2, 3].includes(c.state) ||
        ![
          c.reps,
          c.lapses,
          c.learning_steps,
          c.elapsed_days,
          c.scheduled_days,
        ].every((n) => Number.isInteger(n) && n >= 0) ||
        ![c.stability, c.difficulty].every(
          (n) => Number.isFinite(n) && n >= 0,
        ) ||
        c.difficulty > 10
      )
        continue;
      out.cards[id] = { ...c, due, last_review: last };
    }
    out.history = (Array.isArray(v.history) ? v.history : [])
      .filter(
        (e: RecallEvent | MistakeEvent) =>
          e &&
          validId(e.id) &&
          Number.isFinite(e.at) &&
          e.at >= 0 &&
          (e.kind === "practice"
            ? typeof e.correct === "boolean"
            : e.kind === "recall" &&
              [1, 2, 3, 4].includes(e.rating) &&
              Number.isFinite(e.due)),
      )
      .slice(-2000);
    for (const [id, d] of Object.entries(v.drafts || {}))
      if (isLessonId(id) && typeof d === "string")
        out.drafts[id] = d.slice(0, 8000);
    out.bookmarks = (Array.isArray(v.bookmarks) ? v.bookmarks : [])
      .filter((id: unknown) => typeof id === "string" && isLessonId(id))
      .slice(0, 60);
    if (typeof v.selected === "string" && isLessonId(v.selected))
      out.selected = v.selected;
    return out;
  } catch {
    return emptyLearning();
  }
}
export function scheduleRecall(
  state: LearningState,
  id: string,
  rating: Grade,
  now: number,
): LearningState {
  if (
    !validId(id) ||
    ![1, 2, 3, 4].includes(rating) ||
    !Number.isFinite(now) ||
    now < 0
  )
    throw Error("Invalid review");
  const next = engine.repeat(
    state.cards[id] || createEmptyCard(new Date(now)),
    new Date(now),
  )[rating].card;
  return {
    ...state,
    cards: { ...state.cards, [id]: next },
    history: [
      ...state.history,
      { kind: "recall" as const, id, at: now, rating, due: next.due.getTime() },
    ].slice(-2000),
  };
}
export function practiceEvent(
  state: LearningState,
  id: string,
  correct: boolean,
  now: number,
): LearningState {
  return {
    ...state,
    history: [
      ...state.history,
      { kind: "practice" as const, id, correct, at: now },
    ].slice(-2000),
  };
}
export function dueCards(state: LearningState, now: number) {
  return Object.keys(state.cards)
    .filter((id) => state.cards[id].due.getTime() <= now)
    .sort(
      (a, b) => state.cards[a].due.getTime() - state.cards[b].due.getTime(),
    );
}
export function recommendLesson(
  state: LearningState,
  orderedIds: string[],
  passedIds: string[],
  now: number,
) {
  const due = dueCards(state, now)[0];
  if (due)
    return { id: due.split(":")[0], reason: "A scheduled recall card is due." };
  const recent = state.history.filter((e) => e.kind === "practice").slice(-8);
  const failed = recent.filter((e) => e.kind === "practice" && !e.correct);
  const repeated = failed.find(
    (e) => failed.filter((f) => f.id === e.id).length >= 2,
  );
  if (repeated)
    return {
      id: repeated.id,
      reason:
        "Two recent incorrect attempts: revisit the explanation and its prerequisite before retrying.",
    };
  return {
    id: orderedIds.find((id) => !passedIds.includes(id)) || orderedIds[0],
    reason:
      passedIds.length === orderedIds.length
        ? "All guided practice criteria met. Use mixed reviews and the training project."
        : "Continue with the first topic whose guided practice is incomplete.",
  };
}
