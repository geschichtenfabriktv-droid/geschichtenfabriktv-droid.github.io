import { describe, expect, it } from "vitest";
import { parseSitemap } from "@/server/court-auctions";

describe("Justiz-Auktion", () => {
  it("liest Titel und Link aus der Sitemap", () => {
    const xml = `<urlset><url>
  <loc>https://www.justiz-auktion.de/Rolex-Oyster-Pepetual-Datejust-213574</loc>
  <lastmod>2026-10-06T18:50:08+00:00</lastmod>
</url><url>
  <loc>https://www.justiz-auktion.de/BMW-116d-213829</loc>
</url><url><loc>https://www.justiz-auktion.de/impressum.php</loc></url></urlset>`;
    expect(parseSitemap(xml)).toEqual([
      { id: "ja-213574", title: "Rolex Oyster Pepetual Datejust", url: "https://www.justiz-auktion.de/Rolex-Oyster-Pepetual-Datejust-213574", platform: "Justiz-Auktion", updatedAt: "2026-10-06T18:50:08+00:00" },
      { id: "ja-213829", title: "BMW 116d", url: "https://www.justiz-auktion.de/BMW-116d-213829", platform: "Justiz-Auktion", updatedAt: null },
    ]);
  });
});
