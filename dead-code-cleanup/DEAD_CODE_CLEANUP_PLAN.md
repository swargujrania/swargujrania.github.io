# Repository-Wide Dead-Code Cleanup Plan

## Goal

Identify, catalog, and safely remove code proven to be unused while preserving:

- Existing website appearance and behavior
- Internal and external links
- Directly accessible pages
- Runtime dependencies and vendor packages
- Protected and server-side flows
- Responsive and browser behavior

Behavior preservation takes priority over reducing repository size.

## Phase 1: Establish scope and baseline

1. Inventory all tracked files and classify them as public HTML entry pages, protected or special-purpose pages, shared JavaScript and CSS, Sass source, vendor dependencies, PHP endpoints and libraries, content assets, demo content, or repository artifacts.
2. Treat every HTML and HTM file as a potentially valid direct-entry page, even when nothing links to it.
3. Flag `honeywellencrypted.html`, `password_template.html`, `ajaxserver/`, `demopage/`, directory index pages, and font specimen pages for manual review.
4. Determine whether Sass or compiled CSS is authoritative by inspecting history, attempting a non-destructive compilation when tooling exists, and comparing generated output with committed CSS. If the workflow cannot be reproduced, treat compiled CSS as authoritative and avoid speculative Sass cleanup.
5. Establish a baseline for every page using desktop, tablet, and mobile screenshots, browser-console output, failed network requests, and loaded local resources.

## Phase 2: Build a repository reference graph

6. Extract and resolve HTML links and assets, inline styles, CSS URLs and imports, Sass imports, JavaScript selectors and paths, and PHP includes, redirects, and file paths.
7. Resolve references relative to their containing file and verify exact filename casing.
8. Catalog dynamic selectors and paths, plugin-generated classes, hash navigation, server-side requests, direct URLs, and protected navigation separately.
9. Validate all internal links and hash targets without modifying them.
10. Check external links separately. Temporary external failures must be reported but must not trigger removal.

## Phase 3: Create the dead-code catalog

11. Record each candidate's location, type, static references, runtime use, possible direct-entry or external use, side effects, confidence, risk, proposed action, and verification method.
12. Classify candidates as:
    - **Confirmed dead:** safe to remove using static and runtime evidence.
    - **Redundant but behavior-affecting:** removable only after equivalent behavior is supplied.
    - **Uncertain:** requires manual or external-use confirmation.
    - **Retained dependency:** currently unused but preserved by requirement.
    - **Intentionally retained:** archival, demo, fallback, protected, or directly addressable content.
13. Require stronger evidence before deleting a complete file than before deleting an individual variable, comment, or branch.
14. Never classify a file as dead solely because no internal page links to it.

## Phase 4: Low-risk cleanup

15. Start with confirmed-dead comments, empty JavaScript handlers, unused local variables, unreachable application branches, and empty elements proven not to affect layout.
16. Remove tracked `.DS_Store` files and add an ignore rule if appropriate.
17. Remove the abandoned project-loading implementation in `main.js` only after confirming no page or inline script consumes its functions or global data and that the fixed tab-panel implementation is the only active path.
18. Preserve all vendor code, packages, and dependency files.

## Phase 5: Main-page placeholder cleanup

19. Treat the invisible Drone cards as behavior-affecting layout code rather than immediately dead code.
20. Measure section height, card positions, row wrapping, FullPage scroll behavior, footer position, and responsive whitespace before changing them.
21. Replace their layout contribution with the smallest equivalent CSS or grid structure.
22. Remove the invisible cards one category at a time, comparing screenshots, element positions, section scrolling, category switching, and duplicate IDs after each change.
23. Retain the original markup if visual and scrolling equivalence cannot be demonstrated.

## Phase 6: Shared JavaScript cleanup

24. Analyze each shared feature across every entry page: countdown, Swiper, Vegas, video/Maximage, forms, FullPage, scroll overflow, menu handling, project hover behavior, tabs, and the page loader.
25. Remove an initializer only when no page uses or dynamically creates its markup, it has no global side effects, runtime coverage shows no meaningful execution, and all pages remain equivalent without it.
26. Keep FullPage and scroll-overflow behavior intact because project detail pages actively use scrollable sections.
27. Do not replace, rebuild, trim, reorder, or upgrade `js/vendor/all.js` or other vendor dependencies during this cleanup.

## Phase 7: Page-import cleanup

28. Evaluate imports per page rather than globally.
29. Remove a script or stylesheet reference only when its feature is absent from that page, it is not required indirectly, no console errors appear, the runtime DOM remains equivalent, and desktop and mobile comparisons pass.
30. Keep the underlying dependency files in the repository even when a page-specific import is removed.
31. Preserve the current order of remaining scripts and stylesheets.
32. Retain Modernizr until testing proves nothing relies on its generated classes and supported-browser behavior remains unchanged.
33. Confirm requested font families, weights, and browser-specific formats through runtime network activity before removing any font import.

## Phase 8: CSS and Sass cleanup

34. Limit the first pass to selectors directly associated with application markup or behavior already removed.
35. Do not rely on static matching alone for Bootstrap, FullPage, scroll overflow, animations, responsive helpers, pseudo-classes, plugin-generated DOM, or JavaScript-added classes.
36. For each deletion, verify there is no HTML, JavaScript, Sass, or runtime-generated match and test all supported responsive and interaction states.
37. If Sass is authoritative, make matching Sass changes and regenerate CSS reproducibly.
38. If Sass ownership remains unclear, document suspected dead Sass rather than removing it.
39. Do not run a broad automated CSS purge against production stylesheets.

### Mandatory runtime validation for earlier-phase cleanup

Before changing any candidate identified in Phases 3–8:

- Capture a before-state on every affected page at desktop and mobile sizes, including console output, failed requests, loaded local resources, key element positions, section heights, and visible content.
- Exercise direct page and hash entry, refresh, Back/Forward navigation, both menus, FullPage keyboard/wheel/touch navigation, normal project-page scrolling, category tabs, hover overlays, forms, resume/email/social/blog links, and home/back links as applicable.
- For hidden or placeholder markup, compare grid wrapping, card positions, section height, FullPage behavior, focusability, pointer behavior, and responsive whitespace before and after.
- For JavaScript changes, verify initializer execution, generated DOM, global state, event handlers, plugin callbacks, and error-free behavior on every page that loads the shared script.
- For import changes, compare network requests, console output, computed styles, loaded fonts, plugin behavior, and page-specific interactions while preserving remaining import order.
- For CSS/Sass changes, verify static and runtime-generated selectors, pseudo-classes, animation states, responsive breakpoints, plugin DOM, and computed-style equivalence; regenerate CSS only through a reproducible workflow.
- For duplicate IDs, links, and hash targets, confirm intended navigation destination, DOM lookup behavior, keyboard focus, and browser history semantics.
- Record the before/after evidence and explicit pass/fail result in the cleanup log before staging each deletion or behavior-affecting edit.

### Final orphaned-asset review step

Before deleting any asset identified as orphaned:

- Review its complete path, file type, dimensions/metadata, Git history, and neighboring project assets.
- Search all source forms, including generated JavaScript strings, CSS/Sass URLs, PHP/server-side paths, metadata, demo pages, protected pages, and deployment configuration.
- Check direct URL access and representative deployed pages for successful loads, visual use, social previews, embeds, and downloadable content.
- Confirm ownership and intended retention with the site owner or documented project source; absence of internal references is not sufficient.
- Record the evidence, reviewer decision, and rollback path in `ORPHAN_ASSET_REPORT.md` and `CLEANUP_LOG.md`.
- Delete only individually approved assets, then rerun the full runtime and link-validation suite before committing.

### Final direct-entry review step

Before removing any page or resource with no inbound repository link:

- Enumerate its canonical and case-sensitive URL, including nested paths and extension variants.
- Request the URL directly in a representative local or staging deployment and record status, redirects, console output, network activity, and rendered content.
- Check bookmarks/shared links, sitemap or hosting configuration, protected flows, specimen/demo navigation, social metadata, downloads, and external references where available.
- Confirm with the site owner whether the resource is intentionally addressable, archival, protected, or externally consumed.
- Preserve the resource when direct-use evidence or ownership is unresolved; document the decision and revalidation date.

## Phase 9: Assets and server-side code

40. Generate separate reports for unreferenced media, font files, demo assets, unlinked pages, PHP endpoints, Mailchimp libraries, and vendor files.
41. Do not delete these automatically.
42. Require manual confirmation before deleting complete pages, protected content, PHP endpoints, demo pages, fonts, media, or vendor libraries.
43. Preserve resources that may be externally linked or directly accessed even when absent from the internal reference graph.

### Mandatory runtime validation for Phase 9 candidates

Before removing any media, font, page, PHP endpoint, demo/protected resource, or vendor file:

- Load every affected page at desktop and mobile viewport sizes and record successful and failed network requests.
- Exercise direct URLs, hash entries, refresh, Back/Forward navigation, visible project links, embeds, forms, and protected flows where applicable.
- Confirm computed styles, rendered images/backgrounds, loaded font families/weights, console output, and interactive behavior before and after the proposed change.
- For PHP and MailChimp code, inspect form actions and server-side includes, then run an appropriate local or staging request test without exposing credentials.
- For externally linked or directly addressable resources, obtain ownership/use confirmation; a missing internal reference or transient network failure is never sufficient evidence for deletion.
- Record the runtime evidence and verification result in the asset/orphan report and cleanup log before staging a deletion.

## Phase 10: Incremental validation

44. Divide implementation into independently reviewable changes: catalog and tooling, repository artifacts, low-risk HTML, application JavaScript, placeholder replacement, per-page imports, confirmed application CSS, and separately approved assets or server code.
45. After every group, run HTML validation, duplicate-ID checks, internal-link and hash checks, exact-case path checks, missing-asset checks, console checks, network comparisons, visual comparisons, and keyboard and pointer interaction tests.
46. Test direct page and hash entry, refresh, Back and Forward, both menus, FullPage keyboard and wheel navigation, touch scrolling, project category switching, and long project sections.
47. Test all visible project cards, hover overlays, resume links, email links, social links, blog links, and home/back links.

## Phase 11: Deployment verification

48. Deploy the cleanup branch to a preview environment matching GitHub Pages.
49. Verify custom-domain routing, HTTPS, case-sensitive paths, nested relative paths, caching, protected-page flows, project pages, hash navigation, mobile scrolling, and external destinations.
50. Compare the preview against the production baseline before merging.
51. Do not merge when unexplained layout, navigation, scrolling, loaded-content, console, request, or link differences remain.

### Final runtime-validation gate for Phases 3–8

Before closing any Phase 3–8 cleanup group, perform and record a dedicated validation step covering:

- Console errors and warnings on every affected page.
- DOM geometry, including section heights, card positions, wrapping, and scroll containers.
- Computed-style comparisons for affected elements and responsive breakpoints.
- Desktop, tablet, and mobile layout checks, including whitespace and overflow.
- Keyboard, pointer, touch, menu, tab, hover, hash-navigation, FullPage, form, and Back/Forward interactions as applicable.
- A before/after pass/fail result in `CLEANUP_LOG.md`; unresolved differences block deletion or merge.

## Final deliverables

- Repository inventory
- Reference graph
- Dead-code catalog
- Orphan-asset report
- External-link report
- List of retained dependencies
- List of unresolved candidates requiring human confirmation
- Before-and-after visual and runtime comparison
- Small, reversible commits for each cleanup category

## Guardrails

- Preserve behavior over maximizing deletion.
- Keep dependency and vendor files intact.
- Do not upgrade or rebuild dependencies.
- Do not remove direct-entry resources based solely on missing internal links.
- Do not combine accessibility redesign, content changes, or visual redesign with dead-code cleanup.
- Every deletion must have cataloged evidence and an explicit verification result.

## Remaining work before merge

1. Obtain preview deployment permission or a deployed preview URL for this branch.
2. Confirm the production URL and approval to inspect it; preserve a production baseline for comparison.
3. Run the full Phase 10/11 matrix on preview and production: desktop/tablet/mobile layouts, console output, network requests, DOM geometry, computed styles, keyboard/pointer/touch interactions, menus, tabs, FullPage and normal scrolling, forms, hashes, Back/Forward, and direct-entry pages.
4. Resolve or explicitly accept the remaining known issues: duplicate Drone IDs/placeholders, duplicate `summary` IDs, the Open Sans specimen dependency, and unavailable browser geometry/console checks.
5. Obtain owner decisions for the 32 orphaned asset candidates, unlinked direct-entry pages, protected/demo resources, and MailChimp endpoint/library.
6. If any asset/page/endpoint is approved for deletion or relocation, perform an item-level change with rollback evidence and rerun all affected runtime, link, asset, and server-side checks.
7. Update `DEFECTS.md`, `ORPHAN_ASSET_REPORT.md`, and `CLEANUP_LOG.md` with final pass/fail outcomes and reviewer decisions.
8. Review the complete commit series, verify no dependency/package/vendor changes were introduced, and merge only when no unexplained production differences remain.

## Final end-of-plan review gates

The orphaned-asset review and direct-entry review are final gates and must be completed after implementation and deployment verification, immediately before merge:

### Orphaned assets

- Review path, metadata, history, neighboring assets, generated/server-side references, direct URLs, deployed rendering, and ownership.
- Preserve any asset with unresolved direct use or ownership; record evidence and rollback before individually approved deletion.

### Direct-entry resources

- Enumerate canonical case-sensitive URLs and request each directly in staging.
- Check redirects, console/network/render results, protected/demo/specimen flows, hosting configuration, downloads, and external references.
- Require owner confirmation and a recorded pass/fail decision; unresolved direct use blocks removal and merge.

### MailChimp library review step

- Trace every include, namespace, constructor, method call, form action, and configuration reference to `ajaxserver/mailchimp/` and `ajaxserver/servermailchimp.php`.
- Verify whether any deployed or staging form invokes the MailChimp endpoint, using credential-safe request tests and server logs where available.
- If no active use is proven, obtain owner confirmation before removing the library or endpoint; preserve a rollback copy and document the evidence.
- After any approved removal, rerun form, page-load, console, network, and server-side regression checks before committing.
