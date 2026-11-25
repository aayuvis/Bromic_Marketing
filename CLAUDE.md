# CLAUDE.md — Bromic Marketing (Content & MQL Asset Base)

Read this, then [HANDOVER.md](HANDOVER.md) (the brief, binding), then [templates/content-schema.md](templates/content-schema.md).

## What this is

The content and lead-capture asset base for **Bromic Heating** (US first; adaptable to CA, AU, UK, EU), plus
**Bromic Content Hub** (`app/`): a web app that holds every piece of content by **lifecycle stage** (AW · CO · IN · PP · BY),
**audience** (RES · ARC · BLD · COM) and **type** (article · knowledge base · gated guide · report · spec kit · tool ·
case study · sales kit · stats page), with its sources, images, reviewer and status.

Thesis: only 23% of homeowners prioritise outdoor heating at planning (Bromic Trends 2026, Atomik Research). Every asset
moves heating earlier — into the drawing, the pre-wire, the first budget.

## Hard rules (from HANDOVER §5–§7, non-negotiable)

1. **Never invent** a spec, price, statistic, customer, quote, code requirement or keyword volume. Unknown → `[[VERIFY: what — owner]]`,
   logged in `reviews/open-questions.md`.
2. **Every statistic carries a source** (publisher, study, year) in the item's `sources:` and a `[^sN]` marker where it is used.
   Unverifiable stats are cut, not softened.
3. **Product facts come only from `data/product-facts.json`.** Lookbook 2026 beats Planning Guide 2021 on conflicts. Never use
   legacy "500 series" naming. Tungsten gas BTU is unpublished until verified.
4. **Every heater recommendation includes its controls** (Affinity Smart-Heat On/Off, Dimmer or Eclipse controller, wall switch, app).
   Wi-Fi/app features need compatible Affinity controls, sold separately — say so. Controls are never "optional".
5. **One CTA per asset**, mapped to the next-stage asset.
6. **Competitors** (Infratech, Heatscope, Heatstrip): factual, sourced, `needs_approval: Specification and compliance`. No disparagement.
7. **Tungsten Smart-Heat Electric Series II has launched** (owner, 22 Nov 2026): Select and Coastal are available (launched October 2026) and are never called "coming soon"; Classic follows in January 2027.
8. **Code/permit content** carries the local-authority + licensed electrician/gas fitter disclaimer and links a primary source.
9. Keyword volume tiers are directional, never in copy. Do not reproduce third-party text — paraphrase and cite.
10. Nothing is published from here. Output is review-ready drafts; publishing (WordPress, 454 Creative) follows owner sign-off.

## Electrical contractor guide (A25, 12 Nov 2026)

`content/sales/A25-electrical-contractor-guide.md`: a Bromic version of a dealer's contractor brochure (Patio Heat and Shade,
supplied by the owner). Structure followed, every line rewritten; facts only from product data and sourced pages. Ends with the
Bromic Partner Program's six benefits (from bromic.com/lp-builders and the owner's screenshot) and the footnote "A reseller
certificate is required to join the Bromic installer program" (owner). The brochure's Bromic photos are in the library as `d-` ids
(11; Infratech, awning, umbrella and thermostat images were left out). US only (NEC): no nl/de translation until a regional version
is asked for.

## Product marketing (owner, 18 Nov 2026)

The Hub's **Product marketing** tab (`#/pm`, `pmPage()` in app.js) holds one framework per launch in `data/product-marketing/<id>.json`,
first **Tungsten Smart-Heat® Electric Series II** (launch deck, July 2026: Select and Coastal launched Oct 2026, Classic Jan 2027;
Series I sells through; Cobalt discontinued). The owner's ten benefit fields are the core (heat performance, installation
flexibility, ease of installation, recess ability, safety and peace of mind, design aesthetics, design flexibility, ease of
controls, warranty, heating multiple outdoor areas); two more, coastal durability and specification and support, are core too (owner, 18 Nov 2026: not proposed; electrical flexibility and
choice and value removed by the owner, 18 Nov 2026: voltage is parity and price is not a benefit field; tier prices stay in the tier cards). Six buyers: homeowners, builders, installers, commercial and corporate users,
architects, designers. **Matrix 1** weights each benefit per buyer (3/2/1) with the claim that resonates; **matrix 2** compares
Series II with Series I (bromic.com, cut sheet, manual, warranty); **matrix 3** compares with Infratech (factual, sourced, each row an
edge: bromic · parity · infratech · unknown; `needs_approval: Specification and compliance`). Claims add no facts; open facts are
`[[VERIFY]]`. Above the matrices: eight **lead messages** (`pillars`, from the owner's core topics: up to 6 kW dual element with
dimming; mounts anywhere incl. pitched ceilings, extended wall, angles to 45°; safe vented low-clearance recess, two fans, 7.5 in
clearance, no box to build; single post; no visible junction box; 3 colours and 3 fascias; Coastal dual corrosion protection;
one family for every outdoor room) and the **portfolio by space**. Infratech's flush frame is quoted exactly: "After 4 hours of
continuous use, a 15 minute cool down period is recommended". Recess wording is **"dual fan-ventilated"**; the plain "only 6 kW low-clearance recess" claim tested false (Infratech, Lynx, Eurofase
recess 6 kW in 2×8 framing), so the page uses the qualified line and shows the **claim check**. Installer, builder and architect claims
quote numbers (7.5 in cavity, 3/12–12/12, 15°/30°/45°, 208/240/277 V, 6 kW a channel); slimness is 14% narrower, 10% shallower, 23%
smaller section (launch deck). Tab **4 · Assets to create**: the launch kit (asset, channel, claims, brief, owner) and Instagram ad
briefs for homeowners and for builders and installers (`ad_briefs`: format, hook, headline, primary text, CTA, visual, claims, must-carry
lines, KPI). `app/test/pm.mjs` holds every buyer × benefit filled. Series II renders are `t2-` images.
**Launch playbook deck** (owner, 18 Nov 2026): `decks/Tungsten-Series-II-Launch-Playbook.pptx`, 40 slides in the Hub's Bromic look
(Bodoni MT headlines as the Office-safe Didot, Arial body, white, ink, flame accent), built by `decks/build-tungsten-series-ii.js`
(pptxgenjs) from the framework JSON: benefit fields and claims (audience page, 12 fields, one page per field with weights, Series I and
Infratech), marketing (messages, portfolio, assets, Instagram ads), product training (six modules and a knowledge check) and launch emails
(architects, builders and installers, dealers, designers). Rebuild it whenever the framework changes; the Hub links it from Product marketing. v2 (owner, 18 Nov 2026): benefit fields in
priority order (recess, heat, aesthetics, controls, install flexibility, safety, design flexibility, multiple areas, warranty, ease of
install, specification and support, durability by the coast); a Lucide icon per field and audience; images cropped to their frames with sharp, never stretched;
Tungsten images on the cover, contents and dividers; every model including 6 kW tilts to 45° (the manual says 30° for 4–6 kW:
`tilt_verify`); **3-year warranty** on Series II (`warranty_note`); a CAD-style recess airflow animation in the assets; crisp emails
with bold leads; the last slide sets clear asks for Mike Clifford (product and channel management) and Megan Spies (brand marketing): the
one place names appear, at the owner's explicit request (18 Nov 2026). v3: two four-frame Instagram storyboards (homeowners, specifiers; frames made with
an image model from Series II references, labelled not for publication; `decks/img/sb-*.jpg`, boards in `decks/storyboard-*.jpg`);
message 03 reads "Worry-Free, Dual Fan-Ventilated 6 kW Recessing" (owner: "worry-free" for customer-facing "safe"). v4: chapter 5, one-pagers (against
Infratech, builders and installers, architects and specifiers, homeowners, dealers, designers, commercial); two four-benefit Instagram
carousels (`carousels` in the framework: power, recess, design, controls; cards rendered on Bromic photography by
`python3 decks/build-carousels.py` → `decks/carousels/`); the last slide is high-level and says the playbook is a suggestion. The Hub's
Product marketing tab 4 shows the carousels and storyboards (`storyboards`).

**Range frameworks (owner, 19 Nov 2026):** `platinum-electric.json`, `platinum-gas.json`, `tungsten-gas.json` (mounted, Freestanding/Portable) and
`eclipse.json` use schema v2: `m3.competitors` (2–4 closest, researched, each with `why_closest`) and rows with `vs.<competitorId>`;
optional `m2` against our own range (`m2_label`); `competitive_summary` (wins, parity, watch, battlecard). Tungsten Series II adds
`training`, `one_pagers`, `emails`, `next_steps`, `dimensions`, `accessories` (tab 5). Brief: test every "only" in `claim_checks`.

## Retail Hub (owner, 20 Nov 2026)

`#/retail` (tab "Retail", also under Marketing): 12 one-pagers a retailer needs, in `data/retail/retail.json` (`retailPage()` in app.js):
why stock Bromic, range selector, Tungsten Series II, Platinum Electric, Eclipse, gas, controls, sizing, selling on the floor,
install and warranty, merchandising, ordering. Facts only from product data; unknowns are `[[VERIFY]]`, shown on the page as
"To confirm". No prices (owner's dealer guidance). Each prints to one Letter page ("Print or save as PDF"); sources show on
screen, not in print. Competitor lines live only on the selling page (`needs_approval: Specification and compliance`).

## Trends 2027 (owner, 21 Nov 2026)

Four visual trend reports replace the 2026 reports (`A01-v2`, `A01c` stay in the library, marked replaced): North America,
Australia, United Kingdom and global hospitality, each in landscape and US Letter portrait. Storylines in
`reports/trends-2027/*-storyline.md`; each report's words and images in `reports/trends-2027/<id>/content.py`, its hand-drawn
charts (rough.js) in `<id>/charts.js`; the shared engine in `reports/trends-2027/engine/` (sketch renderings, layout, print QA).
`python3 reports/trends-2027/engine/publish.py <id> --shots DIR` builds both formats, runs the print check (`engine/qa.js`: no text
off a page, no overlapping chart labels or blocks, no missing image) and prints both PDFs. Charts show the year on every
before/after point and never repeat the source printed under the headline number. The Hub lists them on `#/trends`
(`data/trends-2027.json`) and in the White Papers menu. The eight PDFs are committed: after changing a report, run `publish.py` and commit its PDFs (the CI browser renders them 5× larger).

## Image Approvals (owner, 20 Nov 2026)

`#/approvals` (tab "Image Approvals", count of waiting images): every generated image for owner sign-off, from
`data/image-review.json` (`approvalsPage()` in app.js); files in `images/review/full/` (JPEG, full size) and `thumb/` (webp).
Approve or reject per image, then **Save**: with the editor's GitHub token it commits the statuses to `data/image-review.json`
(the publish workflow rebuilds the Hub); without one it opens an `[Image approval]` issue to apply. Each build zips the approved
files that are also ticked **Mark for download** (owner, 25 Nov 2026: "not all approved images must go in the download folder"; `download: true`, own tab) to `review/approved-N.zip`, parts of at most 80 MB ("Download marked", one button per part; GitHub Pages refuses files over 95 MB). New generated images go here first, `status: pending`, with what
the background is (real photo or generated) and the finish. Approved images still enter `images/library` as `generated` before use.
Rules for making them: [cad/CAD-TO-REAL-REQUIREMENTS.md](cad/CAD-TO-REAL-REQUIREMENTS.md); QC agent `.claude/agents/tungsten-render-qc.md`.
Each card has a comment box; a rejection needs a reason (saved as `note`, with `decided` date).
**Decisions lock (owner, 21 Nov 2026: "it should lock in where it is unless moved"):** every approve, reject or move-back (items, case studies, images) is kept in the browser (`bromic-hub-decisions-v1`) the moment it is clicked and shown in every list until the published data carries it. Items have Approve, Reject and Move back to review; `[Reject]` and `[Status]` issues are applied like `[Approve]`.
**Learning loop (start every session here, with the feedback issues):** read `data/image-review.json` (and any `[Image approval]`
issues). For every rejection or comment not yet learned, add one concrete, testable rule to §12 "Owner decisions" of the
requirements doc and the matching check to the QC agent, then set `learned: true` on that item and commit. Approved images
show what good looks like: note the pattern. Never regenerate a rejected scene the same way.

## Calculations: one simple model

Every tool and every article that does arithmetic follows [templates/calculation-model.md](templates/calculation-model.md) (owner,
30 Oct 2026: people doing these sums think simply; few variables, accurate basics). 20 ft² a seat; overhead heaters = area ÷
(coverage × cover factor × climate factor); freestanding heaters never more than 4 seats each; running cost from kW or BTU and the
price. A worked example in an article must match what the tool shows for the same inputs (the tools' tests check the articles'
numbers). Tools ask only what moves the answer; everything else is a stated default in the full report.

## Voice and look (owner, 15 Nov 2026: "learn from Bromic's way of writing"; nothing in the Hub may read or look like Claude)

[templates/bromic-voice.md](templates/bromic-voice.md) is binding. Bromic's own lines set the tone ("Extend The Moment", "Durability
meets power.", "You create beautiful spaces. We know how to heat them."): short display lines with every word capitalised, "you" and
"we" in the body, en dashes not long dashes, no exclamation marks, no "not X, but Y" flourishes, no explaining what a page will do.
Type is the Lookbook 2026's: **Didot** headlines (GFS Didot bundled in `app/src/fonts/`), **Helvetica Neue Light** body, white
pages, ink and steel, flame `#EF4123` on small labels and rules only. Never Georgia, never an ivory page. The Hub, the tools and the PDFs
share this system (`app/src/styles.css`, `tools/_shared/brand.css`, `app/scripts/pdf.mjs`). No screen, PDF, button or code comment
shown to a user says "Claude": feedback and edits go "to the content team".
**No people's names in the Hub or what it generates** (owner, 15 Nov 2026): owners, reviewers and `[[VERIFY: … — team]]` notes
name a team from `data/team-roles.json` (`python3 scripts/roles.py` replaces names). Public spokespeople quoted in Bromic's own
published posts keep their attribution; homeowners are never named.

## Images

`images/library/` holds processed webp + `manifest.json` (source, page, product, setting, rights). Preference order: Bromic website →
Bromic asset library → Bromic publications (seeded from the three PDFs) → generated (Gemini) only when nothing fits.
**Owner rule (29 Oct 2026): no image generation until bromic.com imagery and the existing library have been studied.** A first
run drew heaters installed wrongly (box heaters angled off a wall). Generated images must show Bromic products only as they
really are and as they are really installed, or show no heater at all; every one is looked at and owner-approved before it
enters the library, labelled `generated`. Of the six first-run images, five were owner-approved and added (`g-` ids); the restaurant scene was rejected. **Drop raw Bromic images into `images/inbox/`** and run
`python3 scripts/ingest_images.py` to add them to the library.

## bromic.com (read 29 Oct 2026)

`www.bromic.com` pages sit behind a Cloudflare challenge: plain HTTP gets 403. They were read with a fetch tool, summarised in our
words, into `data/site-inventory.json` (`python3 scripts/merge_site_inventory.py <dir>`): 73 blog posts, 32 product pages, 38 case
studies (US + AU), 48 pages and landing pages, 205 gallery photos. **Never try to get around the challenge** (no spoofed user
agents, headless browsers or caches). Image files under `wp-content/uploads` download directly. **www.bromic.com.au blocks even
the fetch tool**: Australian items are read through their US copies where they exist, otherwise marked "search listing only". bromic.ca,
bromic.co.uk, bromic.nl, bromic.be and bromic.de load, but carry translated copies of the US/AU case studies; the only local one is
Neumanns Restaurant, Hamburg (bromic.de). bromic.at, bromic.ch and bromicheating.co.uk redirect to bromic.com. Case studies:
`python3 scripts/build_case_studies.py` → `data/case-studies.json` (tags in `case-study-taxonomy.json`, deck collections, whitespace targets).
Figures in the inventory are leads to check on the live page, never sources. Product-page specs and list prices live in
`data/product-facts.json` under `site` per product, `verified: false` until the Product team signs off.

Images: `python3 scripts/bromic_site_images.py fetch | sheets | ingest` → `images/_raw/bromic-com/` (gitignored) → contact sheets
→ the library as `w-` ids with `source_url` and `page_url`. Every image is looked at before ingest; rights stay `[[VERIFY]]`.

## Blog (content/blog/)

Every live bromic.com/blog post has a call in `content/reports/blog-audit.md` (keep and fix, rewrite, merge, replace with a Hub
article, retire). A post that survives is rewritten as `type: blog` in `content/blog/`, **on its existing URL** (`live_url`; the SEO
strategy recovers existing pages instead of adding new ones), absorbing the posts that merge into it (`merges:` → 301s). Each
follows `templates/blog-brief.md`: a 40–80 word answer first, H2s, a table where it fits, controls with every heater, sources,
one CTA, `technical_reviewer` and `last_reviewed`. The Hub's Blog tab shows all 73 live posts and what replaces each.

## Installations found on the web (two passes, 12 Nov 2026)

`data/web-installs.json`: 55 named Bromic installations found on the open web (venues, installers, reps, architects, pergola
dealers, listings, trade press), each with its sources, a confidence and an evidence level; Bromic's own case-study pages are
excluded. Every find becomes a case study:
- **Full drafts** `content/case-studies/web/CSW-*.md` (23): a high-confidence find with a named product and a page actually read.
- **Partial case studies** `CSP-*.md` (21): what the sources support, plus a "What is missing" list for the call that completes it.
Both carry `source_kind: web-find`, `origin: web-search`, `evidence` (page-read · snippet-only · bromic-listing · bromic-publication)
and `completeness` (full-draft · partial), `status: draft`: sourced facts only, controls `[[VERIFY]]` where not stated, no invented
numbers or quotes, a "To publish" list ending in the template's consent checklist. The Cases tab filters every record by **Origin**,
**Evidence** and **Completeness** (taxonomy groups in `case-study-taxonomy.json`; Bromic's own pages are `published`, gallery
projects `photos-only`); each card shows its provenance chips. **Privacy:** a private home is named by town and source type only,
never a house number, street or homeowner's name. Legacy "500 Series" naming in a source is dropped (hard rule 3).
**Images (owner, 19 Nov 2026, changes the earlier rule):** a web case study shows a photo of the project itself. Bromic-published photos first; otherwise the project's own photo from the venue, installer or press page, ingested as a `v-` image (`status: third-party`, `owner`, `source_url`, `page_url`) and captioned "Photo: <owner>, via <site>. Permission to publish to be confirmed." Private homes: outdoor area only, never a face, house number or street. Where none exists the comparable Bromic image stays, captioned honestly. A draft uses a
Bromic-published photo of that project where one exists (21 `m-` images from Bromic's 2022 marine presentation; the Juneau
showhome from bromic.com), otherwise a comparable Bromic image with `hero_caption` saying so. `scripts/build_case_studies.py`
adds the finds to the Cases tab as `kind: web-find` (filter "Found on the web"; counted in the whitespace grid).

## Navigation and white papers (owner, 19 Nov 2026)

Seven tabs: **Home · Knowledge · Library ▾ · White Papers ▾ · Case Studies · Marketing ▾ · Review (count)**. **Knowledge** (`#/knowledge`, `knowledgePage()`) shows every article and quick answer as photo tiles: six topic tiles (`KH_TOPICS`, matched on the title), audience filter, a featured article, then Articles and Quick Answers grids; a repeated hero gets the next unused Bromic photo so no two tiles share a picture. The three ▾ are mega menus built by
`megaMenus()` in app.js (Library: publish / share / working files, the last in small type; White Papers: every gated PDF as a card;
Marketing: Product marketing and Campaigns). **Review** (`#/todo`) opens on two clusters, *Case Studies Awaiting Approval* and
*Knowledge Articles Awaiting Approval*, each split into ready to read / facts to confirm (/ partial). Behind-the-scenes documents
collapse to one line. **PDFs** (`scripts/pdf.mjs`): 0.5 in margins, full-bleed photo cover with the white logo, two-column body,
dark table heads, CTA band with the site, fewer section photos, sources in two small columns; nothing internal is printed.

## Navigation for a brand manager (owner, 12 Nov 2026: "no way a brand manager can navigate the asset library")

Five tabs: **Start · Assets · To do · Case studies · Images**, everything else under **More** (PDF downloads, calculators, blog plan,
buyer journey map, asset backlog, sources, bromic.com audit, review numbers). **Assets** opens on shelves named for where a piece
goes (`SHELVES` in app.js: website articles and answers, downloads that capture leads, sales and trade kits, calculators, case
studies, blog rewrites, working documents); filters appear only once a shelf or search is chosen. Every row and every item page
carries ONE next step in plain words (`nextStep()`: read and approve, answer N open facts and who, call the venue, send to 454
Creative, live). **To do** (`#/todo`) shows the flow Draft → Facts answered → Approved → 454 Creative → Live, can be filtered to one
team, groups open `[[VERIFY]]` facts by the team named after the dash (copyable as an email), and lists partial case studies.
**Approve** on an item page (only when no facts are open) writes `status: approved` through the editor (GitHub token) or opens an
`[Approve]` issue, which `scripts/feedback.mjs` lists with feedback and edits. Internal documents (audits, outlines, templates) sit on
the Working documents shelf, never among assets to share. Jargon stays out of the chrome (no MQL/SAL in labels).

## Feedback loop (start every session here)

The Hub has a Feedback button on every page, a comment button on every section heading, "Comment on this" for selected text, and
a feedback link on every case study and image. Each opens a GitHub issue in this repo titled `[Feedback] …` whose body starts with
a machine-readable block (`element`, `section`, `type`, `page`, `commit`, then the quoted text and the request).
**At the start of every session:** run `node scripts/feedback.mjs` (or list issues with the GitHub tools) and work through every
open feedback issue: make the change in the source file the element names (an item id → `content/**/<id>-*.md`; `tool:` →
`tools/<id>/`; `case:` → `scripts/build_case_studies.py` tags or `data/case-studies.json`; `image:` → `images/library/manifest.json`),
keeping every hard rule above. Run the tests, commit with `Fixes #N` in the message (one commit may fix several), push, deploy,
then comment on each issue with what changed and the commit, and close it. Feedback that conflicts with a hard rule or needs an
owner's decision is not implemented: comment why, label the question with its owner, and leave it open.

## Reviewer editor (live edits on the Hub)

Every item page has "Edit this page" (`app/src/editor.js`, loaded on demand). A reviewer rewrites any block (as Markdown), the
title or summary, or switches the main or an inline image for one from the library. The build renders each block separately and
records its offsets (`it.blocks`), so a save rewrites only what changed. Two ways to save:
- **Save to GitHub**: commits straight to the content file on `claude/dreamy-euler-xxi5g7` with the reviewer's own fine-grained
  token (Contents: read and write, this repo only; kept in their browser). `.github/workflows/publish-hub.yml` then runs the tests and
  republishes the Hub. A rule-breaking edit fails the tests and is not published: fix it in the next session.
- **Send to the content team**: opens an `[Edit] …` issue with a JSON patch (`file`, `edits[{block, old, new}]`, `hero`, `title`, `summary`).
  `node scripts/feedback.mjs` lists these with the feedback; apply each, run the tests, commit with `Fixes #N`, deploy, close.
Commits titled "Hub edit: …" come from reviewers: pull before working (`git pull origin claude/dreamy-euler-xxi5g7`).

## Regions and languages

The Hub's top bar switches region: US · Canada · AUS · NZ · UK · Benelux (Dutch, English) · Germany (German, English)
(`data/regions.json`; rules in [templates/regionalisation.md](templates/regionalisation.md)). French and Belgian context are on
hold (owner, 30 Oct 2026). English (US) is the master. Outside the US, English pages convert units on the page (m², m, mm, °C,
kW, L, kg; Canada keeps imperial in brackets) and every item shows a regional panel (codes, mains, installer, local Bromic site,
"figures are US data"). Dutch and German are full translations in `content/i18n/<lang>/<same path>`, regionalised (metric, local
codes, no dollar→euro conversion), `translation_status: machine-draft` until a native reviewer signs off; `node app/test/i18n.mjs`
holds each to its master (citations, images, links, VERIFY notes, metric only). **When an English item changes, its translations
are stale: update them in the same commit.** The tools read the region (`tools/_shared/region.js`, strings in
`tools/_shared/strings.json`): lengths, areas and labels convert; A20/A21 use regional prices (`data/regional-prices.json`).

## Publish the Hub

`cd app && ./deploy.sh` builds, renders the PDFs, and force-replaces the `gh-pages` branch →
<https://aayuvis.github.io/Bromic_Marketing/#/home>. **The repo and the site are public** (the owner made the repo public, 29 Oct 2026);
the page carries `noindex`. Commit first: the deploy is stamped with the commit it was built from. Tools are inlined by
`node tools/build-config.mjs` (part of `npm run build` and `npm test`); a tool's README table comes from `node tools/readme-table.mjs <id>`.

**PDFs:** every gated document (report, gated guide, spec kit, sales kit) gets a branded PDF at deploy (`node scripts/pdf.mjs` →
`app/dist/pdf/<id>.pdf`; cover, body, CTA, sources, page numbers; drafts say so on every page). The Hub shows "Download PDF" on
those items. PDFs are built from git at each deploy, never committed.

A private Claude preview build also exists (`npm run artifact`, <https://claude.ai/artifact/DL4yWhz2KcMoxMHoLhLd8i>); it is not kept in
step since the site went public.

## Verify

```bash
cd app && npm install
npm test         # schema, sources, controls rule, CTA rule, image refs, calculators
npm run build    # app/dist — the Content Hub, self-contained
```

## Commit trailer

Never put a model identifier in commits or files.
