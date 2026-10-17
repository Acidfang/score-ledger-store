# Continue the centre-path model

Live page: https://acidfang.github.io/score-ledger-store/recursive-cubes/

Source: [index.html](./index.html). One self-contained HTML file, with no external dependencies or build step. Keep changes isolated from the repository's canonical viewer and source data.

## Governing relation and current implementation

- A parent has N sphere segments and N children. One segment is the whole sphere, two are hemispheres; segment boundaries/tips meet at top and bottom. Child centres are dispersed as evenly as possible as a field around the parent, at equal distance from it. This is not a requirement that every pair of children have identical separation.
- Joe defines atomic number in this model as the number of children a parent has. This does not establish physical element properties. One control, “Atomic number · children per parent”, accepts N = 1…118. The same count and ordered local direction arrangement repeat at every centre. Complete displayed generations always contain all N children.
- Directions are precomputed once per N and reused through every recursive parent frame. One child uses +Y and two use ±Y as display conventions. Four retain tetrahedral symmetry; six retain the previous axial symmetry internally. Other counts use a deterministic Fibonacci-sphere distribution: y = 1 − 2(i+½)/N, longitude = iπ(3−√5). This is the chosen numerical approximation to even spreading, not a proof of optimal spacing or an exact derivation of segment boundaries.
- Spherical and radial guides are optional. There is no cube framework or extra point-sampling grid. Full spherical segment boundary surfaces remain unimplemented.
- Every centre is a ZERO POINT. The child-to-immediate-parent ZERO POINT line defines the local rotation axis, recursively. This does not mean all generations lie on one global line.
- A child's bottom, local −Y, faces its parent; local +Y points away. A parent's turn carries the complete child frame; the child also turns around its own local Y axis.
- Follow actual centre trajectories. The complete pattern also appears once at a finer scale within its primary centre. This inner instance is finite; infinite nesting is not rendered.
- Joe’s EI specification assigns AI only source-occurrence transcription. This page is an illustrative implementation of the stated geometric relations; it does not establish a complete EI implementation. Binary means relations between addressed things. No physical claim is made.

## Identity, additions and history

Children have stable ordinal addresses C1, C2, …, C118. Increasing N attaches the next identities and redistributes the retained siblings using the chosen even-spread approximation. It does not reset angles, simulation time, the actual camera view or input values. Newly exposed children use the current parent state and may lie outside the existing view until Fit is chosen. The same arrangement is shared at every generation.

Changing N, depth or field scale starts a new trajectory segment; no line joins across the geometry change. Earlier segments retain their original node/address mapping, sampled world positions and inner-instance scale. They are drawn separately with dashed lines. Never use a new topology's numeric BFS index to read an old sample array.

Removed or temporarily unrendered addresses retain their committed values and unsubmitted text drafts in separate address-keyed maps in the tab. Drafts restore on revisiting the address or rendering it again; submitting commits only the selected address. Drafts are never silently substituted for committed values. A selection outside the current view is retained logically, with a visible boundary notice and a rendered ancestor used for inspection. It restores when rendered again, unless the user explicitly selects another address. Values, drafts and history are not uploaded or persisted across reloads.

Current trajectory history is limited to six seconds and 24,000 stored centre positions. Earlier geometry segments have a separate 12,000-position budget; the oldest samples expire. This is finite in-memory retention, not an immutable source ledger. Reset motion explicitly clears current and archived path history but preserves entered values. Hiding paths does not delete them.

## Mathematical implementation

The `relation-engine` script uses row-major matrices with column vectors and separate scale. For parent centre C, rotation R, size s, child size c and unit direction n:

- child centre = C + R × n × (s+c)/2
- child rotation = R × directionBasis × localYRotation

All siblings therefore have equal parent radius. Direction bases are proper right-handed rotations mapping local +Y to the radial direction. The initial roll, radius/size convention and root Y axis are explicit display choices.

Each child adds a fixed RGB contribution keyed only by its stable child index. The same palette repeats at every generation and stays unchanged when N changes. Visible colour is the equal-weight average of the root contribution plus the complete ancestry of indexed contributions. The indexed contribution maps each segment/direction to its child origin, so descendants retain that segment contribution in their ancestry. The palette spans broad RGB hues without repeating a six-colour cycle or changing with N. Palette and mixing are display conventions, with no nanometre labels, wavelength calibration or physical claim.

The `view-engine` script separates camera math. Wheel zoom anchors a ray-intersected sphere surface when its guide is visible, otherwise a nearby centre-depth plane or the selected centre's view plane. Pinch holds the same world anchor under the moving midpoint. Camera changes only reproject stored world trajectories. Camera extent and its free-view target are explicit display state, independent of topology bounds. Before a count, depth, scale or instance change, the current camera target and extent are captured; the exact world view is preserved, including a previously focused target. Such a change releases automatic centre-following so that a removed or relocated selected centre cannot pull the camera. Focus explicitly attaches the view to the selected centre again; Fit explicitly recalculates the whole-model framing. Yaw, pitch, zoom and pixel pan remain unchanged during geometry changes.

The `relation-ui` script samples actual world positions every 1/15 simulation second. Root/local default rates, 12°/s and 24°/s, remain adjustable demonstration parameters. Rate changes preserve continuous history. Hidden pages do not advance simulation time. Step advances 1/30 second.

The inner instance is one fixed affine scaled copy of the whole relation and its trajectories about root; it adds no independent turn. Scale is min(0.5, 0.38/max(R,0.76)), with R the sum of parent-to-child distances along the deepest displayed chain. This bound is constant during each geometry segment. Inner addresses start with `root::inner/`. Select the inner instance and Focus centre to inspect it.

## Finite view and interaction

Depth adapts to N and the number of displayed instances. At most 1,600 current centres are displayed in total, and depth is capped at eight. Every admitted generation is complete; no sibling groups are silently truncated. For N=118 and depth=1, each instance contains root plus 118 children. Deeper continuation remains part of the repeated rule, outside the current rendering budget. The interface reports counts and the maximum available depth.

The canvas fills one fixed viewport without page scrolling. Controls opens a collapsible, internally scrolling overlay containing settings, explanations, source links and update notices. Drag orbits; Shift-drag or right-drag pans. Wheel/pinch zoom is anchored. Escape closes the panel.

## Running, updates and verification

Open the HTML directly, or run `python3 -m http.server 8000` from the repository root and visit `http://localhost:8000/recursive-cubes/`.

When publishing a change, update both the `model-version` meta value and `VERSION` constant. Hosted pages check their own URL every 60 seconds while visible. They reload automatically only when display settings can be preserved and no entered value or draft at any retained address would be lost. Hidden drafts also block automatic reload. Otherwise a labelled reload button warns that values will clear. Settings live in tab session storage; values and path history do not. Old four/six preset settings and selection names migrate to the count/index representation. Offline checks leave the current page running.

Checks cover every count 1–118, full generation sizes and total budget, equal parent radii, outward local axes, deterministic direction reuse, palette ancestry, stable identities, retained values/drafts/angles/time, exact camera-view continuity across depth/count/scale/instance changes, focused fallback, selection restoration, archived sample indexing, geometry boundaries, input-as-text safety, fullscreen panel/pan, camera anchors and update guards. Native Canvas output was inspected at desktop/phone dimensions with a mocked DOM. Actual browser layout/device interaction remains unverified because the available browser could not start.

Before release, check N=1,2,3,5,7,118; adding/removing a selected last child; complete-generation depth caps; old/new path separation; field guides; inner instance; mobile overflow; anchored zoom; update preservation; and back/forward restoration. Keep test output outside the published repository unless requested.
