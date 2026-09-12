import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { S as require_jsx_runtime } from "../_libs/@react-three/drei+[...].mjs";
import { t as create } from "../_libs/zustand.mjs";
import { a as Cylinder, i as Pause, n as Trash2, o as Circle, r as Play, s as Box } from "../_libs/lucide-react.mjs";
import { t as Slot } from "../_libs/radix-ui__react-slot.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-CwmW_WXa.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var SCENE_BG = "#0a0a0b";
var SLAB_THICKNESS = .46;
var DEFAULT_GRAVITY = 9.81;
var DEFAULT_RESTITUTION = .28;
var DEFAULT_FRICTION = .82;
var SHAPE_COLORS = [
	"#d5cfc4",
	"#8d96a1",
	"#5d6570",
	"#b7a894",
	"#e6e1d8",
	"#6a7380"
];
var GRID_CELL = "#2c2c34";
var GRID_SECTION = "#3e3e48";
function pick(items) {
	return items[Math.floor(Math.random() * items.length)];
}
var seq = 0;
function nextId() {
	seq += 1;
	return `body-${seq}`;
}
function createBody(kind, position, jiggle = false) {
	const color = pick(SHAPE_COLORS);
	const rotation = [
		0,
		Math.random() * Math.PI * 2,
		0
	];
	const pos = position ?? [
		(Math.random() - .5) * 1.8,
		3.6 + Math.random() * 1.1,
		(Math.random() - .5) * 1.8
	];
	if (kind === "sphere") return {
		id: nextId(),
		kind,
		position: pos,
		rotation,
		color,
		params: [.32 + Math.random() * .16],
		jiggle
	};
	if (kind === "box") return {
		id: nextId(),
		kind,
		position: pos,
		rotation,
		color,
		params: [
			.46 + Math.random() * .3,
			.46 + Math.random() * .3,
			.46 + Math.random() * .3
		],
		jiggle
	};
	return {
		id: nextId(),
		kind,
		position: pos,
		rotation,
		color,
		params: [.24 + Math.random() * .1, .62 + Math.random() * .3],
		jiggle
	};
}
function initialBodies() {
	return [
		...[
			"box",
			"box",
			"cylinder",
			"sphere",
			"box",
			"sphere",
			"cylinder",
			"box"
		].map((kind, i) => createBody(kind, [
			(i % 2 - .5) * .12,
			.55 + i * .82,
			(i % 3 - 1) * .1
		])),
		createBody("sphere", [
			-2.4,
			1.1,
			1.6
		]),
		createBody("box", [
			2.6,
			1.3,
			-1.7
		]),
		createBody("cylinder", [
			-1.8,
			1.5,
			-2.2
		])
	];
}
var usePlayground = create((set, get) => ({
	gravity: DEFAULT_GRAVITY,
	restitution: DEFAULT_RESTITUTION,
	spawnKind: "sphere",
	bodies: initialBodies(),
	dragging: false,
	paused: false,
	spawn: (kind, position) => {
		const nextKind = kind ?? get().spawnKind;
		set((state) => {
			const next = [...state.bodies, createBody(nextKind, position, true)];
			if (next.length > 56) next.splice(0, next.length - 56);
			return {
				bodies: next,
				spawnKind: nextKind
			};
		});
	},
	clear: () => set({
		bodies: [],
		dragging: false
	}),
	remove: (id) => set((state) => ({ bodies: state.bodies.filter((body) => body.id !== id) })),
	setGravity: (gravity) => set({ gravity }),
	setRestitution: (restitution) => set({ restitution }),
	setSpawnKind: (spawnKind) => set({ spawnKind }),
	setDragging: (dragging) => set({ dragging }),
	setPaused: (paused) => set({ paused }),
	togglePaused: () => set((state) => ({ paused: !state.paused }))
}));
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 pressable", {
	variants: {
		variant: {
			default: "bg-accent text-accent-fg hover:bg-accent/90",
			secondary: "bg-surface-2 text-fg shadow-border hover:bg-surface-2/80",
			ghost: "text-muted hover:bg-surface-2 hover:text-fg",
			danger: "bg-danger text-fg hover:opacity-90"
		},
		size: {
			default: "h-11 rounded-lg px-4",
			sm: "h-9 rounded-md px-3 text-xs",
			icon: "size-11 rounded-lg"
		},
		active: {
			true: "bg-accent text-accent-fg hover:bg-accent/90",
			false: ""
		}
	},
	defaultVariants: {
		variant: "secondary",
		size: "default"
	}
});
function Button({ className, variant, size, active, asChild = false, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size,
			active
		}), className),
		...props
	});
}
var SHAPES = [
	{
		kind: "sphere",
		label: "球體",
		icon: Circle
	},
	{
		kind: "box",
		label: "盒子",
		icon: Box
	},
	{
		kind: "cylinder",
		label: "圓柱",
		icon: Cylinder
	}
];
function useHoldRepeat(action, delay = 180) {
	const holdRef = (0, import_react.useRef)(null);
	const actionRef = (0, import_react.useRef)(action);
	actionRef.current = action;
	const stop = () => {
		if (holdRef.current !== null) {
			window.clearInterval(holdRef.current);
			holdRef.current = null;
		}
	};
	const start = () => {
		stop();
		actionRef.current();
		holdRef.current = window.setInterval(() => actionRef.current(), delay);
	};
	(0, import_react.useEffect)(() => stop, []);
	return {
		start,
		stop
	};
}
function SliderField({ label, value, display, min, max, step, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "flex min-w-36 flex-1 items-center gap-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "w-10 shrink-0 text-xs font-medium text-muted",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				type: "range",
				min,
				max,
				step,
				value,
				"aria-label": label,
				onChange: (event) => onChange(Number(event.target.value)),
				className: "h-11 w-full cursor-pointer"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "w-10 shrink-0 text-right font-mono text-xs tabular-nums text-fg",
				children: display
			})
		]
	});
}
function Toolbar() {
	const spawnKind = usePlayground((s) => s.spawnKind);
	const spawn = usePlayground((s) => s.spawn);
	const clear = usePlayground((s) => s.clear);
	const paused = usePlayground((s) => s.paused);
	const togglePaused = usePlayground((s) => s.togglePaused);
	const gravity = usePlayground((s) => s.gravity);
	const restitution = usePlayground((s) => s.restitution);
	const setGravity = usePlayground((s) => s.setGravity);
	const setRestitution = usePlayground((s) => s.setRestitution);
	const count = usePlayground((s) => s.bodies.length);
	const holds = {
		sphere: useHoldRepeat(() => spawn("sphere")),
		box: useHoldRepeat(() => spawn("box")),
		cylinder: useHoldRepeat(() => spawn("cylinder"))
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pointer-events-none absolute inset-0 z-30 flex flex-col justify-between p-3 pt-4 sm:p-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "flex items-start justify-between gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[0.65rem] font-medium uppercase tracking-[0.22em] text-muted",
				children: "Drop Lab"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-3xl leading-tight tracking-tight text-fg text-balance sm:text-4xl",
				children: "掉落實驗室"
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl bg-surface px-3 py-2 shadow-border",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[0.65rem] font-medium uppercase tracking-[0.16em] text-muted",
					children: "物體"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-right font-mono text-lg tabular-nums leading-none text-fg",
					children: count
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col items-stretch gap-2 sm:items-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "pointer-events-none hidden text-center text-xs text-subtle sm:block",
				children: "拖曳物體 · 拖空白處旋轉視角 · 長按形狀連發"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pointer-events-auto mx-auto w-full max-w-3xl rounded-2xl bg-surface p-2 shadow-border",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-1 lg:flex-row lg:items-center lg:gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-1 sm:gap-2",
						children: [
							SHAPES.map(({ kind, label, icon: Icon }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								type: "button",
								variant: spawnKind === kind ? "default" : "secondary",
								className: "min-w-0 flex-1 px-2 sm:min-w-20 sm:flex-none sm:px-4",
								"aria-pressed": spawnKind === kind,
								onPointerDown: (event) => {
									if (event.button !== 0) return;
									event.currentTarget.setPointerCapture(event.pointerId);
									holds[kind].start();
								},
								onPointerUp: holds[kind].stop,
								onPointerCancel: holds[kind].stop,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {}), label]
							}, kind)),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								type: "button",
								variant: "secondary",
								onClick: clear,
								className: "min-w-0 flex-1 px-2 sm:min-w-20 sm:flex-none sm:px-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, {}), "清除"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								type: "button",
								variant: "ghost",
								onClick: togglePaused,
								"aria-pressed": paused,
								className: "min-w-0 flex-1 px-2 sm:min-w-20 sm:flex-none sm:px-4",
								children: [paused ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pause, {}), paused ? "繼續" : "暫停"]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex min-w-0 flex-1 flex-col gap-0 px-1 sm:flex-row sm:gap-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderField, {
							label: "重力",
							value: gravity,
							display: gravity.toFixed(1),
							min: 0,
							max: 20,
							step: .1,
							onChange: setGravity
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderField, {
							label: "彈性",
							value: restitution,
							display: restitution.toFixed(2),
							min: 0,
							max: 1,
							step: .01,
							onChange: setRestitution
						})]
					})]
				})
			})]
		})]
	});
}
var loadLive = () => import("./playground-live-CFNrOgFv.mjs");
var PlaygroundCanvas = (0, import_react.lazy)(loadLive);
if (typeof window !== "undefined") loadLive();
function Keyboard() {
	const spawn = usePlayground((s) => s.spawn);
	const clear = usePlayground((s) => s.clear);
	const togglePaused = usePlayground((s) => s.togglePaused);
	const setSpawnKind = usePlayground((s) => s.setSpawnKind);
	(0, import_react.useEffect)(() => {
		const onKey = (event) => {
			const target = event.target;
			if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return;
			if (event.code === "Digit1") {
				setSpawnKind("sphere");
				spawn("sphere");
			} else if (event.code === "Digit2") {
				setSpawnKind("box");
				spawn("box");
			} else if (event.code === "Digit3") {
				setSpawnKind("cylinder");
				spawn("cylinder");
			} else if (event.code === "Space") {
				event.preventDefault();
				spawn();
			} else if (event.code === "KeyC" || event.code === "Delete") clear();
			else if (event.code === "KeyP") togglePaused();
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [
		spawn,
		clear,
		togglePaused,
		setSpawnKind
	]);
	return null;
}
function Playground() {
	const [mounted, setMounted] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		setMounted(true);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "relative h-dvh overflow-hidden bg-bg text-fg",
		children: [
			mounted ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Suspense, {
				fallback: null,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlaygroundCanvas, {})
			}) : null,
			!mounted ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pointer-events-none absolute inset-x-0 top-1/2 z-20 flex -translate-y-1/2 justify-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "rounded-xl bg-surface px-4 py-2 font-display text-xl text-fg shadow-border",
					children: "載入物理引擎"
				})
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toolbar, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Keyboard, {})
		]
	});
}
var routes_exports = /* @__PURE__ */ __exportAll({ component: () => SplitComponent });
var SplitComponent = Playground;
//#endregion
export { GRID_SECTION as a, GRID_CELL as i, usePlayground as n, SCENE_BG as o, DEFAULT_FRICTION as r, SLAB_THICKNESS as s, routes_exports as t };
