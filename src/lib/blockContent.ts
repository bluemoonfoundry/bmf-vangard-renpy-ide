import type { BlockType } from '@/components/CreateBlockModal';

export function buildNewBlockContent(name: string, type: BlockType): string {
  switch (type) {
    case 'story':
      return `label ${name}:\n    "Start writing your story here..."\n    return\n`;
    case 'screen':
    case 'config':
      return '';
  }
  return '';
}
