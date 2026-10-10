import { useEffect, useRef, type MouseEvent } from "react";
import { ArrowUpRight, BookOpen, FlaskConical, Map, X } from "lucide-react";
import { curriculum } from "../content/curriculum";
import type { ActiveLesson } from "../store/workspace";

type Props = {
  active: ActiveLesson;
  open: boolean;
  close: () => void;
  navigate: (id: ActiveLesson, topic?: string) => void;
};
const tools: { id: ActiveLesson; label: string; note: string }[] = [
  {
    id: "training-project",
    label: "Beginner training project",
    note: "Train, validate, compare",
  },
  {
    id: "python",
    label: "Python execution lab",
    note: "Inspect a running program",
  },
  {
    id: "python-workshop",
    label: "Editable Python workshop",
    note: "Write and test your own code",
  },
  {
    id: "math-workshop",
    label: "Matrix and loss workshop",
    note: "Explore products and landscapes",
  },
];
export function WorkspaceNavigation({ active, open, close, navigate }: Props) {
  const host = useRef<HTMLElement>(null);
  const restore = useRef<HTMLElement | null>(null);
  useEffect(() => {
    if (!open) return;
    restore.current = document.activeElement as HTMLElement;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    host.current?.querySelector<HTMLButtonElement>("button")?.focus();
    const keyboard = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
      }
      if (event.key === "Tab") {
        const items = Array.from(
          host.current?.querySelectorAll<HTMLElement>(
            "button:not(:disabled), a[href], summary",
          ) ?? [],
        ).filter((el) => el.getClientRects().length);
        const first = items[0],
          last = items.at(-1);
        if (!host.current?.contains(document.activeElement)) {
          event.preventDefault();
          first?.focus();
        } else if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener("keydown", keyboard);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", keyboard);
      restore.current?.focus();
    };
  }, [open, close]);
  useEffect(() => {
    const desktop = matchMedia("(min-width: 901px)");
    const sync = () => {
      if (desktop.matches && open) close();
    };
    desktop.addEventListener("change", sync);
    sync();
    return () => desktop.removeEventListener("change", sync);
  }, [open, close]);
  const go = (id: ActiveLesson, topic?: string) => {
    navigate(id, topic);
    close();
  };
  const link = (
    event: MouseEvent<HTMLAnchorElement>,
    id: ActiveLesson,
    topic?: string,
  ) => {
    if (
      event.button === 0 &&
      !event.ctrlKey &&
      !event.metaKey &&
      !event.shiftKey &&
      !event.altKey
    ) {
      event.preventDefault();
      go(id, topic);
    }
  };
  const item = (lesson: (typeof curriculum)[number], index: number) => (
    <a
      href={
        lesson.id === "optimizers"
          ? "#/lab/beginner?topic=dl-05-005"
          : `#/lab/${lesson.id}`
      }
      key={lesson.id}
      className={
        "lesson-item lesson-ready " + (active === lesson.id ? "current" : "")
      }
      aria-current={active === lesson.id ? "page" : undefined}
      onClick={(e) =>
        lesson.id === "optimizers"
          ? link(e, "beginner", "dl-05-005")
          : link(e, lesson.id as ActiveLesson)
      }
    >
      <span className="lesson-number">
        {String(index + 1).padStart(2, "0")}
      </span>
      <span className="lesson-name">
        {lesson.title}
        <small>{lesson.week}</small>
      </span>
      {active === lesson.id && <ArrowUpRight size={14} aria-hidden="true" />}
    </a>
  );
  return (
    <>
      {open && (
        <button
          className="nav-scrim"
          aria-label="Close lesson navigation"
          onClick={close}
          tabIndex={-1}
        />
      )}
      <aside
        ref={host}
        className={"sidebar " + (open ? "sidebar-open" : "")}
        id="course-navigation"
        aria-label="Learning navigation"
        role={open ? "dialog" : undefined}
        aria-modal={open ? true : undefined}
      >
        <div className="side-title">
          <div className="sidebar-kicker">
            <p className="eyebrow">THE LEARNING ATLAS</p>
            <button
              className="drawer-close"
              onClick={close}
              aria-label="Close navigation"
            >
              <X size={20} />
            </button>
          </div>
          <h2>Make it make sense.</h2>
          <p>A number. A connection. An idea.</p>
        </div>
        <div className="path-entry">
          <BookOpen size={20} />
          <div>
            <span>New to deep learning?</span>
            <button onClick={() => go("beginner")}>
              Start beginner course <ArrowUpRight size={16} />
            </button>
          </div>
        </div>
        <nav aria-label="Course lessons" className="lesson-nav">
          <p className="nav-group-title">
            <FlaskConical size={14} /> Experiment labs{" "}
            <span>{curriculum.filter((l) => l.status === "ready").length}</span>
          </p>
          {curriculum.filter((l) => l.status === "ready").map(item)}
        </nav>
        <section className="tool-navigation" aria-label="Workshops">
          <p className="nav-group-title">Build & investigate</p>
          {tools.map((tool) => (
            <button
              key={tool.id}
              className={"tool-link " + (active === tool.id ? "current" : "")}
              aria-label={tool.label}
              aria-describedby={`${tool.id}-note`}
              aria-current={active === tool.id ? "page" : undefined}
              onClick={() => go(tool.id)}
            >
              <span>
                {tool.label}
                <small id={`${tool.id}-note`}>{tool.note}</small>
              </span>
              <ArrowUpRight size={14} />
            </button>
          ))}
        </section>
        <div className="atlas-link">
          <Map size={18} />
          <button onClick={() => go("library")}>Browse full curriculum</button>
        </div>
        <details className="planned-topics">
          <summary>
            On the horizon ·{" "}
            {curriculum.filter((l) => l.status === "planned").length} planned
            labs
          </summary>
          {curriculum
            .filter((l) => l.status === "planned")
            .map((l) => (
              <p key={l.id}>
                {l.title}
                <small>Planned</small>
              </p>
            ))}
        </details>
        <p className="sidebar-footnote">
          Explore freely. Practice evidence lives in My learning.
        </p>
      </aside>
    </>
  );
}
