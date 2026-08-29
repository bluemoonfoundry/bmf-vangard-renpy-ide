import { renderHook } from '@testing-library/react';
import { useDiagnostics, migratePunchlistToTasks } from './useDiagnostics';
import { createBlock, createEmptyAnalysisResult, createCharacter, createVariable, createLabelNode, createRouteLink } from '@/test/mocks/sampleData';
import { createIgnoredDiagnosticRule } from '@/lib/diagnosticIgnores';
import type { IgnoredDiagnosticRule } from '@/types';

describe('useDiagnostics', () => {
  it('returns empty issues for empty blocks and empty analysis', () => {
    const { result } = renderHook(() =>
      useDiagnostics([], createEmptyAnalysisResult(), new Map(), new Map(), new Map(), new Map())
    );
    expect(result.current.issues).toHaveLength(0);
    expect(result.current.errorCount).toBe(0);
    expect(result.current.warningCount).toBe(0);
    expect(result.current.infoCount).toBe(0);
  });

  it('filters ignored diagnostics out of issues and counts', () => {
    const blocks = [createBlock({ id: 'b1', content: 'label start:\n    jump missing_label\n' })];
    const analysis = createEmptyAnalysisResult({
      invalidJumps: { b1: ['missing_label'] },
      jumps: {
        b1: [{
          blockId: 'b1',
          target: 'missing_label',
          type: 'jump',
          isDynamic: false,
          line: 2,
          columnStart: 9,
          columnEnd: 22,
        }],
      },
    });
    const ignored: IgnoredDiagnosticRule[] = [{
      category: 'invalid-jump',
      filePath: 'game/script.rpy',
      line: 2,
      message: 'Undefined label "missing_label"',
    }];

    const { result } = renderHook(() =>
      useDiagnostics(blocks, analysis, new Map(), new Map(), new Map(), new Map(), ignored)
    );

    expect(result.current.issues).toHaveLength(0);
    expect(result.current.errorCount).toBe(0);
    expect(result.current.warningCount).toBe(0);
    expect(result.current.infoCount).toBe(0);
  });

  describe('invalid jumps', () => {
    it('generates an error issue for each undefined jump target', () => {
      const blocks = [createBlock({ id: 'b1', content: 'label start:\n    jump missing_label\n', filePath: 'game/script.rpy' })];
      const analysis = createEmptyAnalysisResult({
        invalidJumps: { b1: ['missing_label'] },
        jumps: {
          b1: [{
            blockId: 'b1', target: 'missing_label', type: 'jump', isDynamic: false,
            line: 2, columnStart: 9, columnEnd: 22,
          }],
        },
      });

      const { result } = renderHook(() =>
        useDiagnostics(blocks, analysis, new Map(), new Map(), new Map(), new Map())
      );

      const invalidJumpIssues = result.current.issues.filter(i => i.category === 'invalid-jump');
      expect(invalidJumpIssues).toHaveLength(1);
      expect(invalidJumpIssues[0].severity).toBe('error');
      expect(invalidJumpIssues[0].message).toContain('missing_label');
      expect(result.current.errorCount).toBeGreaterThan(0);
    });

    it('assigns line and column from jump location', () => {
      const blocks = [createBlock({ id: 'b1', content: 'label start:\n    jump gone\n', filePath: 'game/s.rpy' })];
      const analysis = createEmptyAnalysisResult({
        invalidJumps: { b1: ['gone'] },
        jumps: {
          b1: [{ blockId: 'b1', target: 'gone', type: 'jump', isDynamic: false, line: 5, columnStart: 3, columnEnd: 7 }],
        },
      });
      const { result } = renderHook(() =>
        useDiagnostics(blocks, analysis, new Map(), new Map(), new Map(), new Map())
      );
      const issue = result.current.issues.find(i => i.category === 'invalid-jump');
      expect(issue?.line).toBe(5);
      expect(issue?.column).toBe(3);
    });
  });

  describe('missing images', () => {
    it('generates a warning when show references an undefined image', () => {
      const blocks = [createBlock({
        id: 'b1',
        content: 'label start:\n    show eileen happy\n',
        filePath: 'game/script.rpy',
      })];
      const analysis = createEmptyAnalysisResult({ definedImages: new Set<string>() });

      const { result } = renderHook(() =>
        useDiagnostics(blocks, analysis, new Map(), new Map(), new Map(), new Map())
      );

      const imageIssues = result.current.issues.filter(i => i.category === 'missing-image');
      expect(imageIssues.length).toBeGreaterThan(0);
      expect(imageIssues[0].severity).toBe('warning');
    });

    it('does not flag images that are defined', () => {
      const blocks = [createBlock({
        id: 'b1',
        content: 'label start:\n    show eileen\n',
        filePath: 'game/script.rpy',
      })];
      const analysis = createEmptyAnalysisResult({
        definedImages: new Set<string>(['eileen']),
      });

      const { result } = renderHook(() =>
        useDiagnostics(blocks, analysis, new Map(), new Map(), new Map(), new Map())
      );

      const imageIssues = result.current.issues.filter(i => i.category === 'missing-image');
      expect(imageIssues).toHaveLength(0);
    });

    it('does not flag scene expression (not an asset reference)', () => {
      const blocks = [createBlock({
        id: 'b1',
        content: 'label start:\n    scene expression bg\n',
        filePath: 'game/script.rpy',
      })];
      const analysis = createEmptyAnalysisResult();

      const { result } = renderHook(() =>
        useDiagnostics(blocks, analysis, new Map(), new Map(), new Map(), new Map())
      );

      const imageIssues = result.current.issues.filter(i => i.category === 'missing-image');
      expect(imageIssues).toHaveLength(0);
    });
  });

  describe('missing audio', () => {
    it('generates a warning when play references an undefined audio file', () => {
      const blocks = [createBlock({
        id: 'b1',
        content: 'label start:\n    play music "bgm/intro.ogg"\n',
        filePath: 'game/script.rpy',
      })];
      const analysis = createEmptyAnalysisResult();

      const { result } = renderHook(() =>
        useDiagnostics(blocks, analysis, new Map(), new Map(), new Map(), new Map())
      );

      const audioIssues = result.current.issues.filter(i => i.category === 'missing-audio');
      expect(audioIssues).toHaveLength(1);
      expect(audioIssues[0].severity).toBe('warning');
      expect(audioIssues[0].message).toContain('bgm/intro.ogg');
    });

    it('deduplicates missing audio — same file referenced in two blocks appears once', () => {
      const b1 = createBlock({ id: 'b1', content: '    play music "bgm/intro.ogg"\n', filePath: 'game/a.rpy' });
      const b2 = createBlock({ id: 'b2', content: '    play music "bgm/intro.ogg"\n', filePath: 'game/b.rpy' });

      const { result } = renderHook(() =>
        useDiagnostics([b1, b2], createEmptyAnalysisResult(), new Map(), new Map(), new Map(), new Map())
      );

      const audioIssues = result.current.issues.filter(i => i.category === 'missing-audio');
      expect(audioIssues).toHaveLength(1);
    });
  });

  describe('undefined characters', () => {
    it('generates a warning for an undeclared character tag used in dialogue', () => {
      const blocks = [createBlock({
        id: 'b1',
        content: 'label start:\n    ghost "Boo!"\n',
        filePath: 'game/script.rpy',
      })];
      const analysis = createEmptyAnalysisResult();

      const { result } = renderHook(() =>
        useDiagnostics(blocks, analysis, new Map(), new Map(), new Map(), new Map())
      );

      const charIssues = result.current.issues.filter(i => i.category === 'undefined-character');
      expect(charIssues).toHaveLength(1);
      expect(charIssues[0].message).toContain('ghost');
    });

    it('does not flag dialogue spoken by a defined character', () => {
      const blocks = [createBlock({
        id: 'b1',
        content: 'label start:\n    e "Hello!"\n',
        filePath: 'game/script.rpy',
      })];
      const analysis = createEmptyAnalysisResult({
        characters: new Map([['e', createCharacter({ tag: 'e', name: 'Eileen' })]]),
      });

      const { result } = renderHook(() =>
        useDiagnostics(blocks, analysis, new Map(), new Map(), new Map(), new Map())
      );

      expect(result.current.issues.filter(i => i.category === 'undefined-character')).toHaveLength(0);
    });

    it('does not flag Ren\'Py statement keywords as character tags', () => {
      const blocks = [createBlock({
        id: 'b1',
        content: 'label start:\n    show eileen\n    hide eileen\n',
        filePath: 'game/script.rpy',
      })];

      const { result } = renderHook(() =>
        useDiagnostics(blocks, createEmptyAnalysisResult(), new Map(), new Map(), new Map(), new Map())
      );

      expect(result.current.issues.filter(i => i.category === 'undefined-character')).toHaveLength(0);
    });
  });

  describe('unused characters', () => {
    it('generates an info issue when a character is defined but never used', () => {
      const char = createCharacter({ tag: 'npc', name: 'NPC', definedInBlockId: 'b1' });
      const blocks = [createBlock({ id: 'b1', filePath: 'game/script.rpy' })];
      const analysis = createEmptyAnalysisResult({
        characters: new Map([['npc', char]]),
        characterUsage: new Map([['npc', 0]]),
      });

      const { result } = renderHook(() =>
        useDiagnostics(blocks, analysis, new Map(), new Map(), new Map(), new Map())
      );

      const unusedIssues = result.current.issues.filter(i => i.category === 'unused-character');
      expect(unusedIssues).toHaveLength(1);
      expect(unusedIssues[0].severity).toBe('info');
      expect(result.current.infoCount).toBeGreaterThan(0);
    });

    it('does not flag a character with dialogue usage', () => {
      const char = createCharacter({ tag: 'e', name: 'Eileen', definedInBlockId: 'b1' });
      const analysis = createEmptyAnalysisResult({
        characters: new Map([['e', char]]),
        characterUsage: new Map([['e', 5]]),
      });

      const { result } = renderHook(() =>
        useDiagnostics([], analysis, new Map(), new Map(), new Map(), new Map())
      );

      expect(result.current.issues.filter(i => i.category === 'unused-character')).toHaveLength(0);
    });
  });

  describe('undefined screens', () => {
    it('generates a warning when a call screen references an undefined screen', () => {
      const blocks = [createBlock({
        id: 'b1',
        content: 'label start:\n    call screen settings_menu\n',
        filePath: 'game/script.rpy',
      })];

      const { result } = renderHook(() =>
        useDiagnostics(blocks, createEmptyAnalysisResult(), new Map(), new Map(), new Map(), new Map())
      );

      const screenIssues = result.current.issues.filter(i => i.category === 'undefined-screen');
      expect(screenIssues).toHaveLength(1);
      expect(screenIssues[0].message).toContain('settings_menu');
    });

    it('does not flag a screen that is defined in analysis', () => {
      const blocks = [createBlock({
        id: 'b1',
        content: 'label start:\n    call screen settings_menu\n',
        filePath: 'game/script.rpy',
      })];
      const analysis = createEmptyAnalysisResult({
        screens: new Map([['settings_menu', { name: 'settings_menu', parameters: '', definedInBlockId: 'b1', line: 1 }]]),
      });

      const { result } = renderHook(() =>
        useDiagnostics(blocks, analysis, new Map(), new Map(), new Map(), new Map())
      );

      expect(result.current.issues.filter(i => i.category === 'undefined-screen')).toHaveLength(0);
    });
  });

  describe('undefined variables', () => {
    it('generates a warning when [interpolation] references an undefined variable', () => {
      const blocks = [createBlock({
        id: 'b1',
        content: 'label start:\n    "Hello [player_nmae]!"\n',
        filePath: 'game/script.rpy',
      })];
      const analysis = createEmptyAnalysisResult();

      const { result } = renderHook(() =>
        useDiagnostics(blocks, analysis, new Map(), new Map(), new Map(), new Map())
      );

      const varIssues = result.current.issues.filter(i => i.category === 'undefined-variable');
      expect(varIssues).toHaveLength(1);
      expect(varIssues[0].severity).toBe('warning');
      expect(varIssues[0].message).toContain('player_nmae');
      expect(varIssues[0].line).toBe(2);
    });

    it('does not flag a variable that is defined', () => {
      const blocks = [createBlock({
        id: 'b1',
        content: 'label start:\n    "Hello [player_name]!"\n',
        filePath: 'game/script.rpy',
      })];
      const analysis = createEmptyAnalysisResult({
        variables: new Map([['player_name', createVariable({ name: 'player_name' })]]),
      });

      const { result } = renderHook(() =>
        useDiagnostics(blocks, analysis, new Map(), new Map(), new Map(), new Map())
      );

      expect(result.current.issues.filter(i => i.category === 'undefined-variable')).toHaveLength(0);
    });

    it('deduplicates repeated references to the same undefined variable', () => {
      const blocks = [createBlock({
        id: 'b1',
        content: 'label start:\n    if has_flag:\n        "Set: [has_flag]"\n',
        filePath: 'game/script.rpy',
      })];
      const analysis = createEmptyAnalysisResult();

      const { result } = renderHook(() =>
        useDiagnostics(blocks, analysis, new Map(), new Map(), new Map(), new Map())
      );

      expect(result.current.issues.filter(i => i.category === 'undefined-variable' && i.message.includes('has_flag'))).toHaveLength(1);
    });
  });

  describe('unused variables', () => {
    it('generates an info issue when a story-block variable is unused', () => {
      const variable = createVariable({ name: 'unused_var', definedInBlockId: 'b1', type: 'default', initialValue: '0', line: 2 });
      const blocks = [createBlock({ id: 'b1', filePath: 'game/script.rpy' })];
      const analysis = createEmptyAnalysisResult({
        variables: new Map([['unused_var', variable]]),
        variableUsages: new Map(),
        storyBlockIds: new Set(['b1']),
      });

      const { result } = renderHook(() =>
        useDiagnostics(blocks, analysis, new Map(), new Map(), new Map(), new Map())
      );

      const unusedVarIssues = result.current.issues.filter(i => i.category === 'unused-variable');
      expect(unusedVarIssues.length).toBeGreaterThan(0);
      expect(unusedVarIssues[0].severity).toBe('info');
    });

    it('does not flag a variable in a non-story block', () => {
      const variable = createVariable({ name: 'gui_var', definedInBlockId: 'gui-block', type: 'default', initialValue: '"value"', line: 1 });
      const analysis = createEmptyAnalysisResult({
        variables: new Map([['gui_var', variable]]),
        variableUsages: new Map(),
        storyBlockIds: new Set(['story-block']), // gui-block NOT included
      });

      const { result } = renderHook(() =>
        useDiagnostics([], analysis, new Map(), new Map(), new Map(), new Map())
      );

      expect(result.current.issues.filter(i => i.category === 'unused-variable')).toHaveLength(0);
    });
  });

  describe('unreachable labels', () => {
    it('generates an info issue for a label with no incoming jumps', () => {
      const blocks = [createBlock({ id: 'b1', filePath: 'game/script.rpy' })];
      const analysis = createEmptyAnalysisResult({
        labels: {
          orphan: { blockId: 'b1', label: 'orphan', line: 5, column: 7, type: 'label' },
        },
        jumps: {},
      });

      const { result } = renderHook(() =>
        useDiagnostics(blocks, analysis, new Map(), new Map(), new Map(), new Map())
      );

      const unreachable = result.current.issues.filter(i => i.category === 'unreachable-label');
      expect(unreachable).toHaveLength(1);
      expect(unreachable[0].severity).toBe('info');
    });

    it('does not flag "start" label as unreachable', () => {
      const analysis = createEmptyAnalysisResult({
        labels: {
          start: { blockId: 'b1', label: 'start', line: 1, column: 7, type: 'label' },
        },
        jumps: {},
      });

      const { result } = renderHook(() =>
        useDiagnostics([], analysis, new Map(), new Map(), new Map(), new Map())
      );

      expect(result.current.issues.filter(i => i.category === 'unreachable-label')).toHaveLength(0);
    });
  });

  describe('jump cycles', () => {
    it('flags a two-label loop with no exit as a warning', () => {
      const labelNodes = [
        createLabelNode({ id: 'b1:hub', label: 'hub', blockId: 'b1', startLine: 3 }),
        createLabelNode({ id: 'b1:loop', label: 'loop', blockId: 'b1', startLine: 8 }),
      ];
      const routeLinks = [
        createRouteLink({ id: 'l1', sourceId: 'b1:hub', targetId: 'b1:loop' }),
        createRouteLink({ id: 'l2', sourceId: 'b1:loop', targetId: 'b1:hub' }),
      ];
      const blocks = [createBlock({ id: 'b1', filePath: 'game/script.rpy' })];
      const analysis = createEmptyAnalysisResult({ labelNodes, routeLinks });

      const { result } = renderHook(() =>
        useDiagnostics(blocks, analysis, new Map(), new Map(), new Map(), new Map())
      );

      const cycles = result.current.issues.filter(i => i.category === 'jump-cycle');
      expect(cycles).toHaveLength(1);
      expect(cycles[0].severity).toBe('warning');
      expect(cycles[0].message).toContain('hub');
      expect(cycles[0].message).toContain('loop');
      expect(cycles[0].filePath).toBe('game/script.rpy');
    });

    it('does not flag a hub-and-return pattern that has an exit', () => {
      const labelNodes = [
        createLabelNode({ id: 'b1:hub', label: 'hub', blockId: 'b1' }),
        createLabelNode({ id: 'b1:talk', label: 'talk', blockId: 'b1' }),
        createLabelNode({ id: 'b1:leave', label: 'leave', blockId: 'b1' }),
      ];
      const routeLinks = [
        createRouteLink({ id: 'l1', sourceId: 'b1:hub', targetId: 'b1:talk' }),
        createRouteLink({ id: 'l2', sourceId: 'b1:talk', targetId: 'b1:hub' }),
        createRouteLink({ id: 'l3', sourceId: 'b1:hub', targetId: 'b1:leave' }),
      ];
      const analysis = createEmptyAnalysisResult({ labelNodes, routeLinks });

      const { result } = renderHook(() =>
        useDiagnostics([], analysis, new Map(), new Map(), new Map(), new Map())
      );

      expect(result.current.issues.filter(i => i.category === 'jump-cycle')).toHaveLength(0);
    });

    it('flags a label that jumps to itself', () => {
      const labelNodes = [createLabelNode({ id: 'b1:stuck', label: 'stuck', blockId: 'b1' })];
      const routeLinks = [createRouteLink({ id: 'l1', sourceId: 'b1:stuck', targetId: 'b1:stuck' })];
      const analysis = createEmptyAnalysisResult({ labelNodes, routeLinks });

      const { result } = renderHook(() =>
        useDiagnostics([], analysis, new Map(), new Map(), new Map(), new Map())
      );

      const cycles = result.current.issues.filter(i => i.category === 'jump-cycle');
      expect(cycles).toHaveLength(1);
      expect(cycles[0].message).toContain('stuck');
    });

    it('can be suppressed via ignoredDiagnostics', () => {
      const blocks = [createBlock({ id: 'b1', filePath: 'game/script.rpy' })];
      const labelNodes = [
        createLabelNode({ id: 'b1:hub', label: 'hub', blockId: 'b1' }),
        createLabelNode({ id: 'b1:loop', label: 'loop', blockId: 'b1' }),
      ];
      const routeLinks = [
        createRouteLink({ id: 'l1', sourceId: 'b1:hub', targetId: 'b1:loop' }),
        createRouteLink({ id: 'l2', sourceId: 'b1:loop', targetId: 'b1:hub' }),
      ];
      const analysis = createEmptyAnalysisResult({ labelNodes, routeLinks });

      const { result: before } = renderHook(() =>
        useDiagnostics(blocks, analysis, new Map(), new Map(), new Map(), new Map())
      );
      const cycleIssue = before.current.issues.find(i => i.category === 'jump-cycle')!;
      const ignored: IgnoredDiagnosticRule[] = [createIgnoredDiagnosticRule(cycleIssue)];

      const { result: after } = renderHook(() =>
        useDiagnostics(blocks, analysis, new Map(), new Map(), new Map(), new Map(), ignored)
      );

      expect(after.current.issues.filter(i => i.category === 'jump-cycle')).toHaveLength(0);
    });
  });

  describe('severity counts', () => {
    it('counts errors, warnings, and infos separately', () => {
      const char = createCharacter({ tag: 'unused', definedInBlockId: 'b1' });
      const blocks = [createBlock({
        id: 'b1',
        content: 'label start:\n    jump missing\n    show missing_image\n',
        filePath: 'game/script.rpy',
      })];
      const analysis = createEmptyAnalysisResult({
        invalidJumps: { b1: ['missing'] },
        jumps: {
          b1: [{ blockId: 'b1', target: 'missing', type: 'jump', isDynamic: false, line: 2, columnStart: 9, columnEnd: 16 }],
        },
        characters: new Map([['unused', char]]),
        characterUsage: new Map([['unused', 0]]),
      });

      const { result } = renderHook(() =>
        useDiagnostics(blocks, analysis, new Map(), new Map(), new Map(), new Map())
      );

      expect(result.current.errorCount).toBeGreaterThan(0);
      expect(result.current.infoCount).toBeGreaterThan(0);
    });
  });
});

describe('migratePunchlistToTasks', () => {
  it('returns empty array for empty metadata', () => {
    expect(migratePunchlistToTasks({})).toEqual([]);
  });

  it('migrates note: entries to DiagnosticsTask', () => {
    const metadata = {
      'note:abc123': { status: 'open' as const, notes: 'Fix this', imageItems: [], audioItems: [] },
    };
    const tasks = migratePunchlistToTasks(metadata);
    expect(tasks).toHaveLength(1);
    expect(tasks[0].stickyNoteId).toBe('abc123');
    expect(tasks[0].description).toBe('Fix this');
    expect(tasks[0].status).toBe('open');
  });

  it('migrates completed note status correctly', () => {
    const metadata = {
      'note:xyz': { status: 'completed' as const, notes: 'Done', imageItems: [], audioItems: [] },
    };
    const tasks = migratePunchlistToTasks(metadata);
    expect(tasks[0].status).toBe('completed');
  });

  it('skips non-note entries', () => {
    const metadata = {
      'image:eileen': { status: 'open' as const, notes: '', imageItems: [], audioItems: [] },
      'audio:bgm': { status: 'open' as const, notes: '', imageItems: [], audioItems: [] },
    };
    expect(migratePunchlistToTasks(metadata)).toHaveLength(0);
  });

  it('assigns a unique id to each task', () => {
    const metadata = {
      'note:a': { status: 'open' as const, notes: 'A', imageItems: [], audioItems: [] },
      'note:b': { status: 'open' as const, notes: 'B', imageItems: [], audioItems: [] },
    };
    const tasks = migratePunchlistToTasks(metadata);
    expect(tasks[0].id).not.toBe(tasks[1].id);
  });
});
