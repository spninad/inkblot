import assert from 'node:assert';
import { compileReport, renderReportToHtml, getTheme, academicTheme, modernTheme } from '../dist/index.js';

async function runTests() {
  console.log('🧪 Starting Inkblot API integration tests...\n');

  // Test 1: compileReport with frontmatter & TOC extraction
  console.log('Test 1: compileReport() frontmatter and TOC extraction');
  const sampleMdx = `---
title: "Autonomous Decision Making Under Uncertainty"
date: "2026-10-06"
abstract: "An empirical investigation into model rollouts."
theme: "academic"
---

<Section number="1" title="Introduction" id="sec-intro">

Planning with world models is effective.

<Subsection number="1.1" title="Background" id="sec-bg">

Latent representations compress state spaces.

</Subsection>

</Section>

<Section number="2" title="Methods" id="sec-methods">

We propose energy scoring.

</Section>
`;

  const compiled = await compileReport(sampleMdx);
  assert.strictEqual(compiled.frontmatter.title, 'Autonomous Decision Making Under Uncertainty');
  assert.strictEqual(compiled.frontmatter.date, '2026-10-06');
  assert.strictEqual(compiled.frontmatter.theme, 'academic');
  assert.ok(compiled.code.length > 0, 'Compiled code should not be empty');
  assert.strictEqual(compiled.toc.length, 3, 'TOC should have 3 entries');
  assert.strictEqual(compiled.toc[0].title, 'Introduction');
  assert.strictEqual(compiled.toc[0].number, '1');
  assert.strictEqual(compiled.toc[1].title, 'Background');
  assert.strictEqual(compiled.toc[1].number, '1.1');
  assert.strictEqual(compiled.toc[2].title, 'Methods');
  assert.strictEqual(compiled.toc[2].number, '2');
  console.log('  ✅ compileReport passed\n');

  // Test 2: renderReportToHtml standalone output
  console.log('Test 2: renderReportToHtml() standalone HTML');
  const res = await renderReportToHtml(sampleMdx, { standalone: true });
  assert.ok(res.html.includes('<!doctype html>'), 'Must include doctype');
  assert.ok(res.html.includes('<title>Autonomous Decision Making Under Uncertainty</title>'));
  assert.ok(res.html.includes('class="inkblot-page page"'));
  assert.ok(res.html.includes('class="inkblot-toc toc"'));
  assert.ok(res.html.includes('id="inkblot-tip"'));
  assert.ok(res.css.includes('--bg: #fcfcfb;'), 'Default academic theme should be included');
  console.log('  ✅ renderReportToHtml standalone passed\n');

  // Test 3: renderReportToHtml component-only output (standalone: false)
  console.log('Test 3: renderReportToHtml() component-only for Next.js SSR');
  const compRes = await renderReportToHtml(sampleMdx, { standalone: false });
  assert.ok(!compRes.html.includes('<!doctype html>'), 'Component HTML should not include doctype');
  assert.ok(compRes.html.includes('Autonomous Decision Making Under Uncertainty'));
  assert.ok(compRes.html.includes('sec-intro'));
  console.log('  ✅ renderReportToHtml component-only passed\n');

  // Test 4: Alternative Theme (Modern Sans)
  console.log('Test 4: Configurable Themes (modern)');
  const modernRes = await renderReportToHtml(sampleMdx, { theme: 'modern', standalone: true });
  assert.ok(modernRes.html.includes('data-theme="modern"'));
  assert.ok(modernRes.css.includes(`--bg: ${modernTheme.light.bg};`), 'Modern theme background should be used');
  console.log('  ✅ Modern theme passed\n');

  // Test 5: Scientific Primitives rendering (Tables, Question, Aside, Equations)
  console.log('Test 5: Scientific Primitives rendering');
  const richMdx = `---
title: "Rich Components"
---

<Question>
Does search concentration improve decision bounds?
</Question>

<Aside title="Key Insight">
Planning benefits are non-uniform across the trajectory.
</Aside>

<Table
  columns={[{ key: "name", label: "Model" }, { key: "score", label: "Score", numeric: true }]}
  data={[{ name: "JEPA-WM", score: "88.3%" }, { name: "AdaJEPA", score: "86.7%" }]}
/>

<Equation math="E = mc^2" />
`;

  const richRes = await renderReportToHtml(richMdx);
  assert.ok(richRes.html.includes('class="question"'));
  assert.ok(richRes.html.includes('Does search concentration improve decision bounds?'));
  assert.ok(richRes.html.includes('class="aside"'));
  assert.ok(richRes.html.includes('Key Insight'));
  assert.ok(richRes.html.includes('JEPA-WM'));
  assert.ok(richRes.html.includes('katex'));
  console.log('  ✅ Rich components rendering passed\n');

  console.log('🎉 All API integration tests completed successfully!');
}

runTests().catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
