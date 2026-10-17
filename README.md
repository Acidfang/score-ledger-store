# Score ledger store

This repository records game history. Darts is the first game filter, not the storage model.

The root `.jsonl` snapshot contains source-addressed records. `source-history.zip` retains the complete `sources/` directory with immutable database snapshots and player ledgers. `manifest.json` states the carrier rules. Every score retains its original value, source and game context; there is no forced numeric score, fixed number of players, fixed hierarchy, or weekly schedule.

A player ledger references shared events rather than making separate copies of the same play. Dates sort only at their known precision. Unknown completion, per-score timestamps and individual team throwers stay unknown. Cross-device records retain separate source identities until an evidenced link joins them.

The first snapshot contains all 14 native darts tables and 2,395 records. It also contains derived match, leg, score and source-summary events. Native records and derived interpretation remain distinguishable. SQL restoration reproduced all native rows.

Future game capture can retain arbitrary JSON payloads and addressed relations in this carrier. Game-specific validation and comparison belong to adapters. No claim is made that every game's extraction adapter exists.

New captures append source snapshots. Corrections refer to previous records and preserve their history. A Git commit records a write batch; an import must validate its complete reference set before publishing it. Concurrent writers must reconcile against the current branch rather than overwrite it.

The repository is public, as explicitly authorized by Joe. GitHub repository: https://github.com/Acidfang/score-ledger-store. The complete sources directory is also available in source-history.zip; extract it to restore the reference paths in manifest.json. The filterable player viewer is index.html, hosted through GitHub Pages at https://acidfang.github.io/score-ledger-store/. APK work is deferred.


## Canonical implementation and change boundaries (October 2026)

The repository's existing `index.html` is the canonical GitHub Pages viewer. `darts-module.js` is the existing darts adapter and source-preserving replay layer, **not** permission to mount another scoring screen. `native-field/field-relations.js` defines local WAS/IS/NEXT orientations and backtrace; `native-field/recursive-fracture.js` defines recursive addressed threads; `native-field/field-derivation.js` projects derived relationships. `manifest.json` defines storage rules, `preview-state.json` records preview selections and behaviour, and `build.json` carries build identities and provenance. The SQLite and JSONL sources are historical evidence, not mutable UI state.

The darts module exports source reading/admission, selection, records, events, symbolic projection, preview, contributions, labeled ranges, range resolution, binary relations, coordinate scoring and X01 session replay. The isolated `scoreAt` and `x01Session` functions are **not evidence of integration into the canonical viewer**. The duplicate `liveScoring()` UI introduced in October was removed; do not restore it as a parallel screen.

A label/address is an identity even if its value range is a singleton. The range and its references are separate from the numeric value. Preserve source identity, original chronological score tokens, unknowns, player/team provenance and correction lineage. Each operation should identify its WAS state, binary relation, IS result, and NEXT boundary; recheck previous blockers when a later step succeeds. Keep Git commits as change receipts. Do not create parallel versions or duplicate test artefacts.

**Before changing the live viewer:** inspect its complete source and existing scoring/navigation bindings, verify dependencies and current user-visible behaviour, make the smallest compatible change in place, run source and runtime checks, and confirm GitHub Pages deployment. A successful Pages build does not establish that scoring works on a tablet. Existing source and data must not be overwritten by an invented interpretation.

**Open verification boundary:** The complete multi-megabyte `index.html` has not been available for a reliable function-by-function inspection in the current connector reads. Therefore a complete viewer dependency audit, live scoring integration, tablet touch/zoom, match persistence, checkout recommendations, mercy rules and device execution remain **unverified**, not complete. Do not mark them done on the strength of module names or build metadata alone.

## Recursive centre-path relation

[Open the interactive centre-path page](https://acidfang.github.io/score-ledger-store/recursive-cubes/) to follow actual addressed centre trajectories with a repeated 1–118 child-count control, spherical field guides, inherited frames and colours, and one finer same-pattern instance inside the primary centre. Changing the count retains indexed identities and separates previous path geometry within explicit memory limits. The page preserves the canonical viewer and source data. [Source and continuation notes](recursive-cubes/continuation.md) explain the even-spread approximation, checks and unresolved segment-boundary surfaces.
