import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { getTheme, generateThemeCssVariables } from '../themes/index.js';
import type { ThemeConfig } from '../themes/types.js';

let cachedBaseCss: string | null = null;
let cachedKatexCss: string | null = null;

function resolvePackageFile(relativePath: string): string {
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
    resolvePackageFile('../themes/styles/inkblot.css'),
    resolvePackageFile('dist/style.css'),
    resolvePackageFile('src/themes/styles/inkblot.css'),
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

export function getKatexCss(): string {
  if (cachedKatexCss) return cachedKatexCss;

  const candidates = [
    path.resolve(process.cwd(), 'node_modules/katex/dist/katex.min.css'),
    resolvePackageFile('../../node_modules/katex/dist/katex.min.css'),
  ];

  for (const c of candidates) {
    if (fs.existsSync(c)) {
      let raw = fs.readFileSync(c, 'utf-8');
      // Rewrite relative font URLs to CDN so authentic KaTeX LaTeX serif math fonts load reliably
      // in standalone single HTML files, site subdirectories, and web apps.
      raw = raw.replace(/url\(fonts\//g, 'url(https://cdn.jsdelivr.net/npm/katex@0.19.0/dist/fonts/');

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

export function getFullReportCss(themeInput?: string | ThemeConfig): string {
  const theme = getTheme(themeInput);
  const themeVars = generateThemeCssVariables(theme);
  const baseCss = getBaseInkblotCss();
  const katexCss = getKatexCss();

  return [themeVars, baseCss, katexCss].filter(Boolean).join('\n\n');
}
