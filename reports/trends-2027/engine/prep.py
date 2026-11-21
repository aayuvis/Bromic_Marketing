"""Prepare a 2027 trend report's images: photos, sketch renderings and sketch-to-photo splits, from <id>/content.py.
Run from the repo root: python3 reports/trends-2027/engine/prep.py <id>"""
import os, sys, cv2, numpy as np
from PIL import Image
sys.path.insert(0, os.path.dirname(__file__))
from sketch import sketch
import importlib.util
RID = sys.argv[1]
_s = importlib.util.spec_from_file_location('c', f'reports/trends-2027/{RID}/content.py'); C = importlib.util.module_from_spec(_s); _s.loader.exec_module(C)
OUT = f'reports/trends-2027/{RID}/img'; os.makedirs(OUT, exist_ok=True)
TMP = OUT + '/_tmp'; os.makedirs(TMP, exist_ok=True)
def src(i):
    return f'images/review/full/{i}.jpg' if i.startswith('ts2-') else f'images/library/{i}.webp'
def png(i):
    p = f'{TMP}/{i}.png'
    if not os.path.exists(p): Image.open(src(i)).convert('RGB').save(p)
    return p
def save(arr_bgr, name):
    Image.fromarray(cv2.cvtColor(arr_bgr, cv2.COLOR_BGR2RGB)).save(f'{OUT}/{name}.webp', quality=84)
PHOTOS, SKETCH, SPLIT = C.PHOTOS, C.SKETCH, C.SPLIT
for i in PHOTOS:
    if os.path.exists(f'{OUT}/{i}.webp'): continue
    im = Image.open(src(i)).convert('RGB'); im.thumbnail((2000, 2000)); im.save(f'{OUT}/{i}.webp', quality=86)
for i in SKETCH:
    if os.path.exists(f'{OUT}/{i}-sketch.webp'): continue
    o = f'{TMP}/{i}-sk.jpg'; sketch(png(i), o); save(cv2.imread(o), f'{i}-sketch')
for i in SPLIT:
    if os.path.exists(f'{OUT}/{i}-split.webp'): continue
    o = f'{TMP}/{i}-sk.jpg'; sketch(png(i), o)
    sk = cv2.imread(o).astype(np.float32); ph = cv2.imread(png(i)).astype(np.float32)
    h, w = ph.shape[:2]
    # ragged pencil edge, slightly diagonal, sketch on the left, photo on the right
    rng = np.random.default_rng(7); ys = np.arange(h)
    edge = (0.46 * w + (ys / h - 0.5) * 0.10 * w + np.convolve(rng.normal(0, 9, h), np.ones(25) / 25, 'same')).astype(np.float32)
    xs = np.arange(w)[None, :].astype(np.float32)
    m = np.clip((xs - edge[:, None]) / 18 + 0.5, 0, 1)
    out = sk * (1 - m[..., None]) + ph * m[..., None]
    line = (np.abs(xs - edge[:, None]) < 1.6).astype(np.float32) * 0.6
    out = out * (1 - line[..., None]) + np.array([35, 65, 239], np.float32) * line[..., None]
    save(out.astype(np.uint8), f'{i}-split')
import shutil; shutil.rmtree(TMP)
print('ok', len(os.listdir(OUT)))
