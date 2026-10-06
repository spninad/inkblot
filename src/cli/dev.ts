import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { renderReportToHtml } from '../compiler/render.js';

export interface CliDevOptions {
  port?: number;
  theme?: string;
}

export function runDev(inputFile: string, options: CliDevOptions = {}): void {
  const port = options.port || 3000;
  const inputPath = path.resolve(process.cwd(), inputFile);

  if (!fs.existsSync(inputPath)) {
    console.error(`\n❌ Error: File not found: ${inputFile}`);
    process.exit(1);
  }

  const sseClients: http.ServerResponse[] = [];

  const server = http.createServer(async (req, res) => {
    // SSE endpoint for live reload
    if (req.url === '/_inkblot_reload') {
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      });
      res.write('data: connected\n\n');
      sseClients.push(res);

      req.on('close', () => {
        const index = sseClients.indexOf(res);
        if (index !== -1) sseClients.splice(index, 1);
      });
      return;
    }

    if (req.url === '/' || req.url === '/index.html') {
      try {
        const rawMdx = fs.readFileSync(inputPath, 'utf-8');
        const { html } = await renderReportToHtml(rawMdx, {
          theme: options.theme,
          standalone: true,
          clientScript: true,
        });

        // Inject live-reload SSE script
        const reloadScript = `
<script>
  (function() {
    var es = new EventSource('/_inkblot_reload');
    es.onmessage = function(e) {
      if (e.data === 'reload') {
        console.log('⚡ File changed, reloading...');
        window.location.reload();
      }
    };
  })();
</script>
`;
        const liveHtml = html.replace('</body>', `${reloadScript}\n</body>`);

        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(liveHtml);
      } catch (err: any) {
        res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(`<h1>Compilation Error</h1><pre>${err.stack || err.message}</pre>`);
      }
      return;
    }

    res.writeHead(404);
    res.end('Not found');
  });

  // Watch input file
  let debounceTimer: NodeJS.Timeout | null = null;
  fs.watch(inputPath, () => {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      console.log(`\n🔄 ${path.basename(inputFile)} updated, notifying browser...`);
      sseClients.forEach((client) => {
        client.write('data: reload\n\n');
      });
    }, 100);
  });

  server.listen(port, () => {
    console.log(`\n✒️  Inkblot Dev Server running at:`);
    console.log(`   👉 http://localhost:${port}`);
    console.log(`   Watching ${path.basename(inputFile)} for changes...\n`);
  });
}
