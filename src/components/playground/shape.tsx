import { useEffect, useMemo, useRef, useState } from "react";
import { useCursor } from "@react-three/drei";
import { useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import {
  BallCollider,
  CuboidCollider,
  CylinderCollider,
  RigidBody,
  type RapierRigidBody,
} from "@react-three/rapier";
import { DEFAULT_FRICTION, DESPAWN_Y } from "./constants";
import { beginDrag, isDragging } from "./drag";
import { usePlayground, type BodySpec } from "./store";

function minExtent(spec: BodySpec) {
  if (spec.kind === "sphere") return spec.params[0] ?? 0.35;
  if (spec.kind === "box") return (spec.params[1] ?? 0.5) / 2;
  return (spec.params[1] ?? 0.7) / 2;
}

export function Shape({ spec }: { spec: BodySpec }) {
  const bodyRef = useRef<RapierRigidBody>(null);
  const { gl } = useThree();
  const [hovered, setHovered] = useState(false);
  const restitution = usePlayground((s) => s.restitution);
  const remove = usePlayground((s) => s.remove);
  const dragging = usePlayground((s) => s.dragging);

  useCursor(hovered || dragging);

  useEffect(() => {
    const body = bodyRef.current;
    if (!body) return;
    const count = body.numColliders();
    for (let i = 0; i < count; i += 1) {
      body.collider(i).setRestitution(restitution);
    }
  }, [restitution]);

  useFrame(() => {
    const body = bodyRef.current;
    if (!body) return;
    if (body.translation().y < DESPAWN_Y) {
      remove(spec.id);
    }
  });

  const angularVelocity = useMemo<[number, number, number]>(() => {
    if (!spec.jiggle) return [0, 0, 0];
    return [
      (Math.random() - 0.5) * 2.4,
      (Math.random() - 0.5) * 2.4,
      (Math.random() - 0.5) * 2.4,
    ];
  }, [spec.jiggle]);

  const onPointerDown = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    const body = bodyRef.current;
    if (!body || isDragging()) return;
    beginDrag({
      id: spec.id,
      body,
      hit: event.point,
      camera: event.camera,
      minY: minExtent(spec) + 0.04,
      pointerId: event.pointerId,
      canvas: gl.domElement,
      clientX: event.nativeEvent.clientX,
      clientY: event.nativeEvent.clientY,
    });
  };

  const material = (
    <meshStandardMaterial
      color={spec.color}
      roughness={spec.kind === "box" ? 0.74 : spec.kind === "sphere" ? 0.34 : 0.26}
      metalness={spec.kind === "box" ? 0.04 : spec.kind === "sphere" ? 0.14 : 0.58}
    />
  );

  return (
    <RigidBody
      ref={bodyRef}
      colliders={false}
      position={spec.position}
      rotation={spec.rotation}
      restitution={restitution}
      friction={DEFAULT_FRICTION}
      linearDamping={0.08}
      angularDamping={0.12}
      angularVelocity={angularVelocity}
      ccd
      canSleep
    >
      {spec.kind === "sphere" ? (
        <>
          <BallCollider args={[spec.params[0] ?? 0.35]} restitution={restitution} friction={DEFAULT_FRICTION} />
          <mesh
            castShadow
            receiveShadow
            onPointerDown={onPointerDown}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
          >
            <sphereGeometry args={[spec.params[0] ?? 0.35, 32, 24]} />
            {material}
          </mesh>
        </>
      ) : spec.kind === "box" ? (
        <>
          <CuboidCollider
            args={[
              (spec.params[0] ?? 0.5) / 2,
              (spec.params[1] ?? 0.5) / 2,
              (spec.params[2] ?? 0.5) / 2,
            ]}
            restitution={restitution}
            friction={DEFAULT_FRICTION}
          />
          <mesh
            castShadow
            receiveShadow
            onPointerDown={onPointerDown}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
          >
            <boxGeometry args={[spec.params[0] ?? 0.5, spec.params[1] ?? 0.5, spec.params[2] ?? 0.5]} />
            {material}
          </mesh>
        </>
      ) : (
        <>
          <CylinderCollider
            args={[(spec.params[1] ?? 0.7) / 2, spec.params[0] ?? 0.28]}
            restitution={restitution}
            friction={DEFAULT_FRICTION}
          />
          <mesh
            castShadow
            receiveShadow
            onPointerDown={onPointerDown}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
          >
            <cylinderGeometry args={[spec.params[0] ?? 0.28, spec.params[0] ?? 0.28, spec.params[1] ?? 0.7, 28]} />
            {material}
          </mesh>
        </>
      )}
    </RigidBody>
  );
}
