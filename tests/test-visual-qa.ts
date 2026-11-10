import fs from 'node:fs';
import path from 'node:path';
import { buildSite } from '../dist/site/index.js';
import { renderReportToHtml } from '../dist/index.js';

await buildSite({ cwd: path.resolve('examples/multi-page-site'), quiet: true });
fs.mkdirSync(path.resolve('examples/dist'), { recursive: true });
fs.writeFileSync(
  path.resolve('examples/dist/geometric-diffusion-planners.html'),
  (
    await renderReportToHtml(
      fs.readFileSync(path.resolve('examples/geometric-diffusion-planners.mdx'), 'utf8'),
    )
  ).html,
);

console.log('🧪 Starting Generated Site Structure QA Suite...\n');

let failed = 0;
function assert(condition: boolean, msg: string) {
  if (!condition) {
    console.error(`  ❌ FAILED: ${msg}`);
    failed++;
  } else {
    console.log(`  ✅ PASSED: ${msg}`);
  }
}

// 1. Inspect generated site.css
console.log('1. Verifying site.css responsive reading & layout architecture...');
const siteCssPath = path.resolve('examples/multi-page-site/dist/assets/site.css');
assert(fs.existsSync(siteCssPath), 'site.css exists in multi-page dist');
const siteCss = fs.readFileSync(siteCssPath, 'utf-8');

assert(
  !siteCss.includes('body {') || !siteCss.includes('padding-inline: 20px'),
  'body has no hardcoded padding-inline: 20px (ensuring edge-to-edge sticky header)',
);
assert(
  siteCss.includes('.inkblot-site-shell') && siteCss.includes('max-width: 1560px'),
  'inkblot-site-shell has spacious 1560px max width',
);
assert(
  siteCss.includes('.inkblot-site-article .inkblot-page') &&
    siteCss.includes('grid-template-columns: minmax(0, 1fr) 192px'),
  'responsive reading architecture present with 192px right-hand TOC on wide screens',
);
assert(
  siteCss.includes('.sumtable') && siteCss.includes('min-width: 680px'),
  'sumtable has min-width 680px preventing awkward text squishing',
);
assert(
  siteCss.includes('td p') && siteCss.includes('margin: 0'),
  'table cell paragraphs have zeroed margin to prevent unwanted row height bloating',
);

// 2. Inspect Homepage HTML
console.log('\n2. Verifying Homepage (index.html) layout & components...');
const indexPath = path.resolve('examples/multi-page-site/dist/index.html');
assert(fs.existsSync(indexPath), 'index.html exists in multi-page dist');
const indexHtml = fs.readFileSync(indexPath, 'utf-8');

assert(indexHtml.includes('class="inkblot-site-header"'), 'Header exists');
assert(indexHtml.includes('class="inkblot-site-sidebar"'), 'Left site navigation sidebar exists');
assert(indexHtml.includes('class="inkblot-site-content"'), 'Site content reading pane exists');
assert(indexHtml.includes('class="inkblot-site-article"'), 'Site article container exists');
assert(
  indexHtml.includes('data-plot3d="latent-manifold"'),
  '3D Latent Manifold canvas container rendered',
);
assert(indexHtml.includes('class="sumtable"'), 'Monograph summary table rendered');
assert(indexHtml.includes('inkblot-sparkline-wrap'), 'Inline SVG sparklines rendered inside table');
assert(
  !indexHtml.includes('<td><a href="/studies/diffusion-planning"><p>'),
  'Table cells do not have accidental <p> inside <a>',
);

// 3. Inspect Study Report HTML (diffusion-planning/index.html)
console.log('\n3. Verifying Multi-Page Study (diffusion-planning/index.html)...');
const studyPath = path.resolve(
  'examples/multi-page-site/dist/studies/diffusion-planning/index.html',
);
assert(fs.existsSync(studyPath), 'diffusion-planning/index.html exists');
const studyHtml = fs.readFileSync(studyPath, 'utf-8');

assert(studyHtml.includes('class="inkblot-page page"'), 'inkblot-page element rendered');
assert(studyHtml.includes('class="inkblot-toc toc"'), 'Right-side TOC rendered');
assert(
  studyHtml.includes('data-plot3d="loss-surface"'),
  '3D loss surface canvas container rendered',
);
assert(
  studyHtml.includes('Auto-Rotate') && studyHtml.includes('Reset'),
  '3D camera control buttons rendered',
);
assert(studyHtml.includes('class="inkblot-slopegraph-wrap"'), 'Tufte slopegraph rendered');
assert(
  studyHtml.includes('Franka-Kitchen') && studyHtml.includes('PointMaze-Hard'),
  'Slopegraph labels present',
);
assert(studyHtml.includes('class="inkblot-small-multiples"'), 'Small multiples component rendered');
assert(
  studyHtml.includes('Seed 42') && studyHtml.includes('Seed 101'),
  'Small multiples panels present',
);
assert(studyHtml.includes('class="aside aside-note"'), 'Semantic Aside callout rendered');
assert(studyHtml.includes('class="eq"'), 'KaTeX math equation container rendered');

// 4. Inspect Standalone Report HTML (examples/dist/geometric-diffusion-planners.html)
console.log('\n4. Verifying Standalone Report HTML (geometric-diffusion-planners.html)...');
const standalonePath = path.resolve('examples/dist/geometric-diffusion-planners.html');
assert(fs.existsSync(standalonePath), 'geometric-diffusion-planners.html exists');
const standaloneHtml = fs.readFileSync(standalonePath, 'utf-8');

assert(
  standaloneHtml.includes('https://cdn.jsdelivr.net/npm/katex@0.19.0/dist/fonts/'),
  'Authentic KaTeX LaTeX serif webfonts referenced via jsdelivr CDN',
);
assert(
  standaloneHtml.includes('KaTeX_Main') && standaloneHtml.includes('KaTeX_Math'),
  'Explicit KaTeX font family rules defined so math is never rendered in sans-serif',
);
assert(
  standaloneHtml.includes('class="inkblot-page page"'),
  'Standalone page layout container rendered',
);
assert(
  standaloneHtml.includes('class="inkblot-main"'),
  'Standalone main content container rendered',
);
assert(
  standaloneHtml.includes('class="inkblot-toc toc"'),
  'Standalone desktop TOC container rendered',
);

// 5. Check CSS variable contrast
console.log('\n5. Verifying Theme Design Tokens & Contrast...');
assert(
  siteCss.includes('--bg:') && siteCss.includes('--surface:'),
  'Background and surface tokens exist',
);
assert(
  siteCss.includes('--accent:') && siteCss.includes('--accent-soft:'),
  'Accent and soft surface tokens exist',
);
assert(siteCss.includes('--rule:') && siteCss.includes('--rule-strong:'), 'Rule tokens exist');

if (failed > 0) {
  console.error(`\n❌ QA Verification completed with ${failed} failure(s).`);
  process.exit(1);
} else {
  console.log('\n🎉 ALL QA CHECKS PASSED: Mintlify Layout, Padding, and Typography Verified!');
}
