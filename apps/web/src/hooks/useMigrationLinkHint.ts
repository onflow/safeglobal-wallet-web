import { useCallback } from 'react'
import { useSessionStorage } from '@/services/local-storage/useLocalStorage'

const MIGRATION_LINK_HINT_KEY = 'dataMigrationLinkHint'

/**
 * Lets the closed promo banner nudge the user towards the sidebar link. The banner
 * calls `startHint`, the sidebar plays its animation while `isHinting` and calls
 * `stopHint` when it ends, so the hint only ever plays once per dismissal.
 */
const useMigrationLinkHint = () => {
  const [isHinting = false, setIsHinting] = useSessionStorage<boolean>(MIGRATION_LINK_HINT_KEY)

  const startHint = useCallback(() => setIsHinting(true), [setIsHinting])
  const stopHint = useCallback(() => setIsHinting(false), [setIsHinting])

  return { isHinting, startHint, stopHint }
}

export default useMigrationLinkHint
