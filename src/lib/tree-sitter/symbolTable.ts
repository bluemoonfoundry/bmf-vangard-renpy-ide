/**
 * @file symbolTable.ts
 * @description Walks a `tree-sitter-renpy` parse tree (produced by
 * `parseBlock.ts`, Task 11) and extracts a flat, per-kind symbol table —
 * labels, characters, screens, variables, images, menus, transforms, and
 * styles — for consumption by later sub-projects (diagnostics, navigation,
 * etc.). Field/node names referenced here are verified against the current
 * `tree-sitter-renpy/grammar.js` and `tree-sitter-renpy/src/node-types.json`
 * (as of the end of Task 8's grammar-authoring work), not merely copied from
 * this task's planning draft.
 */
import type { Tree, SyntaxNode } from 'web-tree-sitter';

interface BaseSymbol {
  name: string;
  node: SyntaxNode;
  line: number;
  column: number;
  /** Enclosing label_statement's node id (stringified), or null if top-level. */
  scopeId: string | null;
}

export interface LabelSymbol extends BaseSymbol {
  kind: 'label';
  parameters: string[];
}

export interface CharacterSymbol extends BaseSymbol {
  kind: 'character';
  initialValueExpr: string;
}

export interface ScreenSymbol extends BaseSymbol {
  kind: 'screen';
  parameters: string[];
}

export interface VariableSymbol extends BaseSymbol {
  kind: 'variable';
  declarationType: 'define' | 'default' | 'implicit';
  initialValueExpr: string;
}

export interface ImageSymbol extends BaseSymbol {
  kind: 'image';
  initialValueExpr: string;
}

export interface MenuSymbol extends BaseSymbol {
  kind: 'menu';
  choiceTexts: string[];
}

export interface TransformSymbol extends BaseSymbol {
  kind: 'transform';
}

export interface StyleSymbol extends BaseSymbol {
  kind: 'style';
  parent: string | null;
}

export interface RenpySymbolTable {
  labels: LabelSymbol[];
  characters: CharacterSymbol[];
  screens: ScreenSymbol[];
  variables: VariableSymbol[];
  images: ImageSymbol[];
  menus: MenuSymbol[];
  transforms: TransformSymbol[];
  styles: StyleSymbol[];
}

/**
 * Walks up from `node` looking for an enclosing `label_statement`. Every
 * block-taking statement (label/if/while/for/menu/.../screen/transform/
 * style bodies) nests its body statements as descendants via `_block` or an
 * equivalent indented `repeat1`, so a plain parent-chain walk finds the
 * nearest enclosing label regardless of how many intervening block levels
 * (if/while/nested label-less blocks) sit in between.
 */
function enclosingLabelId(node: SyntaxNode): string | null {
  let current: SyntaxNode | null = node.parent;
  while (current) {
    if (current.type === 'label_statement') return current.id.toString();
    current = current.parent;
  }
  return null;
}

/**
 * The grammar's opaque `expression` token (`token(prec(-1, /[^\n#:]+/))`)
 * matches leading whitespace as part of its own regex rather than letting it
 * be consumed by `extras` first (verified empirically: a `value`-fielded
 * `expression` node's `.text` after `define x =` comes back as
 * `" Character(...)"`, with a leading space, not `"Character(...)"`) — so
 * every opaque-expression-typed field read in this module must be trimmed
 * before use, both for display/regex purposes and because an untrimmed
 * leading space breaks `DOLLAR_ASSIGNMENT_RE`'s `^[a-zA-Z_]` anchor outright.
 */
function exprText(node: SyntaxNode | null): string {
  return node?.text.trim() ?? '';
}

function base(node: SyntaxNode, name: string): BaseSymbol {
  return {
    name,
    node,
    line: node.startPosition.row + 1,
    column: node.startPosition.column,
    scopeId: enclosingLabelId(node),
  };
}

function walk(node: SyntaxNode, visit: (n: SyntaxNode) => void) {
  visit(node);
  for (let i = 0; i < node.childCount; i++) {
    const child = node.child(i);
    if (child) walk(child, visit);
  }
}

// Matches a `$`-statement's opaque expression text when it's a (possibly
// augmented) assignment — e.g. `points = 0`, `points += 1`,
// `persistent.seen_intro = True` — capturing the assigned name and the RHS
// expression text. `dollar_statement`'s `expression` field is the *entire*
// opaque text after `$` (grammar.js: `field('expression', $.expression)`),
// so this regex runs against the whole "points = 0" span, not a pre-split
// LHS/RHS pair.
const DOLLAR_ASSIGNMENT_RE = /^([a-zA-Z_][a-zA-Z0-9_.]*)\s*[+\-*/]?=(?!=)\s*(.+)$/;

// `define x = Character(...)` is modeled as a CharacterSymbol; every other
// `define`/`default` is a plain VariableSymbol. `value` is always a single
// `expression`-typed field per node-types.json regardless of whether the
// grammar internally built it from a plain expression or an
// alias($.string, $.expression)-wrapped string, so `.text` access is
// uniform here.
const CHARACTER_CALL_RE = /^Character\s*\(/;

export function extractSymbolTable(tree: Tree): RenpySymbolTable {
  const table: RenpySymbolTable = {
    labels: [],
    characters: [],
    screens: [],
    variables: [],
    images: [],
    menus: [],
    transforms: [],
    styles: [],
  };

  walk(tree.rootNode, (node) => {
    switch (node.type) {
      case 'label_statement': {
        const nameNode = node.childForFieldName('name');
        if (!nameNode) break;
        const parametersNode = node.childForFieldName('parameters');
        table.labels.push({
          ...base(node, nameNode.text),
          kind: 'label',
          parameters: parametersNode ? [parametersNode.text] : [],
        });
        break;
      }

      case 'define_statement':
      case 'default_statement': {
        const nameNode = node.childForFieldName('name');
        const valueNode = node.childForFieldName('value');
        if (!nameNode) break;
        const valueText = exprText(valueNode);
        if (node.type === 'define_statement' && CHARACTER_CALL_RE.test(valueText)) {
          table.characters.push({
            ...base(node, nameNode.text),
            kind: 'character',
            initialValueExpr: valueText,
          });
        } else {
          table.variables.push({
            ...base(node, nameNode.text),
            kind: 'variable',
            declarationType: node.type === 'define_statement' ? 'define' : 'default',
            initialValueExpr: valueText,
          });
        }
        break;
      }

      case 'dollar_statement': {
        const exprNode = node.childForFieldName('expression');
        if (!exprNode) break;
        const match = exprText(exprNode).match(DOLLAR_ASSIGNMENT_RE);
        if (!match) break;
        table.variables.push({
          ...base(node, match[1]),
          kind: 'variable',
          declarationType: 'implicit',
          initialValueExpr: match[2],
        });
        break;
      }

      case 'screen_statement': {
        const nameNode = node.childForFieldName('name');
        if (!nameNode) break;
        const parametersNode = node.childForFieldName('parameters');
        table.screens.push({
          ...base(node, nameNode.text),
          kind: 'screen',
          parameters: parametersNode ? [parametersNode.text] : [],
        });
        break;
      }

      case 'image_statement': {
        // `name` is a `multiple: true` field (node-types.json) — e.g.
        // `image eileen happy = "..."` has two `name`-fielded identifier
        // children — so `childForFieldName` (which returns only the first
        // match) is insufficient; `childrenForFieldName` returns all of them.
        const nameNodes = node.childrenForFieldName('name');
        const valueNode = node.childForFieldName('value');
        if (nameNodes.length === 0) break;
        table.images.push({
          ...base(node, nameNodes.map((n) => n.text).join(' ')),
          kind: 'image',
          initialValueExpr: exprText(valueNode),
        });
        break;
      }

      case 'menu_statement': {
        // `menu_choice` children are unfielded (node-types.json's
        // `menu_statement` has only an optional `label` field) — they're
        // just `repeat1($.menu_choice)` body children — so they're found by
        // filtering named children by type, not via a field lookup.
        const labelNode = node.childForFieldName('label');
        const choiceTexts = node.namedChildren
          .filter((c) => c.type === 'menu_choice')
          .map((c) => c.childForFieldName('text')?.text ?? '');
        table.menus.push({
          ...base(node, labelNode?.text ?? '<anonymous menu>'),
          kind: 'menu',
          choiceTexts,
        });
        break;
      }

      case 'transform_statement': {
        const nameNode = node.childForFieldName('name');
        if (!nameNode) break;
        table.transforms.push({ ...base(node, nameNode.text), kind: 'transform' });
        break;
      }

      case 'style_statement': {
        const nameNode = node.childForFieldName('name');
        const parentNode = node.childForFieldName('parent');
        if (!nameNode) break;
        table.styles.push({
          ...base(node, nameNode.text),
          kind: 'style',
          parent: parentNode?.text ?? null,
        });
        break;
      }

      default:
        break;
    }
  });

  return table;
}
