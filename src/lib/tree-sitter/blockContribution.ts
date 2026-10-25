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
import { enclosingLabelFor, walkRenpyTree } from '@/lib/tree-sitter/renpyWalk';
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
    if (node.type.startsWith('atl_')) return 'atl-expression';
  }
  return 'screen-expression';
}

/**
 * `use item_list(n)` is a screen-language property, so its whole text is
 * Python-injected; the leading name is the screen reference renpyWalk.ts
 * already records, not a variable read. Callers drop the use at (0, 0).
 */
export function isUseInjection(root: SyntaxNode, injection: PythonInjection): boolean {
  if (injection.kind !== 'screen-expression') return false;
  for (let node: SyntaxNode | null = root.descendantForIndex(injection.range[0], injection.range[1]); node; node = node.parent) {
    if (node.type === 'screen_language_statement') return node.childForFieldName('widget_tag')?.text === 'use';
  }
  return false;
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
      const injectionStart = injection.range[0];
      const context = injectionContext(root, injection);
      const enclosingLabel = enclosingLabelFor(renpy.labelSpans, injectionStart);
      const toOffset = (p: Point) => mapInjectionPoint(ctx, injectionStart, p.row, p.column);
      const python = walkPythonTree(injection.tree.rootNode, { allowDefinitions: context === 'python-block' });
      const skipLeadingName = isUseInjection(root, injection);

      for (const use of python.uses) {
        if (skipLeadingName && use.start.row === 0 && use.start.column === 0) continue;
        references.push({
          symbolId: symbolId('variable', use.name), kind: 'variable', name: use.name,
          refKind: use.refKind, context,
          range: rangeFromOffsets(ctx, toOffset(use.start), toOffset(use.end)),
          enclosingLabel,
        });
      }
      for (const def of python.defs) {
        definitions.push({
          symbolId: symbolId(def.kind, def.name), kind: def.kind, name: def.name,
          defKind: def.kind === 'python-function' ? 'def' : 'class',
          range: rangeFromOffsets(ctx, toOffset(def.start), toOffset(def.end)),
          nameRange: rangeFromOffsets(ctx, toOffset(def.nameStart), toOffset(def.nameEnd)),
          enclosingLabel,
        });
      }
    }

    definitions.sort(byOffset);
    references.sort(byOffset);
    return {
      blockId: block.id, filePath: block.filePath, contentHash,
      hasError: root.hasError,
      definitions, references, menus: renpy.menus, pythonBlocks: renpy.pythonBlocks,
    };
  } catch (error) {
    warnBlockFailure(`Symbol index: failed to extract symbols from ${block.filePath || block.id}`, error);
    return empty();
  } finally {
    disposeParsedBlock(parsed);
  }
}
