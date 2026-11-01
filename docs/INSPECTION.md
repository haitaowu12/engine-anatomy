# Authored engine inspection

## What the controls do

Inspection is a presentation state over the shared component graph. It opens specific assemblies to reveal their actual detail, while independent rotating spools retain their topology. The scenes use original generic dimensions and instructional split lines. They are not manufacturer disassembly instructions.

| Target | First stage | Second stage | Retained relationship |
|---|---|---|---|
| Engine layers | Separate compressor/combustor/turbine casing sectors and the fan bypass shell where present | Separate combustor liner sectors | Independent shafts, rotor rows and fixed vane rows retain identity |
| Compressor | Open compressor casing | Inspect rotor blade, disc, stator and frame detail | Rotor stays on its shaft; stator remains stationary |
| Combustor | Open pressure casing | Open liner sectors with their air-admission features | Dome, injectors and swirl region remain identifiable |
| Turbines | Open hot-section casing | Inspect nozzle vanes, turbine discs and shaft paths | No false separation of an independent spool into disconnected pieces |
| Bearings/seals | Slide representative support housing axially | Inspect races, rolling elements and seal teeth | Shaft positions remain unchanged; rolling kinematics are not simulated |
| Output drive | Slide the surrounding reduction cover axially | Inspect sun/ring/planets/carrier; propeller hub cover also opens in the prop example | Tooth-count speed relation remains declared and explicit |
| Fuel/oil filters | Lift the removable cap | Lift the pleated element through the opening | Supply/return topology remains available in the service view |
| Starting | Slide the starter housing along its shaft | Inspect internal electric/pneumatic construction and energy path | Starting is explanatory, separate from the running numerical plant |

Some second stages are examination stops with the already exposed assembly retained in position. They do not manufacture additional disassembly motion where doing so would imply a disconnected shaft or false operating state.

## State and interaction contract

- Entering inspection pauses the running plant; reassembly restores whether it was previously running or paused. New trials and architecture changes reset inspection.
- Each transform is calculated from the assembled position and current amount. Repeated use does not accumulate drift. Changing recipes restores the previous target before opening another.
- Shell sectors span at most 180° and translate radially along their bisectors. Their radial separation does not shear a rotor assembly. Filter, drive and support parts use authored axial motions.
- Labels, picking, isolation, parent navigation and focus use original IDs. Displaced liner features follow their sector. Camera pose does not move just because the slider moves.
- Focus uses selected/descendant geometry bounds; Return view restores the earlier camera. Detail isolation shows the selected part/descendants; shaft tracing can isolate its complete mechanical route.
- Guides are shown only for visible separated shells. Closing a cutaway is disabled while inspection is active. Gas/service direction markers are hidden during inspection.
- WebGL and actual-geometry SVG support the same recipes. The final semantic schematic disables inspection and camera controls that cannot be represented there.

## Independent shaft clearance

The earlier shared row builder filled the shaft passage with solid discs. The corrected geometry uses annular HP/Ng hubs around independent inner shafts and annular stationary hubs. Synthetic dimensions are:

| Relationship | Radius in schematic units |
|---|---:|
| Inner independent LP/power shaft | 0.078 |
| HP/Ng rotor and outer-shaft bore | 0.105 |
| HP/Ng outer-shaft exterior | 0.160 |
| Stationary-row bore | 0.230 |

The outer shaft includes inner surfaces and annular end faces. Inner-shaft decorative collars/keys are suppressed wherever their full axial extent overlaps it: keys have half-length 0.12 and collar tubes half-width 0.025. A bare-shaft test would miss their larger radial envelope. The accessory takeoff starts on the outer surface and occupies a plane between nearby stationary rows.

The regression measures actual transformed triangle envelopes at multiple relative rotations, including instanced blades and full/section alternatives. It requires more than 0.025 schematic radial clearance through the complete concentric overlap. This is an independent-passage gate, not certification of all engine clearances, production gear contact or maintenance extraction paths.

## Reduction mechanism

The shaft-power examples add an original fixed-ring planetary illustration. The sun has 12 teeth. Helicopter uses ring 132 / planet 60 and carrier speed input/12; turboprop uses ring 108 / planet 48 and carrier speed input/10. Planet rotation relative to the carrier satisfies the sun/planet rolling relation. All angular motion is displayed 250 times slower, consistently with the rest of the scene.

Input shafts end at the input sun, while carrier outputs attach on the opposite axial side. The propeller input radius is 0.078 with a 0.080 sun bore; helicopter input radius is 0.140 with a 0.145 sun bore. Oversized legacy through-shafts were removed. Separate actual-triangle tests check the sun passage and independent carrier/output clearance across multiple angular states. The helicopter transfer route runs below the full planetary/casing envelope at y = −2.5; its tail shaft follows a separate parallel route at z = −0.8. A declared 48:12 speed-increase pair matches the 12:1 main and 3:1 tail reductions. These downstream shafts are included in a full-envelope regression, so they cannot pass through a planet at another carrier phase.

These counts explain the model's declared ratio. The teeth are illustrative forms, not involute manufacturing geometry. Helical angles, gear stresses, backlash, housing deformation, lubrication and efficiency are not separately solved. Public kinematic basis: [MathWorks planetary gear documentation](https://www.mathworks.com/help/sdl/ref/planetarygear.html). A public aircraft example of an epicyclic propeller reduction is [P&W's PT6A description](https://www.rtx.com/prattwhitney/products/general-aviation-engines/pt6a); the app does not replicate its gearbox or dimensions.

## Blade-pitch linkage

The helicopter has a non-rotating translating lower swashplate and a rotating upper ring. Four rods attach to actual moving blade-root pitch horns. Ring height is solved from the current collective pitch and a declared rigid rod length, so the rods remain attached while the mast rotates. The propeller piston position is likewise solved from the existing lagged pitch state, with rotating attachment points and four rigid links to the actual pitch horns. These are original one-degree-of-freedom illustrations; cyclic/yaw, hydraulic forces, bearing clearances and articulated rotor dynamics are not added to the plant. Tests use actual world-matrix endpoints at multiple pitch and azimuth states and require invariant rod length.

## Evidence

`tests/inspection.test.mjs` verifies staging, state restoration and basic clearance. `tests/renderer.test.mjs` uses the exact pinned Three geometry with stubbed display/controls to verify all architectures, complete shaft envelopes, every physical leaf's real geometry and absence of physical proxies for system boundaries, all-recipe exact restoration, isolation, camera invariants, liner through-openings and planetary kinematics. A separate SVG-shaped renderer test verifies the optional diagnostic fields and unchanged-frame cache. These checks do not establish pixel quality; current browser evidence is recorded separately in `VERIFICATION.md`.

Primary construction context: [NASA axial compressor](https://www.grc.nasa.gov/www/k-12/VirtualAero/BottleRocket/airplane/caxial.html), [NASA combustor](https://www.grc.nasa.gov/www/k-12/BGP/burner.html), [NASA two-spool turbofan](https://www.grc.nasa.gov/www/k-12/airplane/Animation/turbtyp/etfh.html), and [FAA lubrication chapter](https://www.faa.gov/sites/faa.gov/files/08_amtp_ch6.pdf). Source artwork is not reused.

## Version 4 installation context

The helicopter mast/rotor/swashplate/pitch-pickup assembly shares x = −6.3, forward of the engine inlet, so the mast does not pass through the combustor. Its lower transfer shaft stays below the validated reduction envelope. The actual blade-root matrix and fixed rod-length tests continue to pass after the complete assembly translation. The new transmission fairing is an original airframe context surface rather than a moving shaft component.

Engine-side service items use shared installed anchors for geometry, labels, diagrams and inspection. Filter focus chooses the actual mounting side; a ray through its anchor must first encounter the selected filter, rather than the engine casing. The physical focus/inspection controls are unavailable for diagram-only aircraft boundaries. Whole-aircraft view defaults to closed covers, while the engine and aircraft views retain separate explicit cutaway preferences.
