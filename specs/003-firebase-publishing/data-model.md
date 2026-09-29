# Data Model: Publishing the site on Firebase Hosting

This feature has no application data. It has these entities.

## Hosting project

- **Project ID**: `dembinszky18`, or `dembinszky18-hu` if the first is taken. It is chosen once, when the owner creates the project, and stored in `.firebaserc` as the `default` alias.
- **Owner account**: `bartlbalazs@gmail.com`. The publishing command passes it on every call (R6).
- **Default site**: `<project-id>.web.app`. It is reachable before the custom domain is connected.
- **Custom domains**:
  - `www.dembinszky18.hu` serves the site.
  - `dembinszky18.hu` redirects to it with a 301 (R5).

## Hosting configuration (`firebase.json`)

- `public`: `dist`
- `trailingSlash`: `true`
- `headers`: three rule groups: security headers on everything, long caching on `/_astro/**`, and `no-cache` on HTML and the other unhashed files. The values are in [contracts/hosting.md](contracts/hosting.md).
- There are no `rewrites` and no `redirects`.

## Published version

- **What it is**: one immutable upload of `dist/` from a passing release build.
- **Label**: the deploy message, `<short commit hash> <commit subject>`.
- **States**: `created` → `finalized` → `released` (live). A version stops being live when a newer one is released, or when an older one is restored through rollback. Firebase keeps the release history. Nothing in the repo stores versions.
- **Rule**: a version can exist only if the release checks passed and the working tree was clean (R7).
