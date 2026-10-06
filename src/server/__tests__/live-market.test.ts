import { describe, expect, it } from "vitest";
import { findDeals, summarize } from "@/server/live-market";

describe("Live-Marktdaten", () => {
  it("entfernt Ausreißer und liefert Median", () => {
    const s = summarize([100, 102, 98, 101, 99, 103, 97, 5, 900]);
    expect(s).not.toBeNull();
    expect(s!.median).toBeGreaterThan(97);
    expect(s!.median).toBeLessThan(103);
  });

  it("braucht genug Angebote", () => {
    expect(summarize([10, 11])).toBeNull();
  });
});

describe("Chancen aus eBay-Angeboten", () => {
  const item = { query: "Steam Deck OLED", brand: "Valve", categoryId: "gaming" as const };
  const listing = (id: string, price: number, title = "Valve Steam Deck OLED 1TB") => ({ itemId: id, title, price, shipping: 0, url: `https://www.ebay.de/itm/${id}` });
  const now = new Date("2026-10-06T12:00:00Z");

  it("findet nur Angebote deutlich unter dem Median und erfindet keine Werte", () => {
    const listings = [500, 505, 510, 495, 498, 502, 507, 499, 503, 420, 150].map((p, i) => listing(String(i), p));
    const deals = findDeals(item, listings, 240, now);
    expect(deals.map((d) => d.source.price)).toEqual([420]);
    const d = deals[0]!;
    expect(d.source.url).toBe("https://www.ebay.de/itm/9");
    expect(d.source.stock).toBeNull();
    expect(d.market.sales30d).toBeNull();
    expect(d.market.trend30d).toBeNull();
    expect(d.market.history).toEqual([]);
    expect(d.market.activeListings).toBe(240);
    expect(d.market.live).toBe(true);
  });

  it("ignoriert fremde Produkte und zu wenige Angebote", () => {
    expect(findDeals(item, [listing("a", 100, "Hülle für Switch")], 1, now)).toEqual([]);
    expect(findDeals(item, [500, 505, 420].map((p, i) => listing(String(i), p)), 3, now)).toEqual([]);
  });
});
