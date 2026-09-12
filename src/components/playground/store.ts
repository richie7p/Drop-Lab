import { create } from "zustand";
import {
  DEFAULT_GRAVITY,
  DEFAULT_RESTITUTION,
  MAX_BODIES,
  SHAPE_COLORS,
} from "./constants";

export type ShapeKind = "sphere" | "box" | "cylinder";

export type BodySpec = {
  id: string;
  kind: ShapeKind;
  position: [number, number, number];
  rotation: [number, number, number];
  color: string;
  params: number[];
  jiggle: boolean;
};

type PlaygroundState = {
  gravity: number;
  restitution: number;
  spawnKind: ShapeKind;
  bodies: BodySpec[];
  dragging: boolean;
  paused: boolean;
  spawn: (kind?: ShapeKind, position?: [number, number, number]) => void;
  clear: () => void;
  remove: (id: string) => void;
  setGravity: (gravity: number) => void;
  setRestitution: (restitution: number) => void;
  setSpawnKind: (kind: ShapeKind) => void;
  setDragging: (dragging: boolean) => void;
  setPaused: (paused: boolean) => void;
  togglePaused: () => void;
};

function pick<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)]!;
}

let seq = 0;

function nextId() {
  seq += 1;
  return `body-${seq}`;
}

export function createBody(
  kind: ShapeKind,
  position?: [number, number, number],
  jiggle = false,
): BodySpec {
  const color = pick(SHAPE_COLORS);
  const rotation: [number, number, number] = [
    0,
    Math.random() * Math.PI * 2,
    0,
  ];
  const pos: [number, number, number] = position ?? [
    (Math.random() - 0.5) * 1.8,
    3.6 + Math.random() * 1.1,
    (Math.random() - 0.5) * 1.8,
  ];

  if (kind === "sphere") {
    return {
      id: nextId(),
      kind,
      position: pos,
      rotation,
      color,
      params: [0.32 + Math.random() * 0.16],
      jiggle,
    };
  }

  if (kind === "box") {
    return {
      id: nextId(),
      kind,
      position: pos,
      rotation,
      color,
      params: [
        0.46 + Math.random() * 0.3,
        0.46 + Math.random() * 0.3,
        0.46 + Math.random() * 0.3,
      ],
      jiggle,
    };
  }

  return {
    id: nextId(),
    kind,
    position: pos,
    rotation,
    color,
    params: [0.24 + Math.random() * 0.1, 0.62 + Math.random() * 0.3],
    jiggle,
  };
}

function initialBodies(): BodySpec[] {
  const tower: ShapeKind[] = [
    "box",
    "box",
    "cylinder",
    "sphere",
    "box",
    "sphere",
    "cylinder",
    "box",
  ];
  const stacked = tower.map((kind, i) =>
    createBody(kind, [
      ((i % 2) - 0.5) * 0.12,
      0.55 + i * 0.82,
      ((i % 3) - 1) * 0.1,
    ]),
  );
  return [
    ...stacked,
    createBody("sphere", [-2.4, 1.1, 1.6]),
    createBody("box", [2.6, 1.3, -1.7]),
    createBody("cylinder", [-1.8, 1.5, -2.2]),
  ];
}

export const usePlayground = create<PlaygroundState>((set, get) => ({
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
      if (next.length > MAX_BODIES) {
        next.splice(0, next.length - MAX_BODIES);
      }
      return { bodies: next, spawnKind: nextKind };
    });
  },

  clear: () => set({ bodies: [], dragging: false }),

  remove: (id) =>
    set((state) => ({ bodies: state.bodies.filter((body) => body.id !== id) })),

  setGravity: (gravity) => set({ gravity }),
  setRestitution: (restitution) => set({ restitution }),
  setSpawnKind: (spawnKind) => set({ spawnKind }),
  setDragging: (dragging) => set({ dragging }),
  setPaused: (paused) => set({ paused }),
  togglePaused: () => set((state) => ({ paused: !state.paused })),
}));
