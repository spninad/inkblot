import type { LanguageTokens } from '../types'
import { tone } from '../util'

const inter = { family: 'Inter Variable', stack: "'Inter Variable', 'Inter', system-ui, sans-serif" }
const interNative = { 400: 'Inter_400Regular', 500: 'Inter_500Medium', 600: 'Inter_600SemiBold', 700: 'Inter_700Bold' }

/**
 * Paper — a calm design canvas, after paper.design. Bluish-white sheets with hairline edges on a canvas ruled by faint
 * layout lines; large, light-weight two-tone headlines; small, precise UI text. Colour is rationed: ink for actions,
 * periwinkle for focus and selection, and the categories borrow a shader palette (periwinkle, orchid, coral, amber,
 * teal, sky). Imagery is grain gradients. One family throughout (Inter) with tabular figures, never a monospace.
 */
export const paper: LanguageTokens = {
  id: 'paper',
  name: 'Paper',
  tagline: 'A calm canvas. Hairlines, light headlines, grain-gradient colour.',
  fonts: { sans: inter, display: inter, serif: inter, mono: inter, hand: inter },
  nativeFonts: { sans: interNative, display: interNative, serif: interNative, mono: interNative, hand: interNative },
  type: {
    // Display is big and light; hierarchy comes from size and a muted second clause, not weight.
    display: { font: 'display', size: 56, line: 58, weight: 400, tracking: -0.042 },
    h1: { font: 'display', size: 34, line: 40, weight: 450, tracking: -0.032 },
    h2: { font: 'display', size: 22, line: 28, weight: 500, tracking: -0.02 },
    h3: { font: 'sans', size: 15, line: 20, weight: 600, tracking: -0.01 },
    bodyLg: { font: 'sans', size: 17, line: 27, weight: 400, tracking: -0.01 },
    body: { font: 'sans', size: 14, line: 21, weight: 400, tracking: -0.006 },
    bodySm: { font: 'sans', size: 13, line: 19, weight: 400, tracking: -0.003 },
    label: { font: 'sans', size: 13, line: 16, weight: 500, tracking: -0.006 },
    caption: { font: 'sans', size: 12, line: 16, weight: 500, tracking: 0 },
    mono: { font: 'mono', size: 13, line: 18, weight: 500, tracking: -0.01 },
    note: { font: 'sans', size: 13, line: 18, weight: 400, tracking: 0 },
  },
  space: [0, 2, 4, 8, 12, 16, 20, 24, 32, 44, 64, 96],
  control: { sm: 28, md: 36, lg: 44 },
  radius: { control: 8, card: 12, sheet: 16, chip: 6, bullet: 999 },
  border: { hairline: 1, control: 1, strong: 1 },
  focus: { width: 2, offset: 2 },
  motion: {
    fast: 120, base: 200, slow: 320,
    ease: 'cubic-bezier(0.2, 0.7, 0.1, 1)', enter: 'cubic-bezier(0.15, 0.9, 0.25, 1)', exit: 'cubic-bezier(0.4, 0, 1, 0.6)',
    spring: 'cubic-bezier(0.3, 1.15, 0.5, 1)',
  },
  icon: { stroke: 1.5, cap: 'round', size: { sm: 16, md: 18, lg: 24 } },
  elevation: {
    light: {
      0: [],
      1: [{ x: 0, y: 1, blur: 2, spread: 0, color: 'rgba(15,25,60,0.05)' }],
      2: [{ x: 0, y: 2, blur: 4, spread: 0, color: 'rgba(15,25,60,0.04)' }, { x: 0, y: 12, blur: 32, spread: -8, color: 'rgba(15,25,60,0.14)' }],
      3: [{ x: 0, y: 4, blur: 8, spread: 0, color: 'rgba(15,25,60,0.05)' }, { x: 0, y: 28, blur: 64, spread: -16, color: 'rgba(15,25,60,0.24)' }],
    },
    dark: {
      0: [],
      1: [{ x: 0, y: 1, blur: 2, spread: 0, color: 'rgba(0,0,0,0.4)' }],
      2: [{ x: 0, y: 12, blur: 32, spread: -8, color: 'rgba(0,0,0,0.6)' }],
      3: [{ x: 0, y: 28, blur: 64, spread: -16, color: 'rgba(0,0,0,0.75)' }],
    },
  },
  colors: {
    light: {
      bg: '#F6F8FC', surface: '#FFFFFF', raised: '#FFFFFF', sunken: '#EEF2F9', scrim: 'rgba(15,19,40,0.28)',
      border: '#E1E7F1', controlBorder: '#7D879E', borderStrong: '#0F1320',
      text: '#0F1320', muted: '#586276',
      primary: '#0F1320', onPrimary: '#FFFFFF', primaryHover: '#2A3042',
      focus: '#3F5CF2', selection: '#DCE3FF',
      tones: {
        accent: tone('#3F5CF2', '#FFFFFF', '#E4E9FF', '#2D44C4'),
        success: tone('#0E8566', '#FFFFFF', '#DDF4EC', '#08604A'),
        warning: tone('#B45B00', '#FFFFFF', '#FFEEDB', '#7E3F00'),
        danger: tone('#D93644', '#FFFFFF', '#FDE5E7', '#9C1A26'),
        info: tone('#1F72D1', '#FFFFFF', '#DFECFC', '#13509A'),
      },
      // a shader palette: periwinkle, orchid, coral, amber, teal, sky
      categories: {
        c1: tone('#3F5CF2', '#FFFFFF', '#E4E9FF', '#2D44C4'),
        c2: tone('#9A44D4', '#FFFFFF', '#F3E6FC', '#6A2299'),
        c3: tone('#CC3644', '#FFFFFF', '#FDE6E8', '#9C1F2B'),
        c4: tone('#A35E00', '#FFFFFF', '#FFF0D9', '#7E4800'),
        c5: tone('#0B7A70', '#FFFFFF', '#DBF3F0', '#075E56'),
        c6: tone('#1478C7', '#FFFFFF', '#DEEDFB', '#0D5491'),
      },
    },
    dark: {
      bg: '#090B11', surface: '#10131B', raised: '#161A24', sunken: '#05070B', scrim: 'rgba(0,0,0,0.6)',
      border: '#232838', controlBorder: '#717C95', borderStrong: '#E9EDF7',
      text: '#ECEFF7', muted: '#9CA5BA',
      primary: '#F2F0E8', onPrimary: '#090B11', primaryHover: '#FFFFFF',
      focus: '#8FA3FF', selection: '#25305F',
      tones: {
        accent: tone('#8FA3FF', '#0A1030', '#1E2752', '#C9D2FF'),
        success: tone('#3CCB9E', '#03190F', '#0E3328', '#A6EED7'),
        warning: tone('#F5A24A', '#231300', '#3D2A10', '#FFD6A6'),
        danger: tone('#FF6B77', '#26050A', '#45161C', '#FFBEC4'),
        info: tone('#5DA6F5', '#04162B', '#13294A', '#B9D9FC'),
      },
      categories: {
        c1: tone('#8FA3FF', '#0A1030', '#1E2752', '#C9D2FF'),
        c2: tone('#C98BF2', '#22072F', '#35204A', '#E8CDFA'),
        c3: tone('#FF7B85', '#2A060B', '#47191E', '#FFC3C8'),
        c4: tone('#F5A24A', '#231300', '#3D2A10', '#FFD6A6'),
        c5: tone('#3CC9B8', '#031A17', '#0E3530', '#A6EDE4'),
        c6: tone('#5DA6F5', '#04162B', '#13294A', '#B9D9FC'),
      },
    },
  },
}
