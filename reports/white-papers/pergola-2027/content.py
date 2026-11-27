# Bromic white paper: heaters built into pergolas (2027). Words, figures and sources.
# Rules: every figure carries [n] -> SOURCES; product facts only from data/product-facts.json and
# data/product-marketing/*.json; open facts are marked "to confirm"; pergola makers' figures from their own published documents.
TITLE = 'Heat The Pergola · Bromic Planning Guide 2027'
FILE = 'Bromic-Heat-The-Pergola-Planning-Guide-2027'
FOLIO = 'Heat The Pergola · Planning Guide 2027'

NOTE = ('Draft for review. Product facts come from Bromic launch material, the Lookbook 2026, cut sheets and manuals, and await Product '
        'team sign-off. Pergola figures come from each maker\'s published documents as read in November 2026; the sketches show '
        'mounting concepts, not engineering drawings, and every install follows the heater manual, the pergola maker\'s guidance, '
        'the local authority and a licensed electrician. Survey figures are as published; market-size figures are a research '
        'firm\'s own estimate.')

SOURCES = []          # numbered in order of first citation by c()
SRC, _N = {}, {}
def S(key, text): SRC[key] = text
def c(*keys):
    """Cite one or more sources; numbers are given in order of first citation."""
    out = []
    for k in keys:
        if k not in _N: SOURCES.append(SRC[k]); _N[k] = len(SOURCES)
        out.append(str(_N[k]))
    return ','.join(out)

FRAMES = []           # (name, colour, maker) for the colour sketch; filled with the structures research
PAGES = []            # filled below

# ---------- sources (numbered in order of first use) ----------
S('aia', 'The American Institute of Architects, Home Design Trends Survey Q3 2026 (special-function rooms, Q2 2026 data; net % of residential architecture firms reporting rising minus falling popularity). hdts.aia.org/2026/reports/2026-q3/2026-Q3-Home-Design-Trends-Survey.pdf')
S('hz26', 'Houzz, 2026 U.S. Houzz Outdoor Trends Study (1,191 U.S. Houzz users, 25 Apr–6 May 2026), June 2026. houzz.com/magazine/10-outdoor-remodeling-trends-to-know-for-2026-stsetivw-vs~185305660')
S('hz24', 'Houzz, 2024 U.S. Houzz Outdoor Trends Study (over 1,100 homeowners), June 2024. houzz.com/magazine/10-outdoor-renovation-trends-everyone-should-know-about-stsetivw-vs~176358500')
S('gmi', 'Global Market Insights, Outdoor Living Structure Market, report GMI11089, September 2026 (the firm\'s own estimate; other firms\' estimates vary). gminsights.com/industry-analysis/outdoor-living-structure-market')
S('tb', 'TouchBistro with The Harris Poll, survey of 1,200+ full-service restaurant operators in the U.S. and Canada, 2–25 Oct 2025 (vendor-commissioned). touchbistro.com/blog/patio-season-guide-for-restaurants/')
S('noaa', 'NOAA Office for Coastal Management, Fast Facts: Economics and Demographics (2020 data). coast.noaa.gov/states/fast-facts/economics-and-demographics.html')
S('nyc', 'NYC Department of Buildings, Local Law 154 of 2021, building electrification. nyc.gov/site/buildings/codes/ll154-building-electrification.page')
S('vic', 'Premier of Victoria, "New Victorian homes to go all electric from 2024". premier.vic.gov.au/site-4/new-victorian-homes-go-all-electric-2024')
S('deck', 'Bromic Heating, Tungsten Electric Series II launch deck, July 2026 (internal).')
S('look', 'Bromic Heating, Lookbook 2026.')
S('site', 'Bromic Heating product pages for Tungsten Smart-Heat Electric, Platinum Smart-Heat Electric and Marine, Eclipse Smart-Heat Electric and Affinity Smart-Heat controls, read 29 Oct 2026 (values to be confirmed against 2026 cut sheets).')
S('man2', 'Bromic Heating, Tungsten Smart-Heat Electric Select & Coastal installation manual (2026) and LC Ceiling Recess Kit for Tungsten Series II instructions (2025), dealer-hosted copies.')
S('plclr', 'Bromic Heating, Platinum Electric Low-Clearance Ceiling Recess Kit manual (2300 W & 3400 W). cdn.shopify.com/s/files/1/0082/0704/0627/files/Platinum-Electric-Low-Clearance-Ceiling-Recess-Manual.pdf')
S('tman1', 'Bromic Heating, Tungsten Smart-Heat Electric owner manual v2.0 USA (Series I; 2000–6000 W), dealer-hosted. cdn.shopify.com/s/files/1/0826/8850/8215/files/Bromic_Tungsten_Smart_Heat_Electric_Owner_Manual.pdf')
S('faq', 'Bromic Heating, FAQs (retailer-hosted PDF). cdn.shopify.com/s/files/1/0560/7263/4525/files/Bromic_-_FAQs.pdf')
S('gasman', 'Bromic Heating, Tungsten Smart-Heat Gas 300/500 installation manual v1.5 USA-Canada (retailer-hosted). poolwarehouse.com/wp-content/uploads/2019/04/Bromic-Tungsten-Smart-Gas-Radiant-Heat-Patio-Heater-Installation-Manual.pdf')
S('calc', 'Bromic Content Hub calculation model: 20 ft² a seat (NAFEM space-planning chart, top of the full-service range); heaters = area ÷ (coverage × cover factor × climate factor); partly covered 1.0, cool 0.85.')
S('privlux', 'Privlux, "Pergolas with integrated heaters and fans" (pergola builder). privluxinc.com/post/pergolas-with-integrated-heaters-and-fans-comfort-beyond-shade')
S('hanso', 'Hansø, Pro pergola heater compatibility and placement guide. help.hansohome.com/en/articles/12605580-pro-pergola-heater-compatibility-placement-guide')
S('doma', 'Domaform (Bromic dealer), "Patio heater for a pergola: electric options that mount close to the roof". domaform.com/blogs/guides/patio-heater-for-a-pergola-electric-options-that-mount-close-to-the-roof')
S('nycfs', 'NYC Fireplace Shop, buying guides: "Best patio heater for a covered patio" and "Marine-grade patio heaters for waterfront homes". nycfireplaceshop.com/blogs/buying-guides/')
S('cave', 'Pergola Cave, "Louvered pergola accessories" (cost ranges and package tiers). pergolacave.com/blogs/blog/louvered-pergola-accessories')
S('olg', 'The Outdoor Living Group (UK), Patio heater guide, quoting louvred-roof and canopy instructions. theoutdoorlivinggroup.com/wiki/patio-heater/')
S('tsbc', 'Technical Safety BC, incident investigation "Radiant heater causes patio fire", 27 Oct 2022. technicalsafetybc.ca/regulatory-resources/incident-investigations/radiant-heater-causes-patio-fire')
S('mont', 'Montgomery County MD, Department of Permitting Services, Guidelines for outdoor circuits feeding heaters. montgomerycountymd.gov/DPS/Resources/Files/COMBUILD/Electrical-Circuit-Guidelines-outdoor-heaters.pdf')
S('renson', 'Renson, pergola options: Lineo Heat and Beam Heat & Sound. renson.net/en-us/products/pergolas/options/heating-and-speakers')
S('strxinf', 'StruXure, "StruXure + Infratech: redefining the outdoor experience", 23 Dec 2025; StruXure heat page. struxure.com/blog/struxure-infratech-redefining-the-outdoor-experience/')
S('hguide', 'HomeGuide, louvered pergola cost guide (heater upgrade price ranges). homeguide.com/costs/louvered-pergola-cost')
S('strx', 'StruXure, Residential Architectural Binder (2025), Pivot 6 MAX louver page, FAQ and "The louvered pergola component design". struxure.com/wp-content/uploads/2025/07/StruXure-Residential-Architectual-Binder.pdf')
S('rens', 'Renson, Camargue and Algarve specification texts and product information (TF_Camargue_USA, US-06/26; TF_Algarve_EN); pergola warranty terms. dam.renson.net; renson.net/en-us/products/pergolas/warranty2')
S('equi', 'Equinox (OmniMax), dealer training deck (Nov 2023), installation guide EQU-024 (2023), extruded louver tech sheet EQU-012, overview booklet EQU-025. equinoxroof.com/wp-content/uploads/')
S('sunc', 'Suncoast Enclosures, Louvered Roof product page. suncoastenclosures.com/louvered-roof/')
S('corr', 'Corradi USA, Alba louvered roof brochure (International Builders\' Show exhibitor literature). buildersshow.com/assets/docs/ibs/pressReleases/ExhibitorProductLit_45552_CorradiUSAAlbaLouveredRoofBrochure.pdf')
S('plux', 'Pergolux, Pergola 4 technical specifications; Pergolux heater page. pergolux.co.uk/pages/pergola-4-technical-specifications')
S('louv', 'Louvretec, Design Manual 2025, Section 2 (Opening Roofs) and Section 4 (Structural Frames). eboss.co.nz/assets/literature/103/')
S('azen', 'Azenco Outdoor, R-Blade product page and Q&A. azenco-outdoor.com/r-blade/')

S('infm', 'Competitor documents (heater competition), read Nov 2026 and held in the Bromic Content Hub\'s Tungsten Series II framework (needs approval: Specification and compliance): C-Series owner\'s instruction manual 2024; W/WD flush mount frame specifications; FAQs; Marine UpGrade page; limited warranty (2024 terms); controls and Smart Switch sell sheet. infratech.com')
S('owner', 'Bromic Heating, owner guidance on recommended mounting heights and Tungsten Classic warranty, 27 Nov 2026 (internal).')
S('pq', 'Pergola industry research compiled for this guide, November 2026: pergola makers\' specification sheets, design manuals and install guides; dealer and installer guides; installer forums and inspectors\' notes (list held by the content team).')

S('qlou', 'Louvretec, Product Guide: Heating (Bromic heaters under Louvretec Opening Roofs). eboss.co.nz/assets/literature/103/29095/Louvretec-Product-Guide-Heating.pdf')
S('qgal', 'Gallagher\'s Patio Structures (Renson dealer, Toronto), homeowner review. gallagherspatiostructures.com')
S('qsky', 'Skyview (StruXure dealer), "Year-round comfort" project page: Bromic radiant heaters integrated into StruXure louvered roofs. skyviewusa.com/projects/year-round-comfort/')
S('qrev', 'Reveal Design Chicago, rooftop decks: Apollo and Pratic louvered roofs with Bromic heaters. revealdesignchicago.com/rooftop-decks-old')
S('qbella', 'Bella Outdoor Living, Predator Ridge range restaurant and bar: Bromic 6000 W heaters in a retractable-roof pergola. bellaoutdoor.ca/project/predator-ridge-range-restaurant-bar/')

import math, json, html
E = html.escape
json_dumps = json.dumps
def n_heaters(area, cov, f=0.85): return math.ceil(area / (cov * f) - 1e-9)
def img(i, alt=''): return f'<img src="img/{i}.jpg" alt="{alt}">'

PAGES.append(dict(type='cover', img='w-bromicatria23', alt='A black louvered pergola at night, warmed by recessed Platinum Electric heaters', pos='50% 45%',
    kicker='Bromic Planning Guide 2027', title_html='Heat The<br><em>Pergola</em>',
    sub='Heat built into the structure',
    blurb='For pergola makers, dealers, builders and specifiers: what the market wants, and how Tungsten, Platinum and Eclipse fit today\'s pergolas.',
    note='Tungsten Series II · Platinum · Eclipse · Affinity'))

PAGES.append(dict(type='exec', kicker='Executive Summary', h2='The Pergola Is Now The Outdoor Room', blocks=[
  ('lede', 'Homeowners are roofing their patios and wiring them for year-round use. The pergola is where that money goes, and heat is what turns three seasons into twelve.'),
  ('cols', [[
    ('h4', 'Key insights'),
    ('ul', [
      f'**Outdoor rooms lead.** Architects\' net score for outdoor living rooms rose from 40% to 51% in a year [{c("aia")}]; shade structures in Houzz projects rose 15 points to 35% [{c("hz26")}].',
      f'**Our market research shows six things pergola buyers want from heat:** a slim look on slim beams, durability by the water, smart control that joins the rest of the outdoor room, clean installs, colours that match the frame, and an option for every budget [{c("pq")}].',
      '**Pergola makers are choosing heater partners now,** and building heat into their own systems.',
      '**Control is converging:** roofs, screens and lights already run from one app. Heat is the next piece, and it needs smart controls that integrate.',
    ]),
  ], [
    ('h4', 'So what'),
    ('ul', [
      '**Tungsten Series II answers the beam:** about 14% narrower, a third lighter, one single post with the wiring inside it.',
      '**Coastal answers the sea:** 316 marine-grade stainless under a corrosion-resistant coating.',
      '**Affinity answers the app:** Bromic\'s own controls, with Alexa, Google, Control4, Crestron and Lutron.',
      '**A portfolio answers the budget:** Tungsten Classic and Select give the same heat at two price points; Platinum is the architectural choice; Eclipse brings heat and light to the centre beam.',
    ]),
    ('box', 'Action plan', [('ul', [
      '**Pergola makers:** add a Bromic heat option and pre-wired heater positions to the standard spec.',
      '**Dealers:** quote heater, control and circuit together, at build time.',
      '**Bromic:** a Series II bracket and colour kit for the leading pergola systems in 2027.',
    ])], True),
  ]]),
  ('h4', 'Contents'),
  ('html', '<ol class="toc">' + ''.join(f'<li><span>{i:02d}</span><span>{t}</span><span>{p}</span></li>' for i, (t, p) in enumerate([
      ('Fits the leading pergola systems', 3), ('The trends', 4), ('What our research shows', 6), ('Slim · Coastal · Smart · Clean install · Colour', 7),
      ('A portfolio for every pergola', 12), ('Every pergola type · every beam', 14), ('Against the competition', 16),
      ('Planning: heights, sizing, circuits', 17), ('For pergola makers and dealers · Sources', 19)], 1)) + '</ol>'),
]))

BR_IN = ['StruXure', 'Renson', 'Louvretec', 'Apollo', 'Pratic']
BR_FIT = ['Azenco', 'Equinox', 'Suncoast', 'Corradi', 'Pergolux', 'Stratco', 'Gibus', 'KE']
wall = lambda L, cls: ''.join(f'<div class="wm {cls}">{n}</div>' for n in L)
QUOTES = [
  ('Designed specifically with low-clearance, semi-enclosed outdoor spaces in mind, this heater minimizes light emission to blend seamlessly under your Louvretec Opening Roof.', f'Louvretec, on Bromic Platinum Electric [{c("qlou")}]'),
  ('We purchased a Renson Pergola System and Bromic Electric Heaters – they fit [the] new deck like a glove.', f'Homeowner, Toronto, via a Renson dealer [{c("qgal")}]'),
  ('To extend the usability of the space into cooler months, Bromic radiant heaters were integrated into the structure.', f'StruXure dealer, Detroit [{c("qsky")}]'),
  ('The end result is a space that\'s not only beautiful, but actually works for how we want to use it.', f'Homeowner, Livonia, Michigan; StruXure pergola with Bromic heaters [{c("qsky")}]'),
]
PAGES.append(dict(type='brands', kicker='Works With The Leading Pergola Systems', h2='Built In On The World\'s Leading Pergolas', blocks=[
  ('lede', 'From louvered roofs in Chicago to opening roofs in Auckland, Bromic heaters are built into the pergolas homeowners and venues choose most.'),
  ('h4', 'Installed with Bromic'),
  ('html', f'<div class="wall">{wall(BR_IN, "in")}</div>'),
  ('h4', 'Made to fit'),
  ('html', f'<div class="wall">{wall(BR_FIT, "fit")}</div>'),
  ('html', '<div class="quotes">' + ''.join(f'<blockquote><p>"{q}"</p><small>{a}</small></blockquote>' for q, a in QUOTES).replace('[', '<sup>').replace(']', '</sup>').replace('<sup>the</sup>', '[the]') + '</div>'),
  ('photos', [('w-strx-230222-bromic-dc-6', 'Tungsten Electric on a louvered pergola.'), ('w-kion-sui-madrid-spain-tungsten-electric-4', 'Tungsten Electric under an opening roof, Madrid.')], 200),
  ('p', f'"Installed with Bromic": brands shown with Bromic heaters by their dealers or partners [{c("qsky","qgal","qlou","qrev")}]. "Made to fit": systems whose published beams and posts take Bromic\'s mounts (pages 14–15). Brand names are shown as text; logos and quotes need each company\'s permission before external use.'),
]))

PAGES.append(dict(type='trends', kicker='The Trends · 1 of 2', h2='Homeowners Are Building Roofs, Then Wiring Them', blocks=[
  ('lede', 'The money in outdoor living is moving under a roof, and the roof is becoming a room with power, light and heat.'),
  ('stats', [
    ('51%', f'Net share of residential architecture firms reporting rising demand for outdoor living rooms, Q2 2026, up from 40% a year earlier. Heated exterior space rose from 12% to 16% [{c("aia")}].', 'AIA Home Design Trends Survey Q3 2026; net index, not a share of homes'),
    ('35%', f'Homeowners upgrading structures who added shade structures, up 15 percentage points on the 2024 study [{c("hz26")}].', 'Houzz 2026 U.S. Outdoor Trends Study, 1,191 users'),
    ('74%', f'Outdoor kitchens that are fully (44%) or partly (30%) covered; 68% of those projects install plumbing, electrical or heating systems [{c("hz26")}].', 'Houzz 2026 U.S. Outdoor Trends Study'),
    ('$977M', f'US outdoor living structures market in 2025; pergolas and patio covers are 35% of a global market put at $2.5 billion, rising 6.3% a year to 2035 [{c("gmi")}].', 'Global Market Insights, September 2026; one firm\'s estimate'),
  ]),
  ('photo', 'w-strx-230222-bromic-dc-1', 330, 'Tungsten Electric on a louvered pergola: the roof makes the room; heat makes it usable in the cold months.', '50% 30%'),
]))

PAGES.append(dict(type='trends', kicker='The Trends · 2 of 2', h2='Smart, Coastal, Electric', blocks=[
  ('stats', [
    ('68%', f'Outdoor products bought in 2024 renovations that can be monitored or controlled from a phone [{c("hz24")}].', 'Houzz 2024 U.S. Outdoor Trends Study, 1,100+ homeowners'),
    ('81%', f'Full-service restaurants in the U.S. and Canada that offer patio or outdoor dining; patios bring in up to 49% of sales in peak season [{c("tb")}].', 'TouchBistro with The Harris Poll, Oct 2025; vendor-commissioned'),
    ('129M', f'People living in US coastal counties: almost 40% of the population, and the salt air that comes with it [{c("noaa")}].', 'NOAA, 2020 data'),
    ('2024', f'The year New York City began phasing out on-site combustion in new buildings, and Victoria moved new homes needing a planning permit to all-electric [{c("nyc","vic")}].', 'NYC Local Law 154; Premier of Victoria. Neither names outdoor heaters'),
  ]),
  ('cols', [[
    ('h3', 'What this means for the pergola'),
    ('ul', [
      '**One app for the roof and the heat.** Louvres, screens and lights are already motorised; heat should join them.',
      '**Built for salt and chlorine.** Coastal and pool-side pergolas need heaters made for them.',
      '**Electric first.** Infrared electric heat needs no gas line, no flue and no ventilation calculation under a roof.',
    ]),
  ], [
    ('photo', 'w-slc-bromic-heater-1-cropped', 200, 'Eclipse pendants on a louvered pergola: heat and light from the centre of the room.'),
  ]]),
  ('photo', 'w-gazebo-bromic', 300, 'A louvered pergola as the backyard\'s main room.', '50% 55%'),
]))

RS = [
  ('t2-single-post-black', 'Slim Structures Call For Slim Heat', 'Pergolas are designed around clean, slim lines. Buyers want heat that reads as part of the architecture, not an add-on.', 'Tungsten Series II: about 14% narrower and a third lighter, on one single post.'),
  ('pf-tungsten-coastal', 'Life By The Water', 'Many pergolas sit by the sea or a pool, where salt and chlorine test every metal on the structure.', 'Tungsten Coastal: 316 marine-grade stainless under a corrosion-resistant coating. Platinum Marine for the most exposed sites.'),
  ('w-bromic-heating-app-blog-image', 'One Connected Outdoor Room', 'Owners run the roof, lights and screens from their phone. They expect heat to join them, with smart controls that integrate.', 'Affinity Smart-Heat and the Bromic app: zones, schedules, dimming, voice and home-system control.'),
  ('rv-pr-d-social-black-ceiling-post-graphite-4x5', 'Clean Installs, Nothing On Show', 'Pergola makers hide wiring inside posts and beams. Exposed conduit and junction boxes undo that work.', 'A single post with the cable inside it and no junction box on show.'),
  ('rv-pr-select-graphite-angled-bracket', 'Colour That Matches The Frame', 'Frames come in black, white, grey and bronze. The heater should sit with the frame, not against it.', 'Tungsten Select in black, white and graphite; Platinum in black or white glass.'),
  ('l-008-059', 'High-Performance Heat At Every Budget', 'High-performance heaters do not fit every pergola customer\'s budget, and the heater is often the first line cut.', 'Tungsten Classic and Select give the same heat coverage at two price points; Platinum for the architectural top end.'),
]
PAGES.append(dict(type='research', kicker='What Our Research Shows', h2='Six Things Pergola Buyers Want From Heat', blocks=[
  ('p', f'We studied pergola makers\' specifications, dealer and installer guides, and the questions that come up on real projects [{c("pq")}]. Six themes stood out. Each is an opportunity, and Bromic has an answer for each.'),
  ('html', '<div class="rs">' + ''.join(f'<div class="rsc"><div class="rsi">{img(i, t)}</div><div class="rst"><span class="rn">{n:02d}</span><h3>{t}</h3><p>{w}</p><p class="ra"><b>Bromic:</b> {a}</p></div></div>' for n, (i, t, w, a) in enumerate(RS, 1)) + '</div>'),
]))

PAGES.append(dict(type='issue', kicker='Slim Structures', h2='A Slimmer Heater For A Slim Beam', blocks=[
  ('p', 'Louvered pergolas sell on clean lines: 8 in beams in the US, 230–260 mm frames in Europe. Tungsten Series II was drawn for exactly this: narrower, lighter and on one post.'),
  ('h4', 'Side view'),
  ('diag', 'footprint', '680 340', 'End views under the same 6 in beam, drawn to one scale.'),
  ('h4', 'Front view'),
  ('diag', 'front', '760 260', 'Front views of the 3 and 6 kW bodies, drawn to one scale (launch deck).'),
  ('table', {'head': ['', 'Tungsten Series I', 'Tungsten Series II (Select, Coastal)'], 'rows': [
    ['**Width**', '214 mm (8.4 in)', '*183 mm (7.2 in): about 14% narrower'],
    ['**Weight**', '19.8–22 lb', '*13–15 lb: about a third lighter'],
    ['**Mount**', 'Two suspension tubes', '*One single post; no junction box on show'],
    ['**Water rating**', 'IPX4', '*IPX5: ready for rain through open louvres'],
  ]}),
  ('p', f'Widths and lengths: launch deck [{c("deck")}]; weights: manuals [{c("tman1","man2")}]. Depth is not compared until both are measured the same way.'),
]))

PAGES.append(dict(type='issue', kicker='Life By The Water', h2='Built For Salt Air', blocks=[
  ('lede', 'Coastal and pool-side pergolas are where heaters are tested hardest. Pergola makers handle it in different ways: some limit finish warranties near the sea, others specify marine-grade stainless hardware. A heater under that roof should be built to the same standard.'),
  ('cols', [[
    ('h4', 'Tungsten Coastal'),
    ('ul', ['**Two layers:** 316 marine-grade stainless steel under a high-temperature, corrosion-resistant coating.', '**Recess kit** in powder-coated 316 stainless, IPX5.', '**4 and 6 kW**, 208 and 240 V, black or white.', '**For coastal homes and venues**, not marine craft.']),
    ('h4', 'Platinum Electric Marine'),
    ('ul', ['AISI 316 stainless; IPX5 (IP55 on 4500 W).', 'Warranty 5 years on land-based installs.']),
  ], [
    ('diag', 'coastal', '470 200'),
    ('box', 'Care by the coast', [('p', f'Stainless is not stain-free. Bromic\'s manuals ask for salt spray to be wiped off and a fortnightly clean by the coast, with a yearly check by a qualified technician [{c("tman1","plclr")}].')]),
  ]]),
  ('photo', 'l-001-000', 300, 'Tungsten on a coastal covered terrace.'),
  ('p', f'Sources: launch deck and Lookbook [{c("deck","look")}], product pages [{c("site")}]. Coastal body material and coating name: to confirm with the Product team.'),
]))

APP = ['**Zones:** group the heaters over the dining table, the lounge and the bar, and run each on its own.', '**Schedules and timers:** warm before guests arrive, off when the evening ends.', '**Dimming in 1% steps** on the Dimmer: turn up on a cold night, down on a mild one.', '**Heat and light** set separately on Eclipse.', '**Voice:** Amazon Alexa and Google Assistant, no extra hub.', '**Home systems:** Control4, Crestron and Lutron; Ethernet and 0–10 V for building management on the 5-channel controller.']
PAGES.append(dict(type='issue', kicker='One Connected Outdoor Room', h2='Heat That Joins The Smart Home', blocks=[
  ('lede', 'The roof, the lights and the screens already answer to a phone. Affinity Smart-Heat brings the heat into the same evening: one app, every heater, every zone.'),
  ('cols', [[
    ('photo', 'w-bromic-heating-app-blog-image', 300, 'The Bromic app: every heater and zone on the phone.'),
  ], [
    ('photo', 'w-affinity-dimmer-5ch', 300, 'Affinity Smart-Heat 5-channel controller, run from the app.', '50% 50%'),
  ]]),
  ('cols', [[('h4', 'What the app does'), ('ul', APP[:3])], [('h4', ' '), ('ul', APP[3:])]]),
  ('box', 'Sized for pergolas', [('ul', ['**1, 2 or 5 channels**, each up to 6 kW at 208–277 V: one 6 kW Tungsten a channel.', '**Eclipse controller:** one Eclipse a channel, heat and light separately.', 'Compatibility with home systems varies by system and may need extra hardware. Wi-Fi and app features need compatible Affinity controls, sold separately.'])], True),
  ('p', f'Sources: Lookbook 2026 [{c("look")}], Affinity product pages [{c("site")}]. Controller capacities: to confirm with the Product team.'),
]))

ACC = [('rv-pr-d-social-black-ceiling-post-graphite-4x5', 'Single post', 'Fixes to a beam or ceiling; the cable runs inside it. No junction box on show.'),
       ('rv-pr-d-social-graphite-wall-bracket-black-4x5', 'Wall bracket', 'For posts, beam faces and walls: 14 in or 18 in reach.'),
       ('rv-pr-select-graphite-angled-bracket', 'Angled mounting bracket', 'Set positions at 15°, 30° and 45° to aim the heat at the seats.'),
       ('t2-low-clearance-recess', 'Low-clearance recess kit', 'Flush in a 7.5 in cavity, fan-ventilated, recess box supplied.')]
PAGES.append(dict(type='issue', kicker='Clean Installs', h2='One Post, Wiring Inside, Nothing On Show', blocks=[
  ('p', 'Pergola makers already route power through hollow posts and beams. Series II keeps it hidden all the way to the heater, and its accessories fit every surface a pergola offers.'),
  ('html', '<div class="acc">' + ''.join(f'<div class="ac"><div class="aci">{img(i, t)}</div><h4>{t}</h4><p>{d}</p></div>' for i, t, d in ACC) + '</div>'),
  ('cols', [[
    ('h4', 'Pitched-ceiling adaptor'),
    ('diag', 'pitched', '210 125'),
    ('p', 'For gabled pergolas and pitched patio covers: six set holes from 3/12 to 12/12.'),
  ], [
    ('h4', 'On the pergola'),
    ('ul', [
      '**Fix to the main structure:** the perimeter beam, a fan beam or a sub-beam. Never to a rotating louvre.',
      '**Run power inside** the hollow post and beam; where the post is also the downspout, use wet-location wiring.',
      '**Pre-wire every heater position** when the pergola goes up: it costs a fraction of a retrofit.',
    ]),
  ]]),
  ('p', f'Sources: launch deck [{c("deck")}], Series II manuals [{c("man2")}]. Tilt on 4 and 6 kW: the deck says 45°, the Series II manual 30°; to confirm with the Product team. Accessory images: Bromic renders of Series II.'),
]))

FRAMES[:] = [['Black', '#1E1E1E', 'pair: black'], ['White', '#F4F4F2', 'pair: white'], ['Bronze', '#5B4636', 'pair: black, graphite'], ['Gray', '#4A4D50', 'pair: graphite']]
PAGES.append(dict(type='issue', kicker='Colour That Matches The Frame', h2='Graphite Joins Black And White', blocks=[
  ('p', 'Pergola frames come in more than black and white: grey, anthracite and bronze are now standard on louvered roofs. Graphite gives Tungsten Select a third, full-body finish that sits with darker frames.'),
  ('diag', 'colours', '700 130'),
  ('table', {'head': ['Frame colour', 'Heater finish', 'The effect'], 'rows': [
    ['**Black**', 'Tungsten Select black; Platinum black glass; Eclipse', 'The heater disappears into the frame'],
    ['**White, beige, sandstone**', 'Tungsten Select white; Platinum white glass', 'Reads as part of a light roof'],
    ['**Gray, anthracite**', 'Tungsten Select graphite (4 and 6 kW)', 'A tone-on-tone match'],
    ['**Bronze, adobe, clay**', 'Tungsten Select black or graphite', 'Black and graphite with bronze give a warm, considered contrast'],
  ]}),
  ('photos', [('w-bromicatria23', 'Black Platinum Electric under a dark louvered roof.'), ('w-img-0194', 'A white louvered pergola: light heaters read as part of the roof.')], 230),
  ('p', f'Finishes: launch deck [{c("deck")}] and Lookbook [{c("look")}]. Coastal comes in black or white; Classic in black.'),
]))

def pcard(i, name, tags):
    return f'<div class="pc"><div class="pci">{img(i, name)}</div><h4>{name}</h4><div class="tags">' + ''.join(f'<span class="tg {k}">{t}</span>' for t, k in tags) + '</div></div>'
E_, G_, M_, F_, W_ = ('Electric', 'e'), ('Gas', 'g'), ('On the pergola', 'm'), ('Freestanding', 'f'), ('By the water', 'w')
PAGES.append(dict(type='portfolio', kicker='A Portfolio That Fits Every Need · 1 of 2', h2='Every Fuel, Every Setting, Every Mount', blocks=[
  ('p', 'Electric or gas, on the structure or beside it, inland or by the sea: one Bromic family covers every pergola and the space around it.'),
  ('html', '<div class="pgrid">' + ''.join([
    pcard('pf-tungsten-series-ii', 'Tungsten Electric Series II', [E_, M_]),
    pcard('pf-tungsten-coastal', 'Tungsten Coastal', [E_, M_, W_]),
    pcard('pf-platinum-electric', 'Platinum Electric and Marine', [E_, M_, W_]),
    pcard('pf-eclipse-pendant', 'Eclipse pendant', [E_, M_]),
    pcard('pf-eclipse-freestanding', 'Eclipse Freestanding', [E_, F_]),
    pcard('pf-tungsten-gas', 'Tungsten Gas', [G_, M_]),
    pcard('pf-platinum-gas', 'Platinum Gas', [G_, M_]),
    pcard('pf-tungsten-freestanding-gas', 'Tungsten Freestanding Gas', [G_, F_]),
  ]) + '</div>'),
  ('table', {'head': ['On the pergola', 'How', 'Heaters'], 'rows': [
    ['**Beam or ceiling**', 'Single post, angled to 45°', 'Tungsten Select, Coastal; Platinum on its 8 in pole'],
    ['**Post or wall**', 'Wall bracket, 14 or 18 in reach', 'Tungsten, Platinum, Eclipse wall arm'],
    ['**Pitched roof**', 'Pitched-ceiling adaptor, 3/12 to 12/12', 'Tungsten Series II'],
    ['**Over the table**', 'Pendant from the centre or fan beam', 'Eclipse on 8, 24 or 48 in poles'],
    ['**Solid roof or bay**', 'Flush recess, low-clearance kit', 'Tungsten Select, Coastal (7.5 in); Platinum (7.1 in)'],
    ['**Open pergola, no power**', 'Freestanding beside the seats', 'Eclipse Freestanding; Tungsten Freestanding Gas'],
  ]}),
  ('p', f'Gas under a roof follows its ventilation rules (page 18) and cannot be recessed [{c("gasman","faq")}].'),
]))

def lcard(tier, name, i, rows, best=False):
    return (f'<div class="lc{" best" if best else ""}"><div class="tier">{tier}</div><h3>{name}</h3><div class="lci">{img(i, name)}</div>'
            + ''.join(f'<div class="lr"><b>{a}</b><span>{b}</span></div>' for a, b in rows) + '</div>')
PAGES.append(dict(type='portfolio', kicker='A Portfolio That Fits Every Need · 2 of 2', h2='The Same Warmth At Every Price Point', blocks=[
  ('lede', 'Tungsten Classic and Tungsten Select deliver the same heat coverage. The customer chooses the look and the features; the warmth is the same.'),
  ('html', '<div class="ladder">' + ''.join([
    lcard('Good · $', 'Tungsten Classic', 't2-classic', [('Heat', '2, 3, 4, 6 kW · 65–160 ft²'), ('Finish', 'Black, stainless end covers'), ('Mount', 'Proven two-tube mount'), ('Warranty', '2 years'), ('Controls', 'Affinity On/Off or Dimmer')]),
    lcard('Better · $$', 'Tungsten Select', 't2-select-black', [('Heat', 'Same as Classic · 65–160 ft²'), ('Finish', 'Black, white, graphite; 3 fronts'), ('Mount', 'Single post; 7.5 in recess; IPX5'), ('Warranty', '3 yr heater, 7 yr elements'), ('Controls', 'Affinity Dimmer and app')]),
    lcard('Best · $$$', 'Platinum Electric', 'w-platinum-black', [('Heat', '2300–4500 W · 65–143 ft²'), ('Finish', 'Glass-ceramic face, 2.1 in deep'), ('Mount', 'Pole, wall, 7.1 in recess'), ('Warranty', '3 years (Marine 5 on land)'), ('Controls', 'Affinity Dimmer, app, home system')], True),
    lcard('The Centre', 'Eclipse', 'w-eclipse-electric', [('Heat', '2,900 W · 121 ft²'), ('Light', 'Dimmable 3000K LED ring'), ('Mount', 'Pendant, 8–48 in poles'), ('Warranty', '3 years'), ('Controls', 'Affinity Eclipse controller')]),
  ]) + '</div>'),
  ('p', f'Classic launches in January 2027; Select and Coastal launched in October 2026 [{c("deck")}]. Classic warranty: Bromic [{c("owner")}]; others: launch deck and product pages [{c("deck","site")}]. Heat areas: product pages; the Series II manual lists up to 64–144 ft², to confirm. Relative price points only: list prices come from Bromic sales operations.'),
  ('photo', 'l-008-059', 190, 'Tungsten over a pergola dining table.', '50% 30%'),
]))

TYP = [(dict(type='louvered', heaters=[['t', 0.25], ['e', 0.5], ['t', 0.75]], tables=[0.5], span=168), 'Louvered aluminium roof', 'Tungsten Select on single posts under the perimeter beam; Eclipse from a fan beam over the table.'),
       (dict(type='louvered', mat='dark', wall=True, heaters=[['wl', 0], ['t', 0.65]], tables=[0.55], span=144), 'Attached patio cover', 'Platinum or Tungsten on the wall bracket on the house side; Tungsten under the front beam.'),
       (dict(type='timber', mat='timber', heaters=[['t', 0.3], ['t', 0.72]], tables=[0.5], span=156, bh=10), 'Open timber pergola', 'Tungsten Select or Coastal on single posts under the main beam, below the rafters.'),
       (dict(type='pavilion', mat='timber', heaters=[['r', 0.3], ['r', 0.72]], tables=[0.5], span=156), 'Pavilion with a solid roof', 'Tungsten or Platinum recessed flush in the ceiling with the low-clearance kit.'),
       (dict(type='fabric', mat='dark', heaters=[['wl', 0], ['wr', 1]], tables=[0.5], span=144, H=96), 'Retractable fabric roof', 'Heaters on the posts with the wall bracket, aimed in, below and clear of the fabric.'),
       (dict(type='louvered', bays=2, heaters=[['t', 0.16], ['e', 0.33], ['e', 0.67], ['t', 0.84]], tables=[0.33, 0.67], span=288, H=114), 'Multi-bay hospitality structure', 'Rows of Tungsten on the perimeter beams; Eclipse on the centre beam over tables.')]
PAGES.append(dict(type='types', kicker='Every Pergola Type', h2='Where Bromic Fits On Every Structure', blocks=[
  ('html', '<div class="tgrid">' + ''.join(f'<figure class="tt"><svg class="diag" data-type="{E(json_dumps(k))}" viewBox="0 0 360 200"></svg><figcaption><b>{t}</b>{d}</figcaption></figure>' for k, t, d in TYP) + '</div>'),
  ('p', 'Illustrations of mounting concepts, not engineering drawings. Every install follows the heater manual, the pergola maker\'s guidance and the local authority.'),
]))

BT = [(dict(w=2, h=8, wl='2 in', hl='8 in', gutter=True), 'Aluminium box beam with gutter', 'The common US louvered-roof beam. Tungsten: single post to the underside or a fan beam. Platinum: 8 in pole or wall bracket on the beam face.'),
      (dict(w=4, h=8, wl='4 in', hl='8 in'), 'Wide aluminium beam', 'Room for the post plate and cable entry. Tungsten: single post. Platinum: pole, or wall bracket on the inner face.'),
      (dict(w=5.9, h=10.2, wl='150 mm', hl='260 mm'), 'Deep European frame', 'Blades sit inside the frame. Keep heaters below the frame line, clear of the blades\' arc. Platinum: wall bracket on the frame profile.'),
      (dict(w=2, h=7.9, wl='50 mm', hl='200 mm', steel=True), 'Box beam, engineered roof', 'Custom spans by wind zone. Tungsten Coastal on a single post by the sea; Platinum Marine on its pole.'),
      (dict(w=5.5, h=9.25, wl='6×10', hl='9¼ in', timber=True), 'Timber beam', 'Tungsten on a single post into solid timber; keep 12 in above the heater to the rafters. Platinum on its pole.'),
      (dict(w=2, h=6, wl='2 in', hl='6 in', channel=True), 'Fan beam or accessory channel', 'The pergola maker\'s own mounting point across the bay: Eclipse pendant or Tungsten over the table.')]
PAGES.append(dict(type='beams', kicker='Every Beam', h2='How Tungsten And Platinum Mount To Any Beam', blocks=[
  ('p', f'Pergola beams vary by maker and market, from 8 in aluminium boxes in the US to deep frames in Europe and timber in traditional builds [{c("pq")}]. Tungsten Series II\'s single post needs only a 2.5 × 4 in plate; Platinum mounts on its 8 in pole, a wall bracket or a recess.'),
  ('html', '<div class="bgrid">' + ''.join(f'<figure class="bt"><svg class="diag" data-beamtype="{E(json_dumps(p))}" viewBox="0 0 260 205"></svg><figcaption><b>{t}</b>{d}</figcaption></figure>' for p, t, d in BT) + '</div>'),
  ('p', 'Beams and heaters drawn to one scale. Typical sizes from pergola makers\' published specifications.'),
]))

SC = [('Water rating', 'IPX4', 'IPX5 on Tungsten Series II, made for rain through open louvres'),
      ('Space around the heater', '18 in on all four sides; 6 in behind the face', '12 in to the ceiling and side walls'),
      ('By the sea', '316 stainless is a paid upgrade', 'Tungsten Coastal: 316 plus a corrosion-resistant coating, as standard'),
      ('Smart control', 'Third-party Wi-Fi switches; other controls "may void" the warranty', 'Bromic\'s own Affinity controls and app, with voice and home systems'),
      ('Recessing', 'Framed pocket of 2×8, lined in Type X drywall, flat ceilings only; cool-down after 4 hours', 'Dual fan-ventilated kits, recess box supplied: 7.5 in (Tungsten), 7.1 in (Platinum)'),
      ('Mounting', 'Brackets, a pole on a base, or a pair of drop rods', 'One single post; pitched adaptor; angles to 45°'),
      ('Element warranty', 'Elements rated to 5,000 hours; parts only, labour excluded (2024 terms)', '7 years on Series II elements'),
      ('One family for the patio', 'Fixed electric heaters only', 'Electric, Eclipse pendant and freestanding, built-in and freestanding gas')]
PAGES.append(dict(type='comp', kicker='Against The Competition', h2='Built For The Pergola. Ahead Where It Counts.', blocks=[
  ('lede', 'Dealers compare Bromic with the best-known heater partner in the pergola market. On the points that matter under a pergola, Bromic leads.'),
  ('html', '<div class="sc"><div class="sch"><span></span><span>The competition</span><span>Bromic</span></div>' + ''.join(f'<div class="scr"><b>{a}</b><span class="cx">{b}</span><span class="bx">{cc}</span></div>' for a, b, cc in SC) + '</div>'),
  ('p', f'Competitor facts from the competition\'s own manuals, warranty and pages [{c("infm")}]; Bromic facts from [{c("deck","look","faq","man2","plclr")}]. Bromic clearances from the FAQ; Series II figures to confirm. Comparative statements await Specification and compliance approval before external use.'),
  ('photo', 'w-mountain-view-retreat-platinum-electric-rece', 230, 'Platinum Electric recessed in a louvered roof.'),
]))

HT_ = [('Tungsten 2 and 3 kW', '8–9 ft'), ('Tungsten 4 kW', '8–10 ft'), ('Tungsten 6 kW', '8–12 ft'), ('Platinum 2300 and 3400 W', '8–9 ft'), ('Platinum 4500 W', '8–10 ft'), ('Eclipse 2,900 W (head)', '8–9 ft')]
SIZES = [('10 × 10 ft', 100), ('12 × 12 ft', 144), ('12 × 16 ft', 192), ('14 × 20 ft', 280), ('16 × 20 ft', 320), ('20 × 20 ft', 400)]
MODELS = [('Tungsten 4 kW', 130), ('Tungsten 6 kW', 160), ('Platinum 4500 W', 143), ('Eclipse', 121)]
PAGES.append(dict(type='plan', kicker='Planning · 1 of 2', h2='Where, How High, And How Many', blocks=[
  ('cols', [[
    ('h4', 'Mounting height, heater to floor'),
    ('table', {'head': ['Heater', 'Mount at'], 'rows': [[f'**{a}**', b] for a, b in HT_]}),
    ('p', f'Bromic recommended heights [{c("owner")}]. Wall or post mounts can sit lower, from 6 ft, angled at the seats [{c("site")}].'),
  ], [
    ('h4', 'Where and how to mount'),
    ('ul', [
      '**Perimeter beam:** Tungsten on its single post, angled 15–45° in toward the seats.',
      '**Fan beam over the table:** Eclipse pendant, or Tungsten centred over a long table.',
      '**Posts and walls:** wall bracket where the clear height is below 8 ft, or to reach the edge seats.',
      '**Solid bays and pavilions:** recess flush with the low-clearance kit.',
      '**Never on a louvre;** keep clear of louvre motors and the blades\' arc, and of fabric.',
      f'**Spacing:** at least 20 in between heaters; 12 in from the heater top to the ceiling; combustibles 3 ft from the face [{c("tman1","faq")}].',
    ]),
  ]]),
  ('h4', 'How many heaters'),
  ('p', f'Heaters = seating area ÷ (heat area × cover factor × climate factor), rounded up: partly covered 1.0, cool evenings around 40–50°F 0.85 [{c("calc")}]. Tungsten Classic and Select share the same heat areas.'),
  ('table', {'head': ['Pergola', 'Area'] + [m for m, _ in MODELS], 'rows': [[f'**{n}**', f'{a} ft²'] + [str(n_heaters(a, cv)) for _, cv in MODELS] for n, a in SIZES]}),
  ('p', 'Example: a 14 × 20 ft pergola is 280 ft²; 280 ÷ (160 × 0.85) = 2.06, so three Tungsten 6 kW heaters, on one Affinity 5-channel Dimmer with a wall switch.'),
]))

amps = lambda w, v=240: f'{w / v:.1f} A'
PAGES.append(dict(type='plan', kicker='Planning · 2 of 2', h2='Circuits, Controls And Gas', blocks=[
  ('cols', [[
    ('h4', 'Current at 240 V'),
    ('table', {'head': ['Heater', 'Output', 'Current'], 'rows': [
      ['**Tungsten**', '2 / 3 kW', f'{amps(2000)} / {amps(3000)} (calculated)'],
      ['**Tungsten**', '4 / 6 kW', f'{amps(4000)} / {amps(6000)} (calculated)'],
      ['**Platinum**', '2300 / 3400 / 4500 W', '9.6 / 14.2 / 18.8 A'],
      ['**Eclipse**', '2,900 W', '12.1 A'],
    ]}),
    ('p', f'Platinum and Eclipse from the product pages [{c("site")}]; Tungsten calculated as watts ÷ volts. On 208 V supplies, choose 208 V models.'),
    ('h4', 'Controls on every quote'),
    ('ul', ['**Affinity On/Off or Dimmer:** 1, 2 or 5 channels, up to 6 kW a channel at 208–277 V.', '**Affinity Eclipse controller:** one Eclipse a channel; or the Eclipse Dimmer Controller with remote.', '**Manual wall switch** as the local disconnect where the code asks for one.']),
  ], [
    ('h4', 'The circuit'),
    ('ul', [
      f'Each heater or controller channel is hard-wired by a licensed electrician on a dedicated circuit; check panel space first [{c("mont")}].',
      'GFCI and permit rules vary by jurisdiction. Ask the local inspector.',
      'Pre-wire every heater position when the pergola goes up.',
    ]),
    ('box', 'Gas under a pergola', [('ul', [
      f'Gas heaters cannot be recessed [{c("faq")}].',
      f'With a roof and more than two walls, at least 25% of the total wall area must be fully open, plus 30% of the rest [{c("gasman")}].',
      f'Tungsten Gas: 3 ft to combustibles above, 14 in with the heat shield; 8 ft minimum height [{c("gasman")}].',
      'Under most louvered roofs, electric is simpler: no gas line, no flue, no ventilation sums.',
    ])]),
  ]]),
  ('photo', 'w-vbb7509', 260, 'Tungsten Electric along the beams of a café pergola.'),
]))

PAGES.append(dict(type='check', kicker='For Pergola Makers And Dealers', h2='Make Heat Part Of Every Pergola', blocks=[
  ('cols', [[
    ('h4', 'What Bromic brings a pergola maker'),
    ('ul', ['**A heat option for your spec:** Classic, Select, Coastal, Platinum and Eclipse, in your frame colours.', '**CAD and Revit files** for your drawings and configurators.', '**A light load:** Series II weighs 13–15 lb on one 2.5 × 4 in plate.', '**IPX5** for heaters that see rain through open louvres.', '**Affinity** for app and home-system control alongside your roof.', '**The Bromic Partner Program:** partner pricing, design plans, extended warranty, one point of contact, project marketing.']),
    ('h4', 'Still to agree with each maker'),
    ('ul', ['Approved mounting points and fixings on their beams.', 'The frame warranty when a heater is fitted.', 'Where the heater circuit shares a post with the downspout.']),
  ], [
    ('h4', 'Dealer checklist'),
    ('ul', ['Ask how late and how cold they want to sit outside.', 'Measure the seating area and the clear height under the beam.', 'Note sea, pool and frame colour.', 'Show the portfolio: Classic, Select, Platinum, Eclipse.', 'Mark heater positions on beams, never louvres.', 'Pre-wire each position through the post and beam.', 'Affinity on the customer\'s phone at handover; zones and schedules set.', 'By the sea: show the fortnightly wipe-down.']),
    ('box', 'Bromic next steps', [('ul', ['A Series II bracket and colour kit for the leading pergola systems.', 'Affinity drivers confirmed for Control4, Crestron and Lutron.'])], True),
  ]]),
  ('photos', [('w-strx-230222-bromic-dc-3', 'Tungsten Electric on a louvered pergola.'), ('w-vbb7428', 'Tungsten on a pergola beam, aimed at the seats.')], 230),
]))

PAGES.append(dict(type='sources'))
PAGES.append(dict(type='back', img='w-kion-sui-madrid-spain-tungsten-electric-5', alt='Tungsten heaters in a louvered pergola restaurant',
  kicker='Bromic Partner Program', h2='You Build The Pergola. We Know How To Heat It.',
  text='Partner pricing, free heating design plans for your projects, extended warranty and one point of contact at Bromic.',
  cta='Join the Bromic Partner Program', site='bromic.com/lp-builders'))
