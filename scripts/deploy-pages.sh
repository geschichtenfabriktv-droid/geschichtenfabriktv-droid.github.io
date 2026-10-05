#!/usr/bin/env bash
# Baut den statischen Export und kopiert ihn in den Unterordner /arbitrage der GitHub-Pages-Seite.
# Aufruf: scripts/deploy-pages.sh /pfad/zu/geschichtenfabriktv-droid.github.io
set -euo pipefail
PAGES_REPO="${1:?Pfad zum Pages-Repository angeben}"
cd "$(dirname "$0")/.."
npm run typecheck
npm run lint
npm test
BASE_PATH=/arbitrage npm run build
rm -rf "$PAGES_REPO/arbitrage"
cp -R out "$PAGES_REPO/arbitrage"
echo "Export liegt in $PAGES_REPO/arbitrage. Jetzt dort committen und pushen."
