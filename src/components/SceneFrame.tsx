import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerformanceMonitor } from "@react-three/drei";
import { Component, useEffect, useRef, useState, type ReactNode } from "react";
class SceneBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}
export function SceneFrame({
  children,
  label,
  fallback,
}: {
  children: ReactNode;
  label: string;
  fallback: ReactNode;
}) {
  const intersecting = useRef(true);
  const host = useRef<HTMLDivElement>(null),
    [visible, setVisible] = useState(true),
    [dpr, setDpr] = useState(1),
    [reset, setReset] = useState(0);
  const [supported] = useState(() => {
    try {
      const c = document.createElement("canvas");
      return !!(c.getContext("webgl2") || c.getContext("webgl"));
    } catch {
      return false;
    }
  });
  useEffect(() => {
    const update = () => setVisible(intersecting.current && !document.hidden);
    document.addEventListener("visibilitychange", update);
    const observer = new IntersectionObserver(([e]) => {
      intersecting.current = e.isIntersecting;
      setVisible(e.isIntersecting && !document.hidden);
    });
    if (host.current) observer.observe(host.current);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", update);
    };
  }, []);
  return (
    <div ref={host} className="scene-frame" aria-label={label}>
      <div className="scene-tools">
        <span>Drag: orbit · wheel: zoom · right drag / two fingers: pan</span>
        <button onClick={() => setReset((n) => n + 1)}>Reset camera</button>
      </div>
      {supported ? (
        <SceneBoundary fallback={fallback}>
          <Canvas
            key={reset}
            camera={{
              position: [0.6, 2.1, window.innerWidth < 650 ? 12 : 8.5],
              fov: 44,
            }}
            frameloop={visible ? "demand" : "never"}
            dpr={dpr}
            gl={{ antialias: true }}
            fallback={fallback}
          >
            <color attach="background" args={["#0b1428"]} />
            <ambientLight intensity={1.4} />
            <pointLight position={[0, 4, 5]} intensity={55} color="#b0c8ff" />
            <pointLight position={[-4, -3, 2]} intensity={22} color="#c4a6ff" />
            <PerformanceMonitor
              onDecline={() => setDpr(1)}
              onIncline={() => setDpr(Math.min(window.devicePixelRatio, 1.5))}
              flipflops={2}
              onFallback={() => setDpr(1)}
            />
            {children}
            <OrbitControls
              makeDefault
              enablePan
              minDistance={5}
              maxDistance={22}
            />
            <gridHelper
              args={[16, 16, "#304265", "#182640"]}
              position={[0, -2.2, 0]}
            />
          </Canvas>
        </SceneBoundary>
      ) : (
        fallback
      )}
    </div>
  );
}
