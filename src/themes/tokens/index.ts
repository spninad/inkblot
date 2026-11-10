// Vendored from the internal monorepo's `@design/tokens` package
// (design/packages/tokens) so this package is self-contained.
// Do not edit here unless you intend to fork the shared design languages.
export * from './types'
export * from './languages'
export { buildCss, shadowToCss } from './css'
import type { LanguageId, LanguageTokens, Mode, Palette } from './types'
import { languages } from './languages'

export const getTokens = (id: LanguageId): LanguageTokens => languages[id]
export const getPalette = (id: LanguageId, mode: Mode): Palette => languages[id].colors[mode]
export { contrast, luminance } from './contrast'
