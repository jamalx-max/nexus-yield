# Apex Yield

**Cross-chain DeFi Yield Aggregator for USDCx on Stacks**

Built for the [Programming USDCx on Stacks Builder Challenge](https://stacks.org/usdcx-hackathon) (Jan 19-25, 2026)

## Overview

Apex Yield bridges USDC from Ethereum to Stacks via Circle's xReserve (CCTP) and deposits it into a yield-generating vault. Users earn ~3x higher yields compared to traditional Ethereum DeFi protocols like Aave.

### Key Features

- **One-Click Zap**: Bridge USDC from Ethereum and deposit into vault in a single flow
- **Yield-Bearing Shares**: Deposit USDCx, receive apUSDCx that grows in value
- **Cross-Chain Bridge Tracking**: Real-time status updates for CCTP attestations
- **Dual Wallet Support**: Connect both Ethereum (RainbowKit) and Stacks (Stacks Connect) wallets

## Architecture

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   Ethereum      │     │  Circle xReserve │     │     Stacks      │
│   (Sepolia)     │────▶│     (CCTP)       │────▶│    (Testnet)    │
│                 │     │                  │     │                 │
│  USDC ──────────┼─────┼──▶ Attestation ──┼─────┼──▶ USDCx ──────┐│
└─────────────────┘     └──────────────────┘     │                ││
                                                 │  ┌─────────────┐││
                                                 │  │ Apex Vault  │◀┘│
                                                 │  │ (Clarity 4) │  │
                                                 │  │             │  │
                                                 │  │ USDCx ─────▶│──┘
                                                 │  │ apUSDCx ◀───│
                                                 │  └─────────────┘
                                                 └─────────────────┘
```

## Tech Stack

| Layer | Technology |
|-------|------------|
| Smart Contracts | Clarity 4 (Stacks) |
| Frontend | React + Vite + TypeScript |
| Styling | Tailwind CSS + shadcn/ui |
| ETH Wallet | RainbowKit + wagmi |
| STX Wallet | Stacks Connect |
| Testing | Clarinet + Vitest |

## Project Structure

```
ApexYield/
├── contracts/                  # Clarity smart contracts
│   ├── sip-010-trait.clar     # SIP-010 fungible token trait
│   ├── mock-usdcx.clar        # Mock USDCx token for testing
│   └── apex-vault.clar        # Main yield vault
├── tests/                      # Contract tests
│   └── apex-vault.test.ts     # 21 passing tests
├── frontend/                   # React frontend
│   ├── src/
│   │   ├── components/        # UI components
│   │   │   ├── Dashboard.tsx  # Main dashboard
│   │   │   ├── ZapFlow.tsx    # Bridge modal
│   │   │   └── BridgeTracker.tsx
│   │   ├── hooks/             # Custom hooks
│   │   │   ├── useBridge.ts   # Bridge operations
│   │   │   └── useVaultData.ts
│   │   ├── lib/bridge/        # Bridge utilities
│   │   └── providers/         # Wallet providers
│   └── vercel.json
├── deployments/               # Deployment configs
├── DEPLOYMENT.md              # Deployment guide
└── Clarinet.toml              # Clarinet config
```

## Smart Contracts

### Apex Vault (`contracts/apex-vault.clar`)

The vault implements the ERC-4626 tokenized vault standard adapted for Clarity:

- **deposit(amount)**: Accept USDCx, mint apUSDCx shares
- **withdraw(shares)**: Burn shares, return USDCx + yield
- **harvest()**: Trigger yield accrual (10 bps per 100 blocks)

Key Clarity 4 features used:
- `as-contract?` with `(with-ft ...)` for asset allowances
- `current-contract` keyword for contract principal
- `stacks-block-height` for block-based yield calculation

### Yield Mechanism

```clarity
;; 10 basis points (0.1%) per 100 blocks
(define-constant YIELD-RATE-BPS u10)
(define-constant BLOCKS-PER-ACCRUE u100)
```

At ~10 minute block times, this translates to ~13.5% APY.

## Getting Started

### Prerequisites

- Node.js 18+
- Clarinet 3.13+
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/man-croft/ApexYield.git
cd ApexYield

# Install frontend dependencies
cd frontend
npm install

# Run development server
npm run dev
```

### Run Tests

```bash
# In the root directory
npm install
npm test
```

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions on:
- Deploying contracts to Stacks Testnet
- Deploying frontend to Vercel

### Quick Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import your repository
4. Set root directory to `frontend`
5. Deploy

## Bridge Integration

The app integrates with Circle's xReserve for cross-chain USDC transfers:

| Network | Contract |
|---------|----------|
| Ethereum Sepolia | `0x008888878f94C0d87defdf0B07f46B93C1934442` |
| USDC (Sepolia) | `0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238` |
| Stacks Domain ID | `10003` |

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit changes: `git commit -m 'feat: add my feature'`
4. Push to branch: `git push origin feature/my-feature`
5. Open a Pull Request

## License

MIT

## Links

- **Repository**: https://github.com/man-croft/ApexYield
- **Hackathon**: https://stacks.org/usdcx-hackathon
- **Circle xReserve**: https://developers.circle.com/stablecoins/docs/cctp-getting-started
