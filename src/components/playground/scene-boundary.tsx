import { Component, type ReactNode } from "react";
export class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    if (this.state.failed) return <div role="alert" className="absolute inset-x-0 top-1/3 z-40 text-center text-fg"><p>無法載入物理場景，請確認瀏覽器支援 WebGL。</p><button className="mt-4 underline" onClick={() => window.location.reload()}>重新載入</button></div>;
    return this.props.children;
  }
}
