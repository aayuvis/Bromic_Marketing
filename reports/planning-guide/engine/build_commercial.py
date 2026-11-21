"""Build the visual Outdoor Heating Planning Guide, Commercial Edition (restaurants, bars, hotels and venues), landscape and US Letter.
Run from the repo root:  python3 reports/planning-guide/engine/build_commercial.py [--letter] [--inline]
Shares the Homeowner edition's helpers, styles and drawings (build.py, guide.css, guide.js) and adds the venue pages
(guide-commercial.js, guide-commercial.css). Every figure comes from content/guides/A02-planning-guide-v2-commercial.md (sourced
there) or the Hub's calculation model (templates/calculation-model.md, tools/A03-sizing, A20, A21); layout heater counts are the
A03 model's, placement follows cad/REAL-INSTALL-STUDY.md (heaters at the edges, faces toward the seats)."""
import importlib.util, json, os, re, sys
HERE = os.path.dirname(os.path.abspath(__file__))
_s = importlib.util.spec_from_file_location('guide_base', os.path.join(HERE, 'build.py')); B = importlib.util.module_from_spec(_s); _s.loader.exec_module(B)
E, icon, img, ph, svg, b64 = B.E, B.icon, B.img, B.ph, B.svg, B.b64
PG, ROOT, TE = B.PG, B.ROOT, B.TE
ED = 'commercial'
FILE = 'Bromic-Outdoor-Heating-Planning-Guide-2027-Commercial'
FOLIO = 'Outdoor Heating Planning Guide · Commercial Edition'

QUESTIONS = [
    ('01', 'Where Do Guests Sit?', 'Map the seats and the service sections, not the whole terrace.', 'users'),
    ('02', 'How Open Is It?', 'Cover, enclosure and wind – and what the fire code allows.', 'house'),
    ('03', 'What Can The Heat Hang From?', 'Canopy, beam, wall, pendant – or freestanding. Height follows use.', 'ruler'),
    ('04', 'How Long Is Your Season?', 'Colder nights and more open terraces need a little more heat.', 'thermometer-sun'),
    ('05', 'Which Heater, How Many, Which Controls?', 'The fuel, the family, the count, the zones and the schedules.', 'flame'),
    ('06', 'Is The Power In Before Fit-Out Closes?', 'Power or gas, permits and the fire marshal, planned early.', 'plug'),
]

LAYOUTS = [
    dict(key='C1', title='Restaurant Covered Terrace', seats=24, cover='Covered (canopy)', mount='On the canopy edges, angled in over the tables',
         heater='4 × Tungsten Smart-Heat Electric 6000 W', controls='Affinity Smart-Heat Dimmer, 5-channel (one channel a heater), a wall switch at the host stand and the app',
         note='Two rows of tables, two heaters along each long edge: every table sits inside a warm zone, and each half of the terrace can open on its own.',
         photo=('w-kion-sui-madrid-spain-tungsten-electric-5', 'Tungsten Electric on the beams of a restaurant terrace')),
    dict(key='C2', title='Street Dining Enclosure', seats=16, cover='Covered, sidewalk side open', mount='On the ceiling, a row along the table line',
         heater='3 × Tungsten Smart-Heat Electric 4000 W', controls='Affinity Smart-Heat Dimmer, 5-channel, a wall switch and the app',
         note='One heater wide, so the heaters run in a row over the tables. Keep at least 30% of the perimeter open, and check the enclosure with the fire marshal.',
         photo=('w-dsc000071', 'Linear heaters along the ceiling of a street dining enclosure')),
    dict(key='C3', title='Rooftop Bar', seats=16, cover='Partly covered (pergola)', mount='Pendant from the pergola beams',
         heater='4 × Eclipse Smart-Heat Electric', controls='Affinity Smart-Heat Eclipse controller, 5-channel (one Eclipse a channel), a wall switch behind the bar and the app',
         note='Two pendants over the bar rail, about 10 ft up for high-tops, and two over the lounge – heat and a dimmable rim light in one fixture.',
         photo=('w-eclipse-1200pole-industrial-1', 'Eclipse pendants under a steel pergola on a rooftop')),
    dict(key='C4', title='Hotel Pool Cabanas', seats=12, cover='Covered (cabana roofs)', mount='Pendant, one in each cabana',
         heater='3 × Eclipse Smart-Heat Electric', controls='Affinity Smart-Heat Eclipse controller, 5-channel (a channel per cabana), schedules in the app',
         note='One Eclipse over each cabana’s seating, scheduled to each booking – warmth for after the swim.',
         photo=('l-013-102', 'Eclipse pendants over a poolside loggia')),
    dict(key='C5', title='Pergola Garden, Long Tables', seats=32, cover='Partly covered (pergola)', mount='On the perimeter beams, facing in',
         heater='6 × Platinum Smart-Heat Electric 4500 W', controls='Affinity Smart-Heat Dimmer, 5-channel and 1-channel (one channel a heater), a wall switch and the app',
         note='Heaters on the beams around the edge, angled in over the long tables, so guests on both sides stay warm.',
         photo=('w-boardwalk-edits-49', 'Platinum Electric on a pergola beam over a long table')),
    dict(key='C6', title='Café Frontage Under An Awning', seats=12, cover='Partly covered (awning)', mount='On the shopfront wall, 72 in or more',
         heater='3 × Tungsten Smart-Heat Electric 3000 W', controls='Affinity Smart-Heat Dimmer, 2-channel (two 3000 W heaters on one channel), a wall switch inside and the app',
         note='Wall heaters angled down over the pavement tables; the walkway stays clear and the sidewalk permit sets the seating line.',
         photo=('w-bromictungstenelectic-white', 'Tungsten Electric on a café wall over set tables')),
    dict(key='C7', title='Hotel Entrance And Valet', seats=0, cover='Covered (entrance canopy)', mount='On the entrance wall, about 12 ft up for standing guests',
         heater='2 × Tungsten Smart-Heat Electric 6000 W', controls='Affinity Smart-Heat On/Off or Dimmer, 2-channel, on a schedule, a wall switch at the concierge and the app',
         note='About 200 ft² of waiting space under the canopy: warmth for arrivals and the valet line, a space guests once hurried through.',
         photo=('w-bromic-ambiente-sedona-17', 'Tungsten Electric on the wall above a valet stand')),
    dict(key='C8', title='Open Terrace On Natural Gas', seats=24, cover='Open to the sky', mount='Built-in gas on the building wall, 96 in or more',
         heater='4 × Platinum Smart-Heat Gas 39,800 Btu/h', controls='Affinity Smart-Heat On/Off controller (gas switches on and off; up to 10 gas heaters a channel), a wall switch and the app',
         note='A large open terrace with a gas line in place: built-in heaters on the wall, angled down over the tables. A licensed gas fitter runs the line and a 110 V supply.',
         photo=('w-california-laprovenance-platinumgas-01', 'Platinum Gas on the walls and beams of a restaurant patio')),
]

TILES = [
    ('w-tungelec-stacked', 'Canopies, Soffits And Walls', 'Slim and architectural; surface-mounted or recessed.', 'Tungsten Electric'),
    ('w-platinum-black', 'Awnings, Poles And Walls', 'A proven linear heater for busy terraces.', 'Platinum Electric'),
    ('w-eclipse-electric-twinpole', 'Over The Table', 'Heat and a dimmable rim light in one fixture.', 'Eclipse Electric'),
    ('w-eclipse-portable', 'Flexible Layouts', 'Moves with the floor plan; up to four seats each.', 'Eclipse Freestanding · Tungsten Freestanding Gas'),
    ('l-005-025', 'Waterfront And Marina', 'Marine-grade stainless for salt air.', 'Platinum Electric Marine · Tungsten Coastal (coming soon)'),
    ('w-platinum-gas-500', 'Large Open Terraces On Gas', 'Built-in gas where a gas line is in place.', 'Platinum Gas · Tungsten Gas'),
]

SOURCES = [
    'National Restaurant Association, “Winter woes: what’s the plan when it’s too cold to dine outdoors?” (operator survey, fall 2020): 74% of full-service operators offered outdoor seating; 49% were extending the outdoor season.',
    'Bromic Heating, Lookbook 2026: coverage of Eclipse and Tungsten Freestanding Gas, Tungsten Coastal and Select (coming soon), design service.',
    'Bromic Heating, The Official Outdoor Heating Planning Guide, US v1.2 (2021): the 30% open rule, the heat cloud, the radiant principle, warm-up times, certification.',
    'Bromic product pages, bromic.com, 2026: Tungsten Electric, Platinum Electric and Marine, Eclipse Electric and Freestanding, Platinum Gas, Tungsten Gas and Freestanding Gas (coverage, mounting heights, 110 V supply for built-in gas).',
    'Bromic product pages, bromic.com, 2026: Affinity Smart-Heat On/Off, Dimmer and Eclipse controllers (6 kW a channel at 208–277 V; up to 10 gas heaters a channel; one Eclipse a channel), manual wall switch, Expansion Board (Ethernet and 0–10 V to a BMS).',
    'U.S. Energy Information Administration: commercial electricity 14.07¢/kWh (Monthly Energy Review, January–May 2026); commercial natural gas $1.01 a therm (Natural Gas Monthly, January–April 2025); propane $2.46 a gallon (Winter Fuels Outlook 2025–26).',
    'NFPA 70, National Electrical Code; NFPA 54 / ANSI Z223.1, National Fuel Gas Code; NFPA 58, Liquefied Petroleum Gas Code; International Code Council, International Fire Code 2024, Chapter 6.',
    'North Carolina Office of State Fire Marshal, 06.03.4 Unvented heaters – restaurants (2021): a patio enclosed with clear plastic needs a vented fuel-fired heater or an electric heater.',
    'Bromic Heating, The Evolution of Outdoor Heating (AIA/CES course AIA4041002, 2026): directional radiant heat, mounting heights by use, medium wave over tables, zoning, fuel profiles.',
    'Bromic sizing and return models (Content Hub, templates/calculation-model.md; How many heaters?, five-year cost and ROI calculators): 20 ft² a seat (NAFEM chart, Restaurant Furniture seating capacity guide); open 0.85, partly covered 1.0, covered 1.1; mild 1.0, cool 0.85, cold 0.7; freestanding up to four seats each. The factors, turns, check, nights and installed cost are planning assumptions, confirmed for each project.',
    'Infrared bands IR-A, IR-B and IR-C as defined by the CIE; peak wavelength by Wien’s displacement law.',
]

def build(inline=False, letter=False):
    RD = os.path.join(PG, ED)
    pages, p = [], [0]
    def folio(dark=False):
        p[0] += 1
        return f'<div class="folio{" dk" if dark else ""}"><span>{E(FOLIO)}</span><span class="draft">Draft for review</span><span>{p[0]:02d}</span></div>'
    def head(kick, h2, lede=None, q=None):
        badge = f'<span class="qn">{q}</span>' if q else ''
        return f'<header class="hd">{badge}<div><div class="kick">{E(kick)}</div><h2>{E(h2)}</h2>{f"<p class=lede>{E(lede)}</p>" if lede else ""}</div></header>'
    def tick(t): return f'<li><span class="cb" data-r="empty"></span>{t}</li>'

    # cover
    p[0] += 1
    pages.append(f'''<section class="pg cover">{img('l-013-104-split', 'bg', 'A resort loggia with Eclipse pendants, drawn as a sketch on the left and photographed finished on the right')}
  <div class="cv"><img class="logo" src="LOGO" alt="Bromic Heating">
    <div class="ckick">The Official Outdoor Heating Planning Guide</div>
    <h1>Plan Your<br>Outdoor <em>Heat</em></h1>
    <div class="region">Commercial Edition</div>
    <p>For restaurants, bars, hotels and venues: six questions that turn a summer terrace into seats you sell all year.</p>
  </div><div class="cvnote">From the first sketch to a full terrace – plan the warmth with the service.</div></section>''')
    # six questions
    qs = ''.join(f'<li><span class="qi" data-r="circle">{icon(i)}</span><b>{n}</b><div><h3>{E(t)}</h3><p>{E(d)}</p></div></li>' for n, t, d, i in QUESTIONS)
    pages.append(f'''<section class="pg g intro6">
  <div class="il"><div class="kick">Start Here</div><h2>Plan The Warmth Like You Plan Service</h2>
    <p class="lede">A warm terrace keeps guests at the table for one more course and fills covers on nights that would otherwise sit empty. Answer six questions in order, and the power, the heaters and the controls go in once.</p>
    <div class="stat"><div class="fig">74%</div><p>of full-service operators offered outdoor seating in a 2020 survey, and 49% were extending the outdoor season, including with tents or patio heaters.<small>National Restaurant Association, operator survey, fall 2020</small></p></div>
    <figure class="istrip">{img('w-bromic-sep18th-9-1-sketch', alt='Sketch of a restaurant arcade with heaters on poles over the tables')}</figure></div>
  <div class="ir"><div class="kick">Six Questions</div><ol class="six">{qs}</ol></div>{folio()}</section>''')
    # what a heated seat is worth
    chain = ''.join(f'<li><b>{E(a)}</b><span>{E(b)}</span></li>' for a, b in [('40', 'heated seats'), ('1.5', 'turns a night'), ('$45', 'average check'), ('60', 'extra nights a year'), ('50%', 'of the heated seats filled')])
    ex = ''.join(f'<li><span>{E(a)}</span><b>{E(b)}</b></li>' for a, b in [('Added revenue', '$81,000'), ('Contribution at a 30% margin', '$24,300'), ('Running cost: 7 × Platinum Electric 4500 W, 5 h, 60 nights', '$1,330'), ('Net gain a year', '$22,970')])
    pages.append(f'''<section class="pg g side-r2 worth">
  <div class="qt">{head('The Business Case', 'What A Heated Seat Is Worth')}
    <p class="lede2">Guests settle in when they can count on being comfortable, so a heated terrace becomes space you can book, staff and sell whatever the forecast. Count only the nights the terrace would stay empty without heat, and work on contribution, not sales.</p>
    <ol class="chain">{chain}</ol>
    {ph('w-commercial-australia-sydney-manly-wharf-15', 'Guests at a heated waterfront café terrace', 'ph wimg')}</div>
  <div class="qv"><div class="kick">The Worked Example</div><ul class="wex">{ex}</ul>
    <div class="kick" style="margin-top:18px">Payback, By How Full The Heated Seats Are</div>{svg('payback', '700 250')}
    <p class="src">On a $35,000 installed placeholder for heaters, Affinity Smart-Heat Controls, wiring and permits – not a Bromic price. Turns, check, nights and margin are planning assumptions; your POS and last year’s weather closures give your own. The ROI calculator runs the numbers for your site.</p></div>{folio()}</section>''')
    # Q1 seats and sections
    pages.append(f'''<section class="pg g qp side-l">
  <figure class="qimg">{img('w-smoque-n-bones-tungsten-electric-1', alt='Rows of Tungsten Electric heaters angled down from the beams over restaurant tables')}<figcaption>A heater over every table line</figcaption></figure>
  <div class="qt">{head('Question 01', 'Where Do Guests Sit?', 'Draw the floor the way your team runs service, so each section is warmed when it opens and rested when it closes. Plan heat over every seat you sell, not one hot spot.', '01')}
    {svg('zones', '760 425')}
    <p class="rule"><b>Rule of thumb:</b> about 20 ft² a seat, aisles included. One zone for each section that opens and closes on its own.</p></div>{folio()}</section>''')
    # Q2 how open
    PHOTOS2 = '<div class="trip">' + ph('l-016-131', 'Open to the sky') + ph('l-013-111', 'Under an awning') + ph('w-the-ivy-london-tungsten-electric', 'Under a glazed pergola') + '</div>'
    ROW2 = f'<div class="row2"><div>{svg("cloud", "720 250")}<p class="tipl">A roof or awning holds a gentle “heat cloud” over the tables. Glass, screens or plastic sidewalls change the design – and what the fire code permits.</p></div>{PHOTOS2}</div>'
    TIPS = ('<h3>A Cover Works In Your Favor</h3><p>Under a canopy or awning, warm air gathers into a gentle “heat cloud” that adds to the radiant warmth, so a covered terrace needs fewer heaters than an open one.</p>'
            '<h3>Enclosing? Talk To The Fire Marshal First</h3><p>Walls, glazing or plastic sidewalls can change both the heating design and what the code permits. In one state interpretation, a patio enclosed with clear plastic needs a vented fuel-fired heater or an electric heater.</p>')
    pages.append(f'''<section class="pg g full">
  {head('Question 02', 'How Open Is It?', 'Radiant heat is made for the outdoors. A terrace counts as outdoor when at least 30% of its perimeter is permanently open – and a canopy or awning works in your favor.', '02')}
  {svg('open3', '740 620', 'chart wide', 2) if letter else svg('open3', '1460 330', 'chart wide')}
  {PHOTOS2 if letter else ROW2}{folio()}</section>''')
    if letter: pages.append(f'''<section class="pg g full">
  {head('Question 02 · Cover', 'A Canopy Keeps Warmth In', None, '02')}
  {svg('cloud', '720 250', 'chart wide')}<div class="tips">{TIPS}</div>
  {ph('w-platinum-gas-sheraton-carlsbad-ca-usa', 'Heaters on drop poles over a hotel restaurant terrace at night', 'ph qstrip2')}{folio()}</section>''')
    # Q3 mounts and heights
    pages.append(f'''<section class="pg g full">
  {head('Question 03', 'What Can The Heat Hang From?', 'Look up and behind the tables: canopy, beam, wall or pendant – or freestanding where there is nothing overhead. Height comes first, set by how each zone is used.', '03')}
  <div class="hgt">{svg('heights', '760 430', 'chart')}
    <div class="hgr"><div class="mrow3">{ph('w-bromic-sep18th-3-1', 'Seated dining')}{ph('w-bromic-sep18th-14', 'At the bar')}{ph('w-crown-towers-perth-bromic-tungsten-electric', 'Under a high canopy')}</div>
    <ul class="trio t1"><li><b>Height First</b><span>Radiant warmth weakens quickly with distance: twice as far from the heater, a guest receives about a quarter of the heat.</span></li>
      <li><b>Bring Tables Off The Wall</b><span>A wall heater projects outward, so set tables a little forward of it, and warm a wide table from both sides.</span></li>
      <li><b>Fewer, Right-Sized Heaters</b><span>Well-placed heaters of the right output usually serve a terrace better than many small ones – and keep the ceiling clean.</span></li></ul></div></div>
  <p class="foot">Mounting heights by use: Bromic guidance; every model also has its own minimum (electric wall 72 in, ceiling 96 in; Eclipse and built-in gas 96 in) in its installation manual.</p>{folio()}</section>''')
    # Q4 season
    pages.append(f'''<section class="pg g side-r2">
  <div class="qt">{head('Question 04', 'How Long Is Your Season?', 'Cover and cold are the two big levers. The same 40 seats need fewer heaters under a canopy, and a few more on cold nights.', '04')}
    <ul class="levers"><li><b>Mild</b><span>Evenings usually above about 50°F</span></li><li><b>Cool</b><span>About 40–50°F</span></li><li><b>Cold</b><span>Often below about 40°F</span></li></ul>
    <p class="rule">Not sure? Plan for partly covered and cool – the safe middle. On an exposed site, screens on the windward side help hold the heat in.</p>
    <p class="src">Platinum Smart-Heat Electric 4500 W over 800 ft² (40 seats), from the Bromic sizing calculator. Coverage is approximate and varies with mounting height, wind and installation.</p>
    <figure class="qstrip">{img('l-013-107', alt='An Eclipse over a rooftop table with city lights beyond')}<figcaption>A cool evening on the roof, every seat sold</figcaption></figure></div>
  <div class="qv">{svg('matrixc', '760 600')}</div>{folio()}</section>''')
    # physics
    pages.append(f'''<section class="pg g full">
  {head('How Radiant Heat Works', 'Warmth Like Sunshine, Over The Plate', 'Outdoors, warm air rises and drifts away, so forced air cannot hold an open terrace at a set temperature. Radiant heat warms people and surfaces directly – and a directional heater aims it down at the table rather than up into the sky.')}
  <div class="phy"><div class="phl">{svg('spectrum', '1000 440', 'chart wide')}
  <div class="waves"><div><h3>Short Wave</h3><p>The hottest elements. Instant and intense, with a bright red glow that can change how food looks on the plate.</p></div>
    <div class="hl"><h3>Medium Wave</h3><p>A soft glow with little glare, warm in about 30 seconds – Bromic’s recommendation over tables. Bromic Platinum, Eclipse and Tungsten Electric are medium wave.</p></div>
    <div><h3>Long Wave</h3><p>No visible glow, about 5 minutes to warm up, gentle – and more easily dispersed by moving air.</p></div></div></div>
  <div class="phr">{ph('l-013-100', 'Medium wave over a long dining table', 'ph big')}<div class="mac">{ph('l-007-034', 'A soft glow, no glare')}{ph('w-bromic-eclipse-portable-hotel-skansen-07', 'The Eclipse element at full warmth')}</div></div></div>
  <p class="foot">All infrared travels in straight lines at the speed of light. How far warmth reaches depends on the heater’s output, reflector and mounting height, not on its wavelength. Peak wavelength by Wien’s law, λ ≈ 2,898 µm·K ÷ T: about 2,400 K → 1.2 µm; 1,200 K → 2.4 µm; 700 K → 4.1 µm (typical element temperatures, for illustration). Warm-up times: Bromic Planning Guide v1.2. Over the table: Bromic guidance.</p>{folio()}</section>''')
    # which heater
    tiles = ''.join(f'<article class="tile"><div class="ti">{img(i, alt=t)}</div><h3>{E(t)}</h3><p>{E(d)}</p><small>{E(f)}</small></article>' for i, t, d, f in TILES)
    pages.append(f'''<section class="pg g full">
  {head('Question 05 · The Heater', 'Which Heater For Which Venue', 'Start from what the space and the service need; the look follows. A finish that matches the canopy, beams or furniture lets the heater sit quietly in the design. Every Bromic heater is paired with Affinity Smart-Heat Controls.', '05')}
  <div class="tiles">{tiles}</div>{folio()}</section>''')
    # the fuels
    pages.append(f'''<section class="pg g full">
  {head('Question 05 · The Fuel', 'Electric, Natural Gas Or Propane', 'The purchase price is the smallest number in the decision. Energy, handling, controls and the fire code carry far more weight.', '05')}
  <div class="eg3"><div class="hl"><h3>Electric</h3><ul><li>Covered and semi-enclosed terraces; recessed and flush looks</li><li>No handling; no combustion at the heater</li><li>1% dimming, zones, schedules, app, BMS</li><li>Usually the simplest path under the fire code</li><li>Least likely to need changing as cities restrict gas</li></ul></div>
    <div><h3>Natural Gas</h3><ul><li>Large, open terraces with a gas line in place</li><li>No handling after install; a yearly service</li><li>On/off, zones, schedules, app, BMS</li><li>A fixed, listed outdoor install</li><li>Check local rules on new gas connections</li></ul></div>
    <div><h3>Propane</h3><ul><li>Open spaces with no structure; layouts that change</li><li>Cylinder buying, swapping and storage</li><li>Freestanding heaters; confirm controls per model</li><li>The most restricted by the fire code</li><li>Check local rules on portable propane</li></ul></div></div>
  <div class="pair">{ph('w-bromic-sep18th-28', 'Electric: Eclipse over a rooftop bar')}{ph('l-019-164', 'Gas: a Tungsten Freestanding beside a set table')}{ph('w-usa-san-diego-decoy-lakehouse-hotel-tungsten', 'Built-in gas in rows over a lakeside dining deck')}</div>{folio()}</section>''')
    # running cost
    pages.append(f'''<section class="pg g side-r2">
  <div class="qt cost">{head('Question 05 · Running Cost', 'What An Evening Of Warmth Costs')}
    <div class="hero"><div class="fig">About 63¢</div><p>an hour for a Platinum Electric 4500 W at full output, at the US average commercial rate – less when you dim it or zone it off.</p></div>
    {svg('costc', '640 280')}<p class="src">Per hour at full output: commercial electricity 14.07¢/kWh, natural gas $1.01 a therm, propane $2.46 a gallon (EIA). Your tariff will differ.</p></div>
  <div class="qv"><div class="kick">Five Years For The Same 40 Seats</div>{svg('fuel5', '780 320')}
    <p class="src">Energy for 1,000 heater hours a year (for example, 5 hours a night for 200 nights), partly covered, cool evenings: 7 electric heaters or 10 freestanding gas heaters (up to four seats each). Hardware, installation and permits come on top: the five-year cost calculator adds them for your site.</p>
    {ph('w-bromic-sep18th-14', 'Electric heaters over a bar, zoned to service', 'ph cimg')}</div>{folio()}</section>''')
    # controls
    pages.append(f'''<section class="pg g full">
  {head('Question 05 · The Controls', 'Zones And Schedules, Built In', 'Affinity Smart-Heat Controls warm each section only when it is open and only as much as the evening needs – that is what turns the running-cost numbers into real savings.', '05')}
  <div class="sys">
    <figure>{img('w-tungelec-stacked', alt='Tungsten Electric heaters')}<figcaption><b>Heaters</b>Grouped by section</figcaption></figure><span class="arr">→</span>
    <figure>{img('w-affinity-dimmer-5ch', alt='Affinity Smart-Heat 5-channel Dimmer controller')}<figcaption><b>Affinity Controller</b>One channel a zone</figcaption></figure><span class="arr">→</span>
    <figure>{img('w-manual-1ch-indoor-switch-image', alt='Manual wall switch')}<figcaption><b>Wall Switch</b>Staff override at the station</figcaption></figure><span class="arr">→</span>
    <figure>{img('w-expansion-board', alt='Affinity Expansion Board')}<figcaption><b>App Or BMS</b>Schedules, timers, venue-wide</figcaption></figure></div>
  <ul class="trio"><li><b>On Before Service, Off At Close</b><span>Schedules and timers in the Bromic Smart-Heat app, tied to service hours.</span></li>
    <li><b>Lower On Mild Nights</b><span>Dimmer in 1% steps for Tungsten and Platinum Electric; Eclipse in 33/66/100% steps. Gas switches on and off, up to 10 heaters a channel.</span></li>
    <li><b>Venue-Wide</b><span>The Expansion Board links the 5-channel controller to a BMS over Ethernet or 0–10 V (BMS mode disables the app).</span></li></ul>
  <div class="pair wide">{ph('w-eclipse-electric-w-bromic-heating-app', 'The app: a section on in a tap')}{ph('t-009-025', 'Schedules from a tablet at the host stand')}</div>
  <p class="foot">Wi-Fi and app features need compatible Affinity Smart-Heat Controls, sold separately. Each channel carries up to 6 kW at 208–277 V. Control4, Crestron and Lutron compatibility varies and may need extra hardware or set-up.</p>{folio()}</section>''')
    # layouts
    per = 1 if letter else 2
    NAMES = ['Restaurant Terraces And Street Dining', 'Rooftops And Pools', 'Gardens And Frontages', 'Arrivals And Open Terraces']
    for k in range(0, len(LAYOUTS), per):
        cards = ''
        for L in LAYOUTS[k:k + per]:
            seats = f"{L['seats']} seats" if L['seats'] else 'Standing and waiting, about 200 ft²'
            chips = ''.join(f'<li><span>{a}</span>{E(b)}</li>' for a, b in [('Seats', seats), ('Cover', L['cover']), ('Mount', L['mount']), ('Heaters', L['heater']), ('Controls', L['controls'])])
            pid, pcap = L['photo']
            cards += f'<article class="lay">{svg(L["key"], "720 500" if letter else "720 360", "plan")}<div class="lb">{ph(pid, "A Bromic installation like this layout: " + pcap)}<div><h3>{E(L["title"])}</h3><ol class="flow">{chips}</ol><p>{E(L["note"])}</p></div></div></article>'
        pages.append(f'''<section class="pg g full layp">
  {head('Venue Layouts · Seats, Cover, Mount, Heater, Controls', LAYOUTS[k]['title'] if letter else NAMES[k // 2], None)}
  <div class="lays">{cards}</div>
  <p class="foot">Plans drawn to scale; warm zones show each heater’s approximate coverage (it varies with mounting height, wind and installation). Counts from the Bromic sizing calculator for cool evenings (about 40–50°F). Wi-Fi and app features need compatible Affinity Smart-Heat Controls, sold separately.</p>{folio()}</section>''')
    # power, gas, code and permits
    pages.append(f'''<section class="pg g full">
  {head('Question 06', 'Power In Before Fit-Out Closes', 'Plan the rough-in with your contractor while the canopy or ceiling is open – heaters compete for the same space as lights, fans and ducts – and start every site with a conversation with the fire marshal.', '06')}
  {svg('timeline', '740 690', 'chart wide', 2) if letter else svg('timeline', '1460 380', 'chart wide')}
  <ul class="trio"><li><b>Electric</b><span>Hard-wired by a licensed electrician to NFPA 70, each circuit sized from the heater’s current draw. No gas line or venting – usually the smoother path under a strict fire code.</span></li>
    <li><b>Gas</b><span>Built-in gas needs a licensed gas fitter to NFPA 54 and a 110 V supply. Gas heaters generally need larger clearances to combustibles, and the space must stay ventilated.</span></li>
    <li><b>Fire Code And Permits</b><span>Portable unvented fuel-fired heaters are prohibited in assembly occupancies, restaurants included (IFC 603.4), with outdoor gas heaters under their own subsection; propane storage follows NFPA 58. The locally adopted code governs.</span></li>
    <li class="pli">{ph('w-bromic-shoot-may-11-2023-39', 'Fitting a heater into its recess kit')}</li></ul>{folio()}</section>''')
    # rollout + brief
    steps = ''.join(f'<li><b>{n}</b><div><h3>{E(t)}</h3><p>{E(d)}</p></div></li>' for n, t, d in [
        ('1', 'Standardise The Package', 'One heater family, one controller set-up, one mounting detail per site type.'),
        ('2', 'Survey Every Site The Same Way', 'Seats and sections, cover, mounts, season, fuel, power.'),
        ('3', 'Clear Permits In Parallel', 'Plan around the slowest jurisdiction.'),
        ('4', 'Pilot, Measure, Scale', 'Covers and sales on heated nights against the ROI case.'),
        ('5', 'Name An Owner Per Site', 'For schedules and seasonal changeover.')])
    brief = ''.join(tick(t) for t in ['Heated seats and sections: ______ (about 20 ft² a seat)', 'Open · partly covered · covered; enclosure plans', 'Mounts and heights per zone',
                                      'Season: ______ nights × ______ hours', 'Fuel per zone; your tariff', 'Fire marshal and permit path per site', 'Photos or plans ready'])
    pages.append(f'''<section class="pg g brief">
  <figure class="bimg">{img('l-005-024-split', alt='A marina-side bar under a canopy, half sketch and half finished photograph, heaters along the canopy')}</figure>
  <div class="qt"><div class="kick">Design It With Us, Roll It Out</div><h2>From One Terrace To Every Site</h2>
    <p class="lede">Share photos, plans or drawings, and the Bromic design service returns heater selection, placement and coverage drawings for each site, at no charge.</p>
    <ol class="roll">{steps}</ol>
    <ul class="ckl">{brief}</ul><div class="cta">Get Your ROI Assessment</div><div class="site">bromic.com</div></div>{folio()}</section>''')
    # sources
    src = ''.join(f'<li>{E(s)}</li>' for s in SOURCES)
    pages.append(f'''<section class="pg srcs"><div class="kick">Sources</div><h2>Where The Numbers Come From</h2><ol>{src}</ol>
  <p class="note">Coverage, heights, costs and returns are planning guidance from Bromic’s published product information and the Hub’s models; the installed cost is a placeholder, not a Bromic price. Code pointers are not legal advice: the locally adopted code and the authority having jurisdiction govern. Confirm each model in its installation manual, and have heaters installed by a licensed electrician or gas fitter. Photography: Bromic installations and Bromic Lookbook 2026; sketch renderings are made from those photographs.</p>{folio()}</section>''')

    css = open(os.path.join(TE, 'report.css')).read() + '\n' + open(os.path.join(HERE, 'guide.css')).read() + '\n' + open(os.path.join(HERE, 'guide-commercial.css')).read()
    if letter: css += '\n' + open(os.path.join(TE, 'report-letter.css')).read() + '\n' + open(os.path.join(HERE, 'guide-letter.css')).read() + '\n' + open(os.path.join(HERE, 'guide-commercial-letter.css')).read()
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
    js = open(os.path.join(TE, 'report.js')).read(); charts = open(os.path.join(HERE, 'guide.js')).read() + '\n' + open(os.path.join(HERE, 'guide-commercial.js')).read()
    rough = open(os.path.join(TE, 'vendor', 'rough-4.6.6.js')).read()
    doc = f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex"><title>Outdoor Heating Planning Guide · Commercial</title><style>{css}</style></head><body class="{'letter' if letter else 'land'}"><main id="deck">
{body}
</main><script>{rough}</script><script>window.LAYOUTS={json.dumps({L['key']: L for L in LAYOUTS})};</script><script>{charts}</script><script>{js}</script></body></html>'''
    name = (FILE + ('-Letter' if letter else '') + '.html') if inline else ('letter.html' if letter else 'index.html')
    os.makedirs(RD, exist_ok=True)
    open(os.path.join(RD, name), 'w').write(doc); print(os.path.join(RD, name), round(len(doc) / 1e6, 2), 'MB')

if __name__ == '__main__':
    build(inline='--inline' in sys.argv, letter='--letter' in sys.argv)
