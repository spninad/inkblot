import type { LanguageTokens } from '../types'
import { tone } from '../util'

/**
 * Cozy — a night-train compartment. Walnut and smoke, copper fittings, verdigris, a tungsten reading lamp.
 * Crimson Pro for everything you read, Inter for everything you press. Active things are lit, not marked:
 * a copper filament and a pool of lamplight instead of a highlighter.
 */
const serif = { family: 'Crimson Pro Variable', stack: "'Crimson Pro Variable', 'Crimson Pro', 'Crimson Text', Georgia, serif" }
const crimson = { 400: 'CrimsonPro_400Regular', 500: 'CrimsonPro_500Medium', 600: 'CrimsonPro_600SemiBold', 700: 'CrimsonPro_700Bold' }

export const cozy: LanguageTokens = {
  id: 'cozy',
  name: 'Cozy',
  tagline: 'A night-train compartment. Copper fittings, walnut, a reading lamp left on.',
  fonts: {
    sans: { family: 'Inter Variable', stack: "'Inter Variable', 'Inter', system-ui, sans-serif" },
    display: serif,
    serif,
    // No monospace: times and fares are set in the serif with tabular lining figures.
    mono: serif,
    // Annotations are the serif's italic, not a handwriting face.
    hand: serif,
  },
  nativeFonts: {
    sans: { 400: 'Inter_400Regular', 500: 'Inter_500Medium', 600: 'Inter_600SemiBold', 700: 'Inter_700Bold' },
    display: crimson,
    serif: crimson,
    mono: crimson,
    hand: { 400: 'CrimsonPro_400Regular_Italic', 500: 'CrimsonPro_500Medium_Italic', 600: 'CrimsonPro_600SemiBold_Italic', 700: 'CrimsonPro_700Bold_Italic' },
  },
  type: {
    display: { font: 'display', size: 64, line: 64, weight: 400, tracking: -0.022 },
    h1: { font: 'display', size: 42, line: 46, weight: 400, tracking: -0.018 },
    h2: { font: 'display', size: 29, line: 34, weight: 500, tracking: -0.01 },
    h3: { font: 'display', size: 21, line: 26, weight: 600, tracking: -0.004 },
    bodyLg: { font: 'serif', size: 21, line: 32, weight: 400, tracking: 0 },
    body: { font: 'serif', size: 18, line: 28, weight: 400, tracking: 0.002 },
    bodySm: { font: 'sans', size: 14, line: 21, weight: 400, tracking: 0 },
    label: { font: 'sans', size: 14, line: 18, weight: 600, tracking: -0.003 },
    caption: { font: 'sans', size: 12, line: 16, weight: 500, tracking: 0.01 },
    mono: { font: 'mono', size: 18, line: 24, weight: 500, tracking: 0 },
    note: { font: 'hand', size: 18, line: 26, weight: 400, tracking: 0 },
  },
  space: [0, 2, 4, 8, 12, 16, 20, 24, 32, 44, 60, 88],
  control: { sm: 34, md: 44, lg: 54 },
  radius: { control: 10, card: 18, sheet: 26, chip: 999, bullet: 999 },
  border: { hairline: 1, control: 1, strong: 1.5 },
  focus: { width: 2, offset: 2 },
  motion: {
    // Unhurried, no overshoot except a soft settle: things here are heavy and well-oiled.
    fast: 160, base: 280, slow: 460,
    ease: 'cubic-bezier(0.25, 0.8, 0.25, 1)', enter: 'cubic-bezier(0.2, 0.9, 0.3, 1)', exit: 'cubic-bezier(0.4, 0, 0.7, 0.4)',
    spring: 'cubic-bezier(0.3, 1.12, 0.5, 1)',
  },
  icon: { stroke: 1.5, cap: 'round', size: { sm: 16, md: 20, lg: 28 } },
  elevation: {
    light: {
      0: [],
      1: [{ x: 0, y: 1, blur: 1, spread: 0, color: 'rgba(60,32,18,0.08)' }, { x: 0, y: 8, blur: 18, spread: -10, color: 'rgba(60,32,18,0.22)' }],
      2: [{ x: 0, y: 1, blur: 1, spread: 0, color: 'rgba(60,32,18,0.08)' }, { x: 0, y: 18, blur: 36, spread: -16, color: 'rgba(60,32,18,0.32)' }],
      3: [{ x: 0, y: 2, blur: 2, spread: 0, color: 'rgba(60,32,18,0.08)' }, { x: 0, y: 36, blur: 72, spread: -24, color: 'rgba(40,20,10,0.46)' }],
    },
    dark: {
      0: [],
      1: [{ x: 0, y: 1, blur: 0, spread: 0, color: 'rgba(255,214,170,0.06)' }, { x: 0, y: 10, blur: 20, spread: -10, color: 'rgba(0,0,0,0.6)' }],
      2: [{ x: 0, y: 1, blur: 0, spread: 0, color: 'rgba(255,214,170,0.07)' }, { x: 0, y: 20, blur: 40, spread: -16, color: 'rgba(0,0,0,0.7)' }],
      3: [{ x: 0, y: 1, blur: 0, spread: 0, color: 'rgba(255,214,170,0.08)' }, { x: 0, y: 40, blur: 80, spread: -24, color: 'rgba(0,0,0,0.85)' }],
    },
  },
  colors: {
    // Morning in the compartment: smoke-grey linen, walnut ink, copper.
    light: {
      bg: '#ECE7E3', surface: '#F8F5F2', raised: '#FDFBF9', sunken: '#E1DAD4', scrim: 'rgba(30,18,12,0.5)',
      border: '#D8CEC6', controlBorder: '#8F7B6D', borderStrong: '#3A2A22',
      text: '#2A1E19', muted: '#68564C',
      primary: '#9A4A25', onPrimary: '#FFF8F2', primaryHover: '#7F3A1A',
      focus: '#B0561F', selection: '#F2D2BC',
      tones: {
        accent: tone('#E3A13A', '#2A1E19', '#F6E3C2', '#6A4300'),
        success: tone('#2C7563', '#FFFFFF', '#D6E9E2', '#1A5345'),
        warning: tone('#965A10', '#FFFFFF', '#F4E2C6', '#6A3F05'),
        danger: tone('#A2302B', '#FFFFFF', '#F3D9D5', '#7A1F1B'),
        info: tone('#3F6287', '#FFFFFF', '#DCE5EE', '#284563'),
      },
      // copper, verdigris, slate, brass, claret, walnut
      categories: {
        c1: tone('#A2522B', '#FFFFFF', '#F2DDD0', '#743515'),
        c2: tone('#2C7563', '#FFFFFF', '#D6E9E2', '#1A5345'),
        c3: tone('#3F6287', '#FFFFFF', '#DCE5EE', '#284563'),
        c4: tone('#86640F', '#FFFFFF', '#F1E5C4', '#5A4205'),
        c5: tone('#8E3550', '#FFFFFF', '#F1DAE1', '#6A2239'),
        c6: tone('#6C4A34', '#FFFFFF', '#E9DFD7', '#4E3322'),
      },
    },
    // Night: walnut panelling under a tungsten lamp. The hero mode.
    dark: {
      bg: '#16100D', surface: '#201814', raised: '#29201B', sunken: '#0F0A08', scrim: 'rgba(5,3,2,0.7)',
      border: '#3A2D26', controlBorder: '#8A776A', borderStrong: '#EADCD0',
      text: '#F2E7DD', muted: '#BBA797',
      primary: '#E79A6C', onPrimary: '#2A1206', primaryHover: '#F2B08A',
      focus: '#F2B266', selection: '#5C3622',
      tones: {
        accent: tone('#F0B355', '#2A1A04', '#3F2C10', '#F7D59B'),
        success: tone('#6CC2A8', '#06231B', '#14332A', '#A9E2D1'),
        warning: tone('#E7A54C', '#2A1802', '#402B10', '#F4CF97'),
        danger: tone('#F08A7E', '#2C0B08', '#45201B', '#F8C0B8'),
        info: tone('#8EB2D8', '#0C1E31', '#1C2E42', '#C3D7EC'),
      },
      categories: {
        c1: tone('#E79A6C', '#2A1206', '#43271A', '#F6CBB0'),
        c2: tone('#6CC2A8', '#06231B', '#14332A', '#A9E2D1'),
        c3: tone('#8EB2D8', '#0C1E31', '#1C2E42', '#C3D7EC'),
        c4: tone('#D9B45A', '#241A02', '#3A2F10', '#EED898'),
        c5: tone('#E08AA5', '#2D0A16', '#43202C', '#F2C3D1'),
        c6: tone('#C6A088', '#24150C', '#3A2B22', '#E6D0C2'),
      },
    },
  },
}
