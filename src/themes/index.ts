import { academicTheme } from './academic.js';
import { modernTheme } from './modern.js';
import { classicTheme } from './classic.js';
import type { ThemeConfig, BuiltinTheme } from './types.js';

export * from './types.js';
export { academicTheme, modernTheme, classicTheme };

const themeRegistry = new Map<string, ThemeConfig>([
  ['academic', academicTheme],
  ['modern', modernTheme],
  ['classic', classicTheme],
]);

export function registerTheme(theme: ThemeConfig): void {
  themeRegistry.set(theme.name, theme);
}

export function getTheme(nameOrConfig: string | ThemeConfig = 'academic'): ThemeConfig {
  if (typeof nameOrConfig === 'object') {
    return nameOrConfig;
  }
  return themeRegistry.get(nameOrConfig) || academicTheme;
}

export function generateThemeCssVariables(theme: ThemeConfig): string {
  const lightVars = [
    `--bg: ${theme.light.bg};`,
    `--surface: ${theme.light.surface};`,
    `--ink: ${theme.light.ink};`,
    `--ink-2: ${theme.light.ink2};`,
    `--muted: ${theme.light.muted};`,
    `--rule: ${theme.light.rule};`,
    `--rule-strong: ${theme.light.ruleStrong};`,
    `--accent: ${theme.light.accent};`,
    `--accent-soft: ${theme.light.accentSoft};`,
    `--s0: ${theme.light.s0};`,
    `--s1: ${theme.light.s1};`,
    `--s2: ${theme.light.s2};`,
    `--s3: ${theme.light.s3};`,
    `--grid: ${theme.light.grid};`,
    `--axis: ${theme.light.axis};`,
    `--band: ${theme.light.band};`,
    `--serif: ${theme.fonts.serif};`,
    `--sans: ${theme.fonts.sans};`,
    `--mono: ${theme.fonts.mono};`,
  ].join('\n  ');

  let darkVars = '';
  if (theme.dark) {
    darkVars = [
      `--bg: ${theme.dark.bg};`,
      `--surface: ${theme.dark.surface};`,
      `--ink: ${theme.dark.ink};`,
      `--ink-2: ${theme.dark.ink2};`,
      `--muted: ${theme.dark.muted};`,
      `--rule: ${theme.dark.rule};`,
      `--rule-strong: ${theme.dark.ruleStrong};`,
      `--accent: ${theme.dark.accent};`,
      `--accent-soft: ${theme.dark.accentSoft};`,
      `--s0: ${theme.dark.s0};`,
      `--s1: ${theme.dark.s1};`,
      `--s2: ${theme.dark.s2};`,
      `--s3: ${theme.dark.s3};`,
      `--grid: ${theme.dark.grid};`,
      `--axis: ${theme.dark.axis};`,
      `--band: ${theme.dark.band};`,
    ].join('\n    ');
  }

  return `
:root, :root[data-theme="${theme.name}"] {
  ${lightVars}
}

${
  theme.dark
    ? `
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    color-scheme: dark;
    ${darkVars}
  }
}

:root[data-theme="dark"], :root[data-theme="${theme.name}-dark"] {
  color-scheme: dark;
  ${darkVars}
}
`
    : ''
}
`.trim();
}

export function getFontHeadTags(themeName: string = 'academic'): string {
  if (themeName === 'academic') {
    return `
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Literata:ital,opsz,wght@0,7..72,400;0,7..72,600;1,7..72,400&display=swap">
`.trim();
  }
  if (themeName === 'modern') {
    return `
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap">
`.trim();
  }
  return '';
}
