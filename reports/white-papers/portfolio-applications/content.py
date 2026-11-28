# Portfolio By Application, v2 (owner, 28 Nov 2026: "learn from the pergola work and redo it").
# Bigger type, fewer words, real photos and product images, Bromic voice, no sources or notes, no prices.
# Built on the pergola guide's pages where they serve retail (portfolio grid, price ladder, coverage, smart diagram).
import os
_BASE = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'pergola-2027', 'content.py')
_g = {'__file__': os.path.abspath(_BASE), '__name__': 'base'}
exec(open(_BASE).read(), _g)
for _k in ('SOURCES', 'FRAMES', 'HEIGHTS', 'NOTE', 'img'):
    globals()[_k] = _g[_k]
P = _g['PAGES']
TITLE = 'Portfolio By Application · Bromic Heating'
FILE = 'Bromic-Portfolio-By-Application'
FOLIO = 'Portfolio By Application · For Retail Partners'


def pg(t, kicker, h2, *blocks):
    return dict(type=t, kicker=kicker, h2=h2, blocks=list(blocks))


def find(h2):
    return next(p for p in P if p.get('h2') == h2)


cover = dict(type='cover', img='l-001-000', alt='A coastal covered terrace heated by Tungsten', pos='50% 50%',
             kicker='For Retail Partners', title_html='Portfolio By<br><em>Application</em>',
             sub='The right heat for every outdoor room', blurb='Which Bromic heater goes where, with its controls.',
             note='Tungsten · Platinum · Eclipse · Affinity')

# the at-a-glance: nine spaces, the heater to show first
APPS = [
    ('w-connecticut-privateresidence-tungstenelectri-3', 'Covered Patio', 'Tungsten Select'),
    ('w-240619-yorba-linda-ca-dc-64', 'Pergola', 'Tungsten Select · single post'),
    ('w-dsc05737-courtney-saib', 'Pitched Porch', 'Tungsten + pitched adaptor'),
    ('w-platinumelectricflushmountedw-lowclearancere', 'Flush Ceiling', 'Platinum or Tungsten, recessed'),
    ('l-010-071', 'Design-Led Room', 'Platinum Electric'),
    ('l-013-102', 'Over The Table', 'Eclipse pendant'),
    ('l-005-022', 'By The Water', 'Tungsten Coastal · Platinum Marine'),
    ('l-018-151', 'Lawn And Pool', 'Eclipse Freestanding · Tungsten Gas tower'),
    ('w-tungsten-gas-500-fiddler-sydney-2-1', 'Restaurant And Bar', 'Tungsten Gas · Platinum Gas'),
]
glance = pg('glance', 'At A Glance', 'Every Outdoor Room, One Family',
  ('html', '<div class="gl">' + ''.join(f'<figure><div class="gli">{img(i, t)}</div><figcaption><b>{t}</b><span>{h}</span></figcaption></figure>' for i, t, h in APPS) + '</div>'))


def card(i, t, show, why, ctl, sell):
    return (f'<div class="apc"><div class="api">{img(i, t)}</div><div class="apt"><h3>{t}</h3>'
            f'<div class="show"><span>Show first</span>{show}</div><p>{why}</p>'
            f'<div class="kv"><b>Controls</b><span>{ctl}</span></div><div class="kv"><b>Sell it to</b><span>{sell}</span></div></div></div>')


AFF = 'Affinity On/Off or Dimmer, with a wall switch'
A1 = pg('apps', 'Under The Roof', 'Warmth For Every Kind Of Ceiling',
  ('html', '<div class="aps">' +
   card('w-connecticut-privateresidence-tungstenelectri-3', 'Covered Patio Or Porch', 'Tungsten Select', 'Slim, on one post, in black, white or graphite. Classic gives the same warmth at an entry price.', AFF, 'Homeowners finishing a patio, and their builders.') +
   card('w-dsc05737-courtney-saib', 'Pergola Or Pitched Ceiling', 'Tungsten Series II + pitched adaptor', 'From 3/12 to 12/12 on a vaulted porch, or on its single post from a pergola beam. No junction box on show.', AFF, 'Pergola and patio-cover customers, and their installers.') +
   card('w-platinumelectricflushmountedw-lowclearancere', 'Shallow Ceiling, Flush Look', 'Platinum or Tungsten, recessed', 'Platinum sits flush in a 7.1 in cavity; Tungsten recesses up to 6 kW in 7.5 in, fan-ventilated, box supplied.', AFF, 'Homeowners who want the heater to disappear.') + '</div>'))
A2 = pg('apps', 'The Considered Room', 'Heat You Feel, Not See',
  ('html', '<div class="aps">' +
   card('l-010-071', 'Design-Led Outdoor Room', 'Platinum Electric', 'Tinted glass-ceramic, 2.1 in deep, black or white. Platinum Gas where there is a gas line.', AFF, 'California rooms and outdoor kitchens, with their designers.') +
   card('l-013-102', 'Over The Dining Table', 'Eclipse pendant', 'Radiant heat and a dimmable 3000K LED ring in one fixture: warm and softly lit to the last glass.', 'Affinity Eclipse Controller or Eclipse Dimmer with remote', 'Homeowners who entertain at the table.') +
   card('l-005-022', 'By The Water', 'Tungsten Coastal · Platinum Marine', '316 marine-grade stainless; Coastal adds a corrosion-resistant coating. For homes by the water, not boats.', AFF, 'Homes by the ocean, a lake or a bay.') + '</div>'))
A3 = pg('apps', 'Open Air And Hospitality', 'Warmth Wherever The Evening Goes',
  ('html', '<div class="aps">' +
   card('l-018-151', 'Lawn, Pool, No Roof', 'Eclipse Freestanding · Tungsten Gas tower', 'Eclipse arches heat and light over the sofa; the Tungsten tower runs on propane or natural gas.', 'Eclipse Dimmer and remote; the tower at its own knob', 'Pool decks, lawns and open terraces.') +
   card('w-tungsten-gas-500-fiddler-sydney-2-1', 'Restaurant And Bar', 'Tungsten Gas · Platinum Gas', 'Compact gas heads on beams or drop poles, switched by zone; Platinum Gas for the front of house.', 'Affinity On/Off or a manual wall switch', 'Restaurant, bar and hotel owners.') +
   card('w-platinum-electric-del-friscos-century-city-2', 'Rooftop Or Commercial Terrace', 'Tungsten Select · Platinum Electric', 'Tungsten up to 6 kW at 208, 240 or 277 V; Platinum on drop poles under high ceilings.', AFF, 'Hotels, restaurants and property owners.') + '</div>'))

QS = [('Is there a roof, wall or post?', 'No: Eclipse Freestanding or the Tungsten Gas tower. Yes: mount it, and choose by ceiling.'),
      ('Electric or gas?', 'Under a roof, electric is simplest: no gas line, flue or ventilation sums. Gas where the line already runs.'),
      ('What is the style of the space?', 'Modern: Platinum or Eclipse, first. Transitional or farmhouse: Tungsten Select. Timber or traditional: Tungsten, on the beam or recessed.')]
floor = pg('floor', 'On The Floor', 'Three Questions, The Right Heater',
  ('html', '<div class="steps">' + ''.join(f'<div><span>{i}</span><h3>{q}</h3><p>{a}</p></div>' for i, (q, a) in enumerate(QS, 1)) + '</div>'),
  ('h4', 'Then close with the controls'),
  ('p', 'Every heater leaves with its control: Affinity On/Off or Dimmer for Tungsten and Platinum, the Eclipse controller for Eclipse, and a wall switch. App features need compatible Affinity controls, sold separately.'),
  ('photo', 'w-bromic-heating-app-blog-image', 300, 'The Bromic app.', '50% 40%'))

smart = pg('issue', 'Controls', 'One App For Every Heater',
  ('lede', 'Zones, schedules, dimming and voice, from the phone your customer already holds.'),
  ('diag', 'smart', '680 320'),
  find('Heat That Joins The Smart Home')['blocks'][2])

see = pg('see', 'Coverage', 'Where The Heat Lands',
  ('lede', 'Show the customer where the warmth falls, and the right size sells itself.'),
  ('photo', 'rv-hb-tungsten-6kw-terrace', 465, 'Tungsten 6 kW over a dining table: up to 160 ft².'),
  ('photos', [('rv-hb-platinum-4500w-lounge', 'Platinum 4500 W over a lounge: up to 143 ft².'), ('rv-hb-eclipse-pendant-dining', 'Eclipse over a round table: up to 121 ft².')], 229))

ba = {
  'type': 'before', 'kicker': 'Extend The Moment', 'h2': 'Before 5 PM. After 5 PM.',
  'blocks': [('html', '<div class="ba"><figure><div class="bai">' + img('w-240619-yorba-linda-ca-dc-64', 'The pergola by day') + '<span class="bal">Before 5 pm</span></div><figcaption>Shade, a kitchen and the pool.</figcaption></figure>'
              '<figure><div class="bai">' + img('rv-pg-yorba-linda-after-5pm', 'The same pergola after sunset, heaters on') + '<span class="bal dk">After 5 pm</span></div><figcaption>The same space, still in use. That is what your customer is buying.</figcaption></figure></div>')]}

port = dict(find('Every Fuel, Every Setting, Every Mount'), h2='One Brand For The Whole Backyard', kicker='The Range')
port = dict(port, blocks=port['blocks'][:2] + [('photo', 'w-gno-2', 330, 'Tungsten over a poolside dining table.', '50% 40%')])
price = dict(find('The Same Warmth At Every Price Point'), kicker='The Range')

back = dict(P[-1], h2='Every Outdoor Room. The Right Heat.', site='bromic.com')

PAGES = [cover, glance, ba, port, price, A1, A2, A3, see, smart, floor, back]
