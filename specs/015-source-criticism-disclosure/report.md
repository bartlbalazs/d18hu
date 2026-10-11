# Report: Source criticism split from the timeline story

## Baseline

The baseline was measured on 2026-10-12, before any change, at commit 3a8f9b3 with `pnpm build:draft`.

- **Snapshot:** `baseline/timeline-snapshot.json`. It holds 175 events. By era: 1873–1913: 45, 1914–1938: 64, 1939–1945: 35, 1946–1968: 31. Cumulative by scope: Ház 82, Környék 128, Magyarország 154, Világ 175.
- **`dist/index.html`:** 743,408 bytes raw, 112,310 gzip (level 9), 78,086 brotli.

## Pilot check (T015)

The pilot is `1929-apr-29-uhereczky-ferenc-budapesti-muszereszmester`. The interaction checks were scripted over the Chrome DevTools Protocol in headless Chromium against `pnpm preview` of a draft build. All of them passed:

- **Layout:** at 320, 768 and 1280 px there is no horizontal scroll, the toggle sits inside the card, and it is 44 px tall.
- **Keyboard:** the disclosure starts closed. Enter opens it with no scroll change, and Enter closes it again.
- **Independence:** Space opens a second disclosure (a music card's „Források”, the only other one at that point), and the first stays open.
- **Screen reader:** the accessible name is „Forráskritika és pontosítások – Elektromos sebességváltó, bejelentve”, with role DisclosureTriangle and the expanded state exposed.
- **Scope slider:** moving it Világ → Ház → Világ keeps the card open.
- **Print:** in print media the closed notes are laid out. `beforeprint` opens every disclosure and `afterprint` closes them again.
- **No JavaScript:** with page scripts disabled, a mouse click opens the disclosure.
- **Screenshots** at 375 and 1280 px, open and closed: the toggle is quiet, in walnut with a chevron below a thin rule. There are no alert colours, and the source link stays below and outside.

## 1. Files changed and content model

**Content model:** the optional `sourceCriticism` field in `editorial/events.yaml`. It is either left out or holds at least one non-empty string, each one paragraph of inline Markdown (bold, italics, https:// or site-path links, `<br>`). It renders as `TimelineEvent.sourceCriticismHtml`.

**Code:**
- **`src/lib/timeline/inline-html.ts`:** `renderInlineMarkdown` (exactly one paragraph) and the `allowSitePaths` option.
- **`src/lib/editorial/schema.ts`:** the field.
- **`src/lib/editorial/assemble.ts`:** rendering, and a `SourceCriticismError` that names the event id and paragraph number.
- **`src/components/TimelineEvent.astro`:** a native `<details class="event__criticism">` between the figure and the sources.
- **`src/styles/timeline.css`:** toggle and body styles, reduced-motion transitions and print rules.
- **`src/scripts/print-details.ts`:** opens the new disclosures for printing.
- **`scripts/timeline-snapshot.ts`:** the metadata snapshot, with `write` and `check` modes.

**Content:** 24 descriptions in `input/timeline.md` and 24 `sourceCriticism` entries in `editorial/events.yaml`.

**Tests:**
- `tests/unit/dates-ids-inline.test.ts` gains 7 cases.
- `tests/unit/editorial.test.ts` gains 6 cases.
- `tests/site/output.test.ts` gains 3 tests for the disclosure invariants.

**Docs:**
- `README.md`: the new „Add source criticism to an event” section, the snapshot command, the project layout and the spec list.
- `specs/001-d18-history-timeline/contracts/editorial-metadata.md`.

## 2. Counts

- **Cards with source criticism:** 24, with 35 paragraphs in total. Every one is shorter than before.
- **Within 2–4 sentences or 90 words:** all 24 (100%; the target was ≥ 80%). The longest visible text is the 1939 three-researchers card at 89 words.
- **Descriptions rewritten:** the same 24. No other description changed.
- **Unchanged:** 151 events. 13 of them are over 60 words; each is recorded in `reconciliation.md` with a reason. Most are long because of story or data rather than evidence, and the brief does not allow parking story content in the notes.
- **Music cards:** unchanged. Their notes are narrative, and the recording details are already behind „Források”.
- **FR-011 named cards:** all 22 were reviewed.
  - 19 were rewritten: the Uhereczky thread ×5 plus the 1947 csempészper, Wágner ×2, Földes, Róthmüller 1932–1938, Kiss, Nagy, Hernád, Takáts, Kálix, Strandfürdő 1925, three researchers, rabbiözvegy and Takács bank.
  - 5 were left unchanged with reasons: Rintche, the Róthmüller brothers, Strandfürdő 1923 (22 words, already short) and the two Márkus József cards.

| Era | Rewritten |
|---|---|
| 1873–1913 | 1 |
| 1914–1938 | 18 (including the pilot) |
| 1939–1945 | 3 |
| 1946–1968 | 2 |

## 3. Before and after examples

The full before and after texts for all 24 cards are in `reconciliation.md`.

**A. 1929 gearbox** (`1929-apr-29-…`), 63 → 42 visible words.

- **Visible:** „…szabadalmi bejelentést tesz egy »elektromos úton működő sebességváltó berendezés autókhoz« című találmányra. Ez bejelentés, nem megadott szabadalom, és nem is elkészült szerkezet. A bejelentő azonossága az autóépítővel és a házhoz 1924-ben kapcsolt Uhereczky Ferenccel valószínű, de nem igazolt.”
- **Notes:** the U. 765 application number versus a register number; no evidence of the device being built or fitted to the car; no street address, so the identity is inferred.

**B. 1937 Wágner III/3** (`1937-okt-12-31-…`), 111 → 57 words.

- **Visible:** the 1937 III/3 address; the October theft sentence and transfer to Szeged; the 1940 final sentence; and that the entry proves III/3 for 1937 only.
- **Notes:**
  - the calculated release date of 14 Sept 1938;
  - the 1922 joint sikkasztás case with his wife and their later divorce;
  - the 1922 versus 1924 discrepancy;
  - the 1940 details, and that the 1940 register gives only "Budapest".

**C. 1924 notarial record, Uhereczky and Drescher** (`1924-egy-kozjegyzoi-…`), 93 → 45 words.

- **Visible:** the two men share the address; whether it is a home or a business address can't be decided; Uhereczky is very likely the champion, but this isn't closed.
- **Notes:** the lakhely/telephely field and the unknown declaration; Drescher's directory entry; why III/5 doesn't carry over; the basis for the identification.

**D. 1944 Flam Jakab** (`1944-jun-jul-…`), 77 → 36 words.

- **Visible:** the list item, and that the list proves a business site, not closure or residence.
- **Notes:** the Flan/Plan readings; that the ministerial letter doesn't mean automatic closure; that continuity with Szöghy is not proven.

**E. 1919 Kiss János** (`1919-kiss-janos-…`), 53 → 44 words.

- **Visible:** the „izgatás” heading, and that the act and the outcome are unknown.
- **Notes:** a catalogue heading proves neither the act nor a judgment; the Red Guard role doesn't imply Lenin Boys membership.

## 4. Inconsistencies found

**Fixed:**
- **"A ház 1924-es lakója"** appeared on four Uhereczky cards: the gearbox, the small car, the garage and the 1947 csempészper. The 1924 notarial record doesn't prove residence, so each now says „a házhoz 1924-ben kapcsolt Uhereczky”. This is weaker, never stronger.

**Flagged, not fixed** (outside this refactor's scope, which keeps titles and captions):
- **Wágner's joint sikkasztás:** the 1937 card dates it 1922 (the couple's 1922 registers; the research file gives a 29 December 1922 judgment). The 1933 previous-record column, quoted on the 1908–1909 card, says "1924. sikkasztás 2 hó". The visible text no longer states a year, and both cards' notes record the discrepancy. The spec and tasks had wrongly called the brief's "1922" incorrect; tasks.md carries a correction note.
- **The Rintche date label „1928. okt. 20. – eltérő lapfejléc”:** the label carries the caveat. A cleaner label would change the event id, so it's left as it is.
- **Titles that say "a házban" where only an address is documented:** „Autós vállalkozók a házban” (Takáts), „Kik dolgoztak a házban?” (the 1930s notarial catalogues) and „Parkettázómester a házban” (Szöghy).
- **The caption of the 1947 csempészper** calls the 1924 Uhereczky „a ház korábbi lakója”.
- **The caption of `1905-jun-25-…`** uses the word "timeline" („A timeline dátuma…”), the same anglicism that was removed from the song notes.
- **Page weight:** the home page was already slightly above the constitution's 100 KB initial-view line before this feature, at about 105 KB brotli for HTML plus CSS and JS. Reducing it is a separate task.

## 5. Tests and results

| Check | Result |
|---|---|
| `pnpm test` | 162 passed (149 before, plus 13 new) |
| `pnpm check` | 0 errors |
| `pnpm build:draft` and `pnpm test:site` | 97 tests passed (94 before, plus 3 new); html-validate clean; linkinator scanned 825 links with no broken links or fragments |
| `node scripts/timeline-snapshot.ts check …` | `0 differences`: ids, dates, lanes, certainty, titles, images, captions, sources and counts per era and scope are all identical |
| `git diff 3a8f9b3 -- src/pages src/lib/epulet src/lib/lakok editorial/site.yaml editorial/music.yaml` | empty |
| Headless Chromium checks (CDP, `pnpm preview`) | all passed; details below |
| Screenshots | 375 px and 1280 px, from all four eras |
| `pnpm build:release` and `pnpm lighthouse` | all 6 pages pass |

**The headless checks covered:**
- **Layout:** 24 disclosures, all 44 px tall and inside their cards, with no horizontal scroll at 320, 768 and 1280 px.
- **State:** all start closed. Enter opens with no scroll change; Space opens a second card while the first stays open.
- **Screen reader and slider:** the name and expanded state are exposed, and the open state survives slider changes.
- **Print:** in print media the closed notes are laid out. `beforeprint` opens them all, and `afterprint` restores the reader's own open or closed state.
- **No JavaScript and lightbox:** a click opens the disclosure with scripts disabled, and the lightbox opens on a rewritten card.

**Lighthouse:**

| Page | Performance | Accessibility | Best practices | SEO | Other |
|---|---|---|---|---|---|
| Home | 97 | 100 | 100 | 100 | LCP 2.3 s, CLS 0.001, TBT 88 ms |
| Other five pages | 99–100 | 100 | 100 | 100 | |

**Page weight** (`dist/index.html`, brotli): 78,086 bytes before and 78,908 after, both draft builds, so **+822 bytes**, within the 3 KB cap. The release build is 79,240 bytes.

**Not checked:**
- a real screen reader (only the accessibility tree was checked);
- a physical phone (only the emulated 375 px viewport);
- an actual printed or PDF page (only print media emulation and the print events).

**The slider and open disclosures:** the slider hides cards with CSS only, so an open disclosure stays open while its card is hidden and reappears open (FR-020).
