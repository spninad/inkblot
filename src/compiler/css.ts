import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  getTheme,
  generateThemeCssVariables,
  getBuiltinThemeCss,
  getBuiltinThemes,
} from '../themes/index.js';
import type { ThemeConfig } from '../themes/types.js';

let cachedBaseCss: string | null = null;
let cachedKatexCss: string | null = null;
let cachedSiteCss: string | null = null;

function findInkblotPackageRoot(): string | null {
  try {
    let curr = path.dirname(fileURLToPath(import.meta.url));
    while (curr && curr !== path.dirname(curr)) {
      const pkgPath = path.join(curr, 'package.json');
      if (fs.existsSync(pkgPath)) {
        try {
          const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
          if (pkg.name === 'inkblot') return curr;
        } catch {}
      }
      curr = path.dirname(curr);
    }
  } catch {}
  return null;
}

export function resolvePackageFile(relativePath: string): string {
  const pkgRoot = findInkblotPackageRoot();
  if (pkgRoot) {
    const candidate = path.resolve(pkgRoot, relativePath);
    if (fs.existsSync(candidate)) return candidate;
  }

  // Try current directory / relative to file
  try {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const candidate = path.resolve(__dirname, relativePath);
    if (fs.existsSync(candidate)) return candidate;
  } catch {}

  // Try from workspace root
  const workspaceCandidate = path.resolve(process.cwd(), relativePath);
  if (fs.existsSync(workspaceCandidate)) return workspaceCandidate;

  return relativePath;
}

export function getBaseInkblotCss(): string {
  if (cachedBaseCss) return cachedBaseCss;

  const candidates = [
    resolvePackageFile('dist/base.css'),
    resolvePackageFile('src/themes/styles/inkblot.css'),
    resolvePackageFile('dist/style.css'),
    resolvePackageFile('../themes/styles/inkblot.css'),
  ];

  for (const c of candidates) {
    if (fs.existsSync(c)) {
      cachedBaseCss = fs.readFileSync(c, 'utf-8');
      // Strip @import "katex..."; because we inline katex explicitly
      cachedBaseCss = cachedBaseCss.replace(/@import\s+["'][^"']+katex[^"']*["'];?/g, '');
      return cachedBaseCss;
    }
  }

  return '';
}

export function getSiteCss(): string {
  if (cachedSiteCss) return cachedSiteCss;

  const candidates = [
    resolvePackageFile('dist/site.css'),
    resolvePackageFile('src/themes/styles/site.css'),
    resolvePackageFile('dist/site.css'),
    resolvePackageFile('../themes/styles/site.css'),
  ];

  for (const c of candidates) {
    if (fs.existsSync(c)) {
      cachedSiteCss = fs.readFileSync(c, 'utf-8');
      return cachedSiteCss;
    }
  }

  return '';
}

export function getKatexCss(): string {
  if (cachedKatexCss) return cachedKatexCss;

  const candidates = [
    resolvePackageFile('node_modules/katex/dist/katex.min.css'),
    path.resolve(process.cwd(), 'node_modules/katex/dist/katex.min.css'),
    resolvePackageFile('../../node_modules/katex/dist/katex.min.css'),
  ];

  for (const c of candidates) {
    if (fs.existsSync(c)) {
      let raw = fs.readFileSync(c, 'utf-8');
      // Rewrite relative font URLs to CDN so authentic KaTeX LaTeX serif math fonts load reliably
      // in standalone single HTML files, site subdirectories, and web apps.
      raw = raw.replace(
        /url\(fonts\//g,
        'url(https://cdn.jsdelivr.net/npm/katex@0.19.0/dist/fonts/',
      );

      // Ensure explicit serif fallbacks for math glyphs so math never renders in sans-serif
      const serifFallbacks = `
/* KaTeX LaTeX Serif Math Fallbacks */
.katex { font-family: KaTeX_Main, "Times New Roman", serif; }
.katex .mathnormal { font-family: KaTeX_Math, "Times New Roman", serif; font-style: italic; }
.katex .mathbf { font-family: KaTeX_Main, "Times New Roman", serif; font-weight: bold; }
.katex .mathit { font-family: KaTeX_Main, "Times New Roman", serif; font-style: italic; }
.katex .mathrm { font-family: KaTeX_Main, "Times New Roman", serif; font-style: normal; }
.katex .amsrm { font-family: KaTeX_AMS, "Times New Roman", serif; }
`;
      cachedKatexCss = `${raw}\n${serifFallbacks}`;
      return cachedKatexCss;
    }
  }

  return '';
}

export function getFullReportCss(
  themeInput?: string | ThemeConfig,
  additionalThemes: string[] = [],
): string {
  const theme = getTheme(themeInput);
  const themeVars = generateThemeCssVariables(theme);
  const baseCss = getBaseInkblotCss();
  const katexCss = getKatexCss();

  return [
    baseCss,
    getBuiltinThemeCss(),
    ...additionalThemes
      .filter((name) => getBuiltinThemes().find((t) => t.name === name) !== getTheme(name))
      .map((name) => generateThemeCssVariables(getTheme(name), false)),
    themeVars,
    katexCss,
  ]
    .filter(Boolean)
    .join('\n\n');
}

export function getBrowserScript(): string {
  return fs
    .readFileSync(resolvePackageFile('dist/interactive.js'), 'utf8')
    .replace(/<\/script/gi, '<\\/script');
}
