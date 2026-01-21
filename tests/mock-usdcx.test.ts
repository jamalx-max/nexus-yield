import { describe, expect, it } from "vitest";
import { Cl } from "@stacks/transactions";

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const wallet1 = accounts.get("wallet_1")!;

describe("Mock USDCx Tests", () => {
  it("can mint tokens", () => {
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
  });

  it("returns correct token metadata", () => {
    const nameResult = simnet.callReadOnlyFn("mock-usdcx", "get-name", [], deployer);
    expect(nameResult.result).toBeOk(Cl.stringAscii("USDCx"));

    const symbolResult = simnet.callReadOnlyFn("mock-usdcx", "get-symbol", [], deployer);
    expect(symbolResult.result).toBeOk(Cl.stringAscii("USDCx"));

    const decimalsResult = simnet.callReadOnlyFn("mock-usdcx", "get-decimals", [], deployer);
    expect(decimalsResult.result).toBeOk(Cl.uint(6));
  });

  it("allows transfers", () => {
    // Mint to wallet1
    simnet.callPublicFn("mock-usdcx", "mint", [Cl.uint(1_000_000), Cl.principal(wallet1)], deployer);

    // Transfer
    const wallet2 = accounts.get("wallet_2")!;
    const transferResult = simnet.callPublicFn(
      "mock-usdcx",
      "transfer",
      [Cl.uint(500_000), Cl.principal(wallet1), Cl.principal(wallet2), Cl.none()],
      wallet1
    );
    expect(transferResult.result).toBeOk(Cl.bool(true));

    // Check balances
    const { result: bal1 } = simnet.callReadOnlyFn(
      "mock-usdcx",
      "get-balance",
      [Cl.principal(wallet1)],
      deployer
    );
    expect(bal1).toBeOk(Cl.uint(500_000));

    const { result: bal2 } = simnet.callReadOnlyFn(
      "mock-usdcx",
      "get-balance",
      [Cl.principal(wallet2)],
      deployer
    );
    expect(bal2).toBeOk(Cl.uint(500_000));
  });
});
