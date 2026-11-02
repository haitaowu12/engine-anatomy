# Engine Anatomy

An original interactive atlas of **three engine–airframe pairs**, with selectable construction, coordinated energy/control views and distinct synthetic running plants, plus a separate **LEGO Technic H175 mechanism study**.

- [GitHub Pages](https://haitaowu12.github.io/engine-anatomy/)
- [GPT Site](https://engine-anatomy.techiesea.chatgpt.site)

Each deployment exposes `release.json` and an HTML build identifier. Compare those identifiers to establish whether hosts serve the same release.

| Pair | Mechanical and control story |
|---|---|
| Turboshaft / helicopter | Independent gas-generator and power shafts, a representative freewheel, a declared 12:1 reduction, main/tail drivetrain and collective pitch context. Collective changes the equivalent load; fuel governing recovers Np. |
| Turboprop / propeller aircraft | An independent power shaft returns forward inside the hollow gas-generator shaft. A declared 10:1 reduction drives a pitchable propeller. The engine fuel loop regulates requested torque; a separate governor/PCU regulates propeller speed through pitch. |
| Direct-drive turbofan / jet aircraft | HPC/HPT on the HP shaft; fan/LPC/LPT on the LP shaft; distinct core and bypass streams. A demand-derived N1 reference controls fuel response and independent spool dynamics. |

## Illustrated spatial views

The three engine studies and H175 mechanism study use an adaptation of April Zhu’s [Colorfigures](https://april-zhu.com/colorfigures) ink and three-tone drawing style. Three.js supplies geometry, cameras and component picking. The component graph, running plants, lessons, diagrams, inspection recipes and navigation retain their existing behavior.

Drawing paths are composited on a 2D canvas and reused while their geometry, camera and material stay unchanged. Automatic and Battery saver simplify small projected parts to silhouettes; zooming or focusing restores their facets. Detail retains all prepared facets. This painter has no GPU depth buffer; intersecting surfaces remain a limit of the illustration.

Whole-aircraft contexts use Bell 412, Dash 8 and 737 silhouettes and proportions, with original synthetic engines and simplified installations. See [the references and deliberate differences](docs/SOURCES.md#whole-aircraft-proportion-references). The complete Colorfigures MIT notice is included in the static application.

## Explore version 5

Choose **Engines** for the three running-engine studies or **LEGO H175** for the separate [set 42145 mechanism study](https://haitaowu12.github.io/engine-anatomy/h175.html). The H175 page uses original construction-toy geometry and the functions documented in LEGO's product page and building instructions. Its battery motor, mechanical selectors, rotor pitch, retractable gear and winch are separate from the gas-turbine plants. It is not a brick-for-brick inventory or a manufacturer gearbox reconstruction. See [H175-STUDY.md](docs/H175-STUDY.md) for source-to-feature mappings and declared simplifications.

The version 5 geometry and interaction review compares the previous release with the changed model; [REVISION-5.md](docs/REVISION-5.md) records the actual browser evidence. Circuit selection is now above its diagram, and both HTML entry pages receive the same source digest and dependency cache keys.

**Component**, **Walkthrough** and **Experiment** activities share one selection. The component browser, search, physical/system parent links, scene picking, explanatory routes and inspection controls refer to the same semantic IDs. Switching architecture preserves the selected concept where that concept exists. Focus and Return view are explicit camera actions. Clickable ancestor breadcrumbs, previous/next controls and browser history preserve navigable context. Links include the selected lens, view, activity and circuit/lesson where relevant.

The detailed catalog includes individual compressor rotor/stator/disc rows; support frames; a perforated annular combustor liner, dome, swirlers, fuel manifold and injector tips; turbine discs and nozzle guide vanes; independent shafts; bearing races, rolling elements and labyrinth seals. Helicopter, propeller and fan installations retain their different mechanical paths. The whole-aircraft views use original shaped fuselages, symmetric airfoil wings or a rotor/cabin/tail-boom layout, tail surfaces and structural mounts. Closed aircraft cowling opens with Cutaway; the helicopter has bounded side exhaust outlets and a tail drive centered inside its boom. The fixed-wing examples explicitly show a twin-engine airframe with only the near engine simulated. External aircraft supply and information interfaces are represented in diagrams, while engine-mounted accessories stay around the case and accessory drive. The shaft-power examples include selectable sun, planet, fixed ring and carrier geometry whose animation matches the declared synthetic reduction.

Choose **Anatomy**, **Shafts & drive**, **Gas · heat · work**, **Control diagram** or **Circuit diagram**. Physical engine equipment and aircraft-side interfaces have explicitly different representations. The two diagram lenses show topology and causality in 2D; **Show this hardware** returns to a real engine component. The gas view shows calculated total temperatures and separate shaft work balances. The control view distinguishes fuel and propeller-pitch loops. Service views trace representative fuel delivery/bypass, oil pressure/bearing/scavenge/relief/breather paths, and starting/ignition energy, including the distinction between pneumatic power and electrical command.

**Exploded inspection** has authored targets for the whole engine, compressor, combustor, turbines, supports, output drive, fuel filter, oil filter and starter. Casings open around intact spools. Filter caps and elements, support housings and drive covers have target-specific motions. Inspection pauses the plant; reassembly restores its prior pause state. These are instructional openings and separations, not manufacturer maintenance sequences.

**Walkthroughs** explain compression, combustion, independent spools, fuel, oil, conceptual starting/shutdown and architecture-specific pitch/freewheel relationships. Conceptual starting and shutdown do not run an invented numerical start/stop model. **Experiments** retain the tested demand, limiting and accessory-load transients with live causal explanations and traces. **Compare architectures** presents matched questions plus original diagrams for axial/centrifugal compression, forward/reverse flow and direct/geared fan alternatives.

## Rendering and accessibility

The experimental physical renderer uses warm paper, flat material tones and inked silhouettes. It draws the existing authored engine and aircraft geometry, including its selectable components, cutaways and reversible inspection transforms. No downloaded CAD, manufacturer imagery or environment map is required.

The default view reduces physical motion to keep dense illustrations responsive; clear **Reduce motion** to animate. Numerical plant integration remains independent of that choice. Hidden physical views are not painted while a control or service diagram is active. The explicit semantic schematic route (`?render=schematic`) retains the component catalog, service topology and learning views and disables unavailable spatial controls. The former `?render=svg` route uses the Colorfigures backend.

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

- [`docs/REVISION-5.md`](docs/REVISION-5.md): current geometry corrections, H175 integration, release checks and visual evidence.
- [`docs/H175-STUDY.md`](docs/H175-STUDY.md): separate construction-toy mechanism scope, original geometry, documented features and verification.
- [`docs/REVISION-4.md`](docs/REVISION-4.md): page-by-page review, corrected installation/representation concepts, navigation and new regression gates.
- [`docs/COMPONENT-REVIEW.md`](docs/COMPONENT-REVIEW.md): complete per-architecture component representation and motion inventory.

- [`docs/PRODUCTION.md`](docs/PRODUCTION.md): release taxonomy, pipeline, rendering budgets, acceptance and boundaries.
- [`docs/INSPECTION.md`](docs/INSPECTION.md): authored recipes, reversible transforms and physical-clearance contract.
- [`docs/MODEL.md`](docs/MODEL.md): equations, synthetic gains, distinct governors and limitations.
- [`docs/INTERFACES.md`](docs/INTERFACES.md): generated component and typed interface catalog.
- [`docs/SOURCES.md`](docs/SOURCES.md): primary public references and asset provenance.
- [`docs/VERIFICATION.md`](docs/VERIFICATION.md): current tests and separately identified historical/browser evidence.
- [`docs/review-2026-11-01.md`](docs/review-2026-11-01.md): source-backed gap analysis and release implementation response.
- `src/anatomy.js`, `detail-geometry.js`, `learning.js`: one component graph, authored construction and coordinated lessons.
- `src/renderer.js`, `h175-renderer.js`: geometry, camera and inspection owners; `colorfigures-renderer.js`, `colorfigures-core.js`: illustrated drawing adapter and adapted Colorfigures runtime; `schematic.js`: semantic fallback.
- `src/plants.js`, `simulation.js`: unchanged deterministic running-plant equations.

The values and dimensions are **original synthetic educational assumptions**. They are not manufacturer engine maps, certified control logic, production CAD or calibrated aircraft performance. Service routes and construction explain mechanisms; oil/electrical/combustion fields, startup/shutdown, real faults, surge, feather/reverse, stress/life and flight dynamics are not numerically solved. The source-specific alternatives are comparisons, not claims that every engine in a family has the selected architecture.

MIT for original code/assets. Three.js's MIT notice, Colorfigures' complete MIT notice and the font licenses are bundled. Reference documents remain with their publishers; their artwork and manual passages are not copied into this product.

Built by [Tony Wu](https://haitaowu12.github.io/tony-wu-home/) · [More projects](https://haitaowu12.github.io/tony-wu-home/#work).
