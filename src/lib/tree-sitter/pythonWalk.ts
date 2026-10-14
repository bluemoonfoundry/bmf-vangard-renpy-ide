/**
 * @file pythonWalk.ts
 * @description Walks one injected tree-sitter-python tree and records store
 * variable reads and writes plus top-level `def`/`class` definitions, for the
 * symbol index. Points are relative to the injected span; blockContribution.ts
 * maps them back to `.rpy` offsets.
 *
 * Scoping (deliberately simple — see the spec's Non-Goals):
 * - The top level of a `$` line, a `python:` body or an injected expression is
 *   store scope: assignments are writes, other names are reads.
 * - `def`, `lambda`, comprehensions and class bodies open a local scope.
 *   Parameters and names bound inside are locals and are not recorded; other
 *   names are store reads. Inside a `def`, a write is recorded only for names
 *   declared `global`.
 * - Imported names, ignored names (symbolNames.ts) and anything inside an
 *   ERROR node are never recorded.
 */
import type { Point, SyntaxNode } from 'web-tree-sitter';
import { isIgnoredName, normalizeVariableName } from '@/lib/tree-sitter/symbolNames';

export interface PythonUse { name: string; refKind: 'read' | 'write'; start: Point; end: Point }

export interface PythonDef {
  kind: 'python-function' | 'python-class';
  name: string;
  start: Point;
  end: Point;
  nameStart: Point;
  nameEnd: Point;
}

export interface PythonWalkResult { uses: PythonUse[]; defs: PythonDef[] }

interface Scope {
  locals: Set<string>;
  globals: Set<string>;
  isStore: boolean;
  parent: Scope | null;
}

const COMPREHENSIONS = new Set(['list_comprehension', 'set_comprehension', 'dictionary_comprehension', 'generator_expression']);
const SCOPE_BOUNDARIES = new Set(['function_definition', 'class_definition', 'lambda', ...COMPREHENSIONS]);
const TARGET_CONTAINERS = new Set([
  'pattern_list', 'tuple_pattern', 'list_pattern', 'tuple', 'list', 'parenthesized_expression',
  'list_splat_pattern', 'expression_list',
]);
const IMPORTS = new Set(['import_statement', 'import_from_statement', 'future_import_statement']);

/**
 * Python keywords are never names. They reach this walk as identifiers when
 * a screen-language line is split into one-word injections (grammar issue
 * nms4.14, e.g. `for i in items:` yields an injection for `in`).
 */
const PYTHON_KEYWORDS: ReadonlySet<string> = new Set([
  'in', 'not', 'and', 'or', 'is', 'if', 'else', 'elif', 'for', 'while', 'lambda', 'return', 'yield',
  'pass', 'del', 'global', 'nonlocal', 'import', 'from', 'as', 'with', 'try', 'except', 'finally',
  'raise', 'class', 'def', 'async', 'await', 'assert', 'break', 'continue',
]);

/** Identifier nodes bound by an assignment/for target (not attributes or subscripts). */
function boundIdentifiers(target: SyntaxNode): SyntaxNode[] {
  if (target.type === 'identifier') return [target];
  if (TARGET_CONTAINERS.has(target.type)) return target.namedChildren.flatMap(boundIdentifiers);
  return [];
}

/** Parameter names of a `parameters` or `lambda_parameters` node. */
function parameterNames(params: SyntaxNode): string[] {
  const names: string[] = [];
  for (const param of params.namedChildren) {
    if (param.type === 'identifier') {
      names.push(param.text);
    } else if (param.type === 'default_parameter' || param.type === 'typed_default_parameter') {
      const name = param.childForFieldName('name');
      if (name) names.push(name.text);
    } else {
      const first = param.namedChildren.find((c) => c.type === 'identifier');
      if (first) names.push(first.text);
    }
  }
  return names;
}

/** Names introduced by import statements anywhere in the tree. */
function importedNames(root: SyntaxNode): Set<string> {
  const names = new Set<string>();
  const visit = (node: SyntaxNode): void => {
    if (IMPORTS.has(node.type)) {
      for (const child of node.namedChildren) {
        if (child.type === 'aliased_import') {
          const alias = child.childForFieldName('alias');
          if (alias) names.add(alias.text);
        } else if (child.type === 'dotted_name' && node.childForFieldName('module_name')?.id !== child.id) {
          names.add(child.namedChildren[0]?.text ?? child.text);
        }
      }
      return;
    }
    node.namedChildren.forEach(visit);
  };
  visit(root);
  return names;
}

/** Collects the names a function/class/lambda/comprehension body binds locally, without entering nested scopes. */
function collectBindings(body: SyntaxNode, scope: Scope): void {
  const visit = (node: SyntaxNode): void => {
    switch (node.type) {
      case 'assignment':
      case 'augmented_assignment':
      case 'for_statement': {
        const left = node.childForFieldName('left');
        if (left) boundIdentifiers(left).forEach((id) => scope.locals.add(id.text));
        break;
      }
      case 'named_expression': {
        const name = node.childForFieldName('name');
        if (name) scope.locals.add(name.text);
        break;
      }
      case 'as_pattern_target':
        node.namedChildren.flatMap(boundIdentifiers).forEach((id) => scope.locals.add(id.text));
        break;
      case 'global_statement':
        node.namedChildren.filter((c) => c.type === 'identifier').forEach((id) => scope.globals.add(id.text));
        return;
      case 'function_definition':
      case 'class_definition': {
        const name = node.childForFieldName('name');
        if (name) scope.locals.add(name.text);
        return;
      }
      default:
        break;
    }
    if (SCOPE_BOUNDARIES.has(node.type)) return;
    node.namedChildren.forEach(visit);
  };
  body.namedChildren.forEach(visit);
}

export function walkPythonTree(root: SyntaxNode, options: { allowDefinitions: boolean }): PythonWalkResult {
  const result: PythonWalkResult = { uses: [], defs: [] };
  const storeScope: Scope = { locals: importedNames(root), globals: new Set(), isStore: true, parent: null };

  const isLocal = (name: string, scope: Scope): boolean => {
    for (let s: Scope | null = scope; s; s = s.parent) {
      if (s.isStore) return s.locals.has(name);
      if (s.globals.has(name)) return false;
      if (s.locals.has(name)) return true;
    }
    return false;
  };

  const push = (name: string, refKind: 'read' | 'write', first: SyntaxNode, last: SyntaxNode): void => {
    if (isIgnoredName(name) || PYTHON_KEYWORDS.has(name.split('.')[0])) return;
    result.uses.push({ name, refKind, start: first.startPosition, end: last.endPosition });
  };

  const readIdentifier = (id: SyntaxNode, scope: Scope): void => {
    if (!isLocal(id.text, scope)) push(id.text, 'read', id, id);
  };

  const writeIdentifier = (id: SyntaxNode, scope: Scope): void => {
    if (scope.isStore ? !scope.locals.has(id.text) : scope.globals.has(id.text)) push(id.text, 'write', id, id);
  };

  /** `a.b.c` — store./persistent. chains are their own variables; anything else reads its base. */
  const visitAttributeChain = (attribute: SyntaxNode, refKind: 'read' | 'write', scope: Scope): void => {
    const parts: SyntaxNode[] = [];
    let node: SyntaxNode = attribute;
    while (node.type === 'attribute') {
      const attr = node.childForFieldName('attribute');
      const object = node.childForFieldName('object');
      if (!attr || !object) return;
      parts.unshift(attr);
      node = object;
    }
    if (node.type !== 'identifier') {
      visit(node, scope); // e.g. f().x — visit the call
      return;
    }
    parts.unshift(node);
    const { name, consumed } = normalizeVariableName(parts.map((p) => p.text));
    if (consumed === 1) {
      readIdentifier(node, scope); // obj.attr (read or mutated) reads obj
      return;
    }
    push(name, refKind, parts[0], parts[consumed - 1]);
  };

  const visitTarget = (target: SyntaxNode, scope: Scope): void => {
    if (target.type === 'identifier') writeIdentifier(target, scope);
    else if (target.type === 'attribute') visitAttributeChain(target, 'write', scope);
    else if (TARGET_CONTAINERS.has(target.type)) target.namedChildren.forEach((c) => visitTarget(c, scope));
    else visit(target, scope); // subscript etc.: reads
  };

  const childScope = (parent: Scope): Scope => ({ locals: new Set(), globals: new Set(), isStore: false, parent });

  const pushDef = (kind: PythonDef['kind'], node: SyntaxNode, name: SyntaxNode): void => {
    result.defs.push({
      kind, name: name.text,
      start: node.startPosition, end: node.endPosition,
      nameStart: name.startPosition, nameEnd: name.endPosition,
    });
  };

  const visit = (node: SyntaxNode, scope: Scope): void => {
    switch (node.type) {
      case 'ERROR':
        return;
      case 'identifier':
        readIdentifier(node, scope);
        return;
      case 'attribute':
        visitAttributeChain(node, 'read', scope);
        return;
      case 'assignment':
      case 'augmented_assignment': {
        const right = node.childForFieldName('right');
        const type = node.childForFieldName('type');
        const left = node.childForFieldName('left');
        if (right) visit(right, scope);
        if (type) visit(type, scope);
        if (left) visitTarget(left, scope);
        return;
      }
      case 'for_statement': {
        const left = node.childForFieldName('left');
        if (left) visitTarget(left, scope);
        for (const child of node.namedChildren) if (child.id !== left?.id) visit(child, scope);
        return;
      }
      case 'named_expression': {
        const name = node.childForFieldName('name');
        const value = node.childForFieldName('value');
        if (value) visit(value, scope);
        if (name) visitTarget(name, scope);
        return;
      }
      case 'keyword_argument': {
        const value = node.childForFieldName('value');
        if (value) visit(value, scope);
        return;
      }
      case 'import_statement':
      case 'import_from_statement':
      case 'future_import_statement':
      case 'global_statement':
      case 'nonlocal_statement':
        return;
      case 'function_definition': {
        const name = node.childForFieldName('name');
        if (name && scope.isStore && options.allowDefinitions) pushDef('python-function', node, name);
        const fnScope = childScope(scope);
        const params = node.childForFieldName('parameters');
        if (params) {
          parameterNames(params).forEach((p) => fnScope.locals.add(p));
          // Default values are evaluated in the enclosing scope.
          for (const param of params.namedChildren) {
            const value = param.childForFieldName('value');
            if (value) visit(value, scope);
          }
        }
        const returnType = node.childForFieldName('return_type');
        if (returnType) visit(returnType, scope);
        const body = node.childForFieldName('body');
        if (body) {
          collectBindings(body, fnScope);
          visit(body, fnScope);
        }
        return;
      }
      case 'class_definition': {
        const name = node.childForFieldName('name');
        if (name && scope.isStore && options.allowDefinitions) pushDef('python-class', node, name);
        const superclasses = node.childForFieldName('superclasses');
        if (superclasses) visit(superclasses, scope);
        const body = node.childForFieldName('body');
        if (body) {
          const classScope = childScope(scope);
          collectBindings(body, classScope);
          visit(body, classScope);
        }
        return;
      }
      case 'lambda': {
        const lambdaScope = childScope(scope);
        const params = node.childForFieldName('parameters');
        if (params) parameterNames(params).forEach((p) => lambdaScope.locals.add(p));
        const body = node.childForFieldName('body');
        if (body) visit(body, lambdaScope);
        return;
      }
      default:
        break;
    }

    if (COMPREHENSIONS.has(node.type)) {
      const compScope = childScope(scope);
      for (const clause of node.namedChildren.filter((c) => c.type === 'for_in_clause')) {
        const left = clause.childForFieldName('left');
        if (left) boundIdentifiers(left).forEach((id) => compScope.locals.add(id.text));
      }
      for (const child of node.namedChildren) {
        if (child.type === 'for_in_clause') {
          const right = child.childForFieldName('right');
          if (right) visit(right, compScope);
        } else {
          visit(child, compScope);
        }
      }
      return;
    }

    for (const child of node.namedChildren) visit(child, scope);
  };

  visit(root, storeScope);
  return result;
}
