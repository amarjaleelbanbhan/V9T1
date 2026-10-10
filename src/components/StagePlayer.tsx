import { useEffect, useRef, useState } from "react";

const reduceQuery = "(prefers-reduced-motion: reduce)";

export function StagePlayer({
  step,
  count,
  onStep,
  label,
}: {
  step: number;
  count: number;
  onStep: (step: number) => void;
  label: string;
}) {
  const [playing, setPlaying] = useState(false),
    [visible, setVisible] = useState(true),
    [speed, setSpeed] = useState(1),
    // Read the preference at mount, not only when it changes: a learner who
    // already had reduced motion set must never see anything auto-advance.
    [reduced, setReduced] = useState(() => matchMedia(reduceQuery).matches);
  const host = useRef<HTMLDivElement>(null),
    next = useRef(onStep);
  next.current = onStep;
  useEffect(() => {
    const mq = matchMedia(reduceQuery);
    const sync = () => {
      setReduced(mq.matches);
      if (document.hidden || mq.matches) setPlaying(false);
    };
    sync();
    document.addEventListener("visibilitychange", sync);
    mq.addEventListener("change", sync);
    const observer = new IntersectionObserver(([e]) => {
      setVisible(e.isIntersecting);
      if (!e.isIntersecting) setPlaying(false);
    });
    if (host.current) observer.observe(host.current);
    return () => {
      document.removeEventListener("visibilitychange", sync);
      mq.removeEventListener("change", sync);
      observer.disconnect();
    };
  }, []);
  useEffect(() => {
    if (!playing || !visible || reduced) return;
    if (step === count - 1) {
      setPlaying(false);
      return;
    }
    const timer = setTimeout(() => next.current(step + 1), 1100 / speed);
    return () => clearTimeout(timer);
  }, [playing, visible, reduced, step, count, speed]);
  return (
    <div ref={host} className="python-actions" role="group" aria-label={label}>
      <button
        disabled={step === 0}
        onClick={() => {
          setPlaying(false);
          onStep(step - 1);
        }}
      >
        Rewind stage
      </button>
      <button
        disabled={reduced}
        onClick={() => {
          if (!playing && step === count - 1) onStep(0);
          setPlaying((v) => !v);
        }}
        aria-pressed={playing}
      >
        {reduced
          ? "Automatic playback off"
          : playing
            ? "Pause stages"
            : "Play stages"}
      </button>
      <button
        disabled={step === 0}
        onClick={() => {
          setPlaying(false);
          onStep(0);
        }}
      >
        Replay stages
      </button>
      <label className="stage-speed">
        Playback speed
        <select
          disabled={reduced}
          value={speed}
          onChange={(e) => setSpeed(Number(e.target.value))}
        >
          <option value={0.5}>0.5×</option>
          <option value={1}>1×</option>
          <option value={2}>2×</option>
        </select>
      </label>
      <span>
        Stage {step + 1} / {count}.{" "}
        {reduced
          ? "Reduced motion is on, so nothing advances on its own. Every operation is still reachable by stepping, and no information is withheld."
          : "Automatic playback pauses when the panel is hidden or scrolled away; manual stepping is always available."}
      </span>
    </div>
  );
}
