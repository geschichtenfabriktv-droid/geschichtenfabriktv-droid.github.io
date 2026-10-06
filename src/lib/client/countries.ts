"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";
import { COUNTRIES, countriesAllowed, isCountry, type Country } from "../pricing";
import { useSessionUser } from "./user-context";

/** Gewählte Länder im Dashboard; im Browser gemerkt (keine personenbezogenen Daten). */
const KEY = "ar-laender";
const EVENT = "ar-laender";

function read(): Country[] {
  try {
    const raw = window.localStorage.getItem(KEY);
    const list = raw ? (JSON.parse(raw) as unknown[]).filter(isCountry) : [];
    return list.length ? list : ["DE"];
  } catch {
    return ["DE"];
  }
}

let snapshot: Country[] | null = null;
function getSnapshot() {
  const next = read();
  if (!snapshot || snapshot.join() !== next.join()) snapshot = next;
  return snapshot;
}
const SERVER: Country[] = ["DE"];

function subscribe(cb: () => void) {
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}

export function useCountries() {
  const user = useSessionUser();
  const allowed = countriesAllowed(user?.plan);
  const stored = useSyncExternalStore(subscribe, getSnapshot, () => SERVER);
  const allowedKey = allowed.join();
  const countries = useMemo<Country[]>(() => {
    const selected = COUNTRIES.map((c) => c.id).filter((c) => stored.includes(c) && allowedKey.includes(c));
    return selected.length ? selected : ["DE"];
  }, [stored, allowedKey]);
  const toggle = useCallback(
    (c: Country) => {
      const next = countries.includes(c) ? countries.filter((x) => x !== c) : [...countries, c];
      if (!next.length) return;
      try {
        window.localStorage.setItem(KEY, JSON.stringify(next));
      } catch {
        // ohne Speicher gilt die Auswahl nur bis zum Neuladen nicht – dann bleibt Deutschland
      }
      window.dispatchEvent(new Event(EVENT));
    },
    [countries],
  );
  return { countries, allowed, toggle };
}
