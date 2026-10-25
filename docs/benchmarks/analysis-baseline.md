# Analysis benchmark baseline (nms4.3)

The "before" numbers for the tree-sitter analyzer rewrite (r7pn). Recorded, never enforced: not part of `npm test`, `npm run gate` or CI.

- Machine: 13th Gen Intel(R) Core(TM) i9-13900K, 63.8 GB RAM, win32 10.0.26200
- Node: v24.11.0
- Date: 2026-10-25
- Commit: e415d9b
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

### regex-full

| Size | Baseline | After cancellation | After grammar fixes |
|---|---|---|---|
| small | 9.3 (9.1 - 13.3) | — | — |
| medium | 105.1 (101.9 - 121.6) | — | — |
| large | 1678.0 (1620.2 - 1948.0) | — | — |

### index-full

| Size | Baseline | After cancellation | After grammar fixes |
|---|---|---|---|
| small | 59.2 (57.9 - 60.0) | — | — |
| medium | 521.4 (509.8 - 536.1) | — | — |
| large | 3979.3 (3935.4 - 4131.3) | — | — |

### one-file-edit

| Size | Baseline | After cancellation | After grammar fixes |
|---|---|---|---|
| small | 11.9 (11.0 - 12.9) | — | — |
| medium | 115.9 (113.1 - 117.9) | — | — |
| large | 1745.4 (1688.0 - 1799.8) | — | — |

## Full-idiom variant (post-fix)

To be filled in after the grammar fixes, using `BENCH_FULL_IDIOMS=1 BENCH_LABEL=full-idioms npm run bench`.
