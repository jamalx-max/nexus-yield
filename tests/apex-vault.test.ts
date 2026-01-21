import { Cl } from "@stacks/transactions";
import { describe, expect, it, beforeEach } from "vitest";

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const wallet1 = accounts.get("wallet_1")!;
const wallet2 = accounts.get("wallet_2")!;

describe("Apex Vault Tests", () => {
  beforeEach(() => {
    // Mint some mock USDCx to wallet1 for testing
    simnet.callPublicFn("mock-usdcx", "mint", [Cl.uint(10000000000), Cl.principal(wallet1)], deployer);
  });

  describe("SIP-010 Metadata", () => {
    it("returns correct token name", () => {
      const { result } = simnet.callReadOnlyFn("apex-vault", "get-name", [], wallet1);
      expect(result).toBeOk(Cl.stringAscii("Apex Yield USDC"));
    });

    it("returns correct token symbol", () => {
      const { result } = simnet.callReadOnlyFn("apex-vault", "get-symbol", [], wallet1);
      expect(result).toBeOk(Cl.stringAscii("apUSDCx"));
    });

    it("returns correct decimals", () => {
      const { result } = simnet.callReadOnlyFn("apex-vault", "get-decimals", [], wallet1);
      expect(result).toBeOk(Cl.uint(6));
    });

    it("returns initial exchange rate of 1.0", () => {
      const { result } = simnet.callReadOnlyFn("apex-vault", "get-exchange-rate", [], wallet1);
      expect(result).toBeUint(1000000); // 1.0 with 6 decimals
    });
  });

  describe("Deposit", () => {
    it("rejects zero amount deposit", () => {
      const { result } = simnet.callPublicFn("apex-vault", "deposit", [Cl.uint(0)], wallet1);
      expect(result).toBeErr(Cl.uint(1001));
    });

    it("allows deposit and mints shares 1:1 on first deposit", () => {
      const depositAmount = 100000000; // 100 USDC
      
      const { result } = simnet.callPublicFn(
        "apex-vault",
        "deposit",
        [Cl.uint(depositAmount)],
        wallet1
      );

      expect(result).toBeOk(Cl.uint(depositAmount)); // 1:1 shares on first deposit

      // Check share balance
      const { result: balanceResult } = simnet.callReadOnlyFn(
        "apex-vault",
        "get-balance",
        [Cl.principal(wallet1)],
        wallet1
      );
      expect(balanceResult).toBeOk(Cl.uint(depositAmount));

      // Check total assets
      const { result: totalAssets } = simnet.callReadOnlyFn(
        "apex-vault",
        "get-total-assets",
        [],
        wallet1
      );
      expect(totalAssets).toBeUint(depositAmount);
    });

    it("mints proportional shares on subsequent deposits", () => {
      // First deposit
      simnet.callPublicFn("apex-vault", "deposit", [Cl.uint(100000000)], wallet1);
      
      // Mint more USDCx to wallet2
      simnet.callPublicFn("mock-usdcx", "mint", [Cl.uint(1000000000), Cl.principal(wallet2)], deployer);
      
      // Second deposit from different wallet
      const { result } = simnet.callPublicFn(
        "apex-vault",
        "deposit",
        [Cl.uint(100000000)],
        wallet2
      );
      
      expect(result).toBeOk(Cl.uint(100000000)); // Still 1:1 if no yield accrued
    });
  });

  describe("Withdraw", () => {
    it("rejects zero shares withdrawal", () => {
      const { result } = simnet.callPublicFn("apex-vault", "withdraw", [Cl.uint(0)], wallet1);
      expect(result).toBeErr(Cl.uint(1001));
    });

    it("allows withdrawal of deposited funds", () => {
      const depositAmount = 100000000;
      
      // Deposit first
      simnet.callPublicFn("apex-vault", "deposit", [Cl.uint(depositAmount)], wallet1);
      
      // Withdraw all shares
      const { result } = simnet.callPublicFn(
        "apex-vault",
        "withdraw",
        [Cl.uint(depositAmount)],
        wallet1
      );
      
      expect(result).toBeOk(Cl.uint(depositAmount));

      // Check share balance is zero
      const { result: balanceResult } = simnet.callReadOnlyFn(
        "apex-vault",
        "get-balance",
        [Cl.principal(wallet1)],
        wallet1
      );
      expect(balanceResult).toBeOk(Cl.uint(0));
    });
  });

  describe("Yield Simulation", () => {
    it("accrues yield after 100 blocks", () => {
      const depositAmount = 1000000000; // 1000 USDC
      
      // Deposit
      simnet.callPublicFn("apex-vault", "deposit", [Cl.uint(depositAmount)], wallet1);
      
      // Mine 100 blocks
      simnet.mineEmptyBlocks(100);
      
      // Call harvest to trigger yield accrual
      simnet.callPublicFn("apex-vault", "harvest", [], wallet1);
      
      // Check total assets increased by 10 bps (0.1%)
      // Formula: assets * periods * YIELD_BPS / 10000
      // = 1000000000 * 1 * 10 / 10000 = 1000000 (0.1%)
      const { result: totalAssets } = simnet.callReadOnlyFn(
        "apex-vault",
        "get-total-assets",
        [],
        wallet1
      );
      
      // Expected: 1000000000 + 1000000 = 1001000000
      expect(totalAssets).toBeUint(1001000000);
    });

    it("exchange rate increases after yield accrual", () => {
      const depositAmount = 1000000000;
      
      // Deposit
      simnet.callPublicFn("apex-vault", "deposit", [Cl.uint(depositAmount)], wallet1);
      
      // Initial exchange rate
      const { result: initialRate } = simnet.callReadOnlyFn(
        "apex-vault",
        "get-exchange-rate",
        [],
        wallet1
      );
      expect(initialRate).toBeUint(1000000);
      
      // Mine 100 blocks and harvest
      simnet.mineEmptyBlocks(100);
      simnet.callPublicFn("apex-vault", "harvest", [], wallet1);
      
      // Exchange rate should have increased
      const { result: newRate } = simnet.callReadOnlyFn(
        "apex-vault",
        "get-exchange-rate",
        [],
        wallet1
      );
      
      // New rate: (1001000000 * 1000000) / 1000000000 = 1001000
      expect(newRate).toBeUint(1001000);
    });

    it("user receives more assets than deposited after yield (with extra vault balance)", () => {
      const depositAmount = 1000000000;
      
      // Deposit
      simnet.callPublicFn("apex-vault", "deposit", [Cl.uint(depositAmount)], wallet1);
      
      // Mint extra USDCx to the vault to simulate yield from external strategy
      // The vault needs this extra balance to pay out yield
      simnet.callPublicFn(
        "mock-usdcx", 
        "mint", 
        [Cl.uint(10000000), Cl.contractPrincipal(deployer.split(".")[0], "apex-vault")], 
        deployer
      );
      
      // Mine 100 blocks and harvest
      simnet.mineEmptyBlocks(100);
      simnet.callPublicFn("apex-vault", "harvest", [], wallet1);
      
      // Preview what we'll get
      const { result: previewResult } = simnet.callReadOnlyFn(
        "apex-vault",
        "preview-withdraw",
        [Cl.uint(depositAmount)],
        wallet1
      );
      
      // Should preview more than deposited
      expect(previewResult).toBeUint(1001000000);
    });
  });

  describe("Preview Functions", () => {
    it("preview-deposit returns correct share amount", () => {
      // First deposit - 1:1
      const { result: preview1 } = simnet.callReadOnlyFn(
        "apex-vault",
        "preview-deposit",
        [Cl.uint(100000000)],
        wallet1
      );
      expect(preview1).toBeUint(100000000);
    });

    it("preview-withdraw returns zero when no deposits", () => {
      const { result } = simnet.callReadOnlyFn(
        "apex-vault",
        "preview-withdraw",
        [Cl.uint(100000000)],
        wallet1
      );
      expect(result).toBeUint(0);
    });
  });
});
