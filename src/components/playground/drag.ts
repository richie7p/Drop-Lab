import { RigidBodyType, type RigidBody } from "@dimforge/rapier3d-compat";
import * as THREE from "three";
import { MAX_THROW_SPEED } from "./constants";
import { usePlayground } from "./store";

type DragSession = {
  id: string;
  body: RigidBody;
  plane: THREE.Plane;
  offset: THREE.Vector3;
  prev: THREE.Vector3;
  vel: THREE.Vector3;
  minY: number;
  pointerId: number;
};

const _ray = new THREE.Raycaster();
const _ndc = new THREE.Vector2();
const _hit = new THREE.Vector3();
const _dir = new THREE.Vector3();
const _cam = new THREE.Vector3();

let session: DragSession | null = null;
let pointer = { x: 0, y: 0 };
let canvasEl: HTMLCanvasElement | null = null;

export function getDragId() {
  return session?.id ?? null;
}

export function isDragging() {
  return session !== null;
}

export function beginDrag(opts: {
  id: string;
  body: RigidBody;
  hit: THREE.Vector3;
  camera: THREE.Camera;
  minY: number;
  pointerId: number;
  canvas: HTMLCanvasElement;
  clientX: number;
  clientY: number;
}) {
  if (session) endDrag(false);

  opts.body.setLinvel({ x: 0, y: 0, z: 0 }, true);
  opts.body.setAngvel({ x: 0, y: 0, z: 0 }, true);
  opts.body.setBodyType(RigidBodyType.KinematicPositionBased, true);
  opts.body.wakeUp();

  const plane = new THREE.Plane();
  opts.camera.getWorldDirection(_dir);
  plane.setFromNormalAndCoplanarPoint(_dir, opts.hit);

  const t = opts.body.translation();
  session = {
    id: opts.id,
    body: opts.body,
    plane,
    offset: new THREE.Vector3(t.x - opts.hit.x, t.y - opts.hit.y, t.z - opts.hit.z),
    prev: new THREE.Vector3(t.x, t.y, t.z),
    vel: new THREE.Vector3(),
    minY: opts.minY,
    pointerId: opts.pointerId,
  };

  canvasEl = opts.canvas;
  updatePointer(opts.clientX, opts.clientY);
  try {
    opts.canvas.setPointerCapture(opts.pointerId);
  } catch {
    /* capture is best-effort on some browsers */
  }

  usePlayground.getState().setDragging(true);
}

export function updatePointer(clientX: number, clientY: number) {
  if (!canvasEl) return;
  const rect = canvasEl.getBoundingClientRect();
  pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1;
}

export function stepDrag(camera: THREE.Camera, dt: number) {
  if (!session) return;

  _ndc.set(pointer.x, pointer.y);
  _ray.setFromCamera(_ndc, camera);
  const hit = _ray.ray.intersectPlane(session.plane, _hit);
  if (!hit) return;

  _cam.copy(_hit).add(session.offset);
  _cam.y = Math.max(_cam.y, session.minY);

  const invDt = dt > 0.0001 ? 1 / dt : 60;
  session.vel.set(
    (_cam.x - session.prev.x) * invDt,
    (_cam.y - session.prev.y) * invDt,
    (_cam.z - session.prev.z) * invDt,
  );
  session.prev.copy(_cam);

  session.body.setNextKinematicTranslation({ x: _cam.x, y: _cam.y, z: _cam.z });
  session.body.setTranslation({ x: _cam.x, y: _cam.y, z: _cam.z }, true);
}

export function endDrag(throwBody = true) {
  if (!session) return;

  const { body, vel, pointerId } = session;
  const speed = vel.length();
  if (speed > MAX_THROW_SPEED) {
    vel.multiplyScalar(MAX_THROW_SPEED / speed);
  }

  body.setBodyType(RigidBodyType.Dynamic, true);
  if (throwBody) {
    body.setLinvel({ x: vel.x, y: vel.y, z: vel.z }, true);
  } else {
    body.setLinvel({ x: 0, y: 0, z: 0 }, true);
  }
  body.wakeUp();

  if (canvasEl) {
    try {
      canvasEl.releasePointerCapture(pointerId);
    } catch {
      /* already released */
    }
  }

  session = null;
  canvasEl = null;
  usePlayground.getState().setDragging(false);
}
