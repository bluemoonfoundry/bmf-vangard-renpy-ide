/**
 * @file blockContribution.ts
 * @description Builds one block's plain-data contribution to the project
 * symbol index: parses the block, runs the Ren'Py and Python walks, maps
 * Python points back to `.rpy` offsets, and always frees the parse trees.
 * Never rejects: a parse or extraction failure yields an empty contribution
 * with `hasError: true` so one bad file can't sink the index.
 */
import type { Point, SyntaxNode } from 'web-tree-sitter';
import type { BlockContribution, ReferenceContext, SymbolDefinition, SymbolReference } from '@/types';
import { parseBlock, disposeParsedBlock, type ParsedBlock, type PythonInjection } from '@/lib/tree-sitter/parseBlock';
import { djb2 } from '@/lib/contentHash';
import { createRangeContext, mapInjectionPoint, rangeFromOffsets } from '@/lib/tree-sitter/sourceRange';
import { symbolId } from '@/lib/tree-sitter/symbolNames';
import { enclosingLabelFor, screenScopeFor, walkRenpyTree, type ScreenScope } from '@/lib/tree-sitter/renpyWalk';
import { walkPythonTree } from '@/lib/tree-sitter/pythonWalk';
import { createThrottledWarn } from '@/lib/workerLogger';

export interface IndexBlock { id: string; filePath: string; content: string }

const CONDITION_PARENTS = new Set(['if_statement', 'elif_clause', 'while_statement', 'menu_choice']);

/** Where an injected Python fragment sits, from its injection kind and Ren'Py ancestors. */
export function injectionContext(root: SyntaxNode, injection: PythonInjection): ReferenceContext {
  if (injection.kind === 'python-block') return 'python-block';
  if (injection.kind === 'dollar-statement') return 'dollar';
  for (let node: SyntaxNode | null = root.descendantForIndex(injection.range[0], injection.range[1]); node; node = node.parent) {
    if (node.type === 'property' || node.type === 'screen_language_statement') return 'screen-expression';
    if (CONDITION_PARENTS.has(node.type)) return 'condition';
    if (node.type === 'menu_set') return 'statement';
    if (node.type.startsWith('atl_')) return 'atl-expression';
  }
  return 'screen-expression';
}

/**
 * The widget tag of the screen line a screen-expression injection sits on,
 * or null. Every screen-language property is Python-injected, so callers
 * use this to skip text that is not a Python expression: `use item_list(n)`
 * starts with the screen reference renpyWalk.ts already records (callers
 * drop the use at (0, 0)), and `tag menu` names the screen's tag (nms4.47).
 */
export function screenWidgetTag(root: SyntaxNode, injection: PythonInjection): string | null {
  if (injection.kind !== 'screen-expression') return null;
  for (let node: SyntaxNode | null = root.descendantForIndex(injection.range[0], injection.range[1]); node; node = node.parent) {
    if (node.type === 'screen_language_statement') return node.childForFieldName('widget_tag')?.text ?? null;
  }
  return null;
}

/**
 * Drops injections nested strictly inside another one, since walking both
 * double-counts. Before nms4.15 the injection query also matched `if`/`while`
 * conditions inside a `python:` body (the grammar parsed the body as Ren'Py
 * statements); the body is now one opaque `python_block`, so this is a guard.
 */
export function outermostInjections(injections: PythonInjection[]): PythonInjection[] {
  return injections.filter((inner) => !injections.some((outer) =>
    outer !== inner
    && outer.range[0] <= inner.range[0] && inner.range[1] <= outer.range[1]
    && (outer.range[0] !== inner.range[0] || outer.range[1] !== inner.range[1])));
}

/**
 * The named store of the `python in X:` / `init python in X:` block an
 * injection is the body of (nms4.34), or null for the default store.
 * `in store` and `in store.X` are spelled relative to the default store.
 */
export function injectionStoreName(root: SyntaxNode, injection: PythonInjection): string | null {
  if (injection.kind !== 'python-block') return null;
  for (let node: SyntaxNode | null = root.descendantForIndex(injection.range[0], injection.range[1]); node; node = node.parent) {
    if (node.type !== 'python_statement' && node.type !== 'init_python_statement') continue;
    const store = node.childForFieldName('store')?.text ?? null;
    if (store === null || store === 'store') return null;
    return store.startsWith('store.') ? store.slice('store.'.length) : store;
  }
  return null;
}

/**
 * Drops variable references to screen-local names inside their screen
 * (nms4.31), the way pythonWalk.ts leaves out function locals. A bare name
 * written by a `$` line or a `python:` block in a screen (nms4.34) is
 * screen-local too. A `persistent.x`
 * or `store.x` reference is never local: its name is dotted, or its source
 * text is not the bare name.
 */
export function withoutScreenLocals(references: SymbolReference[], scopes: ScreenScope[], content: string): SymbolReference[] {
  if (scopes.length === 0) return references;
  const isBare = (ref: SymbolReference) => !ref.name.includes('.')
    && content.slice(ref.range.start.offset, ref.range.end.offset) === ref.name;
  for (const ref of references) {
    if (ref.kind !== 'variable' || ref.refKind !== 'write' || !isBare(ref)) continue;
    if (ref.context !== 'dollar' && ref.context !== 'python-block') continue;
    screenScopeFor(scopes, ref.range.start.offset)?.locals.add(ref.name);
  }
  return references.filter((ref) => ref.kind !== 'variable' || !isBare(ref)
    || !screenScopeFor(scopes, ref.range.start.offset)?.locals.has(ref.name));
}

/** At most this many block failures are logged per worker lifetime. */
const MAX_BLOCK_FAILURE_WARNINGS = 5;
let warnBlockFailure = createThrottledWarn(MAX_BLOCK_FAILURE_WARNINGS);

/** Test hook: restarts the block-failure warning budget. */
export function resetBlockFailureWarnings(): void {
  warnBlockFailure = createThrottledWarn(MAX_BLOCK_FAILURE_WARNINGS);
}

const byOffset = (a: { range: { start: { offset: number } } }, b: { range: { start: { offset: number } } }) =>
  a.range.start.offset - b.range.start.offset;

export async function buildBlockContribution(block: IndexBlock): Promise<BlockContribution> {
  const contentHash = djb2(block.content);
  const empty = (): BlockContribution => ({
    blockId: block.id, filePath: block.filePath, contentHash, hasError: true,
    definitions: [], references: [], menus: [], pythonBlocks: [],
  });

  let parsed: ParsedBlock;
  try {
    parsed = await parseBlock(block.content);
  } catch (error) {
    warnBlockFailure(`Symbol index: failed to parse ${block.filePath || block.id}`, error);
    return empty();
  }

  try {
    const root = parsed.tree.rootNode;
    const ctx = createRangeContext(block.id, block.filePath, block.content);
    const renpy = walkRenpyTree(root, ctx);
    const definitions: SymbolDefinition[] = [...renpy.definitions];
    const references: SymbolReference[] = [...renpy.references];

    for (const injection of outermostInjections(parsed.pythonInjections)) {
      const widgetTag = screenWidgetTag(root, injection);
      if (widgetTag === 'tag') continue;
      const injectionStart = injection.range[0];
      const context = injectionContext(root, injection);
      const enclosingLabel = enclosingLabelFor(renpy.labelSpans, injectionStart);
      const toOffset = (p: Point) => mapInjectionPoint(ctx, injectionStart, p.row, p.column);
      const python = walkPythonTree(injection.tree.rootNode, { allowDefinitions: context === 'python-block' });
      const skipLeadingName = widgetTag === 'use';
      // A def in a screen's `python:` block is local to the screen (nms4.34).
      const screen = context === 'python-block' ? screenScopeFor(renpy.screenScopes, injectionStart) : null;
      // Names bound at the top of a named store's body live in that store
      // (nms4.34): `count = 0` in `init python in mystore:` is `mystore.count`.
      // Other bare reads (builtins, default-store names) stay unqualified.
      const store = injectionStoreName(root, injection);
      const bound = new Set([
        ...python.uses.filter((u) => u.refKind === 'write').map((u) => u.name),
        ...python.defs.map((d) => d.name),
      ]);
      const qualify = (name: string, start: number, end: number, isWrite: boolean): string =>
        store && (isWrite || bound.has(name)) && block.content.slice(start, end) === name ? `${store}.${name}` : name;

      for (const use of python.uses) {
        if (skipLeadingName && use.start.row === 0 && use.start.column === 0) continue;
        const start = toOffset(use.start);
        const end = toOffset(use.end);
        const name = qualify(use.name, start, end, use.refKind === 'write');
        references.push({
          symbolId: symbolId('variable', name), kind: 'variable', name,
          refKind: use.refKind, context,
          range: rangeFromOffsets(ctx, start, end),
          enclosingLabel,
        });
      }
      for (const def of python.defs) {
        if (screen) {
          screen.locals.add(def.name);
          continue;
        }
        const name = store ? `${store}.${def.name}` : def.name;
        definitions.push({
          symbolId: symbolId(def.kind, name), kind: def.kind, name,
          defKind: def.kind === 'python-function' ? 'def' : 'class',
          range: rangeFromOffsets(ctx, toOffset(def.start), toOffset(def.end)),
          nameRange: rangeFromOffsets(ctx, toOffset(def.nameStart), toOffset(def.nameEnd)),
          enclosingLabel,
        });
      }
    }

    definitions.sort(byOffset);
    return {
      blockId: block.id, filePath: block.filePath, contentHash,
      hasError: root.hasError,
      definitions, references: withoutScreenLocals(references, renpy.screenScopes, block.content).sort(byOffset),
      menus: renpy.menus, pythonBlocks: renpy.pythonBlocks,
    };
  } catch (error) {
    warnBlockFailure(`Symbol index: failed to extract symbols from ${block.filePath || block.id}`, error);
    return empty();
  } finally {
    disposeParsedBlock(parsed);
  }
}
