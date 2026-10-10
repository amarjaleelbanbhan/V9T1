import { useState } from "react";
import type { Lesson } from "../course/types";
import { beginnerLessons } from "../course/catalog";
import {
  scaffolding,
  recallCard,
  type RecallKind,
} from "../course/scaffolding";
import { scheduleRecall, Rating } from "../course/learning";
import { useLearning } from "../course/useLearning";
export function RecallPractice({
  lesson,
  initialKind = "concept",
}: {
  lesson: Lesson;
  initialKind?: RecallKind;
}) {
  const { state, update } = useLearning();
  const [kind, setKind] = useState<RecallKind>(initialKind),
    [answer, setAnswer] = useState(""),
    [reveal, setReveal] = useState(false),
    [message, setMessage] = useState("");
  const card = recallCard(lesson, kind),
    id = lesson.id + ":" + kind;
  return (
    <section className="foundation-panel" aria-label="Active recall">
      <p className="eyebrow">RETRIEVE BEFORE REVEAL · FSRS</p>
      <h3>Recall without looking</h3>
      <div className="foundation-choices">
        {(["concept", "formula", "number", "mistake"] as const).map((k) => (
          <button
            key={k}
            aria-pressed={kind === k}
            onClick={() => {
              setKind(k);
              setReveal(false);
              setAnswer("");
              setMessage("");
            }}
          >
            {k}
          </button>
        ))}
      </div>
      <p>{card.prompt}</p>
      <label className="writing-label">
        Your recalled answer
        <textarea
          value={answer}
          maxLength={4000}
          onChange={(e) => setAnswer(e.target.value)}
          disabled={reveal}
        />
      </label>
      <button
        disabled={!answer.trim() || reveal}
        onClick={() => setReveal(true)}
      >
        Reveal reference answer
      </button>
      {reveal && (
        <>
          <p className="recall-answer">{card.answer}</p>
          <p>
            Compare your reasoning. Rate retrieval honestly: Again = could not
            recall; Hard = recalled with difficulty; Good = correct; Easy =
            effortless. These are self-ratings, not automated mastery scores.
          </p>
          <div className="foundation-choices">
            {(
              [Rating.Again, Rating.Hard, Rating.Good, Rating.Easy] as const
            ).map((r) => (
              <button
                key={r}
                onClick={() => {
                  update((old) => scheduleRecall(old, id, r, Date.now()));
                  setReveal(false);
                  setAnswer("");
                  setMessage(`Recorded ${Rating[r]}.`);
                }}
              >
                {Rating[r]}
              </button>
            ))}
          </div>
        </>
      )}
      <p role="status">
        {message}{" "}
        {state.cards[id]
          ? `Next review: ${state.cards[id].due.toLocaleString()}`
          : "Not scheduled until you rate a recall attempt."}
      </p>
    </section>
  );
}
export function LessonLearning({
  lesson,
  onSelect,
}: {
  lesson: Lesson;
  onSelect: (id: string) => void;
}) {
  const { state, saved, update } = useLearning(),
    [checks, setChecks] = useState<string[]>([]);
  const s = scaffolding(lesson);
  const prompts = [
    "I defined the terms in plain language.",
    "I used a numerical example with units or shapes.",
    "I connected the code to each mathematical operation.",
    "I stated a boundary or failure case.",
    "I explained why the tempting wrong answer fails.",
  ];
  return (
    <>
      <section className="foundation-panel" aria-label="Lesson roadmap">
        <p className="eyebrow">
          UNDERSTAND → OBSERVE → INTERACT → PREDICT → PRACTICE → RECALL → APPLY
        </p>
        <h3>Goal and prerequisites</h3>
        <p>{s.objective}</p>
        {s.prerequisites.length ? (
          <div className="foundation-choices">
            {s.prerequisites.map((id) => (
              <button key={id} onClick={() => onSelect(id)}>
                Review prerequisite:{" "}
                {beginnerLessons.find((l) => l.id === id)?.title}
              </button>
            ))}
          </div>
        ) : (
          <p>
            No course prerequisite. Start with input, instruction and output.
          </p>
        )}
        <details>
          <summary>Intuition and a step-by-step hint</summary>
          <p>{s.analogy}</p>
          <p>{s.limit}</p>
          <ol>
            {s.steps.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ol>
          <p>{s.connection}</p>
        </details>
        <button
          aria-pressed={state.bookmarks.includes(lesson.id)}
          onClick={() =>
            update((old) => ({
              ...old,
              bookmarks: old.bookmarks.includes(lesson.id)
                ? old.bookmarks.filter((id) => id !== lesson.id)
                : [...old.bookmarks, lesson.id],
            }))
          }
        >
          {state.bookmarks.includes(lesson.id)
            ? "Remove bookmark"
            : "Bookmark this lesson"}
        </button>
      </section>
      <RecallPractice key={lesson.id} lesson={lesson} />
      <section className="foundation-panel" aria-label="Feynman explanation">
        <p className="eyebrow">EXPLAIN → FIND A GAP → REVISE</p>
        <h3>Teach it to a beginner</h3>
        <p>
          Explain {lesson.title.toLowerCase()} without relying on unexplained
          jargon. Use a concrete example, then compare with the lesson and
          revise.
        </p>
        <label className="writing-label">
          Your explanation
          <textarea
            value={state.drafts[lesson.id] || ""}
            maxLength={8000}
            onChange={(e) =>
              update((old) => ({
                ...old,
                drafts: { ...old.drafts, [lesson.id]: e.target.value },
              }))
            }
          />
        </label>
        <fieldset>
          <legend>Self-review checklist</legend>
          {prompts.map((p) => (
            <label className="check-label" key={p}>
              <input
                type="checkbox"
                checked={checks.includes(p)}
                onChange={(e) =>
                  setChecks((old) =>
                    e.target.checked ? [...old, p] : old.filter((x) => x !== p),
                  )
                }
              />
              {p}
            </label>
          ))}
        </fieldset>
        <p role="status">
          {saved
            ? "Draft saved on this browser."
            : "Storage unavailable; keep a copy of your draft."}{" "}
          {checks.length} / {prompts.length} self-review items checked. This
          checklist does not grade understanding.
        </p>
      </section>
    </>
  );
}
