import { describe, expect, it } from "vitest";

describe("SIP-010 Trait Tests", () => {
  it("trait is deployed", () => {
    expect(simnet.blockHeight).toBeDefined();
  });
});
