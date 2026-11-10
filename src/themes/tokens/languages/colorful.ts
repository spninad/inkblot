import type { LanguageTokens } from '../types'
import { tone } from '../util'
import { modern } from './modern'

/**
 * Colorful — Modern's structure, with colour promoted from accent to organising principle.
 * Every category owns a hue; hue marks identity (who/what), never decoration.
 */
export const colorful: LanguageTokens = {
  ...modern,
  id: 'colorful',
  name: 'Colorful',
  tagline: 'Modern with a point of view. Every thing owns a colour.',
  fonts: modern.fonts,
  nativeFonts: modern.nativeFonts,
  type: {
    ...modern.type,
    display: { font: 'display', size: 60, line: 58, weight: 700, tracking: -0.04 },
    h1: { font: 'display', size: 38, line: 40, weight: 700, tracking: -0.033 },
    h2: { font: 'display', size: 26, line: 30, weight: 700, tracking: -0.025 },
    h3: { font: 'display', size: 19, line: 24, weight: 700, tracking: -0.015 },
    label: { font: 'sans', size: 14, line: 18, weight: 700, tracking: -0.003 },
  },
  control: { sm: 36, md: 46, lg: 58 },
  radius: { control: 16, card: 28, sheet: 36, chip: 999, bullet: 999 },
  motion: {
    fast: 140, base: 240, slow: 380,
    ease: 'cubic-bezier(0.32, 0.72, 0, 1)', enter: 'cubic-bezier(0.16, 1, 0.3, 1)', exit: 'cubic-bezier(0.4, 0, 1, 1)',
    spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  },
  icon: { stroke: 2, cap: 'round', size: { sm: 16, md: 20, lg: 28 } },
  elevation: {
    light: {
      0: [],
      1: [{ x: 0, y: 1, blur: 0, spread: 0, color: 'rgba(40,30,120,0.06)' }, { x: 0, y: 6, blur: 14, spread: -6, color: 'rgba(40,30,120,0.16)' }],
      2: [{ x: 0, y: 12, blur: 28, spread: -10, color: 'rgba(40,30,120,0.28)' }],
      3: [{ x: 0, y: 28, blur: 64, spread: -16, color: 'rgba(40,30,120,0.42)' }],
    },
    dark: {
      0: [],
      1: [{ x: 0, y: 0, blur: 0, spread: 1, color: 'rgba(160,150,255,0.14)' }],
      2: [{ x: 0, y: 14, blur: 32, spread: -10, color: 'rgba(0,0,0,0.6)' }],
      3: [{ x: 0, y: 32, blur: 72, spread: -14, color: 'rgba(0,0,0,0.75)' }],
    },
  },
  colors: {
    light: {
      bg: '#F6F5FF', surface: '#FFFFFF', raised: '#FFFFFF', sunken: '#ECEAFB', scrim: 'rgba(28,27,51,0.5)',
      border: '#DCD9F3', controlBorder: '#7F7BB0', borderStrong: '#1C1B33',
      text: '#1C1B33', muted: '#55537A',
      primary: '#4338FF', onPrimary: '#FFFFFF', primaryHover: '#3126E0',
      focus: '#4338FF', selection: '#D9D4FF',
      tones: {
        accent: tone('#FFC21A', '#1C1B33', '#FFF0BC', '#5B4300'),
        success: tone('#12B07C', '#06251B', '#CFF5E6', '#04593C'),
        warning: tone('#FF9A1F', '#1C1B33', '#FFE8C7', '#6B3F00'),
        danger: tone('#D42650', '#FFFFFF', '#FFDCE5', '#8F1236'),
        info: tone('#156BC4', '#FFFFFF', '#D6EAFF', '#0A4A8F'),
      },
      // Tangerine, sun, mint, sky, lilac, rose
      categories: {
        c1: tone('#FF6B2C', '#1C1B33', '#FFE3D3', '#7A2A00'),
        c2: tone('#FFC21A', '#1C1B33', '#FFF0BC', '#5B4300'),
        c3: tone('#19C58B', '#1C1B33', '#CFF5E6', '#035A3E'),
        c4: tone('#2BA7FF', '#1C1B33', '#D3ECFF', '#05446F'),
        c5: tone('#8F7BFF', '#1C1B33', '#E4DEFF', '#3A2A99'),
        c6: tone('#FF5C9A', '#1C1B33', '#FFD9E8', '#7A0B3B'),
      },
    },
    dark: {
      bg: '#11102A', surface: '#1B1A3B', raised: '#25244B', sunken: '#0B0A1E', scrim: 'rgba(5,4,20,0.7)',
      border: '#34336A', controlBorder: '#8886D0', borderStrong: '#F3F2FF',
      text: '#F3F2FF', muted: '#B2B0DE',
      primary: '#9A93FF', onPrimary: '#0F0D33', primaryHover: '#B3AEFF',
      focus: '#FFC21A', selection: '#4A43A8',
      tones: {
        accent: tone('#FFC21A', '#1C1B33', '#4A3A0A', '#FFE48A'),
        success: tone('#2FD6A0', '#04281C', '#0F4A3A', '#9CF0D2'),
        warning: tone('#FFA63D', '#2E1A00', '#4E3310', '#FFD59C'),
        danger: tone('#FF6B8A', '#2E0612', '#55182E', '#FFBCCB'),
        info: tone('#58B2FF', '#041E36', '#12395E', '#B4DBFF'),
      },
      categories: {
        c1: tone('#FF8447', '#2B1000', '#58290F', '#FFC7A5'),
        c2: tone('#FFC21A', '#2A1F00', '#4A3A0A', '#FFE48A'),
        c3: tone('#2FD6A0', '#04281C', '#0F4A3A', '#9CF0D2'),
        c4: tone('#58B2FF', '#041E36', '#12395E', '#B4DBFF'),
        c5: tone('#A898FF', '#150C45', '#322A78', '#D6CEFF'),
        c6: tone('#FF7FB0', '#35091B', '#5E1D3F', '#FFC4DB'),
      },
    },
  },
}
