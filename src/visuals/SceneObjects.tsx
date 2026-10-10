import { palette } from '../design/palette';
import { useEffect, useMemo } from "react";
import { CanvasTexture, Quaternion, Vector3 } from "three";
export type Point = [number, number, number];
export function SceneLabel({
  text,
  position,
  width = 1.6,
}: {
  text: string;
  position: Point;
  width?: number;
}) {
  const texture = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 512;
    c.height = 128;
    const x = c.getContext("2d");
    if (x) {
      x.fillStyle = palette.background;
      x.fillRect(0, 0, 512, 128);
      x.font = "600 70px system-ui";
      x.textAlign = "center";
      x.textBaseline = "middle";
      x.fillStyle = "#f0f5ff";
      x.fillText(text, 256, 64, 492);
    }
    return new CanvasTexture(c);
  }, [text]);
  useEffect(() => () => texture.dispose(), [texture]);
  return (
    <sprite position={position} scale={[width, width / 4, 1]}>
      <spriteMaterial map={texture} depthTest={false} />
    </sprite>
  );
}
export function SceneNode({
  position,
  text,
  color,
  selected = false,
  onSelect,
}: {
  position: Point;
  text: string;
  color: string;
  selected?: boolean;
  onSelect: () => void;
}) {
  return (
    <group position={position}>
      <mesh
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
      >
        <sphereGeometry args={[selected ? 0.45 : 0.34, 24, 16]} />
        <meshStandardMaterial
          color={selected ? palette.gradient : color}
          roughness={0.3}
          metalness={0.2}
          emissive={color}
          emissiveIntensity={selected ? 0.6 : 0.18}
        />
      </mesh>
      <SceneLabel text={text} position={[0, 0.65, 0]} width={2.3} />
    </group>
  );
}
export function SceneEdge({
  a,
  b,
  value,
  active = true,
  selected = false,
  onSelect,
}: {
  a: Point;
  b: Point;
  value: number;
  active?: boolean;
  selected?: boolean;
  onSelect: () => void;
}) {
  const { mid, q, length } = useMemo(() => {
    const start = new Vector3(...a),
      end = new Vector3(...b);
    return {
      mid: start.clone().add(end).multiplyScalar(0.5),
      q: new Quaternion().setFromUnitVectors(
        new Vector3(0, 1, 0),
        end.clone().sub(start).normalize(),
      ),
      length: end.distanceTo(start),
    };
  }, [...a, ...b]);
  const color = selected ? palette.gradient : value < 0 ? "#fbac87" : palette.input;
  return (
    <group>
      <mesh
        position={mid}
        quaternion={q}
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
      >
        <cylinderGeometry
          args={[
            selected ? 0.065 : 0.035,
            selected ? 0.065 : 0.035,
            length,
            12,
          ]}
        />
        <meshStandardMaterial
          color={color}
          transparent
          opacity={active ? 1 : 0.22}
          emissive={color}
          emissiveIntensity={active ? 0.4 : 0}
        />
      </mesh>
      {active && (
        <mesh position={mid}>
          <sphereGeometry args={[0.08, 12, 8]} />
          <meshBasicMaterial color={color} />
        </mesh>
      )}
    </group>
  );
}
