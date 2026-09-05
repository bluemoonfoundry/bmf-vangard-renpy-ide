/**
 * @file index.tsx
 * @description Application entry point. Mounts the React App component to the DOM root element.
 * Initializes the React application with React.StrictMode for development error checking.
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import PopoutTabRoot from './PopoutTabRoot';
import ErrorBoundary from '@/components/ErrorBoundary';
import './index.css';

/**
 * Find the root DOM element where the React app will be mounted.
 * Throws an error if the element doesn't exist to fail fast.
 */
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

// A detached tab window loads this same bundle with `?mode=popout&tabId=...`
// (see createPopoutWindow() in electron.js) and mounts a minimal standalone
// root instead of the full App shell -- see src/PopoutTabRoot.tsx.
const params = new URLSearchParams(window.location.search);
const popoutTabId = params.get('mode') === 'popout' ? params.get('tabId') : null;

/**
 * Create React root and render the application.
 * Wrapped in StrictMode for development checks.
 */
const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      {popoutTabId ? <PopoutTabRoot tabId={popoutTabId} /> : <App />}
    </ErrorBoundary>
  </React.StrictMode>
);
