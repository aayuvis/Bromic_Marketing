"""Images for the Professional Edition of the visual planning guide: photos, sketch renderings, sketch-to-photo splits,
product cut-outs and the heat-bloom photo. Run from the repo root: python3 reports/planning-guide/engine/prep_pro.py pro"""
import os, sys, cv2, numpy as np
from PIL import Image, ImageDraw, ImageFilter
sys.path.insert(0, 'reports/trends-2027/engine')
from sketch import sketch
ED = sys.argv[1] if len(sys.argv) > 1 else 'pro'
OUT = f'reports/planning-guide/{ED}/img'; TMP = OUT + '/_tmp'; os.makedirs(TMP, exist_ok=True)
src = lambda i: f'images/review/full/{i}.jpg' if i.startswith('ts2-') else f'images/library/{i}.webp'
def png(i):
    p = f'{TMP}/{i}.png'
    if not os.path.exists(p): Image.open(src(i)).convert('RGB').save(p)
    return p
def save_bgr(a, name): Image.fromarray(cv2.cvtColor(a, cv2.COLOR_BGR2RGB)).save(f'{OUT}/{name}.webp', quality=84)

PHOTOS = ['l-010-075', 'w-bromic-shoot-may-11-2023-54', 'w-crown-towers-perth-bromic-tungsten-electric', 'w-connecticut-privateresidence-tungstenelectri-3',
          'w-e-tungsten-1', 'w-dsc05545-courtney-saib', 'w-connecticut-privateresidence-tungstenelectri', 'l-005-022', 'w-bromic-shoot-may-11-2023-43',
          'l-013-106', 'w-bromic-sep18th-14', 'w-bromic-ambiente-sedona-16', 'l-007-034', 'l-012-093', 'w-connecticut-private-res-tungsten-electric-1',
          't-009-025', 'w-bromic-tungsten-electric-black-recessed', 'w-dsc05737-courtney-saib', 'w-240619-yorba-linda-ca-dc-64',
          'w-tungsten-electric-white-recessed', 'w-2014-01-29-17-10-54', 'w-bromic-pg-residential-hr', 'l-010-076', 't-006-016', 'w-delmonico-08']
SKETCH = ['w-delmonico-08', 'l-010-075']
SPLIT = ['w-dsc05656-courtney-saib', 'w-kion-sui-madrid-spain-tungsten-electric-5']
CUTS = ['w-lcrecesskit', 'w-tungelec-stacked', 'w-eclipse-electric-twinpole', 'w-eclipse-portable', 'w-platinum-gas-500', 'l-005-025',
        'w-affinity-dimmer-2ch-2', 'w-affinity-5ch-onoff', 'w-expansion-board', 'w-manual-1ch-indoor-switch-image', 't2-single-post-black',
        't2-low-clearance-recess', 'w-tungsten-electric-recess-kit-black', 'w-platinum-black', 'w-cobalt-electric-product']
for i in PHOTOS:
    if not os.path.exists(f'{OUT}/{i}.webp'):
        im = Image.open(src(i)).convert('RGB'); im.thumbnail((2000, 2000)); im.save(f'{OUT}/{i}.webp', quality=86)
for i in CUTS:
    if not os.path.exists(f'{OUT}/{i}.webp'):
        im = Image.open(src(i)).convert('RGB'); im.thumbnail((900, 900)); im.save(f'{OUT}/{i}.webp', quality=88)
for i in SKETCH:
    if not os.path.exists(f'{OUT}/{i}-sketch.webp'):
        o = f'{TMP}/{i}-sk.jpg'; sketch(png(i), o); save_bgr(cv2.imread(o), f'{i}-sketch')
for i in SPLIT:
    if os.path.exists(f'{OUT}/{i}-split.webp'): continue
    o = f'{TMP}/{i}-sk.jpg'; sketch(png(i), o)
    sk = cv2.imread(o).astype(np.float32); ph = cv2.imread(png(i)).astype(np.float32); h, w = ph.shape[:2]
    rng = np.random.default_rng(7); ys = np.arange(h)
    edge = (0.46 * w + (ys / h - 0.5) * 0.10 * w + np.convolve(rng.normal(0, 9, h), np.ones(25) / 25, 'same')).astype(np.float32)
    xs = np.arange(w)[None, :].astype(np.float32); m = np.clip((xs - edge[:, None]) / 18 + 0.5, 0, 1)
    out = sk * (1 - m[..., None]) + ph * m[..., None]
    line = (np.abs(xs - edge[:, None]) < 1.6).astype(np.float32) * 0.6
    out = out * (1 - line[..., None]) + np.array([35, 65, 239], np.float32) * line[..., None]
    save_bgr(out.astype(np.uint8), f'{i}-split')

# Heat bloom (same illustration as the Homeowner edition): a soft warm cone from each Eclipse pendant onto the table
BID = 'w-eclipse-electric-24twin-pole-residential-sce'
if not os.path.exists(f'{OUT}/{BID}-bloom.webp'):
    hb = f'reports/planning-guide/homeowner/img/{BID}-bloom.webp'
    Image.open(hb).save(f'{OUT}/{BID}-bloom.webp', quality=88)
import shutil; shutil.rmtree(TMP); print('ok', len(os.listdir(OUT)))
