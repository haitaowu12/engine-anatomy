# Engine components and connections

Follow each component through the three engine examples. The tables identify its assembly, the quantities it receives or sends, and its source. Calculated responses, prescribed inputs and anatomy explanations are labeled so you can connect the displayed readings with the hardware.

## helicopter

### Component concepts and instances

| Component | Stable concept | Architecture instance | Parent component / system | Inspection recipe |
|---|---|---|---|---|
| Inlet & intake duct | inlet | helicopter:inlet | Root / Intake & exhaust | engine |
| Compressor rotors | compressor.rotor | helicopter:compressor.rotor | Root / Compressor assembly | compressor |
| Compressor stators | compressor.stator | helicopter:compressor.stator | Root / Compressor assembly | compressor |
| Compressor outer casing | compressor.casing | helicopter:compressor.casing | Root / Compressor assembly | compressor |
| Diffuser | diffuser | helicopter:diffuser | Root / Compressor assembly | engine |
| Combustor outer casing | combustor.casing | helicopter:combustor.casing | Root / Combustion assembly | combustor |
| Combustor liner | combustor.liner | helicopter:combustor.liner | Root / Combustion assembly | combustor |
| Fuel manifold & injectors | fuel.nozzles | helicopter:fuel.nozzles | Root / Combustion assembly | combustor |
| Igniter | igniter | helicopter:igniter | Root / Combustion assembly | combustor |
| Turbine nozzle guide vanes | turbine.vanes | helicopter:turbine.vanes | Root / Turbine assemblies | turbine |
| Turbine outer casing | turbine.casing | helicopter:turbine.casing | Root / Turbine assemblies | turbine |
| Gas-generator turbine rotor | gg.rotor | helicopter:gg.rotor | Root / Turbine assemblies | turbine |
| Free power-turbine rotors | power.rotor | helicopter:power.rotor | Root / Turbine assemblies | turbine |
| Side exhaust ducts & collector | exhaust | helicopter:exhaust | Root / Intake & exhaust | engine |
| Gas-generator shaft · Ng | gg.shaft | helicopter:gg.shaft | Root / Independent shaft assemblies | engine |
| Power shaft · Np | power.shaft | helicopter:power.shaft | Root / Independent shaft assemblies | engine |
| Shaft bearings & supports | bearings | helicopter:bearings | Root / Independent shaft assemblies | support |
| Transmission input & freewheel | reduction | helicopter:reduction | Root / Output transmission | output |
| Main transmission & rotor mast | mast | helicopter:mast | Root / Output transmission | output |
| Tail-drive shaft & gearbox | tail.drive | helicopter:tail.drive | Root / Output transmission | output |
| Main rotor & blade pitch | rotor | helicopter:rotor | Root / Driven aerodynamic surfaces | output |
| Tail rotor | tail.rotor | helicopter:tail.rotor | Root / Driven aerodynamic surfaces | output |
| Collective & swashplate context | pitch.control | helicopter:pitch.control | Root / Structure & flight controls | output |
| Helicopter installation | airframe | helicopter:airframe | Root / Structure & flight controls | engine |
| Engine controller / FADEC | controller | helicopter:controller | Root / Control computation | engine |
| Fuel supply & pump | fuel.pump | helicopter:fuel.pump | Root / Actuators & fuel supply | fuel |
| Fuel metering unit | fmu | helicopter:fmu | Root / Actuators & fuel supply | fuel |
| Ng speed pickup | speed.g | helicopter:speed.g | Root / Sensing & feedback | engine |
| Np power-shaft speed pickup | speed.p | helicopter:speed.p | Root / Sensing & feedback | engine |
| Nr / main-rotor speed pickup | load.speed | helicopter:load.speed | Root / Sensing & feedback | engine |
| Gas-path temperature probe | temperature | helicopter:temperature | Root / Sensing & feedback | engine |
| Compressor-delivery pressure pickup | pressure | helicopter:pressure | Root / Sensing & feedback | engine |
| Inlet temperature & pressure probes | inlet.sensor | helicopter:inlet.sensor | Root / Sensing & feedback | engine |
| Metering position / flow feedback | fmu.position | helicopter:fmu.position | Root / Sensing & feedback | fuel |
| Output torque sensing / estimate | torque | helicopter:torque | Root / Sensing & feedback | engine |
| Pilot rotor demand | demand | helicopter:demand | Root / Pilot reference | engine |
| Aircraft air-data interface | airdata | helicopter:airdata | Root / Sensing & feedback | engine |
| Accessory generator & electrical bus | electrical | helicopter:electrical | Root / Service energy & extraction | start |
| Accessory gearbox & extraction | accessory | helicopter:accessory | Root / Service energy & extraction | engine |
| Oil supply & temperature monitoring | oil | helicopter:oil | Root / Health & indication | oil |
| Vibration pickup & monitor | vibration | helicopter:vibration | Root / Health & indication | engine |
| Chip / debris indication | chip | helicopter:chip | Root / Health & indication | oil |
| Bleed & variable-geometry interface | bleed | helicopter:bleed | Root / Service energy & extraction | engine |
| Controller channels & availability | channels | helicopter:channels | Root / Availability concepts | engine |
| Cockpit indications & monitoring | cockpit | helicopter:cockpit | Root / Health & indication | engine |
| Fuel supply circuit | fuel.system | helicopter:fuel.system | Root / Fuel circuit | fuel |
| Stage 1 · rotor blades | compressor.stage.1.rotor | helicopter:compressor.stage.1.rotor | compressor.rotor | compressor |
| Stage 1 · rotor disc | compressor.stage.1.disc | helicopter:compressor.stage.1.disc | compressor.stage.1.rotor | compressor |
| Stage 1 · stator vanes | compressor.stage.1.stator | helicopter:compressor.stage.1.stator | compressor.stator | compressor |
| Stage 2 · rotor blades | compressor.stage.2.rotor | helicopter:compressor.stage.2.rotor | compressor.rotor | compressor |
| Stage 2 · rotor disc | compressor.stage.2.disc | helicopter:compressor.stage.2.disc | compressor.stage.2.rotor | compressor |
| Stage 2 · stator vanes | compressor.stage.2.stator | helicopter:compressor.stage.2.stator | compressor.stator | compressor |
| Stage 3 · rotor blades | compressor.stage.3.rotor | helicopter:compressor.stage.3.rotor | compressor.rotor | compressor |
| Stage 3 · rotor disc | compressor.stage.3.disc | helicopter:compressor.stage.3.disc | compressor.stage.3.rotor | compressor |
| Stage 3 · stator vanes | compressor.stage.3.stator | helicopter:compressor.stage.3.stator | compressor.stator | compressor |
| Stage 4 · rotor blades | compressor.stage.4.rotor | helicopter:compressor.stage.4.rotor | compressor.rotor | compressor |
| Stage 4 · rotor disc | compressor.stage.4.disc | helicopter:compressor.stage.4.disc | compressor.stage.4.rotor | compressor |
| Stage 4 · stator vanes | compressor.stage.4.stator | helicopter:compressor.stage.4.stator | compressor.stator | compressor |
| Stage 5 · rotor blades | compressor.stage.5.rotor | helicopter:compressor.stage.5.rotor | compressor.rotor | compressor |
| Stage 5 · rotor disc | compressor.stage.5.disc | helicopter:compressor.stage.5.disc | compressor.stage.5.rotor | compressor |
| Compressor support frame | compressor.frame | helicopter:compressor.frame | compressor.casing | compressor |
| Combustor dome | combustor.dome | helicopter:combustor.dome | combustor.liner | combustor |
| Injector swirlers | combustor.swirlers | helicopter:combustor.swirlers | fuel.nozzles | combustor |
| Primary air admission | combustor.primary | helicopter:combustor.primary | combustor.liner | combustor |
| Dilution air ports | combustor.dilution | helicopter:combustor.dilution | combustor.liner | combustor |
| Liner cooling passages | combustor.cooling | helicopter:combustor.cooling | combustor.liner | combustor |
| Annular fuel manifold | injector.manifold | helicopter:injector.manifold | fuel.nozzles | combustor |
| Fuel injector tips | injector.tip | helicopter:injector.tip | fuel.nozzles | combustor |
| Gas-generator / HP turbine disc | turbine.hpt.disc | helicopter:turbine.hpt.disc | gg.rotor | turbine |
| Power / LP turbine disc 1 | turbine.lpt.disc.1 | helicopter:turbine.lpt.disc.1 | power.rotor | turbine |
| Power / LP turbine disc 2 | turbine.lpt.disc.2 | helicopter:turbine.lpt.disc.2 | power.rotor | turbine |
| Gas-generator / HP nozzle guide vanes | turbine.ngv.hpt | helicopter:turbine.ngv.hpt | turbine.vanes | turbine |
| Power / LP nozzle guide vanes | turbine.ngv.lpt | helicopter:turbine.ngv.lpt | turbine.vanes | turbine |
| Turbine exit frame | turbine.frame | helicopter:turbine.frame | turbine.casing | turbine |
| Gas-generator front bearing | bearing.front | helicopter:bearing.front | bearings | support |
| Gas-generator rear bearing | bearing.rear | helicopter:bearing.rear | bearings | support |
| Power-shaft bearing | bearing.power | helicopter:bearing.power | bearings | support |
| Compressor bearing labyrinth seal | seal.front | helicopter:seal.front | bearings | support |
| Hot-section bearing labyrinth seal | seal.hot | helicopter:seal.hot | bearings | support |
| Aircraft fuel supply | fuel.tank | helicopter:fuel.tank | fuel.system | fuel |
| Supply boost pump | fuel.boost | helicopter:fuel.boost | fuel.system | fuel |
| Fuel filter & element | fuel.filter | helicopter:fuel.filter | fuel.system | fuel |
| Fuel shutoff valve | fuel.shutoff | helicopter:fuel.shutoff | fuel.system | fuel |
| Dry-sump oil reservoir | oil.tank | helicopter:oil.tank | oil | oil |
| Pressure oil pump | oil.pressure | helicopter:oil.pressure | oil | oil |
| Oil filter & element | oil.filter | helicopter:oil.filter | oil | oil |
| Scavenge pump | oil.scavenge | helicopter:oil.scavenge | oil | oil |
| Oil cooler | oil.cooler | helicopter:oil.cooler | oil | oil |
| Breather & air/oil separator | oil.breather | helicopter:oil.breather | oil | oil |
| Aircraft electrical bus | electric.bus | helicopter:electric.bus | electrical | engine |
| Battery / ground electrical source | electric.battery | helicopter:electric.battery | electrical | start |
| Engine starter | starter | helicopter:starter | accessory | start |
| Starter contactor | starter.supply | helicopter:starter.supply | electrical | start |
| Ignition exciter | ignition.exciter | helicopter:ignition.exciter | electrical | start |
| Fuel pump bypass / relief | fuel.bypass | helicopter:fuel.bypass | fuel.system | fuel |
| Pressure relief / regulation | oil.relief | helicopter:oil.relief | oil | oil |
| Separated breather air outlet | oil.vent | helicopter:oil.vent | oil | oil |
| Starting control command | start.command | helicopter:start.command | electrical | engine |
| Reduction gearbox housing | reduction.case | helicopter:reduction.case | reduction | output |
| Reduction gear train | reduction.gears | helicopter:reduction.gears | reduction | output |
| Input sun gear | reduction.sun | helicopter:reduction.sun | reduction.gears | output |
| Fixed internal ring | reduction.ring | helicopter:reduction.ring | reduction.gears | output |
| Planet gears | reduction.planets | helicopter:reduction.planets | reduction.gears | output |
| Output planet carrier | reduction.carrier | helicopter:reduction.carrier | reduction.gears | output |
| Overrunning freewheel | freewheel | helicopter:freewheel | reduction | output |
| Collective swashplate & pitch links | swashplate | helicopter:swashplate | pitch.control | engine |
| Tail rotor right-angle gearbox | tail.gearbox | helicopter:tail.gearbox | tail.drive | output |
| Tail-drive speed increase | tail.stepup | helicopter:tail.stepup | tail.drive | output |
| Filter housing & cap | fuel.filter.cap | helicopter:fuel.filter.cap | fuel.filter | fuel |
| Pleated filter element | fuel.filter.element | helicopter:fuel.filter.element | fuel.filter | fuel |
| Filter housing & cap | oil.filter.cap | helicopter:oil.filter.cap | oil.filter | oil |
| Pleated filter element | oil.filter.element | helicopter:oil.filter.element | oil.filter | oil |
| Inner race | bearing.front.inner | helicopter:bearing.front.inner | bearing.front | support |
| Outer race & housing | bearing.front.outer | helicopter:bearing.front.outer | bearing.front | support |
| Rolling elements & cage | bearing.front.rolling | helicopter:bearing.front.rolling | bearing.front | support |
| Inner race | bearing.rear.inner | helicopter:bearing.rear.inner | bearing.rear | support |
| Outer race & housing | bearing.rear.outer | helicopter:bearing.rear.outer | bearing.rear | support |
| Rolling elements & cage | bearing.rear.rolling | helicopter:bearing.rear.rolling | bearing.rear | support |
| Inner race | bearing.power.inner | helicopter:bearing.power.inner | bearing.power | support |
| Outer race & housing | bearing.power.outer | helicopter:bearing.power.outer | bearing.power | support |
| Rolling elements & cage | bearing.power.rolling | helicopter:bearing.power.rolling | bearing.power | support |
| Cabin & tail boom | airframe.fuselage | helicopter:airframe.fuselage | airframe | null |
| Cockpit & cabin glazing | airframe.cockpit | helicopter:airframe.cockpit | airframe | null |
| Tail surfaces | airframe.tail | helicopter:airframe.tail | airframe | null |
| Landing skids | airframe.landing | helicopter:airframe.landing | airframe | null |
| Engine deck & mounts | airframe.mounts | helicopter:airframe.mounts | airframe | null |
| Studied engine nacelle / cowling | airframe.nacelle | helicopter:airframe.nacelle | airframe | null |

### Control, sensors & actuators

| Interface | Quantity / units | Origin → destination | Role | Nature and scope | Public basis |
|---|---|---|---|---|---|
| Engine controller / FADEC | Reference → error → raw fuel → limited command  / fraction / kg/s | Ng speed pickup → Engine controller / FADEC (signal; simulated)<br>Np power-shaft speed pickup → Engine controller / FADEC (signal; simulated)<br>Compressor-delivery pressure pickup → Engine controller / FADEC (signal; explained)<br>Inlet temperature & pressure probes → Engine controller / FADEC (signal; explained)<br>Engine controller / FADEC → Fuel metering unit (actuation; simulated)<br>Accessory generator & electrical bus → Engine controller / FADEC (electrical; explained)<br>Controller channels & availability → Engine controller / FADEC (signal; explained)<br>Aircraft air-data interface → Engine controller / FADEC (signal; explained)<br>Engine controller / FADEC → Cockpit indications & monitoring (signal; simulated)<br>Bleed & variable-geometry interface → Engine controller / FADEC (signal; explained) | Control and illustrative protection | Original synthetic control law; Simulated PI + anti-windup and limits | [NASA · TM-20210014065](https://ntrs.nasa.gov/api/citations/20210014065/downloads/TM-20210014065.pdf?attachment=true) |
| Fuel supply & pump | —  | Fuel supply & pump → Fuel metering unit (fuel; explained)<br>Fuel supply & pump → Fuel pump bypass / relief (fuel; explained)<br>Fuel pump bypass / relief → Fuel supply & pump (fuel; explained)<br>Fuel shutoff valve → Fuel supply & pump (fuel; explained) | Fuel energy supply | —; Explained service; pressure prescribed adequate | [FAA · AMT Powerplant, chapter 2](https://www.faa.gov/sites/faa.gov/files/04_amtp_ch2.pdf) |
| Fuel metering unit | Commanded / actual fuel flow  / kg/s | Engine controller / FADEC → Fuel metering unit (actuation; simulated)<br>Fuel supply & pump → Fuel metering unit (fuel; explained)<br>Fuel metering unit → Fuel manifold & injectors (fuel; simulated)<br>Fuel metering unit → Metering position / flow feedback (signal; explained)<br>Metering position / flow feedback → Fuel metering unit (signal; explained)<br>Accessory generator & electrical bus → Fuel metering unit (electrical; explained)<br>Fuel metering unit → Annular fuel manifold (fuel; explained) | Fuel actuation | Simulated command and lagged actuator state; Simulated first-order metering response | [FAA · AMT Powerplant, chapter 2](https://www.faa.gov/sites/faa.gov/files/04_amtp_ch2.pdf) |
| Ng speed pickup | Ng relative speed  / % | Gas-generator shaft · Ng → Ng speed pickup (signal; simulated)<br>Ng speed pickup → Engine controller / FADEC (signal; simulated) | Ng speed input / example speed limit | Ideal simulated measurement; Simulated ideal pickup | [FAA · AMT Powerplant, chapter 2](https://www.faa.gov/sites/faa.gov/files/04_amtp_ch2.pdf) |
| Np power-shaft speed pickup | Np relative speed  / % | Power shaft · Np → Np power-shaft speed pickup (signal; simulated)<br>Np power-shaft speed pickup → Engine controller / FADEC (signal; simulated) | Governing speed feedback | Ideal simulated measurement; Simulated ideal pickup | [FAA · AMT Powerplant, chapter 2](https://www.faa.gov/sites/faa.gov/files/04_amtp_ch2.pdf) |
| Nr / main-rotor speed pickup | Main-rotor speed Nr  / rad/s and rpm | Main rotor & blade pitch → Nr / main-rotor speed pickup (signal; simulated)<br>Nr / main-rotor speed pickup → Cockpit indications & monitoring (signal; simulated) | Rotor-speed monitoring | Ideal post-reduction pickup; rigid gearing assumed; Ideal simulated geared speed | [FAA · Helicopter Flying Handbook, chapter 4](https://www.faa.gov/sites/faa.gov/files/regulations_policies/handbooks_manuals/aviation/helicopter_flying_handbook/hfh_ch04.pdf) |
| Gas-path temperature probe | Post-gas-generator gas temperature  / K | Gas-generator turbine rotor → Gas-path temperature probe (signal; simulated)<br>Gas-path temperature probe → Cockpit indications & monitoring (signal; simulated) | Monitoring in this model; protection configuration dependent | Simulated probe with 0.5 s lag; Simulated probe; not used by this synthetic PI loop | [NASA Glenn · Engine station numbering](https://www.grc.nasa.gov/www/k-12/airplane/turbdraw.html) |
| Compressor-delivery pressure pickup | Compressor-delivery total pressure  / kPa | Diffuser → Compressor-delivery pressure pickup (signal; simulated)<br>Compressor-delivery pressure pickup → Engine controller / FADEC (signal; explained) | Available scheduling / monitor input; not active PI feedback | Ideal model-derived measurement; Displayed; no pressure-sensor dynamics | [FAA · AMT Powerplant, chapter 2](https://www.faa.gov/sites/faa.gov/files/04_amtp_ch2.pdf) |
| Inlet temperature & pressure probes | Inlet total T / P  / K / kPa | Inlet & intake duct → Inlet temperature & pressure probes (signal; simulated)<br>Inlet temperature & pressure probes → Engine controller / FADEC (signal; explained) | Environment / scheduling context | Prescribed ideal measurements; Boundary values; no sensor dynamics | [NASA Glenn · Engine station numbering](https://www.grc.nasa.gov/www/k-12/airplane/turbdraw.html) |
| Metering position / flow feedback | Equivalent metering opening  / % | Fuel metering unit → Metering position / flow feedback (signal; explained)<br>Metering position / flow feedback → Fuel metering unit (signal; explained) | Local actuator feedback context | Inferred, not independently sensed; Inferred display only; no separate position servo | [FAA · AMT Powerplant, chapter 2](https://www.faa.gov/sites/faa.gov/files/04_amtp_ch2.pdf) |
| Output torque sensing / estimate | Turbine-side output torque  / N·m | Power shaft · Np → Output torque sensing / estimate (signal; simulated)<br>Output torque sensing / estimate → Cockpit indications & monitoring (signal; simulated) | Indication; not active fuel-loop feedback | Calculated estimate; Simulated estimate | [FAA · Transition to Turbopropeller-Powered Airplanes](https://www.faa.gov/sites/faa.gov/files/regulations_policies/handbooks_manuals/aviation/airplane_handbook/16_afh_ch15.pdf) |
| Pilot rotor demand | Collective-equivalent setting  / % | Pilot rotor demand → Collective & swashplate context (signal; simulated) | Pilot command | Prescribed command; Synthetic demand mapping | [FAA · Helicopter Flight Controls, chapter 3](https://www.faa.gov/sites/faa.gov/files/regulations_policies/handbooks_manuals/aviation/helicopter_flying_handbook/hfh_ch03.pdf#page=2) |
| Aircraft air-data interface | Prescribed forward airspeed  / m/s | Aircraft air-data interface → Engine controller / FADEC (signal; explained) | Environment / optional scheduling interface | Prescribed, not closed-loop flight data; Boundary estimate only | [NASA Glenn · Four forces](https://www1.grc.nasa.gov/beginners-guide-to-aeronautics/four-forces-on-an-airplane/) |

### Services, monitoring & channels

| Interface | Quantity / units | Origin → destination | Role | Nature and scope | Public basis |
|---|---|---|---|---|---|
| Accessory generator & electrical bus | Supply status  | Accessory gearbox & extraction → Accessory generator & electrical bus (mechanical; simulated)<br>Accessory generator & electrical bus → Engine controller / FADEC (electrical; explained)<br>Accessory generator & electrical bus → Fuel metering unit (electrical; explained)<br>Accessory generator & electrical bus → Cockpit indications & monitoring (electrical; explained) | Electrical energy supply | Assumed available; Component anatomy | [FAA · Helicopter Flying Handbook, chapter 4](https://www.faa.gov/sites/faa.gov/files/regulations_policies/handbooks_manuals/aviation/helicopter_flying_handbook/hfh_ch04.pdf) |
| Accessory gearbox & extraction | —  | Gas-generator shaft · Ng → Accessory gearbox & extraction (mechanical; simulated)<br>Accessory gearbox & extraction → Accessory generator & electrical bus (mechanical; simulated)<br>Engine starter → Accessory gearbox & extraction (mechanical; explained)<br>Accessory gearbox & extraction → Gas-generator turbine rotor (mechanical; explained) | Mechanical extraction | —; Simulated aggregate power draw | [FAA · AMT Powerplant, chapter 1](https://www.faa.gov/sites/faa.gov/files/03_amtp_ch1.pdf) |
| Oil supply & temperature monitoring | —  | Oil supply & temperature monitoring → Shaft bearings & supports (service; explained)<br>Oil supply & temperature monitoring → Cockpit indications & monitoring (signal; explained) | Service and health monitoring | Not numerically simulated; Component anatomy | [FAA · AMT Powerplant, chapter 1](https://www.faa.gov/sites/faa.gov/files/03_amtp_ch1.pdf) |
| Vibration pickup & monitor | Vibration health data  | Vibration pickup & monitor → Cockpit indications & monitoring (signal; explained) | Monitoring only in this configuration | Explained, not synthesized; Component anatomy | [FAA · G-OBME accident lessons](https://www.faa.gov/lessons_learned/transport_airplane/accidents/G-OBME) |
| Chip / debris indication | —  | Chip / debris indication → Cockpit indications & monitoring (signal; explained) | Health indication, configuration dependent | Not simulated; Component anatomy | [FAA · AMT Powerplant, chapter 1](https://www.faa.gov/sites/faa.gov/files/03_amtp_ch1.pdf) |
| Bleed & variable-geometry interface | Optional valve / vane position and bleed demand  | Bleed & variable-geometry interface → Engine controller / FADEC (signal; explained) | Configuration-dependent control / service | Explained optional feature; Component anatomy | [FAA · AMT Powerplant, chapter 2](https://www.faa.gov/sites/faa.gov/files/04_amtp_ch2.pdf) |
| Controller channels & availability | —  | Controller channels & availability → Engine controller / FADEC (signal; explained) | Representative availability / fault concept | Explained, no injected fault logic; Component anatomy | [FAA · AMT Powerplant, chapter 2](https://www.faa.gov/sites/faa.gov/files/04_amtp_ch2.pdf) |
| Cockpit indications & monitoring | —  | Nr / main-rotor speed pickup → Cockpit indications & monitoring (signal; simulated)<br>Gas-path temperature probe → Cockpit indications & monitoring (signal; simulated)<br>Output torque sensing / estimate → Cockpit indications & monitoring (signal; simulated)<br>Accessory generator & electrical bus → Cockpit indications & monitoring (electrical; explained)<br>Oil supply & temperature monitoring → Cockpit indications & monitoring (signal; explained)<br>Vibration pickup & monitor → Cockpit indications & monitoring (signal; explained)<br>Chip / debris indication → Cockpit indications & monitoring (signal; explained)<br>Engine controller / FADEC → Cockpit indications & monitoring (signal; simulated) | Monitoring and pilot interface | Model-derived indications; Component anatomy | [FAA · AMT Powerplant, chapter 2](https://www.faa.gov/sites/faa.gov/files/04_amtp_ch2.pdf) |
| Fuel supply circuit | —  | — | — | —; Component anatomy | [FAA · AMT Powerplant, chapter 2](https://www.faa.gov/sites/faa.gov/files/04_amtp_ch2.pdf) |
| Aircraft fuel supply | —  | Aircraft fuel supply → Supply boost pump (fuel; explained) | — | —; Component anatomy | [FAA · AMT Powerplant, chapter 2](https://www.faa.gov/sites/faa.gov/files/04_amtp_ch2.pdf) |
| Supply boost pump | —  | Aircraft fuel supply → Supply boost pump (fuel; explained)<br>Supply boost pump → Fuel filter & element (fuel; explained) | — | —; Component anatomy | [FAA · AMT Powerplant, chapter 2](https://www.faa.gov/sites/faa.gov/files/04_amtp_ch2.pdf) |
| Fuel filter & element | —  | Supply boost pump → Fuel filter & element (fuel; explained)<br>Fuel filter & element → Fuel shutoff valve (fuel; explained) | — | —; Component anatomy | [FAA · AMT Powerplant, chapter 2](https://www.faa.gov/sites/faa.gov/files/04_amtp_ch2.pdf) |
| Fuel shutoff valve | —  | Fuel filter & element → Fuel shutoff valve (fuel; explained)<br>Fuel shutoff valve → Fuel supply & pump (fuel; explained) | — | —; Component anatomy | [FAA · AMT Powerplant, chapter 2](https://www.faa.gov/sites/faa.gov/files/04_amtp_ch2.pdf) |
| Dry-sump oil reservoir | —  | Pressure relief / regulation → Dry-sump oil reservoir (service; explained)<br>Breather & air/oil separator → Dry-sump oil reservoir (service; explained)<br>Dry-sump oil reservoir → Pressure oil pump (service; explained)<br>Oil cooler → Dry-sump oil reservoir (service; explained) | — | —; Component anatomy | [FAA · Lubrication & cooling systems](https://www.faa.gov/sites/faa.gov/files/08_amtp_ch6.pdf) |
| Pressure oil pump | —  | Pressure oil pump → Pressure relief / regulation (service; explained)<br>Dry-sump oil reservoir → Pressure oil pump (service; explained)<br>Pressure oil pump → Oil filter & element (service; explained) | — | —; Component anatomy | [FAA · Lubrication & cooling systems](https://www.faa.gov/sites/faa.gov/files/08_amtp_ch6.pdf) |
| Oil filter & element | —  | Oil filter & element → Gas-generator front bearing (service; explained)<br>Oil filter & element → Gas-generator rear bearing (service; explained)<br>Oil filter & element → Power-shaft bearing (service; explained)<br>Pressure oil pump → Oil filter & element (service; explained)<br>Oil filter & element → Shaft bearings & supports (service; explained) | — | —; Component anatomy | [FAA · Lubrication & cooling systems](https://www.faa.gov/sites/faa.gov/files/08_amtp_ch6.pdf) |
| Scavenge pump | —  | Gas-generator front bearing → Scavenge pump (service; explained)<br>Gas-generator rear bearing → Scavenge pump (service; explained)<br>Power-shaft bearing → Scavenge pump (service; explained)<br>Shaft bearings & supports → Scavenge pump (service; explained)<br>Scavenge pump → Oil cooler (service; explained) | — | —; Component anatomy | [FAA · Lubrication & cooling systems](https://www.faa.gov/sites/faa.gov/files/08_amtp_ch6.pdf) |
| Oil cooler | —  | Scavenge pump → Oil cooler (service; explained)<br>Oil cooler → Dry-sump oil reservoir (service; explained) | — | —; Component anatomy | [FAA · Lubrication & cooling systems](https://www.faa.gov/sites/faa.gov/files/08_amtp_ch6.pdf) |
| Breather & air/oil separator | —  | Breather & air/oil separator → Dry-sump oil reservoir (service; explained)<br>Shaft bearings & supports → Breather & air/oil separator (service; explained)<br>Breather & air/oil separator → Separated breather air outlet (service; explained) | — | —; Component anatomy | [FAA · Lubrication & cooling systems](https://www.faa.gov/sites/faa.gov/files/08_amtp_ch6.pdf) |
| Aircraft electrical bus | —  | Aircraft electrical bus → Starting control command (electrical; explained)<br>Battery / ground electrical source → Aircraft electrical bus (electrical; explained)<br>Aircraft electrical bus → Starter contactor (electrical; explained)<br>Aircraft electrical bus → Ignition exciter (electrical; explained) | — | —; Component anatomy | [FAA · Ignition & electrical systems](https://www.faa.gov/sites/faa.gov/files/06_amtp_ch4.pdf) |
| Battery / ground electrical source | —  | Battery / ground electrical source → Aircraft electrical bus (electrical; explained) | — | —; Component anatomy | [FAA · Engine starting systems](https://www.faa.gov/sites/faa.gov/files/07_amtp_ch5.pdf) |
| Engine starter | —  | Starter contactor → Engine starter (electrical; explained)<br>Engine starter → Accessory gearbox & extraction (mechanical; explained) | — | —; Component anatomy | [FAA · Engine starting systems](https://www.faa.gov/sites/faa.gov/files/07_amtp_ch5.pdf) |
| Starter contactor | —  | Starting control command → Starter contactor (electrical; explained)<br>Aircraft electrical bus → Starter contactor (electrical; explained)<br>Starter contactor → Engine starter (electrical; explained) | — | —; Component anatomy | [FAA · Engine starting systems](https://www.faa.gov/sites/faa.gov/files/07_amtp_ch5.pdf) |
| Ignition exciter | —  | Aircraft electrical bus → Ignition exciter (electrical; explained)<br>Ignition exciter → Igniter (electrical; explained) | — | —; Component anatomy | [FAA · Ignition & electrical systems](https://www.faa.gov/sites/faa.gov/files/06_amtp_ch4.pdf) |
| Fuel pump bypass / relief | —  | Fuel supply & pump → Fuel pump bypass / relief (fuel; explained)<br>Fuel pump bypass / relief → Fuel supply & pump (fuel; explained) | — | —; Component anatomy | [FAA · AMT Powerplant, chapter 2](https://www.faa.gov/sites/faa.gov/files/04_amtp_ch2.pdf) |
| Pressure relief / regulation | —  | Pressure oil pump → Pressure relief / regulation (service; explained)<br>Pressure relief / regulation → Dry-sump oil reservoir (service; explained) | — | —; Component anatomy | [FAA · Lubrication & cooling systems](https://www.faa.gov/sites/faa.gov/files/08_amtp_ch6.pdf) |
| Separated breather air outlet | —  | Breather & air/oil separator → Separated breather air outlet (service; explained) | — | —; Component anatomy | [FAA · Lubrication & cooling systems](https://www.faa.gov/sites/faa.gov/files/08_amtp_ch6.pdf) |
| Starting control command | —  | Aircraft electrical bus → Starting control command (electrical; explained)<br>Starting control command → Starter contactor (electrical; explained) | — | —; Component anatomy | [FAA · Engine starting systems](https://www.faa.gov/sites/faa.gov/files/07_amtp_ch5.pdf) |
| Filter housing & cap | —  | — | — | —; Component anatomy | [FAA · AMT Powerplant, chapter 2](https://www.faa.gov/sites/faa.gov/files/04_amtp_ch2.pdf) |
| Pleated filter element | —  | — | — | —; Component anatomy | [FAA · AMT Powerplant, chapter 2](https://www.faa.gov/sites/faa.gov/files/04_amtp_ch2.pdf) |
| Filter housing & cap | —  | — | — | —; Component anatomy | [FAA · Lubrication & cooling systems](https://www.faa.gov/sites/faa.gov/files/08_amtp_ch6.pdf) |
| Pleated filter element | —  | — | — | —; Component anatomy | [FAA · Lubrication & cooling systems](https://www.faa.gov/sites/faa.gov/files/08_amtp_ch6.pdf) |

## turboprop

### Component concepts and instances

| Component | Stable concept | Architecture instance | Parent component / system | Inspection recipe |
|---|---|---|---|---|
| Inlet & intake duct | inlet | turboprop:inlet | Root / Intake & exhaust | engine |
| Compressor rotors | compressor.rotor | turboprop:compressor.rotor | Root / Compressor assembly | compressor |
| Compressor stators | compressor.stator | turboprop:compressor.stator | Root / Compressor assembly | compressor |
| Compressor outer casing | compressor.casing | turboprop:compressor.casing | Root / Compressor assembly | compressor |
| Diffuser | diffuser | turboprop:diffuser | Root / Compressor assembly | engine |
| Combustor outer casing | combustor.casing | turboprop:combustor.casing | Root / Combustion assembly | combustor |
| Combustor liner | combustor.liner | turboprop:combustor.liner | Root / Combustion assembly | combustor |
| Fuel manifold & injectors | fuel.nozzles | turboprop:fuel.nozzles | Root / Combustion assembly | combustor |
| Igniter | igniter | turboprop:igniter | Root / Combustion assembly | combustor |
| Turbine nozzle guide vanes | turbine.vanes | turboprop:turbine.vanes | Root / Turbine assemblies | turbine |
| Turbine outer casing | turbine.casing | turboprop:turbine.casing | Root / Turbine assemblies | turbine |
| Gas-generator turbine rotor | gg.rotor | turboprop:gg.rotor | Root / Turbine assemblies | turbine |
| Free power-turbine rotors | power.rotor | turboprop:power.rotor | Root / Turbine assemblies | turbine |
| Core exhaust & nozzle | exhaust | turboprop:exhaust | Root / Intake & exhaust | engine |
| Gas-generator shaft · Ng | gg.shaft | turboprop:gg.shaft | Root / Independent shaft assemblies | engine |
| Power shaft · Np | power.shaft | turboprop:power.shaft | Root / Independent shaft assemblies | engine |
| Shaft bearings & supports | bearings | turboprop:bearings | Root / Independent shaft assemblies | support |
| Propeller reduction gearbox | reduction | turboprop:reduction | Root / Output transmission | output |
| Propeller blades & hub | propeller | turboprop:propeller | Root / Driven aerodynamic surfaces | output |
| Propeller speed governor | prop.governor | turboprop:prop.governor | Root / Control computation | engine |
| PCU & pitch-change mechanism | pitch.actuator | turboprop:pitch.actuator | Root / Actuators & fuel supply | output |
| Propeller-aircraft installation | airframe | turboprop:airframe | Root / Structure & flight controls | engine |
| Wing, pylon & flight-control context | wing | turboprop:wing | Root / Structure & flight controls | engine |
| Engine controller / FADEC | controller | turboprop:controller | Root / Control computation | engine |
| Fuel supply & pump | fuel.pump | turboprop:fuel.pump | Root / Actuators & fuel supply | fuel |
| Fuel metering unit | fmu | turboprop:fmu | Root / Actuators & fuel supply | fuel |
| Ng speed pickup | speed.g | turboprop:speed.g | Root / Sensing & feedback | engine |
| Np power-shaft speed pickup | speed.p | turboprop:speed.p | Root / Sensing & feedback | engine |
| Propeller-speed pickup | load.speed | turboprop:load.speed | Root / Sensing & feedback | engine |
| Gas-path temperature probe | temperature | turboprop:temperature | Root / Sensing & feedback | engine |
| Compressor-delivery pressure pickup | pressure | turboprop:pressure | Root / Sensing & feedback | engine |
| Inlet temperature & pressure probes | inlet.sensor | turboprop:inlet.sensor | Root / Sensing & feedback | engine |
| Metering position / flow feedback | fmu.position | turboprop:fmu.position | Root / Sensing & feedback | fuel |
| Output torque sensing / estimate | torque | turboprop:torque | Root / Sensing & feedback | engine |
| Pilot power / thrust request | demand | turboprop:demand | Root / Pilot reference | engine |
| Aircraft air-data interface | airdata | turboprop:airdata | Root / Sensing & feedback | engine |
| Blade pitch feedback | pitch.feedback | turboprop:pitch.feedback | Root / Sensing & feedback | output |
| Accessory generator & electrical bus | electrical | turboprop:electrical | Root / Service energy & extraction | start |
| Accessory gearbox & extraction | accessory | turboprop:accessory | Root / Service energy & extraction | engine |
| Oil supply & temperature monitoring | oil | turboprop:oil | Root / Health & indication | oil |
| Vibration pickup & monitor | vibration | turboprop:vibration | Root / Health & indication | engine |
| Chip / debris indication | chip | turboprop:chip | Root / Health & indication | oil |
| Bleed & variable-geometry interface | bleed | turboprop:bleed | Root / Service energy & extraction | engine |
| Controller channels & availability | channels | turboprop:channels | Root / Availability concepts | engine |
| Cockpit indications & monitoring | cockpit | turboprop:cockpit | Root / Health & indication | engine |
| Fuel supply circuit | fuel.system | turboprop:fuel.system | Root / Fuel circuit | fuel |
| Stage 1 · rotor blades | compressor.stage.1.rotor | turboprop:compressor.stage.1.rotor | compressor.rotor | compressor |
| Stage 1 · rotor disc | compressor.stage.1.disc | turboprop:compressor.stage.1.disc | compressor.stage.1.rotor | compressor |
| Stage 1 · stator vanes | compressor.stage.1.stator | turboprop:compressor.stage.1.stator | compressor.stator | compressor |
| Stage 2 · rotor blades | compressor.stage.2.rotor | turboprop:compressor.stage.2.rotor | compressor.rotor | compressor |
| Stage 2 · rotor disc | compressor.stage.2.disc | turboprop:compressor.stage.2.disc | compressor.stage.2.rotor | compressor |
| Stage 2 · stator vanes | compressor.stage.2.stator | turboprop:compressor.stage.2.stator | compressor.stator | compressor |
| Stage 3 · rotor blades | compressor.stage.3.rotor | turboprop:compressor.stage.3.rotor | compressor.rotor | compressor |
| Stage 3 · rotor disc | compressor.stage.3.disc | turboprop:compressor.stage.3.disc | compressor.stage.3.rotor | compressor |
| Stage 3 · stator vanes | compressor.stage.3.stator | turboprop:compressor.stage.3.stator | compressor.stator | compressor |
| Stage 4 · rotor blades | compressor.stage.4.rotor | turboprop:compressor.stage.4.rotor | compressor.rotor | compressor |
| Stage 4 · rotor disc | compressor.stage.4.disc | turboprop:compressor.stage.4.disc | compressor.stage.4.rotor | compressor |
| Stage 4 · stator vanes | compressor.stage.4.stator | turboprop:compressor.stage.4.stator | compressor.stator | compressor |
| Stage 5 · rotor blades | compressor.stage.5.rotor | turboprop:compressor.stage.5.rotor | compressor.rotor | compressor |
| Stage 5 · rotor disc | compressor.stage.5.disc | turboprop:compressor.stage.5.disc | compressor.stage.5.rotor | compressor |
| Compressor support frame | compressor.frame | turboprop:compressor.frame | compressor.casing | compressor |
| Combustor dome | combustor.dome | turboprop:combustor.dome | combustor.liner | combustor |
| Injector swirlers | combustor.swirlers | turboprop:combustor.swirlers | fuel.nozzles | combustor |
| Primary air admission | combustor.primary | turboprop:combustor.primary | combustor.liner | combustor |
| Dilution air ports | combustor.dilution | turboprop:combustor.dilution | combustor.liner | combustor |
| Liner cooling passages | combustor.cooling | turboprop:combustor.cooling | combustor.liner | combustor |
| Annular fuel manifold | injector.manifold | turboprop:injector.manifold | fuel.nozzles | combustor |
| Fuel injector tips | injector.tip | turboprop:injector.tip | fuel.nozzles | combustor |
| Gas-generator / HP turbine disc | turbine.hpt.disc | turboprop:turbine.hpt.disc | gg.rotor | turbine |
| Power / LP turbine disc 1 | turbine.lpt.disc.1 | turboprop:turbine.lpt.disc.1 | power.rotor | turbine |
| Power / LP turbine disc 2 | turbine.lpt.disc.2 | turboprop:turbine.lpt.disc.2 | power.rotor | turbine |
| Gas-generator / HP nozzle guide vanes | turbine.ngv.hpt | turboprop:turbine.ngv.hpt | turbine.vanes | turbine |
| Power / LP nozzle guide vanes | turbine.ngv.lpt | turboprop:turbine.ngv.lpt | turbine.vanes | turbine |
| Turbine exit frame | turbine.frame | turboprop:turbine.frame | turbine.casing | turbine |
| Gas-generator front bearing | bearing.front | turboprop:bearing.front | bearings | support |
| Gas-generator rear bearing | bearing.rear | turboprop:bearing.rear | bearings | support |
| Power-shaft bearing | bearing.power | turboprop:bearing.power | bearings | support |
| Compressor bearing labyrinth seal | seal.front | turboprop:seal.front | bearings | support |
| Hot-section bearing labyrinth seal | seal.hot | turboprop:seal.hot | bearings | support |
| Aircraft fuel supply | fuel.tank | turboprop:fuel.tank | fuel.system | fuel |
| Supply boost pump | fuel.boost | turboprop:fuel.boost | fuel.system | fuel |
| Fuel filter & element | fuel.filter | turboprop:fuel.filter | fuel.system | fuel |
| Fuel shutoff valve | fuel.shutoff | turboprop:fuel.shutoff | fuel.system | fuel |
| Dry-sump oil reservoir | oil.tank | turboprop:oil.tank | oil | oil |
| Pressure oil pump | oil.pressure | turboprop:oil.pressure | oil | oil |
| Oil filter & element | oil.filter | turboprop:oil.filter | oil | oil |
| Scavenge pump | oil.scavenge | turboprop:oil.scavenge | oil | oil |
| Oil cooler | oil.cooler | turboprop:oil.cooler | oil | oil |
| Breather & air/oil separator | oil.breather | turboprop:oil.breather | oil | oil |
| Aircraft electrical bus | electric.bus | turboprop:electric.bus | electrical | engine |
| Battery / ground electrical source | electric.battery | turboprop:electric.battery | electrical | start |
| Engine starter | starter | turboprop:starter | accessory | start |
| Starter contactor | starter.supply | turboprop:starter.supply | electrical | start |
| Ignition exciter | ignition.exciter | turboprop:ignition.exciter | electrical | start |
| Fuel pump bypass / relief | fuel.bypass | turboprop:fuel.bypass | fuel.system | fuel |
| Pressure relief / regulation | oil.relief | turboprop:oil.relief | oil | oil |
| Separated breather air outlet | oil.vent | turboprop:oil.vent | oil | oil |
| Starting control command | start.command | turboprop:start.command | electrical | engine |
| Reduction gearbox housing | reduction.case | turboprop:reduction.case | reduction | output |
| Reduction gear train | reduction.gears | turboprop:reduction.gears | reduction | output |
| Input sun gear | reduction.sun | turboprop:reduction.sun | reduction.gears | output |
| Fixed internal ring | reduction.ring | turboprop:reduction.ring | reduction.gears | output |
| Planet gears | reduction.planets | turboprop:reduction.planets | reduction.gears | output |
| Output planet carrier | reduction.carrier | turboprop:reduction.carrier | reduction.gears | output |
| Propeller pitch hub | prop.hub | turboprop:prop.hub | propeller | engine |
| Pitch piston & links | pitch.piston | turboprop:pitch.piston | pitch.actuator | output |
| Filter housing & cap | fuel.filter.cap | turboprop:fuel.filter.cap | fuel.filter | fuel |
| Pleated filter element | fuel.filter.element | turboprop:fuel.filter.element | fuel.filter | fuel |
| Filter housing & cap | oil.filter.cap | turboprop:oil.filter.cap | oil.filter | oil |
| Pleated filter element | oil.filter.element | turboprop:oil.filter.element | oil.filter | oil |
| Inner race | bearing.front.inner | turboprop:bearing.front.inner | bearing.front | support |
| Outer race & housing | bearing.front.outer | turboprop:bearing.front.outer | bearing.front | support |
| Rolling elements & cage | bearing.front.rolling | turboprop:bearing.front.rolling | bearing.front | support |
| Inner race | bearing.rear.inner | turboprop:bearing.rear.inner | bearing.rear | support |
| Outer race & housing | bearing.rear.outer | turboprop:bearing.rear.outer | bearing.rear | support |
| Rolling elements & cage | bearing.rear.rolling | turboprop:bearing.rear.rolling | bearing.rear | support |
| Inner race | bearing.power.inner | turboprop:bearing.power.inner | bearing.power | support |
| Outer race & housing | bearing.power.outer | turboprop:bearing.power.outer | bearing.power | support |
| Rolling elements & cage | bearing.power.rolling | turboprop:bearing.power.rolling | bearing.power | support |
| Fuselage | airframe.fuselage | turboprop:airframe.fuselage | airframe | null |
| Cockpit & cabin glazing | airframe.cockpit | turboprop:airframe.cockpit | airframe | null |
| Tail surfaces | airframe.tail | turboprop:airframe.tail | airframe | null |
| Retracted gear doors | airframe.landing | turboprop:airframe.landing | airframe | null |
| Engine pylons & mounts | airframe.mounts | turboprop:airframe.mounts | airframe | null |
| Studied engine nacelle / cowling | airframe.nacelle | turboprop:airframe.nacelle | airframe | null |
| Far engine · exterior context only | airframe.companion | turboprop:airframe.companion | airframe | null |

### Control, sensors & actuators

| Interface | Quantity / units | Origin → destination | Role | Nature and scope | Public basis |
|---|---|---|---|---|---|
| Propeller speed governor | Prop speed error / pitch demand  / % / ° | Propeller-speed pickup → Propeller speed governor (signal; simulated)<br>Propeller speed governor → PCU & pitch-change mechanism (actuation; simulated)<br>Blade pitch feedback → Propeller speed governor (signal; explained) | Propeller speed control; distinct from engine fuel loop | Simulated governor; Simulated PI governor | [FAA · Transition to Turbopropeller-Powered Airplanes](https://www.faa.gov/sites/faa.gov/files/regulations_policies/handbooks_manuals/aviation/airplane_handbook/16_afh_ch15.pdf) |
| PCU & pitch-change mechanism | Requested / actual blade angle  / degrees | Propeller speed governor → PCU & pitch-change mechanism (actuation; simulated)<br>PCU & pitch-change mechanism → Propeller blades & hub (actuation; simulated)<br>PCU & pitch-change mechanism → Blade pitch feedback (signal; simulated) | Actuation | Simulated pitch actuator; First-order pitch response; no hydraulic circuit model | [FAA · Transition to Turbopropeller-Powered Airplanes](https://www.faa.gov/sites/faa.gov/files/regulations_policies/handbooks_manuals/aviation/airplane_handbook/16_afh_ch15.pdf) |
| Engine controller / FADEC | Reference → error → raw fuel → limited command  / N·m / kg/s | Pilot power / thrust request → Engine controller / FADEC (signal; simulated)<br>Ng speed pickup → Engine controller / FADEC (signal; simulated)<br>Compressor-delivery pressure pickup → Engine controller / FADEC (signal; explained)<br>Inlet temperature & pressure probes → Engine controller / FADEC (signal; explained)<br>Engine controller / FADEC → Fuel metering unit (actuation; simulated)<br>Output torque sensing / estimate → Engine controller / FADEC (signal; simulated)<br>Accessory generator & electrical bus → Engine controller / FADEC (electrical; explained)<br>Controller channels & availability → Engine controller / FADEC (signal; explained)<br>Aircraft air-data interface → Engine controller / FADEC (signal; explained)<br>Engine controller / FADEC → Cockpit indications & monitoring (signal; simulated)<br>Bleed & variable-geometry interface → Engine controller / FADEC (signal; explained) | Control and illustrative protection | Original synthetic control law; Simulated PI + anti-windup and limits | [FAA · Transition to Turbopropeller-Powered Airplanes](https://www.faa.gov/sites/faa.gov/files/regulations_policies/handbooks_manuals/aviation/airplane_handbook/16_afh_ch15.pdf) |
| Fuel supply & pump | —  | Fuel supply & pump → Fuel metering unit (fuel; explained)<br>Fuel supply & pump → Fuel pump bypass / relief (fuel; explained)<br>Fuel pump bypass / relief → Fuel supply & pump (fuel; explained)<br>Fuel shutoff valve → Fuel supply & pump (fuel; explained) | Fuel energy supply | —; Explained service; pressure prescribed adequate | [FAA · AMT Powerplant, chapter 2](https://www.faa.gov/sites/faa.gov/files/04_amtp_ch2.pdf) |
| Fuel metering unit | Commanded / actual fuel flow  / kg/s | Engine controller / FADEC → Fuel metering unit (actuation; simulated)<br>Fuel supply & pump → Fuel metering unit (fuel; explained)<br>Fuel metering unit → Fuel manifold & injectors (fuel; simulated)<br>Fuel metering unit → Metering position / flow feedback (signal; explained)<br>Metering position / flow feedback → Fuel metering unit (signal; explained)<br>Accessory generator & electrical bus → Fuel metering unit (electrical; explained)<br>Fuel metering unit → Annular fuel manifold (fuel; explained) | Fuel actuation | Simulated command and lagged actuator state; Simulated first-order metering response | [FAA · AMT Powerplant, chapter 2](https://www.faa.gov/sites/faa.gov/files/04_amtp_ch2.pdf) |
| Ng speed pickup | Ng relative speed  / % | Gas-generator shaft · Ng → Ng speed pickup (signal; simulated)<br>Ng speed pickup → Engine controller / FADEC (signal; simulated) | Ng speed input / example speed limit | Ideal simulated measurement; Simulated ideal pickup | [FAA · AMT Powerplant, chapter 2](https://www.faa.gov/sites/faa.gov/files/04_amtp_ch2.pdf) |
| Np power-shaft speed pickup | Np relative speed  / % | Power shaft · Np → Np power-shaft speed pickup (signal; simulated)<br>Np power-shaft speed pickup → Cockpit indications & monitoring (signal; simulated) | Pre-reduction speed indication; prop governor uses its own geared pickup | Ideal simulated measurement; Simulated ideal pickup | [FAA · AMT Powerplant, chapter 2](https://www.faa.gov/sites/faa.gov/files/04_amtp_ch2.pdf) |
| Propeller-speed pickup | Propeller rotational speed  / rad/s and rpm | Propeller blades & hub → Propeller-speed pickup (signal; simulated)<br>Propeller-speed pickup → Propeller speed governor (signal; simulated) | Separate propeller-governor feedback | Ideal post-reduction pickup; rigid gearing assumed; Ideal simulated geared speed | [FAA · Transition to Turbopropeller-Powered Airplanes](https://www.faa.gov/sites/faa.gov/files/regulations_policies/handbooks_manuals/aviation/airplane_handbook/16_afh_ch15.pdf) |
| Gas-path temperature probe | Post-gas-generator gas temperature  / K | Gas-generator turbine rotor → Gas-path temperature probe (signal; simulated)<br>Gas-path temperature probe → Cockpit indications & monitoring (signal; simulated) | Monitoring in this model; protection configuration dependent | Simulated probe with 0.5 s lag; Simulated probe; not used by this synthetic PI loop | [NASA Glenn · Engine station numbering](https://www.grc.nasa.gov/www/k-12/airplane/turbdraw.html) |
| Compressor-delivery pressure pickup | Compressor-delivery total pressure  / kPa | Diffuser → Compressor-delivery pressure pickup (signal; simulated)<br>Compressor-delivery pressure pickup → Engine controller / FADEC (signal; explained) | Available scheduling / monitor input; not active PI feedback | Ideal model-derived measurement; Displayed; no pressure-sensor dynamics | [FAA · AMT Powerplant, chapter 2](https://www.faa.gov/sites/faa.gov/files/04_amtp_ch2.pdf) |
| Inlet temperature & pressure probes | Inlet total T / P  / K / kPa | Inlet & intake duct → Inlet temperature & pressure probes (signal; simulated)<br>Inlet temperature & pressure probes → Engine controller / FADEC (signal; explained) | Environment / scheduling context | Prescribed ideal measurements; Boundary values; no sensor dynamics | [NASA Glenn · Engine station numbering](https://www.grc.nasa.gov/www/k-12/airplane/turbdraw.html) |
| Metering position / flow feedback | Equivalent metering opening  / % | Fuel metering unit → Metering position / flow feedback (signal; explained)<br>Metering position / flow feedback → Fuel metering unit (signal; explained) | Local actuator feedback context | Inferred, not independently sensed; Inferred display only; no separate position servo | [FAA · AMT Powerplant, chapter 2](https://www.faa.gov/sites/faa.gov/files/04_amtp_ch2.pdf) |
| Output torque sensing / estimate | Turbine-side output torque  / N·m | Power shaft · Np → Output torque sensing / estimate (signal; simulated)<br>Output torque sensing / estimate → Engine controller / FADEC (signal; simulated) | Torque-loop feedback | Calculated estimate; Simulated estimate | [FAA · Transition to Turbopropeller-Powered Airplanes](https://www.faa.gov/sites/faa.gov/files/regulations_policies/handbooks_manuals/aviation/airplane_handbook/16_afh_ch15.pdf) |
| Pilot power / thrust request | Shaft-power request  / % | Pilot power / thrust request → Engine controller / FADEC (signal; simulated) | Pilot command | Prescribed command; Synthetic demand mapping | [FAA · AMT Powerplant, chapter 2](https://www.faa.gov/sites/faa.gov/files/04_amtp_ch2.pdf) |
| Aircraft air-data interface | Prescribed forward airspeed  / m/s | Aircraft air-data interface → Engine controller / FADEC (signal; explained) | Environment / optional scheduling interface | Prescribed, not closed-loop flight data; Boundary estimate only | [NASA Glenn · Four forces](https://www1.grc.nasa.gov/beginners-guide-to-aeronautics/four-forces-on-an-airplane/) |
| Blade pitch feedback | Actual blade angle  / degrees | PCU & pitch-change mechanism → Blade pitch feedback (signal; simulated)<br>Blade pitch feedback → Propeller speed governor (signal; explained) | Propeller control feedback context | Model-state ideal feedback; Displayed ideal feedback; governor uses speed error | [FAA · Transition to Turbopropeller-Powered Airplanes](https://www.faa.gov/sites/faa.gov/files/regulations_policies/handbooks_manuals/aviation/airplane_handbook/16_afh_ch15.pdf) |
| Pitch piston & links | —  | — | — | —; Component anatomy | [FAA · Transition to Turbopropeller-Powered Airplanes](https://www.faa.gov/sites/faa.gov/files/regulations_policies/handbooks_manuals/aviation/airplane_handbook/16_afh_ch15.pdf) |

### Services, monitoring & channels

| Interface | Quantity / units | Origin → destination | Role | Nature and scope | Public basis |
|---|---|---|---|---|---|
| Accessory generator & electrical bus | Supply status  | Accessory gearbox & extraction → Accessory generator & electrical bus (mechanical; simulated)<br>Accessory generator & electrical bus → Engine controller / FADEC (electrical; explained)<br>Accessory generator & electrical bus → Fuel metering unit (electrical; explained)<br>Accessory generator & electrical bus → Cockpit indications & monitoring (electrical; explained) | Electrical energy supply | Assumed available; Component anatomy | [FAA · Helicopter Flying Handbook, chapter 4](https://www.faa.gov/sites/faa.gov/files/regulations_policies/handbooks_manuals/aviation/helicopter_flying_handbook/hfh_ch04.pdf) |
| Accessory gearbox & extraction | —  | Gas-generator shaft · Ng → Accessory gearbox & extraction (mechanical; simulated)<br>Accessory gearbox & extraction → Accessory generator & electrical bus (mechanical; simulated)<br>Engine starter → Accessory gearbox & extraction (mechanical; explained)<br>Accessory gearbox & extraction → Gas-generator turbine rotor (mechanical; explained) | Mechanical extraction | —; Simulated aggregate power draw | [FAA · AMT Powerplant, chapter 1](https://www.faa.gov/sites/faa.gov/files/03_amtp_ch1.pdf) |
| Oil supply & temperature monitoring | —  | Oil supply & temperature monitoring → Shaft bearings & supports (service; explained)<br>Oil supply & temperature monitoring → Cockpit indications & monitoring (signal; explained) | Service and health monitoring | Not numerically simulated; Component anatomy | [FAA · AMT Powerplant, chapter 1](https://www.faa.gov/sites/faa.gov/files/03_amtp_ch1.pdf) |
| Vibration pickup & monitor | Vibration health data  | Vibration pickup & monitor → Cockpit indications & monitoring (signal; explained) | Monitoring only in this configuration | Explained, not synthesized; Component anatomy | [FAA · G-OBME accident lessons](https://www.faa.gov/lessons_learned/transport_airplane/accidents/G-OBME) |
| Chip / debris indication | —  | Chip / debris indication → Cockpit indications & monitoring (signal; explained) | Health indication, configuration dependent | Not simulated; Component anatomy | [FAA · AMT Powerplant, chapter 1](https://www.faa.gov/sites/faa.gov/files/03_amtp_ch1.pdf) |
| Bleed & variable-geometry interface | Optional valve / vane position and bleed demand  | Bleed & variable-geometry interface → Engine controller / FADEC (signal; explained) | Configuration-dependent control / service | Explained optional feature; Component anatomy | [FAA · AMT Powerplant, chapter 2](https://www.faa.gov/sites/faa.gov/files/04_amtp_ch2.pdf) |
| Controller channels & availability | —  | Controller channels & availability → Engine controller / FADEC (signal; explained) | Representative availability / fault concept | Explained, no injected fault logic; Component anatomy | [P&W · Public integrated-control example](https://www.rtx.com/en/prattwhitney/products/general-aviation-engines/pt6e-67xp) |
| Cockpit indications & monitoring | —  | Np power-shaft speed pickup → Cockpit indications & monitoring (signal; simulated)<br>Gas-path temperature probe → Cockpit indications & monitoring (signal; simulated)<br>Accessory generator & electrical bus → Cockpit indications & monitoring (electrical; explained)<br>Oil supply & temperature monitoring → Cockpit indications & monitoring (signal; explained)<br>Vibration pickup & monitor → Cockpit indications & monitoring (signal; explained)<br>Chip / debris indication → Cockpit indications & monitoring (signal; explained)<br>Engine controller / FADEC → Cockpit indications & monitoring (signal; simulated) | Monitoring and pilot interface | Model-derived indications; Component anatomy | [FAA · AMT Powerplant, chapter 2](https://www.faa.gov/sites/faa.gov/files/04_amtp_ch2.pdf) |
| Fuel supply circuit | —  | — | — | —; Component anatomy | [FAA · AMT Powerplant, chapter 2](https://www.faa.gov/sites/faa.gov/files/04_amtp_ch2.pdf) |
| Aircraft fuel supply | —  | Aircraft fuel supply → Supply boost pump (fuel; explained) | — | —; Component anatomy | [FAA · AMT Powerplant, chapter 2](https://www.faa.gov/sites/faa.gov/files/04_amtp_ch2.pdf) |
| Supply boost pump | —  | Aircraft fuel supply → Supply boost pump (fuel; explained)<br>Supply boost pump → Fuel filter & element (fuel; explained) | — | —; Component anatomy | [FAA · AMT Powerplant, chapter 2](https://www.faa.gov/sites/faa.gov/files/04_amtp_ch2.pdf) |
| Fuel filter & element | —  | Supply boost pump → Fuel filter & element (fuel; explained)<br>Fuel filter & element → Fuel shutoff valve (fuel; explained) | — | —; Component anatomy | [FAA · AMT Powerplant, chapter 2](https://www.faa.gov/sites/faa.gov/files/04_amtp_ch2.pdf) |
| Fuel shutoff valve | —  | Fuel filter & element → Fuel shutoff valve (fuel; explained)<br>Fuel shutoff valve → Fuel supply & pump (fuel; explained) | — | —; Component anatomy | [FAA · AMT Powerplant, chapter 2](https://www.faa.gov/sites/faa.gov/files/04_amtp_ch2.pdf) |
| Dry-sump oil reservoir | —  | Pressure relief / regulation → Dry-sump oil reservoir (service; explained)<br>Breather & air/oil separator → Dry-sump oil reservoir (service; explained)<br>Dry-sump oil reservoir → Pressure oil pump (service; explained)<br>Oil cooler → Dry-sump oil reservoir (service; explained) | — | —; Component anatomy | [FAA · Lubrication & cooling systems](https://www.faa.gov/sites/faa.gov/files/08_amtp_ch6.pdf) |
| Pressure oil pump | —  | Pressure oil pump → Pressure relief / regulation (service; explained)<br>Dry-sump oil reservoir → Pressure oil pump (service; explained)<br>Pressure oil pump → Oil filter & element (service; explained) | — | —; Component anatomy | [FAA · Lubrication & cooling systems](https://www.faa.gov/sites/faa.gov/files/08_amtp_ch6.pdf) |
| Oil filter & element | —  | Oil filter & element → Gas-generator front bearing (service; explained)<br>Oil filter & element → Gas-generator rear bearing (service; explained)<br>Oil filter & element → Power-shaft bearing (service; explained)<br>Pressure oil pump → Oil filter & element (service; explained)<br>Oil filter & element → Shaft bearings & supports (service; explained) | — | —; Component anatomy | [FAA · Lubrication & cooling systems](https://www.faa.gov/sites/faa.gov/files/08_amtp_ch6.pdf) |
| Scavenge pump | —  | Gas-generator front bearing → Scavenge pump (service; explained)<br>Gas-generator rear bearing → Scavenge pump (service; explained)<br>Power-shaft bearing → Scavenge pump (service; explained)<br>Shaft bearings & supports → Scavenge pump (service; explained)<br>Scavenge pump → Oil cooler (service; explained) | — | —; Component anatomy | [FAA · Lubrication & cooling systems](https://www.faa.gov/sites/faa.gov/files/08_amtp_ch6.pdf) |
| Oil cooler | —  | Scavenge pump → Oil cooler (service; explained)<br>Oil cooler → Dry-sump oil reservoir (service; explained) | — | —; Component anatomy | [FAA · Lubrication & cooling systems](https://www.faa.gov/sites/faa.gov/files/08_amtp_ch6.pdf) |
| Breather & air/oil separator | —  | Breather & air/oil separator → Dry-sump oil reservoir (service; explained)<br>Shaft bearings & supports → Breather & air/oil separator (service; explained)<br>Breather & air/oil separator → Separated breather air outlet (service; explained) | — | —; Component anatomy | [FAA · Lubrication & cooling systems](https://www.faa.gov/sites/faa.gov/files/08_amtp_ch6.pdf) |
| Aircraft electrical bus | —  | Aircraft electrical bus → Starting control command (electrical; explained)<br>Battery / ground electrical source → Aircraft electrical bus (electrical; explained)<br>Aircraft electrical bus → Starter contactor (electrical; explained)<br>Aircraft electrical bus → Ignition exciter (electrical; explained) | — | —; Component anatomy | [FAA · Ignition & electrical systems](https://www.faa.gov/sites/faa.gov/files/06_amtp_ch4.pdf) |
| Battery / ground electrical source | —  | Battery / ground electrical source → Aircraft electrical bus (electrical; explained) | — | —; Component anatomy | [FAA · Engine starting systems](https://www.faa.gov/sites/faa.gov/files/07_amtp_ch5.pdf) |
| Engine starter | —  | Starter contactor → Engine starter (electrical; explained)<br>Engine starter → Accessory gearbox & extraction (mechanical; explained) | — | —; Component anatomy | [FAA · Engine starting systems](https://www.faa.gov/sites/faa.gov/files/07_amtp_ch5.pdf) |
| Starter contactor | —  | Starting control command → Starter contactor (electrical; explained)<br>Aircraft electrical bus → Starter contactor (electrical; explained)<br>Starter contactor → Engine starter (electrical; explained) | — | —; Component anatomy | [FAA · Engine starting systems](https://www.faa.gov/sites/faa.gov/files/07_amtp_ch5.pdf) |
| Ignition exciter | —  | Aircraft electrical bus → Ignition exciter (electrical; explained)<br>Ignition exciter → Igniter (electrical; explained) | — | —; Component anatomy | [FAA · Ignition & electrical systems](https://www.faa.gov/sites/faa.gov/files/06_amtp_ch4.pdf) |
| Fuel pump bypass / relief | —  | Fuel supply & pump → Fuel pump bypass / relief (fuel; explained)<br>Fuel pump bypass / relief → Fuel supply & pump (fuel; explained) | — | —; Component anatomy | [FAA · AMT Powerplant, chapter 2](https://www.faa.gov/sites/faa.gov/files/04_amtp_ch2.pdf) |
| Pressure relief / regulation | —  | Pressure oil pump → Pressure relief / regulation (service; explained)<br>Pressure relief / regulation → Dry-sump oil reservoir (service; explained) | — | —; Component anatomy | [FAA · Lubrication & cooling systems](https://www.faa.gov/sites/faa.gov/files/08_amtp_ch6.pdf) |
| Separated breather air outlet | —  | Breather & air/oil separator → Separated breather air outlet (service; explained) | — | —; Component anatomy | [FAA · Lubrication & cooling systems](https://www.faa.gov/sites/faa.gov/files/08_amtp_ch6.pdf) |
| Starting control command | —  | Aircraft electrical bus → Starting control command (electrical; explained)<br>Starting control command → Starter contactor (electrical; explained) | — | —; Component anatomy | [FAA · Engine starting systems](https://www.faa.gov/sites/faa.gov/files/07_amtp_ch5.pdf) |
| Filter housing & cap | —  | — | — | —; Component anatomy | [FAA · AMT Powerplant, chapter 2](https://www.faa.gov/sites/faa.gov/files/04_amtp_ch2.pdf) |
| Pleated filter element | —  | — | — | —; Component anatomy | [FAA · AMT Powerplant, chapter 2](https://www.faa.gov/sites/faa.gov/files/04_amtp_ch2.pdf) |
| Filter housing & cap | —  | — | — | —; Component anatomy | [FAA · Lubrication & cooling systems](https://www.faa.gov/sites/faa.gov/files/08_amtp_ch6.pdf) |
| Pleated filter element | —  | — | — | —; Component anatomy | [FAA · Lubrication & cooling systems](https://www.faa.gov/sites/faa.gov/files/08_amtp_ch6.pdf) |

## turbofan

### Component concepts and instances

| Component | Stable concept | Architecture instance | Parent component / system | Inspection recipe |
|---|---|---|---|---|
| Inlet & intake duct | inlet | turbofan:inlet | Root / Intake & exhaust | engine |
| Fan rotor | fan.rotor | turbofan:fan.rotor | Root / Fan & low-pressure system | output |
| Fan outlet guide vanes | fan.stator | turbofan:fan.stator | Root / Fan & low-pressure system | engine |
| Low-pressure compressor | lpc.rotor | turbofan:lpc.rotor | Root / Fan & low-pressure system | output |
| LP compressor stators | lpc.stator | turbofan:lpc.stator | Root / Fan & low-pressure system | engine |
| Bypass duct & nozzle | bypass | turbofan:bypass | Root / Fan & low-pressure system | engine |
| High-pressure compressor | compressor.rotor | turbofan:compressor.rotor | Root / Compressor assembly | compressor |
| Compressor stators | compressor.stator | turbofan:compressor.stator | Root / Compressor assembly | compressor |
| Compressor outer casing | compressor.casing | turbofan:compressor.casing | Root / Compressor assembly | compressor |
| Diffuser | diffuser | turbofan:diffuser | Root / Compressor assembly | engine |
| Combustor outer casing | combustor.casing | turbofan:combustor.casing | Root / Combustion assembly | combustor |
| Combustor liner | combustor.liner | turbofan:combustor.liner | Root / Combustion assembly | combustor |
| Fuel manifold & injectors | fuel.nozzles | turbofan:fuel.nozzles | Root / Combustion assembly | combustor |
| Igniter | igniter | turbofan:igniter | Root / Combustion assembly | combustor |
| Turbine nozzle guide vanes | turbine.vanes | turbofan:turbine.vanes | Root / Turbine assemblies | turbine |
| Turbine outer casing | turbine.casing | turbofan:turbine.casing | Root / Turbine assemblies | turbine |
| High-pressure turbine | gg.rotor | turbofan:gg.rotor | Root / Turbine assemblies | turbine |
| Low-pressure turbine | power.rotor | turbofan:power.rotor | Root / Turbine assemblies | turbine |
| Core exhaust & nozzle | exhaust | turbofan:exhaust | Root / Intake & exhaust | engine |
| HP shaft · N2 | gg.shaft | turbofan:hp.shaft | Root / Independent shaft assemblies | turbine |
| LP shaft · N1 | power.shaft | turbofan:lp.shaft | Root / Independent shaft assemblies | turbine |
| Shaft bearings & supports | bearings | turbofan:bearings | Root / Independent shaft assemblies | support |
| Jet-aircraft installation | airframe | turbofan:airframe | Root / Structure & flight controls | engine |
| Wing, pylon & flight-control context | wing | turbofan:wing | Root / Structure & flight controls | engine |
| Engine controller / FADEC | controller | turbofan:controller | Root / Control computation | engine |
| Fuel supply & pump | fuel.pump | turbofan:fuel.pump | Root / Actuators & fuel supply | fuel |
| Fuel metering unit | fmu | turbofan:fmu | Root / Actuators & fuel supply | fuel |
| N2 / HP speed pickup | speed.g | turbofan:speed.g | Root / Sensing & feedback | engine |
| N1 / LP speed pickup | speed.p | turbofan:speed.p | Root / Sensing & feedback | engine |
| Gas-path temperature probe | temperature | turbofan:temperature | Root / Sensing & feedback | engine |
| Compressor-delivery pressure pickup | pressure | turbofan:pressure | Root / Sensing & feedback | engine |
| Inlet temperature & pressure probes | inlet.sensor | turbofan:inlet.sensor | Root / Sensing & feedback | engine |
| Metering position / flow feedback | fmu.position | turbofan:fmu.position | Root / Sensing & feedback | fuel |
| Output torque sensing / estimate | torque | turbofan:torque | Root / Sensing & feedback | engine |
| Pilot power / thrust request | demand | turbofan:demand | Root / Pilot reference | engine |
| Aircraft air-data interface | airdata | turbofan:airdata | Root / Sensing & feedback | engine |
| Accessory generator & electrical bus | electrical | turbofan:electrical | Root / Service energy & extraction | start |
| Accessory gearbox & extraction | accessory | turbofan:accessory | Root / Service energy & extraction | engine |
| Oil supply & temperature monitoring | oil | turbofan:oil | Root / Health & indication | oil |
| Vibration pickup & monitor | vibration | turbofan:vibration | Root / Health & indication | engine |
| Chip / debris indication | chip | turbofan:chip | Root / Health & indication | oil |
| Bleed & variable-geometry interface | bleed | turbofan:bleed | Root / Service energy & extraction | engine |
| Controller channels & availability | channels | turbofan:channels | Root / Availability concepts | engine |
| Cockpit indications & monitoring | cockpit | turbofan:cockpit | Root / Health & indication | engine |
| Fuel supply circuit | fuel.system | turbofan:fuel.system | Root / Fuel circuit | fuel |
| Stage 1 · rotor blades | compressor.stage.1.rotor | turbofan:compressor.stage.1.rotor | compressor.rotor | compressor |
| Stage 1 · rotor disc | compressor.stage.1.disc | turbofan:compressor.stage.1.disc | compressor.stage.1.rotor | compressor |
| Stage 1 · stator vanes | compressor.stage.1.stator | turbofan:compressor.stage.1.stator | compressor.stator | compressor |
| Stage 2 · rotor blades | compressor.stage.2.rotor | turbofan:compressor.stage.2.rotor | compressor.rotor | compressor |
| Stage 2 · rotor disc | compressor.stage.2.disc | turbofan:compressor.stage.2.disc | compressor.stage.2.rotor | compressor |
| Stage 2 · stator vanes | compressor.stage.2.stator | turbofan:compressor.stage.2.stator | compressor.stator | compressor |
| Stage 3 · rotor blades | compressor.stage.3.rotor | turbofan:compressor.stage.3.rotor | compressor.rotor | compressor |
| Stage 3 · rotor disc | compressor.stage.3.disc | turbofan:compressor.stage.3.disc | compressor.stage.3.rotor | compressor |
| Compressor support frame | compressor.frame | turbofan:compressor.frame | compressor.casing | compressor |
| Combustor dome | combustor.dome | turbofan:combustor.dome | combustor.liner | combustor |
| Injector swirlers | combustor.swirlers | turbofan:combustor.swirlers | fuel.nozzles | combustor |
| Primary air admission | combustor.primary | turbofan:combustor.primary | combustor.liner | combustor |
| Dilution air ports | combustor.dilution | turbofan:combustor.dilution | combustor.liner | combustor |
| Liner cooling passages | combustor.cooling | turbofan:combustor.cooling | combustor.liner | combustor |
| Annular fuel manifold | injector.manifold | turbofan:injector.manifold | fuel.nozzles | combustor |
| Fuel injector tips | injector.tip | turbofan:injector.tip | fuel.nozzles | combustor |
| Gas-generator / HP turbine disc | turbine.hpt.disc | turbofan:turbine.hpt.disc | gg.rotor | turbine |
| Power / LP turbine disc 1 | turbine.lpt.disc.1 | turbofan:turbine.lpt.disc.1 | power.rotor | turbine |
| Power / LP turbine disc 2 | turbine.lpt.disc.2 | turbofan:turbine.lpt.disc.2 | power.rotor | turbine |
| Gas-generator / HP nozzle guide vanes | turbine.ngv.hpt | turbofan:turbine.ngv.hpt | turbine.vanes | turbine |
| Power / LP nozzle guide vanes | turbine.ngv.lpt | turbofan:turbine.ngv.lpt | turbine.vanes | turbine |
| Turbine exit frame | turbine.frame | turbofan:turbine.frame | turbine.casing | turbine |
| Gas-generator front bearing | bearing.front | turbofan:bearing.front | bearings | support |
| Gas-generator rear bearing | bearing.rear | turbofan:bearing.rear | bearings | support |
| Power-shaft bearing | bearing.power | turbofan:bearing.power | bearings | support |
| Compressor bearing labyrinth seal | seal.front | turbofan:seal.front | bearings | support |
| Hot-section bearing labyrinth seal | seal.hot | turbofan:seal.hot | bearings | support |
| Aircraft fuel supply | fuel.tank | turbofan:fuel.tank | fuel.system | fuel |
| Supply boost pump | fuel.boost | turbofan:fuel.boost | fuel.system | fuel |
| Fuel filter & element | fuel.filter | turbofan:fuel.filter | fuel.system | fuel |
| Fuel shutoff valve | fuel.shutoff | turbofan:fuel.shutoff | fuel.system | fuel |
| Dry-sump oil reservoir | oil.tank | turbofan:oil.tank | oil | oil |
| Pressure oil pump | oil.pressure | turbofan:oil.pressure | oil | oil |
| Oil filter & element | oil.filter | turbofan:oil.filter | oil | oil |
| Scavenge pump | oil.scavenge | turbofan:oil.scavenge | oil | oil |
| Oil cooler | oil.cooler | turbofan:oil.cooler | oil | oil |
| Breather & air/oil separator | oil.breather | turbofan:oil.breather | oil | oil |
| Aircraft electrical bus | electric.bus | turbofan:electric.bus | electrical | engine |
| Battery / ground electrical source | electric.battery | turbofan:electric.battery | electrical | start |
| Engine starter | starter | turbofan:starter | accessory | start |
| APU / ground starting air | starter.supply | turbofan:starter.supply | Root / Starting energy | start |
| Ignition exciter | ignition.exciter | turbofan:ignition.exciter | electrical | start |
| Fuel pump bypass / relief | fuel.bypass | turbofan:fuel.bypass | fuel.system | fuel |
| Pressure relief / regulation | oil.relief | turbofan:oil.relief | oil | oil |
| Separated breather air outlet | oil.vent | turbofan:oil.vent | oil | oil |
| Starting control command | start.command | turbofan:start.command | electrical | engine |
| Pneumatic starter control valve | starter.valve | turbofan:starter.valve | starter | start |
| Fan case & outlet support | fan.frame | turbofan:fan.frame | fan.stator | engine |
| Filter housing & cap | fuel.filter.cap | turbofan:fuel.filter.cap | fuel.filter | fuel |
| Pleated filter element | fuel.filter.element | turbofan:fuel.filter.element | fuel.filter | fuel |
| Filter housing & cap | oil.filter.cap | turbofan:oil.filter.cap | oil.filter | oil |
| Pleated filter element | oil.filter.element | turbofan:oil.filter.element | oil.filter | oil |
| Inner race | bearing.front.inner | turbofan:bearing.front.inner | bearing.front | support |
| Outer race & housing | bearing.front.outer | turbofan:bearing.front.outer | bearing.front | support |
| Rolling elements & cage | bearing.front.rolling | turbofan:bearing.front.rolling | bearing.front | support |
| Inner race | bearing.rear.inner | turbofan:bearing.rear.inner | bearing.rear | support |
| Outer race & housing | bearing.rear.outer | turbofan:bearing.rear.outer | bearing.rear | support |
| Rolling elements & cage | bearing.rear.rolling | turbofan:bearing.rear.rolling | bearing.rear | support |
| Inner race | bearing.power.inner | turbofan:bearing.power.inner | bearing.power | support |
| Outer race & housing | bearing.power.outer | turbofan:bearing.power.outer | bearing.power | support |
| Rolling elements & cage | bearing.power.rolling | turbofan:bearing.power.rolling | bearing.power | support |
| Fuselage | airframe.fuselage | turbofan:airframe.fuselage | airframe | null |
| Cockpit & cabin glazing | airframe.cockpit | turbofan:airframe.cockpit | airframe | null |
| Tail surfaces | airframe.tail | turbofan:airframe.tail | airframe | null |
| Retracted gear doors | airframe.landing | turbofan:airframe.landing | airframe | null |
| Engine pylons & mounts | airframe.mounts | turbofan:airframe.mounts | airframe | null |
| Studied engine nacelle / cowling | airframe.nacelle | turbofan:airframe.nacelle | airframe | null |
| Far engine · exterior context only | airframe.companion | turbofan:airframe.companion | airframe | null |

### Control, sensors & actuators

| Interface | Quantity / units | Origin → destination | Role | Nature and scope | Public basis |
|---|---|---|---|---|---|
| Engine controller / FADEC | Reference → error → raw fuel → limited command  / fraction / kg/s | Pilot power / thrust request → Engine controller / FADEC (signal; simulated)<br>N2 / HP speed pickup → Engine controller / FADEC (signal; simulated)<br>N1 / LP speed pickup → Engine controller / FADEC (signal; simulated)<br>Compressor-delivery pressure pickup → Engine controller / FADEC (signal; explained)<br>Inlet temperature & pressure probes → Engine controller / FADEC (signal; explained)<br>Engine controller / FADEC → Fuel metering unit (actuation; simulated)<br>Accessory generator & electrical bus → Engine controller / FADEC (electrical; explained)<br>Controller channels & availability → Engine controller / FADEC (signal; explained)<br>Aircraft air-data interface → Engine controller / FADEC (signal; explained)<br>Engine controller / FADEC → Cockpit indications & monitoring (signal; simulated)<br>Bleed & variable-geometry interface → Engine controller / FADEC (signal; explained) | Control and illustrative protection | Original synthetic control law; Simulated PI + anti-windup and limits | [NASA · TM-20210014065](https://ntrs.nasa.gov/api/citations/20210014065/downloads/TM-20210014065.pdf?attachment=true) |
| Fuel supply & pump | —  | Fuel supply & pump → Fuel metering unit (fuel; explained)<br>Fuel supply & pump → Fuel pump bypass / relief (fuel; explained)<br>Fuel pump bypass / relief → Fuel supply & pump (fuel; explained)<br>Fuel shutoff valve → Fuel supply & pump (fuel; explained) | Fuel energy supply | —; Explained service; pressure prescribed adequate | [FAA · AMT Powerplant, chapter 2](https://www.faa.gov/sites/faa.gov/files/04_amtp_ch2.pdf) |
| Fuel metering unit | Commanded / actual fuel flow  / kg/s | Engine controller / FADEC → Fuel metering unit (actuation; simulated)<br>Fuel supply & pump → Fuel metering unit (fuel; explained)<br>Fuel metering unit → Fuel manifold & injectors (fuel; simulated)<br>Fuel metering unit → Metering position / flow feedback (signal; explained)<br>Metering position / flow feedback → Fuel metering unit (signal; explained)<br>Accessory generator & electrical bus → Fuel metering unit (electrical; explained)<br>Fuel metering unit → Annular fuel manifold (fuel; explained) | Fuel actuation | Simulated command and lagged actuator state; Simulated first-order metering response | [FAA · AMT Powerplant, chapter 2](https://www.faa.gov/sites/faa.gov/files/04_amtp_ch2.pdf) |
| N2 / HP speed pickup | N2 relative speed  / % | HP shaft · N2 → N2 / HP speed pickup (signal; simulated)<br>N2 / HP speed pickup → Engine controller / FADEC (signal; simulated) | N2 speed input / example speed limit | Ideal simulated measurement; Simulated ideal pickup | [FAA · AMT Powerplant, chapter 2](https://www.faa.gov/sites/faa.gov/files/04_amtp_ch2.pdf) |
| N1 / LP speed pickup | N1 relative speed  / % | LP shaft · N1 → N1 / LP speed pickup (signal; simulated)<br>N1 / LP speed pickup → Engine controller / FADEC (signal; simulated) | Governing speed feedback | Ideal simulated measurement; Simulated ideal pickup | [FAA · AMT Powerplant, chapter 2](https://www.faa.gov/sites/faa.gov/files/04_amtp_ch2.pdf) |
| Gas-path temperature probe | Post-LPT gas temperature  / K | Core exhaust & nozzle → Gas-path temperature probe (signal; simulated)<br>Gas-path temperature probe → Cockpit indications & monitoring (signal; simulated) | Monitoring in this model; protection configuration dependent | Simulated probe with 0.5 s lag; Simulated probe; not used by this synthetic PI loop | [NASA Glenn · Engine station numbering](https://www.grc.nasa.gov/www/k-12/airplane/turbdraw.html) |
| Compressor-delivery pressure pickup | Compressor-delivery total pressure  / kPa | Diffuser → Compressor-delivery pressure pickup (signal; simulated)<br>Compressor-delivery pressure pickup → Engine controller / FADEC (signal; explained) | Available scheduling / monitor input; not active PI feedback | Ideal model-derived measurement; Displayed; no pressure-sensor dynamics | [FAA · AMT Powerplant, chapter 2](https://www.faa.gov/sites/faa.gov/files/04_amtp_ch2.pdf) |
| Inlet temperature & pressure probes | Inlet total T / P  / K / kPa | Inlet & intake duct → Inlet temperature & pressure probes (signal; simulated)<br>Inlet temperature & pressure probes → Engine controller / FADEC (signal; explained) | Environment / scheduling context | Prescribed ideal measurements; Boundary values; no sensor dynamics | [NASA Glenn · Engine station numbering](https://www.grc.nasa.gov/www/k-12/airplane/turbdraw.html) |
| Metering position / flow feedback | Equivalent metering opening  / % | Fuel metering unit → Metering position / flow feedback (signal; explained)<br>Metering position / flow feedback → Fuel metering unit (signal; explained) | Local actuator feedback context | Inferred, not independently sensed; Inferred display only; no separate position servo | [FAA · AMT Powerplant, chapter 2](https://www.faa.gov/sites/faa.gov/files/04_amtp_ch2.pdf) |
| Output torque sensing / estimate | Turbine-side output torque  / N·m | LP shaft · N1 → Output torque sensing / estimate (signal; simulated)<br>Output torque sensing / estimate → Cockpit indications & monitoring (signal; simulated) | Indication; not active fuel-loop feedback | Calculated estimate; Simulated estimate | [FAA · Transition to Turbopropeller-Powered Airplanes](https://www.faa.gov/sites/faa.gov/files/regulations_policies/handbooks_manuals/aviation/airplane_handbook/16_afh_ch15.pdf) |
| Pilot power / thrust request | Thrust request / synthetic N1 reference  / % | Pilot power / thrust request → Engine controller / FADEC (signal; simulated) | Pilot command | Prescribed command; Synthetic demand mapping | [FAA · AMT Powerplant, chapter 2](https://www.faa.gov/sites/faa.gov/files/04_amtp_ch2.pdf) |
| Aircraft air-data interface | Prescribed forward airspeed  / m/s | Aircraft air-data interface → Engine controller / FADEC (signal; explained) | Environment / optional scheduling interface | Prescribed, not closed-loop flight data; Boundary estimate only | [NASA Glenn · Four forces](https://www1.grc.nasa.gov/beginners-guide-to-aeronautics/four-forces-on-an-airplane/) |

### Services, monitoring & channels

| Interface | Quantity / units | Origin → destination | Role | Nature and scope | Public basis |
|---|---|---|---|---|---|
| Accessory generator & electrical bus | Supply status  | Accessory gearbox & extraction → Accessory generator & electrical bus (mechanical; simulated)<br>Accessory generator & electrical bus → Engine controller / FADEC (electrical; explained)<br>Accessory generator & electrical bus → Fuel metering unit (electrical; explained)<br>Accessory generator & electrical bus → Cockpit indications & monitoring (electrical; explained) | Electrical energy supply | Assumed available; Component anatomy | [FAA · Helicopter Flying Handbook, chapter 4](https://www.faa.gov/sites/faa.gov/files/regulations_policies/handbooks_manuals/aviation/helicopter_flying_handbook/hfh_ch04.pdf) |
| Accessory gearbox & extraction | —  | HP shaft · N2 → Accessory gearbox & extraction (mechanical; simulated)<br>Accessory gearbox & extraction → Accessory generator & electrical bus (mechanical; simulated)<br>Engine starter → Accessory gearbox & extraction (mechanical; explained)<br>Accessory gearbox & extraction → High-pressure turbine (mechanical; explained) | Mechanical extraction | —; Simulated aggregate power draw | [FAA · AMT Powerplant, chapter 1](https://www.faa.gov/sites/faa.gov/files/03_amtp_ch1.pdf) |
| Oil supply & temperature monitoring | —  | Oil supply & temperature monitoring → Shaft bearings & supports (service; explained)<br>Oil supply & temperature monitoring → Cockpit indications & monitoring (signal; explained) | Service and health monitoring | Not numerically simulated; Component anatomy | [FAA · AMT Powerplant, chapter 1](https://www.faa.gov/sites/faa.gov/files/03_amtp_ch1.pdf) |
| Vibration pickup & monitor | Vibration health data  | Vibration pickup & monitor → Cockpit indications & monitoring (signal; explained) | Monitoring only in this configuration | Explained, not synthesized; Component anatomy | [FAA · G-OBME accident lessons](https://www.faa.gov/lessons_learned/transport_airplane/accidents/G-OBME) |
| Chip / debris indication | —  | Chip / debris indication → Cockpit indications & monitoring (signal; explained) | Health indication, configuration dependent | Not simulated; Component anatomy | [FAA · AMT Powerplant, chapter 1](https://www.faa.gov/sites/faa.gov/files/03_amtp_ch1.pdf) |
| Bleed & variable-geometry interface | Optional valve / vane position and bleed demand  | Bleed & variable-geometry interface → Engine controller / FADEC (signal; explained) | Configuration-dependent control / service | Explained optional feature; Component anatomy | [FAA · AMT Powerplant, chapter 2](https://www.faa.gov/sites/faa.gov/files/04_amtp_ch2.pdf) |
| Controller channels & availability | —  | Controller channels & availability → Engine controller / FADEC (signal; explained) | Representative availability / fault concept | Explained, no injected fault logic; Component anatomy | [FAA · AMT Powerplant, chapter 2](https://www.faa.gov/sites/faa.gov/files/04_amtp_ch2.pdf) |
| Cockpit indications & monitoring | —  | Gas-path temperature probe → Cockpit indications & monitoring (signal; simulated)<br>Output torque sensing / estimate → Cockpit indications & monitoring (signal; simulated)<br>Accessory generator & electrical bus → Cockpit indications & monitoring (electrical; explained)<br>Oil supply & temperature monitoring → Cockpit indications & monitoring (signal; explained)<br>Vibration pickup & monitor → Cockpit indications & monitoring (signal; explained)<br>Chip / debris indication → Cockpit indications & monitoring (signal; explained)<br>Engine controller / FADEC → Cockpit indications & monitoring (signal; simulated) | Monitoring and pilot interface | Model-derived indications; Component anatomy | [FAA · AMT Powerplant, chapter 2](https://www.faa.gov/sites/faa.gov/files/04_amtp_ch2.pdf) |
| Fuel supply circuit | —  | — | — | —; Component anatomy | [FAA · AMT Powerplant, chapter 2](https://www.faa.gov/sites/faa.gov/files/04_amtp_ch2.pdf) |
| Aircraft fuel supply | —  | Aircraft fuel supply → Supply boost pump (fuel; explained) | — | —; Component anatomy | [FAA · AMT Powerplant, chapter 2](https://www.faa.gov/sites/faa.gov/files/04_amtp_ch2.pdf) |
| Supply boost pump | —  | Aircraft fuel supply → Supply boost pump (fuel; explained)<br>Supply boost pump → Fuel filter & element (fuel; explained) | — | —; Component anatomy | [FAA · AMT Powerplant, chapter 2](https://www.faa.gov/sites/faa.gov/files/04_amtp_ch2.pdf) |
| Fuel filter & element | —  | Supply boost pump → Fuel filter & element (fuel; explained)<br>Fuel filter & element → Fuel shutoff valve (fuel; explained) | — | —; Component anatomy | [FAA · AMT Powerplant, chapter 2](https://www.faa.gov/sites/faa.gov/files/04_amtp_ch2.pdf) |
| Fuel shutoff valve | —  | Fuel filter & element → Fuel shutoff valve (fuel; explained)<br>Fuel shutoff valve → Fuel supply & pump (fuel; explained) | — | —; Component anatomy | [FAA · AMT Powerplant, chapter 2](https://www.faa.gov/sites/faa.gov/files/04_amtp_ch2.pdf) |
| Dry-sump oil reservoir | —  | Pressure relief / regulation → Dry-sump oil reservoir (service; explained)<br>Breather & air/oil separator → Dry-sump oil reservoir (service; explained)<br>Dry-sump oil reservoir → Pressure oil pump (service; explained)<br>Oil cooler → Dry-sump oil reservoir (service; explained) | — | —; Component anatomy | [FAA · Lubrication & cooling systems](https://www.faa.gov/sites/faa.gov/files/08_amtp_ch6.pdf) |
| Pressure oil pump | —  | Pressure oil pump → Pressure relief / regulation (service; explained)<br>Dry-sump oil reservoir → Pressure oil pump (service; explained)<br>Pressure oil pump → Oil filter & element (service; explained) | — | —; Component anatomy | [FAA · Lubrication & cooling systems](https://www.faa.gov/sites/faa.gov/files/08_amtp_ch6.pdf) |
| Oil filter & element | —  | Oil filter & element → Gas-generator front bearing (service; explained)<br>Oil filter & element → Gas-generator rear bearing (service; explained)<br>Oil filter & element → Power-shaft bearing (service; explained)<br>Pressure oil pump → Oil filter & element (service; explained)<br>Oil filter & element → Shaft bearings & supports (service; explained) | — | —; Component anatomy | [FAA · Lubrication & cooling systems](https://www.faa.gov/sites/faa.gov/files/08_amtp_ch6.pdf) |
| Scavenge pump | —  | Gas-generator front bearing → Scavenge pump (service; explained)<br>Gas-generator rear bearing → Scavenge pump (service; explained)<br>Power-shaft bearing → Scavenge pump (service; explained)<br>Shaft bearings & supports → Scavenge pump (service; explained)<br>Scavenge pump → Oil cooler (service; explained) | — | —; Component anatomy | [FAA · Lubrication & cooling systems](https://www.faa.gov/sites/faa.gov/files/08_amtp_ch6.pdf) |
| Oil cooler | —  | Scavenge pump → Oil cooler (service; explained)<br>Oil cooler → Dry-sump oil reservoir (service; explained) | — | —; Component anatomy | [FAA · Lubrication & cooling systems](https://www.faa.gov/sites/faa.gov/files/08_amtp_ch6.pdf) |
| Breather & air/oil separator | —  | Breather & air/oil separator → Dry-sump oil reservoir (service; explained)<br>Shaft bearings & supports → Breather & air/oil separator (service; explained)<br>Breather & air/oil separator → Separated breather air outlet (service; explained) | — | —; Component anatomy | [FAA · Lubrication & cooling systems](https://www.faa.gov/sites/faa.gov/files/08_amtp_ch6.pdf) |
| Aircraft electrical bus | —  | Battery / ground electrical source → Aircraft electrical bus (electrical; explained)<br>Aircraft electrical bus → Starting control command (electrical; explained)<br>Aircraft electrical bus → Ignition exciter (electrical; explained) | — | —; Component anatomy | [FAA · Ignition & electrical systems](https://www.faa.gov/sites/faa.gov/files/06_amtp_ch4.pdf) |
| Battery / ground electrical source | —  | Battery / ground electrical source → Aircraft electrical bus (electrical; explained) | — | —; Component anatomy | [FAA · Engine starting systems](https://www.faa.gov/sites/faa.gov/files/07_amtp_ch5.pdf) |
| Engine starter | —  | Pneumatic starter control valve → Engine starter (service; explained)<br>Engine starter → Accessory gearbox & extraction (mechanical; explained) | — | —; Component anatomy | [FAA · Engine starting systems](https://www.faa.gov/sites/faa.gov/files/07_amtp_ch5.pdf) |
| APU / ground starting air | —  | APU / ground starting air → Pneumatic starter control valve (service; explained) | — | —; Component anatomy | [FAA · Engine starting systems](https://www.faa.gov/sites/faa.gov/files/07_amtp_ch5.pdf) |
| Ignition exciter | —  | Aircraft electrical bus → Ignition exciter (electrical; explained)<br>Ignition exciter → Igniter (electrical; explained) | — | —; Component anatomy | [FAA · Ignition & electrical systems](https://www.faa.gov/sites/faa.gov/files/06_amtp_ch4.pdf) |
| Fuel pump bypass / relief | —  | Fuel supply & pump → Fuel pump bypass / relief (fuel; explained)<br>Fuel pump bypass / relief → Fuel supply & pump (fuel; explained) | — | —; Component anatomy | [FAA · AMT Powerplant, chapter 2](https://www.faa.gov/sites/faa.gov/files/04_amtp_ch2.pdf) |
| Pressure relief / regulation | —  | Pressure oil pump → Pressure relief / regulation (service; explained)<br>Pressure relief / regulation → Dry-sump oil reservoir (service; explained) | — | —; Component anatomy | [FAA · Lubrication & cooling systems](https://www.faa.gov/sites/faa.gov/files/08_amtp_ch6.pdf) |
| Separated breather air outlet | —  | Breather & air/oil separator → Separated breather air outlet (service; explained) | — | —; Component anatomy | [FAA · Lubrication & cooling systems](https://www.faa.gov/sites/faa.gov/files/08_amtp_ch6.pdf) |
| Starting control command | —  | Aircraft electrical bus → Starting control command (electrical; explained)<br>Starting control command → Pneumatic starter control valve (electrical; explained) | — | —; Component anatomy | [FAA · Engine starting systems](https://www.faa.gov/sites/faa.gov/files/07_amtp_ch5.pdf) |
| Pneumatic starter control valve | —  | Starting control command → Pneumatic starter control valve (electrical; explained)<br>APU / ground starting air → Pneumatic starter control valve (service; explained)<br>Pneumatic starter control valve → Engine starter (service; explained) | — | —; Component anatomy | [FAA · Engine starting systems](https://www.faa.gov/sites/faa.gov/files/07_amtp_ch5.pdf) |
| Filter housing & cap | —  | — | — | —; Component anatomy | [FAA · AMT Powerplant, chapter 2](https://www.faa.gov/sites/faa.gov/files/04_amtp_ch2.pdf) |
| Pleated filter element | —  | — | — | —; Component anatomy | [FAA · AMT Powerplant, chapter 2](https://www.faa.gov/sites/faa.gov/files/04_amtp_ch2.pdf) |
| Filter housing & cap | —  | — | — | —; Component anatomy | [FAA · Lubrication & cooling systems](https://www.faa.gov/sites/faa.gov/files/08_amtp_ch6.pdf) |
| Pleated filter element | —  | — | — | —; Component anatomy | [FAA · Lubrication & cooling systems](https://www.faa.gov/sites/faa.gov/files/08_amtp_ch6.pdf) |

## Reading the signals

Ng/Np and N1/N2 are model-specific shaft labels; pre-reduction speed and post-reduction rotor/prop speed are different quantities. Temperature labels identify the physical plane. Calculated T4 is not measured EGT/ITT. Pressure entries are total quantities. Fuel flow is an actuator state; equivalent FMU position is an inference. Oil, vibration and chip-monitoring entries explain their hardware and information paths. Variable geometry, bleed arrangements and control-channel behavior depend on the installation.
