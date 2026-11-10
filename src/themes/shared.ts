import { LANGUAGE_IDS, languages, type Palette, type LanguageTokens } from './tokens/index.js';
import { paletteToUi } from './semantic.js';
import type { ThemeColors, ThemeConfig } from './types.js';

const fontStack = (stack: string) => stack.replace(/ Variable/g, '');

function colors(p: Palette): ThemeColors {
  return {
    bg: p.bg,
    surface: p.surface,
    ink: p.text,
    ink2: p.text,
    muted: p.muted,
    rule: p.border,
    ruleStrong: p.controlBorder,
    accent: p.tones.accent.ink,
    accentSoft: p.tones.accent.tint,
    s0: p.muted,
    s1: p.categories.c1.ink,
    s2: p.categories.c2.ink,
    s3: p.categories.c3.ink,
    grid: p.border,
    axis: p.borderStrong,
    band: p.categories.c1.tint,
  };
}

export function fromDesignLanguage(t: LanguageTokens): ThemeConfig {
  return {
    name: t.id,
    label: t.name,
    light: colors(t.colors.light),
    dark: colors(t.colors.dark),
    ui: { light: paletteToUi(t.colors.light), dark: paletteToUi(t.colors.dark) },
    fonts: {
      serif: fontStack(t.fonts[t.type.bodyLg.font].stack),
      sans: fontStack(t.fonts.sans.stack),
      mono: fontStack(t.fonts.mono.stack),
    },
    design: {
      display: fontStack(t.fonts[t.type.h1.font].stack),
      headingWeight: t.type.h1.weight,
      tracking: t.type.h1.tracking,
      radius: t.radius.control,
      cardRadius: t.radius.card,
      duration: t.motion.fast,
      ease: t.motion.ease,
    },
  };
}

/** Read the canonical registry directly. No Inkblot palette copies. */
export const sharedThemes = LANGUAGE_IDS.map((id) => fromDesignLanguage(languages[id]));
