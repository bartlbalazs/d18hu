# Contract: Published site (`dist/`)

## URLs

| Path | Content |
|---|---|
| `/` | Timeline page (hero, legend, 4 eras, all events) |
| `/#korszak-1873-1913` … `/#korszak-1946-1968` | Era openers (stable) |
| `/#esemenyek-1873-1913` … | First event list of each era ("Tovább az eseményekhez" target) |
| `/#<event-id>` | Individual event (content-derived id, see data model) |
| `/irasok/` | Published articles index (empty state when none) |
| `/impresszum/` | Legal notice |
| `/sitemap.xml`, `/robots.txt`, `/site.webmanifest`, favicons | Crawler/browser metadata |

Trailing slashes are always used. Internal links are relative to `SITE_URL`'s base path.

## Markup guarantees (per page)

- `<html lang="hu">`; one `<h1>` (hero title); `h2` = era opener, `h3` = era event-list heading,
  `h4` = event title; `header` › `nav`, `main`, `footer`.
- Header is in normal flow (no `position: fixed/sticky`). The navigation lists all four era links,
  Írások and Impresszum at every width; on narrow screens it wraps into a 3-column grid instead of
  collapsing, so it needs no JS and hides nothing.
- Head: unique `<title>` (≤ 60 chars), `meta description` (50–160), `link rel=canonical`,
  Open Graph (`og:title`, `og:description`, `og:image` 1200×630, `og:url`, `og:type`,
  `og:locale=hu_HU`), `twitter:card=summary_large_image`, JSON-LD (see research R10).
- Draft build only: visible draft banner and `<meta name="robots" content="noindex, nofollow">`;
  `robots.txt` → `Disallow: /`.

## Event markup

```html
<li class="event event--house" id="<event-id>" data-event-id="<event-id>"
    data-category="house" data-confidence="probable" data-variant="image">
  <p class="event__date"><time datetime="1901">1901 körül</time></p>
  <span class="event__node"><svg aria-hidden="true">…house…</svg></span>
  <article class="event__body">
    <p class="event__meta">
      <span class="event__category">A ház</span>
      <span class="event__subtype">Személy</span>            <!-- only D18 • személy -->
      <span class="confidence"><svg aria-hidden="true">…</svg>Valószínű</span>  <!-- omitted when — -->
    </p>
    <h4 class="event__title">…</h4>
    <div class="event__text">…verbatim description…</div>
    <figure class="evidence evidence--photo">                <!-- only with Kép URL -->
      <a href="/_astro/….webp" data-pswp-width="1600" data-pswp-height="1061">  <!-- local, ≤ 2400 px -->
        <picture>…</picture><!-- img with alt, width, height, loading=lazy -->
      </a>
      <figcaption>caption · credit · <a href="archive record">Fortepan 148696</a></figcaption>
    </figure>
    <blockquote class="document-highlight">…</blockquote>   <!-- only verified highlight -->
    <p class="event__sources"><a href="…" rel="noopener noreferrer">Label ↗</a></p>
  </article>
</li>
```

- `data-*` attributes carry category, era and confidence as fields, so future filtering needs
  no content change (FR-038).
- `<time datetime>` is present only when `sortStart` is derivable; otherwise a `<span>`.
- No `<img src="http…">` pointing off-site; every image and full-size link is under the site's
  own origin.
- No element is rendered for `—` values.

## JavaScript contract

- Without JS: everything readable; image links open the full-size local file.
- With JS: one module (PhotoSwipe lightbox, about 5 KB gz) initialises on `a[data-pswp-width]`;
  the core and its CSS load on first activation. Nothing else runs.
- External links open in the same tab and carry `rel="noopener noreferrer"`.
