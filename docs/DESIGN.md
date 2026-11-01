# Engine Anatomy design brief

Primary task: select a component, follow its energy and control connections, then apply a load change and explain the resulting shaft-speed response.

Audience: curious technical readers and engineers revisiting gas turbines. Desktop canvas with a reading inspector; phone stacks the same functional regions. Static hosting, no account, no telemetry or backend.

Direction: a working engineering atlas with a warm paper surround and a dark, illuminated original cutaway. Cool compressor, warm combustion and copper power-shaft accents carry functional meaning. The schematic owns the largest area; the model's live numbers sit beside experiments rather than in a separate decorative dashboard.

Inspected reference: https://ciechanow.ski/internal-combustion-engine/ (opening desktop pixels, 1265px wide, 2026-11-01). Useful relationship: isolated original mechanical geometry with a nearby plain-language explanation, meaningful global motion control. Our atlas is denser and uses a persistent inspector because component selection and closed-loop experiments are the primary task. No artwork, typography assets or code copied. Mobile reference behavior was not inspected.

Accepted product direction is an interactive anatomy atlas, matching the user's existing Railway Anatomy ambition. One complete representative slice is sufficient before refinement. Final QA must inspect desktop scene/inspector, live controller response, narrow reading order and actual selection/reset behavior. Selection never changes camera position, target, or zoom. Only explicit camera buttons reset the camera.

Scope: generic free-turbine turboshaft, explanatory comparison to two-spool turbofan (no turbofan simulator). Numerical and geometry assumptions are synthetic. Only independently public-linked NASA/FAA facts and original prose/geometry are publishable. No private-source reference material is an input to implementation.
