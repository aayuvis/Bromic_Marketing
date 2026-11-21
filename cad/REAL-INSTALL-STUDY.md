# How Tungsten Electric is really installed: a study for the Series II image set

Written 21 Nov 2026 for the Tungsten Series II (Select, Coastal) CAD-composite set, after the owner rejected the generated set:
*"a central pillar in different settings with a forward-facing heater… is hardly ever the install"*.

**Sources studied**
- All 38 real installation photos in `cad/backgrounds/tungsten/`.
- 70 further real Tungsten Electric photos in `images/library/`. These are the `w-`, `d-` and `v-` ids that are not duplicates of the bank; Lookbook renders, CGI and product shots are excluded.
- The Lookbook 2026 pages (`l-0xx`) for intent only. They are Bromic's own lifestyle renders, not installs.
- The Series II installation manual and the low-clearance (LC) recess kit instructions.
- The Series I US manual.
- Bromic's YouTube channel (titles, descriptions and stills).
- Bromic's blog pages on mounting.
- The Series II launch framework (`data/product-marketing/tungsten-electric-series-ii.json`).
- The 44 images now in `data/image-review.json`.

Every photo named below was looked at, either in a contact sheet or in a crop.

---

## 1. What went wrong in the rejected set

The 43 pending images in the review queue (`ts2-ai-01` … `ts2-ai-50`) were checked against the real photos. 37 of them share one composition. 33 of those are image-model scenes; 3 are composites on real photos, and so is the café wall the owner approved.

**The rejected composition**
- The camera stands **outside** the covered space, on the axis of symmetry, and looks in, in one-point perspective.
- There is **one** heater, centred left to right on the front header beam or on a free-standing pier wall.
- The heater is level and seen square-on.
- Its glowing face points **at the camera**: out of the room, toward the open side and the sky, away from the seats behind it.

**The real photos do almost the opposite**
- The camera is inside or at the edge of the seating, usually looking out toward the view, at 3/4.
- The heaters sit along the edges of the covered area, usually in pairs or rows, high in the frame.
- They are seen from below and at an angle.
- Each heater's face is tilted toward the seats.

Only two cases show a glowing face from outside the room:
- **Commercial frontages** (`img-13962`, `img-14041`, `w-tungsten-electric-wall-mount-2`, `w-tungsten-electric-aquitaine-brisbane`). There the seats are outside on the pavement, so the heaters face out at them.
- **A heater on the front beam of a pergola, shot from inside** looking out (`lumen-west-…`, `strx-230222-…`). Here the face points back into the pergola, toward the camera and the seats.

**None of the 108 real photos shows a lone heater centred on a beam, facing out over empty ground with the seating behind it.**

The fix is not better rendering. It is a different layout and a different camera.

---

## 2. Install archetypes and how often they appear

**How the photos were counted**
- The **bank** column counts the 38 photos in `cad/backgrounds/tungsten/`. Each photo has one main archetype.
- The **library** column counts the 70 further real photos in `images/library/`. Duplicates of the bank are excluded, as are renders and the dimension drawing.
- Codes A–I are used in the rest of this document.

| Code | Archetype | Bank (38) | Library (70) | Total |
|---|---|---|---|---|
| **A** | Wall-mounted on a vertical wall, facade or fascia, angled down over seating or a doorway | 2 | 15 | 17 |
| **B** | On the **perimeter beam** of a pergola, canopy or patio cover, along the open side, facing inward | 7 | 14 | 21 |
| **C** | **Ceiling-mounted near the edge** on its bracket (a short post), parallel to the edge, tilted into the space | 2 | 7 | 9 |
| **D** | **Recessed** flush in a flat porch ceiling or soffit, in a row parallel to the house wall or edge | 4 | 11 | 15 |
| **E** | **Suspended** on drop poles or rods from a high, vaulted or slatted ceiling or pergola rafters. Series I uses twin tubes. | 14 | 17 | 31 |
| **F** | High on the **glazing frame** or transom of a glass pavilion, angled down into the room | 3 | 1 | 4 |
| **G** | **Commercial frontage rows**: cantilevered or bracket-mounted along an enclosure fascia or rail, one per table bay | 4 | 0 | 4 |
| **H** | On a **free-standing post** (pole from the floor or a planter), at a balustrade edge | 0 | 5 | 5 |
| **I** | **Hung on chains** from a pergola beam (an old install, not a Bromic mount) | 1 | 0 | 1 |
| — | No heater legible | 1 | 0 | 1 |

### Files per archetype

**A. Wall**
- Bank: `bromictungstenelectic-white`, `tungsten-2`.
- Library:
  - `w-black-tungsten-electric-mounted-chicago`;
  - `w-bromic-ambiente-sedona`, `-11`, `-12`, `-14`, `-16`, `-17`;
  - `w-dsc07397-1`, `w-juneau-showhome-1`;
  - `w-tungsten-electric-dalloway-terrace-london`, `-studio-city-4`, `-wall-mount-2`, `-wall-mount-london-uk`, `-wall-mount-paris-bar-londo`;
  - `v-catch-the-wave-beloit-1`.
- YouTube: `qYAsLZ8SEIA` stills (house wall under the eave, over a seating area).

**B. Perimeter beam**
- Bank: `240619-yorba-linda-ca-dc-64`, `img-1256`, `kion-sui-madrid-…-5`, `lumen-west-la-rooftop-…`, `strx-230222-bromic-dc-6`, `vbb7418`, `vbb7428`.
- Library:
  - `w-bromic-tungsten-electric-patio-heater`;
  - `w-delmonico-08`;
  - `w-gazebo-bromic`, `w-img-0194`;
  - `w-gno-2`;
  - `w-kion-sui-madrid-…-4`;
  - `w-louisian-purchase-2`;
  - `w-pov-terrace-dome-bar5`;
  - `w-tungsten-electric-aquitaine-brisbane`, `-melrose-place-…`, `-new-york-residential`;
  - `w-w-hotel04`;
  - `v-catch-the-wave-beloit-2`;
  - `v-mughet-saint-hippolyte-1`.
- YouTube: `3dEfUr7Y34w` stills (canopy perimeter beam, Clínica Las Condes).

**C. Ceiling, near the edge**
- Bank: `argentina-residential-2`, `argentina-residential-5`.
- Library:
  - `w-ar-homes-4118-opt`;
  - `w-elm-ave-11-thumb`;
  - `w-pink-monkey-madrid-spain2`;
  - `w-tungsten-electric`;
  - `w-tungsten-electric-ceiling-mounted-chile`, `-marylebone-hotel-london`, `-wall-mount-canada`.

**D. Recessed**
- Bank: `bromic-tungsten-electric-black-recessed`, `bromic-tungsten-electric-residential`, `private-residence-tungsten-1`, `private-residence-tungsten-3`.
- Library:
  - `w-connecticut-…` ×3;
  - `w-img-6955`;
  - `w-intercontinental-la-…` ×2;
  - `w-private-residence-tungsten-2`;
  - `w-sydney-residential-…-2-2`;
  - `w-tungsten-electric-white-recessed` ×2;
  - `w-tungsten-outdoor`;
  - `v-troon-north-1` (ceiling cut-outs before install).

**E. Suspended**
- Bank:
  - `bromic-sep18th-14`, `img-0661`, `white-tungsten-electric-hive-and-honey-1`;
  - `dsc000111`;
  - `dsc05545`, `dsc05656`, `dsc05715`, `dsc05737`;
  - `mom-design-build-2-web`;
  - `smoque-n-bones-…-1`, `-2`;
  - `the-ivy-london-…`;
  - `vbb7479`, `vbb7509`.
- Library:
  - `w-bromic-tungsten-electric-outdoor-heaters-in-`;
  - `w-crown-towers-perth-…`;
  - `w-ctkeakiveamtj6o`;
  - `w-georges-paragon-…`;
  - `w-img-9924-…`;
  - `w-tungsten-electric-courtney-thompson-1`;
  - `w-tungsten-electric-kansas-bar-grill-…` ×3;
  - `w-tungsten-electric-oberoi-hotel-delhi-1`, `-tonys-bar-brooklyn-ny-1`;
  - `w-tungsten-electric-bromic-pinkhill-524`, `-547-1`;
  - `w-yvone-haber-bronte-house-1`;
  - `v-lambeau-alumni-terrace-1`, `-2`;
  - `v-mughet-blainville-1`.

**F. Glazing frame**
- Bank: `2014-01-29-17-10-54`, `e-tungsten-1`, `tungsten-3`.
- Library: `w-printrestaurant-tungstenelectric-02`.

**G. Commercial frontage rows**
- Bank: `img-13962`, `img-14041`, `dsc000071`, `dsc000141`.

**H. Free-standing post**
- Library: `w-23-03-12-bromic-heating-hyatt-dehradun-14`, `-49`, `-52`, `-85`, and `d-tungsten-pole-rooftop-bar`.

**I. Chains**
- Bank: `dsc00012`.

**No heater legible**
- Bank: `industrie-apartments-exterior`.

### Position in the space

Of the 107 real photos with a legible heater, about **85 place every heater within about 1 m of an edge line.** An edge line means:
- a wall;
- a perimeter beam;
- a glazing line;
- the fascia of a frontage.

The rest fall into two groups.

**Rows down the middle of a long, narrow space**, one heater wide over a central line of tables or a walkway:
- `the-ivy-london`;
- `dsc000141`;
- `vbb7479`;
- `marylebone`.

**Grids or rows in large commercial rooms**, where each heater sits over a table zone or bar:
- `vbb7509`;
- `bromic-sep18th-14`;
- `pinkhill-547-1`;
- `kion-sui-5`;
- `dsc000111`;
- `lambeau`.

In each of those, the heaters still follow the beams and come in rows of two or more.

**Not one real photo shows a single heater in the middle of a residential ceiling, or a single heater facing the camera across the room.**

---

## 3. Each archetype in detail

For each: where the heater sits, its long axis, its tilt and facing, its height, the count and spacing, what the mount looks like, and how real photos frame it.

### A. Wall-mounted (17)

**Where**
- On the house wall or facade under the eave or soffit, above a window head, door or banquette, over the seating that is against or in front of that wall.
- Usually 0.2–0.6 m below the soffit, often centred over a door, a window or the seating group.

**Long axis.** Parallel to the wall, level.

**Tilt and facing**
- Angled down and out from the wall toward the seats.
- The real tilt is visible in `studio-city-4`, `sedona-11/12` and `tungsten-2`: about 20–45° from vertical. The manual allows up to 45° for 2/3 kW and 30° for 4/6 kW.
- The heater **never** faces up or along the wall.
- The cantilevered wall adaptor puts it face-down, 355 or 450 mm out from the wall.

**Height.** Above 1.8 m (71 in) by the manual. In practice 2.2–2.8 m.

**Count and spacing**
- 1 over a single seat group (`bromictungstenelectic-white`, `studio-city-4`, `chicago`).
- 2–3 along a long wall (`dsc07397-1`, `catch-the-wave-1`), evenly spaced at the same height.

**Mount.** A short angled bracket into the wall, mostly hidden behind the body when seen from below or the front.

**Camera**
- From the seating or the garden at eye level or a little below, looking at the wall at 3/4 or front-on.
- The heater fills 8–25% of the frame width.
- `bromictungstenelectic-white` is the front-on exception, and is the approved `ts2-photo-01` look.

### B. Perimeter beam of a pergola, canopy or patio cover (21)

This is the most common residential and hospitality pattern.

**Where**
- On the inside face or underside of the outer beam, along the open side, or along the side beams.
- The heater is just inside the covered edge, over the outer row of seats or the dining table.
- On louvred pergolas (`vbb7428`, `kion-sui-4`, `yorba-linda`, `gazebo-bromic`), it goes on the perimeter beam or a structural beam, never on the louvres.

**Long axis.** Parallel to the beam.

**Tilt and facing**
- Tilted **inward**, toward the seats under the cover (`vbb7428` shows a run of them at about 30°, `kion-sui-4` and `smoque`).
- Level and face-down where the beam is right over the table (`gno-2`, `delmonico-08`).
- **Never tilted out toward the open side.**

**Height.** 2.4–3 m: the beam soffit, less the 9–13 in bracket.

**Count and spacing**
- In pairs or rows of 3–6, one per bay, evenly spaced, the same angle each.
- `gno-2`: 2 over one table. `aquitaine`: 3 along a frontage. `kion-sui-5`: 2 per beam, mirrored.

**Mount.** The angled bracket on the beam face, or a short post under the beam.

**Camera**
- From inside, under the cover, looking out past the seats to the view (`lumen`, `strx`, `kion-sui-5`, `gno-2`), with the heaters in the top 10–25% of the frame. Or from 3/4 outside, where the heater's back and edge show and its glow is a sliver (`yorba-linda`, `gazebo-bromic`).
- Close-ups are shot from below the beam (`vbb7428`, `kion-sui-4`, `w-bromic-tungsten-electric-patio-heater`).

### C. Ceiling-mounted near the edge (9)

**Where**
- On a flat ceiling or slab, 0.3–1 m in from the open edge, the glazing or the side wall. The manual's diagrams show it 12 in (2/3 kW) or 18 in (4/6 kW) from a wall.
- Positioned to throw heat in over the table or lounge.

**Long axis.** Parallel to the nearest edge.

**Tilt and facing**
- Tilted away from the edge, toward the seats: `argentina-residential-2/5`, `chile`, `pink-monkey` and `elm-ave` at about 15–30°.
- The manual limits a ceiling-mounted 4/6 kW to 30°.

**Height.** 2.4–3 m to the heater, with a minimum of 96 in (2.4 m).

**Count and spacing**
- 1 per seat group, or a row along the edge (`marylebone`).
- `wall-mount-canada` shows several around the perimeter of a gazebo, all facing in toward the lounge and fireplace.

**Mount**
- The heater hangs from the short ceiling bracket: 5 in (130 mm) for 2/3 kW, 9.5 in (240 mm) for 4/6 kW.
- On Series II this is the single post.

**Camera.** From the seating at 3/4. The heater is seen from below at an angle, so its face shows.

### D. Recessed (15)

**Where**
- In a flat porch, cabana or soffit ceiling, usually a **row of 2–3** parallel to the house wall.
- About mid-depth of an 8–12 ft porch, over the seating line (`connecticut`, `white-recessed`, `private-residence-2/3`).
- Or near the outer edge of a deep soffit (`sydney-residential`, `intercontinental`, `black-recessed`).
- `img-6955` is the one symmetric pair, either side of a ceiling fan, in a square cabana.

**Long axis**
- Parallel to the house wall or the open edge, and with the ceiling boards and joists.
- The recess box fits between joists with a gap of at least 10 in (255 mm).

**Tilt and facing.** None: flush, face down.

**Height**
- Ceiling height, 2.4–3 m.
- The LC kit needs at least 94 in (2.4 m) above the floor, 500 mm from any wall, 500 mm between cut-outs, and 200 mm at the terminal end.

**Count and spacing.** Rows of 2–4, evenly spaced, the same line. Never a lone recessed heater in a large ceiling.

**Mount**
- Only the trim shows.
- The LC kit's trim is 283 mm wide by 1,624 mm long for the 3/6 kW.
- The terminal or vent end goes at the lower end of any slope.

**Camera**
- Under the porch looking along it, with the row receding into perspective (`white-recessed`, `connecticut-2`).
- Or from the garden at 3/4 (`connecticut-1`, `private-residence-3`), where the heaters are thin glowing lines.

### E. Suspended under high, vaulted or slatted ceilings (31)

**Where**
- Under vaulted porch ceilings (Courtney Saib: `dsc05656`, `dsc05715`, `dsc05737`, `courtney-thompson-1`).
- Under pergola rafters and louvres (`smoque`, `mom-design`, `vbb7509`, `the-ivy`).
- Under concrete canopies (`kansas` ×3) and restaurant ceilings (`pinkhill`).

**Position**
- Residential: near the side edges or over the seat group, **never centred on the room alone**.
  - Courtney Saib's two heaters are each near a side edge, one over the sofa end and one by the fireplace wall.
- Commercial: in rows over the table lines.

**Long axis.** Parallel to the main beam, rafter or eave line.

**Tilt and facing**
- Level or tilted toward the seats.
- `smoque` and `kansas` are angled about 20–30°, all one way, toward the tables.

**Height.** Brought down to 2.4–2.8 m. Bromic's blog: "between eight to nine feet from the floor".

**Count and spacing.** 2+ in residential (Courtney Saib: 2), 3–10 in commercial, evenly spaced.

**Mount**
- Series I shows **two** suspension tubes.
- Series II replaces them with **one** post. The 600 mm and 1,200 mm accessory poles are in the Series II manual.

**Camera**
- From the seating, looking across the room. The heater is in the top third, often near a corner (`dsc05656`).
- Close-ups from below (`dsc05545`).

### F. Glazing frame (4)

A heater on a mullion or transom high in a glass pavilion, angled down into the lounge, next to a corner (`e-tungsten-1`, `tungsten-3`, `2014-01-29`).

Seen from inside looking out at the view; the heater is top-left or top-right.

### G. Commercial frontages (4)

A row of 6–10 heaters on wall-mount adaptors along the fascia of a dining enclosure, facing **out** at the pavement tables (`img-13962`, `img-14041`). Or one per booth on rails inside (`dsc000071`, `dsc000141`).

The seats are outside, so the heaters face out.

### H. Free-standing post (5)

Heaters on floor or planter poles at a balustrade edge, facing in toward the tables (Hyatt Dehradun). This is not a Series II CAD mount, so it is out of scope.

### I. Chains (1)

`dsc00012` hangs a heater from a pergola beam on chains. It is not a Bromic mount, and the owner has ruled it out (M9).

---

## 4. What real installs almost never do

| Never or almost never | Evidence |
|---|---|
| **A lone heater centred on a ceiling or header, facing the camera, with the camera outside the room.** | 0 of 107 real photos. The 37 rejected review images are this composition. |
| **A heater facing the open sky or open side, away from the seats.** | 0 of 107. The manual says "face of heater angled down" and "not facing the ceiling". Where a face is seen from outside, the seats are outside too (frontages, G). |
| **A heater tilted toward the wall it hangs on, or pointing at a wall.** | 0. The manual's diagrams always tilt away from the nearest wall, into the room. |
| **A heater mounted vertically, or with its long axis up a slope.** | The manual says "DO NOT MOUNT THE HEATER VERTICALLY… elements are horizontal". On pitched ceilings, the adaptor makes the pole hang straight down and the heater level, in-line or cross-slope. |
| **A heater on glass, louvre blades or a free span of air.** | 0. Every one is on a beam, wall, frame, slab or post. |
| **A heater below head height or right over a door swing.** | Wall installs are 1.8 m or more, ceiling installs 2.4 m or more. Over doors they sit high on the wall (`wall-mount-paris`, `wall-mount-london`). |
| **A single recessed heater in a big ceiling, or a recess in a steep slope.** | Recesses come in rows of 2–4. The LC kit allows at most 1/4 in per 1 in (about 14°). |
| **Uneven rows (different heights, angles or spacing).** | Every multi-heater photo has equal spacing and matching angles. |
| **A heater pointed at a fire table, umbrella, curtain or awning fabric at close range.** | The manual requires 36 in to combustibles in front. Real heaters sit beside fire features (`sedona`, `chicago`), never over them. |
| **A symmetric, axis-on hero frame.** | Real photos are 3/4, from among the seats, or from below. Only `bromictungstenelectic-white` is front-on, and that is a wall with the camera at the seats. |

---

## 5. Series II specifics

### Mounts (Series II manual)

**Standard bracket (the single post)**
- 5 in (130 mm) for 2/3 kW; 9.5 in (240 mm) for 4/6 kW.
- Used for ceiling and wall.
- 4/6 kW must not be ceiling-mounted on the 5 in post.
- Straight (hole position B) or angled (position A).
- Tilt limits:
  - 2/3 kW: up to 45°.
  - 4/6 kW: 30° when ceiling-mounted ("DO NOT USE the outermost mounting hole").
  - The launch deck says 45° on every model: `tilt_verify` is open. **Use at most 30° for 6 kW in images.**

**Accessory poles.** 600 mm and 1,200 mm, in black, white or graphite. They let a high ceiling bring the heater down. This is the Series II replacement for the twin drop tubes of archetype E.

**Wall-mount adaptor (cantilevered)**
- 14 in (355 mm) out with a 5 in drop, or 18 in (450 mm) out with a 12 in drop.
- The heater faces down, long axis parallel to the wall.
- Archetype G uses it; so would an eave-line deck heater.

**Pitched-ceiling adaptor**
- For 3/12–12/12 (14–45°).
- The pole hangs **vertical**, and the heater is level, in-line with the slope or across it.
- This suits vaulted porches (Courtney Saib), gable pavilions (`delmonico-08`) and gabled patio covers (`catch-the-wave-2`).

**Clearances**
- 12 in (2/3 kW) or 18 in (4/6 kW) from the side wall.
- 9 in or 13 in below the ceiling.
- 20 in (510 mm) at least between heaters.
- 71 in (1.8 m) wall and 96 in (2.4 m) ceiling minimum to the floor.
- 36 in to combustibles in front.

### Low-clearance recess kit (LC kit instructions)

**Fit**
- Select (304 stainless, powder-coated) or Coastal (316 stainless, powder-coated, "Marine").
- Black or white trim.

**Cavity and cut-out**
- Minimum cavity 7.5 in (190.5 mm).
- Cut-out 61 × 10 in for 3/6 kW.
- Trim 283 × 1,624 mm.

**Placement**
- Between joists, so the heater's long axis runs with the joists or boards.
- At least 94 in (2.4 m) above the floor.
- 500 mm from the nearest wall.
- 500 mm between cut-outs.
- 200 mm clear at the terminal-box end.

**Slope.** At most 1/4 in per 1 in (about 14°, a 3/12 pitch), with the control box at the low end.

**Fans.** Integrated, so the trim shows a vent end.

### Select

- Black, white or graphite.
- Diamond Pattern fascia (also oval and triangle covers).
- In the launch messaging: "floating" on a single post with no visible junction box.
- Its best-fit settings are timber ceilings and pergolas, residential porches and outdoor kitchens. The launch copy is "beautiful against a timber ceiling" and "suits canopies and pergolas where ceilings are not flat".

### Coastal

- Black or white only: the Lookbook 2026 says "Available in Black or White".
- 316 marine-grade with a protective coating; a marine LC recess kit, IPX5.
- Meant for salt air: beachfront porches, ocean-view terraces, harbour and marina bars.

**Bromic's own Lookbook renders place Coastal under cover, on the soffit or beam edge and on walls:**
- `l-002-006` (two on the porch beam);
- `l-005-017`;
- `l-005-020` (wall);
- `l-005-022` (recessed);
- `l-005-024` (bar canopy).

The manual: "mount the heater under cover & protect from rain".

### Where the single post is used

The launch framework's claims are: "A single post replaces the two suspension tubes on pergolas and porches"; "suits canopies and pergolas where ceilings are not flat"; "floating on a single post with no visible junction box".

So the post is:
- the short drop from a beam or flat ceiling **near the edge**, angled up to 30° (6 kW) toward the seats;
- the vertical pole under a pitched-ceiling adaptor;
- with an accessory pole, the drop under high or vaulted ceilings.

**It is not a central pillar holding one heater in the middle of a ceiling.**

---

## 6. Shot plan: 20 Series II images modelled on real installs

**Ground rules for every image in this plan**
- Real background from the bank, with the old Tungsten replaced on the same mount. This keeps M0–M2 and M16.
- At least 2 heaters wherever the real photo had 2 or more.
- Faces toward the seats.
- Camera taken from the real photo, never re-staged on axis.

The mix is 14 residential and 6 hospitality: 8 Coastal and 12 Select, with Select split 5 black, 4 graphite and 3 white.

**CAD available (`cad/tungsten-select/`):** the angled wall mount, the ceiling post, the pitch adaptor and the recess kit. There is no 600 or 1,200 mm accessory pole yet; rows 4 and 7 need one.

**Coastal backgrounds.** The bank has no coastal real photo, and M2 forbids generated plates. Each Coastal row below is marked **(needs a coastal real photo)**.
- Use a Bromic-published coastal installation if the Marketing team can supply one.
- Otherwise use the nearest bank photo of the same install type, and label it Coastal only if the setting reads coastal.
- This is a decision for the owner.

| # | Setting | Collection and finish | Mount | Heaters: number, position, orientation | Camera | Modelled on |
|---|---|---|---|---|---|---|
| 1 | Residential screened porch, vaulted timber ceiling, fireplace | Select graphite | Single post on pitch adaptor, level | 2. One near the right eave over the sofa end, one near the fireplace wall. Each parallel to the eave line, face down. | From the armchair, 3/4 across the room; heaters top right | `dsc05656`, `dsc05737` |
| 2 | Same porch, close-up | Select graphite | Pitch adaptor and post | 1 heater fills 30–40% of the frame, angled view from below, logo legible | Low, from below the eave line | `dsc05545` |
| 3 | Concrete covered dining terrace beside a pool | Select black | Ceiling post near the slab edge | 1 over the table, 0.4 m in from the opening, parallel to it, tilted 30° in toward the table | Portrait, from the far end of the table looking out | `argentina-residential-2`, `-5` |
| 4 | Louvred-pergola outdoor kitchen and sunken lounge | Select black | Posts under the perimeter beam (needs the 600 mm pole if the beam is high) | 2–3 along the front and side beams, parallel, tilted in over the bar and lounge | Wide 3/4 from the lawn, as shot | `240619-yorba-linda-ca-dc-64` |
| 5 | Covered pool terrace, dark timber soffit | Coastal white (if the setting reads coastal), else Select black | LC recess | 3 in a row parallel to the open edge, at mid-depth, evenly spaced | Under the soffit looking out past the columns | `bromic-tungsten-electric-black-recessed`, `-residential` |
| 6 | White beadboard front porch, shingle house | Select white | LC recess | 3 in a row parallel to the house wall, over the wicker seating, 500 mm or more from the wall | Along the porch, row receding | `w-tungsten-electric-white-recessed`, `w-connecticut-…-2` (library; find a ≥ 2,560 px original) |
| 7 | Screened porch, vaulted timber, garden view | Select black | Pitch adaptor | 1 on the right eave side over the sectional, parallel to the eave | Seated, looking out through the screens | `dsc05715`, `w-tungsten-electric-courtney-thompson-1` |
| 8 | Café wall, set tables (the approved look) | Select white | Angled wall bracket | 1 centred over the tables, level along the wall, angled down | Front-on at seat height | `bromictungstenelectic-white` (= approved `ts2-photo-01`) |
| 9 | Rooftop bar entrance wall | Select black | Angled wall bracket | 1 above the planter beside the door, angled down to the path | 3/4 along the wall | `tungsten-2` |
| 10 | Glass rooftop pavilion, city view at dusk | Select black | Angled wall bracket on the glazing frame | 1 high on the corner transom, angled down into the lounge | Inside, looking out to the skyline | `tungsten-3`, `e-tungsten-1` |
| 11 | Residential pergola lounge, two people | Select graphite | Post on the front beam | 1 on the beam, parallel, face toward the sofa and camera | Inside the pergola, slightly low, portrait | `strx-230222-bromic-dc-6` |
| 12 | Rooftop workplace pergola | Coastal black (if a coastal photo is found), else Select black | Post under the front beam | 1–2 on the front beam, face inward | Inside, looking out | `lumen-west-la-rooftop-…-6-edite` |
| 13 | Louvred-pergola beam, detail | Select black | Angled bracket on the perimeter beam | Run of 3, same 30° tilt, inward | From below, along the beam | `vbb7428` |
| 14 | Restaurant louvred-pergola terrace | Select black | Posts on the beams | 2 per beam, mirrored, over the tables | From the dining room looking out | `kion-sui-madrid-spain-tungsten-electric-5` |
| 15 | Restaurant slatted-pergola patio | Select graphite | Posts with tilt, on the beams | Rows along the long beams, all tilted the same way over the tables | 3/4 down the patio | `smoque-n-bones-tungsten-electric-1`, `-2` |
| 16 | Garden restaurant under a long glazed pergola | Select white | Posts on the rafters | Row of 3 down the centreline over the central table line (narrow space, the one centre case) | Seated at a table looking down the run | `the-ivy-london-tungsten-electric` |
| 17 | Coastal beach-house porch over dunes | Coastal white **(needs a coastal real photo)** | Posts on the porch beam, or wall bracket under the eave | 2 on the beam, inside the open edge, tilted in over the seats | From inside the porch toward the sea, 3/4 | Layout from `strx`, `gno-2`; Lookbook intent `l-002-006` |
| 18 | Oceanfront terrace with a deep soffit | Coastal white **(needs a coastal real photo)** | LC recess (marine) | 2–3 in a row parallel to the soffit edge, over the lounge | From the lounge out to the water | Layout from `w-sydney-residential-…-2-2`, `black-recessed`; Lookbook intent `l-005-022` |
| 19 | Harbour or marina bar under a canopy | Coastal black **(needs a coastal real photo)** | Wall bracket on the bar back wall, or posts on the canopy edge beam | 3 along the bar, evenly spaced, faces toward the stools | 3/4 from the stools end | `bromic-sep18th-14`, `w-tungsten-electric-melrose-place-…`; Lookbook intent `l-005-024` |
| 20 | Coastal home wall under the eave, deck lounge | Coastal black **(needs a coastal real photo)** | Angled wall bracket | 2 on the house wall under the eave, over the deck seating, evenly spaced, angled down | From the deck steps, 3/4 | `w-dsc07397-1`, `w-juneau-showhome-1`; Lookbook intent `l-005-020` |

If coastal real photos cannot be found, do rows 17–20 as Select on their model photos and ask the owner how to show Coastal.

Pilot first (§10): **1, 3 and 6**. They give one each of pitch adaptor, ceiling post with tilt, and recess, all residential.

---

## 7. Proposed text for §4 of `cad/CAD-TO-REAL-REQUIREMENTS.md`

Add after M16:

> **M16a. Layout from a real install, never from symmetry.** Owner, 21 Nov 2026: a central pillar in different settings with a forward-facing heater "is hardly ever the install". Every image copies the layout and camera of a real Tungsten installation photo (cite it in the spec, see `cad/REAL-INSTALL-STUDY.md` §2–3). Of 107 real installs, none shows a lone heater centred on a ceiling or header facing the camera.
>
> **M16b. Heaters live at the edges.** Place heaters within about 1 m of an edge line: a house wall under the eave, the perimeter beam of a pergola or patio cover, the open edge of a slab or soffit, or a glazing frame. The heater's long axis is parallel to that edge. A heater in the middle of a space is allowed only as a **row** over a central line of tables or a walkway in a space one heater wide, or as rows over table lines in a large commercial room.
>
> **M16c. The face points at the seats.** Tilt each heater from the edge it is mounted on toward the seating it heats (wall and edge mounts angled down and in). Never tilt it toward the open side, the sky, the ceiling or the wall it hangs on. A glowing face may be seen from outside the covered area only when the seats are outside too (a restaurant frontage over pavement tables). Tilt: up to 45° for 2 and 3 kW, **up to 30° for 4 and 6 kW** on a ceiling (Series II manual) until the Product team confirms 45°.
>
> **M16d. Count and rhythm from the photo.** Use the number of heaters the real install had, never fewer to make a hero. Residential: one per seat group, usually 2–3 in a row. Commercial: one per table bay or booth. Equal spacing (at least 20 in edge to edge, 500 mm between recess cut-outs), equal height, equal tilt.
>
> **M16e. Heights and clearances.** Wall mount ≥ 1.8 m (71 in) above the floor, ceiling ≥ 2.4 m (96 in), recess ≥ 2.4 m (94 in); a ceiling heater 12 in (2 and 3 kW) or 18 in (4 and 6 kW) from a side wall; a recess ≥ 500 mm from a wall. The heater is never over a fire table, umbrella or fabric within about 1 m (36 in) in front.
>
> **M16f. Mount by surface (Series II).** Wall or beam face: angled bracket on its single post. Flat ceiling near the edge: the short post, straight or tilted. Pitched or vaulted ceiling: pitch adaptor, post hanging vertical, heater level (in-line or cross-slope). High ceiling: one single post on an accessory pole (600 or 1,200 mm), never twin tubes, chains or rods; flag for the owner until the pole is in CAD and approved. Recess: the LC kit on a visually flat ceiling, long axis with the joists or boards, in a row of 2–4, vent and terminal end toward the low side.
>
> **M16g. Camera like the real photographs.** From among or beside the seating, usually looking out to the view, at 3/4 or from below. Never on the room's axis from outside looking in at a heater's face. Heater 8–40% of frame width, in the upper part of the frame, with seats and people (or set tables) under it so the purpose reads.

Also amend the table **Placement by surface**. In the pitched-ceiling row, change "Recessed (a recess kit cannot go into an inclined ceiling)" to:

> Recessed on any visible slope (the LC kit allows at most ¼ in per 1 in, about 14°; keep images to flat ceilings)

---

## 8. Proposed checks for `.claude/agents/tungsten-render-qc.md`

Add under **Placement**:

> 19. **Real layout.** Does the spec cite a real installation photo, and do the heater count, positions and camera match it? A lone heater centred on a header or ceiling, seen face-on from outside the room on the axis of symmetry, is a FAIL ("central pillar" rejection, 21 Nov 2026).
> 20. **Edge placement.** Is every heater within about 1 m of a wall, perimeter beam, slab edge or glazing frame, long axis parallel to it? A heater mid-space is a FAIL unless it is one of a row over a central table line in a narrow space, or a commercial table-bay row.
> 21. **Facing.** Does each glowing face point down toward the seats it heats? Facing the open side, sky, ceiling, a wall or empty ground is a FAIL. A face visible from outside the covered area is a FAIL unless the seating is outside too.
> 22. **Tilt limits.** Is a ceiling-mounted 4 or 6 kW tilted 30° or less, every heater in a row at the same tilt, and no heater vertical or following a slope?
> 23. **Heights and clearances.** Wall heater ≥ 1.8 m, ceiling ≥ 2.4 m (check against a door at 2.03 m: a ceiling heater sits above the door head); not over a fire table, umbrella or fabric; recess not on a visible slope and not alone in a large ceiling.
> 24. **Viewpoint.** Is the camera among or beside the seating, at 3/4 or from below, as in the cited photo? An axis-on symmetric frame from outside is a FAIL.

---

## Sources

**Bromic manuals and documents**
- Bromic, *Tungsten Smart-Heat Electric Select & Coastal Models, installation manual* (2026, dealer-hosted): https://cdn.shopify.com/s/files/1/0780/6926/8771/files/Bromic-Tungsten-Electric-Select-Coastal-Manual.pdf
  - pp. 5–8: clearances, tilt limits, the 5 in / 9.5 in posts, 600 and 1,200 mm poles, wall-mount adaptor, pitched-ceiling adaptor;
  - p. 3: "Do not mount the heater vertically", "not facing the ceiling", heights.
- Bromic, *LC Ceiling Recess Kit for Tungsten Smart-Heat Electric Series II, instructions* (2025): https://cdn.shopify.com/s/files/1/0780/6926/8771/files/Bromic-Tungsten-Select-Coastal-LC-Recess-Kit-Instructions.pdf
  - pp. 3–5: dimensions, cavity, 94 in, 500 mm from walls and between heaters, ¼ in per 1 in maximum slope, joist gap.
- Bromic, *Tungsten Smart-Heat Electric instruction manual (US, Series I)*: https://pim.bromic.com/wp-content/uploads/2021/07/Bromic-Tungsten-Smart-Heat-Electric-Instruction-Manual-US.pdf
- Bromic, *Tungsten Smart-Heat Electric product page*: https://www.bromic.com/product/tungsten-smart-heat-electric/ ("Choose from wall mounting, pole mounting or recessed mounting options"; 72 in wall and 96 in ceiling minimum).

**Bromic blog pages**
- *Top 5 considerations for installing ceiling-mounted outdoor heaters*: https://bromic.com/top-5-considerations-for-installing-ceiling-mounted-outdoor-heaters ("between eight to nine feet from the floor"; extension poles 8 in to 4 ft).
- *Is wall mounting your outdoor heater the right choice for you?*: https://bromic.com/is-wall-mounting-your-outdoor-heater-the-right-choice-for-you ("Walls or beams will need to be nearby the spaces where heat is desired"; 72 in electric wall minimum).
- *How to install the low clearance recess kit* (Platinum kit, for comparison): https://bromic.com/how-to-install-the-low-clearance-recess-kit

**Bromic YouTube channel** (@HeatingBromic; titles, descriptions and thumbnail stills read via oEmbed and the channel search):
- https://youtu.be/D5VBNjAx0R4, *Bromic Tungsten Smart-Heat® Electric: Premium Radiant Heat, Every Season*. Wall-bracket product animation, tilted down.
- https://youtu.be/3dEfUr7Y34w, *Tungsten Electric at Clinica Las Condes, Chile*. Canopy perimeter beam.
- https://youtu.be/4VSoTcwViFw, *Courtney Saib Ultimate Porch Upgrade*, and https://youtu.be/ysJ1hl70Wrk, *Cold Screened Porch Gets Luxury Heating Upgrade*. Vaulted screened porch with heaters near the eave edges.
- https://youtu.be/qYAsLZ8SEIA, *Tungsten Smart-Heat® Electric & Freestanding*. House wall under the eave over seating.
- https://youtu.be/RNicEygv08U, *Eclipse Freestanding & Tungsten Electric at Hive & Honey, Irvine*. Heaters over the bar.
- https://youtu.be/imgiCUywrmk, *The Backyard Patio That Saved This Brooklyn Business*. Pergola courtyard.
- https://youtu.be/yHyZrP9YlqM, *Eclipse and Tungsten Heaters Transform Outdoor Living in Scottsdale*.
- https://youtu.be/vKGqmaCYGOM, *Platinum & Tungsten Smart-Heat® Setup | Wall Bracket to Full Operation*.
- https://youtu.be/DrH4v6dPOYY, *Low Clearance? Here's How to Install Bromic Heating*. Platinum LC kit.
- https://youtu.be/PihaPlx34e0, *Installing Recessed Heaters Just Got Way Easier*.
- No Series II installation video was found on the channel or the web (searched 21 Nov 2026).

**In the repo**
- Launch framework: `data/product-marketing/tungsten-electric-series-ii.json` (accessories, `tilt_verify`, mounting claims, source d1 launch deck).
- Lookbook 2026: `sources/Bromic_Lookbook_2026.txt` (Coastal "Available in Black or White… single-post mounting and marine-grade low-clearance recessing").
- Planning Guide 2021: `sources/Bromic_Planning_Guide_US_v1.2_2021.txt` (suspension poles "in higher-ceiling applications").

**Not reachable**
- bromic.com.au blog pages returned 403.
- YouTube transcripts were not available. Videos were judged from titles, descriptions and stills only.
