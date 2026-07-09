import DefaultTheme from 'vitepress/theme';
import type { Theme } from 'vitepress';
import { setupImageLightbox } from './imageLightbox';
import './custom.css';

export default {
  extends: DefaultTheme,
  enhanceApp() {
    if (typeof window !== 'undefined') {
      setupImageLightbox();
    }
  },
} satisfies Theme;
