import type { Deal, InsolvencyLot, LotType } from "../domain/types";

/**
 * Kompakte Beschreibung der Demo-Deals. Preise, Marktdaten und Verfahren sind realistisch
 * modelliert, aber Beispieldaten. Echte Quellen werden über eine DataSource angebunden.
 */
export interface DealSeed {
  id: string;
  title: string;
  brand: string;
  categoryId: Deal["categoryId"];
  kind?: Deal["kind"];
  buy: [platform: string, price: number, shipping: number, stock: number];
  sell: [platform: string, feeRate: number, fixedFee: number, shipping: number];
  /** Median, Streuung, Verkäufe 30 T, aktive Angebote, Trend 30 T */
  market: [median: number, stdDev: number, sales30d: number, activeListings: number, trend30d: number];
  releaseInDays?: number;
  limited?: boolean;
  detectedMinutesAgo: number;
}

const EBAY: DealSeed["sell"] = ["eBay", 0.11, 0.35, 5.49];
const AMAZON: DealSeed["sell"] = ["Amazon", 0.15, 0.99, 0];
const STOCKX: DealSeed["sell"] = ["StockX", 0.09, 0, 5];
const CARDMARKET: DealSeed["sell"] = ["Cardmarket", 0.05, 0, 6.5];
const KLEINANZEIGEN: DealSeed["sell"] = ["Kleinanzeigen", 0.0, 0, 6.99];
const DIRECT: DealSeed["sell"] = ["Direktkunde", 0.03, 0.25, 0];

export const DEAL_SEEDS: DealSeed[] = [
  // Elektronik
  { id: "sony-wh1000xm6", title: "Sony WH-1000XM6 Noise Cancelling", brand: "Sony", categoryId: "elektronik", buy: ["MediaMarkt Outlet", 279, 0, 14], sell: EBAY, market: [369, 18, 212, 64, 0.02], detectedMinutesAgo: 12 },
  { id: "airpods-pro-3", title: "Apple AirPods Pro 3", brand: "Apple", categoryId: "elektronik", buy: ["Otto Aktion", 219, 0, 40], sell: AMAZON, market: [259, 9, 640, 220, -0.01], detectedMinutesAgo: 34 },
  { id: "garmin-fenix-8", title: "Garmin fenix 8 AMOLED 47 mm", brand: "Garmin", categoryId: "elektronik", buy: ["Händler-Abverkauf", 649, 4.99, 6], sell: EBAY, market: [819, 42, 88, 41, 0.03], detectedMinutesAgo: 51 },
  { id: "dji-mini-5", title: "DJI Mini 5 Pro Fly More Combo", brand: "DJI", categoryId: "elektronik", buy: ["Saturn Tagesdeal", 899, 0, 9], sell: EBAY, market: [1049, 61, 74, 52, 0.01], detectedMinutesAgo: 75 },
  { id: "kindle-colorsoft", title: "Kindle Colorsoft Signature", brand: "Amazon", categoryId: "elektronik", buy: ["Warehouse B-Ware", 169, 0, 3], sell: EBAY, market: [199, 14, 96, 70, -0.03], detectedMinutesAgo: 140 },
  { id: "samsung-s26-ultra", title: "Samsung Galaxy S26 Ultra 512 GB", brand: "Samsung", categoryId: "elektronik", buy: ["Tarif-Ablöse", 1029, 0, 5], sell: EBAY, market: [1189, 66, 140, 118, -0.04], detectedMinutesAgo: 210 },

  // Gaming
  { id: "switch2-mk-bundle", title: "Nintendo Switch 2 Mario Kart World Bundle", brand: "Nintendo", categoryId: "gaming", buy: ["Kaufland Aktion", 449, 0, 22], sell: EBAY, market: [519, 21, 410, 130, 0.04], detectedMinutesAgo: 8 },
  { id: "ps5-pro", title: "PlayStation 5 Pro Konsole", brand: "Sony", categoryId: "gaming", buy: ["Amazon Blitzangebot", 679, 0, 11], sell: KLEINANZEIGEN, market: [739, 32, 260, 190, -0.02], detectedMinutesAgo: 27 },
  { id: "steam-deck-oled", title: "Steam Deck OLED 1 TB", brand: "Valve", categoryId: "gaming", buy: ["Refurbished", 489, 0, 7], sell: EBAY, market: [569, 28, 120, 66, 0.01], detectedMinutesAgo: 95 },
  { id: "dualsense-edge", title: "DualSense Edge Wireless Controller", brand: "Sony", categoryId: "gaming", buy: ["Restposten", 149, 4.95, 30], sell: AMAZON, market: [189, 10, 330, 210, 0.0], detectedMinutesAgo: 180 },

  // Sneaker & Mode
  { id: "aj1-chicago-reimagined", title: "Air Jordan 1 Retro High OG 'Lost & Found'", brand: "Nike", categoryId: "sneaker", buy: ["SNKRS Restock", 189.99, 0, 2], sell: STOCKX, market: [289, 34, 520, 300, 0.05], limited: true, detectedMinutesAgo: 4 },
  { id: "nb-2002r", title: "New Balance 2002R Protection Pack", brand: "New Balance", categoryId: "sneaker", buy: ["Outlet Sale", 99, 4.95, 18], sell: STOCKX, market: [149, 16, 190, 140, 0.02], detectedMinutesAgo: 66 },
  { id: "arcteryx-beta", title: "Arc'teryx Beta AR Jacke", brand: "Arc'teryx", categoryId: "sneaker", buy: ["Saison-Abverkauf", 389, 0, 4], sell: ["Vinted", 0.05, 0.7, 6.5], market: [489, 45, 44, 38, 0.06], detectedMinutesAgo: 260 },

  // Sammlerstücke
  { id: "pkm-prismatic-etb", title: "Pokémon TCG Prismatic Evolutions Top-Trainer-Box", brand: "Pokémon", categoryId: "sammler", buy: ["Spielwarenhändler", 59.99, 4.99, 12], sell: CARDMARKET, market: [109, 12, 860, 410, 0.08], limited: true, detectedMinutesAgo: 15 },
  { id: "lego-titanic", title: "LEGO Icons 10294 Titanic (EOL)", brand: "LEGO", categoryId: "sammler", buy: ["Galeria Abverkauf", 499, 0, 3], sell: EBAY, market: [689, 48, 52, 33, 0.09], limited: true, detectedMinutesAgo: 44 },
  { id: "op-tcg-op09", title: "One Piece TCG OP-09 Booster Display", brand: "Bandai", categoryId: "sammler", buy: ["Import-Händler", 119, 7.9, 8], sell: CARDMARKET, market: [179, 20, 240, 160, 0.07], detectedMinutesAgo: 120 },
  { id: "hot-toys-mando", title: "Hot Toys Mandalorian 1:6 Figur", brand: "Hot Toys", categoryId: "sammler", buy: ["Sammlerauflösung", 220, 9.9, 1], sell: EBAY, market: [289, 39, 18, 24, -0.02], detectedMinutesAgo: 300 },

  // Haushalt
  { id: "dyson-v15", title: "Dyson V15 Detect Absolute", brand: "Dyson", categoryId: "haushalt", buy: ["Retourenware A-Ware", 399, 0, 9], sell: EBAY, market: [519, 30, 160, 96, 0.0], detectedMinutesAgo: 20 },
  { id: "thermomix-tm7", title: "Thermomix TM7", brand: "Vorwerk", categoryId: "haushalt", buy: ["Neu, privat (Gewinnspiel)", 1150, 0, 1], sell: KLEINANZEIGEN, market: [1349, 70, 70, 58, 0.01], detectedMinutesAgo: 88 },
  { id: "delonghi-eletta", title: "De'Longhi Eletta Explore Kaffeevollautomat", brand: "De'Longhi", categoryId: "haushalt", buy: ["Prospekt-Aktion", 599, 0, 15], sell: AMAZON, market: [719, 36, 120, 90, -0.01], detectedMinutesAgo: 160 },

  // Werkzeug
  { id: "makita-set", title: "Makita 18V Combo-Set 6-teilig (aufteilen)", brand: "Makita", categoryId: "werkzeug", buy: ["Baumarkt Set-Aktion", 549, 0, 6], sell: EBAY, market: [759, 55, 64, 40, 0.02], detectedMinutesAgo: 37 },
  { id: "festool-ts55", title: "Festool Tauchsäge TS 55 FEBQ-Plus", brand: "Festool", categoryId: "werkzeug", buy: ["Ausstellungsstück", 449, 9.9, 2], sell: KLEINANZEIGEN, market: [559, 40, 36, 30, 0.0], detectedMinutesAgo: 230 },

  // Vorbestellungen: heute vorbestellbar, danach meist deutlich über UVP gehandelt.
  // Marktdaten stammen hier aus Pre-Sales (Vorverkäufe auf Zweitmärkten).
  { id: "pkm-ascended-heroes", title: "Pokémon TCG Mega-Entwicklung Display (Vorbestellung)", brand: "Pokémon", categoryId: "vorbestellung", kind: "vorbestellung", buy: ["Offizieller Händler", 149.99, 4.99, 4], sell: CARDMARKET, market: [329, 55, 180, 70, 0.12], releaseInDays: 46, limited: true, detectedMinutesAgo: 6 },
  { id: "lego-ucs-falcon-2", title: "LEGO Star Wars UCS Sammlerset 2026 (Vorbestellung)", brand: "LEGO", categoryId: "vorbestellung", kind: "vorbestellung", buy: ["LEGO Insider Vorbestellung", 649.99, 0, 2], sell: EBAY, market: [949, 120, 26, 14, 0.1], releaseInDays: 58, limited: true, detectedMinutesAgo: 22 },
  { id: "gta6-collectors", title: "GTA VI Collector's Edition PS5 (Vorbestellung)", brand: "Rockstar", categoryId: "vorbestellung", kind: "vorbestellung", buy: ["Rockstar Store", 199.99, 0, 1], sell: EBAY, market: [449, 80, 95, 40, 0.15], releaseInDays: 33, limited: true, detectedMinutesAgo: 41 },
  { id: "jordan-collab-raffle", title: "Travis Scott x Jordan Collab (Raffle gewonnen)", brand: "Nike", categoryId: "vorbestellung", kind: "vorbestellung", buy: ["SNKRS Raffle", 179.99, 0, 1], sell: STOCKX, market: [419, 70, 210, 120, 0.06], releaseInDays: 12, limited: true, detectedMinutesAgo: 90 },
  { id: "funko-exclusive", title: "Funko Pop! Convention Exclusive (Vorbestellung)", brand: "Funko", categoryId: "vorbestellung", kind: "vorbestellung", buy: ["Shop-Exklusiv", 24.99, 5.99, 6], sell: EBAY, market: [49, 14, 40, 85, 0.03], releaseInDays: 70, limited: true, detectedMinutesAgo: 200 },

  // Dienstleistungen: Einkauf bei Freelancern, Weiterverkauf an Direktkunden
  { id: "svc-logo-paket", title: "Logo- und Markenpaket für Kleinunternehmen", brand: "Freelancer-Netzwerk", categoryId: "dienstleistung", kind: "dienstleistung", buy: ["Fiverr Pro", 120, 0, 20], sell: DIRECT, market: [390, 60, 28, 20, 0.02], detectedMinutesAgo: 18 },
  { id: "svc-shop-texte", title: "SEO-Produkttexte (50 Stück) für Onlineshops", brand: "Texter-Pool", categoryId: "dienstleistung", kind: "dienstleistung", buy: ["Upwork", 180, 0, 10], sell: DIRECT, market: [450, 70, 22, 18, 0.04], detectedMinutesAgo: 72 },
  { id: "svc-video-schnitt", title: "Kurzvideo-Schnitt (10 Reels) für Social Media", brand: "Editor-Pool", categoryId: "dienstleistung", kind: "dienstleistung", buy: ["Fiverr", 150, 0, 15], sell: DIRECT, market: [490, 90, 30, 26, 0.07], detectedMinutesAgo: 150 },
];

export interface LotSeed {
  id: string;
  title: string;
  debtor: string;
  court: string;
  caseNumber: string;
  city: string;
  lotType: LotType;
  items: string[];
  appraisedValue: number;
  currentBid: number;
  buyerPremium: number;
  logisticsCost: number;
  auctioneer: string;
  endsInHours: number;
  resale: [median: number, stdDev: number];
  liquidity: number;
  detectedMinutesAgo: number;
}

export const LOT_SEEDS: LotSeed[] = [
  {
    id: "lot-elektro-lager",
    title: "Restwarenlager Unterhaltungselektronik, 1.240 Artikel",
    debtor: "Demo Elektro Handels GmbH",
    court: "Amtsgericht Köln",
    caseNumber: "DEMO 73 IN 412/26",
    city: "Köln",
    lotType: "Warenlager",
    items: ["Bluetooth-Lautsprecher (420 Stk.)", "Kopfhörer (310 Stk.)", "Ladegeräte & Kabel (510 Stk.)"],
    appraisedValue: 48_000,
    currentBid: 9_500,
    buyerPremium: 0.18,
    logisticsCost: 1_400,
    auctioneer: "Industrie-Auktionshaus (Demo)",
    endsInHours: 52,
    resale: [27_000, 5_500],
    liquidity: 0.72,
    detectedMinutesAgo: 25,
  },
  {
    id: "lot-cnc-fraese",
    title: "CNC-Fräszentrum DMG Mori, Baujahr 2019",
    debtor: "Demo Präzisionstechnik GmbH",
    court: "Amtsgericht Stuttgart",
    caseNumber: "DEMO 4 IN 1188/26",
    city: "Esslingen",
    lotType: "Maschinen",
    items: ["5-Achs-Fräszentrum", "Werkzeugmagazin 60 Plätze", "Späneförderer"],
    appraisedValue: 185_000,
    currentBid: 61_000,
    buyerPremium: 0.15,
    logisticsCost: 9_800,
    auctioneer: "Maschinenverwerter (Demo)",
    endsInHours: 120,
    resale: [118_000, 21_000],
    liquidity: 0.48,
    detectedMinutesAgo: 70,
  },
  {
    id: "lot-mode-boutique",
    title: "Boutique-Auflösung Premium-Mode, 860 Teile",
    debtor: "Demo Fashion Store e. K.",
    court: "Amtsgericht München",
    caseNumber: "DEMO 1507 IN 2201/26",
    city: "München",
    lotType: "Warenlager",
    items: ["Jacken & Mäntel (180 Stk.)", "Strick (240 Stk.)", "Accessoires (440 Stk.)"],
    appraisedValue: 64_000,
    currentBid: 7_200,
    buyerPremium: 0.18,
    logisticsCost: 900,
    auctioneer: "Online-Verwerter (Demo)",
    endsInHours: 30,
    resale: [21_500, 4_800],
    liquidity: 0.61,
    detectedMinutesAgo: 140,
  },
  {
    id: "lot-transporter",
    title: "Fuhrpark: 4 Transporter Mercedes Sprinter",
    debtor: "Demo Logistik GmbH",
    court: "Amtsgericht Hamburg",
    caseNumber: "DEMO 67c IN 340/26",
    city: "Hamburg",
    lotType: "Fahrzeuge",
    items: ["Sprinter 316 CDI (2021)", "Sprinter 316 CDI (2020)", "Sprinter 319 CDI (2022)", "Sprinter 214 CDI (2019)"],
    appraisedValue: 112_000,
    currentBid: 71_000,
    buyerPremium: 0.12,
    logisticsCost: 1_200,
    auctioneer: "Fahrzeugauktion (Demo)",
    endsInHours: 74,
    resale: [96_000, 9_000],
    liquidity: 0.82,
    detectedMinutesAgo: 210,
  },
  {
    id: "lot-it-buero",
    title: "Büro- und IT-Ausstattung, 85 Arbeitsplätze",
    debtor: "Demo Software AG",
    court: "Amtsgericht Berlin-Charlottenburg",
    caseNumber: "DEMO 36a IN 5120/26",
    city: "Berlin",
    lotType: "Büro & IT",
    items: ["MacBook Pro M3 (62 Stk.)", "Monitore 27\" (120 Stk.)", "Design-Bürostühle (85 Stk.)"],
    appraisedValue: 96_000,
    currentBid: 31_000,
    buyerPremium: 0.18,
    logisticsCost: 2_100,
    auctioneer: "IT-Verwerter (Demo)",
    endsInHours: 20,
    resale: [64_000, 8_500],
    liquidity: 0.77,
    detectedMinutesAgo: 9,
  },
  {
    id: "lot-marke-domain",
    title: "Markenrechte und Domains eines D2C-Shops",
    debtor: "Demo Naturkosmetik GmbH",
    court: "Amtsgericht Frankfurt am Main",
    caseNumber: "DEMO 810 IN 77/26",
    city: "Frankfurt",
    lotType: "Marken & Domains",
    items: ["Wortbildmarke DE/EU", "3 Domains inkl. Shop-Content", "Newsletter-Liste (Opt-in, 38.000)"],
    appraisedValue: 40_000,
    currentBid: 14_000,
    buyerPremium: 0.1,
    logisticsCost: 600,
    auctioneer: "Insolvenzverwalter direkt (Demo)",
    endsInHours: 160,
    resale: [19_000, 9_000],
    liquidity: 0.3,
    detectedMinutesAgo: 320,
  },
];

export type { InsolvencyLot };
