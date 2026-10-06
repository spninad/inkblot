import assert from 'node:assert';
import { compileReport, renderReportToHtml, registerTheme, type ThemeConfig } from '../dist/index.js';

async function runEdgeCases() {
  console.log('🧪 Starting Inkblot Edge Cases Test Suite...\n');

  // Edge Case 1: Standard markdown headings (## Heading) auto-numbered
  console.log('Edge Case 1: Standard markdown headings ## and ###');
  const markdownOnlyMdx = `
## Introduction
This is the intro.

### Background
Background details.

## Methods
Experimental setup.
`;
  const compiled = await compileReport(markdownOnlyMdx);
  assert.strictEqual(compiled.toc.length, 3);
  assert.strictEqual(compiled.toc[0].title, 'Introduction');
  assert.strictEqual(compiled.toc[0].number, '1');
  assert.strictEqual(compiled.toc[1].title, 'Background');
  assert.strictEqual(compiled.toc[1].number, undefined); // subsection
  assert.strictEqual(compiled.toc[2].title, 'Methods');
  assert.strictEqual(compiled.toc[2].number, '2');
  console.log('  ✅ Standard markdown headings auto-numbering passed\n');

  // Edge Case 2: Custom registered theme
  console.log('Edge Case 2: Custom registered theme');
  const customTheme: ThemeConfig = {
    name: 'forest',
    label: 'Forest Green',
    light: {
      bg: '#f4f7f4',
      surface: '#ffffff',
      ink: '#112211',
      ink2: '#334433',
      muted: '#667766',
      rule: '#dde2dd',
      ruleStrong: '#bbc2bb',
      accent: '#1e662e',
      accentSoft: '#eaf4eb',
      s0: '#778877',
      s1: '#1e662e',
      s2: '#cc6622',
      s3: '#2277aa',
      grid: '#eef2ee',
      axis: '#bbc2bb',
      band: 'rgba(30, 102, 46, 0.1)',
    },
    fonts: {
      serif: 'Georgia, serif',
      sans: 'system-ui, sans-serif',
      mono: 'monospace',
    },
  };
  registerTheme(customTheme);

  const res = await renderReportToHtml(markdownOnlyMdx, { theme: 'forest' });
  assert.ok(res.html.includes('data-theme="forest"'));
  assert.ok(res.css.includes('--bg: #f4f7f4;'));
  assert.ok(res.css.includes('--accent: #1e662e;'));
  console.log('  ✅ Custom registered theme passed\n');

  // Edge Case 3: Missing/null values in DotPlot
  console.log('Edge Case 3: Missing and null values in DotPlot');
  const dotPlotMdx = `
<DotPlot
  rows={["Task A", "Task B"]}
  x={{ min: 0, max: 100, ticks: [0, 50, 100] }}
  series={[
    { name: "Model 1", values: [50, null], missing: { 1: "excluded" } }
  ]}
/>
`;
  const plotRes = await renderReportToHtml(dotPlotMdx);
  assert.ok(plotRes.html.includes('excluded'), 'Missing value note should appear');
  console.log('  ✅ Missing/null values in DotPlot passed\n');

  console.log('🎉 All edge cases passed successfully!');
}

runEdgeCases().catch((err) => {
  console.error('❌ Edge case test failed:', err);
  process.exit(1);
});
