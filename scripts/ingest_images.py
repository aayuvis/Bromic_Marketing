"""Ingest images dropped in images/inbox/ into images/library/ (webp 1600px + 520px thumb) and manifest.json.
Tags come from the subfolder name; edit manifest.json afterwards for alt text, audiences and rights."""
import hashlib, json, os, re, sys
from PIL import Image, ImageOps
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
INBOX = os.path.join(ROOT, 'images', 'inbox'); LIB = os.path.join(ROOT, 'images', 'library')
MP = os.path.join(LIB, 'manifest.json'); DRY = '--dry-run' in sys.argv
PRODUCTS = [('tungsten coastal', 'Tungsten Coastal'), ('tungsten select', 'Tungsten Select'), ('tungsten', 'Tungsten'),
            ('platinum', 'Platinum Electric'), ('eclipse', 'Eclipse Electric'), ('affinity', 'Affinity Smart-Heat Controls'),
            ('cobalt', 'Cobalt Electric'), ('control', 'Affinity Smart-Heat Controls')]
man = json.load(open(MP)); seen = {m.get('sha1') for m in man}; ids = {m['id'] for m in man}; added = 0
for dp, _, fs in os.walk(INBOX):
    for f in sorted(fs):
        if not re.search(r'\.(jpe?g|png|webp|tiff?)$', f, re.I): continue
        src = os.path.join(dp, f); sha = hashlib.sha1(open(src, 'rb').read()).hexdigest()
        if sha in seen: continue
        rel = os.path.relpath(dp, INBOX); folder = '' if rel == '.' else rel.replace(os.sep, ' ')
        hay = (folder + ' ' + f).lower().replace('-', ' ').replace('_', ' ')
        prod = next((n for k, n in PRODUCTS if k in hay), 'Unsorted')
        base = re.sub(r'[^a-z0-9]+', '-', os.path.splitext(f)[0].lower()).strip('-')[:40]
        iid = 'b-' + base; n = 2
        while iid in ids: iid = f'b-{base}-{n}'; n += 1
        print(('would add ' if DRY else 'add ') + iid, '←', os.path.relpath(src, ROOT), '·', prod)
        if DRY: continue
        im = ImageOps.exif_transpose(Image.open(src)).convert('RGB'); w, h = im.size
        big = im.copy(); big.thumbnail((1600, 1600)); big.save(os.path.join(LIB, iid + '.webp'), quality=80)
        th = im.copy(); th.thumbnail((520, 520)); th.save(os.path.join(LIB, iid + '-t.webp'), quality=72)
        man.append({'id': iid, 'file': f'images/library/{iid}.webp', 'thumb': f'images/library/{iid}-t.webp', 'w': big.size[0], 'h': big.size[1],
                    'orientation': 'landscape' if w > h * 1.15 else 'portrait' if h > w * 1.15 else 'square', 'product': prod,
                    'setting': folder or '[[VERIFY: setting]]', 'audiences': ['ALL'], 'alt': '[[VERIFY: alt text]]',
                    'source': 'Bromic (inbox)', 'source_file': os.path.relpath(src, ROOT), 'page': 0,
                    'rights': '[[VERIFY: usage rights — Megan Spies]]', 'status': 'needs-tagging', 'sha1': sha})
        ids.add(iid); seen.add(sha); added += 1
if not DRY: json.dump(man, open(MP, 'w'), indent=1)
print(f'{added} added · library {len(man)}')
