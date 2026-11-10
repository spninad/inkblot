import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { buildSite, serveSite } from '../dist/site/index.js';
import esbuild from 'esbuild';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { SSRHost } from './ssr-host.js';
import { getBuiltinThemes, renderReportToHtml, compileReport } from '../dist/index.js';

const outDir = fs.mkdtempSync(path.join(os.tmpdir(), 'inkblot-polish-'));
await buildSite({ cwd: path.resolve('examples/multi-page-site'), outDir, quiet: true });
const source = `---
title: "A measured approach to world models"
abstract: "A readable document needs a clear hierarchy, space to think, and controls that behave predictably."
---

## Evidence before conclusions

This preview exercises reading rhythm, mathematical notation, keyboard controls, and nested views. A model estimates $p(x)$ from observations. Readable prose remains the focus across every design language.

<Tabs>
  <Tab label="Overview"><p>Overview panel.</p><Tabs><Tab label="Inner A"><p>Inner A content.</p></Tab><Tab label="Inner B"><p>Inner B content.</p></Tab></Tabs></Tab>
  <Tab label="Measurements"><p>Measurements panel.</p></Tab>
</Tabs>

<Collapse title="Experimental details"><p>Disclosure content remains readable with the keyboard.</p></Collapse>

<Aside title="A useful distinction">Observed performance depends on the evaluation setting.</Aside>

<Plot3D type="latent-manifold" title="Latent geometry" />

| Setting | Score |
| --- | ---: |
| Reference | 0.84 |

## Next steps

Compare results across settings and report uncertainty.
`;
fs.mkdirSync(path.join(outDir, 'themes'));
for (const theme of getBuiltinThemes()) {
  fs.writeFileSync(
    path.join(outDir, 'themes', `${theme.name}.html`),
    (await renderReportToHtml(source, { theme: theme.name })).html,
  );
}
for (const [name, options] of Object.entries({
  picker: { theme: 'journal', themePicker: true },
  restricted: { theme: 'journal', themePicker: { themes: ['journal', 'paper'] } },
  fixed: { theme: 'cozy' },
  'no-js': { theme: 'paper', themePicker: true, clientScript: false },
})) {
  fs.writeFileSync(
    path.join(outDir, 'themes', `${name}.html`),
    (await renderReportToHtml(source, options)).html,
  );
}
fs.writeFileSync(
  path.join(outDir, 'standalone-report.html'),
  (
    await renderReportToHtml(
      fs.readFileSync(path.resolve('examples/geometric-diffusion-planners.mdx'), 'utf8'),
      { themePicker: true },
    )
  ).html,
);
const report = await compileReport(source);
await esbuild.build({
  entryPoints: ['tests/host-fixture.tsx'],
  outfile: path.join(outDir, 'host.js'),
  bundle: true,
  platform: 'browser',
  format: 'iife',
  define: { 'process.env.NODE_ENV': '\"production\"' },
});
fs.writeFileSync(
  path.join(outDir, 'host.html'),
  `<!doctype html><html><head><link rel="stylesheet" href="/assets/site.css"><style>body{margin:13px;background:lavender}#host-heading{font:700 31px Georgia;margin:17px;border:3px solid red}#host-paragraph{font:25px Georgia}#host-button{padding:11px;border:3px solid green}</style></head><body><div id="host-app"></div><script>window.inkblotFixture=${JSON.stringify(report).replace(/</g, '\\u003c')}</script><script src="/host.js"></script></body></html>`,
);
fs.writeFileSync(
  path.join(outDir, 'ssr-host.html'),
  `<!doctype html><html><head><link rel="stylesheet" href="/assets/site.css"></head><body><div id="host-app">${renderToString(React.createElement(SSRHost), { identifierPrefix: 'host-' })}</div><script>window.inkblotFixture={ssr:true}</script><script src="/host.js"></script></body></html>`,
);
fs.writeFileSync(
  path.join(outDir, 'custom-host.html'),
  '<!doctype html><html><head><link rel="stylesheet" href="/assets/site.css"></head><body><div id="host-app"></div><script>window.inkblotFixture={custom:true}</script><script src="/host.js"></script></body></html>',
);
const scopedConfig = path.join(outDir, 'scoped.json');
fs.writeFileSync(
  scopedConfig,
  JSON.stringify({
    title: 'Scoped research site',
    contentDir: path.resolve('examples/multi-page-site/content'),
    theme: 'journal',
    themePicker: { themes: ['journal', 'paper'] },
    basePath: '/restricted/',
  }),
);
await buildSite({
  cwd: path.resolve('examples/multi-page-site'),
  configPath: scopedConfig,
  outDir: path.join(outDir, 'restricted'),
  quiet: true,
});
process.on('exit', () => fs.rmSync(outDir, { recursive: true, force: true }));
serveSite({ outDir, port: Number(process.env.INKBLOT_PREVIEW_PORT || 4319) });
