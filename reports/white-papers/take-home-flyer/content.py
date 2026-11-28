# Take-Home Flyer v2 (owner, 28 Nov 2026: "not really a flyer... don't cram too much info but make the customer want a heater").
# One image, one headline, three short reasons; the back: four heaters as pictures, one QR, the retailer's stamp.
TITLE = 'Extend The Moment · Bromic Heating'
FILE = 'Bromic-Take-Home-Flyer'
FOLIO = ''
SOURCES, FRAMES, HEIGHTS, NOTE = [], [], [], ''
def img(i, alt=''): return f'<img src="img/{i}.jpg" alt="{alt}">'

front = '''<div class="ff">''' + img('w-gno-2', 'Friends at a table under Bromic heaters at dusk') + '''
<div class="ffo"></div>
<img class="flogo" src="LOGOW" alt="Bromic Heating">
<div class="fft"><h1>Extend<br>The Moment</h1>
<p>One more course. One more story. One more hour outside, in any season.</p></div>
</div>'''

T = [('l-006-028', 'Tungsten', 'Slim, powerful warmth for patios and pergolas.'),
     ('w-p1021414-hdr-denoiseai-low-light', 'Platinum', 'Flush, quiet heat that disappears into the ceiling.'),
     ('w-eclipse-electric-24twin-pole-residential-sce', 'Eclipse', 'Heat and a warm glow of light over the table.'),
     ('pf-eclipse-freestanding', 'Freestanding', 'Warmth wherever the furniture goes.')]
back = '''<div class="fb"><div class="fbk">Find your Bromic</div><h2>Which Warmth Is Yours?</h2>
<div class="fbg">''' + ''.join(f'<figure><div class="fbi">{img(i, n)}</div><figcaption><b>{n}</b>{d}</figcaption></figure>' for i, n, d in T) + '''</div>
'''+'''<div class="fbr">
 <div><b>Warm you, not the air</b><span>Radiant heat you feel in seconds.</span></div>
 <div><b>Made for your space</b><span>Ceiling, wall, pergola or freestanding.</span></div>
 <div><b>Run it from your phone</b><span>Zones, schedules and dimming.</span></div>
</div>'''+'''
<div class="fbc"><div class="qr"><img src="qr-design.png" alt="QR code for bromic.com/design-your-space"></div>
<div><h3>Plan your outdoor heat</h3><p>Scan to send us a photo of your space. Our design team will suggest the right heaters, free.</p><span>bromic.com/design-your-space</span></div>
<div class="stamp"><span>Your retailer</span></div></div>
<img class="blogo" src="LOGO" alt="Bromic Heating"></div>'''

PAGES = [dict(type='raw', cls='fl', html=front), dict(type='raw', cls='fl', html=back)]
