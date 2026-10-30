"""Venue and product images for the five-year cost tool, inlined so the page stays self-contained (embeddable, no requests).
Reads the family and controls image ids from config.json, takes the library's 1600px webp, and writes images.json with
small webp data URIs (360px). Run after changing an image id:  python3 tools/A20-tco/make-images.py"""
import base64, io, json, os
from PIL import Image
D = os.path.dirname(os.path.abspath(__file__)); LIB = os.path.join(D, '..', '..', 'images', 'library')
c = json.load(open(os.path.join(D, 'config.json')))
ids = [v['image'] for v in c['venues']] + sorted(set(c['product_images'].values()))
SIZE = {i: (420, 280) for i in [v['image'] for v in c['venues']]}
out = {}
for i in ids:
    im = Image.open(os.path.join(LIB, i + '.webp')).convert('RGB'); im.thumbnail(SIZE.get(i, (360, 360)))
    b = io.BytesIO(); im.save(b, 'WEBP', quality=70); out[i] = 'data:image/webp;base64,' + base64.b64encode(b.getvalue()).decode()
json.dump(out, open(os.path.join(D, 'images.json'), 'w'))
print(len(out), 'images', sum(len(v) for v in out.values()) // 1024, 'KB')
