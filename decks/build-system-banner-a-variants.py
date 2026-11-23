"""Option A of the system banner, reworked so black products read (owner, 23 Nov 2026: "give me more options like A but black
heaters on black not visible"). Same layout and type as option A in build-system-banner-options.py; four ways of lighting it:
  a2  deep warm charcoal band with a soft vertical gradient and a soft backlight behind each product
  a3  ink band, each product in a warm-grey spotlight pool, with a rim light on the CAD housings
  a4  split tone: ink block for the words at the left, a warm stone panel for the products at the right, joined by a flame rule
  a5  gradient floor: ink at the top to mid warm grey at the bottom, products standing on the light floor with a reflection
Every product's edge contrast (housing just inside the silhouette against the background just outside) is measured and printed;
the target is 3:1 or more.
Usage:  python3 decks/build-system-banner-a-variants.py SCENE.jpg FINISH VARIANT(a2|a3|a4|a5) OUT.jpg [--thumb THUMB.webp]"""
import os, sys, argparse, importlib.util
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageChops

HERE = os.path.dirname(os.path.abspath(__file__))
_s = importlib.util.spec_from_file_location('opts', os.path.join(HERE, 'build-system-banner-options.py'))
O = importlib.util.module_from_spec(_s); _s.loader.exec_module(O)
F, fit, spaced, centred, products, STEPS, DIDOT, SANS, FLAME, MINW = O.F, O.fit, O.spaced, O.centred, O.products, O.STEPS, O.DIDOT, O.SANS, O.FLAME, O.MINW
INK = (29, 29, 31); WHITE = (245, 243, 240)


def lum(rgb):
    c = np.asarray(rgb, float) / 255; c = np.where(c <= 0.04045, c / 12.92, ((c + 0.055) / 1.055) ** 2.4)
    return c @ np.array([0.2126, 0.7152, 0.0722])


def vgrad(W, h, top, bottom):
    t = np.linspace(0, 1, h)[:, None, None]; t = t * t * (3 - 2 * t)
    a = (np.array(top)[None, None] * (1 - t) + np.array(bottom)[None, None] * t) * np.ones((1, W, 1))
    return Image.fromarray(a.astype(np.uint8), 'RGB')


def glow(out, cx, cy, rw, rh, col, peak, u):
    """An elliptical pool of light (a background change only), centred on cx, cy."""
    pad = round(160 * u); m = Image.new('L', (2 * rw + 2 * pad, 2 * rh + 2 * pad), 0)
    ImageDraw.Draw(m).ellipse((pad, pad, pad + 2 * rw, pad + 2 * rh), fill=peak)
    out.paste(col, (round(cx - rw - pad), round(cy - rh - pad)), m.filter(ImageFilter.GaussianBlur(round(110 * u))))


def backlight(out, im, x, y, col, strength, r):
    """Soft light just outside the silhouette (a backlight on the background), so a dark edge separates from a dark band."""
    pd = 4 * r; a = Image.new('L', (im.width + 2 * pd, im.height + 2 * pd), 0); a.paste(im.getchannel('A'), (pd, pd))
    out.paste(col, (x - pd, y - pd), a.filter(ImageFilter.MaxFilter(2 * (r // 2) + 1)).filter(ImageFilter.GaussianBlur(r)).point(lambda v: round(v * strength)))


def rim(im, u, col=(205, 200, 194), amount=0.55):
    """Rim light on a CAD housing: lightens a thin band just inside the silhouette, strongest on the upper edges."""
    a = im.getchannel('A'); w = max(2, round(4 * u))
    inner = ImageChops.subtract(a, a.filter(ImageFilter.MinFilter(2 * w + 1))).filter(ImageFilter.GaussianBlur(max(1, w // 2)))
    top = Image.linear_gradient('L').resize(im.size).point(lambda v: round(255 - v * 0.6))   # light from above
    m = ImageChops.multiply(inner, top).point(lambda v: round(v * amount))
    lit = Image.composite(Image.new('RGBA', im.size, (*col, 255)), im, m); lit.putalpha(a); return lit


def place(out, im, x, y, u, floor, shadow=(0, 0, 0), strength=0.6, reflect=0.0):
    O.place(out, im, x, y, u, shadow=shadow, strength=strength, reflect=reflect, floor=floor)


def contrast(out, im, x, y, u):
    """Edge contrast: housing pixels just inside the silhouette (the darker half) against the background just outside."""
    a = np.array(im.getchannel('A')) > 200; w = max(3, round(6 * u))
    A = Image.fromarray((a * 255).astype(np.uint8))
    inn = a & ~(np.array(A.filter(ImageFilter.MinFilter(2 * w + 1))) > 0)
    outer = (np.array(A.filter(ImageFilter.MaxFilter(4 * w + 1))) > 0) & ~(np.array(A.filter(ImageFilter.MaxFilter(2 * w + 1))) > 0)
    crop = np.array(out.crop((x, y, x + im.width, y + im.height))).astype(float)
    li = lum(crop[inn]); lo = lum(crop[outer])
    li = np.sort(li)[: max(1, len(li) // 2)]   # the darker half of the edge: the housing, not the grille glow
    hi_, lo_ = max(np.median(lo), np.median(li)), min(np.median(lo), np.median(li))
    return (hi_ + 0.05) / (lo_ + 0.05)


def build_variant(sc, finish, v):
    W, H = sc.size; u = W / 3840; bh = round(H * 0.38); y0 = H
    if v == 'a2': band = vgrad(W, bh, (43, 42, 41), (58, 56, 54))
    elif v == 'a5': band = vgrad(W, bh, (29, 29, 31), (176, 169, 160))
    else: band = Image.new('RGB', (W, bh), INK)
    out = Image.new('RGB', (W, H + bh)); out.paste(sc, (0, 0)); out.paste(band, (0, y0))
    g = round(H * 0.16); top = band.getpixel((0, 0))
    grad = Image.linear_gradient('L').resize((W, g)).point(lambda q: round(255 * (lambda t: t * t * (3 - 2 * t))(q / 255)))
    out.paste(top, (0, H - g), grad)
    m = round(170 * u); a0, a1 = round(1380 * u), W - round(130 * u)
    stone = (226, 219, 209)
    if v == 'a4':   # the products' panel: warm stone from just right of the words to the edge, a fine flame rule at the join
        px = a0 - round(60 * u)
        out.paste(vgrad(W - px, bh, (233, 227, 219), (219, 211, 200)), (px, y0))
        sg = Image.linear_gradient('L').resize((W - px, g)).point(lambda q: round(255 * (lambda t: t * t * (3 - 2 * t))(q / 255)))
        out.paste((233, 227, 219), (px, H - g), sg)
        ImageDraw.Draw(out).rectangle((px, y0 + round(120 * u), px + max(2, round(4 * u)) - 1, y0 + bh - round(120 * u)), fill=FLAME)
        a0 = px + round(80 * u)
    d = ImageDraw.Draw(out)
    logo = Image.open(os.path.join(HERE, 'img', 'logo-white.png')).convert('RGBA'); logo = fit(logo, round(400 * u), round(130 * u))
    out.paste(logo, (m, y0 + round(150 * u)), logo)
    fd = F(DIDOT, 118 * u)
    d.text((m, y0 + round(380 * u)), 'The Complete', font=fd, fill=WHITE)
    d.text((m, y0 + round(510 * u)), 'Recessed System', font=fd, fill=WHITE)
    d.rectangle((m, y0 + round(700 * u), m + round(110 * u), y0 + round(705 * u)), fill=FLAME)
    sub = (205, 200, 194) if v == 'a5' else (170, 168, 165)
    spaced(d, (m, y0 + round(745 * u)), 'TUNGSTEN SMART-HEAT® ELECTRIC SERIES II', F(SANS, 26 * u), sub, round(5 * u))
    cw = (a1 - a0) / 3
    fl, fn, fs = F(SANS, 30 * u), F(SANS, 36 * u), F(SANS, 28 * u)
    light = v == 'a4'
    head = INK if light else (235, 233, 230); namec = INK if light else WHITE
    factc = (98, 92, 86) if light else ((60, 57, 54) if v == 'a5' else (150, 148, 145))
    if v == 'a5': namec = INK   # step labels stay light on the dark top of the floor; names sit on the light bottom
    divc = (196, 188, 178) if light else ((62, 62, 64) if v != 'a2' else (80, 78, 76))
    report = []
    for i, (im, (n, step, name, fact)) in enumerate(zip(products(finish), STEPS)):
        cx = a0 + cw * (i + 0.5); cad = i < 2
        if i and v != 'a5': d.rectangle((round(a0 + cw * i), y0 + round(170 * u), round(a0 + cw * i) + max(1, round(1.5 * u)), y0 + bh - round(170 * u)), fill=divc)
        w = spaced(d, (cx, y0 + round(150 * u)), f'{n}   {step.upper()}', fl, head, round(6 * u), 'm')
        spaced(d, (cx - w / 2, y0 + round(150 * u)), n, fl, FLAME, round(6 * u))
        t = fit(im, round(cw * 0.86), round(420 * u)); floor = y0 + round(640 * u)
        x, y = round(cx - t.width / 2), floor - t.height
        if v == 'a2':
            glow(out, cx, floor - t.height / 2, round(cw * 0.42), round(230 * u), (98, 94, 90), 150, u)
            if cad and finish != 'white': backlight(out, t, x, y, (196, 190, 182), 1.0, round(30 * u))
            place(out, t, x, y, u, floor, strength=0.7)
        elif v == 'a3':
            glow(out, cx, floor - t.height / 2, round(cw * 0.46), round(250 * u), (128, 122, 115), 255, u)
            if cad and finish != 'white': backlight(out, t, x, y, (214, 208, 200), 1.0, round(30 * u)); t = rim(t, u)
            place(out, t, x, y, u, floor, strength=0.8, reflect=0.12)
        elif v == 'a4':
            place(out, t, x, y, u, floor, shadow=(70, 60, 50), strength=0.6)
        else:   # a5
            if cad and finish != 'white': backlight(out, t, x, y, (200, 194, 186), 1.0, round(18 * u))
            place(out, t, x, y, u, floor, shadow=(40, 35, 30), strength=0.6, reflect=0.16)
        report.append((name, round(contrast(out, t, x, y, u), 2)))
        centred(d, cx, y0 + round(745 * u), name, fn, namec)
        centred(d, cx, y0 + round(800 * u), fact, fs, factc)
    return out, report


if __name__ == '__main__':
    ap = argparse.ArgumentParser(); ap.add_argument('scene'); ap.add_argument('finish', choices=['black', 'graphite', 'white'])
    ap.add_argument('variant', choices=['a2', 'a3', 'a4', 'a5']); ap.add_argument('out'); ap.add_argument('--thumb')
    a = ap.parse_args()
    sc = Image.open(a.scene).convert('RGB')
    if sc.width < MINW: sc = sc.resize((MINW, round(sc.height * MINW / sc.width)), Image.LANCZOS)
    im, rep = build_variant(sc, a.finish, a.variant)
    im.save(a.out, quality=92, subsampling=0, optimize=True)
    if a.thumb:
        t = im.copy(); t.thumbnail((900, 900), Image.LANCZOS); t.save(a.thumb, quality=82, method=6)
    print(im.size, rep)
