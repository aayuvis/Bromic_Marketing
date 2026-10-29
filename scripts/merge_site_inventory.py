"""Merge the bromic.com page reads (one JSON array per section) into data/site-inventory.json.

  python3 scripts/merge_site_inventory.py <dir with blog-a.json, blog-b.json, pages.json, products.json, cases.json, gallery.json>

Each record: url, kind, title, summary (our words), headings, question_answered, audience, stage, products, controls_mentioned,
stats, product_facts, people_quoted, cta, gated, downloads, issues, images [{src, alt}] (+ case-study and gallery fields).
Pages were read with a fetch tool that summarises, so verbatim fields (stats, product_facts) are leads to check against the
live page, never sources in their own right. read_on records the date of the read.
"""
import json, os, sys

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
OUT = os.path.join(ROOT, 'data', 'site-inventory.json')
src = sys.argv[1]
recs = {}
for name in ['pages', 'products', 'cases', 'blog-a', 'blog-b', 'gallery']:
    p = os.path.join(src, name + '.json')
    if not os.path.exists(p): continue
    for r in json.load(open(p)):
        if not r.get('url'): continue
        if name == 'gallery':
            r = {'url': r['url'], 'kind': 'gallery', 'title': r.get('title') or r['slug'].replace('-', ' '),
                 'products': [r['product']] if r.get('product') else [], 'finish': r.get('finish'), 'mount': r.get('mount'),
                 'segment': r.get('segment'), 'venue': r.get('venue'), 'location': r.get('location'),
                 'images': [{'src': s, 'alt': None} for s in r.get('images', [])]}
        r.setdefault('read_on', '2026-10-29')
        u = r['url'].rstrip('/') + '/'
        recs[u] = {**recs.get(u, {}), **r, 'url': u}
# Australia: www.bromic.com.au refuses every fetch (403), so AU-only case studies and press are known from search listings
# (read = 'search-snippet-only', words paraphrased by the search tool) or, where the US site hosts the same study, read there.
au = os.path.join(src, 'au-cases.json')
if os.path.exists(au):
    for r in json.load(open(au)):
        if r.get('read') in ('us-mirror',) and r.get('us_url'):
            u = r['us_url'].rstrip('/') + '/'
            if u in recs: recs[u].setdefault('also_at', []).append(r['url'])
            continue
        if not r.get('url') and not r.get('title'): continue
        u = (r.get('url') or 'au-unconfirmed:' + r['title']).rstrip('/') + '/'
        if r.get('kind') == 'case-study' and u.endswith('/case-studies/'): continue
        recs[u] = {'url': u, 'kind': 'press' if r.get('kind') in ('press', 'testimonial') else 'case-study', 'market': r.get('market', 'AU'),
                   'title': r.get('title'), 'summary': r.get('summary', ''), 'customer': r.get('customer'), 'location': r.get('location'),
                   'segment': r.get('segment'), 'products': r.get('products') or [], 'read': r.get('read'),
                   'issues': ['Not read: www.bromic.com.au blocks automated reading; known from a search listing only'] if r.get('read') == 'search-snippet-only' else [],
                   'audience': ['COM'] if r.get('segment') in ('hotel', 'restaurant', 'hospitality', 'club') else [], 'stage': ['IN'], 'images': [], 'read_on': '2026-10-29'}
def market(r):
    loc = (r.get('location') or '').lower()
    if r.get('market'): return r['market']
    if any(k in loc for k in ('australia', 'sydney', 'brisbane', 'melbourne', 'perth', 'nsw', 'victoria')): return 'AU'
    if any(k in loc for k in ('usa', 'california', 'new york', 'texas', 'arizona', 'tennessee', 'new jersey', 'connecticut', 'd.c.')): return 'US'
    if any(k in loc for k in ('united kingdom', 'london', 'germany', 'sweden', 'spain')): return 'EU/UK'
    return 'Other' if loc else None
for r in recs.values():
    if r.get('kind') in ('case-study', 'press'): r['market'] = market(r)
order = {'page': 0, 'landing': 1, 'product': 2, 'case-study': 3, 'blog': 4, 'podcast': 5, 'press': 6, 'gallery': 7}
out = sorted(recs.values(), key=lambda r: (order.get(r.get('kind'), 9), r['url']))
json.dump(out, open(OUT, 'w'), indent=1, ensure_ascii=False)
from collections import Counter
print(len(out), 'pages', dict(Counter(r.get('kind') for r in out)), '·', sum(len(r.get('images', [])) for r in out), 'image refs')
