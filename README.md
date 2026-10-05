# Arbitrage Radar

Webseite und Dashboard-Web-App, die Arbitrage-Chancen, Vorbestellungen mit Wiederverkaufspotenzial
und Insolvenzmassen findet, den Markt analysiert und für jede Chance die Gewinnwahrscheinlichkeit
(Leiste von Rot bis Grün, in Prozent) anzeigt. Kaufen, Einstellen und Bieten laufen auf Knopfdruck.

**Live:** https://geschichtenfabriktv-droid.github.io/arbitrage/ · Dashboard: `/arbitrage/app/`

## Stand

- Webseite (`/`) und Dashboard (`/app/…`) sind fertig und für Smartphone und Desktop optimiert,
  inklusive Web-App-Manifest („Zum Home-Bildschirm“).
- Dashboard: Übersicht, Kategorien (anklickbar), Chancen mit Filter/Suche/Sortierung, Detailanalyse mit
  Preisverlauf, Faktoren und Vergleichsverkäufen, Insolvenzmassen mit Bietagent, Portfolio, Einstellungen.
- **Demo-Modus:** Die Marktdaten sind modelliert (`src/lib/data/demo-catalog.ts`). Bestellungen,
  Inserate und Gebote werden nur im Browser gespeichert, es wird nichts real gekauft oder verkauft.

## Architektur

```
src/lib/domain      Typen und Kategorien
src/lib/engine      Analyse: Break-even, Zielpreis, Gewinnwahrscheinlichkeit (getestet)
src/lib/data        DataSource-Schnittstelle, Demo-Quelle, Repository
src/lib/client      Browser-Zustand (Portfolio, Einstellungen) und Markt-Hook
src/app             Seiten (Next.js App Router, statischer Export) und JSON-API unter /api/*.json
src/components      UI-Bausteine (Wahrscheinlichkeitsleiste, Karten, Chart, Sheets, Navigation)
```

### Gewinnwahrscheinlichkeit

Verkaufspreise werden als Normalverteilung um den Marktmedian modelliert, korrigiert um den Trend bis
zum erwarteten Verkauf (bei Vorbestellungen bis nach Release, mit wachsender Unsicherheit). Die
Wahrscheinlichkeit ist P(Verkaufspreis ≥ Break-even + 5 % Mindestgewinn) × (0,6 + 0,4 × Abverkaufsquote 30 Tage),
begrenzt auf 1–97 %. Bei Insolvenzmassen: P(Erlös ≥ 110 % der Kosten inkl. Aufgeld und Logistik),
gewichtet mit der Liquidität; das empfohlene Maximalgebot lässt 20 % Marge.

### Live-Daten anbinden

Eine neue Quelle implementiert `DataSource` (`src/lib/data/source.ts`) und wird in
`getDataSource` (`src/lib/data/repository.ts`) eingesetzt. Für echten Handel werden Zugänge benötigt:
eBay Sell/Browse API, Amazon SP-API, Keepa, Affiliate-Feeds (Awin, Tradedoubler), StockX/Cardmarket,
insolvenzbekanntmachungen.de und Verwerter-Auktionen sowie ein Zahlungsdienst. Für Kauf- und
Verkaufsaufträge mit echten Zugangsdaten ist ein Server nötig (z. B. Next.js auf Vercel statt
statischem Export).

## Entwicklung

```bash
npm install
npm run dev          # http://localhost:3000/arbitrage
npm run typecheck && npm run lint && npm test
npm run build        # statischer Export nach out/
BASE_PATH= npm run build   # Export für eine Domain-Wurzel (z. B. Vercel)
scripts/deploy-pages.sh ../geschichtenfabriktv-droid.github.io
```
