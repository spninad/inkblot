import { INKBLOT_CLIENT_SCRIPT } from '../runtime/client.js';
import { INKBLOT_THREE_SCRIPT } from '../runtime/three-runtime.js';
export function initializeScientificControls(): void {
  if (document.querySelector('script[data-inkblot-science]')) {
    document.dispatchEvent(new Event('inkblot:content-ready'));
    return;
  }
  const script = document.createElement('script');
  script.dataset.inkblotScience = '';
  script.textContent = INKBLOT_CLIENT_SCRIPT + '\n' + INKBLOT_THREE_SCRIPT;
  document.body.appendChild(script);
}
