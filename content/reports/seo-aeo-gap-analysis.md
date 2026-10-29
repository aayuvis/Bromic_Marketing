---
id: R-SEO-AEO
type: report
title: "SEO + AEO gap analysis: the strategy against the Hub, page by page"
slug: seo-aeo-gap-analysis-2026
audience: [RES, ARC, BLD, COM]
stage: [AW, CO, IN, PP, BY]
cell: RES-CO
asset: A24
summary: "The SEO + AEO Strategy read against what the Hub holds and what bromic.com shows today. One live URL owns each search family; 25 of the 32 web drafts go onto existing URLs; seven pages are upgraded first. Ownership lives in data/page-ownership.json."
owner_review: Brian Kim
status: in-review
gated: false
updated: 2026-10-29
sources:
  - id: s1
    publisher: "Bromic Heating (internal)"
    title: "SEO + AEO Strategy"
    year: 2026
    url: "internal: Bromic_SEO__AEO_Strategy.docx"
    supports: "Every search figure in this report: impressions, clicks, GA4 and Semrush changes, GSC indexing counts, priorities P1–P5, the page-ownership table, the AEO template and the measurement layers"
    verified: true
---

## The short version

- **The loss is breadth, not trust.** GSC impressions fell 24.4% and GA4 Google organic 41.7% year on year, while clicks fell 10.0%; the homepage lost 65% of its impressions, /outdoor-heaters/ 47%, the Tungsten Electric PDP 46% and the Platinum Electric PDP 54%[^s1]. The Hub has written no category or PDP copy, so none of its drafts yet touches the four pages that lost most.
- **Most drafts should not get new URLs.** Of the 32 web drafts (20 articles, 12 knowledge-base answers), 11 upgrade a live post, 14 merge into a live page as a section or FAQ, and 7 publish new (six articles, plus one KB answer that sits inside one of them). Published on their own slugs, 18 of them would compete with a live URL. Every call is in `data/page-ownership.json`.
- **Ownership is unclear in five places today**, before any draft ships: the Electric category against /electric-old/ and the legacy /outdoor-heaters/electric/; /compare-outdoor-heating-systems/, /integrated-outdoor-heating-solutions/ and /infrared-outdoor-heating/ (near-duplicates, and the first answers the gas-or-electric question in an H2); /controls/ against /smart-controls/; /access-bim-files/ against /revit-bim-files/; and /restaurants/ against the dining post that COM-AW-01 would rewrite.
- **No Hub article or KB answer meets the AEO template yet.** All 32 have a table and an answer-first opening, but none names a technical reviewer or a last-reviewed date on the page, only two carry a diagram placeholder, four open past 80 words and one opens with a disclaimer. None links to a single bromic.com URL: the knowledge → category → PDP → Design Request path does not exist in the drafts.
- **First 90 days:** clean migration residue and redirects (P1), lock the ownership map (P2), rebuild /outdoor-heaters/, Electric and Gas (P3), strengthen the Tungsten and Platinum Electric PDPs (P4), relink (P5), and upgrade seven authority pages on the AEO template, starting with the infrared-vs-radiant post. Nothing new goes live in the first 30 days.

## Strategy priority by priority

### P1: Stabilize URLs and recover migration equity (30 days)

| | |
|---|---|
| **What the strategy asks** | Pause URL, taxonomy, canonical and navigation changes; map high-value 2025 URLs to their 2026 owners (Keep / Replaced / Redirected / 404 / Merge); review the 94 404s and 269 redirects; one-hop 301s only to a close semantic replacement[^s1] |
| **What the Hub covers** | The blog audit's merge and redirect plan (12 target URLs); the site inventory's crawl of live pages, which surfaces /electric-old/, 10 dated /20xx/ link targets and 19 internal link targets that are not live pages (section below) |
| **The gap** | The GSC 404, redirect and crawled-not-indexed lists and the 2025 top-URL export are not in the repo, so the Keep/Replaced/Redirected/404/Merge map cannot be completed here. The crawl reads only live pages: the legacy /outdoor-heaters/electric/ is known only from the strategy. [[VERIFY: GSC export of 404s, redirects and 2025 top URLs — Brian Kim]] |
| **The action** | Brian Kim exports GSC and builds the URL map; 454 Creative ships the redirects: /outdoor-heaters/electric/ and /electric-old/ to /outdoor-heaters/outdoor-electric-heaters/ in one hop, the blog audit's 301s, and every dated permalink replaced in page bodies. The Hub publishes nothing on a new URL in these 30 days, and upgrades of existing URLs wait for the map. |
| **Owner, timing** | Brian Kim with 454 Creative · days 0–30 |

### P2: One clear page owner for each search intent (60 days)

| | |
|---|---|
| **What the strategy asks** | One primary destination per non-branded family: /outdoor-heaters/, the Electric category, the Gas category, an infrared education owner, the Tungsten Electric PDP; supporting articles link into the commercial owner instead of competing[^s1] |
| **What the Hub covers** | `data/page-ownership.json`: 40 families, each with a live owner URL, its supporting URLs and the Hub drafts that feed it; and a publish call for every Hub item |
| **The gap** | The strategy leaves the infrared owner unnamed. /infrared-outdoor-heating/ is the only page with the term in its title but is a near-duplicate of two other pages. Five overlaps exist on the live site today (see the short version). |
| **The action** | Confirm the map; set /infrared-outdoor-heating/ as the infrared owner and rewrite /compare-outdoor-heating-systems/ and /integrated-outdoor-heating-solutions/ so they stop answering its question, or consolidate them [[VERIFY: which URL held infrared heater impressions in 2025 — Brian Kim]]; canonicalise one of /access-bim-files/ and /revit-bim-files/; keep paid landing pages and /design-your-space-variant/ out of the index [[VERIFY: noindex status of paid landing pages and variants — Brian Kim]] |
| **Owner, timing** | Brian Kim · days 0–60 |

### P3: Rebuild category pages around how customers search (60 days)

| | |
|---|---|
| **What the strategy asks** | Category pages that say what the category is, who it is for, how to choose and which product fits each use; literal product language; selection guidance, installation types, use cases, comparison modules, FAQs, links to PDPs and Design Request; existing URLs[^s1] |
| **What the Hub covers** | Product facts with a `site` block per product (output, coverage, voltage, mounting heights, controls); RES-CO-01's electric-vs-gas decision table; BLD-CO-01's good-better-best tiers; KB answers that become category FAQs (ARC-CO-KB1 on mounting height) |
| **The gap** | No category copy exists in the Hub. The live categories show no specs; the Gas category names no BTU, coverage or gas type; Cobalt is missing from Electric; installation pages ask height and clearance questions and give no figures; no category names the controls a heater needs. |
| **The action** | The briefs below for /outdoor-heaters/, Electric and Gas; then the five installation pages and the application pages get the same module (selection table with controls, FAQs from the Hub's KB answers, links to PDPs and /design-your-space/) |
| **Owner, timing** | Brian Kim (copy), Mike Clifford (specs), 454 Creative (build) · days 30–60 |

### P4: Strengthen PDP relevance and usefulness (75 days)

| | |
|---|---|
| **What the strategy asks** | Classification (what it is, fuel, mounting, applications); performance (output, coverage, mounting height, clearances, controls, weather rating, accessories); professional resources (BIM/CAD, manuals, spec sheets, Design Request); keep the URL[^s1] |
| **What the Hub covers** | Site-read specs per model in `data/product-facts.json` (verified false until Mike Clifford signs off); BLD-IN-KB1 (breaker size for a 4500 W heater, a Platinum output); the /technical-resources/ download list in the inventory |
| **The gap** | On both electric PDPs, dimensions, heat blooms and clearances exist only as images; there are no BTU equivalents; the visible SKU reads N/A; the Platinum page links the Marine cut sheet as its English spec sheet; neither page says that app features need compatible Affinity controls. |
| **The action** | Tungsten Electric and Platinum Electric first (briefs below), then Eclipse, Cobalt, Platinum Electric Marine and the gas PDPs on the same template |
| **Owner, timing** | Mike Clifford (specs and resources), Brian Kim, 454 Creative · days 30–75 |

### P5: Rebuild internal linking and product discovery (90 days)

| | |
|---|---|
| **What the strategy asks** | Plain HTML links layer to layer: Outdoor Heaters → Electric/Gas, installation types, use cases → PDPs and comparison guidance; application pages → categories, PDPs, Design Request; education → the commercial owner[^s1] |
| **What the Hub covers** | Every Hub item now carries an `owner_link` (the commercial page it must link to) in the ownership file; the blog audit lists broken and dated links |
| **The gap** | No Hub draft links to a bromic.com URL; they link to each other (`item:`) and to gated assets. Only 5 of the 32 articles and KB answers point their CTA at Design Request. Live pages still link to 10 dated permalinks and to 19 URLs that are not live pages (retired wireless controllers, "portable" product URLs, /contact-us/). |
| **The action** | At publish, each draft gets its owner link in the first screen, a link to its family's category and PDP, and Design Request in the closing line; live pages get their dated and dead links replaced in the same 454 Creative pass as P1 |
| **Owner, timing** | Brian Kim and each item's reviewer · days 30–90 |

### AEO: build long-term heating authority

| | |
|---|---|
| **What the strategy asks** | Upgrade existing high-value pages first (10–15 over time, 5–7 in the first 90 days); a citation-ready template (40–80 word direct answer, clear H2s, comparison/decision table, original diagram, engineering-reviewed explanation, technical reviewer and last-reviewed date); one owner per question; proprietary value such as coverage/sizing and fuel-selection tools; a Heating Knowledge Center in months 3–6, not hundreds of thin FAQ pages[^s1] |
| **What the Hub covers** | 20 articles and 12 KB answers written answer-first with tables and FAQs; the A03 sizing, A20 cost and A21 ROI tools; Bromic engineering principles (wavelength, radiant share, mounting heights) in `data/product-facts.json` |
| **The gap** | No on-page reviewer or last-reviewed line on any draft, and the content schema has no field for a technical reviewer; 2 of 32 have a diagram placeholder; KB answers were written as standalone pages, which the strategy warns against; no baseline AEO measurement exists |
| **The action** | Add a technical reviewer and last-reviewed date to every upgraded page [[VERIFY: named engineering reviewer for AEO pages — Mike Clifford]]; ship KB answers as answer blocks and FAQs inside their owner pages (11 merges); build the seven authority upgrades below; group them under a Heating Knowledge Center in months 3–6 [[VERIFY: Knowledge Center URL, /blog/ or /faqs/ — Brian Kim]] |
| **Owner, timing** | Megan Spies (editorial), Mike Clifford (technical review), Brian Kim · authority pages days 30–90; Knowledge Center months 3–6 |

## Page-ownership map

One row per search family. Paths are on www.bromic.com; the full URL lists are in `data/page-ownership.json`.

| Search family | Owner (live URL) | Kind | Supporting URLs | Hub drafts |
|---|---|---|---|---|
| outdoor heater / outdoor heaters / patio heater | /outdoor-heaters/ | category | /outdoor-heaters/outdoor-electric-heaters/, /outdoor-heaters/outdoor-gas-heaters/, /outdoor-heaters/ceiling-mounted/ +7 | A03, RES-CO-01, RES-PP-01, A02-homeowner |
| Bromic (brand) / homepage | / | home | /about-bromic/, /outdoor-heaters/, /products/ | — |
| electric outdoor heater | /outdoor-heaters/outdoor-electric-heaters/ | category | /product/tungsten-smart-heat-electric/, /product/platinum-smart-heat-electric/, /product/eclipse-smart-heat-electric/ +5 | RES-CO-01, RES-CO-KB1, BLD-IN-KB1, BLD-IN-KB2, ARC-PP-01, A12, RES-IN-01 |
| gas outdoor heater / propane patio heater | /outdoor-heaters/outdoor-gas-heaters/ | category | /product/platinum-smart-heat-gas/, /product/tungsten-smart-heat-gas/, /product/tungsten-smart-heat-freestanding/ +2 | COM-CO-01, COM-CO-KB1, COM-PP-KB1 |
| infrared heater / infrared outdoor heating | /infrared-outdoor-heating/ | education | /blog/do-infrared-heaters-work-outdoors/, /blog/are-infrared-heaters-efficient/, /blog/what-is-the-difference-between-an-infrared-heater-and-a-radiant-heater/ +2 | ARC-CO-01, RES-CO-KB1 |
| infrared vs radiant heater | /blog/what-is-the-difference-between-an-infrared-heater-and-a-radiant-heater/ | education | /blog/heating-people-not-places-the-fundamentals-of-heat-transfer/, /infrared-outdoor-heating/ | ARC-CO-01, RES-CO-KB1 |
| radiant heat transfer / short, medium and long wave | /blog/heating-people-not-places-the-fundamentals-of-heat-transfer/ | education | /blog/what-is-the-difference-between-an-infrared-heater-and-a-radiant-heater/, /infrared-outdoor-heating/ | ARC-CO-01 |
| electric vs gas patio heater / running cost | /blog/gas-or-electric-patio-heaters-which-one-is-right-for-me/ | education | /compare-outdoor-heating-systems/, /blog/how-to-select-the-right-fuel-source-for-your-space/ | RES-CO-01, RES-IN-01, COM-CO-KB1, COM-CO-01 |
| Tungsten electric heater | /product/tungsten-smart-heat-electric/ | pdp | /tungsten-collection/, /product/tungsten-electric-recess-kit/, /product/tungsten-electric-mounting-poles/ +3 | A11, ARC-IN-KB1, BLD-IN-KB2, ARC-IN-01 |
| Platinum electric heater | /product/platinum-smart-heat-electric/ | pdp | /platinum-collection/, /product/platinum-electric-low-clearance-recess-kit/, /product/platinum-electric-recess-kit/ +2 | BLD-IN-KB1, ARC-IN-KB1, A11 |
| Eclipse heater | /product/eclipse-smart-heat-electric/ | pdp | /eclipse-collection/, /product/eclipse-smart-heat-freestanding/, /product/affinity-smart-heat-eclipse-controllers/ +1 | RES-BY-01 |
| ceiling-mounted outdoor heater | /outdoor-heaters/ceiling-mounted/ | installation | /blog/top-5-considerations-for-installing-ceiling-mounted-outdoor-heaters/, /product/tungsten-smart-heat-electric/, /product/platinum-smart-heat-electric/ +1 | ARC-BY-KB1, BLD-PP-01 |
| wall-mounted outdoor heater / mounting height | /outdoor-heaters/wall-mounted/ | installation | /blog/how-should-i-mount-my-outdoor-electric-patio-heater/, /blog/is-wall-mounting-your-outdoor-heater-the-right-choice-for-you/, /product/platinum-electric-wall-mounting-bracket/ +1 | ARC-CO-KB1, BLD-BY-01, BLD-BY-KB1 |
| recessed / flush-mounted outdoor heater | /outdoor-heaters/flush-mounted/ | installation | /blog/what-should-be-considered-when-installing-recessed-electric-outdoor-heaters/, /blog/how-to-install-the-low-clearance-recess-kit/, /product/platinum-electric-low-clearance-recess-kit/ +2 | ARC-IN-KB1 |
| built-in outdoor heater | /outdoor-heaters/built-in/ | installation | /blog/how-to-prepare-your-patio-for-outdoor-heating/, /patio-to-living-space/, /outdoor-planning-where-to-start/ | BLD-IN-01, A16, BLD-IN-KB2 |
| freestanding / portable patio heater | /outdoor-heaters/freestanding/ | installation | /product/eclipse-smart-heat-freestanding/, /product/tungsten-smart-heat-freestanding/, /blog/freestanding-heaters-dont-need-to-be-clunky/ +1 | — |
| outdoor heater for home / residential patio heating | /residential/ | application | /patio-to-living-space/, /blog/do-outdoor-heaters-work-in-the-winter/, /blog/elevating-your-patio-space-to-give-the-feeling-of-a-5-star-resort/ | RES-AW-01, A02-homeowner, RES-PP-KB1, RES-CO-KB2 |
| restaurant patio heaters / outdoor dining heating | /restaurants/ | application | /restaurant-outdoor-heating-planning-guide/, /blog/how-outdoor-heating-can-increase-revenue-profits/, /blog/why-mushroom-heaters-are-bad-for-business/ +1 | COM-AW-01, COM-IN-01, COM-CO-01, COM-CO-KB1, COM-IN-KB1, COM-PP-01, COM-PP-KB1, A20, A21, A02-commercial |
| hotel and resort outdoor heating | /hotels/ | application | /blog/crafting-enduring-experiences-in-outdoor-hospitality/, /case-studies/ | — |
| marine and superyacht heaters | /super-yacht-cruise-ships/ | application | /product/platinum-smart-heat-electric-marine/, /blog/worlds-first-lloyds-register-approved-outdoor-heating-range-for-marine-applications/, /blog/stylish-resilient-coastal-outdoor-heaters/ | — |
| outdoor heating for builders | /builders/ | application | /builder-outdoor-heating-101/, /builders-outdoor-heating/, /builders-lp-a/ +1 | BLD-AW-01, BLD-CO-01, A15, BLD-PP-01 |
| outdoor heaters for architects / specification | /architects-designers/ | application | /technical-resources/, /access-bim-files/, /revit-bim-files/ +2 | ARC-IN-01, ARC-BY-01, A11, A02-pro, ARC-AW-01 |
| specify outdoor heaters early / how to specify | /blog/why-its-important-to-specify-outdoor-heating-early/ | education | /architects-designers/, /technical-resources/ | ARC-IN-01 |
| outdoor heater controls / smart patio heater | /controls/ | category | /smart-controls/, /affinity-smart-heat-app/, /product/affinity-smart-heat-on-off-controllers/ +3 | RES-BY-01, COM-BY-01 |
| patio heater app / Alexa / Google | /blog/how-to-use-the-new-bromic-heating-app/ | education | /controls/, /affinity-smart-heat-app/, /blog/are-there-remote-controls-for-bromic-patio-heaters/ | RES-BY-01 |
| patio heater clearance / covered patio | /blog/what-are-the-clearances-to-heat-my-covered-patio/ | education | /blog/can-you-put-a-patio-heater-under-a-gazebo/, /blog/top-5-considerations-for-installing-ceiling-mounted-outdoor-heaters/, /outdoor-heaters/wall-mounted/ +1 | RES-PP-01, RES-PP-KB1, ARC-BY-KB1 |
| install / mount an electric patio heater | /blog/how-should-i-mount-my-outdoor-electric-patio-heater/ | education | /outdoor-heaters/wall-mounted/, /blog/is-wall-mounting-your-outdoor-heater-the-right-choice-for-you/ | BLD-BY-01, BLD-BY-KB1, BLD-PP-01 |
| recessed heater installation detail | /blog/what-should-be-considered-when-installing-recessed-electric-outdoor-heaters/ | education | /outdoor-heaters/flush-mounted/, /blog/how-to-install-the-low-clearance-recess-kit/ | ARC-IN-KB1 |
| pre-wire patio for heaters | /blog/how-to-prepare-your-patio-for-outdoor-heating/ | education | /outdoor-heaters/built-in/, /builders/ | BLD-IN-01, BLD-IN-KB2, A16 |
| are infrared patio heaters safe | /blog/are-infrared-outdoor-heaters-safe/ | education | /blog/top-tips-for-outdoor-heaters-safety/, /blog/patio-heater-in-a-garage/ | RES-CO-KB2 |
| do infrared heaters work outdoors / in wind | /blog/do-infrared-heaters-work-outdoors/ | education | /infrared-outdoor-heating/, /blog/what-is-the-difference-between-an-infrared-heater-and-a-radiant-heater/ | RES-CO-KB1 |
| outdoor heaters in winter / year-round patio | /blog/do-outdoor-heaters-work-in-the-winter/ | education | /residential/, /patio-to-living-space/ | RES-AW-01 |
| restaurant outdoor dining in winter | /blog/outdoor-dining-is-it-here-to-stay-or-go/ | education | /restaurants/ | COM-AW-01 |
| restaurant patio heater ROI | /blog/how-outdoor-heating-can-increase-revenue-profits/ | education | /restaurants/, /restaurant-outdoor-heating-planning-guide/ | COM-IN-01, A21 |
| commercial patio heater fuel cost | /blog/why-mushroom-heaters-are-bad-for-business/ | education | /restaurants/, /blog/gas-or-electric-patio-heaters-which-one-is-right-for-me/ | COM-CO-01, A20 |
| patio heater maintenance | /blog/keeping-the-heat-on-essential-cleaning-and-maintenance-for-outdoor-heaters/ | education | /controls/, /warranty/ | COM-BY-01 |
| outdoor living trends and statistics | /outdoor-living-trends/ | education | /outdoor-design-trends/, /blog/outdoor-amenities-shaping-home-design-like-never-before/ | A01-stats, A01-corrections, ARC-AW-01, RES-AW-01 |
| outdoor design trends for architects | /blog/outdoor-amenities-shaping-home-design-like-never-before/ | education | /outdoor-design-trends/, /architects-designers/ | ARC-AW-01 |
| outdoor heating planning guide | /outdoor-heating-planning-guide/ | education | /design-guides/, /heating-planning-101/, /restaurant-outdoor-heating-planning-guide/ | A02-homeowner, A02-pro, A02-outline |
| free outdoor heating design plan | /design-your-space/ | tool | /design-your-space-variant/, /talk-to-sales/ | A03, CS-CANDIDATES, CS-TEMPLATE |

## How each Hub draft is published

**Upgrade** puts the draft on the existing URL as its new body. **Merge-into** adds it to a live page as a section, answer block or FAQ. **New** is a new URL, or an asset that is not a web page. Risk is what would happen if the draft went live on its own slug; **high** marks every draft that would cannibalise a live URL.

| Item | Type | Publish as | Target URL | Owner link | Risk if published on its own slug |
|---|---|---|---|---|---|
| ARC-AW-01 | article | upgrade | /blog/outdoor-amenities-shaping-home-design-like-never-before/ | /architects-designers/ | low: /outdoor-living-trends/ (statistics intent stays with A01-stats) |
| ARC-BY-01 | article | new | — | /technical-resources/ | none |
| ARC-CO-01 | article | upgrade | /blog/heating-people-not-places-the-fundamentals-of-heat-transfer/ | /outdoor-heaters/outdoor-electric-heaters/ | **high** if new: /blog/heating-people-not-places-the-fundamentals-of-heat-transfer/; low: /blog/what-is-the-difference-between-an-infrared-heater-and-a-radiant-heater/ |
| ARC-IN-01 | article | upgrade | /blog/why-its-important-to-specify-outdoor-heating-early/ | /architects-designers/ | **high** if new: /blog/why-its-important-to-specify-outdoor-heating-early/ |
| ARC-PP-01 | article | new | — | /outdoor-heaters/outdoor-electric-heaters/ | low: /sustainable-design-principles/ |
| BLD-AW-01 | article | new | — | /builders/ | low: /builders/ (do not target "builder outdoor heating") |
| BLD-BY-01 | article | merge-into | /blog/how-should-i-mount-my-outdoor-electric-patio-heater/ | /outdoor-heaters/wall-mounted/ | **high** if new: /blog/how-should-i-mount-my-outdoor-electric-patio-heater/ |
| BLD-CO-01 | article | merge-into | /builders/ | /outdoor-heaters/outdoor-electric-heaters/ | **high** if new: /builders/ |
| BLD-IN-01 | article | upgrade | /blog/how-to-prepare-your-patio-for-outdoor-heating/ | /outdoor-heaters/built-in/ | **high** if new: /blog/how-to-prepare-your-patio-for-outdoor-heating/ |
| BLD-PP-01 | article | new | — | /outdoor-heaters/outdoor-electric-heaters/ | low: /blog/how-should-i-mount-my-outdoor-electric-patio-heater/ and /blog/top-5-considerations-for-installing-ceiling-mounted-outdoor-heaters/ |
| COM-AW-01 | article | upgrade | /blog/outdoor-dining-is-it-here-to-stay-or-go/ | /restaurants/ | **high**: /restaurants/ owns "restaurant patio heating"; retarget the primary keyword to keeping outdoor dining open in winter |
| COM-BY-01 | article | merge-into | /blog/keeping-the-heat-on-essential-cleaning-and-maintenance-for-outdoor-heaters/ | /controls/ | **high** if new: /blog/keeping-the-heat-on-essential-cleaning-and-maintenance-for-outdoor-heaters/ |
| COM-CO-01 | article | upgrade | /blog/why-mushroom-heaters-are-bad-for-business/ | /restaurants/ | **high** if new: /blog/why-mushroom-heaters-are-bad-for-business/; low: /blog/gas-or-electric-patio-heaters-which-one-is-right-for-me/ (residential intent) |
| COM-IN-01 | article | upgrade | /blog/how-outdoor-heating-can-increase-revenue-profits/ | /restaurants/ | **high** if new: /blog/how-outdoor-heating-can-increase-revenue-profits/ |
| COM-PP-01 | article | new | — | /restaurants/ | low: /restaurant-outdoor-heating-planning-guide/ (gated guide lists regulations) |
| RES-AW-01 | article | upgrade | /blog/do-outdoor-heaters-work-in-the-winter/ | /residential/ | **high** if new: /blog/do-outdoor-heaters-work-in-the-winter/ |
| RES-BY-01 | article | upgrade | /blog/how-to-use-the-new-bromic-heating-app/ | /controls/ | **high** if new: /blog/how-to-use-the-new-bromic-heating-app/; low: /smart-controls/ |
| RES-CO-01 | article | upgrade | /blog/gas-or-electric-patio-heaters-which-one-is-right-for-me/ | /outdoor-heaters/ | **high** if new: /blog/gas-or-electric-patio-heaters-which-one-is-right-for-me/ and /compare-outdoor-heating-systems/ (same question); resolved by upgrading the post and pointing the compare page at it |
| RES-IN-01 | article | new | — | /outdoor-heaters/outdoor-electric-heaters/ | low: /blog/gas-or-electric-patio-heaters-which-one-is-right-for-me/ (keep its cost section short and link here) |
| RES-PP-01 | article | upgrade | /blog/what-are-the-clearances-to-heat-my-covered-patio/ | /outdoor-heaters/ | **high** if new: /blog/what-are-the-clearances-to-heat-my-covered-patio/; low: /outdoor-heaters/wall-mounted/ (lead with placement, link height questions to the installation page) |
| ARC-BY-KB1 | kb | merge-into | /blog/top-5-considerations-for-installing-ceiling-mounted-outdoor-heaters/ | /outdoor-heaters/ceiling-mounted/ | **high** if new: /blog/top-5-considerations-for-installing-ceiling-mounted-outdoor-heaters/ |
| ARC-CO-KB1 | kb | merge-into | /outdoor-heaters/wall-mounted/ | /product/tungsten-smart-heat-electric/ | **high** if new: /outdoor-heaters/wall-mounted/ |
| ARC-IN-KB1 | kb | merge-into | /blog/what-should-be-considered-when-installing-recessed-electric-outdoor-heaters/ | /outdoor-heaters/flush-mounted/ | **high** if new: /blog/what-should-be-considered-when-installing-recessed-electric-outdoor-heaters/ |
| BLD-BY-KB1 | kb | merge-into | /blog/how-should-i-mount-my-outdoor-electric-patio-heater/ | /outdoor-heaters/wall-mounted/ | low: /blog/how-should-i-mount-my-outdoor-electric-patio-heater/ |
| BLD-IN-KB1 | kb | merge-into | /product/platinum-smart-heat-electric/ | /product/platinum-smart-heat-electric/ | none |
| BLD-IN-KB2 | kb | merge-into | /blog/how-to-prepare-your-patio-for-outdoor-heating/ | /outdoor-heaters/built-in/ | low: /blog/how-to-prepare-your-patio-for-outdoor-heating/ |
| COM-CO-KB1 | kb | merge-into | /restaurants/ | /outdoor-heaters/outdoor-electric-heaters/ | low: /blog/why-mushroom-heaters-are-bad-for-business/ |
| COM-IN-KB1 | kb | merge-into | /restaurants/ | /design-your-space/ | low: /restaurants/ |
| COM-PP-KB1 | kb | new | — | /restaurants/ | none |
| RES-CO-KB1 | kb | merge-into | /blog/do-infrared-heaters-work-outdoors/ | /outdoor-heaters/outdoor-electric-heaters/ | low: /blog/do-infrared-heaters-work-outdoors/ |
| RES-CO-KB2 | kb | merge-into | /blog/are-infrared-outdoor-heaters-safe/ | /outdoor-heaters/ | **high** if new: /blog/are-infrared-outdoor-heaters-safe/ |
| RES-PP-KB1 | kb | merge-into | /blog/what-are-the-clearances-to-heat-my-covered-patio/ | /outdoor-heaters/ceiling-mounted/ | **high** if new: /blog/what-are-the-clearances-to-heat-my-covered-patio/ |
| A01-stats | stats-page | upgrade | /outdoor-living-trends/ | /design-your-space/ | low: /blog/outdoor-amenities-shaping-home-design-like-never-before/ |
| A02-commercial | gated-guide | upgrade | /restaurant-outdoor-heating-planning-guide/ | /restaurants/ | none |
| A02-homeowner | gated-guide | upgrade | /outdoor-heating-planning-guide/ | /design-your-space/ | none |
| A02-pro | gated-guide | upgrade | /outdoor-heating-planning-guide/ | /architects-designers/ | none |
| A12 | gated-guide | new | — | /outdoor-heaters/outdoor-electric-heaters/ | low: /sustainable-design-principles/ |
| A16 | gated-guide | new | — | /outdoor-heaters/built-in/ | none |
| A11 | spec-kit | new | — | /architects-designers/ | none |
| A15 | sales-kit | new | — | /builders/ | none |
| A03 | tool | new | — | /design-your-space/ | low: /design-your-space/ (the tool estimates, Design Request designs) |
| A20 | tool | new | — | /restaurants/ | none |
| A21 | tool | new | — | /restaurants/ | low: /blog/how-outdoor-heating-can-increase-revenue-profits/ (article explains, tool calculates) |
| A01-corrections | report | new | — | /outdoor-living-trends/ | none |
| A02-outline | report | new | — | /outdoor-heating-planning-guide/ | none |
| R-BLOG-AUDIT | report | new | — | /outdoor-heaters/ | none |
| R-SEO-AEO | report | new | — | /outdoor-heaters/ | none |
| CS-CANDIDATES | case-study | new | — | /case-studies/ | none |
| CS-TEMPLATE | case-study | new | — | /case-studies/ | none |

**Count:** of the 32 web drafts, 11 upgrade, 14 merge and 7 publish new (RES-IN-01, ARC-BY-01, ARC-PP-01, BLD-AW-01, BLD-PP-01, COM-PP-01, and COM-PP-KB1 inside COM-PP-01). Four more items upgrade existing landing pages (three Planning Guide editions and the A01 stats page). Three tools publish new. The rest are gated assets, templates or internal reports, not web pages.

**Still at risk after the plan:** COM-AW-01 against /restaurants/ (retarget its keyword away from "restaurant patio heating"); RES-CO-01 until /compare-outdoor-heating-systems/ drops its gas-or-electric H2; RES-PP-01 against /outdoor-heaters/wall-mounted/ on mounting height (lead with placement, link the height question to the installation page).

## The first seven authority pages to upgrade

The strategy gives search figures for five of these; the other two are owners it names (gas, and the electric-vs-gas question) without a figure.

| # | Live URL | Why (strategy figures only) | Hub draft that feeds it | What the AEO template adds |
|---|---|---|---|---|
| 1 | [/blog/what-is-the-difference-between-an-infrared-heater-and-a-radiant-heater/](https://www.bromic.com/blog/what-is-the-difference-between-an-infrared-heater-and-a-radiant-heater/) | About 103K impressions (Jun–Aug 2025) to 39K (2026); the strategy's own worked example[^s1] | ARC-CO-01 (radiant share by wavelength), RES-CO-KB1 (wind) | A 40–80 word definition of both terms first; a comparison table; an original heat-transfer diagram; Bromic engineering commentary; links to wind, convection and electric-vs-gas, then /outdoor-heaters/, both categories, PDPs and Design Request; reviewer and date. Cut or source the sunburn claim and add the missing closing CTA |
| 2 | [/outdoor-heaters/](https://www.bromic.com/outdoor-heaters/) | 234.9K to 124.5K impressions (−47%); owner of "outdoor heater(s)"[^s1] | RES-CO-01 (decision table), A03 (sizing), RES-PP-01 (placement) | Direct answer on how to choose; a selection table by fuel, mounting and use with the controls for each; FAQs; the brief below |
| 3 | [/outdoor-heaters/outdoor-electric-heaters/](https://www.bromic.com/outdoor-heaters/outdoor-electric-heaters/) | The legacy Electric URL had 139.7K impressions in 2025; the current page 63.0K in 2026[^s1] | RES-CO-01, RES-CO-KB1, BLD-IN-KB1, BLD-IN-KB2, RES-IN-01, ARC-PP-01 | Direct answer; model comparison table; electrical FAQs (voltage, breaker, circuits); a diagram of wall, ceiling and recessed mounting heights; brief below |
| 4 | [/product/tungsten-smart-heat-electric/](https://www.bromic.com/product/tungsten-smart-heat-electric/) | 110.2K to 60.1K impressions (−46%)[^s1] | A11 (spec kit), ARC-IN-KB1, BLD-IN-KB2 | Classification sentence first; specs as text, not images; controls; BIM and spec resources; brief below |
| 5 | [/product/platinum-smart-heat-electric/](https://www.bromic.com/product/platinum-smart-heat-electric/) | 76.7K to 35.2K impressions (−54%)[^s1] | BLD-IN-KB1, ARC-IN-KB1, A11 | As above, plus the correct spec sheet and the Classic/Marine distinction |
| 6 | [/blog/gas-or-electric-patio-heaters-which-one-is-right-for-me/](https://www.bromic.com/blog/gas-or-electric-patio-heaters-which-one-is-right-for-me/) | Electric-vs-gas is one of the related questions the strategy names for the infrared topic path; no figure given [[VERIFY: 2025 vs 2026 impressions — Brian Kim]] | RES-CO-01 (new body), COM-CO-KB1 | Already answer-first with a decision table; add reviewer and date, a diagram, links to both categories; the fuel-source post 301s in |
| 7 | [/outdoor-heaters/outdoor-gas-heaters/](https://www.bromic.com/outdoor-heaters/outdoor-gas-heaters/) | Strategy owner for "gas outdoor heater"; no figure given [[VERIFY: 2025 vs 2026 impressions — Brian Kim]] | COM-CO-01, COM-CO-KB1, COM-PP-KB1 | Direct answer; BTU, coverage and fuel table; gas-fitter and local-authority line; brief below |

The homepage lost the most (255.9K to 89.3K, −65%)[^s1] but is an SEO fix, not an AEO page: it should carry literal category language and link /outdoor-heaters/, Electric and Gas with plain HTML links. [[VERIFY: homepage title and H1 direction — Brian Kim]]

## Category and PDP briefs

Specs below come from the `site` blocks of `data/product-facts.json`, read from bromic.com on 29 Oct 2026 and not yet signed off [[VERIFY: every site-read value against the 2026 cut sheets — Mike Clifford]]. Every heater row names its controls. Wi-Fi and app features need compatible Affinity Smart-Heat controls, sold separately. Titles and H1s are examples to validate against query ownership and current results pages, as the strategy says of its own example.

### /outdoor-heaters/ (broad category)

**Classification.** Bromic's full range of infrared outdoor heaters: electric and gas, built-in and freestanding, for homes, restaurants, hotels and vessels.

**Specs to add: a selection module, one row per collection.**

| Collection | Fuel | Output | Coverage (approx.) | Mounting | Controls |
|---|---|---|---|---|---|
| Tungsten Smart-Heat Electric | Electric | 2000–6000 W | 65–160 ft² | Wall, ceiling, pole, recessed | Affinity On/Off or Dimmer controller, manual wall switch |
| Platinum Smart-Heat Electric | Electric | 2300–4500 W | 65–143 ft² | Wall, pole, recessed | Affinity On/Off or Dimmer controller, manual wall switch (sold separately) |
| Eclipse Smart-Heat Electric | Electric | 2900 W | 121 ft² | Pole (twin standard; straight, curved, wall-mount poles) | Affinity Eclipse controller (enables the app) or Eclipse Dimmer Controller with remote; manual wall switch |
| Cobalt Smart-Heat Electric | Electric | 4000 / 6000 W | 130 / 160 ft² | [[VERIFY: Cobalt mounting options — Mike Clifford]] | Affinity On/Off or Dimmer controller, manual wall switch |
| Platinum Smart-Heat Gas | LPG or natural gas | 23,600 / 39,800 BTU | 160 / 215 ft² | Wall or ceiling | Affinity On/Off controller, manual wall switch (on/off only) |
| Tungsten Smart-Heat Gas | LPG or natural gas | Not published until confirmed | 160 / 215 ft² | Wall or ceiling, pivot arm | Affinity On/Off controller, manual wall switch |
| Eclipse Smart-Heat Freestanding | Electric | 2900 W | 121 ft² | Freestanding | Eclipse Dimmer Controller and remote included; app via the Bromic Heating app |
| Tungsten Smart-Heat Freestanding | LPG or natural gas | 38,000 BTU (Lookbook 2026; the site says 38,500) | 215 ft² | Freestanding | [[VERIFY: freestanding gas controls — Mike Clifford]] |

Tungsten Coastal and Select appear only as "coming soon" until Mike Clifford confirms launch.

**FAQs.** What type of outdoor heater works best for my space? Electric or gas? How many heaters do I need (link A03 and Design Request)? How high do I mount one (link the installation pages)? Which controls do I need? Do infrared heaters work in wind? Remove the duplicated ceiling-mount question.

**Links in:** homepage, every installation and application page, the infrared, gas-or-electric and clearance posts. **Links out:** Electric, Gas, the five installation pages, /residential/, /restaurants/, /hotels/, /super-yacht-cruise-ships/, /controls/, /design-your-space/.

**Title/H1 (the strategy's own example, to validate):** "Outdoor Heaters | Premium Electric & Gas Patio Heating | Bromic" · "Premium Outdoor Heaters for Residential & Commercial Spaces"[^s1].

### /outdoor-heaters/outdoor-electric-heaters/ (Electric category)

**Classification.** Electric infrared outdoor heaters: hard-wired, wall, ceiling, pole or recessed, plus Eclipse Freestanding; for covered and semi-open spaces at home and in hospitality.

**Specs to add.** The electric rows above, plus Platinum Smart-Heat Electric Marine (2300–4500 W, 65–143 ft², AISI 316 stainless, IPX5, Lloyd's Register approval; Affinity On/Off or Dimmer controller, manual wall switch). Voltage: Tungsten 220–240 V, 208 V, and 277 V on the 4000/6000 W models; Platinum 220–240 V and 208 V. Minimum mounting height: 72 in on a wall, 96 in on a ceiling (Tungsten, Platinum). IP: Tungsten IPX4, Cobalt IPX4, Marine IPX5; Platinum Electric as a number [[VERIFY: Platinum Electric IP rating — Mike Clifford]]. Add Cobalt, which the page omits. Fix the FAQ that gives Platinum as 2300 and 3400 W only (the range includes 4500 W) and state Eclipse's mounting count once.

**FAQs.** 208 V or 240 V? What breaker does a 4500 W heater need (from BLD-IN-KB1)? How many heaters per circuit (BLD-IN-KB2)? Do electric infrared heaters work in wind (RES-CO-KB1)? What does one cost to run per hour (RES-IN-01)? Are gas heaters allowed under all-electric codes (ARC-PP-01)? Every electrical answer ends with the line to confirm with a licensed electrician and the local authority.

**Links in:** the 301s from /outdoor-heaters/electric/ and /electric-old/; homepage "Heaters by Fuel Type"; /outdoor-heaters/; every electric PDP breadcrumb; the infrared posts. **Links out:** the six electric PDPs, the recess kit PDPs, /controls/, /technical-resources/, /design-your-space/.

**Title/H1 example (to validate):** "Electric Outdoor Heaters | Infrared Patio Heaters | Bromic" · "Electric Outdoor Heaters for Patios, Terraces and Commercial Spaces".

### /outdoor-heaters/outdoor-gas-heaters/ (Gas category)

**Classification.** Gas infrared outdoor heaters for open-air spaces: wall- or ceiling-mounted (Platinum Gas, Tungsten Gas) and freestanding (Tungsten Freestanding), on natural gas or LPG.

**Specs to add.** Platinum Gas: 23,600 and 39,800 BTU models, 160 and 215 ft², minimum mounting height 96 in, 110 V 2 A supply, black or stainless; heat deflector recommended where clearance above is under 1,100 mm or the unit is exposed [[VERIFY: deflector clearance in inches for a US page — Mike Clifford]]; Affinity On/Off controller (with the expansion board for building management), manual wall switch. Tungsten Gas: 160 and 215 ft², minimum 96 in, optimum 8 ft, pivot arm, deflector where the space above is under 42 in; Affinity On/Off controller, manual wall switch; its BTU stays off the page until Mike Clifford confirms it. Tungsten Freestanding: 38,000 BTU (Lookbook 2026; the site says 38,500 [[VERIFY: freestanding output — Mike Clifford]]), 215 ft², 20 lb LPG cylinder or natural gas by a 10 ft quick-connect line. Name gas models by output, never by the retired series numbers the site still uses.

**FAQs.** Natural gas or propane? Can a gas heater go under a cover (link the clearance post)? How long does a propane cylinder last (link the propane post) [[VERIFY: run time per cylinder — Mike Clifford]]? Are gas heaters allowed in all-electric buildings (ARC-PP-01)? Every installation answer says to confirm with the local authority and a licensed gas fitter (US gas appliances follow ANSI Z223.1/NFPA 54).

**Links in:** /outdoor-heaters/, homepage, /restaurants/, the gas mounting and propane posts. **Links out:** the three gas PDPs, the heat deflector PDPs, /controls/, /design-your-space/.

**Title/H1 example (to validate):** "Gas Outdoor Heaters | Natural Gas & Propane Patio Heaters | Bromic" · "Gas Outdoor Heaters for Open-Air Patios and Commercial Spaces".

### Tungsten Smart-Heat Electric PDP

**Classification (the strategy's P4 example).** An electric infrared outdoor heater for wall, ceiling, pole or recessed mounting, for homes and commercial spaces, in four outputs[^s1].

**Specs to add as text (now images or missing).**

| Model | Coverage (approx.) | Weight | Rated current 240 / 208 / 277 V |
|---|---|---|---|
| 2000 W | 65 ft² | 20 lb | 8.3 / 9.62 / 7.22 A |
| 3000 W | 100 ft² | 22 lb | 12.5 / 14.42 / 10.83 A |
| 4000 W | 130 ft² | 20 lb | 16.6 / 19.23 / 14.44 A |
| 6000 W | 160 ft² | 22 lb | 25 / 28.85 / 21.66 A |

Also: IPX4; minimum mounting height 72 in on a wall, 96 in on a ceiling; the 4000 and 6000 W models have two separately controllable elements; warranty 2 years on the heater, 7 on the elements; Intertek ETL/cETL. Heat blooms, dimensions and clearances as text, with BTU equivalents from the cut sheet [[VERIFY: BTU equivalents and clearances as text — Mike Clifford]]. **Controls:** Affinity Smart-Heat On/Off or Dimmer controller, or a manual wall switch; the expansion board for building management; app and voice need compatible Affinity controls, sold separately. Fix the visible SKU (N/A) and the typos the inventory lists. Keep the current range distinct from Tungsten Coastal and Select (coming soon).

**Resources from /technical-resources/ and /revit-bim-files/:** Tungsten Smart-Heat Electric Spec Sheet (2025); Instruction Manual (2021) [[VERIFY: current manual edition — Mike Clifford]]; Revit BIM ceiling and wall files and CAD (2023); covering guidance. Serve the spec sheet from www rather than pim.bromic.com.

**FAQs.** Which size for my patio? 208, 240 or 277 V? Can it be recessed? Which controls do I need? What breaker, and how many per circuit (BLD-IN-KB2)? Is IPX4 enough in rain?

**Links in:** Electric category, ceiling, wall and flush pages, /tungsten-collection/, application pages, the KB answers. **Links out:** recess kit, poles, bracket, Affinity controller PDPs, /technical-resources/, /design-your-space/.

**Title/H1 example (to validate):** "Tungsten Smart-Heat Electric | Infrared Outdoor Heater 2–6 kW | Bromic" · "Tungsten Smart-Heat Electric Outdoor Heater".

### Platinum Smart-Heat Electric PDP

**Classification.** A slim electric infrared heater for wall, pole or recessed mounting, in black or white, in three outputs; the Marine version has its own PDP.

**Specs to add as text.**

| Model | Coverage (approx.) | Weight | Rated current 240 / 208 V |
|---|---|---|---|
| 2300 W | 65 ft² | 17 lb | 9.6 / 11.1 A |
| 3400 W | 108 ft² | 22 lb | 14.2 / 16.3 A |
| 4500 W | 143 ft² | 33 lb | 18.8 / 21.6 A |

Also: 220–240 V and 208 V; minimum mounting height 72 in on a wall, 96 in on a ceiling; 304 stainless chassis; 8 in pole included, recess kits and longer poles sold separately; 3-year warranty; Intertek ETL/cETL. **Controls (not included, sold separately):** Affinity Smart-Heat On/Off or Dimmer controller, or a manual wall switch; expansion board for building management; app features need compatible Affinity controls. State which recess kit fits which output [[VERIFY: Low Clearance Recess Kit compatibility with 4500 W — Mike Clifford]] and give the IP rating as a number.

**Resources:** replace the English spec sheet link (it opens the Marine cut sheet) with the Platinum Smart-Heat Electric Spec Sheet (2025); relabel "Instruction Manual 4.5W" as 4500 W; add the Low Clearance Recess manual and the Affinity wiring guide (2025) and the Revit BIM ceiling and wall files and CAD (2023).

**FAQs.** What breaker does the 4500 W model need (BLD-IN-KB1 merges here)? Classic or Marine? Can it be recessed in a shallow ceiling? Which controls do I need?

**Links in:** Electric category, flush-mounted and wall-mounted pages, /platinum-collection/, the recess posts. **Links out:** recess kit PDPs, the Marine PDP, Affinity controller PDPs, /technical-resources/, /design-your-space/.

**Title/H1 example (to validate):** "Platinum Smart-Heat Electric | Slim Infrared Outdoor Heater | Bromic" · "Platinum Smart-Heat Electric Outdoor Heater".

## Migration residue the inventory shows

The strategy counts 94 404s, 269 redirects and 162 crawled-not-indexed URLs in current GSC indexing[^s1]. Those lists are not in the repo [[VERIFY: GSC export of 404s, redirects and 2025 top URLs — Brian Kim]]. What the crawl of live pages does show:

**Legacy and duplicate pages**

| Page | Problem | Fix |
|---|---|---|
| /outdoor-heaters/electric/ (named by the strategy) | Legacy Electric URL, 139.7K impressions in 2025[^s1] | One-hop 301 to /outdoor-heaters/outdoor-electric-heaters/ |
| /electric-old/ | Live duplicate of the Electric category; links three dated permalinks | 301 to the Electric category |
| /compare-outdoor-heating-systems/, /integrated-outdoor-heating-solutions/, /infrared-outdoor-heating/ | Near-duplicates (same testimonials, CTAs, hero) | Differentiate or consolidate (P2) |
| /access-bim-files/ and /revit-bim-files/ | Same page, two URLs | Canonicalise one |
| /product-catalog/ and /catalogs-and-literature/ | Same H1, same PDF | Canonicalise one |
| /controls/ and /smart-controls/ | Overlapping pages with conflicting expansion-board copy | /controls/ owns; /smart-controls/ becomes the integrations page |
| /design-your-space-variant/; builder LPs (/builder-outdoor-heating-101/, /builders-outdoor-heating/, /builders-lp-a/, /lp-builders/); partner LPs (/dwell/, /design-milk/, /houzz/); /luxury-outdoor-heaters/ and /high-end-outdoor-heaters/ | Test variants and near-duplicate landing pages | Noindex or canonical [[VERIFY: current index status — Brian Kim]] |

**Dated /20xx/ permalinks still linked from live pages** (10 targets)

| Dated link | Linked from | Replace with |
|---|---|---|
| /2020/07/23/heating-people-not-places-the-fundamentals-of-heat-transfer/ | /blog/do-outdoor-heaters-work-in-the-winter/ | /blog/heating-people-not-places-the-fundamentals-of-heat-transfer/ |
| /2020/09/28/combating-corrosion-outdoor-heating-in-coastal-environments/ | /product/platinum-smart-heat-electric-marine/ | /blog/stylish-resilient-coastal-outdoor-heaters/ |
| /2021/04/26/gas-or-electric-patio-heaters-which-one-is-right-for-me/ | /electric-old/, /faqs/ | /blog/gas-or-electric-patio-heaters-which-one-is-right-for-me/ |
| /2022/04/18/what-are-the-clearances-to-heat-my-covered-patio/ | /blog/top-5-considerations-for-installing-ceiling-mounted-outdoor-heaters/ | /blog/what-are-the-clearances-to-heat-my-covered-patio/ |
| /2022/12/12/how-to-select-the-right-fuel-source-for-your-space/ | /electric-old/, /outdoor-heaters/ceiling-mounted/ | /blog/gas-or-electric-patio-heaters-which-one-is-right-for-me/ |
| /2023/02/23/how-should-i-mount-my-outdoor-electric-patio-heater/ | /electric-old/ | /blog/how-should-i-mount-my-outdoor-electric-patio-heater/ |
| /2023/03/13/architect-spotlight-yvonne-haber-on-outdoor-living/ | /architects-designers/ | /blog/architect-spotlight-yvonne-haber-on-outdoor-living/ |
| /2023/03/14/the-bromic-low-clearance-recess-kit-a-practical-solution-for-installing-a-recessed-electric-heater/ | /builders/, /case-study/platinum-electric-heaters-recessed-using-the-low-clearance-recess-kit/ | /blog/how-to-install-the-low-clearance-recess-kit/ |
| /2023/07/10/how-to-install-the-low-clearance-recess-kit/ | /builders/, /case-study/platinum-electric-heaters-recessed-using-the-low-clearance-recess-kit/, /product/platinum-electric-low-clearance-recess-kit/ | /blog/how-to-install-the-low-clearance-recess-kit/ |
| /2023/11/15/crafting-enduring-experiences-in-outdoor-hospitality/ | /podcast/hospitality-and-outdoor-spaces/ | /blog/crafting-enduring-experiences-in-outdoor-hospitality/ |

**Internal links to URLs that are not live pages** (19 targets in the crawl; the most-linked): /contact-us/ (from 16 pages), /product/eclipse-dimmer-controller/ (8), /product/eclipse-smart-heat-portable/ (5), /product/tungsten-smart-heat-portable/ (5), /product/wireless-dimmer-controller/ (5), /warranty-registration/ (3), /product/smart-heat-link-home-automation-plugin/ (3), plus /outdoor-built-in-heaters/ and /outdoor-freestanding-heaters/ from /outdoor-heating-101/ and /outdoor-heaters/natural-gas/ from the garage post. Each is a redirect hop or a 404; replace the link with the live owner [[VERIFY: status of each target in the GSC export — Brian Kim]].

**Staging-domain structured data.** 75 inventory records flag schema pointing at `us.bromic-prod.454.agency` (25 case studies, 21 pages, 20 PDPs, 5 posts, 2 landing pages, 2 podcast pages), among them /infrared-outdoor-heating/, the Gas category and /outdoor-heating-planning-guide/. Point every `url`, `@id` and `sameAs` at www.bromic.com.

**Also:** an internal link carrying `utm_source=chatgpt.com` on the gas-or-electric post (blog audit) splits attribution; internal links never carry UTM tags.

## AEO template compliance of the Hub drafts

Computed from the files on 29 Oct 2026. "First paragraph" is the first prose block after the frontmatter; the template asks for 40–80 words. No draft shows a technical reviewer or a last-reviewed date on the page; each has `owner_review` and `updated` in its frontmatter, which a publish template can print once the engineering reviewer is named.

| Draft | Type | Words in first paragraph | 40–80? | Tables | FAQ pairs | Diagram | On-page reviewer / last reviewed |
|---|---|---|---|---|---|---|---|
| ARC-AW-01 | article | 77 | yes | 1 | 5 | no | no (frontmatter: Megan Spies, 2026-10-29) |
| ARC-BY-01 | article | 78 | yes | 1 | 5 | no | no (frontmatter: Shaughn Ritchie, 2026-10-29) |
| ARC-CO-01 | article | 81 | no | 4 | 5 | no | no (frontmatter: Mike Clifford, 2026-10-29) |
| ARC-IN-01 | article | 76 | yes | 2 | 5 | no | no (frontmatter: Shaughn Ritchie, 2026-10-29) |
| ARC-PP-01 | article | 46 (disclaimer; answer 85) | no | 2 | 6 | no | no (frontmatter: Shaughn Ritchie, 2026-10-29) |
| BLD-AW-01 | article | 77 | yes | 2 | 5 | no | no (frontmatter: Arvin Avaness, 2026-10-29) |
| BLD-BY-01 | article | 76 | yes | 1 | 5 | placeholder | no (frontmatter: Arvin Avaness, 2026-10-29) |
| BLD-CO-01 | article | 67 | yes | 1 | 6 | no | no (frontmatter: Arvin Avaness, 2026-10-29) |
| BLD-IN-01 | article | 68 | yes | 2 | 5 | no | no (frontmatter: Arvin Avaness, 2026-10-29) |
| BLD-PP-01 | article | 76 | yes | 1 | 5 | no | no (frontmatter: Arvin Avaness, 2026-10-29) |
| COM-AW-01 | article | 75 | yes | 2 | 5 | no | no (frontmatter: Blake Petty, 2026-10-29) |
| COM-BY-01 | article | 75 | yes | 3 | 5 | no | no (frontmatter: Blake Petty, 2026-10-29) |
| COM-CO-01 | article | 76 | yes | 3 | 5 | no | no (frontmatter: Blake Petty, 2026-10-29) |
| COM-IN-01 | article | 71 | yes | 2 | 5 | no | no (frontmatter: Blake Petty, 2026-10-29) |
| COM-PP-01 | article | 83 | no | 1 | 5 | no | no (frontmatter: Shaughn Ritchie, 2026-10-29) |
| RES-AW-01 | article | 71 | yes | 1 | 5 | no | no (frontmatter: Megan Spies, 2026-10-29) |
| RES-BY-01 | article | 63 | yes | 1 | 6 | no | no (frontmatter: Megan Spies, 2026-10-29) |
| RES-CO-01 | article | 82 | no | 3 | 5 | no | no (frontmatter: Megan Spies, 2026-10-29) |
| RES-IN-01 | article | 65 | yes | 3 | 6 | no | no (frontmatter: Megan Spies, 2026-10-29) |
| RES-PP-01 | article | 90 | no | 2 | 6 | placeholder | no (frontmatter: Megan Spies, 2026-10-29) |
| ARC-BY-KB1 | kb | 74 | yes | 1 | n/a | no | no (frontmatter: Mike Clifford, 2026-10-29) |
| ARC-CO-KB1 | kb | 56 | yes | 1 | n/a | no | no (frontmatter: Mike Clifford, 2026-10-29) |
| ARC-IN-KB1 | kb | 47 | yes | 1 | n/a | no | no (frontmatter: Mike Clifford, 2026-10-29) |
| BLD-BY-KB1 | kb | 77 | yes | 1 | n/a | no | no (frontmatter: Arvin Avaness, 2026-10-29) |
| BLD-IN-KB1 | kb | 66 | yes | 1 | n/a | no | no (frontmatter: Arvin Avaness, 2026-10-29) |
| BLD-IN-KB2 | kb | 66 | yes | 1 | n/a | no | no (frontmatter: Arvin Avaness, 2026-10-29) |
| COM-CO-KB1 | kb | 45 | yes | 1 | n/a | no | no (frontmatter: Blake Petty, 2026-10-29) |
| COM-IN-KB1 | kb | 55 | yes | 1 | n/a | no | no (frontmatter: Blake Petty, 2026-10-29) |
| COM-PP-KB1 | kb | 49 | yes | 1 | n/a | no | no (frontmatter: Shaughn Ritchie, 2026-10-29) |
| RES-CO-KB1 | kb | 64 | yes | 1 | n/a | no | no (frontmatter: Megan Spies, 2026-10-29) |
| RES-CO-KB2 | kb | 67 | yes | 1 | n/a | no | no (frontmatter: Megan Spies, 2026-10-29) |
| RES-PP-KB1 | kb | 71 | yes | 1 | n/a | no | no (frontmatter: Megan Spies, 2026-10-29) |

**What to fix before publishing:** trim ARC-CO-01, COM-PP-01, RES-CO-01 and RES-PP-01 to 80 words; move ARC-PP-01's disclaimer below its 85-word answer and trim the answer; add a reviewer and last-reviewed line to all 32; brief an original diagram for each of the seven authority pages (only BLD-BY-01 and RES-PP-01 have placeholders); give each draft its owner link from `data/page-ownership.json`. KB answers need no FAQ block of their own because they ship inside their owner pages.

## Measurement

The strategy's layers[^s1], mapped to what the Hub and the HubSpot form spec can tag. Hidden fields on every form: `asset_id`, `matrix_cell`, `utm_*` and, for tools, `tool_inputs` (HANDOVER §9).

| Layer | Strategy metric | What the Hub can tag or supply | Gap |
|---|---|---|---|
| Search visibility | Non-brand impressions; number of ranking non-brand queries; priority category/PDP impressions | `data/page-ownership.json` families as GSC page groups (owner plus supporting URLs); each item's `primary_keyword` and `ai_prompt` as tracked queries | Brand/non-brand query filter [[VERIFY: brand query regex for GSC — Brian Kim]] |
| Traffic | GSC clicks; GA4 organic sessions; GSC-to-GA4 variance | A GA4 content group per family, and the `matrix_cell` of the item published on each URL | Content-group tagging on page templates (454 Creative) |
| Technical health | High-value 404s; redirect quality; indexed canonical pages | The residue lists above as the checklist; owner URLs as the canonical set | GSC exports, monthly |
| AEO authority | AI-visible/cited pages where measurable; question-query coverage; knowledge-page visibility | Each item's `ai_prompt` as the question set; the seven authority pages as the knowledge-page panel | Method for AI citations [[VERIFY: AI visibility tool or manual sampling — Brian Kim]] |
| Conversion | Organic / AI-assisted Design Requests | `asset_id` and `matrix_cell` on the Design Request form, set from the page that sent the visitor; AI-assistant referrals in GA4 | Design Request hidden fields not confirmed [[VERIFY: form fields on /design-your-space/ — Brian Kim]] |
| Pipeline | MQL, SAL/SQL, opportunity value, revenue influenced by organic | HubSpot lead scoring by `asset_id` (forms/lead-scoring.md); first-touch landing page | CRM reporting on organic-sourced opportunities |

The baseline for every layer is the strategy's Jun–Aug 2025 to Jun–Aug 2026 comparison[^s1]; measure the same window in 2027.

## Planning checklist

- [ ] GSC export of 404s, redirects, crawled-not-indexed and 2025 top URLs (Brian Kim)
- [ ] Redirects: /outdoor-heaters/electric/ and /electric-old/ to the Electric category; blog audit 301s; dated links replaced (454 Creative)
- [ ] Ownership map confirmed and the infrared owner chosen (Brian Kim)
- [ ] Category and PDP specs signed off, with controls on every heater (Mike Clifford)
- [ ] Engineering reviewer named for AEO pages (Mike Clifford)
- [ ] Seven authority pages upgraded on the AEO template
- [ ] Drafts published per the table above, each with its owner link and a Design Request close
- [ ] Hidden fields on the Design Request form; baseline report set (Brian Kim)
