#!/usr/bin/env node
// Regression guard: each entry in website/doc-assertions.json pins a doc claim to a
// regex that must still match at least one of its listed src/ files. Fails CI when a
// pattern disappears (e.g. a rename/removal) without the assertion being updated too.
// Not a general truth-checker -- it only catches regressions of claims fixed once.

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');
const assertionsPath = path.join(repoRoot, 'website', 'doc-assertions.json');
const assertions = JSON.parse(fs.readFileSync(assertionsPath, 'utf8'));

let failures = 0;

for (const assertion of assertions) {
  const { id, claim, doc, pattern, files } = assertion;
  const regex = new RegExp(pattern);

  const matchedFile = files.find((relPath) => {
    const fullPath = path.join(repoRoot, relPath);
    if (!fs.existsSync(fullPath)) return false;
    const content = fs.readFileSync(fullPath, 'utf8');
    return regex.test(content);
  });

  if (!matchedFile) {
    failures++;
    console.error(`[doc-assertions] FAIL ${id}`);
    console.error(`  claim: ${claim}`);
    console.error(`  doc: ${doc}`);
    console.error(`  pattern /${pattern}/ not found in: ${files.join(', ')}`);
  }
}

if (failures > 0) {
  console.error(`\n${failures} of ${assertions.length} doc assertion(s) failed.`);
  console.error(`Update the corresponding page in website/ and/or website/doc-assertions.json if this is an intentional change.`);
  process.exit(1);
}

console.log(`[doc-assertions] All ${assertions.length} doc assertions passed.`);
