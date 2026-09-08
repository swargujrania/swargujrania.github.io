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

## Phase 3 — Dead-code catalog

### Step 1 — Candidate inventory (completed)

- Added `CANDIDATE_CATALOG.md` with evidence, risks, confidence, and proposed validation for 11 candidate groups.
- Catalogued markup, JavaScript, links, assets, Sass, protected/demo content, and vendor code.
- No candidate was classified as confirmed dead and no application or dependency code was removed.

### Step 2 — Candidate classification (completed)

- Classified all 11 candidate groups using the plan's evidence thresholds.
- Confirmed-dead set remains empty.
- Marked duplicated/defective behavior as behavior-affecting, dynamic/template/asset questions as uncertain, Sass/vendor surfaces as retained dependencies, and protected/demo content as intentionally retained pending review.
- No application or dependency code was changed.

### Step 2 — Comments and empty handlers (validated)

- Confirmed `js/main.js` `noop` is actively assigned to console methods and retained it.
- Identified the empty `window.onhashchange` assignment as behavior-affecting pending browser verification; it was not removed.
- Classified TODO comments as non-executable maintenance notes and Vegas callback stubs as vendor defaults; neither was changed.

### Step 3 — Unreachable branches and empty elements (validated)

- Found no literal unreachable application branches.
- Confirmed dynamic project definitions remain active candidates under C-002.
- Determined automated empty-element matches include scripts, icon elements, layout containers, and plugin placeholders; none is safe to remove without runtime and CSS checks.
- No application code was changed.

### Step 4 — Dynamic project loader (validated, retained)

- Traced the dynamic project data and found no active `LoadProjects` caller; the homepage renders project cards statically.
- Retained the implementation pending browser instrumentation for global reads, filter interactions, and script timing.
- Classified C-002 as uncertain; no JavaScript was removed.

### Step 5 — Hidden Drone placeholders (validated, retained)

- Confirmed 11 hidden cards remain in layout flow because `.invisible` uses `visibility: hidden`.
- Confirmed their links, images, duplicate IDs, and hover markup make them behavior-affecting rather than empty content.
- Retained all cards pending desktop/mobile layout measurements and before/after browser comparison.

### Step 6 — Layout measurement baseline (partially completed)

- Loaded the homepage through a temporary local server and confirmed the Projects section and hidden-card markup render in the browser.
- The available browser surface did not expose a DOM geometry evaluation method in this run, so numeric desktop/mobile measurements could not be captured.
- Stopped before any placeholder removal; a measurement-capable browser pass remains required.

## Phase 4 — Low-risk cleanup

### Step 1 — Tracked Finder metadata (validated and removed)

- Validated `img/hyperloop/.DS_Store` as non-application Finder metadata with no runtime or repository references.
- Confirmed `.gitignore` already excludes `.DS_Store`.
- Removed only the validated artifact; no application, dependency, link, or package files were changed.

## Phase 5 — Main-page placeholder cleanup

### Step 1 — Structural baseline (completed)

- Confirmed one Projects section, 29 card containers, 11 hidden placeholder cards, and 19 project-page links in `index.html`.
- Preserved card order, classes, links, and section metadata as the pre-change structural baseline.
- Numeric geometry and responsive measurements remain pending a browser surface with DOM evaluation; no placeholder markup was changed.

### Step 2 — Conservative layout evaluation (completed)

- Confirmed both Sass and compiled CSS explicitly document `.invisible` as maintaining layout via `visibility: hidden`.
- Confirmed all 11 hidden cards contain anchor/image markup, so they are not inert empty nodes.
- Decision: **do not remove or replace** the cards without pixel-level desktop/mobile measurements and before/after interaction checks.

### Step 3 — Replacement feasibility review (completed)

- The cards use Bootstrap column classes, `center-vh`, `tagged`, inline margins, links, images, and hover-target IDs.
- A generic spacer would not yet be demonstrably equivalent across breakpoints because column width, row wrapping, and vertical centering are inherited from these classes.
- Decision: retain the original markup until a measurement-capable runtime can compare an equivalent grid-only replacement.

## Phase 6 — Shared JavaScript cleanup

### Step 1 — Initializer inventory (completed)

- Audited `js/main.js` feature blocks: console shim, background data attributes, countdown, menu behavior, carousel/slideshow, video background, animation wrapping, FullPage/normal scrolling, form setup, scroll controls, loader, thumbnail hover behavior, dynamic project data, and tab initialization.
- Each block has page-level selectors or plugin side effects; no initializer was approved for removal from static inspection alone.
- The project-page tab exception remains the highest-risk shared-handler issue and requires a guarded fix plus cross-page regression testing before cleanup.

### Step 2 — Page/feature activation mapping (completed)

- Mapped shared initializers against page markup and confirmed FullPage, menu, loader, and shared navigation surfaces span the primary portfolio pages.
- Confirmed thumbnail hover markup is concentrated on the homepage, while the shared handler still executes on every page and must tolerate zero matches.
- Tab markup is present on selected pages, but the current unguarded lookup is not safe on pages without all tab elements; this remains a defect remediation candidate rather than dead-code deletion.
- Plugin initializers and form/video/countdown branches remain conditional and require runtime coverage before import or initializer changes.
- No JavaScript was removed or reordered.

### Step 3 — Shared script loading consistency (completed)

- Confirmed `js/main.js`, the jQuery dependency, and `jquery.downCount.js` are loaded by all 14 primary portfolio pages.
- Confirmed `main.js` exposes no independently callable application functions outside its ready-handler scope; most behavior is selector- and plugin-conditional.
- The shared import cannot be trimmed globally without splitting page-specific behavior and re-running the full page matrix.
- Retained script order and all dependencies; no code changes were made.

## Phase 7 — Page-import cleanup

### Step 1 — Import inventory (completed)

- Confirmed all 14 primary portfolio pages load the same 11 stylesheets and 8 scripts.
- Auxiliary specimen pages have separate legacy import sets; directory indexes and protected/password pages intentionally load no shared assets.
- No page-specific import was removed because feature absence, indirect dependencies, console behavior, and responsive equivalence still require runtime checks.

### Step 2 — Import dependency evaluation (completed)

- Confirmed the primary pages use shared navigation, FullPage, loader, typography, icon, and responsive framework surfaces even when individual feature selectors are absent.
- Swiper, Vegas, and FullPage styles/scripts remain indirect dependencies of the shared initializer and page structure; static selector absence is not removal evidence.
- The commented Major Mono stylesheet is not an active import and was left untouched.
- No stylesheet or script import met the plan's removal threshold; all imports and ordering were preserved.

## Phase 8 — CSS and Sass cleanup

### Step 1 — Selector and source-authority audit (completed)

- Candidate selectors (`.invisible`, `.tagged`, `.center-vh`, `.img-avatar-beta`) are actively used by homepage markup and shared JavaScript behavior.
- No build configuration or reproducible Sass compilation workflow was found; committed compiled CSS remains the active runtime stylesheet.
- Sass contains corresponding source rules and must be preserved for maintainability until a build workflow is established.
- No selector or stylesheet rule was removed.

### Step 2 — Reachability check (completed)

- Verified candidate selectors against HTML, CSS, Sass, and JavaScript references.
- `.invisible`, `.tagged`, `.center-vh`, `.img-avatar-beta`, and animation classes all have active markup or JavaScript consumers.
- JavaScript adds/removes state classes such as `menu-visible`, `gone`, `transition`, `scrolled`, and `p-hidden`; static CSS matching alone cannot identify them as unused.
- No selector met the safe-removal threshold; no CSS or Sass was changed.

## Phase 9 — Assets and server-side code

### Step 1 — Asset/server inventory (completed)

- Added `ORPHAN_ASSET_REPORT.md` covering 208 image/media files, font families and specimens, PHP endpoints and MailChimp classes, demo/protected pages, and vendor libraries.
- No asset, page, endpoint, dependency, or vendor file was classified as safe to delete from static reachability alone.
- Manual ownership, direct-entry, deployment, and server-side checks remain required before any deletion.

### Target cleanup — inherited navigation links (completed)

- Removed dead `gallery.html`, `item.html`, and `demo.html` menu references from 13 project pages.
- Verified no remaining HTML references to those targets.
- Verified all 13 affected pages still return HTTP 200 from the local server.

### Target cleanup — missing sample images (completed)

- Removed references to `img/items/img-sample7.jpg` and `img/items/img-portrait.jpg` from five inherited/template sections.
- Verified no remaining source references to either missing image.
- Verified all five affected pages still return HTTP 200 from the local server.

### Target cleanup — missing default background (completed)

- Removed `img/bg-default.jpg` references from 14 page metadata blocks, `css/main.css`, and `sass/component/_cover.scss`.
- Verified no remaining source references to the missing path.
- Verified representative homepage and project pages return HTTP 200 after the change.
- Visual appearance must receive deployment screenshot review because the fallback background image was removed rather than replaced.

### Step 2 — Static media/font reference summary (completed)

- Scanned 266 files under `img/` and `fonts/`; 234 had textual references and 32 were unreferenced candidates.
- Recorded the limitations of basename/path matching in `ORPHAN_ASSET_REPORT.md`.
- Preserved every candidate pending runtime, direct-entry, and ownership checks.

## Runtime validation — Phases 3–8 initial pass

- Local HTTP requests returned 200 for all 14 primary portfolio pages.
- Known unresolved targets returned 404 as expected: `img/bg-default.jpg`, inherited `gallery.html`/`item.html`/`demo.html`, and the two inherited sample images.
- The homepage loaded in the browser at `#projects`; menu, tab labels, visible project cards, section content, footer, and navigation links were present in the accessibility tree.
- Browser console, DOM geometry, computed-style, and responsive pixel comparisons remain unavailable through the current browser surface; no behavior-affecting candidate was removed.

### Plan update — mandatory Phase 9 runtime validation

- Updated `DEAD_CODE_CLEANUP_PLAN.md` to require desktop/mobile network checks, direct-entry and interaction testing, computed-style/font verification, server-side request tests, ownership confirmation, and recorded evidence before any asset or endpoint deletion.

### Plan update — runtime validation across Phases 3–8

- Added mandatory before/after runtime checks for placeholder markup, shared JavaScript, page imports, CSS/Sass selectors, duplicate IDs, links, hashes, scrolling, menus, forms, and responsive behavior.
- Required explicit pass/fail evidence in the cleanup log before each deletion or behavior-affecting edit.

### Runtime validation rerun — Phases 3–8 and Phase 9 candidates

- Re-requested all 15 top-level HTML pages; every page returned HTTP 200 after the approved reference removals.
- Confirmed removed target paths remain 404 but have no remaining source references.
- No additional Phase 3–8 item was proven safe to remove through available runtime checks.
- No Phase 9 asset, font, PHP, protected, demo, or vendor item was proven safe to remove; all remain manual-review candidates.

### Phase 9 manual review started

- Listed all 32 unreferenced media/font/specimen candidates in `ORPHAN_ASSET_REPORT.md`.
- Began direct-entry checks and found four pages without inbound HTML links: two font specimen demos, `honeywell.html`, and `password_template.html`.
- Reviewed representative Git history; ownership and external-use confirmation remain unresolved.
- Preserved all candidates; none is approved for removal.

### Defect register update — Phase 9 review queues

- Added D-013 for direct-entry placement review of `honeywell.html` and `password_template.html`.
- Added D-014 for the 32-item orphaned asset review queue.
- Added D-015 for the broader direct-entry review queue covering unlinked, specimen, demo, protected, and externally addressable resources.

### Phase 9 direct-entry runtime sample

- Direct local requests for `honeywell.html`, `password_template.html`, both font specimen demos, and four representative orphaned resources returned HTTP 200 with no redirects.
- Marked local addressability as confirmed; ownership and production-use intent remain unresolved.
- Preserved all resources.

### Phase 9 ownership review

- Git authorship for sampled assets and direct-entry pages consistently identifies the repository owner.
- Treated authorship as provenance only; no deletion or relocation was approved without explicit current-intent confirmation.

### Phase 9 server-side review

- Confirmed `js/main.js` actively references `ajaxserver/serverfile.php` for form handling.
- Confirmed `servermailchimp.php` and bundled MailChimp classes have include/call relationships.
- Preserved all PHP endpoints and server-side libraries pending staging request tests and credential-safe review.

### Plan/defect update — MailChimp library review

- Added a plan step requiring include/call tracing, form and deployment verification, credential-safe staging tests, owner confirmation, rollback evidence, and post-removal regression checks before removing MailChimp code.
- Added D-016 to track this review.

### D-016 static trace result

- Found no repository caller for `servermailchimp.php` beyond its own MailChimp include; the bundled classes are internally referenced by that endpoint.
- Classified the endpoint/library as uncertain and directly addressable, not confirmed dead.
- Preserved all MailChimp files pending deployment logs, staging endpoint tests, and owner confirmation.

### Phase 9 deployment metadata check

- Found only `CNAME` repository metadata; no in-repository deployment configuration, sitemap, robots file, or workflow references the reviewed resources.
- Kept all resources preserved because hosting-provider settings and external clients are outside repository visibility.

### Phase 9 repository review status

- Repository-visible direct-entry, ownership provenance, server-side relationships, and deployment metadata checks are complete.
- Remaining decisions require external owner confirmation, hosting-provider access, deployment logs, or staging endpoint tests.
- No Phase 9 deletion or relocation is authorized from repository evidence alone.

## Phase 10 — Incremental validation

### Step 1 — Static regression suite (completed)

- Scanned 26 HTML files after the Phase 9 commit.
- Remaining duplicate IDs are the known behavior-affecting findings: Drone placeholders on `index.html` and duplicate `summary` IDs on `wheelchair.html`, `flow.html`, and `infoviz.html`.
- Remaining missing local `href`: Open Sans specimen stylesheet dependency, tracked as D-007.
- No new duplicate-ID or missing-link regression was introduced by the approved reference cleanup.

### Step 2 — Full page-request regression (completed)

- Requested all 18 HTML pages, including protected and font specimen pages.
- All returned HTTP 200; no page-level response regression was found.
- Console, DOM geometry, computed-style, and interaction checks remain separate pending capabilities documented by the final runtime-validation gate.

### Step 3 — Link, hash, and exact-case regression (completed)

- Remaining missing local href: `fonts/opensans/opensans-regular-demo.html` → `specimen_files/specimen_stylesheet.css`, previously tracked as D-007.
- No new broken links were introduced by the approved cleanup; removed inherited targets no longer appear in source.
- The automated case pass produced one result tied to the same missing specimen path, not a confirmed case mismatch.
- Hash targets and duplicate IDs remain known review items requiring browser interaction validation.

## Phase 11 — Deployment verification

### Step 1 — Deployment metadata and preview readiness (completed)

- Confirmed the cleanup branch is `portfolio-revision/sep2026` with GitHub remote `swargujrania/swargujrania.github.io`.
- Confirmed custom domain metadata remains `swargujrania.com` in `CNAME`.
- No repository deployment workflow or preview configuration is present.
- GitHub Pages preview deployment, HTTPS/custom-domain routing, caching, and production comparison remain pending external deployment access.

### Plan update — final orphaned-asset review

- Added a mandatory end-of-plan review step requiring path/history/source searches, direct-entry and deployed-page checks, ownership confirmation, evidence logging, rollback planning, and full post-deletion validation before removing any orphaned asset.

### Plan update — final direct-entry review

- Added a dedicated direct-entry review requiring canonical URL enumeration, deployed direct requests, redirect/console/network/render checks, protected/demo/specimen and hosting review, and owner confirmation before removing unlinked pages or resources.

### Plan update — final review gate placement

- Consolidated orphaned-asset and direct-entry reviews into explicit final end-of-plan gates after deployment verification and before merge.
