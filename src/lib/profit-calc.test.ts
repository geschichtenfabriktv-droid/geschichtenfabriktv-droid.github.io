import { describe, expect, it } from "vitest";
import { calcProfit } from "./profit-calc";

describe("calcProfit", () => {
  it("rechnet das Beispiel aus dem eBay-Gebühren-Ratgeber nach", () => {
    const r = calcProfit({ buy: 80, sell: 120, buyerShipping: 6.99, ownShipping: 5.5, feePct: 11, fixedFee: 0.35, adPct: 3 });
    expect(r.total).toBe(126.99);
    expect(r.fees).toBe(18.13);
    expect(r.profit).toBe(23.36);
    expect(r.roi).toBe(29.2);
  });

  it("liefert einen Break-even, bei dem der Gewinn null ist", () => {
    const input = { buy: 40, sell: 0, buyerShipping: 4.99, ownShipping: 4.5, feePct: 11, fixedFee: 0.35, adPct: 0 };
    const be = calcProfit(input).breakEven!;
    expect(Math.abs(calcProfit({ ...input, sell: be }).profit)).toBeLessThanOrEqual(0.01);
  });

  it("ignoriert negative und ungültige Eingaben", () => {
    const r = calcProfit({ buy: -5, sell: Number.NaN, buyerShipping: 0, ownShipping: 0, feePct: 200, fixedFee: 0, adPct: 0 });
    expect(r.profit).toBe(0);
    expect(r.roi).toBeNull();
    expect(r.breakEven).toBeNull();
  });
});
