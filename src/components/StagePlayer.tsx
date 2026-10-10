import { useEffect, useRef, useState } from "react";
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
    [visible, setVisible] = useState(true);
  const host = useRef<HTMLDivElement>(null),
    next = useRef(onStep);
  next.current = onStep;
  useEffect(() => {
    const mq = matchMedia("(prefers-reduced-motion: reduce)");
    const stop = () => {
      if (document.hidden || mq.matches) setPlaying(false);
    };
    document.addEventListener("visibilitychange", stop);
    mq.addEventListener("change", stop);
    const observer = new IntersectionObserver(([e]) => {
      setVisible(e.isIntersecting);
      if (!e.isIntersecting) setPlaying(false);
    });
    if (host.current) observer.observe(host.current);
    return () => {
      document.removeEventListener("visibilitychange", stop);
      mq.removeEventListener("change", stop);
      observer.disconnect();
    };
  }, []);
  useEffect(() => {
    if (!playing || !visible) return;
    if (step === count - 1) {
      setPlaying(false);
      return;
    }
    const timer = setTimeout(() => next.current(step + 1), 1100);
    return () => clearTimeout(timer);
  }, [playing, visible, step, count]);
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
        onClick={() => {
          if (!playing && step === count - 1) onStep(0);
          setPlaying((v) => !v);
        }}
        aria-pressed={playing}
      >
        {playing ? "Pause stages" : "Play stages"}
      </button>
      <button
        onClick={() => {
          setPlaying(false);
          onStep(0);
        }}
      >
        Replay stages
      </button>
      <span>
        Stage {step + 1} / {count}. Automatic playback pauses when hidden;
        manual stepping is always available.
      </span>
    </div>
  );
}
