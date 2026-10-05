# Score ledger store

This repository records game history. Darts is the first game filter, not the storage model.

`records/` contains source-addressed JSONL records. `sources/` retains complete immutable source snapshots and player ledgers. `manifest.json` states the carrier rules. Every score retains its original value, source and game context; there is no forced numeric score, fixed number of players, fixed hierarchy, or weekly schedule.

A player ledger references shared events rather than making separate copies of the same play. Dates sort only at their known precision. Unknown completion, per-score timestamps and individual team throwers stay unknown. Cross-device records retain separate source identities until an evidenced link joins them.

The first snapshot contains all 14 native darts tables and 2,395 records. It also contains derived match, leg, score and source-summary events. Native records and derived interpretation remain distinguishable. SQL restoration reproduced all native rows.

Future game capture can retain arbitrary JSON payloads and addressed relations in this carrier. Game-specific validation and comparison belong to adapters. No claim is made that every game's extraction adapter exists.

New captures append source snapshots. Corrections refer to previous records and preserve their history. A Git commit records a write batch; an import must validate its complete reference set before publishing it. Concurrent writers must reconcile against the current branch rather than overwrite it.

The repository is intended to be private. GitHub repository: https://github.com/Acidfang/score-ledger-store. The complete sources directory is also available in source-history.zip; extract it to restore the reference paths in manifest.json. APK and viewer development remain outside this score-recording store.

