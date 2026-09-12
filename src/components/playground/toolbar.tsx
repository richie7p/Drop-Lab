import { useEffect, useRef } from "react";
import { Box, Circle, Cylinder, Pause, Play, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePlayground, type ShapeKind } from "./store";

const SHAPES: { kind: ShapeKind; label: string; icon: typeof Circle }[] = [
  { kind: "sphere", label: "球體", icon: Circle },
  { kind: "box", label: "盒子", icon: Box },
  { kind: "cylinder", label: "圓柱", icon: Cylinder },
];

function useHoldRepeat(action: () => void, delay = 180) {
  const holdRef = useRef<number | null>(null);
  const actionRef = useRef(action);
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

  useEffect(() => stop, []);

  return { start, stop };
}

function SliderField({
  label,
  value,
  display,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  display: string;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="flex min-w-36 flex-1 items-center gap-3">
      <span className="w-10 shrink-0 text-xs font-medium text-muted">{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-label={label}
        onChange={(event) => onChange(Number(event.target.value))}
        className="h-11 w-full cursor-pointer"
      />
      <span className="w-10 shrink-0 text-right font-mono text-xs tabular-nums text-fg">
        {display}
      </span>
    </label>
  );
}

export function Toolbar() {
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

  const sphereHold = useHoldRepeat(() => spawn("sphere"));
  const boxHold = useHoldRepeat(() => spawn("box"));
  const cylinderHold = useHoldRepeat(() => spawn("cylinder"));
  const holds = { sphere: sphereHold, box: boxHold, cylinder: cylinderHold };

  return (
    <div className="pointer-events-none absolute inset-0 z-30 flex flex-col justify-between p-3 pt-4 sm:p-5">
      <header className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[0.65rem] font-medium uppercase tracking-[0.22em] text-muted">
            Drop Lab
          </p>
          <h1 className="font-display text-3xl leading-tight tracking-tight text-fg text-balance sm:text-4xl">
            掉落實驗室
          </h1>
        </div>
        <div className="rounded-xl bg-surface px-3 py-2 shadow-border">
          <p className="text-[0.65rem] font-medium uppercase tracking-[0.16em] text-muted">
            物體
          </p>
          <p className="text-right font-mono text-lg tabular-nums leading-none text-fg">
            {count}
          </p>
        </div>
      </header>

      <div className="flex flex-col items-stretch gap-2 sm:items-center">
        <p className="pointer-events-none hidden text-center text-xs text-subtle sm:block">
          拖曳物體 · 拖空白處旋轉視角 · 長按形狀連發
        </p>
        <div className="pointer-events-auto mx-auto w-full max-w-3xl rounded-2xl bg-surface p-2 shadow-border">
          <div className="flex flex-col gap-1 lg:flex-row lg:items-center lg:gap-3">
            <div className="flex gap-1 sm:gap-2">
              {SHAPES.map(({ kind, label, icon: Icon }) => (
                <Button
                  key={kind}
                  type="button"
                  variant={spawnKind === kind ? "default" : "secondary"}
                  className="min-w-0 flex-1 px-2 sm:min-w-20 sm:flex-none sm:px-4"
                  aria-pressed={spawnKind === kind}
                  onPointerDown={(event) => {
                    if (event.button !== 0) return;
                    event.currentTarget.setPointerCapture(event.pointerId);
                    holds[kind].start();
                  }}
                  onPointerUp={holds[kind].stop}
                  onPointerCancel={holds[kind].stop}
                >
                  <Icon />
                  {label}
                </Button>
              ))}
              <Button
                type="button"
                variant="secondary"
                onClick={clear}
                className="min-w-0 flex-1 px-2 sm:min-w-20 sm:flex-none sm:px-4"
              >
                <Trash2 />
                清除
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={togglePaused}
                aria-pressed={paused}
                className="min-w-0 flex-1 px-2 sm:min-w-20 sm:flex-none sm:px-4"
              >
                {paused ? <Play /> : <Pause />}
                {paused ? "繼續" : "暫停"}
              </Button>
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-0 px-1 sm:flex-row sm:gap-5">
              <SliderField
                label="重力"
                value={gravity}
                display={gravity.toFixed(1)}
                min={0}
                max={20}
                step={0.1}
                onChange={setGravity}
              />
              <SliderField
                label="彈性"
                value={restitution}
                display={restitution.toFixed(2)}
                min={0}
                max={1}
                step={0.01}
                onChange={setRestitution}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
