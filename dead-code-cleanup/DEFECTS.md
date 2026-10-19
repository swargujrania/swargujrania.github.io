# Known Website Defects

This file records defects discovered during the dead-code cleanup baseline on 2026-09-06. These issues predate cleanup implementation unless noted otherwise. They are documented for future fixes and must not be treated as cleanup regressions.

## D-001 — Shared tab initialization fails on project pages

- **Severity:** High
- **Affected files:** All project-detail pages loading `js/main.js`
- **Observed behavior:** The browser reports `TypeError: Cannot set properties of null (setting 'onclick')` at `js/main.js:415`.
- **Cause:** Homepage-only tab initialization assumes elements `l1`, `l2`, `l3`, and `l5` exist on every page.
- **Impact:** The shared document-ready handler terminates early on project pages, so later code in that handler cannot run.
- **Future fix direction:** Guard tab initialization behind the presence of the complete tab interface or move homepage-only behavior into a page-specific initializer.
- **Verification:** Load every project page and confirm there are no console errors while existing scrolling, navigation, and content remain unchanged.

## D-002 — Duplicate hidden Drone IDs on the homepage

- **Severity:** Medium
- **Affected file:** `index.html`
- **Observed behavior:** IDs `drone`, `droneimage`, and `dronetext` are repeated across 11 invisible placeholder cards.
- **Cause:** A visible project-card component was copied to create grid placeholders.
- **Impact:** The document is invalid and ID-based hover selectors may target the wrong element.
- **Future fix direction:** Replace placeholder cards with equivalent layout spacing, then remove the duplicated hidden markup.
- **Verification:** Confirm unique IDs, unchanged card positions and section height, working hover overlays, and equivalent desktop/mobile screenshots.

## D-003 — Duplicate `summary` IDs on project pages

- **Severity:** Medium
- **Affected files:** `flow.html`, `infoviz.html`, and `wheelchair.html`
- **Observed behavior:** Each affected document contains more than one element with `id="summary"`.
- **Impact:** `#summary` navigation and DOM lookup behavior are ambiguous.
- **Future fix direction:** Identify the intended hash target and rename or remove the additional IDs without changing the visible content.
- **Verification:** Direct `#summary` navigation must land on the intended heading and all IDs must be unique.

## D-004 — Empty homepage links

- **Severity:** Low
- **Affected file:** `index.html`
- **Observed behavior:** Five anchors use `href=""`.
- **Cause:** The anchors are contained in hidden placeholder project cards.
- **Impact:** If activated programmatically or exposed by future styling changes, they reload or navigate to the current page.
- **Future fix direction:** Remove them together with the hidden placeholder cards.
- **Verification:** No empty `href` attributes remain and the visible project links are unchanged.

## D-005 — Missing default background image

- **Severity:** Medium
- **Affected file:** `css/main.css`
- **Observed behavior:** The homepage requests `/img/bg-default.jpg`, which returns 404.
- **Cause:** A CSS rule references an asset that is not present in the repository.
- **Impact:** The intended fallback/default background may be absent and every applicable page incurs a failed request.
- **Future fix direction:** Determine whether the rule is active. If active, restore the intended asset or select an existing equivalent; if dead, remove the rule only after runtime proof.
- **Verification:** No background-image 404 occurs and appearance remains unchanged.

**Status:** Resolved on 2026-09-08 by removing the missing background URL from compiled CSS, Sass, and page social metadata. Representative pages continue to return HTTP 200; visual equivalence requires deployment screenshot review.

## D-006 — Missing favicon

- **Severity:** Low
- **Affected scope:** Site-wide
- **Observed behavior:** Browsers request `/favicon.ico`, which returns 404.
- **Cause:** No favicon file or explicit favicon link exists.
- **Impact:** Browser tabs show a fallback icon and generate a failed request.
- **Future fix direction:** Add an approved favicon and explicit metadata as a separate content change.
- **Verification:** The favicon request succeeds on local and deployed environments.

## D-007 — Broken Open Sans specimen-page dependencies

- **Severity:** Low
- **Affected file:** `fonts/opensans/opensans-regular-demo.html`
- **Observed behavior:** Requests for `specimen_files/specimen_stylesheet.css` and `specimen_files/easytabs.js` return 404.
- **Impact:** The directly addressable font specimen page may be incompletely styled or interactive.
- **Future fix direction:** Restore the missing specimen files or explicitly retire the specimen page after confirming it is not intended for direct access.
- **Verification:** The specimen page has no failed local requests and its tabs and styling work.

## D-008 — Project pages do not initialize FullPage

- **Severity:** Informational / requires product confirmation
- **Affected files:** All project-detail pages
- **Observed behavior:** Project pages use `id="itempage"`, while `js/main.js` initializes FullPage only for `#mainpage`.
- **Current behavior:** Long project content uses normal document scrolling and renders successfully.
- **Risk:** This may be intentional. Changing it could substantially alter scrolling and layout.
- **Future fix direction:** Do not change without confirming the intended project-page scrolling model.
- **Verification:** If retained, document normal scrolling as intentional. If changed, perform full desktop, mobile, keyboard, wheel, touch, and hash-navigation regression testing.

## D-009 — Broken inherited template navigation links

- **Severity:** Medium
- **Affected files:** 13 project-detail pages
- **Observed behavior:** Links to `gallery.html`, `item.html`, and `demo.html` resolve to files that are absent from the repository.
- **Impact:** Activating these inherited template links produces 404 navigation.
- **Future fix direction:** Confirm whether the links are obsolete template chrome. Remove or replace only after checking direct URLs and intended portfolio navigation.
- **Verification:** Exercise every affected link and confirm no intended route is lost.

**Status:** Resolved on 2026-09-08 by removing the obsolete inherited menu entries from the 13 affected project pages. All affected pages still return HTTP 200; no replacement route was introduced.

## D-013 — Direct-entry placement review for Honeywell and password template

- **Severity:** Informational
- **Affected files:** `honeywell.html`, `password_template.html`
- **Observed behavior:** Both pages have no inbound HTML links and may be intended for direct or protected access.
- **Required action:** Review whether these pages should be moved into a dedicated protected/archive location, preserving case-sensitive direct URLs and deployment behavior.
- **Verification:** Confirm canonical URLs, redirects, access controls, noindex behavior, and all direct references before any move.

## D-014 — Orphaned asset review queue

- **Severity:** Informational
- **Affected scope:** 32 media/font/specimen candidates listed in `ORPHAN_ASSET_REPORT.md`
- **Observed behavior:** Candidates have no detected textual source reference.
- **Required action:** Complete path/history/source searches, runtime/direct-entry checks, and ownership confirmation before deciding whether any asset can be removed.
- **Verification:** Record an item-level decision and rollback path for every candidate.

## D-015 — Direct-entry review queue

- **Severity:** Informational
- **Affected scope:** Unlinked pages, specimen/demo content, protected resources, and externally addressable assets
- **Observed behavior:** Lack of inbound repository links does not establish that a resource is unused.
- **Required action:** Test canonical case-sensitive URLs in staging, inspect redirects and hosting configuration, and confirm owner intent.
- **Verification:** Preserve unresolved resources and document pass/fail evidence before any deletion or relocation.

## D-016 — MailChimp library usage review

- **Severity:** Informational
- **Affected scope:** `ajaxserver/servermailchimp.php` and `ajaxserver/mailchimp/`
- **Observed behavior:** The repository contains a MailChimp endpoint and bundled client classes; active production use has not been established.
- **Required action:** Trace includes, calls, form actions, deployment configuration, and staging/server logs. Remove only if no active use is proven and the owner approves.
- **Verification:** Run credential-safe form and endpoint regression checks after any approved removal; preserve rollback evidence.

**Static trace status:** `servermailchimp.php` is not referenced by repository HTML, JavaScript, or PHP callers other than its own MailChimp include. The bundled classes are referenced by that endpoint. This is a candidate for manual removal review, not an approved deletion, because external clients or deployment configuration may invoke the endpoint directly.

**Review update (2026-09-08):** Active site forms resolve to `ajaxserver/serverfile.php`, not `servermailchimp.php`. No PHP interpreter is available locally for syntax or endpoint testing. The MailChimp endpoint/library remains an uncertain direct-entry candidate pending staging logs and owner confirmation.

## D-010 — Missing inherited sample images

- **Severity:** Low
- **Affected files:** Five project-detail pages
- **Observed behavior:** References to `img/items/img-portrait.jpg` and `img/items/img-sample7.jpg` do not resolve.
- **Impact:** Affected template/demo content can show broken-image placeholders.
- **Future fix direction:** Determine whether these images are visible or reachable content; restore approved assets or remove the obsolete references.
- **Verification:** Review affected pages at desktop and mobile sizes and confirm no broken-image requests.

**Status:** Resolved on 2026-09-08 by removing the five pairs of inherited sample-image elements. All five affected pages return HTTP 200; no remaining source references exist.

## D-011 — External references require availability review

- **Severity:** Informational
- **Affected scope:** External links, embeds, fonts, documentation, social links, and form integrations
- **Observed behavior:** External URLs were inventoried but not dereferenced during cleanup.
- **Impact:** A URL may be retired, redirected, access-restricted, or temporarily unavailable; static analysis cannot distinguish these cases.
- **Future fix direction:** Check high-value user-facing and integration URLs separately. Do not remove or rewrite them based solely on a transient failure.
- **Verification:** Record status, redirect behavior, and ownership for each changed external reference.

## D-012 — Static hash audit cannot prove fullPage section targets

- **Severity:** Informational
- **Affected files:** Project-page links to `index.html#home`, `#about`, `#projects`, `#art-intro`, and `#contact`
- **Observed behavior:** Conventional `id` lookup reports 96 broken hash references, while the homepage uses fullPage `data-section` and `data-menuanchor` metadata for those sections.
- **Impact:** A simplistic cleanup tool could incorrectly remove valid navigation.
- **Future fix direction:** Keep these links and validate them through browser navigation and the fullPage runtime configuration.
- **Verification:** Open each section link from a project page and confirm the expected homepage section is selected.
