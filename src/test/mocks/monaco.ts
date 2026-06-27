// Minimal Monaco stub for tests. jsdom cannot run the real Monaco editor.
const mockEditor = {
  getValue: () => '',
  setValue: () => {},
  onDidChangeModelContent: () => ({ dispose: () => {} }),
  getModel: () => null,
  dispose: () => {},
  layout: () => {},
};

const editor = {
  create: () => mockEditor,
  setTheme: () => {},
  defineTheme: () => {},
  createModel: () => ({}),
};

const languages = {
  register: () => {},
  setMonarchTokensProvider: () => {},
  registerCompletionItemProvider: () => ({ dispose: () => {} }),
  CompletionItemKind: {},
};

const KeyMod = { CtrlCmd: 2048, Shift: 1024, Alt: 512 };
const KeyCode = { KeyS: 49, KeyF: 33, KeyH: 39, Enter: 3, Escape: 9, Tab: 2 };

export {
  editor,
  languages,
  KeyMod,
  KeyCode,
};
