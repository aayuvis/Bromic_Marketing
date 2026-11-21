"""Prepares the take-home flyer's assets: Bromic photos as JPEG (<= 2000 px, q82) and the two QR codes as SVG.
Run by build.js; needs Pillow and segno (pip install segno)."""
import json, os, sys
from PIL import Image
import segno

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, '../../..'))
cfg = json.load(open(os.path.join(HERE, 'flyer.json')))
out = os.path.join(HERE, 'img')
os.makedirs(out, exist_ok=True)

for name, src in cfg['images'].items():
    im = Image.open(os.path.join(ROOT, src)).convert('RGB')
    im.thumbnail((2000, 2000), Image.LANCZOS)
    im.save(os.path.join(out, f'{name}.jpg'), 'JPEG', quality=82, optimize=True, progressive=True)

for q in cfg['qr']:
    # error correction M, quiet zone of 4 modules (the QR standard's minimum)
    code = segno.make(q['url'], error='m', micro=False)
    code.save(os.path.join(out, f"qr-{q['id']}.svg"), scale=1, border=4, dark='#231F20', light='#FFFFFF', xmldecl=False, svgns=True)
    code.save(os.path.join(out, f"qr-{q['id']}.png"), scale=12, border=4)
print('prep: images', len(cfg['images']), 'qr', len(cfg['qr']))
