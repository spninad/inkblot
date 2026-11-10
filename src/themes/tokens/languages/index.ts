import type { LanguageId, LanguageTokens } from '../types'
import { industrie } from './industrie'
import { cozy } from './cozy'
import { modern } from './modern'
import { colorful } from './colorful'
import { glass } from './glass'
import { paper } from './paper'
import { journal } from './journal'
export { industrie, cozy, modern, colorful, glass, paper, journal }
export { industrieLines } from './industrie'
export const languages: Record<LanguageId, LanguageTokens> = { industrie, cozy, modern, colorful, glass, paper, journal }
