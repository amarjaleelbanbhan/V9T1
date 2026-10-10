import { CourseMap } from "../components/CourseMap";
import { learningBackup, parseBackup } from "../course/backup";
import { useState } from "react";
import { beginnerLessons } from "../course/catalog";
import { dueCards, recommendLesson } from "../course/learning";
import { useLearning } from "../course/useLearning";
import { readProgress, type Progress } from "../course/progress";
import { RecallPractice } from "../components/LessonLearning";
import type { RecallKind } from "../course/scaffolding";
export function LearningDashboard({
  onLesson,
}: {
  onLesson: (id: string) => void;
}) {
  const { state, saved, update } = useLearning(),
    [query, setQuery] = useState(""),
    [mode, setMode] = useState<"all" | "bookmarks">("all"),
    [card, setCard] = useState<string | null>(null),
    [message, setMessage] = useState("");
  let progress: Progress = {};
  try {
    progress = readProgress(localStorage);
  } catch {}
  const passed = Object.entries(progress)
    .filter(([id, p]) => (p as { passedAt?: number }).passedAt && beginnerLessons.some(l => l.id === id))
    .map(([id]) => id);
  const due = dueCards(state, Date.now()),
    next = recommendLesson(
      state,
      beginnerLessons.map((l) => l.id),
      passed,
      Date.now(),
    );
  const lesson = card
    ? beginnerLessons.find((l) => l.id === card.split(":")[0])
    : null;
  const recent = state.history.slice(-12).reverse();
  return (
    <section aria-label="Learning dashboard">
      <p className="eyebrow">YOUR BEGINNER WORKSPACE · LOCAL FIRST</p>
      <h1>
        Keep the learning moving<span className="dot">.</span>
      </h1>
      <p className="subtitle">
        Practice evidence, honest recall, explanations and a clear next step.
        Your data stays in this browser.
      </p>
      <div className="learning-stats">
        <section>
          <strong>{passed.length}/60</strong>
          <span>Guided practice criteria</span>
        </section>
        <section>
          <strong>{due.length}</strong>
          <span>Scheduled cards due</span>
        </section>
        <section>
          <strong>
            {state.history.filter((e) => e.kind === "recall").length}
          </strong>
          <span>Retained recall logs (max 2,000)</span>
        </section>
        <section>
          <strong>{Object.keys(state.drafts).length}</strong>
          <span>Explanation drafts</span>
        </section>
      </div>
      <section className="foundation-panel">
        <h2>Recommended next step</h2>
        <p>{next.reason}</p>
        <button onClick={() => onLesson(next.id)}>
          {beginnerLessons.find((l) => l.id === next.id)?.title}
        </button>
        <button onClick={() => onLesson(state.selected)}>
          Resume saved lesson
        </button>
        <p>
          Rule order: due recall → two recent mistakes on a topic → first
          incomplete guided topic. No hidden AI grade or automatic difficulty
          estimate.
        </p>
      </section>
      <CourseMap progress={progress} learning={state} onLesson={onLesson}/>
      <section className="foundation-panel">
        <h2>Spaced review queue</h2>
        <p>
          FSRS uses your ratings with default parameters and a 90% target
          retention setting. This is a scheduling model, not a measured
          retention rate. New cards are added when you attempt and rate recall
          in a lesson.
        </p>
        {due.length ? (
          due.slice(0, 12).map((id) => (
            <button key={id} onClick={() => setCard(id)}>
              Review{" "}
              {beginnerLessons.find((l) => l.id === id.split(":")[0])?.title} ·{" "}
              {id.split(":")[1]}
            </button>
          ))
        ) : (
          <p>
            No scheduled cards are due. Start recall in a lesson, or practice a
            new topic.
          </p>
        )}
        {lesson && (
          <RecallPractice
            key={card}
            lesson={lesson}
            initialKind={card!.split(":")[1] as RecallKind}
          />
        )}
      </section>
      <section className="foundation-panel">
        <h2>Search lessons and glossary</h2>
        <label className="writing-label">
          Search title or term
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            type="search"
          />
        </label>
        <div className="foundation-choices">
          <button aria-pressed={mode === "all"} onClick={() => setMode("all")}>
            All topics
          </button>
          <button
            aria-pressed={mode === "bookmarks"}
            onClick={() => setMode("bookmarks")}
          >
            Bookmarks
          </button>
        </div>
        <div className="glossary-results">
          {beginnerLessons
            .filter(
              (l) =>
                (mode === "all" || state.bookmarks.includes(l.id)) &&
                [l.title, ...l.terms.flat()]
                  .join(" ")
                  .toLowerCase()
                  .includes(query.toLowerCase()),
            )
            .map((l) => (
              <article key={l.id}>
                <button onClick={() => onLesson(l.id)}>{l.title}</button>
                <dl>
                  {l.terms.map(([w, d]) => (
                    <div key={w}>
                      <dt>{w}</dt>
                      <dd>{d}</dd>
                    </div>
                  ))}
                </dl>
              </article>
            ))}
        </div>
      </section>
      <section className="foundation-panel">
        <h2>Recent practice and recall</h2>
        {recent.length ? (
          <ol>
            {recent.map((e, i) => (
              <li key={i}>
                {new Date(e.at).toLocaleString()} · {e.id} ·{" "}
                {e.kind === "practice"
                  ? e.correct
                    ? "Practice correct"
                    : "Practice incorrect"
                  : ["", "Again", "Hard", "Good", "Easy"][e.rating]}
              </li>
            ))}
          </ol>
        ) : (
          <p>No attempts recorded in the new learning log yet.</p>
        )}
      </section>
      <section className="foundation-panel">
        <h2>Keep a backup</h2>
        <p>
          Export recall schedules, bookmarks, explanations, guided practice
          evidence and chapter reviews. No account or server sync is required.
        </p>
        <button
          onClick={() => {
            const blob = new Blob(
                [JSON.stringify(learningBackup(state, localStorage), null, 2)],
                { type: "application/json" },
              ),
              url = URL.createObjectURL(blob),
              a = document.createElement("a");
            a.href = url;
            a.download = "neurallab-learning.json";
            a.click();
            setTimeout(() => URL.revokeObjectURL(url), 1000);
          }}
        >
          Export learning backup
        </button>
        <label className="writing-label">
          Restore learning backup
          <input
            type="file"
            accept=".json,application/json"
            onChange={async (e) => {
              const f = e.target.files?.[0];
              if (!f) return;
              if (f.size > 2e6) {
                setMessage("Backup too large. Maximum 2 MB.");
                return;
              }
              try {
                const raw = await f.text();
                const parsed = parseBackup(raw);
                if (parsed.progress)
                  localStorage.setItem(
                    "neurallab.beginner.v1",
                    JSON.stringify(parsed.progress),
                  );
                if (parsed.chapters)
                  localStorage.setItem(
                    "neurallab.chapter-review.v1",
                    JSON.stringify(parsed.chapters),
                  );
                update(() => parsed.learning);
                setMessage(
                  "Restored valid learning records and practice evidence.",
                );
              } catch {
                setMessage(
                  "Could not restore this backup. Use a NeuralLab version 1 JSON export.",
                );
              }
            }}
          />
        </label>
        <p role="status">
          {message}{" "}
          {saved
            ? "Learning changes are saved."
            : "Storage unavailable; export before leaving."}
        </p>
      </section>
    </section>
  );
}
