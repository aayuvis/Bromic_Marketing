# Round 7 – Tungsten Series II installation images: plan

Owner's brief (22 Nov 2026): more settings than a centre beam, recessed installs, the heater always from the CAD.
Owner's Image Approvals pass (22 Nov 2026, §12 of `cad/CAD-TO-REAL-REQUIREMENTS.md`): heaters **inside the seating area,
pointing in**, **low and close** (ceiling or recess about 8–9 ft over the seats, wall about 7–8 ft), enough heaters for the
seat groups, real Series II mounts only, logo upright, 1–2 options per setting.

Method for every shot: real photo from the Bromic library or the background bank as the plate; old heater removed (image-model
inpainting on the plate only, checked for drift and Poisson-blended back into the original pixels); camera recovered from the
plate's vanishing points and a known length (old heater, door, column); heater rendered from the Series II STEP/GLB in Blender
(Cycles) in that camera, lit from the plate; composited with contact shadow, grade and grain. No image model ever draws the heater.

| # | Setting | Plate | Mount | Heaters | Finish | Real-install pattern followed |
|---|---|---|---|---|---|---|
| 01 | Pool-house soffit over the lounge sofa, dark timber boards | `cad/backgrounds/tungsten/bromic-tungsten-electric-residential.jpg` (2560) | LC recess, long axis with the boards | 2, replacing the 2 Series I recesses on the same lines | black | D – recessed row in a timber soffit (`bromic-tungsten-electric-residential`, `w-sydney-residential-…-2-2`) |
| 02 | Outdoor kitchen bar under a timber ceiling, couple at the counter | `images/library/w-tungsten-outdoor` (1264) | LC recess | 2 (over the bar seats and the grill) | black | D – recessed in a flat timber ceiling over seating (`w-tungsten-outdoor`) |
| 03 | Restaurant/bar terrace soffit over bar stools | `images/library/w-intercontinental-la-downtown-spire-73` (1200) | LC recess | row along the soffit over the stools, as the original | black | D – commercial soffit row (`w-intercontinental-la-…`) |
| 04 | Cabana tray ceiling, sofas each side of the fan | `images/library/w-img-6955` (1024) | LC recess | 2, symmetric either side of the fan as installed | white | D – `w-img-6955` (the one symmetric pair) |
| 05 | Pool soffit over the outdoor dining and kitchen | `cad/backgrounds/tungsten/bromic-tungsten-electric-black-recessed.jpg` | LC recess | 3 | black | D – **dropped at planning**: the original heaters run across the boards (§12 recess axis) |
| 06 | Covered patio with fireplace lounge (Elm Ave, 5690 px) | `ri/dl/Elm-Ave_11-Thumb.jpg` (Bromic original) | LC recess | 2 | white | C→D – **dropped at planning**: camera solve puts the ceiling at about 3.4 m (11 ft), too high for the owner's low rule |
| 07 | Residential pergola lounge, couple on the sofa | `cad/backgrounds/tungsten/strx-230222-bromic-dc-6.jpg` | short post under the pergola front beam, tilted in at the sofa | 1 (as installed) | graphite | B – perimeter beam from inside, face toward the seats (`strx-230222-bromic-dc-6`) |
| 08 | White house wall over an outdoor dining table | `images/library/w-tungsten-electric-studio-city-4` (1600) | angled wall bracket | 1 over the table (as installed) | graphite | A – wall over a single seat group (`studio-city-4`; approved `ts2-photo-01` look) |
| 09 | House wall under the eave over the deck lounge | `images/library/w-juneau-showhome-1` (1600) | angled wall bracket | as installed over the lounge | black | A – wall under the eave over deck seating (`w-juneau-showhome-1`, `w-dsc07397-1`) |
| 10 | Screened porch, vaulted timber ceiling, sectional | `cad/backgrounds/tungsten/dsc05715-courtney-saib.jpg` | pitch adaptor, post vertical, heater level | 1–2 at the eave side over the sectional | black | E/C – Courtney Saib porch (`dsc05715`, `dsc05737`) |
| 11 | Café/restaurant facade wall row | `cad/backgrounds/tungsten/img-1256.jpg` | wall bracket | row over the pavement tables | white | G – **dropped at planning**: the owner's new rule bars front-facade heaters facing the street |
| 12 | Garage/workshop | none in the bank or library | — | — | — | **dropped at planning**: no real plate; an image-model plate would need the owner's approval first (M2) |

At least half of what is made is recessed (01–04). Resolution: only the Elm Ave original is 4K; every other plate is 1,024–2,560 px
and is flagged low resolution (M6) – nothing is upscaled.

Open point for the owner: the only trim in the Series II recess-kit CAD is `BMC-00659 TRIM LCCRK_OBSOLETE`, and §3 forbids it. Its
outline (1,624 × 283 mm) is exactly the trim size in the LC kit instructions. The recessed images use a flat trim of those published
dimensions (black or white, 3 mm), with the heater, chassis and vent ends from the CAD; please confirm the current trim or supply its STEP.

## What happened (22 Nov 2026)

Every real recessed plate was solved before use, and each one put the ceiling above the owner's 8–9 ft limit: Elm Ave (about 3.4 m),
`bromic-tungsten-electric-residential` (3.0–3.5 m), and `black-recessed` (where the heaters also run across the boards). So the recessed
shots use 4K image-model backgrounds, each prompted from the real install photo it replaces, as the brief allows, and each checked for
ceiling height from an object of known size. Plates that still came out too high were dropped.

| Kept | Setting | Mount | Finish | Plate | Ceiling or height check |
|---|---|---|---|---|---|
| ts2-r7-01 | Shingle-house porch, wicker seating | LC recess ×2, in a row with the beadboard | white | generated from `w-tungsten-electric-white-recessed` (3392×5056) | 2.65 m (80 in door) |
| ts2-r7-02 | Outdoor kitchen bar, three stools | LC recess ×2, side by side with the oak boards | black | generated from `w-tungsten-outdoor` (5056×3392) | about 2.8 m (36 in base cabinets) |
| ts2-r7-03 | Pool-house lounge, dark timber soffit | LC recess ×2, with the boards | black | generated from `bromic-tungsten-electric-residential` (5056×3392) | about 2.6–2.7 m (side table, column) |
| ts2-r7-04 | House wall over a dining table (Studio City) | angled wall bracket | graphite | real, 2560×1707 (below 4K) | heater centre about 2.3 m (window check) |
| ts2-r7-05 | Pergola lounge, couple on the sofa | 225 mm post under the beam, 30° toward the sofa | graphite | real, `strx-230222-bromic-dc-6`, 1793×2560 (below 4K) | as the original install |

| Dropped | Why |
|---|---|
| Restaurant terrace soffit (R4, R4b, generated) | soffit solved at 3.0–3.3 m |
| Covered patio with fireplace (R5, generated) | ceiling about 2.9 m |
| Covered dining, cedar ceiling (R6, generated) | ceiling about 3.2 m |
| Cabana (R7) and beam over dining (P1, generated) | not solved in time; P1's beam is at the camera, so the heaters would face away |
| Bar, white, two posts (`img-0661`, real) | rendered and composited, then failed QC: at the 30° tilt limit the faces turn away from the camera, and the white CAD reads flat with hollow-looking end caps |
| Screened porch with pitch adaptor (`dsc05715`) | not attempted: the last pitch-adaptor composite was rejected ("heater looks off"), and the vaulted ceiling is high |
| Café facade row, garage | owner's rule against front-facade heaters; no garage plate |

## Independent QC (22 Nov 2026): 5 checked, 0 pass
- 01–03 (recess): generated plates not owner-approved (M2 – only Coastal is excepted); trim hand-built to the obsolete BMC-00659 outline (M7); heater end caps protrude past the trim; no contact occlusion or grain; 01 scale off 25–30 % between heaters; 03 left heater on the perimeter over a column, glow mismatched.
- 04 (wall): graphite reads olive; light cut-out fringe; all-round halo instead of a directional shadow; 2560 px.
- 05 (pergola): on the outer beam beyond the sofa (22 Nov rule); post drawn with an open hole and a plate dropping into the sky; no sun response; 2560 px.
Withdrawn from Image Approvals. Next round needs: owner approval of recess plates first, the current LC trim STEP, and composite fixes (seat heater inside trim, occlusion, grain, colour).
