import { lazy, Suspense, useEffect, useState } from "react";
import { Toolbar } from "./toolbar";
import { usePlayground } from "./store";

const loadLive = () => import("./playground-live");
const PlaygroundCanvas = lazy(loadLive);

if (typeof window !== "undefined") {
  void loadLive();
}

function Keyboard() {
  const spawn = usePlayground((s) => s.spawn);
  const clear = usePlayground((s) => s.clear);
  const togglePaused = usePlayground((s) => s.togglePaused);
  const setSpawnKind = usePlayground((s) => s.setSpawnKind);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
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
      } else if (event.code === "KeyC" || event.code === "Delete") {
        clear();
      } else if (event.code === "KeyP") {
        togglePaused();
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [spawn, clear, togglePaused, setSpawnKind]);

  return null;
}

export function Playground() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <main className="relative h-dvh overflow-hidden bg-bg text-fg">
      {mounted ? (
        <Suspense fallback={null}>
          <PlaygroundCanvas />
        </Suspense>
      ) : null}
      {!mounted ? (
        <div className="pointer-events-none absolute inset-x-0 top-1/2 z-20 flex -translate-y-1/2 justify-center">
          <p className="rounded-xl bg-surface px-4 py-2 font-display text-xl text-fg shadow-border">
            載入物理引擎
          </p>
        </div>
      ) : null}
      <Toolbar />
      <Keyboard />
    </main>
  );
}
