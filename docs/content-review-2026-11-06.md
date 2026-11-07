# Engine Anatomy content review — 6–7 November 2026

Baseline: `2a0fa47e2a7c886ac6af6e57bfe729e88b12cf85` on `main`.

## Coverage and outcome

The review read the complete content definitions in `manifest.js`, `anatomy.js`, `learning.js`, `lessons.js`, `installation.js` and `h175-state.js`, the numerical relationships in `plants.js` and `simulation.js`, and the explanations and labels in the three material engine studies. Architecture-specific branches were expanded so the coverage below describes the entries a reader actually encounters. Existing accurate facts were retained; the numerical correction and editorial changes are described below.

| Architecture | Component entries | Connections | Assemblies | Inspection recipes | Walkthroughs | Walkthrough stages | Experiments |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| helicopter | 127 | 85 | 17 | 9 | 9 | 50 | 3 |
| turboprop | 126 | 85 | 17 | 9 | 9 | 52 | 3 |
| turbofan | 113 | 81 | 16 | 8 | 8 | 48 | 3 |
| Total | 366 | 251 | 50 | 26 | 26 | 150 | 9 |

The nine experiments have 45 narrative stages. The review also covered all seven comparison rows, three architecture alternatives, six H175 mechanism entries, three material-study explanations, their visible module labels, operating controls and whole-aircraft captions. The original 23 walkthrough instances contained 131 stages; the three new gas-path instances add 19 stages.

## Corrections and clarifications

| Finding | Change and reason |
| --- | --- |
| Core thrust subtracted incoming momentum for both air and fuel. | Changed the core term from `mgas × (Vexit − V0)` to `mgas × Vexit − mcore_air × V0`. Fuel is added from the aircraft tank, so incoming freestream momentum uses air mass only. Applied the same change in all three published study bundles. |
| Degree-valued propeller settings were called geometric pitch. | Relabeled them blade angle and distinguished blade angle from angle of attack. Geometric pitch is theoretical travel per revolution, commonly expressed as a length. |
| The turboprop limit narrative could suggest that pitch must decrease from the initial condition. | Described the actual trial: pitch settles to absorb available torque, speed recovers, and the higher torque request remains unmet. In this trial pitch increases from the baseline but stays below the setting needed for the full request. |
| Compressor and diffuser explanations blurred static and total pressure. | Explained shaft work in rotating rows, flow guidance in stators, static-pressure recovery in a diffuser and total-pressure loss through real flow passages. Added a concise distinction between local blade stall and system surge. |
| Shaft, governor and sensor terms assumed too much prior knowledge. | Defined spool, the independent shaft paths, speed percentages, FADEC, PI and PCU. Separated gas-generator speed, power-shaft speed, geared output speed, calculated turbine-inlet temperature and the downstream probe reading. Distinguished the free power turbine from the freewheel clutch. |
| Existing walkthroughs began with detailed compressor construction. | Added `gas-path` as the first lesson: inlet, fan split where applicable, compression, combustion, compressor-driving turbine, useful-output turbine, and rotor/propeller/nozzle output. The introduction explains that these processes occur continuously. |
| Component explanations repeatedly emphasized missing simulations and hypothetical misinterpretations. | Rewrote descriptions around the part’s physical function, its connections and what to observe. Kept model assumptions where they change interpretation: generic controls, independent inlet conditions, approximate load laws, and conceptual service circuits. |
| The named PT6A-100 study and its numerical control model differed. | The study now states that the documented PT6A-100 uses hydromechanical fuel control, while its experiment demonstrates a generic electronic torque controller and separate propeller-speed governor. |
| The CFM56-5C study shows a mixer while the experiment uses two ideal nozzle estimates. | Explained the real configuration’s mixer/common exhaust and the separate-stream approximation used by the numerical experiment. Retained the verified stage counts. |
| Source notes mixed current evidence with internal publication history. | Updated `SOURCES.md` with thrust, propeller terminology and named-engine evidence; removed private-workflow and obsolete deployment commentary. `MODEL.md` now states the correct thrust equation and distinguishes the 250× main-view and 280× material-study rotation scales. |
| H175 references needed precise page scope. | Confirmed the official booklet has 400 pages: 392–393 illustrate operating functions and 394 is the completed model. Confirmed 2,001 pieces from LEGO’s product page. Simplified all six component descriptions and model notes. |

## Primary evidence checked

The following sources were used for the corrections and key architectural checks. They supplement the complete claim ledger in [SOURCES.md](SOURCES.md).

| Evidence | Relevant content |
| --- | --- |
| [NASA Glenn: Turbojet thrust](https://www.grc.nasa.gov/www/k-12/airplane/turbth.html) | Net thrust as outgoing momentum minus incoming momentum; ideal-expansion pressure term. |
| [NASA Glenn: Brayton cycle](https://www.grc.nasa.gov/www/k-12/airplane/brayton.html) | Compression, heat addition and turbine expansion. |
| [NASA Glenn: axial compressor](https://www.grc.nasa.gov/www/k-12/VirtualAero/BottleRocket/airplane/caxial.html) and [centrifugal compressor](https://www.grc.nasa.gov/www/k-12/VirtualAero/BottleRocket/airplane/centrf.html) | Rotor/stator work and the impeller/diffuser alternative. |
| [NASA Glenn: combustor](https://www.grc.nasa.gov/www/k-12/BGP/burner.html) | Casing, liner, air admission, continuous burning and combustor configurations. |
| [NASA Glenn: station numbering](https://www.grc.nasa.gov/www/k-12/airplane/turbdraw.html) | Compressor delivery, turbine inlet and downstream temperature locations. |
| [FAA AC 25.939-1, § 4](https://www.faa.gov/documentLibrary/media/Advisory_Circular/AC_25_939-1.pdf) | Stall and surge definitions. |
| [FAA AMT Powerplant, chapter 7](https://www.faa.gov/sites/faa.gov/files/09_amtp_ch7.pdf), Figures 7-4–7-5; [FAA PHAK chapter 5](https://www.faa.gov/sites/faa.gov/files/regulations_policies/handbooks_manuals/aviation/phak/07_phak_ch5.pdf) | Geometric pitch, blade angle, angle of attack and propeller governing. |
| [FAA Helicopter Flying Handbook, chapter 4](https://www.faa.gov/sites/faa.gov/files/regulations_policies/handbooks_manuals/aviation/helicopter_flying_handbook/hfh_ch04.pdf) | Free turbine, freewheeling unit, transmission, main/tail rotor drives and swashplate relationships. |
| [FAA AMT Powerplant, chapter 5](https://www.faa.gov/sites/faa.gov/files/07_amtp_ch5.pdf) | Starting energy, compressor rotation and transition to self-sustaining operation. |
| [FAA AMT Powerplant, chapter 2](https://www.faa.gov/sites/faa.gov/files/04_amtp_ch2.pdf) and [FAA AC 33.28-3](https://www.faa.gov/documentLibrary/media/Advisory_Circular/AC_33_28-3.pdf) | Fuel metering, EEC/FADEC terminology and control-system context. |
| [Smithsonian XT700-GE-700 record](https://airandspace.si.edu/collection-objects/general-electric-xt700-ge-700-turboshaft-engine/nasm_A19860224000) | Five axial compressor stages, one centrifugal stage, two gas-generator turbine stages and two power-turbine stages. |
| [EASA IM.E.094, issue 3, § III.2](https://www.easa.europa.eu/sites/default/files/dfu/EASA_IM.E.094_TCDS_Issue_3_20230327.pdf) | PT6A-100 compressor/turbine counts, two-stage reduction and hydromechanical fuel control. |
| [EASA E.003, issue 6, § III.2](https://www.easa.europa.eu/sites/default/files/dfu/TCDS%20EASA%20E.003%20issue%2006.pdf) | CFM56-5C fan, booster, compressor and turbine stages, dual-channel FADEC and mixer. |
| [Pratt & Whitney: PT6C](https://www.rtx.com/en/prattwhitney/products/helicopter-engines/pt6c) and [Airbus H175 technical information](https://www.airbus.com/en/products-services/helicopters/civil-helicopters/h175/h175-technical-information) | H175/PT6C-67E identity and separation from the XT700 engine bench. |
| [LEGO 42145 product page](https://www.lego.com/en-us/product/airbus-h175-rescue-helicopter-42145) and [official booklet](https://www.lego.com/cdn/product-assets/product.bi.core.pdf/6430765.pdf#page=392) | Piece count, one-motor functions, manual controls and booklet page scope. |

The LEGO booklet pages were visually inspected from the previously downloaded official PDF because the current web fetch failed. Several large FAA Powerplant PDFs exceeded the web reader’s fetch limit; the review used the official indexed sections together with the readable NASA, FAA helicopter/starting and EASA documents. No claim of having read those unavailable PDFs in full is made.

## Verification

- Targeted command: `node --test tests/plants.test.mjs tests/simulation.test.mjs tests/compiled-studies.test.mjs tests/anatomy.test.mjs tests/h175.test.mjs tests/representation.test.mjs` — **39 Node tests passed**, including the H175 test file’s 23 behavior/geometry checks.
- `node --test tests/learning-state.test.mjs` — **4 tests passed** after replacing the obsolete exact-copy assertion with the selected-recipe invariant and adding the beginner-path order/routing check.
- The new momentum regression checks that, with prescribed inlet total conditions, increasing forward speed changes net thrust according to incoming air mass only, across three fuel-flow values.
- The three compiled-study functions match `fanThermodynamics` for **72 parameter combinations** in total: two gas-generator speeds, two power-shaft speeds, two fuel flows and three forward speeds per bundle.
- All three compiled module scripts pass `node --check`. Each bundled explanation matches its current source text exactly once.
- Existing tests continue to cover mass/heat/work closure, both shaft balances, transient direction, limited-demand behavior, fixed-step reproducibility, reset and timestep refinement. The legacy `simulation.js` compatibility surface was reviewed and passed without an equation change.
- Every walkthrough target, recipe target, connection endpoint and circuit branch resolves through the existing anatomy and representation tests.

The full application test/build/release gates and live responsive checks are recorded by the integrating review. This report does not substitute for that release verification.

## Remaining model scope

The experiments retain generic parameter choices, prescribed inlet conditions, approximate aerodynamic load laws and simple control loops. Service circuits, cold start, shutdown and freewheel overrun are conceptual explanations. The material studies retain representative shapes and installation details. The regression tests verify the declared equations and state relationships; they do not establish measured-engine performance or dimensional fidelity.

## Entry-by-entry coverage

Every identifier listed below was reviewed in its architecture-specific context. Repeated identifiers represent distinct rendered entries for the different engines.

### helicopter: 127 component entries

| ID | Display name | Group |
| --- | --- | --- |
| `inlet` | Inlet & intake duct | air |
| `compressor.rotor` | Compressor rotors | air |
| `compressor.stator` | Compressor stators | air |
| `compressor.casing` | Compressor outer casing | air |
| `diffuser` | Diffuser | air |
| `combustor.casing` | Combustor outer casing | air |
| `combustor.liner` | Combustor liner | air |
| `fuel.nozzles` | Fuel manifold & injectors | air |
| `igniter` | Igniter | air |
| `turbine.vanes` | Turbine nozzle guide vanes | air |
| `turbine.casing` | Turbine outer casing | air |
| `gg.rotor` | Gas-generator turbine rotor | air |
| `power.rotor` | Free power-turbine rotors | air |
| `exhaust` | Side exhaust ducts & collector | air |
| `gg.shaft` | Gas-generator shaft · Ng | drive |
| `power.shaft` | Power shaft · Np | drive |
| `bearings` | Shaft bearings & supports | drive |
| `reduction` | Transmission input & freewheel | drive |
| `mast` | Main transmission & rotor mast | drive |
| `tail.drive` | Tail-drive shaft & gearbox | drive |
| `rotor` | Main rotor & blade pitch | airframe |
| `tail.rotor` | Tail rotor | airframe |
| `pitch.control` | Collective & swashplate context | airframe |
| `airframe` | Helicopter installation | airframe |
| `controller` | Engine controller / FADEC | control |
| `fuel.pump` | Fuel supply & pump | control |
| `fmu` | Fuel metering unit | control |
| `speed.g` | Ng speed pickup | control |
| `speed.p` | Np power-shaft speed pickup | control |
| `load.speed` | Nr / main-rotor speed pickup | control |
| `temperature` | Gas-path temperature probe | control |
| `pressure` | Compressor-delivery pressure pickup | control |
| `inlet.sensor` | Inlet temperature & pressure probes | control |
| `fmu.position` | Metering position / flow feedback | control |
| `torque` | Output torque sensing / estimate | control |
| `demand` | Pilot rotor demand | control |
| `airdata` | Aircraft air-data interface | control |
| `electrical` | Accessory generator & electrical bus | service |
| `accessory` | Accessory gearbox & extraction | service |
| `oil` | Oil supply & temperature monitoring | service |
| `vibration` | Vibration pickup & monitor | service |
| `chip` | Chip / debris indication | service |
| `bleed` | Bleed & variable-geometry interface | service |
| `channels` | Controller channels & availability | service |
| `cockpit` | Cockpit indications & monitoring | service |
| `fuel.system` | Fuel supply circuit | service |
| `compressor.stage.1.rotor` | Stage 1 · rotor blades | air |
| `compressor.stage.1.disc` | Stage 1 · rotor disc | air |
| `compressor.stage.1.stator` | Stage 1 · stator vanes | air |
| `compressor.stage.2.rotor` | Stage 2 · rotor blades | air |
| `compressor.stage.2.disc` | Stage 2 · rotor disc | air |
| `compressor.stage.2.stator` | Stage 2 · stator vanes | air |
| `compressor.stage.3.rotor` | Stage 3 · rotor blades | air |
| `compressor.stage.3.disc` | Stage 3 · rotor disc | air |
| `compressor.stage.3.stator` | Stage 3 · stator vanes | air |
| `compressor.stage.4.rotor` | Stage 4 · rotor blades | air |
| `compressor.stage.4.disc` | Stage 4 · rotor disc | air |
| `compressor.stage.4.stator` | Stage 4 · stator vanes | air |
| `compressor.stage.5.rotor` | Stage 5 · rotor blades | air |
| `compressor.stage.5.disc` | Stage 5 · rotor disc | air |
| `compressor.frame` | Compressor support frame | air |
| `combustor.dome` | Combustor dome | air |
| `combustor.swirlers` | Injector swirlers | air |
| `combustor.primary` | Primary air admission | air |
| `combustor.dilution` | Dilution air ports | air |
| `combustor.cooling` | Liner cooling passages | air |
| `injector.manifold` | Annular fuel manifold | air |
| `injector.tip` | Fuel injector tips | air |
| `turbine.hpt.disc` | Gas-generator / HP turbine disc | air |
| `turbine.lpt.disc.1` | Power / LP turbine disc 1 | air |
| `turbine.lpt.disc.2` | Power / LP turbine disc 2 | air |
| `turbine.ngv.hpt` | Gas-generator / HP nozzle guide vanes | air |
| `turbine.ngv.lpt` | Power / LP nozzle guide vanes | air |
| `turbine.frame` | Turbine exit frame | air |
| `bearing.front` | Gas-generator front bearing | drive |
| `bearing.rear` | Gas-generator rear bearing | drive |
| `bearing.power` | Power-shaft bearing | drive |
| `seal.front` | Compressor bearing labyrinth seal | drive |
| `seal.hot` | Hot-section bearing labyrinth seal | drive |
| `fuel.tank` | Aircraft fuel supply | service |
| `fuel.boost` | Supply boost pump | service |
| `fuel.filter` | Fuel filter & element | service |
| `fuel.shutoff` | Fuel shutoff valve | service |
| `oil.tank` | Dry-sump oil reservoir | service |
| `oil.pressure` | Pressure oil pump | service |
| `oil.filter` | Oil filter & element | service |
| `oil.scavenge` | Scavenge pump | service |
| `oil.cooler` | Oil cooler | service |
| `oil.breather` | Breather & air/oil separator | service |
| `electric.bus` | Aircraft electrical bus | service |
| `electric.battery` | Battery / ground electrical source | service |
| `starter` | Engine starter | service |
| `starter.supply` | Starter contactor | service |
| `ignition.exciter` | Ignition exciter | service |
| `fuel.bypass` | Fuel pump bypass / relief | service |
| `oil.relief` | Pressure relief / regulation | service |
| `oil.vent` | Separated breather air outlet | service |
| `start.command` | Starting control command | service |
| `reduction.case` | Reduction gearbox housing | drive |
| `reduction.gears` | Reduction gear train | drive |
| `reduction.sun` | Input sun gear | drive |
| `reduction.ring` | Fixed internal ring | drive |
| `reduction.planets` | Planet gears | drive |
| `reduction.carrier` | Output planet carrier | drive |
| `freewheel` | Overrunning freewheel | drive |
| `swashplate` | Collective swashplate & pitch links | airframe |
| `tail.gearbox` | Tail rotor right-angle gearbox | drive |
| `tail.stepup` | Tail-drive speed increase | drive |
| `fuel.filter.cap` | Filter housing & cap | service |
| `fuel.filter.element` | Pleated filter element | service |
| `oil.filter.cap` | Filter housing & cap | service |
| `oil.filter.element` | Pleated filter element | service |
| `bearing.front.inner` | Inner race | drive |
| `bearing.front.outer` | Outer race & housing | drive |
| `bearing.front.rolling` | Rolling elements & cage | drive |
| `bearing.rear.inner` | Inner race | drive |
| `bearing.rear.outer` | Outer race & housing | drive |
| `bearing.rear.rolling` | Rolling elements & cage | drive |
| `bearing.power.inner` | Inner race | drive |
| `bearing.power.outer` | Outer race & housing | drive |
| `bearing.power.rolling` | Rolling elements & cage | drive |
| `airframe.fuselage` | Cabin & tail boom | airframe |
| `airframe.cockpit` | Cockpit & cabin glazing | airframe |
| `airframe.tail` | Tail surfaces | airframe |
| `airframe.landing` | Landing skids | airframe |
| `airframe.mounts` | Engine deck & mounts | airframe |
| `airframe.nacelle` | Studied engine nacelle / cowling | airframe |

#### Walkthroughs and ordered component targets

| Lesson ID | Title | Component targets in order |
| --- | --- | --- |
| `gas-path` | Start here: air, fuel and useful power | `inlet` → `compressor.rotor` → `combustor.liner` → `gg.rotor` → `power.rotor` → `rotor` |
| `compression` | How a compressor stage works | `compressor.stage.1.rotor` → `compressor.stage.1.stator` → `compressor.stage.1.disc` → `compressor.frame` → `diffuser` |
| `combustion` | Inside the annular combustor | `combustor.casing` → `injector.manifold` → `combustor.swirlers` → `combustor.primary` → `combustor.cooling` → `combustor.dilution` |
| `spools` | What turns what? | `gg.rotor` → `gg.shaft` → `power.rotor` → `power.shaft` → `rotor` |
| `fuel` | Trace fuel from tank to flame | `fuel.tank` → `fuel.boost` → `fuel.filter` → `fuel.shutoff` → `fuel.pump` → `fmu` → `injector.manifold` → `injector.tip` → `combustor.liner` |
| `oil` | Follow the oil supply and return | `oil.tank` → `oil.pressure` → `oil.filter` → `bearings` → `oil.scavenge` → `oil.cooler` → `oil.breather` |
| `start` | How an engine gets started | `electric.battery` → `starter` → `ignition.exciter` → `injector.tip` → `gg.rotor` |
| `shutdown` | What changes when fuel is shut off? | `fuel.shutoff` → `combustor.liner` → `gg.rotor` → `oil.scavenge` |
| `freewheel` | Free turbine and freewheel: two different parts | `power.rotor` → `freewheel` → `mast` |

#### Experiments and stage targets

| Experiment ID | Name | Stage targets in order |
| --- | --- | --- |
| `increase` | Increase rotor collective | `pitch.control` → `speed.p` → `controller` → `power.rotor` → `rotor` |
| `limit` | Demand more at an engine limit | `pitch.control` → `speed.p` → `controller` → `power.rotor` → `rotor` |
| `accessory` | Add an accessory load | `accessory` → `gg.shaft` → `speed.p` → `fmu` → `rotor` |

#### Inspection recipes

| ID | Target | Stages |
| --- | --- | --- |
| `engine` | `combustor.casing` | Separate pressure casings → Reveal the combustor liner |
| `compressor` | `compressor.stage.1.rotor` | Lift compressor casing → Inspect rotor, disc and stator |
| `combustor` | `combustor.liner` | Open pressure casing → Separate liner sectors |
| `turbine` | `gg.rotor` | Open hot-section casing → Trace the independent spools |
| `support` | `bearing.front` | Open bearing housing → Inspect races, rolling elements and seal |
| `output` | `reduction` | Open drive housing → Inspect gearing and driven load |
| `fuel` | `fuel.filter` | Open filter housing → Inspect element and metering path |
| `oil` | `oil.filter` | Open filter housing → Follow pressure, scavenge and breather paths |
| `start` | `starter` | Open starter housing → Follow starting-energy and ignition paths |

#### Circuit routes and branches

- **fuel:** `fuel.tank` → `fuel.boost` → `fuel.filter` → `fuel.shutoff` → `fuel.pump` → `fmu` → `injector.manifold` → `injector.tip` → `combustor.liner`.
- **fuel branch 1:** `fuel.pump` → `fuel.bypass` → `fuel.pump`.
- **oil:** `oil.tank` → `oil.pressure` → `oil.filter` → `bearings` → `oil.scavenge` → `oil.cooler` → `oil.tank`.
- **oil branch 1:** `oil.filter` → `bearing.front` → `oil.scavenge`.
- **oil branch 2:** `oil.filter` → `bearing.rear` → `oil.scavenge`.
- **oil branch 3:** `oil.filter` → `bearing.power` → `oil.scavenge`.
- **oil branch 4:** `oil.pressure` → `oil.relief` → `oil.tank`.
- **breather:** `bearings` → `oil.breather` → `oil.vent`.
- **breather branch 1:** `oil.breather` → `oil.tank`.
- **start:** `electric.battery` → `electric.bus` → `starter.supply` → `starter` → `accessory` → `gg.rotor`.
- **start branch 1:** `electric.bus` → `start.command` → `starter.supply`.
- **ignition:** `electric.battery` → `electric.bus` → `ignition.exciter` → `igniter`.

#### Typed connection IDs

`inlet>compressor.rotor`, `compressor.rotor>diffuser`, `diffuser>combustor.liner`, `combustor.liner>gg.rotor`, `gg.rotor>power.rotor`, `power.rotor>exhaust`, `power.rotor>power.shaft`, `power.shaft>reduction`, `reduction>mast`, `gg.rotor>gg.shaft`, `gg.shaft>compressor.rotor`, `gg.shaft>accessory`, `mast>rotor`, `mast>tail.drive`, `tail.drive>tail.rotor`, `demand>pitch.control`, `pitch.control>rotor`, `rotor>power.shaft`, `gg.shaft>speed.g`, `power.shaft>speed.p`, `speed.g>controller`, `speed.p>controller`, `rotor>load.speed`, `load.speed>cockpit`, `diffuser>pressure`, `pressure>controller`, `inlet>inlet.sensor`, `inlet.sensor>controller`, `gg.rotor>temperature`, `temperature>cockpit`, `controller>fmu`, `fuel.pump>fmu`, `fmu>fuel.nozzles`, `fuel.nozzles>combustor.liner`, `fmu>fmu.position`, `fmu.position>fmu`, `power.shaft>torque`, `torque>cockpit`, `accessory>electrical`, `electrical>controller`, `electrical>fmu`, `electrical>cockpit`, `oil>bearings`, `oil>cockpit`, `vibration>cockpit`, `chip>cockpit`, `channels>controller`, `airdata>controller`, `controller>cockpit`, `bleed>controller`, `fuel.pump>fuel.bypass`, `fuel.bypass>fuel.pump`, `oil.filter>bearing.front`, `bearing.front>oil.scavenge`, `oil.filter>bearing.rear`, `bearing.rear>oil.scavenge`, `oil.filter>bearing.power`, `bearing.power>oil.scavenge`, `oil.pressure>oil.relief`, `oil.relief>oil.tank`, `oil.breather>oil.tank`, `electric.bus>start.command`, `start.command>starter.supply`, `fuel.tank>fuel.boost`, `fuel.boost>fuel.filter`, `fuel.filter>fuel.shutoff`, `fuel.shutoff>fuel.pump`, `fmu>injector.manifold`, `injector.manifold>injector.tip`, `injector.tip>combustor.liner`, `oil.tank>oil.pressure`, `oil.pressure>oil.filter`, `oil.filter>bearings`, `bearings>oil.scavenge`, `oil.scavenge>oil.cooler`, `oil.cooler>oil.tank`, `bearings>oil.breather`, `oil.breather>oil.vent`, `electric.battery>electric.bus`, `electric.bus>starter.supply`, `starter.supply>starter`, `starter>accessory`, `accessory>gg.rotor`, `electric.bus>ignition.exciter`, `ignition.exciter>igniter`.

### turboprop: 126 component entries

| ID | Display name | Group |
| --- | --- | --- |
| `inlet` | Inlet & intake duct | air |
| `compressor.rotor` | Compressor rotors | air |
| `compressor.stator` | Compressor stators | air |
| `compressor.casing` | Compressor outer casing | air |
| `diffuser` | Diffuser | air |
| `combustor.casing` | Combustor outer casing | air |
| `combustor.liner` | Combustor liner | air |
| `fuel.nozzles` | Fuel manifold & injectors | air |
| `igniter` | Igniter | air |
| `turbine.vanes` | Turbine nozzle guide vanes | air |
| `turbine.casing` | Turbine outer casing | air |
| `gg.rotor` | Gas-generator turbine rotor | air |
| `power.rotor` | Free power-turbine rotors | air |
| `exhaust` | Core exhaust & nozzle | air |
| `gg.shaft` | Gas-generator shaft · Ng | drive |
| `power.shaft` | Power shaft · Np | drive |
| `bearings` | Shaft bearings & supports | drive |
| `reduction` | Propeller reduction gearbox | drive |
| `propeller` | Propeller blades & hub | airframe |
| `prop.governor` | Propeller speed governor | control |
| `pitch.actuator` | PCU & pitch-change mechanism | control |
| `airframe` | Propeller-aircraft installation | airframe |
| `wing` | Wing, pylon & flight-control context | airframe |
| `controller` | Engine controller / FADEC | control |
| `fuel.pump` | Fuel supply & pump | control |
| `fmu` | Fuel metering unit | control |
| `speed.g` | Ng speed pickup | control |
| `speed.p` | Np power-shaft speed pickup | control |
| `load.speed` | Propeller-speed pickup | control |
| `temperature` | Gas-path temperature probe | control |
| `pressure` | Compressor-delivery pressure pickup | control |
| `inlet.sensor` | Inlet temperature & pressure probes | control |
| `fmu.position` | Metering position / flow feedback | control |
| `torque` | Output torque sensing / estimate | control |
| `demand` | Pilot power / thrust request | control |
| `airdata` | Aircraft air-data interface | control |
| `pitch.feedback` | Blade pitch feedback | control |
| `electrical` | Accessory generator & electrical bus | service |
| `accessory` | Accessory gearbox & extraction | service |
| `oil` | Oil supply & temperature monitoring | service |
| `vibration` | Vibration pickup & monitor | service |
| `chip` | Chip / debris indication | service |
| `bleed` | Bleed & variable-geometry interface | service |
| `channels` | Controller channels & availability | service |
| `cockpit` | Cockpit indications & monitoring | service |
| `fuel.system` | Fuel supply circuit | service |
| `compressor.stage.1.rotor` | Stage 1 · rotor blades | air |
| `compressor.stage.1.disc` | Stage 1 · rotor disc | air |
| `compressor.stage.1.stator` | Stage 1 · stator vanes | air |
| `compressor.stage.2.rotor` | Stage 2 · rotor blades | air |
| `compressor.stage.2.disc` | Stage 2 · rotor disc | air |
| `compressor.stage.2.stator` | Stage 2 · stator vanes | air |
| `compressor.stage.3.rotor` | Stage 3 · rotor blades | air |
| `compressor.stage.3.disc` | Stage 3 · rotor disc | air |
| `compressor.stage.3.stator` | Stage 3 · stator vanes | air |
| `compressor.stage.4.rotor` | Stage 4 · rotor blades | air |
| `compressor.stage.4.disc` | Stage 4 · rotor disc | air |
| `compressor.stage.4.stator` | Stage 4 · stator vanes | air |
| `compressor.stage.5.rotor` | Stage 5 · rotor blades | air |
| `compressor.stage.5.disc` | Stage 5 · rotor disc | air |
| `compressor.frame` | Compressor support frame | air |
| `combustor.dome` | Combustor dome | air |
| `combustor.swirlers` | Injector swirlers | air |
| `combustor.primary` | Primary air admission | air |
| `combustor.dilution` | Dilution air ports | air |
| `combustor.cooling` | Liner cooling passages | air |
| `injector.manifold` | Annular fuel manifold | air |
| `injector.tip` | Fuel injector tips | air |
| `turbine.hpt.disc` | Gas-generator / HP turbine disc | air |
| `turbine.lpt.disc.1` | Power / LP turbine disc 1 | air |
| `turbine.lpt.disc.2` | Power / LP turbine disc 2 | air |
| `turbine.ngv.hpt` | Gas-generator / HP nozzle guide vanes | air |
| `turbine.ngv.lpt` | Power / LP nozzle guide vanes | air |
| `turbine.frame` | Turbine exit frame | air |
| `bearing.front` | Gas-generator front bearing | drive |
| `bearing.rear` | Gas-generator rear bearing | drive |
| `bearing.power` | Power-shaft bearing | drive |
| `seal.front` | Compressor bearing labyrinth seal | drive |
| `seal.hot` | Hot-section bearing labyrinth seal | drive |
| `fuel.tank` | Aircraft fuel supply | service |
| `fuel.boost` | Supply boost pump | service |
| `fuel.filter` | Fuel filter & element | service |
| `fuel.shutoff` | Fuel shutoff valve | service |
| `oil.tank` | Dry-sump oil reservoir | service |
| `oil.pressure` | Pressure oil pump | service |
| `oil.filter` | Oil filter & element | service |
| `oil.scavenge` | Scavenge pump | service |
| `oil.cooler` | Oil cooler | service |
| `oil.breather` | Breather & air/oil separator | service |
| `electric.bus` | Aircraft electrical bus | service |
| `electric.battery` | Battery / ground electrical source | service |
| `starter` | Engine starter | service |
| `starter.supply` | Starter contactor | service |
| `ignition.exciter` | Ignition exciter | service |
| `fuel.bypass` | Fuel pump bypass / relief | service |
| `oil.relief` | Pressure relief / regulation | service |
| `oil.vent` | Separated breather air outlet | service |
| `start.command` | Starting control command | service |
| `reduction.case` | Reduction gearbox housing | drive |
| `reduction.gears` | Reduction gear train | drive |
| `reduction.sun` | Input sun gear | drive |
| `reduction.ring` | Fixed internal ring | drive |
| `reduction.planets` | Planet gears | drive |
| `reduction.carrier` | Output planet carrier | drive |
| `prop.hub` | Propeller pitch hub | airframe |
| `pitch.piston` | Pitch piston & links | control |
| `fuel.filter.cap` | Filter housing & cap | service |
| `fuel.filter.element` | Pleated filter element | service |
| `oil.filter.cap` | Filter housing & cap | service |
| `oil.filter.element` | Pleated filter element | service |
| `bearing.front.inner` | Inner race | drive |
| `bearing.front.outer` | Outer race & housing | drive |
| `bearing.front.rolling` | Rolling elements & cage | drive |
| `bearing.rear.inner` | Inner race | drive |
| `bearing.rear.outer` | Outer race & housing | drive |
| `bearing.rear.rolling` | Rolling elements & cage | drive |
| `bearing.power.inner` | Inner race | drive |
| `bearing.power.outer` | Outer race & housing | drive |
| `bearing.power.rolling` | Rolling elements & cage | drive |
| `airframe.fuselage` | Fuselage | airframe |
| `airframe.cockpit` | Cockpit & cabin glazing | airframe |
| `airframe.tail` | Tail surfaces | airframe |
| `airframe.landing` | Retracted gear doors | airframe |
| `airframe.mounts` | Engine pylons & mounts | airframe |
| `airframe.nacelle` | Studied engine nacelle / cowling | airframe |
| `airframe.companion` | Far engine · exterior context only | airframe |

#### Walkthroughs and ordered component targets

| Lesson ID | Title | Component targets in order |
| --- | --- | --- |
| `gas-path` | Start here: air, fuel and useful power | `inlet` → `compressor.rotor` → `combustor.liner` → `gg.rotor` → `power.rotor` → `propeller` |
| `compression` | How a compressor stage works | `compressor.stage.1.rotor` → `compressor.stage.1.stator` → `compressor.stage.1.disc` → `compressor.frame` → `diffuser` |
| `combustion` | Inside the annular combustor | `combustor.casing` → `injector.manifold` → `combustor.swirlers` → `combustor.primary` → `combustor.cooling` → `combustor.dilution` |
| `spools` | What turns what? | `gg.rotor` → `gg.shaft` → `power.rotor` → `power.shaft` → `propeller` |
| `fuel` | Trace fuel from tank to flame | `fuel.tank` → `fuel.boost` → `fuel.filter` → `fuel.shutoff` → `fuel.pump` → `fmu` → `injector.manifold` → `injector.tip` → `combustor.liner` |
| `oil` | Follow the oil supply and return | `oil.tank` → `oil.pressure` → `oil.filter` → `bearings` → `oil.scavenge` → `oil.cooler` → `oil.breather` |
| `start` | How an engine gets started | `electric.battery` → `starter` → `ignition.exciter` → `injector.tip` → `gg.rotor` |
| `shutdown` | What changes when fuel is shut off? | `fuel.shutoff` → `combustor.liner` → `gg.rotor` → `oil.scavenge` |
| `pitch` | Why more power changes propeller pitch | `controller` → `prop.governor` → `pitch.piston` → `prop.hub` → `propeller` |

#### Experiments and stage targets

| Experiment ID | Name | Stage targets in order |
| --- | --- | --- |
| `increase` | More power at governed prop speed | `demand` → `fmu` → `prop.governor` → `pitch.actuator` → `propeller` |
| `limit` | A torque request the engine cannot meet | `demand` → `fmu` → `prop.governor` → `pitch.actuator` → `propeller` |
| `accessory` | Add an accessory load | `accessory` → `gg.shaft` → `torque` → `fmu` → `propeller` |

#### Inspection recipes

| ID | Target | Stages |
| --- | --- | --- |
| `engine` | `combustor.casing` | Separate pressure casings → Reveal the combustor liner |
| `compressor` | `compressor.stage.1.rotor` | Lift compressor casing → Inspect rotor, disc and stator |
| `combustor` | `combustor.liner` | Open pressure casing → Separate liner sectors |
| `turbine` | `gg.rotor` | Open hot-section casing → Trace the independent spools |
| `support` | `bearing.front` | Open bearing housing → Inspect races, rolling elements and seal |
| `output` | `reduction` | Open drive housing → Inspect gearing and driven load |
| `fuel` | `fuel.filter` | Open filter housing → Inspect element and metering path |
| `oil` | `oil.filter` | Open filter housing → Follow pressure, scavenge and breather paths |
| `start` | `starter` | Open starter housing → Follow starting-energy and ignition paths |

#### Circuit routes and branches

- **fuel:** `fuel.tank` → `fuel.boost` → `fuel.filter` → `fuel.shutoff` → `fuel.pump` → `fmu` → `injector.manifold` → `injector.tip` → `combustor.liner`.
- **fuel branch 1:** `fuel.pump` → `fuel.bypass` → `fuel.pump`.
- **oil:** `oil.tank` → `oil.pressure` → `oil.filter` → `bearings` → `oil.scavenge` → `oil.cooler` → `oil.tank`.
- **oil branch 1:** `oil.filter` → `bearing.front` → `oil.scavenge`.
- **oil branch 2:** `oil.filter` → `bearing.rear` → `oil.scavenge`.
- **oil branch 3:** `oil.filter` → `bearing.power` → `oil.scavenge`.
- **oil branch 4:** `oil.pressure` → `oil.relief` → `oil.tank`.
- **breather:** `bearings` → `oil.breather` → `oil.vent`.
- **breather branch 1:** `oil.breather` → `oil.tank`.
- **start:** `electric.battery` → `electric.bus` → `starter.supply` → `starter` → `accessory` → `gg.rotor`.
- **start branch 1:** `electric.bus` → `start.command` → `starter.supply`.
- **ignition:** `electric.battery` → `electric.bus` → `ignition.exciter` → `igniter`.

#### Typed connection IDs

`inlet>compressor.rotor`, `compressor.rotor>diffuser`, `diffuser>combustor.liner`, `combustor.liner>gg.rotor`, `gg.rotor>power.rotor`, `power.rotor>exhaust`, `power.rotor>power.shaft`, `power.shaft>reduction`, `reduction>propeller`, `gg.rotor>gg.shaft`, `gg.shaft>compressor.rotor`, `gg.shaft>accessory`, `demand>controller`, `gg.shaft>speed.g`, `power.shaft>speed.p`, `speed.g>controller`, `speed.p>cockpit`, `propeller>load.speed`, `load.speed>prop.governor`, `diffuser>pressure`, `pressure>controller`, `inlet>inlet.sensor`, `inlet.sensor>controller`, `gg.rotor>temperature`, `temperature>cockpit`, `controller>fmu`, `fuel.pump>fmu`, `fmu>fuel.nozzles`, `fuel.nozzles>combustor.liner`, `fmu>fmu.position`, `fmu.position>fmu`, `power.shaft>torque`, `torque>controller`, `accessory>electrical`, `electrical>controller`, `electrical>fmu`, `electrical>cockpit`, `oil>bearings`, `oil>cockpit`, `vibration>cockpit`, `chip>cockpit`, `channels>controller`, `airdata>controller`, `controller>cockpit`, `bleed>controller`, `prop.governor>pitch.actuator`, `pitch.actuator>propeller`, `pitch.actuator>pitch.feedback`, `pitch.feedback>prop.governor`, `propeller>power.shaft`, `fuel.pump>fuel.bypass`, `fuel.bypass>fuel.pump`, `oil.filter>bearing.front`, `bearing.front>oil.scavenge`, `oil.filter>bearing.rear`, `bearing.rear>oil.scavenge`, `oil.filter>bearing.power`, `bearing.power>oil.scavenge`, `oil.pressure>oil.relief`, `oil.relief>oil.tank`, `oil.breather>oil.tank`, `electric.bus>start.command`, `start.command>starter.supply`, `fuel.tank>fuel.boost`, `fuel.boost>fuel.filter`, `fuel.filter>fuel.shutoff`, `fuel.shutoff>fuel.pump`, `fmu>injector.manifold`, `injector.manifold>injector.tip`, `injector.tip>combustor.liner`, `oil.tank>oil.pressure`, `oil.pressure>oil.filter`, `oil.filter>bearings`, `bearings>oil.scavenge`, `oil.scavenge>oil.cooler`, `oil.cooler>oil.tank`, `bearings>oil.breather`, `oil.breather>oil.vent`, `electric.battery>electric.bus`, `electric.bus>starter.supply`, `starter.supply>starter`, `starter>accessory`, `accessory>gg.rotor`, `electric.bus>ignition.exciter`, `ignition.exciter>igniter`.

### turbofan: 113 component entries

| ID | Display name | Group |
| --- | --- | --- |
| `inlet` | Inlet & intake duct | air |
| `fan.rotor` | Fan rotor | air |
| `fan.stator` | Fan outlet guide vanes | air |
| `lpc.rotor` | Low-pressure compressor | air |
| `lpc.stator` | LP compressor stators | air |
| `bypass` | Bypass duct & nozzle | air |
| `compressor.rotor` | High-pressure compressor | air |
| `compressor.stator` | Compressor stators | air |
| `compressor.casing` | Compressor outer casing | air |
| `diffuser` | Diffuser | air |
| `combustor.casing` | Combustor outer casing | air |
| `combustor.liner` | Combustor liner | air |
| `fuel.nozzles` | Fuel manifold & injectors | air |
| `igniter` | Igniter | air |
| `turbine.vanes` | Turbine nozzle guide vanes | air |
| `turbine.casing` | Turbine outer casing | air |
| `gg.rotor` | High-pressure turbine | air |
| `power.rotor` | Low-pressure turbine | air |
| `exhaust` | Core exhaust & nozzle | air |
| `hp.shaft` | HP shaft · N2 | drive |
| `lp.shaft` | LP shaft · N1 | drive |
| `bearings` | Shaft bearings & supports | drive |
| `airframe` | Jet-aircraft installation | airframe |
| `wing` | Wing, pylon & flight-control context | airframe |
| `controller` | Engine controller / FADEC | control |
| `fuel.pump` | Fuel supply & pump | control |
| `fmu` | Fuel metering unit | control |
| `speed.g` | N2 / HP speed pickup | control |
| `speed.p` | N1 / LP speed pickup | control |
| `temperature` | Gas-path temperature probe | control |
| `pressure` | Compressor-delivery pressure pickup | control |
| `inlet.sensor` | Inlet temperature & pressure probes | control |
| `fmu.position` | Metering position / flow feedback | control |
| `torque` | Output torque sensing / estimate | control |
| `demand` | Pilot power / thrust request | control |
| `airdata` | Aircraft air-data interface | control |
| `electrical` | Accessory generator & electrical bus | service |
| `accessory` | Accessory gearbox & extraction | service |
| `oil` | Oil supply & temperature monitoring | service |
| `vibration` | Vibration pickup & monitor | service |
| `chip` | Chip / debris indication | service |
| `bleed` | Bleed & variable-geometry interface | service |
| `channels` | Controller channels & availability | service |
| `cockpit` | Cockpit indications & monitoring | service |
| `fuel.system` | Fuel supply circuit | service |
| `compressor.stage.1.rotor` | Stage 1 · rotor blades | air |
| `compressor.stage.1.disc` | Stage 1 · rotor disc | air |
| `compressor.stage.1.stator` | Stage 1 · stator vanes | air |
| `compressor.stage.2.rotor` | Stage 2 · rotor blades | air |
| `compressor.stage.2.disc` | Stage 2 · rotor disc | air |
| `compressor.stage.2.stator` | Stage 2 · stator vanes | air |
| `compressor.stage.3.rotor` | Stage 3 · rotor blades | air |
| `compressor.stage.3.disc` | Stage 3 · rotor disc | air |
| `compressor.frame` | Compressor support frame | air |
| `combustor.dome` | Combustor dome | air |
| `combustor.swirlers` | Injector swirlers | air |
| `combustor.primary` | Primary air admission | air |
| `combustor.dilution` | Dilution air ports | air |
| `combustor.cooling` | Liner cooling passages | air |
| `injector.manifold` | Annular fuel manifold | air |
| `injector.tip` | Fuel injector tips | air |
| `turbine.hpt.disc` | Gas-generator / HP turbine disc | air |
| `turbine.lpt.disc.1` | Power / LP turbine disc 1 | air |
| `turbine.lpt.disc.2` | Power / LP turbine disc 2 | air |
| `turbine.ngv.hpt` | Gas-generator / HP nozzle guide vanes | air |
| `turbine.ngv.lpt` | Power / LP nozzle guide vanes | air |
| `turbine.frame` | Turbine exit frame | air |
| `bearing.front` | Gas-generator front bearing | drive |
| `bearing.rear` | Gas-generator rear bearing | drive |
| `bearing.power` | Power-shaft bearing | drive |
| `seal.front` | Compressor bearing labyrinth seal | drive |
| `seal.hot` | Hot-section bearing labyrinth seal | drive |
| `fuel.tank` | Aircraft fuel supply | service |
| `fuel.boost` | Supply boost pump | service |
| `fuel.filter` | Fuel filter & element | service |
| `fuel.shutoff` | Fuel shutoff valve | service |
| `oil.tank` | Dry-sump oil reservoir | service |
| `oil.pressure` | Pressure oil pump | service |
| `oil.filter` | Oil filter & element | service |
| `oil.scavenge` | Scavenge pump | service |
| `oil.cooler` | Oil cooler | service |
| `oil.breather` | Breather & air/oil separator | service |
| `electric.bus` | Aircraft electrical bus | service |
| `electric.battery` | Battery / ground electrical source | service |
| `starter` | Engine starter | service |
| `starter.supply` | APU / ground starting air | service |
| `ignition.exciter` | Ignition exciter | service |
| `fuel.bypass` | Fuel pump bypass / relief | service |
| `oil.relief` | Pressure relief / regulation | service |
| `oil.vent` | Separated breather air outlet | service |
| `start.command` | Starting control command | service |
| `starter.valve` | Pneumatic starter control valve | service |
| `fan.frame` | Fan case & outlet support | air |
| `fuel.filter.cap` | Filter housing & cap | service |
| `fuel.filter.element` | Pleated filter element | service |
| `oil.filter.cap` | Filter housing & cap | service |
| `oil.filter.element` | Pleated filter element | service |
| `bearing.front.inner` | Inner race | drive |
| `bearing.front.outer` | Outer race & housing | drive |
| `bearing.front.rolling` | Rolling elements & cage | drive |
| `bearing.rear.inner` | Inner race | drive |
| `bearing.rear.outer` | Outer race & housing | drive |
| `bearing.rear.rolling` | Rolling elements & cage | drive |
| `bearing.power.inner` | Inner race | drive |
| `bearing.power.outer` | Outer race & housing | drive |
| `bearing.power.rolling` | Rolling elements & cage | drive |
| `airframe.fuselage` | Fuselage | airframe |
| `airframe.cockpit` | Cockpit & cabin glazing | airframe |
| `airframe.tail` | Tail surfaces | airframe |
| `airframe.landing` | Retracted gear doors | airframe |
| `airframe.mounts` | Engine pylons & mounts | airframe |
| `airframe.nacelle` | Studied engine nacelle / cowling | airframe |
| `airframe.companion` | Far engine · exterior context only | airframe |

#### Walkthroughs and ordered component targets

| Lesson ID | Title | Component targets in order |
| --- | --- | --- |
| `gas-path` | Start here: air, fuel and useful power | `inlet` → `fan.rotor` → `compressor.rotor` → `combustor.liner` → `gg.rotor` → `power.rotor` → `bypass` |
| `compression` | How a compressor stage works | `compressor.stage.1.rotor` → `compressor.stage.1.stator` → `compressor.stage.1.disc` → `compressor.frame` → `diffuser` |
| `combustion` | Inside the annular combustor | `combustor.casing` → `injector.manifold` → `combustor.swirlers` → `combustor.primary` → `combustor.cooling` → `combustor.dilution` |
| `spools` | What turns what? | `gg.rotor` → `hp.shaft` → `power.rotor` → `lp.shaft` → `fan.rotor` |
| `fuel` | Trace fuel from tank to flame | `fuel.tank` → `fuel.boost` → `fuel.filter` → `fuel.shutoff` → `fuel.pump` → `fmu` → `injector.manifold` → `injector.tip` → `combustor.liner` |
| `oil` | Follow the oil supply and return | `oil.tank` → `oil.pressure` → `oil.filter` → `bearings` → `oil.scavenge` → `oil.cooler` → `oil.breather` |
| `start` | How an engine gets started | `starter.supply` → `starter` → `ignition.exciter` → `injector.tip` → `gg.rotor` |
| `shutdown` | What changes when fuel is shut off? | `fuel.shutoff` → `combustor.liner` → `gg.rotor` → `oil.scavenge` |

#### Experiments and stage targets

| Experiment ID | Name | Stage targets in order |
| --- | --- | --- |
| `increase` | Increase the thrust request | `demand` → `fmu` → `lp.shaft` → `bypass` → `exhaust` |
| `limit` | Demand more at an engine limit | `demand` → `fmu` → `lp.shaft` → `bypass` → `exhaust` |
| `accessory` | Add an accessory load | `accessory` → `hp.shaft` → `speed.p` → `fmu` → `fan.rotor` |

#### Inspection recipes

| ID | Target | Stages |
| --- | --- | --- |
| `engine` | `combustor.casing` | Separate pressure casings → Reveal the combustor liner |
| `compressor` | `compressor.stage.1.rotor` | Lift compressor casing → Inspect rotor, disc and stator |
| `combustor` | `combustor.liner` | Open pressure casing → Separate liner sectors |
| `turbine` | `gg.rotor` | Open hot-section casing → Trace the independent spools |
| `support` | `bearing.front` | Open bearing housing → Inspect races, rolling elements and seal |
| `fuel` | `fuel.filter` | Open filter housing → Inspect element and metering path |
| `oil` | `oil.filter` | Open filter housing → Follow pressure, scavenge and breather paths |
| `start` | `starter` | Open starter housing → Follow starting-energy and ignition paths |

#### Circuit routes and branches

- **fuel:** `fuel.tank` → `fuel.boost` → `fuel.filter` → `fuel.shutoff` → `fuel.pump` → `fmu` → `injector.manifold` → `injector.tip` → `combustor.liner`.
- **fuel branch 1:** `fuel.pump` → `fuel.bypass` → `fuel.pump`.
- **oil:** `oil.tank` → `oil.pressure` → `oil.filter` → `bearings` → `oil.scavenge` → `oil.cooler` → `oil.tank`.
- **oil branch 1:** `oil.filter` → `bearing.front` → `oil.scavenge`.
- **oil branch 2:** `oil.filter` → `bearing.rear` → `oil.scavenge`.
- **oil branch 3:** `oil.filter` → `bearing.power` → `oil.scavenge`.
- **oil branch 4:** `oil.pressure` → `oil.relief` → `oil.tank`.
- **breather:** `bearings` → `oil.breather` → `oil.vent`.
- **breather branch 1:** `oil.breather` → `oil.tank`.
- **start:** `starter.supply` → `starter.valve` → `starter` → `accessory` → `gg.rotor`.
- **start branch 1:** `electric.battery` → `electric.bus` → `start.command` → `starter.valve`.
- **ignition:** `electric.battery` → `electric.bus` → `ignition.exciter` → `igniter`.

#### Typed connection IDs

`inlet>fan.rotor`, `fan.rotor>lpc.rotor`, `lpc.rotor>compressor.rotor`, `compressor.rotor>diffuser`, `diffuser>combustor.liner`, `combustor.liner>gg.rotor`, `gg.rotor>power.rotor`, `power.rotor>exhaust`, `fan.rotor>bypass`, `power.rotor>lp.shaft`, `lp.shaft>fan.rotor`, `lp.shaft>lpc.rotor`, `gg.rotor>hp.shaft`, `hp.shaft>compressor.rotor`, `hp.shaft>accessory`, `demand>controller`, `hp.shaft>speed.g`, `lp.shaft>speed.p`, `speed.g>controller`, `speed.p>controller`, `diffuser>pressure`, `pressure>controller`, `inlet>inlet.sensor`, `inlet.sensor>controller`, `exhaust>temperature`, `temperature>cockpit`, `controller>fmu`, `fuel.pump>fmu`, `fmu>fuel.nozzles`, `fuel.nozzles>combustor.liner`, `fmu>fmu.position`, `fmu.position>fmu`, `lp.shaft>torque`, `torque>cockpit`, `accessory>electrical`, `electrical>controller`, `electrical>fmu`, `electrical>cockpit`, `oil>bearings`, `oil>cockpit`, `vibration>cockpit`, `chip>cockpit`, `channels>controller`, `airdata>controller`, `controller>cockpit`, `bleed>controller`, `fuel.pump>fuel.bypass`, `fuel.bypass>fuel.pump`, `oil.filter>bearing.front`, `bearing.front>oil.scavenge`, `oil.filter>bearing.rear`, `bearing.rear>oil.scavenge`, `oil.filter>bearing.power`, `bearing.power>oil.scavenge`, `oil.pressure>oil.relief`, `oil.relief>oil.tank`, `oil.breather>oil.tank`, `electric.battery>electric.bus`, `electric.bus>start.command`, `start.command>starter.valve`, `fuel.tank>fuel.boost`, `fuel.boost>fuel.filter`, `fuel.filter>fuel.shutoff`, `fuel.shutoff>fuel.pump`, `fmu>injector.manifold`, `injector.manifold>injector.tip`, `injector.tip>combustor.liner`, `oil.tank>oil.pressure`, `oil.pressure>oil.filter`, `oil.filter>bearings`, `bearings>oil.scavenge`, `oil.scavenge>oil.cooler`, `oil.cooler>oil.tank`, `bearings>oil.breather`, `oil.breather>oil.vent`, `starter.supply>starter.valve`, `starter.valve>starter`, `starter>accessory`, `accessory>gg.rotor`, `electric.bus>ignition.exciter`, `ignition.exciter>igniter`.

### Comparison and alternative entries

Comparison rows: Useful output; What the fuel controller follows; How the load changes; Independent shafts; Starting example; What the experiment calculates; Other arrangements.

Alternatives: `compression` — Axial and centrifugal compressors; `flow` — Forward-flow and reverse-flow cores; `fan` — Direct-drive and geared fans.

### H175 mechanism entries

| ID | Display name |
| --- | --- |
| `whole` | Assembled model |
| `rotor` | Five-blade rotor & pitch links |
| `drive` | One motor, selected mechanical branches |
| `gear` | Retractable wheeled landing gear |
| `winch` | Rescue winch, drum & hook |
| `covers` | Opening cowlings & cabin doors |

### Material-study text and labels

Reviewed all three `lab.how` descriptions, the common operating-control labels and readouts, inspection controls, study-navigation labels, whole-aircraft captions, module names and the following scene labels.

- **turboshaft modules:** Inlet assembly, Gas generator cases and stators, Free turbine module, Removable accessory assembly.
- **turboshaft labels:** Inlet, Annular combustor, Gas generator, Free power turbine, Exhaust.
- **turboprop modules:** Propeller, Reduction and free turbine, Gas generator, Accessory gearbox.
- **turboprop labels:** Propeller, Gearbox, Rear air inlet, Reverse-flow combustor, Free power turbine, Accessory gearbox.
- **turbofan modules:** Fan and booster module, High-pressure spool, Core cases and stators, Low-pressure turbine module.
- **turbofan labels:** Fan, Bypass duct, High-pressure compressor, Annular combustor, Low-pressure turbine.
