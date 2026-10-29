#!/usr/bin/env bash
# Publishes the Content Hub (app/dist) to this repo's gh-pages branch → https://aayuvis.github.io/Bromic_Marketing/#/home
# The repo is private; the Pages site is public to anyone with the link (noindex keeps it out of search engines).
# Usage: ./deploy.sh          (tests + build + publish)     ./deploy.sh --fast   (skip tests)
set -euo pipefail
cd "$(dirname "$0")"
ROOT=$(git rev-parse --show-toplevel)
if [ -n "$(git -C "$ROOT" status --porcelain -- app content data images/library tools forms reviews templates)" ]; then
  echo "Refusing: commit your changes first (the deploy is stamped with the commit it was built from)."; exit 1; fi
SHA=$(git rev-parse --short HEAD)
[ "${1:-}" = "--fast" ] || npm test
npm run build
node scripts/pdf.mjs   # a PDF of every gated document → dist/pdf/
N_BUILD=$(find dist -type f | wc -l)
TMP=$(mktemp -d); trap 'rm -rf "$TMP"' EXIT
cp -R dist/. "$TMP/"
touch "$TMP/.nojekyll"
N_STAGED=$(find "$TMP" -type f ! -name .nojekyll | wc -l)
[ "$N_BUILD" = "$N_STAGED" ] || { echo "Refusing: staged $N_STAGED files, build has $N_BUILD"; exit 1; }
cd "$TMP"
git init -q -b gh-pages
git add -A
git -c user.name="$(git -C "$ROOT" config user.name || echo deploy)" -c user.email="$(git -C "$ROOT" config user.email || echo deploy@localhost)" \
  commit -q -m "Built from $SHA"
REMOTE=$(git -C "$ROOT" remote get-url origin)
for i in 1 2 3 4; do git push -f "$REMOTE" gh-pages:gh-pages && break || sleep $((2**i)); done
echo "Published $N_BUILD files from $SHA → https://aayuvis.github.io/Bromic_Marketing/#/home"
