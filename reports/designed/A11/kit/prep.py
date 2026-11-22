"""Copy Bromic photos into a document's img/ folder as JPEG (long side <= 2000 px, quality 82).
Usage: python3 prep.py <out_dir> <name>=<repo-relative source>[@x0,y0,x1,y1] ...
An optional crop is given in fractions of the source (0-1)."""
import os, sys
from PIL import Image
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../..'))
out = sys.argv[1]
os.makedirs(out, exist_ok=True)
for arg in sys.argv[2:]:
    name, src = arg.split('=', 1)
    crop = None
    if '@' in src:
        src, c = src.split('@', 1)
        crop = [float(v) for v in c.split(',')]
    src = os.path.join(ROOT, src)
    dst = os.path.join(out, name + '.jpg')
    im = Image.open(src)
    if im.mode in ('RGBA', 'LA', 'P'):
        im = im.convert('RGBA'); bg = Image.new('RGB', im.size, (255, 255, 255)); bg.paste(im, mask=im.split()[-1]); im = bg
    else:
        im = im.convert('RGB')
    if crop:
        w, h = im.size
        im = im.crop((int(crop[0] * w), int(crop[1] * h), int(crop[2] * w), int(crop[3] * h)))
    if max(im.size) > 2000:
        im.thumbnail((2000, 2000), Image.LANCZOS)
    im.save(dst, 'JPEG', quality=82, optimize=True)
