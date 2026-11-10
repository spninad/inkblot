import type { Palette } from './tokens/index.js';
import type { ThemeConfig } from './types.js';

export function paletteToUi(p: Palette): Record<string, string> {
  return {
    background: p.bg,
    foreground: p.text,
    card: p.surface,
    'card-foreground': p.text,
    popover: p.raised,
    'popover-foreground': p.text,
    primary: p.primary,
    'primary-foreground': p.onPrimary,
    secondary: p.sunken,
    'secondary-foreground': p.text,
    muted: p.sunken,
    'muted-foreground': p.muted,
    accent: p.tones.accent.tint,
    'accent-foreground': p.tones.accent.ink,
    destructive: p.tones.danger.ink,
    'destructive-foreground': p.tones.danger.on,
    border: p.border,
    input: p.controlBorder,
    ring: p.focus,
    sidebar: p.bg,
    'sidebar-foreground': p.text,
    'sidebar-primary': p.primary,
    'sidebar-primary-foreground': p.onPrimary,
    'sidebar-accent': p.tones.accent.tint,
    'sidebar-accent-foreground': p.tones.accent.ink,
    'sidebar-border': p.border,
    'sidebar-ring': p.focus,
    ...Object.fromEntries(
      [1, 2, 3, 4, 5].map((i) => [
        `chart-${i}`,
        p.categories[`c${i}` as keyof Palette['categories']].ink,
      ]),
    ),
  };
}
export function semanticCss(theme: ThemeConfig, mode: 'light' | 'dark'): string {
  const c = theme[mode] || theme.light;
  const fallback = {
    background: c.bg,
    foreground: c.ink,
    card: c.surface,
    'card-foreground': c.ink,
    popover: c.surface,
    'popover-foreground': c.ink,
    primary: c.accent,
    'primary-foreground': mode === 'dark' ? c.bg : '#ffffff',
    secondary: c.accentSoft,
    'secondary-foreground': c.ink,
    muted: c.surface,
    'muted-foreground': c.muted,
    accent: c.accentSoft,
    'accent-foreground': c.accent,
    destructive: mode === 'dark' ? '#fca5a5' : '#b91c1c',
    'destructive-foreground': '#ffffff',
    border: c.rule,
    input: c.ruleStrong,
    ring: c.accent,
    sidebar: c.bg,
    'sidebar-foreground': c.ink,
    'sidebar-primary': c.accent,
    'sidebar-primary-foreground': '#ffffff',
    'sidebar-accent': c.accentSoft,
    'sidebar-accent-foreground': c.accent,
    'sidebar-border': c.rule,
    'sidebar-ring': c.accent,
    'chart-1': c.s1,
    'chart-2': c.s2,
    'chart-3': c.s3,
    'chart-4': c.s0,
    'chart-5': c.accent,
  };
  return Object.entries({ ...fallback, ...(theme.ui?.[mode] || {}) })
    .map(([k, v]) => `--ib-${k}: ${v};`)
    .join('\n  ');
}
