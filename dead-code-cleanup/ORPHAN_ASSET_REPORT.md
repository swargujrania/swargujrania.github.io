# Phase 9 Asset and Server-Side Review

Static inventory completed 2026-09-07. This is a review queue, not an automatic deletion list.

## Inventory

- `img/`: 208 tracked files, including project images, backgrounds, and inherited/demo media.
- Fonts: Open Sans, Bebas, Font Awesome, Ionicons, and Major Mono Display families, plus specimen pages and specimen assets.
- Server-side code: `ajaxserver/server.php`, `serverfile.php`, `servermailchimp.php`, and bundled MailChimp PHP classes.
- Direct/demo/protected surfaces: `vid/index.htm`, `demopage/`, `password_template.html`, `honeywellencrypted.html`, and directory index pages.
- Vendor libraries: `js/vendor/` and plugin-specific Vegas/Swiper resources.

## Handling decisions

- No asset, font, page, PHP endpoint, MailChimp library, demo file, protected page, or vendor file is classified as safe to delete from static reachability alone.
- Missing internal references may reflect direct URLs, external links, server-side requests, specimen navigation, or archival content.
- Candidate assets require manual ownership/use confirmation and, where applicable, deployment and endpoint checks.

## Follow-up checks

1. Produce an exact media/font reference map, including CSS URLs and runtime-generated paths.
2. Inspect PHP includes, form actions, request parameters, and server configuration.
3. Validate direct-entry and protected/demo URLs in a representative deployment.
4. Obtain explicit approval before deleting any complete asset group or server-side file.

## Static media/font reference summary

The basename/path scan found 266 files under `img/` and `fonts/`: 234 with a textual reference and 32 unreferenced candidates. This is intentionally a candidate list only; basename matching can over-count shared names, while CSS, generated markup, direct URLs, social metadata, and external links can be missed. The 32 candidates therefore require manual and runtime confirmation before any deletion.

## Runtime validation status — 2026-09-08

- All 15 top-level HTML pages returned HTTP 200.
- No Phase 9 media, font, PHP, protected, demo, or vendor candidate achieved sufficient runtime evidence for safe deletion.
- The unreferenced candidate set remains a manual-review queue pending direct-entry and ownership checks.

### Direct-entry runtime sample — 2026-09-08

- `honeywell.html`, `password_template.html`, both font specimen demos, and four representative orphaned resources all returned HTTP 200 locally with no redirects.
- Local availability confirms these resources are addressable; it does not establish owner intent or production usage.
- No relocation or deletion is approved from this check.

### Ownership evidence

- Git history attributes the sampled assets and direct-entry pages to the repository owner, Swar Gujrania, across project-specific and initial-import commits.
- This establishes provenance, not current retention intent. Owner confirmation is still required before deletion or relocation.

### Server-side reference review

- `js/main.js` actively configures `./ajaxserver/serverfile.php` for newsletter and message forms.
- `ajaxserver/servermailchimp.php` includes the MailChimp library and posts subscriber data; bundled MailChimp classes are dependency code.
- Protected pages use client-side password forms and remain direct-entry resources.
- No PHP endpoint or bundled server-side library is safe to remove without a staging request test and credential-safe configuration review.

### MailChimp trace result

- `servermailchimp.php` has no repository caller beyond its own include of `mailchimp/MailChimp.php`.
- `MailChimp.php`, `Batch.php`, and `Webhook.php` are internally related dependency classes for that endpoint.
- Classification: **uncertain/directly addressable**. External clients, deployment hooks, or historical integrations could still invoke the endpoint.

### Deployment configuration check

- Repository metadata contains only `CNAME`; no workflow, sitemap, robots file, or deployment configuration references the reviewed pages, assets, or MailChimp endpoint.
- This absence does not rule out hosting-provider settings or external bookmarks/clients, so direct-entry and owner confirmation remain required.

## Unreferenced candidates for manual review

### Media

`img/Honeywell/honeywell12.jpg`, `img/Honeywell/honeywell11 copy.jpg`, `img/Honeywell/h0_1.jpg`, `img/infoViz/iv4.jpg`, `img/infoViz/iv0.jpg`, `img/parqr/Artboard Copy 7.jpg`, `img/parqr/feature3.jpg`, `img/parqr/feature5 copy.jpg`, `img/parqr/feature6.jpg`, `img/threads.png`, `img/Emoi/e9.png`, `img/title3C.png`, `img/about/process-about.png`, `img/hyperloop/h4.png`, `img/hyperloop/h6.png`, `img/hyperloop/Artboard.jpg`, `img/WheelchairAnalysis/Group 5.png`, `img/WheelchairAnalysis/w5.png`, `img/title3A.png`, `img/drone/Group.png`, `img/drone/Group 8.png`, `img/HashtagGuru/h2.png`, `img/title3.png`, `img/ResearchRepo/r2.png`, `img/ResearchRepo/r3.png`, `img/ResearchRepo/Bitmap.png`

### Fonts/specimen resources

`fonts/FontAwesome.otf`, `fonts/majorMonoDisplay/generator_config.txt`, `fonts/majorMonoDisplay/majormonodisplay-regular-demo.html`, `fonts/font-awesome.css`, `fonts/ionicons.css`, `fonts/opensans/opensans-regular-demo.html`

## Direct-entry and ownership checks — initial pass

- Pages with no inbound HTML links include the two font specimen demos, `honeywell.html`, and `password_template.html`; absence of inbound links does not establish that they are removable.
- Sample Git history confirms several candidates were intentionally added with their associated project work, so age alone is not removal evidence.
- Ownership is unresolved for all candidates; no external-use confirmation or deployment analytics are available in the repository.
- Decision: preserve every listed asset and direct-entry page pending owner confirmation and representative deployment checks.
