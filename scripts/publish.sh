#!/usr/bin/env bash
# Publishes the release build to Firebase Hosting (run as: pnpm site:publish).
# Nothing is deployed unless the tree is clean and every release check passes.
set -euo pipefail

cd "$(dirname "$0")/.."

ACCOUNT="bartlbalazs@gmail.com"
PROJECT="$(node -e 'console.log(JSON.parse(require("fs").readFileSync(".firebaserc", "utf8")).projects.default)')"

# Inside `pnpm run`, npm_execpath points at the running pnpm; fall back to Corepack.
if [[ -n "${npm_execpath:-}" ]]; then
  pnpm() { node "$npm_execpath" "$@"; }
else
  pnpm() { corepack pnpm "$@"; }
fi

fail() {
  echo "Not published: $1" >&2
  exit 1
}

if [[ -n "$(git status --porcelain)" ]]; then
  fail "uncommitted changes (commit or stash them first)"
fi

for step in check test build:release test:site; do
  echo "==> pnpm $step"
  pnpm "$step" || fail "release checks failed (pnpm $step)"
done

# Second guard against draft output, beyond the release build itself. The 404 page is
# the only page that is noindex on purpose.
if grep -rlq --include='*.html' 'class="draft-banner"' dist \
  || grep -rl --include='*.html' 'name="robots" content="noindex' dist | grep -vqx 'dist/404.html'; then
  fail "draft output in dist/"
fi

if ! pnpm exec firebase login:list 2>/dev/null | grep -qF "$ACCOUNT"; then
  echo "run: pnpm exec firebase login" >&2
  fail "not logged in as $ACCOUNT"
fi

pnpm exec firebase deploy --only hosting --project "$PROJECT" --account "$ACCOUNT" \
  --non-interactive -m "$(git log -1 --format='%h %s')"

echo
echo "Live:            https://www.dembinszky18.hu/"
echo "Default address: https://$PROJECT.web.app/"
echo "Release history: https://console.firebase.google.com/project/$PROJECT/hosting/sites"
