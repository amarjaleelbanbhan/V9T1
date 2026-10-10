import { parseLearning, isLessonId, type LearningState } from "./learning.ts";
import { readProgress, type Progress } from "./progress.ts";
export function learningBackup(
  state: LearningState,
  storage: Pick<Storage, "getItem">,
) {
  let chapters: unknown = [];
  try {
    chapters = JSON.parse(
      storage.getItem("neurallab.chapter-review.v1") || "[]",
    );
  } catch {}
  return {
    ...state,
    courseProgress: Object.fromEntries(Object.entries(readProgress(storage)).filter(([id]) => isLessonId(id))),
    chapterReviews: Array.isArray(chapters)
      ? chapters.filter(
          (id) => typeof id === "string" && /^CH-0[0-7]$/.test(id),
        )
      : [],
  };
}
export function parseBackup(raw: string): {
  learning: LearningState;
  progress?: Progress;
  chapters?: string[];
} {
  const data = JSON.parse(raw);
  if (
    data?.version !== 1 ||
    !data.cards ||
    typeof data.cards !== "object" ||
    Array.isArray(data.cards) ||
    !Array.isArray(data.history) ||
    !data.drafts ||
    typeof data.drafts !== "object" ||
    !Array.isArray(data.bookmarks)
  )
    throw Error("Expected a NeuralLab version 1 learning backup");
  return {
    learning: parseLearning(raw),
    progress:
      data.courseProgress === undefined
        ? undefined
        : Object.fromEntries(Object.entries(readProgress({ getItem: () => JSON.stringify(data.courseProgress) })).filter(([id]) => isLessonId(id))),
    chapters:
      data.chapterReviews === undefined
        ? undefined
        : Array.isArray(data.chapterReviews)
          ? data.chapterReviews.filter(
              (id: unknown) => typeof id === "string" && /^CH-0[0-7]$/.test(id),
            )
          : [],
  };
}
