// Contract and network addresses for Apex Yield
export const ADDRESSES = {
  // Ethereum Sepolia
  USDC: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238' as const,
  X_RESERVE: '0x008888878f94C0d87defdf0B07f46B93C1934442' as const,

  // Stacks Testnet - Deployed contracts
  // Real Circle USDCx token (bridged from Ethereum via CCTP)
  USDCX_TOKEN: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.usdcx' as const,
  
  // USDCx v1 contract for burn/withdrawal operations
  USDCX_V1: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.usdcx-v1' as const,
  
  // Real vault that uses Circle USDCx
  APEX_VAULT: 'STZ5Q1C2GVSMCWS9NWVDEKHNW04THC75SEGDHS74.apex-vault-real' as const,
  
  // Mock contracts (kept for testing/demo purposes)
  MOCK_USDCX: 'STZ5Q1C2GVSMCWS9NWVDEKHNW04THC75SEGDHS74.mock-usdcx' as const,
  APEX_VAULT_DEMO: 'STZ5Q1C2GVSMCWS9NWVDEKHNW04THC75SEGDHS74.apex-vault' as const,
  
  // Real Circle USDCx (canonical reference)
  REAL_USDCX: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.usdcx' as const,
} as const;

// Domain IDs for Circle xReserve cross-chain messaging
export const STACKS_DOMAIN = 10003;
export const ETHEREUM_DOMAIN = 0;

export const CHAIN_CONFIG = {
  ethereum: {
    chainId: 11155111, // Sepolia
    name: 'Sepolia',
    rpcUrl: 'https://ethereum-sepolia.publicnode.com',
    blockExplorer: 'https://sepolia.etherscan.io',
  },
  stacks: {
    network: 'testnet' as const,
    apiUrl: 'https://api.testnet.hiro.so',
    explorerUrl: 'https://explorer.hiro.so/?chain=testnet',
  },
} as const;

// Vault yield parameters (matching contract)
export const VAULT_PARAMS = {
  YIELD_RATE_BPS: 10, // 10 bps per 100 blocks
  BLOCKS_PER_ACCRUE: 100,
  DECIMALS: 6,
} as const;

// App metadata for wallet connections
export const APP_INFO = {
  name: 'Apex Yield',
  description: 'Cross-chain DeFi yield aggregator for USDCx on Stacks',
  icon: '/apex-logo.svg',
  appUrl: 'https://apex-yield.vercel.app',
} as const;
