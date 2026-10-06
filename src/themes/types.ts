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
}

export type BuiltinTheme = 'academic' | 'modern' | 'classic';
