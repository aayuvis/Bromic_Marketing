"""Downscale every image the brochure uses to <=2000 px (long edge), JPEG q82, into ./img/.
Run by build.js; safe to run on its own: python3 reports/retail/portfolio-applications/prep.py"""
import json, os, sys
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, '..', '..', '..'))
OUT = os.path.join(HERE, 'img')
os.makedirs(OUT, exist_ok=True)

# name -> (source path relative to the repo, long edge)
IMAGES = json.loads(sys.argv[1]) if len(sys.argv) > 1 else {}

STAMP = os.path.join(OUT, '.sources.json')
done = json.load(open(STAMP)) if os.path.exists(STAMP) else {}

for name, (src, edge) in IMAGES.items():
    dst = os.path.join(OUT, name + '.jpg')
    path = os.path.join(ROOT, src)
    key = f'{src}@{edge}'
    if os.path.exists(dst) and done.get(name) == key and os.path.getmtime(dst) >= os.path.getmtime(path):
        continue
    im = Image.open(path)
    if im.mode in ('RGBA', 'LA', 'P'):
        im = im.convert('RGBA')
        bg = Image.new('RGBA', im.size, (255, 255, 255, 255))
        bg.alpha_composite(im)
        im = bg
    im = im.convert('RGB')
    im.thumbnail((edge, edge), Image.LANCZOS)
    im.save(dst, 'JPEG', quality=82, optimize=True, progressive=True)
    print('img', name, im.size)
    done[name] = key

for name in [n for n in done if n not in IMAGES]:
    done.pop(name)
    if os.path.exists(os.path.join(OUT, name + '.jpg')):
        os.remove(os.path.join(OUT, name + '.jpg'))
json.dump(done, open(STAMP, 'w'), indent=1, sort_keys=True)
