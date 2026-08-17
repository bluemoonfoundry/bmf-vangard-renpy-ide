# File-Size Warning Indicator System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a visual file-size warning system that colors graph nodes, editor tabs, and the status bar green/yellow/orange/red based on user-configurable `.rpy` line-count thresholds, updating automatically on save.

**Architecture:** A pure, shared severity utility (`src/lib/fileSizeSeverity.ts`) computes a `FileSizeSeverity` from a line count and thresholds stored in `AppSettings.fileSizeThresholds`. Two small presentational components (`FileSizeDot`, `FileSizeTooltip`) consume that utility and are wired into three existing UI surfaces (`CodeBlock.tsx` graph nodes, the tab bar in `useTabContentRenderer.tsx`, and `StatusBar.tsx`). No new state, no worker changes, no file watcher — everything is a memoized derived value from `block.content`, which already updates on save.

**Tech Stack:** React 18 + TypeScript, Tailwind CSS (dark mode via `dark:` variants), `use-immer` for settings state, Vitest + `@testing-library/react` for tests.

## Global Constraints

- Default thresholds: Ideal (Green) 0–500, Healthy (Yellow) 501–1000, Warning (Orange) 1001–1500, Critical (Red) 1501+. (Spec: `docs/superpowers/specs/2026-07-30-file-size-warning-indicators-design.md`)
- No worker/background-thread computation — line counting stays synchronous and memoized (`content.split('\n').length`), per user decision during brainstorming.
- The severity dot is hidden entirely at Green — only Yellow/Orange/Red render a dot, per user decision.
- Tooltip "limit" shown is the threshold that was crossed to reach the current severity, not the current zone's ceiling (e.g. Warning/orange shows the 1000 boundary it exceeded, not 1500) — matches the spec's example `"1,242 / 1,000 lines [Warning]"`.
- Use the `@/` import alias everywhere (no relative `../` imports), per CLAUDE.md.
- All new/changed settings fields must go through the existing generic `onSettingsChange` flow in `SettingsModal.tsx` / `App.tsx:2263-2273` — no new IPC or persistence code needed, since `app-settings.json` persistence is already generic over `AppSettings` keys.

---

### Task 1: Types and pure severity utility

**Files:**
- Modify: `src/types.ts` (add `FileSizeThresholds` interface + `AppSettings.fileSizeThresholds` field, near `src/types.ts:708-722`)
- Create: `src/lib/fileSizeSeverity.ts`
- Test: `src/lib/fileSizeSeverity.test.ts`

**Interfaces:**
- Produces (used by all later tasks):
  - `type FileSizeSeverity = 'green' | 'yellow' | 'orange' | 'red'`
  - `DEFAULT_FILE_SIZE_THRESHOLDS: FileSizeThresholds` (`{ healthy: 500, warning: 1000, critical: 1500 }`)
  - `getLineCount(content: string): number`
  - `getFileSizeSeverity(lineCount: number, thresholds: FileSizeThresholds): FileSizeSeverity`
  - `getFileSizeSeverityLabel(severity: FileSizeSeverity): string` (`'Ideal' | 'Healthy' | 'Warning' | 'Critical'`)
  - `getFileSizeSeverityDotClass(severity: FileSizeSeverity): string` (Tailwind bg classes)
  - `getFileSizeSeverityTextClass(severity: FileSizeSeverity): string` (Tailwind text classes)
  - `getFileSizeSeverityLimit(severity: FileSizeSeverity, thresholds: FileSizeThresholds): number`
  - `FileSizeThresholds` type (from `@/types`): `{ healthy: number; warning: number; critical: number }`

- [ ] **Step 1: Add `FileSizeThresholds` type and `AppSettings` field**

In `src/types.ts`, immediately before the `AppSettings` interface (before line 708), add:

```ts
/**
 * User-configurable line-count thresholds for the file-size warning system.
 * Three ascending cutoffs define four severity zones: Green (Ideal) up to
 * `healthy`, Yellow (Healthy) up to `warning`, Orange (Warning) up to
 * `critical`, Red (Critical) above `critical`.
 * @interface FileSizeThresholds
 */
export interface FileSizeThresholds {
  healthy: number;
  warning: number;
  critical: number;
}
```

Then add one field to the `AppSettings` interface (after `lastProjectDir?: string;` at line 721):

```ts
  fileSizeThresholds?: FileSizeThresholds;
```

Also add a `@property` line to the `AppSettings` JSDoc block above it (after the `snippetCategoriesState` property line, around line 706):

```ts
 * @property {FileSizeThresholds} [fileSizeThresholds] - Line-count thresholds for the file-size warning indicators
```

- [ ] **Step 2: Write the failing tests for the severity utility**

Create `src/lib/fileSizeSeverity.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import {
  DEFAULT_FILE_SIZE_THRESHOLDS,
  getLineCount,
  getFileSizeSeverity,
  getFileSizeSeverityLabel,
  getFileSizeSeverityDotClass,
  getFileSizeSeverityTextClass,
  getFileSizeSeverityLimit,
} from '@/lib/fileSizeSeverity';

describe('getLineCount', () => {
  it('counts lines by splitting on newline', () => {
    expect(getLineCount('a\nb\nc')).toBe(3);
  });

  it('counts a single line with no newline as 1', () => {
    expect(getLineCount('just one line')).toBe(1);
  });

  it('counts an empty string as 1', () => {
    expect(getLineCount('')).toBe(1);
  });
});

describe('getFileSizeSeverity', () => {
  const t = DEFAULT_FILE_SIZE_THRESHOLDS;

  it('returns green at 0 lines', () => {
    expect(getFileSizeSeverity(0, t)).toBe('green');
  });

  it('returns green exactly at the healthy boundary (500)', () => {
    expect(getFileSizeSeverity(500, t)).toBe('green');
  });

  it('returns yellow just past the healthy boundary (501)', () => {
    expect(getFileSizeSeverity(501, t)).toBe('yellow');
  });

  it('returns yellow exactly at the warning boundary (1000)', () => {
    expect(getFileSizeSeverity(1000, t)).toBe('yellow');
  });

  it('returns orange just past the warning boundary (1001)', () => {
    expect(getFileSizeSeverity(1001, t)).toBe('orange');
  });

  it('returns orange exactly at the critical boundary (1500)', () => {
    expect(getFileSizeSeverity(1500, t)).toBe('orange');
  });

  it('returns red just past the critical boundary (1501)', () => {
    expect(getFileSizeSeverity(1501, t)).toBe('red');
  });

  it('returns red for very large line counts', () => {
    expect(getFileSizeSeverity(50000, t)).toBe('red');
  });

  it('respects custom thresholds', () => {
    const custom = { healthy: 100, warning: 200, critical: 300 };
    expect(getFileSizeSeverity(100, custom)).toBe('green');
    expect(getFileSizeSeverity(150, custom)).toBe('yellow');
    expect(getFileSizeSeverity(250, custom)).toBe('orange');
    expect(getFileSizeSeverity(301, custom)).toBe('red');
  });
});

describe('getFileSizeSeverityLabel', () => {
  it('maps each severity to its display label', () => {
    expect(getFileSizeSeverityLabel('green')).toBe('Ideal');
    expect(getFileSizeSeverityLabel('yellow')).toBe('Healthy');
    expect(getFileSizeSeverityLabel('orange')).toBe('Warning');
    expect(getFileSizeSeverityLabel('red')).toBe('Critical');
  });
});

describe('getFileSizeSeverityDotClass / getFileSizeSeverityTextClass', () => {
  it('returns a non-empty Tailwind class string for every severity', () => {
    (['green', 'yellow', 'orange', 'red'] as const).forEach((severity) => {
      expect(getFileSizeSeverityDotClass(severity)).toMatch(/bg-/);
      expect(getFileSizeSeverityTextClass(severity)).toMatch(/text-/);
    });
  });
});

describe('getFileSizeSeverityLimit', () => {
  const t = DEFAULT_FILE_SIZE_THRESHOLDS;

  it('shows the healthy threshold for green', () => {
    expect(getFileSizeSeverityLimit('green', t)).toBe(500);
  });

  it('shows the healthy threshold for yellow (the boundary it crossed)', () => {
    expect(getFileSizeSeverityLimit('yellow', t)).toBe(500);
  });

  it('shows the warning threshold for orange (the boundary it crossed)', () => {
    expect(getFileSizeSeverityLimit('orange', t)).toBe(1000);
  });

  it('shows the critical threshold for red (the boundary it crossed)', () => {
    expect(getFileSizeSeverityLimit('red', t)).toBe(1500);
  });
});
```

- [ ] **Step 3: Run the tests to verify they fail**

Run: `npx vitest run src/lib/fileSizeSeverity.test.ts`
Expected: FAIL — `Cannot find module '@/lib/fileSizeSeverity'`

- [ ] **Step 4: Implement the severity utility**

Create `src/lib/fileSizeSeverity.ts`:

```ts
/**
 * @file fileSizeSeverity.ts
 * @description Pure logic for the file-size warning indicator system: maps a
 * line count against user-configurable thresholds to one of four severity
 * zones, shared by the graph node badge, editor tab dot, and status bar.
 */
import type { FileSizeThresholds } from '@/types';

export type FileSizeSeverity = 'green' | 'yellow' | 'orange' | 'red';

export const DEFAULT_FILE_SIZE_THRESHOLDS: FileSizeThresholds = {
  healthy: 500,
  warning: 1000,
  critical: 1500,
};

export function getLineCount(content: string): number {
  return content.split('\n').length;
}

export function getFileSizeSeverity(lineCount: number, thresholds: FileSizeThresholds): FileSizeSeverity {
  if (lineCount <= thresholds.healthy) return 'green';
  if (lineCount <= thresholds.warning) return 'yellow';
  if (lineCount <= thresholds.critical) return 'orange';
  return 'red';
}

const SEVERITY_LABELS: Record<FileSizeSeverity, string> = {
  green: 'Ideal',
  yellow: 'Healthy',
  orange: 'Warning',
  red: 'Critical',
};

export function getFileSizeSeverityLabel(severity: FileSizeSeverity): string {
  return SEVERITY_LABELS[severity];
}

const SEVERITY_DOT_CLASSES: Record<FileSizeSeverity, string> = {
  green: 'bg-green-400 dark:bg-green-500',
  yellow: 'bg-yellow-400 dark:bg-yellow-500',
  orange: 'bg-orange-400 dark:bg-orange-500',
  red: 'bg-red-400 dark:bg-red-500',
};

export function getFileSizeSeverityDotClass(severity: FileSizeSeverity): string {
  return SEVERITY_DOT_CLASSES[severity];
}

const SEVERITY_TEXT_CLASSES: Record<FileSizeSeverity, string> = {
  green: 'text-green-500 dark:text-green-400',
  yellow: 'text-yellow-600 dark:text-yellow-400',
  orange: 'text-orange-600 dark:text-orange-400',
  red: 'text-red-600 dark:text-red-400',
};

export function getFileSizeSeverityTextClass(severity: FileSizeSeverity): string {
  return SEVERITY_TEXT_CLASSES[severity];
}

/**
 * The threshold value crossed to reach this severity, shown in the
 * "N / limit lines" tooltip — e.g. Warning (orange) shows the healthy/warning
 * boundary (1000) it exceeded, not its own ceiling (1500), so the number
 * reads as "how far past the last safe limit."
 */
export function getFileSizeSeverityLimit(severity: FileSizeSeverity, thresholds: FileSizeThresholds): number {
  switch (severity) {
    case 'green':
    case 'yellow':
      return thresholds.healthy;
    case 'orange':
      return thresholds.warning;
    case 'red':
      return thresholds.critical;
  }
}
```

- [ ] **Step 5: Run the tests to verify they pass**

Run: `npx vitest run src/lib/fileSizeSeverity.test.ts`
Expected: PASS (all tests green)

- [ ] **Step 6: Typecheck**

Run: `npx tsc --noEmit`
Expected: No new errors.

- [ ] **Step 7: Commit**

```bash
git add src/types.ts src/lib/fileSizeSeverity.ts src/lib/fileSizeSeverity.test.ts
git commit -m "feat: add FileSizeThresholds type and severity utility for file-size warnings"
```

---

### Task 2: Default thresholds in settings state

**Files:**
- Modify: `src/hooks/useSettingsManagement.ts:81-98` (initial state), `:214-231` (`resetAppSettings`)
- Test: `src/hooks/useSettingsManagement.test.ts`

**Interfaces:**
- Consumes: `DEFAULT_FILE_SIZE_THRESHOLDS` from `@/lib/fileSizeSeverity` (Task 1).
- Produces: `appSettings.fileSizeThresholds` always populated with a default value (no consumer needs to null-check it, though the `?` in the type stays for backward-compat with settings files saved before this feature).

- [ ] **Step 1: Write the failing tests**

Add to `src/hooks/useSettingsManagement.test.ts` (after the existing "Initial state" block, i.e. after the `it('initializes draftingMode as false', ...)` test around line 33-36):

```ts
  it('initializes fileSizeThresholds with the defaults', () => {
    const { result } = renderHook(() => useSettingsManagement());
    expect(result.current.appSettings.fileSizeThresholds).toEqual({
      healthy: 500,
      warning: 1000,
      critical: 1500,
    });
  });
```

Add a new describe block near the end of the file, after the existing `resetAppSettings` tests (search the file for `resetAppSettings` to find that block and place this immediately after it):

```ts
  it('resetAppSettings restores default fileSizeThresholds after a change', () => {
    const { result } = renderHook(() => useSettingsManagement());
    act(() => {
      result.current.updateAppSettings((draft) => {
        draft.fileSizeThresholds = { healthy: 100, warning: 200, critical: 300 };
      });
    });
    expect(result.current.appSettings.fileSizeThresholds).toEqual({ healthy: 100, warning: 200, critical: 300 });
    act(() => result.current.resetAppSettings());
    expect(result.current.appSettings.fileSizeThresholds).toEqual({
      healthy: 500,
      warning: 1000,
      critical: 1500,
    });
  });
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx vitest run src/hooks/useSettingsManagement.test.ts`
Expected: FAIL — `fileSizeThresholds` is `undefined`.

- [ ] **Step 3: Implement the default and reset wiring**

In `src/hooks/useSettingsManagement.ts`, add the import (after the existing imports, e.g. after line 14):

```ts
import { DEFAULT_FILE_SIZE_THRESHOLDS } from '@/lib/fileSizeSeverity';
```

In the initial `useImmer<AppSettings>({...})` call (line 81-98), add a field after `lastProjectDir: '',` (line 97):

```ts
    lastProjectDir: '',
    fileSizeThresholds: DEFAULT_FILE_SIZE_THRESHOLDS,
```

In `resetAppSettings` (line 214-231), add a line inside the `updateAppSettings` callback, after the `mouseGestures` block (before the `// Keep renpyPath...` comment at line 229):

```ts
      draft.fileSizeThresholds = DEFAULT_FILE_SIZE_THRESHOLDS;
      // Keep renpyPath, recentProjects, lastProjectDir
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npx vitest run src/hooks/useSettingsManagement.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/hooks/useSettingsManagement.ts src/hooks/useSettingsManagement.test.ts
git commit -m "feat: default fileSizeThresholds in app settings state"
```

---

### Task 3: Settings UI for editing thresholds

**Files:**
- Modify: `src/components/SettingsModal.tsx`
- Test: `src/components/SettingsModal.test.tsx`

**Interfaces:**
- Consumes: `FileSizeThresholds` type (`@/types`), `DEFAULT_FILE_SIZE_THRESHOLDS` (`@/lib/fileSizeSeverity`, Task 1).
- Produces: no new exports — wires into the existing `onSettingsChange('fileSizeThresholds', newThresholds)` generic flow already handled by `App.tsx:2263-2273`.

- [ ] **Step 1: Write the failing tests**

Add to `src/components/SettingsModal.test.tsx`, in a new section after the existing "Canvas & Mouse settings" block (after the test ending around line 301, before the "Ren'Py SDK path" section comment):

```ts
  // ── File size thresholds ───────────────────────────────────────────────────

  it('shows default threshold values when settings has none set', () => {
    render(
      <SettingsModal
        isOpen={true}
        onClose={vi.fn()}
        settings={defaultSettings}
        onSettingsChange={vi.fn()}
      />
    );
    expect((screen.getByLabelText('Healthy starts at') as HTMLInputElement).value).toBe('500');
    expect((screen.getByLabelText('Warning starts at') as HTMLInputElement).value).toBe('1000');
    expect((screen.getByLabelText('Critical starts at') as HTMLInputElement).value).toBe('1500');
  });

  it('shows custom threshold values from settings', () => {
    render(
      <SettingsModal
        isOpen={true}
        onClose={vi.fn()}
        settings={{ ...defaultSettings, fileSizeThresholds: { healthy: 100, warning: 200, critical: 300 } }}
        onSettingsChange={vi.fn()}
      />
    );
    expect((screen.getByLabelText('Healthy starts at') as HTMLInputElement).value).toBe('100');
    expect((screen.getByLabelText('Warning starts at') as HTMLInputElement).value).toBe('200');
    expect((screen.getByLabelText('Critical starts at') as HTMLInputElement).value).toBe('300');
  });

  it('calls onSettingsChange with updated fileSizeThresholds when Healthy input changes', () => {
    const onSettingsChange = vi.fn();
    render(
      <SettingsModal
        isOpen={true}
        onClose={vi.fn()}
        settings={defaultSettings}
        onSettingsChange={onSettingsChange}
      />
    );
    fireEvent.change(screen.getByLabelText('Healthy starts at'), { target: { value: '400' } });
    expect(onSettingsChange).toHaveBeenCalledWith('fileSizeThresholds', { healthy: 400, warning: 1000, critical: 1500 });
  });

  it('calls onSettingsChange with updated fileSizeThresholds when Warning input changes', () => {
    const onSettingsChange = vi.fn();
    render(
      <SettingsModal
        isOpen={true}
        onClose={vi.fn()}
        settings={defaultSettings}
        onSettingsChange={onSettingsChange}
      />
    );
    fireEvent.change(screen.getByLabelText('Warning starts at'), { target: { value: '900' } });
    expect(onSettingsChange).toHaveBeenCalledWith('fileSizeThresholds', { healthy: 500, warning: 900, critical: 1500 });
  });

  it('calls onSettingsChange with updated fileSizeThresholds when Critical input changes', () => {
    const onSettingsChange = vi.fn();
    render(
      <SettingsModal
        isOpen={true}
        onClose={vi.fn()}
        settings={defaultSettings}
        onSettingsChange={onSettingsChange}
      />
    );
    fireEvent.change(screen.getByLabelText('Critical starts at'), { target: { value: '2000' } });
    expect(onSettingsChange).toHaveBeenCalledWith('fileSizeThresholds', { healthy: 500, warning: 1000, critical: 2000 });
  });

  it('shows a warning message when thresholds are not strictly ascending', () => {
    render(
      <SettingsModal
        isOpen={true}
        onClose={vi.fn()}
        settings={{ ...defaultSettings, fileSizeThresholds: { healthy: 900, warning: 500, critical: 1500 } }}
        onSettingsChange={vi.fn()}
      />
    );
    expect(screen.getByText('Thresholds should increase from Healthy to Warning to Critical.')).toBeInTheDocument();
  });

  it('does not show a warning message when thresholds are valid', () => {
    render(
      <SettingsModal
        isOpen={true}
        onClose={vi.fn()}
        settings={defaultSettings}
        onSettingsChange={vi.fn()}
      />
    );
    expect(screen.queryByText('Thresholds should increase from Healthy to Warning to Critical.')).not.toBeInTheDocument();
  });
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx vitest run src/components/SettingsModal.test.tsx`
Expected: FAIL — labels "Healthy starts at" etc. not found.

- [ ] **Step 3: Implement the settings UI**

In `src/components/SettingsModal.tsx`, update the type-only import (line 11) to add `FileSizeThresholds`:

```ts
import type { Theme, IdeSettings, MouseGestureSettings, CanvasPanGesture, FileSizeThresholds } from '@/types';
```

Add a new import after it:

```ts
import { DEFAULT_FILE_SIZE_THRESHOLDS } from '@/lib/fileSizeSeverity';
```

Inside the component body, after the `mouseGestures` derivation (line 49) and its handler (line 51-53), add:

```ts
  const fileSizeThresholds: FileSizeThresholds = settings.fileSizeThresholds ?? DEFAULT_FILE_SIZE_THRESHOLDS;
  const thresholdsAscending = fileSizeThresholds.healthy < fileSizeThresholds.warning
    && fileSizeThresholds.warning < fileSizeThresholds.critical;

  const handleThresholdChange = (key: keyof FileSizeThresholds, value: number) => {
    onSettingsChange('fileSizeThresholds', { ...fileSizeThresholds, [key]: value });
  };
```

Add a new section in the JSX, after the "Canvas & Mouse" section closes. Find the end of that section (search for the `border-t border-primary` divider that follows it, or the closing of the `<main>` before the Ren'Py SDK section) and insert:

```tsx
            <div className="border-t border-primary"></div>
            <div>
                <h3 className="text-sm font-medium text-primary mb-3">File Size Warnings</h3>
                <p className="text-xs text-secondary mb-3">
                    Line-count thresholds used to color-code file size on the graph, tabs, and status bar.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label htmlFor="threshold-healthy" className="block text-xs font-medium text-secondary mb-1">
                            Healthy starts at
                        </label>
                        <input
                            id="threshold-healthy"
                            type="number"
                            value={fileSizeThresholds.healthy}
                            onChange={(e) => handleThresholdChange('healthy', parseInt(e.target.value) || 0)}
                            className="w-full p-2 rounded bg-tertiary border border-primary focus:ring-accent focus:border-accent text-sm text-primary"
                            min={1}
                        />
                    </div>
                    <div>
                        <label htmlFor="threshold-warning" className="block text-xs font-medium text-secondary mb-1">
                            Warning starts at
                        </label>
                        <input
                            id="threshold-warning"
                            type="number"
                            value={fileSizeThresholds.warning}
                            onChange={(e) => handleThresholdChange('warning', parseInt(e.target.value) || 0)}
                            className="w-full p-2 rounded bg-tertiary border border-primary focus:ring-accent focus:border-accent text-sm text-primary"
                            min={1}
                        />
                    </div>
                    <div>
                        <label htmlFor="threshold-critical" className="block text-xs font-medium text-secondary mb-1">
                            Critical starts at
                        </label>
                        <input
                            id="threshold-critical"
                            type="number"
                            value={fileSizeThresholds.critical}
                            onChange={(e) => handleThresholdChange('critical', parseInt(e.target.value) || 0)}
                            className="w-full p-2 rounded bg-tertiary border border-primary focus:ring-accent focus:border-accent text-sm text-primary"
                            min={1}
                        />
                    </div>
                </div>
                {!thresholdsAscending && (
                    <p className="text-xs text-red-500 dark:text-red-400 mt-2">
                        Thresholds should increase from Healthy to Warning to Critical.
                    </p>
                )}
            </div>
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npx vitest run src/components/SettingsModal.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/SettingsModal.tsx src/components/SettingsModal.test.tsx
git commit -m "feat: add file-size threshold editor to Settings modal"
```

---

### Task 4: Shared FileSizeDot and FileSizeTooltip components

**Files:**
- Create: `src/components/FileSizeDot.tsx`
- Create: `src/components/FileSizeTooltip.tsx`
- Test: `src/components/FileSizeDot.test.tsx`
- Test: `src/components/FileSizeTooltip.test.tsx`

**Interfaces:**
- Consumes: `FileSizeThresholds` (`@/types`), `getFileSizeSeverity`, `getFileSizeSeverityDotClass`, `getFileSizeSeverityLabel`, `getFileSizeSeverityLimit` (`@/lib/fileSizeSeverity`, Task 1).
- Produces (used by Task 5 and Task 6):
  - `FileSizeDot` default export, props `{ lineCount: number; thresholds: FileSizeThresholds; title?: string; className?: string }`. Renders `null` when severity is green.
  - `FileSizeTooltip` default export, props `{ fileName: string; lineCount: number; thresholds: FileSizeThresholds; labelCount: number; jumpCount: number; children: React.ReactNode }`. Wraps `children`, shows a portal tooltip on hover.

- [ ] **Step 1: Write the failing tests for FileSizeDot**

Create `src/components/FileSizeDot.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import FileSizeDot from './FileSizeDot';
import { DEFAULT_FILE_SIZE_THRESHOLDS } from '@/lib/fileSizeSeverity';

describe('FileSizeDot', () => {
  it('renders nothing when line count is within the healthy threshold', () => {
    const { container } = render(
      <FileSizeDot lineCount={200} thresholds={DEFAULT_FILE_SIZE_THRESHOLDS} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders a yellow dot between the healthy and warning thresholds', () => {
    render(<FileSizeDot lineCount={750} thresholds={DEFAULT_FILE_SIZE_THRESHOLDS} />);
    const dot = screen.getByTestId('file-size-dot');
    expect(dot).toHaveAttribute('data-severity', 'yellow');
  });

  it('renders an orange dot between the warning and critical thresholds', () => {
    render(<FileSizeDot lineCount={1200} thresholds={DEFAULT_FILE_SIZE_THRESHOLDS} />);
    const dot = screen.getByTestId('file-size-dot');
    expect(dot).toHaveAttribute('data-severity', 'orange');
  });

  it('renders a red dot above the critical threshold', () => {
    render(<FileSizeDot lineCount={2000} thresholds={DEFAULT_FILE_SIZE_THRESHOLDS} />);
    const dot = screen.getByTestId('file-size-dot');
    expect(dot).toHaveAttribute('data-severity', 'red');
  });

  it('applies the title attribute when provided', () => {
    render(<FileSizeDot lineCount={2000} thresholds={DEFAULT_FILE_SIZE_THRESHOLDS} title="2000 lines" />);
    expect(screen.getByTestId('file-size-dot')).toHaveAttribute('title', '2000 lines');
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npx vitest run src/components/FileSizeDot.test.tsx`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement FileSizeDot**

Create `src/components/FileSizeDot.tsx`:

```tsx
/**
 * @file FileSizeDot.tsx
 * @description Small colored dot indicating a block's line-count severity
 * (yellow/orange/red). Renders nothing at green/Ideal, so small, healthy
 * files stay visually quiet on the graph and in the tab bar.
 */
import React from 'react';
import type { FileSizeThresholds } from '@/types';
import { getFileSizeSeverity, getFileSizeSeverityDotClass } from '@/lib/fileSizeSeverity';

interface FileSizeDotProps {
  lineCount: number;
  thresholds: FileSizeThresholds;
  title?: string;
  className?: string;
}

const FileSizeDot: React.FC<FileSizeDotProps> = ({ lineCount, thresholds, title, className }) => {
  const severity = getFileSizeSeverity(lineCount, thresholds);
  if (severity === 'green') return null;
  return (
    <div
      className={`w-2 h-2 rounded-full flex-shrink-0 ${getFileSizeSeverityDotClass(severity)} ${className ?? ''}`}
      title={title}
      data-testid="file-size-dot"
      data-severity={severity}
    />
  );
};

export default React.memo(FileSizeDot);
```

- [ ] **Step 4: Run to verify FileSizeDot tests pass**

Run: `npx vitest run src/components/FileSizeDot.test.tsx`
Expected: PASS

- [ ] **Step 5: Write the failing tests for FileSizeTooltip**

Create `src/components/FileSizeTooltip.test.tsx`:

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import FileSizeTooltip from './FileSizeTooltip';
import { DEFAULT_FILE_SIZE_THRESHOLDS } from '@/lib/fileSizeSeverity';

describe('FileSizeTooltip', () => {
  it('does not show tooltip content before hover', () => {
    render(
      <FileSizeTooltip
        fileName="chapter1.rpy"
        lineCount={1242}
        thresholds={DEFAULT_FILE_SIZE_THRESHOLDS}
        labelCount={3}
        jumpCount={5}
      >
        <span data-testid="badge">badge</span>
      </FileSizeTooltip>
    );
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('shows formatted line count, limit, and status on mouseEnter', () => {
    render(
      <FileSizeTooltip
        fileName="chapter1.rpy"
        lineCount={1242}
        thresholds={DEFAULT_FILE_SIZE_THRESHOLDS}
        labelCount={3}
        jumpCount={5}
      >
        <span data-testid="badge">badge</span>
      </FileSizeTooltip>
    );
    fireEvent.mouseEnter(screen.getByTestId('badge').parentElement!);
    const tooltip = screen.getByRole('tooltip');
    expect(tooltip).toHaveTextContent('chapter1.rpy');
    expect(tooltip).toHaveTextContent('1,242 / 1,000 lines [Warning]');
    expect(tooltip).toHaveTextContent('3 labels, 5 jumps');
  });

  it('hides the tooltip on mouseLeave', () => {
    render(
      <FileSizeTooltip
        fileName="chapter1.rpy"
        lineCount={1242}
        thresholds={DEFAULT_FILE_SIZE_THRESHOLDS}
        labelCount={3}
        jumpCount={5}
      >
        <span data-testid="badge">badge</span>
      </FileSizeTooltip>
    );
    const anchor = screen.getByTestId('badge').parentElement!;
    fireEvent.mouseEnter(anchor);
    expect(screen.getByRole('tooltip')).toBeInTheDocument();
    fireEvent.mouseLeave(anchor);
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('uses singular label/jump wording when counts are 1', () => {
    render(
      <FileSizeTooltip
        fileName="chapter1.rpy"
        lineCount={600}
        thresholds={DEFAULT_FILE_SIZE_THRESHOLDS}
        labelCount={1}
        jumpCount={1}
      >
        <span data-testid="badge">badge</span>
      </FileSizeTooltip>
    );
    fireEvent.mouseEnter(screen.getByTestId('badge').parentElement!);
    expect(screen.getByRole('tooltip')).toHaveTextContent('1 label, 1 jump');
  });
});
```

- [ ] **Step 6: Run to verify it fails**

Run: `npx vitest run src/components/FileSizeTooltip.test.tsx`
Expected: FAIL — module not found.

- [ ] **Step 7: Implement FileSizeTooltip**

Create `src/components/FileSizeTooltip.tsx`:

```tsx
/**
 * @file FileSizeTooltip.tsx
 * @description Portal-rendered hover tooltip showing file-size severity
 * detail (line count vs. threshold, status, label/jump counts) for a graph
 * node's size badge.
 */
import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import type { FileSizeThresholds } from '@/types';
import { getFileSizeSeverity, getFileSizeSeverityLabel, getFileSizeSeverityLimit } from '@/lib/fileSizeSeverity';

interface FileSizeTooltipProps {
  fileName: string;
  lineCount: number;
  thresholds: FileSizeThresholds;
  labelCount: number;
  jumpCount: number;
  children: React.ReactNode;
}

const FileSizeTooltip: React.FC<FileSizeTooltipProps> = ({
  fileName, lineCount, thresholds, labelCount, jumpCount, children,
}) => {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const anchorRef = useRef<HTMLDivElement>(null);

  const severity = getFileSizeSeverity(lineCount, thresholds);
  const label = getFileSizeSeverityLabel(severity);
  const limit = getFileSizeSeverityLimit(severity, thresholds);

  const handleEnter = () => {
    if (anchorRef.current) {
      const rect = anchorRef.current.getBoundingClientRect();
      setPos({ top: rect.bottom + 4, left: Math.min(rect.left, window.innerWidth - 224) });
    }
    setOpen(true);
  };

  return (
    <div ref={anchorRef} onMouseEnter={handleEnter} onMouseLeave={() => setOpen(false)}>
      {children}
      {open && createPortal(
        <div
          role="tooltip"
          style={{ top: pos.top, left: pos.left }}
          className="fixed z-[9999] w-56 rounded-md border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-2xl px-3 py-2 text-xs text-gray-700 dark:text-gray-300 pointer-events-none"
        >
          <div className="font-semibold text-gray-800 dark:text-gray-100 truncate mb-1">{fileName}</div>
          <div>{lineCount.toLocaleString()} / {limit.toLocaleString()} lines [{label}]</div>
          <div className="mt-1 text-gray-500 dark:text-gray-400">
            {labelCount} label{labelCount !== 1 ? 's' : ''}, {jumpCount} jump{jumpCount !== 1 ? 's' : ''}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default FileSizeTooltip;
```

- [ ] **Step 8: Run to verify FileSizeTooltip tests pass**

Run: `npx vitest run src/components/FileSizeTooltip.test.tsx`
Expected: PASS

- [ ] **Step 9: Typecheck**

Run: `npx tsc --noEmit`
Expected: No new errors.

- [ ] **Step 10: Commit**

```bash
git add src/components/FileSizeDot.tsx src/components/FileSizeDot.test.tsx src/components/FileSizeTooltip.tsx src/components/FileSizeTooltip.test.tsx
git commit -m "feat: add FileSizeDot and FileSizeTooltip components"
```

---

### Task 5: Graph node badge + tooltip (CodeBlock / StoryCanvas)

**Files:**
- Modify: `src/components/CodeBlock.tsx`
- Modify: `src/components/StoryCanvas.tsx`
- Modify: `src/hooks/useTabContentRenderer.tsx` (single prop addition to the `<StoryCanvas>` call at `:283-302`)
- Test: `src/components/CodeBlock.test.tsx` (new file)
- Test: `src/components/StoryCanvas.test.tsx` (extend)

**Interfaces:**
- Consumes: `FileSizeDot`, `FileSizeTooltip` (Task 4), `DEFAULT_FILE_SIZE_THRESHOLDS`, `getFileSizeSeverity` (Task 1).
- Produces: `CodeBlockProps.fileSizeThresholds?: FileSizeThresholds` and `StoryCanvasProps.fileSizeThresholds?: FileSizeThresholds` — both optional, defaulting internally to `DEFAULT_FILE_SIZE_THRESHOLDS`, so no existing call site or test fixture breaks.

- [ ] **Step 1: Write the failing tests for CodeBlock**

Create `src/components/CodeBlock.test.tsx`. This is the first test file for this component — the `createDefaultProps` helper covers every required prop:

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import CodeBlock from './CodeBlock';
import { createBlock, createEmptyAnalysisResult } from '@/test/mocks/sampleData';
import type { Block, RenpyAnalysisResult } from '@/types';

function makeContent(lines: number): string {
  return Array.from({ length: lines }, (_, i) => `# line ${i}`).join('\n');
}

function createDefaultProps(overrides: { block?: Block; analysisResult?: RenpyAnalysisResult } = {}) {
  return {
    block: overrides.block ?? createBlock({ content: makeContent(50) }),
    analysisResult: overrides.analysisResult ?? createEmptyAnalysisResult(),
    updateBlock: vi.fn(),
    deleteBlock: vi.fn(),
    onOpenEditor: vi.fn(),
    isSelected: false,
    isDragging: false,
    isRoot: false,
    isLeaf: false,
    isBranching: false,
    isDimmed: false,
    isUsageHighlighted: false,
    isHoverHighlighted: false,
    isDirty: false,
    isScreenBlock: false,
    isConfigBlock: false,
    isFlashing: false,
    diagnosticSeverity: null as const,
  };
}

describe('CodeBlock — file size indicator', () => {
  it('does not render a size badge when the line count is within the healthy threshold', () => {
    render(<CodeBlock {...createDefaultProps({ block: createBlock({ content: makeContent(50) }) })} />);
    expect(screen.queryByTestId('file-size-dot')).not.toBeInTheDocument();
  });

  it('renders a yellow size badge between the healthy and warning thresholds', () => {
    render(<CodeBlock {...createDefaultProps({ block: createBlock({ content: makeContent(750) }) })} />);
    expect(screen.getByTestId('file-size-dot')).toHaveAttribute('data-severity', 'yellow');
  });

  it('renders a red size badge above the critical threshold', () => {
    render(<CodeBlock {...createDefaultProps({ block: createBlock({ content: makeContent(2000) }) })} />);
    expect(screen.getByTestId('file-size-dot')).toHaveAttribute('data-severity', 'red');
  });

  it('shows line count, limit, and status label in the tooltip on hover', () => {
    render(<CodeBlock {...createDefaultProps({ block: createBlock({ content: makeContent(1200) }) })} />);
    const anchor = screen.getByTestId('file-size-dot').parentElement!;
    fireEvent.mouseEnter(anchor);
    const tooltip = screen.getByRole('tooltip');
    expect(tooltip).toHaveTextContent('1,200 / 1,000 lines [Warning]');
  });

  it('shows the block\'s label and jump counts in the tooltip', () => {
    const block = createBlock({ id: 'block-1', content: makeContent(1200) });
    const analysisResult = createEmptyAnalysisResult({
      labels: {
        start: { blockId: 'block-1', label: 'start', line: 1, column: 7, type: 'label' },
        chapter1: { blockId: 'block-1', label: 'chapter1', line: 10, column: 7, type: 'label' },
      },
      jumps: {
        'block-1': [
          { blockId: 'block-1', target: 'other', type: 'jump', line: 20, columnStart: 4, columnEnd: 12 },
        ],
      },
    });
    render(<CodeBlock {...createDefaultProps({ block, analysisResult })} />);
    const anchor = screen.getByTestId('file-size-dot').parentElement!;
    fireEvent.mouseEnter(anchor);
    expect(screen.getByRole('tooltip')).toHaveTextContent('2 labels, 1 jump');
  });

  it('respects a custom fileSizeThresholds prop', () => {
    render(
      <CodeBlock
        {...createDefaultProps({ block: createBlock({ content: makeContent(150) }) })}
        fileSizeThresholds={{ healthy: 100, warning: 200, critical: 300 }}
      />
    );
    expect(screen.getByTestId('file-size-dot')).toHaveAttribute('data-severity', 'yellow');
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npx vitest run src/components/CodeBlock.test.tsx`
Expected: FAIL — no `file-size-dot` test id rendered, and `fileSizeThresholds` prop doesn't exist on `CodeBlockProps`.

- [ ] **Step 3: Wire the badge and tooltip into CodeBlock**

In `src/components/CodeBlock.tsx`:

Update the type import (line 10):

```ts
import type { Block, RenpyAnalysisResult, LabelLocation, FileSizeThresholds } from '@/types';
```

Add a new import after it:

```ts
import FileSizeDot from './FileSizeDot';
import FileSizeTooltip from './FileSizeTooltip';
import { getFileSizeSeverity, DEFAULT_FILE_SIZE_THRESHOLDS } from '@/lib/fileSizeSeverity';
```

Add a field to `CodeBlockProps` (after `diagnosticSeverity?: 'error' | 'warning' | null;` at line 34):

```ts
  fileSizeThresholds?: FileSizeThresholds;
```

Add `fileSizeThresholds = DEFAULT_FILE_SIZE_THRESHOLDS` to the destructured props (after `diagnosticSeverity,` at line 88):

```ts
  diagnosticSeverity,
  fileSizeThresholds = DEFAULT_FILE_SIZE_THRESHOLDS,
}, ref) => {
```

Update the analysisResult destructure at line 96 to also pull `jumps`:

```ts
  const { firstLabels, invalidJumps, labels, dialogueLines, characters, blockTypes, jumps } = analysisResult;
```

After the existing `lineCount` memo (line 161), add a severity memo:

```ts
  const fileSizeSeverity = useMemo(() => getFileSizeSeverity(lineCount, fileSizeThresholds), [lineCount, fileSizeThresholds]);
```

In the JSX, right after the outer wrapper `<div>`'s opening tag closes (i.e. immediately after the `onDoubleClick={() => onOpenEditor(block.id)}` line, line 267, and before the `drag-handle` header div at line 269), insert:

```tsx
      {fileSizeSeverity !== 'green' && (
        <div className="absolute -top-1.5 -right-1.5 z-20">
          <FileSizeTooltip
            fileName={displayedTitle}
            lineCount={lineCount}
            thresholds={fileSizeThresholds}
            labelCount={blockLabels.length}
            jumpCount={(jumps[block.id] || []).length}
          >
            <FileSizeDot lineCount={lineCount} thresholds={fileSizeThresholds} />
          </FileSizeTooltip>
        </div>
      )}
```

- [ ] **Step 4: Run to verify CodeBlock tests pass**

Run: `npx vitest run src/components/CodeBlock.test.tsx`
Expected: PASS

- [ ] **Step 5: Thread the prop through StoryCanvas**

In `src/components/StoryCanvas.tsx`, update the type import (line 19) to add `FileSizeThresholds`:

```ts
import type { Block, Position, RenpyAnalysisResult, BlockGroup, StickyNote as StickyNoteType, MouseGestureSettings, StoryCanvasGroupingMode, StoryCanvasLayoutMode, DiagnosticsResult, FileSizeThresholds } from '@/types';
```

Add a field to `StoryCanvasProps` (after `diagnosticsResult?: DiagnosticsResult;` at line 61):

```ts
  fileSizeThresholds?: FileSizeThresholds;
```

Add `fileSizeThresholds` to the destructured props at line 246 (after `diagnosticsResult,`):

```ts
    layoutMode, groupingMode, onChangeLayoutMode, onChangeGroupingMode, diagnosticsResult, fileSizeThresholds,
```

Pass it to both `<CodeBlock>` call sites. First, after `diagnosticSeverity={blockDiagnosticSeverity.get(block.id) ?? null}` (line 1452):

```tsx
              diagnosticSeverity={blockDiagnosticSeverity.get(block.id) ?? null}
              fileSizeThresholds={fileSizeThresholds}
```

Second, after `diagnosticSeverity={null}` in the exiting-blocks map (line 1477):

```tsx
            diagnosticSeverity={null}
            fileSizeThresholds={fileSizeThresholds}
```

- [ ] **Step 6: Wire it from useTabContentRenderer**

In `src/hooks/useTabContentRenderer.tsx`, in the `<StoryCanvas>` call (line 283-302), add one prop after `diagnosticsResult={diagnosticsResult}` (line 301):

```tsx
        diagnosticsResult={diagnosticsResult}
        fileSizeThresholds={appSettings.fileSizeThresholds}
      />;
```

- [ ] **Step 7: Add a StoryCanvas regression test**

Add to `src/components/StoryCanvas.test.tsx`, in a new section (find the file's existing `createProps` helper and add near the other block-rendering tests):

```ts
  it('renders a file-size badge on a block whose content exceeds the healthy threshold', () => {
    const bigContent = Array.from({ length: 800 }, (_, i) => `# line ${i}`).join('\n');
    const blocks = [createBlock({ content: bigContent })];
    render(<StoryCanvas {...createProps({ blocks })} />);
    expect(screen.getByTestId('file-size-dot')).toBeInTheDocument();
  });

  it('does not render a file-size badge for a short block', () => {
    render(<StoryCanvas {...createProps()} />);
    expect(screen.queryByTestId('file-size-dot')).not.toBeInTheDocument();
  });
```

(Check the top of `src/components/StoryCanvas.test.tsx` for its existing `screen`/`render` imports and `createBlock` import from `@/test/mocks/sampleData` — reuse them; don't re-import if already present.)

- [ ] **Step 8: Run the full component test suite for this task**

Run: `npx vitest run src/components/CodeBlock.test.tsx src/components/StoryCanvas.test.tsx`
Expected: PASS

- [ ] **Step 9: Typecheck**

Run: `npx tsc --noEmit`
Expected: No new errors.

- [ ] **Step 10: Commit**

```bash
git add src/components/CodeBlock.tsx src/components/StoryCanvas.tsx src/hooks/useTabContentRenderer.tsx src/components/CodeBlock.test.tsx src/components/StoryCanvas.test.tsx
git commit -m "feat: show file-size severity badge and tooltip on graph nodes"
```

---

### Task 6: Editor tab severity dot

**Files:**
- Modify: `src/hooks/useTabContentRenderer.tsx:1-42` (imports), `:489-510` (tab rendering)

**Interfaces:**
- Consumes: `FileSizeDot` (Task 4), `getLineCount`, `getFileSizeSeverity`, `getFileSizeSeverityLabel`, `getFileSizeSeverityLimit`, `DEFAULT_FILE_SIZE_THRESHOLDS` (Task 1).
- Produces: nothing new — this is a leaf integration point.

**Note on test coverage:** `useTabContentRenderer` has no existing test file — `renderTabBar` is a closure returned from a hook with ~90 required params (refs, handlers, canvas state), and no prior art in this codebase renders it under test. Building that harness from scratch is out of scope for this task; `FileSizeDot`'s own severity/color logic is already fully covered by `FileSizeDot.test.tsx` (Task 4). This task is verified by the manual check in Step 3 instead of an automated render test — call this out explicitly when executing, don't silently skip it.

- [ ] **Step 1: Add the imports**

In `src/hooks/useTabContentRenderer.tsx`, add after the existing component imports (after line 32, `import MarkdownPreviewView from '@/components/MarkdownPreviewView';`):

```ts
import FileSizeDot from '@/components/FileSizeDot';
```

Add after the existing lib-less import block — insert a new import line right after the `useCanvasInteraction` type import block (after line 47):

```ts
import { getLineCount, getFileSizeSeverity, getFileSizeSeverityLabel, getFileSizeSeverityLimit, DEFAULT_FILE_SIZE_THRESHOLDS } from '@/lib/fileSizeSeverity';
```

- [ ] **Step 2: Render the dot in the tab bar**

In the `renderTabBar` function, insert the dot between the tab label and the diagnostics pill (i.e. right after `<span className="truncate flex-grow">{getTabLabel(tab)}</span>` at line 500, before the `{(tab.id === 'diagnostics' ...` block):

```tsx
            <span className="truncate flex-grow">{getTabLabel(tab)}</span>
            {tab.type === 'editor' && tab.blockId && (() => {
              const tabBlock = blocks.find(b => b.id === tab.blockId);
              if (!tabBlock) return null;
              const thresholds = appSettings.fileSizeThresholds ?? DEFAULT_FILE_SIZE_THRESHOLDS;
              const tabLineCount = getLineCount(tabBlock.content);
              const tabSeverity = getFileSizeSeverity(tabLineCount, thresholds);
              return (
                <FileSizeDot
                  lineCount={tabLineCount}
                  thresholds={thresholds}
                  title={`${tabLineCount.toLocaleString()} / ${getFileSizeSeverityLimit(tabSeverity, thresholds).toLocaleString()} lines — ${getFileSizeSeverityLabel(tabSeverity)}`}
                  className="ml-1.5"
                />
              );
            })()}
```

- [ ] **Step 3: Manual verification**

Run: `npm run electron:start`

- Open a project, create/open a `.rpy` file, and grow its content past 500 lines (paste repeated dialogue lines) and save.
- Confirm a yellow dot appears next to the tab label; keep growing past 1000/1500 to see it turn orange, then red.
- Hover the dot — confirm the native tooltip shows `"N / limit lines — Status"`.
- Confirm a short file's tab shows no dot at all.

- [ ] **Step 4: Typecheck and lint**

Run: `npx tsc --noEmit && npm run lint:fix`
Expected: No new errors.

- [ ] **Step 5: Commit**

```bash
git add src/hooks/useTabContentRenderer.tsx
git commit -m "feat: show file-size severity dot on editor tabs"
```

---

### Task 7: Status bar line count for the active file

**Files:**
- Modify: `src/components/StatusBar.tsx`
- Modify: `src/App.tsx` (~line 1207-1208 for the derived value, ~line 2032-2043 for the `<StatusBar>` call)
- Test: `src/components/StatusBar.test.tsx` (new file)

**Interfaces:**
- Consumes: `getFileSizeSeverity`, `getFileSizeSeverityLabel`, `getFileSizeSeverityTextClass`, `DEFAULT_FILE_SIZE_THRESHOLDS` (Task 1).
- Produces: `StatusBarProps.activeFileLineCount: number | null` and `StatusBarProps.fileSizeThresholds: FileSizeThresholds` (both required — `App.tsx` always resolves a value, unlike the optional props on `CodeBlock`/`StoryCanvas`).

- [ ] **Step 1: Write the failing tests**

Create `src/components/StatusBar.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import StatusBar from './StatusBar';
import { DEFAULT_FILE_SIZE_THRESHOLDS } from '@/lib/fileSizeSeverity';

function createDefaultProps(overrides: Partial<React.ComponentProps<typeof StatusBar>> = {}) {
  return {
    isAnalysisPending: false,
    isScanningAssets: false,
    saveStatus: 'saved' as const,
    blockCount: 3,
    errorCount: 0,
    warningCount: 0,
    screenshotCount: 0,
    activeFileLineCount: null,
    fileSizeThresholds: DEFAULT_FILE_SIZE_THRESHOLDS,
    ...overrides,
  };
}

describe('StatusBar — active file line count', () => {
  it('shows nothing when no file is active', () => {
    render(<StatusBar {...createDefaultProps({ activeFileLineCount: null })} />);
    expect(screen.queryByText(/lines/)).not.toBeInTheDocument();
  });

  it('shows the line count and Ideal status for a small active file', () => {
    render(<StatusBar {...createDefaultProps({ activeFileLineCount: 200 })} />);
    expect(screen.getByText('200 lines (Ideal)')).toBeInTheDocument();
  });

  it('shows Warning status for a file past the warning threshold', () => {
    render(<StatusBar {...createDefaultProps({ activeFileLineCount: 1200 })} />);
    expect(screen.getByText('1,200 lines (Warning)')).toBeInTheDocument();
  });

  it('shows Critical status for a file past the critical threshold', () => {
    render(<StatusBar {...createDefaultProps({ activeFileLineCount: 2000 })} />);
    expect(screen.getByText('2,000 lines (Critical)')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npx vitest run src/components/StatusBar.test.tsx`
Expected: FAIL — `activeFileLineCount`/`fileSizeThresholds` don't exist on `StatusBarProps`, and there's no such text rendered.

- [ ] **Step 3: Implement the status bar changes**

In `src/components/StatusBar.tsx`, add an import after the `React` import (line 8):

```ts
import type { FileSizeThresholds } from '@/types';
import { getFileSizeSeverity, getFileSizeSeverityLabel, getFileSizeSeverityTextClass } from '@/lib/fileSizeSeverity';
```

Add two fields to `StatusBarProps` (after `onCopyLatestScreenshotPath?: () => void;` at line 20):

```ts
  activeFileLineCount: number | null;
  fileSizeThresholds: FileSizeThresholds;
```

Add the two new params to the destructured props (after `onCopyLatestScreenshotPath,` at line 40):

```ts
  onCopyLatestScreenshotPath,
  activeFileLineCount,
  fileSizeThresholds,
}) => {
```

In the JSX, insert a new span right before `<span>{blockCount} file...` (line 150):

```tsx
        {activeFileLineCount !== null && (() => {
          const severity = getFileSizeSeverity(activeFileLineCount, fileSizeThresholds);
          return (
            <span className={`flex items-center gap-1 ${getFileSizeSeverityTextClass(severity)}`}>
              {activeFileLineCount.toLocaleString()} lines ({getFileSizeSeverityLabel(severity)})
            </span>
          );
        })()}
        <span>{blockCount} file{blockCount !== 1 ? 's' : ''}</span>
```

- [ ] **Step 4: Run to verify StatusBar tests pass**

Run: `npx vitest run src/components/StatusBar.test.tsx`
Expected: PASS

- [ ] **Step 5: Wire it from App.tsx**

In `src/App.tsx`, add an import after the existing `@/lib` imports (after line 89, `import { UI_TIMING } from '@/lib/constants';`):

```ts
import { DEFAULT_FILE_SIZE_THRESHOLDS } from '@/lib/fileSizeSeverity';
```

Add a derived value after `activeCanvasTabId` (after line 1208, before the `useGoToLabel` call):

```ts
  const activeFileBlock = useMemo(() => {
    const activeEditorTab = openTabs.find(t => t.id === activeTabId && t.type === 'editor');
    if (!activeEditorTab?.blockId) return null;
    return blocks.find(b => b.id === activeEditorTab.blockId) ?? null;
  }, [openTabs, activeTabId, blocks]);
  const activeFileLineCount = activeFileBlock ? activeFileBlock.content.split('\n').length : null;
```

Update the `<StatusBar>` call (line 2032-2043) to pass the two new props, after `onCopyLatestScreenshotPath={handleCopyLatestScreenshotPath}` (line 2042):

```tsx
              onCopyLatestScreenshotPath={handleCopyLatestScreenshotPath}
              activeFileLineCount={activeFileLineCount}
              fileSizeThresholds={appSettings.fileSizeThresholds ?? DEFAULT_FILE_SIZE_THRESHOLDS}
          />
```

- [ ] **Step 6: Typecheck**

Run: `npx tsc --noEmit`
Expected: No new errors.

- [ ] **Step 7: Manual verification**

Run: `npm run electron:start`

- Open a `.rpy` file in the editor, confirm the status bar (bottom-right, before the file count) shows `"N lines (Status)"` in the matching severity color.
- Switch to the Project Canvas tab (no active editor file) — confirm the line-count readout disappears.
- Grow the file past a threshold and save — confirm the status bar updates.

- [ ] **Step 8: Commit**

```bash
git add src/components/StatusBar.tsx src/components/StatusBar.test.tsx src/App.tsx
git commit -m "feat: show active file's line count and severity in the status bar"
```

---

### Task 8: Full-suite verification

**Files:** none (verification only)

- [ ] **Step 1: Run the full test suite**

Run: `npm test`
Expected: All tests pass, including every new test file from Tasks 1-7.

- [ ] **Step 2: Run the full typecheck**

Run: `npx tsc --noEmit`
Expected: No errors.

- [ ] **Step 3: Run lint**

Run: `npm run lint:fix`
Expected: No errors (auto-fixable issues fixed).

- [ ] **Step 4: Run a production build**

Run: `npm run build`
Expected: Builds successfully, no new warnings beyond the pre-existing chunk-size warning noted in `useTabContentRenderer.tsx`'s header comment.

- [ ] **Step 5: Manual end-to-end pass**

Run: `npm run electron:start`

- Open Settings, change the three thresholds to custom values, close, and confirm graph badges / tab dots / status bar all reflect the new thresholds immediately (no reload needed).
- Reset thresholds back to defaults and confirm the change reverts everywhere.
- Confirm existing graph node behavior (selection ring, diagnostic error/warning glow, root/leaf coloring, config/screen block coloring) is visually unchanged — the size badge must not have altered `borderClass` or `boxShadow` styling.
- Confirm label/jump counts and invalid-jump warnings on blocks still render correctly (regression check against the existing `hasInvalidJumps` banner).

- [ ] **Step 6: Commit if any lint-fix produced changes**

```bash
git status
# If lint:fix modified any files:
git add -u
git commit -m "chore: lint fixes for file-size warning indicator feature"
```
