import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { run } from '@mdx-js/mdx';
import * as runtime from 'react/jsx-runtime';
import { loadSiteConfig } from './config.js';
import { discoverSitePages } from './content.js';
import { SiteLayout } from './layout/SiteLayout.js';
import { Report } from '../components/layout/Report.js';
import { defaultComponents } from '../components/index.js';
import { getTheme, getFontHeadTags } from '../themes/index.js';
import { getFullReportCss, getSiteCss } from '../compiler/css.js';
import { INKBLOT_CLIENT_SCRIPT } from '../runtime/client.js';
import { INKBLOT_THREE_SCRIPT } from '../runtime/three-runtime.js';
import { INKBLOT_SITE_SCRIPT } from './runtime.js';
import type { SiteConfig, SitePage, SidebarSection } from './types.js';

function copyDirRecursive(src: string, dest: string) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

export interface BuildSiteOptions {
  cwd?: string;
  configPath?: string;
  outDir?: string;
  quiet?: boolean;
}

export interface BuildSiteResult {
  pagesCount: number;
  outDir: string;
  routes: string[];
}

export async function buildSite(options: BuildSiteOptions = {}): Promise<BuildSiteResult> {
  const cwd =
    options.cwd ||
    (options.configPath ? path.dirname(path.resolve(options.configPath)) : process.cwd());
  const { config } = await loadSiteConfig(cwd, options.configPath);
  const outDir = options.outDir
    ? path.resolve(process.cwd(), options.outDir)
    : path.resolve(cwd, config.outDir || 'dist');

  if (!options.quiet) {
    console.log(`\n🏗️  Inkblot: Building site "${config.title}"...`);
  }
  const startTime = Date.now();

  const { pages, sidebar, searchIndex } = await discoverSitePages(cwd, config);
  if (pages.length === 0) {
    console.warn(`⚠️ Warning: No MDX pages found in ${config.contentDir || 'content'}/`);
  }

  // Ensure directories exist
  const assetsDir = path.join(outDir, 'assets');
  fs.mkdirSync(assetsDir, { recursive: true });

  // 1. Copy public assets if publicDir exists
  const publicDir = path.resolve(cwd, config.publicDir || 'public');
  if (fs.existsSync(publicDir)) {
    copyDirRecursive(publicDir, outDir);
  }

  // 2. Generate Combined Stylesheet
  const theme = getTheme(config.theme || 'academic');
  const baseReportCss = getFullReportCss(theme);
  const siteCss = getSiteCss();
  const fullCss = `${baseReportCss}\n\n${siteCss}`;

  fs.writeFileSync(path.join(assetsDir, 'site.css'), fullCss, 'utf-8');

  // 3. Generate Client Scripts
  const combinedJs = `${INKBLOT_CLIENT_SCRIPT}\n\n${INKBLOT_SITE_SCRIPT}\n\n${INKBLOT_THREE_SCRIPT}`;
  fs.writeFileSync(path.join(assetsDir, 'site.js'), combinedJs, 'utf-8');

  // 4. Generate Search Index JSON
  fs.writeFileSync(
    path.join(outDir, 'search-index.json'),
    JSON.stringify(searchIndex, null, 2),
    'utf-8'
  );

  const fontTags = getFontHeadTags(theme.name);

  // 5. Render Each Page
  for (const page of pages) {
    let targetFile: string;
    let relDepth = 0;

    if (page.route === '/') {
      targetFile = path.join(outDir, 'index.html');
      relDepth = 0;
    } else {
      const routeSub = page.slug;
      targetFile = path.join(outDir, routeSub, 'index.html');
      relDepth = routeSub.split('/').length;
    }

    fs.mkdirSync(path.dirname(targetFile), { recursive: true });

    const assetPrefix = relDepth === 0 ? './' : '../'.repeat(relDepth);

    // Compile and run MDX for this page
    const { compileReport } = await import('../compiler/compile.js');
    const compiled = await compileReport(page.rawSource);
    const { default: MDXContent } = await run(compiled.code, runtime);

    const reportElement = React.createElement(
      Report,
      {
        title: page.frontmatter.title,
        date: page.frontmatter.date,
        abstract: page.frontmatter.abstract,
        toc: page.toc,
        theme: theme.name,
      },
      React.createElement(MDXContent, { components: defaultComponents })
    );

    const siteElement = React.createElement(
      SiteLayout,
      {
        config,
        page,
        sidebar,
        basePath: config.basePath || '/',
      },
      reportElement
    );

    const bodyHtml = renderToStaticMarkup(siteElement);

    const pageHtml = `<!doctype html>
<html lang="en" data-theme="${theme.name}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>${page.frontmatter.title ? `${page.frontmatter.title} | ${config.title}` : config.title}</title>
  ${fontTags}
  <link rel="stylesheet" href="${assetPrefix}assets/site.css">
</head>
<body>
  <div id="inkblot-tip" class="inkblot-tip" hidden></div>
  ${bodyHtml}
  <script src="${assetPrefix}assets/site.js"></script>
</body>
</html>`;

    fs.writeFileSync(targetFile, pageHtml, 'utf-8');
  }

  const elapsed = Date.now() - startTime;
  if (!options.quiet) {
    console.log(`✨ Successfully generated ${pages.length} pages in ${elapsed}ms:`);
    pages.forEach((p) => {
      console.log(`   📄 ${p.route} (${path.relative(cwd, p.filePath)})`);
    });
    console.log(`   📦 Output folder: ${path.relative(cwd, outDir)}/\n`);
  }

  return {
    pagesCount: pages.length,
    outDir,
    routes: pages.map((p) => p.route),
  };
}
