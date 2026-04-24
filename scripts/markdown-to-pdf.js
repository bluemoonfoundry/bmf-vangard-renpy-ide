#!/usr/bin/env node

/**
 * markdown-to-pdf.js
 * Converts USER_GUIDE.md to PDF using Puppeteer and marked
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import puppeteer from 'puppeteer';
import { marked } from 'marked';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const INPUT_FILE = path.join(__dirname, '../docs/USER_GUIDE.md');
const OUTPUT_FILE = path.join(__dirname, '../docs/USER_GUIDE.pdf');

// Custom CSS for PDF styling
const PDF_STYLES = `
  <style>
    @page {
      size: A4;
      margin: 20mm 15mm;
    }

    * {
      box-sizing: border-box;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      font-size: 11pt;
      line-height: 1.6;
      color: #24292e;
      max-width: 800px;
      margin: 0 auto;
      padding: 0;
    }

    h1 {
      font-size: 28pt;
      font-weight: 700;
      margin-top: 24pt;
      margin-bottom: 16pt;
      padding-bottom: 8pt;
      border-bottom: 2px solid #e1e4e8;
      page-break-after: avoid;
    }

    h2 {
      font-size: 20pt;
      font-weight: 600;
      margin-top: 24pt;
      margin-bottom: 12pt;
      padding-bottom: 6pt;
      border-bottom: 1px solid #e1e4e8;
      page-break-after: avoid;
    }

    h3 {
      font-size: 16pt;
      font-weight: 600;
      margin-top: 20pt;
      margin-bottom: 10pt;
      page-break-after: avoid;
    }

    h4 {
      font-size: 14pt;
      font-weight: 600;
      margin-top: 16pt;
      margin-bottom: 8pt;
      page-break-after: avoid;
    }

    h5, h6 {
      font-size: 12pt;
      font-weight: 600;
      margin-top: 12pt;
      margin-bottom: 6pt;
      page-break-after: avoid;
    }

    p {
      margin-top: 0;
      margin-bottom: 10pt;
      orphans: 3;
      widows: 3;
    }

    ul, ol {
      margin-top: 0;
      margin-bottom: 10pt;
      padding-left: 24pt;
    }

    li {
      margin-bottom: 4pt;
    }

    code {
      font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace;
      font-size: 9pt;
      background-color: #f6f8fa;
      padding: 2pt 4pt;
      border-radius: 3pt;
    }

    pre {
      font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace;
      font-size: 9pt;
      background-color: #f6f8fa;
      padding: 12pt;
      border-radius: 4pt;
      overflow-x: auto;
      margin-top: 0;
      margin-bottom: 12pt;
      page-break-inside: avoid;
    }

    pre code {
      background-color: transparent;
      padding: 0;
      font-size: inherit;
    }

    blockquote {
      margin: 0 0 12pt 0;
      padding: 0 12pt;
      border-left: 4pt solid #dfe2e5;
      color: #6a737d;
    }

    table {
      border-collapse: collapse;
      width: 100%;
      margin-bottom: 12pt;
      page-break-inside: avoid;
    }

    th, td {
      border: 1px solid #dfe2e5;
      padding: 6pt 10pt;
      text-align: left;
    }

    th {
      background-color: #f6f8fa;
      font-weight: 600;
    }

    hr {
      border: none;
      border-top: 1px solid #e1e4e8;
      margin: 16pt 0;
    }

    a {
      color: #0366d6;
      text-decoration: none;
    }

    a:hover {
      text-decoration: underline;
    }

    img {
      max-width: 100%;
      height: auto;
    }

    /* Table of contents styling */
    nav ul {
      list-style: none;
      padding-left: 0;
    }

    nav li {
      margin-bottom: 4pt;
    }

    /* Page break helpers */
    .page-break {
      page-break-before: always;
    }

    /* Print optimizations */
    @media print {
      body {
        color: #000;
      }

      a {
        color: #000;
      }

      h1, h2, h3, h4, h5, h6 {
        page-break-after: avoid;
      }

      pre, blockquote, table {
        page-break-inside: avoid;
      }
    }
  </style>
`;

async function convertMarkdownToPdf() {
  console.log('🚀 Starting PDF conversion...');

  // Check if input file exists
  if (!fs.existsSync(INPUT_FILE)) {
    console.error(`❌ Error: Input file not found: ${INPUT_FILE}`);
    process.exit(1);
  }

  try {
    // Read markdown file
    console.log(`📖 Reading ${path.basename(INPUT_FILE)}...`);
    const markdown = fs.readFileSync(INPUT_FILE, 'utf8');

    // Convert markdown to HTML
    console.log('🔄 Converting Markdown to HTML...');
    const html = marked(markdown);

    // Create full HTML document
    const fullHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Ren'IDE User Guide</title>
        ${PDF_STYLES}
      </head>
      <body>
        ${html}
      </body>
      </html>
    `;

    // Launch Puppeteer
    console.log('🌐 Launching browser...');
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();

    // Set content and wait for fonts/images to load
    console.log('📄 Rendering HTML...');
    await page.setContent(fullHtml, {
      waitUntil: 'networkidle0'
    });

    // Generate PDF
    console.log('📑 Generating PDF...');
    await page.pdf({
      path: OUTPUT_FILE,
      format: 'A4',
      margin: {
        top: '20mm',
        right: '15mm',
        bottom: '20mm',
        left: '15mm'
      },
      printBackground: true,
      preferCSSPageSize: true
    });

    await browser.close();

    // Get file size
    const stats = fs.statSync(OUTPUT_FILE);
    const fileSizeInKB = (stats.size / 1024).toFixed(2);

    console.log(`✅ PDF created successfully!`);
    console.log(`   Output: ${OUTPUT_FILE}`);
    console.log(`   Size: ${fileSizeInKB} KB`);

  } catch (error) {
    console.error('❌ Error during conversion:', error.message);
    process.exit(1);
  }
}

// Run the conversion
convertMarkdownToPdf();
