# Continue the centre-path model

Live page: https://acidfang.github.io/score-ledger-store/recursive-cubes/

Source: [index.html](./index.html). One self-contained HTML file; no external dependencies, build step, backend or analytics. Keep this isolated from the canonical viewer and source data.

## Governing requirement and current release boundary

The current governing geometry is a segmented sphere: N segments correspond to N children; one segment is the whole sphere, two are hemispheres, and segment boundaries/tips meet at the top and bottom. Arbitrary N, including five and seven, must not be restricted to regular solids. The numerical segment-centre and child-orientation rule is not yet implemented. Do not silently invent longitudinal-sector midpoint/equatorial placement. The four- and six-child presets below are retained historical path demonstrations, not the governing construction.

## Requirements retained

- Follow actual centres and their paths. Cube wireframes and spherical field guides are optional, off by default. Every displayed point is an addressed centre; there is no additional sampling grid.
- The selected child arrangement repeats identically at every generation. Six children retain the original ±X, ±Y, ±Z directions; four children use a regular tetrahedron. Each child's distance from its parent is equal within that generation. “Hypercube” preserves Joe's name for the six-direction relation; it does not mean a tesseract implementation.
- Child bottom, local −Y, faces the parent. Local +Y points away. Parent rotation carries the complete child frame; the child also turns about its own local Y axis.
- Overlapping positions retain distinct addresses. Input fills an existing centre without changing its geometry or identity. Entered values are page-session memory only and are not uploaded.
- A child retains all ancestor colour contributions and adds its own indexed contribution. The same ordered palette repeats at every generation. Colours and blending are explicit display conventions.
- The whole centre-path pattern also appears at a finer scale inside its primary centre. The current implementation renders one inner instance, not infinitely many nested instances.
- Joe’s EI specification assigns AI only source-occurrence transcription. This page is an illustrative implementation of the stated geometric relations; it does not establish a complete EI implementation. Binary means relations between addressed things. No physical claim is made.

## Implementation

`relation-engine` defines presets, topology, matrices and colour contributions. Matrices are row-major and apply to column vectors; scale is separate. For parent centre C, rotation R, size s, child size c and unit radial direction n:

- child centre = C + R × n × (s + c) / 2
- child rotation = R × directionBasis × localYRotation

The spherical field radius is the current parent-to-child distance, (s+c)/2. Six-axis adjacent distances are √2 times that radius; opposites are twice it. The four tetrahedral normals are (1,1,1), (1,−1,−1), (−1,1,−1), (−1,−1,1), normalized. Their pair distances are √(8/3) times the radius. Tetrahedral initial roll is a stable right-handed display basis, not a newly inferred law.

Colour is the equal-weight RGB average of the root contribution plus every child-index contribution along the complete ancestry. A grandchild therefore includes the root, parent and its own contribution.

`view-engine` separates camera math. Pointer rays hit the nearest displayed cube surface when that framework is on; otherwise a nearby centre's depth or the selected centre's view plane supplies the anchor. Perspective distance and pixel offsets change together so the picked world point remains under the cursor. Pinch keeps it under the moving midpoint.

The page uses a single fixed, full-viewport canvas with no page scrolling. The Controls button opens a collapsible overlay containing all settings, explanations, source links and update notices; only that panel scrolls internally. Drag orbits, Shift-drag or right-drag pans, and wheel/pinch zoom stays anchored. Escape closes the panel.

`relation-ui` samples actual world positions every 1/15 simulation second. It connects those samples in time order; parent–child relation links are a separate optional layer. Speed changes preserve history. Angle reset, preset, depth and field-scale changes clear it. Camera movement only reprojects it. Hidden pages do not advance simulation time.

The inner instance uses the same complete transforms and stored trajectories with one fixed uniform scale about root. Its scale is min(0.5, 0.38 / max(R, 0.76)), where R is the sum of parent-to-child distances along the deepest chain. This conservative bound is constant for a given preset/depth/scale. It adds no independent rotation. Inner addresses use `root::inner/` before the source address. Select that instance and use Focus cube to inspect it. More inner layers and independent internal motion are not implemented.

## Explicit choices and unresolved parameters

- Arbitrary N remains pending its specified distribution/orientation. Do not infer a spherical arrangement or demand all-pairs equidistance for six children. Four and six are the currently supported historical examples; segmented-sphere placement is the next geometry task.
- Default field-size ratio is 1; 0.3–1 is an inspection control. Radial spacing, inner-instance scale, tetrahedral roll, camera, palette and RGB averaging are visible implementation conventions.
- Root/local defaults are 12°/s and 24°/s; they are demonstration rates. Root axis is Y. A canonical metric/rate law is not established.
- Depth 0–4 yields 1/7/43/259/1,555 centres for six children or 1/5/21/85/341 for four. Counts are per pattern instance. These finite limits do not end the specified relation.
- History is at most six seconds and 24,000 stored centre positions. Higher depth shortens it; the interface reports the span and samples per centre. Step advances 1/30 second.

## Continuing and updating

Open the HTML directly, or run `python3 -m http.server 8000` from the repository root and visit `http://localhost:8000/recursive-cubes/`.

When publishing an HTML change, update both the `model-version` meta value and the `VERSION` constant. Hosted pages check their own URL every 60 seconds while visible. A newer version reloads automatically only when it can preserve display settings and there is no entered value or draft to lose. Otherwise a labelled reload button warns that entered values will clear. Settings are stored in this tab's session storage; values and trail history are not. Pages opened before this update need one manual refresh to gain the update checker. Offline checks leave the current model running.

Checks exercised include matrix/axis/radial invariants, addressed counts, JavaScript syntax, input-as-text safety, repeated controls, pointer cancellation, pause/step/reset, actual trajectory samples and history resets, cursor/midpoint projection anchors, preset switches, inner-instance addressing, update guards and settings validation. Native Canvas renders were inspected at desktop and phone dimensions using a mocked DOM. Actual browser layout/device interaction remains unverified because the available browser could not start.

Before release, verify pause/step/reset, source links, both presets, inherited colours, actual trails, inner-instance focus, optional guides, pointer anchoring on a visible framework surface, pinch midpoint, mobile overflow, update preservation and back/forward restoration. Keep test output out of the published repository unless requested.
