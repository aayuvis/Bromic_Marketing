"""Build the visual Outdoor Living Trends 2027 · North America report.
Run from the repo root:  python3 reports/trends-2027/na/build/build.py
Writes reports/trends-2027/na/index.html (uses img/) and, with --inline, a single self-contained file
reports/trends-2027/na/Outdoor-Living-Trends-2027-North-America.html (fonts, images and scripts embedded).
Every figure comes from reports/trends-2027/north-america-storyline.md (sourced there)."""
import base64, json, os, re, sys, html
HERE = os.path.dirname(os.path.abspath(__file__))
NA = os.path.dirname(HERE)
ROOT = os.path.abspath(os.path.join(NA, '..', '..', '..'))
E = html.escape

def b64(path, mime):
    return f'data:{mime};base64,' + base64.b64encode(open(path, 'rb').read()).decode()

def icon(name, cls='ic'):
    s = open(os.path.join(HERE, 'icons', name + '.svg')).read()
    inner = re.search(r'<svg[^>]*>(.*)</svg>', s, re.S).group(1)
    inner = re.sub(r'<!--.*?-->', '', inner, flags=re.S).strip()
    return (f'<svg class="{cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" '
            f'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">{inner}</svg>')

AUD_ICON = {'Architects': 'pencil-ruler', 'Builders': 'hard-hat', 'Homeowners': 'house', 'Designers': 'paintbrush',
            'Operators': 'utensils-crossed', 'Hospitality': 'wine', 'Integrators': 'sliders-horizontal', 'Hotels': 'hotel',
            'Pergola makers': 'layers', 'Cities': 'landmark', 'Builders & electricians': 'plug', 'Hospitality designers': 'paintbrush'}

SHIFTS = [
 dict(n='01', title='The Outdoor Room Enters The Floor Plan', words=[('Plan', 'pencil-ruler'), ('Build', 'hard-hat'), ('Live', 'sofa')],
  read='The outdoor room is now drawn in at the start. Architects rank outdoor living first among special-function rooms, blended indoor-outdoor space keeps climbing, and more than half of renovators are already working outside.',
  signals=[('#1', 'Outdoor living is the most-requested special-function room – 20% of architects name it first'),
           ('Net 43%', 'Blended indoor-outdoor space, up from net 40%'),
           ('71%', 'Outdoor renovators who now hire a professional, up from 65% in 2024')],
  hero=('Net 51%', 'of residential architects report rising demand for outdoor living rooms', 'AIA Home Design Trends Survey, Q2 2026 data'),
  photo='w-bromic-tungsten-electric-residential', side='L', cap='A covered pool terrace with Tungsten Electric heaters drawn into the ceiling',
  right=('diagram', 'floorplan', 'On the plan from day one: heat zones drawn over the outdoor room'),
  chart='s1', lead='A room on the plan needs the services of a room – power, light and heat, specified with the structure.',
  impl=[('Architects', 'Draw heat on the reflected ceiling plan, with the lighting.'), ('Builders', 'Run the heater circuit at frame stage.'), ('Homeowners', 'Ask for heat in the first quote, alongside lighting.')],
  insight='Heat designed in from day one disappears into the architecture and turns an outdoor room into a room you use every evening.'),
 dict(n='02', title='Comfort Is The New Amenity', words=[('Gather', 'users'), ('Linger', 'clock'), ('Host', 'wine')],
  read='The lounge has become the heart of the outdoor room, and warmth is what keeps people in it. Fire and heat already sit in almost half of new lounges and dining areas, and Americans plan to host more at home.',
  signals=[('83%', 'of redesigned outdoor spaces include a lounge'),
           ('48% · 49%', 'of those lounges and dining areas include a fire feature'),
           ('47%', 'of Gen Z expect to host more at home in 2026 – 28% of all Americans')],
  hero=('38%', 'of homeowners plan to add fire pits or outdoor heating this year', 'Talker Research for Trex, 2025, n=2,000 (brand-commissioned)'),
  photo='w-bromic-ambiente-sedona-11', side='R', cap='A rooftop lounge in Sedona, a Tungsten Electric heater on the wall above the fire table',
  right=('sketch', 'l-012-093', 'Warmth where people sit – pendant heat over the lounge, not the view'),
  chart='s2', lead='Comfort is now part of the brief, measured in how long guests stay.',
  impl=[('Homeowners', 'Plan heat for where people sit, not where the fire pit looks best.'), ('Designers', 'Zone warmth over the lounge and the dining table.'), ('Builders', 'Offer a heated lounge as a named upgrade.')],
  insight='Radiant heat warms people directly, so the conversation keeps going after the sun has gone.'),
 dict(n='03', title="Heated Space Returns To The Architect's Brief", words=[('Specify', 'pencil-ruler'), ('Enclose', 'house'), ('Extend', 'calendar-days')],
  read='Architects are asking for spaces that work beyond summer. Three-season porches recorded the biggest jump of any room, and heated exterior space is rising again.',
  signals=[('Net 25%', 'Sunrooms and three-season porches, up from net 6% – the largest gain of any room'),
           ('Net 16%', 'Heated exterior space, up from net 12%'),
           ('Net 16%', 'Infrared patio heaters hold steady among architects')],
  hero=('Net 25%', 'three-season rooms are the fastest-rising room type, up from net 6%', 'AIA Home Design Trends Survey, Q2 2026 data'),
  photo='w-connecticut-privateresidence-tungstenelectri-2', side='L', cap='A Connecticut porch with Tungsten Electric heaters recessed flush in the beadboard ceiling',
  right=('sketch', 'w-dsc05737-courtney-saib', 'The three-season porch, made four-season with heat'),
  chart='s3', lead='"Three-season" becomes "four-season" with heat.',
  impl=[('Architects', 'Specify heating as part of the porch package.'), ('Builders', 'Price the heated porch as one line item.'), ('Homeowners', 'A heated covered porch adds months of use for a fraction of the cost of an addition.')],
  insight='Infrared heat is the simplest way to turn a three-season room into a four-season one.'),
 dict(n='04', title='Cover First, Then Comfort', words=[('Shelter', 'house'), ('Mount', 'ruler'), ('Integrate', 'layers')],
  read='Shade structures are the fastest-growing outdoor project, and every new roof is a mounting surface. Outdoor kitchens are going under cover and getting real infrastructure.',
  signals=[('+15 pts', 'Shade structures rose to 35% of structure upgrades'),
           ('74%', 'of outdoor kitchens are fully or partly covered'),
           ('68%', 'of outdoor kitchen projects add plumbing, electrical or heating infrastructure – up 10 points')],
  hero=('+15 pts', 'shade structures are the breakout outdoor project of 2026', 'Houzz Outdoor Trends Study 2026, n=1,191'),
  photo='w-240619-yorba-linda-ca-dc-64', side='R', cap='A Yorba Linda pergola over an outdoor kitchen, electric heaters under the louvres',
  right=('diagram', 'pergola', 'One decision: the roof, the light, the heat and the controls'),
  chart='s4', lead='The roof, the power and the heat are one decision.',
  impl=[('Pergola makers', 'Design in mounting points and power runs.'), ('Architects', 'Recess or ceiling-mount heat to keep the roofline clean.'), ('Builders', 'Rough-in heater circuits with the lighting circuits.')],
  insight='Every pergola, louvred roof and covered patio is a mounting surface waiting for heat.'),
 dict(n='05', title='The Longer Shoulder Season', words=[('Spring', 'sun'), ('Fall', 'leaf'), ('Evening', 'sunset')],
  read='The outdoor season is getting longer. Falls are warmer across almost every US city, and more evenings are now mild enough to be outdoors – as long as the chill that comes after sunset is handled.',
  signals=[('+2.9°F', 'Average fall warming across 245 US cities since 1970'),
           ('88%', 'of cities gained at least a week of above-normal fall days'),
           ('11.7 hrs', 'a week Americans spent outdoors at home in 2025, up from 9.6 (Trex, brand-commissioned)')],
  hero=('241 of 245', 'US cities have warmer falls than in 1970', 'Climate Central, August 2026'),
  photo='l-007-039', side='L', cap='Wall heaters on a stone terrace above the vines at sunset',
  right=('diagram', 'season', 'Summer widens into spring and fall – the hours after sunset are the prize'),
  chart='s5', lead='The opportunity sits in the evenings either side of summer.',
  impl=[('Homeowners', 'Heat turns September to November evenings into usable ones.'), ('Hospitality', 'Open the patio earlier in spring and keep it open later in fall.'), ('Builders', 'Market outdoor rooms as all-season rooms.')],
  insight='Warmer seasons bring more evenings outside; heat makes the hours after sunset count.'),
 dict(n='06', title='Year-Round Patios Become Policy', words=[('Permit', 'landmark'), ('Winterize', 'thermometer-sun'), ('Stay Open', 'calendar-days')],
  read='Cities are making outdoor dining permanent. New York now allows year-round roadway cafés and winter coverings, Toronto runs about 1,500 outdoor dining spaces, and Canadians are booking outdoors more than ever.',
  signals=[('Int. 655', 'New York signed year-round outdoor dining into law, August 2026'),
           ('475', 'New York permit filings in July 2026, the monthly peak; about 1,800 setups eligible'),
           ('+24%', 'Canadian outdoor dining reservations; outdoor diners stay 20% longer (127 min)')],
  hero=('12 months', "New York's outdoor dining season, by law, from 2026", 'NYC Int. 655 (August 2026)'),
  photo='w-dsc000071', side='R', cap='A covered sidewalk dining enclosure with linear heaters along the ceiling',
  right=('sketch', 'w-bromic-sep18th-9-1', 'The covered, heated arcade – a dining room in every season'),
  chart='s6', lead='A year-round permit needs year-round comfort.',
  impl=[('Operators', 'Plan heat into the winterized structure from day one.'), ('Designers', 'Work within fire-code rules for enclosures and heaters.'), ('Cities', 'Expect heated, covered patios to become the norm.')],
  insight='Fixed, code-compliant electric heat makes a year-round patio possible, with no tanks to refill.'),
 dict(n='07', title='The Patio Protects The Margin', words=[('Seats', 'sofa'), ('Stay', 'clock'), ('Spend', 'receipt-text')],
  read='With costs high and traffic soft, operators are counting on the patio. Outdoor seats extend capacity, guests linger longer, and diners actively choose restaurants with outdoor seating.',
  signals=[('42%', 'of US operators were not profitable in 2025 (National Restaurant Association)'),
           ('62%', 'of Canadians choose a restaurant for its outdoor seating (OpenTable, n=1,502)'),
           ('58%', 'of the outdoor heating market is catering and hospitality (Fortune Business Insights, 2026)')],
  hero=('20% longer', 'outdoor diners stay at the table – 127 minutes', 'OpenTable Canada, May 2026'),
  photo='w-commercial-australia-sydney-manly-wharf-15', side='L', cap='A busy waterfront café terrace, heaters on the slatted ceiling above the tables',
  right=('sketch', 'w-bromic-ambiente-sedona-10', 'Heat zoned by table and lounge – every seat earning after dark'),
  chart='s7', lead='Every heated outdoor seat adds capacity without adding floor space.',
  impl=[('Operators', 'Treat heating as revenue infrastructure with a measurable payback.'), ('Hospitality designers', 'Zone heat by table and bar.'), ('Hotels', 'Rooftops and terraces are where guests trade up their drinks (NIQ, 2026).')],
  insight='A heated seat earns on more nights each year than an unheated one.'),
 dict(n='08', title='Electric Comes Of Age', words=[('Electrify', 'zap'), ('Pre-Wire', 'plug'), ('Comply', 'shield-check')],
  read="Homes and cities are moving to electric. Heat pumps out-shipped gas furnaces again in 2025, New York's all-electric buildings law was upheld, and electric is the fastest-growing type of outdoor heater.",
  signals=[('Fastest', 'Electric is the fastest-growing outdoor heating fuel type (Fortune Business Insights, 2026)'),
           ('Upheld', "New York's All-Electric Buildings Act (2nd Circuit, June 2026); Montreal bars networked gas appliances in new buildings"),
           ('54%', 'Gas and propane still hold the largest share of outdoor heating – electric is growing fastest')],
  hero=('3.64M', 'heat pumps shipped in the US in 2025, ahead of 3.25M gas furnaces', 'AHRI, 2025 shipments'),
  photo='ts2-photo-01', side='R', cap='Tungsten Smart-Heat Electric Series II on a café wall',
  right=('sketch', 'w-bromic-tungsten-electric-patio-heater', 'Instant heat at the switch – no tanks, no flame'),
  chart='s8', lead='Plan capacity now and the choice of fuel stays open.',
  impl=[('Builders & electricians', 'Size panels and run outdoor circuits at rough-in, to NEC 2026.'), ('Architects', 'Specify electric where gas is restricted.'), ('Homeowners', 'No tanks, no flame, instant heat at the switch.')],
  insight='Electric infrared fits the all-electric home, and we offer gas where it still suits.'),
 dict(n='09', title='Small Lots, Big Living', words=[('Compact', 'maximize'), ('Zone', 'grid-2x2'), ('Elevate', 'building-2')],
  read='Lots are small and patios are getting tighter, but buyers want outdoor living anyway – designed with purpose. Multigenerational living adds more people to the same outdoor space.',
  signals=[('8,543 sq ft', 'Median new-home lot; 64% of lots are under 9,000 sq ft (NAHB, 2025)'),
           ('60.5%', 'of new homes have a patio – a six-year low'),
           ('Net 53%', 'of architects report rising demand for multigenerational accommodation')],
  hero=('60.5%', 'of new homes have a patio, the lowest in six years – every square foot must work harder', 'NAHB / US Census, 2026'),
  photo='w-dsc07397-1', side='L', cap='A compact deck lounge, heaters mounted under the eaves',
  right=('diagram', 'lot', 'Heat on the wall and ceiling keeps the small patio floor free'),
  chart='s9', lead='Compact spaces need heat that takes no floor space.',
  impl=[('Builders', 'Make the small patio the selling feature – covered, lit, heated.'), ('Designers', 'Use wall, ceiling and recessed heat to keep the floor free.'), ('Homeowners', 'One well-placed heater can make a small terrace a nightly room.')],
  insight='Wall, ceiling and recessed heat warms the people, not the footprint.'),
 dict(n='10', title='Smart, Quiet, Integrated', words=[('Control', 'sliders-horizontal'), ('Scene', 'smartphone'), ('Simplify', 'check')],
  read='Half of US internet households now own a smart-home device, and architects keep asking for technology-friendly homes. Outdoors, smart wins where it gives real control.',
  signals=[('49%', 'of US internet households own at least one smart-home device (Parks Associates, 2026)'),
           ('Net 51%', 'Technology-friendly systems among architects; energy management net 34%'),
           ('25% vs 3%', 'Smart security cameras outsell standard ones among renovators – outdoors, people pay for control')],
  hero=('49%', 'of US internet households already live in a smart home', 'Parks Associates, 2026'),
  photo='l-021-180', side='R', cap='A coastal covered terrace at golden hour, heaters overhead on Affinity Smart-Heat controls',
  right=('diagram', 'phone', 'One outdoor scene: lights, music and heat zones'),
  chart='s10', lead='Heat joins lighting and audio in one scene.',
  impl=[('Integrators', 'Add heating zones to the outdoor scene.'), ('Homeowners', 'Dimmable, zoned heat on a schedule or from an app.'), ('Hospitality', 'Set zones by table and by time.')],
  insight='Affinity Smart-Heat controls dim, zone and schedule heat with the rest of the home. App and Wi-Fi features need compatible Affinity controls, sold separately.'),
]

SOURCES = [
 'American Institute of Architects, Home Design Trends Survey (Q2 2026 data). Figures are net indexes: the share reporting an increase minus the share reporting a decrease.',
 'Houzz & Home Study 2026 (n=10,176) and Houzz Outdoor Trends Study 2026 (n=1,191, fieldwork 25 April–6 May 2026).',
 'Climate Central, fall warming analysis of 245 US cities, August 2026.',
 'Talker Research for Trex, 2025 (n=2,000), commissioned by a brand.',
 'New York City Council Int. 655 (August 2026); NYC DOT Dining Out NYC permit data; City of Toronto CaféTO.',
 'OpenTable Canada, Top 100 Outdoor Dining 2026 and Ripple Research survey (n=1,502), May 2026.',
 'National Restaurant Association, State of the Restaurant Industry 2026; NIQ, 2026.',
 'Fortune Business Insights, Outdoor Heating Market Size and Forecast 2026–2034 (paid estimate).',
 'Air-Conditioning, Heating, and Refrigeration Institute (AHRI), 2025 shipments; US Court of Appeals, 2nd Circuit (June 2026); City of Montréal; NFPA 70, National Electrical Code 2026.',
 'National Association of Home Builders, lot size and new-home characteristics (US Census Survey of Construction), 2025–2026.',
 'Parks Associates, 2026.',
 'Bromic Outdoor Living Trends 2026 (Atomik Research).',
]

ICON_NAMES = sorted({w[1] for s in SHIFTS for w in s['words']} | set(AUD_ICON.values()) |
                    {'flame', 'check', 'trending-up', 'zap', 'calendar-days', 'sun', 'wifi', 'plug'})

def folio(p, dark=False):
    return (f'<div class="folio{" dk" if dark else ""}"><span>Outdoor Living Trends 2027 · North America</span>'
            f'<span class="draft">Draft for review</span><span>{p:02d}</span></div>')

def img(src_id, cls='', alt=''):
    return f'<img class="{cls}" src="img/{src_id}.webp" alt="{E(alt)}">'

def page_a(s, p):
    words = ''.join(f'<li><span class="wico" data-r="circle">{icon(i)}</span>{E(w)}</li>' for w, i in s['words'])
    sig = ''.join(f'<li><b>{E(f)}</b><span>{E(t)}</span></li>' for f, t in s['signals'])
    return f'''<section class="pg pa side{s['side']}" id="s{s['n']}">
  <figure class="ph">{img(s['photo'], alt=s['cap'])}<div class="bign">{s['n']}</div><figcaption>{E(s['cap'])}</figcaption></figure>
  <div class="tx">
    <div class="kick">Shift {s['n']} of 10</div>
    <h2>{E(s['title'])}</h2>
    <ul class="words">{words}</ul>
    <p class="read">{E(s['read'])}</p>
    <ul class="sig">{sig}</ul>
  </div>{folio(p)}</section>'''

def page_b(s, p):
    kind, ref, cap = s['right']
    if kind == 'sketch':
        vis = f'<figure class="sk">{img(ref + "-sketch", alt=cap)}<figcaption>{E(cap)}</figcaption></figure>'
    else:
        vis = f'<figure class="sk dg"><svg class="diag" data-diag="{ref}" viewBox="0 0 680 540"></svg><figcaption>{E(cap)}</figcaption></figure>'
    impl = ''.join(f'<div class="aud"><span class="aico" data-r="circle">{icon(AUD_ICON[a])}</span><h4>{E(a)}</h4><p>{E(t)}</p></div>' for a, t in s['impl'])
    f, c, src = s['hero']
    return f'''<section class="pg pb" id="s{s['n']}b">
  <div class="stat">
    <div class="kick">Shift {s['n']} · {E(s['title'])}</div>
    <div class="hero"><div class="fig">{E(f)}</div><div class="cap">{E(c)}<small>{E(src)}</small></div></div>
    <svg class="chart" data-chart="{s['chart']}" viewBox="0 0 860 330"></svg>
  </div>
  {vis}
  <div class="impl">
    <div class="ilead"><div class="kick">The Implication</div><p>{E(s['lead'])}</p></div>
    {impl}
  </div>
  <div class="insight">{icon('flame', 'fl')}<div><div class="kick">Bromic Insight</div><p>{E(s['insight'])}</p></div></div>
  {folio(p)}</section>'''

def build(inline=False, letter=False):
    pages = []
    p = 1
    pages.append(f'''<section class="pg cover">{img('l-004-012-split', 'bg', 'A coastal terrace, drawn as a sketch on the left and photographed finished on the right, with Tungsten heaters under the pergola')}
  <div class="cv"><img class="logo" src="LOGO" alt="Bromic Heating">
    <div class="ckick">Bromic Outdoor Living Report</div>
    <h1>Outdoor Living<br>Trends <em>2027</em></h1>
    <div class="region">North America</div>
    <p>10 shifts putting heat at the heart of the outdoor room. For architects, builders, homeowners and hospitality.</p>
  </div><div class="cvnote">From the first sketch to the finished room – plan heat from the start.</div></section>''')
    p += 1
    toc = ''.join(f'<a class="tile" href="#s{s["n"]}"><span class="tn">{s["n"]}</span><span class="tt">{E(s["title"])}</span>'
                  f'<span class="tw">{" · ".join(w for w, _ in s["words"])}</span></a>' for s in SHIFTS)
    pages.append(f'''<section class="pg intro">
  <div class="il"><div class="kick">Outdoor Living Trends 2027</div>
    <h2>Every Outdoor Room Starts As A Sketch</h2>
    <p class="lede">The ones people use all year have heat drawn in from the first line.</p>
    <p>Outdoor living is moving from the yard into the floor plan, and from summer into every season. Architects rank the outdoor room first, falls are warmer, cities are keeping patios open through winter and homes are going electric.</p>
    <p>The next step is comfort. An outdoor room is only as useful as the hours it stays warm – and that is where heat becomes essential.</p>
    <figure class="istrip">{img('w-delmonico-08-sketch', alt='Sketch of a timber pavilion with heaters glowing under the roof')}</figure>
  </div>
  <div class="ir"><div class="kick">The 10 Shifts</div><div class="toc">{toc}</div></div>{folio(p)}</section>''')
    p += 1
    pages.append(f'''<section class="pg nums">
  <div class="kick">The Shift In Numbers</div><h2>Outdoor Living, By The Numbers</h2>
  <div class="ncols">
    <div class="nc"><svg class="mini" data-mini="aia" viewBox="0 0 300 190"></svg><div class="nf">Net 51%</div><p>of residential architects report rising demand for outdoor living rooms – the most popular special-function room, up from net 40%</p><small>AIA Home Design Trends Survey, Q2 2026 data</small></div>
    <div class="nc"><svg class="mini" data-mini="houzz" viewBox="0 0 300 190"></svg><div class="nf">54%</div><p>of US renovating homeowners took on outdoor projects in 2025</p><small>Houzz &amp; Home 2026, n=10,176</small></div>
    <div class="nc"><svg class="mini" data-mini="falls" viewBox="0 0 300 190"></svg><div class="nf">241 of 245</div><p>US cities have warmer falls than in 1970 – more evenings worth claiming</p><small>Climate Central, August 2026</small></div>
    <div class="nc"><svg class="mini" data-mini="year" viewBox="0 0 300 190"></svg><div class="nf">Year-Round</div><p>New York made all-season outdoor dining law in 2026; Canadian outdoor dining reservations rose 24%</p><small>NYC Int. 655, August 2026 · OpenTable Canada, May 2026</small></div>
  </div>
  <figure class="nstrip">{img('l-002-004', alt='A wide timber-roofed terrace opening onto the sea at sunset')}</figure>
  {folio(p, True)}</section>''')
    p += 1
    for s in SHIFTS:
        pages.append(page_a(s, p)); p += 1
        pages.append(page_b(s, p)); p += 1
    checks = ''.join(f'<li><span class="cb" data-r="box"></span>{E(t)}</li>' for t in [
        'Circuits and capacity sized at rough-in (NEC 2026)', 'Heat recessed or mounted cleanly into roofs, pergolas and walls',
        'One control scene for light, sound and heat', 'More months, more evenings, more covers'])
    pages.append(f'''<section class="pg close">
  <figure class="cph">{img('l-006-028-split', alt='A pergola lounge, half sketch and half finished photograph, with Tungsten heaters overhead')}</figure>
  <div class="ct"><div class="kick">The Conclusion</div><h2>From Optional To Essential: Plan Heat From The Start</h2>
    <p class="read">Outdoor heating is following the path of the built-in kitchen and the built-in grill. The outdoor room is on the plan, the season is longer, cities are keeping patios open and homes are going electric. Every shift leads to the same place: heat belongs in the first drawing.</p>
    <div class="cgrid">
      <div><svg class="chart" data-chart="market" viewBox="0 0 520 280"></svg><small>Global outdoor heating market, US$ billion. 2025–2026 estimates, then the 6.6% a year forecast path to 2034. Fortune Business Insights, 2026.</small></div>
      <div class="gap"><svg class="mini" data-mini="gap" viewBox="0 0 220 220"></svg><p><b>Fewer than 1 in 4</b> homeowners prioritised heating at planning in 2026. That gap is the opportunity.</p><small>Bromic Outdoor Living Trends 2026, Atomik Research</small></div>
    </div>
    <div class="ckl"><div class="kick">What Early Planning Enables</div><ul>{checks}</ul></div>
  </div>{folio(p)}</section>''')
    p += 1
    pages.append(f'''<section class="pg poster">{img('l-001-000' if letter else 'l-003-009', 'bg', 'A covered coastal terrace at dusk with heaters under the pergola' if letter else 'A Tungsten heater over a harbour at dusk')}
  <div class="pt"><div class="kick">Plan It In</div>
    <ul class="plan"><li><b>Architects</b><span>Draw it.</span></li><li><b>Builders</b><span>Wire it.</span></li><li><b>Homeowners</b><span>Ask for it.</span></li><li><b>Operators</b><span>Earn from it.</span></li></ul>
    <div class="cta">Book A Design Consultation With Bromic</div><div class="site">bromic.com</div>
    <img class="logo" src="LOGOW" alt="Bromic Heating"></div></section>''')
    p += 1
    src = ''.join(f'<li>{E(s)}</li>' for s in SOURCES)
    pages.append(f'''<section class="pg srcs"><div class="kick">Sources</div><h2>Where The Numbers Come From</h2><ol>{src}</ol>
  <p class="note">Market figures are research estimates, not audited sales. Brand-commissioned surveys are labelled. Photography: Bromic installations and Bromic Lookbook 2026; one image is a Bromic photograph with a Tungsten Series II heater rendered from CAD. Sketch renderings are made from those photographs. Wi-Fi and app features need compatible Affinity controls, sold separately. Check local codes; installation by a licensed electrician.</p>
  {folio(p)}</section>''')

    css = open(os.path.join(HERE, 'report.css')).read()
    if letter: css += '\n' + open(os.path.join(HERE, 'report-letter.css')).read()
    js = open(os.path.join(HERE, 'report.js')).read()
    rough = open(os.path.join(HERE, 'vendor', 'rough-4.6.6.js')).read()
    fonts = os.path.join(ROOT, 'app', 'src', 'fonts')
    if inline:
        css = css.replace('FONT_DIDOT', b64(os.path.join(fonts, 'gfs-didot-latin.woff2'), 'font/woff2')).replace('FONT_ARIMO', b64(os.path.join(fonts, 'arimo-latin.woff2'), 'font/woff2'))
    else:
        css = css.replace('FONT_DIDOT', '../../../app/src/fonts/gfs-didot-latin.woff2').replace('FONT_ARIMO', '../../../app/src/fonts/arimo-latin.woff2')
    body = '\n'.join(pages)
    logo = os.path.join(ROOT, 'images', 'portfolio', 'bromic-logo.png'); logow = os.path.join(ROOT, 'images', 'portfolio', 'bromic-logo-white.png')
    if inline:
        body = body.replace('src="LOGO"', f'src="{b64(logo, "image/png")}"').replace('src="LOGOW"', f'src="{b64(logow, "image/png")}"')
        body = re.sub(r'src="img/([^"]+)"', lambda m: f'src="{b64(os.path.join(NA, "img", m.group(1)), "image/webp")}"', body)
    else:
        body = body.replace('src="LOGO"', 'src="../../../images/portfolio/bromic-logo.png"').replace('src="LOGOW"', 'src="../../../images/portfolio/bromic-logo-white.png"')
    icons = {n: icon(n) for n in ICON_NAMES}
    doc = f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex"><title>Outdoor Living Trends 2027</title>
<style>{css}</style></head><body><main id="deck">
{body}
</main><script>{rough}</script><script>window.ICONS={json.dumps(icons)};</script><script>{js}</script></body></html>'''
    name = ('Outdoor-Living-Trends-2027-North-America' + ('-Letter' if letter else '') + '.html') if inline else ('letter.html' if letter else 'index.html')
    out = os.path.join(NA, name)
    open(out, 'w').write(doc)
    print(out, round(len(doc) / 1e6, 2), 'MB')

if __name__ == '__main__':
    build(inline='--inline' in sys.argv, letter='--letter' in sys.argv)
