# Product Requirements Document (PRD): Apex Yield

| Project | Apex Yield |
| :--- | :--- |
| **Type** | Cross-Chain Yield Aggregator / DeFi Vault |
| **Core Tech** | Circle xReserve, Clarity Contracts, Stacks.js |
| **Vibe** | Institutional, Data-Driven, Minimalist |
| **Status** | **Ready for Development** |

---

## 1. Product Overview
Apex Yield is a cross-chain vault that allows Ethereum users to deposit USDC and automatically earn yield from Stacks DeFi protocols. It features a professional dashboard for tracking "Net APY" and "Assets Under Management."

## 2. User Personas
1.  **The Capital Allocator:** A DAO Treasurer or Whale on Ethereum. They have $50k+ in stables. They are risk-averse but yield-hungry. They hate "Gamification" and want "Financial Utility."
2.  **The Arbitrageur:** Understands that Stacks rates > Eth rates, but is too lazy to bridge manually.

---

## 3. Functional Requirements (FR)

### Module 1: The "Terminal" (Dashboard)
*Goal: Establish credibility immediately through data.*

| ID | Requirement | Description | Priority |
| :--- | :--- | :--- | :--- |
| **FR-01** | **Market Data Strip** | A ticker showing live rates:<br>• Aave USDC: **4.2%**<br>• Compound USDC: **3.9%**<br>• **Apex Alpha Vault: 13.5%** (Highlighted Green) | P0 |
| **FR-02** | **AUM Counter** | "Total Value Locked: $1,450,200" (Hardcoded simulation for demo). | P1 |
| **FR-03** | **Yield Chart** | A line chart comparing "Holding 10k in Aave" vs "Holding 10k in Apex" over time. | P0 |

### Module 2: The "Zap" (Bridge & Deposit)
*Goal: Abstract the bridge into a "Deposit" action.*

| ID | Requirement | Description | Priority |
| :--- | :--- | :--- | :--- |
| **FR-04** | **Smart Deposit Input** | Input: USDC Amount (Eth). <br>Output: Estimated Weekly Earnings. | P0 |
| **FR-05** | **Cross-Chain Execution** | 1. Approve USDC (Eth).<br>2. `depositForBurn` (Circle Bridge).<br>3. UI transitions to "Bridge Tracker." | P0 |
| **FR-06** | **Auto-Deploy Trigger** | Since we cannot automate the Stacks side fully trustlessly in the browser yet:<br>The UI detects the arrival of USDCx and prompts a **"Deploy Capital"** modal for the user to sign the final Stacks tx into the Vault. | P0 |

### Module 3: The Vault (Clarity Smart Contract)
*Goal: Demonstrate financial engineering capability.*

| ID | Requirement | Description | Priority |
| :--- | :--- | :--- | :--- |
| **FR-07** | **Vault Structure** | A Clarity contract (`apex-vault.clar`) implementing a Tokenized Vault Standard (SIP-010 compatible shares). | P0 |
| **FR-08** | **Share Calculation** | **Critical:** Must implement `(assets * exchange-rate)` logic.<br>• Users get `apUSDC` tokens representing their share.<br>• The exchange rate increases every block to simulate interest. | P0 |
| **FR-09** | **Simulated Harvest** | A public function `harvest-yield` that (when called) artificially increases the vault's total assets by 0.5%, simulating a yield payment from Zest/Bitflow. | P1 |

---

## 4. Non-Functional Requirements (NFR)

### NFR-01: UX/UI
*   **Theme:** "Dark Mode Finance." Deep greys, emerald greens, mono-spaced numbers. No cartoons. No emojis.
*   **Responsiveness:** Desktop-first (Whales use desktops).

### NFR-02: Performance
*   **Data Fetching:** Use `TanStack Query` to poll the Vault Contract state every 10 seconds to show the Balance ticking up live.

---

## 5. Technical Architecture

### The "Fake" Strategy (For Demo Purposes)
We cannot integrate with Mainnet Zest Protocol because we are on Stacks Testnet.
*   **Solution:** We build a **Mock Strategy** contract.
*   **Logic:**
    1.  User sends USDCx to `apex-vault`.
    2.  `apex-vault` holds the USDCx.
    3.  `apex-vault` mints `apUSDC` to user.
    4.  Every 100 blocks, the `exchange-rate` variable in the contract increments by 10 basis points.
    5.  **Result:** When user withdraws, they get back *more* USDCx than they put in. This proves the *concept* of the business model perfectly.

### Stack
*   **Frontend:** Vite (React) + RainbowKit (Eth Wallet) + Stacks Connect (Leather).
*   **Contracts:** Clarity (Vault logic).
*   **Integration:** Circle CCTP SDK / ABIs.

---

## 6. UI Flow (The "Happy Path" Demo)

1.  **Landing:** "Welcome to Apex. Institutional Yield."
2.  **The Hook:** User sees the "Spread" (4% vs 13%).
3.  **The Action:**
    *   User enters $10,000 USDC.
    *   Clicks **"Zap to Stacks"**.
    *   Signs Metamask.
4.  **The "Bridge Wait":**
    *   Display a clean, professional status bar: "Securing assets via Circle xReserve..."
5.  **The Deployment:**
    *   Money arrives.
    *   User clicks **"Deploy"**. Signs Stacks Wallet.
6.  **The Result:**
    *   Dashboard updates.
    *   "Net Equity: $10,000.00"
    *   *Wait 5 seconds...*
    *   "Net Equity: $10,000.02" (The auto-compound effect).
7.  **Conclusion:** "You are now earning yield. No maintenance required."

---

## 7. Success Metrics (For Judges)
1.  **Business Logic:** Does the arbitrage thesis make sense? (Yes, the 4% vs 13% spread is real).
2.  **Professionalism:** Does this look like a tool a DAO Treasurer would trust?
3.  **Technical Depth:** Did they write a custom Vault contract (Clarity) or just a frontend wrapper? (We are doing the Vault contract).
