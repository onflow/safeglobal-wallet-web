import {
  getSharedUiMigrateUrl,
  getSharedUiWelcomeUrl,
  resolveSharedUiEnvironment,
  resolveSharedUiOrigin,
  SHARED_UI_ORIGINS,
} from '../dataMigration'

describe('dataMigration config', () => {
  describe('resolveSharedUiEnvironment', () => {
    it.each([
      ['app.dev.vana.safe.protofire.io', 'dev'],
      ['safe.dev.example.org', 'dev'],
      ['dev.safe.vana.org', 'dev'],
      ['safe-dev.example.org', 'dev'],
      ['app.stage.vana.safe.protofire.io', 'stage'],
      ['staging.safe.vana.org', 'stage'],
      ['safe-stg.example.org', 'stage'],
      ['stage-safe.example.org', 'stage'],
      ['safe.vana.org', 'prod'],
      ['app.safe.protofire.io', 'prod'],
      ['localhost:3000', 'prod'],
    ])('%s -> %s', (host, expected) => {
      expect(resolveSharedUiEnvironment(host)).toBe(expected)
    })

    it('prefers dev when a host matches both dev and stage patterns', () => {
      expect(resolveSharedUiEnvironment('stage.dev.example.org')).toBe('dev')
    })

    it('does not treat a marker inside another word as an environment', () => {
      expect(resolveSharedUiEnvironment('backstage.example.org')).toBe('prod')
      expect(resolveSharedUiEnvironment('stages.example.org')).toBe('prod')
      expect(resolveSharedUiEnvironment('devices.example.org')).toBe('prod')
      expect(resolveSharedUiEnvironment('safedev.example.org')).toBe('prod')
    })

    it('is case-insensitive', () => {
      expect(resolveSharedUiEnvironment('APP.DEV.EXAMPLE.ORG')).toBe('dev')
      expect(resolveSharedUiEnvironment('STAGING.EXAMPLE.ORG')).toBe('stage')
    })
  })

  describe('resolveSharedUiOrigin', () => {
    it('maps each environment to its shared UI origin', () => {
      expect(resolveSharedUiOrigin('app.dev.example.org')).toBe(SHARED_UI_ORIGINS.dev)
      expect(resolveSharedUiOrigin('staging.example.org')).toBe(SHARED_UI_ORIGINS.stage)
      expect(resolveSharedUiOrigin('safe.example.org')).toBe(SHARED_UI_ORIGINS.prod)
    })
  })

  describe('url builders', () => {
    it('builds the migrate URL with an encoded source', () => {
      expect(getSharedUiMigrateUrl(SHARED_UI_ORIGINS.prod, 'vana')).toBe(
        'https://app.safe.protofire.io/migrate?source=vana',
      )
    })

    it('builds the welcome URL', () => {
      expect(getSharedUiWelcomeUrl(SHARED_UI_ORIGINS.stage)).toBe(
        'https://app.stage.safe.protofire.io/welcome/data-migration',
      )
    })
  })
})
