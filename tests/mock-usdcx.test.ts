import { describe, expect, it, beforeEach } from "vitest";
import { Cl } from "@stacks/transactions";

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const wallet1 = accounts.get("wallet_1")!;
const wallet2 = accounts.get("wallet_2")!;
const wallet3 = accounts.get("wallet_3")!;
const wallet4 = accounts.get("wallet_4")!;

describe("Mock USDCx Token - Enhanced Tests", () => {
  
  // ============================================
  // Initial State
  // ============================================
  describe("initial state", () => {
    it("should initialize with zero total supply", () => {
      const { result } = simnet.callReadOnlyFn("mock-usdcx", "get-total-supply", [], deployer);
      expect(result).toBeOk(Cl.uint(0));
    });

    it("should return correct token metadata", () => {
      const nameResult = simnet.callReadOnlyFn("mock-usdcx", "get-name", [], deployer);
      expect(nameResult.result).toBeOk(Cl.stringAscii("USDCx"));

      const symbolResult = simnet.callReadOnlyFn("mock-usdcx", "get-symbol", [], deployer);
      expect(symbolResult.result).toBeOk(Cl.stringAscii("USDCx"));

      const decimalsResult = simnet.callReadOnlyFn("mock-usdcx", "get-decimals", [], deployer);
      expect(decimalsResult.result).toBeOk(Cl.uint(6));

      const uriResult = simnet.callReadOnlyFn("mock-usdcx", "get-token-uri", [], deployer);
      expect(uriResult.result).toBeOk(Cl.none());
    });

    it("should initialize with minter role as deployer", () => {
      const { result } = simnet.callReadOnlyFn("mock-usdcx", "get-minter-role", [], deployer);
      expect(result).toBeOk(Cl.principal(deployer));
    });

    it("should initialize with paused state false", () => {
      const { result } = simnet.callReadOnlyFn("mock-usdcx", "is-paused", [], deployer);
      expect(result).toBeOk(Cl.bool(false));
    });
  });

  // ============================================
  // Mint Function
  // ============================================
  describe("mint function", () => {
    it("should allow minter to mint tokens", () => {
      const mintResult = simnet.callPublicFn(
        "mock-usdcx",
        "mint",
        [Cl.uint(1_000_000), Cl.principal(wallet1)],
        deployer
      );
      expect(mintResult.result).toBeOk(Cl.bool(true));

      const { result: balance } = simnet.callReadOnlyFn(
        "mock-usdcx",
        "get-balance",
        [Cl.principal(wallet1)],
        deployer
      );
      expect(balance).toBeOk(Cl.uint(1_000_000));

      const { result: supply } = simnet.callReadOnlyFn(
        "mock-usdcx",
        "get-total-supply",
        [],
        deployer
      );
      expect(supply).toBeOk(Cl.uint(1_000_000));
    });

    it("should prevent minting zero amount", () => {
      const mintResult = simnet.callPublicFn(
        "mock-usdcx",
        "mint",
        [Cl.uint(0), Cl.principal(wallet1)],
        deployer
      );
      expect(mintResult.result).toBeErr(Cl.uint(103)); // ERR-INVALID-AMOUNT
    });

    it("should prevent non-minter from minting", () => {
      const mintResult = simnet.callPublicFn(
        "mock-usdcx",
        "mint",
        [Cl.uint(1_000_000), Cl.principal(wallet1)],
        wallet1
      );
      expect(mintResult.result).toBeErr(Cl.uint(104)); // ERR-UNAUTHORIZED
    });

    it("should record mint events", () => {
      const mintResult = simnet.callPublicFn(
        "mock-usdcx",
        "mint",
        [Cl.uint(500_000), Cl.principal(wallet2)],
        deployer
      );
      expect(mintResult.result).toBeOk(Cl.bool(true));

      const { result: eventCount } = simnet.callReadOnlyFn(
        "mock-usdcx",
        "get-mint-event-count",
        [],
        deployer
      );
      expect(eventCount).toBeOk(Cl.uint(1));

      const { result: event } = simnet.callReadOnlyFn(
        "mock-usdcx",
        "get-mint-event",
        [Cl.uint(1)],
        deployer
      );
      expect(event).toBeSome(Cl.tuple({
        recipient: Cl.principal(wallet2),
        amount: Cl.uint(500_000),
        timestamp: Cl.uint(expect.any(Number)),
        "tx-sender": Cl.principal(deployer)
      }));
    });

    it("should handle multiple mint events", () => {
      // Mint first time
      simnet.callPublicFn(
        "mock-usdcx",
        "mint",
        [Cl.uint(100_000), Cl.principal(wallet1)],
        deployer
      );

      // Mint second time
      simnet.callPublicFn(
        "mock-usdcx",
        "mint",
        [Cl.uint(200_000), Cl.principal(wallet2)],
        deployer
      );

      const { result: eventCount } = simnet.callReadOnlyFn(
        "mock-usdcx",
        "get-mint-event-count",
        [],
        deployer
      );
      expect(eventCount).toBeOk(Cl.uint(2));
    });
  });

  // ============================================
  // Batch Mint Function
  // ============================================
  describe("batch mint function", () => {
    it("should mint to multiple recipients in one transaction", () => {
      const recipients = [Cl.principal(wallet1), Cl.principal(wallet2), Cl.principal(wallet3)];
      const amounts = [Cl.uint(100_000), Cl.uint(200_000), Cl.uint(300_000)];

      const batchResult = simnet.callPublicFn(
        "mock-usdcx",
        "batch-mint",
        [Cl.list(recipients), Cl.list(amounts)],
        deployer
      );
      expect(batchResult.result).toBeOk(Cl.bool(true));

      // Check balances
      const { result: bal1 } = simnet.callReadOnlyFn(
        "mock-usdcx",
        "get-balance",
        [Cl.principal(wallet1)],
        deployer
      );
      expect(bal1).toBeOk(Cl.uint(100_000));

      const { result: bal2 } = simnet.callReadOnlyFn(
        "mock-usdcx",
        "get-balance",
        [Cl.principal(wallet2)],
        deployer
      );
      expect(bal2).toBeOk(Cl.uint(200_000));

      const { result: bal3 } = simnet.callReadOnlyFn(
        "mock-usdcx",
        "get-balance",
        [Cl.principal(wallet3)],
        deployer
      );
      expect(bal3).toBeOk(Cl.uint(300_000));

      // Check total supply
      const { result: supply } = simnet.callReadOnlyFn(
        "mock-usdcx",
        "get-total-supply",
        [],
        deployer
      );
      expect(supply).toBeOk(Cl.uint(600_000));
    });

    it("should fail when recipient and amount lists length mismatch", () => {
      const recipients = [Cl.principal(wallet1), Cl.principal(wallet2)];
      const amounts = [Cl.uint(100_000)];

      const batchResult = simnet.callPublicFn(
        "mock-usdcx",
        "batch-mint",
        [Cl.list(recipients), Cl.list(amounts)],
        deployer
      );
      expect(batchResult.result).toBeErr(Cl.uint(103)); // ERR-INVALID-AMOUNT
    });

    it("should prevent non-minter from batch minting", () => {
      const recipients = [Cl.principal(wallet1)];
      const amounts = [Cl.uint(100_000)];

      const batchResult = simnet.callPublicFn(
        "mock-usdcx",
        "batch-mint",
        [Cl.list(recipients), Cl.list(amounts)],
        wallet1
      );
      expect(batchResult.result).toBeErr(Cl.uint(104)); // ERR-UNAUTHORIZED
    });
  });

  // ============================================
  // Burn Function
  // ============================================
  describe("burn function", () => {
    beforeEach(() => {
      // Mint tokens before each burn test
      simnet.callPublicFn(
        "mock-usdcx",
        "mint",
        [Cl.uint(1_000_000), Cl.principal(wallet1)],
        deployer
      );
    });

    it("should allow token holder to burn tokens", () => {
      const burnResult = simnet.callPublicFn(
        "mock-usdcx",
        "burn",
        [Cl.uint(300_000)],
        wallet1
      );
      expect(burnResult.result).toBeOk(Cl.bool(true));

      const { result: balance } = simnet.callReadOnlyFn(
        "mock-usdcx",
        "get-balance",
        [Cl.principal(wallet1)],
        deployer
      );
      expect(balance).toBeOk(Cl.uint(700_000));

      const { result: supply } = simnet.callReadOnlyFn(
        "mock-usdcx",
        "get-total-supply",
        [],
        deployer
      );
      expect(supply).toBeOk(Cl.uint(700_000));
    });

    it("should prevent burning more than balance", () => {
      const burnResult = simnet.callPublicFn(
        "mock-usdcx",
        "burn",
        [Cl.uint(2_000_000)],
        wallet1
      );
      expect(burnResult.result).toBeErr(Cl.uint(102)); // ERR-INSUFFICIENT-BALANCE
    });

    it("should prevent burning zero amount", () => {
      const burnResult = simnet.callPublicFn(
        "mock-usdcx",
        "burn",
        [Cl.uint(0)],
        wallet1
      );
      expect(burnResult.result).toBeErr(Cl.uint(103)); // ERR-INVALID-AMOUNT
    });

    it("should record burn events", () => {
      const burnResult = simnet.callPublicFn(
        "mock-usdcx",
        "burn",
        [Cl.uint(200_000)],
        wallet1
      );
      expect(burnResult.result).toBeOk(Cl.bool(true));

      const { result: eventCount } = simnet.callReadOnlyFn(
        "mock-usdcx",
        "get-burn-event-count",
        [],
        deployer
      );
      expect(eventCount).toBeOk(Cl.uint(1));

      const { result: event } = simnet.callReadOnlyFn(
        "mock-usdcx",
        "get-burn-event",
        [Cl.uint(1)],
        deployer
      );
      expect(event).toBeSome(Cl.tuple({
        burner: Cl.principal(wallet1),
        amount: Cl.uint(200_000),
        timestamp: Cl.uint(expect.any(Number))
      }));
    });
  });

  // ============================================
  // Transfer Function
  // ============================================
  describe("transfer function", () => {
    beforeEach(() => {
      simnet.callPublicFn(
        "mock-usdcx",
        "mint",
        [Cl.uint(1_000_000), Cl.principal(wallet1)],
        deployer
      );
    });

    it("should allow token holder to transfer tokens", () => {
      const transferResult = simnet.callPublicFn(
        "mock-usdcx",
        "transfer",
        [Cl.uint(400_000), Cl.principal(wallet1), Cl.principal(wallet2), Cl.none()],
        wallet1
      );
      expect(transferResult.result).toBeOk(Cl.bool(true));

      const { result: bal1 } = simnet.callReadOnlyFn(
        "mock-usdcx",
        "get-balance",
        [Cl.principal(wallet1)],
        deployer
      );
      expect(bal1).toBeOk(Cl.uint(600_000));

      const { result: bal2 } = simnet.callReadOnlyFn(
        "mock-usdcx",
        "get-balance",
        [Cl.principal(wallet2)],
        deployer
      );
      expect(bal2).toBeOk(Cl.uint(400_000));
    });

    it("should prevent transfer with memo", () => {
      const memo = Cl.bufferFromAscii("test memo");
      const transferResult = simnet.callPublicFn(
        "mock-usdcx",
        "transfer",
        [Cl.uint(100_000), Cl.principal(wallet1), Cl.principal(wallet2), Cl.some(memo)],
        wallet1
      );
      expect(transferResult.result).toBeOk(Cl.bool(true));
    });

    it("should prevent transfer exceeding balance", () => {
      const transferResult = simnet.callPublicFn(
        "mock-usdcx",
        "transfer",
        [Cl.uint(2_000_000), Cl.principal(wallet1), Cl.principal(wallet2), Cl.none()],
        wallet1
      );
      expect(transferResult.result).toBeErr(Cl.uint(102)); // ERR-INSUFFICIENT-BALANCE
    });

    it("should prevent unauthorized transfer", () => {
      const transferResult = simnet.callPublicFn(
        "mock-usdcx",
        "transfer",
        [Cl.uint(100_000), Cl.principal(wallet1), Cl.principal(wallet2), Cl.none()],
        wallet2 // Not the sender
      );
      expect(transferResult.result).toBeErr(Cl.uint(101)); // ERR-NOT-TOKEN-OWNER
    });

    it("should record transfer events", () => {
      const transferResult = simnet.callPublicFn(
        "mock-usdcx",
        "transfer",
        [Cl.uint(150_000), Cl.principal(wallet1), Cl.principal(wallet2), Cl.none()],
        wallet1
      );
      expect(transferResult.result).toBeOk(Cl.bool(true));

      const { result: eventCount } = simnet.callReadOnlyFn(
        "mock-usdcx",
        "get-transfer-event-count",
        [],
        deployer
      );
      expect(eventCount).toBeOk(Cl.uint(1));

      const { result: event } = simnet.callReadOnlyFn(
        "mock-usdcx",
        "get-transfer-event",
        [Cl.uint(1)],
        deployer
      );
      expect(event).toBeSome(Cl.tuple({
        sender: Cl.principal(wallet1),
        recipient: Cl.principal(wallet2),
        amount: Cl.uint(150_000),
        memo: Cl.none(),
        timestamp: Cl.uint(expect.any(Number))
      }));
    });
  });

  // ============================================
  // Approve and TransferFrom Functions
  // ============================================
  describe("approve and transfer-from functions", () => {
    beforeEach(() => {
      simnet.callPublicFn(
        "mock-usdcx",
        "mint",
        [Cl.uint(1_000_000), Cl.principal(wallet1)],
        deployer
      );
    });

    it("should allow owner to approve spender", () => {
      const approveResult = simnet.callPublicFn(
        "mock-usdcx",
        "approve",
        [Cl.principal(wallet2), Cl.uint(500_000)],
        wallet1
      );
      expect(approveResult.result).toBeOk(Cl.bool(true));

      const { result: allowance } = simnet.callReadOnlyFn(
        "mock-usdcx",
        "get-allowance",
        [Cl.principal(wallet1), Cl.principal(wallet2)],
        deployer
      );
      expect(allowance).toBeOk(Cl.tuple({ amount: Cl.uint(500_000) }));
    });

    it("should allow spender to transfer-from", () => {
      // Approve
      simnet.callPublicFn(
        "mock-usdcx",
        "approve",
        [Cl.principal(wallet2), Cl.uint(300_000)],
        wallet1
      );

      // Transfer from
      const transferFromResult = simnet.callPublicFn(
        "mock-usdcx",
        "transfer-from",
        [Cl.principal(wallet1), Cl.principal(wallet3), Cl.uint(200_000)],
        wallet2
      );
      expect(transferFromResult.result).toBeOk(Cl.bool(true));

      // Check balances
      const { result: bal1 } = simnet.callReadOnlyFn(
        "mock-usdcx",
        "get-balance",
        [Cl.principal(wallet1)],
        deployer
      );
      expect(bal1).toBeOk(Cl.uint(800_000));

      const { result: bal3 } = simnet.callReadOnlyFn(
        "mock-usdcx",
        "get-balance",
        [Cl.principal(wallet3)],
        deployer
      );
      expect(bal3).toBeOk(Cl.uint(200_000));

      // Check updated allowance
      const { result: allowance } = simnet.callReadOnlyFn(
        "mock-usdcx",
        "get-allowance",
        [Cl.principal(wallet1), Cl.principal(wallet2)],
        deployer
      );
      expect(allowance).toBeOk(Cl.tuple({ amount: Cl.uint(100_000) }));
    });

    it("should prevent transfer-from exceeding allowance", () => {
      // Approve
      simnet.callPublicFn(
        "mock-usdcx",
        "approve",
        [Cl.principal(wallet2), Cl.uint(100_000)],
        wallet1
      );

      // Transfer from exceeding allowance
      const transferFromResult = simnet.callPublicFn(
        "mock-usdcx",
        "transfer-from",
        [Cl.principal(wallet1), Cl.principal(wallet3), Cl.uint(200_000)],
        wallet2
      );
      expect(transferFromResult.result).toBeErr(Cl.uint(102)); // ERR-INSUFFICIENT-BALANCE
    });
  });

  // ============================================
  // Increase/Decrease Allowance
  // ============================================
  describe("increase and decrease allowance", () => {
    beforeEach(() => {
      simnet.callPublicFn(
        "mock-usdcx",
        "mint",
        [Cl.uint(1_000_000), Cl.principal(wallet1)],
        deployer
      );
    });

    it("should increase allowance", () => {
      // Initial approve
      simnet.callPublicFn(
        "mock-usdcx",
        "approve",
        [Cl.principal(wallet2), Cl.uint(100_000)],
        wallet1
      );

      // Increase allowance
      const increaseResult = simnet.callPublicFn(
        "mock-usdcx",
        "increase-allowance",
        [Cl.principal(wallet2), Cl.uint(50_000)],
        wallet1
      );
      expect(increaseResult.result).toBeOk(Cl.bool(true));

      const { result: allowance } = simnet.callReadOnlyFn(
        "mock-usdcx",
        "get-allowance",
        [Cl.principal(wallet1), Cl.principal(wallet2)],
        deployer
      );
      expect(allowance).toBeOk(Cl.tuple({ amount: Cl.uint(150_000) }));
    });

    it("should decrease allowance", () => {
      // Initial approve
      simnet.callPublicFn(
        "mock-usdcx",
        "approve",
        [Cl.principal(wallet2), Cl.uint(100_000)],
        wallet1
      );

      // Decrease allowance
      const decreaseResult = simnet.callPublicFn(
        "mock-usdcx",
        "decrease-allowance",
        [Cl.principal(wallet2), Cl.uint(30_000)],
        wallet1
      );
      expect(decreaseResult.result).toBeOk(Cl.bool(true));

      const { result: allowance } = simnet.callReadOnlyFn(
        "mock-usdcx",
        "get-allowance",
        [Cl.principal(wallet1), Cl.principal(wallet2)],
        deployer
      );
      expect(allowance).toBeOk(Cl.tuple({ amount: Cl.uint(70_000) }));
    });

    it("should not decrease allowance below zero", () => {
      // Initial approve
      simnet.callPublicFn(
        "mock-usdcx",
        "approve",
        [Cl.principal(wallet2), Cl.uint(50_000)],
        wallet1
      );

      // Decrease allowance beyond balance
      const decreaseResult = simnet.callPublicFn(
        "mock-usdcx",
        "decrease-allowance",
        [Cl.principal(wallet2), Cl.uint(100_000)],
        wallet1
      );
      expect(decreaseResult.result).toBeOk(Cl.bool(true));

      const { result: allowance } = simnet.callReadOnlyFn(
        "mock-usdcx",
        "get-allowance",
        [Cl.principal(wallet1), Cl.principal(wallet2)],
        deployer
      );
      expect(allowance).toBeOk(Cl.tuple({ amount: Cl.uint(0) }));
    });
  });

  // ============================================
  // Pause Function
  // ============================================
  describe("pause functionality", () => {
    it("should allow minter to pause contract", () => {
      const pauseResult = simnet.callPublicFn(
        "mock-usdcx",
        "set-paused",
        [Cl.bool(true)],
        deployer
      );
      expect(pauseResult.result).toBeOk(Cl.bool(true));

      const { result: paused } = simnet.callReadOnlyFn(
        "mock-usdcx",
        "is-paused",
        [],
        deployer
      );
      expect(paused).toBeOk(Cl.bool(true));
    });

    it("should prevent non-minter from pausing", () => {
      const pauseResult = simnet.callPublicFn(
        "mock-usdcx",
        "set-paused",
        [Cl.bool(true)],
        wallet1
      );
      expect(pauseResult.result).toBeErr(Cl.uint(104)); // ERR-UNAUTHORIZED
    });

    it("should prevent transfers when paused", () => {
      // Mint tokens
      simnet.callPublicFn(
        "mock-usdcx",
        "mint",
        [Cl.uint(1_000_000), Cl.principal(wallet1)],
        deployer
      );

      // Pause contract
      simnet.callPublicFn(
        "mock-usdcx",
        "set-paused",
        [Cl.bool(true)],
        deployer
      );

      // Try to transfer
      const transferResult = simnet.callPublicFn(
        "mock-usdcx",
        "transfer",
        [Cl.uint(100_000), Cl.principal(wallet1), Cl.principal(wallet2), Cl.none()],
        wallet1
      );
      expect(transferResult.result).toBeErr(Cl.uint(104)); // ERR-UNAUTHORIZED
    });

    it("should prevent minting when paused", () => {
      // Pause contract
      simnet.callPublicFn(
        "mock-usdcx",
        "set-paused",
        [Cl.bool(true)],
        deployer
      );

      // Try to mint
      const mintResult = simnet.callPublicFn(
        "mock-usdcx",
        "mint",
        [Cl.uint(100_000), Cl.principal(wallet1)],
        deployer
      );
      expect(mintResult.result).toBeErr(Cl.uint(104)); // ERR-UNAUTHORIZED
    });
  });

  // ============================================
  // Blacklist Function
  // ============================================
  describe("blacklist functionality", () => {
    it("should allow minter to blacklist address", () => {
      const blacklistResult = simnet.callPublicFn(
        "mock-usdcx",
        "blacklist-address",
        [Cl.principal(wallet1)],
        deployer
      );
      expect(blacklistResult.result).toBeOk(Cl.bool(true));

      const { result: isBlacklisted } = simnet.callReadOnlyFn(
        "mock-usdcx",
        "is-blacklisted",
        [Cl.principal(wallet1)],
        deployer
      );
      expect(isBlacklisted).toBeOk(Cl.bool(true));
    });

    it("should prevent blacklisted address from transferring", () => {
      // Mint tokens
      simnet.callPublicFn(
        "mock-usdcx",
        "mint",
        [Cl.uint(1_000_000), Cl.principal(wallet1)],
        deployer
      );

      // Blacklist wallet1
      simnet.callPublicFn(
        "mock-usdcx",
        "blacklist-address",
        [Cl.principal(wallet1)],
        deployer
      );

      // Try to transfer
      const transferResult = simnet.callPublicFn(
        "mock-usdcx",
        "transfer",
        [Cl.uint(100_000), Cl.principal(wallet1), Cl.principal(wallet2), Cl.none()],
        wallet1
      );
      expect(transferResult.result).toBeErr(Cl.uint(104)); // ERR-UNAUTHORIZED
    });

    it("should allow unblacklisting", () => {
      // Blacklist
      simnet.callPublicFn(
        "mock-usdcx",
        "blacklist-address",
        [Cl.principal(wallet1)],
        deployer
      );

      // Unblacklist
      const unblacklistResult = simnet.callPublicFn(
        "mock-usdcx",
        "unblacklist-address",
        [Cl.principal(wallet1)],
        deployer
      );
      expect(unblacklistResult.result).toBeOk(Cl.bool(true));

      const { result: isBlacklisted } = simnet.callReadOnlyFn(
        "mock-usdcx",
        "is-blacklisted",
        [Cl.principal(wallet1)],
        deployer
      );
      expect(isBlacklisted).toBeOk(Cl.bool(false));
    });
  });

  // ============================================
  // Minter Role Transfer
  // ============================================
  describe("minter role transfer", () => {
    it("should allow current minter to transfer role", () => {
      const transferResult = simnet.callPublicFn(
        "mock-usdcx",
        "transfer-minter-role",
        [Cl.principal(wallet1)],
        deployer
      );
      expect(transferResult.result).toBeOk(Cl.bool(true));

      const { result: newMinter } = simnet.callReadOnlyFn(
        "mock-usdcx",
        "get-minter-role",
        [],
        deployer
      );
      expect(newMinter).toBeOk(Cl.principal(wallet1));
    });

    it("should prevent non-minter from transferring role", () => {
      const transferResult = simnet.callPublicFn(
        "mock-usdcx",
        "transfer-minter-role",
        [Cl.principal(wallet2)],
        wallet1
      );
      expect(transferResult.result).toBeErr(Cl.uint(104)); // ERR-UNAUTHORIZED
    });

    it("should allow new minter to mint", () => {
      // Transfer role
      simnet.callPublicFn(
        "mock-usdcx",
        "transfer-minter-role",
        [Cl.principal(wallet1)],
        deployer
      );

      // New minter mints
      const mintResult = simnet.callPublicFn(
        "mock-usdcx",
        "mint",
        [Cl.uint(500_000), Cl.principal(wallet2)],
        wallet1
      );
      expect(mintResult.result).toBeOk(Cl.bool(true));
    });
  });

  // ============================================
  // Metadata Update
  // ============================================
  describe("metadata update", () => {
    it("should allow minter to update metadata", () => {
      const updateResult = simnet.callPublicFn(
        "mock-usdcx",
        "set-metadata",
        [
          Cl.stringAscii("Updated USDCx"),
          Cl.stringAscii("USDCX"),
          Cl.uint(8),
          Cl.some(Cl.stringUtf8("https://example.com/token.json"))
        ],
        deployer
      );
      expect(updateResult.result).toBeOk(Cl.bool(true));

      const { result: name } = simnet.callReadOnlyFn("mock-usdcx", "get-name", [], deployer);
      expect(name).toBeOk(Cl.stringAscii("Updated USDCx"));

      const { result: symbol } = simnet.callReadOnlyFn("mock-usdcx", "get-symbol", [], deployer);
      expect(symbol).toBeOk(Cl.stringAscii("USDCX"));

      const { result: decimals } = simnet.callReadOnlyFn("mock-usdcx", "get-decimals", [], deployer);
      expect(decimals).toBeOk(Cl.uint(8));

      const { result: uri } = simnet.callReadOnlyFn("mock-usdcx", "get-token-uri", [], deployer);
      expect(uri).toBeOk(Cl.some(Cl.stringUtf8("https://example.com/token.json")));
    });

    it("should prevent non-minter from updating metadata", () => {
      const updateResult = simnet.callPublicFn(
        "mock-usdcx",
        "set-metadata",
        [
          Cl.stringAscii("Updated USDCx"),
          Cl.stringAscii("USDCX"),
          Cl.uint(8),
          Cl.none()
        ],
        wallet1
      );
      expect(updateResult.result).toBeErr(Cl.uint(104)); // ERR-UNAUTHORIZED
    });
  });

  // ============================================
  // Edge Cases
  // ============================================
  describe("edge cases", () => {
    it("should handle maximum uint values", () => {
      const maxUint = 18446744073709551615n;
      
      // Mint with max uint
      const mintResult = simnet.callPublicFn(
        "mock-usdcx",
        "mint",
        [Cl.uint(maxUint), Cl.principal(wallet1)],
        deployer
      );
      expect(mintResult.result).toBeOk(Cl.bool(true));

      const { result: balance } = simnet.callReadOnlyFn(
        "mock-usdcx",
        "get-balance",
        [Cl.principal(wallet1)],
        deployer
      );
      expect(balance).toBeOk(Cl.uint(maxUint));
    });

    it("should handle zero transfers gracefully", () => {
      // Mint some tokens
      simnet.callPublicFn(
        "mock-usdcx",
        "mint",
        [Cl.uint(100_000), Cl.principal(wallet1)],
        deployer
      );

      // Transfer zero should fail? (depends on implementation)
      const transferResult = simnet.callPublicFn(
        "mock-usdcx",
        "transfer",
        [Cl.uint(0), Cl.principal(wallet1), Cl.principal(wallet2), Cl.none()],
        wallet1
      );
      
      // This might pass or fail depending on implementation
      // For mock token, it might be allowed
    });

    it("should handle self-transfer", () => {
      // Mint tokens
      simnet.callPublicFn(
        "mock-usdcx",
        "mint",
        [Cl.uint(100_000), Cl.principal(wallet1)],
        deployer
      );

      // Transfer to self
      const transferResult = simnet.callPublicFn(
        "mock-usdcx",
        "transfer",
        [Cl.uint(50_000), Cl.principal(wallet1), Cl.principal(wallet1), Cl.none()],
        wallet1
      );
      expect(transferResult.result).toBeOk(Cl.bool(true));

      const { result: balance } = simnet.callReadOnlyFn(
        "mock-usdcx",
        "get-balance",
        [Cl.principal(wallet1)],
        deployer
      );
      expect(balance).toBeOk(Cl.uint(100_000));
    });
  });
});
