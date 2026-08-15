/**
 * @file lib/usageLocations.ts
 * @description Resolves raw {blockId, line} occurrences (dialogue lines, variable
 * usages) into grouped, human-readable locations: which file, which label, how
 * many times. Backs CharacterEditorView's usage table and StatsView's Variable
 * Coverage section — both surface "where is this used" independent of the
 * canvas find-usages highlight.
 */
import type { Block, LabelNode } from '@/types';

export interface UsageLocationGroup {
  blockId: string;
  filePath: string;
  fileName: string;
  label: string | null;
  firstLine: number;
  count: number;
}

export function findLabelForLine(
  blockId: string,
  line: number,
  labelNodes: LabelNode[],
): LabelNode | undefined {
  const labelsInBlock = labelNodes
    .filter(n => n.blockId === blockId)
    .sort((a, b) => a.startLine - b.startLine);
  return labelsInBlock.slice().reverse().find(l => l.startLine <= line);
}

/** Finds the label active at `line` within a pre-sorted (by startLine ascending) list of labels for a single block. */
function findLabelInSortedList(sortedLabelsInBlock: LabelNode[], line: number): LabelNode | undefined {
  let result: LabelNode | undefined;
  for (const l of sortedLabelsInBlock) {
    if (l.startLine <= line) {
      result = l;
    } else {
      break;
    }
  }
  return result;
}

export function groupUsageLocations(
  occurrences: { blockId: string; line: number }[],
  blocks: Block[],
  labelNodes: LabelNode[],
): UsageLocationGroup[] {
  const groups = new Map<string, UsageLocationGroup>();

  // Build lookup maps once instead of re-scanning `blocks`/`labelNodes` per occurrence.
  const blocksById = new Map<string, Block>();
  for (const b of blocks) blocksById.set(b.id, b);

  const labelsByBlockId = new Map<string, LabelNode[]>();
  for (const n of labelNodes) {
    const list = labelsByBlockId.get(n.blockId);
    if (list) {
      list.push(n);
    } else {
      labelsByBlockId.set(n.blockId, [n]);
    }
  }
  for (const list of labelsByBlockId.values()) {
    list.sort((a, b) => a.startLine - b.startLine);
  }

  for (const occ of occurrences) {
    const block = blocksById.get(occ.blockId);
    if (!block) continue;

    const sortedLabelsInBlock = labelsByBlockId.get(occ.blockId) ?? [];
    const label = findLabelInSortedList(sortedLabelsInBlock, occ.line)?.label ?? null;
    const key = `${occ.blockId}:${label ?? ''}`;
    const filePath = block.filePath ?? occ.blockId;
    const fileName = filePath.split(/[/\\]/).pop() ?? filePath;

    const existing = groups.get(key);
    if (existing) {
      existing.count += 1;
      if (occ.line < existing.firstLine) existing.firstLine = occ.line;
    } else {
      groups.set(key, { blockId: occ.blockId, filePath, fileName, label, firstLine: occ.line, count: 1 });
    }
  }

  return Array.from(groups.values()).sort((a, b) => {
    const fileCompare = a.fileName.localeCompare(b.fileName);
    if (fileCompare !== 0) return fileCompare;
    const labelCompare = (a.label ?? '').localeCompare(b.label ?? '');
    if (labelCompare !== 0) return labelCompare;
    return a.firstLine - b.firstLine;
  });
}
