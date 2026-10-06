#!/usr/bin/env bash
# Baut den statischen Export und kopiert ihn in den Unterordner /arbitrage der GitHub-Pages-Seite.
# Aufruf: IMPRESSUM_NAME=… IMPRESSUM_STREET=… IMPRESSUM_CITY=… IMPRESSUM_COUNTRY=… IMPRESSUM_EMAIL=… \
#          scripts/deploy-pages.sh /pfad/zu/geschichtenfabriktv-droid.github.io
# Die Impressumsdaten nur über die Umgebung übergeben, nie in Dateien im Repo speichern.
set -euo pipefail
PAGES_REPO="${1:?Pfad zum Pages-Repository angeben}"
cd "$(dirname "$0")/.."
npm run typecheck
npm run lint
npm test
rm -rf .next out
# API-Routen (route.ts) gibt es nur auf dem Server; für den statischen Export kurz beiseitelegen.
# (Sie heißen nicht mehr *.srv.ts, weil Vercel bei Route-Handlern mit Punkt-Endung den Build abbricht.)
API_TMP="$(mktemp -d)"
mv src/app/api "$API_TMP/api"
trap 'mv "$API_TMP/api" src/app/api' EXIT
STATIC_EXPORT=1 BASE_PATH=/arbitrage npm run build
rm -rf "$PAGES_REPO/arbitrage"
cp -R out "$PAGES_REPO/arbitrage"
echo "Export liegt in $PAGES_REPO/arbitrage. Jetzt dort committen und pushen."
