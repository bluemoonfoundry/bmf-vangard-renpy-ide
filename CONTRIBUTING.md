# Contributing to Vangard Studio

Thank you for contributing to Vangard Studio. This document covers environment setup, coding conventions, the PR process, and how to report issues.

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Development Setup](#development-setup)
- [Running the App](#running-the-app)
- [Running Tests](#running-tests)
- [Release Gate](#release-gate)
- [Coding Conventions](#coding-conventions)
- [Pull Request Process](#pull-request-process)
- [Reporting Issues](#reporting-issues)
- [Further Reading](#further-reading)

---

## Code of Conduct

This project follows the [Contributor Covenant](https://www.contributor-covenant.org/version/2/1/code_of_conduct/) v2.1. In short: be respectful, assume good intent, and keep discussion focused on the work.

---

## Development Setup

**Prerequisites:**
- [Node.js](https://nodejs.org/) v18 or later (v20 LTS recommended)
- npm (bundled with Node.js)
- Git

**Clone and install:**

```bash
git clone https://github.com/bluemoonfoundry/bmf-vangard-renpy-ide.git
cd bmf-vangard-renpy-ide
npm install
```

Native modules (used by Electron) are rebuilt automatically via the `postinstall` script. If you see a native module error after install, run:

```bash
npx @electron/rebuild
```

---

## Running the App

| Command | What it does |
|---|---|
| `npm run dev` | Vite dev server at `http://localhost:5173` (renderer only, no Electron) |
| `npm run electron:start` | Full Electron app (builds renderer first, then launches) |
| `npm run build` | Production renderer build to `dist/` |
| `npm run dist` | Package installers to `release/` (DMG / NSIS / AppImage) |
| `npm run lint:fix` | ESLint auto-fix |

For day-to-day feature work, `npm run electron:start` gives you the full app. Use `npm run dev` when iterating quickly on UI-only changes.

---

## Running Tests

```bash
npm test                                          # Run all tests once
npm run test:watch                                # Watch mode
npx vitest run src/hooks/useHistory.test.ts       # Single file
npm run test:coverage                             # Coverage report (v8)
```

Tests use **Vitest + JSDOM**. Setup is in `src/test/setup.ts`.

**End-to-end tests** launch the real Electron app through Playwright (`e2e/`):

```bash
npm run test:e2e                                  # Rebuilds dist/, then runs the full smoke suite
npx playwright test e2e/smoke/01-app-launch.spec.ts   # Single spec against the existing dist/ (no rebuild)
```

`npm run test:e2e` rebuilds first (its `pretest:e2e` hook runs `npm run build`) because `electron.js` loads `dist/index.html`, so a clean checkout and a warm one with an old `dist/` test the same code. Calling `npx playwright test` directly skips that rebuild; use it only for quick iteration after you have built.

If every spec fails at launch with `bad option: --remote-debugging-port=0`, your shell has `ELECTRON_RUN_AS_NODE=1` set (common in terminals spawned by VS Code or other Electron hosts). The launcher strips it, but scripts that call `electron.launch()` directly must use `launchElectron()` from `e2e/electron-launch.js`.

**Writing tests:**

- Use `createMockElectronAPI()` from `src/test/mocks/electronAPI.ts` to stub IPC — call `installElectronAPI()` in `beforeEach` and `uninstallElectronAPI()` in `afterEach`.
- Use factory functions from `src/test/mocks/sampleData.ts` (`createBlock()`, `createSampleAnalysisResult()`, etc.) rather than constructing objects inline — this insulates tests from type changes.
- New hooks and utility functions should have unit tests. Canvas interaction tests are not required but are welcome.

---

## Release Gate

This is the single definition of the release gate. A commit is releasable only when all of it passes:

```bash
npm --prefix website ci   # once: docs site dependencies (needed by docs:check)
npm run gate              # full gate = gate:checks + test:e2e
```

| Step | Command | What it proves |
|---|---|---|
| 1 | `npm run typecheck` (`tsc --noEmit`) | The project type-checks |
| 2 | `npm run lint` | No ESLint errors (generated output such as `dist/` and `website/.vitepress/dist/` is ignored) |
| 3 | `npm run test:coverage` | The full Vitest suite passes (same tests as `npm test`) and coverage thresholds in `vite.config.ts` hold |
| 4 | `npm run build` | The production renderer builds |
| 5 | `npm run docs:check` | `website/doc-assertions.json` claims still match `src/`, and the VitePress site builds with no dead links (`ignoreDeadLinks: false`) |
| 6 | `npm run test:e2e` | The Electron + Playwright smoke suite passes against a fresh build |

Steps 1–5 are `npm run gate:checks`; step 6 is `npm run test:e2e`. CI runs exactly these two scripts through the reusable workflow `.github/workflows/gate.yml`, which `build.yml` (PRs and `main`; checks on Linux, Windows and macOS), `nightly.yml` and `release.yml` (checks on Linux) all call before packaging. E2E runs on Linux under `xvfb-run`. To change the gate, change the `gate:*` scripts in `package.json` and this table together; the workflows pick the change up automatically.

Supported toolchain: Node 20 (CI) or 24, Electron ^41.2, Playwright ^1.49.

---

## Coding Conventions

The full set of conventions (import paths, state mutation, IPC naming, canvas drag patterns, memoization discipline, modal patterns) is documented in [CLAUDE.md](./CLAUDE.md). Read that before writing any code.

The short version of the most commonly missed rules:

- **Imports** — always use the `@/` alias: `import { Block } from '@/types'`, not `../../types`.
- **State** — mutate through `useImmer` drafts; never assign to state directly.
- **IPC** — use `namespace:action` strings in both `electron.js` and `preload.js`.
- **Canvas drag** — use native pointer events (`pointerdown` / `pointermove` / `pointerup`) with global listeners; do not use React synthetic events during drag.
- **Memoization** — wrap any derived array or Set passed as a prop in `useMemo`; without it, every parent re-render re-renders the entire canvas.

---

## Pull Request Process

**Branching:**

Branch from `main`. Use descriptive names:
- `feat/canvas-minimap-zoom`
- `fix/undo-past-initial-state`
- `docs/ipc-patterns`

**Commits:**

Follow [Conventional Commits](https://www.conventionalcommits.org/):
- `feat:` — new feature
- `fix:` — bug fix
- `docs:` — documentation only
- `refactor:` — no behaviour change
- `test:` — tests only
- `chore:` — build, deps, config

Keep the subject line under 72 characters. Reference the issue number in the body when applicable (`Fixes #123`).

**Before opening a PR:**

1. `npm run lint:fix` — no lint errors
2. `npm run gate` — the full [release gate](#release-gate) passes (at minimum `npm test` for small changes; CI runs the whole gate on every PR)
3. If you changed IPC handlers, verify both `electron.js` (main) and `preload.js` (bridge) are updated together
4. If you changed a persistent data structure, check whether a migration is needed (see `migratePunchlistToTasks()` in `App.tsx` for the pattern)

**PR description:**

- Summarise what changed and why (the "why" is more important than the "what")
- Call out any memoization or performance implications
- Note any new IPC channels added

PRs require one approving review before merge.

---

## Reporting Issues

Use [GitHub Issues](https://github.com/bluemoonfoundry/bmf-vangard-renpy-ide/issues). Before filing:
- Search for an existing issue covering the same problem
- Check that you're on the latest release

**Bug reports** should include:
- OS and version
- App version (visible in the status bar)
- Steps to reproduce
- What you expected vs. what happened
- Relevant `.rpy` snippet or project structure if applicable

**Feature requests** should describe the use case, not just the solution. Explain what you're trying to do and why the current behaviour falls short.

---

## Further Reading

| Document | What it covers |
|---|---|
| [CLAUDE.md](./CLAUDE.md) | Full coding conventions, architecture overview, IPC pattern, state hub |
| [website/architecture/CANVAS_ARCHITECTURE.md](./website/architecture/CANVAS_ARCHITECTURE.md) | Three-canvas system, drag model, layout algorithms, keyboard navigation |
| [website/architecture/SYSTEM_ARCHITECTURE.md](./website/architecture/SYSTEM_ARCHITECTURE.md) | Electron process architecture, component hierarchy, data flow |
