import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/index.css'
import 'ark-alliance-react-ui/styles'

/**
 * Hide the initial HTML loader once React is ready to render.
 * This provides a smooth transition from static HTML to React.
 */
const hideInitialLoader = () => {
    const loader = document.getElementById('initial-loader');
    if (loader) {
        loader.classList.add('hidden');
        // Remove from DOM after transition
        setTimeout(() => loader.remove(), 300);
    }
};

// Create React root and render
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
);

// Hide initial loader after React mounts
// Use requestAnimationFrame to ensure first paint has occurred
requestAnimationFrame(() => {
    requestAnimationFrame(hideInitialLoader);
});
