# Verification: three engine–airframe studies

Verification checks properties of the declared synthetic equations, graph and implementation. It does not establish fidelity to a measured engine, certified controller or aircraft. Numerical checks and visual/mechanical inspection are separate evidence.


## Illustrated surface visibility — 5.0.2

The illustrated renderer uses plane separation and a stable topological order for broad overlapping surfaces. Camera near-plane clipping preserves the visible portion of a face instead of dropping it when one corner passes the camera. An unchanged scene reuses its drawing order. The three-tone palette, meaningful boundary ink, semantic geometry, picking and inspection controls are retained.

Visibility sampling covers 54 engine camera/state combinations (three architectures, installed/section/aircraft, closed/cutaway, and three camera directions) and 18 H175 view/state combinations. New renderer regressions check physical foreground from both sides of a broad surface after camera/part motion, plus near-plane clipping on canvas and SVG outputs. Existing mechanical, aircraft-skin, inspection and plant checks remain required.

Plane ordering does not resolve every coplanar overlap or intersection in a painter renderer. These finite samples do not establish exact visibility at every possible orbit or zoom.

## Version 5 correction and H175 evidence (2026-11-01)

The complete `npm test` gate passes all 12 test files. [REVISION-5.md](REVISION-5.md) records the source baseline, concrete defects, accepted browser journeys and captures in `audit-5/`. [H175-STUDY.md](H175-STUDY.md) records the separate construction-toy study's sources, authored mechanism assumptions and verification.

Focused coverage now includes 32 renderer/mechanical cases, 17 aircraft-skin cases, two precision-geometry cases, 23 H175 mechanism cases and three H175 event-delegation regressions. Aircraft-glazing checks compare the actual pinned Three Projector's last painted face with nearest-surface ray intersections; physical apertures prevent opaque body triangles from painting over the visible window. Mount checks intersect speed/temperature/vibration probes, the bleed port and igniter with their intended casing or duct. H175 cases cover independent powered branches, motor-off and inspection holds, real through-holes, rigid pitch links, retraction direction, winch closure, gear contact and controls that must not reset selection.

Actual browser acceptance at 1348 × 926 includes all three whole-aircraft contexts, the mounted turboshaft cutaway, driven-load pickup navigation, circuit switching and the H175 assembly, close-ups, manual controls, independent powered selections, pause/step, inspection/reassembly and native access disclosure. The managed browser disables WebGL; these captures verify SVG geometry and interaction. They do not establish hardware-GPU shading, mobile layout or calibrated aircraft/set performance. Release validation covers both HTML entry pages, matching module versions, local links and exact nested documentation copies.

## Historical version 4 correction evidence (2026-11-01)

See [REVISION-4.md](REVISION-4.md) for the reviewed routes and corrected concepts, and [COMPONENT-REVIEW.md](COMPONENT-REVIEW.md) for the full representation/motion inventory. The exact-geometry suite adds absence of fake aircraft-interface hardware, bounded installed-service locations, hidden distant context, real mirrored/thick airfoil wings, tapered fuselages, paired tailplanes/pylons and mast/core clearance. A new representation suite preserves every diagram boundary, circuit branch, public source and walkthrough identity. The complete local suite passes in nine test files, with 85 individual cases (28 real-renderer geometry cases, 11 actual-Projector/skin/cowl cases and three representation cases). The new skin regressions compare actual painter output with real nearest-surface ray intersections, check both detail budgets for reverse-face rejection, and verify bounded exhaust openings. Helicopter installation tests additionally gate lateral-exhaust/reduction clearance and tail-shaft containment in the tapered boom. Existing deterministic plants and physical mechanism gates remain required. Browser evidence for this release is kept in `audit-4/`; the deployment owner records final observed acceptance against its build ID. The managed browser has no WebGL, so material/reflection/shadow appearance on hardware WebGL remains outside this run's visual evidence.

## Historical version 3 evidence (2026-11-01)

The source implements the detailed anatomy/inspection release from baseline `a7640c6cd5bd167188d658a13cbfc8b1dd65934c`. Current real-geometry tests use the exact pinned `three@0.180.0` and stub the display/controls. They do not render pixels. The managed browser reports no WebGL; current visible acceptance uses the actual-geometry SVG backend, with its renderer status shown. Do not reuse the historical Apple M2 Pro evidence below as acceptance for the changed version 3 materials or geometry.

Current automated coverage includes existing inspection state, plant and numerical regressions; concept/instance/parent/route/lesson completeness; shaft-work display closure; desktop/phone label packing; every leaf's actual geometry; all target recipes returning exactly; selection and isolation; true through-openings in the liner; complete independent-spool envelope clearance; matching planetary ratios; and SVG diagnostic/caching compatibility. The current suite contains 60 individual cases: 5 inspection-state, 18 plant/catalog, 6 numerical-core, 17 real-renderer-geometry, 7 anatomy/learning/work-balance, 4 label-placement and 3 learning-state cases. All pass. The static build also passes. Publication and final browser acceptance are recorded against the final artifact by the release verification owner.

A browser-discovered SVG diagnostic crash was corrected: SVG exposes `info.render.faces` and no `info.memory`; those optional counters are now handled explicitly and regression-tested. SVG has its own neutral background/light scale, lower tessellation, capped projection rate and unchanged-frame cache. This is actual scene projection, not the old block schematic.

The generated `release.json` and HTML build meta tag identify each artifact. The current production build must pass before publishing, and hosted build IDs must match afterward. Hardware-WebGL reflection/shadow appearance remains unverified in the current managed browser and must not be described as visually accepted there.

## Historical version 2 numerical and graph checks

`npm test` passes **21 test groups**: the original six regression groups plus five groups for each new plant architecture.

For each architecture, the added checks cover:

- Finite positive shaft states across demand/fuel-ceiling/inlet-temperature corners, including added accessory extraction and the declared airspeed bounds.
- Air/fuel mass continuity, combustion heat balance, turbine enthalpy/work closure and both shaft torque/power balances. Turbofan fan/core/bypass mass and LP work allocation are checked separately.
- The architecture-specific normal transient and limiting outcome, rather than assuming one common governor for every engine.
- Exact deterministic state under two rendering cadences, reset reproducibility and comparison of 120 Hz versus 240 Hz integration.
- Unique semantic component IDs, valid initial selection, parent assemblies, public-source references and edge endpoints. Control-boundary checks prohibit a direct FADEC-to-rotor-pitch edge in the helicopter and a direct engine-controller-to-PCU command in the chosen separate-governor turboprop. Vibration remains a monitoring branch.

These tests catch numerical or graph regressions. They do not prove an engine map, blade aerodynamic model, sensor installation or production control schedule is physically calibrated.

## Synthetic model results

All values below are calculated outputs of these original teaching models.

| Trial | Early response | At 15 simulated seconds | At 60 simulated seconds |
|---|---|---|---|
| Helicopter collective/equivalent load 35→55% | Np minimum **94.29%**; initial load torque exceeds turbine torque | Np **99.25%**, fuel **0.02661 kg/s** | Np **100.00%**, turbine torque **448.00 N·m**, ideal-hover force estimate **16.77 kN** |
| Turboprop torque target 288→448 N·m | Prop/Np speed peaks **105.12%** while fuel/torque and then pitch respond | Np **100.64%**, geometric pitch **25.79°** | Np **100.00%**, pitch **25.60°**, torque **448.00 N·m**, forward-flight thrust estimate **2451 N** |
| Turbofan N1 reference 81→93% | Fuel response precedes spool recovery; HP and LP respond independently | N1 **92.95%**, N2 **124.37%** | N1 **93.00%**, N2 **124.48%**, fuel **0.03960 kg/s**, net idealized thrust **2207 N** |

Limiting trials are deliberately different:

- Helicopter at 70% demand and 72% fuel ceiling settles near **85.94% Np** with the fuel ceiling active.
- Turboprop at the same demand/ceiling settles near **100% Np** while still short of requested torque by approximately **206.7 N·m**. The separate prop governor unloads pitch; normal speed does not prove torque availability.
- Turbofan at 100% demand and 65% ceiling requests **105% N1**, but settles near **94.54% N1** with the synthetic **N2 target** active. The displayed active limit is determined from the actual command cap.

## Historical version 2 WebGL and interaction inspection

The local application was exercised in the in-app Chromium browser. Its graphics context reported **ANGLE Metal Renderer: Apple M2 Pro**. Actual rendered scenes were inspected; this was not a source-only or software-render-only check. A final public-host inspection found and corrected Retina canvas sizing: CSS dimensions now match the host while the drawing buffer retains the device pixel ratio. This prevents clipping caused by intrinsic canvas dimensions.

Visible acceptance covered:

- Original helicopter upper-fuselage installation, main transmission/mast/main rotor and continuous tail-drive route.
- Original nose-mounted propeller-aircraft installation, reduction, pitchable hub and continuous independent power shaft returning forward inside the gas-generator shaft.
- Original under-wing jet installation, distinct fan/LPC and HPC/HPT paths, concentric HP/LP section and separate bypass duct.
- Complete shaft lenses: unrelated blade rows are hidden when tracing one assembly; shaft colors and a transverse inset distinguish concentric members. Explicit full-route framing exposes driven endpoints; focus/return remains an explicit camera action.
- Individually located N1/Np, Ng/N2 and downstream temperature/pressure probes, with directed control/service branches and qualified live values. Monitoring and explanatory branches remain labeled rather than fabricated measurements.

**All 128 represented component/interface selections** (43 helicopter, 43 turboprop, 42 turbofan) were activated through the actual component hierarchy. Each displayed the matching component name and preserved the current camera position, target and zoom. Fan focus changed the camera, and Return view restored the exact prior camera state. Explicit full-route framing was also exercised.

Browser-observed transients agreed with the model's qualitative behavior: helicopter Np initially fell, then reached **99.90% near 28.1 s** with no active limit; the propeller trial settled at approximately **100% Np, 25.60° pitch and 448 N·m**. The live causal narrative and scene highlights advanced beside the geometry. Plot panels are supporting disclosures with separate speed/reference and torque axes/units, not the only explanation.

## Historical version 2 phone and accessibility flows

A **390 × 844** viewport was inspected and then reset. No horizontal overflow was observed. The scene remained visible while reading the causal explanation. A persistent phone bar successfully started a new trial near t = 0, paused it and restored the settled baseline with reset. Pair selection remained available beside the model.

The phone component dialog selected the post-reduction propeller-speed pickup and closed successfully; its readout showed **50.0 rad/s / 477 rpm**, distinct from pre-reduction Np. Switching through the fan and helicopter pairs changed actual geometry/model/initial component and cleared prior input-event annotations. Reduced-motion control remained distinct from model pause.

Controls use semantic buttons, native selects/dialogs and labeled ranges. Keyboard selection, camera buttons, focus/return and source-dialog dismissal are checked through the real UI. This is scoped interaction verification, not an exhaustive screen-reader or accessibility certification.

## Historical version 2 schematic fallback

The explicit `?render=schematic` path was opened in the actual browser. Keyboard Enter selected the N1 speed pickup through a connection endpoint; the selected name and live signal changed correctly. Three-dimensional camera/focus controls were disabled. The source dialog opened and closed with Escape. A fan limiting trial ran through the same numerical core: its initial state showed the 105% reference, lagged actual fuel and an active fuel ceiling. The separate speed/reference plot produced both live paths. Fallback connection boxes use the selected graph edge and label its information/actuation/fuel/electrical/service type and simulated/explained status; a monitoring signal is not drawn as a generic fuel-control feedback loop.

## Remaining validation boundaries

No independent engine-test data or calibrated maps are used. Start/stop, surge/stall, combustion stability, thermal certification, detailed prop/rotor aerodynamics, flight dynamics, real fault/channel accommodation, electrical bus and oil circuits are outside scope. Fixed efficiencies and prescribed inlet/airspeed boundaries limit thrust estimates. Force arrows communicate direction only. Cross-browser/GPU compatibility is not certified. Automatic WebGL context-loss handling is code-reviewed; no hardware context loss is deliberately injected during these browser checks.

