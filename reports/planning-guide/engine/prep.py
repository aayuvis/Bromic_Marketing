"""Images for the visual planning guide: photos, sketch renderings, sketch-to-photo splits, product cut-outs and the heat-bloom photo.
Run from the repo root: python3 reports/planning-guide/engine/prep.py homeowner"""
import os, sys, cv2, numpy as np
from PIL import Image, ImageDraw, ImageFilter
sys.path.insert(0, 'reports/trends-2027/engine')
from sketch import sketch
ED = sys.argv[1]
OUT = f'reports/planning-guide/{ED}/img'; TMP = OUT + '/_tmp'; os.makedirs(TMP, exist_ok=True)
src = lambda i: f'images/review/full/{i}.jpg' if i.startswith('ts2-') else f'images/library/{i}.webp'
def png(i):
    p = f'{TMP}/{i}.png'
    if not os.path.exists(p): Image.open(src(i)).convert('RGB').save(p)
    return p
def save_bgr(a, name): Image.fromarray(cv2.cvtColor(a, cv2.COLOR_BGR2RGB)).save(f'{OUT}/{name}.webp', quality=84)
PHOTOS = ['l-010-071', 'l-010-067', 'l-002-004', 'w-au', 'l-012-093', 'l-007-034', 'w-bromic-eclipse-portable-hotel-skansen-07', 'l-016-131',
          'w-connecticut-privateresidence-tungstenelectri-2', 'l-006-028', 'w-bromic-tungsten-electric-black-recessed', 'w-bromictungstenelectic-white',
          'w-eclipse-pendant-uk-residential-2', 'w-eclipse-portable-residential', 'w-bromiceclipseheater', 'w-apex-building-plat-500-residential',
          'w-connecticut-privateresidence-tungstenelectri', 'w-eclipse-electric-w-bromic-heating-app', 'w-bromic-home-automation-hero',
          'w-bromic-tungsten-electric-residential', 'l-013-100', 'w-dsc05737-courtney-saib', 'w-dsc07397-1', 'l-015-125',
          'w-240619-yorba-linda-ca-dc-64', 'w-bromic-pg-residential-hr', 'w-bromic-shoot-may-11-2023-39', 't-009-025']
SKETCH = ['l-013-102', 'w-dsc05737-courtney-saib', 'w-delmonico-08', 'l-019-163', 'w-boardwalk-edits-49', 'l-013-100']
SPLIT = ['l-010-071', 'l-010-067']
CUTS = ['t2-low-clearance-recess', 'w-lcrecesskit', 'w-tungelec-stacked', 'w-eclipse-electric-twinpole', 'w-eclipse-portable', 'w-tung-port', 'w-platinum-gas-500',
        'w-tungsten-gas-500', 'l-005-025', 'w-affinity-dimmer-2ch-2', 'w-manual-1ch-indoor-switch-image', 'w-platinum-black']
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

# Heat bloom: a soft warm cone from each Eclipse pendant down onto the dining table (an illustration, not a measured pattern)
BID = 'w-eclipse-electric-24twin-pole-residential-sce'
if not os.path.exists(f'{OUT}/{BID}-bloom.webp'):
    im = Image.open(src(BID)).convert('RGB'); W, H = im.size
    base = np.asarray(im).astype(np.float32) / 255
    def cone(top_l, top_r, bot_l, bot_r, y0, y1, a0, a1, blur):
        m = Image.new('L', (W, H), 0); ImageDraw.Draw(m).polygon([top_l, top_r, bot_r, bot_l], fill=255)
        m = np.asarray(m.filter(ImageFilter.GaussianBlur(blur))).astype(np.float32) / 255
        ys = np.clip((np.arange(H) - y0) / (y1 - y0), 0, 1)[:, None]
        return m * (a0 + (a1 - a0) * ys)
    def ell(cx, cy, rx, ry, a, blur):
        m = Image.new('L', (W, H), 0); ImageDraw.Draw(m).ellipse([cx - rx, cy - ry, cx + rx, cy + ry], fill=255)
        return np.asarray(m.filter(ImageFilter.GaussianBlur(blur))).astype(np.float32) / 255 * a
    A = cone((690, 268), (912, 268), (300, 1040), (1300, 1040), 268, 1040, 0.34, 0.26, 12)
    A = np.maximum(A, cone((718, 362), (884, 362), (400, 1050), (1200, 1050), 362, 1050, 0.20, 0.10, 12))
    A = np.maximum(A, ell(800, 950, 560, 120, 0.40, 30))
    warm = np.array([1.0, 0.58, 0.30])
    lum = base.mean(axis=2, keepdims=True)
    out = base * (1 - A[..., None]) + (warm * (0.55 + 0.6 * lum)) * A[..., None]   # a warm translucent wash; detail shows through
    Image.fromarray((np.clip(out, 0, 1) * 255).astype(np.uint8)).save(f'{OUT}/{BID}-bloom.webp', quality=88)
import shutil; shutil.rmtree(TMP); print('ok', len(os.listdir(OUT)))
