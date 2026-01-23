# Apex Yield - Video Pitch Script

**Duration:** 2:45 - 3:00 minutes
**Format:** Screen recording with picture-in-picture of presenter

---

## OPENING (0:00 - 0:20)

[Show Dashboard UI on screen]

**Script:**

> "This is Apex Yield - the first professional-grade cross-chain yield aggregator for Bitcoin DeFi.
>
> Right now, over $25 billion in USDC sits on Ethereum earning just 4% APY. Meanwhile, on Stacks - Bitcoin's layer 2 - borrowers are paying 12 to 15% interest rates because there's a massive shortage of stablecoin liquidity.
>
> **Apex Yield captures that spread.**"

---

## THE PROBLEM (0:20 - 0:45)

[Screen: Show split comparison - Aave at 4.2% vs Apex at 13.5%]

**Script:**

> "The problem is simple: Capital is lazy on Ethereum, but starving on Stacks.
>
> [Point to chart] Here's what happens if you invest $10,000 for one year:
> - **Aave on Ethereum:** You earn $420
> - **Apex Yield on Stacks:** You earn $1,350
>
> **That's $930 in free money you're leaving on the table.**
>
> But bridging assets cross-chain and deploying them into DeFi protocols is complex, expensive, and time-consuming. Most users simply can't be bothered."

---

## THE SOLUTION (0:45 - 1:30)

[Screen: Show the ZapFlow UI]

**Script:**

> "Apex Yield solves this with what we call the **One-Click Zap.**
>
> [Demo on screen as you talk]
>
> **Watch this:**
>
> Step 1: I connect both my Ethereum wallet and my Stacks wallet.
>
> Step 2: I enter how much USDC I want to bridge - let's say 100 USDC.
>
> Step 3: I click 'Zap from ETH.'
>
> Behind the scenes, Apex is doing three things:
> 1. Approving the Circle xReserve contract
> 2. Calling `depositToRemote` to burn USDC on Ethereum
> 3. Tracking the attestation with a unique hookData identifier
>
> [Show BridgeTracker component]
>
> Circle's attestation service takes about 15 minutes to verify the burn. Our tracker polls the Stacks API every 15 seconds to detect when USDCx is minted.
>
> [Show DeployCapital modal appearing]
>
> Once the USDCx arrives, Apex prompts me to deploy it into our yield vault with one click. I sign the transaction with my Stacks wallet.
>
> **Done.**
>
> I now hold **apUSDCx** - a yield-bearing token that represents my share of the vault. As the vault earns interest, my apUSDCx becomes worth more USDCx over time."

---

## THE TECH (1:30 - 2:00)

[Screen: Show code snippets or architecture diagram]

**Script:**

> "Let's talk about what makes this work.
>
> **The Bridge:** We use Circle's official Cross-Chain Transfer Protocol - the same infrastructure that powers USDC on every blockchain. Our integration uses `depositToRemote` with custom hookData for precise tracking.
>
> **The Vault:** We wrote a 200-line Clarity smart contract that implements a tokenized vault standard - similar to ERC-4626 on Ethereum. It calculates share prices using the formula `total assets divided by total supply`, and it auto-compounds yield every 100 blocks.
>
> We're using **Clarity 4** - the latest version - which gives us advanced security features like `as-contract?` with explicit asset allowances. This prevents the vault from touching tokens it's not authorized to use.
>
> **The Frontend:** Built with React, TypeScript, and dual wallet support. We integrated RainbowKit for Ethereum and Stacks Connect for Bitcoin layer 2 wallets."

---

## THE IMPACT (2:00 - 2:30)

[Screen: Show Dashboard with projected earnings]

**Script:**

> "Here's why this matters:
>
> **For Users:** Every DAO treasury, every whale holding idle stablecoins on Ethereum - they can now access Bitcoin-secured yield without the complexity of managing cross-chain bridges, gas fees, or DeFi protocols.
>
> **For Stacks:** This brings massive liquidity into the ecosystem. When Ethereum users can earn 3x higher yields on Stacks with just one click, billions of dollars will flow into Bitcoin DeFi.
>
> **For Bitcoin:** This is how Bitcoin becomes the financial backbone of crypto. Not by holding it in cold storage, but by putting it to work backing real lending markets.
>
> Apex Yield isn't a gamified bridge with inflationary tokens. It's institutional-grade infrastructure for serious capital allocators."

---

## CLOSING (2:30 - 2:45)

[Screen: Show live deployment URL]

**Script:**

> "Everything you just saw is live on testnet right now.
>
> You can try it at **apex-yield-six.vercel.app**
>
> The contracts are deployed and verified on Stacks testnet. The full source code is open on GitHub.
>
> This is Apex Yield. **The arbitrage engine connecting Ethereum capital to Bitcoin-secured yield.**
>
> No points. No games. Just alpha."

[Screen fades to logo/project name]

---

## PRODUCTION TIPS

### Equipment
- Use your phone camera (1080p minimum) or webcam
- Good lighting (face a window or use desk lamp)
- Quiet room (no background noise)

### Screen Recording
1. Use OBS Studio (free) or Loom
2. Record at 1080p, 30fps
3. Show mouse cursor during demos

### Editing
1. Use DaVinci Resolve (free) or iMovie
2. Picture-in-picture: You in corner, UI on main screen
3. Add subtle background music (low volume)
4. Export as MP4, H.264 codec

### Script Timing
- Read at ~140 words per minute
- Practice 2-3 times before recording
- Total script: ~490 words = 3.5 minutes (speak at conversational pace)

---

## KEY TALKING POINTS

If you need to improvise or shorten:

1. **The Hook:** "$25B earning 4% on Ethereum. Stacks pays 12-15%. We capture that spread."

2. **The Demo:** "One-click Zap: Approve → Bridge → Deploy → Done."

3. **The Tech:** "Real Circle CCTP bridge + Clarity 4 vault contract + React frontend."

4. **The Vision:** "Institutional-grade infrastructure. No games. Just alpha."

---

## LINKS TO SHOW

- Live Demo: https://apex-yield-six.vercel.app
- GitHub: https://github.com/man-croft/ApexYield
- Deployed Vault: STZ5Q1C2GVSMCWS9NWVDEKHNW04THC75SEGDHS74.apex-vault

---

Good luck with your recording!
