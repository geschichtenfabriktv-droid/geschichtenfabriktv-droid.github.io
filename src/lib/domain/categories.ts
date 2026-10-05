import type { Category, CategoryId } from "./types";

export const CATEGORIES: readonly Category[] = [
  { id: "elektronik", name: "Elektronik", claim: "Audio, Smartphones, Wearables mit Preisgefälle zwischen Händlern" },
  { id: "gaming", name: "Gaming", claim: "Konsolen, Bundles und Zubehör mit knapper Verfügbarkeit" },
  { id: "sneaker", name: "Sneaker & Mode", claim: "Limitierte Releases und Restposten unter Marktwert" },
  { id: "sammler", name: "Sammlerstücke", claim: "Trading Cards, LEGO und Figuren mit Wertsteigerung" },
  { id: "haushalt", name: "Haushalt", claim: "Markengeräte aus Abverkäufen und Retouren" },
  { id: "werkzeug", name: "Werkzeug", claim: "Profi-Werkzeug aus Aktionen und Sets zum Aufteilen" },
  { id: "vorbestellung", name: "Vorbestellungen", claim: "Vorbestellbar heute, später oft zum doppelten Preis handelbar" },
  { id: "dienstleistung", name: "Dienstleistungen", claim: "Leistungen günstig einkaufen und veredelt weiterverkaufen" },
  { id: "insolvenz", name: "Insolvenzmassen", claim: "Warenlager, Maschinen und Rechte aus Insolvenzverfahren" },
] as const;

export function getCategory(id: CategoryId): Category {
  const category = CATEGORIES.find((c) => c.id === id);
  if (!category) throw new Error(`Unbekannte Kategorie: ${id}`);
  return category;
}

export function isCategoryId(value: string | null | undefined): value is CategoryId {
  return CATEGORIES.some((c) => c.id === value);
}
