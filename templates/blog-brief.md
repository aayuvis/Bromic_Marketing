# Blog brief: rewriting bromic.com/blog (shared by every blog writer)

Read first: CLAUDE.md, templates/writer-brief.md (voice, research and product rules: binding), templates/content-schema.md,
content/reports/blog-audit.md (the call and the fixes for every post), content/reports/seo-aeo-gap-analysis.md and
data/page-ownership.json (which URL owns which search intent), data/product-facts.json (products: use the `site` blocks for
specs per model, always `verified: false`), images/library/manifest.json (heroes: prefer `w-` bromic.com photos whose `page_url`
or `used_on` is the post you are rewriting, or the same product correctly installed; skip renders and anything with a
`notes` flag unless nothing else fits).

## What each file is

The **replacement body for a live bromic.com/blog URL**. It keeps that URL (no new pages: the SEO strategy says recover
existing URLs). Where the audit merges other posts into this one, absorb their useful content and list them in `merges:`
(those URLs get a 301 to this one). Read the live post with WebFetch (www.bromic.com loads with WebFetch; never try to get around
a block), and the merged posts, keep what is sound, fix every issue the audit lists, and cut the rest.

## AEO page template (strategy document, binding)

1. **Answer first:** the opening paragraph is a 40–80 word plain answer to the post's question. No preamble.
2. Clear H2s that each answer one sub-question; short paragraphs; one comparison or decision **table** where the topic allows.
3. Bromic engineering or product detail from data/product-facts.json, with the controls every time a heater is recommended.
4. A short "Frequently asked" section (3–5 questions, `### Question` + 1–3 sentence answers) where the post answers questions.
5. **Link up, don't compete:** link to the commercial owner page for the intent (from data/page-ownership.json: /outdoor-heaters/,
   the Electric or Gas category, the installation-type page, the PDP) and, where it fits, to Design Your Space
   (https://www.bromic.com/design-your-space/). Use full https://www.bromic.com/... links that exist in data/site-inventory.json.
6. A diagram where one would help: write `<div class="diagram">Diagram: what it shows</div>` (a brief for 454 Creative).
7. Length: 700–1,200 words for guides and explainers; 400–700 for podcast and news posts. Pithy beats long.

## Frontmatter (all fields)

```yaml
---
id: BLOG-07                      # the id given in your batch
type: blog
title: "Sentence-case title, the question or the promise"
slug: <the live slug, unchanged>
live_url: https://www.bromic.com/blog/<slug>/
action: keep-fix | rewrite | merge-target | convert
merges: [https://www.bromic.com/blog/<merged-slug>/]   # [] if none
audience: [RES]
stage: [CO]
cell: RES-CO
asset: A24
summary: "One or two sentences: what the reader gets."
primary_keyword: ...
secondary_keywords: [...]
ai_prompt: "The question as someone would ask an AI assistant"
meta_description: "<=155 chars"
cta: {label: "...", asset: A07}   # exactly one, the next-stage asset for the cell (data/journey-matrix.json)
hero: w-...                       # image id from images/library/manifest.json
owner_review: Megan Spies         # editorial; Brian Kim for SEO-led posts
technical_reviewer: Mike Clifford # product/engineering check (AEO template)
last_reviewed: 2026-10-29
status: draft
gated: false
related: [RES-CO-01]              # 1–4 ids of Hub items (content/**) this links to
updated: 2026-10-29
sources: [...]                    # every number and every bromic.com page used; verified per writer-brief
---
```

## Hard rules (the tests fail on these)

Controls named whenever a heater is recommended, never "optional"; Tungsten Coastal and Select "(coming soon)"; never the retired
"300/500 series" numbers (name gas heaters by size or output); no Tungsten gas BTU; no exclamation marks, no emoji; code or
permit content carries the local-authority and licensed electrician/gas fitter line with a primary source; competitors only with
`needs_approval: Shaughn Ritchie`. **Podcast and interview posts:** never put words in a guest's mouth. Paraphrase what the live
post says they said; a direct quote only if WebFetch returned it word for word, and then add `[[VERIFY: quote wording against
the episode — Megan Spies]]`. Unverified testimonials are not used.

Write ONLY your assigned files in content/blog/ (file name `<id>-<slug-shortened-to-60-chars>.md`) and your open-questions log
reviews/open-questions/blog-<batch>.md (| item id | question | suggested owner |). Do not run git.
Check: `cd /home/user/Bromic_Marketing/app && node scripts/build.mjs --check && node test/content.mjs` — 0 errors and 0 failures
for your files (fix warnings on your files too: opening 40–80 words, reviewer fields, meta length).
Reply in <=120 words: files, word counts, sources verified/unverified, top open questions.
