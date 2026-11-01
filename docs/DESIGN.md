# Engine–airframe teaching workspace

The primary learning task is to distinguish physical construction, system connections and numerical cause/effect, then move between those representations without losing the component identity. Three architecture manifests change the actual engine, shaft layout, airframe, component hierarchy, typed signal graph, numerical plant and guided experiment.

The persistent workspace contains a grouped component tree, original 3D model and a contextual inspector. Whole-aircraft, installed-engine and shaft-section camera presets are explicit actions. Incidental selection and connection lenses preserve orbit, target and zoom. Focus stores a return view. The phone layout places the scene above the current lesson/inspector and opens the full component hierarchy in a native dialog.

Purpose-specific lenses separate structure, complete shaft assemblies, gas/heat, engine control and services. Mechanical shafts belong to continuous assemblies and never stretch or separate. Staged exploded inspection moves authored stationary shell sectors and removable covers: engine-layer inspection opens casings first, then the combustor liner. It pauses the running model and restores the prior pause state on reassembly. Separate casing IDs preserve the distinction between pressure shells and stationary blade rows. Cyan and amber distinguish independent shafts. A transverse inset explains the concentric shaft clearance in the turboprop and turbofan. Fixed stators and vanes have their own selectable geometry. Keyed collars make rotation visible.

The helicopter has an upper-fuselage installation, independent free-power route, reduction/freewheel context, main transmission/mast/main rotor and tail drive/rotor. The turboprop has a forward-returning power shaft, visible reduction and pitchable propeller hub, with separate engine-fuel and propeller-pitch control paths. The direct-drive turbofan has HP/HPC/HPT and LP/fan/LPC/LPT assemblies plus distinct core and bypass streams, mounted below a generic wing/pylon.

Guided trials reset to a settled running baseline at trial time zero. Input event, numbered causal sequence, live explanatory sentence, current values and scene highlights stay next to the model. Trace plots are supporting disclosures, with speed/reference and driving/resisting torque separated into their own panels. Step buttons locate components; they do not scrub or rewind model time. Pause and reset have explicit behavior.

Sensors are individually located. The inspector states origin, destination, quantity/units, role, measured/prescribed/inferred status and numerical fidelity. Connections indicate whether they are simulated or explained. Selecting an external aircraft/system boundary opens the relevant 2D diagram; no fictional hardware or camera reset is implied. Physical hardware remains selectable in context, with explicit Focus and inspection actions. Monitoring and electrical/service supply are separate from active fuel or propeller pitch commands.

The visual foundation uses a quiet dark surround, a clear type hierarchy and original illuminated metal cutaways. The earlier inspected Ciechanowski engine reference informed proximity of explanation to geometry; no code, artwork or fonts were copied. Actual screenshots, shaft paths and behavior must be inspected separately from numerical or graph tests. Generic geometry and force-direction arrows are explicitly schematic; no six-degree-of-freedom flight animation is presented as physics.



## Version 3 coordinated detail architecture

The prior prohibition on stretching mechanical shafts remains in force. Authored inspection now opens stationary shells and removable covers around continuous shafts; it does not forbid all educational separation. `anatomy.js` is the shared concept/instance/parent/circuit layer. `detail-geometry.js` authors construction against those IDs. `learning.js` produces routes and explanations using the same catalog. `labels.js` controls deterministic screen placement. `vector-renderer.js` projects actual geometry when WebGL is unavailable.

Component / Walkthrough / Experiment activity tabs consolidate long reading panels. Scene lenses preserve current selection. Detailed static geometry is merged only within component/material/local-transform groups; dynamic and inspectable elements retain their own transforms. No material pass substitutes for missing anatomy, and no additional service label substitutes for an unmodeled numerical state. See `PRODUCTION.md` for the release taxonomy and measured/testable boundaries.

## Version 4 representation contract

`installation.js` declares physical, aggregate and aircraft-interface representations. `airframe-geometry.js` builds original lofted bodies, symmetric airfoil wings, tail surfaces and structural mounts. `system-diagram.js` gives control causality and service topology a dedicated HTML diagram; the 3D renderer pauses projection while that diagram is visible. The same component identities link back to real hardware. External supplies and information are complete in the graph without being drawn as loose engine accessories.

Whole-aircraft view starts with closed covers and remembers its own explicit cutaway preference. Engine assembly retains its own cutaway preference. Inspection only opens a named authored recipe and focuses that recipe's target; static airframe context and information boundaries do not advertise an invented opening sequence. Fuel/oil accessory focus approaches the correct mounting side, with a ray test that checks the component is not hidden by the engine.

The actual SVG Projector is included in geometry regression tests. Closed skins have outward front faces, because two-sided thin skins let unlit reverse faces paint over their front faces. Closed aircraft cowling also suppresses genuinely enclosed shell alternatives whose long triangles cannot be ordered reliably by a painter renderer. Open fans, intake lips and nozzle outlets remain. Component construction returns for Cutaway, Engine assembly and inspection; no polygon offset or arbitrary render-order override changes the geometry.
