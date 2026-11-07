# Material engine and aircraft studies

## Interactive studies

Open any of the three HTML files in a WebGL browser. The links above the title move between the studies.

| Study | Hardware and installation shown |
| --- | --- |
| [Turboshaft](turboshaft-study.html) | XT700 arrangement, concentric gas-generator and free-turbine shafts, forward output, and a representative helicopter engine deck, gearbox and mast. |
| [Turboprop](turboprop-study.html) | PT6A-100 arrangement, rear radial inlet, three axial stages plus a centrifugal impeller, reverse-flow annular combustor, independent single-stage turbines, two-stage reduction, variable-pitch propeller, and a representative wing and firewall. |
| [Turbofan](turbofan-study.html) | CFM56-5C stage arrangement, fan bypass, concentric spools, lobed mixer, and an A340-style long nacelle with a representative local wing and pylon. |

Use **Inspect module** to isolate any modeled module. Use **Cut away** or **X-ray** to inspect the same assembly. Use **Assembly separation** to pause at any position. Separation follows authored module paths, with the attached cases, fittings and stationary vanes moving with their modules. The views explain assembly relationships. Exact service procedures, attachment details and clearances need additional dimensional and maintenance evidence.

**Installed context** assembles the engine in its local bay or wing section. **Whole aircraft** shows the H175, Dash 8-300, or A340-300 exterior. The H175 has twin PT6C-67E engines and the Dash 8-300 has PW123-family engines. The related engine benches show the XT700 and PT6A-100 respectively. Select an engine inspection control to return to the detailed view. The wide view uses a separate display scale. Installation details and clearances remain illustrative.

The three studies reuse Engine Anatomy’s synthetic running-envelope plant in `src/plants.js`. Change demand or the fuel ceiling, then select **Run** or set **Trial time**. The 24-second trial starts from the same settled operating point after each control change. Shaft and propeller motion is slowed for viewing. Readouts describe the generic teaching model. The PT6A-100 hardware shown here uses hydromechanical fuel control, while the trial demonstrates electronic torque and propeller-speed loops. The CFM56-5C illustration has a mixer and common exhaust; the trial estimates core and bypass thrust with separate ideal nozzles. These distinctions keep the hardware views and numerical model explicit.

### Additional sources

- [Airbus H175 exterior photographs](https://www.airbus.com/en/products-services/helicopters/civil-helicopters/h175), [EASA EC175 B type data, §4–5](https://www.easa.europa.eu/en/downloads/16512/en) and [EASA EC175 B OSD, p. 9](https://www.easa.europa.eu/sites/default/files/dfu/OSD%20Report%20EC175B%20Original%20%20Jms%2031%2010%202014.pdf) guide the cabin, dimensions, wheeled stance, and five-blade main and three-blade tail rotors. The [Airbus H175 ground rescue booklet](https://www.airbus.com/sites/g/files/jlcbta136/files/2025-01/master_ec175_ground_rescue_booklet.pdf), pp. 7–12, shows the exterior pitots, engine outlets, cargo doors and passenger window arrangement. The exterior geometry is representative.

- [PT6A architecture, Pratt & Whitney](https://www.rtx.com/prattwhitney/products/general-aviation-engines/pt6a) identifies the rear radial inlet, reverse-flow combustor, free power turbine and concentric reduction gearbox. [EASA IM.E.094](https://www.easa.europa.eu/sites/default/files/dfu/EASA_IM.E.094_TCDS_Issue_3_20230327.pdf), issue 3, § III.2–4, establishes the PT6A-100 stage and gearbox arrangement. The published 1,572 mm overall length for several models provides a scale check. The [photographed PT6 cutaway at McGill](https://commons.wikimedia.org/wiki/File:PT6_cutaway,_McGill_University.jpg), Ut tensio, CC BY-SA 4.0, informs the exposed layout and exterior material cues. The photograph does not identify the variant.
- [EASA E.003](https://www.easa.europa.eu/en/document-library/type-certificates/engine-cs-e/easae003-cfm-international-sa-cfm56-5band5c-series), issue 6, § III.2, gives the CFM56-5C configuration and identifies the mixer and exhaust plug. [Airbus A340-200/-300 Aircraft Characteristics](https://www.aircraft.airbus.com/sites/g/files/jlcbta126/files/2025-12/AC_A340-200-300_20251201.pdf), § 2-12-0, Figures 016 and 017, provides the approximate engine and nacelle envelopes and the below-wing pylon arrangement. The photographic display informs the bare engine’s visible form. The source does not resolve the contours of individual blades or precise bracket geometry.
- The [University of Alabama in Huntsville T700-701D training project](https://louis.uah.edu/rceu-hcr/306/) and [David Stewart’s corresponding renderings](https://davidstewart.artstation.com/projects/mDgQke) are additional references for a different T700 variant.

In Engine Anatomy, choose **Whole aircraft → Realistic** to open the matching exterior in the workbench. **3D studies** opens the complete material-rendered engine studies. Run `node scripts/build-studies.mjs` from the project checkout to regenerate the offline files with the sibling Second Brain Machine Explainers builder. Pass an alternate builder path as the first argument if needed. The regular product build packages those three files without requiring the sibling checkout.

### Other geometry references

[Dmitry Kulikov's procedural 737NG installation](https://github.com/jubbon/jet-engine-3d) (MIT) models a separate CFM56-7B configuration with distinct spool and module groups. [Michael Zhang's CFM56-7B model](https://sketchfab.com/3d-models/engine-cfm56-7b-2cf2255cba12432cb144abe5b87390e6) (CC BY 4.0) is another possible geometry reference. The study uses original geometry based on the CFM56-5C configuration.
