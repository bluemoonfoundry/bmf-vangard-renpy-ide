import { defineConfig } from 'vitepress';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  title: 'Vangard Studio',
  description: "Documentation for Vangard Studio, the visual IDE for Ren'Py",
  base: '/bmf-vangard-renpy-ide/',
  cleanUrls: true,
  srcDir: '.',
  ignoreDeadLinks: false,

  vite: {
    // Serves docs/images/*.png (the existing Playwright screenshot output
    // directory) at the site root, e.g. /welcome-screen.png, without moving
    // or duplicating the screenshot files.
    publicDir: path.resolve(__dirname, '../../docs/images'),
  },

  themeConfig: {
    nav: [
      { text: 'Guide', link: '/guide/welcome' },
      { text: 'Reference', link: '/reference/' },
      { text: 'Architecture', link: '/architecture/SYSTEM_ARCHITECTURE' },
      { text: 'API', link: '/api/TYPES_REFERENCE' },
    ],

    sidebar: {
      '/guide/': [
        {
          text: 'Guide',
          items: [
            { text: '1. Welcome to Vangard Studio', link: '/guide/welcome' },
            { text: '2. Who This Is For', link: '/guide/who-this-is-for' },
            { text: '3. Getting Started', link: '/guide/getting-started' },
            { text: '4. The Interface at a Glance', link: '/guide/interface-at-a-glance' },
            { text: '5. Seeing Your Story — The Three Canvases', link: '/guide/three-canvases' },
            { text: '6. Writing Code', link: '/guide/writing-code' },
            { text: '7. Managing Story Elements', link: '/guide/managing-story-elements' },
            { text: '8. Working with Assets', link: '/guide/working-with-assets' },
            { text: '9. Visual Composers', link: '/guide/visual-composers' },
            { text: '10. Diagnostics and Quality', link: '/guide/diagnostics-and-quality' },
            { text: '11. Testing Your Game', link: '/guide/testing-your-game' },
            { text: '12. Translations', link: '/guide/translations' },
            { text: '13. Project Tools', link: '/guide/project-tools' },
            { text: '14. Customization', link: '/guide/customization' },
          ],
        },
      ],
      '/reference/': [
        {
          text: 'Reference',
          items: [
            { text: 'Overview (in progress)', link: '/reference/' },
            { text: '1. Toolbar Reference', link: '/reference/toolbar-reference' },
            { text: '2. Keyboard Shortcuts', link: '/reference/keyboard-shortcuts' },
            { text: '3. Canvas Reference', link: '/reference/canvas-reference' },
            { text: '4. Editor Reference', link: '/reference/editor-reference' },
            { text: '5. Story Elements Reference', link: '/reference/story-elements-reference' },
            { text: '6. Asset Manager Reference', link: '/reference/asset-manager-reference' },
            { text: '7. Composer Reference', link: '/reference/composer-reference' },
            { text: '8. Diagnostics Reference', link: '/reference/diagnostics-reference' },
            { text: '9. Settings Reference', link: '/reference/settings-reference' },
            { text: '10. File Formats', link: '/reference/file-formats' },
            { text: '11. Troubleshooting and FAQ', link: '/reference/troubleshooting-faq' },
            { text: '12. Glossary', link: '/reference/glossary' },
          ],
        },
      ],
      '/architecture/': [
        {
          text: 'Architecture',
          items: [
            { text: 'System Architecture', link: '/architecture/SYSTEM_ARCHITECTURE' },
            { text: 'Canvas Architecture', link: '/architecture/CANVAS_ARCHITECTURE' },
            { text: 'IPC Patterns', link: '/architecture/IPC_PATTERNS' },
            { text: 'Monaco Integration', link: '/architecture/MONACO_INTEGRATION' },
            { text: 'State Persistence', link: '/architecture/STATE_PERSISTENCE' },
            { text: 'Analysis Pipeline', link: '/architecture/ANALYSIS_PIPELINE' },
          ],
        },
      ],
      '/api/': [
        {
          text: 'API',
          items: [{ text: 'Types Reference', link: '/api/TYPES_REFERENCE' }],
        },
      ],
    },

    socialLinks: [{ icon: 'github', link: 'https://github.com/bluemoonfoundry/bmf-vangard-renpy-ide' }],

    search: { provider: 'local' },
  },
});
