import React from 'react';

/**
 * HUBIGR Global FontStyles & CSS Utilities Component
 * Centralizes Google Fonts imports, font-mono definitions,
 * global focus rings, dark scrollbars, and keyframe animations.
 */
export const FontStyles = () => (
  <style dangerouslySetInnerHTML={{__html: `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&display=swap');
    
    body {
      font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
      background-color: rgb(var(--color-surface-0));
      color: rgb(var(--color-text-primary));
      margin: 0;
      padding: 0;
      -webkit-font-smoothing: auto; /* Restores bolder subpixel-antialiasing for much better readability */
      -moz-osx-font-smoothing: auto;
      text-rendering: optimizeLegibility;
    }
    
    .font-mono { font-family: 'JetBrains Mono', monospace; }
    
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

    /* Custom Sleek Dark Scrollbar for HUBIGR Platform */
    ::-webkit-scrollbar { width: 5px; height: 5px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: rgb(var(--color-border-def)); border-radius: 4px; }
    ::-webkit-scrollbar-thumb:hover { background: rgb(var(--color-border-strong)); }

    :focus-visible {
      outline: none !important;
      box-shadow: 0 0 0 1px rgb(var(--color-accent)), var(--color-accent-glow) !important;
    }

    /* Keyframe Animations */
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(4px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fadeIn { animation: fadeIn 180ms cubic-bezier(0, 0, 0.2, 1) forwards; }

    

    @keyframes pulseSkeleton {
      0%, 100% { opacity: 0.3; }
      50% { opacity: 0.7; }
    }
    .animate-skeleton { animation: pulseSkeleton 1.5s ease-in-out infinite; }

    @keyframes modalSlideUp {
      from { opacity: 0; transform: translateY(16px) scale(0.95); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }
    .animate-modal { animation: modalSlideUp 200ms cubic-bezier(0, 0, 0.2, 1) forwards; }

    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-4px); }
      75% { transform: translateX(4px); }
    }
    .animate-shake { animation: shake 200ms ease-in-out; }

    /* Custom range slider styling */
    input[type=range] {
      -webkit-appearance: none;
      width: 100%;
      background: transparent;
    }
    input[type=range]:focus { outline: none; }
    input[type=range]::-webkit-slider-runnable-track {
      width: 100%;
      height: 6px;
      cursor: pointer;
      background: rgb(var(--color-surface-2));
      border: 1px solid rgb(var(--color-border-def));
      border-radius: 9999px;
    }
    input[type=range]::-webkit-slider-thumb {
      height: 18px;
      width: 18px;
      border-radius: 50%;
      background: rgb(var(--color-surface-1));
      border: 2px solid rgb(var(--color-accent));
      cursor: pointer;
      -webkit-appearance: none;
      margin-top: -6px;
      box-shadow: 0 0 10px var(--color-accent-glow);
      transition: transform 150ms ease, background-color 150ms ease;
    }
    input[type=range]::-webkit-slider-thumb:hover {
      background: rgb(var(--color-accent));
      transform: scale(1.2);
    }
    input[type=range]:disabled::-webkit-slider-thumb {
      background: rgb(var(--color-surface-disabled));
      border-color: rgb(var(--color-border-def));
      cursor: not-allowed;
      box-shadow: none;
    }

    /* Dark Card Component - unified container style for forms */
    .dark-card {
      background-color: rgb(var(--color-surface-1));
      border: 1px solid rgb(var(--color-border-def));
      border-radius: 12px;
      box-shadow: var(--shadow-elevation-raised);
    }
  `}} />
);

export default FontStyles;
