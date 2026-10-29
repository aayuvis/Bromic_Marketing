"""Images from bromic.com → images/library/ (owner rule, 29 Oct 2026: study bromic.com imagery before any generation).

Pages on bromic.com sit behind a Cloudflare challenge, so the page inventory is read with a fetch tool into
data/site-inventory.json. The image FILES (wp-content/uploads on www.bromic.com and pim.bromic.com) download
directly. This script never touches the pages.

  python3 scripts/bromic_site_images.py fetch    # download every image the inventory names → images/_raw/bromic-com/ (gitignored)
  python3 scripts/bromic_site_images.py sheets   # contact sheets of what was kept, to LOOK at before ingest
  python3 scripts/bromic_site_images.py ingest   # kept photos → images/library/ (1600px webp + 520px thumb) + manifest.json

Every library entry keeps source_url (the file) and page_url (where it is used), and rights stay [[VERIFY]] until
Megan Spies confirms — several site photos carry a photographer's credit.
"""
import hashlib, json, os, re, sys
from urllib.parse import urlsplit, unquote
from PIL import Image, ImageOps, ImageDraw

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
INV = os.path.join(ROOT, 'data', 'site-inventory.json')
RAW = os.path.join(ROOT, 'images', '_raw', 'bromic-com')
IDX = os.path.join(RAW, 'index.json')
LIB = os.path.join(ROOT, 'images', 'library'); MP = os.path.join(LIB, 'manifest.json')

SIZE = re.compile(r'-(\d{2,4})x(\d{2,4})(?=\.\w+$)')
SKIP_NAME = re.compile(r'logo|badge|spotify|apple-podcast|app_store|google-play|5star|as_seen_on|listen-now|button|'
                       r'screenshot|-gif|\.gif$|\.svg|ip-rating|max-output|max-heat-area|voltage|favicon|icon|'
                       r'^(aa|gg|map|muffins|slippers)\.png$|quote', re.I)
BRANDS = {'marriott', 'mgm-grand', 'sheraton', 'slefridges-co', 'tommy-bahama', 'westfield', 'caesars-palace',
          'crown-casino', 'hilton-international'}  # client-logo tiles on the hotels page
PRODUCTS = [('platinum-electric-marine', 'Platinum Electric Marine'), ('marine', 'Platinum Electric Marine'),
            ('tungsten-coastal', 'Tungsten Coastal'), ('tungsten-select', 'Tungsten Select'),
            ('tungsten-gas', 'Tungsten Gas'), ('tungsten-portable', 'Tungsten Portable'), ('tung-port', 'Tungsten Portable'),
            ('tungsten-freestanding', 'Tungsten Portable'), ('te-portable', 'Tungsten Portable'),
            ('tungsten', 'Tungsten Electric'), ('platinum-gas', 'Platinum Gas'), ('platinum', 'Platinum Electric'),
            ('platnium', 'Platinum Electric'), ('eclipse-pendant', 'Eclipse Pendant'),
            ('eclipse-portable', 'Eclipse Portable'), ('eclipse-freestanding', 'Eclipse Portable'),
            ('eclipse', 'Eclipse Electric'), ('eclispe', 'Eclipse Electric'), ('ecslipse', 'Eclipse Electric'),
            ('cobalt', 'Cobalt Electric'), ('affinity', 'Affinity Smart-Heat Controls'), ('dimmer', 'Affinity Smart-Heat Controls'),
            ('onoff', 'Affinity Smart-Heat Controls'), ('wall-switch', 'Affinity Smart-Heat Controls'),
            ('expansion', 'Affinity Smart-Heat Controls'), ('heating-app', 'Affinity Smart-Heat Controls'), ('-ht-app', 'Affinity Smart-Heat Controls')]
AI_EDIT = re.compile(r'ai-?expanded|letzai|render', re.I)  # AI-extended or rendered on the site itself: flag, never pass as a photo


def load(p, d):
    try: return json.load(open(p))
    except FileNotFoundError: return d


def family(url):
    """One key per photo, whatever size or host WordPress serves it at."""
    name = unquote(urlsplit(url).path.rsplit('/', 1)[-1]).lower()
    name = SIZE.sub('', name).replace('-scaled', '')
    name = re.sub(r'-e\d{10,}', '', name)  # WordPress edit suffix
    return re.sub(r'\.(jpe?g|png|webp)$', '', name)


def rank(url):
    m = SIZE.search(url); w = int(m.group(1)) if m else 0
    if '-scaled' in url: return 3
    if w >= 1500: return 4      # ~1600 web copy: big enough, light to fetch
    if not m: return 2           # original upload: often 5–10 MB
    return 1 if w >= 1000 else 0


def guess_product(text):
    t = text.lower().replace('_', '-').replace(' ', '-')
    return next((n for k, n in PRODUCTS if k in t), None)


def collect():
    """Every image the inventory names, grouped into photo families, each with the pages that use it."""
    inv = load(INV, [])
    fams = {}
    for page in inv:
        for im in page.get('images', []):
            src = (im.get('src') or '').strip().replace('http://', 'https://')
            if not re.match(r'https://(www|pim)\.bromic\.com/wp-content/uploads/', src): continue
            if not re.search(r'\.(jpe?g|png|webp)(\?|$)', src, re.I): continue
            f = fams.setdefault(family(src), {'srcs': set(), 'pages': [], 'alts': set(), 'products': set()})
            f['srcs'].add(src.split('?')[0])
            if page['url'] not in [p['url'] for p in f['pages']]:
                f['pages'].append({'url': page['url'], 'kind': page.get('kind'), 'title': page.get('title')})
            if im.get('alt'): f['alts'].add(im['alt'].strip())
            for p in page.get('products', []) or []: f['products'].add(p)
            if page.get('product'): f['products'].add(page['product'])
    return fams


def get(url):
    """curl, not urllib: curl honours the environment's proxy and CA bundle reliably."""
    import subprocess
    r = subprocess.run(['curl', '-sS', '-f', '-L', '--max-time', '90', '--retry', '2', url], capture_output=True)
    return r.stdout if r.returncode == 0 and r.stdout else None


def dhash(im, n=8):
    g = im.convert('L').resize((n + 1, n))
    px = list(g.getdata()); bits = 0
    for y in range(n):
        for x in range(n): bits = bits << 1 | (px[y * (n + 1) + x] > px[y * (n + 1) + x + 1])
    return bits


def kind_of(fam, im):
    k = fam.lower()
    if re.search(r'heat-?(plan|map)', k): return 'heat-plan'
    if re.search(r'cover|catalog|lookbook|trends-2026|guide|podcast|episode|thumbnail|landing-page|header', k): return 'cover'
    if im.mode in ('RGBA', 'LA', 'P'):
        a = im.convert('RGBA').getchannel('A')
        if a.getextrema()[0] < 250: return 'cutout'  # transparent background: product shot
    return 'photo'


def fetch():
    os.makedirs(RAW, exist_ok=True)
    idx = load(IDX, {}); fams = collect(); seen_hash = {v['dhash']: k for k, v in idx.items() if v.get('dhash') is not None}
    print(f'{len(fams)} photo families in the inventory')
    for n, (fam, f) in enumerate(sorted(fams.items()), 1):
        name = fam.rsplit('/', 1)[-1]
        if name in BRANDS or SKIP_NAME.search(name):
            idx[fam] = {'skip': 'logo/icon/badge/screenshot by name', 'pages': f['pages']}; continue
        if fam in idx and idx[fam].get('file'): idx[fam]['pages'] = f['pages']; continue
        data = None
        for src in sorted(f['srcs'], key=rank, reverse=True):
            data = get(src)
            if data: break
        if not data:
            idx[fam] = {'skip': 'download failed (404)', 'tried': sorted(f['srcs']), 'pages': f['pages']}; continue
        ext = os.path.splitext(urlsplit(src).path)[1].lower() or '.jpg'
        path = os.path.join(RAW, name[:80] + ext); open(path, 'wb').write(data)
        try: im = ImageOps.exif_transpose(Image.open(path)); im.load()
        except Exception as e:
            idx[fam] = {'skip': f'not an image ({e})', 'pages': f['pages']}; os.remove(path); continue
        w, h = im.size; dh = dhash(im)
        rec = {'file': os.path.relpath(path, ROOT), 'source_url': src, 'w': w, 'h': h, 'bytes': len(data),
               'sha1': hashlib.sha1(data).hexdigest(), 'dhash': dh, 'kind': kind_of(fam, im),
               'product': guess_product(fam) or (sorted(f['products'])[0] if len(f['products']) == 1 else None),
               'alts': sorted(f['alts']), 'pages': f['pages'], 'ai_edited_on_site': bool(AI_EDIT.search(fam))}
        if max(w, h) < 600: rec['skip'] = f'too small ({w}x{h})'
        dup = next((k for hh, k in seen_hash.items() if bin(hh ^ dh).count('1') <= 4 and k != fam), None)
        if dup and not rec.get('skip'): rec['skip'] = f'duplicate of {dup}'
        if not rec.get('skip'): seen_hash[dh] = fam
        idx[fam] = rec
        if n % 25 == 0: json.dump(idx, open(IDX, 'w'), indent=1); print(n, 'done')
    json.dump(idx, open(IDX, 'w'), indent=1)
    kept = [k for k, v in idx.items() if v.get('file') and not v.get('skip')]
    from collections import Counter
    print(f'kept {len(kept)} · skipped {len(idx) - len(kept)}', Counter(idx[k]["kind"] for k in kept),
          Counter(v['skip'].split(' (')[0] for v in idx.values() if v.get('skip')))


def sheets():
    idx = load(IDX, {}); out = os.path.join(RAW, '_sheets'); os.makedirs(out, exist_ok=True)
    kept = sorted(k for k, v in idx.items() if v.get('file') and not v.get('skip'))
    for s in range(0, len(kept), 30):
        sheet = Image.new('RGB', (6 * 260, 5 * 230), 'white'); d = ImageDraw.Draw(sheet)
        for i, k in enumerate(kept[s:s + 30]):
            im = Image.open(os.path.join(ROOT, idx[k]['file'])).convert('RGB'); im.thumbnail((250, 190))
            x, y = (i % 6) * 260 + 5, (i // 6) * 230 + 5
            sheet.paste(im, (x, y)); d.text((x, y + 195), f'{s + i:03d} {k[:34]}', fill='black')
        sheet.save(os.path.join(out, f'sheet-{s // 30:02d}.jpg'), quality=80)
    print(f'{(len(kept) + 29) // 30} sheets in {os.path.relpath(out, ROOT)}')


def ingest():
    idx = load(IDX, {}); man = json.load(open(MP)); ids = {m['id'] for m in man}
    by_url = {m.get('source_url'): m for m in man if m.get('source_url')}
    added = 0
    for fam, v in sorted(idx.items()):
        if not v.get('file') or v.get('skip') or v['kind'] == 'cover': continue
        if v.get('review') == 'reject': continue
        base = re.sub(r'[^a-z0-9]+', '-', fam.lower()).strip('-')[:44]; iid = 'w-' + base
        if v['source_url'] in by_url: continue
        n = 2
        while iid in ids: iid = f'w-{base}-{n}'; n += 1
        im = ImageOps.exif_transpose(Image.open(os.path.join(ROOT, v['file']))).convert('RGB'); w, h = im.size
        big = im.copy(); big.thumbnail((1600, 1600)); big.save(os.path.join(LIB, iid + '.webp'), quality=78)
        th = im.copy(); th.thumbnail((520, 520)); th.save(os.path.join(LIB, iid + '-t.webp'), quality=70)
        page = v['pages'][0] if v['pages'] else {}
        notes = []
        if v.get('ai_edited_on_site'): notes.append('AI-extended or rendered on bromic.com, not a plain photo: check before use')
        if v.get('note'): notes.append(v['note'])
        man.append({'id': iid, 'file': f'images/library/{iid}.webp', 'thumb': f'images/library/{iid}-t.webp',
                    'w': big.size[0], 'h': big.size[1],
                    'orientation': 'landscape' if w > h * 1.15 else 'portrait' if h > w * 1.15 else 'square',
                    'product': v.get('product') or 'Unsorted', 'setting': v.get('setting') or '[[VERIFY: setting]]',
                    'audiences': v.get('audiences') or ['ALL'],
                    'alt': v.get('alt') or (v['alts'][0] if v['alts'] else '[[VERIFY: alt text]]'),
                    'source': 'bromic.com', 'source_file': v['source_url'], 'source_url': v['source_url'],
                    'page_url': page.get('url'), 'used_on': [p['url'] for p in v['pages']], 'page': 0,
                    'kind': v['kind'],
                    'rights': 'Bromic-published (bromic.com); [[VERIFY: photographer credit and usage rights — Megan Spies]]',
                    'status': 'site-source', **({'notes': '; '.join(notes)} if notes else {})})
        ids.add(iid); added += 1
    json.dump(man, open(MP, 'w'), indent=1)
    print(f'{added} added · library {len(man)}')


if __name__ == '__main__':
    {'fetch': fetch, 'sheets': sheets, 'ingest': ingest}[sys.argv[1] if len(sys.argv) > 1 else 'fetch']()
