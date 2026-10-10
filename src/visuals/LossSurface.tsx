import { palette } from '../design/palette';
import { useMemo } from "react";
import { BufferGeometry, Color, Float32BufferAttribute } from "three";
import { useEffect } from "react";
import { surfaceLoss, surfacePath } from "../engine/surface";
import { SceneFrame } from "../components/SceneFrame";
import { SceneLabel } from "./SceneObjects";
export function LossSurface({
  weight,
  bias,
  rate,
  step,
}: {
  weight: number;
  bias: number;
  rate: number;
  step: number;
}) {
  const path = surfacePath(weight, bias, rate, step);
  const geometry = useMemo(() => {
    const g = new BufferGeometry(),
      p: number[] = [],
      colors: number[] = [];
    const point = (w: number, b: number) => {
      const loss = surfaceLoss(w, b).loss;
      p.push(w - 1, Math.min(loss, 12) * 0.2 - 1.8, b);
      const shade = new Color(palette.weight).lerp(new Color(palette.input), Math.min(loss / 12, 1));
      colors.push(shade.r, shade.g, shade.b);
    };
    for (let i = 0; i < 28; i++)
      for (let j = 0; j < 28; j++) {
        const a = -2 + i / 4,
          b = -2 + j / 7;
        for (const [w, z] of [
          [a, b],
          [a + 0.25, b],
          [a, b + 1 / 7],
          [a + 0.25, b],
          [a + 0.25, b + 1 / 7],
          [a, b + 1 / 7],
        ])
          point(w, z);
      }
    g.setAttribute("position", new Float32BufferAttribute(p, 3));
    g.setAttribute("color", new Float32BufferAttribute(colors, 3));
    g.computeVertexNormals();
    return g;
  }, []);
  useEffect(() => () => geometry.dispose(), [geometry]);
  const last = path.at(-1)!;
  return (
    <SceneFrame
      label="Loss as height over weight and bias"
      fallback={
        <p>
          Use the 2D contour below to inspect the same loss and descent path.
        </p>
      }
    >
      <mesh geometry={geometry}>
        <meshStandardMaterial
          vertexColors
          transparent
          opacity={0.85}
          side={2}
          roughness={0.8}
        />
      </mesh>
      {path.map((p, i) => (
        <mesh
          key={i}
          position={[p.weight - 1, Math.min(p.loss, 12) * 0.2 - 1.74, p.bias]}
        >
          <sphereGeometry
            args={[i === path.length - 1 ? 0.12 : 0.055, 12, 8]}
          />
          <meshStandardMaterial
            color={i === path.length - 1 ? palette.gradient : "#f4f7ff"}
          />
        </mesh>
      ))}
      <SceneLabel
        position={[
          last.weight - 1,
          Math.min(last.loss, 12) * 0.2 - 1.3,
          last.bias,
        ]}
        text={`L = ${last.loss.toFixed(4)}`}
        width={2}
      />
      <SceneLabel position={[3, -1.8, 0]} text="weight →" />
      <SceneLabel position={[-1, -1.8, 2.5]} text="bias →" />
      <SceneLabel
        position={[-2, 1, 0]}
        text="loss ↑ (clipped 12)"
        width={2.5}
      />
    </SceneFrame>
  );
}
