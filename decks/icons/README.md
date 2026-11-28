# Bromic icons

Sixty line icons for training decks and the content hub, drawn in the language of the products:
slim linear heaters, hairline rules, white space and one flame of colour.

Files: `svg/<name>.svg` (ink version), `icons.json` (name, label, group), `sheet.png` (every icon at 64 px,
on white and on ink). The icons are authored in `icons.src.mjs`; `node build.mjs` (with `NODE_PATH` reaching
`sharp`) writes the SVGs, the JSON and the sheet, and fails if any icon has more or fewer than one flame element.

## Colours

| Role | Hex | Use |
|---|---|---|
| Ink | `#231F20` | every stroke on a light background |
| Flame | `#EF4123` | the one glow element in each icon, on any background |
| Steel | `#71777D` | labels and captions beside icons (never inside an icon) |
| White | `#FFFFFF` | replaces ink on dark backgrounds |

Dark-background variant: replace `#231F20` with `#FFFFFF` in the file. The flame stays `#EF4123`.

## The rules (the set's DNA)

1. **Grid.** 48 × 48 viewBox, 2 px padding: nothing drawn outside 2–46.
2. **Stroke.** 2 px ink, square linecaps, miter joins, `fill="none"`. No fills except the accent.
3. **Geometry.** Straight lines, right angles and 45°, like a linear heater and its bracket. Circles only where
   the object is round (Eclipse disc, dial, clock, power symbol, bulb, reel). No rounded rectangles except a phone.
4. **The glow.** Every icon carries exactly ONE flame `#EF4123` element: a short 3 px bar for the heating element,
   or 2 px radiant lines, arrows or a mark for the key point (the clearance, the hidden wire, the dimmer level).
   It is what makes the set Bromic. Never two flames, never none.
5. **Heaters are drawn as they are installed.** A heater is a slim box with the glow inside it, level under a
   ceiling, on a post or on a pole; tilted only on a wall bracket (to 45°). Never a box heater angled off a wall.
6. **Sparse.** If a detail disappears at 28 px, it goes. No lettering or digits.
7. **No containers.** No background discs, circles or tiles behind an icon.
8. **One family.** Similar things share parts: the heater body, hatched ceilings and walls, the floor line.

## Using them

- In PowerPoint: insert the SVG (Insert › Pictures); keep it at 24–64 pt; do not recolour the flame.
- Pair an icon with a Didot headline or a Helvetica Neue Light label in steel; never put an icon in a coloured circle.
- Minimum size 28 px (about 21 pt).
