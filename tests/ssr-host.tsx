import React from 'react';
import { ReportProvider, Tabs } from '../dist/client.js';
export function SSRHost() {
  return (
    <ReportProvider theme="journal" themePicker={{ themes: ['journal', 'paper'] }}>
      <Tabs
        items={[
          { label: 'Server overview', content: <p>Server-rendered overview.</p> },
          { label: 'Server measurements', content: <p>Server-rendered measurements.</p> },
        ]}
      />
    </ReportProvider>
  );
}
