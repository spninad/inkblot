export interface ThemeColors {
  bg: string;
  surface: string;
  ink: string;
  ink2: string;
  muted: string;
  rule: string;
  ruleStrong: string;
  accent: string;
  accentSoft: string;
  s0: string;
  s1: string;
  s2: string;
  s3: string;
  grid: string;
  axis: string;
  band: string;
}

export interface ThemeFonts {
  serif: string;
  sans: string;
  mono: string;
}

export interface ThemeConfig {
  name: string;
  label: string;
  light: ThemeColors;
  dark?: ThemeColors;
  fonts: ThemeFonts;
  /** Optional shadcn semantic color overrides, keyed without the --ib- prefix. */
  ui?: { light: Record<string, string>; dark?: Record<string, string> };
  /** Layout and interaction values from the shared design language. */
  design?: {
    display: string;
    headingWeight: number;
    tracking: number;
    radius: number;
    cardRadius: number;
    duration: number;
    ease: string;
  };
}

export type BuiltinTheme =
  | 'academic'
  | 'classic'
  | 'industrie'
  | 'cozy'
  | 'modern'
  | 'colorful'
  | 'glass'
  | 'paper'
  | 'journal';

export type ColorMode = 'light' | 'dark' | 'system';
export type ThemePickerConfig = boolean | { themes?: string[] };
