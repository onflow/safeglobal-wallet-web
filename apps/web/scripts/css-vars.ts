/**
 * Script to generate CSS variables file from the unified theme package.
 * Run with: yarn css-vars
 */
import { generateCSSVars, type PaletteOverride } from '../../../packages/theme/src/generators/css-vars'
import templateLightPalette from '../src/config/templateLightPalette'
import templateDarkPalette from '../src/config/templateDarkPalette'

const css = generateCSSVars({
  light: templateLightPalette as unknown as PaletteOverride,
  dark: templateDarkPalette as unknown as PaletteOverride,
})
console.log(css)
