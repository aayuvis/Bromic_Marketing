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


def light_edge(out, im, x, y, u):
    """Edge contrast for a white product: its face just inside the silhouette (median) against the edge just outside it (1-6 px)."""
    from PIL import ImageFilter
    a = np.array(im.getchannel('A')) > 200; A_ = Image.fromarray((a * 255).astype(np.uint8)); k = max(2, round(3 * u))
    inn = (np.array(A_.filter(ImageFilter.MinFilter(3))) > 0) & ~(np.array(A_.filter(ImageFilter.MinFilter(4 * k + 1))) > 0)
    outer = (np.array(A_.filter(ImageFilter.MaxFilter(4 * k + 1))) > 0) & ~a
    crop = np.array(out.crop((x, y, x + im.width, y + im.height))).astype(float)
    li, lo = np.median(A.lum(crop[inn])), np.median(A.lum(crop[outer]))
    return (max(li, lo) + 0.05) / (min(li, lo) + 0.05)


# the four designs (owner, 23 Nov 2026: "you can still use different designs of banners but core principles apply")
DESIGNS = {
    'L1': dict(band=(236, 235, 232), white_band=(217, 215, 211), ink=INK, name=GREY, rule=(208, 205, 200), logo='logo.png'),     # light grey
    'L2': dict(band=(250, 248, 244), ink=INK, name=GREY, rule=(214, 209, 202), logo='logo.png', frame=(205, 199, 191)),          # warm white, hairline frame
    'L3': dict(band=(46, 44, 42), ink=(245, 243, 240), name=(176, 172, 166), rule=(78, 75, 72), logo='logo-white.png', spot=True),  # deep warm charcoal, spotlit
    'L4': dict(band=(228, 221, 211), ink=INK, name=(104, 96, 88), rule=(204, 196, 186), logo='logo.png', plinth=True),           # light stone, plinth row
}


def build(scene, finish, out, thumb=None, design='L1'):
    from PIL import ImageFilter, ImageChops
    D = DESIGNS[design]
    sc = Image.open(scene).convert('RGB')
    if sc.width < MINW: sc = sc.resize((MINW, round(sc.height * MINW / sc.width)), Image.LANCZOS)
    W, H = sc.size; u = W / 3840; bh = round(H * 0.19); y0 = H
    band = D.get('white_band', D['band']) if finish == 'white' else D['band']
    im = Image.new('RGB', (W, H + bh), band); im.paste(sc, (0, 0)); d = ImageDraw.Draw(im)
    if D.get('frame'):   # a hairline frame inset in the band
        fm = round(14 * u); d.rectangle((fm, y0 + fm, W - fm, y0 + bh - fm), outline=D['frame'], width=max(1, round(2 * u)))
    edge = finish == 'white' and not D.get('spot')   # white products on a light band get a defined edge
    m = round(150 * u)
    logo = fit(Image.open(os.path.join(HERE, 'img', D['logo'])).convert('RGBA'), round(330 * u), round(100 * u))
    im.paste(logo, (m, y0 + round(78 * u)), logo)
    d.text((m, y0 + round(232 * u)), 'The Complete Recessed System', font=F(DIDOT, 58 * u), fill=D['ink'])
    d.rectangle((m, y0 + round(338 * u), m + round(100 * u), y0 + round(341 * u)), fill=FLAME)
    a0, a1 = round(1250 * u), W - round(100 * u); cw = (a1 - a0) / 3
    prods = O.products(finish); prods[0] = heater_zoom(prods[0])
    fl, fn = F(SANS, 50 * u), F(SANS, 28 * u)
    rep = []
    for i, (p, (n, step), name) in enumerate(zip(prods, STEPS, NAMES)):
        cx = a0 + cw * (i + 0.5)
        if i: d.rectangle((round(a0 + cw * i), y0 + round(70 * u), round(a0 + cw * i) + max(1, round(1.5 * u)), y0 + bh - round(70 * u)), fill=D['rule'])
        top, bot = y0 + round(112 * u), y0 + round((400 if D.get('plinth') else 418) * u)
        if D.get('spot'):
            A.glow(im, cx, (top + bot) / 2, round(cw * 0.40), round(150 * u), (120, 115, 108), 200, u)
        if D.get('plinth'):
            pw, ph = round(cw * 0.80), round(18 * u); px = round(cx - pw / 2)
            sh = Image.new('L', (pw + 120, ph + 120), 0); ImageDraw.Draw(sh).rounded_rectangle((60, 66, 60 + pw, 66 + ph), radius=round(8 * u), fill=60)
            im.paste((110, 96, 82), (px - 60, bot - 60), sh.filter(ImageFilter.GaussianBlur(round(14 * u))))
            d.rounded_rectangle((px, bot, px + pw, bot + ph), radius=round(8 * u), fill=(240, 236, 230))
        w = spaced(d, (cx, y0 + round(38 * u)), f'{n}  {step}', fl, D['ink'], round(9 * u), 'm')
        spaced(d, (cx - w / 2, y0 + round(38 * u)), n, fl, FLAME, round(9 * u))
        t = fit(p, round(cw * (0.96 if i == 0 else 0.74)), bot - top)
        x, y = round(cx - t.width / 2), bot - t.height
        if edge and i < 2: A.backlight(im, t, x, y, (70, 66, 62) if D.get('plinth') else (78, 74, 69), 1.0, max(4, round(10 * u)))
        A.place(im, t, x, y, u, bot, shadow=(0, 0, 0) if D.get('spot') else (70, 62, 54), strength=0.5)
        if edge and i < 2:
            a_ = t.getchannel('A'); ring = ImageChops.subtract(a_.filter(ImageFilter.MaxFilter(2 * max(1, round(1.5 * u)) + 1)), a_)
            im.paste((72, 68, 64) if D.get('plinth') else (84, 79, 74), (x, y), ring)
        if i < 2: rep.append(round(A.contrast(im, t, x, y, u) if finish != 'white' else light_edge(im, t, x, y, u), 2))
        centred(d, cx, y0 + round(432 * u), name, fn, D['name'])
    im.save(out, quality=92, subsampling=0, optimize=True)
    if thumb:
        tt = im.copy(); tt.thumbnail((900, 900), Image.LANCZOS); tt.save(thumb, quality=82, method=6)
    return im.size, rep


if __name__ == '__main__':
    ap = argparse.ArgumentParser(); ap.add_argument('scene'); ap.add_argument('finish', choices=['black', 'graphite', 'white'])
    ap.add_argument('out'); ap.add_argument('--thumb'); ap.add_argument('--design', default='L1', choices=sorted(DESIGNS))
    a = ap.parse_args(); print(*build(a.scene, a.finish, a.out, a.thumb, a.design))
