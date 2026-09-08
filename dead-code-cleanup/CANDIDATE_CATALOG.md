# Phase 3 Dead-Code Candidate Catalog

Catalog created 2026-09-07 from the Phase 1 baseline and Phase 2 reference graph. No candidate is approved for deletion by this document.

| ID | Candidate | Evidence | Risk / side effects | Confidence | Proposed action |
|---|---|---|---|---|---|
| C-001 | Repeated hidden Drone cards in `index.html` | 11 repeated `drone`, `droneimage`, and `dronetext` IDs; five empty links; cards are visually hidden | May contribute to grid height, FullPage section sizing, responsive wrapping, or JS selectors | Medium | Measure layout and runtime behavior before replacing markup |
| C-002 | Abandoned dynamic project loader in `js/main.js` | Large `htmlString` project-card blocks and project-loading logic; static homepage already contains project cards | Could be consumed by filters, globals, or future direct interactions | Medium | Trace all callers and runtime execution before removal |
| C-003 | Homepage-only tab initializer on project pages | `l1/l2/l3/l5` access causes the documented project-page exception | Changing initialization can affect shared ready-handler ordering | High | Guard or isolate only after regression coverage |
| C-004 | Inherited `gallery.html`/`item.html`/`demo.html` navigation | 13 occurrences each; targets absent | Removing links changes navigation chrome; direct URLs may be expected | High | Confirm intent and direct-entry requirements |
| C-005 | Missing inherited sample images | `img/items/img-portrait.jpg` and `img-sample7.jpg` references | Visible broken images or template behavior | High | Inspect affected pages; restore or remove references deliberately |
| C-006 | `css/main.css` reference to missing `bg-default.jpg` | Active stylesheet and page metadata reference absent asset | Background appearance and social previews may change | Medium | Confirm rule usage and intended asset |
| C-007 | Open Sans specimen-page dependencies | Specimen page references two absent files | Directly visited specimen page may be incomplete | Low | Retain unless specimen content is explicitly retired |
| C-008 | Duplicate `summary` IDs | Duplicates in `flow.html`, `infoviz.html`, `wheelchair.html` | Hash navigation and DOM lookup ambiguity | High | Identify intended target, then rename/remove duplicate |
| C-009 | Sass files not demonstrably build-authoritative | Compiled CSS is active; no reproducible build config found | Removing Sass can break future maintenance or regeneration | Low | Preserve until authority and compilation are established |
| C-010 | Legacy/demo/protected pages and assets | `honeywellencrypted.html`, `password_template.html`, `ajaxserver/`, `demopage/`, specimen pages | Direct URLs, server endpoints, or archival use may be outside internal graph | Low | Manual review; never delete solely due to no inbound links |
| C-011 | Vendor and plugin code with low static reachability | `js/vendor/` contains bundled plugins and generated strings | Plugin-generated DOM/classes and side effects are hard to detect statically | Low | Preserve; evaluate only with runtime evidence |

## Classification status

| Class | Candidates | Decision basis |
|---|---|---|
| Confirmed dead | None | Static evidence is insufficient to prove safe removal. |
| Redundant but behavior-affecting | C-001, C-003, C-008 | These contain duplication or defective shared behavior, but changes can affect layout, navigation, or initialization order. |
| Uncertain | C-002, C-004, C-005, C-006, C-007 | Dynamic callers, direct URLs, visible rendering, metadata, or template ownership still need verification. |
| Retained dependency | C-009, C-011 | Sass sources and vendor/plugin bundles remain part of the maintainable dependency surface even where static reachability is low. |
| Intentionally retained pending review | C-010 | Protected, demo, archival, and server-side content may be directly addressable or externally consumed. |

Classification does not authorize deletion. The next phase must begin with the lowest-risk candidates and preserve a before/after runtime baseline for every change.
