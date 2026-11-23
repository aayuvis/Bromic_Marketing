"""System banner L1: one calm light band under the scene (owner, 23 Nov 2026: "make banner all white and smaller", "make the banner
light gray", "make the text of heat, recess, control bigger on all banners", "make recess heaters white").
One light grey band (#ECEBE8) about 19% of the scene height, the same across the whole width: the Bromic logo, a small Didot line
and a fine flame rule at the left; then 01 HEAT, 02 RECESS and 03 CONTROL in large spaced capitals over the heater (shown about 2x,
its logo end filling the tile), the empty low-clearance recess kit and the Affinity 2-channel dimmer (bromic.com photo). Tiles take
the scene's finish. The edge contrast of the CAD products against the band is measured and printed (target 3:1 for black).
Usage:  python3 decks/build-system-banner-light.py SCENE.jpg FINISH OUT.jpg [--thumb THUMB.webp]"""
import os, argparse, importlib.util
import numpy as np
from PIL import Image, ImageDraw

HERE = os.path.dirname(os.path.abspath(__file__))
_s = importlib.util.spec_from_file_location('av', os.path.join(HERE, 'build-system-banner-a-variants.py'))
A = importlib.util.module_from_spec(_s); _s.loader.exec_module(A)
O = A.O
F, fit, spaced, centred, DIDOT, SANS, FLAME, MINW = O.F, O.fit, O.spaced, O.centred, O.DIDOT, O.SANS, O.FLAME, O.MINW
BAND = (236, 235, 232); INK = (35, 31, 32); GREY = (110, 106, 102)
NAMES = ['Tungsten Smart-Heat® Electric', 'Low-Clearance Recess Kit', 'Affinity Smart-Heat® Dimmer, 2-Channel']
STEPS = [('01', 'HEAT'), ('02', 'RECESS'), ('03', 'CONTROL')]


def heater_zoom(im):
    """The heater about 2x: its logo end and the near half of its length, upright logo, the cut end faded out along the axis."""
    im = im.rotate(16, resample=Image.BICUBIC, expand=True); im = O.trim(im)
    w, h = im.size; c = im.crop((0, int(h * 0.36), int(w * 0.58), h))
    a = np.array(c).astype(float); H_, W_ = a.shape[:2]
    yy, xx = np.mgrid[0:H_, 0:W_]
    ax = np.array([1.0, -H_ / W_]); ax /= np.linalg.norm(ax)            # from the logo end (lower left) toward the far end
    p = (xx * ax[0] + (yy - H_) * ax[1]); p = p / p.max()
    fade = np.clip((0.97 - p) / 0.22, 0, 1); fade = fade * fade * (3 - 2 * fade)
    a[..., 3] *= fade; return O.trim(Image.fromarray(a.astype(np.uint8), 'RGBA'))


def build(scene, finish, out, thumb=None):
    sc = Image.open(scene).convert('RGB')
    if sc.width < MINW: sc = sc.resize((MINW, round(sc.height * MINW / sc.width)), Image.LANCZOS)
    W, H = sc.size; u = W / 3840; bh = round(H * 0.19); y0 = H
    im = Image.new('RGB', (W, H + bh), BAND); im.paste(sc, (0, 0)); d = ImageDraw.Draw(im)
    m = round(150 * u)
    logo = fit(Image.open(os.path.join(HERE, 'img', 'logo.png')).convert('RGBA'), round(330 * u), round(100 * u))
    im.paste(logo, (m, y0 + round(78 * u)), logo)
    d.text((m, y0 + round(232 * u)), 'The Complete Recessed System', font=F(DIDOT, 58 * u), fill=INK)
    d.rectangle((m, y0 + round(338 * u), m + round(100 * u), y0 + round(341 * u)), fill=FLAME)
    a0, a1 = round(1250 * u), W - round(100 * u); cw = (a1 - a0) / 3
    prods = O.products(finish); prods[0] = heater_zoom(prods[0])
    fl, fn = F(SANS, 50 * u), F(SANS, 28 * u)
    rep = []
    for i, (p, (n, step), name) in enumerate(zip(prods, STEPS, NAMES)):
        cx = a0 + cw * (i + 0.5)
        if i: d.rectangle((round(a0 + cw * i), y0 + round(70 * u), round(a0 + cw * i) + max(1, round(1.5 * u)), y0 + bh - round(70 * u)), fill=(208, 205, 200))
        w = spaced(d, (cx, y0 + round(38 * u)), f'{n}  {step}', fl, INK, round(9 * u), 'm')
        spaced(d, (cx - w / 2, y0 + round(38 * u)), n, fl, FLAME, round(9 * u))
        top, bot = y0 + round(112 * u), y0 + round(418 * u)
        t = fit(p, round(cw * (0.96 if i == 0 else 0.74)), bot - top)
        x, y = round(cx - t.width / 2), bot - t.height
        A.place(im, t, x, y, u, bot, shadow=(70, 62, 54), strength=0.5)
        if i < 2: rep.append(round(A.contrast(im, t, x, y, u), 2))
        centred(d, cx, y0 + round(432 * u), name, fn, GREY)
    im.save(out, quality=92, subsampling=0, optimize=True)
    if thumb:
        tt = im.copy(); tt.thumbnail((900, 900), Image.LANCZOS); tt.save(thumb, quality=82, method=6)
    return im.size, rep


if __name__ == '__main__':
    ap = argparse.ArgumentParser(); ap.add_argument('scene'); ap.add_argument('finish', choices=['black', 'graphite', 'white'])
    ap.add_argument('out'); ap.add_argument('--thumb')
    a = ap.parse_args(); print(*build(a.scene, a.finish, a.out, a.thumb))
