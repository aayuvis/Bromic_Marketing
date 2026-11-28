# Heat The Pergola, the "umph" edition (owner, 27 Nov 2026): a tension-led story built on the base edition's pages.
import os
_BASE = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'pergola-2027', 'content.py')
_g = {'__file__': os.path.abspath(_BASE), '__name__': 'base'}
exec(open(_BASE).read(), _g)
for _k in ('SOURCES', 'FRAMES', 'HEIGHTS', 'NOTE', 'img'):
    globals()[_k] = _g[_k]
TITLE = 'Heat The Pergola · Bromic 2027'
FILE = 'Bromic-Heat-The-Pergola-2027'
FOLIO = 'Heat The Pergola · 2027'
P = _g['PAGES']


def pg(t, kicker, h2, *blocks):
    return dict(type=t, kicker=kicker, h2=h2, blocks=list(blocks))


def find(h2):
    return next(p for p in P if p.get('h2') == h2)


def ren(h2_old, h2_new):
    return dict(find(h2_old), h2=h2_new)


cover = dict(P[0], sub='Extend the moment under every roof', blurb='For pergola makers, dealers and specifiers.')

hook = dict(type='hero', img='w-gazebo-bromic', pos='50% 50%', kicker='The Opportunity', n='23%',
            h2='Of Homeowners Plan Heat In From The Start',
            line='Most think of it once the pergola is up and the first cool evening arrives. Bring it into the first conversation, and the evenings look after themselves.')

value = pg('money', 'The Case For Heat', 'More Evenings For Them. More Margin For You.',
  ('lede', 'A heated pergola gets used in more months of the year. That is the reason to buy it, and the reason it sells.'),
  ('cols', [[
    ('h4', 'For the homeowner'),
    ('ul', ['**More of the year:** spring and autumn evenings, and winter in milder climates.',
            '**More of what they paid for:** a pergola that is a room, not a summer shade.',
            '**Planned in:** wiring hidden in the structure, heat aimed at the seats.']),
  ], [
    ('h4', 'For the dealer'),
    ('ul', ['**A bigger ticket:** heaters, controls and wiring on the same order.',
            '**Better margin:** more value per visit, the same crew, the same day.',
            '**Fewer callbacks and more referrals:** done once, seen working by friends and neighbours.']),
  ]]),
  ('diag', 'value', '680 210'),
  ('photo', 'w-strx-230222-bromic-dc-1', 230, 'Tungsten Electric on a louvered pergola.', '50% 40%'))

SCRIPT1 = [('Discover', 'When do you picture using it? Late summer dinners, autumn evenings, game nights in winter?', 'Ask before you design. The answer sizes the heat.'),
           ('Design it in', 'We\'ll mark the heater positions now, so the wiring goes inside the posts and nothing shows.', 'Heat goes on the drawing, not the add-on list.'),
           ('Show it', 'This is how the heat falls on the table. Here is Tungsten in your frame colour, and Platinum if you want it flush.', 'Use the coverage images and the finish swatches.'),
           ('Quote it as standard', 'Your pergola, with heat and controls, ready for every season.', 'Quote heat in the base package, with a version without.'),
           ('Install once', 'We pre-wire every bay while the frame is open.', 'One visit, no retrofit.'),
           ('Hand over', 'Here is your app: the roof, the lights and the heat together.', 'Set zones and schedules on their phone before you leave.')]
script1 = pg('script', 'Selling Heat · 1 of 2', 'Put Heat In The First Conversation',
  ('lede', 'Six steps from the first visit to the first warm evening.'),
  ('html', '<div class="sp">' + ''.join(f'<div class="sps"><span>{i}</span><div><h3>{t}</h3><p class="say">"{s}"</p><p>{n}</p></div></div>' for i, (t, s, n) in enumerate(SCRIPT1, 1)) + '</div>'))

OBJ = [('"It\'s over budget."', 'Tungsten Classic and Select give the same heat coverage at two price points. Platinum is there when the design leads. Start with one heater over the table and pre-wire for more.'),
       ('"We\'ll add heat later."', 'Later means opening the frame and running visible conduit. Pre-wire now, and both Tungsten and Platinum, surface or recessed, stay an option.'),
       ('"Will we really use it?"', 'Ask how many evenings they lose to the cold now. Tungsten for strong, directional warmth; Platinum for quiet heat with very little visible glow.'),
       ('"Heaters look bulky."', 'Tungsten Series II is slim, on one post, in black, white or graphite. Platinum is 2.1 in deep glass-ceramic and recesses flush in a solid bay.'),
       ('"We\'re by the sea."', 'Tungsten Coastal and Platinum Electric Marine are both built in 316 marine-grade stainless; Coastal adds a corrosion-resistant coating.'),
       ('"Not another app."', 'Affinity runs Tungsten and Platinum alike, with Alexa, Google and the home system they already have.'),
       ('"Gas is cheaper."', 'Under a roof, electric Tungsten and Platinum need no gas line, flue or ventilation sums, and switch on instantly.'),
       ('"The electrician will cost a fortune."', 'Tungsten and Platinum each take one dedicated circuit per heater or controller channel. Run while the frame is open, it is the least it will ever cost.')]
script2 = pg('script', 'Selling Heat · 2 of 2', 'Answers To Every Objection',
  ('html', '<div class="ob">' + ''.join(f'<div class="obj"><h3>{q}</h3><p>{a_}</p></div>' for q, a_ in OBJ) + '</div>'))

def sm_page():
    SMB = find('Heat That Joins The Smart Home')['blocks']
    return pg('issue', 'One Connected Outdoor Room', 'One App For The Roof And The Heat', SMB[0], ('diag', 'smart', '680 320'), SMB[2],
              ('photos', [('w-bromic-heating-app-blog-image', 'The Bromic app.'), ('w-affinity-dimmer-5ch', 'Affinity 5-channel controller.')], 190))

def research():
    p_ = dict(find('Six Things Buyers Want From Heat')); p_['blocks'] = [(b[0], b[1].replace('img/t2-single-post-black.jpg', 'img/w-vbb7428.jpg')) if b[0] == 'html' else b for b in p_['blocks']]; return p_

see = pg('see', 'See The Warmth', 'Where The Heat Lands',
  ('lede', 'Each heater warms a defined zone below it. Plan the heat like the furniture.'),
  ('photo', 'rv-hb-tungsten-6kw-terrace', 465, 'Tungsten 6 kW over a dining table: up to 160 ft².'),
  ('photos', [('rv-hb-platinum-4500w-lounge', 'Platinum 4500 W over a lounge: up to 143 ft².'), ('rv-hb-eclipse-pendant-dining', 'Eclipse over a round table: up to 121 ft².')], 229))

CM = [('#1E1E1E', 'Black frame', 'dk-Tungsten-Series-II-Select-black-hero', 'Select in black'),
      ('#F4F4F2', 'White frame', 'dk-Tungsten-Series-II-Select-3kw-white-hero', 'Select in white'),
      ('#4A4D50', 'Grey frame', 'dk-Tungsten-Series-II-Select-graphite-hero', 'Select in graphite'),
      ('#5B4636', 'Bronze frame', 'dk-Tungsten-Series-II-Select-3kw-black-hero', 'Select in black')]
def colour():
    base = find('Graphite Joins Black And White')['blocks']
    tiles = '<div class="cm">' + ''.join(f'<div class="cmt"><div class="cmb" style="background:{col}"><span style="color:{"#222" if col == "#F4F4F2" else "#fff"}">{fr}</span></div><div class="cmi"><img src="img/{im}.jpg" alt="{h}"></div><b>{h}</b></div>' for col, fr, im, h in CM) + '</div>'
    return pg('issue', 'Colour That Matches The Frame', 'Every Frame, A Perfect Match', ('p', 'Black, white and graphite, carried through the whole heater, to sit with every frame colour.'), ('html', tiles), base[2])

def place():
    b = find('Where And How High')['blocks']
    return pg('plan', 'Planning', 'Warm From 8 To 12 Feet', b[0], b[1], ('h4', 'Where to mount on the pergola'), ('diag', 'mount2', '680 270'), b[4])

def cs(i, t, loc, line, flag=''):
    return f'<div class="csc"><div class="csi">{img(i, t)}</div><span class="loc">{loc}</span><h3>{t}</h3><p>{line}</p></div>'
case1 = pg('case', 'Pergola Stories · United States', 'The Boardwalk, Irvine: A Workplace Under Pergolas',
  ('photo', 'w-boardwalk-edits-49', 420, 'Platinum Electric in the pergolas of The Boardwalk\'s courtyard.'),
  ('cols', [[('h4', 'The brief'), ('p', 'An office campus wanted its two-acre courtyard used for work, meetings and breaks in every season, not just on warm afternoons.'),
             ('h4', 'The solution'), ('p', 'Platinum Electric heaters set into the courtyard\'s pergolas: low-profile glass-ceramic heat over the seating, part of the architecture.')],
            [('h4', 'The result'), ('p', 'A courtyard that works as an outdoor office and meeting space through the cooler months.'),
             ('photo', 'w-boardwalk-edits-27', 170, 'The Boardwalk courtyard.')]]))
case2 = pg('case', 'Pergola Stories · Europe And Canada', 'Two Rooms Under Opening Roofs',
  ('html', '<div class="cs2">' + cs('w-kion-sui-madrid-spain-tungsten-electric-5', 'Kion & Sui, Madrid', 'Spain · Restaurant', 'Tungsten Electric along the beams of an opening louvered roof turns the terrace into the restaurant\'s best room, in every season.') +
           cs('v-predator-ridge-range-1', 'Predator Ridge, Vernon', 'Canada · Golf resort', 'A retractable-roof pergola over the patio and fourteen Bromic 6000 W electric heaters turned it into a three-season dining room.') + '</div>'))
case3 = pg('case', 'Pergola Stories · Around The World', 'From Brisbane To Bellheim',
  ('html', '<div class="cs4">' +
   cs('w-calilehero-2', 'The Calile Hotel, Brisbane', 'Australia · Hotel', 'A Platinum Electric heater in each of seven poolside cabanas, controlled by guests from inside.') +
   cs('v-skyview-livonia-1', 'Private home, Livonia', 'United States · Residence', 'Bromic heaters built into a StruXure louvered roof, with solar screens, for a room used all year.') +
   cs('w-dsc01766-bearbeitet', 'Pool house, Bellheim', 'Germany · Residence', 'Eclipse heaters on straight poles with the Eclipse Dimmer Controller, planned with a Bromic heating expert for a low ceiling.') +
   cs('v-turtle-bay-pub-1', 'Turtle Bay Pub, Lake Country', 'Canada · Pub', 'A freestanding louvred pergola with privacy screens and Bromic gas heaters added about 50 seats for three seasons.') + '</div>'),
  ('p', 'Photos of third-party projects: permission to publish to be confirmed.'))

lookup = dict(type='hero', img='w-mountain-view-retreat-platinum-electric-rece', pos='38% 50%', kicker='Spot The Heater', h2='Look Up. That\'s The Heater.',
              line='Platinum Electric, recessed flush in the louvered roof: glass-ceramic, 2.1 in deep. Warmth you feel, not a fixture you see.')
evening = pg('evening', 'Extend The Moment', 'From Sunset To Last Call',
  ('html', '<div class="ev">' + ''.join(f'<figure><div class="evi">{img(i, t)}</div><figcaption><b>{t}</b>{d}</figcaption></figure>' for i, t, d in [
     ('l-007-041', 'Sunset', 'The light goes; the warmth stays.'), ('w-gno-2', 'Dinner', 'Heat over the table, aimed at the seats.'),
     ('w-slc-bromic-heater-1-cropped', 'Late', 'Eclipse keeps the table warm and lit.'), ('w-kion-sui-madrid-spain-tungsten-electric-5', 'Last call', 'The terrace stays full.')]) + '</div>'))

hero2 = pg('hero2', 'Meet Tungsten Series II', 'Made For The Pergola',
  ('html', '<div class="h2w"><img src="img/dk-Tungsten-Series-II-Select-black-hero.jpg" alt="Tungsten Series II Select in black on its single post">'
           '<div class="co c1"><b>One single post</b>wiring inside, no junction box on show</div>'
           '<div class="co c2"><b>14% slimmer</b>and a third lighter than Series I</div>'
           '<div class="co c3"><b>IPX5</b>for rain through open louvres</div>'
           '<div class="co c4"><b>Up to 6 kW</b>dual elements, dimmed from the app</div></div>'),
  ('photos', [('dk-Tungsten-Series-II-Select-family-three-finishes', 'Black, white and graphite.'),
              ('dk-Tungsten-Series-II-Select-graphite-grille-macro', 'The Diamond Pattern front.')], 230))

disappear = dict(type='hero', img='w-mountain-view-retreat-platinum-electric-rece', pos='50% 50%', kicker='Platinum Electric',
                 h2='Heat That Disappears Into The Roof', line='Glass-ceramic, 2.1 in deep, recessed flush in a 7.1 in cavity.')

close = pg('close', 'Next', 'Three Steps To A Warm Pergola',
  ('html', '<div class="steps">'
           '<div><span>1</span><h3>Put heat in your standard spec</h3><p>Offer Classic, Select, Platinum and Eclipse in your frame colours, on every quote.</p></div>'
           '<div><span>2</span><h3>Pre-wire every bay</h3><p>Run power through the post and beam to each heater position when the pergola goes up.</p></div>'
           '<div><span>3</span><h3>Join the roof and the heat</h3><p>Add Affinity to the control package: one app for louvres, lights and warmth.</p></div></div>'),
  ('photo', 'w-kion-sui-madrid-spain-tungsten-electric-5', 380, 'Tungsten under an opening roof.'))



after5 = pg('before', 'Extend The Moment', 'Before 5 PM. After 5 PM.',
  ('html', '<div class="ba"><figure><div class="bai">' + img('w-240619-yorba-linda-ca-dc-64', 'The pergola by day') + '<span class="bal">Before 5 pm</span></div><figcaption>Shade, a kitchen and the pool.</figcaption></figure>'
           '<figure><div class="bai">' + img('rv-pg-yorba-linda-after-5pm', 'The same pergola after sunset, heaters on') + '<span class="bal dk">After 5 pm</span></div><figcaption>The same pergola, still in use: heat on the beam, a blanket on the sofa.</figcaption></figure></div>'),
  ('p', 'After 5 pm: an illustration made from the daytime photograph of this Bromic installation.'))


recess = pg('plan', 'Recessing In A Pergola', 'The Centre-Beam Question',
  ('lede', 'Can a recess kit go in the centre beam? Not inside it, but between two of them.'),
  ('diag', 'channel', '680 285'),
  ('table', {'head': ['', 'Tungsten Series II LC kit', 'Platinum LC kit'], 'rows': [
    ['**Ceiling cut-out**', '1257 × 255 mm (2, 4 kW); 1550 × 255 mm (3, 6 kW)', '995 × 240 mm (2300 W); 1430 × 240 mm (3400 W); 1550 × 317 mm (4500 W)'],
    ['**Clear gap between beams**', '255 mm (10 in)', '240 mm (9.4 in); 317 mm (12.5 in) for 4500 W'],
    ['**Cavity depth**', '190.5 mm (7.5 in)', '180 mm (7.1 in) from the glass'],
    ['**Trim on the ceiling**', '1331 or 1624 × 283 mm', 'Stainless trim around the glass'],
    ['**Ceiling (soffit) board**', '10–30 mm thick', '10–30 mm thick'],
  ]}),
  ('cols', [[
    ('h4', 'Centre beams today'),
    ('ul', ['US louvered roofs: 2×8 to 6×10 in beams, 2–6 in wide.', 'European frames: 150–220 mm profiles, blades inside.', 'Engineered roofs: box beams to 300 × 50 mm, single or double.']),
  ], [
    ('h4', 'How to recess'),
    ('ul', ['**Build a heater channel:** two centre beams with at least 10 in clear (9.4 in for Platinum 2300/3400 W), closed below with a soffit.', '**Or a solid bay:** a fixed panel in place of louvres, framed to the same clear width and depth.', '**Agree it with the pergola maker:** loads, drainage and their warranty.']),
  ]]))

PAGES = [cover, hook,
  ren('The Pergola Is Now The Outdoor Room', 'Make Every Pergola A Four-Season Room'),
  after5, script1, script2,
  find('Homeowners Are Building Roofs'), find('Then Wiring Them'),
  ren("Built In On The World's Leading Pergolas", 'Built In. Talked About.'),
  research(),
  hero2,
  ren('A Slimmer Heater For A Slim Beam', 'Lighter On The Beam, Lighter On The Eye'),
  see, lookup,
  find('Built For Salt Air'),
  sm_page(),
  ren('One Post, Wiring Inside, Nothing On Show', 'Nothing On Show'),
  colour(),
  evening,
  ren('Every Fuel, Every Setting, Every Mount', 'One Brand For The Whole Backyard'),
  find('The Same Warmth At Every Price Point'),
  ren('Where Bromic Fits On Every Structure', 'Every Structure, Warmed'),
  ren('How Tungsten And Platinum Mount To Any Beam', 'Any Beam, One Plate'),

  case1, case2, case3,
  dict(find('Built For The Pergola. Ahead Where It Counts.'), blocks=find('Built For The Pergola. Ahead Where It Counts.')['blocks'][:2]),
  place(),
  find('How Many Heaters'),
  ren('Circuits, Controls And Gas', 'Plan The Power Once'),
  close,
  P[-1]]
