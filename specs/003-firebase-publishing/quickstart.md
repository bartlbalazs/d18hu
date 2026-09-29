# Quickstart: publishing and validating the live site

## One-time setup

1. Sign in to <https://console.firebase.google.com/> with **bartlbalazs@gmail.com**, never the work account.
2. Create the project `dembinszky18`, or `dembinszky18-hu` if that ID is taken. Google Analytics isn't needed.
3. Put the chosen ID in `.firebaserc` if it isn't `dembinszky18`.
4. Run `pnpm install`, then `pnpm exec firebase login`, choosing bartlbalazs@gmail.com.
5. Run `pnpm site:publish`. The site is now live at `https://<project-id>.web.app/`.
6. In the console, go to Hosting → Add custom domain and add `www.dembinszky18.hu`. Then add `dembinszky18.hu` with **Redirect to www.dembinszky18.hu**.
7. Enter the DNS records the console shows at the registrar, and copy them into the README. Wait until the console shows "Connected"; the certificate can take up to 24 hours.

## Routine publishing

```bash
git status            # must be clean
pnpm site:publish     # checks, release build, deploy
pnpm verify:live      # live link check + Lighthouse
```

Expected result: every step exits `0`, and the last one reports no broken links and all Lighthouse assertions passed.

## Negative checks (FR-001, FR-009)

| Try this | Expected result |
|---|---|
| Change a file without committing, then run `pnpm site:publish` | Stops with `uncommitted changes`. Nothing is deployed. |
| Empty an image `credit` in `editorial/events.yaml`, commit on a scratch branch, then run `pnpm site:publish` | The release build fails. Nothing is deployed. |
| Run `pnpm exec firebase logout`, then `pnpm site:publish` | Stops with the login hint. Nothing is deployed. |

## Redirect and header checks (SC-004, FR-006, FR-007)

```bash
curl -sI http://dembinszky18.hu/nevado/        | grep -iE '^(HTTP|location)'   # 301 → https://www.dembinszky18.hu/nevado/
curl -sI https://dembinszky18.hu/              | grep -iE '^(HTTP|location)'   # 301 → https://www.dembinszky18.hu/
curl -sI https://www.dembinszky18.hu/epitok    | grep -iE '^(HTTP|location)'   # 301 → /epitok/
curl -sI https://www.dembinszky18.hu/irasok/   | head -1                       # 404
curl -sI https://www.dembinszky18.hu/          | grep -iE 'strict-transport|x-frame|x-content|referrer|cache-control'
curl -sI -H 'Accept-Encoding: br' https://www.dembinszky18.hu/ | grep -i content-encoding   # br
```

Also check any `/_astro/…` file. It must answer with `cache-control: public, max-age=31536000, immutable`.

## Rollback (SC-005)

In the console, go to Hosting → Release history, open the previous version's ⋮ menu and choose **Roll back**. Reload `https://www.dembinszky18.hu/` to confirm the old version is back.
