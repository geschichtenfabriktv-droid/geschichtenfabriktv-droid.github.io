# Arbitrage Radar

Verkaufbare Web-App (SaaS): findet Arbitrage-Chancen, Vorbestellungen mit Wiederverkaufspotenzial und
Insolvenzmassen, analysiert den Markt und zeigt für jede Chance die Gewinnwahrscheinlichkeit (Leiste von
Rot bis Grün, in Prozent). Kundenkonten, Abos über Mollie und eigene Marktplatz-Konten (eBay, Amazon,
Keepa) per OAuth.

- **Vorschau (statisch):** https://geschichtenfabriktv-droid.github.io/arbitrage/ – Webseite, Preise,
  Test-Dashboard (3 Chancen je Kategorie) und Rechtstexte. Konto und Kauf sind dort deaktiviert.
- **Live-Version:** https://arbitrageradar.de – Next.js-Server auf Vercel (Region Frankfurt) mit Postgres.
  `www.arbitrageradar.de` leitet per `vercel.json` dauerhaft auf die Hauptdomain um.

## Zwei Betriebsarten

| | Server (Standard) | `STATIC_EXPORT=1` |
|---|---|---|
| Wo | Vercel, Region `fra1` | GitHub Pages unter `/arbitrage` |
| Inhalt | alles: Konto, Checkout, Dashboard `/app`, API | Webseite, Preise, `/demo`, Rechtstexte |
| Dateien | `*.srv.tsx` und `src/app/api` werden mitgebaut | `*.srv.tsx` werden ignoriert, `src/app/api` legt das Skript beiseite |

## Tarife

| Tarif | Monat | Jahr | Enthält |
|---|---|---|---|
| Starter | 29 € | 290 € | 7 Kategorien, 1 Marktplatz |
| Pro | 79 € | 790 € | + Vorbestellungen, Autopilot (Angebot öffnen, mit einem Klick auf eBay einstellen), 3 Marktplätze |
| Business | 199 € | 1.990 € | + Insolvenz-Finder, unbegrenzt Marktplätze, bevorzugter Support |

Erweiterungen monatlich: Insolvenz-Finder 49 € (Starter, Pro), zusätzlicher Marktplatz 9 € (Starter).
Upgrade sofort mit anteiliger Nachberechnung, Downgrade ab der nächsten Abbuchung.
Jahresabo = 10 Monatspreise. 14 Tage Geld-zurück-Garantie. Definiert in `src/lib/pricing.ts`.

## Einrichtung (Live-Version)

1. Vercel-Projekt aus diesem Repository (Branch `arbitrage-source`) anlegen, Region ist per `vercel.json` Frankfurt.
2. Postgres in der EU anlegen (z. B. Neon, Region Frankfurt) und `DATABASE_URL` setzen. Tabellen werden beim Start angelegt.
3. Umgebungsvariablen als Secrets setzen (siehe `.env.example`):
   - `AUTH_SECRET` (`openssl rand -base64 48`), `ENCRYPTION_KEY` (`openssl rand -base64 32`)
   - `MOLLIE_API_KEY` (erst `test_…`, dann `live_…`); `APP_URL` ist in Produktion automatisch `https://arbitrageradar.de`
   - `IMPRESSUM_NAME`, `IMPRESSUM_STREET`, `IMPRESSUM_CITY`, `IMPRESSUM_COUNTRY`, `IMPRESSUM_EMAIL`
     (optional `IMPRESSUM_PHONE`, `IMPRESSUM_VAT_ID`) – nie ins Repository schreiben
   - optional `RESEND_API_KEY` und `MAIL_FROM` für E-Mails
4. eBay: im eBay Developer Program eine App anlegen, `EBAY_CLIENT_ID`, `EBAY_CLIENT_SECRET`, `EBAY_RUNAME`
   setzen. Als „Accept URL“ der RuName `APP_URL/api/verbindungen/ebay/callback/` eintragen. Damit werden
   auch Live-Marktpreise (Browse API) aktiv.
5. Amazon: als SP-API-Entwickler registrieren, App anlegen, `AMAZON_SP_APP_ID`, `AMAZON_LWA_CLIENT_ID`,
   `AMAZON_LWA_CLIENT_SECRET` setzen; Redirect `APP_URL/api/verbindungen/amazon/callback/`, Login-URI `APP_URL/api/amazon/login/`.
6. Mollie-Webhook braucht nichts weiter: die URL wird pro Zahlung mitgeschickt.

## Datenschutz

- Anbieterdaten nur im Impressum und den Rechtstexten; diese sind per `noindex`, `X-Robots-Tag` und
  `robots.txt` von Suchmaschinen ausgeschlossen, nicht in der Sitemap und werden kodiert eingebettet.
- Passwörter mit scrypt gehasht, Marktplatz-Token mit AES-256-GCM verschlüsselt, nur serverseitig genutzt.
- Datenexport (JSON) und Kontolöschung im Kundenkonto; Kündigungsbutton nach § 312k BGB unter `/kuendigen`.
- Rechtstexte sind Vorlagen und müssen anwaltlich geprüft werden.

## Architektur

```
src/lib/pricing.ts    Tarife, Add-ons, Freischaltung von Funktionen
src/lib/engine        Analyse: Break-even, Zielpreis, Gewinnwahrscheinlichkeit
src/lib/data          DataSource, modellierter Katalog
src/server            Datenbank, Auth, Mollie, Abrechnung, Verbindungen (OAuth), Live-Marktdaten
src/app/api           API-Routen (route.ts, nur Server)
src/app/app           Dashboard für Abonnenten (*.srv.tsx)
src/app/demo          Test-Dashboard
src/app/konto         Kundenkonto: Abo, Verbindungen, Daten
```

Gewinnwahrscheinlichkeit = P(Verkaufspreis ≥ Break-even + Mindestgewinn) × (0,6 + 0,4 × Abverkaufsquote),
begrenzt auf 1–97 %. Mit eBay-Zugang ersetzen Live-Angebotspreise (Median, Streuung, Angebotszahl) die
Modellwerte.

## Entwicklung

```bash
npm install
npm run dev                      # http://localhost:3000, eingebettete Datenbank (PGlite)
npm run typecheck && npm run lint && npm test
npm run build                    # Server-Build
STATIC_EXPORT=1 npm run build    # statischer Export nach out/
IMPRESSUM_NAME=… scripts/deploy-pages.sh ../geschichtenfabriktv-droid.github.io
```
