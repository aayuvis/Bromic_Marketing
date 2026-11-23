# Heat blooms: coverage table and image plan (draft for owner review, 23 Nov 2026)

## 1. Coverage per model (published "Max Heat Area")

Sources: bromic.com cut sheets (Tungsten Electric, Eclipse Electric, Eclipse Freestanding, Feb 2026) and the 2026 Bromic Product Catalog (pim.bromic.com, May 2026). Installation height 8–10 ft for every heater below (catalog). Values are `verified: false` in `data/product-facts.json` until the Product team signs off.

The ring sizes are worked out from those numbers: a circle with the published area has a diameter of 2 × √(area ÷ π). The square side is shown for reference.

| Family | Model | SKU (black / white) | Output | Max heat area | Ring diameter (same area) | Square side |
|---|---|---|---|---|---|---|
| Tungsten Electric | 2000 W | BH0420030 (black only) | 2.0 kW | 65 ft² (6.0 m²) | 9.1 ft (2.8 m) | 8.1 ft |
| Tungsten Electric | 3000 W | BH0420031 (black only) | 3.0 kW | 100 ft² (9.3 m²) | 11.3 ft (3.4 m) | 10.0 ft |
| Tungsten Electric | 4000 W | BH0420032 / BH0420012 | 4.0 kW | 130 ft² (12.1 m²) | 12.9 ft (3.9 m) | 11.4 ft |
| Tungsten Electric | 6000 W | BH0420033 / BH0420013 | 6.0 kW | 160 ft² (14.9 m²) | 14.3 ft (4.4 m) | 12.6 ft |
| Platinum Electric | 2300 W | BH0320003 / BH0320007 | 2.3 kW | 65 ft² (6.0 m²) | 9.1 ft (2.8 m) | 8.1 ft |
| Platinum Electric | 3400 W | BH0320005 / BH0320008 | 3.4 kW | 108 ft² (10.0 m²) | 11.7 ft (3.6 m) | 10.4 ft |
| Platinum Electric | 4500 W | BH3622000 / BH3622001 | 4.5 kW | 143 ft² (13.3 m²) | 13.5 ft (4.1 m) | 12.0 ft |
| Eclipse Electric (pole or pendant) | 2900 W | BH0920001-2 (240 V), BH0920003 (208 V) | 2.9 kW | 121 ft² (11.2 m²) | 12.4 ft (3.8 m) | 11.0 ft |
| Eclipse Freestanding | 2900 W | BH0820001-2 | 2.9 kW | 121 ft² (11.2 m²) | 12.4 ft (3.8 m) | 11.0 ft |

Notes:
- "Eclipse 2900" and "Eclipse Pendant" are the same heater (BH0920001-2): the pendant is the Eclipse Electric on a ceiling pole (8, 24 or 48 in, straight or curved). One image set covers both.
- Tungsten Series II (Select, Coastal, Classic) uses the same four outputs. The product page publishes 65, 100, 130 and 160 ft², but the Series II manual says up to 64, 100, 120 and 144 ft². [[VERIFY: which figures Series II images use — Product team]]
- Site conflicts already logged: Eclipse output 2900 W in the spec table and 3000 W in the FAQ; Eclipse Freestanding weight printed as 383 lb.
- Controls with every heater: Tungsten and Platinum with an Affinity Smart-Heat On/Off or Dimmer controller and a wall switch; Eclipse with the Affinity Eclipse controller or the Eclipse Dimmer Controller and remote. App features need compatible Affinity controls, sold separately.

## 2. The bloom, redrawn

What is wrong today: an orange cone or beam hangs in the air from the heater to the floor. Infrared does not glow in the air, so the cone reads fake, hides the view and gives no size.

The new bloom, following the owner's rules (cad/CAD-TO-REAL-REQUIREMENTS.md §12: glow small and only around the element; low and real; warmth lands where the heater points):
1. **The heater** glows only at its element, as it really does. There is no cone and no beam in the air.
2. **On the floor**, three thin concentric rings sit centred on where the heater aims. Each is a 1–2 px warm line drawn as true floor geometry in Blender, so the perspective is real:
   - The **outer ring** is the published max heat area at its true scale (the diameter in the table, at a 9 ft mount).
   - The **two inner rings** sit at about one third and two thirds of the outer diameter. They are a style device for "warmest at the centre" and carry no figure, because Bromic publishes no intensity map.
3. **A soft warm wash** fills the outer ring at very low opacity and fades out to the ring. No orange fill.
4. **One small label** sits on the outer ring, set in the Hub type: "121 ft² · 12.4 ft across". The m² version goes on AU and EU images.
5. **Wall and tilted heaters:** the rings move forward along the throw (on the seats, never under the heater).

## 3. Images to make: one scene per family, same camera, only the heater and rings change

| Set | Scene | Mount | Images | What changes between images |
|---|---|---|---|---|
| A · Tungsten Electric | Covered terrace, timber soffit at 9 ft, 6–8 seat dining table, dusk | Ceiling bracket, aimed down over the table | 4 (2, 3, 4, 6 kW) | Heater length and ring size only |
| B · Platinum Electric | The same terrace architecture, lounge setting (sofa, two chairs, low table) | Ceiling, flush-style | 3 (2.3, 3.4, 4.5 kW) | Heater size and ring size only |
| C · Eclipse Electric pendant | Pergola or soffit at 9 ft, round table for four | 24 in twin ceiling pole, centred over the table | 1 (plus wall-mount and curved-pole variants if wanted) | Not applicable |
| D · Eclipse Freestanding | Open patio by a pool or lawn, chairs around a low table | Freestanding, head about 7 ft, aimed at the seats | 1 | Not applicable |

Common to every set:
- One camera per family at about 5 ft, 30–35° down, so the floor rings read clearly. Each set also gets a matching top-down plan inset with the diameter dimensioned, for spec use.
- Same time of day, furniture and finish within a family. Black heaters as standard, with white variants for Tungsten 4/6 kW and Platinum.
- The controller is visible on a post or wall (Affinity, or the Eclipse controller).
- The heater comes from CAD where it exists (Series II); the others come from Bromic's own product renders. f/8, with no people.
- The same ring style in every family, so the series reads as one system.
