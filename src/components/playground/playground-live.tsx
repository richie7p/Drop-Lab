import { Canvas } from "@react-three/fiber";
import { World } from "./world";

export default function PlaygroundCanvas() {
  return (
    <Canvas
      shadows
      dpr={[1, 1.75]}
      camera={{ position: [8.6, 6.8, 10.4], fov: 40, near: 0.1, far: 80 }}
      gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      onCreated={({ gl }) => {
        gl.domElement.style.touchAction = "none";
        gl.setClearColor("#0a0a0b");
      }}
      className="absolute inset-0 h-full w-full touch-none"
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
    >
      <World />
    </Canvas>
  );
}
