import type { Deal } from "@/lib/domain/types";

export interface WatchItem {
  query: string;
  brand: string;
  categoryId: Deal["categoryId"];
}

/** Produkte mit genug Handel auf eBay.de, um einen belastbaren Median zu bilden. */
export const WATCHLIST: readonly WatchItem[] = [
  { query: "Sony WH-1000XM5", brand: "Sony", categoryId: "elektronik" },
  { query: "Apple AirPods Pro 2", brand: "Apple", categoryId: "elektronik" },
  { query: "Apple Watch Series 10", brand: "Apple", categoryId: "elektronik" },
  { query: "Garmin Fenix 8", brand: "Garmin", categoryId: "elektronik" },
  { query: "DJI Mini 4 Pro", brand: "DJI", categoryId: "elektronik" },
  { query: "Kindle Paperwhite", brand: "Amazon", categoryId: "elektronik" },
  { query: "iPad Air M2", brand: "Apple", categoryId: "elektronik" },
  { query: "Nintendo Switch 2", brand: "Nintendo", categoryId: "gaming" },
  { query: "PlayStation 5 Pro", brand: "Sony", categoryId: "gaming" },
  { query: "Steam Deck OLED", brand: "Valve", categoryId: "gaming" },
  { query: "DualSense Edge", brand: "Sony", categoryId: "gaming" },
  { query: "Meta Quest 3", brand: "Meta", categoryId: "gaming" },
  { query: "New Balance 2002R", brand: "New Balance", categoryId: "sneaker" },
  { query: "Nike Air Jordan 1 High OG", brand: "Nike", categoryId: "sneaker" },
  { query: "Adidas Samba OG", brand: "Adidas", categoryId: "sneaker" },
  { query: "Pokemon Top Trainer Box", brand: "Pokémon", categoryId: "sammler" },
  { query: "LEGO Titanic 10294", brand: "LEGO", categoryId: "sammler" },
  { query: "One Piece Booster Display", brand: "Bandai", categoryId: "sammler" },
  { query: "Dyson V15 Detect", brand: "Dyson", categoryId: "haushalt" },
  { query: "Thermomix TM7", brand: "Vorwerk", categoryId: "haushalt" },
  { query: "De'Longhi Eletta Explore", brand: "De'Longhi", categoryId: "haushalt" },
  { query: "Makita DLX Combo Set", brand: "Makita", categoryId: "werkzeug" },
  { query: "Festool TS 55", brand: "Festool", categoryId: "werkzeug" },
];
