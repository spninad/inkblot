import React from 'react';
import { SSRHost } from './ssr-host.js';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { getTheme } from '../dist/themes/index.js';
import { ReportProvider, ReportViewer, Tabs } from '../dist/client.js';

declare global {
  interface Window {
    inkblotFixture: any;
  }
}
function Host() {
  const [show, setShow] = React.useState(true);
  return (
    <>
      <h1 id="host-heading">Host application heading</h1>
      <button id="host-button" onClick={() => setShow((v) => !v)}>
        Toggle report
      </button>
      <p id="host-paragraph">Host application paragraph</p>
      {show && (
        <ReportProvider theme="journal" themePicker={{ themes: ['journal', 'paper'] }}>
          <ReportViewer report={window.inkblotFixture} />
        </ReportProvider>
      )}
    </>
  );
}
function CustomHost() {
  const journal = getTheme('journal');
  const custom = {
    ...journal,
    light: { ...journal.light, bg: '#e8f0ff' },
    ui: { ...journal.ui, light: { ...journal.ui!.light, primary: '#123456' } },
  };
  const items = [{ label: 'Overview', content: <p>Custom report content.</p> }];
  return (
    <>
      <ReportProvider theme={custom}>
        <Tabs items={items} />
      </ReportProvider>
      <ReportProvider theme="journal">
        <Tabs items={items} />
      </ReportProvider>
    </>
  );
}
if (window.inkblotFixture.ssr)
  hydrateRoot(document.getElementById('host-app')!, <SSRHost />, { identifierPrefix: 'host-' });
else if (window.inkblotFixture.custom)
  createRoot(document.getElementById('host-app')!).render(<CustomHost />);
else createRoot(document.getElementById('host-app')!).render(<Host />);
