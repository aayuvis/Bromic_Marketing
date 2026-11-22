"""Build the visual Outdoor Heating Planning Guide, Professional Edition, in landscape and US Letter portrait.
Run from the repo root: python3 reports/planning-guide/engine/build_pro.py pro [--letter] [--inline]
Reuses the Homeowner engine's helpers, styles and drawings (build.py, guide.css, guide.js) and adds its own (guide-pro.css, guide-pro.js).
Figures: content/guides/A02-planning-guide-v2-pro.md (sourced there), the Bromic sizing model (templates/calculation-model.md,
tools/A03-sizing), and the Series II manual and LC recess-kit instructions (cad/REAL-INSTALL-STUDY.md §5)."""
import importlib.util, json, os, re, sys, html
HERE = os.path.dirname(os.path.abspath(__file__))
_s = importlib.util.spec_from_file_location('gb', os.path.join(HERE, 'build.py')); B = importlib.util.module_from_spec(_s); _s.loader.exec_module(B)
PG, ROOT, TE, E = B.PG, B.ROOT, B.TE, html.escape
icon, img, ph, svg, b64 = B.icon, B.img, B.ph, B.svg, B.b64
FILE = 'Bromic-Outdoor-Heating-Planning-Guide-2027-Pro'
FOLIO = 'Outdoor Heating Planning Guide · Professional Edition'

SEQ = [
    ('01', 'Where Do People Sit?', 'Heated zones over seating and bar rails, ft² per zone, drawn on the RCP.', 'users'),
    ('02', 'How Open Is It?', 'Configuration and permanent open perimeter, in %.', 'house'),
    ('03', 'What Can The Heat Hang From?', 'Mount per surface, finished heights AFF, recess details.', 'ruler'),
    ('04', 'How Cold Are The Evenings?', 'Cover and climate factors stated; mounting height by use.', 'thermometer-sun'),
    ('05', 'Which Heater, How Many, Which Controls?', 'Model and count per zone, controller and channels, wall switch, app or BMS.', 'flame'),
    ('06', 'Is The Power In Before The Ceiling Closes?', 'Amps per heater, circuits at 125%, gas load, rough-in, code path.', 'plug'),
]

# Six real-install layouts (cad/REAL-INSTALL-STUDY.md: heaters at the edges or in rows, faces toward the seats).
# Counts: Bromic sizing model, cool evenings: heaters = area / (coverage x cover x 0.85), rounded up; area = seats x 20 ft2.
LAYOUTS = [
    dict(key='P1', title='Covered Dining Terrace', photo=('w-bromic-tungsten-electric-black-recessed', 'Tungsten Electric recessed in a row in a covered terrace'),
         rows=[('Zone', '24 × 16 ft, 384 ft², about 19 seats; covered, two sides open'), ('Heaters', '3 × Tungsten Smart-Heat Electric 6000 W, recessed, in a row'),
               ('Mount', 'Recess kits between the joists, 96 in or more AFF'), ('Controls', 'Affinity Smart-Heat Dimmer, 5-channel (one heater a channel), wall switch, app'),
               ('Circuits', '3 × 25.0 A at 240 V; conductors and OCPD at 31.3 A or more')],
         note='A row parallel to the open edge, over the table and the lounge; the zones meet and overlap.'),
    dict(key='P2', title='Screened Porch, Vaulted Ceiling', photo=('w-dsc05737-courtney-saib', 'Tungsten Electric over a porch with a fireplace'),
         rows=[('Zone', '20 × 14 ft, 280 ft², about 14 seats; covered, two sides screened'), ('Heaters', '2 × Tungsten Smart-Heat Electric 6000 W'),
               ('Mount', 'Pitched-ceiling adaptor near each eave; post vertical, heater level'), ('Controls', 'Affinity Smart-Heat Dimmer, 2-channel, wall switch, app'),
               ('Circuits', '2 × 25.0 A at 240 V; conductors and OCPD at 31.3 A or more')],
         note='One heater near the house wall over the sofa, one near the open side over the table – each facing the seats.'),
    dict(key='P3', title='Outdoor Kitchen Under A Louvred Pergola', photo=('w-240619-yorba-linda-ca-dc-64', 'Electric heaters under a louvred pergola over an outdoor kitchen'),
         rows=[('Zone', '22 × 14 ft, 308 ft², about 15 seats; partly covered'), ('Heaters', '3 × Tungsten Smart-Heat Electric 4000 W'),
               ('Mount', 'Single post on the perimeter beams, tilted no more than 30° toward the seats'), ('Controls', 'Affinity Smart-Heat Dimmer, 5-channel (three in use), wall switch, app'),
               ('Circuits', '3 × 16.7 A at 240 V; conductors and OCPD at 20.8 A or more')],
         note='Heaters on the open edge face back in, over the bar stools and the lounge – never over the grill.'),
    dict(key='P4', title='Front Porch, Recessed Row', photo=('w-tungsten-electric-white-recessed', 'White Tungsten Electric recessed in a porch ceiling'),
         rows=[('Zone', '30 × 10 ft, 300 ft², about 15 seats; covered'), ('Heaters', '3 × Tungsten Smart-Heat Electric 4000 W, recessed'),
               ('Mount', 'Recess kits in a row parallel to the house wall, at least 500 mm from it'), ('Controls', 'Affinity Smart-Heat Dimmer, 5-channel (three in use), wall switch, app'),
               ('Circuits', '3 × 16.7 A at 240 V; conductors and OCPD at 20.8 A or more')],
         note='Evenly spaced over each seating group: the row reads as part of the ceiling.'),
    dict(key='P5', title='Rooftop Lounge Against Glazing', photo=('w-2014-01-29-17-10-54', 'Tungsten Electric on a glazing frame over a rooftop lounge'),
         rows=[('Zone', '20 × 12 ft, 240 ft², about 12 seats; covered, one side open'), ('Heaters', '2 × Tungsten Smart-Heat Electric 6000 W'),
               ('Mount', 'Angled wall brackets on the glazing frame, 72 in or more AFF'), ('Controls', 'Affinity Smart-Heat Dimmer, 2-channel, wall switch, app'),
               ('Circuits', '2 × 25.0 A at 240 V; conductors and OCPD at 31.3 A or more')],
         note='Mounted high on the frame and angled down into the lounge and the dining table.'),
    dict(key='P6', title='Open Terrace On Gas', photo=('w-bromic-pg-residential-hr', 'Platinum Gas on the eave over courtyard dining'),
         rows=[('Zone', '12 seats, 240 ft²; open to the sky'), ('Heaters', '2 × Platinum Smart-Heat Gas 39,800 Btu/h'),
               ('Mount', 'On the house wall, 96 in or more, heat deflectors above'), ('Controls', 'Affinity Smart-Heat On/Off, one channel (up to 10 gas heaters), wall switch, app'),
               ('Supply', 'Gas sized to NFPA 54 for 79,600 Btu/h; 110 V, 2 A at each heater')],
         note='Built-in gas for a large, open terrace; a licensed gas fitter runs the line.'),
]

TILES = [
    ('t2-low-clearance-recess', 'Flush In The Ceiling', 'A clean soffit line; the new low-clearance kit recesses Tungsten in a 7.5 in cavity.', 'Tungsten 65–160 ft² · Platinum 65–143 ft² · ETL/cETL'),
    ('t2-single-post-black', 'On A Wall, Beam Or Post', 'Slim and directional, angled onto the seats.', 'Tungsten Series II: single post, pitch adaptor, wall adaptor'),
    ('w-eclipse-electric-twinpole', 'Over The Table', 'Heat and a dimmable rim light in one, 0/33/66/100%.', 'Eclipse 2900 W · 121 ft² · 8, 24, 48 in poles'),
    ('w-eclipse-portable', 'Moves Where It Is Needed', 'Freestanding, up to four seats each.', 'Eclipse Freestanding 121 ft² · Tungsten Freestanding Gas 215 ft²'),
    ('w-platinum-gas-500', 'Large, Open Spaces On Gas', 'Surface-mounted built-in gas, never recessed.', 'Platinum Gas 23,600 / 39,800 Btu/h · 160 / 215 ft² · Intertek'),
    ('l-005-025', 'Salt Air', '316 marine-grade stainless for the coast.', 'Platinum Marine (IPX5) · Tungsten Coastal'),
]

SOURCES = [
    'Bromic Heating / Atomik Research, Outdoor Living Trends 2026 (US homeowner survey): fewer than one in four prioritize heating at planning.',
    'Bromic Heating, Lookbook 2026; The Official Outdoor Heating Planning Guide, US v1.2 (2021): the 30% open rule, the heat cloud, warm-up times, certification.',
    'Bromic product pages, bromic.com, read 29 October 2026: coverage, ratings, mounting heights, published amps, certifications (Tungsten, Platinum, Platinum Marine, Eclipse, Eclipse Freestanding, Cobalt, Platinum Gas, Tungsten Gas, Tungsten Freestanding Gas).',
    'Bromic product pages: Affinity Smart-Heat On/Off, Dimmer and Eclipse controllers (6 kW a channel at 208–277 V; up to 10 gas heaters; one Eclipse a channel), manual wall switch, expansion board (Ethernet and 0–10 V; BMS mode disables the app).',
    'Bromic Tungsten Smart-Heat Electric Select and Coastal (Series II) installation manual: single post, pitched-ceiling and wall adaptors, tilt limits, clearances (cdn.shopify.com, Bromic-Tungsten-Electric-Select-Coastal-Manual.pdf).',
    'Bromic Tungsten Select and Coastal low-clearance recess kit instructions: 7.5 in cavity, 94 in above the floor, 500 mm from walls and between cut-outs, slope limit (cdn.shopify.com, Bromic-Tungsten-Select-Coastal-LC-Recess-Kit-Instructions.pdf).',
    'Bromic Heating, The Evolution of Outdoor Heating (AIA/CES course AIA4041002): heat mapping, coordination, mounting height by use, inverse-square intensity, the dead zone under a wall heater.',
    'NFPA 70, National Electrical Code, Article 424 with 210.19(A)(1) and 210.20(A) (continuous loads at 125%; EC&M); NFPA 54 / ANSI Z223.1, National Fuel Gas Code.',
    'Bromic sizing model (Content Hub, templates/calculation-model.md and the How many heaters? calculator): 20 ft² a seat; open 0.85, partly covered 1.0, covered 1.1; mild 1.0, cool 0.85, cold 0.7; freestanding up to four seats each. Planning assumptions, confirmed by the design team for each project.',
    'Infrared bands IR-A, IR-B and IR-C as defined by the CIE; peak wavelength by Wien’s displacement law.',
]

def build(ed='pro', inline=False, letter=False):
    RD = os.path.join(PG, ed)
    pages, p = [], [0]
    def folio(dark=False):
        p[0] += 1
        return f'<div class="folio{" dk" if dark else ""}"><span>{E(FOLIO)}</span><span class="draft">Draft for review</span><span>{p[0]:02d}</span></div>'
    def head(kick, h2, lede=None, q=None):
        badge = f'<span class="qn">{q}</span>' if q else ''
        return f'<header class="hd">{badge}<div><div class="kick">{E(kick)}</div><h2>{E(h2)}</h2>{f"<p class=lede>{E(lede)}</p>" if lede else ""}</div></header>'
    def tick(t): return f'<li><span class="cb" data-r="empty"></span>{t}</li>'
    def bul(items): return '<ul class="pbul">' + ''.join(f'<li><b>{E(a)}</b><span>{E(b)}</span></li>' for a, b in items) + '</ul>'

    # 1 cover
    p[0] += 1
    pages.append(f'''<section class="pg cover">{img('w-dsc05656-courtney-saib-split', 'bg', 'A screened porch with a fireplace, drawn as a sketch on the left and photographed finished on the right, a Tungsten heater under the vaulted ceiling')}
  <div class="cv"><img class="logo" src="LOGO" alt="Bromic Heating">
    <div class="ckick">The Official Outdoor Heating Planning Guide</div>
    <h1>Plan The<br>Outdoor <em>Heat</em></h1>
    <div class="region">Professional Edition</div>
    <p>For architects, designers, builders and electricians: six decisions that put the heat on the drawings – zones, mounts, circuits and controls – before the ceiling closes.</p>
  </div><div class="cvnote">Drawn in from schematic design, built exactly as specified.</div></section>''')
    # 2 sequence
    qs = ''.join(f'<li><span class="qi" data-r="circle">{icon(i)}</span><b>{n}</b><div><h3>{E(t)}</h3><p>{E(d)}</p></div></li>' for n, t, d, i in SEQ)
    pages.append(f'''<section class="pg g intro6">
  <div class="il"><div class="kick">Your Sequence</div><h2>Draw The Heat In From Schematic Design</h2>
    <p class="lede">When heat arrives late it arrives as surface conduit, a ceiling that no longer matches and a substitution at bid. Six decisions, in order, give the drawing set everything it needs.</p>
    <div class="stat"><div class="fig">1 in 4</div><p>Fewer than one in four homeowners prioritize heating at planning – the brief usually starts with you.<small>Bromic Outdoor Living Trends 2026, Atomik Research</small></p></div>
    <figure class="istrip">{img('l-010-075-sketch', alt='Sketch of a glass pavilion with heaters recessed flush in the ceiling')}</figure></div>
  <div class="ir"><div class="kick">Six Decisions · Output For The Drawings</div><ol class="six">{qs}</ol></div>{folio()}</section>''')
    # 3 Q1 heat map + RCP
    pages.append(f'''<section class="pg g full pro-rcp">
  {head('Question 01 · Map The Heat', 'Map The Heat Before The Ceiling Fills Up', 'Mark where people sit, dine, stand and pass, then lay the heat over those zones before choosing a finish or a mount. Heaters compete for the soffit with downlights, fans, speakers and ducts – coordinate them in design development.', '01')}
  <div class="pr2"><div>{svg('rcp', '900 400', 'chart')}</div>
    <div class="pcol">{ph('l-010-075', 'Heaters flush in a pavilion ceiling, lights set between them')}{ph('w-bromic-shoot-may-11-2023-54', 'A recessed heater beside a downlight in a timber soffit')}</div></div>
  {bul([('About 20 ft² A Seat', 'Measure the seating and bar rails, not the circulation.'), ('Fewer, Higher-Output', 'Fewer heaters placed where they work read as a calmer ceiling.'), ('Match The Finish', 'Black, white, stainless – and graphite in the Select collection.')])}{folio()}</section>''')
    # 4 Q2 outdoors
    pages.append(f'''<section class="pg g full">
  {head('Question 02', 'Confirm The Space Is Outdoors', 'For heating design a space is outdoor when at least 30% of its horizontal perimeter is permanently open. A cover holds a gentle heat cloud; sizing always rests on radiant coverage.', '02')}
  {svg('open3', '740 620', 'chart wide', 2) if letter else svg('open3', '1460 330', 'chart wide')}
  <div class="trip">{ph('w-crown-towers-perth-bromic-tungsten-electric', 'Covered, open along one side – size for the exposure')}{ph('w-connecticut-privateresidence-tungstenelectri-3', 'Covered porch, open front – a strong heat cloud')}{ph('w-e-tungsten-1', 'Glazing that closes below 30% open: treat as enclosed and check with the AHJ')}</div>{folio()}</section>''')
    # 5 Q3 Series II mounts
    pages.append(f'''<section class="pg g full">
  {head('Question 03', 'Mount By Surface', 'What is overhead or behind the seats decides the mount. Real installs keep heaters near an edge – a wall, a beam, the open side – with the face toward the seats.', '03')}
  {svg('series2', '876 940', 'chart wide s2', 3) if letter else svg('series2', '1460 440', 'chart wide s2')}
  <div class="quad">{ph('t2-single-post-black', 'Series II on the single post', 'ph cut')}{ph('w-dsc05545-courtney-saib', 'Angled on its bracket under a timber ceiling')}{ph('w-connecticut-privateresidence-tungstenelectri', 'Recessed in a porch ceiling')}{ph('t2-low-clearance-recess', 'Series II in the low-clearance recess kit', 'ph cut')}</div>{folio()}</section>''')
    # 6 recess detail
    pages.append(f'''<section class="pg g full">
  {head('Question 03 · The Recess', 'Detail The Recess As Its Own Drawing', 'A recessed heater gives warmth felt without being seen and keeps the soffit line clean. Recessing is an electric detail; built-in gas mounts to the surface.', '03')}
  <div class="pr2 rec"><div>{svg('recess', '820 540', 'chart')}</div>
    <div class="pcol">{ph('w-bromic-shoot-may-11-2023-43', 'Fitting a heater into its recess kit')}{ph('l-005-022', 'Tungsten Coastal, recessed flush')}</div></div>
  <p class="foot">Series II low-clearance kit (Select 304, Coastal 316 marine stainless): figures from its installation instructions. Draw each recess with the kit and cut-out, cavity above the finished ceiling, blocking, junction-box position and access, and the clearances the manual sets.</p>{folio()}</section>''')
    # 7 Q4 cover and cold
    pages.append(f'''<section class="pg g side-r2">
  <div class="qt">{head('Question 04', 'State The Cover And The Climate', 'The same heater covers less in colder air, and wind draws heat out of the zone. The sizing model states its factors so the count is traceable.', '04')}
    <ul class="levers"><li><b>Cover</b><span>Open 0.85 · partly covered 1.0 · covered 1.1</span></li><li><b>Climate</b><span>Mild 1.0 · cool 0.85 · cold 0.7</span></li><li><b>Freestanding</b><span>Never more than four seats each</span></li></ul>
    <p class="rule">Exposed site? Add glass screens or windbreaks on the windward side as part of the heating design.</p>
    <p class="src">Planning assumptions in the Bromic sizing calculator, confirmed by the design team for each project; not published ratings.</p>
    <figure class="qstrip">{img('l-012-093', alt='A covered lounge facing the water at dusk, pendant heaters overhead')}<figcaption>A covered lounge holds its warmth</figcaption></figure></div>
  <div class="qv">{svg('matrix', '760 600')}</div>{folio()}</section>''')
    # 8 heights and placement
    pages.append(f'''<section class="pg g full">
  {head('Question 04 · Height And Placement', 'Set Heights By How The Zone Is Used', 'Radiant intensity falls with the square of distance. Too high and the output is lost before it arrives; too low and the seat beneath runs hot.', '04')}
  {svg('heights', '1100 440', 'chart wide hts')}
  <div class="pr3"><div>{svg('deadzone', '650 270', 'chart')}<p class="tipl">A wall heater projects its warmth outward: a table pushed against the wall beneath it sits in a dead zone. Set the table forward, and warm wide tables from both sides.</p></div>
    {ph('l-013-106', 'Seated: about 8 ft')}{ph('w-bromic-sep18th-14', 'Bar rail: about 10 ft')}{ph('w-bromic-ambiente-sedona-16', 'Entry: about 12 ft')}</div>
  <p class="foot">Heights by use: Bromic guidance (AIA/CES course), never below each model’s minimum. Confirm against each installation manual.</p>{folio()}</section>''')
    # 9 physics
    pages.append(f'''<section class="pg g full">
  {head('How Heat Moves Outdoors', 'Every Outdoor Scheme Rests On Radiant Warmth', 'Convected heat rises and disperses, and forced air cannot hold an open space at temperature. Directional infrared aimed at people is what works.')}
  <div class="modes3">{ph('aia-convection', 'Convection – warms the air, which rises and drifts away', 'md')}{ph('aia-conduction', 'Conduction – warms only what a guest touches', 'md')}{ph('aia-radiant', 'Radiant – warms people and surfaces directly', 'md')}</div>
  <div class="phy"><div class="phl">{svg('spectrum', '1000 440', 'chart wide')}</div>
    <div class="phr">{ph('l-007-034', 'Medium wave: a soft glow, no glare', 'ph big')}<div class="waves"><div><h3>Short Wave</h3><p>Hottest elements; instant, intense, bright glow and glare.</p></div><div class="hl"><h3>Medium Wave</h3><p>Soft glow, little glare, warm in about 30 seconds. Bromic Platinum, Eclipse and Tungsten Electric.</p></div><div><h3>Long Wave</h3><p>No visible glow, about 5 minutes to warm, more easily dispersed by moving air.</p></div></div></div></div>
  <p class="foot">All infrared travels in straight lines at the speed of light; reach depends on output, reflector and mounting height, not on wavelength. Wien’s law, λ ≈ 2,898 µm·K ÷ T: about 2,400 K → 1.2 µm; 1,200 K → 2.4 µm; 700 K → 4.1 µm (typical element temperatures, for illustration). Warm-up times: Bromic Planning Guide v1.2.</p>{folio()}</section>''')
    # 10 range
    tiles = ''.join(f'<article class="tile"><div class="ti">{img(i, alt=t)}</div><h3>{E(t)}</h3><p>{E(d)}</p><small>{E(f)}</small></article>' for i, t, d, f in TILES)
    pages.append(f'''<section class="pg g full">
  {head('Question 05 · The Heater', 'Specify By Purpose', 'Start from what the zone needs; the model follows. Full ratings, SKUs and cut sheets are on the Hub and in the spec kit.', '05')}
  <div class="tiles">{tiles}</div>
  <p class="foot">Coverage is approximate and varies with mounting height, wind and installation. Until Tungsten Classic arrives in January 2027, its drawings carry an approved current alternate. Every heater is specified with its Affinity Smart-Heat Controls.</p>{folio()}</section>''')
    # 11 how many
    pages.append(f'''<section class="pg g bloom">
  <figure class="bimg">{img('w-eclipse-electric-24twin-pole-residential-sce-bloom', alt='Eclipse pendants over a dining table at dusk, with a warm cone drawn where the warmth falls')}<figcaption>Where the warmth falls – an illustration, not a measured pattern</figcaption></figure>
  <div class="qt">{head('Question 05 · How Many', 'Count Per Zone, Factors Stated', None, '05')}
    <ul class="thumbs"><li><b>Zone area ÷ effective coverage, rounded up</b><span>Effective coverage = nominal × cover × climate, from the sizing calculator</span></li>
      <li><b>Freestanding: the larger of that and seats ÷ 4</b><span>Seated guests block the radiant heat of a freestanding unit</span></li>
      <li><b>Zones meet and slightly overlap</b><span>No cold seams; long tables warmed from both sides</span></li></ul>
    <div class="scale-k">Nominal coverage, drawn to the same scale</div>{svg('scale', '640 220')}
    <p class="rule">Run each zone through the free <b>How Many Heaters?</b> calculator, then send the plan to the Bromic design service for coverage drawings.</p></div>{folio()}</section>''')
    # 12 power
    pages.append(f'''<section class="pg g full">
  {head('Question 06 · Power', 'Size Every Branch Circuit', 'Current is watts ÷ volts. Fixed electric space-heating loads are continuous, so conductors and overcurrent devices are sized at no less than 125% of the load (NEC 424, 210.19(A)(1), 210.20(A)).', '06')}
  <div class="pr2 pw"><div>{svg('amps', '960 470', 'chart')}</div>
    <div class="pcol">{ph('t2-low-clearance-recess', 'The new low-clearance recess kit: dual fan-ventilated, 7.5 in cavity', 'ph cut')}{ph('w-bromic-shoot-may-11-2023-43', 'Each heater on its own circuit, fitted before the ceiling is finished')}
      <div class="gasn"><h3>Gas Supply</h3><p>Size piping for the total connected Btu/h, length and pressure to NFPA 54. Built-in gas also needs 110 V, 2 A at each heater; the freestanding gas heater runs on a 20 lb LPG cylinder or a 10 ft natural-gas quick-connect.</p></div></div></div>
  <p class="foot">Published amps from the product pages; Tungsten rows are W ÷ V and marked. Breaker sizes, Article 424 vs 422 and Tungsten amps await confirmation against the installation manuals. Feeders and services follow Article 220.</p>{folio()}</section>''')
    # 13 controls
    cuts = ''.join(ph(i, c, 'ph cut') for i, c in [('w-affinity-dimmer-2ch-2', 'Dimmer: 1% steps'), ('w-affinity-5ch-onoff', 'On/Off: electric and gas'), ('w-expansion-board', 'Expansion board: BMS'), ('w-manual-1ch-indoor-switch-image', 'Wall switch: 20 A, 120–277 V')])
    pages.append(f'''<section class="pg g full">
  {head('Question 05 · Controls', 'Specify The Controls With Every Heater', 'Zoning is the efficiency strategy: one channel per zone that opens on its own, each at its own level. Every heater schedule carries a controls line.', '05')}
  <div class="pr2 ctl"><div>{svg('channels', '760 370', 'chart')}<div class="cuts">{cuts}</div></div>
    <div>{svg('bms', '620 390', 'chart')}{ph('t-009-025', 'Zones and schedules from a tablet')}</div></div>
  <p class="foot">Controllers IP54, −4 to 86 °F; 2.4 GHz Wi-Fi, Bluetooth about 30 ft, optional Ethernet; UL 60730-1. Wi-Fi and app features need compatible Affinity Smart-Heat Controls, sold separately. Control4, Crestron and Lutron compatibility varies and may need extra hardware.</p>{folio()}</section>''')
    # 14-16 layouts
    per = 1 if letter else 2
    NAMES = ['Terraces And Porches', 'Kitchens And Porches', 'Rooftops And Gas']
    for k in range(0, len(LAYOUTS), per):
        cards = ''
        for L in LAYOUTS[k:k + per]:
            chips = ''.join(f'<li><span>{a}</span>{E(b)}</li>' for a, b in L['rows'])
            pid, pcap = L['photo']
            cards += f'<article class="lay">{svg(L["key"], "720 550" if letter else "720 360", "plan")}<div class="lb">{ph(pid, "A Bromic installation like this layout: " + pcap)}<div><h3>{E(L["title"])}</h3><ol class="flow">{chips}</ol><p>{E(L["note"])}</p></div></div></article>'
        pages.append(f'''<section class="pg g full layp">
  {head('Layouts · Zone, Heaters, Mount, Controls, Circuits', LAYOUTS[k]['title'] if letter else NAMES[k // 2], None)}
  <div class="lays">{cards}</div>
  <p class="foot">Plans to scale. Warm zones show each heater’s effective coverage for the zone (approximate; it varies with mounting height, wind and installation); arrows show which way each heater faces; tags H1, H2… match the circuit and channel schedule. Counts from the Bromic sizing calculator for cool evenings (about 40–50°F). Amps calculated as W ÷ V for Tungsten.</p>{folio()}</section>''')
    # 17 rough-in
    ri = ''.join(tick(t) for t in ['Heater tags on the RCP, with zone and channel', 'Blocking and recess framing, cavity depth checked', 'Circuit per heater or group at 125%; panel capacity', 'Junction boxes dimensioned, with access', 'Controller location, power and data runs; wall-switch boxes at the thresholds', 'Gas line, shut-offs and 110 V at each built-in gas heater'])
    pages.append(f'''<section class="pg g full rough">
  {head('Question 06 · Rough-In', 'Power In Before The Ceiling Closes', 'Plan the rough-in while the ceiling is open and the wiring goes in once – hidden, and exactly where each heater hangs.', '06')}
  {svg('timeline', '740 690', 'chart wide', 2) if letter else svg('timeline', '1460 380', 'chart wide')}
  <div class="pr2 rck"><div><div class="kick">Rough-In Checklist</div><ul class="ckl">{ri}</ul></div>{ph('w-connecticut-private-res-tungsten-electric-1', 'An Affinity controller enclosure, wired in')}</div>{folio()}</section>''')
    # 18 clearances and code
    pages.append(f'''<section class="pg g full">
  {head('Clearances And Code', 'Confirm Clearances And Code Early', 'Each model is read on its own manual and listing, never interpolated from another. A heater outside its clearances can underheat the zone as well as breach the listing.')}
  <div class="pr2 clr"><div>{svg('clear', '640 400', 'chart')}</div><div>{svg('aff', '840 380', 'chart')}</div></div>
  <ul class="trio"><li><b>Electric</b><span>ANSI/NFPA 70: circuits, overcurrent protection, disconnects, wiring methods.</span></li>
    <li><b>Gas</b><span>ANSI Z223.1/NFPA 54: location, supply, ventilation, clearance to combustibles.</span></li>
    <li><b>Certification</b><span>An Intertek, UL or CSA mark on every gas and electrical appliance.</span></li>
    <li class="pli">{ph('l-010-076', 'A heater set neatly between pergola louvres')}</li></ul>
  <p class="foot">Indicative only. The adopted code edition and local amendments govern. Confirm with the local building authority, and have heaters installed by a licensed electrician or gas fitter to the manufacturer’s instructions.</p>{folio()}</section>''')
    # 19 submittal + design service
    sub = ''.join(tick(t) for t in ['Cut sheet: model, wattage or Btu/h, voltage, finish, SKU', 'Manual pages: mounting heights and clearances', 'Listing and certification mark', 'Wiring diagram, amps and circuit schedule',
                                    'Controls schedule: controller, channels, wall switch, app or BMS', 'Recess, pole or deflector details', 'Coverage drawing from the design service; warranty terms'])
    pages.append(f'''<section class="pg g brief">
  <figure class="bimg">{img('w-kion-sui-madrid-spain-tungsten-electric-5-split', alt='A restaurant terrace under a louvred pergola, half sketch and half finished photograph, Tungsten heaters on the beams')}</figure>
  <div class="qt"><div class="kick">Design Service And Submittals</div><h2>Design It With Us</h2>
    <p class="lede">Send plans, sections or photos to the Bromic design service: our team returns heater selection, placement and coverage drawings, at no charge. A complete submittal for each heater tag gathers:</p>
    <ul class="ckl">{sub}</ul><div class="cta">Book A Design Consult</div><div class="site">bromic.com · the spec kit has CSI sections, details and coverage tables</div></div>{folio()}</section>''')
    # 20 sources
    src = ''.join(f'<li>{E(s)}</li>' for s in SOURCES)
    pages.append(f'''<section class="pg srcs"><div class="kick">Sources</div><h2>Where The Numbers Come From</h2><ol>{src}</ol>
  <p class="note">Coverage, heights, amps and controls are planning guidance from Bromic’s published product information and manuals; confirm each model in its installation manual and listing and with the authority having jurisdiction. Photography: Bromic installations, product renders and Bromic Lookbook 2026; sketch renderings and the warm-zone illustration are made from those photographs.</p>{folio()}</section>''')

    css = open(os.path.join(TE, 'report.css')).read() + '\n' + open(os.path.join(HERE, 'guide.css')).read() + '\n' + open(os.path.join(HERE, 'guide-pro.css')).read()
    if letter: css += '\n' + open(os.path.join(TE, 'report-letter.css')).read() + '\n' + open(os.path.join(HERE, 'guide-letter.css')).read() + '\n' + open(os.path.join(HERE, 'guide-pro-letter.css')).read()
    fonts = os.path.join(ROOT, 'app', 'src', 'fonts')
    if inline:
        css = css.replace('FONT_DIDOT', b64(os.path.join(fonts, 'gfs-didot-latin.woff2'), 'font/woff2')).replace('FONT_ARIMO', b64(os.path.join(fonts, 'arimo-latin.woff2'), 'font/woff2'))
    else:
        css = css.replace('FONT_DIDOT', '../../../app/src/fonts/gfs-didot-latin.woff2').replace('FONT_ARIMO', '../../../app/src/fonts/arimo-latin.woff2')
    body = '\n'.join(pages)
    logo = os.path.join(ROOT, 'images', 'portfolio', 'bromic-logo.png')
    if inline:
        body = body.replace('src="LOGO"', f'src="{b64(logo, "image/png")}"')
        body = re.sub(r'src="img/([^"]+)"', lambda m: f'src="{b64(os.path.join(RD, "img", m.group(1)), "image/webp")}"', body)
    else:
        body = body.replace('src="LOGO"', 'src="../../../images/portfolio/bromic-logo.png"')
    js = open(os.path.join(TE, 'report.js')).read(); charts = open(os.path.join(HERE, 'guide.js')).read(); pro = open(os.path.join(HERE, 'guide-pro.js')).read()
    rough = open(os.path.join(TE, 'vendor', 'rough-4.6.6.js')).read()
    doc = f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex"><title>Outdoor Heating Planning Guide · Professional Edition</title><style>{css}</style></head><body class="{'letter' if letter else 'land'} pro"><main id="deck">
{body}
</main><script>{rough}</script><script>{charts}</script><script>{pro}</script><script>{js}</script></body></html>'''
    name = (FILE + ('-Letter' if letter else '') + '.html') if inline else ('letter.html' if letter else 'index.html')
    open(os.path.join(RD, name), 'w').write(doc); print(os.path.join(RD, name), round(len(doc) / 1e6, 2), 'MB')

if __name__ == '__main__':
    a = [x for x in sys.argv[1:] if not x.startswith('--')]
    build(a[0] if a else 'pro', inline='--inline' in sys.argv, letter='--letter' in sys.argv)
