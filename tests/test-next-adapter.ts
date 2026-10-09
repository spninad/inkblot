import assert from 'node:assert';
import path from 'node:path';
import { renderToStaticMarkup } from 'react-dom/server';
import { createNextInkblotSite } from '../dist/next/index.js';
import { loadSiteConfig } from '../dist/site/index.js';

async function testNextAdapter() {
  console.log('🧪 Testing Next.js Adapter (inkblot/next)...\n');

  const siteDir = path.resolve('examples/multi-page-site');
  const { config } = await loadSiteConfig(siteDir);

  const nextSite = createNextInkblotSite({
    config,
    cwd: siteDir,
  });

  // 1. generateStaticParams
  console.log('Test 1: site.generateStaticParams()');
  const params = await nextSite.generateStaticParams();
  assert.ok(params.length >= 3, 'Should generate static params for all pages');
  assert.deepStrictEqual(params[0], { slug: [] }); // Home /
  assert.ok(params.some((p) => p.slug.join('/') === 'studies/study-1'));
  console.log('  ✅ generateStaticParams passed\n');

  // 2. generateMetadata
  console.log('Test 2: site.generateMetadata()');
  const meta = await nextSite.generateMetadata({
    params: { slug: ['studies', 'study-1'] },
  });
  assert.ok(meta.title?.includes('Study 1'), 'Title should include page title');
  console.log('  ✅ generateMetadata passed\n');

  // 3. renderPage (App Router component)
  console.log('Test 3: site.renderPage() for valid page');
  const pageElement = await nextSite.renderPage(['studies', 'study-1']);
  const html = renderToStaticMarkup(pageElement);
  assert.ok(html.includes('Study 1: Planning-Aware Test-Time Adaptation'));
  assert.ok(html.includes('class="inkblot-site-header"'));
  assert.ok(html.includes('class="inkblot-breadcrumbs"'));
  console.log('  ✅ renderPage passed\n');

  // 4. renderPage 404 fallback
  console.log('Test 4: site.renderPage() 404 fallback');
  const notFoundElement = await nextSite.renderPage(['non-existent']);
  const notFoundHtml = renderToStaticMarkup(notFoundElement);
  assert.ok(notFoundHtml.includes('404 - Report Not Found'));
  console.log('  ✅ 404 fallback passed\n');

  console.log('🎉 All Next.js adapter tests passed successfully!');
}

testNextAdapter().catch((err) => {
  console.error('❌ Next adapter test failed:', err);
  process.exit(1);
});
