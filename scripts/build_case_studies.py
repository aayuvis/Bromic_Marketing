"""Build data/case-studies.json: every Bromic case study and photographed project, multi-tagged (data/case-study-taxonomy.json).

  python3 scripts/build_case_studies.py

Sources: data/site-inventory.json (bromic.com case studies, AU and CA items, gallery photos). Tags for written case studies are
set by hand below from what each page says (29 Oct 2026); gallery projects are tagged from their titles and marked
`kind: project` (photographed, never written up). A tag is a claim about the page: if the page doesn't say it, don't tag it.
Sales-deck collections are the owner's case-study slide (29 Oct 2026); projects named there but not on the site are logged as
`kind: deck-only` with only what the slide states (theme and place).
"""
import json, os, re
from collections import defaultdict

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
INV = json.load(open(os.path.join(ROOT, 'data', 'site-inventory.json')))
TAX = json.load(open(os.path.join(ROOT, 'data', 'case-study-taxonomy.json')))
MAN = json.load(open(os.path.join(ROOT, 'images', 'library', 'manifest.json')))
EXTRA = os.path.join(ROOT, 'data', 'case-study-tags.json')  # hand edits by marketing win over the defaults below

# slug → tags. seg, space, inst, prod, ctl, theme, proof; market is computed from the location unless given.
T = {
 'albany-zero-emissions-multifamily-building': dict(seg='multifamily', space='rooftop amenity-deck', inst='freestanding', prod='eclipse-portable', ctl='controls-not-stated', theme='all-electric replace-gas design-led', proof='quote credits photo-set', year=2024),
 'christophers-at-wrigley-mansion': dict(seg='restaurant', space='terrace', inst='freestanding', prod='eclipse-portable', ctl='controls-not-stated', theme='heritage design-led heat-light', proof='quote credits', year=2022),
 'del-friscos-double-eagle-steakhouse': dict(seg='restaurant retail-precinct', space='terrace', inst='ceiling-mounted', prod='platinum-electric', ctl='legacy-wireless', theme='season-extension', proof='numbers', year=2019),
 'desert-mirage-blurring-the-lines-between-home-and-nature': dict(seg='single-family', space='covered-patio california-room', inst='freestanding', prod='eclipse-portable', ctl='controls-not-stated', theme='design-led heat-light', proof='quote credits press photo-set', year=2024),
 'eclipse-electric-and-tungsten-electric-at-pink-hill-hotel': dict(seg='pub-club hotel-resort', space='courtyard terrace', inst='pole-suspended pendant', prod='eclipse-electric eclipse-pendant tungsten-electric', ctl='eclipse-dimmer', theme='heat-light high-ceiling design-service', proof='press photo-set', year=2023),
 'eclipse-freestanding-and-tungsten-electric-at-hyatt-regency-dehradun': dict(seg='hotel-resort bar-rooftop', space='rooftop terrace', inst='freestanding wall-mounted', prod='eclipse-portable tungsten-electric', ctl='eclipse-dimmer', theme='wind design-service design-led', proof='quote credits', year=2023),
 'eclipse-pendant-and-platinum-electric-at-stellas-wine-bar': dict(seg='bar-rooftop hotel-resort', space='terrace', inst='pendant pole-suspended ceiling-mounted', prod='eclipse-pendant platinum-electric', ctl='eclipse-dimmer legacy-wireless', theme='heat-light design-service', proof='quote heat-plan numbers', year=2023),
 'embracing-earthy-elegance-at-oran-park-hotel': dict(seg='hotel-resort pub-club', space='terrace courtyard rooftop', inst='wall-mounted pole-suspended pendant', prod='platinum-electric eclipse-pendant', ctl='controls-not-stated', theme='heat-light high-ceiling design-led design-service', proof='quote credits press photo-set', year=2025),
 'embracing-natures-elegance-ambiente-sedona': dict(seg='hotel-resort', space='terrace deck', inst='freestanding wall-mounted', prod='eclipse-portable tungsten-electric', ctl='controls-not-stated', theme='design-led design-service', proof='quote photo-set', year=2024),
 'enhancing-rooftop-bar-designs-with-cutting-edge-outdoor-heating-solutions': dict(seg='bar-rooftop restaurant', space='rooftop', inst='freestanding pole-suspended', prod='eclipse-portable tungsten-electric', ctl='eclipse-dimmer switch', theme='wind replace-gas design-service', proof='heat-plan photo-set', year=2023),
 'enhancing-work-life-balance-with-year-round-outdoor-comfort-at-the-boardwalk': dict(seg='workplace', space='pergola courtyard', inst='pole-suspended wood-structure', prod='platinum-electric', ctl='controls-not-stated', theme='season-extension', proof='heat-plan', year=2024),
 'from-gut-renovation-to-outdoor-bliss-how-bromics-tungsten-heaters-redefined-comfort-for-this-new-jersey-home': dict(seg='single-family', space='screened-porch', inst='pole-suspended ceiling-mounted', prod='tungsten-electric', ctl='legacy-wireless', theme='season-extension design-service', proof='quote photo-set', year=2024),
 'hide-restaurant': dict(seg='restaurant', space='street-dining', inst='freestanding', prod='tungsten-portable', ctl='controls-not-stated', theme='season-extension', proof='quote', year=2020),
 'hotel-skansen-elevates-outdoor-dining-with-the-bromic-smart-heat-freestanding-heaters': dict(seg='hotel-resort restaurant', space='terrace', inst='freestanding', prod='eclipse-portable', ctl='eclipse-dimmer', theme='coastal heat-light design-service', proof='quote heat-plan numbers', year=2023),
 'kahite-golf-course-pub-grill': dict(seg='golf-country-club restaurant', space='covered-patio', inst='ceiling-mounted', prod='tungsten-electric', ctl='controls-not-stated', theme='low-clearance season-extension', proof='quote numbers', year=2020),
 'london-restauranteur-incorporates-full-bromic-line-across-locations': dict(seg='restaurant bar-rooftop', space='terrace street-dining', inst='pendant wall-mounted ceiling-mounted', prod='eclipse-pendant tungsten-electric platinum-electric', ctl='eclipse-dimmer legacy-wireless', theme='multi-site heat-light', proof='quote credits', year=2023),
 'm-y-lady-lene-superyacht': dict(seg='marine-yacht', space='yacht-deck', inst='recessed', prod='platinum-marine', ctl='controls-not-stated', theme='coastal durability', proof='quote credits', market='MARINE'),
 'pecora-bianca': dict(seg='restaurant', space='street-dining', inst='wall-mounted', prod='platinum-electric tungsten-electric', ctl='controls-not-stated', theme='season-extension', proof='', year=2020),
 'perfecting-the-modern-outdoor-pool-house-with-bromics-eclipse-collection': dict(seg='single-family', space='pool-cabana', inst='pole-suspended', prod='eclipse-electric', ctl='eclipse-dimmer', theme='heat-light low-clearance design-service', proof='quote credits', year=2023, market='DACH'),
 'platinum-electric-heaters-in-pangbourne': dict(seg='single-family', space='barn-outbuilding', inst='wood-structure ceiling-mounted', prod='platinum-electric', ctl='legacy-wireless', theme='heritage large-scale', proof='quote numbers', year=2022, market='UK'),
 'platinum-electric-heaters-recessed-using-the-low-clearance-recess-kit': dict(seg='single-family', space='pergola louvred-roof', inst='recessed low-clearance-recess', prod='platinum-electric', ctl='controls-not-stated', theme='low-clearance design-service', proof='credits', year=2023),
 'platinum-electric-marine-heaters-aboard-iconic-superyacht-m-y-coral-ocean': dict(seg='marine-yacht', space='yacht-deck', inst='recessed', prod='platinum-marine', ctl='legacy-wireless', theme='coastal design-service', proof='quote credits heat-plan', year=2019, market='MARINE'),
 'platinum-electric-marine-heaters-aboard-ritz-carlton-yacht-collections-evrima': dict(seg='marine-cruise', space='yacht-deck', inst='recessed', prod='platinum-marine', ctl='controls-not-stated', theme='coastal design-service design-led', proof='credits heat-plan', year=2022, market='MARINE'),
 'print-restaurant': dict(seg='restaurant bar-rooftop', space='rooftop pool-cabana', inst='wall-mounted', prod='tungsten-electric', ctl='controls-not-stated', theme='season-extension', proof='', year=2017),
 'private-residence-connecticut': dict(seg='single-family', space='covered-patio', inst='recessed', prod='tungsten-electric', ctl='legacy-wireless', theme='season-extension', proof='', year=2015),
 'provenance': dict(seg='restaurant', space='terrace', inst='wall-mounted', prod='platinum-gas', ctl='controls-not-stated', theme='coastal season-extension', proof='', year=2016),
 'smart-heating-aboard-the-most-technologically-advanced-cruiseship-built-to-date': dict(seg='marine-cruise', space='yacht-deck', inst='recessed pole-suspended', prod='platinum-marine', ctl='controls-not-stated', theme='large-scale coastal design-service', proof='credits heat-plan numbers', year=2023, market='MARINE'),
 'talon-bar-brooklyn': dict(seg='bar-rooftop', space='courtyard', inst='ceiling-mounted', prod='tungsten-electric', ctl='controls-not-stated', theme='season-extension', proof='', year=2020),
 'the-calile-hotel': dict(seg='hotel-resort', space='pool-cabana', inst='ceiling-mounted', prod='platinum-electric', ctl='switch', theme='design-led', proof='numbers', year=2019),
 'the-modern-heating-solution-for-vintage-upscale-dining': dict(seg='restaurant', space='terrace covered-patio', inst='ceiling-mounted', prod='platinum-electric', ctl='switch', theme='design-led', proof='photo-set', year=2023),
 'the-sheraton-carlsbad-resort-spa': dict(seg='hotel-resort restaurant', space='terrace', inst='ceiling-mounted', prod='platinum-gas', ctl='controls-not-stated', theme='coastal durability', proof='quote numbers'),
 'the-w-hotel': dict(seg='hotel-resort bar-rooftop', space='rooftop terrace', inst='ceiling-mounted', prod='platinum-electric tungsten-electric', ctl='controls-not-stated', theme='design-led', proof='quote'),
 'tonys-di-napoli': dict(seg='restaurant', space='street-dining', inst='wall-mounted', prod='tungsten-electric', ctl='controls-not-stated', theme='season-extension', proof=''),
 'tungsten-electric-heaters-at-clinica-las-condes': dict(seg='healthcare restaurant', space='pergola louvred-roof terrace', inst='ceiling-mounted', prod='tungsten-electric', ctl='controls-not-stated', theme='large-scale', proof='quote numbers heat-plan', year=2023, market='LATAM'),
 'welcoming-guests-with-the-warmth-of-mexican-hospitality': dict(seg='restaurant', space='covered-patio courtyard', inst='ceiling-mounted', prod='platinum-gas', ctl='controls-not-stated', theme='fire-code design-led', proof='credits photo-set', year=2024),
 'neumanns-restaurant': dict(seg='restaurant', space='terrace', inst='', prod='platinum-electric', ctl='controls-not-stated', theme='season-extension', proof='', market='DACH'),
 'barangaroo-house': dict(seg='restaurant bar-rooftop', space='terrace rooftop', inst='', prod='platinum-electric', ctl='controls-not-stated', theme='', proof='', market='AU'),
 'sunbury-bowling-club': dict(seg='pub-club', space='', inst='', prod='', ctl='controls-not-stated', theme='', proof='', market='AU'),
}

def market_of(loc, given=None):
    if given: return given
    l = (loc or '').lower()
    for k, m in [('australia', 'AU'), ('sydney', 'AU'), ('brisbane', 'AU'), ('melbourne', 'AU'), ('perth', 'AU'), ('victoria', 'AU'),
                 ('canada', 'CA'), ('toronto', 'CA'), ('vancouver', 'CA'), ('calgary', 'CA'), ('montreal', 'CA'), ('ontario', 'CA'), ('british columbia', 'CA'), ('alberta', 'CA'), ('quebec', 'CA'),
                 ('new zealand', 'NZ'), ('auckland', 'NZ'), ('united kingdom', 'UK'), ('london', 'UK'), ('england', 'UK'),
                 ('germany', 'DACH'), ('austria', 'DACH'), ('switzerland', 'DACH'), ('bellheim', 'DACH'), ('hamburg', 'DACH'), ('belgium', 'BE'), ('brussels', 'BE'), ('netherlands', 'NL'), ('amsterdam', 'NL'), ('sweden', 'EU'), ('spain', 'EU'), ('norway', 'EU'), ('oslo', 'EU'), ('france', 'EU'),
                 ('india', 'IN'), ('chile', 'LATAM'), ('argentina', 'LATAM'), ('mexico', 'LATAM'), ('monterrey', 'LATAM'), ('dubai', 'ME'), ('uae', 'ME'),
                 ('usa', 'US'), ('california', 'US'), ('new york', 'US'), ('texas', 'US'), ('arizona', 'US'), ('d.c', 'US'), ('kentucky', 'US'),
                 ('tennessee', 'US'), ('new jersey', 'US'), ('connecticut', 'US'), ('washington', 'US'), ('ny', 'US'), ('ky', 'US'), ('tn', 'US'), ('wa', 'US'), ('us', 'US'), ('irvine', 'US'), ('san diego', 'US'), ('louisville', 'US'), ('newport', 'US'), ('brooklyn', 'US'), ('nyc', 'US'), ('woodinville', 'US')]:
        if re.search(r'(?<![a-z])' + re.escape(k.strip()) + r'(?![a-z])', l): return m
    return None

def split(s): return [t for t in (s or '').split() if t]

def images_for(urls):
    urls = set(u.rstrip('/') + '/' for u in urls if u)
    return [m['id'] for m in MAN if m.get('status') != 'rejected' and set((m.get('used_on') or [])) & urls]

valid = {g: {t['id'] for t in v['tags']} for g, v in TAX['groups'].items()}
def check(rec):
    for g, ids in rec['tags'].items():
        for t in ids:
            if t not in valid[g]: raise SystemExit(f"{rec['id']}: unknown {g} tag {t}")

out = []
seen_slug = set()
for r in INV:
    if r.get('kind') != 'case-study': continue
    slug = r['url'].rstrip('/').split('/')[-1] if r['url'] and not r['url'].startswith('au-unconfirmed') else re.sub(r'\W+', '-', (r.get('title') or '').lower()).strip('-')[:40]
    t = T.get(slug, {})
    read = r.get('read') or 'read'
    rec = {'id': 'cs-' + slug[:60], 'kind': 'case-study', 'title': r.get('title'), 'customer': r.get('customer'), 'location': r.get('location'),
           'url': r['url'] if r['url'] and not r['url'].startswith('au-unconfirmed') else None, 'also_at': r.get('also_at', []),
           'read': read, 'summary': r.get('summary', ''), 'year': t.get('year'),
           'tags': {'segment': split(t.get('seg')), 'space': split(t.get('space')), 'install': split(t.get('inst')), 'product': split(t.get('prod')),
                    'controls': split(t.get('ctl')) or ['controls-not-stated'], 'theme': split(t.get('theme')),
                    'market': [m for m in [market_of(r.get('location'), t.get('market') or (r.get('market') if r.get('market') in valid['market'] else None))] if m],
                    'proof': split(t.get('proof'))},
           'issues': r.get('issues', [])[:6], 'images': images_for([r['url']])}
    if read == 'search-snippet-only': rec['note'] = 'Known from a search listing only: the page could not be read'
    if not t: rec['note'] = (rec.get('note', '') + ' · Not yet tagged by hand').strip(' ·')
    check(rec); out.append(rec); seen_slug.add(slug)

# Gallery: one project per venue (or per title when no venue), tagged from the slug.
SEG = {'restaurant': 'restaurant', 'hotel': 'hotel-resort', 'residential': 'single-family', 'residence': 'single-family', 'marine': 'marine-yacht',
       'yacht': 'marine-yacht', 'cruise': 'marine-cruise', 'bar': 'bar-rooftop', 'pub': 'pub-club', 'golf': 'golf-country-club', 'workplace': 'workplace'}
PROD = [('marine', 'platinum-marine'), ('platinum-gas', 'platinum-gas'), ('platinum-electric', 'platinum-electric'), ('platinum', 'platinum-electric'),
        ('tungsten-gas', 'tungsten-gas'), ('tungsten-freestanding', 'tungsten-portable'), ('tungsten', 'tungsten-electric'), ('tungten', 'tungsten-electric'),
        ('eclipse-pendant', 'eclipse-pendant'), ('eclipse-pendent', 'eclipse-pendant'), ('eclipse-freestanding', 'eclipse-portable'), ('eclipse', 'eclipse-electric'), ('cobalt', 'cobalt')]
MOUNT = {'ceiling': 'ceiling-mounted', 'wall': 'wall-mounted', 'recessed': 'recessed', 'recess': 'recessed', 'flush': 'recessed', 'freestanding': 'freestanding', 'pendant': 'pendant', 'pole': 'pole-suspended'}
groups = defaultdict(list)
for r in INV:
    if r.get('kind') != 'gallery': continue
    slug = r['url'].rstrip('/').split('/')[-1]
    key = (r.get('venue') or r.get('location') or re.sub(r'-\d+$', '', slug)).lower()
    groups[key].append((slug, r))
for key, items in sorted(groups.items()):
    slugs = ' '.join(s for s, _ in items); r0 = items[0][1]
    seg = sorted({v for k, v in SEG.items() if k in slugs or k == (r0.get('segment') or '')})
    prods = sorted({next((v for k, v in PROD if k in sl), None) for sl, _ in items} - {None})
    inst = sorted({v for k, v in MOUNT.items() if k in slugs or k == (r0.get('mount') or '')})
    if 'lc-recess' in slugs: inst.append('low-clearance-recess')
    title = (r0.get('venue') or r0.get('location') or items[0][0].replace('-', ' ')).strip()
    rec = {'id': 'pj-' + re.sub(r'[^a-z0-9]+', '-', key)[:50].strip('-'), 'kind': 'project', 'title': title.title() if title.islower() else title,
           'customer': r0.get('venue'), 'location': r0.get('location'), 'url': r0['url'], 'read': 'gallery',
           'summary': f"{len(items)} gallery photo{'s' if len(items) > 1 else ''} on bromic.com, never written up as a case study.",
           'tags': {'segment': seg, 'space': [], 'install': inst, 'product': prods, 'controls': ['controls-not-stated'], 'theme': [],
                    'market': [m for m in [market_of(((r0.get('location') or '') + ' ' + slugs).replace('-', ' '))] if m], 'proof': ['photo-set'] if len(items) >= 5 else []},
           'images': images_for([i['url'] for _, i in items]), 'gallery': [i['url'] for _, i in items]}
    check(rec); out.append(rec)

# A gallery project that is already written up points at its case study (and does not count twice in the whitespace grid).
# Explicit, so a shared word never links the wrong project.
WRITTEN = {'pj-barangaroo-house': 'cs-barangaroo-house', 'pj-centrico': 'cs-welcoming-guests-with-the-warmth-of-mexican-hospitality',
 'pj-connecticut-usa': 'cs-private-residence-connecticut', 'pj-honey-hive': 'cs-enhancing-rooftop-bar-designs-with-cutting-edge-outdoor-heating-solutions',
 'pj-hyatt-dehradun': 'cs-eclipse-freestanding-and-tungsten-electric-at-hyatt-regency-dehradun', 'pj-la-pecora-bianca': 'cs-pecora-bianca',
 'pj-lady-lene': 'cs-m-y-lady-lene-superyacht', 'pj-new-jersey-usa': 'cs-from-gut-renovation-to-outdoor-bliss-how-bromics-tungsten-heaters-redefined-comfort-for-this-new-jersey-home',
 'pj-pangbourne-uk': 'cs-platinum-electric-heaters-in-pangbourne', 'pj-paris-bar': 'cs-london-restauranteur-incorporates-full-bromic-line-across-locations',
 'pj-paris-grill': 'cs-london-restauranteur-incorporates-full-bromic-line-across-locations', 'pj-pink-hills-hotel': 'cs-eclipse-electric-and-tungsten-electric-at-pink-hill-hotel',
 'pj-platinum-electric-lc-recess-kit-artivo-install': 'cs-platinum-electric-heaters-recessed-using-the-low-clearance-recess-kit',
 'pj-ritz-carlton-evrima': 'cs-platinum-electric-marine-heaters-aboard-ritz-carlton-yacht-collections-evrima', 'pj-sheraton-carlsbad': 'cs-the-sheraton-carlsbad-resort-spa',
 'pj-skansen-hotel': 'cs-hotel-skansen-elevates-outdoor-dining-with-the-bromic-smart-heat-freestanding-heaters', 'pj-the-oran-hotel': 'cs-embracing-earthy-elegance-at-oran-park-hotel',
 'pj-tony-s-bar': 'cs-tonys-di-napoli', 'pj-wrigley-mansion': 'cs-christophers-at-wrigley-mansion', 'pj-crystal-cruises': None}
byid = {r['id'][:63]: r for r in out}
for r in out:
    w = WRITTEN.get(r['id'])
    if not w: continue
    hit = next((c for c in out if c['id'].startswith(w[:60])), None)
    if hit: r['written_as'] = hit['id']; hit.setdefault('gallery_projects', []).append(r['id']); hit['images'] = sorted(set(hit['images']) | set(r['images']))

# Hand edits from marketing (data/case-study-tags.json: {id: {group: [tags]} or {field: value}}) win.
if os.path.exists(EXTRA):
    ed = json.load(open(EXTRA))
    for rec in out:
        for k, v in ed.get(rec['id'], {}).items():
            if k in rec['tags']: rec['tags'][k] = v
            else: rec[k] = v
        check(rec)

json.dump(out, open(os.path.join(ROOT, 'data', 'case-studies.json'), 'w'), indent=1, ensure_ascii=False)
from collections import Counter
print(len(out), 'records', dict(Counter(r['kind'] for r in out)), 'markets', dict(Counter(m for r in out for m in r['tags']['market'])))
print('untagged:', [r['id'] for r in out if r.get('note', '').endswith('Not yet tagged by hand')])
