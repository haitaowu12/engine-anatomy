# Public claim, asset and rights ledger

The product uses original explanations, original procedural geometry and declared synthetic equations. Public primary sources support physical and architectural concepts; they do not supply calibrated parameters or manufacturer control schedules. No reference artwork, manual passages, screenshots or private training material is distributed. No affiliation with FAA, NASA or any manufacturer is implied.

| Claim / content | Public basis and location | Use and qualification |
|---|---|---|
| Gas-turbine family and gas as working fluid | [NASA Glenn: Gas Turbine Propulsion](https://www1.grc.nasa.gov/beginners-guide-to-aeronautics/turbine-engines/) | Original explanation; no copied imagery |
| Compression work, heat addition and expansion | [NASA Glenn: Brayton cycle](https://www.grc.nasa.gov/www/k-12/airplane/brayton.html) | Thermodynamic context; synthetic efficiencies and pressure splits are our assumptions |
| Compressor rotors/stators, diffuser, combustor casing/liner/injectors/ignition, turbine vanes/rotors, bearings and accessories | [FAA AMT Powerplant, chapter 1](https://www.faa.gov/sites/faa.gov/files/03_amtp_ch1.pdf), gas-turbine construction sections | Original schematic components and prose, not replicas or engineering drawings |
| Fuel metering, electronic control, representative engine inputs and actuator feedback | [FAA AMT Powerplant, chapter 2](https://www.faa.gov/sites/faa.gov/files/04_amtp_ch2.pdf), turbine fuel/fuel-control sections | Typed representative catalog; not a universal sensor/actuator list or production FADEC logic |
| Free-turbine mechanical independence, helicopter transmission/freewheel, accessories and rotor drives | [FAA Helicopter Flying Handbook, chapter 4](https://www.faa.gov/sites/faa.gov/files/regulations_policies/handbooks_manuals/aviation/helicopter_flying_handbook/hfh_ch04.pdf), turbine-engine/transmission/system sections; pp. 4-9–4-10 and 4-16 for original engine/electrical context | Generic running engaged drivetrain. Autorotation/freewheel dynamics, yaw and electrical circuits are not simulated |
| Collective changes pitch/load; engine governor changes power | [FAA Helicopter Flight Controls, chapter 3](https://www.faa.gov/sites/faa.gov/files/regulations_policies/handbooks_manuals/aviation/helicopter_flying_handbook/hfh_ch03.pdf#page=2), p. 3-2 | Separate flight-control and engine-control paths. The equivalent rotor-load law is synthetic |
| Turboprop torque, propeller speed and pitch governing | [FAA Airplane Flying Handbook, chapter 15](https://www.faa.gov/sites/faa.gov/files/regulations_policies/handbooks_manuals/aviation/airplane_handbook/16_afh_ch15.pdf), Transition to Turbopropeller-Powered Airplanes | The selected model uses separate engine-torque and prop-speed loops. Not all real turboprops use the same arrangement |
| Propeller rotating-airfoil mechanism and momentum/thrust approximations | [NASA Glenn: Propeller thrust](https://www.grc.nasa.gov/www/k-12/airplane/propth.html) | Geometric pitch is distinct from angle of attack. Our equivalent-load law and fixed-efficiency P/V estimate are not calibrated blade aerodynamics |
| Direct-drive two-spool fan/core mechanics and core/bypass streams | [NASA Glenn: Turbofan engine](https://www.grc.nasa.gov/www/k-12/airplane/Animation/turbtyp/etfh.html) | Original HP/LP geometry and map-free dynamic plant; idealized nozzle momentum estimates |
| Thrust and fixed-wing lift are distinct | [NASA Glenn: Four forces on an airplane](https://www1.grc.nasa.gov/beginners-guide-to-aeronautics/four-forces-on-an-airplane/) | Force arrows indicate direction only; aircraft motion and wing lift are not solved |
| Physical station locations and shorthand | [NASA Glenn: Gas turbine schematic and station numbers](https://www.grc.nasa.gov/www/k-12/airplane/turbdraw.html) | Calculated T4 is distinguished from specifically located downstream probe signals; no universal ITT/EGT station claim |
| Demand, sensed state, fuel metering and FADEC terminology | [FAA: Turbofan Engine Malfunction Recognition and Response](https://www.faa.gov/sites/faa.gov/files/aircraft/air_cert/design_approvals/engine_prop/engine_malf_report.pdf#page=36), printed p. 36 | General public control background, not a turboshaft control specification |
| Shaft inertia/torque balances and PI/windup research example | [NASA TM-20210014065](https://ntrs.nasa.gov/api/citations/20210014065/downloads/TM-20210014065.pdf?attachment=true), §§3–4, printed pp. 3–7 | Particular research architecture informs context; original synthetic gains and plant equations here |
| Richer modular thermodynamic matching and model validation | [NASA 20150000147](https://ntrs.nasa.gov/api/citations/20150000147/downloads/20150000147.pdf), §§I–II and V; [NASA T-MATS](https://github.com/nasa/T-MATS) | Context for limitations; no T-MATS or MATLAB code embedded. T-MATS has its own Apache-2.0 license |
| Vibration monitoring can be a separate AVM/cockpit branch | [FAA G-OBME accident lessons](https://www.faa.gov/lessons_learned/transport_airplane/accidents/G-OBME), accident overview and vibration-monitor discussion | Supports separation of monitoring from automatic fuel control; no accident artwork, photos or diagrams reused |
| Integrated engine/propeller electronic control is configuration dependent | [P&W public PT6E-67XP page](https://www.rtx.com/en/prattwhitney/products/general-aviation-engines/pt6e-67xp), Overview / Control Systems | Public example only; no product parameters, artwork or control logic copied into the generic model |
| Engine/airframe geometry, blades, shafts, pitch mechanisms, component anchors, diagrams and mark | Original code in this repository | Generic schematics, not manufacturer designs; project MIT license |
| Three.js and OrbitControls | Official `three@0.180.0`; [Three.js repository](https://github.com/mrdoob/three), [OrbitControls docs](https://threejs.org/docs/pages/OrbitControls.html) | MIT notice included as `vendor/THREE-LICENSE.txt`; package pinned and locally bundled |
| Interface typography | Inter by Rasmus Andersson and Space Grotesk by Florian Karsten, distributed through the pinned Fontsource 5.3.0 packages | SIL Open Font License 1.1; local font files and notices bundled, no external font service |
| First-release composition reference | [Bartosz Ciechanowski: Internal Combustion Engine](https://ciechanow.ski/internal-combustion-engine/) | Spatial illustration next to explanation and explicit motion control informed composition; no prose, code, fonts or artwork reused |

## Whole-aircraft proportion references

Choose **Whole aircraft**, then **Hand-drawn** or **Realistic**. The illustrated view retains the teaching drivetrain, mounting and component relationships. The realistic view shows the reference aircraft exterior.

| Reference aircraft | Evidence used |
| --- | --- |
| Airbus H175 / EC175 B | [Airbus ground rescue booklet, p. 3](https://www.airbus.com/sites/g/files/jlcbta136/files/2025-01/master_ec175_ground_rescue_booklet.pdf) supplies rotor diameters and wheelbase. [Gyrostat’s side photo](https://commons.wikimedia.org/wiki/File:EC175_F-WWOH_2jul15_LFBO.jpg) and [Jack Wolbrink’s front-quarter photo](https://www.avia-dejavu.net/photo%20OO-NSD.htm) show the cockpit, cabin and cowling of serial 5006. The H175 has twin PT6C-67E engines. The turboshaft bench is the XT700 study. |
| De Havilland Canada Dash 8-300 | [EASA.IM.A.191, pp. 22–23](https://www.easa.europa.eu/en/downloads/7257/en) gives the dimensions, PW123-family engines and 3.96 m propeller diameter. [De Havilland Canada’s photograph](https://dehavilland.com/wp-content/uploads/2023/04/dhc-dash-8-300-scaled.jpg) shows the high wing, T-tail and nacelles. The turboprop bench is the PT6A-100 study. |
| Airbus A340-300 | [Airbus airport and maintenance planning, §§2-2 and 2-12](https://www.aircraft.airbus.com/sites/g/files/jlcbta126/files/2025-12/AC_A340-200-300_20251201.pdf) supports the proportions and CFM56-5C nacelle. [Lufthansa’s fleet reference](https://www.lufthansagroup.com/en/company/fleet/lufthansa-and-regional-partners/airbus-a340-300.html) confirms the 63.69 m length, 60.30 m span and center landing gear. Engine assembly studies one engine. |

Geometry is authored from these references. Surface contours and hardware details are approximate.

## Photographic references for future modeling

- [Smithsonian XT700-GE-700 turboshaft](https://airandspace.si.edu/collection-objects/general-electric-xt700-ge-700-turboshaft-engine/nasm_A19860224000): nine photographs of a 1974 experimental engine, including external plumbing and casing. Its five axial stages plus centrifugal stage differ from this atlas's generic axial core.
- [PT6 cutaway at McGill](https://commons.wikimedia.org/wiki/File:PT6_cutaway,_McGill_University.jpg): Ut tensio's photograph of a PT6 cutaway, CC BY-SA 4.0. It illustrates a specific reverse-flow family, not the atlas's generic forward-flow model. The photograph does not identify the variant or resolve hidden parts.
- [CFM56-5C cutaway display](https://commons.wikimedia.org/wiki/File:CFM56-5C_Mockup_Cutaway.jpg): Stahlkocher’s photograph shows a two-spool turbofan display, CC BY-SA 3.0. The photo supports external form and display construction, not hidden dimensions or the atlas’s exact stage geometry.
- [Smithsonian RB211-22 cutaway](https://airandspace.si.edu/collection-objects/rolls-royce-rb211-22-turbofan-engine-cutaway/nasm_A19820072000): four photographs showing surface finish, casing and exposed construction. This is a three-shaft engine; the atlas models a two-spool arrangement.
- [Smithsonian JT15D-1](https://airandspace.si.edu/collection-objects/pratt-whitney-canada-jt15d-1turbofan-engine-cutaway/nasm_A19780210000): the museum identifies a centrifugal high-pressure compressor and reverse-flow annular combustor. It is a useful configuration contrast, not a template for the atlas's axial two-spool model.

These references support visual study, not a part-by-part reconstruction. Installation photographs, detailed geometry and variant-specific controls remain needed for a faithful replica.

## Publication boundary

Original application source and documentation, the adapted MIT-licensed Colorfigures drawing code, pinned Three.js and openly licensed interface fonts enter the build. No private engine folders were reopened for either release. No employer training documents, screenshots, internal identifiers, test data, parameters or schedules are inputs to the published product. A publicly reachable document carrying a confidentiality restriction is not treated as a publishable source. Source links do not transfer artwork reuse rights.

Inter and Space Grotesk are locally bundled under the SIL Open Font License 1.1. Their notices are included beside the font files. The static product has no analytics, backend, saved personal data or outbound model telemetry. Reference PDFs are not uploaded or bundled. Repository and Site credentials never enter source, build output or documentation. GitHub Pages is public. GPT Site audience and deployment are controlled and verified separately through its native hosting policy.



## Version 3 detail and learning additions

| Content | Primary public basis | Original implementation / boundary |
|---|---|---|
| Rotor/stator construction and independent concentric spools | [NASA axial compressor](https://www.grc.nasa.gov/www/k-12/VirtualAero/BottleRocket/airplane/caxial.html); [NASA turbofan](https://www.grc.nasa.gov/www/k-12/airplane/Animation/turbtyp/etfh.html) | Authored blade/disc/frame/shaft geometry; no copied CAD or performance maps |
| Annular liner, air admission and combustor variants | [NASA combustor](https://www.grc.nasa.gov/www/k-12/BGP/burner.html) | Original perforations, dome, swirlers and injectors; no universal air split asserted |
| Dry-sump pressure, scavenge, breather and separation | [FAA Powerplant chapter 6](https://www.faa.gov/sites/faa.gov/files/08_amtp_ch6.pdf), turbine lubrication sections | Representative topology with separate air outlet and recovered-oil return; no pressure or heat solver |
| Electric/pneumatic starters | [FAA Powerplant chapter 5](https://www.faa.gov/sites/faa.gov/files/07_amtp_ch5.pdf) | Original starter bodies and distinct command/energy paths; conceptual sequence only |
| Exciter, lead and igniter | [FAA Powerplant chapter 4](https://www.faa.gov/sites/faa.gov/files/06_amtp_ch4.pdf) | Original hardware context; ignition availability is not combustion-state simulation |
| Operation and procedure dependence | [FAA Powerplant chapter 10](https://www.faa.gov/sites/faa.gov/files/12_amtp_ch10_0.pdf) | Start/shutdown explanations without timings, limits or operating instructions |
| Centrifugal versus axial compression | [NASA centrifugal compressor](https://www.grc.nasa.gov/www/k-12/VirtualAero/BottleRocket/airplane/centrf.html) | Original comparison diagram; main running plants retain axial geometry |
| Reverse-flow public example | [P&W PT6A architecture](https://www.rtx.com/prattwhitney/products/general-aviation-engines/pt6a) | Source-specific example, not a claim that all turboprops are reverse flow |
| Geared versus direct fan | [MTU GTF architecture](https://www.mtu.de/engines/commercial-aircraft-engines/narrowbody-and-regional-jets/gtf-engine-family/) | Original comparison diagram; no manufacturer performance claims or product geometry copied |
| Sun/ring/planet/carrier kinematics | [MathWorks planetary gear](https://www.mathworks.com/help/sdl/ref/planetarygear.html) | Original synthetic tooth counts; mathematical relation, not copied implementation |
| Geometry fallback | Official pinned Three 0.180.0 SVGRenderer and Projector source | MIT, locally bundled; original instance-expansion adapter and scene; limited vector shading is explicit |

All added educational explanations are original paraphrases. The source documents are linked rather than bundled. Hardware geometry, diagram assets, material settings and the procedural environment are original.

## Version 4 installation and representation corrections

[NASA Glenn: airplane parts and function](https://www1.grc.nasa.gov/beginners-guide-to-aeronautics/airplane-parts-function/) supports the distinct structural/aerodynamic roles of fuselage, wings and stabilizers and the existence of different possible aircraft configurations. Original lofted bodies, airfoil sections, glazing, tails, pylons and landing context are authored in `src/airframe-geometry.js`; none is a manufacturer replica or a downloaded source asset. The FAA helicopter, fuel, lubrication, electrical and starting sources above remain the basis for qualified engine/aircraft boundaries. Exact accessory mounting positions, body dimensions and the far exterior engine pod are explicitly explanatory. Only the near engine has a numerical plant. A 2D topology diagram preserves the aircraft interfaces without fabricating a physical object for pilot demand or command information.
