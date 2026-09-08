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

## Phase 9: Assets and server-side code

40. Generate separate reports for unreferenced media, font files, demo assets, unlinked pages, PHP endpoints, Mailchimp libraries, and vendor files.
41. Do not delete these automatically.
42. Require manual confirmation before deleting complete pages, protected content, PHP endpoints, demo pages, fonts, media, or vendor libraries.
43. Preserve resources that may be externally linked or directly accessed even when absent from the internal reference graph.

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
