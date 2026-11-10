import type { LanguageTokens } from '../types'
import { tone } from '../util'

const inter = { family: 'Inter Variable', stack: "'Inter Variable', 'Inter', system-ui, -apple-system, sans-serif" }
const newsreader = { family: 'Newsreader Variable', stack: "'Newsreader Variable', 'Newsreader', Georgia, 'Times New Roman', serif" }
const jetbrains = { family: 'JetBrains Mono Variable', stack: "'JetBrains Mono Variable', 'JetBrains Mono', ui-monospace, monospace" }
const interNative = { 400: 'Inter_400Regular', 500: 'Inter_500Medium', 600: 'Inter_600SemiBold', 700: 'Inter_700Bold' }
const newsreaderNative = { 400: 'Newsreader_400Regular', 500: 'Newsreader_500Medium', 600: 'Newsreader_600SemiBold', 700: 'Newsreader_700Bold' }
const jetbrainsNative = { 400: 'JetBrainsMono_400Regular', 500: 'JetBrainsMono_500Medium', 600: 'JetBrainsMono_600SemiBold', 700: 'JetBrainsMono_700Bold' }

/**
 * Journal — a research notebook. Toned paper, navy-black ink and one teal accent. Structure comes from rules, not boxes:
 * sections open under a 1.5px ink rule, lists are hairline-ruled rows, empty states are dashed. Headlines and headline
 * figures are set in a serif (Newsreader) with optical sizing; the interface is Inter; references and code are
 * JetBrains Mono. Amber marks what is paused, brick what is wrong. Categories are a restrained, ink-friendly set around
 * the teal: teal, navy, amber, brick, moss, slate-violet.
 */
export const journal: LanguageTokens = {
  id: 'journal',
  name: 'Journal',
  tagline: 'A research notebook. Ruled paper, serif figures, one teal accent.',
  fonts: { sans: inter, display: newsreader, serif: newsreader, mono: jetbrains, hand: newsreader },
  nativeFonts: { sans: interNative, display: newsreaderNative, serif: newsreaderNative, mono: jetbrainsNative, hand: newsreaderNative },
  type: {
    // Large, balanced serif headlines at regular weight; tracking tightens as the size grows.
    display: { font: 'display', size: 56, line: 60, weight: 400, tracking: -0.025 },
    h1: { font: 'display', size: 38, line: 44, weight: 400, tracking: -0.02 },
    h2: { font: 'display', size: 27, line: 33, weight: 400, tracking: -0.015 },
    h3: { font: 'display', size: 20, line: 26, weight: 500, tracking: -0.01 },
    bodyLg: { font: 'sans', size: 18, line: 29, weight: 400, tracking: -0.005 },
    body: { font: 'sans', size: 16, line: 26, weight: 400, tracking: -0.003 },
    bodySm: { font: 'sans', size: 14, line: 22, weight: 400, tracking: 0 },
    label: { font: 'sans', size: 14, line: 18, weight: 500, tracking: 0 },
    caption: { font: 'sans', size: 12, line: 16, weight: 600, tracking: 0.02 },
    mono: { font: 'mono', size: 13, line: 20, weight: 400, tracking: 0 },
    note: { font: 'serif', size: 17, line: 25, weight: 400, tracking: 0 },
  },
  space: [0, 2, 4, 8, 12, 16, 20, 24, 32, 48, 64, 96],
  control: { sm: 30, md: 36, lg: 44 },
  radius: { control: 3, card: 4, sheet: 6, chip: 999, bullet: 999 },
  border: { hairline: 1, control: 1, strong: 1.5 },
  focus: { width: 2, offset: 2 },
  motion: {
    fast: 120, base: 200, slow: 320,
    ease: 'cubic-bezier(0.25, 0.1, 0.25, 1)', enter: 'cubic-bezier(0.2, 0.7, 0.2, 1)', exit: 'cubic-bezier(0.4, 0, 1, 1)',
    spring: 'cubic-bezier(0.3, 1.1, 0.5, 1)',
  },
  icon: { stroke: 1.5, cap: 'round', size: { sm: 16, md: 18, lg: 22 } },
  elevation: {
    // Rules carry the structure; shadows are kept for what floats (menus, dialogs).
    light: {
      0: [],
      1: [{ x: 0, y: 1, blur: 0, spread: 0, color: 'rgba(20,36,58,0.04)' }],
      2: [{ x: 0, y: 1, blur: 2, spread: 0, color: 'rgba(20,36,58,0.06)' }, { x: 0, y: 10, blur: 28, spread: -10, color: 'rgba(20,36,58,0.2)' }],
      3: [{ x: 0, y: 2, blur: 4, spread: 0, color: 'rgba(20,36,58,0.06)' }, { x: 0, y: 28, blur: 60, spread: -18, color: 'rgba(20,36,58,0.3)' }],
    },
    dark: {
      0: [],
      1: [{ x: 0, y: 1, blur: 0, spread: 0, color: 'rgba(0,0,0,0.3)' }],
      2: [{ x: 0, y: 12, blur: 32, spread: -10, color: 'rgba(0,0,0,0.6)' }],
      3: [{ x: 0, y: 28, blur: 64, spread: -16, color: 'rgba(0,0,0,0.75)' }],
    },
  },
  colors: {
    light: {
      bg: '#FBFBF8', surface: '#FFFFFF', raised: '#FFFFFF', sunken: '#F3F4F1', scrim: 'rgba(20,36,58,0.38)',
      // ink-3 (#7C8892) is too faint for text on paper (3.5:1); it stays a control edge (3:1) and ink-2 is the muted text.
      border: '#DBE0E0', controlBorder: '#7C8892', borderStrong: '#14243A',
      text: '#14243A', muted: '#4B5966',
      primary: '#0D7A76', onPrimary: '#FBFBF8', primaryHover: '#0A6663',
      focus: '#0D7A76', selection: '#E2F0EE',
      tones: {
        // Teal on teal-soft is 4.4:1, so the ink is a touch darker than the accent.
        accent: tone('#0D7A76', '#FBFBF8', '#E2F0EE', '#0D7874'),
        success: tone('#2E7442', '#FFFFFF', '#E3EFE5', '#235A33'),
        // Amber #A8701A carries white at 4.2:1; the fill is darkened to #A06B19 and its ink to #936217.
        warning: tone('#A06B19', '#FFFFFF', '#F6EDDC', '#936217'),
        danger: tone('#B4412F', '#FFFFFF', '#F8E7E3', '#8F3022'),
        info: tone('#2F5C86', '#FFFFFF', '#E3EAF2', '#234769'),
      },
      // teal, navy, amber, brick, moss, slate-violet
      categories: {
        c1: tone('#0D7A76', '#FBFBF8', '#E2F0EE', '#0D7874'),
        c2: tone('#14243A', '#FFFFFF', '#E4E8EE', '#14243A'),
        c3: tone('#A06B19', '#FFFFFF', '#F6EDDC', '#936217'),
        c4: tone('#A23F2D', '#FFFFFF', '#F7E5E1', '#843020'),
        c5: tone('#4D6A2B', '#FFFFFF', '#E9EFDF', '#3A5220'),
        c6: tone('#5A578A', '#FFFFFF', '#EAE9F3', '#45426E'),
      },
    },
    dark: {
      bg: '#0E1418', surface: '#141C21', raised: '#1A242A', sunken: '#0A0F12', scrim: 'rgba(0,0,0,0.6)',
      border: '#263238', controlBorder: '#74828B', borderStrong: '#C9D3D7',
      text: '#E4EAEC', muted: '#A2AFB7',
      primary: '#5CC2BB', onPrimary: '#0E1418', primaryHover: '#7DD2CB',
      focus: '#5CC2BB', selection: '#133331',
      tones: {
        accent: tone('#5CC2BB', '#0E1418', '#133331', '#8FDAD3'),
        success: tone('#7CC48C', '#0B1A10', '#16301F', '#AADDB4'),
        warning: tone('#E0AA52', '#1C1305', '#352812', '#F0CA8C'),
        danger: tone('#EF8A78', '#220906', '#3E1E19', '#F8BAAE'),
        info: tone('#86ADD8', '#0B1625', '#172A40', '#B9D0EA'),
      },
      categories: {
        c1: tone('#5CC2BB', '#0E1418', '#133331', '#8FDAD3'),
        c2: tone('#A9BBD0', '#0E1418', '#1E2A3A', '#C9D5E3'),
        c3: tone('#E0AA52', '#1C1305', '#352812', '#F0CA8C'),
        c4: tone('#EF8A78', '#220906', '#3E1E19', '#F8BAAE'),
        c5: tone('#A6C47A', '#111A07', '#24301A', '#C9DDA8'),
        c6: tone('#ABA8DD', '#14132B', '#26253F', '#D0CEF1'),
      },
    },
  },
}
