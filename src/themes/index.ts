import { academicTheme } from './academic.js';
import { modernTheme } from './modern.js';
import { classicTheme } from './classic.js';
import { semanticCss } from './semantic.js';
import { sharedThemes } from './shared.js';
import type { ThemeConfig } from './types.js';

export * from './types.js';
export { resolveAppearance, appearanceInit } from './appearance.js';
export { academicTheme, modernTheme, classicTheme };

const builtinThemes = [academicTheme, classicTheme, ...sharedThemes];
const themeRegistry = new Map<string, ThemeConfig>(
  builtinThemes.map((theme) => [theme.name, theme]),
);

export function registerTheme(theme: ThemeConfig): void {
  themeRegistry.set(theme.name, theme);
}

export function getTheme(nameOrConfig: string | ThemeConfig = 'academic'): ThemeConfig {
  if (typeof nameOrConfig === 'object') {
    return nameOrConfig;
  }
  return themeRegistry.get(nameOrConfig) || academicTheme;
}

/** Mode and visual language are independent so switching mode preserves identity. */
export function generateThemeCssVariables(theme: ThemeConfig, fallback = true): string {
  const selector = `:root[data-theme="${theme.name}"]`;
  const vars = (mode: 'light' | 'dark') => {
    const c = theme[mode] || theme.light;
    const names: Record<string, string> = {
      ink2: 'ink-2',
      ruleStrong: 'rule-strong',
      accentSoft: 'accent-soft',
    };
    return (
      Object.entries(c)
        .map(([k, v]) => `--${names[k] || k}: ${v};`)
        .join('\n  ') +
      '\n  ' +
      semanticCss(theme, mode)
    );
  };
  const d = theme.design;
  let css = `
${fallback ? ':root, ' : ''}${selector}, :root[data-theme="${theme.name}-dark"]${theme.name === 'academic' ? ', :root[data-theme="dark"], :root[data-theme="light"]' : ''} {
  --serif: ${theme.fonts.serif}; --sans: ${theme.fonts.sans}; --mono: ${theme.fonts.mono};
  --display: ${d?.display || theme.fonts.sans}; --heading-weight: ${d?.headingWeight || 650};
  --heading-tracking: ${d?.tracking ?? -0.025}em;
  --radius: ${d?.radius ?? 10}px; --card-radius: ${d?.cardRadius ?? 12}px;
  --duration: ${d?.duration ?? 140}ms; --ease: ${d?.ease || 'cubic-bezier(.2,.7,.1,1)'};
  color-scheme: light;
  ${vars('light')}
}
@media (prefers-color-scheme: dark) {
  ${selector}:not([data-color-mode="light"]) { color-scheme: dark; ${vars('dark')} }
}
${selector}[data-color-mode="dark"], :root[data-theme="${theme.name}-dark"]${theme.name === 'academic' ? ', :root[data-theme="dark"]' : ''} {
  color-scheme: dark; ${vars('dark')}
}
${selector}[data-color-mode="light"]${theme.name === 'academic' ? ', :root[data-theme="light"]' : ''} { color-scheme: light; ${vars('light')} }
`.trim();
  // Each hosted report can own a theme without altering its application's document.
  css = css.replace(
    /:root\[data-theme="([^"]+)"\]/g,
    ':is(:root.inkblot-root[data-theme="$1"], .inkblot-root[data-inkblot-theme="$1"])',
  );
  css = css.replace(/:root(?=,)/g, ':root.inkblot-root');
  return css;
}

export function getBuiltinThemes(): ThemeConfig[] {
  return [...builtinThemes];
}

export function getBuiltinThemeCss(): string {
  return getBuiltinThemes()
    .map((theme) => generateThemeCssVariables(theme, false))
    .join('\n');
}

/** Runs in the head, before styles paint. Do not change data-theme here. */
export const THEME_INIT_SCRIPT = `(function(){try{var m=localStorage.getItem('inkblot-theme-mode');if(m==='light'||m==='dark')document.documentElement.setAttribute('data-color-mode',m)}catch(e){}})();`;

export function getFontHeadTags(input: string | string[] = 'academic'): string {
  const names = Array.isArray(input) ? input : [input];
  if (names.length === 1 && names[0] === 'classic') return '';
  const families = ['Inter:wght@400;450;500;600;650;700'];
  if (names.includes('academic'))
    families.push('Literata:ital,opsz,wght@0,7..72,400;0,7..72,600;1,7..72,400');
  if (names.includes('cozy')) families.push('Crimson+Pro:wght@400;500;600;700');
  if (names.includes('journal'))
    families.push(
      'Newsreader:opsz,wght@6..72,400;6..72,500;6..72,600',
      'JetBrains+Mono:wght@400;500',
    );
  return `<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=${families.join('&family=')}&display=swap">`;
}
