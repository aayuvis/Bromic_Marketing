# Round 8a – recessed Tungsten Series II in real photographs: plan

Owner's decisions for this round (22 Nov 2026): recessed images use **real recessed-install photos from the library at their true
ceiling height** (no generated plates, no low-ceiling rule); the Series II CAD heater goes where the original heater was, recessed
flush, **long axis along the boards**, over the seating; **no hand-built trim** – the CAD heater and the LC chassis sit fully inside a
plain 61 × 10 in ceiling cut-out, face just below the ceiling plane as the CAD gives; framing keeps the cut-out edge out of focus.
Recessed team target: 10 keepers (`ts2-r8a-01…10`), entries in `cad/rounds/r8a/entries.json`.

## Method (every shot)

1. **Plate** – the original JPEG from `images/_raw/bromic-com/` (or the bank), never upscaled.
2. **Clean plate** – the image model only removes the old Series I heater and its wide trim (and any other old heater in frame)
   inside a crop; the result is used only inside a tight mask round each old trim and tone-matched to the photo; checked for drift.
3. **Camera** – focal length from EXIF or from two orthogonal vanishing points (board lines and the cross direction) or the horizon
   and the verticals; the ceiling plane from those directions; its distance from the old Series I heater (1,410 mm) as the known length.
4. **Placement** – each new heater at the old heater's centre on the plane, rotated to run with the boards; a row is put on one line,
   ≥ 500 mm between cut-outs and clear of downlights; checked as a cut-out/face overlay on the photo before rendering.
5. **Render** – `rig.py` (Blender Cycles): 6 kW heater and LC recess-kit STEP; no trim (obsolete BMC-00659 hidden); a holdout
   ceiling with the cut-out so the cavity reads only through the opening; lit by a soft floor bounce and a dim environment.
6. **Composite** – `comp.py`: un-premultiplied matte, thin light wrap, contact occlusion at the opening, no drop halo, warm-neutral
   housing tint (R ≥ G > B), black level, haze and grain measured from the plate.

## Plates

| # | Setting | Plate (real) | Original install | New layout | Finish |
|---|---|---|---|---|---|
| A | Pool-house lounge, dark timber soffit (Sydney) | `bromic-tungsten-electric-residential` (2560, D3X 22 mm) | 2 Series I recessed **across** the boards, one more Tungsten under the beam edge, 4 heaters in the background pavilion | 2 Series II along the boards, in one row over the lounge (all old heaters removed) | black |
| C | Outdoor kitchen pass-through bar, oak ceiling | `tungsten-outdoor` (1264) | 1 along the boards over the bar stools, 1 across over the kitchen | 2 along the boards on one line | black |
| F | Shingle-house back porch, beadboard, wicker sofa (3/4 from below) | `tungsten-electric-white-recessed` (1707×2560) | 3 across the beadboard, alternating with downlights | 2 along the beadboard in the downlight line, in the two end bays (three would leave < 500 mm between cut-outs) | white |
| G | Same porch, looking along it from the seats | `tungsten-electric-white-recessed-residential-1` (1024×1536) | as F | as F | white |
| — | Same porch, third view | `private-residence-tungsten-2` (854) | — | dropped: near-duplicate of G | — |
| — | Rooftop hotel bar soffit (InterContinental LA, night) | `intercontinental-…-spire-73` (1200) | 3 in a curved soffit | dropped: curved soffit, no reliable camera solve | — |
| — | Same bar, sunset | `…-spire-73-sunset` (1200) | — | dropped: axis-on frame, heaters end-on (M16g, M4) | — |
| — | Pool cabana tray ceiling | `img-6955` (1024) | 2 either side of a fan | dropped: the clean plate redrew the fan (drift), symmetric axis-on frame | — |
| — | Timber soffit close-up (Sydney) | `sydney-residential-tungsten-electric-2-2` | — | dropped: same soffit as A, no seats in frame | — |
| — | Pool terrace, black recessed | `bromic-tungsten-electric-black-recessed` | — | dropped: same house as A, heaters small and seen from outside | — |
| — | Connecticut front porch | `connecticut-*` | — | out (§12 recess axis) | — |

Every plate is below 4K (M6) and is flagged low resolution; nothing is upscaled. Only four real recessed scenes in the library meet
the rules, so this round cannot reach ten keepers without repeating scenes.

## Results

(filled in after QC)

## Team E pitch-adaptor composites (22 Nov 2026): stopped after independent QC failed twice (0/2, then 0/2)
- First pass: adaptor stacked to a 0.45–0.5 m drop (pendant on a stalk), knuckle illegible, CAD decals, no contact occlusion.
- Second pass: short build was a CAD edit not shown in the manual (post square to the slope, breaking M16f "post vertical, heater level"); heater hugs the ceiling; housing black lifted to RGB ~56 vs ~34 in the plate; flat grille with end-cap artefacts; logo unreadable in 02.
- Blocked on: the Product team's real pitch-adaptor configuration (manual page or install photo with dimensions). dsc05656 has now failed three times; retire it unless that arrives.
