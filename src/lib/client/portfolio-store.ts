"use client";

import { useSyncExternalStore } from "react";

export type OrderStatus = "bestellt" | "unterwegs" | "eingetroffen";
export type ListingStatus = "aktiv" | "verkauft" | "pausiert";

export interface Order {
  id: string;
  itemId: string;
  itemType: "deal" | "lot";
  title: string;
  platform: string;
  quantity: number;
  unitCost: number;
  /** Bei Losen: Maximalgebot statt Kauf. */
  mode: "kauf" | "gebot";
  status: OrderStatus;
  createdAt: string;
}

export interface Listing {
  id: string;
  itemId: string;
  title: string;
  platforms: string[];
  price: number;
  floorPrice: number;
  quantity: number;
  autoRepricing: boolean;
  status: ListingStatus;
  expectedProfitPerUnit: number;
  createdAt: string;
}

export interface Settings {
  budget: number;
  minProbability: number;
  defaultPlatforms: string[];
  autoRepricing: boolean;
}

export interface PortfolioState {
  orders: Order[];
  listings: Listing[];
  settings: Settings;
}

export const DEFAULT_SETTINGS: Settings = {
  budget: 5000,
  minProbability: 0,
  defaultPlatforms: ["eBay"],
  autoRepricing: true,
};

const STORAGE_KEY = "arbitrage-radar:v1";
const EMPTY: PortfolioState = { orders: [], listings: [], settings: DEFAULT_SETTINGS };

let state: PortfolioState = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();

function load(): PortfolioState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw) as Partial<PortfolioState>;
    return {
      orders: Array.isArray(parsed.orders) ? parsed.orders : [],
      listings: Array.isArray(parsed.listings) ? parsed.listings : [],
      settings: { ...DEFAULT_SETTINGS, ...(parsed.settings ?? {}) },
    };
  } catch {
    return EMPTY;
  }
}

function ensureLoaded() {
  if (!loaded && typeof window !== "undefined") {
    state = load();
    loaded = true;
  }
}

function commit(next: PortfolioState) {
  state = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Speicher nicht verfügbar (z. B. privater Modus): Zustand bleibt für diese Sitzung erhalten.
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  ensureLoaded();
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  ensureLoaded();
  return state;
}

const getServerSnapshot = () => EMPTY;

export function usePortfolio(): PortfolioState {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

function uid(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

export const portfolio = {
  addOrder(order: Omit<Order, "id" | "createdAt" | "status">): Order {
    ensureLoaded();
    const created: Order = { ...order, id: uid("o"), status: "bestellt", createdAt: new Date().toISOString() };
    commit({ ...state, orders: [created, ...state.orders] });
    return created;
  },
  addListing(listing: Omit<Listing, "id" | "createdAt" | "status">): Listing {
    ensureLoaded();
    const created: Listing = { ...listing, id: uid("l"), status: "aktiv", createdAt: new Date().toISOString() };
    commit({ ...state, listings: [created, ...state.listings] });
    return created;
  },
  setOrderStatus(id: string, status: OrderStatus) {
    ensureLoaded();
    commit({ ...state, orders: state.orders.map((o) => (o.id === id ? { ...o, status } : o)) });
  },
  setListingStatus(id: string, status: ListingStatus) {
    ensureLoaded();
    commit({ ...state, listings: state.listings.map((l) => (l.id === id ? { ...l, status } : l)) });
  },
  removeOrder(id: string) {
    ensureLoaded();
    commit({ ...state, orders: state.orders.filter((o) => o.id !== id) });
  },
  removeListing(id: string) {
    ensureLoaded();
    commit({ ...state, listings: state.listings.filter((l) => l.id !== id) });
  },
  updateSettings(patch: Partial<Settings>) {
    ensureLoaded();
    commit({ ...state, settings: { ...state.settings, ...patch } });
  },
  reset() {
    ensureLoaded();
    commit(EMPTY);
  },
};

/** Gebundenes Kapital in offenen Bestellungen (für das Budget). */
export function committedCapital(orders: Order[]): number {
  return orders.filter((o) => o.status !== "eingetroffen").reduce((s, o) => s + o.unitCost * o.quantity, 0);
}
