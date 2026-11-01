# Engine–airframe teaching workspace

The primary learning task is to follow a physical connection and then explain a transient through the same moving model. Three architecture manifests change the actual engine, shaft layout, airframe, component hierarchy, typed signal graph, numerical plant and guided experiment.

The persistent workspace contains a grouped component tree, original 3D model and a contextual inspector. Whole-aircraft, installed-engine and shaft-section camera presets are explicit actions. Incidental selection and connection lenses preserve orbit, target and zoom. Focus stores a return view. The phone layout keeps the scene sticky above the current lesson/inspector and opens the full component hierarchy in a native dialog.

Purpose-specific lenses separate structure, complete shaft assemblies, gas/heat, engine control and services. Mechanical shafts belong to continuous assemblies and never stretch or separate. Staged exploded inspection moves only instructional stationary shell sectors: casings first, then the combustor liner. It pauses the running model and restores the prior pause state on reassembly. Separate casing IDs preserve the distinction between pressure shells and stationary blade rows. Cyan and amber distinguish independent shafts. A transverse inset explains the concentric shaft clearance in the turboprop and turbofan. Fixed stators and vanes have their own selectable geometry. Keyed collars make rotation visible.

The helicopter has an upper-fuselage installation, independent free-power route, reduction/freewheel context, main transmission/mast/main rotor and tail drive/rotor. The turboprop has a forward-returning power shaft, visible reduction and pitchable propeller hub, with separate engine-fuel and propeller-pitch control paths. The direct-drive turbofan has HP/HPC/HPT and LP/fan/LPC/LPT assemblies plus distinct core and bypass streams, mounted below a generic wing/pylon.

Guided trials reset to a settled running baseline at trial time zero. Input event, numbered causal sequence, live explanatory sentence, current values and scene highlights stay next to the model. Trace plots are supporting disclosures, with speed/reference and driving/resisting torque separated into their own panels. Step buttons locate components; they do not scrub or rewind model time. Pause and reset have explicit behavior.

Sensors are individually located. The inspector states origin, destination, quantity/units, role, measured/prescribed/inferred status and numerical fidelity. Connections indicate whether they are simulated or explained. Selecting a control/service component opens the relevant lens; no camera reset is implied. Monitoring and electrical/service supply are separate from active fuel or propeller pitch commands.

Visual foundation retains the first release's warm paper surround, technical type hierarchy and illuminated original metal cutaway. The earlier inspected Ciechanowski engine reference informed proximity of explanation to geometry; no code, artwork or fonts were copied. Actual screenshots, shaft paths and behavior must be inspected separately from numerical or graph tests. Generic geometry and force-direction arrows are explicitly schematic; no six-degree-of-freedom flight animation is presented as physics.



## Version 3 coordinated detail architecture

The prior prohibition on stretching mechanical shafts remains in force. Authored inspection now opens stationary shells and removable covers around continuous shafts; it does not forbid all educational separation. `anatomy.js` is the shared concept/instance/parent/circuit layer. `detail-geometry.js` authors construction against those IDs. `learning.js` produces routes and explanations using the same catalog. `labels.js` controls deterministic screen placement. `vector-renderer.js` projects actual geometry when WebGL is unavailable.

Component / Walkthrough / Experiment activity tabs consolidate long reading panels. Scene lenses preserve current selection. Detailed static geometry is merged only within component/material/local-transform groups; dynamic and inspectable elements retain their own transforms. No material pass substitutes for missing anatomy, and no additional service label substitutes for an unmodeled numerical state. See `PRODUCTION.md` for the release taxonomy and measured/testable boundaries.
