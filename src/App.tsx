import { Suspense, useCallback, useEffect, useState } from "react";
import { BrainCircuit, BookOpen } from "lucide-react";
import {
  retryableWorkspace,
  WorkspaceBoundary,
} from "./components/WorkspaceBoundary";
import { NeuronWorkspace } from "./components/NeuronWorkspace";
import { WorkspaceNavigation } from "./components/WorkspaceNavigation";
import { useLab } from "./store/lab";
import { useWorkspace, type ActiveLesson } from "./store/workspace";
const LearningDashboard = retryableWorkspace(() =>
  import("./lessons/LearningDashboard").then((m) => ({
    default: m.LearningDashboard,
  })),
);
const PythonWorkshop = retryableWorkspace(() =>
  import("./lessons/PythonWorkshop").then((m) => ({
    default: m.PythonWorkshop,
  })),
);
const MathWorkshop = retryableWorkspace(() =>
  import("./lessons/MathWorkshop").then((m) => ({ default: m.MathWorkshop })),
);
const FoundationsLab = retryableWorkspace(() =>
  import("./lessons/FoundationsLab").then((m) => ({
    default: m.FoundationsLab,
  })),
);
const ActivationExplorer = retryableWorkspace(() =>
  import("./lessons/ActivationExplorer").then((m) => ({
    default: m.ActivationExplorer,
  })),
);
const ForwardLab = retryableWorkspace(() =>
  import("./lessons/ForwardLab").then((m) => ({ default: m.ForwardLab })),
);
const TensorLab = retryableWorkspace(() =>
  import("./lessons/TensorLab").then((m) => ({ default: m.TensorLab })),
);
const PerceptronLab = retryableWorkspace(() =>
  import("./lessons/PerceptronLab").then((m) => ({ default: m.PerceptronLab })),
);
const LossGradientLab = retryableWorkspace(() =>
  import("./lessons/LossGradientLab").then((m) => ({
    default: m.LossGradientLab,
  })),
);
const BackpropLab = retryableWorkspace(() =>
  import("./lessons/BackpropLab").then((m) => ({ default: m.BackpropLab })),
);
const GradientDepthLab = retryableWorkspace(() =>
  import("./lessons/GradientDepthLab").then((m) => ({
    default: m.GradientDepthLab,
  })),
);

const TrainingProject = retryableWorkspace(() =>
  import("./lessons/TrainingProject").then((m) => ({
    default: m.TrainingProject,
  })),
);
const BeginnerCourse = retryableWorkspace(() =>
  import("./lessons/BeginnerCourse").then((m) => ({
    default: m.BeginnerCourse,
  })),
);
const CurriculumLibrary = retryableWorkspace(() =>
  import("./lessons/CurriculumLibrary").then((m) => ({
    default: m.CurriculumLibrary,
  })),
);
const PythonFlowLab = retryableWorkspace(() =>
  import("./lessons/PythonFlowLab").then((m) => ({ default: m.PythonFlowLab })),
);
const PythonBasicsLab = retryableWorkspace(() =>
  import("./lessons/PythonBasicsLab").then((m) => ({
    default: m.PythonBasicsLab,
  })),
);
const PythonTraceLab = retryableWorkspace(() =>
  import("./lessons/PythonTraceLab").then((m) => ({
    default: m.PythonTraceLab,
  })),
);

const workspaces = {
  neuron: NeuronWorkspace,
  intro: FoundationsLab,
  activation: ActivationExplorer,
  propagation: ForwardLab,
  tensor: TensorLab,
  perceptron: PerceptronLab,
  loss: LossGradientLab,
  backprop: BackpropLab,
  "gradient-depth": GradientDepthLab,
  library: CurriculumLibrary,
  python: PythonTraceLab,
  "python-basics": PythonBasicsLab,
  "python-flow": PythonFlowLab,
  "training-project": TrainingProject,
  "python-workshop": PythonWorkshop,
  "math-workshop": MathWorkshop,
} satisfies Record<
  Exclude<ActiveLesson, "beginner" | "dashboard">,
  React.ComponentType
>;
export default function App() {
  const pause = useLab((s) => s.pause);
  const [activeLesson, setActiveLesson] = useWorkspace();
  const [beginnerStart, setBeginnerStart] = useState<string>();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const closeSidebar = useCallback(() => setSidebarOpen(false), []);
  const navigate = (id: ActiveLesson, topic?: string) => {
    setBeginnerStart(topic);
    setActiveLesson(id);
    if (topic)
      history.replaceState(
        null,
        "",
        `#/lab/${id}?topic=${encodeURIComponent(topic)}`,
      );
    pause();
    setSidebarOpen(false);
  };
  useEffect(() => {
    pause();
    setSidebarOpen(false);
    const main = document.getElementById("lab");
    main?.focus({ preventScroll: true });
    main?.scrollIntoView({ block: "start", behavior: "instant" });
  }, [activeLesson, pause]);
  const Workspace =
    activeLesson === "beginner" || activeLesson === "dashboard"
      ? null
      : workspaces[activeLesson];
  return (
    <div className="app-shell">
      <a
        className="skip-link"
        href="#lab"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById("lab")?.focus();
          document.getElementById("lab")?.scrollIntoView({ block: "start" });
        }}
      >
        Skip to learning workspace
      </a>
      <header className="top-bar" inert={sidebarOpen}>
        <a
          className="brand"
          href="#/lab/neuron"
          onClick={(e) => {
            e.preventDefault();
            navigate("neuron");
          }}
        >
          <BrainCircuit size={28} strokeWidth={2.4} />
          <span>
            Neural<span>Lab</span>
          </span>
        </a>
        <nav className="global-nav" aria-label="Main navigation">
          <a
            className={
              activeLesson !== "library" && activeLesson !== "dashboard"
                ? "active"
                : ""
            }
            aria-current={
              activeLesson !== "library" && activeLesson !== "dashboard"
                ? "page"
                : undefined
            }
            href="#/lab/neuron"
            onClick={(e) => {
              e.preventDefault();
              navigate("neuron");
            }}
          >
            Learn
          </a>
          <a
            className={activeLesson === "library" ? "active" : ""}
            aria-current={activeLesson === "library" ? "page" : undefined}
            href="#/lab/library"
            onClick={(e) => {
              e.preventDefault();
              navigate("library");
            }}
          >
            Curriculum
          </a>
        </nav>
        <button
          className={
            "dashboard-link " + (activeLesson === "dashboard" ? "current" : "")
          }
          aria-current={activeLesson === "dashboard" ? "page" : undefined}
          onClick={() => navigate("dashboard")}
        >
          My learning
        </button>
        <span className="header-label">
          AN EXPERIMENT IN UNDERSTANDING <span className="status-dot" />
        </span>
        <button
          className="mobile-toggle"
          onClick={() => setSidebarOpen((v) => !v)}
          aria-expanded={sidebarOpen}
          aria-controls="course-navigation"
          aria-label="Toggle lesson navigation"
        >
          <BookOpen size={20} />
        </button>
      </header>
      <div className="app-grid" id="top">
        <WorkspaceNavigation
          active={activeLesson}
          open={sidebarOpen}
          close={closeSidebar}
          navigate={navigate}
        />
        <main inert={sidebarOpen} id="lab" className="workspace" tabIndex={-1}>
          <WorkspaceBoundary
            key={activeLesson}
            retry={() => window.location.reload()}
          >
            <Suspense
              fallback={<p role="status">Loading learning workspace…</p>}
            >
              {activeLesson === "dashboard" ? (
                <LearningDashboard
                  onLesson={(id) => navigate("beginner", id)}
                />
              ) : activeLesson === "beginner" ? (
                <BeginnerCourse
                  key={beginnerStart}
                  initialLesson={beginnerStart}
                  onOpen={(id) => navigate(id as ActiveLesson)}
                />
              ) : (
                Workspace && <Workspace />
              )}
            </Suspense>
          </WorkspaceBoundary>
        </main>
      </div>
    </div>
  );
}
