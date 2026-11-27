# Heat The Pergola, the "umph" edition (owner, 27 Nov 2026): a tension-led story built on the base edition's pages.
import os
_BASE = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'pergola-2027', 'content.py')
_g = {'__file__': os.path.abspath(_BASE), '__name__': 'base'}
exec(open(_BASE).read(), _g)
for _k in ('SOURCES', 'FRAMES', 'HEIGHTS', 'NOTE'):
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


cover = dict(P[0], sub='Every pergola sold cold is half a room', blurb='For pergola makers, dealers and specifiers.')

hook = dict(type='hero', img='w-bromicatria23', pos='50% 50%', kicker='The Opportunity', n='23%',
            h2='Of Homeowners Plan Heat In From The Start',
            line='The rest bolt it on later, badly, or go without. Every pergola sold without heat is a room used for half the year.')

money = pg('money', 'The Money', 'Heat Sells The Pergola Up',
  ('lede', 'Heat is the upgrade that turns a shade structure into a room, and a good sale into a better one.'),
  ('stats', [('$1,400–$3,600', 'A two- or three-heater package on a louvered pergola, installed, in one dealer\'s published packages.', ''),
             ('68%', 'Of outdoor kitchen projects now install plumbing, electrical or heating systems.', '')]),
  ('h4', 'Wire it now or pay for it later'),
  ('diag', 'prewire', '680 210'),
  ('p', 'Pre-wiring heater positions when the pergola goes up costs a fraction of a retrofit, by one dealer\'s figures. Put heat on the first quote, not the second.'),
  ('photo', 'w-strx-230222-bromic-dc-1', 250, 'Tungsten Electric on a louvered pergola.', '50% 40%'))

hero2 = pg('hero2', 'Meet Tungsten Series II', 'Made For The Pergola',
  ('html', '<div class="h2w"><img src="img/dk-Tungsten-Series-II-Select-black-hero.jpg" alt="Tungsten Series II Select in black on its single post">'
           '<div class="co c1"><b>One single post</b>wiring inside, no junction box on show</div>'
           '<div class="co c2"><b>14% slimmer</b>and a third lighter than Series I</div>'
           '<div class="co c3"><b>IPX5</b>for rain through open louvres</div>'
           '<div class="co c4"><b>Up to 6 kW</b>dual elements, dimmed from the app</div></div>'),
  ('photos', [('dk-Tungsten-Series-II-Select-family-three-finishes', 'Black, white and graphite.'),
              ('dk-Tungsten-Series-II-Select-graphite-grille-macro', 'The Diamond Pattern front.')], 230))

see = pg('see', 'See The Warmth', 'Where The Heat Lands',
  ('lede', 'Each heater warms a defined zone on the floor below it. Plan the heat like the furniture.'),
  ('photo', 'rv-hb-tungsten-6kw-terrace', 410, 'Tungsten 6 kW over a dining table: up to 160 ft².'),
  ('photos', [('rv-hb-platinum-4500w-lounge', 'Platinum 4500 W over a lounge: up to 143 ft².'),
              ('rv-hb-eclipse-pendant-dining', 'Eclipse over a round table: up to 121 ft².')], 200))

disappear = dict(type='hero', img='w-mountain-view-retreat-platinum-electric-rece', pos='50% 50%', kicker='Platinum Electric',
                 h2='Heat That Disappears Into The Roof', line='Glass-ceramic, 2.1 in deep, recessed flush in a 7.1 in cavity.')

case = pg('case', 'A Real Pergola', 'Livonia, Michigan: A Louvered Room, Used All Year',
  ('photos', [('v-skyview-livonia-1', 'Bromic heaters built into a StruXure louvered roof.'),
              ('v-skyview-livonia-2', 'The same pergola, heated for cooler months.')], 300),
  ('cols', [[
    ('h4', 'The brief'), ('p', 'A family wanted their louvered pergola to work beyond summer: shade by day, warmth on cool evenings, nothing bolted on.'),
    ('h4', 'The build'), ('p', 'A StruXure dealer paired the louvered roof with solar screens and Bromic radiant heaters integrated into the structure.'),
  ], [
    ('html', '<div class="quotes q2" style="grid-template-columns:1fr">'
             '<blockquote><p>"This project shows how the right combination of systems can completely change how often a space gets used."</p><small>Owner and CEO, the StruXure dealer</small></blockquote>'
             '<blockquote><p>"The end result is a space that\'s not only beautiful, but actually works for how we want to use it."</p><small>Homeowner, Livonia, Michigan</small></blockquote></div>'),
  ]]),
  ('p', 'Photos: the dealer\'s project page; permission to publish to be confirmed.'))

close = pg('close', 'Next', 'Three Steps To A Warm Pergola',
  ('html', '<div class="steps">'
           '<div><span>1</span><h3>Put heat in your standard spec</h3><p>Offer Classic, Select, Platinum and Eclipse in your frame colours, on every quote.</p></div>'
           '<div><span>2</span><h3>Pre-wire every bay</h3><p>Run power through the post and beam to each heater position when the pergola goes up.</p></div>'
           '<div><span>3</span><h3>Join the roof and the heat</h3><p>Add Affinity to the control package: one app for louvres, lights and warmth.</p></div></div>'),
  ('photo', 'w-kion-sui-madrid-spain-tungsten-electric-5', 380, 'Tungsten under an opening roof.'))

PAGES = [cover, hook,
  ren('The Pergola Is Now The Outdoor Room', 'Every Pergola Sold Cold Is Half A Room'),
  money,
  find('Homeowners Are Building Roofs'), find('Then Wiring Them'),
  ren("Built In On The World's Leading Pergolas", 'Built In. Talked About.'),
  find('Six Things Buyers Want From Heat'),
  hero2,
  ren('A Slimmer Heater For A Slim Beam', 'Lighter On The Beam, Lighter On The Eye'),
  see,
  find('Built For Salt Air'),
  ren('Heat That Joins The Smart Home', 'One App For The Roof And The Heat'),
  ren('One Post, Wiring Inside, Nothing On Show', 'Nothing On Show'),
  ren('Graphite Joins Black And White', 'Every Frame, A Perfect Match'),
  disappear,
  ren('Every Fuel, Every Setting, Every Mount', 'One Brand For The Whole Backyard'),
  find('The Same Warmth At Every Price Point'),
  ren('Where Bromic Fits On Every Structure', 'Every Structure, Warmed'),
  ren('How Tungsten And Platinum Mount To Any Beam', 'Any Beam, One Plate'),
  case,
  dict(find('Built For The Pergola. Ahead Where It Counts.'), blocks=find('Built For The Pergola. Ahead Where It Counts.')['blocks'][:2]),
  ren('Where And How High', 'Warm From 8 To 12 Feet'),
  find('How Many Heaters'),
  ren('Circuits, Controls And Gas', 'Plan The Power Once'),
  close,
  P[-1]]
