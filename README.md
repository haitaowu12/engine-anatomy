# Engine Anatomy

An original interactive educational atlas of a generic free-turbine turboshaft: inspect the cutaway, select components and follow a load change through a simplified fuel-control loop.

- **GitHub Pages:** https://haitaowu12.github.io/engine-anatomy/
- **GPT Site (owner-private):** https://engine-anatomy.techiesea.chatgpt.site

## Explore

Select any of ten components to inspect inputs, outputs, energy transfer, motion and dependencies. Orbit/zoom the original 3D schematic, isolate a part, separate stage groups, or close the casing. Apply a load step to see speed dip and recovery. Apply a fuel ceiling to see persistent speed droop. Follow fuel metering, sensors, controller feedback, accessory services and aircraft interfaces.

A conceptual two-spool turbofan comparison is included. **Only the turboshaft is simulated.** All engine geometry, numerical parameters and control logic are original educational assumptions; no manufacturer-specific maps, artwork or private training material is used.

## Run locally

Requires Node.js 22 and Python 3 for the optional preview server.

```sh
npm ci
npm test
npm run build
python3 -m http.server 4173 --bind 127.0.0.1 --directory dist
```

Open `http://127.0.0.1:4173`. Use `?render=schematic` to select the 2D fallback explicitly. WebGL failures also use this fallback. All component explanations, diagrams, model controls and plots remain available without WebGL.

The static build bundles a pinned official Three.js dependency locally. It needs no CDN, account, telemetry or backend. The published app uses system fonts.

## Model and implementation

- [`src/simulation.js`](src/simulation.js): deterministic 120 Hz model, thermodynamic balances, two shaft inertias, synthetic load law, PI governor, actuator lag and limits.
- [`src/components.js`](src/components.js): original explanations and public references.
- [`src/renderer.js`](src/renderer.js): original procedural geometry, semantic selection, view overlays and camera controls.
- [`src/app.js`](src/app.js): accessible HTML UI, fixed-step time accumulator and common-state chart/readouts.
- [`docs/MODEL.md`](docs/MODEL.md): equations, assumptions, parameters and fidelity boundaries.
- [`docs/SOURCES.md`](docs/SOURCES.md): claim, source, asset and rights ledger.
- [`docs/VERIFICATION.md`](docs/VERIFICATION.md): checks and observed behavior.

These are properties of a teaching model, not validation against a physical engine. Start/stop, surge, stall, combustion stability, real maps, flight performance, production FADEC logic, sensor faults, electrical circuits and oil circuit dynamics are outside scope. Do not use this product for engine operation or design validation.

## Publishing

The `Deploy GitHub Pages` workflow installs the locked dependency, runs model checks, builds static assets and deploys through GitHub's official Pages actions. Sites identity is retained in `.openai/hosting.json`; GPT Site publication uses its supported source synchronization, archive and native deployment workflow.

MIT for original project code and assets; Three.js has its own included MIT notice. Linked public references remain with their publishers; no source artwork or documents are distributed.
