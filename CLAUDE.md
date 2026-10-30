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
6. **Competitors** (Infratech, Heatscope, Heatstrip): factual, sourced, `needs_approval: Shaughn Ritchie`. No disparagement.
7. **Tungsten Coastal / Select are "Coming soon"** until Mike Clifford confirms launch.
8. **Code/permit content** carries the local-authority + licensed electrician/gas fitter disclaimer and links a primary source.
9. Keyword volume tiers are directional, never in copy. Do not reproduce third-party text — paraphrase and cite.
10. Nothing is published from here. Output is review-ready drafts; publishing (WordPress, 454 Creative) follows owner sign-off.

## Calculations: one simple model

Every tool and every article that does arithmetic follows [templates/calculation-model.md](templates/calculation-model.md) (owner,
30 Oct 2026: people doing these sums think simply; few variables, accurate basics). 20 ft² a seat; overhead heaters = area ÷
(coverage × cover factor × climate factor); freestanding heaters never more than 4 seats each; running cost from kW or BTU and the
price. A worked example in an article must match what the tool shows for the same inputs (the tools' tests check the articles'
numbers). Tools ask only what moves the answer; everything else is a stated default in the full report.

## Voice and look

Direct, expert, calm. No hype, no exclamation marks, no emoji. Sentence case; UPPERCASE only for small labels. People and moments
first, then the numbers. Phrases in use: "Extend the Moment", "Heat you can feel, not see", "Designed from the start, not added later."
Flame `#EF4123` is the only accent on black, white, warm paper and steel. Georgia headings, Helvetica body.

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
`data/product-facts.json` under `site` per product, `verified: false` until Mike Clifford signs off.

Images: `python3 scripts/bromic_site_images.py fetch | sheets | ingest` → `images/_raw/bromic-com/` (gitignored) → contact sheets
→ the library as `w-` ids with `source_url` and `page_url`. Every image is looked at before ingest; rights stay `[[VERIFY]]`.

## Blog (content/blog/)

Every live bromic.com/blog post has a call in `content/reports/blog-audit.md` (keep and fix, rewrite, merge, replace with a Hub
article, retire). A post that survives is rewritten as `type: blog` in `content/blog/`, **on its existing URL** (`live_url`; the SEO
strategy recovers existing pages instead of adding new ones), absorbing the posts that merge into it (`merges:` → 301s). Each
follows `templates/blog-brief.md`: a 40–80 word answer first, H2s, a table where it fits, controls with every heater, sources,
one CTA, `technical_reviewer` and `last_reviewed`. The Hub's Blog tab shows all 73 live posts and what replaces each.

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
- **Send to Claude**: opens an `[Edit] …` issue with a JSON patch (`file`, `edits[{block, old, new}]`, `hero`, `title`, `summary`).
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
