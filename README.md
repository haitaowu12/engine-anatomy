# Engine Anatomy

An original interactive atlas of **three engine–airframe pairs**, with detailed selectable construction, coordinated energy/control views and distinct synthetic running plants.

- [GitHub Pages](https://haitaowu12.github.io/engine-anatomy/)
- [GPT Site](https://engine-anatomy.techiesea.chatgpt.site)

Each deployment exposes `release.json` and an HTML build identifier. Compare those identifiers to establish whether hosts serve the same release.

| Pair | Mechanical and control story |
|---|---|
| Turboshaft / helicopter | Independent gas-generator and power shafts, a representative freewheel, a declared 12:1 reduction, main/tail drivetrain and collective pitch context. Collective changes the equivalent load; fuel governing recovers Np. |
| Turboprop / propeller aircraft | An independent power shaft returns forward inside the hollow gas-generator shaft. A declared 10:1 reduction drives a pitchable propeller. The engine fuel loop regulates requested torque; a separate governor/PCU regulates propeller speed through pitch. |
| Direct-drive turbofan / jet aircraft | HPC/HPT on the HP shaft; fan/LPC/LPT on the LP shaft; distinct core and bypass streams. A demand-derived N1 reference controls fuel response and independent spool dynamics. |

## Explore the release

**Component**, **Walkthrough** and **Experiment** activities share one selection. The component browser, search, physical/system parent links, scene picking, explanatory routes and inspection controls refer to the same semantic IDs. Switching architecture preserves the selected concept where that concept exists. Focus and Return view are explicit camera actions.

The detailed catalog includes individual compressor rotor/stator/disc rows; support frames; a perforated annular combustor liner, dome, swirlers, fuel manifold and injector tips; turbine discs and nozzle guide vanes; independent shafts; bearing races, rolling elements and labyrinth seals. Helicopter, propeller and fan installations retain their different mechanical paths. The shaft-power examples include selectable sun, planet, fixed ring and carrier geometry whose animation matches the declared synthetic reduction.

Choose **Anatomy**, **Shafts & drive**, **Gas · heat · work**, **Control response** or **Service circuits**. The gas view shows calculated total temperatures and separate shaft work balances. The control view distinguishes fuel and propeller-pitch loops. Service views trace representative fuel delivery/bypass, oil pressure/bearing/scavenge/relief/breather paths, and starting/ignition energy, including the distinction between pneumatic power and electrical command.

**Exploded inspection** has authored targets for the whole engine, compressor, combustor, turbines, supports, output drive, fuel filter, oil filter and starter. Casings open around intact spools. Filter caps and elements, support housings and drive covers have target-specific motions. Inspection pauses the plant; reassembly restores its prior pause state. These are instructional openings and separations, not manufacturer maintenance sequences.

**Walkthroughs** explain compression, combustion, independent spools, fuel, oil, conceptual starting/shutdown and architecture-specific pitch/freewheel relationships. Conceptual starting and shutdown do not run an invented numerical start/stop model. **Experiments** retain the tested demand, limiting and accessory-load transients with live causal explanations and traces. **Compare architectures** presents matched questions plus original diagrams for axial/centrifugal compression, forward/reverse flow and direct/geared fan alternatives.

## Rendering and accessibility

WebGL uses differentiated materials, a procedural studio environment, directional illumination and contact shadows. All geometry, diagrams and lighting assets are authored here. No downloaded CAD, manufacturer imagery or external environment map is required.

When WebGL is unavailable, the pinned Three.js SVG backend projects the actual semantic geometry, with lower tessellation and limited shading. Selection, orbit/focus, isolation, inspection and the numerical controls remain available. The status reads **SVG geometry · limited shading**. A final semantic schematic fallback preserves the component catalog, complete service topology and coordinated learning views. It disables unavailable three-dimensional controls.

The interface includes native selects/dialogs, keyboard component selection and camera controls, parent context, source links, reduced motion, mobile layout and quality controls. Selected/step labels have leader lines, viewport bounds, priority packing and an occlusion indication. Automatic, Detail and Battery saver settings bound pixel ratio and rendering frequency; unchanged paused SVG scenes do not reproject.

## Run locally

Requires Node.js 22 or newer. Python 3 is only used by this optional static preview command.

```sh
npm ci
npm test
npm run build
python3 -m http.server 4173 --bind 127.0.0.1 --directory dist
```

Open `http://127.0.0.1:4173`. Select a pair with `?engine=turboprop` or `?engine=turbofan`; link a component with `&component=compressor.stage.1.disc`. Force the geometry fallback with `?render=svg`, or the semantic fallback with `?render=schematic`.

The build bundles pinned `three@0.180.0`, OrbitControls, SVGRenderer, Projector and local fonts. It requires no CDN, account, telemetry or backend. There is no custom development-server command; hosting tools can serve the static `dist` directory directly. Publication audience is managed separately through the native hosting tools.

## Evidence and implementation

- [`docs/PRODUCTION.md`](docs/PRODUCTION.md): release taxonomy, pipeline, rendering budgets, acceptance and boundaries.
- [`docs/INSPECTION.md`](docs/INSPECTION.md): authored recipes, reversible transforms and physical-clearance contract.
- [`docs/MODEL.md`](docs/MODEL.md): equations, synthetic gains, distinct governors and limitations.
- [`docs/INTERFACES.md`](docs/INTERFACES.md): generated component and typed interface catalog.
- [`docs/SOURCES.md`](docs/SOURCES.md): primary public references and asset provenance.
- [`docs/VERIFICATION.md`](docs/VERIFICATION.md): current tests and separately identified historical/browser evidence.
- [`docs/review-2026-11-01.md`](docs/review-2026-11-01.md): source-backed gap analysis and release implementation response.
- `src/anatomy.js`, `detail-geometry.js`, `learning.js`: one component graph, authored construction and coordinated lessons.
- `src/renderer.js`, `vector-renderer.js`, `schematic.js`: geometry backends and final semantic fallback.
- `src/plants.js`, `simulation.js`: unchanged deterministic running-plant equations.

The values and dimensions are **original synthetic educational assumptions**. They are not manufacturer engine maps, certified control logic, production CAD or calibrated aircraft performance. Service routes and construction explain mechanisms; oil/electrical/combustion fields, startup/shutdown, real faults, surge, feather/reverse, stress/life and flight dynamics are not numerically solved. The source-specific alternatives are comparisons, not claims that every engine in a family has the selected architecture.

MIT for original code/assets. Three.js's MIT notice and the font licenses are bundled. Reference documents remain with their publishers; their artwork and manual passages are not copied into this product.
