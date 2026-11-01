# Verification evidence

Checks apply to the declared synthetic equations and implemented UI. They do not establish physical fidelity to an engine or production FADEC.

## Model checks

`npm test` passes six behavior/invariant groups:

1. Air + fuel mass continuity, fuel heat addition and turbine enthalpy/work closure; torque-balance arithmetic; finite positive shaft states and the running temperature envelope across load bounds (25–100%) and ceiling cases (65%, 72%, 100%).
2. Load increase initially creates negative net power-shaft torque, followed by increased fuel and turbine torque and recovery.
3. Fuel saturation produces persistent speed droop, prevents integral windup and permits recovery when released.
4. Temperature-target and Ng-target fuel caps can become active independently of the fuel ceiling.
5. Identical state at 30 s under two different render frame cadences, deterministic reset, and invalid timestep rejection.
6. 120 Hz versus 240 Hz timestep convergence for the load transient.

For the 35% → 55% load experiment, Np reaches a minimum of approximately **94.29%**, returns to **98.40% at 10 s**, **99.64% at 20 s**, and **99.99% at 45 s**. At 45 s, fuel is approximately **0.02677 kg/s** and turbine torque **447.98 N m**. These are outputs of the synthetic model, not measured engine values.

For 70% reference load and a 72% fuel ceiling, browser observation after settling showed **85.94% Np**, **0.02376 kg/s fuel**, and the **Fuel ceiling active** state. The external load torque law falls with speed, so persistent droop is an equilibrium rather than an unmodeled zero-speed collapse.

## Actual browser checks

Local static build opened in the in-app Chromium browser on an Apple M2 Pro. The graphics context reported **ANGLE Metal Renderer: Apple M2 Pro**. This was a hardware WebGL rendering path, not a software-only or static screenshot check.

Inspected actual opening scene, selection/isolation, live experiment, and phone layout. Desktop used the browser's normal 1265 px viewport; phone used a 390 × 844 px override. Phone layout showed no horizontal overflow. The original 3D cutaway remained visible, controls wrapped, the component selector remained usable and the experiment used two labeled sliders.

- Orbit and zoom through HTML buttons, then select Combustor and isolate it: camera position `[0.84987, 5.3, 15.20782]`, target `[0, 0.02, 0]` and zoom `1.2` were unchanged across selection/isolation.
- Model pause and reset worked: paused reset restored `t = 0`, load 35%, fuel ceiling 100% and the settled running state.
- Load-step UI observation showed Np decreasing first (99.54% near 0.12 s) and turbine torque exceeding external load torque during recovery (about 449 versus 418 N m near 7.7 s).
- Fuel-limit UI observation showed the limiting state and persistent droop, matching the deterministic model's qualitative behavior.
- Reduced visual motion control remained separate from model pause. Navigation and source links used semantic HTML controls.

Final browser flow checks selected all ten components, and each selection preserved the same orbit, target and zoom. Control and airframe views also preserved it. Enter activated the Free power turbine selection; explicit camera reset restored position `[6, 5.3, 14]`, target `[0, 0.02, 0]`, zoom `1`. The sources dialog opened with seven public reference links and closed with Escape. The explicitly selected 2D fallback (`?render=schematic`) retained component selection and the running load-step model; its actual diagram was inspected at desktop reading size. No browser warnings or errors were reported in those checked flows. Automatic WebGL failure recovery was reviewed in code, not forced in this browser. Browser checks are scoped flow checks, not exhaustive accessibility, GPU compatibility or cross-browser certification.

## Content and publication boundary

Only original product source and pinned official Three.js software are packaged. Public NASA/FAA references are linked in the product and the source ledger. No private directories were opened for the build; no private manuals, screenshots, data, parameters, identifiers or manufacturer control logic were copied. Original project material is MIT-licensed; Three.js's MIT notice is included in the built vendor directory. No CDN requests, analytics, credentials or user data are part of the app.
