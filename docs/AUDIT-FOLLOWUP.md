# PDF audit follow-up — 2026-10-04

This file maps the 2026-10-03 portfolio audit to implemented changes and evidence. Repeated dependency/build findings in the PDF refer to the same remediation. Local checks use Windows, Node 22.23.2 and npm 10.9.8. CI runs the same install/lint/typecheck/test/build gates on Ubuntu and Windows, and production browser interactions on Ubuntu.

## Reproducible checks

```sh
npm ci
npm run lint
npm run typecheck
npm test
npm audit --audit-level=high
npm run build
npm run check:bundle
npx playwright install chromium
npm run test:e2e
```

`test:scaffold` and `test:domain` report separate suites. E2E runs Chromium desktop and a Pixel 7 viewport/touch context against the production build. Set `E2E_DEV=1` to exercise the development server. This is browser emulation, not physical-device certification. Screenshots and Playwright traces are retained for diagnosis.

## Shared fixes

- **Windows build P1:** the app environment wrapper resolves the installed Vite JavaScript entry and launches it with the current Node executable. It preserves environment precedence, signal and exit propagation, without command-shell interpolation. A regression test invokes `vite --version` through this wrapper; the standard `npm run build` is exercised in both OS jobs.
- **Typecheck/lint P2:** safely narrow router errors before reading their message; document the intentional opaque-token fallback in the connector catch. Existing lint rules and TypeScript strictness remain enabled. Test fixture directory links use Windows junctions; generic PWA tests run against an isolated empty fixture rather than inheriting this app's real share-card configuration.
- **Dependency P2 (repeated):** compatible lockfile updates remove the observed js-yaml/fast-uri/brace-expansion findings. Clean `npm ci` and current full-tree `npm audit` passed with zero findings. This is a dated scan, not a guarantee against future advisories; CI repeats the scan.
- **Build reproducibility:** generated `.vercel` output is excluded from version control and rebuilt by CI. Source assets, branding, platform middleware and app environment flags are retained.
- **Performance:** compiler-supported `createClientOnlyFn` imports remove browser renderers from the SSR graph. Named renderer/runtime chunks are cached separately. A bundle gate measures gzip transfer size (200 KiB per ordinary JS chunk) and checks that renderer chunks do not reappear in SSR. Raw-size Vite warnings remain visible; splitting does not eliminate total bytes or prove GPU performance.

References: [TanStack environment functions](https://tanstack.com/start/latest/docs/framework/react/guide/environment-functions), [Vite production chunking](https://vite.dev/guide/build).

## PDF pages 9–10

| Finding | Change / evidence | Status |
| --- | --- | --- |
| Clean install blocked by React/R3F peers | Current manifest uses React 19 + Fiber 9 + Drei 10 + Rapier 2. Clean install and regenerated lockfile pass without legacy peer flags; CI repeats `npm ci` on both OSes | Addressed / verified current tree |
| 3.17 MB first-interaction runtime | Removed eager prefetch; the accessible shell loads first and the user starts the experiment explicitly. Renderer and WASM are separate cached chunks; browser tests verify no physics chunk is requested before Start. Rapier's embedded WASM remains about 2.24 MB raw / 842 kB gzip, with a dedicated 850 KiB transfer ceiling; this exception is documented rather than hiding Vite warnings | Mitigated; WASM cost remains |
| Typecheck/lint and Windows wrapper | Shared fixes, strict gates | Addressed |
| Missing physics/body-cap/pause/clear/drag tests | 7 domain tests include actual Rapier bodies, throw speed, floor boundary, cancellation, removed-body cleanup, finite controls, shape dimensions and body cap. Browser tests cover start/spawn/pause/clear/keyboard activation on desktop/mobile | Addressed within listed cases |
| Drag reliability | Pointer cancellation stops throwing, unmount ends drag, removed bodies are checked before mutation, degenerate pointer geometry is ignored, and keyboard activation of spawn buttons works | Addressed |
| Runtime readiness | Loading state remains until the physics world mounts; failures display a retryable error boundary | Addressed |
| Console response policy / real WebGL | Page-error assertions cover local interactions; deployment policies and physical devices need separate evidence | External verification |

## Remaining verification

Low-end WebGL/GPU benchmarks, sustained 56-body workloads, memory growth, touch dragging on physical devices, and deployed console/header behavior remain unverified. The Rapier WASM transfer remains substantial; a non-compat WASM distribution or worker architecture requires a separate compatibility evaluation. No frame-rate or first-interaction latency guarantee is claimed.

## Local result

- Clean install, lint, typecheck (including tests), standard production build and bundle gate: passed.
- Scaffold: 196 script tests + 24 auth/connector tests passed.
- Product domain: 7 passed. Production E2E: 2 passed (desktop/mobile).
- Current full dependency audit: 0 vulnerabilities.
- Desktop/mobile screenshots inspected: visible scene and controls, no horizontal overflow.
