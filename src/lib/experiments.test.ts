import { describe, expect, it } from "vitest";
import { AB_CSS, AB_HEAD_SCRIPT, confidence, formatAbTag, parseAbTag } from "./experiments";

describe("A/B-Tests", () => {
  it("liest und schreibt das Varianten-Kürzel und verwirft Unbekanntes", () => {
    expect(parseAbTag("start.b~karten.a")).toEqual({ start: "b", karten: "a" });
    expect(parseAbTag("start.z~fremd.a~karten.b")).toEqual({ karten: "b" });
    expect(parseAbTag(42)).toEqual({});
    expect(parseAbTag("x".repeat(500))).toEqual({});
    expect(formatAbTag({ karten: "b", start: "a" })).toBe("start.a~karten.b");
    expect(formatAbTag({})).toBe("");
  });

  it("setzt im Kopf-Skript für jeden Test eine gültige Variante", () => {
    const attrs = new Map<string, string>();
    const document = { documentElement: { setAttribute: (k: string, v: string) => attrs.set(k, v) } };
    new Function("document", AB_HEAD_SCRIPT)(document);
    expect(["a", "b"]).toContain(attrs.get("data-ab-start"));
    expect(["a", "b"]).toContain(attrs.get("data-ab-karten"));
  });

  it("zeigt ohne JavaScript Variante A und blendet B aus", () => {
    expect(AB_CSS).toContain('html:not([data-ab-start="b"]) .ab-start-b{display:none!important}');
    expect(AB_CSS).toContain('html[data-ab-start]:not([data-ab-start="a"]) .ab-start-a{display:none!important}');
  });

  it("berechnet die Sicherheit eines Unterschieds", () => {
    expect(confidence(0, 0, 1, 10)).toBeNull();
    expect(confidence(50, 1000, 52, 1000)!).toBeLessThan(0.5);
    expect(confidence(50, 1000, 90, 1000)!).toBeGreaterThan(0.99);
  });
});
