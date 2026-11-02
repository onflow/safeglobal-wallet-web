import type { ReactElement } from 'react'
import { Typography, Button } from '@mui/material'
import classnames from 'classnames'
import ErrorMessage from '@/components/tx/ErrorMessage'
import { useCurrentChain, useHasFeature } from '@/hooks/useChains'
import { FEATURES } from '@safe-global/utils/utils/chains'
import { DATA_MIGRATION_BANNER, getSharedUiMigrateUrl, getSharedUiSafeUrl } from '@/config/dataMigration'
import {
  collectMigrationPayload,
  encodeMigrationPayload,
  hasMigrationData,
} from '@/services/dataMigration/encodeMigrationPayload'
import { useRouter } from 'next/router'
import { AppRoutes } from '@/config/routes'
import useSafeAddress from '@/hooks/useSafeAddress'
import useSharedUiOrigin from '@/hooks/useSharedUiOrigin'
import useMigrationLinkHint from '@/hooks/useMigrationLinkHint'
import { useSessionStorage } from '@/services/local-storage/useLocalStorage'
import StarRoundedIcon from '@mui/icons-material/StarRounded'
import css from './style.module.css'

const DATA_MIGRATION_BANNER_DISMISSED_KEY = 'dataMigrationBannerDismissed'

const DataMigrationBanner = ({ className }: { className?: string }): ReactElement | null => {
  const chain = useCurrentChain()
  const isDataMigrationPromoEnabled = useHasFeature(FEATURES.DATA_MIGRATION_PROMO)
  const isNonDismissible = useHasFeature(FEATURES.DATA_MIGRATION_PROMO_NON_DISMISSIBLE)
  // This branch only ever ships to dedicated deployments (the shared UI has its own
  // branches), so the chain's DATA_MIGRATION_PROMO flag is the single on/off switch.
  const sharedUiOrigin = useSharedUiOrigin()
  const [isDismissed, setIsDismissed] = useSessionStorage<boolean>(DATA_MIGRATION_BANNER_DISMISSED_KEY)
  const { startHint } = useMigrationLinkHint()
  const router = useRouter()
  const safeAddress = useSafeAddress()

  const handleClose = () => {
    setIsDismissed(true)
    startHint()
  }

  const isDashboardWithSafe = router.pathname === AppRoutes.home && !!safeAddress

  if (
    !isDashboardWithSafe ||
    (!isNonDismissible && isDismissed) ||
    !isDataMigrationPromoEnabled ||
    !chain?.shortName ||
    !sharedUiOrigin
  )
    return null

  const handleMigrate = async () => {
    const migrateUrl = getSharedUiMigrateUrl(sharedUiOrigin, chain.shortName)
    const payload = collectMigrationPayload()

    if (!hasMigrationData(payload)) {
      window.location.href = getSharedUiSafeUrl(sharedUiOrigin, chain.shortName, safeAddress)
      return
    }

    try {
      // The payload travels as a URL fragment - never sent to the server, and readable by
      // the shared UI regardless of origin, so no iframe/postMessage bridge is needed.
      const encoded = await encodeMigrationPayload(payload)
      window.location.href = `${migrateUrl}#${encoded}`
    } catch (error) {
      // Falls back to the shared UI's own "couldn't read your data" state, which points
      // the user to a manual export/import instead.
      console.error('Failed to encode migration payload', error)
      window.location.href = migrateUrl
    }
  }

  return (
    <div className={classnames(css.wrapper, className)}>
      <ErrorMessage
        level="info"
        title={DATA_MIGRATION_BANNER.title}
        icon={StarRoundedIcon}
        onClose={isNonDismissible ? undefined : handleClose}
      >
        <Typography variant="body2" mb={1}>
          {DATA_MIGRATION_BANNER.description}
        </Typography>
        <Button data-testid="data-migration-cta" variant="contained" size="small" onClick={handleMigrate}>
          {DATA_MIGRATION_BANNER.cta}
        </Button>
      </ErrorMessage>
    </div>
  )
}

export default DataMigrationBanner
