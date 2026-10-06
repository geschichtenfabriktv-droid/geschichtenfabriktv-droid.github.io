import { describe, expect, it } from "vitest";
import { feedDeals, matches, parseCsv, parseFeed } from "@/server/awin";
import { parseNetbid } from "@/server/court-auctions";
import { dailyHistory, keepaDeal, keepaTime } from "@/server/keepa";

const now = new Date("2026-10-06T12:00:00Z");
const toKeepa = (d: Date) => d.getTime() / 60_000 - 21_564_000;

describe("Keepa", () => {
  it("rechnet Keepa-Zeit um", () => {
    expect(keepaTime(0).toISOString()).toBe("2011-01-01T00:00:00.000Z");
  });

  it("baut eine Chance nur bei deutlichem Preissturz und übernimmt den echten Verlauf", () => {
    const t1 = toKeepa(new Date("2026-08-01T00:00:00Z"));
    const t2 = toKeepa(new Date("2026-10-05T00:00:00Z"));
    const product = {
      asin: "B0TEST1234",
      title: "Valve Steam Deck OLED 1TB",
      csv: [[t1, 56900, t2, 45900]],
      stats: { current: [45900, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 12], avg30: [52000], avg90: [56000], salesRankDrops30: 40 },
    };
    const item = { query: "Steam Deck OLED", brand: "Valve", categoryId: "gaming" as const };
    const d = keepaDeal(item, product, now)!;
    expect(d.source).toMatchObject({ platform: "Amazon", price: 459, url: "https://www.amazon.de/dp/B0TEST1234" });
    expect(d.market).toMatchObject({ medianPrice: 560, sales30d: 40, activeListings: 12, live: true });
    expect(d.market.history.at(-1)).toEqual({ date: "2026-10-05", price: 459 });
    expect(keepaDeal(item, { ...product, stats: { ...product.stats, current: [55000] } }, now)).toBeNull();
  });

  it("liefert ohne Reihe keinen Verlauf", () => {
    expect(dailyHistory(null, now)).toEqual([]);
  });
});

describe("Awin-Feed", () => {
  it("liest CSV mit Anführungszeichen", () => {
    expect(parseCsv('a,b\n"x, y","z ""q"""\n')).toEqual([["a", "b"], ["x, y", 'z "q"']]);
  });

  it("findet Händlerangebote unter dem eBay-Marktpreis", () => {
    const csv = "aw_product_id,product_name,search_price,merchant_name,aw_deep_link,delivery_cost\n1,Valve Steam Deck OLED 1 TB,449.00,MediaMarkt,https://www.awin1.com/a,0\n2,Steam Deck OLED Hülle,19.99,Otto,https://www.awin1.com/b,0\n3,Valve Steam Deck OLED 512 GB,549,Saturn,https://www.awin1.com/c,0";
    const offers = parseFeed(csv);
    expect(offers).toHaveLength(3);
    expect(matches({ query: "Steam Deck OLED", brand: "Valve", categoryId: "gaming" }, offers[0]!.title)).toBe(true);
    const stats = new Map([["Steam Deck OLED", { median: 569, stdDev: 20, listings: 80 }]]);
    const deals = feedDeals(offers, stats, now);
    expect(deals.map((d) => [d.source.platform, d.source.price])).toEqual([["MediaMarkt", 449]]);
    expect(feedDeals(offers, new Map(), now)).toEqual([]);
  });
});

describe("NetBid", () => {
  it("nimmt nur kürzlich geänderte Auktionen", () => {
    const xml = `<urlset><url><loc>https://www.netbid.com/de/auktionen/29134342-28532743-metallbearbeitungsmaschinen</loc><lastmod>2026-10-05</lastmod></url><url><loc>https://www.netbid.com/de/auktionen/1-2-alt</loc><lastmod>2025-06-01</lastmod></url></urlset>`;
    expect(parseNetbid(xml, now)).toEqual([
      { id: "nb-29134342", title: "Metallbearbeitungsmaschinen", url: "https://www.netbid.com/de/auktionen/29134342-28532743-metallbearbeitungsmaschinen", platform: "NetBid", updatedAt: "2026-10-05" },
    ]);
  });
});

describe("Länder", () => {
  it("erlaubt Österreich und Schweiz nur im Business-Tarif", async () => {
    const { countriesAllowed } = await import("@/lib/pricing");
    expect(countriesAllowed("starter")).toEqual(["DE"]);
    expect(countriesAllowed("pro")).toEqual(["DE"]);
    expect(countriesAllowed("business")).toEqual(["DE", "AT", "CH"]);
    expect(countriesAllowed(null)).toEqual([]);
  });

  it("liest EZB-Kurse", async () => {
    const { parseEcb } = await import("@/server/fx");
    const rates = parseEcb(`<Cube currency='USD' rate='1.0841'/><Cube currency='CHF' rate='0.9412'/>`);
    expect(rates.get("CHF")).toBe(0.9412);
  });
});
