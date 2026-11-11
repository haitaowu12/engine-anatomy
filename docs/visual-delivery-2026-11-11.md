# Walkthrough continuity — 11 November 2026

## Audit and scope

Baseline: `9b675effb69965cf315687deb5bcba086b076cf1`.

The engine explorer already connects its component, gas-path, shaft and circuit
views to source-backed lessons and experiments. Its walkthrough navigator showed
only numbered buttons. Recreating those buttons on every step removed the
selected keyboard target. Automatic playback changed paragraphs every 3.5
seconds, continued after a manual step, and could advance after an unseen interval
in another tab. The reduced-motion setting did not govern the walkthrough clock.

## Change

The walkthrough now presents the existing stage names as a connected numbered
route. The active stage has a selected marker and text emphasis; a live status
reports “Step N of M.” The buttons remain the same DOM elements while progressing
through one lesson, so choosing a stage retains keyboard focus. Manual stage,
Previous and Next actions pause playback and create restorable history entries.

Playback holds each paragraph for at least six seconds, extending the interval
with its word count. It stops when the page is hidden and exposes an explicit
Replay action at the final step. Reduced motion disables timed advancement while
leaving named stages and manual stepping available, with a visible explanation.
The walkthrough uses the same effective Reduce motion checkbox as the renderer,
including its startup default and system preference changes. Checking it stops
an active walkthrough; unchecking it enables Play without restarting playback.
Selection feedback uses the existing amber palette and a short color transition;
reduced motion removes that transition. The route reflows to two columns at
narrow widths. Engine equations, authored technical claims, geometry and source
links are unchanged.

The method references are the frontend entry point, UI motion defaults, Stageshow
native-interface branch and Unslop light-refinement branch in Second Brain at
`c0dea84f1c3dd8135d6f6c50bc894299d09371c5`.

## Verification

- `npm test` passed all 126 tests, including the retained plant, geometry,
  architecture, renderer, inspection and navigation checks.
- Four added consumer-navigation tests exercise the production handlers:
  named-stage identity/focus and Back recovery; timing and manual/visibility
  pause; replay with reduced-motion manual navigation; and the in-app motion
  preference. The 11-test navigation suite dispatches the actual checkbox and
  system-preference listeners. The checkbox regression failed before the fix
  because checking Reduce motion left playback running, and passed afterward.
- `npm run build` and `npm run check:release` passed, verifying six pages, 88 local
  dependency references, documentation parity and unique controls.

Chrome rendered the connected walkthrough at desktop and 390 px. Keyboard selection moved to the named stage, kept focus on its button and updated the model and step status. The walkthrough played when motion was enabled. Checking Reduce motion stopped it, and clearing the option left it ready to play. The production-handler suite also covers reading intervals and stopping when the tab is hidden. No deployment was run.
