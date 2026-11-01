# Staged engine inspection

## Purpose and boundary

The first engine renderer supported a fixed cutaway, component isolation and shaft tracing, but had no exploded-view state. The inspection control now answers two spatial questions: what surrounds the blade rows, and how the combustor liner sits inside its pressure casing.

The control first separates the compressor, combustor and turbine casing sectors (and the turbofan bypass shell); its second half reveals the liner. These are original generic shell sectors, not manufacturer split lines or an approved disassembly sequence. Sensors, piping, fuel injectors, stator/vane rows, bearings, shafts and rotating spool assemblies stay in their original positions. This is not a model of physically removing every fastener, pipe or attached service. Casings and liners are instructional surfaces; their thickness, thermal growth and flange/joint design are not qualified.

This feature is a first inspection layer. It does not claim complete engine anatomy, a certified maintenance procedure, photorealistic CAD fidelity or a new numerical engine model.

## Behavior contract

- Inspection is a presentation state, separate from numerical plant state and the connection lenses.
- Entering inspection pauses the running model. Reassembly restores whether it was previously running or paused. Running a trial or changing architecture returns the geometry to its assembled state.
- Casing sectors separate before liner sectors. Every moved sector spans at most a half-circle and translates radially along its own bisector; its points recede from the shaft axis rather than cutting through it.
- Each position is computed from the assembled position and current control value. Repeated use does not accumulate transform drift.
- Rotor/spool topology, shaft length, bearing locations, sensor locations and equations do not change. Flow particles are hidden during inspection because a running gas path through separated shells would be misleading.
- Selection and isolation use the original component IDs. Compressor and turbine casings have their own IDs, separate from stators and nozzle guide vanes. Focus follows the displaced shell geometry and Return view restores the earlier camera.
- Camera pose is not changed merely by moving the inspection control. Dashed guides retain the relationship between the separated sectors and their original positions.
- Cutaway closing is disabled while sectors are separated. Reassembly restores the previous cutaway choice. The 2D fallback disables this 3D-only inspection control.

## Hub-clearance correction

The earlier common blade-row builder used a solid central disk for every row. In the concentric-shaft configurations that filled the space occupied by the independent inner shaft, and stationary rows also had solid hubs. The builder now uses annular hubs for stationary rows and for the HP/Ng rows around an independent inner shaft. In the synthetic geometry, the inner shaft radius is 0.078, the HP/Ng rotor bore is 0.105, the outer shaft radius is 0.16, and the stationary-row bore is 0.23. These dimensions are illustrative clearance relationships, not production dimensions. Rotating rows attached to a solid shaft retain a solid hub. The outer shaft is now an annular tube with the same 0.105 bore, including inner surfaces and annular end faces.

Clearance is checked against the complete rendered swept envelope. Decorative collars reached radius 0.128 and keyed markers reached about 0.142 on the inner shaft; checking only its bare 0.078 radius would miss interference. Collars/keys are now omitted wherever their complete axial extent intersects the independent outer-shaft span (key half-length 0.12; collar tube half-width 0.025). Cues remain on exposed shaft sections. The accessory takeoff begins at the outer-shaft surface instead of crossing the independent inner shaft, and lies between adjacent stationary-row planes. The regression measures actual transformed triangles, including instanced geometry and hidden full/section alternatives, at multiple relative rotations. This gate covers the independent shaft passage; it does not certify every gear contact, casing joint or service route.

Public conceptual basis: [NASA Glenn on the two-spool turbofan and concentric independent shafts](https://www.grc.nasa.gov/www/k-12/airplane/Animation/turbtyp/etfh.html); [NASA Glenn on shaft-mounted rotor rows and casing-supported stationary rows](https://www.grc.nasa.gov/www/k-12/VirtualAero/BottleRocket/airplane/caxial.html). This change uses original geometry and does not copy source artwork.

## Verification performed in the 2026-11-01 implementation review

- `node tests/inspection.test.mjs`: 5 tests passed, covering staging, 100 repeated reassemblies, sampled radial clearance over the complete range, shaft invariance, pause restoration, annular-hub clearance and separate casing identity.
- `node tests/renderer.test.mjs`: 5 tests passed against the pinned `three@0.180.0`, with real scene geometry and stub display/controls. These exercise all three architectures, shaft/rotor/vane/bearing position invariants, selection, isolation, camera preservation and return, cutaway state and reload reset. Two additional envelope tests cover the complete concentric overlap in turboprop/turbofan, including decorations, hub faces, the outer tube and accessory takeoff. They require more than 0.025 schematic radial clearance. Guide visibility and displaced event-label anchors are also checked.
- `node tests/plants.test.mjs`: 18 existing numerical/manifest tests passed.
- `node tests/simulation.test.mjs`: 6 existing numerical regression tests passed.
- Production static build passed with the pinned dependency and baseline font assets.
- JavaScript syntax checks passed for the changed renderer and application.

These checks establish state/geometry rules and retain the existing synthetic equations; they do not establish visual quality, screen-reader behavior or manufacturer fidelity. Browser screenshot and interaction verification must be recorded separately against the deployed or locally served version.

## Remaining content and model work

Prioritize a single inspectable compressor-stage, combustor and turbine assembly before adding new engine families. Add actual selectable subassemblies, coherent stage-specific blade geometry, annular support frames, bearings/seals, fuel distribution, service circuits and teaching cut sections. Use original generic geometry and primary public sources to explain construction; label configuration-specific examples.

Keep structure, energy flow, control and guided experiments as coordinated views of the same semantic components. Expand gas-path lessons to show stage work, temperature/pressure station changes and air allocation. Expand services to show complete fuel/oil/electrical paths. Add architecture comparisons (for example axial versus centrifugal or forward versus reverse flow) as explicit alternatives. Do not silently turn this generic forward-flow turboprop into a claim about every turboprop design.
