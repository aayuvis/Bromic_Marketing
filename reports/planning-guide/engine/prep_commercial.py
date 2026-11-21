"""Images for the Commercial Edition of the visual planning guide: photos, sketch renderings, splits and product cut-outs.
Run from the repo root: python3 reports/planning-guide/engine/prep_commercial.py"""
import os, sys, cv2, numpy as np
from PIL import Image
sys.path.insert(0, 'reports/trends-2027/engine')
from sketch import sketch
OUT = 'reports/planning-guide/commercial/img'; TMP = OUT + '/_tmp'; os.makedirs(TMP, exist_ok=True)
src = lambda i: f'images/review/full/{i}.jpg' if i.startswith('ts2-') else f'images/library/{i}.webp'
def png(i):
    p = f'{TMP}/{i}.png'
    if not os.path.exists(p): Image.open(src(i)).convert('RGB').save(p)
    return p
def save_bgr(a, name): Image.fromarray(cv2.cvtColor(a, cv2.COLOR_BGR2RGB)).save(f'{OUT}/{name}.webp', quality=84)
PHOTOS = ['w-commercial-australia-sydney-manly-wharf-15', 'w-smoque-n-bones-tungsten-electric-1', 'l-016-131', 'l-013-111', 'w-the-ivy-london-tungsten-electric',
          'w-bromic-sep18th-3-1', 'w-bromic-sep18th-14', 'w-crown-towers-perth-bromic-tungsten-electric', 'l-013-107', 'l-013-100', 'l-007-034',
          'w-bromic-eclipse-portable-hotel-skansen-07', 'w-bromic-sep18th-28', 'l-019-164', 'w-eclipse-electric-w-bromic-heating-app', 't-009-025',
          'w-kion-sui-madrid-spain-tungsten-electric-5', 'w-dsc000071', 'w-eclipse-1200pole-industrial-1', 'l-013-102', 'w-boardwalk-edits-49',
          'w-bromictungstenelectic-white', 'w-bromic-ambiente-sedona-17', 'w-california-laprovenance-platinumgas-01', 'w-bromic-shoot-may-11-2023-39',
          'w-platinum-gas-sheraton-carlsbad-ca-usa', 'w-usa-san-diego-decoy-lakehouse-hotel-tungsten']
CUTS = ['w-tungelec-stacked', 'w-platinum-black', 'w-eclipse-electric-twinpole', 'w-eclipse-portable', 'l-005-025', 'w-platinum-gas-500',
        'w-affinity-dimmer-5ch', 'w-manual-1ch-indoor-switch-image', 'w-expansion-board']
SKETCH = ['w-bromic-sep18th-9-1', 'w-tungsten-gas-fayetteville-ny-restaurant']
SPLIT = ['l-013-104', 'l-005-024']
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
import shutil; shutil.rmtree(TMP); print('ok', len(os.listdir(OUT)))
