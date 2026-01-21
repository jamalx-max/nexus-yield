import { describe, expect, it, beforeEach } from "vitest";
import { Cl } from "@stacks/transactions";

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const wallet1 = accounts.get("wallet_1")!;
const wallet2 = accounts.get("wallet_2")!;

describe("Apex Vault Tests", () => {
  describe("Initialization", () => {
    it("ensures simnet is well initialized", () => {
      expect(simnet.blockHeight).toBeDefined();
    });

    it("vault starts with zero total assets", () => {
      const { result } = simnet.callReadOnlyFn(
        "apex-vault",
        "get-total-assets",
        [],
        deployer
      );
      expect(result).toBeUint(0);
    });

    it("vault starts with exchange rate of 1.0", () => {
      const { result } = simnet.callReadOnlyFn(
        "apex-vault",
        "get-exchange-rate",
        [],
        deployer
      );
      expect(result).toBeUint(1000000); // 1.0 with 6 decimals
    });

    it("returns correct token metadata", () => {
      const nameResult = simnet.callReadOnlyFn("apex-vault", "get-name", [], deployer);
      expect(nameResult.result).toBeOk(Cl.stringAscii("Apex Yield USDC"));

      const symbolResult = simnet.callReadOnlyFn("apex-vault", "get-symbol", [], deployer);
      expect(symbolResult.result).toBeOk(Cl.stringAscii("apUSDCx"));

      const decimalsResult = simnet.callReadOnlyFn("apex-vault", "get-decimals", [], deployer);
      expect(decimalsResult.result).toBeOk(Cl.uint(6));
    });
  });

  describe("Deposit", () => {
    it("allows deposit and mints shares 1:1 on first deposit", () => {
      // First mint USDCx to wallet1
      const mintResult = simnet.callPublicFn(
        "mock-usdcx",
        "mint",
        [Cl.uint(100_000_000), Cl.principal(wallet1)],
        deployer
      );
      expect(mintResult.result).toBeOk(Cl.bool(true));

      // Deposit into vault
      const depositResult = simnet.callPublicFn(
        "apex-vault",
        "deposit",
        [Cl.uint(100_000_000)],
        wallet1
      );
      expect(depositResult.result).toBeOk(Cl.uint(100_000_000)); // 1:1 shares

      // Check vault state
      const { result: totalAssets } = simnet.callReadOnlyFn(
        "apex-vault",
        "get-total-assets",
        [],
        deployer
      );
      expect(totalAssets).toBeUint(100_000_000);

      // Check share balance
      const { result: balance } = simnet.callReadOnlyFn(
        "apex-vault",
        "get-balance",
        [Cl.principal(wallet1)],
        deployer
      );
      expect(balance).toBeOk(Cl.uint(100_000_000));
    });

    it("mints proportional shares on subsequent deposits", () => {
      // Mint and deposit for wallet1
      simnet.callPublicFn("mock-usdcx", "mint", [Cl.uint(100_000_000), Cl.principal(wallet1)], deployer);
      simnet.callPublicFn("apex-vault", "deposit", [Cl.uint(100_000_000)], wallet1);

      // Mint and deposit for wallet2
      simnet.callPublicFn("mock-usdcx", "mint", [Cl.uint(100_000_000), Cl.principal(wallet2)], deployer);
      const depositResult = simnet.callPublicFn(
        "apex-vault",
        "deposit",
        [Cl.uint(100_000_000)],
        wallet2
      );
      expect(depositResult.result).toBeOk(Cl.uint(100_000_000)); // Same shares as same rate

      // Total assets should be 200M
      const { result: totalAssets } = simnet.callReadOnlyFn(
        "apex-vault",
        "get-total-assets",
        [],
        deployer
      );
      expect(totalAssets).toBeUint(200_000_000);
    });

    it("rejects zero amount deposit", () => {
      const depositResult = simnet.callPublicFn(
        "apex-vault",
        "deposit",
        [Cl.uint(0)],
        wallet1
      );
      expect(depositResult.result).toBeErr(Cl.uint(1001));
    });
  });

  describe("Withdraw", () => {
    it("allows withdrawal of deposited funds", () => {
      // Setup: mint and deposit
      simnet.callPublicFn("mock-usdcx", "mint", [Cl.uint(100_000_000), Cl.principal(wallet1)], deployer);
      simnet.callPublicFn("apex-vault", "deposit", [Cl.uint(100_000_000)], wallet1);

      // Withdraw all shares
      const withdrawResult = simnet.callPublicFn(
        "apex-vault",
        "withdraw",
        [Cl.uint(100_000_000)],
        wallet1
      );
      expect(withdrawResult.result).toBeOk(Cl.uint(100_000_000));

      // Check vault is empty
      const { result: totalAssets } = simnet.callReadOnlyFn(
        "apex-vault",
        "get-total-assets",
        [],
        deployer
      );
      expect(totalAssets).toBeUint(0);

      // Check USDCx balance restored
      const { result: usdcxBalance } = simnet.callReadOnlyFn(
        "mock-usdcx",
        "get-balance",
        [Cl.principal(wallet1)],
        deployer
      );
      expect(usdcxBalance).toBeOk(Cl.uint(100_000_000));
    });

    it("allows partial withdrawal", () => {
      // Setup
      simnet.callPublicFn("mock-usdcx", "mint", [Cl.uint(100_000_000), Cl.principal(wallet1)], deployer);
      simnet.callPublicFn("apex-vault", "deposit", [Cl.uint(100_000_000)], wallet1);

      // Partial withdraw
      const withdrawResult = simnet.callPublicFn(
        "apex-vault",
        "withdraw",
        [Cl.uint(50_000_000)],
        wallet1
      );
      expect(withdrawResult.result).toBeOk(Cl.uint(50_000_000));

      // Check remaining balance
      const { result: sharesBalance } = simnet.callReadOnlyFn(
        "apex-vault",
        "get-balance",
        [Cl.principal(wallet1)],
        deployer
      );
      expect(sharesBalance).toBeOk(Cl.uint(50_000_000));
    });

    it("rejects zero shares withdrawal", () => {
      const withdrawResult = simnet.callPublicFn(
        "apex-vault",
        "withdraw",
        [Cl.uint(0)],
        wallet1
      );
      expect(withdrawResult.result).toBeErr(Cl.uint(1001));
    });
  });

  describe("Yield Simulation", () => {
    it("accrues yield after 100 blocks", () => {
      // Setup deposit
      simnet.callPublicFn("mock-usdcx", "mint", [Cl.uint(1_000_000_000), Cl.principal(wallet1)], deployer);
      simnet.callPublicFn("apex-vault", "deposit", [Cl.uint(1_000_000_000)], wallet1);

      const initialAssets = simnet.callReadOnlyFn("apex-vault", "get-total-assets", [], deployer);

      // Mine 100 blocks
      simnet.mineEmptyBlocks(100);

      // Trigger harvest
      const harvestResult = simnet.callPublicFn("apex-vault", "harvest", [], deployer);
      expect(harvestResult.result).toBeOk(Cl.bool(true));

      // Check yield accrued (10 bps = 0.1% = 1,000,000 * 0.001 = 1,000)
      const { result: newAssets } = simnet.callReadOnlyFn(
        "apex-vault",
        "get-total-assets",
        [],
        deployer
      );
      expect(newAssets).toBeUint(1_001_000_000); // 1B + 1M yield
    });

    it("exchange rate increases after yield accrual", () => {
      // Setup
      simnet.callPublicFn("mock-usdcx", "mint", [Cl.uint(1_000_000_000), Cl.principal(wallet1)], deployer);
      simnet.callPublicFn("apex-vault", "deposit", [Cl.uint(1_000_000_000)], wallet1);

      const { result: initialRate } = simnet.callReadOnlyFn(
        "apex-vault",
        "get-exchange-rate",
        [],
        deployer
      );
      expect(initialRate).toBeUint(1_000_000); // 1.0

      // Accrue yield
      simnet.mineEmptyBlocks(100);
      simnet.callPublicFn("apex-vault", "harvest", [], deployer);

      const { result: newRate } = simnet.callReadOnlyFn(
        "apex-vault",
        "get-exchange-rate",
        [],
        deployer
      );
      expect(newRate).toBeUint(1_001_000); // 1.001 (10 bps increase)
    });
  });

  describe("SIP-010 Transfer", () => {
    it("allows share transfers between users", () => {
      // Setup
      simnet.callPublicFn("mock-usdcx", "mint", [Cl.uint(100_000_000), Cl.principal(wallet1)], deployer);
      simnet.callPublicFn("apex-vault", "deposit", [Cl.uint(100_000_000)], wallet1);

      // Transfer shares
      const transferResult = simnet.callPublicFn(
        "apex-vault",
        "transfer",
        [Cl.uint(50_000_000), Cl.principal(wallet1), Cl.principal(wallet2), Cl.none()],
        wallet1
      );
      expect(transferResult.result).toBeOk(Cl.bool(true));

      // Check balances
      const { result: bal1 } = simnet.callReadOnlyFn(
        "apex-vault",
        "get-balance",
        [Cl.principal(wallet1)],
        deployer
      );
      expect(bal1).toBeOk(Cl.uint(50_000_000));

      const { result: bal2 } = simnet.callReadOnlyFn(
        "apex-vault",
        "get-balance",
        [Cl.principal(wallet2)],
        deployer
      );
      expect(bal2).toBeOk(Cl.uint(50_000_000));
    });

    it("rejects unauthorized transfers", () => {
      // Setup
      simnet.callPublicFn("mock-usdcx", "mint", [Cl.uint(100_000_000), Cl.principal(wallet1)], deployer);
      simnet.callPublicFn("apex-vault", "deposit", [Cl.uint(100_000_000)], wallet1);

      // Try to transfer from wallet1 as wallet2
      const transferResult = simnet.callPublicFn(
        "apex-vault",
        "transfer",
        [Cl.uint(50_000_000), Cl.principal(wallet1), Cl.principal(wallet2), Cl.none()],
        wallet2
      );
      expect(transferResult.result).toBeErr(Cl.uint(100));
    });
  });

  describe("View Functions", () => {
    it("preview-deposit returns correct shares", () => {
      // First deposit to set up state
      simnet.callPublicFn("mock-usdcx", "mint", [Cl.uint(100_000_000), Cl.principal(wallet1)], deployer);
      simnet.callPublicFn("apex-vault", "deposit", [Cl.uint(100_000_000)], wallet1);

      const { result } = simnet.callReadOnlyFn(
        "apex-vault",
        "preview-deposit",
        [Cl.uint(50_000_000)],
        deployer
      );
      expect(result).toBeUint(50_000_000);
    });

    it("preview-withdraw returns correct assets", () => {
      simnet.callPublicFn("mock-usdcx", "mint", [Cl.uint(100_000_000), Cl.principal(wallet1)], deployer);
      simnet.callPublicFn("apex-vault", "deposit", [Cl.uint(100_000_000)], wallet1);

      const { result } = simnet.callReadOnlyFn(
        "apex-vault",
        "preview-withdraw",
        [Cl.uint(50_000_000)],
        deployer
      );
      expect(result).toBeUint(50_000_000);
    });

    it("get-vault-principal returns contract principal", () => {
      const { result } = simnet.callReadOnlyFn(
        "apex-vault",
        "get-vault-principal",
        [],
        deployer
      );
      expect(result).toBePrincipal(`${deployer}.apex-vault`);
    });
  });
});
