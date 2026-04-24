#!/usr/bin/env node
/**
 * Script to migrate console.* calls to logger.*
 *
 * Usage: node scripts/migrate-console-to-logger.js
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, '..');

// Files to migrate
const filesToMigrate = [
  'electron.js',
  'contexts/SearchContext.tsx',
  'components/CodeActionButtons.tsx',
  'components/AudioManager.tsx',
  'components/EditorView.tsx',
  'components/SceneComposer.tsx',
  'components/NewProjectWizardModal.tsx',
  'components/CopyButton.tsx',
  'workers/renpyAnalysis.worker.ts',
  'hooks/useSnippetLoader.ts',
];

// Files to skip (legitimate console usage)
const filesToSkip = [
  'version.js',
  'docs/capture_screenshots.js',
  'lib/guiImageGenerator.js',
  'lib/templateProcessor.js',
];

async function migrateFile(filePath) {
  const fullPath = path.join(projectRoot, filePath);

  try {
    let content = await fs.readFile(fullPath, 'utf-8');
    const originalContent = content;

    // Check if logger is already imported
    const hasLoggerImport = content.includes("from './lib/logger") ||
                           content.includes("from '../lib/logger") ||
                           content.includes('require(\'./lib/logger') ||
                           content.includes('{logger');

    // For .js files (CommonJS), use require
    const isJS = filePath.endsWith('.js');
    const loggerImport = isJS
      ? "const { logger } = require('./lib/logger.js');\n"
      : "import { logger } from '../lib/logger';\n";

    // Calculate correct relative path for import
    const depth = filePath.split('/').length - 1;
    const relativePath = '../'.repeat(depth) + 'lib/logger';
    const correctImport = isJS
      ? `const { logger } = require('${relativePath}.js');\n`
      : `import { logger } from '${relativePath}';\n`;

    // Add logger import if not present
    if (!hasLoggerImport) {
      if (isJS) {
        // For JS files, add after first require/import block
        const firstImport = content.search(/^(import |const .* = require)/m);
        if (firstImport !== -1) {
          const endOfLine = content.indexOf('\n', firstImport);
          content = content.slice(0, endOfLine + 1) + correctImport + content.slice(endOfLine + 1);
        } else {
          // Add at top
          content = correctImport + content;
        }
      } else {
        // For TS/TSX, add after other imports
        const lastImport = content.search(/\nimport.*;\n(?!import)/);
        if (lastImport !== -1) {
          const insertPos = content.indexOf('\n', lastImport) + 1;
          content = content.slice(0, insertPos) + correctImport + content.slice(insertPos);
        } else {
          content = correctImport + content;
        }
      }
    }

    // Replace console.error with logger.error
    content = content.replace(/console\.error\((.*?):(.*?)\)/g, 'logger.error($1,$2)');
    content = content.replace(/console\.error\((.*?)\)/g, 'logger.error($1)');

    // Replace console.warn with logger.warn
    content = content.replace(/console\.warn\((.*?):(.*?)\)/g, 'logger.warn($1,$2)');
    content = content.replace(/console\.warn\((.*?)\)/g, 'logger.warn($1)');

    // Replace console.log with logger.info (but be careful with debug logs)
    content = content.replace(/console\.log\((.*?):(.*?)\)/g, 'logger.info($1,$2)');
    content = content.replace(/console\.log\((.*?)\)/g, 'logger.info($1)');

    // Write back if changed
    if (content !== originalContent) {
      await fs.writeFile(fullPath, content, 'utf-8');
      console.log(`✓ Migrated: ${filePath}`);
      return true;
    } else {
      console.log(`- Skipped (no changes): ${filePath}`);
      return false;
    }
  } catch (error) {
    console.error(`✗ Error migrating ${filePath}:`, error.message);
    return false;
  }
}

async function main() {
  console.log('Starting console-to-logger migration...\n');

  let migrated = 0;

  for (const file of filesToMigrate) {
    const wasMigrated = await migrateFile(file);
    if (wasMigrated) migrated++;
  }

  console.log(`\n✓ Migration complete: ${migrated} files updated`);
  console.log('\nPlease review the changes and run:');
  console.log('  npm test');
  console.log('  npm run build');
}

main().catch(console.error);
