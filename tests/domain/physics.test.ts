import { afterEach, before, test } from "node:test";
import assert from "node:assert/strict";
import RAPIER from "@dimforge/rapier3d-compat";
import { PerspectiveCamera, Vector3 } from "three";
import { beginDrag, endDrag, getDragId, stepDrag, updatePointer } from "../../src/components/playground/drag";
import { createBody, usePlayground } from "../../src/components/playground/store";
import { MAX_BODIES, MAX_THROW_SPEED } from "../../src/components/playground/constants";
before(async () => { await RAPIER.init(); });
afterEach(() => { endDrag(false); usePlayground.getState().clear(); usePlayground.getState().setPaused(false); });
test("spawning enforces the body cap and evicts oldest bodies", () => {
  const store = usePlayground.getState(); store.clear(); store.spawn("sphere"); const first = usePlayground.getState().bodies[0]!.id;
  for (let i = 0; i < MAX_BODIES + 3; i++) store.spawn("box");
  const bodies = usePlayground.getState().bodies;
  assert.equal(bodies.length, MAX_BODIES); assert.ok(!bodies.some(b => b.id === first));
  assert.equal(new Set(bodies.map(b => b.id)).size, MAX_BODIES);
});
test("all generated shapes have positive collider dimensions", () => {
  for (const kind of ["sphere", "box", "cylinder"] as const) for (let i = 0; i < 30; i++) {
    const body = createBody(kind); assert.ok(body.params.every(n => Number.isFinite(n) && n > 0));
    assert.ok(body.position.every(Number.isFinite));
  }
});
test("physics controls clamp boundaries and reject non-finite values", () => {
  const s = usePlayground.getState(); s.setGravity(-1); assert.equal(usePlayground.getState().gravity, 0);
  s.setGravity(99); s.setGravity(NaN); assert.equal(usePlayground.getState().gravity, 20);
  s.setRestitution(2); s.setRestitution(Infinity); assert.equal(usePlayground.getState().restitution, 1);
});
test("clear releases UI drag state and pause toggles independently", () => {
  const s = usePlayground.getState(); s.setDragging(true); s.togglePaused(); s.clear();
  assert.equal(usePlayground.getState().paused, true); assert.equal(usePlayground.getState().dragging, false);
  assert.equal(usePlayground.getState().bodies.length, 0); s.togglePaused(); assert.equal(usePlayground.getState().paused, false);
});
function setupDrag() {
  const world = new RAPIER.World({ x: 0, y: -9.8, z: 0 });
  const body = world.createRigidBody(RAPIER.RigidBodyDesc.dynamic().setTranslation(0, 1, 0));
  const captured = new Set<number>();
  const canvas = { getBoundingClientRect: () => ({ left: 0, top: 0, width: 800, height: 600 }),
    setPointerCapture: (n: number) => captured.add(n), releasePointerCapture: (n: number) => captured.delete(n) } as unknown as HTMLCanvasElement;
  const camera = new PerspectiveCamera(45, 800/600, 0.1, 100); camera.position.set(0, 3, 10); camera.lookAt(0, 1, 0); camera.updateMatrixWorld();
  beginDrag({ id: "dragged", body, hit: new Vector3(0, 1, 0), camera, minY: 0.5, pointerId: 7, canvas, clientX: 400, clientY: 300 });
  return { world, body, camera, captured };
}
test("real Rapier drag switches body mode, clamps throw and releases capture", () => {
  const { world, body, camera, captured } = setupDrag();
  assert.equal(body.bodyType(), RAPIER.RigidBodyType.KinematicPositionBased); assert.equal(getDragId(), "dragged");
  updatePointer(800, 0); stepDrag(camera, 1/60); endDrag(true);
  assert.equal(body.bodyType(), RAPIER.RigidBodyType.Dynamic);
  assert.ok(Math.hypot(...Object.values(body.linvel())) <= MAX_THROW_SPEED + 1e-5);
  assert.equal(captured.size, 0); assert.equal(getDragId(), null); world.free();
});
test("cancelled drag stops velocity and stays above the floor", () => {
  const { world, body, camera } = setupDrag(); updatePointer(400, 1000); stepDrag(camera, 1/60);
  assert.ok(body.translation().y >= 0.5); endDrag(false); assert.equal(body.linvel().y, 0); world.free();
});
test("cleared or evicted Rapier bodies can safely end an active drag", () => {
  const { world, body, captured } = setupDrag(); world.removeRigidBody(body);
  assert.doesNotThrow(() => endDrag(false)); assert.equal(captured.size, 0); assert.equal(getDragId(), null); world.free();
});
