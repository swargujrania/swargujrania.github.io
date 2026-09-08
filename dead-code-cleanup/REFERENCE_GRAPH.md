# Repository Reference Graph

Generated during Phase 2, Step 1 on 2026-09-07. This is an inventory and risk report, not a deletion list.

## Scope and method

- Scanned tracked HTML/HTM, CSS, Sass, JavaScript, and PHP files.
- Extracted HTML `src`, `href`, `srcset`, `poster`, and form `action` values.
- Extracted CSS/Sass `url(...)` and `@import` values.
- Resolved relative local paths against the file that contains each reference.
- Normalized query strings and hash fragments for local-file existence checks.
- Checked local path existence with exact case.
- Excluded external URLs, mail links, JavaScript URLs, data URLs, hash-only links, and protocol-relative URLs from local-file checks.

## Results

- Source files scanned: 241
- Local reference occurrences extracted: 1,008
- Existing local target occurrences: 749
- Missing or unresolved local-looking occurrences: 259

The missing count includes expected false positives from Sass extensionless imports, minified library internals, illustrative font-specimen snippets, and dynamic JavaScript strings. It must not be interpreted as 259 broken application references.

## High-confidence missing targets

| Source | Reference | Classification |
| --- | --- | --- |
| `css/main.css` | `../img/bg-default.jpg` | Missing runtime asset; recorded as defect D-005 |
| `aso.html`, `drone.html`, `emoi.html`, `flow.html`, `hashtag.html`, `honeywell.html`, `hyperloop.html`, `infoviz.html`, `luminai.html`, `parqr.html`, `poison.html`, `researchRepo.html`, `wheelchair.html` | `gallery.html`, `item.html`, `demo.html` | Shared template/demo links; direct-use intent unresolved |
| `fonts/opensans/opensans-regular-demo.html` | `specimen_files/easytabs.js` | Missing specimen dependency; recorded as defect D-007 |
| `fonts/opensans/opensans-regular-demo.html` | `specimen_files/specimen_stylesheet.css` | Missing specimen dependency; recorded as defect D-007 |
| `luminai.html`, `hashtag.html`, `drone.html`, `emoi.html`, `researchRepo.html` | `img/items/img-sample7.jpg`, `img/items/img-portrait.jpg` | Template sample images; direct-use intent unresolved |

## Existing target groups

- All primary portfolio page imports resolve to existing local files, including shared scripts, stylesheets, fonts, project images, and vendor resources.
- Project-page navigation links resolve to existing project pages and `index.html` hash targets.
- Sass import targets resolve conceptually through Sass extensionless and partial naming conventions; a naive filesystem check reports them missing because it does not append `.scss` or `_` automatically.
- Font files referenced by active portfolio stylesheets resolve; specimen pages contain separate legacy/template references that do not all resolve.

## Dynamic and indirect references requiring manual handling

- `js/main.js` contains HTML strings with project links and image paths. These are part of the abandoned dynamic-project implementation but cannot be classified as dead until that code path is removed and re-scanned.
- `js/vendor/all.js` and minified vendor files contain generated strings that resemble paths; these are parser false positives, not local asset requests.
- PHP files require server-side inspection of includes, request parameters, and externally callable endpoints rather than browser-source matching alone.
- External URLs in social, blog, resume, ThemeForest, Giphy, and embedded-content links were catalogued as external and intentionally not validated by local existence checks.
- The protected Honeywell flow may be reached through direct URLs and is not classified from internal link counts.

## Known broken or unresolved routes

- `img/bg-default.jpg` is requested by active `css/main.css` but is absent.
- `/favicon.ico` is requested implicitly by browsers but no file is present.
- The Open Sans specimen page references two missing local files.
- `gallery.html`, `item.html`, and `demo.html` are referenced by inherited template navigation but do not exist in the repository. These links require an explicit decision before repair or removal.
- Sample image references under `img/items/` do not exist and may be inherited template content.

## Cleanup implications

- No files are approved for deletion by this graph alone.
- Missing template links and sample assets are defects or unresolved content, not dead-code evidence.
- Sass imports must be interpreted with Sass resolution rules before any source file is labeled orphaned.
- Any later deletion must link back to this graph plus runtime evidence and the defect register.

## Phase 2, Step 2 — local-link and hash audit

The HTML audit scanned 26 HTML files and checked 683 local `href`, `src`, `poster`, `action`, and `srcset` references. Filename casing was verified component-by-component.

- Missing local targets: 51 occurrences: 13 `gallery.html`, 13 `item.html`, 13 `demo.html`, five `img/items/img-portrait.jpg`, five `img/items/img-sample7.jpg`, and two Open Sans specimen assets.
- Case mismatches: 0.
- Hash references: 96 links target homepage sections selected by fullPage `data-section`/`data-menuanchor` attributes rather than conventional `id` attributes; an id-only checker therefore reports false positives. These links remain retained for runtime validation.

No safe cleanup deletion was identified in this step.

## Phase 2, Step 3 — external-reference inventory

An inventory found external URLs across portfolio, social, documentation, vendor, font, embedded-media, and form integrations. The largest groups are GitHub (35 unique URLs), Adobe XD (13), Figma (8), Google Fonts (6), Twitter (4), W3C (4), and Giphy (4), with additional one-off references.

These URLs were not treated as dead based on static analysis. They include direct user links, attribution/documentation links, third-party assets, embeds, and form endpoints. Availability and ownership should be checked separately before any change; temporary network failures must not trigger removal.
