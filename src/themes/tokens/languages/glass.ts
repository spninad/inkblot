import type { LanguageTokens } from '../types'
import { tone } from '../util'

/**
 * Glass — a modern language built from light and material rather than ink and paper.
 * Controls are translucent glass that floats over content: they blur and saturate what is behind them, carry a
 * specular rim, and use concentric capsule geometry. The one colour of its own is electric ultraviolet.
 * The colour values below are the *opaque equivalents* of each material (what contrast is tested against);
 * glass.css renders surfaces as translucent mixes of them over a luminous backdrop.
 */
export const glass: LanguageTokens = {
  id: 'glass',
  name: 'Glass',
  tagline: 'Content first; a floating layer of glass for the controls. One ultraviolet signal.',
  fonts: {
    sans: { family: 'Inter Variable', stack: "'Inter Variable', 'Inter', -apple-system, system-ui, sans-serif" },
    display: { family: 'Inter Variable', stack: "'Inter Variable', 'Inter', -apple-system, system-ui, sans-serif" },
    serif: { family: 'Inter Variable', stack: "'Inter Variable', 'Inter', system-ui, sans-serif" },
    mono: { family: 'Geist Mono Variable', stack: "'Geist Mono Variable', ui-monospace, monospace" },
    hand: { family: 'Inter Variable', stack: "'Inter Variable', system-ui, sans-serif" },
  },
  nativeFonts: {
    sans: { 400: 'Inter_400Regular', 500: 'Inter_500Medium', 600: 'Inter_600SemiBold', 700: 'Inter_700Bold' },
    display: { 400: 'Inter_400Regular', 500: 'Inter_500Medium', 600: 'Inter_600SemiBold', 700: 'Inter_700Bold' },
    serif: { 400: 'Inter_400Regular', 500: 'Inter_500Medium', 600: 'Inter_600SemiBold', 700: 'Inter_700Bold' },
    mono: { 400: 'GeistMono_400Regular', 500: 'GeistMono_500Medium', 600: 'GeistMono_600SemiBold', 700: 'GeistMono_700Bold' },
    hand: { 400: 'Inter_400Regular', 500: 'Inter_500Medium', 600: 'Inter_600SemiBold', 700: 'Inter_700Bold' },
  },
  type: {
    // Apple-like proportions: a bold large title, quiet 15px body, semibold controls. Weight does the hierarchy.
    display: { font: 'display', size: 44, line: 48, weight: 700, tracking: -0.032 },
    h1: { font: 'display', size: 30, line: 36, weight: 700, tracking: -0.026 },
    h2: { font: 'display', size: 21, line: 26, weight: 650, tracking: -0.02 },
    h3: { font: 'sans', size: 16, line: 21, weight: 600, tracking: -0.012 },
    bodyLg: { font: 'sans', size: 17, line: 25, weight: 400, tracking: -0.012 },
    body: { font: 'sans', size: 15, line: 21, weight: 400, tracking: -0.008 },
    bodySm: { font: 'sans', size: 13, line: 18, weight: 400, tracking: -0.003 },
    label: { font: 'sans', size: 14, line: 18, weight: 590, tracking: -0.01 },
    caption: { font: 'sans', size: 12, line: 16, weight: 500, tracking: 0 },
    mono: { font: 'mono', size: 13, line: 18, weight: 450, tracking: 0 },
    note: { font: 'sans', size: 13, line: 18, weight: 500, tracking: 0 },
  },
  space: [0, 2, 4, 8, 12, 16, 20, 24, 32, 44, 60, 88],
  control: { sm: 30, md: 38, lg: 48 },
  // Concentric geometry: controls are capsules; containers step down by their padding so corners nest.
  radius: { control: 999, card: 22, sheet: 34, chip: 999, bullet: 999 },
  border: { hairline: 1, control: 1, strong: 1.5 },
  focus: { width: 2, offset: 3 },
  motion: {
    // Liquid: fast to respond, then a damped wobble as the material settles.
    fast: 140, base: 260, slow: 420,
    ease: 'cubic-bezier(0.25, 0.9, 0.3, 1)', enter: 'cubic-bezier(0.18, 1, 0.3, 1)', exit: 'cubic-bezier(0.4, 0, 0.9, 0.5)',
    spring: 'cubic-bezier(0.34, 1.4, 0.55, 1)',
  },
  icon: { stroke: 1.75, cap: 'round', size: { sm: 16, md: 20, lg: 26 } },
  elevation: {
    light: {
      0: [],
      1: [{ x: 0, y: 1, blur: 2, spread: 0, color: 'rgba(30,20,90,0.06)' }, { x: 0, y: 8, blur: 24, spread: -8, color: 'rgba(30,20,90,0.16)' }],
      2: [{ x: 0, y: 2, blur: 4, spread: 0, color: 'rgba(30,20,90,0.06)' }, { x: 0, y: 18, blur: 44, spread: -12, color: 'rgba(30,20,90,0.24)' }],
      3: [{ x: 0, y: 4, blur: 8, spread: 0, color: 'rgba(30,20,90,0.08)' }, { x: 0, y: 36, blur: 80, spread: -16, color: 'rgba(30,20,90,0.34)' }],
    },
    dark: {
      0: [],
      1: [{ x: 0, y: 8, blur: 24, spread: -8, color: 'rgba(0,0,0,0.55)' }],
      2: [{ x: 0, y: 18, blur: 44, spread: -12, color: 'rgba(0,0,0,0.65)' }],
      3: [{ x: 0, y: 36, blur: 80, spread: -16, color: 'rgba(0,0,0,0.8)' }],
    },
  },
  colors: {
    light: {
      bg: '#F3F5FA', surface: '#FFFFFF', raised: '#FFFFFF', sunken: '#EAEDF5', scrim: 'rgba(14,15,40,0.28)',
      border: '#DFE3ED', controlBorder: '#7E83A0', borderStrong: '#0E0F1A',
      text: '#0E0F1A', muted: '#535870',
      primary: '#5B2EFF', onPrimary: '#FFFFFF', primaryHover: '#4A1FE6',
      focus: '#5B2EFF', selection: '#DCD3FF',
      tones: {
        accent: tone('#5B2EFF', '#FFFFFF', '#E7E1FF', '#3D17C2'),
        success: tone('#12805A', '#FFFFFF', '#DAF3E9', '#0B5A3F'),
        warning: tone('#A35A00', '#FFFFFF', '#FFEFD6', '#764000'),
        danger: tone('#D1243F', '#FFFFFF', '#FFE2E7', '#9A1029'),
        info: tone('#0868D6', '#FFFFFF', '#DDEBFF', '#064B9C'),
      },
      // ultraviolet, cyan, magenta, cobalt, mint, amber: the colours light splits into
      categories: {
        c1: tone('#6236FF', '#FFFFFF', '#E9E3FF', '#3D17C2'),
        c2: tone('#0A7BA3', '#FFFFFF', '#D8F2FB', '#055673'),
        c3: tone('#B8288F', '#FFFFFF', '#FBE0F3', '#82105F'),
        c4: tone('#2D5BE3', '#FFFFFF', '#DFE7FF', '#1A3DA6'),
        c5: tone('#0D7E6B', '#FFFFFF', '#D6F4EE', '#08584B'),
        c6: tone('#A65F00', '#FFFFFF', '#FFEDD3', '#764300'),
      },
    },
    dark: {
      bg: '#05060A', surface: '#121319', raised: '#1B1C24', sunken: '#0A0B10', scrim: 'rgba(0,0,0,0.45)',
      border: '#272935', controlBorder: '#787C93', borderStrong: '#F2F1FF',
      text: '#F2F3F8', muted: '#A1A4B6',
      primary: '#8F72FF', onPrimary: '#0B0620', primaryHover: '#A88FFF',
      focus: '#A88FFF', selection: '#3B2A8A',
      tones: {
        accent: tone('#8F72FF', '#0B0620', '#251B57', '#CFC2FF'),
        success: tone('#3FD49B', '#03190F', '#0E3326', '#A6F0D2'),
        warning: tone('#FFAE4A', '#221300', '#3D2A0E', '#FFD7A1'),
        danger: tone('#FF6B84', '#24030A', '#46131E', '#FFBCC7'),
        info: tone('#5AA7FF', '#03142B', '#11294D', '#B9D9FF'),
      },
      categories: {
        c1: tone('#8F72FF', '#0B0620', '#251B57', '#CFC2FF'),
        c2: tone('#38C8F0', '#021A22', '#0D3442', '#A9E9FA'),
        c3: tone('#F06CCB', '#2A0420', '#45173A', '#F9C2E9'),
        c4: tone('#6E93FF', '#050F2E', '#17264F', '#C0D0FF'),
        c5: tone('#38D6B8', '#021C17', '#0C3A31', '#A8F0E2'),
        c6: tone('#FFB24D', '#241400', '#3D2B0F', '#FFD9A6'),
      },
    },
  },
}
