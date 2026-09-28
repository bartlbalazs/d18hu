# Contract: Build commands

All commands run from the repository root with Node 22 (`.nvmrc`) and pnpm (`packageManager`).
Exit code 0 = success; non-zero = failure with a human-readable report on stderr.

| Command | Network | Purpose | Fails when |
|---|---|---|---|
| `pnpm install --frozen-lockfile` | yes | Install pinned dependencies (7-day release age enforced) | Lockfile out of date |
| `pnpm images:fetch` | yes | Download new/changed `Kép URL` images into `src/assets/archive/`, update `manifest.json`, report unreferenced files | Any `ImageFetchError` (lists event id + URL) |
| `pnpm images:check` | yes | Verify every original image URL still responds with an image | Never fails the build pipeline; exits 1 only to signal unreachable URLs when run manually |
| `pnpm dev` | no | Local dev server, draft mode | Structural errors |
| `pnpm build:draft` | no | Static build to `dist/`, draft banner + `noindex`, prints missing-item report | Structural errors |
| `pnpm build:release` | no | Static build to `dist/`, indexable | Structural errors **or** any missing editorial item **or** `SITE_URL` unset |
| `pnpm test` | no | Unit tests (parser, ids, dates, renderer, audit) | Test failure |
| `pnpm test:site` | no | Assertions over `dist/` (counts, no remote images, no internal PDFs), html-validate, internal link check | Any violation |
| `pnpm lighthouse` | no | Lighthouse CI against `dist/` (mobile) with constitution budgets | Budget not met |
| `pnpm fonts:subset` | no¹ | Regenerate `src/fonts/*.woff2` from the pinned Fontsource packages | Tool error |

¹ `uvx` downloads the pinned fonttools version the first time.

## Environment

| Variable | Values | Default |
|---|---|---|
| `D18_BUILD_MODE` | `draft`, `release` | `draft` (set by the `build:*` scripts) |
| `SITE_URL` | absolute `https://` origin + optional base path | `siteUrl` from `editorial/site.yaml`; release fails if both are empty |

## Missing-item report format

```text
Missing editorial items (12):
  event 1903-dec-27-maulner-adolf-es-tarsai  title      no editorial title
  event 1963-a-ket-oldali-...                image.credit  image credit missing
  site  impresszum.contactEmail                         empty
```

Draft mode prints it and continues. Release mode prints it and exits 1.
