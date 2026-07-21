import type { PaletteMode, Theme } from '@mui/material'
import { createTheme } from '@mui/material/styles'
// This import includes MUI type extensions via side-effect
import { generateMuiTheme } from '@safe-global/theme'

import templateLightPalette from '@/config/templateLightPalette'
import templateDarkPalette from '@/config/templateDarkPalette'

/**
 * Create Safe-themed MUI theme for the given mode.
 * Uses the unified theme package.
 */
const createSafeTheme = (mode: PaletteMode): Theme => {
  const baseTheme = generateMuiTheme(mode)
  const templatePalette = mode === 'dark' ? templateDarkPalette : templateLightPalette

  if (Object.keys(templatePalette).length === 0) {
    return baseTheme
  }

  return createTheme(baseTheme, { palette: templatePalette })
}

export default createSafeTheme
