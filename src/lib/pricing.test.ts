import { describe, expect, it } from "vitest";
import { categoryAllowed, COUNTRY_BULLET, countriesAllowed, getPlan, hasFeature, marketplaceLimit, planBullets, priceFor, sanitizeAddons } from "./pricing";

describe("Preise", () => {
  it("berechnet Monats- und Jahrespreise mit Add-ons", () => {
    expect(priceFor("starter", "monat")).toBe(29);
    expect(priceFor("pro", "jahr")).toBe(790);
    expect(priceFor("pro", "monat", ["insolvenz"])).toBe(128);
    expect(priceFor("starter", "jahr", ["marktplatz"])).toBe(380);
  });

  it("lässt nur passende Add-ons zu", () => {
    expect(sanitizeAddons("starter", ["marktplatz", "insolvenz", "marktplatz", "x"])).toEqual(["insolvenz", "marktplatz"]);
    expect(sanitizeAddons("business", ["insolvenz", "marktplatz"])).toEqual([]);
    expect(sanitizeAddons("starter", "nope")).toEqual([]);
  });

  it("schaltet Funktionen je Tarif frei", () => {
    expect(categoryAllowed("starter", [], "elektronik")).toBe(true);
    expect(categoryAllowed("starter", [], "vorbestellung")).toBe(false);
    expect(categoryAllowed("starter", ["insolvenz"], "insolvenz")).toBe(true);
    expect(categoryAllowed("pro", [], "vorbestellung")).toBe(true);
    expect(hasFeature("business", [], "insolvenz")).toBe(true);
    expect(hasFeature(null, [], "autopilot")).toBe(false);
    expect(marketplaceLimit("starter", [])).toBe(1);
    expect(marketplaceLimit("starter", ["marktplatz"])).toBe(2);
    expect(marketplaceLimit(null, [])).toBe(0);
  });

  it("bewirbt Österreich und Schweiz nur im Business-Tarif und nur, wenn sie live sind", () => {
    const business = getPlan("business")!;
    expect(planBullets(business, false)).not.toContain(COUNTRY_BULLET);
    expect(planBullets(business, true)).toContain(COUNTRY_BULLET);
    expect(planBullets(getPlan("pro")!, true)).not.toContain(COUNTRY_BULLET);
    // Das Versprechen passt zu den Rechten: nur Business bekommt die Länder.
    expect(countriesAllowed("business")).toEqual(["DE", "AT", "CH"]);
    expect(countriesAllowed("pro")).toEqual(["DE"]);
  });
});
