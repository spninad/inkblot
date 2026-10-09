import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

export interface ServeSiteOptions {
  outDir?: string;
  port?: number;
}

export function serveSite(options: ServeSiteOptions = {}): void {
  const outDir = path.resolve(process.cwd(), options.outDir || 'dist');
  const port = options.port || 3000;

  if (!fs.existsSync(outDir)) {
    console.error(`\n❌ Error: Output directory not found at ${outDir}. Run 'inkblot site build' first.`);
    process.exit(1);
  }

  const mimeMap: Record<string, string> = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.woff2': 'font/woff2',
  };

  const server = http.createServer((req, res) => {
    const url = new URL(req.url || '/', `http://localhost:${port}`);
    let pathname = decodeURIComponent(url.pathname);

    let filePath = path.join(outDir, pathname);

    // If directory, look for index.html
    if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    } else if (!fs.existsSync(filePath) && fs.existsSync(`${filePath}.html`)) {
      filePath = `${filePath}.html`;
    }

    if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/html' });
      res.end(`<h1>404 Not Found</h1><p>Cannot find ${pathname}</p>`);
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { 'Content-Type': mimeMap[ext] || 'application/octet-stream' });
    fs.createReadStream(filePath).pipe(res);
  });

  server.listen(port, () => {
    console.log(`\n✒️  Inkblot Production Site Server running at:`);
    console.log(`   👉 http://localhost:${port}/`);
    console.log(`   Serving ${path.relative(process.cwd(), outDir)}/\n`);
  });
}
