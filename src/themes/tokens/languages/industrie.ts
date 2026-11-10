import type { LanguageTokens } from '../types'
import { tone } from '../util'

/**
 * Industrie — engineered precision. Hairlines, tabular data, monochrome with a transit-line colour set used
 * sparingly as identity. Loosely informed by wayfinding systems; closer in temperament to Vercel's Geist than to a station sign.
 * Mono face is Paper Mono (a local font file in the showcase; Geist Mono is the fallback).
 */
export const industrie: LanguageTokens = {
  id: 'industrie',
  name: 'Industrie',
  tagline: 'Engineered precision. Hairlines, tabular data, one line colour at a time.',
  fonts: {
    sans: { family: 'Inter Variable', stack: "'Inter Variable', 'Inter', system-ui, sans-serif" },
    display: { family: 'Inter Variable', stack: "'Inter Variable', 'Inter', system-ui, sans-serif" },
    serif: { family: 'Inter Variable', stack: "'Inter Variable', 'Inter', system-ui, sans-serif" },
    mono: { family: 'Paper Mono', stack: "'Paper Mono', 'Geist Mono Variable', 'Geist Mono', ui-monospace, monospace" },
    hand: { family: 'Inter Variable', stack: "'Inter Variable', system-ui, sans-serif" },
  },
  nativeFonts: {
    sans: { 400: 'Inter_400Regular', 500: 'Inter_500Medium', 600: 'Inter_600SemiBold', 700: 'Inter_700Bold' },
    display: { 400: 'Inter_400Regular', 500: 'Inter_500Medium', 600: 'Inter_600SemiBold', 700: 'Inter_700Bold' },
    serif: { 400: 'Inter_400Regular', 500: 'Inter_500Medium', 600: 'Inter_600SemiBold', 700: 'Inter_700Bold' },
    mono: { 400: 'PaperMono_400Regular', 500: 'PaperMono_500Medium', 600: 'PaperMono_600SemiBold', 700: 'PaperMono_700Bold' },
    hand: { 400: 'Inter_400Regular', 500: 'Inter_500Medium', 600: 'Inter_600SemiBold', 700: 'Inter_700Bold' },
  },
  type: {
    display: { font: 'display', size: 52, line: 52, weight: 600, tracking: -0.045 },
    h1: { font: 'display', size: 32, line: 36, weight: 600, tracking: -0.035 },
    h2: { font: 'display', size: 22, line: 28, weight: 600, tracking: -0.025 },
    h3: { font: 'sans', size: 16, line: 22, weight: 600, tracking: -0.015 },
    bodyLg: { font: 'sans', size: 16, line: 26, weight: 400, tracking: -0.01 },
    body: { font: 'sans', size: 14, line: 22, weight: 400, tracking: -0.006 },
    bodySm: { font: 'sans', size: 13, line: 20, weight: 400, tracking: -0.003 },
    label: { font: 'sans', size: 13, line: 16, weight: 500, tracking: -0.003 },
    caption: { font: 'sans', size: 12, line: 16, weight: 500, tracking: 0 },
    mono: { font: 'mono', size: 13, line: 20, weight: 400, tracking: -0.01 },
    note: { font: 'mono', size: 12, line: 16, weight: 400, tracking: 0 },
  },
  space: [0, 2, 4, 8, 12, 16, 20, 24, 32, 40, 56, 80],
  control: { sm: 28, md: 36, lg: 44 },
  radius: { control: 6, card: 8, sheet: 12, chip: 999, bullet: 999 },
  border: { hairline: 1, control: 1, strong: 1 },
  focus: { width: 2, offset: 2 },
  motion: {
    fast: 90, base: 150, slow: 240,
    ease: 'cubic-bezier(0.2, 0, 0, 1)', enter: 'cubic-bezier(0.1, 0.9, 0.2, 1)', exit: 'cubic-bezier(0.4, 0, 1, 1)',
    spring: 'cubic-bezier(0.2, 0, 0, 1)', // no overshoot: precision instruments do not bounce
  },
  icon: { stroke: 1.75, cap: 'round', size: { sm: 16, md: 18, lg: 24 } },
  elevation: {
    light: {
      0: [],
      1: [{ x: 0, y: 0, blur: 0, spread: 1, color: 'rgba(0,0,0,0.08)' }, { x: 0, y: 1, blur: 2, spread: 0, color: 'rgba(0,0,0,0.04)' }],
      2: [{ x: 0, y: 0, blur: 0, spread: 1, color: 'rgba(0,0,0,0.08)' }, { x: 0, y: 4, blur: 8, spread: -2, color: 'rgba(0,0,0,0.06)' }, { x: 0, y: 12, blur: 24, spread: -6, color: 'rgba(0,0,0,0.10)' }],
      3: [{ x: 0, y: 0, blur: 0, spread: 1, color: 'rgba(0,0,0,0.08)' }, { x: 0, y: 8, blur: 16, spread: -4, color: 'rgba(0,0,0,0.08)' }, { x: 0, y: 32, blur: 64, spread: -16, color: 'rgba(0,0,0,0.22)' }],
    },
    dark: {
      0: [],
      1: [{ x: 0, y: 0, blur: 0, spread: 1, color: 'rgba(255,255,255,0.10)' }],
      2: [{ x: 0, y: 0, blur: 0, spread: 1, color: 'rgba(255,255,255,0.12)' }, { x: 0, y: 12, blur: 24, spread: -6, color: 'rgba(0,0,0,0.6)' }],
      3: [{ x: 0, y: 0, blur: 0, spread: 1, color: 'rgba(255,255,255,0.14)' }, { x: 0, y: 32, blur: 64, spread: -16, color: 'rgba(0,0,0,0.8)' }],
    },
  },
  colors: {
    light: {
      bg: '#FAFAFA', surface: '#FFFFFF', raised: '#FFFFFF', sunken: '#F2F2F2', scrim: 'rgba(0,0,0,0.5)',
      border: '#E5E5E5', controlBorder: '#8F8F8F', borderStrong: '#171717',
      text: '#171717', muted: '#666666',
      primary: '#171717', onPrimary: '#FFFFFF', primaryHover: '#3D3D3D',
      focus: '#0A68D9', selection: '#CFE3FB',
      tones: {
        accent: tone('#0A68D9', '#FFFFFF', '#E6F1FE', '#0B4FA6'),
        success: tone('#107C41', '#FFFFFF', '#E3F5EA', '#0A5A2F'),
        warning: tone('#F5A524', '#171717', '#FFF1D6', '#7A4A00'),
        danger: tone('#D93036', '#FFFFFF', '#FDE8E9', '#9B1B20'),
        info: tone('#0A68D9', '#FFFFFF', '#E6F1FE', '#0B4FA6'),
      },
      // Transit-line hues, desaturated for UI. c1 red, c2 green, c3 blue, c4 orange, c5 yellow, c6 purple.
      categories: {
        c1: tone('#D93036', '#FFFFFF', '#FDE8E9', '#9B1B20'),
        c2: tone('#107C41', '#FFFFFF', '#E3F5EA', '#0A5A2F'),
        c3: tone('#0A68D9', '#FFFFFF', '#E6F1FE', '#0B4FA6'),
        c4: tone('#C2410C', '#FFFFFF', '#FFEBDD', '#8A2D05'),
        c5: tone('#EAB308', '#171717', '#FEF6CC', '#6B4E00'),
        c6: tone('#8A3FC7', '#FFFFFF', '#F3E8FC', '#5E2A8C'),
      },
    },
    dark: {
      bg: '#0A0A0A', surface: '#111111', raised: '#171717', sunken: '#000000', scrim: 'rgba(0,0,0,0.7)',
      border: '#2B2B2B', controlBorder: '#7A7A7A', borderStrong: '#EDEDED',
      text: '#EDEDED', muted: '#A1A1A1',
      primary: '#EDEDED', onPrimary: '#0A0A0A', primaryHover: '#FFFFFF',
      focus: '#52A8FF', selection: '#17407A',
      tones: {
        accent: tone('#52A8FF', '#04111F', '#0F2744', '#B0D5FF'),
        success: tone('#46C37B', '#04180D', '#0C2E1B', '#A4EBC3'),
        warning: tone('#F5A524', '#171717', '#33250A', '#FFD58C'),
        danger: tone('#FF6166', '#1F0405', '#3B1214', '#FFB9BB'),
        info: tone('#52A8FF', '#04111F', '#0F2744', '#B0D5FF'),
      },
      categories: {
        c1: tone('#FF6166', '#1F0405', '#3B1214', '#FFB9BB'),
        c2: tone('#46C37B', '#04180D', '#0C2E1B', '#A4EBC3'),
        c3: tone('#52A8FF', '#04111F', '#0F2744', '#B0D5FF'),
        c4: tone('#FF8A4C', '#210C00', '#3D1C08', '#FFC9A6'),
        c5: tone('#EAB308', '#171717', '#332A05', '#FDE68A'),
        c6: tone('#B77AE8', '#170625', '#2D1745', '#E0C4F7'),
      },
    },
  },
}

/** Route glyphs for RouteBullet — an optional identity mark, borrowed loosely from transit. Circles only by default. */
export const industrieLines: { id: string; group: 'c1' | 'c2' | 'c3' | 'c4' | 'c5' | 'c6' }[] = [
  { id: '1', group: 'c1' }, { id: '2', group: 'c1' }, { id: '3', group: 'c1' },
  { id: '4', group: 'c2' }, { id: '5', group: 'c2' }, { id: '6', group: 'c2' },
  { id: 'A', group: 'c3' }, { id: 'C', group: 'c3' }, { id: 'E', group: 'c3' }, { id: 'W', group: 'c3' },
  { id: 'B', group: 'c4' }, { id: 'D', group: 'c4' }, { id: 'F', group: 'c4' }, { id: 'M', group: 'c4' },
  { id: 'N', group: 'c5' }, { id: 'Q', group: 'c5' }, { id: 'R', group: 'c5' },
  { id: '7', group: 'c6' },
]
