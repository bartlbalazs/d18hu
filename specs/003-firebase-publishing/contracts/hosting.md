# Contract: Published site and publishing command

## Addresses

| Request | Response |
|---|---|
| `https://www.dembinszky18.hu/` and each page URL with a trailing slash (`/epitok/`, `/nevado/`, `/impresszum/`) | 200, the release-build HTML |
| `https://www.dembinszky18.hu/epitok` (no trailing slash) | 301 → `/epitok/` |
| `http://www.dembinszky18.hu/<path>` | 301 → `https://www.dembinszky18.hu/<path>` |
| `http(s)://dembinszky18.hu/<path>` | 301 → `https://www.dembinszky18.hu/<path>` |
| any unknown path, for example `/irasok/` | 404, body is `dist/404.html` |
| `/sitemap.xml`, `/robots.txt` | 200. robots.txt allows crawling and names `https://www.dembinszky18.hu/sitemap.xml` |

## Response headers

Sent on every response:

```text
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

Caching:

| Files | Cache-Control |
|---|---|
| `/_astro/**` (hashed images, fonts, scripts) | `public, max-age=31536000, immutable` |
| `**/*.html`, `/sitemap.xml`, `/robots.txt`, `/site.webmanifest`, `/favicon.svg`, `/apple-touch-icon.png`, `/icon-*.png` | `no-cache` |

Responses are compressed with Brotli or gzip whenever the browser accepts either.

## `404.html`

- It has one `h1`, "Az oldal nem található", and a link to `/`.
- It carries `<meta name="robots" content="noindex">`.
- It isn't listed in `sitemap.xml` and has no canonical link to itself.

## `pnpm site:publish`

- **Input**: none. It reads `.firebaserc` and uses the current commit.
- **Preconditions**:
  - The working tree is clean.
  - `bartlbalazs@gmail.com` is logged in to the Firebase CLI.
- **Steps**:
  1. Run `check`, `test`, `build:release` and `test:site`.
  2. Run the draft guard on `dist/`.
  3. Run `firebase deploy --only hosting --project <id> --account bartlbalazs@gmail.com --non-interactive -m "<hash> <subject>"`.
- **Exit codes**:
  - `0` means the new version is live. The command prints the live URL and the release-history link.
  - Non-zero means nothing was published. The failing step is printed with its reason: `uncommitted changes`, `release checks failed`, `draft output in dist/`, or `not logged in as bartlbalazs@gmail.com`.

## `pnpm verify:live`

- It runs linkinator on `https://www.dembinszky18.hu/`, recursive, checking fragments, with external links skipped. It exits non-zero if any link is broken.
- It then runs Lighthouse CI with `lighthouserc.live.json`, which uses the same assertions as `lighthouserc.json` against the four live page URLs. It exits non-zero if any principle II threshold is missed.
