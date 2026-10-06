"use client";

import { useEffect } from "react";
import { BACKEND } from "@/lib/client/api";
import { EXPERIMENT_IDS, formatAbTag, type AbEvent, type Assignment, type ExperimentId } from "@/lib/experiments";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** Varianten dieses Seitenaufrufs, wie sie das Kopf-Skript gesetzt hat. */
export function currentAssignment(): Assignment {
  const a: Assignment = {};
  for (const id of EXPERIMENT_IDS) {
    const v = document.documentElement.getAttribute(`data-ab-${id}`);
    if (v) a[id] = v;
  }
  return a;
}

export function sendAbEvent(assignment: Assignment, event: AbEvent) {
  if (!BACKEND) return;
  const tag = formatAbTag(assignment);
  if (!tag) return;
  const body = JSON.stringify({ ab: tag, event });
  try {
    if (navigator.sendBeacon?.(`${BASE}/api/ab/`, new Blob([body], { type: "application/json" }))) return;
  } catch {
    // weiter mit fetch
  }
  void fetch(`${BASE}/api/ab/`, { method: "POST", body, headers: { "Content-Type": "application/json" }, keepalive: true }).catch(() => {});
}

/**
 * Zählt Ansichten und Klicks für die Tests, die auf der Seite vorkommen (Elemente mit
 * data-ab-exp="…" bzw. data-ab-goal="…"), und hängt die Varianten an Links zu Registrierung und
 * Checkout an, damit ein späterer Kauf der Variante zugeordnet werden kann. Kein Cookie, kein Speicher.
 */
export function AbTracker() {
  useEffect(() => {
    const all = currentAssignment();
    const onPage = (attr: string) =>
      new Set(Array.from(document.querySelectorAll(`[${attr}]`)).map((el) => el.getAttribute(attr) as ExperimentId));
    const seen = onPage("data-ab-exp");
    const pick = (ids: Iterable<ExperimentId>): Assignment => Object.fromEntries([...ids].filter((id) => all[id]).map((id) => [id, all[id]]));
    sendAbEvent(pick(seen), "ansicht");

    const onClick = (e: MouseEvent) => {
      const target = e.target instanceof Element ? e.target : null;
      const goal = target?.closest("[data-ab-goal]")?.getAttribute("data-ab-goal") as ExperimentId | null | undefined;
      if (goal && all[goal]) sendAbEvent({ [goal]: all[goal] }, "klick");
      const link = target?.closest("a[href]") as HTMLAnchorElement | null;
      if (!link || !/\/(checkout|registrieren)\/$/.test(link.pathname)) return;
      const tag = formatAbTag(pick(seen));
      const url = new URL(link.href);
      if (!tag || url.searchParams.has("ab")) return;
      url.searchParams.set("ab", tag);
      link.href = url.toString();
      // Next.js navigiert sonst mit dem ursprünglichen href; normale Klicks daher selbst ausführen.
      if (e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && !link.target) {
        e.preventDefault();
        e.stopPropagation();
        window.location.assign(url.toString());
      }
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);
  return null;
}
