import { describe, expect, it } from "vitest";
import { categoryAllowed, hasFeature, priceFor, sanitizeAddons } from "./pricing";

describe("Preise", () => {
  it("berechnet Monats- und Jahrespreise mit Add-ons", () => {
    expect(priceFor("starter", "monat")).toBe(29);
    expect(priceFor("pro", "jahr")).toBe(790);
    expect(priceFor("pro", "monat", ["insolvenz", "alarm"])).toBe(140);
    expect(priceFor("pro", "jahr", ["alarm"])).toBe(910);
  });

  it("lässt nur passende Add-ons zu", () => {
    expect(sanitizeAddons("business", ["insolvenz", "team", "team", "x"])).toEqual(["team"]);
    expect(sanitizeAddons("starter", "nope")).toEqual([]);
  });

  it("schaltet Funktionen je Tarif frei", () => {
    expect(categoryAllowed("starter", [], "elektronik")).toBe(true);
    expect(categoryAllowed("starter", [], "vorbestellung")).toBe(false);
    expect(categoryAllowed("starter", ["insolvenz"], "insolvenz")).toBe(true);
    expect(categoryAllowed("pro", [], "vorbestellung")).toBe(true);
    expect(hasFeature("business", [], "insolvenz")).toBe(true);
    expect(hasFeature(null, [], "autopilot")).toBe(false);
  });
});
