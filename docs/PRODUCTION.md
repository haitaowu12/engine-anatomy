# Engine Anatomy 4.0: implementation and acceptance

## Release objective and evidence

The release corrects the spatial meaning, airframe construction and navigation of the three synthetic engine–airframe studies. Physical anatomy uses an installed assembly; aircraft/system boundaries, circuit topology and control causality use explicit diagrams. [REVISION-4.md](REVISION-4.md) records the review and correction decisions. It is an educational anatomy product with tested mechanism relationships. It is not a specific manufacturer's complete parts catalog or engineering-analysis model.

Implementation baseline: [`84752068db01034c61a4be5133fc8764c8018fab`](https://github.com/haitaowu12/engine-anatomy/tree/84752068db01034c61a4be5133fc8764c8018fab). The fixed-step equations in `plants.js` and `simulation.js` are preserved. `release.json` contains the build digest, product version, source baseline and pinned Three version. The digest covers application assets, source, scripts, documentation and dependency lock, so changes to bundled modules or evidence also change the release identity.

## Implemented content taxonomy

| Area | Actual selectable construction and learning behavior | Fidelity boundary |
|---|---|---|
| Compressor | Individual rotor blades, discs and fixed stators; twisted/cambered airfoil surfaces; annular shaft passage; casing and ring/strut support frame | Original stage counts, profiles and dimensions; stage-by-stage aerodynamic performance is not solved |
| Combustor | Pressure casing, inner/outer annular liner surfaces, through air-admission/dilution openings, film-cooling lips, dome, swirler vanes, fuel manifold and injector tips, igniter | Generic annular configuration; no CFD, atomization, combustion-stability or wall-temperature calculation |
| Turbines | Separate gas-generator/HP and power/LP rotors/discs, fixed nozzle guide vanes, casing and exit frame | Illustrative aerofoil and support details; no blade cooling network, stress or life analysis |
| Shaft support | Explicit hollow outer shaft and independent inner shaft, complete passage clearance, annular bearing races, rolling elements/cage, support housings and labyrinth teeth | Bearing film, thermal expansion, rolling-element kinematics and loads are not solved |
| Helicopter output | Separate free power turbine and overrunning freewheel concepts, reduction gearing, mast, main rotor, tail drive/right-angle context, swashplate and pitch links | Engaged running drivetrain and collective-equivalent load only; overrun, cyclic/yaw and autorotation are explained but not simulated |
| Turboprop output | Reduction sun/ring/planets/carrier, pitch hub, PCU/piston/link context, separately governed propeller speed and visible blade pitch | Hydraulic pressure, feather/reverse and calibrated propeller aerodynamics are outside the running model |
| Turbofan output | Direct HP/LP spool relationships, fan/LPC construction, support structure and distinct bypass duct/nozzle | Direct-drive example; a geared fan is an explicit comparison, not secretly added to this plant |
| Fuel | Diagram boundaries for aircraft supply/boost; installed filter housing/pleated element, shutoff, engine pump, metering, manifold and tips; pump bypass return | Adequate supply assumed; only metered fuel response is a numerical state |
| Lubrication | Tank, pressure pump, filter, individual bearing-feed/scavenge branches, relief path, scavenge pump, cooler, separator, recovered-oil return and separate breather-air outlet | Representative dry-sump topology; no invented pressure, debris, heat-transfer or air/oil-fraction readings |
| Starting and ignition | Electric starter example for shaft-power plants; pneumatic source/control valve/turbine starter for fan; separate electrical command and aircraft bus/battery boundaries, installed exciter and ignition lead | Conceptual energy sequence; numerical plants begin at a settled running condition |
| Controls and alternatives | Located probes/connectors, separate governor and actuator roles, typed causal paths, architecture comparison table and three original alternative diagrams | Health, availability and optional configuration concepts retain their explained status |

The source catalog currently contains 127 helicopter, 126 turboprop and 113 turbofan semantic components, including aggregate concepts and selectable details. Counts do not measure engineering fidelity; the geometry tests require actual construction for physical leaves and prohibit fabricated physical proxies for declared aircraft/system interfaces.

## One graph, coordinated views

`manifest.js` supplies the existing running quantities, shaft memberships and typed interfaces. `anatomy.js` enriches it with stable concepts, architecture instances, parent membership, detailed parts, target recipes and circuits. A parent may be a physical assembly or a clearly named system collection such as Fuel supply circuit; containment is not used to imply that a fuel tank sits inside its pump.

All learning paths, 3D picks, HTML component controls, parent navigation, route buttons and inspection targets use this graph. Selecting physical equipment preserves a compatible lens; a component outside the current diagram opens its own circuit or anatomy view. Selecting an aircraft/system interface opens its declared circuit or control diagram instead of highlighting a fictional object in space. Switching architecture preserves its concept where available. No background selection forcibly moves the camera; explicit Focus frames the selected geometry/descendants, and Return view restores the prior pose.

The workspace offers one active reading activity at a time: Component, Walkthrough or Experiment. This avoids stacking three long explanations beside the viewport. The scene retains common Anatomy, Shafts, Gas/heat/work, Control diagram and Circuit diagram views. Gas-view work bars are calculated from existing model terms:

- Gas-generator/HP drive = turbine work; resistance = compressor work + accessory/loss torque × shaft speed.
- Power/LP drive = turbine work; resistance = load + loss torque, multiplied by shaft speed.
- Drive minus resistance equals the rate of change of shaft kinetic energy. It is not a whole-engine fuel-efficiency chart.

Starting and shutdown walkthroughs are explicitly conceptual and pause the running plant. They do not introduce timed operating procedures. Numerical experiments retain their existing demand/limit/accessory events and distinct governing behavior.

## Rendering pipeline and resource budget

WebGL uses locally bundled Three 0.180.0, original procedural geometry, material-dependent metalness/roughness, a procedural studio environment, directional lights and a soft ground shadow. Static meshes are combined within the same component/material/transform group; semantic boundaries, rotating assemblies and inspection transforms remain separate. Blade rows retain instancing.

The SVG fallback uses the same scene graph and pinned SVGRenderer/Projector. Projector lacks native instancing support, so the adapter temporarily expands each instance with its real transform and restores the canonical scene after rendering. SVG has reduced tessellation, neutral background and a distinct light scale. It begins with reduced motion, and hidden 3D geometry is not projected while a system diagram is active. It does not claim WebGL reflections or soft shadows. No fixed screenshot stands in for the model.

Operational bounds:

- Fewer than 500 mesh objects per complete authored scene is an automated geometry gate; normal visible counts are lower after lens and circuit visibility.
- WebGL pixel ratio: at most 1.65 automatic, 2 detail, 1 battery saver. Battery saver caps draws at 30 Hz and disables shadow maps.
- SVG geometry: at most 8 projections/second, or 4 in battery saver. Unchanged paused frames do not project. Detail mode does not force the higher WebGL tessellation into SVG.
- A final cached semantic SVG fallback covers core paths, component identity and complete chosen service topology if geometry backends fail.
- Numeric integration remains independent of rendering cadence. Visibility changes reset frame timing rather than accumulating a large catch-up interval.
- `data-performance` on the host reports the available backend counters; absent WebGL-only fields are null on SVG. These counters are diagnostics, not displayed calibrated performance claims.

Pixel appearance, actual frame time, browser memory and mobile interaction must be checked in a real browser. Scene counts and a nominal rate cap do not establish smoothness on every device.

## Consequential verification

The automated suite retains the existing numerical and inspection regressions and adds graph/lesson completeness, real leaf geometry, all-recipe reversibility, through-port ray tests, fixed-ring planetary kinematics, SVG API compatibility/cache behavior, work-balance consistency and label packing at desktop/phone widths.

Closed whole-aircraft presentation uses actual external cowling skins and omits redundant inner shell drawing while closed. Cutaway, Engine assembly and inspection restore internal anatomy. The helicopter has open lateral exhaust ducts ahead of the aft reduction and a centered tail shaft inside the boom; these generic routes retain the ideal numerical drive ratio and do not introduce a duct-flow or joint-dynamics model.

The full independent-spool clearance gate checks actual transformed triangles, including all instance transforms and hidden shaft-section alternatives. It remains separate from generic nominal-radius assertions. See `INSPECTION.md` for dimensions and extent.

The browser acceptance path is: load all three architectures; verify renderer status; select small details and parents; change lenses without losing selection; run target inspection and reset; focus/return; trace fuel/oil/start paths; use each learning activity; run the three numerical plants and limiting scenarios; compare architectures; inspect a narrow viewport and keyboard dialogs. Record the actual build and backend. Historical WebGL screenshots do not qualify a changed release's WebGL appearance.

## Deliberate engineering boundaries

The product now implements the detailed generic teaching scope above. It does not provide manufacturer-specific maintenance sequences, every possible engine architecture or a validated geometry for stress, flow, bearing life or service design. Every casing separation is an instructional recipe. The annular liner and gearbox illustrate their mechanisms; fastener patterns, fits, materials and dimensions are original choices.

Source-backed variants are comparisons. Reverse-flow cores and centrifugal stages are not substituted into the forward-flow synthetic plant. A geared fan comparison does not change the direct-drive fan plant. The difference is visible and explained. These boundaries protect the correctness of the richer presentation.
