/** Grobe Art einer Auktion, abgeleitet aus Stichwörtern im Titel (nur zum Filtern). */
export const AUCTION_KINDS = ["Fahrzeuge", "Uhren & Schmuck", "Maschinen & Werkzeug", "Elektronik & IT", "Büro & Einrichtung", "Immobilien & Grundstücke", "Sonstiges"] as const;
export type AuctionKind = (typeof AUCTION_KINDS)[number];

const RULES: [AuctionKind, RegExp][] = [
  ["Fahrzeuge", /\b(pkw|lkw|kfz|auto\b|fahrzeug|anh(ä|ae|)nger|transporter|motorrad|roller|wohnmobil|wohnwagen|traktor|stapler|bmw|audi|mercedes|vw|volkswagen|opel|ford\b|skoda|seat\b|renault|peugeot|toyota|fiat|porsche|tesla|jaguar|citro(e|ë)n|hyundai|kia\b|mazda|nissan|volvo|mini\b)/i],
  ["Uhren & Schmuck", /\b(uhr|uhren|armbanduhr|rolex|omega|breitling|cartier|tag heuer|armani|festina|ring\b|kette|armband|ohrring|schmuck|gold|silber|diamant|brillant|m(ü|ue|u)nze[n]?|barren)/i],
  ["Maschinen & Werkzeug", /\b(maschine[n]?|werkzeug|s(ä|ae|a)ge|fr(ä|ae|a)se|drehbank|presse|kompressor|bagger|kran|hochdruckreiniger|schwei(ß|ss)|bohr|metallbearbeitung|cnc|druck(system|maschine)|backstube|anlage|industrie|lager(technik|ausstattung)?)/i],
  ["Elektronik & IT", /\b(laptop|notebook|computer|pc\b|tablet|ipad|iphone|smartphone|handy|samsung|apple|kamera|objektiv|konsole|playstation|xbox|nintendo|fernseher|tv\b|monitor|drucker|server|lautsprecher|kopfh(ö|oe|o)rer|elektronik)/i],
  ["Büro & Einrichtung", /\b(b(ü|ue|u)ro|m(ö|oe|o)bel|schreibtisch|stuhl|st(ü|ue|u)hle|schrank|regal|sofa|tisch|einrichtung|lampe|teppich|k(ü|ue|u)che)/i],
  ["Immobilien & Grundstücke", /\b(grundst(ü|ue|u)ck|immobilie|wohnung|haus\b|geb(ä|ae|a)ude|garage)/i],
];

export function auctionKind(title: string): AuctionKind {
  for (const [kind, re] of RULES) if (re.test(title)) return kind;
  return "Sonstiges";
}
