"""Build the visual Outdoor Heating Planning Guide (Homeowner Edition) in landscape and US Letter portrait.
Run from the repo root:
  python3 reports/planning-guide/engine/build.py homeowner [--letter] [--inline]
Reuses the Trends 2027 engine's base styles, rough.js helpers and print check (reports/trends-2027/engine).
Every figure comes from content/guides/A02-planning-guide-v2-homeowner.md (sourced there) or the Hub's calculation model
(templates/calculation-model.md, tools/A03-sizing): heater counts in the layouts are the A03 model's for each space."""
import base64, json, os, re, sys, html
HERE = os.path.dirname(os.path.abspath(__file__)); PG = os.path.dirname(HERE); ROOT = os.path.abspath(os.path.join(PG, '..', '..'))
TE = os.path.join(ROOT, 'reports', 'trends-2027', 'engine')
E = html.escape
FILE = 'Bromic-Outdoor-Heating-Planning-Guide-2027-Homeowner'
FOLIO = 'Outdoor Heating Planning Guide · Homeowner Edition'

def b64(p, mime): return f'data:{mime};base64,' + base64.b64encode(open(p, 'rb').read()).decode()
def icon(name, cls='ic'):
    s = open(os.path.join(TE, 'icons', name + '.svg')).read()
    inner = re.sub(r'<!--.*?-->', '', re.search(r'<svg[^>]*>(.*)</svg>', s, re.S).group(1), flags=re.S).strip()
    return f'<svg class="{cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">{inner}</svg>'
def img(i, cls='', alt=''): return f'<img class="{cls}" src="img/{i}.webp" alt="{E(alt)}">'
def svg(key, vb, cls='chart'): return f'<svg class="{cls}" data-chart="{key}" viewBox="0 0 {vb}"></svg>'

QUESTIONS = [
    ('01', 'Where Do People Sit?', 'Measure the seats, not the deck.', 'users'),
    ('02', 'How Open Is It?', 'A roof keeps warmth in – cover is the biggest lever.', 'house'),
    ('03', 'What Can The Heat Hang From?', 'Ceiling, beam, wall – or nothing at all.', 'ruler'),
    ('04', 'How Cold Are Your Evenings?', 'Colder nights need a little more heat.', 'thermometer-sun'),
    ('05', 'Which Heater, How Many, Which Controls?', 'The family, the count and the controls, together.', 'flame'),
    ('06', 'Is The Power In Before The Ceiling Closes?', 'Wire it once, hidden, exactly where it hangs.', 'plug'),
]

# Eight real spaces. Counts are the A03 model's: area = seats x 20 ft2; heaters = area / (coverage x cover x climate), rounded up;
# freestanding also never more than 4 seats each. Climate: cool evenings (about 40-50 F) unless stated.
LAYOUTS = [
    dict(key='L1', title='Covered Patio: Dining And Lounge', seats=14, cover='Covered (solid roof)', mount='Recessed in the ceiling',
         heater='3 × Tungsten Smart-Heat Electric 4000 W', controls='Affinity Smart-Heat Dimmer, 5-channel (one channel a heater), a wall switch and the app',
         note='Two heaters along the table warm both sides; one more over the lounge. The zones meet and overlap – no cold seams.'),
    dict(key='L2', title='Pergola Over The Dining Table', seats=8, cover='Partly covered (pergola)', mount='Pendant from the beams',
         heater='2 × Eclipse Smart-Heat Electric', controls='Affinity Smart-Heat Eclipse controller (one channel each), a wall switch and the app',
         note='Two pendants along the table, so every chair sits inside a warm zone, back and front.'),
    dict(key='L3', title='Covered Porch With A Fireplace', seats=10, cover='Covered, two sides open', mount='Recessed in the ceiling',
         heater='2 × Tungsten Smart-Heat Electric 4000 W', controls='Affinity Smart-Heat Dimmer, 2-channel, a wall switch and the app',
         note='The fireplace is the focal point; the heaters keep the whole porch warm, from the sofa to the table.'),
    dict(key='L4', title='Balcony Or Rooftop Terrace', seats=4, cover='Partly covered (soffit above)', mount='On the wall',
         heater='1 × Tungsten Smart-Heat Electric 3000 W', controls='Affinity Smart-Heat Dimmer, 1-channel, a wall switch and the app',
         note='Mounted on the wall at 72 in or more, angled down over the table – the floor stays free.'),
    dict(key='L5', title='Open Courtyard Around A Fire Table', seats=8, cover='Open to the sky', mount='Freestanding – nothing overhead',
         heater='2 × Eclipse Smart-Heat Freestanding', controls='Each comes with its own Eclipse Dimmer Controller and remote',
         note='Freestanding heaters warm up to four seats each, because guests block some of the warmth. The fire table is the focal point, not the heat.'),
    dict(key='L6', title='Pool Cabana', seats=6, cover='Covered (cabana roof)', mount='On the ceiling',
         heater='1 × Platinum Smart-Heat Electric 4500 W', controls='Affinity Smart-Heat Dimmer, 1-channel, a wall switch and the app',
         note='One heater over the cabana’s seating – warmth for after the swim.'),
    dict(key='L7', title='Outdoor Kitchen Under Cover', seats=8, cover='Covered (solid roof)', mount='On the ceiling',
         heater='2 × Tungsten Smart-Heat Electric 4000 W', controls='Affinity Smart-Heat Dimmer, 2-channel, a wall switch and the app',
         note='Warm the guests, not the grill: one heater over the bar stools, one over the lounge.'),
    dict(key='L8', title='Open Terrace, Long Table, On Gas', seats=12, cover='Open to the sky', mount='On the house wall',
         heater='2 × Platinum Smart-Heat Gas 39,800 Btu', controls='Affinity Smart-Heat On/Off controller (gas switches on and off), a wall switch and the app',
         note='Built-in gas on the house wall for a large, open terrace, at 96 in or more; a licensed gas fitter runs the line.'),
]

TILES = [
    ('w-lcrecesskit', 'Flush In The Ceiling', 'Disappears into the architecture.', 'Tungsten Electric · Platinum Electric, with a recess kit'),
    ('w-tungelec-stacked', 'On A Wall Or Beam', 'Slim, architectural, angled onto the seats.', 'Tungsten Electric · Platinum Electric'),
    ('w-eclipse-electric-twinpole', 'Over The Table', 'Heat and a dimmable rim light in one.', 'Eclipse Electric'),
    ('w-eclipse-portable', 'Moves Where You Need It', 'Nothing overhead? Up to four seats each.', 'Eclipse Freestanding · Tungsten Freestanding Gas'),
    ('w-platinum-gas-500', 'Big, Open Spaces On Gas', 'Built-in gas for larger, more open areas.', 'Platinum Gas · Tungsten Gas'),
    ('l-005-025', 'By The Sea', '316 marine-grade stainless for coastal homes.', 'Platinum Electric Marine · Tungsten Coastal (coming soon)'),
]

SOURCES = [
    'Bromic Heating / Atomik Research, Outdoor Living Trends 2026 (US homeowner survey): 23% prioritize heating at planning.',
    'Bromic Heating, Lookbook 2026: Eclipse and Tungsten Freestanding Gas coverage, Tungsten Coastal (coming soon), Affinity Smart-Heat Controls, design service.',
    'Bromic Heating, The Official Outdoor Heating Planning Guide, US v1.2 (2021): the 30% open rule, the heat cloud, the radiant principle, warm-up times, code references.',
    'Bromic product pages, bromic.com, read 29 October 2026: Tungsten Electric (65/100/130/160 ft²; wall 72 in, ceiling 96 in), Platinum Electric and Marine (65/108/143 ft²), Eclipse Electric (121 ft², 96 in), Eclipse Freestanding (121 ft², Eclipse Dimmer Controller and remote included), Platinum Gas and Tungsten Gas (160 or 215 ft², 110 V supply, 96 in), Tungsten Freestanding Gas (215 ft²).',
    'Bromic product pages, bromic.com, read 29 October 2026: Affinity Smart-Heat On/Off, Dimmer and Eclipse controllers (6 kW a channel at 208–277 V; one Eclipse a channel); manual wall switch.',
    'U.S. Energy Information Administration: residential electricity 18.3¢/kWh and natural gas, July 2026 (running costs per hour at full output).',
    'NFPA 70, National Electrical Code; NFPA 54 / ANSI Z223.1, National Fuel Gas Code.',
    'Bromic sizing model (Content Hub, templates/calculation-model.md and the How many heaters? calculator): 20 ft² a seat; open 0.85, partly covered 1.0, covered 1.1; mild 1.0, cool 0.85, cold 0.7; freestanding up to four seats each. Factors are planning assumptions confirmed by the design team for each project.',
    'Infrared bands IR-A, IR-B and IR-C as defined by the CIE; peak wavelength by Wien’s displacement law.',
]

def build(ed='homeowner', inline=False, letter=False):
    RD = os.path.join(PG, ed)
    pages, p = [], [0]
    def folio(dark=False):
        p[0] += 1
        return f'<div class="folio{" dk" if dark else ""}"><span>{E(FOLIO)}</span><span class="draft">Draft for review</span><span>{p[0]:02d}</span></div>'
    def head(kick, h2, lede=None, q=None):
        badge = f'<span class="qn">{q}</span>' if q else ''
        return f'<header class="hd">{badge}<div><div class="kick">{E(kick)}</div><h2>{E(h2)}</h2>{f"<p class=lede>{E(lede)}</p>" if lede else ""}</div></header>'
    def tick(t): return f'<li><span class="cb" data-r="box"></span>{t}</li>'

    # 1 cover
    p[0] += 1
    pages.append(f'''<section class="pg cover">{img('l-010-071-split', 'bg', 'An ocean-view outdoor room, drawn as a sketch on the left and photographed finished on the right, heaters in the ceiling')}
  <div class="cv"><img class="logo" src="LOGO" alt="Bromic Heating">
    <div class="ckick">The Official Outdoor Heating Planning Guide</div>
    <h1>Plan Your<br>Outdoor <em>Heat</em></h1>
    <div class="region">Homeowner Edition</div>
    <p>Six simple questions take your patio from a summer space to an outdoor room you use all year.</p>
  </div><div class="cvnote">From the first sketch to the finished room – plan the warmth with the room.</div></section>''')
    # 2 the six questions
    qs = ''.join(f'<li><span class="qi" data-r="circle">{icon(i)}</span><b>{n}</b><div><h3>{E(t)}</h3><p>{E(d)}</p></div></li>' for n, t, d, i in QUESTIONS)
    pages.append(f'''<section class="pg g intro6">
  <div class="il"><div class="kick">Start Here</div><h2>Plan The Warmth Like You Plan The Room</h2>
    <p class="lede">The best evenings outdoors are the ones that run long. Answer six questions in order and the power, the heaters and the controls go in once, exactly where you want them.</p>
    <div class="stat"><div class="fig">23%</div><p>of homeowners prioritize outdoor heating at the planning stage. The rest often come back to it later – after the ceiling is closed.<small>Bromic Outdoor Living Trends 2026, Atomik Research</small></p></div>
    <figure class="istrip">{img('w-delmonico-08-sketch', alt='Sketch of a timber pavilion with heaters glowing under the roof')}</figure></div>
  <div class="ir"><div class="kick">Six Questions</div><ol class="six">{qs}</ol></div>{folio()}</section>''')
    # 3 Q1 seats
    pages.append(f'''<section class="pg g qp side-l">
  <figure class="qimg">{img('l-013-102-sketch', alt='Sketch of a poolside loggia with Eclipse pendants over the lounge')}</figure>
  <div class="qt">{head('Question 01', 'Where Do People Sit?', 'Warmth is for people, not floors. Measure where everyone actually gathers – around the table, the sofa or the fire – not the whole deck.', '01')}
    {svg('seats', '800 470')}
    <p class="rule"><b>Rule of thumb:</b> allow about 20 ft² a seat, chairs and breathing room included.</p></div>{folio()}</section>''')
    # 4 Q2 open
    pages.append(f'''<section class="pg g full">
  {head('Question 02', 'How Open Is It?', 'Radiant heat is made for the outdoors. A space counts as outdoor when at least 30% of its perimeter is permanently open – and a roof works in your favor.', '02')}
  {svg('open3', '1460 330', 'chart wide')}
  <div class="row2"><div>{svg('cloud', '720 250')}</div>
    <div class="tips"><h3>A Roof Keeps Warmth In</h3><p>Under a cover, warm air gathers into a gentle “heat cloud” that adds to the radiant warmth, so a covered space needs fewer heaters than an open one.</p>
    <h3>Block The Wind, Keep It Open</h3><p>A screen, wall or planting on the windward side helps your heaters work harder. Thinking of glass or screens all round? Talk to a designer first – it changes the design.</p></div></div>{folio()}</section>''')
    # 5 Q3 mount
    pages.append(f'''<section class="pg g full">
  {head('Question 03', 'What Can The Heat Hang From?', 'Look up and behind the seats. What is there decides the mount – and the mount decides the heater.', '03')}
  {svg('mounts', '1460 470', 'chart wide')}
  <ul class="trio"><li><b>Aim At Shoulders And Laps</b><span>Every Bromic heater is directional: face it at the seats, not the table top or the floor.</span></li>
    <li><b>Higher Spreads, But Gentler</b><span>Mount higher and the warmth spreads wider but feels softer; under a tall ceiling, bring heaters down on poles.</span></li>
    <li><b>Keep The Line Of Sight Clear</b><span>Infrared travels in straight lines, so an umbrella, beam or planter casts a cold shadow.</span></li></ul>{folio()}</section>''')
    # 6 Q4 cold + cover
    pages.append(f'''<section class="pg g side-r2">
  <div class="qt">{head('Question 04', 'How Cold Are Your Evenings?', 'Cover and cold are the two big levers. The same 12-seat dining area needs fewer heaters under a roof, and a few more on cold nights.', '04')}
    <ul class="levers"><li><b>Mild</b><span>Evenings usually above about 50°F</span></li><li><b>Cool</b><span>About 40–50°F</span></li><li><b>Cold</b><span>Often below about 40°F</span></li></ul>
    <p class="rule">Not sure? Plan for partly covered and cool – it is the safe middle.</p>
    <p class="src">Tungsten Smart-Heat Electric 4000 W over 240 ft² (12 seats), from the Bromic sizing calculator. Coverage is approximate and varies with mounting height, wind and installation.</p></div>
  <div class="qv">{svg('matrix', '760 600')}</div>{folio()}</section>''')
    # 7 physics
    pages.append(f'''<section class="pg g full">
  {head('How Radiant Heat Works', 'Warmth Like Sunshine', 'Step into winter sun and you feel warm at once, though the air is cool. Infrared heat works the same way: it warms you, the furniture and the floor – not the air that drifts away.')}
  {svg('spectrum', '1460 340', 'chart wide')}
  <div class="waves"><div><h3>Short Wave</h3><p>The hottest elements. Instant, intense, with a bright glow and glare.</p></div>
    <div class="hl"><h3>Medium Wave</h3><p>A soft glow with little glare, warm in about 30 seconds. Bromic Platinum, Eclipse and Tungsten Electric are medium wave.</p></div>
    <div><h3>Long Wave</h3><p>No visible glow, about 5 minutes to warm up, gentle – and more easily dispersed by moving air.</p></div></div>
  <p class="foot">All infrared travels in straight lines at the speed of light. How far warmth reaches depends on the heater’s output, reflector and mounting height, not on its wavelength. Peak wavelength by Wien’s law, λ ≈ 2,898 µm·K ÷ T: about 2,400 K → 1.2 µm; 1,200 K → 2.4 µm; 700 K → 4.1 µm; the sun, about 5,800 K → 0.5 µm (typical element temperatures, for illustration). Warm-up times: Bromic Planning Guide v1.2.</p>{folio()}</section>''')
    # 8 which heater
    tiles = ''.join(f'<article class="tile"><div class="ti">{img(i, alt=t)}</div><h3>{E(t)}</h3><p>{E(d)}</p><small>{E(f)}</small></article>' for i, t, d, f in TILES)
    pages.append(f'''<section class="pg g full">
  {head('Question 05 · The Heater', 'Which Heater For Which Space', 'Start from what the space needs; the look follows. Every Bromic heater is paired with Affinity Smart-Heat Controls.', '05')}
  <div class="tiles">{tiles}</div>{folio()}</section>''')
    # 9 how many and where
    pages.append(f'''<section class="pg g bloom">
  <figure class="bimg">{img('w-eclipse-electric-24twin-pole-residential-sce-bloom', alt='Eclipse pendants over a dining table at dusk, with a warm cone drawn where the warmth falls')}<figcaption>Where the warmth falls – an illustration, not a measured pattern</figcaption></figure>
  <div class="qt">{head('Question 05 · How Many', 'Warmth For Every Chair', None, '05')}
    <ul class="thumbs"><li><b>About one heater for every five or six seats</b><span>Wall, ceiling and pendant heaters, under cover on cool evenings</span></li>
      <li><b>Up to four seats a freestanding heater</b><span>Guests block some of the warmth</span></li>
      <li><b>Zones meet and slightly overlap</b><span>No cold seams between chairs; long tables warmed from both sides</span></li></ul>
    <div class="scale-k">Approximate coverage, drawn to the same scale</div>{svg('scale', '640 200')}
    <p class="rule">Get your number in a minute with the free <b>How Many Heaters?</b> calculator – and our design team confirms it.</p></div>{folio()}</section>''')
    # 10 electric or gas + cost
    pages.append(f'''<section class="pg g side-r2">
  <div class="qt">{head('Question 05 · The Fuel', 'Electric Or Gas', None, '05')}
    <div class="eg"><div><h3>Electric</h3><ul><li>Covered patios, pergolas, loggias</li><li>Ceilings, walls, poles</li><li>On/off or dimming, zones, schedules, app</li><li>Hard-wired by a licensed electrician</li><li>65–160 ft² a heater</li></ul></div>
      <div><h3>Gas</h3><ul><li>Larger, more open areas</li><li>Built-in: wall or ceiling. Or freestanding</li><li>On/off, wall switch, schedules</li><li>A licensed gas fitter, plus a 110 V supply for built-in</li><li>160–215 ft² a heater</li></ul></div></div></div>
  <div class="qv cost"><div class="kick">What An Evening Costs</div><div class="hero"><div class="fig">About 73¢</div><p>an hour for a Tungsten Electric 4000 W at full output – less when you dim it.</p></div>
    {svg('cost', '640 330')}<p class="src">Per hour at full output, at US average residential prices: electricity July 2026, natural gas July 2026 (EIA). Your rate will differ.</p></div>{folio()}</section>''')
    # 11 controls
    pages.append(f'''<section class="pg g full">
  {head('Question 05 · The Controls', 'Effortless Warmth At A Touch', 'Every heater comes with its controls. Soften the warmth on a mild night, or have it waiting when you step outside.', '05')}
  <div class="sys">
    <figure>{img('w-tungelec-stacked', alt='Tungsten Electric heaters')}<figcaption><b>Heater</b>Tungsten, Platinum, Eclipse or gas</figcaption></figure><span class="arr">→</span>
    <figure>{img('w-affinity-dimmer-2ch-2', alt='Affinity Smart-Heat Dimmer controller with the app on a phone')}<figcaption><b>Affinity Controller</b>On/Off, Dimmer or Eclipse</figcaption></figure><span class="arr">→</span>
    <figure>{img('w-manual-1ch-indoor-switch-image', alt='Manual wall switch')}<figcaption><b>Wall Switch</b>On and off at the door</figcaption></figure><span class="arr">→</span>
    <figure class="ph">{svg('phone', '260 300', 'mini')}<figcaption><b>Bromic Smart-Heat App</b>Zones, schedules, timers</figcaption></figure></div>
  <ul class="trio"><li><b>On/Off Controller</b><span>Switches electric or gas heaters: 1, 2 or 5 channels.</span></li>
    <li><b>Dimmer Controller</b><span>Sets the warmth in 1% steps for Tungsten and Platinum Electric.</span></li>
    <li><b>Eclipse Controller</b><span>Heat steps and rim-light dimming, one Eclipse a channel. Eclipse Freestanding comes with its own.</span></li></ul>
  <p class="foot">Wi-Fi and app features need compatible Affinity Smart-Heat Controls, sold separately. Each channel carries up to 6 kW at 208–277 V. Built-in gas switches on and off only.</p>{folio()}</section>''')
    # 12-15 layouts
    for k in range(0, len(LAYOUTS), 2):
        cards = ''
        for L in LAYOUTS[k:k + 2]:
            chips = ''.join(f'<li><span>{a}</span>{E(b)}</li>' for a, b in [('Seats', f"{L['seats']} seats"), ('Cover', L['cover']), ('Mount', L['mount']), ('Heaters', L['heater']), ('Controls', L['controls'])])
            cards += f'<article class="lay">{svg(L["key"], "720 400", "plan")}<h3>{E(L["title"])}</h3><ol class="flow">{chips}</ol><p>{E(L["note"])}</p></article>'
        pages.append(f'''<section class="pg g full layp">
  {head('Outdoor Layouts · ' + str(k // 2 + 1) + ' of ' + str(len(LAYOUTS) // 2), 'Seats, Cover, Mount, Heater, Controls', None)}
  <div class="lays">{cards}</div>
  <p class="foot">Plans drawn to scale; warm zones show each heater’s approximate coverage (it varies with mounting height, wind and installation). Counts from the Bromic sizing calculator for cool evenings (about 40–50°F). Wi-Fi and app features need compatible Affinity Smart-Heat Controls, sold separately.</p>{folio()}</section>''')
    # 16 power
    pages.append(f'''<section class="pg g full">
  {head('Question 06', 'Power In Before The Ceiling Closes', 'Plan the power while the ceiling is open and the wiring goes in once – hidden, and exactly where the heaters hang.', '06')}
  {svg('timeline', '1460 380', 'chart wide')}
  <ul class="trio"><li><b>Electric</b><span>Hard-wired by a licensed electrician, who sizes each circuit from the heater’s current draw (in the Pro edition and the cut sheets).</span></li>
    <li><b>Gas</b><span>Built-in gas needs a gas line from a licensed gas fitter and a 110 V supply. The freestanding gas heater runs on a 20 lb propane cylinder or a natural-gas quick-connect.</span></li>
    <li><b>Built To Code</b><span>Electric to NFPA 70, gas to NFPA 54. Confirm with your local building authority; each manual sets its clearances.</span></li></ul>{folio()}</section>''')
    # 17 brief + CTA
    brief = ''.join(tick(t) for t in ['Seats to warm: ______ (about 20 ft² a seat)', 'Open · partly covered · covered', 'Mount: ceiling · recessed · wall · pendant · freestanding',
                                      'Evenings: mild · cool · cold', 'Heater, how many, which controls: ______', 'Electrician or gas fitter booked before the ceiling closes', 'Photos or plans ready'])
    pages.append(f'''<section class="pg g brief">
  <figure class="bimg">{img('l-010-067-split', alt='A covered outdoor kitchen and bar, half sketch and half finished photograph, heaters flush in the ceiling')}</figure>
  <div class="qt"><div class="kick">Your Brief</div><h2>Let Us Design It With You</h2>
    <p class="lede">You know how you love to live outdoors; we know how to heat it. Bring your answers, photos or plans – our design specialists recommend the heaters, placement and controls, with coverage drawings, at no charge.</p>
    <ul class="ckl">{brief}</ul><div class="cta">Book A Design Consult</div><div class="site">bromic.com</div></div>{folio()}</section>''')
    # 18 sources
    src = ''.join(f'<li>{E(s)}</li>' for s in SOURCES)
    pages.append(f'''<section class="pg srcs"><div class="kick">Sources</div><h2>Where The Numbers Come From</h2><ol>{src}</ol>
  <p class="note">Coverage, heights and controls are approximate planning guidance from Bromic’s published product information; confirm each model in its installation manual and with your local building authority, and have heaters installed by a licensed electrician or gas fitter. Photography: Bromic installations and Bromic Lookbook 2026; sketch renderings and the warm-zone illustration are made from those photographs.</p>{folio()}</section>''')

    css = open(os.path.join(TE, 'report.css')).read() + '\n' + open(os.path.join(HERE, 'guide.css')).read()
    if letter: css += '\n' + open(os.path.join(TE, 'report-letter.css')).read() + '\n' + open(os.path.join(HERE, 'guide-letter.css')).read()
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
    js = open(os.path.join(TE, 'report.js')).read(); charts = open(os.path.join(HERE, 'guide.js')).read()
    rough = open(os.path.join(TE, 'vendor', 'rough-4.6.6.js')).read()
    doc = f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex"><title>Outdoor Heating Planning Guide</title><style>{css}</style></head><body class="{'letter' if letter else 'land'}"><main id="deck">
{body}
</main><script>{rough}</script><script>window.LAYOUTS={json.dumps({L['key']: L for L in LAYOUTS})};</script><script>{charts}</script><script>{js}</script></body></html>'''
    name = (FILE + ('-Letter' if letter else '') + '.html') if inline else ('letter.html' if letter else 'index.html')
    open(os.path.join(RD, name), 'w').write(doc); print(os.path.join(RD, name), round(len(doc) / 1e6, 2), 'MB')

if __name__ == '__main__':
    a = [x for x in sys.argv[1:] if not x.startswith('--')]
    build(a[0] if a else 'homeowner', inline='--inline' in sys.argv, letter='--letter' in sys.argv)
