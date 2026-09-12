import { Suspense, useEffect, useLayoutEffect } from "react";
import { Grid, OrbitControls } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import {
  CuboidCollider,
  Physics,
  RigidBody,
  useBeforePhysicsStep,
} from "@react-three/rapier";
import type { PerspectiveCamera } from "three";
import {
  GRID_CELL,
  GRID_SECTION,
  SCENE_BG,
  SLAB_SIZE,
  SLAB_THICKNESS,
} from "./constants";
import { endDrag, getDragId, stepDrag, updatePointer } from "./drag";
import { Shape } from "./shape";
import { usePlayground } from "./store";

function FrameScene() {
  const { camera, size } = useThree();

  useLayoutEffect(() => {
    const portrait = size.height / Math.max(size.width, 1) > 1.15;
    const cam = camera as PerspectiveCamera;
    cam.position.set(
      portrait ? 6.2 : 8.6,
      portrait ? 8.2 : 6.8,
      portrait ? 7.8 : 10.4,
    );
    cam.fov = portrait ? 46 : 40;
    cam.updateProjectionMatrix();
  }, [camera, size.height, size.width]);

  return null;
}

function Lights() {
  return (
    <>
      <hemisphereLight args={["#eceae4", "#1b1b20", 0.55]} />
      <ambientLight intensity={0.18} />
      <directionalLight
        castShadow
        position={[10, 16, 8]}
        intensity={1.55}
        color="#f3f1eb"
        shadow-mapSize={[1024, 1024]}
        shadow-camera-near={1}
        shadow-camera-far={40}
        shadow-camera-left={-14}
        shadow-camera-right={14}
        shadow-camera-top={14}
        shadow-camera-bottom={-14}
        shadow-bias={-0.0004}
      />
      <directionalLight position={[-8, 6, -6]} intensity={0.28} color="#cfd3da" />
    </>
  );
}

function VisualGround() {
  return (
    <>
      <mesh receiveShadow position={[0, -SLAB_THICKNESS / 2, 0]}>
        <boxGeometry args={[SLAB_SIZE, SLAB_THICKNESS, SLAB_SIZE]} />
        <meshStandardMaterial color="#16161b" roughness={0.94} metalness={0.04} />
      </mesh>
      <Grid
        position={[0, 0.008, 0]}
        args={[SLAB_SIZE, SLAB_SIZE]}
        cellSize={0.5}
        cellThickness={0.55}
        cellColor={GRID_CELL}
        sectionSize={2}
        sectionThickness={1.05}
        sectionColor={GRID_SECTION}
        fadeDistance={26}
        fadeStrength={1.35}
        infiniteGrid={false}
      />
    </>
  );
}

function PhysicsGround() {
  const restitution = usePlayground((s) => s.restitution);
  const half = SLAB_SIZE / 2;

  return (
    <RigidBody type="fixed" colliders={false} friction={0.92} restitution={restitution}>
      <CuboidCollider
        args={[half, SLAB_THICKNESS / 2, half]}
        position={[0, -SLAB_THICKNESS / 2, 0]}
        restitution={restitution}
        friction={0.92}
      />
    </RigidBody>
  );
}

function DragSystem() {
  const { camera, gl } = useThree();
  const bodies = usePlayground((s) => s.bodies);

  useBeforePhysicsStep(() => {
    stepDrag(camera, 1 / 60);
  });

  useEffect(() => {
    const id = getDragId();
    if (id && !bodies.some((body) => body.id === id)) {
      endDrag(false);
    }
  }, [bodies]);

  useEffect(() => {
    const canvas = gl.domElement;
    canvas.style.touchAction = "none";
    canvas.style.cursor = "grab";

    const onMove = (event: PointerEvent) => {
      updatePointer(event.clientX, event.clientY);
    };
    const onUp = () => {
      if (getDragId()) endDrag(true);
    };
    const onBlur = () => {
      if (getDragId()) endDrag(false);
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    window.addEventListener("blur", onBlur);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      window.removeEventListener("blur", onBlur);
    };
  }, [gl]);

  return null;
}

export function World() {
  const gravity = usePlayground((s) => s.gravity);
  const paused = usePlayground((s) => s.paused);
  const bodies = usePlayground((s) => s.bodies);
  const dragging = usePlayground((s) => s.dragging);

  return (
    <>
      <color attach="background" args={[SCENE_BG]} />
      <fog attach="fog" args={[SCENE_BG, 18, 40]} />
      <FrameScene />
      <Lights />
      <VisualGround />
      <OrbitControls
        makeDefault
        enabled={!dragging}
        enableDamping
        dampingFactor={0.08}
        minPolarAngle={0.18}
        maxPolarAngle={Math.PI / 2 - 0.05}
        minDistance={5}
        maxDistance={26}
        target={[0, 0.35, 0]}
      />
      <Suspense fallback={null}>
        <Physics
          gravity={[0, -gravity, 0]}
          paused={paused}
          timeStep={1 / 60}
          interpolate
          numSolverIterations={8}
          numInternalPgsIterations={2}
          colliders={false}
        >
          <DragSystem />
          <PhysicsGround />
          {bodies.map((body) => (
            <Shape key={body.id} spec={body} />
          ))}
        </Physics>
      </Suspense>
    </>
  );
}
