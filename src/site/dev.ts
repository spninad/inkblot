import http from 'node:http';
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
import { getFullReportCss } from '../compiler/css.js';
import { INKBLOT_CLIENT_SCRIPT } from '../runtime/client.js';
import { INKBLOT_SITE_SCRIPT } from './runtime.js';

function getSiteCss(): string {
  try {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const candidate = path.resolve(__dirname, '../themes/styles/site.css');
    if (fs.existsSync(candidate)) return fs.readFileSync(candidate, 'utf-8');
  } catch {}

  const workspaceCandidate = path.resolve(process.cwd(), 'src/themes/styles/site.css');
  if (fs.existsSync(workspaceCandidate)) return fs.readFileSync(workspaceCandidate, 'utf-8');

  return '';
}

export interface DevSiteOptions {
  cwd?: string;
  configPath?: string;
  port?: number;
}

export async function devSite(options: DevSiteOptions = {}): Promise<void> {
  const cwd =
    options.cwd ||
    (options.configPath ? path.dirname(path.resolve(options.configPath)) : process.cwd());
  const port = options.port || 3000;
  const { config, configPath } = await loadSiteConfig(cwd, options.configPath);
  const contentDir = path.resolve(cwd, config.contentDir || 'content');

  const sseClients: http.ServerResponse[] = [];

  const theme = getTheme(config.theme || 'academic');
  const baseReportCss = getFullReportCss(theme);
  const siteCss = getSiteCss();
  const fullCss = `${baseReportCss}\n\n${siteCss}`;
  const combinedJs = `${INKBLOT_CLIENT_SCRIPT}\n\n${INKBLOT_SITE_SCRIPT}`;
  const fontTags = getFontHeadTags(theme.name);

  const server = http.createServer(async (req, res) => {
    const url = new URL(req.url || '/', `http://localhost:${port}`);
    let pathname = decodeURIComponent(url.pathname);

    // SSE live-reload endpoint
    if (pathname === '/_inkblot_reload') {
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      });
      res.write('data: connected\n\n');
      sseClients.push(res);
      req.on('close', () => {
        const idx = sseClients.indexOf(res);
        if (idx !== -1) sseClients.splice(idx, 1);
      });
      return;
    }

    // Static Assets: site.css, site.js, search-index.json
    if (pathname.endsWith('/assets/site.css') || pathname === '/assets/site.css') {
      res.writeHead(200, { 'Content-Type': 'text/css; charset=utf-8' });
      res.end(fullCss);
      return;
    }

    if (pathname.endsWith('/assets/site.js') || pathname === '/assets/site.js') {
      res.writeHead(200, { 'Content-Type': 'application/javascript; charset=utf-8' });
      res.end(combinedJs);
      return;
    }

    if (pathname === '/search-index.json' || pathname.endsWith('/search-index.json')) {
      const { searchIndex } = await discoverSitePages(cwd, config);
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify(searchIndex));
      return;
    }

    // Serve public files if exist
    const publicDir = path.resolve(cwd, config.publicDir || 'public');
    const potentialPublic = path.join(publicDir, pathname.replace(/^\//, ''));
    if (fs.existsSync(potentialPublic) && fs.statSync(potentialPublic).isFile()) {
      const ext = path.extname(potentialPublic).toLowerCase();
      const mimeMap: Record<string, string> = {
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.svg': 'image/svg+xml',
        '.css': 'text/css',
        '.js': 'application/javascript',
      };
      res.writeHead(200, { 'Content-Type': mimeMap[ext] || 'application/octet-stream' });
      fs.createReadStream(potentialPublic).pipe(res);
      return;
    }

    // Dynamic Route Rendering (SSR)
    try {
      const { pages, sidebar } = await discoverSitePages(cwd, config);

      // Normalize pathname
      let cleanRoute = pathname;
      if (cleanRoute.length > 1 && cleanRoute.endsWith('/')) {
        cleanRoute = cleanRoute.slice(0, -1);
      }

      const matchedPage = pages.find((p) => p.route === cleanRoute);

      if (!matchedPage) {
        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(`
          <!doctype html>
          <html>
          <head><title>Page Not Found</title></head>
          <body style="font-family:system-ui;padding:40px;line-height:1.6;">
            <h2>404 - Page Not Found</h2>
            <p>No page found for route <code>${cleanRoute}</code>.</p>
            <p><a href="/">← Return to Home</a></p>
          </body>
          </html>
        `);
        return;
      }

      // Compile MDX on the fly
      const { compileReport } = await import('../compiler/compile.js');
      const compiled = await compileReport(matchedPage.rawSource);
      const { default: MDXContent } = await run(compiled.code, runtime);

      const reportElement = React.createElement(
        Report,
        {
          title: matchedPage.frontmatter.title,
          date: matchedPage.frontmatter.date,
          abstract: matchedPage.frontmatter.abstract,
          toc: matchedPage.toc,
          theme: theme.name,
        },
        React.createElement(MDXContent, { components: defaultComponents })
      );

      const siteElement = React.createElement(
        SiteLayout,
        {
          config,
          page: matchedPage,
          sidebar,
          basePath: config.basePath || '/',
        },
        reportElement
      );

      const bodyHtml = renderToStaticMarkup(siteElement);

      const reloadScript = `
<script>
  (function() {
    var es = new EventSource('/_inkblot_reload');
    es.onmessage = function(e) {
      if (e.data === 'reload') {
        console.log('⚡ Site changed, reloading...');
        window.location.reload();
      }
    };
  })();
</script>
`;

      const pageHtml = `<!doctype html>
<html lang="en" data-theme="${theme.name}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>${matchedPage.frontmatter.title ? `${matchedPage.frontmatter.title} | ${config.title}` : config.title}</title>
  ${fontTags}
  <link rel="stylesheet" href="/assets/site.css">
</head>
<body>
  <div id="inkblot-tip" class="inkblot-tip" hidden></div>
  ${bodyHtml}
  <script src="/assets/site.js"></script>
  ${reloadScript}
</body>
</html>`;

      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(pageHtml);
    } catch (err: any) {
      res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(`<h1>SSR Error</h1><pre>${err.stack || err.message}</pre>`);
    }
  });

  // Watch content directory and config file
  let debounceTimer: NodeJS.Timeout | null = null;
  const triggerReload = () => {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      console.log(`🔄 Content updated, triggering live reload...`);
      sseClients.forEach((c) => c.write('data: reload\n\n'));
    }, 100);
  };

  if (fs.existsSync(contentDir)) {
    fs.watch(contentDir, { recursive: true }, triggerReload);
  }
  if (configPath && fs.existsSync(configPath)) {
    fs.watch(configPath, triggerReload);
  }

  server.listen(port, () => {
    console.log(`\n✒️  Inkblot Site Dev Server running at:`);
    console.log(`   👉 http://localhost:${port}/`);
    console.log(`   Watching ${path.relative(cwd, contentDir)}/ for changes...\n`);
  });
}
