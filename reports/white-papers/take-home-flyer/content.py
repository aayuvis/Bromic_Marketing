# Take-Home Flyer v3 (owner, 28 Nov 2026: "the first page is waste... don't need a full brand page with no info").
# Front: the evening image in the top half, then why Bromic with proof, and the four heaters. Back: choose, plan, stamp.
TITLE = 'Extend The Moment · Bromic Heating'
FILE = 'Bromic-Take-Home-Flyer'
FOLIO = ''
SOURCES, FRAMES, HEIGHTS, NOTE = [], [], [], ''
def img(i, alt=''): return f'<img src="img/{i}.jpg" alt="{alt}">'

R = [('Warm you, not the air', 'Radiant heat you feel in seconds, even with a breeze.', 'Up to 160 ft² from one heater'),
     ('Made for your space', 'Ceiling, wall, pergola, recessed or freestanding.', 'Electric or gas, in black, white or graphite'),
     ('Run it from your phone', 'Zones, schedules and dimming in the Bromic app.', 'Works with Alexa and Google')]
H = [('l-006-028', 'Tungsten'), ('w-p1021414-hdr-denoiseai-low-light', 'Platinum'),
     ('w-eclipse-electric-24twin-pole-residential-sce', 'Eclipse'), ('pf-eclipse-freestanding', 'Freestanding')]

front = '''<div class="f3">
<div class="f3h">''' + img('w-gno-2', 'Friends at a table under Bromic heaters at dusk') + '''<div class="f3o"></div>
<img class="flogo" src="LOGOW" alt="Bromic Heating">
<div class="f3t"><h1>Extend The Moment</h1><p>One more course. One more story. One more hour outside, in any season.</p></div></div>
<div class="f3b"><div class="f3k">Why Bromic</div>
<div class="f3r">''' + ''.join(f'<div><b>{t}</b><span>{d}</span><em>{p}</em></div>' for t, d, p in R) + '''</div>
<div class="f3q"><p>"The Platinum Electric heaters are so clean and modern looking that people don\'t even recognize them as heaters."</p><small>Project manager, pergola builder</small></div></div></div></div>'''

T = [('l-006-028', 'Tungsten', 'Slim, powerful warmth for patios and pergolas.', 'Classic and Select give the same warmth at two price points.'),
     ('w-p1021414-hdr-denoiseai-low-light', 'Platinum', 'Flush, quiet heat that disappears into the ceiling.', 'Glass-ceramic, just 2.1 in deep.'),
     ('w-eclipse-electric-24twin-pole-residential-sce', 'Eclipse', 'Heat and a warm glow of light over the table.', 'Heat and light, each dimmed on its own.'),
     ('pf-eclipse-freestanding', 'Freestanding', 'Warmth wherever the furniture goes.', 'Plug-in Eclipse, or the Tungsten gas tower.')]
STEPS = [('Where will you sit?', 'Under a roof, by a wall, or out in the open.'), ('How big is it?', 'Measure the seating area; we\'ll size the heat for you.'), ('How should it look?', 'Slim, flush, or heat and light in one.')]
back = '''<div class="fb"><div class="fbk">Find your Bromic</div><h2>Which Warmth Is Yours?</h2>
<div class="fbg">''' + ''.join(f'<figure><div class="fbi">{img(i, n)}</div><figcaption><b>{n}</b>{d}<i>{x}</i></figcaption></figure>' for i, n, d, x in T) + '''</div>
<div class="fst">''' + ''.join(f'<div><span>{k}</span><b>{q}</b><em>{a}</em></div>' for k, (q, a) in enumerate(STEPS, 1)) + '''</div>
<div class="fbc"><div class="qr"><img src="qr-design.png" alt="QR code for bromic.com/design-your-space"></div>
<div><h3>Plan your outdoor heat</h3><p>Scan to send us a photo of your space. Our design team will suggest the right heaters, free.</p><span>bromic.com/design-your-space</span></div>
<div class="stamp"><span>Your retailer</span></div></div>
<img class="blogo" src="LOGO" alt="Bromic Heating"></div>'''

PAGES = [dict(type='raw', cls='fl', html=front), dict(type='raw', cls='fl', html=back)]
