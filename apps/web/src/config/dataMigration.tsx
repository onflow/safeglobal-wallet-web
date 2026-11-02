/**
 * Shared UI origins, one per environment. The dedicated deployment that renders the
 * promo banner picks the one matching its own host (see resolveSharedUiOrigin) so a
 * dev build points to the dev shared UI, a staging build to staging, and anything else
 * to production - no per-environment code change or env var needed.
 */
export const SHARED_UI_ORIGINS = {
  dev: 'https://app.dev.safe.protofire.io',
  stage: 'https://app.stage.safe.protofire.io',
  prod: 'https://app.safe.protofire.io',
} as const

export type SharedUiEnvironment = keyof typeof SHARED_UI_ORIGINS

// Match the marker as its own host segment (`dev.safe.example.org`, `app.dev.example.org`,
// `safe-stg.example.org`) but not inside another word (`backstage.`, `devices.`).
const DEV_HOST_RE = /(^|[.-])dev([.-]|$)/i
const STAGE_HOST_RE = /(^|[.-])(stage|staging|stg)([.-]|$)/i

/**
 * Maps the current host of this (dedicated) deployment to the shared UI environment it
 * should hand users over to. Pure, so it can be unit-tested without a DOM.
 */
export const resolveSharedUiEnvironment = (host: string): SharedUiEnvironment => {
  if (DEV_HOST_RE.test(host)) return 'dev'
  if (STAGE_HOST_RE.test(host)) return 'stage'
  return 'prod'
}

export const resolveSharedUiOrigin = (host: string): string => SHARED_UI_ORIGINS[resolveSharedUiEnvironment(host)]

/**
 * Where the promo banner CTA redirects to, carrying the encoded payload as a URL fragment.
 * `source` is the chain's `shortName` from the config service (e.g. `vana`, `sei`), which
 * the shared UI validates against its own MIGRATION_SOURCE_ORIGINS allowlist to pick
 * per-deployment branding and the manual-fallback link - never a raw domain.
 */
export const getSharedUiMigrateUrl = (origin: string, source: string): string =>
  `${origin}/migrate?source=${encodeURIComponent(source)}`

/**
 * Opens the same Safe (`chain:address`) on the shared UI, used when there is no local data to migrate.
 */
export const getSharedUiSafeUrl = (origin: string, shortName: string, safeAddress: string): string =>
  `${origin}/home?safe=${encodeURIComponent(shortName)}:${safeAddress}`

export const getSharedUiWelcomeUrl = (origin: string): string => `${origin}/welcome/data-migration`

/**
 * Promo banner copy, shared by every dedicated deployment. Which chains show the banner
 * is decided purely by the DATA_MIGRATION_PROMO feature flag in the chain config, so
 * onboarding a new network needs no code change here - only the flag on the config
 * service and a matching `shortName` entry in the shared UI's allowlist.
 */
export const DATA_MIGRATION_BANNER = {
  title: 'Try Protofire Multisig - multichain UI to manage Safes across 80+ chains.',
  description: (
    <>
      Your Safes and transaction history are already there.
      <br />
      Just sync your local data (address book, settings and added Safes) to replicate the full experience.
    </>
  ),
  cta: 'Sync my data in one click',
}
