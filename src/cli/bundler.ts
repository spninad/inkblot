import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const archiver = require('archiver');
import { renderReportToHtml } from '../compiler/render.js';
import { INKBLOT_CLIENT_SCRIPT } from '../runtime/client.js';
import { INKBLOT_THREE_SCRIPT } from '../runtime/three-runtime.js';
import type { ThemeConfig } from '../themes/types.js';

export interface BundleOptions {
  inputPath: string;
  outputPath?: string;
  format?: 'standalone' | 'dir' | 'zip';
  theme?: string | ThemeConfig;
  zip?: boolean;
  embedFonts?: boolean;
}

export interface BundleResult {
  outputFiles: string[];
  format: 'standalone' | 'dir' | 'zip';
  zipPath?: string;
}

export async function bundleReport(options: BundleOptions): Promise<BundleResult> {
  const { inputPath } = options;

  if (!fs.existsSync(inputPath)) {
    throw new Error(`Input file not found: ${inputPath}`);
  }

  const rawMdx = fs.readFileSync(inputPath, 'utf-8');
  const baseName = path.basename(inputPath, path.extname(inputPath));

  // Determine output format
  let format = options.format;
  if (!format) {
    if (options.outputPath) {
      if (options.outputPath.endsWith('.zip')) {
        format = 'zip';
      } else if (options.outputPath.endsWith('.html')) {
        format = 'standalone';
      } else {
        format = 'dir';
      }
    } else {
      format = 'standalone';
    }
  }

  const outputFiles: string[] = [];
  let zipPath: string | undefined;

  // 1. Single Self-Contained HTML File
  if (format === 'standalone') {
    const targetHtml = options.outputPath || `${baseName}.html`;
    const targetDir = path.dirname(path.resolve(targetHtml));
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    const { html } = await renderReportToHtml(rawMdx, {
      theme: options.theme,
      standalone: true,
      embedFonts: options.embedFonts,
      clientScript: true,
    });

    fs.writeFileSync(targetHtml, html, 'utf-8');
    outputFiles.push(path.resolve(targetHtml));

    if (options.zip) {
      zipPath = targetHtml.replace(/\.html$/, '.zip');
      await createZipArchive([targetHtml], zipPath);
      outputFiles.push(path.resolve(zipPath));
    }

    return { outputFiles, format, zipPath };
  }

  // 2. Static Directory Output (ready for Vercel, S3, Netlify, Cloudflare)
  const targetDir = options.outputPath || path.resolve('dist', baseName);
  const assetsDir = path.join(targetDir, 'assets');

  fs.mkdirSync(assetsDir, { recursive: true });

  // Render HTML with external stylesheet and script references
  const { html: innerHtml, css, frontmatter } = await renderReportToHtml(rawMdx, {
    theme: options.theme,
    standalone: false,
  });

  const styleFile = path.join(assetsDir, 'style.css');
  const scriptFile = path.join(assetsDir, 'inkblot.js');
  const indexHtmlFile = path.join(targetDir, 'index.html');

  fs.writeFileSync(styleFile, css, 'utf-8');
  fs.writeFileSync(
    scriptFile,
    `${INKBLOT_CLIENT_SCRIPT}\n\n${INKBLOT_THREE_SCRIPT}`,
    'utf-8'
  );

  const themeName = (typeof options.theme === 'string' ? options.theme : frontmatter.theme) || 'academic';

  const fullDirHtml = `<!doctype html>
<html lang="en" data-theme="${themeName}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>${frontmatter.title || 'Scientific Report'}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Literata:ital,opsz,wght@0,7..72,400;0,7..72,600;1,7..72,400&display=swap">
  <link rel="stylesheet" href="./assets/style.css">
</head>
<body>
  <div id="inkblot-tip" class="inkblot-tip" hidden></div>
  ${innerHtml}
  <script src="./assets/inkblot.js"></script>
</body>
</html>`;

  fs.writeFileSync(indexHtmlFile, fullDirHtml, 'utf-8');

  outputFiles.push(indexHtmlFile, styleFile, scriptFile);

  // 3. ZIP Packaging if requested or if format is zip
  if (options.zip || format === 'zip') {
    zipPath = options.outputPath && options.outputPath.endsWith('.zip')
      ? options.outputPath
      : path.join(path.dirname(targetDir), `${path.basename(targetDir)}.zip`);

    await createZipFromDir(targetDir, zipPath);
    outputFiles.push(path.resolve(zipPath));
  }

  return { outputFiles, format, zipPath };
}

function getZipInstance(options: any = { zlib: { level: 9 } }) {
  if (typeof archiver === 'function') {
    return archiver('zip', options);
  }
  if (archiver.ZipArchive) {
    return new archiver.ZipArchive(options);
  }
  return new (archiver as any)(options);
}

function createZipArchive(files: string[], outZip: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(outZip);
    const archive = getZipInstance();

    output.on('close', () => resolve());
    archive.on('error', (err: any) => reject(err));

    archive.pipe(output);
    files.forEach((f) => archive.file(f, { name: path.basename(f) }));
    archive.finalize();
  });
}

function createZipFromDir(sourceDir: string, outZip: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(outZip);
    const archive = getZipInstance();

    output.on('close', () => resolve());
    archive.on('error', (err: any) => reject(err));

    archive.pipe(output);
    archive.directory(sourceDir, false);
    archive.finalize();
  });
}
