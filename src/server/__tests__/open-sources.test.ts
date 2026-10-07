import { describe, expect, it } from "vitest";
import { analyzeDeal } from "@/lib/engine/analysis";
import { parseAuthoritySitemap } from "@/server/sources/authority-auctions";
import { calendarQuery, parseCalendar } from "@/server/sources/release-calendar";
import { cardDeal, isPhysicalSet, setNews, type TcgCard } from "@/server/sources/trading-cards";

const now = new Date("2026-10-07T12:00:00Z");

const card = (cm: Record<string, number | null>, extra: Partial<TcgCard> = {}): TcgCard => ({
  id: "me05-114",
  name: "Mega Zeraora ex",
  rarity: "Special illustration rare",
  set: { id: "me05", name: "Pitch Black" },
  pricing: { cardmarket: { updated: "2026-10-06T09:52:39.603Z", ...cm } },
  ...extra,
});

describe("Sammelkarten", () => {
  it("meldet eine Chance, wenn das günstigste Angebot klar unter dem Marktpreis liegt", () => {
    const d = cardDeal(card({ low: 30, trend: 48.3, avg7: 46.74, avg30: 48.21 }), now)!;
    expect(d).toMatchObject({ id: "tcg-me05-114", categoryId: "sammler", kind: "arbitrage", source: { platform: "Cardmarket", price: 30 } });
    expect(d.market.medianPrice).toBe(46.74);
    expect(d.title).toContain("Pitch Black");
    expect(d.source.url).toMatch(/^https:\/\/www\.cardmarket\.com\/de\/Pokemon\/Products\/Search\?searchString=Mega%20Zeraora%20ex$/);
    const a = analyzeDeal(d, now);
    expect(a.probability).toBeGreaterThan(0);
    expect(a.probability).toBeLessThanOrEqual(0.97);
  });

  it("ignoriert kleine Abstände, billige Karten und fehlende Preise", () => {
    expect(cardDeal(card({ low: 40, trend: 48.3, avg7: 46.74, avg30: 48.21 }), now)).toBeNull();
    expect(cardDeal(card({ low: 2, trend: 9, avg7: 9, avg30: 9 }), now)).toBeNull();
    expect(cardDeal(card({ low: null, trend: 48, avg30: 48 }), now)).toBeNull();
    expect(cardDeal(card({}, { pricing: null }), now)).toBeNull();
  });

  it("nimmt den vorsichtigsten Marktpreis, damit Ausreißer nach oben nicht zählen", () => {
    expect(cardDeal(card({ low: 75, trend: 200, avg7: 100, avg30: 210 }), now)).toBeNull();
  });

  it("zeigt neue Erweiterungen als Neuheit, ohne digitale App-Sets", () => {
    const sets = [
      { id: "30th", name: "30th Celebration", releaseDate: "2026-09-16", serie: { id: "me", name: "Mega Evolution" } },
      { id: "B2a", name: "Paldean Wonders", releaseDate: "2026-09-30", serie: { id: "tcgp", name: "Pokémon TCG Pocket" } },
      { id: "me04", name: "Chaos Rising", releaseDate: "2026-05-22", serie: { id: "me", name: "Mega Evolution" } },
      { id: "me06", name: "Next", releaseDate: "2026-11-14", serie: { id: "me", name: "Mega Evolution" } },
    ];
    expect(isPhysicalSet(sets[1]!)).toBe(false);
    const news = setNews(sets, now);
    expect(news.map((n) => n.id)).toEqual(["tcg-set-30th", "tcg-set-me06"]);
    expect(news[1]).toMatchObject({ topic: "Sammeln", releaseDate: "2026-11-14", preorder: true, publishedAt: now.toISOString() });
    expect(news[0]!.title).toContain("ist erschienen");
  });
});

describe("Erscheinungskalender", () => {
  it("fragt nur tagesgenaue Termine ab", () => {
    expect(calendarQuery()).toContain("wikibase:timePrecision 11");
  });

  it("nimmt je Titel den frühesten Termin und den deutschen Artikel", () => {
    const b = (item: string, label: string, date: string, extra: Record<string, string> = {}) => ({
      item: { value: `http://www.wikidata.org/entity/${item}` },
      itemLabel: { value: label },
      date: { value: `${date}T00:00:00Z` },
      mod: { value: "2026-10-05T08:00:00Z" },
      ...Object.fromEntries(Object.entries(extra).map(([k, v]) => [k, { value: v }])),
    });
    const items = parseCalendar(
      {
        results: {
          bindings: [
            b("Q23648408", "Grand Theft Auto VI", "2026-12-01", { platforms: "PlayStation 5, Xbox Series X/S", deArticle: "https://de.wikipedia.org/wiki/Grand_Theft_Auto_VI" }),
            b("Q23648408", "Grand Theft Auto VI", "2026-11-19", { platforms: "PlayStation 5, Xbox Series X/S", deArticle: "https://de.wikipedia.org/wiki/Grand_Theft_Auto_VI" }),
            b("Q4812026", "Asylum", "2026-10-30", { platforms: "Nintendo Switch 2", enArticle: "https://en.wikipedia.org/wiki/Asylum" }),
            b("Q5", "Nur PC", "2026-10-30", { platforms: "Microsoft Windows", enArticle: "https://en.wikipedia.org/wiki/X" }),
            b("Q6", "Ohne Artikel", "2026-10-30", { platforms: "PlayStation 5" }),
            b("Q7", "Neue Konsole", "2026-11-01", { kind: "http://www.wikidata.org/entity/Q8076", deArticle: "https://de.wikipedia.org/wiki/K" }),
            b("Q999", "Q999", "2026-10-30", { platforms: "PlayStation 5", enArticle: "https://en.wikipedia.org/wiki/Y" }),
          ],
        },
      },
      now,
    );
    expect(items.map((i) => i.id)).toEqual(["cal-Q4812026", "cal-Q7", "cal-Q23648408"]);
    expect(items[0]).toMatchObject({ url: "https://en.wikipedia.org/wiki/Asylum", releaseDate: "2026-10-30" });
    expect(items[1]!.title).toBe("Neue Konsole: Erscheinungstermin");
    expect(items[2]).toMatchObject({
      title: "Grand Theft Auto VI (PlayStation 5, Xbox Series X/S): Erscheinungstermin",
      url: "https://de.wikipedia.org/wiki/Grand_Theft_Auto_VI",
      releaseDate: "2026-11-19",
      topic: "Spiele & Konsolen",
      preorder: true,
    });
  });
});

describe("Behördenauktionen", () => {
  it("liest Titel und Link aus der Produkt-Sitemap, nur kürzlich geänderte", () => {
    const xml = `<?xml version="1.0"?><urlset>
      <url>
        <loc>https://www.zoll-auktion.de/auktion/produkt/1_Mercedes_Benz_Sprinter_RTW_mit_Kofferaufbau_HH2747/946159</loc>
        <lastmod>2026-09-30T12:05:00+02:00</lastmod><priority>0.8</priority>
      </url>
      <url><loc>https://www.zoll-auktion.de/auktion/produkt/3_Apple_iPhone_15/946200</loc><lastmod>2026-10-06T10:00:00+02:00</lastmod></url>
      <url><loc>https://www.zoll-auktion.de/auktion/produkt/Alt/900000</loc><lastmod>2026-08-01T10:00:00+02:00</lastmod></url>
      <url><loc>https://www.zoll-auktion.de/auktion/info.php</loc><lastmod>2026-10-06T10:00:00+02:00</lastmod></url>
    </urlset>`;
    const links = parseAuthoritySitemap(xml, now);
    expect(links).toEqual([
      { id: "za-946159", title: "Mercedes Benz Sprinter RTW mit Kofferaufbau HH2747", url: "https://www.zoll-auktion.de/auktion/produkt/1_Mercedes_Benz_Sprinter_RTW_mit_Kofferaufbau_HH2747/946159", platform: "Behördenauktion", updatedAt: "2026-09-30T10:05:00.000Z" },
      { id: "za-946200", title: "3 × Apple iPhone 15", url: "https://www.zoll-auktion.de/auktion/produkt/3_Apple_iPhone_15/946200", platform: "Behördenauktion", updatedAt: "2026-10-06T08:00:00.000Z" },
    ]);
  });
});
