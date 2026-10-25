# Analysis benchmark baseline (nms4.3)

The "before" numbers for the tree-sitter analyzer rewrite (r7pn). Recorded, never enforced: not part of `npm test`, `npm run gate` or CI.

- Machine: 13th Gen Intel(R) Core(TM) i9-13900K, 63.8 GB RAM, win32 10.0.26200
- Node: v24.11.0
- Date: 2026-10-25 (UTC; the runs spanned 05:5x-06:0x local time, UTC-4)
- Commit: baseline column e415d9b plus the then-uncommitted bench harness (Task 2); the other columns were measured at the commits named below.
- Run counts: 2 warmup + 7 measured runs for every size (large was not reduced; the full bench takes about 80 s).
- Reproduce: `npm run bench` from the repo root (writes `bench-results/analysis-<BENCH_LABEL>.json`, default label `baseline`; `BENCH_FULL_IDIOMS=1` for the full-idiom fixtures). Benchmark runs in a node environment with no jsdom setup file.

## Scenarios

- **regex-full**: a fresh `createAnalysisRequestHandler` per run with an empty symbol-index stub, so the regex phases (parsing, route graph, translations) run with no cache hit and no tree-sitter work.
- **index-full**: `updateProjectIndex` on a fresh `ContributionCache`: every file parsed with tree-sitter and resolved into the symbol index.
- **one-file-edit**: one warm handler with the real index, primed once. Each run appends a label to the middle file and re-analyzes; the regex phases rerun in full, only that file is re-indexed.

## Fixtures

| Size | Files | Lines | Source |
|---|---|---|---|
| small | 7 | 2448 | DemoProject/game/*.rpy as-is |
| medium | 50 | 19222 | generated, seed 43 |
| large | 300 | 142533 | generated, seed 43 |

Times are median milliseconds (min - max in parentheses).

"After cancellation" was measured at the cancellation commit (nms4.3 Task 4) on the same machine, label `after-cancellation`. The handler now awaits a cancellation checkpoint (one `MessageChannel` macrotask yield plus a token check) before each of its five phases and before every symbol-index block. index-full calls `updateProjectIndex` without a checkpoint, so it does not exercise this change; its numbers are a noise reference. regex-full and one-file-edit go through the handler: every difference from the baseline is within run-to-run noise (largest: regex-full small +0.8 ms, with the same 9.1 ms minimum; one-file-edit large, about 300 checkpoint yields per run, +1.3%). The yield is therefore not throttled: it runs on every checkpoint call.

"After grammar fixes" was measured at 106994b (label `after-grammar`), the head of this branch after all grammar fixes, with the same default fixtures (same line counts as the baseline, so the columns compare like for like).

**Reading the numbers.** The handler's regex phases (regex-full, about 105 ms for 19k lines) are unchanged by the cancellation checkpoints and the grammar work, and a one-file edit costs about the same as regex-full plus a few milliseconds (roughly 15 ms at medium, 50 ms at large) because the regex phases rerun in full while only the edited file is re-indexed. Tree-sitter indexing (index-full) is the largest cost: about 5x the regex phases at medium and 2.4x at large. The grammar grew a lot on this branch (opaque python blocks, ATL, screens, translations) and index-full is at most slightly slower: medium 521.4 to 531.9 ms (+2%), large 3979.3 to 4135.7 ms (+4%), small 59.2 to 56.9 ms (-4%). The "After cancellation" run used identical index code and measured 488.4 and 3824.0 ms, so run-to-run drift on index-full is about 5% and the grammar growth is not distinguishable from noise.

### regex-full

| Size | Baseline | After cancellation | After grammar fixes |
|---|---|---|---|
| small | 9.3 (9.1 - 13.3) | 10.1 (9.1 - 10.7) | 9.3 (9.1 - 10.3) |
| medium | 105.1 (101.9 - 121.6) | 107.1 (102.6 - 134.6) | 104.2 (100.9 - 120.1) |
| large | 1678.0 (1620.2 - 1948.0) | 1672.9 (1631.3 - 1718.2) | 1688.2 (1677.5 - 1723.9) |

### index-full

| Size | Baseline | After cancellation | After grammar fixes |
|---|---|---|---|
| small | 59.2 (57.9 - 60.0) | 57.6 (56.6 - 61.1) | 56.9 (55.9 - 60.0) |
| medium | 521.4 (509.8 - 536.1) | 488.4 (483.7 - 500.0) | 531.9 (524.9 - 550.7) |
| large | 3979.3 (3935.4 - 4131.3) | 3824.0 (3778.2 - 3859.2) | 4135.7 (4076.7 - 4189.9) |

### one-file-edit

| Size | Baseline | After cancellation | After grammar fixes |
|---|---|---|---|
| small | 11.9 (11.0 - 12.9) | 12.0 (11.3 - 12.2) | 11.9 (11.2 - 13.3) |
| medium | 115.9 (113.1 - 117.9) | 119.4 (115.2 - 124.8) | 120.6 (119.5 - 129.9) |
| large | 1745.4 (1688.0 - 1799.8) | 1767.5 (1715.6 - 1991.4) | 1740.8 (1691.2 - 1795.0) |

## Full-idiom variant (post-fix)

Measured at 106994b (label `full-idioms`, `BENCH_FULL_IDIOMS=1`). The full-idiom fixtures add every construct in `AVOIDED_CONSTRUCTS` (a leading blank line, comment-first bodies, `#` inside strings, `at Transform(...)`, `[var]` in screen strings, multi-property screen lines, docstrings, `with ... as`, decorators, ATL `repeat` and warper lines), so they have more lines than the default fixtures and every file parses without errors (checked by `generateBenchProject.test.ts`). There is no pre-fix column: these constructs were avoided before the fixes. Small is DemoProject and identical to the default.

| Scenario | Size | Lines | Median ms (min - max) |
|---|---|---|---|
| regex-full | small | 2448 | 9.5 (9.3 - 10.0) |
| regex-full | medium | 21339 | 103.4 (101.0 - 121.8) |
| regex-full | large | 159442 | 1822.5 (1780.0 - 1901.4) |
| index-full | small | 2448 | 56.1 (55.7 - 58.9) |
| index-full | medium | 21339 | 576.0 (565.3 - 603.7) |
| index-full | large | 159442 | 4473.7 (4443.3 - 4516.2) |
| one-file-edit | small | 2448 | 12.3 (11.7 - 13.7) |
| one-file-edit | medium | 21339 | 119.5 (117.9 - 132.1) |
| one-file-edit | large | 159442 | 1947.3 (1917.9 - 2102.8) |

Against the default fixtures index-full is 8% slower at medium and large, for 11% and 12% more lines, so the per-line cost is the same (about 27 us per line at medium, 28 us at large, in both variants): the full idioms add no parser slowdown beyond their size.
