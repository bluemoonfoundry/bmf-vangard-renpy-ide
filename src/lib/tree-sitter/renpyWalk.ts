/**
 * @file renpyWalk.ts
 * @description Walks a tree-sitter-renpy tree in document order and extracts
 * the statement-level part of a block's symbol-index contribution:
 * definitions, references, menus and python blocks, plus label spans used to
 * find the enclosing label of Python injections. Python reads/writes inside
 * injected code are handled by pythonWalk.ts. Produces plain data only.
 */
import type { SyntaxNode } from 'web-tree-sitter';
import type {
  DefinitionKind, MenuInfo, PythonBlockInfo, ReferenceContext, ReferenceKind,
  SymbolDefinition, SymbolId, SymbolKind, SymbolReference,
} from '@/types';
import { rangeFromOffsets, rangeOfNode, type RangeContext } from '@/lib/tree-sitter/sourceRange';
import {
  isIgnoredName, normalizeDefinitionName, normalizeVariableName, qualifyLabel, symbolId,
} from '@/lib/tree-sitter/symbolNames';

export interface LabelSpan { id: SymbolId; start: number; end: number }

export interface RenpyWalkResult {
  definitions: SymbolDefinition[];
  references: SymbolReference[];
  menus: MenuInfo[];
  pythonBlocks: PythonBlockInfo[];
  labelSpans: LabelSpan[];
}

const CHARACTER_CALL_RE = /^Character\s*\(/;
/** `[name]`, `[name.attr]`, `[name!t]` — the name part only. */
const INTERPOLATION_RE = /\[([A-Za-z_][A-Za-z0-9_]*(?:\.[A-Za-z_][A-Za-z0-9_]*)*)/g;
const LEADING_NAME_RE = /^[A-Za-z_][A-Za-z0-9_]*/;
const NAME_RE = /[A-Za-z_][A-Za-z0-9_]*/g;

/**
 * Speakers Ren'Py defines itself (renpy/common): `extend` continues the
 * previous line, `narrator`/`centered` are built-in characters and `nvl` is
 * the NVL-mode narrator. Recording them would show up as unresolved.
 */
const BUILTIN_SPEAKERS: ReadonlySet<string> = new Set(['extend', 'narrator', 'centered', 'nvl']);

/** `show expression ...` and `show text "..."` (the Text displayable) name no image. */
const NON_IMAGE_SHOW_HEADS: ReadonlySet<string> = new Set(['expression', 'text']);

const SCREEN_REF_KIND: Record<string, ReferenceKind> = {
  show_screen_statement: 'show-screen',
  hide_screen_statement: 'hide-screen',
  call_screen_statement: 'call-screen',
};

const IMAGE_REF_KIND: Record<string, ReferenceKind> = {
  show_statement: 'show',
  scene_statement: 'scene',
  hide_statement: 'hide',
};

/**
 * A name node usable as a symbol name: present, not a parser-inserted
 * MISSING node and not empty (half-typed lines such as `label :`).
 */
function usable(node: SyntaxNode | null | undefined): node is SyntaxNode {
  return !!node && !node.isMissing && node.text.trim() !== '';
}

/** True when `node` has an anonymous keyword child, e.g. `jump expression x`. */
function hasKeyword(node: SyntaxNode, keyword: string): boolean {
  return node.children.some((child) => !child.isNamed && child.type === keyword);
}

function unquote(text: string): string {
  const quote = text[0];
  if (quote !== '"' && quote !== "'") return text;
  return text.length > 1 && text.endsWith(quote) ? text.slice(1, -1) : text.slice(1);
}

export function enclosingLabelFor(spans: LabelSpan[], offset: number): SymbolId | null {
  let best: LabelSpan | null = null;
  for (const span of spans) {
    if (span.start <= offset && offset < span.end && (!best || span.start > best.start)) best = span;
  }
  return best?.id ?? null;
}

export function walkRenpyTree(root: SyntaxNode, ctx: RangeContext): RenpyWalkResult {
  const out: RenpyWalkResult = { definitions: [], references: [], menus: [], pythonBlocks: [], labelSpans: [] };
  let currentGlobal: string | null = null;
  const labelStack: SymbolId[] = [];
  const enclosing = (): SymbolId | null => labelStack[labelStack.length - 1] ?? null;

  const define = (
    kind: SymbolKind, name: string, defKind: DefinitionKind, node: SyntaxNode,
    nameStart: number, nameEnd: number, detail?: string,
  ): void => {
    out.definitions.push({
      symbolId: symbolId(kind, name), kind, name, defKind,
      range: rangeOfNode(ctx, node),
      nameRange: rangeFromOffsets(ctx, nameStart, nameEnd),
      enclosingLabel: enclosing(),
      ...(detail !== undefined ? { detail } : {}),
    });
  };

  const reference = (
    kind: SymbolKind, name: string, refKind: ReferenceKind, start: number, end: number,
    context: ReferenceContext = 'statement', id: SymbolId | null = symbolId(kind, name),
  ): void => {
    out.references.push({
      symbolId: id, kind, name, refKind, context,
      range: rangeFromOffsets(ctx, start, end),
      enclosingLabel: enclosing(),
    });
  };

  const interpolations = (stringNode: SyntaxNode): void => {
    const text = stringNode.text;
    for (const match of text.matchAll(INTERPOLATION_RE)) {
      const index = match.index ?? 0;
      if (index > 0 && text[index - 1] === '[') continue; // `[[` is a literal bracket
      const { name } = normalizeVariableName(match[1].split('.'));
      if (isIgnoredName(name)) continue;
      const start = stringNode.startIndex + index + 1;
      reference('variable', name, 'read', start, start + match[1].length, 'interpolation');
    }
  };

  const visit = (node: SyntaxNode): void => {
    let pushedLabel = false;

    switch (node.type) {
      case 'label_statement': {
        const nameNode = node.childForFieldName('name');
        if (!usable(nameNode)) break;
        const written = nameNode.text;
        if (!written.includes('.')) currentGlobal = written;
        const name = qualifyLabel(written, currentGlobal);
        define('label', name, 'label', node, nameNode.startIndex, nameNode.endIndex, node.childForFieldName('parameters')?.text);
        const id = symbolId('label', name);
        out.labelSpans.push({ id, start: node.startIndex, end: node.endIndex });
        labelStack.push(id);
        pushedLabel = true;
        break;
      }

      case 'jump_statement':
      case 'call_statement': {
        const isCall = node.type === 'call_statement';
        const target = node.childForFieldName('target');
        if (usable(target)) {
          if (hasKeyword(node, 'expression')) {
            reference('label', target.text, isCall ? 'call-expression' : 'jump-expression',
              target.startIndex, target.endIndex, 'statement', null);
          } else {
            reference('label', qualifyLabel(target.text, currentGlobal), isCall ? 'call' : 'jump',
              target.startIndex, target.endIndex);
          }
        }
        const from = isCall ? node.childForFieldName('from_label') : null;
        if (usable(from)) define('label', qualifyLabel(from.text, currentGlobal), 'label', node, from.startIndex, from.endIndex);
        break;
      }

      case 'menu_statement': {
        const labelNode = node.childForFieldName('label');
        let labelId: SymbolId | null = null;
        if (usable(labelNode)) {
          define('label', labelNode.text, 'menu-label', node, labelNode.startIndex, labelNode.endIndex);
          labelId = symbolId('label', labelNode.text);
        }
        out.menus.push({
          range: rangeOfNode(ctx, node),
          labelId,
          enclosingLabel: enclosing(),
          choices: node.namedChildren
            .filter((child) => child.type === 'menu_choice')
            .map((choice) => {
              const text = choice.childForFieldName('text');
              // `condition` is a field on seq('if', expression), so the 'if' token carries it too.
              const condition = choice.childrenForFieldName('condition').find((c) => c.type === 'expression');
              return {
                text: text ? unquote(text.text) : '',
                condition: condition?.text ?? null,
                range: rangeOfNode(ctx, choice),
              };
            }),
        });
        break;
      }

      case 'menu_choice': {
        const text = node.childForFieldName('text');
        if (text) interpolations(text);
        break;
      }

      case 'screen_statement':
      case 'transform_statement':
      case 'style_statement': {
        const nameNode = node.childForFieldName('name');
        if (!usable(nameNode)) break;
        const kind: SymbolKind = node.type === 'screen_statement' ? 'screen'
          : node.type === 'transform_statement' ? 'transform' : 'style';
        const detail = kind === 'screen' ? node.childForFieldName('parameters')?.text
          : kind === 'style' ? node.childForFieldName('parent')?.text : undefined;
        define(kind, nameNode.text, kind, node, nameNode.startIndex, nameNode.endIndex, detail);
        break;
      }

      case 'image_statement': {
        const parts = node.childrenForFieldName('name').filter(usable);
        if (parts.length === 0) break;
        define('image', parts.map((p) => p.text).join(' '), 'image', node,
          parts[0].startIndex, parts[parts.length - 1].endIndex, node.childForFieldName('value')?.text);
        break;
      }

      case 'define_statement':
      case 'default_statement': {
        const nameNode = node.childForFieldName('name');
        if (!usable(nameNode)) break;
        const value = node.childForFieldName('value')?.text ?? '';
        const isDefine = node.type === 'define_statement';
        const kind: SymbolKind = isDefine && CHARACTER_CALL_RE.test(value) ? 'character' : 'variable';
        define(kind, normalizeDefinitionName(nameNode.text), isDefine ? 'define' : 'default', node,
          nameNode.startIndex, nameNode.endIndex, value);
        break;
      }

      case 'show_statement':
      case 'scene_statement':
      case 'hide_statement': {
        const parts = node.childrenForFieldName('image').filter(usable);
        if (parts.length === 0 || NON_IMAGE_SHOW_HEADS.has(parts[0].text)) break;
        reference('image', parts.map((p) => p.text).join(' '), IMAGE_REF_KIND[node.type],
          parts[0].startIndex, parts[parts.length - 1].endIndex);
        break;
      }

      case 'show_screen_statement':
      case 'hide_screen_statement':
      case 'call_screen_statement': {
        const nameNode = node.childForFieldName('name');
        if (usable(nameNode)) reference('screen', nameNode.text, SCREEN_REF_KIND[node.type], nameNode.startIndex, nameNode.endIndex);
        break;
      }

      case 'screen_language_statement': {
        if (node.childForFieldName('widget_tag')?.text !== 'use') break;
        const property = node.childrenForFieldName('properties')[0];
        const expression = property?.namedChildren.find((c) => c.type === 'expression');
        const match = expression?.text.match(LEADING_NAME_RE);
        if (expression && match) {
          reference('screen', match[0], 'use', expression.startIndex, expression.startIndex + match[0].length);
        }
        break;
      }

      case 'say_statement': {
        const who = node.childForFieldName('character');
        if (who?.type === 'identifier' && usable(who) && !BUILTIN_SPEAKERS.has(who.text)) reference('character', who.text, 'speaker', who.startIndex, who.endIndex);
        const text = node.childForFieldName('text');
        if (text) interpolations(text);
        break;
      }

      case 'for_statement': {
        const variable = node.childForFieldName('variable');
        if (!usable(variable)) break;
        for (const match of variable.text.matchAll(NAME_RE)) {
          if (isIgnoredName(match[0])) continue;
          const start = variable.startIndex + (match.index ?? 0);
          reference('variable', match[0], 'write', start, start + match[0].length);
        }
        break;
      }

      // Python bodies are walked by pythonWalk.ts via the injection. The
      // Ren'Py grammar parses their lines as Ren'Py statements, so visiting
      // the children would record Python locals, docstrings etc. (I1).
      case 'python_statement':
        out.pythonBlocks.push({ range: rangeOfNode(ctx, node), kind: 'python', priority: null });
        return;

      case 'init_python_statement': {
        const priority = node.childForFieldName('priority');
        out.pythonBlocks.push({
          range: rangeOfNode(ctx, node),
          kind: 'init-python',
          priority: priority ? Number(priority.text) : null,
        });
        return;
      }

      default:
        break;
    }

    for (const child of node.namedChildren) visit(child);
    if (pushedLabel) labelStack.pop();
  };

  visit(root);
  return out;
}
