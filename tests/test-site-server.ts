import assert from 'node:assert';
import path from 'node:path';
import http from 'node:http';
import { devSite } from '../dist/site/index.js';

async function testSiteDevServer() {
  console.log('🧪 Testing Site Dev / SSR Server...\n');

  const siteDir = path.resolve('examples/multi-page-site');
  const port = 3456;

  // Start dev server in background
  await devSite({
    cwd: siteDir,
    port,
  });

  // Give server 100ms to bind
  await new Promise((r) => setTimeout(r, 150));

  function get(pathStr: string): Promise<{ status: number; text: string; headers: http.IncomingHttpHeaders }> {
    return new Promise((resolve, reject) => {
      http.get(`http://localhost:${port}${pathStr}`, (res) => {
        let text = '';
        res.on('data', (c) => (text += c));
        res.on('end', () => resolve({ status: res.statusCode || 0, text, headers: res.headers }));
      }).on('error', reject);
    });
  }

  // 1. Root route
  console.log('Test 1: GET /');
  const rootRes = await get('/');
  assert.strictEqual(rootRes.status, 200);
  assert.ok(rootRes.text.includes('Research Monograph Series'));
  assert.ok(rootRes.text.includes('class="inkblot-site-header"'));
  console.log('  ✅ GET / passed\n');

  // 2. Sub-page route
  console.log('Test 2: GET /studies/study-1');
  const studyRes = await get('/studies/study-1');
  assert.strictEqual(studyRes.status, 200);
  assert.ok(studyRes.text.includes('Study 1: Planning-Aware Test-Time Adaptation'));
  assert.ok(studyRes.text.includes('class="inkblot-breadcrumbs"'));
  console.log('  ✅ GET /studies/study-1 passed\n');

  // 3. Asset route: site.css
  console.log('Test 3: GET /assets/site.css');
  const cssRes = await get('/assets/site.css');
  assert.strictEqual(cssRes.status, 200);
  assert.strictEqual(cssRes.headers['content-type'], 'text/css; charset=utf-8');
  assert.ok(cssRes.text.includes('.inkblot-site-header'));
  console.log('  ✅ GET /assets/site.css passed\n');

  // 4. Search index route
  console.log('Test 4: GET /search-index.json');
  const searchRes = await get('/search-index.json');
  assert.strictEqual(searchRes.status, 200);
  const json = JSON.parse(searchRes.text);
  assert.ok(Array.isArray(json));
  assert.ok(json.length >= 3);
  console.log('  ✅ GET /search-index.json passed\n');

  console.log('🎉 All site dev / SSR server tests passed successfully!');
  process.exit(0);
}

testSiteDevServer().catch((err) => {
  console.error('❌ Site dev server test failed:', err);
  process.exit(1);
});
