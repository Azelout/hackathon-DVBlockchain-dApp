// We automatically create/update .env.local with the deployed package ID after deployment.
export const CONTRACT_PACKAGE_ID_NOT_DEFINED = '0xNOTDEFINED'
export const LOCALNET_CONTRACT_PACKAGE_ID =
  import.meta.env.VITE_LOCALNET_CONTRACT_PACKAGE_ID ||
  CONTRACT_PACKAGE_ID_NOT_DEFINED
export const DEVNET_CONTRACT_PACKAGE_ID =
  import.meta.env.VITE_DEVNET_CONTRACT_PACKAGE_ID ||
  CONTRACT_PACKAGE_ID_NOT_DEFINED
export const TESTNET_CONTRACT_PACKAGE_ID = '0x4ccb4d8f0433787f8d1f7c967c5a1650d51dc41660fbee5a8aa7ca6581bc44a8'
export const MAINNET_CONTRACT_PACKAGE_ID =
  import.meta.env.VITE_MAINNET_CONTRACT_PACKAGE_ID ||
  CONTRACT_PACKAGE_ID_NOT_DEFINED

export const LOCALNET_EXPLORER_URL = 'http://localhost:9001'
export const DEVNET_EXPLORER_URL = 'https://devnet.suivision.xyz'
export const TESTNET_EXPLORER_URL = 'https://testnet.suivision.xyz'
export const MAINNET_EXPLORER_URL = 'https://suivision.xyz'

export const CONTRACT_PACKAGE_VARIABLE_NAME = 'contractPackageId'

export const EXPLORER_URL_VARIABLE_NAME = 'explorerUrl'

export const NETWORKS_WITH_FAUCET = ['localnet', 'devnet', 'testnet']
