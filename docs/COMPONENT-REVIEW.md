# Component representation and motion review — version 4

This inventory covers every selectable node in all three architectures. Physical construction is distinguished from assembly groupings and aircraft/system interfaces. A static housing, sensor, support or boundary is not given decorative motion; rotating mechanisms follow their declared shaft, and inspection motion is a separate paused presentation. All numerical plant equations are unchanged. Browser interaction evidence is recorded separately.

## helicopter

| Component / identity | Representation | Location / responsibility | Motion or scope |
|---|---|---|---|
| Inlet & intake duct (`inlet`) | physical | Engine assembly | Stationary unless linked to a shaft. |
| Compressor rotors (`compressor.rotor`) | assembly | Engine assembly | Turns with Ng / gas-generator shaft. |
| Compressor stators (`compressor.stator`) | assembly | Engine assembly | Fixed; optional variable geometry is explained separately. |
| Compressor outer casing (`compressor.casing`) | physical | Engine assembly | Stationary pressure boundary; separate from blade rows. |
| Diffuser (`diffuser`) | physical | Engine assembly | Stationary unless linked to a shaft. |
| Combustor outer casing (`combustor.casing`) | physical | Engine assembly | Stationary unless linked to a shaft. |
| Combustor liner (`combustor.liner`) | physical | Engine assembly | Stationary unless linked to a shaft. |
| Fuel manifold & injectors (`fuel.nozzles`) | physical | Engine assembly | Stationary unless linked to a shaft. |
| Igniter (`igniter`) | physical | Engine assembly | Stationary unless linked to a shaft. |
| Turbine nozzle guide vanes (`turbine.vanes`) | assembly | Engine assembly | Fixed to the turbine structure. |
| Turbine outer casing (`turbine.casing`) | physical | Engine assembly | Stationary casing; rotor and vane assemblies remain in place. |
| Gas-generator turbine rotor (`gg.rotor`) | assembly | Engine assembly | Turns with Ng. |
| Free power-turbine rotors (`power.rotor`) | assembly | Engine assembly | Turns with Np. |
| Side exhaust ducts & collector (`exhaust`) | physical | Engine assembly | Stationary ducts; flow markers are explanatory. |
| Gas-generator shaft · Ng (`gg.shaft`) | physical | Engine assembly | Ng, independently integrated. |
| Power shaft · Np (`power.shaft`) | physical | Engine assembly | Np, independent of Ng. |
| Shaft bearings & supports (`bearings`) | assembly | Engine assembly | Outer supports fixed; rolling elements not resolved. |
| Transmission input & freewheel (`reduction`) | physical | Engine assembly | Visible input/output gears rotate at a declared reduction. |
| Main transmission & rotor mast (`mast`) | physical | Engine assembly | Mast and main rotor share the reduced speed. |
| Tail-drive shaft & gearbox (`tail.drive`) | assembly | Engine assembly | Synthetic tail-drive ratio is shown; no yaw/flight model. |
| Main rotor & blade pitch (`rotor`) | physical | Aircraft / driven load | Rotates with the reduced mast; blades visibly change pitch. |
| Tail rotor (`tail.rotor`) | physical | Aircraft / driven load | Linked to tail drive; no independently controlled tail pitch. |
| Collective & swashplate context (`pitch.control`) | physical | Aircraft / driven load | Stationary unless linked to a shaft. |
| Helicopter installation (`airframe`) | physical | Aircraft / driven load | Stationary unless linked to a shaft. |
| Engine controller / FADEC (`controller`) | physical | Engine assembly | Stationary unless linked to a shaft. |
| Fuel supply & pump (`fuel.pump`) | physical | Engine assembly | Stationary unless linked to a shaft. |
| Fuel metering unit (`fmu`) | physical | Engine assembly | Stationary unless linked to a shaft. |
| Ng speed pickup (`speed.g`) | physical | Engine assembly | Stationary unless linked to a shaft. |
| Np power-shaft speed pickup (`speed.p`) | physical | Engine assembly | Stationary unless linked to a shaft. |
| Nr / main-rotor speed pickup (`load.speed`) | physical | Engine assembly | Stationary unless linked to a shaft. |
| Gas-path temperature probe (`temperature`) | physical | Engine assembly | Stationary unless linked to a shaft. |
| Compressor-delivery pressure pickup (`pressure`) | physical | Engine assembly | Stationary unless linked to a shaft. |
| Inlet temperature & pressure probes (`inlet.sensor`) | physical | Engine assembly | Stationary unless linked to a shaft. |
| Metering position / flow feedback (`fmu.position`) | physical | Engine assembly | Stationary unless linked to a shaft. |
| Output torque sensing / estimate (`torque`) | physical | Engine assembly | Stationary unless linked to a shaft. |
| Pilot rotor demand (`demand`) | interface | Pilot / aircraft command | Stationary unless linked to a shaft. |
| Aircraft air-data interface (`airdata`) | interface | Aircraft information | Stationary unless linked to a shaft. |
| Accessory generator & electrical bus (`electrical`) | physical | Engine assembly | Stationary unless linked to a shaft. |
| Accessory gearbox & extraction (`accessory`) | physical | Engine assembly | Stationary unless linked to a shaft. |
| Oil supply & temperature monitoring (`oil`) | assembly | Engine assembly | Stationary unless linked to a shaft. |
| Vibration pickup & monitor (`vibration`) | physical | Engine assembly | Stationary unless linked to a shaft. |
| Chip / debris indication (`chip`) | physical | Engine assembly | Stationary unless linked to a shaft. |
| Bleed & variable-geometry interface (`bleed`) | physical | Engine assembly | Stationary unless linked to a shaft. |
| Controller channels & availability (`channels`) | interface | Optional control architecture | Stationary unless linked to a shaft. |
| Cockpit indications & monitoring (`cockpit`) | interface | Aircraft indication | Stationary unless linked to a shaft. |
| Fuel supply circuit (`fuel.system`) | assembly | Engine assembly | Fixed unless identified as part of a rotating assembly. |
| Stage 1 · rotor blades (`compressor.stage.1.rotor`) | assembly | Engine assembly | Rotates with the gas-generator / HP shaft. |
| Stage 1 · rotor disc (`compressor.stage.1.disc`) | physical | Engine assembly | Rigidly attached to its rotor row. |
| Stage 1 · stator vanes (`compressor.stage.1.stator`) | physical | Engine assembly | Stationary; fixed to the casing. |
| Stage 2 · rotor blades (`compressor.stage.2.rotor`) | assembly | Engine assembly | Rotates with the gas-generator / HP shaft. |
| Stage 2 · rotor disc (`compressor.stage.2.disc`) | physical | Engine assembly | Rigidly attached to its rotor row. |
| Stage 2 · stator vanes (`compressor.stage.2.stator`) | physical | Engine assembly | Stationary; fixed to the casing. |
| Stage 3 · rotor blades (`compressor.stage.3.rotor`) | assembly | Engine assembly | Rotates with the gas-generator / HP shaft. |
| Stage 3 · rotor disc (`compressor.stage.3.disc`) | physical | Engine assembly | Rigidly attached to its rotor row. |
| Stage 3 · stator vanes (`compressor.stage.3.stator`) | physical | Engine assembly | Stationary; fixed to the casing. |
| Stage 4 · rotor blades (`compressor.stage.4.rotor`) | assembly | Engine assembly | Rotates with the gas-generator / HP shaft. |
| Stage 4 · rotor disc (`compressor.stage.4.disc`) | physical | Engine assembly | Rigidly attached to its rotor row. |
| Stage 4 · stator vanes (`compressor.stage.4.stator`) | physical | Engine assembly | Stationary; fixed to the casing. |
| Stage 5 · rotor blades (`compressor.stage.5.rotor`) | assembly | Engine assembly | Rotates with the gas-generator / HP shaft. |
| Stage 5 · rotor disc (`compressor.stage.5.disc`) | physical | Engine assembly | Rigidly attached to its rotor row. |
| Compressor support frame (`compressor.frame`) | physical | Engine assembly | Fixed unless identified as part of a rotating assembly. |
| Combustor dome (`combustor.dome`) | physical | Engine assembly | Fixed unless identified as part of a rotating assembly. |
| Injector swirlers (`combustor.swirlers`) | physical | Engine assembly | Fixed unless identified as part of a rotating assembly. |
| Primary air admission (`combustor.primary`) | physical | Engine assembly | Fixed unless identified as part of a rotating assembly. |
| Dilution air ports (`combustor.dilution`) | physical | Engine assembly | Fixed unless identified as part of a rotating assembly. |
| Liner cooling passages (`combustor.cooling`) | physical | Engine assembly | Fixed unless identified as part of a rotating assembly. |
| Annular fuel manifold (`injector.manifold`) | physical | Engine assembly | Fixed unless identified as part of a rotating assembly. |
| Fuel injector tips (`injector.tip`) | physical | Engine assembly | Fixed unless identified as part of a rotating assembly. |
| Gas-generator / HP turbine disc (`turbine.hpt.disc`) | physical | Engine assembly | Rigidly attached to its turbine rotor. |
| Power / LP turbine disc 1 (`turbine.lpt.disc.1`) | physical | Engine assembly | Rigidly attached to its turbine rotor. |
| Power / LP turbine disc 2 (`turbine.lpt.disc.2`) | physical | Engine assembly | Rigidly attached to its turbine rotor. |
| Gas-generator / HP nozzle guide vanes (`turbine.ngv.hpt`) | physical | Engine assembly | Fixed unless identified as part of a rotating assembly. |
| Power / LP nozzle guide vanes (`turbine.ngv.lpt`) | physical | Engine assembly | Fixed unless identified as part of a rotating assembly. |
| Turbine exit frame (`turbine.frame`) | physical | Engine assembly | Fixed unless identified as part of a rotating assembly. |
| Gas-generator front bearing (`bearing.front`) | assembly | Engine assembly | Fixed unless identified as part of a rotating assembly. |
| Gas-generator rear bearing (`bearing.rear`) | assembly | Engine assembly | Fixed unless identified as part of a rotating assembly. |
| Power-shaft bearing (`bearing.power`) | assembly | Engine assembly | Fixed unless identified as part of a rotating assembly. |
| Compressor bearing labyrinth seal (`seal.front`) | physical | Engine assembly | Fixed unless identified as part of a rotating assembly. |
| Hot-section bearing labyrinth seal (`seal.hot`) | physical | Engine assembly | Fixed unless identified as part of a rotating assembly. |
| Aircraft fuel supply (`fuel.tank`) | interface | Aircraft fuel supply | Fixed unless identified as part of a rotating assembly. |
| Supply boost pump (`fuel.boost`) | interface | Aircraft fuel feed | Fixed unless identified as part of a rotating assembly. |
| Fuel filter & element (`fuel.filter`) | assembly | Engine assembly | Fixed unless identified as part of a rotating assembly. |
| Fuel shutoff valve (`fuel.shutoff`) | physical | Engine assembly | Fixed unless identified as part of a rotating assembly. |
| Dry-sump oil reservoir (`oil.tank`) | physical | Engine assembly | Fixed unless identified as part of a rotating assembly. |
| Pressure oil pump (`oil.pressure`) | physical | Engine assembly | Fixed unless identified as part of a rotating assembly. |
| Oil filter & element (`oil.filter`) | assembly | Engine assembly | Fixed unless identified as part of a rotating assembly. |
| Scavenge pump (`oil.scavenge`) | physical | Engine assembly | Fixed unless identified as part of a rotating assembly. |
| Oil cooler (`oil.cooler`) | physical | Engine assembly | Fixed unless identified as part of a rotating assembly. |
| Breather & air/oil separator (`oil.breather`) | physical | Engine assembly | Fixed unless identified as part of a rotating assembly. |
| Aircraft electrical bus (`electric.bus`) | interface | Aircraft electrical distribution | Fixed unless identified as part of a rotating assembly. |
| Battery / ground electrical source (`electric.battery`) | interface | Aircraft electrical source | Fixed unless identified as part of a rotating assembly. |
| Engine starter (`starter`) | physical | Engine assembly | Fixed unless identified as part of a rotating assembly. |
| Starter contactor (`starter.supply`) | interface | Starting-energy interface | Fixed unless identified as part of a rotating assembly. |
| Ignition exciter (`ignition.exciter`) | physical | Engine assembly | Fixed unless identified as part of a rotating assembly. |
| Fuel pump bypass / relief (`fuel.bypass`) | physical | Engine assembly | Fixed unless identified as part of a rotating assembly. |
| Pressure relief / regulation (`oil.relief`) | physical | Engine assembly | Fixed unless identified as part of a rotating assembly. |
| Separated breather air outlet (`oil.vent`) | physical | Engine assembly | Fixed unless identified as part of a rotating assembly. |
| Starting control command (`start.command`) | interface | Command information | Fixed unless identified as part of a rotating assembly. |
| Reduction gearbox housing (`reduction.case`) | physical | Engine assembly | Fixed unless identified as part of a rotating assembly. |
| Reduction gear train (`reduction.gears`) | assembly | Engine assembly | Fixed unless identified as part of a rotating assembly. |
| Input sun gear (`reduction.sun`) | physical | Engine assembly | Rotates at input power-shaft speed. |
| Fixed internal ring (`reduction.ring`) | physical | Engine assembly | Fixed to the housing. |
| Planet gears (`reduction.planets`) | physical | Engine assembly | Spin and orbit between the input sun and fixed ring. |
| Output planet carrier (`reduction.carrier`) | physical | Engine assembly | Rotates at the declared reduced output speed. |
| Overrunning freewheel (`freewheel`) | physical | Engine assembly | Fixed unless identified as part of a rotating assembly. |
| Collective swashplate & pitch links (`swashplate`) | physical | Aircraft / driven load | Lower ring translates without rotating; upper ring and rigid pitch links follow mast rotation and actual blade-root pitch. |
| Tail rotor right-angle gearbox (`tail.gearbox`) | physical | Engine assembly | Fixed unless identified as part of a rotating assembly. |
| Tail-drive speed increase (`tail.stepup`) | physical | Engine assembly | The external gear pair reverses direction and increases speed by four. |
| Filter housing & cap (`fuel.filter.cap`) | physical | Engine assembly | Fixed unless identified as part of a rotating assembly. |
| Pleated filter element (`fuel.filter.element`) | physical | Engine assembly | Fixed unless identified as part of a rotating assembly. |
| Filter housing & cap (`oil.filter.cap`) | physical | Engine assembly | Fixed unless identified as part of a rotating assembly. |
| Pleated filter element (`oil.filter.element`) | physical | Engine assembly | Fixed unless identified as part of a rotating assembly. |
| Inner race (`bearing.front.inner`) | physical | Engine assembly | Inner race follows its supported shaft. |
| Outer race & housing (`bearing.front.outer`) | physical | Engine assembly | Outer race and support housing stay fixed. |
| Rolling elements & cage (`bearing.front.rolling`) | physical | Engine assembly | Rolling elements are a static construction view; bearing rolling kinematics are not calculated. |
| Inner race (`bearing.rear.inner`) | physical | Engine assembly | Inner race follows its supported shaft. |
| Outer race & housing (`bearing.rear.outer`) | physical | Engine assembly | Outer race and support housing stay fixed. |
| Rolling elements & cage (`bearing.rear.rolling`) | physical | Engine assembly | Rolling elements are a static construction view; bearing rolling kinematics are not calculated. |
| Inner race (`bearing.power.inner`) | physical | Engine assembly | Inner race follows its supported shaft. |
| Outer race & housing (`bearing.power.outer`) | physical | Engine assembly | Outer race and support housing stay fixed. |
| Rolling elements & cage (`bearing.power.rolling`) | physical | Engine assembly | Rolling elements are a static construction view; bearing rolling kinematics are not calculated. |
| Cabin & tail boom (`airframe.fuselage`) | physical | Aircraft / driven load | Stationary installation context. Aircraft flight is not simulated. |
| Cockpit & cabin glazing (`airframe.cockpit`) | physical | Aircraft / driven load | Stationary installation context. Aircraft flight is not simulated. |
| Tail surfaces (`airframe.tail`) | physical | Aircraft / driven load | Stationary installation context. Aircraft flight is not simulated. |
| Landing skids (`airframe.landing`) | physical | Aircraft / driven load | Stationary installation context. Aircraft flight is not simulated. |
| Engine deck & mounts (`airframe.mounts`) | physical | Aircraft / driven load | Stationary installation context. Aircraft flight is not simulated. |
| Studied engine nacelle / cowling (`airframe.nacelle`) | physical | Aircraft / driven load | Stationary installation context. Aircraft flight is not simulated. |

## turboprop

| Component / identity | Representation | Location / responsibility | Motion or scope |
|---|---|---|---|
| Inlet & intake duct (`inlet`) | physical | Engine assembly | Stationary unless linked to a shaft. |
| Compressor rotors (`compressor.rotor`) | assembly | Engine assembly | Turns with Ng / gas-generator shaft. |
| Compressor stators (`compressor.stator`) | assembly | Engine assembly | Fixed; optional variable geometry is explained separately. |
| Compressor outer casing (`compressor.casing`) | physical | Engine assembly | Stationary pressure boundary; separate from blade rows. |
| Diffuser (`diffuser`) | physical | Engine assembly | Stationary unless linked to a shaft. |
| Combustor outer casing (`combustor.casing`) | physical | Engine assembly | Stationary unless linked to a shaft. |
| Combustor liner (`combustor.liner`) | physical | Engine assembly | Stationary unless linked to a shaft. |
| Fuel manifold & injectors (`fuel.nozzles`) | physical | Engine assembly | Stationary unless linked to a shaft. |
| Igniter (`igniter`) | physical | Engine assembly | Stationary unless linked to a shaft. |
| Turbine nozzle guide vanes (`turbine.vanes`) | assembly | Engine assembly | Fixed to the turbine structure. |
| Turbine outer casing (`turbine.casing`) | physical | Engine assembly | Stationary casing; rotor and vane assemblies remain in place. |
| Gas-generator turbine rotor (`gg.rotor`) | assembly | Engine assembly | Turns with Ng. |
| Free power-turbine rotors (`power.rotor`) | assembly | Engine assembly | Turns with Np. |
| Core exhaust & nozzle (`exhaust`) | physical | Engine assembly | Stationary unless linked to a shaft. |
| Gas-generator shaft · Ng (`gg.shaft`) | physical | Engine assembly | Ng, independently integrated. |
| Power shaft · Np (`power.shaft`) | physical | Engine assembly | Np, independent of Ng. |
| Shaft bearings & supports (`bearings`) | assembly | Engine assembly | Outer supports fixed; rolling elements not resolved. |
| Propeller reduction gearbox (`reduction`) | physical | Engine assembly | Visible input/output gears rotate at a declared reduction. |
| Propeller blades & hub (`propeller`) | physical | Aircraft / driven load | 10:1 reduced shaft speed; blade pitch has its own actuator state. |
| Propeller speed governor (`prop.governor`) | physical | Engine assembly | Stationary unless linked to a shaft. |
| PCU & pitch-change mechanism (`pitch.actuator`) | assembly | Engine assembly | Stationary unless linked to a shaft. |
| Propeller-aircraft installation (`airframe`) | physical | Aircraft / driven load | Stationary unless linked to a shaft. |
| Wing, pylon & flight-control context (`wing`) | physical | Aircraft / driven load | Stationary unless linked to a shaft. |
| Engine controller / FADEC (`controller`) | physical | Engine assembly | Stationary unless linked to a shaft. |
| Fuel supply & pump (`fuel.pump`) | physical | Engine assembly | Stationary unless linked to a shaft. |
| Fuel metering unit (`fmu`) | physical | Engine assembly | Stationary unless linked to a shaft. |
| Ng speed pickup (`speed.g`) | physical | Engine assembly | Stationary unless linked to a shaft. |
| Np power-shaft speed pickup (`speed.p`) | physical | Engine assembly | Stationary unless linked to a shaft. |
| Propeller-speed pickup (`load.speed`) | physical | Engine assembly | Stationary unless linked to a shaft. |
| Gas-path temperature probe (`temperature`) | physical | Engine assembly | Stationary unless linked to a shaft. |
| Compressor-delivery pressure pickup (`pressure`) | physical | Engine assembly | Stationary unless linked to a shaft. |
| Inlet temperature & pressure probes (`inlet.sensor`) | physical | Engine assembly | Stationary unless linked to a shaft. |
| Metering position / flow feedback (`fmu.position`) | physical | Engine assembly | Stationary unless linked to a shaft. |
| Output torque sensing / estimate (`torque`) | physical | Engine assembly | Stationary unless linked to a shaft. |
| Pilot power / thrust request (`demand`) | interface | Pilot / aircraft command | Stationary unless linked to a shaft. |
| Aircraft air-data interface (`airdata`) | interface | Aircraft information | Stationary unless linked to a shaft. |
| Blade pitch feedback (`pitch.feedback`) | physical | Engine assembly | Stationary unless linked to a shaft. |
| Accessory generator & electrical bus (`electrical`) | physical | Engine assembly | Stationary unless linked to a shaft. |
| Accessory gearbox & extraction (`accessory`) | physical | Engine assembly | Stationary unless linked to a shaft. |
| Oil supply & temperature monitoring (`oil`) | assembly | Engine assembly | Stationary unless linked to a shaft. |
| Vibration pickup & monitor (`vibration`) | physical | Engine assembly | Stationary unless linked to a shaft. |
| Chip / debris indication (`chip`) | physical | Engine assembly | Stationary unless linked to a shaft. |
| Bleed & variable-geometry interface (`bleed`) | physical | Engine assembly | Stationary unless linked to a shaft. |
| Controller channels & availability (`channels`) | interface | Optional control architecture | Stationary unless linked to a shaft. |
| Cockpit indications & monitoring (`cockpit`) | interface | Aircraft indication | Stationary unless linked to a shaft. |
| Fuel supply circuit (`fuel.system`) | assembly | Engine assembly | Fixed unless identified as part of a rotating assembly. |
| Stage 1 · rotor blades (`compressor.stage.1.rotor`) | assembly | Engine assembly | Rotates with the gas-generator / HP shaft. |
| Stage 1 · rotor disc (`compressor.stage.1.disc`) | physical | Engine assembly | Rigidly attached to its rotor row. |
| Stage 1 · stator vanes (`compressor.stage.1.stator`) | physical | Engine assembly | Stationary; fixed to the casing. |
| Stage 2 · rotor blades (`compressor.stage.2.rotor`) | assembly | Engine assembly | Rotates with the gas-generator / HP shaft. |
| Stage 2 · rotor disc (`compressor.stage.2.disc`) | physical | Engine assembly | Rigidly attached to its rotor row. |
| Stage 2 · stator vanes (`compressor.stage.2.stator`) | physical | Engine assembly | Stationary; fixed to the casing. |
| Stage 3 · rotor blades (`compressor.stage.3.rotor`) | assembly | Engine assembly | Rotates with the gas-generator / HP shaft. |
| Stage 3 · rotor disc (`compressor.stage.3.disc`) | physical | Engine assembly | Rigidly attached to its rotor row. |
| Stage 3 · stator vanes (`compressor.stage.3.stator`) | physical | Engine assembly | Stationary; fixed to the casing. |
| Stage 4 · rotor blades (`compressor.stage.4.rotor`) | assembly | Engine assembly | Rotates with the gas-generator / HP shaft. |
| Stage 4 · rotor disc (`compressor.stage.4.disc`) | physical | Engine assembly | Rigidly attached to its rotor row. |
| Stage 4 · stator vanes (`compressor.stage.4.stator`) | physical | Engine assembly | Stationary; fixed to the casing. |
| Stage 5 · rotor blades (`compressor.stage.5.rotor`) | assembly | Engine assembly | Rotates with the gas-generator / HP shaft. |
| Stage 5 · rotor disc (`compressor.stage.5.disc`) | physical | Engine assembly | Rigidly attached to its rotor row. |
| Compressor support frame (`compressor.frame`) | physical | Engine assembly | Fixed unless identified as part of a rotating assembly. |
| Combustor dome (`combustor.dome`) | physical | Engine assembly | Fixed unless identified as part of a rotating assembly. |
| Injector swirlers (`combustor.swirlers`) | physical | Engine assembly | Fixed unless identified as part of a rotating assembly. |
| Primary air admission (`combustor.primary`) | physical | Engine assembly | Fixed unless identified as part of a rotating assembly. |
| Dilution air ports (`combustor.dilution`) | physical | Engine assembly | Fixed unless identified as part of a rotating assembly. |
| Liner cooling passages (`combustor.cooling`) | physical | Engine assembly | Fixed unless identified as part of a rotating assembly. |
| Annular fuel manifold (`injector.manifold`) | physical | Engine assembly | Fixed unless identified as part of a rotating assembly. |
| Fuel injector tips (`injector.tip`) | physical | Engine assembly | Fixed unless identified as part of a rotating assembly. |
| Gas-generator / HP turbine disc (`turbine.hpt.disc`) | physical | Engine assembly | Rigidly attached to its turbine rotor. |
| Power / LP turbine disc 1 (`turbine.lpt.disc.1`) | physical | Engine assembly | Rigidly attached to its turbine rotor. |
| Power / LP turbine disc 2 (`turbine.lpt.disc.2`) | physical | Engine assembly | Rigidly attached to its turbine rotor. |
| Gas-generator / HP nozzle guide vanes (`turbine.ngv.hpt`) | physical | Engine assembly | Fixed unless identified as part of a rotating assembly. |
| Power / LP nozzle guide vanes (`turbine.ngv.lpt`) | physical | Engine assembly | Fixed unless identified as part of a rotating assembly. |
| Turbine exit frame (`turbine.frame`) | physical | Engine assembly | Fixed unless identified as part of a rotating assembly. |
| Gas-generator front bearing (`bearing.front`) | assembly | Engine assembly | Fixed unless identified as part of a rotating assembly. |
| Gas-generator rear bearing (`bearing.rear`) | assembly | Engine assembly | Fixed unless identified as part of a rotating assembly. |
| Power-shaft bearing (`bearing.power`) | assembly | Engine assembly | Fixed unless identified as part of a rotating assembly. |
| Compressor bearing labyrinth seal (`seal.front`) | physical | Engine assembly | Fixed unless identified as part of a rotating assembly. |
| Hot-section bearing labyrinth seal (`seal.hot`) | physical | Engine assembly | Fixed unless identified as part of a rotating assembly. |
| Aircraft fuel supply (`fuel.tank`) | interface | Aircraft fuel supply | Fixed unless identified as part of a rotating assembly. |
| Supply boost pump (`fuel.boost`) | interface | Aircraft fuel feed | Fixed unless identified as part of a rotating assembly. |
| Fuel filter & element (`fuel.filter`) | assembly | Engine assembly | Fixed unless identified as part of a rotating assembly. |
| Fuel shutoff valve (`fuel.shutoff`) | physical | Engine assembly | Fixed unless identified as part of a rotating assembly. |
| Dry-sump oil reservoir (`oil.tank`) | physical | Engine assembly | Fixed unless identified as part of a rotating assembly. |
| Pressure oil pump (`oil.pressure`) | physical | Engine assembly | Fixed unless identified as part of a rotating assembly. |
| Oil filter & element (`oil.filter`) | assembly | Engine assembly | Fixed unless identified as part of a rotating assembly. |
| Scavenge pump (`oil.scavenge`) | physical | Engine assembly | Fixed unless identified as part of a rotating assembly. |
| Oil cooler (`oil.cooler`) | physical | Engine assembly | Fixed unless identified as part of a rotating assembly. |
| Breather & air/oil separator (`oil.breather`) | physical | Engine assembly | Fixed unless identified as part of a rotating assembly. |
| Aircraft electrical bus (`electric.bus`) | interface | Aircraft electrical distribution | Fixed unless identified as part of a rotating assembly. |
| Battery / ground electrical source (`electric.battery`) | interface | Aircraft electrical source | Fixed unless identified as part of a rotating assembly. |
| Engine starter (`starter`) | physical | Engine assembly | Fixed unless identified as part of a rotating assembly. |
| Starter contactor (`starter.supply`) | interface | Starting-energy interface | Fixed unless identified as part of a rotating assembly. |
| Ignition exciter (`ignition.exciter`) | physical | Engine assembly | Fixed unless identified as part of a rotating assembly. |
| Fuel pump bypass / relief (`fuel.bypass`) | physical | Engine assembly | Fixed unless identified as part of a rotating assembly. |
| Pressure relief / regulation (`oil.relief`) | physical | Engine assembly | Fixed unless identified as part of a rotating assembly. |
| Separated breather air outlet (`oil.vent`) | physical | Engine assembly | Fixed unless identified as part of a rotating assembly. |
| Starting control command (`start.command`) | interface | Command information | Fixed unless identified as part of a rotating assembly. |
| Reduction gearbox housing (`reduction.case`) | physical | Engine assembly | Fixed unless identified as part of a rotating assembly. |
| Reduction gear train (`reduction.gears`) | assembly | Engine assembly | Fixed unless identified as part of a rotating assembly. |
| Input sun gear (`reduction.sun`) | physical | Engine assembly | Rotates at input power-shaft speed. |
| Fixed internal ring (`reduction.ring`) | physical | Engine assembly | Fixed to the housing. |
| Planet gears (`reduction.planets`) | physical | Engine assembly | Spin and orbit between the input sun and fixed ring. |
| Output planet carrier (`reduction.carrier`) | physical | Engine assembly | Rotates at the declared reduced output speed. |
| Propeller pitch hub (`prop.hub`) | physical | Aircraft / driven load | Fixed unless identified as part of a rotating assembly. |
| Pitch piston & links (`pitch.piston`) | physical | Engine assembly | Piston translates with modeled pitch; rigid links rotate with the propeller and stay attached to its pitch horns. |
| Filter housing & cap (`fuel.filter.cap`) | physical | Engine assembly | Fixed unless identified as part of a rotating assembly. |
| Pleated filter element (`fuel.filter.element`) | physical | Engine assembly | Fixed unless identified as part of a rotating assembly. |
| Filter housing & cap (`oil.filter.cap`) | physical | Engine assembly | Fixed unless identified as part of a rotating assembly. |
| Pleated filter element (`oil.filter.element`) | physical | Engine assembly | Fixed unless identified as part of a rotating assembly. |
| Inner race (`bearing.front.inner`) | physical | Engine assembly | Inner race follows its supported shaft. |
| Outer race & housing (`bearing.front.outer`) | physical | Engine assembly | Outer race and support housing stay fixed. |
| Rolling elements & cage (`bearing.front.rolling`) | physical | Engine assembly | Rolling elements are a static construction view; bearing rolling kinematics are not calculated. |
| Inner race (`bearing.rear.inner`) | physical | Engine assembly | Inner race follows its supported shaft. |
| Outer race & housing (`bearing.rear.outer`) | physical | Engine assembly | Outer race and support housing stay fixed. |
| Rolling elements & cage (`bearing.rear.rolling`) | physical | Engine assembly | Rolling elements are a static construction view; bearing rolling kinematics are not calculated. |
| Inner race (`bearing.power.inner`) | physical | Engine assembly | Inner race follows its supported shaft. |
| Outer race & housing (`bearing.power.outer`) | physical | Engine assembly | Outer race and support housing stay fixed. |
| Rolling elements & cage (`bearing.power.rolling`) | physical | Engine assembly | Rolling elements are a static construction view; bearing rolling kinematics are not calculated. |
| Fuselage (`airframe.fuselage`) | physical | Aircraft / driven load | Stationary installation context. Aircraft flight is not simulated. |
| Cockpit & cabin glazing (`airframe.cockpit`) | physical | Aircraft / driven load | Stationary installation context. Aircraft flight is not simulated. |
| Tail surfaces (`airframe.tail`) | physical | Aircraft / driven load | Stationary installation context. Aircraft flight is not simulated. |
| Retracted gear doors (`airframe.landing`) | physical | Aircraft / driven load | Stationary installation context. Aircraft flight is not simulated. |
| Engine pylons & mounts (`airframe.mounts`) | physical | Aircraft / driven load | Stationary installation context. Aircraft flight is not simulated. |
| Studied engine nacelle / cowling (`airframe.nacelle`) | physical | Aircraft / driven load | Stationary installation context. Aircraft flight is not simulated. |
| Far engine · exterior context only (`airframe.companion`) | physical | Aircraft / driven load | Stationary installation context. Aircraft flight is not simulated. |

## turbofan

| Component / identity | Representation | Location / responsibility | Motion or scope |
|---|---|---|---|
| Inlet & intake duct (`inlet`) | physical | Engine assembly | Stationary unless linked to a shaft. |
| Fan rotor (`fan.rotor`) | physical | Engine assembly | Turns with N1 / LP shaft. |
| Fan outlet guide vanes (`fan.stator`) | assembly | Engine assembly | Fixed to the casing. |
| Low-pressure compressor (`lpc.rotor`) | physical | Engine assembly | Turns with N1. |
| LP compressor stators (`lpc.stator`) | physical | Engine assembly | Stationary rows fixed to casing. |
| Bypass duct & nozzle (`bypass`) | physical | Engine assembly | Stationary unless linked to a shaft. |
| High-pressure compressor (`compressor.rotor`) | assembly | Engine assembly | Turns with N2 / HP shaft. |
| Compressor stators (`compressor.stator`) | assembly | Engine assembly | Fixed; optional variable geometry is explained separately. |
| Compressor outer casing (`compressor.casing`) | physical | Engine assembly | Stationary pressure boundary; separate from blade rows. |
| Diffuser (`diffuser`) | physical | Engine assembly | Stationary unless linked to a shaft. |
| Combustor outer casing (`combustor.casing`) | physical | Engine assembly | Stationary unless linked to a shaft. |
| Combustor liner (`combustor.liner`) | physical | Engine assembly | Stationary unless linked to a shaft. |
| Fuel manifold & injectors (`fuel.nozzles`) | physical | Engine assembly | Stationary unless linked to a shaft. |
| Igniter (`igniter`) | physical | Engine assembly | Stationary unless linked to a shaft. |
| Turbine nozzle guide vanes (`turbine.vanes`) | assembly | Engine assembly | Fixed to the turbine structure. |
| Turbine outer casing (`turbine.casing`) | physical | Engine assembly | Stationary casing; rotor and vane assemblies remain in place. |
| High-pressure turbine (`gg.rotor`) | assembly | Engine assembly | Turns with N2. |
| Low-pressure turbine (`power.rotor`) | assembly | Engine assembly | Turns with N1. |
| Core exhaust & nozzle (`exhaust`) | physical | Engine assembly | Stationary unless linked to a shaft. |
| HP shaft · N2 (`hp.shaft`) | physical | Engine assembly | N2, independently integrated. |
| LP shaft · N1 (`lp.shaft`) | physical | Engine assembly | N1, independent of N2. |
| Shaft bearings & supports (`bearings`) | assembly | Engine assembly | Outer supports fixed; rolling elements not resolved. |
| Jet-aircraft installation (`airframe`) | physical | Aircraft / driven load | Stationary unless linked to a shaft. |
| Wing, pylon & flight-control context (`wing`) | physical | Aircraft / driven load | Stationary unless linked to a shaft. |
| Engine controller / FADEC (`controller`) | physical | Engine assembly | Stationary unless linked to a shaft. |
| Fuel supply & pump (`fuel.pump`) | physical | Engine assembly | Stationary unless linked to a shaft. |
| Fuel metering unit (`fmu`) | physical | Engine assembly | Stationary unless linked to a shaft. |
| N2 / HP speed pickup (`speed.g`) | physical | Engine assembly | Stationary unless linked to a shaft. |
| N1 / LP speed pickup (`speed.p`) | physical | Engine assembly | Stationary unless linked to a shaft. |
| Gas-path temperature probe (`temperature`) | physical | Engine assembly | Stationary unless linked to a shaft. |
| Compressor-delivery pressure pickup (`pressure`) | physical | Engine assembly | Stationary unless linked to a shaft. |
| Inlet temperature & pressure probes (`inlet.sensor`) | physical | Engine assembly | Stationary unless linked to a shaft. |
| Metering position / flow feedback (`fmu.position`) | physical | Engine assembly | Stationary unless linked to a shaft. |
| Output torque sensing / estimate (`torque`) | physical | Engine assembly | Stationary unless linked to a shaft. |
| Pilot power / thrust request (`demand`) | interface | Pilot / aircraft command | Stationary unless linked to a shaft. |
| Aircraft air-data interface (`airdata`) | interface | Aircraft information | Stationary unless linked to a shaft. |
| Accessory generator & electrical bus (`electrical`) | physical | Engine assembly | Stationary unless linked to a shaft. |
| Accessory gearbox & extraction (`accessory`) | physical | Engine assembly | Stationary unless linked to a shaft. |
| Oil supply & temperature monitoring (`oil`) | assembly | Engine assembly | Stationary unless linked to a shaft. |
| Vibration pickup & monitor (`vibration`) | physical | Engine assembly | Stationary unless linked to a shaft. |
| Chip / debris indication (`chip`) | physical | Engine assembly | Stationary unless linked to a shaft. |
| Bleed & variable-geometry interface (`bleed`) | physical | Engine assembly | Stationary unless linked to a shaft. |
| Controller channels & availability (`channels`) | interface | Optional control architecture | Stationary unless linked to a shaft. |
| Cockpit indications & monitoring (`cockpit`) | interface | Aircraft indication | Stationary unless linked to a shaft. |
| Fuel supply circuit (`fuel.system`) | assembly | Engine assembly | Fixed unless identified as part of a rotating assembly. |
| Stage 1 · rotor blades (`compressor.stage.1.rotor`) | assembly | Engine assembly | Rotates with the gas-generator / HP shaft. |
| Stage 1 · rotor disc (`compressor.stage.1.disc`) | physical | Engine assembly | Rigidly attached to its rotor row. |
| Stage 1 · stator vanes (`compressor.stage.1.stator`) | physical | Engine assembly | Stationary; fixed to the casing. |
| Stage 2 · rotor blades (`compressor.stage.2.rotor`) | assembly | Engine assembly | Rotates with the gas-generator / HP shaft. |
| Stage 2 · rotor disc (`compressor.stage.2.disc`) | physical | Engine assembly | Rigidly attached to its rotor row. |
| Stage 2 · stator vanes (`compressor.stage.2.stator`) | physical | Engine assembly | Stationary; fixed to the casing. |
| Stage 3 · rotor blades (`compressor.stage.3.rotor`) | assembly | Engine assembly | Rotates with the gas-generator / HP shaft. |
| Stage 3 · rotor disc (`compressor.stage.3.disc`) | physical | Engine assembly | Rigidly attached to its rotor row. |
| Compressor support frame (`compressor.frame`) | physical | Engine assembly | Fixed unless identified as part of a rotating assembly. |
| Combustor dome (`combustor.dome`) | physical | Engine assembly | Fixed unless identified as part of a rotating assembly. |
| Injector swirlers (`combustor.swirlers`) | physical | Engine assembly | Fixed unless identified as part of a rotating assembly. |
| Primary air admission (`combustor.primary`) | physical | Engine assembly | Fixed unless identified as part of a rotating assembly. |
| Dilution air ports (`combustor.dilution`) | physical | Engine assembly | Fixed unless identified as part of a rotating assembly. |
| Liner cooling passages (`combustor.cooling`) | physical | Engine assembly | Fixed unless identified as part of a rotating assembly. |
| Annular fuel manifold (`injector.manifold`) | physical | Engine assembly | Fixed unless identified as part of a rotating assembly. |
| Fuel injector tips (`injector.tip`) | physical | Engine assembly | Fixed unless identified as part of a rotating assembly. |
| Gas-generator / HP turbine disc (`turbine.hpt.disc`) | physical | Engine assembly | Rigidly attached to its turbine rotor. |
| Power / LP turbine disc 1 (`turbine.lpt.disc.1`) | physical | Engine assembly | Rigidly attached to its turbine rotor. |
| Power / LP turbine disc 2 (`turbine.lpt.disc.2`) | physical | Engine assembly | Rigidly attached to its turbine rotor. |
| Gas-generator / HP nozzle guide vanes (`turbine.ngv.hpt`) | physical | Engine assembly | Fixed unless identified as part of a rotating assembly. |
| Power / LP nozzle guide vanes (`turbine.ngv.lpt`) | physical | Engine assembly | Fixed unless identified as part of a rotating assembly. |
| Turbine exit frame (`turbine.frame`) | physical | Engine assembly | Fixed unless identified as part of a rotating assembly. |
| Gas-generator front bearing (`bearing.front`) | assembly | Engine assembly | Fixed unless identified as part of a rotating assembly. |
| Gas-generator rear bearing (`bearing.rear`) | assembly | Engine assembly | Fixed unless identified as part of a rotating assembly. |
| Power-shaft bearing (`bearing.power`) | assembly | Engine assembly | Fixed unless identified as part of a rotating assembly. |
| Compressor bearing labyrinth seal (`seal.front`) | physical | Engine assembly | Fixed unless identified as part of a rotating assembly. |
| Hot-section bearing labyrinth seal (`seal.hot`) | physical | Engine assembly | Fixed unless identified as part of a rotating assembly. |
| Aircraft fuel supply (`fuel.tank`) | interface | Aircraft fuel supply | Fixed unless identified as part of a rotating assembly. |
| Supply boost pump (`fuel.boost`) | interface | Aircraft fuel feed | Fixed unless identified as part of a rotating assembly. |
| Fuel filter & element (`fuel.filter`) | assembly | Engine assembly | Fixed unless identified as part of a rotating assembly. |
| Fuel shutoff valve (`fuel.shutoff`) | physical | Engine assembly | Fixed unless identified as part of a rotating assembly. |
| Dry-sump oil reservoir (`oil.tank`) | physical | Engine assembly | Fixed unless identified as part of a rotating assembly. |
| Pressure oil pump (`oil.pressure`) | physical | Engine assembly | Fixed unless identified as part of a rotating assembly. |
| Oil filter & element (`oil.filter`) | assembly | Engine assembly | Fixed unless identified as part of a rotating assembly. |
| Scavenge pump (`oil.scavenge`) | physical | Engine assembly | Fixed unless identified as part of a rotating assembly. |
| Oil cooler (`oil.cooler`) | physical | Engine assembly | Fixed unless identified as part of a rotating assembly. |
| Breather & air/oil separator (`oil.breather`) | physical | Engine assembly | Fixed unless identified as part of a rotating assembly. |
| Aircraft electrical bus (`electric.bus`) | interface | Aircraft electrical distribution | Fixed unless identified as part of a rotating assembly. |
| Battery / ground electrical source (`electric.battery`) | interface | Aircraft electrical source | Fixed unless identified as part of a rotating assembly. |
| Engine starter (`starter`) | assembly | Engine assembly | Fixed unless identified as part of a rotating assembly. |
| APU / ground starting air (`starter.supply`) | interface | Starting-energy interface | Fixed unless identified as part of a rotating assembly. |
| Ignition exciter (`ignition.exciter`) | physical | Engine assembly | Fixed unless identified as part of a rotating assembly. |
| Fuel pump bypass / relief (`fuel.bypass`) | physical | Engine assembly | Fixed unless identified as part of a rotating assembly. |
| Pressure relief / regulation (`oil.relief`) | physical | Engine assembly | Fixed unless identified as part of a rotating assembly. |
| Separated breather air outlet (`oil.vent`) | physical | Engine assembly | Fixed unless identified as part of a rotating assembly. |
| Starting control command (`start.command`) | interface | Command information | Fixed unless identified as part of a rotating assembly. |
| Pneumatic starter control valve (`starter.valve`) | physical | Engine assembly | Fixed unless identified as part of a rotating assembly. |
| Fan case & outlet support (`fan.frame`) | physical | Engine assembly | Fixed unless identified as part of a rotating assembly. |
| Filter housing & cap (`fuel.filter.cap`) | physical | Engine assembly | Fixed unless identified as part of a rotating assembly. |
| Pleated filter element (`fuel.filter.element`) | physical | Engine assembly | Fixed unless identified as part of a rotating assembly. |
| Filter housing & cap (`oil.filter.cap`) | physical | Engine assembly | Fixed unless identified as part of a rotating assembly. |
| Pleated filter element (`oil.filter.element`) | physical | Engine assembly | Fixed unless identified as part of a rotating assembly. |
| Inner race (`bearing.front.inner`) | physical | Engine assembly | Inner race follows its supported shaft. |
| Outer race & housing (`bearing.front.outer`) | physical | Engine assembly | Outer race and support housing stay fixed. |
| Rolling elements & cage (`bearing.front.rolling`) | physical | Engine assembly | Rolling elements are a static construction view; bearing rolling kinematics are not calculated. |
| Inner race (`bearing.rear.inner`) | physical | Engine assembly | Inner race follows its supported shaft. |
| Outer race & housing (`bearing.rear.outer`) | physical | Engine assembly | Outer race and support housing stay fixed. |
| Rolling elements & cage (`bearing.rear.rolling`) | physical | Engine assembly | Rolling elements are a static construction view; bearing rolling kinematics are not calculated. |
| Inner race (`bearing.power.inner`) | physical | Engine assembly | Inner race follows its supported shaft. |
| Outer race & housing (`bearing.power.outer`) | physical | Engine assembly | Outer race and support housing stay fixed. |
| Rolling elements & cage (`bearing.power.rolling`) | physical | Engine assembly | Rolling elements are a static construction view; bearing rolling kinematics are not calculated. |
| Fuselage (`airframe.fuselage`) | physical | Aircraft / driven load | Stationary installation context. Aircraft flight is not simulated. |
| Cockpit & cabin glazing (`airframe.cockpit`) | physical | Aircraft / driven load | Stationary installation context. Aircraft flight is not simulated. |
| Tail surfaces (`airframe.tail`) | physical | Aircraft / driven load | Stationary installation context. Aircraft flight is not simulated. |
| Retracted gear doors (`airframe.landing`) | physical | Aircraft / driven load | Stationary installation context. Aircraft flight is not simulated. |
| Engine pylons & mounts (`airframe.mounts`) | physical | Aircraft / driven load | Stationary installation context. Aircraft flight is not simulated. |
| Studied engine nacelle / cowling (`airframe.nacelle`) | physical | Aircraft / driven load | Stationary installation context. Aircraft flight is not simulated. |
| Far engine · exterior context only (`airframe.companion`) | physical | Aircraft / driven load | Stationary installation context. Aircraft flight is not simulated. |
