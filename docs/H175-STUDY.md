# H175 mechanical study

## Intent and separation

`h175.html` is a separate study of the LEGO Technic Airbus H175 Rescue Helicopter, set 42145. It does not add an electric toy to the three gas-turbine plant architectures. No H175 control writes to the running engine simulation; no fuel, temperature, thrust, governed-speed or flight state is inferred from toy motion.

The page uses original procedural geometry and an authored mechanism model. It preserves the set's recognisable red/white rescue body, yellow fin, five-blade main rotor, three-blade tail rotor, open beam construction and wheeled landing gear. It is not an exact 2,001-piece reconstruction. Exact part inventory, molding geometry, labels, dimensions, routing and tooth ratios are not claimed.

## Evidence reviewed

| Source | What it supports | Boundary |
|---|---|---|
| [LEGO product description](https://www.lego.com/en-us/product/airbus-h175-rescue-helicopter-42145) | Set identity; one motor; powered main/tail rotors with slow/fast settings, retractable landing gear, winch and replica engine; manual pitch and access features. | Does not publish a measured transmission ratio or a calibrated kinematic model. |
| [Official instructions landing page](https://www.lego.com/en-us/service/building-instructions/42145) | Official booklet for set 42145. | The booklet remains on LEGO's host. |
| [Official booklet 6430765](https://www.lego.com/cdn/product-assets/product.bi.core.pdf/6430765.pdf#page=392) | Pages 392–393 show powered controls, collective/cyclic movement and sliding upper cowlings. Page 394 provides the completed side silhouette. Build pages 151–231 were inspected to understand the control-frame and gearbox arrangement; page 209 shows the paired replica fan assemblies. | Exact gearbox paths and full brick reconstruction are not transcribed. No official PDF or product bitmap is distributed in this site. |
| [Alex Campos's first-hand build review](https://www.newelementary.com/2022/07/lego-technic-review-42145-airbus-h175.html) | The author's direct observation corroborates separate function selectors and groups the replica turbines with the two rotors under the rotor selector; the two other levers control winch and landing gear direction. | Used for this observed product-function relationship only. Its general helicopter explanations and reader comments are not used as engineering authority. |

All source claims are separated from the authored model's behavior. The page labels the displayed transmission and numerical rates as teaching parameters.

## Representation and interactions

| View | Physical representation | Interaction |
|---|---|---|
| Whole model | Pierced liftarms, pins, exposed frames, tapered tail, original panels, open cabin and installed mechanisms. | Orbit, side/top cameras, zoom, direct component selection. |
| Rotor head | Stationary and rotating swashplate rings, five blade hinges, five rigid pitch links, upright mast and rotor cap. | Collective height, fore/aft cyclic, lateral cyclic; motor rotation or single animation steps. |
| Drive module | Battery, electric motor, selected transmission, replica engine, selectors and removable frame cheeks. | Separate rotor, landing-gear and winch selectors. Multiple branches can operate concurrently. Selecting a view never changes a drive selector. |
| Landing gear | Three hinged legs; paired nose wheels and two main wheels. | Powered raise/neutral/lower; neutral retains an intermediate position. The authored retraction path is representative. |
| Rescue winch | Bracket, drum, winding, continuous free cable and hook. | Powered pay-out/retrieval, neutral and travel limits. Drum angle follows actual cable travel. |
| Access / inspection | Front/rear sliding cowlings, hinged cockpit doors, sliding cabin doors, removable rotor cap and frame cheeks. | Access can expose running mechanisms; exploded inspection holds powered outputs still. Reassembly restores the assembled geometry. |

## Kinematic invariants

The electric motor is the common powered input. With it off, no selected powered branch moves. A rotor setting of **Disengaged** stops the main rotor, tail rotor and replica-engine group, while a selected winch or landing-gear branch can still move. **Neutral** stops only that branch. Slow/fast are authored display speeds, with no RPM claim.

The main mast remains upright when cyclic changes. Each blade has an independent spanwise pitch hinge. The lower ball joint follows a point in the swashplate plane; the upper joint lies on that blade's pitch horn. The blade angle solves the rigid-link distance constraint. Tests sample collective, both cyclic axes and rotor phase, and check the actual Three geometry's rod endpoints against the actual pitch-horn transforms. This supports the mechanism explanation; it does not solve rotor aerodynamics or real helicopter response.

Winch travel is bounded. The drum angle changes by free-cable displacement divided by an authored effective radius. Reaching a travel limit stops that study output. The implementation does not model clutch slip, force, elasticity, hook swing, cable layering or lifting capacity.

Inspection separates outer access parts and holds motor-driven outputs still. The gears, mast and pitch rods retain their installed geometry. Opening a cowling without exploding the model remains compatible with running the drive.

## Rendering and ownership

The geometry is generated in `h175-model.js` from original shapes. Beam holes are through-holes in the mesh; pins, panel boundaries, wheel hubs and selector handles are geometric parts. Static meshes are batched within their component to retain picking and moving-part identity while reducing draw calls. WebGL uses a studio environment and shadowed floor. A reduced-tessellation SVG renderer projects the same assemblies when WebGL is unavailable. The page exposes camera and mechanism controls outside the canvas and offers reduced motion and animation stepping.

There is no imported LDraw library, copied official geometry, official sticker sheet, product photo or instruction-page image in the build. LEGO, Technic, Airbus and H175 identify the referenced product; the page is an independent educational study.

## Verification

`tests/h175.test.mjs` has 23 checks covering independent powered branches, motor-off behavior, simultaneous selection, inspection pauses, travel limits, cable/drum coupling, pitch-link closure across the input range, five articulated blades, three landing-gear legs, actual open beam holes at both detail budgets, actual inboard/aft landing-gear motion, drum-surface direction at the cable tangent, teaching-gear pitch-circle contact and surface speeds, and exact inspection/reassembly of the retained mechanism. Browser evidence and deployment acceptance are recorded by the release owner after observing the built page; these geometry checks do not claim GPU screenshots or device testing.

`tests/h175-navigation.test.mjs` adds three event-delegation regression checks. Only explicit mechanism buttons can select a part; the workbench's `data-part` state must not turn unrelated control clicks into navigation. The fixture verifies native access disclosure toggling and nested branch-button content. Restoring the former broad ancestor selector makes the regression fail. This fixture checks the event boundary; browser verification remains separate.
