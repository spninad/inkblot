import { compileReport, renderReportToHtml } from '../src/index.js';
import { Sparkline } from '../src/components/charts/Sparkline.js';
import { Slopegraph } from '../src/components/charts/Slopegraph.js';
import { SmallMultiples } from '../src/components/charts/SmallMultiples.js';
import { Plot3D } from '../src/components/charts/Plot3D.js';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

console.log('🧪 Testing Tufte Visualizations and 3D Components...\n');

// 1. Sparkline Unit Test
const sparkHtml = renderToStaticMarkup(
  React.createElement(Sparkline, {
    data: [1.2, 0.9, 0.6, 0.45, 0.31, 0.18],
    width: 64,
    height: 16,
    highlightLast: true,
  })
);
if (!sparkHtml.includes('<polyline') || !sparkHtml.includes('inkblot-sparkline-wrap')) {
  throw new Error('Sparkline failed to render polyline SVG');
}
console.log('  ✅ Sparkline component test passed');

// 2. Slopegraph Unit Test
const slopeHtml = renderToStaticMarkup(
  React.createElement(Slopegraph, {
    title: 'Model Adaptation Benchmark',
    leftLabel: 'Zero-Shot',
    rightLabel: 'Test-Time Adapted',
    items: [
      { label: 'Diffusion Planner', leftVal: 0.54, rightVal: 0.91, highlight: true },
      { label: 'Autoregressive JEPA', leftVal: 0.42, rightVal: 0.73 },
    ],
  })
);
if (
  !slopeHtml.includes('Zero-Shot') ||
  !slopeHtml.includes('Test-Time Adapted') ||
  !slopeHtml.includes('Diffusion Planner')
) {
  throw new Error('Slopegraph failed to render headers or labels');
}
console.log('  ✅ Slopegraph component test passed');

// 3. SmallMultiples Unit Test
const smallMultHtml = renderToStaticMarkup(
  React.createElement(SmallMultiples, {
    title: 'Multi-Seed Rollout Convergence',
    panels: [
      { title: 'Seed 42', data: [1.0, 0.8, 0.5, 0.2] },
      { title: 'Seed 101', data: [1.1, 0.7, 0.4, 0.15], highlight: true },
    ],
  })
);
if (!smallMultHtml.includes('Seed 42') || !smallMultHtml.includes('Seed 101')) {
  throw new Error('SmallMultiples failed to render panels');
}
console.log('  ✅ SmallMultiples component test passed');

// 4. Plot3D Unit Test
const plot3DHtml = renderToStaticMarkup(
  React.createElement(Plot3D, {
    type: 'loss-surface',
    title: '3D Loss Surface',
    height: 400,
  })
);
if (!plot3DHtml.includes('data-plot3d="loss-surface"') || !plot3DHtml.includes('Auto-Rotate')) {
  throw new Error('Plot3D failed to render interactive canvas wrap or controls');
}
console.log('  ✅ Plot3D component test passed');

// 5. Full MDX Integration Test with All Visualizations
const mdxSource = `---
title: "Geometric Trajectory Planners"
date: "2026-10-09"
abstract: "Verification test of rich Tufte visualizations and 3D landscapes."
---

# Energy Landscapes

<Plot3D type="loss-surface" title="Trajectory Energy Landscape" />

Here is an inline sparkline: <Sparkline data={[1.2, 0.8, 0.4, 0.1]} /> in text.

<Slopegraph
  leftLabel="Pre-Trained"
  rightLabel="Fine-Tuned"
  items={[
    { label: "Ours", leftVal: 0.62, rightVal: 0.94, highlight: true },
    { label: "Baseline", leftVal: 0.55, rightVal: 0.71 }
  ]}
/>

<SmallMultiples
  title="Seed Invariance"
  panels={[
    { title: "Run 1", data: [0.9, 0.5, 0.2] },
    { title: "Run 2", data: [0.95, 0.45, 0.18] }
  ]}
/>
`;

async function runMdxTest() {
  const result = await renderReportToHtml(mdxSource);
  if (!result.html.includes('data-plot3d="loss-surface"')) {
    throw new Error('MDX render did not output Plot3D');
  }
  if (!result.html.includes('inkblot-sparkline-wrap')) {
    throw new Error('MDX render did not output Sparkline');
  }
  if (!result.html.includes('Pre-Trained')) {
    throw new Error('MDX render did not output Slopegraph');
  }
  if (!result.html.includes('Seed Invariance')) {
    throw new Error('MDX render did not output SmallMultiples');
  }
  if (!result.html.includes('init3DPlots') || !result.html.includes('three.min.js')) {
    throw new Error('Standalone HTML does not include Three.js runtime script');
  }
  console.log('  ✅ MDX integration with visualizations & 3D runtime passed');
}

await runMdxTest();
console.log('\n🎉 All visualization and 3D tests passed successfully!\n');
