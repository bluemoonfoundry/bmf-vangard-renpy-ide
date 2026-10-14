/**
 * @file symbolNames.ts
 * @description Naming rules shared by the Ren'Py and Python walks and the
 * project resolver: symbol ids, local-label qualification, store-name
 * normalization, and names never recorded as variable references.
 */
import type { SymbolId, SymbolKind } from '@/types';

export function symbolId(kind: SymbolKind, name: string): SymbolId {
  return `${kind}:${name}`;
}

/**
 * Ren'Py local labels: `.sub` written after global label `start` is
 * `start.sub`. A fully dotted name is already qualified. A `.sub` with no
 * preceding global label is left as written (Ren'Py rejects it).
 */
export function qualifyLabel(written: string, currentGlobal: string | null): string {
  if (written.startsWith('.') && currentGlobal) return `${currentGlobal}${written}`;
  return written;
}

/**
 * Normalizes an attribute chain read from code. `store.x` is the store
 * variable `x`; `persistent.x` keeps its prefix; any other `a.b.c` refers to
 * the base `a`. `consumed` is how many chain parts the name covers, so callers
 * can build the source range.
 */
export function normalizeVariableName(parts: string[]): { name: string; consumed: number } {
  if (parts[0] === 'store' && parts.length > 1) {
    const inner = normalizeVariableName(parts.slice(1));
    return { name: inner.name, consumed: inner.consumed + 1 };
  }
  if (parts[0] === 'persistent' && parts.length > 1) {
    return { name: `persistent.${parts[1]}`, consumed: 2 };
  }
  return { name: parts[0], consumed: 1 };
}

/** `define store.x` defines `x`; every other dotted definition keeps its full name. */
export function normalizeDefinitionName(written: string): string {
  return written.startsWith('store.') ? written.slice('store.'.length) : written;
}

/**
 * Names never recorded as variable references: Python builtins and keywords
 * used as names, and Ren'Py's API namespaces, displayables, actions and
 * transitions. One constant so tuning (spec "Open Questions") happens in one
 * place.
 */
export const PYTHON_IGNORED_NAMES: ReadonlySet<string> = new Set([
  // Python
  'True', 'False', 'None', 'self', 'cls', 'NotImplemented', 'Ellipsis',
  'abs', 'all', 'any', 'ascii', 'bin', 'bool', 'bytearray', 'bytes', 'callable', 'chr', 'classmethod',
  'compile', 'complex', 'delattr', 'dict', 'dir', 'divmod', 'enumerate', 'eval', 'exec', 'filter',
  'float', 'format', 'frozenset', 'getattr', 'globals', 'hasattr', 'hash', 'help', 'hex', 'id',
  'input', 'int', 'isinstance', 'issubclass', 'iter', 'len', 'list', 'locals', 'map', 'max', 'min',
  'next', 'object', 'oct', 'open', 'ord', 'pow', 'print', 'property', 'range', 'repr', 'reversed',
  'round', 'set', 'setattr', 'slice', 'sorted', 'staticmethod', 'str', 'sum', 'super', 'tuple',
  'type', 'vars', 'zip', 'Exception', 'ValueError', 'TypeError', 'KeyError', 'IndexError',
  'AttributeError', 'RuntimeError', 'StopIteration', 'math', 'random', 'time', 'os', 're',
  // Ren'Py namespaces and globals
  'renpy', 'config', 'store', 'persistent', 'gui', 'build', 'preferences', 'ui', 'im', 'layout',
  'style', 'achievement', 'director', 'iap', 'updater', 'bubble', 'main_menu', 'save_name',
  // Displayables, transforms, transitions
  'Character', 'DynamicCharacter', 'Transform', 'Solid', 'Frame', 'Text', 'Image', 'Movie',
  'Composite', 'LiveComposite', 'Crop', 'Null', 'Fixed', 'HBox', 'VBox', 'Window', 'Grid',
  'Flatten', 'Color', 'Matrix', 'ConditionSwitch', 'ShowingSwitch', 'DynamicDisplayable',
  'AlphaMask', 'At', 'Dissolve', 'Fade', 'Pixellate', 'Move', 'MoveTransition', 'ImageDissolve',
  'AlphaDissolve', 'CropMove', 'PushMove', 'Pause', 'MultipleTransition', 'ComposeTransition',
  'dissolve', 'fade', 'pixellate', 'move', 'ease', 'linear',
  // Screen actions and values
  'Jump', 'Call', 'Return', 'Show', 'Hide', 'ShowMenu', 'Start', 'MainMenu', 'Quit', 'SetVariable',
  'SetField', 'SetDict', 'SetScreenVariable', 'SetLocalVariable', 'ToggleVariable', 'ToggleField',
  'ToggleScreenVariable', 'ToggleDict', 'Function', 'NullAction', 'OpenURL', 'Play', 'Stop', 'Queue',
  'Preference', 'Notify', 'Confirm', 'FileSave', 'FileLoad', 'FilePage', 'FileSlotName',
  'FileTime', 'FileScreenshot', 'Rollback', 'RollForward', 'Skip', 'With', 'If', 'Scroll',
  'VariableValue', 'FieldValue', 'DictValue', 'ScreenVariableValue', 'AnimatedValue', 'StaticValue',
  'Help', 'HideInterface', 'QuickSave', 'QuickLoad', 'Language', 'GetTooltip',
]);

export function isIgnoredName(name: string): boolean {
  return name.startsWith('_') || PYTHON_IGNORED_NAMES.has(name);
}
