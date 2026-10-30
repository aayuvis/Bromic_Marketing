"""Product images for the sizing calculator, inlined so the page stays self-contained (embeddable, no requests).
Reads the family and controls image ids from config.json, takes the library's 1600px webp, and writes images.json with
small webp data URIs (360px). Run after changing an image id:  python3 tools/A03-sizing/make-images.py"""
import base64, io, json, os
from PIL import Image
D = os.path.dirname(os.path.abspath(__file__)); LIB = os.path.join(D, '..', '..', 'images', 'library')
c = json.load(open(os.path.join(D, 'config.json')))
ids = [f['image'] for f in c['families'] if f['image']] + list(c['controls_images'].values())
out = {}
for i in ids:
    im = Image.open(os.path.join(LIB, i + '.webp')).convert('RGB'); im.thumbnail((360, 360))
    b = io.BytesIO(); im.save(b, 'WEBP', quality=78); out[i] = 'data:image/webp;base64,' + base64.b64encode(b.getvalue()).decode()
json.dump(out, open(os.path.join(D, 'images.json'), 'w'))
print(len(out), 'images', sum(len(v) for v in out.values()) // 1024, 'KB')
