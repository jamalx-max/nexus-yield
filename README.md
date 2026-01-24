# Apex Yield

**The Arbitrage Engine Connecting Ethereum Capital to Bitcoin-Secured Yield.**

Apex Yield is a cross-chain structured finance protocol built on Stacks. It automates the arbitrage between saturated Ethereum stablecoin markets (~4% APY) and the emerging high-yield opportunities on Bitcoin L2s (~13.5% APY).

![Apex Yield Terminal](https://via.placeholder.com/1200x600?text=Apex+Yield+Dashboard)

## ⚡ The Thesis

The crypto interest rate market displays a massive inefficiency:
*   **Ethereum (Oversupply):** ~$25B+ of USDC sits on Ethereum earning ~4-5% (Aave/Compound). Capital is abundant and lazy.
*   **Stacks (Undersupply):** The Bitcoin L2 ecosystem is starved for stablecoin liquidity. Traders borrowing against BTC/STX pay premiums of **12-15%+**.

Apex Yield acts as an **Asset Manager**, routing liquidity to where it is treated best.

## 🏗 Architecture & The Yield Stack

Apex Yield is not just a bridge; it's a **Yield Aggregator**. We compose the best DeFi protocols on Stacks into a single, optimized vault.

### 1. The Bridge (Circle CCTP)
We utilize **Circle's Cross-Chain Transfer Protocol (CCTP)** to burn USDC on Ethereum and mint native **USDCx** on Stacks. This ensures:
*   **Zero Slippage:** 1:1 mint/burn ratio.
*   **No Liquidity Pools:** No bridge hacks or pool imbalances.
*   **Institutional Trust:** Relies on Circle's attestation service.

### 2. The Vault (Clarity Smart Contract)
Once USDCx arrives on Stacks, it is deposited into the **Apex Vault**. This non-custodial smart contract issues **apUSDC** (Interest Bearing Receipt) to the user.

The vault deploys capital into two primary strategies:

| Layer | Protocol | Strategy | APY (Est.) |
|-------|----------|----------|------------|
| **Base Yield** | **Zest Protocol** | Lending Market (Supply Side) | ~8.0% |
| **Boost Yield** | **Bitflow Finance** | Real Yield DEX (Swap Fees) | ~5.5% |
| **Total** | **Apex Vault** | **Aggregate Auto-Compound** | **~13.5%** |

*Note: In the current Testnet Demo, yields are simulated based on mainnet projections.*

## 💰 Revenue Model (Mainnet)

Apex Yield is designed as a sustainable business, operating like a decentralized hedge fund.

1.  **Performance Fee (15%):** We take a cut of the *profit generated* (yield), not the principal. This aligns our incentives with the user.
    *   *Scenario:* $10M TVL @ 13.5% APY = $1.35M Profit. Apex Revenue = **~$200k/year**.
2.  **Exit Fee (0.1%):** A small fee on withdrawal to prevent flash-loan attacks and capture revenue on churn.
3.  **Management Fee (0%):** Waived to aggressively acquire TVL.

## 🛠 Tech Stack

### Smart Contracts (Stacks)
*   **Language:** Clarity 4
*   **Standards:** SIP-010 (Fungible Token Standard)
*   **Key Features:** `as-contract?` flow, explicit asset allowances, block-based yield accrual.

### Frontend
*   **Framework:** React + Vite + TypeScript
*   **Styling:** Tailwind CSS + shadcn/ui (Cyber/Terminal Aesthetic)
*   **Ethereum:** Wagmi + RainbowKit + Viem
*   **Stacks:** Stacks.js + Hiro API
*   **UX Polish:** `framer-motion`, `react-hot-toast`, `recharts`

## 🚀 Getting Started

### Prerequisites
*   Node.js 18+
*   Stacks Leather Wallet (Testnet)
*   MetaMask / Rainbow Wallet (Sepolia)

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

### Testing the Demo
1.  **Connect Wallets:** Connect both Ethereum (Sepolia) and Stacks (Testnet) wallets.
2.  **Zap:** Enter an amount of USDC to bridge.
3.  **Track:** Watch the bridge progress via our real-time Bridge Tracker.
4.  **Deploy:** Once USDCx arrives, sign the transaction to deposit into the Vault.
5.  **Earn:** Watch your balance grow in real-time on the Dashboard.

## 📄 License

MIT License. Open source software.

---

Built for the **Programming USDCx on Stacks Builder Challenge 2026**.
