# Bromic Marketing — Content & MQL Asset Base

The content repository for **Bromic Heating** marketing, organised by **lifecycle** (Awareness → Consideration → Intent →
Pre-purchase → Buyer), **audience** (Homeowner · Architect · Builder · Commercial operator) and **type** (article ·
knowledge base · gated guide · report · stats page · spec kit · sales kit · case study · tool), with the **Bromic Content
Hub** app to browse, review and export it.

Every claim is mapped to a source; every unknown is a visible `[[VERIFY]]` with an owner. Nothing here is published —
these are review-ready drafts. Brief: [HANDOVER.md](HANDOVER.md). Standing rules: [CLAUDE.md](CLAUDE.md).

## Open the Content Hub

**Online:** <https://aayuvis.github.io/Bromic_Marketing/#/home> (public to anyone with the link, not indexed; `cd app && ./deploy.sh` republishes).

```bash
cd app && npm install && npm run build
open dist/index.html          # works from file://, no server needed
```

Tabs: **Overview** (coverage heat-map, backlog, stats) · **Library** (filter by lifecycle, audience, type, access, status) ·
**Journey** (the 20-cell buyer map: pain, opportunity, AI prompt, keywords, MQL asset) · **Backlog** (A01–A24) ·
**Tools** (sizing, TCO, ROI calculators) · **Images** (tagged library) · **Sources** (every citation, verified or not) · **bromic.com** (the live site read page by page: coverage by journey cell, issues, case studies by market) ·
**Review** (status, flags by reviewer, open questions). Each item exports WordPress-ready HTML with FAQ and Article JSON-LD.

## Layout

```
content/
  articles/      A24 anchor articles, one per journey cell (<cell>-01-<slug>.md)
  kb/            knowledge-base answers
  guides/        gated guides — A02 Planning Guide v2 (3 editions), A12, A16
  kits/          A11 Architect Spec Kit
  sales/         A15 Builder programme + Good-Better-Best
  reports/       A01 Trends 2026 corrections + AI-citable stats page
  case-studies/  template, interview guide, consent checklist, candidates
  tools/         content cards for the calculators
tools/           A03 sizing · A20 TCO · A21 ROI (index.html + config.json + logic.js + test.mjs)
data/            product-facts.json · journey-matrix.json · assets.json
images/
  inbox/         ← DROP BROMIC IMAGES HERE, then: python3 scripts/ingest_images.py
  library/       web-ready webp + manifest.json (source, page, product, audience, rights)
sources/         the three Bromic PDFs (read-only) + their text; sources/web/ after a bromic.com harvest
forms/           HubSpot form spec + lead scoring
reviews/         open questions (per writer), review log
scripts/         seed_images.py · ingest_images.py · fetch_bromic.mjs · gen_images.py
app/             the Content Hub (build script, src, tests)
```

## Add or change content

1. Copy the frontmatter from [templates/content-schema.md](templates/content-schema.md).
2. Write; cite with `[^s1]`; flag unknowns `[[VERIFY: what — owner]]`; images `![alt](img:<id>)`.
3. `cd app && npm test` — schema, citations, controls rule, coming-soon rule, legacy naming, CTA, disclaimers, tool tests.

## Images

Preference: bromic.com → Bromic asset library → Bromic publications → generated. Generated images are rare, owner-approved,
labelled `generated`, and never show a Bromic product other than as it really is and is really installed.
