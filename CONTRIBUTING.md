# Contributing to Ren'IDE

Thank you for contributing to Ren'IDE. This document covers environment setup, coding conventions, the PR process, and how to report issues.

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Development Setup](#development-setup)
- [Running the App](#running-the-app)
- [Running Tests](#running-tests)
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

**Writing tests:**

- Use `createMockElectronAPI()` from `src/test/mocks/electronAPI.ts` to stub IPC — call `installElectronAPI()` in `beforeEach` and `uninstallElectronAPI()` in `afterEach`.
- Use factory functions from `src/test/mocks/sampleData.ts` (`createBlock()`, `createSampleAnalysisResult()`, etc.) rather than constructing objects inline — this insulates tests from type changes.
- New hooks and utility functions should have unit tests. Canvas interaction tests are not required but are welcome.

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
2. `npm test` — all tests pass
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
| [docs/architecture/CANVAS_ARCHITECTURE.md](./docs/architecture/CANVAS_ARCHITECTURE.md) | Three-canvas system, drag model, layout algorithms, keyboard navigation |
| [docs/architecture/SYSTEM_ARCHITECTURE.md](./docs/architecture/SYSTEM_ARCHITECTURE.md) | Electron process architecture, component hierarchy, data flow |
