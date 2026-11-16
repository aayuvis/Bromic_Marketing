# Bromic voice and type (read 15 Nov 2026 from bromic.com and the Lookbook 2026)

Every Hub screen, PDF and draft is written and set the way Bromic writes and sets its own material. This guide replaces the
earlier "sentence case, Georgia" rule.

## How Bromic sounds

| Bromic line | Where | What it shows |
|---|---|---|
| Extend The Moment | bromic.com home | Short display line, every word capitalised |
| Durability meets power. | Tungsten Electric page | Two to four words, a full stop, no verb clutter |
| You create beautiful spaces. We know how to heat them. | Partner Program page | "You" for the reader, "we" for Bromic |
| Heat You Can Feel, Not See. | Lookbook 2026 | The brand promise as a headline |
| Designed To Fit. Built To Perform. | Lookbook 2026 | Paired short sentences |
| Built For Life By The Water. | Lookbook 2026 (Tungsten Coastal) | The setting, then the benefit |
| Engineered for Thermal Efficiency | Architects and designers page | "Engineered" for trade audiences |
| Not sure which heaters are right for your outdoor space? | bromic.com home | A plain question leads to the design service |

**Rules we take from it**
- **Headlines:** short, every word capitalised (the Hub and PDFs do this in CSS). Collection names in wide-tracked capitals: TUNGSTEN, PLATINUM, ECLIPSE.
- **Body:** "you" and "your outdoor space"; "we" and "our" for Bromic. One idea a sentence. US spelling on US pages.
- **Words Bromic uses:** engineered, precise directional heat, infrared, radiant, year-round, season after season, design-focused, premium, seamless, outdoor space, outdoor living, tailored.
- **Product names:** collection, then Smart-Heat with its mark, then the type: Tungsten Smart-Heat® Electric, Eclipse Smart-Heat® Freestanding, Affinity Smart-Heat® Dimmer Controller. Controls appear as "Recommended Controls & Accessories".
- **Buttons:** capitals, a verb first: REQUEST YOUR DESIGN PLAN, MEET YOUR BROMIC REP, EXPLORE HEATER COLLECTIONS.
- **Punctuation:** en dash ( – ) in running copy, never the long dash. No exclamation marks in body copy.
- **What Bromic does not do:** name competitors, say "best" or "unmatched" without proof, write "not X, but Y" flourishes, write in threes for rhythm, or explain itself ("Here is where…", "In this guide we will…").

## How Bromic looks (Lookbook 2026 fonts: Didot, Helvetica Neue Light and Medium)
- **Display:** Didot (GFS Didot bundled where Didot is missing), regular weight, every word capitalised.
- **Body:** Helvetica Neue Light; Medium for emphasis. Labels in small spaced capitals.
- **Colour:** white pages, ink #231F20, steel greys, flame #EF4123 for small labels and rules only. Photographs full-bleed and warm.
- **People:** the Hub names teams (data/team-roles.json), never staff.


## The dry voice we are replacing (owner, 16 Nov 2026)

The owner's example of what has to go: "Every Bromic project, tagged the way sales sells it." It is accurate, clipped and cold: a
list of facts told to a colleague. Bromic writes to a person about an evening outdoors, and only then about the engineering.

| Not this (dry, mechanical) | Write this (Bromic) |
|---|---|
| Every Bromic project, tagged the way sales sells it | Spaces We've Brought To Life |
| The patio is standard. Heat is the gap. | Most new homes now come with a patio. Far fewer come with the warmth to enjoy it once the sun goes down. |
| Heat is what lets them stay out. | Radiant warmth turns a cool evening into one more hour around the table. |
| Voltage. Tungsten runs on 208 V and 240 V. | Tungsten Smart-Heat® Electric is engineered for the supply you already have, from 208 V and 240 V homes to 277 V commercial buildings. |
| Controls are part of every heater. | Every Bromic heater is paired with Affinity Smart-Heat® Controls, so the warmth is always exactly where, and when, you want it. |
| What we see go wrong on outdoor jobs | Getting It Right The First Time |
| Calculators that qualify the lead | Plan Your Space |

**Write like this**
- **Open with the moment, then the proof.** The evening, the table, the view, the guests staying longer; then the product, the number and the source.
- **Warm, confident, polished.** Premium design language: crafted, engineered, seamless, refined, effortless, precise directional heat, year-round, season after season, your outdoor space, outdoor living. Use them where they are true; never stack them.
- **Let sentences breathe.** Mix one short display line with sentences of 15–30 words. Not a string of five-word statements.
- **Speak to the reader.** "You" and "your space"; "we" for Bromic. Never "the reader", "content", "asset", "piece" or "lead" in reader-facing copy.
- **Headings are invitations, not labels:** "Designed Around The Way You Entertain", not "Placement rules".
- **Avoid the machine tells:** "X, not Y" antitheses; triplets for rhythm; one-word sentences ("Simple."); colon openers ("Voltage. …", "The fix: …"); "Here is…", "In short", "That's the gap"; rhetorical questions answered at once; long dashes.

**What never changes when the voice changes**
Every fact, number, product name, `[^sN]` citation, `[[VERIFY: …]]` note, image line `![…](img:…)`, link, table value, FAQ answer,
controls statement and disclaimer stays, with the same meaning. A table stays a table. Front matter stays, except `title`, `summary`,
`dek` and `meta_description`, which follow the new voice (meta 155 characters at most; keep the primary keyword in title and meta).

## Checks
`app/test/content.mjs` warns on a long dash in body copy and on an exclamation mark. Fix the line; do not silence the warning.
