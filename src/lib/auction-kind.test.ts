import { describe, expect, it } from "vitest";
import { auctionKind } from "./auction-kind";

describe("Auktionsart", () => {
  it("ordnet typische Titel zu", () => {
    expect(auctionKind("BMW 116d")).toBe("Fahrzeuge");
    expect(auctionKind("KFZAnhnger der Marke Martz")).toBe("Fahrzeuge");
    expect(auctionKind("Rolex Oyster Pepetual Datejust")).toBe("Uhren & Schmuck");
    expect(auctionKind("Metallbearbeitungsmaschinen")).toBe("Maschinen & Werkzeug");
    expect(auctionKind("Apple iPad Air")).toBe("Elektronik & IT");
    expect(auctionKind("Konvolut Bücher")).toBe("Sonstiges");
  });
});
