# Engine Anatomy: educational model

This original generic model demonstrates energy transfer and a load/governor transient. It has no calibrated component maps or engine-specific data. Numerical parameters, geometry, efficiencies, pressure allocation, controller gains and limits are synthetic. It is not an engine performance prediction, design tool, operating guide or certified model.

## Architecture and units

`src/simulation.js` owns deterministic state and equations in SI units. `src/components.js` owns component explanations and public-source links. `src/renderer.js` adapts that state to original Three.js geometry. `src/app.js` owns HTML controls, a fixed-step accumulator and history plots. A future turbofan can supply its own model and render adapter; this release contains only a turboshaft simulation and a factual turbofan comparison.

The free-turbine shaft is mechanically independent of the gas-generator shaft. A generic rear-output arrangement is used for clarity. Gas transfers energy between turbines; the shafts do not connect mechanically. Geometry, blade counts, casing cutaway, control boxes and service routing are schematic, not a manufacturer replica. Exploded mode separates component groups for inspection; it is not an assembly or maintenance sequence.

## Thermodynamics

The running model assumes constant specific heat for air and gas (`cp = 1005 J/(kg K)`, `gamma = 1.4`), ambient `T2 = 288 K` and `p2 = 101325 Pa`. No altitude, inlet ram recovery, bleed or cooling streams are modeled.

For gas-generator speed fraction `n = omega_g / 1000`:

- Air mass flow `ma = 2.4 n kg/s`.
- Synthetic compressor pressure ratio `pi_c = 1 + 5 n²`.
- Compressor exit `T3 = T2 [1 + (pi_c^((gamma-1)/gamma) - 1)/eta_c]`, `eta_c = 0.80`.
- Compressor power `Pc = ma cp (T3-T2)`.
- Gas mass flow `mg = ma + mf`; there is no bleed, so mass continuity closes explicitly.
- Fuel heating `Q = mf LHV eta_b`, with `LHV = 43 MJ/kg` and `eta_b = 0.98`.
- `T4 = T3 + Q/(mg cp)`. Injected fuel enters at `T3` in this idealization; fuel sensible enthalpy, variable cp and chemistry are omitted.
- Combustor pressure loss is 5%; total available expansion ratio is `0.95 pi_c`.
- Gas-generator turbine gets a synthetic pressure ratio `(0.95 pi_c)^0.7`; the free turbine gets the remaining ratio. This is a declared pressure allocation, not a turbine matching calculation.
- Each turbine uses `Tout = Tin [1 - eta_t (1-pi_t^(-(gamma-1)/gamma))]`, with `eta_t = 0.86`.
- Shaft power extracted from each turbine is `mg cp (Tin-Tout)`.

The two turbine powers sum to the modeled gas enthalpy drop. The remaining exhaust enthalpy and losses carry energy out. No nozzle thrust, surge margin, corrected-flow matching or component maps are calculated. The 5% pressure loss is lumped; turbine discharge is assumed to ambient pressure.

## Shaft dynamics and external load

`J d(omega)/dt = torque_turbine - torque_load - torque_loss`, and `torque = power / omega` in the supported running envelope.

The gas-generator shaft (`Ng`) drives the compressor plus a fixed 12 kW accessory draw and a synthetic `10 kW n²` mechanical loss. It has `Jg = 0.5 kg m²` and reference speed `1000 rad/s`.

The free power shaft (`Np`) drives an external mechanical load. It has `Jp = 8 kg m²`, reference speed `500 rad/s`, and loss torque `8 (omega_p/500) N m`. The aggregate inertia includes reflected external inertia; no separate airframe rotor dynamics run.

External load torque is `load_fraction × 800 × (omega_p/500)² N m`. The percentage slider denotes demand at reference speed: 100% would require 400 kW there. Actual delivered load power is `load_torque × omega_p`, so it falls when shaft speed falls. This speed-squared torque law is a synthetic mechanical-load characteristic, not a helicopter aerodynamic model. Rotor collective would change pitch/aerodynamic demand in an aircraft; the slider does not model collective kinematics or a FADEC collective actuator.

A representative ideal 10:1 reduction is shown in the output hub. Individual gear dynamics and loss are not resolved; losses and reflected inertia are lumped at the free shaft.

## Simplified fuel control

A fixed Np reference of 100% is compared to current model speed (ideal sensors). The original PI example requests `mf_raw = 0.02344 + 0.060 (1-Np) + integral`, with integral derivative `0.012 (1-Np)`. Conditional integration prevents windup while saturated and permits unwinding. The integral is bounded to `[-0.012, 0.022] kg/s`.

The request is limited by:

- Minimum running fuel: `0.012 kg/s`.
- Fuel ceiling: `0.033 × ceiling_fraction kg/s` (slider 65–100%).
- Algebraic temperature-target fuel cap corresponding to `T4 = 1100 K` at current airflow and compressor exit temperature.
- Ng-target fuel cap `clamp(0.02344 + 0.08 (1.23-Ng), 0.012, 0.033) kg/s`.

A first-order metering actuator with `tau = 0.28 s` approaches the limited command. Limits act on the command; actuator lag can briefly exceed an algebraic temperature target after a transient. They are illustrative control targets, not certified hard protection. The supported running envelope avoids nonpositive shaft speed; invalid numerical state stops the model and requires reset.

A load increase initially increases resisting torque without instantly changing fuel or turbine torque. Np decreases, the governor requests fuel, the actuator admits it, gas energy and Ng rise, and free-turbine torque increases. Under a sufficient fuel ceiling the speed recovers. Under a low ceiling the shaft settles below the speed target because load torque is speed dependent. No control law, limits or values represent production FADEC implementation.

## Time and motion

Explicit fixed-step integration runs at 120 Hz using an elapsed-time accumulator. Browser frame rate does not choose the simulation step. The model pauses its clock while the document is hidden; it does not simulate missed background time. Pause freezes the model and all process animation; orbit controls remain available.

Shaft angles are integrated in the fixed-step state. Displayed shaft rotation is slowed **250×**, independently of model time. The output hub uses a further 10:1 ratio. Gas markers indicate direction and relative mass flow; they are not fluid particles or a CFD solution. Reduced-motion mode freezes process visuals while live numerical simulation continues. Reset restores a settled running state, not a cold engine.

## Supported conclusions and validation limits

This release supports causal demonstrations of mass/energy relationships, two shaft torque balances, load-induced speed deviation, actuator lag, governor response and saturation. Tests check numerical invariants, finite positive states over all slider bounds, transient direction/recovery, limiting and anti-windup, deterministic reset, different render cadences and timestep convergence.

These checks verify properties of the declared equations, not fidelity to an actual engine. No independent engine-test data, calibrated maps, surge/stall analysis, thermal certification, blade stress, life prediction, combustion stability, emissions, startup/shutdown, electrical fault behavior, sensor dynamics or oil circuit dynamics are represented. No quantitative flight or engine-operating conclusion should be drawn.

## Public physics context

- [NASA Glenn, Brayton cycle](https://www.grc.nasa.gov/www/k-12/airplane/brayton.html): compression, heat addition and turbine work.
- [FAA Helicopter Flying Handbook, ch. 4](https://www.faa.gov/sites/faa.gov/files/regulations_policies/handbooks_manuals/aviation/helicopter_flying_handbook/hfh_ch04.pdf#page=10), pp. 4-9–4-10: free turbine, compressor/stator, transmission and accessories.
- [NASA TM-20210014065](https://ntrs.nasa.gov/api/citations/20210014065/downloads/TM-20210014065.pdf?attachment=true), §§3–4: shaft dynamics and a particular research PI fuel-control architecture. Not a universal production control specification.
- [NASA T-MATS model construction](https://ntrs.nasa.gov/api/citations/20150000147/downloads/20150000147.pdf), §§I–II and V: richer modular thermodynamic modeling and validation context. [T-MATS](https://github.com/nasa/T-MATS) is a reference; no code is embedded.
