/**
 * @file projectIndex.ts
 * @description Merges per-block contributions into the project-wide symbol
 * index (`resolveProjectIndex`, pure and synchronous) and keeps contributions
 * cached by content hash so only changed blocks are re-parsed
 * (`updateProjectIndex`). See
 * docs/superpowers/specs/2026-10-13-nms4.2-symbol-index-design.md §3.
 */
import type {
  BlockContribution, IndexedSymbol, ProjectSymbolIndex, SourceRange, SymbolId, SymbolKind, SymbolReference,
} from '@/types';
import { symbolId } from '@/lib/tree-sitter/symbolNames';

const cmp = (a: string, b: string): number => (a < b ? -1 : a > b ? 1 : 0);

const compareRanges = (a: SourceRange, b: SourceRange): number =>
  cmp(a.filePath, b.filePath) || cmp(a.blockId, b.blockId) || a.start.offset - b.start.offset;

/** Read references to these kinds are tried in this order before falling back to a variable. */
const READ_RESOLUTION_ORDER: SymbolKind[] = ['python-function', 'python-class', 'character', 'variable'];

export function resolveProjectIndex(contributions: Map<string, BlockContribution>): ProjectSymbolIndex {
  const ordered = [...contributions.values()].sort((a, b) => cmp(a.filePath, b.filePath) || cmp(a.blockId, b.blockId));
  const definitions = ordered.flatMap((c) => c.definitions);
  const references = ordered.flatMap((c) => c.references);

  const symbols = new Map<SymbolId, IndexedSymbol>();
  const ensure = (id: SymbolId, kind: SymbolKind, name: string): IndexedSymbol => {
    let symbol = symbols.get(id);
    if (!symbol) {
      symbol = { id, kind, name, definitions: [], references: [] };
      symbols.set(id, symbol);
    }
    return symbol;
  };

  for (const definition of definitions) ensure(definition.symbolId, definition.kind, definition.name).definitions.push(definition);

  // Implicit definitions: the earliest write of a variable nothing defines.
  for (const ref of references) {
    if (ref.refKind !== 'write' || ref.kind !== 'variable' || ref.symbolId === null) continue;
    const existing = symbols.get(ref.symbolId);
    if (existing && existing.definitions.length > 0) continue;
    ensure(ref.symbolId, 'variable', ref.name).definitions.push({
      symbolId: ref.symbolId, kind: 'variable', name: ref.name,
      defKind: ref.context === 'python-block' ? 'python-assign' : 'implicit',
      range: ref.range, nameRange: ref.range, enclosingLabel: ref.enclosingLabel,
    });
  }

  // Images resolve by tag (first word) when there is no exact definition.
  const imagesByTag = new Map<string, IndexedSymbol[]>();
  for (const symbol of symbols.values()) {
    if (symbol.kind !== 'image') continue;
    const tag = symbol.name.split(' ')[0];
    imagesByTag.set(tag, [...(imagesByTag.get(tag) ?? []), symbol]);
  }
  for (const candidates of imagesByTag.values()) {
    candidates.sort((a, b) => a.name.length - b.name.length || cmp(a.name, b.name));
  }

  const resolve = (ref: SymbolReference): SymbolReference => {
    if (ref.symbolId === null || symbols.has(ref.symbolId)) {
      if (ref.kind !== 'variable' || ref.refKind !== 'read') return ref;
    }
    if (ref.kind === 'image') {
      const candidate = imagesByTag.get(ref.name.split(' ')[0])?.[0];
      return candidate ? { ...ref, symbolId: candidate.id } : ref;
    }
    if (ref.kind === 'variable' && ref.refKind === 'read') {
      for (const kind of READ_RESOLUTION_ORDER) {
        const id = symbolId(kind, ref.name);
        if (symbols.has(id)) return { ...ref, symbolId: id, kind };
      }
    }
    return ref;
  };

  const unresolved: SymbolReference[] = [];
  for (const ref of references) {
    const resolved = resolve(ref);
    if (resolved.symbolId === null) continue; // dynamic jump/call: not attached, not unresolved
    const symbol = symbols.get(resolved.symbolId);
    if (symbol) symbol.references.push(resolved);
    else unresolved.push(resolved);
  }

  for (const symbol of symbols.values()) {
    symbol.definitions.sort((a, b) => compareRanges(a.range, b.range));
    symbol.references.sort((a, b) => compareRanges(a.range, b.range));
  }
  unresolved.sort((a, b) => compareRanges(a.range, b.range));

  const sortedSymbols = new Map([...symbols.entries()].sort(([a], [b]) => cmp(a, b)));
  const duplicates = [...sortedSymbols.values()]
    .filter((s) => (s.kind === 'label' || s.kind === 'screen') && s.definitions.length > 1)
    .map((s) => s.id);

  return { symbols: sortedSymbols, unresolved, duplicates, contributions };
}
