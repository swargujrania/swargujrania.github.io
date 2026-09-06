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

