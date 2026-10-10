import { useLab } from "../store/lab";
import {
  Component,
  lazy,
  Suspense,
  useMemo,
  useState,
  type ComponentType,
  type ComponentProps,
  type ReactNode,
} from "react";

export class WorkspaceBoundary extends Component<
  { children: ReactNode; retry: () => void },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    if (this.state.failed)
      return (
        <section role="alert" className="foundation-panel">
          <h2>This workspace could not load</h2>
          <p>
            Your experiment is still available. Retry the download, or choose
            another workspace from navigation.
          </p>
          <button className="action" onClick={this.props.retry}>
            Retry workspace
          </button>
          <button
            onClick={() => {
              const { inputs, weights, bias, activation, missionPrevious } =
                useLab.getState();
              try {
                sessionStorage.setItem(
                  "neurallab.recovery",
                  JSON.stringify({
                    inputs,
                    weights,
                    bias,
                    activation,
                    missionPrevious,
                  }),
                );
              } catch {}
              window.location.reload();
            }}
          >
            Reload and retry download
          </button>
        </section>
      );
    return this.props.children;
  }
}

/** Recreate React.lazy after rejection: remounting the same lazy retains its rejected promise. */
export function retryableWorkspace<T extends ComponentType<any>>(
  load: () => Promise<{ default: T }>,
) {
  return function RetryableWorkspace(props: ComponentProps<T>) {
    const [attempt, setAttempt] = useState(0);
    const Workspace = useMemo(() => lazy(load), [attempt]);
    return (
      <WorkspaceBoundary key={attempt} retry={() => setAttempt((n) => n + 1)}>
        <Suspense fallback={<p role="status">Loading learning workspace…</p>}>
          <Workspace {...props} />
        </Suspense>
      </WorkspaceBoundary>
    );
  };
}
