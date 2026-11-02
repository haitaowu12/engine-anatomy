# Engine Anatomy 5 — authored geometry and the H175 mechanism study

## Why another correction was needed

Version 4 corrected several installation errors and made the aircraft recognizable, but its visual review did not establish the detail and composition requested by the user. A component inventory and a passing geometry test cannot establish that a housing, mounting interface or inspection view explains its construction.

The new review began from `98769a2a30e8354c5a7bdbd39539b18203ce0e2b`. Its two baseline browser states are [the installed engine](audit-5/01-engine-before.jpg) and [the complete helicopter](audit-5/02-helicopter-before.jpg). They were captured in this review, using the actual SVG fallback at a 1348 × 926 viewport. The installed engine shows the remaining block-shaped accessories, unsupported-looking probes and faceted blade shading; the airframe shows why a recognizable outline alone did not reach the requested finish.

## Reference comparison

[Teardown](https://github.com/elvarofficial/teardown) supplies a workflow and a small set of authored examples. Its polished robotic showcases are animated reference images; the editable examples have their own subject-specific geometry. Their useful lessons here are shaped shells, visible connections, controlled part separation and close-up composition. There is no imported model library or quality switch that automatically supplies the missing subject detail.

The correction therefore changes authored geometry and camera/stage behavior as well as material treatment. Physical-model evidence and observed visual results are recorded separately from numerical correctness. Existing shaft, gearing, inspection/reassembly and actual-projector regressions remain relevant to the revised geometry.

## Separate H175 study

**LEGO H175** is a separate entry at `h175.html`, linked from the shared header and footer. It refers to the LEGO Technic Airbus H175 Rescue Helicopter, set 42145. The original geometry follows the recognizable set arrangement and the functions documented in the official product description and building instructions. It does not reuse a real-helicopter gas-turbine model for a battery-powered construction toy.

The study distinguishes the motor supply and powered branches from the manual pitch and access controls. A mechanism selected for inspection is a camera/learning choice, separate from which branch is driven. Geometric linkage constraints and their declared simplifications are documented in [H175-STUDY.md](H175-STUDY.md).

The official product and instruction pages remain external references. No instruction pages, product photography, official stickers, logos, downloaded set model or private household information is bundled. The page does not claim a complete 2,001-piece reconstruction, measured set gear ratios or flight dynamics.

## Navigation and release integration

- The shared **Engines / LEGO H175** navigation distinguishes the two learning contexts.
- Circuit choice is above the diagram, so changing from Fuel to Oil does not require reaching the end of the previous circuit.
- Every public HTML page receives the same build digest and local dependency versions. The build recognizes module names containing digits, including the H175 modules.
- Release validation follows references from every entry page and stylesheet, verifies unique element IDs, and preserves nested documentation and screenshot files.

## Geometry and installation corrections

Housing bevels preserve the specified outer dimensions. Pressure-shell sectors have flanges, while closed casing profiles match the corresponding tapered open sections. Accessories use paired supports and mounting feet; gas-path sensors, the optional bleed port and the igniter meet their actual casing or exhaust surface. Those fittings follow their supporting sector during inspection. The post-reduction rotor pickup belongs to the driven rotor context and selecting it opens the aircraft preset with matching controls and URL.

Aircraft windows follow the curved fuselage and occupy actual openings in its skin. This matters in the SVG renderer: a curved patch alone still allowed opaque body triangles to paint over the window. The final physical apertures remove that interference. Surface-following gaskets, door seams, handles and cowling access seams give the exterior more coherent construction detail. Ground and shadow bounds follow the visible assembly; those WebGL lighting changes remain distinct from observed SVG acceptance.

## Browser acceptance and corrective iteration

The review used the actual SVG geometry backend at 1348 × 926. It found and corrected clipped H175 mechanism framing, a detached bleed fitting, internal body triangles overpainting aircraft glazing, and an H175 event-delegation error that let ordinary control clicks reselect the current mechanism. The event fix restricts selection to actual mechanism buttons; native disclosures, sliders and camera controls preserve their own behavior.

| Reviewed journey | Observed result | Evidence |
|---|---|---|
| Installed turboshaft, assembled cutaway | Case joints, mounted accessories and supported fittings remain together; no detached mast pickup appears above the engine. | [Engine assembly](audit-5/05-engine-mounted-after.png) |
| Whole helicopter, propeller aircraft and jet | Complete aircraft remain recognizable; dark glazing is continuous and bounded by the surrounding skin. | [Helicopter](audit-5/06-helicopter-after.png), [turboprop](audit-5/07-turboprop-after.png), [turbofan](audit-5/08-turbofan-after.png) |
| Select Nr / main-rotor speed pickup | Aircraft context, location explanation, selected preset and route agree. | Observed in the live preview; mounted geometry is also regression checked. |
| Fuel → Oil circuit | The selector is above the diagram; the diagram and selected component change together. | Observed with the actual circuit selector. |
| H175 whole model and winch | Complete rotor and body fit the assembled view; the winch includes its full travel envelope. | [H175 assembly](audit-5/03-h175-assembled-after.png) |
| H175 manual and powered controls | Manual collective/cyclic work with the motor off; independent rotor/gear/winch selections persist; pause, step, inspection hold and reassembly behave distinctly. | Actual browser interactions plus the mechanism suite. |
| H175 access controls | Open & inspect closes and reopens normally. Door opening at 100% and cowling opening at 55% persist without reselecting the view. | [Openings and controls](audit-5/04-h175-access-after.png) |

## Verification and publication boundary

The complete `npm test` gate passes all 12 test files. Focused cases include 32 real-renderer/mechanical checks, 17 aircraft-skin and actual-Projector checks, two bounded-geometry checks, 23 H175 mechanism checks and three H175 event-delegation regressions. Existing numerical plants, shaft clearances, declared gear ratios, inspection return and graph/representation checks remain in the gate. No performance maps, flight dynamics or calibrated set gearbox were introduced.

The final artifact must also pass `npm run check:release`; both published hosts expose `release.json` for identity comparison. The browser evidence establishes the desktop SVG geometry and named interactions. Hardware WebGL appearance, GPU performance and device classes unavailable in this browser are outside this run's visual evidence. These original teaching models are not claimed to match the visual finish of every Teardown showcase.
