# Dead-Code Cleanup Log

## Working agreement

- Implement one approved step at a time.
- Show the actual diff after each step.
- Validate and commit after each completed phase.
- Preserve existing behavior, links, direct-entry pages, dependencies, and vendor packages.
- Require cataloged evidence before removing code.

## Initial repository state

- Branch: `portfolio-revision/sep2026`
- Tracked files: 519
- No package manifest, lockfile, build configuration, Makefile, or repository documentation was found.
- `DEAD_CODE_CLEANUP_PLAN.md` existed as an untracked file when implementation began.
- `index.html` had an existing uncommitted modification before cleanup implementation began. The user explicitly requested that it be reverted before the Phase 1 commit, and the file was restored exactly to its committed state.

## Phase 1 — Establish scope and baseline

### Step 1 — Inventory and classify tracked files

Status: Completed on 2026-09-06.

No application code was changed in this step.

#### Inventory by top-level location

| Location | Tracked files | Initial classification |
| --- | ---: | --- |
| `img/` | 209 | Content images and animated media; preserve pending reference and direct-use analysis |
| `sass/` | 162 | Potential stylesheet source; source-of-truth status unresolved |
| `fonts/` | 58 | Font dependencies, stylesheets, specimens, and directory index content |
| `js/` | 46 | Shared application scripts, vendor libraries, minified/unminified variants, and vendor assets |
| Repository root | 18 | Primary and project HTML entry points, site configuration, and repository metadata |
| `demopage/` | 9 | Demo images; possible direct-entry or archival content requiring manual classification |
| `css/` | 9 | Runtime, vendor, theme, and page-loader stylesheets |
| `ajaxserver/` | 7 | PHP endpoints and Mailchimp integration; possible externally callable server code |
| `vid/` | 1 | Directory index page |

#### Inventory by file type

| Type | Count | Initial classification |
| --- | ---: | --- |
| Sass (`.scss`) | 162 | Potential source code |
| JPEG (`.jpg`) | 125 | Content assets |
| PNG (`.png`) | 90 | Content and vendor assets |
| JavaScript (`.js`) | 24 | Application and vendor code |
| CSS (`.css`) | 23 | Runtime, source, vendor, demo, and font styles |
| HTML (`.html`) | 22 | Public, protected, demo, specimen, and directory entry pages |
| GIF (`.gif`) | 14 | Content animations and vendor loader assets |
| WOFF (`.woff`) | 11 | Font assets |
| TTF (`.ttf`) | 10 | Font assets |
| SVG (`.svg`) | 10 | Font assets and possible content |
| EOT (`.eot`) | 10 | Legacy font assets |
| PHP (`.php`) | 6 | Server endpoints and libraries |
| HTM (`.htm`) | 4 | Directory index pages |
| WOFF2 (`.woff2`) | 2 | Font assets |
| Other | 5 | `CNAME`, `.gitignore`, `.txt`, `.otf`, `.map`, and tracked `.DS_Store` artifact |

#### Initial functional groupings

- Main entry point: `index.html`
- Project pages: `aso.html`, `drone.html`, `emoi.html`, `flow.html`, `hashtag.html`, `honeywell.html`, `hyperloop.html`, `infoviz.html`, `luminai.html`, `parqr.html`, `poison.html`, `researchRepo.html`, and `wheelchair.html`
- Protected or special pages: `honeywellencrypted.html` and `password_template.html`
- Directory/index pages: `ajaxserver/index.htm`, `css/index.html`, `fonts/index.htm`, `img/index.html`, `js/index.html`, `js/vendor/index.html`, `fonts/opensans/index.htm`, and `vid/index.htm`
- Font specimen/demo page: `fonts/opensans/opensans-regular-demo.html` and Major Mono specimen content
- Shared application script: `js/main.js`
- Server-side surface: `ajaxserver/` and `ajaxserver/mailchimp/`
- Runtime styling candidates: `css/bootstrap.min.css`, `css/pageloader.css`, `css/main.css`, theme styles, icon-font styles, and FullPage/Swiper/Vegas vendor styles
- Potential stylesheet source: `sass/`
- Vendor dependency area: `js/vendor/`, `js/vegas/`, and `js/particlejs/`

#### Risks and unresolved questions recorded

- Static HTML links alone cannot establish whether direct-entry, protected, demo, or server resources are unused.
- The repository contains both Sass and compiled CSS but no documented or configured build workflow.
- Shared `js/main.js` and vendor resources are loaded by multiple pages; homepage-only evidence is insufficient for removal.
- Vendor and dependency files must remain intact under the cleanup requirements.
- The tracked `.DS_Store` file is a likely cleanup candidate but will not be removed until its dedicated step is approved.

### Step 2 — Determine the stylesheet source of truth

Status: Completed on 2026-09-06.

No application code was changed in this step.

#### Evidence collected

- `sass/main.scss` and `css/main.css` were both added in the initial commit (`466554d`).
- Repository history shows no later changes to `sass/main.scss`.
- `css/main.css` was subsequently modified in at least 16 commits through 2021, including project-tab, hover-text, responsive, and portfolio revisions.
- Live custom selectors such as `.a-highlight`, `.center-title`, `.font-roboto-300`, and `.selectedtab` exist in `css/main.css` but not in the Sass tree.
- No package manifest, task runner, Sass configuration, source map for `main.css`, or documented stylesheet build command exists.
- No `sass` or `sassc` executable is available in the current environment.

#### Decision

- Treat committed files under `css/` as the authoritative runtime stylesheets for this cleanup.
- Treat `sass/` as stale/reference source rather than a safe generation source.
- Do not regenerate runtime CSS from the current Sass tree.
- Do not mirror cleanup edits into Sass automatically, because doing so would falsely imply that Sass reproduces the deployed CSS.
- Catalog suspected dead Sass separately and retain it unless a later, explicitly approved source-reconciliation task establishes a reproducible build.

#### Risk control

- CSS rules will be removed only from the runtime stylesheet that pages actually load and only with static plus runtime evidence.
- Vendor, Bootstrap, FullPage, responsive, animation, pseudo-class, and JavaScript-generated selectors will not be removed solely from source-text matching.

### Step 3 — Establish the behavioral baseline

Status: Completed on 2026-09-06.

No application code was changed in this step. A temporary local HTTP server and browser viewport overrides were used for read-only testing; the viewport override was reset afterward.

#### Pages exercised

- Main page: `index.html`
- Project pages: `aso.html`, `drone.html`, `emoi.html`, `flow.html`, `hashtag.html`, `honeywell.html`, `hyperloop.html`, `infoviz.html`, `luminai.html`, `parqr.html`, `poison.html`, `researchRepo.html`, and `wheelchair.html`
- Protected/template pages: `honeywellencrypted.html` and `password_template.html`
- Directory and specimen pages under `ajaxserver/`, `css/`, `fonts/`, `img/`, `js/`, and `vid/`

#### Verified baseline behavior

- All 14 primary portfolio pages returned successfully from the local server and rendered visible content.
- All images used by the primary portfolio pages loaded with nonzero natural dimensions during the audit.
- The homepage initialized FullPage with five sections and selected `home` on direct entry.
- Direct navigation to `index.html#contact` selected the Contact section.
- At a 390 × 844 viewport, the mobile menu opened and closed correctly and the Design tab switched visibility from `content1` to `content2`.
- At a 1440 × 900 viewport, the Highlights tab displayed three visible cards in a single row and three hidden placeholder cards in a second row.
- The protected Honeywell page rendered its password prompt and instructional text.
- Directory index and font specimen pages were treated as directly addressable pages rather than assumed dead content.

#### Existing runtime and markup defects

- Every project-detail page throws `TypeError: Cannot set properties of null (setting 'onclick')` at `js/main.js:415`. The shared homepage tab initializer assumes `l1`, `l2`, `l3`, and `l5` exist on every page.
- `index.html` contains repeated `drone`, `droneimage`, and `dronetext` IDs due to 11 hidden placeholder cards.
- `flow.html`, `infoviz.html`, and `wheelchair.html` each contain a duplicate `summary` ID.
- `index.html` contains five empty `href` attributes, all associated with hidden placeholder cards.
- `css/main.css` requests missing `/img/bg-default.jpg`, producing a 404 on the main page.
- `/favicon.ico` is requested implicitly and returns 404.
- The Open Sans specimen page requests missing `specimen_files/specimen_stylesheet.css` and `specimen_files/easytabs.js`.
- Project-detail pages use `id="itempage"`, while FullPage initialization in `main.js` targets only `#mainpage`; their long-form content currently renders through normal document scrolling.

#### Dependency baseline

- The homepage loads 8 local scripts and 10 local stylesheets.
- Each project-detail page loads 8 local scripts and 11 local stylesheets.
- Modernizr actively replaces `no-js` with feature-detection classes on the root element.
- Because dependencies must remain intact, runtime loading alone is not removal approval; per-page imports will be evaluated later with before-and-after checks.

#### Baseline limitations and controls

- Testing used the Codex in-app Chromium browser because a separate Chrome automation surface was not available.
- Desktop and mobile homepage states were visually inspected; automated persistent screenshot fixtures do not yet exist in this repository.
- External links were not activated during this step to avoid leaving the local audit surface; they will be validated in the dedicated reference and link phase.
- The shared JavaScript exception is recorded as pre-existing. Any later fix must be approved as part of the cleanup because it changes erroneous baseline behavior while restoring the intended page initialization path.

#### Defect register

- Baseline defects have been assigned stable identifiers and documented separately in `DEFECTS.md` for future remediation.

## Phase 2 — Build the repository reference graph

### Step 1 — Extract and resolve references

Status: Completed on 2026-09-07.

No application code or dependency files were changed in this step.

- A structured reference report was added at `REFERENCE_GRAPH.md`.
- The scan covered 241 HTML/HTM, CSS, Sass, JavaScript, and PHP source files.
- It extracted 1,008 local-looking reference occurrences; 749 resolved to existing local targets.
- The remaining 259 occurrences include confirmed missing routes plus expected parser false positives from Sass extensionless imports, minified vendor internals, dynamic JavaScript strings, and illustrative specimen snippets.
- High-confidence missing targets include `img/bg-default.jpg`, inherited `gallery.html`/`item.html`/`demo.html` links, missing Open Sans specimen files, and inherited `img/items/` sample images.
- No candidate was approved for deletion from this scan alone.
- External, direct-entry, protected, dynamic, and server-side references were retained as manual-review categories.

### Step 2 — Local-link and hash audit

- Moved all cleanup Markdown documents into `dead-code-cleanup/`.
- Scanned 26 HTML files and checked 683 local references, including `href`, `src`, `poster`, `action`, and `srcset` values.
- Found 51 missing-target occurrences, grouped as inherited template links, missing sample images, and Open Sans specimen assets.
- Found 0 filename-case mismatches.
- Reviewed 96 homepage hash links; their targets use fullPage section metadata, so static id-only checks are false positives.
- No application code or dependency files were changed.

### Step 3 — External-reference inventory

- Inventoried external URLs without modifying or dereferencing them.
- Recorded major external groups (GitHub, Adobe XD, Figma, Google Fonts, social links, documentation, embeds, and form services) in `REFERENCE_GRAPH.md`.
- Preserved every external reference pending dedicated availability and ownership checks.
