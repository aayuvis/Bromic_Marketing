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

## Verify

```bash
cd app && npm install
npm test         # schema, sources, controls rule, CTA rule, image refs, calculators
npm run build    # app/dist — the Content Hub, self-contained
```

## Commit trailer

Never put a model identifier in commits or files.
