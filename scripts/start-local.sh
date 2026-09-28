#!/usr/bin/env bash
# Starts the site locally.
#   scripts/start-local.sh            development server with live reload (draft mode)
#   scripts/start-local.sh --preview  production-like: draft build of dist/, then serve it
# Any further arguments are passed to Astro (e.g. --port 5000, --host to open it on your LAN).
set -euo pipefail

cd "$(dirname "$0")/.."

mode="dev"
if [[ "${1:-}" == "--preview" ]]; then
  mode="preview"
  shift
fi

# Node version from .nvmrc (via nvm when available).
required_node="$(cat .nvmrc)"
if [[ "$(node --version 2>/dev/null)" != "v${required_node}" ]]; then
  export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
  if [[ -s "$NVM_DIR/nvm.sh" ]]; then
    # shellcheck source=/dev/null
    source "$NVM_DIR/nvm.sh"
    nvm use >/dev/null 2>&1 || nvm install
  else
    echo "Node.js ${required_node} is required (found: $(node --version 2>/dev/null || echo none))." >&2
    echo "Install it, e.g. with nvm: https://github.com/nvm-sh/nvm" >&2
    exit 1
  fi
fi

# pnpm at the exact version pinned in package.json, run through Corepack (ships with Node).
export COREPACK_ENABLE_DOWNLOAD_PROMPT=0
pnpm() { corepack pnpm "$@"; }

# Install only when dependencies are missing or the lockfile changed since the last install.
if [[ ! -d node_modules || pnpm-lock.yaml -nt node_modules/.modules.yaml ]]; then
  echo "Installing dependencies..."
  pnpm install --frozen-lockfile
fi

if [[ "$mode" == "preview" ]]; then
  pnpm build:draft
  exec corepack pnpm preview "$@"
else
  exec corepack pnpm dev "$@"
fi
