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

SOURCES = []          # filled in order of first use by S()
_SRC = {}
def S(key, text):
    """Register a source once and return its number."""
    if key not in _SRC:
        SOURCES.append(text); _SRC[key] = len(SOURCES)
    return _SRC[key]

FRAMES = []           # (name, colour, maker) for the colour sketch; filled with the structures research
PAGES = []            # filled below

# ---------- sources (numbered in order of first use) ----------
aia = S('aia', 'The American Institute of Architects, Home Design Trends Survey Q3 2026 (special-function rooms, Q2 2026 data; net % of residential architecture firms reporting rising minus falling popularity). hdts.aia.org/2026/reports/2026-q3/2026-Q3-Home-Design-Trends-Survey.pdf')
hz26 = S('hz26', 'Houzz, 2026 U.S. Houzz Outdoor Trends Study (1,191 U.S. Houzz users, 25 Apr–6 May 2026), June 2026. houzz.com/magazine/10-outdoor-remodeling-trends-to-know-for-2026-stsetivw-vs~185305660')
hz24 = S('hz24', 'Houzz, 2024 U.S. Houzz Outdoor Trends Study (over 1,100 homeowners), June 2024. houzz.com/magazine/10-outdoor-renovation-trends-everyone-should-know-about-stsetivw-vs~176358500')
gmi = S('gmi', 'Global Market Insights, Outdoor Living Structure Market, report GMI11089, September 2026 (the firm\'s own estimate; other firms\' estimates vary). gminsights.com/industry-analysis/outdoor-living-structure-market')
tb = S('tb', 'TouchBistro with The Harris Poll, survey of 1,200+ full-service restaurant operators in the U.S. and Canada, 2–25 Oct 2025 (vendor-commissioned). touchbistro.com/blog/patio-season-guide-for-restaurants/')
noaa = S('noaa', 'NOAA Office for Coastal Management, Fast Facts: Economics and Demographics (2020 data). coast.noaa.gov/states/fast-facts/economics-and-demographics.html')
bond = S('bond', 'Bond, "Bond Joins Somfy Group", Dayton NJ, 30 July 2026; CE Pro, "Olibra LLC, owner of Bond, joins Somfy Group", 30 July 2026. bondhome.io/bond-joins-somfy-group-an-exciting-new-chapter-begins/')
strxbond = S('strxbond', 'CE Pro, "Bond expands smart control integration for StruXure motorized pergolas", 23 Jan 2026. cepro.com/news/bond-expands-smart-control-integration-for-struxure-motorized-pergolas/624804')
infbond = S('infbond', 'CE Pro, "Bond adds smart control to Infratech outdoor heating systems via Wi-Fi switches", 8 Jul 2025. cepro.com/news/bond-adds-smart-control-to-infratech-outdoor-heating-systems-via-wi-fi-switches/619936/')
nyc = S('nyc', 'NYC Department of Buildings, Local Law 154 of 2021, building electrification. nyc.gov/site/buildings/codes/ll154-building-electrification.page')
vic = S('vic', 'Premier of Victoria, "New Victorian homes to go all electric from 2024". premier.vic.gov.au/site-4/new-victorian-homes-go-all-electric-2024')
deck = S('deck', 'Bromic Heating, Tungsten Electric Series II launch deck, July 2026 (internal).')
look = S('look', 'Bromic Heating, Lookbook 2026.')
site = S('site', 'Bromic Heating product pages for Tungsten Smart-Heat Electric, Platinum Smart-Heat Electric and Marine, Eclipse Smart-Heat Electric and Affinity Smart-Heat controls, read 29 Oct 2026 (values to be confirmed against 2026 cut sheets).')
man2 = S('man2', 'Bromic Heating, Tungsten Smart-Heat Electric Select & Coastal installation manual (2026) and LC Ceiling Recess Kit for Tungsten Series II instructions (2025), dealer-hosted copies.')
plclr = S('plclr', 'Bromic Heating, Platinum Electric Low-Clearance Ceiling Recess Kit manual (2300 W & 3400 W). cdn.shopify.com/s/files/1/0082/0704/0627/files/Platinum-Electric-Low-Clearance-Ceiling-Recess-Manual.pdf')
tman1 = S('tman1', 'Bromic Heating, Tungsten Smart-Heat Electric owner manual v2.0 USA (Series I; 2000–6000 W), dealer-hosted. cdn.shopify.com/s/files/1/0826/8850/8215/files/Bromic_Tungsten_Smart_Heat_Electric_Owner_Manual.pdf')
faq = S('faq', 'Bromic Heating, FAQs (retailer-hosted PDF). cdn.shopify.com/s/files/1/0560/7263/4525/files/Bromic_-_FAQs.pdf')
gasman = S('gasman', 'Bromic Heating, Tungsten Smart-Heat Gas 300/500 installation manual v1.5 USA-Canada (retailer-hosted). poolwarehouse.com/wp-content/uploads/2019/04/Bromic-Tungsten-Smart-Gas-Radiant-Heat-Patio-Heater-Installation-Manual.pdf')
calc = S('calc', 'Bromic Content Hub calculation model: 20 ft² a seat (NAFEM space-planning chart, top of the full-service range); heaters = area ÷ (coverage × cover factor × climate factor); partly covered 1.0, cool 0.85.')
privlux = S('privlux', 'Privlux, "Pergolas with integrated heaters and fans" (pergola builder). privluxinc.com/post/pergolas-with-integrated-heaters-and-fans-comfort-beyond-shade')
hanso = S('hanso', 'Hansø, Pro pergola heater compatibility and placement guide. help.hansohome.com/en/articles/12605580-pro-pergola-heater-compatibility-placement-guide')
doma = S('doma', 'Domaform (Bromic dealer), "Patio heater for a pergola: electric options that mount close to the roof". domaform.com/blogs/guides/patio-heater-for-a-pergola-electric-options-that-mount-close-to-the-roof')
nycfs = S('nycfs', 'NYC Fireplace Shop, buying guides: "Best patio heater for a covered patio" and "Marine-grade patio heaters for waterfront homes". nycfireplaceshop.com/blogs/buying-guides/')
cave = S('cave', 'Pergola Cave, "Louvered pergola accessories" (cost ranges and package tiers). pergolacave.com/blogs/blog/louvered-pergola-accessories')
olg = S('olg', 'The Outdoor Living Group (UK), Patio heater guide, quoting louvred-roof and canopy instructions. theoutdoorlivinggroup.com/wiki/patio-heater/')
tsbc = S('tsbc', 'Technical Safety BC, incident investigation "Radiant heater causes patio fire", 27 Oct 2022. technicalsafetybc.ca/regulatory-resources/incident-investigations/radiant-heater-causes-patio-fire')
mont = S('mont', 'Montgomery County MD, Department of Permitting Services, Guidelines for outdoor circuits feeding heaters. montgomerycountymd.gov/DPS/Resources/Files/COMBUILD/Electrical-Circuit-Guidelines-outdoor-heaters.pdf')
renson = S('renson', 'Renson, pergola options: Lineo Heat and Beam Heat & Sound. renson.net/en-us/products/pergolas/options/heating-and-speakers')
strxinf = S('strxinf', 'StruXure, "StruXure + Infratech: redefining the outdoor experience", 23 Dec 2025; StruXure heat page. struxure.com/blog/struxure-infratech-redefining-the-outdoor-experience/')
hguide = S('hguide', 'HomeGuide, louvered pergola cost guide (heater upgrade price ranges). homeguide.com/costs/louvered-pergola-cost')
strx = S('strx', 'StruXure, Residential Architectural Binder (2025), Pivot 6 MAX louver page, FAQ and "The louvered pergola component design". struxure.com/wp-content/uploads/2025/07/StruXure-Residential-Architectual-Binder.pdf')
rens = S('rens', 'Renson, Camargue and Algarve specification texts and product information (TF_Camargue_USA, US-06/26; TF_Algarve_EN); pergola warranty terms. dam.renson.net; renson.net/en-us/products/pergolas/warranty2')
equi = S('equi', 'Equinox (OmniMax), dealer training deck (Nov 2023), installation guide EQU-024 (2023), extruded louver tech sheet EQU-012, overview booklet EQU-025. equinoxroof.com/wp-content/uploads/')
sunc = S('sunc', 'Suncoast Enclosures, Louvered Roof product page. suncoastenclosures.com/louvered-roof/')
corr = S('corr', 'Corradi USA, Alba louvered roof brochure (International Builders\' Show exhibitor literature). buildersshow.com/assets/docs/ibs/pressReleases/ExhibitorProductLit_45552_CorradiUSAAlbaLouveredRoofBrochure.pdf')
plux = S('plux', 'Pergolux, Pergola 4 technical specifications; Pergolux heater page. pergolux.co.uk/pages/pergola-4-technical-specifications')
louv = S('louv', 'Louvretec, Design Manual 2025, Section 2 (Opening Roofs) and Section 4 (Structural Frames). eboss.co.nz/assets/literature/103/')
azen = S('azen', 'Azenco Outdoor, R-Blade product page and Q&A. azenco-outdoor.com/r-blade/')

import math
def n_heaters(area, cov, f=0.85): return math.ceil(area / (cov * f) - 1e-9)

# ---------------- pages ----------------
PAGES.append(dict(type='cover', img='l-006-028', alt='A covered terrace lounge heated by Tungsten Select heaters', pos='50% 60%',
    kicker='Bromic Planning Guide 2027', title_html='Heat The<br><em>Pergola</em>',
    sub='Heaters built into the structure',
    blurb='For pergola dealers, builders and specifiers: the trends, the six questions dealers ask, and how Tungsten, Platinum and Eclipse mount to today\'s louvered pergolas.',
    note='Tungsten Series II · Platinum · Eclipse · Affinity'))

PAGES.append(dict(type='exec', kicker='Executive Summary', h2='The Pergola Is Now The Outdoor Room', blocks=[
  ('lede', 'Homeowners are roofing their patios and wiring them for year-round use. The pergola is where that money goes, and heat is the feature that turns three seasons into twelve.'),
  ('cols', [[
    ('h4', 'Key insights'),
    ('ul', [
      f'**Outdoor rooms lead.** Architects\' net score for outdoor living rooms rose from 40% to 51% in a year [{aia}]; shade structures in Houzz projects rose 15 points to 35% [{hz26}].',
      f'**Dealers raise the same six issues:** bulk on slim beams, rust by the coast, controls that don\'t talk to the pergola, visible wiring and junction boxes, colour, and price [{privlux},{doma},{nycfs},{cave}].',
      f'**Pergola makers are choosing heater partners now.** StruXure offers the competition\'s heaters on its own brackets; Renson builds its own [{strxinf},{renson}].',
      f'**Control is consolidating.** Bond, the bridge behind StruXure\'s app and the competition\'s smart switches, joined the Somfy Group on 30 July 2026 [{bond},{strxbond},{infbond}].',
    ]),
  ], [
    ('h4', 'So what'),
    ('ul', [
      '**Tungsten Series II answers the beam:** about 14% narrower, a third lighter, one single post with the wiring inside it.',
      '**Coastal answers the sea:** 316 marine-grade stainless under a corrosion-resistant coating.',
      '**Affinity answers the app:** Bromic\'s own controls, direct to Alexa, Google, Control4, Crestron and Lutron, independent of any one bridge.',
      '**A clear ladder answers price:** Classic good, Select better, Platinum best, and Eclipse for the centre beam: heat and light in one.',
    ]),
    ('box', 'Action plan', [('ul', [
      '**Dealers:** pre-wire every heater position at build time; quote heater, control and circuit together.',
      '**Builders:** design beam heights for an 8 ft minimum heater mount.',
      '**Bromic:** publish a bracket and colour kit for the top five US pergola systems in 2027.',
    ])], True),
  ]]),
  ('h4', 'Contents'),
  ('html', '<ol class="toc">' + ''.join(f'<li><span>{i:02d}</span><span>{t}</span><span>{p}</span></li>' for i, (t, p) in enumerate([
      ('The trends', 3), ('Six questions on every quote', 5), ('The range for pergolas', 6), ('Footprint · Coastal · Smart home', 7),
      ('Mounting · Colour · Price', 10), ('Against the competition', 13), ('How Bromic mounts to seven pergola systems', 14),
      ('Planning: sizing, height, circuits', 21), ('Dealer checklist · Sources', 23)], 1)) + '</ol>'),
]))

PAGES.append(dict(type='trends', kicker='The Trends · 1 of 2', h2='Homeowners Are Building Roofs, Then Wiring Them', blocks=[
  ('lede', 'The money in outdoor living is moving under a roof, and the roof is becoming a room with power, light and heat.'),
  ('stats', [
    ('51%', f'Net share of residential architecture firms reporting rising demand for outdoor living rooms, Q2 2026, up from 40% a year earlier. Heated exterior space rose from 12% to 16% [{aia}].', 'AIA Home Design Trends Survey Q3 2026; net index, not a share of homes'),
    ('35%', f'Homeowners upgrading structures who added shade structures, up 15 percentage points on the 2024 study [{hz26}].', 'Houzz 2026 U.S. Outdoor Trends Study, 1,191 users'),
    ('74%', f'Outdoor kitchens that are fully (44%) or partly (30%) covered; 68% of those projects install plumbing, electrical or heating systems [{hz26}].', 'Houzz 2026 U.S. Outdoor Trends Study'),
    ('$977M', f'US outdoor living structures market in 2025; pergolas and patio covers are 35% of a global market put at $2.5 billion, rising 6.3% a year to 2035 [{gmi}].', 'Global Market Insights, September 2026; one firm\'s estimate'),
  ]),
  ('photo', 'w-strx-230222-bromic-dc-1', 330, 'Tungsten Electric on a louvered pergola: the roof makes the room; heat makes it usable in the cold months.', '50% 30%'),
]))

PAGES.append(dict(type='trends', kicker='The Trends · 2 of 2', h2='Smart, Coastal, Electric', blocks=[
  ('stats', [
    ('68%', f'Outdoor products bought in 2024 renovations that can be monitored or controlled from a phone [{hz24}].', 'Houzz 2024 U.S. Outdoor Trends Study, 1,100+ homeowners'),
    ('81%', f'Full-service restaurants in the U.S. and Canada that offer patio or outdoor dining; patios bring in up to 49% of sales in peak season [{tb}].', 'TouchBistro with The Harris Poll, Oct 2025; vendor-commissioned'),
    ('129M', f'People living in US coastal counties: almost 40% of the population, and the salt air that comes with it [{noaa}].', 'NOAA, 2020 data'),
    ('2024', f'The year New York City began phasing out on-site combustion in new buildings, and Victoria moved new homes needing a planning permit to all-electric [{nyc},{vic}].', 'NYC Local Law 154; Premier of Victoria. Neither names outdoor heaters'),
  ]),
  ('cols', [[
    ('h3', 'What this means for the pergola'),
    ('ul', [
      '**One app for the roof and the heat.** Louvres, screens and lights are already motorised; the heater is the piece that still sits on its own switch.',
      '**Built for salt and chlorine.** Coastal and pool-side pergolas need heaters made for them, not just cleaned more often.',
      '**Electric first.** Infrared electric heat needs no gas line, no flue and no ventilation calculation under a roof.',
    ]),
  ], [
    ('photo', 'w-slc-bromic-heater-1-cropped', 200, 'Eclipse pendants on a louvered pergola: heat and light from the centre of the room.'),
  ]]),
  ('photo', 'w-gazebo-bromic', 300, 'A louvered pergola as the backyard\'s main room.', '50% 55%'),
]))

PAGES.append(dict(type='issues', kicker='What Dealers Tell Us', h2='Six Questions On Every Pergola Quote', blocks=[
  ('p', 'We read pergola makers\' manuals, dealer guides, installer forums and inspectors\' notes. Clearance and electrical load come up most; they are covered in Planning. These six decide whether a heater is sold with the pergola or added later, badly.'),
  ('table', {'head': ['What dealers say', 'Evidence', 'The Bromic answer'], 'rows': [
    ['**1 · The heater looks bolted on.** Slim beams, bulky heaters, brackets that stand off the frame.', f'Retrofits leave "surface-mounted conduits, exposed junction boxes" [{privlux}]. Makers now sell heaters built for their own frames [{renson},{strxinf}].', 'Tungsten Series II: about 14% narrower and a third lighter, on one single post.'],
    ['**2 · It rusts by the sea.**', f'Renson limits its coating warranty within 500 m of the coast [{rens}]; dealers steer waterfront homes to 316 stainless [{nycfs}].', 'Tungsten Coastal: 316 marine-grade stainless plus a corrosion-resistant coating, IPX5.'],
    ['**3 · It won\'t talk to the pergola.**', f'Pergola apps run on Somfy and Bond; heaters run on their own switch [{strx},{strxbond}].', 'Affinity Smart-Heat: Bromic\'s own app, with Alexa, Google, Control4, Crestron and Lutron.'],
    ['**4 · The install is messy.**', f'"Mount heaters to main structural beams, not louver slats" [{hanso}]; visible boxes and conduit are the common complaint [{privlux}].', 'Single post, wiring inside it, no junction box on show; brackets for walls, pitches and angles.'],
    ['**5 · It doesn\'t match the frame.**', f'Frames ship in white, black, bronze and grey; matching a heater means custom coats and lead times [{strx},{equi}].', 'Select in black, white and graphite; Platinum in black or white glass.'],
    ['**6 · It costs more than the guide said.**', f'Cost guides price a heater upgrade at a few hundred dollars [{hguide}]; the real install is heater, control and circuit [{doma}].', 'A ladder: Classic good, Select better, Platinum best; Eclipse for the centre.'],
  ]}),
  ('photo', 'w-kion-sui-madrid-spain-tungsten-electric-4', 400, 'Tungsten Electric under louvres: mounted on the structure, aimed at the seats.'),
]))

def card(tier, name, img, lines, best=False):
    li = ''.join(f'<li>{x}</li>' for x in lines)
    return (f'<div class="rc{" best" if best else ""}"><div class="tier">{tier}</div><h3>{name}</h3>'
            f'<div class="pic"><img src="img/{img}.jpg" alt="{name}"></div><ul class="b">{li}</ul></div>')
RANGE_HTML = '<div class="rng">' + ''.join([
  card('Good', 'Tungsten Classic', 't2-classic', ['2, 3, 4 and 6 kW', 'Black body, stainless end covers, metal face guard', 'Proven Series I two-tube mount', 'Launches January 2027', '<b>Controls:</b> Affinity On/Off or Dimmer, wall switch']),
  card('Better', 'Tungsten Select', 't2-select-black', ['2, 3, 4 and 6 kW; 208, 240, 277 V', 'Black, white, graphite (graphite on 4 and 6 kW)', 'Single post; IPX5; 7.5 in low-clearance recess', '<b>Coastal:</b> 316 stainless plus coating, 4 and 6 kW', '<b>Controls:</b> Affinity On/Off or Dimmer, wall switch']),
  card('Best', 'Platinum', 'w-platinum-black', ['2300, 3400 and 4500 W', 'Glass-ceramic face, 2.1 in deep', '8 in pole and wall bracket included; 7.1 in recess', '<b>Marine:</b> AISI 316 stainless', '<b>Controls:</b> Affinity On/Off or Dimmer, wall switch'], True),
  card('The Centre', 'Eclipse', 'w-eclipse-electric', ['2,900 W; heat 33, 66, 100%', '27.6 in disc with a dimmable 3000K LED ring', '24 in twin pole included; 8, 24, 48 in poles', 'Heat and light from one fixture', '<b>Controls:</b> Affinity Eclipse controller or Eclipse Dimmer with remote']),
]) + '</div>'

PAGES.append(dict(type='range', kicker='The Range For Pergolas', h2='Good, Better, Best, And The Centre', blocks=[
  ('lede', 'Four heaters cover every pergola a dealer sells: Classic for value, Select for the slimmest install, Platinum for the architecture, and Eclipse where the room needs a centrepiece.'),
  ('html', RANGE_HTML),
  ('table', {'head': ['', 'Classic', 'Select / Coastal', 'Platinum', 'Eclipse'], 'rows': [
    ['**Heat area**', '65–160 ft²', '64–144 ft² (to confirm against 65–160)', '65, 108, 143 ft²', '121 ft²'],
    ['**Best on a pergola**', 'Perimeter beam, value builds', 'Perimeter or fan beam, recessed bays, coastal', 'Solid bays and design-led builds', 'Centre beam over a table'],
    ['**Warranty**', '3 yr heater, 7 yr elements', '3 yr heater, 7 yr elements', '3 yr (Marine 5 yr on land)', '3 yr'],
  ]}),
  ('photos', [('l-010-076', 'White Platinum Electric on a white louvered pergola.'), ('w-vbb7418', 'Tungsten Electric along the beams of a café pergola.')], 190),
  ('p', f'Sources: launch deck [{deck}], Lookbook 2026 [{look}], product pages [{site}]. Series II heat areas: the product page lists 65–160 ft², the Series II manual up to 64–144 ft²; to confirm with the Product team. Every heater is quoted with its control: Wi-Fi and app features need compatible Affinity controls, sold separately.'),
]))

PAGES.append(dict(type='issue', kicker='Dealer Issue 1 · Footprint', h2='A Slimmer Heater For A Slim Beam', blocks=[
  ('voice', 'Adding heaters later "can become costly, invasive, and even compromise the structure\'s integrity."', f'Privlux, pergola builder [{privlux}]'),
  ('p', 'Louvered pergolas sell on clean lines: 8 in beams in the US, 230–260 mm frames in Europe. A heater that is wider than the beam, hung on two tubes, reads as an afterthought. Tungsten Series II was drawn for exactly this: narrower, lighter and on one post.'),
  ('diag', 'footprint', '680 340', 'Series I and Series II under the same beam, drawn to one scale.'),
  ('table', {'head': ['', 'Tungsten Series I', 'Tungsten Series II (Select, Coastal)'], 'rows': [
    ['**Width**', '214 mm (8.4 in)', '*183 mm (7.2 in): about 14% narrower'],
    ['**Weight**', '19.8–22 lb', '13–15 lb: about a third lighter'],
    ['**Mount**', 'Two suspension tubes', 'One single post; no junction box on show'],
    ['**Water rating**', 'IPX4', 'IPX5'],
    ['**Length, 3 and 6 kW**', '1410 mm (55 in)', '1436 mm (56.5 in)'],
    ['**Length, 2 and 4 kW**', '1177 mm (46 in)', '1144 mm (45 in)'],
  ]}),
  ('p', f'Widths and lengths: launch deck [{deck}]; weights: Series I and Series II manuals [{tman1},{man2}]. Depth is not compared: the deck and the manuals measure it differently, to confirm with the Product team.'),
]))

PAGES.append(dict(type='issue', kicker='Dealer Issue 2 · Coastal', h2='Built For Salt Air', blocks=[
  ('voice', '"Salt is the issue, not rain."', f'NYC Fireplace Shop, marine-grade heater guide [{nycfs}]'),
  ('cols', [[
    ('p', f'Pergola makers know the coast is hard on metal. Renson\'s extended coating warranty does not apply within 500 m of the sea [{rens}]; Louvretec specifies 316 stainless drive axles and asks owners to wash off salt [{louv}]. A heater under that roof should be built to the same standard.'),
    ('h4', 'Tungsten Coastal'),
    ('ul', ['**Two layers:** 316 marine-grade stainless steel under a high-temperature, corrosion-resistant coating.', '**Recess kit** in powder-coated 316 stainless, IPX5.', '**4 and 6 kW**, 208 and 240 V, black or white.', '**For coastal homes and venues**, not marine craft.']),
    ('h4', 'Platinum Electric Marine'),
    ('ul', ['AISI 316 stainless; IPX5 (IP55 on 4500 W).', 'Warranty 5 years on land-based installs.']),
  ], [
    ('diag', 'coastal', '470 200'),
    ('box', 'Still clean it', [('p', f'Stainless is not stain-free. Bromic\'s manuals ask for salt spray to be wiped off and a fortnightly clean by the coast, with a yearly check by a qualified technician [{tman1},{plclr}].')]),
  ]]),
  ('photo', 'w-louvered-pergola-with-recessed-platinum-elec', 330, 'Platinum Electric recessed in a louvered pergola.'),
  ('p', f'Sources: launch deck and Lookbook [{deck},{look}], product pages [{site}]. Coastal body material and coating name: to confirm with the Product team.'),
]))

PAGES.append(dict(type='issue', kicker='Dealer Issue 3 · Smart Home', h2='One App For The Roof And The Heat', blocks=[
  ('voice', 'Bond brings "a particularly complete ecosystem for the outdoor segment."', f'Bond, on joining the Somfy Group, 30 July 2026 [{bond}]'),
  ('cols', [[
    ('h4', 'What changed'),
    ('ul', [
      f'**Somfy** motors most louvered roofs: StruXure, Renson, Equinox, Corradi and Louvretec run on Somfy RTS or io [{strx},{rens},{equi},{corr},{louv}].',
      f'**Bond** joined the Somfy Group on 30 July 2026 and says it will stay brand-agnostic [{bond}]. Its bridge already runs StruXure\'s pergola app [{strxbond}] and the competition\'s Wi-Fi switches [{infbond}].',
      '**So** the bridge between pergola and heater now belongs to the shade company. Dealers will want a heater platform that stands on its own and plugs into the home system.',
    ]),
  ], [
    ('h4', 'The Affinity answer'),
    ('ul', [
      '**Bromic\'s own controls and app:** zones, schedules and timers, dimming in 1% steps on the Dimmer.',
      '**Direct to voice:** Amazon Alexa and Google Assistant, no extra hub.',
      '**Into the home system:** Control4, Crestron and Lutron; Ethernet and 0–10 V for building management on the 5-channel controller.',
      '**Sized for pergolas:** 1, 2 or 5 channels, each up to 6 kW at 208–277 V; one Eclipse per channel on the Eclipse controller.',
    ]),
  ]]),
  ('diag', 'smart', '680 320', 'Affinity Smart-Heat sits between the heaters and the systems the home already has. Compatibility varies by system and may need extra integration hardware; Wi-Fi and app features need compatible Affinity controls, sold separately.'),
  ('p', f'Sources: Lookbook 2026 [{look}], Affinity product pages [{site}]. Controller capacities: to confirm with the Product team. Bond and the competition: CE Pro [{infbond}]; competitor statements await Specification and compliance approval.'),
]))

PAGES.append(dict(type='issue', kicker='Dealer Issue 4 · Mounting And Install', h2='One Post, Wiring Inside, Nothing On Show', blocks=[
  ('voice', '"Mount heaters to main structural beams, not louver slats."', f'Hansø, pergola heater placement guide [{hanso}]'),
  ('diag', 'install', '700 340', 'Tungsten Series II on its single post, and the accessories that fit it to a beam, a wall, a pitch or a recess.'),
  ('cols', [[
    ('h4', 'What the pergola gives you'),
    ('ul', [
      f'**Hollow posts and beams** are the wire chase: StruXure calls them "dedicated, hidden channels for all wiring" [{strx}].',
      f'**The post is often the downspout too** [{strx},{rens},{sunc}]: use wet-location wiring and keep connections out of the water path.',
      f'**Fan beams and sub-beams** are the mounting points pergola makers already provide [{strx},{equi}]. Never fix to a rotating louvre [{hanso},{doma}].',
    ]),
  ], [
    ('h4', 'What Series II gives you'),
    ('ul', [
      '**Single post** in place of Series I\'s two tubes, with the cable inside it and no junction box on show.',
      '**Mounting bracket** with set positions at 15°, 30° and 45° on a 2.5 × 4 in plate.',
      '**Wall bracket** 14 in or 18 in reach; **pitched adaptor** 3/12 to 12/12; **low-clearance recess kit** for a 7.5 in cavity, fan-ventilated, box supplied.',
      f'**Pre-wire at build:** $200–$400 then saves $600–$1,200 later, by one dealer\'s figures [{cave}].',
    ]),
  ]]),
  ('photo', 'd-tungsten-louvre-detail', 150, 'Tungsten under a louvered roof: fixed to the structure, never to a blade.', '50% 45%'),
  ('p', f'Sources: launch deck [{deck}], Series II manuals [{man2}]. Tilt on 4 and 6 kW: the deck says 45°, the Series II manual 30°; to confirm with the Product team.'),
]))

FRAMES[:] = [['Black', '#1E1E1E', 'every maker'], ['White', '#F4F4F2', 'every maker'], ['Bronze', '#5B4636', 'many makers'], ['Gray', '#4A4D50', 'many makers']]
PAGES.append(dict(type='issue', kicker='Dealer Issue 5 · Colour', h2='Graphite Joins Black And White', blocks=[
  ('voice', 'Heaters "can be powder coated to perfectly match the six standard StruXure colors."', f'StruXure, on its heater partner [{strxinf}]'),
  ('p', f'Pergola frames come in more than black and white: StruXure lists white, beige, bronze, adobe, black and gray [{strx}]; Equinox adds sandstone and clay [{equi}]; Pergolux sells anthracite [{plux}]. Graphite gives Tungsten Select a third, full-body finish that sits with the grey and dark frames now common on louvered roofs.'),
  ('diag', 'colours', '700 130'),
  ('table', {'head': ['Frame colour', 'Recommended heater finish', 'Why'], 'rows': [
    ['**Black**', 'Tungsten Select black; Platinum black glass; Eclipse', 'Disappears into the frame'],
    ['**White, beige, sandstone**', 'Tungsten Select white; Platinum white glass', 'Reads as part of a light roof'],
    ['!**Gray, anthracite**', 'Tungsten Select graphite (4 and 6 kW)', 'The new match for dark-grey frames'],
    ['**Bronze, adobe, clay**', 'Tungsten Select black or graphite', 'No bronze heater today: choose the darker tone'],
  ]}),
  ('photos', [('w-bromicatria23', 'Black Platinum Electric under a dark louvered roof.'), ('w-img-0194', 'A white louvered pergola: white heaters read as part of the roof.')], 190),
  ('p', f'Finishes: launch deck [{deck}] and Lookbook [{look}]. Coastal comes in black or white; Classic in black.'),
]))

PAGES.append(dict(type='issue', kicker='Dealer Issue 6 · Price', h2='A Ladder, Not A Line Item', blocks=[
  ('voice', '"Budget for the wiring and the controls, not just the fixture."', f'NYC Fireplace Shop [{nycfs}]'),
  ('p', f'Online cost guides put a heater upgrade on a louvered pergola at $150–$500 [{hguide}]; dealers who sell heat price $500–$2,000 a unit and package one, two or three heaters [{cave}]. The gap is the objection. A clear ladder closes it: the customer chooses the level, and the circuit and control are on the quote from day one.'),
  ('diag', 'ladder', '700 290'),
  ('table', {'head': ['', 'Good', 'Better', 'Best', 'The centre'], 'rows': [
    ['**Heater**', 'Tungsten Classic', 'Tungsten Select (Coastal by the sea)', 'Platinum Electric (Marine by the sea)', 'Eclipse Electric'],
    ['**The customer buys**', 'Affordable power and Tungsten style', 'The slimmest install, three finishes, recess', 'Architecture: flush glass, 2.1 in deep', 'Heat and light over the table'],
    ['**Controls on the quote**', 'Affinity On/Off, wall switch', 'Affinity Dimmer, app', 'Affinity Dimmer, app, home system', 'Affinity Eclipse controller'],
    ['**Typical pergola**', 'Value builds, garages, side bays', 'Louvered roofs, coastal homes', 'Design-led projects, solid bays', 'Dining pergolas, round tables'],
  ]}),
  ('photo', 'l-008-059', 170, 'Tungsten Select over a pergola dining table.', '50% 30%'),
  ('p', f'Positioning only: list prices by model and region come from Bromic sales operations and are not printed here. Every price conversation includes the Affinity control and the electrician\'s circuit.'),
]))

infm = S('infm', 'Competitor documents (heater competition), read Nov 2026 and held in the Bromic Content Hub\'s Tungsten Series II framework (needs approval: Specification and compliance): C-Series owner\'s instruction manual 2024; W/WD flush mount frame specifications; FAQs; Marine UpGrade page; limited warranty (2024 terms); controls and Smart Switch sell sheet. infratech.com')
PAGES.append(dict(type='issue', kicker='Against The Competition', h2='What Dealers Weigh When They Compare', blocks=[
  ('lede', 'The pergola market\'s best-known heater partner sets the bar dealers compare against. Here is how Bromic answers each point, from the competition\'s own documents.'),
  ('table', {'head': ['What matters on a pergola', 'The competition', 'Bromic'], 'rows': [
    ['**Rain and hose-down**', 'IPX4', '*Tungsten Series II IPX5; Coastal recess kit IPX5'],
    ['**Space around the heater**', '18 in on all four sides, 36 in in front, 6 in behind the face from its brackets', 'Tungsten: 12 in top to ceiling and to side walls (Bromic FAQ; Series II figures to confirm)'],
    ['**By the sea**', '316 stainless as a paid upgrade; no protective coating beyond the colour powder coat described', '*Tungsten Coastal: 316 marine-grade build plus a corrosion-resistant coating, as standard; Platinum Marine'],
    ['**Smart control**', 'App control through third-party Bond switches (Bond is now part of Somfy); other makers\' controls "may void" the warranty', '*Affinity: Bromic\'s own controllers and app; Alexa, Google, Control4, Crestron, Lutron'],
    ['**Recessing**', 'Framed pocket of at least 2×8, lined on five sides with Type X drywall, flat ceilings only; a cool-down is recommended after 4 hours', '*Low-clearance kits: Tungsten 7.5 in cavity, dual fan-ventilated, recess box supplied; Platinum 7.1 in'],
    ['**Mounting**', 'Brackets, pole on a base, or a pair of drop rods a heater', 'One single post; pitched adaptor 3/12–12/12; angles to 45°'],
    ['**Warranty**', '3 years; 2024 terms cover parts only, labour excluded; elements rated to 5,000 hours', '*Series II: 3 years on the heater, 7 years on the elements'],
    ['**One brand for the whole patio**', 'Fixed electric heaters only', '*Electric, the Eclipse pendant, Eclipse Freestanding, built-in and freestanding gas'],
  ]}),
  ('box', 'Where the competition leads today, and our answer', [('ul', [
    '**Any colour:** custom powder coat to match a frame. Bromic answers with black, white and graphite through the whole heater; a bronze option is worth testing.',
    '**A factory bracket for one pergola brand**, ordered through that brand. Bromic\'s answer is the single post on the fan beam every system already offers, and the bracket kit in the action plan.',
  ])], True),
  ('photo', 'w-strx-230222-bromic-dc-3', 170, 'Tungsten Electric on a louvered pergola.', '50% 25%'),
  ('p', f'Competitor facts from the competition\'s own manuals, warranty and pages [{infm},{infbond}]; Bromic facts from [{deck},{look},{faq},{man2},{plclr}]. Comparative statements await Specification and compliance approval before external use.'),
]))

def brand(kicker, h2, intro, spec, pergola, beam, cap, fit, side):
    PAGES.append(dict(type='brand', kicker=kicker, h2=h2, intro=intro, spec=spec, pergola=pergola, beam=beam, cap=cap, fit=fit, side=side))

TFIT = 'Single post to the underside of the perimeter beam or a fan beam, aimed at the seats with the 15°, 30° or 45° bracket; cable down the hollow beam into the post.'
EFIT = 'Pendant from a centre or fan beam over the table. Keep the head at least 8 ft up: the 8 in pole needs about 9 ft 1 in clear (to confirm against the manual).'

brand('How Bromic Mounts To · StruXure', 'StruXure Pergola X',
  f'The best-known US louvered roof, with hollow columns and beams that StruXure calls "dedicated, hidden channels for all wiring" [{strx}]. Its heat partner today is the competition, on StruXure brackets [{strxinf}]; Bromic\'s single post fixes to the fan beams StruXure already supplies.',
  [('Posts', '4×4, 6×6, 8×8 in'), ('Beams', '2×8 or 2×10 in standard; 4×8 to 6×10 in'), ('Louvres', '6 in Pivot 6 MAX, 155°, to 16 ft span'), ('Largest zone', '12 × 20 ft'),
   ('Wiring', 'Inside columns and beams; columns drain rain'), ('Colours', 'White, beige, bronze, adobe, black, gray; RAL'), ('Controls', 'Somfy RTS, myLink; Bond-based bridge'), ('Coastal', 'Warranty excludes salt atmospheres (to confirm)')],
  dict(span=240, clear=120, post=6, beamH=8, beamW=2, pitch=6, mid=True, midH=8, midW=2, spanLabel='20 ft zone between posts', clearLabel='10 ft clear (drawn)', beamLabel='8 in'),
  dict(beamW=2, beamH=8, gutter=True),
  f'Elevation along a 20 ft StruXure zone, drawn to scale from StruXure\'s published sizes [{strx}]: Tungsten Select at one third, Eclipse on the centre beam, Platinum at two thirds. Clear height is the project\'s; 10 ft is drawn. A mounting concept, not an engineering drawing.',
  [('Tungsten Select', TFIT), ('Eclipse', EFIT), ('Platinum', 'On its 8 in stainless pole from the fan beam, or on the wall bracket on the beam\'s inner face. Recess only where a solid, flat bay is framed (7.1 in cavity).')],
  [('h4', 'Watch'), ('ul', [f'The louvre motor needs 15 in to a host structure [{strx}]: keep heaters off the motor side.', 'Colour: black, white or graphite Select against StruXure black, white and gray.'])])

brand('How Bromic Mounts To · Renson', 'Renson Camargue And Algarve',
  f'Renson builds heat into its own roof: Lineo Heat, a 1400 W heater in a fixed louvre, and Beam Heat & Sound, a 2400 W module on the frame [{rens}]. That sets the dealer\'s bar: heat that looks designed in. Tungsten and Platinum bring more output a heater where a terrace needs it.',
  [('Columns', '150 × 150 mm (Camargue); 110 × 110 mm (Algarve)'), ('Frame', '260 mm high (Camargue); 230 mm (Algarve)'), ('Blades', 'Double-walled, 150°; 355 mm above passage height when open'), ('Span', 'To 4500 mm; pivot to 6200 mm'),
   ('Wiring', 'Cables "integrated fully and invisibly"; drains in columns'), ('Colours', 'Textured RAL'), ('Controls', 'Somfy RTS or io; Renson app'), ('Coastal', 'Seaside Quality A; 5-yr adhesion within 500 m of sea')],
  dict(span=177, clear=110, post=5.9, beamH=10.2, beamW=5.9, pitch=8, mid=False, spanLabel='4500 mm span (maximum)', clearLabel='2800 mm passage (maximum)', beamLabel='260 mm'),
  dict(beamW=5.9, beamH=10.2),
  f'Camargue at its maximum span and passage height, from Renson\'s US product information [{rens}]. With no centre beam, Eclipse hangs from a fan beam the installer adds across the span.',
  [('Tungsten Select', 'Single post to the frame\'s underside on the span side, inside the line of the blades, so the blades rotate clear.'), ('Eclipse', 'From an added cross beam; at the 2800 mm passage height the 8 in pole keeps the head above 8 ft.'), ('Platinum', 'Wall bracket on the frame profile, or the 8 in pole. Platinum\'s glass face sits beside Renson\'s own black ceramic glass heater.')],
  [('h4', 'Watch'), ('ul', ['Blades rise above the frame when open: keep every heater below the frame line.', 'Renson\'s electrical warranty covers its own heaters; agree the Bromic circuit with the dealer at design.'])])

brand('How Bromic Mounts To · Equinox', 'Equinox Louvered Roof',
  f'OmniMax\'s louvered roof (sister brand to Alumawood) uses 2×8 or 4×8 beams on 4×4 or 7×7 posts and lists "gas or electric heaters" as an accessory without naming a brand [{equi}]: an open door for Bromic.',
  [('Posts', '4×4 or 7×7 in, 1/8 in wall'), ('Beams', '2×8 in (1/8 in wall) or 4×8 in (1/4 in wall)'), ('Louvres', 'Dual-wall airfoil, 150°; 8, 10, 12 ft'), ('Span', 'Louvres to 14 ft'),
   ('Wiring', 'Post can be the drain; post light needs a 3/4 in hole'), ('Colours', 'Black, white, sandstone, clay, bronze'), ('Controls', 'Gear motor or Somfy RTS'), ('Warranty', '20-year limited on the structure')],
  dict(span=168, clear=120, post=7, beamH=8, beamW=4, pitch=8, mid=False, spanLabel='14 ft louvre span', clearLabel='10 ft clear (drawn)', beamLabel='8 in'),
  dict(beamW=4, beamH=8, gutter=True),
  f'A 14 ft Equinox bay on 7×7 posts and 4×8 beams, from the Equinox dealer deck and install guide [{equi}]. Eclipse hangs from the Equinox Fan Beam.',
  [('Tungsten Select', TFIT), ('Eclipse', 'From the Equinox Fan Beam across the bay, on the 8 in pole.'), ('Platinum', 'On the 8 in pole from the Fan Beam, or wall bracket on the beam face; white glass on white and sandstone frames.')],
  [('h4', 'Watch'), ('ul', ['The gutter sits flush with the beam bottom: fix the post plate clear of the gutter.', 'Bronze and clay frames: pair with black or graphite Select.'])])

brand('How Bromic Mounts To · Suncoast', 'Suncoast Louvered Roof',
  f'Suncoast builds on 6×6 posts and 2×8 or 4×8 beams, with 8 in blades over 15 ft zones, and adds "auxiliary beams and conduit spaces" for mounting and wiring [{sunc}]. It runs Gaposa motors with Control4 through a module, so Affinity\'s Control4 route fits its customers.',
  [('Posts', '6×6 in'), ('Beams', '2×8 or 4×8 in'), ('Blades', '8 in, up to 140°'), ('Span', '15 ft blade span a zone; 16–26 ft between posts'),
   ('Wiring', 'Downspouts in the post or outside; conduit spaces'), ('Colours', 'Not published'), ('Controls', 'Gaposa; app, Alexa, Google, Control4'), ('Warranty', '15 yr structure, 5 yr motors')],
  dict(span=192, clear=120, post=6, beamH=8, beamW=4, pitch=8, mid=False, spanLabel='16 ft between posts', clearLabel='10 ft clear (drawn)', beamLabel='8 in'),
  dict(beamW=4, beamH=8),
  f'A 16 ft Suncoast span with an auxiliary beam for the pendant, from Suncoast\'s product page [{sunc}].',
  [('Tungsten Select', 'Single post to the auxiliary beam, cable in the conduit space.'), ('Eclipse', 'From the auxiliary beam over the table.'), ('Platinum', '8 in pole from the auxiliary beam.')],
  [('h4', 'Watch'), ('ul', ['Heaters and the Gaposa blade motor on one Control4 system: Affinity\'s Control4 integration (compatibility varies; to confirm per project).'])])

brand('How Bromic Mounts To · Corradi', 'Corradi Alba',
  f'Italian design sold in the US: 4×4 in pillars, a 4×9 in beam and 8.5 in blades that rise 3.75 in above the beam when fully open [{corr}]. The brochure offers no heater, so the heater is the dealer\'s choice.',
  [('Pillars', '4 × 4 in'), ('Beam', '4 × 9 in'), ('Blades', '8.5 in, 150°'), ('Height', '119 in standard, 147 in maximum'),
   ('Module', '236 × 238 in double'), ('Wiring', 'Gutter runs into the pillars'), ('Controls', 'Somfy; operator in a 5×20 in enclosure on top'), ('Finish', 'Qualicoat powder; RAL')],
  dict(span=236, clear=110, post=4, beamH=9, beamW=4, pitch=8.5, mid=True, midH=9, midW=4, spanLabel='236 in double module', clearLabel='110 in under the beam', beamLabel='9 in'),
  dict(beamW=4, beamH=9),
  f'The Alba double module at its standard 119 in height (110 in under the beam), from Corradi\'s brochure [{corr}].',
  [('Tungsten Select', 'Single post to the 4×9 beam; at 110 in clear the heater still mounts above 8 ft.'), ('Eclipse', 'From the centre beam of the double module on the 8 in pole.'), ('Platinum', 'Pole or wall bracket; slim glass suits Alba\'s minimal lines.')],
  [('h4', 'Watch'), ('ul', ['The operator sits on top of the structure: keep heaters away from its enclosure.'])])

brand('How Bromic Mounts To · Louvretec', 'Louvretec (Australia And New Zealand)',
  f'Custom-engineered opening roofs "designed for coastal living", with box beams from 150×50 to 300×50 mm, T316 stainless drive axles, and Somfy and Teleco remotes that already control "a Dimmable Heater" [{louv}]. The natural partner for Tungsten Coastal.',
  [('Posts', 'Custom; 150 × 150 mm where the post drains'), ('Beams', '150×50 to 300×50 mm box'), ('Blades', '180, 200, 220 or 270 mm'), ('Span', 'Engineered by wind zone'),
   ('Wiring', 'Post as water outlet; wiring by others'), ('Coastal', 'T316 axles; Duralloy 10-yr film warranty'), ('Controls', 'Somfy RTS, Connexoon, TaHoma; Teleco'), ('Heat', 'Remotes control heating; no heater named')],
  dict(span=157, clear=106, post=5.9, beamH=7.9, beamW=2, pitch=7.9, mid=False, spanLabel='4000 mm span (drawn)', clearLabel='2700 mm clear (drawn)', beamLabel='200 mm'),
  dict(beamW=2, beamH=7.9),
  f'A Louvretec bay drawn with a 200 × 50 mm beam, from the 2025 Design Manual [{louv}]. Spans and heights are engineered per site; the drawn figures are an example.',
  [('Tungsten Coastal', 'Single post to the beam; 316 build and coating to match Louvretec\'s coastal brief.'), ('Eclipse', 'From a cross beam over the table, head at least 2.4 m up.'), ('Platinum Marine', '316 stainless with glass face, on the pole or wall bracket.')],
  [('h4', 'Watch'), ('ul', ['Louvretec\'s heater control runs through Somfy or Teleco; Affinity keeps Bromic\'s dimming and app.'])])

brand('How Bromic Mounts To · Pergolux', 'Pergolux Pergola 4 (UK)',
  f'A kit pergola with a 2350 mm pass-through height, 120 mm posts and a 175 × 108 mm beam, sold with its own "PERGOLUX heater compatible" option and SnapFIT accessory channels [{plux}]. At 2350 mm (92.5 in) it sits below the 8 ft ceiling-mount minimum, so heaters go on the posts.',
  [('Posts', '120 × 120 mm'), ('Beam', '175 × 108 mm; 1.8 mm wall'), ('Louvres', '166.5 mm single wall, 0–120°'), ('Span', '4.56 m between posts'),
   ('Height', '2350 mm pass-through'), ('Accessories', 'SnapFIT channel, one a gutter'), ('Finish', 'Anthracite, white'), ('Drive', 'Manual crank')],
  dict(span=180, clear=92.5, post=4.7, beamH=6.9, beamW=4.3, pitch=6.6, low=True, spanLabel='4.56 m between posts', clearLabel='2350 mm pass-through', beamLabel='175 mm'),
  None,
  f'Pergolux Pergola 4 from its technical specification [{plux}]. Below 8 ft clear, Tungsten and Platinum go on the wall bracket at least 6 ft up, angled at the seats; Eclipse is not used.',
  [('Tungsten Select', 'Wall bracket on the post, at least 6 ft (72 in) above the floor, angled in; graphite suits anthracite frames.'), ('Platinum', 'Wall bracket on the opposite post.'), ('Eclipse', 'Not under 2350 mm; use Eclipse Freestanding beside the seating instead.')],
  [('p', f'Wall-mount minimum 72 in and ceiling minimum 96 in: Bromic product pages [{site}].')])

SIZES = [('10 × 10 ft', 100), ('12 × 12 ft', 144), ('12 × 16 ft', 192), ('14 × 20 ft', 280), ('16 × 20 ft', 320), ('20 × 20 ft', 400)]
MODELS = [('Tungsten 4 kW', 130), ('Tungsten 6 kW', 160), ('Platinum 3400 W', 108), ('Platinum 4500 W', 143), ('Eclipse', 121)]
size_rows = [[f'**{n}**', f'{a} ft²'] + [str(n_heaters(a, c)) for _, c in MODELS] for n, a in SIZES]
PAGES.append(dict(type='plan', kicker='Planning · 1 of 2', h2='How Many Heaters, And How High', blocks=[
  ('p', f'One simple model: heaters = area ÷ (heat area × cover factor × climate factor), rounded up. A pergola is "partly covered" (1.0); the table assumes cool evenings around 40–50°F (0.85) [{calc}]. Use the seating area, about 20 ft² a seat.'),
  ('table', {'head': ['Pergola', 'Area'] + [m for m, _ in MODELS], 'rows': size_rows}),
  ('p', f'Heat areas: Tungsten 130 and 160 ft², Platinum 108 and 143 ft², Eclipse 121 ft² [{site}]. Series II\'s manual lists up to 120 and 144 ft² for 4 and 6 kW: to confirm. Worked example: a 14 × 20 ft pergola is 280 ft²; 280 ÷ (160 × 0.85) = 2.06, so three Tungsten 6 kW heaters, on one Affinity 5-channel Dimmer and a wall switch.'),
  ('cols', [[
    ('h4', 'Mounting heights'),
    ('table', {'head': ['Heater', 'Lowest mount', 'So the pergola needs'], 'rows': [
      ['**Tungsten, Platinum on a ceiling or beam**', '96 in (8 ft) to the floor', 'About 8 ft 6 in clear under the beam'],
      ['**Tungsten, Platinum on a wall or post**', '72 in (6 ft)', 'Any pergola; angle at the seats'],
      ['**Platinum recessed (LC kit)**', '94 in heater to floor', 'A solid, flat bay with a 7.1 in cavity'],
      ['**Eclipse pendant**', 'Head at least 8 ft up', '9 ft 1 in on the 8 in pole; about 10 ft 5 in on the 24 in pole (to confirm)'],
    ]}),
  ], [
    ('h4', 'Spacing and clearance'),
    ('ul', [
      f'**Between heaters:** at least 20 in edge to edge (Tungsten) [{tman1}].',
      f'**Above and beside:** 12 in from the heater top to the ceiling and to side walls (electric) [{faq}].',
      f'**In front:** combustibles at least 3 ft from the face [{tman1}].',
      f'**Low-tolerance materials** (vinyl, canvas, plastic) degrade at lower temperatures: protecting them is the installer\'s job [{tman1}]. An open-looking roof is not clearance [{olg}].',
      f'**On a beam, not a louvre:** never fix to a rotating blade [{hanso},{doma}].',
    ]),
    ('p', 'Figures from Bromic\'s Series I manual and FAQ; Series II figures to confirm with the Product team.'),
  ]]),
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
    ('p', f'Platinum and Eclipse currents from the product pages [{site}]; Tungsten calculated as watts ÷ volts. On 208 V supplies, choose 208 V models.'),
    ('h4', 'Controls on every quote'),
    ('ul', [
      '**Affinity On/Off or Dimmer:** 1, 2 or 5 channels, up to 6 kW a channel at 208–277 V. A 6 kW Tungsten takes one channel.',
      '**Affinity Eclipse controller:** one Eclipse a channel; or the Eclipse Dimmer Controller with remote.',
      '**Manual wall switch** as the local disconnect point where the code asks for one.',
      '**Expansion board** (built into 5-channel): Ethernet and 0–10 V for building management.',
    ]),
  ], [
    ('h4', 'The circuit'),
    ('ul', [
      f'Each 240 V heater or controller channel is hard-wired by a licensed electrician on a dedicated circuit; check panel space first [{nycfs},{mont}].',
      f'Outdoor circuits feeding heaters: GFCI and permit rules vary by jurisdiction; one county requires GFCI protection inside the building [{mont}]. Ask the local inspector.',
      f'Pre-wire every heater position when the pergola goes up [{cave}].',
    ]),
    ('box', 'Gas under a pergola', [('ul', [
      f'Gas heaters cannot be recessed [{faq}].',
      f'With a roof and more than two walls, at least 25% of the total wall area must be fully open, plus 30% of the rest [{gasman}].',
      f'Tungsten Gas: 3 ft to combustibles above, 14 in with the heat shield; 8 ft minimum height [{gasman}].',
      'Under most louvered roofs, electric is simpler: no gas line, no flue, no ventilation sums.',
    ])]),
    ('p', f'One fire on record: two radiant heaters installed without clearance to a combustible patio ceiling [{tsbc}].'),
  ]]),
  ('photo', 'w-mountain-view-retreat-platinum-electric-rece', 230, 'Platinum Electric recessed between louvre bays, lit by the roof\'s own lighting.'),
]))

PAGES.append(dict(type='check', kicker='Dealer Checklist', h2='Sell The Heat With The Pergola', blocks=[
  ('cols', [[
    ('h4', 'At the first meeting'),
    ('ul', ['Ask how late and how cold they want to sit outside.', 'Measure the seating area and the clear height under the beam.', 'Note sea, pool and frame colour.', 'Show the ladder: Classic, Select, Platinum, Eclipse.']),
    ('h4', 'At design'),
    ('ul', ['Mark heater positions on a fan beam or the perimeter beam, never a louvre.', 'Check 8 ft for ceiling heaters; post or wall mount below that.', 'Keep heaters clear of louvre motors and the blades\' arc.', 'Pick the finish: black, white or graphite.']),
  ], [
    ('h4', 'At build'),
    ('ul', ['Pre-wire each position through the hollow post and beam.', 'Dedicated circuits, sized by the electrician; GFCI and permit as the inspector requires.', 'Wet-location fittings where the post is the downspout.']),
    ('h4', 'At handover'),
    ('ul', ['Affinity on the customer\'s phone; zones and schedules set.', 'Voice or home-system link where they have one.', 'By the sea: show the fortnightly wipe-down.']),
    ('box', 'Our next steps (Bromic)', [('ul', ['A Series II bracket and colour kit for the top US pergola systems.', 'Affinity drivers confirmed for Control4, Crestron and Lutron.', 'A test of a bronze finish for bronze frames.'])], True),
  ]]),
  ('photos', [('w-strx-230222-bromic-dc-6', 'Tungsten Electric on a louvered pergola, wired through the structure.'), ('w-vbb7428', 'Tungsten on a pergola beam, aimed at the seats.')], 240),
]))

PAGES.append(dict(type='sources'))
PAGES.append(dict(type='back', img='w-kion-sui-madrid-spain-tungsten-electric-5', alt='Tungsten heaters in a louvered pergola restaurant at night',
  kicker='Bromic Partner Program', h2='You Build The Pergola. We Know How To Heat It.',
  text='Partner pricing, free heating design plans for your projects, extended warranty and one point of contact at Bromic.',
  cta='Join the Bromic Partner Program', site='bromic.com/lp-builders'))
