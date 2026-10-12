import { describe, it, expect } from 'vitest';
import {
  PROJECT_SETTINGS_MIGRATIONS,
  PROJECT_SETTINGS_SCHEMA_VERSION,
  buildProjectSettingsForSave,
  createDefaultProjectSettingsMeta,
  deserializeProjectData,
  migrateProjectSettings,
  type ProjectSettingsMigration,
} from '@/lib/projectSerializer';
import type { ProjectLoadResult } from '@/types';
import v0LegacyEarly from '@/test/fixtures/projectSettings/v0-legacy-early.json';
import v0Release112 from '@/test/fixtures/projectSettings/v0-1.1.2.json';
import v1UnknownFields from '@/test/fixtures/projectSettings/v1-unknown-fields.json';
import v99Newer from '@/test/fixtures/projectSettings/v99-newer.json';
import missingFields from '@/test/fixtures/projectSettings/missing-fields.json';
import corruptTruncated from '@/test/fixtures/projectSettings/corrupt-truncated.json.txt?raw';

// Fixtures are imported as module objects -- clone so a migration that
// mutated its input would be caught rather than leaking between tests.
const clone = <T>(v: T): T => JSON.parse(JSON.stringify(v)) as T;

const RPY_FILES = [
  { path: 'game/script.rpy', content: 'label start:\n    e "Hello"\n    return\n' },
  { path: 'game/chapters/第一章.rpy', content: 'label ch1:\n    "…"\n    return\n' },
];

function makeResult(settings: unknown, overrides: Partial<ProjectLoadResult> = {}): ProjectLoadResult {
  return {
    rootPath: 'C:\\Users\\me\\Ren\'Py Projects\\ゲーム',
    files: clone(RPY_FILES),
    images: [],
    audios: [],
    settings: settings as ProjectLoadResult['settings'],
    tree: { name: 'ゲーム', path: '', children: [] },
    ...overrides,
  };
}

describe('migration registry', () => {
  it('forms a contiguous chain from v0 to the current schema version', () => {
    let version = 0;
    for (const step of PROJECT_SETTINGS_MIGRATIONS) {
      expect(step.from).toBe(version);
      expect(step.to).toBe(version + 1);
      version = step.to;
    }
    expect(version).toBe(PROJECT_SETTINGS_SCHEMA_VERSION);
  });

  it('throws on a gap in the registry instead of silently skipping steps', () => {
    const migrations: ProjectSettingsMigration[] = [
      { from: 0, to: 1, description: 'a', migrate: r => r },
      { from: 2, to: 3, description: 'c', migrate: r => r },
    ];
    expect(() => migrateProjectSettings({}, migrations, 3)).toThrow(/from schema version 1/);
  });

  it('applies steps in order and records each one', () => {
    const migrations: ProjectSettingsMigration[] = [
      { from: 1, to: 2, description: 'second', migrate: r => ({ ...r, trail: [...(r.trail as string[]), 'b'] }) },
      { from: 0, to: 1, description: 'first', migrate: r => ({ ...r, trail: ['a'] }) },
    ];
    const { settings, meta } = migrateProjectSettings({ draftingMode: false }, migrations, 2);
    expect((settings as unknown as { trail: string[] }).trail).toEqual(['a', 'b']);
    expect(meta.appliedMigrations).toEqual(['first', 'second']);
    expect(meta.loadedVersion).toBe(0);
    expect(meta.schemaVersion).toBe(2);
    expect(settings?.schemaVersion).toBe(2);
  });

  it('starts from the stored schemaVersion, skipping steps already applied', () => {
    const migrations: ProjectSettingsMigration[] = [
      { from: 0, to: 1, description: 'first', migrate: () => { throw new Error('should not run'); } },
      { from: 1, to: 2, description: 'second', migrate: r => r },
    ];
    const { meta } = migrateProjectSettings({ schemaVersion: 1 }, migrations, 2);
    expect(meta.appliedMigrations).toEqual(['second']);
  });
});

describe('migrateProjectSettings — historical fixtures', () => {
  it('v0 early format: migrates legacy scene, punchlist tasks and punchlist tab', () => {
    const input = clone(v0LegacyEarly);
    const { settings, meta } = migrateProjectSettings(input);

    expect(meta.loadedVersion).toBe(0);
    expect(meta.schemaVersion).toBe(PROJECT_SETTINGS_SCHEMA_VERSION);
    expect(meta.appliedMigrations).toHaveLength(PROJECT_SETTINGS_SCHEMA_VERSION);
    expect(settings?.schemaVersion).toBe(PROJECT_SETTINGS_SCHEMA_VERSION);

    // scene: moved, not dropped
    expect(settings?.sceneCompositions?.['scene-default']).toEqual(v0LegacyEarly.sceneComposition);
    expect(settings?.sceneNames).toEqual({ 'scene-default': 'Default Scene' });
    expect('sceneComposition' in (settings ?? {})).toBe(false);

    // punchlist: tasks derived, original metadata kept
    expect(settings?.diagnosticsTasks).toHaveLength(1);
    expect(settings?.diagnosticsTasks?.[0]).toMatchObject({ stickyNoteId: 'note-1', status: 'completed', description: 'Done in draft 2' });
    expect(settings?.punchlistMetadata).toEqual(v0LegacyEarly.punchlistMetadata);

    // tabs
    expect(settings?.openTabs.map(t => t.id)).toEqual(['canvas', 'diagnostics', 'scene-composer']);
    expect(settings?.openTabs[1].type).toBe('diagnostics');
    expect(settings?.activeTabId).toBe('diagnostics');

    // untouched data survives
    expect(settings?.stickyNotes).toEqual(v0LegacyEarly.stickyNotes);
    expect(settings?.draftingMode).toBe(true);
    expect(meta.unknownFields).toEqual({});
  });

  it('v0 early format: does not mutate its input', () => {
    const input = clone(v0LegacyEarly);
    migrateProjectSettings(input);
    expect(input).toEqual(v0LegacyEarly);
  });

  it('v0 1.1.2 format: every field round-trips unchanged apart from the version stamp', () => {
    const { settings, meta } = migrateProjectSettings(clone(v0Release112));
    expect(meta.loadedVersion).toBe(0);
    expect(settings).toEqual({ ...v0Release112, schemaVersion: PROJECT_SETTINGS_SCHEMA_VERSION });
    expect(meta.unknownFields).toEqual({});
  });

  it('keeps the legacy scene as an unknown field when the new map already exists', () => {
    const raw = {
      draftingMode: false,
      sceneCompositions: { 'scene-1': { background: null, sprites: [], resolution: { width: 1, height: 1 } } },
      sceneComposition: { background: null, sprites: [], resolution: { width: 2, height: 2 } },
    };
    const { settings, meta } = migrateProjectSettings(raw);
    expect(Object.keys(settings?.sceneCompositions ?? {})).toEqual(['scene-1']);
    expect(meta.unknownFields.sceneComposition).toEqual(raw.sceneComposition);
  });

  it('does not re-derive diagnostics tasks when they already exist', () => {
    const raw = {
      draftingMode: false,
      punchlistMetadata: { 'note:n1': { status: 'open' } },
      diagnosticsTasks: [],
    };
    const { settings } = migrateProjectSettings(raw);
    expect(settings?.diagnosticsTasks).toEqual([]);
  });

  it('collapses a punchlist tab that duplicates an existing diagnostics tab', () => {
    const raw = {
      openTabs: [{ id: 'diagnostics', type: 'diagnostics' }, { id: 'punchlist', type: 'punchlist' }],
      secondaryOpenTabs: [{ id: 'punchlist', type: 'punchlist' }],
      secondaryActiveTabId: 'punchlist',
    };
    const { settings } = migrateProjectSettings(raw);
    expect(settings?.openTabs).toEqual([{ id: 'diagnostics', type: 'diagnostics' }]);
    expect(settings?.secondaryOpenTabs).toEqual([{ id: 'diagnostics', type: 'diagnostics' }]);
    expect(settings?.secondaryActiveTabId).toBe('diagnostics');
  });
});

describe('migrateProjectSettings — missing, unknown and newer fields', () => {
  it('missing fields: migrates a near-empty file without inventing data', () => {
    const { settings, meta } = migrateProjectSettings(clone(missingFields));
    expect(settings).toEqual({ draftingMode: true, schemaVersion: PROJECT_SETTINGS_SCHEMA_VERSION });
    expect(meta.unknownFields).toEqual({});
  });

  it('missing fields: deserializes to sane defaults', () => {
    const snap = deserializeProjectData(makeResult(clone(missingFields)), []);
    expect(snap.primaryTabs).toEqual([{ id: 'canvas', type: 'canvas' }]);
    expect(snap.primaryActiveTabId).toBe('canvas');
    expect(snap.diagnosticsTasks).toEqual([]);
    expect(snap.sceneCompositions).toEqual({});
    expect(snap.canvasSettings.draftingMode).toBe(true);
  });

  it('unknown fields: collected separately and left on the settings object', () => {
    const { settings, meta } = migrateProjectSettings(clone(v1UnknownFields));
    expect(meta.loadedVersion).toBe(1);
    expect(meta.appliedMigrations).toEqual([]);
    expect(meta.unknownFields).toEqual({
      voiceLineMetadata: v1UnknownFields.voiceLineMetadata,
      pluginSettings: v1UnknownFields.pluginSettings,
    });
    expect((settings as unknown as Record<string, unknown>).voiceLineMetadata).toEqual(v1UnknownFields.voiceLineMetadata);
  });

  it('unknown fields: survive a full load -> save round trip', () => {
    const snap = deserializeProjectData(makeResult(clone(v1UnknownFields)), []);
    const saved = buildProjectSettingsForSave(
      { draftingMode: false, openTabs: [{ id: 'canvas', type: 'canvas' }], activeTabId: 'canvas' },
      snap.settingsMeta,
    ) as unknown as Record<string, unknown>;
    expect(saved.voiceLineMetadata).toEqual(v1UnknownFields.voiceLineMetadata);
    expect(saved.pluginSettings).toEqual(v1UnknownFields.pluginSettings);
    expect(saved.schemaVersion).toBe(PROJECT_SETTINGS_SCHEMA_VERSION);
  });

  it('newer schema: passed through unmigrated, flagged, and its version kept', () => {
    const { settings, meta } = migrateProjectSettings(clone(v99Newer));
    expect(meta.newerThanSupported).toBe(true);
    expect(meta.loadedVersion).toBe(99);
    expect(meta.schemaVersion).toBe(99);
    expect(meta.appliedMigrations).toEqual([]);
    expect(meta.unknownFields).toEqual({ futureLayoutEngine: v99Newer.futureLayoutEngine });
    expect(settings?.draftingMode).toBe(true);
  });

  it('newer schema: saving does not downgrade the version', () => {
    const { meta } = migrateProjectSettings(clone(v99Newer));
    const saved = buildProjectSettingsForSave(
      { draftingMode: true, openTabs: [], activeTabId: 'canvas' },
      meta,
    ) as unknown as Record<string, unknown>;
    expect(saved.schemaVersion).toBe(99);
    expect(saved.futureLayoutEngine).toEqual(v99Newer.futureLayoutEngine);
  });

  it.each([
    ['a string', 'one'],
    ['a negative number', -1],
    ['a fraction', 1.5],
  ])('treats an invalid schemaVersion (%s) as unversioned and re-runs migrations', (_label, schemaVersion) => {
    const { settings, meta } = migrateProjectSettings({ schemaVersion, activeTabId: 'punchlist' });
    expect(meta.loadedVersion).toBe(0);
    expect(settings?.activeTabId).toBe('diagnostics');
    expect(settings?.schemaVersion).toBe(PROJECT_SETTINGS_SCHEMA_VERSION);
  });
});

describe('corrupt or non-object settings', () => {
  it('the corrupt fixture really is unparseable', () => {
    expect(() => JSON.parse(corruptTruncated)).toThrow(SyntaxError);
  });

  it.each([
    ['null', null],
    ['an array', [1, 2, 3]],
    ['a string', 'project'],
    ['a number', 42],
  ])('returns null settings and default meta for %s', (_label, raw) => {
    const { settings, meta } = migrateProjectSettings(raw);
    expect(settings).toBeNull();
    expect(meta).toEqual(createDefaultProjectSettingsMeta());
  });

  it('a corrupt settings file never alters the loaded .rpy sources', () => {
    // electron.js reports a corrupt file as settings: {} plus settingsWarning.
    const data = makeResult({}, {
      settingsWarning: { code: 'corrupted', message: 'Unexpected end of JSON input', backupPath: 'x.bak' },
    });
    const snap = deserializeProjectData(data, []);
    expect(snap.blocks.map(b => ({ path: b.filePath, content: b.content }))).toEqual(RPY_FILES);
    expect(snap.defaultScriptBlock).toBeNull();
    expect(snap.settingsMeta.unknownFields).toEqual({});
  });

  it('a non-object settings payload never alters the loaded .rpy sources', () => {
    const snap = deserializeProjectData(makeResult([1, 2]), []);
    expect(snap.blocks.map(b => ({ path: b.filePath, content: b.content }))).toEqual(RPY_FILES);
    expect(snap.primaryTabs).toEqual([{ id: 'canvas', type: 'canvas' }]);
  });
});

describe('buildProjectSettingsForSave', () => {
  it('current settings win over an unknown field of the same name', () => {
    const meta = { ...createDefaultProjectSettingsMeta(), unknownFields: { draftingMode: 'stale', extra: 1 } };
    const saved = buildProjectSettingsForSave({ draftingMode: true, openTabs: [], activeTabId: 'canvas' }, meta) as unknown as Record<string, unknown>;
    expect(saved.draftingMode).toBe(true);
    expect(saved.extra).toBe(1);
  });

  it('meta.schemaVersion wins over a schemaVersion on the settings object', () => {
    const saved = buildProjectSettingsForSave(
      { schemaVersion: 0, draftingMode: false, openTabs: [], activeTabId: 'canvas' },
      createDefaultProjectSettingsMeta(),
    );
    expect(saved.schemaVersion).toBe(PROJECT_SETTINGS_SCHEMA_VERSION);
    expect(Object.keys(saved)[0]).toBe('schemaVersion');
  });
});
