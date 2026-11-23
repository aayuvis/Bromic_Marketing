# Making CAD heaters look real: requirements

The binding brief for every image that shows a Bromic heater built from CAD. It is written from the owner's feedback during the
Tungsten Select (Series II) composite work, 19–20 Nov 2026. Each rule below fixes a failure the owner rejected. A render that
breaks any **must** is not shown to the owner.

---

## 1. The goal

A viewer must not be able to tell the image is not a photograph of a real installation. At full size it must show:

- the real product, taken only from CAD;
- mounted the way an installer would mount it;
- at true scale;
- lit by the scene's own light;
- softened, graded and grained like the photograph around it.

Owner, verbatim: *"the idea is to create realistic images not slob… they must be to scale"*.

---

## 2. Backgrounds

**Tungsten only (owner, 20 Nov 2026).** These images show the Tungsten Series II (Select, Classic, Coastal) and nothing else: never a
Platinum, Eclipse, gas or competitor heater. A background photo must show either an existing **Tungsten** installation, which is replaced
with Series II on the same mount, or no heater at all. Never put a Tungsten into a photo of another heater, its recess or its mount
(a Platinum recess under a Tungsten looks wrong): *"don't use other heater image to put tungsten as it will look bad"*.

| Must | Why (owner feedback) |
|---|---|
| **M0. Background shows Tungsten or no heater.** Check the library `product` field and look at the photo itself. Platinum, Eclipse, gas and other brands are out. | "We are only doing tungsten heaters… not platinums." |
| **M1. Use real photographs first.** Order: real Bromic installation photos from `images/library/`, then real photos the owner supplies, then new shoots. | "Backgrounds also cannot be AI slob… as close to real as possible… take inspiration from real life." |
| **M2. Never use an image model's whole scene as a background.** Generated scenes read as AI: too perfect, over-lit, symmetrical, airbrushed and over-saturated. A generated plate is allowed only when the owner asks for one. It must then be prompted from a real reference photo, which keeps its camera, light and materials, and the owner must approve it before any heater goes in. | The 24 generated coastal plates were rejected on sight. |
| **M3. Choose photos with a clear mounting surface:** a beam face, soffit, fascia, wall or flat ceiling, seen front-on or slightly from below. | Wide shots where the heater is a thin line, end-on views and steep upward views failed. |
| **M4. Prefer close and mid shots.** The heater should fill 15–40% of the frame width, and the diamond grille and BROMIC logo must be readable. | "We need some closer shots for sure." "Can't see the logo either." |
| **M5. Choose premium, believable settings:** coastal homes, good restaurants, pergolas, porches. Avoid cluttered, low-end or dated scenes. | "Horrible choice of photos." |
| **M6. Every plate must be at least 4K (≥ 3840 px on the long side).** Render the heater at 2× and reduce, never the other way. Library photos at 1,600 px are too small for hero use: find a larger original or reshoot. | "Ensure the images are high res… make the others high res too." |

---

## 3. The heater must come from CAD only

- **M7. Every visible part of the heater comes from the STEP files in `cad/tungsten-select/`:**
  - 6 kW Diamond, angled wall mount;
  - 6 kW Diamond black, ceiling mount;
  - 3 kW Diamond black, ceiling mount;
  - 6 kW Oval, ceiling mount;
  - 6 kW Diamond black, wall-mount adaptor (the pitch adaptor);
  - 6 kW heater and recess kit.

  An image model never draws, redraws or "improves" a heater.
- **M8. Match the mounting hardware to the mount type:**

| Mount | Hardware | Never |
|---|---|---|
| Wall, beam face or fascia | Angled wall bracket from the CAD (single post) | — |
| Flat ceiling | Short straight ceiling post and plate | Chains, drop rods, long poles |
| Sloped or pitched ceiling | Pitch / wall-mount adaptor from the CAD, so the heater hangs level and the adaptor takes up the slope | A crooked heater, or a heater following the slope |
| Recessed | **New** low-clearance recess kit only: slim trim and the vent at one end, as in the owner's reference image of 20 Nov | The old wide trim (`BMC-00659 TRIM LCCRK_OBSOLETE`, Platinum-style wide stainless or black frames) |

- **M9. Single post, no junction box, no cables, no conduit visible.** "This is a single post mount and without the junction box visible." "This cannot go on chains."
- **M10. The logo must be upright and readable** wherever the camera can see it. Check every image for a mirrored or upside-down logo; this happened twice.
- **M11. True scale.**
  - Lengths: Series II 3 and 6 kW are 1,436 mm long (2 and 4 kW: 1,144 mm). The element (coil) is 1.26 m long.
  - Set scale from things of known size in the photo: a door (2,030 mm), a dining table (750 mm high), a chair seat (450 mm), or a heater in the original photo of known length (Series I 6 kW: 1,410 mm).
  - Never size the heater by eye.

---

## 4. Placement: architecture first

The owner's design principles (20 Nov), applied to every image:

- **M12. Parallel.** The heater runs along the line of the surface it is mounted on (beam, soffit edge, ceiling boards, window header). Use the photo's own lines and vanishing points for the angle. "Not parallel to the ceiling… one to the right." "Heaters are crooked."
- **M13. Centred.** Centre the heater on the face of the beam or in its bay, not on the top edge. "Too high."
- **M14. Rhythm.** With several heaters, use equal spacing, a symmetric layout, and the same height and angle for each.
- **M15. Hierarchy and scale.** Size relates to the people and furniture. The heater is a clear focal point but never dominates the architecture.
- **M16. In contact.** The post meets the surface: no gap, nothing floating, no post into open air. If the original heater hung on chains well below the surface, choose another photo. "The mount is floating in the air and at a weird angle." "They are not floating like this."


### Real installs (owner, 21 Nov 2026; evidence in `cad/REAL-INSTALL-STUDY.md`)

**M16a. Layout from a real install, never from symmetry.** Owner, 21 Nov 2026: a central pillar in different settings with a forward-facing heater "is hardly ever the install". Every image copies the layout and camera of a real Tungsten installation photo (cite it in the spec, see `cad/REAL-INSTALL-STUDY.md` §2–3). Of 107 real installs, none shows a lone heater centred on a ceiling or header facing the camera.

**M16b. Heaters live at the edges.** Place heaters within about 1 m of an edge line: a house wall under the eave, the perimeter beam of a pergola or patio cover, the open edge of a slab or soffit, or a glazing frame. The heater's long axis is parallel to that edge. A heater in the middle of a space is allowed only as a **row** over a central line of tables or a walkway in a space one heater wide, or as rows over table lines in a large commercial room.

**M16c. The face points at the seats.** Tilt each heater from the edge it is mounted on toward the seating it heats (wall and edge mounts angled down and in). Never tilt it toward the open side, the sky, the ceiling or the wall it hangs on. A glowing face may be seen from outside the covered area only when the seats are outside too (a restaurant frontage over pavement tables). Tilt: up to 45° for 2 and 3 kW, **up to 30° for 4 and 6 kW** on a ceiling (Series II manual) until the Product team confirms 45°.

**M16d. Count and rhythm from the photo.** Use the number of heaters the real install had, never fewer to make a hero. Residential: one per seat group, usually 2–3 in a row. Commercial: one per table bay or booth. Equal spacing (at least 20 in edge to edge, 500 mm between recess cut-outs), equal height, equal tilt.

**M16e. Heights and clearances.** Wall mount ≥ 1.8 m (71 in) above the floor, ceiling ≥ 2.4 m (96 in), recess ≥ 2.4 m (94 in); a ceiling heater 12 in (2 and 3 kW) or 18 in (4 and 6 kW) from a side wall; a recess ≥ 500 mm from a wall. The heater is never over a fire table, umbrella or fabric within about 1 m (36 in) in front.

**M16f. Mount by surface (Series II).** Wall or beam face: angled bracket on its single post. Flat ceiling near the edge: the short post, straight or tilted. Pitched or vaulted ceiling: pitch adaptor, post hanging vertical, heater level (in-line or cross-slope). High ceiling: one single post on an accessory pole (600 or 1,200 mm), never twin tubes, chains or rods; flag for the owner until the pole is in CAD and approved. Recess: the LC kit on a visually flat ceiling, long axis with the joists or boards, in a row of 2–4, vent and terminal end toward the low side.

**M16g. Camera like the real photographs.** From among or beside the seating, usually looking out to the view, at 3/4 or from below. Never on the room's axis from outside looking in at a heater's face. Heater 8–40% of frame width, in the upper part of the frame, with seats and people (or set tables) under it so the purpose reads.

### Placement by surface (owner, 20 Nov 2026)

| Surface in the photo | Allowed mount | Never |
|---|---|---|
| Vertical wall, beam face, fascia, window transom | Wall bracket, single post into the face. Heater level, parallel to the beam edge, centred on the face or slightly below it ("mount it a bit lower"). | On the glass, above the beam top edge, angled off the wall |
| Flat horizontal ceiling, seen from below | Straight ceiling post, **or recessed** (new low-clearance kit: flush slim trim, vent at one end) | Chains, drop rods, long poles |
| Sloped or pitched ceiling | Pitch adaptor so the heater hangs **level**, parallel to the ridge or the eaves | **Recessed** (a recess kit cannot go into an inclined ceiling), a heater following the slope |
| Pergola, louvre or glass roof | Post into a solid beam only, parallel to the beam | Into glass or louvres, recessed |

- Choose the mount from what the original installation shows. When the owner asks to change it (for example, "recess the heater"), check the surface first. If the new mount is not allowed on that surface, choose another photo; never force it.
- The old heater's position is the starting point, never the answer. Move the heater if the architecture rules (parallel, centred, rhythm) say so.
- **Finish.** Graphite is a warm dark grey (owner's launch visual), not mid-grey or silver. Black is satin black. White is off-white. In every finish, the grille shows two thin red element lines over a light reflector, never an orange or pink flood.

---

## 5. Camera match: required before any render

1. Recover the camera:
   - focal length from the EXIF, or from the vanishing points of the architecture;
   - camera height and tilt from the horizon and verticals.
2. Model the mounting surface as a plane in that camera, and place the heater on the plane with the post into it.
3. Solve with care:
   - **Never** solve the pose from four corners of a heater that was drawn or guessed. That produced crooked, back-to-front and floating heaters.
   - Solve from straight architectural lines plus a known length.
4. Proof: overlay the plane's edges and the heater's outline on the photo, and check the alignment at 100% before rendering.

---

## 6. Materials

| Part | Setting | Owner feedback |
|---|---|---|
| Black housing | Satin powder coat, not flat CAD black: base about 0.02 linear, roughness about 0.48, a light clear coat (0.15–0.2), a 4 mm bevel, a fine orange-peel bump. Must read black with soft highlights, never grey or olive. | "Give natural shade to heaters, not CAD colours." "I would use black heater." |
| White housing | Off-white about 0.66, roughness about 0.5. The photo's own white is the reference. | — |
| Grille | Dark. The diamond pattern must read. | — |
| Reflector | Warm brushed metal, never a mirror. | — |
| Element glow | Low and deep orange. Emission about 1.5 in daylight, 2.5 at dusk, 3 at night. Quartz tube nearly clear. The grille must stay readable over the glow. | "The light is too bright." "Reduce glow on heater element." |
| Logo | Use the CAD logo faces. Light on black, dark on white. | "Can't see the logo." |

---

## 7. Light and shadow

- **M17. Directional light that matches the photo.** Read the sun or main light direction from shadows already in the photo, and give it the same softness. "Use directional shadows."
- **M18. Shadows fall only on the real mounting surface.** Mask them to the surface found in the photo, never onto sky or air. Keep them soft and light, never a hard dark box.
- **M19. Contact occlusion.** Add a soft dark band where the heater meets the surface. A heater with no contact shadow looks pasted on.
- **M20. Warm spill.** Add a faint warm glow on the surface near the elements, stronger at dusk and night, and none on glass.
- **Ambient light** takes the colour of the local surface around the heater, desaturated.

---

## 8. Composite: what makes it read as a photo

1. **Clean plate.**
   - Remove the old heater and all its brackets, poles, chains, cables and shadows.
   - Remove every other old heater in the frame.
   - Use Poisson (seamless) blending so tones meet with no visible patch.
   - Check the whole frame, not just the area around the new heater.
2. **Edges.**
   - Render at 2× and reduce.
   - Soften the edges to match the photo's sharpness, with a one-pixel light wrap from the background.
   - No dark or light fringe: un-premultiply and fill the edge colour.
3. **Grade.**
   - Mix in about 3–4% of the scene's local colour as haze.
   - Lower the heater's contrast slightly (about 0.96).
   - Match the photo's black level.
   - Desaturate the housing toward neutral so it does not pick up green or olive.
4. **Grain and softness.**
   - Add grain clumped like the photo's (σ about 0.7 px).
   - Apply a light down-and-up resample over the heater so it is no sharper than the photo.
5. **Glow.** Keep any bloom small and only around the element.

Owner, on the screened porch: *"Heater has no natural shadows or edges. It looks like a render. Placement is perfect."*

---

## 9. Quality control: before anything is sent

At 100%, check every image against this list. One failure means it is not sent.

- [ ] Tungsten only; the background showed Tungsten or no heater (never Platinum, Eclipse, gas or another brand).
- [ ] Heater, bracket and logo all come from CAD. No generated heater anywhere in the image.
- [ ] Correct mount type (§3), single post, no junction box, no chains, no old recess trim.
- [ ] Parallel to the architecture, centred, evenly spaced, in contact with the surface.
- [ ] True scale, checked against at least one object of known size.
- [ ] Logo upright and readable; diamond grille visible.
- [ ] Housing looks like real powder coat, not CAD black or grey; glow low.
- [ ] Shadow direction matches the photo; contact shadow present; nothing cast into the air.
- [ ] No leftover old heater, bracket or chain; no patch visible where it was removed.
- [ ] Edges, grain and sharpness match the photo.
- [ ] Image is ≥ 4K, or is flagged as low resolution.
- [ ] Compared side by side with a real Bromic installation photo of the same mount type.

---

## 10. Process

1. **Pilot 3 first.** Send three images at full size, get the owner's approval of the method, then do the rest. Never batch-render 20 before the pilot is approved.
2. **Show only finished images.** Raw plates, AI drafts and debug sheets go to the owner only when they are asked for, and are labelled as drafts.
3. **Check and label.**
   - Look at every image at full size.
   - Send a contact sheet plus a zip of full-size JPEGs.
   - Say which images were dropped and why.
4. **Triple check.** The author checks each image, the `tungsten-render-qc` agent (`.claude/agents/tungsten-render-qc.md`) checks it independently, then the author re-checks anything the agent flags. Only a PASS from all three is sent.
5. **Library rules.** Nothing enters the library without the owner's approval. When added, an image is labelled `generated` (a CAD composite), with the source photo credited.

---

## 11. Pipeline (`cad/pipeline/`)

| Step | Script | Notes |
|---|---|---|
| STEP → GLB | `toglb.py <in.STEP> <out.glb> [deflection]` | OCP (cadquery). Use a deflection of 1.0 for large assemblies (0.25 took more than 2 hours). Part names are on the mesh data. |
| Scene and camera | `scene_setup.py` | Per-photo spec: mount, finish, light, heater poses. |
| Render | `persp2.py <spec.json> <out.png>` | Blender (`bpy`), Cycles on CPU. Shadow-catcher plane on the mounting surface. Writes the heater alone (`_h`) and the heater plus caught shadow. |
| Clean plate | `clean_plate.py <photo> <out>` | Removes the old heater. Reads the image-model key from `/root/.gkey`, never stored in the repo. Check every result. |
| Composite | `composite.py <key>` | Mask, Poisson blend, contact and drop shadow, light wrap, grade, grain. |

Environment notes:
- No GPU or EGL is available, so use Cycles on CPU. Workbench and EEVEE fail.
- A 2× render takes about 3–7 minutes per image on 4 cores.

---

## 12. Owner decisions (from the Image Approvals tab)

Rules learned from the owner's approvals and rejections in `data/image-review.json`, newest first. Each line: date · image ·
decision · the rule it adds. The QC agent checks every rule here.

- **2026-11-22 · Recessed images (owner):** use REAL recessed-install photos at their true ceiling height (about 10–11 ft); the 8–9 ft "low" rule does not apply to recessed images taken from real photos. No generated plates for recess.
- **2026-11-22 · Recess trim (owner):** the current LC trim's CAD is not available (only obsolete BMC-00659 is in the STEP). Until it arrives, frame recessed shots so the trim edge is not the focus and render the CAD heater only, seated fully inside the ceiling opening; never hand-build a trim.
- **2026-11-22 · Round 7 QC lessons (all five failed):** the heater must sit fully inside its opening (no end cap past the cut-out); contact occlusion where the heater meets the ceiling or wall; grain and softness matched to the plate; graphite warm dark grey (R≥G>B), never olive; no light cut-out fringe; shadows follow the scene's light, never an all-round halo; heaters in a pair render identically; a post never shows an open hole or a plate dropping into the sky.
- **2026-11-22 · 73 decisions (35 approved, 38 rejected), the owner's first full pass in Image Approvals.** Rules added (QC checks 25–31):
  - **Inside the seating area, pointing in** (17 rejections: ts2-ai-02, 03, 07, 09, 10, 11, 16, 17, 19, 22, 23, 25, 27, 29, 44, 33 "on the walls on the side", 50 "should not be front mounted"): heaters go over or inside the seating footprint, under the roof, pergola or soffit that covers the seats, aimed inward. This narrows M16b: the "edge" is the inner structure over the seats, never the outer perimeter facing the view.
  - **Low and close** (ts2-ai-16, 18, 47, 50, 37 "should be mounted lower"): the low end of the allowed heights, near the table.
  - **Enough heater for the area** (ts2-ai-13 "too small for the area"): true scale and one heater per seat group.
  - **Pergolas** (ts2-ai-35, 39 "should be mounted under the pergola pointing at the seats"): hang from the pergola's structure, under it, aimed at the seats; ts2-ai-37: pull the table into the covered area and mount on the edge aiming in.
  - **Real mounts only** (ts2-ai-40, 43 "weird mounting"); **looks right** (ts2-real-01 "heater looks off"); **attractive setting** (ts2-ai-34 "ugly").
  - **Eclipse** (ecl-ai-01, 02 "eclipse head is too thick"): product drift in an image model; keep the real head proportions or drop.
  - **Logo** (pr-select-black-front-ceiling "logo inverted"): the logo reads upright and unmirrored in every view.
  - **Ads** (ad-ts2-01 "radioactive"; seven glow variants "too many", option G approved): soft amber glow (G); offer 1–2 options, not a run of variants.
  - **What good looks like** (approved): ts2-ai-01, 05, 06, 08, 14, 20, 26, 28, 30, 31, 45, 48, 49 and ts2-photo-02, 03, 06, 07 – heaters inside covered seating, low, aimed at the table, true scale; the studio renders and frontal shots; ads v2, v3G and v4; the recess-kit films.

- 2026-11-20 · ts2-photo-01 (café wall, white) · approved, "excellent" · A clean front-on wall at true scale, heater centred over the
  seating, soft contact shadow, no visible bracket is the reference look.

- **Coastal backgrounds (owner, 21 Nov 2026):** no real coastal Tungsten installs exist in the bank, so the Coastal shots may use
  image-model backgrounds prompted from a real coastal reference photo (keeping its camera, light and materials), each approved by the
  owner before any heater goes in (the M2 exception).
- **No long poles (owner, 21 Nov 2026):** Series II images use short posts only (wall bracket, beam post, flat-ceiling post, pitch
  adaptor, recess). Skip high-ceiling scenes that would need the 600 or 1,200 mm accessory pole.
- **Product drift (owner, 21 Nov 2026, Eclipse seated view B: "b is shit... product is wrong"):** when an image model re-photographs a scene
  it can redraw the product and the setting. Before anything is sent, compare the heater part by part with the real product photos
  (head thickness and shape, arm, base, ring, element) and the setting with the source; if either changed, drop it. Never send a
  variant whose product differs from the reference.
- **Recess axis (owner, 21 Nov 2026):** recessed heaters follow the manual – long axis WITH the joists or ceiling boards. A real
  install photo that has them running across the boards is not used for a recessed image (the Connecticut white front porch is out).
- **Keep pushing all types (owner, 21 Nov 2026):** after three failed rounds on ceiling and recess composites, the owner chose to keep
  iterating every mount type rather than switch to wall-only or real photography.


### Owner decisions, 22 Nov 2026 (studio renders, round 2)
- The owner approved all ten new studio renders, including eight the independent QC had failed: the 3 kW graphite (lighter graphite), the oval fronts with no logo on the fascia, the overlapping family shot, the profile with the post plate in open space, the soft macros and the angled bracket on a plain sweep. For **studio renders**, QC must not fail an image for those points. Flag them as notes for the owner instead. They are a studio look, not an in-situ placement. In-situ composite rules are unchanged.
- The Coastal background plates were rejected because they had no heater ("where is the heater here?"). Never send a background plate without its heater. For these two the owner asked for the heater to be added: ts2-r8e-03 with a recessed white heater; ts2-r8e-04 with a recessed graphite heater, or two heaters mounted from the long edge and facing inward.
- 22 Nov (later): pr-select-black-oval-front-hero rejected, "no logo". From now on every hero must show the BROMIC logo upright and readable. For the oval front, turn the camera or heater so the logo end cap shows (the oval fascia carries no mark of its own). The earlier oval renders stay approved.
- 22 Nov (owner, on the beach porch): "Two recessed heaters. Centered always please over the seating area." Standing rule: every heater or heater group is centred over the seating group it serves, measured from the solved camera, never pushed toward a wall, beam or edge. A seating group the size of a sofa plus chairs gets two heaters in line.
- 22 Nov (owner): "heaters must be recessed with a recess kit always". Standing rule: a recessed heater is always shown in the Bromic recess kit, its frame flush with the ceiling, rendered from the CAD kit geometry. Never a plain cut-out or slot. This supersedes the earlier "skip trim detail" choice.
- 22 Nov (owner, beach porch ts2-r8e-03): "One heater is fine here". Where the frame can't fit two heaters in line over the seating, one heater centred over the group is acceptable; a side-by-side pair is not the fallback.
- 22 Nov (owner, cedar dining pavilion pr-bg-white-ceiling-cedar-dining-f14): "good image but the heater mounting looks unreal...i would add 2 graphite recessed here". A heater on a post under a flat, solid board or plaster ceiling reads unreal; there, use two heaters recessed in the recess kit, in line and centred over the table or seating group. Posts stay for beams, pergolas and sloped ceilings.
- 22 Nov (owner, same image): "i would add them going into the image rather than parallel to the image". In room views, a pair of recessed heaters runs INTO the scene (long axis away from the camera, one behind the other), not parallel to the picture plane.
- 22 Nov (owner, batch review):
  - pr-bg-black-wall-bench-f14: "the seating is out of the heating bloom..directly under..not acceptable". A wall heater's warmth lands in front of it, along its tilt. Seats must sit inside that throw, in front of and below the heater, never tucked directly underneath it. On a wall above a bench, mount it high enough and angled so the bloom covers the seated person, or put it on the opposite wall facing the bench.
  - pr-c-white-pair-charcoal-wall-bench: "heaters look fake". Two white heaters side by side on a dark wall read pasted on; avoid.
  - pr-d-cedar-dining-graphite-recessed-f14: "heaters dont look real...not one after the other but in the same config but parallel to each other...they should look Bromic..the glow is unreal..use the white heater". For a dining table under a board ceiling: two recessed WHITE heaters in the kit, side by side and parallel, each running the same way, not one behind the other. The glow must be the real Bromic look: low, warm, the elements visible through the grille, no orange flood on the ceiling.
  - pr-d-social-white-from-below-graphite-9x16: "LOGO ON THE opposite side". Check the logo end before rendering every view from below.
- 22 Nov (owner, all recessed pairs): "what is the color streak between the rc kit and heaters. (it should be black [gray for white]) ....the logo is not visible...the heaters should be further away.. heaters parallel". Recess kit: the gap or cavity between the trim and the heater body is a dark neutral: black for black and graphite heaters, mid grey for white ones. No warm or orange streak from the element glow or the ceiling colour. The end-cap logo must be visible on at least the near heater. Pairs sit further from the camera, deeper into the scene over the seats, side by side and parallel. Studio: no dark sweep for white heaters ("dark background").
- 22 Nov (owner): "more gap between recessed heaters....pull them further and crop / zoom in the image to put more focus on them". Recessed pairs are about 1.5–2.0 m apart (kit centres), and the frame is tight enough that the pair spans about 45–60% of its width, with the seats still visible below. Zoom with the camera, never by upscaling.
- 22 Nov (owner): "recess kits should not have heaters". In product tiles and banners, show the recess kit on its own, empty: housing and trim only, no heater in it.
- 22 Nov (owner, system banners): "use a selection of a2, a3, a4 or a5 depending on the image". Rule: white heaters on A2 charcoal; black heaters at night or blue hour on A3 spotlit; black heaters by day, golden hour or dusk on A4 split tone; graphite heaters on A5 gradient floor. Fall back to A4 when a variant gives less than 3:1 edge contrast. The kit is always shown empty, the dimmer is Bromic's real photo, and every line comes from product-facts.
- 22 Nov (owner, late batch):
  - System banners: the HEAT, RECESS and CONTROL labels larger on every banner. The heater tile zoomed about 2× so it dominates its tile, with the BROMIC logo visible. The banner is one calm light band ("make banner all white and smaller", "make the banner light gray"), never a white side panel against a dark one and never grey on top with white below. Kit and heater tiles match the scene finish (white scene: white heater, white kit).
  - Scenes: the BROMIC logo must be visible on the heaters in room views. Bring the pair closer to the camera if needed ("bring heaters closer and put logo on them..they are too further out"). This overrides "further back" where the two conflict.
  - No colour cast on ceilings (forest loggia: "why is the ceiling pink?"). White scenes use white heaters.
  - Recessed close-ups: no dent or curve at the heater's corner edge (the CAD outlet-end opening must be closed or hidden).
  - Studio: no dark sweep for graphite ("make background lighter") or white; a white trio as well as the black.
- 22 Nov (owner): the white oak-soffit close-ups were "great image" but "this should be f8 image". Product-in-setting shots like these are made at f/8: the heater sharp, the setting readable, the background gently soft.
- 22 Nov (owner): "you can still use different designs of banners but core principles apply". Banners may vary in design, rotated across scenes, but always keep the core: one calm band (no split panels), large HEAT/RECESS/CONTROL labels, the heater tile about 2× with the logo readable, the kit empty, the real dimmer photo, tiles matching the scene finish, products at 2.5:1 or better at the edges, about 18–22% of the image height, flame only on small accents.
- 22 Nov (owner, pr-b-graphite-wall-concrete-firepit): "use f14 and part the heater slightly weathered". In outdoor settings a heater may show subtle, realistic wear: a faint dust film or soft water marks on the housing, never damage, rust, or anything that hides the finish or the logo.
- 23 Nov (owner, review of the f/8 and wide batches):
  - Roofs and soffits are level and true: board lines and soffit edges run straight and parallel to the frame (or converge correctly to one vanishing point), never tilted, bowed or skewed ("straighten the roof and this is then ok"). Check the horizon and the soffit edge before submitting.
  - Wide views of a heater on a wall under a soffit read as fake ("roof wall fake", 8 of 10 rejected): do not make generated wall-and-soffit wide shots. Use close or medium framing, or a real photographed setting.
  - No heater on a short post hanging from a single pergola beam ("what is this?", 8 of 8 rejected). Pergola installs follow the installation manual and Bromic's own pergola photos, or are not shown.
  - A tilt must read as natural from the camera: 20° on a ceiling post seen side-on from below looked wrong ("angle look weird"). Prefer views where the tilt is plainly the bracket's.
  - Generated scenes where the heaters or the whole setting look fake are rejected (desert kitchen recessed pair, limestone pool cabana). Lighting, scale and reflections must match the scene; when in doubt, use a real-photo background.
  - What was approved: f/1.4 recessed logo close-ups on timber and aluminium; studio wall and trio views on light, warm-grey and grey sweeps; recessed pairs with the system; plaster, oak and dark-timber soffit short-post shots.
