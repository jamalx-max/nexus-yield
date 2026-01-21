# Apex Yield Deployment Guide

## Prerequisites

1. **Stacks CLI** installed: `npm install -g @stacks/cli`
2. **Clarinet** installed: `brew install clarinet` or `cargo install clarinet`
3. **Funded testnet wallet** - Get testnet STX from the [Stacks faucet](https://explorer.hiro.so/sandbox/faucet?chain=testnet)

## Contract Deployment to Stacks Testnet

### Step 1: Generate a Deployment Wallet

```bash
# Generate a new testnet wallet
stx make_keychain -t

# Output looks like:
# {
#   "mnemonic": "...",
#   "keyInfo": {
#     "privateKey": "...",
#     "address": "ST...",
#     "btcAddress": "...",
#     "index": 0
#   }
# }

# Save your private key securely
```

### Step 2: Fund the Wallet

1. Go to https://explorer.hiro.so/sandbox/faucet?chain=testnet
2. Request testnet STX to your address
3. Wait for confirmation (~10 minutes)

### Step 3: Deploy Contracts

```bash
# Set your private key
export DEPLOYER_KEY="your-private-key-here"

# Deploy using Clarinet (recommended)
clarinet deployment apply -p deployments/default.testnet-plan.yaml --no-dashboard

# Or deploy manually with stx CLI:
stx deploy_contract contracts/sip-010-trait.clar sip-010-trait 2000 $DEPLOYER_KEY -t
stx deploy_contract contracts/mock-usdcx.clar mock-usdcx 2000 $DEPLOYER_KEY -t
stx deploy_contract contracts/apex-vault.clar apex-vault 2000 $DEPLOYER_KEY -t
```

### Step 4: Update Frontend Constants

After deployment, update `frontend/src/config/constants.ts` with your deployed addresses:

```typescript
export const ADDRESSES = {
  // Stacks Testnet - Update with your deployed addresses
  USDCX_TOKEN: 'STYOUR_ADDRESS.usdcx' as const,
  APEX_VAULT: 'STYOUR_ADDRESS.apex-vault' as const,
  MOCK_USDCX: 'STYOUR_ADDRESS.mock-usdcx' as const,
  
  // Ethereum Sepolia (these remain the same)
  USDC: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238' as const,
  X_RESERVE: '0x008888878f94C0d87defdf0B07f46B93C1934442' as const,
} as const;
```

## Frontend Deployment to Vercel

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2: Deploy

```bash
cd frontend
vercel

# Follow the prompts:
# - Link to existing project or create new
# - Framework: Vite
# - Build command: npm run build
# - Output directory: dist
```

### Step 3: Set Environment Variables (Optional)

In the Vercel dashboard, set any required environment variables:
- `VITE_WALLETCONNECT_PROJECT_ID` - From WalletConnect Cloud

### Automatic Deployments

Connect your GitHub repo to Vercel for automatic deployments on push to main.

## Verification

1. **Verify contracts on explorer**: https://explorer.hiro.so/?chain=testnet
2. **Test the frontend**: Visit your Vercel deployment URL
3. **Test the bridge flow**:
   - Connect Ethereum wallet (Sepolia)
   - Connect Stacks wallet (Testnet)
   - Try the ZapFlow with small amounts

## Circle xReserve Bridge Testing

For testing the actual bridge:

1. Get Sepolia USDC from a faucet
2. Approve USDC spending for xReserve
3. Call `depositToRemote` on xReserve
4. Wait for Circle attestation (~10-15 mins)
5. USDCx will be minted on Stacks

## Troubleshooting

### Contract Deployment Fails
- Ensure you have enough STX for gas
- Check contract syntax with `clarinet check`
- Verify network connectivity

### Bridge Transaction Stuck
- CCTP attestations take 10-15 minutes
- Check Ethereum transaction on Etherscan
- Verify hook data format is correct

### Frontend Not Loading Data
- Check browser console for errors
- Verify contract addresses are correct
- Ensure Stacks API is accessible
