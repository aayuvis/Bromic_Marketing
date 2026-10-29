# Content schema — every item in `content/`

One Markdown file per item, YAML frontmatter + body. The Content Hub (`app/`) and `npm test` read these fields.
File name: `<id>-<slug>.md`, in the folder for its type:

| type | folder | what it is | gated |
|---|---|---|---|
| `article` | `content/articles/` | SEO/AEO anchor article (A24), one per matrix cell, 900–1,600 words, pithy | no |
| `kb` | `content/kb/` | Knowledge-base answer: one question, answered in 200–450 words, a table or checklist | no |
| `gated-guide` | `content/guides/` | PDF gated MQL resource, written as Markdown source for 454 Creative to lay out | yes |
| `report` | `content/reports/` | Research report or its corrections/QA | mixed |
| `stats-page` | `content/reports/` | HTML stats page built to be cited by AI search (one stat per H2) | no |
| `spec-kit` | `content/kits/` | Specification resources: CSI 3-part spec, coverage tables, detail lists | yes |
| `sales-kit` | `content/sales/` | One-pagers and programme guides for trade | yes |
| `case-study` | `content/case-studies/` | Customer story — **only with a real, permissioned customer**; otherwise a template | no |
| `tool` | `tools/<id>/` + a `content/tools/` card | Interactive calculator / specification tool | teaser + gate |

## Frontmatter

```yaml
---
id: BLD-IN-01              # articles/kb: <cell>-<nn>; assets: A16, A11-spec, …
type: article
title: "Pre-wiring a patio for outdoor heaters: rough-in checklist for builders"
slug: pre-wire-patio-outdoor-heaters
audience: [BLD]            # RES ARC BLD COM
stage: [IN]                # AW CO IN PP BY  (lifecycle)
cell: BLD-IN               # primary journey-matrix cell
asset: A24                 # the backlog asset this item IS (A24 for anchor articles)
summary: "One or two sentences: what the reader gets."
primary_keyword: pre wire patio heater
secondary_keywords: [patio heater wiring, outdoor heater rough in]
ai_prompt: "What wiring should I rough in for patio heaters?"
meta_description: "<=155 chars"
cta: {label: "Download the pre-wire guide", asset: A16}   # exactly one
hero: l-010-067            # image id from images/library/manifest.json
images: [l-005-022]        # optional extra image ids used in body as ![alt](img:ID)
owner_review: Arvin Avaness
status: draft              # draft | in-review | approved | published
gated: false
related: [BLD-PP-01, ARC-IN-01]   # 2–4 internal links (ids)
updated: 2026-10-29
sources:
  - id: s1
    publisher: National Association of Home Builders
    title: "Builder Practices Survey"
    year: 2024
    url: https://www.nahb.org/...
    supports: "61.8% of new single-family homes include patios"
    verified: true         # true only if you opened/read the source this session (search result counts if the snippet states it)
  - id: s2
    publisher: Bromic
    title: "Lookbook 2026"
    year: 2026
    url: sources/Bromic_Lookbook_2026.pdf
    supports: "Platinum coverage 65–143 ft²"
    verified: true
---
```

## Body conventions

- **First 2–3 sentences answer `ai_prompt` directly.** No throat-clearing.
- H2s are the questions people actually ask.
- At least one Markdown table.
- Cite with `[^s1]` right after the claim. Every number that is not a Bromic product fact needs one.
- Unknowns: `[[VERIFY: what is needed — owner]]`. Diagrams for layout: `[[DIAGRAM: description]]`.
- Images: `![alt text](img:l-005-022)`.
- Internal links: `[text](item:BLD-PP-01)`; asset links: `[text](asset:A16)`.
- A `## Key takeaways` or `## Planning checklist` block.
- Articles end with `## FAQ` holding 4–6 `### Question?` + answer pairs. The Hub generates the `FAQPage` JSON-LD from them.
- No CTA text in the body except one closing line; the `cta` field drives the button.
- Product recommendations name the controls (Affinity On/Off, Dimmer or Eclipse controller, wall switch, app; Wi-Fi/app features
  need compatible Affinity controls, sold separately).
