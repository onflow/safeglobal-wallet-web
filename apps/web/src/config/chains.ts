import { networks } from '@safe-global/protocol-kit/dist/src/utils/eip-3770/config'

/**
 * A static shortName<->chainId dictionary
 * E.g.:
 *
 * {
 *   eth: '1',
 *   gor: '5',
 *   ...
 * }
 */
const chains = networks.reduce<Record<string, string>>((result, { shortName, chainId }) => {
  result[shortName] = chainId.toString()
  return result
}, {}) as {
  boba: string
  'flow-testnet': string
  'flow-mainnet': string
  [key: string]: string
}

export default chains
