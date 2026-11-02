import { keyframes } from '@mui/material/styles'
import type { SxProps, Theme } from '@mui/material'

// Inset shadow instead of a border so the pulse never takes up layout space.
const pulseBorder = keyframes`
  0%, 100% { box-shadow: inset 0 0 0 0 var(--color-success-main); }
  50% {
    box-shadow:
      inset 0 0 0 4px var(--color-success-main),
      inset 0 0 15px color-mix(in srgb, var(--color-success-main) 55%, transparent);
  }
`

export const migrationLinkHintSx: SxProps<Theme> = {
  borderRadius: '6px',
  animation: `${pulseBorder} 0.6s ease-in-out 0.5s 5`,
}
