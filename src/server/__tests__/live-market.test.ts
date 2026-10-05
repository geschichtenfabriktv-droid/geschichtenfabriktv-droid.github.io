import { describe, expect, it } from "vitest";
import { summarize } from "@/server/live-market";

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
