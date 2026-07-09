let attached = false;

/**
 * Click-to-zoom for screenshots embedded in guide/reference content.
 *
 * Uses a single delegated document click listener rather than per-image Vue
 * bindings so it keeps working across VitePress's client-side route changes
 * without needing to re-wire anything on navigation.
 */
export function setupImageLightbox(): void {
  if (attached) return;
  attached = true;

  let overlay: HTMLDivElement | null = null;
  let trigger: HTMLElement | null = null;

  function close(): void {
    if (!overlay) return;
    const el = overlay;
    overlay = null;
    el.classList.remove('is-open');
    document.documentElement.classList.remove('image-lightbox-active');
    window.removeEventListener('keydown', onKeydown);
    el.addEventListener('transitionend', () => el.remove(), { once: true });
    setTimeout(() => el.remove(), 300);
    trigger?.focus({ preventScroll: true });
    trigger = null;
  }

  function onKeydown(e: KeyboardEvent): void {
    if (e.key === 'Escape') close();
  }

  function open(img: HTMLImageElement): void {
    trigger = img;

    const backdrop = document.createElement('div');
    backdrop.className = 'image-lightbox-overlay';
    backdrop.setAttribute('role', 'dialog');
    backdrop.setAttribute('aria-modal', 'true');
    backdrop.setAttribute('aria-label', img.alt || 'Enlarged screenshot');

    const zoomed = document.createElement('img');
    zoomed.src = img.currentSrc || img.src;
    zoomed.alt = img.alt;
    zoomed.className = 'image-lightbox-image';

    const closeButton = document.createElement('button');
    closeButton.type = 'button';
    closeButton.className = 'image-lightbox-close';
    closeButton.setAttribute('aria-label', 'Close');
    closeButton.textContent = '×';

    // Clicks on the zoomed image itself bubble to the backdrop (nothing here
    // calls stopPropagation), so clicking the screenshot again closes it too.
    backdrop.addEventListener('click', close);
    closeButton.addEventListener('click', close);

    backdrop.appendChild(zoomed);
    backdrop.appendChild(closeButton);
    document.body.appendChild(backdrop);
    overlay = backdrop;

    document.documentElement.classList.add('image-lightbox-active');
    window.addEventListener('keydown', onKeydown);
    requestAnimationFrame(() => backdrop.classList.add('is-open'));
    closeButton.focus({ preventScroll: true });
  }

  document.addEventListener('click', (e) => {
    if (overlay) return; // overlay's own listener handles dismissal

    const target = e.target as HTMLElement;
    const img = target.closest('.vp-doc img') as HTMLImageElement | null;
    if (!img) return;
    if (img.closest('a')) return; // don't hijack deliberately linked images

    open(img);
  });
}
