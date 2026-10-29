"""One-off: seed images/library from photography embedded in the Bromic source PDFs.
Run: pdfimages -j -p <pdf> <dir>/<prefix>  (l=Lookbook, t=Trends, p=Planning Guide), then
python3 scripts/seed_images.py <extract_dir>. Writes webp (1600px + 480px thumb) and images/library/manifest.json."""
import json, os, sys
from PIL import Image
SRC = sys.argv[1]
OUT = os.path.join(os.path.dirname(__file__), '..', 'images', 'library')
DOC = {'l': ('Bromic Lookbook 2026', 'sources/Bromic_Lookbook_2026.pdf'),
       't': ('Bromic Outdoor Living Trends 2026', 'sources/Bromic_Outdoor_Living_Trends_2026.pdf'),
       'p': ('Bromic Outdoor Heating Planning Guide v1.2 (2021)', 'sources/Bromic_Planning_Guide_US_v1.2_2021.pdf')}
# file stem: (product, setting, audiences, mood/alt)
T = {
 'l-001-000': ('Tungsten Electric', 'coastal covered terrace', 'RES ARC', 'Covered stone terrace above the sea at dusk, white linear heaters under a timber pergola'),
 'l-002-004': ('Tungsten Electric', 'coastal covered terrace', 'RES ARC', 'Wide timber-roofed terrace opening onto the sea at sunset'),
 'l-002-005': ('Eclipse Electric', 'pool terrace', 'RES ARC', 'Pendant Eclipse heaters over a poolside lounge at blue hour'),
 'l-002-006': ('Tungsten Electric', 'beach house porch', 'RES', 'Two white wall-mounted heaters on a beach-house porch over the dunes'),
 'l-002-007': ('Eclipse Freestanding', 'desert terrace', 'RES', 'Curved-arm Eclipse freestanding heater over lounge chairs at dusk'),
 'l-002-008': ('Tungsten Freestanding Gas', 'hillside dining terrace', 'RES COM', 'Tungsten freestanding gas heater beside an outdoor dining table at sunset'),
 'l-003-009': ('Tungsten Electric (new)', 'harbour, product hero', 'ALL', 'New Tungsten heater floating over a harbour at dusk, product hero'),
 'l-004-012': ('Tungsten Coastal', 'coastal covered terrace', 'RES ARC', 'Long covered terrace with ceiling heaters facing the sea'),
 'l-005-017': ('Tungsten Coastal', 'beachfront patio', 'RES', 'Beachfront patio, heaters on the soffit, dunes beyond'),
 'l-005-018': ('Tungsten Coastal', 'oceanfront lounge', 'RES ARC', 'Oceanfront covered lounge with a wall heater at golden hour'),
 'l-005-020': ('Tungsten Coastal', 'oceanfront wall', 'RES ARC', 'White Tungsten Coastal on a rendered wall above an ocean view'),
 'l-005-022': ('Tungsten Coastal', 'recessed ceiling', 'ARC BLD', 'Tungsten Coastal recessed flush into a white ceiling, coastal view'),
 'l-005-024': ('Tungsten Coastal', 'marina bar', 'COM', 'Marina-side bar with heaters under a canopy, yachts beyond'),
 'l-005-025': ('Tungsten Coastal', 'product detail', 'ARC', 'Signature Diamond Pattern grille detail, white finish'),
 'l-006-028': ('Tungsten Select', 'pergola lounge', 'RES ARC', 'Timber pergola lounge at dusk with Tungsten Select overhead'),
 'l-007-034': ('Tungsten Select', 'product detail', 'ARC', 'Black Tungsten Select grille glowing, macro detail'),
 'l-007-035': ('Tungsten Select', 'ceiling mount lounge', 'RES', 'Ceiling-mounted black heater over a candlelit lounge'),
 'l-007-037': ('Tungsten Select', 'mountain outdoor room', 'RES ARC', 'Stone outdoor room with fireplace and ceiling heater, forest view'),
 'l-007-039': ('Tungsten Select', 'vineyard terrace', 'RES', 'Wall heaters on a stone terrace above vineyards at sunset'),
 'l-007-041': ('Tungsten Select', 'pergola dining', 'RES COM', 'Pergola dining terrace at sunset'),
 'l-008-059': ('Tungsten Select', 'pergola dining', 'RES COM', 'Rustic pergola dining table, lanterns, hills at sunset'),
 'l-009-061': ('Platinum Electric', 'infinity pool terrace', 'RES ARC', 'Infinity-edge terrace and sunken lounge facing the sea'),
 'l-010-066': ('Platinum Electric', 'timber wall, balcony', 'ARC', 'Black Platinum heater on a vertical timber wall, balcony'),
 'l-010-067': ('Platinum Electric', 'outdoor kitchen', 'RES BLD', 'Covered outdoor kitchen and bar with flush ceiling heaters'),
 'l-010-068': ('Platinum Electric', 'product detail', 'ARC', 'Platinum heater against blue sky, grille macro'),
 'l-010-069': ('Platinum Electric', 'modern pool house', 'RES ARC', 'Modern house over a lit pool, heaters under the cantilever'),
 'l-010-070': ('Platinum Electric', 'courtyard dining', 'RES', 'Courtyard dining table, black wall heater on rendered wall'),
 'l-010-071': ('Platinum Electric', 'coastal terrace', 'RES', 'Ocean-view outdoor living room with recessed heaters'),
 'l-010-073': ('Platinum Electric', 'white coastal porch', 'RES', 'White porch lounge, white heaters, sea view'),
 'l-010-074': ('Platinum Electric', 'cabana wall', 'RES BLD', 'Black heater on a timber cabana wall at dusk'),
 'l-010-075': ('Platinum Electric', 'modern interior-exterior', 'ARC', 'Minimal glass pavilion, ceiling-recessed heaters'),
 'l-010-076': ('Platinum Electric', 'louvred pergola detail', 'ARC BLD', 'White heater between pergola louvres, detail'),
 'l-011-090': ('Platinum Electric', 'clifftop pool terrace', 'RES', 'Clifftop terrace with wall heater at sunset'),
 'l-012-093': ('Eclipse Electric', 'waterfront lounge', 'RES ARC', 'Pendant Eclipse heaters over curved sofas facing the water'),
 'l-013-099': ('Eclipse Electric', 'garden dining', 'RES COM', 'Eclipse pendants over a lush candlelit garden dining area'),
 'l-013-100': ('Eclipse Electric', 'stone dining room outdoors', 'COM RES', 'Eclipse pendants above a long candlelit dining table'),
 'l-013-102': ('Eclipse Electric', 'pool terrace', 'RES', 'Eclipse pendants over a poolside loggia at blue hour'),
 'l-013-104': ('Eclipse Electric', 'resort loggia', 'COM', 'Resort loggia with Eclipse pendants at dusk'),
 'l-013-106': ('Eclipse Electric', 'product close, rim lighting', 'ALL', 'Eclipse with dimmable rim lighting glowing, close'),
 'l-013-107': ('Eclipse Electric', 'city rooftop', 'COM', 'Eclipse over a rooftop table, city lights beyond'),
 'l-013-108': ('Eclipse Electric', 'sunset lounge', 'RES', 'Two Eclipse heaters at sunset, mountains'),
 'l-013-110': ('Eclipse Electric', 'lakeside night', 'RES', 'Eclipse heaters over a lakeside terrace at night'),
 'l-013-111': ('Eclipse Electric', 'restaurant terrace', 'COM', 'Wall-arm Eclipse heaters over a restaurant terrace under an awning'),
 'l-014-122': ('Eclipse Electric', 'waterfront lounge', 'RES', 'Eclipse over curved lounge, sunset over water'),
 'l-015-125': ('Eclipse Freestanding', 'desert terrace, fire table', 'RES', 'Eclipse freestanding arcing over a fire table at sunset'),
 'l-016-130': ('Eclipse Freestanding', 'desert terrace', 'RES', 'Eclipse freestanding over lounge, dusk sky'),
 'l-016-131': ('Eclipse Freestanding', 'city rooftop', 'RES COM', 'Rooftop lounge with Eclipse freestanding, skyline at sunset'),
 'l-016-133': ('Eclipse Freestanding', 'desert patio', 'RES', 'Eclipse freestanding over a sculptural chair and fire table'),
 'l-016-134': ('Eclipse Freestanding', 'lakeside deck', 'RES', 'Eclipse freestanding on a lakeside deck under clouds'),
 'l-016-135': ('Eclipse Freestanding', 'forest patio', 'RES', 'Eclipse freestanding beside a forest cabin patio'),
 'l-016-136': ('Eclipse Freestanding', 'courtyard dining', 'RES COM', 'Courtyard dining with Eclipse freestanding'),
 'l-017-147': ('Eclipse Freestanding', 'desert patio', 'RES', 'Eclipse freestanding, warm glow, desert sunset'),
 'l-018-151': ('Tungsten Freestanding Gas', 'desert pool terrace', 'RES', 'Tungsten freestanding gas by a pool, mountains at dusk'),
 'l-018-154': ('Tungsten Freestanding Gas', 'desert pool terrace', 'RES', 'Tungsten freestanding gas beside fire bowl and pool'),
 'l-019-160': ('Tungsten Freestanding Gas', 'pool deck night', 'RES', 'Tungsten freestanding gas on a lit pool deck'),
 'l-019-161': ('Tungsten Freestanding Gas', 'coastal deck', 'RES', 'Tungsten freestanding gas on a coastal deck at sunrise'),
 'l-019-162': ('Tungsten Freestanding Gas', 'hillside dining', 'RES COM', 'Tungsten freestanding gas by a hillside dining table'),
 'l-019-163': ('Tungsten Freestanding Gas', 'courtyard', 'RES', 'Tungsten freestanding gas in a stone courtyard at dusk'),
 'l-019-164': ('Tungsten Freestanding Gas', 'dining terrace', 'COM RES', 'Tungsten freestanding gas beside a set dining table'),
 'l-019-165': ('Tungsten Freestanding Gas', 'beach', 'RES', 'Tungsten freestanding gas on a beach at sunset'),
 'l-020-173': ('Tungsten Freestanding Gas', 'stone patio', 'RES', 'Tungsten freestanding gas by a stone wall, forest'),
 'l-020-175': ('Tungsten Gas', 'product on black', 'ALL', 'Tungsten gas heater head on black, product shot'),
 'l-021-180': ('Affinity Smart-Heat Controls', 'coastal covered terrace', 'RES', 'Coastal covered terrace at golden hour, heaters overhead'),
 'l-022-201': ('Design service', 'clifftop terrace', 'ALL', 'Clifftop timber terrace over the sea, heaters recessed'),
 'p-001-000': ('Platinum (2021 range)', 'modern house patio', 'RES ARC BLD', 'Modern stone and white house, covered dining patio'),
 'p-002-001': ('Commercial (2021 range)', 'restaurant courtyard', 'COM', 'Flower-filled restaurant courtyard with heaters'),
 'p-002-002': ('Platinum (2021 range)', 'rooftop terrace', 'COM ARC', 'Rooftop terrace under a pergola with linear heaters'),
 'p-003-004': ('Platinum (2021 range)', 'cafe wall', 'COM', 'Cafe tables under a white wall heater, teal wall'),
 'p-003-006': ('Commercial (2021 range)', 'busy restaurant patio', 'COM', 'Guests dining on a heated restaurant terrace'),
 'p-004-007': ('Commercial (2021 range)', 'restaurant patio', 'COM', 'Restaurant patio with red umbrellas and heaters'),
 'p-006-027': ('Residential (2021 range)', 'sunken deck', 'RES BLD', 'Timber deck with sunken fire area at dusk'),
 'p-007-030': ('Commercial (2021 range)', 'restaurant terrace', 'COM', 'Long restaurant terrace with greenery and heaters'),
 'p-010-044': ('Commercial (2021 range)', 'event pavilion', 'COM ARC', 'Open pavilion set for an event, ceiling heaters'),
 'p-011-049': ('Tungsten Gas (2021 range)', 'modern patio', 'RES ARC BLD', 'Modern patio, wall-mounted gas heaters above dining'),
 'p-012-058': ('Residential (2021 range)', 'white courtyard', 'ARC', 'White walled courtyard with green wall'),
 'p-013-064': ('Marine (2021 range)', 'yacht deck dining', 'COM', 'Yacht deck dining table, ceiling heaters, mountains'),
 'p-013-065': ('Tungsten Portable (2021 range)', 'forest deck', 'RES', 'Portable heater on a deck facing forest'),
 'p-014-066': ('Commercial (2021 range)', 'rooftop dining', 'COM', 'Rooftop dining under a dark canopy at dusk'),
 't-001-000': ('Lifestyle', 'modern house deck', 'RES ARC BLD', 'Modern timber house with deck at dusk'),
 't-003-005': ('Eclipse Electric', 'rooftop pool', 'RES ARC', 'Eclipse pendant over a rooftop lounge at sunset'),
 't-005-013': ('Lifestyle', 'outdoor fireplace', 'RES', 'Couple by an outdoor fireplace under a covered patio'),
 't-006-016': ('Platinum Electric', 'city rooftop terrace', 'ARC COM', 'Urban roof terrace, timber soffit with recessed heater'),
 't-007-019': ('Eclipse Electric', 'indoor-outdoor living', 'ARC', 'Open indoor-outdoor living room with Eclipse pendant'),
 't-008-022': ('Lifestyle', 'pergola balcony', 'RES', 'Balcony under a louvred pergola, table set'),
 't-009-025': ('Affinity Smart-Heat Controls', 'app in hand', 'RES', 'Hand holding a tablet controlling heat at an outdoor table'),
 't-010-028': ('Lifestyle', 'balcony lounge', 'RES', 'Balcony lounge with sea view'),
 't-011-031': ('Eclipse Freestanding', 'compact yard', 'RES', 'Compact back yard lounge with Eclipse freestanding'),
 't-012-034': ('Lifestyle', 'pergola patio and kitchen', 'RES BLD', 'Large pergola patio with outdoor kitchen and dining'),
 't-013-037': ('Lifestyle', 'modern terrace', 'ARC', 'Dark-clad terrace framing a water view'),
}
os.makedirs(OUT, exist_ok=True)
man = []
for stem, (prod, setting, aud, alt) in T.items():
    src = os.path.join(SRC, stem[0] if False else {'l':'look','t':'trend','p':'plan'}[stem[0]], stem + '.jpg')
    im = Image.open(src).convert('RGB')
    w, h = im.size
    big = im.copy(); big.thumbnail((1600, 1600)); big.save(os.path.join(OUT, stem + '.webp'), quality=78)
    th = im.copy(); th.thumbnail((520, 520)); th.save(os.path.join(OUT, stem + '-t.webp'), quality=72)
    doc, path = DOC[stem[0]]
    man.append({'id': stem, 'file': f'images/library/{stem}.webp', 'thumb': f'images/library/{stem}-t.webp',
                'w': big.size[0], 'h': big.size[1], 'orientation': 'landscape' if w > h * 1.15 else ('portrait' if h > w * 1.15 else 'square'),
                'product': prod, 'setting': setting, 'audiences': aud.split(), 'alt': alt,
                'source': doc, 'source_file': path, 'page': int(stem.split('-')[1]),
                'rights': 'Bromic-owned (from Bromic publication)' + ('; Lookbook imagery is design inspiration, not installation guidance' if stem[0]=='l' else '') + ('; 2021 range, check product shown is current' if stem[0]=='p' else ''),
                'status': 'approved-source'})
json.dump(man, open(os.path.join(OUT, 'manifest.json'), 'w'), indent=1)
print(len(man), 'images')
