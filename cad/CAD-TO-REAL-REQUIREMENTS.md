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
