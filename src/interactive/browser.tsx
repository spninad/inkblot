import React from 'react';
import { hydrateRoot } from 'react-dom/client';
import { controlRegistry } from './registry.js';
import { PortalContainerContext } from './context.js';
import { initializeScientificControls } from './science.js';

function start() {
  document.querySelectorAll<HTMLElement>('[data-inkblot-island]').forEach((node) => {
    if (node.dataset.inkblotHydrated) return;
    const Component = controlRegistry[node.dataset.inkblotIsland!];
    if (!Component) return;
    const scope = node.closest<HTMLElement>('[data-inkblot-root]') || document.documentElement;
    node.dataset.inkblotHydrated = 'true';
    hydrateRoot(
      node,
      <PortalContainerContext.Provider value={scope}>
        <Component {...JSON.parse(node.dataset.inkblotProps || '{}')} />
      </PortalContainerContext.Provider>,
      { identifierPrefix: node.dataset.inkblotId },
    );
  });
}
if (document.readyState === 'loading')
  document.addEventListener('DOMContentLoaded', start, { once: true });
else start();
initializeScientificControls();
