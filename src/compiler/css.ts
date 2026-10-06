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
      cachedKatexCss = fs.readFileSync(c, 'utf-8');
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
