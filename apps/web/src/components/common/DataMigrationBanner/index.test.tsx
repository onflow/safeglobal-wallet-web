import { render, screen, fireEvent, waitFor } from '@/tests/test-utils'
import { renderHook, act } from '@testing-library/react'
import { useSessionStorage } from '@/services/local-storage/useLocalStorage'
import session from '@/services/local-storage/session'
import DataMigrationBanner from './index'
import * as useChains from '@/hooks/useChains'
import { FEATURES } from '@safe-global/utils/utils/chains'
import { chainBuilder } from '@/tests/builders/chains'
import * as useSafeAddress from '@/hooks/useSafeAddress'
import * as encode from '@/services/dataMigration/encodeMigrationPayload'
import { AppRoutes } from '@/config/routes'
import * as nextRouter from 'next/router'
import { faker } from '@faker-js/faker'

const mockRouter = (pathname: string) =>
  jest.spyOn(nextRouter, 'useRouter').mockReturnValue({ pathname, query: {} } as never)

const safeAddress = faker.finance.ethereumAddress()

const mockFeatures = (enabled: FEATURES[]) =>
  jest.spyOn(useChains, 'useHasFeature').mockImplementation((feature) => enabled.includes(feature))

describe('DataMigrationBanner', () => {
  beforeEach(() => {
    window.sessionStorage.clear()
    // The storage hook keeps an in-memory cache per key, so reset it between tests too
    ;['dataMigrationBannerDismissed', 'dataMigrationLinkHint'].forEach((key) => {
      const { result } = renderHook(() => useSessionStorage<boolean>(key))
      act(() => result.current[1](false))
    })
    window.sessionStorage.clear()
    mockFeatures([FEATURES.DATA_MIGRATION_PROMO])
    mockRouter(AppRoutes.home)
    jest.spyOn(useSafeAddress, 'default').mockReturnValue(safeAddress)
    jest.spyOn(useChains, 'useCurrentChain').mockReturnValue(chainBuilder().with({ shortName: 'vana' }).build())
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('renders the banner when the feature is enabled', async () => {
    render(<DataMigrationBanner />)

    expect(await screen.findByTestId('data-migration-cta')).toBeInTheDocument()
  })

  it('hides the banner once the close button is clicked', async () => {
    render(<DataMigrationBanner />)

    fireEvent.click(await screen.findByRole('button', { name: 'Close' }))

    await waitFor(() => expect(screen.queryByTestId('data-migration-cta')).not.toBeInTheDocument())
  })

  it('triggers the sidebar link hint when closed', async () => {
    render(<DataMigrationBanner />)

    expect(session.getItem('dataMigrationLinkHint')).toBeNull()

    fireEvent.click(await screen.findByRole('button', { name: 'Close' }))

    await waitFor(() => expect(session.getItem('dataMigrationLinkHint')).toBe(true))
  })

  it('does not render a close button when the non-dismissible feature is enabled', async () => {
    mockFeatures([FEATURES.DATA_MIGRATION_PROMO, FEATURES.DATA_MIGRATION_PROMO_NON_DISMISSIBLE])

    render(<DataMigrationBanner />)

    expect(await screen.findByTestId('data-migration-cta')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Close' })).not.toBeInTheDocument()
  })

  it('ignores the non-dismissible feature when the promo feature is disabled', () => {
    mockFeatures([FEATURES.DATA_MIGRATION_PROMO_NON_DISMISSIBLE])

    render(<DataMigrationBanner />)

    expect(screen.queryByTestId('data-migration-cta')).not.toBeInTheDocument()
  })

  it('renders nothing when the feature is disabled', () => {
    mockFeatures([])

    render(<DataMigrationBanner />)

    expect(screen.queryByTestId('data-migration-cta')).not.toBeInTheDocument()
  })

  it('renders nothing outside the dashboard', () => {
    mockRouter(AppRoutes.welcome.accounts)

    render(<DataMigrationBanner />)

    expect(screen.queryByTestId('data-migration-cta')).not.toBeInTheDocument()
  })

  it('renders nothing on the dashboard when no safe is open', () => {
    jest.spyOn(useSafeAddress, 'default').mockReturnValue('')

    render(<DataMigrationBanner />)

    expect(screen.queryByTestId('data-migration-cta')).not.toBeInTheDocument()
  })

  it('opens the same safe on the shared UI when there is no data to migrate', async () => {
    jest
      .spyOn(encode, 'collectMigrationPayload')
      .mockReturnValue({ addressBook: {}, addedSafes: {}, undeployedSafes: {}, visitedSafes: {}, safeApps: {} })
    const encodeSpy = jest.spyOn(encode, 'encodeMigrationPayload')
    const location = { href: '' }
    Object.defineProperty(window, 'location', { value: location, writable: true })

    render(<DataMigrationBanner />)
    fireEvent.click(await screen.findByTestId('data-migration-cta'))

    await waitFor(() => expect(location.href).toContain(`/home?safe=vana:${safeAddress}`))
    expect(location.href).not.toContain('/migrate')
    expect(encodeSpy).not.toHaveBeenCalled()
  })
})

describe('hasMigrationData', () => {
  it('ignores settings and empty slices', () => {
    expect(encode.hasMigrationData({ settings: { a: 1 }, addressBook: {}, addedSafes: {} })).toBe(false)
  })

  it('detects any non-empty slice', () => {
    expect(encode.hasMigrationData({ addedSafes: { '1': {} } })).toBe(true)
  })
})
