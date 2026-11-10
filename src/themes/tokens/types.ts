export type Mode = 'light' | 'dark'
export type LanguageId = 'industrie' | 'cozy' | 'modern' | 'colorful' | 'glass' | 'paper' | 'journal'
export const LANGUAGE_IDS: LanguageId[] = ['industrie', 'cozy', 'modern', 'colorful', 'glass', 'paper', 'journal']
export const MODES: Mode[] = ['light', 'dark']

/** A colour used as a fill, with its paired foregrounds. All pairs are AA-tested. */
export interface Tone {
  /** Saturated fill (badges, bullets, solid buttons). */
  solid: string
  /** Text/icon colour that sits on `solid`. */
  on: string
  /** Quiet background wash. */
  tint: string
  /** Text/icon colour that sits on `tint`. */
  ink: string
}

export type CategoryKey = 'c1' | 'c2' | 'c3' | 'c4' | 'c5' | 'c6'
export const CATEGORY_KEYS: CategoryKey[] = ['c1', 'c2', 'c3', 'c4', 'c5', 'c6']
export type ToneKey = 'accent' | 'success' | 'warning' | 'danger' | 'info'

export interface Palette {
  bg: string
  surface: string
  raised: string
  sunken: string
  /** Scrim behind dialogs. */
  scrim: string
  /** Decorative separators (not required to hit 3:1). */
  border: string
  /** Borders of interactive controls — must reach 3:1 against surface. */
  controlBorder: string
  /** Emphasis rules, headers, outlines. */
  borderStrong: string
  text: string
  muted: string
  primary: string
  onPrimary: string
  primaryHover: string
  focus: string
  selection: string
  tones: Record<ToneKey, Tone>
  /** Six categorical slots. Each language maps them to its own identity colours. */
  categories: Record<CategoryKey, Tone>
}

export interface ShadowLayer { x: number; y: number; blur: number; spread: number; color: string }

export interface TypeRole {
  font: 'sans' | 'display' | 'serif' | 'mono' | 'hand'
  size: number
  line: number
  weight: number
  /** em */
  tracking: number
}

export interface FontFamily {
  /** Primary family name (what you pass to RN / @font-face). */
  family: string
  /** Full CSS stack. */
  stack: string
}

export interface LanguageTokens {
  id: LanguageId
  name: string
  tagline: string
  fonts: { sans: FontFamily; display: FontFamily; serif: FontFamily; mono: FontFamily; hand: FontFamily }
  /** React Native font family names per weight (Expo-style names). */
  nativeFonts: Record<'sans' | 'display' | 'serif' | 'mono' | 'hand', Record<number, string>>
  type: Record<
    'display' | 'h1' | 'h2' | 'h3' | 'bodyLg' | 'body' | 'bodySm' | 'label' | 'caption' | 'mono' | 'note',
    TypeRole
  >
  /** px steps; every language uses the same 4px grid, density differs through control sizes and gaps. */
  space: number[]
  control: { sm: number; md: number; lg: number }
  radius: { control: number; card: number; sheet: number; chip: number; bullet: number }
  border: { hairline: number; control: number; strong: number }
  focus: { width: number; offset: number }
  motion: { fast: number; base: number; slow: number; ease: string; enter: string; exit: string; spring: string }
  icon: { stroke: number; cap: 'round' | 'square' | 'butt'; size: { sm: number; md: number; lg: number } }
  elevation: Record<Mode, { 0: ShadowLayer[]; 1: ShadowLayer[]; 2: ShadowLayer[]; 3: ShadowLayer[] }>
  colors: Record<Mode, Palette>
}
