import { describe, expect, it } from "vitest";
import { NEWS_FEEDS, parseNews, releaseDateFrom } from "@/server/release-news";

const now = new Date("2026-10-06T12:00:00Z");
const games = NEWS_FEEDS.find((f) => f.topic === "Spiele & Konsolen")!;
const tech = NEWS_FEEDS.find((f) => f.strict)!;

describe("Hersteller-News", () => {
  it("liest RSS mit Termin aus dem Titel", () => {
    const xml = `<rss><channel><title>Blog</title>
      <item><title>Warhammer Survivors: Release am 10. November bestätigt</title><link>https://blog.example.com/a/</link><pubDate>Mon, 05 Oct 2026 15:00:00 +0000</pubDate></item>
      <item><title>Alter Beitrag</title><link>https://blog.example.com/b/</link><pubDate>Mon, 01 Jun 2026 15:00:00 +0000</pubDate></item>
    </channel></rss>`;
    const items = parseNews(xml, games, now);
    expect(items).toHaveLength(1);
    expect(items[0]).toMatchObject({ title: "Warhammer Survivors: Release am 10. November bestätigt", url: "https://blog.example.com/a/", releaseDate: "2026-11-10", preorder: true });
  });

  it("liest Atom mit CDATA und filtert Technik-Feeds auf Produkte", () => {
    const xml = `<feed>
      <entry><updated><![CDATA[2026-10-06T09:01:35Z]]></updated><title><![CDATA[Das neue iPhone 18 Pro ist ab sofort erhältlich]]></title><link href="https://news.example.com/x/"/></entry>
      <entry><updated><![CDATA[2026-10-06T09:01:35Z]]></updated><title><![CDATA[Serie gewinnt Preise &amp; Ehrungen]]></title><link href="https://news.example.com/y/"/></entry>
    </feed>`;
    const items = parseNews(xml, tech, now);
    expect(items.map((i) => i.url)).toEqual(["https://news.example.com/x/"]);
    expect(items[0]!.releaseDate).toBeNull();
  });

  it("legt Termine ohne Jahr in die Zukunft", () => {
    expect(releaseDateFrom("Erscheint am 15. Januar", new Date("2026-11-20T00:00:00Z"))).toBe("2027-01-15");
    expect(releaseDateFrom("Ab 03.12.2026 im Handel", now)).toBe("2026-12-03");
    expect(releaseDateFrom("Kein Datum", now)).toBeNull();
  });
});
