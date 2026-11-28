# Training decks: design language v2 (owner, 28 Nov 2026)

The owner: "looks like Claude did it… not natural… the iconography is claudy… nice design elements from the PDFs are not taken."
The decks now follow the white papers (reports/white-papers/pergola-2027-umph, see its PDF): nothing in a deck should look like a template.

**Never**
- Generic icons, icon discs, emoji (`ico()`, the old Lucide call, draws nothing; delete every call).
- An icon on every line or every card. Icons are seasoning, not structure.
- Grids of identical grey cards. Rounded shapes. Pink circles. Drop shadows. Gradients other than the photo shade.
- A label + one-line-description repeated in boxes as the whole slide ("feature tiles").
- Indents or gaps left where an icon was.

**Use (all in lib.js)**
- The Bromic icon set (decks/icons, owner: "a Bromic style unique iconography"): `icon(s, 'mount-pitched', x, y, 0.55)`, `{ dark: true }` on ink or photos. Line drawings with one flame glow, placed bare (no disc, no box), top-left of a column above its rule or beside a heading. Use one where it adds meaning (a mounting type, a control, a space), never as decoration on every item.
- Didot headlines (Bodoni MT), Title Case. A flame italic accent word with `*word*` in a title: use sparingly, on covers, dividers and a few big statements.
- Kicker: small flame letter-spaced caps above the title (the layout does it).
- `stat(s, '51%', 'label', x, y, w)`: big Didot figure in flame over a hairline rule, its line underneath. The PDFs' signature.
- `num(s, 1, x, y)`: Didot numerals 01, 02… for steps, lists, sequences, under or beside a `rule()`.
- `rule(s, x, y, w)`: hairline over each column, step or block (the PDFs head every column with one). `card()` with the grey fill now draws only this rule.
- Ink panels (`card(..., HEX.INK)`) for the one thing that matters on a slide; the wash `HEX.WASH` for an action box, as the PDFs' "Action plan".
- Photographs: large, full-bleed or a half page, never small thumbnails in a row unless it is a gallery. Product renders and cut-outs on white (`'contain'`), several side by side like the PDFs' range pages.
- Tables with a dark header row (ink fill, white text) and hairline rows, for specs and comparisons.
- Quotes: Didot, larger, with the speaker's role in small steel caps.
- Captions: 10–11 pt steel under photos.

**Type sizes**: title 32 (layout); body 14–16 Arial; stats 54–72 Didot; numerals 18–30 Didot; captions 10–11.

**Keep**: every fact, number, source and speaker note as it is; controls with every heater; competitors unnamed; no Btu for Tungsten gas; no people's names.

Build: `cd decks/training && NODE_PATH=$PWD/node_modules node <deck>.js`, then `python3 decks/training/slides.py <File>` for the Hub viewer.
