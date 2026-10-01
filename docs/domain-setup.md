# Domain and hosting setup

One-time steps to put the site on Firebase Hosting at `www.dembinszky18.hu`. Routine
publishing and rollback are in the [README](../README.md#publishing).

Use the owner's personal Google account throughout, never a work account. The publishing
command (`scripts/publish.sh`) refuses to deploy with any other account.

## Firebase project

1. At <https://console.firebase.google.com/>, create the project `dembinszky18` (Google
   Analytics is not needed). If that ID is taken, use `dembinszky18-hu` and put it in
   `.firebaserc`.
2. `pnpm exec firebase login`, choosing the owner account.
3. `pnpm site:publish`. The site is now at `https://<project-id>.web.app/`.

## Custom domain

1. In the console, go to Hosting → Add custom domain. Add `www.dembinszky18.hu`, then
   `dembinszky18.hu` with "Redirect to www.dembinszky18.hu".
2. Enter the DNS records below at the domain registrar, using the values the console shows.
3. Wait for "Connected" in the console. The certificate can take up to 24 hours.

The e-mail records (MX, SRV, SPF and DMARC) stay as they are.

| Host | Type | Value |
|---|---|---|
| `dembinszky18.hu` | A | the Firebase Hosting address shown in the console (replaces the registrar's parking address) |
| `dembinszky18.hu` | TXT | the `hosting-site=…` value shown in the console |
| `www.dembinszky18.hu` | A | the Firebase Hosting address shown in the console |
| `www.dembinszky18.hu` | TXT | the `hosting-site=…` value shown in the console |
| `_acme-challenge.www.dembinszky18.hu` | TXT | the certificate token shown in the console |
