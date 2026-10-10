import { useEffect, useRef, useState } from "react";
import { MarkdownDocument } from "../components/MarkdownDocument";
import { useWorkspaceSelection } from "../store/workspace";
import catalog from "../../curriculum/deep-learning/catalog.json";
const documents = import.meta.glob("../../curriculum/deep-learning/**/*.md", {
  query: "?raw",
  import: "default",
}) as Record<string, () => Promise<string>>;
const prefix = "../../curriculum/deep-learning/";
const ids = Object.keys(documents).map((path) => path.slice(prefix.length));
export function CurriculumLibrary() {
  const [documentId, selectDocument] = useWorkspaceSelection(
    "library",
    "document",
    [...ids, ""],
    "",
  );
  const documentPath = documentId ? prefix + documentId : null;
  const current = catalog.chapters.find((chapter) =>
    documentId.startsWith(chapter.slug + "/"),
  );
  const [source, setSource] = useState("");
  const [state, setState] = useState<"loading" | "ready" | "failed">("loading");
  const [retry, setRetry] = useState(0);
  const [query, setQuery] = useState("");
  const [level, setLevel] = useState("all");
  const detail = useRef<HTMLElement>(null);
  const results = useRef<HTMLElement>(null);
  const returnScroll = useRef(0);
  const filtered = catalog.chapters.filter(
    (chapter) =>
      (level === "all" || String(chapter.level) === level) &&
      [
        chapter.title,
        chapter.definition,
        ...catalog.lessons
          .filter((lesson) => lesson.chapter === chapter.id)
          .map((lesson) => lesson.title),
      ]
        .join(" ")
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  useEffect(() => {
    if (!documentPath) return;
    let alive = true;
    setState("loading");
    documents[documentPath]()
      .then((value) => {
        if (alive) {
          setSource(value);
          setState("ready");
        }
      })
      .catch(() => {
        if (alive) setState("failed");
      });
    return () => {
      alive = false;
    };
  }, [documentPath, retry]);
  useEffect(() => {
    if (documentId) {
      detail.current?.focus({ preventScroll: true });
      detail.current?.scrollIntoView({ block: "start" });
    } else {
      results.current?.focus({ preventScroll: true });
      window.scrollTo(0, returnScroll.current);
    }
  }, [documentId]);
  const open = (id: string) => {
    returnScroll.current = window.scrollY;
    selectDocument(id);
  };
  return (
    <section aria-label="Deep learning research library">
      <p className="eyebrow">ZERO TO ADVANCED · RESEARCH LIBRARY</p>
      <h1>
        Explore your learning path<span className="dot">.</span>
      </h1>
      <p className="subtitle">
        19 chapters. Authored reference documents and planned specifications;
        implemented practice is available in the beginner course.
      </p>
      <div
        className={"library-workspace " + (documentId ? "library-reading" : "")}
      >
        <nav
          ref={results}
          tabIndex={-1}
          className="library-index"
          aria-label="Chapter search results"
        >
          <div className="curriculum-tools">
            <label>
              Search topics
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Try tensors, attention, leakage"
              />
            </label>
            <label>
              Level
              <select
                value={level}
                onChange={(event) => setLevel(event.target.value)}
              >
                <option value="all">All levels</option>
                {Array.from({ length: 8 }, (_, i) => (
                  <option key={i} value={i}>
                    Level {i}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <p role="status">
            {filtered.length
              ? `${filtered.length} chapters match`
              : "No chapters match. Try another search or level."}
          </p>
          <details className="library-general-references">
            <summary>General curriculum references</summary>
            <ul>
              {ids
                .filter(
                  (id) =>
                    !catalog.chapters.some((chapter) =>
                      id.startsWith(chapter.slug + "/"),
                    ),
                )
                .map((id) => (
                  <li key={id}>
                    <a
                      href={`#/lab/library?document=${encodeURIComponent(id)}`}
                      onClick={(event) => {
                        if (
                          !event.ctrlKey &&
                          !event.metaKey &&
                          !event.shiftKey &&
                          event.button === 0
                        ) {
                          event.preventDefault();
                          open(id);
                        }
                      }}
                    >
                      {id}
                    </a>
                  </li>
                ))}
            </ul>
          </details>
          {filtered.map((chapter) => (
            <article className="chapter-card" key={chapter.id}>
              <span className="chapter-status">
                {chapter.id} · LEVEL {chapter.level} ·{" "}
                {chapter.status.toUpperCase()}
              </span>
              <h2>
                <a
                  href={`#/lab/library?document=${encodeURIComponent(chapter.slug + "/README.md")}`}
                  onClick={(event) => {
                    if (
                      !event.ctrlKey &&
                      !event.metaKey &&
                      !event.shiftKey &&
                      event.button === 0
                    ) {
                      event.preventDefault();
                      open(chapter.slug + "/README.md");
                    }
                  }}
                >
                  Read {chapter.title} specification
                </a>
              </h2>
              <p>{chapter.definition}</p>
              <details>
                <summary>Topics and reference documents</summary>
                <ul className="chapter-topics">
                  {catalog.lessons
                    .filter((lesson) => lesson.chapter === chapter.id)
                    .map((lesson) => (
                      <li key={lesson.id}>{lesson.title}</li>
                    ))}
                </ul>
                <ul>
                  {ids
                    .filter(
                      (id) =>
                        id.startsWith(chapter.slug + "/") &&
                        !id.endsWith("/README.md"),
                    )
                    .map((id) => (
                      <li key={id}>
                        <a
                          href={`#/lab/library?document=${encodeURIComponent(id)}`}
                          onClick={(event) => {
                            if (
                              !event.ctrlKey &&
                              !event.metaKey &&
                              !event.shiftKey
                            ) {
                              event.preventDefault();
                              open(id);
                            }
                          }}
                        >
                          {id.slice(chapter.slug.length + 1)}
                        </a>
                      </li>
                    ))}
                </ul>
              </details>
            </article>
          ))}
        </nav>
        {documentPath && (
          <article
            ref={detail}
            tabIndex={-1}
            className="chapter-detail"
            aria-label="Chapter specification"
          >
            <button onClick={() => selectDocument("")}>
              Back to search results
            </button>
            {current && documentId !== current.slug + "/README.md" && (
              <button
                onClick={() => selectDocument(current.slug + "/README.md")}
              >
                Back to chapter
              </button>
            )}
            <h2>{current?.title || "Reference document"}</h2>
            <p>{documentId}</p>
            {current && (
              <p>
                Prerequisites:{" "}
                {current.prerequisites.join(", ") || "Start here"}
              </p>
            )}
            {state === "loading" ? (
              <p role="status">Loading document…</p>
            ) : state === "failed" ? (
              <div role="alert">
                <p>Document could not load. Your selection is preserved.</p>
                <button onClick={() => setRetry((n) => n + 1)}>
                  Retry document
                </button>
                <button onClick={() => window.location.reload()}>
                  Reload and retry document download
                </button>
              </div>
            ) : (
              <MarkdownDocument
                source={source}
                documentURL={(href) => {
                  if (/^(?:[a-z]+:|#|\/)/i.test(href)) return undefined;
                  const parts = documentId.split("/").slice(0, -1);
                  for (const part of href.split("#")[0].split("/")) {
                    if (part === "..") parts.pop();
                    else if (part !== ".") parts.push(decodeURIComponent(part));
                  }
                  const id = parts.join("/");
                  if (!ids.includes(id)) return undefined;
                  return `#/lab/library?document=${encodeURIComponent(id)}`;
                }}
              />
            )}
            {current && (
              <>
                <h3>Official sources</h3>
                <ul>
                  {current.source_refs.map((id) => {
                    const source = catalog.sources.find(
                      (item) => item.id === id,
                    )!;
                    return (
                      <li key={id}>
                        <a href={source.url} target="_blank" rel="noreferrer">
                          {source.name}
                        </a>{" "}
                        — {source.reuse}
                      </li>
                    );
                  })}
                </ul>
              </>
            )}
          </article>
        )}
      </div>
    </section>
  );
}
