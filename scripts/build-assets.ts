import fs from 'node:fs/promises';
import path from 'node:path';
import esbuild from 'esbuild';
import postcss from 'postcss';
import tailwind from '@tailwindcss/postcss';
import prefix from 'postcss-prefix-selector';
import { generateThemeCssVariables, getBuiltinThemeCss, getTheme } from '../src/themes/index';
import { gzipSync } from 'node:zlib';

const scope = prefix({
  prefix: '.inkblot-root',
  transform: (_prefix, selector, prefixed) => {
    if (selector === ':root' || selector === ':host') return '.inkblot-root';
    if (selector === 'html') return 'html.inkblot-root';
    if (selector === 'body') return '.inkblot-root, html.inkblot-root body';
    return prefixed;
  },
});
const read = (file: string) => fs.readFile(file, 'utf8');
const scoped = async (css: string, from: string) =>
  (await postcss([scope]).process(css, { from })).css;
export async function buildAssets() {
  const uiFile = path.resolve('src/styles/ui.css');
  const ui = await postcss([tailwind()]).process(await read(uiFile), { from: uiFile });
  const ast = postcss.parse(await scoped(ui.css, uiFile));
  ast.walkAtRules('layer', (rule) => {
    rule.params = rule.params.replace(
      /\b(theme|base|components|utilities|properties)\b/g,
      (name) => 'inkblot-' + name,
    );
  });
  const documentCss = (await read('src/themes/styles/inkblot.css')).replace(/@import[^;]+;/g, '');
  const layout = await scoped(documentCss, 'src/themes/styles/inkblot.css');
  const base =
    '@layer inkblot-theme, inkblot-document, inkblot-base, inkblot-components, inkblot-utilities, inkblot-overrides;\n' +
    `@layer inkblot-document {${layout}}\n` +
    ast.toString() +
    '\n' +
    (await read('src/styles/integration.css'));
  const themes = generateThemeCssVariables(getTheme()) + '\n' + getBuiltinThemeCss();
  await fs.writeFile('dist/base.css', base);
  await fs.writeFile(
    'dist/style.css',
    '@import "katex/dist/katex.min.css";\n' + base + '\n' + themes,
  );
  await fs.writeFile(
    'dist/site.css',
    `@layer inkblot-document {${await scoped(await read('src/themes/styles/site.css'), 'src/themes/styles/site.css')}}`,
  );
  await esbuild.build({
    entryPoints: ['src/interactive/browser.tsx'],
    outfile: 'dist/interactive.js',
    bundle: true,
    minify: true,
    platform: 'browser',
    format: 'iife',
    target: 'es2022',
    define: { 'process.env.NODE_ENV': '"production"' },
  });
  const browser = await fs.readFile('dist/interactive.js');
  console.log(`Inkblot browser bundle: ${browser.length} bytes (${gzipSync(browser).length} gzip)`);
  const client = await read('dist/client.js');
  await fs.writeFile('dist/client.js', '"use client";\n' + client);
}
