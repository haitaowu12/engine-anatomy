# Engine Anatomy: three synthetic running models

These original generic models explain engine–airframe energy and control causality. Every numerical parameter, geometry, efficiency, pressure allocation and controller gain is synthetic. No calibrated maps, manufacturer control schedules, proprietary training input or certified engine/flight performance are included.

## Common implementation and time

`src/simulation.js` supplies the original free-turbine thermodynamic and shaft relationships. `src/plants.js` supplies the three plant/control adapters, states and fixed-step runner. `src/manifest.js` defines component hierarchy, physical anchors, shaft membership, typed connections and source/fidelity metadata. `src/renderer.js` adapts the common state to original Three.js geometry; `src/schematic.js` provides a functional SVG fallback. `src/lessons.js` supplies guided input events and explanatory stages. `src/app.js` owns accessible controls, selection and live narrative/plots.

All numerical integration uses an explicit **1/120 s** fixed step and an elapsed-time accumulator, independent of render frame rate. A hidden document stops the model clock; missed background time is not replayed. Pause freezes process state and animation while camera/selection remain usable. Reset restores a settled running engine, not a cold start. Shaft angles integrate angular velocity in the fixed-step state. All displayed mechanical rotation is slowed **250×**, with the declared gearing applied afterward. Geometric pitch reflects the actual prescribed or lagged pitch state. Gas markers indicate direction/relative flow, not CFD or tracked fluid particles.

The explanatory sequence uses trial time markers to direct attention to causal stages. Its current numerical readouts always come from the running state. Clicking a stage locates its component; it does not rewind time or imply that a different state has been restored.

## Common thermodynamic assumptions

- Constant `cp = 1005 J/(kg K)`, `gamma = 1.4`, fuel heating value `43 MJ/kg`, combustion efficiency `0.98`.
- Inlet total temperature is a prescribed 278–318 K boundary; inlet total pressure is fixed at 101325 Pa. Forward airspeed is prescribed separately. Inlet ram recovery and a fully matched flight-condition solution are **not** modeled.
- Compressor, turbine and nozzle relations are idealized; detailed cooling, bleed streams, variable properties, chemistry, maps, corrected-flow matching and surge/stall are omitted.
- Combustor gas mass is core air mass plus metered fuel. Fuel sensible enthalpy is approximated by injection at compressor-delivery temperature. Added heat is `mf × LHV × eta_b`; `T4 = T3 + heat/(mg cp)`.
- Turbine work is `mg cp (Tin − Tout)`. Compressor/fan work is the appropriate air mass flow times `cp ΔT`.
- Shaft torque is power divided by positive shaft angular speed. Each shaft obeys `J dω/dt = Qdrive − Qresistance − Qloss`. The supported running envelope begins with positive speeds; it contains no start/stop sequence.
- Total/static station quantities are identified. The displayed calculated **T4 is not a measured EGT or ITT**. A separate idealized thermocouple state, with a 0.5 s response time, is placed at an explicitly identified downstream plane.

## Free-turbine core: helicopter and turboprop

For gas-generator fraction `n = omega_g/1000`, core air flow is `2.4 n kg/s` and synthetic compressor pressure ratio is `1 + 5 n²`. Compressor efficiency is `0.80`. The gas-generator turbine gets expansion ratio `(0.95 pi_c)^0.7`; the free turbine gets the remaining ratio, assuming discharge to the reference ambient pressure. Both turbine efficiencies are `0.86`. This pressure allocation replaces component matching; it is not a turbine map.

The gas-generator inertia is `0.5 kg m²`; its turbine drives the compressor plus `12 kW` base accessories, optional added extraction, and `10 kW n²` lumped loss. Reference Ng is `1000 rad/s`.

The independent power-shaft inertia is `8 kg m²`, including reflected external inertia. Reference Np is `500 rad/s`; power-shaft loss torque is `8 Np N m`. There is no mechanical connection between the gas-generator and power shafts. Gas enthalpy couples their energy transfer.

### Helicopter pair

The pilot input represents collective/equivalent rotor load, not a FADEC collective actuator. It prescribes schematic geometric blade pitch `8 + 18 × demand` degrees. Resistance is `Qload = demand × 800 × Np² N m`; actual absorbed load power is `Qload × omega_p`. This is a declared equivalent-load law, not blade-element or full helicopter aerodynamics.

The engine PI governor uses error `1 − Np` and fuel request `0.02344 + 0.060 error + integral kg/s`, with integral derivative `0.012 error`. Conditional integration prevents windup against limits.

A synthetic 12:1 main reduction gives main-rotor speed `omega_p/12`. A separate synthetic 3:1 tail route is shown. The main/tail load is aggregated into the external torque and reflected inertia; no yaw or elastic drivetrain dynamics run. The freewheel is shown in its engaged running regime; autorotation and clutch overrun are not simulated.

An **idealized hover-force estimate** uses 94% of absorbed mechanical power and actuator-disk relation `T = [P sqrt(2 rho A)]^(2/3)`, with synthetic disk area `45 m²` and `rho = 101325/(287 T_inlet)`. It does not use the drawn rotor's schematic dimensions, solve induced-loss details or calculate aircraft altitude. Helicopter airspeed is fixed to zero for this hover context.

Load step: collective rises; resisting torque initially exceeds turbine torque; Np dips; fuel is requested and metered; gas-generator work and free-turbine torque rise; speed recovers if margin exists. A low fuel ceiling produces persistent speed droop because resistance decreases with speed.

### Turboprop pair

The chosen engine fuel loop regulates requested turbine-side torque, **not Np**. Target torque is `800 demand + 8 N m`. Fuel request is `0.02112 + 0.000055 (Qref − Qturbine) + integral kg/s`; the integral derivative is `0.000018 (Qref − Qturbine)`.

A **separate propeller governor** regulates post-reduction prop speed. The ideal rigid 10:1 reduction gives `omega_prop = omega_p/10`, so normalized prop speed equals Np while actual speeds differ. The governor uses prop overspeed `Np−1`; equivalent pitch command is `clamp(0.35 + 1.25 (Np−1) + pitch_integral, 0.18, 1.1)`, with integral derivative `0.45 (Np−1)` and anti-windup. The PCU/pitch actuator has a 0.45 s first-order response. Geometric pitch is `8 + 32 beta` degrees. Hydraulic pressure, feather, reverse and certification limits are not modeled.

Propeller resistance is `800 beta Np² (0.85 + 0.15 V/70) N m`. This synthetic pitch/load relation does not equate geometric pitch with angle of attack. Forward-flight thrust estimate is `0.78 Pshaft/V`, for prescribed airspeed 45–100 m/s. The estimate omits detailed blade aerodynamics, induced flow and variation of propulsive efficiency; it cannot be used for static thrust or takeoff prediction.

Power step: fuel and torque rise; prop speed initially rises; the separate governor requests coarser pitch; the actuator increases absorbed torque; speed recovers near its reference at greater power. Under a fuel limit the prop governor can still hold speed by unloading pitch while the engine fails its torque target. **Normal Np does not prove requested torque is available.** Public integrated engine/propeller control exists, but that is not the generic separated architecture selected here.

### Shared shaft-power fuel limits

Minimum running fuel is `0.012 kg/s`. Maximum is `0.033 × ceiling_fraction kg/s` (65–100% slider). An algebraic fuel cap targets calculated `T4 = 1100 K`; an Ng-target cap is `clamp(0.02344 + 0.08 (1.23−Ng), 0.012, 0.033)`. The most restrictive cap is identified independently of the current raw request. Fuel metering follows its limited command with time constant 0.28 s. Actuator lag can briefly cross an algebraic target; these are illustrative command targets, not certified hard protection.

## Direct-drive two-spool turbofan

HP/HPT/HPC and LP/LPT/fan/LPC are independent continuous assemblies. The LP shaft runs inside the hollow HP shaft with clearance. Fan and LPC are direct drive; no fan reduction gear is claimed.

- Reference HP speed is 1000 rad/s; reference LP speed is 500 rad/s. Inertias are `1 kg m²` HP and `5 kg m²` LP.
- Core air flow is `2.4 N2 kg/s`; bypass flow is `12 N1 kg/s`. Fan flow is their sum; bypass ratio is therefore state dependent, not a calibrated fixed engine value.
- Fan pressure ratio is `1 + 0.45 N1²` (efficiency 0.85); LPC ratio `1 + 0.8 N1²` and HPC ratio `1 + 4 N2²` (efficiencies 0.82).
- Fan work uses total fan air flow; LPC/HPC work uses core flow only. Combustion uses the core gas mass.
- Available turbine expansion ratio is `(0.95 pi_fan pi_LPC pi_HPC)/1.35`. HPT gets the 0.55 power of that ratio; LPT gets the remainder. Turbine efficiency is 0.87. The synthetic split leaves core nozzle total/ambient pressure ratio 1.35.
- HP resistance is HPC plus `20 kW` base accessories, optional added extraction and `8 kW N2²` loss. LP resistance is fan + LPC plus `10 N1 N m` shaft loss.
- A demand maps to N1 reference `0.65 + 0.4 demand`. The PI request is `0.036 + 0.085 (N1ref−N1) + integral kg/s`, integral derivative `0.025 (N1ref−N1)`.
- Fuel minimum is 0.014 kg/s; maximum `0.065 × ceiling_fraction`. Other caps target calculated T4 = 1400 K and use `0.038 + 0.1 (1.3−N2)` for illustrative HP-speed protection. Metering time constant is 0.4 s.
- Idealized expanded nozzle velocities use `Vexit = sqrt(2 eta_nozzle cp Ttotal [1−pressure_ratio^(-2/7)])`, with nozzle efficiency 0.95. Bypass pressure ratio is fan ratio; core ratio is 1.35. Net thrust is `mbypass(Vbypass−V0) + mgas(Vcore−V0)`. Pressure thrust is omitted through ideal-expansion assumptions. Prescribed V0 is 60–160 m/s. Inlet total conditions remain independently prescribed; ram recovery/flight-condition matching are omitted.

Thrust step: fuel responds with lag; each spool accelerates from its own torque imbalance; core and bypass flows/exit velocities change; net thrust estimate changes. A high reference may be prevented by an active N2/temperature/fuel target. Wing lift, aircraft acceleration, speed and altitude are not solved. Force arrows indicate direction only.

## Interface and fidelity boundaries

The typed catalog distinguishes origin/destination, units, control/protection/monitor/command role, measured versus inferred or prescribed status, configuration and public source. Shaft-speed pickups are ideal model-derived measurements. Post-reduction Nr/prop speed has a separate physical anchor from pre-reduction Np. Torque is calculated from modeled shaft power and speed. FMU equivalent opening is inferred from its fuel state, not an independent flow meter. The gas-temperature probe has lag and is a monitoring signal in this chosen loop; synthetic temperature limiting uses the calculated thermal state.

Electrical bus supply is assumed available. Oil, chip and vibration health paths, optional bleed/variable stators, channel redundancy, voting and fault accommodation are explained, not numerically simulated. A vibration monitor feeds cockpit/health monitoring, not an invented generic FADEC fuel command. No selector claims every real engine has the same sensors or control destinations.

## Validation scope

Tests check finite positive states across input corners; mass/heat/work and shaft balances; distinct normal and limiting responses; fixed-step frame-cadence reproducibility; reset; timestep refinement; and graph/sensor/control-boundary consistency. Original first-release regressions are retained. These verify the declared equations and implementation, **not fidelity to a measured engine**. Hardware WebGL and visible mechanical paths require separate browser inspection. Cross-browser/GPU certification, real performance matching, start/stop, surge/stall, combustion stability, bearing/oil/electrical circuits, blade stress/life, emissions, reverse/feather, real fault handling and full aircraft dynamics remain outside scope.



## Version 3 construction, services and learning views

The richer anatomy does not change these equations. Detailed discs, stators, liners, bearings, seals, filters, starters and drives are construction explanations. Fuel/oil/electrical route animation communicates direction without creating unmodeled pressure, temperature or electrical states. Pressure supply, scavenge, relief, recovered oil and separated breather air have distinct graph branches. Electric and pneumatic starting examples distinguish command information from delivered starting energy. Conceptual start/shutdown walkthroughs pause the existing running model and do not claim numerical coast-up/coast-down.

The Gas · heat · work view displays existing total-temperature stations and shaft power terms. For each shaft, drive minus resisting power equals net torque times current angular speed, the modeled rate of change of rotational kinetic energy. These work bars are not a whole-engine fuel-energy accounting diagram. Real gains, geometry, cooling splits and engine maps are not inferred from their visual detail.

The fixed-ring reduction illustrations use original tooth counts matching the already declared 12:1 and 10:1 ratios. They do not add gearbox dynamics, efficiency maps or manufacturing contact analysis. The direct-drive fan model retains no reduction. Axial/centrifugal, forward/reverse flow and direct/geared fan are explicit source-backed comparisons, not hidden changes to the running plants.
