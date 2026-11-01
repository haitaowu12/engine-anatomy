# Engine Anatomy

An original interactive engineering atlas of **three engine–airframe pairs**. Trace what turns what, select a sensor or actuator, then follow a guided transient through the same model.

- [GitHub Pages — public](https://haitaowu12.github.io/engine-anatomy/)
- [GPT Site — previous release](https://engine-anatomy.techiesea.chatgpt.site)

| Pair | Mechanical and control story |
|---|---|
| Turboshaft / helicopter | Independent gas-generator and power shafts; reduction/freewheel context; main transmission, mast, main rotor and tail drive. Collective changes load; engine fuel governing recovers Np. |
| Turboprop / propeller aircraft | An independent power shaft runs forward inside the hollow gas-generator shaft to the reduction gearbox and pitchable propeller. The engine fuel loop regulates requested torque; a separate propeller governor/PCU regulates speed using pitch. |
| Direct-drive turbofan / jet aircraft | HPT/HPC on the HP shaft; LPT/fan/LPC on the LP shaft; separate core and bypass streams; original under-wing installation. A demand-derived N1 reference drives fuel response and independent spool dynamics. |

## Learn in the workspace

Use **Whole aircraft**, **Installed** and **Shaft section** presets. Select components in the grouped hierarchy or directly in 3D. Selection preserves the camera; **Focus** and **Return view** are explicit actions. Use **Shafts & drive** to trace complete continuous assemblies, including the concentric-shaft section inset. Other lenses separate gas/heat, control information, actuator commands, electrical supply and health/service interfaces.

Each component/interface explains its mechanism, motion, numerical fidelity, signal role and public basis. Speed pickups have distinct shaft/geared locations. Gas-temperature probe planes are explicit; calculated T4 is not mislabeled as measured EGT/ITT. Fuel command and lagged actual metering are separate. Health monitoring and optional/configuration-dependent interfaces are identified without fabricated measurements or generic fault-accommodation claims.

Guided trials start from a settled running baseline at t = 0. A five-step causal sequence, live explanation, event highlight and current values stay beside the model. Charts are supporting disclosures with separate speed/reference and driving/resisting-torque plots. Trial steps locate components; they do not scrub time. Pause, reset, reduced motion and a functional schematic fallback are provided.

## Run locally

Requires Node.js 22. Python 3 is only needed for the optional preview server.

```sh
npm ci
npm test
npm run build
python3 -m http.server 4173 --bind 127.0.0.1 --directory dist
```

Open `http://127.0.0.1:4173`. Share a pair with `?engine=turboprop` or `?engine=turbofan`. Select the fallback explicitly with `?render=schematic&engine=turbofan`. WebGL initialization failure also uses the fallback.

The static build bundles official pinned Three.js locally and versions its application modules. It requires no CDN, account, telemetry or backend. The GPT Site's existing identity is retained in `.openai/hosting.json`; release audience and deployment are verified separately through the native hosting tools.

## Source and evidence

- [`docs/MODEL.md`](docs/MODEL.md): equations, gains, limitations and architecture-specific control paths.
- [`docs/INTERFACES.md`](docs/INTERFACES.md): representative typed interface catalog generated from `src/manifest.js`.
- [`docs/SOURCES.md`](docs/SOURCES.md): public claims, asset provenance and rights.
- [`docs/VERIFICATION.md`](docs/VERIFICATION.md): numerical and actual browser evidence.
- [`src/plants.js`](src/plants.js): three deterministic plant/control adapters over a fixed-step simulation.
- [`src/manifest.js`](src/manifest.js): semantic component IDs, assembly hierarchy, anchors, shaft membership and typed connections.
- [`src/renderer.js`](src/renderer.js): original engine and aircraft geometry; continuous mechanical assemblies and directed overlays.
- [`src/lessons.js`](src/lessons.js): guided input events and causal explanations.

The values and geometry are **synthetic educational assumptions**, not manufacturer engine maps, production control logic or calibrated flight performance. Startup, surge/stall, reverse/feather, detailed aerodynamics, real fault response and six-degree-of-freedom aircraft dynamics are outside the simulation scope. Oil, electrical-supply and redundancy/channel interfaces are explained where shown; their circuit dynamics and fault-accommodation logic are not simulated. Thrust and hover-force estimates are explicitly simplified; wing lift is not engine thrust.

MIT for original project code/assets. Three.js's MIT notice is included in the build. Public references remain with their publishers; no manuals, artwork, private training materials or proprietary parameters are distributed.
