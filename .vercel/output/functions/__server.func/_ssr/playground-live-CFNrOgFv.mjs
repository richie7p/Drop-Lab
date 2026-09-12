import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { S as require_jsx_runtime, a as useFrame, b as Vector3, g as Plane, i as Canvas, n as OrbitControls, o as useThree, r as useCursor, t as Grid, v as Raycaster, y as Vector2 } from "../_libs/@react-three/drei+[...].mjs";
import { a as GRID_SECTION, i as GRID_CELL, n as usePlayground, o as SCENE_BG, r as DEFAULT_FRICTION, s as SLAB_THICKNESS } from "./routes-CwmW_WXa.mjs";
import { a as RigidBody, i as Physics, n as CuboidCollider, o as useBeforePhysicsStep, r as CylinderCollider, t as BallCollider } from "../_libs/@react-three/rapier+[...].mjs";
import { s as zA } from "../_libs/dimforge__rapier3d-compat.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/playground-live-CFNrOgFv.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var _ray = new Raycaster();
var _ndc = new Vector2();
var _hit = new Vector3();
var _dir = new Vector3();
var _cam = new Vector3();
var session = null;
var pointer = {
	x: 0,
	y: 0
};
var canvasEl = null;
function getDragId() {
	return session?.id ?? null;
}
function isDragging() {
	return session !== null;
}
function beginDrag(opts) {
	if (session) endDrag(false);
	opts.body.setLinvel({
		x: 0,
		y: 0,
		z: 0
	}, true);
	opts.body.setAngvel({
		x: 0,
		y: 0,
		z: 0
	}, true);
	opts.body.setBodyType(zA.KinematicPositionBased, true);
	opts.body.wakeUp();
	const plane = new Plane();
	opts.camera.getWorldDirection(_dir);
	plane.setFromNormalAndCoplanarPoint(_dir, opts.hit);
	const t = opts.body.translation();
	session = {
		id: opts.id,
		body: opts.body,
		plane,
		offset: new Vector3(t.x - opts.hit.x, t.y - opts.hit.y, t.z - opts.hit.z),
		prev: new Vector3(t.x, t.y, t.z),
		vel: new Vector3(),
		minY: opts.minY,
		pointerId: opts.pointerId
	};
	canvasEl = opts.canvas;
	updatePointer(opts.clientX, opts.clientY);
	try {
		opts.canvas.setPointerCapture(opts.pointerId);
	} catch {}
	usePlayground.getState().setDragging(true);
}
function updatePointer(clientX, clientY) {
	if (!canvasEl) return;
	const rect = canvasEl.getBoundingClientRect();
	pointer.x = (clientX - rect.left) / rect.width * 2 - 1;
	pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1;
}
function stepDrag(camera, dt) {
	if (!session) return;
	_ndc.set(pointer.x, pointer.y);
	_ray.setFromCamera(_ndc, camera);
	if (!_ray.ray.intersectPlane(session.plane, _hit)) return;
	_cam.copy(_hit).add(session.offset);
	_cam.y = Math.max(_cam.y, session.minY);
	const invDt = dt > 1e-4 ? 1 / dt : 60;
	session.vel.set((_cam.x - session.prev.x) * invDt, (_cam.y - session.prev.y) * invDt, (_cam.z - session.prev.z) * invDt);
	session.prev.copy(_cam);
	session.body.setNextKinematicTranslation({
		x: _cam.x,
		y: _cam.y,
		z: _cam.z
	});
	session.body.setTranslation({
		x: _cam.x,
		y: _cam.y,
		z: _cam.z
	}, true);
}
function endDrag(throwBody = true) {
	if (!session) return;
	const { body, vel, pointerId } = session;
	const speed = vel.length();
	if (speed > 16) vel.multiplyScalar(16 / speed);
	body.setBodyType(zA.Dynamic, true);
	if (throwBody) body.setLinvel({
		x: vel.x,
		y: vel.y,
		z: vel.z
	}, true);
	else body.setLinvel({
		x: 0,
		y: 0,
		z: 0
	}, true);
	body.wakeUp();
	if (canvasEl) try {
		canvasEl.releasePointerCapture(pointerId);
	} catch {}
	session = null;
	canvasEl = null;
	usePlayground.getState().setDragging(false);
}
function minExtent(spec) {
	if (spec.kind === "sphere") return spec.params[0] ?? .35;
	if (spec.kind === "box") return (spec.params[1] ?? .5) / 2;
	return (spec.params[1] ?? .7) / 2;
}
function Shape({ spec }) {
	const bodyRef = (0, import_react.useRef)(null);
	const { gl } = useThree();
	const [hovered, setHovered] = (0, import_react.useState)(false);
	const restitution = usePlayground((s) => s.restitution);
	const remove = usePlayground((s) => s.remove);
	const dragging = usePlayground((s) => s.dragging);
	useCursor(hovered || dragging);
	(0, import_react.useEffect)(() => {
		const body = bodyRef.current;
		if (!body) return;
		const count = body.numColliders();
		for (let i = 0; i < count; i += 1) body.collider(i).setRestitution(restitution);
	}, [restitution]);
	useFrame(() => {
		const body = bodyRef.current;
		if (!body) return;
		if (body.translation().y < -8) remove(spec.id);
	});
	const angularVelocity = (0, import_react.useMemo)(() => {
		if (!spec.jiggle) return [
			0,
			0,
			0
		];
		return [
			(Math.random() - .5) * 2.4,
			(Math.random() - .5) * 2.4,
			(Math.random() - .5) * 2.4
		];
	}, [spec.jiggle]);
	const onPointerDown = (event) => {
		event.stopPropagation();
		const body = bodyRef.current;
		if (!body || isDragging()) return;
		beginDrag({
			id: spec.id,
			body,
			hit: event.point,
			camera: event.camera,
			minY: minExtent(spec) + .04,
			pointerId: event.pointerId,
			canvas: gl.domElement,
			clientX: event.nativeEvent.clientX,
			clientY: event.nativeEvent.clientY
		});
	};
	const material = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
		color: spec.color,
		roughness: spec.kind === "box" ? .74 : spec.kind === "sphere" ? .34 : .26,
		metalness: spec.kind === "box" ? .04 : spec.kind === "sphere" ? .14 : .58
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RigidBody, {
		ref: bodyRef,
		colliders: false,
		position: spec.position,
		rotation: spec.rotation,
		restitution,
		friction: DEFAULT_FRICTION,
		linearDamping: .08,
		angularDamping: .12,
		angularVelocity,
		ccd: true,
		canSleep: true,
		children: spec.kind === "sphere" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BallCollider, {
			args: [spec.params[0] ?? .35],
			restitution,
			friction: DEFAULT_FRICTION
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			castShadow: true,
			receiveShadow: true,
			onPointerDown,
			onPointerOver: () => setHovered(true),
			onPointerOut: () => setHovered(false),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
				spec.params[0] ?? .35,
				32,
				24
			] }), material]
		})] }) : spec.kind === "box" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CuboidCollider, {
			args: [
				(spec.params[0] ?? .5) / 2,
				(spec.params[1] ?? .5) / 2,
				(spec.params[2] ?? .5) / 2
			],
			restitution,
			friction: DEFAULT_FRICTION
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			castShadow: true,
			receiveShadow: true,
			onPointerDown,
			onPointerOver: () => setHovered(true),
			onPointerOut: () => setHovered(false),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				spec.params[0] ?? .5,
				spec.params[1] ?? .5,
				spec.params[2] ?? .5
			] }), material]
		})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CylinderCollider, {
			args: [(spec.params[1] ?? .7) / 2, spec.params[0] ?? .28],
			restitution,
			friction: DEFAULT_FRICTION
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			castShadow: true,
			receiveShadow: true,
			onPointerDown,
			onPointerOver: () => setHovered(true),
			onPointerOut: () => setHovered(false),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
				spec.params[0] ?? .28,
				spec.params[0] ?? .28,
				spec.params[1] ?? .7,
				28
			] }), material]
		})] })
	});
}
function FrameScene() {
	const { camera, size } = useThree();
	(0, import_react.useLayoutEffect)(() => {
		const portrait = size.height / Math.max(size.width, 1) > 1.15;
		const cam = camera;
		cam.position.set(portrait ? 6.2 : 8.6, portrait ? 8.2 : 6.8, portrait ? 7.8 : 10.4);
		cam.fov = portrait ? 46 : 40;
		cam.updateProjectionMatrix();
	}, [
		camera,
		size.height,
		size.width
	]);
	return null;
}
function Lights() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("hemisphereLight", { args: [
			"#eceae4",
			"#1b1b20",
			.55
		] }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ambientLight", { intensity: .18 }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("directionalLight", {
			castShadow: true,
			position: [
				10,
				16,
				8
			],
			intensity: 1.55,
			color: "#f3f1eb",
			"shadow-mapSize": [1024, 1024],
			"shadow-camera-near": 1,
			"shadow-camera-far": 40,
			"shadow-camera-left": -14,
			"shadow-camera-right": 14,
			"shadow-camera-top": 14,
			"shadow-camera-bottom": -14,
			"shadow-bias": -4e-4
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("directionalLight", {
			position: [
				-8,
				6,
				-6
			],
			intensity: .28,
			color: "#cfd3da"
		})
	] });
}
function VisualGround() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
		receiveShadow: true,
		position: [
			0,
			-SLAB_THICKNESS / 2,
			0
		],
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
			16,
			SLAB_THICKNESS,
			16
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
			color: "#16161b",
			roughness: .94,
			metalness: .04
		})]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Grid, {
		position: [
			0,
			.008,
			0
		],
		args: [16, 16],
		cellSize: .5,
		cellThickness: .55,
		cellColor: GRID_CELL,
		sectionSize: 2,
		sectionThickness: 1.05,
		sectionColor: GRID_SECTION,
		fadeDistance: 26,
		fadeStrength: 1.35,
		infiniteGrid: false
	})] });
}
function PhysicsGround() {
	const restitution = usePlayground((s) => s.restitution);
	const half = 8;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RigidBody, {
		type: "fixed",
		colliders: false,
		friction: .92,
		restitution,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CuboidCollider, {
			args: [
				half,
				SLAB_THICKNESS / 2,
				half
			],
			position: [
				0,
				-SLAB_THICKNESS / 2,
				0
			],
			restitution,
			friction: .92
		})
	});
}
function DragSystem() {
	const { camera, gl } = useThree();
	const bodies = usePlayground((s) => s.bodies);
	useBeforePhysicsStep(() => {
		stepDrag(camera, 1 / 60);
	});
	(0, import_react.useEffect)(() => {
		const id = getDragId();
		if (id && !bodies.some((body) => body.id === id)) endDrag(false);
	}, [bodies]);
	(0, import_react.useEffect)(() => {
		const canvas = gl.domElement;
		canvas.style.touchAction = "none";
		canvas.style.cursor = "grab";
		const onMove = (event) => {
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
function World() {
	const gravity = usePlayground((s) => s.gravity);
	const paused = usePlayground((s) => s.paused);
	const bodies = usePlayground((s) => s.bodies);
	const dragging = usePlayground((s) => s.dragging);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("color", {
			attach: "background",
			args: [SCENE_BG]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("fog", {
			attach: "fog",
			args: [
				SCENE_BG,
				18,
				40
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FrameScene, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lights, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VisualGround, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrbitControls, {
			makeDefault: true,
			enabled: !dragging,
			enableDamping: true,
			dampingFactor: .08,
			minPolarAngle: .18,
			maxPolarAngle: Math.PI / 2 - .05,
			minDistance: 5,
			maxDistance: 26,
			target: [
				0,
				.35,
				0
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Suspense, {
			fallback: null,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Physics, {
				gravity: [
					0,
					-gravity,
					0
				],
				paused,
				timeStep: 1 / 60,
				interpolate: true,
				numSolverIterations: 8,
				numInternalPgsIterations: 2,
				colliders: false,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DragSystem, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PhysicsGround, {}),
					bodies.map((body) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shape, { spec: body }, body.id))
				]
			})
		})
	] });
}
function PlaygroundCanvas() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Canvas, {
		shadows: true,
		dpr: [1, 1.75],
		camera: {
			position: [
				8.6,
				6.8,
				10.4
			],
			fov: 40,
			near: .1,
			far: 80
		},
		gl: {
			antialias: true,
			alpha: false,
			powerPreference: "high-performance"
		},
		onCreated: ({ gl }) => {
			gl.domElement.style.touchAction = "none";
			gl.setClearColor("#0a0a0b");
		},
		className: "absolute inset-0 h-full w-full touch-none",
		style: {
			position: "absolute",
			inset: 0,
			width: "100%",
			height: "100%"
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(World, {})
	});
}
//#endregion
export { PlaygroundCanvas as default };
