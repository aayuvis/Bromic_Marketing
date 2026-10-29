---
id: R-BLOG-AUDIT
type: report
title: "bromic.com blog audit: 73 posts mapped to the journey, with keep, rewrite, merge and retire calls"
slug: bromic-blog-audit-2026
audience: [RES, ARC, BLD, COM]
stage: [AW, CO, IN, PP, BY]
cell: RES-CO
asset: A24
summary: "Every post on bromic.com/blog read on 29 Oct 2026, mapped to an audience and stage, checked against the hard rules (controls, legacy naming, sourced figures, code disclaimers) and given a call. Where a Hub draft covers the same topic, the plan updates the live URL instead of publishing a rival."
owner_review: Brian Kim
status: in-review
gated: false
updated: 2026-10-29
sources:
  - id: s1
    publisher: Bromic Heating
    title: "bromic.com blog (post-sitemap.xml, 74 URLs incl. the index), read page by page"
    year: 2026
    url: https://www.bromic.com/blog/
    supports: "Post titles, topics, calls to action, images and the issues listed per post"
    verified: true
---

## The short version

The blog is bigger than the brief assumed: **73 posts, not 9**. The /blog/ index shows only the latest nine, so 64 posts can be
reached only through search and internal links. Most of the inventory is sound in topic and weak in execution. Four problems run
through nearly every post:

1. **Controls are missing.** About 50 of 73 posts recommend a heater without the controls that run it. The rest name
   pre-Affinity controllers ("wireless dimmer", "master remote", Smart-Heat Link) or describe controls as an extra. That breaks the
   controls rule on the site itself.
2. **Specs disagree between posts.** Electric coverage is given as 108, 143 and 160 ft². Eclipse has six or seven mounting options.
   The Low Clearance Recess Kit fits 2300/3400W in one post and also 4500W in another. Propane run time is 9, 9–10 or 10–17 hours.
   IP ratings are IPX4, IPX5, IP54 or IP55. One post explains IP codes wrongly.
3. **Legacy series-number naming** (the retired 300/500 model numbers) survives in at least five posts, including image captions and file names.
4. **Images are broken.** On most posts only the first body image has a source. The rest render as empty slots, including all
   eight screenshots in the app how-to. Most images have no alt text.

Also: internal links still use the dated /2020/–/2023/ permalinks; several podcast posts end in a newsletter block with no form;
three testimonials need checking before they stay live; most pages' structured data points at the staging domain
`us.bromic-prod.454.agency`.

## The calls

**Keep and fix** (sound topic, high intent; fix specs, add controls and disclaimers) · **Rewrite** (right topic, wrong or dated
content) · **Merge** (several posts compete for one query; keep the strongest URL, 301 the rest into it) · **Retire** (off-market
or no longer true; 301 to the nearest page) · **Replace with Hub draft** (our draft becomes the new body at the existing URL, so no
duplicate topic and no lost links).

### Install, mount and clearances (BLD, ARC · PP, BY): the strongest cluster

| Post | Cell | Call | Why, and what to change |
|---|---|---|---|
| [How should I mount my outdoor electric patio heater?](https://www.bromic.com/blog/how-should-i-mount-my-outdoor-electric-patio-heater/) | BLD-PP | Keep and fix | Good spec content. Add the controls and wiring for them; reconcile the recess-kit cavity depth (7.1 in vs "as low as 7 in"); add the electrician and local-authority line |
| [How should I mount my outdoor gas patio heater?](https://www.bromic.com/blog/how-should-i-mount-my-outdoor-gas-patio-heater/) | BLD-PP | Keep and fix | Remove the retired series-number captions and file names; reconcile deflector clearance (14 in vs 35 cm); "ceilings of any height" contradicts the 8 ft minimum |
| [What should be considered when installing recessed electric outdoor heaters?](https://www.bromic.com/blog/what-should-be-considered-when-installing-recessed-electric-outdoor-heaters/) | ARC-IN | Keep and fix | Strong spec post; add controls and the code disclaimer. Link to the Hub's ARC-IN-KB1 (recessing in a soffit) |
| [Top 5 considerations for ceiling-mounted heaters](https://www.bromic.com/blog/top-5-considerations-for-installing-ceiling-mounted-outdoor-heaters/) | BLD-PP | Keep and fix | Weight 16–22 lb conflicts with 16–38 lb elsewhere; no controls; no code disclaimer |
| [Is wall mounting the right choice?](https://www.bromic.com/blog/is-wall-mounting-your-outdoor-heater-the-right-choice-for-you/) | RES-PP | Merge into the electric mounting post | Clearance "6 to 12 in" vs "5 ft from any structure"; overlaps the mounting posts |
| [What are the clearances to heat my covered patio?](https://www.bromic.com/blog/what-are-the-clearances-to-heat-my-covered-patio/) | RES-PP | Replace with Hub draft | Generic clearances not tied to models; FAQ schema (8–10 ft) and body (2–3 m) disagree. RES-PP-01 and ARC-BY-KB1 cover it with sourced figures |
| [Low Clearance Recess Kit: a practical solution](https://www.bromic.com/blog/the-bromic-low-clearance-recess-kit-a-practical-solution-for-installing-a-recessed-electric-heater/) | ARC-IN | Merge with the install post below | Compatibility conflict (adds 4500W); "up to 82%" vs "82% smaller" |
| [How to install the Low Clearance Recess Kit](https://www.bromic.com/blog/how-to-install-the-low-clearance-recess-kit/) | BLD-BY | Keep (merge target) and fix | "2400W" should be 2300W; add controls |
| [How to install a Bromic Eclipse Freestanding heater](https://www.bromic.com/blog/how-to-install-a-bromic-eclipse-freestanding-heater/) | RES-BY | Keep and fix | Clearance link goes to the Eclipse Portable page; NEMA 6-20P line needs the licensed-electrician note; name Affinity and the app |
| [How to prepare your patio for outdoor heating](https://www.bromic.com/blog/how-to-prepare-your-patio-for-outdoor-heating/) | RES-IN | Replace with Hub draft | Topic is BLD-IN-01 (pre-wire) and A16. Controls are an add-on section; three images empty |

### Controls, app and smart home (RES, BLD · BY)

| Post | Cell | Call | Why, and what to change |
|---|---|---|---|
| [How to use the new Bromic Heating app](https://www.bromic.com/blog/how-to-use-the-new-bromic-heating-app/) | RES-BY | Rewrite | Eight screenshots missing; drop "new"; say compatible Affinity controls are sold separately; align with RES-BY-01 |
| [Are there remote controls for Bromic patio heaters?](https://www.bromic.com/blog/are-there-remote-controls-for-bromic-patio-heaters/) | RES-PP | Rewrite | Pre-Affinity; "Smart-Heat Connect" vs "Link"; "6 zones" vs "6 groups". Rewrite around Affinity On/Off, Dimmer, Eclipse controller, wall switch, app |
| [How do I connect my outdoor radiant heater to my home automation system?](https://www.bromic.com/blog/how-do-i-connect-my-outdoor-radiant-heater-to-my-home-automation-system/) | RES-CO | Merge | Competes with the Smart-Heat Link post; dated 2020 "by 2025" forecast |
| [How to integrate your Smart-Heat Link with home automation](https://www.bromic.com/blog/how-to-integrate-your-bromic-smart-heat-link-with-your-home-automation-system/) | BLD-BY | Keep (merge target) and rewrite | Check whether Smart-Heat Link is current with Affinity; add 208 V wiring (diagrams show 220–240 V only) [[VERIFY: Smart-Heat Link status vs Affinity — Mike Clifford]] |
| [Transforming outdoor spaces with smart technology](https://www.bromic.com/blog/transforming-outdoor-spaces-with-smart-technology/) | RES-AW | Keep and fix | Name the Affinity range; four images empty |

### Choosing a heater: one query, eight posts (RES · AW, CO)

Eight posts answer "which outdoor heater should I buy". They cannibalise each other and disagree on specs. **Merge into two**: a
buyer's guide (keep *Which outdoor heater collection is right for you?* as the URL) and a fuel decision (keep *Gas or electric*).

| Post | Cell | Call | Why, and what to change |
|---|---|---|---|
| [Which outdoor heater collection is right for you?](https://www.bromic.com/blog/which-outdoor-heater-collection-is-right-for-you/) | RES-CO | Keep (merge target) and rewrite | Metric coverage on a US page; unsourced "three times more efficient"; confusing Marine warranty line |
| [What Bromic outdoor heater should I use?](https://www.bromic.com/blog/what-bromic-outdoor-heater-should-i-use-for-my-outdoor-living-space/) | RES-CO | Merge | Names only the Eclipse Dimmer |
| [Do patio heaters work? How to choose](https://www.bromic.com/blog/do-patio-heaters-work/) | RES-AW | Merge | Six vs seven Eclipse mounting options; unsourced 3X claim |
| [Thinking of purchasing an outdoor heater?](https://www.bromic.com/blog/thinking-of-getting-an-outdoor-heater/) | RES-AW | Merge | Coverage "up to 108 ft²" conflicts; controls framed as an extra |
| [The best way to heat an outdoor patio](https://www.bromic.com/blog/best-way-to-heat-an-outdoor-patio/) | RES-AW | Merge | Unsourced "one heater per 100 ft²" and cost claims |
| [What are the best types of outdoor heaters?](https://www.bromic.com/blog/best-type-of-heater-for-outdoors/) | RES-AW | Merge | No products or controls; generic claims |
| [What makes an outdoor heater top rated?](https://www.bromic.com/blog/what-makes-an-outdoor-heater-top-rated/) | RES-CO | Rewrite | The main CTA sends readers to a retailer (BBQGuys); make the Bromic next step primary |
| [Gas or electric: selecting the right outdoor heating system](https://www.bromic.com/blog/gas-or-electric-patio-heaters-which-one-is-right-for-me/) | RES-CO | Replace with Hub draft (RES-CO-01) | Cost table is an unsourced image; an internal link carries `utm_source=chatgpt.com` |
| [How to select the right fuel source for your space](https://www.bromic.com/blog/how-to-select-the-right-fuel-source-for-your-space/) | RES-CO | Merge into the above | retired series-number naming; unsourced running-cost table |

### Infrared, efficiency and weather (RES, COM · AW, CO): answer-engine material

| Post | Cell | Call | Why, and what to change |
|---|---|---|---|
| [Do infrared heaters work outdoors?](https://www.bromic.com/blog/do-infrared-heaters-work-outdoors/) | RES-AW | Keep and fix | Source the efficiency claims; "portable" link goes to the natural-gas page |
| [Are infrared heaters efficient?](https://www.bromic.com/blog/are-infrared-heaters-efficient/) | RES-CO | Keep and fix | Cut or source "30% less energy"; give the IP rating as a number |
| [Infrared vs radiant heaters: are they the same?](https://www.bromic.com/blog/what-is-the-difference-between-an-infrared-heater-and-a-radiant-heater/) | RES-AW | Keep and fix | No closing CTA; "no risk of sunburn" unsourced |
| [Heating people, not places: the fundamentals of heat transfer](https://www.bromic.com/blog/heating-people-not-places-the-fundamentals-of-heat-transfer/) | ARC-CO | Keep and fix | Source the 60–90% / 40% radiant figures (Planning Guide 2021); link ARC-CO-01 |
| [Do outdoor heaters work in the winter?](https://www.bromic.com/blog/do-outdoor-heaters-work-in-the-winter/) | RES-AW | Keep and fix | Controls only in the summary box; three images empty; legacy dated link |
| [Patio heaters in the rain](https://www.bromic.com/blog/patio-heaters-in-the-rain-what-you-need-to-know/) | RES-CO | Keep and fix | "Contact us" has no link; IEC defines IP codes, it does not accredit; reconcile IP claims |
| [What is an IP rating and why is it important?](https://www.bromic.com/blog/what-is-an-ip-rating-and-why-is-it-important/) | ARC-CO | Rewrite (urgent) | Explains IP codes wrongly; blanket "IPX4" for every model [[VERIFY: IP rating per model — Mike Clifford]] |
| [Combating corrosion: coastal environments](https://www.bromic.com/blog/combating-corrosion-outdoor-heating-in-coastal-environments/) | RES-CO | Merge with the coastal post below | Weak salt-air source (a metals vendor); does not name Platinum Electric Marine |
| [Stylish and resilient coastal outdoor heaters](https://www.bromic.com/blog/stylish-resilient-coastal-outdoor-heaters/) | RES-CO | Keep (merge target), rewrite at Coastal launch | Tungsten Coastal is coming soon: rewrite on Mike Clifford's launch confirmation |
| [Revolutionizing outdoor living in extreme climates](https://www.bromic.com/blog/revolutionizing-outdoor-living-in-extreme-climates/) | RES-AW | Convert to a case study | Reads as a case study but is not one; link it from /case-studies/ |

### Safety, propane and maintenance (RES, COM · CO, BY)

| Post | Cell | Call | Why, and what to change |
|---|---|---|---|
| [Are infrared outdoor heaters safe?](https://www.bromic.com/blog/are-infrared-outdoor-heaters-safe/) | RES-CO | Keep and fix | "Rated at an IPX" with no number; gas ventilation rule needs the gas-fitter and local-code line; link RES-CO-KB2 |
| [Top tips for outdoor heater safety](https://www.bromic.com/blog/top-tips-for-outdoor-heaters-safety/) | RES-AW | Merge into the above | Metric "1 meter" clearance; COVID-era source |
| [Is it safe to use a patio heater in a garage?](https://www.bromic.com/blog/patio-heater-in-a-garage/) | RES-AW | Keep and fix | Add the local-authority and installer disclaimer; "propane" link goes to the natural-gas page |
| [Can you put a patio heater under a gazebo?](https://www.bromic.com/blog/can-you-put-a-patio-heater-under-a-gazebo/) | RES-PP | Keep and fix | IPX with no number; US voltage (208 V) missing; FAQ heading copied from another post; link RES-PP-KB1 |
| [How long does a propane tank last on a patio heater?](https://www.bromic.com/blog/how-long-do-propane-patio-heaters-last/) | RES-CO | Keep and fix | retired series-number naming; run time conflicts (9–10 vs 10–17 h) [[VERIFY: run time per cylinder size — Mike Clifford]] |
| [How to pick the right outdoor propane patio heater](https://www.bromic.com/blog/outdoor-propane-patio-heater-buying-guide/) | RES-CO | Merge into the propane tank post | Ventilation rule conflicts (75% open vs 25% minimum); CTA mislabelled |
| [The power of portability: freestanding patio heaters](https://www.bromic.com/blog/the-power-of-freestanding-what-to-look-for-in-freestanding-patio-heaters/) | COM-CO | Merge into the post below | 2020 pandemic framing; 9 kg tank and MJ units on a US page |
| [Freestanding heaters don't need to be clunky](https://www.bromic.com/blog/freestanding-heaters-dont-need-to-be-clunky/) | RES-CO | Keep (merge target) and fix | Reel embed missing; settle "Freestanding" vs "Portable" naming site-wide |
| [Keeping the heat on: cleaning and maintenance](https://www.bromic.com/blog/keeping-the-heat-on-essential-cleaning-and-maintenance-for-outdoor-heaters/) | COM-BY | Keep and fix | Check warranty terms against the current policy; link COM-BY-01 |

### Commercial revenue (COM · CO, IN): feed A20 and A21

| Post | Cell | Call | Why, and what to change |
|---|---|---|---|
| [How outdoor heating can increase revenue and profits](https://www.bromic.com/blog/how-outdoor-heating-can-increase-revenue-profits/) | COM-IN | Replace with Hub draft (COM-IN-01) | retired series-number naming; the $22,889 per-heater figure and running costs are unsourced and undated. Its ungated ROI PDF becomes A21's gated report |
| [Why mushroom heaters are bad for business](https://www.bromic.com/blog/why-mushroom-heaters-are-bad-for-business/) | COM-CO | Rewrite | $16,752 saving and "three times more efficient" unsourced; rebuild on the A20 maths with shown fuel prices |
| [Outdoor dining: is it here to stay?](https://www.bromic.com/blog/outdoor-dining-is-it-here-to-stay-or-go/) | COM-AW | Rewrite | 70%, 69%, 90% unsourced; pandemic framing; IP claims conflict |
| [Elevating your patio to feel like a 5-star resort](https://www.bromic.com/blog/elevating-your-patio-space-to-give-the-feeling-of-a-5-star-resort/) | RES-AW | Keep and fix | The WSJ feature is a strong third-party proof point; check the "8-foot" Eclipse Freestanding height |

### Specification and product news (ARC, BLD · IN, PP)

| Post | Cell | Call | Why, and what to change |
|---|---|---|---|
| [Why it's important to specify outdoor heating early](https://www.bromic.com/blog/why-its-important-to-specify-outdoor-heating-early/) | ARC-IN | Rewrite (priority) | The nearest live page to our thesis ("designed from the start, not added later") but it omits controls, the code disclaimer and the 23% stat; link ARC-IN-01 and A11 |
| [Complete product line solutions for Platinum Smart-Heat Electric](https://www.bromic.com/blog/bromic-offers-complete-product-line-solutions-for-platinum-smart-heat-electric-series/) | ARC-IN | Keep and fix | "Newly released" 4500W is dated; source "patented" and "only" claims; state recess-kit compatibility |
| [Radiance redefined: the Eclipse collection](https://www.bromic.com/blog/radiance-redefined-the-eclipse-collection-of-luxury-heaters/) | RES-CO | Keep and fix | Three vs four heat settings; check the Eclipse controller against Affinity |
| [World's first Lloyd's Register approved marine heater](https://www.bromic.com/blog/worlds-first-lloyds-register-approved-outdoor-heating-range-for-marine-applications/) | COM-CO | Keep and fix | Strong proof point: link the certificate; coverage 108 vs 143 ft²; "wireless dimmer" naming |
| [Maximizing outdoor living with structures and heating](https://www.bromic.com/blog/maximizing-outdoor-living-spaces-with-outdoor-structures-and-heating-solutions/) | ARC-AW | Keep and fix | Michael Smith's title differs from other pages; legacy dated links |

### Podcast write-ups and design thought leadership (ARC, COM · AW)

These earn their keep with architects and are linked from the podcast pages. **Keep all**, and fix three things on every one: the
"Never miss an episode" newsletter block has no form (wire it to the HubSpot newsletter form); add one next-stage CTA (BIM, AIA CE,
spec kit); add alt text. Name spellings to correct are listed in `data/site-inventory.json`.

| Post | Cell | Call | Note |
|---|---|---|---|
| [Design without borders](https://www.bromic.com/blog/design-without-borders-outdoor-spaces/) | ARC-AW | Keep and fix | Host name spelled two ways |
| [The art and science of outdoor space design](https://www.bromic.com/blog/the-art-and-science-of-outdoor-space-design/) | ARC-AW | Keep and fix | "Aria Group Architects" link points at the podcast site |
| [From luxury hotels to your back porch (Design Builders podcast)](https://www.bromic.com/blog/from-luxury-hotels-to-your-back-porch/) | BLD-AW | Keep and fix | Source "only manufacturer offering gas, electric and portable"; name warranty models |
| [Crafting enduring experiences in outdoor hospitality](https://www.bromic.com/blog/crafting-enduring-experiences-in-outdoor-hospitality/) | COM-AW | Keep and fix | H2 typo; name spelled two ways; propane link points to natural gas |
| [Multi-family and mixed-use with Sara Schneider, TCA Architects](https://www.bromic.com/blog/exploring-multi-family-and-mixed-use-outdoor-spaces-with-sara-schneider-of-tca-architects/) | ARC-AW | Keep and fix | Broken newsletter CTA |
| [Residential outdoor spaces with Danny Wang](https://www.bromic.com/blog/exploring-residential-outdoor-spaces-with-danny-wang/) | RES-AW | Keep and fix | No product named |
| [Outdoor design trends: a focus on sustainability](https://www.bromic.com/blog/outdoor-design-trends-a-focus-on-sustainability/) | ARC-AW | Keep and fix | Same image twice |
| [Architect spotlight: Yvonne Haber](https://www.bromic.com/blog/architect-spotlight-yvonne-haber-on-outdoor-living/) | ARC-AW | Keep and fix | "One in ten (19%)" is a contradiction; Houzz study needs a year and link; AU architect on the US blog |
| [Outdoor design innovation: adapting to consumer needs](https://www.bromic.com/blog/outdoor-design-innovation-adapting-to-consumer-needs/) | ARC-AW | Keep and fix | Founding-year conflict; "StruXure" spelling |
| [Outdoor heating guide on sustainable design principles](https://www.bromic.com/blog/outdoor-heating-guide-on-sustainable-design-principles/) | ARC-CO | Rewrite | The 82% / 2,200-adult figure credited to the CDC has no link: find it or cut it; pandemic framing |
| [Outdoor amenities shaping home design](https://www.bromic.com/blog/outdoor-amenities-shaping-home-design-like-never-before/) | RES-AW | Rewrite | 2019/2020 NAHB figures, unlinked; replace with the sourced NAHB figure in ARC-AW-01 |
| [Elevating outdoor living with design-forward heating](https://www.bromic.com/blog/elevating-outdoor-living-with-design-forward-heating/) | RES-AW | Keep and fix | Australian press feature: cross-post to bromic.com.au, keep on US only with a US angle |
| [How outdoor heating can transform your outdoor space](https://www.bromic.com/blog/how-outdoor-heating-can-transform-your-outdoor-space/) | RES-AW | Merge into the post above | Thin; overlaps |
| [Elevating outdoor living: the future of comfort and design](https://www.bromic.com/blog/the-future-of-comfort-and-design/) | RES-AW | Merge into the post above | About 400 words, no product |
| [Elevating your outdoor space: fire pits and radiant heaters](https://www.bromic.com/blog/elevating-your-outdoor-space-the-perfect-blend-of-firepits-and-radiant-outdoor-heaters/) | RES-AW | Keep and fix | Typos (complimentary/complementary); legacy dated links |

### Workplace and healthcare (ARC, COM · AW): off the US funnel

| Post | Cell | Call | Why |
|---|---|---|---|
| [The future of workplace is shared](https://www.bromic.com/blog/the-future-of-workplace-is-shared-outdoor-space-amenities/) | ARC-AW | Merge | Three workplace posts with dated return-to-office predictions; keep one, refreshed, linked to The Boardwalk case study |
| [The evolution of workplace designs](https://www.bromic.com/blog/the-evolution-of-workplace-designs-and-outdoor-settings/) | ARC-AW | Keep (merge target) and fix | Broken newsletter CTA |
| [New workplaces: driving occupancy with outdoor amenities](https://www.bromic.com/blog/new-workplaces-driving-occupancy-with-outdoor-amenities/) | COM-AW | Merge | Wakefield Research cited via a Google Drive file |
| [Back to work: offices building a sense of home](https://www.bromic.com/blog/back-to-work-offices-building-a-sense-of-home-well-being/) | ARC-AW | Retire, 301 to the workplace post | "By the end of 2024" is past |
| [Keeping patients warm: radiant heat and hypothermia](https://www.bromic.com/blog/keeping-patients-warm-how-radiant-heat-can-reduce-the-risk-of-hypothermia/) | COM-AW | Retire on US, 301 to the Clínica Las Condes case study | Medical claims need regulatory review; off the US funnel |
| [What professionals are saying about Bromic Heating](https://www.bromic.com/blog/what-professionals-are-saying-about-bromic-heating/) | ARC-CO | Unpublish until verified | The three testimonials cannot be traced to a project or a person [[VERIFY: are these real, permissioned testimonials — Megan Spies]] |

## Site-wide fixes for 454 Creative

1. Restore the missing body images (lazy-load sources render empty) and add alt text everywhere.
2. Replace every /2020/–/2023/ dated permalink in post bodies with the current URL.
3. Point structured data at www.bromic.com, not `us.bromic-prod.454.agency`.
4. Wire the "Never miss an episode" blocks to the newsletter form.
5. Settle names: Smart-Heat (® or ™), Freestanding vs Portable, Affinity everywhere a controller is named.
6. Paginate or index the blog so all 73 posts are reachable from /blog/.

## Merge and redirect plan

| Keep (target URL) | 301 from |
|---|---|
| /blog/which-outdoor-heater-collection-is-right-for-you/ | what-bromic-outdoor-heater-should-i-use…, do-patio-heaters-work, thinking-of-getting-an-outdoor-heater, best-way-to-heat-an-outdoor-patio, best-type-of-heater-for-outdoors |
| /blog/gas-or-electric-patio-heaters-which-one-is-right-for-me/ (new body: RES-CO-01) | how-to-select-the-right-fuel-source-for-your-space |
| /blog/how-to-integrate-your-bromic-smart-heat-link-with-your-home-automation-system/ | how-do-i-connect-my-outdoor-radiant-heater-to-my-home-automation-system |
| /blog/how-to-install-the-low-clearance-recess-kit/ | the-bromic-low-clearance-recess-kit-a-practical-solution… |
| /blog/how-should-i-mount-my-outdoor-electric-patio-heater/ | is-wall-mounting-your-outdoor-heater-the-right-choice-for-you |
| /blog/stylish-resilient-coastal-outdoor-heaters/ | combating-corrosion-outdoor-heating-in-coastal-environments |
| /blog/are-infrared-outdoor-heaters-safe/ | top-tips-for-outdoor-heaters-safety |
| /blog/how-long-do-propane-patio-heaters-last/ | outdoor-propane-patio-heater-buying-guide |
| /blog/freestanding-heaters-dont-need-to-be-clunky/ | the-power-of-freestanding-what-to-look-for… |
| /blog/elevating-outdoor-living-with-design-forward-heating/ | how-outdoor-heating-can-transform-your-outdoor-space, the-future-of-comfort-and-design |
| /blog/the-evolution-of-workplace-designs-and-outdoor-settings/ | the-future-of-workplace-is-shared…, new-workplaces-driving-occupancy…, back-to-work-offices… |
| /case-study/tungsten-electric-heaters-at-clinica-las-condes/ | keeping-patients-warm… |

Net: 73 posts become about 55, and none of our Hub drafts goes live on a new URL that competes with an existing post.
[[VERIFY: redirect plan and timing — Brian Kim with 454 Creative]]
